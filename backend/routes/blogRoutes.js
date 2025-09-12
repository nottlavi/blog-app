const express = require("express");
const router = express.Router();

const { createBlog, getAllBlogs } = require("../controllers/blogController");

const { verifyToken, isCreator } = require("../middlewares/userMiddlewares");

router.post("/create-blog", verifyToken, isCreator, createBlog);
router.get("/get-all-blogs", getAllBlogs);

module.exports = router;
