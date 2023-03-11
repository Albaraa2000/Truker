const express = require('express');
const router = express.Router();
const customerControllers = require('../controllers/customerControllers');
const authController = require('../controllers/authControllers');



router.post('/login',authController.login)
router.post('/signup',authController.signup)
router.post('/forgotPassword',authController.forgotPassword)
router.patch('/resetPassword/:token',authController.resetPassword)
router.patch('/updatePassword',authController.protect,authController.updatePassword)
router.patch('/updateMe',authController.protect,customerControllers.updateMe)


router
  .route('/')
  .get(customerControllers.getAllusers)
  .post(customerControllers.createUser);
router
  .route('/:id')
  // .get(authController.protect,authController.restrictTo('admin'),customerControllers.getUser)
  .get(customerControllers.getUser)
  .patch(customerControllers.updateUser)
  .delete(customerControllers.deleteUser);
module.exports = router;
