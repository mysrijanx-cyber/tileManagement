 
// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { 
//   QrCode, LogOut, Camera, AlertCircle, CheckCircle, 
//   Loader, Package, User, RefreshCw 
// } from 'lucide-react';
// import { QRScanner } from '../components/QRScanner';
// import { useAppStore } from '../stores/appStore';
// import { useAuth } from '../hooks/useAuth';
// import { useWorkerStatus } from '../hooks/useWorkerStatus';
// import { trackTileScanEnhanced, getTileById, trackQRScan, trackWorkerActivity } from '../lib/firebaseutils';

// interface RecentScan {
//   id: string;
//   tileName: string;
//   tileImage: string;
//   scannedAt: string;
//   tileId: string;
// }

// export const ScanPage: React.FC = () => {
//   const navigate = useNavigate();
//   const { currentUser, isAuthenticated } = useAppStore();
//   const { logout } = useAuth();

//   const [showScanner, setShowScanner] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [success, setSuccess] = useState<string | null>(null);
//   const [recentScans, setRecentScans] = useState<RecentScan[]>([]);
//   const [scannedTileData, setScannedTileData] = useState<any>(null);

//   // ✅ Worker status hook
//   useWorkerStatus();

//   useEffect(() => {
//     loadRecentScans();
//   }, []);

//   useEffect(() => {
//     if (error || success) {
//       const timer = setTimeout(() => {
//         setError(null);
//         setSuccess(null);
//       }, 4000);
//       return () => clearTimeout(timer);
//     }
//   }, [error, success]);

//   const loadRecentScans = () => {
//     try {
//       const saved = localStorage.getItem('worker_recent_scans');
//       if (saved) {
//         const scans = JSON.parse(saved);
//         setRecentScans(scans.slice(0, 5));
//       }
//     } catch (err) {
//       console.warn('Could not load recent scans:', err);
//     }
//   };

//   const saveRecentScan = (scan: RecentScan) => {
//     try {
//       const updated = [scan, ...recentScans.filter(s => s.tileId !== scan.tileId)].slice(0, 5);
//       setRecentScans(updated);
//       localStorage.setItem('worker_recent_scans', JSON.stringify(updated));
//     } catch (err) {
//       console.warn('Could not save recent scan:', err);
//     }
//   };

//   // const handleScanSuccess = async (data: any) => {
//   //   try {
//   //     setLoading(true);
//   //     setError(null);
//   //     setShowScanner(false);

//   //     console.log('🔍 QR Scan successful:', data);

//   //     // ═══════════════════════════════════════════════════════════
//   //     // STEP 1: Extract Tile ID
//   //     // ═══════════════════════════════════════════════════════════
      
//   //     let tileId: string;
      
//   //     if (data.tileId) {
//   //       tileId = data.tileId;
//   //     } else if (data.type === 'manual_entry' && data.tileCode) {
//   //       setError('Manual tile code lookup not implemented yet. Please scan QR code.');
//   //       return;
//   //     } else {
//   //       setError('Invalid QR code format. Please scan a valid tile QR code.');
//   //       return;
//   //     }

//   //     console.log('✅ Tile ID extracted:', tileId);

//   //     // ═══════════════════════════════════════════════════════════
//   //     // STEP 2: Fetch Tile Data from Database
//   //     // ═══════════════════════════════════════════════════════════
      
//   //     console.log('📦 Fetching tile data...');
//   //     const tileData = await getTileById(tileId);
      
//   //     if (!tileData) {
//   //       console.error('❌ Tile not found');
//   //       setError('Tile not found. Please check the QR code and try again.');
//   //       return;
//   //     }

//   //     console.log('✅ Tile found:', tileData.name);

//   //     const sellerId = tileData.sellerId || tileData.seller_id;
//   //     const showroomId = tileData.showroomId || tileData.showroom_id;

//   //     // ═══════════════════════════════════════════════════════════
//   //     // STEP 3: Track Scan in qr_scans Collection (MAIN TRACKING)
//   //     // ═══════════════════════════════════════════════════════════
      
//   //     console.log('📊 Tracking scan...');
      
//   //     try {
//   //       // ✅ FIXED: Removed || null (causes TypeScript error)
//   //       // Just use currentUser?.user_id (returns string | undefined)
//   //       await trackTileScanEnhanced(
//   //         tileId,
//   //         sellerId,
//   //         currentUser?.user_id  // ← This is correct! No || null needed
//   //       );
        
//   //       console.log('✅ Scan tracked in qr_scans collection');
        
//   //       // Broadcast event for real-time UI update
//   //       window.dispatchEvent(new CustomEvent('tile-scanned', { 
//   //         detail: { 
//   //           tileId, 
//   //           sellerId,
//   //           tileName: tileData.name,
//   //           timestamp: new Date().toISOString()
//   //         } 
//   //       }));
        
//   //       console.log('📡 Event sent to analytics dashboard');
        
