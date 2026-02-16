// src/utils/dimensionHelpers.ts

export interface RoomDimensions {
  width: number;
  depth: number;
  height: number;
}

export interface DimensionData {
  dimensions: RoomDimensions;
  timestamp: number;
}

// Visual configs - NEVER change
export const VISUAL_CONFIGS = {
  drawing: { width: 12, depth: 14, height: 9 },
  kitchen: { width: 25, depth: 25, height: 11 },
  bathroom: { width: 8, depth: 10, height: 9 }
} as const;

/**
 * Get calculation dimensions (user-editable)
 * Falls back to visual config if not set
 */
// export const getCalculationDimensions = (roomType: string): RoomDimensions => {
//   try {
//     const key = `room_calc_dims_${roomType}`;
//     const stored = localStorage.getItem(key);
    
//     if (!stored) {
//       // First time - use visual config
//       const visual = VISUAL_CONFIGS[roomType as keyof typeof VISUAL_CONFIGS];
//       return visual || { width: 12, depth: 14, height: 9 };
//     }
    
//     const data: DimensionData = JSON.parse(stored);
    
//     // Check expiry (30 days)
//     const age = Date.now() - data.timestamp;
//     if (age > 30 * 24 * 60 * 60 * 1000) {
//       localStorage.removeItem(key);
//       const visual = VISUAL_CONFIGS[roomType as keyof typeof VISUAL_CONFIGS];
//       return visual || { width: 12, depth: 14, height: 9 };
//     }
    
//     return data.dimensions;
//   } catch (err) {
//     console.error('Error getting calculation dimensions:', err);
//     const visual = VISUAL_CONFIGS[roomType as keyof typeof VISUAL_CONFIGS];
//     return visual || { width: 12, depth: 14, height: 9 };
//   }
// }; 

export const getCalculationDimensions = (roomType: string): RoomDimensions => {
  try {
    const key = `room_calc_dims_${roomType}`;
    const stored = localStorage.getItem(key);
    
    // ✅ Log what we found
    console.log('📖 GET CALCULATION DIMENSIONS:', {
      roomType,
      key,
      hasStored: !!stored,
      storedValue: stored
    });
    
    if (!stored) {
      const visual = VISUAL_CONFIGS[roomType as keyof typeof VISUAL_CONFIGS];
      console.log('📖 No stored dims, using default visual config:', visual);
      return visual || { width: 12, depth: 14, height: 9 };
    }
    
    const data: DimensionData = JSON.parse(stored);
    
    // Check expiry (30 days)
    const age = Date.now() - data.timestamp;
    const ageInDays = age / (24 * 60 * 60 * 1000);
    
    console.log('📖 Stored data parsed:', {
      dimensions: data.dimensions,
      timestamp: new Date(data.timestamp).toLocaleString(),
      ageInDays: ageInDays.toFixed(2),
      expired: age > 30 * 24 * 60 * 60 * 1000
    });
    
    if (age > 30 * 24 * 60 * 60 * 1000) {
      console.log('⏰ Dimensions expired, removing and using default');
      localStorage.removeItem(key);
      const visual = VISUAL_CONFIGS[roomType as keyof typeof VISUAL_CONFIGS];
      return visual || { width: 12, depth: 14, height: 9 };
    }
    
    console.log('✅ Returning stored dimensions:', data.dimensions);
    return data.dimensions;
  } catch (err) {
    console.error('❌ Error getting calculation dimensions:', err);
    const visual = VISUAL_CONFIGS[roomType as keyof typeof VISUAL_CONFIGS];
    console.log('📖 Falling back to visual config:', visual);
    return visual || { width: 12, depth: 14, height: 9 };
  }
};

/**
 * Save calculation dimensions
 */
// export const saveCalculationDimensions = (
//   roomType: string, 
//   dimensions: RoomDimensions
// ): boolean => {
//   try {
//     const key = `room_calc_dims_${roomType}`;
//     const data: DimensionData = {
//       dimensions,
//       timestamp: Date.now()
//     };
    
