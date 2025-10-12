import Joi from "joi";
export default class FileValidation {
  static fileSchema = Joi.object({
    imageName: Joi.string().min(1).max(255).required().trim().messages({
      "string.empty": "fileName không được để trống",
      "string.max": "Độ dài tên file không quá 255 kí tự",
      "string.min": "Tên file không được để trống",
    }),
  });
}
