const UserService = require('../services/user');

module.exports = {
    register: async (req, res, next) => {
        try {
            const { username, email, password } = req.body;
            const payload = await UserService.validateRegister({
                username,
                email,
                password,
            });
            const user = await UserService.createUser(payload);
            const token = UserService.grantToken({
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
