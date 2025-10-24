
// import { useParams, useNavigate } from 'react-router-dom';
// import { 
//   ArrowLeft, Share2, Loader, Upload, Scan, 
//   Package, AlertCircle, CheckCircle, X 
// } from 'lucide-react';
// import { Enhanced3DViewer } from '../components/Enhanced3DViewer';
// import { ImageUpload } from '../components/ImageUpload';
// import { QRScanner } from '../components/QRScanner';
// import { getTileById, trackQRScan } from '../lib/firebaseutils';
// import { Tile } from '../types';

// interface TileSize {
//   width: number;
//   height: number;
//   label: string;
// }


// const WALL_SIZES: TileSize[] = [
//   { width: 30, height: 45, label: '30×45' },
//   { width: 30, height: 60, label: '30×60' },
//   { width: 40, height: 80, label: '40×80' },
//   { width: 45, height: 45, label: '45×45' },
//   { width: 40, height: 60, label: '40×60' },
//   { width: 20, height: 20, label: '20×20' }
// ];

// export const Room3DViewPage: React.FC = () => {
//   const { tileId, roomType } = useParams<{ tileId: string; roomType: string }>();
//   const navigate = useNavigate();
  
//   const [tile, setTile] = useState<Tile | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [activeSurface, setActiveSurface] = useState<'floor' | 'wall' | 'both'>('both');
  
//   // ✅ Wall tile input method: 'upload' or 'qr'
//   const [wallTileInputMethod, setWallTileInputMethod] = useState<'upload' | 'qr'>('qr');
  
//   // ✅ QR Scanner state
//   const [showWallScanner, setShowWallScanner] = useState(false);
//   const [scannerLoading, setScannerLoading] = useState(false);
  
//   // Success/Error states
//   const [success, setSuccess] = useState<string | null>(null);
//   const [error, setError] = useState<string | null>(null);

//   // Floor tile state
//   const [floorTile, setFloorTile] = useState<{
//     texture: string;
//     size: { width: number; height: number };
//   }>({
//     texture: '',
//     size: { width: 60, height: 60 }
//   });

//   // Wall tile state
//   const [wallTile, setWallTile] = useState<{
//     texture: string;
//     size: { width: number; height: number };
//   }>({
//     texture: '',
//     size: { width: 30, height: 45 }
//   });

//   useEffect(() => {
//     loadTileData();
//   }, [tileId]);

//   // Auto-clear messages
//   useEffect(() => {
//     if (success || error) {
//       const timer = setTimeout(() => {
//         setSuccess(null);
//         setError(null);
//       }, 5000);
//       return () => clearTimeout(timer);
//     }
//   }, [success, error]);

//   const loadTileData = async () => {
//     if (!tileId) return;

//     try {
//       setLoading(true);
//       const tileData = await getTileById(tileId);
      
//       if (!tileData) {
//         navigate('/');
//         return;
//       }

//       setTile(tileData);

//       // Set floor tile by default
//       setFloorTile({
//         texture: tileData.textureUrl || tileData.imageUrl,
//         size: parseTileSize(tileData.size, 'floor')
//       });

//     } catch (err) {
//       console.error('Error loading tile:', err);
//       navigate('/');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ✅ NEW: Load wall tile from QR scan
//   // const loadWallTileFromQR = async (wallTileId: string) => {
//   //   try {
//   //     setScannerLoading(true);
//   //     setError(null);

//   //     console.log('🔍 Loading wall tile from QR:', wallTileId);

//   //     const wallTileData = await getTileById(wallTileId);

//   //     if (!wallTileData) {
//   //       setError('Wall tile not found');
//   //       return;
//   //     }

//   //     console.log('✅ Wall tile loaded:', wallTileData.name);

//   //     // Track QR scan for analytics
//   //     await trackQRScan(wallTileId, {
//   //       sellerId: wallTileData.sellerId,
//   //       showroomId: wallTileData.showroomId
//   //     });

//   //     // Set wall tile state
//   //     setWallTile({
//   //       texture: wallTileData.textureUrl || wallTileData.imageUrl,
//   //       size: parseTileSize(wallTileData.size, 'wall')
//   //     });

