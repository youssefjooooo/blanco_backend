const mongoose = require("mongoose");
const dotenv = require("dotenv");
const app = require("./app");

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

const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`server is running on port ${port}....`);
});
