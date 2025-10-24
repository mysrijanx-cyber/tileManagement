// src/utils/tileSizeCalculator.ts

export interface TileSize {
    width: number;  // cm
    height: number; // cm
  }
  
  export interface RoomDimensions {
    width: number;  // meters
    height: number; // meters
  }
  
  export interface TileCoverage {
    tilesNeeded: number;
    tilesX: number;
    tilesY: number;
    totalArea: number; // m²
    tileArea: number;  // m²
    wastagePercent: number;
    totalWithWastage: number;
    estimatedCost: number;
  }
  
  /**
   * Calculate how many tiles needed for a room
   */
  export const calculateTileCoverage = (
    roomSize: RoomDimensions,
    tileSize: TileSize,
    pricePerSqFt: number,
    wastagePercent: number = 10
  ): TileCoverage => {
    // Convert tile size from cm to m
    const tileSizeM = {
      width: tileSize.width / 100,
      height: tileSize.height / 100
    };
  
    // Calculate tiles needed in each direction
    const tilesX = Math.ceil(roomSize.width / tileSizeM.width);
    const tilesY = Math.ceil(roomSize.height / tileSizeM.height);
    
    // Total tiles needed
    const tilesNeeded = tilesX * tilesY;
    
    // Calculate with wastage
    const totalWithWastage = Math.ceil(tilesNeeded * (1 + wastagePercent / 100));
    
    // Calculate areas
    const totalArea = roomSize.width * roomSize.height;
    const tileArea = tileSizeM.width * tileSizeM.height;
    
    // Convert m² to sq.ft for price calculation (1 m² = 10.764 sq.ft)
    const totalAreaSqFt = totalArea * 10.764;
    const estimatedCost = totalAreaSqFt * pricePerSqFt;
  
    return {
      tilesNeeded,
      tilesX,
      tilesY,
      totalArea,
      tileArea,
      wastagePercent,
      totalWithWastage,
      estimatedCost: Math.round(estimatedCost)
    };
  };
  
  /**
   * Calculate texture repeat for Three.js
   */
  export const calculateTextureRepeat = (
    roomSize: RoomDimensions,
    tileSize: TileSize
  ): { x: number; y: number } => {
    const repeatX = (roomSize.width * 100) / tileSize.width;
    const repeatY = (roomSize.height * 100) / tileSize.height;
    
    return {
      x: Math.ceil(repeatX),
      y: Math.ceil(repeatY)
    };
  };
  
  /**
   * Get visual density description based on tile size
   */
  export const getTileDensity = (tileSize: TileSize): {
    level: number;
    label: string;
    description: string;
  } => {
    const area = (tileSize.width * tileSize.height) / 10000; // cm² to m²
    
    if (area < 0.12) {
      return {
        level: 5,
        label: 'Very Busy',
        description: 'Many small tiles, traditional look with lots of grout lines'
      };
    }
    
    if (area < 0.25) {
      return {
        level: 4,
        label: 'Busy',
        description: 'Medium-small tiles, classic appearance'
      };
    }
    
    if (area < 0.45) {
      return {
        level: 3,
        label: 'Balanced',
        description: 'Standard size, versatile and popular'
      };
    }
    
    if (area < 0.75) {
      return {
        level: 2,
        label: 'Spacious',
        description: 'Large tiles, modern and clean look'
      };
    }
    
    return {
      level: 1,
      label: 'Minimal',
      description: 'Extra large tiles, contemporary style with minimal grout'
    };
  };
  
  /**
   * Parse tile size from string (e.g., "60x60 cm")
   */
  export const parseTileSize = (sizeString: string): TileSize | null => {
    const match = sizeString.match(/(\d+)\s*[×x]\s*(\d+)/);
    
    if (!match) return null;
    
    return {
      width: parseInt(match[1]),
      height: parseInt(match[2])
    };
  };
  
  /**
   * Format tile size for display
   */
  export const formatTileSize = (tileSize: TileSize): string => {
    return `${tileSize.width}×${tileSize.height} cm`;
  };
  
  /**
   * Get recommended grout width for tile size
   */
  export const getRecommendedGroutWidth = (tileSize: TileSize): number => {
    const area = (tileSize.width * tileSize.height) / 10000;
    
    if (area < 0.12) return 3; // 3mm for small tiles
    if (area < 0.45) return 2; // 2mm for medium tiles
    return 1.5; // 1.5mm for large tiles
  };