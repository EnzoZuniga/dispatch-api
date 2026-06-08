import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { IUserRepository } from './repository';
import { LoginInput } from './schemas';
import { UnauthorizedError } from '../../errors';
import { config } from '../../config';

export class AuthService {
  constructor(private userRepo: IUserRepository) {}

  async login(input: LoginInput): Promise<string> {
    const user = await this.userRepo.findByEmail(input.email);
    
    if (!user) {
      throw new UnauthorizedError('Invalid credentials');
    }

    const isValid = await bcrypt.compare(input.password, user.passwordHash);
    
    if (!isValid) {
      throw new UnauthorizedError('Invalid credentials');
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      config.jwtSecret,
      { expiresIn: '24h' }
    );

    return token;
  }
}
