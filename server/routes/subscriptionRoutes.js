const express = require("express");
const router = express.Router();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const User = require("../lib/init").mongoose.model("user");
const auth = require("../lib/middleware").auth;
const messages = require("../config/messages");
const plans = require("../config/plans");

const createCheckoutSession = async (req, res, next) => {
  try {
    const sessionParams = {
      payment_method_types: ["card"],
      line_items: [
        {
          price: process.env.STRIPE_PRICE_ID,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${process.env.CLIENT_URL}/profile?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/plans`,
    };
    if (req.user.subscription?.stripeCustomerId) {
      sessionParams.customer = req.user.subscription.stripeCustomerId;
    } else {
      sessionParams.customer_email = req.user.email;
    }

    const session = await stripe.checkout.sessions.create(sessionParams);

    res.json({ url: session.url });
  } catch (e) {
    return next(e);
  }
};

const handleStripeWebhook = async (req, res, next) => {
  const sig = req.headers["stripe-signature"];
  const rawBody = req.body;
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (e) {
    return next(e);
  }

  switch (event.type) {
    case "checkout.session.completed":
      const session = event.data.object;
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + 1);
      try {
        // Find user by email or Stripe customer ID
        let userQuery = {};
        if (session.customer_email) {
          userQuery = { email: session.customer_email };
        } else if (session.customer) {
          userQuery = { "subscription.stripeCustomerId": session.customer };
        }

        await User.findOneAndUpdate(userQuery, {
          subscription: {
            type: "paid",
            status: "active",
            startDate: new Date(),
            endDate: endDate,
            stripeCustomerId: session.customer,
            stripeSubscriptionId: session.subscription,
          },
        });
      } catch (e) {
        return next(e);
      }
      break;

    case "invoice.payment_failed":
      const failedInvoice = event.data.object;
      try {
        await User.findOneAndUpdate(
          { "subscription.stripeCustomerId": failedInvoice.customer },
          {
            subscription: {
              type: "free",
              status: "active",
              startDate: new Date(),
              stripeCustomerId: failedInvoice.customer,
            },
          }
        );
      } catch (e) {
        return next(e);
      }
      break;

    case "customer.subscription.deleted":
      const subscription = event.data.object;
      try {
        await User.findOneAndUpdate(
          { "subscription.stripeSubscriptionId": subscription.id },
          {
            subscription: {
              type: "free",
              status: "active",
              startDate: new Date(),
              stripeCustomerId: subscription.customer,
              autoRenew: false,
            },
          }
        );
      } catch (error) {}
      break;

    default:
      break;
  }

  res.json({ received: true });
};

const cancelSubscription = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) throw new Error(process.env.ERR_NO_USER);

    let updatedSubscription = null;

    if (user.subscription?.stripeSubscriptionId) {
      updatedSubscription = await stripe.subscriptions.update(
        user.subscription.stripeSubscriptionId,
        { cancel_at_period_end: true }
      );

      const subscription = await stripe.subscriptions.retrieve(
        user.subscription.stripeSubscriptionId
      );

      let endDate;
      if (subscription && subscription.current_period_end) {
        endDate = new Date(subscription.current_period_end * 1000);
      } else {
        endDate = new Date();
        endDate.setMonth(endDate.getMonth() + 1);
      }

      // Keep the current subscription active until the end date
      user.subscription = {
        type: user.subscription.type,
        status: user.subscription.status || "active",
        startDate: user.subscription.startDate,
        endDate: endDate,
        willCancelAtPeriodEnd: true,
        stripeCustomerId: user.subscription.stripeCustomerId,
        stripeSubscriptionId: user.subscription.stripeSubscriptionId,
        autoRenew: false,
      };
    } else {
      user.subscription = {
        type: "free",
        status: "active",
        startDate: new Date(),
        stripeCustomerId: user.subscription?.stripeCustomerId,
        autoRenew: false,
      };
    }

    await user.save();
    const updatedUser = await User.findById(req.user._id);
    return res.json({
      status: "success",
      data: { user: updatedUser.toJSON() },
      message: messages.info.subscriptionCanceled,
    });
  } catch (e) {
    return next(e);
  }
};

const getPlanDetails = async (req, res, next) => {
  try {
    const formattedPlans = Object.values(plans)
      .filter((plan) => plan.isActive)
      .map((plan) => ({
        name: plan.name,
        price: plan.price,
        interval: plan.interval,
        features: plan.features,
      }));
    return res.json({
      status: "success",
      data: formattedPlans,
    });
  } catch (e) {
    return next(e);
  }
};

router.get("/checkout", auth, createCheckoutSession);

router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  handleStripeWebhook
);

router.get("/plans", getPlanDetails);
router.get("/cancel", auth, cancelSubscription);

module.exports = router;
