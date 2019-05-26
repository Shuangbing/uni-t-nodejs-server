const mongoose = require('mongoose')

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

module.exports = School