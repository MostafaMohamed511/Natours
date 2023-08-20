const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
  },
  duration: {
    type: Number,
    required: [true, 'a tour must have a duration'],
  },
  maxGroupSize: {
    type: Number,
    required: [true, 'a tour must have max group size'],
  },
  difficulty: {
    type: String,
    required: true,
  },
  ratingsAverage: {
    type: Number,
    default: 4.0,
  },
  ratingsQuantity: {
    type: Number,
    default: 0,
  },
  price: Number,
  priceDiscount: Number,
  summary: {
    type: String,
    trim: true, // delete all prifex and suffix white spaces
  },
  description: {
    type: String,
    required: true,
  },
  imageCover: {
    type: String,
    required: true,
  },
  images: [String], // Array of strings
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  startDates: [Date],
});
const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
