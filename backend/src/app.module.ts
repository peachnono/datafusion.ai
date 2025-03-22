import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UploadModule } from './uploads/upload.module'
import { AuthModule } from './users/user.module';

@Module({
  imports: [MongooseModule.forRoot('mongodb://localhost/datafusion'),
    UploadModule,
    AuthModule,
  ],
})

export class AppModule {}
