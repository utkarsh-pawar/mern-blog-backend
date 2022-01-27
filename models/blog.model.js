import mongoose from "mongoose";

const dataSchema = new mongoose.Schema(
  {
    userID: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    img: {
      type: String,
      // required: true,
    },
  },
  { timestamps: true }
);

const Blog = new mongoose.model("Blog", dataSchema);

export default Blog;
