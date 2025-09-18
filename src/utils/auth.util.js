import bcrypt from "bcryptjs";

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
}
