const {User} = require('../config/models')
var config = require('../config/config')

module.exports = async(req, res, next) => {
    const raw = String(req.headers.authorization).split(' ').pop()
    const { uid } = config.verifyToken(raw)
    if(!uid) {
        return res.status(405).send({message: 'token invaild'})
    }
    req.user = await User.findById(uid)
    .catch(function(e){
        return res.status(405).send({message: 'user invaild'})
    })
    next()
}