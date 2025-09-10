// Execute: npx ts-node util/seed.ts

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { set } from 'date-fns';

const prisma = new PrismaClient();

const main = async () => {
    await prisma.user.deleteMany();

    const adminPassword = await bcrypt.hash('Admin123!', 12);
    const userPassword = await bcrypt.hash('User123!', 12);
    const guestPassword = await bcrypt.hash('Guest123!', 12);
    await prisma.user.createMany({
        data: [
        {
            username: 'admin',
            firstName: 'Alice',
            lastName: 'Admin',
            email: 'admin@example.com',
            password: adminPassword,
            role: 'admin',
        },
        {
            username: 'user',
            firstName: 'Bob',
            lastName: 'User',
            email: 'user@example.com',
            password: userPassword,
            role: 'user',
        },
        {
            username: 'guest',
            firstName: 'Charlie',
            lastName: 'Guest',
            email: 'guest@example.com',
            password: guestPassword,
            role: 'guest',
        },
        ],
    });
}

(async () => {
    try {
        await main();
        await prisma.$disconnect();
    } catch (error) {
        console.error(error);
        await prisma.$disconnect();
        process.exit(1);
    }
})();