//   //     setSuccess(`Wall tile applied: ${wallTileData.name}`);
      
//   //   } catch (err: any) {
//   //     console.error('Error loading wall tile from QR:', err);
//   //     setError('Failed to load wall tile. Please try again.');
//   //   } finally {
//   //     setScannerLoading(false);
//   //   }
//   // };

//   // src/pages/Room3DViewPage.tsx
// // Wall tile tracking ko bhi same protection add karo

// // Find this function and update:
// const loadWallTileFromQR = async (wallTileId: string) => {
//   try {
//     setScannerLoading(true);
//     setError(null);

//     // ✅ Check if already tracked in this session
//     const sessionKey = `wall_qr_tracked_${wallTileId}`;
//     const sessionTracked = sessionStorage.getItem(sessionKey);
    
//     const wallTileData = await getTileById(wallTileId);

//     if (!wallTileData) {
//       setError('Wall tile not found');
//       return;
//     }

//     // ✅ Track only if not tracked in last 5 minutes
//     if (!sessionTracked || (Date.now() - parseInt(sessionTracked)) > 5 * 60 * 1000) {
//       await trackQRScan(wallTileId, {
//         sellerId: wallTileData.sellerId,
//         showroomId: wallTileData.showroomId
//       });
      
//       sessionStorage.setItem(sessionKey, Date.now().toString());
      
//       if (process.env.NODE_ENV === 'development') {
//         console.log('✅ Wall tile QR scan tracked:', wallTileData.name);
//       }
//     } else {
//       if (process.env.NODE_ENV === 'development') {
//         console.log('⏭️ Wall tile already tracked, skipping...');
//       }
//     }

//     setWallTile({
//       texture: wallTileData.textureUrl || wallTileData.imageUrl,
//       size: parseTileSize(wallTileData.size, 'wall')
//     });

//     setSuccess(`Wall tile applied: ${wallTileData.name}`);
    
//   } catch (err: any) {
//     console.error('Error loading wall tile from QR:', err);
//     setError('Failed to load wall tile. Please try again.');
//   } finally {
//     setScannerLoading(false);
//   }
// };

//   // Parse tile size from string like "60×60" or "30×45"
//   const parseTileSize = (sizeStr: string, type: 'floor' | 'wall'): { width: number; height: number } => {
//     const defaultFloor = { width: 60, height: 60 };
//     const defaultWall = { width: 30, height: 45 };
    
//     try {
//       const parts = sizeStr.split('×').map(s => parseInt(s.trim()));
//       if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
//         return { width: parts[0], height: parts[1] };
//       }
//     } catch (e) {
//       console.warn('Could not parse tile size:', sizeStr);
//     }
    
//     return type === 'floor' ? defaultFloor : defaultWall;
//   };

//   const handleShare = async () => {
//     const shareData = {
//       title: `${tile?.name} in ${roomType}`,
//       text: `Check out this tile visualization!`,
//       url: window.location.href
//     };

//     try {
//       if (navigator.share) {
//         await navigator.share(shareData);
//       } else {
//         await navigator.clipboard.writeText(window.location.href);
//         setSuccess('Link copied to clipboard!');
//       }
//     } catch (err) {
//       console.error('Error sharing:', err);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-900">
//         <div className="text-center">
//           <Loader className="w-16 h-16 animate-spin text-blue-500 mx-auto mb-4" />
//           <p className="text-white text-lg">Loading 3D view...</p>
//         </div>
//       </div>
//     );
//   }

//   if (!tile || !roomType) {
//     return null;
//   }

//   const isKitchenOrBathroom = roomType === 'kitchen' || roomType === 'bathroom';

//   return (
//     <div className="min-h-screen bg-gray-900 flex flex-col">
//       {/* Header */}
//       <div className="bg-gray-800 shadow-lg z-20">
//         <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
//           <button
//             onClick={() => navigate(-1)}
//             className="flex items-center gap-2 text-white hover:text-blue-400 transition-colors"
//           >
//             <ArrowLeft className="w-5 h-5" />
//             <span className="font-medium">Back</span>
//           </button>

