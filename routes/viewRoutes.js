const express = require('express');
const authController = require('./../controllers/authController');
const viewController = require('../controllers/viewController');
const router = express.Router();

router.get('/signup' , viewController.getSignupForm);
router.get('/login' , viewController.getLoginForm);
router.get('/resetPassword' , viewController.getResetPassword);
router.get('/home' , viewController.getHomePage);
router.get('/about' , viewController.getAboutPage);
router.get('/profile' , authController.protect, viewController.getProfilePage);

module.exports = router;