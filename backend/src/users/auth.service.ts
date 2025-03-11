/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from './user.repository';
import { User } from './user.entity';

@Injectable()
export class AuthService {
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
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call
    return this.jwtService.sign(payload);
  }

  verifyToken(token: string): User {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      const decoded = this.jwtService.verify(token);
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
