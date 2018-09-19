var express = require('express')
var router = express.Router()

/* GET users listing page. */
router.get('/', function(req, res, next) {
  const mockUsers = [
    { name: "alison" },
    { name: "burgers" },
    { name: "constantine" },
    { name: "diplo" },
  ]
  res.render('users', { users: mockUsers });
});


/* POST user creation. */
router.post('/create', function(req, res, next) {
  const user_name = req.body.name_field
  // add user to db here
  res.redirect('/')
});


module.exports = router
