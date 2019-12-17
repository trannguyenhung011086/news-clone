const Agenda = require('agenda');
const config = require('./config');

const agenda = new Agenda({
    db: { address: config.database, collection: 'agendaJobs' },
});

module.exports = agenda;
