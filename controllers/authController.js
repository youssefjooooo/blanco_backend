const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const sendEmail = require("../utils/email");
const crypto = require("crypto");

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
  if (token)
    try {
      await sendEmail({
        email: user.email,
        subject: "Is this you?",
        message:
          "We noticed a new login to your account. If this was you, no action is needed. If you didn’t authorize this activity, please contact the development team or your supervisor immediately",
      });

      res.status(200).json({
        status: "success",
        token,
      });
    } catch {
      return next(
        new AppError("Couldn't send an email. Please try again later!", 400)
      );
    }
});

exports.protect = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) return next(new AppError("Please provide a token!", 401));

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  const user = await User.findById(decoded.id);

  if (!user) return next(new AppError("This user no longer exists!", 404));

  req.user = user;
  next();
});

exports.getAccountInfo = (req, res, next) => {
  if (!req.user) return next(new AppError("Not authenticated", 401));

  res.status(200).json({
    status: "success",
    user: req.user,
  });
};

exports.restrictTo = function (...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role))
      return next(
        new AppError("You're not authorized to perform this actoin", 403)
      );

    next();
  };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) return next(new AppError("This user doesn't exist!", 404));

  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  const resetUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/resetPassword/${resetToken}`;

  const message = `Forgot your password? Submit a PATCH request with your new password and confirmPassword to: ${resetUrl}. \nIf you didn't forget your password, please ignore this email!`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Your password rest token (avaliable for 10 mins)",
      message,
    });

    res.status(200).json({
      status: "success",
      message: "Email sent successfully!",
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetDate = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new AppError("There was a problem sending the email!", 400));
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetDate: { $gt: Date.now() },
  });

  if (!user) return next(new AppError("Token isn't valid or expired", 400));

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetDate = undefined;
  user.passwordResetToken = undefined;
  await user.save();

  const token = signToken(user._id);
  res.status(200).json({
    status: "success",
    token,
  });
});
