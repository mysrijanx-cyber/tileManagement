
 
// import { useState, useEffect, useCallback } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import {
//   ArrowLeft, Share2, Loader, Upload, Scan,
//   Package, AlertCircle, CheckCircle, X, Info,
//   ChevronDown, ChevronUp, Eye, Ruler, ArrowUpDown,
//   Calculator, Grid3x3, Layers, TrendingUp
// } from 'lucide-react';
// import { Enhanced3DViewer } from '../components/Enhanced3DViewer';
// import { ImageUpload } from '../components/ImageUpload';
// import { QRScanner } from '../components/QRScanner';
// import { RoomDimensionModal } from '../components/RoomDimensionModal';
// import { UniversalTileCalculator } from '../components/TileCalculatorModal';
// import { getTileById, trackQRScan, saveCustomerInquiry } from '../lib/firebaseutils';
// import { Tile } from '../types';
// import { auth, db } from '../lib/firebase';
// import { CustomerInquiryForm } from '../components/CustomerInquiryForm';
// import { getDoc, doc, collection, query, where, getDocs } from 'firebase/firestore';
// import { getCustomerFromSession, isSessionValid } from '../utils/customerSession';
// import { useAppStore } from '../stores/appStore';
// import {
//   getCalculationDimensions,
//   saveCalculationDimensions,
//   hasCustomCalculationDims,
//   resetCalculationDimensions,
//   VISUAL_CONFIGS,
//   scalePatternCount
// } from '../utils/dimensionHelpers';
// import { calculateTiles } from '../utils/tileCalculations';

// // ═══════════════════════════════════════════════════════════════
// // TYPESCRIPT INTERFACES
// // ═══════════════════════════════════════════════════════════════

// interface TileSize {
//   width: number;
//   height: number;
//   label: string;
// }

// interface TileState {
//   texture: string;
//   size: { width: number; height: number };
//   sellerId?: string;
//   tileName?: string;
//   tileId?: string;
//   source?: 'qr' | 'upload' | 'initial';
// }

// interface VerifiedUserData {
//   uid: string;
//   email: string | null;
//   role: string;
//   seller_id?: string;
//   user_id?: string;
// }

// interface RoomDimensions {
//   width: number;
//   depth: number;
//   height: number;
// }

// type WallType = 'back' | 'front' | 'left' | 'right';

// interface HighlighterBreakdown {
//   wall_5ft_base: number;
//   wall_5ft_highlighter: number;
//   wall_8ft_base: number;
//   wall_8ft_highlighter: number;
//   wall_11ft_base: number;
//   wall_11ft_highlighter: number;
// }

// interface TileCount {
//   floor: number;
//   wall_5ft: number;
//   wall_8ft: number;
//   wall_11ft: number;
//   perimeter: number;
//   tileAreaSqFt: number;
//   roomAreaSqFt: number;
// }

// // ═══════════════════════════════════════════════════════════════
// // CONSTANTS
// // ═══════════════════════════════════════════════════════════════

// const ROOM_CONFIGS = {
//   drawing: {
//     width: 20 * 0.3048,
//     depth: 20 * 0.3048,
//     height: 11 * 0.3048
//   },
//   kitchen: {
//     width: 25 * 0.3048,
//     depth: 25 * 0.3048,
//     height: 11 * 0.3048
//   },
//   bathroom: {
//     width: 15 * 0.3048,
//     depth: 15 * 0.3048,
//     height: 11 * 0.3048
//   }
// } as const;

// const WALL_SIZES: TileSize[] = [
//   { width: 30, height: 45, label: '30×45' },
//   { width: 30, height: 60, label: '30×60' },
//   { width: 40, height: 80, label: '40×80' },
//   { width: 45, height: 45, label: '45×45' },
//   { width: 40, height: 60, label: '40×60' },
//   { width: 20, height: 20, label: '20×20' }
// ];

// const WALL_TILE_HEIGHTS = [
//   { value: 5, label: "5 Feet", description: "Waist Height" },
//   { value: 8, label: "8 Feet", description: "Standard Bathroom" },
//   { value: 11, label: "11 Feet", description: "Full Wall" }
// ];

// const ROOM_STATE_EXPIRY = 60 * 60 * 1000;

// // ═══════════════════════════════════════════════════════════════
// // HELPER FUNCTIONS
// // ═══════════════════════════════════════════════════════════════

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
//       .replace(/\scm\s/gi, '')
//       .replace(/\sft\s/gi, '')
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

// // ═══════════════════════════════════════════════════════════════
// // MAIN COMPONENT
// // ═══════════════════════════════════════════════════════════════

// export const Room3DViewPage: React.FC = () => {
//   const { currentUser } = useAppStore();
//   const { tileId, roomType } = useParams<{ tileId: string; roomType: string }>();
//   const navigate = useNavigate();

//   // ═════════════════════════════════════════════════════════════
//   // STATE MANAGEMENT
//   // ═════════════════════════════════════════════════════════════

//   const [verifiedUser, setVerifiedUser] = useState<VerifiedUserData | null>(null);
//   const [tile, setTile] = useState<Tile | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [activeSurface, setActiveSurface] = useState<'floor' | 'wall' | 'both'>('both');
//   const [showInquiryForm, setShowInquiryForm] = useState(false);
//   const [inquiryFormData, setInquiryFormData] = useState<any>(null);

//   const [calculationDims, setCalculationDims] = useState<RoomDimensions | null>(null);
//   const [showCalculationDimEditor, setShowCalculationDimEditor] = useState(false);
//   const [showTileCalculator, setShowTileCalculator] = useState(false);

//   const [tileCount, setTileCount] = useState<TileCount | null>(null);

//   const [highlighterTileIndices, setHighlighterTileIndices] = useState<{
//     back: Set<number>;
//     front: Set<number>;
//     left: Set<number>;
//     right: Set<number>;
//   }>({
//     back: new Set(),
//     front: new Set(),
//     left: new Set(),
//     right: new Set()
//   });

//   const [highlighterBreakdown, setHighlighterBreakdown] = useState<HighlighterBreakdown | null>(null);
//   const [highlightTileBorders, setHighlightTileBorders] = useState(false);
//   const [dimsVersion, setDimsVersion] = useState(0);
//   const [wallTileInputMethod, setWallTileInputMethod] = useState<'upload' | 'qr'>('qr');
//   const [showWallScanner, setShowWallScanner] = useState(false);
//   const [scannerLoading, setScannerLoading] = useState(false);

//   const [success, setSuccess] = useState<string | null>(null);
//   const [error, setError] = useState<string | null>(null);

//   const [showMobileControls, setShowMobileControls] = useState(true);
//   const [isMobile, setIsMobile] = useState(false);
//   const [expandedSection, setExpandedSection] = useState<'floor' | 'wall' | 'dimensions' | 'calculator' | null>('floor');
//   const [showDimensionEditor, setShowDimensionEditor] = useState(false);

//   const [wallTileHeight, setWallTileHeight] = useState<number>(11);

//   const [floorTile, setFloorTile] = useState<TileState>({
//     texture: '',
//     size: { width: 60, height: 60 },
//     sellerId: undefined,
//     tileName: undefined,
//     tileId: undefined,
//     source: undefined
//   });

//   const [wallTile, setWallTile] = useState<TileState>({
//     texture: '',
//     size: { width: 30, height: 45 },
//     sellerId: undefined,
//     tileName: undefined,
//     tileId: undefined,
//     source: undefined
//   });

//   // ═════════════════════════════════════════════════════════════
//   // HELPER FUNCTIONS (CALLBACKS)
//   // ═════════════════════════════════════════════════════════════

//   const getCurrentDimensions = useCallback((): RoomDimensions | null => {
//     try {
//       const stored = localStorage.getItem(`room_dimensions_${roomType}`);
//       if (!stored) return null;

//       const data = JSON.parse(stored);
//       return {
//         width: data.width,
//         depth: data.depth,
//         height: data.height
//       };
//     } catch (err) {
//       console.warn('⚠️ Failed to get dimensions:', err);
//       return null;
//     }
//   }, [roomType]);

//   const getWallDimensions = useCallback((wall: WallType, customWallHeight?: number) => {
//     const config = ROOM_CONFIGS[roomType as keyof typeof ROOM_CONFIGS];
//     if (!config) return { cols: 0, rows: 0 };

//     const wallTileSize = wallTile.size || { width: 30, height: 45 };

//     const tileWidthFt = wallTileSize.width * 0.0328084;
//     const tileHeightFt = wallTileSize.height * 0.0328084;

//     const heightInFeet = customWallHeight || (config.height / 0.3048);

//     const wallWidthFeet = (wall === 'back' || wall === 'front') 
//       ? (config.width / 0.3048) 
//       : (config.depth / 0.3048);

