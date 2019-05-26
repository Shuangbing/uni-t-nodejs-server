var express = require('express')
var package_json = require('../package.json')
var router = express.Router()

router.get('/', function(req, res, next) {
  res.status(200).send({message: 'Welcome to Uni-T Server!', timestamp: Date.now(), version: package_json.version})
})

module.exports = router
