  

// // components/BulkUpload.tsx - IMPROVED VERSION
// import React, { useState, useRef } from 'react';
// import { Upload, FileText, CheckCircle, AlertCircle, Download, Loader, Info } from 'lucide-react';
// import { uploadBulkTiles , uploadTile , updateTileQRCode } from '../lib/firebaseutils';
// import { useAppStore } from '../stores/appStore';
// import { generateTileQRCode } from '../utils/qrCodeUtils';


// interface BulkUploadProps {
//   onUploadComplete?: () => void;
// }

// export const BulkUpload: React.FC<BulkUploadProps> = ({ onUploadComplete }) => {
//   const { currentUser } = useAppStore(); // ✅ Fixed: Use currentUser instead of currentShowroom
//   const [csvData, setCsvData] = useState('');
//   const [isUploading, setIsUploading] = useState(false);
//   const [uploadProgress, setUploadProgress] = useState(0);
//   const [uploadResult, setUploadResult] = useState<{ success: number; errors: string[] } | null>(null);
//   const fileInputRef = useRef<HTMLInputElement>(null);

//   // Common tile sizes
//   const commonTileSizes = [
//     '30x30 cm', '30x60 cm', '40x40 cm', '40x60 cm', '60x60 cm', '60x120 cm',
//     '80x80 cm', '10x30 cm', '15x90 cm', '20x120 cm', '25x40 cm', '7.5x15 cm',
//     '6x25 cm', '20x20 cm', '100x100 cm', '45x45 cm', '50x50 cm', '75x75 cm'
//   ];

//   const sampleCSV = `name,category,size,price,stock,imageUrl,textureUrl,tileCode
// "Marble White Elite",both,"60x60 cm",2500,100,"https://example.com/image1.jpg","https://example.com/texture1.jpg","MWE001"
// "Dark Wood Pattern",floor,"20x120 cm",1800,50,"https://example.com/image2.jpg","https://example.com/texture2.jpg","DWP002"
// "Modern Gray Stone",both,"30x60 cm",2200,75,"https://example.com/image3.jpg","https://example.com/texture3.jpg","MGS003"
// "Ceramic Subway White",wall,"10x30 cm",1200,200,"https://example.com/image4.jpg","","CSW004"
// "Polished Concrete",floor,"80x80 cm",2800,30,"https://example.com/image5.jpg","https://example.com/texture5.jpg","PC005"`;

//   const downloadSampleCSV = () => {
//     const blob = new Blob([sampleCSV], { type: 'text/csv' });
//     const url = window.URL.createObjectURL(blob);
//     const a = document.createElement('a');
//     a.href = url;
//     a.download = 'sample_tiles.csv';
//     a.click();
//     window.URL.revokeObjectURL(url);
//   };

//   // ✅ Improved CSV parsing with proper validation
//   const parseCsvData = (csv: string) => {
//     const lines = csv.trim().split('\n');
//     if (lines.length < 2) {
//       throw new Error('CSV must have at least a header row and one data row');
//     }

//     const headers = parseCSVLine(lines[0]);
//     const requiredHeaders = ['name', 'category', 'size', 'price', 'stock', 'imageUrl'];
    
//     // Validate required headers
//     const missingHeaders = requiredHeaders.filter(required => 
//       !headers.some(header => header.toLowerCase() === required.toLowerCase())
//     );
    
//     if (missingHeaders.length > 0) {
//       throw new Error(`Missing required columns: ${missingHeaders.join(', ')}`);
//     }

//     const tiles = [];
//     const errors: string[] = [];

//     for (let i = 1; i < lines.length; i++) {
//       try {
//         const values = parseCSVLine(lines[i]);
        
//         if (values.length !== headers.length) {
//           errors.push(`Row ${i}: Column count mismatch`);
//           continue;
//         }

//         const tile: any = {
//           id: `bulk_${Date.now()}_${i}_${Math.random().toString(36).substr(2, 9)}`,
//           sellerId: currentUser?.user_id,
//           showroomId: currentUser?.user_id,
//           createdAt: new Date().toISOString(),
//           updatedAt: new Date().toISOString()
//         };

//         // Map values to headers
//         headers.forEach((header, index) => {
//           const value = values[index]?.trim();
//           const lowerHeader = header.toLowerCase();
          
//           switch (lowerHeader) {
//             case 'price':
//               const price = parseFloat(value);
//               if (isNaN(price) || price <= 0) {
//                 throw new Error(`Invalid price: ${value}`);
//               }
//               tile.price = price;
//               break;
              
//             case 'stock':
//               const stock = parseInt(value);
//               if (isNaN(stock) || stock < 0) {
//                 throw new Error(`Invalid stock: ${value}`);
//               }
//               tile.stock = stock;
//               tile.inStock = stock > 0;
//               break;
              
