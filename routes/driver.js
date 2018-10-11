var express = require('express');
var router = express.Router();
// var db = require("../model/db.js")

/* GET car rides listing page. */
router.get('/', async function(req, res, next) {
  // fetch:
  // 1) car rides that are pending
  // 2) car rides that are confirmed
  const confirmedRides = await db.ride.listConfirmedRidesForDriver(1, db.exposedInstance)
  const pendingRides = await db.ride.listConfirmedRidesForDriver(1, db.exposedInstance)
  res.render('driver', { confirmedRides, pendingRides });
});

module.exports = router
