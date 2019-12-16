const app = require('../server/baseApp');
const errorHandler = require('../server/middlewares/handleError');

const postRoute = require('../server/routes/post');

app.use('/posts', postRoute);
app.use('*', (req, res) => {
    res.status(404).json({ message: 'Not found!' });
});

app.use(errorHandler);

module.exports = app;
