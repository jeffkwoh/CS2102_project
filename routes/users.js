var express = require('express')
var router = express.Router()

/* GET users listing page. */
router.get('/', function(req, res, next) {
  res.render('users', { user: {name: "Alison Burger"} });
});


/* POST user creation. */
router.post('/create', function(req, res, next) {
  const user_name = req.body.name_field
  // add user to db here
  res.redirect('/')
});


module.exports = router
