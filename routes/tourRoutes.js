const express = require('express');
const tourController = require('./../controllers/tourControllers');
const authController = require('./../controllers/authController');

const router = express.Router();
// router.param('id', (req, res, next, val) => {
//   if (val >= tourController.toursNum)
//     return res.status(404).json({
//       status: 'fail',
//       message: 'Invalid Id',
//     });
//   next();
// });
router.route('/stats').get(tourController.getTourStats);
router.route('/plans/:year').get(tourController.getMonthlyPlan);
router
  .route('/top-5')
  .get(tourController.getCheapestFive, tourController.getAllTours);
router
  .route('/')
  .get(authController.protect, tourController.getAllTours)
  .post(tourController.addTour);
router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.deleteTour
  );

exports.cc = router;
