var express = require('express');
var router = express.Router();
var db = require("../model/db.js")

/* GET car rides listing page. */
router.get('/', async function(req, res, next) {
  const driver_id = req.query.user_id_field;

  // fetch:
  // 1) car rides that are pending
  // 2) car rides that are confirmed
  const confirmedRides = await db.ride.listConfirmedRidesForDriver(driver_id, db.exposedInstance)
  const pendingRides = await db.ride.listPendingRidesForDriver(driver_id, db.exposedInstance)
  res.render('driver', { confirmedRides, pendingRides });
});

module.exports = router
