const {User, School} = require('../config/models')
const tokenGenerator = require('jsonwebtoken')

var express = require('express')
var router = express.Router()
var config = require('../config/config')

router.use(express.json())

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
  })

  res.send({
      message: 'create user successed',
      usr: user.username,
      verifyToken: config.generateToken(user._id),
      school_id: user.school_id,
      school_name: school.name
  })
})

router.post('/login', async(req, res) => {
    const user = await User.findOne({
        username: req.body.username
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
        usr: user.username,
        verifyToken: config.generateToken(user._id),
        school_id: user.school_id,
        school_name: school.name,
        timestamp: config.timestamp
    })
})

module.exports = router
