import bcrypt from 'bcrypt';
import { User } from '../model/user';
import userRepository from '../repository/user.db';
import { AuthenticationResponse, UserInput } from '../types';
import { generateJwtToken } from '../util/jwt';
import { AppError } from '../errors/AppError';
import { config } from '../config';

/**
 * Retrieve all users from the repository.
 * Returns an array of domain User object.
 */
const getAllUsers = async (): Promise<User[]> => {
    return await userRepository.getAllUsers();
};

/**
 * Authenticate a user by username and password. 
 * Performs a constant-time comparison using a fallback hash to mitigate timming attacks.
 * Returns a JWT and user metadata on success.
 */
const authenticate = async ({ username, password }: Pick<UserInput, 'username' | 'password'>): Promise<AuthenticationResponse> => {
    const user = await userRepository.getUserByUsername({ username });

    const fallbackHash = '$2b$12$Ck3sX9jD2p3h8UuJjv8bduRkq1Y0n1Trm4k1Y0n1Trm4k1Y0n1Trm';
    const ok = await bcrypt.compare(password, user?.getPassword() ?? fallbackHash);

    if (!user || !ok) throw new AppError(401, 'Invalid credentials');

    const token = generateJwtToken({ userId: user.getId()!, username: user.getUsername(), role: user.getRole() });
    return { token, username: user.getUsername(), fullname: `${user.getFirstName()} ${user.getLastName()}`, role: user.getRole() };
};

/**
 * Create a new user. 
 * Duplicates are checked by username and email.
 * The password is hashed using bcript and a default role of `user` is enforced 
 * regardless of any role specified in the input to prevent privilege escalation during registration.
 */
const createUser = async (input : UserInput): Promise<User> => {
    const [byUsername, byEmail] = await Promise.all([
        userRepository.getUserByUsername({ username: input.username }),
        userRepository.getUserByEmail({ email: input.email }),
    ])

    if (byUsername) throw new AppError(409, 'Username already in use');
    if (byEmail) throw new AppError(409, 'Email already in use');
    
    const hashed = await bcrypt.hash(input.password, config.BCRYPT_ROUNDS);
    const user = new User({ ...input, role: 'user', password: hashed });
    return userRepository.createUser(user);
}

export default {
    getAllUsers,
    authenticate,
    createUser,
};