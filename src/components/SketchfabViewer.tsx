
// // import React, { useEffect, useRef, useState, useCallback } from 'react';
// // import { Loader, AlertCircle, RefreshCw, CheckCircle } from 'lucide-react';
// // import { SKETCHFAB_CONFIG, getSketchfabModelForRoom } from '../config/sketchfabConfig';

// // // ═══════════════════════════════════════════════════════════════
// // // TYPESCRIPT INTERFACES
// // // ═══════════════════════════════════════════════════════════════

// // interface SketchfabViewerProps {
// //   roomType: 'drawing' | 'kitchen' | 'bathroom';
// //   floorTexture?: string;
// //   tileSize?: {
// //     width: number;
// //     height: number;
// //   };
// //   onReady?: () => void;
// //   onError?: (error: string) => void;
// // }

// // interface SketchfabAPI {
// //   start: () => void;
// //   stop: () => void;
// //   addEventListener: (event: string, callback: (data?: any) => void) => void;
// //   removeEventListener: (event: string, callback: (data?: any) => void) => void;
// //   getMaterialList: (callback: (err: any, materials: Material[]) => void) => void;
// //   addTexture: (url: string, callback: (err: any, textureUid: string) => void) => void;
// //   removeTexture: (textureUid: string, callback?: (err: any) => void) => void;
// //   setTextureUvScale: (textureUid: string, scale: { u: number; v: number }) => void;
// //   setMaterial: (material: Material, callback?: (err: any) => void) => void;
// //   getTextureList: (callback: (err: any, textures: Texture[]) => void) => void;
// // }

// // interface Material {
// //   id: string;
// //   name: string;
// //   channels: {
// //     AlbedoPBR?: {
// //       texture?: { uid: string };
// //       enable?: boolean;
// //       color?: [number, number, number];
// //       factor?: number;
// //     };
// //     [key: string]: any;
// //   };
// //   [key: string]: any;
// // }

// // interface Texture {
// //   uid: string;
// //   name: string;
// //   url: string;
// // }

// // declare global {
// //   interface Window {
// //     Sketchfab: any;
// //   }
// // }

// // // ═══════════════════════════════════════════════════════════════
// // // CONSTANTS
// // // ═══════════════════════════════════════════════════════════════

// // const SCRIPT_LOAD_TIMEOUT = 10000; // 10 seconds
// // const TEXTURE_APPLY_TIMEOUT = 5000; // 5 seconds
// // const MAX_RETRY_ATTEMPTS = 3;
// // const RETRY_DELAY = 2000; // 2 seconds

// // // ═══════════════════════════════════════════════════════════════
// // // MAIN COMPONENT
// // // ═══════════════════════════════════════════════════════════════

// // export const SketchfabViewer: React.FC<SketchfabViewerProps> = ({
// //   roomType,
// //   floorTexture,
// //   tileSize = { width: 60, height: 60 },
// //   onReady,
// //   onError
// // }) => {
// //   // ═════════════════════════════════════════════════════════════
// //   // REFS
// //   // ═════════════════════════════════════════════════════════════

// //   const iframeRef = useRef<HTMLIFrameElement>(null);
// //   const apiRef = useRef<SketchfabAPI | null>(null);
// //   const scriptLoadedRef = useRef(false);
// //   const mountedRef = useRef(true);
// //   const currentTextureUidRef = useRef<string | null>(null);
// //   const retryCountRef = useRef(0);
// //   const initTimeoutRef = useRef<NodeJS.Timeout | null>(null);

// //   // ═════════════════════════════════════════════════════════════
// //   // STATE
// //   // ═════════════════════════════════════════════════════════════

// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState<string | null>(null);
// //   const [modelReady, setModelReady] = useState(false);
// //   const [textureApplied, setTextureApplied] = useState(false);
// //   const [textureLoading, setTextureLoading] = useState(false);
// //   const [initProgress, setInitProgress] = useState<string>('Initializing...');

// //   const modelConfig = getSketchfabModelForRoom(roomType);

// //   // ═════════════════════════════════════════════════════════════
// //   // CLEANUP FUNCTION
// //   // ═════════════════════════════════════════════════════════════

// //   const cleanup = useCallback(() => {
// //     console.log('🧹 Cleaning up SketchfabViewer');

// //     // Clear timeouts
// //     if (initTimeoutRef.current) {
// //       clearTimeout(initTimeoutRef.current);
// //       initTimeoutRef.current = null;
// //     }

// //     // Stop API
// //     if (apiRef.current) {
// //       try {
// //         apiRef.current.stop();
// //       } catch (err) {
// //         console.warn('⚠️ Error stopping Sketchfab API:', err);
// //       }
// //       apiRef.current = null;
// //     }

// //     // Clear texture reference
// //     currentTextureUidRef.current = null;

// //     // Mark as unmounted
// //     mountedRef.current = false;
// //   }, []);

// //   // ═════════════════════════════════════════════════════════════
// //   // SAFE STATE UPDATE
// //   // ═════════════════════════════════════════════════════════════

// //   const safeSetState = useCallback((setState: () => void) => {
// //     if (mountedRef.current) {
// //       setState();
// //     }
// //   }, []);

// //   // ═════════════════════════════════════════════════════════════
// //   // ERROR HANDLER
// //   // ═════════════════════════════════════════════════════════════

// //   const handleError = useCallback((errorMsg: string, shouldRetry = false) => {
// //     console.error('❌ SketchfabViewer Error:', errorMsg);

// //     safeSetState(() => {
// //       setError(errorMsg);
// //       setLoading(false);
// //     });

// //     onError?.(errorMsg);

// //     // Retry logic
// //     if (shouldRetry && retryCountRef.current < MAX_RETRY_ATTEMPTS) {
// //       retryCountRef.current++;
// //       console.log(`🔄 Retry attempt ${retryCountRef.current}/${MAX_RETRY_ATTEMPTS}`);
      
// //       setTimeout(() => {
// //         if (mountedRef.current) {
// //           safeSetState(() => {
// //             setError(null);
// //             setLoading(true);
// //           });
// //           initializeViewer();
// //         }
// //       }, RETRY_DELAY * retryCountRef.current); // Exponential backoff
// //     }
// //   }, [onError, safeSetState]);

// //   // ═════════════════════════════════════════════════════════════
// //   // INITIALIZE SKETCHFAB VIEWER
// //   // ═════════════════════════════════════════════════════════════

// //   const initializeViewer = useCallback(() => {
// //     if (!modelConfig) {
// //       handleError(`Sketchfab model not configured for ${roomType}`, false);
// //       return;
// //     }

