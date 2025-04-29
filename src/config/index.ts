import dotenv from 'dotenv';

dotenv.config();

export const SERVER_CONFIG = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT || '3000', 10),
  API_VERSION: process.env.API_VERSION || 'v1',
  ORIGIN: process.env.ORIGIN?.split(',') || '*',
  CREDENTIALS: process.env.CREDENTIALS || 'true'
};

export const LOGGING_CONFIG = {
  LOGGER: Boolean(process.env.LOGGER) || false,
  LOG_LEVEL: process.env.LOG_LEVEL || 'info'
};

export const API_KEY_CONFIG = {
  GROQ_API_KEY: process.env.GROQ_API_KEY || '',
  GROQ_MODEL: process.env.GROQ_MODEL || ''
};
