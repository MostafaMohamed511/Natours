const express = require('express');
const tourController = require('./../controllers/tourControllers');
const router = express.Router();

router.route('/').get(tourController.getAllTours).post(tourController.addTour);
router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

exports.cc = router;