//           <div className="flex-1 text-center">
//             <h1 className="text-white font-bold text-lg capitalize">
//               {roomType} - 3D Visualization
//             </h1>
//           </div>

//           <button
//             onClick={handleShare}
//             className="p-2 text-white hover:bg-gray-700 rounded-lg transition-colors"
//             title="Share"
//           >
//             <Share2 className="w-5 h-5" />
//           </button>
//         </div>
//       </div>

//       {/* Success/Error Messages */}
//       {success && (
//         <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 max-w-md w-full mx-4">
//           <div className="bg-green-500 text-white px-6 py-4 rounded-lg shadow-2xl flex items-center gap-3">
//             <CheckCircle className="w-6 h-6 flex-shrink-0" />
//             <p className="font-medium">{success}</p>
//             <button onClick={() => setSuccess(null)} className="ml-auto">
//               <X className="w-5 h-5" />
//             </button>
//           </div>
//         </div>
//       )}

//       {error && (
//         <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 max-w-md w-full mx-4">
//           <div className="bg-red-500 text-white px-6 py-4 rounded-lg shadow-2xl flex items-center gap-3">
//             <AlertCircle className="w-6 h-6 flex-shrink-0" />
//             <p className="font-medium">{error}</p>
//             <button onClick={() => setError(null)} className="ml-auto">
//               <X className="w-5 h-5" />
//             </button>
//           </div>
//         </div>
//       )}

//       {/* Main Content */}
//       <div className="flex-1 flex flex-col lg:flex-row">
//         {/* 3D Viewer */}
//         <div className="flex-1 relative">
//           <Enhanced3DViewer
//             roomType={roomType as any}
//             floorTile={floorTile}
//             wallTile={wallTile}
//             activeSurface={activeSurface}
//             onSurfaceChange={setActiveSurface}
//           />
//         </div>

//         {/* Control Panel */}
//         <div className="lg:w-96 bg-gray-800 overflow-y-auto">
//           <div className="p-6 space-y-6">
            
//             {/* Floor Tile Section */}
//             <div className="bg-gray-900 rounded-xl p-4 border-2 border-blue-500/30">
//               <h3 className="text-white font-bold mb-3 flex items-center gap-2">
//                 <Package className="w-5 h-5 text-blue-400" />
//                 Floor Tile
//               </h3>

//               <div className="space-y-3">
//                 {/* Floor Tile Info */}
//                 <div className="bg-gray-800 rounded-lg p-3">
//                   <div className="flex items-center gap-3">
//                     <img
//                       src={tile.imageUrl}
//                       alt={tile.name}
//                       className="w-16 h-16 object-cover rounded-lg"
//                     />
//                     <div className="flex-1">
//                       <p className="text-white font-medium text-sm">{tile.name}</p>
//                       <p className="text-gray-400 text-xs">{tile.size}</p>
//                       <p className="text-green-400 text-xs mt-1 flex items-center gap-1">
//                         <CheckCircle className="w-3 h-3" />
//                         Applied from QR Scan
//                       </p>
//                     </div>
//                   </div>
//                 </div>

               
//                 <div>
               
//                 </div>
//               </div>
//             </div>

//             {/* Wall Tile Section (Kitchen/Bathroom Only) */}
//             {isKitchenOrBathroom && (
//               <div className="bg-gray-900 rounded-xl p-4 border-2 border-purple-500/30">
//                 <h3 className="text-white font-bold mb-3 flex items-center gap-2">
//                   <Package className="w-5 h-5 text-purple-400" />
//                   Wall Tile
//                 </h3>

