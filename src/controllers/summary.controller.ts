import { FastifyReply, FastifyRequest } from 'fastify';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { PromptTemplate } from '@langchain/core/prompts';
import { API_KEY_CONFIG, SERVER_CONFIG } from '@/config';
import { Readable } from 'node:stream';
import { destroyStream } from '@/utils/stream-util';

const DELAY = 1000;
const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));
export default class SummaryController {
  public static async summarize(req: FastifyRequest, reply: FastifyReply) {
    console.time('First token received');

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

      sseStream.on('end', () => {
        destroyStream(sseStream);
      });

      reply.raw.on('close', () => {
        destroyStream(sseStream);
      });

      sseStream.on('error', () => {
        destroyStream(sseStream);
      });

      let firstToken = false;
      const streamComplete = new Promise<void>((resolve) => {
        const llm = new ChatGoogleGenerativeAI({
          apiKey: API_KEY_CONFIG.GEMINI_API_KEY,
          model: API_KEY_CONFIG.GEMINI_MODEL,
          streaming: true,
          callbacks: [
            {
              handleLLMNewToken: async (token) => {
                if (!firstToken) {
                  console.timeEnd('First token received');
                  firstToken = true;
                }

                await delay(DELAY);
                sseStream.push(`data: ${JSON.stringify({ text: token })}\n\n`);
              },
              handleLLMError: (err) => {
                console.error('LLM error:', err);
                sseStream.push(
                  `data: ${JSON.stringify({ error: 'Error from model' })}\n\n`
                );
                resolve();
              },
              handleLLMEnd: () => {
                sseStream.push(`data: ${JSON.stringify({ done: true })}\n\n`);
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
