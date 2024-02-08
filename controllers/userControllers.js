const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');

exports.getAllUsers = catchAsync(async (req, res) => {
  const usersData = await User.find();
  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    results: usersData.length,
    data: {
      usersData,
    },
  });
});

exports.getUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'this route is not yet completed',
  });
};
exports.addUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'this route is not yet completed',
  });
};
exports.deleteUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'this route is not yet completed',
  });
};
exports.updateUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'this route is not yet completed',
  });
};
