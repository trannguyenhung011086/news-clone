const EventEmitter = require('events');
const myEmitter = new EventEmitter();

const redisClient = require('../redis');

const mailer = require('../services/mailer');

myEmitter.on('register', async ({ username, email, url }) => {
    await mailer.sendActiveEmail({ username, email, url });
});

myEmitter.on('resend', async ({ username, email, url }) => {
    await mailer.sendActiveEmail({ username, email, url });
});

myEmitter.on('error', err => {
    console.error('Error with send email!\n', err);
});

redisClient.on('message', async (channel, message) => {
    console.log(channel, 'Received data :' + message);
    const { username, email, url } = JSON.parse(message);
    await mailer.sendActiveEmail({ username, email, url });
});

redisClient.subscribe(['register', 'resend']);

module.exports = myEmitter;
