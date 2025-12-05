import { PrismaNeon } from '@prisma/adapter-neon';
import { PrismaClient } from '../generated/prisma/client';

export const productRepository = {
   async getProduct(productId: number) {
      const connectionString = `${process.env.DATABASE_URL}`;
      const adapter = new PrismaNeon({ connectionString });
      const prisma = new PrismaClient({ adapter });
      return prisma.product.findUnique({ where: { id: productId } });
   },
};
