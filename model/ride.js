/**
 * Given a user, create a car ride to be advertised
 */
const advertiseCarRide = async (
  user,
  car,
  date,
  time,
  origin,
  destination,
  db
) => {
  return db
    .none(
      `
      INSERT INTO advertisedCarRide(driver, car, date, time, origin, destination)
      VALUES($1, $2, $3, $4, $5, $6);`,
      [user, car, new Date(date), time, origin, destination]
    )
    .then(() => {
      console.log(`Created car ride by User ${user}, on ${date}, ${time}!`)
    })
    .catch(error => {
      console.log(error)
    })
}

/**
 * Delete a currently advertised ride
 */
const delAdvertisedRide = async (
  driver,
  date,
  time,
  origin,
  destination,
  db
) => {
  return db
    .none(
      `
      DELETE FROM bid
      WHERE driver = $1 AND date = $2 AND time = $3
      AND origin = $4 AND destination = $5; 
      
      DELETE FROM advertisedCarRide
      WHERE driver = $1 AND date = $2 AND time = $3
      AND origin = $4 AND destination = $5;
      `,
      [driver, date, time, origin, destination]
    )
    .then(() => {
      console.log("Delete Success")
    })
    .catch(error => {
      console.log(error)
    })
}

/**
 * List all upcoming advertised car rides that this user can ride in.
 */
const listAvailableAdvertisedCarRidesForRider = async (user, db) => {
  return db
    .any(
      `
    -- Car rides the user is not driver for
    SELECT a.driver, a.date, a.time, a.origin, a.destination FROM advertisedCarRide a
    WHERE a.driver <> $1
    GROUP BY a.driver, a.date, a.time, a.origin, a.destination

    EXCEPT

    -- Car rides the user has bid
    SELECT b.driver, b.date, b.time, b.origin, b.destination FROM bid b
    WHERE b.bidder = $1 OR b.bidStatus <> 'pending'
    GROUP BY b.driver, b.date, b.time, b.origin, b.destination;
    `,
      [user]
    )
    .then(result => {
      console.log(`Retrived all upcoming car rides!`)
      return result
    })
    .catch(error => {
      console.log(error)
    })
}

/**
 * List car rides that user will be a rider in, that are confirmed.
 */
const listConfirmedRidesForRider = async (user, db) => {
  return db
    .any(
      `
    SELECT a.driver, a.date, a.time, a.origin, a.destination, a.car, b.bidAmount
    FROM advertisedCarRide a
    NATURAL JOIN bid b
    WHERE b.bidStatus = 'successful'
      AND b.bidder = $1;
    `,
      [user]
    )
    .then(result => {
      console.log(`Retrived all confirmed car rides for rider ${user}!`)
      return result
    })
    .catch(error => {
      console.log(error)
    })
}

/**
 * List car rides that user will be a driver for, that are confirmed.
 */
const listConfirmedRidesForDriver = async (user, db) => {
  return db
    .any(
      `
    SELECT a.driver, a.date, a.time, a.origin, a.destination FROM advertisedCarRide a
    NATURAL JOIN bid b
    WHERE b.bidStatus = 'successful'
      AND a.driver = $1;
    `,
      [user]
    )
    .then(result => {
      console.log(`Retrived all confirmed car rides for driver ${user}!`)
      return result
    })
    .catch(error => {
      console.log(error)
    })
}

/**
 * List car rides that user will be a driver for, that are still pending.
 */
const listPendingRidesForDriver = async (user, db) => {
  return db
    .any(
      `
    SELECT a.driver, a.date, a.time, a.origin, a.destination FROM advertisedCarRide a
    LEFT OUTER JOIN bid b ON a.driver = b.driver
      AND a.date = b.date
      AND a.time = b.time
      AND a.origin = b.origin
      AND a.destination = b.destination
    WHERE a.driver = $1 AND b.bidStatus LIKE '%pending%'
    GROUP BY a.driver, a.date, a.time, a.origin, a.destination;
    `,
      [user]
    )
    .then(result => {
      console.log(`Retrived all pending car rides for driver ${user}!`)
      return result
    })
    .catch(error => {
      console.log(error)
    })
}

module.exports = {
  advertiseCarRide,
  listAvailableAdvertisedCarRidesForRider,
  listConfirmedRidesForRider,
  listConfirmedRidesForDriver,
  listPendingRidesForDriver,
  delAdvertisedRide
}
