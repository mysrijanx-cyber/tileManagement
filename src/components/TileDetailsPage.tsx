// // src/pages/TileDetailsPage.tsx - PRODUCTION READY
// import React, { useState, useEffect, useRef } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { 
//   ArrowLeft, Share2, Heart, Package, Ruler, 
//   IndianRupee, CheckCircle, XCircle, Loader, Tag,
//   TrendingUp, Eye
// } from 'lucide-react';
// import { getTileById, trackQRScan } from '../lib/firebaseutils';
// import { Tile } from '../types';

// export const TileDetailsPage: React.FC = () => {
//   const { tileId } = useParams<{ tileId: string }>();
//   const navigate = useNavigate();
  
//   const [tile, setTile] = useState<Tile | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [isFavorite, setIsFavorite] = useState(false);
//   const [scanTracked, setScanTracked] = useState(false);

//   // ✅ SOLUTION: useRef flag to prevent duplicate tracking
//   const hasTrackedScan = useRef(false);
//   const isInitialMount = useRef(true);

//   useEffect(() => {
//     // Reset tracking flag when tileId changes
//     if (isInitialMount.current) {
//       isInitialMount.current = false;
//     } else {
//       hasTrackedScan.current = false;
//     }
    
//     loadTileData();
    
//     // Cleanup function
//     return () => {
//       // Don't reset on unmount to prevent tracking on re-mount
//     };
//   }, [tileId]);

//   const loadTileData = async () => {
//     if (!tileId) {
//       setError('No tile ID provided');
//       setLoading(false);
//       return;
//     }

//     try {
//       setLoading(true);
//       setError(null);

//       if (process.env.NODE_ENV === 'development') {
//         console.log('🔍 Loading tile data for ID:', tileId);
//       }

//       // Step 1: Fetch tile from Firebase
//       const tileData = await getTileById(tileId);

//       if (!tileData) {
//         setError('Tile not found');
//         if (process.env.NODE_ENV === 'development') {
//           console.error('❌ Tile not found:', tileId);
//         }
//         return;
//       }

//       if (process.env.NODE_ENV === 'development') {
//         console.log('✅ Tile data loaded:', tileData.name);
//       }
      
//       setTile(tileData);

//       // ✅ Step 2: Track QR Scan ONLY ONCE
//       await trackQRScanOnce(tileId, tileData);

//     } catch (err: any) {
//       console.error('❌ Error loading tile:', err);
//       setError('Failed to load tile details');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ✅ SOLUTION: Separate tracking function with duplicate prevention
//   const trackQRScanOnce = async (id: string, tileData: Tile) => {
//     // Check 1: useRef flag (prevents React Strict Mode duplicates)
//     if (hasTrackedScan.current) {
//       if (process.env.NODE_ENV === 'development') {
//         console.log('⏭️ QR scan already tracked (useRef), skipping...');
//       }
//       return;
//     }

//     // Check 2: Session storage (prevents page reload duplicates)
//     const sessionKey = `qr_tracked_${id}`;
//     const sessionTracked = sessionStorage.getItem(sessionKey);
    
//     if (sessionTracked) {
//       const trackedTime = parseInt(sessionTracked);
//       const timeDiff = Date.now() - trackedTime;
      
//       // If tracked within last 5 minutes, skip
//       if (timeDiff < 5 * 60 * 1000) {
//         if (process.env.NODE_ENV === 'development') {
//           console.log('⏭️ QR scan already tracked (session), skipping...');
//         }
//         hasTrackedScan.current = true;
//         setScanTracked(true);
//         return;
//       }
//     }

//     // Track QR scan
//     try {
//       if (process.env.NODE_ENV === 'development') {
//         console.log('📊 Tracking QR scan...');
//       }

//       await trackQRScan(id, {
//         sellerId: tileData.sellerId,
//         showroomId: tileData.showroomId
//       });

//       // Mark as tracked
//       hasTrackedScan.current = true;
//       sessionStorage.setItem(sessionKey, Date.now().toString());
//       setScanTracked(true);

//       if (process.env.NODE_ENV === 'development') {
//         console.log('✅ QR scan tracked successfully:', {
//           tileId: id,
//           tileName: tileData.name,
//           sellerId: tileData.sellerId,
//           timestamp: new Date().toISOString()
//         });
//       }

//     } catch (trackError: any) {
//       console.warn('⚠️ Failed to track QR scan (non-critical):', trackError.message);
//       // Don't fail the whole page load
//     }
//   };

//   const handleShare = async () => {
//     if (!tile) return;

