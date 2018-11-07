var express = require('express')
var router = express.Router()
var db = require('../model/db.js')
const connect = require('connect-ensure-login')

/* GET admin page. */
router.get('/', connect.ensureLoggedIn('/login') ,async function(req, res, next) {
  if (req.user === 1) {
    res.render('admin', { rides: [] })
  } else {
    res.redirect('/')
  }
})

module.exports = router
