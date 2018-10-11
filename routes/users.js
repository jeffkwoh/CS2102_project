var express = require('express');
var router = express.Router();
var db = require("../model/db.js");

/* GET users listing page. */
router.get('/', async function(req, res, next) {
  const users = await db.user
  .listUserAppAccount(db.exposedInstance);

  res.render('users', { users: users });
});

/* POST user creation. */
router.post('/create', async function(req, res, next) {
  const name = req.body.name_field;
  const email = req.body.email_field;
  const number = req.body.contact_number_field;
  // For educational use only. Plaintext passwords being passed is a security
  // vulnerability.
  const password= req.body.password_field;

  await db.user.createUserAppAccount(email, number, name, password, db.exposedInstance);

  res.redirect('/users')
});

module.exports = router;
