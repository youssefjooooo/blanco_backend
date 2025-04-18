const Expence = require("../models/expencesModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
exports.getExpences = catchAsync(async (req, res, next) => {
  const expences = await Expence.find();
  res.status(200).json({
    status: "success",
    results: expences.length,
    data: {
      expences,
    },
  });
});

exports.getExpence = catchAsync(async (req, res, next) => {
  const expence = await Expence.findById(req.params.id);
  res.status(200).json({
    status: "success",
    data: { expence },
  });
});

exports.createExpence = catchAsync(async (req, res, next) => {
  const expence = await Expence.create(req.body);
  res.status(200).json({
    status: "success",
    data: [expence],
  });
});

exports.deleteExpence = catchAsync(async (req, res, next) => {
  const expence = await Expence.findByIdAndDelete(req.params.id);

  if (!expence) return next(new AppError("Item Id not found", 404));

  res.status(200).json({
    status: "success",
    message: "item deleted successfully !",
  });
});
exports.updateExpence = catchAsync(async (req, res, next) => {
  const expence = await Expence.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!expence) return next(new AppError("Item Id not found", 404));

  res.status(200).json({
    status: "success",
    message: "item updated successfully !",
    data: {
      expence,
    },
  });
});

exports.generalStats = catchAsync(async (req, res, next) => {
  const expences = await Expence.aggregate([
    {
      $group: {
        _id: "$status",
        totalExpences: { $sum: "$amount" },
      },
    },
  ]);

  res.status(200).json({
    status: "success",
    data: expences,
  });
});
