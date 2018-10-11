var express = require('express');
var router = express.Router();
// var db = require("../model/db.js")

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
 * To be called by driver view
 */
router.post('/create', function(req, res, next) {
  // change to bid details instead of name
  const user_name = req.body.name_field
  res.redirect('/driver')
});


module.exports = router
