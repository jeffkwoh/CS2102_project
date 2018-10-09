var express = require('express');
var router = express.Router();
// var db = require("../model/db.js")

/* GET bidding listing page. */
router.get('/', function(req, res, next) {
  // fetch:
  // 1) Car rides that are confirmed
  // 2) Pending bids
  // 3) List of all unconfirmed car rides that 
  //    user has not bidded for
  const mockBids = [
    { date: "1st" },
    { date: "2nd" },
    { date: "3rd" },
    { date: "4rth" },
  ]
  res.render('rider', { rides: mockBids });
});


/* POST Bid creation. */
router.post('/create', function(req, res, next) {
  // change to bid details instead of name
  const user_name = req.body.name_field
  res.redirect('/rider')
});


module.exports = router
