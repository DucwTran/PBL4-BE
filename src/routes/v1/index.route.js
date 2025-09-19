import UserRoute from "./user.route.js";
import AuthRoute from "./auth.route.js";

const setupRoutes = (app) => {
  const userRoute = new UserRoute();
  const authRoute = new AuthRoute();

  app.use("/api/v1/users", userRoute.getRoute());
  app.use("/api/v1/auth", authRoute.getRoute());
};

export default setupRoutes;
