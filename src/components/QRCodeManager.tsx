// import React, { useState, useEffect } from 'react';
// import { 
//   QrCode, Download, RefreshCw, Eye, Package, AlertCircle, 
//   CheckCircle, Loader, Zap, BarChart
// } from 'lucide-react';
// import { Tile } from '../types';
// import { useAppStore } from '../stores/appStore';
// import { 
//   generateTileQRCode, downloadQRCodesAsZip, generateBulkQRCodes,
//   getQRCodeAnalytics
// } from '../utils/qrCodeUtils';
// import { updateTileQRCode, getSellerProfile } from '../lib/firebaseutils';

// interface QRCodeManagerProps {
//   tiles: Tile[];
//   sellerId?: string;
//   onQRCodeGenerated?: () => void;
// }

// export const QRCodeManager: React.FC<QRCodeManagerProps> = ({ 
//   tiles, 
//   sellerId, 
//   onQRCodeGenerated 
// }) => {
//   const { currentUser } = useAppStore();
//   const [loading, setLoading] = useState(false);
//   const [generatingQR, setGeneratingQR] = useState<string | null>(null);
//   const [qrCodes, setQrCodes] = useState<{ [tileId: string]: string }>({});
//   const [sellerProfile, setSellerProfile] = useState<any>(null);
//   const [bulkProgress, setBulkProgress] = useState(0);
//   const [downloadProgress, setDownloadProgress] = useState(0);
//   const [error, setError] = useState<string | null>(null);
//   const [success, setSuccess] = useState<string | null>(null);

//   useEffect(() => {
//     loadSellerProfile();
//     loadExistingQRCodes();
//   }, [currentUser, tiles]);

//   // Clear messages after 5 seconds
//   useEffect(() => {
//     if (error || success) {
//       const timer = setTimeout(() => {
//         setError(null);
//         setSuccess(null);
//       }, 5000);
//       return () => clearTimeout(timer);
//     }
//   }, [error, success]);

//   const loadSellerProfile = async () => {
//     if (!currentUser) return;
//     try {
//       const profile = await getSellerProfile(currentUser.user_id);
//       setSellerProfile(profile);
//     } catch (error) {
//       console.error('Error loading seller profile:', error);
//     }
//   };

//   const loadExistingQRCodes = () => {
//     const existingQRCodes: { [tileId: string]: string } = {};
//     tiles.forEach(tile => {
//       if (tile.qrCode) {
//         existingQRCodes[tile.id] = tile.qrCode;
//       }
//     });
//     setQrCodes(existingQRCodes);
//   };

//   const generateSingleQRCode = async (tile: Tile) => {
//     setGeneratingQR(tile.id);
//     setError(null);
    
//     try {
//       const qrCode = await generateTileQRCode(tile);
//       await updateTileQRCode(tile.id, qrCode);
//       setQrCodes(prev => ({ ...prev, [tile.id]: qrCode }));
//       setSuccess(`QR code generated for ${tile.name}`);
//       onQRCodeGenerated?.();
//     } catch (error: any) {
//       console.error('Error generating QR code:', error);
//       setError(`Failed to generate QR code for ${tile.name}. Please try again.`);
//     } finally {
//       setGeneratingQR(null);
//     }
//   };

//   const generateAllQRCodes = async () => {
//     setLoading(true);
//     setBulkProgress(0);
//     setError(null);

//     try {
//       const tilesWithoutQR = tiles.filter(tile => !qrCodes[tile.id]);
      
//       if (tilesWithoutQR.length === 0) {
//         setSuccess('All tiles already have QR codes!');
//         return;
//       }

//       const newQRCodes = await generateBulkQRCodes(tilesWithoutQR, setBulkProgress);
      
//       // Update database with new QR codes
//       for (const [tileId, qrCode] of Object.entries(newQRCodes)) {
//         try {
//           await updateTileQRCode(tileId, qrCode);
//         } catch (error) {
//           console.error(`Error updating QR code for tile ${tileId}:`, error);
//         }
//       }
      
//       setQrCodes(prev => ({ ...prev, ...newQRCodes }));
//       setSuccess(`Successfully generated ${Object.keys(newQRCodes).length} QR codes!`);
//       onQRCodeGenerated?.();
//     } catch (error: any) {
//       console.error('Error generating QR codes:', error);
//       setError('Some QR codes failed to generate. Please try again.');
//     } finally {
//       setLoading(false);
//       setBulkProgress(0);
//     }
//   };

