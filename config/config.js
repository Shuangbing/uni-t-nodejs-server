const vaildPassword = require('bcrypt')
const tokenGenerator = require('jsonwebtoken')

var timestamp = Date.now()

function verifyPassword(password_input, password_database) {
    return vaildPassword.compareSync(password_input, password_database)
}

function generateToken(uid) {
    return tokenGenerator.sign({
        uid: String(uid),
    }, global.privateKey, { expiresIn: '1h' })
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
module.exports.verifyPassword = verifyPassword
module.exports.timestamp = timestamp