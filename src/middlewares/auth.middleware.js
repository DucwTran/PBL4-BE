import { env } from "~/config/environment";
import {
  AuthFailureError,
  ErrorResponse,
  GoneError,
} from "~/handlers/error.response";

export default class AuthMiddleware {
  constructor(AuthUtil) {
    this.authUtil = AuthUtil;
  }

  isAuthorized = async (req, res, next) => {
    const accessTokenFromCookie = req.cookies?.accessToken;
    try {
      if (!accessTokenFromCookie) {
        next(AuthFailureError("You are not authorized!"));
        return;
      }
      //Verify token
      const accessTokenFromCookieDecoded = await this.authUtil.verifyToken(
        accessTokenFromCookie,
        env.ACCESS_TOKEN_SECRET_SIGNATURE
      );

      //Attach user info to req object
      req.user = accessTokenFromCookieDecoded;
      next();
    } catch (error) {
      //Nếu accessToken hết hạn thì mình cần trả về mã lỗi GONE - 410 cho FE để biết gọi lại API refresh token
      if (error?.message?.includes("jwt expired")) {
        next(new GoneError("Your session has expired."));
        return;
      }
      next(new ErrorResponse(error));
    }
  };

  isAdmin = async (req, res, next) => {
    this.isAuthorized(req, res, async (err) => {
      if (err) return next(err);
      try {
        if (req.user.role === "admin") {
          next();
        } else {
          throw new AuthFailureError("You're not allowed to do that!!");
        }
      } catch (error) {
        next(new ErrorResponse("You're not allowed to do that!"));
      }
    });
  };
}
