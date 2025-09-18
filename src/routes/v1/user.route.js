import express from "express";
import userController from "~/controllers/user.controller";
import asyncHandler from "~/middlewares/asyncHandler";
import ValidateMiddleware from "~/middlewares/validate.middleware";
import User from "~/models/user.model";
import userService from "~/services/user.service";
import AuthUtil from "~/utils/auth.util";
import UserValidation from "~/validations/user.validation";

export default class UserRoute {
  constructor() {
    this.router = express.Router();
    this.userController = new userController(
      new userService(User, new AuthUtil())
    );
    this.setupRoutes();
  }

  setupRoutes() {
    // [GET] get all users
    this.router.get("/", asyncHandler(this.userController.getAllUsers));

    // [GET] get user by id
    this.router.get("/:id", asyncHandler(this.userController.getUserById));

    // [POST] create user
    this.router.post(
      "/",
      ValidateMiddleware.validate(UserValidation.createUserSchema),
      asyncHandler(this.userController.createUser)
    );

    // [PUT] update user by id
    this.router.put(
      "/:id",
      ValidateMiddleware.validate(UserValidation.updateUserSchema),
      asyncHandler(this.userController.updateUser)
    );

    // [DELETE] delete soft user by id
    this.router.delete(
      "/softdelete/:id",
      asyncHandler(this.userController.deleteSoftUser)
    );

    // [DELETE] delete hard user by id
    this.router.delete("/:id", asyncHandler(this.userController.deleteUser));
  }

  getRoute() {
    return this.router;
  }
}
