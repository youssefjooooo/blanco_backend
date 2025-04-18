const express = require("express");
const cors = require("cors");

const expencesRouter = require("./routes/expencesRoutes");
const usersRouter = require("./routes/usersRoutes");
const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/v1/expences", expencesRouter);
app.use("/api/v1/users", usersRouter);

app.use((req, res, next) => {
  next(new AppError(`couldn't find this route: ${req.originalUrl}`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
