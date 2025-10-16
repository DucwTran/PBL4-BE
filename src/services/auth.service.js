import {
  ConflictRequestError,
  ErrorResponse,
  NotFoundError,
} from "~/handlers/error.response";
import bcrypt from "bcryptjs";
import { env } from "~/config/environment";
import transporter from "~/config/mailer.config";
import { pickUser } from "~/utils/formatters";

// Dùng http only cookie cho cả accessToken và refreshToken, thay vì trả accessToken cho FE rồi gửi handle ở localStorage và thủ công gán ở header

export default class AuthService {
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

  sendOtpToMail = async (email) => {
    const user = await this.userModel.findOne({ email });
    if (!user) throw new NotFoundError("Email không tồn tại");

    const otp = this.authUtil.generateOTP();
    const otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000);

    user.otp = otp;
    user.otpExpiresAt = otpExpiresAt;
    await user.save();

    await transporter.sendMail({
      from: `"Support" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Mã OTP khôi phục mật khẩu",
      html: `<p>Mã OTP của bạn là: <b>${otp}</b>. OTP chỉ có hiệu lực 5 phút</p>`,
    });

    return { message: "Đã gửi OTP tới email." };
  };

  verifyOtpAndResetPassword = async (email, otp, newPassword) => {
    const user = await this.userModel.findOne({ email });
    if (!user || user.otp !== otp || !user.otpExpiresAt) {
      throw new ErrorResponse(user.otpExpiresAt);
    }
    if (user.otpExpiresAt < new Date()) {
      throw new ErrorResponse("OTP đã hết hạn");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    user.otp = null;
    user.otpExpiresAt = null;
    await user.save();

    return { message: "Mật khẩu đã được đặt lại thành công" };
  };

  getProfile = async (userId) => {
    const user = await this.userModel.findById(userId);

    if (!user) {
      throw new NotFoundError("User not found");
    }

    return pickUser(user);
  };
}
