const User = require("./../models/userModel");
// const { promisify } = require('util');
// const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");


const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

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

//Signup
exports.signup = catchAsync(async (req, res, next) => {
  console.log(req.body);
 
  const newUser = await User.create(req.body);
  console.log(newUser);
  // res.send('signed up!');
  const token = createSendToken(newUser, 201, res);
  if(newUser && token){
    req.flash('success' , 'Yupp!! Your account has been created... :)');
    res.redirect('/signup');
  }else {
    req.flash('error' , 'Something went wrong.. Try Again!');
    res.redirect('/signup');
  }
});

//Login
exports.login = catchAsync (async(req, res, next) => {
  console.log(req.body);
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

// exports.protect = catchAsync(async (req, res, next) => {
//   // 1) Getting token and check of it's there
//  let token;
//  if (
//    req.headers.authorization &&
//    req.headers.authorization.startsWith('Bearer')
//  ) {
//    token = req.headers.authorization.split(' ')[1];
//  } else if (req.cookies.jwt) {
//    token = req.cookies.jwt;
//  }

//  if (!token) {
//    return next(
//      new AppError('You are not logged in! Please log in to get access.', 401)
//    );
//  }

//  // 2) Verification token
//  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

//  // 3) Check if user still exists
//  const currentUser = await User.findById(decoded.id);
//  if (!currentUser) {
//    return next(
//      new AppError(
//        'The user belonging to this token does no longer exist.',
//        401
//      )
//    );
//  }

 // 4) Check if user changed password after the token was issued
//  if (currentUser.changedPasswordAfter(decoded.iat)) {
//    return next(
//      new AppError('User recently changed password! Please log in again.', 401)
//    );
//  }

 // GRANT ACCESS TO PROTECTED ROUTE
//  req.user = currentUser;
//  next();
// });

// // GRANT ACCESS TO PROTECTED ROUTE
// req.user = currentUser;
// next();

// })


// Forgot Password
exports.forgotPassword = (req, res, next) => {
  res.status(200).json({
    status: "success",
    data: "forgot",
  });
};

//Reset Password
exports.resetPassword = (req, res, next) => {
  res.status(200).json({
    status: "success",
    data: "Reset",
  });
};