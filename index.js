// Import express module
const express = require('express');
//  is another HTTP request logger middleware for Node. js. It simplifies the process of logging requests to your application 
const morgan = require('morgan');
// Allows to read the “body” of HTTP requests within your request handlers simply by using the code req.body.
const bodyParser = require('body-parser');
// UUID stands for Universally Unique Identifier. With this module installed, you’re able to generate a unique ID at any point in time by simply using the code uuid.v4()
const uuid = require('uuid')

// Encapsulate express functionality
const app = express();

// With this line of code in place, any time you try to access the body of a request using req.body, the data will be expected to be in JSON format.
app.use(bodyParser.json());

// List of movies array
let movies = [
  {
    id: 1,
    title: 'Pain and Glory',
    genre: ['action', 'drama']
  },
  {
    id: 2,
    title: 'The Irishman',
    genre: ['action']
  },
  {
    id: 3,
    title: 'Once Upon a Time…in Hollywood',
    genre: ['comedy', 'action']
  },
  {
    id: 4,
    title: 'Marriage Story',
    genre: ['drama']
  },
  {
    id: 5,
    title: 'Little Women',
    genre: ['comedy', 'romance']
  },
];
  
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

// /movies -> URL endpoint is the /books
app.get('/movies', (req, res) => {
// sends a JSON Response
  res.json(movies);
});

// Gets the data about a single movie, by title
app.get('/movies/:title', (req, res) => {
  res.json(movies.find((movie) =>
    { return movie.title === req.params.title }));
});

// Adds data for a new movie to our list of movies.
app.post('/movies', (req, res) => {
  let newMovie = req.body;

  if (!newMovie.title) {
    const message = 'Missing title in request body';
    res.status(400).send(message);
  } else {
    newMovie.id = uuid.v4();
    movies.push(newMovie);
    res.status(201).send(newMovie);
  }
});

// Delete a movie from our list by ID
app.delete('/movies/:id', (req, res) => {
  let movie = movies.find((movie) => { return movie.id === req.params.id });

  if (movie) {
    movies = movies.filter((obj) => { return obj.id !== req.params.id });
    res.status(201).send('Movie ' + req.params.id + ' was deleted.');
  }
});

// Update the "genres" of a movie by movie title/type 
app.put('/movies/:id', (req, res) => {
  let movie = movies.find((movie) => { return movie.id === req.params.id });

  if (movie) {
    movie.title = req.body.title
    movie.genre = req.body.genre
    res.status(201).send('Movie title: was changed to ' + req.body.title + ' and Movie genre: was changed to ' + req.body.genre) ;
  } else {
    res.status(404).send('Movie with the id ' + req.params.id + ' was not found.');
  }
});

// Gets the genre of a single movie
app.get('/movies/:title/genre', (req, res) => {
  let movie = movies.find((movie) => { return movie.title === req.params.title });

  if (movie) {
    res.status(201).send('Movie genre: ' + movie.genre) ;
  } else {
    res.status(404).send('Movie title ' + req.params.title + ' was not found.');
  }
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