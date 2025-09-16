const express = require("express");
const router = express.Router();

const {
  createBlog,
  getAllBlogs,
  getBlogById,
  deleteAllBlogs,
  upload,
  searchBlogs,
  likeBlog,
  unLikeBlog,
} = require("../controllers/blogController");

const { verifyToken, isCreator } = require("../middlewares/userMiddlewares");

router.post("/create-blog", verifyToken, isCreator, createBlog);
router.get("/get-all-blogs", getAllBlogs);
router.get("/get-blog-by-id", getBlogById);
router.get("/search-blogs", searchBlogs);
router.post("/like-blog", verifyToken, likeBlog);
router.post("/unlike-blog", verifyToken, unLikeBlog);

//for development purpose only
router.delete("/delete-all-blogs", deleteAllBlogs);

module.exports = router;
