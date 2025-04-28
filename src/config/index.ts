const dotenv = require('dotenv');

dotenv.config();

const SERVER_CONFIG = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT || '3000', 10),
  API_VERSION: process.env.API_VERSION || 'v1',
  ORIGIN: process.env.ORIGIN?.split(',') || '*',
  CREDENTIALS: process.env.CREDENTIALS || 'true'
};

const LOGGING_CONFIG = {
  LOGGER: process.env.LOGGER || false,
  LOG_LEVEL: process.env.LOG_LEVEL || 'info'
};

module.exports = {
  SERVER_CONFIG,
  LOGGING_CONFIG
};
