import { PrismaClient } from '../generated/prisma/client'; // ✅ Correct import
import { PrismaNeon } from '@prisma/adapter-neon';

// Global variable to store the PrismaClient instance
declare global {
   // eslint-disable-next-line no-var
   var __prisma: PrismaClient | undefined;
}

export function getPrismaClient(): PrismaClient {
   if (global.__prisma) {
      return global.__prisma;
   }

   const connectionString = process.env.DATABASE_URL;
   if (!connectionString) {
      throw new Error(
         'DATABASE_URL environment variable is not set. ' +
            'Please configure it in your Vercel project settings.'
      );
   }

   const adapter = new PrismaNeon({ connectionString });

   const prisma = new PrismaClient({
      adapter,
      log:
         process.env.NODE_ENV === 'development'
            ? ['query', 'error', 'warn']
            : ['error'],
   });

   global.__prisma = prisma;

   return prisma;
}

let _prismaInstance: PrismaClient | null = null;

function getPrismaInstance(): PrismaClient {
   if (!_prismaInstance) {
      _prismaInstance = getPrismaClient();
   }
   return _prismaInstance;
}

export const prisma = new Proxy({} as PrismaClient, {
   get(_target, prop) {
      const instance = getPrismaInstance();
      const value = (instance as any)[prop];
      if (typeof value === 'function') {
         return value.bind(instance);
      }
      return value;
   },
});
