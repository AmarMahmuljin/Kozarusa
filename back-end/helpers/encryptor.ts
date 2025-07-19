import bcrypt from 'bcrypt';

const encryptor = async (password: string): Promise<string> => {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(password, salt);
        return hashedPass;
    } catch (error) {
        throw new Error(`Something went wrong while encrypting the password: ${error}`);
    }
};

export default encryptor;
