const globalErrorHandler = (err, req, res, next) => {
  const productionErrors = (err, res) => {
    if (err.isOperational) {
      res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    } else {
      res.status(500).json({
        status: "fail",
        message: "something went very wrong in the server!",
      });
    }
  };

  const developmentErrors = (err, res) => {
    res.status(err.statusCode).json({
      status: err.status,
      stack: err.stack,
      error: err,
      message: err.message,
    });
  };

  err.status = err.status || "fail";
  err.statusCode = err.statusCode || 500;

  const environment = process.env.NODE_ENV;
  if (environment === "development") developmentErrors(err, res);
  else if (environment === "production") productionErrors(err, res);
};

module.exports = globalErrorHandler;
