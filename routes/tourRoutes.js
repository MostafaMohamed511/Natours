const express = require('express');
const tourController = require('./../controllers/tourControllers');

const router = express.Router();
// router.param('id', (req, res, next, val) => {
//   if (val >= tourController.toursNum)
//     return res.status(404).json({
//       status: 'fail',
//       message: 'Invalid Id',
//     });
//   next();
// });
router.route('/').get(tourController.getAllTours).post(tourController.addTour);
router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

exports.cc = router;
