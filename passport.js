const passport = require('koa-passport');
const LocalStrategy = require('passport-local'); //local Auth Strategy
const JwtStrategy = require('passport-jwt').Strategy; // Auth via JWT
const ExtractJwt = require('passport-jwt').ExtractJwt; // Auth via JWT

const User = require('./models/User');

const CONFIG = require('./config');

passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
      session: false
    },
    function (email, password, done) {
      User.findOne({ email }, (err, user) => {
        if (err) {
          return done(err);
        }

        if (!user || !user.checkPassword(password)) {
          return done(null, false, { message: 'User does not exist or wrong password.' });
        }
        return done(null, user);
      });
    })
);

const config = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: CONFIG.jwtsecret
};

passport.use(
  new JwtStrategy(
    config,
    function (payload, done) {
      User.findById(payload.id, (err, user) => {
        if (err) {
          return done(err)
        }
        if (user) {
          done(null, user)
        } else {
          done(null, false)
        }
      })
    })
);

module.exports = passport;