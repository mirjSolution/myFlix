const express = require('express');
const {
  addUser,
  updateUser,
  deleteUser,
  addFavoriteMovie,
  deleteFavoriteMovie,
} = require('../controllers/users');
const router = express.Router();

router.route('/').post(addUser);
router.route('/:username').put(updateUser).delete(deleteUser);
router
  .route('/:username/movies/:movieID')
  .post(addFavoriteMovie)
  .delete(deleteFavoriteMovie);

module.exports = router;
