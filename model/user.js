const pgp = require('pg-promise')({
  // initialisation options.
});
const cn = require('../config/config.js');
const db = pgp(cn);

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
  getAllUsers
};
