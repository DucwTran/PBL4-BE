import { ReasonPhrases, StatusCodes } from "http-status-codes";

/* eslint-disable no-unused-vars */
export const errorHandler = (err, req, res, next) => {
  if (err.isJoi) {
    return res.status(400).json({
      code: 400,
      message: "Validation error",
      errors: err.details.map((e) => e.message),
    });
  }

  const statusCode = err.status || StatusCodes.INTERNAL_SERVER_ERROR;
  return res.status(statusCode).json({
    status: "error",
    code: statusCode,
    message: err.message || ReasonPhrases.INTERNAL_SERVER_ERROR,
  });
};
