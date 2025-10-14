import { OK } from "~/handlers/success.response";

export default class MessageController {
  constructor(messageService) {
    this.messageService = messageService;
  }

  createMessage = async (req, res) => {
    const { chatId, senderId, text } = req.body;

    const result = await this.messageService.createMessage(
      chatId,
      senderId,
      text
    );
    return new OK({
      message: "Create chat successfully",
      metadata: result,
    }).send(res);
  };

  getMessages = async (req, res) => {
    const { chatId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const result = await this.messageService.getMessages({
      chatId,
      page,
      limit,
      skip,
    });
    result.page = page;

    return new OK({
      message: "Get user chats successfully",
      metadata: result,
    }).send(res);
  };
}
