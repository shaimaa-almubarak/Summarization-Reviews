import { PrismaNeon } from '@prisma/adapter-neon';
import { PrismaClient, type Review } from '../generated/prisma/client.ts';
import dayjs from 'dayjs';
const connectionString = `${process.env.DATABASE_URL}`;
const adapter = new PrismaNeon({ connectionString });
const prisma = new PrismaClient({ adapter });
export const reviewRepository = {
   async getReviews(productId: number, Limit?: number): Promise<Review[]> {
      return prisma.review.findMany({
         where: { productId },
         orderBy: { createdAt: 'desc' },
         take: Limit,
      });
   },

   async StoreSummary(productId: number, summary: string) {
      const now = new Date();
      const expiresAt = dayjs().add(7, 'days').toDate();
      const data = { content: summary, expiresAt, genratedAt: now, productId };

      return prisma.summary.upsert({
         where: { productId },
         create: data,
         update: data,
      });
   },

   async getSummaryReview(productId: number): Promise<string | null> {
      const summary = await prisma.summary.findFirst({
         where: { AND: [{ productId }, { expiresAt: { gt: new Date() } }] },
      });
      return summary ? summary.content : null;
   },
};
