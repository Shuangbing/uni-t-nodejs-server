const mongoose = require('mongoose')

const School = mongoose.model('School', new mongoose.Schema({
    name: { type: String, unique: true },
    hidden: Boolean,
    support: Boolean,
    actionFile: String,
    supportList: {
        useWlan: Boolean,
        useAttend: Boolean,
        useScore: Boolean,
        useTimetable: Boolean
    }
}))

module.exports = School