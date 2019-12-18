const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

require('./mongo');
require('./redis');
require('./jobs/agenda');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

if (process.env.NODE_ENV === 'development') {
    const morgan = require('morgan');
    app.use(new morgan('dev'));
}

module.exports = app;
