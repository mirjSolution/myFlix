// Import express module or requiring express framework package.
const express = require('express');
//  is another HTTP request logger middleware for Node. js. It simplifies the process of logging requests to your application 
const morgan = require('morgan');
// Allows to read the “body” of HTTP requests within your request handlers simply by using the code req.body.
const bodyParser = require('body-parser');
// UUID stands for Universally Unique Identifier. With this module installed, you’re able to generate a unique ID at any point in time by simply using the code uuid.v4()
const uuid = require('uuid')

// Require the Mongoose package and your “models.js” file, as well as the Mongoose models defined in your “models.js
const mongoose = require('mongoose');
const Models = require('./models.js');

const Movies = Models.Movie;
const Users = Models.User;

// allows Mongoose to connect to that database so it can perform CRUD operations on the documents it contains from within REST API.
mongoose.connect('mongodb://localhost:27017/myFlixDB', { useNewUrlParser: true, useUnifiedTopology: true });

// Encapsulate express functionality
const app = express();

// With this line of code in place, any time you try to access the body of a request using req.body, the data will be expected to be in JSON format.
app.use(bodyParser.json());

// List of movies array
let movies = [];
  
// // The common parameter here specifies that requests should be logged using Morgan’s “common” format, which logs basic data such as IP address, the time of the request, the request method and path, as well as the status code that was sent back as a response morgan(':method :url :status :res[content-length] - :response-time ms')
app.use(morgan('common'))

// // automatically routes all requests for static files -> URL endpoint is the /documentation.html
app.use(express.static('public'));

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
    res.send('Welcome to main route!')
    // Uncomment the code below to try error handling middleware function
    // throw new Error('Something went wrong!');
});

// Return a list of ALL movies to the user
app.get('/movies', (req, res) => {
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
app.get('/movies/:title', (req, res) => {
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
app.get('/movies/genre/:title', (req, res) => {
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
app.get('/movies/directors/:name', (req, res) => {
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
app.post('/users', (req, res) => {
  Users.findOne({ Username: req.body.username })
    .then((user) => {
      if (user) {
        return res.status(400).send(req.body.username + 'already exists');
      } else {
        Users
          .create({
            Username: req.body.username,
            Password: req.body.password,
            Email: req.body.email,
            Birthday: req.body.birthday
          })
          .then((user) =>{res.status(201).json(user) })
        .catch((error) => {
          console.error(error);
          res.status(500).send('Error: ' + error);
        })
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Error: ' + error);
    });
});

// Allow users to update their user info (username, password, email, date of birth)
app.put('/users/:username', (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.username }, { $set:
    {
      Username: req.body.username,
      Password: req.body.password,
      Email: req.body.email,
      Birthday: req.body.birthday
    }
  },
  { new: true }, // This line makes sure that the updated document is returned
  (err, updatedUser) => {
    if(err) {
      console.error(err);
      res.status(500).send('Error: ' + err);
    } else {
      res.json(updatedUser);
    }
  });
});

// Allow users to update their user info (username, password, email, date of birth)
app.post('/users/:username/movies/:movieID', (req, res) => {
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
app.delete('/users/:username/movies/:movieID', (req, res) => {
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

// listen for requests
app.listen(8080, () => {
  console.log('Your app is listening on port 8080.');
});