const Users = require('../model/User')
var config = require('../config/config')
const assert = require('http-assert')

module.exports = async(req, res, next) => {
    const authorization = String(req.headers.authorization).split(' ').pop()
    const uuid = String(req.headers.uuid)
    const { uid, client_uuid } = config.verifyToken(authorization)
    assert(uid, 411, 'お手数ですが、再度ログインしてください')

    await Users.findById(uid)
    .populate('school')
    .exec((err, user) => {
        assert(user || !err, 405, 'アカウントがありません')
        if(String(user._id) != uid || uuid != client_uuid || authorization != user.access_token) {
            return res.status(411).send({message: 'お手数ですが、再度ログインしてください[1]'})
        }else{
            req.user = user
            req.uuid = uuid
            next()
        }
    })
}