import express from "express";
import cookieParser from 'cookie-parser'
import dotenv from "dotenv"
dotenv.config();

import routes from "./routes/route.js";
import { connectDB } from "./lib/database.js";
import {errorHandler} from "./middleware/errorHandler.middleware.js"

const PORT = process.env.PORT;
const app = express();

app.use(express.json())
app.use(cookieParser())

app.use("/api", routes)
app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  connectDB()
});
