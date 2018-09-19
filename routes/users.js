var express = require('express')
var router = express.Router()

/* GET users listing page. */
router.get('/', function(req, res, next) {
  res.render('users', { user: {name: "Alison Burger"} });
});


/* POST user creation. */
router.post('/create', function(req, res, next) {
  // add user to db here
  const user_name = req.body.name_field
  console.log(user_name)
  res.redirect('/')
});


module.exports = router
