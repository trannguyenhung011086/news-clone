const UserService = require('../services/user');

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

    activeUser: async (req, res, next) => {
        try {
            const { userId, uuid } = req.params;
            const active = await UserService.activeUser({ userId, uuid });
            res.json(active);
        } catch (err) {
            return next(err);
        }
    },

    resendActiveEmail: async (req, res, next) => {
        try {
            const { userId } = req.params;
            const send = await UserService.resendActiveEmail({ userId });
            res.json(send);
        } catch (err) {
            return next(err);
        }
    },
};
