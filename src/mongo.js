const config = require('./config');
const mongoose = require('mongoose');

const options = {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
};
mongoose.connect(config.database, options);

// if (process.env.NODE_ENV === 'development') {
//     const { MongoMemoryServer } = require('mongodb-memory-server');
//     const mongod = new MongoMemoryServer();
//     mongod.getConnectionString().then(uri => {
//         mongoose.connect(uri, options);
//     });
// } else {
//     mongoose.connect(config.database, options);
// }

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
