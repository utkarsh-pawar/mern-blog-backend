import jwt from "jsonwebtoken";
import express from "express";

export const verifyToken = async (req, res, next) => {
  try {
    const authHeader = await req.headers.auth;
    const token = await authHeader.split(" ")[1];
    const user = jwt.verify(token, process.env.JWT_KEY);
    // console.log(user);

    if (user.userID === req.params.id) {
      req.user = user;
      next();
    } else {
      return res.status(500).json("not authorized");
    }
  } catch (error) {
    res.status(403).json(error.message);
  }
};

export const verifyAdminToken = async (req, res, next) => {
  const authHeader = await req.headers.auth;
  const token = await authHeader.split(" ")[1];
  const user = jwt.verify(token, process.env.JWT_KEY);
  if (user.isAdmin) {
    next();
  } else {
    return res.status(400).json("not an admin");
  }
};

export const postVerification = async (req, res, next) => {
  try {
    const token = await req.headers.auth;

    const user = jwt.verify(token, process.env.JWT_KEY);
    req.user = user;
    // console.log(req.body);
    next();
  } catch (err) {
    res.status(407).json(err);
  }
};
