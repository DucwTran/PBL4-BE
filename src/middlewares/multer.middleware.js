import multer from "multer";

import { ErrorResponse } from "~/handlers/error.response";
import {
  ALLOW_COMMON_FILE_TYPES,
  LIMIT_COMMON_FILE_SIZE,
} from "~/utils/validators";

//Cấu hình lưu trữ file trong bộ nhớ tạm thời (memory storage)
const storage = multer.memoryStorage(); 

//function check loại file được chấp nhận
const customFileFilter = (req, file, callback) => {
  //callback là hàm mà bạn gọi để báo cho multer biết kết quả kiểm tra file — chấp nhận hay từ chối.

  //Đối với multer, kiểm tra file type bằng dùng với mimetype
  if (!ALLOW_COMMON_FILE_TYPES.includes(file.mimetype)) {
    const errMessage = "File type is invalid. Only accept jpg, jpeg and png";
    return callback(new ErrorResponse(errMessage), false);
  }

  //Nếu file type hợp lệ thì ta sẽ tiếp tục xử lý
  return callback(null, true);
};

const upload = multer({
  storage: storage, //Sử dụng bộ nhớ tạm thời
  limits: {
    fileSize: LIMIT_COMMON_FILE_SIZE, // Giới hạn kích thước file là 10 MB
  },
  fileFilter: customFileFilter, // Hàm kiểm tra loại file
});

export const multerUploadMiddleware = { upload };
