const awsServerlessExpress = require('aws-serverless-express')
const app = require('./app')
const server = awsServerlessExpress.createServer(app)
const mongoose = require("mongoose")
exports.handler = (event, context) => {
    mongoose.connect(process.env.DB_PATH || 'mongodb://localhost:27017/unit-t-db', {
        socketTimeoutMS: 45000,
        keepAlive: true,
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true
    })
    awsServerlessExpress.proxy(server, event, context)
}