//     const shareData = {
//       title: tile.name,
//       text: `Check out this tile: ${tile.name} - ₹${tile.price}/sq.ft`,
//       url: window.location.href
//     };

//     try {
//       if (navigator.share) {
//         await navigator.share(shareData);
//         if (process.env.NODE_ENV === 'development') {
//           console.log('✅ Shared via Web Share API');
//         }
//       } else {
//         await navigator.clipboard.writeText(window.location.href);
//         alert('Link copied to clipboard!');
//         if (process.env.NODE_ENV === 'development') {
//           console.log('✅ Link copied to clipboard');
//         }
//       }
//     } catch (err) {
//       console.error('❌ Error sharing:', err);
//     }
//   };

//   const handleTryIn3D = () => {
//     if (!tile) return;
    
//     if (process.env.NODE_ENV === 'development') {
//       console.log('🎨 Navigating to room selection for tile:', tile.name);
//     }
//     navigate(`/room-select/${tileId}`);
//   };

//   const handleToggleFavorite = () => {
//     setIsFavorite(!isFavorite);
//     if (process.env.NODE_ENV === 'development') {
//       console.log(`${isFavorite ? '💔 Removed from' : '❤️ Added to'} favorites:`, tile?.name);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-50">
//         <div className="text-center">
//           <Loader className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
//           <p className="text-gray-600 font-medium">Loading tile details...</p>
//           <p className="text-gray-400 text-sm mt-2">Please wait</p>
//         </div>
//       </div>
//     );
//   }

//   if (error || !tile) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-50">
//         <div className="text-center max-w-md mx-4">
//           <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
//           <h2 className="text-2xl font-bold text-gray-800 mb-2">
//             {error || 'Tile Not Found'}
//           </h2>
//           <p className="text-gray-600 mb-6">
//             The tile you're looking for doesn't exist or has been removed.
//           </p>
//           <button
//             onClick={() => navigate('/')}
//             className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
//           >
//             Go to Home
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 pb-20">
//       {/* Header */}
//       <div className="bg-white shadow-sm sticky top-0 z-10">
//         <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
//           <button
//             onClick={() => navigate(-1)}
//             className="p-2 hover:bg-gray-100 rounded-full transition-colors"
//             title="Go back"
//           >
//             <ArrowLeft className="w-6 h-6 text-gray-700" />
//           </button>
          
//           <div className="flex items-center gap-2">
//             <button
//               onClick={handleShare}
//               className="p-2 hover:bg-gray-100 rounded-full transition-colors"
//               title="Share"
//             >
//               <Share2 className="w-6 h-6 text-gray-700" />
//             </button>
//             <button
//               onClick={handleToggleFavorite}
//               className={`p-2 rounded-full transition-colors ${
//                 isFavorite
//                   ? 'bg-red-50 text-red-600'
//                   : 'hover:bg-gray-100 text-gray-700'
//               }`}
//               title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
//             >
//               <Heart className={`w-6 h-6 ${isFavorite ? 'fill-current' : ''}`} />
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Content */}
//       <div className="max-w-4xl mx-auto px-4 py-6">
        
//         {/* Scan Tracked Indicator */}
//         {scanTracked && (
//           <div className="mb-4 bg-green-50 border border-green-200 rounded-lg p-3 flex items-center gap-3">
//             <TrendingUp className="w-5 h-5 text-green-600 flex-shrink-0" />
//             <div className="flex-1">
//               <p className="text-green-800 font-medium text-sm">QR Scan Tracked</p>
//               <p className="text-green-600 text-xs">This view has been recorded in analytics</p>
//             </div>
//             <CheckCircle className="w-5 h-5 text-green-600" />
//           </div>
//         )}

//         {/* Tile Image */}
//         <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-6">
//           <div className="aspect-square relative">
//             <img
//               src={tile.imageUrl}
//               alt={tile.name}
//               className="w-full h-full object-cover"
//               onError={(e) => {
//                 (e.target as HTMLImageElement).src = '/placeholder-tile.png';
//               }}
//             />
//             {!tile.inStock && (
//               <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
//                 <div className="bg-red-600 text-white px-6 py-3 rounded-lg font-bold text-lg shadow-xl">
//                   OUT OF STOCK
//                 </div>
//               </div>
//             )}
            
//             {tile.viewCount && tile.viewCount > 0 && (
//               <div className="absolute top-4 left-4 bg-black/70 text-white px-3 py-1 rounded-full flex items-center gap-2 backdrop-blur-sm">
//                 <Eye className="w-4 h-4" />
//                 <span className="text-sm font-medium">{tile.viewCount} views</span>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Tile Details */}
//         <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
//           <h1 className="text-3xl font-bold text-gray-900 mb-2">{tile.name}</h1>
          
