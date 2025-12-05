import type { Request, Response } from 'express';
import { reviewRepository } from '../repositories/review.repository';
import { productRepository } from '../repositories/product.repository';
import { reviewService } from '../services/review.service';

export const reviewsController = {
   async getReviews(req: Request, res: Response) {
      const productId = Number(req.params.id);
      if (isNaN(productId)) {
         res.status(400).json({ error: 'Invalid product ID' });
         return;
      }
      const product = await productRepository.getProduct(productId);

      if (!product) {
         res.status(400).json({ error: 'Invalid product ' });
         return;
      }
      try {
         const reviews = await reviewRepository.getReviews(productId);
         const summary = await reviewRepository.getSummaryReview(productId);
         res.json({ summary, reviews });
      } catch (error) {
         res.status(500).json({ error: 'Failed to fetch reviews' });
      }
   },

   async summarizeReviews(req: Request, res: Response) {
      const productId = Number(req.params.id);
      if (isNaN(productId)) {
         res.status(400).json({ error: 'Invalid product ID' });
         return;
      }
      const product = await productRepository.getProduct(productId);

      if (!product) {
         res.status(400).json({ error: 'Invalid product ' });
         return;
      }
      const reviews = await reviewRepository.getReviews(productId);

      if (!reviews.length) {
         res.status(400).json({ error: 'There is no reviews to summrize' });
         return;
      }
      const summary = await reviewService.SummarizeReview(productId);

      res.json(summary);
   },
};
