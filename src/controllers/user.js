const UserService = require('../services/user');
const AuthService = require('../services/auth');

module.exports = {
    register: async (req, res, next) => {
        try {
            const { username, email, password } = req.body;
            const user = await UserService.createUser({
                username,
                email,
                password,
            });
            const token = AuthService.grantToken({
                userId: user._id,
                username: user.username,
            });

            res.json({
                _id: user._id,
                username: user.username,
                accessToken: token.accessToken,
            });
        } catch (err) {
            return next(err);
        }
    },
};
