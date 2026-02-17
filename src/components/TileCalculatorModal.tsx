
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  X,
  Calculator,
  Download,
  Package,
  Layers,
  TrendingUp,
  Grid3x3,
  Shuffle,
  CheckCircle,
  AlertCircle,
  Info,
  Ruler,
  Eye,
  EyeOff,
  Square
} from 'lucide-react';
import { saveCalculationDimensions } from '../utils/dimensionHelpers';

// ═══════════════════════════════════════════════════════════════
// INTERFACES
// ═══════════════════════════════════════════════════════════════

interface UniversalTileCalculatorProps {
  isOpen: boolean;
  onClose: () => void;
  initialFloorTile?: {
    name: string;
    size: { width: number; height: number };
    imageUrl?: string;
  };
  roomType: 'kitchen' | 'bathroom' | 'all';
  defaultDimensions?: {
    width: number;
    depth: number;
    height: number;
  };
}

interface TileSize {
  width: number;
  height: number;
  label: string;
}

type PatternType = 'vertical' | 'horizontal' | 'diagonal' | 'checkerboard' | 'random' | 'border' | 'corners' | 'cross';

interface PatternConfig {
  type: PatternType;
  name: string;
  icon: string;
  description: string;
  coverage: string;
  coveragePercent: number;
}

interface TileBreakdown {
  floor: number;
  wall: {
    baseCount: number;
    highlighterCount: number;
    totalArea: number;
  };
  perimeter: number;
  roomAreaSqFt: number;
}

// ═══════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════

const TILE_SIZES: TileSize[] = [
  { width: 60, height: 60, label: '60×60' },
  { width: 60, height: 120, label: '60×120' },
  { width: 80, height: 80, label: '80×80' },
  { width: 30, height: 45, label: '30×45' },
  { width: 30, height: 60, label: '30×60' },
  { width: 40, height: 80, label: '40×80' },
  { width: 45, height: 45, label: '45×45' },
  { width: 20, height: 20, label: '20×20' }
];

const PATTERN_CONFIGS: PatternConfig[] = [
  { type: 'vertical', name: 'Vertical Stripes', icon: '▥', description: '2 tiles + 1 gap pattern', coverage: '~65%', coveragePercent: 0.65 },
  { type: 'horizontal', name: 'Horizontal Stripes', icon: '▤', description: 'Row-wise pattern', coverage: '~65%', coveragePercent: 0.65 },
  { type: 'diagonal', name: 'Diagonal Lines', icon: '⧅', description: 'Slant pattern', coverage: '~50%', coveragePercent: 0.50 },
  { type: 'checkerboard', name: 'Checkerboard', icon: '▦', description: 'Chess pattern', coverage: '~50%', coveragePercent: 0.50 },
  { type: 'random', name: 'Random Scatter', icon: '⚹', description: 'Random 60% tiles', coverage: '~60%', coveragePercent: 0.60 },
  { type: 'border', name: 'Border Frame', icon: '⊞', description: 'Edge tiles only', coverage: '~30%', coveragePercent: 0.30 },
  { type: 'corners', name: 'Corner Focus', icon: '⊡', description: 'Corner areas', coverage: '~40%', coveragePercent: 0.40 },
  { type: 'cross', name: 'Cross Pattern', icon: '✚', description: 'Center cross', coverage: '~35%', coveragePercent: 0.35 }
];

const WASTAGE_MULTIPLIER = 1.08; // 8% wastage

// ═══════════════════════════════════════════════════════════════
// PATTERN GENERATION FUNCTIONS
// ═══════════════════════════════════════════════════════════════

const generatePattern = (
  patternType: PatternType,
  cols: number,
  rows: number,
  variant: number = 0
): number[] => {
  const totalTiles = cols * rows;
  const selectedIndices: number[] = [];

  switch (patternType) {
    case 'vertical':
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const index = (row * cols) + col + 1;
          const pattern = (col + variant) % 3;
          if (pattern === 0 || pattern === 1) {
            selectedIndices.push(index);
          }
        }
      }
      break;

    case 'horizontal':
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const index = (row * cols) + col + 1;
          const pattern = (row + variant) % 3;
          if (pattern === 0 || pattern === 1) {
            selectedIndices.push(index);
          }
        }
      }
      break;

    case 'diagonal':
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const index = (row * cols) + col + 1;
          const diagonal = (row + col + variant) % 4;
          if (diagonal === 0 || diagonal === 1) {
            selectedIndices.push(index);
          }
        }
      }
      break;

    case 'checkerboard':
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const index = (row * cols) + col + 1;
          const isEven = (row + col) % 2 === 0;
          if (variant % 2 === 1 ? !isEven : isEven) {
            selectedIndices.push(index);
          }
        }
      }
      break;

    case 'random':
      let random = variant;
      const seededRandom = () => {
        random = (random * 9301 + 49297) % 233280;
        return random / 233280;
      };
      for (let i = 1; i <= totalTiles; i++) {
        if (seededRandom() < 0.6) {
          selectedIndices.push(i);
        }
      }
      break;

    case 'border':
      const thickness = Math.max(1, variant % 3);
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const index = (row * cols) + col + 1;
          const isTopBorder = row < thickness;
          const isBottomBorder = row >= rows - thickness;
          const isLeftBorder = col < thickness;
          const isRightBorder = col >= cols - thickness;
          if (isTopBorder || isBottomBorder || isLeftBorder || isRightBorder) {
            selectedIndices.push(index);
          }
        }
      }
      break;

    case 'corners':
      const size = Math.max(2, 3 + (variant % 3));
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const index = (row * cols) + col + 1;
          const isTopLeft = row < size && col < size;
          const isTopRight = row < size && col >= cols - size;
          const isBottomLeft = row >= rows - size && col < size;
          const isBottomRight = row >= rows - size && col >= cols - size;
          if (isTopLeft || isTopRight || isBottomLeft || isBottomRight) {
            selectedIndices.push(index);
          }
        }
      }
      break;

    case 'cross':
      const centerCol = Math.floor(cols / 2);
      const centerRow = Math.floor(rows / 2);
      const crossThickness = Math.max(1, 2 + (variant % 2));
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const index = (row * cols) + col + 1;
          const isVerticalLine = Math.abs(col - centerCol) < crossThickness;
          const isHorizontalLine = Math.abs(row - centerRow) < crossThickness;
          if (isVerticalLine || isHorizontalLine) {
            selectedIndices.push(index);
          }
        }
      }
      break;
  }

  return selectedIndices;
};

