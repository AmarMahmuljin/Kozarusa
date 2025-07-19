import prisma from './database';
import { UserType } from '../types/index';
import { User } from '../model/user';
import { Role } from '@prisma/client';

const getAllUsers = async (): Promise<User[]> => {
    try {
        const usersPrisma = await prisma.user.findMany({});
        return usersPrisma.map((userPrisma: any) => User.from(userPrisma));
    } catch(err) {
        console.error('Error fetching users:', err);
        throw new Error('Failed to fetch users');
    }
};

const getUserById = async (id: number): Promise<User | null> => {
    try {
        const userPrisma = await prisma.user.findUnique({
            where: { id: id },
        });
        return userPrisma ? User.from(userPrisma) : null;
    } catch(err) {
        console.error(`Error fetching user with id ${id}: `, err);
        throw new Error('Failed to fetch user');
    }
};

const getUserByName = async (username: string): Promise<User | null> => {
    try {
        const userPrisma = await prisma.user.findUnique({
            where: { username },
        });
        return userPrisma ? User.from(userPrisma) : null;
    } catch(err) {
        console.error(`Error fetching user with name ${name}:`, err);
        throw new Error(`Failed to fetch user by name`);
    }
};

const getUserByEmail = async (email: string): Promise<User | null> => {
    try {
        const userPrisma = await prisma.user.findUnique({
            where: { email },
        });
        return userPrisma ? User.from(userPrisma) : null;
    } catch(err) {
        console.error(`Error fetching user with email ${email}:`, err);
        throw new Error('Failed to fetch user by email');
    }
};

const createUser = async ({ username, firstName, lastName, email, password, role }: UserType): Promise<User> => {
    try {
        // Validate via domain model
        const validUser = new User({ username, firstName, lastName, email, password, role });
        const created = await prisma.user.create({
            data: {
                username,
                firstName,
                lastName,
                email,
                password,
                role: role as Role,
            }
        });
        return User.from(created);
    } catch (err) {
        console.error(`Error creating user:`, err);
        throw new Error('Failed to created user');
    }
};

const deleteUser = async (id: number): Promise<void> => {
    try {
        await prisma.user.delete({
            where: { id },
        });
    } catch(err) {
        console.error(`Error deleting uerser with id ${id}:`, err);
        throw new Error('Failed to delete user');
    }
};

const userRepository = {
    getAllUsers,
    getUserById,
    getUserByName,
    getUserByEmail,
    createUser,
    deleteUser,
}

export default userRepository;