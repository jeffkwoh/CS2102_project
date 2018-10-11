const pgp = require('pg-promise')({
  // initialisation options.
})
const cn = require('../config/config.js')
const db = pgp(cn)
const user = require('./user.js')
const bid = require('./bid.js')
const ride = require('./ride.js')

/**
 * Initialises database, with all the necessary tables specified in the database
 * design of this application.
 */
async function initDb() {
  const query = `
  BEGIN;

  CREATE TABLE IF NOT EXISTS appUserAccount (
    userID SERIAL PRIMARY KEY,
    email VARCHAR(128) UNIQUE NOT NULL,
    contactNumber VARCHAR(15) NOT NULL,
    name VARCHAR(64) NOT NULL,
    password VARCHAR(32) NOT NULL
  );

  CREATE TABLE IF NOT EXISTS userOwnsACar (
    licensePlate VARCHAR(10) PRIMARY KEY,
    owner INTEGER NOT NULL,
    carBrand VARCHAR (64) NOT NULL,
    carModel VARCHAR (64) NOT NULL,
    numSeats INTEGER NOT NULL CHECK (numSeats > 0),
    FOREIGN KEY (owner) REFERENCES appUserAccount(userID)
  );

  CREATE TABLE IF NOT EXISTS advertisedCarRide (
    driver INTEGER REFERENCES appUserAccount(userID),
    car VARCHAR(10) REFERENCES userOwnsAcar(licensePlate),
    date DATE NOT NULL,
    time TIME NOT NULL,
    origin VARCHAR(128) NOT NULL,
    destination VARCHAR(128) NOT NULL,
    PRIMARY KEY (driver, date, time, origin, destination)
  );

  CREATE TABLE IF NOT EXISTS bid (
    bidStatus CHAR(12) CHECK(bidStatus = 'pending' OR bidStatus ='unsuccessful'
      OR bidStatus = 'successful') NOT NULL,
    bidAmount DECIMAL(6,2) NOT NULL CHECK (bidAmount >= 0),
    bidder INTEGER NOT NULL,
    driver INTEGER NOT NULL,
    date DATE NOT NULL,
    time TIME NOT NULL,
    origin VARCHAR(128),
    destination VARCHAR(128),
    FOREIGN KEY(bidder) REFERENCES appUserAccount(userID),
    FOREIGN KEY(driver, date, time, origin, destination)
    REFERENCES advertisedCarRide(driver, date, time, origin, destination),
    PRIMARY KEY(bidder, driver, date, time, origin, destination)
  );

  COMMIT;`

  return db.none(query)
    .then(() => {
      // success;
      console.log('Initialised tables!');
    })
    .catch(error => {
      // error;
      console.log(error);
    });
}

async function deinitDb() {
  const query = `
  BEGIN;

  DROP TABLE IF EXISTS bid;
  DROP TABLE IF EXISTS advertisedCarRide;
  DROP TABLE IF EXISTS userOwnsACar;
  DROP TABLE IF EXISTS appUserAccount;

  COMMIT;`

  return db.none(query)
    .then(() => {
      // success;
      console.log('Dropped all tables!');
    })
    .catch(error => {
      // error;
      console.log(error);
    });
}

async function populateDb() {

  await user.createUserAppAccount('one@a.com', '98765432', 'one', 'one', db);
  await user.createUserAppAccount('two@a.com', '88765432', 'two', 'two', db);
  await user.createUserAppAccount('thr@a.com', '78765432', 'thr', 'thr', db);
  await user.createUserAppAccount('fou@a.com', '68765432', 'fou', 'fou', db);
  await user.createUserAppAccount('fiv@a.com', '58765432', 'fiv', 'fiv', db);

  await user.addCarToUser('1', 'SAA0000A', 'BrandA', 'ModelA', '1', db);
  await user.addCarToUser('1', 'SAA1111A', 'BrandA', 'ModelA', '1', db);
  await user.addCarToUser('1', 'SAA2222A', 'BrandA', 'ModelA', '1', db);
  await user.addCarToUser('2', 'SBB0000B', 'BrandB', 'ModelB', '2', db);
  await user.addCarToUser('3', 'SCC0000C', 'BrandC', 'ModelC', '3', db);
  await user.addCarToUser('4', 'SDD0000D', 'BrandD', 'ModelD', '4', db);

  await ride.advertiseCarRide('1', 'SAA0000A', '2010-01-20', '13:00:00', 'PlaceA1', 'PlaceA2', db);
  await ride.advertiseCarRide('1', 'SAA2222A', '2010-02-20', '14:00:00', 'PlaceB1', 'PlaceB2', db);
  await ride.advertiseCarRide('2', 'SBB0000B', '2010-03-20', '15:00:00', 'PlaceC1', 'PlaceC2', db);
  await ride.advertiseCarRide('4', 'SDD0000D', '2010-04-20', '16:00:00', 'PlaceD1', 'PlaceD2', db);

  await bid.createUserBid('3', '100', '1', '2010-01-20', '13:00:00', 'PlaceA1', 'PlaceA2', db);
  await bid.createUserBid('4', '200', '1', '2010-01-20', '13:00:00', 'PlaceA1', 'PlaceA2', db);
  await bid.createUserBid('1', '100', '2', '2010-03-20', '15:00:00', 'PlaceC1', 'PlaceC2', db);
  await bid.createUserBid('5', '500', '1', '2010-01-20', '13:00:00', 'PlaceA1', 'PlaceA2', db);
  await bid.createUserBid('5', '120', '2', '2010-03-20', '15:00:00', 'PlaceC1', 'PlaceC2', db);
  await bid.createUserBid('5', '345', '4', '2010-04-20', '16:00:00', 'PlaceD1', 'PlaceD2', db);

  console.log("Populated all tables!")
}

/* DB helpers to be exported */
module.exports = {
  initDb,
  deinitDb,
  populateDb,
  user,
  bid,
  ride,
  exposedInstance : db
};
