const { model } = require("mongoose");
const blogModel = require("../models/blogModel");
const userModel = require("../models/userModel");

exports.createBlog = async (req, res) => {
  try {
    const { blogTitle, blogDescription, blogBody, author } = req.body;
    if (!blogTitle || !blogBody || !author) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

    const blog = await blogModel.create({
      blogTitle,
      blogDescription,
      blogBody,
      author,
      createdAt: new Date(),
    });

    await userModel.findByIdAndUpdate(author, { $push: { blogs: blog._id } });

    return res.status(201).json({ success: true, blog });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// exports.getBlogsByUser = async (req, res) => {
//   //i will be passing verifyToken and isCreator middlewares before calling this controller

//   const userId = req.user.id;

//   if (!userId) {
//     return res.status(400).json({
//       success: false,
//       message: "user id not found from the token",
//     });
//   }

//   //fetching user entry from the db
//   const userEntry = await userModel.findById(userId);
//   if (!userEntry) {
//     return res.status(400).json({
//       success: false,
//       message: "no user found with this id",
//     });
//   }
// };

exports.getBlogById = async (req, res) => {
  try {
    //fetching info from call
    const { blogId } = req.query;

    //fetching blog entry from db
    const blogEntry = await blogModel
      .findById(blogId)
      .populate("author")
      .populate({
        path: "replies",
        populate: {
          path: "replyOwnerId",
          model: "userModel",
        },
      });

    if (!blogEntry) {
      return res.status(400).json({
        success: false,
        message: "success false",
      });
    }

    return res.status(200).json({
      success: true,
      blog: blogEntry,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.getAllBlogs = async (req, res) => {
  try {
    const allBlogs = await blogModel.find({}).populate("author");
    return res.status(200).json({
      success: true,
      message: " all blogs fetched across all the users fetched successfully",
      blogs: allBlogs,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.searchBlogs = async (req, res) => {
  try {
    const searchTerm = req.query.q;

    if (!searchTerm) {
      return res.status(400).json({
        success: false,
        message: "no searchTerm found",
      });
    }

    const searchPattern = new RegExp(searchTerm, "i");

    const posts = await blogModel
      .find({
        $or: [{ blogTitle: searchPattern }, { blogBody: searchPattern }],
      })
      .populate("author");

    res.json(posts);
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.likeBlog = async (req, res) => {
  try {
    const { blogId } = req.body;
    const userId = req.user.id;

    const userProfile = await userModel.findById(userId);

    if (userProfile.likes.includes(blogId)) {
      return res.status(400).json({
        success: false,
        message: "you have already liked this blog",
      });
    }

    const updatedBlogEntry = await blogModel.findByIdAndUpdate(
      blogId,
      {
        $push: { likes: userId },
      },
      { new: true }
    );

    await userModel.findByIdAndUpdate(
      userId,
      {
        $push: { likes: blogId },
      },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      blogEntry: updatedBlogEntry,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.unLikeBlog = async (req, res) => {
  try {
    const { blogId } = req.body;
    const userId = req.user.id;

    const userProfile = await userModel.findById(userId);

    if (!userProfile.likes.includes(blogId)) {
      return res.status(400).json({
        success: false,
        message: "you dont like this blog at the first place",
      });
    }

    await blogModel.findByIdAndUpdate(
      blogId,
      {
        $pull: { likes: userId },
      },
      { new: true }
    );

    await userModel.findByIdAndUpdate(
      userId,
      {
        $pull: { likes: blogId },
      },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "unliked / disliked successfully",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

//for development purpose only
exports.deleteAllBlogs = async (req, res) => {
  try {
    await blogModel.deleteMany({});
    return res.status(200).json({
      success: true,
      message: "all blogs deleted",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
