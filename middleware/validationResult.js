const { check, validationResult } = require('express-validator');

exports.validateUser = [
  check('username', 'Username is required').isLength({ min: 5 }),
  check(
    'username',
    'username contains non alphanumeric characters - not allowed.'
  ).isAlphanumeric(),
  check('password', 'Password is required').not().isEmpty(),
  check('email', 'Email does not appear to be valid').isEmail(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(422).json({ errors: errors.array() });
    next();
  },
];
