var express = require('express');
var router = express.Router();
// var db = require("../model/db.js")

/* GET car rides listing page. */
router.get('/', function(req, res, next) {
  // fetch:
  // 1) car rides that are pending
  //   - Bids for these car rdies
  // 2) car rides that are confirmed
  const confirmedRides = [
    { date: "2018-10-30", time: "1500", startLocation:"Suntec City", endLocation:"NUS" },
    { date: "2018-10-30", time: "1500", startLocation:"Suntec City", endLocation:"NUS" },
    { date: "2018-10-30", time: "1500", startLocation:"Suntec City", endLocation:"NUS" },
    { date: "2018-10-30", time: "1500", startLocation:"Suntec City", endLocation:"NUS" },
  ]
  const pendingRides = confirmedRides.map(ride => {
    ride.bids = [
      { userId: "asdf", userName: "name", bid: 30.4},
      { userId: "asdf", userName: "name", bid: 30.4},
      { userId: "asdf", userName: "name", bid: 30.4}
    ]
    return ride
  })
  res.render('driver', { confirmedRides, pendingRides });
});


/* POST car ride creation. */
router.post('/create', function(req, res, next) {
  // change to bid details instead of name
  const user_name = req.body.name_field
  res.redirect('/driver')
});


module.exports = router
