import { Test, TestingModule } from '@nestjs/testing';
import { UploadService } from './upload.service';
import { getModelToken } from '@nestjs/mongoose';
import { NotFoundException } from '@nestjs/common';

import { Upload } from './upload.schemas';
import { Model } from 'mongoose';
import pdfParse from 'pdf-parse';

jest.mock('pdf-parse', () => jest.fn(() => Promise.resolve({ text: 'Mocked PDF content' })));

describe('UploadService - getAllUploads', () => {
  let service: UploadService;
  let mockModel: any; // Use 'any' for dynamic mocking
  let uploadModel: Model<Upload>;

  beforeEach(async () => {
    const mockSavedUpload = {
      id: '1',
      title: 'TestFile.txt',
      type: 'text/plain',
      content: 'Sample content',
      uploadedBy: 'user123',
      save: jest.fn().mockResolvedValue(this), // 模擬 save 方法
    };

    mockModel = {
      create: jest.fn().mockResolvedValue(mockSavedUpload), 
      find: jest.fn().mockReturnThis(), // Chainable method
      populate: jest.fn().mockReturnThis(), // Chainable method
      exec: jest.fn().mockResolvedValue([
        {
          id: '1',
          title: 'TestFile1.txt',
          type: 'text/plain',
          content: 'Test content',
          uploadedBy: 'user123',
        },

        {
          id: '2',
          title: 'TestFile2.pdf',
          type: 'application/pdf',
          content: 'PDF content',
          uploadedBy: 'user456',
        },
      ]), // Mock resolved value
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UploadService,
        {
          provide: getModelToken('Upload'), // Mock Mongoose model
          useValue: mockModel,
        },
      ],
    }).compile();

    service = module.get<UploadService>(UploadService);
    uploadModel = module.get<Model<Upload>>(getModelToken(Upload.name)); // new
  });

// Test 
it('should create and save a new upload for a valid file type', async () => {
  // 模擬傳入的文件
  const mockFile = {
    originalname: 'test.pdf',
    mimetype: 'application/pdf',
    buffer: Buffer.from('test buffer content'),
  } as Express.Multer.File;

  const mockUserId = 'user123';

  // 模擬 uploadModel 保存操作
  const mockSavedUpload = {
    id: 'unique-id',
    title: mockFile.originalname,
    type: mockFile.mimetype,
    content: mockFile.buffer,
    contentInStr: 'parsed content',
    uploadedBy: mockUserId,
    processedData: null,
    save: jest.fn().mockResolvedValue(this), // 假設 save 返回自身
  };
  jest.spyOn(uploadModel, 'create').mockReturnValue(mockSavedUpload as any);
  jest.spyOn(mockSavedUpload, 'save').mockResolvedValue(mockSavedUpload as any);

  // 執行方法
  const result = await service.createUpload(mockFile, mockUserId);

  // 驗證數據是否正確保存
  expect(uploadModel.create).toHaveBeenCalledWith({
    id: expect.any(String),
    title: mockFile.originalname,
    type: mockFile.mimetype,
    content: mockFile.buffer,
    contentInStr: 'parsed content', // 文件內容模擬處理
    uploadedBy: mockUserId,
    processedData: null,
  });
  expect(mockSavedUpload.save).toHaveBeenCalled();
  expect(result).toEqual(mockSavedUpload);
});

it('should throw an error for unsupported file types', async () => {
  // 模擬不被支持的文件類型
  const mockFile = {
    originalname: 'unsupported.file',
    mimetype: 'application/unsupported',
    buffer: Buffer.from('test buffer content'),
  } as Express.Multer.File;

  const mockUserId = 'user123';

  // 驗證是否拋出錯誤
  await expect(service.createUpload(mockFile, mockUserId)).rejects.toThrow(
    new NotFoundException(`File type "${mockFile.mimetype}" is not allowed. Only PDF, Word, Excel, and TXT files are supported.`),
  );
});

  
// Test getAllUploads()
  it('should return all uploads', async () => {
    const result = await service.getAllUploads();

    // Check that mocked methods were called in the correct order
    expect(mockModel.find).toHaveBeenCalled();
    expect(mockModel.populate).toHaveBeenCalledWith('uploadedBy');
    expect(mockModel.exec).toHaveBeenCalled();

    // Verify the returned data
    expect(result).toHaveLength(2); // Ensure two items are returned
    expect(result[0]).toEqual(
      expect.objectContaining({
        id: '1',
        title: 'TestFile1.txt',
        type: 'text/plain',
        uploadedBy: 'user123',
      })
    );
    expect(result[1]).toEqual(
      expect.objectContaining({
        id: '2',
        title: 'TestFile2.pdf',
        type: 'application/pdf',
        uploadedBy: 'user456',
      })
    );
  });

