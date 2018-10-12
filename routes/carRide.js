var express = require('express');
var router = express.Router();
var db = require("../model/db.js")

/**
 * GET car rides listing page.
 * Only 1 car ride listing is to be viewed at a time.
 */
router.get('/', function(req, res, next) {
  const ride = { id: 0, date: "2018-10-30", time: "1500", startLocation:"Suntec City", endLocation:"NUS" }
  res.render('carRide', { ride });
});


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
    db.exposedInstance
  ]

  await db.ride.advertiseCarRide(...params);

  res.redirect(`/driver?user_id_field=${req.body.driver_field}`)
});


module.exports = router
