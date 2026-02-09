
// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { 
//   QrCode, LogOut, Camera, AlertCircle, CheckCircle, 
//   Loader, X, Eye, UserPlus
// } from 'lucide-react';
// import { QRScanner } from '../components/QRScanner';
// import { useAppStore } from '../stores/appStore';
// import { useAuth } from '../hooks/useAuth';
// import { useWorkerStatus } from '../hooks/useWorkerStatus';
// import { 
//   trackTileScanEnhanced, 
//   getTileById, 
//   trackQRScan, 
//   trackWorkerActivity,
//   verifyWorkerTileAccess,
//   getTileByCode
// } from '../lib/firebaseutils';
// import { 
//   hasActiveSession, 
//   clearCustomerSession, 
//   getCustomerFromSession 
// } from '../utils/customerSession';

// // ═══════════════════════════════════════════════════════════════
// // INTERFACES
// // ═══════════════════════════════════════════════════════════════

// interface RecentScan {
//   id: string;
//   tileName: string;
//   tileImage: string;
//   scannedAt: string;
//   tileId: string;
// }

// // ═══════════════════════════════════════════════════════════════
// // MAIN COMPONENT
// // ═══════════════════════════════════════════════════════════════

// export const ScanPage: React.FC = () => {
//   const navigate = useNavigate();
//   const { currentUser } = useAppStore();
//   const { logout } = useAuth();

//   // ═══════════════════════════════════════════════════════════
//   // STATE MANAGEMENT
//   // ═══════════════════════════════════════════════════════════

//   const [showScanner, setShowScanner] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [success, setSuccess] = useState<string | null>(null);
//   const [recentScans, setRecentScans] = useState<RecentScan[]>([]);
//   const [scannedTileData, setScannedTileData] = useState<any>(null);
//   const [isMobile, setIsMobile] = useState(false);
//   const [activeSessionExists, setActiveSessionExists] = useState(false);

//   useWorkerStatus();

//   // ═══════════════════════════════════════════════════════════
//   // EFFECTS
//   // ═══════════════════════════════════════════════════════════

//   useEffect(() => {
//     const checkMobile = () => {
//       setIsMobile(window.innerWidth < 768);
//     };
    
//     checkMobile();
//     window.addEventListener('resize', checkMobile);
    
//     return () => window.removeEventListener('resize', checkMobile);
//   }, []);

//   useEffect(() => {
//     const checkSession = () => {
//       const hasSession = hasActiveSession();
//       setActiveSessionExists(hasSession);
      
//       if (hasSession) {
//         const session = getCustomerFromSession();
//         console.log('📊 Active session:', session?.name);
//       }
//     };

//     checkSession();
//     const interval = setInterval(checkSession, 10000);

//     return () => clearInterval(interval);
//   }, []);

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

//   // ═══════════════════════════════════════════════════════════
//   // HELPER FUNCTIONS
//   // ═══════════════════════════════════════════════════════════

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

//   const getUserDisplayName = () => {
//     if (currentUser?.full_name) {
//       return isMobile ? currentUser.full_name.split(' ')[0] : currentUser.full_name;
//     }
    
//     if (currentUser?.role === 'seller') return 'Seller';
//     if (currentUser?.role === 'worker') return 'Worker';
//     if (currentUser?.role === 'admin') return 'Admin';
//     return 'User';
//   };

//   // ═══════════════════════════════════════════════════════════
//   // NEW CUSTOMER HANDLER
//   // ═══════════════════════════════════════════════════════════

//   const handleNewCustomer = () => {
//     const session = getCustomerFromSession();
    
//     if (!session) {
//       setError('No active customer session found.');
//       return;
//     }

//     const confirmed = window.confirm(
//       `⚠️ Start New Customer Session?\n\n` +
//       `Current Customer:\n` +
//       `${session.name}\n` +
//       `${session.phone}\n\n` +
//       `This will end the current session.\n` +
//       `Continue?`
//     );

//     if (!confirmed) {
//       console.log('❌ New customer cancelled by user');
//       return;
//     }

//     try {
//       console.log('🔄 Starting new customer session...');
      
//       clearCustomerSession();
//       setActiveSessionExists(false);
//       setScannedTileData(null);
      
//       if (navigator.vibrate) {
//         navigator.vibrate([100, 50, 100]);
//       }
      
//       setSuccess('✅ Ready for new customer! Scan QR code to start.');
//       console.log('✅ New customer session ready');
      
//     } catch (err) {
//       console.error('❌ Failed to clear session:', err);
//       setError('Failed to start new session. Please refresh the page.');
//     }
//   };

//   // ═══════════════════════════════════════════════════════════
//   // SCAN SUCCESS HANDLER - COMPLETE & SECURE
//   // ═══════════════════════════════════════════════════════════

//   const handleScanSuccess = async (data: any) => {
//     console.log('🎯 ===== SCAN HANDLER STARTED =====');
//     console.log('📥 Raw Scan Data:', data);
    
//     try {
//       setLoading(true);
//       setError(null);
//       setSuccess(null);

//       let tileId: string;
//       let tileData: any;

//       // ═══════════════════════════════════════════════════════
//       // MODE 1: QR CODE SCAN
//       // ═══════════════════════════════════════════════════════
//       if (data.tileId) {
//         tileId = data.tileId.trim();
//         console.log('✅ QR Scan Mode | Tile ID:', tileId);

//         // 🔒 SECURITY: Worker QR verification
//         if (currentUser?.role === 'worker' && currentUser?.user_id) {
//           console.log('🔒 Worker role detected - verifying QR access...');
          
//           const verification = await verifyWorkerTileAccess(tileId, currentUser.user_id);
          
//           if (!verification.allowed) {
//             console.error('🚫 QR ACCESS DENIED:', verification.error);
            
//             setShowScanner(false);
//             setLoading(false);
            
//             if (navigator.vibrate) {
//               navigator.vibrate([200, 100, 200, 100, 200]);
//             }
            
//             setTimeout(() => {
//               setError(verification.error || 'Unauthorized tile access');
//             }, 100);
            
//             setTimeout(() => setError(null), 10000);
//             return;
//           }
          
//           console.log('✅ Worker authorized for QR scan');
//         }

//         console.log('📦 Fetching tile by ID...');
//         tileData = await getTileById(tileId);
        
//         // ✅ FALLBACK: Try as tile code
//         if (!tileData) {
//           console.warn('⚠️ getTileById failed, trying getTileByCode...');
          
