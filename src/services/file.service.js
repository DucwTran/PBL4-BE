import axios from "axios";
import { BadRequestError, NotFoundError } from "~/handlers/error.response";
import {
  cloudinaryProvider,
  cloudinaryV2,
} from "~/providers/cloudinary.provider";

export default class FileService {
  constructor(File) {
    this.fileModel = File;
  }
  createPost = async (file, userId) => {
    try {
      if (!file) {
        throw new BadRequestError("Thiếu file upload");
      }

      const result = await cloudinaryProvider.streamUpload(
        file.buffer,
        `users/${userId}`
      );
      console.log("Cloudinary upload result:", result);

      const newFile = new this.fileModel({
        imageUrl: result.secure_url,
        imageName: result.public_id.split("/").pop(),
        public_id: result.public_id,
        status: "active",
        userId,
        mimeType: file.mimetype,
        size: file.size,
      });

      await newFile.save();
      return newFile;
    } catch (error) {
      throw new Error("Upload thất bại: " + error.message);
    }
  };

  getPostsByUser = async (userId) => {
    return await this.fileModel
      .find({ userId, status: { $ne: "deleted" } })
      .sort({
        createdAt: -1,
      });
  };

  getPostById = async (postId) => {
    const result = await this.fileModel.findById(postId);
    if (!result) {
      throw new NotFoundError("Không tìm thấy file với id đã cho");
    }
    return result;
  };

  updatePost = async (postId, data) => {
    if (!postId) {
      throw new BadRequestError("Thiếu postId");
    }
    const result = await this.fileModel.findByIdAndUpdate(postId, data, {
      new: true,
    });
    if (!result) {
      throw new NotFoundError("Không tìm thấy file với id đã cho");
    }
    return result;
  };

  softDeletePost = async (postId) => {
    if (!postId) {
      throw new BadRequestError("Thiếu postId");
    }
    const result = await this.fileModel.findByIdAndUpdate(
      postId,
      {
        status: "deleted",
      },
      { new: true }
    );
    if (!result) {
      throw new BadRequestError("Lỗi xóa file");
    }
    return result;
  };

  hardDeletePost = async (postId) => {
    const file = await this.fileModel.findById(postId);
    if (file) {
      // Xóa trên Cloudinary
      await cloudinaryV2.uploader.destroy(file.public_id);
      // Xóa DB
      await this.fileModel.findByIdAndDelete(postId);
    }
    return file;
  };

  downloadFile = async (fileId) => {
    const file = await this.fileModel.findById(fileId);
    if (!file) {
      throw new NotFoundError("Không tìm thấy file!");
    }

    // Gửi request đến Cloudinary để lấy dữ liệu ảnh (binary)
    const response = await axios.get(file.imageUrl, {
      responseType: "arraybuffer",
    });

    // Trả về object gồm dữ liệu và metadata
    return {
      buffer: Buffer.from(response.data, "binary"),
      mimeType: file.mimeType,
      imageName: file.imageName,
    };
  };

  uploadMultipleFiles = async (files, userId) => {
    try {
      if (!files || files.length === 0) {
        throw new BadRequestError("Thiếu file upload");
      }

      const uploadResults = [];

      for (const file of files) {
        // Upload từng file lên Cloudinary
        const result = await cloudinaryProvider.streamUpload(
          file.buffer,
          `users/${userId}`
        );

        // Lưu thông tin file vào MongoDB
        const newFile = new this.fileModel({
          imageUrl: result.secure_url,
          imageName: result.public_id.split("/").pop(),
          public_id: result.public_id,
          status: "active",
          userId,
          mimeType: file.mimetype,
          size: file.size,
        });

        await newFile.save();
        uploadResults.push(newFile);
      }

      return uploadResults;
    } catch (error) {
      throw new Error("Upload nhiều file thất bại: " + error.message);
    }
  };
}
