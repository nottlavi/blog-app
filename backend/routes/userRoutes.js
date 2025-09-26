const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

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
  upDateProfile,
  searchUser,
  getFoodPosts,
  getQueryByType,
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
router.post(
  "/update-profile",
  upload.single("profilePic"),
  verifyToken,
  upDateProfile
);
router.get("/search-user", searchUser);
router.post("/get-user-by-id", getUserById);
router.get("/feed", verifyToken, getFoodPosts);
router.get("/get-by-query/:query", verifyToken, getQueryByType);

//for development purpose only
router.delete("/delete-all-users", deleteAllUsers);

module.exports = router;
