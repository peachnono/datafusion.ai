// user.repository.ts
import { Injectable } from '@nestjs/common';
import { User } from './user.entity';

@Injectable()
export class UserRepository {
  private users: User[] = [];
  findUserByEmail(email: string): User | undefined {
    return this.users.find((user) => user.email === email);
  }

  saveUser(user: User): void {
    this.users.push(user);
  }
}
