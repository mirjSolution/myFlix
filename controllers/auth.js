// const bcrypt = require('bcrypt');
// const User = require('../models/User');
const jwtSecret = 'bkslbsd-05u7ophn095789fdihbiuf';
const jwt = require('jsonwebtoken'),
  passport = require('passport');
require('../middleware/passport');

// Generate Token
let generateJWTToken = (user) => {
  return jwt.sign(user, jwtSecret, {
    subject: user.username,
    expiresIn: '7d',
    algorithm: 'HS256',
  });
};

// @desc      Login user
// @route     POST /auth/login
exports.login = (req, res) => {
  passport.authenticate('local', { session: false }, (error, user) => {
    if (error || !user) {
      return res.status(400).json({
        message: 'Invalid Credential',
      });
    }
    req.login(user, { session: false }, (error) => {
      if (error) {
        res.send(error);
      }
      let token = generateJWTToken(user.toJSON());
      let username = user.username;
      return res.json({ user: { username }, token });
    });
  })(req, res);
};
