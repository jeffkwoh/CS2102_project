// Allows creation of usr account
const createUserAppAccount = (userEmail, userContactNumber, userName, userPassword, db) =>  {
    db.none('INSERT INTO appUserAccount(email, contactNumber, name, password) ' +
        'VALUES($1, $2, $3, $4)', [userEmail, userContactNumber, userName, userPassword])
        .then(() => {
            console.log("success!");
            // success;
        })
        .catch(error => {
            console.log(error);
            // error;
        });
};

// Lists out the names and emails of everyone in userAppAccounts
const listUserAppAccount = (db) =>  {
    db.any('SELECT a.name, a.email FROM appUserAccount a')
        .then((result) => {
            console.log("success!");
            // success;
            return result;
        })
        .catch(error => {
            console.log(error);
            // error;
        });
};

// Adds a car to a specific user
const addCarToUser = (owner, licensePlate, carBrand, carModel, numSeats, db) =>  {
    db.none('INSERT INTO userOwnsACar(licensePlate, owner, carBrand, carModel, numSeats) ' +
        'VALUES($1, $2, $3, $4, $5)', [licensePlate, owner, carBrand, carModel, numSeats])
        .then(() => {
            console.log("success!");
            // success;
        })
        .catch(error => {
            console.log(error);
            // error;
        });
};

// listCarUserOwns(arg1, arg2).then((res) => ...) use case
// lists all the cars owned by a user
const listCarUserOwns = (owner, db) =>  {
    db.any('SELECT c.licensePlate, c.carBrand, c.carModel FROM userOwnsACar c WHERE c.owner = $1', [owner])
        .then((result) => {
            console.log("success!");
            // success;
            return result;
        })
        .catch(error => {
            console.log(error);
            // error;
        });
};

// Given a user, create a car ride to be advertised
const advertiseCarRide = (user, car, date, time, origin, destination, db) =>  {
    db.none('INSERT INTO advertisedCarRide(driver, car, date, time, origin, destination) ' +
        'VALUES($1, $2, $3, $4, $5)', [user, car, date, time, origin, destination])
        .then(() => {
            console.log("success!");
            // success;
        })
        .catch(error => {
            console.log(error);
            // error;
        });
};

// List all the advertised car rides
const listAdvertisedCarRides = (db) =>  {
    db.any('SELECT a.origin, a.destination, a.date, a.time FROM advertisedCarRide a')
        .then((result) => {
            console.log("success!");
            // success;
      return result;
        })
        .catch(error => {
            console.log(error);
            // error;
        });
};

// Creates a bid for a user
const createUserBid = (user, bidAmount, driver, date, time, origin, destination, db) =>  {
    db.none('INSERT INTO bid(bidder, bidStatus, bidAmount, driver, date, time, origin, destination) ' +
        'VALUES($1, $2, $3, $4, $5, $6, $7, $8)', [user, 'pending', bidAmount, driver, date, time, origin, destination])
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
    db.none('UPDATE bid SET b.bidAmount = $1 FROM bid b WHERE b.bidder = $2 ' +
        'AND b.driver = $3 AND b.date = $4 AND b.time = $5 AND b.origin = $6 AND b.destination = $7, ', +
        [bidAmount, user, driver, date, time, origin, destination])
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
    db.none('DELETE FROM bid b WHERE b.bidder = $1 AND b.driver = $2 AND b.date = $3 ' +
        'AND b.time = $4 AND b.origin = $5 AND b.destination = $6 ', [user, driver, date, time, origin, destination])
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
    db.any('SELECT b.date, b.time, b.origin, b.destination, b.bidAmount FROM bid b WHERE b.bidder = $1', [user])
        .then((result) => {
            console.log("success!");
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
    db.none('UPDATE bid SET b.bidStatus = $1 FROM bid b WHERE b.bidder = $2 ' +
        'AND b.driver = $3 AND b.date = $4 AND b.time = $5 AND b.origin = $6 AND b.destination = $7, ', +
        ['successful', successfulBidder, driver, date, time, origin, destination])
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
    db.none('UPDATE bid SET b.bidStatus = $1 FROM bid b WHERE b.bidder = $2 ' +
        'AND b.driver = $3 AND b.date = $4 AND b.time = $5 AND b.origin = $6 AND b.destination = $7, ', +
        ['unsuccessful', unsuccessfulBidder, driver, date, time, origin, destination])
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
    createUserAppAccount,
    listUserAppAccount,
    addCarToUser,
    listCarUserOwns,
    advertiseCarRide,
    listAdvertisedCarRides,
    createUserBid,
    updateUserBid,
    listBidsAUserHas,
    deleteUserBid,
    setBidAsSuccessful,
    setBidAsUnsuccessful
};
