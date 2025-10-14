import dotenv from "dotenv";
import express from "express";
import { errorHandler } from "./handlers/error-handle.js";
import cookieParser from "cookie-parser";
import { env } from "./config/environment.js";
import setupRoutes from "./routes/v1/index.route.js";
import connect from "./config/mongodb.js";

import { Server } from "socket.io";
import { createServer } from "http";
import initSocket from "./sockets/socket.js";

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

// Tạo HTTP server để gắn socket.io
const expressServer = createServer(app);

const io = new Server(expressServer);
initSocket(io);

expressServer.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
