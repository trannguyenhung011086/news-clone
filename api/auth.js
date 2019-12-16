const app = require('../server/baseApp');
const errorHandler = require('../server/middlewares/handleError');

const authRoute = require('../server/routes/auth');

app.use('/auth', authRoute);
app.use('*', (req, res) => {
    res.status(404).json({ message: 'Not found!' });
});

app.use(errorHandler);

module.exports = app;
