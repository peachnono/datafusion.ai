import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UploadModule } from './uploads/upload.module';
import { ConfigModule } from '@nestjs/config';

// Log the DB_URI environment variable for debugging purposes before initializing Mongoose.
console.log('DB_URI:', process.env.DB_URI);

// @Module({
//   imports: [
//     // Load configuration from the .env file to access environment variables.
//     ConfigModule.forRoot(),
//     // Connect to the MongoDB instance using environment variables for credentials and settings.
//     MongooseModule.forRoot(process.env.DB_URI || '', {
//     user: process.env.DB_USERNAME,
//     pass: process.env.DB_PASSWORD,
//     authSource: 'admin', // Authentication source set to "admin".
//   }),
//     UploadModule
//   ],
// })

// Uncomment the following block to use the local MongoDB instance for development or testing purposes.
// This provides an easy way to switch to local testing without modifying the primary configuration.
@Module({
  imports: [MongooseModule.forRoot('mongodb://localhost/datafusion'),
    UploadModule
  ],
})

export class AppModule {}
