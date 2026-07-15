import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import path from "path";
import fileUpload from "express-fileupload";
import routes from "./routes/route.js";
import { connectDB } from "./lib/database.js";
import { errorHandler } from "./middleware/errorHandler.middleware.js";

dotenv.config();
const __dirname = path.resolve();
const PORT = process.env.PORT;
const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: path.join(__dirname, "tmp"),
    createParentPath: true,
    limits: { fileSize: 10 * 1024 * 1024 },
  }),
);

app.use("/api", routes);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  connectDB();
});