// //     if (!window.Sketchfab) {
// //       handleError('Sketchfab API not loaded', true);
// //       return;
// //     }

// //     const iframe = iframeRef.current;
// //     if (!iframe) {
// //       handleError('iFrame reference not available', true);
// //       return;
// //     }

// //     console.log('🚀 Initializing Sketchfab viewer for:', modelConfig.name);
// //     safeSetState(() => setInitProgress('Connecting to Sketchfab...'));

// //     // Set timeout for initialization
// //     initTimeoutRef.current = setTimeout(() => {
// //       handleError('Sketchfab initialization timeout', true);
// //     }, SCRIPT_LOAD_TIMEOUT);

// //     try {
// //       const client = new window.Sketchfab(iframe);

// //       client.init(modelConfig.modelId, {
// //         ...SKETCHFAB_CONFIG.viewer,
        
// //         success: (api: SketchfabAPI) => {
// //           if (!mountedRef.current) return;

// //           console.log('✅ Sketchfab API initialized');
          
// //           if (initTimeoutRef.current) {
// //             clearTimeout(initTimeoutRef.current);
// //             initTimeoutRef.current = null;
// //           }

// //           apiRef.current = api;
// //           retryCountRef.current = 0; // Reset retry count

// //           safeSetState(() => setInitProgress('Starting 3D model...'));
// //           api.start();

// //           // Setup event listeners
// //           const viewerReadyHandler = () => {
// //             if (!mountedRef.current) return;

// //             console.log('✅ Sketchfab viewer ready');
// //             safeSetState(() => {
// //               setModelReady(true);
// //               setLoading(false);
// //               setInitProgress('Model loaded successfully');
// //             });
// //             onReady?.();
// //           };

// //           const errorHandler = (err: any) => {
// //             console.error('❌ Sketchfab viewer error:', err);
// //             handleError(`Viewer error: ${err?.message || 'Unknown error'}`, true);
// //           };

// //           api.addEventListener('viewerready', viewerReadyHandler);
// //           api.addEventListener('error', errorHandler);

// //         },
        
// //         error: (err: any) => {
// //           handleError(
// //             `Sketchfab initialization failed: ${err?.message || err}`,
// //             true
// //           );
// //         }
// //       });

// //     } catch (err: any) {
// //       handleError(
// //         `Failed to create Sketchfab client: ${err?.message || err}`,
// //         true
// //       );
// //     }
// //   }, [modelConfig, roomType, onReady, handleError, safeSetState]);

// //   // ═════════════════════════════════════════════════════════════
// //   // APPLY TILE TEXTURE TO FLOOR
// //   // ═════════════════════════════════════════════════════════════

// //   const applyFloorTexture = useCallback(() => {
// //     if (!apiRef.current || !modelReady || !floorTexture || !modelConfig) {
// //       console.log('⚠️ Cannot apply texture - prerequisites not met');
// //       return;
// //     }

// //     console.log('🎨 Starting floor texture application:', floorTexture);
    
// //     safeSetState(() => {
// //       setTextureLoading(true);
// //       setTextureApplied(false);
// //     });

// //     const api = apiRef.current;

// //     // Timeout for texture application
// //     const textureTimeout = setTimeout(() => {
// //       if (textureLoading) {
// //         handleError('Texture application timeout', false);
// //         safeSetState(() => setTextureLoading(false));
// //       }
// //     }, TEXTURE_APPLY_TIMEOUT);

// //     // Step 1: Remove old texture if exists
// //     const removeOldTexture = (callback: () => void) => {
// //       if (currentTextureUidRef.current) {
// //         console.log('🗑️ Removing old texture:', currentTextureUidRef.current);
// //         api.removeTexture(currentTextureUidRef.current, (err) => {
// //           if (err) {
// //             console.warn('⚠️ Failed to remove old texture:', err);
// //           }
// //           currentTextureUidRef.current = null;
// //           callback();
// //         });
// //       } else {
// //         callback();
// //       }
// //     };

// //     removeOldTexture(() => {
// //       if (!mountedRef.current) return;

// //       // Step 2: Get all materials
// //       api.getMaterialList((err, materials) => {
// //         if (!mountedRef.current) return;

// //         if (err) {
// //           clearTimeout(textureTimeout);
// //           handleError(`Failed to get materials: ${err}`, false);
// //           safeSetState(() => setTextureLoading(false));
// //           return;
// //         }

// //         console.log('📦 Available materials:', materials.map(m => m.name));

// //         // Step 3: Find floor material
// //         const floorMaterial = materials.find(
// //           m => m.name === modelConfig.floorMaterialName
// //         );

// //         if (!floorMaterial) {
// //           clearTimeout(textureTimeout);
// //           handleError(
// //             `Floor material "${modelConfig.floorMaterialName}" not found in model`,
// //             false
// //           );
// //           safeSetState(() => setTextureLoading(false));
// //           return;
// //         }

// //         console.log('✅ Found floor material:', floorMaterial.name);

// //         // Step 4: Upload new texture
// //         api.addTexture(floorTexture, (err, textureUid) => {
// //           if (!mountedRef.current) return;

// //           if (err) {
// //             clearTimeout(textureTimeout);
// //             handleError(`Failed to upload texture: ${err}`, false);
// //             safeSetState(() => setTextureLoading(false));
// //             return;
// //           }

// //           console.log('✅ Texture uploaded:', textureUid);
// //           currentTextureUidRef.current = textureUid;

// //           // Step 5: Calculate UV scale for tile repetition
// //           // Formula: scale = reference_size / tile_size
// //           // Smaller tiles = higher scale value = more repetitions
// //           const referenceSize = 100; // Base reference in cm
// //           const scaleU = referenceSize / tileSize.width;
// //           const scaleV = referenceSize / tileSize.height;

// //           console.log('📏 UV Scale calculated:', { u: scaleU, v: scaleV });

// //           try {
// //             // Step 6: Set UV tiling
// //             api.setTextureUvScale(textureUid, { u: scaleU, v: scaleV });

// //             // Step 7: Apply texture to material
// //             const updatedMaterial: Material = {
// //               ...floorMaterial,
// //               channels: {
// //                 ...floorMaterial.channels,
// //                 AlbedoPBR: {
// //                   texture: { uid: textureUid },
// //                   enable: true,
// //                   factor: 1.0
// //                 }
// //               }
// //             };

// //             api.setMaterial(updatedMaterial, (err) => {
// //               clearTimeout(textureTimeout);

// //               if (!mountedRef.current) return;

