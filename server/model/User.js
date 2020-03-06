const mongoose = require('mongoose')

const User = mongoose.model('User', new mongoose.Schema({
    username: { type: String, unique: true},
    password: { type: String, select: false,
        set(val) {
        return require('bcryptjs').hashSync(val, 10)
    }},
    auth: {
        isVaild: {type: Boolean, default: false},
        vaildCode: String,
        lastSent: {type: Date, default: Date.now}
    },
    school: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'School'},
    unicoin: { type: Number, default: 0 },
    access_token: String,
    lastlogin: {type: Date, default: Date.now}
}))

module.exports = User