module.exports = app => {
    const express = require('express')
    const router = express.Router()
    const Schools = require('../../model/School')
    const response = require('../../config/response')

    router.post('/schools', async(req, res) => {
        if(!req.body.name) { return response.sendError(res, '学校名が必要です' ) }
        const model = await Schools.create(req.body)
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

    app.use('/admin/api', router)
}