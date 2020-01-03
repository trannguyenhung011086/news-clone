const mongoose = require('mongoose');
const uuidv4 = require('uuid/v4');
const config = require('../config');

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
    welcome: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const uuid = uuidv4();
UserSchema.virtual('activeLink').get(function() {
    return `${config.baseUrl}/user/${this._id.toString()}/${uuid}/active`;
});

UserSchema.index({
    username: 'text',
    email: 'text',
});

module.exports = mongoose.model('User', UserSchema);
