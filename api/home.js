const app = require('../server/baseApp');
const errorHandler = require('../server/middlewares/handleError');

const homeRoute = require('../server/routes/home');

app.use('/', homeRoute);
app.use('*', (req, res) => {
    res.status(404).json({ message: 'Not found!' });
});

app.use(errorHandler);

module.exports = app;
