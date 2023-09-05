const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: true,
      maxlength: [40, 'tourname must be less than or equal 40 chars'],
      minlength: [5, 'tourname must be more than or equal 40 chars'],
      //validate: [validator.isAlpha, 'tour name must only contain charachters'],
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
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty is easy , medium or difiicult',
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.0,
      min: [1, 'rating average must be above 1.0'],
      max: [5, 'rating average must be below 5.0'],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: Number,
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          // this keyword will only work with new document creation
          return val < this.price;
        },
        message: 'price discount({VALUE}) must be less than the price', // {VALUE} will work and get priceDiscount value
      },
    },
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
    slug: String,
    secretTour: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

// Document middelware  runs after save() or create()
tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name);
  next();
});

tourSchema.pre('save', function (next) {
  //console.log('saving the document...');
  next();
});

tourSchema.post('save', function (doc, next) {
  // console.log(doc);
  next();
});

//query middle ware
// tourSchema.pre('find', function (next) {
// regular expression used to get every query strats with fin AKA find , findOne , findOneANdDelete
tourSchema.pre(/^find/, function (next) {
  this.find({
    secretTour: { $ne: true },
  });
  this.start = Date.now();
  next();
});
tourSchema.post(/^find/, function (docs, next) {
  console.log(`Query took ${Date.now() - this.start} milliseconds`);
  next();
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
