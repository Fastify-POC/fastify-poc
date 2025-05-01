export const assetsSchema = {
  querystring: {
    type: 'object',
    properties: {
      filename: { type: 'string' }
    },
    required: ['filename']
  },
  response: {
    200: {
      type: 'object',
      properties: {
        hello: { type: 'string' }
      }
    },
    404: {
      type: 'object',
      properties: {
        message: { type: 'string' }
      }
    }
  }
};
