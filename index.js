const express = require('express');
const connectDB = require('./config/db');

// Connect to database
connectDB();

const app = express();

// Listen to connection
const port = process.env.PORT || 8080;
  app.listen(port, '0.0.0.0',() => {
  console.log('Listening on Port ' + port);
});

