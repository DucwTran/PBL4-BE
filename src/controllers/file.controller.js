import { OK } from "~/handlers/success.response";

export default class FileController {
  constructor(FileService) {
    this.fileService = FileService;
  }
  createPost = async (req, res) => {
    const userId = req.user?.id;
    const file = req.file;

    const newFile = await this.fileService.createPost(file, userId);
    return new OK({
      message: "Upload thành công",
      metadata: newFile,
    }).send(res);
  };

  getPostsByUser = async (req, res) => {
    const posts = await this.fileService.getPostsByUser(req.params.userId);
    return new OK({
      message: "Get successfully posts by user id!",
      metadata: posts,
    }).send(res);
  };

  getPostById = async (req, res) => {
    const post = await this.fileService.getPostById(req.params.id);
    return new OK({
      message: "Get successfully post by id!",
      metadata: post,
    }).send(res);
  };

  updatePost = async (req, res) => {
    const updated = await this.fileService.updatePost(req.params.id, req.body);
    return new OK({
      message: "Updated successfully!",
      metadata: updated,
    }).send(res);
  };

  softDeletePost = async (req, res) => {
    const result = await this.fileService.softDeletePost(req.params.id);
    return new OK({
      message: "Delete soft successfully!",
      metadata: result,
    }).send(res);
  };

  hardDeletePost = async (req, res) => {
    const result = await this.fileService.hardDeletePost(req.params.id);
    return new OK({
      message: "Delete hard successfully!",
      metadata: result,
    }).send(res);
  };

  downloadFile = async (req, res) => {
    const { id } = req.params;

    const { buffer, mimeType, imageName } = await this.fileService.downloadFile(
      id
    );

    // Thiết lập header và gửi file về client
    res.set({
      "Content-Type": mimeType,
      "Content-Disposition": `attachment; filename="${imageName}"`,
    });

    res.end(buffer);
  };

  uploadMultipleFiles = async (req, res) => {
    const userId = req.user?.id;
    const files = req.files;
    const uploadedFiles = await this.fileService.uploadMultipleFiles(
      files,
      userId
    );

    return new OK({
      message: "Upload nhiều file thành công",
      metadata: uploadedFiles,
    }).send(res);
  };

  getAllPostsOfMyselfAndFriends = async (req, res) => {
    const userId = req?.user.id;
    const result = await this.fileService.getAllPostsOfMyselfAndFriends(userId);

    return new OK({
      message: "Get successfully",
      metadata: result,
    }).send(res);
  };
}
