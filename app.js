const express = require('express');
const morgan = require('morgan');
const AppError = require('./utils/AppError');
const globalErrorHandler = require('./controllers/errorController');

const app = express();
app.use(express.json());
app.use(morgan('dev'));
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
