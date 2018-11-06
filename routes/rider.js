var express = require('express')
var router = express.Router()
var db = require('../model/db.js')
const connect = require('connect-ensure-login')

/* GET user-rider's rides/bids listing page. */
router.get('/', connect.ensureLoggedIn('/login') ,async function(req, res, next) {
  const riderId = req.user
  const currentDateTime = new Date()
  const currentDate = currentDateTime.toISOString().split('T')[0]
  const currentTime = currentDateTime.getHours() + ":"
    + currentDateTime.getMinutes() + ":"
    + currentDateTime.getSeconds();
  const filters = {
    date: req.query.dateFilter || "",
    time: req.query.timeFilter || "",
    origin: req.query.originFilter || "",
    destination: req.query.destinationFilter || ""
  }
  console.log(filters)
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
  const unsuccessfulBiddedRides = await db.bid.listUnsuccessfulBidsForUser(
    riderId,
    db.exposedInstance
  )

  const availableRides = await db.ride.listAvailableAdvertisedCarRidesForRider(
    riderId,
    currentDate,
    currentTime,
    filters,
    db.exposedInstance
  )

  makeReadable(confirmedRides)
  makeReadable(biddedRides)
  makeReadable(unsuccessfulBiddedRides)
  makeReadable(availableRides)

  res.render('rider', { riderId, confirmedRides, unsuccessfulBiddedRides, biddedRides, availableRides })
})

function makeReadable(rides) {
  var len = rides.length;
  for (var i = 0; i < len; i++) {
    rides[i].i = i + 1
    rides[i].date_readable = parseDate(rides[i].date)
    rides[i].time_readable = parseTime(rides[i].time)
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
