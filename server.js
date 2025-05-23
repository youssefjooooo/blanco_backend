// Load environment variables
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config({ path: "./config.env" });
const app = require("./app");

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

app.get("/api/v1/expences", (req, res) => {
  res.status(200).json({
    message: "Server is running",
    env: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

const port = process.env.PORT || 3000;
if (process.env.NODE_ENV === "production") {
  app.listen(port, () => {
    console.log(`Server running in production at http://localhost:${port}`);
  });
} else {
  app.listen(port, () => {
    console.log(`Server running in development at http://localhost:${port}`);
  });
}
