// Load environment variables
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const serverless = require("serverless-http");

dotenv.config({ path: "./config.env" });
const app = require("./app");
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
