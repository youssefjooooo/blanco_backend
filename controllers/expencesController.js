const Expence = require("../models/expencesModel");

exports.getExpences = async (req, res) => {
  try {
    const expences = await Expence.find();
    res.status(200).json({
      status: "success",
      results: expences.length,
      data: {
        expences,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "failed",
      message: err,
    });
  }
};

exports.getExpence = async (req, res) => {
  try {
    const expence = await Expence.findById(req.params.id);
    res.status(200).json({
      status: "success",
      data: { expence },
    });
  } catch (err) {
    res.status(404).json({
      status: "failed",
      message: "couldn't find this item",
    });
  }
};

exports.createExpence = async (req, res) => {
  try {
    const expence = await Expence.create(req.body);
    res.status(200).json({
      status: "success",
      data: [expence],
    });
  } catch (err) {
    res.status(400).json({
      status: "failed",
      message: err,
    });
  }
};

exports.deleteExpence = async (req, res) => {
  try {
    await Expence.findByIdAndDelete(req.params.id);
    if (tour === null) throw new Error("couldn't find tour");
    res.status(200).json({
      status: "success",
      message: "item deleted successfully !",
    });
  } catch (err) {
    res.status(404).json({
      status: "failed",
      message: err,
    });
  }
};
exports.updateExpence = async (req, res) => {
  try {
    const expence = await Expence.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      status: "success",
      message: "item updated successfully !",
      data: {
        expence,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "failed",
      message: err,
    });
  }
};
