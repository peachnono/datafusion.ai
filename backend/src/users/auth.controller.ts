/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
// auth.controller.ts
import { Controller, Post, Get, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from './user.entity';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  register(@Body() user: User) {
    this.authService.register(user);
    return { message: 'User registered successfully' };
  }

  @Post('login')
  login(@Body() credentials: { email: string; password: string }) {
    const token = this.authService.login(
      credentials.email,
      credentials.password,
    );
    return { access_token: token };
  }

  @Get('me')
  getProfile(@Body('token') token: string) {
    const user = this.authService.verifyToken(token);
    if (!user) {
      return { error: 'User not found or token invalid' };
    }
    return { user };
  }
}
