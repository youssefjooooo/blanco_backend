const express = require("express");
const expencesRouter = require("./routes/expencesRoutes");
const serverless = require("serverless-http");
const app = express();

app.use(express.json());

app.use("/api/v1/expences", expencesRouter);

module.exports = app;
module.exports.handler = serverless(app);
