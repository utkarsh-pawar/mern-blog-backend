import express from "express";
import Blog from "../models/blog.model.js";
import { verifyToken } from "./authToken.js";
import { postVerification } from "./authToken.js";
import multer from "multer";

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, new Date(Date.now()).toDateString() + "-" + file.originalname);
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 12,
  },
});

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
    const newBlog = await new Blog({
      userID: req.user.userID,
      title: req.body.title,
      content: req.body.content,
      img: req.file.path,
    });
    console.log(newBlog);
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
router.delete("/:id", postVerification, async (reqe, res) => {
  try {
    const post = await Blog.findOne({ _id: req.params.id });

    if (req.user.userId !== post.userID) {
      return res.status(400).send("you are not allowed to do that");
    }
  } catch (err) {
    res.status(400).send(err.message);
  }
});

export default router;
