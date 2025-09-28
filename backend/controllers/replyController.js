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
    let newReplyEntry = await replyModel.create({
      replyBody: replyBody,
      replyTime: replyTime,
      onBlogId: onBlogId,
      replyOwnerId: replyOwnerId,
    });

    newReplyEntry = await newReplyEntry.populate("replyOwnerId");
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

exports.createReplyToAReply = async (req, res) => {
  try {
    const { replyId } = req.body;
    const userId = req.user.id;

    if (!replyId || !userId) {
      return res.status(400).json({
        error: "sm is missing",
      });
    }

    const replyEntry = await replyModel.findById(replyId);

    if (!replyEntry) {
      return res.status(400).json({
        error: "no reply entry found for this reply",
      });
    }

    const { replyBody } = req.body;

    const nestedReply = await replyModel.create({
      replyBody: replyBody,
      replyTime: Date.now(),
      replyOwnerId: userId,
      onReplyId: replyId,
    });

    await replyModel.findByIdAndUpdate(replyId, {
      $push: { replies: nestedReply._id },
    });

    return res.status(200).json({
      data: nestedReply,
    });
  } catch (err) {
    return res.status(500).json({
      error: err.message,
    });
  }
};

exports.getReplyDetails = async(req, res) => {
  try {
    const {replyId} = req.params;
    if(!replyId) {
      return res.status(400).json({
        error: "no reply id fetched"
      })
    }

    const replyEntry = await replyModel.findById(replyId).populate("replies");
    if(!replyEntry) {
      return res.status(404).json({
        error: "no reply entry found for this id"
      })
    }

    return res.status(200).json({
      data: replyEntry
    })
  } catch (err) {
    return res.status(500).json({
      error: err.message
    })
  }
}

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
