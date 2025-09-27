const express = require("express");
const router = express.Router();

const {
  createReply,
  deleteReply,
  deleteAllReplies,
  createReplyToAReply,
} = require("../controllers/replyController");
const { verifyToken } = require("../middlewares/userMiddlewares");

router.post("/create-reply", verifyToken, createReply);
router.post("/delete-reply", verifyToken, deleteReply);
router.post("/create-nested", verifyToken, createReplyToAReply);

//for development purpose only
router.delete("/delete-all-replies", deleteAllReplies);

module.exports = router;
