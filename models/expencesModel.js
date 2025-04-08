const mongoose = require("mongoose");

const expencesSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "an expence must have a title"],
      trim: true,
      unique: [true, "an expence can't have the dublicate titles"],
    },
    description: {
      type: String,
      trim: true,
    },
    amount: {
      type: Number,
      required: [true, "an expence must have an amount"],
    },
    status: String,
  },
  { collection: "expences" }
);

const Expence = mongoose.model("Expence", expencesSchema);

module.exports = Expence;