//           const fallbackResult = await getTileByCode(tileId);
          
//           if (fallbackResult) {
//             if (typeof fallbackResult === 'object' && 'success' in fallbackResult) {
//               if (fallbackResult.success && fallbackResult.tile) {
//                 tileData = fallbackResult.tile;
//                 tileId = tileData.id;
//                 console.log('✅ Found via tile_code fallback (structured response)');
//               }
//             } else {
//               tileData = fallbackResult;
//               tileId = tileData.id;
//               console.log('✅ Found via tile_code fallback (direct response)');
//             }
//           }
//         }
        
//         if (!tileData) {
//           console.error('❌ Tile not found | ID:', tileId);
//           console.error('❌ User Role:', currentUser?.role);
//           console.error('❌ User ID:', currentUser?.user_id);
          
//           setShowScanner(false);
//           setLoading(false);
//           setTimeout(() => {
//             setError(
//               `Tile Not Found (ID: ${tileId})\n\n` +
//               `This QR code may be:\n` +
//               `• Outdated or invalid\n` +
//               `• Not assigned to your showroom\n` +
//               `• Removed from system\n\n` +
//               `Please try:\n` +
//               `• Scanning again with better lighting\n` +
//               `• Using manual tile code entry\n` +
//               `• Contact admin if issue persists`
//             );
//           }, 100);
//           return;
//         }

//         console.log('✅ Tile loaded via QR:', tileData.name);
//       }
//       // ═══════════════════════════════════════════════════════
//       // MODE 2: MANUAL ENTRY
//       // ═══════════════════════════════════════════════════════
//       else if (data.type === 'manual_entry' && data.tileCode) {
//         console.log('✅ Manual Entry Mode | Code:', data.tileCode);

//         const searchResult = await getTileByCode(data.tileCode);

//         let foundTile = null;
//         let searchError = null;

//         if (searchResult) {
//           if (typeof searchResult === 'object' && 'success' in searchResult) {
//             if (searchResult.success && searchResult.tile) {
//               foundTile = searchResult.tile;
//             } else {
//               searchError = searchResult.error || 'Tile not found';
//             }
//           } else {
//             foundTile = searchResult;
//           }
//         } else {
//           searchError = 'Tile not found';
//         }

//         if (!foundTile) {
//           console.error('❌ Manual search failed | Code:', data.tileCode);
          
//           setShowScanner(false);
//           setLoading(false);
          
//           if (navigator.vibrate) {
//             navigator.vibrate([200, 100, 200]);
//           }
          
//           setTimeout(() => {
//             setError(
//               searchError || 
//               `Tile Code "${data.tileCode}" Not Found\n\n` +
//               `Please verify:\n` +
//               `• Spelling is correct\n` +
//               `• Code format matches system\n` +
//               `• Tile is assigned to your showroom (workers)\n\n` +
//               `Tip: Try scanning QR code instead`
//             );
//           }, 100);
          
//           setTimeout(() => setError(null), 8000);
//           return;
//         }

//         tileData = foundTile;
//         tileId = tileData.id;

//         // 🔒 CRITICAL: Worker verification for manual entry
//         if (currentUser?.role === 'worker' && currentUser?.user_id) {
//           console.log('🔒 Worker role detected - verifying manual entry access...');
          
//           const verification = await verifyWorkerTileAccess(tileId, currentUser.user_id);
          
//           if (!verification.allowed) {
//             console.error('🚫 MANUAL ENTRY ACCESS DENIED:', verification.error);
            
//             setShowScanner(false);
//             setLoading(false);
            
//             if (navigator.vibrate) {
//               navigator.vibrate([200, 100, 200, 100, 200]);
//             }
            
//             setTimeout(() => {
//               setError(
//                 verification.error || 
//                 `Access Denied\n\n` +
//                 `"${tileData.name}" is not assigned to you.\n\n` +
//                 `Workers can only access tiles from their assigned showroom.\n\n` +
//                 `Contact your showroom admin for access.`
//               );
//             }, 100);
            
//             setTimeout(() => setError(null), 10000);
//             return;
//           }
          
//           console.log('✅ Worker authorized for manual entry');
//         }

//         console.log('✅ Tile found via manual entry:', tileData.name);
//       }
//       // ═══════════════════════════════════════════════════════
//       // INVALID DATA
//       // ═══════════════════════════════════════════════════════
//       else {
//         console.error('❌ Invalid scan data format:', data);
//         setError('Invalid scan data. Please try again.');
//         setLoading(false);
//         return;
//       }

//       // ═══════════════════════════════════════════════════════
//       // SUCCESS PATH - Common for both modes
//       // ═══════════════════════════════════════════════════════

//       const sellerId = tileData.sellerId || tileData.seller_id;

//       if (navigator.vibrate) {
//         navigator.vibrate(200);
//       }

//       saveRecentScan({
//         id: tileId,
//         tileName: tileData.name,
//         tileImage: tileData.imageUrl || tileData.image_url || '/placeholder-tile.png',
//         scannedAt: new Date().toISOString(),
//         tileId: tileId
//       });

//       setSuccess(`✅ ${tileData.name} scanned successfully!`);
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

//       setLoading(false);

//       // Background Analytics (non-blocking)
//       Promise.all([
//         trackTileScanEnhanced(tileId, sellerId, currentUser?.user_id).catch(err => {
//           console.warn('⚠️ Main tracking failed:', err);
//         }),
        
//         trackQRScan(tileId, {
//           sellerId: sellerId,
//           showroomId: tileData.showroomId,
//           scannedBy: currentUser?.user_id ?? 'anonymous',
//           userRole: currentUser?.role ?? 'visitor',
//           scanContext: currentUser?.role === 'worker' ? 'worker_showroom_scan' : 'public_scan'
//         }).catch(err => {
//           console.warn('⚠️ Legacy tracking failed:', err);
//         }),
        
//         currentUser?.role === 'worker' && currentUser?.user_id
//           ? trackWorkerActivity(currentUser.user_id, 'scan', { 
//               tileId, 
//               tileName: tileData.name, 
//               sellerId,
//               authorized: true,
//               scanMethod: data.type === 'manual_entry' ? 'manual' : 'qr'
//             }).catch(err => {
//               console.warn('⚠️ Worker tracking failed:', err);
//             })
//           : Promise.resolve()
//       ]).then(() => {
//         console.log('✅ Background tracking completed');
        
