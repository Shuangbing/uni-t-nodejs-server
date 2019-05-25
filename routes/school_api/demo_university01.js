const axios = require('axios')
const cheerio = require('cheerio')
const qs = require('qs')
const curl = new (require( 'curl-request' ))();

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
        action: 'ProcedureAcc',
        SelKamoku: attendCode,
        InpNo: attendNo
    })
    return axios.post('https://call.off.tcu.ac.jp/index.php'+'?menuname=%8Fo%90%C8&', data_Login, { responseType: 'arraybuffer' })
    .then((res) => {
        //if(!html.includes(sc_user)) { return false }
        return axios.post('https://call.off.tcu.ac.jp/index.php'+'?submitButtonName=%8Fo%90%C8%93o%98%5E&',
        data_SendAttend,
        {
            responseType: 'arraybuffer',
            headers: {
                Cookie: res.headers['set-cookie']
            }
        })
        .then((res) => {
            const html = jconv.decode(res.data, "SJIS");
            if(html.includes('出席を受け付けました')) { return 1 }
            if(html.includes('既に出席登録が行われています')) { return 2 }
            return false
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
                $(item).find('td[class!=schedule-table-class_order]').each(function(i, item) {
                    week = i;
                    $name = $(item).text().split("» ").pop().split(" (").shift()
                    $teacher = $(item).text().split("、")[1]
                    if($name.length > 0) {
                        timetable.push({
                            week: week,
                            time: time,
                            lesson_name: $name,
                            lesson_teacher: $teacher
                        })
                    }
                })
            })
            return timetable
        })
    })
    .catch((error) => {
        return false
    })
}

async function gradeQuery(sc_user, sc_password) {
    const jconv = require('jconv');
    return curl
    .setBody({
        'buttonName': 'login',
        'lang': '1',
        'userId': sc_user,
        'password': sc_password
    })
    .post('https://www.uni-t.cc/aa.txt')
    .then(({code, body, headers}) => {
        if(!body == '' && !headers['set-cookie']){
            return curl.setHeaders(['cookie: ' + 'setcookies'.toString()])
            .get('https://www.uni-t.cc/demo/score.html')
            .then(({code, body, headers}) => {
                const html = body.replace(/\s\s+|&nbsp;/g,'')
                const $ = cheerio.load(html)
                var gradeList = [];
                $('table tr[class=column_odd]').each(function(j, item) {
                    var gradeData = {class: '', credit: 0, score: ''}
                    $(item).children('td').each(function(i, item) {
                        switch(i){
                            case 0:
                                gradeData.class = $(item).text()
                                break
                            case 1:
                                gradeData.credit = Number($(item).text())
                                break
                            case 2:
                                gradeData.score = $(item).text()
                                break
                        }
                    })
                    gradeList.push(gradeData)
                })
                return gradeList
            })
        }
        else{
            return false
        }
    })
    .catch(() => {
        return false
    })
}

module.exports.attendanceList = attendanceList
module.exports.attendancePost = attendancePost
module.exports.verifySchoolAccount = verifySchoolAccount
module.exports.syncTimeTable = syncTimeTable
module.exports.gradeQuery = gradeQuery