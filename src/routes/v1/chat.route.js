import express from "express";
import asyncHandler from "~/middlewares/asyncHandler";
import AuthMiddleware from "~/middlewares/auth.middleware";
import AuthUtil from "~/utils/auth.util";
import Chat from "~/models/chat.model";
import ChatService from "~/services/chat.service";
import ChatController from "~/controllers/chat.controller";

export default class ChatRoute {
  constructor() {
    this.router = express.Router();
    this.chatController = new ChatController(new ChatService(Chat));
    this.authMiddleware = new AuthMiddleware(new AuthUtil());
    this.setupRoutes();
  }

  setupRoutes() {
    // [POST] Create Chat Room - user
    this.router.post(
      "/",
      asyncHandler(this.authMiddleware.isAuthorized),
      asyncHandler(this.chatController.createChat)
    );
    // [GET]  Get Chat Rooms by User ID - user
    this.router.get(
      "/:userId",
      asyncHandler(this.authMiddleware.isAuthorized),
      asyncHandler(this.chatController.findUserChats)
    );
    // [GET]  Get Chat Room by memberIds - user
    this.router.get(
      "/find/:firstId/:secondId",
      asyncHandler(this.authMiddleware.isAuthorized),
      asyncHandler(this.chatController.findChat)
    );
  }

  getRoute() {
    return this.router;
  }
}
