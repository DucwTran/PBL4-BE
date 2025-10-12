import UserRoute from "./user.route.js";
import AuthRoute from "./auth.route.js";
import FileRoute from "./file.route.js";

const setupRoutes = (app) => {
  const userRoute = new UserRoute();
  const authRoute = new AuthRoute();
  const fileRoute = new FileRoute();

  app.use("/api/v1/users", userRoute.getRoute());
  app.use("/api/v1/auth", authRoute.getRoute());
  app.use("/api/v1/files", fileRoute.getRoute());
};

export default setupRoutes;
