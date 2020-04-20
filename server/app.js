require('express-async-errors')
const express = require('express')
const indexRouter = require('./routes/index')
const usersRouter = require('./routes/user')
const schoolRouter = require('./routes/school')
const cookieParser = require('cookie-parser')

const app = express()
global.privateKey = process.env.JWT_KEY || 'jwt_private_key'

if (process.env.runtime_env == "dev") {
  const mongoose = require("mongoose")
  mongoose.connect(process.env.DB_PATH || 'mongodb://localhost:27017/unit-t-db', {
    socketTimeoutMS: 45000,
    keepAlive: true,
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
  })
}

app.disable('etag')
app.use(express.json())
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser())

app.all('*', function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild')
  res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS")
  res.header("X-Powered-By", ' 1.0.1')
  // res.header("Content-Type", "application/json;charset=utf-8");
  next();
})


app.use('/', indexRouter)
app.use('/user', usersRouter)
app.use('/school', schoolRouter)
require('./routes/admin')(app)
app.use('/dashboard', express.static(__dirname + '/public'))

app.use(async (err, req, res, next) => {
  res.status(err.status || 500).send({
    status: false,
    message: err.message
  })
})

app.listen(process.env.PORT || '3000', () => console.log('Uni-T Server listening on port 3000!'))

module.exports = app