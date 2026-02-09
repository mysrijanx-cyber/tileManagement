// // // src/components/TileCalculatorModal.tsx - NEW COMPONENT

// // import React, { useState, useEffect } from 'react';
// // import { X, Calculator, Ruler, Package, Info, TrendingUp } from 'lucide-react';

// // interface TileCalculatorModalProps {
// //   isOpen: boolean;
// //   onClose: () => void;
// //   tileName: string;
// //   tileSize: string; // e.g., "60x60 cm" or "30x45 cm"
// //   tileCategory: string; // 'floor', 'wall', or 'both'
// // }

// // interface CalculationResult {
// //   floorTiles: number;
// //   wallTiles_5ft: number;
// //   wallTiles_8ft: number;
// //   wallTiles_11ft: number;
// //   floorArea: number;
// //   wallArea: number;
// //   tileAreaSqFt: number;
// // }

// // export const TileCalculatorModal: React.FC<TileCalculatorModalProps> = ({
// //   isOpen,
// //   onClose,
// //   tileName,
// //   tileSize,
// //   tileCategory
// // }) => {
// //   const [width, setWidth] = useState<string>('12');
// //   const [depth, setDepth] = useState<string>('14');
// //   const [height, setHeight] = useState<string>('11');
// //   const [result, setResult] = useState<CalculationResult | null>(null);
// //   const [error, setError] = useState<string>('');

// //   // Parse tile size from string like "60x60 cm" or "30x45 cm"
// //   const parseTileSize = (sizeStr: string): { width: number; height: number } => {
// //     const cleanSize = sizeStr
// //       .toLowerCase()
// //       .replace(/\s*cm\s*/gi, '')
// //       .replace(/\s*ft\s*/gi, '')
// //       .replace(/\s+/g, '')
// //       .trim();

// //     const parts = cleanSize.split(/[x×X]/);
    
// //     if (parts.length === 2) {
// //       const w = parseFloat(parts[0]);
// //       const h = parseFloat(parts[1]);
      
// //       if (!isNaN(w) && !isNaN(h) && w > 0 && h > 0) {
// //         return { width: w, height: h };
// //       }
// //     }
    
// //     // Default fallback
// //     return tileCategory === 'wall' ? { width: 30, height: 45 } : { width: 60, height: 60 };
// //   };

// //   const calculateTiles = () => {
// //     const w = parseFloat(width);
// //     const d = parseFloat(depth);
// //     const h = parseFloat(height);

// //     if (isNaN(w) || isNaN(d) || isNaN(h) || w <= 0 || d <= 0 || h <= 0) {
// //       setError('Please enter valid positive numbers for all dimensions');
// //       setResult(null);
// //       return;
// //     }

// //     if (w > 100 || d > 100 || h > 50) {
// //       setError('Dimensions seem too large. Please check your input.');
// //       setResult(null);
// //       return;
// //     }

// //     setError('');

// //     const tileSizeParsed = parseTileSize(tileSize);
// //     const tileWidthFt = tileSizeParsed.width * 0.0328084; // cm to feet
// //     const tileHeightFt = tileSizeParsed.height * 0.0328084;
// //     const tileAreaSqFt = tileWidthFt * tileHeightFt;

// //     const wastageMultiplier = 1.08; // 8% wastage

// //     // Floor calculation
// //     const floorArea = w * d;
// //     const floorTilesRaw = Math.ceil(floorArea / tileAreaSqFt);
// //     const floorTiles = Math.ceil(floorTilesRaw * wastageMultiplier);

// //     // Wall calculation (all 4 walls)
// //     const perimeter = 2 * (w + d);
    
// //     const calculateWallTiles = (wallHeight: number) => {
// //       const tilesHorizontal = Math.ceil(perimeter / tileWidthFt);
// //       const tilesVertical = Math.ceil(wallHeight / tileHeightFt);
// //       const totalTiles = tilesHorizontal * tilesVertical;
// //       return Math.ceil(totalTiles * wastageMultiplier);
// //     };

// //     const wallTiles_5ft = calculateWallTiles(5);
// //     const wallTiles_8ft = calculateWallTiles(8);
// //     const wallTiles_11ft = calculateWallTiles(11);

// //     setResult({
// //       floorTiles,
// //       wallTiles_5ft,
// //       wallTiles_8ft,
// //       wallTiles_11ft,
// //       floorArea,
// //       wallArea: perimeter * h,
// //       tileAreaSqFt
// //     });

// //     console.log('🧮 Tile Calculation:', {
// //       roomSize: `${w}' × ${d}' × ${h}'`,
// //       tileSize: `${tileSizeParsed.width}×${tileSizeParsed.height} cm`,
// //       tileSizeFt: `${tileWidthFt.toFixed(3)} × ${tileHeightFt.toFixed(3)} ft`,
// //       tileAreaSqFt: tileAreaSqFt.toFixed(4),
// //       floorArea: floorArea.toFixed(2),
// //       floorTiles,
// //       wallTiles: { '5ft': wallTiles_5ft, '8ft': wallTiles_8ft, '11ft': wallTiles_11ft }
// //     });
// //   };

// //   useEffect(() => {
// //     if (isOpen) {
// //       setResult(null);
// //       setError('');
// //     }
// //   }, [isOpen]);

// //   if (!isOpen) return null;

// //   return (
// //     <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
// //       <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-slideUp">
        
// //         {/* Header */}
// //         <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 sm:p-6 rounded-t-2xl z-10">
// //           <div className="flex items-center justify-between mb-2">
// //             <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
// //               <Calculator className="w-6 h-6" />
// //               Tile Calculator
// //             </h2>
// //             <button
// //               onClick={onClose}
// //               className="p-2 hover:bg-white/20 rounded-lg transition-colors"
// //               aria-label="Close calculator"
// //             >
// //               <X className="w-5 h-5" />
// //             </button>
// //           </div>
// //           <p className="text-white/90 text-sm">
// //             Calculate exact tile count for your room
// //           </p>
// //         </div>

// //         <div className="p-4 sm:p-6 space-y-6">
          
// //           {/* Tile Info */}
// //           <div className="bg-blue-50 rounded-xl p-4 border-2 border-blue-200">
// //             <div className="flex items-center gap-2 mb-2">
// //               <Package className="w-5 h-5 text-blue-600" />
// //               <h3 className="font-bold text-gray-900">Selected Tile</h3>
// //             </div>
// //             <p className="text-gray-700 font-semibold">{tileName}</p>
// //             <div className="mt-2 flex flex-wrap gap-2">
// //               <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
// //                 📏 {tileSize}
// //               </span>
// //               <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-medium capitalize">
// //                 {tileCategory}
// //               </span>
// //             </div>
// //           </div>

// //           {/* Room Dimensions Input */}
// //           <div className="bg-gray-50 rounded-xl p-4 border-2 border-gray-200">
// //             <div className="flex items-center gap-2 mb-4">
// //               <Ruler className="w-5 h-5 text-purple-600" />
// //               <h3 className="font-bold text-gray-900">Room Dimensions (in feet)</h3>
// //             </div>

