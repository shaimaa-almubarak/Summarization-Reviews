import express, { type Request, type Response } from 'express';
import dotenv from 'dotenv';
import { reviewsController } from './controllers/review.controller';

dotenv.config();
const router = express.Router();

// Health check endpoint for deployment verification
router.get('/api/health', (req: Request, res: Response) => {
   res.json({
      ok: true,
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
   });
});

// Root endpoint
router.get('/', (req: Request, res: Response) => {
   res.json({
      message: 'Review Summarization API',
      version: '1.0.0',
      endpoints: {
         health: '/api/health',
         getReviews: '/api/products/:id/reviews',
         summarizeReviews: '/api/products/:id/reviews/summarize',
      },
   });
});

// Health check endpoint for testing
router.get('/api/health', (req: Request, res: Response) => {
   res.json({ ok: true, timestamp: new Date().toISOString() });
});

// API routes
// Note: In Vercel, when using api/index.ts, the /api prefix is already in the path
// So routes should include /api prefix to match the full path
router.get('/api/products/:id/reviews', reviewsController.getReviews);
router.post(
   '/api/products/:id/reviews/summarize',
   reviewsController.summarizeReviews
);

// Catch-all for unmatched routes (for debugging)
router.use('*', (req: Request, res: Response) => {
   // eslint-disable-next-line no-console
   console.log(`[Router] Unmatched route: ${req.method} ${req.path}`);
   res.status(404).json({
      error: 'Not Found',
      path: req.path,
      method: req.method,
      message: 'The requested endpoint does not exist',
   });
});

export default router;
