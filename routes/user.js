import express from "express";
import User from "../models/user.model.js";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { verifyToken } from "./authToken.js";
import { verifyAdminToken } from "./authToken.js";
import { postVerification } from "./authToken.js";

const router = express.Router();

router.post("/checkauth", async (req, res) => {
  try {
    const token = req.header("auth-token");
    if (!token) {
      return res.json(false);
    }
    const verified = jwt.verify(token, process.env.JWT_KEY);
    if (!verified) {
      return res.json(false);
    }
    const user = await User.findOne({ _id: verified.userID });
    // console.log(user);
    if (!user) {
      return res.json(false);
    }
    return res.json({
      isUser: true,
      userData: {
        userID: user._id,
        token,
      },
      isAdmin: user.isAdmin,
    });
  } catch (err) {
    res.status(400).json(err.messeage);
  }
});

//SIGNUP
router.post("/signup", async (req, res) => {
  try {
    const { name, password, email } = req.body;
    if (!name || !password || !email) {
      return res.status(400).json("enter all required fields");
    }
    if (password.length < 8) {
      return res.status(400).json("password must have atleast 8 characters");
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const checkMail = await User.findOne({ email: email });
    // console.log(checkMail);

    if (checkMail) {
      return res.status(400).json("email already exists");
      // res.status(409)
      // throw new Error({message:"email already exists"})
    } else {
      const user = await new User({
        name: name,
        email: email,
        password: hashedPassword,
      });
      const savedUser = await user.save();
      res.status(200).json(savedUser);
    }
  } catch (error) {
    res.status(400).json(error.message);
  }
});

//Admin Login
router.post("/adminlogin", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json("enter all required fields");
    }

    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(404).json("no user with entered mail found");
    }

    const checkPassword = await bcrypt.compare(password, user.password);

    if (!checkPassword) {
      return res.status(400).json("invalid credentials");
    }

    if (user.isAdmin) {
      const token = await jwt.sign(
        {
          userID: user._id,
          isAdmin: user.isAdmin,
        },
        process.env.JWT_KEY
      );
      return res.status(200).json({
        userID: user._id,
        token,
      });
    } else {
      res.status(400).json("you are not authorized to control admin panel");
    }
  } catch (err) {
    res.status(400).json(err.message);
  }
});

//LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json("enter all required fields");
    }

    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(404).json("no user with entered mail found");
    }

    const checkPassword = await bcrypt.compare(password, user.password);

    if (!checkPassword) {
      return res.status(400).json("invalid credentials");
    }

    const token = await jwt.sign(
      {
        userID: user._id,
        isAdmin: user.isAdmin,
      },
      process.env.JWT_KEY
    );
    res.status(200).json({
      userID: user._id,
      token,
    });
  } catch (err) {
    res.status(400).json(err.message);
  }
});

//GET all users
router.get("/", verifyAdminToken, async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(400).json(err.message);
  }
});

//delete user
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    // console.log(req.data);
    await User.findByIdAndDelete({ _id: req.params.id });
    res.status(200).json("user has been deleted !!");
  } catch (err) {
    res.status(500).json(err.message);
  }
});

//update
router.put("/update/:id", verifyToken, async (req, res) => {
  try {
    // const id = req.params.id;

    if (await User.findOne({ email: email })) {
      return res.status(400).json({ message: "email address alreadye exists" });
    }

    if (req.body.password) {
      req.body.password = await bcrypt.hash(req.body.password, 10);
    }
    console.log(req.params.id);
    const updatedUser = await User.findByIdAndUpdate(
      { _id: req.params.id },
      {
        $set: req.body,
      },
      { new: true }
    );
    console.log(updatedUser);
    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

export default router;
