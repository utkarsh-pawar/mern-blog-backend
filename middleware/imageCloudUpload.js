import multer from "multer";
import aws from "aws-sdk";
import multerS3 from "multer-s3";
import dotenv from "dotenv";


dotenv.config();

aws.config.update({
  secretAccessKey: process.env.AWS_ACCESS_KEY,
  accessKeyId: process.env.AWS_ACCESS_ID,
  region: "ap-south-1",
});


var s3 = new aws.S3();

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: "smallpost-storage",
    key: function (req, file, cb) {
      console.log(file);
      cb(null, file.originalname);
    },
  }),
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
