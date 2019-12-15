const serverless = require('serverless-http');

const homeRoute = require('../src/routes/home');
// const authRoute = require('../src/routes/auth');
// const userRoute = require('../src/routes/user');
// const postRoute = require('../src/routes/post');

const app = require('../src/app');

const netlifyUrl = '/.netlify/functions';

app.use(netlifyUrl + '/home', homeRoute);
// app.use(netlifyUrl + '/auth', authRoute);
// app.use(netlifyUrl + '/user', userRoute);
// app.use(netlifyUrl + '/posts', postRoute);

module.exports.handler = serverless(app);
