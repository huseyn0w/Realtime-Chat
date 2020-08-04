const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    _id: {type: String, required: true},
    fullName: {type: String, required: true},
    email: {type: String, required: true, unique:true},
    password: {type: String, required: true},
    status: {type: String, default: 'User'},
    banned: { type: Boolean, default: false},
    avatar: String,
});

module.exports = mongoose.model('User', userSchema);