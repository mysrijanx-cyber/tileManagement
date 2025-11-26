  
// // // src/components/Enhanced3DViewer.tsx
// // import React, { useState, useEffect, Suspense, useMemo, useRef } from 'react';
// // import { Canvas, useThree } from '@react-three/fiber';
// // import { 
// //   OrbitControls, 
// //   Environment, 
// //   ContactShadows,
// //   Sky,
// //   AccumulativeShadows,
// //   RandomizedLight,
// //   BakeShadows
// // } from '@react-three/drei';
// // import * as THREE from 'three';
// // import { 
// //   Maximize2, 
// //   Minimize2, 
// //   RotateCcw, 
// //   Info, 
// //   Camera, 
// //   Sun,
// //   Play,
// //   Pause,
// //   Settings,
// //   Package
// // } from 'lucide-react';

// // // Import luxury scene
// // import { LuxuryDrawingRoomScene } from './LuxuryDrawingRoomScene';

// // // ============================================
// // // TYPES & INTERFACES
// // // ============================================

// // interface Enhanced3DViewerProps {
// //   roomType: 'drawing' | 'kitchen' | 'bathroom';
// //   floorTile?: {
// //     texture?: string;
// //     size: { width: number; height: number };
// //   };
// //   wallTile?: {
// //     texture?: string;
// //     size: { width: number; height: number };
// //   };
// //   activeSurface: 'floor' | 'wall' | 'both';
// //   onSurfaceChange?: (surface: 'floor' | 'wall' | 'both') => void;
// // }

// // interface CameraPreset {
// //   position: [number, number, number];
// //   target: [number, number, number];
// //   name: string;
// //   fov: number;
// // }

// // type QualityLevel = 'ultra' | 'high' | 'medium' | 'low';
// // type TimeOfDay = 'morning' | 'afternoon' | 'evening' | 'night';

// // // ============================================
// // // CONSTANTS
// // // ============================================

// // const ROOM_CONFIGS = {
// //   drawing: { width: 5, depth: 6, height: 3 },
// //   kitchen: { width: 4, depth: 5, height: 2.8 },
// //   bathroom: { width: 3, depth: 3.5, height: 2.8 }
// // } as const;

// // const CAMERA_PRESETS: Record<string, CameraPreset[]> = {
// //   drawing: [
// //     { name: 'Luxury View', position: [5, 2, 6], target: [0, 1.2, 0], fov: 45 },
// //     { name: 'TV Wall Focus', position: [2, 1.5, 4], target: [0, 1.5, -4.5], fov: 50 },
// //     { name: 'Sofa Area', position: [-3, 1.8, 4], target: [0, 1, 2], fov: 48 },
// //     { name: 'Full Room', position: [6, 3, 0], target: [0, 1.5, 0], fov: 55 },
// //   ],
// //   kitchen: [
// //     { name: 'Overview', position: [3, 2.2, 4], target: [0, 1.2, 0], fov: 50 },
// //     { name: 'Counter View', position: [0, 1.4, 2.5], target: [0, 1, -1.5], fov: 45 },
// //     { name: 'Floor Detail', position: [1.5, 1.8, 2], target: [0, 0, 0], fov: 40 },
// //     { name: 'Backsplash', position: [0, 1.6, 1.5], target: [0, 1.4, -2], fov: 50 },
// //   ],
// //   bathroom: [
// //     { name: 'Overview', position: [2, 2, 2.5], target: [0, 1.2, 0], fov: 55 },
// //     { name: 'Mirror View', position: [0, 1.5, 2], target: [0, 1.5, -1.5], fov: 50 },
// //     { name: 'Floor Tiles', position: [1, 1.6, 1.5], target: [0, 0, 0], fov: 45 },
// //     { name: 'Wall Detail', position: [1.2, 1.4, 0.8], target: [-1, 1.4, 0], fov: 40 },
// //   ],
// // };

// // const LIGHTING_PRESETS: Record<TimeOfDay, {
// //   sunPosition: [number, number, number];
// //   sunIntensity: number;
// //   sunColor: string;
// //   ambientIntensity: number;
// //   skyTurbidity: number;
// //   skyRayleigh: number;
// // }> = {
// //   morning: {
// //     sunPosition: [50, 20, -30],
// //     sunIntensity: 2.5,
// //     sunColor: '#fff4e6',
// //     ambientIntensity: 0.6,
// //     skyTurbidity: 3,
// //     skyRayleigh: 0.5,
// //   },
// //   afternoon: {
// //     sunPosition: [0, 50, 0],
// //     sunIntensity: 3,
// //     sunColor: '#ffffff',
// //     ambientIntensity: 0.8,
// //     skyTurbidity: 2,
// //     skyRayleigh: 1,
// //   },
// //   evening: {
// //     sunPosition: [-50, 15, 30],
// //     sunIntensity: 1.8,
// //     sunColor: '#ffcc99',
// //     ambientIntensity: 0.4,
// //     skyTurbidity: 8,
// //     skyRayleigh: 2,
// //   },
// //   night: {
// //     sunPosition: [0, -10, 0],
// //     sunIntensity: 0.1,
// //     sunColor: '#6699cc',
// //     ambientIntensity: 0.2,
// //     skyTurbidity: 10,
// //     skyRayleigh: 0,
// //   },
// // };

// // // ============================================
// // // CUSTOM HOOKS
// // // ============================================

// // const useHighQualityTexture = (
// //   textureUrl: string | undefined,
// //   tileWidth: number,
// //   tileHeight: number
// // ) => {
// //   const [texture, setTexture] = useState<THREE.Texture | null>(null);
// //   const textureRef = useRef<THREE.Texture | null>(null);

// //   useEffect(() => {
// //     if (!textureUrl) {
// //       if (textureRef.current) {
// //         textureRef.current.dispose();
// //         textureRef.current = null;
// //       }
// //       setTexture(null);
// //       return;
// //     }

// //     let isCancelled = false;
// //     const loader = new THREE.TextureLoader();
    
// //     loader.load(
// //       textureUrl,
// //       (loadedTexture) => {
// //         if (isCancelled) {
// //           loadedTexture.dispose();
// //           return;
// //         }

// //         if (textureRef.current) {
// //           textureRef.current.dispose();
// //         }

// //         loadedTexture.colorSpace = THREE.SRGBColorSpace;
// //         loadedTexture.wrapS = THREE.RepeatWrapping;
// //         loadedTexture.wrapT = THREE.RepeatWrapping;
// //         loadedTexture.minFilter = THREE.LinearMipMapLinearFilter;
// //         loadedTexture.magFilter = THREE.LinearFilter;
// //         loadedTexture.anisotropy = 16;
// //         loadedTexture.needsUpdate = true;
        
// //         textureRef.current = loadedTexture;
// //         setTexture(loadedTexture);
// //       },
// //       undefined,
// //       (error) => {
// //         if (!isCancelled) {
// //           console.error('Texture loading error:', error);
// //           setTexture(null);
// //         }
// //       }
// //     );
// //     return () => {
// //       isCancelled = true;
// //       if (textureRef.current) {
// //         textureRef.current.dispose();
// //         textureRef.current = null;
// //       }
// //     };
// //   }, [textureUrl, tileWidth, tileHeight]);

// //   return texture;
// // };

// // const useDeviceQuality = (): QualityLevel => {
// //   const [quality, setQuality] = useState<QualityLevel>('high');

// //   useEffect(() => {
// //     const canvas = document.createElement('canvas');
// //     const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    
// //     if (!gl) {
// //       setQuality('low');
// //       return;
// //     }

// //     const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
// //     const renderer = debugInfo ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : '';
    
// //     const isMobile = /mobile|android|iphone|ipad/i.test(navigator.userAgent);
// //     const isHighEnd = /apple gpu|adreno 6|mali-g|nvidia|amd/i.test(renderer.toLowerCase());
    
// //     if (isMobile) {
// //       setQuality(isHighEnd ? 'medium' : 'low');
// //     } else {
// //       setQuality(isHighEnd ? 'ultra' : 'high');
// //     }
// //   }, []);

// //   return quality;
// // };

// // // ============================================
// // // LIGHTING COMPONENTS
// // // ============================================

// // const AdvancedLighting: React.FC<{ 
// //   roomType: string; 
// //   timeOfDay: TimeOfDay;
// //   quality: QualityLevel;
// // }> = ({ roomType, timeOfDay, quality }) => {
// //   const preset = LIGHTING_PRESETS[timeOfDay];
  
// //   return (
// //     <>
// //       <ambientLight intensity={preset.ambientIntensity * 1.2} color="#ffffff" />
      
// //       <hemisphereLight 
// //         args={['#87ceeb', '#a0866a', preset.ambientIntensity * 0.8]} 
// //       />

// //       <directionalLight
// //         position={preset.sunPosition}
// //         intensity={preset.sunIntensity * 1.2}
// //         color={preset.sunColor}
// //         castShadow={quality !== 'low'}
// //         shadow-mapSize={quality === 'ultra' ? [4096, 4096] : [2048, 2048]}
// //         shadow-camera-left={-10}
// //         shadow-camera-right={10}
// //         shadow-camera-top={10}
// //         shadow-camera-bottom={-10}
// //         shadow-bias={-0.0001}
// //         shadow-radius={quality === 'ultra' ? 4 : 2}
// //       />

// //       {roomType === 'kitchen' && (
// //         <>
// //           <rectAreaLight
// //             position={[0, 2.6, -1]}
// //             width={3}
// //             height={0.3}
// //             intensity={timeOfDay === 'night' ? 12 : 6}
// //             color="#fffaef"
// //           />
          
// //           <rectAreaLight
// //             position={[0, 1.8, -2.2]}
// //             width={3.5}
// //             height={0.1}
// //             intensity={timeOfDay === 'night' ? 10 : 4}
// //             color="#ffffff"
// //           />
// //         </>
// //       )}

// //       {roomType === 'bathroom' && (
// //         <>
// //           <pointLight
// //             position={[0, 2.5, 0]}
// //             intensity={timeOfDay === 'night' ? 18 : 10}
// //             distance={6}
// //             decay={2}
// //             color="#f8f8ff"
// //             castShadow={quality !== 'low'}
// //           />
          
// //           <pointLight
// //             position={[-0.8, 1.8, -1.6]}
// //             intensity={timeOfDay === 'night' ? 8 : 4}
// //             distance={3}
// //             decay={2}
// //             color="#fffff0"
// //           />
// //           <pointLight
// //             position={[0.8, 1.8, -1.6]}
// //             intensity={timeOfDay === 'night' ? 8 : 4}
// //             distance={3}
// //             decay={2}
// //             color="#fffff0"
// //           />
// //         </>
// //       )}

