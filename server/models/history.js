const mongoose = require("mongoose");

const historySchema = new mongoose.Schema(
  {
    itemId: { type: mongoose.Schema.Types.ObjectId, required: true },
    itemType: { type: String, enum: mongoose.modelNames(), required: true },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    changes: [
      {
        field: String,
        oldValue: mongoose.Schema.Types.Mixed,
        newValue: mongoose.Schema.Types.Mixed,
      },
    ],
  },
  { timestamps: { createdAt: "added", updatedAt: "updated" } }
);

mongoose.model("History", historySchema);
