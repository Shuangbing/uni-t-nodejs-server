var createError = require('http-errors')
var express = require('express')
var path = require('path')
var cookieParser = require('cookie-parser')
var logger = require('morgan')

var indexRouter = require('./routes/index')
var usersRouter = require('./routes/user')
var schoolRouter = require('./routes/school')

var database = require('./config/database')

var fs = require('fs');
var app = express();

const mongoose = require("mongoose")
mongoose.connect(database.mongo_path, {
    useNewUrlParser: true,
    useCreateIndex: true
})

global.privateKey = fs.readFileSync('./config/private.key', 'utf8');
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/user', usersRouter);
app.use('/school', schoolRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  //res.locals.message = err.message;
  //res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render the error page
  //res.status(err.status || 500);
  res.status(err.status).send({
    message: err.message
  })
});

module.exports = app;
