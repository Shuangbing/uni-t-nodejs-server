const axios = require('axios')
const cheerio = require('cheerio')
const qs = require('qs')

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

async function syncTimeTable(sc_user, sc_password) {
    var week = 0, time = 0
    return axios.post('https://webclass.tcu.ac.jp/webclass/login.php', qs.stringify({
        username: sc_user,
        val: sc_password,
        useragent: '',
        language: 'JAPANESE'
    }))
    .then((res) => {
        return axios.get('https://webclass.tcu.ac.jp/webclass/index.php?year=2019&semester=3', {
            headers: {
                Cookie: res.headers['set-cookie']
            }
        }).then((res) => {
            const html = res.data
            const $ = cheerio.load(html)
            var timetable = [];
            console.log(res.data)
            $('tr[data-class_order]').each(function(j, item) {
                time++;
                $(item).find('div a').each(function(i, item) {
                    week = i;
                    $name = $(item).text().split("» ").pop().split(" (").shift()
                    $teacher = $(item).text().split("、")[1]
                    timetable.push({
                        week: week,
                        time: time,
                        lesson_name: $name,
                        lesson_teacher: $teacher
                    })
                })
            })
            return timetable
        })
    })
    .catch((error) => {
        return false
    })
}

module.exports.verifySchoolAccount = verifySchoolAccount
module.exports.syncTimeTable = syncTimeTable