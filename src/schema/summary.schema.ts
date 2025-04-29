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
    }
    // add Error response schema
  }
};
