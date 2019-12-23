const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');

const app = express();

app.use(new morgan('dev'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

const authHandler = require('./middlewares/auth');
const errorHandler = require('./middlewares/handleError');

app.use('/', require('./routes/home'));
app.use('/auth', require('./routes/auth'));
app.use('/user', require('./routes/user'));
app.use('/posts', require('./routes/post'));

const agenda = require('./jobs/agenda');
const agendash = require('agendash');
app.use('/agenda', authHandler.checkBasic, agendash(agenda));

app.use('*', (req, res) => {
    res.status(404).json({ message: 'Not found!' });
});

app.use(errorHandler);

module.exports = app;