// //             <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
// //               <div>
// //                 <label className="block text-sm font-medium text-gray-700 mb-2">
// //                   Width (ft)
// //                 </label>
// //                 <input
// //                   type="number"
// //                   value={width}
// //                   onChange={(e) => setWidth(e.target.value)}
// //                   className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg font-semibold"
// //                   placeholder="12"
// //                   min="1"
// //                   max="100"
// //                   step="0.5"
// //                 />
// //               </div>

// //               <div>
// //                 <label className="block text-sm font-medium text-gray-700 mb-2">
// //                   Depth (ft)
// //                 </label>
// //                 <input
// //                   type="number"
// //                   value={depth}
// //                   onChange={(e) => setDepth(e.target.value)}
// //                   className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg font-semibold"
// //                   placeholder="14"
// //                   min="1"
// //                   max="100"
// //                   step="0.5"
// //                 />
// //               </div>

// //               <div>
// //                 <label className="block text-sm font-medium text-gray-700 mb-2">
// //                   Height (ft)
// //                 </label>
// //                 <input
// //                   type="number"
// //                   value={height}
// //                   onChange={(e) => setHeight(e.target.value)}
// //                   className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg font-semibold"
// //                   placeholder="11"
// //                   min="1"
// //                   max="50"
// //                   step="0.5"
// //                 />
// //               </div>
// //             </div>

// //             {error && (
// //               <div className="mt-4 bg-red-50 border-2 border-red-200 rounded-lg p-3 flex items-start gap-2">
// //                 <Info className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
// //                 <p className="text-red-700 text-sm font-medium">{error}</p>
// //               </div>
// //             )}

// //             <button
// //               onClick={calculateTiles}
// //               className="mt-4 w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-bold text-lg hover:shadow-lg transition-all flex items-center justify-center gap-2"
// //             >
// //               <Calculator className="w-5 h-5" />
// //               Calculate Tiles
// //             </button>
// //           </div>

// //           {/* Results */}
// //           {result && (
// //             <div className="space-y-4 animate-slideUp">
              
// //               {/* Floor Tiles */}
// //               <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border-2 border-green-300">
// //                 <div className="flex items-center justify-between mb-3">
// //                   <h3 className="font-bold text-gray-900 flex items-center gap-2">
// //                     <Package className="w-5 h-5 text-green-600" />
// //                     🟫 Floor Tiles
// //                   </h3>
// //                   <span className="bg-green-600 text-white px-4 py-2 rounded-full text-2xl font-bold">
// //                     {result.floorTiles}
// //                   </span>
// //                 </div>

// //                 <div className="bg-white/60 rounded-lg p-3 space-y-1 text-sm">
// //                   <p className="text-gray-700">
// //                     📐 Room Area: <strong>{result.floorArea.toFixed(2)} sq ft</strong>
// //                   </p>
// //                   <p className="text-gray-700">
// //                     🔲 Per Tile: <strong>{result.tileAreaSqFt.toFixed(4)} sq ft</strong>
// //                   </p>
// //                   <p className="text-gray-700">
// //                     📏 Tile Size: <strong>{tileSize}</strong>
// //                   </p>
// //                   <div className="border-t border-green-200 pt-2 mt-2">
// //                     <p className="text-green-700 font-bold flex items-center gap-1">
// //                       <TrendingUp className="w-4 h-4" />
// //                       Total: {result.floorTiles} tiles (includes 8% wastage)
// //                     </p>
// //                   </div>
// //                 </div>
// //               </div>

// //               {/* Wall Tiles */}
// //               {(tileCategory === 'wall' || tileCategory === 'both') && (
// //                 <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 border-2 border-purple-300">
// //                   <div className="flex items-center justify-between mb-3">
// //                     <h3 className="font-bold text-gray-900 flex items-center gap-2">
// //                       <Package className="w-5 h-5 text-purple-600" />
// //                       🧱 Wall Tiles (All 4 Walls)
// //                     </h3>
// //                   </div>

// //                   <div className="space-y-3">
// //                     {/* 5 Feet */}
// //                     <div className="bg-white/60 rounded-lg p-3 border-2 border-yellow-300">
// //                       <div className="flex items-center justify-between mb-2">
// //                         <div>
// //                           <p className="font-bold text-gray-900">5 Feet Height</p>
// //                           <p className="text-xs text-gray-600">Waist height</p>
// //                         </div>
// //                         <span className="bg-yellow-600 text-white px-3 py-1 rounded-full text-lg font-bold">
// //                           {result.wallTiles_5ft}
// //                         </span>
// //                       </div>
// //                       <p className="text-xs text-gray-700">
// //                         Perimeter: {(2 * (parseFloat(width) + parseFloat(depth))).toFixed(1)} ft × 5 ft
// //                       </p>
// //                     </div>

// //                     {/* 8 Feet */}
// //                     <div className="bg-white/60 rounded-lg p-3 border-2 border-orange-300">
// //                       <div className="flex items-center justify-between mb-2">
// //                         <div>
// //                           <p className="font-bold text-gray-900">8 Feet Height</p>
// //                           <p className="text-xs text-gray-600">Standard bathroom</p>
// //                         </div>
// //                         <span className="bg-orange-600 text-white px-3 py-1 rounded-full text-lg font-bold">
// //                           {result.wallTiles_8ft}
// //                         </span>
// //                       </div>
// //                       <p className="text-xs text-gray-700">
// //                         Perimeter: {(2 * (parseFloat(width) + parseFloat(depth))).toFixed(1)} ft × 8 ft
// //                       </p>
// //                     </div>

// //                     {/* 11 Feet */}
// //                     <div className="bg-white/60 rounded-lg p-3 border-2 border-red-300">
// //                       <div className="flex items-center justify-between mb-2">
// //                         <div>
// //                           <p className="font-bold text-gray-900">11 Feet Height</p>
// //                           <p className="text-xs text-gray-600">Full wall coverage</p>
// //                         </div>
// //                         <span className="bg-red-600 text-white px-3 py-1 rounded-full text-lg font-bold">
// //                           {result.wallTiles_11ft}
// //                         </span>
// //                       </div>
// //                       <p className="text-xs text-gray-700">
// //                         Perimeter: {(2 * (parseFloat(width) + parseFloat(depth))).toFixed(1)} ft × 11 ft
// //                       </p>
// //                     </div>
// //                   </div>

// //                   <div className="mt-3 bg-white/60 rounded-lg p-3">
// //                     <p className="text-sm text-purple-700 font-bold">
// //                       ℹ️ Wall tiles calculated for all 4 walls with 8% wastage
// //                     </p>
// //                   </div>
// //                 </div>
// //               )}

// //               {/* Info Box */}
// //               <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
// //                 <div className="flex items-start gap-2">
// //                   <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
// //                   <div className="text-sm text-blue-800">
// //                     <p className="font-semibold mb-1">Calculation Details:</p>
// //                     <ul className="space-y-1 text-xs">
// //                       <li>✓ Exact tile size: <strong>{tileSize}</strong></li>
// //                       <li>✓ Room: <strong>{width}' × {depth}' × {height}'</strong></li>
// //                       <li>✓ Floor area: <strong>{result.floorArea.toFixed(2)} sq ft</strong></li>
// //                       <li>✓ Automatic 8% wastage included</li>
// //                       <li>✓ Wall tiles for all 4 walls</li>
// //                     </ul>
// //                   </div>
// //                 </div>
// //               </div>

