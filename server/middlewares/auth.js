const config = require('../config');
const AuthService = require('../services/auth');
const UserService = require('../services/user');

const getToken = req => {
    let token = req.headers['x-access-token'] || req.headers['authorization'];
    return token ? token.replace('Bearer ', '') : null;
};

module.exports = {
    checkBasic: async (req, res, next) => {
        res.setHeader('WWW-Authenticate', 'Basic realm="NodeJS"');

        if (
            !req.headers.authorization ||
            !req.headers.authorization.includes('Basic')
        ) {
            return res
                .status(401)
                .json({ message: 'Missing basic authorization!' });
        }

        const base64Creds = req.headers.authorization.split(' ')[1] || '';
        const [username, password] = Buffer.from(base64Creds, 'base64')
            .toString()
            .split(':');

        if (
            username !== config.basic.username ||
            password !== config.basic.password
        ) {
            return res
                .status(401)
                .json({ message: 'Invalid basic authorization!' });
        }

        next();
    },

    isUser: async (req, res, next) => {
        const token = getToken(req);
        if (!token) {
            return res.status(401).json({ message: 'Missing token!' });
        }

        let decode;
        try {
            decode = AuthService.verifyToken(token);
        } catch (err) {
            return res.status(401).json({ message: 'Invalid token!' });
        }

        const user = await UserService.getUserById(decode.userId);
        if (!user.active) {
            return res.status(401).json({ message: 'User is not active!' });
        }

        next();
    },
};