//     const cols = Math.ceil(wallWidthFeet / tileWidthFt);
//     const rows = Math.ceil(heightInFeet / tileHeightFt);

//     return { cols, rows };
//   }, [roomType, wallTile.size]);

//   const calculateHighlighterBreakdown = useCallback((): HighlighterBreakdown | null => {
//     if (!wallTile.texture || !tileCount) return null;

//     const isKitchenOrBathroom = roomType === 'kitchen' || roomType === 'bathroom';
//     if (!isKitchenOrBathroom) return null;

//     let dims = getCurrentDimensions();
//     if (!dims) {
//       const defaultConfig = ROOM_CONFIGS[roomType as keyof typeof ROOM_CONFIGS];
//       if (!defaultConfig) return null;
//       dims = {
//         width: defaultConfig.width / 0.3048,
//         depth: defaultConfig.depth / 0.3048,
//         height: defaultConfig.height / 0.3048
//       };
//     }

//     const perimeter = roomType === 'kitchen' 
//       ? dims.width 
//       : 2 * (dims.width + dims.depth);

//     const tileWidthFt = wallTile.size.width * 0.0328084;
//     const tileHeightFt = wallTile.size.height * 0.0328084;
//     const tileAreaSqFt = tileWidthFt * tileHeightFt;

//     const wastageMultiplier = 1.08;

//     const breakdown: HighlighterBreakdown = {
//       wall_5ft_base: 0,
//       wall_5ft_highlighter: 0,
//       wall_8ft_base: 0,
//       wall_8ft_highlighter: 0,
//       wall_11ft_base: 0,
//       wall_11ft_highlighter: 0
//     };

//     const walls: WallType[] = roomType === 'kitchen' ? ['back'] : ['back', 'front', 'left', 'right'];

//     [5, 8, 11].forEach(heightFt => {
//       const wallArea = perimeter * heightFt;
//       const totalTilesNeeded = Math.ceil(wallArea / tileAreaSqFt);
      
//       let highlighterCount = 0;
      
//       walls.forEach(wall => {
//         const highlighterSet = highlighterTileIndices[wall];
        
//         if (highlighterSet && highlighterSet.size > 0) {
//           const wallDims = getWallDimensions(wall, heightFt);
//           const maxTilesForThisHeight = wallDims.cols * wallDims.rows;
          
//           highlighterSet.forEach(index => {
//             if (index <= maxTilesForThisHeight) {
//               highlighterCount++;
//             }
//           });
//         }
//       });
      
//       const baseTiles = totalTilesNeeded - highlighterCount;
      
//       breakdown[`wall_${heightFt}ft_base` as keyof HighlighterBreakdown] = Math.ceil(baseTiles * wastageMultiplier);
//       breakdown[`wall_${heightFt}ft_highlighter` as keyof HighlighterBreakdown] = Math.ceil(highlighterCount * wastageMultiplier);
//     });

//     return breakdown;
//   }, [wallTile.texture, wallTile.size, tileCount, roomType, highlighterTileIndices, getWallDimensions, getCurrentDimensions]);

//   const validateSellerConsistency = useCallback((wallSellerId: string): { valid: boolean; error?: string | null } => {
//     if (!floorTile.sellerId) {
//       return {
//         valid: false,
//         error: '❌ Floor Tile Not Set\n\nPlease scan floor tile first.\n\nWall tiles must match floor tile showroom.'
//       };
//     }

//     if (wallSellerId !== floorTile.sellerId) {
//       return {
//         valid: false,
//         error: `🚫 Seller Mismatch Detected\n\n` +
//                `Floor Tile: "${floorTile.tileName}"\n` +
//                `Showroom: ${floorTile.sellerId?.substring(0, 8)}...\n\n` +
//                `Wall Tile: Different Showroom\n\n` +
//                `❌ Cannot mix tiles from different showrooms.`
//       };
//     }

//     return { valid: true };
//   }, [floorTile.sellerId, floorTile.tileName]);

//   const saveRoomState = useCallback(() => {
//     if (!tileId || !roomType) return;

//     try {
//       const roomStateKey = `room_state_${tileId}_${roomType}`;
//       const state = {
//         floorTile,
//         wallTile,
//         activeSurface,
//         wallTileHeight,
//         highlighterTileIndices: {
//           back: Array.from(highlighterTileIndices.back),
//           front: Array.from(highlighterTileIndices.front),
//           left: Array.from(highlighterTileIndices.left),
//           right: Array.from(highlighterTileIndices.right)
//         },
//         timestamp: Date.now()
//       };
//       localStorage.setItem(roomStateKey, JSON.stringify(state));
//       console.log('💾 Room state saved');
//     } catch (err) {
//       console.warn('⚠️ Failed to save room state:', err);
//     }
//   }, [tileId, roomType, floorTile, wallTile, activeSurface, wallTileHeight, highlighterTileIndices]);

//   const restoreRoomState = useCallback((): boolean => {
//     if (!tileId || !roomType) return false;

//     try {
//       const roomStateKey = `room_state_${tileId}_${roomType}`;
//       const saved = localStorage.getItem(roomStateKey);
      
//       if (!saved) return false;

//       const state = JSON.parse(saved);
//       const age = Date.now() - state.timestamp;
      
//       if (age < ROOM_STATE_EXPIRY) {
//         setFloorTile(state.floorTile);
//         setWallTile(state.wallTile);
//         setActiveSurface(state.activeSurface);
//         setWallTileHeight(state.wallTileHeight || 11);
        
//         if (state.highlighterTileIndices) {
//           setHighlighterTileIndices({
//             back: new Set(state.highlighterTileIndices.back || []),
//             front: new Set(state.highlighterTileIndices.front || []),
//             left: new Set(state.highlighterTileIndices.left || []),
//             right: new Set(state.highlighterTileIndices.right || [])
//           });
//         }
        
//         console.log('✅ Room state restored');
//         return true;
//       } else {
//         localStorage.removeItem(roomStateKey);
//         return false;
//       }
//     } catch (err) {
//       console.warn('⚠️ Failed to restore room state:', err);
//       return false;
//     }
//   }, [tileId, roomType]);

//   const handleDimensionUpdate = useCallback((width: number, depth: number, height: number) => {
//     const dimensionData = {
//       width,
//       depth,
//       height,
//       timestamp: Date.now()
//     };

//     try {
//       localStorage.setItem(`room_dimensions_${roomType}`, JSON.stringify(dimensionData));
//       setShowDimensionEditor(false);
      
//       if (navigator.vibrate) {
//         navigator.vibrate([50, 30, 50]);
//       }
      
//       setSuccess(`✅ Room dimensions updated to ${width}' × ${depth}' × ${height}'`);
      
//       setTimeout(() => {
//         window.location.reload();
//       }, 1000);
//     } catch (err) {
//       console.error('❌ Failed to save dimensions:', err);
//       setError('Failed to save room dimensions');
//     }
//   }, [roomType]);

//   const handleCalculationDimensionUpdate = useCallback((width: number, depth: number, height: number) => {
//     const newDims = { width, depth, height };

//     console.log('💾 SAVING CALCULATION DIMENSIONS:', {
//       roomType,
//       newDimensions: newDims,
//       oldDimensions: calculationDims,
//       timestamp: new Date().toISOString()
//     });

//     const saved = saveCalculationDimensions(roomType || 'kitchen', newDims);

//     if (saved) {
//       setCalculationDims({ ...newDims });

//       setDimsVersion(prev => {
//         const newVersion = prev + 1;
//         console.log('🔄 Dimensions version updated:', newVersion);
//         return newVersion;
//       });

//       setShowCalculationDimEditor(false);

//       if (navigator.vibrate) {
//         navigator.vibrate([50, 30, 50]);
//       }

//       setSuccess(
//         `✅ Calculation dimensions updated!\n` +
//         `New size: ${width}' × ${depth}' × ${height}'\n` +
//         `Tile counts will recalculate automatically.`
//       );

//       console.log('✅ Dimensions saved, state updated, version incremented');

//       setTimeout(() => {
//         const verify = getCalculationDimensions(roomType || 'kitchen');
//         console.log('🔍 Verification check:', {
//           savedDimensions: verify,
//           matchesInput: verify.width === width && verify.depth === depth && verify.height === height
//         });
//       }, 100);
//     } else {
//       setError('Failed to save calculation dimensions');
//       console.error('❌ Failed to save dimensions to localStorage');
//     }
//   }, [roomType, calculationDims]);

//   const handleShare = useCallback(async () => {
//     const shareData = {
//       title: `${tile?.name} in ${roomType}`,
//       text: `Check out this tile visualization!`,
//       url: window.location.href
//     };

