const serverless = require('serverless-http');
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');

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
    app.use(new morgan('dev'));
}

const netlifyUrl = '/.netlify/functions';

app.use(netlifyUrl + '/', homeRoute);
app.use(netlifyUrl + '/auth', authRoute);
app.use(netlifyUrl + '/user', userRoute);
app.use(netlifyUrl + '/posts', postRoute);

app.use('*', (req, res) => {
    res.status(404).json({ message: 'Not found!' });
});

app.use(errorHandler);

module.exports = app;
