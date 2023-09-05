const AppError = require('./../utils/AppError');

const handelCastErrorDB = (err) => {
  const message = `Invalid ${err.path} value(${err.value})`;
  return new AppError(message, 400);
};

const handelValidatorErrorDB = (err) => {
  //const errors = Object.getOwnPropertyNames(err.errors);
  const messages = Object.values(err.errors).map((el) => el.message);
  const message = `Inavalid input :  ${messages.join(', ')}`;
  return new AppError(message, 400);
};

const handelDuplicateValueDB = (err) => {
  const prop = Object.getOwnPropertyNames(err.keyPattern);
  const message = `Duplicate field value(s) : ${prop} , please use another value(s) `;
  return new AppError(message, 400);
};

const sendDevError = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};
const sendProdError = (err, res) => {
  if (err.isOperational) {
    // operational, trusted errors : send message to the client
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    // programming or unknown error , don't leak information to the client

    // 1 ) log error to console
    //   console.error('Error', err);

    //2) send generic message
    res.status(500).json({
      status: 'error',
      message: 'Somthing went wrong',
    });
  }
};

module.exports = (err, req, res, next) => {
  err.status = err.status || 'fail';
  err.statusCode = err.statusCode || 500;
  if (process.env.NODE_ENV === 'development') {
    sendDevError(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    if (error.name === 'CastError') error = handelCastErrorDB(error);
    if (error.code === 11000) error = handelDuplicateValueDB(error);
    if (error._message === 'Validation failed')
      error = handelValidatorErrorDB(error);

    sendProdError(error, res);
  }
};
