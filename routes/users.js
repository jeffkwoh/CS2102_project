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
router.post('/create', function(req, res, next) {
  const user_name = req.body.name_field;
  // add user to db here

  res.redirect('/users')
});

module.exports = router;
