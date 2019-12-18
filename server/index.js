const config = require('./config');

require('./mongo');
require('./redis');
require('./jobs/agenda');

const app = require('./app');

app.listen(config.port, () => {
    console.log(`App is running at port ${config.port}`);
});
