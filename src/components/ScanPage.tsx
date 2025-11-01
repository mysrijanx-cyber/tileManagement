
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
  const [isMobile, setIsMobile] = useState(false);

  useWorkerStatus();

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
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

      // Haptic feedback
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      {/* Header */}
      <header className="bg-black/30 backdrop-blur-sm border-b border-white/10 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-3 sm:py-4 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
              <QrCode className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-white font-bold text-base sm:text-xl truncate">Tile Scanner</h1>
              <p className="text-blue-200 text-xs sm:text-sm truncate">
                {isMobile ? currentUser?.full_name?.split(' ')[0] || 'Worker' : `Welcome, ${currentUser?.full_name || 'Worker'}`}
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

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8 space-y-4 sm:space-y-6 lg:space-y-8">
        
        {/* Success/Error Messages */}
        {success && (
          <div className="fixed top-16 sm:top-20 left-1/2 transform -translate-x-1/2 z-50 max-w-md w-full mx-4 animate-slide-down">
            <div className="bg-green-500/20 border border-green-500/30 text-green-200 px-4 sm:px-6 py-3 sm:py-4 rounded-lg backdrop-blur-sm flex items-center gap-2 sm:gap-3 shadow-2xl">
              <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" />
              <p className="font-medium text-sm sm:text-base flex-1">{success}</p>
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

        {error && (
          <div className="fixed top-16 sm:top-20 left-1/2 transform -translate-x-1/2 z-50 max-w-md w-full mx-4 animate-slide-down">
            <div className="bg-red-500/20 border border-red-500/30 text-red-200 px-4 sm:px-6 py-3 sm:py-4 rounded-lg backdrop-blur-sm flex items-center gap-2 sm:gap-3 shadow-2xl">
              <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" />
              <p className="font-medium text-sm sm:text-base flex-1">{error}</p>
              <button 
                onClick={() => setError(null)} 
                className="ml-auto touch-manipulation p-1"
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
            <div className="bg-white/5 rounded-lg p-3 sm:p-4 border border-white/10 hover:bg-white/10 transition-colors sm:col-span-1 col-span-1">
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
                  console.log('🔄 Scan Another clicked');
                  setScannedTileData(null);
                  setShowScanner(true);
                  console.log('✅ Scanner reopened');
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

        {/* Recent Scans */}
        {recentScans.length > 0 && (
          <section className="bg-white/10 backdrop-blur-md rounded-xl sm:rounded-2xl border border-white/20 p-4 sm:p-6">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <h3 className="text-base sm:text-xl font-bold text-white flex items-center gap-2">
                <Package className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
                <span>Recent Scans</span>
              </h3>
              <button
                onClick={() => {
                  if (window.confirm('Clear all recent scans?')) {
                    setRecentScans([]);
                    localStorage.removeItem('worker_recent_scans');
                  }
                }}
                className="text-gray-400 hover:text-white text-xs sm:text-sm flex items-center gap-1 touch-manipulation p-2 -mr-2 rounded-lg hover:bg-white/5"
                aria-label="Clear recent scans"
              >
                <RefreshCw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span>Clear</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {recentScans.map((scan) => (
                <button
                  key={scan.id}
                  onClick={() => openRecentScan(scan.tileId)}
                  className="bg-white/5 rounded-lg p-3 sm:p-4 border border-white/10 hover:bg-white/10 active:bg-white/15 transition-colors group text-left touch-manipulation"
                  aria-label={`View ${scan.tileName}`}
                >
                  <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                    <img
                      src={scan.tileImage}
                      alt={scan.tileName}
                      className="w-10 h-10 sm:w-12 sm:h-12 object-cover rounded-lg flex-shrink-0"
                      loading="lazy"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/placeholder-tile.png';
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-medium truncate group-hover:text-blue-200 text-sm sm:text-base transition-colors">
                        {scan.tileName}
                      </p>
                      <p className="text-gray-400 text-xs sm:text-sm">
                        {new Date(scan.scannedAt).toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="text-blue-400 text-xs sm:text-sm flex items-center gap-1">
                    <QrCode className="w-3 h-3" />
                    Tap to view again
                  </div>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* Instructions */}
        <section className="bg-white/5 backdrop-blur-sm rounded-lg sm:rounded-xl border border-white/10 p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4 flex items-center gap-2">
            <User className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
            <span>Worker Instructions</span>
          </h3>
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

        {/* Additional Info - Mobile Only */}
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