// //             </div>
// //           )}

// //         </div>

// //         {/* Footer */}
// //         <div className="sticky bottom-0 bg-gray-100 px-4 sm:px-6 py-4 rounded-b-2xl border-t border-gray-200">
// //           <button
// //             onClick={onClose}
// //             className="w-full bg-gray-600 text-white py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
// //           >
// //             Close Calculator
// //           </button>
// //         </div>

// //       </div>

// //       <style>{`
// //         @keyframes fadeIn {
// //           from { opacity: 0; }
// //           to { opacity: 1; }
// //         }
// //         @keyframes slideUp {
// //           from { 
// //             opacity: 0;
// //             transform: translateY(20px);
// //           }
// //           to { 
// //             opacity: 1;
// //             transform: translateY(0);
// //           }
// //         }
// //         .animate-fadeIn {
// //           animation: fadeIn 0.2s ease-out;
// //         }
// //         .animate-slideUp {
// //           animation: slideUp 0.3s ease-out;
// //         }
// //       `}</style>
// //     </div>
// //   );
// // }; 
// // src/components/TileCalculatorModal.tsx - CORRECTED WALL CALCULATION

// import React, { useState, useEffect } from 'react';
// import { X, Calculator, Ruler, Package, Info, TrendingUp, AlertCircle } from 'lucide-react';

// interface TileCalculatorModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   tileName: string;
//   tileSize: string;
//   tileCategory: string;
// }

// interface WallCalculation {
//   backWall: { horizontal: number; vertical: number; total: number };
//   frontWall: { horizontal: number; vertical: number; total: number };
//   leftWall: { horizontal: number; vertical: number; total: number };
//   rightWall: { horizontal: number; vertical: number; total: number };
//   grandTotal: number;
//   withWastage: number;
// }

// interface CalculationResult {
//   floorTiles: number;
//   wall_5ft: WallCalculation;
//   wall_8ft: WallCalculation;
//   wall_11ft: WallCalculation;
//   floorArea: number;
//   tileWidthCm: number;
//   tileHeightCm: number;
//   tileWidthFt: number;
//   tileHeightFt: number;
//   tileAreaSqFt: number;
// }

// export const TileCalculatorModal: React.FC<TileCalculatorModalProps> = ({
//   isOpen,
//   onClose,
//   tileName,
//   tileSize,
//   tileCategory
// }) => {
//   const [width, setWidth] = useState<string>('12');
//   const [depth, setDepth] = useState<string>('14');
//   const [height, setHeight] = useState<string>('11');
//   const [result, setResult] = useState<CalculationResult | null>(null);
//   const [error, setError] = useState<string>('');
//   const [showDetailedBreakdown, setShowDetailedBreakdown] = useState(false);

//   // ✅ CORRECTED: Parse tile size
//   const parseTileSize = (sizeStr: string): { width: number; height: number } => {
//     const cleanSize = sizeStr
//       .toLowerCase()
//       .replace(/\s*cm\s*/gi, '')
//       .replace(/\s*ft\s*/gi, '')
//       .replace(/\s+/g, '')
//       .trim();

//     const parts = cleanSize.split(/[x×X]/);
    
//     if (parts.length === 2) {
//       const w = parseFloat(parts[0]);
//       const h = parseFloat(parts[1]);
      
//       if (!isNaN(w) && !isNaN(h) && w > 0 && h > 0) {
//         return { width: w, height: h };
//       }
//     }
    
//     return tileCategory === 'wall' ? { width: 30, height: 45 } : { width: 60, height: 60 };
//   };

//   // ✅ CORRECTED: Calculate wall tiles for each wall separately
//   const calculateWallTilesDetailed = (
//     roomWidth: number, 
//     roomDepth: number, 
//     wallHeight: number,
//     tileWidthFt: number,
//     tileHeightFt: number
//   ): WallCalculation => {
    
//     const wastageMultiplier = 1.08;
    
//     // Back wall (width)
//     const backWallTilesH = Math.ceil(roomWidth / tileWidthFt);
//     const backWallTilesV = Math.ceil(wallHeight / tileHeightFt);
//     const backWallTotal = backWallTilesH * backWallTilesV;
    
//     // Front wall (width)
//     const frontWallTilesH = Math.ceil(roomWidth / tileWidthFt);
//     const frontWallTilesV = Math.ceil(wallHeight / tileHeightFt);
//     const frontWallTotal = frontWallTilesH * frontWallTilesV;
    
//     // Left wall (depth)
//     const leftWallTilesH = Math.ceil(roomDepth / tileWidthFt);
//     const leftWallTilesV = Math.ceil(wallHeight / tileHeightFt);
//     const leftWallTotal = leftWallTilesH * leftWallTilesV;
    
//     // Right wall (depth)
//     const rightWallTilesH = Math.ceil(roomDepth / tileWidthFt);
//     const rightWallTilesV = Math.ceil(wallHeight / tileHeightFt);
//     const rightWallTotal = rightWallTilesH * rightWallTilesV;
    
//     const grandTotal = backWallTotal + frontWallTotal + leftWallTotal + rightWallTotal;
//     const withWastage = Math.ceil(grandTotal * wastageMultiplier);
    
//     console.log(`🧱 WALL ${wallHeight}FT BREAKDOWN:`, {
//       back: `${backWallTilesH}H × ${backWallTilesV}V = ${backWallTotal}`,
//       front: `${frontWallTilesH}H × ${frontWallTilesV}V = ${frontWallTotal}`,
//       left: `${leftWallTilesH}H × ${leftWallTilesV}V = ${leftWallTotal}`,
//       right: `${rightWallTilesH}H × ${rightWallTilesV}V = ${rightWallTotal}`,
//       total: grandTotal,
//       withWastage: withWastage
//     });
    
//     return {
//       backWall: { 
//         horizontal: backWallTilesH, 
//         vertical: backWallTilesV, 
//         total: backWallTotal 
//       },
//       frontWall: { 
//         horizontal: frontWallTilesH, 
//         vertical: frontWallTilesV, 
//         total: frontWallTotal 
//       },
//       leftWall: { 
//         horizontal: leftWallTilesH, 
//         vertical: leftWallTilesV, 
//         total: leftWallTotal 
//       },
//       rightWall: { 
//         horizontal: rightWallTilesH, 
//         vertical: rightWallTilesV, 
//         total: rightWallTotal 
//       },
//       grandTotal: grandTotal,
//       withWastage: withWastage
//     };
//   };

//   const calculateTiles = () => {
//     const w = parseFloat(width);
//     const d = parseFloat(depth);
//     const h = parseFloat(height);

//     if (isNaN(w) || isNaN(d) || isNaN(h) || w <= 0 || d <= 0 || h <= 0) {
//       setError('Please enter valid positive numbers for all dimensions');
//       setResult(null);
//       return;
//     }