//   const downloadAllQRCodes = async () => {
//     setLoading(true);
//     setDownloadProgress(0);
//     setError(null);
    
//     try {
//       const businessName = sellerProfile?.business_name || 'TileShowroom';
//       const tilesWithQR = tiles.map(tile => ({
//         ...tile,
//         qrCode: qrCodes[tile.id]
//       })).filter(tile => tile.qrCode);

//       if (tilesWithQR.length === 0) {
//         setError('No QR codes available. Please generate QR codes first.');
//         return;
//       }

//       await downloadQRCodesAsZip(tilesWithQR, businessName, setDownloadProgress);
//       setSuccess(`QR codes package downloaded successfully! (${tilesWithQR.length} codes)`);
//     } catch (error: any) {
//       console.error('Error downloading QR codes:', error);
//       setError('Failed to download QR codes. Please try again.');
//     } finally {
//       setLoading(false);
//       setDownloadProgress(0);
//     }
//   };

//   const previewQRCode = (tile: Tile) => {
//     if (!qrCodes[tile.id]) return;
    
//     const newWindow = window.open('', '_blank', 'width=600,height=700');
//     if (newWindow) {
//       newWindow.document.write(`
//         <!DOCTYPE html>
//         <html>
//           <head>
//             <title>QR Code - ${tile.name}</title>
//             <style>
//               body { 
//                 font-family: Arial, sans-serif; 
//                 text-align: center; 
//                 padding: 20px;
//                 background: #f5f5f5;
//               }
//               .container {
//                 background: white;
//                 max-width: 500px;
//                 margin: 0 auto;
//                 padding: 30px;
//                 border-radius: 10px;
//                 box-shadow: 0 4px 6px rgba(0,0,0,0.1);
//               }
//               .qr-image { 
//                 max-width: 300px; 
//                 width: 100%;
//                 border: 2px solid #ddd;
//                 border-radius: 8px;
//                 margin: 20px 0;
//               }
//               .tile-info {
//                 background: #f8f9fa;
//                 padding: 15px;
//                 border-radius: 8px;
//                 margin: 20px 0;
//                 text-align: left;
//               }
//               .print-btn {
//                 background: #22c55e;
//                 color: white;
//                 border: none;
//                 padding: 10px 20px;
//                 border-radius: 5px;
//                 cursor: pointer;
//                 font-size: 16px;
//                 margin: 10px;
//               }
//               .print-btn:hover {
//                 background: #16a34a;
//               }
//               @media print {
//                 body { background: white; }
//                 .container { box-shadow: none; }
//                 .print-btn { display: none; }
//               }
//             </style>
//           </head>
//           <body>
//             <div class="container">
//               <h1>${tile.name}</h1>
//               <img src="${qrCodes[tile.id]}" alt="QR Code" class="qr-image" />
//               <div class="tile-info">
//                 <p><strong>Tile Code:</strong> ${tile.tileCode || 'N/A'}</p>
//                 <p><strong>Size:</strong> ${tile.size}</p>
//                 <p><strong>Category:</strong> ${tile.category}</p>
//                 <p><strong>Price:</strong> ₹${tile.price.toLocaleString()}</p>
//                 <p><strong>Stock:</strong> ${tile.stock} pieces</p>
//               </div>
//               <button class="print-btn" onclick="window.print()">Print QR Code</button>
//               <button class="print-btn" onclick="window.close()">Close</button>
//               <p style="font-size: 12px; color: #666; margin-top: 20px;">
//                 Scan with mobile device to view in 3D visualization
//               </p>
//             </div>
//           </body>
//         </html>
//       `);
//       newWindow.document.close();
//     }
//   };

//   const analytics = getQRCodeAnalytics(tiles);
//   const tilesWithQR = tiles.filter(tile => qrCodes[tile.id]);
//   const tilesWithoutQR = tiles.filter(tile => !qrCodes[tile.id]);

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-6">
//         <div className="flex items-start gap-4">
//           <QrCode className="w-8 h-8 text-purple-600 mt-1" />
//           <div className="flex-1">
//             <h3 className="text-xl font-bold text-purple-800 mb-2">QR Code Management</h3>
//             <p className="text-purple-700 mb-4">
//               Generate and download QR codes for your tiles. Customers can scan these codes with their mobile devices
//               to view tiles in 3D visualization and room environments.
//             </p>
            