//     try {
//       if (navigator.share) {
//         await navigator.share(shareData);
//         setSuccess('Shared successfully!');
//       } else {
//         await navigator.clipboard.writeText(window.location.href);
//         setSuccess('Link copied to clipboard!');
//       }
//     } catch (err) {
//       console.error('Error sharing:', err);
//       setError('Failed to share');
//     }
//   }, [tile?.name, roomType]);

//   const toggleSection = useCallback((section: 'floor' | 'wall' | 'dimensions' | 'calculator') => {
//     setExpandedSection(expandedSection === section ? null : section);
//   }, [expandedSection]);

//   // ═════════════════════════════════════════════════════════════
//   // EFFECTS
//   // ═════════════════════════════════════════════════════════════

//   useEffect(() => {
//     const dims = getCalculationDimensions(roomType || 'kitchen');
//     setCalculationDims(dims);
//     console.log('📐 Loaded calculation dimensions:', {
//       roomType,
//       dimensions: dims,
//       version: dimsVersion
//     });
//   }, [roomType, dimsVersion]);

//   useEffect(() => {
//     console.log('🔄 TILE CALCULATION TRIGGERED:', {
//       hasCalculationDims: !!calculationDims,
//       hasFloorTileSize: !!floorTile.size,
//       floorTileSize: floorTile.size,
//       wallTileSize: wallTile.size,
//       roomType,
//       dimsVersion
//     });

//     if (!calculationDims) {
//       console.warn('⚠️ No calculation dimensions available, skipping calculation');
//       return;
//     }

//     if (!floorTile.size || floorTile.size.width <= 0 || floorTile.size.height <= 0) {
//       console.warn('⚠️ Invalid floor tile size, skipping calculation');
//       return;
//     }

//     console.log('✅ Proceeding with tile calculation for dimensions:', calculationDims);

//     const floorResult = calculateTiles({
//       roomWidth: calculationDims.width,
//       roomDepth: calculationDims.depth,
//       roomHeight: calculationDims.height,
//       tileWidthCm: floorTile.size.width,
//       tileHeightCm: floorTile.size.height,
//       roomType: roomType as any
//     });

//     console.log('📊 Floor calculation result:', floorResult);

//     let wallData = {
//       wall_5ft: 0,
//       wall_8ft: 0,
//       wall_11ft: 0,
//       perimeter: 0
//     };

//     if (wallTile.texture &&
//         wallTile.size &&
//         wallTile.size.width > 0 &&
//         wallTile.size.height > 0 &&
//         (roomType === 'kitchen' || roomType === 'bathroom')) {

//       console.log('🧱 Calculating wall tiles...');

//       const wallResult = calculateTiles({
//         roomWidth: calculationDims.width,
//         roomDepth: calculationDims.depth,
//         roomHeight: calculationDims.height,
//         tileWidthCm: wallTile.size.width,
//         tileHeightCm: wallTile.size.height,
//         roomType: roomType as any
//       });

//       wallData = {
//         wall_5ft: wallResult.wall_5ft,
//         wall_8ft: wallResult.wall_8ft,
//         wall_11ft: wallResult.wall_11ft,
//         perimeter: wallResult.perimeter
//       };

//       console.log('📊 Wall calculation result:', wallData);
//     }

//     const newTileCount = {
//       floor: floorResult.floor,
//       wall_5ft: wallData.wall_5ft,
//       wall_8ft: wallData.wall_8ft,
//       wall_11ft: wallData.wall_11ft,
//       perimeter: wallData.perimeter,
//       tileAreaSqFt: floorResult.tileAreaSqFt,
//       roomAreaSqFt: floorResult.roomAreaSqFt
//     };

//     setTileCount(newTileCount);

//     console.log('✅ TILE COUNT STATE UPDATED:', {
//       floor: newTileCount.floor,
//       wall_5ft: newTileCount.wall_5ft,
//       wall_8ft: newTileCount.wall_8ft,
//       wall_11ft: newTileCount.wall_11ft,
//       dimensions: `${calculationDims.width}×${calculationDims.depth}×${calculationDims.height}`,
//       version: dimsVersion
//     });

//   }, [calculationDims, floorTile.size, wallTile.size, wallTile.texture, roomType, dimsVersion]);

//   useEffect(() => {
//     const breakdown = calculateHighlighterBreakdown();
//     setHighlighterBreakdown(breakdown);
//   }, [calculateHighlighterBreakdown]);

//   useEffect(() => {
//     const handleHighlighterUpdate = (event: CustomEvent) => {
//       const { wall, indices } = event.detail;
//       console.log('🎨 Highlighter update:', wall, indices.length);

//       setHighlighterTileIndices(prev => ({
//         ...prev,
//         [wall]: new Set(indices)
//       }));
//     };

//     window.addEventListener('highlighterUpdate' as any, handleHighlighterUpdate as any);

//     return () => {
//       window.removeEventListener('highlighterUpdate' as any, handleHighlighterUpdate as any);
//     };
//   }, []);

//   useEffect(() => {
//     const prepareVerifiedUser = async () => {
//       const authUser = auth.currentUser;

//       if (!authUser) {
//         console.warn('⚠️ No Firebase auth user found');
//         setVerifiedUser(null);
//         return;
//       }

//       try {
//         const userDoc = await getDoc(doc(db, 'users', authUser.uid));
        
//         if (userDoc.exists()) {
//           const userData = userDoc.data();
          
//           const properUser: VerifiedUserData = {
//             uid: authUser.uid,
//             email: authUser.email || userData.email || null,
//             role: userData.role || 'worker',
//             seller_id: userData.seller_id,
//             user_id: authUser.uid,
//           };
          
//           setVerifiedUser(properUser);
//         }
//       } catch (err) {
//         console.error('❌ Error preparing verified user:', err);
//         setVerifiedUser(null);
//       }
//     };

//     prepareVerifiedUser();
//   }, []);

//   useEffect(() => {
//     const checkMobile = () => {
//       setIsMobile(window.innerWidth < 1024);
//     };

//     checkMobile();
//     window.addEventListener('resize', checkMobile);
//     return () => window.removeEventListener('resize', checkMobile);
//   }, []);

//   useEffect(() => {
//     const loadTileData = async () => {
//       if (!tileId) {
//         setError('Tile ID is missing');
//         setLoading(false);
//         return;
//       }

//       try {
//         setLoading(true);
//         setError(null);
        
//         const tileData = await getTileById(tileId);
        
//         if (!tileData) {
//           setError('Tile not found');
//           setTimeout(() => navigate('/'), 3000);
//           return;
//         }
        
//         setTile(tileData);

//         const restored = restoreRoomState();
//         if (restored) {
//           setSuccess('✅ Previous room configuration restored');
//           setLoading(false);
//           return;
//         }

//         const currentAuthUser = auth.currentUser;
        
//         if (currentAuthUser) {
//           try {
//             const userDoc = await getDoc(doc(db, 'users', currentAuthUser.uid));
            
//             if (userDoc.exists()) {
//               const userData = userDoc.data();
              
//               if (userData.role === 'worker') {
//                 const existingSession = getCustomerFromSession();
                
//                 if (existingSession && isSessionValid()) {
//                   const floorSellerId = tileData.sellerId;
//                   const parsedSize = parseTileSize(tileData.size, 'floor');
                  
//                   setFloorTile({
//                     texture: tileData.textureUrl || tileData.imageUrl,
//                     size: parsedSize,
//                     sellerId: floorSellerId,
//                     tileName: tileData.name,
//                     tileId: tileData.id,
//                     source: 'initial'
//                   });
                  
//                   setShowInquiryForm(false);
//                   setLoading(false);
//                   setSuccess(`✅ Showing for ${existingSession.name} | Tile: ${parsedSize.width}×${parsedSize.height}cm`);
//                   return;
//                 }
                
//                 const sellerId = userData.seller_id;
//                 let sellerBusinessName = 'Showroom';
                
//                 if (sellerId) {
//                   try {
//                     const sellerQuery = query(
//                       collection(db, 'sellers'),
//                       where('user_id', '==', sellerId)
//                     );
//                     const sellerSnapshot = await getDocs(sellerQuery);
                    
//                     if (!sellerSnapshot.empty) {
//                       const sellerData = sellerSnapshot.docs[0].data();
//                       sellerBusinessName = sellerData.business_name || 'Showroom';
//                     }
//                   } catch (sellerErr) {
//                     console.warn('⚠️ Could not fetch seller name:', sellerErr);
//                   }
//                 }
                
//                 setInquiryFormData({
//                   tileId: tileData.id,
//                   tileName: tileData.name,
//                   tileCode: tileData.tileCode || tileData.tile_code,
//                   tileImageUrl: tileData.imageUrl || tileData.image_url,
//                   tileSize: tileData.size,
//                   tilePrice: tileData.price,
//                   workerId: currentAuthUser.uid,
//                   workerEmail: currentAuthUser.email || userData.email,
//                   sellerId: sellerId,
//                   sellerBusinessName: sellerBusinessName
//                 });
                
