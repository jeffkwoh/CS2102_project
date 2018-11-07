var db = require('../model/db.js')
var express = require('express')
var passport = require('../config/passport')
var router = express.Router()

/* GET login page. */
router.get('/', function(req, res, next) {
  res.redirect('/')
})

/* Post data to passport */
router.post('/', passport.authenticate('local'), function(req, res, next) {
  console.log(req.body)
  res.redirect('/rider')
})

/* Post data to passport */
router.post('/register', async function(req, res, next) {
  const { username, password, name, phone } = req.body
  await db.user.createUserAppAccount(
    username,
    phone,
    name,
    password,
    db.exposedInstance
  )

  res.redirect(308, '/login')
})

router.get('/logout', function(req, res, next) {
  req.logout()
  res.redirect('/')
})

module.exports = router
