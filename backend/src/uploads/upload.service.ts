import { Injectable, NotFoundException, PipeTransform, ArgumentMetadata } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';
import { Upload, UploadDocument } from './upload.schemas';

@Injectable()
export class UploadService {
    constructor(
        @InjectModel(Upload.name) private readonly uploadModel: Model<UploadDocument>
      ) {}
      // define the allow upload file types

        
      // Create record for the upload file-Single file.
      // TODO: limit file types: pdf, word, excel, txt
      async createUpload(file: Express.Multer.File, userId: string): Promise<UploadDocument> {
        const allowedMimeTypes = [
          'application/pdf',               // PDF
          'application/msword',            // Microsoft Word (doc)
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // Microsoft Word (docx)
          'application/vnd.ms-excel',      // Microsoft Excel (xls)
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // Microsoft Excel (xlsx)
          'text/plain',                    // TXT
        ];
        // check if the upoads type is allow
        if (!allowedMimeTypes.includes(file.mimetype)) {
          throw new NotFoundException(`File type "${file.mimetype}" is not allowed. Only PDF, Word, Excel, and TXT files are supported.`);
        }
        // This section is to transform the file content from binary into String, 
        // methods varies by file types 
        let fileContent = '';
        if (file.mimetype === 'text/plain') {
          fileContent = file.buffer.toString('utf8'); // txt file to String
        }
        console.log("This is the content:"+fileContent);
        
        const newUpload = new this.uploadModel({
          id: this.generateUniqueId(file.originalname),
          title: file.originalname,
          type: file.mimetype,
          content: file.buffer,
          contentInStr: fileContent,
          uploadedBy: userId,
        });
        return newUpload.save(); // save to the DB
      }
    
    
      // Read: Search all upload records: tested
      async getAllUploads(): Promise<UploadDocument[]> {
        return this.uploadModel.find().populate('uploadedBy').exec();
        // return this.uploadModel.find().select('-contentInStr').populate('uploadedBy').exec(); // optional select('-content') if want to display filecontentStr,
      }
    
      // Read: Search record by ID: tested
      async getUploadById(uploadId: string): Promise<UploadDocument> {
        const upload = await this.uploadModel.findById(uploadId).populate('uploadedBy').exec();
        if (!upload) {
          throw new NotFoundException(`Upload with ID "${uploadId}" not found`);
        }
        console.log('file type:' + upload);
        return upload;
      }

    
      // Update: update processedData
      async updateProcessedData(uploadId: string, processedData: Record<string, any>): Promise<UploadDocument> {
        const upload = await this.getUploadById(uploadId); 
        upload.processedData = processedData;
        return upload.save(); // save update data
      }
    
      // Delete upload record: tested
      async deleteUpload(uploadId: string): Promise<void> {
        const result = await this.uploadModel.findByIdAndDelete(uploadId).exec();
        if (!result) {
          throw new NotFoundException(`Upload with ID "${uploadId}" not found`);
        }
      }
    
      // Generate id for the upload reocrd object   
        private generateUniqueId(file: string): string {
          const uploadDate = new Date().toISOString().replace(/[-T:.Z]/g, ''); 
          const sanitizedFileName = file.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9._-]/g, ''); // remove special charaters
          return `${uploadDate}_${sanitizedFileName}`;
      }
}
