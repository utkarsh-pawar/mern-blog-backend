import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoute from "./routes/userRoute.js";
import blogRoute from "./routes/blogRoute.js";
import bodyParser from "body-parser";

dotenv.config();

const app = express();
app.use(cors({ origin: "*" }));

app.use(express.json());
app.use("/uploads", express.static("uploads"));
app.use(bodyParser.json());

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("server is listening on port 5000");
});

// app.get("/",(req,res) =>{
//   res.send("hello world")
// })

app.use("/api/v1/users", userRoute);
app.use("/api/v1/blogs", blogRoute);

mongoose.connect(process.env.MONGO_URI, () => {
  console.log("connected to database");
});