//     if (w > 100 || d > 100 || h > 50) {
//       setError('Dimensions seem too large. Please check your input.');
//       setResult(null);
//       return;
//     }

//     setError('');

//     const tileSizeParsed = parseTileSize(tileSize);
//     const tileWidthFt = tileSizeParsed.width * 0.0328084; // cm to feet
//     const tileHeightFt = tileSizeParsed.height * 0.0328084;
//     const tileAreaSqFt = tileWidthFt * tileHeightFt;

//     const wastageMultiplier = 1.08;

//     // ✅ FLOOR CALCULATION (remains same)
//     const floorArea = w * d;
//     const floorTilesRaw = Math.ceil(floorArea / tileAreaSqFt);
//     const floorTiles = Math.ceil(floorTilesRaw * wastageMultiplier);

//     console.log('🟫 FLOOR CALCULATION:', {
//       roomSize: `${w}' × ${d}'`,
//       floorArea: `${floorArea.toFixed(2)} sq ft`,
//       tileSize: `${tileSizeParsed.width}×${tileSizeParsed.height} cm`,
//       tileSizeFt: `${tileWidthFt.toFixed(4)} × ${tileHeightFt.toFixed(4)} ft`,
//       tileAreaSqFt: tileAreaSqFt.toFixed(6),
//       tilesNeeded: floorTilesRaw,
//       withWastage: floorTiles
//     });

//     // ✅ CORRECTED: Wall calculations for each height separately
//     const wall_5ft = calculateWallTilesDetailed(w, d, 5, tileWidthFt, tileHeightFt);
//     const wall_8ft = calculateWallTilesDetailed(w, d, 8, tileWidthFt, tileHeightFt);
//     const wall_11ft = calculateWallTilesDetailed(w, d, 11, tileWidthFt, tileHeightFt);

//     setResult({
//       floorTiles,
//       wall_5ft,
//       wall_8ft,
//       wall_11ft,
//       floorArea,
//       tileWidthCm: tileSizeParsed.width,
//       tileHeightCm: tileSizeParsed.height,
//       tileWidthFt,
//       tileHeightFt,
//       tileAreaSqFt
//     });

//     console.log('✅ CALCULATION COMPLETE:', {
//       floor: floorTiles,
//       wall_5ft: wall_5ft.withWastage,
//       wall_8ft: wall_8ft.withWastage,
//       wall_11ft: wall_11ft.withWastage
//     });
//   };

//   useEffect(() => {
//     if (isOpen) {
//       setResult(null);
//       setError('');
//       setShowDetailedBreakdown(false);
//     }
//   }, [isOpen]);

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
//       <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-slideUp">
        
//         {/* Header */}
//         <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 sm:p-6 rounded-t-2xl z-10">
//           <div className="flex items-center justify-between mb-2">
//             <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
//               <Calculator className="w-6 h-6" />
//               Tile Calculator
//             </h2>
//             <button
//               onClick={onClose}
//               className="p-2 hover:bg-white/20 rounded-lg transition-colors"
//               aria-label="Close calculator"
//             >
//               <X className="w-5 h-5" />
//             </button>
//           </div>
//           <p className="text-white/90 text-sm">
//             Calculate exact tile count for your room (all 4 walls)
//           </p>
//         </div>

//         <div className="p-4 sm:p-6 space-y-6">
          
//           {/* Tile Info */}
//           <div className="bg-blue-50 rounded-xl p-4 border-2 border-blue-200">
//             <div className="flex items-center gap-2 mb-2">
//               <Package className="w-5 h-5 text-blue-600" />
//               <h3 className="font-bold text-gray-900">Selected Tile</h3>
//             </div>
//             <p className="text-gray-700 font-semibold">{tileName}</p>
//             <div className="mt-2 flex flex-wrap gap-2">
//               <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
//                 📏 {tileSize}
//               </span>
//               <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-medium capitalize">
//                 {tileCategory}
//               </span>
//             </div>
//           </div>

//           {/* Room Dimensions Input */}
//           <div className="bg-gray-50 rounded-xl p-4 border-2 border-gray-200">
//             <div className="flex items-center gap-2 mb-4">
//               <Ruler className="w-5 h-5 text-purple-600" />
//               <h3 className="font-bold text-gray-900">Room Dimensions (in feet)</h3>
//             </div>

//             <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Width (ft)
//                 </label>
//                 <input
//                   type="number"
//                   value={width}
//                   onChange={(e) => setWidth(e.target.value)}
//                   className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg font-semibold"
//                   placeholder="12"
//                   min="1"
//                   max="100"
//                   step="0.5"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Depth (ft)
//                 </label>
//                 <input
//                   type="number"
//                   value={depth}
//                   onChange={(e) => setDepth(e.target.value)}
//                   className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg font-semibold"
//                   placeholder="14"
//                   min="1"
//                   max="100"
//                   step="0.5"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Height (ft)
//                 </label>
//                 <input
//                   type="number"
//                   value={height}
//                   onChange={(e) => setHeight(e.target.value)}
//                   className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg font-semibold"
//                   placeholder="11"
//                   min="1"
//                   max="50"
//                   step="0.5"
//                 />
//               </div>
//             </div>

//             {error && (
//               <div className="mt-4 bg-red-50 border-2 border-red-200 rounded-lg p-3 flex items-start gap-2">
//                 <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
//                 <p className="text-red-700 text-sm font-medium">{error}</p>
//               </div>
//             )}

//             <button
//               onClick={calculateTiles}
//               className="mt-4 w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-bold text-lg hover:shadow-lg transition-all flex items-center justify-center gap-2"
//             >
//               <Calculator className="w-5 h-5" />
//               Calculate Tiles
//             </button>
//           </div>

//           {/* Results */}
//           {result && (
//             <div className="space-y-4 animate-slideUp">
              
//               {/* Floor Tiles */}
//               <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border-2 border-green-300">
//                 <div className="flex items-center justify-between mb-3">
//                   <h3 className="font-bold text-gray-900 flex items-center gap-2">
//                     <Package className="w-5 h-5 text-green-600" />
//                     🟫 Floor Tiles
//                   </h3>
//                   <span className="bg-green-600 text-white px-4 py-2 rounded-full text-2xl font-bold">
//                     {result.floorTiles}
//                   </span>
//                 </div>

//                 <div className="bg-white/60 rounded-lg p-3 space-y-1 text-sm">
//                   <p className="text-gray-700">
//                     📐 Room: <strong>{width}' × {depth}'</strong>
//                   </p>
//                   <p className="text-gray-700">
//                     📦 Floor Area: <strong>{result.floorArea.toFixed(2)} sq ft</strong>
//                   </p>
//                   <p className="text-gray-700">
//                     📏 Tile Size: <strong>{result.tileWidthCm}×{result.tileHeightCm} cm</strong> = <strong>{result.tileWidthFt.toFixed(4)} × {result.tileHeightFt.toFixed(4)} ft</strong>
//                   </p>
//                   <p className="text-gray-700">
//                     🔲 Per Tile Area: <strong>{result.tileAreaSqFt.toFixed(6)} sq ft</strong>
//                   </p>
//                   <div className="border-t border-green-200 pt-2 mt-2">
//                     <p className="text-green-700 font-bold flex items-center gap-1">
//                       <TrendingUp className="w-4 h-4" />
//                       Total: {result.floorTiles} tiles (includes 8% wastage)
//                     </p>
//                   </div>
//                 </div>
//               </div>

