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
  const availableRides = await db.ride.listAvailableAdvertisedCarRidesForRider(
    riderId,
    db.exposedInstance
  )

  makeReadable(availableRides);

  res.render('rider', { riderId, confirmedRides, biddedRides, availableRides })
})

function makeReadable(rides) {
  var len = rides.length;
  for (var i = 0; i < len; i++) {
    //console.log(JSON.stringify(rides[i].date))
    rides[i].date = parseDate(rides[i].date)
    rides[i].time = parseTime(rides[i].time)
    console.log(rides[i].date + " -- " + rides[i].time)
  }
}

function parseDate(date) {
  var temp = date.toString().substring(0,10);
  return temp.substring(0,3) + "," + temp.substring(3,10)
}

function parseTime(time) {
  return time.substring(0,5);
}

module.exports = router
