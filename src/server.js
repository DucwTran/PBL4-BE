import dotenv from "dotenv";
import express from "express";
import { errorHandler } from "./handlers/error-handle.js";
import cookieParser from "cookie-parser";
import { env } from "./config/environment.js";
import setupRoutes from "./routes/v1/index.js";
import connect from "./config/mongodb.js";

dotenv.config();
const app = express();
const port = env.APP_PORT;
connect();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

setupRoutes(app);
app.use(errorHandler);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