//                 {/* ✅ NEW: Input Method Selector */}
//                 <div className="mb-4">
//                   <label className="text-white text-sm font-medium mb-2 block">
//                     Choose Input Method:
//                   </label>
//                   <div className="grid grid-cols-2 gap-2">
//                     <button
//                       onClick={() => setWallTileInputMethod('qr')}
//                       className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all ${
//                         wallTileInputMethod === 'qr'
//                           ? 'bg-purple-600 text-white shadow-lg'
//                           : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
//                       }`}
//                     >
//                       <Scan className="w-4 h-4" />
//                       QR Scan
//                     </button>
//                     <button
//                       onClick={() => setWallTileInputMethod('upload')}
//                       className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all ${
//                         wallTileInputMethod === 'upload'
//                           ? 'bg-purple-600 text-white shadow-lg'
//                           : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
//                       }`}
//                     >
//                       <Upload className="w-4 h-4" />
//                       Upload
//                     </button>
//                   </div>
//                 </div>

//                 {/* ✅ QR Scan Method */}
//                 {wallTileInputMethod === 'qr' && (
//                   <div className="space-y-3">
//                     {wallTile.texture ? (
//                       <div className="bg-gray-800 rounded-lg p-3">
//                         <img
//                           src={wallTile.texture}
//                           alt="Wall Tile"
//                           className="w-full h-32 object-cover rounded-lg mb-2"
//                         />
//                         <p className="text-green-400 text-xs flex items-center gap-1">
//                           <CheckCircle className="w-3 h-3" />
//                           Wall tile applied from QR scan
//                         </p>
//                         <button
//                           onClick={() => setShowWallScanner(true)}
//                           className="w-full mt-2 bg-purple-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors"
//                         >
//                           Scan Different Wall Tile
//                         </button>
//                       </div>
//                     ) : (
//                       <button
//                         onClick={() => setShowWallScanner(true)}
//                         disabled={scannerLoading}
//                         className="w-full bg-purple-600 text-white py-4 rounded-lg font-semibold hover:bg-purple-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
//                       >
//                         {scannerLoading ? (
//                           <>
//                             <Loader className="w-5 h-5 animate-spin" />
//                             Loading...
//                           </>
//                         ) : (
//                           <>
//                             <Scan className="w-5 h-5" />
//                             Scan Wall Tile QR Code
//                           </>
//                         )}
//                       </button>
//                     )}

//                     <div className="bg-purple-900/30 rounded-lg p-3 border border-purple-500/30">
//                       <p className="text-purple-200 text-xs">
//                         💡 <strong>Tip:</strong> Scan the QR code from another tile to apply it on walls
//                       </p>
//                     </div>
//                   </div>
//                 )}

//                 {/* ✅ Upload Method (Original - Backward Compatible) */}
//                 {wallTileInputMethod === 'upload' && (
//                   <div className="space-y-3">
//                     <ImageUpload
//                       currentImage={wallTile.texture}
//                       onImageUploaded={(url) => {
//                         setWallTile({ ...wallTile, texture: url });
//                         setSuccess('Wall tile image uploaded!');
//                       }}
//                       placeholder="Upload wall tile image"
//                       folder="wall-tiles"
//                     />

//                     <div className="bg-blue-900/30 rounded-lg p-3 border border-blue-500/30">
//                       <p className="text-blue-200 text-xs">
//                         📤 Upload your own wall tile image or use QR scan for showroom tiles
//                       </p>
//                     </div>
//                   </div>
//                 )}

//                 {/* Wall Size Selector */}
//                 {wallTile.texture && (
//                   <div className="mt-4">
//                     <label className="text-white text-sm font-medium mb-2 block">
//                       Wall Tile Size:
//                     </label>
//                     <div className="grid grid-cols-3 gap-2">
//                       {WALL_SIZES.map((size) => (
//                         <button
//                           key={size.label}
//                           onClick={() => setWallTile({ ...wallTile, size })}
//                           className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
//                             wallTile.size.width === size.width &&
//                             wallTile.size.height === size.height
//                               ? 'bg-purple-600 text-white shadow-lg'
//                               : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
//                           }`}
//                         >
//                           {size.label}
//                         </button>
//                       ))}
//                     </div>
//                     <p className="text-gray-400 text-xs mt-2">
//                       Selected: {wallTile.size.width}×{wallTile.size.height} cm
//                     </p>
//                   </div>
//                 )}
//               </div>
//             )}

