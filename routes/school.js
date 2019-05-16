const {User, School} = require('../config/models')
const tokenGenerator = require('jsonwebtoken')

var express = require('express')
var router = express.Router()
var config = require('../config/config')

router.use(express.json())

router.post('/', async(req, res) => {
    const school = await School.create({
        name: req.body.name,
        hidden: false,
        support: true,
        useWLAN: true,
        useATTEND: true,
        useSCORE: true,
        useTIMETABLE: true
    })
    res.send(school)
})

router.get('/', async(req, res) => {
    const school = await School.find({
        hidden: false,
        support: true
    })
    res.send(school)
})

module.exports = router