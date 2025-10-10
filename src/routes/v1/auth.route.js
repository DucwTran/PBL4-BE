import express from "express";
import authController from "~/controllers/auth.controller";
import asyncHandler from "~/middlewares/asyncHandler";
import authMiddleware from "~/middlewares/auth.middleware";
import ValidateMiddleware from "~/middlewares/validate.middleware";
import User from "~/models/user.model";
import authService from "~/services/auth.service";
import AuthUtil from "~/utils/auth.util";
import AuthValidation from "~/validations/auth.validation";

export default class AuthRoute {
  constructor() {
    this.router = express.Router();
    this.authController = new authController(
      new authService(User, new AuthUtil())
    );
    this.authMiddleware = new authMiddleware(new AuthUtil());
    this.setupRoutes();
  }

  setupRoutes() {
    // [POST] register
    this.router.post(
      "/register",
      ValidateMiddleware.validate(AuthValidation.registerSchema),
      asyncHandler(this.authController.register)
    );

    // [POST] login
    this.router.post(
      "/login",
      ValidateMiddleware.validate(AuthValidation.loginSchema),
      asyncHandler(this.authController.login)
    );

    //[POST] Logout
    this.router.post(
      "/logout",
      asyncHandler(this.authMiddleware.isAuthorized),
      asyncHandler(this.authController.logout)
    );

    // [POST] refreshAccessToken
    this.router.post(
      "/refreshAccessToken",
      asyncHandler(this.authController.refreshAccessToken)
    );

    // [POST] /forgot-password
    this.router.post(
      "/forgot-password",
      asyncHandler(this.authController.forgotPassword)
    );

    // [POST] /verify-otp
    this.router.post(
      "/verify-otp",
      asyncHandler(this.authController.verifyOtp)
    );
  }

  getRoute() {
    return this.router;
  }
}
