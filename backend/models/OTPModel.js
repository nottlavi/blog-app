const mongoose = require("mongoose");

const OTPSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  OTP: {
    type: String,
    required: true,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  role: {
    type: String,
  },
  password: {
    type: String,
  },
});

const OTPModel = mongoose.model("OTPModel", OTPSchema);
module.exports = OTPModel;