//*** Test getUploadById()
it('should return the upload record by ID', async () => {
  const mockUpload = {
    id: '12345',
    title: 'TestFile.pdf',
    type: 'application/pdf',
    content: 'PDF content',
    uploadedBy: 'user123',
  };

  // 模擬 findById().populate().exec() 返回 mockUpload
  mockModel.findById = jest.fn().mockReturnThis();
  mockModel.populate = jest.fn().mockReturnThis();
  mockModel.exec = jest.fn().mockResolvedValue(mockUpload);

  const result = await service.getUploadById('12345');

  // 驗證方法是否正確執行
  expect(mockModel.findById).toHaveBeenCalledWith('12345'); // 確保 findById 用於查詢正確的 ID
  expect(mockModel.populate).toHaveBeenCalledWith('uploadedBy'); // 確保 populate 查詢關聯字段
  expect(mockModel.exec).toHaveBeenCalled(); // 確保執行查詢
  expect(result).toEqual(mockUpload); // 驗證返回的資料是否正確
});

it('should throw NotFoundException if no record is found', async () => {
  // 模擬 findById().populate().exec() 返回 null（記錄不存在）
  mockModel.findById = jest.fn().mockReturnThis();
  mockModel.populate = jest.fn().mockReturnThis();
  mockModel.exec = jest.fn().mockResolvedValue(null);

  // 驗證方法是否拋出 NotFoundException
  await expect(service.getUploadById('nonexistentId')).rejects.toThrow(
    new NotFoundException(`Upload with ID "nonexistentId" not found`),
  );

  // 驗證查詢方法被正確呼叫
  expect(mockModel.findById).toHaveBeenCalledWith('nonexistentId');
  expect(mockModel.populate).toHaveBeenCalledWith('uploadedBy');
  expect(mockModel.exec).toHaveBeenCalled();
});



//*** Test findByIdAndDelete() 
it('should delete the upload record by ID', async () => {
  const mockResult = {
    id: '12345',
    title: 'TestFile.pdf',
    type: 'application/pdf',
    content: 'PDF content',
    uploadedBy: 'user123',
  };

  // 模擬 findByIdAndDelete().exec() 返回 mockResult
  mockModel.findByIdAndDelete = jest.fn().mockReturnThis();
  mockModel.exec = jest.fn().mockResolvedValue(mockResult);

  await service.deleteUpload('12345');

  // 驗證方法是否正確執行
  expect(mockModel.findByIdAndDelete).toHaveBeenCalledWith('12345');
  expect(mockModel.exec).toHaveBeenCalled();
});

it('should throw NotFoundException if no record is found during delete', async () => {
  // 模擬 findByIdAndDelete().exec() 返回 null（記錄不存在）
  mockModel.findByIdAndDelete = jest.fn().mockReturnThis();
  mockModel.exec = jest.fn().mockResolvedValue(null);

  // 驗證是否正確拋出 NotFoundException
  await expect(service.deleteUpload('nonexistentId')).rejects.toThrow(
    new NotFoundException(`Upload with ID "nonexistentId" not found`),
  );

  // 驗證方法是否被正確呼叫
  expect(mockModel.findByIdAndDelete).toHaveBeenCalledWith('nonexistentId');
  expect(mockModel.exec).toHaveBeenCalled();
});


//***** Test updateProcessedData()
it('should update the processedData of an upload', async () => {
let mockUpload: any;

  mockUpload = {
    id: '12345',
    title: 'TestFile.pdf',
    type: 'application/pdf',
    content: 'PDF content',
    uploadedBy: 'user123',
    processedData: null,
    save: jest.fn().mockResolvedValue(mockUpload), // 確保返回 mockUpload
  };

  jest.spyOn(service, 'getUploadById').mockResolvedValue(mockUpload as any);

  const newProcessedData = { key728: 'value728' };
  const result = await service.updateProcessedData('12345', newProcessedData);

  // 確保 processedData 正確更新
  expect(mockUpload.processedData).toEqual(newProcessedData);
  // 確保 save 方法被呼叫
  expect(mockUpload.save).toHaveBeenCalled();
  // 確保返回的是更新後的物件
  expect(result).toEqual(mockUpload);
});

});