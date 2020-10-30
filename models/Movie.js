const mongoose = require('mongoose');

// Database schema
let MovieSchema = mongoose.Schema({
    title: {type: String, required: true},
    description: {type: String, required: true},
    genre: {
      name: String,
      description: String
    },
    director: {
      name: String,
      bio: String,
      birth: String,
      death: String
    },
    actors: [String],
    imagePath: String,
    featured: Boolean
  });

  module.exports= mongoose.model('Movie', MovieSchema);