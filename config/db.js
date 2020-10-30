const mongoose = require('mongoose');

const connectDB = async() => {
    const conn = await mongoose.connect('mongodb+srv://myFlixDBadmin:GflAIAUomcS4L7EX@myflixdb.le9cb.mongodb.net/myFlixDB?retryWrites=true&w=majority', {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true
    })
    console.log(`MongoDB Connected: ${conn.connection.host}`)
};

module.exports = connectDB;