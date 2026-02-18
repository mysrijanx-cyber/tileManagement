
import React, { useState, useEffect, Suspense, useMemo, useRef, useCallback } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import { auth } from '../lib/firebase';  // ✅ ADD IF MISSING
import * as THREE from 'three';
import { 
  Maximize2, 
  Minimize2, 
  RotateCcw, 
  Info, 
  Menu ,
  Camera, 
  Settings,
  Package,
  Highlighter,
  Grid3x3,
  QrCode,
  Check,
  X,
  Upload,
  Layers,
  Shuffle,
  Hash,
  Loader,
  AlertCircle,
  ImageIcon
} from 'lucide-react';
import { getCalculationDimensions, scalePatternCount, VISUAL_CONFIGS } from '../utils/dimensionHelpers';
import { LuxuryDrawingRoomScene } from './LuxuryDrawingRoomScene';
import { QRScanner } from './QRScanner';
import { getTileById, getTileByCode } from '../lib/firebaseutils';



// ═══════════════════════════════════════════════════════════════
// INTERFACES & TYPES
// ═══════════════════════════════════════════════════════════════

type PatternType = 'vertical' | 'horizontal' | 'diagonal' | 'checkerboard' | 'random' | 'border' | 'corners' | 'cross';
interface PatternConfig {
  type: PatternType;
  name: string;
  icon: string;
  description: string;
  coverage: string;
}
interface RoomDimensions {
  width: number;
  depth: number;
  height: number;
}
interface SceneProps {
  floorTexture: THREE.Texture | null;
  floorTileSize: { width: number; height: number };
  wallTexture: THREE.Texture | null;
  wallTileSize: { width: number; height: number };
  showWallTiles: boolean;
  quality: QualityLevel;
  isGridMode: boolean;
  activeWall: WallType | null;
  selectedTiles: number[];
  onTileClick: (index: number) => void;
  customTiles: WallCustomTiles;
  roomDimensions?: {
    width: number;
    depth: number;
    height: number;
  };
  furnitureScale?: {
    x: number;
    y: number;
    z: number;
  };
   wallTileHeight?: number;
}

// ✅ NEW: Proper interface for currentUser
interface CurrentUserData {
  uid?: string;           // From Firebase Auth
  user_id?: string;       // From Firestore/AppStore
  email?: string | null;
  role?: string;
  seller_id?: string;
  showroom_id?: string;
}
const PATTERN_CONFIGS: PatternConfig[] = [
  {
    type: 'vertical',
    name: 'Vertical Stripes',
    icon: '▥',
    description: '2 tiles + 1 gap pattern',
    coverage: '~65%'
  },
  {
    type: 'horizontal',
    name: 'Horizontal Stripes',
    icon: '▤',
    description: 'Row-wise pattern',
    coverage: '~65%'
  },
  {
    type: 'diagonal',
    name: 'Diagonal Lines',
    icon: '⧅',
    description: 'Slant pattern',
    coverage: '~50%'
  },
  {
    type: 'checkerboard',
    name: 'Checkerboard',
    icon: '▦',
    description: 'Chess pattern',
    coverage: '~50%'
  },
  {
    type: 'random',
    name: 'Random Scatter',
    icon: '⚹',
    description: 'Random 60% tiles',
    coverage: '~60%'
  },
  {
    type: 'border',
    name: 'Border Frame',
    icon: '⊞',
    description: 'Edge tiles only',
    coverage: '~30%'
  },
  {
    type: 'corners',
    name: 'Corner Focus',
    icon: '⊡',
    description: 'Corner areas',
    coverage: '~40%'
  },
  {
    type: 'cross',
    name: 'Cross Pattern',
    icon: '✚',
    description: 'Center cross',
    coverage: '~35%'
  }
];


// interface Enhanced3DViewerProps {
//   roomType: 'drawing' | 'kitchen' | 'bathroom';
//   floorTile?: {
//     texture?: string;
//     size: { width: number; height: number };
//   };
//   wallTile?: {
//     texture?: string;
//     size: { width: number; height: number };
//   };
//   activeSurface: 'floor' | 'wall' | 'both';
//   onSurfaceChange?: (surface: 'floor' | 'wall' | 'both') => void;
//     // currentUser?: any;
//     currentUser?: CurrentUserData;
//     wallTileHeight?: number;
//     highlightTileBorders?: boolean;
//    onHighlighterUpdate?: (wall: 'back' | 'front' | 'left' | 'right', indices: number[]) => void;
// }

interface Enhanced3DViewerProps {
  roomType: 'drawing' | 'kitchen' | 'bathroom';
  floorTile?: {
    texture?: string;
    size: { width: number; height: number };
  };
  wallTile?: {
    texture?: string;
    size: { width: number; height: number };
  };
  activeSurface: 'floor' | 'wall' | 'both';
  onSurfaceChange?: (surface: 'floor' | 'wall' | 'both') => void;
  currentUser?: CurrentUserData;
  wallTileHeight?: number;
  highlightTileBorders?: boolean;
  onHighlighterUpdate?: (wall: 'back' | 'front' | 'left' | 'right', indices: number[]) => void;
  calculationDimensions?: { width: number; depth: number; height: number }; // ✅ ADD: Calculation dimensions prop
}

interface CameraPreset {
  position: [number, number, number];
  target: [number, number, number];
  name: string;
  fov: number;
}

interface TileData {
  index: number;
  row: number;
  col: number;
  position: [number, number, number];
  texture: string | null;
  isCustom: boolean;
}

interface QRScanResult {
  tileId: string;
  tileName: string;
  imageUrl: string;
  size: { width: number; height: number };
}

type QualityLevel = 'ultra' | 'high' | 'medium' | 'low';
type WallType = 'back' | 'front' | 'left' | 'right';
type UploadMode = 'select' | 'upload' | 'qr' | 'manual';

interface WallCustomTiles {
  back: Map<number, THREE.Texture>;
  front: Map<number, THREE.Texture>;
  left: Map<number, THREE.Texture>;
  right: Map<number, THREE.Texture>;
}

interface TileUploadData {
  imageUrl: string;
  tileId: string;
  tileName: string;
  size: { width: number; height: number };
}

// ═══════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════

const ROOM_CONFIGS = {
  drawing: { 
    width: 12 * 0.3048,   // 12 feet
    depth: 14 * 0.3048,   // 14 feet
    height: 9 * 0.3048    // 9 feet
  },
  kitchen: { 
    width: 30 * 0.3048,   // 10 feet
    depth: 20 * 0.3048,   // 12 feet
    height: 12 * 0.3048    // 9 feet
  },
  bathroom: { 
    width: 15 * 0.3048,    // 8 feet
    depth: 15 * 0.3048,   // 10 feet
    height: 11 * 0.3048    // 9 feet
  }
} as const;

const CAMERA_PRESETS: Record<string, CameraPreset[]> = {
  drawing: [
    { name: 'Luxury View', position: [5, 2, 6], target: [0, 1.2, 0], fov: 45 },
    { name: 'Sofa Area', position: [-3, 1.8, 4], target: [0, 1, 2], fov: 48 },
    { name: 'Full Room', position: [6, 3, 0], target: [0, 1.5, 0], fov: 55 },
  ],
  kitchen: [
    { name: 'Hotel View', position: [5, 2.5, 6], target: [0, 1.2, 0], fov: 50 },
    { name: 'Island Focus', position: [0, 2, 4.5], target: [0, 1, 0], fov: 48 },
    { name: 'Counter View', position: [-4, 2.2, 4], target: [0, 1, -2], fov: 50 },
    { name: 'Full Kitchen', position: [6, 3, 0], target: [0, 1.5, 0], fov: 55 },
  ],
  bathroom: [
    { name: 'Full View', position: [2.5, 2, 2.5], target: [0, 1.2, 0], fov: 55 },
    { name: 'Vanity Area', position: [0, 1.5, 2], target: [0, 1.5, -1.5], fov: 50 },
    { name: 'Shower Zone', position: [1.5, 1.4, 0], target: [-1.2, 1.2, -1], fov: 45 },
    { name: 'Toilet Area', position: [1.8, 1.2, 0.8], target: [0.9, 0.5, 1.2], fov: 48 },
  ],
};

// const generateVerticalStripesPattern = (cols: number, rows: number, randomOffset: number = 0): number[] => {
//   const selectedIndices: number[] = [];
  
//   for (let row = 0; row < rows; row++) {
//     for (let col = 0; col < cols; col++) {
//       const index = (row * cols) + col + 1;
//       const pattern = (col + randomOffset) % 3;
//       if (pattern === 0 || pattern === 1) {
//         selectedIndices.push(index);
//       }
//     }
//   }
  
//   return selectedIndices;
// };

const generateVerticalStripesPattern = (cols: number, rows: number, randomOffset: number = 0): number[] => {
  const selectedIndices: number[] = [];
  
  for (let row = 0; row < rows; row++) {
    const visualRow = rows - 1 - row;  // 👈 Y-AXIS INVERSION FIX
    for (let col = 0; col < cols; col++) {
      const index = (visualRow * cols) + col + 1;  // 👈 Use visualRow
      const pattern = (col + randomOffset) % 3;
      if (pattern === 0 || pattern === 1) {
        selectedIndices.push(index);
      }
    }
  }
  
  console.log(`✅ Vertical pattern: ${selectedIndices.length} tiles (${cols}×${rows})`);
  return selectedIndices;
};

// Add function to get dimensions from localStorage
const getRoomDimensions = (roomType: string): RoomDimensions | null => {
  try {
    const stored = localStorage.getItem(`room_dimensions_${roomType}`);
    if (!stored) return null;
    
    const data = JSON.parse(stored);
    const age = Date.now() - (data.timestamp || 0);
    
    if (age < 24 * 60 * 60 * 1000) {
      return {
        width: data.width,
        depth: data.depth,
        height: data.height
      };
    } else {
      localStorage.removeItem(`room_dimensions_${roomType}`);
      return null;
    }
  } catch {
    return null;
  }
};
const convertFeetToUnits = (feet: number): number => {
  return feet * 0.3048;
};




const verifyTileSeller = (tileData: any, currentUser: any): boolean => {
  // ✅ Check 1: User object exists
  if (!currentUser) {
    console.error('🔒 SECURITY: No user object provided', {
      timestamp: new Date().toISOString()
    });
    return false;
  }
  
  // ✅ CRITICAL FIX: Extract Worker's SELLER_ID (not worker's UID)
  // Priority: seller_id > sellerId > uid > user_id
  const workerSellerId = currentUser.seller_id ||     // ✅ PRIMARY (from Firestore)
                         currentUser.sellerId ||       // ✅ FALLBACK 1
                         currentUser.uid ||            // ⚠️ FALLBACK 2 (for direct sellers)
                         currentUser.user_id;          // ⚠️ FALLBACK 3
  
  if (!workerSellerId) {
    console.error('🔒 SECURITY: Worker has no seller ID', {
      providedFields: Object.keys(currentUser),
      hasSellerId: 'seller_id' in currentUser,
      hasUid: 'uid' in currentUser,
      timestamp: new Date().toISOString()
    });
    return false;
  }
  
  // ✅ Check 3: Extract tile's seller ID
  const tileSellerId = (tileData as any)?.seller_id || 
                       (tileData as any)?.sellerId || 
                       (tileData as any)?.created_by ||
                       (tileData as any)?.createdBy;
  
  if (!tileSellerId) {
    console.error('🔒 SECURITY: Tile has no seller ID', {
      tileId: tileData?.id || 'unknown',
      tileName: tileData?.name || 'unknown',
      tileFields: Object.keys(tileData || {}),
      timestamp: new Date().toISOString()
    });
    return false;
  }
  
  // ✅ CORRECT COMPARISON:
  // Compare Worker's SELLER_ID with Tile's SELLER_ID
  const isAuthorized = tileSellerId === workerSellerId;
  
  if (!isAuthorized) {
    console.error('🔒 SECURITY BLOCK: Seller mismatch detected', {
      attemptedTile: tileData?.id || 'unknown',
      tileName: tileData?.name || 'unknown',
      tileSeller: tileSellerId,
      workerSellerId: workerSellerId,  // ✅ NOW SHOWING SELLER_ID, NOT UID
      workerUid: currentUser.uid || currentUser.user_id || 'unknown',  // ✅ Separate for debugging
      blocked: true,
      timestamp: new Date().toISOString()
    });
  } else {
    console.log('✅ SECURITY PASS: Seller verified', {
      tileId: tileData?.id,
      tileName: tileData?.name,
      sellerId: workerSellerId,
      timestamp: new Date().toISOString()
    });
  }
  
  return isAuthorized;
};


// Horizontal Stripes
// const generateHorizontalStripesPattern = (cols: number, rows: number, randomOffset: number = 0): number[] => {
//   const selectedIndices: number[] = [];
  
//   for (let row = 0; row < rows; row++) {
//     for (let col = 0; col < cols; col++) {
//       const index = (row * cols) + col + 1;
//       const pattern = (row + randomOffset) % 3;
//       if (pattern === 0 || pattern === 1) {
//         selectedIndices.push(index);
//       }
//     }
//   }
  
//   return selectedIndices;
// };


const generateHorizontalStripesPattern = (cols: number, rows: number, randomOffset: number = 0): number[] => {
  const selectedIndices: number[] = [];
  
  for (let row = 0; row < rows; row++) {
    const visualRow = rows - 1 - row;  // 👈 FIX
    for (let col = 0; col < cols; col++) {
      const index = (visualRow * cols) + col + 1;  // 👈 FIX
      const pattern = (row + randomOffset) % 3;  // Note: Use original row for pattern logic
      if (pattern === 0 || pattern === 1) {
        selectedIndices.push(index);
      }
    }
  }
  
  console.log(`✅ Horizontal pattern: ${selectedIndices.length} tiles (${cols}×${rows})`);
  return selectedIndices;
};

// Diagonal Pattern
// const generateDiagonalPattern = (cols: number, rows: number, randomOffset: number = 0): number[] => {
//   const selectedIndices: number[] = [];
  
//   for (let row = 0; row < rows; row++) {
//     for (let col = 0; col < cols; col++) {
//       const index = (row * cols) + col + 1;
//       const diagonal = (row + col + randomOffset) % 4;
//       if (diagonal === 0 || diagonal === 1) {
//         selectedIndices.push(index);
//       }
//     }
//   }
  
//   return selectedIndices;
// };


const generateDiagonalPattern = (cols: number, rows: number, randomOffset: number = 0): number[] => {
  const selectedIndices: number[] = [];
  
  for (let row = 0; row < rows; row++) {
    const visualRow = rows - 1 - row;  // 👈 FIX
    for (let col = 0; col < cols; col++) {
      const index = (visualRow * cols) + col + 1;  // 👈 FIX
      const diagonal = (row + col + randomOffset) % 4;  // Use original row for logic
      if (diagonal === 0 || diagonal === 1) {
        selectedIndices.push(index);
      }
    }
  }
  
  console.log(`✅ Diagonal pattern: ${selectedIndices.length} tiles (${cols}×${rows})`);
  return selectedIndices;
};

// Checkerboard Pattern
// const generateCheckerboardPattern = (cols: number, rows: number, invert: boolean = false): number[] => {
//   const selectedIndices: number[] = [];
  
//   for (let row = 0; row < rows; row++) {
//     for (let col = 0; col < cols; col++) {
//       const index = (row * cols) + col + 1;
//       const isEven = (row + col) % 2 === 0;
//       if (invert ? !isEven : isEven) {
//         selectedIndices.push(index);
//       }
//     }
//   }
  
//   return selectedIndices;
// };

const generateCheckerboardPattern = (cols: number, rows: number, invert: boolean = false): number[] => {
  const selectedIndices: number[] = [];
  
  for (let row = 0; row < rows; row++) {
    const visualRow = rows - 1 - row;  // 👈 FIX
    for (let col = 0; col < cols; col++) {
      const index = (visualRow * cols) + col + 1;  // 👈 FIX
      const isEven = (row + col) % 2 === 0;  // Use original row for logic
      if (invert ? !isEven : isEven) {
        selectedIndices.push(index);
      }
    }
  }
  
  console.log(`✅ Checkerboard pattern: ${selectedIndices.length} tiles (${cols}×${rows})`);
  return selectedIndices;
};

// Random Scatter Pattern
// const generateRandomPattern = (cols: number, rows: number, density: number = 0.6, seed: number = 0): number[] => {
//   const selectedIndices: number[] = [];
//   const totalTiles = cols * rows;
  
//   // Seeded random for reproducibility
//   let random = seed;
//   const seededRandom = () => {
//     random = (random * 9301 + 49297) % 233280;
//     return random / 233280;
//   };
  
//   for (let i = 1; i <= totalTiles; i++) {
//     if (seededRandom() < density) {
//       selectedIndices.push(i);
//     }
//   }
  
//   return selectedIndices;
// };


const generateRandomPattern = (cols: number, rows: number, density: number = 0.6, seed: number = 0): number[] => {
  const selectedIndices: number[] = [];
  
  let random = seed;
  const seededRandom = () => {
    random = (random * 9301 + 49297) % 233280;
    return random / 233280;
  };
  
  for (let row = 0; row < rows; row++) {
    const visualRow = rows - 1 - row;  // 👈 FIX
    for (let col = 0; col < cols; col++) {
      const index = (visualRow * cols) + col + 1;  // 👈 FIX
      if (seededRandom() < density) {
        selectedIndices.push(index);
      }
    }
  }
  
  console.log(`✅ Random pattern: ${selectedIndices.length} tiles (${cols}×${rows})`);
  return selectedIndices;
};
// Border Frame Pattern
// const generateBorderPattern = (cols: number, rows: number, thickness: number = 1): number[] => {
//   const selectedIndices: number[] = [];
  
//   for (let row = 0; row < rows; row++) {
//     for (let col = 0; col < cols; col++) {
//       const index = (row * cols) + col + 1;
      
//       const isTopBorder = row < thickness;
//       const isBottomBorder = row >= rows - thickness;
//       const isLeftBorder = col < thickness;
//       const isRightBorder = col >= cols - thickness;
      
//       if (isTopBorder || isBottomBorder || isLeftBorder || isRightBorder) {
//         selectedIndices.push(index);
//       }
//     }
//   }
  
//   return selectedIndices;
// };

const generateBorderPattern = (cols: number, rows: number, thickness: number = 1): number[] => {
  const selectedIndices: number[] = [];
  
  for (let row = 0; row < rows; row++) {
    const visualRow = rows - 1 - row;  // 👈 FIX
    for (let col = 0; col < cols; col++) {
      const index = (visualRow * cols) + col + 1;  // 👈 FIX
      
      const isTopBorder = row < thickness;
      const isBottomBorder = row >= rows - thickness;
      const isLeftBorder = col < thickness;
      const isRightBorder = col >= cols - thickness;
      
      if (isTopBorder || isBottomBorder || isLeftBorder || isRightBorder) {
        selectedIndices.push(index);
      }
    }
  }
  
  console.log(`✅ Border pattern: ${selectedIndices.length} tiles (${cols}×${rows})`);
  return selectedIndices;
};

// Corner Focus Pattern
// const generateCornerPattern = (cols: number, rows: number, size: number = 3): number[] => {
//   const selectedIndices: number[] = [];
  
//   for (let row = 0; row < rows; row++) {
//     for (let col = 0; col < cols; col++) {
//       const index = (row * cols) + col + 1;
      
//       const isTopLeft = row < size && col < size;
//       const isTopRight = row < size && col >= cols - size;
//       const isBottomLeft = row >= rows - size && col < size;
//       const isBottomRight = row >= rows - size && col >= cols - size;
      
//       if (isTopLeft || isTopRight || isBottomLeft || isBottomRight) {
//         selectedIndices.push(index);
//       }
//     }
//   }
  
//   return selectedIndices;
// };

const generateCornerPattern = (cols: number, rows: number, size: number = 3): number[] => {
  const selectedIndices: number[] = [];
  
  for (let row = 0; row < rows; row++) {
    const visualRow = rows - 1 - row;  // 👈 FIX
    for (let col = 0; col < cols; col++) {
      const index = (visualRow * cols) + col + 1;  // 👈 FIX
      
      const isTopLeft = row < size && col < size;
      const isTopRight = row < size && col >= cols - size;
      const isBottomLeft = row >= rows - size && col < size;
      const isBottomRight = row >= rows - size && col >= cols - size;
      
      if (isTopLeft || isTopRight || isBottomLeft || isBottomRight) {
        selectedIndices.push(index);
      }
    }
  }
  
  console.log(`✅ Corner pattern: ${selectedIndices.length} tiles (${cols}×${rows})`);
  return selectedIndices;
};

// Cross Pattern
// const generateCrossPattern = (cols: number, rows: number, thickness: number = 2): number[] => {
//   const selectedIndices: number[] = [];
//   const centerCol = Math.floor(cols / 2);
//   const centerRow = Math.floor(rows / 2);
  
//   for (let row = 0; row < rows; row++) {
//     for (let col = 0; col < cols; col++) {
//       const index = (row * cols) + col + 1;
      
//       const isVerticalLine = Math.abs(col - centerCol) < thickness;
//       const isHorizontalLine = Math.abs(row - centerRow) < thickness;
      
//       if (isVerticalLine || isHorizontalLine) {
//         selectedIndices.push(index);
//       }
//     }
//   }
  
//   return selectedIndices;
// };

const generateCrossPattern = (cols: number, rows: number, thickness: number = 2): number[] => {
  const selectedIndices: number[] = [];
  const centerCol = Math.floor(cols / 2);
  const centerRow = Math.floor(rows / 2);
  
  for (let row = 0; row < rows; row++) {
    const visualRow = rows - 1 - row;  // 👈 FIX
    for (let col = 0; col < cols; col++) {
      const index = (visualRow * cols) + col + 1;  // 👈 FIX
      
      const isVerticalLine = Math.abs(col - centerCol) < thickness;
      const isHorizontalLine = Math.abs(row - centerRow) < thickness;
      
      if (isVerticalLine || isHorizontalLine) {
        selectedIndices.push(index);
      }
    }
  }
  
  console.log(`✅ Cross pattern: ${selectedIndices.length} tiles (${cols}×${rows})`);
  return selectedIndices;
};



// Universal Pattern Generator
// const generatePattern = (
//   patternType: PatternType,
//   cols: number,
//   rows: number,
//   variant: number = 0
// ): number[] => {
//   switch (patternType) {
//     case 'vertical':
//       return generateVerticalStripesPattern(cols, rows, variant);
//     case 'horizontal':
//       return generateHorizontalStripesPattern(cols, rows, variant);
//     case 'diagonal':
//       return generateDiagonalPattern(cols, rows, variant);
//     case 'checkerboard':
//       return generateCheckerboardPattern(cols, rows, variant % 2 === 1);
//     case 'random':
//       return generateRandomPattern(cols, rows, 0.6, variant);
//     case 'border':
//       return generateBorderPattern(cols, rows, Math.max(1, variant % 3));
//     case 'corners':
//       return generateCornerPattern(cols, rows, Math.max(2, 3 + (variant % 3)));
//     case 'cross':
//       return generateCrossPattern(cols, rows, Math.max(1, 2 + (variant % 2)));
//     default:
//       return generateVerticalStripesPattern(cols, rows, variant);
//   }
// };

const generatePattern = (
  patternType: PatternType,
  cols: number,
  rows: number,
  variant: number = 0
): number[] => {
  console.log(`🎨 Generating ${patternType} pattern:`, { cols, rows, variant });
  
  let result: number[];
  
  switch (patternType) {
    case 'vertical':
      result = generateVerticalStripesPattern(cols, rows, variant);
      break;
    case 'horizontal':
      result = generateHorizontalStripesPattern(cols, rows, variant);
      break;
    case 'diagonal':
      result = generateDiagonalPattern(cols, rows, variant);
      break;
    case 'checkerboard':
      result = generateCheckerboardPattern(cols, rows, variant % 2 === 1);
      break;
    case 'random':
      result = generateRandomPattern(cols, rows, 0.6, variant);
      break;
    case 'border':
      result = generateBorderPattern(cols, rows, Math.max(1, variant % 3));
      break;
    case 'corners':
      result = generateCornerPattern(cols, rows, Math.max(2, 3 + (variant % 3)));
      break;
    case 'cross':
      result = generateCrossPattern(cols, rows, Math.max(1, 2 + (variant % 2)));
      break;
    default:
      result = generateVerticalStripesPattern(cols, rows, variant);
  }
  
  console.log(`✅ Pattern generated: ${result.length} tiles out of ${cols * rows}`);
  return result;
};


// ═══════════════════════════════════════════════════════════════
// CUSTOM HOOKS
// ═══════════════════════════════════════════════════════════════

const useHighQualityTexture = (
  textureUrl: string | undefined,
  tileWidth: number,
  tileHeight: number
) => {
  const [texture, setTexture] = useState<THREE.Texture | null>(null);
  const textureRef = useRef<THREE.Texture | null>(null);

  useEffect(() => {
    if (!textureUrl) {
      if (textureRef.current) {
        textureRef.current.dispose();
        textureRef.current = null;
      }
      setTexture(null);
      return;
    }

    let isCancelled = false;
    const loader = new THREE.TextureLoader();
    
    loader.load(
      textureUrl,
      (loadedTexture) => {
        if (isCancelled) {
          loadedTexture.dispose();
          return;
        }

        if (textureRef.current) {
          textureRef.current.dispose();
        }

        loadedTexture.colorSpace = THREE.SRGBColorSpace;
        loadedTexture.wrapS = THREE.RepeatWrapping;
        loadedTexture.wrapT = THREE.RepeatWrapping;
        loadedTexture.minFilter = THREE.LinearMipMapLinearFilter;
        loadedTexture.magFilter = THREE.LinearFilter;
        loadedTexture.anisotropy = 16;
        loadedTexture.generateMipmaps = true;
        loadedTexture.premultiplyAlpha = false;
        loadedTexture.needsUpdate = true;
        
        textureRef.current = loadedTexture;
        setTexture(loadedTexture);
      },
      undefined,
      (error) => {
        if (!isCancelled) {
          console.error('Texture loading error:', error);
          setTexture(null);
        }
      }
    );
    
    return () => {
      isCancelled = true;
      if (textureRef.current) {
        textureRef.current.dispose();
        textureRef.current = null;
      }
    };
  }, [textureUrl, tileWidth, tileHeight]);

  return texture;
};

const useDeviceQuality = (): QualityLevel => {
  const [quality, setQuality] = useState<QualityLevel>('high');

  useEffect(() => {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    
    if (!gl) {
      setQuality('low');
      return;
    }

    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
    const renderer = debugInfo ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : '';
    
    const isMobile = /mobile|android|iphone|ipad/i.test(navigator.userAgent);
    const isHighEnd = /apple gpu|adreno 6|mali-g|nvidia|amd/i.test(renderer.toLowerCase());
    
    if (isMobile) {
      setQuality(isHighEnd ? 'medium' : 'low');
    } else {
      setQuality(isHighEnd ? 'ultra' : 'high');
    }
  }, []);

  return quality;
};

// ═══════════════════════════════════════════════════════════════
// 3D SCENE COMPONENTS
// ═══════════════════════════════════════════════════════════════

const MinimalLighting: React.FC = () => {
  return (
    <>
      <ambientLight intensity={0.7} color="#ffffff" />
      <directionalLight position={[5, 5, 5]} intensity={0.6} color="#ffffff" />
      <pointLight position={[3, 2, 3]} intensity={0.4} color="#ffffff" />
      <pointLight position={[-3, 2, -3]} intensity={0.4} color="#ffffff" />
    </>
  );
};

