module.exports = app => {
    const express = require('express')
    const router = express.Router()
    const Schools = require('../../model/School')
    const Users = require('../../model/User')
    const AdminUsers = require('../../model/AdminUser')
    const response = require('../../config/response')

    const fs = require('fs')


    router.post('/schools', async(req, res) => {
        if(!req.body.name) { return response.sendError(res, '学校名が必要です' ) }
        const model = await Schools.create(req.body)
        fs.copyFile("./routes/schools/template/template.js", "./routes/schools/"+model._id+'.js', function(){})
        return response.sendSuccess(res, model, '新規追加完了')
    })

    router.get('/schools', async(req, res) => {
        const items = await Schools.find().limit(10)
        return response.sendSuccess(res, items, '学校データ読み込み完了')
    })

    router.get('/schools/:id', async(req, res) => {
        const model = await Schools.findById(req.params.id)
        return response.sendSuccess(res, model, '学校情報読み込み完了')
    })

    router.put('/schools/:id', async(req, res) => {
        const model = await Schools.findByIdAndUpdate(req.params.id, req.body)
        return response.sendSuccess(res, model, '学校情報編集完了')
    })

    router.get('/users', async(req, res) => {
        const model = await Users
        .find()
        .limit(10)
        .populate('school')
        .exec((err, users)=>{
            return response.sendSuccess(res, users, 'ユーザ情報込み込み完了')
        })
    })

    router.get('/users/:id', async(req, res) => {
        const model = await Users.findById(req.params.id)
        return response.sendSuccess(res, model, 'ユーザ情報読み込み完了')
    })

    router.put('/users/:id', async(req, res) => {
        const model = await Users.findByIdAndUpdate(req.params.id, req.body)
        return response.sendSuccess(res, model, 'ユーザ情報編集完了')
    })

    router.post('/admins', async(req, res) => {
        if(!req.body.username) { return response.sendError(res, 'メールアドレス' ) }
        const model = await AdminUsers.create(req.body)
        return response.sendSuccess(res, model, '新規追加完了')
    })

    router.get('/admins', async(req, res) => {
        const items = await AdminUsers.find().limit(10)
        return response.sendSuccess(res, items, '管理者情報読み込み完了')
    })

    router.get('/admins/:id', async(req, res) => {
        const model = await AdminUsers.findById(req.params.id)
        return response.sendSuccess(res, model, '管理者情報読み込み完了')
    })

    router.put('/admins/:id', async(req, res) => {
        const model = await AdminUsers.findByIdAndUpdate(req.params.id, req.body)
        return response.sendSuccess(res, model, '管理者情報編集完了')
    })

    app.use('/admin/api', router)
}