import express from 'express';
import dotenv from 'dotenv';
import router from './route';

dotenv.config();

const app = express();

// CORS middleware - allow requests from client domain
app.use((req, res, next) => {
   const origin = req.headers.origin;

   // In development, allow all origins
   if (process.env.NODE_ENV === 'development') {
      res.setHeader('Access-Control-Allow-Origin', origin || '*');
   } else {
      // In production, allow any Vercel domain or specific allowed origins
      if (origin) {
         // Allow any vercel.app domain (preview and production)
         if (origin.includes('vercel.app') || origin.includes('localhost')) {
            res.setHeader('Access-Control-Allow-Origin', origin);
         } else if (process.env.ALLOWED_ORIGINS) {
            // Check against explicitly allowed origins
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

   // Handle preflight requests
   if (req.method === 'OPTIONS') {
      return res.sendStatus(200);
   }

   next();
});

app.use(express.json());
app.use(router);

// Global error handler to capture unexpected errors and log them
app.use(
   (
      err: any,
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
   ) => {
      // eslint-disable-next-line no-console
      console.error(
         'Unhandled error in request:',
         err && err.stack ? err.stack : err
      );
      if (!res.headersSent) {
         res.status(500).json({ error: 'Internal Server Error' });
      }
   }
);

// Export the Express app for serverless platforms (Vercel) and tests.
export default app;

// If this file is run directly (local development), start a listener so
// the Vite dev server proxy can reach it at `http://localhost:3000`.
// This keeps deployment serverless-compatible while providing a local
// HTTP server for development.
if (process.env.NODE_ENV !== 'production') {
   const port = Number(process.env.PORT) || 3000;
   app.listen(port, () => {
      // eslint-disable-next-line no-console
      console.log(`Server listening on http://localhost:${port}`);
   });
}