//             case 'category':
//               if (!['floor', 'wall', 'both'].includes(value.toLowerCase())) {
//                 throw new Error(`Invalid category: ${value}. Must be 'floor', 'wall', or 'both'`);
//               }
//               tile.category = value.toLowerCase();
//               break;
              
//             case 'imageurl':
//               if (!value || !isValidUrl(value)) {
//                 throw new Error(`Invalid image URL: ${value}`);
//               }
//               tile.imageUrl = value;
//               break;
              
//             case 'textureurl':
//               if (value && !isValidUrl(value)) {
//                 throw new Error(`Invalid texture URL: ${value}`);
//               }
//               tile.textureUrl = value || '';
//               break;
              
//             case 'tilecode':
//               tile.tileCode = value || generateTileCode(tile.name, i);
//               break;
              
//             default:
//               tile[lowerHeader] = value;
//           }
//         });

//         // Final validation
//         if (!tile.name?.trim()) {
//           throw new Error('Name is required');
//         }
//         if (!tile.size?.trim()) {
//           throw new Error('Size is required');
//         }

//         tiles.push(tile);
        
//       } catch (error: any) {
//         errors.push(`Row ${i}: ${error.message}`);
//       }
//     }

//     if (errors.length > 0) {
//       throw new Error(`Validation errors:\n${errors.join('\n')}`);
//     }

//     return tiles;
//   };

//   // ✅ Proper CSV line parsing (handles quotes and commas)
//   const parseCSVLine = (line: string): string[] => {
//     const result: string[] = [];
//     let current = '';
//     let inQuotes = false;
    
//     for (let i = 0; i < line.length; i++) {
//       const char = line[i];
      
//       if (char === '"') {
//         inQuotes = !inQuotes;
//       } else if (char === ',' && !inQuotes) {
//         result.push(current.trim());
//         current = '';
//       } else {
//         current += char;
//       }
//     }
    
//     result.push(current.trim());
//     return result;
//   };

//   // ✅ URL validation
//   const isValidUrl = (url: string): boolean => {
//     try {
//       new URL(url);
//       return url.startsWith('http://') || url.startsWith('https://');
//     } catch {
//       return false;
//     }
//   };

//   // ✅ Generate tile code
//   const generateTileCode = (name: string, index: number): string => {
//     const prefix = name.substring(0, 3).toUpperCase();
//     const timestamp = Date.now().toString().slice(-4);
//     return `${prefix}${timestamp}${index.toString().padStart(2, '0')}`;
//   };

//   // ✅ File upload handler
//   const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
//     const file = event.target.files?.[0];
//     if (!file) return;

//     if (!file.name.toLowerCase().endsWith('.csv')) {
//       alert('Please select a CSV file');
//       return;
//     }

//     try {
//       const text = await file.text();
//       setCsvData(text);
//     } catch (error) {
//       alert('Failed to read file');
//     }
    
//     // Clear file input
//     if (fileInputRef.current) {
//       fileInputRef.current.value = '';
//     }
//   };

//   // ✅ Improved bulk upload with progress
//   // const handleBulkUpload = async () => {
//   //   if (!csvData.trim() || !currentUser) return;

//   //   setIsUploading(true);
//   //   setUploadResult(null);
//   //   setUploadProgress(0);

//   //   try {
//   //     // Step 1: Parse and validate (25%)
//   //     setUploadProgress(25);
//   //     const tiles = parseCsvData(csvData);
      
//   //     if (tiles.length === 0) {
//   //       throw new Error('No valid tiles found in CSV data');
//   //     }

//   //     // Step 2: Upload to database (75%)
//   //     setUploadProgress(50);
//   //     const result = await uploadBulkTiles(tiles);
      
//   //     setUploadProgress(100);
//   //     setUploadResult({
//   //       success: result.length,
//   //       errors: []
//   //     });
      
//   //     setCsvData('');
      
//   //     // Call callback instead of window reload
//   //     onUploadComplete?.();
      
//   //   } catch (error: any) {
//   //     console.error('Bulk upload error:', error);
//   //     setUploadResult({
//   //       success: 0,
//   //       errors: [error.message || 'Upload failed']
//   //     });
//   //   } finally {
//   //     setIsUploading(false);
//   //     setUploadProgress(0);
//   //   }
//   // }; 

//   // ✅ BulkUpload.tsx / ExcelUpload.tsx


// const handleBulkUpload = async (tilesData: any[]) => {
//   try {
//     setLoading(true);
//     setProgress(0);
    
//     const totalTiles = tilesData.length;
//     const results = {
//       successful: [] as any[],
//       failed: [] as any[],
//       qrGenerated: 0,
//       qrFailed: 0
//     };
    
//     console.log(`📦 Processing ${totalTiles} tiles...`);
    
//     for (let i = 0; i < tilesData.length; i++) {
//       const tileData = tilesData[i];
      
//       try {
//         // Step 1: Upload tile
//         const savedTile = await uploadTile(tileData);
        
