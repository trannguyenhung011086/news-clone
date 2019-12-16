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
            res.send('TO DO');
        } catch (err) {
            return next(err);
        }
    },

    refreshToken: async (req, res, next) => {
        try {
            //
        } catch (err) {
            return next(err);
        }
    },
};
