export const errorHandler = (err, req, res, next) => {
  console.log(err);
  res.status(err.statusCode || 500).json({
    message: err.publicMessage || "Request failed",
    error: err.message,
  });
};
