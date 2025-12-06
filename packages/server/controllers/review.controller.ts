import type { Request, Response, NextFunction } from 'express';
import { reviewRepository } from '../repositories/review.repository';
import { productRepository } from '../repositories/product.repository';
import { reviewService } from '../services/review.service';

/**
 * Async error wrapper for Express route handlers
 *
 * Express doesn't automatically catch errors from async route handlers.
 * This wrapper ensures unhandled promise rejections are passed to Express's
 * error handling middleware.
 */
function asyncHandler(
   fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) {
   return (req: Request, res: Response, next: NextFunction) => {
      Promise.resolve(fn(req, res, next)).catch(next);
   };
}

export const reviewsController = {
   getReviews: asyncHandler(async (req: Request, res: Response) => {
      const productId = Number(req.params.id);
      if (isNaN(productId)) {
         res.status(400).json({ error: 'Invalid product ID' });
         return;
      }

      const product = await productRepository.getProduct(productId);
      if (!product) {
         res.status(404).json({ error: 'Product not found' });
         return;
      }

      const reviews = await reviewRepository.getReviews(productId);
      const summary = await reviewRepository.getSummaryReview(productId);
      res.json({ summary, reviews });
   }),

   summarizeReviews: asyncHandler(async (req: Request, res: Response) => {
      const productId = Number(req.params.id);
      if (isNaN(productId)) {
         res.status(400).json({ error: 'Invalid product ID' });
         return;
      }

      const product = await productRepository.getProduct(productId);
      if (!product) {
         res.status(404).json({ error: 'Product not found' });
         return;
      }

      const reviews = await reviewRepository.getReviews(productId);
      if (!reviews.length) {
         res.status(400).json({ error: 'There are no reviews to summarize' });
         return;
      }

      const summary = await reviewService.SummarizeReview(productId);
      res.json(summary);
   }),
};
