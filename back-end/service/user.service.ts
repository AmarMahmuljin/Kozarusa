import { User } from '../model/user';
import { UserType} from '../types';
import encryptor from '../helpers/encryptor';
import decryptor from '../helpers/decryptor';
import userRepository from '../repository/user.db';


const getAllUsers = async (): Promise<User[]> => {
    return await userRepository.getAllUsers();
};

const getUserById = async(id: number): Promise<User | null> => {
    const user = await userRepository.getUserById(id);
    if (!user) {
        throw new Error('User not found');
    }
    return user;
};

const getUserByName = async (username: string): Promise<User | null> => {
    const user = await userRepository.getUserByName(username);
    if (!user) {
        throw new Error('User not found by name');
    }
    return user;
};

const createUser = async ({ username, firstName, lastName, email, password, role }: UserType): Promise<User> => {
    const emailExists = await userRepository.getUserByEmail(email);
    if (emailExists !== null) {
        throw new Error('User with email already exists');
    }
    const encryptedPassword = await encryptor(password);

    const user: UserType = { username, firstName, lastName, email, password: encryptedPassword, role };
    return await userRepository.createUser(user);
}

const deleteUser = async (id: number): Promise<void> => {
    const existingUser = await userRepository.getUserById(id);
    if (!existingUser) {
        throw new Error('User not found');
    }

    await userRepository.deleteUser(id);
};

export {
    getAllUsers,
    getUserById,
    getUserByName,
    createUser,
    deleteUser,
}