import database from './database';
import { User } from '../model/user';

const SELECT = {
    id: true,
    username: true,
    firstName: true,
    lastName: true,
    email: true,
    password: true,
};

const getAllUsers = async (): Promise<User[]> => {

    try {
        const usersPrisma = await database.user.findMany({});
        return usersPrisma.map((userPrisma) => User.from(userPrisma));
    } catch(error) {
        console.error(error);
        throw new Error('Database error. See server log for details.');
    }
};

const getUserByUsername = async ({ username }: {username: string}): Promise<User | null> => {
    try {
        const userPrisma = await database.user.findFirst({
            where: { username },
        });
        return userPrisma ? User.from(userPrisma) : null;
    } catch(error) {
        console.error(error);
        throw new Error(`Database error. See server log for details.`);
    }
};


const createUser = async (user: User): Promise<User> => {
    try {
        const userPrisma = await database.user.create({
            data: {
                username: user.getUsername(),
                password: user.getPassword(),
                firstName: user.getFirstName(),
                lastName: user.getLastName(),
                email: user.getEmail(),
                role: user.getRole(),
            },
        });
        return User.from(userPrisma);
    } catch (error) {
        console.error(error);
        throw new Error(`Database error. See server log for details.`);
    }
};

const userRepository = {
    getAllUsers,
    getUserByUsername,
    createUser,
};

export default userRepository;