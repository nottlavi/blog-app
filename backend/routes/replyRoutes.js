const express = require("express");
const router = express.Router();

const { createReply, deleteReply } = require("../controllers/replyController");
const { verifyToken } = require("../middlewares/userMiddlewares");

router.post("/create-reply", verifyToken, createReply);
router.post("/delete-reply", verifyToken, deleteReply);

module.exports = router;
