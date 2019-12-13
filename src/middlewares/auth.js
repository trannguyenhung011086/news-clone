const AuthService = require('../services/auth');
const PostService = require('../services/post');

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
        try {
            AuthService.verifyToken(token);
        } catch (err) {
            return res.status(err.status).json(err);
        }
        next();
    },
};
