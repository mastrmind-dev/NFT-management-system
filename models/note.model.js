const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
        unique: true,
    },
    title: {
        type: String,
        required: [true, "Please enter a title"],
        unique: true,
        maxLength: 255
    },
    description: {
        type: String,
        required: [true,"Please enter a description"]
    },
    userID: {
        type: Number,
        required: true
    }
}, {timestamps : true});

module.exports = mongoose.model('Note', schema);