

import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Share2, Loader, Upload, Scan, 
  Package, AlertCircle, CheckCircle, X, Info,
  ChevronDown, ChevronUp, Eye, Ruler, ArrowUpDown,
  Calculator, Grid3x3, Layers, TrendingUp
} from 'lucide-react';
import { Enhanced3DViewer } from '../components/Enhanced3DViewer';
import { ImageUpload } from '../components/ImageUpload';
import { QRScanner } from '../components/QRScanner';
import { RoomDimensionModal } from '../components/RoomDimensionModal';
import { getTileById, trackQRScan, saveCustomerInquiry } from '../lib/firebaseutils';  
import { Tile } from '../types';
import { auth, db } from '../lib/firebase';
import { CustomerInquiryForm } from '../components/CustomerInquiryForm';
import { getDoc, doc, collection, query, where, getDocs } from 'firebase/firestore';
import { getCustomerFromSession, isSessionValid } from '../utils/customerSession';
import { useAppStore } from '../stores/appStore';

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

// ═══════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════

const ROOM_CONFIGS = {
  drawing: { 
    width: 15 * 0.3048,
    depth: 20 * 0.3048,
    height: 11 * 0.3048
  },
  kitchen: { 
    width: 10 * 0.3048,
    depth: 12 * 0.3048,
    height: 11 * 0.3048
  },
  bathroom: { 
    width: 8 * 0.3048,
    depth: 10 * 0.3048,
    height: 11 * 0.3048
  }
} as const;

const WALL_SIZES: TileSize[] = [
  { width: 30, height: 45, label: '30×45' },
  { width: 30, height: 60, label: '30×60' },
  { width: 40, height: 80, label: '40×80' },
  { width: 45, height: 45, label: '45×45' },
  { width: 40, height: 60, label: '40×60' },
  { width: 20, height: 20, label: '20×20' }
];

const WALL_TILE_HEIGHTS = [
  { value: 5, label: "5 Feet", description: "Waist Height" },
  { value: 8, label: "8 Feet", description: "Standard Bathroom" },
  { value: 11, label: "11 Feet", description: "Full Wall" }
];

const ROOM_STATE_EXPIRY = 60 * 60 * 1000;

// ═══════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════

// const parseTileSize = (sizeStr: string, type: 'floor' | 'wall'): { width: number; height: number } => {
//   const defaultFloor = { width: 60, height: 60 };
//   const defaultWall = { width: 30, height: 45 };
  
//   if (!sizeStr || typeof sizeStr !== 'string') {
//     console.warn(`⚠️ Invalid tile size input: "${sizeStr}", using default`);
//     return type === 'floor' ? defaultFloor : defaultWall;
//   }

//   try {
//     let cleanSize = sizeStr
//       .toLowerCase()
//       .replace(/\s*cm\s*/gi, '')
//       .replace(/\s*ft\s*/gi, '')
//       .replace(/\s+/g, '')
//       .trim();

//     const parts = cleanSize.split(/[x×X]/);
    
//     if (parts.length === 2) {
//       const width = parseFloat(parts[0]);
//       const height = parseFloat(parts[1]);
      
//       if (!isNaN(width) && !isNaN(height) && width > 0 && height > 0) {
//         console.log(`✅ Parsed tile size: "${sizeStr}" → ${width}×${height} cm`);
//         return { width, height };
//       }
//     }
//   } catch (e) {
//     console.error(`❌ Error parsing tile size "${sizeStr}":`, e);
//   }
  
//   console.warn(`⚠️ Using default ${type} tile size for: "${sizeStr}"`);
//   return type === 'floor' ? defaultFloor : defaultWall;
// };  
// const parseTileSize = (sizeStr: string, type: 'floor' | 'wall'): { width: number; height: number } => {
//   const defaultFloor = { width: 60, height: 60 };
//   const defaultWall = { width: 30, height: 45 };
  
//   if (!sizeStr || typeof sizeStr !== 'string') {
//     console.warn(`⚠️ Invalid tile size input: "${sizeStr}", using default`);
//     return type === 'floor' ? defaultFloor : defaultWall;
//   }

//   try {
//     let cleanSize = sizeStr
//       .toLowerCase()
//       .replace(/\s*cm\s*/gi, '')
//       .replace(/\s*ft\s*/gi, '')
//       .replace(/\s+/g, '')
//       .trim();

//     const parts = cleanSize.split(/[x×X]/);
    
//     if (parts.length === 2) {
//       const width = parseFloat(parts[0]);
//       const height = parseFloat(parts[1]);
      
//       if (!isNaN(width) && !isNaN(height) && width > 0 && height > 0) {
//         console.log(`✅ Parsed tile size: "${sizeStr}" → ${width}×${height} cm`);
//         return { width, height };
//       }
//     }
//   } catch (e) {
//     console.error(`❌ Error parsing tile size "${sizeStr}":`, e);
//   }
  
//   console.warn(`⚠️ Using default ${type} tile size for: "${sizeStr}"`);
//   return type === 'floor' ? defaultFloor : defaultWall;
// };
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
      .replace(/\s*cm\s*/gi, '')
      .replace(/\s*ft\s*/gi, '')
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


// const calculateTileCount = (
//   roomWidth: number,
//   roomDepth: number,
//   roomHeight: number,
//   tileWidthCm: number,
//   tileHeightCm: number,
//   wallHeight?: number
// ): {
//   floor: number;
//   wall_5ft?: number;
//   wall_8ft?: number;
//   wall_11ft?: number;
//   perimeter?: number;
//   tileAreaSqFt?: number;
//   roomAreaSqFt?: number;
// } => {
//   const tileWidthFt = tileWidthCm * 0.0328084;
//   const tileHeightFt = tileHeightCm * 0.0328084;
  
//   const floorArea = roomWidth * roomDepth;
//   const tileArea = tileWidthFt * tileHeightFt;
  
//   const wastageMultiplier = 1.08;
//   const floorTileCount = Math.ceil((floorArea / tileArea) * wastageMultiplier);
  
//   const perimeter = 2 * (roomWidth + roomDepth);
  
//   const result: any = {
//     floor: floorTileCount,
//     perimeter: perimeter,
//     tileAreaSqFt: tileArea,
//     roomAreaSqFt: floorArea
//   };
  
//   if (wallHeight !== undefined) {
//     const wallArea = perimeter * wallHeight;
//     result[`wall_${wallHeight}ft`] = Math.ceil((wallArea / tileArea) * wastageMultiplier);
//   } else {
//     [5, 8, 11].forEach(height => {
//       const wallArea = perimeter * height;
//       result[`wall_${height}ft`] = Math.ceil((wallArea / tileArea) * wastageMultiplier);
//     });
//   }
  
//   return result;
// };  
// const calculateTileCount = (
//   roomWidth: number,
//   roomDepth: number,
//   roomHeight: number,
//   tileWidthCm: number,
//   tileHeightCm: number,
//   wallHeight?: number,
//   roomType?: string
// ): {
//   floor: number;
//   wall_5ft?: number;
//   wall_8ft?: number;
//   wall_11ft?: number;
//   perimeter?: number;
//   tileAreaSqFt?: number;
//   roomAreaSqFt?: number;
// } => {
//   // ============================================
//   // FLOOR TILE CALCULATION
//   // ============================================
//   const tileWidthFt = tileWidthCm * 0.0328084;
//   const tileHeightFt = tileHeightCm * 0.0328084;
  
//   const floorArea = roomWidth * roomDepth;
//   const tileArea = tileWidthFt * tileHeightFt;
  
