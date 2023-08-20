const Tour = require('./../models/tourModel');

exports.getAllTours = async (req, res) => {
  //console.log(req.query);
  try {
    // const toursData = await Tour.find()
    //   .where('duration')
    //   .lt(5)
    //   .where('difficulty')
    //   .equals('easy');

    // filtering
    const queryObj = { ...req.query };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((el) => delete queryObj[el]);
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (m) => `$${m}`);
    let query = Tour.find(JSON.parse(queryStr));

    //sorting
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query.sort(sortBy);
    } else {
      query.sort('-createdAt');
    }

    //field limiting
    if (req.query.limit) {
      const fields = req.query.limit.split(',').join(' ');
      query.select(fields);
    } else {
      query.select('-__v');
    }

    const toursData = await query;
    res.status(200).json({
      status: 'success',
      requestedAt: req.requestTime,
      results: toursData.length,
      data: {
        tours: { toursData },
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    res.status(200).json({
      status: 'success',
      requestedAt: req.requestTime,
      data: {
        tour: tour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.addTour = async (req, res) => {
  // const newTour  = new Tour(req.body);
  // newTour.save();
  try {
    const newTour = await Tour.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      status: 'updated',
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (err) {
    res.status(400).send({
      status: 'fail',
      message: err,
    });
  }
};
