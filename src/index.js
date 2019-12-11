const config = require('./config');

const mongo = require('./mongoose');
const app = require('./app');

app.listen(config.port, () => {
    console.log(`App is running at port ${config.port}`);
});
