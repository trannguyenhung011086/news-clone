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
    return { userId, accessToken, refreshToken };
};

const verifyToken = accessToken => {
    return jwt.verify(accessToken, config.accessTokenSecret);
};

module.exports = {
    grantToken,
    verifyToken,

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

    logout: async ({ token, userId }) => {
        const decode = verifyToken(token);
        if (decode.userId != userId) {
            throw new Error('User not found!');
        }

        const { promisify } = require('util');
        const redis = require('../redis');
        const setAsync = promisify(redis.set).bind(redis);

        await setAsync(userId, token, 'EX', 600);
        return true;
    },
};
