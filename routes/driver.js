var express = require('express');
var router = express.Router();
// var db = require("../model/db.js")

/* GET car rides listing page. */
router.get('/', function(req, res, next) {
  // fetch:
  // 1) car rides that are pending
  //   - Bids for these car rdies
  // 2) car rides that are confirmed
  const mockCarRides = [
    { date: "1st" },
    { date: "2nd" },
    { date: "3rd" },
    { date: "4rth" },
  ]
  res.render('driver', { rides: mockCarRides });
});


/* POST car ride creation. */
router.post('/create', function(req, res, next) {
  // change to bid details instead of name
  const user_name = req.body.name_field
  res.redirect('/driver')
});


module.exports = router
