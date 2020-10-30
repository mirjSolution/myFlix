const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const connectDB = require('./config/db');

// Connect to database
connectDB();

// Route files
const movies = require('./routes/movies');

const app = express();

// Body parser
app.use(bodyParser.json());

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// Mount routers
app.use('/movies', movies);

// Listen to connection
const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0', () => {
  console.log('Listening on Port ' + port);
});
