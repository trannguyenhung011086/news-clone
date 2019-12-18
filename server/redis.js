const redis = require('redis');
const config = require('./config');

const client = redis.createClient({
    host: config.redis.host,
    port: config.redis.port,
    password: config.redis.password,
});

client
    .on('error', err => console.error('Redis connection error: ', err))
    .on('ready', () => console.log('Redis connected!'));

module.exports = client;
