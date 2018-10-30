var express = require('express');
var router = express.Router();
var passport = require('../config/passport')

/* GET login page. */
router.get('/', function(req, res, next) {
  res.render('login');
});

/* Post data to passport */
router.post('/', passport.authenticate('local'), function(req, res, next) {
  res.redirect('/rider');
});

module.exports = router;