//   const wastageMultiplier = 1.08;
//   const floorTileCount = Math.ceil((floorArea / tileArea) * wastageMultiplier);
  
//   console.log('🟫 FLOOR CALCULATION:', {
//     room: `${roomWidth.toFixed(1)}ft × ${roomDepth.toFixed(1)}ft`,
//     tile: `${tileWidthCm}cm × ${tileHeightCm}cm`,
//     tileFeet: `${tileWidthFt.toFixed(3)}ft × ${tileHeightFt.toFixed(3)}ft`,
//     floorArea: `${floorArea.toFixed(2)} sq ft`,
//     tileArea: `${tileArea.toFixed(4)} sq ft`,
//     tilesNeeded: Math.ceil(floorArea / tileArea),
//     withWastage: floorTileCount
//   });
  
//   // ============================================
//   // WALL TILE CALCULATION
//   // ============================================
//   let perimeter: number = 0;
  
//   if (roomType === 'kitchen') {
//     perimeter = roomWidth;  // Only back wall
//   } else if (roomType === 'bathroom') {
//     perimeter = 2 * (roomWidth + roomDepth);  // All 4 walls
//   }
  
//   const result: any = {
//     floor: floorTileCount,
//     perimeter: perimeter,
//     tileAreaSqFt: tileArea,
//     roomAreaSqFt: floorArea
//   };
  
//   // Calculate for each wall height
//   if (perimeter > 0) {
//     [5, 8, 11].forEach(height => {
//       const tilesHorizontal = Math.ceil(perimeter / tileWidthFt);
//       const tilesVertical = Math.ceil(height / tileHeightFt);
//       const totalTiles = tilesHorizontal * tilesVertical;
//       const withWastage = Math.ceil(totalTiles * wastageMultiplier);
      
//       result[`wall_${height}ft`] = withWastage;
      
//       console.log(`🧱 WALL ${height}FT:`, {
//         perimeter: `${perimeter.toFixed(1)}ft`,
//         tilesHorizontal,
//         tilesVertical,
//         totalTiles,
//         withWastage
//       });
//     });
//   }
  
//   return result;
// };


const calculateTileCount = (
  roomWidth: number,
  roomDepth: number,
  roomHeight: number,
  tileWidthCm: number,
  tileHeightCm: number,
  wallHeight?: number,
  roomType?: string
): {
  floor: number;
  wall_5ft?: number;
  wall_8ft?: number;
  wall_11ft?: number;
  perimeter?: number;
  tileAreaSqFt?: number;
  roomAreaSqFt?: number;
} => {
  // ============================================
  // FLOOR TILE CALCULATION
  // ============================================
  const tileWidthFt = tileWidthCm * 0.0328084;
  const tileHeightFt = tileHeightCm * 0.0328084;
  
  const floorArea = roomWidth * roomDepth;
  const tileAreaSqFt = tileWidthFt * tileHeightFt;
  
  const wastageMultiplier = 1.08;
  const floorTileCount = Math.ceil((floorArea / tileAreaSqFt) * wastageMultiplier);
  
  console.log('🟫 FLOOR CALCULATION:', {
    room: `${roomWidth.toFixed(1)}ft × ${roomDepth.toFixed(1)}ft`,
    tile: `${tileWidthCm}cm × ${tileHeightCm}cm`,
    tileFeet: `${tileWidthFt.toFixed(6)}ft × ${tileHeightFt.toFixed(6)}ft`,
    floorArea: `${floorArea.toFixed(2)} sq ft`,
    tileArea: `${tileAreaSqFt.toFixed(6)} sq ft`,
    tilesNeeded: Math.ceil(floorArea / tileAreaSqFt),
    withWastage: floorTileCount
  });
  
  // ============================================
  // WALL TILE CALCULATION
  // ============================================
  let perimeter: number = 0;
  
  if (roomType === 'kitchen') {
    perimeter = roomWidth;  // Only back wall
  } else if (roomType === 'bathroom') {
    perimeter = 2 * (roomWidth + roomDepth);  // All 4 walls
  }
  
  const result: any = {
    floor: floorTileCount,
    perimeter: perimeter,
    tileAreaSqFt: tileAreaSqFt,
    roomAreaSqFt: floorArea
  };
  
  // ✅ CORRECTED: Calculate for each wall height using AREA method
  if (perimeter > 0) {
    [5, 8, 11].forEach(height => {
      const wallArea = perimeter * height;
      const tilesNeeded = Math.ceil(wallArea / tileAreaSqFt);
      const withWastage = Math.ceil(tilesNeeded * wastageMultiplier);
      
      result[`wall_${height}ft`] = withWastage;
      
      console.log(`🧱 WALL ${height}FT:`, {
        perimeter: `${perimeter.toFixed(1)}ft`,
        wallArea: `${wallArea.toFixed(2)} sq ft`,
        tileArea: `${tileAreaSqFt.toFixed(6)} sq ft`,
        calculation: `${wallArea.toFixed(2)} ÷ ${tileAreaSqFt.toFixed(6)} = ${tilesNeeded}`,
        withWastage: withWastage
      });
    });
  }
  
  return result;
};
// ═══════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════

export const Room3DViewPage: React.FC = () => {
  const { currentUser } = useAppStore();
  const { tileId, roomType } = useParams<{ tileId: string; roomType: string }>();
  const navigate = useNavigate();
  
  // ═════════════════════════════════════════════════════════════
  // STATE MANAGEMENT
  // ═════════════════════════════════════════════════════════════
  
  const [verifiedUser, setVerifiedUser] = useState<VerifiedUserData | null>(null);
  const [tile, setTile] = useState<Tile | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeSurface, setActiveSurface] = useState<'floor' | 'wall' | 'both'>('both');
  const [showInquiryForm, setShowInquiryForm] = useState(false);
  const [inquiryFormData, setInquiryFormData] = useState<any>(null);
  
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
  
  const [wallTileInputMethod, setWallTileInputMethod] = useState<'upload' | 'qr'>('qr');
  const [showWallScanner, setShowWallScanner] = useState(false);
  const [scannerLoading, setScannerLoading] = useState(false);
  
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [showMobileControls, setShowMobileControls] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [expandedSection, setExpandedSection] = useState<'floor' | 'wall' | 'dimensions' | 'calculator' | null>('floor');
  const [showDimensionEditor, setShowDimensionEditor] = useState(false);

  const [wallTileHeight, setWallTileHeight] = useState<number>(11);

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

  // const getWallDimensions = useCallback((wall: WallType) => {
  //   const config = ROOM_CONFIGS[roomType as keyof typeof ROOM_CONFIGS];
  //   if (!config) return { cols: 0, rows: 0 };
    
  //   const wallTileSize = wallTile.size || { width: 30, height: 45 };
  //   const tileSizeM = { 
  //     width: wallTileSize.width / 100, 
  //     height: wallTileSize.height / 100 
  //   };
    
  //   if (wall === 'back' || wall === 'front') {
  //     return {
  //       cols: Math.ceil(config.width / tileSizeM.width),
  //       rows: Math.ceil(config.height / tileSizeM.height)
  //     };
  //   } else {
  //     return {
  //       cols: Math.ceil(config.depth / tileSizeM.width),
  //       rows: Math.ceil(config.height / tileSizeM.height)
  //     };
  //   }
  // }, [roomType, wallTile.size]);


//   const getWallDimensions = useCallback((wall: WallType, customWallHeight?: number) => {
//   const config = ROOM_CONFIGS[roomType as keyof typeof ROOM_CONFIGS];
//   if (!config) return { cols: 0, rows: 0 };
  
