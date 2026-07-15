export class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
  }
}

export const AppSuccess = (res, status, data = null) => {
  return res.status(status).json({
    success: true,
    message: "Request success",
    ...(data !== null && {data})
  })
}