// //               if (err) {
// //                 handleError(`Failed to apply texture: ${err}`, false);
// //                 safeSetState(() => setTextureLoading(false));
// //                 return;
// //               }

// //               console.log('✅ Floor texture applied successfully');
// //               safeSetState(() => {
// //                 setTextureLoading(false);
// //                 setTextureApplied(true);
// //               });

// //               // Auto-hide success message after 3 seconds
// //               setTimeout(() => {
// //                 if (mountedRef.current) {
// //                   safeSetState(() => setTextureApplied(false));
// //                 }
// //               }, 3000);
// //             });

// //           } catch (err: any) {
// //             clearTimeout(textureTimeout);
// //             handleError(
// //               `Texture application error: ${err?.message || err}`,
// //               false
// //             );
// //             safeSetState(() => setTextureLoading(false));
// //           }
// //         });
// //       });
// //     });
// //   }, [
// //     floorTexture,
// //     tileSize,
// //     modelReady,
// //     modelConfig,
// //     textureLoading,
// //     handleError,
// //     safeSetState
// //   ]);

// //   // ═════════════════════════════════════════════════════════════
// //   // EFFECTS
// //   // ═════════════════════════════════════════════════════════════

// //   // Load Sketchfab API script
// //   useEffect(() => {
// //     mountedRef.current = true;

// //     const loadScript = () => {
// //       if (window.Sketchfab || scriptLoadedRef.current) {
// //         console.log('✅ Sketchfab API already loaded');
// //         initializeViewer();
// //         return;
// //       }

// //       console.log('📥 Loading Sketchfab API script...');
// //       safeSetState(() => setInitProgress('Loading Sketchfab API...'));

// //       const script = document.createElement('script');
// //       script.src = 'https://static.sketchfab.com/api/sketchfab-viewer-1.12.1.js';
// //       script.async = true;

// //       const scriptTimeout = setTimeout(() => {
// //         handleError('Script loading timeout', true);
// //       }, SCRIPT_LOAD_TIMEOUT);

// //       script.onload = () => {
// //         clearTimeout(scriptTimeout);
// //         console.log('✅ Sketchfab API script loaded');
// //         scriptLoadedRef.current = true;
// //         if (mountedRef.current) {
// //           initializeViewer();
// //         }
// //       };

// //       script.onerror = () => {
// //         clearTimeout(scriptTimeout);
// //         handleError('Failed to load Sketchfab API script', true);
// //       };

// //       document.body.appendChild(script);

// //       return () => {
// //         if (script.parentNode) {
// //           document.body.removeChild(script);
// //         }
// //       };
// //     };

// //     const cleanupScript = loadScript();

// //     return () => {
// //       cleanup();
// //       cleanupScript?.();
// //     };
// //   }, [initializeViewer, handleError, cleanup, safeSetState]);

// //   // Apply texture when ready
// //   useEffect(() => {
// //     if (modelReady && floorTexture && !textureLoading) {
// //       applyFloorTexture();
// //     }
// //   }, [modelReady, floorTexture, applyFloorTexture, textureLoading]);

// //   // ═════════════════════════════════════════════════════════════
// //   // RENDER
// //   // ═════════════════════════════════════════════════════════════

// //   if (error) {
// //     return (
// //       <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-red-50 to-rose-100">
// //         <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md text-center">
// //           <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4 animate-pulse" />
// //           <h3 className="text-xl font-bold text-gray-800 mb-2">
// //             Sketchfab Error
// //           </h3>
// //           <p className="text-gray-600 text-sm mb-4 break-words">
// //             {error}
// //           </p>
// //           {retryCountRef.current >= MAX_RETRY_ATTEMPTS && (
// //             <p className="text-gray-500 text-xs mb-4">
// //               Maximum retry attempts reached. Please refresh the page.
// //             </p>
// //           )}
// //           <button
// //             onClick={() => {
// //               retryCountRef.current = 0;
// //               safeSetState(() => {
// //                 setError(null);
// //                 setLoading(true);
// //               });
// //               window.location.reload();
// //             }}
// //             className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-all flex items-center gap-2 mx-auto shadow-lg"
// //           >
// //             <RefreshCw className="w-4 h-4" />
// //             Reload Page
// //           </button>
// //         </div>
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="relative w-full h-full bg-gray-900">
      
// //       {/* ═══════════════════════════════════════════════════════ */}
// //       {/* LOADING OVERLAY */}
// //       {/* ═══════════════════════════════════════════════════════ */}
// //       {loading && (
// //         <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center z-20">
// //           <div className="text-center px-6">
// //             <Loader className="w-20 h-20 text-white animate-spin mx-auto mb-6 drop-shadow-2xl" />
// //             <h3 className="text-white font-bold text-2xl mb-2 drop-shadow-lg">
// //               {modelConfig?.name || 'Loading 3D Model'}
// //             </h3>
// //             <p className="text-blue-200 text-sm mb-4 animate-pulse">
// //               {initProgress}
// //             </p>
// //             <div className="w-64 bg-gray-700 rounded-full h-2 overflow-hidden mx-auto">
// //               <div className="bg-blue-500 h-full w-1/2 animate-pulse rounded-full"></div>
// //             </div>
// //             {retryCountRef.current > 0 && (
// //               <p className="text-yellow-300 text-xs mt-4">
// //                 Retry attempt {retryCountRef.current}/{MAX_RETRY_ATTEMPTS}
// //               </p>
// //             )}
// //           </div>
// //         </div>
// //       )}

// //       {/* ═══════════════════════════════════════════════════════ */}
// //       {/* TEXTURE LOADING INDICATOR */}
// //       {/* ═══════════════════════════════════════════════════════ */}
// //       {textureLoading && (
// //         <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-6 py-3 rounded-xl shadow-2xl z-30 flex items-center gap-3 animate-slideDown">
// //           <Loader className="w-5 h-5 animate-spin" />
// //           <span className="font-bold text-sm">
// //             Applying {tileSize.width}×{tileSize.height}cm tile...
// //           </span>
// //         </div>
// //       )}

// //       {/* ═══════════════════════════════════════════════════════ */}
// //       {/* TEXTURE APPLIED SUCCESS */}
// //       {/* ═══════════════════════════════════════════════════════ */}
// //       {textureApplied && !textureLoading && (
// //         <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-xl shadow-2xl z-30 flex items-center gap-3 animate-slideDown">
// //           <CheckCircle className="w-5 h-5" />
// //           <span className="font-bold text-sm">
// //             ✨ Tile Applied: {tileSize.width}×{tileSize.height}cm
// //           </span>
// //         </div>
// //       )}