//             {/* Surface Selector */}
//             {isKitchenOrBathroom && (
//               <div>
//                 <label className="block text-white font-semibold mb-3">
//                   View Mode:
//                 </label>
//                 <div className="grid grid-cols-3 gap-3">
//                   <button
//                     onClick={() => setActiveSurface('floor')}
//                     className={`px-4 py-3 rounded-lg font-medium transition-all ${
//                       activeSurface === 'floor'
//                         ? 'bg-blue-600 text-white shadow-lg'
//                         : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
//                     }`}
//                   >
//                     Floor
//                   </button>
//                   <button
//                     onClick={() => setActiveSurface('wall')}
//                     className={`px-4 py-3 rounded-lg font-medium transition-all ${
//                       activeSurface === 'wall'
//                         ? 'bg-purple-600 text-white shadow-lg'
//                         : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
//                     }`}
//                   >
//                     Wall
//                   </button>
//                   <button
//                     onClick={() => setActiveSurface('both')}
//                     className={`px-4 py-3 rounded-lg font-medium transition-all ${
//                       activeSurface === 'both'
//                         ? 'bg-green-600 text-white shadow-lg'
//                         : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
//                     }`}
//                   >
//                     Both
//                   </button>
//                 </div>
//               </div>
//             )}

//             {/* Info Box */}
//             <div className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 rounded-xl p-4 border border-blue-500/30">
//               <h4 className="text-white font-semibold mb-2 flex items-center gap-2">
//                 <Scan className="w-4 h-4" />
//                 Dual Tile Feature
//               </h4>
//               <ul className="space-y-1 text-sm text-gray-300">
//                 <li>• Floor tile from first QR scan ✅</li>
//                 <li>• Wall tile: QR scan OR upload 🎨</li>
//                 <li>• Different sizes for each surface</li>
//                 <li>• Real-time 3D preview</li>
//               </ul>
//             </div>

//           </div>
//         </div>
//       </div>

//       {/* ✅ QR Scanner Modal for Wall Tile */}
//       {showWallScanner && (
//         <QRScanner
//           onScanSuccess={async (data) => {
//             if (data.tileId) {
//               setShowWallScanner(false);
//               await loadWallTileFromQR(data.tileId);
//             } else {
//               setError('Invalid QR code. Please scan a valid tile QR code.');
//             }
//           }}
//           onClose={() => setShowWallScanner(false)}
//         />
//       )}
//     </div>
//   );
// };  

import { useState, useEffect } from 'react'; // ✅ ADDED THIS LINE
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Share2, Loader, Upload, Scan, 
  Package, AlertCircle, CheckCircle, X 
} from 'lucide-react';
import { Enhanced3DViewer } from '../components/Enhanced3DViewer';
import { ImageUpload } from '../components/ImageUpload';
import { QRScanner } from '../components/QRScanner';
import { getTileById, trackQRScan } from '../lib/firebaseutils';
import { Tile } from '../types';

interface TileSize {
  width: number;
  height: number;
  label: string;
}

const WALL_SIZES: TileSize[] = [
  { width: 30, height: 45, label: '30×45' },
  { width: 30, height: 60, label: '30×60' },
  { width: 40, height: 80, label: '40×80' },
  { width: 45, height: 45, label: '45×45' },
  { width: 40, height: 60, label: '40×60' },
  { width: 20, height: 20, label: '20×20' }
];

