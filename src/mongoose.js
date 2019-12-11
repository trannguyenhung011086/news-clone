const config = require('./config');
const mongoose = require('mongoose');

mongoose.connect(config.database, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('error', err => {
    console.error('Database connection error: ', err);
})
    .on('connected', () => {
        console.log('Mongo database connected!');
    })
    .on('disconnected', () => {
        console.log('Mongo database disconnected!');
    });

module.exports = db;
