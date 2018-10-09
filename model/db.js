const pgp = require('pg-promise')({
  // initialisation options.
});

const cn = require('../config/config.js');

console.log(cn);
const db = pgp(cn);


/* Databse initialisation */
// Users
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




const addUser = (user_name) =>  {
  db.none('INSERT INTO Users(name) VALUES($1)', [user_name])
    .then(() => {
      console.log("success!");
      // success;
    })
    .catch(error => {
      console.log(error);
      // error;
    });
};

const getAllUsers = () => {
  db.any('SELECT * FROM Users')
    .then(data => {
      console.log(data); // print data;
      return data;
    })
    .catch(error => {
      console.log(error); // print the error;
    })
};

module.exports = {
  addUser,
  getAllUsers,
  exposedInstance : db
};