export const Room3DViewPage: React.FC = () => {
  const { tileId, roomType } = useParams<{ tileId: string; roomType: string }>();
  const navigate = useNavigate();
  
  const [tile, setTile] = useState<Tile | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeSurface, setActiveSurface] = useState<'floor' | 'wall' | 'both'>('both');
  
  // ✅ Wall tile input method: 'upload' or 'qr'
  const [wallTileInputMethod, setWallTileInputMethod] = useState<'upload' | 'qr'>('qr');
  
  // ✅ QR Scanner state
  const [showWallScanner, setShowWallScanner] = useState(false);
  const [scannerLoading, setScannerLoading] = useState(false);
  
  // Success/Error states
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Floor tile state
  const [floorTile, setFloorTile] = useState<{
    texture: string;
    size: { width: number; height: number };
  }>({
    texture: '',
    size: { width: 60, height: 60 }
  });

  // Wall tile state
  const [wallTile, setWallTile] = useState<{
    texture: string;
    size: { width: number; height: number };
  }>({
    texture: '',
    size: { width: 30, height: 45 }
  });

  useEffect(() => {
    loadTileData();
  }, [tileId]);

  // Auto-clear messages
  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        setSuccess(null);
        setError(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [success, error]);

  const loadTileData = async () => {
    if (!tileId) return;

    try {
      setLoading(true);
      const tileData = await getTileById(tileId);
      
      if (!tileData) {
        navigate('/');
        return;
      }

      setTile(tileData);

      // Set floor tile by default
      setFloorTile({
        texture: tileData.textureUrl || tileData.imageUrl,
        size: parseTileSize(tileData.size, 'floor')
      });

    } catch (err) {
      console.error('Error loading tile:', err);
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  // ✅ Load wall tile from QR scan with session tracking
  const loadWallTileFromQR = async (wallTileId: string) => {
    try {
      setScannerLoading(true);
      setError(null);

      // ✅ Check if already tracked in this session
      const sessionKey = `wall_qr_tracked_${wallTileId}`;
      const sessionTracked = sessionStorage.getItem(sessionKey);
      
      const wallTileData = await getTileById(wallTileId);

      if (!wallTileData) {
        setError('Wall tile not found');
        return;
      }

      // ✅ Track only if not tracked in last 5 minutes
      if (!sessionTracked || (Date.now() - parseInt(sessionTracked)) > 5 * 60 * 1000) {
        await trackQRScan(wallTileId, {
          sellerId: wallTileData.sellerId,
          showroomId: wallTileData.showroomId
        });
        
        sessionStorage.setItem(sessionKey, Date.now().toString());
        
        if (process.env.NODE_ENV === 'development') {
          console.log('✅ Wall tile QR scan tracked:', wallTileData.name);
        }
      } else {
        if (process.env.NODE_ENV === 'development') {
          console.log('⏭️ Wall tile already tracked, skipping...');
        }
      }

      setWallTile({
        texture: wallTileData.textureUrl || wallTileData.imageUrl,
        size: parseTileSize(wallTileData.size, 'wall')
      });

      setSuccess(`Wall tile applied: ${wallTileData.name}`);
      
    } catch (err: any) {
      console.error('Error loading wall tile from QR:', err);
      setError('Failed to load wall tile. Please try again.');
    } finally {
      setScannerLoading(false);
    }
  };

  // Parse tile size from string like "60×60" or "30×45"
  const parseTileSize = (sizeStr: string, type: 'floor' | 'wall'): { width: number; height: number } => {
    const defaultFloor = { width: 60, height: 60 };
    const defaultWall = { width: 30, height: 45 };
    
    try {
      const parts = sizeStr.split('×').map(s => parseInt(s.trim()));
      if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
        return { width: parts[0], height: parts[1] };
      }
    } catch (e) {
      console.warn('Could not parse tile size:', sizeStr);
    }
    
    return type === 'floor' ? defaultFloor : defaultWall;
  };

  const handleShare = async () => {
    const shareData = {
      title: `${tile?.name} in ${roomType}`,
      text: `Check out this tile visualization!`,
      url: window.location.href
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        setSuccess('Link copied to clipboard!');
      }
    } catch (err) {
      console.error('Error sharing:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <Loader className="w-16 h-16 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-white text-lg">Loading 3D view...</p>
        </div>
      </div>
    );
  }

  if (!tile || !roomType) {
    return null;
  }

  const isKitchenOrBathroom = roomType === 'kitchen' || roomType === 'bathroom';

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      {/* Header */}
      <div className="bg-gray-800 shadow-lg z-20">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-white hover:text-blue-400 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back</span>
          </button>

          <div className="flex-1 text-center">
            <h1 className="text-white font-bold text-lg capitalize">
              {roomType} - 3D Visualization
            </h1>
          </div>

          <button
            onClick={handleShare}
            className="p-2 text-white hover:bg-gray-700 rounded-lg transition-colors"
            title="Share"
          >
            <Share2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 max-w-md w-full mx-4">
          <div className="bg-green-500 text-white px-6 py-4 rounded-lg shadow-2xl flex items-center gap-3">
            <CheckCircle className="w-6 h-6 flex-shrink-0" />
            <p className="font-medium">{success}</p>
            <button onClick={() => setSuccess(null)} className="ml-auto">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {error && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 max-w-md w-full mx-4">
          <div className="bg-red-500 text-white px-6 py-4 rounded-lg shadow-2xl flex items-center gap-3">
            <AlertCircle className="w-6 h-6 flex-shrink-0" />
            <p className="font-medium">{error}</p>
            <button onClick={() => setError(null)} className="ml-auto">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:flex-row">
        {/* 3D Viewer */}
        <div className="flex-1 relative">
          <Enhanced3DViewer
            roomType={roomType as any}
            floorTile={floorTile}
            wallTile={wallTile}
            activeSurface={activeSurface}
            onSurfaceChange={setActiveSurface}
          />
        </div>

        {/* Control Panel */}
        <div className="lg:w-96 bg-gray-800 overflow-y-auto">
          <div className="p-6 space-y-6">
            
            {/* Floor Tile Section */}
            <div className="bg-gray-900 rounded-xl p-4 border-2 border-blue-500/30">
              <h3 className="text-white font-bold mb-3 flex items-center gap-2">
                <Package className="w-5 h-5 text-blue-400" />
                Floor Tile
              </h3>

              <div className="space-y-3">
                {/* Floor Tile Info */}
                <div className="bg-gray-800 rounded-lg p-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={tile.imageUrl}
                      alt={tile.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <p className="text-white font-medium text-sm">{tile.name}</p>
                      <p className="text-gray-400 text-xs">{tile.size}</p>
                      <p className="text-green-400 text-xs mt-1 flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        Applied from QR Scan
                      </p>
                    </div>
                  </div>
                </div>

               
                <div>
               
                </div>
              </div>
            </div>

            {/* Wall Tile Section (Kitchen/Bathroom Only) */}
            {isKitchenOrBathroom && (
              <div className="bg-gray-900 rounded-xl p-4 border-2 border-purple-500/30">
                <h3 className="text-white font-bold mb-3 flex items-center gap-2">
                  <Package className="w-5 h-5 text-purple-400" />
                  Wall Tile
                </h3>

                {/* ✅ NEW: Input Method Selector */}
                <div className="mb-4">
                  <label className="text-white text-sm font-medium mb-2 block">
                    Choose Input Method:
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setWallTileInputMethod('qr')}
                      className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all ${
                        wallTileInputMethod === 'qr'
                          ? 'bg-purple-600 text-white shadow-lg'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      <Scan className="w-4 h-4" />
                      QR Scan
                    </button>
                    <button
                      onClick={() => setWallTileInputMethod('upload')}
                      className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all ${
                        wallTileInputMethod === 'upload'
                          ? 'bg-purple-600 text-white shadow-lg'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      <Upload className="w-4 h-4" />
                      Upload
                    </button>
                  </div>
                </div>

                {/* ✅ QR Scan Method */}
                {wallTileInputMethod === 'qr' && (
                  <div className="space-y-3">
                    {wallTile.texture ? (
                      <div className="bg-gray-800 rounded-lg p-3">
                        <img
                          src={wallTile.texture}
                          alt="Wall Tile"
                          className="w-full h-32 object-cover rounded-lg mb-2"
                        />
                        <p className="text-green-400 text-xs flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" />
                          Wall tile applied from QR scan
                        </p>
                        <button
                          onClick={() => setShowWallScanner(true)}
                          className="w-full mt-2 bg-purple-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors"
                        >
                          Scan Different Wall Tile
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setShowWallScanner(true)}
                        disabled={scannerLoading}
                        className="w-full bg-purple-600 text-white py-4 rounded-lg font-semibold hover:bg-purple-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        {scannerLoading ? (
                          <>
                            <Loader className="w-5 h-5 animate-spin" />
                            Loading...
                          </>
                        ) : (
                          <>
                            <Scan className="w-5 h-5" />
                            Scan Wall Tile QR Code
                          </>
                        )}
                      </button>
                    )}

                    <div className="bg-purple-900/30 rounded-lg p-3 border border-purple-500/30">
                      <p className="text-purple-200 text-xs">
                        💡 <strong>Tip:</strong> Scan the QR code from another tile to apply it on walls
                      </p>
                    </div>
                  </div>
                )}

                {/* ✅ Upload Method (Original - Backward Compatible) */}
                {wallTileInputMethod === 'upload' && (
                  <div className="space-y-3">
                    <ImageUpload
                      currentImage={wallTile.texture}
                      onImageUploaded={(url) => {
                        setWallTile({ ...wallTile, texture: url });
                        setSuccess('Wall tile image uploaded!');
                      }}
                      placeholder="Upload wall tile image"
                      folder="wall-tiles"
                    />

                    <div className="bg-blue-900/30 rounded-lg p-3 border border-blue-500/30">
                      <p className="text-blue-200 text-xs">
                        📤 Upload your own wall tile image or use QR scan for showroom tiles
                      </p>
                    </div>
                  </div>
                )}

                {/* Wall Size Selector */}
                {wallTile.texture && (
                  <div className="mt-4">
                    <label className="text-white text-sm font-medium mb-2 block">
                      Wall Tile Size:
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {WALL_SIZES.map((size) => (
                        <button
                          key={size.label}
                          onClick={() => setWallTile({ ...wallTile, size })}
                          className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                            wallTile.size.width === size.width &&
                            wallTile.size.height === size.height
                              ? 'bg-purple-600 text-white shadow-lg'
                              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                          }`}
                        >
                          {size.label}
                        </button>
                      ))}
                    </div>
                    <p className="text-gray-400 text-xs mt-2">
                      Selected: {wallTile.size.width}×{wallTile.size.height} cm
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Surface Selector */}
            {isKitchenOrBathroom && (
              <div>
                <label className="block text-white font-semibold mb-3">
                  View Mode:
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    onClick={() => setActiveSurface('floor')}
                    className={`px-4 py-3 rounded-lg font-medium transition-all ${
                      activeSurface === 'floor'
                        ? 'bg-blue-600 text-white shadow-lg'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    Floor
                  </button>
                  <button
                    onClick={() => setActiveSurface('wall')}
                    className={`px-4 py-3 rounded-lg font-medium transition-all ${
                      activeSurface === 'wall'
                        ? 'bg-purple-600 text-white shadow-lg'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    Wall
                  </button>
                  <button
                    onClick={() => setActiveSurface('both')}
                    className={`px-4 py-3 rounded-lg font-medium transition-all ${
                      activeSurface === 'both'
                        ? 'bg-green-600 text-white shadow-lg'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    Both
                  </button>
                </div>
              </div>
            )}

            {/* Info Box */}
            <div className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 rounded-xl p-4 border border-blue-500/30">
              <h4 className="text-white font-semibold mb-2 flex items-center gap-2">
                <Scan className="w-4 h-4" />
                Dual Tile Feature
              </h4>
              <ul className="space-y-1 text-sm text-gray-300">
                <li>• Floor tile from first QR scan ✅</li>
                <li>• Wall tile: QR scan OR upload 🎨</li>
                <li>• Different sizes for each surface</li>
                <li>• Real-time 3D preview</li>
              </ul>
            </div>

          </div>
        </div>
      </div>

      {/* ✅ QR Scanner Modal for Wall Tile */}
      {showWallScanner && (
        <QRScanner
          onScanSuccess={async (data) => {
            if (data.tileId) {
              setShowWallScanner(false);
              await loadWallTileFromQR(data.tileId);
            } else {
              setError('Invalid QR code. Please scan a valid tile QR code.');
            }
          }}
          onClose={() => setShowWallScanner(false)}
        />
      )}
    </div>
  );
};