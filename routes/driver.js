var express = require('express')
var router = express.Router()
var db = require('../model/db.js')
var connect = require('connect-ensure-login')

/* GET car rides listing page. */
router.get('/', connect.ensureLoggedIn('/login') ,async function(req, res, next) {
  const driverId = req.user

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

  const ownedCars = await db.ride.listCarsUserOwns(
    driverId,
    db.exposedInstance
  )

  res.render('driver', { driverId, confirmedRides, pendingRides, ownedCars })
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

  res.redirect('/driver')
})

/* POST Car */
router.post('/addCar', async function(req, res, next) {
  const owner_field = req.body.owner_field
  const licensePlate_field = req.body.licensePlate_field
  const carBrand_field = req.body.carBrand_field
  const carModel_field = req.body.carModel_field
  const numAvailSeats_field = req.body.numAvailSeats_field

  await db.car.addCarToUser(
    owner_field,
    licensePlate_field,
    carBrand_field,
    carModel_field,
    numAvailSeats_field,
    db.exposedInstance
  )

  res.redirect('/driver')
})

/* POST Car */
router.post('/addCar', async function(req, res, next) {
  const owner_field = req.body.owner_field
  const licensePlate_field = req.body.licensePlate_field
  const carBrand_field = req.body.carBrand_field
  const carModel_field = req.body.carModel_field
  const numAvailSeats_field = req.body.numAvailSeats_field

  await db.car.addCarToUser(
    owner_field,
    licensePlate_field,
    carBrand_field,
    carModel_field,
    numAvailSeats_field,
    db.exposedInstance
  )

  res.redirect('/driver')
})

module.exports = router