// //       <pointLight position={[3, 2, 3]} intensity={2} distance={10} decay={2} />
// //       <pointLight position={[-3, 2, 3]} intensity={2} distance={10} decay={2} />
// //       <pointLight position={[3, 2, -3]} intensity={2} distance={10} decay={2} />
// //       <pointLight position={[-3, 2, -3]} intensity={2} distance={10} decay={2} />
// //     </>
// //   );
// // };

// // // ============================================
// // // TILE COMPONENTS
// // // ============================================

// // const TiledFloor: React.FC<{
// //   baseTexture: THREE.Texture | null;
// //   tileSize: { width: number; height: number };
// //   roomWidth: number;
// //   roomDepth: number;
// //   position: [number, number, number];
// //   quality: QualityLevel;
// // }> = ({ baseTexture, tileSize, roomWidth, roomDepth, position, quality }) => {
  
// //   const material = useMemo(() => {
// //     if (!baseTexture) {
// //       return new THREE.MeshStandardMaterial({
// //         color: '#d4d4d4',
// //         roughness: 0.7,
// //         metalness: 0,
// //       });
// //     }

// //     const clonedTexture = baseTexture.clone();
// //     clonedTexture.needsUpdate = true;
    
// //     const tileSizeM = {
// //       width: tileSize.width / 100,
// //       height: tileSize.height / 100
// //     };
    
// //     const repeatX = roomWidth / tileSizeM.width;
// //     const repeatY = roomDepth / tileSizeM.height;
    
// //     clonedTexture.repeat.set(repeatX, repeatY);

// //     const mat = new THREE.MeshPhysicalMaterial({
// //       map: clonedTexture,
// //       roughness: 0.2,
// //       metalness: 0,
// //       clearcoat: 0.3,
// //       clearcoatRoughness: 0.2,
// //       reflectivity: 0.6,
// //       envMapIntensity: quality === 'ultra' ? 1.2 : 0.6,
// //       sheen: 0.3,
// //       sheenColor: new THREE.Color('#ffffff'),
// //     });

// //     (mat as any)._customTexture = clonedTexture;
// //     return mat;
// //   }, [baseTexture, tileSize.width, tileSize.height, roomWidth, roomDepth, quality]);

// //   useEffect(() => {
// //     return () => {
// //       if ((material as any)._customTexture) {
// //         (material as any)._customTexture.dispose();
// //       }
// //       material.dispose();
// //     };
// //   }, [material]);

// //   return (
// //     <mesh 
// //       rotation={[-Math.PI / 2, 0, 0]} 
// //       position={position}
// //       receiveShadow
// //     >
// //       <planeGeometry args={[roomWidth, roomDepth, 64, 64]} />
// //       <primitive object={material} attach="material" />
// //     </mesh>
// //   );
// // };

// // const TiledWall: React.FC<{
// //   baseTexture: THREE.Texture | null;
// //   tileSize: { width: number; height: number };
// //   width: number;
// //   height: number;
// //   position: [number, number, number];
// //   rotation?: [number, number, number];
// //   quality: QualityLevel;
// // }> = ({ baseTexture, tileSize, width, height, position, rotation = [0, 0, 0], quality }) => {
  
// //   const material = useMemo(() => {
// //     if (!baseTexture) {
// //       return new THREE.MeshStandardMaterial({
// //         color: '#f5f5f5',
// //         roughness: 0.6,
// //         metalness: 0,
// //       });
// //     }

// //     const clonedTexture = baseTexture.clone();
// //     clonedTexture.needsUpdate = true;
    
// //     const tileSizeM = {
// //       width: tileSize.width / 100,
// //       height: tileSize.height / 100
// //     };
    
// //     const repeatX = width / tileSizeM.width;
// //     const repeatY = height / tileSizeM.height;
    
// //     clonedTexture.repeat.set(repeatX, repeatY);

// //     const mat = new THREE.MeshPhysicalMaterial({
// //       map: clonedTexture,
// //       roughness: 0.15,
// //       metalness: 0,
// //       clearcoat: 0.35,
// //       clearcoatRoughness: 0.15,
// //       reflectivity: 0.5,
// //       envMapIntensity: quality === 'ultra' ? 1.0 : 0.5,
// //     });

// //     (mat as any)._customTexture = clonedTexture;
// //     return mat;
// //   }, [baseTexture, tileSize.width, tileSize.height, width, height, quality]);

// //   useEffect(() => {
// //     return () => {
// //       if ((material as any)._customTexture) {
// //         (material as any)._customTexture.dispose();
// //       }
// //       material.dispose();
// //     };
// //   }, [material]);

// //   return (
// //     <mesh position={position} rotation={rotation} receiveShadow>
// //       <planeGeometry args={[width, height, 32, 32]} />
// //       <primitive object={material} attach="material" />
// //     </mesh>
// //   );
// // };

// // // ============================================
// // // SHADOWS
// // // ============================================

// // const RealisticShadows: React.FC<{ quality: QualityLevel }> = ({ quality }) => {
// //   if (quality === 'low') {
// //     return <ContactShadows position={[0, 0.01, 0]} opacity={0.3} scale={10} blur={1.5} />;
// //   }

// //   if (quality === 'medium') {
// //     return <ContactShadows position={[0, 0.01, 0]} opacity={0.4} scale={10} blur={2} far={4} />;
// //   }

// //   return (
// //     <AccumulativeShadows
// //       temporal
// //       frames={100}
// //       color="#000000"
// //       colorBlend={0.5}
// //       opacity={0.7}
// //       scale={12}
// //       alphaTest={0.85}
// //       position={[0, 0.01, 0]}
// //     >
// //       <RandomizedLight
// //         amount={8}
// //         radius={5}
// //         ambient={0.5}
// //         intensity={1}
// //         position={[5, 5, -5]}
// //         bias={0.001}
// //       />
// //     </AccumulativeShadows>
// //   );
// // };

// // // ============================================
// // // CAMERA CONTROLLER
// // // ============================================

// // const CameraController: React.FC<{
// //   preset: CameraPreset | null;
// //   autoRotate: boolean;
// //   onTransitionComplete?: () => void;
// // }> = ({ preset, autoRotate, onTransitionComplete }) => {
// //   const { camera } = useThree();
// //   const controlsRef = useRef<any>();
// //   const [isTransitioning, setIsTransitioning] = useState(false);

// //   useEffect(() => {
// //     if (!preset || !controlsRef.current) return;

// //     setIsTransitioning(true);
    
// //     const startPos = camera.position.clone();
// //     const startTarget = controlsRef.current.target.clone();
// //     const endPos = new THREE.Vector3(...preset.position);
// //     const endTarget = new THREE.Vector3(...preset.target);

// //     let progress = 0;
// //     const duration = 1500;
// //     const startTime = Date.now();

// //     const animate = () => {
// //       const elapsed = Date.now() - startTime;
// //       progress = Math.min(elapsed / duration, 1);
      
// //       const eased = 1 - Math.pow(1 - progress, 3);

// //       camera.position.lerpVectors(startPos, endPos, eased);
// //       controlsRef.current.target.lerpVectors(startTarget, endTarget, eased);
// //       camera.fov = THREE.MathUtils.lerp(camera.fov, preset.fov, eased);
// //       camera.updateProjectionMatrix();

// //       if (progress < 1) {
// //         requestAnimationFrame(animate);
// //       } else {
// //         setIsTransitioning(false);
// //         onTransitionComplete?.();
// //       }
// //     };

// //     animate();
// //   }, [preset, camera, onTransitionComplete]);

// //   return (
// //     <OrbitControls
// //       ref={controlsRef}
// //       enablePan={!isTransitioning}
// //       enableZoom={!isTransitioning}
// //       enableRotate={!isTransitioning}
// //       autoRotate={autoRotate && !isTransitioning}
// //       autoRotateSpeed={0.5}
// //       maxPolarAngle={Math.PI * 0.95}
// //       minPolarAngle={Math.PI * 0.05}
// //       minDistance={0.8}
// //       maxDistance={10}
// //       enableDamping
// //       dampingFactor={0.05}
// //       rotateSpeed={0.5}
// //       zoomSpeed={0.8}
// //       panSpeed={0.5}

  
// //   // Camera distance limits


  
// //   // Vertical angle limits (keeps camera inside)


  
// //   // Horizontal tation limits
// //   minAzimuthAngle={-Math.PI / 2}
// //   maxAzimuthAngle={Math.PI / 2}
  
// //   // Look at center of room
// //   target={[0, 1.4, 0]}
  
// //   // Smooth damping
// //   enableDamping={true}
// //   dampingFactor={0.05}
  
// //   // Pan limits (optional - keeps within bounds)
// //   maxTargetRadius={4}
// //     />
// //   );
// // };

// // // ============================================
// // // CEILING
// // // ============================================

// // const Ceiling: React.FC<{
// //   width: number;
// //   depth: number;
// //   height: number;
// // }> = ({ width, depth, height }) => {
// //   return (
// //     <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, height, 0]} receiveShadow>
// //       <planeGeometry args={[width, depth]} />
// //       <meshStandardMaterial 
// //         color="#fefefe" 
// //         roughness={0.9}
// //         metalness={0}
// //         envMapIntensity={0.1}
// //       />
// //     </mesh>
// //   );
// // };

// // // ============================================
// // // KITCHEN & BATHROOM SCENES (Simplified)
// // // ============================================

// // const KitchenScene: React.FC<{ 
// //   floorTexture: THREE.Texture | null;
// //   floorTileSize: { width: number; height: number };
// //   wallTexture: THREE.Texture | null;
// //   wallTileSize: { width: number; height: number };
// //   showWallTiles: boolean;
// //   quality: QualityLevel;
// // }> = ({ floorTexture, floorTileSize, wallTexture, wallTileSize, showWallTiles, quality }) => {
// //   const { width: W, depth: D, height: H } = ROOM_CONFIGS.kitchen;

// //   return (
// //     <group>
// //       <TiledFloor
// //         baseTexture={floorTexture}
// //         tileSize={floorTileSize}
// //         roomWidth={W}
// //         roomDepth={D}
// //         position={[0, 0, 0]}
// //         quality={quality}
// //       />

// //       <Ceiling width={W} depth={D} height={H} />

// //       <TiledWall
// //         baseTexture={showWallTiles ? wallTexture : null}
// //         tileSize={wallTileSize}
// //         width={W}
// //         height={H}
// //         position={[0, H/2, -D/2]}
// //         quality={quality}
// //       />

// //       <mesh position={[0, H/2, D/2]} rotation={[0, Math.PI, 0]} receiveShadow>
// //         <planeGeometry args={[W, H]} />
// //         <meshStandardMaterial color="#f0f0f0" roughness={0.9} />
// //       </mesh>

