const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

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
});

UserSchema.pre('save', async next => {
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

module.exports = mongoose.model('User', UserSchema);
