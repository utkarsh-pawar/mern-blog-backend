import express from "express";
import Data from "../models/data.model.js";
import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, new Date(Date.now()).toDateString() + "-" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 8,
  },
  fileFilter: fileFilter,
});

const router = express.Router();

router.get("/", async (req, res) => {
  const data = await Data.find();
  res.send(data);
});

router.post("/", upload.single("uploadImage"), async (req, res) => {
  try {
    const data = await new Data({
      img: req.file.path,
    });

    data.save();
    res.send(data);
  } catch (err) {
    res.status(400).send(err);
    console.log(err);
  }
});

export default router;
