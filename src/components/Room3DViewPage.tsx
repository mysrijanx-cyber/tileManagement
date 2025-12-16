
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
import { getTileById, trackQRScan, saveCustomerInquiry } from '../lib/firebaseutils';  
import { Tile } from '../types';
import { auth, db } from '../lib/firebase';
import { CustomerInquiryForm } from '../components/CustomerInquiryForm';
import { getDoc, doc, collection, query, where, getDocs } from 'firebase/firestore';
import { getCustomerFromSession, isSessionValid } from '../utils/customerSession';

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
  const [showInquiryForm, setShowInquiryForm] = useState(false);
  const [inquiryFormData, setInquiryFormData] = useState<any>(null);
  const [inquirySubmitted, setInquirySubmitted] = useState(false);
  
  const [wallTileInputMethod, setWallTileInputMethod] = useState<'upload' | 'qr'>('qr');
  const [showWallScanner, setShowWallScanner] = useState(false);
  const [scannerLoading, setScannerLoading] = useState(false);
  
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [showMobileControls, setShowMobileControls] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [expandedSection, setExpandedSection] = useState<'floor' | 'wall' | null>('floor');

  const [floorTile, setFloorTile] = useState<{
    texture: string;
    size: { width: number; height: number };
  }>({
    texture: '',
    size: { width: 60, height: 60 }
  });

  const [wallTile, setWallTile] = useState<{
    texture: string;
    size: { width: number; height: number };
  }>({
    texture: '',
    size: { width: 30, height: 45 }
  });

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
    if (!tileId) {
      setError('Tile ID is missing');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const tileData = await getTileById(tileId);
      
      if (!tileData) {
        setError('Tile not found');
        setTimeout(() => navigate('/'), 3000);
        return;
      }
      
      setTile(tileData);

      const currentUser = auth.currentUser;
      
      if (currentUser) {
        try {
          const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
          
          if (userDoc.exists()) {
            const userData = userDoc.data();
            
            if (userData.role === 'worker') {
              const existingSession = getCustomerFromSession();
              
              if (existingSession && isSessionValid()) {
                setFloorTile({
                  texture: tileData.textureUrl || tileData.imageUrl,
                  size: parseTileSize(tileData.size, 'floor')
                });
                
                setInquirySubmitted(true);
                setShowInquiryForm(false);
                setLoading(false);
                setSuccess(`✅ Showing for ${existingSession.name}`);
                return;
              }
              
              const sellerId = userData.seller_id;
              let sellerBusinessName = 'Showroom';
              
              if (sellerId) {
                try {
                  const sellerQuery = query(
                    collection(db, 'sellers'),
                    where('user_id', '==', sellerId)
                  );
                  const sellerSnapshot = await getDocs(sellerQuery);
                  
                  if (!sellerSnapshot.empty) {
                    const sellerData = sellerSnapshot.docs[0].data();
                    sellerBusinessName = sellerData.business_name || 'Showroom';
                  }
                } catch (sellerErr) {
                  console.warn('⚠️ Could not fetch seller name:', sellerErr);
                }
              }
              
              setInquiryFormData({
                tileId: tileData.id,
                tileName: tileData.name,
                tileCode: tileData.tileCode || tileData.tile_code,
                tileImageUrl: tileData.imageUrl || tileData.image_url,
                tileSize: tileData.size,
                tilePrice: tileData.price,
                workerId: currentUser.uid,
                workerEmail: currentUser.email || userData.email,
                sellerId: sellerId,
                sellerBusinessName: sellerBusinessName
              });
              
              setShowInquiryForm(true);
              setLoading(false);
              return;
            }
          }
        } catch (userErr) {
          console.warn('⚠️ Could not check user role:', userErr);
        }
      }
      
      setFloorTile({
        texture: tileData.textureUrl || tileData.imageUrl,
        size: parseTileSize(tileData.size, 'floor')
      });

    } catch (err) {
      console.error('❌ Error loading tile:', err);
      setError('Failed to load tile data');
      setTimeout(() => navigate('/'), 2000);
    } finally {
      setLoading(false);
    }
  };

  const handleInquirySubmit = async (formData: any) => {
    try {
      setError(null);
      const result = await saveCustomerInquiry(formData);
      
      if (result.success) {
        setShowInquiryForm(false);
        setInquirySubmitted(true);
        setSuccess('✅ Customer details saved! Loading 3D view...');
        
        if (tile) {
          setFloorTile({
            texture: tile.textureUrl || tile.imageUrl,
            size: parseTileSize(tile.size, 'floor')
          });
        }
        
        if (navigator.vibrate) {
          navigator.vibrate([100, 50, 100]);
        }
        
        setTimeout(() => {
          setSuccess(null);
        }, 3000);
        
      } else {
        throw new Error(result.error || 'Failed to save customer details');
      }
      
    } catch (err: any) {
      console.error('❌ Inquiry submission failed:', err);
      throw err;
    }
  };

  const loadWallTileFromQR = async (wallTileId: string) => {
    try {
      setScannerLoading(true);
      setError(null);

      const sessionKey = `wall_qr_tracked_${wallTileId}`;
      const sessionTracked = sessionStorage.getItem(sessionKey);
      
      const wallTileData = await getTileById(wallTileId);

      if (!wallTileData) {
        setError('Wall tile not found');
        return;
      }

      if (!sessionTracked || (Date.now() - parseInt(sessionTracked)) > 5 * 60 * 1000) {
        await trackQRScan(wallTileId, {
          sellerId: wallTileData.sellerId,
          showroomId: wallTileData.showroomId
        });
        sessionStorage.setItem(sessionKey, Date.now().toString());
      }

      setWallTile({
        texture: wallTileData.textureUrl || wallTileData.imageUrl,
        size: parseTileSize(wallTileData.size, 'wall')
      });

      setSuccess(`Wall tile applied: ${wallTileData.name}`);
      
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
          <Loader className="w-10 h-10 animate-spin text-blue-500 mx-auto mb-2.5" />
          <p className="text-white text-sm font-medium">Loading 3D view...</p>
        </div>
      </div>
    );
  }

  if (!tile || !roomType) {
    return null;
  }

  const isKitchenOrBathroom = roomType === 'kitchen' || roomType === 'bathroom';

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 overflow-hidden">
      
      {/* Header */}
      <header className="bg-gray-800/95 backdrop-blur-sm shadow-lg z-20 border-b border-gray-700 flex-shrink-0">
        <div className="max-w-7xl mx-auto px-2.5 sm:px-3 py-2 flex items-center justify-between gap-2">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1 text-white hover:text-blue-400 transition-colors p-1 -ml-1 rounded-lg hover:bg-gray-700"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="font-medium text-xs sm:text-sm">Back</span>
          </button>

          <div className="flex-1 text-center min-w-0">
            <h1 className="text-white font-bold text-xs sm:text-sm md:text-base capitalize truncate">
              {roomType} - 3D View
            </h1>
          </div>

          <button
            onClick={handleShare}
            className="p-1 text-white hover:bg-gray-700 rounded-lg transition-colors"
            title="Share"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </header>

      {showInquiryForm && inquiryFormData && (
        <CustomerInquiryForm
          {...inquiryFormData}
          onSubmit={handleInquirySubmit}
          onCancel={() => {
            setShowInquiryForm(false);
            navigate(-1);
          }}
        />
      )}

      {success && (
        <div className="fixed top-12 left-1/2 transform -translate-x-1/2 z-50 max-w-md w-full mx-2.5 animate-slide-down">
          <div className="bg-green-500 text-white px-3 py-2 rounded-lg shadow-2xl flex items-center gap-2">
            <CheckCircle className="w-4 h-4 flex-shrink-0" />
            <p className="font-medium text-xs flex-1">{success}</p>
            <button onClick={() => setSuccess(null)} className="ml-auto p-0.5">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {error && (
        <div className="fixed top-12 left-1/2 transform -translate-x-1/2 z-50 max-w-md w-full mx-2.5 animate-slide-down">
          <div className="bg-red-500 text-white px-3 py-2 rounded-lg shadow-2xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <p className="font-medium text-xs flex-1">{error}</p>
            <button onClick={() => setError(null)} className="ml-auto p-0.5">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        
        {/* 3D Viewer */}
        <div className="flex-1 relative min-h-0">
          <Enhanced3DViewer
            roomType={roomType as any}
            floorTile={floorTile}
            wallTile={wallTile}
            activeSurface={activeSurface}
            onSurfaceChange={setActiveSurface}
          />

          {isMobile && (
            <button
              onClick={() => setShowMobileControls(!showMobileControls)}
              className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-blue-600 hover:bg-blue-700 text-white px-2.5 py-1 rounded-full shadow-lg flex items-center gap-1 z-10 text-[10px]"
            >
              <Eye className="w-3 h-3" />
              {showMobileControls ? 'Hide' : 'Show'}
              {showMobileControls ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />}
            </button>
          )}
        </div>

        {/* Control Panel */}
        <aside className={`lg:w-72 xl:w-80 bg-gray-800/95 backdrop-blur-sm overflow-y-auto transition-all border-t lg:border-t-0 lg:border-l border-gray-700 flex-shrink-0 ${
          isMobile && !showMobileControls ? 'max-h-0 opacity-0' : 'max-h-[40vh] lg:max-h-full opacity-100'
        }`}>
          <div className="p-2.5 sm:p-3 space-y-2.5">
            
            {/* Floor Section */}
            <section className="bg-gray-900/50 rounded-lg p-2 border-2 border-blue-500/30">
              <button
                onClick={() => toggleSection('floor')}
                className="w-full flex items-center justify-between mb-1.5 lg:cursor-default"
              >
                <h3 className="text-white font-bold text-[11px] flex items-center gap-1">
                  <Package className="w-3 h-3 text-blue-400" />
                  Floor Tile
                </h3>
                {isMobile && (expandedSection === 'floor' ? <ChevronUp className="w-3.5 h-3.5 text-gray-400" /> : <ChevronDown className="w-3.5 h-3.5 text-gray-400" />)}
              </button>

              <div className={`space-y-1.5 ${isMobile && expandedSection !== 'floor' ? 'hidden' : 'block'}`}>
                <div className="bg-gray-800 rounded p-1.5 border border-gray-700">
                  <div className="flex items-center gap-1.5">
                    <img src={tile.imageUrl} alt={tile.name} className="w-10 h-10 object-cover rounded ring-2 ring-blue-500/50" />
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-medium text-[10px] truncate">{tile.name}</p>
                      <p className="text-gray-400 text-[9px]">{tile.size}</p>
                      {(tile.tileSurface || tile.tileMaterial) && (
                        <div className="flex flex-wrap gap-0.5 mt-0.5">
                          {tile.tileSurface && (
                            <span className="bg-blue-500/20 text-blue-300 px-1 py-0.5 rounded text-[8px]">
                              {tile.tileSurface}
                            </span>
                          )}
                          {tile.tileMaterial && (
                            <span className="bg-purple-500/20 text-purple-300 px-1 py-0.5 rounded text-[8px]">
                              {tile.tileMaterial}
                            </span>
                          )}
                        </div>
                      )}
                      <p className="text-green-400 text-[9px] mt-0.5 flex items-center gap-0.5">
                        <CheckCircle className="w-2 h-2" />
                        Applied from QR
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Wall Section */}
            {isKitchenOrBathroom && (
              <section className="bg-gray-900/50 rounded-lg p-2 border-2 border-purple-500/30">
                <button
                  onClick={() => toggleSection('wall')}
                  className="w-full flex items-center justify-between mb-1.5 lg:cursor-default"
                >
                  <h3 className="text-white font-bold text-[11px] flex items-center gap-1">
                    <Package className="w-3 h-3 text-purple-400" />
                    Wall Tile
                  </h3>
                  {isMobile && (expandedSection === 'wall' ? <ChevronUp className="w-3.5 h-3.5 text-gray-400" /> : <ChevronDown className="w-3.5 h-3.5 text-gray-400" />)}
                </button>

                <div className={`space-y-1.5 ${isMobile && expandedSection !== 'wall' ? 'hidden' : 'block'}`}>
                  
                  <div>
                    <label className="text-white text-[9px] font-medium mb-1 block">Input Method:</label>
                    <div className="grid grid-cols-2 gap-1">
                      <button
                        onClick={() => setWallTileInputMethod('qr')}
                        className={`flex items-center justify-center gap-0.5 px-1.5 py-1 rounded text-[9px] font-medium transition-all ${
                          wallTileInputMethod === 'qr' ? 'bg-purple-600 text-white ring-1 ring-purple-400' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        }`}
                      >
                        <Scan className="w-2.5 h-2.5" />
                        QR Scan
                      </button>
                      <button
                        onClick={() => setWallTileInputMethod('upload')}
                        className={`flex items-center justify-center gap-0.5 px-1.5 py-1 rounded text-[9px] font-medium transition-all ${
                          wallTileInputMethod === 'upload' ? 'bg-purple-600 text-white ring-1 ring-purple-400' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        }`}
                      >
                        <Upload className="w-2.5 h-2.5" />
                        Upload
                      </button>
                    </div>
                  </div>

                  {wallTileInputMethod === 'qr' && (
                    <div className="space-y-1.5">
                      {wallTile.texture ? (
                        <div className="bg-gray-800 rounded p-1.5 border border-gray-700">
                          <img src={wallTile.texture} alt="Wall Tile" className="w-full h-20 object-cover rounded mb-1 ring-2 ring-purple-500/50" />
                          <p className="text-green-400 text-[9px] flex items-center gap-0.5 mb-1">
                            <CheckCircle className="w-2 h-2" />
                            Wall tile applied from QR
                          </p>
                          <button
                            onClick={() => setShowWallScanner(true)}
                            className="w-full bg-purple-600 text-white py-1 rounded text-[9px] font-medium hover:bg-purple-700 transition-colors"
                          >
                            Scan Different Wall Tile
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setShowWallScanner(true)}
                          disabled={scannerLoading}
                          className="w-full bg-purple-600 text-white py-1.5 rounded font-semibold hover:bg-purple-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-1 text-[10px]"
                        >
                          {scannerLoading ? (
                            <>
                              <Loader className="w-3 h-3 animate-spin" />
                              Loading...
                            </>
                          ) : (
                            <>
                              <Scan className="w-3 h-3" />
                              Scan Wall Tile QR Code
                            </>
                          )}
                        </button>
                      )}

                      <div className="bg-purple-900/30 rounded p-1.5 border border-purple-500/30">
                        <p className="text-purple-200 text-[9px] flex items-start gap-1">
                          <Info className="w-2.5 h-2.5 flex-shrink-0 mt-0.5" />
                          <span><strong>Tip:</strong> Scan QR code from another tile</span>
                        </p>
                      </div>
                    </div>
                  )}

                  {wallTileInputMethod === 'upload' && (
                    <div className="space-y-1.5">
                      <ImageUpload
                        currentImage={wallTile.texture}
                        onImageUploaded={(url) => {
                          setWallTile({ ...wallTile, texture: url });
                          setSuccess('Wall tile uploaded!');
                        }}
                        placeholder="Upload wall tile"
                        folder="wall-tiles"
                      />
                      <div className="bg-blue-900/30 rounded p-1.5 border border-blue-500/30">
                        <p className="text-blue-200 text-[9px] flex items-start gap-1">
                          <Info className="w-2.5 h-2.5 flex-shrink-0 mt-0.5" />
                          <span>Upload your own wall tile image</span>
                        </p>
                      </div>
                    </div>
                  )}

                  {wallTile.texture && (
                    <div>
                      <label className="text-white text-[9px] font-medium mb-1 block">Wall Tile Size:</label>
                      <div className="grid grid-cols-3 gap-0.5">
                        {WALL_SIZES.map((size) => (
                          <button
                            key={size.label}
                            onClick={() => setWallTile({ ...wallTile, size })}
                            className={`px-1.5 py-0.5 rounded text-[9px] font-medium transition-all ${
                              wallTile.size.width === size.width && wallTile.size.height === size.height
                                ? 'bg-purple-600 text-white ring-1 ring-purple-400'
                                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                            }`}
                          >
                            {size.label}
                          </button>
                        ))}
                      </div>
                      <p className="text-gray-400 text-[9px] mt-0.5">
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
                <label className="block text-white font-semibold mb-1 text-[10px]">View Mode:</label>
                <div className="grid grid-cols-3 gap-1">
                  <button
                    onClick={() => setActiveSurface('floor')}
                    className={`px-1.5 py-1 rounded font-medium transition-all text-[9px] ${
                      activeSurface === 'floor' ? 'bg-blue-600 text-white ring-1 ring-blue-400' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    Floor
                  </button>
                  <button
                    onClick={() => setActiveSurface('wall')}
                    className={`px-1.5 py-1 rounded font-medium transition-all text-[9px] ${
                      activeSurface === 'wall' ? 'bg-purple-600 text-white ring-1 ring-purple-400' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    Wall
                  </button>
                  <button
                    onClick={() => setActiveSurface('both')}
                    className={`px-1.5 py-1 rounded font-medium transition-all text-[9px] ${
                      activeSurface === 'both' ? 'bg-green-600 text-white ring-1 ring-green-400' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    Both
                  </button>
                </div>
              </section>
            )}

            {/* Info */}
            <div className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 rounded-lg p-2 border border-blue-500/30">
              <h4 className="text-white font-semibold mb-1 flex items-center gap-1 text-[10px]">
                <Scan className="w-2.5 h-2.5" />
                Dual Tile Feature
              </h4>
              <ul className="space-y-0.5 text-[9px] text-gray-300">
                <li className="flex items-start gap-1">
                  <span className="text-green-400 flex-shrink-0">✓</span>
                  <span>Floor tile from first QR scan</span>
                </li>
                <li className="flex items-start gap-1">
                  <span className="text-purple-400 flex-shrink-0">🎨</span>
                  <span>Wall tile: QR scan OR upload</span>
                </li>
                <li className="flex items-start gap-1">
                  <span className="text-blue-400 flex-shrink-0">📏</span>
                  <span>Different sizes for each surface</span>
                </li>
                <li className="flex items-start gap-1">
                  <span className="text-yellow-400 flex-shrink-0">👁️</span>
                  <span>Real-time 3D preview</span>
                </li>
              </ul>
            </div>

          </div>
        </aside>
      </div>

      {showWallScanner && (
        <QRScanner
          onScanSuccess={async (data) => {
            if (data.tileId) {
              setShowWallScanner(false);
              await loadWallTileFromQR(data.tileId);
            } else {
              setError('Invalid QR code');
            }
          }}
          onClose={() => setShowWallScanner(false)}
        />
      )}
    </div>
  );
};