const AdminUsers = require('./AdminUser')
const mongoose = require("mongoose")
var database = require('./../config/database')

mongoose.connect(database.mongo_path, {
    useNewUrlParser: true,
    useCreateIndex: true
})

const model = AdminUsers.create({
    username: "kasouhei@qq.com",
    password: "1z2x3c"
})

console.log(model)