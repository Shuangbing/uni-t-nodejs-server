const Schools = require('../model/School')
const config = require('../config/config')
const assert = require('http-assert')

module.exports = async(req, res, next) => {
    const raw_school = String(req.headers.authentication).split(' ').pop()
    assert(raw_school, 423, '学内アカウントを設定してください')
    const { uid, auth } = config.verifyToken(raw_school)
    assert(uid && auth, 423, '学内アカウントを設定してください')
    UserSchool = Schools.findById(req.user.school_id)
    assert(UserSchool, 403, 'ご利用の学校はサポート中止です')
    if(uid && req.user._id == uid) {
        const { susr, spsw } = config.decryptSchoolAccount(String(auth))
        req.school_account = {
            susr: susr,
            spsw: spsw
        }
    }
    req.school = UserSchool
    next()
}