//         // Step 2: Generate QR code
//         try {
//           const qrCode = await generateTileQRCode(savedTile);
//           await updateTileQRCode(savedTile.id, qrCode);
          
//           results.qrGenerated++;
//           console.log(`✅ Tile ${i + 1}/${totalTiles}: Uploaded with QR`);
          
//         } catch (qrError) {
//           results.qrFailed++;
//           console.warn(`⚠️ Tile ${i + 1}/${totalTiles}: Uploaded, QR failed`);
//         }
        
//         results.successful.push(savedTile);
        
//       } catch (error: any) {
//         results.failed.push({
//           row: i + 1,
//           data: tileData,
//           error: error.message
//         });
//         console.error(`❌ Tile ${i + 1}/${totalTiles}: Failed`);
//       }
      
//       // Update progress
//       const progress = ((i + 1) / totalTiles) * 100;
//       setProgress(Math.round(progress));
//     }
    
//     // Show detailed results
//     const message = `
//       ✅ Successfully uploaded: ${results.successful.length}
//       📱 QR codes generated: ${results.qrGenerated}
//       ⚠️ QR codes failed: ${results.qrFailed}
//       ❌ Tiles failed: ${results.failed.length}
//     `;
    
//     setSuccess(message);
    
//     if (results.failed.length > 0) {
//       console.error('Failed tiles:', results.failed);
//     }
    
//     await onUploadComplete();
    
//   } catch (error: any) {
//     console.error('Bulk upload error:', error);
//     setError('Bulk upload failed. Please try again.');
//   } finally {
//     setLoading(false);
//     setProgress(0);
//   }
// };

//   return (
//     <div className="space-y-6">
//       {/* Instructions */}
//       <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-xl p-6">
//         <div className="flex items-start gap-4">
//           <FileText className="w-8 h-8 text-purple-600 mt-1" />
//           <div className="flex-1">
//             <h3 className="text-xl font-bold text-purple-800 mb-2">CSV Bulk Upload</h3>
//             <p className="text-purple-700 mb-4">
//               Upload multiple tiles using CSV format. Download the template for correct format.
//             </p>
            
//             {/* Required Columns */}
//             <div className="bg-purple-100 rounded-lg p-4 mb-4">
//               <h4 className="font-semibold text-purple-800 mb-2">Required Columns:</h4>
//               <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-purple-700">
//                 <span>• name *</span>
//                 <span>• category *</span>
//                 <span>• size *</span>
//                 <span>• price *</span>
//                 <span>• stock *</span>
//                 <span>• imageUrl *</span>
//                 <span>• textureUrl</span>
//                 <span>• tileCode</span>
//               </div>
//               <p className="text-xs text-purple-600 mt-2">* Required fields</p>
//             </div>

//             {/* Common Sizes */}
//             <div className="mb-4">
//               <p className="text-purple-700 text-sm font-medium mb-2">Common Tile Sizes:</p>
//               <div className="grid grid-cols-3 md:grid-cols-6 gap-2 text-xs">
//                 {commonTileSizes.map((size) => (
//                   <span key={size} className="bg-purple-100 text-purple-800 px-2 py-1 rounded">
//                     {size}
//                   </span>
//                 ))}
//               </div>
//             </div>

//             {/* Category Options */}
//             <div className="mb-4">
//               <p className="text-purple-700 text-sm font-medium mb-1">Category Options:</p>
//               <div className="flex gap-2 text-xs">
//                 <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded">floor</span>
//                 <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded">wall</span>
//                 <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded">both</span>
//               </div>
//             </div>

//             <button
//               onClick={downloadSampleCSV}
//               className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
//             >
//               <Download className="w-4 h-4" />
//               Download Sample CSV
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Upload Progress */}
//       {isUploading && (
//         <div className="bg-white border border-gray-200 rounded-lg p-4">
//           <div className="flex items-center justify-between mb-2">
//             <span className="text-sm font-medium text-gray-700">Processing CSV data...</span>
//             <span className="text-sm text-gray-500">{uploadProgress}%</span>
//           </div>
//           <div className="w-full bg-gray-200 rounded-full h-2">
//             <div 
//               className="bg-purple-600 h-2 rounded-full transition-all duration-300"
//               style={{ width: `${uploadProgress}%` }}
//             ></div>
//           </div>
//           <p className="text-xs text-gray-600 mt-2">
//             {uploadProgress < 25 ? 'Validating data...' :
//              uploadProgress < 50 ? 'Processing tiles...' :
//              'Uploading to database...'}
//           </p>
//         </div>
//       )}

//       {/* File Upload OR Manual Input */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         {/* File Upload */}
//         <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-purple-400 transition-colors">
//           <FileText className="w-8 h-8 text-gray-400 mx-auto mb-4" />
//           <h3 className="text-lg font-semibold text-gray-700 mb-2">Upload CSV File</h3>
//           <p className="text-gray-600 mb-4">Select a CSV file from your computer</p>
          
