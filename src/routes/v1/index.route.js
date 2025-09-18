import UserRoute from "./user.route.js";

const setupRoutes = (app) => {
  const userRoute = new UserRoute();

  app.use("/api/v1/users", userRoute.getRoute());
};

export default setupRoutes;
