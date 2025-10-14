import UserRoute from "./user.route.js";
import AuthRoute from "./auth.route.js";
import FileRoute from "./file.route.js";
import ChatRoute from "./chat.route.js";
import MessageRoute from "./message.route.js";

const setupRoutes = (app) => {
  const userRoute = new UserRoute();
  const authRoute = new AuthRoute();
  const fileRoute = new FileRoute();
  const chatRoute = new ChatRoute();
  const messageRoute = new MessageRoute();

  app.use("/api/v1/users", userRoute.getRoute());
  app.use("/api/v1/auth", authRoute.getRoute());
  app.use("/api/v1/files", fileRoute.getRoute());
  app.use("/api/v1/chats", chatRoute.getRoute());
  app.use("/api/v1/messages", messageRoute.getRoute());
};

export default setupRoutes;
