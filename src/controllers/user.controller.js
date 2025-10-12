import { OK } from "~/handlers/success.response";
import { pickUser } from "~/utils/formatters";

export default class UserController {
  constructor(UserService) {
    this.userService = UserService;
  }
  getAllUsers = async (req, res) => {
    const users = await this.userService.getAllUsers();
    return new OK({
      message: "Get successfully all users!",
      metadata: users,
    }).send(res);
  };

  getUserById = async (req, res) => {
    const user = await this.userService.getUserById(req.params.id);
    return new OK({
      message: "Get successfully user by id!",
      metadata: user,
    }).send(res);
  };

  createUser = async (req, res) => {
    const newUser = await this.userService.createUser(req.body);
    return new OK({
      message: "Created successfully!",
      metadata: pickUser(newUser),
    }).send(res);
  };

  updateUser = async (req, res) => {
    const updatedUser = await this.userService.updateUser(
      req.params.id,
      req.body
    );
    return new OK({
      message: "Updated successfully!",
      metadata: updatedUser,
    }).send(res);
  };

  deleteSoftUser = async (req, res) => {
    const deleteSoftUser = await this.userService.deleteSoftUser(req.params.id);

    return new OK({
      message: "delete successfully!",
      metadata: deleteSoftUser,
    }).send(res);
  };

  deleteUser = async (req, res) => {
    const deleteUser = await this.userService.deleteUser(req.params.id);

    return new OK({
      message: "delete successfully!",
      metadata: deleteUser,
    }).send(res);
  };
}
