const express = require("express");
const router = express.Router();

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
      message: process.env.INFO_ITEM_CREATED,
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
    if (!item) throw new Error(process.env.ERR_NO_ITEM);
    res.json({
      status: "success",
      data: { item },
      message: process.env.INFO_ITEM_DELETED,
    });
  } catch (e) {
    return next(e);
  }
};

const updateItem = async (req, res, next) => {
  try {
    const item = await req.Item.findOne({ _id: req.params.id });
    if (!item) throw new Error(process.env.ERR_NO_ITEM);
    await item.updateOne(req.body);
    return res.json({
      status: "success",
      data: { item },
      message: process.env.INFO_ITEM_SAVED,
    });
  } catch (e) {
    return next(e);
  }
};

const getItem = async (req, res, next) => {
  try {
    const item = await req.Item.findOne({ _id: req.params.id });
    if (!item) throw new Error(process.env.ERR_NO_ITEM);
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
