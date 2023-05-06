const express = require('express');
const authController = require('./../controllers/authController');
const viewController = require('../controllers/viewController');
const router = express.Router();

console.log('in the viewRouter');
router.get('/login' , viewController.getLoginForm);
router.get('/signup' , viewController.getSignupForm);
router.get('/home' , viewController.getHomePage);
router.get('/about' , viewController.getAboutPage);
router.get('/profile' , viewController.getProfilePage);

// router.post('/signup' , viewController.getSignupForm);


module.exports = router;