//   //     } catch (trackError: any) {
//   //       console.error('⚠️ Tracking failed:', trackError);
//   //       // Don't block user - continue
//   //     }

//   //     // ═══════════════════════════════════════════════════════════
//   //     // STEP 4: Legacy Analytics Tracking (30s cooldown)
//   //     // ═══════════════════════════════════════════════════════════
      
//   //     const sessionKey = `scan_legacy_${tileId}`;
//   //     const lastTracked = sessionStorage.getItem(sessionKey);
      
//   //     if (!lastTracked || (Date.now() - parseInt(lastTracked)) > 30000) {
//   //       try {
//   //         await trackQRScan(tileId, {
//   //           sellerId: sellerId,
//   //           showroomId: showroomId,
//   //           scannedBy: currentUser?.user_id ?? 'anonymous',  // ✅ Use ?? for default value
//   //           userRole: currentUser?.role ?? 'visitor',
//   //           scanContext: currentUser?.role === 'worker' ? 'worker_showroom_scan' : 'public_scan'
//   //         });
          
//   //         sessionStorage.setItem(sessionKey, Date.now().toString());
//   //         console.log('✅ Legacy tracking done');
          
//   //       } catch (legacyError) {
//   //         console.warn('⚠️ Legacy tracking failed:', legacyError);
//   //       }
//   //     }

//   //     // ═══════════════════════════════════════════════════════════
//   //     // STEP 5: Track Worker Activity (if user is worker)
//   //     // ═══════════════════════════════════════════════════════════
      
//   //     if (currentUser?.role === 'worker' && currentUser?.user_id) {
//   //       try {
//   //         await trackWorkerActivity(
//   //           currentUser.user_id,
//   //           'scan',
//   //           { 
//   //             tileId: tileId,
//   //             tileName: tileData.name,
//   //             sellerId: sellerId
//   //           }
//   //         );
//   //         console.log('✅ Worker activity tracked');
//   //       } catch (workerError) {
//   //         console.warn('⚠️ Worker tracking failed:', workerError);
//   //       }
//   //     }

//   //     // ═══════════════════════════════════════════════════════════
//   //     // STEP 6: Save to Recent Scans (localStorage)
//   //     // ═══════════════════════════════════════════════════════════
      
//   //     saveRecentScan({
//   //       id: tileId,
//   //       tileName: tileData.name,
//   //       tileImage: tileData.imageUrl || tileData.image_url || '/placeholder-tile.png',
//   //       scannedAt: new Date().toISOString(),
//   //       tileId: tileId
//   //     });

//   //     // ═══════════════════════════════════════════════════════════
//   //     // STEP 7: Show Success and Navigate
//   //     // ═══════════════════════════════════════════════════════════
      
//   //     setSuccess(`✅ Scanned: ${tileData.name}`);

//   //     setTimeout(() => {
//   //       navigate(`/tile/${tileId}`);
//   //     }, 1000);

//   //   } catch (err: any) {
//   //     console.error('❌ Error:', err);
//   //     setError('Failed to process scan. Please try again.');
//   //   } finally {
//   //     setLoading(false);
//   //   }
//   // };

//   // const handleScanSuccess = async (data: any) => {
//   //   try {
//   //     setLoading(true);
//   //     setError(null);
//   //     // ✅ DON'T CLOSE SCANNER YET - let user choose
//   //     // setShowScanner(false);  // ← REMOVED THIS!
  
//   //     console.log('🔍 QR Scan successful:', data);
  
//   //     // Extract tile ID
//   //     let tileId: string;
      
//   //     if (data.tileId) {
//   //       tileId = data.tileId;
//   //     } else if (data.type === 'manual_entry' && data.tileCode) {
//   //       setError('Manual tile code lookup not implemented yet.');
//   //       setLoading(false);
//   //       return;
//   //     } else {
//   //       setError('Invalid QR code format.');
//   //       setLoading(false);
//   //       return;
//   //     }
  
//   //     console.log('✅ Tile ID:', tileId);
  
//   //     // Fetch tile
//   //     console.log('📦 Fetching tile...');
//   //     const tileData = await getTileById(tileId);
      
//   //     if (!tileData) {
//   //       console.error('❌ Tile not found');
//   //       setError('Tile not found. Try another QR code.');
//   //       setLoading(false);
//   //       return;
//   //     }
  
//   //     console.log('✅ Tile found:', tileData.name);
  
//   //     const sellerId = tileData.sellerId || tileData.seller_id;
//   //     const showroomId = tileData.showroomId || tileData.showroom_id;
  
//   //     // ═══════════════════════════════════════════════════════════
//   //     // ✅ TRACK SCAN - NO COOLDOWN!
//   //     // ═══════════════════════════════════════════════════════════
      
//   //     console.log('📊 Tracking scan...');
      
//   //     try {
//   //       await trackTileScanEnhanced(
//   //         tileId,
//   //         sellerId,
//   //         currentUser?.user_id
//   //       );
        
//   //       console.log('✅ Scan tracked!');
        
