import type { ErrorRequestHandler } from "express";
import { ApiError } from "./apiError";

export const errorMiddleware: ErrorRequestHandler = (error, _req, res, _next) => {
  const statusCode = error instanceof ApiError ? error.statusCode : 500;
  const message =
    error instanceof ApiError
      ? error.message
      : "Something went wrong while processing the request.";

  if (!(error instanceof ApiError)) {
    console.error(error);
  }

  res.status(statusCode).json({
    error: {
      message,
      statusCode,
    },
  });
};
