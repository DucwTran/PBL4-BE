import mongoose from "mongoose";
import { ErrorResponse, NotFoundError } from "~/handlers/error.response";

export default class ChatService {
  constructor(chatModel) {
    this.chatModel = chatModel;
  }

  createChat = async (firstId, secondId) => {
    try {
      const firstObjectId = new mongoose.Types.ObjectId(firstId);

      const secondObjectId = new mongoose.Types.ObjectId(secondId);

      if (
        !mongoose.Types.ObjectId.isValid(firstObjectId) ||
        !mongoose.Types.ObjectId.isValid(secondObjectId)
      ) {
        throw new NotFoundError("Invalid user ID format");
      }
      const existingChat = await this.chatModel.findOne({
        members: { $all: [firstId, secondId] },
      });

      if (existingChat) {
        return existingChat;
      }

      const newChat = new this.chatModel({
        members: [firstObjectId, secondObjectId],
      });

      const savedChat = await newChat.save();
      const populatedChat = await savedChat.populate(
        "members",
        "userName avatar email"
      );

      return populatedChat;
    } catch (err) {
      throw new ErrorResponse(`error: ${err}`);
    }
  };

  findUserChats = async (userId) => {
    try {
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new NotFoundError("Invalid user ID");
      }

      const chats = await this.chatModel
        .find({
          members: { $in: [userId] },
        })
        .populate("members", "userName avatar email")
        .sort({ updatedAt: -1 });

      return chats;
    } catch (err) {
      throw new ErrorResponse("Server error");
    }
  };

  findChat = async (firstId, secondId) => {
    try {
      if (
        !mongoose.Types.ObjectId.isValid(firstId) ||
        !mongoose.Types.ObjectId.isValid(secondId)
      ) {
        throw new NotFoundError("Invalid user ID format");
      }

      const chat = await this.chatModel
        .findOne({
          members: { $all: [firstId, secondId] },
        })
        .populate("members", "userName avatar email");

      if (!chat) {
        throw new NotFoundError("Chat not found");
      }
      return chat;
    } catch (err) {
      throw new ErrorResponse("Server error");
    }
  };
}