//           <input
//             ref={fileInputRef}
//             type="file"
//             accept=".csv"
//             onChange={handleFileUpload}
//             className="hidden"
//           />
          
//           <button
//             onClick={() => fileInputRef.current?.click()}
//             className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors mx-auto"
//           >
//             <Upload className="w-4 h-4" />
//             Choose CSV File
//           </button>
//         </div>

//         {/* Manual Input */}
//         <div className="border border-gray-300 rounded-xl p-6">
//           <h3 className="text-lg font-semibold text-gray-700 mb-4">Or Paste CSV Data</h3>
//           <textarea
//             value={csvData}
//             onChange={(e) => setCsvData(e.target.value)}
//             placeholder="Paste your CSV data here..."
//             className="w-full h-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 font-mono text-sm"
//           />
//         </div>
//       </div>

//       {/* Upload Button */}
//       <div className="flex gap-4">
//         <button
//           onClick={handleBulkUpload}
//           disabled={!csvData.trim() || isUploading || !currentUser}
//           className="flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//         >
//           {isUploading ? (
//             <Loader className="w-4 h-4 animate-spin" />
//           ) : (
//             <Upload className="w-4 h-4" />
//           )}
//           {isUploading ? 'Processing...' : 'Upload Tiles'}
//         </button>
        
//         {csvData && (
//           <button
//             onClick={() => setCsvData('')}
//             className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
//           >
//             Clear Data
//           </button>
//         )}
//       </div>

//       {/* Upload Result */}
//       {uploadResult && (
//         <div className={`p-4 rounded-lg border ${
//           uploadResult.errors.length > 0 ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'
//         }`}>
//           <div className="flex items-start gap-3">
//             {uploadResult.errors.length > 0 ? (
//               <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
//             ) : (
//               <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
//             )}
//             <div className="flex-1">
//               <h3 className={`font-semibold mb-2 ${
//                 uploadResult.errors.length > 0 ? 'text-red-800' : 'text-green-800'
//               }`}>
//                 Upload {uploadResult.errors.length > 0 ? 'Failed' : 'Completed'}
//               </h3>
              
//               {uploadResult.success > 0 && (
//                 <p className="text-green-700 text-sm mb-2">
//                   ✅ Successfully uploaded: {uploadResult.success} tiles
//                 </p>
//               )}
              
//               {uploadResult.errors.length > 0 && (
//                 <div className="mt-2">
//                   <p className="text-red-700 text-sm font-medium mb-2">
//                     ❌ Errors found:
//                   </p>
//                   <div className="max-h-40 overflow-y-auto">
//                     <pre className="text-red-600 text-xs whitespace-pre-wrap">
//                       {uploadResult.errors.join('\n')}
//                     </pre>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Tips */}
//       <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
//         <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
//           <Info className="w-5 h-5" />
//           CSV Upload Tips
//         </h4>
//         <div className="space-y-2 text-sm text-gray-700">
//           <p>• Use quotes around text that contains commas: "Modern, Elegant Tile"</p>
//           <p>• Category must be exactly: floor, wall, or both</p>
//           <p>• Price and stock must be numeric values</p>
//           <p>• Image URLs must be valid HTTP/HTTPS links</p>
//           <p>• Tile codes will be auto-generated if not provided</p>
//           <p>• Test with a small batch first (5-10 tiles)</p>
//         </div>
//       </div>
//     </div>
//   );
// };   


// components/BulkUpload.tsx - PRODUCTION READY VERSION
import React, { useState, useRef } from 'react';
import { 
  Upload, FileText, CheckCircle, AlertCircle, Download, 
  Loader, Info, X, AlertTriangle 
} from 'lucide-react';
import { uploadTile, updateTileQRCode } from '../lib/firebaseutils';
import { useAppStore } from '../stores/appStore';
import { generateTileQRCode } from '../utils/qrCodeUtils';

// ===== INTERFACES =====

interface BulkUploadProps {
  onUploadComplete?: () => void;
}

interface ParsedTile {
  name: string;
  category: 'floor' | 'wall' | 'both';
  size: string;
  price: number;
  stock: number;
  imageUrl: string;
  textureUrl?: string;
  tileCode?: string;
  sellerId?: string;
  showroomId?: string;
  inStock?: boolean;
  createdAt?: string;
  updatedAt?: string;
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

export const BulkUpload: React.FC<BulkUploadProps> = ({ onUploadComplete }) => {
  const { currentUser } = useAppStore();
  
  // ===== STATE MANAGEMENT =====
  const [csvData, setCsvData] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null);
  const [showInstructions, setShowInstructions] = useState(true);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ===== CONSTANTS =====
  
  const commonTileSizes = [
    '30x30 cm', '30x60 cm', '40x40 cm', '40x60 cm', '60x60 cm', '60x120 cm',
    '80x80 cm', '10x30 cm', '15x90 cm', '20x120 cm', '25x40 cm', '7.5x15 cm',
    '6x25 cm', '20x20 cm', '100x100 cm', '45x45 cm', '50x50 cm', '75x75 cm'
  ];

