type UserType = {
    id?: number;
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role: "USER" | "GUEST" | "ADMIN";
};

type StatusMessage = {
    message: string;
    type: "error" | "success";
};

export type {
    UserType,
    StatusMessage,
};