//               {/* Wall Tiles */}
//               {(tileCategory === 'wall' || tileCategory === 'both') && (
//                 <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 border-2 border-purple-300">
//                   <div className="flex items-center justify-between mb-3">
//                     <h3 className="font-bold text-gray-900 flex items-center gap-2">
//                       <Package className="w-5 h-5 text-purple-600" />
//                       🧱 Wall Tiles (All 4 Walls)
//                     </h3>
//                     <button
//                       onClick={() => setShowDetailedBreakdown(!showDetailedBreakdown)}
//                       className="text-xs bg-purple-600 text-white px-3 py-1 rounded-full hover:bg-purple-700 transition-colors"
//                     >
//                       {showDetailedBreakdown ? 'Hide Details' : 'Show Details'}
//                     </button>
//                   </div>

//                   <div className="space-y-3">
//                     {/* 5 Feet */}
//                     <div className="bg-white/60 rounded-lg p-3 border-2 border-yellow-300">
//                       <div className="flex items-center justify-between mb-2">
//                         <div>
//                           <p className="font-bold text-gray-900">5 Feet Height</p>
//                           <p className="text-xs text-gray-600">Waist height</p>
//                         </div>
//                         <span className="bg-yellow-600 text-white px-3 py-1 rounded-full text-lg font-bold">
//                           {result.wall_5ft.withWastage}
//                         </span>
//                       </div>
                      
//                       {showDetailedBreakdown && (
//                         <div className="mt-3 space-y-1 text-xs bg-yellow-50 rounded p-2">
//                           <p className="font-semibold text-yellow-800 mb-1">Per Wall Breakdown:</p>
//                           <p className="text-gray-700">• Back Wall ({width}'): <strong>{result.wall_5ft.backWall.horizontal}H × {result.wall_5ft.backWall.vertical}V = {result.wall_5ft.backWall.total} tiles</strong></p>
//                           <p className="text-gray-700">• Front Wall ({width}'): <strong>{result.wall_5ft.frontWall.horizontal}H × {result.wall_5ft.frontWall.vertical}V = {result.wall_5ft.frontWall.total} tiles</strong></p>
//                           <p className="text-gray-700">• Left Wall ({depth}'): <strong>{result.wall_5ft.leftWall.horizontal}H × {result.wall_5ft.leftWall.vertical}V = {result.wall_5ft.leftWall.total} tiles</strong></p>
//                           <p className="text-gray-700">• Right Wall ({depth}'): <strong>{result.wall_5ft.rightWall.horizontal}H × {result.wall_5ft.rightWall.vertical}V = {result.wall_5ft.rightWall.total} tiles</strong></p>
//                           <div className="border-t border-yellow-300 pt-1 mt-1">
//                             <p className="text-yellow-800 font-bold">Subtotal: {result.wall_5ft.grandTotal} tiles</p>
//                             <p className="text-yellow-800 font-bold">With 8% wastage: {result.wall_5ft.withWastage} tiles</p>
//                           </div>
//                         </div>
//                       )}
                      
//                       {!showDetailedBreakdown && (
//                         <p className="text-xs text-gray-700 mt-2">
//                           Perimeter: {(2 * (parseFloat(width) + parseFloat(depth))).toFixed(1)} ft × 5 ft | Base: {result.wall_5ft.grandTotal} + 8% = {result.wall_5ft.withWastage}
//                         </p>
//                       )}
//                     </div>

//                     {/* 8 Feet */}
//                     <div className="bg-white/60 rounded-lg p-3 border-2 border-orange-300">
//                       <div className="flex items-center justify-between mb-2">
//                         <div>
//                           <p className="font-bold text-gray-900">8 Feet Height</p>
//                           <p className="text-xs text-gray-600">Standard bathroom</p>
//                         </div>
//                         <span className="bg-orange-600 text-white px-3 py-1 rounded-full text-lg font-bold">
//                           {result.wall_8ft.withWastage}
//                         </span>
//                       </div>
                      
//                       {showDetailedBreakdown && (
//                         <div className="mt-3 space-y-1 text-xs bg-orange-50 rounded p-2">
//                           <p className="font-semibold text-orange-800 mb-1">Per Wall Breakdown:</p>
//                           <p className="text-gray-700">• Back Wall ({width}'): <strong>{result.wall_8ft.backWall.horizontal}H × {result.wall_8ft.backWall.vertical}V = {result.wall_8ft.backWall.total} tiles</strong></p>
//                           <p className="text-gray-700">• Front Wall ({width}'): <strong>{result.wall_8ft.frontWall.horizontal}H × {result.wall_8ft.frontWall.vertical}V = {result.wall_8ft.frontWall.total} tiles</strong></p>
//                           <p className="text-gray-700">• Left Wall ({depth}'): <strong>{result.wall_8ft.leftWall.horizontal}H × {result.wall_8ft.leftWall.vertical}V = {result.wall_8ft.leftWall.total} tiles</strong></p>
//                           <p className="text-gray-700">• Right Wall ({depth}'): <strong>{result.wall_8ft.rightWall.horizontal}H × {result.wall_8ft.rightWall.vertical}V = {result.wall_8ft.rightWall.total} tiles</strong></p>
//                           <div className="border-t border-orange-300 pt-1 mt-1">
//                             <p className="text-orange-800 font-bold">Subtotal: {result.wall_8ft.grandTotal} tiles</p>
//                             <p className="text-orange-800 font-bold">With 8% wastage: {result.wall_8ft.withWastage} tiles</p>
//                           </div>
//                         </div>
//                       )}
                      
//                       {!showDetailedBreakdown && (
//                         <p className="text-xs text-gray-700 mt-2">
//                           Perimeter: {(2 * (parseFloat(width) + parseFloat(depth))).toFixed(1)} ft × 8 ft | Base: {result.wall_8ft.grandTotal} + 8% = {result.wall_8ft.withWastage}
//                         </p>
//                       )}
//                     </div>

//                     {/* 11 Feet */}
//                     <div className="bg-white/60 rounded-lg p-3 border-2 border-red-300">
//                       <div className="flex items-center justify-between mb-2">
//                         <div>
//                           <p className="font-bold text-gray-900">11 Feet Height</p>
//                           <p className="text-xs text-gray-600">Full wall coverage</p>
//                         </div>
//                         <span className="bg-red-600 text-white px-3 py-1 rounded-full text-lg font-bold">
//                           {result.wall_11ft.withWastage}
//                         </span>
//                       </div>
                      
