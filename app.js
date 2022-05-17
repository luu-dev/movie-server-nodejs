var createError = require('http-errors');
var express = require('express');
const expressLayouts = require('express-ejs-layouts');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var config = require('config');
var debug = require('debug');
var model = require('./model');
var session = require('express-session');


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var tsRouter = require('./routes/ts');
var movieRouter = require('./routes/movie');
var adminIndexRouter = require('./routes/admin/index');
var adminCompanyRouter = require('./routes/admin/company');
var adminCountryRouter = require('./routes/admin/country');
var castRouter = require('./routes/admin/cast');
var spokenRouter = require('./routes/admin/spokenlangue');
var videoRouter = require('./routes/admin/video');
var commentRouter = require('./routes/admin/comment');
var reviewRouter = require('./routes/admin/review');
var notificationRouter = require('./routes/admin/notification');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'pug');
app.use(expressLayouts);
app.set('layout', './admin/layout');
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({ secret: 'this-is-a-secret-token', cookie: { maxAge: 60000 }}));

app.use('/', indexRouter);
app.use('/user', usersRouter);
app.use('/ts', tsRouter);
app.use('/movie', movieRouter);
app.use('/admin', adminIndexRouter);
app.use('/admin/company', adminCompanyRouter);
app.use('/admin/country', adminCountryRouter);
app.use('/admin/cast', castRouter);
app.use('/admin/spokenlangue', spokenRouter);
app.use('/admin/video', videoRouter);
app.use('/admin/comment', commentRouter);
app.use('/admin/review', reviewRouter);
app.use('/admin/notification', notificationRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});
  
module.exports = app;



//get images: http://localhost:3031/images/An0sAEBH7BuXlnGPIISnqLBvjNh.jpg