// //       {/* ═══════════════════════════════════════════════════════ */}
// //       {/* SKETCHFAB IFRAME */}
// //       {/* ═══════════════════════════════════════════════════════ */}
// //       <iframe
// //         ref={iframeRef}
// //         className="w-full h-full border-0"
// //         title={`${roomType} - Sketchfab 3D Model`}
// //         allow="autoplay; fullscreen; xr-spatial-tracking"
// //         allowFullScreen
// //       />

// //       {/* ═══════════════════════════════════════════════════════ */}
// //       {/* BRANDING (Optional) */}
// //       {/* ═══════════════════════════════════════════════════════ */}
// //       {modelReady && !loading && (
// //         <div className="absolute bottom-4 right-4 bg-black/70 backdrop-blur-sm text-white px-4 py-2 rounded-lg shadow-lg">
// //           <p className="text-xs font-semibold">
// //             ✨ Powered by Sketchfab
// //           </p>
// //         </div>
// //       )}

// //       {/* ═══════════════════════════════════════════════════════ */}
// //       {/* ANIMATIONS */}
// //       {/* ═══════════════════════════════════════════════════════ */}
// //       <style>{`
// //         @keyframes slideDown {
// //           from {
// //             opacity: 0;
// //             transform: translate(-50%, -100%);
// //           }
// //           to {
// //             opacity: 1;
// //             transform: translate(-50%, 0);
// //           }
// //         }
        
// //         .animate-slideDown {
// //           animation: slideDown 0.4s cubic-bezier(0.16, 1, 0.3, 1);
// //         }
// //       `}</style>
// //     </div>
// //   );
// // };

// // export default SketchfabViewer; 
// import React, { useEffect, useRef, useState, useCallback } from 'react';
// import { Loader, AlertCircle, RefreshCw, CheckCircle, Search } from 'lucide-react';
// import { SKETCHFAB_CONFIG, getSketchfabModelForRoom } from '../config/sketchfabConfig';

// // ═══════════════════════════════════════════════════════════════
// // TYPESCRIPT INTERFACES
// // ═══════════════════════════════════════════════════════════════

// interface SketchfabViewerProps {
//   roomType: 'drawing' | 'kitchen' | 'bathroom';
//   floorTexture?: string;
//   tileSize?: {
//     width: number;
//     height: number;
//   };
//   onReady?: () => void;
//   onError?: (error: string) => void;
// }

// interface SketchfabAPI {
//   start: () => void;
//   stop: () => void;
//   addEventListener: (event: string, callback: (data?: any) => void) => void;
//   removeEventListener: (event: string, callback: (data?: any) => void) => void;
//   getMaterialList: (callback: (err: any, materials: Material[]) => void) => void;
//   addTexture: (url: string, callback: (err: any, textureUid: string) => void) => void;
//   removeTexture: (textureUid: string, callback?: (err: any) => void) => void;
//   setTextureUvScale: (textureUid: string, scale: { u: number; v: number }) => void;
//   setMaterial: (material: Material, callback?: (err: any) => void) => void;
//   getTextureList: (callback: (err: any, textures: Texture[]) => void) => void;
// }

// interface Material {
//   id: string;
//   name: string;
//   channels: {
//     AlbedoPBR?: {
//       texture?: { uid: string };
//       enable?: boolean;
//       color?: [number, number, number];
//       factor?: number;
//     };
//     [key: string]: any;
//   };
//   [key: string]: any;
// }

// interface Texture {
//   uid: string;
//   name: string;
//   url: string;
// }

// declare global {
//   interface Window {
//     Sketchfab: any;
//   }
// }

// // ═══════════════════════════════════════════════════════════════
// // CONSTANTS
// // ═══════════════════════════════════════════════════════════════

// const SCRIPT_LOAD_TIMEOUT = 15000; // 15 seconds
// const TEXTURE_APPLY_TIMEOUT = 8000; // 8 seconds
// const MAX_RETRY_ATTEMPTS = 3;
// const RETRY_DELAY = 2000; // 2 seconds

// // ✅ Common floor material names (priority order)
// const FLOOR_MATERIAL_PATTERNS = [
//   // Exact matches (case-sensitive)
//   'Floor',
//   'floor',
//   'Ground',
//   'ground',
  
//   // Common variations
//   'Floor_Material',
//   'floor_material',
//   'FloorMaterial',
//   'Floor Material',
//   'Floor_Mat',
//   'floor_mat',
//   'FloorMat',
  
//   // 3D software defaults
//   'Plane',
//   'plane',
//   'Plane001',
//   'Plane.001',
//   'pPlane1',
  
//   // Descriptive names
//   'Base',
//   'base',
//   'Ground_Plane',
//   'GroundPlane',
//   'Floor_Plane',
//   'FloorPlane',
  
//   // Material slots
//   'Material',
//   'Material.001',
//   'Mat_Floor',
//   'mat_floor'
// ];

// // ═══════════════════════════════════════════════════════════════
// // MAIN COMPONENT
// // ═══════════════════════════════════════════════════════════════

// export const SketchfabViewer: React.FC<SketchfabViewerProps> = ({
//   roomType,
//   floorTexture,
//   tileSize = { width: 60, height: 60 },
//   onReady,
//   onError
// }) => {
//   // ═════════════════════════════════════════════════════════════
//   // REFS
//   // ═════════════════════════════════════════════════════════════

//   const iframeRef = useRef<HTMLIFrameElement>(null);
//   const apiRef = useRef<SketchfabAPI | null>(null);
//   const scriptLoadedRef = useRef(false);
//   const mountedRef = useRef(true);
//   const currentTextureUidRef = useRef<string | null>(null);
//   const retryCountRef = useRef(0);
//   const initTimeoutRef = useRef<NodeJS.Timeout | null>(null);
//   const materialsInspectedRef = useRef(false);
//   const detectedFloorMaterialRef = useRef<string | null>(null);

//   // ═════════════════════════════════════════════════════════════
//   // STATE
//   // ═════════════════════════════════════════════════════════════

//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [modelReady, setModelReady] = useState(false);
//   const [textureApplied, setTextureApplied] = useState(false);
//   const [textureLoading, setTextureLoading] = useState(false);
//   const [initProgress, setInitProgress] = useState<string>('Initializing...');
//   const [showMaterialInspector, setShowMaterialInspector] = useState(false);
//   const [availableMaterials, setAvailableMaterials] = useState<Material[]>([]);

//   const modelConfig = getSketchfabModelForRoom(roomType);

//   // ═════════════════════════════════════════════════════════════
//   // CLEANUP FUNCTION
//   // ═════════════════════════════════════════════════════════════

