
import { Controller, Get, Post, Put, Delete, Param, Body, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';


@Controller('uploads')
export class UploadController {
    constructor(
        private readonly uploadService: UploadService
      ) {}
    
  // Create: Upload new file and create upload record to save into DB.
  @Post()
  @UseInterceptors(FileInterceptor('file')) // Use Multer to recive upload data.
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    // TODO: wait unitil conbine with the user schema.
    // get the user id from login to fill userId field. 
    const userId = 'someUserId'; 
    const upload = await this.uploadService.createUpload(file, userId);
    return { message: 'File uploaded successfully', upload };
  }

  // Read: Get all upload records
  @Get()
  async getAllUploads() {
    return this.uploadService.getAllUploads();
  }

  // Read: get record by uploadId
  @Get(':id')
  async getUploadById(@Param('id') id: string) {
    return this.uploadService.getUploadById(id);
  }

  // Update processedData after AI process.
  @Put(':id')
  async updateProcessedData(
    @Param('id') id: string,
    @Body() processedData: Record<string, any>,
  ) {
    const updatedUpload = await this.uploadService.updateProcessedData(id, processedData);
    return { message: 'Processed data updated successfully', updatedUpload };
  }

  // Delete record
  @Delete(':id')
  async deleteUpload(@Param('id') id: string) {
    await this.uploadService.deleteUpload(id);
    return { message:  { message: 'Upload deleted successfully' }
  }
}

}
