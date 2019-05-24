const {User, School} = require('../config/models')
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
        }, 'verify success')
        }else{
            response.sendError(res, 'verify faild')
        }
    })
})

router.get('/api/timetable', UserMiddle, SchoolMiddle, async(req, res) => {
    if (!req.school_account) { return response.sendError(res, 'school account time limit') }
    const school_api = require('./school_api/'+String(req.school.apiPath))
    school_api.syncTimeTable(req.school_account.susr, req.school_account.spsw)
    .then((data)=>{
        if(!data){ return response.sendError(res, 'sync timetable faild') }
        response.sendSuccess( res, data, 'sync timetable success')
    })
})

router.get('/api/attendance', UserMiddle, SchoolMiddle, async(req, res) => {
    if (!req.school_account) { return response.sendError(res, 'school account time limit') }
    const school_api = require('./school_api/'+String(req.school.apiPath))
    school_api.attendanceList(req.school_account.susr, req.school_account.spsw)
    .then((data)=>{
        if(!data){ return response.sendError(res, 'get attendance list faild') }
        response.sendSuccess( res, data, 'get attendance list success')
    })
})

router.post('/api/attendance', UserMiddle, SchoolMiddle, async(req, res) => {
    if (!req.school_account) { return response.sendError(res, 'school account time limit') }
    const school_api = require('./school_api/'+String(req.school.apiPath))
    school_api.attendancePost(req.school_account.susr, req.school_account.spsw, req.body.attendanceCode, req.body.attendanceNo)
    .then((data)=>{
        if(!data){ return response.sendError(res, 'attendance faild') }
        switch(data){
            case 1:
                response.sendSuccess( res, data, 'attendance success' )
                break
            case 2:
                response.sendError( res, 'already attendance' )
                break
        }
    })
})

router.get('/api/grade', UserMiddle, SchoolMiddle, async(req, res) => {
    if (!req.school_account) { return response.sendError(res, 'school account time limit') }
    const school_api = require('./school_api/'+String(req.school.apiPath))
    school_api.gradeQuery(req.school_account.susr, req.school_account.spsw)
    .then((data)=>{
        if(!data){ return response.sendError(res, 'grade query faild') }
        response.sendSuccess( res, data, 'grade query success' )
    })
})

router.post('/', async(req, res) => {
    await School.create({
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
        response.sendError(res, 'add school faild')
    })
})

router.get('/', async(req, res) => {
    const school = await School.find({
        hidden: false,
        support: true
    })
    response.sendSuccess(res, school, 'success school list')
})

module.exports = router