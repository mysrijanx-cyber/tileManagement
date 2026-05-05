
import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import {
  ArrowLeft, Share2, Loader, Scan,
  Package, AlertCircle, CheckCircle, X, Info,
  ChevronDown, ChevronUp, Eye, 
  Grid3x3, Settings, Shuffle, Highlighter, Upload, QrCode, Image as ImageIcon, Calculator
} from 'lucide-react';
import { Enhanced3DViewer } from '../components/Enhanced3DViewer';
import { QRScanner } from '../components/QRScanner';
import { ImageUpload } from '../components/ImageUpload';
import { RoomDimensionModal } from '../components/RoomDimensionModal';
import { UniversalTileCalculator } from '../components/TileCalculatorModal';
import { getTileById, trackQRScan, saveCustomerInquiry } from '../lib/firebaseutils';
import { Tile } from '../types';
import { auth, db } from '../lib/firebase';
import { CustomerInquiryForm } from '../components/CustomerInquiryForm';
import { getDoc, doc, collection, query, where, getDocs } from 'firebase/firestore';
import { getCustomerFromSession, isSessionValid } from '../utils/customerSession';
import {
  getCalculationDimensions,
  saveCalculationDimensions,
} from '../utils/dimensionHelpers';
import { calculateTiles } from '../utils/tileCalculations';

// ═══════════════════════════════════════════════════════════════
// TYPESCRIPT INTERFACES
// ═══════════════════════════════════════════════════════════════

interface TileSize {
  width: number;
  height: number;
  label: string;
}

interface TileState {
  texture: string;
  size: { width: number; height: number };
  sellerId?: string;
  tileName?: string;
  tileId?: string;
  source?: 'qr' | 'upload' | 'initial';
}

interface VerifiedUserData {
  uid: string;
  email: string | null;
  role: string;
  seller_id?: string;
  user_id?: string;
}

interface RoomDimensions {
  width: number;
  depth: number;
  height: number;
}

type WallType = 'back' | 'front' | 'left' | 'right';

interface HighlighterBreakdown {
  wall_5ft_base: number;
  wall_5ft_highlighter: number;
  wall_8ft_base: number;
  wall_8ft_highlighter: number;
  wall_11ft_base: number;
  wall_11ft_highlighter: number;
}

interface TileCount {
  floor: number;
  wall_5ft: number;
  wall_8ft: number;
  wall_11ft: number;
  perimeter: number;
  tileAreaSqFt: number;
  roomAreaSqFt: number;
}

interface BorderInfo {
  floor: { rows: number; cols: number; total: number } | null;
  wall: { 
    base: { rows: number; cols: number; total: number };
    highlighter: { rows: number; cols: number; total: number };
  } | null;
}

// ═══════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════

const ROOM_CONFIGS = {
  drawing: {
    width: 20 * 0.3048,
    depth: 20 * 0.3048,
    height: 11 * 0.3048
  },
  kitchen: {
    width: 25 * 0.3048,
    depth: 25 * 0.3048,
    height: 11 * 0.3048
  },
  bathroom: {
    width: 15 * 0.3048,
    depth: 15 * 0.3048,
    height: 11 * 0.3048
  }
} as const;

const ROOM_STATE_EXPIRY = 60 * 60 * 1000;

const FLOOR_TILE_SIZES: TileSize[] = [
  { width: 60, height: 60, label: '60×60' },
  { width: 80, height: 80, label: '80×80' },
  { width: 60, height: 120, label: '60×120' },
  { width: 100, height: 100, label: '100×100' },
  { width: 40, height: 40, label: '40×40' },
  { width: 30, height: 30, label: '30×30' }
];

// ═══════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════

const parseTileSize = (sizeStr: string, type: 'floor' | 'wall'): { width: number; height: number } => {
  const defaultFloor = { width: 60, height: 60 };
  const defaultWall = { width: 30, height: 45 };

  if (!sizeStr || typeof sizeStr !== 'string') {
    console.warn(`⚠️ Invalid tile size input: "${sizeStr}", using default`);
    return type === 'floor' ? defaultFloor : defaultWall;
  }

  try {
    let cleanSize = sizeStr
      .toLowerCase()
      .replace(/\scm\s/gi, '')
      .replace(/\sft\s/gi, '')
      .replace(/\s+/g, '')
      .trim();

    const parts = cleanSize.split(/[x×X]/);

    if (parts.length === 2) {
      const width = parseFloat(parts[0]);
      const height = parseFloat(parts[1]);
      
      if (!isNaN(width) && !isNaN(height) && width > 0 && height > 0) {
        console.log(`✅ Parsed tile size: "${sizeStr}" → ${width}×${height} cm`);
        return { width, height };
      }
    }
  } catch (e) {
    console.error(`❌ Error parsing tile size "${sizeStr}":`, e);
  }

  console.warn(`⚠️ Using default ${type} tile size for: "${sizeStr}"`);
  return type === 'floor' ? defaultFloor : defaultWall;
};

// ═══════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════

