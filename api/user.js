const app = require('../server/baseApp');
const errorHandler = require('../server/middlewares/handleError');

const userRoute = require('../server/routes/user');

app.use('/user', userRoute);
app.use('*', (req, res) => {
    res.status(404).json({ message: 'Not found!' });
});

app.use(errorHandler);

module.exports = app;
