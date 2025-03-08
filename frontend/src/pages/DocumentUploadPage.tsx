import React from 'react';
import Navbar from '../components/Navbar';
import DocumentUploader from '../components/DocumentUploader';

const DocumentUploadPage: React.FC = () => {
  return (
    <div>
      <h1>Upload Documents</h1>
      <DocumentUploader />
    </div>
  );
};

export default DocumentUploadPage;