export const Room3DViewPage: React.FC = () => {
  const { tileId, roomType } = useParams<{ tileId: string; roomType: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const viewMode = (searchParams.get('mode') as 'view' | 'highlighter') || 'view';

  console.log('🎯 Current Room Mode:', viewMode);

  // ═════════════════════════════════════════════════════════════
  // STATE MANAGEMENT
  // ═════════════════════════════════════════════════════════════

  const [verifiedUser, setVerifiedUser] = useState<VerifiedUserData | null>(null);
  const [tile, setTile] = useState<Tile | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeSurface, setActiveSurface] = useState<'floor' | 'wall' | 'both'>('both');
  const [showInquiryForm, setShowInquiryForm] = useState(false);
  const [inquiryFormData, setInquiryFormData] = useState<any>(null);

  const [calculationDims, setCalculationDims] = useState<RoomDimensions | null>(null);
  const [showCalculationDimEditor, setShowCalculationDimEditor] = useState(false);
  const [showTileCalculator, setShowTileCalculator] = useState(false);
  const [tileCount, setTileCount] = useState<TileCount | null>(null);

  const [highlighterTileIndices, setHighlighterTileIndices] = useState<{
    back: Set<number>;
    front: Set<number>;
    left: Set<number>;
    right: Set<number>;
  }>({
    back: new Set(),
    front: new Set(),
    left: new Set(),
    right: new Set()
  });

  const [highlighterBreakdown, setHighlighterBreakdown] = useState<HighlighterBreakdown | null>(null);
  const [highlightTileBorders, setHighlightTileBorders] = useState(false);
  
  const [borderInfo, setBorderInfo] = useState<BorderInfo>({
    floor: null,
    wall: null
  });

  const [dimsVersion, setDimsVersion] = useState(0);
  const [showWallScanner, setShowWallScanner] = useState(false);
  const [scannerLoading, setScannerLoading] = useState(false);

  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [showMobileControls, setShowMobileControls] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [expandedSection, setExpandedSection] = useState<'floor' | 'wall' | 'calculator' | 'borders' | 'actions' | null>('floor');
  const [showDimensionEditor, setShowDimensionEditor] = useState(false);

  const wallTileHeight = 11;

  // Floor tile change states
  const [showFloorChangeModal, setShowFloorChangeModal] = useState(false);
  const [floorChangeMethod, setFloorChangeMethod] = useState<'upload' | 'qr'>('qr');
  const [showFloorQRScanner, setShowFloorQRScanner] = useState(false);
  const [tempFloorTileSize, setTempFloorTileSize] = useState<{ width: number; height: number }>({ width: 60, height: 60 });
  const [viewerKey, setViewerKey] = useState(0);

  // Sidebar action states
  const [triggerAddHighlighter, setTriggerAddHighlighter] = useState(false);
  const [triggerRandomPattern, setTriggerRandomPattern] = useState(false);
  const [triggerShufflePattern, setTriggerShufflePattern] = useState(false);

  const [floorTile, setFloorTile] = useState<TileState>({
    texture: '',
    size: { width: 60, height: 60 },
    sellerId: undefined,
    tileName: undefined,
    tileId: undefined,
    source: undefined
  });

  const [wallTile, setWallTile] = useState<TileState>({
    texture: '',
    size: { width: 30, height: 45 },
    sellerId: undefined,
    tileName: undefined,
    tileId: undefined,
    source: undefined
  });

  // ═════════════════════════════════════════════════════════════
  // HELPER FUNCTIONS (CALLBACKS)
  // ═════════════════════════════════════════════════════════════

  const getCurrentDimensions = useCallback((): RoomDimensions | null => {
    try {
      const stored = localStorage.getItem(`room_dimensions_${roomType}`);
      if (!stored) return null;

      const data = JSON.parse(stored);
      return {
        width: data.width,
        depth: data.depth,
        height: data.height
      };
    } catch (err) {
      console.warn('⚠️ Failed to get dimensions:', err);
      return null;
    }
  }, [roomType]);

  const getWallDimensions = useCallback((wall: WallType, customWallHeight?: number) => {
    const dims = calculationDims || getCalculationDimensions(roomType || 'kitchen');
    
    console.log(`📐 [Room3DViewPage] getWallDimensions(${wall}, ${customWallHeight}ft):`, dims);
    
    const roomMeters = {
      width: dims.width * 0.3048,
      depth: dims.depth * 0.3048,
      height: dims.height * 0.3048
    };
    
    const wallTileSize = wallTile.size || { width: 30, height: 45 };
    
    const tileWidthFt = wallTileSize.width * 0.0328084;
    const tileHeightFt = wallTileSize.height * 0.0328084;
    
    const heightInFeet = customWallHeight || (roomMeters.height / 0.3048);
    
    const wallWidthFeet = (wall === 'back' || wall === 'front') 
      ? (roomMeters.width / 0.3048) 
      : (roomMeters.depth / 0.3048);
    
    const cols = Math.ceil(wallWidthFeet / tileWidthFt);
    const rows = Math.ceil(heightInFeet / tileHeightFt);
    
    console.log(`   ✅ [Room3DViewPage] ${wall}: ${cols}×${rows} = ${cols * rows} tiles @ ${heightInFeet.toFixed(1)}ft`);
    
    return { cols, rows };
    
  }, [calculationDims, roomType, wallTile.size]);

  const calculateHighlighterBreakdown = useCallback((): HighlighterBreakdown | null => {
    if (!wallTile.texture || !tileCount) return null;

    const isKitchenOrBathroom = roomType === 'kitchen' || roomType === 'bathroom';
    if (!isKitchenOrBathroom) return null;

    let dims = getCurrentDimensions();
    if (!dims) {
      const defaultConfig = ROOM_CONFIGS[roomType as keyof typeof ROOM_CONFIGS];
      if (!defaultConfig) return null;
      dims = {
        width: defaultConfig.width / 0.3048,
        depth: defaultConfig.depth / 0.3048,
        height: defaultConfig.height / 0.3048
      };
    }

    const perimeter = roomType === 'kitchen' 
      ? dims.width 
      : 2 * (dims.width + dims.depth);

    const tileWidthFt = wallTile.size.width * 0.0328084;
    const tileHeightFt = wallTile.size.height * 0.0328084;
    const tileAreaSqFt = tileWidthFt * tileHeightFt;

    const wastageMultiplier = 1.08;

    const breakdown: HighlighterBreakdown = {
      wall_5ft_base: 0,
      wall_5ft_highlighter: 0,
      wall_8ft_base: 0,
      wall_8ft_highlighter: 0,
      wall_11ft_base: 0,
      wall_11ft_highlighter: 0
    };

    const walls: WallType[] = roomType === 'kitchen' ? ['back'] : ['back', 'front', 'left', 'right'];

    [5, 8, 11].forEach(heightFt => {
      const wallArea = perimeter * heightFt;
      const totalTilesNeeded = Math.ceil(wallArea / tileAreaSqFt);
      
      let highlighterCount = 0;
      
      walls.forEach(wall => {
        const highlighterSet = highlighterTileIndices[wall];
        
        if (highlighterSet && highlighterSet.size > 0) {
          const wallDims = getWallDimensions(wall, heightFt);
          const maxTilesForThisHeight = wallDims.cols * wallDims.rows;
          
          highlighterSet.forEach(index => {
            if (index <= maxTilesForThisHeight) {
              highlighterCount++;
            }
          });
        }
      });
      
      const baseTiles = totalTilesNeeded - highlighterCount;
      
      breakdown[`wall_${heightFt}ft_base` as keyof HighlighterBreakdown] = Math.ceil(baseTiles * wastageMultiplier);
      breakdown[`wall_${heightFt}ft_highlighter` as keyof HighlighterBreakdown] = Math.ceil(highlighterCount * wastageMultiplier);
    });

    return breakdown;
  }, [wallTile.texture, wallTile.size, tileCount, roomType, highlighterTileIndices, getWallDimensions, getCurrentDimensions]);

  const validateSellerConsistency = useCallback((wallSellerId: string): { valid: boolean; error?: string | null } => {
    if (!floorTile.sellerId) {
      return {
        valid: false,
        error: '❌ Floor Tile Not Set\n\nPlease scan floor tile first.\n\nWall tiles must match floor tile showroom.'
      };
    }

    if (wallSellerId !== floorTile.sellerId) {
      return {
        valid: false,
        error: `🚫 Seller Mismatch Detected\n\n` +
               `Floor Tile: "${floorTile.tileName}"\n` +
               `Showroom: ${floorTile.sellerId?.substring(0, 8)}...\n\n` +
               `Wall Tile: Different Showroom\n\n` +
               `❌ Cannot mix tiles from different showrooms.`
      };
    }

    return { valid: true };
  }, [floorTile.sellerId, floorTile.tileName]);

  const saveRoomState = useCallback(() => {
    if (!tileId || !roomType) return;

    try {
      const roomStateKey = `room_state_${tileId}_${roomType}`;
      const state = {
        floorTile,
        wallTile,
        activeSurface,
        wallTileHeight,
        highlighterTileIndices: {
          back: Array.from(highlighterTileIndices.back),
          front: Array.from(highlighterTileIndices.front),
          left: Array.from(highlighterTileIndices.left),
          right: Array.from(highlighterTileIndices.right)
        },
        timestamp: Date.now()
      };
      localStorage.setItem(roomStateKey, JSON.stringify(state));
      console.log('💾 Room state saved');
    } catch (err) {
      console.warn('⚠️ Failed to save room state:', err);
    }
  }, [tileId, roomType, floorTile, wallTile, activeSurface, wallTileHeight, highlighterTileIndices]);

  const restoreRoomState = useCallback((): boolean => {
    if (!tileId || !roomType) return false;

    try {
      const roomStateKey = `room_state_${tileId}_${roomType}`;
      const saved = localStorage.getItem(roomStateKey);
      
      if (!saved) return false;

      const state = JSON.parse(saved);
      const age = Date.now() - state.timestamp;
      
      if (age < ROOM_STATE_EXPIRY) {
        setFloorTile(state.floorTile);
        setWallTile(state.wallTile);
        setActiveSurface(state.activeSurface);
        
        if (state.highlighterTileIndices) {
          setHighlighterTileIndices({
            back: new Set(state.highlighterTileIndices.back || []),
            front: new Set(state.highlighterTileIndices.front || []),
            left: new Set(state.highlighterTileIndices.left || []),
            right: new Set(state.highlighterTileIndices.right || [])
          });
        }
        
        console.log('✅ Room state restored');
        return true;
      } else {
        localStorage.removeItem(roomStateKey);
        return false;
      }
    } catch (err) {
      console.warn('⚠️ Failed to restore room state:', err);
      return false;
    }
  }, [tileId, roomType]);

  const handleDimensionUpdate = useCallback((width: number, depth: number, height: number) => {
    const dimensionData = {
      width,
      depth,
      height,
      timestamp: Date.now()
    };

    try {
      localStorage.setItem(`room_dimensions_${roomType}`, JSON.stringify(dimensionData));
      setShowDimensionEditor(false);
      
      if (navigator.vibrate) {
        navigator.vibrate([50, 30, 50]);
      }
      
      setSuccess(`✅ Room dimensions updated to ${width}' × ${depth}' × ${height}'`);
      
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (err) {
      console.error('❌ Failed to save dimensions:', err);
      setError('Failed to save room dimensions');
    }
  }, [roomType]);

  const handleCalculationDimensionUpdate = useCallback((width: number, depth: number, height: number) => {
    const newDims = { width, depth, height };

    console.log('💾 SAVING CALCULATION DIMENSIONS:', {
      roomType,
      newDimensions: newDims,
      oldDimensions: calculationDims,
      timestamp: new Date().toISOString()
    });

    const saved = saveCalculationDimensions(roomType || 'kitchen', newDims);

    if (saved) {
      setCalculationDims({ ...newDims });

      setDimsVersion(prev => {
        const newVersion = prev + 1;
        console.log('🔄 Dimensions version updated:', newVersion);
        return newVersion;
      });

      setShowCalculationDimEditor(false);

      if (navigator.vibrate) {
        navigator.vibrate([50, 30, 50]);
      }

      setSuccess(
        `✅ Calculation dimensions updated!\n` +
        `New size: ${width}' × ${depth}' × ${height}'\n` +
        `Tile counts will recalculate automatically.`
      );

      console.log('✅ Dimensions saved, state updated, version incremented');

      setTimeout(() => {
        const verify = getCalculationDimensions(roomType || 'kitchen');
        console.log('🔍 Verification check:', {
          savedDimensions: verify,
          matchesInput: verify.width === width && verify.depth === depth && verify.height === height
        });
      }, 100);
    } else {
      setError('Failed to save calculation dimensions');
      console.error('❌ Failed to save dimensions to localStorage');
    }
  }, [roomType, calculationDims]);

  const handleShare = useCallback(async () => {
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
  }, [tile?.name, roomType]);

  const toggleSection = useCallback((section: 'floor' | 'wall' | 'calculator' | 'borders' | 'actions') => {
    setExpandedSection(expandedSection === section ? null : section);
  }, [expandedSection]);

  // ═════════════════════════════════════════════════════════════
  // FLOOR TILE CHANGE HANDLERS
  // ═════════════════════════════════════════════════════════════

  const handleFloorTileUpload = useCallback((imageUrl: string) => {
    console.log('📸 Floor tile image uploaded:', imageUrl);
    
    const newFloorTile: TileState = {
      texture: imageUrl,
      size: { ...tempFloorTileSize },
      sellerId: floorTile.sellerId || undefined,
      tileName: 'Custom Floor Tile',
      tileId: undefined,
      source: 'upload'
    };

    console.log('🔄 Setting new floor tile state:', newFloorTile);
    
    setFloorTile(newFloorTile);
    setViewerKey(prev => prev + 1);
    setShowFloorChangeModal(false);
    
    setSuccess(`✅ Floor tile changed!\n📏 Size: ${tempFloorTileSize.width}×${tempFloorTileSize.height}cm`);
    
    if (navigator.vibrate) {
      navigator.vibrate([100, 50, 100]);
    }
    
    setTimeout(() => {
      saveRoomState();
    }, 100);
    
  }, [tempFloorTileSize, floorTile.sellerId, saveRoomState]);

  const handleFloorTileQRScan = useCallback(async (floorTileId: string) => {
    try {
      setScannerLoading(true);
      setError(null);

      console.log('🔍 Loading floor tile from QR:', floorTileId);

      const floorTileData = await getTileById(floorTileId);

      if (!floorTileData) {
        setError('Floor tile not found in database');
        setScannerLoading(false);
        return;
      }

      const sessionKey = `floor_qr_tracked_${floorTileId}`;
      const sessionTracked = sessionStorage.getItem(sessionKey);
      
      if (!sessionTracked || (Date.now() - parseInt(sessionTracked)) > 5 * 60 * 1000) {
        await trackQRScan(floorTileId, {
          sellerId: floorTileData.sellerId,
          showroomId: floorTileData.showroomId
        });
        sessionStorage.setItem(sessionKey, Date.now().toString());
      }

      const parsedSize = parseTileSize(floorTileData.size, 'floor');

      const newFloorTile: TileState = {
        texture: floorTileData.textureUrl || floorTileData.imageUrl,
        size: { ...parsedSize },
        sellerId: floorTileData.sellerId,
        tileName: floorTileData.name,
        tileId: floorTileData.id,
        source: 'qr'
      };

      console.log('🔄 Setting new floor tile from QR:', newFloorTile);

      setFloorTile(newFloorTile);
      setViewerKey(prev => prev + 1);

      setShowFloorQRScanner(false);
      setShowFloorChangeModal(false);
      setSuccess(`✅ Floor tile changed to: ${floorTileData.name}\n📏 Size: ${parsedSize.width}×${parsedSize.height}cm`);
      
      if (navigator.vibrate) {
        navigator.vibrate([100, 50, 100]);
      }
      
      setTimeout(() => {
        saveRoomState();
      }, 100);

    } catch (err: any) {
      console.error('❌ Floor tile QR error:', err);
      setError('Failed to load floor tile. Please try again.');
    } finally {
      setScannerLoading(false);
    }
  }, [saveRoomState]);

  const loadWallTileFromQR = useCallback(async (wallTileId: string) => {
    try {
      setScannerLoading(true);
      setError(null);

      if (!floorTile.sellerId) {
        setScannerLoading(false);
        setError(
          '❌ Floor Tile Required\n\n' +
          'Please scan floor tile first before adding wall tile.\n\n' +
          'Wall tiles must be from the same showroom as floor tile.'
        );
        
        if (navigator.vibrate) {
          navigator.vibrate([200, 100, 200]);
        }
        
        return;
      }

      const wallTileData = await getTileById(wallTileId);

      if (!wallTileData) {
        setScannerLoading(false);
        setError('Wall tile not found in database');
        return;
      }

      const wallSellerId = wallTileData.sellerId;

      const validation = validateSellerConsistency(wallSellerId);
      
      if (!validation.valid) {
        setScannerLoading(false);
        setError(validation.error ?? null);
        
        if (navigator.vibrate) {
          navigator.vibrate([200, 100, 200, 100, 200]);
        }
        
        return;
      }

      const sessionKey = `wall_qr_tracked_${wallTileId}`;
      const sessionTracked = sessionStorage.getItem(sessionKey);
      
      if (!sessionTracked || (Date.now() - parseInt(sessionTracked)) > 5 * 60 * 1000) {
        await trackQRScan(wallTileId, {
          sellerId: wallSellerId,
          showroomId: wallTileData.showroomId
        });
        sessionStorage.setItem(sessionKey, Date.now().toString());
      }

      const parsedWallSize = parseTileSize(wallTileData.size, 'wall');

      setWallTile({
        texture: wallTileData.textureUrl || wallTileData.imageUrl,
        size: parsedWallSize,
        sellerId: wallSellerId,
        tileName: wallTileData.name,
        tileId: wallTileData.id,
        source: 'qr'
      });

      setSuccess(`✅ Wall tile: ${wallTileData.name}\n📏 Size: ${parsedWallSize.width}×${parsedWallSize.height}cm`);
      
      if (navigator.vibrate) {
        navigator.vibrate(200);
      }
      
    } catch (err: any) {
      console.error('❌ Wall tile QR error:', err);
      setScannerLoading(false);
      setError('Failed to load wall tile. Please try again.');
    } finally {
      setScannerLoading(false);
    }
  }, [floorTile.sellerId, validateSellerConsistency]);

  // ═════════════════════════════════════════════════════════════
  // EFFECTS
  // ═════════════════════════════════════════════════════════════

  useEffect(() => {
    const dims = getCalculationDimensions(roomType || 'kitchen');
    setCalculationDims(dims);
    console.log('📐 Loaded calculation dimensions:', {
      roomType,
      dimensions: dims,
      version: dimsVersion
    });
  }, [roomType, dimsVersion]);

  useEffect(() => {
    console.log('🔄 TILE CALCULATION TRIGGERED:', {
      hasCalculationDims: !!calculationDims,
      hasFloorTileSize: !!floorTile.size,
      floorTileSize: floorTile.size,
      wallTileSize: wallTile.size,
      roomType,
      dimsVersion
    });

    if (!calculationDims) {
      console.warn('⚠️ No calculation dimensions available, skipping calculation');
      return;
    }

    if (!floorTile.size || floorTile.size.width <= 0 || floorTile.size.height <= 0) {
      console.warn('⚠️ Invalid floor tile size, skipping calculation');
      return;
    }

    console.log('✅ Proceeding with tile calculation for dimensions:', calculationDims);

    const floorResult = calculateTiles({
      roomWidth: calculationDims.width,
      roomDepth: calculationDims.depth,
      roomHeight: calculationDims.height,
      tileWidthCm: floorTile.size.width,
      tileHeightCm: floorTile.size.height,
      roomType: roomType as any
    });

    console.log('📊 Floor calculation result:', floorResult);

    let wallData = {
      wall_5ft: 0,
      wall_8ft: 0,
      wall_11ft: 0,
      perimeter: 0
    };

    if (wallTile.texture &&
        wallTile.size &&
        wallTile.size.width > 0 &&
        wallTile.size.height > 0 &&
        (roomType === 'kitchen' || roomType === 'bathroom')) {

      console.log('🧱 Calculating wall tiles...');

      const wallResult = calculateTiles({
        roomWidth: calculationDims.width,
        roomDepth: calculationDims.depth,
        roomHeight: calculationDims.height,
        tileWidthCm: wallTile.size.width,
        tileHeightCm: wallTile.size.height,
        roomType: roomType as any
      });

      wallData = {
        wall_5ft: wallResult.wall_5ft,
        wall_8ft: wallResult.wall_8ft,
        wall_11ft: wallResult.wall_11ft,
        perimeter: wallResult.perimeter
      };

      console.log('📊 Wall calculation result:', wallData);
    }

    const newTileCount = {
      floor: floorResult.floor,
      wall_5ft: wallData.wall_5ft,
      wall_8ft: wallData.wall_8ft,
      wall_11ft: wallData.wall_11ft,
      perimeter: wallData.perimeter,
      tileAreaSqFt: floorResult.tileAreaSqFt,
      roomAreaSqFt: floorResult.roomAreaSqFt
    };

    setTileCount(newTileCount);

    console.log('✅ TILE COUNT STATE UPDATED:', {
      floor: newTileCount.floor,
      wall_5ft: newTileCount.wall_5ft,
      wall_8ft: newTileCount.wall_8ft,
      wall_11ft: newTileCount.wall_11ft,
      dimensions: `${calculationDims.width}×${calculationDims.depth}×${calculationDims.height}`,
      version: dimsVersion
    });

  }, [calculationDims, floorTile.size, wallTile.size, wallTile.texture, roomType, dimsVersion]);

  useEffect(() => {
    if (!highlightTileBorders) {
      setBorderInfo({ floor: null, wall: null });
      return;
    }

    if (floorTile.size && calculationDims) {
      const tileSizeM = {
        width: floorTile.size.width / 100,
        height: floorTile.size.height / 100
      };
      
      const cols = Math.ceil((calculationDims.width * 0.3048) / tileSizeM.width);
      const rows = Math.ceil((calculationDims.depth * 0.3048) / tileSizeM.height);
      
      setBorderInfo(prev => ({
        ...prev,
        floor: { rows, cols, total: rows * cols }
      }));

      console.log('📊 Floor border grid:', { cols, rows, total: cols * rows });
    }

    const isKitchenOrBathroom = roomType === 'kitchen' || roomType === 'bathroom';
    if (wallTile.size && calculationDims && isKitchenOrBathroom) {
      
      const totalHighlighterTiles = 
        highlighterTileIndices.back.size +
        highlighterTileIndices.front.size +
        highlighterTileIndices.left.size +
        highlighterTileIndices.right.size;
      
      const hasHighlighterTiles = totalHighlighterTiles > 0;
      
      const roomMeters = {
        width: calculationDims.width * 0.3048,
        depth: calculationDims.depth * 0.3048,
        height: calculationDims.height * 0.3048
      };
      
      if (hasHighlighterTiles) {
        const HIGHLIGHTER_TILE_SIZE = 0.30;
        const wallWidth = roomMeters.width;
        const wallHeight = roomMeters.height;
        
        const highlighterCols = Math.ceil(wallWidth / HIGHLIGHTER_TILE_SIZE);
        const highlighterRows = Math.ceil(wallHeight / HIGHLIGHTER_TILE_SIZE);
        
        setBorderInfo(prev => ({
          ...prev,
          wall: {
            base: { rows: 0, cols: 0, total: 0 },
            highlighter: {
              rows: highlighterRows,
              cols: highlighterCols,
              total: highlighterRows * highlighterCols
            }
          }
        }));
        
        console.log(`🟢 Showing ONLY highlighter grid: ${highlighterCols}×${highlighterRows} (30×30cm)`);
        
      } else {
        const baseDims = getWallDimensions('back', 11);
        
        setBorderInfo(prev => ({
          ...prev,
          wall: {
            base: { 
              rows: baseDims.rows, 
              cols: baseDims.cols, 
              total: baseDims.rows * baseDims.cols 
            },
            highlighter: { rows: 0, cols: 0, total: 0 }
          }
        }));
        
        console.log(`🔴 Showing ONLY base grid: ${baseDims.cols}×${baseDims.rows} (${wallTile.size.width}×${wallTile.size.height}cm)`);
      }
    }

  }, [
    highlightTileBorders, 
    floorTile.size, 
    wallTile.size, 
    calculationDims, 
    roomType, 
    getWallDimensions,
    highlighterTileIndices
  ]);

  useEffect(() => {
    const breakdown = calculateHighlighterBreakdown();
    setHighlighterBreakdown(breakdown);
  }, [calculateHighlighterBreakdown]);

  useEffect(() => {
    const handleHighlighterUpdate = (event: CustomEvent) => {
      const { wall, indices } = event.detail;
      console.log('🎨 Highlighter update:', wall, indices.length);

      setHighlighterTileIndices(prev => ({
        ...prev,
        [wall]: new Set(indices)
      }));
    };

    window.addEventListener('highlighterUpdate' as any, handleHighlighterUpdate as any);

    return () => {
      window.removeEventListener('highlighterUpdate' as any, handleHighlighterUpdate as any);
    };
  }, []);

  useEffect(() => {
    const prepareVerifiedUser = async () => {
      const authUser = auth.currentUser;

      if (!authUser) {
        console.warn('⚠️ No Firebase auth user found');
        setVerifiedUser(null);
        return;
      }

      try {
        const userDoc = await getDoc(doc(db, 'users', authUser.uid));
        
        if (userDoc.exists()) {
          const userData = userDoc.data();
          
          const properUser: VerifiedUserData = {
            uid: authUser.uid,
            email: authUser.email || userData.email || null,
            role: userData.role || 'worker',
            seller_id: userData.seller_id,
            user_id: authUser.uid,
          };
          
          setVerifiedUser(properUser);
        }
      } catch (err) {
        console.error('❌ Error preparing verified user:', err);
        setVerifiedUser(null);
      }
    };

    prepareVerifiedUser();
  }, []);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
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

        const restored = restoreRoomState();
        if (restored) {
          setSuccess('✅ Previous room configuration restored');
          setLoading(false);
          return;
        }

        const currentAuthUser = auth.currentUser;
        
        if (currentAuthUser) {
          try {
            const userDoc = await getDoc(doc(db, 'users', currentAuthUser.uid));
            
            if (userDoc.exists()) {
              const userData = userDoc.data();
              
              if (userData.role === 'worker') {
                const existingSession = getCustomerFromSession();
                
                if (existingSession && isSessionValid()) {
                  const floorSellerId = tileData.sellerId;
                  const parsedSize = parseTileSize(tileData.size, 'floor');
                  
                  setFloorTile({
                    texture: tileData.textureUrl || tileData.imageUrl,
                    size: parsedSize,
                    sellerId: floorSellerId,
                    tileName: tileData.name,
                    tileId: tileData.id,
                    source: 'initial'
                  });
                  
                  setShowInquiryForm(false);
                  setLoading(false);
                  setSuccess(`✅ Showing for ${existingSession.name} | Tile: ${parsedSize.width}×${parsedSize.height}cm`);
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
                  workerId: currentAuthUser.uid,
                  workerEmail: currentAuthUser.email || userData.email,
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
        
        const floorSellerId = tileData.sellerId;
        const parsedSize = parseTileSize(tileData.size, 'floor');
        
        setFloorTile({
          texture: tileData.textureUrl || tileData.imageUrl,
          size: parsedSize,
          sellerId: floorSellerId,
          tileName: tileData.name,
          tileId: tileData.id,
          source: 'initial'
        });

      } catch (err) {
        console.error('❌ Error loading tile:', err);
        setError('Failed to load tile data');
        setTimeout(() => navigate('/'), 2000);
      } finally {
        setLoading(false);
      }
    };

    loadTileData();
  }, [tileId, navigate, restoreRoomState]);

  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        setSuccess(null);
        setError(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [success, error]);

  useEffect(() => {
    if (floorTile.sellerId || wallTile.sellerId) {
      saveRoomState();
    }
  }, [floorTile, wallTile, activeSurface, wallTileHeight, saveRoomState]);

  // ═════════════════════════════════════════════════════════════
  // EVENT HANDLERS
  // ═════════════════════════════════════════════════════════════

  const handleInquirySubmit = async (formData: any) => {
    try {
      setError(null);
      const result = await saveCustomerInquiry(formData);

      if (result.success) {
        setShowInquiryForm(false);
        setSuccess('✅ Customer details saved! Loading 3D view...');
        
        if (tile) {
          const floorSellerId = tile.sellerId;
          const parsedSize = parseTileSize(tile.size, 'floor');
          
          setFloorTile({
            texture: tile.textureUrl || tile.imageUrl,
            size: parsedSize,
            sellerId: floorSellerId,
            tileName: tile.name,
            tileId: tile.id,
            source: 'initial'
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

  // ═════════════════════════════════════════════════════════════
  // RENDER
  // ═════════════════════════════════════════════════════════════

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
  const currentDimensions = getCurrentDimensions();

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 overflow-hidden">

      {/* HEADER */}
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

          <button onClick={handleShare} className="p-1 text-white hover:bg-gray-700 rounded-lg transition-colors" title="Share">
            <Share2 className="w-4 h-4" />
          </button>
        </div>

        {wallTile.texture && isKitchenOrBathroom && (
          <div className="bg-purple-600/20 border-t border-purple-500/30 px-3 py-1.5">
            <div className="max-w-7xl mx-auto flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
              <p className="text-purple-200 text-[10px] font-medium">Wall Tile Applied</p>
            </div>
          </div>
        )}
      </header>

      {/* INQUIRY FORM MODAL */}
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

      {/* NOTIFICATIONS */}
      {success && (
        <div className="fixed top-12 left-1/2 transform -translate-x-1/2 z-50 max-w-md w-full mx-2.5 animate-slide-down">
          <div className="bg-green-500 text-white px-3 py-2 rounded-lg shadow-2xl flex items-center gap-2">
            <CheckCircle className="w-4 h-4 flex-shrink-0" />
            <p className="font-medium text-xs flex-1 whitespace-pre-line">{success}</p>
            <button onClick={() => setSuccess(null)} className="ml-auto p-0.5">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {error && (
        <div className="fixed top-12 left-1/2 transform -translate-x-1/2 z-50 max-w-md w-full mx-2.5 animate-slide-down">
          <div className="bg-red-500 text-white px-3 py-2 rounded-lg shadow-2xl flex items-start gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <p className="font-medium text-xs flex-1 whitespace-pre-line break-words">{error}</p>
            <button onClick={() => setError(null)} className="ml-auto p-0.5 flex-shrink-0">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        
        {/* 3D VIEWER */}
        <div className="flex-1 relative min-h-0">
          <Enhanced3DViewer
            key={viewerKey}
            roomType={roomType as any}
            floorTile={floorTile}
            wallTile={wallTile}
            activeSurface={activeSurface}
            onSurfaceChange={setActiveSurface}
            currentUser={verifiedUser ? {
              role: verifiedUser.role,
              user_id: verifiedUser.uid,
              seller_id: verifiedUser.seller_id,
            } : undefined}
            wallTileHeight={wallTileHeight}
            highlightTileBorders={highlightTileBorders}
            onHighlighterUpdate={(wall: WallType, indices: number[]) => {
              console.log('🎯 Highlighter update:', wall, indices.length);
              setHighlighterTileIndices(prev => ({
                ...prev,
                [wall]: new Set(indices)
              }));
            }}
            calculationDimensions={calculationDims || undefined}
            triggerAddHighlighter={triggerAddHighlighter}
            triggerRandomPattern={triggerRandomPattern}
            triggerShufflePattern={triggerShufflePattern}
          />

          {isMobile && (
            <button
              onClick={() => setShowMobileControls(!showMobileControls)}
              className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-blue-600 hover:bg-blue-700 text-white px-2.5 py-1 rounded-full shadow-lg flex items-center gap-1 z-10 text-[10px] transition-colors"
            >
              <Eye className="w-3 h-3" />
              {showMobileControls ? 'Hide' : 'Show'}
              {showMobileControls ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />}
            </button>
          )}
        </div>

        {/* SIDEBAR */}
        <aside className={`lg:w-72 xl:w-80 bg-gray-800/95 backdrop-blur-sm overflow-y-auto transition-all border-t lg:border-t-0 lg:border-l border-gray-700 flex-shrink-0 ${
          isMobile && !showMobileControls ? 'max-h-0 opacity-0' : 'max-h-[40vh] lg:max-h-full opacity-100'
        }`}>
          <div className="p-2.5 sm:p-3 space-y-2.5">
            
            {/* ✅ FLOOR TILE SECTION - WITH CHANGE BUTTON */}
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
                
                {/* Current Floor Tile Display */}
                <div className="bg-gray-800 rounded p-1.5 border border-gray-700">
                  <div className="flex items-center gap-1.5">
                    <img 
                      src={floorTile.texture || tile.imageUrl} 
                      alt={floorTile.tileName || tile.name} 
                      className="w-10 h-10 object-cover rounded ring-2 ring-blue-500/50" 
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-medium text-[10px] truncate">
                        {floorTile.tileName || tile.name}
                      </p>
                      
                      <p className="text-green-400 text-[9px] mt-0.5 flex items-center gap-0.5">
                        <CheckCircle className="w-2 h-2" />
                        {floorTile.source === 'upload' ? 'Custom Upload' : floorTile.source === 'qr' ? 'QR Scanned' : 'Applied from QR'}
                      </p>
                      
                      {floorTile.sellerId && (
                        <p className="text-blue-400 text-[8px] mt-0.5 flex items-center gap-0.5">
                          🔒 Showroom: {floorTile.sellerId.substring(0, 8)}...
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Change Floor Tile Button */}
                <button
                  onClick={() => {
                    setShowFloorChangeModal(true);
                    if (isMobile) setExpandedSection(null);
                  }}
                  className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white px-3 py-2.5 rounded-lg shadow-lg transition-all flex items-center justify-center gap-2 text-[10px] font-semibold hover:scale-[1.02] active:scale-95"
                >
                  <Package className="w-3.5 h-3.5" />
                  Change Floor Tile
                </button>

                {/* Info Box */}
                <div className="bg-amber-900/30 rounded p-1.5 border border-amber-500/30">
                  <p className="text-amber-200 text-[8px] flex items-start gap-1">
                    <Info className="w-2.5 h-2.5 flex-shrink-0 mt-0.5" />
                    <span>
                      Upload custom image or scan QR code to change floor tile
                    </span>
                  </p>
                </div>
              </div>
            </section>

            {/* WALL TILE SECTION - WITHOUT CHANGE FLOOR BUTTON */}
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
                  
                  {!floorTile.sellerId && (
                    <div className="bg-red-900/30 rounded p-1.5 border border-red-500/30">
                      <p className="text-red-200 text-[9px] flex items-start gap-1">
                        <AlertCircle className="w-2.5 h-2.5 flex-shrink-0 mt-0.5" />
                        <span><strong>Floor tile must be scanned first!</strong></span>
                      </p>
                    </div>
                  )}
                  
                  <div className="space-y-1.5">
                    {wallTile.texture ? (
                      <div className="bg-gray-800 rounded p-1.5 border border-gray-700">
                        <img src={wallTile.texture} alt="Wall Tile" className="w-full h-20 object-cover rounded mb-1 ring-2 ring-purple-500/50" />
                        <p className="text-green-400 text-[9px] flex items-center gap-0.5 mb-1">
                          <CheckCircle className="w-2 h-2" />
                          {wallTile.tileName || 'Wall tile applied'}
                        </p>
                        {wallTile.size && (
                          <div className="bg-green-900/30 rounded px-1 py-0.5 mb-1">
                            <p className="text-green-300 text-[8px] font-mono">
                              {wallTile.size.width}×{wallTile.size.height}cm
                            </p>
                          </div>
                        )}
                        {wallTile.sellerId && (
                          <p className="text-blue-400 text-[8px] mb-1">
                            🔒 Showroom: {wallTile.sellerId.substring(0, 8)}...
                          </p>
                        )}
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
                        disabled={scannerLoading || !floorTile.sellerId}
                        className="w-full bg-purple-600 text-white py-1.5 rounded font-semibold hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1 text-[10px]"
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
                        <span>
                          <strong>Tip:</strong> Scan QR from another tile.
                          {floorTile.sellerId && <> Must be from same showroom.</>}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* BORDER TILES SECTION */}
            {viewMode === 'view' && (
              <section className="bg-gradient-to-br from-orange-900/50 to-red-900/50 rounded-lg p-2 border-2 border-orange-500/40">
                <button
                  onClick={() => toggleSection('borders')}
                  className="w-full flex items-center justify-between mb-1.5 lg:cursor-default"
                >
                  <h3 className="text-white font-bold text-[11px] flex items-center gap-1">
                    <Grid3x3 className="w-3 h-3 text-orange-400" />
                    Border Tiles
                  </h3>
                  {isMobile && (
                    expandedSection === 'borders' ? 
                    <ChevronUp className="w-3.5 h-3.5 text-gray-400" /> : 
                    <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                  )}
                </button>

                <div className={`space-y-1.5 ${isMobile && expandedSection !== 'borders' ? 'hidden' : 'block'}`}>
                  <button
                    onClick={() => {
                      setHighlightTileBorders(!highlightTileBorders);
                      
                      if (!highlightTileBorders) {
                        setSuccess('✅ Border lines enabled!\nYou can now see tile grid clearly.');
                        if (navigator.vibrate) {
                          navigator.vibrate([50, 30, 50]);
                        }
                      } else {
                        setSuccess('Border lines disabled');
                      }
                    }}
                    className={`w-full py-2.5 rounded-lg font-bold transition-all flex items-center justify-center gap-2 text-[11px] ${
                      highlightTileBorders
                        ? 'bg-gradient-to-r from-orange-600 to-red-600 text-white shadow-lg ring-2 ring-orange-400'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    <Grid3x3 className="w-4 h-4" />
                    {highlightTileBorders ? 'Hide Tile Borders' : 'Show Tile Borders'}
                  </button>
                </div>
              </section>
            )}

            {/* TILE CALCULATOR SECTION */}
            <section className="bg-gradient-to-br from-emerald-900/50 to-green-900/50 rounded-lg p-2 border-2 border-emerald-500/40">
              <button
                onClick={() => toggleSection('calculator')}
                className="w-full flex items-center justify-between mb-1.5 lg:cursor-default"
              >
                <h3 className="text-white font-bold text-[11px] flex items-center gap-1">
                  <Calculator className="w-3 h-3 text-emerald-400" />
                  Tile Calculator
                </h3>
                {isMobile && (
                  expandedSection === 'calculator' ? 
                  <ChevronUp className="w-3.5 h-3.5 text-gray-400" /> : 
                  <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                )}
              </button>

              <div className={`space-y-1.5 ${isMobile && expandedSection !== 'calculator' ? 'hidden' : 'block'}`}>
                <button
                  onClick={() => {
                    setShowTileCalculator(true);
                    if (isMobile) setExpandedSection(null);
                    
                    if (navigator.vibrate) {
                      navigator.vibrate([50, 30, 50]);
                    }
                  }}
                  className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white px-3 py-2.5 rounded-lg shadow-lg transition-all flex items-center justify-center gap-2 text-[10px] font-semibold hover:scale-[1.02] active:scale-95"
                >
                  <Calculator className="w-4 h-4" />
                  Open Tile Calculator
                </button>

                <div className="bg-emerald-900/30 rounded p-1.5 border border-emerald-500/30">
                  <p className="text-emerald-200 text-[8px] flex items-start gap-1 leading-tight">
                    <Info className="w-2.5 h-2.5 flex-shrink-0 mt-0.5" />
                    <span>
                      <strong>Universal Calculator:</strong> Calculate tiles for any room size with custom dimensions and wastage options.
                    </span>
                  </p>
                </div>
              </div>
            </section>

            {/* ACTIONS & CONTROLS SECTION */}
            <section className="bg-gradient-to-br from-indigo-900/50 to-blue-900/50 rounded-lg p-2 border-2 border-indigo-500/40">
              <button
                onClick={() => toggleSection('actions')}
                className="w-full flex items-center justify-between mb-1.5 lg:cursor-default"
              >
                <h3 className="text-white font-bold text-[11px] flex items-center gap-1">
                  <Settings className="w-3 h-3 text-indigo-400" />
                  Actions & Controls
                </h3>
                {isMobile && (
                  expandedSection === 'actions' ? 
                  <ChevronUp className="w-3.5 h-3.5 text-gray-400" /> : 
                  <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                )}
              </button>

              <div className={`space-y-1.5 ${isMobile && expandedSection !== 'actions' ? 'hidden' : 'block'}`}>
                
                {/* Highlighter Mode Actions */}
                {viewMode === 'highlighter' && isKitchenOrBathroom && (
                  <>
                    <button
                      onClick={() => {
                        setTriggerAddHighlighter(true);
                        setTimeout(() => setTriggerAddHighlighter(false), 100);
                        if (isMobile) setExpandedSection(null);
                      }}
                      disabled={!wallTile.texture}
                      className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-3 py-2.5 rounded-lg shadow-lg transition-all flex items-center justify-center gap-2 text-[10px] font-semibold hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                    >
                      <Highlighter className="w-3.5 h-3.5" />
                      Add Highlighter Tiles
                    </button>

                    <button
                      onClick={() => {
                        setTriggerRandomPattern(true);
                        setTimeout(() => setTriggerRandomPattern(false), 100);
                        if (isMobile) setExpandedSection(null);
                      }}
                      disabled={!wallTile.texture}
                      className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-3 py-2.5 rounded-lg shadow-lg transition-all flex items-center justify-center gap-2 text-[10px] font-semibold hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                    >
                      <Shuffle className="w-3.5 h-3.5" />
                      Apply Random Pattern
                    </button>

                    {(highlighterTileIndices.back.size > 0 || 
                      highlighterTileIndices.front.size > 0 || 
                      highlighterTileIndices.left.size > 0 || 
                      highlighterTileIndices.right.size > 0) && (
                      <button
                        onClick={() => {
                          setTriggerShufflePattern(true);
                          setTimeout(() => setTriggerShufflePattern(false), 100);
                          if (isMobile) setExpandedSection(null);
                        }}
                        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-3 py-2.5 rounded-lg shadow-lg transition-all flex items-center justify-center gap-2 text-[10px] font-semibold hover:scale-[1.02] active:scale-95"
                      >
                        <Shuffle className="w-3.5 h-3.5" />
                        Shuffle Pattern
                      </button>
                    )}

                    <div className="bg-purple-900/30 rounded-lg p-1.5 border border-purple-500/30">
                      <p className="text-purple-200 text-[8px] flex items-start gap-1 leading-tight">
                        <Info className="w-2.5 h-2.5 flex-shrink-0 mt-0.5" />
                        <span>
                          <strong>Highlighter Mode:</strong> Select wall tiles to highlight.
                          {!wallTile.texture && <><br/>⚠️ Scan wall tile first!</>}
                        </span>
                      </p>
                    </div>
                  </>
                )}

                {/* View Mode Info */}
                {viewMode === 'view' && (
                  <div className="bg-blue-900/30 rounded-lg p-1.5 border border-blue-500/30">
                    <p className="text-blue-200 text-[8px] flex items-start gap-1 leading-tight">
                      <Info className="w-2.5 h-2.5 flex-shrink-0 mt-0.5" />
                      <span>
                        <strong>View Mode:</strong> Visualize tiles in 3D. Use the calculator above for accurate tile counts and cost estimates.
                      </span>
                    </p>
                  </div>
                )}
              </div>
            </section>
          </div>
        </aside>
      </div>

      {/* MODALS */}
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
          currentUser={verifiedUser ? {
            role: verifiedUser.role,
            user_id: verifiedUser.uid,
            showroom_id: verifiedUser.seller_id
          } : undefined}
        />
      )}

      {showFloorChangeModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Package className="w-6 h-6 text-blue-400" />
                Change Floor Tile
              </h3>
              <button 
                onClick={() => {
                  setShowFloorChangeModal(false);
                  setFloorChangeMethod('qr');
                }} 
                className="p-2 hover:bg-gray-700 rounded-lg transition-colors text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mb-4">
              <label className="text-white text-sm font-medium mb-2 block">Select Input Method:</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setFloorChangeMethod('qr')}
                  className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-semibold transition-all ${
                    floorChangeMethod === 'qr' 
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white ring-2 ring-purple-400 shadow-lg' 
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  <QrCode className="w-5 h-5" />
                  QR Scan
                </button>
                <button
                  onClick={() => setFloorChangeMethod('upload')}
                  className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-semibold transition-all ${
                    floorChangeMethod === 'upload' 
                      ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white ring-2 ring-cyan-400 shadow-lg' 
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  <ImageIcon className="w-5 h-5" />
                  Upload
                </button>
              </div>
            </div>

            {floorChangeMethod === 'qr' && (
              <div className="space-y-3">
                <button
                  onClick={() => {
                    setShowFloorChangeModal(false);
                    setShowFloorQRScanner(true);
                  }}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-3 rounded-lg hover:shadow-lg transition-all flex items-center justify-center gap-2 font-semibold"
                >
                  <Scan className="w-5 h-5" />
                  Scan Floor Tile QR Code
                </button>

                <div className="bg-purple-900/30 rounded-lg p-3 border border-purple-500/30">
                  <p className="text-purple-200 text-xs flex items-start gap-2">
                    <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <span>
                      <strong>QR Scan:</strong> Scan a QR code from another tile to use its texture and information.
                    </span>
                  </p>
                </div>
              </div>
            )}

            {floorChangeMethod === 'upload' && (
              <div className="space-y-3">
                <div>
                  <label className="text-white text-sm font-medium mb-2 block">Select Tile Size:</label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {FLOOR_TILE_SIZES.map((size) => (
                      <button
                        key={size.label}
                        onClick={() => setTempFloorTileSize(size)}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                          tempFloorTileSize.width === size.width && tempFloorTileSize.height === size.height
                            ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white ring-2 ring-blue-400'
                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        }`}
                      >
                        {size.label}
                      </button>
                    ))}
                  </div>
                  <p className="text-gray-400 text-xs mt-2">
                    Selected: <strong className="text-white">{tempFloorTileSize.width}×{tempFloorTileSize.height} cm</strong>
                  </p>
                </div>

                <div className="bg-gray-700/50 rounded-lg p-3 border border-gray-600">
                  <ImageUpload
                    currentImage={floorTile.texture}
                    onImageUploaded={handleFloorTileUpload}
                    placeholder="Upload floor tile image"
                    folder="floor-tiles"
                  />
                </div>

                <div className="bg-blue-900/30 rounded-lg p-3 border border-blue-500/30">
                  <p className="text-blue-200 text-xs flex items-start gap-2">
                    <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <span>
                      <strong>Custom Upload:</strong> Upload your own tile image and select the tile size for accurate visualization.
                    </span>
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {showFloorQRScanner && (
        <QRScanner
          onScanSuccess={async (data) => {
            if (data.tileId) {
              setShowFloorQRScanner(false);
              await handleFloorTileQRScan(data.tileId);
            } else {
              setError('Invalid QR code');
            }
          }}
          onClose={() => setShowFloorQRScanner(false)}
          currentUser={verifiedUser ? {
            role: verifiedUser.role,
            user_id: verifiedUser.uid,
            showroom_id: verifiedUser.seller_id
          } : undefined}
        />
      )}

      {showDimensionEditor && (
        <RoomDimensionModal
          isOpen={showDimensionEditor}
          onClose={() => setShowDimensionEditor(false)}
          onSubmit={handleDimensionUpdate}
          roomName={`${roomType?.charAt(0).toUpperCase()}${roomType?.slice(1)} Visual Size`}
          defaultWidth={currentDimensions?.width || 10}
          defaultDepth={currentDimensions?.depth || 12}
          defaultHeight={currentDimensions?.height || 11}
        />
      )}

      {showCalculationDimEditor && calculationDims && (
        <RoomDimensionModal
          isOpen={showCalculationDimEditor}
          onClose={() => setShowCalculationDimEditor(false)}
          onSubmit={handleCalculationDimensionUpdate}
          roomName={`${roomType?.charAt(0).toUpperCase()}${roomType?.slice(1)} Calculation Size`}
          defaultWidth={calculationDims.width}
          defaultDepth={calculationDims.depth}
          defaultHeight={calculationDims.height}
        />
      )}

      {tile && (
        <UniversalTileCalculator
          isOpen={showTileCalculator}
          onClose={() => {
            console.log('🔄 Universal Calculator closed, syncing dimensions...');

            setShowTileCalculator(false);
            
            const latestDims = getCalculationDimensions(roomType || 'kitchen');
            
            const dimsChanged = calculationDims && (
              latestDims.width !== calculationDims.width ||
              latestDims.depth !== calculationDims.depth ||
              latestDims.height !== calculationDims.height
            );
            
            if (dimsChanged) {
              console.log('📐 Dimensions changed in Universal Calculator:', {
                old: calculationDims,
                new: latestDims
              });
              
              setCalculationDims({ ...latestDims });
              setDimsVersion(prev => prev + 1);
              
              setSuccess('✅ Calculator closed - dimensions synced!');
            } else {
              console.log('✅ No dimension changes detected');
            }
            
            console.log('✅ Dimensions reloaded:', latestDims);
          }}
          initialFloorTile={
            floorTile.texture
              ? {
                  name: floorTile.tileName || tile.name,
                  size: floorTile.size,
                  imageUrl: floorTile.texture
                }
              : undefined
          }
          roomType={roomType === 'kitchen' ? 'kitchen' : roomType === 'bathroom' ? 'bathroom' : 'all'}
          defaultDimensions={calculationDims || undefined}
        />
      )}
    
    </div>
  );
};