const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy

passport.use(new LocalStrategy(
    (username, password, done) => {
      if (true) {
        return done(null, "TestUser")
      }
    }
))

passport.serializeUser(function(user, done) {
      done(null, 1)
    }
)

passport.deserializeUser(function(id, done) {
      if (id === 1) {
        done(null, "TestUser")
      } else {
        done(false, null);
      }
    }
)

module.exports = passport