//   //       // Send event for real-time update
//   //       window.dispatchEvent(new CustomEvent('tile-scanned', { 
//   //         detail: { 
//   //           tileId, 
//   //           sellerId,
//   //           tileName: tileData.name,
//   //           timestamp: new Date().toISOString()
//   //         } 
//   //       }));
        
//   //       console.log('📡 Event sent!');
        
//   //     } catch (trackError: any) {
//   //       console.error('⚠️ Tracking failed:', trackError);
//   //     }
  
//   //     // Legacy tracking (with 30s cooldown to prevent spam)
//   //     const sessionKey = `scan_legacy_${tileId}`;
//   //     const lastTracked = sessionStorage.getItem(sessionKey);
      
//   //     if (!lastTracked || (Date.now() - parseInt(lastTracked)) > 30000) {
//   //       try {
//   //         await trackQRScan(tileId, {
//   //           sellerId: sellerId,
//   //           showroomId: showroomId,
//   //           scannedBy: currentUser?.user_id ?? 'anonymous',
//   //           userRole: currentUser?.role ?? 'visitor',
//   //           scanContext: currentUser?.role === 'worker' ? 'worker_showroom_scan' : 'public_scan'
//   //         });
          
//   //         sessionStorage.setItem(sessionKey, Date.now().toString());
//   //       } catch (e) {
//   //         console.warn('Legacy tracking failed');
//   //       }
//   //     }
  
//   //     // Worker activity
//   //     if (currentUser?.role === 'worker' && currentUser?.user_id) {
//   //       try {
//   //         await trackWorkerActivity(
//   //           currentUser.user_id,
//   //           'scan',
//   //           { tileId, tileName: tileData.name, sellerId }
//   //         );
//   //       } catch (e) {
//   //         console.warn('Worker tracking failed');
//   //       }
//   //     }
  
//   //     // Save to recent
//   //     saveRecentScan({
//   //       id: tileId,
//   //       tileName: tileData.name,
//   //       tileImage: tileData.imageUrl || tileData.image_url || '/placeholder-tile.png',
//   //       scannedAt: new Date().toISOString(),
//   //       tileId: tileId
//   //     });
  
//   //     // ═══════════════════════════════════════════════════════════
//   //     // ✅ SHOW SUCCESS WITH OPTIONS (Don't auto-navigate!)
//   //     // ═══════════════════════════════════════════════════════════
      
//   //     setSuccess(`✅ ${tileData.name} scanned successfully!`);
      
//   //     // ✅ CLOSE SCANNER and show options
//   //     setShowScanner(false);
      
//   //     // ✅ Show scan result card with options
//   //     setScannedTileData({
//   //       id: tileId,
//   //       name: tileData.name,
//   //       image: tileData.imageUrl || tileData.image_url,
//   //       code: tileData.tileCode || tileData.tile_code,
//   //       size: tileData.size,
//   //       price: tileData.price,
//   //       stock: tileData.stock,
//   //       inStock: tileData.inStock
//   //     });
  
//   //   } catch (err: any) {
//   //     console.error('❌ Error:', err);
//   //     setError('Failed to process scan.');
//   //     setLoading(false);
//   //   } finally {
//   //     setLoading(false);
//   //   }
//   // };
//   const handleScanSuccess = async (data: any) => {
//     try {
//       setLoading(true);
//       setError(null);
  
//       console.log('🔍 QR Scan successful:', data);
  
//       // Extract tile ID
//       let tileId: string;
      
//       if (data.tileId) {
//         tileId = data.tileId;
//       } else if (data.type === 'manual_entry' && data.tileCode) {
//         setError('Manual tile code lookup not implemented yet.');
//         setLoading(false);
//         return;
//       } else {
//         setError('Invalid QR code format.');
//         setLoading(false);
//         return;
//       }
  
//       console.log('✅ Tile ID:', tileId);
  
//       // Fetch tile data
//       console.log('📦 Fetching tile data...');
//       const tileData = await getTileById(tileId);
      
//       if (!tileData) {
//         console.error('❌ Tile not found');
//         setError('Tile not found. Try another QR code.');
//         setLoading(false);
//         return;
//       }
  
//       console.log('✅ Tile found:', tileData.name);
  
//       const sellerId = tileData.sellerId || tileData.seller_id;
//       const showroomId = tileData.showroomId || tileData.showroom_id;
  
//       // ═══════════════════════════════════════════════════════════
//       // ✅ STEP 1: MAIN TRACKING - NO COOLDOWN!
//       // ═══════════════════════════════════════════════════════════
      
//       console.log('📊 Tracking scan in qr_scans collection...');
      
//       try {
//         await trackTileScanEnhanced(
//           tileId,
//           sellerId,
//           currentUser?.user_id
//         );
        
//         console.log('✅ Scan tracked in qr_scans collection!');
        
//         // Broadcast event for real-time UI update
//         window.dispatchEvent(new CustomEvent('tile-scanned', { 
//           detail: { 
//             tileId, 
//             sellerId,
//             tileName: tileData.name,
//             timestamp: new Date().toISOString()
//           } 
//         }));
        
