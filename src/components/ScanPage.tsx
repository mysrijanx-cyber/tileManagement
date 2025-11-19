

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  QrCode, LogOut, Camera, AlertCircle, CheckCircle, 
  Loader, Package, User, RefreshCw, X, Eye 
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
  verifyWorkerTileAccess ,
   getTileByCode
} from '../lib/firebaseutils';

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
  const { currentUser, isAuthenticated } = useAppStore();
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

  useWorkerStatus();

  // ═══════════════════════════════════════════════════════════
  // EFFECTS
  // ═══════════════════════════════════════════════════════════

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Load recent scans on mount
  useEffect(() => {
    loadRecentScans();
  }, []);

  // Auto-clear messages
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
  // MAIN SCAN HANDLER (PRODUCTION v2.0 - WITH SECURITY)
  // ═══════════════════════════════════════════════════════════

  // const handleScanSuccess = async (data: any) => {
  //   console.log('🎯 ===== SCAN HANDLER CALLED =====');
  //   console.log('📥 Scan Data:', data);
    
  //   try {
  //     setLoading(true);
  //     setError(null);
  //     setSuccess(null);

  //     // ─────────────────────────────────────────────────────────
  //     // STEP 1: EXTRACT & VALIDATE TILE ID
  //     // ─────────────────────────────────────────────────────────
      
  //     let tileId: string;
      
  //     if (data.tileId) {
  //       tileId = data.tileId;
  //     } else if (data.type === 'manual_entry' && data.tileCode) {
  //       setError('Manual tile code lookup not implemented yet.');
  //       setLoading(false);
  //       return;
  //     } else {
  //       setError('Invalid QR code format.');
  //       setLoading(false);
  //       return;
  //     }

  //     console.log('✅ Tile ID extracted:', tileId);

  //     // ─────────────────────────────────────────────────────────
  //     // STEP 2: WORKER AUTHORIZATION (CRITICAL SECURITY)
  //     // ─────────────────────────────────────────────────────────
      
  //     if (currentUser?.role === 'worker' && currentUser?.user_id) {
  //       console.log('🔒 Worker detected - verifying access rights...');
        
  //       const verification = await verifyWorkerTileAccess(
  //         tileId, 
  //         currentUser.user_id
  //       );
        
  //       if (!verification.allowed) {
  //         console.error('🚫 ACCESS DENIED:', verification.error);
          
  //         // Close scanner immediately
  //         setShowScanner(false);
  //         setLoading(false);
          
  //         // Error haptic feedback (triple vibration)
  //         if (navigator.vibrate) {
  //           navigator.vibrate([200, 100, 200, 100, 200]);
  //         }
          
  //         // Show security error message
  //         setTimeout(() => {
  //           setError(
  //             `🚫 UNAUTHORIZED TILE\n\n` +
  //             `${verification.error || 'This tile belongs to another seller.'}\n\n` +
  //             `⚠️ You can only scan tiles from your assigned showroom.`
  //           );
  //         }, 100);
          
  //         // Auto-clear after 10 seconds
  //         setTimeout(() => {
  //           setError(null);
  //         }, 10000);
          
  //         return; // ← BLOCK UNAUTHORIZED SCAN
  //       }
        
  //       console.log('✅ Worker authorized for this tile');
  //       console.log('📊 Seller:', verification.sellerId);
  //     }

  //     // ─────────────────────────────────────────────────────────
  //     // STEP 3: FETCH TILE DATA (Authorization passed)
  //     // ─────────────────────────────────────────────────────────
      
  //     console.log('📦 Fetching tile details...');
  //     const tileData = await getTileById(tileId);
      
  //     if (!tileData) {
  //       console.error('❌ Tile not found in database');
  //       setShowScanner(false);
  //       setLoading(false);
  //       setTimeout(() => {
  //         setError('Tile not found in database.');
  //       }, 100);
  //       return;
  //     }

  //     console.log('✅ Tile loaded:', tileData.name);

  //     const sellerId = tileData.sellerId || tileData.seller_id;

  //     // ─────────────────────────────────────────────────────────
  //     // STEP 4: SUCCESS FEEDBACK & UI UPDATE
  //     // ─────────────────────────────────────────────────────────
      
  //     // Success haptic (single strong vibration)
  //     if (navigator.vibrate) {
  //       navigator.vibrate(200);
  //     }

  //     // Save to recent scans
  //     saveRecentScan({
  //       id: tileId,
  //       tileName: tileData.name,
  //       tileImage: tileData.imageUrl || tileData.image_url || '/placeholder-tile.png',
  //       scannedAt: new Date().toISOString(),
  //       tileId: tileId
  //     });

  //     // Show success message
  //     setSuccess(`✅ ${tileData.name} scanned successfully!`);
  //     setShowScanner(false);
      
  //     // Display tile data
  //     setScannedTileData({
  //       id: tileId,
  //       name: tileData.name,
  //       image: tileData.imageUrl || tileData.image_url,
  //       code: tileData.tileCode || tileData.tile_code,
  //       size: tileData.size,
  //       price: tileData.price,
  //       stock: tileData.stock,
  //       inStock: tileData.inStock
  //     });

  //     setLoading(false);

  //     console.log('✅ Tile displayed to user');

  //     // ─────────────────────────────────────────────────────────
  //     // STEP 5: BACKGROUND ANALYTICS TRACKING (Fire & Forget)
  //     // ─────────────────────────────────────────────────────────
      
  //     console.log('📊 Starting background analytics...');
      
  //     Promise.all([
  //       // Main scan tracking
  //       trackTileScanEnhanced(tileId, sellerId, currentUser?.user_id).catch(err => {
  //         console.warn('⚠️ Main tracking failed:', err);
  //       }),
        
  //       // Legacy tracking
  //       trackQRScan(tileId, {
  //         sellerId: sellerId,
  //         showroomId: tileData.showroomId,
  //         scannedBy: currentUser?.user_id ?? 'anonymous',
  //         userRole: currentUser?.role ?? 'visitor',
  //         scanContext: currentUser?.role === 'worker' ? 'worker_showroom_scan' : 'public_scan'
  //       }).catch(err => {
  //         console.warn('⚠️ Legacy tracking failed:', err);
  //       }),
        
  //       // Worker activity tracking
  //       currentUser?.role === 'worker' && currentUser?.user_id
  //         ? trackWorkerActivity(currentUser.user_id, 'scan', { 
  //             tileId, 
  //             tileName: tileData.name, 
  //             sellerId,
  //             authorized: true
  //           }).catch(err => {
  //             console.warn('⚠️ Worker tracking failed:', err);
  //           })
  //         : Promise.resolve()
  //     ]).then(() => {
  //       console.log('✅ Background tracking completed');
        
  //       // Broadcast scan event
  //       const event = new CustomEvent('tile-scanned', { 
  //         detail: { 
  //           tileId, 
  //           sellerId,
  //           tileName: tileData.name,
  //           timestamp: new Date().toISOString(),
  //           scannedBy: currentUser?.role
  //         } 
  //       });
  //       window.dispatchEvent(event);
        
  //       console.log('✅ Scan event broadcasted');
  //     });

  //     console.log('🎉 ===== SCAN COMPLETED SUCCESSFULLY =====');

  //   } catch (err: any) {
  //     console.error('❌ Scan error:', err);
  //     setShowScanner(false);
  //     setLoading(false);
  //     setTimeout(() => {
  //       setError('Failed to process scan. Please try again.');
  //     }, 100);
  //   }
  // };
