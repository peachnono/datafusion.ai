import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from './user.repository';
import { User } from './user.entity';

@Injectable()
export class AuthService {
  private disabledToken: Set<string> = new Set();

  constructor(
    private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  register(user: User): void {
    const existingUser = this.userRepository.findUserByEmail(user.email);
    if (existingUser) {
      throw new Error('User already exists');
    }
    this.userRepository.saveUser(user);
  }

  login(email: string, password: string): string {
    const user = this.userRepository.findUserByEmail(email);
    if (!user || user.password !== password) {
      throw new Error('Invalid credentials');
    }
    const payload = { email: user.email, sub: user.id };
    return this.jwtService.sign(payload);
  }

  logout(token: string): void {
    this.disabledToken.add(token);
  }

  verifyToken(token: string): User {
    if (this.disabledToken.has(token)) {
      throw new Error('Token has been blacklisted');
    }
    try {
      const decoded = this.jwtService.verify<{ email: string; sub: number }>(
        token,
      );
      const user = this.userRepository.findUserByEmail(decoded.email);
      if (!user) {
        throw new Error('User not found');
      }
      return user;
    } catch {
      throw new Error('Invalid token');
    }
  }
}
