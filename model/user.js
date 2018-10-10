<<<<<<< HEAD
const addAppUserAccount = (userEmail, userContactNumber, userName, userPassword) =>  {
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

const addCarToUser = (licensePlate, owner, carBrand, carModel, numSeats) =>  {
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

const advertiseACarRide = (driver, car, date, time, origin, destination) =>  {
    db.none('INSERT INTO userOwnsACar(driver, car, date, time, origin, destination) ' +
        'VALUES($1, $2, $3, $4, $5)', [driver, car, date, time, origin, destination])
        .then(() => {
            console.log("success!");
            // success;
        })
        .catch(error => {
            console.log(error);
            // error;
        });
};
/*
const listAdvertisedCarRides = (driver, car, date, time, origin, destination) =>  {
    db.any('SELECT * FROM advertisedCarRide(driver, car, date, time, origin, destination) ' +
        'VALUES($1, $2, $3, $4, $5)', [driver, car, date, time, origin, destination])
        .then(() => {
            console.log("success!");
            // success;
        })
        .catch(error => {
            console.log(error);
            // error;
        });
};
*/

module.exports = {
    addUser,
    getAllUsers
};