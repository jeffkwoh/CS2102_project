const pgp = require('pg-promise')({
  // initialisation options.
})
const cn = require('../config/config.js')
const db = pgp(cn)


const runQuery = (query, log) => 
  db.none(query)
    .then(() => {
      // success;
      console.log(log);
    })
    .catch(error => {
      // error;
      console.log(error);
    });
const initTableQuery = (query, tableName) => runQuery(query, `Created ${tableName} table!`)
const dropTableQuery = (query, tableName) => runQuery(query, `Dropped ${tableName} table!`)

/* Databse initialisation */
const initDb = () => {
  // Users
  initTableQuery(`
    CREATE TABLE IF NOT EXISTS appUserAccount (
      userID SERIAL PRIMARY KEY,
      email VARCHAR(128) UNIQUE NOT NULL,
      contactNumber VARCHAR(15) NOT NULL,
      name VARCHAR(64) NOT NULL,
      password VARCHAR(32) NOT NULL
    );`, 'appUserAccount')

  initTableQuery(`
    CREATE TABLE IF NOT EXISTS userOwnsACar (
      licensePlate VARCHAR(10) PRIMARY KEY, 
      owner INTEGER NOT NULL,
      carBrand VARCHAR (64) NOT NULL, 
      carModel VARCHAR (64) NOT NULL, 
      numSeats INTEGER NOT NULL CHECK (numSeats > 0),
      FOREIGN KEY (owner) REFERENCES appUserAccount(userID)
    );`, 'userOwnsACar')

  initTableQuery(`
    CREATE TABLE IF NOT EXISTS advertisedCarRide (
      driver INTEGER REFERENCES appUserAccount(userID), 
      car VARCHAR(10) REFERENCES userOwnsAcar(licensePlate), 
      date DATE NOT NULL, 
      time TIME NOT NULL, 
      origin VARCHAR(128) NOT NULL, 
      destination VARCHAR(128) NOT NULL, 
      PRIMARY KEY (driver, date, time, origin, destination) 
    );`, 'advertisedCarRide')

  initTableQuery(`
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
    );`, 'bid')
}

const deinitDb = () => {
  dropTableQuery(`DROP TABLE IF EXISTS bid;`, 'bid')
  dropTableQuery(`DROP TABLE IF EXISTS advertisedCarRide;`, 'advertisedCarRide')
  dropTableQuery(`DROP TABLE IF EXISTS userOwnsACar;`, 'userOwnsACar')
  dropTableQuery(`DROP TABLE IF EXISTS appUserAccount;`, 'appUserAccount')
}


/* DB helpers to be exported */
const user = require('./user.js')
module.exports = {
  initDb,
  deinitDb,
  user,
  exposedInstance : db
};
