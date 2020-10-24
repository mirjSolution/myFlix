// Import express module
const express = require('express');
// Import logging module morgan
const morgan = require('morgan');
// Encapsulate express functionality
const app = express();

// List of movies array
let movies = [
  {
    title: 'Pain & Glory',
    actor: 'Antonio Banderas'
  },
  {
    title: 'The Irishman',
    actor: 'Robert De Niro'
  },
  {
    title: 'Once Upon a Time…in Hollywood',
    actor: 'Leonardo DiCaprio'
  },
  {
    title: 'Marriage Story',
    actor: 'Adam Driver'
  },
  {
    title: 'Little Women',
    actor: 'Saoirse Ronan'
  },
  {
    title: 'Parasite',
    actor: 'Bong Joon Ho'
  },
  {
    title: 'Knives Out',
    actor: 'Ana de Armas'
  },
  {
    title: 'Dolemite Is My Name',
    actor: 'Eddie Murphy'
  },
  {
    title: 'A Beautiful Day in the Neighborhood',
    actor: 'Tom Hanks'
  },
  {
    title: 'Hustlers',
    actor: 'Jennifer Lopez'
  }
];
  
// // The common parameter here specifies that requests should be logged using Morgan’s “common” format, which logs basic data such as IP address, the time of the request, the request method and path, as well as the status code that was sent back as a response 
app.use(morgan('common'))

// // automatically routes all requests for static files -> URL endpoint is the /documentation/documentation.html
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

// This code would execute every time an error occurs in your code (that hasn’t already been handled elsewhere)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// listen for requests
app.listen(8080, () => {
  console.log('Your app is listening on port 8080.');
});