import express, { type Request, type Response } from 'express';
import dotenv from 'dotenv';
import { reviewsController } from './controllers/review.controller';

dotenv.config();
const router = express.Router();

router.get('/api/products/:id/reviews', reviewsController.getReviews);
router.post(
   '/api/products/:id/reviews/summarize',
   reviewsController.summarizeReviews
);

export default router;
