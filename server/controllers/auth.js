const AuthService = require('../services/auth');

module.exports = {
    sigin: async (req, res, next) => {
        try {
            const { email, password } = req.body;
            const token = await AuthService.signIn({ email, password });
            res.json(token);
        } catch (err) {
            return next(err);
        }
    },

    logout: async (req, res, next) => {
        try {
            const { token, userId } = req.body;
            await AuthService.logout({ token, userId });
            res.json({ logout: true, userId });
        } catch (err) {
            return next(err);
        }
    },

    refreshToken: async (req, res, next) => {
        try {
            const { accessToken, refreshToken } = req.body;
            await AuthService.refreshToken({ accessToken, refreshToken });
        } catch (err) {
            return next(err);
        }
    },
};
