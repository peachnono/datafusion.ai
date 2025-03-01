/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unused-vars */

import {
  Controller,
  Post,
  Body,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import * as usersService_1 from './user.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: usersService_1.UsersService) {}

  @Post('login')
  async login(@Body() body: { username: string; password: string }) {
    const user = await this.usersService.findOne(body.username);
    if (!user || user.password !== body.password) {
      throw new UnauthorizedException('Credentials incorrect');
    }
    return 'Login successful!';
  }
}
