type Role = 'user' | 'guest' | 'admin';

type UserInput = {
    id?: number;
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role: Role;
    updatedAt: Date;
    createdAt: Date;
}

type AuthenticationResponse = {
    token: string;
    username: string;
    fullname: string;
    role: string;
}

type Payload = {
    userId: number;
    username: string;
    role: Role;
}

export {
    Role,
    UserInput,
    AuthenticationResponse,
    Payload,
};