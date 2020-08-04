const mongoose = require('mongoose');

var RoomUsers = new mongoose.Schema(
    { 
        id: {type: String, required: true},
    }
);

const roomSchema = new mongoose.Schema({
    _id: {type: String, required: true},
    name: {type: String, unique:true, default: '-'},
    topic: {type: String, default: '-'},
    password: {type: String},
    protected: { type: Boolean, default: false},
    users: [RoomUsers]
});

module.exports = mongoose.model('Room', roomSchema);