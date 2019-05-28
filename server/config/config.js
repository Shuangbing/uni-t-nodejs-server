const vaildPassword = require('bcrypt')
const crypto = require('crypto')
const tokenGenerator = require('jsonwebtoken')
const timestamp = Date.now()
const accessTokenExpired = '7d'
const refreshTokenExpired = '7d'

function verifyPassword(password_input, password_database) {
    return vaildPassword.compareSync(password_input, password_database)
}

function generateToken(uid, uuid) {
    return tokenGenerator.sign({
        uid: String(uid),
        client_uuid: uuid
    }, global.privateKey, { expiresIn: accessTokenExpired })
}

function generateTokenByRefreshToken(refrsh_token, uuid_body) {
    if({uid, uuid} = verifyToken(refrsh_token)) {
        console.log(uid, uuid)
    }
}

function generateRefreshToken(uid, uuid) {
    return tokenGenerator.sign({
        uid: String(uid),
        uuid: String(uuid)
    }, global.privateKey, { expiresIn: refreshTokenExpired })
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

module.exports.generateRefreshToken = generateRefreshToken
module.exports.decryptSchoolAccount = decryptSchoolAccount
module.exports.generateToken = generateToken
module.exports.generateTokenWithSchoolAccount = generateTokenWithSchoolAccount
module.exports.verifyToken = verifyToken
module.exports.verifyPassword = verifyPassword
module.exports.timestamp = timestamp