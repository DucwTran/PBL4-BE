import { OK } from "~/handlers/success.response";

export default class ChatController {
  constructor(chatService) {
    this.chatService = chatService;
  }

  createChat = async (req, res) => {
    const { firstId, secondId } = req.body;

    const result = await this.chatService.createChat(firstId, secondId);
    return new OK({
      message: "Create chat successfully",
      metadata: result,
    }).send(res);
  };

  findUserChats = async (req, res) => {
    const { userId } = req.params;

    const result = await this.chatService.findUserChats(userId);
    return new OK({
      message: "Get user chats successfully",
      metadata: result,
    }).send(res);
  };

  findChat = async (req, res) => {
    const { firstId, secondId } = req.params;

    const result = await this.chatService.findChat(firstId, secondId);
    return new OK({
      message: "Get chat successfully",
      metadata: result,
    }).send(res);
  };
}
