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

router.post('/api/timetable', UserMiddle, SchoolMiddle, async(req, res) => {
    const school_api = require('./school_api/'+String(req.school.apiPath))
    school_api.syncTimeTable('g1772025', 'kSh0421!?!')
    .then((data)=>{
        if(!data){ return response.sendError(res, 'sync timetable faild') }
        response.sendSuccess( res, data, 'sync timetable success')
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