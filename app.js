
const express = require('express');
const logger = require('./lib/logger.js');

const expressPino = require('express-pino-logger')({ // eslint-disable-line import/order
  logger,
});
const dealRoute = require('./routes/deal.js');
const webhookRoute = require('./routes/webhook.js');
const executeRoute = require('./routes/execute.js');

const app = express();


app.use(express.json());
app.use(expressPino);
app.use(dealRoute);
app.use(webhookRoute);
app.use(executeRoute);
module.exports = app;
