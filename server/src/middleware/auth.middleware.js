import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const authUser = async (req, res, next) => {
  try {
    const accessToken = req.cookies.access_token;
    if (accessToken) {
      const decode = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
      const user = await User.findById(decode.userId).select("_id name email role");
      req.user = user;
      next();
    } else {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: "Request failed",
    });
  }
};
