const express = require("express");
const expencesRouter = require("./routes/expencesRoutes");
const serverless = require("serverless-http");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

// Load environment variables
dotenv.config({ path: "./config.env" });

// Database connection
const DB = process.env.DATABASE_REMOTE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, { dbName: "blanco" })
  .then(() => {
    console.log("Database connected !!");
  })
  .catch((err) => {
    console.error("Database connection error:", err);
  });

// API routes
app.use("/api/v1/expences", expencesRouter);

// Serverless handler for production
if (process.env.NODE_ENV === "production") {
  // Export serverless function handler
  module.exports.handler = serverless(app);
} else {
  // Local development: run the app with app.listen()
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
}

// Export the app for use in other files (e.g., testing or other modules)
module.exports.app = app;