const TiledFloor: React.FC<{
  baseTexture: THREE.Texture | null;
  tileSize: { width: number; height: number };
  roomWidth: number;
  roomDepth: number;
  position: [number, number, number];
  quality: QualityLevel;
   highlightBorders?: boolean;
}> = ({ baseTexture, tileSize, roomWidth, roomDepth, position, highlightBorders = false }) => {
  
  const material = useMemo(() => {
    if (!baseTexture) {
      return new THREE.MeshBasicMaterial({ 
        color: '#e8e8e8',
        side: THREE.DoubleSide
      });
    }

    const clonedTexture = baseTexture.clone();
    clonedTexture.needsUpdate = true;
    clonedTexture.colorSpace = THREE.SRGBColorSpace;
    clonedTexture.wrapS = THREE.RepeatWrapping;
    clonedTexture.wrapT = THREE.RepeatWrapping;
    clonedTexture.minFilter = THREE.LinearMipMapLinearFilter;
    clonedTexture.magFilter = THREE.LinearFilter;
    clonedTexture.anisotropy = 16;
    
    const tileSizeM = {
      width: tileSize.width / 100,
      height: tileSize.height / 100
    };
    
    const repeatX = roomWidth / tileSizeM.width;
    const repeatY = roomDepth / tileSizeM.height;
    
    clonedTexture.repeat.set(repeatX, repeatY);

    const mat = new THREE.MeshBasicMaterial({ 
      map: clonedTexture,
      side: THREE.DoubleSide,
      toneMapped: false
    });
    (mat as any)._customTexture = clonedTexture;
    return mat;
  }, [baseTexture, tileSize.width, tileSize.height, roomWidth, roomDepth]);

  useEffect(() => {
    return () => {
      if ((material as any)._customTexture) {
        (material as any)._customTexture.dispose();
      }
      material.dispose();
    };
  }, [material]);

  const gridLines = useMemo(() => {
    if (!highlightBorders) return null;
    
    const tileSizeM = {
      width: tileSize.width / 100,
      height: tileSize.height / 100
    };
    
    const cols = Math.ceil(roomWidth / tileSizeM.width);
    const rows = Math.ceil(roomDepth / tileSizeM.height);
    
    const points: THREE.Vector3[] = [];
    
    // Vertical lines
    for (let i = 0; i <= cols; i++) {
      const x = -roomWidth/2 + i * tileSizeM.width;
      points.push(new THREE.Vector3(x, -roomDepth/2, 0.001));
      points.push(new THREE.Vector3(x, roomDepth/2, 0.001));
    }
    
    // Horizontal lines
    for (let i = 0; i <= rows; i++) {
      const y = -roomDepth/2 + i * tileSizeM.height;
      points.push(new THREE.Vector3(-roomWidth/2, y, 0.001));
      points.push(new THREE.Vector3(roomWidth/2, y, 0.001));
    }
    
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    return geometry;
  }, [highlightBorders, roomWidth, roomDepth, tileSize]);

  return (
  <group>

    <mesh rotation={[-Math.PI / 2, 0, 0]} position={position}>
      <planeGeometry args={[roomWidth, roomDepth]} />
      <primitive object={material} attach="material" />
    </mesh>
    {highlightBorders && gridLines && (
        <lineSegments rotation={[-Math.PI / 2, 0, 0]} position={position}>
          <primitive object={gridLines} attach="geometry" />
          <lineBasicMaterial color="#000000" linewidth={2} opacity={0.8} transparent />
        </lineSegments>
      )}
    </group>
  );
};

const TiledWall: React.FC<{
  baseTexture: THREE.Texture | null;
  tileSize: { width: number; height: number };
  width: number;
  height: number;
  position: [number, number, number];
  rotation?: [number, number, number];
  quality: QualityLevel;
  highlightBorders?: boolean;
}> = ({ baseTexture, tileSize, width, height, position, rotation = [0, 0, 0], highlightBorders = false }) => {
  
  const material = useMemo(() => {
    if (!baseTexture) {
      return new THREE.MeshBasicMaterial({ 
        color: '#f5f5f5',
        side: THREE.DoubleSide
      });
    }

    const clonedTexture = baseTexture.clone();
    clonedTexture.needsUpdate = true;
    clonedTexture.colorSpace = THREE.SRGBColorSpace;
    clonedTexture.wrapS = THREE.RepeatWrapping;
    clonedTexture.wrapT = THREE.RepeatWrapping;
    clonedTexture.minFilter = THREE.LinearMipMapLinearFilter;
    clonedTexture.magFilter = THREE.LinearFilter;
    clonedTexture.anisotropy = 16;
    
    const tileSizeM = {
      width: tileSize.width / 100,
      height: tileSize.height / 100
    };
    
    const repeatX = width / tileSizeM.width;
    const repeatY = height / tileSizeM.height;
    
    clonedTexture.repeat.set(repeatX, repeatY);

    const mat = new THREE.MeshBasicMaterial({ 
      map: clonedTexture,
      side: THREE.DoubleSide,
      toneMapped: false
    });
    (mat as any)._customTexture = clonedTexture;
    return mat;
  }, [baseTexture, tileSize.width, tileSize.height, width, height]);

  useEffect(() => {
    return () => {
      if ((material as any)._customTexture) {
        (material as any)._customTexture.dispose();
      }
      material.dispose();
    };
  }, [material]);
  // ✅ NEW: Grid for walls
  const gridLines = useMemo(() => {
    if (!highlightBorders) return null;
    
    const tileSizeM = {
      width: tileSize.width / 100,
      height: tileSize.height / 100
    };
    
    const cols = Math.ceil(width / tileSizeM.width);
    const rows = Math.ceil(height / tileSizeM.height);
    
    const points: THREE.Vector3[] = [];
    
    // Vertical lines
    for (let i = 0; i <= cols; i++) {
      const x = -width/2 + i * tileSizeM.width;
      points.push(new THREE.Vector3(x, -height/2, 0.001));
      points.push(new THREE.Vector3(x, height/2, 0.001));
    }
    
    // Horizontal lines
    for (let i = 0; i <= rows; i++) {
      const y = -height/2 + i * tileSizeM.height;
      points.push(new THREE.Vector3(-width/2, y, 0.001));
      points.push(new THREE.Vector3(width/2, y, 0.001));
    }
    
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    return geometry;
  }, [highlightBorders, width, height, tileSize]);

  return (
    <group position={position} rotation={rotation}>
      <mesh>
        <planeGeometry args={[width, height]} />
        <primitive object={material} attach="material" />
      </mesh>
      
      {/* ✅ NEW: Grid overlay */}
      {highlightBorders && gridLines && (
        <lineSegments position={[0, 0, 0.001]}>
          <primitive object={gridLines} attach="geometry" />
          <lineBasicMaterial color="#ff0000" linewidth={3} opacity={1} transparent={false} />
        </lineSegments>
      )}
    </group>
  );
};

const IndividualTile: React.FC<{
  tileData: TileData;
  baseTexture: THREE.Texture | null;
  customTexture: THREE.Texture | null;
  tileSize: { width: number; height: number };
  isSelected: boolean;
  isGridMode: boolean;
  onTileClick: (index: number) => void;
}> = ({ tileData, baseTexture, customTexture, tileSize, isSelected, isGridMode, onTileClick }) => {
  const meshRef = useRef<THREE.Mesh>(null);

  const material = useMemo(() => {
    const textureToUse = customTexture || baseTexture;
    
    if (!textureToUse) {
      return new THREE.MeshBasicMaterial({ 
        color: '#f5f5f5',
        side: THREE.DoubleSide,
        toneMapped: false
      });
    }

    return new THREE.MeshBasicMaterial({ 
      map: textureToUse,
      side: THREE.DoubleSide,
      toneMapped: false
    });
  }, [baseTexture, customTexture]);

  useEffect(() => {
    return () => {
      material.dispose();
    };
  }, [material]);

  const tileSizeM = {
    width: tileSize.width / 100,
    height: tileSize.height / 100
  };

  return (
    <group position={tileData.position}>
      <mesh 
        ref={meshRef}
        userData={{ tileIndex: tileData.index }}
        onClick={(e) => {
          e.stopPropagation();
          if (isGridMode) {
            onTileClick(tileData.index);
          }
        }}
      >
        <planeGeometry args={[tileSizeM.width, tileSizeM.height]} />
        <primitive object={material} attach="material" />
      </mesh>

      {isGridMode && (
        <lineSegments position={[0, 0, 0.001]}>
          <edgesGeometry args={[new THREE.PlaneGeometry(tileSizeM.width, tileSizeM.height)]} />
          <lineBasicMaterial 
            color={isSelected ? "#10b981" : "#666666"}
            opacity={1}
            transparent={false}
          />
        </lineSegments>
      )}

      {isGridMode && (
        <Text
          position={[0, 0, 0.002]}
          fontSize={Math.min(tileSizeM.width, tileSizeM.height) * 0.22}
          color="#000000"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.005}
          outlineColor="#ffffff"
        >
          {tileData.index}
        </Text>
      )}

      {isSelected && (
        <>
          <lineSegments position={[0, 0, 0.003]}>
            <edgesGeometry args={[new THREE.PlaneGeometry(tileSizeM.width * 1.08, tileSizeM.height * 1.08)]} />
            <lineBasicMaterial 
              color="#10b981" 
              linewidth={4}
              opacity={1}
              transparent={false}
            />
          </lineSegments>
          
          <lineSegments position={[0, 0, 0.004]}>
            <edgesGeometry args={[new THREE.PlaneGeometry(tileSizeM.width * 1.05, tileSizeM.height * 1.05)]} />
            <lineBasicMaterial 
              color="#22c55e" 
              linewidth={3}
              opacity={1}
              transparent={false}
            />
          </lineSegments>

          <mesh position={[tileSizeM.width * 0.4, tileSizeM.height * 0.4, 0.003]}>
            <circleGeometry args={[0.03, 16]} />
            <meshBasicMaterial color="#10b981" />
          </mesh>
          <mesh position={[-tileSizeM.width * 0.4, tileSizeM.height * 0.4, 0.003]}>
            <circleGeometry args={[0.03, 16]} />
            <meshBasicMaterial color="#10b981" />
          </mesh>
          <mesh position={[tileSizeM.width * 0.4, -tileSizeM.height * 0.4, 0.003]}>
            <circleGeometry args={[0.03, 16]} />
            <meshBasicMaterial color="#10b981" />
          </mesh>
          <mesh position={[-tileSizeM.width * 0.4, -tileSizeM.height * 0.4, 0.003]}>
            <circleGeometry args={[0.03, 16]} />
            <meshBasicMaterial color="#10b981" />
          </mesh>
        </>
      )}
    </group>
  );
};

const GridWall: React.FC<{
  baseTexture: THREE.Texture | null;
  tileSize: { width: number; height: number };
  width: number;
  height: number;
  position: [number, number, number];
  rotation?: [number, number, number];
  isGridMode: boolean;
  selectedTiles: number[];
  onTileClick: (index: number) => void;
  customTilesMap: Map<number, THREE.Texture>;
}> = ({ 
  baseTexture, 
  tileSize, 
  width, 
  height, 
  position, 
  rotation = [0, 0, 0],
  isGridMode,
  selectedTiles,
  onTileClick,
  customTilesMap
}) => {
  
  const tilesData = useMemo(() => {
    const tileSizeM = {
      width: tileSize.width / 100,
      height: tileSize.height / 100
    };
    
    const cols = Math.ceil(width / tileSizeM.width);
    const rows = Math.ceil(height / tileSizeM.height);
    
    const tiles: TileData[] = [];
    let index = 1;
    
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const x = (col - cols / 2 + 0.5) * tileSizeM.width;
        const y = (rows / 2 - row - 0.5) * tileSizeM.height;
        
        tiles.push({
          index,
          row,
          col,
          position: [x, y, 0],
          texture: null,
          isCustom: customTilesMap.has(index)
        });
        
        index++;
      }
    }
    
    return tiles;
  }, [width, height, tileSize, customTilesMap]);

  return (
    <group position={position} rotation={rotation}>
      {tilesData.map((tile) => {
        const customTexture = customTilesMap.get(tile.index) || null;
        
        return (
          <IndividualTile
            key={tile.index}
            tileData={tile}
            baseTexture={baseTexture}
            customTexture={customTexture}
            tileSize={tileSize}
            isSelected={selectedTiles.includes(tile.index)}
            isGridMode={isGridMode}
            onTileClick={onTileClick}
          />
        );
      })}
    </group>
  );
};

const Ceiling: React.FC<{
  width: number;
  depth: number;
  height: number;
}> = ({ width, depth, height }) => {
  return (
    <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, height, 0]}>
      <planeGeometry args={[width, depth]} />
      <meshStandardMaterial color="#ffffff" roughness={0.9} metalness={0} />
    </mesh>
  );
};


const BrightHotelKitchenScene: React.FC<{ 
  floorTexture: THREE.Texture | null;
  floorTileSize: { width: number; height: number };
  wallTexture: THREE.Texture | null;
  wallTileSize: { width: number; height: number };
  showWallTiles: boolean;
  quality: QualityLevel;
  isGridMode: boolean;
  activeWall: WallType | null;
  selectedTiles: number[];
  onTileClick: (index: number) => void;
  customTiles: WallCustomTiles;
  roomDimensions?: { width: number; depth: number; height: number };
  furnitureScale?: { x: number; y: number; z: number };
  wallTileHeight?: number; 
  highlightTileBorders?: boolean;
}> = ({ 
  floorTexture, 
  floorTileSize, 
  wallTexture, 
  wallTileSize, 
  showWallTiles, 
  quality,
  isGridMode,
  activeWall,
  selectedTiles,
  onTileClick,
  customTiles,
  roomDimensions,
  furnitureScale = { x: 1, y: 1, z: 1 },
   wallTileHeight = 11 ,
     highlightTileBorders = false
}) => {
  const { width: W, depth: D, height: H } = roomDimensions || ROOM_CONFIGS.kitchen;
  const { x: scaleX, y: scaleY, z: scaleZ } = furnitureScale;
 const actualWallHeight = (wallTileHeight / 11) * H; // Scale to room height

  const shouldUseGridWall = (wall: WallType) => {
    if (wall !== 'back') return false;
    return (isGridMode && activeWall === wall) || customTiles[wall].size > 0;
  };

  return (
    <group>
      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* FLOOR & CEILING - SCALED */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      
      <TiledFloor 
        baseTexture={floorTexture} 
        tileSize={floorTileSize} 
        roomWidth={W} 
        roomDepth={D} 
        position={[0, 0, 0]} 
        quality={quality} 
        highlightBorders={highlightTileBorders} 
      />
      <Ceiling width={W} depth={D} height={H} />

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* WALLS - SCALED */}
      {/* ═══════════════════════════════════════════════════════════════ */}

      {showWallTiles && shouldUseGridWall('back') ? (
        <GridWall
          baseTexture={wallTexture}
          tileSize={wallTileSize}
          width={W}
          height={actualWallHeight} // ✅ CHANGED from H
          position={[0, actualWallHeight/2, -D/2]} 
        
          isGridMode={isGridMode && activeWall === 'back'}
          selectedTiles={activeWall === 'back' ? selectedTiles : []}
          onTileClick={onTileClick}
          customTilesMap={customTiles.back}
        />
      ) : showWallTiles ? (
        <TiledWall
          baseTexture={wallTexture}
          tileSize={wallTileSize}
          width={W}
          quality={quality}
          height={actualWallHeight} // ✅ CHANGED from H
          highlightBorders={highlightTileBorders}
          position={[0, actualWallHeight/2, -D/2]} 
        />
      ) : (
        <mesh position={[0, H/2, -D/2]}>
          <planeGeometry args={[W, H]} />
          <meshStandardMaterial color="#f5f5f5" roughness={0.85} />
        </mesh>
      )}

      <mesh position={[0, H/2, D/2]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[W, H]} />
        <meshStandardMaterial color="#ffffff" roughness={0.85} />
      </mesh>

      <mesh position={[-W/2, H/2, 0]} rotation={[0, Math.PI/2, 0]}>
        <planeGeometry args={[D, H]} />
        <meshStandardMaterial color="#fef9f3" roughness={0.85} />
      </mesh>

      <mesh position={[W/2, H/2, 0]} rotation={[0, -Math.PI/2, 0]}>
        <planeGeometry args={[D, H]} />
        <meshStandardMaterial color="#faf5ed" roughness={0.85} />
      </mesh>

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* BACK COUNTER - SCALED */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      
      <group position={[0, 0, -(D/2 - 0.8) * scaleZ]} scale={[scaleX, scaleY, scaleZ]}>
        <mesh position={[0, 0.5, 0]} castShadow>
          <boxGeometry args={[5.2, 1.0, 0.6]} />
          <meshStandardMaterial color="#ffffff" roughness={0.18} metalness={0.15} />
        </mesh>
        <mesh position={[0, 1.02, 0]} castShadow>
          <boxGeometry args={[5.3, 0.06, 0.65]} />
          <meshStandardMaterial color="#faf6f0" roughness={0.1} metalness={0.45} />
        </mesh>
        <mesh position={[0, 2.1, -0.25]} castShadow>
          <boxGeometry args={[5.2, 1.0, 0.35]} />
          <meshStandardMaterial color="#fffbf5" roughness={0.2} metalness={0.1} />
        </mesh>
        {[-2.2, -1.5, -0.8, -0.1, 0.6, 1.3, 2.0].map((x, i) => (
          <mesh key={`handle-lower-${i}`} position={[x, 0.5, 0.32]}>
            <boxGeometry args={[0.15, 0.025, 0.025]} />
            <meshStandardMaterial color="#e8e8e8" roughness={0.12} metalness={0.92} />
          </mesh>
        ))}
        {[-2.2, -1.5, -0.8, -0.1, 0.6, 1.3, 2.0].map((x, i) => (
          <mesh key={`handle-upper-${i}`} position={[x, 2.1, -0.05]}>
            <boxGeometry args={[0.15, 0.025, 0.025]} />
            <meshStandardMaterial color="#e8e8e8" roughness={0.12} metalness={0.92} />
          </mesh>
        ))}
        <rectAreaLight position={[0, 1.6, -0.38]} width={5.0} height={0.05} intensity={3.5} color="#fffef8" />
      </group>

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* CENTER ISLAND - SCALED */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      
      <group position={[0, 0, (D/2 - 4.5) * scaleZ]} scale={[scaleX, scaleY, scaleZ]}>
        <mesh position={[0, 0.5, 0]} castShadow>
          <boxGeometry args={[3.0, 1.0, 1.5]} />
          <meshStandardMaterial color="#f5ead5" roughness={0.28} metalness={0.08} />
        </mesh>
        <mesh position={[0, 1.02, 0]} castShadow>
          <boxGeometry args={[3.1, 0.06, 1.55]} />
          <meshStandardMaterial color="#fefefe" roughness={0.12} metalness={0.38} />
        </mesh>
        <mesh position={[0, 0.5, 0.8]}>
          <boxGeometry args={[3.0, 0.025, 0.015]} />
          <meshStandardMaterial color="#f0e6d2" roughness={0.32} metalness={0.05} />
        </mesh>
        {[-1.2, -0.4, 0.4, 1.2].map((x, i) => (
          <group key={`stool-${i}`} position={[x, 0.4, 1.1]}>
            <mesh position={[0, 0.35, 0]} castShadow>
              <cylinderGeometry args={[0.2, 0.2, 0.06, 24]} />
              <meshStandardMaterial color="#fefefe" roughness={0.32} metalness={0.05} />
            </mesh>
            <mesh position={[0, 0, 0]}>
              <cylinderGeometry args={[0.022, 0.022, 0.7, 16]} />
              <meshStandardMaterial color="#e0e0e0" roughness={0.08} metalness={0.92} />
            </mesh>
            <mesh position={[0, -0.35, 0]}>
              <cylinderGeometry args={[0.15, 0.15, 0.03, 20]} />
              <meshStandardMaterial color="#d8d8d8" roughness={0.1} metalness={0.9} />
            </mesh>
          </group>
        ))}
      </group>

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* SIDE STORAGE CABINET - SCALED */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      
      <group position={[-(W/2 - 0.9) * scaleX, 0, -(D/2 - 1.4) * scaleZ]} scale={[scaleX, scaleY, scaleZ]}>
        <mesh position={[0, 0.5, 0]} castShadow>
          <boxGeometry args={[0.6, 1.0, 2.6]} />
          <meshStandardMaterial color="#ffffff" roughness={0.18} metalness={0.15} />
        </mesh>
        <mesh position={[0, 1.02, 0]} castShadow>
          <boxGeometry args={[0.65, 0.06, 2.7]} />
          <meshStandardMaterial color="#faf6f0" roughness={0.1} metalness={0.45} />
        </mesh>
      </group>

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* REFRIGERATOR - SCALED */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      
      <mesh 
        position={[(W/2 - 1.5) * scaleX, 1.3 * scaleY, -(D/2 - 0.35) * scaleZ]} 
        castShadow 
        scale={[scaleX, scaleY, scaleZ]}
      >
        <boxGeometry args={[0.9, 2.6, 0.75]} />
        <meshStandardMaterial color="#e8e8e8" roughness={0.12} metalness={0.88} />
      </mesh>

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* WALL MOUNTED MICROWAVE - SCALED */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      
      <mesh 
        position={[-(W/2 - 1.9) * scaleX, 1.4 * scaleY, -(D/2 - 0.35) * scaleZ]} 
        castShadow 
        scale={[scaleX, scaleY, scaleZ]}
      >
        <boxGeometry args={[0.7, 1.4, 0.12]} />
        <meshStandardMaterial color="#e0e0e0" roughness={0.18} metalness={0.8} />
      </mesh>

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* PENDANT LIGHTS - SCALED */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      
      {[-1.2, -0.4, 0.4, 1.2].map((x, i) => (
        <group 
          key={`pendant-${i}`} 
          position={[x * scaleX, (H - 0.35) * scaleY, (D/2 - 4.5) * scaleZ]} 
          scale={[scaleX, scaleY, scaleZ]}
        >
          <mesh>
            <cylinderGeometry args={[0.005, 0.005, 0.7, 10]} />
            <meshStandardMaterial color="#d8d8d8" roughness={0.1} metalness={0.9} />
          </mesh>
          <mesh position={[0, -0.4, 0]}>
            <sphereGeometry args={[0.18, 20, 20]} />
            <meshStandardMaterial color="#ffffff" transparent={true} opacity={0.35} roughness={0.02} metalness={0.05} />
          </mesh>
          <pointLight position={[0, -0.45, 0]} intensity={2.2} color="#fffef8" distance={3.5} />
        </group>
      ))}

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* AMBIENT LIGHTING - SCALED POSITIONS */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      
      <pointLight position={[(W/2 - 4) * scaleX, (H - 0.1) * scaleY, -(D/2 - 2) * scaleZ]} intensity={2.0} color="#ffffff" distance={5} />
      <pointLight position={[-(W/2 - 4) * scaleX, (H - 0.1) * scaleY, -(D/2 - 2) * scaleZ]} intensity={2.0} color="#ffffff" distance={5} />
      <pointLight position={[(W/2 - 4) * scaleX, (H - 0.1) * scaleY, (D/2 - 3.5) * scaleZ]} intensity={2.0} color="#ffffff" distance={5} />
      <pointLight position={[-(W/2 - 4) * scaleX, (H - 0.1) * scaleY, (D/2 - 3.5) * scaleZ]} intensity={2.0} color="#ffffff" distance={5} />
      <pointLight position={[0, (H - 0.1) * scaleY, 0]} intensity={2.2} color="#ffffff" distance={5} />
    </group>
  );
};

// ═══════════════════════════════════════════════════════════════
// 🔥 PREMIUM BATHROOM SCENE - PRODUCTION READY WITH SCALING
// ═══════════════════════════════════════════════════════════════

// const PremiumBathroomScene: React.FC<{ 
//   floorTexture: THREE.Texture | null;
//   floorTileSize: { width: number; height: number };
//   wallTexture: THREE.Texture | null;
//   wallTileSize: { width: number; height: number };
//   showWallTiles: boolean;
//   quality: QualityLevel;
//   isGridMode: boolean;
//   activeWall: WallType | null;
//   selectedTiles: number[];
//   onTileClick: (index: number) => void;
//   customTiles: WallCustomTiles;
//   roomDimensions?: { width: number; depth: number; height: number };
//   furnitureScale?: { x: number; y: number; z: number };
// wallTileHeight?: number;
// highlightTileBorders?: boolean;
// }> = ({ 
//   floorTexture, 
//   floorTileSize, 
//   wallTexture, 
//   wallTileSize, 
//   showWallTiles, 
//   quality,
//   isGridMode,
//   activeWall,
//   selectedTiles,
//   onTileClick,
//   customTiles,
//   roomDimensions,
//   furnitureScale = { x: 1, y: 1, z: 1 },
//   wallTileHeight = 11 ,
//    highlightTileBorders = false
// }) => {
//   const { width: W, depth: D, height: H } = roomDimensions || ROOM_CONFIGS.bathroom;
//   const { x: scaleX, y: scaleY, z: scaleZ } = furnitureScale;
// const actualWallHeight = (wallTileHeight / 11) * H;

//   const shouldUseGridWall = (wall: WallType) => {
//     return (isGridMode && activeWall === wall) || customTiles[wall].size > 0;
//   };

//   const vanityPosX = -(W/2 - 0.8) * scaleX;
//   const vanityPosZ = -(D/2 - 0.28) * scaleZ;
//   const showerPosX = (W/2 - 0.85) * scaleX;
//   const showerPosZ = -(D/2 - 0.85) * scaleZ;
//   const toiletPosZ = -(D/2 - 0.35) * scaleZ;
//   const doorPosX = (W/2 - 1.8) * scaleX;
//   const doorPosZ = (D/2 - 0.002) * scaleZ;
//   const plantPosX = -(W/2 - 0.5) * scaleX;
//   const plantPosZ = (D/2 - 0.5) * scaleZ;
//   const towelPosX = (W/2 - 1.9) * scaleX;
//   const towelPosZ = -(D/2 - 0.02) * scaleZ;

//   return (
//     <group>
//       {/* ═══════════════════════════════════════════════════════════════ */}
//       {/* FLOOR & CEILING - SCALED */}
//       {/* ═══════════════════════════════════════════════════════════════ */}
      
//       <TiledFloor 
//         baseTexture={floorTexture} 
//         tileSize={floorTileSize} 
//         roomWidth={W} 
//         roomDepth={D} 
//         position={[0, 0, 0]} 
//         quality={quality} 
//          highlightBorders={highlightTileBorders} 
//       />
//       <Ceiling width={W} depth={D} height={H} />

//       {['back', 'front', 'left', 'right'].map((wallKey) => {
//   const wall = wallKey as WallType;
//   const wallWidth = wall === 'left' || wall === 'right' ? D : W;
  
//   // ✅ CRITICAL: Use actualWallHeight for position
//   const wallPos = 
//     wall === 'back' ? [0, actualWallHeight/2, -D/2] :
//     wall === 'front' ? [0, actualWallHeight/2, D/2] :
//     wall === 'left' ? [-W/2, actualWallHeight/2, 0] :
//     [W/2, actualWallHeight/2, 0];
    
//   const wallRot =
//     wall === 'front' ? [0, Math.PI, 0] :
//     wall === 'left' ? [0, Math.PI/2, 0] :
//     wall === 'right' ? [0, -Math.PI/2, 0] :
//     [0, 0, 0];

//   return showWallTiles && shouldUseGridWall(wall) ? (
//     <GridWall
//       key={wall}
//       baseTexture={wallTexture}
//       tileSize={wallTileSize}
//       width={wallWidth}
//       height={actualWallHeight}  // ✅ Not H
//       position={wallPos as [number, number, number]}
//       rotation={wallRot as [number, number, number]}
//       isGridMode={isGridMode && activeWall === wall}
//       selectedTiles={activeWall === wall ? selectedTiles : []}
//       onTileClick={onTileClick}
//       customTilesMap={customTiles[wall]}
//     />
//   ) : showWallTiles ? (
//     <TiledWall
//       key={wall}
//       baseTexture={wallTexture}
//       tileSize={wallTileSize}
//       width={wallWidth}
//       height={actualWallHeight}  // ✅ Not H
//       position={wallPos as [number, number, number]}
//       rotation={wallRot as [number, number, number]}
//       quality={quality}
//       highlightBorders={highlightTileBorders}
//     />
//   ) : (
//     <mesh key={wall} position={wallPos as [number, number, number]} rotation={wallRot as [number, number, number]}>
//       <planeGeometry args={[wallWidth, H]} />  {/* ✅ This is OK - plain walls can use full height */}
//       <meshStandardMaterial 
//         color={
//           wall === 'front' ? '#ffffff' : 
//           wall === 'left' ? '#fef9f3' : 
//           wall === 'right' ? '#faf5ed' : 
//           '#f5f5f5'
//         } 
//         roughness={0.85} 
//       />
//     </mesh>
//   );
// })}

