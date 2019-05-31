require('express-async-errors')
const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const indexRouter = require('./routes/index')
const usersRouter = require('./routes/user')
const schoolRouter = require('./routes/school')

const database = require('./config/database')

const fs = require('fs')
const app = express()

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


app.use(async(err, req, res, next) => {
  res.status(err.status || 500).send({
    status: false,
    message: err.message
  })
})

module.exports = app