// //       <mesh position={[-W/2, H/2, 0]} rotation={[0, Math.PI/2, 0]} receiveShadow>
// //         <planeGeometry args={[D, H]} />
// //         <meshStandardMaterial color="#f0f0f0" roughness={0.9} />
// //       </mesh>

// //       <mesh position={[W/2, H/2, 0]} rotation={[0, -Math.PI/2, 0]} receiveShadow>
// //         <planeGeometry args={[D, H]} />
// //         <meshStandardMaterial color="#f0f0f0" roughness={0.9} />
// //       </mesh>

// //       <group position={[0, 0, -2.35]}>
// //         <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
// //           <boxGeometry args={[3.6, 0.9, 0.65]} />
// //           <meshStandardMaterial color="#6b4e3d" roughness={0.7} />
// //         </mesh>
// //         <mesh position={[0, 0.92, 0]} castShadow receiveShadow>
// //           <boxGeometry args={[3.7, 0.04, 0.7]} />
// //           <meshStandardMaterial color="#1a1a1a" roughness={0.2} metalness={0.6} />
// //         </mesh>
// //         <mesh position={[0, 1.85, -0.25]} castShadow receiveShadow>
// //           <boxGeometry args={[3.6, 0.85, 0.4]} />
// //           <meshStandardMaterial color="#7a5c47" roughness={0.7} />
// //         </mesh>
// //       </group>

// //       <mesh position={[1.75, 1.05, -2.25]} castShadow receiveShadow>
// //         <boxGeometry args={[0.75, 2.1, 0.75]} />
// //         <meshStandardMaterial color="#e5e5e5" roughness={0.15} metalness={0.7} />
// //       </mesh>

// //       <RealisticShadows quality={quality} />
// //     </group>
// //   );
// // };

// // const BathroomScene: React.FC<{ 
// //   floorTexture: THREE.Texture | null;
// //   floorTileSize: { width: number; height: number };
// //   wallTexture: THREE.Texture | null;
// //   wallTileSize: { width: number; height: number };
// //   showWallTiles: boolean;
// //   quality: QualityLevel;
// // }> = ({ floorTexture, floorTileSize, wallTexture, wallTileSize, showWallTiles, quality }) => {
// //   const { width: W, depth: D, height: H } = ROOM_CONFIGS.bathroom;

// //   return (
// //     <group>
// //       <TiledFloor
// //         baseTexture={floorTexture}
// //         tileSize={floorTileSize}
// //         roomWidth={W}
// //         roomDepth={D}
// //         position={[0, 0, 0]}
// //         quality={quality}
// //       />

// //       <Ceiling width={W} depth={D} height={H} />

// //       <TiledWall
// //         baseTexture={showWallTiles ? wallTexture : null}
// //         tileSize={wallTileSize}
// //         width={W}
// //         height={H}
// //         position={[0, H/2, -D/2]}
// //         quality={quality}
// //       />

// //       <TiledWall
// //         baseTexture={showWallTiles ? wallTexture : null}
// //         tileSize={wallTileSize}
// //         width={W}
// //         height={H}
// //         position={[0, H/2, D/2]}
// //         rotation={[0, Math.PI, 0]}
// //         quality={quality}
// //       />

// //       <TiledWall
// //         baseTexture={showWallTiles ? wallTexture : null}
// //         tileSize={wallTileSize}
// //         width={D}
// //         height={H}
// //         position={[-W/2, H/2, 0]}
// //         rotation={[0, Math.PI/2, 0]}
// //         quality={quality}
// //       />

// //       <TiledWall
// //         baseTexture={showWallTiles ? wallTexture : null}
// //         tileSize={wallTileSize}
// //         width={D}
// //         height={H}
// //         position={[W/2, H/2, 0]}
// //         rotation={[0, -Math.PI/2, 0]}
// //         quality={quality}
// //       />

// //       <group position={[-0.85, 0, -1.3]}>
// //         <mesh position={[0, 0.32, 0]} castShadow receiveShadow>
// //           <cylinderGeometry args={[0.27, 0.22, 0.64, 20]} />
// //           <meshStandardMaterial color="#fafafa" roughness={0.05} metalness={0.1} />
// //         </mesh>
// //       </group>

// //       <RealisticShadows quality={quality} />
// //     </group>
// //   );
// // };

// // const SceneLoader: React.FC = () => (
// //   <mesh>
// //     <boxGeometry args={[1, 1, 1]} />
// //     <meshStandardMaterial color="#3b82f6" />
// //   </mesh>
// // );

// // // ============================================
// // // MAIN COMPONENT
// // // ============================================

// // export const Enhanced3DViewer: React.FC<Enhanced3DViewerProps> = ({
// //   roomType,
// //   floorTile,
// //   wallTile,
// //   activeSurface,
// // }) => {
// //   const [isFullscreen, setIsFullscreen] = useState(false);
// //   const [showControls, setShowControls] = useState(true);
// //   const [selectedPreset, setSelectedPreset] = useState<CameraPreset | null>(null);
// //   const [autoRotate, setAutoRotate] = useState(false);
// //   const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>('afternoon');
// //   const [quality, setQuality] = useState<QualityLevel>('high');
// //   const [showSettings, setShowSettings] = useState(false);

// //   const autoQuality = useDeviceQuality();

// //   useEffect(() => {
// //     setQuality(autoQuality);
// //   }, [autoQuality]);

// //   const floorTexture = useHighQualityTexture(
// //     floorTile?.texture,
// //     floorTile?.size.width || 60,
// //     floorTile?.size.height || 60
// //   );

// //   const wallTexture = useHighQualityTexture(
// //     wallTile?.texture,
// //     wallTile?.size.width || 30,
// //     wallTile?.size.height || 45
// //   );

// //   const handleReset = () => {
// //     setSelectedPreset(null);
// //     setAutoRotate(false);
// //     setTimeOfDay('afternoon');
// //   };

// //   const toggleFullscreen = () => {
// //     if (!document.fullscreenElement) {
// //       document.documentElement.requestFullscreen();
// //       setIsFullscreen(true);
// //     } else {
// //       document.exitFullscreen();
// //       setIsFullscreen(false);
// //     }
// //   };

// //   // ✅ FIX: renderScene now properly uses quality from state
// //   const renderScene = () => {
// //     const showWallTiles = activeSurface === 'wall' || activeSurface === 'both';
// //     const showFloorTiles = activeSurface === 'floor' || activeSurface === 'both';

// //     const defaultFloorSize = { width: 60, height: 60 };
// //     const defaultWallSize = { width: 30, height: 45 };

// //     switch (roomType) {
// //       case 'drawing':
// //         return (
// //           <LuxuryDrawingRoomScene 
// //             floorTexture={showFloorTiles ? floorTexture : null}
// //             floorTileSize={floorTile?.size || defaultFloorSize}
// //             quality={quality}
// //           />
// //         );
// //       case 'kitchen':
// //         return (
// //           <KitchenScene
// //             floorTexture={showFloorTiles ? floorTexture : null}
// //             floorTileSize={floorTile?.size || defaultFloorSize}
// //             wallTexture={showWallTiles ? wallTexture : null}
// //             wallTileSize={wallTile?.size || defaultWallSize}
// //             showWallTiles={showWallTiles}
// //             quality={quality}
// //           />
// //         );
// //       case 'bathroom':
// //         return (
// //           <BathroomScene
// //             floorTexture={showFloorTiles ? floorTexture : null}
// //             floorTileSize={floorTile?.size || defaultFloorSize}
// //             wallTexture={showWallTiles ? wallTexture : null}
// //             wallTileSize={wallTile?.size || defaultWallSize}
// //             showWallTiles={showWallTiles}
// //             quality={quality}
// //           />
// //         );
// //     }
// //   };

// //   const presets = CAMERA_PRESETS[roomType] || [];
// //   const hasFloorTile = !!floorTile?.texture;
// //   const hasWallTile = !!wallTile?.texture;

// //   return (
// //     <div className="relative w-full h-full bg-gradient-to-b from-gray-900 to-black">
// //       <Canvas
// //         shadows
// //         gl={{ 
// //           antialias: true,
// //           toneMapping: THREE.ACESFilmicToneMapping,
// //           toneMappingExposure: 1.5,
// //           powerPreference: 'high-performance',
// //           outputColorSpace: THREE.SRGBColorSpace
// //         }}
// //         camera={{
// //           position: [0, 1.6, 3],
// //           fov: 50,
// //           near: 0.1,
// //           far: 1000
// //         }}
// //       >
// //         <Suspense fallback={<SceneLoader />}>
// //           <color attach="background" args={['#e8f4f8']} />

// //           <AdvancedLighting roomType={roomType} timeOfDay={timeOfDay} quality={quality} />

// //           {renderScene()}

// //           <CameraController 
// //             preset={selectedPreset} 
// //             autoRotate={autoRotate}
// //             onTransitionComplete={() => setSelectedPreset(null)}
// //           />

// //           <Environment preset="apartment" background={false} />

// //           <Sky 
// //             distance={450000}
// //             sunPosition={LIGHTING_PRESETS[timeOfDay].sunPosition}
// //             inclination={0.6}
// //             azimuth={0.25}
// //             turbidity={LIGHTING_PRESETS[timeOfDay].skyTurbidity}
// //             rayleigh={LIGHTING_PRESETS[timeOfDay].skyRayleigh}
// //           />

// //           <BakeShadows />
// //         </Suspense>
// //       </Canvas>

// //       {showControls && (
// //         <div className="absolute top-4 left-4 bg-black/80 text-white px-4 py-3 rounded-xl backdrop-blur-md shadow-2xl border border-white/10 max-w-xs">
// //           <p className="font-semibold mb-1 flex items-center gap-2 text-sm">
// //             <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
// //             {roomType.charAt(0).toUpperCase() + roomType.slice(1)} Room
// //           </p>
// //           <p className="text-xs opacity-75">
// //             Quality: <span className="text-blue-400 font-medium capitalize">{quality}</span>
// //           </p>
// //           {floorTile && (
// //             <p className="text-xs opacity-75 mt-1">
// //               Floor: {floorTile.size.width}×{floorTile.size.height} cm
// //             </p>
// //           )}
// //           {wallTile && (
// //             <p className="text-xs opacity-75">
// //               Wall: {wallTile.size.width}×{wallTile.size.height} cm
// //             </p>
// //           )}
// //         </div>
// //       )}

