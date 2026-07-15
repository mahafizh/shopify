import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { AppError } from "../utils/responseHandler.js";
import { redis } from "../lib/redis.js";

export const authUser = async (req, res, next) => {
  try {
    const accessToken = req.cookies.access_token;
    const refreshToken = req.cookies.refresh_token;
    if (accessToken && refreshToken) {
      const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
      const user = await User.findById(decoded.userId).select(
        "_id name email role",
      );
      req.user = user;
      next();
    } else if (refreshToken && !accessToken) {
      const decoded = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
      );
      const storedToken = await redis.get(`refresh_token:${decoded.userId}`);
      if (storedToken !== refreshToken) {
        throw new AppError("Invalid refresh token", 401);
      }
      const accessToken = jwt.sign(
        { userId: decoded.userId },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "15m" },
      );
      res.cookie("access_token", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 15 * 60 * 1000,
      });
      const user = await User.findById(decoded.userId).select(
        "_id name email role",
      );
      req.user = user;
      next();
    } else {
      throw new AppError("Unauthorized", 401);
    }
  } catch (error) {
    next(error);
  }
};

export const isAdmin = async (req, res, next) => {
  const { role } = req.user;
  try {
    if (role !== "admin") {
      throw new AppError("Forbidden: Admins only", 403);
    } else {
      next();
    }
  } catch (error) {
    next(error);
  }
};
