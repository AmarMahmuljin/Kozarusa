import bcrypt from 'bcrypt';

const decryptor = async (plainPass: string, hashedPass: string): Promise<boolean> => {
    try {
        const isCorrect = await bcrypt.compare(plainPass, hashedPass);
        return isCorrect;
    } catch (err) {
        console.log('An error has occurred: ' + err);
        return false;
    }
};

export default decryptor;
