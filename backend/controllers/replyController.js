const replyModel = require("../models/replyModel");
const userModel = require("../models/userModel");
const blogModel = require("../models/blogModel");

exports.createReply = async (req, res) => {
  try {
    //fetching imp info and returning suitable response
    const { replyBody, replyTime, onBlogId } = req.body;
    const replyOwnerId = req.user.id;

    if (!replyBody) {
      return res.status(400).json({
        success: false,
        message: "please type something to reply",
      });
    }

    //creating new entry in reply db
    const newReplyEntry = await replyModel.create({
      replyBody: replyBody,
      replyTime: replyTime,
      onBlogId: onBlogId,
      replyOwnerId: replyOwnerId,
    });
    //pushing this reply's id into user model
    await userModel.findByIdAndUpdate(replyOwnerId, {
      $push: { replies: newReplyEntry._id },
    });

    //pushing this reply's id into blog model
    await blogModel.findByIdAndUpdate(onBlogId, {
      $push: { replies: newReplyEntry._id },
    });

    return res.status(200).json({
      success: true,
      message: "new reply created successfully with the following data",
      data: newReplyEntry,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.deleteReply = async (req, res) => {
  try {
    //fetching required info and retuning suitable response
    const { replyId, userId } = req.body;

    if ((!replyId, !userId)) {
      return res.status(400).json({
        success: false,
        message: "all the fields are required",
      });
    }
    //finding such entry in the reply db
    const existingReplyEntry = await replyModel.findById(replyId);

    if (!existingReplyEntry) {
      return res.status(400).json({
        success: false,
        message: `no entry found in the db for reply id: ${replyId}`,
      });
    }

    //checking if the user who wants to delete the comment is the one who created it

    console.log(
      "printing both the user ids here: ",
      userId,
      existingReplyEntry.replyOwnerId.toString()
    );
    if (userId !== existingReplyEntry.replyOwnerId.toString()) {
      return res.status(400).json({
        success: false,
        message:
          "the user who created this reply is not the one trying to delete it",
      });
    }
    //pulling this entry out of user model
    await userModel.findByIdAndUpdate(userId, {
      $pull: {
        replies: existingReplyEntry._id,
      },
    });

    //pulling this entry out of blog model
    await blogModel.findByIdAndUpdate(existingReplyEntry.onBlogId, {
      $pull: { replies: existingReplyEntry._id },
    });

    //deleting this entry from reply model
    await replyModel.findByIdAndDelete(replyId);

    return res.status(200).json({
      success: false,
      message: "entry successfully deleted",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

//for development purpose only
exports.deleteAllReplies = async (req, res) => {
  try {
    await replyModel.deleteMany({});
    return res.status(200).json({
      success: true,
      message: "all replies deleted",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
