import bcrypt from "bcryptjs";
import JWT from "jsonwebtoken";

export default class AuthUtil {
  hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    return hash;
  };

  comparePassword = async (inputPassword, hashedPassword) => {
    const check = await bcrypt.compare(inputPassword, hashedPassword);
    return check;
  };

  generateToken = async (userInfo, secretSignature, tokenLife) => {
    try {
      return JWT.sign(userInfo, secretSignature, {
        algorithm: "HS256",
        expiresIn: tokenLife,
      });
    } catch (error) {
      throw new Error(error);
    }
  };

  verifyToken = async (token, secretSignature) => {
    try {
      return JWT.verify(token, secretSignature);
    } catch (error) {
      throw new Error(error);
    }
  };
}
