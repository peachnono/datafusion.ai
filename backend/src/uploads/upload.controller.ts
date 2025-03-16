
import { Controller, Get, Post, Put, Delete, Param, Body, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';


@Controller('uploads')
export class UploadController {
    constructor(
        private readonly uploadService: UploadService
      ) {}
    
  // Create: 上傳新文件
  @Post()
  @UseInterceptors(FileInterceptor('filepond')) // 使用 Multer 接收文件
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    const userId = 'someUserId'; // 模擬的用戶ID，可以從身份驗證中獲取
    const upload = await this.uploadService.createUpload(file, userId);
    return { message: 'File uploaded successfully', upload };
  }

  // Read: 獲取所有上傳記錄
  @Get()
  async getAllUploads() {
    return this.uploadService.getAllUploads();
  }

  // Read: 根據ID獲取上傳記錄
  @Get(':id')
  async getUploadById(@Param('id') id: string) {
    return this.uploadService.getUploadById(id);
  }

  // Update: 更新 processedData
  @Put(':id')
  async updateProcessedData(
    @Param('id') id: string,
    @Body() processedData: Record<string, any>,
  ) {
    const updatedUpload = await this.uploadService.updateProcessedData(id, processedData);
    return { message: 'Processed data updated successfully', updatedUpload };
  }

  // Delete: 刪除上傳記錄
  @Delete(':id')
  async deleteUpload(@Param('id') id: string) {
    await this.uploadService.deleteUpload(id);
    return { message:  { message: 'Upload deleted successfully' }
  }
}

}
