const mongoose = require('mongoose');
const bluebird = require('bluebird');
const dotenv = require('dotenv');
dotenv.config();

const MONGO_PW = process.env.MONGO_PW

/**
 * Connect to MongoDB
 */
const connectDB = () => {
    mongoose.Promise = bluebird;
    const URI = `mongodb+srv://ndvo:${MONGO_PW}@cluster0.jlyzm.mongodb.net/zillow?retryWrites=true&w=majority`;
    console.log(`MONGODB URI: ${URI}`);
    mongoose
        .connect(URI, {
            useUnifiedTopology: true,
            useNewUrlParser: true,
            useCreateIndex: true,
            useFindAndModify: false,
        })
        .then(() => console.log('Already connected to MongoDB Atlas!'))
        .catch((err) => {
            console.log('Failed to establish connection to MongoDB Atlas!', err);
            throw new Error(err);
        });
};

module.exports = connectDB;