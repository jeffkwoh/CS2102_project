// Creates a bid for a user
const createUserBid = async (
  user,
  bidAmount,
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
        INSERT INTO bid(bidder, bidStatus, bidAmount, driver, date, time, origin, destination) 
        VALUES(
            $1,
            'pending',
            $2,
            $3,
            $4,
            $5,
            $6,
            $7
        );
        `,
      [user, bidAmount, driver, new Date(date), time, origin, destination]
    )
    .then(() => {
      console.log('success!')
      // success;
    })
    .catch(error => {
      console.log(error)
      // error;
    })
}

// Updates the bid of a User
// Note that in Postgres SQL, table alias is not available in SET clause.
const updateUserBid = async (
  user,
  bidAmount,
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
        UPDATE bid b
        SET bidAmount = $1 
        WHERE b.bidder = $2
        AND b.driver = $3
        AND b.date = $4
        AND b.time = $5
        AND b.origin = $6
        AND b.destination = $7;
        `,
      [bidAmount, user, driver, date, time, origin, destination]
    )
    .then(() => {
      console.log(`success! Bidamount:${bidAmount} User:${user}\n`)
      // success;
    })
    .catch(error => {
      console.log('ERROR:' + error)
      // error;
    })
}

// Deletes the bid of a User
const deleteUserBid = async (
  user,
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
        DELETE FROM bid b 
        WHERE b.bidder = $1
        AND b.driver = $2 
        AND b.date = $3 
        AND b.time = $4
        AND b.origin = $5 
        AND b.destination = $6;`,
      [user, driver, date, time, origin, destination]
    )
    .then(() => {
      console.log('success! user bid deleted.')
      // success;
    })
    .catch(error => {
      console.log(error)
      // error;
    })
}

/*
 * List all bids a user has made.
 *
 * @param filters An object containing specific filter options. @see rider router
 */
const listPendingBidsForUser = async (user, filters, db) => {
  return db
    .any(
      `
    SELECT a.driver, a.date, a.time, a.origin, a.destination, a.car, b.bidAmount, b.bidStatus
    FROM advertisedCarRide a
    NATURAL JOIN bid b
    WHERE b.bidder = $1
      AND b.bidStatus = 'pending'
      AND TO_CHAR(CAST(b.date as timestamp), 'DD Month YYYY') LIKE '%${filters.date}%'
      AND CAST(b.time as VARCHAR(25)) LIKE '%${filters.time}%'
      AND b.origin LIKE '%${filters.origin}%'
      AND b.destination LIKE '%${filters.destination}%'
    ORDER BY b.date ASC, b.time ASC;
      `, [user]
    )
    .then(result => {
      console.log(`List bids success:\n${JSON.stringify(result)}`)
      // success;
      return result
    })
    .catch(error => {
      console.log(error)
      // error;
    })
}

// Return the current highest bid for the ride
const highestCurrentBid = async (driver, date, time, origin, destination, db) => {
  return db
    .any(
      `
      SELECT MAX(b.bidAmount) AS result
      FROM bid b
      WHERE b.driver = $1
      AND b.date = $2
      AND b.time = $3
      AND b.origin = $4
      AND b.destination = $5;`,
      [driver, new Date(date), time, origin, destination]
    )
    .then(result => {
      console.log('success!')
      // success;
      return result
    })
    .catch(error => {
      console.log(error)
      // error;
    })
}

// List all bids a user has made
const listUnsuccessfulBidsForUser = async (user, currentDate, currentTime, db) => {
  return db
    .any(
      `
    SELECT a.driver, a.date, a.time, a.origin, a.destination, a.car, b.bidStatus
    FROM advertisedCarRide a
    NATURAL JOIN bid b
    WHERE b.bidStatus = 'unsuccessful'
      AND b.bidder = $1
      AND (a.date > $2
           OR (a.date = $2
              AND a.time > $3)
           )
    ORDER BY a.date DESC;`,
      [user, currentDate, currentTime]
    )
    .then(result => {
      console.log(`List Unsuccessful Bids:\n${JSON.stringify(result)}`)
      // success;
      return result
    })
    .catch(error => {
      console.log(error)
      // error;
    })
}

// Updates an existing bid in the table Bid as successful
const updateBidStatus = async (
  successfulBidder,
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
        UPDATE bid
        SET bidStatus = 'successful' 
        WHERE bidder = $1
          AND driver = $2 
          AND date = $3 
          AND time = $4 
          AND origin = $5 
          AND destination = $6;

        UPDATE bid
        SET bidStatus = 'unsuccessful' 
        WHERE bidder <> $1 
          AND driver = $2 
          AND date = $3 
          AND time = $4 
          AND origin = $5
          AND destination = $6;`,
      [successfulBidder, driver, date, time, origin, destination]
    )
    .then(() => {
      console.log('success!')
      // success;
    })
    .catch(error => {
      console.log(error)
      // error;
    })
}


const listBidsForRide = async (driver, date, time, origin, destination, db) => {
  return db
    .any(
      `
      SELECT *
      FROM bid b
      WHERE b.driver = $1
        AND b.date = $2
        AND b.time = $3
        AND b.origin = $4
        AND b.destination = $5
      ORDER BY b.bidAmount DESC;
      `,
      [driver, new Date(date), time, origin, destination]
    )
    .then(result => {
      // success;
      console.log('success!')
      return result
    })
    .catch(error => {
      // error;
      console.log(error)
    })
}

module.exports = {
  createUserBid,
  updateUserBid,
  listPendingBidsForUser,
  listBidsForRide,
  highestCurrentBid,
  listUnsuccessfulBidsForUser,
  deleteUserBid,
  updateBidStatus
}
