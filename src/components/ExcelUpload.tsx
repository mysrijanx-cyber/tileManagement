
// components/ExcelUpload.tsx - PRODUCTION READY VERSION
import React, { useState, useRef } from 'react';
import { 
  FileSpreadsheet, Upload, Download, CheckCircle, AlertCircle, 
  Loader, Info, X, AlertTriangle,
} from 'lucide-react';
import { readExcelFile, downloadExcelTemplate, validateTileData } from '../utils/excelUtils';
import { uploadTile, updateTileQRCode } from '../lib/firebaseutils';
import { generateTileQRCode } from '../utils/qrCodeUtils';
import { useAppStore } from '../stores/appStore';

// ===== INTERFACES =====

interface ExcelUploadProps {
  onUploadComplete?: () => void;
}

interface ParsedTileData {
  name: string;
  category: 'floor' | 'wall' | 'both';
  size: string;
  price: number;
  stock: number;
  imageUrl: string;
  textureUrl?: string;
  tileCode?: string;
}

interface UploadResults {
  successful: any[];
  failed: Array<{
    row: number;
    data: any;
    error: string;
  }>;
  qrGenerated: number;
  qrFailed: number;
}

interface UploadResult {
  success: number;
  errors: string[];
  details?: UploadResults;
}

// ===== MAIN COMPONENT =====

