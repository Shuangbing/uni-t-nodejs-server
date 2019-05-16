const mongoose = require("mongoose")

mongoose.connect("mongodb://localhost:27017/unit-t-db", {
    useNewUrlParser: true,
    useCreateIndex: true
})

const User = mongoose.model('User', new mongoose.Schema({
    username: { type: String, unique: true},
    password: { type: String, set(val) {
        return require('bcrypt').hashSync(val, 10)
    }},
    school_id: mongoose.Schema.Types.ObjectId,
    lastlogin: Number
}))

const School = mongoose.model('School', new mongoose.Schema({
    name: { type: String, unique: true },
    hidden: Boolean,
    support: Boolean,
    useWLAN: Boolean,
    useATTEND: Boolean,
    useSCORE: Boolean,
    useTIMETABLE: Boolean
}))



module.exports = { User, School }