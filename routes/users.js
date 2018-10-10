var express = require('express');
var router = express.Router();
var db = require("../model/db.js");

/* GET users listing page. */
router.get('/', function(req, res, next) {
  const mockUsers = [
    { name: "alison" },
    { name: "burgers" },
    { name: "constantine" },
    { name: "diplo" },
  ]
    db.user.addAppUserAccount('tom@tom.com', '91923312', 'tommy koh', 'password');
  res.render('users', { users: mockUsers });
});

/* POST user creation. */
router.post('/create', function(req, res, next) {
  const user_name = req.body.name_field
  // add user to db here
  res.redirect('/users')
});

module.exports = router
