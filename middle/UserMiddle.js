const {User} = require('../config/models')
var config = require('../config/config')

module.exports = async(req, res, next) => {
    const authorization = String(req.headers.authorization).split(' ').pop()
    const uuid = String(req.headers.uuid)
    const { uid, client_uuid } = config.verifyToken(authorization)
    if(!uid) {
        return res.status(403).send({message: 'お手数ですが、再度ログインしてください'})
    }

    await User.findById(uid)
    .then(function(user){
        if(String(user._id) != uid || uuid != client_uuid || authorization != user.access_token) {
            return res.status(403).send({message: 'お手数ですが、再度ログインしてください[1]'})
        }else{
            req.user = user
            req.uuid = uuid
            next()
        }
        
    })
    .catch(function(e){
        return res.status(405).send({message: 'アカウントがありません'})
    })
    
}