//                       {showDetailedBreakdown && (
//                         <div className="mt-3 space-y-1 text-xs bg-red-50 rounded p-2">
//                           <p className="font-semibold text-red-800 mb-1">Per Wall Breakdown:</p>
//                           <p className="text-gray-700">• Back Wall ({width}'): <strong>{result.wall_11ft.backWall.horizontal}H × {result.wall_11ft.backWall.vertical}V = {result.wall_11ft.backWall.total} tiles</strong></p>
//                           <p className="text-gray-700">• Front Wall ({width}'): <strong>{result.wall_11ft.frontWall.horizontal}H × {result.wall_11ft.frontWall.vertical}V = {result.wall_11ft.frontWall.total} tiles</strong></p>
//                           <p className="text-gray-700">• Left Wall ({depth}'): <strong>{result.wall_11ft.leftWall.horizontal}H × {result.wall_11ft.leftWall.vertical}V = {result.wall_11ft.leftWall.total} tiles</strong></p>
//                           <p className="text-gray-700">• Right Wall ({depth}'): <strong>{result.wall_11ft.rightWall.horizontal}H × {result.wall_11ft.rightWall.vertical}V = {result.wall_11ft.rightWall.total} tiles</strong></p>
//                           <div className="border-t border-red-300 pt-1 mt-1">
//                             <p className="text-red-800 font-bold">Subtotal: {result.wall_11ft.grandTotal} tiles</p>
//                             <p className="text-red-800 font-bold">With 8% wastage: {result.wall_11ft.withWastage} tiles</p>
//                           </div>
//                         </div>
//                       )}
                      
//                       {!showDetailedBreakdown && (
//                         <p className="text-xs text-gray-700 mt-2">
//                           Perimeter: {(2 * (parseFloat(width) + parseFloat(depth))).toFixed(1)} ft × 11 ft | Base: {result.wall_11ft.grandTotal} + 8% = {result.wall_11ft.withWastage}
//                         </p>
//                       )}
//                     </div>
//                   </div>

//                   <div className="mt-3 bg-white/60 rounded-lg p-3">
//                     <p className="text-sm text-purple-700 font-bold">
//                       ℹ️ All 4 walls calculated separately, then summed with 8% wastage
//                     </p>
//                   </div>
//                 </div>
//               )}

//               {/* Info Box */}
//               <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
//                 <div className="flex items-start gap-2">
//                   <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
//                   <div className="text-sm text-blue-800">
//                     <p className="font-semibold mb-1">✅ Exact Calculation Method:</p>
//                     <ul className="space-y-1 text-xs">
//                       <li>✓ Tile size: <strong>{result.tileWidthCm}×{result.tileHeightCm} cm</strong></li>
//                       <li>✓ Room: <strong>{width}' × {depth}' × {height}'</strong></li>
//                       <li>✓ Each wall calculated separately</li>
//                       <li>✓ Back + Front walls use Width ({width}')</li>
//                       <li>✓ Left + Right walls use Depth ({depth}')</li>
//                       <li>✓ Different heights = Different vertical tile counts</li>
//                       <li>✓ Automatic 8% wastage included</li>
//                     </ul>
//                   </div>
//                 </div>
//               </div>

//             </div>
//           )}

//         </div>

//         {/* Footer */}
//         <div className="sticky bottom-0 bg-gray-100 px-4 sm:px-6 py-4 rounded-b-2xl border-t border-gray-200">
//           <button
//             onClick={onClose}
//             className="w-full bg-gray-600 text-white py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
//           >
//             Close Calculator
//           </button>
//         </div>

//       </div>

//       <style>{`
//         @keyframes fadeIn {
//           from { opacity: 0; }
//           to { opacity: 1; }
//         }
//         @keyframes slideUp {
//           from { 
//             opacity: 0;
//             transform: translateY(20px);
//           }
//           to { 
//             opacity: 1;
//             transform: translateY(0);
//           }
//         }
//         .animate-fadeIn {
//           animation: fadeIn 0.2s ease-out;
//         }
//         .animate-slideUp {
//           animation: slideUp 0.3s ease-out;
//         }
//       `}</style>
//     </div>
//   );
// }; 
// src/components/TileCalculatorModal.tsx - CORRECTED WALL CALCULATION

import React, { useState, useEffect } from 'react';
import { X, Calculator, Ruler, Package, Info, TrendingUp, AlertCircle } from 'lucide-react';

interface TileCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  tileName: string;
  tileSize: string;
  tileCategory: string;
  roomType?: 'kitchen' | 'bathroom' | 'all'; // ✅ NEW
}

interface CalculationResult {
  floorTiles: number;
  wall_5ft: number;
  wall_8ft: number;
  wall_11ft: number;
  floorArea: number;
  wallArea_5ft: number;
  wallArea_8ft: number;
  wallArea_11ft: number;
  perimeter: number;
  tileWidthCm: number;
  tileHeightCm: number;
  tileWidthFt: number;
  tileHeightFt: number;
  tileAreaSqFt: number;
  wallsCalculated: string; // 'back only' or 'all 4 walls'
}

