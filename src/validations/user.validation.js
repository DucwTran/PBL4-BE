import Joi from "joi";
import { USER_ROLES } from "~/utils/constant";
import {
  EMAIL_RULE,
  EMAIL_RULE_MESSAGE,
  PASSWORD_RULE,
  PASSWORD_RULE_MESSAGE,
} from "~/utils/validators";
export default class UserValidation {
  static createUserSchema = Joi.object({
    email: Joi.string().email().required().trim().pattern(EMAIL_RULE).messages({
      "string.email": "Email không hợp lệ",
      "string.pattern.base": EMAIL_RULE_MESSAGE,
      "any.required": "Email là bắt buộc",
    }),

    password: Joi.string()
      .min(6)
      .required()
      .trim()
      .pattern(PASSWORD_RULE)
      .messages({
        "string.min": "Password phải tối thiểu 6 ký tự",
        "string.pattern.base": PASSWORD_RULE_MESSAGE,
        "any.required": "Password là bắt buộc",
      }),
  });

  static updateUserSchema = Joi.object({
    email: Joi.string().email().trim().pattern(EMAIL_RULE).messages({
      "string.email": "Email không hợp lệ",
      "string.pattern.base": EMAIL_RULE,
    }),
    password: Joi.string().min(6).pattern(PASSWORD_RULE).trim().messages({
      "string.min": "Password phải tối thiểu 6 ký tự",
      "string.pattern.base": PASSWORD_RULE_MESSAGE,
    }),
    userName: Joi.string().trim().max(20).messages({
      "string.max": "userName chỉ tối đa 20 kí tự",
    }),
    role: Joi.string().valid(USER_ROLES.ADMIN, USER_ROLES.USER).messages({
      "any.only": "Role chỉ có thể là admin/user",
    }),
    avatar: Joi.string(),
    isActive: Joi.boolean().messages({
      "boolean.base": "Trường này chỉ có thể là True/False",
    }),
  });
}
