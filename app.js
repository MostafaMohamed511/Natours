const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const hpp = require('hpp');
const rateLimit = require('express-rate-limit');
const AppError = require('./utils/AppError');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const globalErrorHandler = require('./controllers/errorController');

const app = express();
// MIDDLEWARES

// set security HTTP headers
app.use(helmet());

// Limit amout of requests from the same api
//app.use('/api' , limiter);  // you can use like this to use the middleware with any route starts with /api
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this Api. Please try again in an hour',
});
app.use(limiter);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Data sanitization against noSQL query injection
app.use(mongoSanitize());

// Data sanitization against xss
app.use(xss());

// Prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'price',
      'difficulty',
      'maxGroupSize',
      'ratingsQuantity',
      'ratingsAverage',
    ],
  })
);

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// app.get('/', (request, response) => {
//   response.status(200).send('hello!!!');
// });

// app.get('/tours', getAllTours);
// app.get('/tours/:id', getTour);
// app.post('/tours', addTour);
// app.patch('/tours/:id', updateTour);
// app.delete('/tours/:id', deleteTour);

const toursRouter = require('./routes/tourRoutes');
const usersRouter = require('./routes/userRoutes');
app.use('/tours', toursRouter.cc);
app.use('/users', usersRouter);

app.all('*', (req, res, next) => {
  // const err = new Error(`cant find ${req.originalUrl} on the server`);
  // err.statusCode = 404;
  // err.status = 'fail';

  next(new AppError(`cant find ${req.originalUrl} on the server`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
