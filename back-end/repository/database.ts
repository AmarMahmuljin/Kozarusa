import { PrismaClient } from '@prisma/client';

const database = new PrismaClient({
    log: process.env.NODE_ENV === 'production' ? ['error'] : ['query', 'error', 'warn'],
});

process.on('beforeExit', async () => {
    await database.$disconnect();
});

export default database;
