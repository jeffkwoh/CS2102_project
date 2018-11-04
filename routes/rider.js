var express = require('express')
var router = express.Router()
var db = require('../model/db.js')
const connect = require('connect-ensure-login')

/* GET user-rider's rides/bids listing page. */
router.get('/', connect.ensureLoggedIn('/login') ,async function(req, res, next) {
  const riderId = req.user
  const filters = {
    driver: req.body.driverFilter || "",
    date: req.body.dateFilter || "",
    time: req.body.timeFilter || "",
    origin: req.body.originFilter || "",
    destination: req.body.destinationFilter || "",
    bidAmount: req.body.bidAmountFilter || "",
    bidStatus: req.body.bidStatusFilter || ""
  }
  // fetch:
  // 1) car rides that are confirmed for this rider
  // 2) bids (for car rides) that are pending
  // 3) All upcoming car rides that can be bid for
  const confirmedRides = await db.ride.listConfirmedRidesForRider(
    riderId,
    filters,
    db.exposedInstance
  )
  const biddedRides = await db.bid.listPendingBidsForUser(
    riderId,
    filters,
    db.exposedInstance
  )
  const availableRides = await db.ride.listAvailableAdvertisedCarRidesForRider(
    riderId,
    filters,
    db.exposedInstance
  )
  res.render('rider', { riderId, confirmedRides, biddedRides, availableRides })
})

module.exports = router
