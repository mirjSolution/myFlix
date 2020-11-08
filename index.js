const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Connect to database

mongoose.connect(process.env.CONNECTION_URI, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

const app = express();

// Route files
const auth = require('./routes/auth');
const movies = require('./routes/movies');
const users = require('./routes/users');

// Body parser
app.use(express.json());

// Require cors module
let allowedOrigins = ['http://localhost:8080', 'http://localhost:1234'];
// app.use(cors()); // allow requests from all origins
// only certain origins to be given access
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        // If a specific origin isn’t found on the list of allowed origins
        let message =
          'The CORS policy for this application doesn’t allow access from origin ' +
          origin;
        return callback(new Error(message), false);
      }
      return callback(null, true);
    },
  })
);

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.resolve('./public/documentation.html'));
});

// Mount routers
app.use('/auth', auth);
app.use('/users', users);
app.use('/movies', movies);

// Listen to connection
const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0', () => {
  console.log('Listening on Port ' + port);
});
