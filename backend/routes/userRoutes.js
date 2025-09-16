const express = require("express");
const router = express.Router();

const {
  signup,
  login,
  deleteAllUsers,
  verifyEmail,
  resendOTP,
  getProfile,
  logOut,
  followUser,
  getUserById,
  unFollowUser,
} = require("../controllers/userController");

const { verifyToken } = require("../middlewares/userMiddlewares");

router.post("/signup", signup);
router.post("/login", login);
router.post("/verify-email", verifyEmail);
router.post("/resend-otp", resendOTP);
router.get("/profile", verifyToken, getProfile);
router.get("/logout", verifyToken, logOut);
router.post("/follow-user", verifyToken, followUser);
router.post("/unfollow-user", verifyToken, unFollowUser);
router.post("/get-user-by-id", getUserById);

//for development purpose only
router.delete("/delete-all-users", deleteAllUsers);

module.exports = router;