//         console.log('📡 Event broadcasted to Analytics!');
        
//       } catch (trackError: any) {
//         console.error('⚠️ Main tracking failed:', trackError);
//         // Continue - don't block user
//       }
  
//       // ═══════════════════════════════════════════════════════════
//       // ✅ STEP 2: LEGACY ANALYTICS - REMOVED COOLDOWN!
//       // ═══════════════════════════════════════════════════════════
      
//       // ✅ REMOVED: No more session cooldown check!
//       // Old code was:
//       // const sessionKey = `scan_legacy_${tileId}`;
//       // if (!lastTracked || (Date.now() - parseInt(lastTracked)) > 30000) { ... }
      
//       // ✅ NEW: Track EVERY scan in analytics collection too
//       try {
//         await trackQRScan(tileId, {
//           sellerId: sellerId,
//           showroomId: showroomId,
//           scannedBy: currentUser?.user_id ?? 'anonymous',
//           userRole: currentUser?.role ?? 'visitor',
//           scanContext: currentUser?.role === 'worker' ? 'worker_showroom_scan' : 'public_scan'
//         });
        
//         console.log('✅ Legacy analytics tracked!');
        
//       } catch (legacyError) {
//         console.warn('⚠️ Legacy tracking failed:', legacyError);
//         // Non-critical
//       }
  
//       // ═══════════════════════════════════════════════════════════
//       // ✅ STEP 3: WORKER ACTIVITY
//       // ═══════════════════════════════════════════════════════════
      
//       if (currentUser?.role === 'worker' && currentUser?.user_id) {
//         try {
//           await trackWorkerActivity(
//             currentUser.user_id,
//             'scan',
//             { tileId, tileName: tileData.name, sellerId }
//           );
//           console.log('✅ Worker activity tracked!');
//         } catch (e) {
//           console.warn('⚠️ Worker tracking failed');
//         }
//       }
  
//       // ═══════════════════════════════════════════════════════════
//       // ✅ STEP 4: SAVE TO RECENT SCANS
//       // ═══════════════════════════════════════════════════════════
      
//       saveRecentScan({
//         id: tileId,
//         tileName: tileData.name,
//         tileImage: tileData.imageUrl || tileData.image_url || '/placeholder-tile.png',
//         scannedAt: new Date().toISOString(),
//         tileId: tileId
//       });
  
//       console.log('✅ Saved to recent scans');
  
//       // ═══════════════════════════════════════════════════════════
//       // ✅ STEP 5: SHOW RESULT
//       // ═══════════════════════════════════════════════════════════
      
//       setSuccess(`✅ ${tileData.name} scanned!`);
//       setShowScanner(false);
      
//       setScannedTileData({
//         id: tileId,
//         name: tileData.name,
//         image: tileData.imageUrl || tileData.image_url,
//         code: tileData.tileCode || tileData.tile_code,
//         size: tileData.size,
//         price: tileData.price,
//         stock: tileData.stock,
//         inStock: tileData.inStock
//       });
  
//     } catch (err: any) {
//       console.error('❌ Error:', err);
//       setError('Failed to process scan.');
//     } finally {
//       setLoading(false);
//     }
//   };
  
  
//   const handleLogout = async () => {
//     if (window.confirm('Are you sure you want to logout?')) {
//       try {
//         // Track logout if worker
//         if (currentUser?.role === 'worker' && currentUser?.user_id) {
//           try {
//             await trackWorkerActivity(
//               currentUser.user_id,
//               'logout',
//               { manual: true }
//             );
//           } catch (e) {
//             console.warn('Could not track logout');
//           }
//         }
        
//         await logout();
        
//         // Clear data
//         localStorage.removeItem('worker_recent_scans');
//         sessionStorage.clear();
        
//         navigate('/');
//       } catch (err) {
//         console.error('Logout error:', err);
//         // Force logout
//         localStorage.clear();
//         sessionStorage.clear();
//         window.location.href = '/';
//       }
//     }
//   };

//   const openRecentScan = (tileId: string) => {
//     navigate(`/tile/${tileId}`);
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
//       {/* Header */}
//       <div className="bg-black/30 backdrop-blur-sm border-b border-white/10">
//         <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
//           <div className="flex items-center gap-3">
//             <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
//               <QrCode className="w-6 h-6 text-white" />
//             </div>
//             <div>
//               <h1 className="text-white font-bold text-xl">Tile Scanner</h1>
//               <p className="text-blue-200 text-sm">
//                 Welcome, {currentUser?.full_name || 'Worker'}
//               </p>
//             </div>
//           </div>

