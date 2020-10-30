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
exports.login = (req, res, next) => {
  passport.authenticate('local', { session: false }, (error, user, info) => {
    if (error || !user) {
      return res.status(400).json({
        message: 'Something is not right',
        user: user,
      });
    }
    req.login(user, { session: false }, (error) => {
      if (error) {
        res.send(error);
      }
      let token = generateJWTToken(user.toJSON());
      return res.json({ user, token });
    });
  })(req, res);
};

// const username = req.query.username;
//   const password = req.query.password;

//   if (!username || !password) {
//     return res.status(400).send('Please provide username and password');
//   }

//   User.findOne({ username: new RegExp(`^${username}$`, 'i') })
//     .then((user) => {
//       bcrypt.compare(password, user.password, (err, result) => {
//         if (result) {
//           let token = generateJWTToken(user.toJSON());
//           return res.status(200).json({ user, token });
//         }
//       });
//     })
//     .catch((err) => {
//       console.error(err);
//       return res.status(500).send('Invalid credential');
//     });
