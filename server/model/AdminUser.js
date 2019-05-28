const mongoose = require('mongoose')

const AdminUser = mongoose.model('AdminUser', new mongoose.Schema({
    username: { type: String, unique: true},
    password: { type: String, set(val) {
        return require('bcrypt').hashSync(val, 10)
    }},
    fullname: String,
    access_token: String,
    lastlogin: {type: Date, default: Date.now}
}))

module.exports = AdminUser