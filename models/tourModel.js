const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
  },
  rating: {
    type: Number,
    default: 4.0,
  },
  price: Number,
});
const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
