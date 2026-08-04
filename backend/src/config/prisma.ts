import { PrismaClient } from '@prisma/client';

// Single shared instance — tsx watch/hot-reload in dev can otherwise spawn multiple
// clients and exhaust Postgres connections.
const prisma = new PrismaClient();

export default prisma;
