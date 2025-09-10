import { User } from '../../model/user';
import { DomainValidationError } from '../../errors/DomainValidationError';
import { Role } from '../../types';
import type { User as UserPrisma } from '@prisma/client';


const VALID_BCRYPT =
  '$2b$12$C6UzMDM.H6dfI/f/IKcEe.O28JtFf5o9jJ8m9C2Ck8xqJjUwG7E7a';

const now = new Date();
const later = new Date(now.getTime() + 1000);

function makePrismaUser(overrides: Partial<UserPrisma> = {}): UserPrisma {
  return {
    id: 1,
    username: 'Amar',
    firstName: ' Amar ',
    lastName: '  Mahmuljin',
    email: '  AMAR@example.com ',
    password: VALID_BCRYPT,
    role: 'admin' as any,
    createdAt: now,
    updatedAt: later,
    ...overrides,
  };
}

describe('User model - happy paths', () => {
  test('constructs from Prisma object via static from()', () => {
    const prismaUser = makePrismaUser();
    const user = User.from(prismaUser);

    expect(user.getUsername()).toBe('amar');
    expect(user.getEmail()).toBe('amar@example.com');
    expect(user.getFirstName()).toBe('Amar');
    expect(user.getLastName()).toBe('Mahmuljin');

    expect(user.getId()).toBe(1);
    expect(user.getRole()).toBe<'admin'>('admin');
    expect(user.getCreatedAt()).toEqual(now);
    expect(user.getUpdatedAt()).toEqual(later);

    expect(user.getFullName()).toBe('Amar Mahmuljin');

    const dto = user.toDTO();
    expect(dto).toEqual({
      id: 1,
      username: 'amar',
      firstName: 'Amar',
      lastName: 'Mahmuljin',
      email: 'amar@example.com',
      role: 'admin',
      createdAt: now,
      updatedAt: later,
    });
    // @ts-expect-error password should not exist on DTO
    expect(dto.password).toBeUndefined();
  });

  test('equals() returns true for same username/email/role', () => {
    const u1 = User.from(makePrismaUser({ id: 1 }));
    const u2 = User.from(makePrismaUser({ id: 2, createdAt: later, updatedAt: new Date(later.getTime() + 1000) }));
    expect(u1.equals(u2)).toBe(true);
  });

  test('equals() returns false for different username/email/role', () => {
    const u1 = User.from(makePrismaUser({ username: 'Amar', email: 'a@example.com', role: 'admin' as any }));
    const u2 = User.from(makePrismaUser({ username: 'Else', email: 'b@example.com', role: 'user' as any }));
    expect(u1.equals(u2)).toBe(false);
  });
});

describe('User model - unhappy paths (validation)', () => {
  function expectIssues(fn: () => unknown, contains: string[]) {
    try {
      fn();
      throw new Error('Expected DomainValidationError, but none was thrown');
    } catch (err: any) {
      expect(err).toBeInstanceOf(DomainValidationError);
      const message: string = err.message ?? '';
      for (const piece of contains) {
        expect(message).toEqual(expect.stringContaining(piece));
      }
    }
  }

  test('rejects missing username', () => {
    const prismaUser = makePrismaUser({ username: '   ' });
    expectIssues(() => User.from(prismaUser), ["'username' is required"]);
  });

  test('rejects invalid username pattern (starts with dot)', () => {
    const prismaUser = makePrismaUser({ username: '.amar' });
    expectIssues(() => User.from(prismaUser), ["'username' must start with a letter/number"]);
  });

  test('rejects overly long username (> 30)', () => {
    const longName = 'a'.repeat(31);
    const prismaUser = makePrismaUser({ username: longName });
    expectIssues(() => User.from(prismaUser), ["'username' must be <= 30 characters"]);
  });

  test('rejects missing email', () => {
    const prismaUser = makePrismaUser({ email: '   ' });
    expectIssues(() => User.from(prismaUser), ["'email' is required"]);
  });

  test('rejects invalid email', () => {
    const prismaUser = makePrismaUser({ email: 'not-an-email' });
    expectIssues(() => User.from(prismaUser), ["'email' must be a valid email address"]);
  });

  test('rejects email over 254 chars', () => {
    const local = 'a'.repeat(64);
    const domain = 'b'.repeat(189);
    const tooLong = `${local}@${domain}.commmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm`;
    const prismaUser = makePrismaUser({ email: tooLong });
    expectIssues(() => User.from(prismaUser), ["'email' must be <= 254 characters"]);
  });

  test('rejects missing firstName', () => {
    const prismaUser = makePrismaUser({ firstName: '   ' });
    expectIssues(() => User.from(prismaUser), ["'firstName' is required"]);
  });

  test('rejects invalid firstName characters', () => {
    const prismaUser = makePrismaUser({ firstName: '1234' });
    expectIssues(() => User.from(prismaUser), ["'firstName' must start with a letter"]);
  });

  test('rejects missing lastName', () => {
    const prismaUser = makePrismaUser({ lastName: '' });
    expectIssues(() => User.from(prismaUser), ["'lastName' is required"]);
  });

  test('rejects invalid lastName characters', () => {
    const prismaUser = makePrismaUser({ lastName: '***' });
    expectIssues(() => User.from(prismaUser), ["'lastName' must start with a letter"]);
  });

  test('rejects invalid role', () => {
    const prismaUser = makePrismaUser({ role: 'superuser' as any });
    expectIssues(() => User.from(prismaUser), ["'role' must be one of: user, admin, guest"]);
  });

  test('rejects non-bcrypt password (model expects stored hash)', () => {
    const prismaUser = makePrismaUser({ password: 'plaintext-should-not-be-accepted' });
    expectIssues(() => User.from(prismaUser), ["'password' must be a valid bcrypt hash"]);
  });

  test('rejects updatedAt < createdAt', () => {
    const earlier = new Date(now.getTime() - 5000);
    const prismaUser = makePrismaUser({ createdAt: now, updatedAt: earlier });
    expectIssues(() => User.from(prismaUser), ["'updatedAt' must be greater than or equal to 'createdAt'"]);
  });

  test('rejects non-Date timestamps', () => {
    const prismaUser = makePrismaUser() as any;
    prismaUser.createdAt = '2024-01-01';
    prismaUser.updatedAt = 123456;
    expectIssues(() => User.from(prismaUser), [
      "'createdAt' must be a Date",
      "'updatedAt' must be a Date",
    ]);
  });
});
