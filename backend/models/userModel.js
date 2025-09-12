const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  blogs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "blogModel",
    },
  ],
  role: {
    type: String,
    required: true,
    enum: ["Creator", "Reader"],
  },
});

const userModel = mongoose.model("userModel", userSchema);
module.exports = userModel;
