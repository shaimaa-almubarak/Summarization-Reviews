/**
 * Prisma Client Singleton for Serverless Environments
 *
 * In serverless environments (like Vercel), each function invocation can reuse
 * the same module instance, but we need to ensure we don't create multiple
 * Prisma Client instances which would exhaust connection pools.
 *
 * This singleton pattern ensures:
 * 1. Only one PrismaClient instance exists per serverless function instance
 * 2. Connection pooling is managed efficiently
 * 3. The client is properly configured for serverless (using Neon adapter)
 */

import { PrismaClient } from '../generated/prisma/client';
import { PrismaNeon } from '@prisma/adapter-neon';

// Global variable to store the PrismaClient instance
// In serverless, this persists across invocations within the same container
declare global {
   // eslint-disable-next-line no-var
   var __prisma: PrismaClient | undefined;
}

/**
 * Get or create the Prisma Client singleton instance.
 *
 * In development, we use a global variable to prevent multiple instances
 * during hot-reloading. In production (serverless), each function instance
 * gets its own singleton that persists across invocations.
 */
export function getPrismaClient(): PrismaClient {
   // Check if we already have an instance
   if (global.__prisma) {
      return global.__prisma;
   }

   // Validate required environment variable
   const connectionString = process.env.DATABASE_URL;
   if (!connectionString) {
      throw new Error(
         'DATABASE_URL environment variable is not set. ' +
            'Please configure it in your Vercel project settings.'
      );
   }

   // Create Neon adapter for serverless PostgreSQL
   const adapter = new PrismaNeon({ connectionString });

   // Create Prisma Client with the adapter
   const prisma = new PrismaClient({
      adapter,
      // Log queries in development, but not in production for performance
      log:
         process.env.NODE_ENV === 'development'
            ? ['query', 'error', 'warn']
            : ['error'],
   });

   // Store in global for reuse (especially important in development)
   global.__prisma = prisma;

   return prisma;
}

// Lazy initialization: Don't create Prisma client at module load time
// This prevents FUNCTION_INVOCATION_FAILED errors when DATABASE_URL is missing
// The client will be created on first access, after environment variables are validated
let _prismaInstance: PrismaClient | null = null;

function getPrismaInstance(): PrismaClient {
   if (!_prismaInstance) {
      _prismaInstance = getPrismaClient();
   }
   return _prismaInstance;
}

// Export a proxy that lazily initializes the Prisma client
// This allows the module to be imported without immediately connecting to the database
export const prisma = new Proxy({} as PrismaClient, {
   get(_target, prop) {
      const instance = getPrismaInstance();
      const value = (instance as any)[prop];
      // If it's a function, bind it to the instance
      if (typeof value === 'function') {
         return value.bind(instance);
      }
      return value;
   },
});
