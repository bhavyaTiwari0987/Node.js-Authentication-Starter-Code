const path = require('path');
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const userRouter = require("./routes/userRoutes");
const viewRouter = require('./routes/viewRoutes');
const session = require('express-session');
const flash = require('connect-flash');
// const expressLayouts = require('express-ejs-layouts');

const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");

const app = express();

app.set('view engine' , 'ejs');
app.set('views' , path.join(__dirname, 'views'));


// Layout for EJS tempalte
// app.use(expressLayouts);

// Serving static files
app.use(express.static(`${__dirname}/public`));

// Middleware
app.use(express.urlencoded());
app.use(express.json());

// Express Session and flash
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: true
}));
app.use(flash());

// Mounting the Routers
app.use('/' , viewRouter);
app.use("/api/v1/users", userRouter);


// Error Handling
app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
