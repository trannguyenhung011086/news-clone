const AuthService = require('../services/auth');
const UserService = require('../services/user');

const getToken = req => {
    let token = req.headers['x-access-token'] || req.headers['authorization'];
    return token ? token.replace('Bearer ', '') : null;
};

module.exports = {
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
