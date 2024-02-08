const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/AppError');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES,
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
  const token = signToken(newUser._id);
  //jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
  // expiresIn: process.env.JWT_EXPIRES,
  //});

  res.status(201).json({
    status: 'success',
    token,
    data: {
      user: newUser,
    },
  });
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

  const token = signToken(user._id);
  res.status(200).json({
    status: 'success',
    token,
  });
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