//             {/* Analytics Cards */}
//             <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
//               <div className="bg-white rounded-lg p-3 border border-purple-200">
//                 <div className="flex items-center gap-2">
//                   <Package className="w-4 h-4 text-purple-600" />
//                   <span className="text-purple-800 font-medium">Total Tiles</span>
//                 </div>
//                 <p className="text-2xl font-bold text-purple-900 mt-1">{analytics.total}</p>
//               </div>
              
//               <div className="bg-white rounded-lg p-3 border border-green-200">
//                 <div className="flex items-center gap-2">
//                   <CheckCircle className="w-4 h-4 text-green-600" />
//                   <span className="text-green-800 font-medium">With QR Codes</span>
//                 </div>
//                 <p className="text-2xl font-bold text-green-900 mt-1">{analytics.withQR}</p>
//               </div>
              
//               <div className="bg-white rounded-lg p-3 border border-orange-200">
//                 <div className="flex items-center gap-2">
//                   <AlertCircle className="w-4 h-4 text-orange-600" />
//                   <span className="text-orange-800 font-medium">Missing QR</span>
//                 </div>
//                 <p className="text-2xl font-bold text-orange-900 mt-1">{analytics.withoutQR}</p>
//               </div>
              
//               <div className="bg-white rounded-lg p-3 border border-blue-200">
//                 <div className="flex items-center gap-2">
//                   <BarChart className="w-4 h-4 text-blue-600" />
//                   <span className="text-blue-800 font-medium">Completion</span>
//                 </div>
//                 <p className="text-2xl font-bold text-blue-900 mt-1">{analytics.percentage}%</p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Alert Messages */}
//       {error && (
//         <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
//           <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
//           <div>
//             <p className="text-red-800 font-medium">Error</p>
//             <p className="text-red-700 text-sm">{error}</p>
//           </div>
//         </div>
//       )}

//       {success && (
//         <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
//           <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
//           <div>
//             <p className="text-green-800 font-medium">Success</p>
//             <p className="text-green-700 text-sm">{success}</p>
//           </div>
//         </div>
//       )}

//       {/* Action Buttons */}
//       <div className="flex flex-wrap gap-4">
//         <button
//           onClick={generateAllQRCodes}
//           disabled={loading || tilesWithoutQR.length === 0}
//           className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//         >
//           {loading && bulkProgress > 0 ? (
//             <Loader className="w-4 h-4 animate-spin" />
//           ) : (
//             <Zap className="w-4 h-4" />
//           )}
//           {loading && bulkProgress > 0 ? 'Generating...' : `Generate Missing QR Codes (${tilesWithoutQR.length})`}
//         </button>

//         <button
//           onClick={downloadAllQRCodes}
//           disabled={loading || tilesWithQR.length === 0}
//           className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//         >
//           {loading && downloadProgress > 0 ? (
//             <Loader className="w-4 h-4 animate-spin" />
//           ) : (
//             <Download className="w-4 h-4" />
//           )}
//           {loading && downloadProgress > 0 ? 'Preparing...' : `Download QR Package (${tilesWithQR.length})`}
//         </button>
//       </div>

//       {/* Progress Bars */}
//       {loading && bulkProgress > 0 && (
//         <div className="bg-white border border-gray-200 rounded-lg p-4">
//           <div className="flex items-center justify-between mb-2">
//             <span className="text-sm font-medium text-gray-700">Generating QR Codes...</span>
//             <span className="text-sm text-gray-500">{Math.round(bulkProgress)}%</span>
//           </div>
//           <div className="w-full bg-gray-200 rounded-full h-2">
//             <div 
//               className="bg-blue-600 h-2 rounded-full transition-all duration-300"
//               style={{ width: `${bulkProgress}%` }}
//             ></div>
//           </div>
//         </div>
//       )}

//       {loading && downloadProgress > 0 && (
//         <div className="bg-white border border-gray-200 rounded-lg p-4">
//           <div className="flex items-center justify-between mb-2">
//             <span className="text-sm font-medium text-gray-700">Preparing Download Package...</span>
//             <span className="text-sm text-gray-500">{Math.round(downloadProgress)}%</span>
//           </div>
//           <div className="w-full bg-gray-200 rounded-full h-2">
//             <div 
//               className="bg-green-600 h-2 rounded-full transition-all duration-300"
//               style={{ width: `${downloadProgress}%` }}
//             ></div>
//           </div>
//         </div>
//       )}

//       {/* Tiles Grid */}
//       <div className="bg-white border border-gray-200 rounded-xl p-6">
//         <h4 className="text-lg font-semibold text-gray-800 mb-4">Tile QR Codes</h4>
        