// ✅ FIND handleScanSuccess function (around line 105)
// ✅ REPLACE THE ENTIRE FUNCTION WITH THIS:

const handleScanSuccess = async (data: any) => {
  console.log('🎯 ===== SCAN HANDLER CALLED =====');
  console.log('📥 Scan Data:', data);
  
  try {
    setLoading(true);
    setError(null);
    setSuccess(null);

    let tileId: string;
    let tileData: any;

    // ─────────────────────────────────────────────────────────
    // MODE 1: QR CODE SCAN (has tileId directly)
    // ─────────────────────────────────────────────────────────
    
    if (data.tileId) {
      tileId = data.tileId;
      console.log('✅ QR Scan Mode - Tile ID:', tileId);

      // Worker authorization for QR scan
      if (currentUser?.role === 'worker' && currentUser?.user_id) {
        console.log('🔒 Worker detected - verifying QR access...');
        
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

      // Fetch tile data
      console.log('📦 Fetching tile data...');
      tileData = await getTileById(tileId);
      
      if (!tileData) {
        console.error('❌ Tile not found');
        setShowScanner(false);
        setLoading(false);
        setTimeout(() => {
          setError('Tile not found in database.');
        }, 100);
        return;
      }

      console.log('✅ Tile loaded via QR:', tileData.name);
    }

    // ─────────────────────────────────────────────────────────
    // MODE 2: MANUAL ENTRY (has tileCode) - ✅ FIXED!
    // ─────────────────────────────────────────────────────────
    
    else if (data.type === 'manual_entry' && data.tileCode) {
      console.log('✅ Manual Entry Mode - Code:', data.tileCode);

      // ✅ Call getTileByCode with worker authorization
      const searchResult = await getTileByCode(
        data.tileCode,
        currentUser?.role === 'worker' ? currentUser?.user_id : undefined
      );

      if (!searchResult.success) {
        console.error('❌ Manual search failed:', searchResult.error);
        
        setShowScanner(false);
        setLoading(false);
        
        if (navigator.vibrate) {
          navigator.vibrate([200, 100, 200]);
        }
        
        setTimeout(() => {
          setError(searchResult.error || 'Tile not found');
        }, 100);
        
        setTimeout(() => setError(null), 8000);
        return;
      }

      tileData = searchResult.tile;
      tileId = tileData.id;

      console.log('✅ Tile found via manual entry:', tileData.name);
    }

    // ─────────────────────────────────────────────────────────
    // INVALID DATA
    // ─────────────────────────────────────────────────────────
    
    else {
      console.error('❌ Invalid scan data format');
      setError('Invalid scan data. Please try again.');
      setLoading(false);
      return;
    }

    // ─────────────────────────────────────────────────────────
    // COMMON SUCCESS PATH (Both QR & Manual)
    // ─────────────────────────────────────────────────────────

    const sellerId = tileData.sellerId || tileData.seller_id;

    // Success feedback
    if (navigator.vibrate) {
      navigator.vibrate(200);
    }

    // Save to recent scans
    saveRecentScan({
      id: tileId,
      tileName: tileData.name,
      tileImage: tileData.imageUrl || tileData.image_url || '/placeholder-tile.png',
      scannedAt: new Date().toISOString(),
      tileId: tileId
    });

    // Show success message
    setSuccess(`✅ ${tileData.name} scanned successfully!`);
    
    // ✅ AUTO-CLOSE SCANNER
    setShowScanner(false);
    
    // Display tile data
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

    console.log('✅ Tile displayed to user');

    // ─────────────────────────────────────────────────────────
    // BACKGROUND ANALYTICS (Fire & Forget)
    // ─────────────────────────────────────────────────────────
    
    console.log('📊 Starting background analytics...');
    
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
      
      console.log('✅ Scan event broadcasted');
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

  // ═══════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      {/* ═══════════════════════════════════════════════════════
          HEADER
          ═══════════════════════════════════════════════════════ */}
      <header className="bg-black/30 backdrop-blur-sm border-b border-white/10 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-3 sm:py-4 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
              <QrCode className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-white font-bold text-base sm:text-xl truncate">Tile Scanner</h1>
              <p className="text-blue-200 text-xs sm:text-sm truncate">
                {isMobile ? getUserDisplayName() : `Welcome, ${getUserDisplayName()}`}
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 bg-red-600/20 text-red-200 rounded-lg hover:bg-red-600/30 active:bg-red-600/40 transition-colors border border-red-500/30 text-xs sm:text-sm font-medium touch-manipulation flex-shrink-0"
            aria-label="Logout"
          >
            <LogOut className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="hidden xs:inline">Logout</span>
          </button>
        </div>
      </header>

      {/* ═══════════════════════════════════════════════════════
          MAIN CONTENT
          ═══════════════════════════════════════════════════════ */}
      <main className="max-w-4xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8 space-y-4 sm:space-y-6 lg:space-y-8">
        
        {/* Success Message */}
        {success && (
          <div className="fixed top-16 sm:top-20 left-1/2 transform -translate-x-1/2 z-50 max-w-md w-full mx-4 animate-slide-down">
            <div className="bg-green-500/20 border border-green-500/30 text-green-200 px-4 sm:px-6 py-3 sm:py-4 rounded-lg backdrop-blur-sm flex items-center gap-2 sm:gap-3 shadow-2xl">
              <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" />
              <p className="font-medium text-sm sm:text-base flex-1 whitespace-pre-line">{success}</p>
              <button 
                onClick={() => setSuccess(null)} 
                className="ml-auto touch-manipulation p-1"
                aria-label="Close message"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="fixed top-16 sm:top-20 left-1/2 transform -translate-x-1/2 z-50 max-w-md w-full mx-4 animate-slide-down">
            <div className="bg-red-500/20 border border-red-500/30 text-red-200 px-4 sm:px-6 py-3 sm:py-4 rounded-lg backdrop-blur-sm flex items-start gap-2 sm:gap-3 shadow-2xl">
              <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0 mt-0.5" />
              <p className="font-medium text-sm sm:text-base flex-1 whitespace-pre-line break-words">{error}</p>
              <button 
                onClick={() => setError(null)} 
                className="ml-auto touch-manipulation p-1 flex-shrink-0"
                aria-label="Close message"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Scan Section */}
        <section className="bg-white/10 backdrop-blur-md rounded-xl sm:rounded-2xl border border-white/20 p-4 sm:p-6 lg:p-8 text-center">
          <div className="mb-4 sm:mb-6">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 transform hover:scale-110 transition-transform">
              <Camera className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">Scan Tile QR Code</h2>
            <p className="text-blue-200 text-sm sm:text-base px-4">
              Point your camera at the QR code on the tile
            </p>
          </div>

          <button
            onClick={() => setShowScanner(true)}
            disabled={loading}
            className="inline-flex items-center gap-2 sm:gap-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg sm:rounded-xl font-semibold text-base sm:text-lg hover:from-blue-700 hover:to-purple-700 active:from-blue-800 active:to-purple-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 active:scale-95 shadow-xl touch-manipulation"
          >
            {loading ? (
              <>
                <Loader className="w-5 h-5 sm:w-6 sm:h-6 animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <QrCode className="w-5 h-5 sm:w-6 sm:h-6" />
                <span>Start Scanning</span>
              </>
            )}
          </button>

          <div className="mt-4 sm:mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 text-xs sm:text-sm">
            <div className="bg-white/5 rounded-lg p-3 sm:p-4 border border-white/10 hover:bg-white/10 transition-colors">
              <div className="text-blue-400 mb-1 sm:mb-2 font-semibold">📱 Step 1</div>
              <div className="text-white">Click "Start Scanning"</div>
            </div>
            <div className="bg-white/5 rounded-lg p-3 sm:p-4 border border-white/10 hover:bg-white/10 transition-colors">
              <div className="text-blue-400 mb-1 sm:mb-2 font-semibold">🎯 Step 2</div>
              <div className="text-white">Point at QR code</div>
            </div>
            <div className="bg-white/5 rounded-lg p-3 sm:p-4 border border-white/10 hover:bg-white/10 transition-colors">
              <div className="text-blue-400 mb-1 sm:mb-2 font-semibold">✅ Step 3</div>
              <div className="text-white">Auto-tracked!</div>
            </div>
          </div>
        </section>

        {/* Scan Result Card */}
        {scannedTileData && (
          <section className="bg-white/10 backdrop-blur-md rounded-xl sm:rounded-2xl border border-white/20 p-4 sm:p-6 animate-slide-down">
            <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
              <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-400 flex-shrink-0" />
              <h3 className="text-lg sm:text-xl font-bold text-white">Scan Successful!</h3>
            </div>

            <div className="bg-white/5 rounded-lg sm:rounded-xl p-3 sm:p-4 mb-3 sm:mb-4">
              <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
                <img
                  src={scannedTileData.image || '/placeholder-tile.png'}
                  alt={scannedTileData.name}
                  className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-lg border-2 border-white/20 flex-shrink-0"
                  loading="lazy"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/placeholder-tile.png';
                  }}
                />
                <div className="flex-1 min-w-0 w-full">
                  <h4 className="text-base sm:text-xl font-bold text-white mb-2 sm:mb-3 break-words">
                    {scannedTileData.name}
                  </h4>
                  <div className="grid grid-cols-2 gap-2 text-xs sm:text-sm">
                    <div>
                      <span className="text-gray-400 block">Code:</span>
                      <span className="text-white font-medium truncate block">{scannedTileData.code}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block">Size:</span>
                      <span className="text-white font-medium truncate block">{scannedTileData.size}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block">Price:</span>
                      <span className="text-white font-medium truncate block">₹{scannedTileData.price}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block">Stock:</span>
                      <span className={`font-medium truncate block ${
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
              <button
                onClick={() => {
                  setScannedTileData(null);
                  setShowScanner(true);
                }}
                className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-semibold hover:bg-blue-700 active:bg-blue-800 transition-all text-sm sm:text-base touch-manipulation"
              >
                <QrCode className="w-4 h-4 sm:w-5 sm:h-5" />
                Scan Another
              </button>
              
              <button
                onClick={() => navigate(`/tile/${scannedTileData.id}`)}
                className="flex items-center justify-center gap-2 bg-green-600 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-semibold hover:bg-green-700 active:bg-green-800 transition-all text-sm sm:text-base touch-manipulation"
              >
                <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                View in 3D
              </button>
            </div>

            <button
              onClick={() => setScannedTileData(null)}
              className="w-full mt-2 sm:mt-3 text-gray-400 hover:text-white text-xs sm:text-sm py-2 transition-colors touch-manipulation"
            >
              Dismiss
            </button>
          </section>
        )}

        {/* Instructions */}
        <section className="bg-white/5 backdrop-blur-sm rounded-lg sm:rounded-xl border border-white/10 p-4 sm:p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 text-xs sm:text-sm">
            <div className="bg-white/5 rounded-lg p-3 sm:p-4 border border-white/10">
              <h4 className="text-blue-400 font-medium mb-2 text-sm sm:text-base">🔍 Scanning</h4>
              <ul className="text-gray-300 space-y-1">
                <li>• Find QR code on tile</li>
                <li>• Good lighting required</li>
                <li>• Hold steady until detected</li>
                <li>• ✅ Every scan is tracked!</li>
              </ul>
            </div>
            <div className="bg-white/5 rounded-lg p-3 sm:p-4 border border-white/10">
              <h4 className="text-blue-400 font-medium mb-2 text-sm sm:text-base">👥 Customer Service</h4>
              <ul className="text-gray-300 space-y-1">
                <li>• Show 3D visualization</li>
                <li>• Help select room types</li>
                <li>• Demonstrate combinations</li>
                <li>• Share links</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Mobile Tip */}
        {isMobile && (
          <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-lg p-3 border border-blue-500/30 text-center">
            <p className="text-blue-200 text-xs">
              💡 Rotate your device for better scanning experience
            </p>
          </div>
        )}
      </main>

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