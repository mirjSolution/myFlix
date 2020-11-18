const passport = require('passport'),
  LocalStrategy = require('passport-local').Strategy,
  Model = require('../models/User'),
  passportJWT = require('passport-jwt');

let User = Model,
  JWTStrategy = passportJWT.Strategy,
  ExtractJWT = passportJWT.ExtractJwt;

passport.use(
  new LocalStrategy(
    {
      usernameField: 'username',
      passwordField: 'password',
    },
    (username, password, callback) => {
      console.log(username + '  ' + password);
      User.findOne({ username: username }, (error, user) => {
        if (error) {
          console.log(error);
          return callback(error);
        }

        if (!user) {
          console.log('Invalid Credential');
          return callback(null, false, { message: 'Invalid Credential.' });
        }

        if (!user.validatePassword(password)) {
          console.log('Invalid Credential');
          return callback(null, false, { message: 'Invalid Credential.' });
        }

        console.log('finished');
        return callback(null, user);
      });
    }
  )
);

//“JWTStrategy,” allows to authenticate users based on the JWT submitted alongside their request.
passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
      //“secret” key to verify the signature of the JWT
      secretOrKey: 'bkslbsd-05u7ophn095789fdihbiuf',
    },
    (jwtPayload, callback) => {
      return User.findById(jwtPayload._id)
        .then((user) => {
          return callback(null, user);
        })
        .catch((error) => {
          return callback(error);
        });
    }
  )
);
