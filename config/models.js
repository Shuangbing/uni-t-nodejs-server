const mongoose = require("mongoose")

const User = mongoose.model('User', new mongoose.Schema({
    username: { type: String, unique: true},
    password: { type: String, set(val) {
        return require('bcrypt').hashSync(val, 10)
    }},
    school_id: mongoose.Schema.Types.ObjectId,
    unicoin: { type: Number, default: 0 },
    access_token: String,
    lastlogin: Number
}))

const School = mongoose.model('School', new mongoose.Schema({
    name: { type: String, unique: true },
    apiPath: { type: String, unique: true },
    hidden: Boolean,
    support: Boolean,
    useWlan: Boolean,
    useAttend: Boolean,
    useScore: Boolean,
    useTimetable: Boolean
}))



module.exports = { User, School }