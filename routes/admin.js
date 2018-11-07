var express = require('express')
var router = express.Router()
var db = require('../model/db.js')
const connect = require('connect-ensure-login')

const ensureAdmin = (req, res, next) => {
  if (req.user === 1)
    next()
  else
    res.redirect('/')
}

/* GET admin page. */
router.get('/', connect.ensureLoggedIn('/login'), ensureAdmin, async function(req, res, next) {
})

router.post('/editRide', connect.ensureLoggedIn('/login'), ensureAdmin, async function(req, res, next) {
})

router.post('/deleteRide', connect.ensureLoggedIn('/login'), ensureAdmin, async function(req, res, next) {
})

router.post('/editCar', connect.ensureLoggedIn('/login'), ensureAdmin, async function(req, res, next) {
})

router.post('/deleteCar', connect.ensureLoggedIn('/login'), ensureAdmin, async function(req, res, next) {
})

module.exports = router