//   const wallTileSize = wallTile.size || { width: 30, height: 45 };
//   const tileSizeM = { 
//     width: wallTileSize.width / 100, 
//     height: wallTileSize.height / 100 
//   };
  
//   // ✅ FIX: Use customWallHeight if provided, otherwise use full room height
//   const heightToUse = customWallHeight 
//     ? customWallHeight * 0.3048  // Convert feet to meters
//     : config.height;
  
//   if (wall === 'back' || wall === 'front') {
//     return {
//       cols: Math.ceil(config.width / tileSizeM.width),
//       rows: Math.ceil(heightToUse / tileSizeM.height)  // ✅ CHANGED
//     };
//   } else {
//     return {
//       cols: Math.ceil(config.depth / tileSizeM.width),
//       rows: Math.ceil(heightToUse / tileSizeM.height)  // ✅ CHANGED
//     };
//   }
// }, [roomType, wallTile.size]);  

// const getWallDimensions = useCallback((wall: WallType, customWallHeight?: number) => {
//   const config = ROOM_CONFIGS[roomType as keyof typeof ROOM_CONFIGS];
//   if (!config) return { cols: 0, rows: 0 };
  
//   const wallTileSize = wallTile.size || { width: 30, height: 45 };
  
//   // Convert tile size to meters
//   const tileSizeM = { 
//     width: wallTileSize.width / 100, 
//     height: wallTileSize.height / 100 
//   };
  
//   // Use custom height if provided, otherwise full room height
//   const heightInMeters = customWallHeight 
//     ? customWallHeight * 0.3048 
//     : config.height;
  
//   // Wall width depends on which wall
//   const wallWidth = (wall === 'back' || wall === 'front') ? config.width : config.depth;
  
//   const cols = Math.ceil(wallWidth / tileSizeM.width);
//   const rows = Math.ceil(heightInMeters / tileSizeM.height);
  
//   console.log(`📐 ${wall} wall @ ${customWallHeight || 'full'}ft:`, {
//     wallWidth: `${wallWidth.toFixed(2)}m`,
//     height: `${heightInMeters.toFixed(2)}m`,
//     tileSize: `${wallTileSize.width}×${wallTileSize.height}cm`,
//     cols,
//     rows,
//     total: cols * rows
//   });
  
//   return { cols, rows };
// }, [roomType, wallTile.size]);
const getWallDimensions = useCallback((wall: WallType, customWallHeight?: number) => {
  const config = ROOM_CONFIGS[roomType as keyof typeof ROOM_CONFIGS];
  if (!config) return { cols: 0, rows: 0 };
  
  const wallTileSize = wallTile.size || { width: 30, height: 45 };
  
  // Convert tile size to feet
  const tileWidthFt = wallTileSize.width * 0.0328084;
  const tileHeightFt = wallTileSize.height * 0.0328084;
  
  // Use custom height if provided, otherwise full room height
  const heightInFeet = customWallHeight || (config.height / 0.3048);
  
  // Wall width depends on which wall
  const wallWidthFeet = (wall === 'back' || wall === 'front') 
    ? (config.width / 0.3048) 
    : (config.depth / 0.3048);
  
  const cols = Math.ceil(wallWidthFeet / tileWidthFt);
  const rows = Math.ceil(heightInFeet / tileHeightFt);
  
  console.log(`📐 ${wall} wall @ ${customWallHeight || 'full'}ft:`, {
    wallWidth: `${wallWidthFeet.toFixed(2)}ft`,
    height: `${heightInFeet.toFixed(2)}ft`,
    tileSize: `${wallTileSize.width}×${wallTileSize.height}cm`,
    tileSizeFt: `${tileWidthFt.toFixed(6)}×${tileHeightFt.toFixed(6)}ft`,
    cols,
    rows,
    total: cols * rows
  });
  
  return { cols, rows };
}, [roomType, wallTile.size]);




  // const calculateHighlighterBreakdown = useCallback((): HighlighterBreakdown | null => {
  //   if (!wallTile.texture || !tileCount) return null;
    
  //   const isKitchenOrBathroom = roomType === 'kitchen' || roomType === 'bathroom';
  //   if (!isKitchenOrBathroom) return null;
    
  //   const walls: WallType[] = roomType === 'kitchen' ? ['back'] : ['back', 'front', 'left', 'right'];
    
  //   const breakdown: HighlighterBreakdown = {
  //     wall_5ft_base: 0,
  //     wall_5ft_highlighter: 0,
  //     wall_8ft_base: 0,
  //     wall_8ft_highlighter: 0,
  //     wall_11ft_base: 0,
  //     wall_11ft_highlighter: 0
  //   };
    
  //   walls.forEach(wall => {
  //     const dims = getWallDimensions(wall);
  //     const highlighterSet = highlighterTileIndices[wall];
      
  //     [5, 8, 11].forEach(height => {
  //       const rowsInHeight = Math.ceil((height / 11) * dims.rows);
  //       let highlighterCount = 0;
        
  //       highlighterSet.forEach(index => {
  //         const row = Math.floor((index - 1) / dims.cols);
  //         if (row < rowsInHeight) {
  //           highlighterCount++;
  //         }
  //       });
        
  //       const totalTilesInArea = dims.cols * rowsInHeight;
  //       const baseTiles = totalTilesInArea - highlighterCount;
        
  //       breakdown[`wall_${height}ft_highlighter` as keyof HighlighterBreakdown] += highlighterCount;
  //       breakdown[`wall_${height}ft_base` as keyof HighlighterBreakdown] += baseTiles;
  //     });
  //   });
    
  //   console.log('📊 Highlighter breakdown:', breakdown);
  //   return breakdown;
  // }, [wallTile.texture, tileCount, roomType, highlighterTileIndices, getWallDimensions]);  


// const calculateHighlighterBreakdown = useCallback((): HighlighterBreakdown | null => {
//   if (!wallTile.texture || !tileCount) return null;
  
//   const isKitchenOrBathroom = roomType === 'kitchen' || roomType === 'bathroom';
//   if (!isKitchenOrBathroom) return null;
  
//   const walls: WallType[] = roomType === 'kitchen' ? ['back'] : ['back', 'front', 'left', 'right'];
  
//   const breakdown: HighlighterBreakdown = {
//     wall_5ft_base: 0,
//     wall_5ft_highlighter: 0,
//     wall_8ft_base: 0,
//     wall_8ft_highlighter: 0,
//     wall_11ft_base: 0,
//     wall_11ft_highlighter: 0
//   };
  
//   walls.forEach(wall => {
//     // ✅ FIX: Calculate dimensions separately for each height
//     [5, 8, 11].forEach(height => {
//       const dims = getWallDimensions(wall, height);  // ✅ PASS HEIGHT
//       const highlighterSet = highlighterTileIndices[wall];
      
//       let highlighterCount = 0;
      
//       // ✅ FIX: Check if highlighter tile exists within current height's tile grid
//       highlighterSet.forEach(index => {
//         const totalTilesForThisHeight = dims.cols * dims.rows;
//         if (index <= totalTilesForThisHeight) {  // ✅ CHANGED LOGIC
//           highlighterCount++;
//         }
//       });
      
//       const totalTilesInArea = dims.cols * dims.rows;
//       const baseTiles = totalTilesInArea - highlighterCount;
      
