import express from "express";
import File from "~/models/file.model";
import FileService from "~/services/file.service";
import FileController from "~/controllers/file.controller";
import AuthMiddleware from "~/middlewares/auth.middleware";
import AuthUtil from "~/utils/auth.util";
import asyncHandler from "~/middlewares/asyncHandler";
import { multerUploadMiddleware } from "~/middlewares/multer.middleware";
import ValidateMiddleware from "~/middlewares/validate.middleware";
import FileValidation from "~/validations/file.validation";
import User from "~/models/user.model";

export default class FileRoute {
  constructor() {
    this.router = express.Router();
    this.fileController = new FileController(new FileService(File, User));
    this.authMiddleware = new AuthMiddleware(new AuthUtil());
    this.setupRoutes();
  }

  setupRoutes() {
    // [POST]: / (create post - user)
    this.router.post(
      "/",
      multerUploadMiddleware.upload.single("file"),
      asyncHandler(this.authMiddleware.isAuthorized),
      asyncHandler(this.fileController.createPost)
    );
    // [GET]: get all posts by user id - user, admin
    this.router.get(
      "/userId/:userId",
      asyncHandler(this.authMiddleware.isAuthorized),
      asyncHandler(this.fileController.getPostsByUser)
    );
    // [GET] get all post of myself and friend
    this.router.get(
      "/all-of-mine-and-friends",
      asyncHandler(this.authMiddleware.isAuthorized),
      asyncHandler(this.fileController.getAllPostsOfMyselfAndFriends)
    );
    
    // [GET]: get post by id - user, admin
    this.router.get(
      "/:id",
      asyncHandler(this.authMiddleware.isAuthorized),
      asyncHandler(this.fileController.getPostById)
    );


    // [PUT]: update post by id - user, admin
    this.router.put(
      "/:id",
      asyncHandler(this.authMiddleware.isAuthorized),
      ValidateMiddleware.validate(FileValidation.fileSchema),
      asyncHandler(this.fileController.updatePost)
    );
    // [DELETE]: delete soft post by id - user, admin
    this.router.delete(
      "/delete-soft/:id",
      asyncHandler(this.authMiddleware.isAuthorized),
      asyncHandler(this.fileController.softDeletePost)
    );
    // [DELETE]: delete hard post by id - admin
    this.router.delete(
      "/delete-hard/:id",
      asyncHandler(this.authMiddleware.isAdmin),
      asyncHandler(this.fileController.hardDeletePost)
    );
    // [GET]: download 1 ảnh - user, admin
    this.router.get(
      "/download/:id",
      asyncHandler(this.authMiddleware.isAuthorized),
      asyncHandler(this.fileController.downloadFile)
    );

    // [POST]: upload nhiều ảnh - user
    this.router.post(
      "/multiple",
      multerUploadMiddleware.upload.array("files", 10),
      asyncHandler(this.authMiddleware.isAuthorized),
      asyncHandler(this.fileController.uploadMultipleFiles)
    );

    // [POST]: checksum ảnh -> return danh sách ảnh chưa có trong hệ thống - user

    // [GET]: download nhiều ảnh - user, admin
  }

  getRoute() {
    return this.router;
  }
}
