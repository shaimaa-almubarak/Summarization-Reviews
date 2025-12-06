import express from 'express';
import dotenv from 'dotenv';
import router from './route';

dotenv.config();

const app = express();

app.use(express.json());
app.use(router);

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