//       {/* ═══════════════════════════════════════════════════════════════ */}
//       {/* VANITY + WASH BASIN - SCALED */}
//       {/* ═══════════════════════════════════════════════════════════════ */}
      
//       <group position={[vanityPosX, 0, vanityPosZ]} scale={[scaleX, scaleY, scaleZ]}>
//         <mesh position={[0, 0.45, 0]} castShadow>
//           <boxGeometry args={[1.3, 0.9, 0.55]} />
//           <meshStandardMaterial color="#ffffff" roughness={0.25} metalness={0.1} />
//         </mesh>
//         <mesh position={[0, 0.92, 0]} castShadow>
//           <boxGeometry args={[1.35, 0.05, 0.6]} />
//           <meshStandardMaterial color="#f5f5f0" roughness={0.15} metalness={0.45} />
//         </mesh>
//         {[-0.32, 0.32].map((x, i) => (
//           <React.Fragment key={i}>
//             <mesh position={[x, 0.45, 0.285]} castShadow>
//               <boxGeometry args={[0.6, 0.85, 0.02]} />
//               <meshStandardMaterial color="#fafafa" roughness={0.3} metalness={0.05} />
//             </mesh>
//             <mesh position={[x + 0.18, 0.45, 0.305]}>
//               <boxGeometry args={[0.15, 0.02, 0.02]} />
//               <meshStandardMaterial color="#c0c0c0" roughness={0.1} metalness={0.9} />
//             </mesh>
//           </React.Fragment>
//         ))}
//         <group position={[0, 0.88, 0]}>
//           <mesh castShadow>
//             <cylinderGeometry args={[0.23, 0.19, 0.16, 32]} />
//             <meshStandardMaterial color="#ffffff" roughness={0.08} metalness={0.2} />
//           </mesh>
//           <mesh position={[0, -0.01, 0]}>
//             <cylinderGeometry args={[0.19, 0.15, 0.14, 32]} />
//             <meshStandardMaterial color="#f8f8f8" roughness={0.1} metalness={0.15} />
//           </mesh>
//           <mesh position={[0, -0.07, 0]}>
//             <cylinderGeometry args={[0.025, 0.025, 0.01, 24]} />
//             <meshStandardMaterial color="#888888" roughness={0.3} metalness={0.7} />
//           </mesh>
//         </group>
//         <group position={[0, 0.95, -0.22]}>
//           <mesh>
//             <cylinderGeometry args={[0.03, 0.035, 0.02, 24]} />
//             <meshStandardMaterial color="#e8e8e8" roughness={0.05} metalness={0.98} />
//           </mesh>
//           <mesh position={[0, 0.18, 0]}>
//             <cylinderGeometry args={[0.015, 0.015, 0.36, 16]} />
//             <meshStandardMaterial color="#e8e8e8" roughness={0.05} metalness={0.98} />
//           </mesh>
//           <mesh position={[0, 0.35, 0.09]} rotation={[Math.PI / 2.8, 0, 0]}>
//             <cylinderGeometry args={[0.013, 0.013, 0.18, 16]} />
//             <meshStandardMaterial color="#e8e8e8" roughness={0.05} metalness={0.98} />
//           </mesh>
//           <mesh position={[0, 0.42, 0.18]}>
//             <cylinderGeometry args={[0.018, 0.015, 0.03, 20]} />
//             <meshStandardMaterial color="#e8e8e8" roughness={0.05} metalness={0.98} />
//           </mesh>
//           {[-0.1, 0.1].map((x, i) => (
//             <group key={i} position={[x, 0.38, -0.02]}>
//               <mesh>
//                 <cylinderGeometry args={[0.022, 0.022, 0.018, 20]} />
//                 <meshStandardMaterial color="#d0d0d0" roughness={0.08} metalness={0.95} />
//               </mesh>
//               <mesh position={[0, 0.015, 0]} rotation={[0, 0, Math.PI / 4]}>
//                 <boxGeometry args={[0.045, 0.008, 0.008]} />
//                 <meshStandardMaterial color="#d0d0d0" roughness={0.08} metalness={0.95} />
//               </mesh>
//             </group>
//           ))}
//         </group>
//         <mesh position={[0.48, 0.97, 0.18]} castShadow>
//           <cylinderGeometry args={[0.032, 0.038, 0.14, 20]} />
//           <meshStandardMaterial color="#ffffff" roughness={0.25} metalness={0.1} transparent opacity={0.92} />
//         </mesh>
//         <mesh position={[0.48, 1.04, 0.18]}>
//           <cylinderGeometry args={[0.015, 0.02, 0.04, 16]} />
//           <meshStandardMaterial color="#c0c0c0" roughness={0.15} metalness={0.85} />
//         </mesh>
//         <mesh position={[-0.42, 0.94, 0.12]} castShadow>
//           <boxGeometry args={[0.22, 0.015, 0.16]} />
//           <meshStandardMaterial color="#d4af37" roughness={0.3} metalness={0.7} />
//         </mesh>
//       </group>

//       {/* ═══════════════════════════════════════════════════════════════ */}
//       {/* LED MIRROR - SCALED */}
//       {/* ═══════════════════════════════════════════════════════════════ */}
      
//       <group position={[vanityPosX, 1.65 * scaleY, -(D/2 - 0.07)]} scale={[scaleX, scaleY, 1]}>
//         <mesh castShadow>
//           <boxGeometry args={[1.25, 0.95, 0.03]} />
//           <meshStandardMaterial color="#c8c8c8" roughness={0.18} metalness={0.92} />
//         </mesh>
//         <mesh position={[0, 0, 0.018]}>
//           <boxGeometry args={[1.19, 0.89, 0.008]} />
//           <meshStandardMaterial color="#e8f4f8" roughness={0.02} metalness={0.98} envMapIntensity={2.0} />
//         </mesh>
//         {[[0, 0.49, 1.21, 0.04], [0, -0.49, 1.21, 0.04], [-0.61, 0, 0.03, 0.89], [0.61, 0, 0.03, 0.89]].map((params, i) => (
//           <mesh key={i} position={[params[0], params[1], 0.025]}>
//             <boxGeometry args={i < 2 ? [params[2], params[3], 0.02] : [params[2], params[3], 0.02]} />
//             <meshStandardMaterial color="#ffffff" emissive="#fffef8" emissiveIntensity={i < 2 ? (i === 0 ? 1.2 : 0.9) : 0.7} />
//           </mesh>
//         ))}
//         <rectAreaLight position={[0, 0.49, 0.05]} width={1.21} height={0.04} intensity={3.5} color="#fffef8" />
//         <rectAreaLight position={[0, -0.49, 0.05]} width={1.21} height={0.04} intensity={2.5} color="#fffef8" />
//       </group>

//       {/* ═══════════════════════════════════════════════════════════════ */}
//       {/* SHOWER ENCLOSURE - SCALED */}
//       {/* ═══════════════════════════════════════════════════════════════ */}
      
//       <group position={[showerPosX, 0, showerPosZ]} scale={[scaleX, scaleY, scaleZ]}>
//         <mesh position={[0, 0.04, 0]} castShadow>
//           <boxGeometry args={[1.0, 0.08, 1.0]} />
//           <meshStandardMaterial color="#fafafa" roughness={0.2} metalness={0.15} />
//         </mesh>
//         <mesh position={[0, 0.09, 0]} rotation={[-Math.PI / 2, 0, 0]}>
//           <torusGeometry args={[0.49, 0.015, 12, 32]} />
//           <meshStandardMaterial color="#e8e8e8" roughness={0.25} metalness={0.2} />
//         </mesh>
//         <mesh position={[0, 0.085, 0]}>
//           <cylinderGeometry args={[0.045, 0.045, 0.01, 32]} />
//           <meshStandardMaterial color="#888888" roughness={0.25} metalness={0.75} />
//         </mesh>
//         {[[0, 1.25, -0.5, 1.0, 2.5, 0.012], [-0.5, 1.25, 0, 1.0, 2.5, 0.012], [0.5, 1.25, 0, 1.0, 2.5, 0.012]].map((params, i) => (
//           <mesh key={i} position={[params[0], params[1], params[2]]} rotation={i === 0 ? [0, 0, 0] : [0, Math.PI / 2, 0]} castShadow>
//             <boxGeometry args={[params[3], params[4], params[5]]} />
//             <meshStandardMaterial color="#ffffff" transparent opacity={0.32} roughness={0.05} metalness={0.08} />
//           </mesh>
//         ))}
//         {[[0, 2.5, -0.5, 1.0, 0.025, 0.025], [-0.5, 2.5, 0, 0.025, 0.025, 1.0], [0.5, 2.5, 0, 0.025, 0.025, 1.0], [-0.5, 1.25, -0.5, 0.025, 2.5, 0.025], [0.5, 1.25, -0.5, 0.025, 2.5, 0.025]].map((params, i) => (
//           <mesh key={i} position={[params[0], params[1], params[2]]}>
//             <boxGeometry args={[params[3], params[4], params[5]]} />
//             <meshStandardMaterial color="#d0d0d0" roughness={0.05} metalness={0.95} />
//           </mesh>
//         ))}
//         <group position={[0, 2.15, -0.35]}>
//           <mesh>
//             <boxGeometry args={[0.06, 0.06, 0.1]} />
//             <meshStandardMaterial color="#e0e0e0" roughness={0.05} metalness={0.95} />
//           </mesh>
//           <mesh position={[0, 0, 0.18]} rotation={[0, Math.PI / 2, 0]}>
//             <cylinderGeometry args={[0.018, 0.018, 0.35, 16]} />
//             <meshStandardMaterial color="#e0e0e0" roughness={0.05} metalness={0.95} />
//           </mesh>
//           <mesh position={[0, -0.06, 0.35]} rotation={[Math.PI / 7, 0, 0]}>
//             <cylinderGeometry args={[0.12, 0.12, 0.035, 40]} />
//             <meshStandardMaterial color="#e8e8e8" roughness={0.08} metalness={0.92} />
//           </mesh>
//           <mesh position={[0, -0.065, 0.35]} rotation={[Math.PI / 7, 0, 0]}>
//             <cylinderGeometry args={[0.11, 0.11, 0.01, 40]} />
//             <meshStandardMaterial color="#a0a0a0" roughness={0.35} metalness={0.65} />
//           </mesh>
//         </group>
//         <group position={[-0.42, 1.15, -0.45]}>
//           <mesh>
//             <boxGeometry args={[0.15, 0.35, 0.03]} />
//             <meshStandardMaterial color="#e8e8e8" roughness={0.08} metalness={0.9} />
//           </mesh>
//           <mesh position={[0, 0.08, 0.025]}>
//             <cylinderGeometry args={[0.055, 0.055, 0.04, 28]} />
//             <meshStandardMaterial color="#e0e0e0" roughness={0.05} metalness={0.95} />
//           </mesh>
//           <mesh position={[0, -0.08, 0.025]}>
//             <cylinderGeometry args={[0.042, 0.042, 0.035, 24]} />
//             <meshStandardMaterial color="#d0d0d0" roughness={0.08} metalness={0.92} />
//           </mesh>
//         </group>
//         <group position={[-0.42, 1.55, -0.45]}>
//           <mesh>
//             <torusGeometry args={[0.032, 0.012, 14, 28, Math.PI]} />
//             <meshStandardMaterial color="#e0e0e0" roughness={0.05} metalness={0.95} />
//           </mesh>
//           <mesh position={[0, -0.1, 0.025]} rotation={[Math.PI / 5, 0, 0]}>
//             <capsuleGeometry args={[0.022, 0.14, 14, 24]} />
//             <meshStandardMaterial color="#e8e8e8" roughness={0.08} metalness={0.92} />
//           </mesh>
//           <mesh position={[0, -0.18, 0.02]} rotation={[Math.PI / 5, 0, 0]}>
//             <sphereGeometry args={[0.025, 16, 16]} />
//             <meshStandardMaterial color="#d0d0d0" roughness={0.1} metalness={0.9} />
//           </mesh>
//         </group>
//         <group position={[0.35, 1.0, -0.35]}>
//           <mesh>
//             <boxGeometry args={[0.2, 0.025, 0.2]} />
//             <meshStandardMaterial color="#e0e0e0" roughness={0.25} metalness={0.7} />
//           </mesh>
//           <mesh position={[0.05, 0.06, 0.05]} castShadow>
//             <cylinderGeometry args={[0.025, 0.025, 0.1, 16]} />
//             <meshStandardMaterial color="#87ceeb" roughness={0.4} metalness={0.1} transparent opacity={0.85} />
//           </mesh>
//         </group>
//       </group>

//       {/* ═══════════════════════════════════════════════════════════════ */}
//       {/* TOILET - SCALED */}
//       {/* ═══════════════════════════════════════════════════════════════ */}
      
//       <group position={[0, 0, toiletPosZ]} scale={[scaleX, scaleY, scaleZ]}>
//         <mesh position={[0, 0.25, 0]} castShadow>
//           <capsuleGeometry args={[0.22, 0.3, 18, 28]} />
//           <meshStandardMaterial color="#ffffff" roughness={0.05} metalness={0.12} />
//         </mesh>
//         <mesh position={[0, 0.42, 0]} rotation={[-Math.PI / 2, 0, 0]} castShadow>
//           <torusGeometry args={[0.2, 0.03, 18, 36]} />
//           <meshStandardMaterial color="#f5f5f5" roughness={0.22} metalness={0.06} />
//         </mesh>
//         <mesh position={[0, 0.44, 0]} rotation={[-Math.PI / 2, 0, 0]} castShadow>
//           <circleGeometry args={[0.22, 36]} />
//           <meshStandardMaterial color="#ffffff" roughness={0.18} metalness={0.1} />
//         </mesh>
//         <mesh position={[0, 0.65, -0.19]} castShadow>
//           <boxGeometry args={[0.36, 0.52, 0.17]} />
//           <meshStandardMaterial color="#ffffff" roughness={0.1} metalness={0.12} />
//         </mesh>
//         <group position={[0, 0.92, -0.12]}>
//           {[-0.04, 0.04].map((x, i) => (
//             <mesh key={i} position={[x, 0, 0]}>
//               <cylinderGeometry args={[0.027, 0.027, 0.02, 24]} />
//               <meshStandardMaterial color="#e0e0e0" roughness={0.12} metalness={0.88} />
//             </mesh>
//           ))}
//         </group>
//         <group position={[0.38, 0.55, 0]}>
//           <mesh position={[0, 0, -0.05]}>
//             <cylinderGeometry args={[0.018, 0.018, 0.08, 16]} />
//             <meshStandardMaterial color="#c0c0c0" roughness={0.1} metalness={0.9} />
//           </mesh>
//           <mesh rotation={[0, 0, Math.PI / 2]}>
//             <cylinderGeometry args={[0.015, 0.015, 0.16, 16]} />
//             <meshStandardMaterial color="#c0c0c0" roughness={0.1} metalness={0.9} />
//           </mesh>
//           <mesh position={[0, 0.09, 0]} rotation={[0, 0, Math.PI / 2]}>
//             <cylinderGeometry args={[0.055, 0.055, 0.1, 28]} />
//             <meshStandardMaterial color="#ffffff" roughness={0.65} metalness={0} />
//           </mesh>
//         </group>
//         <group position={[-0.45, 0, 0.12]}>
//           <mesh position={[0, 0.05, 0]} castShadow>
//             <cylinderGeometry args={[0.075, 0.085, 0.1, 24]} />
//             <meshStandardMaterial color="#e8e8e8" roughness={0.35} metalness={0.25} />
//           </mesh>
//           <mesh position={[0, 0.22, 0]} castShadow>
//             <cylinderGeometry args={[0.058, 0.065, 0.35, 24]} />
//             <meshStandardMaterial color="#ffffff" roughness={0.4} metalness={0.15} transparent opacity={0.88} />
//           </mesh>
//           <mesh position={[0, 0.45, 0]}>
//             <cylinderGeometry args={[0.012, 0.012, 0.15, 12]} />
//             <meshStandardMaterial color="#c0c0c0" roughness={0.3} metalness={0.6} />
//           </mesh>
//         </group>
//       </group>

//       {/* ═══════════════════════════════════════════════════════════════ */}
//       {/* TOWEL RACK - SCALED */}
//       {/* ═══════════════════════════════════════════════════════════════ */}
      
//       <group position={[towelPosX, 1.35 * scaleY, towelPosZ]} scale={[scaleX, scaleY, 1]}>
//         {[0, -0.18].map((y, i) => (
//           <mesh key={i} position={[0, y, 0]} rotation={[0, 0, Math.PI / 2]}>
//             <cylinderGeometry args={[0.018, 0.018, 0.85, 18]} />
//             <meshStandardMaterial color="#d0d0d0" roughness={0.05} metalness={0.95} />
//           </mesh>
//         ))}
//         {[-0.42, 0.42].map((x, i) => (
//           <mesh key={i} position={[x, -0.09, -0.025]}>
//             <cylinderGeometry args={[0.028, 0.028, 0.05, 20]} />
//             <meshStandardMaterial color="#c0c0c0" roughness={0.1} metalness={0.9} />
//           </mesh>
//         ))}
//         <mesh position={[0, -0.09, 0.018]} castShadow>
//           <boxGeometry args={[0.75, 0.4, 0.018]} />
//           <meshStandardMaterial color="#87ceeb" roughness={0.85} metalness={0} />
//         </mesh>
//         <mesh position={[0.22, 0.05, 0.018]} castShadow>
//           <boxGeometry args={[0.32, 0.24, 0.015]} />
//           <meshStandardMaterial color="#b0c4de" roughness={0.82} metalness={0} />
//         </mesh>
//       </group>

//       {/* ═══════════════════════════════════════════════════════════════ */}
//       {/* EXHAUST FAN - SCALED */}
//       {/* ═══════════════════════════════════════════════════════════════ */}
      
//       <group position={[0, (H - 0.02) * scaleY, 0]} scale={[scaleX, scaleY, scaleZ]}>
//         <mesh castShadow>
//           <cylinderGeometry args={[0.19, 0.19, 0.05, 36]} />
//           <meshStandardMaterial color="#f0f0f0" roughness={0.4} metalness={0.1} />
//         </mesh>
//         <mesh position={[0, -0.028, 0]}>
//           <cylinderGeometry args={[0.16, 0.16, 0.012, 6]} />
//           <meshStandardMaterial color="#c0c0c0" roughness={0.35} metalness={0.5} />
//         </mesh>
//         <mesh position={[0, -0.035, 0]}>
//           <cylinderGeometry args={[0.038, 0.038, 0.008, 24]} />
//           <meshStandardMaterial color="#a0a0a0" roughness={0.25} metalness={0.6} />
//         </mesh>
//       </group>

//       {/* ═══════════════════════════════════════════════════════════════ */}
//       {/* ENTRANCE DOOR - SCALED */}
//       {/* ═══════════════════════════════════════════════════════════════ */}
      
//       <group position={[doorPosX, 0, doorPosZ]} scale={[scaleX, scaleY, 1]}>
//         <mesh position={[0, 1.05, 0]} castShadow>
//           <boxGeometry args={[1.02, 2.15, 0.08]} />
//           <meshStandardMaterial color="#8b7355" roughness={0.65} metalness={0.05} />
//         </mesh>
//         <mesh position={[0, 1.05, -0.025]} castShadow>
//           <boxGeometry args={[0.95, 2.05, 0.045]} />
//           <meshStandardMaterial color="#fafafa" roughness={0.45} metalness={0.08} />
//         </mesh>
//         {[0.65, 0.15, -0.35, -0.85].map((y, i) => (
//           <mesh key={i} position={[0, y, -0.05]} castShadow>
//             <boxGeometry args={[0.75, 0.38, 0.015]} />
//             <meshStandardMaterial color="#f5f5f5" roughness={0.55} metalness={0.05} />
//           </mesh>
//         ))}
//         <group position={[-0.35, 1.05, -0.06]}>
//           <mesh>
//             <cylinderGeometry args={[0.025, 0.025, 0.05, 20]} />
//             <meshStandardMaterial color="#d0d0d0" roughness={0.08} metalness={0.95} />
//           </mesh>
//           <mesh position={[0, 0, -0.08]} rotation={[0, 0, -Math.PI / 6]}>
//             <boxGeometry args={[0.12, 0.022, 0.022]} />
//             <meshStandardMaterial color="#d0d0d0" roughness={0.08} metalness={0.95} />
//           </mesh>
//         </group>
//         <mesh position={[-0.35, 1.05, -0.058]}>
//           <cylinderGeometry args={[0.012, 0.012, 0.025, 16]} />
//           <meshStandardMaterial color="#a0a0a0" roughness={0.25} metalness={0.85} />
//         </mesh>
//         <mesh position={[0, 1.75, -0.048]} castShadow>
//           <boxGeometry args={[0.75, 0.45, 0.012]} />
//           <meshStandardMaterial color="#ffffff" transparent opacity={0.35} roughness={0.15} metalness={0.05} />
//         </mesh>
//         <lineSegments position={[0, 1.75, -0.048]}>
//           <edgesGeometry args={[new THREE.BoxGeometry(0.75, 0.45, 0.012)]} />
//           <lineBasicMaterial color="#8b7355" linewidth={2} />
//         </lineSegments>
//         {[1.85, 1.05, 0.25].map((y, i) => (
//           <group key={i} position={[0.47, y, -0.04]}>
//             <mesh>
//               <boxGeometry args={[0.015, 0.08, 0.025]} />
//               <meshStandardMaterial color="#8b7355" roughness={0.45} metalness={0.25} />
//             </mesh>
//             <mesh position={[0.008, 0, 0]}>
//               <cylinderGeometry args={[0.008, 0.008, 0.08, 12]} />
//               <meshStandardMaterial color="#8b7355" roughness={0.45} metalness={0.25} />
//             </mesh>
//           </group>
//         ))}
//         <mesh position={[0, 0.015, 0]} castShadow>
//           <boxGeometry args={[1.02, 0.03, 0.1]} />
//           <meshStandardMaterial color="#8b7355" roughness={0.65} metalness={0.05} />
//         </mesh>
//       </group>

//       {/* ═══════════════════════════════════════════════════════════════ */}
//       {/* DECORATIVE PLANT - SCALED */}
//       {/* ═══════════════════════════════════════════════════════════════ */}
      
//       <group position={[plantPosX, 0, plantPosZ]} scale={[scaleX, scaleY, scaleZ]}>
//         <mesh position={[0, 0.2, 0]} castShadow>
//           <cylinderGeometry args={[0.15, 0.12, 0.4, 24]} />
//           <meshStandardMaterial color="#f5f5f0" roughness={0.35} metalness={0.08} />
//         </mesh>
//         <mesh position={[0, 0.41, 0]}>
//           <torusGeometry args={[0.15, 0.015, 16, 32]} />
//           <meshStandardMaterial color="#e8e8e8" roughness={0.4} metalness={0.1} />
//         </mesh>
//         <mesh position={[0, 0.38, 0]}>
//           <cylinderGeometry args={[0.14, 0.14, 0.04, 24]} />
//           <meshStandardMaterial color="#4a3c2a" roughness={0.95} metalness={0} />
//         </mesh>
//         <mesh position={[0, 0.65, 0]}>
//           <cylinderGeometry args={[0.015, 0.018, 0.5, 12]} />
//           <meshStandardMaterial color="#2d5016" roughness={0.85} metalness={0} />
//         </mesh>
//         {[
//           { pos: [-0.12, 0.55, 0.08], rot: [0.3, -0.5, -0.4], scale: 0.85 },
//           { pos: [0.1, 0.52, -0.1], rot: [-0.2, 0.6, 0.3], scale: 0.8 },
//           { pos: [0.08, 0.58, 0.12], rot: [0.4, 0.3, 0.5], scale: 0.75 },
//           { pos: [-0.15, 0.7, -0.05], rot: [-0.3, -0.7, -0.5], scale: 0.95 },
//           { pos: [0.12, 0.68, 0.1], rot: [0.25, 0.8, 0.4], scale: 0.9 },
//           { pos: [-0.08, 0.75, 0.15], rot: [0.5, -0.4, 0.6], scale: 0.85 },
//           { pos: [0.1, 0.88, -0.08], rot: [-0.4, 0.5, 0.3], scale: 1.0 },
//           { pos: [-0.12, 0.92, 0.1], rot: [0.3, -0.6, -0.5], scale: 0.95 },
//           { pos: [0.05, 0.95, 0.12], rot: [0.2, 0.4, 0.4], scale: 0.9 }
//         ].map((leaf, i) => (
//           <mesh key={i} position={[leaf.pos[0], leaf.pos[1], leaf.pos[2]]} rotation={[leaf.rot[0], leaf.rot[1], leaf.rot[2]]} castShadow>
//             <boxGeometry args={[0.18 * leaf.scale, 0.25 * leaf.scale, 0.002]} />
//             <meshStandardMaterial color={i < 3 ? "#3d6b2e" : i < 6 ? "#4a7c3a" : "#5a8f45"} roughness={0.65} metalness={0} side={THREE.DoubleSide} />
//           </mesh>
//         ))}
//         {[
//           { pos: [0.08, 0.62, -0.15], rot: [0.5, 0.8, 0.3], scale: 0.4 },
//           { pos: [-0.1, 0.82, -0.12], rot: [-0.4, -0.6, -0.4], scale: 0.45 },
//           { pos: [0.12, 1.0, 0.05], rot: [0.3, 0.7, 0.5], scale: 0.5 }
//         ].map((leaf, i) => (
//           <mesh key={`accent-${i}`} position={[leaf.pos[0], leaf.pos[1], leaf.pos[2]]} rotation={[leaf.rot[0], leaf.rot[1], leaf.rot[2]]} castShadow>
//             <boxGeometry args={[0.12 * leaf.scale, 0.16 * leaf.scale, 0.002]} />
//             <meshStandardMaterial color="#6aa84f" roughness={0.6} metalness={0} side={THREE.DoubleSide} />
//           </mesh>
//         ))}
//         {[
//           { pos: [-0.08, 0.4, 0.05], size: 0.018 },
//           { pos: [0.06, 0.4, -0.07], size: 0.015 },
//           { pos: [0.1, 0.4, 0.08], size: 0.02 },
//           { pos: [-0.05, 0.4, -0.09], size: 0.012 }
//         ].map((pebble, i) => (
//           <mesh key={`pebble-${i}`} position={[pebble.pos[0], pebble.pos[1], pebble.pos[2]]}>
//             <sphereGeometry args={[pebble.size, 8, 8]} />
//             <meshStandardMaterial color="#d0d0d0" roughness={0.75} metalness={0.05} />
//           </mesh>
//         ))}
//       </group>

//       {/* ═══════════════════════════════════════════════════════════════ */}
//       {/* BATH MATS - SCALED */}
//       {/* ═══════════════════════════════════════════════════════════════ */}
      
//       <mesh position={[showerPosX, 0.008, -(D/2 - 2.05) * scaleZ]} rotation={[-Math.PI / 2, 0, 0]} castShadow scale={[scaleX, scaleZ, 1]}>
//         <planeGeometry args={[0.6, 0.42]} />
//         <meshStandardMaterial color="#b0c4de" roughness={0.92} metalness={0} />
//       </mesh>

//       <mesh position={[vanityPosX, 0.008, -(D/2 - 1.45) * scaleZ]} rotation={[-Math.PI / 2, 0, Math.PI / 2]} castShadow scale={[scaleX, scaleZ, 1]}>
//         <planeGeometry args={[0.5, 0.35]} />
//         <meshStandardMaterial color="#b0c4de" roughness={0.92} metalness={0} />
//       </mesh>

