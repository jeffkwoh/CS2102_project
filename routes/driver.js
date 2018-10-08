var express = require('express');
var router = express.Router();
// var db = require("../model/db.js")

/* GET car rides listing page. */
router.get('/', function(req, res, next) {
  const mockCarRides = [
    { date: "1st" },
    { date: "2nd" },
    { date: "3rd" },
    { date: "4rth" },
  ]
  res.render('driver', { rides: mockCarRides });
});


/* POST user creation. */
router.post('/create', function(req, res, next) {
  const user_name = req.body.name_field
  // add user to db here
  res.redirect('/users')
});


module.exports = router
