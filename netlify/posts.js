const serverless = require('serverless-http');

const postRoute = require('../src/routes/post');

const app = require('../src/app');
const mongo = require('../src/mongo');

const netlifyUrl = '/.netlify/functions';

app.use(netlifyUrl + '/posts', postRoute);

module.exports.handler = serverless(app);