//         const event = new CustomEvent('tile-scanned', { 
//           detail: { 
//             tileId, 
//             sellerId,
//             tileName: tileData.name,
//             timestamp: new Date().toISOString(),
//             scannedBy: currentUser?.role,
//             method: data.type === 'manual_entry' ? 'manual' : 'qr'
//           } 
//         });
//         window.dispatchEvent(event);
//       });

//       console.log('🎉 ===== SCAN COMPLETED SUCCESSFULLY =====');

//     } catch (err: any) {
//       console.error('❌ Scan error:', err);
//       setShowScanner(false);
//       setLoading(false);
//       setTimeout(() => {
//         setError('Failed to process scan. Please try again.');
//       }, 100);
//     }
//   };

//   // ═══════════════════════════════════════════════════════════
//   // LOGOUT HANDLER
//   // ═══════════════════════════════════════════════════════════

//   const handleLogout = async () => {
//     const confirmMessage = isMobile 
//       ? 'Logout?' 
//       : 'Are you sure you want to logout?';
      
//     if (window.confirm(confirmMessage)) {
//       try {
//         if (currentUser?.role === 'worker' && currentUser?.user_id) {
//           try {
//             await trackWorkerActivity(currentUser.user_id, 'logout', { manual: true });
//           } catch (e) {
//             console.warn('Could not track logout');
//           }
//         }
        
//         clearCustomerSession();
//         await logout();
//         localStorage.removeItem('worker_recent_scans');
//         sessionStorage.clear();
//         navigate('/');
//       } catch (err) {
//         console.error('Logout error:', err);
//         localStorage.clear();
//         sessionStorage.clear();
//         window.location.href = '/';
//       }
//     }
//   };

//   // ═══════════════════════════════════════════════════════════
//   // RENDER
//   // ═══════════════════════════════════════════════════════════

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
//       {/* ═══════════════════════════════════════════════════════
//           HEADER
//           ═══════════════════════════════════════════════════════ */}
//       <header className="bg-black/30 backdrop-blur-sm border-b border-white/10 sticky top-0 z-10">
//         <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-3 sm:py-4">
          
//           {/* Desktop Header */}
//           <div className="hidden md:flex items-center justify-between gap-4">
//             {/* Left: Branding */}
//             <div className="flex items-center gap-3 min-w-0 flex-1">
//               <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
//                 <QrCode className="w-6 h-6 text-white" />
//               </div>
//               <div className="min-w-0 flex-1">
//                 <h1 className="text-white font-bold text-xl truncate">Tile Scanner</h1>
//                 <p className="text-blue-200 text-sm truncate">
//                   Welcome, {getUserDisplayName()}
//                 </p>
//               </div>
//             </div>

//             {/* Right: Buttons */}
//             <div className="flex items-center gap-3 flex-shrink-0">
//               {/* New Customer Button */}
//               <button
//                 onClick={handleNewCustomer}
//                 disabled={!activeSessionExists}
//                 className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all border ${
//                   activeSessionExists
//                     ? 'bg-blue-600/20 text-blue-200 border-blue-500/30 hover:bg-blue-600/30 hover:scale-105 cursor-pointer'
//                     : 'bg-gray-600/20 text-gray-400 border-gray-500/20 cursor-not-allowed opacity-50'
//                 }`}
//                 title={activeSessionExists ? 'Start new customer session' : 'No active customer session'}
//               >
//                 <UserPlus className="w-4 h-4" />
//                 <span>New Customer</span>
//               </button>

//               {/* Logout Button */}
//               <button
//                 onClick={handleLogout}
//                 className="flex items-center gap-2 px-4 py-2 bg-red-600/20 text-red-200 rounded-lg hover:bg-red-600/30 active:bg-red-600/40 transition-all border border-red-500/30 text-sm font-medium"
//               >
//                 <LogOut className="w-4 h-4" />
//                 <span>Logout</span>
//               </button>
//             </div>
//           </div>

//           {/* Mobile Header */}
//           <div className="md:hidden">
//             {/* Top Row: Branding */}
//             <div className="flex items-center gap-2 mb-3">
//               <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
//                 <QrCode className="w-4 h-4 text-white" />
//               </div>
//               <div className="min-w-0 flex-1">
//                 <h1 className="text-white font-bold text-base truncate">Tile Scanner</h1>
//                 <p className="text-blue-200 text-xs truncate">
//                   {getUserDisplayName()}
//                 </p>
//               </div>
//             </div>

//             {/* Bottom Row: Buttons */}
//             <div className="grid grid-cols-2 gap-2">
//               {/* New Customer Button */}
//               <button
//                 onClick={handleNewCustomer}
//                 disabled={!activeSessionExists}
//                 className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg font-medium text-xs transition-all border touch-manipulation ${
//                   activeSessionExists
//                     ? 'bg-blue-600/20 text-blue-200 border-blue-500/30 active:bg-blue-600/30 active:scale-95'
//                     : 'bg-gray-600/20 text-gray-400 border-gray-500/20 cursor-not-allowed opacity-50'
//                 }`}
//               >
//                 <UserPlus className="w-3.5 h-3.5" />
//                 <span>New Customer</span>
//               </button>

//               {/* Logout Button */}
//               <button
//                 onClick={handleLogout}
//                 className="flex items-center justify-center gap-1.5 px-3 py-2 bg-red-600/20 text-red-200 rounded-lg border border-red-500/30 text-xs font-medium active:bg-red-600/40 transition-all touch-manipulation active:scale-95"
//               >
//                 <LogOut className="w-3.5 h-3.5" />
//                 <span>Logout</span>
//               </button>
//             </div>
//           </div>

//           {/* Active Session Badge */}
//           {activeSessionExists && (() => {
//             const session = getCustomerFromSession();
//             return session ? (
//               <div className="mt-3 bg-green-600/20 border border-green-500/30 rounded-lg px-3 py-2 flex items-center justify-between gap-2 backdrop-blur-sm">
//                 <div className="flex items-center gap-2 min-w-0 flex-1">
//                   <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse flex-shrink-0"></div>
//                   <div className="min-w-0 flex-1">
//                     <p className="text-green-200 text-xs font-medium">Active Customer:</p>
//                     <p className="text-white text-sm font-semibold truncate">
//                       {session.name} • {session.phone}
//                     </p>
//                   </div>
//                 </div>
//                 <button
//                   onClick={handleNewCustomer}
//                   className="px-2 py-1 bg-green-600/30 hover:bg-green-600/40 rounded text-green-200 text-xs font-medium transition-colors flex-shrink-0 touch-manipulation"
//                 >
//                   Change
//                 </button>
//               </div>
//             ) : null;
//           })()}
//         </div>
//       </header>

