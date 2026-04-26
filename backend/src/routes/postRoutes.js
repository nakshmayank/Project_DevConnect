const express = require("express");
const postRouter = express.Router();
const { userAuth } = require("../middleware/userAuth");
const { Post } = require("../model/post");

postRouter.get("/posts", userAuth, async (req, res) => {
  try {
    const posts = await Post.find({})
      .populate({
        path: "author",
        select: "name photoUrl about skills email",
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: posts,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Unable to fetch posts right now",
      error: err.message,
    });
  }
});

postRouter.post("/posts", userAuth, async (req, res) => {
  try {
    const { title, description, category, tags = [], images = [] } = req.body;

    const post = new Post({
      author: req.user._id,
      title,
      description,
      category,
      tags,
      images,
    });

    await post.save();
    const createdPost = await Post.findById(post._id).populate({
      path: "author",
      select: "name photoUrl about skills email",
    });

    res.status(201).json({
      success: true,
      message: "Your post has been published successfully",
      data: createdPost,
    });
  } catch (err) {
    console.error("Post creation error:", err);

    if (err.name === "ValidationError") {
      const firstError = Object.values(err.errors)[0];

      return res.status(400).json({
        success: false,
        message: firstError?.message || "Invalid post details",
      });
    }

    res.status(500).json({
      success: false,
      message: err.message || "Unable to create post right now",
      error: err.message,
    });
  }
});

module.exports = { postRouter };
