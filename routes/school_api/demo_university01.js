const axios = require('axios')
const cheerio = require('cheerio')
const qs = require('qs')
const iconv = require('iconv-lite')

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

async function attendanceList(sc_user, sc_password) {
    const jconv = require('jconv');
    const data = qs.stringify({
        uid: sc_user,
        pass: sc_password,
        module: 'Default',
        action: 'Login'
    })
    return axios.post('https://call.off.tcu.ac.jp/index.php'+'?menuname=%8Fo%90%C8&', data, { responseType: 'arraybuffer' })
    .then((res) => {
        const html = jconv.decode(res.data, "SJIS");
        //if(!html.includes(sc_user)) { return false }
        var attendanceArray = [];
        const $ = cheerio.load(html)
        $('select[name=SelKamoku]').find('option[value!=x]').each(function(j, item) {
            attendanceArray.push({
                attendanceTitle: $(item).text(),
                attendanceCode: $(item).val()
            })
        })
        if ( attendanceArray.length == 0 ) { return false }
        return attendanceArray
    })
}

async function attendancePost(sc_user, sc_password, attendCode, attendNo) {
    const jconv = require('jconv');
    const data_Login = qs.stringify({
        uid: sc_user,
        pass: sc_password,
        module: 'Default',
        action: 'Login'
    })
    const data_SendAttend = qs.stringify({
        module: 'Sk',
        action: ProcedureAcc,
        SelKamoku: attendCode,
        InpNo: attendNo
    })
    return axios.post('https://call.off.tcu.ac.jp/index.php'+'?menuname=%8Fo%90%C8&', data_Login, { responseType: 'arraybuffer' })
    .then(() => {
        //if(!html.includes(sc_user)) { return false }
        return axios.post('https://call.off.tcu.ac.jp/index.php'+'?submitButtonName=%8Fo%90%C8%93o%98%5E&', data_SendAttend, { responseType: 'arraybuffer' })
        .then((res) => {
            const html = jconv.decode(res.data, "SJIS");
            if(!html.includes('出席を受け付けました')) { return false }
            return true
        })
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

module.exports.attendanceList = attendanceList
module.exports.verifySchoolAccount = verifySchoolAccount
module.exports.syncTimeTable = syncTimeTable