//   const cleanup = useCallback(() => {
//     console.log('🧹 Cleaning up SketchfabViewer');

//     if (initTimeoutRef.current) {
//       clearTimeout(initTimeoutRef.current);
//       initTimeoutRef.current = null;
//     }

//     if (apiRef.current) {
//       try {
//         apiRef.current.stop();
//       } catch (err) {
//         console.warn('⚠️ Error stopping Sketchfab API:', err);
//       }
//       apiRef.current = null;
//     }

//     currentTextureUidRef.current = null;
//     mountedRef.current = false;
//   }, []);

//   // ═════════════════════════════════════════════════════════════
//   // SAFE STATE UPDATE
//   // ═════════════════════════════════════════════════════════════

//   const safeSetState = useCallback((setState: () => void) => {
//     if (mountedRef.current) {
//       setState();
//     }
//   }, []);

//   // ═════════════════════════════════════════════════════════════
//   // ERROR HANDLER
//   // ═════════════════════════════════════════════════════════════

//   const handleError = useCallback((errorMsg: string, shouldRetry = false) => {
//     console.error('❌ SketchfabViewer Error:', errorMsg);

//     safeSetState(() => {
//       setError(errorMsg);
//       setLoading(false);
//     });

//     onError?.(errorMsg);

//     if (shouldRetry && retryCountRef.current < MAX_RETRY_ATTEMPTS) {
//       retryCountRef.current++;
//       console.log(`🔄 Retry attempt ${retryCountRef.current}/${MAX_RETRY_ATTEMPTS}`);
      
//       setTimeout(() => {
//         if (mountedRef.current) {
//           safeSetState(() => {
//             setError(null);
//             setLoading(true);
//           });
//           initializeViewer();
//         }
//       }, RETRY_DELAY * retryCountRef.current);
//     }
//   }, [onError, safeSetState]);

//   // ═════════════════════════════════════════════════════════════
//   // 🔍 MATERIAL INSPECTOR - AUTO DETECTION
//   // ═════════════════════════════════════════════════════════════

//   const inspectAndDetectMaterials = useCallback(() => {
//     if (!apiRef.current || materialsInspectedRef.current) {
//       return;
//     }

//     console.log('🔍 Starting automatic material detection...');

//     apiRef.current.getMaterialList((err, materials) => {
//       if (err) {
//         console.error('❌ Failed to get material list:', err);
//         return;
//       }

//       materialsInspectedRef.current = true;
//       setAvailableMaterials(materials);

//       console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: cyan; font-weight: bold');
//       console.log('%c🔍 SKETCHFAB MATERIAL INSPECTOR', 'color: cyan; font-size: 18px; font-weight: bold');
//       console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: cyan; font-weight: bold');
//       console.log('');
//       console.log(`📦 Model: ${modelConfig?.name}`);
//       console.log(`🆔 Model UID: ${modelConfig?.modelId}`);
//       console.log(`🎨 Total Materials: ${materials.length}`);
//       console.log('');

//       materials.forEach((mat, index) => {
//         const hasTexture = !!mat.channels?.AlbedoPBR?.texture;
//         const isLikelyFloor = 
//           mat.name.toLowerCase().includes('floor') ||
//           mat.name.toLowerCase().includes('ground') ||
//           mat.name.toLowerCase().includes('base') ||
//           mat.name.toLowerCase().includes('plane');

//         console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
//         console.log(`%cMaterial #${index + 1}`, 'color: yellow; font-weight: bold');
//         console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
//         console.log(`%c📝 Name: "${mat.name}"`, isLikelyFloor ? 'color: lime; font-weight: bold; font-size: 14px' : 'color: white');
//         console.log(`   🆔 ID: ${mat.id}`);
//         console.log(`   ${hasTexture ? '✅' : '❌'} Has Texture: ${hasTexture ? 'YES' : 'NO'}`);
        
//         if (mat.channels?.AlbedoPBR?.color) {
//           const [r, g, b] = mat.channels.AlbedoPBR.color;
//           console.log(`   🌈 Color: RGB(${Math.round(r*255)}, ${Math.round(g*255)}, ${Math.round(b*255)})`);
//         }
        
//         if (isLikelyFloor) {
//           console.log(`%c   🎯 ← LIKELY FLOOR MATERIAL!`, 'color: orange; font-weight: bold; font-size: 13px');
//         }
        
//         console.log('');
//       });

//       // ✅ AUTO-DETECT FLOOR MATERIAL
//       let detectedMaterial: Material | null = null;

//       // Try exact config name first
//       if (modelConfig?.floorMaterialName) {
//         detectedMaterial = materials.find(m => m.name === modelConfig.floorMaterialName) || null;
//         if (detectedMaterial) {
//           console.log(`%c✅ FOUND FLOOR MATERIAL (Exact Config Match)`, 'color: lime; font-weight: bold; font-size: 16px');
//           console.log(`   Name: "${detectedMaterial.name}"`);
//         }
//       }

//       // Try pattern matching
//       if (!detectedMaterial) {
//         for (const pattern of FLOOR_MATERIAL_PATTERNS) {
//           detectedMaterial = materials.find(m => m.name === pattern) || null;
//           if (detectedMaterial) {
//             console.log(`%c✅ FOUND FLOOR MATERIAL (Pattern Match)`, 'color: lime; font-weight: bold; font-size: 16px');
//             console.log(`   Pattern: "${pattern}"`);
//             console.log(`   Name: "${detectedMaterial.name}"`);
//             break;
//           }
//         }
//       }

//       // Try fuzzy matching (case-insensitive)
//       if (!detectedMaterial) {
//         detectedMaterial = materials.find(m => 
//           m.name.toLowerCase().includes('floor') ||
//           m.name.toLowerCase().includes('ground')
//         ) || null;
        
//         if (detectedMaterial) {
//           console.log(`%c✅ FOUND FLOOR MATERIAL (Fuzzy Match)`, 'color: yellow; font-weight: bold; font-size: 16px');
//           console.log(`   Name: "${detectedMaterial.name}"`);
//         }
//       }

//       if (detectedMaterial) {
//         detectedFloorMaterialRef.current = detectedMaterial.name;
        