// //       <div className="absolute top-4 right-4 bg-black/80 text-white px-4 py-3 rounded-xl backdrop-blur-md shadow-2xl border border-white/10">
// //         <p className="text-xs font-medium mb-1">Applied:</p>
// //         <p className="text-sm font-bold capitalize">{activeSurface}</p>
// //         {hasFloorTile && <p className="text-xs opacity-75 mt-1 text-green-400">✓ Floor Tile</p>}
// //         {hasWallTile && <p className="text-xs opacity-75 text-blue-400">✓ Wall Tile</p>}
// //       </div>

// //       <div className="absolute top-24 right-4 bg-black/80 text-white p-3 rounded-xl backdrop-blur-md shadow-2xl border border-white/10">
// //         <p className="text-xs font-semibold mb-2 flex items-center gap-2">
// //           <Camera className="w-3 h-3" />
// //           Camera Views
// //         </p>
// //         <div className="flex flex-col gap-1.5">
// //           {presets.map((preset, index) => (
// //             <button
// //               key={index}
// //               onClick={() => setSelectedPreset(preset)}
// //               className="px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-xs transition-all hover:scale-105"
// //             >
// //               {preset.name}
// //             </button>
// //           ))}
// //         </div>
// //       </div>

// //       <div className="absolute bottom-24 left-4 bg-black/80 text-white p-3 rounded-xl backdrop-blur-md shadow-2xl border border-white/10">
// //         <p className="text-xs font-semibold mb-2 flex items-center gap-2">
// //           <Sun className="w-3 h-3" />
// //           Time of Day
// //         </p>
// //         <div className="flex flex-col gap-1.5">
// //           {(['morning', 'afternoon', 'evening', 'night'] as TimeOfDay[]).map((time) => (
// //             <button
// //               key={time}
// //               onClick={() => setTimeOfDay(time)}
// //               className={`px-3 py-1.5 rounded-lg text-xs transition-all capitalize ${
// //                 timeOfDay === time 
// //                   ? 'bg-blue-600 scale-105' 
// //                   : 'bg-white/10 hover:bg-white/20'
// //               }`}
// //             >
// //               {time === 'morning' && '🌅'}
// //               {time === 'afternoon' && '☀️'}
// //               {time === 'evening' && '🌆'}
// //               {time === 'night' && '🌙'}
// //               {' '}{time}
// //             </button>
// //           ))}
// //         </div>
// //       </div>

// //       {showSettings && (
// //         <div className="absolute bottom-24 right-4 bg-black/90 text-white p-4 rounded-xl backdrop-blur-md shadow-2xl border border-white/10 min-w-[200px]">
// //           <p className="text-xs font-semibold mb-3 flex items-center gap-2">
// //             <Settings className="w-3 h-3" />
// //             Settings
// //           </p>
          
// //           <div className="space-y-3">
// //             <div>
// //               <p className="text-xs mb-1.5 opacity-75">Quality</p>
// //               <div className="flex flex-col gap-1">
// //                 {(['ultra', 'high', 'medium', 'low'] as QualityLevel[]).map((q) => (
// //                   <button
// //                     key={q}
// //                     onClick={() => setQuality(q)}
// //                     className={`px-2 py-1 rounded text-xs capitalize transition-all ${
// //                       quality === q 
// //                         ? 'bg-blue-600' 
// //                         : 'bg-white/10 hover:bg-white/20'
// //                     }`}
// //                   >
// //                     {q}
// //                   </button>
// //                 ))}
// //               </div>
// //             </div>

// //             <div>
// //               <label className="flex items-center gap-2 text-xs cursor-pointer">
// //                 <input
// //                   type="checkbox"
// //                   checked={autoRotate}
// //                   onChange={(e) => setAutoRotate(e.target.checked)}
// //                   className="w-3 h-3"
// //                 />
// //                 <span>Auto Rotate</span>
// //               </label>
// //             </div>
// //           </div>
// //         </div>
// //       )}

// //       <div className="absolute bottom-4 right-4 flex gap-2">
// //         <button
// //           onClick={() => setShowControls(!showControls)}
// //           className="bg-black/80 text-white p-3 rounded-xl hover:bg-black/95 transition-all backdrop-blur-md shadow-xl border border-white/10 hover:scale-105"
// //           title="Info"
// //         >
// //           <Info className="w-5 h-5" />
// //         </button>
// //         <button
// //           onClick={() => setShowSettings(!showSettings)}
// //           className="bg-black/80 text-white p-3 rounded-xl hover:bg-black/95 transition-all backdrop-blur-md shadow-xl border border-white/10 hover:scale-105"
// //           title="Settings"
// //         >
// //           <Settings className="w-5 h-5" />
// //         </button>
// //         <button
// //           onClick={() => setAutoRotate(!autoRotate)}
// //           className={`bg-black/80 text-white p-3 rounded-xl hover:bg-black/95 transition-all backdrop-blur-md shadow-xl border border-white/10 hover:scale-105 ${
// //             autoRotate ? 'ring-2 ring-blue-500' : ''
// //           }`}
// //           title={autoRotate ? 'Stop Rotation' : 'Auto Rotate'}
// //         >
// //           {autoRotate ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
// //         </button>
// //         <button
// //           onClick={handleReset}
// //           className="bg-black/80 text-white p-3 rounded-xl hover:bg-black/95 transition-all backdrop-blur-md shadow-xl border border-white/10 hover:scale-105"
// //           title="Reset"
// //         >
// //           <RotateCcw className="w-5 h-5" />
// //         </button>
// //         <button
// //           onClick={toggleFullscreen}
// //           className="bg-black/80 text-white p-3 rounded-xl hover:bg-black/95 transition-all backdrop-blur-md shadow-xl border border-white/10 hover:scale-105"
// //           title="Fullscreen"
// //         >
// //           {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
// //         </button>
// //       </div>

// //       {(!hasFloorTile && !hasWallTile) && (
// //         <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-md pointer-events-none">
// //           <div className="bg-white rounded-2xl p-8 text-center shadow-2xl max-w-md">
// //             <Package className="w-16 h-16 mx-auto mb-4 text-blue-600" />
// //             <p className="text-gray-800 font-semibold text-lg mb-2">No Tiles Applied</p>
// //             <p className="text-gray-500 text-sm">Upload floor and/or wall tiles to visualize</p>
// //           </div>
// //         </div>
// //       )}
// //     </div>
// //   );
// // };

// // export default Enhanced3DViewer;  
// // src/components/Enhanced3DViewer.tsx
// import React, { useState, useEffect, Suspense, useMemo, useRef } from 'react';
// import { Canvas, useThree } from '@react-three/fiber';
// import { OrbitControls } from '@react-three/drei';
// import * as THREE from 'three';
// import { 
//   Maximize2, 
//   Minimize2, 
//   RotateCcw, 
//   Info, 
//   Camera, 
//   Sun,
//   Play,
//   Pause,
//   Settings,
//   Package
// } from 'lucide-react';

// // Import luxury scene
// import { LuxuryDrawingRoomScene } from './LuxuryDrawingRoomScene';

// // ============================================
// // TYPES & INTERFACES
// // ============================================

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
// }

// interface CameraPreset {
//   position: [number, number, number];
//   target: [number, number, number];
//   name: string;
//   fov: number;
// }

// type QualityLevel = 'ultra' | 'high' | 'medium' | 'low';
// type TimeOfDay = 'morning' | 'afternoon' | 'evening' | 'night';

// // ============================================
// // CONSTANTS
// // ============================================

// const ROOM_CONFIGS = {
//   drawing: { width: 5, depth: 6, height: 3 },
//   kitchen: { width: 4, depth: 5, height: 2.8 },
//   bathroom: { width: 3, depth: 3.5, height: 2.8 }
// } as const;

// const CAMERA_PRESETS: Record<string, CameraPreset[]> = {
//   drawing: [
//     { name: 'Luxury View', position: [5, 2, 6], target: [0, 1.2, 0], fov: 45 },
//     { name: 'TV Wall Focus', position: [2, 1.5, 4], target: [0, 1.5, -4.5], fov: 50 },
//     { name: 'Sofa Area', position: [-3, 1.8, 4], target: [0, 1, 2], fov: 48 },
//     { name: 'Full Room', position: [6, 3, 0], target: [0, 1.5, 0], fov: 55 },
//   ],
//   kitchen: [
//     { name: 'Overview', position: [3, 2.2, 4], target: [0, 1.2, 0], fov: 50 },
//     { name: 'Counter View', position: [0, 1.4, 2.5], target: [0, 1, -1.5], fov: 45 },
//     { name: 'Floor Detail', position: [1.5, 1.8, 2], target: [0, 0, 0], fov: 40 },
//     { name: 'Backsplash', position: [0, 1.6, 1.5], target: [0, 1.4, -2], fov: 50 },
//   ],
//   bathroom: [
//     { name: 'Overview', position: [2, 2, 2.5], target: [0, 1.2, 0], fov: 55 },
//     { name: 'Mirror View', position: [0, 1.5, 2], target: [0, 1.5, -1.5], fov: 50 },
//     { name: 'Floor Tiles', position: [1, 1.6, 1.5], target: [0, 0, 0], fov: 45 },
//     { name: 'Wall Detail', position: [1.2, 1.4, 0.8], target: [-1, 1.4, 0], fov: 40 },
//   ],
// };

// // ============================================
// // CUSTOM HOOKS
// // ============================================

// const useHighQualityTexture = (
//   textureUrl: string | undefined,
//   tileWidth: number,
//   tileHeight: number
// ) => {
//   const [texture, setTexture] = useState<THREE.Texture | null>(null);
//   const textureRef = useRef<THREE.Texture | null>(null);

//   useEffect(() => {
//     if (!textureUrl) {
//       if (textureRef.current) {
//         textureRef.current.dispose();
//         textureRef.current = null;
//       }
//       setTexture(null);
//       return;
//     }

//     let isCancelled = false;
//     const loader = new THREE.TextureLoader();
    
//     loader.load(
//       textureUrl,
//       (loadedTexture) => {
//         if (isCancelled) {
//           loadedTexture.dispose();
//           return;
//         }

//         if (textureRef.current) {
//           textureRef.current.dispose();
//         }

//         // ✅ EXACT COLOR PRESERVATION
//         loadedTexture.colorSpace = THREE.SRGBColorSpace;
//         loadedTexture.wrapS = THREE.RepeatWrapping;
//         loadedTexture.wrapT = THREE.RepeatWrapping;
//         loadedTexture.minFilter = THREE.LinearMipMapLinearFilter;
//         loadedTexture.magFilter = THREE.LinearFilter;
//         loadedTexture.anisotropy = 16;
//         loadedTexture.needsUpdate = true;
        
