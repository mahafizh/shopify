import { Router } from "express";
import { authUser, isAdmin } from "../middleware/auth.middleware.js";
import {
  getAnalyticsData,
  getDailySalesData,
} from "../controller/analytic.controller.js";
import { AppSuccess } from "../utils/responseHandler.js";

const router = Router();

router.get("/", authUser, isAdmin, async (req, res) => {
  try {
    const analyticsData = await getAnalyticsData();

    const endDate = new Date();
    const startDate = new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000);

    const dailySalesData = await getDailySalesData(startDate, endDate);

    return AppSuccess(res, 200, {
      analyticsData,
      dailySalesData,
    });
  } catch (error) {
    console.log("Error in analytics route", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

export default router;
