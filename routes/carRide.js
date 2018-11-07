var express = require('express')
var router = express.Router()
var db = require('../model/db.js')
var connect = require('connect-ensure-login')

/**
 * GET car rides listing page.
 * Only 1 car ride listing is to be viewed at a time.
 */
router.post('/', connect.ensureLoggedIn('/login'), async function(req, res, next) {
  const user = req.user
  const driver = req.body.driver
  const date = req.body.date
  const time = req.body.time
  const origin = req.body.origin
  const destination = req.body.destination
  const pendinBids = await db.bid.listPendingBidsForRide(
    driver,
    date,
    time,
    origin,
    destination,
    db.exposedInstance
  )

  const ride = { pendinBids, driver, date, time, origin, destination }
  console.log(pendinBids)
  const highestBid = await db.bid.highestCurrentBid(
    driver,
    date,
    time,
    origin,
    destination,
    db.exposedInstance
  )
  makeReadable(ride)
  res.render('carRide', { user, ride, bids, highestBid })
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

router.post('/delete', async function(req, res, next) {
  const driver = req.body.driver
  const sanitized_date = new Date(req.body.date).toLocaleDateString()
  const time = req.body.time
  const origin = req.body.origin
  const dest = req.body.destination

  await db.ride.delAdvertisedRide(
    driver,
    sanitized_date,
    time,
    origin,
    dest,
    db.exposedInstance
  )

  res.redirect(`/driver`)
})

function makeReadable(ride) {
    ride.date_readable = parseDate(ride.date)
    ride.time_readable = parseTime(ride.time)
}

function parseDate(date) {
  var temp = date.toString().substring(0,15);
  return temp.substring(0,3) + "," + temp.substring(3,15)
}

function parseTime(time) {
  return time.substring(0,5);
}

module.exports = router
