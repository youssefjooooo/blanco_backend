const express = require("express");
const expencesRouter = require("./routes/expencesRoutes");

const cors = require("cors");

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Built-in Express JSON parser

// API routes
app.use("/api/v1/expences", expencesRouter);

// Export the app for use in other files (e.g., testing or other modules)
module.exports = app;
