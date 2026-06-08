import bcrypt from 'bcrypt';
import { User } from './types';

// Seed user pour la démo: email=admin@dispatch.com password=admin123
const SEED_USER: User = {
  id: 'user_1',
  email: 'admin@dispatch.com',
  passwordHash: bcrypt.hashSync('admin123', 10),
  name: 'Admin User',
};

export interface IUserRepository {
  findByEmail(email: string): Promise<User | null>;
}

export class InMemoryUserRepository implements IUserRepository {
  private users = new Map<string, User>();

  constructor() {
    this.users.set(SEED_USER.email, SEED_USER);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.users.get(email) || null;
  }
}
