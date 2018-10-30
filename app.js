var createError = require('http-errors')
var express = require('express')
var path = require('path')
var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser')
var session = require('express-session')
var passport = require('./config/passport')
var logger = require('morgan')
var sassMiddleware = require('node-sass-middleware')

// db
var db = require('./model/db')

var indexRouter = require('./routes/index')
var usersRouter = require('./routes/users')
var driverRouter = require('./routes/driver')
var riderRouter = require('./routes/rider')
var carRideRouter = require('./routes/carRide')
var biddingRouter = require('./routes/bidding')
var loginRouter = require('./routes/login')

var app = express()

// local variables
app.locals = {
  ...app.locals,
  title: 'Hitch',
  description: 'A website to list and go on shared car rides!'
};

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'hbs')

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(
  sassMiddleware({
    src: path.join(__dirname, 'public'),
    dest: path.join(__dirname, 'public'),
    indentedSyntax: true, // true = .sass and false = .scss
    sourceMap: true,
  })
)
app.use(express.static(path.join(__dirname, 'public')))

//passport
app.use(session({ secret:"outer-joins-are-useless" }))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(passport.initialize())
app.use(passport.session())

app.use('/', indexRouter)
app.use('/users', usersRouter)
app.use('/driver', driverRouter)
app.use('/rider', riderRouter)
app.use('/rides', carRideRouter)
app.use('/bidding', biddingRouter)
app.use('/login', loginRouter)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404))
})

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

// initialise database
async function dbDriver() {
  await db.deinitDb()
  await db.initDb()
  await db.populateDb()
}
dbDriver()

module.exports = app
