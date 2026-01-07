
import React, { useState, useRef } from 'react';
import {
  Upload, Download, CheckCircle, AlertCircle, Loader, X,
  Image as ImageIcon, FileSpreadsheet, Info, AlertTriangle,
  Trash2, Eye, Copy, ChevronDown, ChevronUp, Pause, Play,
  RefreshCw, ZoomIn, Package
} from 'lucide-react';
import { useAppStore } from '../stores/appStore';
import * as XLSX from 'xlsx';
import { uploadTile, updateTileQRCode } from '../lib/firebaseutils';
import { generateTileQRCode } from '../utils/qrCodeUtils';



const CLOUDINARY_CONFIG = {
  cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'drql2uiha',
  uploadPreset: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'tile_uploads',
  apiUrl: `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'drql2uiha'}/image/upload`
};
// ==========================================
// TYPESCRIPT INTERFACES
// ==========================================

interface ExcelUploadProps {
  onUploadComplete?: () => void;
}

interface UploadedImage {
  filename: string;
  url: string;
  publicId: string;
  size: number;
  uploadedAt: string;
}

interface FileValidationError {
  filename: string;
  reason: string;
}

interface UploadProgress {
  total: number;
  completed: number;
  currentFile: string;
  percentage: number;
  speed: number;
  eta: number;
}

interface FailedUpload {
  file: File;
  error: string;
  retryCount: number;
}

interface ExcelRow {
  'Tile Name': string;
  'Surface Name': string;
  'Material Name': string;
  'Category': string;
  'Tile URL': string;
  'Size': string;
  'Code': string;
  'Price': number | string;
  'Quantity': number | string;
}

interface ParsedTileData {
  name: string;
  surfaceName: string;
  materialName: string;
  category: string;
  imageUrl: string;
  size: string;
  tileCode: string;
  price: number;
  stock: number;
}

interface ProcessResults {
  successful: any[];
  failed: Array<{
    row: number;
    data: any;
    error: string;
  }>;
  qrGenerated: number;
  qrFailed: number;
}

// ==========================================
// MAIN COMPONENT
// ==========================================

