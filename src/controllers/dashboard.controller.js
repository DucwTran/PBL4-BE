import { OK } from "~/handlers/success.response";

export default class DashboardController {
  constructor(DashboardService) {
    this.dashboardService = DashboardService;
  }
  getTotalStorageUsedByUserId = async (req, res) => {
    const { userId } = req.params;
    const result = await this.dashboardService.getTotalStorageUsedByUserId(
      userId
    );

    return new OK({
      message: "Get total storage successfully",
      metadata: result,
    }).send(res);
  };

  getTotalUsers = async (req, res) => {
    const result = await this.dashboardService.getTotalUsers();

    return new OK({
      message: "Get total users successfully",
      metadata: result,
    }).send(res);
  };

  getTotalFilesPerDay = async (req, res) => {
    const result = await this.dashboardService.getTotalFilesPerDay();

    return new OK({
      message: "Get total files per day successfully",
      metadata: result,
    }).send(res);
  };

  getTotalStorageUsedAll = async (req, res) => {
    const result = await this.dashboardService.getTotalStorageUsedAll();

    return new OK({
      message: "Get total storage used (all users) successfully",
      metadata: result,
    }).send(res);
  };
}
