require('dotenv').config();

module.exports = {
    baseUrl:
        process.env.BASEURL || `http://localhost:${process.env.PORT || '3000'}`,
    mongoOptions: {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
    },
    accessTokenSecret: process.env.ACCESSTOKENSECRET,
    refreshTokenSecret: process.env.REFRESHTOKENSECRET,
    accessTokenLife: process.env.ACCESSTOKENLIFE || '10m',
    refreshTokenLife: process.env.REFRESHTOKENLIFE || '30m',
    port: process.env.PORT || 4000,
    database: process.env.DATABASE || 'mongodb://127.0.0.1:27017/learn_svelte',
    sendgrid: process.env.SENDGRID_API_KEY,
    redis: {
        host: process.env.REDIS_HOST || '127.0.0.1',
        port: process.env.REDIS_PORT || '6379',
        password: process.env.REDIS_PASSWORD,
    },
    basic: {
        username: process.env.BASIC_USERNAME,
        password: process.env.BASIC_PASSWORD,
    },
    sentry: process.env.SENTRY,
};
