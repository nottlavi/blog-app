const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");
require("dotenv").config();

exports.verifyToken = (req, res, next) => {
  //fetching the token and sending suitable response

  // console.log(req.cookies.access_token);

  const token = req.cookies.access_token;

  if (!token)
    return res.status(401).json({
      success: false,
      message: "not authenticated to visit this page / token not found",
    });

  //checking/verifying the token here
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err)
      return res.status(403).json({
        success: false,
        message: "token not verified / invalid token",
      });
    req.user = decoded;
    next();
  });
};

exports.isCreator = async (req, res, next) => {
  try {
    //fetching user info from token
    const userId = req.user.id;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "unable to fetch userId from req.user.id",
      });
    }

    //finding entry for such user in the db
    const existingUser = await userModel.findById(userId);

    if (!existingUser) {
      return res.status(400).json({
        success: false,
        message: "no entry found for such a user in userModel",
      });
    }

    if (existingUser.role !== "Creator") {
      return res.status(400).json({
        success: false,
        message: "user isnt a creator",
      });
    }

    next();
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
