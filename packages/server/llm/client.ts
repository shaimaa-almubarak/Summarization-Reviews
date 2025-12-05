import { InferenceClient } from '@huggingface/inference';
import promptReview from '../llm/prompts/summarizingReviews.txt';
const client = new InferenceClient(process.env.HUGGINGFACE_API_KEY);

export const llmClient = {
   async summarizeReview(reviews: string) {
      const chatCompletion = await client.chatCompletion({
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
