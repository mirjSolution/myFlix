const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { User } = require('../models');

let UserSchema = mongoose.Schema({
    username: {type: String, required: true},
    password: {type: String, required: true},
    email: {type: String, required: true},
    birthday: Date,
    favoriteMovies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }]
});

UserSchema.statics.hashPassword = (password) => {
    return bcrypt.hashSync(password, 10);
};

UserSchema.methods.validatePassword = function(password) {
    return bcrypt.compareSync(password, this.Password);
}

module.exports = mongoose.model('User', UserSchema);
