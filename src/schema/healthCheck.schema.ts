export const healthCheckSchema = {
  response: {
    200: {
      description: 'Health-check response',
      type: 'object',
      properties: {
        'Health Check': { type: 'boolean' },
        message: { type: 'string' },
        timestamp: { type: 'string', format: 'date-time' }
      },
      required: ['Health Check', 'message', 'timestamp'],
      example: {
        'Health Check': true,
        message: 'success',
        timestamp: '2025-04-29T12:00:00.000Z'
      }
    }
    // add Error response schema
  }
};
