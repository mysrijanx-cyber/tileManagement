

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Share2, Loader, Upload, Scan, 
  Package, AlertCircle, CheckCircle, X, Info,
  ChevronDown, ChevronUp, Eye
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

  // Mobile UI states
  const [showMobileControls, setShowMobileControls] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [expandedSection, setExpandedSection] = useState<'floor' | 'wall' | null>(null);

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

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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
        setError('Tile not found');
        setTimeout(() => navigate('/'), 2000);
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
      setError('Failed to load tile data');
      setTimeout(() => navigate('/'), 2000);
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
      
      // Haptic feedback
      if (navigator.vibrate) {
        navigator.vibrate(200);
      }
      
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
        setSuccess('Shared successfully!');
      } else {
        await navigator.clipboard.writeText(window.location.href);
        setSuccess('Link copied to clipboard!');
      }
    } catch (err) {
      console.error('Error sharing:', err);
      setError('Failed to share');
    }
  };

  const toggleSection = (section: 'floor' | 'wall') => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="text-center px-4">
          <Loader className="w-12 h-12 sm:w-16 sm:h-16 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-white text-base sm:text-lg font-medium">Loading 3D view...</p>
          <p className="text-gray-400 text-xs sm:text-sm mt-2">Please wait while we prepare your visualization</p>
        </div>
      </div>
    );
  }

  if (!tile || !roomType) {
    return null;
  }

  const isKitchenOrBathroom = roomType === 'kitchen' || roomType === 'bathroom';

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex flex-col">
      {/* Header */}
      <header className="bg-gray-800/95 backdrop-blur-sm shadow-lg z-20 sticky top-0 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-3 sm:py-4 flex items-center justify-between gap-2">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1 sm:gap-2 text-white hover:text-blue-400 transition-colors touch-manipulation p-2 -ml-2 rounded-lg hover:bg-gray-700"
            aria-label="Go back"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="font-medium text-sm sm:text-base">Back</span>
          </button>

          <div className="flex-1 text-center min-w-0">
            <h1 className="text-white font-bold text-sm sm:text-lg md:text-xl capitalize truncate">
              {roomType} - 3D View
            </h1>
            <p className="text-gray-400 text-xs hidden sm:block">Interactive Visualization</p>
          </div>

          <button
            onClick={handleShare}
            className="p-2 text-white hover:bg-gray-700 rounded-lg transition-colors touch-manipulation"
            title="Share"
            aria-label="Share visualization"
          >
            <Share2 className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </header>

      {/* Success/Error Messages */}
      {success && (
        <div className="fixed top-16 sm:top-20 left-1/2 transform -translate-x-1/2 z-50 max-w-md w-full mx-4 animate-slide-down">
          <div className="bg-green-500 text-white px-4 sm:px-6 py-3 sm:py-4 rounded-lg shadow-2xl flex items-center gap-2 sm:gap-3">
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
          <div className="bg-red-500 text-white px-4 sm:px-6 py-3 sm:py-4 rounded-lg shadow-2xl flex items-center gap-2 sm:gap-3">
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

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* 3D Viewer */}
        <div className="flex-1 relative min-h-[300px] sm:min-h-[400px] lg:min-h-0">
          <Enhanced3DViewer
            roomType={roomType as any}
            floorTile={floorTile}
            wallTile={wallTile}
            activeSurface={activeSurface}
            onSurfaceChange={setActiveSurface}
          />

          {/* Mobile Controls Toggle */}
          {isMobile && (
            <button
              onClick={() => setShowMobileControls(!showMobileControls)}
              className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2 touch-manipulation z-10"
              aria-label={showMobileControls ? "Hide controls" : "Show controls"}
            >
              <Eye className="w-4 h-4" />
              <span className="text-sm font-medium">
                {showMobileControls ? 'Hide' : 'Show'} Controls
              </span>
              {showMobileControls ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
            </button>
          )}
        </div>

        {/* Control Panel */}
        <aside 
          className={`lg:w-96 bg-gray-800/95 backdrop-blur-sm overflow-y-auto transition-all duration-300 border-t lg:border-t-0 lg:border-l border-gray-700 ${
            isMobile && !showMobileControls 
              ? 'max-h-0 opacity-0' 
              : 'max-h-screen opacity-100'
          }`}
        >
          <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
            
            {/* Floor Tile Section */}
            <section className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-3 sm:p-4 border-2 border-blue-500/30 shadow-lg">
              <button
                onClick={() => toggleSection('floor')}
                className="w-full flex items-center justify-between mb-3 touch-manipulation lg:cursor-default"
                aria-expanded={isMobile ? expandedSection === 'floor' : true}
              >
                <h3 className="text-white font-bold text-sm sm:text-base flex items-center gap-2">
                  <Package className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
                  Floor Tile
                </h3>
                {isMobile && (
                  expandedSection === 'floor' 
                    ? <ChevronUp className="w-5 h-5 text-gray-400" />
                    : <ChevronDown className="w-5 h-5 text-gray-400" />
                )}
              </button>

              <div className={`space-y-3 ${isMobile && expandedSection !== 'floor' ? 'hidden' : 'block'}`}>
                {/* Floor Tile Info */}
                {/* <div className="bg-gray-800 rounded-lg p-3 border border-gray-700">
                  <div className="flex items-center gap-3">
                    <img
                      src={tile.imageUrl}
                      alt={tile.name}
                      className="w-14 h-14 sm:w-16 sm:h-16 object-cover rounded-lg ring-2 ring-blue-500/50"
                      loading="lazy"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-medium text-xs sm:text-sm truncate">{tile.name}</p>
                      <p className="text-gray-400 text-xs">{tile.size}</p>
                      <p className="text-green-400 text-xs mt-1 flex items-center gap-1">
                        <CheckCircle className="w-3 h-3 flex-shrink-0" />
                        <span className="truncate">Applied from QR</span>
                      </p>
                    </div>
                  </div>
                </div> */}

                {/* Floor Tile Info */}
<div className="bg-gray-800 rounded-lg p-3 border border-gray-700">
  <div className="flex items-center gap-3">
    <img
      src={tile.imageUrl}
      alt={tile.name}
      className="w-14 h-14 sm:w-16 sm:h-16 object-cover rounded-lg ring-2 ring-blue-500/50"
      loading="lazy"
    />
    <div className="flex-1 min-w-0">
      <p className="text-white font-medium text-xs sm:text-sm truncate">{tile.name}</p>
      <p className="text-gray-400 text-xs">{tile.size}</p>
      
      {/* ✅ NEW: SURFACE & MATERIAL */}
      {(tile.tileSurface || tile.tileMaterial) && (
        <div className="flex flex-wrap gap-1 mt-1">
          {tile.tileSurface && (
            <span className="inline-flex items-center gap-1 bg-blue-500/20 text-blue-300 px-1.5 py-0.5 rounded text-xs">
              🔘 {tile.tileSurface}
            </span>
          )}
          {tile.tileMaterial && (
            <span className="inline-flex items-center gap-1 bg-purple-500/20 text-purple-300 px-1.5 py-0.5 rounded text-xs">
              🧱 {tile.tileMaterial}
            </span>
          )}
        </div>
      )}
      
      <p className="text-green-400 text-xs mt-1 flex items-center gap-1">
        <CheckCircle className="w-3 h-3 flex-shrink-0" />
        <span className="truncate">Applied from QR</span>
      </p>
    </div>
  </div>
</div>
              </div>
            </section>

            {/* Wall Tile Section (Kitchen/Bathroom Only) */}
            {isKitchenOrBathroom && (
              <section className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-3 sm:p-4 border-2 border-purple-500/30 shadow-lg">
                <button
                  onClick={() => toggleSection('wall')}
                  className="w-full flex items-center justify-between mb-3 touch-manipulation lg:cursor-default"
                  aria-expanded={isMobile ? expandedSection === 'wall' : true}
                >
                  <h3 className="text-white font-bold text-sm sm:text-base flex items-center gap-2">
                    <Package className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
                    Wall Tile
                  </h3>
                  {isMobile && (
                    expandedSection === 'wall' 
                      ? <ChevronUp className="w-5 h-5 text-gray-400" />
                      : <ChevronDown className="w-5 h-5 text-gray-400" />
                  )}
                </button>

                <div className={`space-y-3 sm:space-y-4 ${isMobile && expandedSection !== 'wall' ? 'hidden' : 'block'}`}>
                  {/* ✅ Input Method Selector */}
                  <div>
                    <label className="text-white text-xs sm:text-sm font-medium mb-2 block">
                      Choose Input Method:
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => setWallTileInputMethod('qr')}
                        className={`flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg font-medium transition-all text-xs sm:text-sm touch-manipulation ${
                          wallTileInputMethod === 'qr'
                            ? 'bg-purple-600 text-white shadow-lg ring-2 ring-purple-400'
                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        }`}
                      >
                        <Scan className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        QR Scan
                      </button>
                      <button
                        onClick={() => setWallTileInputMethod('upload')}
                        className={`flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg font-medium transition-all text-xs sm:text-sm touch-manipulation ${
                          wallTileInputMethod === 'upload'
                            ? 'bg-purple-600 text-white shadow-lg ring-2 ring-purple-400'
                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        }`}
                      >
                        <Upload className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        Upload
                      </button>
                    </div>
                  </div>

                  {/* ✅ QR Scan Method */}
                  {wallTileInputMethod === 'qr' && (
                    <div className="space-y-3">
                      {wallTile.texture ? (
                        <div className="bg-gray-800 rounded-lg p-3 border border-gray-700">
                          <img
                            src={wallTile.texture}
                            alt="Wall Tile"
                            className="w-full h-28 sm:h-32 object-cover rounded-lg mb-2 ring-2 ring-purple-500/50"
                            loading="lazy"
                          />
                          <p className="text-green-400 text-xs flex items-center gap-1 mb-2">
                            <CheckCircle className="w-3 h-3 flex-shrink-0" />
                            <span className="truncate">Wall tile applied from QR</span>
                          </p>
                          <button
                            onClick={() => setShowWallScanner(true)}
                            className="w-full bg-purple-600 text-white py-2 rounded-lg text-xs sm:text-sm font-medium hover:bg-purple-700 active:bg-purple-800 transition-colors touch-manipulation"
                          >
                            Scan Different Wall Tile
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setShowWallScanner(true)}
                          disabled={scannerLoading}
                          className="w-full bg-purple-600 text-white py-3 sm:py-4 rounded-lg font-semibold hover:bg-purple-700 active:bg-purple-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm sm:text-base touch-manipulation"
                        >
                          {scannerLoading ? (
                            <>
                              <Loader className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                              Loading...
                            </>
                          ) : (
                            <>
                              <Scan className="w-4 h-4 sm:w-5 sm:h-5" />
                              Scan Wall Tile QR Code
                            </>
                          )}
                        </button>
                      )}

                      <div className="bg-purple-900/30 rounded-lg p-2.5 sm:p-3 border border-purple-500/30">
                        <p className="text-purple-200 text-xs flex items-start gap-2">
                          <Info className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                          <span><strong>Tip:</strong> Scan QR code from another tile to apply it on walls</span>
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

                      <div className="bg-blue-900/30 rounded-lg p-2.5 sm:p-3 border border-blue-500/30">
                        <p className="text-blue-200 text-xs flex items-start gap-2">
                          <Info className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                          <span>Upload your own wall tile image or use QR scan for showroom tiles</span>
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Wall Size Selector */}
                  {wallTile.texture && (
                    <div>
                      <label className="text-white text-xs sm:text-sm font-medium mb-2 block">
                        Wall Tile Size:
                      </label>
                      <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
                        {WALL_SIZES.map((size) => (
                          <button
                            key={size.label}
                            onClick={() => setWallTile({ ...wallTile, size })}
                            className={`px-2 sm:px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all touch-manipulation ${
                              wallTile.size.width === size.width &&
                              wallTile.size.height === size.height
                                ? 'bg-purple-600 text-white shadow-lg ring-2 ring-purple-400'
                                : 'bg-gray-700 text-gray-300 hover:bg-gray-600 active:bg-gray-500'
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
              </section>
            )}

            {/* Surface Selector */}
            {isKitchenOrBathroom && (
              <section>
                <label className="block text-white font-semibold mb-3 text-sm sm:text-base">
                  View Mode:
                </label>
                <div className="grid grid-cols-3 gap-2 sm:gap-3">
                  <button
                    onClick={() => setActiveSurface('floor')}
                    className={`px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg font-medium transition-all text-xs sm:text-sm touch-manipulation ${
                      activeSurface === 'floor'
                        ? 'bg-blue-600 text-white shadow-lg ring-2 ring-blue-400'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600 active:bg-gray-500'
                    }`}
                  >
                    Floor
                  </button>
                  <button
                    onClick={() => setActiveSurface('wall')}
                    className={`px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg font-medium transition-all text-xs sm:text-sm touch-manipulation ${
                      activeSurface === 'wall'
                        ? 'bg-purple-600 text-white shadow-lg ring-2 ring-purple-400'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600 active:bg-gray-500'
                    }`}
                  >
                    Wall
                  </button>
                  <button
                    onClick={() => setActiveSurface('both')}
                    className={`px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg font-medium transition-all text-xs sm:text-sm touch-manipulation ${
                      activeSurface === 'both'
                        ? 'bg-green-600 text-white shadow-lg ring-2 ring-green-400'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600 active:bg-gray-500'
                    }`}
                  >
                    Both
                  </button>
                </div>
              </section>
            )}

            {/* Info Box */}
            <div className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 rounded-xl p-3 sm:p-4 border border-blue-500/30 shadow-lg">
              <h4 className="text-white font-semibold mb-2 flex items-center gap-2 text-sm sm:text-base">
                <Scan className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                Dual Tile Feature
              </h4>
              <ul className="space-y-1 text-xs sm:text-sm text-gray-300">
                <li className="flex items-start gap-2">
                  <span className="text-green-400 flex-shrink-0">✓</span>
                  <span>Floor tile from first QR scan</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-400 flex-shrink-0">🎨</span>
                  <span>Wall tile: QR scan OR upload</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 flex-shrink-0">📏</span>
                  <span>Different sizes for each surface</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-400 flex-shrink-0">👁️</span>
                  <span>Real-time 3D preview</span>
                </li>
              </ul>
            </div>

          </div>
        </aside>
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