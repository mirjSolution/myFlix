// Import express module or requiring express framework package.
const express = require('express');

// Encapsulate express functionality
const app = express();

const path = require('path');
// The express validator library offers a variety of validation methods for different types of inputted data.
const { check, validationResult } = require('express-validator');

//  is another HTTP request logger middleware for Node. js. It simplifies the process of logging requests to your application 
const morgan = require('morgan');

// Allows to read the “body” of HTTP requests within your request handlers simply by using the code req.body.
const bodyParser = require('body-parser');

// "app" argument you're passing here. This ensures that Express is available in your “auth.js”
let auth = require('./auth')(app);

// Import passport module
const passport = require('passport');
require('./passport');

// UUID stands for Universally Unique Identifier. With this module installed, you’re able to generate a unique ID at any point in time by simply using the code uuid.v4()
const uuid = require('uuid')

// Require the Mongoose package and your “models.js” file, as well as the Mongoose models defined in your “models.js
const mongoose = require('mongoose');
const Models = require('./models.js');

const Movies = Models.Movie;
const Users = Models.User;

// allows Mongoose to connect to that database so it can perform CRUD operations on the documents it contains from within REST API.
// mongoose.connect('mongodb://localhost:27017/myFlixDB', { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connect(process.env.CONNECTION_URI, { useNewUrlParser: true, useUnifiedTopology: true });

// With this line of code in place, any time you try to access the body of a request using req.body, the data will be expected to be in JSON format.
app.use(bodyParser.json());

// Require cors module
const cors = require('cors');
// allow requests from all origins 
// app.use(cors());
// only certain origins to be given access
app.use(cors({
  origin: (origin, callback) => {
    if(!origin) return callback(null, true);
    if(allowedOrigins.indexOf(origin) === -1){ // If a specific origin isn’t found on the list of allowed origins
      let message = 'The CORS policy for this application doesn’t allow access from origin ' + origin;
      return callback(new Error(message ), false);
    }
    return callback(null, true);
  }
}));

// The common parameter here specifies that requests should be logged using Morgan’s “common” format, which logs basic data such as IP address, the time of the request, the request method and path, as well as the status code that was sent back as a response morgan(':method :url :status :res[content-length] - :response-time ms')
app.use(morgan('common'))

// automatically routes all requests for static files -> URL endpoint is the /documentation.html
app.use(express.static('public'));

let allowedOrigins = ['http://localhost:8080', 'http://testsite.com'];



/*
app.METHOD(PATH, HANDLER)
Path -> refers to path on the server - in other words, the endpoint URL the request is targeting.
Handler -> Callback Function when the URL endpoint is matched and has two parameters req and res.
            - req -> contain data about the request
            - res -> allow you to control the HTTP response       
*/ 
// "/" -> URL Endpoint is the root directory
app.get('/', (req, res) => {
    // res.send() -> built in syntax for express that specified the Content-type of the HTTP response as plain text no need to manually create the header.
    // sends a response of various types
    // res.send('Welcome to main route!')
    res.sendFile( path.resolve('./public/documentation.html') );
    // Uncomment the code below to try error handling middleware function
    // throw new Error('Something went wrong!');
});

// Return a list of ALL movies to the user
// Any request to the “movies” endpoint will require a JWT from the client because of passport authenticate.
app.get('/movies', passport.authenticate('jwt', { session: false }), (req, res) => {
  Movies.find()
    .then((movies) => {
      res.status(201).json(movies);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// Return data (description, genre, director, image URL, whether it’s featured or not) about a single movie by title to the user
app.get('/movies/:title', passport.authenticate('jwt', { session: false }), (req, res) => {
  Movies.findOne({ Title: req.params.title })
    .then((movie) => {
      res.status(201).json(movie);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// Return data about a genre (description) by name/title (e.g., “Thriller”)
app.get('/movies/genre/:title', passport.authenticate('jwt', { session: false }), (req, res) => {
  Movies.findOne({ Title: req.params.title })
    .then((movie) => {
     res.status(201).json({Genre: movie.Genre.Name, Description: movie.Genre.Description}
      );
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// Return data about a director (bio, birth year, death year) by name
app.get('/movies/directors/:name', passport.authenticate('jwt', { session: false }), (req, res) => {
  Movies.findOne({ "Director.Name" : req.params.name})
    .then((movie) => { 
      res.status(201).json({Bio: movie.Director.Bio, Birth: movie.Director.Birth, Death: movie.Director.Death});
 })
   .catch((err) => {
     console.error(err);
     res.status(500).send('Error: ' + err);
 });
});

// Allow new users to register
app.post('/users',
  // Validation logic here for request
  //you can either use a chain of methods like .not().isEmpty()
  //which means "opposite of isEmpty" in plain english "is not empty"
  //or use .isLength({min: 5}) which means
  //minimum value of 5 characters are only allowed
  [
    check('Username', 'Username is required').isLength({min: 5}),
    check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
    check('Password', 'Password is required').not().isEmpty(),
    check('Email', 'Email does not appear to be valid').isEmail()
  ], (req, res) => {

  // check the validation object for errors
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    let hashedPassword = Users.hashPassword(req.body.Password);
    Users.findOne({ Username: req.body.Username }) // Search to see if a user with the requested username already exists
      .then((user) => {
        if (user) {
          //If the user is found, send a response that it already exists
          return res.status(400).send(req.body.username + ' already exists');
        } else {
          Users
            .create({
              Username: req.body.Username,
              Password: hashedPassword,
              Email: req.body.Email,
              Birthday: req.body.Birthday
            })
            .then((user) => { res.status(201).json(user) })
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
  });

// Allow users to update their user info (username, password, email, date of birth)
app.put('/users/:username',
  [
  check('Username', 'Username is required').isLength({min: 5}),
  check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
  check('Password', 'Password is required').not().isEmpty(),
  check('Email', 'Email does not appear to be valid').isEmail()
  ], (req, res) => {

  // check the validation object for errors
  let errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array()
});
}

let hashedPassword = Users.hashPassword(req.body.password);

  Users.findOneAndUpdate({ Username: req.params.username},
    { $set: {
        Username: req.body.username,
        Password: hashedPassword,
        Email: req.body.email,
        Birthday: req.body.birthday
      }
    },
    {new: true},
    (err, updatedUser) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error: ' + err);
      } else {
        res.status(201).json(updatedUser);
      }
    });
  });

// Allow users to update their user info (username, password, email, date of birth)
app.post('/users/:username/movies/:movieID', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.username }, {
     $push: { FavoriteMovies: req.params.movieID }
   },
   { new: true }, // This line makes sure that the updated document is returned
  (err, updatedUser) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error: ' + err);
    } else {
      res.json(updatedUser);
    }
  });
});

// Allow users to remove a movie from their list of favorites
app.delete('/users/:username/movies/:movieID', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.findOneAndUpdate(
    { Username: req.params.username},
    { $pull: { FavoriteMovies: req.params.movieID}
  },
  {new: true},
   (err, updatedUser) => {
    if(err) {
      console.error(err);
      res.status(500).send('Error: ' + err);
   } else {
     res.json(updatedUser);
   }
 });
});

// Allow existing users to deregister
app.delete('/users/:username', (req, res) => {
  Users.findOneAndRemove({ Username: req.params.username })
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
});

// This code would execute every time an error occurs in your code (that hasn’t already been handled elsewhere)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0',() => {
 console.log('Listening on Port ' + port);
});