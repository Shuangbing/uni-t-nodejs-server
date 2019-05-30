const AdminUsers = require('./AdminUser')
const mongoose = require("mongoose")
var database = require('./../config/database')

mongoose.connect(database.mongo_path, {
    useNewUrlParser: true,
    useCreateIndex: true
})

const model = AdminUsers.create({
    username: "test@uni-t.cc",
    password: "123456"
})

console.log(model)