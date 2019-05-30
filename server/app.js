var createError = require('http-errors')
var express = require('express')
var path = require('path')
var cookieParser = require('cookie-parser')
var logger = require('morgan')

var indexRouter = require('./routes/index')
var usersRouter = require('./routes/user')
var schoolRouter = require('./routes/school')

var database = require('./config/database')

var fs = require('fs')
var app = express()

const mongoose = require("mongoose")
mongoose.connect(database.mongo_path, {
    useNewUrlParser: true,
    useCreateIndex: true
})

global.privateKey = fs.readFileSync('./config/private.key', 'utf8')

app.disable('etag')
app.all('*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild')
  res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS")
  res.header("X-Powered-By",' 1.0.1')
  res.header("Content-Type", "application/json;charset=utf-8");
  next();
})
// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser())

app.use('/', indexRouter)
app.use('/user', usersRouter)
app.use('/school', schoolRouter)

require('./routes/admin')(app)


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404))
})

app.use(async(err, req, res, next) => {
  res.status(err.status || 500).send({
    status: false,
    message: err.message
  })
})

module.exports = app