  const sampleCSV = `name,category,size,price,stock,imageUrl,textureUrl,tileCode
"Marble White Elite",both,"60x60 cm",2500,100,"https://images.unsplash.com/photo-1615971677499-5467cbab01c0?w=400","https://images.unsplash.com/photo-1615971677499-5467cbab01c0?w=400","MWE001"
"Dark Wood Pattern",floor,"20x120 cm",1800,50,"https://images.unsplash.com/photo-1516455590571-18256e5bb9ff?w=400","https://images.unsplash.com/photo-1516455590571-18256e5bb9ff?w=400","DWP002"
"Modern Gray Stone",both,"30x60 cm",2200,75,"https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400","https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400","MGS003"
"Ceramic Subway White",wall,"10x30 cm",1200,200,"https://images.unsplash.com/photo-1604709177225-055f99402ea3?w=400","","CSW004"
"Polished Concrete",floor,"80x80 cm",2800,30,"https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?w=400","https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?w=400","PC005"`;

  // ===== HELPER FUNCTIONS =====

  /**
   * Parse CSV line handling quotes and commas properly
   */
  const parseCSVLine = (line: string): string[] => {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    
    result.push(current.trim());
    return result;
  };

  /**
   * Validate URL format
   */
  const isValidUrl = (url: string): boolean => {
    if (!url) return false;
    try {
      const urlObj = new URL(url);
      return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
    } catch {
      return false;
    }
  };

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
   * Parse and validate CSV data
   */
  const parseCsvData = (csv: string): { tiles: ParsedTile[]; parseErrors: string[] } => {
    const lines = csv.trim().split('\n').filter(line => line.trim());
    
    if (lines.length < 2) {
      throw new Error('CSV must have at least a header row and one data row');
    }

    const headers = parseCSVLine(lines[0]).map(h => h.toLowerCase().trim());
    const requiredHeaders = ['name', 'category', 'size', 'price', 'stock', 'imageurl'];
    
    // Validate required headers
    const missingHeaders = requiredHeaders.filter(required => 
      !headers.includes(required)
    );
    
    if (missingHeaders.length > 0) {
      throw new Error(`Missing required columns: ${missingHeaders.join(', ')}`);
    }

    const tiles: ParsedTile[] = [];
    const parseErrors: string[] = [];

    for (let i = 1; i < lines.length; i++) {
      const lineContent = lines[i].trim();
      if (!lineContent) continue; // Skip empty lines
      
      try {
        const values = parseCSVLine(lineContent);
        
        if (values.length !== headers.length) {
          throw new Error(`Column count mismatch (expected ${headers.length}, got ${values.length})`);
        }

        const tile: any = {};

        // Map values to headers
        headers.forEach((header, index) => {
          const value = values[index]?.trim() || '';
          
          switch (header) {
            case 'name':
              if (!value) throw new Error('Name is required');
              tile.name = value;
              break;
              
            case 'category':
              const cat = value.toLowerCase();
              if (!['floor', 'wall', 'both'].includes(cat)) {
                throw new Error(`Invalid category: "${value}". Must be floor, wall, or both`);
              }
              tile.category = cat;
              break;
              
            case 'size':
              if (!value) throw new Error('Size is required');
              tile.size = value;
              break;
              
            case 'price':
              const price = parseFloat(value.replace(/[^\d.]/g, ''));
              if (isNaN(price) || price <= 0) {
                throw new Error(`Invalid price: "${value}"`);
              }
              tile.price = price;
              break;
              
            case 'stock':
              const stock = parseInt(value.replace(/[^\d]/g, ''));
              if (isNaN(stock) || stock < 0) {
                throw new Error(`Invalid stock: "${value}"`);
              }
              tile.stock = stock;
              tile.inStock = stock > 0;
              break;
              
            case 'imageurl':
              if (!isValidUrl(value)) {
                throw new Error(`Invalid image URL: "${value}"`);
              }
              tile.imageUrl = value;
              break;
              
            case 'textureurl':
              if (value && !isValidUrl(value)) {
                throw new Error(`Invalid texture URL: "${value}"`);
              }
              tile.textureUrl = value || '';
              break;
              
            case 'tilecode':
              tile.tileCode = value || generateTileCode(tile.name, i);
              break;
              
            default:
              tile[header] = value;
          }
        });

        // Add metadata
        tile.sellerId = currentUser?.user_id;
        tile.showroomId = currentUser?.user_id;
        tile.createdAt = new Date().toISOString();
        tile.updatedAt = new Date().toISOString();

        tiles.push(tile as ParsedTile);
        
      } catch (error: any) {
        parseErrors.push(`Row ${i + 1}: ${error.message}`);
      }
    }

    return { tiles, parseErrors };
  };

