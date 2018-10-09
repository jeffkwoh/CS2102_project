const pgp = require('pg-promise')({
  // initialisation options.
});
const cn = require('../config/config.js');
const db = pgp(cn);


const initTable = (query, tableName) =>
  db.none(query)
    .then(() => {
      // success;
      console.log(`Created ${tableName} table!`);
    })
    .catch(error => {
      // error;
      console.log(error);
    });
/* Databse initialisation */
// Users
const initDb = () =>
  db.none(`
    CREATE TABLE IF NOT EXISTS appUserAccount (
      userID SERIAL PRIMARY KEY,
      email VARCHAR(128) UNIQUE NOT NULL,
      contactNumber VARCHAR(15) NOT NULL,
      name VARCHAR(64) NOT NULL,
      password VARCHAR(32) NOT NULL
    );`)
    .then(() => {
      console.log("Created Users table!");
      // success;
    })
    .catch(error => {
      console.log(error);
      // error;
    });





module.exports = {
  addUser,
  getAllUsers,
  exposedInstance : db
};
