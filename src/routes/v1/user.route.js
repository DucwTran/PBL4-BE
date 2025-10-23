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

    this.authUtil = new AuthUtil();

    this.userService = new UserService(User, this.authUtil);
    this.authMiddleware = new AuthMiddleware(this.authUtil);
    this.userController = new UserController(this.userService);
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
    // [GET]  Total Number of Friend by User ID - user
    this.router.get(
      "/friends/counting",
      asyncHandler(this.authMiddleware.isAuthorized),
      asyncHandler(this.userController.getTotalFriends)
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
      asyncHandler(this.authMiddleware.isAuthorized),
      asyncHandler(this.authMiddleware.isAdmin),
      ValidateMiddleware.validate(UserValidation.createUserSchema),
      asyncHandler(this.userController.createUser)
    );

    // [PUT] update user by id: user, admin
    this.router.put(
      "/:id",
      asyncHandler(this.authMiddleware.isAuthorized),
      ValidateMiddleware.validate(UserValidation.updateUserSchema),
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
