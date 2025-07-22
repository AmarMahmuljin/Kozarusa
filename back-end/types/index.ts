type Role = 'USER' | 'GUEST' | 'ADMIN';

type UserType = {
    id?: number;
    username: string;
    email: string;
    password: string;
    role: Role;
}

export {
    Role,
    UserType,
};