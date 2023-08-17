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
  })
  .catch((err) => {
    console.log('ERROOOOOR in DB connection');
    // console.log(err);
  });
// console.log(process.env.NODE_ENV);

const portNum = 3000;
app.listen(portNum, () => {
  console.log('listing...');
});