//           <button
//             onClick={handleLogout}
//             className="flex items-center gap-2 px-4 py-2 bg-red-600/20 text-red-200 rounded-lg hover:bg-red-600/30 transition-colors border border-red-500/30"
//           >
//             <LogOut className="w-4 h-4" />
//             Logout
//           </button>
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        
//         {/* Success/Error Messages */}
//         {success && (
//           <div className="bg-green-500/20 border border-green-500/30 text-green-200 px-6 py-4 rounded-lg backdrop-blur-sm flex items-center gap-3">
//             <CheckCircle className="w-6 h-6 flex-shrink-0" />
//             <p className="font-medium">{success}</p>
//           </div>
//         )}

//         {error && (
//           <div className="bg-red-500/20 border border-red-500/30 text-red-200 px-6 py-4 rounded-lg backdrop-blur-sm flex items-center gap-3">
//             <AlertCircle className="w-6 h-6 flex-shrink-0" />
//             <p className="font-medium">{error}</p>
//           </div>
//         )}

//         {/* Scan Section */}
//         <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-8 text-center">
//           <div className="mb-6">
//             <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
//               <Camera className="w-10 h-10 text-white" />
//             </div>
//             <h2 className="text-2xl font-bold text-white mb-2">Scan Tile QR Code</h2>
//             <p className="text-blue-200">
//               Point your camera at the QR code on the tile to view in 3D
//             </p>
//           </div>

//           <button
//             onClick={() => setShowScanner(true)}
//             disabled={loading}
//             className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 shadow-xl"
//           >
//             {loading ? (
//               <>
//                 <Loader className="w-6 h-6 animate-spin" />
//                 Processing...
//               </>
//             ) : (
//               <>
//                 <QrCode className="w-6 h-6" />
//                 Start Scanning
//               </>
//             )}
//           </button>

//           <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
//             <div className="bg-white/5 rounded-lg p-4 border border-white/10">
//               <div className="text-blue-400 mb-2">📱 Step 1</div>
//               <div className="text-white">Click "Start Scanning"</div>
//             </div>
//             <div className="bg-white/5 rounded-lg p-4 border border-white/10">
//               <div className="text-blue-400 mb-2">🎯 Step 2</div>
//               <div className="text-white">Point at QR code</div>
//             </div>
//             <div className="bg-white/5 rounded-lg p-4 border border-white/10">
//               <div className="text-blue-400 mb-2">🏠 Step 3</div>
//               <div className="text-white">View in 3D room</div>
//             </div>
//           </div>
//         </div>
// {/* ═══════════════════════════════════════════════════════════
//     SCAN RESULT CARD - Shows after successful scan
//     ═══════════════════════════════════════════════════════════ */}
// {scannedTileData && (
//   <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-6">
//     <div className="flex items-center gap-3 mb-4">
//       <CheckCircle className="w-6 h-6 text-green-400" />
//       <h3 className="text-xl font-bold text-white">Scan Successful!</h3>
//     </div>

//     <div className="bg-white/5 rounded-xl p-4 mb-4">
//       <div className="flex items-start gap-4">
//         <img
//           src={scannedTileData.image || '/placeholder-tile.png'}
//           alt={scannedTileData.name}
//           className="w-24 h-24 object-cover rounded-lg border-2 border-white/20"
//           onError={(e) => {
//             (e.target as HTMLImageElement).src = '/placeholder-tile.png';
//           }}
//         />
//         <div className="flex-1">
//           <h4 className="text-xl font-bold text-white mb-2">
//             {scannedTileData.name}
//           </h4>
//           <div className="grid grid-cols-2 gap-2 text-sm">
//             <div>
//               <span className="text-gray-400">Code:</span>
//               <span className="ml-2 text-white font-medium">{scannedTileData.code}</span>
//             </div>
//             <div>
//               <span className="text-gray-400">Size:</span>
//               <span className="ml-2 text-white font-medium">{scannedTileData.size}</span>
//             </div>
//             <div>
//               <span className="text-gray-400">Price:</span>
//               <span className="ml-2 text-white font-medium">₹{scannedTileData.price}</span>
//             </div>
//             <div>
//               <span className="text-gray-400">Stock:</span>
//               <span className={`ml-2 font-medium ${
//                 scannedTileData.inStock ? 'text-green-400' : 'text-red-400'
//               }`}>
//                 {scannedTileData.inStock ? `${scannedTileData.stock} units` : 'Out of Stock'}
//               </span>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>

//     {/* Action Buttons */}
//     <div className="grid grid-cols-2 gap-3">
//       <button
//         onClick={() => {
//           setScannedTileData(null);
//           setShowScanner(true);
//         }}
//         className="flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-all"
//       >
//         <QrCode className="w-5 h-5" />
//         Scan Another
//       </button>
      
//       <button
//         onClick={() => {
//           navigate(`/tile/${scannedTileData.id}`);
//         }}
//         className="flex items-center justify-center gap-2 bg-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-700 transition-all"
//       >
//         <Camera className="w-5 h-5" />
//         View in 3D
//       </button>
//     </div>