//                 setShowInquiryForm(true);
//                 setLoading(false);
//                 return;
//               }
//             }
//           } catch (userErr) {
//             console.warn('⚠️ Could not check user role:', userErr);
//           }
//         }
        
//         const floorSellerId = tileData.sellerId;
//         const parsedSize = parseTileSize(tileData.size, 'floor');
        
//         setFloorTile({
//           texture: tileData.textureUrl || tileData.imageUrl,
//           size: parsedSize,
//           sellerId: floorSellerId,
//           tileName: tileData.name,
//           tileId: tileData.id,
//           source: 'initial'
//         });

//       } catch (err) {
//         console.error('❌ Error loading tile:', err);
//         setError('Failed to load tile data');
//         setTimeout(() => navigate('/'), 2000);
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadTileData();
//   }, [tileId, navigate, restoreRoomState]);

//   useEffect(() => {
//     if (success || error) {
//       const timer = setTimeout(() => {
//         setSuccess(null);
//         setError(null);
//       }, 5000);
//       return () => clearTimeout(timer);
//     }
//   }, [success, error]);

//   useEffect(() => {
//     if (floorTile.sellerId || wallTile.sellerId) {
//       saveRoomState();
//     }
//   }, [floorTile, wallTile, activeSurface, wallTileHeight, saveRoomState]);

//   // ═════════════════════════════════════════════════════════════
//   // EVENT HANDLERS
//   // ═════════════════════════════════════════════════════════════

//   const handleInquirySubmit = async (formData: any) => {
//     try {
//       setError(null);
//       const result = await saveCustomerInquiry(formData);

//       if (result.success) {
//         setShowInquiryForm(false);
//         setSuccess('✅ Customer details saved! Loading 3D view...');
        
//         if (tile) {
//           const floorSellerId = tile.sellerId;
//           const parsedSize = parseTileSize(tile.size, 'floor');
          
//           setFloorTile({
//             texture: tile.textureUrl || tile.imageUrl,
//             size: parsedSize,
//             sellerId: floorSellerId,
//             tileName: tile.name,
//             tileId: tile.id,
//             source: 'initial'
//           });
//         }
        
//         if (navigator.vibrate) {
//           navigator.vibrate([100, 50, 100]);
//         }
        
//         setTimeout(() => {
//           setSuccess(null);
//         }, 3000);
        
//       } else {
//         throw new Error(result.error || 'Failed to save customer details');
//       }
      
//     } catch (err: any) {
//       console.error('❌ Inquiry submission failed:', err);
//       throw err;
//     }
//   };

//   const loadWallTileFromQR = async (wallTileId: string) => {
//     try {
//       setScannerLoading(true);
//       setError(null);

//       if (!floorTile.sellerId) {
//         setScannerLoading(false);
//         setError(
//           '❌ Floor Tile Required\n\n' +
//           'Please scan floor tile first before adding wall tile.\n\n' +
//           'Wall tiles must be from the same showroom as floor tile.'
//         );
        
//         if (navigator.vibrate) {
//           navigator.vibrate([200, 100, 200]);
//         }
        
//         return;
//       }

//       const wallTileData = await getTileById(wallTileId);

//       if (!wallTileData) {
//         setScannerLoading(false);
//         setError('Wall tile not found in database');
//         return;
//       }

//       const wallSellerId = wallTileData.sellerId;

//       const validation = validateSellerConsistency(wallSellerId);
      
//       if (!validation.valid) {
//         setScannerLoading(false);
//         setError(validation.error ?? null);
        
//         if (navigator.vibrate) {
//           navigator.vibrate([200, 100, 200, 100, 200]);
//         }
        
//         return;
//       }

//       const sessionKey = `wall_qr_tracked_${wallTileId}`;
//       const sessionTracked = sessionStorage.getItem(sessionKey);
      
//       if (!sessionTracked || (Date.now() - parseInt(sessionTracked)) > 5 * 60 * 1000) {
//         await trackQRScan(wallTileId, {
//           sellerId: wallSellerId,
//           showroomId: wallTileData.showroomId
//         });
//         sessionStorage.setItem(sessionKey, Date.now().toString());
//       }

//       const parsedWallSize = parseTileSize(wallTileData.size, 'wall');

//       setWallTile({
//         texture: wallTileData.textureUrl || wallTileData.imageUrl,
//         size: parsedWallSize,
//         sellerId: wallSellerId,
//         tileName: wallTileData.name,
//         tileId: wallTileData.id,
//         source: 'qr'
//       });

//       setSuccess(`✅ Wall tile: ${wallTileData.name}\n📏 Size: ${parsedWallSize.width}×${parsedWallSize.height}cm\nSelect wall height below`);
      
//       if (navigator.vibrate) {
//         navigator.vibrate(200);
//       }
      
//     } catch (err: any) {
//       console.error('❌ Wall tile QR error:', err);
//       setScannerLoading(false);
//       setError('Failed to load wall tile. Please try again.');
//     } finally {
//       setScannerLoading(false);
//     }
//   };

//   const handleWallTileUpload = (url: string) => {
//     if (!floorTile.sellerId) {
//       setError(
//         '❌ Floor Tile Required\n\n' +
//         'Please scan floor tile first before uploading wall tile.\n\n' +
//         'This ensures tiles are from the same showroom.'
//       );
//       return;
//     }

//     setWallTile({ 
//       ...wallTile, 
//       texture: url,
//       sellerId: floorTile.sellerId,
//       tileName: 'Uploaded Wall Tile',
//       tileId: undefined,
//       source: 'upload'
//     });

//     setSuccess(
//       `✅ Wall tile uploaded!\n` +
//       `🔒 Locked to ${floorTile.tileName}'s showroom\n` +
//       `📏 Select wall height below`
//     );
//   };

//   // ═════════════════════════════════════════════════════════════
//   // RENDER
//   // ═════════════════════════════════════════════════════════════

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
//         <div className="text-center px-4">
//           <Loader className="w-10 h-10 animate-spin text-blue-500 mx-auto mb-2.5" />
//           <p className="text-white text-sm font-medium">Loading 3D view...</p>
//         </div>
//       </div>
//     );
//   }

//   if (!tile || !roomType) {
//     return null;
//   }

//   const isKitchenOrBathroom = roomType === 'kitchen' || roomType === 'bathroom';
//   const currentDimensions = getCurrentDimensions();

//   return (
//     <div className="h-screen flex flex-col bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 overflow-hidden">

//       {/* HEADER */}
//       <header className="bg-gray-800/95 backdrop-blur-sm shadow-lg z-20 border-b border-gray-700 flex-shrink-0">
//         <div className="max-w-7xl mx-auto px-2.5 sm:px-3 py-2 flex items-center justify-between gap-2">
//           <button
//             onClick={() => navigate(-1)}
//             className="flex items-center gap-1 text-white hover:text-blue-400 transition-colors p-1 -ml-1 rounded-lg hover:bg-gray-700"
//           >
//             <ArrowLeft className="w-4 h-4" />
//             <span className="font-medium text-xs sm:text-sm">Back</span>
//           </button>

//           <div className="flex-1 text-center min-w-0">
//             <h1 className="text-white font-bold text-xs sm:text-sm md:text-base capitalize truncate">
//               {roomType} - 3D View
//             </h1>
//           </div>

//           <button onClick={handleShare} className="p-1 text-white hover:bg-gray-700 rounded-lg transition-colors" title="Share">
//             <Share2 className="w-4 h-4" />
//           </button>
//         </div>

//         {floorTile.sellerId && (
//           <div className="bg-blue-600/20 border-t border-blue-500/30 px-3 py-1.5">
//             <div className="max-w-7xl mx-auto flex items-center gap-2">
//               <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
//               <p className="text-blue-200 text-xs">
//                 🔒 Room locked to: <strong>{floorTile.tileName}</strong> showroom
//                 {floorTile.size && (
//                   <span className="ml-2">| 📏 Tile: <strong>{floorTile.size.width}×{floorTile.size.height}cm</strong></span>
//                 )}
//               </p>
//             </div>
//           </div>
//         )}

//         {currentDimensions && (
//           <div className="bg-purple-600/20 border-t border-purple-500/30 px-3 py-1.5">
//             <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
//               <div className="flex items-center gap-2">
//                 <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
//                 <p className="text-purple-200 text-xs">
//                   📏 Custom size: <strong>{currentDimensions.width}' × {currentDimensions.depth}' × {currentDimensions.height}'</strong>
//                 </p>
//               </div>
//               <button
//                 onClick={() => setShowDimensionEditor(true)}
//                 className="text-purple-200 hover:text-white text-xs underline transition-colors"
//               >
//                 Edit
//               </button>
//             </div>
//           </div>
//         )}

