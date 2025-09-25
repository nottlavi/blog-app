const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
  blogTitle: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "userModel",
    required: true,
  },
  blogDescription: {
    type: String,
  },
  blogBody: {
    type: String,
    required: true,
  },
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "userModel",
    },
  ],
  replies: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "replyModel",
    },
  ],
  image: {
    type: String,
  },
});

const blogModel = mongoose.model("blogModel", blogSchema);
module.exports = blogModel;
