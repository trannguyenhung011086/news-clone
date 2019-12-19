const app = require('../server/baseApp');
const authHandler = require('../server/middlewares/auth');
const errorHandler = require('../server/middlewares/handleError');

const agenda = require('../server/jobs/agenda');
const agendash = require('agendash');

app.use('/agenda', authHandler.checkBasic, agendash(agenda));
app.use('/agenda(/.*)', authHandler.checkBasic, agendash(agenda));
app.use('/agenda/api(/.*)', authHandler.checkBasic, agendash(agenda));

app.use(errorHandler);

module.exports = app;
