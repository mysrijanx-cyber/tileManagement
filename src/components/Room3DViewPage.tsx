
import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import {
  ArrowLeft, Share2, Loader, Scan,
  Package, AlertCircle, CheckCircle, X, Info,
  ChevronDown, ChevronUp, Eye, 
  Grid3x3, Settings, Shuffle, Highlighter, QrCode, Image as ImageIcon, Calculator
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

const ROOM_STATE_EXPIRY = 60 * 60 * 1000; // 1 hour

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

/**
 * Parse tile size string to dimensions object
 * Supports formats: "60x60", "60×60", "60 x 60", "60cm x 60cm"
 */
const parseTileSize = (sizeStr: string, type: 'floor' | 'wall'): { width: number; height: number } => {
  const defaultFloor = { width: 60, height: 60 };
  const defaultWall = { width: 30, height: 45 };

  if (!sizeStr || typeof sizeStr !== 'string') {
    console.warn(`⚠️ Invalid tile size input: "${sizeStr}", using default`);
    return type === 'floor' ? defaultFloor : defaultWall;
  }

  try {
    const cleanSize = sizeStr
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

  // ═══════════════════════════════════════════════════════════
  // STATE MANAGEMENT
  // ═══════════════════════════════════════════════════════════

  // Core states
  const [verifiedUser, setVerifiedUser] = useState<VerifiedUserData | null>(null);
  const [tile, setTile] = useState<Tile | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeSurface, setActiveSurface] = useState<'floor' | 'wall' | 'both'>('both');
  
  // Modal states
  const [showInquiryForm, setShowInquiryForm] = useState(false);
  const [inquiryFormData, setInquiryFormData] = useState<any>(null);
  const [showDimensionEditor, setShowDimensionEditor] = useState(false);
  const [showCalculationDimEditor, setShowCalculationDimEditor] = useState(false);
  const [showTileCalculator, setShowTileCalculator] = useState(false);
  
  // Floor tile change states
  const [showFloorChangeModal, setShowFloorChangeModal] = useState(false);
  const [showFloorQRScanner, setShowFloorQRScanner] = useState(false);
  const [tempFloorTileSize, setTempFloorTileSize] = useState<{ width: number; height: number }>({ width: 60, height: 60 });
  
  // Wall tile states
  const [showWallScanner, setShowWallScanner] = useState(false);
  const [scannerLoading, setScannerLoading] = useState(false);
  
  // Dimension states
  const [calculationDims, setCalculationDims] = useState<RoomDimensions | null>(null);
  const [dimsVersion, setDimsVersion] = useState(0);
  const [tileCount, setTileCount] = useState<TileCount | null>(null);
  
  // Highlighter states
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
  
  // Border states
  const [highlightTileBorders, setHighlightTileBorders] = useState(false);
  const [borderInfo, setBorderInfo] = useState<BorderInfo>({
    floor: null,
    wall: null
  });
  
  // Notification states
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // UI states
  const [showMobileControls, setShowMobileControls] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [expandedSection, setExpandedSection] = useState<'floor' | 'wall' | 'calculator' | 'borders' | 'actions' | null>('floor');
  const [viewerKey, setViewerKey] = useState(0);
  
  // Trigger states for Enhanced3DViewer
  const [triggerAddHighlighter, setTriggerAddHighlighter] = useState(false);
  const [triggerRandomPattern, setTriggerRandomPattern] = useState(false);
  const [triggerShufflePattern, setTriggerShufflePattern] = useState(false);
 const [triggerClearHighlighter, setTriggerClearHighlighter] = useState(false);
  // Tile states
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

  const wallTileHeight = 11;

  // ═══════════════════════════════════════════════════════════
  // UTILITY FUNCTIONS
  // ═══════════════════════════════════════════════════════════

  /**
   * Get current room dimensions from localStorage
   */
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

  /**
   * Get wall dimensions for calculation
   */
  const getWallDimensions = useCallback((wall: WallType, customWallHeight?: number) => {
    const dims = calculationDims || getCalculationDimensions(roomType || 'kitchen');
    
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
    
    return { cols, rows };
  }, [calculationDims, roomType, wallTile.size]);

  /**
   * Calculate highlighter tile breakdown
   */
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

  /**
   * Validate seller consistency between floor and wall tiles
   */
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

  /**
   * Save room state to localStorage
   */
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

  /**
   * Restore room state from localStorage
   */
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

  // ═══════════════════════════════════════════════════════════
  // EVENT HANDLERS
  // ═══════════════════════════════════════════════════════════

  /**
   * Handle dimension update for visualization
   */
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

  /**
   * Handle calculation dimension update
   */
  const handleCalculationDimensionUpdate = useCallback((width: number, depth: number, height: number) => {
    const newDims = { width, depth, height };

    console.log('💾 Saving calculation dimensions:', newDims);

    const saved = saveCalculationDimensions(roomType || 'kitchen', newDims);

    if (saved) {
      setCalculationDims({ ...newDims });
      setDimsVersion(prev => prev + 1);
      setShowCalculationDimEditor(false);

      if (navigator.vibrate) {
        navigator.vibrate([50, 30, 50]);
      }

      setSuccess(
        `✅ Calculation dimensions updated!\n` +
        `New size: ${width}' × ${depth}' × ${height}'\n` +
        `Tile counts will recalculate automatically.`
      );
    } else {
      setError('Failed to save calculation dimensions');
    }
  }, [roomType]);

  /**
   * Handle share functionality
   */
  const handleShare = useCallback(async () => {
    const shareData = {
      title: `${tile?.name} in ${roomType}`,
      text: `Check out this tile visualization!`,
      url: window.location.href
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        setSuccess('✅ Shared successfully!');
      } else {
        await navigator.clipboard.writeText(window.location.href);
        setSuccess('✅ Link copied to clipboard!');
      }
    } catch (err) {
      console.error('Error sharing:', err);
    }
  }, [tile?.name, roomType]);

  /**
   * Toggle sidebar sections on mobile
   */
  const toggleSection = useCallback((section: 'floor' | 'wall' | 'calculator' | 'borders' | 'actions') => {
    setExpandedSection(expandedSection === section ? null : section);
  }, [expandedSection]);

  /**
   * Handle floor tile image upload
   */
  const handleFloorTileUpload = useCallback((imageUrl: string) => {
    console.log('📸 Floor tile uploaded:', imageUrl);
    
    const newFloorTile: TileState = {
      texture: imageUrl,
      size: { ...tempFloorTileSize },
      sellerId: floorTile.sellerId || undefined,
      tileName: 'Custom Floor Tile',
      tileId: undefined,
      source: 'upload'
    };

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

  /**
   * Handle floor tile QR scan
   */
  const handleFloorTileQRScan = useCallback(async (floorTileId: string) => {
    // Prevent duplicate scans
    if (scannerLoading) {
      console.warn('⚠️ Scan already in progress');
      return;
    }

    try {
      setScannerLoading(true);
      setError(null);

      console.log('🔍 Loading floor tile from QR:', floorTileId);

      const floorTileData = await getTileById(floorTileId);

      if (!floorTileData) {
        setError('❌ Floor tile not found in database');
        return;
      }

      // Track QR scan (session-based to avoid duplicates)
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

      setFloorTile(newFloorTile);
      setViewerKey(prev => prev + 1);
      setShowFloorQRScanner(false);
      
      setSuccess(
        `✅ Floor tile changed!\n` +
        `${floorTileData.name}\n` +
        `📏 ${parsedSize.width}×${parsedSize.height}cm`
      );
      
      if (navigator.vibrate) {
        navigator.vibrate([100, 50, 100]);
      }
      
      setTimeout(() => {
        saveRoomState();
      }, 100);

    } catch (err: any) {
      console.error('❌ Floor tile QR error:', err);
      setError(err.message || 'Failed to load floor tile');
    } finally {
      setScannerLoading(false);
    }
  }, [scannerLoading, saveRoomState]);

  /**
   * Handle wall tile QR scan
   */
  const loadWallTileFromQR = useCallback(async (wallTileId: string) => {
    if (scannerLoading) {
      console.warn('⚠️ Scan already in progress');
      return;
    }

    try {
      setScannerLoading(true);
      setError(null);

      // Check if floor tile is set
      if (!floorTile.sellerId) {
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
        setError('❌ Wall tile not found in database');
        return;
      }

      const wallSellerId = wallTileData.sellerId;

      // Validate seller consistency
      const validation = validateSellerConsistency(wallSellerId);
      
      if (!validation.valid) {
        setError(validation.error ?? null);
        
        if (navigator.vibrate) {
          navigator.vibrate([200, 100, 200, 100, 200]);
        }
        
        return;
      }

      // Track QR scan
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

      setShowWallScanner(false);
      setSuccess(
        `✅ Wall tile added!\n` +
        `${wallTileData.name}\n` +
        `📏 ${parsedWallSize.width}×${parsedWallSize.height}cm`
      );
      
      if (navigator.vibrate) {
        navigator.vibrate(200);
      }
      
    } catch (err: any) {
      console.error('❌ Wall tile QR error:', err);
      setError(err.message || 'Failed to load wall tile');
    } finally {
      setScannerLoading(false);
    }
  }, [floorTile.sellerId, validateSellerConsistency, scannerLoading]);

  /**
   * Handle customer inquiry form submission
   */
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

  // ═══════════════════════════════════════════════════════════
  // EFFECTS
  // ═══════════════════════════════════════════════════════════

  /**
   * Load calculation dimensions on mount and when room type changes
   */
  useEffect(() => {
    const dims = getCalculationDimensions(roomType || 'kitchen');
    setCalculationDims(dims);
    console.log('📐 Loaded calculation dimensions:', dims);
  }, [roomType, dimsVersion]);

  /**
   * Calculate tile counts when dimensions or tile sizes change
   */
  useEffect(() => {
    if (!calculationDims) return;
    if (!floorTile.size || floorTile.size.width <= 0 || floorTile.size.height <= 0) return;

    const floorResult = calculateTiles({
      roomWidth: calculationDims.width,
      roomDepth: calculationDims.depth,
      roomHeight: calculationDims.height,
      tileWidthCm: floorTile.size.width,
      tileHeightCm: floorTile.size.height,
      roomType: roomType as any
    });

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
  }, [calculationDims, floorTile.size, wallTile.size, wallTile.texture, roomType, dimsVersion]);

  /**
   * Calculate border info when borders are enabled
   */
  useEffect(() => {
    if (!highlightTileBorders) {
      setBorderInfo({ floor: null, wall: null });
      return;
    }

    // Floor borders
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
    }

    // Wall borders
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

  /**
   * Calculate highlighter breakdown
   */
  useEffect(() => {
    const breakdown = calculateHighlighterBreakdown();
    setHighlighterBreakdown(breakdown);
  }, [calculateHighlighterBreakdown]);

  /**
   * Listen for highlighter updates from Enhanced3DViewer
   */
  useEffect(() => {
    const handleHighlighterUpdate = (event: CustomEvent) => {
      const { wall, indices } = event.detail;
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

  /**
   * Prepare verified user data
   */
  useEffect(() => {
    const prepareVerifiedUser = async () => {
      const authUser = auth.currentUser;

      if (!authUser) {
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

  /**
   * Detect mobile device
   */
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  /**
   * Load tile data on mount
   */
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

        // Try to restore previous state
        const restored = restoreRoomState();
        if (restored) {
          setSuccess('✅ Previous configuration restored');
          setLoading(false);
          return;
        }

        // Check if worker role requires customer inquiry
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
                  setSuccess(`✅ Showing for ${existingSession.name}`);
                  return;
                }
                
                // Prepare inquiry form data
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
        
        // Default: Load floor tile
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

  /**
   * Auto-hide notifications after 5 seconds
   */
  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        setSuccess(null);
        setError(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [success, error]);

  /**
   * Save room state when tiles change
   */
  useEffect(() => {
    if (floorTile.sellerId || wallTile.sellerId) {
      saveRoomState();
    }
  }, [floorTile, wallTile, activeSurface, wallTileHeight, saveRoomState]);

  // ═══════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="text-center px-4">
          <Loader className="w-12 h-12 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-white text-base font-medium">Loading 3D Visualization...</p>
          <p className="text-gray-400 text-sm mt-2">Please wait</p>
        </div>
      </div>
    );
  }

  if (!tile || !roomType) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="text-center px-4">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-white text-base font-medium">Invalid Request</p>
          <p className="text-gray-400 text-sm mt-2">Redirecting...</p>
        </div>
      </div>
    );
  }

  const isKitchenOrBathroom = roomType === 'kitchen' || roomType === 'bathroom';
  const currentDimensions = getCurrentDimensions();

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 overflow-hidden">

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* HEADER */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <header className="bg-gray-800/95 backdrop-blur-sm shadow-lg z-20 border-b border-gray-700 flex-shrink-0">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2.5 flex items-center justify-between gap-3">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 text-white hover:text-blue-400 transition-colors p-1.5 -ml-1 rounded-lg hover:bg-gray-700"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium text-sm sm:text-base">Back</span>
          </button>

          <div className="flex-1 text-center min-w-0">
            <h1 className="text-white font-bold text-sm sm:text-base md:text-lg capitalize truncate">
              {roomType} - 3D Visualization
            </h1>
          </div>

          <button 
            onClick={handleShare} 
            className="p-1.5 text-white hover:bg-gray-700 rounded-lg transition-colors" 
            title="Share"
          >
            <Share2 className="w-5 h-5" />
          </button>
        </div>

        {wallTile.texture && isKitchenOrBathroom && (
          <div className="bg-purple-600/20 border-t border-purple-500/30 px-4 py-2">
            <div className="max-w-7xl mx-auto flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
              <p className="text-purple-200 text-xs font-medium">
                Wall Tile Active: {wallTile.tileName}
              </p>
            </div>
          </div>
        )}
      </header>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* CUSTOMER INQUIRY FORM MODAL */}
      {/* ═══════════════════════════════════════════════════════════ */}
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

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* NOTIFICATIONS */}
      {/* ═══════════════════════════════════════════════════════════ */}
      {success && (
        <div className="fixed top-14 sm:top-16 left-1/2 transform -translate-x-1/2 z-50 max-w-sm sm:max-w-md w-full mx-3 animate-slide-down">
          <div className="bg-green-500 text-white px-4 py-3 rounded-lg shadow-2xl flex items-start gap-3">
            <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <p className="font-medium text-sm flex-1 whitespace-pre-line leading-relaxed">{success}</p>
            <button onClick={() => setSuccess(null)} className="ml-auto p-0.5 hover:bg-green-600 rounded transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {error && (
        <div className="fixed top-14 sm:top-16 left-1/2 transform -translate-x-1/2 z-50 max-w-sm sm:max-w-md w-full mx-3 animate-slide-down">
          <div className="bg-red-500 text-white px-4 py-3 rounded-lg shadow-2xl flex items-start gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <p className="font-medium text-sm flex-1 whitespace-pre-line break-words leading-relaxed">{error}</p>
            <button onClick={() => setError(null)} className="ml-auto p-0.5 hover:bg-red-600 rounded transition-colors flex-shrink-0">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* MAIN CONTENT */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        
        {/* 3D VIEWER */}
        <div className="flex-1 relative min-h-0 bg-gray-900">
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
              setHighlighterTileIndices(prev => ({
                ...prev,
                [wall]: new Set(indices)
              }));
            }}
            calculationDimensions={calculationDims || undefined}
            triggerAddHighlighter={triggerAddHighlighter}
            triggerRandomPattern={triggerRandomPattern}
            triggerShufflePattern={triggerShufflePattern}
            triggerClearHighlighter={triggerClearHighlighter}
          />

          {/* Mobile Controls Toggle */}
          {isMobile && (
            <button
              onClick={() => setShowMobileControls(!showMobileControls)}
              className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2 z-10 text-xs font-medium transition-all hover:scale-105 active:scale-95"
            >
              <Eye className="w-4 h-4" />
              {showMobileControls ? 'Hide Controls' : 'Show Controls'}
              {showMobileControls ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
            </button>
          )}
        </div>

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* SIDEBAR CONTROLS */}
        {/* ═══════════════════════════════════════════════════════════ */}
        <aside className={`w-full lg:w-80 xl:w-96 bg-gray-800/95 backdrop-blur-sm overflow-y-auto transition-all duration-300 border-t lg:border-t-0 lg:border-l border-gray-700 flex-shrink-0 ${
          isMobile && !showMobileControls ? 'max-h-0 opacity-0' : 'max-h-[50vh] lg:max-h-full opacity-100'
        }`}>
          <div className="p-3 sm:p-4 space-y-3">
            
            {/* ═══════════════════════════════════════════════════════ */}
            {/* FLOOR TILE SECTION */}
            {/* ═══════════════════════════════════════════════════════ */}
         
{/* ═══════════════════════════════════════════════════════ */}
{/* FLOOR TILE SECTION */}
{/* ═══════════════════════════════════════════════════════ */}
<section className="bg-gradient-to-br from-blue-900/50 to-indigo-900/50 rounded-xl p-3 border-2 border-blue-500/40 shadow-lg">
  <button
    onClick={() => toggleSection('floor')}
    className="w-full flex items-center justify-between mb-3 lg:cursor-default"
  >
    <h3 className="text-white font-bold text-sm flex items-center gap-2">
      <Package className="w-4 h-4 text-blue-400" />
      Floor Tile
    </h3>
    {isMobile && (
      expandedSection === 'floor' ? 
      <ChevronUp className="w-4 h-4 text-gray-400" /> : 
      <ChevronDown className="w-4 h-4 text-gray-400" />
    )}
  </button>

  <div className={`space-y-2 ${isMobile && expandedSection !== 'floor' ? 'hidden' : 'block'}`}>
    
    {/* Current Floor Tile Display */}
    <div className="bg-gray-800/70 rounded-lg p-2 border border-gray-700">
      <div className="flex items-center gap-2">
        <img 
          src={floorTile.texture || tile.imageUrl} 
          alt={floorTile.tileName || tile.name} 
          className="w-12 h-12 sm:w-14 sm:h-14 object-cover rounded-lg ring-2 ring-blue-500/50" 
        />
        <div className="flex-1 min-w-0">
          <p className="text-white font-medium text-xs sm:text-sm truncate">
            {floorTile.tileName || tile.name}
          </p>
          
          <p className="text-green-400 text-[10px] sm:text-xs mt-1 flex items-center gap-1">
            <CheckCircle className="w-3 h-3 flex-shrink-0" />
            {floorTile.source === 'upload' ? 'Custom Upload' : floorTile.source === 'qr' ? 'QR Scanned' : 'Initial Tile'}
          </p>
          
          {floorTile.size && (
            <p className="text-blue-300 text-[10px] mt-0.5">
              📏 {floorTile.size.width}×{floorTile.size.height} cm
            </p>
          )}
        </div>
      </div>
    </div>

    {/* Direct QR Scan Button */}
    <button
      onClick={() => {
        setShowFloorQRScanner(true);
        if (isMobile) setExpandedSection(null);
      }}
      disabled={scannerLoading}
      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-4 py-2.5 rounded-lg shadow-lg transition-all flex items-center justify-center gap-2 text-xs sm:text-sm font-semibold hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
    >
      {scannerLoading ? (
        <>
          <Loader className="w-4 h-4 animate-spin" />
          Scanning...
        </>
      ) : (
        <>
          <QrCode className="w-4 h-4" />
          Change Floor Tile 
        </>
      )}
    </button>

   

    {/* Info Box */}
    <div className="bg-blue-900/30 rounded-lg p-2 border border-blue-500/30">
      <p className="text-blue-200 text-[10px] leading-relaxed flex items-start gap-1">
        <Info className="w-3 h-3 flex-shrink-0 mt-0.5" />
        <span>
          <strong>QR Scan:</strong> Get exact tile details from showroom
          <br />
         
        </span>
      </p>
    </div>
  </div>
</section>
            {/* ═══════════════════════════════════════════════════════ */}
            {/* WALL TILE SECTION */}
            {/* ═══════════════════════════════════════════════════════ */}
          {/* ═══════════════════════════════════════════════════════ */}
            {/* WALL TILE & CONTROLS SECTION (MERGED) */}
            {/* ═══════════════════════════════════════════════════════ */}
            {isKitchenOrBathroom && (
              <section className="bg-gradient-to-br from-purple-900/50 to-pink-900/50 rounded-xl p-3 border-2 border-purple-500/40 shadow-lg">
                <button
                  onClick={() => toggleSection('wall')}
                  className="w-full flex items-center justify-between mb-3 lg:cursor-default"
                >
                  <h3 className="text-white font-bold text-sm flex items-center gap-2">
                    <Package className="w-4 h-4 text-purple-400" />
                    Wall Tile {wallTile.texture && viewMode === 'highlighter' ? '& Controls' : ''}
                  </h3>
                  {isMobile && (
                    expandedSection === 'wall' ? 
                    <ChevronUp className="w-4 h-4 text-gray-400" /> : 
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  )}
                </button>

                <div className={`space-y-2 ${isMobile && expandedSection !== 'wall' ? 'hidden' : 'block'}`}>
                  
                  {/* Floor Tile Required Warning */}
                  {!floorTile.sellerId && (
                    <div className="bg-red-900/30 rounded-lg p-2 border border-red-500/30">
                      <p className="text-red-200 text-[10px] flex items-start gap-1 leading-relaxed">
                        <AlertCircle className="w-3 h-3 flex-shrink-0 mt-0.5" />
                        <span><strong>Floor tile must be set first!</strong> Wall tiles must match floor tile showroom.</span>
                      </p>
                    </div>
                  )}
                  
                  {/* Wall Tile Display & Merged Controls */}
                  <div className="space-y-2">
                    {wallTile.texture ? (
                      <div className="bg-gray-800/70 rounded-lg p-2 border border-gray-700">
                        <img 
                          src={wallTile.texture} 
                          alt={wallTile.tileName || "Wall Tile"} 
                          className="w-full h-24 sm:h-28 object-cover rounded-lg mb-2 ring-2 ring-purple-500/50" 
                        />
                        
                        <p className="text-green-400 text-xs flex items-center gap-1 mb-1">
                          <CheckCircle className="w-3 h-3" />
                          {wallTile.tileName || 'Wall tile applied'}
                        </p>
                        
                        {wallTile.size && (
                          <div className="bg-purple-900/30 rounded px-2 py-1 mb-2">
                            <p className="text-purple-200 text-[10px] font-mono">
                              📏 {wallTile.size.width}×{wallTile.size.height} cm
                            </p>
                          </div>
                        )}
                        
                        <button
                          onClick={() => setShowWallScanner(true)}
                          className="w-full bg-purple-600 hover:bg-purple-700 text-white py-1.5 rounded-lg text-xs font-medium transition-colors mb-2"
                        >
                          Change Wall Tile
                        </button>

                        {/* ⬇️ MERGED HIGHLIGHTER CONTROLS (Only visible after Wall Tile is added) ⬇️ */}
                        {viewMode === 'highlighter' && (
                          <div className="space-y-2 pt-3 mt-1 border-t border-purple-500/30">
                            <button
                              onClick={() => {
                                setTriggerAddHighlighter(true);
                                setTimeout(() => setTriggerAddHighlighter(false), 100);
                                if (isMobile) setExpandedSection(null);
                              }}
                              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-4 py-2.5 rounded-lg shadow-lg transition-all flex items-center justify-center gap-2 text-xs font-semibold hover:scale-[1.02] active:scale-95"
                            >
                              <Highlighter className="w-4 h-4" />
                              Add Highlighter Tiles
                            </button>

                            <button
                              onClick={() => {
                                setTriggerRandomPattern(true);
                                setTimeout(() => setTriggerRandomPattern(false), 100);
                                if (isMobile) setExpandedSection(null);
                              }}
                              className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-4 py-2.5 rounded-lg shadow-lg transition-all flex items-center justify-center gap-2 text-xs font-semibold hover:scale-[1.02] active:scale-95"
                            >
                              <Shuffle className="w-4 h-4" />
                              Apply Random Pattern
                            </button>

                            {(highlighterTileIndices.back.size > 0 || 
                              highlighterTileIndices.front.size > 0 || 
                              highlighterTileIndices.left.size > 0 || 
                              highlighterTileIndices.right.size > 0) && (
                              <>
                                <button
                                  onClick={() => {
                                    setTriggerShufflePattern(true);
                                    setTimeout(() => setTriggerShufflePattern(false), 100);
                                    if (isMobile) setExpandedSection(null);
                                  }}
                                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-4 py-2.5 rounded-lg shadow-lg transition-all flex items-center justify-center gap-2 text-xs font-semibold hover:scale-[1.02] active:scale-95"
                                >
                                  <Shuffle className="w-4 h-4" />
                                  Shuffle Pattern
                                </button>
                                
                                <button
                                  onClick={() => {
                                    setTriggerClearHighlighter(true);
                                    setTimeout(() => setTriggerClearHighlighter(false), 100);
                                    if (isMobile) setExpandedSection(null);
                                  }}
                                  className="w-full bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white px-4 py-2.5 rounded-lg shadow-lg transition-all flex items-center justify-center gap-2 text-xs font-semibold hover:scale-[1.02] active:scale-95"
                                >
                                  <X className="w-4 h-4" />
                                  Remove Highlighter
                                </button>
                              </>
                            )}
                          </div>
                        )}
                        {/* ⬆️ END OF CONTROLS ⬆️ */}

                      </div>
                    ) : (
                      <button
                        onClick={() => setShowWallScanner(true)}
                        disabled={scannerLoading || !floorTile.sellerId}
                        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-2.5 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-xs sm:text-sm hover:scale-[1.02] active:scale-95 disabled:hover:scale-100"
                      >
                        {scannerLoading ? (
                          <>
                            <Loader className="w-4 h-4 animate-spin" />
                            Loading...
                          </>
                        ) : (
                          <>
                            <Scan className="w-4 h-4" />
                            Select Wall Tile
                          </>
                        )}
                      </button>
                    )}

                    {/* Info Box */}
                    <div className="bg-purple-900/30 rounded-lg p-2 border border-purple-500/30">
                      <p className="text-purple-200 text-[10px] leading-relaxed flex items-start gap-1">
                        <Info className="w-3 h-3 flex-shrink-0 mt-0.5" />
                        <span>
                          {viewMode === 'highlighter' && wallTile.texture ? (
                            <><strong>Highlighter Mode:</strong> Click wall tiles to highlight them.</>
                          ) : (
                            <>Scan QR code from wall tile. {floorTile.sellerId && <>Must be from same showroom.</>}</>
                          )}
                        </span>
                      </p>
                    </div>

                  </div>
                </div>
              </section>
            )}

            {/* ═══════════════════════════════════════════════════════ */}
            {/* TILE BORDERS SECTION */}
            {/* ═══════════════════════════════════════════════════════ */}
            {viewMode === 'view' && (
              <section className="bg-gradient-to-br from-orange-900/50 to-red-900/50 rounded-xl p-3 border-2 border-orange-500/40 shadow-lg">
                <button
                  onClick={() => toggleSection('borders')}
                  className="w-full flex items-center justify-between mb-3 lg:cursor-default"
                >
                  <h3 className="text-white font-bold text-sm flex items-center gap-2">
                    <Grid3x3 className="w-4 h-4 text-orange-400" />
                    Tile Borders
                  </h3>
                  {isMobile && (
                    expandedSection === 'borders' ? 
                    <ChevronUp className="w-4 h-4 text-gray-400" /> : 
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  )}
                </button>

                <div className={`space-y-2 ${isMobile && expandedSection !== 'borders' ? 'hidden' : 'block'}`}>
                  <button
                    onClick={() => {
                      setHighlightTileBorders(!highlightTileBorders);
                      
                      if (!highlightTileBorders) {
                        setSuccess('✅ Border lines enabled!');
                        if (navigator.vibrate) {
                          navigator.vibrate([50, 30, 50]);
                        }
                      } else {
                        setSuccess('Border lines disabled');
                      }
                    }}
                    className={`w-full py-2.5 rounded-lg font-bold transition-all flex items-center justify-center gap-2 text-xs sm:text-sm ${
                      highlightTileBorders
                        ? 'bg-gradient-to-r from-orange-600 to-red-600 text-white shadow-lg ring-2 ring-orange-400'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    <Grid3x3 className="w-4 h-4" />
                    {highlightTileBorders ? 'Hide Tile Borders' : 'Show Tile Borders'}
                  </button>

                  <div className="bg-orange-900/30 rounded-lg p-2 border border-orange-500/30">
                    <p className="text-orange-200 text-[10px] leading-relaxed flex items-start gap-1">
                      <Info className="w-3 h-3 flex-shrink-0 mt-0.5" />
                      <span>
                        Toggle to see individual tile boundaries in 3D view
                      </span>
                    </p>
                  </div>
                </div>
              </section>
            )}

            {/* ═══════════════════════════════════════════════════════ */}
            {/* TILE CALCULATOR SECTION */}
            {/* ═══════════════════════════════════════════════════════ */}
            <section className="bg-gradient-to-br from-emerald-900/50 to-green-900/50 rounded-xl p-3 border-2 border-emerald-500/40 shadow-lg">
              <button
                onClick={() => toggleSection('calculator')}
                className="w-full flex items-center justify-between mb-3 lg:cursor-default"
              >
                <h3 className="text-white font-bold text-sm flex items-center gap-2">
                  <Calculator className="w-4 h-4 text-emerald-400" />
                  Tile Calculator
                </h3>
                {isMobile && (
                  expandedSection === 'calculator' ? 
                  <ChevronUp className="w-4 h-4 text-gray-400" /> : 
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                )}
              </button>

              <div className={`space-y-2 ${isMobile && expandedSection !== 'calculator' ? 'hidden' : 'block'}`}>
                <button
                  onClick={() => {
                    setShowTileCalculator(true);
                    if (isMobile) setExpandedSection(null);
                    
                    if (navigator.vibrate) {
                      navigator.vibrate([50, 30, 50]);
                    }
                  }}
                  className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white px-4 py-2.5 rounded-lg shadow-lg transition-all flex items-center justify-center gap-2 text-xs sm:text-sm font-semibold hover:scale-[1.02] active:scale-95"
                >
                  <Calculator className="w-4 h-4" />
                  Open Tile Calculator
                </button>

                <div className="bg-emerald-900/30 rounded-lg p-2 border border-emerald-500/30">
                  <p className="text-emerald-200 text-[10px] leading-relaxed flex items-start gap-1">
                    <Info className="w-3 h-3 flex-shrink-0 mt-0.5" />
                    <span>
                      Calculate tiles for any room with custom dimensions, wastage, and cost estimation
                    </span>
                  </p>
                </div>
              </div>
            </section>

            {/* ═══════════════════════════════════════════════════════ */}
            {/* ACTIONS & CONTROLS SECTION */}
            {/* ═══════════════════════════════════════════════════════ */}
           {/* ═══════════════════════════════════════════════════════ */}
{/* ACTIONS & CONTROLS SECTION */}
{/* ═══════════════════════════════════════════════════════ */}

          </div>
        </aside>
      </div>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* MODALS */}
      {/* ═══════════════════════════════════════════════════════════ */}

      {/* Floor Tile Change Modal */}
    {/* Floor Tile Upload Modal */}
{showFloorChangeModal && (
  <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
    <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 border border-gray-700">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
          <ImageIcon className="w-6 h-6 text-cyan-400" />
          Upload Custom Floor Tile
        </h3>
        <button 
          onClick={() => setShowFloorChangeModal(false)} 
          className="p-2 hover:bg-gray-700 rounded-lg transition-colors text-gray-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Current Floor Tile Info */}
      <div className="bg-gray-800/50 rounded-lg p-4 mb-6 border border-gray-700">
        <p className="text-gray-400 text-xs mb-3">Current Floor Tile:</p>
        <div className="flex items-center gap-3">
          <img 
            src={floorTile.texture || tile.imageUrl} 
            alt={floorTile.tileName || tile.name}
            className="w-20 h-20 object-cover rounded-lg ring-2 ring-blue-500/50"
          />
          <div className="flex-1">
            <p className="text-white font-medium text-sm sm:text-base">{floorTile.tileName || tile.name}</p>
            <p className="text-gray-400 text-xs mt-1">
              Size: {floorTile.size.width}×{floorTile.size.height} cm
            </p>
          </div>
        </div>
      </div>

      {/* Upload Section */}
      <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
        
        {/* Tile Size Selector */}
        <label className="text-gray-300 text-xs font-medium mb-2 block">Select Tile Size:</label>
        <div className="grid grid-cols-3 gap-2 mb-3">
          {FLOOR_TILE_SIZES.map((size) => (
            <button
              key={size.label}
              onClick={() => setTempFloorTileSize(size)}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                tempFloorTileSize.width === size.width && tempFloorTileSize.height === size.height
                  ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white ring-2 ring-cyan-400 shadow-lg'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {size.label}
            </button>
          ))}
        </div>
        
        <p className="text-gray-400 text-xs mb-3">
          Selected: <strong className="text-cyan-400">{tempFloorTileSize.width}×{tempFloorTileSize.height} cm</strong>
        </p>

        {/* Image Upload Component */}
        <div className="bg-gray-900/50 rounded-lg p-3 border border-gray-600">
          <ImageUpload
            currentImage={floorTile.texture}
            onImageUploaded={handleFloorTileUpload}
            placeholder="Click to upload tile image"
            folder="floor-tiles"
          />
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-cyan-900/30 rounded-lg p-3 border border-cyan-500/30 mt-4">
        <p className="text-cyan-200 text-xs flex items-start gap-2 leading-relaxed">
          <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <span>
            <strong>Tip:</strong> Select tile size first, then upload your custom tile image. Image will be applied to the floor in 3D view.
          </span>
        </p>
      </div>

    </div>
  </div>
)}

      {/* Floor Tile QR Scanner */}
      {showFloorQRScanner && (
        <QRScanner
          onScanSuccess={async (data) => {
            if (data.tileId) {
              setShowFloorQRScanner(false);
              await handleFloorTileQRScan(data.tileId);
            } else {
              setError('❌ Invalid QR code');
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

      {/* Wall Tile QR Scanner */}
      {showWallScanner && (
        <QRScanner
          onScanSuccess={async (data) => {
            if (data.tileId) {
              setShowWallScanner(false);
              await loadWallTileFromQR(data.tileId);
            } else {
              setError('❌ Invalid QR code');
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

      {/* Dimension Editor Modal */}
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

      {/* Calculation Dimension Editor Modal */}
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

      {/* Universal Tile Calculator */}
      {tile && (
        <UniversalTileCalculator
          isOpen={showTileCalculator}
          onClose={() => {
            setShowTileCalculator(false);
            
            const latestDims = getCalculationDimensions(roomType || 'kitchen');
            
            const dimsChanged = calculationDims && (
              latestDims.width !== calculationDims.width ||
              latestDims.depth !== calculationDims.depth ||
              latestDims.height !== calculationDims.height
            );
            
            if (dimsChanged) {
              setCalculationDims({ ...latestDims });
              setDimsVersion(prev => prev + 1);
              setSuccess('✅ Dimensions synced from calculator');
            }
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
