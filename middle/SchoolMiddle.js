const {School} = require('../config/models')

module.exports = async(req, res, next) => {
    await School.findById(req.user.school_id)
    .then((school) => {
        req.school = school
        next()
    })
    .catch(function(e){
        return res.status(405).send({message: 'school invaild'})
    })
}