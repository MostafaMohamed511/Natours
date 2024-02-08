const express = require('express');
const authController = require('./../controllers/authController');

const userController = require('./../controllers/userControllers');

const router = express.Router();
router.post('/signup', authController.signUp);
router.post('/login', authController.login);
router
  .route('/')
  .get(authController.protect, userController.getAllUsers)
  .post(userController.addUser);
router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);
module.exports = router;
