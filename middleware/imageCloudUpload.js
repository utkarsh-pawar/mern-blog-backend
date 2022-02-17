import multer from "multer";
import aws from "aws-sdk";
import s3Storage from "multer-sharp-s3";
import dotenv from "dotenv";

dotenv.config();

aws.config.update({
  secretAccessKey: process.env.AWS_ACCESS_KEY,
  accessKeyId: process.env.AWS_ACCESS_ID,
  region: "ap-south-1",
});

var s3 = new aws.S3();

const storage = gcsSharp({
  s3,
  Bucket: "smallpost-storage",
  resize: {
    width: 400,
    height: 400,
  },
  max: true,
});

const upload = multer({
  storage: storage
});

export default upload;

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "./uploads/");
//   },
//   filename: function (req, file, cb) {
//     cb(null, new Date(Date.now()).toDateString() + "-" + file.originalname);
//   },
// });
