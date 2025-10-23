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

// - Dashboard(user):
//   + Total Storage Used: Dùng Biểu đồ Vùng (Area Chart) hoặc Biểu đồ Đường (Line Chart).
//    Biểu đồ sẽ cho thấy tổng dung lượng tăng dần theo thời gian, giúp bạn biết khi nào cần nâng cấp gói dịch vụ hoặc tối ưu.
//   + Num of pics
//   + Num of friend

// - Dashboard(admin):
//   + Total Users:  Dùng Biểu đồ Đường (Line Chart). Trục hoành là thời gian (ngày/tuần/tháng),
//    trục tung là tổng số người dùng. Một đường dốc lên thể hiện sự tăng trưởng tốt.
//   + New Posts:  Dùng Biểu đồ Cột (Bar Chart). Mỗi cột là một ngày, chiều cao của cột thể hiện tổng số ảnh đã gửi
//   + Daily Active Users: Dùng Biểu đồ Đường (Line Chart) để xem sự biến động của lượng người dùng
//    trung thành theo thời gian trong 30 ngày qua.
//   + Total Storage Used: Dùng Biểu đồ Vùng (Area Chart) hoặc Biểu đồ Đường (Line Chart).
//    Biểu đồ sẽ cho thấy tổng dung lượng tăng dần theo thời gian, giúp bạn biết khi nào cần nâng cấp gói dịch vụ hoặc tối ưu.
