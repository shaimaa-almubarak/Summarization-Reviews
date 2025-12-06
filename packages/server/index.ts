import type { VercelRequest, VercelResponse } from '@vercel/node';
import express from 'express';
import dotenv from 'dotenv';
import router from './route.js'; // Add .js extension for ESM

dotenv.config();

const app = express();

// CORS middleware
app.use((req, res, next) => {
   const origin = req.headers.origin;

   if (process.env.NODE_ENV === 'development') {
      res.setHeader('Access-Control-Allow-Origin', origin || '*');
   } else {
      if (origin) {
         if (origin.includes('vercel.app') || origin.includes('localhost')) {
            res.setHeader('Access-Control-Allow-Origin', origin);
         } else if (process.env.ALLOWED_ORIGINS) {
            const allowedOrigins = process.env.ALLOWED_ORIGINS.split(',');
            if (allowedOrigins.includes(origin)) {
               res.setHeader('Access-Control-Allow-Origin', origin);
            }
         }
      }
   }

   res.setHeader(
      'Access-Control-Allow-Methods',
      'GET, POST, PUT, DELETE, OPTIONS'
   );
   res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
   res.setHeader('Access-Control-Allow-Credentials', 'true');

   if (req.method === 'OPTIONS') {
      return res.sendStatus(200);
   }

   next();
});

app.use(express.json());
app.use(router);

// Global error handler
app.use(
   (
      err: any,
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
   ) => {
      console.error('Unhandled error:', err);
      if (!res.headersSent) {
         res.status(500).json({ error: 'Internal Server Error' });
      }
   }
);

export default function handler(req: VercelRequest, res: VercelResponse): void {
   try {
      console.log(`[Vercel] ${req.method} ${req.url}`);

      const required = ['DATABASE_URL', 'HUGGINGFACE_API_KEY'];
      const missing = required.filter((k) => !process.env[k]);

      if (missing.length > 0) {
         console.error('Missing env vars:', missing);
         res.status(500).json({
            error: 'Configuration Error',
            missing,
         });
         return;
      }

      app(req, res);
   } catch (error) {
      console.error('[Vercel Handler] Error:', error);
      if (!res.headersSent) {
         res.status(500).json({
            error: 'Internal Server Error',
            message: error instanceof Error ? error.message : 'Unknown error',
         });
      }
   }
}
