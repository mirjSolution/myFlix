const express = require('express');
const passport = require('passport');
const {
  getMovies,
  getMovie,
  getMovieGenre,
  getMovieDirector,
} = require('../controllers/movies');

const router = express.Router();

router
  .route('/')
  .get(passport.authenticate('jwt', { session: false }), getMovies);
router
  .route('/:title')
  .get(passport.authenticate('jwt', { session: false }), getMovie);
router
  .route('/genre/:genre')
  .get(passport.authenticate('jwt', { session: false }), getMovieGenre);
router
  .route('/director/:director')
  .get(passport.authenticate('jwt', { session: false }), getMovieDirector);

module.exports = router;