//         {wallTile.texture && isKitchenOrBathroom && (
//           <div className="bg-yellow-600/20 border-t border-yellow-500/30 px-3 py-1.5">
//             <div className="max-w-7xl mx-auto flex items-center gap-2">
//               <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
//               <p className="text-yellow-200 text-xs">
//                 🧱 Wall tile height: <strong>{wallTileHeight} feet</strong> (Room: 11 feet)
//                 {wallTile.size && (
//                   <span className="ml-2">| 📏 Tile: <strong>{wallTile.size.width}×{wallTile.size.height}cm</strong></span>
//                 )}
//               </p>
//             </div>
//           </div>
//         )}
//       </header>

//       {/* INQUIRY FORM MODAL */}
//       {showInquiryForm && inquiryFormData && (
//         <CustomerInquiryForm
//           {...inquiryFormData}
//           onSubmit={handleInquirySubmit}
//           onCancel={() => {
//             setShowInquiryForm(false);
//             navigate(-1);
//           }}
//         />
//       )}

//       {/* NOTIFICATIONS */}
//       {success && (
//         <div className="fixed top-12 left-1/2 transform -translate-x-1/2 z-50 max-w-md w-full mx-2.5 animate-slide-down">
//           <div className="bg-green-500 text-white px-3 py-2 rounded-lg shadow-2xl flex items-center gap-2">
//             <CheckCircle className="w-4 h-4 flex-shrink-0" />
//             <p className="font-medium text-xs flex-1 whitespace-pre-line">{success}</p>
//             <button onClick={() => setSuccess(null)} className="ml-auto p-0.5">
//               <X className="w-3.5 h-3.5" />
//             </button>
//           </div>
//         </div>
//       )}

//       {error && (
//         <div className="fixed top-12 left-1/2 transform -translate-x-1/2 z-50 max-w-md w-full mx-2.5 animate-slide-down">
//           <div className="bg-red-500 text-white px-3 py-2 rounded-lg shadow-2xl flex items-start gap-2">
//             <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
//             <p className="font-medium text-xs flex-1 whitespace-pre-line break-words">{error}</p>
//             <button onClick={() => setError(null)} className="ml-auto p-0.5 flex-shrink-0">
//               <X className="w-3.5 h-3.5" />
//             </button>
//           </div>
//         </div>
//       )}

//       {/* MAIN CONTENT */}
//       <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        
//         {/* 3D VIEWER */}
//         <div className="flex-1 relative min-h-0">
//           <Enhanced3DViewer
//             roomType={roomType as any}
//             floorTile={floorTile}
//             wallTile={wallTile}
//             activeSurface={activeSurface}
//             onSurfaceChange={setActiveSurface}
//             currentUser={verifiedUser ? {
//               role: verifiedUser.role,
//               user_id: verifiedUser.uid,
//               seller_id: verifiedUser.seller_id,
//             } : undefined}
//             wallTileHeight={wallTileHeight}
//             highlightTileBorders={highlightTileBorders}
//             onHighlighterUpdate={(wall: WallType, indices: number[]) => {
//               console.log('🎯 Highlighter update:', wall, indices.length);
//               setHighlighterTileIndices(prev => ({
//                 ...prev,
//                 [wall]: new Set(indices)
//               }));
//             }}
//             calculationDimensions={calculationDims || undefined}
//           />

//           {isMobile && (
//             <button
//               onClick={() => setShowMobileControls(!showMobileControls)}
//               className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-blue-600 hover:bg-blue-700 text-white px-2.5 py-1 rounded-full shadow-lg flex items-center gap-1 z-10 text-[10px] transition-colors"
//             >
//               <Eye className="w-3 h-3" />
//               {showMobileControls ? 'Hide' : 'Show'}
//               {showMobileControls ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />}
//             </button>
//           )}
//         </div>

//         {/* SIDEBAR - Continuing from previous code... */}
//         <aside className={`lg:w-72 xl:w-80 bg-gray-800/95 backdrop-blur-sm overflow-y-auto transition-all border-t lg:border-t-0 lg:border-l border-gray-700 flex-shrink-0 ${
//           isMobile && !showMobileControls ? 'max-h-0 opacity-0' : 'max-h-[40vh] lg:max-h-full opacity-100'
//         }`}>
//           <div className="p-2.5 sm:p-3 space-y-2.5">
            
//             {/* FLOOR TILE SECTION */}
//             <section className="bg-gray-900/50 rounded-lg p-2 border-2 border-blue-500/30">
//               <button
//                 onClick={() => toggleSection('floor')}
//                 className="w-full flex items-center justify-between mb-1.5 lg:cursor-default"
//               >
//                 <h3 className="text-white font-bold text-[11px] flex items-center gap-1">
//                   <Package className="w-3 h-3 text-blue-400" />
//                   Floor Tile
//                 </h3>
//                 {isMobile && (expandedSection === 'floor' ? <ChevronUp className="w-3.5 h-3.5 text-gray-400" /> : <ChevronDown className="w-3.5 h-3.5 text-gray-400" />)}
//               </button>

//               <div className={`space-y-1.5 ${isMobile && expandedSection !== 'floor' ? 'hidden' : 'block'}`}>
//                 <div className="bg-gray-800 rounded p-1.5 border border-gray-700">
//                   <div className="flex items-center gap-1.5">
//                     <img src={tile.imageUrl} alt={tile.name} className="w-10 h-10 object-cover rounded ring-2 ring-blue-500/50" />
//                     <div className="flex-1 min-w-0">
//                       <p className="text-white font-medium text-[10px] truncate">{tile.name}</p>
//                       <p className="text-gray-400 text-[9px]">{tile.size}</p>
                      
//                       {floorTile.size && (
//                         <div className="bg-green-900/30 rounded px-1 py-0.5 mt-0.5">
//                           <p className="text-green-300 text-[8px] font-mono">
//                             Exact: {floorTile.size.width}×{floorTile.size.height}cm
//                           </p>
//                         </div>
//                       )}
                      
//                       {(tile.tileSurface || tile.tileMaterial) && (
//                         <div className="flex flex-wrap gap-0.5 mt-0.5">
//                           {tile.tileSurface && (
//                             <span className="bg-blue-500/20 text-blue-300 px-1 py-0.5 rounded text-[8px]">
//                               {tile.tileSurface}
//                             </span>
//                           )}
//                           {tile.tileMaterial && (
//                             <span className="bg-purple-500/20 text-purple-300 px-1 py-0.5 rounded text-[8px]">
//                               {tile.tileMaterial}
//                             </span>
//                           )}
//                         </div>
//                       )}
//                       <p className="text-green-400 text-[9px] mt-0.5 flex items-center gap-0.5">
//                         <CheckCircle className="w-2 h-2" />
//                         Applied from QR
//                       </p>
//                       {floorTile.sellerId && (
//                         <p className="text-blue-400 text-[8px] mt-0.5 flex items-center gap-0.5">
//                           🔒 Showroom: {floorTile.sellerId.substring(0, 8)}...
//                         </p>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </section>

//             {/* WALL TILE SECTION */}
//             {isKitchenOrBathroom && (
//               <section className="bg-gray-900/50 rounded-lg p-2 border-2 border-purple-500/30">
//                 <button
//                   onClick={() => toggleSection('wall')}
//                   className="w-full flex items-center justify-between mb-1.5 lg:cursor-default"
//                 >
//                   <h3 className="text-white font-bold text-[11px] flex items-center gap-1">
//                     <Package className="w-3 h-3 text-purple-400" />
//                     Wall Tile
//                   </h3>
//                   {isMobile && (expandedSection === 'wall' ? <ChevronUp className="w-3.5 h-3.5 text-gray-400" /> : <ChevronDown className="w-3.5 h-3.5 text-gray-400" />)}
//                 </button>

//                 <div className={`space-y-1.5 ${isMobile && expandedSection !== 'wall' ? 'hidden' : 'block'}`}>
                  
//                   {!floorTile.sellerId && (
//                     <div className="bg-red-900/30 rounded p-1.5 border border-red-500/30 mb-2">
//                       <p className="text-red-200 text-[9px] flex items-start gap-1">
//                         <AlertCircle className="w-2.5 h-2.5 flex-shrink-0 mt-0.5" />
//                         <span><strong>Floor tile must be scanned first!</strong></span>
//                       </p>
//                     </div>
//                   )}
                  
//                   <div>
//                     <label className="text-white text-[9px] font-medium mb-1 block">Input Method:</label>
//                     <div className="grid grid-cols-2 gap-1">
                    
                  
//                     </div>
//                   </div>