//         console.log('');
//         console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: green; font-weight: bold');
//         console.log('%c✅ FLOOR MATERIAL DETECTED!', 'color: green; font-size: 16px; font-weight: bold');
//         console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: green; font-weight: bold');
//         console.log(`%c📝 Material Name: "${detectedMaterial.name}"`, 'color: lime; font-weight: bold');
//         console.log('');
//         console.log('%c📋 UPDATE YOUR CONFIG:', 'color: cyan; font-weight: bold; font-size: 14px');
//         console.log(`%c   floorMaterialName: '${detectedMaterial.name}'`, 'color: yellow; font-weight: bold');
//         console.log('');
//       } else {
//         console.log('');
//         console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: red; font-weight: bold');
//         console.log('%c❌ FLOOR MATERIAL NOT DETECTED', 'color: red; font-size: 16px; font-weight: bold');
//         console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: red; font-weight: bold');
//         console.log('');
//         console.log('%c⚠️ Please select floor material manually from the list above', 'color: yellow');
//         console.log('%c📝 Available materials:', 'color: cyan');
//         materials.forEach(m => {
//           console.log(`   • "${m.name}"`);
//         });
//         console.log('');
//       }
//     });
//   }, [modelConfig]);

//   // ═════════════════════════════════════════════════════════════
//   // 🔍 SMART FLOOR MATERIAL FINDER
//   // ═════════════════════════════════════════════════════════════

//   const findFloorMaterial = useCallback((materials: Material[]): Material | null => {
//     console.log('🔍 Searching for floor material...');

//     // 1. Try detected material first
//     if (detectedFloorMaterialRef.current) {
//       const detected = materials.find(m => m.name === detectedFloorMaterialRef.current);
//       if (detected) {
//         console.log(`✅ Using auto-detected material: "${detected.name}"`);
//         return detected;
//       }
//     }

//     // 2. Try config name (exact match)
//     if (modelConfig?.floorMaterialName) {
//       const exactMatch = materials.find(m => m.name === modelConfig.floorMaterialName);
//       if (exactMatch) {
//         console.log(`✅ Found floor material (config exact): "${exactMatch.name}"`);
//         return exactMatch;
//       }
//     }

//     // 3. Try common patterns (exact match)
//     for (const pattern of FLOOR_MATERIAL_PATTERNS) {
//       const match = materials.find(m => m.name === pattern);
//       if (match) {
//         console.log(`✅ Found floor material (pattern): "${match.name}"`);
//         return match;
//       }
//     }

//     // 4. Try case-insensitive substring match
//     const fuzzyMatch = materials.find(m => 
//       m.name.toLowerCase().includes('floor') ||
//       m.name.toLowerCase().includes('ground') ||
//       m.name.toLowerCase().includes('base')
//     );
    
//     if (fuzzyMatch) {
//       console.log(`✅ Found floor material (fuzzy): "${fuzzyMatch.name}"`);
//       return fuzzyMatch;
//     }

//     // 5. Last resort: first material with texture
//     const firstWithTexture = materials.find(m => m.channels?.AlbedoPBR?.texture);
//     if (firstWithTexture) {
//       console.warn(`⚠️ Using first textured material as fallback: "${firstWithTexture.name}"`);
//       return firstWithTexture;
//     }

//     console.error('❌ No suitable floor material found!');
//     console.log('Available materials:', materials.map(m => m.name));
//     return null;
//   }, [modelConfig]);

//   // ═════════════════════════════════════════════════════════════
//   // INITIALIZE SKETCHFAB VIEWER
//   // ═════════════════════════════════════════════════════════════

//   const initializeViewer = useCallback(() => {
//     if (!modelConfig) {
//       handleError(`Sketchfab model not configured for ${roomType}`, false);
//       return;
//     }

//     if (!modelConfig.modelId || modelConfig.modelId.length < 30) {
//       handleError(`Invalid Sketchfab model UID: "${modelConfig.modelId}"`, false);
//       return;
//     }

//     if (!window.Sketchfab) {
//       handleError('Sketchfab API not loaded', true);
//       return;
//     }

//     const iframe = iframeRef.current;
//     if (!iframe) {
//       handleError('iFrame reference not available', true);
//       return;
//     }

//     console.log('🚀 Initializing Sketchfab viewer for:', modelConfig.name);
//     safeSetState(() => setInitProgress('Connecting to Sketchfab...'));

//     initTimeoutRef.current = setTimeout(() => {
//       handleError('Sketchfab initialization timeout', true);
//     }, SCRIPT_LOAD_TIMEOUT);

//     try {
//       const client = new window.Sketchfab(iframe);

//       client.init(modelConfig.modelId, {
//         ...SKETCHFAB_CONFIG.viewer,
        
//         success: (api: SketchfabAPI) => {
//           if (!mountedRef.current) return;

//           console.log('✅ Sketchfab API initialized');
          
//           if (initTimeoutRef.current) {
//             clearTimeout(initTimeoutRef.current);
//             initTimeoutRef.current = null;
//           }

//           apiRef.current = api;
//           retryCountRef.current = 0;

//           safeSetState(() => setInitProgress('Starting 3D model...'));
//           api.start();

//           const viewerReadyHandler = () => {
//             if (!mountedRef.current) return;

//             console.log('✅ Sketchfab viewer ready');
//             safeSetState(() => {
//               setModelReady(true);
//               setLoading(false);
//               setInitProgress('Model loaded successfully');
//             });

//             // ✅ Auto-inspect materials after 1 second
//             setTimeout(() => {
//               inspectAndDetectMaterials();
//             }, 1000);

//             onReady?.();
//           };

//           const errorHandler = (err: any) => {
//             console.error('❌ Sketchfab viewer error:', err);
//             handleError(`Viewer error: ${err?.message || 'Unknown error'}`, true);
//           };

//           api.addEventListener('viewerready', viewerReadyHandler);
//           api.addEventListener('error', errorHandler);
//         },
        
//         error: (err: any) => {
//           handleError(
//             `Sketchfab initialization failed: ${err?.message || err}`,
//             true
//           );
//         }
//       });

//     } catch (err: any) {
//       handleError(
//         `Failed to create Sketchfab client: ${err?.message || err}`,
//         true
//       );
//     }
//   }, [modelConfig, roomType, onReady, handleError, safeSetState, inspectAndDetectMaterials]);

//   // ═════════════════════════════════════════════════════════════
//   // APPLY TILE TEXTURE TO FLOOR
//   // ═════════════════════════════════════════════════════════════

//   const applyFloorTexture = useCallback(() => {
//     if (!apiRef.current || !modelReady || !floorTexture || !modelConfig) {
//       console.log('⚠️ Cannot apply texture - prerequisites not met');
//       return;
//     }

//     console.log('🎨 Starting floor texture application:', floorTexture);
    
//     safeSetState(() => {
//       setTextureLoading(true);
//       setTextureApplied(false);
//     });

//     const api = apiRef.current;