export const ExcelUpload: React.FC<ExcelUploadProps> = ({ onUploadComplete }) => {
  const { currentUser } = useAppStore();
  
  // ===== STATE MANAGEMENT =====
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null);
  const [currentStage, setCurrentStage] = useState('');
  const [showInstructions, setShowInstructions] = useState(true);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ===== HELPER FUNCTIONS =====

  /**
   * Generate unique tile code
   */
  const generateTileCode = (name: string, index: number): string => {
    const prefix = (name || 'TILE').substring(0, 3).toUpperCase().replace(/[^A-Z]/g, 'T');
    const timestamp = Date.now().toString().slice(-4);
    const indexStr = index.toString().padStart(3, '0');
    return `${prefix}${timestamp}${indexStr}`;
  };

  /**
   * Upload tiles with QR code generation
   */
  const uploadTilesWithQR = async (
    tilesData: ParsedTileData[]
  ): Promise<UploadResults> => {
    const totalTiles = tilesData.length;
    const results: UploadResults = {
      successful: [],
      failed: [],
      qrGenerated: 0,
      qrFailed: 0
    };
    
    console.log(`📦 Starting Excel upload of ${totalTiles} tiles with QR generation...`);
    
    for (let i = 0; i < totalTiles; i++) {
      const tileData = tilesData[i];
      
      try {
        // Prepare tile data
        const tile = {
          name: tileData.name,
          category: tileData.category,
          size: tileData.size,
          price: tileData.price,
          stock: tileData.stock,
          inStock: tileData.stock > 0,
          imageUrl: tileData.imageUrl,
          textureUrl: tileData.textureUrl || '',
          tileCode: tileData.tileCode || generateTileCode(tileData.name, i),
          sellerId: currentUser?.user_id,
          showroomId: currentUser?.user_id,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        // Step 1: Upload tile to database
        console.log(`📤 [${i + 1}/${totalTiles}] Uploading: ${tile.name}`);
        setCurrentStage(`Uploading tile ${i + 1}/${totalTiles}: ${tile.name}`);
        
        const savedTile = await uploadTile(tile);
        
        if (!savedTile?.id) {
          throw new Error('Upload failed - no tile ID returned from database');
        }

        console.log(`✅ [${i + 1}/${totalTiles}] Tile saved with ID: ${savedTile.id}`);

        // Step 2: Generate and save QR code
        try {
          console.log(`📱 [${i + 1}/${totalTiles}] Generating QR code...`);
          setCurrentStage(`Generating QR code for ${tile.name}...`);
          
          const qrCode = await generateTileQRCode(savedTile);
          
          if (!qrCode || !qrCode.startsWith('data:image')) {
            throw new Error('Invalid QR code generated');
          }
          
          await updateTileQRCode(savedTile.id, qrCode);
          
          results.qrGenerated++;
          console.log(`✅ [${i + 1}/${totalTiles}] QR code generated and saved`);
          
        } catch (qrError: any) {
          results.qrFailed++;
          console.warn(`⚠️ [${i + 1}/${totalTiles}] QR generation failed: ${qrError.message}`);
          // Don't fail the whole upload - tile is saved, QR can be generated later
        }
        
        results.successful.push(savedTile);
        
      } catch (error: any) {
        results.failed.push({
          row: i + 2, // +2 because Excel row 1 is header, +1 for 0-based index
          data: tileData,
          error: error.message || 'Unknown error'
        });
        console.error(`❌ [${i + 1}/${totalTiles}] Upload failed: ${error.message}`);
      }
      
      // Update progress (25% base + 75% upload progress)
      const progress = 25 + ((i + 1) / totalTiles) * 75;
      setUploadProgress(Math.round(progress));
      
      // Small delay to prevent overwhelming the server
      if (i < totalTiles - 1) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }
    
    return results;
  };

  // ===== EVENT HANDLERS =====

  /**
   * Handle Excel file upload
   */
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validation
    if (!currentUser) {
      setUploadResult({
        success: 0,
        errors: ['User not authenticated. Please log in and try again.']
      });
      return;
    }

    const fileExtension = file.name.toLowerCase().split('.').pop();
    if (!['xlsx', 'xls'].includes(fileExtension || '')) {
      setUploadResult({
        success: 0,
        errors: ['Invalid file type. Please select an Excel file (.xlsx or .xls)']
      });
      return;
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      setUploadResult({
        success: 0,
        errors: ['File too large. Maximum size is 10MB']
      });
      return;
    }

    // Reset states
    setIsUploading(true);
    setUploadResult(null);
    setUploadProgress(0);
    setCurrentStage('');

    try {
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('📊 EXCEL UPLOAD PROCESS START');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('📅 Started at:', new Date().toISOString());
      console.log('👤 User:', currentUser.email);
      console.log('📁 File:', file.name, `(${(file.size / 1024).toFixed(2)} KB)`);

      // Step 1: Read Excel file (0-10%)
      console.log('📖 Step 1/4: Reading Excel file...');
      setCurrentStage('Reading Excel file...');
      setUploadProgress(5);
      
      const tilesData = await readExcelFile(file);
      
      if (!tilesData || tilesData.length === 0) {
        throw new Error('No data found in Excel file. Please check the file and try again.');
      }
      
      console.log(`✅ Read ${tilesData.length} rows from Excel`);
      setUploadProgress(10);

      // Step 2: Validate data (10-25%)
      console.log('✔️ Step 2/4: Validating tile data...');
      setCurrentStage('Validating tile data...');
      setUploadProgress(15);
      
      const { valid, errors: validationErrors } = validateTileData(tilesData);
      
      console.log(`✅ Validation complete:`);
      console.log(`   - Valid tiles: ${valid.length}`);
      console.log(`   - Validation errors: ${validationErrors.length}`);
      
      if (valid.length === 0) {
        throw new Error(`No valid tiles found. All rows have errors:\n${validationErrors.join('\n')}`);
      }

      setUploadProgress(25);

      // Step 3: Upload tiles with QR generation (25-100%)
      console.log('📤 Step 3/4: Uploading tiles to database with QR codes...');
      setCurrentStage('Uploading tiles and generating QR codes...');
      
      const results = await uploadTilesWithQR(valid);

      setUploadProgress(100);
      setCurrentStage('Upload complete!');

      // Step 4: Compile results
      console.log('📊 Step 4/4: Compiling results...');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('📈 UPLOAD SUMMARY:');
      console.log(`   ✅ Successfully uploaded: ${results.successful.length}`);
      console.log(`   📱 QR codes generated: ${results.qrGenerated}`);
      console.log(`   ⚠️  QR codes failed: ${results.qrFailed}`);
      console.log(`   ❌ Upload failures: ${results.failed.length}`);
      console.log(`   📋 Validation errors: ${validationErrors.length}`);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

      // Build comprehensive error messages
      const errorMessages: string[] = [];
      
      // Validation errors
      if (validationErrors.length > 0) {
        errorMessages.push(`⚠️ Excel Validation Issues (${validationErrors.length} rows):`);
        const displayErrors = validationErrors.slice(0, 10);
        errorMessages.push(...displayErrors);
        if (validationErrors.length > 10) {
          errorMessages.push(`... and ${validationErrors.length - 10} more validation errors`);
        }
        errorMessages.push(''); // Empty line for separation
      }
      
      // Upload failures
      if (results.failed.length > 0) {
        errorMessages.push(`❌ Upload Failures (${results.failed.length} tiles):`);
        const displayFailed = results.failed.slice(0, 10);
        displayFailed.forEach(fail => {
          errorMessages.push(`   Excel Row ${fail.row}: ${fail.error}`);
        });
        if (results.failed.length > 10) {
          errorMessages.push(`... and ${results.failed.length - 10} more upload errors`);
        }
        errorMessages.push(''); // Empty line
      }

      // QR failures (non-critical)
      if (results.qrFailed > 0) {
        errorMessages.push(
          `⚠️ QR Code Generation: ${results.qrFailed} failed (tiles uploaded successfully, QR codes can be generated later from QR Codes tab)`
        );
      }

      // Set final result
      setUploadResult({
        success: results.successful.length,
        errors: errorMessages,
        details: results
      });

      // Call completion callback
      if (results.successful.length > 0 && onUploadComplete) {
        console.log('🔄 Calling onUploadComplete callback...');
        try {
          await onUploadComplete();
          console.log('✅ Callback completed successfully');
        } catch (callbackError) {
          console.error('⚠️ Callback error:', callbackError);
        }
      }

      console.log('✅ EXCEL UPLOAD PROCESS COMPLETED');
      console.log('📅 Completed at:', new Date().toISOString());
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    } catch (error: any) {
      console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.error('❌ EXCEL UPLOAD PROCESS FAILED');
      console.error('Error:', error);
      console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      
      setUploadResult({
        success: 0,
        errors: [error.message || 'Upload failed. Please check your Excel file and try again.']
      });
    } finally {
      setIsUploading(false);
      setCurrentStage('');
      
      // Clear file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
      // Keep progress visible briefly
      setTimeout(() => setUploadProgress(0), 1000);
    }
  };

  /**
   * Download Excel template
   */
  const handleDownloadTemplate = () => {
    try {
      downloadExcelTemplate();
      console.log('✅ Excel template downloaded');
    } catch (error) {
      console.error('❌ Failed to download template:', error);
      alert('Failed to download template. Please try again.');
    }
  };

  /**
   * Clear upload result
   */
  const handleClearResult = () => {
    setUploadResult(null);
    console.log('🧹 Upload result cleared');
  };

  // ===== RENDER =====

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6">
        <div className="flex flex-col sm:flex-row items-start justify-between gap-3 sm:gap-4">
          <div className="flex items-start gap-2 sm:gap-3 md:gap-4 flex-1 w-full">
            <FileSpreadsheet className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-blue-600 mt-0.5 sm:mt-1 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-2 gap-2">
                <h3 className="text-base sm:text-lg md:text-xl font-bold text-blue-800 truncate">Excel File Upload with QR Generation</h3>
                <button
                  onClick={() => setShowInstructions(!showInstructions)}
                  className="text-blue-600 hover:text-blue-800 text-xs sm:text-sm font-medium flex-shrink-0"
                >
                  {showInstructions ? 'Hide' : 'Show'} Instructions
                </button>
              </div>
              
              <p className="text-blue-700 mb-3 sm:mb-4 text-xs sm:text-sm md:text-base">
                Upload multiple tiles at once using Excel (.xlsx) files. QR codes will be automatically generated for each tile.
              </p>
              
              {showInstructions && (
                <>
                  {/* Required Columns */}
                  <div className="bg-blue-100 rounded-lg p-3 sm:p-4 mb-3 sm:mb-4">
                    <h4 className="font-semibold text-blue-800 mb-2 text-xs sm:text-sm">Required Excel Columns:</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-1.5 sm:gap-2 text-xs sm:text-sm text-blue-700">
                      <span className="font-medium">• Name *</span>
                      <span className="font-medium">• Category *</span>
                      <span className="font-medium">• Size *</span>
                      <span className="font-medium">• Price *</span>
                      <span className="font-medium">• Stock *</span>
                      <span className="font-medium">• Image URL *</span>
                      <span>• Tile Code</span>
                      <span>• Texture URL</span>
                    </div>
                    <p className="text-xs text-blue-600 mt-2">* Required fields | Other fields are optional</p>
                  </div>

                  {/* Category Options */}
                  <div className="mb-3 sm:mb-4">
                    <p className="text-blue-700 text-xs sm:text-sm font-medium mb-2">Valid Categories:</p>
                    <div className="flex flex-wrap gap-1.5 sm:gap-2 text-xs">
                      <span className="bg-blue-100 text-blue-800 px-2 sm:px-3 py-0.5 sm:py-1 rounded font-medium">floor</span>
                      <span className="bg-blue-100 text-blue-800 px-2 sm:px-3 py-0.5 sm:py-1 rounded font-medium">wall</span>
                      <span className="bg-blue-100 text-blue-800 px-2 sm:px-3 py-0.5 sm:py-1 rounded font-medium">both</span>
                    </div>
                  </div>
                </>
              )}

              <button
                onClick={handleDownloadTemplate}
                disabled={isUploading}
                className="flex items-center gap-1.5 sm:gap-2 bg-blue-600 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm text-xs sm:text-sm"
              >
                <Download className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden xs:inline">Download Excel Template</span>
                <span className="xs:hidden">Download Template</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Upload Progress */}
      {isUploading && (
        <div className="bg-white border border-blue-200 rounded-lg p-3 sm:p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs sm:text-sm font-medium text-gray-700 flex items-center gap-1.5 sm:gap-2 truncate flex-1">
              <Loader className="w-3 h-3 sm:w-4 sm:h-4 animate-spin text-blue-600 flex-shrink-0" />
              <span className="hidden sm:inline">Processing Excel upload...</span>
              <span className="sm:hidden">Processing...</span>
            </span>
            <span className="text-xs sm:text-sm font-bold text-blue-600 flex-shrink-0 ml-2">{uploadProgress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 sm:h-3 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 sm:h-3 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
          {currentStage && (
            <p className="text-xs text-gray-600 mt-2 truncate">
              {currentStage}
            </p>
          )}
          {!currentStage && (
            <p className="text-xs text-gray-600 mt-2">
              {uploadProgress < 10 ? '📖 Reading Excel file...' :
               uploadProgress < 25 ? '✔️ Validating data...' :
               uploadProgress < 50 ? '📤 Uploading tiles...' :
               uploadProgress < 80 ? '📱 Generating QR codes...' :
               uploadProgress < 95 ? '✅ Finalizing...' :
               '🎉 Almost done!'}
            </p>
          )}
        </div>
      )}

      {/* File Upload */}
      <div className="border-2 border-dashed border-gray-300 rounded-lg sm:rounded-xl p-4 sm:p-6 md:p-8 text-center hover:border-blue-400 hover:bg-blue-50 transition-all">
        <FileSpreadsheet className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 text-gray-400 mx-auto mb-3 sm:mb-4" />
        <div className="mb-3 sm:mb-4">
          <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-1 sm:mb-2">
            Choose Excel File
          </h3>
          <p className="text-gray-600 text-xs sm:text-sm">
            Supports .xlsx and .xls files
          </p>
        </div>
        
        <input
          ref={fileInputRef}
          type="file"
          accept=".xlsx,.xls,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
          onChange={handleFileUpload}
          disabled={isUploading}
          className="hidden"
          aria-label="Upload Excel file"
        />
        
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading || !currentUser}
          className="flex items-center gap-1.5 sm:gap-2 bg-green-600 text-white px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 md:py-3 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors mx-auto shadow-sm text-xs sm:text-sm md:text-base"
        >
          {isUploading ? (
            <>
              <Loader className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
              <span>Processing...</span>
            </>
          ) : (
            <>
              <Upload className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">Select Excel File</span>
              <span className="sm:hidden">Select File</span>
            </>
          )}
        </button>
        
        <p className="text-xs text-gray-500 mt-2 sm:mt-3">
          Maximum file size: 10MB
        </p>

        {!currentUser && (
          <div className="flex items-center justify-center gap-1.5 sm:gap-2 text-red-600 text-xs sm:text-sm mt-2 sm:mt-3">
            <AlertTriangle className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
            <span>Please log in to upload tiles</span>
          </div>
        )}
      </div>

      {/* Upload Results */}
      {uploadResult && (
        <div className={`rounded-lg sm:rounded-xl border-2 p-3 sm:p-4 md:p-6 ${
          uploadResult.success > 0 
            ? uploadResult.errors.length > 0
              ? 'bg-yellow-50 border-yellow-300'
              : 'bg-green-50 border-green-300'
            : 'bg-red-50 border-red-300'
        }`}>
          <div className="flex items-start gap-3 sm:gap-4">
            {uploadResult.success > 0 ? (
              uploadResult.errors.length > 0 ? (
                <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-600 mt-0.5 flex-shrink-0" />
              ) : (
                <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 mt-0.5 flex-shrink-0" />
              )
            ) : (
              <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 text-red-600 mt-0.5 flex-shrink-0" />
            )}
            
            <div className="flex-1 min-w-0">
              <h3 className={`text-base sm:text-lg font-bold mb-2 sm:mb-3 ${
                uploadResult.success > 0 
                  ? uploadResult.errors.length > 0
                    ? 'text-yellow-800'
                    : 'text-green-800'
                  : 'text-red-800'
              }`}>
                {uploadResult.success > 0 
                  ? uploadResult.errors.length > 0
                    ? 'Upload Completed with Warnings'
                    : 'Upload Successful!'
                  : 'Upload Failed'}
              </h3>
              
              {/* Success Summary */}
              {uploadResult.success > 0 && (
                <div className="mb-3 sm:mb-4 p-3 sm:p-4 bg-white rounded-lg border border-green-200">
                  <p className="text-green-700 font-semibold mb-2 text-sm sm:text-base md:text-lg">
                    ✅ Successfully uploaded: {uploadResult.success} tiles
                  </p>
                  {uploadResult.details && (
                    <div className="text-xs sm:text-sm text-green-600 space-y-1">
                      <p>📱 QR codes generated: {uploadResult.details.qrGenerated}</p>
                      {uploadResult.details.qrFailed > 0 && (
                        <p className="text-yellow-600">
                          ⚠️ QR generation failed: {uploadResult.details.qrFailed} (can be generated later)
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}
              
              {/* Errors/Warnings */}
              {uploadResult.errors.length > 0 && (
                <div className="mt-3">
                  <p className={`text-xs sm:text-sm font-semibold mb-2 ${
                    uploadResult.success > 0 ? 'text-yellow-700' : 'text-red-700'
                  }`}>
                    {uploadResult.success > 0 ? '⚠️ Warnings:' : '❌ Errors:'}
                  </p>
                  <div className="max-h-60 sm:max-h-80 overflow-y-auto bg-white rounded-lg p-3 sm:p-4 border border-gray-200">
                    <div className="space-y-1 font-mono text-xs break-words">
                      {uploadResult.errors.map((error, index) => (
                        <div 
                          key={index} 
                          className={`py-1 ${
                            uploadResult.success > 0 ? 'text-yellow-700' : 'text-red-700'
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
              aria-label="Close result"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6">
        <h4 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4 flex items-center gap-2">
          <Info className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 flex-shrink-0" />
          <span className="truncate">Excel Upload Instructions</span>
        </h4>
        
        <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm text-gray-700">
          <div className="flex items-start gap-2 sm:gap-3">
            <span className="flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 bg-blue-100 text-blue-600 rounded-full text-xs font-bold flex-shrink-0">1</span>
            <p>Download the Excel template using the button above to ensure correct format.</p>
          </div>
          
          <div className="flex items-start gap-2 sm:gap-3">
            <span className="flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 bg-blue-100 text-blue-600 rounded-full text-xs font-bold flex-shrink-0">2</span>
            <p>Fill in your tile data following the template format. <strong>Do not change column headers.</strong></p>
          </div>
          
          <div className="flex items-start gap-2 sm:gap-3">
            <span className="flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 bg-blue-100 text-blue-600 rounded-full text-xs font-bold flex-shrink-0">3</span>
            <p><strong>Category</strong> must be exactly one of: <code className="bg-gray-200 px-1 rounded">floor</code>, <code className="bg-gray-200 px-1 rounded">wall</code>, or <code className="bg-gray-200 px-1 rounded">both</code> (lowercase)</p>
          </div>
          
          <div className="flex items-start gap-2 sm:gap-3">
            <span className="flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 bg-blue-100 text-blue-600 rounded-full text-xs font-bold flex-shrink-0">4</span>
            <p><strong>Price and Stock</strong> must be numeric values (no currency symbols or text).</p>
          </div>
          
          <div className="flex items-start gap-2 sm:gap-3">
            <span className="flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 bg-blue-100 text-blue-600 rounded-full text-xs font-bold flex-shrink-0">5</span>
            <p><strong>Image URL</strong> must be valid HTTP/HTTPS links to images accessible on the internet.</p>
          </div>
          
          <div className="flex items-start gap-2 sm:gap-3">
            <span className="flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 bg-blue-100 text-blue-600 rounded-full text-xs font-bold flex-shrink-0">6</span>
            <p><strong>Tile Code</strong> is optional and will be auto-generated if left empty.</p>
          </div>
          
          <div className="flex items-start gap-2 sm:gap-3">
            <span className="flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 bg-blue-100 text-blue-600 rounded-full text-xs font-bold flex-shrink-0">7</span>
            <p>QR codes will be <strong>automatically generated</strong> for each tile during upload.</p>
          </div>
          
          <div className="flex items-start gap-2 sm:gap-3">
            <span className="flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 bg-blue-100 text-blue-600 rounded-full text-xs font-bold flex-shrink-0">8</span>
            <p>Save your file as <strong>.xlsx format</strong> and upload using the button above.</p>
          </div>
        </div>
        
        <div className="mt-3 sm:mt-4 p-2.5 sm:p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-yellow-800 text-xs sm:text-sm">
            <strong>💡 Tip:</strong> Start with a small batch (5-10 tiles) to test the format before uploading your complete inventory.
          </p>
        </div>

        <div className="mt-2 sm:mt-3 p-2.5 sm:p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-blue-800 text-xs sm:text-sm">
            <strong>🔄 Pro Tip:</strong> If QR generation fails for some tiles, you can generate them later from the QR Codes tab without re-uploading the tiles.
          </p>
        </div>
      </div>
    </div>
  );
};