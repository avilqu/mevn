const express = require("express");
const router = express.Router();

const messages = require("../lib/messages");
const { auth, checkMongoId } = require("../lib/middleware");

const modelLoader = (req, res, next) => {
  req.Item = require("../lib/init").mongoose.model(req.params.model);
  next();
};

const createItem = async (req, res, next) => {
  try {
    const item = new req.Item(req.body);
    item.creatorId = req.user._id;
    await item.save();
    return res.json({
      status: "success",
      data: { item },
      message: messages.info.itemCreated,
    });
  } catch (e) {
    return next(e);
  }
};

const deleteItem = async (req, res, next) => {
  try {
    const item = await req.Item.findOneAndDelete({
      _id: req.params.id,
    });
    if (!item) throw new Error(messages.errors.noItem);
    res.json({
      status: "success",
      data: { item },
      message: messages.info.itemDeleted,
    });
  } catch (e) {
    return next(e);
  }
};

const updateItem = async (req, res, next) => {
  try {
    const item = await req.Item.findOne({ _id: req.params.id });
    if (!item) throw new Error(messages.errors.noItem);
    const oldValues = { ...item.toObject() };
    const modelSchema = req.Item.schema.paths;
    await item.updateOne(req.body);
    const History = require("../lib/init").mongoose.model("History");
    const changes = [];
    for (const key in req.body) {
      if (modelSchema[key]) {
        const oldValue =
          oldValues[key] instanceof Date
            ? oldValues[key].toISOString()
            : String(oldValues[key]);
        const newValue = String(req.body[key]);
        if (oldValue !== newValue) {
          changes.push({
            field: key,
            oldValue: oldValues[key],
            newValue: req.body[key],
          });
        }
      }
    }
    if (changes.length > 1) {
      const historyEntry = new History({
        itemId: item._id,
        itemType: req.params.model,
        userId: req.user._id,
        changes: changes,
      });
      await historyEntry.save();
    }
    return res.json({
      status: "success",
      data: { item },
      message: messages.info.itemSaved,
    });
  } catch (e) {
    return next(e);
  }
};

const getItem = async (req, res, next) => {
  try {
    const item = await req.Item.findOne({ _id: req.params.id });
    if (!item) throw new Error(messages.errors.noItem);
    res.json({
      status: "success",
      data: { item },
    });
  } catch (e) {
    return next(e);
  }
};

const getItemList = async (req, res, next) => {
  try {
    const items = await req.Item.find();
    res.json({
      status: "success",
      data: { items },
    });
  } catch (e) {
    return next(e);
  }
};

router.post("/:model/create", auth, modelLoader, createItem);
router.get("/:model/list", auth, modelLoader, getItemList);
router.get("/:model/:id/delete", auth, checkMongoId, modelLoader, deleteItem);
router.post("/:model/:id/update", auth, checkMongoId, modelLoader, updateItem);
router.get("/:model/:id", auth, checkMongoId, modelLoader, getItem);

module.exports = router;
