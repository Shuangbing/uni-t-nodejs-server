const {School} = require('../config/models')
const config = require('../config/config')

module.exports = async(req, res, next) => {
    const raw_school = String(req.headers.authentication).split(' ').pop()
    const { uid, susr, spsw } = config.verifyToken(raw_school)
    await School.findById(req.user.school_id)
    .then((school) => {

        if(uid && req.user._id == uid) {
            console.log(uid, susr, spsw)
            req.school_account = {
                susr: susr,
                spsw: spsw
            }
        }
        
        req.school = school
        next()
    })
    .catch(function(e){
        return res.status(405).send({message: 'school invaild'})
    })
}