import { FastifyReply, FastifyRequest } from 'fastify';
import { ChatGroq } from '@langchain/groq';
import { PromptTemplate } from '@langchain/core/prompts';
import { LLMChain } from 'langchain/chains';
import { API_KEY_CONFIG } from '@/config';

export default class SummaryController {
  private static chain: LLMChain;

  private static getChain(): LLMChain {
    if (!SummaryController.chain) {
      const llm = new ChatGroq({
        apiKey: API_KEY_CONFIG.GROQ_API_KEY,
        model: API_KEY_CONFIG.GROQ_MODEL
      });

      const promptTemplate = `
      Please provide a concise summary of the following text, make sure to only include the summary and don't respond with anything else:
      
      {text}
      
      Summary:
      `;

      const prompt = PromptTemplate.fromTemplate(promptTemplate);
      SummaryController.chain = new LLMChain({ llm, prompt });
    }

    return SummaryController.chain;
  }

  public static async summarize(req: FastifyRequest, reply: FastifyReply) {
    try {
      const { text } = req.body as { text: string };

      const chain = SummaryController.getChain();
      const result = await chain.invoke({ text });

      return reply.code(200).send({
        summary: result.text
      });
    } catch (error) {
      return reply.code(500).send({
        success: false,
        error: 'Failed to generate summary'
      });
    }
  }
}
