var express = require('express')
var router = express.Router()
var db = require('../model/db.js')
const connect = require('connect-ensure-login')

/* GET user-rider's rides/bids listing page. */
router.get('/', connect.ensureLoggedIn('/login') ,async function(req, res, next) {
  const riderId = req.user
  // fetch:
  // 1) car rides that are confirmed for this rider
  // 2) bids (for car rides) that are pending
  // 3) All upcoming car rides that can be bid for
  const confirmedRides = await db.ride.listConfirmedRidesForRider(
    riderId,
    db.exposedInstance
  )
  const biddedRides = await db.bid.listPendingBidsForUser(
    riderId,
    db.exposedInstance
  )
  const unsuccessfulBiddedRides = await db.bid.listUnsuccessfulBidsForUser(
    riderId,
    db.exposedInstance
  )

  const availableRides = await db.ride.listAvailableAdvertisedCarRidesForRider(
    riderId,
    db.exposedInstance
  )

  const numUpcomingRides = await db.ride.countUpcomingRides(
    riderId,
    db.exposedInstance
  )

  res.render('rider', { riderId, confirmedRides,unsuccessfulBiddedRides,
    biddedRides, availableRides, numUpcomingRides})
})

module.exports = router