//       {/* ═══════════════════════════════════════════════════════
//           MAIN CONTENT
//           ═══════════════════════════════════════════════════════ */}
//       <main className="max-w-4xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8 space-y-4 sm:space-y-6 lg:space-y-8">
        
//         {/* Success Message */}
//         {success && (
//           <div className="fixed top-16 sm:top-20 left-1/2 transform -translate-x-1/2 z-50 max-w-md w-full mx-4 animate-slide-down">
//             <div className="bg-green-500/20 border border-green-500/30 text-green-200 px-4 sm:px-6 py-3 sm:py-4 rounded-lg backdrop-blur-sm flex items-center gap-2 sm:gap-3 shadow-2xl">
//               <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" />
//               <p className="font-medium text-sm sm:text-base flex-1 whitespace-pre-line">{success}</p>
//               <button 
//                 onClick={() => setSuccess(null)} 
//                 className="ml-auto touch-manipulation p-1"
//                 aria-label="Close message"
//               >
//                 <X className="w-4 h-4 sm:w-5 sm:h-5" />
//               </button>
//             </div>
//           </div>
//         )}

//         {/* Error Message */}
//         {error && (
//           <div className="fixed top-16 sm:top-20 left-1/2 transform -translate-x-1/2 z-50 max-w-md w-full mx-4 animate-slide-down">
//             <div className="bg-red-500/20 border border-red-500/30 text-red-200 px-4 sm:px-6 py-3 sm:py-4 rounded-lg backdrop-blur-sm flex items-start gap-2 sm:gap-3 shadow-2xl">
//               <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0 mt-0.5" />
//               <p className="font-medium text-sm sm:text-base flex-1 whitespace-pre-line break-words">{error}</p>
//               <button 
//                 onClick={() => setError(null)} 
//                 className="ml-auto touch-manipulation p-1 flex-shrink-0"
//                 aria-label="Close message"
//               >
//                 <X className="w-4 h-4 sm:w-5 sm:h-5" />
//               </button>
//             </div>
//           </div>
//         )}

//         {/* Scan Section */}
//         <section className="bg-white/10 backdrop-blur-md rounded-xl sm:rounded-2xl border border-white/20 p-4 sm:p-6 lg:p-8 text-center">
//           <div className="mb-4 sm:mb-6">
//             <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 transform hover:scale-110 transition-transform">
//               <Camera className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
//             </div>
//             <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">Scan Tile QR Code</h2>
//             <p className="text-blue-200 text-sm sm:text-base px-4">
//               Point your camera at the QR code on the tile
//             </p>
//           </div>

//           <button
//             onClick={() => setShowScanner(true)}
//             disabled={loading}
//             className="inline-flex items-center gap-2 sm:gap-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg sm:rounded-xl font-semibold text-base sm:text-lg hover:from-blue-700 hover:to-purple-700 active:from-blue-800 active:to-purple-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 active:scale-95 shadow-xl touch-manipulation"
//           >
//             {loading ? (
//               <>
//                 <Loader className="w-5 h-5 sm:w-6 sm:h-6 animate-spin" />
//                 <span>Processing...</span>
//               </>
//             ) : (
//               <>
//                 <QrCode className="w-5 h-5 sm:w-6 sm:h-6" />
//                 <span>Start Scanning</span>
//               </>
//             )}
//           </button>

//           <div className="mt-4 sm:mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 text-xs sm:text-sm">
//             <div className="bg-white/5 rounded-lg p-3 sm:p-4 border border-white/10 hover:bg-white/10 transition-colors">
//               <div className="text-blue-400 mb-1 sm:mb-2 font-semibold">📱 Step 1</div>
//               <div className="text-white">Click "Start Scanning"</div>
//             </div>
//             <div className="bg-white/5 rounded-lg p-3 sm:p-4 border border-white/10 hover:bg-white/10 transition-colors">
//               <div className="text-blue-400 mb-1 sm:mb-2 font-semibold">🎯 Step 2</div>
//               <div className="text-white">Point at QR code</div>
//             </div>
//             <div className="bg-white/5 rounded-lg p-3 sm:p-4 border border-white/10 hover:bg-white/10 transition-colors">
//               <div className="text-blue-400 mb-1 sm:mb-2 font-semibold">✅ Step 3</div>
//               <div className="text-white">Auto-tracked!</div>
//             </div>
//           </div>
//         </section>

//         {/* Scan Result Card */}
//         {scannedTileData && (
//           <section className="bg-white/10 backdrop-blur-md rounded-xl sm:rounded-2xl border border-white/20 p-4 sm:p-6 animate-slide-down">
//             <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
//               <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-400 flex-shrink-0" />
//               <h3 className="text-lg sm:text-xl font-bold text-white">Scan Successful!</h3>
//             </div>

//             <div className="bg-white/5 rounded-lg sm:rounded-xl p-3 sm:p-4 mb-3 sm:mb-4">
//               <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
//                 <img
//                   src={scannedTileData.image || '/placeholder-tile.png'}
//                   alt={scannedTileData.name}
//                   className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-lg border-2 border-white/20 flex-shrink-0"
//                   loading="lazy"
//                   onError={(e) => {
//                     (e.target as HTMLImageElement).src = '/placeholder-tile.png';
//                   }}
//                 />
//                 <div className="flex-1 min-w-0 w-full">
//                   <h4 className="text-base sm:text-xl font-bold text-white mb-2 sm:mb-3 break-words">
//                     {scannedTileData.name}
//                   </h4>
//                   <div className="grid grid-cols-2 gap-2 text-xs sm:text-sm">
//                     <div>
//                       <span className="text-gray-400 block">Code:</span>
//                       <span className="text-white font-medium truncate block">{scannedTileData.code}</span>
//                     </div>
//                     <div>
//                       <span className="text-gray-400 block">Size:</span>
//                       <span className="text-white font-medium truncate block">{scannedTileData.size}</span>
//                     </div>
//                     <div>
//                       <span className="text-gray-400 block">Price:</span>
//                       <span className="text-white font-medium truncate block">₹{scannedTileData.price}</span>
//                     </div>
//                     <div>
//                       <span className="text-gray-400 block">Stock:</span>
//                       <span className={`font-medium truncate block ${
//                         scannedTileData.inStock ? 'text-green-400' : 'text-red-400'
//                       }`}>
//                         {scannedTileData.inStock ? `${scannedTileData.stock} units` : 'Out of Stock'}
//                       </span>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
//               <button
//                 onClick={() => {
//                   setScannedTileData(null);
//                   setShowScanner(true);
//                 }}
//                 className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-semibold hover:bg-blue-700 active:bg-blue-800 transition-all text-sm sm:text-base touch-manipulation"
//               >
//                 <QrCode className="w-4 h-4 sm:w-5 sm:h-5" />
//                 Scan Another
//               </button>
              