  /**
   * Upload tiles with QR code generation
   */
  const uploadTilesWithQR = async (tiles: ParsedTile[]): Promise<UploadResults> => {
    const totalTiles = tiles.length;
    const results: UploadResults = {
      successful: [],
      failed: [],
      qrGenerated: 0,
      qrFailed: 0
    };
    
    console.log(`📦 Starting upload of ${totalTiles} tiles with QR generation...`);
    
    for (let i = 0; i < totalTiles; i++) {
      const tileData = tiles[i];
      
      try {
        // Step 1: Upload tile to database
        console.log(`📤 [${i + 1}/${totalTiles}] Uploading: ${tileData.name}`);
        const savedTile = await uploadTile(tileData);
        
        if (!savedTile?.id) {
          throw new Error('Upload failed - no tile ID returned from database');
        }

        console.log(`✅ [${i + 1}/${totalTiles}] Tile saved with ID: ${savedTile.id}`);

        // Step 2: Generate and save QR code
        try {
          console.log(`📱 [${i + 1}/${totalTiles}] Generating QR code...`);
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
          row: i + 1,
          data: tileData,
          error: error.message || 'Unknown error'
        });
        console.error(`❌ [${i + 1}/${totalTiles}] Upload failed: ${error.message}`);
      }
      
      // Update progress (10% base + 90% upload progress)
      const progress = 10 + ((i + 1) / totalTiles) * 90;
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
   * Handle CSV file upload
   */
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.csv')) {
      setUploadResult({
        success: 0,
        errors: ['Please select a valid CSV file (.csv extension required)']
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      setUploadResult({
        success: 0,
        errors: ['File too large. Maximum size is 5MB']
      });
      return;
    }

    try {
      const text = await file.text();
      setCsvData(text);
      setUploadResult(null);
      console.log(`✅ CSV file loaded: ${file.name} (${file.size} bytes)`);
    } catch (error: any) {
      setUploadResult({
        success: 0,
        errors: [`Failed to read file: ${error.message}`]
      });
    }
    
    // Clear file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  /**
   * Download sample CSV template
   */
  const downloadSampleCSV = () => {
    try {
      const blob = new Blob([sampleCSV], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `tile_upload_sample_${Date.now()}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      console.log('✅ Sample CSV downloaded');
    } catch (error) {
      console.error('Failed to download sample CSV:', error);
      alert('Failed to download sample CSV. Please try again.');
    }
  };

  /**
   * Main bulk upload handler
   */
  const handleBulkUpload = async () => {
    // Validation
    if (!csvData.trim()) {
      setUploadResult({
        success: 0,
        errors: ['Please provide CSV data by uploading a file or pasting content']
      });
      return;
    }

    if (!currentUser) {
      setUploadResult({
        success: 0,
        errors: ['User not authenticated. Please log in and try again.']
      });
      return;
    }

    // Reset states
    setIsUploading(true);
    setUploadResult(null);
    setUploadProgress(0);

    try {
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('🚀 BULK UPLOAD PROCESS START');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('📅 Started at:', new Date().toISOString());
      console.log('👤 User:', currentUser.email);

      // Step 1: Parse and validate CSV (0-10%)
      console.log('📋 Step 1/3: Parsing and validating CSV data...');
      setUploadProgress(5);
      
      const { tiles, parseErrors } = parseCsvData(csvData);
      
      console.log(`✅ Parsing complete:`);
      console.log(`   - Valid tiles: ${tiles.length}`);
      console.log(`   - Parse errors: ${parseErrors.length}`);
      
      if (tiles.length === 0) {
        throw new Error('No valid tiles found in CSV data. Please check the format and try again.');
      }

      setUploadProgress(10);

      // Step 2: Upload tiles with QR generation (10-100%)
      console.log('📤 Step 2/3: Uploading tiles to database with QR codes...');
      
      const results = await uploadTilesWithQR(tiles);

      setUploadProgress(100);

      // Step 3: Compile results
      console.log('📊 Step 3/3: Compiling results...');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('📈 UPLOAD SUMMARY:');
      console.log(`   ✅ Successfully uploaded: ${results.successful.length}`);
      console.log(`   📱 QR codes generated: ${results.qrGenerated}`);
      console.log(`   ⚠️  QR codes failed: ${results.qrFailed}`);
      console.log(`   ❌ Upload failures: ${results.failed.length}`);
      console.log(`   📋 Parse errors: ${parseErrors.length}`);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

      // Build comprehensive error messages
      const errorMessages: string[] = [];
      
      // Parse errors
      if (parseErrors.length > 0) {
        errorMessages.push(`⚠️ CSV Parsing Issues (${parseErrors.length} rows):`);
        const displayErrors = parseErrors.slice(0, 10);
        errorMessages.push(...displayErrors);
        if (parseErrors.length > 10) {
          errorMessages.push(`... and ${parseErrors.length - 10} more parsing errors`);
        }
        errorMessages.push(''); // Empty line for separation
      }
      
      // Upload failures
      if (results.failed.length > 0) {
        errorMessages.push(`❌ Upload Failures (${results.failed.length} tiles):`);
        const displayFailed = results.failed.slice(0, 10);
        displayFailed.forEach(fail => {
          errorMessages.push(`   Row ${fail.row}: ${fail.error}`);
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

      // Clear CSV data on successful uploads
      if (results.successful.length > 0) {
        console.log('🧹 Clearing CSV data...');
        setCsvData('');
      }

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

      console.log('✅ BULK UPLOAD PROCESS COMPLETED');
      console.log('📅 Completed at:', new Date().toISOString());
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    } catch (error: any) {
      console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.error('❌ BULK UPLOAD PROCESS FAILED');
      console.error('Error:', error);
      console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      
      setUploadResult({
        success: 0,
        errors: [error.message || 'Upload failed. Please check your data and try again.']
      });
    } finally {
      setIsUploading(false);
      setTimeout(() => setUploadProgress(0), 1000); // Keep progress visible briefly
    }
  };

  /**
   * Clear all data and reset
   */
  const handleClearData = () => {
    setCsvData('');
    setUploadResult(null);
    setUploadProgress(0);
    console.log('🧹 CSV data cleared');
  };

  // ===== RENDER =====

  return (
    <div className="space-y-6">
      {/* Instructions Section */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-xl p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4 flex-1">
            <FileText className="w-8 h-8 text-purple-600 mt-1 flex-shrink-0" />
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xl font-bold text-purple-800">CSV Bulk Upload with QR Generation</h3>
                <button
                  onClick={() => setShowInstructions(!showInstructions)}
                  className="text-purple-600 hover:text-purple-800 text-sm font-medium"
                >
                  {showInstructions ? 'Hide' : 'Show'} Instructions
                </button>
              </div>
              
              <p className="text-purple-700 mb-4">
                Upload multiple tiles at once using CSV format. QR codes will be automatically generated for each tile.
              </p>
              
              {showInstructions && (
                <>
                  {/* Required Columns */}
                  <div className="bg-purple-100 rounded-lg p-4 mb-4">
                    <h4 className="font-semibold text-purple-800 mb-2">Required CSV Columns:</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-purple-700">
                      <span className="font-medium">• name *</span>
                      <span className="font-medium">• category *</span>
                      <span className="font-medium">• size *</span>
                      <span className="font-medium">• price *</span>
                      <span className="font-medium">• stock *</span>
                      <span className="font-medium">• imageUrl *</span>
                      <span>• textureUrl</span>
                      <span>• tileCode</span>
                    </div>
                    <p className="text-xs text-purple-600 mt-2">* Required fields | Other fields are optional</p>
                  </div>

                  {/* Common Sizes */}
                  <div className="mb-4">
                    <p className="text-purple-700 text-sm font-medium mb-2">Common Tile Sizes:</p>
                    <div className="grid grid-cols-3 md:grid-cols-6 gap-2 text-xs">
                      {commonTileSizes.slice(0, 12).map((size) => (
                        <span key={size} className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-center">
                          {size}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Category Options */}
                  <div className="mb-4">
                    <p className="text-purple-700 text-sm font-medium mb-2">Valid Categories:</p>
                    <div className="flex gap-2 text-xs">
                      <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded font-medium">floor</span>
                      <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded font-medium">wall</span>
                      <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded font-medium">both</span>
                    </div>
                  </div>
                </>
              )}

              <button
                onClick={downloadSampleCSV}
                className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors shadow-sm"
              >
                <Download className="w-4 h-4" />
                Download Sample CSV Template
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Upload Progress */}
      {isUploading && (
        <div className="bg-white border border-purple-200 rounded-lg p-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Loader className="w-4 h-4 animate-spin text-purple-600" />
              Processing bulk upload...
            </span>
            <span className="text-sm font-bold text-purple-600">{uploadProgress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-purple-500 to-blue-500 h-3 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-600 mt-2">
            {uploadProgress < 10 ? '📋 Parsing and validating CSV data...' :
             uploadProgress < 30 ? '📤 Uploading tiles to database...' :
             uploadProgress < 70 ? '📱 Generating QR codes...' :
             uploadProgress < 95 ? '✅ Finalizing uploads...' :
             '🎉 Almost done!'}
          </p>
        </div>
      )}

      {/* File Upload & Manual Input */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* File Upload */}
        <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-purple-400 hover:bg-purple-50 transition-all">
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Upload CSV File</h3>
          <p className="text-gray-600 mb-4 text-sm">
            Select a CSV file from your computer
          </p>
          
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,text/csv"
            onChange={handleFileUpload}
            disabled={isUploading}
            className="hidden"
            aria-label="Upload CSV file"
          />
          
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors mx-auto shadow-sm"
          >
            <Upload className="w-4 h-4" />
            Choose CSV File
          </button>
          
          <p className="text-xs text-gray-500 mt-3">
            Maximum file size: 5MB
          </p>
        </div>

        {/* Manual Input */}
        <div className="border border-gray-300 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Or Paste CSV Data</h3>
          <textarea
            value={csvData}
            onChange={(e) => setCsvData(e.target.value)}
            placeholder="Paste your CSV data here...&#10;&#10;name,category,size,price,stock,imageUrl&#10;&quot;Tile Name&quot;,floor,&quot;60x60 cm&quot;,2500,100,&quot;https://...&quot;"
            disabled={isUploading}
            className="w-full h-40 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 disabled:bg-gray-100 disabled:cursor-not-allowed font-mono text-sm resize-none"
            aria-label="CSV data input"
          />
          {csvData && (
            <p className="text-xs text-gray-600 mt-2">
              {csvData.split('\n').filter(l => l.trim()).length - 1} rows detected
            </p>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 flex-wrap">
        <button
          onClick={handleBulkUpload}
          disabled={!csvData.trim() || isUploading || !currentUser}
          className="flex items-center gap-2 bg-purple-600 text-white px-8 py-3 rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-md font-medium"
        >
          {isUploading ? (
            <>
              <Loader className="w-5 h-5 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <Upload className="w-5 h-5" />
              Upload Tiles with QR Codes
            </>
          )}
        </button>
        
        {csvData && !isUploading && (
          <button
            onClick={handleClearData}
            className="flex items-center gap-2 px-6 py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <X className="w-4 h-4" />
            Clear Data
          </button>
        )}

        {!currentUser && (
          <div className="flex items-center gap-2 text-red-600 text-sm">
            <AlertTriangle className="w-4 h-4" />
            Please log in to upload tiles
          </div>
        )}
      </div>

      {/* Upload Results */}
      {uploadResult && (
        <div className={`rounded-xl border-2 p-6 ${
          uploadResult.success > 0 
            ? uploadResult.errors.length > 0
              ? 'bg-yellow-50 border-yellow-300'
              : 'bg-green-50 border-green-300'
            : 'bg-red-50 border-red-300'
        }`}>
          <div className="flex items-start gap-4">
            {uploadResult.success > 0 ? (
              uploadResult.errors.length > 0 ? (
                <AlertTriangle className="w-6 h-6 text-yellow-600 mt-0.5 flex-shrink-0" />
              ) : (
                <CheckCircle className="w-6 h-6 text-green-600 mt-0.5 flex-shrink-0" />
              )
            ) : (
              <AlertCircle className="w-6 h-6 text-red-600 mt-0.5 flex-shrink-0" />
            )}
            
            <div className="flex-1">
              <h3 className={`text-lg font-bold mb-3 ${
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
                <div className="mb-4 p-4 bg-white rounded-lg border border-green-200">
                  <p className="text-green-700 font-semibold mb-2 text-lg">
                    ✅ Successfully uploaded: {uploadResult.success} tiles
                  </p>
                  {uploadResult.details && (
                    <div className="text-sm text-green-600 space-y-1">
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
                  <p className={`text-sm font-semibold mb-2 ${
                    uploadResult.success > 0 ? 'text-yellow-700' : 'text-red-700'
                  }`}>
                    {uploadResult.success > 0 ? '⚠️ Warnings:' : '❌ Errors:'}
                  </p>
                  <div className="max-h-80 overflow-y-auto bg-white rounded-lg p-4 border border-gray-200">
                    <div className="space-y-1 font-mono text-xs">
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
              onClick={() => setUploadResult(null)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Close result"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Tips & Best Practices */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
        <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Info className="w-5 h-5 text-blue-600" />
          CSV Upload Tips & Best Practices
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
          <div>
            <p className="font-semibold text-gray-800 mb-2">✅ Do:</p>
            <ul className="space-y-1">
              <li>• Use quotes for text with commas: "Modern, Elegant Tile"</li>
              <li>• Use exact category values: floor, wall, or both</li>
              <li>• Provide valid HTTP/HTTPS image URLs</li>
              <li>• Use numeric values for price and stock (no symbols)</li>
              <li>• Test with 5-10 tiles first before bulk upload</li>
              <li>• Keep file size under 5MB</li>
            </ul>
          </div>
          <div>
            <p className="font-semibold text-gray-800 mb-2">❌ Don't:</p>
            <ul className="space-y-1">
              <li>• Include currency symbols in price (₹, $)</li>
              <li>• Use invalid category names (FLOOR, Floor Tile, etc.)</li>
              <li>• Use local file paths for images</li>
              <li>• Leave required fields empty</li>
              <li>• Mix column order from sample template</li>
              <li>• Upload files larger than 5MB</li>
            </ul>
          </div>
        </div>
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-blue-800 text-sm">
            <strong>💡 Pro Tip:</strong> QR codes are automatically generated for each tile during upload. 
            If QR generation fails for some tiles, you can generate them later from the QR Codes tab.
          </p>
        </div>
      </div>
    </div>
  );
};