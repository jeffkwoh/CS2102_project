var express = require('express');
var router = express.Router();
var db = require("../model/db.js")

/* GET user-rider's rides/bids listing page. */
router.get('/', async function(req, res, next) {
  const riderId = req.query.user_id_field;
  // fetch:
  // 1) car rides that are confirmed for this rider
  // 2) bids (for car rides) that are pending
  // 3) All upcoming car rides that can be bid for
  const confirmedRides = await db.ride.listConfirmedRidesForRider(riderId, db.exposedInstance)
  const biddedRides = await db.bid.listPendingBidsForUser(riderId, db.exposedInstance);
  const availableRides = await db.ride.listAvailableAdvertisedCarRides(db.exposedInstance)
  res.render('rider', { riderId, confirmedRides, biddedRides, availableRides });
});

module.exports = router