export const TileCalculatorModal: React.FC<TileCalculatorModalProps> = ({
  isOpen,
  onClose,
  tileName,
  tileSize,
  tileCategory,
  roomType = 'all'
}) => {
  const [width, setWidth] = useState<string>('12');
  const [depth, setDepth] = useState<string>('14');
  const [height, setHeight] = useState<string>('11');
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [error, setError] = useState<string>('');
  const [calculationMode, setCalculationMode] = useState<'all' | 'back'>('all');

  // ✅ Parse tile size
  const parseTileSize = (sizeStr: string): { width: number; height: number } => {
    const cleanSize = sizeStr
      .toLowerCase()
      .replace(/\s*cm\s*/gi, '')
      .replace(/\s*ft\s*/gi, '')
      .replace(/\s+/g, '')
      .trim();

    const parts = cleanSize.split(/[x×X]/);
    
    if (parts.length === 2) {
      const w = parseFloat(parts[0]);
      const h = parseFloat(parts[1]);
      
      if (!isNaN(w) && !isNaN(h) && w > 0 && h > 0) {
        return { width: w, height: h };
      }
    }
    
    return tileCategory === 'wall' ? { width: 30, height: 45 } : { width: 60, height: 60 };
  };

  // ✅ CORRECTED: Calculate wall tiles using AREA method (most accurate)
  const calculateWallTiles = (
    roomWidth: number,
    roomDepth: number,
    wallHeight: number,
    tileWidthFt: number,
    tileHeightFt: number,
    mode: 'all' | 'back'
  ): { tiles: number; wallArea: number; perimeter: number } => {
    
    const wastageMultiplier = 1.08;
    const tileAreaSqFt = tileWidthFt * tileHeightFt;
    
    let perimeter: number;
    let wallArea: number;
    
    if (mode === 'back') {
      // Kitchen: Only back wall
      perimeter = roomWidth;
      wallArea = roomWidth * wallHeight;
    } else {
      // Bathroom: All 4 walls
      perimeter = 2 * (roomWidth + roomDepth);
      wallArea = perimeter * wallHeight;
    }
    
    // Calculate tiles needed
    const tilesNeeded = Math.ceil(wallArea / tileAreaSqFt);
    const tilesWithWastage = Math.ceil(tilesNeeded * wastageMultiplier);
    
    console.log(`🧱 WALL ${wallHeight}FT (${mode}):`, {
      perimeter: `${perimeter.toFixed(2)} ft`,
      wallHeight: `${wallHeight} ft`,
      wallArea: `${wallArea.toFixed(2)} sq ft`,
      tileArea: `${tileAreaSqFt.toFixed(6)} sq ft`,
      tilesNeeded: tilesNeeded,
      withWastage: tilesWithWastage,
      calculation: `${wallArea.toFixed(2)} ÷ ${tileAreaSqFt.toFixed(6)} = ${tilesNeeded}`
    });
    
    return {
      tiles: tilesWithWastage,
      wallArea: wallArea,
      perimeter: perimeter
    };
  };

  const calculateTiles = () => {
    const w = parseFloat(width);
    const d = parseFloat(depth);
    const h = parseFloat(height);

    if (isNaN(w) || isNaN(d) || isNaN(h) || w <= 0 || d <= 0 || h <= 0) {
      setError('Please enter valid positive numbers for all dimensions');
      setResult(null);
      return;
    }

    if (w > 100 || d > 100 || h > 50) {
      setError('Dimensions seem too large. Please check your input.');
      setResult(null);
      return;
    }

    setError('');

    const tileSizeParsed = parseTileSize(tileSize);
    const tileWidthFt = tileSizeParsed.width * 0.0328084; // cm to feet
    const tileHeightFt = tileSizeParsed.height * 0.0328084; // cm to feet
    const tileAreaSqFt = tileWidthFt * tileHeightFt;

    const wastageMultiplier = 1.08;

    // ✅ FLOOR CALCULATION
    const floorArea = w * d;
    const floorTilesRaw = Math.ceil(floorArea / tileAreaSqFt);
    const floorTiles = Math.ceil(floorTilesRaw * wastageMultiplier);

    console.log('🟫 FLOOR CALCULATION:', {
      roomSize: `${w}' × ${d}'`,
      floorArea: `${floorArea.toFixed(2)} sq ft`,
      tileSize: `${tileSizeParsed.width}×${tileSizeParsed.height} cm`,
      tileSizeFt: `${tileWidthFt.toFixed(6)}' × ${tileHeightFt.toFixed(6)}'`,
      tileAreaSqFt: `${tileAreaSqFt.toFixed(6)} sq ft`,
      calculation: `${floorArea.toFixed(2)} ÷ ${tileAreaSqFt.toFixed(6)} = ${floorTilesRaw}`,
      withWastage: floorTiles
    });

    // ✅ WALL CALCULATION (corrected)
    const wall_5ft_result = calculateWallTiles(w, d, 5, tileWidthFt, tileHeightFt, calculationMode);
    const wall_8ft_result = calculateWallTiles(w, d, 8, tileWidthFt, tileHeightFt, calculationMode);
    const wall_11ft_result = calculateWallTiles(w, d, 11, tileWidthFt, tileHeightFt, calculationMode);

    setResult({
      floorTiles,
      wall_5ft: wall_5ft_result.tiles,
      wall_8ft: wall_8ft_result.tiles,
      wall_11ft: wall_11ft_result.tiles,
      floorArea,
      wallArea_5ft: wall_5ft_result.wallArea,
      wallArea_8ft: wall_8ft_result.wallArea,
      wallArea_11ft: wall_11ft_result.wallArea,
      perimeter: wall_5ft_result.perimeter,
      tileWidthCm: tileSizeParsed.width,
      tileHeightCm: tileSizeParsed.height,
      tileWidthFt,
      tileHeightFt,
      tileAreaSqFt,
      wallsCalculated: calculationMode === 'back' ? 'back wall only' : 'all 4 walls'
    });

    console.log('✅ CALCULATION COMPLETE:', {
      floor: floorTiles,
      wall_5ft: wall_5ft_result.tiles,
      wall_8ft: wall_8ft_result.tiles,
      wall_11ft: wall_11ft_result.tiles,
      mode: calculationMode
    });
  };

  useEffect(() => {
    if (isOpen) {
      setResult(null);
      setError('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto animate-slideUp">
        
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 sm:p-6 rounded-t-2xl z-10">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
              <Calculator className="w-6 h-6" />
              Tile Calculator
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              aria-label="Close calculator"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <p className="text-white/90 text-sm">
            Calculate exact tile count for your room
          </p>
        </div>

        <div className="p-4 sm:p-6 space-y-6">
          
          {/* Tile Info */}
          <div className="bg-blue-50 rounded-xl p-4 border-2 border-blue-200">
            <div className="flex items-center gap-2 mb-2">
              <Package className="w-5 h-5 text-blue-600" />
              <h3 className="font-bold text-gray-900">Selected Tile</h3>
            </div>
            <p className="text-gray-700 font-semibold">{tileName}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                📏 {tileSize}
              </span>
              <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-medium capitalize">
                {tileCategory}
              </span>
            </div>
          </div>

          {/* Wall Calculation Mode */}
          {(tileCategory === 'wall' || tileCategory === 'both') && (
            <div className="bg-yellow-50 rounded-xl p-4 border-2 border-yellow-300">
              <label className="block text-sm font-bold text-gray-900 mb-3">
                Wall Calculation Mode:
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setCalculationMode('all')}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    calculationMode === 'all'
                      ? 'bg-yellow-600 text-white border-yellow-700 shadow-lg'
                      : 'bg-white text-gray-700 border-yellow-300 hover:border-yellow-500'
                  }`}
                >
                  <p className="font-bold text-sm">All 4 Walls</p>
                  <p className="text-xs opacity-90">Bathroom style</p>
                </button>
                <button
                  onClick={() => setCalculationMode('back')}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    calculationMode === 'back'
                      ? 'bg-yellow-600 text-white border-yellow-700 shadow-lg'
                      : 'bg-white text-gray-700 border-yellow-300 hover:border-yellow-500'
                  }`}
                >
                  <p className="font-bold text-sm">Back Wall Only</p>
                  <p className="text-xs opacity-90">Kitchen style</p>
                </button>
              </div>
            </div>
          )}

          {/* Room Dimensions Input */}
          <div className="bg-gray-50 rounded-xl p-4 border-2 border-gray-200">
            <div className="flex items-center gap-2 mb-4">
              <Ruler className="w-5 h-5 text-purple-600" />
              <h3 className="font-bold text-gray-900">Room Dimensions (in feet)</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Width (ft)
                </label>
                <input
                  type="number"
                  value={width}
                  onChange={(e) => setWidth(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg font-semibold"
                  placeholder="12"
                  min="1"
                  max="100"
                  step="0.5"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Depth (ft)
                </label>
                <input
                  type="number"
                  value={depth}
                  onChange={(e) => setDepth(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg font-semibold"
                  placeholder="14"
                  min="1"
                  max="100"
                  step="0.5"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Height (ft)
                </label>
                <input
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg font-semibold"
                  placeholder="11"
                  min="1"
                  max="50"
                  step="0.5"
                />
              </div>
            </div>

            {error && (
              <div className="mt-4 bg-red-50 border-2 border-red-200 rounded-lg p-3 flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-red-700 text-sm font-medium">{error}</p>
              </div>
            )}

            <button
              onClick={calculateTiles}
              className="mt-4 w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-bold text-lg hover:shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <Calculator className="w-5 h-5" />
              Calculate Tiles
            </button>
          </div>

          {/* Results */}
          {result && (
            <div className="space-y-4 animate-slideUp">
              
              {/* Floor Tiles */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border-2 border-green-300">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-gray-900 flex items-center gap-2">
                    <Package className="w-5 h-5 text-green-600" />
                    🟫 Floor Tiles
                  </h3>
                  <span className="bg-green-600 text-white px-4 py-2 rounded-full text-2xl font-bold">
                    {result.floorTiles}
                  </span>
                </div>

                <div className="bg-white/60 rounded-lg p-3 space-y-1 text-sm">
                  <p className="text-gray-700">
                    📐 Room: <strong>{width}' × {depth}'</strong>
                  </p>
                  <p className="text-gray-700">
                    📦 Floor Area: <strong>{result.floorArea.toFixed(2)} sq ft</strong>
                  </p>
                  <p className="text-gray-700">
                    📏 Tile: <strong>{result.tileWidthCm}×{result.tileHeightCm} cm</strong> = <strong>{result.tileWidthFt.toFixed(4)} × {result.tileHeightFt.toFixed(4)} ft</strong>
                  </p>
                  <p className="text-gray-700">
                    🔲 Tile Area: <strong>{result.tileAreaSqFt.toFixed(6)} sq ft</strong>
                  </p>
                  <div className="bg-green-100 rounded p-2 mt-2">
                    <p className="text-green-800 text-xs font-mono">
                      Calculation: {result.floorArea.toFixed(2)} ÷ {result.tileAreaSqFt.toFixed(6)} = {Math.ceil(result.floorArea / result.tileAreaSqFt)} tiles
                    </p>
                    <p className="text-green-800 text-xs font-mono">
                      With 8% wastage: {Math.ceil(result.floorArea / result.tileAreaSqFt)} × 1.08 = {result.floorTiles} tiles
                    </p>
                  </div>
                </div>
              </div>

              {/* Wall Tiles */}
              {(tileCategory === 'wall' || tileCategory === 'both') && (
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 border-2 border-purple-300">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-gray-900 flex items-center gap-2">
                      <Package className="w-5 h-5 text-purple-600" />
                      🧱 Wall Tiles ({result.wallsCalculated})
                    </h3>
                  </div>

                  <div className="space-y-3">
                    {/* 5 Feet */}
                    <div className="bg-white/60 rounded-lg p-3 border-2 border-yellow-300">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <p className="font-bold text-gray-900">5 Feet Height</p>
                          <p className="text-xs text-gray-600">Waist height</p>
                        </div>
                        <span className="bg-yellow-600 text-white px-3 py-1 rounded-full text-lg font-bold">
                          {result.wall_5ft}
                        </span>
                      </div>
                      <div className="bg-yellow-50 rounded p-2 text-xs space-y-1">
                        <p className="text-gray-700">
                          Perimeter: <strong>{result.perimeter.toFixed(1)} ft</strong>
                        </p>
                        <p className="text-gray-700">
                          Wall Area: <strong>{result.perimeter.toFixed(1)} × 5 = {result.wallArea_5ft.toFixed(2)} sq ft</strong>
                        </p>
                        <p className="text-gray-700 font-mono">
                          {result.wallArea_5ft.toFixed(2)} ÷ {result.tileAreaSqFt.toFixed(6)} = {Math.ceil(result.wallArea_5ft / result.tileAreaSqFt)} tiles
                        </p>
                        <p className="text-yellow-800 font-bold">
                          With 8% wastage: {result.wall_5ft} tiles
                        </p>
                      </div>
                    </div>

                    {/* 8 Feet */}
                    <div className="bg-white/60 rounded-lg p-3 border-2 border-orange-300">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <p className="font-bold text-gray-900">8 Feet Height</p>
                          <p className="text-xs text-gray-600">Standard bathroom</p>
                        </div>
                        <span className="bg-orange-600 text-white px-3 py-1 rounded-full text-lg font-bold">
                          {result.wall_8ft}
                        </span>
                      </div>
                      <div className="bg-orange-50 rounded p-2 text-xs space-y-1">
                        <p className="text-gray-700">
                          Perimeter: <strong>{result.perimeter.toFixed(1)} ft</strong>
                        </p>
                        <p className="text-gray-700">
                          Wall Area: <strong>{result.perimeter.toFixed(1)} × 8 = {result.wallArea_8ft.toFixed(2)} sq ft</strong>
                        </p>
                        <p className="text-gray-700 font-mono">
                          {result.wallArea_8ft.toFixed(2)} ÷ {result.tileAreaSqFt.toFixed(6)} = {Math.ceil(result.wallArea_8ft / result.tileAreaSqFt)} tiles
                        </p>
                        <p className="text-orange-800 font-bold">
                          With 8% wastage: {result.wall_8ft} tiles
                        </p>
                      </div>
                    </div>

                    {/* 11 Feet */}
                    <div className="bg-white/60 rounded-lg p-3 border-2 border-red-300">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <p className="font-bold text-gray-900">11 Feet Height</p>
                          <p className="text-xs text-gray-600">Full wall coverage</p>
                        </div>
                        <span className="bg-red-600 text-white px-3 py-1 rounded-full text-lg font-bold">
                          {result.wall_11ft}
                        </span>
                      </div>
                      <div className="bg-red-50 rounded p-2 text-xs space-y-1">
                        <p className="text-gray-700">
                          Perimeter: <strong>{result.perimeter.toFixed(1)} ft</strong>
                        </p>
                        <p className="text-gray-700">
                          Wall Area: <strong>{result.perimeter.toFixed(1)} × 11 = {result.wallArea_11ft.toFixed(2)} sq ft</strong>
                        </p>
                        <p className="text-gray-700 font-mono">
                          {result.wallArea_11ft.toFixed(2)} ÷ {result.tileAreaSqFt.toFixed(6)} = {Math.ceil(result.wallArea_11ft / result.tileAreaSqFt)} tiles
                        </p>
                        <p className="text-red-800 font-bold">
                          With 8% wastage: {result.wall_11ft} tiles
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Info Box */}
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <div className="flex items-start gap-2">
                  <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-blue-800">
                    <p className="font-semibold mb-1">✅ Calculation Method:</p>
                    <ul className="space-y-1 text-xs">
                      <li>✓ Floor: <strong>Area ÷ Tile Area</strong></li>
                      <li>✓ Wall: <strong>Perimeter × Height ÷ Tile Area</strong></li>
                      <li>✓ Tile: <strong>{result.tileWidthCm}×{result.tileHeightCm} cm</strong></li>
                      <li>✓ Mode: <strong>{result.wallsCalculated}</strong></li>
                      <li>✓ Automatic <strong>8% wastage</strong> included</li>
                    </ul>
                  </div>
                </div>
              </div>

            </div>
          )}

        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-100 px-4 sm:px-6 py-4 rounded-b-2xl border-t border-gray-200">
          <button
            onClick={onClose}
            className="w-full bg-gray-600 text-white py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
          >
            Close Calculator
          </button>
        </div>

      </div>

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
      `}</style>
    </div>
  );
};