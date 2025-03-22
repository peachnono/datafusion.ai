import React from 'react';
import './css/DocumentUploadPage.css';
import DocumentUploader from '../components/DocumentUploader';

const DocumentUploadPage: React.FC = () => {
  return (
    <div>
      <h1>Upload Documents To Be Analysed</h1>
        <div className="filepond-container">
          <DocumentUploader />
        </div>
    </div>
  );
};

export default DocumentUploadPage;
