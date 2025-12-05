import { reviewRepository } from '../repositories/review.repository';
import { llmClient } from '../llm/client';

export const reviewService = {
   async SummarizeReview(productId: number): Promise<String> {
      const existingSummary = await reviewRepository.getSummaryReview(
         productId
      );

      if (existingSummary) {
         return existingSummary;
      }
      const reviews = await reviewRepository.getReviews(productId, 10);
      const joinedReviews = reviews.map((r) => r.content).join('\n\n');

      const summary = await llmClient.summarizeReview(joinedReviews);
      await reviewRepository.StoreSummary(productId, summary);

      return summary;
   },
};
