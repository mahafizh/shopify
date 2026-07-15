import mongoose from "mongoose";
import { Category } from "../models/category.model.js";
import { config } from "dotenv";

config();

const categories = [
  { name: "Fashion" },
  { name: "Home Appliances" },
  { name: "Automotive" },
  { name: "Electronics" },
  { name: "Food" },
  { name: "Beverages" },
  { name: "Stationery" },
];

const seedCategory = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    await Category.deleteMany({});
    await Category.insertMany(categories);
    console.log("Categories seeded successfully!");
  } catch (error) {
    console.error("Error seeding categories:", error);
  } finally {
    mongoose.connection.close();
  }
};

seedCategory();
