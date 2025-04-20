module.exports = {
  free: {
    name: "free",
    price: 0,
    interval: "month",
    features: ["Basic features"],
    limits: {
      items: 5,
    },
    isActive: true,
  },
  paid: {
    name: "paid",
    price: 5,
    interval: "month",
    features: ["Advanced features", "... and more"],
    limits: {
      items: -1,
    },
    isActive: true,
  },
};