//     const textureTimeout = setTimeout(() => {
//       if (textureLoading) {
//         handleError('Texture application timeout', false);
//         safeSetState(() => setTextureLoading(false));
//       }
//     }, TEXTURE_APPLY_TIMEOUT);

//     const removeOldTexture = (callback: () => void) => {
//       if (currentTextureUidRef.current) {
//         console.log('🗑️ Removing old texture:', currentTextureUidRef.current);
//         api.removeTexture(currentTextureUidRef.current, (err) => {
//           if (err) {
//             console.warn('⚠️ Failed to remove old texture:', err);
//           }
//           currentTextureUidRef.current = null;
//           callback();
//         });
//       } else {
//         callback();
//       }
//     };

//     removeOldTexture(() => {
//       if (!mountedRef.current) return;

//       api.getMaterialList((err, materials) => {
//         if (!mountedRef.current) return;

//         if (err) {
//           clearTimeout(textureTimeout);
//           handleError(`Failed to get materials: ${err}`, false);
//           safeSetState(() => setTextureLoading(false));
//           return;
//         }

//         console.log('📦 Available materials:', materials.map(m => m.name));

//         // ✅ Use smart material finder
//         const floorMaterial = findFloorMaterial(materials);

//         if (!floorMaterial) {
//           clearTimeout(textureTimeout);
          
//           const materialList = materials.map((m, i) => `${i + 1}. "${m.name}"`).join('\n');
          
//           handleError(
//             `❌ Floor material not found!\n\n` +
//             `Available materials:\n${materialList}\n\n` +
//             `Please check browser console (F12) for material inspector.\n` +
//             `Update config with correct material name.`,
//             false
//           );
//           safeSetState(() => {
//             setTextureLoading(false);
//             setShowMaterialInspector(true);
//           });
//           return;
//         }

//         console.log('✅ Found floor material:', floorMaterial.name);

//         api.addTexture(floorTexture, (err, textureUid) => {
//           if (!mountedRef.current) return;

//           if (err) {
//             clearTimeout(textureTimeout);
//             handleError(`Failed to upload texture: ${err}`, false);
//             safeSetState(() => setTextureLoading(false));
//             return;
//           }

//           console.log('✅ Texture uploaded:', textureUid);
//           currentTextureUidRef.current = textureUid;

//           const referenceSize = 100;
//           const scaleU = referenceSize / tileSize.width;
//           const scaleV = referenceSize / tileSize.height;

//           console.log('📏 UV Scale calculated:', { u: scaleU, v: scaleV });

//           try {
//             api.setTextureUvScale(textureUid, { u: scaleU, v: scaleV });

//             const updatedMaterial: Material = {
//               ...floorMaterial,
//               channels: {
//                 ...floorMaterial.channels,
//                 AlbedoPBR: {
//                   texture: { uid: textureUid },
//                   enable: true,
//                   factor: 1.0
//                 }
//               }
//             };

//             api.setMaterial(updatedMaterial, (err) => {
//               clearTimeout(textureTimeout);

//               if (!mountedRef.current) return;

//               if (err) {
//                 handleError(`Failed to apply texture: ${err}`, false);
//                 safeSetState(() => setTextureLoading(false));
//                 return;
//               }

//               console.log('✅ Floor texture applied successfully');
//               safeSetState(() => {
//                 setTextureLoading(false);
//                 setTextureApplied(true);
//               });

//               setTimeout(() => {
//                 if (mountedRef.current) {
//                   safeSetState(() => setTextureApplied(false));
//                 }
//               }, 3000);
//             });

//           } catch (err: any) {
//             clearTimeout(textureTimeout);
//             handleError(
//               `Texture application error: ${err?.message || err}`,
//               false
//             );
//             safeSetState(() => setTextureLoading(false));
//           }
//         });
//       });
//     });
//   }, [
//     floorTexture,
//     tileSize,
//     modelReady,
//     modelConfig,
//     textureLoading,
//     handleError,
//     safeSetState,
//     findFloorMaterial
//   ]);

//   // ═════════════════════════════════════════════════════════════
//   // MANUAL MATERIAL INSPECTOR TRIGGER
//   // ═════════════════════════════════════════════════════════════

//   const triggerManualInspection = useCallback(() => {
//     materialsInspectedRef.current = false; // Reset flag
//     inspectAndDetectMaterials();
//     setShowMaterialInspector(true);
//   }, [inspectAndDetectMaterials]);

//   // ═════════════════════════════════════════════════════════════
//   // EFFECTS
//   // ═════════════════════════════════════════════════════════════

//   // Load Sketchfab API script
//   useEffect(() => {
//     mountedRef.current = true;

//     const loadScript = () => {
//       if (window.Sketchfab || scriptLoadedRef.current) {
//         console.log('✅ Sketchfab API already loaded');
//         initializeViewer();
//         return;
//       }

//       console.log('📥 Loading Sketchfab API script...');
//       safeSetState(() => setInitProgress('Loading Sketchfab API...'));

//       const script = document.createElement('script');
//       script.src = 'https://static.sketchfab.com/api/sketchfab-viewer-1.12.1.js';
//       script.async = true;

//       const scriptTimeout = setTimeout(() => {
//         handleError('Script loading timeout', true);
//       }, SCRIPT_LOAD_TIMEOUT);

//       script.onload = () => {
//         clearTimeout(scriptTimeout);
//         console.log('✅ Sketchfab API script loaded');
//         scriptLoadedRef.current = true;
//         if (mountedRef.current) {
//           initializeViewer();
//         }
//       };

//       script.onerror = () => {
//         clearTimeout(scriptTimeout);
//         handleError('Failed to load Sketchfab API script', true);
//       };

//       document.body.appendChild(script);

//       return () => {
//         if (script.parentNode) {
//           document.body.removeChild(script);
//         }
//       };
//     };

//     const cleanupScript = loadScript();

//     return () => {
//       cleanup();
//       cleanupScript?.();
//     };
//   }, [initializeViewer, handleError, cleanup, safeSetState]);

//   // Apply texture when ready
//   useEffect(() => {
//     if (modelReady && floorTexture && !textureLoading) {
//       applyFloorTexture();
//     }
//   }, [modelReady, floorTexture, applyFloorTexture, textureLoading]);

//   // Listen for manual inspection requests
//   useEffect(() => {
//     const handleInspectRequest = () => {
//       triggerManualInspection();
//     };

//     window.addEventListener('inspectSketchfabMaterials', handleInspectRequest);

//     return () => {
//       window.removeEventListener('inspectSketchfabMaterials', handleInspectRequest);
//     };
//   }, [triggerManualInspection]);

