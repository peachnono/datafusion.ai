import { Module } from '@nestjs/common';
import { AuthModule } from './users/user.module';

@Module({
  imports: [AuthModule],
})
export class AppModule {}
