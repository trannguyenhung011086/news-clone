const EventEmitter = require('events');
const myEmitter = new EventEmitter();

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

module.exports = myEmitter;
