const catchAsync = require("../utils/catchAsync");

// SIGN UP PAGE
exports.getSignupForm = catchAsync(async (req, res, next) => {
  const messages = {
    success: req.flash("success"),
    error: req.flash("error"),
  };
  res.status(200).render("signup", {
    messages,
  });
});

// LOGIN PAGE
exports.getLoginForm = catchAsync(async (req, res, next) => {
  const messages = {
    success: req.flash("success"),
    error: req.flash("error"),
  };
  res.render("login", {
    messages,
  });
});

// RESET PASSWORD PAGE
exports.getResetPassword = catchAsync(async (req, res, next) => {
  const messages = {
    success: req.flash("success"),
    error: req.flash("error"),
  };
  res.status(200).render("resetPassword", {
    messages,
  });
});

// HOME PAGE
exports.getHomePage = catchAsync(async (req, res, next) => {
  res.status(200).render("home");
});

// ABOUT PAGE
exports.getAboutPage = catchAsync(async (req, res, next) => {
  res.status(200).render("about");
});

// PROFILE PAGE
exports.getProfilePage = catchAsync(async (req, res, next) => {
  const messages = {
    success: req.flash("success"),
    error: req.flash("error"),
    name: req.flash("name"),
  };
  res.status(200).render("profile", {
    messages,
  });
});
