var express = require('express')
var router = express.Router()
var db = require('../model/db.js')
var connect = require('connect-ensure-login')

/**
 * GET car rides listing page.
 * Only 1 car ride listing is to be viewed at a time.
 */
router.post('/', connect.ensureLoggedIn('/login'), async function(req, res, next) {
  const driver = req.body.driver
  const date = req.body.date
  const time = req.body.time
  const origin = req.body.origin
  const destination = req.body.destination
  const bids = await db.bid.listBidsForRide(
    driver,
    date,
    time,
    origin,
    destination,
    db.exposedInstance
  )
  const ride = { bids, driver, date, time, origin, destination }
  console.log(bids)
  const highestBid = await db.bid.highestCurrentBid(
    driver,
    date,
    time,
    origin,
    destination,
    db.exposedInstance
  )
  res.render('carRide', { ride, bids, highestBid })
})

/**
 * POST car ride creation.
 *
 * To be called by driver view.
 */
router.post('/create', connect.ensureLoggedIn('/login'), async function(req, res, next) {
  const params = [
    req.body.driver_field,
    req.body.licensePlate_field,
    req.body.date_field,
    req.body.time_field,
    req.body.origin_field,
    req.body.destination_field,
    db.exposedInstance,
  ]

  await db.ride.advertiseCarRide(...params)

  res.redirect(`/driver`)
})

module.exports = router
