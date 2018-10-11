var express = require('express');
var router = express.Router();
var db = require("../model/db.js")

/* GET user-rider's rides/bids listing page. */
router.get('/', async function(req, res, next) {
  // fetch:
  // 1) car rides that are confirmed for this rider
  // 2) bids (for car rides) that are pending
  // 3) All upcoming car rides that can be bid for
  const confirmedRides = await db.ride.listConfirmedRidesForUser(1, db.exposedInstance)
  const pendingBids = 1;
  const availableRides = await db.ride.listAvailableAdvertisedCarRides(db.exposedInstance)
  console.log(availableRides)
  res.render('rider', { confirmedRides, biddedRides: availableRides, availableRides });
});

module.exports = router
