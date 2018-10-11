/**
* Given a user, create a car ride to be advertised
*/
  const advertiseCarRide = async (user, car, date, time, origin, destination, db) =>  {
    return db.none(`
      INSERT INTO advertisedCarRide(driver, car, date, time, origin, destination)
      VALUES($1, $2, $3, $4, $5, $6);`,
      [user, car, new Date(date), time, origin, destination]
    )
      .then(() => {
        console.log(`Created car ride by User ${user}, on ${date}, ${time}!`);
      })
      .catch(error => {
        console.log(error);
      });
  };

/**
 * List all advertised car rides, that are upcoming and available.
 */
const listAvailableAdvertisedCarRides = async (db) =>  {
  return db.any(`
    SELECT a.driver, a.date, a.time, a.origin, a.destination FROM advertisedCarRide a
    NATURAL JOIN bid b
    GROUP BY a.driver, a.date, a.time, a.origin, a.destination
    HAVING COUNT(DISTINCT b.bidStatus) <= 1;
    `)
    .then((result) => {
      console.log(`Retrived all upcoming car rides!`)
      return result
    })
    .catch(error => {
      console.log(error);
    });
};

/**
 * List car rides that user will be a rider in, that are confirmed.
 */
const listConfirmedRidesForRider = async (user, db) =>  {
  return db.any(`
    SELECT a.driver, a.date, a.time, a.origin, a.destination FROM advertisedCarRide a
    NATURAL JOIN bid b
    WHERE b.bidStatus = 'successful'
      AND b.bidder = $1;
    `, [user])
    .then((result) => {
      console.log(`Retrived all confirmed car rides for rider ${user}!`)
      return result
    })
    .catch(error => {
      console.log(error);
    });
};

/**
 * List car rides that user will be a driver for, that are confirmed.
 */
const listConfirmedRidesForDriver = async (user, db) =>  {
  return db.any(`
    SELECT a.driver, a.date, a.time, a.origin, a.destination FROM advertisedCarRide a
    NATURAL JOIN bid b
    WHERE b.bidStatus = 'successful'
      AND a.driver = $1;
    `, [user])
    .then((result) => {
      console.log(`Retrived all confirmed car rides for driver ${user}!`)
      return result
    })
    .catch(error => {
      console.log(error);
    });
};

/**
 * List car rides that user will be a driver for, that are still pending.
 */
const listPendingRidesForDriver = async (user, db) =>  {
  return db.any(`
    SELECT a.driver, a.date, a.time, a.origin, a.destination FROM advertisedCarRide a
    NATURAL JOIN bid b
    WHERE a.driver = 1
      AND b.bidStatus  = 'pending'
    GROUP BY a.driver, a.date, a.time, a.origin, a.destination;
    `, [user])
    .then((result) => {
      console.log(`Retrived all pending car rides for driver ${user}!`)
      return result
    })
    .catch(error => {
      console.log(error);
    });
};

module.exports = {
  advertiseCarRide,
  listAvailableAdvertisedCarRides,
  listConfirmedRidesForRider,
  listConfirmedRidesForDriver,
  listPendingRidesForDriver
};