//           {tile.tileCode && (
//             <div className="flex items-center gap-2 text-gray-600 mb-4">
//               <Tag className="w-4 h-4" />
//               <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">{tile.tileCode}</span>
//             </div>
//           )}

//           {/* Key Info Grid */}
//           <div className="grid grid-cols-2 gap-4 mb-6">
//             {/* Size */}
//             <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg border border-blue-100">
//               <Ruler className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
//               <div>
//                 <p className="text-xs text-blue-600 font-medium uppercase tracking-wide">Size</p>
//                 <p className="text-lg font-bold text-gray-900">{tile.size}</p>
//               </div>
//             </div>

//             {/* Price */}
//             <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg border border-green-100">
//               <IndianRupee className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
//               <div>
//                 <p className="text-xs text-green-600 font-medium uppercase tracking-wide">Price</p>
//                 <p className="text-lg font-bold text-gray-900">₹{tile.price}</p>
//                 <p className="text-xs text-gray-500">per sq.ft</p>
//               </div>
//             </div>

//             {/* Category */}
//             <div className="flex items-start gap-3 p-4 bg-purple-50 rounded-lg border border-purple-100">
//               <Package className="w-5 h-5 text-purple-600 mt-1 flex-shrink-0" />
//               <div>
//                 <p className="text-xs text-purple-600 font-medium uppercase tracking-wide">Category</p>
//                 <p className="text-lg font-bold text-gray-900 capitalize">
//                   {tile.category === 'both' ? 'Floor & Wall' : tile.category}
//                 </p>
//               </div>
//             </div>

//             {/* Stock */}
//             <div className="flex items-start gap-3 p-4 bg-orange-50 rounded-lg border border-orange-100">
//               {tile.inStock ? (
//                 <CheckCircle className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
//               ) : (
//                 <XCircle className="w-5 h-5 text-red-600 mt-1 flex-shrink-0" />
//               )}
//               <div>
//                 <p className="text-xs text-orange-600 font-medium uppercase tracking-wide">Availability</p>
//                 <p className={`text-lg font-bold ${
//                   tile.inStock ? 'text-green-600' : 'text-red-600'
//                 }`}>
//                   {tile.inStock ? 'In Stock' : 'Out of Stock'}
//                 </p>
//                 {tile.stock > 0 && (
//                   <p className="text-xs text-gray-500">{tile.stock} pieces</p>
//                 )}
//               </div>
//             </div>
//           </div>

//           {/* Try in 3D Button */}
//           <button
//             onClick={handleTryIn3D}
//             disabled={!tile.inStock}
//             className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg transition-all duration-200 flex items-center justify-center gap-3 ${
//               tile.inStock
//                 ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-xl hover:scale-[1.02]'
//                 : 'bg-gray-300 text-gray-500 cursor-not-allowed'
//             }`}
//           >
//             <span>Try in 3D Room</span>
//             <span className="text-2xl">→</span>
//           </button>

//           {!tile.inStock && (
//             <p className="text-center text-red-600 text-sm mt-2">
//               This tile is currently out of stock
//             </p>
//           )}
//         </div>

//         {/* Additional Info */}
//         <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-100">
//           <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
//             <span className="text-2xl">✨</span>
//             See How It Looks
//           </h3>
//           <ul className="space-y-2 text-gray-700">
//             <li className="flex items-start gap-2">
//               <span className="text-blue-600 mt-1 font-bold">•</span>
//               <span>View tile in realistic 3D rooms</span>
//             </li>
//             <li className="flex items-start gap-2">
//               <span className="text-blue-600 mt-1 font-bold">•</span>
//               <span>Try in Kitchen, Bathroom, or Drawing Room</span>
//             </li>
//             <li className="flex items-start gap-2">
//               <span className="text-blue-600 mt-1 font-bold">•</span>
//               <span>360° rotation and zoom</span>
//             </li>
//             <li className="flex items-start gap-2">
//               <span className="text-blue-600 mt-1 font-bold">•</span>
//               <span>See on floor and walls</span>
//             </li>
//             <li className="flex items-start gap-2">
//               <span className="text-blue-600 mt-1 font-bold">•</span>
//               <span>Mix and match with other tiles</span>
//             </li>
//           </ul>
//         </div>
//       </div>
//     </div>
//   );
// }; 

// src/pages/TileDetailsPage.tsx - PRODUCTION READY
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Share2, Heart, Package, Ruler, 
  IndianRupee, CheckCircle, XCircle, Loader, Tag,
  TrendingUp, Eye
} from 'lucide-react';
import { getTileById, trackQRScan } from '../lib/firebaseutils';
import { Tile } from '../types';

