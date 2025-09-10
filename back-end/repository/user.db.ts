import database from './database';
import { User } from '../model/user';

const SELECT = {
    id: true,
    username: true,
    firstName: true,
    lastName: true,
    email: true,
    password: true,
    role: true,
    createdAt: true,
    updatedAt: true,
};

const getAllUsers = async (): Promise<User[]> => {
    const usersPrisma = await database.user.findMany({ select: SELECT });
    return usersPrisma.map(User.from);
};

const getUserByUsername = async ({ username }: {username: string}): Promise<User | null> => {
    const userPrisma = await database.user.findFirst({ where: { username }, select: SELECT });
    return userPrisma ? User.from(userPrisma) : null;
};

const getUserByEmail = async ({ email }: { email: string }): Promise<User | null> => {
    const userPrisma = await database.user.findFirst({ where: { email }, select: SELECT });
    return userPrisma ? User.from(userPrisma) : null;
}

const createUser = async (user: User): Promise<User> => {
    const userPrisma = await database.user.create({
        data: {
            username: user.getUsername(),
            password: user.getPassword(),
            firstName: user.getFirstName(),
            lastName: user.getLastName(),
            email: user.getEmail(),
            role: user.getRole(),
        },
        select: SELECT,
    });
    return User.from(userPrisma);
};

const userRepository = {
    getAllUsers,
    getUserByUsername,
    getUserByEmail,
    createUser,
};

export default userRepository;