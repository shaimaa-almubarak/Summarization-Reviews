import dotenv from 'dotenv';
import express from 'express';
import router from './route';

dotenv.config();

const app = express();
app.use(express.json());
app.use(router);

if (!process.env.VERCEL) {
   const port = Number(process.env.PORT) || 3000;
   app.listen(port, () => {
      // eslint-disable-next-line no-console
      console.log(`Server listening on ${port}`);
   });
}
