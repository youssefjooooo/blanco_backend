const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");

const AppError = require("../utils/appError");

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES,
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const user = await User.create(req.body);
  const token = signToken(user._id);
  res.status(200).json({
    status: "success",
    token,
    data: user,
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password)
    return next(new AppError("Enter email and password!", 404));

  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.isPasswordCorrect(password, user.password)))
    return next(new AppError("Incorrect email or password"));

  const token = signToken(user._id);

  res.status(200).json({
    status: "success",
    token,
  });
});

exports.getAccountInfo = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) return next(new AppError("Please provide a token!", 401));
  const decoded_token = await promisify(jwt.verify)(
    token,
    process.env.JWT_SECRET
  );

  const user = await User.findById(decoded_token.id);
  if (!user) return next(new AppError("This user no longer exists!", 404));

  res.status(200).json({
    status: "success",
    user,
  });
  req.user = user; // optional but useful
});
