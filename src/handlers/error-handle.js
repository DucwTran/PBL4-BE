import { ReasonPhrases, StatusCodes } from "http-status-codes";

/* eslint-disable no-unused-vars */
export const errorHandler = (err, req, res, next) => {
  const statusCode = err.status || StatusCodes.INTERNAL_SERVER_ERROR;
  return res.status(statusCode).json({
    status: "error",
    code: statusCode,
    message: err.message || ReasonPhrases.INTERNAL_SERVER_ERROR,
  });
};
