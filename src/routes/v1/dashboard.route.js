import express from "express";
import asyncHandler from "~/middlewares/asyncHandler";
import AuthMiddleware from "~/middlewares/auth.middleware";
import AuthUtil from "~/utils/auth.util";
import DashboardController from "~/controllers/dashboard.controller";
import DashboardService from "~/services/dashboard.service";
import File from "~/models/file.model";
import User from "~/models/user.model";

export default class DashboardRoute {
  constructor() {
    this.router = express.Router();
    this.dashboardController = new DashboardController(
      new DashboardService(File, User)
    );
    this.authMiddleware = new AuthMiddleware(new AuthUtil());
    this.setupRoutes();
  }

  setupRoutes() {
    // [GET]  Total Storage Used by User ID - user
    this.router.get(
      "/total-storage/:userId",
      asyncHandler(this.authMiddleware.isAuthorized),
      asyncHandler(this.dashboardController.getTotalStorageUsedByUserId)
    );

    // [GET]  Total Number of Users - admin
    this.router.get(
      "/total-users",
      asyncHandler(this.authMiddleware.isAuthorized),
      asyncHandler(this.authMiddleware.isAdmin),
      asyncHandler(this.dashboardController.getTotalUsers)
    );

    // [GET]  Total Number of Posts per day - admin
    this.router.get(
      "/total-files-per-day",
      asyncHandler(this.authMiddleware.isAuthorized),
      asyncHandler(this.authMiddleware.isAdmin),
      asyncHandler(this.dashboardController.getTotalFilesPerDay)
    );
    // [GET]  Total Storage Used - admin
    this.router.get(
      "/total-storage",
      asyncHandler(this.authMiddleware.isAuthorized),
      asyncHandler(this.authMiddleware.isAdmin),
      asyncHandler(this.dashboardController.getTotalStorageUsedAll)
    );
  }

  getRoute() {
    return this.router;
  }
}