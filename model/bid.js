// Creates a bid for a user
const createUserBid = (user, bidAmount, driver, date, time, origin, destination, db) =>  {
    db.none(
        `
        INSERT INTO bid(bidder, bidStatus, bidAmount, driver, date, time, origin, destination) 
        VALUES(
            ${user}, 
            'pending', 
            ${bidAmount}, 
            ${driver}, 
            ${date}, 
            ${time}, 
            ${origin}, 
            ${destination}
        );
        `)
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
    db.none(`
        UPDATE bid 
        SET b.bidAmount = ${bidAmount} 
        FROM bid b 
        WHERE b.bidder = ${user}
        AND b.driver = ${driver}
        AND b.date = ${date}
        AND b.time = ${time}
        AND b.origin = ${origin}
        AND b.destination = ${destination};
        `)
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
    db.none(`
        DELETE FROM bid b 
        WHERE b.bidder = ${user} 
        AND b.driver = ${driver} 
        AND b.date = ${date} 
        AND b.time = ${time} 
        AND b.origin = ${origin} 
        AND b.destination = ${destination};`)
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
    db.any(`
        SELECT b.date, b.time, b.origin, b.destination, b.bidAmount 
        FROM bid b WHERE b.bidder = ${user};`)
        .then(() => {
            console.log("success!");
            // success;
        })
        .catch(error => {
            console.log(error);
            // error;
        });
};

// Updates an existing bid in the table Bid as successful
const setBidAsSuccessful = (successfulBidder, driver, date, time, origin, destination, db) =>  {
    db.none(`
        UPDATE bid 
        SET b.bidStatus = ${successful} 
        FROM bid b 
        WHERE b.bidder = ${successfulBidder} 
        AND b.driver = ${driver} 
        AND b.date = ${date} 
        AND b.time = ${time} 
        AND b.origin = ${origin} 
        AND b.destination = ${destination};`)
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
    db.none(`
        UPDATE bid 
        SET b.bidStatus = 'unsuccessful' 
        FROM bid b 
        WHERE b.bidder = ${unsuccessfulBidder} 
        AND b.driver = ${driver} 
        AND b.date = ${date} 
        AND b.time = ${time} 
        AND b.origin = ${origin}
        AND b.destination = ${destination};`)
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
}