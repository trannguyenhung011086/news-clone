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

            res.json({
                username,
                email,
                id: user._id,
                active: user.active,
            });
        } catch (err) {
            return next(err);
        }
    },
};
