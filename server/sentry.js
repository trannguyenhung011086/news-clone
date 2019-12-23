const config = require('./config');
const Sentry = require('@sentry/node');

if (process.env.NODE_ENV === 'development') {
    Sentry.init({
        dsn: config.sentry,
        environment: 'development',
        debug: true,
        attachStacktrace: true,
    });
}

Sentry.init({
    dsn: config.sentry,
    environment: 'production',
});

module.exports = Sentry;