//                   {wallTileInputMethod === 'qr' && (
//                     <div className="space-y-1.5">
//                       {wallTile.texture ? (
//                         <div className="bg-gray-800 rounded p-1.5 border border-gray-700">
//                           <img src={wallTile.texture} alt="Wall Tile" className="w-full h-20 object-cover rounded mb-1 ring-2 ring-purple-500/50" />
//                           <p className="text-green-400 text-[9px] flex items-center gap-0.5 mb-1">
//                             <CheckCircle className="w-2 h-2" />
//                             {wallTile.tileName || 'Wall tile applied'}
//                           </p>
                          
//                           {wallTile.size && (
//                             <div className="bg-green-900/30 rounded px-1 py-0.5 mb-1">
//                               <p className="text-green-300 text-[8px] font-mono">
//                                 Exact: {wallTile.size.width}×{wallTile.size.height}cm
//                               </p>
//                             </div>
//                           )}
                          
//                           {wallTile.sellerId && (
//                             <p className="text-blue-400 text-[8px] mb-1">
//                               🔒 Showroom: {wallTile.sellerId.substring(0, 8)}...
//                             </p>
//                           )}
//                           <button
//                             onClick={() => setShowWallScanner(true)}
//                             className="w-full bg-purple-600 text-white py-1 rounded text-[9px] font-medium hover:bg-purple-700 transition-colors"
//                           >
//                             Scan Different Wall Tile
//                           </button>
//                         </div>
//                       ) : (
//                         <button
//                           onClick={() => setShowWallScanner(true)}
//                           disabled={scannerLoading || !floorTile.sellerId}
//                           className="w-full bg-purple-600 text-white py-1.5 rounded font-semibold hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1 text-[10px]"
//                         >
//                           {scannerLoading ? (
//                             <>
//                               <Loader className="w-3 h-3 animate-spin" />
//                               Loading...
//                             </>
//                           ) : (
//                             <>
//                               <Scan className="w-3 h-3" />
//                               Scan Wall Tile QR Code
//                             </>
//                           )}
//                         </button>
//                       )}

//                       <div className="bg-purple-900/30 rounded p-1.5 border border-purple-500/30">
//                         <p className="text-purple-200 text-[9px] flex items-start gap-1">
//                           <Info className="w-2.5 h-2.5 flex-shrink-0 mt-0.5" />
//                           <span>
//                             <strong>Tip:</strong> Scan QR from another tile.
//                             {floorTile.sellerId && <> Must be from same showroom.</>}
//                           </span>
//                         </p>
//                       </div>
//                     </div>
//                   )}

//                   {wallTileInputMethod === 'upload' && (
//                     <div className="space-y-1.5">
//                       <ImageUpload
//                         currentImage={wallTile.texture}
//                         onImageUploaded={handleWallTileUpload}
//                         placeholder="Upload wall tile"
//                         folder="wall-tiles"
//                       />
//                       <div className="bg-blue-900/30 rounded p-1.5 border border-blue-500/30">
//                         <p className="text-blue-200 text-[9px] flex items-start gap-1">
//                           <Info className="w-2.5 h-2.5 flex-shrink-0 mt-0.5" />
//                           <span>
//                             Upload custom wall tile.
//                             {floorTile.sellerId && <strong> Will be linked to {floorTile.tileName}'s showroom.</strong>}
//                           </span>
//                         </p>
//                       </div>
//                     </div>
//                   )}

//                   {wallTile.texture && (
//                     <>
//                       <div className="bg-yellow-900/30 rounded-lg p-2 border-2 border-yellow-500/40">
//                         <label className="text-yellow-200 text-[10px] font-bold mb-1.5 flex items-center gap-1 block">
//                           <ArrowUpDown className="w-3 h-3" />
//                           Wall Tile Height
//                         </label>
//                         <div className="grid grid-cols-3 gap-1 mb-1.5">
//                           {WALL_TILE_HEIGHTS.map((option) => (
//                             <button
//                               key={option.value}
//                               onClick={() => {
//                                 setWallTileHeight(option.value);
//                                 setSuccess(`📏 Wall height set to ${option.value} feet`);
//                               }}
//                               className={`px-2 py-1.5 rounded text-[9px] font-bold transition-all ${
//                                 wallTileHeight === option.value
//                                   ? 'bg-yellow-600 text-white ring-2 ring-yellow-400 scale-105'
//                                   : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
//                               }`}
//                             >
//                               {option.label}
//                             </button>
//                           ))}
//                         </div>
//                         <div className="bg-gray-800/50 rounded p-1.5">
//                           <p className="text-yellow-100 text-[9px] font-medium">
//                             {WALL_TILE_HEIGHTS.find(h => h.value === wallTileHeight)?.description}
//                           </p>
//                           <p className="text-gray-400 text-[8px] mt-0.5">
//                             Tiles will cover {wallTileHeight}ft of 11ft wall height
//                           </p>
//                         </div>
//                       </div>
//                     </>
//                   )}

//                   {wallTile.texture && (
//                     <div>
//                       <label className="text-white text-[9px] font-medium mb-1 block">Wall Tile Size:</label>
//                       <div className="grid grid-cols-3 gap-0.5">
//                         {WALL_SIZES.map((size) => (
//                           <button
//                             key={size.label}
//                             onClick={() => setWallTile({ ...wallTile, size })}
//                             className={`px-1.5 py-0.5 rounded text-[9px] font-medium transition-all ${
//                               wallTile.size.width === size.width && wallTile.size.height === size.height
//                                 ? 'bg-purple-600 text-white ring-1 ring-purple-400'
//                                 : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
//                             }`}
//                           >
//                             {size.label}
//                           </button>
//                         ))}
//                       </div>
//                       <p className="text-gray-400 text-[9px] mt-0.5">
//                         Selected: {wallTile.size.width}×{wallTile.size.height} cm
//                       </p>
//                     </div>
//                   )}
//                 </div>
//               </section>
//             )}

//             {/* TILE CALCULATOR SECTION */}
//             {tileCount && calculationDims && (
//               <section className="bg-gradient-to-br from-green-900/50 to-emerald-900/50 rounded-lg p-2 border-2 border-green-500/40">
//                 <button
//                   onClick={() => toggleSection('calculator')}
//                   className="w-full flex items-center justify-between mb-1.5 lg:cursor-default"
//                 >
               
//                   {isMobile && (expandedSection === 'calculator' ? <ChevronUp className="w-3.5 h-3.5 text-gray-400" /> : <ChevronDown className="w-3.5 h-3.5 text-gray-400" />)}
//                 </button>

//                 <div className={`space-y-1.5 ${isMobile && expandedSection !== 'calculator' ? 'hidden' : 'block'}`}>
                  
//                   {/* Dimension Display */}
//                   <div className="bg-gray-900/70 rounded-lg p-2 border border-green-500/30 space-y-1.5">
//                     {/* Visual Dimensions */}
//                     <div className="flex items-center justify-between">
//                       <div className="flex-1">
                     
//                       </div>
                      
//                     </div>

//                     {/* Calculation Dimensions */}
                   
                     
//                       <div className="flex gap-1">
                       
//                         {hasCustomCalculationDims(roomType || 'kitchen') && (
//                           <button
//                             onClick={() => {
//                               resetCalculationDimensions(roomType || 'kitchen');
//                               setCalculationDims(getCalculationDimensions(roomType || 'kitchen'));
//                               setSuccess('🔄 Reset to visual dimensions');
//                             }}
//                             className="bg-gray-600 hover:bg-gray-700 text-white px-2 py-1 rounded text-[8px] font-semibold transition-all"
//                           >
//                             Reset
//                           </button>
//                         )}
//                       </div>
//                     </div>

//                     {/* Info Banner */}
//                     {hasCustomCalculationDims(roomType || 'kitchen') && (
//                       <div className="bg-yellow-900/30 rounded px-1.5 py-1 border border-yellow-500/30">
//                         <p className="text-yellow-200 text-[7px] flex items-center gap-1">
//                           <Info className="w-2 h-2" />
//                           Tile counts below are for YOUR {calculationDims.width}×{calculationDims.depth} room
//                         </p>
//                       </div>
//                     )}
//                   </div>
                  
//                   {/* FLOOR TILES COUNT */}
//                   <div className="bg-gray-800/80 rounded-lg p-2 border border-green-500/30">
//                     <div className="flex items-center justify-between mb-1.5">
//                       <p className="text-green-300 text-[10px] font-semibold flex items-center gap-1">
//                         <Package className="w-3 h-3" />
//                         🟫 Floor Tiles
//                       </p>
//                       <span className="bg-green-600 text-white px-2.5 py-1 rounded-full text-[11px] font-bold">
//                         {tileCount.floor}
//                       </span>
//                     </div>
                    
