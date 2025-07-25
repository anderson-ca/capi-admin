// utils/prisma.js  – CommonJS singleton
const { PrismaClient } = require('../generated/prisma');

const globalForPrisma = globalThis;
const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ['query'],          // remove if too noisy
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

module.exports = prisma;