//       breakdown[`wall_${height}ft_highlighter` as keyof HighlighterBreakdown] += highlighterCount;
//       breakdown[`wall_${height}ft_base` as keyof HighlighterBreakdown] += baseTiles;
//     });
//   });
  
//   console.log('📊 Exact Highlighter Breakdown:', breakdown);
//   return breakdown;
// }, [wallTile.texture, tileCount, roomType, highlighterTileIndices, getWallDimensions]);

// const calculateHighlighterBreakdown = useCallback((): HighlighterBreakdown | null => {
//   if (!wallTile.texture || !tileCount) return null;
  
//   const isKitchenOrBathroom = roomType === 'kitchen' || roomType === 'bathroom';
//   if (!isKitchenOrBathroom) return null;
  
//   // Get room dimensions
//   let dims = getCurrentDimensions();
//   if (!dims) {
//     const defaultConfig = ROOM_CONFIGS[roomType as keyof typeof ROOM_CONFIGS];
//     if (!defaultConfig) return null;
//     dims = {
//       width: defaultConfig.width / 0.3048,
//       depth: defaultConfig.depth / 0.3048,
//       height: defaultConfig.height / 0.3048
//     };
//   }
  
//   // Calculate perimeter
//   const perimeter = roomType === 'kitchen' 
//     ? dims.width 
//     : 2 * (dims.width + dims.depth);
  
//   // Tile size in feet
//   const tileWidthFt = wallTile.size.width * 0.0328084;
//   const tileHeightFt = wallTile.size.height * 0.0328084;
  
//   const breakdown: HighlighterBreakdown = {
//     wall_5ft_base: 0,
//     wall_5ft_highlighter: 0,
//     wall_8ft_base: 0,
//     wall_8ft_highlighter: 0,
//     wall_11ft_base: 0,
//     wall_11ft_highlighter: 0
//   };
  
//   const walls: WallType[] = roomType === 'kitchen' ? ['back'] : ['back', 'front', 'left', 'right'];
  
//   // Calculate for each height
//   [5, 8, 11].forEach(heightFt => {
//     // Calculate grid dimensions for this height
//     const tilesHorizontal = Math.ceil(perimeter / tileWidthFt);
//     const tilesVertical = Math.ceil(heightFt / tileHeightFt);
//     const totalTilesGrid = tilesHorizontal * tilesVertical;
    
//     // Count highlighter tiles
//     let highlighterCount = 0;
    
//     walls.forEach(wall => {
//       const wallDims = getWallDimensions(wall, heightFt);
//       const highlighterSet = highlighterTileIndices[wall];
      
//       highlighterSet.forEach(index => {
//         const row = Math.floor((index - 1) / wallDims.cols);
//         const col = (index - 1) % wallDims.cols;
        
//         // Check if tile is within this height's grid
//         if (row < wallDims.rows && col < wallDims.cols) {
//           highlighterCount++;
//         }
//       });
//     });
    
//     const baseTiles = totalTilesGrid - highlighterCount;
    
//     // Apply 8% wastage
//     const wastage = 1.08;
//     breakdown[`wall_${heightFt}ft_base` as keyof HighlighterBreakdown] = Math.ceil(baseTiles * wastage);
//     breakdown[`wall_${heightFt}ft_highlighter` as keyof HighlighterBreakdown] = Math.ceil(highlighterCount * wastage);
    
//     console.log(`🎨 HIGHLIGHTER ${heightFt}FT:`, {
//       perimeter: perimeter.toFixed(1),
//       tilesH: tilesHorizontal,
//       tilesV: tilesVertical,
//       total: totalTilesGrid,
//       base: baseTiles,
//       highlighter: highlighterCount,
//       baseWithWastage: Math.ceil(baseTiles * wastage),
//       highlighterWithWastage: Math.ceil(highlighterCount * wastage)
//     });
//   });
  
//   console.log('📊 FINAL BREAKDOWN:', breakdown);
//   return breakdown;
// }, [wallTile.texture, wallTile.size, tileCount, roomType, highlighterTileIndices, getWallDimensions, getCurrentDimensions]);

