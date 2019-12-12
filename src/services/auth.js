const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../config');

const UserService = require('./user');

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
    grantToken,

    verifyToken: accessToken => {
        try {
            return jwt.verify(accessToken, config.accessTokenSecret);
        } catch (err) {
            throw {
                status: 401,
                message: 'Unauthorized or invalid token!',
                stack: err.stack,
            };
        }
    },

    refreshToken: async ({ accessToken, refreshToken }) => {
        const access = jwt.verify(accessToken, config.accessTokenSecret);
        const nowUnixSec = Math.round(Number(new Date())) / 1000;

        if (access.exp - nowUnixSec > 60) {
            return;
        }

        const user = await UserService.getUserById(access.userId);
        if (!user) {
            throw new Error('User not found!');
        }

        const refresh = jwt.verify(refreshToken, config.refreshTokenSecret);

        if (refresh.exp - nowUnixSec > 10) {
            return grantToken({ userId: user._id, username: user.username });
        }
    },

    signIn: async ({ email, password }) => {
        const user = await UserService.getUserByEmail(email);
        if (!user) {
            throw new Error('User not found!');
        }

        const compare = await bcrypt.compare(password, user.password);
        if (!compare) {
            const err = {
                status: 401,
                message: 'Password not correct!',
            };
            throw err;
        }

        return await grantToken({ userId: user._id, username: user.username });
    },
};
