var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
const cors = require('cors');
var logger = require('morgan');
const mongoose = require('mongoose');
const config = require('config');
const helmet = require('helmet');

var app = express();

if (!config.get('jwtPrivateKey')) {
  console.error('FATAL ERROR: jwtPrivateKey is not defined');
  process.exit(1);
}

const environment = app.get('env');
console.log(environment);

let dbConnectionString = '';

if (environment === 'development') {
  dbConnectionString = config.get('dbConnectionString');
  console.log(dbConnectionString);
} else {
  dbConnectionString = config.get('dbConnectionString-Prod');
  console.log(dbConnectionString);
}

mongoose
  .connect(dbConnectionString)
  .then(() => console.log('Connected to MongoDB...'))
  .catch((err) => console.error('Could not connect to MongoDB', err));

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const schoolsRouter = require('./routes/schools');
const paymentsRouter = require('./routes/payments');
const authRouter = require('./routes/auth');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginResourcePolicy: 'cross-origin',
  })
);
app.use(
  cors({
    origin: 'http://localhost/',
  })
);
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/schools', schoolsRouter);
app.use('/payments', paymentsRouter);
app.use('/auth', authRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
