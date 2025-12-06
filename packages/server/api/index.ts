import type { VercelRequest, VercelResponse } from '@vercel/node';
import app from '../index';

/**
 * Vercel Serverless Function Handler
 *
 * This is the entry point for all API requests in the Vercel serverless environment.
 * Vercel expects a default export function that handles (req, res) -> void.
 *
 * We forward all requests to the Express app, which handles routing and middleware.
 * Express apps are callable as request handlers and work with Vercel's serverless format.
 */
export default function handler(req: VercelRequest, res: VercelResponse): void {
   try {
      // Log the incoming request for debugging
      // eslint-disable-next-line no-console
      console.log(`[Vercel Handler] ${req.method} ${req.url}`, {
         path: req.url,
         query: req.query,
      });

      // Validate required environment variables before processing any request
      // This prevents runtime errors from missing configuration
      const required = ['DATABASE_URL', 'HUGGINGFACE_API_KEY'];
      const missing = required.filter((k) => !process.env[k]);

      if (missing.length > 0) {
         const errorMsg = `Missing required environment variables: ${missing.join(', ')}`;
         // eslint-disable-next-line no-console
         console.error('[Vercel Handler]', errorMsg);
         res.status(500).json({
            error: 'Configuration Error',
            message: errorMsg,
            missing,
         });
         return;
      }

      // Forward the request to Express app
      // Express app is compatible with Vercel's (req, res) handler signature
      // The global error handler in index.ts will catch any unhandled errors
      app(req, res);
   } catch (error) {
      // eslint-disable-next-line no-console
      console.error('[Vercel Handler] Unhandled error:', error);
      if (!res.headersSent) {
         res.status(500).json({
            error: 'Internal Server Error',
            message:
               error instanceof Error
                  ? error.message
                  : 'Failed to process request',
         });
      }
   }
}