//         {tiles.length === 0 ? (
//           <div className="text-center py-8">
//             <QrCode className="w-12 h-12 text-gray-400 mx-auto mb-4" />
//             <p className="text-gray-500">No tiles found. Add some tiles first to generate QR codes.</p>
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//             {tiles.map((tile) => {
//               const hasQR = qrCodes[tile.id];
//               const isGenerating = generatingQR === tile.id;
              
//               return (
//                 <div key={tile.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
//                   <div className="flex items-start gap-3 mb-3">
//                     <img
//                       src={tile.imageUrl}
//                       alt={tile.name}
//                       className="w-16 h-16 object-cover rounded-lg"
//                       onError={(e) => {
//                         (e.target as HTMLImageElement).src = '/placeholder-tile.png';
//                       }}
//                     />
//                     <div className="flex-1 min-w-0">
//                       <h5 className="font-medium text-gray-800 truncate">{tile.name}</h5>
//                       <p className="text-sm text-gray-600">{tile.size}</p>
//                       <p className="text-sm text-gray-500 capitalize">{tile.category}</p>
//                       {tile.tileCode && (
//                         <p className="text-xs text-gray-400 font-mono">{tile.tileCode}</p>
//                       )}
//                     </div>
//                   </div>
                  
//                   <div className="flex items-center justify-between mb-3">
//                     <div className="flex items-center gap-2">
//                       {hasQR ? (
//                         <>
//                           <CheckCircle className="w-4 h-4 text-green-600" />
//                           <span className="text-sm text-green-700 font-medium">QR Ready</span>
//                         </>
//                       ) : (
//                         <>
//                           <AlertCircle className="w-4 h-4 text-orange-600" />
//                           <span className="text-sm text-orange-700">No QR Code</span>
//                         </>
//                       )}
//                     </div>
                    
//                     <div className="flex items-center gap-1">
//                       <span className={`
//                         px-2 py-1 rounded-full text-xs font-medium
//                         ${tile.inStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
//                       `}>
//                         {tile.inStock ? 'In Stock' : 'Out of Stock'}
//                       </span>
//                     </div>
//                   </div>
                  
//                   <div className="flex gap-2">
//                     {hasQR && (
//                       <button
//                         onClick={() => previewQRCode(tile)}
//                         className="flex-1 flex items-center justify-center gap-1 p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors text-sm"
//                         title="Preview QR Code"
//                       >
//                         <Eye className="w-4 h-4" />
//                         Preview
//                       </button>
//                     )}
                    
//                     <button
//                       onClick={() => generateSingleQRCode(tile)}
//                       disabled={isGenerating}
//                       className="flex-1 flex items-center justify-center gap-1 p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors disabled:opacity-50 text-sm"
//                       title={hasQR ? "Regenerate QR Code" : "Generate QR Code"}
//                     >
//                       {isGenerating ? (
//                         <Loader className="w-4 h-4 animate-spin" />
//                       ) : (
//                         <RefreshCw className="w-4 h-4" />
//                       )}
//                       {isGenerating ? 'Gen...' : hasQR ? 'Regen' : 'Generate'}
//                     </button>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         )}
//       </div>

//       {/* Implementation Guide */}
//       <div className="bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-xl p-6">
//         <h4 className="text-lg font-semibold text-gray-800 mb-3">QR Code Implementation Guide</h4>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-700">
//           <div>
//             <h5 className="font-semibold text-gray-800 mb-2">🖨️ Printing Guidelines</h5>
//             <ul className="space-y-1">
//               <li>• Minimum size: 2x2 inches (5x5 cm)</li>
//               <li>• Recommended: 3x3 inches (7.5x7.5 cm)</li>
//               <li>• Use high-quality printer (300 DPI+)</li>
//               <li>• Print on durable sticker paper</li>
//               <li>• Test scan before mass printing</li>
//             </ul>
//           </div>
//           <div>
//             <h5 className="font-semibold text-gray-800 mb-2">📍 Placement Tips</h5>
//             <ul className="space-y-1">
//               <li>• Attach to tile corners or edges</li>
//               <li>• Ensure flat surface placement</li>
//               <li>• Keep codes clean and visible</li>
//               <li>• Avoid curved or reflective surfaces</li>
//               <li>• Provide adequate lighting</li>
//             </ul>
//           </div>
//         </div>
        
