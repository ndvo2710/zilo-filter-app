const mongoose = require('mongoose');

const connectDB = require('../config/connectDB');

connectDB();

mongoose.disconnect();

