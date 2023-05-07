const User = require("./../models/userModel");
const jwt = require("jsonwebtoken");
const catchAsync = require("./../utils/catchAsync");
const { promisify } = require('util');

// CREATE TOKEN
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

// CREATE AND SEND TOKEN AND SET COOKIE 
const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);

  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === "production") cookieOptions.secure = true;

  res.cookie("jwt", token, cookieOptions);

  // Remove password from output
  user.password = undefined;
  return token;

};

// SIGN UP
exports.signup = catchAsync(async (req, res, next) => {
  if(req.body.password !== req.body.passwordConfirm){
    req.flash('error' , 'Please check your password!');
    res.redirect('/signup');
  }
  
  const newUser = await User.create(req.body);
  const token = createSendToken(newUser, 201, res);
  if(newUser && token){
    req.flash('success' , 'Yupp!! Your account has been created... :)');
    res.redirect('/login');
  }else {
    req.flash('error' , 'Something went wrong.. Try Again!');
    res.redirect('/signup');
  }
});

// LOGIN
exports.login = catchAsync (async(req, res, next) => {
    const {email , password} = req.body;

  // 1 Check if email and password exist
  if(!email || !password){
    req.flash('error' , 'Please provide email and password!');
    res.redirect('/login');
    // return next(new AppError('Please provide email and password!' , 400));
  }

  // 2) Check if user existe && password is correct
  const user = await User.findOne({email}).select('+password');

  if(!user || !(await user.correctPassword(password, user.password))){
    req.flash('error' , 'Incorrect email or password!');
    res.redirect('/login');
    // return next(new AppError('Incorrect email or password' , 401));
  }
  // 3) If everything ok, send token to client
  const token = createSendToken(user, 200, res);
   if(token){
    req.flash('success' , 'Yupp!! Logged In :)');
    req.flash('name' , user.name);
    res.redirect('/profile');
  }else {
    req.flash('error' , 'Something went wrong.. Try Again!');
    res.redirect('/login');
  }
 
});



// RESET PASSWORD
exports.resetPassword = catchAsync(async (req, res, next) => {
if(req.body.password !== req.body.passwordConfirm){
  req.flash('success' , ' Please check your password!');
  res.redirect('/resetPassword');
}
 // 2) Verification token
 const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

//  3) Check if user still exists
 const currentUser = await User.findById(decoded.id);
 if (!currentUser) {
  req.flash('error' , 'The user belonging to this token does no longer exist.');
  res.redirect('/resetPassword');
 }

 currentUser.password = req.body.password;
 currentUser.passwordConfirm = req.body.passwordConfirm;

 await currentUser.save();
 req.flash('success' , 'Password has been reset successfully!');
 res.redirect('/login');
});

// LOGOUT
exports.logout = (req,res, next) => {
  res.cookie('jwt', 'undefined');
  res.redirect('/home');
  
}

// PROTECT
exports.protect = catchAsync(async (req, res, next) => {
   if(req.cookies.jwt === 'undefined'){
    req.flash('error' , 'You are not logged in! Please log in to get access.');
    res.redirect('/login');
  }
  // 1) Getting token and check of it's there
 if (req.cookies.jwt) {
   token = req.cookies.jwt;
 }

 if (!token) {
  req.flash('error' , 'You are not logged in! Please log in to get access.');
  res.redirect('/login');
 }

 // 2) Verification token
 const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

//  3) Check if user still exists
 const currentUser = await User.findById(decoded.id);
 if (!currentUser) {
  req.flash('error' , 'The user belonging to this token does no longer exist.');
  res.redirect('/login');
 }

 // GRANT ACCESS TO PROTECTED ROUTE
 req.user = currentUser;

 next();
});
