import express from "express";
import UserController from "~/controllers/user.controller";
import asyncHandler from "~/middlewares/asyncHandler";
import AuthMiddleware from "~/middlewares/auth.middleware";
import ValidateMiddleware from "~/middlewares/validate.middleware";
import User from "~/models/user.model";
import UserService from "~/services/user.service";
import AuthUtil from "~/utils/auth.util";
import UserValidation from "~/validations/user.validation";

export default class UserRoute {
  constructor() {
    this.router = express.Router();
    this.userController = new UserController(
      new UserService(User, new AuthUtil())
    );
    this.authMiddleware = new AuthMiddleware(new AuthUtil());
    this.setupRoutes();
  }

  setupRoutes() {
    // [GET] get all users: admin
    this.router.get(
      "/",
      asyncHandler(this.authMiddleware.isAuthorized),
      asyncHandler(this.authMiddleware.isAdmin),
      asyncHandler(this.userController.getAllUsers)
    );

    // [GET] get user by id: user, admin
    this.router.get(
      "/:id",
      asyncHandler(this.authMiddleware.isAuthorized),
      asyncHandler(this.userController.getUserById)
    );

    // [POST] create user: admin
    this.router.post(
      "/",
      ValidateMiddleware.validate(UserValidation.createUserSchema),
      asyncHandler(this.authMiddleware.isAuthorized),
      asyncHandler(this.authMiddleware.isAdmin),
      asyncHandler(this.userController.createUser)
    );

    // [PUT] update user by id: user, admin
    this.router.put(
      "/:id",
      ValidateMiddleware.validate(UserValidation.updateUserSchema),
      asyncHandler(this.authMiddleware.isAuthorized),
      asyncHandler(this.userController.updateUser)
    );

    // [DELETE] delete soft user by id: admin
    this.router.delete(
      "/softdelete/:id",
      asyncHandler(this.authMiddleware.isAuthorized),
      asyncHandler(this.authMiddleware.isAdmin),
      asyncHandler(this.userController.deleteSoftUser)
    );

    // [DELETE] delete hard user by id: admin
    this.router.delete(
      "/:id",
      asyncHandler(this.authMiddleware.isAuthorized),
      asyncHandler(this.authMiddleware.isAdmin),
      asyncHandler(this.userController.deleteUser)
    );

    // [POST] Gửi lời mời kết bạn
    this.router.post(
      "/add-friend",
      asyncHandler(this.authMiddleware.isAuthorized),
      asyncHandler(this.userController.sendFriendRequest)
    );

    // [POST] Chấp nhận lời mời kết bạn
    this.router.post(
      "/accept-friend",
      asyncHandler(this.authMiddleware.isAuthorized),
      asyncHandler(this.userController.acceptFriendRequest)
    );

    // [POST] Từ chối lời mời kết bạn
    this.router.post(
      "/reject-friend",
      asyncHandler(this.authMiddleware.isAuthorized),
      asyncHandler(this.userController.rejectFriendRequest)
    );
  }

  getRoute() {
    return this.router;
  }
}