//   // ═════════════════════════════════════════════════════════════
//   // RENDER
//   // ═════════════════════════════════════════════════════════════

//   if (error) {
//     return (
//       <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-red-50 to-rose-100">
//         <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md text-center">
//           <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4 animate-pulse" />
//           <h3 className="text-xl font-bold text-gray-800 mb-2">
//             Sketchfab Error
//           </h3>
//           <p className="text-gray-600 text-sm mb-4 break-words whitespace-pre-line">
//             {error}
//           </p>
          
//           {showMaterialInspector && availableMaterials.length > 0 && (
//             <div className="bg-gray-100 rounded-lg p-3 mb-4 max-h-40 overflow-y-auto text-left">
//               <p className="text-xs font-semibold text-gray-700 mb-2">Available Materials:</p>
//               <ul className="text-xs text-gray-600 space-y-1">
//                 {availableMaterials.map((mat, i) => (
//                   <li key={mat.id} className="flex items-start gap-2">
//                     <span className="text-blue-600 font-mono">{i + 1}.</span>
//                     <span className="font-mono break-all">"{mat.name}"</span>
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           )}

//           {retryCountRef.current >= MAX_RETRY_ATTEMPTS && (
//             <p className="text-gray-500 text-xs mb-4">
//               Maximum retry attempts reached. Please refresh the page.
//             </p>
//           )}
          
//           <div className="flex gap-2 justify-center">
//             <button
//               onClick={triggerManualInspection}
//               className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all flex items-center gap-2 shadow-lg text-sm"
//             >
//               <Search className="w-4 h-4" />
//               Inspect Materials
//             </button>
            
//             <button
//               onClick={() => window.location.reload()}
//               className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-all flex items-center gap-2 shadow-lg text-sm"
//             >
//               <RefreshCw className="w-4 h-4" />
//               Reload
//             </button>
//           </div>

//           <p className="text-xs text-gray-500 mt-3">
//             💡 Check browser console (F12) for detailed material info
//           </p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="relative w-full h-full bg-gray-900">
      
//       {/* ═══════════════════════════════════════════════════════ */}
//       {/* LOADING OVERLAY */}
//       {/* ═══════════════════════════════════════════════════════ */}
//       {loading && (
//         <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center z-20">
//           <div className="text-center px-6">
//             <Loader className="w-20 h-20 text-white animate-spin mx-auto mb-6 drop-shadow-2xl" />
//             <h3 className="text-white font-bold text-2xl mb-2 drop-shadow-lg">
//               {modelConfig?.name || 'Loading 3D Model'}
//             </h3>
//             <p className="text-blue-200 text-sm mb-4 animate-pulse">
//               {initProgress}
//             </p>
//             <div className="w-64 bg-gray-700 rounded-full h-2 overflow-hidden mx-auto">
//               <div className="bg-blue-500 h-full w-1/2 animate-pulse rounded-full"></div>
//             </div>
//             {retryCountRef.current > 0 && (
//               <p className="text-yellow-300 text-xs mt-4">
//                 Retry attempt {retryCountRef.current}/{MAX_RETRY_ATTEMPTS}
//               </p>
//             )}
//           </div>
//         </div>
//       )}

//       {/* ═══════════════════════════════════════════════════════ */}
//       {/* TEXTURE LOADING INDICATOR */}
//       {/* ═══════════════════════════════════════════════════════ */}
//       {textureLoading && (
//         <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-6 py-3 rounded-xl shadow-2xl z-30 flex items-center gap-3 animate-slideDown">
//           <Loader className="w-5 h-5 animate-spin" />
//           <span className="font-bold text-sm">
//             Applying {tileSize.width}×{tileSize.height}cm tile...
//           </span>
//         </div>
//       )}

//       {/* ═══════════════════════════════════════════════════════ */}
//       {/* TEXTURE APPLIED SUCCESS */}
//       {/* ═══════════════════════════════════════════════════════ */}
//       {textureApplied && !textureLoading && (
//         <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-xl shadow-2xl z-30 flex items-center gap-3 animate-slideDown">
//           <CheckCircle className="w-5 h-5" />
//           <span className="font-bold text-sm">
//             ✨ Tile Applied: {tileSize.width}×{tileSize.height}cm
//           </span>
//         </div>
//       )}

//       {/* ═══════════════════════════════════════════════════════ */}
//       {/* MATERIAL INSPECTOR BUTTON (DEV MODE) */}
//       {/* ═══════════════════════════════════════════════════════ */}
//       {import.meta.env.DEV && modelReady && (
//         <button
//           onClick={triggerManualInspection}
//           className="absolute top-4 right-4 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg shadow-lg flex items-center gap-2 z-30 text-xs font-semibold transition-all"
//           title="Inspect materials in console"
//         >
//           <Search className="w-4 h-4" />
//           Inspect Materials
//         </button>
//       )}

//       {/* ═══════════════════════════════════════════════════════ */}
//       {/* SKETCHFAB IFRAME */}
//       {/* ═══════════════════════════════════════════════════════ */}
//       <iframe
//         ref={iframeRef}
//         className="w-full h-full border-0"
//         title={`${roomType} - Sketchfab 3D Model`}
//         allow="autoplay; fullscreen; xr-spatial-tracking"
//         allowFullScreen
//       />

//       {/* ═══════════════════════════════════════════════════════ */}
//       {/* BRANDING */}
//       {/* ═══════════════════════════════════════════════════════ */}
//       {modelReady && !loading && (
//         <div className="absolute bottom-4 right-4 bg-black/70 backdrop-blur-sm text-white px-4 py-2 rounded-lg shadow-lg">
//           <p className="text-xs font-semibold">
//             ✨ Powered by Sketchfab
//           </p>
//           {detectedFloorMaterialRef.current && (
//             <p className="text-[10px] text-gray-300 mt-1">
//               Floor: {detectedFloorMaterialRef.current}
//             </p>
//           )}
//         </div>
//       )}

//       {/* ═══════════════════════════════════════════════════════ */}
//       {/* ANIMATIONS */}
//       {/* ═══════════════════════════════════════════════════════ */}
//       <style>{`
//         @keyframes slideDown {
//           from {
//             opacity: 0;
//             transform: translate(-50%, -100%);
//           }
//           to {
//             opacity: 1;
//             transform: translate(-50%, 0);
//           }
//         }
        
//         .animate-slideDown {
//           animation: slideDown 0.4s cubic-bezier(0.16, 1, 0.3, 1);
//         }
//       `}</style>
//     </div>
//   );
// };

// export default SketchfabViewer;