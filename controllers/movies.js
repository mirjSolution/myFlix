const Movie = require('../models/Movie');

// @desc      Get all movies
// @route     GET /movies
exports.getMovies = (req, res) => {
  Movie.find()
    .then((movies) => {
      res.status(200).json(movies);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
};

// @desc      Get movie by title
// @route     GET /movies/:title
exports.getMovie = (req, res) => {
  Movie.findOne({ title: new RegExp(`^${req.params.title}$`, 'i') })
    .then((movie) => {
      res.status(200).json(movie);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
};

// @desc      Get genre by name/title
// @route     GET /movies/genre/:title
exports.getMovieGenre = (req, res) => {
  Movie.findOne({ 'genre.name': new RegExp(`^${req.params.genre}$`, 'i') })
    .then((movie) => {
      res.status(200).json({
        movie,
      });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
};

// @desc      Get director by name
// @route     GET /movies/directors/:director
exports.getMovieDirector = (req, res) => {
  Movie.findOne({ 'director.name': new RegExp(`^${req.params.name}$`, 'i') })
    .then((movie) => {
      res.status(201).json({
        movie,
      });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
};