//         textureRef.current = loadedTexture;
//         setTexture(loadedTexture);
//       },
//       undefined,
//       (error) => {
//         if (!isCancelled) {
//           console.error('Texture loading error:', error);
//           setTexture(null);
//         }
//       }
//     );
    
//     return () => {
//       isCancelled = true;
//       if (textureRef.current) {
//         textureRef.current.dispose();
//         textureRef.current = null;
//       }
//     };
//   }, [textureUrl, tileWidth, tileHeight]);

//   return texture;
// };

// const useDeviceQuality = (): QualityLevel => {
//   const [quality, setQuality] = useState<QualityLevel>('high');

//   useEffect(() => {
//     const canvas = document.createElement('canvas');
//     const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    
//     if (!gl) {
//       setQuality('low');
//       return;
//     }

//     const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
//     const renderer = debugInfo ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : '';
    
//     const isMobile = /mobile|android|iphone|ipad/i.test(navigator.userAgent);
//     const isHighEnd = /apple gpu|adreno 6|mali-g|nvidia|amd/i.test(renderer.toLowerCase());
    
//     if (isMobile) {
//       setQuality(isHighEnd ? 'medium' : 'low');
//     } else {
//       setQuality(isHighEnd ? 'ultra' : 'high');
//     }
//   }, []);

//   return quality;
// };

// // ============================================
// // LIGHTING COMPONENTS - MINIMAL FOR ROOM ONLY
// // ============================================

// const MinimalLighting: React.FC = () => {
//   return (
//     <>
//       {/* Basic ambient light for room structure visibility */}
//       <ambientLight intensity={0.6} color="#ffffff" />
      
//       {/* Single directional light for depth perception */}
//       <directionalLight
//         position={[5, 5, 5]}
//         intensity={0.5}
//         color="#ffffff"
//       />
      
//       {/* Subtle fill lights */}
//       <pointLight position={[3, 2, 3]} intensity={0.3} color="#ffffff" />
//       <pointLight position={[-3, 2, -3]} intensity={0.3} color="#ffffff" />
//     </>
//   );
// };

// // ============================================
// // TILE COMPONENTS - NO LIGHTING EFFECTS
// // ============================================

// const TiledFloor: React.FC<{
//   baseTexture: THREE.Texture | null;
//   tileSize: { width: number; height: number };
//   roomWidth: number;
//   roomDepth: number;
//   position: [number, number, number];
//   quality: QualityLevel;
// }> = ({ baseTexture, tileSize, roomWidth, roomDepth, position }) => {
  
//   const material = useMemo(() => {
//     if (!baseTexture) {
//       return new THREE.MeshBasicMaterial({
//         color: '#d4d4d4',
//       });
//     }

//     const clonedTexture = baseTexture.clone();
//     clonedTexture.needsUpdate = true;
//     clonedTexture.colorSpace = THREE.SRGBColorSpace;
//     clonedTexture.wrapS = THREE.RepeatWrapping;
//     clonedTexture.wrapT = THREE.RepeatWrapping;
//     clonedTexture.minFilter = THREE.LinearMipMapLinearFilter;
//     clonedTexture.magFilter = THREE.LinearFilter;
    
//     const tileSizeM = {
//       width: tileSize.width / 100,
//       height: tileSize.height / 100
//     };
    
//     const repeatX = roomWidth / tileSizeM.width;
//     const repeatY = roomDepth / tileSizeM.height;
    
//     clonedTexture.repeat.set(repeatX, repeatY);

//     // ✅ MeshBasicMaterial - NO LIGHTING EFFECTS - EXACT COLORS
//     const mat = new THREE.MeshBasicMaterial({
//       map: clonedTexture,
//     });

//     (mat as any)._customTexture = clonedTexture;
//     return mat;
//   }, [baseTexture, tileSize.width, tileSize.height, roomWidth, roomDepth]);

//   useEffect(() => {
//     return () => {
//       if ((material as any)._customTexture) {
//         (material as any)._customTexture.dispose();
//       }
//       material.dispose();
//     };
//   }, [material]);

//   return (
//     <mesh 
//       rotation={[-Math.PI / 2, 0, 0]} 
//       position={position}
//     >
//       <planeGeometry args={[roomWidth, roomDepth]} />
//       <primitive object={material} attach="material" />
//     </mesh>
//   );
// };

// const TiledWall: React.FC<{
//   baseTexture: THREE.Texture | null;
//   tileSize: { width: number; height: number };
//   width: number;
//   height: number;
//   position: [number, number, number];
//   rotation?: [number, number, number];
//   quality: QualityLevel;
// }> = ({ baseTexture, tileSize, width, height, position, rotation = [0, 0, 0] }) => {
  
//   const material = useMemo(() => {
//     if (!baseTexture) {
//       return new THREE.MeshBasicMaterial({
//         color: '#f5f5f5',
//       });
//     }

//     const clonedTexture = baseTexture.clone();
//     clonedTexture.needsUpdate = true;
//     clonedTexture.colorSpace = THREE.SRGBColorSpace;
//     clonedTexture.wrapS = THREE.RepeatWrapping;
//     clonedTexture.wrapT = THREE.RepeatWrapping;
//     clonedTexture.minFilter = THREE.LinearMipMapLinearFilter;
//     clonedTexture.magFilter = THREE.LinearFilter;
    
//     const tileSizeM = {
//       width: tileSize.width / 100,
//       height: tileSize.height / 100
//     };
    
//     const repeatX = width / tileSizeM.width;
//     const repeatY = height / tileSizeM.height;
    
//     clonedTexture.repeat.set(repeatX, repeatY);

//     // ✅ MeshBasicMaterial - NO LIGHTING EFFECTS - EXACT COLORS
//     const mat = new THREE.MeshBasicMaterial({
//       map: clonedTexture,
//     });

//     (mat as any)._customTexture = clonedTexture;
//     return mat;
//   }, [baseTexture, tileSize.width, tileSize.height, width, height]);

//   useEffect(() => {
//     return () => {
//       if ((material as any)._customTexture) {
//         (material as any)._customTexture.dispose();
//       }
//       material.dispose();
//     };
//   }, [material]);

//   return (
//     <mesh position={position} rotation={rotation}>
//       <planeGeometry args={[width, height]} />
//       <primitive object={material} attach="material" />
//     </mesh>
//   );
// };

// // ============================================
// // CAMERA CONTROLLER
// // ============================================

// const CameraController: React.FC<{
//   preset: CameraPreset | null;
//   autoRotate: boolean;
//   onTransitionComplete?: () => void;
// }> = ({ preset, autoRotate, onTransitionComplete }) => {
//   const { camera } = useThree();
//   const controlsRef = useRef<any>();
//   const [isTransitioning, setIsTransitioning] = useState(false);

//   useEffect(() => {
//     if (!preset || !controlsRef.current) return;

//     setIsTransitioning(true);
    
//     const startPos = camera.position.clone();
//     const startTarget = controlsRef.current.target.clone();
//     const endPos = new THREE.Vector3(...preset.position);
//     const endTarget = new THREE.Vector3(...preset.target);

//     let progress = 0;
//     const duration = 1500;
//     const startTime = Date.now();

//     const animate = () => {
//       const elapsed = Date.now() - startTime;
//       progress = Math.min(elapsed / duration, 1);
      
//       const eased = 1 - Math.pow(1 - progress, 3);

//       camera.position.lerpVectors(startPos, endPos, eased);
//       controlsRef.current.target.lerpVectors(startTarget, endTarget, eased);
//       camera.fov = THREE.MathUtils.lerp(camera.fov, preset.fov, eased);
//       camera.updateProjectionMatrix();

//       if (progress < 1) {
//         requestAnimationFrame(animate);
//       } else {
//         setIsTransitioning(false);
//         onTransitionComplete?.();
//       }
//     };

//     animate();
//   }, [preset, camera, onTransitionComplete]);

//   return (
//     <OrbitControls
//       ref={controlsRef}
//       enablePan={!isTransitioning}
//       enableZoom={!isTransitioning}
//       enableRotate={!isTransitioning}
//       autoRotate={autoRotate && !isTransitioning}
//       autoRotateSpeed={0.5}
//       maxPolarAngle={Math.PI * 0.95}
//       minPolarAngle={Math.PI * 0.05}
//       minDistance={0.8}
//       maxDistance={10}
//       minAzimuthAngle={-Math.PI / 2}
//       maxAzimuthAngle={Math.PI / 2}
//       target={[0, 1.4, 0]}
//       enableDamping={true}
//       dampingFactor={0.05}
//       maxTargetRadius={4}
//     />
//   );
// };

// // ============================================
// // CEILING
// // ============================================

// const Ceiling: React.FC<{
//   width: number;
//   depth: number;
//   height: number;
// }> = ({ width, depth, height }) => {
//   return (
//     <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, height, 0]}>
//       <planeGeometry args={[width, depth]} />
//       <meshStandardMaterial 
//         color="#fefefe" 
//         roughness={0.9}
//         metalness={0}
//       />
//     </mesh>
//   );
// };

// // ============================================
// // KITCHEN & BATHROOM SCENES
// // ============================================

// const KitchenScene: React.FC<{ 
//   floorTexture: THREE.Texture | null;
//   floorTileSize: { width: number; height: number };
//   wallTexture: THREE.Texture | null;
//   wallTileSize: { width: number; height: number };
//   showWallTiles: boolean;
//   quality: QualityLevel;
// }> = ({ floorTexture, floorTileSize, wallTexture, wallTileSize, showWallTiles, quality }) => {
//   const { width: W, depth: D, height: H } = ROOM_CONFIGS.kitchen;

//   return (
//     <group>
//       <TiledFloor
//         baseTexture={floorTexture}
//         tileSize={floorTileSize}
//         roomWidth={W}
//         roomDepth={D}
//         position={[0, 0, 0]}
//         quality={quality}
//       />

//       <Ceiling width={W} depth={D} height={H} />

//       <TiledWall
//         baseTexture={showWallTiles ? wallTexture : null}
//         tileSize={wallTileSize}
//         width={W}
//         height={H}
//         position={[0, H/2, -D/2]}
//         quality={quality}
//       />

//       <mesh position={[0, H/2, D/2]} rotation={[0, Math.PI, 0]}>
//         <planeGeometry args={[W, H]} />
//         <meshStandardMaterial color="#f0f0f0" roughness={0.9} />
//       </mesh>

//       <mesh position={[-W/2, H/2, 0]} rotation={[0, Math.PI/2, 0]}>
//         <planeGeometry args={[D, H]} />
//         <meshStandardMaterial color="#f0f0f0" roughness={0.9} />
//       </mesh>

