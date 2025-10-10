import Joi from "joi";
export default class AuthValidation {
  static registerSchema = Joi.object({
    email: Joi.string().email().required().trim().messages({
      "string.email": "Email không hợp lệ",
      "any.required": "Email là bắt buộc",
    }),

    password: Joi.string().min(6).required().trim().messages({
      "any.required": "Password là bắt buộc",
    }),
  });
  
  static loginSchema = Joi.object({
    email: Joi.string().email().required().trim().messages({
      "string.email": "Email không hợp lệ",
      "any.required": "Email là bắt buộc",
    }),

    password: Joi.string().min(6).required().trim().messages({
      "any.required": "Password là bắt buộc",
    }),
  });
}
