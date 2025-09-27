const mongoose = require("mongoose");

const replySchema = new mongoose.Schema({
  replyBody: {
    type: String,
    required: true,
  },
  replyTime: {
    type: Date,
    required: true,
  },
  onBlogId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "blogModel",
  },
  replyOwnerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "userModel",
    required: true,
  },
  replies: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "replyModel",
    },
  ],
});

const replyModel = mongoose.model("replyModel", replySchema);
module.exports = replyModel;
