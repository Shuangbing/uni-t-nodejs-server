const Schools = require('../model/School')
const config = require('../config/config')
const express = require('express')
const router = express.Router()
const UserMiddle = require('../middle/UserMiddle')
const SchoolMiddle = require('../middle/SchoolMiddle')
const response = require('../config/response')
const assert = require('http-assert')

router.use(express.json())

router.get('/', async (req, res) => {
    const school = await Schools.find({
        hidden: false,
        support: true
    }).exec(function (err, schools) {
        var school_data = [];
        schools.map(function (school) {
            school_data.push({
                school_id: school._id,
                school_name: school.name,
                support_list: school.supportList
            })
        })
        response.sendSuccess(res, school_data, '学校情報確認できました')
    })

})

router.use(UserMiddle, async (req, res, next) => {
    const school_api = require('./schools/' + String(req.user.school.actionFile) + '.js')
    req.api = school_api
    next()
})

router.post('/api/verify', async (req, res) => {
    await req.api.verifySchoolAccount(req.body.susr, req.body.spsw)
        .then((success) => {
            if (success) {
                response.sendSuccess(res, {
                    school_account: config.generateTokenWithSchoolAccount(req.user._id, req.body.susr, req.body.spsw)
                }, '認証完了しました')
            } else {
                response.sendError(res, '認証できませんでした')
            }
        })
})

router.get('/api/timetable', SchoolMiddle, async (req, res) => {
    await req.api.syncTimeTable(req.school_account.susr, req.school_account.spsw)
        .then((data) => {
            assert(data && data.length > 0, 401, '時間割同期できませんでした')
            response.sendSuccess(res, data, '時間割同期完了しました')
        })
})

router.get('/api/attendance', SchoolMiddle, async (req, res) => {
    await req.api.attendanceList(req.school_account.susr, req.school_account.spsw)
        .then((data) => {
            assert(data && data.length > 0, 401, '出席情報ありません')
            response.sendSuccess(res, data, '出席情報の更新が完了しました')
        })
})

router.get('/api/attendance', SchoolMiddle, async (req, res) => {
    await req.api.attendanceList(req.school_account.susr, req.school_account.spsw)
        .then((data) => {
            assert(data && data.length > 0, 401, '出席情報ありません')
            response.sendSuccess(res, data, '出席情報の更新が完了しました')
        })
})

router.post('/api/attendance', SchoolMiddle, async (req, res) => {
    await req.api.attendancePost(req.school_account.susr, req.school_account.spsw, req.body.attendanceCode, req.body.attendanceNo)
        .then((data) => {
            assert(data, 401, '出席送信できませんでした')
            switch (data) {
                case 1:
                    response.sendSuccess(res, data, '出席送信が完了しました')
                    break
                case 2:
                    response.sendError(res, '出席済みです')
                    break
            }
        })
})

router.get('/api/grade', SchoolMiddle, async (req, res) => {
    await req.api.gradeQuery(req.school_account.susr, req.school_account.spsw)
        .then((data) => {
            assert(data && data.length > 0, 401, '成績情報がありません')
            response.sendSuccess(res, data, '成績情報確認できました')
        })
})

router.get('/api/canceled', SchoolMiddle, async (req, res) => {
    await req.api.canceledInfo(req.school_account.susr, req.school_account.spsw)
        .then((data) => {
            assert(data && data.length > 0, 401, '補講情報がありません')
            response.sendSuccess(res, data, '補講情報が確認できました')
        })
})

module.exports = router