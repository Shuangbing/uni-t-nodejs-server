const mongoose = require('mongoose')

const User = mongoose.model('User', new mongoose.Schema({
    username: { type: String, unique: true},
    password: { type: String, set(val) {
        return require('bcrypt').hashSync(val, 10)
    }},
    school: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'School'},
    unicoin: { type: Number, default: 0 },
    access_token: String,
    lastlogin: Number
}))

module.exports = User