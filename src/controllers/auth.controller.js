import { OK } from "~/handlers/success.response";
import ms from "ms";
export default class authController {
  constructor(AuthService) {
    this.authService = AuthService;
  }
  register = async (req, res) => {
    const { email, password } = req.body;
    await this.authService.register(email, password);

    return new OK({
      message: "Register successfully!",
    }).send(res);
  };

  login = async (req, res) => {
    const { email, password } = req.body;
    const { accessToken, refreshToken } = await this.userService.login(
      email,
      password
    );

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: ms("14 days"),
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: ms("14 days"),
    });

    return new OK({
      message: "Login successfully!",
      metadata: { accessToken },
    }).send(res);
  };

  logout = async (req, res) => {
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    return new OK({
      message: "Logout successfully!",
    }).send(res);
  };

  refreshAccessToken = async (req, res) => {
    const refreshTokenFromCookie = req.cookies?.refreshToken;
    const { accessToken } = await this.authService.refreshAccessToken(
      refreshTokenFromCookie
    );

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: false, // true nếu dùng HTTPS
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return new OK({
      metadata: { accessToken: accessToken },
      message: "Cấp accessToken mới thành công",
    }).send(res);
  };
}