//     <button
//       onClick={() => setScannedTileData(null)}
//       className="w-full mt-3 text-gray-400 hover:text-white text-sm py-2 transition-colors"
//     >
//       Dismiss
//     </button>
//   </div>
// )}
//         {/* Recent Scans */}
//         {recentScans.length > 0 && (
//           <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-6">
//             <div className="flex items-center justify-between mb-4">
//               <h3 className="text-xl font-bold text-white flex items-center gap-2">
//                 <Package className="w-5 h-5 text-blue-400" />
//                 Recent Scans
//               </h3>
//               <button
//                 onClick={() => {
//                   setRecentScans([]);
//                   localStorage.removeItem('worker_recent_scans');
//                 }}
//                 className="text-gray-400 hover:text-white text-sm flex items-center gap-1"
//               >
//                 <RefreshCw className="w-4 h-4" />
//                 Clear
//               </button>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//               {recentScans.map((scan) => (
//                 <div
//                   key={scan.id}
//                   onClick={() => openRecentScan(scan.tileId)}
//                   className="bg-white/5 rounded-lg p-4 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer group"
//                 >
//                   <div className="flex items-center gap-3 mb-3">
//                     <img
//                       src={scan.tileImage}
//                       alt={scan.tileName}
//                       className="w-12 h-12 object-cover rounded-lg"
//                       onError={(e) => {
//                         (e.target as HTMLImageElement).src = '/placeholder-tile.png';
//                       }}
//                     />
//                     <div className="flex-1 min-w-0">
//                       <p className="text-white font-medium truncate group-hover:text-blue-200">
//                         {scan.tileName}
//                       </p>
//                       <p className="text-gray-400 text-sm">
//                         {new Date(scan.scannedAt).toLocaleTimeString()}
//                       </p>
//                     </div>
//                   </div>
//                   <div className="text-blue-400 text-sm flex items-center gap-1">
//                     <QrCode className="w-3 h-3" />
//                     Tap to view again
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}

//         {/* Instructions */}
//         <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6">
//           <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
//             <User className="w-5 h-5 text-blue-400" />
//             Worker Instructions
//           </h3>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
//             <div>
//               <h4 className="text-blue-400 font-medium mb-2">🔍 Scanning Process</h4>
//               <ul className="text-gray-300 space-y-1">
//                 <li>• Find QR code on tile or display</li>
//                 <li>• Ensure good lighting for scanning</li>
//                 <li>• Hold phone steady until detected</li>
//                 <li>• Wait for automatic redirect</li>
//               </ul>
//             </div>
//             <div>
//               <h4 className="text-blue-400 font-medium mb-2">👥 Customer Service</h4>
//               <ul className="text-gray-300 space-y-1">
//                 <li>• Show 3D visualization to customer</li>
//                 <li>• Help select different room types</li>
//                 <li>• Demonstrate tile combinations</li>
//                 <li>• Share visualization links</li>
//               </ul>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* QR Scanner Modal */}
//       {showScanner && (
//         <QRScanner
//           onScanSuccess={handleScanSuccess}
//           onClose={() => setShowScanner(false)}
//         />
//       )}
//     </div>
//   );
// };   

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  QrCode, LogOut, Camera, AlertCircle, CheckCircle, 
  Loader, Package, User, RefreshCw 
} from 'lucide-react';
import { QRScanner } from '../components/QRScanner';
import { useAppStore } from '../stores/appStore';
import { useAuth } from '../hooks/useAuth';
import { useWorkerStatus } from '../hooks/useWorkerStatus';
import { trackTileScanEnhanced, getTileById, trackQRScan, trackWorkerActivity } from '../lib/firebaseutils';

interface RecentScan {
  id: string;
  tileName: string;
  tileImage: string;
  scannedAt: string;
  tileId: string;
}

