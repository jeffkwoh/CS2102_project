/**
 * Given a user, create a car ride to be advertised
 */
const advertiseCarRide = (user, car, date, time, origin, destination, db) =>  {
    db.none(`
      INSERT INTO advertisedCarRide(driver, car, date, time, origin, destination)
        VALUES(${user}, ${car}, ${date}, ${time}, ${origin}, ${destination});`)
        .then(() => {
            console.log(`Created car ride by User ${user}, on ${date}, ${time}!`);
        })
        .catch(error => {
            console.log(error);
        });
};

/**
 * List all advertised car rides, that are upcoming.
 */
const listAdvertisedCarRides = (db) =>  {
    db.all('SELECT a.origin, a.destination, a.date, a.time FROM advertisedCarRide a;')
        .then(() => {
            console.log(`Retrived all upcoming car rides!`);
        })
        .catch(error => {
            console.log(error);
        });
};

module.exports = {
    advertiseCarRide,
    listAdvertisedCarRides,
};
