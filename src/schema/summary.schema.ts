export const summaryBody = {
  type: 'object',
  properties: {
    text: { type: 'string' }
  },
  required: ['text']
};

export const summarySchema = {
  body: summaryBody,
  response: {
    200: {
      description: 'Open ai summary response',
      type: 'object',
      properties: {
        summary: { type: 'string' }
      },
      required: ['summary'],
      example: {
        summary: 'This is a summary of the text provided.'
      }
    },
    500: {
      description: 'Error response',
      type: 'object',
      properties: {
        error: { type: 'string' }
      },
      required: ['error'],
      example: {
        error: 'An error occurred during generation'
      }
    }
    // add Error response schema
  }
};
