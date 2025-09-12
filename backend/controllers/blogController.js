const blogModel = require("../models/blogModel");
const userModel = require("../models/userModel");

exports.createBlog = async (req, res) => {
  //fetching imp details and returning appropiate response

  const { blogTitle, createdAt, author, blogDescription, blogBody } = req.body;

  if (!blogTitle || !createdAt || !author || !blogBody) {
    return res.status(400).json({
      success: false,
      message: "all input fiels are required",
    });
  }

  //creating new entry in the db

  const newBlogEntry = await blogModel.create({
    blogTitle: blogTitle,
    createdAt: createdAt,
    author: author,
    blogDescription: blogDescription,
    blogBody: blogBody,
  });

  //if blogDescription is entered, attaching it with the db as it is not required

  if (blogDescription) {
    newBlogEntry.blogDescription = blogDescription;
  }

  //finding and updating the entry for this author
  const newUser = await userModel.findByIdAndUpdate(author, {
    $push: { blogs: newBlogEntry._id },
  });

  return res.status(200).json({
    success: true,
    message: "created blog successfully with the below details",
    details: newBlogEntry,
  });
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

exports.getAllBlogs = async (req, res) => {
  try {
    const allBlogs = await blogModel.find({}).populate("author");
    return res.status(200).json({
      success: false,
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
