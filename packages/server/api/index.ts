import type { VercelRequest, VercelResponse } from '@vercel/node';
import app from '../index';

// Vercel Node builder expects a default export handler. Forward requests
// to the Express `app` (which is callable as a handler).
export default function handler(req: VercelRequest, res: VercelResponse) {
   // `app` is an Express application which is a callable request handler.
   // Type assertions keep TypeScript happy during build on Vercel.
   return (app as unknown as (req: any, res: any) => any)(req, res);
}
