const express = require("express");
const router = express.Router();
const multer = require("multer");
const cloudinary = require("../cloudinary");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const {
  createBlog,
  getAllBlogs,
  getBlogById,
  deleteAllBlogs,
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

//image uplaod
router.post("/image", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No image file provided" });
    }
    const b64 = Buffer.from(req.file.buffer).toString("base64");
    let dataURI = "data:" + req.file.mimetype + ";base64," + b64;

    const result = await cloudinary.uploader.upload(dataURI, {
      folder: "your-blog-app", // Optional: organize images in a folder
    });

    res.status(200).json({
      message: "Image uploaded successfully",
      imageUrl: result.secure_url,
    });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ error: "Server error during upload" });
  }
});

//for development purpose only
router.delete("/delete-all-blogs", deleteAllBlogs);

module.exports = router;