//               <button
//                 onClick={() => navigate(`/room-select/${scannedTileData.id}`)}
//                 className="flex items-center justify-center gap-2 bg-green-600 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-semibold hover:bg-green-700 active:bg-green-800 transition-all text-sm sm:text-base touch-manipulation"
//               >
//                 <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
//                 View in 3D
//               </button>
//             </div>

//             <button
//               onClick={() => setScannedTileData(null)}
//               className="w-full mt-2 sm:mt-3 text-gray-400 hover:text-white text-xs sm:text-sm py-2 transition-colors touch-manipulation"
//             >
//               Dismiss
//             </button>
//           </section>
//         )}

//         {/* Instructions */}
//         <section className="bg-white/5 backdrop-blur-sm rounded-lg sm:rounded-xl border border-white/10 p-4 sm:p-6">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 text-xs sm:text-sm">
//             <div className="bg-white/5 rounded-lg p-3 sm:p-4 border border-white/10">
//               <h4 className="text-blue-400 font-medium mb-2 text-sm sm:text-base">🔍 Scanning</h4>
//               <ul className="text-gray-300 space-y-1">
//                 <li>• Find QR code on tile</li>
//                 <li>• Good lighting required</li>
//                 <li>• Hold steady until detected</li>
//                 <li>• ✅ Every scan is tracked!</li>
//               </ul>
//             </div>
//             <div className="bg-white/5 rounded-lg p-3 sm:p-4 border border-white/10">
//               <h4 className="text-blue-400 font-medium mb-2 text-sm sm:text-base">👥 Customer Service</h4>
//               <ul className="text-gray-300 space-y-1">
//                 <li>• Show 3D visualization</li>
//                 <li>• Help select room types</li>
//                 <li>• Demonstrate combinations</li>
//                 <li>• ✅ Use "New Customer" for next client</li>
//               </ul>
//             </div>
//           </div>
//         </section>

//         {/* Mobile Tip */}
//         {isMobile && (
//           <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-lg p-3 border border-blue-500/30 text-center">
//             <p className="text-blue-200 text-xs">
//               💡 Rotate your device for better scanning experience
//             </p>
//           </div>
//         )}
//       </main>

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
  Loader, X, Eye, UserPlus, Scan, Zap, Smartphone,
  CheckCircle2, Info
} from 'lucide-react';
import { QRScanner } from '../components/QRScanner';
import { useAppStore } from '../stores/appStore';
import { useAuth } from '../hooks/useAuth';
import { useWorkerStatus } from '../hooks/useWorkerStatus';
import { 
  trackTileScanEnhanced, 
  getTileById, 
  trackQRScan, 
  trackWorkerActivity,
  verifyWorkerTileAccess,
  getTileByCode
} from '../lib/firebaseutils';
import { 
  hasActiveSession, 
  clearCustomerSession, 
  getCustomerFromSession 
} from '../utils/customerSession';

// ═══════════════════════════════════════════════════════════════
// INTERFACES
// ═══════════════════════════════════════════════════════════════

interface RecentScan {
  id: string;
  tileName: string;
  tileImage: string;
  scannedAt: string;
  tileId: string;
}

// ═══════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════

