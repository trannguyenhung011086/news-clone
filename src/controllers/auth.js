module.exports = {
    activate: async (req, res, next) => {
        try {
            res.send('TO DO');
        } catch (err) {
            return next(err);
        }
    },

    sigin: async (req, res, next) => {
        try {
            res.send('TO DO');
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
};