//                     <div className="text-[8px] text-gray-400 space-y-0.5 bg-gray-900/30 rounded p-1.5">
//                       <p className="font-semibold text-green-300">✅ Scanned Tile Size:</p>
//                       <p>📏 {floorTile.size.width} × {floorTile.size.height} cm</p>
//                       <p>🔲 Per tile: {tileCount.tileAreaSqFt?.toFixed(4)} sq ft</p>
//                       <p className="text-blue-300 font-semibold">
//                         🏠 Room: {calculationDims.width}×{calculationDims.depth} = {tileCount.roomAreaSqFt?.toFixed(1)} sq ft
//                       </p>
//                       <p className="text-green-400 font-bold border-t border-gray-700 pt-0.5 mt-0.5">
//                         ✓ Total: {tileCount.floor} tiles (with 8% wastage)
//                       </p>
//                     </div>
//                   </div>

//                   {/* WALL TILES WITH HIGHLIGHTER BREAKDOWN */}
//                   {isKitchenOrBathroom && wallTile.texture && wallTile.size && highlighterBreakdown && (
//                     <div className="bg-gray-800/80 rounded-lg p-2 border border-purple-500/30">
//                       <p className="text-purple-300 text-[10px] font-semibold mb-1.5 flex items-center gap-1">
//                         <Layers className="w-3 h-3" />
//                         🧱 Wall Tiles Breakdown
//                         <span className="text-[7px] bg-purple-600/30 px-1 py-0.5 rounded">
//                           {roomType === 'kitchen' ? 'Back Wall' : 'All 4 Walls'}
//                         </span>
//                       </p>
                      
//                       <div className="space-y-1.5 mb-2">
//                         {[
//                           { height: 5, label: '5 Feet', desc: 'Waist height' },
//                           { height: 8, label: '8 Feet', desc: 'Standard bathroom' },
//                           { height: 11, label: '11 Feet', desc: 'Full wall' }
//                         ].map(({ height, label, desc }) => {
//                           const baseKey = `wall_${height}ft_base` as keyof HighlighterBreakdown;
//                           const highlighterKey = `wall_${height}ft_highlighter` as keyof HighlighterBreakdown;
//                           const baseCount = highlighterBreakdown[baseKey];
//                           const highlighterCount = highlighterBreakdown[highlighterKey];
//                           const totalCount = baseCount + highlighterCount;
//                           const highlighterPercent = totalCount > 0 ? (highlighterCount / totalCount * 100).toFixed(1) : '0.0';
                          
//                           return (
//                             <div 
//                               key={height}
//                               className={`p-2 rounded transition-all ${
//                                 wallTileHeight === height 
//                                   ? 'bg-gradient-to-r from-yellow-600/40 to-orange-600/40 ring-2 ring-yellow-500 scale-105' 
//                                   : 'bg-gray-700/50'
//                               }`}
//                             >
//                               <div className="flex items-center justify-between mb-1.5">
//                                 <div>
//                                   <p className="text-white text-[9px] font-semibold">{label}</p>
//                                   <p className="text-gray-400 text-[7px]">{desc}</p>
//                                 </div>
//                                 <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${
//                                   wallTileHeight === height 
//                                     ? 'bg-yellow-600 text-white' 
//                                     : 'bg-gray-600 text-gray-300'
//                                 }`}>
//                                   {totalCount}
//                                 </span>
//                               </div>
                              
//                               <div className="grid grid-cols-2 gap-1 mt-1.5">
//                                 <div className="bg-blue-900/40 rounded px-1.5 py-1 border border-blue-500/30">
//                                   <p className="text-blue-300 text-[8px] font-semibold flex items-center gap-0.5">
//                                     <Package className="w-2 h-2" />
//                                     Base
//                                   </p>
//                                   <p className="text-blue-100 text-[11px] font-bold">{baseCount}</p>
//                                 </div>
//                                 <div className="bg-orange-900/40 rounded px-1.5 py-1 border border-orange-500/30">
//                                   <p className="text-orange-300 text-[8px] font-semibold flex items-center gap-0.5">
//                                     <TrendingUp className="w-2 h-2" />
//                                     Highlight
//                                   </p>
//                                   <p className="text-orange-100 text-[11px] font-bold">{highlighterCount}</p>
//                                 </div>
//                               </div>
                              
//                               {highlighterCount > 0 && (
//                                 <div className="mt-1 bg-green-900/30 rounded px-1.5 py-1">
//                                   <p className="text-green-300 text-[7px]">
//                                     ✅ {highlighterPercent}% highlighter coverage
//                                   </p>
//                                 </div>
//                               )}
//                             </div>
//                           );
//                         })}
//                       </div>

//                       <div className="text-[8px] text-gray-400 space-y-0.5 bg-gray-900/30 rounded p-1.5">
//                         <p className="font-semibold text-purple-300">✅ Wall Tile:</p>
//                         <p>📏 {wallTile.size.width} × {wallTile.size.height} cm</p>
//                         <p className="text-blue-300">
//                           🏠 Perimeter: {tileCount.perimeter.toFixed(1)} ft ({calculationDims.width}×{calculationDims.depth} room)
//                         </p>
//                         <p className="text-yellow-400 font-semibold">
//                           ✓ Selected: {wallTileHeight}ft height
//                         </p>
//                       </div>
//                     </div>
//                   )}

//                   {/* Universal Calculator Button */}
//                   <button
//                     onClick={() => setShowTileCalculator(true)}
//                     className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 rounded-lg font-bold hover:from-blue-700 hover:to-purple-700 transition-all flex items-center justify-center gap-1.5 text-[10px] shadow-lg"
//                   >
//                     <Calculator className="w-3.5 h-3.5" />
//                     Open Universal Calculator
//                   </button>
//                 </div>
//               </section>
//             )}

          

//             {/* VIEW MODE SECTION */}
//             {isKitchenOrBathroom && (
//               <section>
//                 <label className="block text-white font-semibold mb-1 text-[10px]">View Mode:</label>
//                 <div className="grid grid-cols-3 gap-1">
//                   <button
//                     onClick={() => setActiveSurface('floor')}
//                     className={`px-1.5 py-1 rounded font-medium transition-all text-[9px] ${
//                       activeSurface === 'floor' ? 'bg-blue-600 text-white ring-1 ring-blue-400' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
//                     }`}
//                   >
//                     Floor
//                   </button>
//                   <button
//                     onClick={() => setActiveSurface('wall')}
//                     className={`px-1.5 py-1 rounded font-medium transition-all text-[9px] ${
//                       activeSurface === 'wall' ? 'bg-purple-600 text-white ring-1 ring-purple-400' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
//                     }`}
//                   >
//                     Wall
//                   </button>
//                   <button
//                     onClick={() => setActiveSurface('both')}
//                     className={`px-1.5 py-1 rounded font-medium transition-all text-[9px] ${
//                       activeSurface === 'both' ? 'bg-green-600 text-white ring-1 ring-green-400' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
//                     }`}
//                   >
//                     Both
//                   </button>
//                 </div>
//               </section>
//             )}

//             {/* FEATURES SECTION */}
            

//       {/* MODALS */}
//       {showWallScanner && (
//         <QRScanner
//           onScanSuccess={async (data) => {
//             if (data.tileId) {
//               setShowWallScanner(false);
//               await loadWallTileFromQR(data.tileId);
//             } else {
//               setError('Invalid QR code');
//             }
//           }}
//           onClose={() => setShowWallScanner(false)}
//           currentUser={verifiedUser ? {
//             role: verifiedUser.role,
//             user_id: verifiedUser.uid,
//             showroom_id: verifiedUser.seller_id
//           } : undefined}
//         />
//       )}

//       {/* Visual Dimension Editor */}
//       {showDimensionEditor && (
//         <RoomDimensionModal
//           isOpen={showDimensionEditor}
//           onClose={() => setShowDimensionEditor(false)}
//           onSubmit={handleDimensionUpdate}
//           roomName={`${roomType?.charAt(0).toUpperCase()}${roomType?.slice(1)} Visual Size`}
//           defaultWidth={currentDimensions?.width || 10}
//           defaultDepth={currentDimensions?.depth || 12}
//           defaultHeight={currentDimensions?.height || 11}
//         />
//       )}

//       {/* Calculation Dimension Editor */}
//       {showCalculationDimEditor && calculationDims && (
//         <RoomDimensionModal
//           isOpen={showCalculationDimEditor}
//           onClose={() => setShowCalculationDimEditor(false)}
//           onSubmit={handleCalculationDimensionUpdate}
//           roomName={`${roomType?.charAt(0).toUpperCase()}${roomType?.slice(1)} Calculation Size`}
//           defaultWidth={calculationDims.width}
//           defaultDepth={calculationDims.depth}
//           defaultHeight={calculationDims.height}
//         />
//       )}

