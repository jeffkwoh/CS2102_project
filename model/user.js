// Allows creation of usr account
const createUserAppAccount = (userEmail, userContactNumber, userName, userPassword, db) =>  {
    db.none(`
        INSERT INTO appUserAccount(email, contactNumber, name, password) 
        VALUES(
            ${userEmail}, 
            ${userContactNumber}, 
            ${userName}, 
            ${userPassword}
        );`)
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
    db.any(`
        SELECT a.name, a.email 
        FROM appUserAccount a;`)
        .then(() => {
            console.log("success!");
            // success;
        })
        .catch(error => {
            console.log(error);
            // error;
        });
};

// Adds a car to a specific user
const addCarToUser = (owner, licensePlate, carBrand, carModel, numSeats, db) =>  {
    db.none(`
        INSERT INTO userOwnsACar(licensePlate, owner, carBrand, carModel, numSeats) 
        VALUES(
            ${licensePlate}, 
            ${owner}, 
            ${carBrand}, 
            ${carModel}, 
            ${numSeats}
        );`
        )
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
    db.any(`
        SELECT c.licensePlate, c.carBrand, c.carModel 
        FROM userOwnsACar c 
        WHERE c.owner = ${owner};
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

// Given a user, create a car ride to be advertised
const advertiseCarRide = (user, car, date, time, origin, destination, db) =>  {
    db.none(`
        INSERT INTO advertisedCarRide(driver, car, date, time, origin, destination) 
        VALUES(
            ${user}, 
            ${car}, 
            ${date}, 
            ${time}, 
            ${origin}, 
            ${destination}
        );`)
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
    db.any(`
        SELECT a.origin, a.destination, a.date, a.time 
        FROM advertisedCarRide a;`)
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
    listAdvertisedCarRides
};
