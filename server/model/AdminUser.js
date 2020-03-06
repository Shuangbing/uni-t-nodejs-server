const mongoose = require('mongoose')

const AdminUser = mongoose.model('AdminUser', new mongoose.Schema({
    username: { type: String, unique: true},
    password: { type: String, select: false,
        set(val) {
        return require('bcryptjs').hashSync(val, 10)
    }},
    fullname: String,
    access_token: String,
    lastlogin: {type: Date, default: Date.now}
}))

module.exports = AdminUser