import dotenv from 'dotenv';
import express from 'express';
import router from './route';

dotenv.config();

const app = express();
app.use(express.json());
app.use(router);

const port =
   process.env.PORT || 'https://server-production-e2d57.up.railway.app';

// Start an HTTP listener for platforms that require a running web process
// (e.g., Railway, Render, Heroku). We avoid starting the listener when
// running under Vercel serverless (Vercel imports this module) by checking
// the `VERCEL` environment variable. If `VERCEL` is set, Vercel expects a
// serverless handler instead of a long-running process.
if (!process.env.VERCEL) {
   const port = Number(process.env.PORT) || 3000;
   app.listen(port, () => {
      // eslint-disable-next-line no-console
      console.log(`Server listening on http://localhost:${port}`);
   });
}
