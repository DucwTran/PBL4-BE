import mongoose from "mongoose";
import { BadRequestError, ErrorResponse } from "~/handlers/error.response";

export default class MessageService {
  constructor(messageModel) {
    this.messageModel = messageModel;
  }

  createMessage = async (chatId, senderId, text) => {
    try {
      if (
        !mongoose.Types.ObjectId.isValid(chatId) ||
        !mongoose.Types.ObjectId.isValid(senderId)
      ) {
        throw new BadRequestError("Invalid chatId or senderId format");
      }

      const message = new this.messageModel({
        chatId,
        senderId,
        text,
      });

      const savedMessage = await message.save();

      // Populate thêm thông tin người gửi nếu muốn
      const populatedMessage = await savedMessage.populate(
        "senderId",
        "userName avatar email"
      );

      return populatedMessage;
    } catch (error) {
      throw new ErrorResponse("Failed to create message", 500);
    }
  };

  getMessages = async (data) => {
    const { chatId, limit, skip } = data;
    try {
      if (!mongoose.Types.ObjectId.isValid(chatId)) {
        throw new BadRequestError("Invalid chatId format");
      }

      const messages = await this.messageModel
        .find({ chatId })
        .populate("senderId", "userName avatar email")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

      return messages;
    } catch (error) {
      throw new ErrorResponse("Failed to get messages", 500);
    }
  };
}
