const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const { sendMail } = require("../services/sendMail");
const OTPModel = require("../models/OTPModel");
const jwt = require("jsonwebtoken");
const blogModel = require("../models/blogModel");
require("dotenv").config();
const jwtSecret = process.env.JWT_SECRET;
const cloudinary = require("../cloudinary");
const fs = require("fs");

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
      secure: true,
      path: "/",
      sameSite: "none",
    });

    // returning success response
    return res.status(200).json({
      success: true,
      message: "user logged in with following token",
      token: token,
      email: email,
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

exports.getUserById = async (req, res) => {
  try {
    const { userId } = req.body;

    const existingUser = await userModel.findById(userId);

    return res.status(200).json({
      success: true,
      message: "user fetched with below data",
      data: existingUser,
    });
  } catch (err) {
    return res.status(200).json({
      success: false,
      message: err.message,
    });
  }
};

exports.followUser = async (req, res) => {
  try {
    const { followedId } = req.body;
    // here followedId is the id of the user who will be followed
    const followerId = req.user.id;
    //here userId is the id of a user who wants to follow followedId
    if (!followerId) {
      return res.status(400).json({
        success: false,
        message: "check user middleware for this",
      });
    }

    //fetching the entry of the user who will be followed
    const followedUser = await userModel.findById(followedId);

    if (!followedUser) {
      return res.status(400).json({
        success: false,
        message: "no such user found who will be followed",
      });
    }

    //to check if user already follows this id
    if (followedUser.followers.includes(followerId)) {
      return res.status(400).json({
        success: false,
        message: "user already follows this account",
      });
    }

    //pushing the id of the follower  into the entry of followed user
    await userModel.findByIdAndUpdate(
      followedId,
      {
        $push: { followers: followerId },
      },
      { new: true }
    );

    //fetching the entry of the user who will be following
    const followerUser = await userModel.findById(followerId);

    if (!followerUser) {
      return res.status(400).json({
        success: false,
        message: "no such user found who will be following",
      });
    }
    //pushing the id of the followed user  into the entry of following user
    await userModel.findByIdAndUpdate(followerId, {
      $push: { following: followedId },
    });

    return res.status(200).json({
      success: true,
      message: `${followerId} successfully followed ${followedId}`,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.unFollowUser = async (req, res) => {
  try {
    //fetching id to be unfollowed from the body of the req
    const { followedId } = req.body;
    //fetching id which will be unfollowing followedId from the token
    const followerId = req.user.id;

    //fetching info of followed user from the db
    const followedUser = await userModel.findById(followedId);
    if (!followedUser) {
      return res.status(400).json({
        success: false,
        message: "no user found who will be unfollowed",
      });
    }

    //fetching info of follower user from the db
    const followerUser = await userModel.findById(followerId);

    console.log(followerUser);
    if (!followerUser) {
      return res.status(400).json({
        success: false,
        message: "no user found who will be unfollowing",
      });
    }

    if (!followedUser.followers.includes(followerId)) {
      return res.status(400).json({
        success: false,
        message: "user doesnt follow the followed user",
      });
    }
    //now removing the follower from followed user entry
    await userModel.findByIdAndUpdate(
      followedId,
      {
        $pull: { followers: followerId },
      },
      { new: true }
    );

    //now removing the following from follower user id
    await userModel.findByIdAndUpdate(
      followerId,
      {
        $pull: { following: followedId },
      },
      { new: true }
    );

    return res.status(200).json({
      success: false,
      message: `${followerUser.firstName} unfollowed ${followedUser.firstName}`,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.upDateProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "no user if fetched from the token",
      });
    }

    //fetching the user entry which needs to be updated
    const existingUser = await userModel.findById(userId);
    if (!existingUser) {
      return res.status(400).json({
        success: false,
        message: "no entry found for this user in the db",
      });
    }

    //finally fetching and updating the values
    const { firstName, lastName, email, password, profilePic } = req.body;

    if (firstName) existingUser.firstName = firstName || existingUser.firstName;
    if (lastName) existingUser.lastName = lastName || existingUser.lastName;
    if (email) existingUser.email = email || existingUser.email;
    if (password) existingUser.password = password || existingUser.password;

    if (req.file) {
      const newProfilePic = await cloudinary.uploader.upload(req.file.path);
      existingUser.profilePic = newProfilePic.secure_url;

      fs.unlinkSync(req.file.path);
    }

    await existingUser.save();

    return res.status(200).json({
      success: true,
      message: "profile successfully updated",
      data: existingUser,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.searchUser = async (req, res) => {
  try {
    const searchTerm = req.query.q;

    if (!searchTerm) {
      return res.status(400).json({
        success: false,
        message: "couldnt find search term",
      });
    }

    const searchPattern = new RegExp(searchTerm, "i");

    const users = await userModel.find({
      $or: [{ firstName: searchPattern }, { lastName: searchPattern }],
    });

    res.json(users);
  } catch (err) {
    return res.json({
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

exports.getFoodPosts = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await userModel.findById(userId);

    if (!userId) {
      return res.status(404).json({
        message: "no userId found from the token",
      });
    }

    if (!user) {
      return res.status(404).json({
        message: "no user found for this entry in the db",
      });
    }

    const followedUsers = user.following;
    const blogs = await blogModel.find({ author: { $in: followedUsers } });

    return res.status(200).json({
      blogs: blogs,
    });
  } catch (err) {
    return res.status(500).json({
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
