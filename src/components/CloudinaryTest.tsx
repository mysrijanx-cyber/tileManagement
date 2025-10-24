import React, { useState } from 'react';
import { validateCloudinaryConfig, debugCloudinaryConfig } from '../lib/cloudinaryConfig';
import { uploadToCloudinary } from '../utils/cloudinaryUtils';

export const CloudinaryTest: React.FC = () => {
  const [testResult, setTestResult] = useState<string>('');
  const [uploading, setUploading] = useState(false);

  const runTest = async () => {
    setTestResult('Running tests...\n');
    
    // Test 1: Configuration
    const configValid = validateCloudinaryConfig();
    setTestResult(prev => prev + `Config valid: ${configValid ? '✅' : '❌'}\n`);
    
    // Test 2: Debug info
    debugCloudinaryConfig();
    
    setTestResult(prev => prev + 'Test completed!\n');
  };

  const testUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const url = await uploadToCloudinary(file, 'test');
      setTestResult(prev => prev + `Upload successful: ${url}\n`);
    } catch (error: any) {
      setTestResult(prev => prev + `Upload failed: ${error.message}\n`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h3 className="text-lg font-bold mb-4">Cloudinary Test</h3>
      
      <button
        onClick={runTest}
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Test Configuration
      </button>

      <div className="mb-4">
        <input
          type="file"
          accept="image/*"
          onChange={testUpload}
          disabled={uploading}
          className="mb-2"
        />
        {uploading && <p>Uploading...</p>}
      </div>

      <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
        {testResult}
      </pre>
    </div>
  );
};