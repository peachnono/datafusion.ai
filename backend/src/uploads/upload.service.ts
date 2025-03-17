import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Upload, UploadDocument } from './upload.schemas';

@Injectable()
export class UploadService {
  constructor(
    @InjectModel(Upload.name) private readonly uploadModel: Model<UploadDocument>
  ) {}

  // ==============================
  //  File Upload Management
  // ==============================

  /**
   * Create a record for a single uploaded file.
   * - Validates allowed file types.
   * - Extracts and processes file content based on file type.
   * 
   * @param file - The uploaded file from Multer.
   * @param userId - The ID of the user uploading the file.
   * @returns The saved UploadDocument object.
   * @throws NotFoundException if the file type is not supported.
   */
  async createUpload(file: Express.Multer.File, userId: string): Promise<UploadDocument> {
    // Define allowed file MIME types
    const allowedMimeTypes = [
      'application/pdf', // PDF
      'application/msword', // Microsoft Word (doc)
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // Microsoft Word (docx)
      'application/vnd.ms-excel', // Microsoft Excel (xls)
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // Microsoft Excel (xlsx)
      'text/plain', // TXT
    ];

    // Validate file MIME type
    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new NotFoundException(`File type "${file.mimetype}" is not allowed. Only PDF, Word, Excel, and TXT files are supported.`);
    }

    // Extract file content based on MIME type
    let fileContent = '';
    if (file.mimetype === 'text/plain') {
      fileContent = file.buffer.toString('utf8'); // Convert TXT file to string
    } else if (file.mimetype === 'application/pdf') {
      // Handle PDF files using pdf-parse library
      const pdfParse = require('pdf-parse');
      const pdfData = await pdfParse(file.buffer);
      fileContent = pdfData.text;
    } else if (
      file.mimetype === 'application/msword' ||
      file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ) {
      // Handle Word files using mammoth library
      const mammoth = require('mammoth');
      const result = await mammoth.extractRawText({ buffer: file.buffer });
      fileContent = result.value;
    } else if (
      file.mimetype === 'application/vnd.ms-excel' ||
      file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ) {
      // Handle Excel files using xlsx library
      const xlsx = require('xlsx');
      const workbook = xlsx.read(file.buffer, { type: 'buffer' });
      const sheetNames = workbook.SheetNames;
      const firstSheet = workbook.Sheets[sheetNames[0]];
      fileContent = xlsx.utils.sheet_to_csv(firstSheet); // Convert sheet to CSV
    } else {
      throw new Error(`Unsupported file type: ${file.mimetype}`);
    }

    console.log("Extracted File Content:", fileContent);

    // Create a new upload record
    const newUpload = new this.uploadModel({
      id: this.generateUniqueId(file.originalname),
      title: file.originalname,
      type: file.mimetype,
      content: file.buffer,
      contentInStr: fileContent,
      uploadedBy: userId,
      processedData: null,
    });
    return newUpload.save(); // Save to database
  }

  // ==============================
  //  CRUD Operations for Uploads
  // ==============================

  /**
   * Fetch all uploaded records from the database.
   * - Optionally, you can select specific fields to include/exclude.
   * @returns An array of UploadDocument objects.
   */
  async getAllUploads(): Promise<UploadDocument[]> {
    return this.uploadModel.find().populate('uploadedBy').exec();
    // Optionally, exclude file contentInStr for large data:
    // return this.uploadModel.find().select('-contentInStr').populate('uploadedBy').exec();
  }

  /**
   * Fetch a specific upload by its ID.
   * @param uploadId - The unique ID of the upload.
   * @returns The UploadDocument object if found.
   * @throws NotFoundException if the upload is not found.
   */
  async getUploadById(uploadId: string): Promise<UploadDocument> {
    const upload = await this.uploadModel.findById(uploadId).populate('uploadedBy').exec();
    if (!upload) {
      throw new NotFoundException(`Upload with ID "${uploadId}" not found`);
    }
    return upload;
  }

  /**
   * Update the processed data for a specific upload.
   * - This is used to save extracted or processed information.
   * @param uploadId - The unique ID of the upload to update.
   * @param processedData - The processed data to update in the record.
   * @returns The updated UploadDocument object.
   * @throws NotFoundException if the upload is not found.
   */
  async updateProcessedData(uploadId: string, processedData: Record<string, any>): Promise<UploadDocument> {
    const upload = await this.getUploadById(uploadId);
    upload.processedData = processedData;
    await upload.save(); // Save updated data
    return upload;
  }

  /**
   * Delete an upload record from the database.
   * @param uploadId - The unique ID of the upload to delete.
   * @throws NotFoundException if the upload is not found.
   */
  async deleteUpload(uploadId: string): Promise<void> {
    const result = await this.uploadModel.findByIdAndDelete(uploadId).exec();
    if (!result) {
      throw new NotFoundException(`Upload with ID "${uploadId}" not found`);
    }
  }

  // ==============================
  //  Utility Methods
  // ==============================

  /**
   * Generate a unique ID for the uploaded file based on the current timestamp and sanitized file name.
   * @param file - The original file name.
   * @returns A unique string ID.
   */
  private generateUniqueId(file: string): string {
    const uploadDate = new Date().toISOString().replace(/[-T:.Z]/g, ''); // Timestamp without special characters
    const sanitizedFileName = file.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9._-]/g, ''); // Remove special characters
    return `${uploadDate}_${sanitizedFileName}`;
  }
}
