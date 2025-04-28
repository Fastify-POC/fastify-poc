const S = require('fluent-json-schema');

const envSchema = S.object()
  .prop('PORT', S.number().default(3000))
  .prop('NODE_ENV', S.string().enum(['development', 'production', 'staging']))
  .prop('API_VERSION', S.string().default('v1'))
  .prop('ORIGIN', S.string().default('*'))
  .prop('CREDENTIALS', S.string().default('true'))
  .prop('LOGGER', S.boolean().default(true))
  .prop('LOG_LEVEL', S.string().default('info'));

module.exports = envSchema;