export const ExcelUpload: React.FC<ExcelUploadProps> = ({ onUploadComplete }) => {
  const { currentUser } = useAppStore();

  // ===== STATE MANAGEMENT =====
  
  // Step 1: Bulk Image Upload States
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress>({
    total: 0,
    completed: 0,
    currentFile: '',
    percentage: 0,
    speed: 0,
    eta: 0
  });
  const [imageErrors, setImageErrors] = useState<FileValidationError[]>([]);
  const [failedUploads, setFailedUploads] = useState<FailedUpload[]>([]);

  // Step 2: Excel Processing States
  const [isProcessing, setIsProcessing] = useState(false);
  const [processProgress, setProcessProgress] = useState(0);
  const [processStage, setProcessStage] = useState('');
  const [processResult, setProcessResult] = useState<{
    success: number;
    errors: string[];
    details?: ProcessResults;
  } | null>(null);

  // UI States
  const [activeSection, setActiveSection] = useState<'upload' | 'process'>('upload');
  const [showInstructions, setShowInstructions] = useState(true);
  const [showUploadedLibrary, setShowUploadedLibrary] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // Refs
  const imageInputRef = useRef<HTMLInputElement>(null);
  const excelInputRef = useRef<HTMLInputElement>(null);
  const uploadStartTimeRef = useRef<number>(0);
  const uploadedBytesRef = useRef<number>(0);
  const pauseRequestRef = useRef<boolean>(false);

  // ==========================================
  // UTILITY FUNCTIONS
  // ==========================================

  const validateImageFile = (file: File): FileValidationError | null => {
    const allowedFormats = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!allowedFormats.includes(file.type)) {
      return {
        filename: file.name,
        reason: `Invalid format. Only JPG, PNG, WEBP allowed.`
      };
    }

    if (file.size > maxSize) {
      return {
        filename: file.name,
        reason: `File too large (${(file.size / 1024 / 1024).toFixed(2)}MB). Max 10MB.`
      };
    }

    if (file.size === 0) {
      return {
        filename: file.name,
        reason: 'File is empty (0 bytes).'
      };
    }

    return null;
  };

  const uploadToCloudinary = (
    file: File,
    userId: string,
    onProgress?: (percent: number, loaded: number) => void
  ): Promise<{ url: string; publicId: string }> => {
    return new Promise((resolve, reject) => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', CLOUDINARY_CONFIG.uploadPreset);
      formData.append('folder', `tiles/${userId}/images`);

      const timestamp = Date.now();
      const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9-_]/g, '_');
      formData.append('public_id', `${timestamp}-${cleanName}`);

      const xhr = new XMLHttpRequest();

      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable && onProgress) {
          const percent = Math.round((e.loaded / e.total) * 100);
          onProgress(percent, e.loaded);
        }
      });

      xhr.addEventListener('load', () => {
        if (xhr.status === 200) {
          try {
            const response = JSON.parse(xhr.responseText);
            resolve({
              url: response.secure_url,
              publicId: response.public_id
            });
          } catch (error) {
            reject(new Error('Invalid response from Cloudinary'));
          }
        } else {
          reject(new Error(`Upload failed with status ${xhr.status}`));
        }
      });

      xhr.addEventListener('error', () => {
        reject(new Error('Network error during upload'));
      });

      xhr.addEventListener('timeout', () => {
        reject(new Error('Upload timeout'));
      });

      xhr.timeout = 120000; // 2 minutes
      xhr.open('POST', CLOUDINARY_CONFIG.apiUrl);
      xhr.send(formData);
    });
  };

  const uploadWithRetry = async (
    file: File,
    userId: string,
    maxRetries: number = 3,
    onProgress?: (percent: number, loaded: number) => void
  ): Promise<{ url: string; publicId: string }> => {
    let lastError: Error | null = null;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const result = await uploadToCloudinary(file, userId, onProgress);
        return result;
      } catch (error: any) {
        lastError = error;
        if (attempt < maxRetries) {
          const delay = Math.pow(2, attempt - 1) * 1000;
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }

    throw lastError || new Error('Upload failed after all retries');
  };

  const generateTileCode = (index: number): string => {
    const timestamp = Date.now().toString().slice(-4);
    const indexStr = index.toString().padStart(3, '0');
    return `TILE${timestamp}${indexStr}`;
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const formatTime = (seconds: number): string => {
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}m ${secs}s`;
  };

  const calculateProgress = (completedFiles: number, totalFiles: number, uploadedBytes: number) => {
    const elapsedTime = (Date.now() - uploadStartTimeRef.current) / 1000;
    const speed = elapsedTime > 0 ? uploadedBytes / elapsedTime / (1024 * 1024) : 0;

    const totalBytes = selectedImages.reduce((sum, f) => sum + f.size, 0);
    const remainingBytes = totalBytes - uploadedBytes;
    const eta = speed > 0 ? remainingBytes / (speed * 1024 * 1024) : 0;

    return {
      percentage: totalFiles > 0 ? Math.round((completedFiles / totalFiles) * 100) : 0,
      speed: Math.round(speed * 100) / 100,
      eta: Math.round(eta)
    };
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      alert('✅ URL copied!');
    } catch (err) {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        alert('✅ URL copied!');
      } catch (e) {
        alert('❌ Failed to copy');
      }
      document.body.removeChild(textArea);
    }
  };

  // ==========================================
  // STEP 1: BULK IMAGE UPLOAD HANDLERS
  // ==========================================

  const handleImageSelection = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const filesArray = Array.from(files);
    const errors: FileValidationError[] = [];
    const validFiles: File[] = [];

    filesArray.forEach(file => {
      const error = validateImageFile(file);
      if (error) {
        errors.push(error);
      } else {
        validFiles.push(file);
      }
    });

    setSelectedImages(validFiles);
    setImageErrors(errors);

    console.log(`✅ Selected ${validFiles.length} valid images`);
    if (errors.length > 0) {
      console.warn(`⚠️ ${errors.length} invalid images skipped`);
    }
  };

  const handleBulkUpload = async () => {
    if (!currentUser?.user_id) {
      alert('❌ Please log in to upload files');
      return;
    }

    if (selectedImages.length === 0) {
      alert('❌ Please select at least one image');
      return;
    }

    if (!CLOUDINARY_CONFIG.cloudName || !CLOUDINARY_CONFIG.uploadPreset) {
      alert('❌ Cloudinary not configured. Please contact administrator.');
      return;
    }

    setIsUploading(true);
    setIsPaused(false);
    pauseRequestRef.current = false;
    setFailedUploads([]);

    const uploadedImgs: UploadedImage[] = [];
    const failed: FailedUpload[] = [];
    const totalFiles = selectedImages.length;
    let completedFiles = 0;

    uploadStartTimeRef.current = Date.now();
    uploadedBytesRef.current = 0;

    try {
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('📦 CLOUDINARY BULK UPLOAD START');
      console.log(`📸 Total images: ${totalFiles}`);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

      for (let i = 0; i < selectedImages.length; i++) {
        while (pauseRequestRef.current) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }

        const file = selectedImages[i];

        try {
          setUploadProgress(prev => ({
            ...prev,
            total: totalFiles,
            completed: completedFiles,
            currentFile: file.name,
            ...calculateProgress(completedFiles, totalFiles, uploadedBytesRef.current)
          }));

          console.log(`📤 [${i + 1}/${totalFiles}] Uploading: ${file.name}`);

          const { url, publicId } = await uploadWithRetry(
            file,
            currentUser.user_id,
            3,
            (percent, loaded) => {
              const previousLoaded = uploadedBytesRef.current % file.size;
              uploadedBytesRef.current = uploadedBytesRef.current - previousLoaded + loaded;
            }
          );

          uploadedImgs.push({
            filename: file.name,
            url: url,
            publicId: publicId,
            size: file.size,
            uploadedAt: new Date().toISOString()
          });

          uploadedBytesRef.current = uploadedBytesRef.current - (uploadedBytesRef.current % file.size) + file.size;
          completedFiles++;

          console.log(`✅ Upload successful: ${file.name}`);

        } catch (error: any) {
          failed.push({
            file,
            error: error.message || 'Unknown error',
            retryCount: 0
          });
          console.error(`❌ Upload failed: ${file.name} - ${error.message}`);
        }

        await new Promise(resolve => setTimeout(resolve, 300));
      }

      setUploadedImages(uploadedImgs);
      setFailedUploads(failed);

      setUploadProgress({
        total: totalFiles,
        completed: completedFiles,
        currentFile: '',
        percentage: 100,
        speed: 0,
        eta: 0
      });

      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log(`✅ Upload complete: ${uploadedImgs.length}/${totalFiles}`);
      console.log(`❌ Failed: ${failed.length}`);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

      setSelectedImages([]);
      if (imageInputRef.current) imageInputRef.current.value = '';

      if (failed.length === 0) {
        alert(`🎉 Upload Successful!\n\n✅ ${uploadedImgs.length} images uploaded\n\nNext: Download Excel and fill details!`);
      } else {
        alert(`⚠️ Upload Completed\n\n✅ Successful: ${uploadedImgs.length}\n❌ Failed: ${failed.length}`);
      }

      setShowUploadedLibrary(true);

    } catch (error: any) {
      console.error('❌ Bulk upload failed:', error);
      alert(`❌ Upload failed: ${error.message}`);
    } finally {
      setIsUploading(false);
      setIsPaused(false);
      pauseRequestRef.current = false;
    }
  };

  const handleDownloadExcel = () => {
    if (uploadedImages.length === 0) {
      alert('❌ No uploaded images found. Please upload images first.');
      return;
    }

    try {
      console.log('📥 Generating Excel file...');

      const excelData: ExcelRow[] = uploadedImages.map((img, index) => ({
        'Tile Name': '',
        'Surface Name': '',
        'Material Name': '',
        'Category': '',
        'Tile URL': img.url,
        'Size': '',
        'Code': generateTileCode(index),
        'Price': '',
        'Quantity': ''
      }));

      const ws = XLSX.utils.json_to_sheet(excelData);

      ws['!cols'] = [
        { wch: 30 }, // Tile Name
        { wch: 20 }, // Surface Name
        { wch: 20 }, // Material Name
        { wch: 15 }, // Category
        { wch: 70 }, // Tile URL
        { wch: 15 }, // Size
        { wch: 15 }, // Code
        { wch: 12 }, // Price
        { wch: 12 }  // Quantity
      ];

      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Tiles Data');

      const timestamp = Date.now();
      const filename = `tiles-upload-${timestamp}.xlsx`;

      XLSX.writeFile(wb, filename);

      console.log(`✅ Excel downloaded: ${filename}`);
      alert(`📥 Excel Downloaded!\n\n📊 ${uploadedImages.length} tiles ready\n\nNext Steps:\n1. Open Excel\n2. Fill: Tile Name, Surface Name, Material Name, Category, Size, Price, Quantity\n3. Category: floor/wall/bathroom/kitchen\n4. Save file\n5. Upload in "Process Excel" section`);

    } catch (error) {
      console.error('❌ Excel generation failed:', error);
      alert('❌ Failed to generate Excel. Please try again.');
    }
  };

  const retryFailedUploads = async () => {
    if (failedUploads.length === 0 || !currentUser?.user_id) return;

    setIsUploading(true);
    const remainingFailed: FailedUpload[] = [];
    let retrySuccessCount = 0;

    for (const failed of failedUploads) {
      try {
        const { url, publicId } = await uploadWithRetry(
          failed.file,
          currentUser.user_id,
          3
        );

        const newImage: UploadedImage = {
          filename: failed.file.name,
          url,
          publicId,
          size: failed.file.size,
          uploadedAt: new Date().toISOString()
        };

        setUploadedImages(prev => [...prev, newImage]);
        retrySuccessCount++;

      } catch (error: any) {
        remainingFailed.push({
          ...failed,
          retryCount: failed.retryCount + 1,
          error: error.message
        });
      }
    }

    setFailedUploads(remainingFailed);
    setIsUploading(false);

    if (remainingFailed.length === 0) {
      alert(`✅ All ${retrySuccessCount} failed uploads retried successfully!`);
    } else {
      alert(`⚠️ Retry complete:\n✅ ${retrySuccessCount} successful\n❌ ${remainingFailed.length} still failed`);
    }
  };

  const handleTogglePause = () => {
    pauseRequestRef.current = !pauseRequestRef.current;
    setIsPaused(pauseRequestRef.current);
  };

  const handleClearUploaded = () => {
    if (!confirm(`🗑️ Clear ${uploadedImages.length} uploaded images?\n\nNote: Files remain in Cloudinary.`)) return;

    setUploadedImages([]);
    setSelectedImages([]);
    setImageErrors([]);
    setFailedUploads([]);
    setShowUploadedLibrary(false);
    if (imageInputRef.current) imageInputRef.current.value = '';

    console.log('🧹 Uploaded images cleared');
  };

  // ==========================================
  // STEP 2: EXCEL PROCESSING HANDLERS
  // ==========================================

  const readExcelFile = async (file: File): Promise<ParsedTileData[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        try {
          const data = e.target?.result;
          const workbook = XLSX.read(data, { type: 'binary' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json<ExcelRow>(worksheet);

          const parsedData: ParsedTileData[] = jsonData.map((row, index) => ({
            name: String(row['Tile Name'] || '').trim(),
            surfaceName: String(row['Surface Name'] || '').trim(),
            materialName: String(row['Material Name'] || '').trim(),
            category: String(row['Category'] || 'floor').trim().toLowerCase(),
            imageUrl: String(row['Tile URL'] || '').trim(),
            size: String(row['Size'] || '').trim(),
            tileCode: String(row['Code'] || '').trim(),
            price: Number(row['Price']) || 0,
            stock: Number(row['Quantity']) || 0
          }));

          resolve(parsedData);
        } catch (error: any) {
          reject(new Error(`Failed to parse Excel: ${error.message}`));
        }
      };

      reader.onerror = () => {
        reject(new Error('Failed to read file'));
      };

      reader.readAsBinaryString(file);
    });
  };

  const validateTileData = (tilesData: ParsedTileData[]) => {
    const valid: ParsedTileData[] = [];
    const errors: string[] = [];
    const validCategories = ['floor', 'wall', 'bathroom', 'kitchen'];

    tilesData.forEach((tile, index) => {
      const rowNumber = index + 2;
      const rowErrors: string[] = [];

      if (!tile.name) rowErrors.push('Tile Name required');
      if (!tile.surfaceName) rowErrors.push('Surface Name required');
      if (!tile.materialName) rowErrors.push('Material Name required');
      if (!tile.category) rowErrors.push('Category required');
      if (tile.category && !validCategories.includes(tile.category)) {
        rowErrors.push(`Category must be: ${validCategories.join(', ')}`);
      }
      if (!tile.imageUrl) rowErrors.push('Tile URL required');
      if (!tile.imageUrl.startsWith('http')) rowErrors.push('Invalid URL format');
      if (!tile.size) rowErrors.push('Size required');
      if (!tile.tileCode) rowErrors.push('Code required');
      if (!tile.price || tile.price <= 0) rowErrors.push('Valid price required');
      if (tile.stock < 0) rowErrors.push('Quantity cannot be negative');

      if (rowErrors.length > 0) {
        errors.push(`Row ${rowNumber}: ${rowErrors.join(', ')}`);
      } else {
        valid.push(tile);
      }
    });

    return { valid, errors };
  };

  const processExcelUpload = async (tilesData: ParsedTileData[]): Promise<ProcessResults> => {
    const totalTiles = tilesData.length;
    const results: ProcessResults = {
      successful: [],
      failed: [],
      qrGenerated: 0,
      qrFailed: 0
    };

    for (let i = 0; i < totalTiles; i++) {
      const tileData = tilesData[i];

      try {
        setProcessStage(`Uploading tile ${i + 1}/${totalTiles}: ${tileData.name}`);

        const tile = {
          name: tileData.name,
          surfaceName: tileData.surfaceName,
          materialName: tileData.materialName,
          category: tileData.category as 'floor' | 'wall' | 'bathroom' | 'kitchen',
          size: tileData.size,
          price: tileData.price,
          stock: tileData.stock,
          inStock: tileData.stock > 0,
          imageUrl: tileData.imageUrl,
          textureUrl: '',
          tileCode: tileData.tileCode,
          sellerId: currentUser?.user_id,
          showroomId: currentUser?.user_id,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        const savedTile = await uploadTile(tile);

        if (!savedTile?.id) {
          throw new Error('Upload failed - no tile ID returned');
        }

        // Generate QR Code
        try {
          const qrCode = await generateTileQRCode(savedTile);
          if (qrCode && qrCode.startsWith('data:image')) {
            await updateTileQRCode(savedTile.id, qrCode);
            results.qrGenerated++;
          } else {
            throw new Error('Invalid QR code');
          }
        } catch (qrError: any) {
          results.qrFailed++;
          console.warn(`⚠️ QR generation failed for ${tileData.name}`);
        }

        results.successful.push(savedTile);

      } catch (error: any) {
        results.failed.push({
          row: i + 2,
          data: tileData,
          error: error.message || 'Unknown error'
        });
      }

      const progress = Math.round(((i + 1) / totalTiles) * 100);
      setProcessProgress(progress);

      await new Promise(resolve => setTimeout(resolve, 100));
    }

    return results;
  };

  const handleExcelUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!currentUser) {
      alert('❌ Please log in to upload');
      return;
    }

    const fileExtension = file.name.toLowerCase().split('.').pop();
    if (!['xlsx', 'xls'].includes(fileExtension || '')) {
      alert('❌ Invalid file. Please select Excel (.xlsx or .xls)');
      return;
    }

    setIsProcessing(true);
    setProcessResult(null);
    setProcessProgress(0);
    setProcessStage('');

    try {
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('📊 EXCEL PROCESSING START');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

      // Read Excel
      setProcessStage('Reading Excel file...');
      setProcessProgress(10);
      const tilesData = await readExcelFile(file);

      if (!tilesData || tilesData.length === 0) {
        throw new Error('No data found in Excel file');
      }

      console.log(`✅ Read ${tilesData.length} rows`);

      // Validate
      setProcessStage('Validating data...');
      setProcessProgress(20);
      const { valid, errors: validationErrors } = validateTileData(tilesData);

      console.log(`✅ Valid: ${valid.length}, Errors: ${validationErrors.length}`);

      if (valid.length === 0) {
        throw new Error(`No valid tiles found.\n\n${validationErrors.slice(0, 5).join('\n')}`);
      }

      // Process
      setProcessStage('Processing tiles...');
      const results = await processExcelUpload(valid);

      setProcessProgress(100);
      setProcessStage('Complete!');

      // Build error messages
      const errorMessages: string[] = [];

      if (validationErrors.length > 0) {
        errorMessages.push(`⚠️ Validation Issues (${validationErrors.length}):`);
        errorMessages.push(...validationErrors.slice(0, 10));
        if (validationErrors.length > 10) {
          errorMessages.push(`... and ${validationErrors.length - 10} more`);
        }
        errorMessages.push('');
      }

      if (results.failed.length > 0) {
        errorMessages.push(`❌ Upload Failures (${results.failed.length}):`);
        results.failed.slice(0, 10).forEach(fail => {
          errorMessages.push(`Row ${fail.row}: ${fail.error}`);
        });
        if (results.failed.length > 10) {
          errorMessages.push(`... and ${results.failed.length - 10} more`);
        }
        errorMessages.push('');
      }

      if (results.qrFailed > 0) {
        errorMessages.push(`⚠️ QR Generation: ${results.qrFailed} failed (can be regenerated later)`);
      }

      setProcessResult({
        success: results.successful.length,
        errors: errorMessages,
        details: results
      });

      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log(`✅ Success: ${results.successful.length}`);
      console.log(`📱 QR Generated: ${results.qrGenerated}`);
      console.log(`❌ Failed: ${results.failed.length}`);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

      if (results.successful.length > 0 && onUploadComplete) {
        onUploadComplete();
      }

      if (results.failed.length === 0 && validationErrors.length === 0) {
        alert(`🎉 Success!\n\n✅ ${results.successful.length} tiles added\n📱 ${results.qrGenerated} QR codes generated`);
      } else {
        alert(`⚠️ Completed with warnings\n\n✅ Success: ${results.successful.length}\n❌ Issues: ${validationErrors.length + results.failed.length}`);
      }

    } catch (error: any) {
      console.error('❌ Excel processing failed:', error);
      setProcessResult({
        success: 0,
        errors: [error.message || 'Processing failed']
      });
      alert(`❌ Processing failed:\n\n${error.message}`);
    } finally {
      setIsProcessing(false);
      setProcessStage('');
      if (excelInputRef.current) excelInputRef.current.value = '';
      setTimeout(() => setProcessProgress(0), 1000);
    }
  };

  const handleClearResult = () => {
    setProcessResult(null);
  };

  // ==========================================
  // RENDER
  // ==========================================

  const isCloudinaryConfigured = CLOUDINARY_CONFIG.cloudName && CLOUDINARY_CONFIG.uploadPreset;

  return (
    <div className="min-h-screen bg-gray-50 p-2 sm:p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
        
        {/* ===== HEADER ===== */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 text-white shadow-xl">
          <div className="flex items-start gap-3 sm:gap-4">
            <Package className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2">
                📦 Bulk Tile Upload System
              </h1>
              <p className="text-blue-100 text-xs sm:text-sm md:text-base mb-3 sm:mb-4">
                Upload images to Cloudinary → Generate Excel → Fill details → Process & publish
              </p>
              
              <button
                onClick={() => setShowInstructions(!showInstructions)}
                className="text-white hover:text-blue-200 text-xs sm:text-sm font-medium transition-colors"
              >
                {showInstructions ? '▲ Hide' : '▼ Show'} Instructions
              </button>

              {showInstructions && (
                <div className="mt-4 bg-white/10 backdrop-blur rounded-lg p-3 sm:p-4 space-y-2 text-xs sm:text-sm">
                  <p className="font-semibold">📋 Complete Flow:</p>
                  <ol className="space-y-1.5 ml-4 list-decimal">
                    <li><strong>Upload Images:</strong> Select tile photos → Upload to Cloudinary CDN</li>
                    <li><strong>Download Excel:</strong> Get pre-filled template with image URLs</li>
                    <li><strong>Fill Details:</strong> Add Name, Surface, Material, Category, Size, Price, Quantity</li>
                    <li><strong>Process Excel:</strong> Upload completed Excel → Tiles auto-published</li>
                    <li><strong>View Dashboard:</strong> All tiles appear with QR codes ready!</li>
                  </ol>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Configuration Warning */}
        {!isCloudinaryConfigured && (
          <div className="bg-red-50 border-2 border-red-300 rounded-lg sm:rounded-xl p-3 sm:p-4">
            <div className="flex items-start gap-2 sm:gap-3">
              <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 text-red-600 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-red-800 text-sm sm:text-base">⚠️ Cloudinary Not Configured</p>
                <p className="text-red-700 text-xs sm:text-sm mt-1">
                  Set environment variables: REACT_APP_CLOUDINARY_CLOUD_NAME and REACT_APP_CLOUDINARY_UPLOAD_PRESET
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ===== SECTION TABS ===== */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg overflow-hidden">
          <div className="border-b border-gray-200">
            <div className="flex overflow-x-auto">
              <button
                onClick={() => setActiveSection('upload')}
                className={`flex-1 min-w-[140px] sm:min-w-0 px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm md:text-base font-semibold transition-colors ${
                  activeSection === 'upload'
                    ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <Upload className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="hidden sm:inline">Step 1: Upload Images</span>
                  <span className="sm:hidden">Upload</span>
                </div>
              </button>
              <button
                onClick={() => setActiveSection('process')}
                className={`flex-1 min-w-[140px] sm:min-w-0 px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm md:text-base font-semibold transition-colors ${
                  activeSection === 'process'
                    ? 'bg-green-50 text-green-600 border-b-2 border-green-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <FileSpreadsheet className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="hidden sm:inline">Step 2: Process Excel</span>
                  <span className="sm:hidden">Process</span>
                </div>
              </button>
            </div>
          </div>

          {/* ===== UPLOAD SECTION ===== */}
          {activeSection === 'upload' && (
            <div className="p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-6">
              
              {/* Image Selection */}
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 sm:p-8 md:p-10 text-center hover:border-blue-400 hover:bg-blue-50/50 transition-all">
                <ImageIcon className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 text-gray-400 mx-auto mb-3 sm:mb-4" />
                <h3 className="text-base sm:text-lg md:text-xl font-semibold text-gray-700 mb-2">
                  Select Tile Images
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 mb-4 sm:mb-6">
                  JPG, PNG, WEBP • Max 10MB per file • Multiple selection
                </p>

                <input
                  ref={imageInputRef}
                  type="file"
                  multiple
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={handleImageSelection}
                  disabled={isUploading}
                  className="hidden"
                  id="image-upload"
                />

                <label
                  htmlFor="image-upload"
                  className={`inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold cursor-pointer transition-all text-sm sm:text-base ${
                    isUploading
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700 active:scale-95 shadow-lg hover:shadow-xl'
                  }`}
                >
                  <Upload className="w-5 h-5" />
                  Choose Images
                </label>

                {selectedImages.length > 0 && (
                  <div className="mt-4 sm:mt-6 bg-green-50 border border-green-200 rounded-lg p-3 sm:p-4">
                    <p className="text-sm sm:text-base font-semibold text-green-800">
                      ✅ {selectedImages.length} image{selectedImages.length > 1 ? 's' : ''} selected
                    </p>
                    <p className="text-xs sm:text-sm text-green-700 mt-1">
                      Total size: {formatFileSize(selectedImages.reduce((sum, f) => sum + f.size, 0))}
                    </p>
                  </div>
                )}
              </div>

              {/* Image Errors */}
              {imageErrors.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 sm:p-4">
                  <p className="font-semibold text-red-800 mb-2 text-sm sm:text-base flex items-center gap-2">
                    <AlertCircle className="w-5 h-5" />
                    ⚠️ {imageErrors.length} invalid file{imageErrors.length > 1 ? 's' : ''}
                  </p>
                  <div className="max-h-40 overflow-y-auto space-y-1 text-xs sm:text-sm">
                    {imageErrors.map((err, idx) => (
                      <p key={idx} className="text-red-700 break-all">
                        • {err.filename}: {err.reason}
                      </p>
                    ))}
                  </div>
                </div>
              )}

              {/* Upload Button */}
              {selectedImages.length > 0 && !isUploading && (
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-xl p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="text-center sm:text-left">
                      <p className="font-semibold text-green-800 text-sm sm:text-base mb-1">
                        ☁️ Ready to Upload to Cloudinary
                      </p>
                      <p className="text-xs sm:text-sm text-green-700">
                        {selectedImages.length} images • {formatFileSize(selectedImages.reduce((sum, f) => sum + f.size, 0))}
                      </p>
                    </div>
                    <button
                      onClick={handleBulkUpload}
                      disabled={!currentUser || !isCloudinaryConfigured}
                      className="w-full sm:w-auto flex items-center justify-center gap-2 bg-green-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold shadow-lg text-sm sm:text-base transition-all active:scale-95"
                    >
                      <Upload className="w-5 h-5" />
                      Upload to Cloudinary
                    </button>
                  </div>
                  {!currentUser && (
                    <p className="mt-3 text-center text-red-600 text-xs sm:text-sm flex items-center justify-center gap-2">
                      <AlertTriangle className="w-4 h-4" />
                      Please log in to upload
                    </p>
                  )}
                </div>
              )}

              {/* Upload Progress */}
              {isUploading && (
                <div className="bg-white border-2 border-blue-300 rounded-xl p-4 sm:p-6 shadow-lg">
                  <div className="flex items-center justify-between mb-3 sm:mb-4">
                    <span className="text-sm sm:text-base font-semibold text-gray-800 flex items-center gap-2">
                      <Loader className="w-5 h-5 animate-spin text-blue-600" />
                      {isPaused ? '⏸️ Paused' : '☁️ Uploading...'}
                    </span>
                    <span className="text-sm sm:text-base font-bold text-blue-600">
                      {uploadProgress.percentage}%
                    </span>
                  </div>

                  <div className="w-full bg-gray-200 rounded-full h-3 sm:h-4 overflow-hidden mb-4">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-indigo-500 h-3 sm:h-4 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress.percentage}%` }}
                    />
                  </div>

                  {uploadProgress.currentFile && (
                    <div className="space-y-2 mb-4">
                      <p className="text-xs sm:text-sm text-gray-700 truncate">
                        <span className="font-semibold">📸 Current:</span> {uploadProgress.currentFile}
                      </p>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                        <div className="bg-blue-50 rounded p-2 text-center">
                          <div className="font-bold text-blue-600">{uploadProgress.completed}/{uploadProgress.total}</div>
                          <div className="text-gray-600">Files</div>
                        </div>
                        <div className="bg-purple-50 rounded p-2 text-center">
                          <div className="font-bold text-purple-600">{uploadProgress.speed} MB/s</div>
                          <div className="text-gray-600">Speed</div>
                        </div>
                        <div className="bg-green-50 rounded p-2 text-center">
                          <div className="font-bold text-green-600">{formatTime(uploadProgress.eta)}</div>
                          <div className="text-gray-600">ETA</div>
                        </div>
                        <div className="bg-yellow-50 rounded p-2 text-center">
                          <div className="font-bold text-yellow-600">{formatFileSize(uploadedBytesRef.current)}</div>
                          <div className="text-gray-600">Uploaded</div>
                        </div>
                      </div>
                    </div>
                  )}

                  <button
                    onClick={handleTogglePause}
                    className="flex items-center gap-2 bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 text-xs sm:text-sm transition-all active:scale-95"
                  >
                    {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                    {isPaused ? 'Resume' : 'Pause'}
                  </button>
                </div>
              )}

              {/* Failed Uploads */}
              {failedUploads.length > 0 && (
                <div className="bg-red-50 border-2 border-red-300 rounded-xl p-4 sm:p-6">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-start gap-2 flex-1">
                      <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-red-800 text-sm sm:text-base">
                          ❌ Failed Uploads ({failedUploads.length})
                        </h4>
                        <div className="mt-2 max-h-32 overflow-y-auto space-y-1 text-xs sm:text-sm">
                          {failedUploads.map((fail, idx) => (
                            <p key={idx} className="text-red-700 break-all">
                              • {fail.file.name}: {fail.error}
                            </p>
                          ))}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={retryFailedUploads}
                      disabled={isUploading}
                      className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50 text-xs sm:text-sm transition-all active:scale-95"
                    >
                      <RefreshCw className="w-4 h-4" />
                      Retry
                    </button>
                  </div>
                </div>
              )}

              {/* Download Excel */}
              {uploadedImages.length > 0 && (
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-xl p-4 sm:p-6">
                  <div className="flex items-start gap-3 sm:gap-4">
                    <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 text-green-600 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base sm:text-lg font-bold text-green-800 mb-2">
                        ✅ Upload Complete!
                      </h3>

                      <div className="bg-white rounded-lg p-3 sm:p-4 mb-4 shadow-sm">
                        <p className="font-semibold text-gray-800 mb-2 text-sm sm:text-base">📊 Summary:</p>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs sm:text-sm">
                          <div className="text-center p-2 bg-blue-50 rounded">
                            <div className="text-xl sm:text-2xl font-bold text-blue-600">{uploadedImages.length}</div>
                            <div className="text-gray-600">Images</div>
                          </div>
                          <div className="text-center p-2 bg-green-50 rounded">
                            <div className="text-xl sm:text-2xl font-bold text-green-600">
                              {formatFileSize(uploadedImages.reduce((sum, img) => sum + img.size, 0))}
                            </div>
                            <div className="text-gray-600">Total Size</div>
                          </div>
                          <div className="text-center p-2 bg-purple-50 rounded col-span-2 sm:col-span-1">
                            <div className="text-xl sm:text-2xl font-bold text-purple-600">Ready</div>
                            <div className="text-gray-600">Status</div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-green-100 border border-green-300 rounded-lg p-3 sm:p-4 mb-3">
                        <p className="font-semibold text-green-800 mb-2 text-sm sm:text-base flex items-center gap-2">
                          <FileSpreadsheet className="w-5 h-5" />
                          📥 Next Step: Download Excel
                        </p>
                        <p className="text-xs sm:text-sm text-green-700 mb-3">
                          Excel with URL + Code pre-filled. Add: Name, Surface, Material, Category, Size, Price, Quantity!
                        </p>
                        <button
                          onClick={handleDownloadExcel}
                          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 font-semibold shadow-md text-sm sm:text-base transition-all active:scale-95"
                        >
                          <Download className="w-5 h-5" />
                          Download Excel File
                        </button>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-2">
                        <button
                          onClick={() => setShowUploadedLibrary(!showUploadedLibrary)}
                          className="flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 text-xs sm:text-sm transition-colors"
                        >
                          {showUploadedLibrary ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          {showUploadedLibrary ? 'Hide' : 'View'} Library ({uploadedImages.length})
                        </button>
                        <button
                          onClick={handleClearUploaded}
                          className="flex items-center justify-center gap-2 bg-red-50 border border-red-300 text-red-700 px-4 py-2 rounded-lg hover:bg-red-100 text-xs sm:text-sm transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                          Clear All
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Uploaded Library */}
              {showUploadedLibrary && uploadedImages.length > 0 && (
                <div className="bg-white border-2 border-gray-300 rounded-xl p-4 sm:p-6">
                  <h4 className="font-semibold text-gray-800 mb-4 text-sm sm:text-base flex items-center gap-2">
                    <Info className="w-5 h-5 text-blue-600" />
                    📚 Uploaded Images ({uploadedImages.length})
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                    {uploadedImages.map((img, index) => (
                      <div key={index} className="bg-gray-50 border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-2 mb-2">
                          <ImageIcon className="w-4 h-4 text-blue-600 flex-shrink-0" />
                          <span className="text-xs font-semibold text-gray-800 truncate flex-1">
                            {img.filename}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600 mb-2">
                          {formatFileSize(img.size)}
                        </p>
                        <div className="flex flex-wrap gap-1">
                          <button
                            onClick={() => window.open(img.url, '_blank')}
                            className="flex items-center gap-1 bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs hover:bg-blue-200 transition-colors"
                          >
                            <Eye className="w-3 h-3" />
                            View
                          </button>
                          <button
                            onClick={() => copyToClipboard(img.url)}
                            className="flex items-center gap-1 bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs hover:bg-gray-200 transition-colors"
                          >
                            <Copy className="w-3 h-3" />
                            Copy URL
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          )}

          {/* ===== PROCESS SECTION ===== */}
          {activeSection === 'process' && (
            <div className="p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-6">
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
                <h4 className="font-semibold text-blue-800 mb-2 text-sm sm:text-base flex items-center gap-2">
                  <Info className="w-5 h-5" />
                  📝 Before Upload
                </h4>
                <ul className="text-xs sm:text-sm text-blue-700 space-y-1 ml-5 list-disc">
                  <li>Download Excel from Step 1 (Upload Images)</li>
                  <li>Fill: <strong>Tile Name</strong>, <strong>Surface Name</strong>, <strong>Material Name</strong>, <strong>Category</strong></li>
                  <li>Fill: <strong>Size</strong>, <strong>Price</strong>, <strong>Quantity</strong></li>
                  <li>Category options: <strong>floor</strong> / <strong>wall</strong> / <strong>bathroom</strong> / <strong>kitchen</strong></li>
                  <li>Don't change: <strong>Tile URL</strong> and <strong>Code</strong> columns</li>
                  <li>Save the Excel file</li>
                </ul>
              </div>

              {/* Excel Upload */}
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 sm:p-8 md:p-10 text-center hover:border-green-400 hover:bg-green-50/50 transition-all">
                <FileSpreadsheet className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 text-gray-400 mx-auto mb-3 sm:mb-4" />
                <h3 className="text-base sm:text-lg md:text-xl font-semibold text-gray-700 mb-2">
                  Upload Completed Excel
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 mb-4 sm:mb-6">
                  Excel file with filled tile details • .xlsx or .xls format
                </p>

                <input
                  ref={excelInputRef}
                  type="file"
                  accept=".xlsx,.xls,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
                  onChange={handleExcelUpload}
                  disabled={isProcessing}
                  className="hidden"
                  id="excel-upload"
                />

                <label
                  htmlFor="excel-upload"
                  className={`inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold cursor-pointer transition-all text-sm sm:text-base ${
                    isProcessing
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-green-600 text-white hover:bg-green-700 active:scale-95 shadow-lg hover:shadow-xl'
                  }`}
                >
                  <FileSpreadsheet className="w-5 h-5" />
                  Select Excel File
                </label>

                {!currentUser && (
                  <p className="mt-4 text-red-600 text-xs sm:text-sm flex items-center justify-center gap-2">
                    <AlertTriangle className="w-4 h-4" />
                    Please log in to process Excel
                  </p>
                )}
              </div>

              {/* Processing Progress */}
              {isProcessing && (
                <div className="bg-white border-2 border-green-300 rounded-xl p-4 sm:p-6 shadow-lg">
                  <div className="flex items-center justify-between mb-3 sm:mb-4">
                    <span className="text-sm sm:text-base font-semibold text-gray-800 flex items-center gap-2">
                      <Loader className="w-5 h-5 animate-spin text-green-600" />
                      ⚙️ Processing Excel...
                    </span>
                    <span className="text-sm sm:text-base font-bold text-green-600">
                      {processProgress}%
                    </span>
                  </div>

                  <div className="w-full bg-gray-200 rounded-full h-3 sm:h-4 overflow-hidden mb-3">
                    <div
                      className="bg-gradient-to-r from-green-500 to-emerald-500 h-3 sm:h-4 rounded-full transition-all duration-300"
                      style={{ width: `${processProgress}%` }}
                    />
                  </div>

                  {processStage && (
                    <p className="text-xs sm:text-sm text-gray-700 truncate">
                      {processStage}
                    </p>
                  )}
                </div>
              )}

              {/* Process Result */}
              {processResult && (
                <div className={`rounded-xl border-2 p-4 sm:p-6 ${
                  processResult.success > 0
                    ? processResult.errors.length > 0
                      ? 'bg-yellow-50 border-yellow-300'
                      : 'bg-green-50 border-green-300'
                    : 'bg-red-50 border-red-300'
                }`}>
                  <div className="flex items-start gap-3 sm:gap-4">
                    {processResult.success > 0 ? (
                      processResult.errors.length > 0 ? (
                        <AlertTriangle className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-600 flex-shrink-0" />
                      ) : (
                        <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 text-green-600 flex-shrink-0" />
                      )
                    ) : (
                      <AlertCircle className="w-6 h-6 sm:w-8 sm:h-8 text-red-600 flex-shrink-0" />
                    )}

                    <div className="flex-1 min-w-0">
                      <h3 className={`text-base sm:text-lg font-bold mb-3 ${
                        processResult.success > 0
                          ? processResult.errors.length > 0
                            ? 'text-yellow-800'
                            : 'text-green-800'
                          : 'text-red-800'
                      }`}>
                        {processResult.success > 0
                          ? processResult.errors.length > 0
                            ? '⚠️ Completed with Warnings'
                            : '🎉 Processing Successful!'
                          : '❌ Processing Failed'}
                      </h3>

                      {processResult.success > 0 && (
                        <div className="mb-3 p-3 sm:p-4 bg-white rounded-lg border border-green-200">
                          <p className="text-green-700 font-semibold mb-2 text-sm sm:text-base">
                            ✅ Successfully processed: {processResult.success} tiles
                          </p>
                          {processResult.details && (
                            <div className="text-xs sm:text-sm text-green-600 space-y-1">
                              <p>📱 QR codes generated: {processResult.details.qrGenerated}</p>
                              {processResult.details.qrFailed > 0 && (
                                <p className="text-yellow-600">
                                  ⚠️ QR generation failed: {processResult.details.qrFailed}
                                </p>
                              )}
                            </div>
                          )}
                        </div>
                      )}

                      {processResult.errors.length > 0 && (
                        <div className="mt-3">
                          <p className={`text-xs sm:text-sm font-semibold mb-2 ${
                            processResult.success > 0 ? 'text-yellow-700' : 'text-red-700'
                          }`}>
                            {processResult.success > 0 ? '⚠️ Warnings:' : '❌ Errors:'}
                          </p>
                          <div className="max-h-60 overflow-y-auto bg-white rounded-lg p-3 sm:p-4 border border-gray-200">
                            <div className="space-y-1 font-mono text-xs break-words">
                              {processResult.errors.map((error, index) => (
                                <div
                                  key={index}
                                  className={`py-1 ${
                                    processResult.success > 0 ? 'text-yellow-700' : 'text-red-700'
                                  }`}
                                >
                                  {error}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <button
                      onClick={handleClearResult}
                      className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}

              {/* Instructions */}
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 sm:p-6">
                <h4 className="font-semibold text-gray-800 mb-3 text-sm sm:text-base flex items-center gap-2">
                  <Info className="w-5 h-5 text-blue-600" />
                  📋 Excel Requirements
                </h4>
                <div className="space-y-2 text-xs sm:text-sm text-gray-700">
                  <div className="flex items-start gap-2">
                    <span className="bg-blue-100 text-blue-600 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold flex-shrink-0">✓</span>
                    <p><strong>Required Columns:</strong> Tile Name, Surface Name, Material Name, Category, Tile URL, Size, Code, Price, Quantity</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="bg-blue-100 text-blue-600 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold flex-shrink-0">✓</span>
                    <p><strong>Tile Name:</strong> Descriptive name (e.g., "White Marble Premium")</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="bg-blue-100 text-blue-600 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold flex-shrink-0">✓</span>
                    <p><strong>Surface Name:</strong> Surface type (e.g., "Glossy", "Matte", "Polished")</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="bg-blue-100 text-blue-600 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold flex-shrink-0">✓</span>
                    <p><strong>Material Name:</strong> Material type (e.g., "Marble", "Ceramic", "Porcelain")</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="bg-blue-100 text-blue-600 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold flex-shrink-0">✓</span>
                    <p><strong>Category:</strong> Must be: floor, wall, bathroom, or kitchen</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="bg-blue-100 text-blue-600 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold flex-shrink-0">✓</span>
                    <p><strong>Size:</strong> Tile dimensions (e.g., "600x600mm")</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="bg-blue-100 text-blue-600 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold flex-shrink-0">✓</span>
                    <p><strong>Price:</strong> Numeric value only (no symbols)</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="bg-blue-100 text-blue-600 rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold flex-shrink-0">✓</span>
                    <p><strong>Quantity:</strong> Number of pieces available</p>
                  </div>
                </div>
              </div>

            </div>
          )}

        </div>

      </div>

      {/* Image Preview Modal */}
      {previewImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={() => setPreviewImage(null)}
        >
          <div className="relative max-w-4xl max-h-full">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setPreviewImage(null);
              }}
              className="absolute -top-10 right-0 text-white hover:text-gray-300 transition-colors"
            >
              <X className="w-8 h-8" />
            </button>
            <img
              src={previewImage}
              alt="Preview"
              className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              onClick={(e) => {
                e.stopPropagation();
                window.open(previewImage, '_blank');
              }}
              className="absolute bottom-4 right-4 bg-white text-gray-800 px-4 py-2 rounded-lg shadow-lg hover:bg-gray-100 transition-colors flex items-center gap-2"
            >
              <ZoomIn className="w-4 h-4" />
              Full Size
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default ExcelUpload;