//       {/* ✅ Universal Tile Calculator */}
//       {tile && (
//         <UniversalTileCalculator
//           isOpen={showTileCalculator}
//           onClose={() => {
//             console.log('🔄 Universal Calculator closed, syncing dimensions...');

//             setShowTileCalculator(false);
            
//             const latestDims = getCalculationDimensions(roomType || 'kitchen');
            
//             const dimsChanged = calculationDims && (
//               latestDims.width !== calculationDims.width ||
//               latestDims.depth !== calculationDims.depth ||
//               latestDims.height !== calculationDims.height
//             );
            
//             if (dimsChanged) {
//               console.log('📐 Dimensions changed in Universal Calculator:', {
//                 old: calculationDims,
//                 new: latestDims
//               });
              
//               setCalculationDims({ ...latestDims });
//               setDimsVersion(prev => prev + 1);
              
//               setSuccess('✅ Calculator closed');
//             } else {
//               console.log('✅ No dimension changes detected');
//             }
            
//             console.log('✅ Dimensions reloaded:', latestDims);
//           }}
//           initialFloorTile={
//             floorTile.texture
//               ? {
//                   name: floorTile.tileName || tile.name,
//                   size: floorTile.size,
//                   imageUrl: floorTile.texture
//                 }
//               : undefined
//           }
//           roomType={roomType === 'kitchen' ? 'kitchen' : roomType === 'bathroom' ? 'bathroom' : 'all'}
//           defaultDimensions={calculationDims || undefined}
//         />
//       )}

//     </div>
//   );
// }   
import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Share2, Loader, Scan,
  Package, AlertCircle, CheckCircle, X, Info,
  ChevronDown, ChevronUp, Eye, ArrowUpDown,
  Calculator, Layers, TrendingUp
} from 'lucide-react';
import { Enhanced3DViewer } from '../components/Enhanced3DViewer';
import { ImageUpload } from '../components/ImageUpload';
import { QRScanner } from '../components/QRScanner';
import { RoomDimensionModal } from '../components/RoomDimensionModal';
import { UniversalTileCalculator } from '../components/TileCalculatorModal';
import { getTileById, trackQRScan, saveCustomerInquiry } from '../lib/firebaseutils';
import { Tile } from '../types';
import { auth, db } from '../lib/firebase';
import { CustomerInquiryForm } from '../components/CustomerInquiryForm';
import { getDoc, doc, collection, query, where, getDocs } from 'firebase/firestore';
import { getCustomerFromSession, isSessionValid } from '../utils/customerSession';
import { useAppStore } from '../stores/appStore';
import {
  getCalculationDimensions,
  saveCalculationDimensions,
  hasCustomCalculationDims,
  resetCalculationDimensions
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
  const [highlightTileBorders] = useState(false);
  const [dimsVersion, setDimsVersion] = useState(0);
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

  const getWallDimensions = useCallback((wall: WallType, customWallHeight?: number) => {
    const config = ROOM_CONFIGS[roomType as keyof typeof ROOM_CONFIGS];
    if (!config) return { cols: 0, rows: 0 };

    const wallTileSize = wallTile.size || { width: 30, height: 45 };

    const tileWidthFt = wallTileSize.width * 0.0328084;
    const tileHeightFt = wallTileSize.height * 0.0328084;

    const heightInFeet = customWallHeight || (config.height / 0.3048);

    const wallWidthFeet = (wall === 'back' || wall === 'front') 
      ? (config.width / 0.3048) 
      : (config.depth / 0.3048);

    const cols = Math.ceil(wallWidthFeet / tileWidthFt);
    const rows = Math.ceil(heightInFeet / tileHeightFt);

    return { cols, rows };
  }, [roomType, wallTile.size]);

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

  const toggleSection = useCallback((section: 'floor' | 'wall' | 'dimensions' | 'calculator') => {
    setExpandedSection(expandedSection === section ? null : section);
  }, [expandedSection]);

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

        {/* ✅ SIDEBAR - COMPLETE WITH PROPER CLOSING */}
        <aside className={`lg:w-72 xl:w-80 bg-gray-800/95 backdrop-blur-sm overflow-y-auto transition-all border-t lg:border-t-0 lg:border-l border-gray-700 flex-shrink-0 ${
          isMobile && !showMobileControls ? 'max-h-0 opacity-0' : 'max-h-[40vh] lg:max-h-full opacity-100'
        }`}>
          <div className="p-2.5 sm:p-3 space-y-2.5">
            
            {/* FLOOR TILE SECTION */}
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

            {/* WALL TILE SECTION */}
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
                </div>
              </section>
            )}

            {/* TILE CALCULATOR SECTION */}
            {tileCount && calculationDims && (
              <section className="bg-gradient-to-br from-green-900/50 to-emerald-900/50 rounded-lg p-2 border-2 border-green-500/40">
                <button
                  onClick={() => toggleSection('calculator')}
                  className="w-full flex items-center justify-between mb-1.5 lg:cursor-default"
                >
                 
                  {isMobile && (expandedSection === 'calculator' ? <ChevronUp className="w-3.5 h-3.5 text-gray-400" /> : <ChevronDown className="w-3.5 h-3.5 text-gray-400" />)}
                </button>

                <div className={`space-y-1.5 ${isMobile && expandedSection !== 'calculator' ? 'hidden' : 'block'}`}>
                  
                  {/* Dimension Display */}
                  <div className="bg-gray-900/70 rounded-lg p-2 border border-green-500/30 space-y-1.5">
                    <div className="flex items-center justify-between">
                    
                      
                      <div className="flex gap-1">
                       
                        {hasCustomCalculationDims(roomType || 'kitchen') && (
                          <button
                            onClick={() => {
                              resetCalculationDimensions(roomType || 'kitchen');
                              setCalculationDims(getCalculationDimensions(roomType || 'kitchen'));
                              setSuccess('🔄 Reset to visual dimensions');
                            }}
                            className="bg-gray-600 hover:bg-gray-700 text-white px-2 py-1 rounded text-[8px] font-semibold transition-all"
                          >
                            Reset
                          </button>
                        )}
                      </div>
                    </div>

                    {hasCustomCalculationDims(roomType || 'kitchen') && (
                      <div className="bg-yellow-900/30 rounded px-1.5 py-1 border border-yellow-500/30">
                        <p className="text-yellow-200 text-[7px] flex items-center gap-1">
                          <Info className="w-2 h-2" />
                          Tile counts below are for YOUR {calculationDims.width}×{calculationDims.depth} room
                        </p>
                      </div>
                    )}
                  </div>
                  
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
                      <p className="font-semibold text-green-300">✅ Scanned Tile Size:</p>
                      <p>📏 {floorTile.size.width} × {floorTile.size.height} cm</p>
                      <p>🔲 Per tile: {tileCount.tileAreaSqFt?.toFixed(4)} sq ft</p>
                      <p className="text-blue-300 font-semibold">
                        🏠 Room: {calculationDims.width}×{calculationDims.depth} = {tileCount.roomAreaSqFt?.toFixed(1)} sq ft
                      </p>
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
                                    Base
                                  </p>
                                  <p className="text-blue-100 text-[11px] font-bold">{baseCount}</p>
                                </div>
                                <div className="bg-orange-900/40 rounded px-1.5 py-1 border border-orange-500/30">
                                  <p className="text-orange-300 text-[8px] font-semibold flex items-center gap-0.5">
                                    <TrendingUp className="w-2 h-2" />
                                    Highlight
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

                      <div className="text-[8px] text-gray-400 space-y-0.5 bg-gray-900/30 rounded p-1.5">
                        <p className="font-semibold text-purple-300">✅ Wall Tile:</p>
                        <p>📏 {wallTile.size.width} × {wallTile.size.height} cm</p>
                        <p className="text-blue-300">
                          🏠 Perimeter: {tileCount.perimeter.toFixed(1)} ft ({calculationDims.width}×{calculationDims.depth} room)
                        </p>
                        <p className="text-yellow-400 font-semibold">
                          ✓ Selected: {wallTileHeight}ft height
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Universal Calculator Button */}
                  <button
                    onClick={() => setShowTileCalculator(true)}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 rounded-lg font-bold hover:from-blue-700 hover:to-purple-700 transition-all flex items-center justify-center gap-1.5 text-[10px] shadow-lg"
                  >
                    <Calculator className="w-3.5 h-3.5" />
                    Open Universal Calculator
                  </button>
                </div>
              </section>
            )}

            {/* VIEW MODE SECTION */}
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
              
              setSuccess('✅ Calculator closed');
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