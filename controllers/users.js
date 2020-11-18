const User = require('../models/User');
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

// @desc      Get user
// @route     GET /users/:user
exports.getUser = (req, res) => {
  User.findOne({ username: new RegExp(`^${req.params.username}$`, 'i') })
    .then((user) => {
      res.status(200).json(user);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
};

// @desc      Add user
// @route     POST /users
exports.addUser = (req, res) => {
  // check the validation object for errors

  let hashedPassword = User.hashPassword(req.body.password);
  User.findOne({ username: req.body.username }) // Search to see if a user with the requested username already exists
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
            let token = generateJWTToken(user.toJSON());
            return res.json({ user, token });
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
exports.updateUser = (req, res) => {
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
exports.deleteUser = (req, res) => {
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
exports.addFavoriteMovie = (req, res) => {
  User.findOneAndUpdate(
    {
      username: req.params.username,
      favoriteMovies: { $ne: req.params.title },
    },
    {
      $push: { favoriteMovies: req.params.title },
    },
    { new: true }, // This line makes sure that the updated document is returned
    (err, updatedUser) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error: ' + err);
      } else {
        if (updatedUser) {
          res.send('Successfully added to favourite');
        } else {
          res.send('Movie already added in the list');
        }
      }
    }
  );
};

// @desc      Remove a list of favorite movie to a user
// @route     DELETE /users/:username/movies/:movieId
exports.deleteFavoriteMovie = (req, res) => {
  User.findOneAndUpdate(
    { username: req.params.username },
    { $pull: { favoriteMovies: req.params.title } },
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
