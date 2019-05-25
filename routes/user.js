const {User, School} = require('../config/models')
const tokenGenerator = require('jsonwebtoken')
const express = require('express')
const router = express.Router()
const config = require('../config/config')
const UserMiddle = require('../middle/UserMiddle')
const response = require('../config/response')

router.use(express.json())


router.get('/', UserMiddle, async(req, res) => {
    const school = await School.findById(req.user.school_id).findOne({
        support: true
    })
    .then(function(school){
        return response.sendSuccess(res,{
            username: req.user.username,
            school_id: req.user.school_id,
            school_name: school.name,
            unicoin: req.user.unicoin
        }, 'プロフィール確認できました')
    })
    .catch(function(e){
        return response.sendError(res, '対応学校ではありません')
    })
})

router.post('/password/edit', UserMiddle, async(req, res) => {
    if (!config.verifyPassword(req.body.password_old, req.user.password)) {
        return response.sendError(res, 'パスワードが正しくありません')
    }
    const user = await User.findByIdAndUpdate(req.user._id, {
        password: req.body.password_new
    })
    .then(function(user) {
        return response.sendSuccess(res, {}, 'パスワード変更できました')
    })
    .catch(function(e) {
        return response.sendError(res, 'パスワード変更できませんでした')
    })
})

router.post('/register', async(req, res) => {

  const school = await School.findById(req.body.school_id).findOne({
      support: true
  })

  if(!school) {
    return response.sendError(res, '対応学校ではありません')
  }

  const user = await User.create({
      username: req.body.username,
      password: req.body.password,
      school_id: req.body.school_id,
      lastlogin: config.timestamp
  })
  .then(function(user) {
    return response.sendSuccess(res, {
        uid: user._id,
        usr: user.username,
        access_token: config.generateToken(user._id),
        school_id: user.school_id,
        school_name: school.name
    }, '新規登録が完了しました')
  })
  .catch(function (e) {
    const {code} = e
    return response.sendError(res, '新規登録できませんでした')
    })
})

router.post('/login', async(req, res) => {
    const user = await User.findOne({
        username: req.body.username
    }).catch(function(e){
        return response.sendError(res, 'ログインできませんでした')
    })

    if(!user) {
        return response.sendError(res, '入力したユーザがありません')
    }

    if (!config.verifyPassword(req.body.password, user.password)) {
        return response.sendError(res, 'パスワードが正しくありません')
    }

    const school = await School.findOne({
        _id: user.school_id
    }).catch(function(e){
        return response.sendError(res, 'ログインできませんでした')
    })

    if(!school) {
        return response.sendError(res, '対応学校ではありません')
    }
    
    user.updateOne({
        lastlogin: config.timestamp
    })

    response.sendSuccess(res, {
        uid: user._id,
        usr: user.username,
        access_token: config.generateToken(user._id),
        school_id: user.school_id,
        school_name: school.name,
        timestamp: config.timestamp
    }, 'ログイン完了しました')
})

module.exports = router
