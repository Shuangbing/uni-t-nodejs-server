const Users = require('../model/User')
const Schools = require('../model/School')
const express = require('express')
const router = express.Router()
const config = require('../config/config')
const UserMiddle = require('../middle/UserMiddle')
const response = require('../config/response')
const assert = require('http-assert')
const validator = require('validator')
const Mail = require('../config/mail')

router.use(express.json())

router.get('/', UserMiddle, async(req, res) => {
    await Schools.findById(req.user.school).findOne({
        support: true
    })
    .then(function(school){
        return response.sendSuccess(res,{
            username: req.user.username,
            school_id: req.user.school._id,
            school_name: req.user.school.name,
            unicoin: req.user.unicoin
        }, 'プロフィール確認できました')
    })
    .catch(function(e){
        return response.sendError(res, '対応学校ではありません')
    })
})

router.put('/auth/password', UserMiddle, async(req, res) => {
    if (!config.verifyPassword(req.body.password_old, req.user.password)) {
        return response.sendError(res, 'パスワードが正しくありません')
    }
    const user = await Users.findByIdAndUpdate(req.user._id, {
        password: req.body.password_new
    })
    .then(function(user) {
        return response.sendSuccess(res, {}, 'パスワード変更できました')
    })
    .catch(function(e) {
        return response.sendError(res, 'パスワード変更できませんでした')
    })
})

router.post('/auth/register', async(req, res) => {
  const school = await Schools.findById(req.body.school_id).findOne({
      support: true
  })
  assert(school, 403, '対応学校ではありません')
  assert(validator.isEmail(req.body.username), 403, '正しいメールアドレスを入力してください')
  assert(validator.isLength(req.body.password, {min: 6, max: 20}), 403, 'パスワードを6-20桁の間に設定してください')
  const user = await Users.create({
      username: req.body.username,
      password: req.body.password,
      school: req.body.school_id,
      auth: {
          isVaild: false,
          lastSent: 0,
      }
  })
  .then(function(user) {
    return response.sendSuccess(res, {
        uid: user._id,
        usr: user.username,
        school_id: user.school,
        school_name: user.school.name
    }, '新規登録が完了しました')
  })
  .catch(()=>{
    return response.sendError(res, '新規登録できませんでした')
    })
})

router.post('/auth/login', async(req, res) => {
    const {username, password, uuid} = req.body
    const user = await Users.findOne({
        username: username
    }).select('+password').catch(()=>{
        return response.sendError(res, 'ログインできませんでした')
    })
    
    assert(user, 403, '入力したユーザがありません')
    assert(config.verifyPassword(password, user.password), 403, 'パスワードが正しくありません')
    assert(user.auth.isVaild, 402, 'メールアドレスを認証してください')

    const school = await Schools.findById(user.school)
    .catch(function(){
        return response.sendError(res, '対応学校ではありません')
    })
    
    user.access_token = config.generateToken(user._id, uuid)
    user.lastlogin = config.timestamp
    user.save()

    response.sendSuccess(res, {
        uid: user._id,
        usr: user.username,
        access_token: user.access_token,
        school_id: user.school._id,
        school_name: user.school.name,
        timestamp: user.lastlogin
    }, 'ログイン完了しました')
})

router.post('/auth/verify/resend', async(req, res) => {
    const {username, password} = req.body
    console.log(username, password)
    const user = await Users.findOne({
        username: username
    }).select('+password').catch(()=>{
        return response.sendError(res, 'ログインできませんでした')
    })
    
    
    assert(user, 403, '入力したユーザがありません')
    assert(config.verifyPassword(password, user.password), 403, 'パスワードが正しくありません')
    assert(!user.auth.isVaild, 403, 'メールアドレス認証済です')
    assert((Date.now()-user.auth.lastSent)>=0, 403, 'しばらく経ってから再送信してください')
    const vaildCode = String(Math.floor(100000 + Math.random() * 900000))
    user.auth.vaildCode = vaildCode
    user.auth.lastSent = Date.now()
    await user.save()
    assert(Mail.VerifyEmail(username, vaildCode), 501, 'メール送信失敗')
    return response.sendSuccess(res, [], '新しい認証コード送信しました')
})

router.post('/auth/verify', async(req, res) => {
    const {username, password, vaild} = req.body
    const user = await Users.findOne({
        username: username
    }).select('+password').catch(()=>{
        return response.sendError(res, 'ログインできませんでした')
    })
    
    
    assert(user, 403, '入力したユーザがありません')
    assert(config.verifyPassword(password, user.password), 403, 'パスワードが正しくありません')
    assert(!user.auth.isVaild, 403, 'メールアドレス認証済です')
    assert(user.auth.vaildCode === vaild, 403, '認証コードが正しくありません')
    user.auth.isVaild = true
    await user.save()
    return response.sendSuccess(res, [], '認証完了です')
})


router.get('/auth/logout', UserMiddle, async(req, res) => {
    req.user.access_token = ''
    await req.user.save()
    .then(() => {
        response.sendSuccess(res, { timestamp: config.timestamp }, 'ログアウト完了')
    })
    .catch(() => {
        response.sendError(res, 'ログアウトできませんでした')
    })
})

router.get('/auth/refresh', UserMiddle, async(req, res) => {
    const new_AccessToken = config.generateToken(req.user._id, req.uuid)
    req.user.access_token = new_AccessToken
    await req.user.save()
    .then(() => {
        response.sendSuccess(res, {
            access_token: new_AccessToken
        }, 'トークンの更新が完了しました')
    })
    .catch(() => {
        res.status(403).send({message: 'トークンの更新ができませんでした'})
    })
})

module.exports = router
