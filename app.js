const express = require("express");
const expencesRouter = require("./routes/expencesRoutes");
const serverless = require("serverless-http");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const app = express();
app.use(cors());
dotenv.config({ path: "./config.env" });

const DB = process.env.DATABASE_REMOTE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    dbName: "blanco",
  })
  .then(() => {
    console.log("Database connected !!");
  });

app.use(express.json());
app.use("/api/v1/expences", expencesRouter);

if (process.env.NODE_ENV === "production") {
  // In a serverless environment, use serverless-http
  module.exports.handler = serverless(app);
} else {
  // In local development, use app.listen()
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
}

module.exports.app = app;
