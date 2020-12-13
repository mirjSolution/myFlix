const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const bcrypt = require('bcrypt');

let UserSchema = mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  birthday: Date,
  favoriteMovies: [String],
  // favoriteMovies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }],
});

UserSchema.statics.hashPassword = (password) => {
  return bcrypt.hashSync(password, 10);
};

UserSchema.methods.validatePassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

UserSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', UserSchema);
