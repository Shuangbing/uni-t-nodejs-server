const {User, School} = require('../config/models')
const tokenGenerator = require('jsonwebtoken')

var express = require('express')
var router = express.Router()
var UserMiddle = require('../middle/UserMiddle')
var SchoolMiddle = require('../middle/SchoolMiddle')

router.use(express.json())

router.post('/api/verify', UserMiddle, SchoolMiddle, async(req, res) => {
    var school_api = require('./school_api/'+String(req.school.apiPath))
    school_api.verifySchoolAccount(req.body.susr,req.body.spsw)
    .then((success)=>{
        if(success){
            res.send({message: 'verify success'})
        }else{
            res.status(400).send({message: 'verify faild'})
        }
    })
})

router.post('/', async(req, res) => {
    const school = await School.create({
        name: req.body.name,
        apiPath: req.body.apiPath,
        hidden: false,
        support: true,
        useWlan: true,
        useAttend: true,
        useScore: true,
        useTimetable: true
    }).then(function(school) {
        res.send({
            message: 'successed',
            school_name: school.name,
            school_id: school._id,
            timestamp: Date.now()
        })
    }).catch(function (e) {
        const {code} = e
        res.status(400).send({
            message: code+'-Faild add school'
        })
    })
})

router.get('/', async(req, res) => {
    const school = await School.find({
        hidden: false,
        support: true
    })
    res.send(school)
})

module.exports = router