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
      console.log('Delete Success')
    })
    .catch(error => {
      console.log(error)
    })
}

/**
 * List all upcoming advertised car rides that this user can ride in.
 *
 * @param filters An object containing specific filter options. @see rider router
 */
const listAvailableAdvertisedCarRidesForRider = async (
  user,
  currentDate,
  currentTime,
  filters,
  db
) => {
  console.log('listAvailableAdvertisedCarRidesForRider')
  return db
    .any(
      `
    -- Car rides the user is not driver for
    SELECT a.driver, a.date, a.time, a.origin, a.destination FROM advertisedCarRide a
    WHERE a.driver <> $1
      AND TO_CHAR(CAST(a.date as timestamp), 'DD Month YYYY') LIKE '%${
        filters.date
      }%'
      AND CAST(a.time as VARCHAR(25)) LIKE '%${filters.time}%'
      AND a.origin LIKE '%${filters.origin}%'
      AND a.destination LIKE '%${filters.destination}%'
      AND (a.date > $2
           OR (a.date = $2
              AND a.time > $3)
           )
    GROUP BY a.driver, a.date, a.time, a.origin, a.destination

    EXCEPT

    -- Car rides the user has bid
    (SELECT b.driver, b.date, b.time, b.origin, b.destination FROM bid b
    WHERE b.bidder = $1 OR b.bidStatus <> 'pending'
    GROUP BY b.driver, b.date, b.time, b.origin, b.destination);
    `,
      [user, currentDate, currentTime]
    )
    .then(result => {
      console.log(`Retrieved all upcoming car rides!`)
      return result
    })
    .catch(error => {
      console.log(error)
    })
}

const listCarsUserOwns = async (user, db) => {
  return db
    .any(
      `
      SELECT u.licensePlate, u.carBrand, u.carModel, u.numSeats FROM userOwnsACar u
      WHERE u.owner = $1
    `,
      [user]
    )
    .then(result => {
      console.log(`Retrieved all cars a user owns!`)
      return result
    })
    .catch(error => {
      console.log(error)
    })
}

/**
 * List car rides that user will be a rider in, that are confirmed.
 *
 * @param filters An object containing specific filter options. @see rider router
 */
const listConfirmedRidesForRider = async (
  user,
  currentDate,
  currentTime,
  filters,
  db
) => {
  return db
    .any(
      `
    SELECT a.driver, a.date, a.time, a.origin, a.destination, a.car, b.bidAmount
    FROM advertisedCarRide a
    NATURAL JOIN bid b
    WHERE b.bidStatus = 'successful'
      AND b.bidder = $1
      AND TO_CHAR(CAST(b.date as timestamp), 'DD Month YYYY') LIKE '%${
        filters.date
      }%'
      AND CAST(b.time as varchar(20)) LIKE '%${filters.time}%'
      AND b.origin LIKE '%${filters.origin}%'
      AND b.destination LIKE '%${filters.destination}%'
      AND (a.date > $2
           OR (a.date = $2
              AND a.time > $3)
           )
    `,
      [user, currentDate, currentTime]
    )
    .then(result => {
      console.log(`Retrieved all confirmed car rides for rider ${user}!`)
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
    SELECT DISTINCT a.driver, a.date, a.time, a.origin, a.destination, a.car FROM advertisedCarRide a
    NATURAL JOIN bid b
    WHERE b.bidStatus = 'successful'
      AND a.driver = $1;
    `,
      [user]
    )
    .then(result => {
      console.log(`Retrieved all confirmed car rides for driver ${user}!`)
      return result
    })
    .catch(error => {
      console.log(error)
    })
}

/**
 * List car rides that user will be a driver for, still have available seats.
 */
const listPendingRidesForDriver = async (user, db) => {
  return db
    .any(
      `
      SELECT DISTINCT a.driver, a.date, a.time, a.origin, a.destination, a.car 
      FROM advertisedCarRide a
      WHERE 
      -- This ride is advertised by the driver
      a.driver = $1 
      -- This ride is not overdue
      AND (a.date > current_date 
           OR (a.date = current_date
              AND a.time > current_time)
          )
      -- This ride has not reached maximum capacity
      -- This condition makes checking for bidstatus redundant
      AND NOT EXISTS( 
        SELECT 1
        FROM car_rides_with_capacity c
        WHERE a.driver = c.driver
        AND a.date = c.date
        AND a.time = c.time
        AND a.origin = c.origin
        AND a.destination = c.destination
        AND c.currcapacity >= c.maxcapacity)
      ORDER BY a.driver, a.date, a.time, a.origin, a.destination;
    `,
      [user]
    )
    .then(result => {
      console.log(`Retrieved all pending car rides for driver ${user}!`)
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
  listCarsUserOwns,
  delAdvertisedRide,
}
