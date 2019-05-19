const axios = require('axios')
var qs = require('qs');

async function verifySchoolAccount(sc_user, sc_password) {
    return axios.post('https://webclass.tcu.ac.jp/webclass/login.php', qs.stringify({
        username: sc_user,
        val: sc_password,
        useragent: '',
        language: 'JAPANESE'
    }))
    .then((res) => {
        var data = String(res.data)
        if(data.includes("/webclass/?acs_=")){
            return true
        }else{
            return false
        }
    })
    .catch((error) => {
        return false
    })
}

module.exports.verifySchoolAccount = verifySchoolAccount