//         <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
//           <p className="text-blue-800 text-sm">
//             <strong>💡 Pro Tip:</strong> Train your staff about the QR feature and place simple scanning instructions 
//             near tile displays to encourage customer engagement.
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };   
import React, { useState, useEffect } from 'react';
import { 
  QrCode, Download, RefreshCw, Eye, Package, AlertCircle, 
  CheckCircle, Loader, Zap, BarChart
} from 'lucide-react';
import { Tile } from '../types';
import { useAppStore } from '../stores/appStore';
import { 
  generateTileQRCode, downloadQRCodesAsZip, generateBulkQRCodes,
  getQRCodeAnalytics
} from '../utils/qrCodeUtils';
import { updateTileQRCode, getSellerProfile } from '../lib/firebaseutils';

interface QRCodeManagerProps {
  tiles: Tile[];
  sellerId?: string;
  onQRCodeGenerated?: () => void;
}

export const QRCodeManager: React.FC<QRCodeManagerProps> = ({ 
  tiles, 
  sellerId, 
  onQRCodeGenerated 
}) => {
  const { currentUser } = useAppStore();
  const [loading, setLoading] = useState(false);
  const [generatingQR, setGeneratingQR] = useState<string | null>(null);
  const [qrCodes, setQrCodes] = useState<{ [tileId: string]: string }>({});
  const [sellerProfile, setSellerProfile] = useState<any>(null);
  const [bulkProgress, setBulkProgress] = useState(0);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    loadSellerProfile();
    loadExistingQRCodes();
  }, [currentUser, tiles]);

  // Clear messages after 5 seconds
  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError(null);
        setSuccess(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  const loadSellerProfile = async () => {
    if (!currentUser) return;
    try {
      const profile = await getSellerProfile(currentUser.user_id);
      setSellerProfile(profile);
    } catch (error) {
      console.error('Error loading seller profile:', error);
    }
  };

  const loadExistingQRCodes = () => {
    const existingQRCodes: { [tileId: string]: string } = {};
    tiles.forEach(tile => {
      if (tile.qrCode) {
        existingQRCodes[tile.id] = tile.qrCode;
      }
    });
    setQrCodes(existingQRCodes);
  };

  const generateSingleQRCode = async (tile: Tile) => {
    setGeneratingQR(tile.id);
    setError(null);
    
    try {
      const qrCode = await generateTileQRCode(tile);
      await updateTileQRCode(tile.id, qrCode);
      setQrCodes(prev => ({ ...prev, [tile.id]: qrCode }));
      setSuccess(`QR code generated for ${tile.name}`);
      onQRCodeGenerated?.();
    } catch (error: any) {
      console.error('Error generating QR code:', error);
      setError(`Failed to generate QR code for ${tile.name}. Please try again.`);
    } finally {
      setGeneratingQR(null);
    }
  };

  const generateAllQRCodes = async () => {
    setLoading(true);
    setBulkProgress(0);
    setError(null);

    try {
      const tilesWithoutQR = tiles.filter(tile => !qrCodes[tile.id]);
      
      if (tilesWithoutQR.length === 0) {
        setSuccess('All tiles already have QR codes!');
        return;
      }

      const newQRCodes = await generateBulkQRCodes(tilesWithoutQR, setBulkProgress);
      
      // Update database with new QR codes
      for (const [tileId, qrCode] of Object.entries(newQRCodes)) {
        try {
          await updateTileQRCode(tileId, qrCode);
        } catch (error) {
          console.error(`Error updating QR code for tile ${tileId}:`, error);
        }
      }
      
      setQrCodes(prev => ({ ...prev, ...newQRCodes }));
      setSuccess(`Successfully generated ${Object.keys(newQRCodes).length} QR codes!`);
      onQRCodeGenerated?.();
    } catch (error: any) {
      console.error('Error generating QR codes:', error);
      setError('Some QR codes failed to generate. Please try again.');
    } finally {
      setLoading(false);
      setBulkProgress(0);
    }
  };

  const downloadAllQRCodes = async () => {
    setLoading(true);
    setDownloadProgress(0);
    setError(null);
    
    try {
      const businessName = sellerProfile?.business_name || 'TileShowroom';
      const tilesWithQR = tiles.map(tile => ({
        ...tile,
        qrCode: qrCodes[tile.id]
      })).filter(tile => tile.qrCode);

      if (tilesWithQR.length === 0) {
        setError('No QR codes available. Please generate QR codes first.');
        return;
      }

      await downloadQRCodesAsZip(tilesWithQR, businessName, setDownloadProgress);
      setSuccess(`QR codes package downloaded successfully! (${tilesWithQR.length} codes)`);
    } catch (error: any) {
      console.error('Error downloading QR codes:', error);
      setError('Failed to download QR codes. Please try again.');
    } finally {
      setLoading(false);
      setDownloadProgress(0);
    }
  };

  const previewQRCode = (tile: Tile) => {
    if (!qrCodes[tile.id]) return;
    
    const newWindow = window.open('', '_blank', 'width=600,height=700');
    if (newWindow) {
      newWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>QR Code - ${tile.name}</title>
            <style>
              body { 
                font-family: Arial, sans-serif; 
                text-align: center; 
                padding: 20px;
                background: #f5f5f5;
              }
              .container {
                background: white;
                max-width: 500px;
                margin: 0 auto;
                padding: 30px;
                border-radius: 10px;
                box-shadow: 0 4px 6px rgba(0,0,0,0.1);
              }
              .qr-image { 
                max-width: 300px; 
                width: 100%;
                border: 2px solid #ddd;
                border-radius: 8px;
                margin: 20px 0;
              }
              .tile-info {
                background: #f8f9fa;
                padding: 15px;
                border-radius: 8px;
                margin: 20px 0;
                text-align: left;
              }
              .print-btn {
                background: #22c55e;
                color: white;
                border: none;
                padding: 10px 20px;
                border-radius: 5px;
                cursor: pointer;
                font-size: 16px;
                margin: 10px;
              }
              .print-btn:hover {
                background: #16a34a;
              }
              @media print {
                body { background: white; }
                .container { box-shadow: none; }
                .print-btn { display: none; }
              }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>${tile.name}</h1>
              <img src="${qrCodes[tile.id]}" alt="QR Code" class="qr-image" />
              <div class="tile-info">
                <p><strong>Tile Code:</strong> ${tile.tileCode || 'N/A'}</p>
                <p><strong>Size:</strong> ${tile.size}</p>
                <p><strong>Category:</strong> ${tile.category}</p>
                <p><strong>Price:</strong> ₹${tile.price.toLocaleString()}</p>
                <p><strong>Stock:</strong> ${tile.stock} pieces</p>
              </div>
              <button class="print-btn" onclick="window.print()">Print QR Code</button>
              <button class="print-btn" onclick="window.close()">Close</button>
              <p style="font-size: 12px; color: #666; margin-top: 20px;">
                Scan with mobile device to view in 3D visualization
              </p>
            </div>
          </body>
        </html>
      `);
      newWindow.document.close();
    }
  };

  const analytics = getQRCodeAnalytics(tiles);
  const tilesWithQR = tiles.filter(tile => qrCodes[tile.id]);
  const tilesWithoutQR = tiles.filter(tile => !qrCodes[tile.id]);

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6">
        <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
          <QrCode className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-purple-600 mt-0.5 sm:mt-1 flex-shrink-0" />
          <div className="flex-1 w-full min-w-0">
            <h3 className="text-lg sm:text-xl font-bold text-purple-800 mb-1 sm:mb-2">QR Code Management</h3>
            <p className="text-xs sm:text-sm md:text-base text-purple-700 mb-3 sm:mb-4">
              Generate and download QR codes for your tiles. Customers can scan these codes with their mobile devices
              to view tiles in 3D visualization and room environments.
            </p>
            
            {/* Analytics Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 md:gap-4 text-xs sm:text-sm">
              <div className="bg-white rounded-lg p-2 sm:p-2.5 md:p-3 border border-purple-200">
                <div className="flex items-center gap-1 sm:gap-2">
                  <Package className="w-3 h-3 sm:w-4 sm:h-4 text-purple-600 flex-shrink-0" />
                  <span className="text-purple-800 font-medium truncate">Total Tiles</span>
                </div>
                <p className="text-lg sm:text-xl md:text-2xl font-bold text-purple-900 mt-0.5 sm:mt-1">{analytics.total}</p>
              </div>
              
              <div className="bg-white rounded-lg p-2 sm:p-2.5 md:p-3 border border-green-200">
                <div className="flex items-center gap-1 sm:gap-2">
                  <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-600 flex-shrink-0" />
                  <span className="text-green-800 font-medium truncate">With QR</span>
                </div>
                <p className="text-lg sm:text-xl md:text-2xl font-bold text-green-900 mt-0.5 sm:mt-1">{analytics.withQR}</p>
              </div>
              
              <div className="bg-white rounded-lg p-2 sm:p-2.5 md:p-3 border border-orange-200">
                <div className="flex items-center gap-1 sm:gap-2">
                  <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4 text-orange-600 flex-shrink-0" />
                  <span className="text-orange-800 font-medium truncate">Missing QR</span>
                </div>
                <p className="text-lg sm:text-xl md:text-2xl font-bold text-orange-900 mt-0.5 sm:mt-1">{analytics.withoutQR}</p>
              </div>
              
              <div className="bg-white rounded-lg p-2 sm:p-2.5 md:p-3 border border-blue-200">
                <div className="flex items-center gap-1 sm:gap-2">
                  <BarChart className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600 flex-shrink-0" />
                  <span className="text-blue-800 font-medium truncate">Completion</span>
                </div>
                <p className="text-lg sm:text-xl md:text-2xl font-bold text-blue-900 mt-0.5 sm:mt-1">{analytics.percentage}%</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Alert Messages */}
      {error && (
        <div className="p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2 sm:gap-3">
          <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 mt-0.5 flex-shrink-0" />
          <div className="min-w-0 flex-1">
            <p className="text-red-800 font-medium text-sm sm:text-base">Error</p>
            <p className="text-red-700 text-xs sm:text-sm break-words">{error}</p>
          </div>
        </div>
      )}

      {success && (
        <div className="p-3 sm:p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-2 sm:gap-3">
          <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 mt-0.5 flex-shrink-0" />
          <div className="min-w-0 flex-1">
            <p className="text-green-800 font-medium text-sm sm:text-base">Success</p>
            <p className="text-green-700 text-xs sm:text-sm break-words">{success}</p>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row flex-wrap gap-2 sm:gap-3 md:gap-4">
        <button
          onClick={generateAllQRCodes}
          disabled={loading || tilesWithoutQR.length === 0}
          className="flex items-center justify-center gap-1.5 sm:gap-2 bg-blue-600 text-white px-4 sm:px-5 md:px-6 py-2.5 sm:py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-xs sm:text-sm md:text-base"
        >
          {loading && bulkProgress > 0 ? (
            <Loader className="w-3 h-3 sm:w-4 sm:h-4 animate-spin flex-shrink-0" />
          ) : (
            <Zap className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
          )}
          <span className="hidden sm:inline">{loading && bulkProgress > 0 ? 'Generating...' : `Generate Missing QR Codes (${tilesWithoutQR.length})`}</span>
          <span className="sm:hidden">{loading && bulkProgress > 0 ? 'Gen...' : `Generate (${tilesWithoutQR.length})`}</span>
        </button>

        <button
          onClick={downloadAllQRCodes}
          disabled={loading || tilesWithQR.length === 0}
          className="flex items-center justify-center gap-1.5 sm:gap-2 bg-green-600 text-white px-4 sm:px-5 md:px-6 py-2.5 sm:py-3 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-xs sm:text-sm md:text-base"
        >
          {loading && downloadProgress > 0 ? (
            <Loader className="w-3 h-3 sm:w-4 sm:h-4 animate-spin flex-shrink-0" />
          ) : (
            <Download className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
          )}
          <span className="hidden sm:inline">{loading && downloadProgress > 0 ? 'Preparing...' : `Download QR Package (${tilesWithQR.length})`}</span>
          <span className="sm:hidden">{loading && downloadProgress > 0 ? 'Prep...' : `Download (${tilesWithQR.length})`}</span>
        </button>
      </div>

      {/* Progress Bars */}
      {loading && bulkProgress > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg p-3 sm:p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs sm:text-sm font-medium text-gray-700 truncate">Generating QR Codes...</span>
            <span className="text-xs sm:text-sm text-gray-500 flex-shrink-0 ml-2">{Math.round(bulkProgress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5 sm:h-2">
            <div 
              className="bg-blue-600 h-1.5 sm:h-2 rounded-full transition-all duration-300"
              style={{ width: `${bulkProgress}%` }}
            ></div>
          </div>
        </div>
      )}

      {loading && downloadProgress > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg p-3 sm:p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs sm:text-sm font-medium text-gray-700 truncate">Preparing Download Package...</span>
            <span className="text-xs sm:text-sm text-gray-500 flex-shrink-0 ml-2">{Math.round(downloadProgress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5 sm:h-2">
            <div 
              className="bg-green-600 h-1.5 sm:h-2 rounded-full transition-all duration-300"
              style={{ width: `${downloadProgress}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Tiles Grid */}
      <div className="bg-white border border-gray-200 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6">
        <h4 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4">Tile QR Codes</h4>
        
        {tiles.length === 0 ? (
          <div className="text-center py-6 sm:py-8">
            <QrCode className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-3 sm:mb-4" />
            <p className="text-gray-500 text-sm sm:text-base px-4">No tiles found. Add some tiles first to generate QR codes.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {tiles.map((tile) => {
              const hasQR = qrCodes[tile.id];
              const isGenerating = generatingQR === tile.id;
              
              return (
                <div key={tile.id} className="border border-gray-200 rounded-lg p-3 sm:p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-2 sm:gap-3 mb-2 sm:mb-3">
                    <img
                      src={tile.imageUrl}
                      alt={tile.name}
                      className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 object-cover rounded-lg flex-shrink-0"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/placeholder-tile.png';
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <h5 className="font-medium text-gray-800 truncate text-sm sm:text-base">{tile.name}</h5>
                      <p className="text-xs sm:text-sm text-gray-600 truncate">{tile.size}</p>
                      <p className="text-xs sm:text-sm text-gray-500 capitalize truncate">{tile.category}</p>
                      {tile.tileCode && (
                        <p className="text-xs text-gray-400 font-mono truncate">{tile.tileCode}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mb-2 sm:mb-3 gap-2">
                    <div className="flex items-center gap-1.5 sm:gap-2 min-w-0 flex-1">
                      {hasQR ? (
                        <>
                          <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-600 flex-shrink-0" />
                          <span className="text-xs sm:text-sm text-green-700 font-medium truncate">QR Ready</span>
                        </>
                      ) : (
                        <>
                          <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4 text-orange-600 flex-shrink-0" />
                          <span className="text-xs sm:text-sm text-orange-700 truncate">No QR Code</span>
                        </>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <span className={`
                        px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs font-medium whitespace-nowrap
                        ${tile.inStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
                      `}>
                        {tile.inStock ? 'In Stock' : 'Out'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex gap-1.5 sm:gap-2">
                    {hasQR && (
                      <button
                        onClick={() => previewQRCode(tile)}
                        className="flex-1 flex items-center justify-center gap-1 p-1.5 sm:p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors text-xs sm:text-sm"
                        title="Preview QR Code"
                      >
                        <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span className="hidden sm:inline">Preview</span>
                      </button>
                    )}
                    
                    <button
                      onClick={() => generateSingleQRCode(tile)}
                      disabled={isGenerating}
                      className="flex-1 flex items-center justify-center gap-1 p-1.5 sm:p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors disabled:opacity-50 text-xs sm:text-sm"
                      title={hasQR ? "Regenerate QR Code" : "Generate QR Code"}
                    >
                      {isGenerating ? (
                        <Loader className="w-3 h-3 sm:w-4 sm:h-4 animate-spin" />
                      ) : (
                        <RefreshCw className="w-3 h-3 sm:w-4 sm:h-4" />
                      )}
                      {isGenerating ? 'Gen...' : hasQR ? 'Regen' : 'Generate'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Implementation Guide */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6">
        <h4 className="text-base sm:text-lg font-semibold text-gray-800 mb-2 sm:mb-3">QR Code Implementation Guide</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 text-xs sm:text-sm text-gray-700">
          <div>
            <h5 className="font-semibold text-gray-800 mb-2 text-sm sm:text-base">🖨️ Printing Guidelines</h5>
            <ul className="space-y-0.5 sm:space-y-1">
              <li>• Minimum size: 2x2 inches (5x5 cm)</li>
              <li>• Recommended: 3x3 inches (7.5x7.5 cm)</li>
              <li>• Use high-quality printer (300 DPI+)</li>
              <li>• Print on durable sticker paper</li>
              <li>• Test scan before mass printing</li>
            </ul>
          </div>
          <div>
            <h5 className="font-semibold text-gray-800 mb-2 text-sm sm:text-base">📍 Placement Tips</h5>
            <ul className="space-y-0.5 sm:space-y-1">
              <li>• Attach to tile corners or edges</li>
              <li>• Ensure flat surface placement</li>
              <li>• Keep codes clean and visible</li>
              <li>• Avoid curved or reflective surfaces</li>
              <li>• Provide adequate lighting</li>
            </ul>
          </div>
        </div>
        
        <div className="mt-3 sm:mt-4 p-2.5 sm:p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-blue-800 text-xs sm:text-sm">
            <strong>💡 Pro Tip:</strong> Train your staff about the QR feature and place simple scanning instructions 
            near tile displays to encourage customer engagement.
          </p>
        </div>
      </div>
    </div>
  );
};

