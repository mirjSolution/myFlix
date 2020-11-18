const express = require('express');
const passport = require('passport');
const { validateUser } = require('../middleware/validationResult');
const {
  addUser,
  updateUser,
  deleteUser,
  addFavoriteMovie,
  deleteFavoriteMovie,
  getUser,
} = require('../controllers/users');

const router = express.Router();

router.route('/').post(validateUser, addUser);

router
  .route('/:username')
  .put(validateUser, updateUser)
  .delete(deleteUser)
  .get(passport.authenticate('jwt', { session: false }), getUser);
router
  .route('/:username/movies/:title')
  .post(addFavoriteMovie)
  .delete(deleteFavoriteMovie);

module.exports = router;
