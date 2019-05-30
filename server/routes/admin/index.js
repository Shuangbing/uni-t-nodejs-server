module.exports = app => {
    const express = require('express')
    require('express-async-errors');
    const assert = require('http-assert')
    const router = express.Router()
    const Schools = require('../../model/School')
    const Users = require('../../model/User')
    const AdminUsers = require('../../model/AdminUser')
    const config = require('../../config/config')
    const response = require('../../config/response')
    
    const fs = require('fs')

    const authMiddleware = async (req, res, next) => {
        const token = String(req.headers.authorization || '').split(' ').pop()
        assert(token, 422, 'ログインしてください')
        const { uid } = config.verifyToken(token)
        assert(uid, 422, 'ログインしてください')
        req.user = await AdminUsers.findById(uid)
        assert(req.user, 422, 'ログインしてください')
        await next()
    }

    router.post('/login', async(req, res) => {
        const { username, password } = req.body
        const AdminUsers = require('../../model/AdminUser')
        const user = await AdminUsers.findOne({ username: username }).select('+password')
        assert(user, 401, 'アカウントがありません')
        const isValid = require('bcrypt').compareSync(password, user.password)
        assert(isValid, 401, 'パスワードが正しくありません')
        const access_token = config.generateToken(user._id, 'AdminUser')
        user.access_token = access_token
        user.save()
        res.send({access_token})
    })

    router.post('/schools', authMiddleware, async(req, res) => {
        assert(req.body.name, 401, '学校名が必要です')
        const model = await Schools.create(req.body)
        fs.copyFile("./routes/schools/template/template.js", "./routes/schools/"+model._id+'.js', function(){})
        return response.sendSuccess(res, model, '新規追加完了')
    })

    router.get('/schools', authMiddleware, async(req, res) => {
        const items = await Schools.find().limit(10)
        return response.sendSuccess(res, items, '学校データ読み込み完了')
    })

    router.get('/schools/:id', authMiddleware, async(req, res) => {
        const model = await Schools.findById(req.params.id)
        return response.sendSuccess(res, model, '学校情報読み込み完了')
    })

    router.put('/schools/:id', authMiddleware, async(req, res) => {
        const model = await Schools.findByIdAndUpdate(req.params.id, req.body)
        return response.sendSuccess(res, model, '学校情報編集完了')
    })

    router.get('/users', authMiddleware, async(req, res) => {
        const model = await Users
        .find()
        .limit(10)
        .populate('school')
        .exec((err, users)=>{
            return response.sendSuccess(res, users, 'ユーザ情報込み込み完了')
        })
    })

    router.get('/users/:id', authMiddleware, async(req, res) => {
        const model = await Users.findById(req.params.id)
        return response.sendSuccess(res, model, 'ユーザ情報読み込み完了')
    })

    router.put('/users/:id', authMiddleware, async(req, res) => {
        const model = await Users.findByIdAndUpdate(req.params.id, req.body)
        return response.sendSuccess(res, model, 'ユーザ情報編集完了')
    })

    router.post('/admins', authMiddleware, async(req, res) => {
        assert(req.body.username, 401, 'メールアドレスを入力してください')
        const model = await AdminUsers.create(req.body)
        return response.sendSuccess(res, model, '新規追加完了')
    })

    router.get('/admins', authMiddleware, async(req, res) => {
        const items = await AdminUsers.find().limit(10)
        return response.sendSuccess(res, items, '管理者情報読み込み完了')
    })

    router.get('/admins/:id', authMiddleware, async(req, res) => {
        const model = await AdminUsers.findById(req.params.id)
        return response.sendSuccess(res, model, '管理者情報読み込み完了')
    })

    router.put('/admins/:id', authMiddleware, async(req, res) => {
        const model = await AdminUsers.findByIdAndUpdate(req.params.id, req.body)
        return response.sendSuccess(res, model, '管理者情報編集完了')
    })

    app.use('/admin/api', router)

    
}