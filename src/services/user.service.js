import { ConflictRequestError, NotFoundError } from "~/handlers/error.response";
import { INVALID_UPDATE_USER_FIELDS } from "~/utils/constant";
import { pickUser } from "~/utils/formatters";

export default class UserService {
  constructor(User, AuthUtil) {
    this.userModel = User;
    this.authUtil = AuthUtil;
  }

  getAllUsers = async () => {
    const users = await this.userModel.find();
    return users.map((user) => {
      return pickUser(user);
    });
  };

  getUserById = async (userId) => {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundError("User not found!");
    }
    return pickUser(user);
  };

  createUser = async (userData) => {
    const { email, password } = userData;

    // Kiểm tra email đã dùng chưa
    const emailExisting = await this.userModel.find({ email: email });
    if (!emailExisting) {
      throw new ConflictRequestError("Email was exist!");
    }

    const hashPassword = await this.authUtil.hashPassword(password);

    const newUser = new this.userModel({
      email,
      password: hashPassword,
    });
    await newUser.save();
    return newUser;
  };

  updateUser = async (userId, updateData) => {
    //Xóa các trường không dược thay đổi ở updateData
    Object.keys(updateData).forEach((fieldName) => {
      if (INVALID_UPDATE_USER_FIELDS.includes(fieldName))
        delete updateData[fieldName];
    });

    //Lấy ra và kiểm tra account có tồn tại không
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundError("User not found!");
    }

    //Kiểm tra email mới có tồn tại không
    const existingEmail = await this.userModel.findOne({
      email: updateData.email,
    });
    if (existingEmail && existingEmail._id.toString() != user._id.toString()) {
      throw new ConflictRequestError("Email was existing!");
    }
    if (
      existingEmail._id.toString() == user._id.toString() &&
      updateData.email
    ) {
      delete updateData.email;
    }

    //Nếu cập nhập mật khẩu thì phải hash rồi mới lưu
    if (updateData.password) {
      const hashPassword = this.authUtil.hashPassword(updateData.password);
      updateData.password = hashPassword;
    }

    //Cập nhật lại thông tin
    const updatedUser = await this.userModel.findByIdAndUpdate(
      userId,
      { ...updateData, updatedAt: new Date() },
      { new: true }
    );
    return updatedUser;
  };

  deleteSoftUser = async (userId) => {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundError("User not found!");
    }

    return await this.userModel.findByIdAndUpdate(
      userId,
      {
        isDeleted: true,
      },
      { new: true }
    );
  };

  deleteUser = async (userId) => {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundError("User not found!");
    }

    return await this.userModel.deleteOne({ _id: userId });
  };
}