// ═══════════════════════════════════════════════════════════════
// PATTERN PREVIEW COMPONENT
// ═══════════════════════════════════════════════════════════════

const PatternPreview: React.FC<{
  pattern: PatternType;
  variant: number;
  cols?: number;
  rows?: number;
}> = ({ pattern, variant, cols = 20, rows = 12 }) => {
  const patternIndices = useMemo(() => {
    return generatePattern(pattern, cols, rows, variant);
  }, [pattern, variant, cols, rows]);

  const highlighterCount = patternIndices.length;
  const totalCount = cols * rows;
  const baseCount = totalCount - highlighterCount;
  const percentage = ((highlighterCount / totalCount) * 100).toFixed(1);

  return (
    <div className="bg-white rounded-xl border-2 border-orange-300 p-4 space-y-3 shadow-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Eye className="w-5 h-5 text-orange-600" />
          <p className="font-bold text-gray-900 text-sm">Live Pattern Preview</p>
        </div>
        {/* <div className="text-xs bg-gradient-to-r from-orange-500 to-amber-500 text-white px-3 py-1.5 rounded-full font-bold shadow-md">
          {percentage}% Highlighter
        </div> */}
      </div>

      <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg p-3 shadow-inner">
        <div 
          className="grid gap-[2px] bg-gray-400 p-[2px] rounded-md overflow-hidden"
          style={{
            gridTemplateColumns: `repeat(${cols}, 1fr)`,
            aspectRatio: `${cols}/${rows}`
          }}
        >
          {Array.from({ length: totalCount }, (_, i) => {
            const index = i + 1;
            const isHighlighter = patternIndices.includes(index);
            
            return (
              <div
                key={i}
                className={`transition-all duration-200 rounded-sm ${
                  isHighlighter 
                    ? 'bg-gradient-to-br from-orange-500 via-orange-600 to-amber-600 shadow-sm' 
                    : 'bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200'
                }`}
                style={{ aspectRatio: '1/1' }}
                title={isHighlighter ? 'Highlighter Tile' : 'Base Tile'}
              />
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {/* <div className="bg-gradient-to-br from-blue-50 to-blue-100 px-2 py-1.5 rounded-lg border-2 border-blue-300 text-center">
          <p className="text-xs text-blue-600 font-semibold">Base</p>
          <p className="text-lg font-bold text-blue-900">{baseCount}</p>
        </div> */}

        {/* <div className="bg-gradient-to-br from-orange-50 to-orange-100 px-2 py-1.5 rounded-lg border-2 border-orange-300 text-center">
          <p className="text-xs text-orange-600 font-semibold">Highlighter</p>
          <p className="text-lg font-bold text-orange-900">{highlighterCount}</p>
        </div> */}

        {/* <div className="bg-gradient-to-br from-green-50 to-green-100 px-2 py-1.5 rounded-lg border-2 border-green-300 text-center">
          <p className="text-xs text-green-600 font-semibold">Total</p>
          <p className="text-lg font-bold text-green-900">{totalCount}</p>
        </div> */}
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════

export const UniversalTileCalculator: React.FC<UniversalTileCalculatorProps> = ({
  isOpen,
  onClose,
  initialFloorTile,
  roomType,
  defaultDimensions
}) => {
  // ═════════════════════════════════════════════════════════════
  // STATE MANAGEMENT
  // ═════════════════════════════════════════════════════════════
  
  const [roomWidth, setRoomWidth] = useState<string>(defaultDimensions?.width.toString() || '10');
  const [roomDepth, setRoomDepth] = useState<string>(defaultDimensions?.depth.toString() || '10');
  const [roomHeight, setRoomHeight] = useState<string>(defaultDimensions?.height.toString() || '11');
  
  const [numberOfWalls, setNumberOfWalls] = useState<number>(roomType === 'kitchen' ? 1 : 4);
  
  const [floorTileSize, setFloorTileSize] = useState<TileSize>(
    initialFloorTile?.size 
      ? { width: initialFloorTile.size.width, height: initialFloorTile.size.height, label: `${initialFloorTile.size.width}×${initialFloorTile.size.height}` }
      : TILE_SIZES[0]
  );
  
  const [baseTileSize, setBaseTileSize] = useState<TileSize>(TILE_SIZES[0]);
  
  const [highlighterTileSize, setHighlighterTileSize] = useState<TileSize | null>(null);
  const [selectedPattern, setSelectedPattern] = useState<PatternType | null>(null);
  const [patternVariant, setPatternVariant] = useState<number>(0);
  const [showPatternPreview, setShowPatternPreview] = useState<boolean>(true);
  
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // ═════════════════════════════════════════════════════════════
  // INPUT VALIDATION
  // ═════════════════════════════════════════════════════════════
  
  const handleDimensionChange = useCallback((
    value: string, 
    setter: React.Dispatch<React.SetStateAction<string>>
  ) => {
    if (value === '') {
      setter('');
      return;
    }
    
    const numValue = parseFloat(value);
    
    if (numValue < 0) {
      setError('❌ Dimensions cannot be negative');
      return;
    }
    
    if (numValue > 1000) {
      setError('❌ Dimension too large (max 1000 ft)');
      return;
    }
    
    setter(value);
    setError(null);
  }, []);

  // ═════════════════════════════════════════════════════════════
  // LOAD DEFAULT DIMENSIONS
  // ═════════════════════════════════════════════════════════════
  
  useEffect(() => {
    if (defaultDimensions) {
      setRoomWidth(defaultDimensions.width.toString());
      setRoomDepth(defaultDimensions.depth.toString());
      setRoomHeight(defaultDimensions.height.toString());
    }
  }, [defaultDimensions]);

  // ═════════════════════════════════════════════════════════════
  // AUTO-DISMISS NOTIFICATIONS
  // ═════════════════════════════════════════════════════════════
  
  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        setSuccess(null);
        setError(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [success, error]);

  // ═══════════════════════════════════════════════════════════════
  // ✅ FIXED: ACCURATE CALCULATION WITH PROPER 8% WASTAGE
  // ═══════════════════════════════════════════════════════════════
  
  const tileBreakdown = useMemo((): TileBreakdown | null => {
    const width = parseFloat(roomWidth);
    const depth = parseFloat(roomDepth);
    const height = parseFloat(roomHeight);

    if (isNaN(width) || isNaN(depth) || isNaN(height)) {
      return null;
    }
    
    if (width <= 0 || depth <= 0 || height <= 0) {
      return null;
    }

    console.log('╔═══════════════════════════════════════════════════════════╗');
    console.log('║   PRODUCTION TILE CALCULATOR v5.0 - ACCURATE + WASTAGE   ║');
    console.log('╚═══════════════════════════════════════════════════════════╝');

    // ═══════════════════════════════════════════════════════════
    // ✅ FLOOR CALCULATION (Uses Scanned Tile)
    // ═══════════════════════════════════════════════════════════
    
    const floorTileWidthFt = floorTileSize.width * 0.0328084; // cm to feet
    const floorTileHeightFt = floorTileSize.height * 0.0328084;
    const floorTileAreaSqFt = floorTileWidthFt * floorTileHeightFt;
    
    const floorArea = width * depth;
    const floorTilesRaw = floorArea / floorTileAreaSqFt;
    const floorTileCount = Math.ceil(floorTilesRaw * WASTAGE_MULTIPLIER);

    console.log('\n🟫 FLOOR CALCULATION:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`   Room Area: ${width}ft × ${depth}ft = ${floorArea.toFixed(2)} sq ft`);
    console.log(`   Tile Size: ${floorTileSize.width}×${floorTileSize.height}cm (${floorTileAreaSqFt.toFixed(6)} sq ft/tile)`);
    console.log(`   Raw Count: ${floorArea.toFixed(2)} ÷ ${floorTileAreaSqFt.toFixed(6)} = ${floorTilesRaw.toFixed(2)} tiles`);
    console.log(`   ✅ With 8% Wastage: ${floorTilesRaw.toFixed(2)} × 1.08 = ${floorTileCount} tiles`);

    // ═══════════════════════════════════════════════════════════
    // ✅ PERIMETER CALCULATION
    // ═══════════════════════════════════════════════════════════
    
    let perimeter = 0;
    
    switch (numberOfWalls) {
      case 1:
        perimeter = width;
        break;
      case 2:
        perimeter = 2 * width;
        break;
      case 3:
        perimeter = 2 * width + depth;
        break;
      case 4:
        perimeter = 2 * (width + depth);
        break;
      default:
        perimeter = width;
    }

    console.log(`\n📐 PERIMETER: ${perimeter.toFixed(2)} ft (${numberOfWalls} wall${numberOfWalls > 1 ? 's' : ''})`);

    // ═══════════════════════════════════════════════════════════
    // ✅ WALL CALCULATION WITH PROPER 8% WASTAGE
    // ═══════════════════════════════════════════════════════════
    
    const wallArea = perimeter * height;

    console.log(`\n🧱 WALL CALCULATION - ${height}FT HEIGHT:`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`   Total Wall Area: ${perimeter.toFixed(2)}ft × ${height}ft = ${wallArea.toFixed(2)} sq ft`);

    let baseCount = 0;
    let highlighterCount = 0;

    // Calculate tile areas in sq ft
    const baseTileWidthFt = baseTileSize.width * 0.0328084;
    const baseTileHeightFt = baseTileSize.height * 0.0328084;
    const baseTileAreaSqFt = baseTileWidthFt * baseTileHeightFt;

    if (highlighterTileSize && selectedPattern) {
      // ✅ PATTERN MODE - SPLIT CALCULATION WITH WASTAGE
      
      const patternConfig = PATTERN_CONFIGS.find(p => p.type === selectedPattern);
      const coveragePercent = patternConfig?.coveragePercent || 0.5;
      
      console.log(`\n   📊 Pattern Mode: ${patternConfig?.name}`);
      console.log(`   Coverage: ${(coveragePercent * 100).toFixed(0)}% Highlighter, ${((1 - coveragePercent) * 100).toFixed(0)}% Base`);
      
      // Calculate highlighter tile area
      const highlighterTileWidthFt = highlighterTileSize.width * 0.0328084;
      const highlighterTileHeightFt = highlighterTileSize.height * 0.0328084;
      const highlighterTileAreaSqFt = highlighterTileWidthFt * highlighterTileHeightFt;
      
      // Split wall area by pattern coverage
      const highlighterArea = wallArea * coveragePercent;
      const baseArea = wallArea * (1 - coveragePercent);
      
      console.log(`\n   🔹 Base Tile Calculation (${baseTileSize.label}cm):`);
      console.log(`      Area: ${baseArea.toFixed(2)} sq ft`);
      console.log(`      Tile Area: ${baseTileAreaSqFt.toFixed(6)} sq ft/tile`);
      const baseRawCount = baseArea / baseTileAreaSqFt;
      console.log(`      Raw Count: ${baseArea.toFixed(2)} ÷ ${baseTileAreaSqFt.toFixed(6)} = ${baseRawCount.toFixed(2)} tiles`);
      baseCount = Math.ceil(baseRawCount * WASTAGE_MULTIPLIER);
      console.log(`      ✅ With 8% Wastage: ${baseRawCount.toFixed(2)} × 1.08 = ${baseCount} tiles`);
      
      console.log(`\n   🔸 Highlighter Tile Calculation (${highlighterTileSize.label}cm):`);
      console.log(`      Area: ${highlighterArea.toFixed(2)} sq ft`);
      console.log(`      Tile Area: ${highlighterTileAreaSqFt.toFixed(6)} sq ft/tile`);
      const highlighterRawCount = highlighterArea / highlighterTileAreaSqFt;
      console.log(`      Raw Count: ${highlighterArea.toFixed(2)} ÷ ${highlighterTileAreaSqFt.toFixed(6)} = ${highlighterRawCount.toFixed(2)} tiles`);
      highlighterCount = Math.ceil(highlighterRawCount * WASTAGE_MULTIPLIER);
      console.log(`      ✅ With 8% Wastage: ${highlighterRawCount.toFixed(2)} × 1.08 = ${highlighterCount} tiles`);
      
    } else {
      // ✅ NO PATTERN MODE - BASE ONLY WITH WASTAGE
      
      console.log(`\n   🔹 Base Tile Only (${baseTileSize.label}cm):`);
      console.log(`      Area: ${wallArea.toFixed(2)} sq ft`);
      console.log(`      Tile Area: ${baseTileAreaSqFt.toFixed(6)} sq ft/tile`);
      const baseRawCount = wallArea / baseTileAreaSqFt;
      console.log(`      Raw Count: ${wallArea.toFixed(2)} ÷ ${baseTileAreaSqFt.toFixed(6)} = ${baseRawCount.toFixed(2)} tiles`);
      baseCount = Math.ceil(baseRawCount * WASTAGE_MULTIPLIER);
      console.log(`      ✅ With 8% Wastage: ${baseRawCount.toFixed(2)} × 1.08 = ${baseCount} tiles`);
      
      highlighterCount = 0;
    }

    console.log('\n✅ CALCULATION COMPLETE');
    console.log('═══════════════════════════════════════════════════════════\n');

    return {
      floor: floorTileCount,
      wall: {
        baseCount,
        highlighterCount,
        totalArea: wallArea
      },
      perimeter,
      roomAreaSqFt: floorArea
    };
  }, [roomWidth, roomDepth, roomHeight, numberOfWalls, floorTileSize, baseTileSize, highlighterTileSize, selectedPattern]);

  // ═════════════════════════════════════════════════════════════
  // EVENT HANDLERS
  // ═════════════════════════════════════════════════════════════
  
  const handlePatternSelect = useCallback((pattern: PatternType) => {
    setSelectedPattern(pattern);
    setPatternVariant(0);
    setShowPatternPreview(true);
    setSuccess(`✅ ${PATTERN_CONFIGS.find(p => p.type === pattern)?.name} selected!`);
  }, []);

  const handleShuffleVariant = useCallback(() => {
    if (!selectedPattern) return;
    setPatternVariant(prev => (prev + 1) % 10);
    setSuccess(`🔄 Variant ${patternVariant + 2}/10 applied`);
  }, [selectedPattern, patternVariant]);

  const handleWallSelection = useCallback((walls: number) => {
    setNumberOfWalls(walls);
    const wallText = walls === 1 ? '1 wall' : `${walls} walls`;
    setSuccess(`✅ Calculation set for ${wallText}`);
  }, []);

  const handleSaveDimensions = useCallback(() => {
    const width = parseFloat(roomWidth);
    const depth = parseFloat(roomDepth);
    const height = parseFloat(roomHeight);

    if (isNaN(width) || isNaN(depth) || isNaN(height)) {
      setError('❌ Please enter valid dimensions');
      return;
    }

    if (width <= 0 || depth <= 0 || height <= 0) {
      setError('❌ Dimensions must be greater than 0');
      return;
    }

    const saved = saveCalculationDimensions(roomType, {
      width,
      depth,
      height
    });

    if (saved) {
      setSuccess(`✅ Dimensions saved: ${width}' × ${depth}' × ${height}'`);
      if (navigator.vibrate) {
        navigator.vibrate([50, 30, 50]);
      }
    } else {
      setError('❌ Failed to save dimensions');
    }
  }, [roomWidth, roomDepth, roomHeight, roomType]);

  const handleDownloadReport = useCallback(() => {
    if (!tileBreakdown) {
      setError('❌ No data to download');
      return;
    }

    const width = parseFloat(roomWidth);
    const depth = parseFloat(roomDepth);
    const height = parseFloat(roomHeight);

    let reportContent = `
═══════════════════════════════════════════════════
     UNIVERSAL TILE CALCULATION REPORT
═══════════════════════════════════════════════════

Generated: ${new Date().toLocaleString()}
Calculator Version: 5.0 - Production Ready (Wall Selection + Accurate Wastage)

═══════════════════════════════════════════════════
ROOM DETAILS
═══════════════════════════════════════════════════

Room Type: ${roomType.charAt(0).toUpperCase() + roomType.slice(1)}
Dimensions: ${width}' × ${depth}' × ${height}'
Floor Area: ${tileBreakdown.roomAreaSqFt.toFixed(2)} sq ft
Wall Height: ${height} ft (User specified)
Number of Walls: ${numberOfWalls}
Perimeter: ${tileBreakdown.perimeter.toFixed(2)} ft

═══════════════════════════════════════════════════
TILE SPECIFICATIONS
═══════════════════════════════════════════════════

Floor Tile: ${floorTileSize.label} cm ${initialFloorTile ? `(Scanned: ${initialFloorTile.name})` : ''}
Wall Base Tile: ${baseTileSize.label} cm
${highlighterTileSize ? `Wall Highlighter Tile: ${highlighterTileSize.label} cm` : 'No highlighter tile selected'}
${selectedPattern ? `Pattern: ${PATTERN_CONFIGS.find(p => p.type === selectedPattern)?.name}` : ''}

═══════════════════════════════════════════════════
FLOOR TILES
═══════════════════════════════════════════════════

Total Required: ${tileBreakdown.floor} tiles
Tile Size: ${floorTileSize.label} cm
Coverage Area: ${tileBreakdown.roomAreaSqFt.toFixed(2)} sq ft
(Includes 8% wastage)

═══════════════════════════════════════════════════
WALL TILES - ${height} FEET HEIGHT
═══════════════════════════════════════════════════

Wall Area: ${tileBreakdown.wall.totalArea.toFixed(2)} sq ft (${numberOfWalls} wall${numberOfWalls > 1 ? 's' : ''})

${highlighterTileSize && selectedPattern && tileBreakdown.wall.highlighterCount > 0 ? `
Base Tiles (${baseTileSize.label}cm):
  Count: ${tileBreakdown.wall.baseCount} tiles

Highlighter Tiles (${highlighterTileSize.label}cm):
  Count: ${tileBreakdown.wall.highlighterCount} tiles
  Pattern: ${PATTERN_CONFIGS.find(p => p.type === selectedPattern)?.name}

TOTAL WALL TILES: ${tileBreakdown.wall.baseCount + tileBreakdown.wall.highlighterCount} tiles
` : `
Base Tiles (${baseTileSize.label}cm):
  Count: ${tileBreakdown.wall.baseCount} tiles

TOTAL WALL TILES: ${tileBreakdown.wall.baseCount} tiles
`}

(Includes 8% wastage)

═══════════════════════════════════════════════════
SHOPPING LIST
═══════════════════════════════════════════════════

☐ Floor Tiles: ${tileBreakdown.floor} pieces
   Size: ${floorTileSize.label} cm
   ${initialFloorTile ? `Type: ${initialFloorTile.name}` : ''}

${highlighterTileSize && selectedPattern ? `
☐ Wall Tiles - Base: ${tileBreakdown.wall.baseCount} pieces
   Size: ${baseTileSize.label} cm
   
☐ Wall Tiles - Highlighter: ${tileBreakdown.wall.highlighterCount} pieces
   Size: ${highlighterTileSize.label} cm
   Pattern: ${PATTERN_CONFIGS.find(p => p.type === selectedPattern)?.name}
` : `
☐ Wall Tiles: ${tileBreakdown.wall.baseCount} pieces
   Size: ${baseTileSize.label} cm
`}

═══════════════════════════════════════════════════
CALCULATION NOTES
═══════════════════════════════════════════════════

• Floor uses scanned tile (${floorTileSize.label}cm)
• Walls use base tile (${baseTileSize.label}cm)${highlighterTileSize ? ` + highlighter (${highlighterTileSize.label}cm)` : ''}
• All counts include 8% wastage for cutting & breakage
• Area-based calculation for maximum accuracy
• Wall calculation for ${numberOfWalls} wall${numberOfWalls > 1 ? 's' : ''} at ${height} feet height
• Always purchase 5-10% extra for future replacements

═══════════════════════════════════════════════════
END OF REPORT
═══════════════════════════════════════════════════
`;

    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Tile_Report_${roomType}_${numberOfWalls}walls_${new Date().getTime()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setSuccess('📥 Report downloaded successfully!');
  }, [tileBreakdown, roomWidth, roomDepth, roomHeight, numberOfWalls, floorTileSize, baseTileSize, highlighterTileSize, selectedPattern, roomType, initialFloorTile]);

  // ═════════════════════════════════════════════════════════════
  // RENDER
  // ═════════════════════════════════════════════════════════════
  
  if (!isOpen) return null;

  const isHighlighterMode = !!highlighterTileSize && !!selectedPattern;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-7xl max-h-[98vh] sm:max-h-[95vh] overflow-hidden flex flex-col">
        
        {/* HEADER */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2 sm:gap-3">
            <Calculator className="w-5 h-5 sm:w-7 sm:h-7" />
            <div>
              <h2 className="text-base sm:text-xl font-bold">Universal Tile Calculator</h2>
              <p className="text-xs sm:text-sm text-green-100">Production v5.0 - Wall Selection + Accurate ✅</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 sm:p-2 hover:bg-white/20 rounded-lg transition-colors"
            aria-label="Close calculator"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        {/* NOTIFICATIONS */}
        {success && (
          <div className="mx-3 sm:mx-6 mt-3 sm:mt-4 bg-green-50 border border-green-200 rounded-lg p-2 sm:p-3 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 flex-shrink-0" />
            <p className="text-green-800 text-xs sm:text-sm flex-1">{success}</p>
            <button onClick={() => setSuccess(null)} className="p-1 hover:bg-green-100 rounded">
              <X className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
            </button>
          </div>
        )}

        {error && (
          <div className="mx-3 sm:mx-6 mt-3 sm:mt-4 bg-red-50 border border-red-200 rounded-lg p-2 sm:p-3 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 flex-shrink-0" />
            <p className="text-red-800 text-xs sm:text-sm flex-1">{error}</p>
            <button onClick={() => setError(null)} className="p-1 hover:bg-red-100 rounded">
              <X className="w-3 h-3 sm:w-4 sm:h-4 text-red-600" />
            </button>
          </div>
        )}

        {/* MAIN CONTENT */}
        <div className="flex-1 overflow-hidden flex flex-col lg:flex-row">
          
          {/* LEFT PANEL - INPUTS */}
          <div className="lg:w-1/2 overflow-y-auto border-b lg:border-b-0 lg:border-r border-gray-200 p-3 sm:p-6 space-y-4 sm:space-y-6">
            
            {/* SCANNED TILE INFO */}
            {initialFloorTile && (
              <section className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-3 sm:p-4 border-2 border-blue-200">
                <div className="flex items-center gap-2 sm:gap-3">
                  <Package className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-gray-900 text-sm sm:text-base truncate">{initialFloorTile.name}</p>
                    <p className="text-xs sm:text-sm text-gray-600">
                      {initialFloorTile.size.width}cm × {initialFloorTile.size.height}cm
                    </p>
                    {/* <p className="text-xs text-blue-600 font-semibold mt-1">🔒 Locked for FLOOR only</p> */}
                  </div>
                  <span className="bg-green-500 text-white px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs font-bold flex-shrink-0">
                    ✓ Scanned
                  </span>
                </div>
              </section>
            )}

            {/* ROOM DIMENSIONS */}
            <section className="bg-gray-50 rounded-xl p-3 sm:p-5 border border-gray-200">
              <h3 className="font-bold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2 text-sm sm:text-base">
                <Ruler className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                 Room Dimensions
              </h3>
              
              <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-3">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    Width (ft)
                  </label>
                  <input
                    type="number"
                    value={roomWidth}
                    onChange={(e) => handleDimensionChange(e.target.value, setRoomWidth)}
                    className="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="10"
                    min="0"
                    max="1000"
                    step="0.1"
                  />
                </div>
                
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    Depth (ft)
                  </label>
                  <input
                    type="number"
                    value={roomDepth}
                    onChange={(e) => handleDimensionChange(e.target.value, setRoomDepth)}
                    className="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="10"
                    min="0"
                    max="1000"
                    step="0.1"
                  />
                </div>
                
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                    Height (ft)
                  </label>
                  <input
                    type="number"
                    value={roomHeight}
                    onChange={(e) => handleDimensionChange(e.target.value, setRoomHeight)}
                    className="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="11"
                    min="0"
                    max="1000"
                    step="0.1"
                  />
                </div>
              </div>

              <button
                onClick={handleSaveDimensions}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white px-3 sm:px-4 py-2 rounded-lg font-semibold transition-colors text-xs sm:text-sm shadow-md hover:shadow-lg"
              >
                💾 Save Dimensions
              </button>

              <div className="bg-blue-50 rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 mt-2 sm:mt-3">
                <p className="text-xs text-blue-700">
                  {/* <strong>💡 Tip:</strong> Enter measurements in feet (e.g., 10.5). Values must be greater than 0. */}
                </p>
              </div>
            </section>

            {/* NUMBER OF WALLS */}
            <section className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-3 sm:p-5 border-2 border-yellow-300">
              <h3 className="font-bold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2 text-sm sm:text-base">
                <Square className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600" />
                🧱 Number of Walls to Tile
              </h3>
              
              <div className="grid grid-cols-4 gap-2 sm:gap-3">
                {[1, 2, 3, 4].map((walls) => (
                  <button
                    key={walls}
                    onClick={() => handleWallSelection(walls)}
                    className={`relative p-3 sm:p-4 rounded-xl border-3 transition-all text-center ${
                      numberOfWalls === walls
                        ? 'border-yellow-500 bg-yellow-100 shadow-lg scale-105 ring-2 ring-yellow-400'
                        : 'border-gray-300 bg-white hover:border-yellow-400 hover:shadow-md'
                    }`}
                  >
                    <div className="text-3xl sm:text-4xl font-bold text-gray-900 mb-1">
                      {walls}
                    </div>
                    <p className="text-[10px] sm:text-xs font-semibold text-gray-600">
                      Wall{walls > 1 ? 's' : ''}
                    </p>
                    {numberOfWalls === walls && (
                      <div className="absolute -top-2 -right-2 w-5 h-5 sm:w-6 sm:h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                      </div>
                    )}
                  </button>
                ))}
              </div>

              <div className="mt-3 bg-yellow-100 rounded-lg px-3 py-2 border border-yellow-300">
                <p className="text-xs text-yellow-900">
                  <strong>Selected:</strong> {numberOfWalls} wall{numberOfWalls > 1 ? 's' : ''} will be calculated
                </p>
                <p className="text-xs text-yellow-700 mt-1">
                  {numberOfWalls === 1 && '• Typically: Back wall or accent wall'}
                  {numberOfWalls === 2 && '• Typically: Two opposite walls'}
                  {numberOfWalls === 3 && '• Typically: All except one wall'}
                  {numberOfWalls === 4 && '• All four walls (full room)'}
                </p>
              </div>
            </section>

            {/* WALL BASE TILE */}
            <section className="bg-gray-50 rounded-xl p-3 sm:p-5 border border-gray-200">
              <h3 className="font-bold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2 text-sm sm:text-base">
                <Package className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                🟦 Wall Base Tile Size
              </h3>
              
              <div className="grid grid-cols-4 gap-1.5 sm:gap-2">
                {TILE_SIZES.map((size) => (
                  <button
                    key={size.label}
                    onClick={() => {
                      setBaseTileSize(size);
                      setSuccess(`✅ Wall base tile set to ${size.label} cm`);
                    }}
                    className={`p-2 sm:p-3 rounded-lg border-2 transition-all text-center ${
                      baseTileSize.label === size.label
                        ? 'border-green-500 bg-green-50 shadow-md scale-105'
                        : 'border-gray-200 hover:border-green-300 bg-white hover:shadow'
                    }`}
                  >
                    <p className="font-bold text-xs sm:text-sm text-gray-900">{size.label}</p>
                    <p className="text-[10px] sm:text-xs text-gray-500">cm</p>
                  </button>
                ))}
              </div>
              
              <div className="mt-2 sm:mt-3 bg-green-50 rounded-lg px-2 sm:px-3 py-1.5 sm:py-2">
                <p className="text-xs text-green-700">
                  <strong>Selected:</strong> {baseTileSize.width} × {baseTileSize.height} cm (WALLS ONLY)
                </p>
              </div>
            </section>

            {/* ADD HIGHLIGHTER */}
            <section>
              {!highlighterTileSize ? (
                <button
                  onClick={() => {
                    setHighlighterTileSize(TILE_SIZES[3]);
                    setSuccess('✅ Highlighter tile activated! Select size below.');
                  }}
                  className="w-full bg-gradient-to-r from-orange-600 to-amber-600 text-white py-3 sm:py-4 rounded-xl font-bold hover:shadow-lg transition-all flex items-center justify-center gap-2 text-sm sm:text-base"
                >
                  <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6" />
                  + Add Wall Highlighter Tile
                </button>
              ) : (
                <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-3 sm:p-5 border-2 border-orange-200">
                  <div className="flex items-center justify-between mb-3 sm:mb-4">
                    <h3 className="font-bold text-gray-900 flex items-center gap-2 text-sm sm:text-base">
                      <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600" />
                      🟧 Wall Highlighter Tile Size
                    </h3>
                    <button
                      onClick={() => {
                        setHighlighterTileSize(null);
                        setSelectedPattern(null);
                        setSuccess('🗑️ Highlighter removed');
                      }}
                      className="text-red-600 hover:text-red-700 text-xs sm:text-sm font-semibold"
                    >
                      Remove
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-4 gap-1.5 sm:gap-2">
                    {TILE_SIZES.map((size) => (
                      <button
                        key={size.label}
                        onClick={() => {
                          setHighlighterTileSize(size);
                          setSuccess(`✅ Highlighter tile set to ${size.label} cm`);
                        }}
                        className={`p-2 sm:p-3 rounded-lg border-2 transition-all text-center ${
                          highlighterTileSize.label === size.label
                            ? 'border-orange-500 bg-orange-100 shadow-md scale-105'
                            : 'border-gray-200 hover:border-orange-300 bg-white hover:shadow'
                        }`}
                      >
                        <p className="font-bold text-xs sm:text-sm text-gray-900">{size.label}</p>
                        <p className="text-[10px] sm:text-xs text-gray-500">cm</p>
                      </button>
                    ))}
                  </div>
                  
                  <div className="mt-2 sm:mt-3 bg-orange-100 rounded-lg px-2 sm:px-3 py-1.5 sm:py-2">
                    <p className="text-xs text-orange-800">
                      <strong>Selected:</strong> {highlighterTileSize.width} × {highlighterTileSize.height} cm (WALLS ONLY)
                    </p>
                  </div>
                </div>
              )}
            </section>

            {/* PATTERN SELECTOR */}
            {highlighterTileSize && (
              <section className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-3 sm:p-5 border-2 border-purple-200">
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <h3 className="font-bold text-gray-900 flex items-center gap-2 text-sm sm:text-base">
                    <Grid3x3 className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
                    🎨 Wall Highlighter Pattern
                  </h3>
                  {selectedPattern && (
                    <button
                      onClick={() => setShowPatternPreview(!showPatternPreview)}
                      className="text-xs text-purple-600 hover:text-purple-700 flex items-center gap-1 font-semibold px-2 py-1 rounded hover:bg-purple-100"
                    >
                      {showPatternPreview ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                      {showPatternPreview ? 'Hide' : 'Show'}
                    </button>
                  )}
                </div>
                
                <div className="grid grid-cols-4 gap-1.5 sm:gap-2 mb-3 sm:mb-4">
                  {PATTERN_CONFIGS.map((pattern) => (
                    <button
                      key={pattern.type}
                      onClick={() => handlePatternSelect(pattern.type)}
                      className={`p-2 sm:p-3 rounded-lg border-2 transition-all ${
                        selectedPattern === pattern.type
                          ? 'border-purple-500 bg-purple-100 shadow-md scale-105'
                          : 'border-gray-200 hover:border-purple-300 bg-white hover:shadow'
                      }`}
                    >
                      <div className="text-2xl sm:text-3xl mb-1">{pattern.icon}</div>
                      <p className="text-[10px] sm:text-xs font-semibold text-gray-900 leading-tight">
                        {pattern.name}
                      </p>
                      <p className="text-[9px] sm:text-xs text-gray-500 mt-0.5">
                        {pattern.coverage}
                      </p>
                    </button>
                  ))}
                </div>

                {selectedPattern && (
                  <button
                    onClick={handleShuffleVariant}
                    className="w-full bg-white hover:bg-gray-50 border-2 border-purple-300 text-purple-700 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg text-xs sm:text-sm"
                  >
                    <Shuffle className="w-3 h-3 sm:w-4 sm:h-4" />
                    Shuffle Variant ({patternVariant + 1}/10)
                  </button>
                )}
              </section>
            )}

            {/* PATTERN PREVIEW */}
            {showPatternPreview && selectedPattern && (
              <section>
                <PatternPreview
                  pattern={selectedPattern}
                  variant={patternVariant}
                  cols={20}
                  rows={12}
                />
              </section>
            )}

          </div>

          {/* RIGHT PANEL - RESULTS */}
          <div className="lg:w-1/2 overflow-y-auto bg-gradient-to-br from-gray-50 to-blue-50 p-3 sm:p-6 space-y-4 sm:space-y-6">
            
            {tileBreakdown ? (
              <>
                {/* FLOOR TILES */}
                <section className="bg-white rounded-xl p-3 sm:p-5 border-2 border-blue-200 shadow-lg">
                  <div className="flex items-center justify-between mb-3 sm:mb-4">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <Package className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                      <div>
                        <p className="font-bold text-gray-900 text-sm sm:text-lg">Floor Tiles</p>
                        {/* <p className="text-xs text-gray-600">
                          {tileBreakdown.roomAreaSqFt.toFixed(2)} sq ft area
                        </p> */}
                      </div>
                    </div>
                    <span className="text-3xl sm:text-4xl font-bold text-blue-600">
                      {tileBreakdown.floor}
                    </span>
                  </div>
                  
                  <div className="bg-blue-50 rounded-lg p-2 sm:p-3">
                    <p className="text-xs sm:text-sm text-blue-900">
                      <strong>Tile Size:</strong> {floorTileSize.width} × {floorTileSize.height} cm
                    </p>
                    {initialFloorTile && (
                      <p className="text-xs text-blue-700 mt-1">
                        <strong>Scanned:</strong> {initialFloorTile.name}
                      </p>
                    )}
                    <p className="text-xs text-blue-700 mt-1">
                      ✓ Includes 8% wastage
                    </p>
                  </div>
                </section>

                {/* WALL TILES */}
                <section className="bg-white rounded-xl p-3 sm:p-5 border-2 border-purple-200 shadow-lg">
                  <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                    <Layers className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
                    <div className="flex-1">
                      <p className="font-bold text-gray-900 text-sm sm:text-lg">
                        Wall Tiles - {roomHeight} Feet
                      </p>
                      <p className="text-xs text-gray-600">
                        {numberOfWalls} wall{numberOfWalls > 1 ? 's' : ''} 
                      </p>
                    </div>
                    <span className="text-3xl sm:text-4xl font-bold text-purple-600">
                      {tileBreakdown.wall.baseCount + tileBreakdown.wall.highlighterCount}
                    </span>
                  </div>

                  <div className="bg-purple-50 rounded-lg p-2 sm:p-3 border border-purple-200 mb-3">
                    <p className="text-xs text-purple-900">
                     
                    </p>
                  </div>

                  {isHighlighterMode && tileBreakdown.wall.highlighterCount > 0 ? (
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-blue-100 rounded-lg p-3 border-2 border-blue-300">
                          <div className="flex items-center gap-2 mb-2">
                            <Package className="w-4 h-4 text-blue-600" />
                            <p className="text-xs text-blue-700 font-semibold">Base Tiles</p>
                          </div>
                          <p className="text-2xl sm:text-3xl font-bold text-blue-900">
                            {tileBreakdown.wall.baseCount}
                          </p>
                          <p className="text-xs text-blue-600 mt-1">
                            {baseTileSize.label} cm
                          </p>
                        </div>

                        <div className="bg-orange-100 rounded-lg p-3 border-2 border-orange-300">
                          <div className="flex items-center gap-2 mb-2">
                            <TrendingUp className="w-4 h-4 text-orange-600" />
                            <p className="text-xs text-orange-700 font-semibold">Highlighter</p>
                          </div>
                          <p className="text-2xl sm:text-3xl font-bold text-orange-900">
                            {tileBreakdown.wall.highlighterCount}
                          </p>
                          <p className="text-xs text-orange-600 mt-1">
                            {highlighterTileSize?.label} cm
                          </p>
                        </div>
                      </div>

                      <div className="bg-green-100 rounded-lg p-2 border border-green-300">
                        <p className="text-xs text-green-800 text-center">
                          ✅ Pattern: {PATTERN_CONFIGS.find(p => p.type === selectedPattern)?.name} | Includes 8% wastage
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-gray-100 rounded-lg p-3 border border-gray-300">
                      <p className="text-sm text-gray-700">
                        <strong>{tileBreakdown.wall.baseCount}</strong> tiles ({baseTileSize.label} cm)
                      </p>
                      <p className="text-xs text-gray-600 mt-1">
                        Base tiles only • Includes 8% wastage
                      </p>
                    </div>
                  )}
                </section>

                {/* INFO BOX */}
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-3 sm:p-4 border border-blue-200">
                  <div className="flex items-start gap-2 sm:gap-3">
                    <Info className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div className="text-xs sm:text-sm text-gray-700 space-y-1">
                      <p>✅ Floor: {floorTileSize.label}cm {initialFloorTile ? '(Scanned)' : ''}</p>
                      <p>✅ Walls: Base {baseTileSize.label}cm{highlighterTileSize ? ` + Highlighter ${highlighterTileSize.label}cm` : ''}</p>
                      <p>✅ Wall calculation for {numberOfWalls} wall{numberOfWalls > 1 ? 's' : ''} at {roomHeight} feet</p>
                      <p>✅ All counts include 8% wastage</p>
                      <p>✅ Area-based calculation method</p>
                    </div>
                  </div>
                </div>

                {/* DOWNLOAD BUTTON */}
                <button
                  onClick={handleDownloadReport}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 sm:px-6 py-3 sm:py-4 rounded-xl font-bold hover:shadow-lg transition-all flex items-center justify-center gap-2 text-sm sm:text-base"
                >
                  <Download className="w-5 h-5 sm:w-6 sm:h-6" />
                  Download Complete Report
                </button>

              </>
            ) : (
              <div className="text-center py-8 sm:py-12">
                <AlertCircle className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-3 sm:mb-4" />
                <p className="text-gray-600 font-medium text-sm sm:text-base">Enter valid room dimensions to calculate</p>
                <p className="text-gray-500 text-xs sm:text-sm mt-2">All values must be greater than 0</p>
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
};