const config = require('./config');

const mongo = require('./mongo');
const redis = require('./redis');
const app = require('./app');

app.listen(config.port, () => {
    console.log(`App is running at port ${config.port}`);
});
