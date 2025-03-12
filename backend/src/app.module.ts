import { Module } from '@nestjs/common';

// import the used module
// import { UserModule } from './user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { UploadModule } from './uploads/upload.module'
@Module({
  imports: [MongooseModule.forRoot('mongodb://localhost/datafusion'),
    UploadModule
  ],
})

export class AppModule {}
