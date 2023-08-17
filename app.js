const express = require('express');
const morgan = require('morgan');

const app = express();
const portNum = 3000;
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
app.listen(portNum, () => {
  console.log('listing...');
});
