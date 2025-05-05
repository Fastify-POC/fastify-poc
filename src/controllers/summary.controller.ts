import { FastifyReply, FastifyRequest } from 'fastify';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { PromptTemplate } from '@langchain/core/prompts';
import { API_KEY_CONFIG, SERVER_CONFIG } from '@/config';
import { Readable } from 'stream';

export default class SummaryController {
  public static async summarize(req: FastifyRequest, reply: FastifyReply) {
    try {
      const { text } = req.body as { text: string };

      reply.raw.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
        'Access-Control-Allow-Origin': SERVER_CONFIG.ORIGIN,
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Accept',
        'Access-Control-Max-Age': '86400'
      });

      const sseStream = new Readable({
        read() {
          /* no-op */
        }
      });

      sseStream.pipe(reply.raw);

      let isPaused = false;

      const tokenQueue: string[] = [];

      const processQueue = () => {
        while (tokenQueue.length > 0) {
          const token = tokenQueue.shift()!;
          const canContinue = sseStream.push(
            `data: ${JSON.stringify({ text: token })}\n\n`
          );

          if (!canContinue) {
            return;
          }
        }

        isPaused = false;
      };

      sseStream.on('drain', () => {
        processQueue();
      });

      const streamComplete = new Promise<void>((resolve) => {
        const llm = new ChatGoogleGenerativeAI({
          apiKey: API_KEY_CONFIG.GEMINI_API_KEY,
          model: API_KEY_CONFIG.GEMINI_MODEL,
          streaming: true,
          callbacks: [
            {
              handleLLMNewToken: (token) => {
                if (isPaused) {
                  tokenQueue.push(token);
                  return;
                }

                const canContinue = sseStream.push(
                  `data: ${JSON.stringify({ text: token })}\n\n`
                );

                if (!canContinue) {
                  isPaused = true;

                  console.log(
                    'Backpressure detected, pausing token processing'
                  );
                }
              },
              handleLLMEnd: () => {
                processQueue();

                resolve();
              }
            }
          ]
        });

        const promptTemplate = ` 
          Please provide a clear and detailed summary of the following text. Focus on preserving key information and important details, not just shortening the content. Only return the summary and do not include any explanations or additional responses:
        
          {text}
        
          Summary:
        `;

        const prompt = PromptTemplate.fromTemplate(promptTemplate);
        const chain = prompt.pipe(llm);

        chain.invoke({ text }).catch((error) => {
          console.error('Error during LLM invocation:', error);
          sseStream.push(
            `data: ${JSON.stringify({ error: 'An error occurred during generation' })}\n\n`
          );
          resolve();
        });
      });

      await streamComplete;

      sseStream.push(null);
    } catch (error) {
      console.error('Error in streaming summary:', error);

      if (!reply.sent) {
        return reply.code(500).send({
          success: false,
          error: 'Failed to generate streaming summary'
        });
      }

      reply.raw.write(
        `data: ${JSON.stringify({ error: 'An error occurred during generation' })}\n\n`
      );
      reply.raw.end();
    }
  }
}
