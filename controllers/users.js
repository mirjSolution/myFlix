const { check, validationResult } = require('express-validator');
const User = require('../models/User');

// @desc      Add user
// @route     POST /users
exports.addUser = (req, res, next) => {
  // check the validation object for errors
  let errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  let hashedPassword = User.hashPassword(req.body.password);
  User.findOne({ Username: req.body.username }) // Search to see if a user with the requested username already exists
    .then((user) => {
      if (user) {
        //If the user is found, send a response that it already exists
        return res.status(400).send(req.body.username + ' already exists');
      } else {
        User.create({
          username: req.body.username,
          password: hashedPassword,
          email: req.body.email,
          birthday: req.body.birthday,
        })
          .then((user) => {
            res.status(201).json(user);
          })
          .catch((error) => {
            console.error(error);
            res.status(500).send('Error: ' + error);
          });
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Error: ' + error);
    });
};

// @desc      Update user
// @route     PUT /users/:username
exports.updateUser = (req, res, next) => {
  let hashedPassword = User.hashPassword(req.body.password);
  User.findOneAndUpdate(
    { username: req.params.username },
    {
      $set: {
        username: req.body.username,
        password: hashedPassword,
        email: req.body.email,
        birthday: req.body.birthday,
      },
    },
    { new: true },
    (err, updatedUser) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error: ' + err);
      } else {
        res.status(200).json(updatedUser);
      }
    }
  );
};

// @desc      Delete user
// @route     DELETE /users/:username
exports.deleteUser = (req, res, next) => {
  User.findOneAndRemove({ username: req.params.username })
    .then((user) => {
      if (!user) {
        res.status(400).send(req.params.username + ' was not found');
      } else {
        res.status(200).send(req.params.username + ' was deleted.');
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
};

// @desc      Add a list of favorite movie to a user
// @route     POST /users/:username/movies/:movieId
exports.addFavoriteMovie = (req, res, next) => {
  User.findOneAndUpdate(
    { username: req.params.username },
    {
      $push: { favoriteMovies: req.params.movieID },
    },
    { new: true }, // This line makes sure that the updated document is returned
    (err, updatedUser) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error: ' + err);
      } else {
        res.json(updatedUser);
      }
    }
  );
};

// @desc      Remove a list of favorite movie to a user
// @route     DELETE /users/:username/movies/:movieId
exports.deleteFavoriteMovie = (req, res, next) => {
  User.findOneAndUpdate(
    { username: req.params.username },
    { $pull: { favoriteMovies: req.params.movieID } },
    { new: true },
    (err, updatedUser) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error: ' + err);
      } else {
        res.json(updatedUser);
      }
    }
  );
};
