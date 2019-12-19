const Agenda = require('agenda');
const config = require('../config');

const mailer = require('../services/mailer');

const agenda = new Agenda({
    db: {
        address: config.database,
        collection: 'agendaJobs',
    },
    processEvery: '30 seconds',
});

agenda
    .on('ready', () => console.log('Agenda started!'))
    .on('error', () => console.log('Agenda connection error!'));

agenda.define('register', async job => {
    const { username, email, url } = job.attrs.data;
    await mailer.sendActiveEmail({ username, email, url });
});

agenda.define('resend', async job => {
    const { username, email, url } = job.attrs.data;
    await mailer.sendActiveEmail({ username, email, url });
});

agenda.define('welcome', async job => {
    const { username, email } = job.attrs.data;
    await mailer.sendWelcomeEmail({ username, email });
});

agenda.start();

module.exports = agenda;