//       <mesh position={[W/2, H/2, 0]} rotation={[0, -Math.PI/2, 0]}>
//         <planeGeometry args={[D, H]} />
//         <meshStandardMaterial color="#f0f0f0" roughness={0.9} />
//       </mesh>

//       <group position={[0, 0, -2.35]}>
//         <mesh position={[0, 0.45, 0]} castShadow>
//           <boxGeometry args={[3.6, 0.9, 0.65]} />
//           <meshStandardMaterial color="#6b4e3d" roughness={0.7} />
//         </mesh>
//         <mesh position={[0, 0.92, 0]} castShadow>
//           <boxGeometry args={[3.7, 0.04, 0.7]} />
//           <meshStandardMaterial color="#1a1a1a" roughness={0.2} metalness={0.6} />
//         </mesh>
//         <mesh position={[0, 1.85, -0.25]} castShadow>
//           <boxGeometry args={[3.6, 0.85, 0.4]} />
//           <meshStandardMaterial color="#7a5c47" roughness={0.7} />
//         </mesh>
//       </group>

//       <mesh position={[1.75, 1.05, -2.25]} castShadow>
//         <boxGeometry args={[0.75, 2.1, 0.75]} />
//         <meshStandardMaterial color="#e5e5e5" roughness={0.15} metalness={0.7} />
//       </mesh>
//     </group>
//   );
// };

// const BathroomScene: React.FC<{ 
//   floorTexture: THREE.Texture | null;
//   floorTileSize: { width: number; height: number };
//   wallTexture: THREE.Texture | null;
//   wallTileSize: { width: number; height: number };
//   showWallTiles: boolean;
//   quality: QualityLevel;
// }> = ({ floorTexture, floorTileSize, wallTexture, wallTileSize, showWallTiles, quality }) => {
//   const { width: W, depth: D, height: H } = ROOM_CONFIGS.bathroom;

//   return (
//     <group>
//       <TiledFloor
//         baseTexture={floorTexture}
//         tileSize={floorTileSize}
//         roomWidth={W}
//         roomDepth={D}
//         position={[0, 0, 0]}
//         quality={quality}
//       />

//       <Ceiling width={W} depth={D} height={H} />

//       <TiledWall
//         baseTexture={showWallTiles ? wallTexture : null}
//         tileSize={wallTileSize}
//         width={W}
//         height={H}
//         position={[0, H/2, -D/2]}
//         quality={quality}
//       />

//       <TiledWall
//         baseTexture={showWallTiles ? wallTexture : null}
//         tileSize={wallTileSize}
//         width={W}
//         height={H}
//         position={[0, H/2, D/2]}
//         rotation={[0, Math.PI, 0]}
//         quality={quality}
//       />

//       <TiledWall
//         baseTexture={showWallTiles ? wallTexture : null}
//         tileSize={wallTileSize}
//         width={D}
//         height={H}
//         position={[-W/2, H/2, 0]}
//         rotation={[0, Math.PI/2, 0]}
//         quality={quality}
//       />

//       <TiledWall
//         baseTexture={showWallTiles ? wallTexture : null}
//         tileSize={wallTileSize}
//         width={D}
//         height={H}
//         position={[W/2, H/2, 0]}
//         rotation={[0, -Math.PI/2, 0]}
//         quality={quality}
//       />

//       <group position={[-0.85, 0, -1.3]}>
//         <mesh position={[0, 0.32, 0]} castShadow>
//           <cylinderGeometry args={[0.27, 0.22, 0.64, 20]} />
//           <meshStandardMaterial color="#fafafa" roughness={0.05} metalness={0.1} />
//         </mesh>
//       </group>
//     </group>
//   );
// };

// const SceneLoader: React.FC = () => (
//   <mesh>
//     <boxGeometry args={[1, 1, 1]} />
//     <meshStandardMaterial color="#3b82f6" />
//   </mesh>
// );

// // ============================================
// // MAIN COMPONENT
// // ============================================

// export const Enhanced3DViewer: React.FC<Enhanced3DViewerProps> = ({
//   roomType,
//   floorTile,
//   wallTile,
//   activeSurface,
// }) => {
//   const [isFullscreen, setIsFullscreen] = useState(false);
//   const [showControls, setShowControls] = useState(true);
//   const [selectedPreset, setSelectedPreset] = useState<CameraPreset | null>(null);
//   const [autoRotate, setAutoRotate] = useState(false);
//   const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>('afternoon');
//   const [quality, setQuality] = useState<QualityLevel>('high');
//   const [showSettings, setShowSettings] = useState(false);

//   const autoQuality = useDeviceQuality();

//   useEffect(() => {
//     setQuality(autoQuality);
//   }, [autoQuality]);

//   const floorTexture = useHighQualityTexture(
//     floorTile?.texture,
//     floorTile?.size.width || 60,
//     floorTile?.size.height || 60
//   );

//   const wallTexture = useHighQualityTexture(
//     wallTile?.texture,
//     wallTile?.size.width || 30,
//     wallTile?.size.height || 45
//   );

//   const handleReset = () => {
//     setSelectedPreset(null);
//     setAutoRotate(false);
//     setTimeOfDay('afternoon');
//   };

//   const toggleFullscreen = () => {
//     if (!document.fullscreenElement) {
//       document.documentElement.requestFullscreen();
//       setIsFullscreen(true);
//     } else {
//       document.exitFullscreen();
//       setIsFullscreen(false);
//     }
//   };

//   const renderScene = () => {
//     const showWallTiles = activeSurface === 'wall' || activeSurface === 'both';
//     const showFloorTiles = activeSurface === 'floor' || activeSurface === 'both';

//     const defaultFloorSize = { width: 60, height: 60 };
//     const defaultWallSize = { width: 30, height: 45 };

//     switch (roomType) {
//       case 'drawing':
//         return (
//           <LuxuryDrawingRoomScene 
//             floorTexture={showFloorTiles ? floorTexture : null}
//             floorTileSize={floorTile?.size || defaultFloorSize}
//             quality={quality}
//           />
//         );
//       case 'kitchen':
//         return (
//           <KitchenScene
//             floorTexture={showFloorTiles ? floorTexture : null}
//             floorTileSize={floorTile?.size || defaultFloorSize}
//             wallTexture={showWallTiles ? wallTexture : null}
//             wallTileSize={wallTile?.size || defaultWallSize}
//             showWallTiles={showWallTiles}
//             quality={quality}
//           />
//         );
//       case 'bathroom':
//         return (
//           <BathroomScene
//             floorTexture={showFloorTiles ? floorTexture : null}
//             floorTileSize={floorTile?.size || defaultFloorSize}
//             wallTexture={showWallTiles ? wallTexture : null}
//             wallTileSize={wallTile?.size || defaultWallSize}
//             showWallTiles={showWallTiles}
//             quality={quality}
//           />
//         );
//     }
//   };

//   const presets = CAMERA_PRESETS[roomType] || [];
//   const hasFloorTile = !!floorTile?.texture;
//   const hasWallTile = !!wallTile?.texture;

//   return (
//     <div className="relative w-full h-full bg-gradient-to-b from-gray-900 to-black">
//       <Canvas
//         gl={{ 
//           antialias: true,
//           toneMapping: THREE.NoToneMapping,
//           outputColorSpace: THREE.SRGBColorSpace,
//           powerPreference: 'high-performance',
//         }}
//         camera={{
//           position: [0, 1.6, 3],
//           fov: 50,
//           near: 0.1,
//           far: 1000
//         }}
//       >
//         <Suspense fallback={<SceneLoader />}>
//           <color attach="background" args={['#e8f4f8']} />

//           <MinimalLighting />

//           {renderScene()}

//           <CameraController 
//             preset={selectedPreset} 
//             autoRotate={autoRotate}
//             onTransitionComplete={() => setSelectedPreset(null)}
//           />
//         </Suspense>
//       </Canvas>

//       {showControls && (
//         <div className="absolute top-4 left-4 bg-black/80 text-white px-4 py-3 rounded-xl backdrop-blur-md shadow-2xl border border-white/10 max-w-xs">
//           <p className="font-semibold mb-1 flex items-center gap-2 text-sm">
//             <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
//             {roomType.charAt(0).toUpperCase() + roomType.slice(1)} Room
//           </p>
//           <p className="text-xs opacity-75">
//             Quality: <span className="text-blue-400 font-medium capitalize">{quality}</span>
//           </p>
//           {floorTile && (
//             <p className="text-xs opacity-75 mt-1">
//               Floor: {floorTile.size.width}×{floorTile.size.height} cm
//             </p>
//           )}
//           {wallTile && (
//             <p className="text-xs opacity-75">
//               Wall: {wallTile.size.width}×{wallTile.size.height} cm
//             </p>
//           )}
//         </div>
//       )}

//       <div className="absolute top-4 right-4 bg-black/80 text-white px-4 py-3 rounded-xl backdrop-blur-md shadow-2xl border border-white/10">
//         <p className="text-xs font-medium mb-1">Applied:</p>
//         <p className="text-sm font-bold capitalize">{activeSurface}</p>
//         {hasFloorTile && <p className="text-xs opacity-75 mt-1 text-green-400">✓ Floor Tile</p>}
//         {hasWallTile && <p className="text-xs opacity-75 text-blue-400">✓ Wall Tile</p>}
//       </div>

//       <div className="absolute top-24 right-4 bg-black/80 text-white p-3 rounded-xl backdrop-blur-md shadow-2xl border border-white/10">
//         <p className="text-xs font-semibold mb-2 flex items-center gap-2">
//           <Camera className="w-3 h-3" />
//           Camera Views
//         </p>
//         <div className="flex flex-col gap-1.5">
//           {presets.map((preset, index) => (
//             <button
//               key={index}
//               onClick={() => setSelectedPreset(preset)}
//               className="px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-xs transition-all hover:scale-105"
//             >
//               {preset.name}
//             </button>
//           ))}
//         </div>
//       </div>

//       {showSettings && (
//         <div className="absolute bottom-24 right-4 bg-black/90 text-white p-4 rounded-xl backdrop-blur-md shadow-2xl border border-white/10 min-w-[200px]">
//           <p className="text-xs font-semibold mb-3 flex items-center gap-2">
//             <Settings className="w-3 h-3" />
//             Settings
//           </p>
          
//           <div className="space-y-3">
//             <div>
//               <p className="text-xs mb-1.5 opacity-75">Quality</p>
//               <div className="flex flex-col gap-1">
//                 {(['ultra', 'high', 'medium', 'low'] as QualityLevel[]).map((q) => (
//                   <button
//                     key={q}
//                     onClick={() => setQuality(q)}
//                     className={`px-2 py-1 rounded text-xs capitalize transition-all ${
//                       quality === q 
//                         ? 'bg-blue-600' 
//                         : 'bg-white/10 hover:bg-white/20'
//                     }`}
//                   >
//                     {q}
//                   </button>
//                 ))}
//               </div>
//             </div>

