require('dotenv').config();
require('./lib/db.js');

const app = require('./app.js');
const logger = require('./lib/logger.js');

const port = process.env.PORT || 8080;

app.listen(port, () => {
  logger.info(`Server is running on port ${port}`);
});
