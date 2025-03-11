import React, { useState } from 'react';
import { FilePond, registerPlugin } from 'react-filepond';
import 'filepond/dist/filepond.min.css';

interface DocumentUploaderProps {
  onFilesUpdate?: (files: File[]) => void; // Optional callback to pass files up
}

const DocumentUploader: React.FC<DocumentUploaderProps> = ({ onFilesUpdate }) => {
  const [files, setFiles] = useState<File[]>([]);

  return (
    <FilePond
      files={files}
      onupdatefiles={(fileItems) => {
        const newFiles = fileItems.map((fileItem) => fileItem.file as File);
        setFiles(newFiles);
        if (onFilesUpdate) {
          onFilesUpdate(newFiles); // Pass updated files to parent if needed
        }
      }}
      allowMultiple={true}
      maxFiles={3}
      server="/your-server-endpoint" // Adjust this to your actual backend API
    />
  );
};

export default DocumentUploader;