const calculateHighlighterBreakdown = useCallback((): HighlighterBreakdown | null => {
  if (!wallTile.texture || !tileCount) return null;
  
  const isKitchenOrBathroom = roomType === 'kitchen' || roomType === 'bathroom';
  if (!isKitchenOrBathroom) return null;
  
  // Get room dimensions
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
  
  // Calculate perimeter
  const perimeter = roomType === 'kitchen' 
    ? dims.width 
    : 2 * (dims.width + dims.depth);
  
  // Tile size in feet
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
  
  // Calculate for each height
  [5, 8, 11].forEach(heightFt => {
    // ✅ CORRECTED: Use area method
    const wallArea = perimeter * heightFt;
    const totalTilesNeeded = Math.ceil(wallArea / tileAreaSqFt);
    
    // Count highlighter tiles from selected indices
    let highlighterCount = 0;
    
    walls.forEach(wall => {
      const highlighterSet = highlighterTileIndices[wall];
      
      if (highlighterSet && highlighterSet.size > 0) {
        // For each selected tile index, check if it falls within current height
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
    
    // Apply wastage
    breakdown[`wall_${heightFt}ft_base` as keyof HighlighterBreakdown] = Math.ceil(baseTiles * wastageMultiplier);
    breakdown[`wall_${heightFt}ft_highlighter` as keyof HighlighterBreakdown] = Math.ceil(highlighterCount * wastageMultiplier);
    
    console.log(`🎨 HIGHLIGHTER ${heightFt}FT:`, {
      perimeter: perimeter.toFixed(1),
      wallArea: wallArea.toFixed(2),
      tileArea: tileAreaSqFt.toFixed(6),
      totalNeeded: totalTilesNeeded,
      base: baseTiles,
      highlighter: highlighterCount,
      baseWithWastage: Math.ceil(baseTiles * wastageMultiplier),
      highlighterWithWastage: Math.ceil(highlighterCount * wastageMultiplier)
    });
  });
  
  console.log('📊 FINAL BREAKDOWN:', breakdown);
  return breakdown;
}, [wallTile.texture, wallTile.size, tileCount, roomType, highlighterTileIndices, getWallDimensions, getCurrentDimensions]);



useEffect(() => {
  if (wallTile.texture && highlighterBreakdown) {
    console.log('🔍 TILE CALCULATION DEBUG:', {
      selectedHeight: wallTileHeight,
      wallTileSize: wallTile.size,
      breakdown: highlighterBreakdown,
      highlighterIndices: {
        back: Array.from(highlighterTileIndices.back),
        front: Array.from(highlighterTileIndices.front),
        left: Array.from(highlighterTileIndices.left),
        right: Array.from(highlighterTileIndices.right)
      }
    });
  }
}, [wallTile.texture, wallTileHeight, highlighterBreakdown, highlighterTileIndices, wallTile.size]);

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
        setWallTileHeight(state.wallTileHeight || 11);
        
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

  const toggleSection = useCallback((section: 'floor' | 'wall' | 'dimensions' | 'calculator') => {
    setExpandedSection(expandedSection === section ? null : section);
  }, [expandedSection]);

  // ═════════════════════════════════════════════════════════════
  // EFFECTS
  // ═════════════════════════════════════════════════════════════

  // Calculate tiles + highlighter breakdown
  // useEffect(() => {
  //   let dims = getCurrentDimensions();
    
  //   if (!dims) {
  //     const defaultConfig = ROOM_CONFIGS[roomType as keyof typeof ROOM_CONFIGS];
  //     if (defaultConfig) {
  //       dims = {
  //         width: defaultConfig.width / 0.3048,
  //         depth: defaultConfig.depth / 0.3048,
  //         height: defaultConfig.height / 0.3048
  //       };
  //     } else {
  //       return;
  //     }
  //   }

  //   if (floorTile.size && floorTile.size.width > 0 && floorTile.size.height > 0) {
  //     const floorCalc = calculateTileCount(
  //       dims.width,
  //       dims.depth,
  //       dims.height,
  //       floorTile.size.width,
  //       floorTile.size.height
  //     );
      
  //     let wallCalc: any = {};
  //     if (wallTile.size && wallTile.size.width > 0 && wallTile.size.height > 0 && 
  //         (roomType === 'kitchen' || roomType === 'bathroom')) {
        
  //       const wallResult = calculateTileCount(
  //         dims.width,
  //         dims.depth,
  //         dims.height,
  //         wallTile.size.width,
  //         wallTile.size.height
  //       );
  //       wallCalc = {
  //         wall_5ft: wallResult.wall_5ft,
  //         wall_8ft: wallResult.wall_8ft,
  //         wall_11ft: wallResult.wall_11ft,
  //         perimeter: wallResult.perimeter
  //       };
  //     }
      
  //     setTileCount({
  //       floor: floorCalc.floor,
  //       wall_5ft: wallCalc.wall_5ft || 0,
  //       wall_8ft: wallCalc.wall_8ft || 0,
  //       wall_11ft: wallCalc.wall_11ft || 0,
  //       perimeter: wallCalc.perimeter || 0,
  //       tileAreaSqFt: floorCalc.tileAreaSqFt || 0,
  //       roomAreaSqFt: floorCalc.roomAreaSqFt || 0
  //     });
  //   }
  // }, [floorTile.size, wallTile.size, roomType, getCurrentDimensions]);

// Calculate tiles + highlighter breakdown
useEffect(() => {
  let dims = getCurrentDimensions();
  
  if (!dims) {
    const defaultConfig = ROOM_CONFIGS[roomType as keyof typeof ROOM_CONFIGS];
    if (defaultConfig) {
      dims = {
        width: defaultConfig.width / 0.3048,
        depth: defaultConfig.depth / 0.3048,
        height: defaultConfig.height / 0.3048
      };
    } else {
      return;
    }
  }

  if (floorTile.size && floorTile.size.width > 0 && floorTile.size.height > 0) {
    const floorCalc = calculateTileCount(
      dims.width,
      dims.depth,
      dims.height,
      floorTile.size.width,
      floorTile.size.height,
      undefined,
      roomType
    );
    
    let wallCalc: any = {};
    if (wallTile.size && wallTile.size.width > 0 && wallTile.size.height > 0 && 
        (roomType === 'kitchen' || roomType === 'bathroom')) {
      
      const wallResult = calculateTileCount(
        dims.width,
        dims.depth,
        dims.height,
        wallTile.size.width,
        wallTile.size.height,
        undefined,
        roomType
      );
      
      wallCalc = {
        wall_5ft: wallResult.wall_5ft,
        wall_8ft: wallResult.wall_8ft,
        wall_11ft: wallResult.wall_11ft,
        perimeter: wallResult.perimeter
      };
    }
    
    setTileCount({
      floor: floorCalc.floor,
      wall_5ft: wallCalc.wall_5ft || 0,
      wall_8ft: wallCalc.wall_8ft || 0,
      wall_11ft: wallCalc.wall_11ft || 0,
      perimeter: wallCalc.perimeter || 0,
      tileAreaSqFt: floorCalc.tileAreaSqFt || 0,
      roomAreaSqFt: floorCalc.roomAreaSqFt || 0
    });
  }
}, [floorTile.size, wallTile.size, roomType, getCurrentDimensions]);

  // Calculate highlighter breakdown when indices change
  useEffect(() => {
    const breakdown = calculateHighlighterBreakdown();
    setHighlighterBreakdown(breakdown);
  }, [calculateHighlighterBreakdown]);

  // Listen for highlighter updates from Enhanced3DViewer
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
  
  // Prepare verified user
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

  // Check mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Load tile data
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

  // Auto-dismiss notifications
  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        setSuccess(null);
        setError(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [success, error]);

  // Save room state on changes
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

  const loadWallTileFromQR = async (wallTileId: string) => {
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

      setSuccess(`✅ Wall tile: ${wallTileData.name}\n📏 Size: ${parsedWallSize.width}×${parsedWallSize.height}cm\nSelect wall height below`);
      
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
  };

  const handleWallTileUpload = (url: string) => {
    if (!floorTile.sellerId) {
      setError(
        '❌ Floor Tile Required\n\n' +
        'Please scan floor tile first before uploading wall tile.\n\n' +
        'This ensures tiles are from the same showroom.'
      );
      return;
    }
    
    setWallTile({ 
      ...wallTile, 
      texture: url,
      sellerId: floorTile.sellerId,
      tileName: 'Uploaded Wall Tile',
      tileId: undefined,
      source: 'upload'
    });
    
    setSuccess(
      `✅ Wall tile uploaded!\n` +
      `🔒 Locked to ${floorTile.tileName}'s showroom\n` +
      `📏 Select wall height below`
    );
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
      
      {/* ═══════════════════════════════════════════════════════════ */}
      {/* HEADER */}
      {/* ═══════════════════════════════════════════════════════════ */}
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

        {floorTile.sellerId && (
          <div className="bg-blue-600/20 border-t border-blue-500/30 px-3 py-1.5">
            <div className="max-w-7xl mx-auto flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
              <p className="text-blue-200 text-xs">
                🔒 Room locked to: <strong>{floorTile.tileName}</strong> showroom
                {floorTile.size && (
                  <span className="ml-2">| 📏 Tile: <strong>{floorTile.size.width}×{floorTile.size.height}cm</strong></span>
                )}
              </p>
            </div>
          </div>
        )}

        {currentDimensions && (
          <div className="bg-purple-600/20 border-t border-purple-500/30 px-3 py-1.5">
            <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                <p className="text-purple-200 text-xs">
                  📏 Custom size: <strong>{currentDimensions.width}' × {currentDimensions.depth}' × {currentDimensions.height}'</strong>
                </p>
              </div>
              <button
                onClick={() => setShowDimensionEditor(true)}
                className="text-purple-200 hover:text-white text-xs underline transition-colors"
              >
                Edit
              </button>
            </div>
          </div>
        )}

        {wallTile.texture && isKitchenOrBathroom && (
          <div className="bg-yellow-600/20 border-t border-yellow-500/30 px-3 py-1.5">
            <div className="max-w-7xl mx-auto flex items-center gap-2">
              <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
              <p className="text-yellow-200 text-xs">
                🧱 Wall tile height: <strong>{wallTileHeight} feet</strong> (Room: 11 feet)
                {wallTile.size && (
                  <span className="ml-2">| 📏 Tile: <strong>{wallTile.size.width}×{wallTile.size.height}cm</strong></span>
                )}
              </p>
            </div>
          </div>
        )}
      </header>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* INQUIRY FORM MODAL */}
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

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* MAIN CONTENT */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        
        {/* 3D VIEWER */}
        <div className="flex-1 relative min-h-0">
          <Enhanced3DViewer
            roomType={roomType as any}
            floorTile={floorTile}
            wallTile={wallTile}
            activeSurface={activeSurface}
            onSurfaceChange={setActiveSurface}
            currentUser={verifiedUser || undefined}
            wallTileHeight={wallTileHeight}
            highlightTileBorders={highlightTileBorders}
            onHighlighterUpdate={(wall: WallType, indices: number[]) => {
              console.log('🎯 Highlighter update:', wall, indices.length);
              setHighlighterTileIndices(prev => ({
                ...prev,
                [wall]: new Set(indices)
              }));
            }}
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

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* SIDEBAR */}
        {/* ═══════════════════════════════════════════════════════════ */}
        <aside className={`lg:w-72 xl:w-80 bg-gray-800/95 backdrop-blur-sm overflow-y-auto transition-all border-t lg:border-t-0 lg:border-l border-gray-700 flex-shrink-0 ${
          isMobile && !showMobileControls ? 'max-h-0 opacity-0' : 'max-h-[40vh] lg:max-h-full opacity-100'
        }`}>
          <div className="p-2.5 sm:p-3 space-y-2.5">
            
            {/* ═══════════════════════════════════════════════════════ */}
            {/* FLOOR TILE SECTION */}
            {/* ═══════════════════════════════════════════════════════ */}
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
                      
                      {floorTile.size && (
                        <div className="bg-green-900/30 rounded px-1 py-0.5 mt-0.5">
                          <p className="text-green-300 text-[8px] font-mono">
                            Exact: {floorTile.size.width}×{floorTile.size.height}cm
                          </p>
                        </div>
                      )}
                      
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
                      {floorTile.sellerId && (
                        <p className="text-blue-400 text-[8px] mt-0.5 flex items-center gap-0.5">
                          🔒 Showroom: {floorTile.sellerId.substring(0, 8)}...
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* ═══════════════════════════════════════════════════════ */}
            {/* WALL TILE SECTION */}
            {/* ═══════════════════════════════════════════════════════ */}
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
                    <div className="bg-red-900/30 rounded p-1.5 border border-red-500/30 mb-2">
                      <p className="text-red-200 text-[9px] flex items-start gap-1">
                        <AlertCircle className="w-2.5 h-2.5 flex-shrink-0 mt-0.5" />
                        <span><strong>Floor tile must be scanned first!</strong></span>
                      </p>
                    </div>
                  )}
                  
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
                            {wallTile.tileName || 'Wall tile applied'}
                          </p>
                          
                          {wallTile.size && (
                            <div className="bg-green-900/30 rounded px-1 py-0.5 mb-1">
                              <p className="text-green-300 text-[8px] font-mono">
                                Exact: {wallTile.size.width}×{wallTile.size.height}cm
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
                  )}

                  {wallTileInputMethod === 'upload' && (
                    <div className="space-y-1.5">
                      <ImageUpload
                        currentImage={wallTile.texture}
                        onImageUploaded={handleWallTileUpload}
                        placeholder="Upload wall tile"
                        folder="wall-tiles"
                      />
                      <div className="bg-blue-900/30 rounded p-1.5 border border-blue-500/30">
                        <p className="text-blue-200 text-[9px] flex items-start gap-1">
                          <Info className="w-2.5 h-2.5 flex-shrink-0 mt-0.5" />
                          <span>
                            Upload custom wall tile.
                            {floorTile.sellerId && <strong> Will be linked to {floorTile.tileName}'s showroom.</strong>}
                          </span>
                        </p>
                      </div>
                    </div>
                  )}

                  {wallTile.texture && (
                    <>
                      <div className="bg-yellow-900/30 rounded-lg p-2 border-2 border-yellow-500/40">
                        <label className="text-yellow-200 text-[10px] font-bold mb-1.5 flex items-center gap-1 block">
                          <ArrowUpDown className="w-3 h-3" />
                          Wall Tile Height
                        </label>
                        <div className="grid grid-cols-3 gap-1 mb-1.5">
                          {WALL_TILE_HEIGHTS.map((option) => (
                            <button
                              key={option.value}
                              onClick={() => {
                                setWallTileHeight(option.value);
                                setSuccess(`📏 Wall height set to ${option.value} feet`);
                              }}
                              className={`px-2 py-1.5 rounded text-[9px] font-bold transition-all ${
                                wallTileHeight === option.value
                                  ? 'bg-yellow-600 text-white ring-2 ring-yellow-400 scale-105'
                                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                              }`}
                            >
                              {option.label}
                            </button>
                          ))}
                        </div>
                        <div className="bg-gray-800/50 rounded p-1.5">
                          <p className="text-yellow-100 text-[9px] font-medium">
                            {WALL_TILE_HEIGHTS.find(h => h.value === wallTileHeight)?.description}
                          </p>
                          <p className="text-gray-400 text-[8px] mt-0.5">
                            Tiles will cover {wallTileHeight}ft of 11ft wall height
                          </p>
                        </div>
                      </div>
                    </>
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

            {/* ═══════════════════════════════════════════════════════ */}
            {/* TILE CALCULATOR SECTION WITH HIGHLIGHTER BREAKDOWN */}
            {/* ═══════════════════════════════════════════════════════ */}
            {tileCount && (
              <section className="bg-gradient-to-br from-green-900/50 to-emerald-900/50 rounded-lg p-2 border-2 border-green-500/40">
                <button
                  onClick={() => toggleSection('calculator')}
                  className="w-full flex items-center justify-between mb-1.5 lg:cursor-default"
                >
                  <h3 className="text-white font-bold text-[11px] flex items-center gap-1">
                    <Calculator className="w-3 h-3 text-green-400" />
                    Exact Tile Calculator
                  </h3>
                  {isMobile && (expandedSection === 'calculator' ? <ChevronUp className="w-3.5 h-3.5 text-gray-400" /> : <ChevronDown className="w-3.5 h-3.5 text-gray-400" />)}
                </button>

                <div className={`space-y-1.5 ${isMobile && expandedSection !== 'calculator' ? 'hidden' : 'block'}`}>
                  
                  {/* FLOOR TILES COUNT */}
                  <div className="bg-gray-800/80 rounded-lg p-2 border border-green-500/30">
                    <div className="flex items-center justify-between mb-1.5">
                      <p className="text-green-300 text-[10px] font-semibold flex items-center gap-1">
                        <Package className="w-3 h-3" />
                        🟫 Floor Tiles
                      </p>
                      <span className="bg-green-600 text-white px-2.5 py-1 rounded-full text-[11px] font-bold">
                        {tileCount.floor}
                      </span>
                    </div>
                    
                    <div className="text-[8px] text-gray-400 space-y-0.5 bg-gray-900/30 rounded p-1.5">
                      <p className="font-semibold text-green-300">✅ Exact Scanned Tile Size:</p>
                      <p>📏 {floorTile.size.width} × {floorTile.size.height} cm</p>
                      <p>🔲 Per tile: {tileCount.tileAreaSqFt?.toFixed(4)} sq ft</p>
                      <p className="text-green-400 font-bold border-t border-gray-700 pt-0.5 mt-0.5">
                        ✓ Total: {tileCount.floor} tiles (with 8% wastage)
                      </p>
                    </div>
                  </div>

                  {/* WALL TILES WITH HIGHLIGHTER BREAKDOWN */}
                  {isKitchenOrBathroom && wallTile.texture && wallTile.size && highlighterBreakdown && (
                    <div className="bg-gray-800/80 rounded-lg p-2 border border-purple-500/30">
                      <p className="text-purple-300 text-[10px] font-semibold mb-1.5 flex items-center gap-1">
                        <Layers className="w-3 h-3" />
                        🧱 Wall Tiles Breakdown
                        <span className="text-[7px] bg-purple-600/30 px-1 py-0.5 rounded">
                          {roomType === 'kitchen' ? 'Back Wall' : 'All 4 Walls'}
                        </span>
                      </p>
                      
                      <div className="space-y-1.5 mb-2">
                        {[
                          { height: 5, label: '5 Feet', desc: 'Waist height' },
                          { height: 8, label: '8 Feet', desc: 'Standard bathroom' },
                          { height: 11, label: '11 Feet', desc: 'Full wall' }
                        ].map(({ height, label, desc }) => {
                          const baseKey = `wall_${height}ft_base` as keyof HighlighterBreakdown;
                          const highlighterKey = `wall_${height}ft_highlighter` as keyof HighlighterBreakdown;
                          const baseCount = highlighterBreakdown[baseKey];
                          const highlighterCount = highlighterBreakdown[highlighterKey];
                          const totalCount = baseCount + highlighterCount;
                          const highlighterPercent = totalCount > 0 ? (highlighterCount / totalCount * 100).toFixed(1) : '0.0';
                          
                          return (
                            <div 
                              key={height}
                              className={`p-2 rounded transition-all ${
                                wallTileHeight === height 
                                  ? 'bg-gradient-to-r from-yellow-600/40 to-orange-600/40 ring-2 ring-yellow-500 scale-105' 
                                  : 'bg-gray-700/50'
                              }`}
                            >
                              <div className="flex items-center justify-between mb-1.5">
                                <div>
                                  <p className="text-white text-[9px] font-semibold">{label}</p>
                                  <p className="text-gray-400 text-[7px]">{desc}</p>
                                </div>
                                <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${
                                  wallTileHeight === height 
                                    ? 'bg-yellow-600 text-white' 
                                    : 'bg-gray-600 text-gray-300'
                                }`}>
                                  {totalCount}
                                </span>
                              </div>
                              
                              <div className="grid grid-cols-2 gap-1 mt-1.5">
                                <div className="bg-blue-900/40 rounded px-1.5 py-1 border border-blue-500/30">
                                  <p className="text-blue-300 text-[8px] font-semibold flex items-center gap-0.5">
                                    <Package className="w-2 h-2" />
                                    Base Tiles
                                  </p>
                                  <p className="text-blue-100 text-[11px] font-bold">{baseCount}</p>
                                </div>
                                <div className="bg-orange-900/40 rounded px-1.5 py-1 border border-orange-500/30">
                                  <p className="text-orange-300 text-[8px] font-semibold flex items-center gap-0.5">
                                    <TrendingUp className="w-2 h-2" />
                                    Highlighter
                                  </p>
                                  <p className="text-orange-100 text-[11px] font-bold">{highlighterCount}</p>
                                </div>
                              </div>
                              
                              {highlighterCount > 0 && (
                                <div className="mt-1 bg-green-900/30 rounded px-1.5 py-1">
                                  <p className="text-green-300 text-[7px]">
                                    ✅ {highlighterPercent}% highlighter coverage
                                  </p>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>

                      {/* <div className="text-[8px] text-gray-400 space-y-0.5 bg-gray-900/30 rounded p-1.5">
                        <p className="font-semibold text-purple-300">✅ Wall Tile Size:</p>
                        <p>📏 {wallTile.size.width} × {wallTile.size.height} cm</p>
                        
                        <div className="border-t border-gray-700 pt-1 mt-1">
                          <p>Perimeter: {tileCount.perimeter.toFixed(1)} ft</p>
                          <p className="text-yellow-400 font-semibold">
                            ✓ Selected Height: {wallTileHeight}ft
                          </p>
                          
                          <div className="mt-1 space-y-0.5 bg-gray-800/50 rounded p-1">
                            <p className="text-blue-300">
                              • Base tiles: <strong>{
                                wallTileHeight === 5 ? highlighterBreakdown.wall_5ft_base :
                                wallTileHeight === 8 ? highlighterBreakdown.wall_8ft_base :
                                highlighterBreakdown.wall_11ft_base
                              }</strong>
                            </p>
                            <p className="text-orange-300">
                              • Highlighter tiles: <strong>{
                                wallTileHeight === 5 ? highlighterBreakdown.wall_5ft_highlighter :
                                wallTileHeight === 8 ? highlighterBreakdown.wall_8ft_highlighter :
                                highlighterBreakdown.wall_11ft_highlighter
                              }</strong>
                            </p>
                            <p className="text-green-400 font-bold border-t border-gray-700 pt-0.5 mt-0.5">
                              = Total: {
                                wallTileHeight === 5 ? 
                                  (highlighterBreakdown.wall_5ft_base + highlighterBreakdown.wall_5ft_highlighter) :
                                wallTileHeight === 8 ? 
                                  (highlighterBreakdown.wall_8ft_base + highlighterBreakdown.wall_8ft_highlighter) :
                                  (highlighterBreakdown.wall_11ft_base + highlighterBreakdown.wall_11ft_highlighter)
                              } tiles (with 8% wastage)
                            </p>
                          </div>
                        </div>
                      </div> */} 


                      <div className="text-[8px] text-gray-400 space-y-0.5 bg-gray-900/30 rounded p-1.5">
  <p className="font-semibold text-purple-300">✅ Wall Tile Size:</p>
  <p>📏 {wallTile.size.width} × {wallTile.size.height} cm</p>
  <p className="text-green-300">
    = {(wallTile.size.width * 0.0328084).toFixed(3)} × {(wallTile.size.height * 0.0328084).toFixed(3)} ft
  </p>
  
  <div className="border-t border-gray-700 pt-1 mt-1">
    <p className="text-blue-300">Perimeter: {tileCount.perimeter.toFixed(1)} ft</p>
    <p className="text-yellow-400 font-semibold">
      ✓ Selected: {wallTileHeight}ft height
    </p>
    
    <div className="mt-1 space-y-0.5 bg-gray-800/50 rounded p-1">
      <p className="text-green-400 font-semibold">📐 Calculation:</p>
      <p className="text-gray-300 text-[7px]">
        Horizontal: {tileCount.perimeter.toFixed(1)} ÷ {(wallTile.size.width * 0.0328084).toFixed(3)} 
        = {Math.ceil(tileCount.perimeter / (wallTile.size.width * 0.0328084))} tiles
      </p>
      <p className="text-gray-300 text-[7px]">
        Vertical: {wallTileHeight} ÷ {(wallTile.size.height * 0.0328084).toFixed(3)} 
        = {Math.ceil(wallTileHeight / (wallTile.size.height * 0.0328084))} tiles
      </p>
      
      {highlighterBreakdown && (
        <>
          <div className="border-t border-gray-600 mt-1 pt-1">
            <p className="text-blue-300 text-[7px]">
              • Base: <strong>{
                wallTileHeight === 5 ? highlighterBreakdown.wall_5ft_base :
                wallTileHeight === 8 ? highlighterBreakdown.wall_8ft_base :
                highlighterBreakdown.wall_11ft_base
              }</strong>
            </p>
            <p className="text-orange-300 text-[7px]">
              • Highlighter: <strong>{
                wallTileHeight === 5 ? highlighterBreakdown.wall_5ft_highlighter :
                wallTileHeight === 8 ? highlighterBreakdown.wall_8ft_highlighter :
                highlighterBreakdown.wall_11ft_highlighter
              }</strong>
            </p>
          </div>
          <p className="text-green-400 font-bold border-t border-gray-700 pt-0.5 mt-0.5">
            = Total: {
              wallTileHeight === 5 ? 
                (highlighterBreakdown.wall_5ft_base + highlighterBreakdown.wall_5ft_highlighter) :
              wallTileHeight === 8 ? 
                (highlighterBreakdown.wall_8ft_base + highlighterBreakdown.wall_8ft_highlighter) :
                (highlighterBreakdown.wall_11ft_base + highlighterBreakdown.wall_11ft_highlighter)
            } tiles
          </p>
          <p className="text-gray-400 text-[7px]">(includes 8% wastage)</p>
        </>
      )}
    </div>
  </div>
</div>
                    </div>
                  )}

                  {/* Highlight Borders Button */}
                  <button
                    onClick={() => {
                      setHighlightTileBorders(!highlightTileBorders);
                      setSuccess(highlightTileBorders ? '❌ Tile borders hidden' : '✅ Tile borders visible');
                      if (navigator.vibrate) {
                        navigator.vibrate(highlightTileBorders ? 100 : [100, 50, 100]);
                      }
                    }}
                    className={`w-full py-2 rounded-lg font-semibold text-[10px] transition-all flex items-center justify-center gap-1.5 ${
                      highlightTileBorders
                        ? 'bg-gradient-to-r from-red-600 to-orange-600 text-white shadow-lg ring-2 ring-red-400'
                        : 'bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:shadow-lg'
                    }`}
                  >
                    <Grid3x3 className="w-3.5 h-3.5" />
                    {highlightTileBorders ? 'Hide Tile Borders' : 'Show Tile Borders'}
                  </button>

                  {highlightTileBorders && (
                    <div className="bg-green-900/40 rounded-lg p-2 border border-green-500/40 animate-pulse">
                      <p className="text-green-200 text-[8px] flex items-start gap-1">
                        <Info className="w-2.5 h-2.5 flex-shrink-0 mt-0.5" />
                        <span>
                          <strong>Counting Mode Active:</strong> Rotate camera 360° to count tiles on each surface.
                        </span>
                      </p>
                    </div>
                  )}

                  <div className="bg-blue-900/30 rounded-lg p-2 border border-blue-500/30">
                    <p className="text-blue-200 text-[8px] flex items-start gap-1">
                      <Info className="w-2.5 h-2.5 flex-shrink-0 mt-0.5" />
                      <span>
                        <strong>How it works:</strong>
                        <br/>• Floor = EXACT scanned size
                        <br/>• Wall = Base + Highlighter tiles
                        <br/>• Highlighter = Manual selection
                        <br/>• Auto 8% wastage included
                        {isKitchenOrBathroom && wallTile.texture && (
                          <><br/>• Wall = {roomType === 'kitchen' ? 'Back wall only' : 'All 4 walls'}</>
                        )}
                      </span>
                    </p>
                  </div>
                </div>
              </section>
            )}

            {/* ═══════════════════════════════════════════════════════ */}
            {/* ROOM DIMENSIONS SECTION */}
            {/* ═══════════════════════════════════════════════════════ */}
            {currentDimensions && (
              <section className="bg-gray-900/50 rounded-lg p-2 border-2 border-yellow-500/30">
                <button
                  onClick={() => toggleSection('dimensions')}
                  className="w-full flex items-center justify-between mb-1.5 lg:cursor-default"
                >
                  <h3 className="text-white font-bold text-[11px] flex items-center gap-1">
                    <Ruler className="w-3 h-3 text-yellow-400" />
                    Room Dimensions
                  </h3>
                  {isMobile && (expandedSection === 'dimensions' ? <ChevronUp className="w-3.5 h-3.5 text-gray-400" /> : <ChevronDown className="w-3.5 h-3.5 text-gray-400" />)}
                </button>

                <div className={`space-y-1.5 ${isMobile && expandedSection !== 'dimensions' ? 'hidden' : 'block'}`}>
                  <div className="bg-gray-800 rounded p-1.5 border border-gray-700">
                    <div className="text-white text-[10px] space-y-0.5">
                      <p>Width: <span className="text-yellow-400 font-semibold">{currentDimensions.width}'</span></p>
                      <p>Depth: <span className="text-yellow-400 font-semibold">{currentDimensions.depth}'</span></p>
                      <p>Height: <span className="text-yellow-400 font-semibold">{currentDimensions.height}'</span></p>
                      <div className="border-t border-gray-700 mt-1 pt-1">
                        <p className="text-green-400 text-[9px]">
                          Area: <strong>{(currentDimensions.width * currentDimensions.depth).toFixed(1)} sq ft</strong>
                        </p>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowDimensionEditor(true)}
                    className="w-full bg-yellow-600 text-white py-1.5 rounded text-[10px] font-semibold hover:bg-yellow-700 transition-colors flex items-center justify-center gap-1"
                  >
                    <Ruler className="w-3 h-3" />
                    Change Dimensions
                  </button>
                </div>
              </section>
            )}

            {/* ═══════════════════════════════════════════════════════ */}
            {/* VIEW MODE SECTION */}
            {/* ═══════════════════════════════════════════════════════ */}
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

            {/* ═══════════════════════════════════════════════════════ */}
            {/* FEATURES SECTION */}
            {/* ═══════════════════════════════════════════════════════ */}
            <div className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 rounded-lg p-2 border border-blue-500/30">
              <h4 className="text-white font-semibold mb-1 flex items-center gap-1 text-[10px]">
                <Scan className="w-2.5 h-2.5" />
                Features
              </h4>
              <ul className="space-y-0.5 text-[9px] text-gray-300">
                <li className="flex items-start gap-1">
                  <span className="text-green-400 flex-shrink-0">✓</span>
                  <span>Exact tile size from QR scan</span>
                </li>
                <li className="flex items-start gap-1">
                  <span className="text-green-400 flex-shrink-0">✓</span>
                  <span>Precise tile count calculation</span>
                </li>
                <li className="flex items-start gap-1">
                  <span className="text-orange-400 flex-shrink-0">🎨</span>
                  <span>Base + Highlighter tile breakdown</span>
                </li>
                <li className="flex items-start gap-1">
                  <span className="text-purple-400 flex-shrink-0">🔒</span>
                  <span>Wall tile must match showroom</span>
                </li>
                <li className="flex items-start gap-1">
                  <span className="text-yellow-400 flex-shrink-0">📏</span>
                  <span>Adjustable wall height (5/8/11 ft)</span>
                </li>
                <li className="flex items-start gap-1">
                  <span className="text-green-400 flex-shrink-0">🔢</span>
                  <span>Auto 8% wastage calculation</span>
                </li>
                <li className="flex items-start gap-1">
                  <span className="text-blue-400 flex-shrink-0">🎨</span>
                  <span>Visual tile border highlights</span>
                </li>
                <li className="flex items-start gap-1">
                  <span className="text-orange-400 flex-shrink-0">💾</span>
                  <span>Auto-saved for 1 hour</span>
                </li>
              </ul>
            </div>

          </div>
        </aside>
      </div>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* MODALS */}
      {/* ═══════════════════════════════════════════════════════════ */}
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

      {showDimensionEditor && (
        <RoomDimensionModal
          isOpen={showDimensionEditor}
          onClose={() => setShowDimensionEditor(false)}
          onSubmit={handleDimensionUpdate}
          roomName={roomType?.charAt(0).toUpperCase() + roomType?.slice(1) || 'Room'}
          defaultWidth={currentDimensions?.width || 10}
          defaultDepth={currentDimensions?.depth || 12}
          defaultHeight={currentDimensions?.height || 11}
        />
      )}
    </div>
  );
};