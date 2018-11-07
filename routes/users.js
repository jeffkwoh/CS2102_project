var express = require('express')
var router = express.Router()
var db = require('../model/db.js')
var connect = require('connect-ensure-login')

/* GET users listing page. */
router.get('/', connect.ensureLoggedIn('/login') ,async function(req, res, next) {
  const users = await db.user.listUserAppAccount(db.exposedInstance)

  res.render('users', { users: users })
})

/* POST user creation. */
router.post('/create', connect.ensureLoggedIn('/login') ,async function(req, res, next) {
  const name = req.body.name_field
  const email = req.body.email_field
  const number = req.body.contact_number_field
  // For educational use only. Plaintext passwords being passed is a security
  // vulnerability.
  const password = req.body.password_field

  await db.user.createUserAppAccount(
    email,
    number,
    name,
    password,
    db.exposedInstance
  )

  res.redirect('/users')
})

/* Assume the role of a user. */
router.post('/assumeUser', async function(req, res, next) {
  // ensure user is an admin first.
  // if (req.userId !== 0) {
  //   res.redirect('/')
  // }

  const currentUser = req.user;
  console.log(req.user);
  // TODO check if user is 0
  const targetId = req.body.user_id_field;
  console.log(req.body.user_id_field);
  await req.login(targetId, function(err) {
    if (err) { return next(err); }
    return res.redirect('/users/');
  });
})

/* POST Delete creation. */
router.post('/delete', async function(req, res, next) {
  const userId = req.body.user_id_field
  await db.user.delUserAcct(
    userId,
    db.exposedInstance
  )

  res.redirect('/users')
})

module.exports = router
