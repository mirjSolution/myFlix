const express = require('express');
const {
  getMovies,
  getMovie,
  getMovieGenre,
  getMovieDirector,
} = require('../controllers/movies');

const router = express.Router();

router.route('/').get(getMovies);
router.route('/:title').get(getMovie);
router.route('/genre/:title').get(getMovieGenre);
router.route('/directors/:director').get(getMovieDirector);

module.exports = router;
