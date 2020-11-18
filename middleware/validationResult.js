const { check, validationResult } = require('express-validator');

exports.validateUser = [
  check('username', 'Username must be greater than 5 characters').isLength({
    min: 5,
  }),
  check('username', 'Username is required').not().isEmpty(),
  check(
    'username',
    'username contains non alphanumeric characters - not allowed.'
  ).isAlphanumeric(),
  check('password', 'Password is required').not().isEmpty(),
  check('password', 'Password must be greater than 5 characters').isLength({
    min: 5,
  }),
  check(
    'password',
    'Password contains non alphanumeric characters - not allowed.'
  ).isAlphanumeric(),
  check('email', 'Email does not appear to be valid').isEmail(),
  check('birthday', 'Birthday is required').not().isEmpty(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(422).json({ errors: errors.array() });
    next();
  },
];
