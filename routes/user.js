const {User, School} = require('../config/models')
const tokenGenerator = require('jsonwebtoken')

var express = require('express')
var router = express.Router()
var config = require('../config/config')

router.use(express.json())

const userAuth = async(req, res, next) => {
    const raw = String(req.headers.authorization).split(' ').pop()
    const {uid} = config.verifyToken(raw)
    if(!uid) {
        return res.status(405).send({message: 'token invaild'})
    }

    req.user = await User.findById(uid)
    .catch(function(e){
        return res.status(405).send({message: 'user invaild'})
    })
    next()    
}

router.get('/', userAuth, async(req, res) => {

    const school = await School.findById(req.user.school_id).findOne({
        support: true
    })
    .then(function(school){
        return res.send({
            username: req.user.username,
            school_id: req.user.school_id,
            school_name: school.name,
            unicoin: req.user.unicoin
        })
    })
    .catch(function(e){
        return res.status(405).send({message: 'school invaild'})
    })
})

router.post('/register', async(req, res) => {

  const school = await School.findById(req.body.school_id).findOne({
      support: true
  })

  if(!school) {
      return res.status(422).send({
          message: 'school not found',
      })
  }

  const user = await User.create({
      username: req.body.username,
      password: req.body.password,
      school_id: req.body.school_id,
      lastlogin: config.timestamp
  }).then(function(user) {
    res.send({
        usr: user.username,
        verifyToken: config.generateToken(user._id),
        school_id: user.school_id,
        school_name: school.name
    })
  })
  .catch(function (e) {
    const {code} = e
    res.status(400).send({
        message: code+'-Faild Register'
        })
    })
})

router.post('/login', async(req, res) => {
    const user = await User.findOne({
        username: req.body.username
    }).catch(function(e){
        res.status(400).send({
            message: 'login faild',
        })
    })

    if(!user) {
        return res.status(422).send({
            message: 'user not found',
        })
    }

    if (!config.cheackPassword(req.body.password, user.password)) {
        return res.status(422).send({
            message: 'password not valid',
        })
    }

    const school = await School.findOne({
        _id: user.school_id
    }).catch(function(e){
        res.status(400).send({
            message: 'login faild',
        })
    })

    if(!school) {
        return res.status(422).send({
            message: 'user not found',
        })
    }
    
    user.updateOne({
        lastlogin: config.timestamp
    })

    res.send({
        uid: user._id,
        usr: user.username,
        verifyToken: config.generateToken(user._id),
        school_id: user.school_id,
        school_name: school.name,
        timestamp: config.timestamp
    })
})

module.exports = router
