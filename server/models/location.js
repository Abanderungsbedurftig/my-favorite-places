const mongoose = require('mongoose');

let schema = mongoose.Schema({
    name: {type: String, required: true, unique: true},
    address: String,
    rating: {type: Number, "default": 0, min: 0, max: 5},
    description: String,
    coords: {type: [Number], index: '2dsphere', required: true}
});

exports.Location = mongoose.model('Location', schema);