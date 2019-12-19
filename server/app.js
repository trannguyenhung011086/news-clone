const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const authHandler = require('./middlewares/auth');
const errorHandler = require('./middlewares/handleError');

const homeRoute = require('./routes/home');
const authRoute = require('./routes/auth');
const userRoute = require('./routes/user');
const postRoute = require('./routes/post');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

if (process.env.NODE_ENV === 'development') {
    const morgan = require('morgan');
    app.use(new morgan('dev'));
}

app.use('/', homeRoute);
app.use('/auth', authRoute);
app.use('/user', userRoute);
app.use('/posts', postRoute);

const agenda = require('./jobs/agenda');
const agendash = require('agendash');
app.use('/agenda', authHandler.checkBasic, agendash(agenda));

app.use('*', (req, res) => {
    res.status(404).json({ message: 'Not found!' });
});

app.use(errorHandler);

module.exports = app;
