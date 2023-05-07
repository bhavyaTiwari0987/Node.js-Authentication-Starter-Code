const path = require('path');
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const userRouter = require("./routes/userRoutes");
const viewRouter = require('./routes/viewRoutes');
const session = require('express-session');
const flash = require('connect-flash');
const cookieParser = require('cookie-parser');
const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");

const app = express();

// SETTING VIEW ENGINE
app.set('view engine' , 'ejs');
app.set('views' , path.join(__dirname, 'views'));


// FOR CHECKING REQ.COOKIES
app.use(cookieParser())

// SERVING STATIC FILES
app.use(express.static(`${__dirname}/public`));

// MIDDLEWARES
app.use(express.urlencoded());
app.use(express.json());

// EXPRESS SESSION AND FLASH
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: true
}));
app.use(flash());

// MOUNTING THE ROUTERS
app.use('/' , viewRouter);
app.use("/api/v1/users", userRouter);


// ERROR HANDLING FOR API
app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
