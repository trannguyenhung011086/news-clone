const config = require('./config');

const mongo = require('./mongo');
const app = require('./app');

app.listen(config.port, () => {
    console.log(`App is running at port ${config.port}`);
});
