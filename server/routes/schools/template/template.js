const axios = require('axios')
const cheerio = require('cheerio')
const qs = require('qs')
const curl = new (require( 'curl-request' ))();

axios.defaults.timeout = 5000

async function verifySchoolAccount(sc_user, sc_password) {
    if(sc_user === 'demo2019' && sc_password === '123456')
    {
        return true
    }
    return false
}

async function attendanceList(sc_user, sc_password) {
    if(sc_user === 'demo2019' && sc_password === '123456')
    {
        var attendanceArray = []
        attendanceArray.push({
            attendanceTitle: "応用体育",
            attendanceCode: "TestCode"
        })
        attendanceArray.push({
            attendanceTitle: "プログラミング基礎",
            attendanceCode: "TestCode"
        })
        attendanceArray.push({
            attendanceTitle: "線型代数学",
            attendanceCode: "TestCode"
        })
        return attendanceArray
    }
    return false
}

async function attendancePost(sc_user, sc_password, attendCode, attendNo) {
    if(sc_user === 'demo2019' && sc_password === '123456')
    {
        return 1
    }
    return false
}

async function syncTimeTable(sc_user, sc_password) {

    if(sc_user === 'demo2019' && sc_password === '123456')
    {
        var timetable = []
        timetable.push({
            week: 1,
            time: 2,
            lesson_name: "応用体育",
            lesson_teacher: "山田"
        })
        timetable.push({
            week: 0,
            time: 1,
            lesson_name: "数学基礎",
            lesson_teacher: "山田"
        })
        timetable.push({
            week: 0,
            time: 2,
            lesson_name: "プログラミング演習",
            lesson_teacher: "山田"
        })
        timetable.push({
            week: 2,
            time: 3,
            lesson_name: "心理学",
            lesson_teacher: "山田"
        })
        timetable.push({
            week: 2,
            time: 4,
            lesson_name: "応用化学",
            lesson_teacher: "山田"
        })
        return timetable
    }
    return false
}

async function gradeQuery(sc_user, sc_password) {
    if(sc_user === 'demo2019' && sc_password === '123456')
    {
        var gradeList = []
        gradeList.push({
            class: '数学1',
            credit: 2,
            score: '秀'
        })
        gradeList.push({
            class: '数学2',
            credit: 1,
            score: '優'
        })
        gradeList.push({
            class: '数学3',
            credit: 2,
            score: '可'
        })
        gradeList.push({
            class: '数学4',
            credit: 2,
            score: '不可'
        })
        return gradeList
    }
    return false
}

async function canceledInfo(sc_user, sc_password) {
    return [{
        date: '3/5',
        weekday: 3,
        coma: 3,
        subjectCode: 'tbb514101',
        subject: '海外研修',
        teacher: '小林由利子'
    }]
}

module.exports.attendanceList = attendanceList
module.exports.attendancePost = attendancePost
module.exports.verifySchoolAccount = verifySchoolAccount
module.exports.syncTimeTable = syncTimeTable
module.exports.gradeQuery = gradeQuery
module.exports.canceledInfo = canceledInfo