export const ScanPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser, isAuthenticated } = useAppStore();
  const { logout } = useAuth();

  const [showScanner, setShowScanner] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [recentScans, setRecentScans] = useState<RecentScan[]>([]);
  const [scannedTileData, setScannedTileData] = useState<any>(null);

  useWorkerStatus();

  useEffect(() => {
    loadRecentScans();
  }, []);

  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError(null);
        setSuccess(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  const loadRecentScans = () => {
    try {
      const saved = localStorage.getItem('worker_recent_scans');
      if (saved) {
        const scans = JSON.parse(saved);
        setRecentScans(scans.slice(0, 5));
      }
    } catch (err) {
      console.warn('Could not load recent scans:', err);
    }
  };

  const saveRecentScan = (scan: RecentScan) => {
    try {
      const updated = [scan, ...recentScans.filter(s => s.tileId !== scan.tileId)].slice(0, 5);
      setRecentScans(updated);
      localStorage.setItem('worker_recent_scans', JSON.stringify(updated));
    } catch (err) {
      console.warn('Could not save recent scan:', err);
    }
  };

  const handleScanSuccess = async (data: any) => {
    console.log('🎯 ===== SCAN HANDLER CALLED =====');
    console.log('📥 Data:', data);
    
    try {
      setLoading(true);
      setError(null);

      // Extract tile ID
      let tileId: string;
      
      if (data.tileId) {
        tileId = data.tileId;
      } else if (data.type === 'manual_entry' && data.tileCode) {
        setError('Manual tile code lookup not implemented yet.');
        setLoading(false);
        return;
      } else {
        setError('Invalid QR code format.');
        setLoading(false);
        return;
      }

      console.log('✅ Tile ID:', tileId);

      // Fetch tile data
      console.log('📦 Fetching tile...');
      const tileData = await getTileById(tileId);
      
      if (!tileData) {
        console.error('❌ Tile not found');
        setError('Tile not found.');
        setLoading(false);
        return;
      }

      console.log('✅ Tile:', tileData.name);

      const sellerId = tileData.sellerId || tileData.seller_id;
      const showroomId = tileData.showroomId || tileData.showroom_id;

      console.log('👤 Seller:', sellerId);

      // ═══════════════════════════════════════════════════════════
      // MAIN TRACKING - NO COOLDOWN
      // ═══════════════════════════════════════════════════════════
      
      console.log('📊 Tracking in qr_scans...');
      
      try {
        await trackTileScanEnhanced(tileId, sellerId, currentUser?.user_id);
        console.log('✅ TRACKED IN QR_SCANS!');
        
        // Broadcast event
        const event = new CustomEvent('tile-scanned', { 
          detail: { 
            tileId, 
            sellerId,
            tileName: tileData.name,
            timestamp: new Date().toISOString()
          } 
        });
        window.dispatchEvent(event);
        console.log('✅ EVENT BROADCASTED!');
        
      } catch (trackError: any) {
        console.error('❌ Main tracking failed:', trackError);
      }

      // Legacy tracking - NO COOLDOWN
      try {
        await trackQRScan(tileId, {
          sellerId: sellerId,
          showroomId: showroomId,
          scannedBy: currentUser?.user_id ?? 'anonymous',
          userRole: currentUser?.role ?? 'visitor',
          scanContext: currentUser?.role === 'worker' ? 'worker_showroom_scan' : 'public_scan'
        });
        console.log('✅ Legacy tracked!');
      } catch (e) {
        console.warn('⚠️ Legacy tracking failed');
      }

      // Worker activity
      if (currentUser?.role === 'worker' && currentUser?.user_id) {
        try {
          await trackWorkerActivity(currentUser.user_id, 'scan', { tileId, tileName: tileData.name, sellerId });
          console.log('✅ Worker activity tracked!');
        } catch (e) {
          console.warn('⚠️ Worker tracking failed');
        }
      }

      // Save to recent scans
      saveRecentScan({
        id: tileId,
        tileName: tileData.name,
        tileImage: tileData.imageUrl || tileData.image_url || '/placeholder-tile.png',
        scannedAt: new Date().toISOString(),
        tileId: tileId
      });

      console.log('✅ Saved to recent scans');

      // Show result
      setSuccess(`✅ ${tileData.name} scanned!`);
      setShowScanner(false);
      
      setScannedTileData({
        id: tileId,
        name: tileData.name,
        image: tileData.imageUrl || tileData.image_url,
        code: tileData.tileCode || tileData.tile_code,
        size: tileData.size,
        price: tileData.price,
        stock: tileData.stock,
        inStock: tileData.inStock
      });

      console.log('🎯 ===== SCAN COMPLETED =====');

    } catch (err: any) {
      console.error('❌ Scan error:', err);
      setError('Failed to process scan.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    if (window.confirm('Are you sure you want to logout?')) {
      try {
        if (currentUser?.role === 'worker' && currentUser?.user_id) {
          try {
            await trackWorkerActivity(currentUser.user_id, 'logout', { manual: true });
          } catch (e) {
            console.warn('Could not track logout');
          }
        }
        
        await logout();
        localStorage.removeItem('worker_recent_scans');
        sessionStorage.clear();
        navigate('/');
      } catch (err) {
        console.error('Logout error:', err);
        localStorage.clear();
        sessionStorage.clear();
        window.location.href = '/';
      }
    }
  };

  const openRecentScan = (tileId: string) => {
    navigate(`/tile/${tileId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      {/* Header */}
      <div className="bg-black/30 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
              <QrCode className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-white font-bold text-xl">Tile Scanner</h1>
              <p className="text-blue-200 text-sm">
                Welcome, {currentUser?.full_name || 'Worker'}
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-600/20 text-red-200 rounded-lg hover:bg-red-600/30 transition-colors border border-red-500/30"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        
        {/* Success/Error Messages */}
        {success && (
          <div className="bg-green-500/20 border border-green-500/30 text-green-200 px-6 py-4 rounded-lg backdrop-blur-sm flex items-center gap-3">
            <CheckCircle className="w-6 h-6 flex-shrink-0" />
            <p className="font-medium">{success}</p>
          </div>
        )}

        {error && (
          <div className="bg-red-500/20 border border-red-500/30 text-red-200 px-6 py-4 rounded-lg backdrop-blur-sm flex items-center gap-3">
            <AlertCircle className="w-6 h-6 flex-shrink-0" />
            <p className="font-medium">{error}</p>
          </div>
        )}

        {/* Scan Section */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-8 text-center">
          <div className="mb-6">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Camera className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Scan Tile QR Code</h2>
            <p className="text-blue-200">
              Point your camera at the QR code on the tile
            </p>
          </div>

          <button
            onClick={() => setShowScanner(true)}
            disabled={loading}
            className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 shadow-xl"
          >
            {loading ? (
              <>
                <Loader className="w-6 h-6 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <QrCode className="w-6 h-6" />
                Start Scanning
              </>
            )}
          </button>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <div className="text-blue-400 mb-2">📱 Step 1</div>
              <div className="text-white">Click "Start Scanning"</div>
            </div>
            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <div className="text-blue-400 mb-2">🎯 Step 2</div>
              <div className="text-white">Point at QR code</div>
            </div>
            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <div className="text-blue-400 mb-2">✅ Step 3</div>
              <div className="text-white">Auto-tracked!</div>
            </div>
          </div>
        </div>

        {/* Scan Result Card */}
        {scannedTileData && (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-6">
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle className="w-6 h-6 text-green-400" />
              <h3 className="text-xl font-bold text-white">Scan Successful!</h3>
            </div>

            <div className="bg-white/5 rounded-xl p-4 mb-4">
              <div className="flex items-start gap-4">
                <img
                  src={scannedTileData.image || '/placeholder-tile.png'}
                  alt={scannedTileData.name}
                  className="w-24 h-24 object-cover rounded-lg border-2 border-white/20"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/placeholder-tile.png';
                  }}
                />
                <div className="flex-1">
                  <h4 className="text-xl font-bold text-white mb-2">
                    {scannedTileData.name}
                  </h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-gray-400">Code:</span>
                      <span className="ml-2 text-white font-medium">{scannedTileData.code}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Size:</span>
                      <span className="ml-2 text-white font-medium">{scannedTileData.size}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Price:</span>
                      <span className="ml-2 text-white font-medium">₹{scannedTileData.price}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Stock:</span>
                      <span className={`ml-2 font-medium ${
                        scannedTileData.inStock ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {scannedTileData.inStock ? `${scannedTileData.stock} units` : 'Out of Stock'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => {
                  console.log('🔄 Scan Another clicked');
                  setScannedTileData(null);
                  setShowScanner(true);
                  console.log('✅ Scanner reopened');
                }}
                className="flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-all"
              >
                <QrCode className="w-5 h-5" />
                Scan Another
              </button>
              
              <button
                onClick={() => navigate(`/tile/${scannedTileData.id}`)}
                className="flex items-center justify-center gap-2 bg-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-700 transition-all"
              >
                <Camera className="w-5 h-5" />
                View in 3D
              </button>
            </div>

            <button
              onClick={() => setScannedTileData(null)}
              className="w-full mt-3 text-gray-400 hover:text-white text-sm py-2 transition-colors"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Recent Scans */}
        {recentScans.length > 0 && (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Package className="w-5 h-5 text-blue-400" />
                Recent Scans
              </h3>
              <button
                onClick={() => {
                  setRecentScans([]);
                  localStorage.removeItem('worker_recent_scans');
                }}
                className="text-gray-400 hover:text-white text-sm flex items-center gap-1"
              >
                <RefreshCw className="w-4 h-4" />
                Clear
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recentScans.map((scan) => (
                <div
                  key={scan.id}
                  onClick={() => openRecentScan(scan.tileId)}
                  className="bg-white/5 rounded-lg p-4 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <img
                      src={scan.tileImage}
                      alt={scan.tileName}
                      className="w-12 h-12 object-cover rounded-lg"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/placeholder-tile.png';
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-medium truncate group-hover:text-blue-200">
                        {scan.tileName}
                      </p>
                      <p className="text-gray-400 text-sm">
                        {new Date(scan.scannedAt).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-blue-400 text-sm flex items-center gap-1">
                    <QrCode className="w-3 h-3" />
                    Tap to view again
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <User className="w-5 h-5 text-blue-400" />
            Worker Instructions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div>
              <h4 className="text-blue-400 font-medium mb-2">🔍 Scanning</h4>
              <ul className="text-gray-300 space-y-1">
                <li>• Find QR code on tile</li>
                <li>• Good lighting required</li>
                <li>• Hold steady until detected</li>
                <li>• ✅ Every scan is tracked!</li>
              </ul>
            </div>
            <div>
              <h4 className="text-blue-400 font-medium mb-2">👥 Customer Service</h4>
              <ul className="text-gray-300 space-y-1">
                <li>• Show 3D visualization</li>
                <li>• Help select room types</li>
                <li>• Demonstrate combinations</li>
                <li>• Share links</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* QR Scanner Modal */}
      {showScanner && (
        <QRScanner
          onScanSuccess={handleScanSuccess}
          onClose={() => setShowScanner(false)}
        />
      )}
    </div>
  );
};