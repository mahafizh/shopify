import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { redis } from "../lib/redis.js";
import crypto from "crypto";

import { User } from "../models/user.model.js";
import { AppError, AppSuccess } from "../utils/responseHandler.js";
import { generateTokens } from "../utils/generateTokens.js";
import { setCookies, storeRefreshToken } from "../utils/storeToken.js";
import {
  sendPasswordResetEmail,
  sendVerificationEmail,
  sendWelcomeEmail,
} from "../lib/mailtrap.js";

export const getMe = async (req, res, next) => {
  const user = req.user;
  console.log(user);
  try {
    return AppSuccess(res, 200, user);
  } catch (error) {
    next(error);
  }
};

export const signUp = async (req, res, next) => {
  const { name, email, password } = req.body;
  try {
    const userExists = await User.exists({ email });

    if (userExists) throw new AppError("User already exists", 400);

    const verificationToken = Math.floor(
      100000 + Math.random() * 900000,
    ).toString();

    const user = new User({
      name,
      email,
      password,
      verificationToken,
      verificationTokenExpires: Date.now() + 15 * 60 * 1000,
    });

    await sendVerificationEmail(user.email, user.name, verificationToken);
    await user.save();
    return AppSuccess(res, 201);
  } catch (error) {
    next(error);
  }
};

export const signIn = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user && (await user.comparePassword(password))) {
      const { accessToken, refreshToken } = generateTokens(user._id);
      await storeRefreshToken(user._id, refreshToken);
      await setCookies(res, accessToken, refreshToken);
      return AppSuccess(res, 200);
    } else {
      throw new AppError("Invalid credentials", 400);
    }
  } catch (error) {
    next(error);
  }
};

export const signOut = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refresh_token;
    if (refreshToken) {
      const decoded = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
      );
      await redis.del(`refresh_token:${decoded.userId}`);
      res.clearCookie("access_token");
      res.clearCookie("refresh_token");
      return AppSuccess(res, 200);
    }
  } catch (error) {
    next(error);
  }
};

export const refreshToken = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refresh_token;
    if (refreshToken) {
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
    } else {
      throw new AppError("Invalid refresh token", 401);
    }
    return AppSuccess(res, 200);
  } catch (error) {
    next(error);
  }
};

export const verifyEmail = async (req, res, next) => {
  const { verificationToken } = req.body;
  try {
    const user = await User.findOne({
      verificationToken,
      verificationTokenExpires: { $gt: Date.now() },
    });
    if (!user) throw new AppError("Invalid verification token", 400);
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;
    user.isVerified = true;
    await user.save();
    await sendWelcomeEmail(user.email, user.name);
    return AppSuccess(res, 200);
  } catch (error) {
    next(error);
  }
};

export const forgotPassword = async (req, res, next) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) throw new AppError("User not found", 404);
    if (!user.isVerified) throw new AppError("User not verified", 400);
    if (user.passwordResetToken && user.passwordResetExpires > Date.now())
      throw new AppError("Password reset already sent to your email", 400);
    const resetToken = crypto.randomBytes(32).toString("hex");
    user.passwordResetToken = resetToken;
    user.passwordResetExpires = Date.now() + 15 * 60 * 1000;
    await sendPasswordResetEmail(user.email, user.name, resetToken);
    await user.save();
    return AppSuccess(res, 200);
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (req, res, next) => {
  const { token } = req.params;
  const { password, confirmPassword } = req.body;
  try {
    if (password !== confirmPassword)
      throw new AppError("Passwords do not match", 400);
    const user = await User.findOne({
      passwordResetToken: token,
      passwordResetExpires: { $gt: Date.now() },
    });
    if (!user) throw new AppError("Invalid reset token", 400);
    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
    return AppSuccess(res, 200);
  } catch (error) {
    next(error);
  }
};