//       {/* ═══════════════════════════════════════════════════════════════ */}
//       {/* PROFESSIONAL LIGHTING - SCALED POSITIONS */}
//       {/* ═══════════════════════════════════════════════════════════════ */}
      
//       <pointLight position={[0, (H - 0.15) * scaleY, 0]} intensity={2.8} color="#fff8e1" distance={7.5} decay={2} castShadow />
//       <pointLight position={[vanityPosX, (H - 0.3) * scaleY, -(D/2 - 1.7) * scaleZ]} intensity={2.4} color="#fffef8" distance={4} decay={2} />
//       <pointLight position={[vanityPosX, 1.65 * scaleY, -(D/2 - 1.3) * scaleZ]} intensity={1.6} color="#ffffff" distance={2.5} decay={2} />
//       <pointLight position={[showerPosX, (H - 0.2) * scaleY, showerPosZ]} intensity={1.9} color="#ffffff" distance={3.5} decay={2} />
//       <pointLight position={[0, (H - 0.4) * scaleY, (D/2 - 2.35) * scaleZ]} intensity={1.4} color="#fff8e1" distance={3} decay={2} />
//       <pointLight position={[(W/2 - 0.3) * scaleX, (H - 0.5) * scaleY, -(D/2 - 2.1) * scaleZ]} intensity={0.95} color="#ffffff" distance={4.5} decay={2} />
//       <pointLight position={[-(W/2 - 0.3) * scaleX, (H - 0.5) * scaleY, -(D/2 - 2.1) * scaleZ]} intensity={0.95} color="#ffffff" distance={4.5} decay={2} />
//       <pointLight position={[0, (H - 0.6) * scaleY, (D/2 - 1.0) * scaleZ]} intensity={1.05} color="#fff8e1" distance={4} decay={2} />
//       <pointLight position={[doorPosX, 1.8 * scaleY, (D/2 - 0.9) * scaleZ]} intensity={1.2} color="#fffef8" distance={2.5} decay={2} />
//       <pointLight position={[plantPosX, 1.2 * scaleY, (D/2 - 0.7) * scaleZ]} intensity={0.8} color="#f0ffe0" distance={1.8} decay={2} />
//     </group>
//   );
// };


// ═══════════════════════════════════════════════════════════════
// 🎯 BATHROOM SCENE - FIXED FURNITURE POSITIONING
// ═══════════════════════════════════════════════════════════════

const PremiumBathroomScene: React.FC<{ 
  floorTexture: THREE.Texture | null;
  floorTileSize: { width: number; height: number };
  wallTexture: THREE.Texture | null;
  wallTileSize: { width: number; height: number };
  showWallTiles: boolean;
  quality: QualityLevel;
  isGridMode: boolean;
  activeWall: WallType | null;
  selectedTiles: number[];
  onTileClick: (index: number) => void;
  customTiles: WallCustomTiles;
  roomDimensions?: { width: number; depth: number; height: number };
  furnitureScale?: { x: number; y: number; z: number };
  wallTileHeight?: number;
  highlightTileBorders?: boolean;
}> = ({ 
  floorTexture, 
  floorTileSize, 
  wallTexture, 
  wallTileSize, 
  showWallTiles, 
  quality,
  isGridMode,
  activeWall,
  selectedTiles,
  onTileClick,
  customTiles,
  roomDimensions,
  furnitureScale = { x: 1, y: 1, z: 1 },
  wallTileHeight = 11,
  highlightTileBorders = false
}) => {
  
  // ✅ FIX 1: Define REFERENCE room (what furniture was designed for)
  const REFERENCE_ROOM = {
    width: 15 * 0.3048,   // 15 feet = 4.572m
    depth: 15 * 0.3048,   // 15 feet = 4.572m
    height: 11 * 0.3048   // 11 feet = 3.3528m
  };

  // ✅ FIX 2: Use actual room dimensions (custom or default)
  const { width: W, depth: D, height: H } = roomDimensions || ROOM_CONFIGS.bathroom;
  const { x: scaleX, y: scaleY, z: scaleZ } = furnitureScale;
  const actualWallHeight = (wallTileHeight / 11) * H;

  // ✅ FIX 3: Calculate ABSOLUTE positions (not scaled by furnitureScale)
  // These are designed for 15×15 room, will work for ANY room size
  
  // Vanity: Left wall, near back
  const vanityPosX = -W/2 + 0.8;      // 0.8m from left wall
  const vanityPosZ = -D/2 + 0.28;     // 0.28m from back wall
  
  // Shower: Right wall, back corner
  const showerPosX = W/2 - 0.85;      // 0.85m from right wall
  const showerPosZ = -D/2 + 0.85;     // 0.85m from back wall
  
  // Toilet: Center-right, near back
  const toiletPosX = 0;                // Centered
  const toiletPosZ = -D/2 + 0.35;     // 0.35m from back wall
  
  // Door: Right side, front wall
  const doorPosX = W/2 - 1.8;         // 1.8m from right edge
  const doorPosZ = D/2 - 0.002;       // At front wall
  
  // Plant: Left corner, front
  const plantPosX = -W/2 + 0.5;       // 0.5m from left wall
  const plantPosZ = D/2 - 0.5;        // 0.5m from front wall
  
  // Towel rack: Right wall, near back
  const towelPosX = W/2 - 1.9;        // 1.9m from right edge
  const towelPosZ = -D/2 + 0.02;      // Near back wall

  const shouldUseGridWall = (wall: WallType) => {
    return (isGridMode && activeWall === wall) || customTiles[wall].size > 0;
  };

  return (
    <group>
      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* FLOOR & CEILING */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      
      <TiledFloor 
        baseTexture={floorTexture} 
        tileSize={floorTileSize} 
        roomWidth={W} 
        roomDepth={D} 
        position={[0, 0, 0]} 
        quality={quality} 
        highlightBorders={highlightTileBorders} 
      />
      <Ceiling width={W} depth={D} height={H} />

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* WALLS */}
      {/* ═══════════════════════════════════════════════════════════════ */}

      {['back', 'front', 'left', 'right'].map((wallKey) => {
        const wall = wallKey as WallType;
        const wallWidth = wall === 'left' || wall === 'right' ? D : W;
        
        const wallPos = 
          wall === 'back' ? [0, actualWallHeight/2, -D/2] :
          wall === 'front' ? [0, actualWallHeight/2, D/2] :
          wall === 'left' ? [-W/2, actualWallHeight/2, 0] :
          [W/2, actualWallHeight/2, 0];
          
        const wallRot =
          wall === 'front' ? [0, Math.PI, 0] :
          wall === 'left' ? [0, Math.PI/2, 0] :
          wall === 'right' ? [0, -Math.PI/2, 0] :
          [0, 0, 0];

        return showWallTiles && shouldUseGridWall(wall) ? (
          <GridWall
            key={wall}
            baseTexture={wallTexture}
            tileSize={wallTileSize}
            width={wallWidth}
            height={actualWallHeight}
            position={wallPos as [number, number, number]}
            rotation={wallRot as [number, number, number]}
            isGridMode={isGridMode && activeWall === wall}
            selectedTiles={activeWall === wall ? selectedTiles : []}
            onTileClick={onTileClick}
            customTilesMap={customTiles[wall]}
          />
        ) : showWallTiles ? (
          <TiledWall
            key={wall}
            baseTexture={wallTexture}
            tileSize={wallTileSize}
            width={wallWidth}
            height={actualWallHeight}
            position={wallPos as [number, number, number]}
            rotation={wallRot as [number, number, number]}
            quality={quality}
            highlightBorders={highlightTileBorders}
          />
        ) : (
          <mesh key={wall} position={wallPos as [number, number, number]} rotation={wallRot as [number, number, number]}>
            <planeGeometry args={[wallWidth, H]} />
            <meshStandardMaterial 
              color={
                wall === 'front' ? '#ffffff' : 
                wall === 'left' ? '#fef9f3' : 
                wall === 'right' ? '#faf5ed' : 
                '#f5f5f5'
              } 
              roughness={0.85} 
            />
          </mesh>
        );
      })}

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* 🔧 FIXED: VANITY + WASH BASIN - NO FURNITURE SCALE */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      
      <group position={[vanityPosX, 0, vanityPosZ]}>
        {/* Vanity Cabinet Base */}
        <mesh position={[0, 0.45, 0]} castShadow>
          <boxGeometry args={[1.3, 0.9, 0.55]} />
          <meshStandardMaterial color="#ffffff" roughness={0.25} metalness={0.1} />
        </mesh>
        
        {/* Vanity Countertop */}
        <mesh position={[0, 0.92, 0]} castShadow>
          <boxGeometry args={[1.35, 0.05, 0.6]} />
          <meshStandardMaterial color="#f5f5f0" roughness={0.15} metalness={0.45} />
        </mesh>
        
        {/* Cabinet Doors */}
        {[-0.32, 0.32].map((x, i) => (
          <React.Fragment key={i}>
            <mesh position={[x, 0.45, 0.285]} castShadow>
              <boxGeometry args={[0.6, 0.85, 0.02]} />
              <meshStandardMaterial color="#fafafa" roughness={0.3} metalness={0.05} />
            </mesh>
            <mesh position={[x + 0.18, 0.45, 0.305]}>
              <boxGeometry args={[0.15, 0.02, 0.02]} />
              <meshStandardMaterial color="#c0c0c0" roughness={0.1} metalness={0.9} />
            </mesh>
          </React.Fragment>
        ))}
        
        {/* Wash Basin */}
        <group position={[0, 0.88, 0]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.23, 0.19, 0.16, 32]} />
            <meshStandardMaterial color="#ffffff" roughness={0.08} metalness={0.2} />
          </mesh>
          <mesh position={[0, -0.01, 0]}>
            <cylinderGeometry args={[0.19, 0.15, 0.14, 32]} />
            <meshStandardMaterial color="#f8f8f8" roughness={0.1} metalness={0.15} />
          </mesh>
          <mesh position={[0, -0.07, 0]}>
            <cylinderGeometry args={[0.025, 0.025, 0.01, 24]} />
            <meshStandardMaterial color="#888888" roughness={0.3} metalness={0.7} />
          </mesh>
        </group>
        
        {/* Faucet */}
        <group position={[0, 0.95, -0.22]}>
          <mesh>
            <cylinderGeometry args={[0.03, 0.035, 0.02, 24]} />
            <meshStandardMaterial color="#e8e8e8" roughness={0.05} metalness={0.98} />
          </mesh>
          <mesh position={[0, 0.18, 0]}>
            <cylinderGeometry args={[0.015, 0.015, 0.36, 16]} />
            <meshStandardMaterial color="#e8e8e8" roughness={0.05} metalness={0.98} />
          </mesh>
          <mesh position={[0, 0.35, 0.09]} rotation={[Math.PI / 2.8, 0, 0]}>
            <cylinderGeometry args={[0.013, 0.013, 0.18, 16]} />
            <meshStandardMaterial color="#e8e8e8" roughness={0.05} metalness={0.98} />
          </mesh>
          <mesh position={[0, 0.42, 0.18]}>
            <cylinderGeometry args={[0.018, 0.015, 0.03, 20]} />
            <meshStandardMaterial color="#e8e8e8" roughness={0.05} metalness={0.98} />
          </mesh>
          
          {/* Faucet Handles */}
          {[-0.1, 0.1].map((x, i) => (
            <group key={i} position={[x, 0.38, -0.02]}>
              <mesh>
                <cylinderGeometry args={[0.022, 0.022, 0.018, 20]} />
                <meshStandardMaterial color="#d0d0d0" roughness={0.08} metalness={0.95} />
              </mesh>
              <mesh position={[0, 0.015, 0]} rotation={[0, 0, Math.PI / 4]}>
                <boxGeometry args={[0.045, 0.008, 0.008]} />
                <meshStandardMaterial color="#d0d0d0" roughness={0.08} metalness={0.95} />
              </mesh>
            </group>
          ))}
        </group>
        
        {/* Soap Dispenser */}
        <mesh position={[0.48, 0.97, 0.18]} castShadow>
          <cylinderGeometry args={[0.032, 0.038, 0.14, 20]} />
          <meshStandardMaterial color="#ffffff" roughness={0.25} metalness={0.1} transparent opacity={0.92} />
        </mesh>
        <mesh position={[0.48, 1.04, 0.18]}>
          <cylinderGeometry args={[0.015, 0.02, 0.04, 16]} />
          <meshStandardMaterial color="#c0c0c0" roughness={0.15} metalness={0.85} />
        </mesh>
        
        {/* Small Tray */}
        <mesh position={[-0.42, 0.94, 0.12]} castShadow>
          <boxGeometry args={[0.22, 0.015, 0.16]} />
          <meshStandardMaterial color="#d4af37" roughness={0.3} metalness={0.7} />
        </mesh>
      </group>

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* 🔧 FIXED: LED MIRROR - NO FURNITURE SCALE */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      
      <group position={[vanityPosX, 1.65, -D/2 + 0.07]}>
        {/* Mirror Frame */}
        <mesh castShadow>
          <boxGeometry args={[1.25, 0.95, 0.03]} />
          <meshStandardMaterial color="#c8c8c8" roughness={0.18} metalness={0.92} />
        </mesh>
        
        {/* Mirror Glass */}
        <mesh position={[0, 0, 0.018]}>
          <boxGeometry args={[1.19, 0.89, 0.008]} />
          <meshStandardMaterial color="#e8f4f8" roughness={0.02} metalness={0.98} envMapIntensity={2.0} />
        </mesh>
        
        {/* LED Strips */}
        {[[0, 0.49, 1.21, 0.04], [0, -0.49, 1.21, 0.04], [-0.61, 0, 0.03, 0.89], [0.61, 0, 0.03, 0.89]].map((params, i) => (
          <mesh key={i} position={[params[0], params[1], 0.025]}>
            <boxGeometry args={i < 2 ? [params[2], params[3], 0.02] : [params[2], params[3], 0.02]} />
            <meshStandardMaterial 
              color="#ffffff" 
              emissive="#fffef8" 
              emissiveIntensity={i < 2 ? (i === 0 ? 1.2 : 0.9) : 0.7} 
            />
          </mesh>
        ))}
        
        {/* LED Lighting */}
        <rectAreaLight position={[0, 0.49, 0.05]} width={1.21} height={0.04} intensity={3.5} color="#fffef8" />
        <rectAreaLight position={[0, -0.49, 0.05]} width={1.21} height={0.04} intensity={2.5} color="#fffef8" />
      </group>

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* 🔧 FIXED: SHOWER ENCLOSURE - NO FURNITURE SCALE */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      
      <group position={[showerPosX, 0, showerPosZ]}>
        {/* Shower Base */}
        <mesh position={[0, 0.04, 0]} castShadow>
          <boxGeometry args={[1.0, 0.08, 1.0]} />
          <meshStandardMaterial color="#fafafa" roughness={0.2} metalness={0.15} />
        </mesh>
        
        {/* Drain Ring */}
        <mesh position={[0, 0.09, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.49, 0.015, 12, 32]} />
          <meshStandardMaterial color="#e8e8e8" roughness={0.25} metalness={0.2} />
        </mesh>
        <mesh position={[0, 0.085, 0]}>
          <cylinderGeometry args={[0.045, 0.045, 0.01, 32]} />
          <meshStandardMaterial color="#888888" roughness={0.25} metalness={0.75} />
        </mesh>
        
        {/* Glass Walls */}
        {[[0, 1.25, -0.5, 1.0, 2.5, 0.012], [-0.5, 1.25, 0, 1.0, 2.5, 0.012], [0.5, 1.25, 0, 1.0, 2.5, 0.012]].map((params, i) => (
          <mesh key={i} position={[params[0], params[1], params[2]]} rotation={i === 0 ? [0, 0, 0] : [0, Math.PI / 2, 0]} castShadow>
            <boxGeometry args={[params[3], params[4], params[5]]} />
            <meshStandardMaterial color="#ffffff" transparent opacity={0.32} roughness={0.05} metalness={0.08} />
          </mesh>
        ))}
        
        {/* Metal Frame */}
        {[[0, 2.5, -0.5, 1.0, 0.025, 0.025], [-0.5, 2.5, 0, 0.025, 0.025, 1.0], [0.5, 2.5, 0, 0.025, 0.025, 1.0], [-0.5, 1.25, -0.5, 0.025, 2.5, 0.025], [0.5, 1.25, -0.5, 0.025, 2.5, 0.025]].map((params, i) => (
          <mesh key={i} position={[params[0], params[1], params[2]]}>
            <boxGeometry args={[params[3], params[4], params[5]]} />
            <meshStandardMaterial color="#d0d0d0" roughness={0.05} metalness={0.95} />
          </mesh>
        ))}
        
        {/* Shower Head */}
        <group position={[0, 2.15, -0.35]}>
          <mesh>
            <boxGeometry args={[0.06, 0.06, 0.1]} />
            <meshStandardMaterial color="#e0e0e0" roughness={0.05} metalness={0.95} />
          </mesh>
          <mesh position={[0, 0, 0.18]} rotation={[0, Math.PI / 2, 0]}>
            <cylinderGeometry args={[0.018, 0.018, 0.35, 16]} />
            <meshStandardMaterial color="#e0e0e0" roughness={0.05} metalness={0.95} />
          </mesh>
          <mesh position={[0, -0.06, 0.35]} rotation={[Math.PI / 7, 0, 0]}>
            <cylinderGeometry args={[0.12, 0.12, 0.035, 40]} />
            <meshStandardMaterial color="#e8e8e8" roughness={0.08} metalness={0.92} />
          </mesh>
          <mesh position={[0, -0.065, 0.35]} rotation={[Math.PI / 7, 0, 0]}>
            <cylinderGeometry args={[0.11, 0.11, 0.01, 40]} />
            <meshStandardMaterial color="#a0a0a0" roughness={0.35} metalness={0.65} />
          </mesh>
        </group>
        
        {/* Temperature Control Panel */}
        <group position={[-0.42, 1.15, -0.45]}>
          <mesh>
            <boxGeometry args={[0.15, 0.35, 0.03]} />
            <meshStandardMaterial color="#e8e8e8" roughness={0.08} metalness={0.9} />
          </mesh>
          <mesh position={[0, 0.08, 0.025]}>
            <cylinderGeometry args={[0.055, 0.055, 0.04, 28]} />
            <meshStandardMaterial color="#e0e0e0" roughness={0.05} metalness={0.95} />
          </mesh>
          <mesh position={[0, -0.08, 0.025]}>
            <cylinderGeometry args={[0.042, 0.042, 0.035, 24]} />
            <meshStandardMaterial color="#d0d0d0" roughness={0.08} metalness={0.92} />
          </mesh>
        </group>
        
        {/* Hand Shower */}
        <group position={[-0.42, 1.55, -0.45]}>
          <mesh>
            <torusGeometry args={[0.032, 0.012, 14, 28, Math.PI]} />
            <meshStandardMaterial color="#e0e0e0" roughness={0.05} metalness={0.95} />
          </mesh>
          <mesh position={[0, -0.1, 0.025]} rotation={[Math.PI / 5, 0, 0]}>
            <capsuleGeometry args={[0.022, 0.14, 14, 24]} />
            <meshStandardMaterial color="#e8e8e8" roughness={0.08} metalness={0.92} />
          </mesh>
          <mesh position={[0, -0.18, 0.02]} rotation={[Math.PI / 5, 0, 0]}>
            <sphereGeometry args={[0.025, 16, 16]} />
            <meshStandardMaterial color="#d0d0d0" roughness={0.1} metalness={0.9} />
          </mesh>
        </group>
        
        {/* Shampoo Shelf */}
        <group position={[0.35, 1.0, -0.35]}>
          <mesh>
            <boxGeometry args={[0.2, 0.025, 0.2]} />
            <meshStandardMaterial color="#e0e0e0" roughness={0.25} metalness={0.7} />
          </mesh>
          <mesh position={[0.05, 0.06, 0.05]} castShadow>
            <cylinderGeometry args={[0.025, 0.025, 0.1, 16]} />
            <meshStandardMaterial color="#87ceeb" roughness={0.4} metalness={0.1} transparent opacity={0.85} />
          </mesh>
        </group>
      </group>

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* 🔧 FIXED: TOILET - NO FURNITURE SCALE */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      
      <group position={[toiletPosX, 0, toiletPosZ]}>
        {/* Toilet Bowl Base */}
        <mesh position={[0, 0.25, 0]} castShadow>
          <capsuleGeometry args={[0.22, 0.3, 18, 28]} />
          <meshStandardMaterial color="#ffffff" roughness={0.05} metalness={0.12} />
        </mesh>
        
        {/* Toilet Seat Ring */}
        <mesh position={[0, 0.42, 0]} rotation={[-Math.PI / 2, 0, 0]} castShadow>
          <torusGeometry args={[0.2, 0.03, 18, 36]} />
          <meshStandardMaterial color="#f5f5f5" roughness={0.22} metalness={0.06} />
        </mesh>
        
        {/* Toilet Seat Cover */}
        <mesh position={[0, 0.44, 0]} rotation={[-Math.PI / 2, 0, 0]} castShadow>
          <circleGeometry args={[0.22, 36]} />
          <meshStandardMaterial color="#ffffff" roughness={0.18} metalness={0.1} />
        </mesh>
        
        {/* Toilet Tank */}
        <mesh position={[0, 0.65, -0.19]} castShadow>
          <boxGeometry args={[0.36, 0.52, 0.17]} />
          <meshStandardMaterial color="#ffffff" roughness={0.1} metalness={0.12} />
        </mesh>
        
        {/* Flush Buttons */}
        <group position={[0, 0.92, -0.12]}>
          {[-0.04, 0.04].map((x, i) => (
            <mesh key={i} position={[x, 0, 0]}>
              <cylinderGeometry args={[0.027, 0.027, 0.02, 24]} />
              <meshStandardMaterial color="#e0e0e0" roughness={0.12} metalness={0.88} />
            </mesh>
          ))}
        </group>
        
        {/* Toilet Paper Holder */}
        <group position={[0.38, 0.55, 0]}>
          <mesh position={[0, 0, -0.05]}>
            <cylinderGeometry args={[0.018, 0.018, 0.08, 16]} />
            <meshStandardMaterial color="#c0c0c0" roughness={0.1} metalness={0.9} />
          </mesh>
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.015, 0.015, 0.16, 16]} />
            <meshStandardMaterial color="#c0c0c0" roughness={0.1} metalness={0.9} />
          </mesh>
          <mesh position={[0, 0.09, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.055, 0.055, 0.1, 28]} />
            <meshStandardMaterial color="#ffffff" roughness={0.65} metalness={0} />
          </mesh>
        </group>
        
        {/* Toilet Brush Holder */}
        <group position={[-0.45, 0, 0.12]}>
          <mesh position={[0, 0.05, 0]} castShadow>
            <cylinderGeometry args={[0.075, 0.085, 0.1, 24]} />
            <meshStandardMaterial color="#e8e8e8" roughness={0.35} metalness={0.25} />
          </mesh>
          <mesh position={[0, 0.22, 0]} castShadow>
            <cylinderGeometry args={[0.058, 0.065, 0.35, 24]} />
            <meshStandardMaterial color="#ffffff" roughness={0.4} metalness={0.15} transparent opacity={0.88} />
          </mesh>
          <mesh position={[0, 0.45, 0]}>
            <cylinderGeometry args={[0.012, 0.012, 0.15, 12]} />
            <meshStandardMaterial color="#c0c0c0" roughness={0.3} metalness={0.6} />
          </mesh>
        </group>
      </group>

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* 🔧 FIXED: TOWEL RACK - NO FURNITURE SCALE */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      
      <group position={[towelPosX, 1.35, towelPosZ]}>
        {/* Towel Bars */}
        {[0, -0.18].map((y, i) => (
          <mesh key={i} position={[0, y, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.018, 0.018, 0.85, 18]} />
            <meshStandardMaterial color="#d0d0d0" roughness={0.05} metalness={0.95} />
          </mesh>
        ))}
        
        {/* Wall Mounts */}
        {[-0.42, 0.42].map((x, i) => (
          <mesh key={i} position={[x, -0.09, -0.025]}>
            <cylinderGeometry args={[0.028, 0.028, 0.05, 20]} />
            <meshStandardMaterial color="#c0c0c0" roughness={0.1} metalness={0.9} />
          </mesh>
        ))}
        
        {/* Large Towel */}
        <mesh position={[0, -0.09, 0.018]} castShadow>
          <boxGeometry args={[0.75, 0.4, 0.018]} />
          <meshStandardMaterial color="#87ceeb" roughness={0.85} metalness={0} />
        </mesh>
        
        {/* Small Hand Towel */}
        <mesh position={[0.22, 0.05, 0.018]} castShadow>
          <boxGeometry args={[0.32, 0.24, 0.015]} />
          <meshStandardMaterial color="#b0c4de" roughness={0.82} metalness={0} />
        </mesh>
      </group>

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* 🔧 FIXED: EXHAUST FAN - NO FURNITURE SCALE */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      
      <group position={[0, H - 0.02, 0]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.19, 0.19, 0.05, 36]} />
          <meshStandardMaterial color="#f0f0f0" roughness={0.4} metalness={0.1} />
        </mesh>
        <mesh position={[0, -0.028, 0]}>
          <cylinderGeometry args={[0.16, 0.16, 0.012, 6]} />
          <meshStandardMaterial color="#c0c0c0" roughness={0.35} metalness={0.5} />
        </mesh>
        <mesh position={[0, -0.035, 0]}>
          <cylinderGeometry args={[0.038, 0.038, 0.008, 24]} />
          <meshStandardMaterial color="#a0a0a0" roughness={0.25} metalness={0.6} />
        </mesh>
      </group>

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* 🔧 FIXED: ENTRANCE DOOR - NO FURNITURE SCALE */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      
      <group position={[doorPosX, 0, doorPosZ]}>
        {/* Door Frame */}
        <mesh position={[0, 1.05, 0]} castShadow>
          <boxGeometry args={[1.02, 2.15, 0.08]} />
          <meshStandardMaterial color="#8b7355" roughness={0.65} metalness={0.05} />
        </mesh>
        
        {/* Door Panel */}
        <mesh position={[0, 1.05, -0.025]} castShadow>
          <boxGeometry args={[0.95, 2.05, 0.045]} />
          <meshStandardMaterial color="#fafafa" roughness={0.45} metalness={0.08} />
        </mesh>
        
        {/* Door Panels (Decorative) */}
        {[0.65, 0.15, -0.35, -0.85].map((y, i) => (
          <mesh key={i} position={[0, y, -0.05]} castShadow>
            <boxGeometry args={[0.75, 0.38, 0.015]} />
            <meshStandardMaterial color="#f5f5f5" roughness={0.55} metalness={0.05} />
          </mesh>
        ))}
        
        {/* Door Handle */}
        <group position={[-0.35, 1.05, -0.06]}>
          <mesh>
            <cylinderGeometry args={[0.025, 0.025, 0.05, 20]} />
            <meshStandardMaterial color="#d0d0d0" roughness={0.08} metalness={0.95} />
          </mesh>
          <mesh position={[0, 0, -0.08]} rotation={[0, 0, -Math.PI / 6]}>
            <boxGeometry args={[0.12, 0.022, 0.022]} />
            <meshStandardMaterial color="#d0d0d0" roughness={0.08} metalness={0.95} />
          </mesh>
        </group>
        
        {/* Keyhole */}
        <mesh position={[-0.35, 1.05, -0.058]}>
          <cylinderGeometry args={[0.012, 0.012, 0.025, 16]} />
          <meshStandardMaterial color="#a0a0a0" roughness={0.25} metalness={0.85} />
        </mesh>
        
        {/* Door Window */}
        <mesh position={[0, 1.75, -0.048]} castShadow>
          <boxGeometry args={[0.75, 0.45, 0.012]} />
          <meshStandardMaterial color="#ffffff" transparent opacity={0.35} roughness={0.15} metalness={0.05} />
        </mesh>
        
        {/* Window Frame */}
        <lineSegments position={[0, 1.75, -0.048]}>
          <edgesGeometry args={[new THREE.BoxGeometry(0.75, 0.45, 0.012)]} />
          <lineBasicMaterial color="#8b7355" linewidth={2} />
        </lineSegments>
        
        {/* Hinges */}
        {[1.85, 1.05, 0.25].map((y, i) => (
          <group key={i} position={[0.47, y, -0.04]}>
            <mesh>
              <boxGeometry args={[0.015, 0.08, 0.025]} />
              <meshStandardMaterial color="#8b7355" roughness={0.45} metalness={0.25} />
            </mesh>
            <mesh position={[0.008, 0, 0]}>
              <cylinderGeometry args={[0.008, 0.008, 0.08, 12]} />
              <meshStandardMaterial color="#8b7355" roughness={0.45} metalness={0.25} />
            </mesh>
          </group>
        ))}
        
        {/* Door Threshold */}
        <mesh position={[0, 0.015, 0]} castShadow>
          <boxGeometry args={[1.02, 0.03, 0.1]} />
          <meshStandardMaterial color="#8b7355" roughness={0.65} metalness={0.05} />
        </mesh>
      </group>

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* 🔧 FIXED: DECORATIVE PLANT - NO FURNITURE SCALE */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      
      <group position={[plantPosX, 0, plantPosZ]}>
        {/* Pot */}
        <mesh position={[0, 0.2, 0]} castShadow>
          <cylinderGeometry args={[0.15, 0.12, 0.4, 24]} />
          <meshStandardMaterial color="#f5f5f0" roughness={0.35} metalness={0.08} />
        </mesh>
        
        {/* Pot Rim */}
        <mesh position={[0, 0.41, 0]}>
          <torusGeometry args={[0.15, 0.015, 16, 32]} />
          <meshStandardMaterial color="#e8e8e8" roughness={0.4} metalness={0.1} />
        </mesh>
        
        {/* Soil */}
        <mesh position={[0, 0.38, 0]}>
          <cylinderGeometry args={[0.14, 0.14, 0.04, 24]} />
          <meshStandardMaterial color="#4a3c2a" roughness={0.95} metalness={0} />
        </mesh>
        
        {/* Stem */}
        <mesh position={[0, 0.65, 0]}>
          <cylinderGeometry args={[0.015, 0.018, 0.5, 12]} />
          <meshStandardMaterial color="#2d5016" roughness={0.85} metalness={0} />
        </mesh>
        
        {/* Leaves (Multiple layers for fullness) */}
        {[
          { pos: [-0.12, 0.55, 0.08], rot: [0.3, -0.5, -0.4], scale: 0.85 },
          { pos: [0.1, 0.52, -0.1], rot: [-0.2, 0.6, 0.3], scale: 0.8 },
          { pos: [0.08, 0.58, 0.12], rot: [0.4, 0.3, 0.5], scale: 0.75 },
          { pos: [-0.15, 0.7, -0.05], rot: [-0.3, -0.7, -0.5], scale: 0.95 },
          { pos: [0.12, 0.68, 0.1], rot: [0.25, 0.8, 0.4], scale: 0.9 },
          { pos: [-0.08, 0.75, 0.15], rot: [0.5, -0.4, 0.6], scale: 0.85 },
          { pos: [0.1, 0.88, -0.08], rot: [-0.4, 0.5, 0.3], scale: 1.0 },
          { pos: [-0.12, 0.92, 0.1], rot: [0.3, -0.6, -0.5], scale: 0.95 },
          { pos: [0.05, 0.95, 0.12], rot: [0.2, 0.4, 0.4], scale: 0.9 }
        ].map((leaf, i) => (
          <mesh key={i} position={[leaf.pos[0], leaf.pos[1], leaf.pos[2]]} rotation={[leaf.rot[0], leaf.rot[1], leaf.rot[2]]} castShadow>
            <boxGeometry args={[0.18 * leaf.scale, 0.25 * leaf.scale, 0.002]} />
            <meshStandardMaterial 
              color={i < 3 ? "#3d6b2e" : i < 6 ? "#4a7c3a" : "#5a8f45"} 
              roughness={0.65} 
              metalness={0} 
              side={THREE.DoubleSide} 
            />
          </mesh>
        ))}
        
        {/* Accent Leaves */}
        {[
          { pos: [0.08, 0.62, -0.15], rot: [0.5, 0.8, 0.3], scale: 0.4 },
          { pos: [-0.1, 0.82, -0.12], rot: [-0.4, -0.6, -0.4], scale: 0.45 },
          { pos: [0.12, 1.0, 0.05], rot: [0.3, 0.7, 0.5], scale: 0.5 }
        ].map((leaf, i) => (
          <mesh key={`accent-${i}`} position={[leaf.pos[0], leaf.pos[1], leaf.pos[2]]} rotation={[leaf.rot[0], leaf.rot[1], leaf.rot[2]]} castShadow>
            <boxGeometry args={[0.12 * leaf.scale, 0.16 * leaf.scale, 0.002]} />
            <meshStandardMaterial color="#6aa84f" roughness={0.6} metalness={0} side={THREE.DoubleSide} />
          </mesh>
        ))}
        
        {/* Decorative Pebbles */}
        {[
          { pos: [-0.08, 0.4, 0.05], size: 0.018 },
          { pos: [0.06, 0.4, -0.07], size: 0.015 },
          { pos: [0.1, 0.4, 0.08], size: 0.02 },
          { pos: [-0.05, 0.4, -0.09], size: 0.012 }
        ].map((pebble, i) => (
          <mesh key={`pebble-${i}`} position={[pebble.pos[0], pebble.pos[1], pebble.pos[2]]}>
            <sphereGeometry args={[pebble.size, 8, 8]} />
            <meshStandardMaterial color="#d0d0d0" roughness={0.75} metalness={0.05} />
          </mesh>
        ))}
      </group>

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* 🔧 FIXED: BATH MATS - ABSOLUTE POSITIONING */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      
      {/* Mat near shower */}
      <mesh position={[showerPosX, 0.008, -D/2 + 2.05]} rotation={[-Math.PI / 2, 0, 0]} castShadow>
        <planeGeometry args={[0.6, 0.42]} />
        <meshStandardMaterial color="#b0c4de" roughness={0.92} metalness={0} />
      </mesh>

      {/* Mat near vanity */}
      <mesh position={[vanityPosX, 0.008, -D/2 + 1.45]} rotation={[-Math.PI / 2, 0, Math.PI / 2]} castShadow>
        <planeGeometry args={[0.5, 0.35]} />
        <meshStandardMaterial color="#b0c4de" roughness={0.92} metalness={0} />
      </mesh>

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* 🔧 FIXED: PROFESSIONAL LIGHTING - ABSOLUTE POSITIONING */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      
      {/* Ceiling Center */}
      <pointLight position={[0, H - 0.15, 0]} intensity={2.8} color="#fff8e1" distance={7.5} decay={2} castShadow />
      
      {/* Vanity Area */}
      <pointLight position={[vanityPosX, H - 0.3, -D/2 + 1.7]} intensity={2.4} color="#fffef8" distance={4} decay={2} />
      <pointLight position={[vanityPosX, 1.65, -D/2 + 1.3]} intensity={1.6} color="#ffffff" distance={2.5} decay={2} />
      
      {/* Shower Area */}
      <pointLight position={[showerPosX, H - 0.2, showerPosZ]} intensity={1.9} color="#ffffff" distance={3.5} decay={2} />
      
      {/* Room Center */}
      <pointLight position={[0, H - 0.4, D/2 - 2.35]} intensity={1.4} color="#fff8e1" distance={3} decay={2} />
      
      {/* Side Walls */}
      <pointLight position={[W/2 - 0.3, H - 0.5, -D/2 + 2.1]} intensity={0.95} color="#ffffff" distance={4.5} decay={2} />
      <pointLight position={[-W/2 + 0.3, H - 0.5, -D/2 + 2.1]} intensity={0.95} color="#ffffff" distance={4.5} decay={2} />
      
      {/* Front Area */}
      <pointLight position={[0, H - 0.6, D/2 - 1.0]} intensity={1.05} color="#fff8e1" distance={4} decay={2} />
      
      {/* Door Area */}
      <pointLight position={[doorPosX, 1.8, D/2 - 0.9]} intensity={1.2} color="#fffef8" distance={2.5} decay={2} />
      
      {/* Plant Accent Light */}
      <pointLight position={[plantPosX, 1.2, plantPosZ]} intensity={0.8} color="#f0ffe0" distance={1.8} decay={2} />
    </group>
  );
};

const WallSelectorModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSelectWall: (wall: WallType) => void;
  roomType: string;
  wallTileHeight?: number;  // ✅ ADD THIS
}> = ({ isOpen, onClose, onSelectWall, roomType, wallTileHeight = 11 }) => {  // ✅ ADD THIS
  if (!isOpen) return null;

  const roomConfig = ROOM_CONFIGS[roomType as keyof typeof ROOM_CONFIGS];
  
  const getWallInfo = (wall: WallType) => {
    const wallTileSize = { width: 30, height: 45 };
    const tileSizeM = { width: wallTileSize.width / 100, height: wallTileSize.height / 100 };
    
    // ✅ Calculate actual height based on wallTileHeight
    const actualHeight = (wallTileHeight / 11) * roomConfig.height;
    
    if (wall === 'back' || wall === 'front') {
      const cols = Math.ceil(roomConfig.width / tileSizeM.width);
      const rows = Math.ceil(actualHeight / tileSizeM.height);  // ✅ Use actualHeight
      return { cols, rows, total: cols * rows };
    } else {
      const cols = Math.ceil(roomConfig.depth / tileSizeM.width);
      const rows = Math.ceil(actualHeight / tileSizeM.height);  // ✅ Use actualHeight
      return { cols, rows, total: cols * rows };
    }
  };

  const walls: { type: WallType; label: string; icon: string }[] = roomType === 'kitchen' 
    ? [{ type: 'back', label: 'Back Wall (Fridge Area)', icon: '🔲' }]
    : [
        { type: 'back', label: 'Back Wall', icon: '🔲' },
        { type: 'front', label: 'Front Wall', icon: '🔳' },
        { type: 'left', label: 'Left Wall', icon: '◀️' },
        { type: 'right', label: 'Right Wall', icon: '▶️' },
      ];

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 animate-slideUp">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <Layers className="w-6 h-6 text-blue-600" />
            Select Wall to Edit
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <p className="text-sm text-gray-600 mb-4">
          {roomType === 'kitchen' 
            ? 'Only back wall tiles can be customized in kitchen view'
            : `Choose wall to customize (Height: ${wallTileHeight}ft)`  // ✅ Show height
          }
        </p>

        <div className="space-y-3">
          {walls.map((wall) => {
            const info = getWallInfo(wall.type);
            return (
              <button
                key={wall.type}
                onClick={() => onSelectWall(wall.type)}
                className="w-full p-4 bg-gradient-to-r from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100 rounded-xl transition-all border-2 border-transparent hover:border-blue-400 text-left group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{wall.icon}</span>
                    <div>
                      <h4 className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                        {wall.label}
                      </h4>
                      <p className="text-xs text-gray-500">
                        {info.cols}W × {info.rows}H = {info.total} tiles @ {wallTileHeight}ft  {/* ✅ Show height */}
                      </p>
                    </div>
                  </div>
                  <div className="text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
                    →
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <button
          onClick={onClose}
          className="w-full mt-4 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold transition-all"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};



const RandomPatternModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  currentUser?: any; 
  onApplyPattern: (result: QRScanResult, pattern: { type: PatternType; variant: number }) => void;
  roomType: string;
  wallTileHeight?: number; // ✅ FIX 1: Added missing prop
}> = ({ isOpen, onClose, onApplyPattern, roomType, currentUser, wallTileHeight = 11 }) => { // ✅ FIX 2: Destructure wallTileHeight
  
  const [uploadMode, setUploadMode] = useState<UploadMode>('select');
  const [selectedPattern, setSelectedPattern] = useState<PatternType>('vertical');
  const [patternVariant, setPatternVariant] = useState(0);
  const [manualCode, setManualCode] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [scanError, setScanError] = useState<string>('');
  const [lastAppliedTexture, setLastAppliedTexture] = useState<THREE.Texture | null>(null);

  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const customDimensions = useMemo(() => getRoomDimensions(roomType), [roomType]);
  
  const [isAutoShuffling, setIsAutoShuffling] = useState(false);
  const [shuffleSpeed, setShuffleSpeed] = useState<number>(1500);
  
  const fileInputRef = useRef<HTMLInputElement>(null);


   const getWallDimensions = useCallback((wall: WallType, customWallHeight?: number) => {  // ✅ Add parameter
  let roomConfig = ROOM_CONFIGS[roomType as keyof typeof ROOM_CONFIGS];
  
  // Check for custom dimensions
  const customDims = getRoomDimensions(roomType);
  if (customDims) {
    roomConfig = {
      width: customDims.width * 0.3048,
      depth: customDims.depth * 0.3048,
      height: customDims.height * 0.3048
    };
  }
  
  const wallTileSize = { width: 30, height: 45 };
  const tileSizeM = { 
    width: wallTileSize.width / 100, 
    height: wallTileSize.height / 100 
  };
  
  // ✅ Calculate actual height based on wallTileHeight parameter
  let heightToUse = roomConfig.height;  // Default: full height
  
  if (customWallHeight !== undefined && customWallHeight > 0) {
    const maxHeightFt = roomConfig.height / 0.3048;
    
    if (customWallHeight <= maxHeightFt) {
      heightToUse = customWallHeight * 0.3048;  // Convert feet to meters
    }
  }
  
  if (wall === 'back' || wall === 'front') {
    return {
      cols: Math.ceil(roomConfig.width / tileSizeM.width),
      rows: Math.ceil(heightToUse / tileSizeM.height)  // ✅ Use heightToUse
    };
  } else {
    return {
      cols: Math.ceil(roomConfig.depth / tileSizeM.width),
      rows: Math.ceil(heightToUse / tileSizeM.height)  // ✅ Use heightToUse
    };
  }
}, [roomType]);  // ✅ Dependency is correct
  const backWallDims = useMemo(() => getWallDimensions('back', wallTileHeight), [getWallDimensions, wallTileHeight]); // ✅ FIX 7: Pass wallTileHeight
  
  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        setSuccess(null);
        setError(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [success, error]);
  
  // ✅ FIX 8: Updated currentPatternTiles calculation
  const currentPatternTiles = useMemo(() => {
    if (roomType === 'kitchen') {
      const pattern = generatePattern(selectedPattern, backWallDims.cols, backWallDims.rows, patternVariant);
      return pattern.length;
    } else {
      const backPattern = generatePattern(selectedPattern, backWallDims.cols, backWallDims.rows, patternVariant);
      const frontDims = getWallDimensions('front', wallTileHeight); // ✅ Pass wallTileHeight
      const leftDims = getWallDimensions('left', wallTileHeight);   // ✅ Pass wallTileHeight
      const rightDims = getWallDimensions('right', wallTileHeight); // ✅ Pass wallTileHeight
      
      return backPattern.length +
             generatePattern(selectedPattern, frontDims.cols, frontDims.rows, patternVariant).length +
             generatePattern(selectedPattern, leftDims.cols, leftDims.rows, patternVariant).length +
             generatePattern(selectedPattern, rightDims.cols, rightDims.rows, patternVariant).length;
    }
  }, [selectedPattern, patternVariant, roomType, backWallDims, getWallDimensions, wallTileHeight]); // ✅ FIX 9: Added wallTileHeight dependency

  const getRandomPattern = useCallback((): PatternType => {
    const patterns: PatternType[] = [
      'vertical', 'horizontal', 'diagonal', 'checkerboard',
      'random', 'border', 'corners', 'cross'
    ];
    const randomIndex = Math.floor(Math.random() * patterns.length);
    return patterns[randomIndex];
  }, []);

  useEffect(() => {
    if (!isAutoShuffling) return;
    
    const interval = setInterval(() => {
      setSelectedPattern(getRandomPattern());
      setPatternVariant(Math.floor(Math.random() * 10));
    }, shuffleSpeed);
    
    return () => clearInterval(interval);
  }, [isAutoShuffling, shuffleSpeed, getRandomPattern]);

  useEffect(() => {
    if (uploadMode !== 'select') {
      setIsAutoShuffling(false);
    }
  }, [uploadMode]);

  const handleShuffleVariant = () => {
    setPatternVariant(prev => (prev + 1) % 10);
  };

  const handleShufflePattern = () => {
    setSelectedPattern(getRandomPattern());
    setPatternVariant(Math.floor(Math.random() * 10));
  };

  const handleToggleAutoShuffle = () => {
    setIsAutoShuffling(prev => !prev);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setScanError('Please select a valid image file (JPG, PNG, WebP)');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setScanError('Image size must be less than 10MB');
      return;
    }

    setIsProcessing(true);
    setScanError('');

    try {
      const imageUrl = URL.createObjectURL(file);

      const mockQRData: QRScanResult = {
        tileId: 'PATTERN_' + Math.random().toString(36).substr(2, 9).toUpperCase(),
        tileName: file.name.split('.')[0],
        imageUrl: imageUrl,
        size: { width: 30, height: 45 }
      };

      onApplyPattern(mockQRData, { type: selectedPattern, variant: patternVariant });
      setUploadMode('select');
      setIsAutoShuffling(false);
      onClose();
      
      console.log('✅ Pattern applied from uploaded image:', file.name);
    } catch (error) {
      setScanError('Failed to process image. Please try again.');
      console.error('Upload error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!manualCode.trim()) {
      setScanError('Please enter a tile code');
      return;
    }

    setIsProcessing(true);
    setScanError('');

    try {
      console.log('🔍 Searching tile for wall pattern:', manualCode.trim());
      
      const result = await getTileByCode(manualCode.trim().toUpperCase());
      
      if (result.success && result.tile) {
        const tileData = result.tile;
        
        if (!verifyTileSeller(tileData, currentUser)) {
          const tileSellerId = (tileData as any)?.seller_id || 
                               (tileData as any)?.sellerId || 
                               (tileData as any)?.created_by || 
                               'unknown-seller';
          
          console.error('❌ BLOCKED: Wall pattern manual code - unauthorized seller', {
            method: 'PATTERN_MANUAL',
            inputCode: manualCode.trim().toUpperCase(),
            tileId: tileData.id || 'unknown',
            tileName: tileData.name || 'unknown',
            tileSeller: tileSellerId,
            workerSeller: currentUser?.uid || 'not-logged-in',
            patternType: selectedPattern,
            patternVariant: patternVariant,
            blocked: true,
            timestamp: new Date().toISOString()
          });
          
          setScanError(`⛔ BLOCKED: Pattern tile "${tileData.name}" belongs to another seller.\n\nCode: ${manualCode.trim().toUpperCase()}\n\nYou can only use tile codes from your own seller's inventory for wall patterns.\n\nPlease contact your seller for correct tile codes.`);
          setIsProcessing(false);
          return;
        }
        
        const imageUrl = tileData.imageUrl || tileData.image_url;
        
        if (imageUrl) {
          const qrData: QRScanResult = {
            tileId: tileData.id,
            tileName: tileData.name,
            imageUrl: imageUrl,
            size: { 
              width: tileData.size_width || 30, 
              height: tileData.size_height || 45 
            }
          };

          onApplyPattern(qrData, { type: selectedPattern, variant: patternVariant });
          setUploadMode('select');
          setManualCode('');
          setIsAutoShuffling(false);
          onClose();
          
          console.log('✅ Wall pattern applied from manual code (seller verified):', tileData.name);
        } else {
          setScanError('Tile found but no image available');
        }
      } else {
        setScanError(result.error || 'Tile not found. Please check the code.');
        console.error('❌ Tile code search failed:', result.error);
      }
      
    } catch (err) {
      console.error('❌ Manual search error:', err);
      setScanError('Failed to search tile. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleQRScanSuccess = async (qrData: any) => {
    console.log('🎯 QR Scanned for wall pattern:', qrData);
    
    setIsProcessing(true);
    setScanError('');

    try {
      let tileData: any = null;
      
      if (qrData.tileId) {
        tileData = await getTileById(qrData.tileId.trim());
        
        if (!tileData) {
          const result = await getTileByCode(qrData.tileId.trim());
          if (result.success && result.tile) {
            tileData = result.tile;
          }
        }
      }
      
      if (tileData && (tileData.imageUrl || tileData.image_url)) {
        const userForVerification = currentUser || (auth.currentUser ? {
          uid: auth.currentUser.uid,
          user_id: auth.currentUser.uid,
          email: auth.currentUser.email,
          role: 'worker'
        } : null);
        
        if (!verifyTileSeller(tileData, userForVerification)) {
          const tileSellerId = (tileData as any)?.seller_id || 
                               (tileData as any)?.sellerId || 
                               'unknown';
          
          console.error('❌ BLOCKED: Wall pattern QR - unauthorized seller', {
            method: 'PATTERN_QR',
            tileId: tileData.id || 'unknown',
            tileName: tileData.name || 'unknown',
            tileSeller: tileSellerId,
            currentUserSeller: userForVerification?.uid || userForVerification?.user_id || 'NONE',
            blocked: true,
            timestamp: new Date().toISOString()
          });
          
          setScanError(
            `⛔ BLOCKED: Pattern tile "${tileData.name}" belongs to another seller.\n\n` +
            `You can only scan QR codes of your own seller's tiles for wall patterns.`
          );
          setIsProcessing(false);
          return;
        }
        
        const imageUrl = tileData.imageUrl || tileData.image_url;
        
        const qrResult: QRScanResult = {
          tileId: tileData.id,
          tileName: tileData.name,
          imageUrl: imageUrl,
          size: { 
            width: tileData.size_width || 30, 
            height: tileData.size_height || 45 
          }
        };

        onApplyPattern(qrResult, { type: selectedPattern, variant: patternVariant });
        setUploadMode('select');
        setIsAutoShuffling(false);
        onClose();
        
        console.log('✅ Wall pattern applied from QR scan (seller verified):', tileData.name);
      } else {
        setScanError('Tile not found or no image available');
      }
      
    } catch (err) {
      console.error('❌ QR scan error:', err);
      setScanError('Failed to load tile from QR code');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  if (uploadMode === 'qr') {
    return (
      <QRScanner
        currentUser={currentUser}
        onScanSuccess={handleQRScanSuccess}
        onClose={() => {
          setUploadMode('select');
          setScanError('');
        }}
      />
    );
  }

  if (uploadMode === 'manual') {
    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <Hash className="w-6 h-6 text-purple-600" />
              Pattern Tile Code
            </h3>
            <button 
              onClick={() => {
                setUploadMode('select');
                setScanError('');
                setManualCode('');
              }} 
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {scanError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-red-700 text-sm">{scanError}</p>
            </div>
          )}

          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Select Pattern Style
            </label>
            <div className="grid grid-cols-2 gap-2">
              {PATTERN_CONFIGS.map((pattern) => (
                <button
                  key={pattern.type}
                  onClick={() => setSelectedPattern(pattern.type)}
                  className={`p-3 rounded-lg border-2 transition-all text-left ${
                    selectedPattern === pattern.type
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 hover:border-purple-300'
                  }`}
                >
                  <div className="text-2xl mb-1">{pattern.icon}</div>
                  <div className="text-xs font-semibold text-gray-800">{pattern.name}</div>
                  <div className="text-xs text-gray-500">{pattern.coverage}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="mb-4 bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-4 border-2 border-purple-200">
            <p className="text-sm font-semibold text-gray-700 mb-2">
              {PATTERN_CONFIGS.find(p => p.type === selectedPattern)?.name} Preview
            </p>
            <div className="bg-white rounded-lg p-3 mb-3">
              <div className="grid grid-cols-10 gap-0.5 max-w-[200px] mx-auto">
                {Array.from({ length: 50 }).map((_, i) => {
                  const pattern = generatePattern(selectedPattern, 10, 5, patternVariant);
                  const isSelected = pattern.includes(i + 1);
                  return (
                    <div
                      key={i}
                      className={`aspect-square rounded-sm ${
                        isSelected ? 'bg-purple-500' : 'bg-gray-200'
                      }`}
                    />
                  );
                })}
              </div>
            </div>
            <div className="flex items-center justify-between text-xs text-gray-600 mb-2">
              <span>{PATTERN_CONFIGS.find(p => p.type === selectedPattern)?.description}</span>
              <span>{currentPatternTiles} tiles</span>
            </div>
            <button
              onClick={handleShuffleVariant}
              className="w-full bg-white/50 hover:bg-white/80 text-purple-700 px-3 py-2 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1"
            >
              <Shuffle className="w-3 h-3" />
              Shuffle Variant
            </button>
          </div>

          <form onSubmit={handleManualSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enter Tile Code
              </label>
              <input
                type="text"
                value={manualCode}
                onChange={(e) => setManualCode(e.target.value.toUpperCase())}
                placeholder="e.g., MAR60X60WH"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 font-mono text-lg transition-all"
                autoFocus
                disabled={isProcessing}
              />
            </div>

            <button
              type="submit"
              disabled={!manualCode.trim() || isProcessing}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  Applying Pattern...
                </>
              ) : (
                <>
                  <Shuffle className="w-5 h-5" />
                  Apply Pattern
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (uploadMode === 'upload') {
    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <Upload className="w-6 h-6 text-blue-600" />
              Upload Pattern Tile
            </h3>
            <button 
              onClick={() => {
                setUploadMode('select');
                setScanError('');
              }} 
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {scanError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-red-700 text-sm">{scanError}</p>
            </div>
          )}

          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Select Pattern Style
            </label>
            <div className="grid grid-cols-2 gap-2">
              {PATTERN_CONFIGS.map((pattern) => (
                <button
                  key={pattern.type}
                  onClick={() => setSelectedPattern(pattern.type)}
                  className={`p-3 rounded-lg border-2 transition-all text-left ${
                    selectedPattern === pattern.type
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <div className="text-2xl mb-1">{pattern.icon}</div>
                  <div className="text-xs font-semibold text-gray-800">{pattern.name}</div>
                  <div className="text-xs text-gray-500">{pattern.coverage}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="mb-4 bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-4 border-2 border-purple-200">
            <p className="text-sm font-semibold text-gray-700 mb-2">
              {PATTERN_CONFIGS.find(p => p.type === selectedPattern)?.name}
            </p>
            <div className="bg-white rounded-lg p-3 mb-2">
              <div className="grid grid-cols-10 gap-0.5 max-w-[200px] mx-auto">
                {Array.from({ length: 50 }).map((_, i) => {
                  const pattern = generatePattern(selectedPattern, 10, 5, patternVariant);
                  const isSelected = pattern.includes(i + 1);
                  return (
                    <div
                      key={i}
                      className={`aspect-square rounded-sm ${
                        isSelected ? 'bg-purple-500' : 'bg-gray-200'
                      }`}
                    />
                  );
                })}
              </div>
            </div>
            <div className="flex items-center justify-between text-xs text-gray-600 mb-2">
              <span>{PATTERN_CONFIGS.find(p => p.type === selectedPattern)?.coverage}</span>
              <span>{currentPatternTiles} tiles</span>
            </div>
            <button
              onClick={handleShuffleVariant}
              className="w-full bg-white/50 hover:bg-white/80 text-purple-700 px-3 py-2 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1"
            >
              <Shuffle className="w-3 h-3" />
              Shuffle Variant
            </button>
          </div>

          <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-purple-400 transition-colors">
            <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-purple-500 to-blue-600 rounded-2xl flex items-center justify-center">
              <Upload className="w-10 h-10 text-white" />
            </div>
            
            <p className="text-gray-700 font-medium mb-2">
              Upload tile image for pattern
            </p>
            <p className="text-gray-500 text-sm mb-4">
              JPG, PNG, or WebP (Max 10MB)
            </p>
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
            
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isProcessing}
              className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mx-auto"
            >
              {isProcessing ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <ImageIcon className="w-5 h-5" />
                  Choose Image
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto animate-slideUp">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <Shuffle className="w-6 h-6 text-purple-600" />
            Choose Pattern & Tile Source
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <div className="mb-6 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl p-4 border-2 border-orange-200">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                <Shuffle className="w-4 h-4 text-orange-600" />
                Auto Shuffle Patterns
              </p>
              <p className="text-xs text-gray-600 mt-1">
                Automatically cycle through all pattern types
              </p>
            </div>
            {isAutoShuffling && (
              <div className="flex items-center gap-2 text-xs font-medium text-orange-600">
                <div className="w-2 h-2 bg-orange-600 rounded-full animate-pulse"></div>
                Shuffling...
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleToggleAutoShuffle}
              className={`flex-1 px-4 py-2.5 rounded-lg font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
                isAutoShuffling
                  ? 'bg-red-600 hover:bg-red-700 text-white shadow-lg'
                  : 'bg-gradient-to-r from-orange-600 to-amber-600 hover:shadow-lg text-white'
              }`}
            >
              {isAutoShuffling ? (
                <>
                  <X className="w-4 h-4" />
                  Stop Auto Shuffle
                </>
              ) : (
                <>
                  <Shuffle className="w-4 h-4" />
                  Start Auto Shuffle
                </>
              )}
            </button>

            <button
              onClick={handleShufflePattern}
              disabled={isAutoShuffling}
              className="px-4 py-2.5 bg-white hover:bg-gray-50 border-2 border-orange-300 text-orange-700 rounded-lg font-semibold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              title="Shuffle once"
            >
              <Shuffle className="w-4 h-4" />
              Once
            </button>
          </div>

          {isAutoShuffling && (
            <div className="mt-3 pt-3 border-t border-orange-200">
              <label className="block text-xs font-medium text-gray-700 mb-2">
                Shuffle Speed: {shuffleSpeed}ms
              </label>
              <input
                type="range"
                min="500"
                max="3000"
                step="100"
                value={shuffleSpeed}
                onChange={(e) => setShuffleSpeed(Number(e.target.value))}
                className="w-full h-2 bg-orange-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Fast (0.5s)</span>
                <span>Slow (3s)</span>
              </div>
            </div>
          )}
        </div>

        <div className="mb-6">
          <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center justify-between">
            <span>Step 1: Select Pattern Style</span>
            {!isAutoShuffling && (
              <span className="text-xs text-gray-500">
                Current: {PATTERN_CONFIGS.find(p => p.type === selectedPattern)?.name}
              </span>
            )}
          </h4>
          <div className="grid grid-cols-4 gap-3">
            {PATTERN_CONFIGS.map((pattern) => (
              <button
                key={pattern.type}
                onClick={() => {
                  setSelectedPattern(pattern.type);
                  setIsAutoShuffling(false);
                }}
                disabled={isAutoShuffling}
                className={`p-4 rounded-xl border-2 transition-all text-center ${
                  selectedPattern === pattern.type
                    ? 'border-purple-500 bg-purple-50 shadow-md scale-105'
                    : 'border-gray-200 hover:border-purple-300 hover:shadow-sm'
                } ${isAutoShuffling ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <div className="text-3xl mb-2">{pattern.icon}</div>
                <div className="text-xs font-semibold text-gray-800 mb-1">{pattern.name}</div>
                <div className="text-xs text-gray-500">{pattern.coverage}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="mb-6 bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-4 border-2 border-purple-200">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold text-gray-700">
              {PATTERN_CONFIGS.find(p => p.type === selectedPattern)?.name} Preview
            </p>
            <div className="flex gap-2">
              {!isAutoShuffling && (
                <button
                  onClick={handleShuffleVariant}
                  className="px-3 py-1.5 bg-white/70 hover:bg-white text-purple-700 rounded-lg text-xs font-semibold transition-all flex items-center gap-1"
                >
                  <Shuffle className="w-3 h-3" />
                  Variant
                </button>
              )}
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4 mb-3">
            <div className="grid grid-cols-12 gap-0.5 max-w-[300px] mx-auto">
              {Array.from({ length: 60 }).map((_, i) => {
                const pattern = generatePattern(selectedPattern, 12, 5, patternVariant);
                const isSelected = pattern.includes(i + 1);
                return (
                  <div
                    key={i}
                    className={`aspect-square rounded-sm transition-all duration-300 ${
                      isSelected ? 'bg-purple-500 scale-110' : 'bg-gray-200'
                    }`}
                  />
                );
              })}
            </div>
          </div>
          
          <div className="text-center">
            <p className="text-xs text-gray-600">
              <strong>{currentPatternTiles} tiles</strong> will be applied
              {roomType === 'kitchen' ? ' (back wall only)' : ' (all 4 walls)'}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Variant #{patternVariant + 1}/10 • Height: {wallTileHeight}ft
            </p>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-3">
            Step 2: Choose Tile Source
          </h4>
          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={() => setUploadMode('upload')}
              className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 hover:from-blue-100 hover:to-cyan-100 rounded-xl border-2 border-blue-200 hover:border-blue-400 transition-all text-center group"
            >
              <div className="w-12 h-12 mx-auto mb-2 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                <Upload className="w-6 h-6 text-white" />
              </div>
              <h5 className="font-semibold text-gray-800 text-sm mb-1">Upload Image</h5>
              <p className="text-xs text-gray-500">From device</p>
            </button>

            <button
              onClick={() => setUploadMode('qr')}
              className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 rounded-xl border-2 border-purple-200 hover:border-purple-400 transition-all text-center group"
            >
              <div className="w-12 h-12 mx-auto mb-2 bg-gradient-to-br from-purple-600 to-purple-700 rounded-lg flex items-center justify-center">
                <QrCode className="w-6 h-6 text-white" />
              </div>
              <h5 className="font-semibold text-gray-800 text-sm mb-1">Scan QR</h5>
              <p className="text-xs text-gray-500">Camera/Upload</p>
            </button>

            <button
              onClick={() => setUploadMode('manual')}
              className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 rounded-xl border-2 border-green-200 hover:border-green-400 transition-all text-center group"
            >
              <div className="w-12 h-12 mx-auto mb-2 bg-gradient-to-br from-green-600 to-green-700 rounded-lg flex items-center justify-center">
                <Hash className="w-6 h-6 text-white" />
              </div>
              <h5 className="font-semibold text-gray-800 text-sm mb-1">Tile Code</h5>
              <p className="text-xs text-gray-500">Manual entry</p>
            </button>
          </div>
        </div>

        <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-blue-800">
          <p>
            <strong>ℹ️ Current:</strong> {PATTERN_CONFIGS.find(p => p.type === selectedPattern)?.description} - {currentPatternTiles} tiles @ {wallTileHeight}ft height
            {isAutoShuffling && <span className="ml-2 text-orange-600 font-semibold">• Auto-shuffling active</span>}
          </p>
        </div>
      </div>
    </div>
  );
};

const TileUploadOptionsModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onTileSelected: (tileData: TileUploadData) => void;
   currentUser?: any;
}> = ({ isOpen, onClose, onTileSelected ,currentUser}) => {
  
  const [mode, setMode] = useState<UploadMode>('select');
  const [manualCode, setManualCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(/mobile|android|iphone|ipad/i.test(navigator.userAgent));
  }, []);

  if (!isOpen) return null;


if (mode === 'qr') {
  return (
    <QRScanner
      currentUser={currentUser}
      onScanSuccess={async (qrData) => {
        console.log('🎯 QR Scanned for wall tile:', qrData);
        
        try {
          setIsLoading(true);
          setError(null);
          
          let tileData: any = null;
          
          if (qrData.tileId) {
            const tileId = qrData.tileId.trim();
            tileData = await getTileById(tileId);
            
            if (!tileData) {
              const result = await getTileByCode(tileId);
              if (result.success && result.tile) {
                tileData = result.tile;
              }
            }
          }
          
          if (tileData && (tileData.imageUrl || tileData.image_url)) {
            // ✅ FIXED: Better user fallback
            const userForVerification = currentUser || (auth.currentUser ? {
              uid: auth.currentUser.uid,
              user_id: auth.currentUser.uid,  // ✅ ADD THIS
              email: auth.currentUser.email,
              role: 'worker'
            } : null);
            
            // 🔒 PRODUCTION SECURITY: Verify seller ownership
            if (!verifyTileSeller(tileData, userForVerification)) {
              const tileSellerId = (tileData as any)?.seller_id || 
                                   (tileData as any)?.sellerId || 
                                   'unknown';
              
              console.error('❌ BLOCKED: Wall tile QR scan - unauthorized seller', {
                method: 'QR_SCAN',
                tileId: tileData.id || 'unknown',
                tileName: tileData.name || 'unknown',
                tileSeller: tileSellerId,
                workerSeller: userForVerification?.uid || userForVerification?.user_id || 'NONE',
                blocked: true,
                timestamp: new Date().toISOString()
              });
              
              setError(
                `⛔ BLOCKED: This tile belongs to another seller.\n\n` +
                `You can only scan QR codes of your own seller's tiles for walls.`
              );
              setIsLoading(false);
              return;
            }
            
            // ✅ Seller verified - proceed
            const imageUrl = tileData.imageUrl || tileData.image_url;
            
            onTileSelected({
              imageUrl: imageUrl,
              tileId: tileData.id,
              tileName: tileData.name,
              size: { 
                width: tileData.size_width || 30, 
                height: tileData.size_height || 45 
              }
            });
            
            setMode('select');
            onClose();
            
            console.log('✅ Wall tile applied from QR scan (seller verified):', tileData.name);
          } else {
            setError('Tile not found or no image available');
          }
          
        } catch (err) {
          console.error('❌ QR scan error:', err);
          setError('Failed to load tile from QR code');
        } finally {
          setIsLoading(false);
        }
      }}
      onClose={() => {
        setMode('select');
        setError(null);
      }}
    />
  );
}


// ═══════════════════════════════════════════════════════════
if (mode === 'manual') {
 
const handleManualSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  if (!manualCode.trim()) {
    setError('Please enter a tile code');
    return;
  }

  try {
    setIsLoading(true);
    setError(null);
    
    console.log('🔍 Searching wall tile by code:', manualCode.trim());
    
    const result = await getTileByCode(manualCode.trim().toUpperCase());
    
    if (result.success && result.tile) {
      const tileData = result.tile;
      
      // ✅ FIXED: Better user fallback
      const userForVerification = currentUser || (auth.currentUser ? {
        uid: auth.currentUser.uid,
        user_id: auth.currentUser.uid,  // ✅ ADD THIS
        email: auth.currentUser.email,
        role: 'worker'
      } : null);
      
      // 🔒 PRODUCTION SECURITY: Verify seller ownership
      if (!verifyTileSeller(tileData, userForVerification)) {
        const tileSellerId = (tileData as any)?.seller_id || 
                             (tileData as any)?.sellerId || 
                             'unknown';
        
        console.error('❌ BLOCKED: Wall tile manual code - unauthorized seller', {
          method: 'MANUAL_CODE',
          inputCode: manualCode.trim().toUpperCase(),
          tileId: tileData.id || 'unknown',
          tileName: tileData.name || 'unknown',
          tileSeller: tileSellerId,
          workerSeller: userForVerification?.uid || userForVerification?.user_id || 'NONE',
          blocked: true,
          timestamp: new Date().toISOString()
        });
        
        setError(
          `⛔ BLOCKED: Tile "${tileData.name}" belongs to another seller.\n\n` +
          `Code: ${manualCode.trim().toUpperCase()}\n\n` +
          `You can only use tile codes from your own seller's inventory.`
        );
        setIsLoading(false);
        return;
      }
      
      // ✅ Seller verified - proceed
      const imageUrl = tileData.imageUrl || tileData.image_url;
      
      if (imageUrl) {
        onTileSelected({
          imageUrl: imageUrl,
          tileId: tileData.id,
          tileName: tileData.name,
          size: { 
            width: tileData.size_width || 30, 
            height: tileData.size_height || 45 
          }
        });
        
        setMode('select');
        setManualCode('');
        onClose();
        
        console.log('✅ Wall tile applied from manual code (seller verified):', tileData.name);
      } else {
        setError('Tile found but no image available');
      }
    } else {
      setError(result.error || 'Tile not found. Please check the code.');
    }
    
  } catch (err) {
    console.error('❌ Manual search error:', err);
    setError('Failed to search tile. Please try again.');
  } finally {
    setIsLoading(false);
  }
};





  // Continue with manual mode UI rendering...
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <Hash className="w-6 h-6 text-purple-600" />
            Enter Tile Code
          </h3>
          <button 
            onClick={() => {
              setMode('select');
              setError(null);
              setManualCode('');
            }} 
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-red-700 text-sm whitespace-pre-line">{error}</p>
          </div>
        )}

        <form onSubmit={handleManualSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tile Code / SKU / Product ID
            </label>
            <input
              type="text"
              value={manualCode}
              onChange={(e) => setManualCode(e.target.value.toUpperCase())}
              placeholder="e.g., MAR60X60WH, TILE-001"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 font-mono text-lg transition-all"
              autoFocus
              disabled={isLoading}
              autoComplete="off"
              autoCapitalize="characters"
            />
            <p className="mt-1 text-xs text-gray-500">
              Enter the unique code printed on the tile or box
            </p>
          </div>

          <button
            type="submit"
            disabled={!manualCode.trim() || isLoading}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                Searching...
              </>
            ) : (
              <>
                <Hash className="w-5 h-5" />
                Search Tile
              </>
            )}
          </button>
        </form>

        <div className="mt-4 bg-gray-50 rounded-lg p-3 text-xs text-gray-600">
          <p className="font-semibold mb-1">💡 Where to find tile code?</p>
          <ul className="space-y-0.5 ml-4 list-disc">
            <li>Check the label on the tile box</li>
            <li>Look for code near the QR sticker</li>
            <li>Ask showroom staff for the code</li>
            <li>Usually format: ABC123 or TILE-001</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

  if (mode === 'upload') {
    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file');
        return;
      }

      if (file.size > 10 * 1024 * 1024) {
        setError('Image size must be less than 10MB');
        return;
      }

      const imageUrl = URL.createObjectURL(file);
      
      onTileSelected({
        imageUrl: imageUrl,
        tileId: 'CUSTOM_' + Date.now(),
        tileName: file.name.split('.')[0],
        size: { width: 30, height: 45 }
      });
      
      setMode('select');
      onClose();
      
      console.log('✅ Custom image uploaded:', file.name);
    };

    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <Upload className="w-6 h-6 text-blue-600" />
              Upload Tile Image
            </h3>
            <button 
              onClick={() => {
                setMode('select');
                setError(null);
              }} 
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-400 transition-colors">
            <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
              <Upload className="w-10 h-10 text-white" />
            </div>
            
            <p className="text-gray-700 font-medium mb-2">
              {isMobile ? 'Tap to upload tile image' : 'Click to upload tile image'}
            </p>
            <p className="text-gray-500 text-sm mb-4">
              JPG, PNG, or WebP (Max 10MB)
            </p>
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
            
            <button
              onClick={() => fileInputRef.current?.click()}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2 mx-auto"
            >
              <ImageIcon className="w-5 h-5" />
              Choose Image
            </button>
          </div>

          <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-blue-800">
            <p><strong>💡 Tip:</strong> Use high-quality images for best 3D visualization results.</p>
          </div>
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════
  // DEFAULT: OPTION SELECTOR (3 Cards)
  // ═══════════════════════════════════════════════════════════
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 animate-slideUp">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-800">Choose Tile Source</h3>
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <p className="text-sm text-gray-600 mb-4">
          Select how you want to add tiles to your selection
        </p>

        <div className="space-y-3">
          {/* Option 1: Upload Image */}
          <button
            onClick={() => {
              setMode('upload');
              setError(null);
            }}
            className="w-full p-4 bg-gradient-to-r from-blue-50 to-cyan-50 hover:from-blue-100 hover:to-cyan-100 rounded-xl border-2 border-blue-200 hover:border-blue-400 transition-all text-left group"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center flex-shrink-0">
                <Upload className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                  📤 Upload Image
                </h4>
                <p className="text-xs text-gray-500">Choose custom tile image from device</p>
              </div>
              <div className="text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity text-xl">
                →
              </div>
            </div>
          </button>

          {/* Option 2: Scan QR Code */}
          <button
            onClick={() => {
              setMode('qr');
              setError(null);
            }}
            className="w-full p-4 bg-gradient-to-r from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 rounded-xl border-2 border-purple-200 hover:border-purple-400 transition-all text-left group"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-purple-700 rounded-lg flex items-center justify-center flex-shrink-0">
                <QrCode className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-gray-800 group-hover:text-purple-600 transition-colors">
                  🔲 Scan QR Code
                </h4>
                <p className="text-xs text-gray-500">Use camera or upload QR image</p>
              </div>
              <div className="text-purple-600 opacity-0 group-hover:opacity-100 transition-opacity text-xl">
                →
              </div>
            </div>
          </button>

          {/* Option 3: Enter Tile Code */}
          <button
            onClick={() => {
              setMode('manual');
              setError(null);
            }}
            className="w-full p-4 bg-gradient-to-r from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 rounded-xl border-2 border-green-200 hover:border-green-400 transition-all text-left group"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-green-700 rounded-lg flex items-center justify-center flex-shrink-0">
                <Hash className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-gray-800 group-hover:text-green-600 transition-colors">
                  🔢 Enter Tile Code
                </h4>
                <p className="text-xs text-gray-500">Manual SKU/product code entry</p>
              </div>
              <div className="text-green-600 opacity-0 group-hover:opacity-100 transition-opacity text-xl">
                →
              </div>
            </div>
          </button>
        </div>

        <div className="mt-4 bg-gray-50 rounded-lg p-3 text-xs text-gray-600">
          <p className="font-semibold mb-1">ℹ️ Quick Guide:</p>
          <ul className="space-y-0.5 ml-4 list-disc">
            <li><strong>Upload:</strong> For custom or downloaded tile images</li>
            <li><strong>QR Scan:</strong> For tiles with QR codes (fastest)</li>
            <li><strong>Tile Code:</strong> When you know the product code/SKU</li>
          </ul>
        </div>
      </div>
    </div>
  );
};


const CameraController: React.FC<{
  preset: CameraPreset | null;
  onTransitionComplete?: () => void;
  roomType: 'drawing' | 'kitchen' | 'bathroom';
  roomDimensions?: { width: number; depth: number; height: number };  // ✅ ADD THIS
}> = ({ preset, onTransitionComplete, roomType, roomDimensions }) => {  // ✅ ADD roomDimensions
  const { camera } = useThree();
  const controlsRef = useRef<any>();

  // ✅ Use custom dimensions if provided, otherwise use default
  const roomConfig = roomDimensions || ROOM_CONFIGS[roomType];
  
  const bounds = useMemo(() => {
    const padding = 0.3;
    return {
      minX: -roomConfig.width / 2 + padding,
      maxX: roomConfig.width / 2 - padding,
      minY: 0.5,
      maxY: roomConfig.height - 0.3,
      minZ: -roomConfig.depth / 2 + padding,
      maxZ: roomConfig.depth / 2 - padding,
    };
  }, [roomConfig]);  // ✅ Use roomConfig instead of roomType

  useEffect(() => {
    if (!preset || !controlsRef.current) return;

    camera.position.set(...preset.position);
    controlsRef.current.target.set(...preset.target);
    camera.fov = preset.fov;
    camera.updateProjectionMatrix();
    
    onTransitionComplete?.();
  }, [preset, camera, onTransitionComplete]);

  useEffect(() => {
    if (!controlsRef.current) return;

    const handleChange = () => {
      camera.position.x = Math.max(bounds.minX, Math.min(bounds.maxX, camera.position.x));
      camera.position.y = Math.max(bounds.minY, Math.min(bounds.maxY, camera.position.y));
      camera.position.z = Math.max(bounds.minZ, Math.min(bounds.maxZ, camera.position.z));

      const target = controlsRef.current.target;
      target.x = Math.max(bounds.minX, Math.min(bounds.maxX, target.x));
      target.y = Math.max(bounds.minY, Math.min(bounds.maxY, target.y));
      target.z = Math.max(bounds.minZ, Math.min(bounds.maxZ, target.z));
    };

    controlsRef.current.addEventListener('change', handleChange);

    return () => {
      controlsRef.current?.removeEventListener('change', handleChange);
    };
  }, [camera, bounds]);

  const minDistance = Math.min(roomConfig.width, roomConfig.depth) * 0.15;
  const maxDistance = Math.max(roomConfig.width, roomConfig.depth) * 0.9;

  return (
    <OrbitControls
      ref={controlsRef}
      enablePan={true}
      enableZoom={true}
      enableRotate={true}
      autoRotate={false}
      maxPolarAngle={Math.PI * 0.85}
      minPolarAngle={Math.PI * 0.15}
      minDistance={minDistance}
      maxDistance={maxDistance}
      target={[0, roomConfig.height / 2, 0]}
      enableDamping={true}
      dampingFactor={0.05}
    />
  );
};

const SceneLoader: React.FC = () => (
  <mesh>
    <boxGeometry args={[1, 1, 1]} />
    <meshStandardMaterial color="#3b82f6" />
  </mesh>
);

export const Enhanced3DViewer: React.FC<Enhanced3DViewerProps> = ({
  roomType,
  floorTile,
  wallTile,
  activeSurface,
   currentUser, 
   wallTileHeight = 11,
   highlightTileBorders = false,
   onHighlighterUpdate,
   calculationDimensions
}) => {
  // ═══════════════════════════════════════════════════════════
  // STATE MANAGEMENT (Same as before)
  // ═══════════════════════════════════════════════════════════
  // ✅ ADD THIS STATE (Component ke andar, other states ke saath)
const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [selectedPreset, setSelectedPreset] = useState<CameraPreset | null>(null);
  const [quality, setQuality] = useState<QualityLevel>('high');
  const [showSettings, setShowSettings] = useState(false);
   const [allCustomTileIndices, setAllCustomTileIndices] = useState<{
    back: number[];
    front: number[];
    left: number[];
    right: number[];
  }>({
    back: [],
    front: [],
    left: [],
    right: []
  });
  
  const [showFloorUploadModal, setShowFloorUploadModal] = useState(false);
  const [customFloorTexture, setCustomFloorTexture] = useState<string | undefined>(floorTile?.texture);
  const [customFloorSize, setCustomFloorSize] = useState(floorTile?.size || { width: 60, height: 60 });
  
  const [showWallSelector, setShowWallSelector] = useState(false);
  const [isGridMode, setIsGridMode] = useState(false);
  const [activeWall, setActiveWall] = useState<WallType | null>(null);
  const [selectedTiles, setSelectedTiles] = useState<number[]>([]);
  const [customTiles, setCustomTiles] = useState<WallCustomTiles>({
    back: new Map(),
    front: new Map(),
    left: new Map(),
    right: new Map()
  });
  
  const [showTileUploadOptions, setShowTileUploadOptions] = useState(false);
  const [showRandomPattern, setShowRandomPattern] = useState(false);
  const [patternOffset, setPatternOffset] = useState(0);
  const [currentPatternTexture, setCurrentPatternTexture] = useState<THREE.Texture | null>(null);
  const [isShuffling, setIsShuffling] = useState(false);
  const [currentPatternType, setCurrentPatternType] = useState<PatternType>('vertical');
  const [isPatternShuffling, setIsPatternShuffling] = useState(false);
const [lastAppliedTexture, setLastAppliedTexture] = useState<THREE.Texture | null>(null);

// ✅ NEW: Notification states
const [success, setSuccess] = useState<string | null>(null);
const [error, setError] = useState<string | null>(null);

// ✅ ADD THIS BLOCK HERE (after states, before hooks)
const customDimensions = useMemo(() => getRoomDimensions(roomType), [roomType]);

  const scaledRoomConfig = useMemo(() => {
    const baseConfig = ROOM_CONFIGS[roomType];
    
    if (!customDimensions) return baseConfig;
    
    const widthInUnits = convertFeetToUnits(customDimensions.width);
    const depthInUnits = convertFeetToUnits(customDimensions.depth);
    const heightInUnits = convertFeetToUnits(customDimensions.height);
    
    return {
      width: widthInUnits,
      depth: depthInUnits,
      height: heightInUnits
    };
  }, [roomType, customDimensions]);

  const furnitureScale = useMemo(() => {
    const baseConfig = ROOM_CONFIGS[roomType];
    const scaled = scaledRoomConfig;
    
    return {
      x: scaled.width / baseConfig.width,
      y: scaled.height / baseConfig.height,
      z: scaled.depth / baseConfig.depth
    };
  }, [roomType, scaledRoomConfig]);
  // ═══════════════════════════════════════════════════════════
  // HOOKS (Same as before)
  // ═══════════════════════════════════════════════════════════
  
  const autoQuality = useDeviceQuality();

  useEffect(() => {
    setQuality(autoQuality);
  }, [autoQuality]);

  const floorTexture = useHighQualityTexture(
    floorTile?.texture,
    floorTile?.size.width || 60,
    floorTile?.size.height || 60
  );

  const wallTexture = useHighQualityTexture(
    wallTile?.texture,
    wallTile?.size.width || 30,
    wallTile?.size.height || 45
  );

  const customFloorTextureObj = useHighQualityTexture(
    customFloorTexture,
    customFloorSize.width,
    customFloorSize.height
  );

  useEffect(() => {
    return () => {
      if (currentPatternTexture) currentPatternTexture.dispose();
      if (lastAppliedTexture) lastAppliedTexture.dispose();
      Object.values(customTiles).forEach(wallMap => {
        wallMap.forEach(texture => texture.dispose());
      });
    };
  }, [currentPatternTexture, customTiles, lastAppliedTexture]);
// ✅ NEW: Auto-dismiss notifications
useEffect(() => {
  if (success || error) {
    const timer = setTimeout(() => {
      setSuccess(null);
      setError(null);
    }, 5000);
    return () => clearTimeout(timer);
  }
}, [success, error]);
  // ═══════════════════════════════════════════════════════════
  // HELPER FUNCTIONS (Same as before)
  // ═══════════════════════════════════════════════════════════
  
  const getTotalCustomTiles = useCallback(() => {
    return customTiles.back.size + customTiles.front.size + 
           customTiles.left.size + customTiles.right.size;
  }, [customTiles]);

  // const getWallDimensions = useCallback((wall: WallType) => {
  //   const roomConfig = ROOM_CONFIGS[roomType];
  //   const wallTileSize = { width: 30, height: 45 };
  //   const tileSizeM = { 
  //     width: wallTileSize.width / 100, 
  //     height: wallTileSize.height / 100 
  //   };
    
  //   if (wall === 'back' || wall === 'front') {
  //     return {
  //       cols: Math.ceil(roomConfig.width / tileSizeM.width),
  //       rows: Math.ceil(roomConfig.height / tileSizeM.height)
  //     };
  //   } else {
  //     return {
  //       cols: Math.ceil(roomConfig.depth / tileSizeM.width),
  //       rows: Math.ceil(roomConfig.height / tileSizeM.height)
  //     };
  //   }
  // }, [roomType]);
// const getWallDimensions = useCallback((wall: WallType, customWallHeight?: number) => {
//   // ✅ CRITICAL: Use CALCULATION dimensions, not visual
//   const calcDims = getCalculationDimensions(roomType);
  
//   // Convert feet to meters
//   const roomConfig = {
//     width: calcDims.width * 0.3048,
//     depth: calcDims.depth * 0.3048,
//     height: calcDims.height * 0.3048
//   };
  
//   const wallTileSize = wallTile?.size || { width: 30, height: 45 };
  
//   // Convert tile size to feet
//   const tileWidthFt = wallTileSize.width * 0.0328084;
//   const tileHeightFt = wallTileSize.height * 0.0328084;
  
//   // Use custom height if provided, otherwise full room height
//   const heightInFeet = customWallHeight || (roomConfig.height / 0.3048);
  
//   // Wall width depends on which wall
//   const wallWidthFeet = (wall === 'back' || wall === 'front') 
//     ? (roomConfig.width / 0.3048) 
//     : (roomConfig.depth / 0.3048);
  
//   const cols = Math.ceil(wallWidthFeet / tileWidthFt);
//   const rows = Math.ceil(heightInFeet / tileHeightFt);
  
//   console.log(`📐 ${wall} wall @ ${customWallHeight || 'full'}ft (CALC dims):`, {
//     calcRoom: `${calcDims.width}×${calcDims.depth}×${calcDims.height}ft`,
//     wallWidth: `${wallWidthFeet.toFixed(2)}ft`,
//     height: `${heightInFeet.toFixed(2)}ft`,
//     tileSize: `${wallTileSize.width}×${wallTileSize.height}cm`,
//     cols,
//     rows,
//     total: cols * rows
//   });
  
//   return { cols, rows };
// }, [roomType, wallTile?.size]);

const getWallDimensions = useCallback((wall: WallType, customWallHeight?: number) => {
  // ✅ CRITICAL FIX: Use prop first, fallback to localStorage
  const calcDims = calculationDimensions || getCalculationDimensions(roomType);
  
  console.log('📐 getWallDimensions called:', {
    wall,
    customWallHeight,
    usingProp: !!calculationDimensions,
    dimensions: calcDims
  });
  
  // Convert feet to meters
  const roomConfig = {
    width: calcDims.width * 0.3048,
    depth: calcDims.depth * 0.3048,
    height: calcDims.height * 0.3048
  };
  
  const wallTileSize = wallTile?.size || { width: 30, height: 45 };
  
  // Convert tile size to feet
  const tileWidthFt = wallTileSize.width * 0.0328084;
  const tileHeightFt = wallTileSize.height * 0.0328084;
  
  // Use custom height if provided, otherwise full room height
  const heightInFeet = customWallHeight || (roomConfig.height / 0.3048);
  
  // Wall width depends on which wall
  const wallWidthFeet = (wall === 'back' || wall === 'front') 
    ? (roomConfig.width / 0.3048) 
    : (roomConfig.depth / 0.3048);
  
  const cols = Math.ceil(wallWidthFeet / tileWidthFt);
  const rows = Math.ceil(heightInFeet / tileHeightFt);
  
  console.log(`📐 ${wall} wall @ ${customWallHeight || 'full'}ft:`, {
    source: calculationDimensions ? 'PROP' : 'localStorage',
    calcRoom: `${calcDims.width}×${calcDims.depth}×${calcDims.height}ft`,
    wallWidth: `${wallWidthFeet.toFixed(2)}ft`,
    height: `${heightInFeet.toFixed(2)}ft`,
    tileSize: `${wallTileSize.width}×${wallTileSize.height}cm`,
    cols,
    rows,
    total: cols * rows
  });
  
  return { cols, rows };
}, [roomType, wallTile?.size, calculationDimensions]); // ✅ CHANGED: Added calculationDimensions dependency

  const getFirstCustomTexture = useCallback((): THREE.Texture | null => {
    const walls: WallType[] = ['back', 'front', 'left', 'right'];
    for (const wall of walls) {
      if (customTiles[wall].size > 0) {
        return Array.from(customTiles[wall].values())[0];
      }
    }
    return lastAppliedTexture;
  }, [customTiles, lastAppliedTexture]);

  const getNextPatternType = useCallback((): PatternType => {
    const patterns: PatternType[] = [
      'vertical', 'horizontal', 'diagonal', 'checkerboard',
      'random', 'border', 'corners', 'cross'
    ];
    const currentIndex = patterns.indexOf(currentPatternType);
    const nextIndex = (currentIndex + 1) % patterns.length;
    return patterns[nextIndex];
  }, [currentPatternType]);

  // ═══════════════════════════════════════════════════════════
  // EVENT HANDLERS
  // ═══════════════════════════════════════════════════════════
  
  const handleReset = useCallback(() => {
    setSelectedPreset(null);
  }, []);

  const handleTransitionComplete = useCallback(() => {
    setSelectedPreset(null);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleToggleGridMode = () => {
    setShowWallSelector(true);
  };

  const handleSelectWall = (wall: WallType) => {
    setActiveWall(wall);
    setIsGridMode(true);
    setSelectedTiles([]);
    setShowWallSelector(false);
  };

  const handleTileClick = (index: number) => {
    setSelectedTiles(prev => {
      if (prev.includes(index)) {
        return prev.filter(i => i !== index);
      } else {
        return [...prev, index];
      }
    });
  };

  const handleClearSelection = () => {
    setSelectedTiles([]);
  };

  // 🆕 MODIFIED: Just open modal, don't check length
  const handleOkClick = () => {
    setShowTileUploadOptions(true);
  };

  const handleCancelGridMode = () => {
    setIsGridMode(false);
    setActiveWall(null);
    setSelectedTiles([]);
  };

  const handleFloorTileSelected = useCallback((tileData: TileUploadData) => {
    console.log('🟫 Floor tile selected:', tileData.tileName);
    setCustomFloorTexture(tileData.imageUrl);
    setCustomFloorSize(tileData.size);
    setShowFloorUploadModal(false);
    console.log('✅ Floor tile successfully updated!');
  }, []);


  //   if (!activeWall) return;

  //   console.log('🎨 Applying tile to wall:', activeWall, 'Tiles:', selectedTiles.length);

  //   const loader = new THREE.TextureLoader();
  //   loader.load(tileData.imageUrl, (texture) => {
  //     texture.colorSpace = THREE.SRGBColorSpace;
  //     texture.wrapS = THREE.RepeatWrapping;
  //     texture.wrapT = THREE.RepeatWrapping;
  //     texture.minFilter = THREE.LinearMipMapLinearFilter;
  //     texture.magFilter = THREE.LinearFilter;
  //     texture.anisotropy = 16;
  //     texture.generateMipmaps = true;
  //     texture.premultiplyAlpha = false;
  //     texture.needsUpdate = true;

  //     setLastAppliedTexture(texture);
  //     setCurrentPatternType('vertical');

  //     setCustomTiles(prev => {
  //       const newCustomTiles = { ...prev };
  //       const wallMap = new Map(prev[activeWall]);
        
  //       selectedTiles.forEach(index => {
  //         wallMap.set(index, texture);
  //       });
        
  //       newCustomTiles[activeWall] = wallMap;
  //       return newCustomTiles;
  //     });

  //     setSelectedTiles([]);
  //     setIsGridMode(false);
  //     setActiveWall(null);
      
  //     console.log('✅ Tile applied successfully:', tileData.tileName);
  //   }, undefined, (error) => {
  //     console.error('❌ Failed to load tile texture:', error);
  //   });
  // };  
   const handleTileSelected = (tileData: TileUploadData) => {
    if (!activeWall) return;

    console.log('🎨 Applying highlighter tile:', activeWall, 'Count:', selectedTiles.length);

    const loader = new THREE.TextureLoader();
    loader.load(tileData.imageUrl, (texture) => {
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      texture.minFilter = THREE.LinearMipMapLinearFilter;
      texture.magFilter = THREE.LinearFilter;
      texture.anisotropy = 16;
      texture.generateMipmaps = true;
      texture.premultiplyAlpha = false;
      texture.needsUpdate = true;

      setLastAppliedTexture(texture);
      setCurrentPatternType('vertical');

      setCustomTiles(prev => {
        const newCustomTiles = { ...prev };
        const wallMap = new Map(prev[activeWall]);
        
        selectedTiles.forEach(index => {
          wallMap.set(index, texture);
        });
        
        newCustomTiles[activeWall] = wallMap;
        return newCustomTiles;
      });

      // ✅ NEW: Update all custom tile indices
      setAllCustomTileIndices(prev => {
        const current = new Set([...prev[activeWall], ...selectedTiles]);
        const updated = {
          ...prev,
          [activeWall]: Array.from(current).sort((a, b) => a - b)
        };
        
        // ✅ CRITICAL: Call parent callback
        if (onHighlighterUpdate) {
          onHighlighterUpdate(activeWall, updated[activeWall]);
          console.log('📤 Sent highlighter update:', activeWall, updated[activeWall].length);
        }
        
        return updated;
      });

      setSelectedTiles([]);
      setIsGridMode(false);
      setActiveWall(null);
      
      setSuccess(`✅ ${selectedTiles.length} highlighter tiles applied!\nCheck calculator for breakdown.`);
      console.log('✅ Highlighter tiles tracked:', selectedTiles.length);
    }, undefined, (error) => {
      console.error('❌ Failed to load tile texture:', error);
    });
  };

  const handleRandomPattern = () => {
    setShowRandomPattern(true);
  };

  
  //   qrData: QRScanResult, 
  //   patternConfig: { type: PatternType; variant: number }
  // ) => {
  //   console.log('🎨 Applying pattern:', patternConfig.type, 'variant:', patternConfig.variant);

  //   const loader = new THREE.TextureLoader();
    
  //   try {
  //     const texture = await new Promise<THREE.Texture>((resolve, reject) => {
  //       loader.load(qrData.imageUrl, (tex) => {
  //         tex.colorSpace = THREE.SRGBColorSpace;
  //         tex.wrapS = THREE.RepeatWrapping;
  //         tex.wrapT = THREE.RepeatWrapping;
  //         tex.minFilter = THREE.LinearMipMapLinearFilter;
  //         tex.magFilter = THREE.LinearFilter;
  //         tex.anisotropy = 16;
  //         tex.needsUpdate = true;
  //         resolve(tex);
  //       }, undefined, reject);
  //     });

  //     setLastAppliedTexture(texture);
  //     setCurrentPatternType(patternConfig.type);

  //     const wallsToApply: WallType[] = roomType === 'kitchen' 
  //       ? ['back'] 
  //       : ['back', 'front', 'left', 'right'];

  //     setCustomTiles(prev => {
  //       const newCustomTiles = { ...prev };
        
  //       wallsToApply.forEach(wall => {
  //         const dims = getWallDimensions(wall);
  //         const pattern = generatePattern(
  //           patternConfig.type, 
  //           dims.cols, 
  //           dims.rows, 
  //           patternConfig.variant
  //         );
  //         const newMap = new Map<number, THREE.Texture>();
          
  //         pattern.forEach(tileIndex => {
  //           newMap.set(tileIndex, texture.clone());
  //         });
          
  //         newCustomTiles[wall] = newMap;
  //       });
        
  //       return newCustomTiles;
  //     });

  //     console.log('✅ Pattern applied:', patternConfig.type, 'on', wallsToApply.join(', '));
  //     setShowRandomPattern(false);
      
  //   } catch (error) {
  //     console.error('❌ Pattern application failed:', error);
  //     alert('Failed to apply pattern. Please try again.');
  //   }
  // }; 
//    const handleApplyRandomPattern = async (
//     qrData: QRScanResult, 
//     patternConfig: { type: PatternType; variant: number }
//   ) => {
//     console.log('🎨 Applying highlighter pattern:', patternConfig.type);

//     const loader = new THREE.TextureLoader();
    
//     try {
//       const texture = await new Promise<THREE.Texture>((resolve, reject) => {
//         loader.load(qrData.imageUrl, (tex) => {
//           tex.colorSpace = THREE.SRGBColorSpace;
//           tex.wrapS = THREE.RepeatWrapping;
//           tex.wrapT = THREE.RepeatWrapping;
//           tex.minFilter = THREE.LinearMipMapLinearFilter;
//           tex.magFilter = THREE.LinearFilter;
//           tex.anisotropy = 16;
//           tex.needsUpdate = true;
//           resolve(tex);
//         }, undefined, reject);
//       });

//       setLastAppliedTexture(texture);
//       setCurrentPatternType(patternConfig.type);

//       const wallsToApply: WallType[] = roomType === 'kitchen' 
//         ? ['back'] 
//         : ['back', 'front', 'left', 'right'];

//       let totalHighlighterTiles = 0;
//       const newIndices: { [key: string]: number[] } = {
//         back: [],
//         front: [],
//         left: [],
//         right: []
//       };

//       setCustomTiles(prev => {
//         const newCustomTiles = { ...prev };
        
//         wallsToApply.forEach(wall => {
//           const dims = getWallDimensions(wall);
//           const pattern = generatePattern(
//             patternConfig.type, 
//             dims.cols, 
//             dims.rows, 
//             patternConfig.variant
//           );
//           const newMap = new Map<number, THREE.Texture>();
          
//           pattern.forEach(tileIndex => {
//             newMap.set(tileIndex, texture.clone());
//           });
          
//           newCustomTiles[wall] = newMap;
//           totalHighlighterTiles += pattern.length;
          
//           // ✅ Store pattern indices
//           newIndices[wall] = pattern;
//         });
        
//         return newCustomTiles;
//       });
//  setAllCustomTileIndices(prev => {
//         const updated = { ...prev };
        
//         wallsToApply.forEach(wall => {
//           updated[wall] = newIndices[wall];
          
//           // ✅ CRITICAL: Call parent callback for each wall
//           if (onHighlighterUpdate) {
//             onHighlighterUpdate(wall, newIndices[wall]);
//             console.log(`📤 Sent highlighter update for ${wall}:`, newIndices[wall].length);
//           }
//         });
        
//         return updated;
//       });

//       console.log('✅ Pattern applied with', totalHighlighterTiles, 'highlighter tiles');
//       setShowRandomPattern(false);
//       setSuccess(`✅ Pattern applied!\n${totalHighlighterTiles} highlighter tiles\nCheck calculator for ${wallTileHeight}ft breakdown.`);
      
//     } catch (error) {
//       console.error('❌ Pattern application failed:', error);
//       alert('Failed to apply pattern. Please try again.');
//     }
//   }; 
// const handleApplyRandomPattern = async (
//   qrData: QRScanResult, 
//   patternConfig: { type: PatternType; variant: number }
// ) => {
//   console.log('🎨 Applying highlighter pattern:', patternConfig.type, 'variant:', patternConfig.variant);

//   const loader = new THREE.TextureLoader();
  
//   try {
//     const texture = await new Promise<THREE.Texture>((resolve, reject) => {
//       loader.load(qrData.imageUrl, (tex) => {
//         tex.colorSpace = THREE.SRGBColorSpace;
//         tex.wrapS = THREE.RepeatWrapping;
//         tex.wrapT = THREE.RepeatWrapping;
//         tex.minFilter = THREE.LinearMipMapLinearFilter;
//         tex.magFilter = THREE.LinearFilter;
//         tex.anisotropy = 16;
//         tex.needsUpdate = true;
//         resolve(tex);
//       }, undefined, reject);
//     });

//     setLastAppliedTexture(texture);
//     setCurrentPatternType(patternConfig.type);

//     const wallsToApply: WallType[] = roomType === 'kitchen' 
//       ? ['back'] 
//       : ['back', 'front', 'left', 'right'];

//     // ✅ CRITICAL FIX: Generate ALL patterns BEFORE state updates
//     let totalHighlighterTiles = 0;
//     const newIndices: { [key: string]: number[] } = {
//       back: [],
//       front: [],
//       left: [],
//       right: []
//     };

//     // ✅ Step 1: Calculate everything FIRST
//     wallsToApply.forEach(wall => {
//       const dims = getWallDimensions(wall);
//       const pattern = generatePattern(
//         patternConfig.type, 
//         dims.cols, 
//         dims.rows, 
//         patternConfig.variant
//       );
      
//       newIndices[wall] = pattern;
//       totalHighlighterTiles += pattern.length;
      
//       console.log(`🎨 ${wall} wall: ${pattern.length} tiles (${dims.cols}×${dims.rows})`);
//     });

//     console.log('📊 Total highlighter tiles calculated:', totalHighlighterTiles);

//     // ✅ Step 2: Apply to customTiles state
//     setCustomTiles(prev => {
//       const newCustomTiles = { ...prev };
      
//       wallsToApply.forEach(wall => {
//         const pattern = newIndices[wall];
//         const newMap = new Map<number, THREE.Texture>();
        
//         pattern.forEach(tileIndex => {
//           newMap.set(tileIndex, texture.clone());
//         });
        
//         newCustomTiles[wall] = newMap;
//       });
      
//       return newCustomTiles;
//     });

//     // ✅ Step 3: Update tracking indices and notify parent
//     setAllCustomTileIndices(prev => {
//       const updated = { ...prev };
      
//       wallsToApply.forEach(wall => {
//         updated[wall] = newIndices[wall];
        
//         if (onHighlighterUpdate) {
//           onHighlighterUpdate(wall, newIndices[wall]);
//           console.log(`📤 Sent highlighter update for ${wall}:`, newIndices[wall].length, 'tiles');
//         }
//       });
      
//       return updated;
//     });

//     // ✅ Step 4: Success notification
//     setShowRandomPattern(false);
    
//     if (totalHighlighterTiles > 0) {
//       setSuccess(
//         `✅ Pattern Applied Successfully!\n` +
//         `${totalHighlighterTiles} highlighter tiles\n` +
//         `Pattern: ${PATTERN_CONFIGS.find(p => p.type === patternConfig.type)?.name}\n` +
//         `Check calculator for ${wallTileHeight}ft breakdown`
//       );
//     } else {
//       setError(
//         `⚠️ No tiles applied!\n` +
//         `Pattern: ${patternConfig.type}\n` +
//         `Please check room dimensions`
//       );
//     }
    
//     console.log('✅ Pattern application complete:', {
//       pattern: patternConfig.type,
//       variant: patternConfig.variant,
//       totalTiles: totalHighlighterTiles,
//       wallsApplied: wallsToApply.length
//     });
    
//   } catch (error) {
//     console.error('❌ Pattern application failed:', error);
//     setError('Failed to apply pattern. Please try again.');
//   }
// };
 
// const handleApplyRandomPattern = async (
//   qrData: QRScanResult, 
//   patternConfig: { type: PatternType; variant: number }
// ) => {
//   console.log('🎨 Applying highlighter pattern:', patternConfig.type, 'variant:', patternConfig.variant);

//   const loader = new THREE.TextureLoader();
  
//   try {
//     const texture = await new Promise<THREE.Texture>((resolve, reject) => {
//       loader.load(qrData.imageUrl, (tex) => {
//         tex.colorSpace = THREE.SRGBColorSpace;
//         tex.wrapS = THREE.RepeatWrapping;
//         tex.wrapT = THREE.RepeatWrapping;
//         tex.minFilter = THREE.LinearMipMapLinearFilter;
//         tex.magFilter = THREE.LinearFilter;
//         tex.anisotropy = 16;
//         tex.needsUpdate = true;
//         resolve(tex);
//       }, undefined, reject);
//     });

//     setLastAppliedTexture(texture);
//     setCurrentPatternType(patternConfig.type);

//     const wallsToApply: WallType[] = roomType === 'kitchen' 
//       ? ['back'] 
//       : ['back', 'front', 'left', 'right'];

//     // ✅ CRITICAL: Calculate EVERYTHING before state updates
//     let totalHighlighterTiles = 0;
//     const newIndices: { [key: string]: number[] } = {
//       back: [],
//       front: [],
//       left: [],
//       right: []
//     };

//     // ✅ STEP 1: Generate all patterns FIRST
//     // wallsToApply.forEach(wall => {
//     //   const dims = getWallDimensions(wall);
//     //   const pattern = generatePattern(
//     //     patternConfig.type, 
//     //     dims.cols, 
//     //     dims.rows, 
//     //     patternConfig.variant
//     //   );
      
//     //   newIndices[wall] = pattern;
//     //   totalHighlighterTiles += pattern.length;
      
//     //   console.log(`🎨 ${wall}: ${pattern.length} tiles (${dims.cols}×${dims.rows})`);
//     // });  
//     // ✅ STEP 1: Generate all patterns FIRST with EXACT wall height
// wallsToApply.forEach(wall => {
//   const dims = getWallDimensions(wall, wallTileHeight);  // ✅ Pass wall height
//   const pattern = generatePattern(
//     patternConfig.type, 
//     dims.cols, 
//     dims.rows, 
//     patternConfig.variant
//   );
  
//   newIndices[wall] = pattern;
//   totalHighlighterTiles += pattern.length;
  
//   console.log(`🎨 ${wall}: ${pattern.length} tiles (${dims.cols}×${dims.rows}) @ ${wallTileHeight}ft`);
// });

//     console.log('📊 TOTAL highlighter tiles:', totalHighlighterTiles);

//     // ✅ STEP 2: Apply to state
//     setCustomTiles(prev => {
//       const newCustomTiles = { ...prev };
      
//       wallsToApply.forEach(wall => {
//         const pattern = newIndices[wall];
//         const newMap = new Map<number, THREE.Texture>();
        
//         pattern.forEach(tileIndex => {
//           newMap.set(tileIndex, texture.clone());
//         });
        
//         newCustomTiles[wall] = newMap;
//       });
      
//       return newCustomTiles;
//     });

//     // ✅ STEP 3: Update indices + notify parent
//     setAllCustomTileIndices(prev => {
//       const updated = { ...prev };
      
//       wallsToApply.forEach(wall => {
//         updated[wall] = newIndices[wall];
        
//         if (onHighlighterUpdate) {
//           onHighlighterUpdate(wall, newIndices[wall]);
//           console.log(`📤 Update sent for ${wall}:`, newIndices[wall].length);
//         }
//       });
      
//       return updated;
//     });

//     // ✅ STEP 4: Success message
//     setShowRandomPattern(false);
    
//     if (totalHighlighterTiles > 0) {
//       setSuccess(
//         `✅ Pattern Applied!\n` +
//         `${totalHighlighterTiles} highlighter tiles\n` +
//         `Pattern: ${PATTERN_CONFIGS.find(p => p.type === patternConfig.type)?.name}\n` +
//         `Check calculator for ${wallTileHeight}ft breakdown`
//       );
//     } else {
//       setError(`⚠️ No tiles applied!\nCheck room dimensions`);
//     }
    
//   } catch (error) {
//     console.error('❌ Pattern failed:', error);
//     setError('Failed to apply pattern. Please try again.');
//   }
// };  
const handleApplyRandomPattern = async (
  qrData: QRScanResult, 
  patternConfig: { type: PatternType; variant: number }
) => {
  console.log('🎨 Applying highlighter pattern:', patternConfig.type, 'variant:', patternConfig.variant);

  const loader = new THREE.TextureLoader();
  
  try {
    const texture = await new Promise<THREE.Texture>((resolve, reject) => {
      loader.load(qrData.imageUrl, (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.wrapS = THREE.RepeatWrapping;
        tex.wrapT = THREE.RepeatWrapping;
        tex.minFilter = THREE.LinearMipMapLinearFilter;
        tex.magFilter = THREE.LinearFilter;
        tex.anisotropy = 16;
        tex.needsUpdate = true;
        resolve(tex);
      }, undefined, reject);
    });

    setLastAppliedTexture(texture);
    setCurrentPatternType(patternConfig.type);

    const wallsToApply: WallType[] = roomType === 'kitchen' 
      ? ['back'] 
      : ['back', 'front', 'left', 'right'];

    let totalHighlighterTiles = 0;
    const newIndices: { [key: string]: number[] } = {
      back: [],
      front: [],
      left: [],
      right: []
    };

    // ✅ FIX 10: Pass wallTileHeight to getWallDimensions
    wallsToApply.forEach(wall => {
      const dims = getWallDimensions(wall, wallTileHeight);  // ✅ ADDED wallTileHeight
      const pattern = generatePattern(
        patternConfig.type, 
        dims.cols, 
        dims.rows, 
        patternConfig.variant
      );
      
      newIndices[wall] = pattern;
      totalHighlighterTiles += pattern.length;
      
      console.log(`🎨 ${wall}: ${pattern.length} tiles (${dims.cols}×${dims.rows}) @ ${wallTileHeight}ft`);
    });

    console.log('📊 TOTAL highlighter tiles:', totalHighlighterTiles);

    setCustomTiles(prev => {
      const newCustomTiles = { ...prev };
      
      wallsToApply.forEach(wall => {
        const pattern = newIndices[wall];
        const newMap = new Map<number, THREE.Texture>();
        
        pattern.forEach(tileIndex => {
          newMap.set(tileIndex, texture.clone());
        });
        
        newCustomTiles[wall] = newMap;
      });
      
      return newCustomTiles;
    });

    setAllCustomTileIndices(prev => {
      const updated = { ...prev };
      
      wallsToApply.forEach(wall => {
        updated[wall] = newIndices[wall];
        
        if (onHighlighterUpdate) {
          onHighlighterUpdate(wall, newIndices[wall]);
          console.log(`📤 Update sent for ${wall}:`, newIndices[wall].length);
        }
      });
      
      return updated;
    });

    setShowRandomPattern(false);
    
    if (totalHighlighterTiles > 0) {
      setSuccess(
  `✅ Pattern Applied!\n` +
  `${totalHighlighterTiles} highlighter tiles\n` +
  `Pattern: ${PATTERN_CONFIGS.find(p => p.type === patternConfig.type)?.name}\n` +
  `For: ${getCalculationDimensions(roomType).width}×${getCalculationDimensions(roomType).depth} room\n` + // ✅ Added
  `Check calculator for ${wallTileHeight}ft breakdown`
);
    } else {
      setError(`⚠️ No tiles applied!\nCheck room dimensions`);
    }
    
  } catch (error) {
    console.error('❌ Pattern failed:', error);
    setError('Failed to apply pattern. Please try again.');
  }
};




  // ✅ ADD: Effect to sync initial state
  useEffect(() => {
    if (onHighlighterUpdate && allCustomTileIndices) {
      const walls: WallType[] = ['back', 'front', 'left', 'right'];
      walls.forEach(wall => {
        if (allCustomTileIndices[wall].length > 0) {
          onHighlighterUpdate(wall, allCustomTileIndices[wall]);
        }
      });
    }
  }, [roomType]);

 

const handleShuffleExistingPattern = useCallback(() => {
  const totalTiles = getTotalCustomTiles();
  if (totalTiles === 0) {
    console.warn('⚠️ No custom tiles to shuffle');
    return;
  }
  
  setIsPatternShuffling(true);
  
  const existingTexture = getFirstCustomTexture();
  if (!existingTexture) {
    console.error('❌ No texture found to shuffle');
    setIsPatternShuffling(false);
    return;
  }
  
  const nextPattern = getNextPatternType();
  console.log(`🔄 Shuffling: ${currentPatternType} → ${nextPattern}`);
  
  setTimeout(() => {
    const wallsToShuffle: WallType[] = roomType === 'kitchen' 
      ? ['back'] 
      : (['back', 'front', 'left', 'right'] as WallType[]).filter(wall => customTiles[wall].size > 0);
    
    let totalHighlighterTiles = 0;
    const newIndices: { [key: string]: number[] } = {
      back: [],
      front: [],
      left: [],
      right: []
    };
    
    // ✅ FIX 11: Pass wallTileHeight to getWallDimensions
    wallsToShuffle.forEach(wall => {
      const dims = getWallDimensions(wall, wallTileHeight);  // ✅ ADDED wallTileHeight
      const newPatternIndices = generatePattern(
        nextPattern, 
        dims.cols, 
        dims.rows, 
        Math.floor(Math.random() * 3)
      );
      
      newIndices[wall] = newPatternIndices;
      totalHighlighterTiles += newPatternIndices.length;
      
      console.log(`🎨 ${wall}: ${newPatternIndices.length} tiles @ ${wallTileHeight}ft`);
    });
    
    console.log('📊 TOTAL after shuffle:', totalHighlighterTiles);
    
    setCustomTiles(prev => {
      const newCustomTiles = { ...prev };
      
      wallsToShuffle.forEach(wall => {
        const pattern = newIndices[wall];
        const newMap = new Map<number, THREE.Texture>();
        
        pattern.forEach(index => {
          newMap.set(index, existingTexture);
        });
        
        newCustomTiles[wall] = newMap;
      });
      
      return newCustomTiles;
    });
    
    setAllCustomTileIndices(prev => {
      const updated = { ...prev };
      
      wallsToShuffle.forEach(wall => {
        updated[wall] = newIndices[wall];
        
        if (onHighlighterUpdate) {
          onHighlighterUpdate(wall, newIndices[wall]);
          console.log(`📤 Shuffle update for ${wall}:`, newIndices[wall].length);
        }
      });
      
      return updated;
    });
    
    setCurrentPatternType(nextPattern);
    setIsPatternShuffling(false);
    
    setSuccess(
      `🔄 Pattern Shuffled!\n` +
      `${PATTERN_CONFIGS.find(p => p.type === nextPattern)?.name}\n` +
      `${totalHighlighterTiles} highlighter tiles\n` +
      `Check calculator for ${wallTileHeight}ft breakdown`
    );
    
  }, 400);
  
}, [
  customTiles, 
  currentPatternType, 
  roomType, 
  getFirstCustomTexture, 
  getNextPatternType, 
  getWallDimensions,
  getTotalCustomTiles,
  onHighlighterUpdate,
  wallTileHeight  // ✅ FIX 12: Added dependency
]);

  const handleShufflePattern = useCallback(() => {
    if (!currentPatternTexture || isShuffling) return;

    setIsShuffling(true);
    
    setTimeout(() => {
      const newOffset = Math.floor(Math.random() * 3);
      setPatternOffset(newOffset);

      const roomConfig = ROOM_CONFIGS[roomType];
      const wallTileSize = { width: 30, height: 45 };
      const tileSizeM = { 
        width: wallTileSize.width / 100, 
        height: wallTileSize.height / 100 
      };

      const getWallDims = (wall: WallType) => {
        if (wall === 'back' || wall === 'front') {
          return {
            cols: Math.ceil(roomConfig.width / tileSizeM.width),
            rows: Math.ceil(roomConfig.height / tileSizeM.height)
          };
        } else {
          return {
            cols: Math.ceil(roomConfig.depth / tileSizeM.width),
            rows: Math.ceil(roomConfig.height / tileSizeM.height)
          };
        }
      };

      setCustomTiles(prev => {
        const newCustomTiles = { ...prev };

        ['back', 'front', 'left', 'right'].forEach((wallKey) => {
          const wall = wallKey as WallType;
          const dims = getWallDims(wall);
          const patternIndices = generateVerticalStripesPattern(dims.cols, dims.rows, newOffset);
          
          const wallMap = new Map<number, THREE.Texture>();
          patternIndices.forEach(index => {
            wallMap.set(index, currentPatternTexture);
          });
          
          newCustomTiles[wall] = wallMap;
        });

        return newCustomTiles;
      });

      setTimeout(() => {
        setIsShuffling(false);
      }, 500);
    }, 100);
  }, [currentPatternTexture, isShuffling, roomType]);

  // ═══════════════════════════════════════════════════════════
  // RENDER SCENE
  // ═══════════════════════════════════════════════════════════
  
  // const renderScene = () => {
  //   const showWallTiles = activeSurface === 'wall' || activeSurface === 'both';
  //   const showFloorTiles = activeSurface === 'floor' || activeSurface === 'both';
  //   const defaultWallSize = { width: 30, height: 45 };

  //   const activeFloorTexture = showFloorTiles 
  //     ? (customFloorTexture ? customFloorTextureObj : floorTexture) 
  //     : null;

  //   switch (roomType) {
  //     case 'drawing':
  //       return (
  //         <LuxuryDrawingRoomScene 
  //           floorTexture={activeFloorTexture}
  //           floorTileSize={customFloorSize}
  //           quality={quality}
  //         />
  //       );
  //     case 'kitchen':
  //       return (
  //         <BrightHotelKitchenScene
  //           floorTexture={activeFloorTexture}
  //           floorTileSize={customFloorSize}
  //           wallTexture={showWallTiles ? wallTexture : null}
  //           wallTileSize={wallTile?.size || defaultWallSize}
  //           showWallTiles={showWallTiles}
  //           quality={quality}
  //           isGridMode={isGridMode}
  //           activeWall={activeWall}
  //           selectedTiles={selectedTiles}
  //           onTileClick={handleTileClick}
  //           customTiles={customTiles}
  //         />
  //       );
  //     case 'bathroom':
  //       return (
  //         <PremiumBathroomScene
  //           floorTexture={activeFloorTexture}
  //           floorTileSize={customFloorSize}
  //           wallTexture={showWallTiles ? wallTexture : null}
  //           wallTileSize={wallTile?.size || defaultWallSize}
  //           showWallTiles={showWallTiles}
  //           quality={quality}
  //           isGridMode={isGridMode}
  //           activeWall={activeWall}
  //           selectedTiles={selectedTiles}
  //           onTileClick={handleTileClick}
  //           customTiles={customTiles}
  //         />
  //       );
  //   }
  // };

const renderScene = () => {
  const showWallTiles = activeSurface === 'wall' || activeSurface === 'both';
  const showFloorTiles = activeSurface === 'floor' || activeSurface === 'both';
  const defaultWallSize = { width: 30, height: 45 };

  const activeFloorTexture = showFloorTiles 
    ? (customFloorTexture ? customFloorTextureObj : floorTexture) 
    : null;

  switch (roomType) {
    case 'drawing':
      return (
        <LuxuryDrawingRoomScene 
          floorTexture={activeFloorTexture}
          floorTileSize={customFloorSize}
          quality={quality}
          roomDimensions={scaledRoomConfig}
          furnitureScale={furnitureScale}
        />
      );
    case 'kitchen':
      return (
        <BrightHotelKitchenScene
          floorTexture={activeFloorTexture}
          floorTileSize={customFloorSize}
          wallTexture={showWallTiles ? wallTexture : null}
          wallTileSize={wallTile?.size || defaultWallSize}
          showWallTiles={showWallTiles}
          quality={quality}
          isGridMode={isGridMode}
          activeWall={activeWall}
          selectedTiles={selectedTiles}
          onTileClick={handleTileClick}
          customTiles={customTiles}
          roomDimensions={scaledRoomConfig}
          furnitureScale={furnitureScale}
           wallTileHeight={wallTileHeight} 
           highlightTileBorders={highlightTileBorders} 
        />
      );
    case 'bathroom':
      return (
        <PremiumBathroomScene
          floorTexture={activeFloorTexture}
          floorTileSize={customFloorSize}
          wallTexture={showWallTiles ? wallTexture : null}
          wallTileSize={wallTile?.size || defaultWallSize}
          showWallTiles={showWallTiles}
          quality={quality}
          isGridMode={isGridMode}
          activeWall={activeWall}
          selectedTiles={selectedTiles}
          onTileClick={handleTileClick}
          customTiles={customTiles}
          roomDimensions={scaledRoomConfig}
          furnitureScale={furnitureScale}
           wallTileHeight={wallTileHeight} 
           highlightTileBorders={highlightTileBorders} 
        />
      );
  }
};

  // ═══════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════
  
  const presets = CAMERA_PRESETS[roomType] || [];
  const hasFloorTile = !!floorTile?.texture;
  const hasCustomFloor = !!customFloorTexture && customFloorTexture !== floorTile?.texture;
  const hasWallTile = !!wallTile?.texture;
  const totalCustomTiles = getTotalCustomTiles();
  const hasRandomPattern = currentPatternTexture !== null && totalCustomTiles > 0;

  return (
    <div className="relative w-full h-full bg-gradient-to-b from-gray-900 to-black">
      <Canvas
        gl={{ 
          antialias: true,
          toneMapping: THREE.NoToneMapping,
          outputColorSpace: THREE.SRGBColorSpace,
          powerPreference: 'high-performance',
        }}
        camera={{
          position: [0, 1.6, 3],
          fov: 50,
          near: 0.1,
          far: 1000
        }}
      >
        <Suspense fallback={<SceneLoader />}>
          <color attach="background" args={['#e8f4f8']} />
          <MinimalLighting />
          {renderScene()}
          {/* <CameraController 
            preset={selectedPreset} 
            onTransitionComplete={handleTransitionComplete} 
            roomType={roomType} 
             */}

<CameraController 
  preset={selectedPreset} 
  onTransitionComplete={handleTransitionComplete} 
  roomType={roomType}
  roomDimensions={scaledRoomConfig}
/>
          
        </Suspense>
      </Canvas>

      {/* TOP LEFT - ROOM INFO */}
      {showControls && (
        <div className="absolute top-2 left-2 bg-black/80 text-white px-2.5 py-2 rounded-lg backdrop-blur-sm shadow-xl border border-white/10 max-w-[180px]">
          <p className="font-semibold mb-0.5 flex items-center gap-1.5 text-[11px]">
            <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
            {roomType.charAt(0).toUpperCase() + roomType.slice(1)} Room
          </p>
          <p className="text-[9px] opacity-75">
            Quality: <span className="text-blue-400 font-medium capitalize">{quality}</span>
          </p>
          {(floorTile || hasCustomFloor) && (
            <p className="text-[9px] opacity-75 mt-0.5">
              Floor: {customFloorSize.width}×{customFloorSize.height} cm
              {hasCustomFloor && <span className="text-green-400 ml-1">★</span>}
            </p>
          )}
          {wallTile && (
            <p className="text-[9px] opacity-75">
              Wall: {wallTile.size.width}×{wallTile.size.height} cm
            </p>
          )}
        </div>
      )}
{customDimensions && (
<></>
)}
      {/* TOP RIGHT - APPLIED TILES INFO */}
      <div className="">
        {/* <p className="text-[9px] font-medium mb-0.5">Applied:</p>
        <p className="text-[11px] font-bold capitalize">{activeSurface}</p>
         */}
        {(hasFloorTile || hasCustomFloor) && (
          // <p className="text-[9px] opacity-75 mt-0.5 text-green-400 flex items-center gap-1">
          //   ✓ Floor
          //   {hasCustomFloor && (
          //     <span className="text-[7px] bg-green-500/20 px-1 py-0.5 rounded font-semibold">
          //       Custom
          //     </span>
          //   )}
          // </p>
          <></>
        )}
        
        {/* {hasWallTile && (
          <p className="text-[9px] opacity-75 text-blue-400">✓ Wall</p>
        )} */}
        
        {totalCustomTiles > 0 && (
          <>
            <p className="text-[9px] opacity-75 text-purple-400 mt-1">Custom Tiles:</p>
            {customTiles.back.size > 0 && (
              <p className="text-[8px] opacity-75 text-purple-300">• Back: {customTiles.back.size}</p>
            )}
            {customTiles.front.size > 0 && (
              <p className="text-[8px] opacity-75 text-purple-300">• Front: {customTiles.front.size}</p>
            )}
            {customTiles.left.size > 0 && (
              <p className="text-[8px] opacity-75 text-purple-300">• Left: {customTiles.left.size}</p>
            )}
            {customTiles.right.size > 0 && (
              <p className="text-[8px] opacity-75 text-purple-300">• Right: {customTiles.right.size}</p>
            )}
          </>
        )}
      </div>

      {/* CAMERA PRESETS */}
      <div className="absolute top-14 right-2 bg-black/80 text-white p-2 rounded-lg backdrop-blur-sm shadow-xl border border-white/10">
        <p className="text-[9px] font-semibold mb-1.5 flex items-center gap-1">
          <Camera className="w-2.5 h-2.5" />
          Camera
        </p>
        <div className="flex flex-col gap-1">
          {presets.map((preset, index) => (
            <button
              key={index}
              onClick={() => setSelectedPreset(preset)}
              className="px-2 py-1 bg-white/10 hover:bg-white/20 rounded text-[9px] transition-all"
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>

      {/* SETTINGS PANEL */}
     
      {/* 🆕 MODIFIED: SIDE INFO PANEL (Small, Non-Blocking) */}
      {isGridMode && activeWall && (
        <div className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-white/95 backdrop-blur-sm rounded-xl shadow-xl p-3 max-w-[200px] z-30 border-2 border-blue-400">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <Grid3x3 className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-gray-800 truncate">
                {activeWall.charAt(0).toUpperCase() + activeWall.slice(1)} Wall
              </p>
              <p className="text-[10px] text-gray-600">Grid Mode Active</p>
            </div>
          </div>

          <div className="bg-blue-50 rounded-lg p-2 mb-2">
            <p className="text-xs text-blue-800 text-center">
              <strong className="text-2xl font-bold">{selectedTiles.length}</strong>
              <br />
              <span className="text-[10px]">tiles selected</span>
            </p>
          </div>

          <div className="space-y-1.5 text-[10px] text-gray-600">
            <p>• Tap tiles to select</p>
            <p>• Green = selected</p>
            <p>• Use buttons below</p>
          </div>

          <button
            onClick={handleClearSelection}
            disabled={selectedTiles.length === 0}
            className="w-full mt-2 px-2 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded text-[10px] font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Clear All
          </button>
        </div>
      )}
{/* 🆕 BOTTOM LEFT BUTTONS - COMPLETE RESPONSIVE VERSION */}
<div className="absolute bottom-2 left-2 z-10">
  {/* Mobile: Hamburger Menu */}
  <div className="sm:hidden">
    <button
      onClick={() => setShowMobileMenu(!showMobileMenu)}
      className="bg-gradient-to-r from-amber-600 to-orange-600 text-white p-2.5 rounded-lg hover:shadow-lg transition-all backdrop-blur-sm shadow-xl border border-white/10"
      title="Menu"
      aria-label="Toggle menu"
    >
      {showMobileMenu ? (
        <X className="w-4 h-4" />
      ) : (
        <Menu className="w-4 h-4" />
      )}
    </button>

    {/* Mobile Menu Dropdown */}
    {showMobileMenu && !isGridMode && ( // 🔥 Close menu when grid mode active
      <div className="absolute bottom-14 left-0 bg-black/95 backdrop-blur-md rounded-lg p-2 shadow-2xl border border-white/20 min-w-[200px] animate-fadeIn">
        <div className="flex flex-col gap-2">
          {/* 1️⃣ Change Floor Button */}
          <button
            onClick={() => {
              setShowFloorUploadModal(true);
              setShowMobileMenu(false);
            }}
            className="bg-gradient-to-r from-amber-600 to-orange-600 text-white p-2.5 rounded-lg hover:shadow-lg transition-all flex items-center gap-2 w-full"
          >
            <Package className="w-4 h-4" />
            <span className="text-xs font-semibold">Change Floor</span>
          </button>

          {/* 2️⃣ Add Highlighter Button */}
          <button
            onClick={() => {
              handleToggleGridMode();
              setShowMobileMenu(false);
            }}
            className="bg-white/10 text-white hover:bg-white/20 p-2.5 rounded-lg transition-all flex items-center gap-2 w-full"
          >
            <Highlighter className="w-4 h-4" />
            <span className="text-xs font-semibold">Add Highlighter</span>
          </button>

          {/* 3️⃣ Shuffle Pattern Button */}
          {totalCustomTiles > 0 && (
            <button
              onClick={() => {
                handleShuffleExistingPattern();
                setShowMobileMenu(false);
              }}
              disabled={isPatternShuffling}
              className={`${
                isPatternShuffling
                  ? 'bg-indigo-500 cursor-wait'
                  : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:shadow-lg'
              } text-white p-2.5 rounded-lg transition-all flex items-center gap-2 w-full`}
            >
              <Shuffle className={`w-4 h-4 ${isPatternShuffling ? 'animate-spin' : ''}`} />
              <span className="text-xs font-semibold">
                {isPatternShuffling ? 'Shuffling...' : 'Shuffle Pattern'}
              </span>
            </button>
          )}

          {/* 4️⃣ Random Pattern Button */}
          {(roomType === 'bathroom' || roomType === 'kitchen') && (
            <button
              onClick={() => {
                handleRandomPattern();
                setShowMobileMenu(false);
              }}
              className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-2.5 rounded-lg hover:shadow-lg transition-all flex items-center gap-2 w-full"
            >
              <Shuffle className="w-4 h-4" />
              <span className="text-xs font-semibold">Random Pattern</span>
            </button>
          )}

          {/* 5️⃣ Shuffle Variant Button */}
          {roomType === 'bathroom' && hasRandomPattern && (
            <button
              onClick={() => {
                handleShufflePattern();
                setShowMobileMenu(false);
              }}
              disabled={isShuffling}
              className={`${
                isShuffling
                  ? 'bg-orange-500'
                  : 'bg-gradient-to-r from-orange-600 to-amber-600 hover:shadow-lg'
              } text-white p-2.5 rounded-lg transition-all flex items-center gap-2 w-full disabled:opacity-75`}
            >
              <Shuffle className={`w-4 h-4 ${isShuffling ? 'animate-spin' : ''}`} />
              <span className="text-xs font-semibold">
                {isShuffling ? 'Shuffling...' : 'Shuffle Variant'}
              </span>
            </button>
          )}
        </div>
      </div>
    )}
  </div>

  {/* Desktop: Inline Buttons */}
  <div className="hidden sm:flex gap-2 flex-wrap max-w-[600px]">
    {/* 1️⃣ Change Floor Button */}
    <button
      onClick={() => setShowFloorUploadModal(true)}
      className="bg-gradient-to-r from-amber-600 to-orange-600 text-white px-3 py-2 rounded-lg hover:shadow-lg transition-all backdrop-blur-sm shadow-xl border border-white/10 flex items-center gap-2 hover:scale-105"
      title="Change Floor Tile"
      aria-label="Change floor tile"
    >
      <Package className="w-4 h-4" />
      <span className="text-xs font-semibold">Change Floor</span>
    </button>

    {/* 2️⃣ Add Highlighter Button */}
    <button
      onClick={handleToggleGridMode}
      disabled={isGridMode}
      className={`${
        isGridMode
          ? 'bg-green-600 text-white scale-105'
          : 'bg-black/80 text-white hover:bg-black/95 hover:scale-105'
      } px-3 py-2 rounded-lg transition-all backdrop-blur-sm shadow-xl border border-white/10 flex items-center gap-2 disabled:opacity-50`}
      title="Add Highlighter"
      aria-label="Add highlighter"
    >
      <Highlighter className="w-4 h-4" />
      <span className="text-xs font-semibold">
        {isGridMode ? 'Selecting...' : 'Add Highlighter'}
      </span>
    </button>

    {/* 3️⃣ Shuffle Pattern Button */}
    {totalCustomTiles > 0 && !isGridMode && (
      <button
        onClick={handleShuffleExistingPattern}
        disabled={isPatternShuffling}
        className={`${
          isPatternShuffling
            ? 'bg-indigo-500 cursor-wait'
            : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:shadow-lg hover:scale-105'
        } text-white px-3 py-2 rounded-lg transition-all backdrop-blur-sm shadow-xl border border-white/10 flex items-center gap-2`}
        title={`Shuffle Pattern (Current: ${currentPatternType})`}
        aria-label="Shuffle pattern"
      >
        <Shuffle className={`w-4 h-4 ${isPatternShuffling ? 'animate-spin' : ''}`} />
        <span className="text-xs font-semibold">
          {isPatternShuffling ? 'Shuffling...' : 'Shuffle Pattern'}
        </span>
      </button>
    )}

    {/* 4️⃣ Random Pattern Button */}
    {(roomType === 'bathroom' || roomType === 'kitchen') && !isGridMode && (
      <button
        onClick={handleRandomPattern}
        className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-3 py-2 rounded-lg hover:shadow-lg transition-all backdrop-blur-sm shadow-xl border border-white/10 flex items-center gap-2 hover:scale-105"
        title="Random Pattern"
        aria-label="Random pattern"
      >
        <Shuffle className="w-4 h-4" />
        <span className="text-xs font-semibold">Random Pattern</span>
      </button>
    )}

    {/* 5️⃣ Shuffle Variant Button */}
    {roomType === 'bathroom' && hasRandomPattern && !isGridMode && (
      <button
        onClick={handleShufflePattern}
        disabled={isShuffling}
        className={`${
          isShuffling
            ? 'bg-orange-500'
            : 'bg-gradient-to-r from-orange-600 to-amber-600 hover:shadow-lg hover:scale-105'
        } text-white px-3 py-2 rounded-lg transition-all backdrop-blur-sm shadow-xl border border-white/10 flex items-center gap-2 disabled:opacity-75`}
        title="Shuffle Variant"
        aria-label="Shuffle variant"
      >
        <Shuffle className={`w-4 h-4 ${isShuffling ? 'animate-spin' : ''}`} />
        <span className="text-xs font-semibold">
          {isShuffling ? 'Shuffling...' : 'Shuffle Variant'}
        </span>
      </button>
    )}
  </div>

  {/* 6️⃣ & 7️⃣ Grid Mode Actions (Mobile + Desktop - Always Visible) */}
  {isGridMode && (
    <div className="flex gap-2 mt-2 flex-wrap">
      {/* Tiles Selected Button */}
      {selectedTiles.length > 0 && (
        <button
          onClick={handleOkClick}
          className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-3 py-2 sm:px-4 sm:py-2.5 rounded-lg hover:shadow-lg transition-all backdrop-blur-sm shadow-xl border border-white/10 flex items-center gap-2 animate-pulse hover:scale-105"
          title="Upload tiles"
          aria-label={`Upload ${selectedTiles.length} selected tiles`}
        >
          <Check className="w-4 h-4" />
          <span className="text-xs sm:text-sm font-semibold">
            {selectedTiles.length} Selected - Upload
          </span>
        </button>
      )}

      {/* Cancel Grid Mode Button */}
      <button
        onClick={handleCancelGridMode}
        className="bg-gradient-to-r from-red-600 to-rose-600 text-white px-3 py-2 sm:px-4 sm:py-2.5 rounded-lg hover:shadow-lg transition-all backdrop-blur-sm shadow-xl border border-white/10 flex items-center gap-2 hover:scale-105"
        title="Cancel selection"
        aria-label="Cancel grid selection"
      >
        <X className="w-4 h-4" />
        <span className="text-xs sm:text-sm font-semibold">Cancel</span>
      </button>
    </div>
  )}
</div>

{/* BOTTOM RIGHT - UTILITY BUTTONS (8️⃣ 9️⃣ 🔟 1️⃣1️⃣) */}
<div className="absolute bottom-2 right-2 flex gap-1.5 sm:gap-2 z-10">
  {/* 8️⃣ Info Button */}
  <button
    onClick={() => setShowControls(!showControls)}
    className="bg-black/80 text-white p-2 sm:p-2.5 rounded-lg hover:bg-black/95 transition-all backdrop-blur-sm shadow-xl border border-white/10 hover:scale-110 active:scale-95"
    title="Info"
    aria-label="Toggle info"
  >
    <Info className="w-4 h-4" />
  </button>

  {/* 9️⃣ Settings Button */}
  {/* <button
    onClick={() => setShowSettings(!showSettings)}
    className="bg-black/80 text-white p-2 sm:p-2.5 rounded-lg hover:bg-black/95 transition-all backdrop-blur-sm shadow-xl border border-white/10 hover:scale-110 active:scale-95"
    title="Settings"
    aria-label="Toggle settings"
  >
    <Settings className="w-4 h-4" />
  </button> */}

  {/* 🔟 Reset Button */}
  {/* <button
    onClick={handleReset}
    className="bg-black/80 text-white p-2 sm:p-2.5 rounded-lg hover:bg-black/95 transition-all backdrop-blur-sm shadow-xl border border-white/10 hover:scale-110 active:scale-95"
    title="Reset"
    aria-label="Reset"
  >
    <RotateCcw className="w-4 h-4" />
  </button> */}

  {/* 1️⃣1️⃣ Fullscreen Button */}
  <button
    onClick={toggleFullscreen}
    className="bg-black/80 text-white p-2 sm:p-2.5 rounded-lg hover:bg-black/95 transition-all backdrop-blur-sm shadow-xl border border-white/10 hover:scale-110 active:scale-95"
    title="Fullscreen"
    aria-label="Toggle fullscreen"
  >
    {isFullscreen ? (
      <Minimize2 className="w-4 h-4" />
    ) : (
      <Maximize2 className="w-4 h-4" />
    )}
  </button>
</div>
      {/* CURRENT PATTERN INDICATOR */}
      {totalCustomTiles > 0 && !isPatternShuffling && !isGridMode && (
        <div className="absolute bottom-16 left-2 bg-black/90 text-white px-3 py-2 rounded-lg backdrop-blur-sm shadow-xl border border-white/10">
          <p className="text-[9px] font-medium opacity-75 mb-0.5">Active Pattern:</p>
          <p className="text-[11px] font-bold capitalize flex items-center gap-1.5">
            <span className="text-lg">
              {PATTERN_CONFIGS.find(p => p.type === currentPatternType)?.icon}
            </span>
            {PATTERN_CONFIGS.find(p => p.type === currentPatternType)?.name}
          </p>
          <p className="text-[8px] opacity-60 mt-0.5">
            {totalCustomTiles} tiles applied
          </p>
        </div>
      )}

      {/* NO TILES PLACEHOLDER */}
      {(!hasFloorTile && !hasCustomFloor && !hasWallTile && totalCustomTiles === 0) && !isGridMode && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm pointer-events-none">
          <div className="bg-white rounded-xl p-5 text-center shadow-2xl max-w-[280px] mx-4">
            <Package className="w-10 h-10 mx-auto mb-2.5 text-blue-600" />
            <p className="text-gray-800 font-semibold text-sm mb-1">No Tiles Applied</p>
            <p className="text-gray-500 text-xs">Upload tiles to visualize</p>
          </div>
        </div>
      )}

      {/* LOADING INDICATORS */}
      {isPatternShuffling && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-2xl p-5 flex items-center gap-3 z-50 animate-slideUp">
          <Shuffle className="w-7 h-7 text-indigo-600 animate-spin" />
          <div>
            <p className="font-bold text-gray-800">Shuffling Pattern...</p>
            <p className="text-xs text-gray-500">
              {currentPatternType} → {getNextPatternType()}
            </p>
          </div>
        </div>
      )}

      {isShuffling && !isPatternShuffling && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-2xl p-4 flex items-center gap-3 z-50 animate-slideUp">
          <Shuffle className="w-6 h-6 text-orange-600 animate-spin" />
          <div>
            <p className="font-bold text-gray-800">Shuffling Variant...</p>
            <p className="text-xs text-gray-500">Applying new layout</p>
          </div>
        </div>
      )}

      {/* MODALS */}
      <WallSelectorModal
        isOpen={showWallSelector}
        onClose={() => setShowWallSelector(false)}
        onSelectWall={handleSelectWall}
        roomType={roomType}
        wallTileHeight={wallTileHeight} 
      />

      <TileUploadOptionsModal
        isOpen={showTileUploadOptions}
        onClose={() => setShowTileUploadOptions(false)}
        onTileSelected={handleTileSelected}
        currentUser={currentUser}
      />

      <TileUploadOptionsModal
        isOpen={showFloorUploadModal}
        onClose={() => setShowFloorUploadModal(false)}
        onTileSelected={handleFloorTileSelected}
        currentUser={currentUser}
      />

      <RandomPatternModal
        isOpen={showRandomPattern}
        onClose={() => setShowRandomPattern(false)}
        onApplyPattern={handleApplyRandomPattern}
        roomType={roomType}
        currentUser={currentUser}
          wallTileHeight={wallTileHeight}
      />
 {success && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-[60] max-w-md mx-4 animate-slideDown">
          <div className="bg-green-500 text-white px-4 py-3 rounded-xl shadow-2xl flex items-start gap-3 border-2 border-green-400">
            <Check className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <p className="text-sm font-medium whitespace-pre-line flex-1">{success}</p>
            <button 
              onClick={() => setSuccess(null)} 
              className="ml-auto hover:bg-green-600 rounded p-1 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {error && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-[60] max-w-md mx-4 animate-slideDown">
          <div className="bg-red-500 text-white px-4 py-3 rounded-xl shadow-2xl flex items-start gap-3 border-2 border-red-400">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <p className="text-sm font-medium whitespace-pre-line flex-1">{error}</p>
            <button 
              onClick={() => setError(null)} 
              className="ml-auto hover:bg-red-600 rounded p-1 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { 
            opacity: 0;
            transform: translateY(20px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
        
        @media (max-width: 640px) {
          .hidden.sm\\:inline {
            display: none;
          }
        }
      `}</style>
    </div>
  );
};

export default Enhanced3DViewer;