const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const yup = require('yup');
const mongoose = require('mongoose');
const config = require('../config');

const UserModel = require('../models/user');

const grantToken = ({ userId, username }) => {
    const payload = { userId, username };
    const accessToken = jwt.sign(payload, config.accessTokenSecret, {
        expiresIn: config.accessTokenLife,
    });
    const refreshToken = jwt.sign(payload, config.refreshTokenSecret, {
        expiresIn: config.refreshTokenLife,
    });
    return { accessToken, refreshToken };
};

module.exports = {
    verifyPassword: async (inputPassword, storedPassword) => {
        if (!inputPassword) return false;
        return await bcrypt.compare(inputPassword, storedPassword);
    },

    grantToken,

    refreshToken: ({ accessToken, refreshToken, userId, username }) => {
        const access = jwt.verify(accessToken, config.accessTokenSecret);
        const nowUnixSec = Math.round(Number(new Date())) / 1000;

        if (access.exp - nowUnixSec > 30) {
            return;
        }

        const refresh = jwt.verify(refreshToken, config.refreshTokenSecret);

        if (refresh.exp - nowUnixSec > 0) {
            return grantToken({ userId, username });
        }
    },

    validateRegister: async ({ username, email, password }) => {
        let payload = { username, email, password };
        const schema = yup.object({
            username: yup
                .string()
                .required()
                .lowercase(),
            email: yup
                .string()
                .email()
                .required()
                .lowercase(),
            password: yup
                .string()
                .min(6)
                .required(),
        });

        await schema.validate(payload, { abortEarly: false });
        return payload;
    },

    createUser: async ({ username, email, password }) => {
        return await UserModel.create({ username, email, password });
    },

    getUserById: async userId => {
        const id = mongoose.Types.ObjectId(userId);
        return await UserModel.findById(id);
    },
};
