var express = require('express')
var router = express.Router()
var db = require('../model/db.js')

/**
 * GET car rides listing page.
 * Only 1 car ride listing is to be viewed at a time.
 */
router.post('/', async function(req, res, next) {
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
  res.render('carRide', { ride, bids })
})

/**
 * POST car ride creation.
 *
 * To be called by driver view.
 */
router.post('/create', async function(req, res, next) {
  // TODO pass in user and car here
  const params = [
    req.body.driver_field,
    'SAA0000A',
    req.body.date_field,
    req.body.time_field,
    req.body.origin_field,
    req.body.destination_field,
    db.exposedInstance,
  ]

  await db.ride.advertiseCarRide(...params)

  res.redirect(`/driver?user_id_field=${req.body.driver_field}`)
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

  res.redirect(`/driver?user_id_field=${req.body.driver}`)
})

module.exports = router
