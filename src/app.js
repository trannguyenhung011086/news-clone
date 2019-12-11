const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const homeRoute = require('./routes/home');
const authRoute = require('./routes/auth');
const userRoute = require('./routes/user');
const postRoute = require('./routes/post');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/', homeRoute);
app.use('/auth', authRoute);
app.use('/user', userRoute);
app.use('/posts', postRoute);

app.use('*', (req, res) => {
    res.status(404).json({ message: 'Not found!' });
});

app.use((err, req, res, next) => {
    const status = err.status || 500;
    const message = err.message || 'Errors happen!';
    let error = { status, message };
    if (process.env.NODE_ENV === 'development') {
        error.stack = err.stack;
    }
    res.status(err.status).json(error);
});

module.exports = app;
