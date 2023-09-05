const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

const app = require('./app');
const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);
console.log(DB);
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    // useFindAndModify: false,
  })
  //    {useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true }
  .then((conObj) => {
    // console.log(conObj.connections);
    console.log('DB connected successfully');
  });

// console.log(process.env.NODE_ENV);

const portNum = 3000;
const server = app.listen(portNum, () => {
  console.log('listing...');
});

process.on('unhandledRejection', (err) => {
  console.log('unhandled Rejection');
  console.log(err.name);
  console.log(err.message);
  server.close(() => {
    process.exit(1);
  });
});

process.on('uncaughtException', (err) => {
  console.log('uncaught Exception');
  console.log(err.name);
  console.log(err.message);
  server.close(() => {
    process.exit(1);
  });
});
