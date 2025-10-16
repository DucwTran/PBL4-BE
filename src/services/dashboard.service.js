import mongoose from "mongoose";
import { ErrorResponse } from "~/handlers/error.response";

export default class DashboardService {
  constructor(File, User) {
    this.fileModel = File;
    this.userModel = User;
  }

  getTotalStorageUsedByUserId = async (userId) => {
    const objectId = new mongoose.Types.ObjectId(userId);
    const result = await this.fileModel.aggregate([
      { $match: { userId: objectId } },
      {
        $group: {
          _id: "$userId",
          totalStorage: { $sum: "$size" },
          countFiles: { $sum: 1 },
        },
      },
    ]);
    if (result.length === 0) {
      return { totalStorage: 0, countFiles: 0 };
    }
    return {
      totalStorage: result[0].totalStorage,
      countFiles: result[0].countFiles,
    };
  };

  getTotalUsers = async () => {
    try {
      const count = await this.userModel.countDocuments({});
      return { totalUsers: count };
    } catch (error) {
      throw new ErrorResponse(
        `Error fetching total users: ${error.message}`,
        500
      );
    }
  };

  getTotalFilesPerDay = async () => {
    try {
      const result = await this.fileModel.aggregate([
        {
          $group: {
            _id: {
              $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
            },
            totalFiles: { $sum: 1 },
            totalSize: { $sum: "$size" },
          },
        },
        { $sort: { _id: 1 } },
      ]);

      return result.map((item) => ({
        date: item._id,
        totalFiles: item.totalFiles,
        totalSize: item.totalSize,
      }));
    } catch (error) {
      throw new ErrorResponse(`Lỗi khi đếm file theo ngày: ${error.message}`);
    }
  };

  getTotalStorageUsedAll = async () => {
    try {
      const result = await this.fileModel.aggregate([
        {
          $group: {
            _id: null,
            totalStorage: { $sum: "$size" },
            countFiles: { $sum: 1 },
          },
        },
      ]);

      if (result.length === 0) {
        return { totalStorage: 0, countFiles: 0 };
      }

      return {
        totalStorage: result[0].totalStorage,
        countFiles: result[0].countFiles,
      };
    } catch (error) {
      throw new ErrorResponse(
        `Lỗi khi tính tổng dung lượng toàn hệ thống: ${error.message}`,
        500
      );
    }
  };
}
