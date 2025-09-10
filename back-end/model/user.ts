import { Role } from '../types/index';
import { User as UserPrisma } from '@prisma/client';

export class User {
    private id?: number;
    private username: string;
    private firstName: string;
    private lastName: string;
    private email: string;
    private password: string;
    private role: Role;
    private createdAt?: Date;
    private updatedAt?: Date;

    constructor(user: {
        id?: number;
        username: string;
        firstName: string;
        lastName: string;
        email: string;
        password: string;
        role: Role;
        createdAt: Date;
        updatedAt: Date;
    }) {
        this.validate(user);

        this.id = user.id;
        this.username = user.username;
        this.firstName = user.firstName;
        this.lastName = user.lastName;
        this.email = user.email;
        this.password = user.password;
        this.role = user.role;
        this.createdAt = user.createdAt;
        this.updatedAt = user.updatedAt;
    }

    validate(user: {
        username: string;
        email: string;
        password: string;
        role: Role;
    }) {
        if (typeof user.username !== 'string' || user.username.trim().length === 0) {
            throw new Error("'username' must be a non-empty string");
        }
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

    getEmail(): string {
        return this.email;
    }

    getPassword(): string {
        return this.password;
    }

    getFirstName(): string {
        return this.firstName;
    }

    getLastName(): string {
        return this.lastName;
    }

    getRole(): Role {
        return this.role;
    }

    equals(user: User): boolean {
        return (
            this.username === user.getUsername() &&
            this.email === user.getEmail() &&
            this.role === user.getRole()
        )
    }

    toDTO() {
        return {
            id: this.id,
            username: this.username,
            email: this.email,
            role: this.role
        };
    }

    static from({ id, username, firstName, lastName, email, password, role, createdAt, updatedAt }: UserPrisma) {
        return new User( {
            id,
            username,
            firstName,
            lastName,
            email,
            password,
            role: role as Role,
            createdAt,
            updatedAt,
        });
    }
}