export const TileDetailsPage: React.FC = () => {
  const { tileId } = useParams<{ tileId: string }>();
  const navigate = useNavigate();
  
  const [tile, setTile] = useState<Tile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [scanTracked, setScanTracked] = useState(false);

  // ✅ Only prevent duplicate tracking within same component mount
  const hasTrackedScan = useRef(false);

  useEffect(() => {
    // ✅ Reset tracking flag when tileId changes (new scan)
    hasTrackedScan.current = false;
    setScanTracked(false);
    
    loadTileData();
  }, [tileId]);

  const loadTileData = async () => {
    if (!tileId) {
      setError('No tile ID provided');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      if (process.env.NODE_ENV === 'development') {
        console.log('🔍 Loading tile data for ID:', tileId);
      }

      // Step 1: Fetch tile from Firebase
      const tileData = await getTileById(tileId);

      if (!tileData) {
        setError('Tile not found');
        if (process.env.NODE_ENV === 'development') {
          console.error('❌ Tile not found:', tileId);
        }
        return;
      }

      if (process.env.NODE_ENV === 'development') {
        console.log('✅ Tile data loaded:', tileData.name);
      }
      
      setTile(tileData);

      // ✅ Step 2: Track QR Scan (हर visit पर)
      await trackQRScanOnce(tileId, tileData);

    } catch (err: any) {
      console.error('❌ Error loading tile:', err);
      setError('Failed to load tile details');
    } finally {
      setLoading(false);
    }
  };

  // ✅ Track scan - only prevents React Strict Mode duplicates
  const trackQRScanOnce = async (id: string, tileData: Tile) => {
    // Only check: Has this component instance already tracked?
    // (Prevents React Strict Mode double-call)
    if (hasTrackedScan.current) {
      if (process.env.NODE_ENV === 'development') {
        console.log('⏭️ Already tracked in this component mount, skipping...');
      }
      return;
    }

    // ✅ Track QR scan every time user visits
    try {
      if (process.env.NODE_ENV === 'development') {
        console.log('📊 Tracking QR scan...');
      }

      await trackQRScan(id, {
        sellerId: tileData.sellerId,
        showroomId: tileData.showroomId
      });

      // Mark as tracked for this component instance only
      hasTrackedScan.current = true;
      setScanTracked(true);

      if (process.env.NODE_ENV === 'development') {
        console.log('✅ QR scan tracked successfully:', {
          tileId: id,
          tileName: tileData.name,
          sellerId: tileData.sellerId,
          timestamp: new Date().toISOString()
        });
      }

    } catch (trackError: any) {
      console.warn('⚠️ Failed to track QR scan (non-critical):', trackError.message);
      // Don't fail the whole page load
    }
  };

  const handleShare = async () => {
    if (!tile) return;

    const shareData = {
      title: tile.name,
      text: `Check out this tile: ${tile.name} - ₹${tile.price}/sq.ft`,
      url: window.location.href
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        if (process.env.NODE_ENV === 'development') {
          console.log('✅ Shared via Web Share API');
        }
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert('Link copied to clipboard!');
        if (process.env.NODE_ENV === 'development') {
          console.log('✅ Link copied to clipboard');
        }
      }
    } catch (err) {
      console.error('❌ Error sharing:', err);
    }
  };

  const handleTryIn3D = () => {
    if (!tile) return;
    
    if (process.env.NODE_ENV === 'development') {
      console.log('🎨 Navigating to room selection for tile:', tile.name);
    }
    navigate(`/room-select/${tileId}`);
  };

  const handleToggleFavorite = () => {
    setIsFavorite(!isFavorite);
    if (process.env.NODE_ENV === 'development') {
      console.log(`${isFavorite ? '💔 Removed from' : '❤️ Added to'} favorites:`, tile?.name);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading tile details...</p>
          <p className="text-gray-400 text-sm mt-2">Please wait</p>
        </div>
      </div>
    );
  }

  if (error || !tile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-4">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            {error || 'Tile Not Found'}
          </h2>
          <p className="text-gray-600 mb-6">
            The tile you're looking for doesn't exist or has been removed.
          </p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            title="Go back"
          >
            <ArrowLeft className="w-6 h-6 text-gray-700" />
          </button>
          
          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              title="Share"
            >
              <Share2 className="w-6 h-6 text-gray-700" />
            </button>
            <button
              onClick={handleToggleFavorite}
              className={`p-2 rounded-full transition-colors ${
                isFavorite
                  ? 'bg-red-50 text-red-600'
                  : 'hover:bg-gray-100 text-gray-700'
              }`}
              title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              <Heart className={`w-6 h-6 ${isFavorite ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        
        {/* Scan Tracked Indicator */}
        {scanTracked && (
          <div className="mb-4 bg-green-50 border border-green-200 rounded-lg p-3 flex items-center gap-3">
            <TrendingUp className="w-5 h-5 text-green-600 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-green-800 font-medium text-sm">QR Scan Tracked</p>
              <p className="text-green-600 text-xs">This view has been recorded in analytics</p>
            </div>
            <CheckCircle className="w-5 h-5 text-green-600" />
          </div>
        )}

        {/* Tile Image */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-6">
          <div className="aspect-square relative">
            <img
              src={tile.imageUrl}
              alt={tile.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/placeholder-tile.png';
              }}
            />
            {!tile.inStock && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <div className="bg-red-600 text-white px-6 py-3 rounded-lg font-bold text-lg shadow-xl">
                  OUT OF STOCK
                </div>
              </div>
            )}
            
            {tile.viewCount && tile.viewCount > 0 && (
              <div className="absolute top-4 left-4 bg-black/70 text-white px-3 py-1 rounded-full flex items-center gap-2 backdrop-blur-sm">
                <Eye className="w-4 h-4" />
                <span className="text-sm font-medium">{tile.viewCount} views</span>
              </div>
            )}
          </div>
        </div>

        {/* Tile Details */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{tile.name}</h1>
          
          {tile.tileCode && (
            <div className="flex items-center gap-2 text-gray-600 mb-4">
              <Tag className="w-4 h-4" />
              <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">{tile.tileCode}</span>
            </div>
          )}

          {/* Key Info Grid */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            {/* Size */}
            <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg border border-blue-100">
              <Ruler className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
              <div>
                <p className="text-xs text-blue-600 font-medium uppercase tracking-wide">Size</p>
                <p className="text-lg font-bold text-gray-900">{tile.size}</p>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg border border-green-100">
              <IndianRupee className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
              <div>
                <p className="text-xs text-green-600 font-medium uppercase tracking-wide">Price</p>
                <p className="text-lg font-bold text-gray-900">₹{tile.price}</p>
                <p className="text-xs text-gray-500">per sq.ft</p>
              </div>
            </div>

            {/* Category */}
            <div className="flex items-start gap-3 p-4 bg-purple-50 rounded-lg border border-purple-100">
              <Package className="w-5 h-5 text-purple-600 mt-1 flex-shrink-0" />
              <div>
                <p className="text-xs text-purple-600 font-medium uppercase tracking-wide">Category</p>
                <p className="text-lg font-bold text-gray-900 capitalize">
                  {tile.category === 'both' ? 'Floor & Wall' : tile.category}
                </p>
              </div>
            </div>

            {/* Stock */}
            <div className="flex items-start gap-3 p-4 bg-orange-50 rounded-lg border border-orange-100">
              {tile.inStock ? (
                <CheckCircle className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
              ) : (
                <XCircle className="w-5 h-5 text-red-600 mt-1 flex-shrink-0" />
              )}
              <div>
                <p className="text-xs text-orange-600 font-medium uppercase tracking-wide">Availability</p>
                <p className={`text-lg font-bold ${
                  tile.inStock ? 'text-green-600' : 'text-red-600'
                }`}>
                  {tile.inStock ? 'In Stock' : 'Out of Stock'}
                </p>
                {tile.stock > 0 && (
                  <p className="text-xs text-gray-500">{tile.stock} pieces</p>
                )}
              </div>
            </div>
          </div>

          {/* Try in 3D Button */}
          <button
            onClick={handleTryIn3D}
            disabled={!tile.inStock}
            className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg transition-all duration-200 flex items-center justify-center gap-3 ${
              tile.inStock
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-xl hover:scale-[1.02]'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            <span>Try in 3D Room</span>
            <span className="text-2xl">→</span>
          </button>

          {!tile.inStock && (
            <p className="text-center text-red-600 text-sm mt-2">
              This tile is currently out of stock
            </p>
          )}
        </div>

        {/* Additional Info */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-100">
          <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
            <span className="text-2xl">✨</span>
            See How It Looks
          </h3>
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-1 font-bold">•</span>
              <span>View tile in realistic 3D rooms</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-1 font-bold">•</span>
              <span>Try in Kitchen, Bathroom, or Drawing Room</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-1 font-bold">•</span>
              <span>360° rotation and zoom</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-1 font-bold">•</span>
              <span>See on floor and walls</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-1 font-bold">•</span>
              <span>Mix and match with other tiles</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};