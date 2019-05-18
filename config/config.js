const vaildPassword = require('bcrypt')
const tokenGenerator = require('jsonwebtoken')

var timestamp = Date.now()

function cheackPassword(password_input, password_database) {
    return vaildPassword.compareSync(password_input, password_database)
}

function generateToken(uid) {
    return tokenGenerator.sign({
        uid: String(uid),
    }, global.privateKey)
}

function verifyToken(raw) {
    try {
        return tokenGenerator.verify(raw, global.privateKey)
    }catch(e){
        return false
    }
}


module.exports.generateToken = generateToken
module.exports.verifyToken = verifyToken
module.exports.cheackPassword = cheackPassword
module.exports.timestamp = timestamp