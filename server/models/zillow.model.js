const mongoose = require('mongoose');

const zillowSchema = new mongoose.Schema({
    price: {
        type: Number,
        trim: true,
        required: true
    },
    details: {
        type: String,
        trim: true,
        required: true
    },
    url: {
        type: String,
        required: true
    },
    imageLink: {
        type: String,
        required: true
    },
    ds: {
        type: String,
        trim: true,
        require: true
    },
    location: {
        type: String,
        trim: true,
        require: true
    }
}, { timestamps: true });

module.exports = mongoose.model('zillow', zillowSchema);