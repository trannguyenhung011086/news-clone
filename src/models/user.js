const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        select: false,
        minlength: 6,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    active: {
        type: Boolean,
        default: false,
    },
});

module.exports = mongoose.model('User', UserSchema);