//     localStorage.setItem(key, JSON.stringify(data));
//     console.log('✅ Calculation dimensions saved:', dimensions);
//     return true;
//   } catch (err) {
//     console.error('❌ Failed to save calculation dimensions:', err);
//     return false;
//   }
// };  

// export const saveCalculationDimensions = (
//   roomType: string, 
//   dimensions: RoomDimensions
// ): boolean => {
//   try {
//     const key = `room_calc_dims_${roomType}`;
//     const data: DimensionData = {
//       dimensions,
//       timestamp: Date.now()
//     };
    
//     const jsonString = JSON.stringify(data);
//     localStorage.setItem(key, jsonString);
    
//     // ✅ Enhanced logging
//     console.log('💾 SAVE CALCULATION DIMENSIONS:', {
//       roomType,
//       key,
//       dimensions,
//       timestamp: new Date(data.timestamp).toLocaleString(),
//       storedValue: jsonString,
//       verifyRead: localStorage.getItem(key) === jsonString ? '✅' : '❌'
//     });
    
//     return true;
//   } catch (err) {
//     console.error('❌ Failed to save calculation dimensions:', err);
//     return false;
//   }
// };

export const saveCalculationDimensions = (
  roomType: string, 
  dimensions: RoomDimensions
): boolean => {
  try {
    const key = `room_calc_dims_${roomType}`;
    const data: DimensionData = {
      dimensions,
      timestamp: Date.now()
    };
    
    const jsonString = JSON.stringify(data);
    localStorage.setItem(key, jsonString);
    
    // ✅ Enhanced logging with verification
    const verifyRead = localStorage.getItem(key);
    const verifyParsed = verifyRead ? JSON.parse(verifyRead) : null;
    
    console.log('💾 SAVE CALCULATION DIMENSIONS:', {
      roomType,
      key,
      dimensions,
      timestamp: new Date(data.timestamp).toLocaleString(),
      storedValue: jsonString,
      verifyRead: verifyRead === jsonString ? '✅ MATCH' : '❌ MISMATCH',
      verifyParsedDimensions: verifyParsed?.dimensions,
      matchesInput: JSON.stringify(verifyParsed?.dimensions) === JSON.stringify(dimensions) ? '✅' : '❌'
    });
    
    // ✅ Dispatch custom event for cross-component synchronization
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('calculationDimensionsUpdated', {
        detail: { roomType, dimensions }
      }));
      console.log('📡 Broadcasted dimension update event');
    }
    
    return true;
  } catch (err) {
    console.error('❌ Failed to save calculation dimensions:', err);
    return false;
  }
};



/**
 * Check if using custom calculation dimensions
 */
export const hasCustomCalculationDims = (roomType: string): boolean => {
  const visual = VISUAL_CONFIGS[roomType as keyof typeof VISUAL_CONFIGS];
  const calc = getCalculationDimensions(roomType);
  
  return (
    calc.width !== visual.width ||
    calc.depth !== visual.depth ||
    calc.height !== visual.height
  );
};

/**
 * Reset to visual dimensions
 */
export const resetCalculationDimensions = (roomType: string): void => {
  const key = `room_calc_dims_${roomType}`;
  localStorage.removeItem(key);
  console.log('🔄 Reset to visual dimensions');
};

/**
 * Scale pattern count from visual to calculation dimensions
 */
export const scalePatternCount = (
  visualCount: number,
  roomType: string
): number => {
  const visual = VISUAL_CONFIGS[roomType as keyof typeof VISUAL_CONFIGS];
  const calc = getCalculationDimensions(roomType);
  
  const visualArea = visual.width * visual.depth;
  const calcArea = calc.width * calc.depth;
  
  const ratio = calcArea / visualArea;
  const scaledCount = Math.round(visualCount * ratio);
  
  console.log('📊 Pattern scaled:', {
    visual: `${visual.width}×${visual.depth} = ${visualArea} sq ft`,
    calculation: `${calc.width}×${calc.depth} = ${calcArea} sq ft`,
    ratio: ratio.toFixed(2),
    originalCount: visualCount,
    scaledCount: scaledCount
  });
  
  return scaledCount;
};