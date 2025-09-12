const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const { sendMail } = require("../services/sendMail");
const OTPModel = require("../models/OTPModel");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const jwtSecret = process.env.JWT_SECRET;

exports.signup = async (req, res) => {
  try {
    // fetching and checking if all the input fields are filled
    const { email, password, confirmPassword, firstName, lastName, role } =
      req.body;

    if (
      !email ||
      !password ||
      !confirmPassword ||
      !firstName ||
      !lastName ||
      !role
    ) {
      return res.status(400).json({
        success: false,
        message: "all the fields are required",
      });
    }

    //finding and returning response if user already exists
    const existingUser = await userModel.findOne({ email: email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "the user already exists",
      });
    }

    //checking if both the entered passwords match
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "entered password and confirm password do not match",
      });
    }

    //encrypting the password here
    const hashedPassword = await bcrypt.hash(password, 16);

    //creating the otp here
    const OTP = crypto.randomInt(100000, 999999).toString();
    //sending the mail here
    const isMailSent = await sendMail(email, "here is your otp", OTP, "");

    if (isMailSent) {
      //deleting a otp model with this email, so that only one otp exists in the db for one email
      await OTPModel.deleteOne({});
      const newOTPModel = await OTPModel.create({
        email: email,
        OTP: OTP,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000),
        firstName: firstName,
        lastName: lastName,
        role: role,
        password: hashedPassword,
      });
      return res.status(200).json({
        success: true,
        message: `otp sent to ${email} with following details`,
        data: newOTPModel,
      });
    }
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.verifyEmail = async (req, res) => {
  try {
    //fetching and verifying if all the details are filled
    const { email, OTP } = req.body;
    if (!email || !OTP) {
      return res.status(400).json({
        success: false,
        message: "all fields are mandatory",
      });
    }

    //finding an entry in the otp model with this email
    const existingOTPEntry = await OTPModel.findOne({ email: email });

    //sending error if otp entry doesnt exist
    if (!existingOTPEntry) {
      return res.status(400).json({
        success: false,
        message: "an OTP entry with the entered email couldnt be found",
      });
    }

    //matching the otps here
    if (existingOTPEntry.OTP !== OTP) {
      return res.status(400).json({
        success: false,
        message: "the entered OTP is incorrect",
      });
    }

    await userModel.create({
      email: existingOTPEntry.email,
      password: existingOTPEntry.password,
      firstName: existingOTPEntry.firstName,
      lastName: existingOTPEntry.lastName,
      role: existingOTPEntry.role,
    });

    await OTPModel.deleteOne({ email: email });

    return res.status(200).json({
      success: true,
      message: "email verified",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.resendOTP = async (req, res) => {
  try {
    //fetching the email and sending suitable response
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "email field is required",
      });
    }

    //fetching existing otp entry and sending suitable response
    const existingOTPEntry = await OTPModel.findOne({ email: email });

    if (!existingOTPEntry) {
      return res.status(400).json({
        success: false,
        message:
          "otp couldnt be resent as no entry for this email exists in the otp model",
      });
    }

    //generating a new OTP here and mailing it
    const newOTP = crypto.randomInt(100000, 999999).toString();
    const isMailSent = sendMail(email, "here is your otp", newOTP, "");

    //if mail is sent update the existing otp entry
    if (isMailSent) {
      await OTPModel.findOneAndUpdate(
        { email: email },
        { OTP: newOTP, expiresAt: Date.now() + 5 * 60 * 1000 }
      );
      return res.status(200).json({
        success: true,
        message: `otp resent to ${email}`,
      });
    }
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.login = async (req, res) => {
  try {
    //fetching and checking if all the inputs are filled
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "all the fields are required",
      });
    }

    //checking if user exists or not
    const existingUser = await userModel.findOne({ email: email });
    if (!existingUser) {
      return res.status(400).json({
        success: false,
        message: "couldnt find a user associated with this account",
      });
    }

    // checking if entered password matches with the one in db
    if (!(await bcrypt.compare(password, existingUser.password))) {
      return res.status(400).json({
        success: false,
        message: "the entered password is incorrect",
      });
    }

    //assigning jwt to the user
    const token = jwt.sign(
      {
        email: existingUser.email,
        id: existingUser._id,
        firstName: existingUser.firstName,
        lastName: existingUser.lastName,
      },
      jwtSecret,
      { expiresIn: "2h" }
    );

    res.cookie("access_token", token, {
      httpOnly: true,
      secure: false,
      path: "/",
      sameSite: "lax",
    });

    // returning success response
    return res.status(200).json({
      success: true,
      message: "user logged in with following token",
      token: token,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const userid = req.user.id;

    const user = await userModel.findById(userid).populate("blogs");

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "error fetching the logged in user",
      });
    }
    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.logOut = async (req, res) => {
  try {
    const userId = req.user.id;
    if (!userId) {
      return res.status(200).json({
        success: false,
        message: "no token found",
      });
    }

    res.clearCookie("access_token", { path: "/" });

    return res.status(200).json({
      success: true,
      message: "user logged out",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

//for development purpose only
exports.deleteAllUsers = async (req, res) => {
  try {
    await userModel.deleteMany({});
    return res.status(200).json({
      success: true,
      message: "all users successfully deleted ",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
