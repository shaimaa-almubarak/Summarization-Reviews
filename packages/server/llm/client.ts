import { InferenceClient } from '@huggingface/inference';
import promptReview from '../llm/prompts/summarizingReviews.txt';

/**
 * Lazy initialization of InferenceClient
 *
 * In serverless environments, we should avoid creating clients at module level
 * because:
 * 1. Module loading happens before environment variable validation
 * 2. If the API key is missing, the constructor might fail during import
 * 3. We want to defer client creation until it's actually needed
 *
 * This pattern ensures the client is only created when first used,
 * after environment variables have been validated.
 */
let client: InferenceClient | null = null;

function getClient(): InferenceClient {
   if (client) {
      return client;
   }

   const apiKey = process.env.HUGGINGFACE_API_KEY;
   if (!apiKey) {
      throw new Error(
         'HUGGINGFACE_API_KEY environment variable is not set. ' +
            'Please configure it in your Vercel project settings.'
      );
   }

   client = new InferenceClient(apiKey);
   return client;
}

export const llmClient = {
   async summarizeReview(reviews: string) {
      const inferenceClient = getClient();
      const chatCompletion = await inferenceClient.chatCompletion({
         model: 'meta-llama/Llama-3.1-8B-Instruct:novita',
         messages: [
            {
               role: 'system',
               content: promptReview,
            },
            {
               role: 'user',
               content: reviews,
            },
         ],
      });
      return chatCompletion.choices[0]?.message.content || '';
   },
};
