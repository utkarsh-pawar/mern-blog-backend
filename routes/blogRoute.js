import express from "express";
import Blog from "../models/blog.model.js";
import dotenv from "dotenv";
import { postVerification } from "../middleware/authToken.js";
import upload from "../middleware/imageCloudUpload.js";

const router = express.Router();

dotenv.config();

//get all blogs
router.get("/", async (req, res) => {
  try {
    const blogs = await Blog.find();
    res.json(blogs);
  } catch (error) {
    res.send(400).json(error.message);
  }
});

router.post("/", postVerification, upload.single("img"), async (req, res) => {
  try {
    const { userID } = req.user;
    const { title, content } = req.body;
    const { location } = req.file;

    if (!title || !content || !location) {
      throw new Error("enter all required fields");
    }
    
    console.log(req.file);
    const newBlog = await new Blog({
      userID: userID,
      title: title,
      content: content,
      img: location,
    });
    // console.log(newBlog);
    if (
      req.file.mimetype !== "image/jpeg" &&
      req.file.mimetype !== "image/png"
    ) {
      return res.status(400).json("enter valid image type");
    }

    const savedBlog = await newBlog.save();
    res.json(savedBlog);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

//get all a user posts
router.get("/posts", postVerification, async (req, res) => {
  try {
    //   console.log(req.user.userID);
    const posts = await Blog.find({ userID: req.user.userID });
    res.send(posts);
  } catch (err) {
    res.send(err.message);
  }
});

// get single post
router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const post = await Blog.findOne({ _id: id });
    res.json(post);
  } catch (err) {
    res.status(400).json(err.message);
  }
});

//delete post
router.delete("/:id", postVerification, async (req, res) => {
  try {
    const post = await Blog.findById({ _id: req.params.id });
    // console.log(post.userID);
    // console.log(req.user.userID);
    if (req.user.userID !== post.userID) {
      return res.status(400).send("you are not allowed to do that");
    }
    await Blog.findByIdAndDelete({ _id: req.params.id });
    res.status(200).json("your post is deleted");
  } catch (err) {
    res.status(400).send(err.message);
  }
});

export default router;
