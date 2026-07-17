import { User } from "../models/user.model.js";
import { deleteFromCloudinary } from "../utils/deleteFromCloudinary.js";
import { AppError, AppSuccess } from "../utils/responseHandler.js";
import { uploadToCloudinary } from "../utils/uploadToCloudinary.js";

import jwt from "jsonwebtoken";
import { redis } from "../lib/redis.js";

export const getMe = async (req, res, next) => {
  const user = req.user;
  try {
    return AppSuccess(res, 200, user);
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (req, res, next) => {
  const { name, email } = req.body || {};
  const imageFile = req.files?.imageFile || undefined;
  let oldImageUrl;
  let newImageUrl;
  try {
    const user = await User.findById(req.user._id);

    if (!req.body && !imageFile)
      throw new AppError("You are not changing anything", 400);

    if (name !== undefined) user.name = name;
    if (email !== undefined && email !== user.email) {
      user.email = email;
      user.isVerified = false;
    }

    if (imageFile) {
      oldImageUrl = user.imageURL;
      newImageUrl = await uploadToCloudinary(imageFile);
      user.imageURL = newImageUrl;
    }

    const updatedUser = await user.save();
    if (
      updatedUser &&
      oldImageUrl &&
      oldImageUrl !== process.env.DEFAULT_USER_IMAGE
    )
      await deleteFromCloudinary(oldImageUrl);

    return AppSuccess(res, 200, updatedUser);
  } catch (error) {
    next(error);
  }
};

export const updatePassword = async (req, res, next) => {
  const { newPassword, newPasswordConfirmation, oldPassword, signout } =
    req.body;
  try {
    if (!newPassword || !newPasswordConfirmation || !oldPassword)
      throw new AppError("Fill in all fields");

    if (newPassword !== newPasswordConfirmation)
      throw new AppError("Password unmatched", 400);

    const user = await User.findById(req.user._id);
    const isPasswordMatch = await user.comparePassword(oldPassword);
    if (!isPasswordMatch) throw new AppError("Invalid credentials", 400);

    user.password = newPassword;
    await user.save();

    if (signout) {
      const refreshToken = req.cookies.refresh_token;
      if (refreshToken) {
        const decoded = jwt.verify(
          refreshToken,
          process.env.REFRESH_TOKEN_SECRET,
        );
        await redis.del(`refresh_token:${decoded.userId}`);
        res.clearCookie("access_token");
        res.clearCookie("refresh_token");
      }
      return AppSuccess(res, 200, null, "Signing out in all devices");
    } else {
      return AppSuccess(res, 200);
    }
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (params) => {
  try {
    const user = await User.findByIdAndDelete(req.user._id);
    if (!user) throw new AppError("User not found", 404);

    if (user.imageURL !== process.env.DEFAULT_USER_IMAGE)
      await deleteFromCloudinary(user.imageURL);

    return AppSuccess(res, 200);
  } catch (error) {
    next(error);
  }
};
