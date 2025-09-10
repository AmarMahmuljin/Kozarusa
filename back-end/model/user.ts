import { DomainValidationError } from '../errors/DomainValidationError';
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
    private createdAt: Date;
    private updatedAt: Date;

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
        this.username = user.username.trim().toLowerCase();
        this.firstName = user.firstName.trim();
        this.lastName = user.lastName.trim();
        this.email = user.email.trim().toLowerCase();
        this.password = user.password;
        this.role = user.role;
        this.createdAt = user.createdAt;
        this.updatedAt = user.updatedAt;
    }

    private static readonly USERNAME_RE = /^[a-z0-9](?:[._-]?[a-z0-9]){2,29}$/;
    private static readonly EMAIL_RE = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    private static readonly NAME_RE = /^[\p{L}][\p{L}\p{M} '\-]{0,99}$/u;
    private static readonly BCRYPT_RE = /^\$2[aby]\$\d{2}\$[./A-Za-z0-9]{53}$/;
    private static readonly USERNAME_MAX = 30;
    private static readonly EMAIL_MAX = 254;
    private static readonly NAME_MAX = 100;
    private static readonly ROLES: Role[] = ['user', 'admin', 'guest'];

    validate(user: {
        username: string;
        firstName: string;
        lastName: string;
        email: string;
        password: string;
        role: Role;
        createdAt: Date;
        updatedAt: Date;
    }) {
        const issues: string[] = [];
        const username = user.username?.trim().toLowerCase();
        if (!username) {
            issues.push("'username' is required");
        } else if (username.length > User.USERNAME_MAX) {
            issues.push(`'username' must be <= ${User.USERNAME_MAX} characters`);
        } else if (!User.USERNAME_RE.test(username)) {
            issues.push("'username' must start with a letter/number, be 3-30 chars, and may contain single '.', '_' or '-' between alphanumerics");
        };

        const email = user.email?.trim().toLowerCase();
        if (!email) {
            issues.push("'email' is required");
        } else if (email.length > User.EMAIL_MAX) {
            issues.push(`'email' must be <= ${User.EMAIL_MAX} characters`);
        } else if (!User.EMAIL_RE.test(email)) {
            issues.push("'email' must be a valid email address");
        };

        const firstName = user.firstName?.trim();
        const lastName = user.lastName?.trim();

        if (!firstName) {
            issues.push("'firstName' is required");
        } else if (firstName.length > User.NAME_MAX) {
            issues.push(`'firstName' must be <= ${User.NAME_MAX} characters`);
        } else if (!User.NAME_RE.test(firstName)) {
            issues.push("'firstName' must start with a letter and contain only letters, spaces, hyphens, or apostrophes");
        };

        if (!lastName) {
            issues.push("'lastName' is required");
        } else if (lastName.length > User.NAME_MAX) {
            issues.push(`'lastName' must be <= ${User.NAME_MAX} characters`);
        } else if (!User.NAME_RE.test(lastName)) {
            issues.push("'lastName' must start with a letter and contain only letters, spaces, hyphens, or apostrophes");
        };

        if (!User.ROLES.includes(user.role)) {
            issues.push(`'role' must be one of: ${User.ROLES.join(', ')}`);
        }

        if (!user.password || !User.BCRYPT_RE.test(user.password)) {
            issues.push("'password' must be a valid bcrypt hash at the model layer");
        }

        if (user.createdAt && !(user.createdAt instanceof Date)) {
            issues.push("'createdAt' must be a Date");
        }

        if (user.updatedAt && !(user.updatedAt instanceof Date)) {
            issues.push("'updatedAt' must be a Date");
        }

        if (user.createdAt && user.updatedAt && user.updatedAt < user.createdAt) {
            issues.push("'updatedAt' must be greater than or equal to 'createdAt'");
        }

        if (issues.length) {
            throw new DomainValidationError(issues);
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

    getCreatedAt(): Date {
        return this.createdAt;
    }

    getUpdatedAt(): Date {
        return this.updatedAt;
    }

    getFullName(): string {
        return `${this.firstName} ${this.lastName}`;
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