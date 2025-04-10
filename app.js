const express = require("express");
const expencesRouter = require("./routes/expencesRoutes");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/v1/expences", expencesRouter);

module.exports = app;
