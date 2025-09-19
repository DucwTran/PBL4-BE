import { ConflictRequestError, NotFoundError } from "~/handlers/error.response";
import bcrypt from "bcryptjs";
import { env } from "~/config/environment";

// Dùng http only cookie cho cả accessToken và refreshToken, thay vì trả accessToken cho FE rồi gửi handle ở localStorage và thủ công gán ở header

export default class authService {
  constructor(User, AuthUtil) {
    this.userModel = User;
    this.authUtil = AuthUtil;
  }
  register = async (email, password) => {
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

  login = async (email, password) => {
    //Kiểm tra email có tồn tại không
    const user = await this.userModel.findOne({ email: email });
    if (!user) throw new NotFoundError("User not found!");

    //Kiểm tra password có đúng không
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error("Invalid password");

    // Tạo payload
    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    // Tạo token
    const accessToken = await this.authUtil.generateToken(
      payload,
      env.ACCESS_TOKEN_SECRET_SIGNATURE,
      env.ACCESS_TOKEN_LIFE
    );
    const refreshToken = await this.authUtil.generateToken(
      payload,
      env.REFRESH_TOKEN_SECRET_SIGNATURE,
      env.REFRESH_TOKEN_LIFE
    );

    return { accessToken, refreshToken };
  };

  refreshAccessToken = async (refreshTokenFromReq) => {
    if (!refreshTokenFromReq) {
      throw new Error("Không có refreshToken!");
    }

    const REFRESH_TOKEN_SECRET_SIGNATURE = env.REFRESH_TOKEN_SECRET_SIGNATURE;
    const ACCESS_TOKEN_SECRET_SIGNATURE = env.ACCESS_TOKEN_SECRET_SIGNATURE;
    const ACCESS_TOKEN_LIFE = env.ACCESS_TOKEN_LIFE;

    // Xác nhận refreshToken
    const refreshTokenDecoded = this.authUtil.verifyToken(
      refreshTokenFromReq,
      REFRESH_TOKEN_SECRET_SIGNATURE
    );

    //Lấy lại data để đỡ 1 bước query
    const userInfo = {
      id: refreshTokenDecoded.id,
      email: refreshTokenDecoded.email,
      role: refreshTokenDecoded.role,
    };

    // Tạo accessToken mới
    const accessToken = await this.authUtil.generateToken(
      userInfo,
      ACCESS_TOKEN_SECRET_SIGNATURE,
      ACCESS_TOKEN_LIFE
    );

    return { accessToken };
  };
}
