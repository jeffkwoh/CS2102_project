var express = require('express')
var router = express.Router()
var db = require('../model/db.js')
var connect = require('connect-ensure-login')

/* GET car rides listing page. */
router.get('/', connect.ensureLoggedIn() ,async function(req, res, next) {
  const driverId = req.query.user_id_field

  // fetch:
  // 1) car rides that are pending
  // 2) car rides that are confirmed
  const confirmedRides = await db.ride.listConfirmedRidesForDriver(
    driverId,
    db.exposedInstance
  )
  const pendingRides = await db.ride.listPendingRidesForDriver(
    driverId,
    db.exposedInstance
  )
  res.render('driver', { driverId, confirmedRides, pendingRides })
})

/* POST Selected Bid */
router.post('/updateBidStatus', async function(req, res, next) {
  const bidderId = req.body.bidder_user_id
  const driverId = req.body.driver_user_id
  const sanitized_date = new Date(req.body.date_field).toLocaleDateString()
  const time = req.body.time_field
  const origin = req.body.origin_field
  const destination = req.body.destination_field

  await db.bid.updateBidStatus(
    bidderId,
    driverId,
    sanitized_date,
    time,
    origin,
    destination,
    db.exposedInstance
  )

  const confirmedRides = await db.ride.listConfirmedRidesForDriver(
    driverId,
    db.exposedInstance
  )
  const pendingRides = await db.ride.listPendingRidesForDriver(
    driverId,
    db.exposedInstance
  )

  res.render('driver', { driverId, confirmedRides, pendingRides })
})

module.exports = router