//             <div>
             
//             </div>
//           </div>
//         </div>
//       )}

//       <div className="absolute bottom-4 right-4 flex gap-2">
//         <button
//           onClick={() => setShowControls(!showControls)}
//           className="bg-black/80 text-white p-3 rounded-xl hover:bg-black/95 transition-all backdrop-blur-md shadow-xl border border-white/10 hover:scale-105"
//           title="Info"
//         >
//           <Info className="w-5 h-5" />
//         </button>
//         <button
//           onClick={() => setShowSettings(!showSettings)}
//           className="bg-black/80 text-white p-3 rounded-xl hover:bg-black/95 transition-all backdrop-blur-md shadow-xl border border-white/10 hover:scale-105"
//           title="Settings"
//         >
//           <Settings className="w-5 h-5" />
//         </button>
 
//         <button
//           onClick={handleReset}
//           className="bg-black/80 text-white p-3 rounded-xl hover:bg-black/95 transition-all backdrop-blur-md shadow-xl border border-white/10 hover:scale-105"
//           title="Reset"
//         >
//           <RotateCcw className="w-5 h-5" />
//         </button>
//         <button
//           onClick={toggleFullscreen}
//           className="bg-black/80 text-white p-3 rounded-xl hover:bg-black/95 transition-all backdrop-blur-md shadow-xl border border-white/10 hover:scale-105"
//           title="Fullscreen"
//         >
//           {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
//         </button>
//       </div>

//       {(!hasFloorTile && !hasWallTile) && (
//         <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-md pointer-events-none">
//           <div className="bg-white rounded-2xl p-8 text-center shadow-2xl max-w-md">
//             <Package className="w-16 h-16 mx-auto mb-4 text-blue-600" />
//             <p className="text-gray-800 font-semibold text-lg mb-2">No Tiles Applied</p>
//             <p className="text-gray-500 text-sm">Upload floor and/or wall tiles to visualize</p>
//           </div>
//         </div>
//       )}  `1`
//     </div>
//   );
// };

// export default Enhanced3DViewer;   

// src/components/Enhanced3DViewer.tsx
import React, { useState, useEffect, Suspense, useMemo, useRef, useCallback } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { 
  Maximize2, 
  Minimize2, 
  RotateCcw, 
  Info, 
  Camera, 
  Settings,
  Package
} from 'lucide-react';

// Import luxury scene
import { LuxuryDrawingRoomScene } from './LuxuryDrawingRoomScene';

// ============================================
// TYPES & INTERFACES
// ============================================

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
}

interface CameraPreset {
  position: [number, number, number];
  target: [number, number, number];
  name: string;
  fov: number;
}

type QualityLevel = 'ultra' | 'high' | 'medium' | 'low';

// ============================================
// CONSTANTS
// ============================================

const ROOM_CONFIGS = {
  drawing: { width: 5, depth: 6, height: 3 },
  kitchen: { width: 4, depth: 5, height: 2.8 },
  bathroom: { width: 3, depth: 3.5, height: 2.8 }
} as const;

const CAMERA_PRESETS: Record<string, CameraPreset[]> = {
  drawing: [
    { name: 'Luxury View', position: [5, 2, 6], target: [0, 1.2, 0], fov: 45 },
    { name: 'TV Wall Focus', position: [2, 1.5, 4], target: [0, 1.5, -4.5], fov: 50 },
    { name: 'Sofa Area', position: [-3, 1.8, 4], target: [0, 1, 2], fov: 48 },
    { name: 'Full Room', position: [6, 3, 0], target: [0, 1.5, 0], fov: 55 },
  ],
  kitchen: [
    { name: 'Overview', position: [3, 2.2, 4], target: [0, 1.2, 0], fov: 50 },
    { name: 'Counter View', position: [0, 1.4, 2.5], target: [0, 1, -1.5], fov: 45 },
    { name: 'Floor Detail', position: [1.5, 1.8, 2], target: [0, 0, 0], fov: 40 },
    { name: 'Backsplash', position: [0, 1.6, 1.5], target: [0, 1.4, -2], fov: 50 },
  ],
  bathroom: [
    { name: 'Overview', position: [2, 2, 2.5], target: [0, 1.2, 0], fov: 55 },
    { name: 'Mirror View', position: [0, 1.5, 2], target: [0, 1.5, -1.5], fov: 50 },
    { name: 'Floor Tiles', position: [1, 1.6, 1.5], target: [0, 0, 0], fov: 45 },
    { name: 'Wall Detail', position: [1.2, 1.4, 0.8], target: [-1, 1.4, 0], fov: 40 },
  ],
};

// ============================================
// CUSTOM HOOKS
// ============================================

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

// ============================================
// LIGHTING COMPONENTS
// ============================================

const MinimalLighting: React.FC = () => {
  return (
    <>
      <ambientLight intensity={0.6} color="#ffffff" />
      <directionalLight
        position={[5, 5, 5]}
        intensity={0.5}
        color="#ffffff"
      />
      <pointLight position={[3, 2, 3]} intensity={0.3} color="#ffffff" />
      <pointLight position={[-3, 2, -3]} intensity={0.3} color="#ffffff" />
    </>
  );
};

// ============================================
// TILE COMPONENTS
// ============================================

