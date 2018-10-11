// Creates a bid for a user
const createUserBid = (user, bidAmount, driver, date, time, origin, destination, db) =>  {
  return db.none(
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
        `, [user, bidAmount, driver, date, time, origin, destination])
  .then(() => {
    console.log("success!");
    // success;
  })
  .catch(error => {
    console.log(error);
    // error;
  });
};

// Updates the bid of a User
const updateUserBid = (user, bidAmount, driver, date, time, origin, destination, db) =>  {
  return db.none(`
        UPDATE bid 
        SET b.bidAmount = $1 
        FROM bid b 
        WHERE b.bidder = $2
        AND b.driver = $3
        AND b.date = $4
        AND b.time = $5
        AND b.origin = $6
        AND b.destination = $7;
        `,[bidAmount, user, driver, date, time, origin, destination])
  .then(() => {
    console.log("success!");
    // success;
  })
  .catch(error => {
    console.log(error);
    // error;
  });
};

// Deletes the bid of a User
const deleteUserBid = (user, driver, date, time, origin, destination, db) =>  {
  return db.none(`
        DELETE FROM bid b 
        WHERE b.bidder = $1
        AND b.driver = $2 
        AND b.date = $3 
        AND b.time = $4
        AND b.origin = $5 
        AND b.destination = $6;`
  ,[user, driver, date, time, origin, destination])
  .then(() => {
    console.log("success!");
    // success;
  })
  .catch(error => {
    console.log(error);
    // error;
  });
};

// List all bids a user has made
const listBidsAUserHas = (user, db) =>  {
  return db.any(`
        SELECT b.date, b.time, b.origin, b.destination, b.bidAmount 
        FROM bid b WHERE b.bidder = $1;`
  , [user])
  .then((result) => {
    console.log(`List bids success:\n${result}`);
    // success;
    return result;
  })
  .catch(error => {
    console.log(error);
    // error;
  });
};

// Updates an existing bid in the table Bid as successful
const setBidAsSuccessful = (successfulBidder, driver, date, time, origin, destination, db) =>  {
  return db.none(`
        UPDATE bid 
        SET b.bidStatus = 'successful' 
        FROM bid b 
        WHERE b.bidder = $1
        AND b.driver = $2 
        AND b.date = $3 
        AND b.time = $4 
        AND b.origin = $5 
        AND b.destination = $6;`
  , [successfulBidder, driver, date, time, origin, destination])
  .then(() => {
    console.log("success!");
    // success;
  })
  .catch(error => {
    console.log(error);
    // error;
  });
};

// Updates an existing bid in the table Bid as unsuccessful
const setBidAsUnsuccessful = (unsuccessfulBidder, driver, date, time, origin, destination, db) =>  {
  return db.none(`
        UPDATE bid 
        SET b.bidStatus = 'unsuccessful' 
        FROM bid b 
        WHERE b.bidder = $1 
        AND b.driver = $2 
        AND b.date = $3 
        AND b.time = $4 
        AND b.origin = $5
        AND b.destination = $6;`
  , [unsuccessfulBidder, driver, date, time, origin, destination])
  .then(() => {
    console.log("success!");
    // success;
  })
  .catch(error => {
    console.log(error);
    // error;
  });
};

module.exports = {
  createUserBid,
  updateUserBid,
  listBidsAUserHas,
  deleteUserBid,
  setBidAsSuccessful,
  setBidAsUnsuccessful
};
