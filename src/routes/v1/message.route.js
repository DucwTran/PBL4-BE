import express from "express";
import asyncHandler from "~/middlewares/asyncHandler";
import AuthMiddleware from "~/middlewares/auth.middleware";
import AuthUtil from "~/utils/auth.util";
import MessageController from "~/controllers/message.controller";
import MessageService from "~/services/message.service";
import Message from "~/models/message.model";

export default class MessageRoute {
  constructor() {
    this.router = express.Router();
    this.messageController = new MessageController(new MessageService(Message));
    this.authMiddleware = new AuthMiddleware(new AuthUtil());
    this.setupRoutes();
  }

  setupRoutes() {
    // [POST] Create message - user
    this.router.post(
      "/",
      asyncHandler(this.authMiddleware.isAuthorized),
      asyncHandler(this.messageController.createMessage)
    );
    // [GET]  Get messages by chatRoomId - user
    this.router.get(
      "/:chatId",
      asyncHandler(this.authMiddleware.isAuthorized),
      asyncHandler(this.messageController.getMessages)
    )
  }

  getRoute() {
    return this.router;
  }
}
