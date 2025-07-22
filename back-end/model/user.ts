import { Role } from '../types/index';
import { User as UserPrisma } from '@prisma/client';

export class User {
    private id?: number;
    private username: string;
    // private firstName: string;
    // private lastName: string;
    private email: string;
    private password: string;
    private role: Role;

    constructor(user: {
        id?: number;
        username: string;
        // firstName: string;
        // lastName: string;
        email: string;
        password: string;
        role: Role;
    }) {
        this.validate(user);

        this.id = user.id;
        this.username = user.username;
        // this.firstName = user.firstName;
        // this.lastName = user.lastName;
        this.email = user.email;
        this.password = user.password;
        this.role = user.role;
    }

    validate(user: {
        username: string;
        // firstName: string;
        // lastName: string;
        email: string;
        password: string;
        role: Role;
    }) {
        if (typeof user.username !== 'string' || user.username.trim().length === 0) {
            throw new Error("'username' must be a non-empty string");
        }
        // if (typeof user.firstName !== 'string' || user.firstName.trim().length === 0) {
        //     throw new Error("'first name' must be a non-empty string");
        // }
        // if (typeof user.lastName !== 'string' || user.lastName.trim().length === 0) {
        //     throw new Error("'last name' must be a non-empty string");
        // }
        if (typeof user.email !== 'string' || user.email.trim().length === 0) {
            throw new Error("'email' must be a non-empty string");
        }
        if (typeof user.password !== 'string' || user.password.trim().length < 6) {
            throw new Error("'password' must be at least 6 characters long");
        }
    }

    getId(): number | undefined {
        return this.id;
    }

    getUsername(): string {
        return this.username;
    }

    // getFirstName(): string {
    //     return this.firstName;
    // }

    // getLastName(): string {
    //     return this.lastName;
    // }

    getEmail(): string {
        return this.email;
    }

    getRole(): Role {
        return this.role;
    }

    equals(user: User): boolean {
        return (
            this.username === user.getUsername() &&
            // this.firstName === user.getFirstName() &&
            // this.lastName === user.getLastName() &&
            this.email === user.getEmail() &&
            this.role === user.getRole()
        )
    }

    toDTO() {
        return {
            id: this.id,
            username: this.username,
            // firstName: this.firstName,
            // lastName: this.lastName,
            email: this.email,
            role: this.role
        };
    }

    static from({ id, username, email, password, role }: UserPrisma) {
        return new User( {
            id,
            username,
            // firstName,
            // lastName,
            email,
            password,
            role,
        });
    }
}