export const ScanPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser } = useAppStore();
  const { logout } = useAuth();

  // ═══════════════════════════════════════════════════════════
  // STATE MANAGEMENT
  // ═══════════════════════════════════════════════════════════

  const [showScanner, setShowScanner] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [recentScans, setRecentScans] = useState<RecentScan[]>([]);
  const [scannedTileData, setScannedTileData] = useState<any>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [activeSessionExists, setActiveSessionExists] = useState(false);

  useWorkerStatus();

  // ═══════════════════════════════════════════════════════════
  // EFFECTS
  // ═══════════════════════════════════════════════════════════

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const checkSession = () => {
      const hasSession = hasActiveSession();
      setActiveSessionExists(hasSession);
      
      if (hasSession) {
        const session = getCustomerFromSession();
        console.log('📊 Active session:', session?.name);
      }
    };

    checkSession();
    const interval = setInterval(checkSession, 10000);

    return () => clearInterval(interval);
  }, []);

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

  // ═══════════════════════════════════════════════════════════
  // HELPER FUNCTIONS
  // ═══════════════════════════════════════════════════════════

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

  const getUserDisplayName = () => {
    if (currentUser?.full_name) {
      return isMobile ? currentUser.full_name.split(' ')[0] : currentUser.full_name;
    }
    
    if (currentUser?.role === 'seller') return 'Seller';
    if (currentUser?.role === 'worker') return 'Worker';
    if (currentUser?.role === 'admin') return 'Admin';
    return 'User';
  };

  // ═══════════════════════════════════════════════════════════
  // NEW CUSTOMER HANDLER
  // ═══════════════════════════════════════════════════════════

  const handleNewCustomer = () => {
    const session = getCustomerFromSession();
    
    if (!session) {
      setError('No active customer session found.');
      return;
    }

    const confirmed = window.confirm(
      `⚠️ Start New Customer Session?\n\n` +
      `Current Customer:\n` +
      `${session.name}\n` +
      `${session.phone}\n\n` +
      `This will end the current session.\n` +
      `Continue?`
    );

    if (!confirmed) {
      console.log('❌ New customer cancelled by user');
      return;
    }

    try {
      console.log('🔄 Starting new customer session...');
      
      clearCustomerSession();
      setActiveSessionExists(false);
      setScannedTileData(null);
      
      if (navigator.vibrate) {
        navigator.vibrate([100, 50, 100]);
      }
      
      setSuccess('✅ Ready for new customer! Scan QR code to start.');
      console.log('✅ New customer session ready');
      
    } catch (err) {
      console.error('❌ Failed to clear session:', err);
      setError('Failed to start new session. Please refresh the page.');
    }
  };

  // ═══════════════════════════════════════════════════════════
  // SCAN SUCCESS HANDLER - COMPLETE & SECURE
  // ═══════════════════════════════════════════════════════════

  const handleScanSuccess = async (data: any) => {
    console.log('🎯 ===== SCAN HANDLER STARTED =====');
    console.log('📥 Raw Scan Data:', data);
    
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      let tileId: string;
      let tileData: any;

      // ═══════════════════════════════════════════════════════
      // MODE 1: QR CODE SCAN
      // ═══════════════════════════════════════════════════════
      if (data.tileId) {
        tileId = data.tileId.trim();
        console.log('✅ QR Scan Mode | Tile ID:', tileId);

        // 🔒 SECURITY: Worker QR verification
        if (currentUser?.role === 'worker' && currentUser?.user_id) {
          console.log('🔒 Worker role detected - verifying QR access...');
          
          const verification = await verifyWorkerTileAccess(tileId, currentUser.user_id);
          
          if (!verification.allowed) {
            console.error('🚫 QR ACCESS DENIED:', verification.error);
            
            setShowScanner(false);
            setLoading(false);
            
            if (navigator.vibrate) {
              navigator.vibrate([200, 100, 200, 100, 200]);
            }
            
            setTimeout(() => {
              setError(verification.error || 'Unauthorized tile access');
            }, 100);
            
            setTimeout(() => setError(null), 10000);
            return;
          }
          
          console.log('✅ Worker authorized for QR scan');
        }

        console.log('📦 Fetching tile by ID...');
        tileData = await getTileById(tileId);
        
        // ✅ FALLBACK: Try as tile code
        if (!tileData) {
          console.warn('⚠️ getTileById failed, trying getTileByCode...');
          
          const fallbackResult = await getTileByCode(tileId);
          
          if (fallbackResult) {
            if (typeof fallbackResult === 'object' && 'success' in fallbackResult) {
              if (fallbackResult.success && fallbackResult.tile) {
                tileData = fallbackResult.tile;
                tileId = tileData.id;
                console.log('✅ Found via tile_code fallback (structured response)');
              }
            } else {
              tileData = fallbackResult;
              tileId = tileData.id;
              console.log('✅ Found via tile_code fallback (direct response)');
            }
          }
        }
        
        if (!tileData) {
          console.error('❌ Tile not found | ID:', tileId);
          console.error('❌ User Role:', currentUser?.role);
          console.error('❌ User ID:', currentUser?.user_id);
          
          setShowScanner(false);
          setLoading(false);
          setTimeout(() => {
            setError(
              `Tile Not Found (ID: ${tileId})\n\n` +
              `This QR code may be:\n` +
              `• Outdated or invalid\n` +
              `• Not assigned to your showroom\n` +
              `• Removed from system\n\n` +
              `Please try:\n` +
              `• Scanning again with better lighting\n` +
              `• Using manual tile code entry\n` +
              `• Contact admin if issue persists`
            );
          }, 100);
          return;
        }

        console.log('✅ Tile loaded via QR:', tileData.name);
      }
      // ═══════════════════════════════════════════════════════
      // MODE 2: MANUAL ENTRY
      // ═══════════════════════════════════════════════════════
      else if (data.type === 'manual_entry' && data.tileCode) {
        console.log('✅ Manual Entry Mode | Code:', data.tileCode);

        const searchResult = await getTileByCode(data.tileCode);

        let foundTile = null;
        let searchError = null;

        if (searchResult) {
          if (typeof searchResult === 'object' && 'success' in searchResult) {
            if (searchResult.success && searchResult.tile) {
              foundTile = searchResult.tile;
            } else {
              searchError = searchResult.error || 'Tile not found';
            }
          } else {
            foundTile = searchResult;
          }
        } else {
          searchError = 'Tile not found';
        }

        if (!foundTile) {
          console.error('❌ Manual search failed | Code:', data.tileCode);
          
          setShowScanner(false);
          setLoading(false);
          
          if (navigator.vibrate) {
            navigator.vibrate([200, 100, 200]);
          }
          
          setTimeout(() => {
            setError(
              searchError || 
              `Tile Code "${data.tileCode}" Not Found\n\n` +
              `Please verify:\n` +
              `• Spelling is correct\n` +
              `• Code format matches system\n` +
              `• Tile is assigned to your showroom (workers)\n\n` +
              `Tip: Try scanning QR code instead`
            );
          }, 100);
          
          setTimeout(() => setError(null), 8000);
          return;
        }

        tileData = foundTile;
        tileId = tileData.id;

        // 🔒 CRITICAL: Worker verification for manual entry
        if (currentUser?.role === 'worker' && currentUser?.user_id) {
          console.log('🔒 Worker role detected - verifying manual entry access...');
          
          const verification = await verifyWorkerTileAccess(tileId, currentUser.user_id);
          
          if (!verification.allowed) {
            console.error('🚫 MANUAL ENTRY ACCESS DENIED:', verification.error);
            
            setShowScanner(false);
            setLoading(false);
            
            if (navigator.vibrate) {
              navigator.vibrate([200, 100, 200, 100, 200]);
            }
            
            setTimeout(() => {
              setError(
                verification.error || 
                `Access Denied\n\n` +
                `"${tileData.name}" is not assigned to you.\n\n` +
                `Workers can only access tiles from their assigned showroom.\n\n` +
                `Contact your showroom admin for access.`
              );
            }, 100);
            
            setTimeout(() => setError(null), 10000);
            return;
          }
          
          console.log('✅ Worker authorized for manual entry');
        }

        console.log('✅ Tile found via manual entry:', tileData.name);
      }
      // ═══════════════════════════════════════════════════════
      // INVALID DATA
      // ═══════════════════════════════════════════════════════
      else {
        console.error('❌ Invalid scan data format:', data);
        setError('Invalid scan data. Please try again.');
        setLoading(false);
        return;
      }

      // ═══════════════════════════════════════════════════════
      // SUCCESS PATH - Common for both modes
      // ═══════════════════════════════════════════════════════

      const sellerId = tileData.sellerId || tileData.seller_id;

      if (navigator.vibrate) {
        navigator.vibrate(200);
      }

      saveRecentScan({
        id: tileId,
        tileName: tileData.name,
        tileImage: tileData.imageUrl || tileData.image_url || '/placeholder-tile.png',
        scannedAt: new Date().toISOString(),
        tileId: tileId
      });

      setSuccess(`✅ ${tileData.name} scanned successfully!`);
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

      setLoading(false);

      // Background Analytics (non-blocking)
      Promise.all([
        trackTileScanEnhanced(tileId, sellerId, currentUser?.user_id).catch(err => {
          console.warn('⚠️ Main tracking failed:', err);
        }),
        
        trackQRScan(tileId, {
          sellerId: sellerId,
          showroomId: tileData.showroomId,
          scannedBy: currentUser?.user_id ?? 'anonymous',
          userRole: currentUser?.role ?? 'visitor',
          scanContext: currentUser?.role === 'worker' ? 'worker_showroom_scan' : 'public_scan'
        }).catch(err => {
          console.warn('⚠️ Legacy tracking failed:', err);
        }),
        
        currentUser?.role === 'worker' && currentUser?.user_id
          ? trackWorkerActivity(currentUser.user_id, 'scan', { 
              tileId, 
              tileName: tileData.name, 
              sellerId,
              authorized: true,
              scanMethod: data.type === 'manual_entry' ? 'manual' : 'qr'
            }).catch(err => {
              console.warn('⚠️ Worker tracking failed:', err);
            })
          : Promise.resolve()
      ]).then(() => {
        console.log('✅ Background tracking completed');
        
        const event = new CustomEvent('tile-scanned', { 
          detail: { 
            tileId, 
            sellerId,
            tileName: tileData.name,
            timestamp: new Date().toISOString(),
            scannedBy: currentUser?.role,
            method: data.type === 'manual_entry' ? 'manual' : 'qr'
          } 
        });
        window.dispatchEvent(event);
      });

      console.log('🎉 ===== SCAN COMPLETED SUCCESSFULLY =====');

    } catch (err: any) {
      console.error('❌ Scan error:', err);
      setShowScanner(false);
      setLoading(false);
      setTimeout(() => {
        setError('Failed to process scan. Please try again.');
      }, 100);
    }
  };

  // ═══════════════════════════════════════════════════════════
  // LOGOUT HANDLER
  // ═══════════════════════════════════════════════════════════

  const handleLogout = async () => {
    const confirmMessage = isMobile 
      ? 'Logout?' 
      : 'Are you sure you want to logout?';
      
    if (window.confirm(confirmMessage)) {
      try {
        if (currentUser?.role === 'worker' && currentUser?.user_id) {
          try {
            await trackWorkerActivity(currentUser.user_id, 'logout', { manual: true });
          } catch (e) {
            console.warn('Could not track logout');
          }
        }
        
        clearCustomerSession();
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

  // ═══════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════

  return (
    <div className="min-h-screen w-full bg-black text-white font-sans selection:bg-blue-500/30 relative overflow-hidden flex flex-col">
      
      {/* Ambient Background Effects */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-600/20 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-cyan-600/10 blur-[150px] rounded-full pointer-events-none" />

      {/* ═══════════════════════════════════════════════════════
          HEADER - Minimal HUD Style
          ═══════════════════════════════════════════════════════ */}
      <header className="w-full p-6 md:p-8 flex items-start justify-between z-50 relative">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center backdrop-blur-md">
            <Scan className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-lg tracking-wide">Tile Scanner</h1>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <p className="text-xs text-white/40 font-medium uppercase tracking-widest">
                {getUserDisplayName()}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleNewCustomer}
            disabled={!activeSessionExists}
            className={`rounded-full px-4 py-2 text-sm font-medium flex items-center gap-2 backdrop-blur-md transition-all ${
              activeSessionExists
                ? 'bg-white/5 border border-white/10 hover:bg-white/10 text-white cursor-pointer'
                : 'bg-gray-600/20 text-gray-500 border border-gray-500/20 cursor-not-allowed opacity-50'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            <span className="hidden md:inline">New Customer</span>
          </button>
          
          <button
            onClick={handleLogout}
            className="rounded-full p-2 text-white/50 hover:text-white hover:bg-white/5 transition-colors"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Active Session Badge */}
      {activeSessionExists && (() => {
        const session = getCustomerFromSession();
        return session ? (
          <div className="mx-6 md:mx-8 mb-4 p-1 pr-4 bg-emerald-500/10 border border-emerald-500/30 backdrop-blur-md rounded-full flex items-center gap-3 relative z-50">
            <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] text-emerald-200/60 uppercase tracking-widest font-bold">Active Customer</p>
              <p className="text-white text-sm font-semibold truncate">
                {session.name} • {session.phone}
              </p>
            </div>
            <button
              onClick={handleNewCustomer}
              className="px-3 py-1.5 bg-emerald-600/30 hover:bg-emerald-600/40 rounded-full text-emerald-200 text-xs font-medium transition-colors"
            >
              Change
            </button>
          </div>
        ) : null;
      })()}

      {/* Success Message */}
      {success && (
        <div className="fixed top-24 left-1/2 transform -translate-x-1/2 z-[100] max-w-md w-full mx-4 animate-slide-down">
          <div className="bg-emerald-500/20 border border-emerald-500/30 backdrop-blur-xl text-white px-6 py-4 rounded-2xl flex items-center gap-3 shadow-2xl">
            <CheckCircle className="w-6 h-6 text-emerald-400 flex-shrink-0" />
            <p className="font-medium text-sm flex-1">{success}</p>
            <button onClick={() => setSuccess(null)} className="p-1">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="fixed top-24 left-1/2 transform -translate-x-1/2 z-[100] max-w-md w-full mx-4 animate-slide-down">
          <div className="bg-red-500/20 border border-red-500/30 backdrop-blur-xl text-white px-6 py-4 rounded-2xl flex items-start gap-3 shadow-2xl">
            <AlertCircle className="w-6 h-6 text-red-400 flex-shrink-0 mt-0.5" />
            <p className="font-medium text-sm flex-1 whitespace-pre-line">{error}</p>
            <button onClick={() => setError(null)} className="p-1 flex-shrink-0">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════
          MAIN CONTENT - Centered Viewfinder
          ═══════════════════════════════════════════════════════ */}
      <main className="flex-1 flex flex-col items-center justify-center relative z-10 px-4 pb-8">
        
        {!scannedTileData ? (
          <>
            {/* The Viewfinder Interaction */}
            <div className="relative group cursor-pointer" onClick={() => !loading && setShowScanner(true)}>
              
              {/* Animated Scanning Ring */}
              <div className="absolute -inset-1 bg-gradient-to-tr from-blue-500 via-cyan-400 to-purple-500 rounded-[2.5rem] opacity-20 blur-xl group-hover:opacity-40 group-hover:blur-2xl transition-all duration-1000 animate-pulse" />
              
              <div className="relative w-full max-w-lg aspect-[4/3] md:w-[600px] bg-black/40 backdrop-blur-xl border border-white/10 rounded-[2rem] flex flex-col items-center justify-center p-8 md:p-12 overflow-hidden hover:scale-[1.01] transition-transform duration-500">
                
                {/* Corner Markers (Camera UI) */}
                <div className="absolute top-6 left-6 w-8 h-8 border-t-2 border-l-2 border-white/30 rounded-tl-lg" />
                <div className="absolute top-6 right-6 w-8 h-8 border-t-2 border-r-2 border-white/30 rounded-tr-lg" />
                <div className="absolute bottom-6 left-6 w-8 h-8 border-b-2 border-l-2 border-white/30 rounded-bl-lg" />
                <div className="absolute bottom-6 right-6 w-8 h-8 border-b-2 border-r-2 border-white/30 rounded-br-lg" />

                {/* Central Icon */}
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center shadow-[0_0_40px_rgba(37,99,235,0.3)] mb-8 group-hover:scale-110 transition-transform duration-500">
                  <Camera className="w-10 h-10 text-white" />
                </div>

                <h2 className="text-3xl md:text-4xl font-bold text-center mb-3">
                  {loading ? 'Processing...' : 'Tap to Scan'}
                </h2>
                <p className="text-white/50 text-center max-w-sm mb-8">
                  Point your camera at any tile QR code to instantly track and visualize it.
                </p>

                <button 
                  disabled={loading}
                  className="rounded-full h-14 px-8 text-lg bg-white text-black hover:bg-blue-50 hover:text-blue-600 border-0 transition-all font-semibold shadow-xl group-hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader className="w-5 h-5 animate-spin" />
                      Processing
                    </>
                  ) : (
                    <>
                      <QrCode className="w-5 h-5" />
                      Start Scanner
                    </>
                  )}
                </button>

                {/* Scanning Line Animation */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent opacity-0 group-hover:opacity-50 group-hover:animate-[scan_2s_ease-in-out_infinite]" />
              </div>
            </div>

            {/* Floating Steps */}
            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
              {[
                { icon: Smartphone, label: "Point Camera", sub: "Align QR in frame" },
                { icon: Zap, label: "Instant Sync", sub: "Auto-tracks & verifies" },
                { icon: CheckCircle2, label: "Visualize", sub: "See it in 3D" },
              ].map((step, i) => (
                <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors backdrop-blur-sm">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white">
                    <step.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">{step.label}</p>
                    <p className="text-xs text-white/40">{step.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          /* ═══════════════════════════════════════════════════════
             SCANNED TILE RESULT CARD
             ═══════════════════════════════════════════════════════ */
          <div className="w-full max-w-2xl animate-slide-down">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-tr from-emerald-500 via-cyan-400 to-blue-500 rounded-[2rem] opacity-30 blur-xl" />
              
              <div className="relative bg-black/40 backdrop-blur-xl border border-white/10 rounded-[2rem] p-6 md:p-8 overflow-hidden">
                
                {/* Success Header */}
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Scan Successful!</h3>
                    <p className="text-white/50 text-sm">Tile loaded and tracked</p>
                  </div>
                </div>

                {/* Tile Info */}
                <div className="bg-white/5 rounded-2xl p-4 mb-6 border border-white/10">
                  <div className="flex flex-col md:flex-row items-start gap-4">
                    <img
                      src={scannedTileData.image || '/placeholder-tile.png'}
                      alt={scannedTileData.name}
                      className="w-24 h-24 md:w-32 md:h-32 object-cover rounded-xl border-2 border-white/20 flex-shrink-0"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/placeholder-tile.png';
                      }}
                    />
                    <div className="flex-1 min-w-0 w-full">
                      <h4 className="text-2xl font-bold text-white mb-4 break-words">
                        {scannedTileData.name}
                      </h4>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="bg-white/5 rounded-lg p-3">
                          <span className="text-white/40 block text-xs mb-1">Code</span>
                          <span className="text-white font-semibold">{scannedTileData.code}</span>
                        </div>
                        <div className="bg-white/5 rounded-lg p-3">
                          <span className="text-white/40 block text-xs mb-1">Size</span>
                          <span className="text-white font-semibold">{scannedTileData.size}</span>
                        </div>
                        <div className="bg-white/5 rounded-lg p-3">
                          <span className="text-white/40 block text-xs mb-1">Price</span>
                          <span className="text-white font-semibold">₹{scannedTileData.price}</span>
                        </div>
                        <div className="bg-white/5 rounded-lg p-3">
                          <span className="text-white/40 block text-xs mb-1">Stock</span>
                          <span className={`font-semibold ${
                            scannedTileData.inStock ? 'text-emerald-400' : 'text-red-400'
                          }`}>
                            {scannedTileData.inStock ? `${scannedTileData.stock} units` : 'Out of Stock'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                  <button
                    onClick={() => {
                      setScannedTileData(null);
                      setShowScanner(true);
                    }}
                    className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-xl font-semibold transition-all border border-white/10"
                  >
                    <QrCode className="w-5 h-5" />
                    Scan Another
                  </button>
                  
                  <button
                    onClick={() => navigate(`/room-select/${scannedTileData.id}`)}
                    className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-lg"
                  >
                    <Eye className="w-5 h-5" />
                    View in 3D
                  </button>
                </div>

                <button
                  onClick={() => setScannedTileData(null)}
                  className="w-full text-white/40 hover:text-white text-sm py-2 transition-colors"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer Info */}
      <footer className="w-full p-6 text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/5 text-xs text-white/40 hover:text-white/60 transition-colors cursor-help backdrop-blur-sm">
          <Info className="w-3 h-3" />
          <span>Ensure good lighting for best QR detection • All scans are tracked & verified</span>
        </div>
      </footer>

      {/* QR Scanner Modal */}
      {showScanner && (
        <QRScanner
          onScanSuccess={handleScanSuccess}
          onClose={() => setShowScanner(false)}
        />
      )}

      {/* Custom CSS Animation for Scan Line */}
      <style>{`
        @keyframes scan {
          0% { top: 0%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
        @keyframes slide-down {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slide-down {
          animation: slide-down 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};