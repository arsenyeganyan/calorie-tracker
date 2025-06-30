const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const daySchema = new Schema({
    user: {
        type: mongoose.Types.ObjectId,
        required: true,
    },
    calories: {
        type: Number, 
        required: true,
        default: 0,
    },
    date: {
        type: Date,
        required: true,
        default: Date.now(),
    },
    meals: {
        type: Array,
        required: true,
        default: [],
    }
});

module.exports = mongoose.model('Day', daySchema);