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
    advertiseCarRide,
    listAdvertisedCarRides,
};
