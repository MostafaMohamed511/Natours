const crypto = require('crypto');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/AppError');
const sendEmail = require('./../utils/email');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES,
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;
  user.password = undefined;
  res.cookie('jwt', token, cookieOptions);
  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};

exports.signUp = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    passwordChangedAt: req.body.passwordChangedAt,
  });
  createSendToken(newUser, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new AppError('please provide an email & password', 400));
  }
  const user = await User.findOne({ email }).select('+password'); // select and + before password to get the password which is by default not selected
  // console.log(user);
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Invalid email|password', 401));
  }

  createSendToken(user, 200, res);
});

exports.protect = catchAsync(async (req, res, next) => {
  console.log('Inside authCOntroller.protect');
  // console.log(req.headers);
  let token = '';
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  )
    token = req.headers.authorization.split(' ')[1];
  if (!token) return next(new AppError('You are not loggen in', 401));

  // Verify the token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET); // it could be => jwt.verify(token , process.env.JWT_SECRET , CALL BACK FUNCTION )

  // check if user still exsists
  const freshUser = await User.findById(decoded.id);
  if (!freshUser)
    return next(
      new AppError('User belonging to the token no longer exisits ', 401)
    );

  // check if user changed password after token was issued
  if (freshUser.changedPasswordAfter(decoded.iat))
    return next(
      new AppError(
        'Password has changed after issuing the token, please loh in again',
        401
      )
    );

  // Grant Access to next middleware
  req.user = freshUser;
  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action ', 403)
      );
    }
    next();
  };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  // get user by email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError('There is no user with this email', 404));
  }

  const resetToken = user.createPasswordResetToken();
  // now we modified the user data in DB but we didn't actually save it
  // deactivate all validator that we have made before
  await user.save({ validateBeforeSave: false });

  // send it back to email
  const resetUrl = `${req.protocol}://${req.get(
    'host'
  )}/users/resetPassword/${resetToken}`;

  const message = `Forgot your password? please submit a patch request with your new password and passwordConiform to ${resetUrl}. if you did't forgot please ignore this message.`;

  try {
    await sendEmail({
      email: req.body.email,
      subject: 'password reset token (valid for 10 minutes)',
      message,
    });
    res.status(200).json({
      status: 'success',
      message: 'token sent to email !',
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save({ validateBeforeSave: false });
    console.log(err);
    return next(
      new AppError(
        'There was an error sending email. please try again later',
        500
      )
    );
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  console.log('herehere');
  if (!user) {
    return next(new AppError('invalid or expired token', 400));
  }
  console.log(user);

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  createSendToken(user, 200, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id).select('+password');
  if (!(await user.correctPassword(req.body.currentPassword, user.password))) {
    return next(new AppError('Your current password is not correct', 401));
  }
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();
  createSendToken(user, 200, res);
});