const TiledFloor: React.FC<{
  baseTexture: THREE.Texture | null;
  tileSize: { width: number; height: number };
  roomWidth: number;
  roomDepth: number;
  position: [number, number, number];
  quality: QualityLevel;
}> = ({ baseTexture, tileSize, roomWidth, roomDepth, position }) => {
  
  const material = useMemo(() => {
    if (!baseTexture) {
      return new THREE.MeshBasicMaterial({
        color: '#d4d4d4',
      });
    }

    const clonedTexture = baseTexture.clone();
    clonedTexture.needsUpdate = true;
    clonedTexture.colorSpace = THREE.SRGBColorSpace;
    clonedTexture.wrapS = THREE.RepeatWrapping;
    clonedTexture.wrapT = THREE.RepeatWrapping;
    clonedTexture.minFilter = THREE.LinearMipMapLinearFilter;
    clonedTexture.magFilter = THREE.LinearFilter;
    
    const tileSizeM = {
      width: tileSize.width / 100,
      height: tileSize.height / 100
    };
    
    const repeatX = roomWidth / tileSizeM.width;
    const repeatY = roomDepth / tileSizeM.height;
    
    clonedTexture.repeat.set(repeatX, repeatY);

    const mat = new THREE.MeshBasicMaterial({
      map: clonedTexture,
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

  return (
    <mesh 
      rotation={[-Math.PI / 2, 0, 0]} 
      position={position}
    >
      <planeGeometry args={[roomWidth, roomDepth]} />
      <primitive object={material} attach="material" />
    </mesh>
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
}> = ({ baseTexture, tileSize, width, height, position, rotation = [0, 0, 0] }) => {
  
  const material = useMemo(() => {
    if (!baseTexture) {
      return new THREE.MeshBasicMaterial({
        color: '#f5f5f5',
      });
    }

    const clonedTexture = baseTexture.clone();
    clonedTexture.needsUpdate = true;
    clonedTexture.colorSpace = THREE.SRGBColorSpace;
    clonedTexture.wrapS = THREE.RepeatWrapping;
    clonedTexture.wrapT = THREE.RepeatWrapping;
    clonedTexture.minFilter = THREE.LinearMipMapLinearFilter;
    clonedTexture.magFilter = THREE.LinearFilter;
    
    const tileSizeM = {
      width: tileSize.width / 100,
      height: tileSize.height / 100
    };
    
    const repeatX = width / tileSizeM.width;
    const repeatY = height / tileSizeM.height;
    
    clonedTexture.repeat.set(repeatX, repeatY);

    const mat = new THREE.MeshBasicMaterial({
      map: clonedTexture,
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

  return (
    <mesh position={position} rotation={rotation}>
      <planeGeometry args={[width, height]} />
      <primitive object={material} attach="material" />
    </mesh>
  );
};

// ============================================
// CAMERA CONTROLLER - MANUAL ONLY
// ============================================

const CameraController: React.FC<{
  preset: CameraPreset | null;
  onTransitionComplete?: () => void;
}> = ({ preset, onTransitionComplete }) => {
  const { camera } = useThree();
  const controlsRef = useRef<any>();

  useEffect(() => {
    if (!preset || !controlsRef.current) return;

    // ✅ INSTANT JUMP - No animation
    camera.position.set(...preset.position);
    controlsRef.current.target.set(...preset.target);
    camera.fov = preset.fov;
    camera.updateProjectionMatrix();
    
    onTransitionComplete?.();
  }, [preset, camera, onTransitionComplete]);

  return (
    <OrbitControls
      ref={controlsRef}
      enablePan={true}
      enableZoom={true}
      enableRotate={true}
      autoRotate={false}
      maxPolarAngle={Math.PI * 0.95}
      minPolarAngle={Math.PI * 0.05}
      minDistance={0.8}
      maxDistance={10}
      minAzimuthAngle={-Math.PI / 2}
      maxAzimuthAngle={Math.PI / 2}
      target={[0, 1.4, 0]}
      enableDamping={true}
      dampingFactor={0.02}
      maxTargetRadius={4}
    />
  );
};

// ============================================
// CEILING
// ============================================

const Ceiling: React.FC<{
  width: number;
  depth: number;
  height: number;
}> = ({ width, depth, height }) => {
  return (
    <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, height, 0]}>
      <planeGeometry args={[width, depth]} />
      <meshStandardMaterial 
        color="#fefefe" 
        roughness={0.9}
        metalness={0}
      />
    </mesh>
  );
};

// ============================================
// KITCHEN & BATHROOM SCENES
// ============================================

const KitchenScene: React.FC<{ 
  floorTexture: THREE.Texture | null;
  floorTileSize: { width: number; height: number };
  wallTexture: THREE.Texture | null;
  wallTileSize: { width: number; height: number };
  showWallTiles: boolean;
  quality: QualityLevel;
}> = ({ floorTexture, floorTileSize, wallTexture, wallTileSize, showWallTiles, quality }) => {
  const { width: W, depth: D, height: H } = ROOM_CONFIGS.kitchen;

  return (
    <group>
      <TiledFloor
        baseTexture={floorTexture}
        tileSize={floorTileSize}
        roomWidth={W}
        roomDepth={D}
        position={[0, 0, 0]}
        quality={quality}
      />

      <Ceiling width={W} depth={D} height={H} />

      <TiledWall
        baseTexture={showWallTiles ? wallTexture : null}
        tileSize={wallTileSize}
        width={W}
        height={H}
        position={[0, H/2, -D/2]}
        quality={quality}
      />

      <mesh position={[0, H/2, D/2]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[W, H]} />
        <meshStandardMaterial color="#f0f0f0" roughness={0.9} />
      </mesh>

      <mesh position={[-W/2, H/2, 0]} rotation={[0, Math.PI/2, 0]}>
        <planeGeometry args={[D, H]} />
        <meshStandardMaterial color="#f0f0f0" roughness={0.9} />
      </mesh>

      <mesh position={[W/2, H/2, 0]} rotation={[0, -Math.PI/2, 0]}>
        <planeGeometry args={[D, H]} />
        <meshStandardMaterial color="#f0f0f0" roughness={0.9} />
      </mesh>

      <group position={[0, 0, -2.35]}>
        <mesh position={[0, 0.45, 0]} castShadow>
          <boxGeometry args={[3.6, 0.9, 0.65]} />
          <meshStandardMaterial color="#6b4e3d" roughness={0.7} />
        </mesh>
        <mesh position={[0, 0.92, 0]} castShadow>
          <boxGeometry args={[3.7, 0.04, 0.7]} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.2} metalness={0.6} />
        </mesh>
        <mesh position={[0, 1.85, -0.25]} castShadow>
          <boxGeometry args={[3.6, 0.85, 0.4]} />
          <meshStandardMaterial color="#7a5c47" roughness={0.7} />
        </mesh>
      </group>

      <mesh position={[1.75, 1.05, -2.25]} castShadow>
        <boxGeometry args={[0.75, 2.1, 0.75]} />
        <meshStandardMaterial color="#e5e5e5" roughness={0.15} metalness={0.7} />
      </mesh>
    </group>
  );
};

const BathroomScene: React.FC<{ 
  floorTexture: THREE.Texture | null;
  floorTileSize: { width: number; height: number };
  wallTexture: THREE.Texture | null;
  wallTileSize: { width: number; height: number };
  showWallTiles: boolean;
  quality: QualityLevel;
}> = ({ floorTexture, floorTileSize, wallTexture, wallTileSize, showWallTiles, quality }) => {
  const { width: W, depth: D, height: H } = ROOM_CONFIGS.bathroom;

  return (
    <group>
      <TiledFloor
        baseTexture={floorTexture}
        tileSize={floorTileSize}
        roomWidth={W}
        roomDepth={D}
        position={[0, 0, 0]}
        quality={quality}
      />

      <Ceiling width={W} depth={D} height={H} />

      <TiledWall
        baseTexture={showWallTiles ? wallTexture : null}
        tileSize={wallTileSize}
        width={W}
        height={H}
        position={[0, H/2, -D/2]}
        quality={quality}
      />

      <TiledWall
        baseTexture={showWallTiles ? wallTexture : null}
        tileSize={wallTileSize}
        width={W}
        height={H}
        position={[0, H/2, D/2]}
        rotation={[0, Math.PI, 0]}
        quality={quality}
      />

      <TiledWall
        baseTexture={showWallTiles ? wallTexture : null}
        tileSize={wallTileSize}
        width={D}
        height={H}
        position={[-W/2, H/2, 0]}
        rotation={[0, Math.PI/2, 0]}
        quality={quality}
      />

      <TiledWall
        baseTexture={showWallTiles ? wallTexture : null}
        tileSize={wallTileSize}
        width={D}
        height={H}
        position={[W/2, H/2, 0]}
        rotation={[0, -Math.PI/2, 0]}
        quality={quality}
      />

      <group position={[-0.85, 0, -1.3]}>
        <mesh position={[0, 0.32, 0]} castShadow>
          <cylinderGeometry args={[0.27, 0.22, 0.64, 20]} />
          <meshStandardMaterial color="#fafafa" roughness={0.05} metalness={0.1} />
        </mesh>
      </group>
    </group>
  );
};

const SceneLoader: React.FC = () => (
  <mesh>
    <boxGeometry args={[1, 1, 1]} />
    <meshStandardMaterial color="#3b82f6" />
  </mesh>
);

// ============================================
// MAIN COMPONENT
// ============================================

export const Enhanced3DViewer: React.FC<Enhanced3DViewerProps> = ({
  roomType,
  floorTile,
  wallTile,
  activeSurface,
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [selectedPreset, setSelectedPreset] = useState<CameraPreset | null>(null);
  const [quality, setQuality] = useState<QualityLevel>('high');
  const [showSettings, setShowSettings] = useState(false);

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

  const renderScene = () => {
    const showWallTiles = activeSurface === 'wall' || activeSurface === 'both';
    const showFloorTiles = activeSurface === 'floor' || activeSurface === 'both';

    const defaultFloorSize = { width: 60, height: 60 };
    const defaultWallSize = { width: 30, height: 45 };

    switch (roomType) {
      case 'drawing':
        return (
          <LuxuryDrawingRoomScene 
            floorTexture={showFloorTiles ? floorTexture : null}
            floorTileSize={floorTile?.size || defaultFloorSize}
            quality={quality}
          />
        );
      case 'kitchen':
        return (
          <KitchenScene
            floorTexture={showFloorTiles ? floorTexture : null}
            floorTileSize={floorTile?.size || defaultFloorSize}
            wallTexture={showWallTiles ? wallTexture : null}
            wallTileSize={wallTile?.size || defaultWallSize}
            showWallTiles={showWallTiles}
            quality={quality}
          />
        );
      case 'bathroom':
        return (
          <BathroomScene
            floorTexture={showFloorTiles ? floorTexture : null}
            floorTileSize={floorTile?.size || defaultFloorSize}
            wallTexture={showWallTiles ? wallTexture : null}
            wallTileSize={wallTile?.size || defaultWallSize}
            showWallTiles={showWallTiles}
            quality={quality}
          />
        );
    }
  };

  const presets = CAMERA_PRESETS[roomType] || [];
  const hasFloorTile = !!floorTile?.texture;
  const hasWallTile = !!wallTile?.texture;

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

          <CameraController 
            preset={selectedPreset} 
            onTransitionComplete={handleTransitionComplete}
          />
        </Suspense>
      </Canvas>

      {showControls && (
        <div className="absolute top-4 left-4 bg-black/80 text-white px-4 py-3 rounded-xl backdrop-blur-md shadow-2xl border border-white/10 max-w-xs">
          <p className="font-semibold mb-1 flex items-center gap-2 text-sm">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
            {roomType.charAt(0).toUpperCase() + roomType.slice(1)} Room
          </p>
          <p className="text-xs opacity-75">
            Quality: <span className="text-blue-400 font-medium capitalize">{quality}</span>
          </p>
          {floorTile && (
            <p className="text-xs opacity-75 mt-1">
              Floor: {floorTile.size.width}×{floorTile.size.height} cm
            </p>
          )}
          {wallTile && (
            <p className="text-xs opacity-75">
              Wall: {wallTile.size.width}×{wallTile.size.height} cm
            </p>
          )}
        </div>
      )}

      <div className="absolute top-4 right-4 bg-black/80 text-white px-4 py-3 rounded-xl backdrop-blur-md shadow-2xl border border-white/10">
        <p className="text-xs font-medium mb-1">Applied:</p>
        <p className="text-sm font-bold capitalize">{activeSurface}</p>
        {hasFloorTile && <p className="text-xs opacity-75 mt-1 text-green-400">✓ Floor Tile</p>}
        {hasWallTile && <p className="text-xs opacity-75 text-blue-400">✓ Wall Tile</p>}
      </div>

      <div className="absolute top-24 right-4 bg-black/80 text-white p-3 rounded-xl backdrop-blur-md shadow-2xl border border-white/10">
        <p className="text-xs font-semibold mb-2 flex items-center gap-2">
          <Camera className="w-3 h-3" />
          Camera Views
        </p>
        <div className="flex flex-col gap-1.5">
          {presets.map((preset, index) => (
            <button
              key={index}
              onClick={() => setSelectedPreset(preset)}
              className="px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-xs transition-all hover:scale-105"
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>

      {showSettings && (
        <div className="absolute bottom-24 right-4 bg-black/90 text-white p-4 rounded-xl backdrop-blur-md shadow-2xl border border-white/10 min-w-[200px]">
          <p className="text-xs font-semibold mb-3 flex items-center gap-2">
            <Settings className="w-3 h-3" />
            Settings
          </p>
          
          <div className="space-y-3">
            <div>
              <p className="text-xs mb-1.5 opacity-75">Quality</p>
              <div className="flex flex-col gap-1">
                {(['ultra', 'high', 'medium', 'low'] as QualityLevel[]).map((q) => (
                  <button
                    key={q}
                    onClick={() => setQuality(q)}
                    className={`px-2 py-1 rounded text-xs capitalize transition-all ${
                      quality === q 
                        ? 'bg-blue-600' 
                        : 'bg-white/10 hover:bg-white/20'
                    }`}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="absolute bottom-4 right-4 flex gap-2">
        <button
          onClick={() => setShowControls(!showControls)}
          className="bg-black/80 text-white p-3 rounded-xl hover:bg-black/95 transition-all backdrop-blur-md shadow-xl border border-white/10 hover:scale-105"
          title="Info"
        >
          <Info className="w-5 h-5" />
        </button>
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="bg-black/80 text-white p-3 rounded-xl hover:bg-black/95 transition-all backdrop-blur-md shadow-xl border border-white/10 hover:scale-105"
          title="Settings"
        >
          <Settings className="w-5 h-5" />
        </button>
        <button
          onClick={handleReset}
          className="bg-black/80 text-white p-3 rounded-xl hover:bg-black/95 transition-all backdrop-blur-md shadow-xl border border-white/10 hover:scale-105"
          title="Reset"
        >
          <RotateCcw className="w-5 h-5" />
        </button>
        <button
          onClick={toggleFullscreen}
          className="bg-black/80 text-white p-3 rounded-xl hover:bg-black/95 transition-all backdrop-blur-md shadow-xl border border-white/10 hover:scale-105"
          title="Fullscreen"
        >
          {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
        </button>
      </div>

      {(!hasFloorTile && !hasWallTile) && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-md pointer-events-none">
          <div className="bg-white rounded-2xl p-8 text-center shadow-2xl max-w-md">
            <Package className="w-16 h-16 mx-auto mb-4 text-blue-600" />
            <p className="text-gray-800 font-semibold text-lg mb-2">No Tiles Applied</p>
            <p className="text-gray-500 text-sm">Upload floor and/or wall tiles to visualize</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Enhanced3DViewer;