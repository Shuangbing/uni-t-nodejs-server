const vaildPassword = require('bcrypt')
const crypto = require('crypto')
const tokenGenerator = require('jsonwebtoken')
const timestamp = Date.now()

function verifyPassword(password_input, password_database) {
    return vaildPassword.compareSync(password_input, password_database)
}

function generateToken(uid) {
    return tokenGenerator.sign({
        uid: String(uid),
    }, global.privateKey, { expiresIn: '48h' })
}

function generateTokenWithSchoolAccount(uid, susr, spsw) {
    return tokenGenerator.sign({
        uid: String(uid),
        auth: encryptSchoolAccount(String(susr+'|'+spsw)),
    }, global.privateKey)
}

function verifyToken(raw) {
    try {
        return tokenGenerator.verify(raw, global.privateKey)
    }catch(e){
        return false
    }
}

function encryptSchoolAccount(data) {
    var cipher = crypto.createCipher('aes-128-cbc', global.privateKey)
    var encoded = cipher.update(data, 'utf8', 'hex')
    encoded += cipher.final('hex')
    return encoded
}

function decryptSchoolAccount(encrypted){
    var decipher = crypto.createDecipher('aes-128-cbc', global.privateKey)
    var decoded = decipher.update(encrypted, 'hex', 'utf8')
    decoded += decipher.final('utf8')
    return {
        susr: decoded.split('|').shift(),
        spsw: decoded.split('|').pop()
    }
}

module.exports.decryptSchoolAccount = decryptSchoolAccount
module.exports.generateToken = generateToken
module.exports.generateTokenWithSchoolAccount = generateTokenWithSchoolAccount
module.exports.verifyToken = verifyToken
module.exports.verifyPassword = verifyPassword
module.exports.timestamp = timestamp