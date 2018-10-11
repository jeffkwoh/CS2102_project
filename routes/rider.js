var express = require('express');
var router = express.Router();
var db = require("../model/db.js")

/* GET user-rider's rides/bids listing page. */
router.get('/', async function(req, res, next) {
  // fetch:
  // 1) car rides that are confirmed for this rider
  // 2) bids (for car rides) that are pending
  // 3) All upcoming car rides that can be bid for
  const confirmedRides = [
    { id: 0, date: "2018-10-30", time: "1500", origin:"Suntec City", destination:"NUS" }
  ]
  const biddedRides = [
    { id: 4, date: "2018-10-30", time: "1500", origin:"Ivan City", destination:"NUS", bid:34.2 },
    { id: 5, date: "2018-10-30", time: "1500", origin:"Ivan City", destination:"NUS", bid:34.2 },
    { id: 6, date: "2018-10-30", time: "1500", origin:"Ivan City", destination:"NUS", bid:34.2 },
    { id: 7, date: "2018-10-30", time: "1500", origin:"Ivan City", destination:"NUS", bid:34.2 },
  ]
  const availableRides = [
    { id: 1, date: "2018-10-30", time: "1500", origin:"Suntec City", destination:"NUS" },
    { id: 2, date: "2018-10-30", time: "1500", origin:"Suntec City", destination:"NUS" },
    { id: 3, date: "2018-10-30", time: "1500", origin:"Suntec City", destination:"NUS" },
  ]

  const rides = await db.ride.listAdvertisedCarRides(db.exposedInstance)
  console.log(rides)
  res.render('rider', { confirmedRides, biddedRides, availableRides });
});

module.exports = router
