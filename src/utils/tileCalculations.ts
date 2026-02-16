/**
 * 🎯 SINGLE SOURCE OF TRUTH FOR TILE CALCULATIONS
 * Universal Calculator और Sidebar दोनों यही use करेंगे
 * 
 * @file src/utils/tileCalculations.ts
 */

export interface TileCalculationInput {
  roomWidth: number;      // in FEET
  roomDepth: number;      // in FEET
  roomHeight: number;     // in FEET
  tileWidthCm: number;    // in CM
  tileHeightCm: number;   // in CM
  roomType: 'drawing' | 'kitchen' | 'bathroom';
}

export interface TileCalculationResult {
  floor: number;
  wall_5ft: number;
  wall_8ft: number;
  wall_11ft: number;
  perimeter: number;
  tileAreaSqFt: number;
  roomAreaSqFt: number;
}

/**
 * ✅ MASTER TILE CALCULATION FUNCTION
 * सभी tile count calculations यहीं से होंगे
 */
export function calculateTiles(input: TileCalculationInput): TileCalculationResult {
  const { 
    roomWidth, 
    roomDepth, 
    roomHeight,
    tileWidthCm, 
    tileHeightCm,
    roomType 
  } = input;

  // ============================================
  // STEP 1: Convert Tile Size (CM → FEET)
  // ============================================
  const tileWidthFt = tileWidthCm * 0.0328084;
  const tileHeightFt = tileHeightCm * 0.0328084;
  const tileAreaSqFt = tileWidthFt * tileHeightFt;

  // ============================================
  // STEP 2: Calculate Floor Area
  // ============================================
  const roomAreaSqFt = roomWidth * roomDepth;

  // ============================================
  // STEP 3: Calculate Floor Tiles (with 8% wastage)
  // ============================================
  const floorTilesRaw = roomAreaSqFt / tileAreaSqFt;
  const floorTilesWithWastage = Math.ceil(floorTilesRaw * 1.08);

  // ============================================
  // STEP 4: Calculate Wall Perimeter
  // ============================================
  let perimeter = 0;
  if (roomType === 'kitchen') {
    perimeter = roomWidth; // Back wall only
  } else if (roomType === 'bathroom') {
    perimeter = 2 * (roomWidth + roomDepth); // All 4 walls
  }

  // ============================================
  // STEP 5: Initialize Result
  // ============================================
  const result: TileCalculationResult = {
    floor: floorTilesWithWastage,
    wall_5ft: 0,
    wall_8ft: 0,
    wall_11ft: 0,
    perimeter,
    tileAreaSqFt,
    roomAreaSqFt
  };

  // ============================================
  // STEP 6: Calculate Wall Tiles for Each Height
  // ============================================
  if (perimeter > 0) {
    [5, 8, 11].forEach(height => {
      const wallArea = perimeter * height;
      const wallTilesRaw = wallArea / tileAreaSqFt;
      const wallTilesWithWastage = Math.ceil(wallTilesRaw * 1.08);
      
      result[`wall_${height}ft` as keyof TileCalculationResult] = wallTilesWithWastage;
    });
  }

  // ============================================
  // STEP 7: Debug Logging
  // ============================================
  console.log('🧮 TILE CALCULATION COMPLETE:', {
    input: {
      room: `${roomWidth}' × ${roomDepth}' × ${roomHeight}'`,
      tile: `${tileWidthCm}cm × ${tileHeightCm}cm`,
      type: roomType
    },
    calculations: {
      tileAreaSqFt: tileAreaSqFt.toFixed(6),
      roomAreaSqFt: roomAreaSqFt.toFixed(2),
      perimeter: perimeter.toFixed(1)
    },
    results: {
      floor: result.floor,
      wall_5ft: result.wall_5ft,
      wall_8ft: result.wall_8ft,
      wall_11ft: result.wall_11ft
    }
  });

  return result;
}