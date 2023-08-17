const fs = require('fs');

const xx = fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`);
tours = JSON.parse(xx);

exports.getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    results: tours.length,
    data: {
      tours: { tours },
    },
  });
};

exports.getTour = (req, res) => {
  console.log(req.params);
  const id = req.params.id * 1;
  if (id >= tours.length)
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid Id',
    });
  const tour = tours[id];
  res.status(200).json({
    status: 'success',
    data: { tour },
  });
};

exports.addTour = (req, res) => {
  // console.log(req.body);
  const newObj = Object.assign({ id: tours.length }, req.body);
  tours.push(newObj);
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({
        states: 'success',
        data: newObj,
      });
    }
  );
};

exports.updateTour = (req, res) => {
  if (req.params.id * 1 > tours.length)
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  res.status(200).json({
    status: 'updated',
    data: {
      tour: '<Updated tour here...>',
    },
  });
};

exports.deleteTour = (req, res) => {
  if (req.params.id * 1 > tours.length)
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  res.status(204).send();
};
