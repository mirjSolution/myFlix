const express = require('express');
const passport = require('passport');
const { validateUser } = require('../middleware/validationResult');
const {
  addUser,
  updateUser,
  deleteUser,
  addFavoriteMovie,
  deleteFavoriteMovie,
} = require('../controllers/users');

const router = express.Router();

router.route('/').post(validateUser, addUser);
router.route('/:username').put(validateUser, updateUser).delete(deleteUser);
router
  .route('/:username/movies/:movieID')
  .post(addFavoriteMovie)
  .delete(deleteFavoriteMovie);

module.exports = router;
