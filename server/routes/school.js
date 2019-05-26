const Schools = require('../model/School')
const config = require('../config/config')
const express = require('express')
const router = express.Router()
const UserMiddle = require('../middle/UserMiddle')
const SchoolMiddle = require('../middle/SchoolMiddle')
const response = require('../config/response')

router.use(express.json())

router.post('/api/verify', UserMiddle, SchoolMiddle, async(req, res) => {
    const school_api = require('./school_api/'+String(req.school.apiPath))
    school_api.verifySchoolAccount(req.body.susr,req.body.spsw)
    .then((success)=>{
        if(success){
            response.sendSuccess(res, {
                school_account: config.generateTokenWithSchoolAccount(req.user._id, req.body.susr, req.body.spsw)
        }, '認証完了しました')
        }else{
            response.sendError(res, '認証できませんでした')
        }
    })
})

router.get('/api/timetable', UserMiddle, SchoolMiddle, async(req, res) => {
    if (!req.school_account) { return response.sendError(res, '学内アカウントを再認証してください') }
    const school_api = require('./school_api/'+String(req.school.apiPath))
    school_api.syncTimeTable(req.school_account.susr, req.school_account.spsw)
    .then((data)=>{
        if(!data){ return response.sendError(res, '時間割同期できませんでした') }
        response.sendSuccess( res, data, '時間割同期完了しました')
    })
})

router.get('/api/attendance', UserMiddle, SchoolMiddle, async(req, res) => {
    if (!req.school_account) { return response.sendError(res, '学内アカウントを再認証してください') }
    const school_api = require('./school_api/'+String(req.school.apiPath))
    school_api.attendanceList(req.school_account.susr, req.school_account.spsw)
    .then((data)=>{
        if(!data){ return response.sendError(res, '出席情報ありません') }
        response.sendSuccess( res, data, '出席情報の更新が完了しました')
    })
})

router.post('/api/attendance', UserMiddle, SchoolMiddle, async(req, res) => {
    if (!req.school_account) { return response.sendError(res, '学内アカウントを再認証してください') }
    const school_api = require('./school_api/'+String(req.school.apiPath))
    school_api.attendancePost(req.school_account.susr, req.school_account.spsw, req.body.attendanceCode, req.body.attendanceNo)
    .then((data)=>{
        if(!data){ return response.sendError(res, '出席送信できませんでした') }
        switch(data){
            case 1:
                response.sendSuccess( res, data, '出席送信が完了しました' )
                break
            case 2:
                response.sendError( res, '出席済みです' )
                break
        }
    })
})

router.get('/api/grade', UserMiddle, SchoolMiddle, async(req, res) => {
    if (!req.school_account) { return response.sendError(res, '学内アカウントを再認証してください') }
    const school_api = require('./school_api/'+String(req.school.apiPath))
    school_api.gradeQuery(req.school_account.susr, req.school_account.spsw)
    .then((data)=>{
        if(!data){ return response.sendError(res, '成績情報確認できませんでした') }
        response.sendSuccess( res, data, '成績情報確認できました' )
    })
})

router.post('/', async(req, res) => {
    await Schools.create({
        name: req.body.name,
        apiPath: req.body.apiPath,
        hidden: false,
        support: true,
        useWlan: true,
        useAttend: true,
        useScore: true,
        useTimetable: true
    }).then(function(school) {
        response.sendSuccess(res, {
            school_name: school.name,
            school_id: school._id,
            timestamp: Date.now()
        }, 'success')
    }).catch(function (e) {
        response.sendError(res, '学校の追加が失敗しました')
    })
})

router.get('/', async(req, res) => {
    const school = await Schools.find({
        hidden: false,
        support: true
    }).exec(function(err, schools){
        var school_data = [];
        schools.map(function(school){
            console.log(school._id)
            school_data.push({
                school_id: school._id,
                school_name: school.name,
                school_support: {
                    wlan: school.useWlan,
                    attend: school.useAttend,
                    score: school.useScore,
                    timetable: school.useTimetable
                }
            })
        })
        response.sendSuccess(res, school_data, '学校情報確認できました')
    })
    
})

module.exports = router