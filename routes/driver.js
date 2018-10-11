var express = require('express');
var router = express.Router();
// var db = require("../model/db.js")

/* GET car rides listing page. */
router.get('/', function(req, res, next) {
  // fetch:
  // 1) car rides that are pending
  // 2) car rides that are confirmed
  const confirmedRides = [
    { id: 0, date: "2018-10-30", time: "1500", startLocation:"Suntec City", endLocation:"NUS" },
    { id: 1, date: "2018-10-30", time: "1500", startLocation:"Suntec City", endLocation:"NUS" },
    { id: 2, date: "2018-10-30", time: "1500", startLocation:"Suntec City", endLocation:"NUS" },
    { id: 3, date: "2018-10-30", time: "1500", startLocation:"Suntec City", endLocation:"NUS" },
  ]
  const pendingRides = [
    { id: 4, date: "2018-10-30", time: "1500", startLocation:"Ivan City", endLocation:"NUS" },
    { id: 5, date: "2018-10-30", time: "1500", startLocation:"Ivan City", endLocation:"NUS" },
    { id: 6, date: "2018-10-30", time: "1500", startLocation:"Ivan City", endLocation:"NUS" },
    { id: 7, date: "2018-10-30", time: "1500", startLocation:"Ivan City", endLocation:"NUS" },
  ]
  res.render('driver', { confirmedRides, pendingRides });
});


/* POST car ride creation. */
router.post('/create', function(req, res, next) {
  // change to bid details instead of name
  const user_name = req.body.name_field
  res.redirect('/driver')
});


module.exports = router
