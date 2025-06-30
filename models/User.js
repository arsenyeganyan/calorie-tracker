const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    gender: {
        type: String,
        required: true,
        enum: ['Male', 'Female'],
    },
    age: {
        type: Number,
        required: true,
    },
    weight: {
        type: Number,
        required: true,
    },
    height: {
        type: Number,
        required: true,
    },
    activity_level: {
        type: Number,
        required: true,
        enum: [1.2, 1.375, 1.55, 1.725, 1.9]
    },
    goal: {
        type: String,
        required: true,
        enum: ['Gain', 'Maintain', 'Lose'],
    },
    days: {
        type: Array,
        required: true,
        default: [],
    },
});

module.exports = mongoose.model('User', userSchema);