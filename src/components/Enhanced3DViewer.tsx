
import React, { useState, useEffect, Suspense, useMemo, useRef, useCallback } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import * as THREE from 'three';
import { 
  Maximize2, 
  Minimize2, 
  RotateCcw, 
  Info, 
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

import { LuxuryDrawingRoomScene } from './LuxuryDrawingRoomScene';
import { QRScanner } from './QRScanner';
import { getTileById, getTileByCode } from '../lib/firebaseutils';

// ═══════════════════════════════════════════════════════════════
// INTERFACES & TYPES
// ═══════════════════════════════════════════════════════════════

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
  drawing: { width: 5, depth: 6, height: 3 },
  kitchen: { width: 12, depth: 10, height: 3.2 },
  bathroom: { width: 6, depth: 3.5, height: 2.8 }
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

// ═══════════════════════════════════════════════════════════════
// UTILITY FUNCTIONS
// ═══════════════════════════════════════════════════════════════

const generateVerticalStripesPattern = (cols: number, rows: number, randomOffset: number = 0): number[] => {
  const selectedIndices: number[] = [];
  
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const index = (row * cols) + col + 1;
      const pattern = (col + randomOffset) % 3;
      if (pattern === 0 || pattern === 1) {
        selectedIndices.push(index);
      }
    }
  }
  
  return selectedIndices;
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
}> = ({ baseTexture, tileSize, roomWidth, roomDepth, position }) => {
  
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

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={position}>
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

  return (
    <mesh position={position} rotation={rotation}>
      <planeGeometry args={[width, height]} />
      <primitive object={material} attach="material" />
    </mesh>
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

// ═══════════════════════════════════════════════════════════════
// ROOM SCENES (Kitchen & Bathroom) - Continue karta hun...
// ═══════════════════════════════════════════════════════════════

// const BrightHotelKitchenScene: React.FC<{ 
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
//   customTiles
// }) => {
//   const { width: W, depth: D, height: H } = ROOM_CONFIGS.kitchen;

//   const shouldUseGridWall = (wall: WallType) => {
//     return (isGridMode && activeWall === wall) || customTiles[wall].size > 0;
//   };

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

//       {showWallTiles && shouldUseGridWall('back') ? (
//         <GridWall
//           baseTexture={wallTexture}
//           tileSize={wallTileSize}
//           width={W}
//           height={H}
//           position={[0, H/2, -D/2]}
//           isGridMode={isGridMode && activeWall === 'back'}
//           selectedTiles={activeWall === 'back' ? selectedTiles : []}
//           onTileClick={onTileClick}
//           customTilesMap={customTiles.back}
//         />
//       ) : showWallTiles ? (
//         <TiledWall
//           baseTexture={wallTexture}
//           tileSize={wallTileSize}
//           width={W}
//           height={H}
//           position={[0, H/2, -D/2]}
//           quality={quality}
//         />
//       ) : (
//         <mesh position={[0, H/2, -D/2]}>
//           <planeGeometry args={[W, H]} />
//           <meshStandardMaterial color="#f5f5f5" roughness={0.85} />
//         </mesh>
//       )}

//       {showWallTiles && shouldUseGridWall('front') ? (
//         <GridWall
//           baseTexture={wallTexture}
//           tileSize={wallTileSize}
//           width={W}
//           height={H}
//           position={[0, H/2, D/2]}
//           rotation={[0, Math.PI, 0]}
//           isGridMode={isGridMode && activeWall === 'front'}
//           selectedTiles={activeWall === 'front' ? selectedTiles : []}
//           onTileClick={onTileClick}
//           customTilesMap={customTiles.front}
//         />
//       ) : showWallTiles ? (
//         <TiledWall
//           baseTexture={wallTexture}
//           tileSize={wallTileSize}
//           width={W}
//           height={H}
//           position={[0, H/2, D/2]}
//           rotation={[0, Math.PI, 0]}
//           quality={quality}
//         />
//       ) : (
//         <mesh position={[0, H/2, D/2]} rotation={[0, Math.PI, 0]}>
//           <planeGeometry args={[W, H]} />
//           <meshStandardMaterial color="#ffffff" roughness={0.85} />
//         </mesh>
//       )}

//       {showWallTiles && shouldUseGridWall('left') ? (
//         <GridWall
//           baseTexture={wallTexture}
//           tileSize={wallTileSize}
//           width={D}
//           height={H}
//           position={[-W/2, H/2, 0]}
//           rotation={[0, Math.PI/2, 0]}
//           isGridMode={isGridMode && activeWall === 'left'}
//           selectedTiles={activeWall === 'left' ? selectedTiles : []}
//           onTileClick={onTileClick}
//           customTilesMap={customTiles.left}
//         />
//       ) : showWallTiles ? (
//         <TiledWall
//           baseTexture={wallTexture}
//           tileSize={wallTileSize}
//           width={D}
//           height={H}
//           position={[-W/2, H/2, 0]}
//           rotation={[0, Math.PI/2, 0]}
//           quality={quality}
//         />
//       ) : (
//         <mesh position={[-W/2, H/2, 0]} rotation={[0, Math.PI/2, 0]}>
//           <planeGeometry args={[D, H]} />
//           <meshStandardMaterial color="#fef9f3" roughness={0.85} />
//         </mesh>
//       )}

//       {showWallTiles && shouldUseGridWall('right') ? (
//         <GridWall
//           baseTexture={wallTexture}
//           tileSize={wallTileSize}
//           width={D}
//           height={H}
//           position={[W/2, H/2, 0]}
//           rotation={[0, -Math.PI/2, 0]}
//           isGridMode={isGridMode && activeWall === 'right'}
//           selectedTiles={activeWall === 'right' ? selectedTiles : []}
//           onTileClick={onTileClick}
//           customTilesMap={customTiles.right}
//         />
//       ) : showWallTiles ? (
//         <TiledWall
//           baseTexture={wallTexture}
//           tileSize={wallTileSize}
//           width={D}
//           height={H}
//           position={[W/2, H/2, 0]}
//           rotation={[0, -Math.PI/2, 0]}
//           quality={quality}
//         />
//       ) : (
//         <mesh position={[W/2, H/2, 0]} rotation={[0, -Math.PI/2, 0]}>
//           <planeGeometry args={[D, H]} />
//           <meshStandardMaterial color="#faf5ed" roughness={0.85} />
//         </mesh>
//       )}

//       {/* Kitchen Furniture - Keeping original detailed scene */}
//       <group position={[0, 0, -3.2]}>
//         <mesh position={[0, 0.5, 0]} castShadow>
//           <boxGeometry args={[5.2, 1.0, 0.6]} />
//           <meshStandardMaterial color="#ffffff" roughness={0.18} metalness={0.15} />
//         </mesh>
//         <mesh position={[0, 1.02, 0]} castShadow>
//           <boxGeometry args={[5.3, 0.06, 0.65]} />
//           <meshStandardMaterial color="#faf6f0" roughness={0.1} metalness={0.45} />
//         </mesh>
//         <mesh position={[0, 2.1, -0.25]} castShadow>
//           <boxGeometry args={[5.2, 1.0, 0.35]} />
//           <meshStandardMaterial color="#fffbf5" roughness={0.2} metalness={0.1} />
//         </mesh>
//         {[-2.2, -1.5, -0.8, -0.1, 0.6, 1.3, 2.0].map((x, i) => (
//           <mesh key={`handle-lower-${i}`} position={[x, 0.5, 0.32]}>
//             <boxGeometry args={[0.15, 0.025, 0.025]} />
//             <meshStandardMaterial color="#e8e8e8" roughness={0.12} metalness={0.92} />
//           </mesh>
//         ))}
//         {[-2.2, -1.5, -0.8, -0.1, 0.6, 1.3, 2.0].map((x, i) => (
//           <mesh key={`handle-upper-${i}`} position={[x, 2.1, -0.05]}>
//             <boxGeometry args={[0.15, 0.025, 0.025]} />
//             <meshStandardMaterial color="#e8e8e8" roughness={0.12} metalness={0.92} />
//           </mesh>
//         ))}
//         <rectAreaLight position={[0, 1.6, -0.38]} width={5.0} height={0.05} intensity={3.5} color="#fffef8" />
//       </group>

//       <group position={[0, 0, 0.5]}>
//         <mesh position={[0, 0.5, 0]} castShadow>
//           <boxGeometry args={[3.0, 1.0, 1.5]} />
//           <meshStandardMaterial color="#f5ead5" roughness={0.28} metalness={0.08} />
//         </mesh>
//         <mesh position={[0, 1.02, 0]} castShadow>
//           <boxGeometry args={[3.1, 0.06, 1.55]} />
//           <meshStandardMaterial color="#fefefe" roughness={0.12} metalness={0.38} />
//         </mesh>
//         <mesh position={[0, 0.5, 0.8]}>
//           <boxGeometry args={[3.0, 0.025, 0.015]} />
//           <meshStandardMaterial color="#f0e6d2" roughness={0.32} metalness={0.05} />
//         </mesh>
//         {[-1.2, -0.4, 0.4, 1.2].map((x, i) => (
//           <group key={`stool-${i}`} position={[x, 0.4, 1.1]}>
//             <mesh position={[0, 0.35, 0]} castShadow>
//               <cylinderGeometry args={[0.2, 0.2, 0.06, 24]} />
//               <meshStandardMaterial color="#fefefe" roughness={0.32} metalness={0.05} />
//             </mesh>
//             <mesh position={[0, 0, 0]}>
//               <cylinderGeometry args={[0.022, 0.022, 0.7, 16]} />
//               <meshStandardMaterial color="#e0e0e0" roughness={0.08} metalness={0.92} />
//             </mesh>
//             <mesh position={[0, -0.35, 0]}>
//               <cylinderGeometry args={[0.15, 0.15, 0.03, 20]} />
//               <meshStandardMaterial color="#d8d8d8" roughness={0.1} metalness={0.9} />
//             </mesh>
//           </group>
//         ))}
//       </group>

//       <group position={[-2.7, 0, -1.2]}>
//         <mesh position={[0, 0.5, 0]} castShadow>
//           <boxGeometry args={[0.6, 1.0, 2.6]} />
//           <meshStandardMaterial color="#ffffff" roughness={0.18} metalness={0.15} />
//         </mesh>
//         <mesh position={[0, 1.02, 0]} castShadow>
//           <boxGeometry args={[0.65, 0.06, 2.7]} />
//           <meshStandardMaterial color="#faf6f0" roughness={0.1} metalness={0.45} />
//         </mesh>
//       </group>

//       <mesh position={[2.5, 1.3, -3.15]} castShadow>
//         <boxGeometry args={[0.9, 2.6, 0.75]} />
//         <meshStandardMaterial color="#e8e8e8" roughness={0.12} metalness={0.88} />
//       </mesh>

//       <mesh position={[-2.1, 1.4, -3.15]} castShadow>
//         <boxGeometry args={[0.7, 1.4, 0.12]} />
//         <meshStandardMaterial color="#e0e0e0" roughness={0.18} metalness={0.8} />
//       </mesh>

//       {[-1.2, -0.4, 0.4, 1.2].map((x, i) => (
//         <group key={`pendant-${i}`} position={[x, 2.85, 0.5]}>
//           <mesh>
//             <cylinderGeometry args={[0.005, 0.005, 0.7, 10]} />
//             <meshStandardMaterial color="#d8d8d8" roughness={0.1} metalness={0.9} />
//           </mesh>
//           <mesh position={[0, -0.4, 0]}>
//             <sphereGeometry args={[0.18, 20, 20]} />
//             <meshStandardMaterial color="#ffffff" transparent={true} opacity={0.35} roughness={0.02} metalness={0.05} />
//           </mesh>
//           <pointLight position={[0, -0.45, 0]} intensity={2.2} color="#fffef8" distance={3.5} />
//         </group>
//       ))}

//       <pointLight position={[2, 3.1, -2]} intensity={2.0} color="#ffffff" distance={5} />
//       <pointLight position={[-2, 3.1, -2]} intensity={2.0} color="#ffffff" distance={5} />
//       <pointLight position={[2, 3.1, 1.5]} intensity={2.0} color="#ffffff" distance={5} />
//       <pointLight position={[-2, 3.1, 1.5]} intensity={2.0} color="#ffffff" distance={5} />
//       <pointLight position={[0, 3.1, 0]} intensity={2.2} color="#ffffff" distance={5} />
//     </group>
//   );
// };


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
  customTiles
}) => {
  const { width: W, depth: D, height: H } = ROOM_CONFIGS.kitchen;

  // ✅ Kitchen mein SIRF back wall par tiles, baaki walls plain color
  const shouldUseGridWall = (wall: WallType) => {
    // Kitchen ke liye SIRF back wall allow karo
    if (wall !== 'back') return false;
    return (isGridMode && activeWall === wall) || customTiles[wall].size > 0;
  };

  return (
    <group>
      {/* Floor */}
      <TiledFloor 
        baseTexture={floorTexture} 
        tileSize={floorTileSize} 
        roomWidth={W} 
        roomDepth={D} 
        position={[0, 0, 0]} 
        quality={quality} 
      />
      <Ceiling width={W} depth={D} height={H} />

      {/* ✅ BACK WALL - Tiles allowed (fridge ke piche) */}
      {showWallTiles && shouldUseGridWall('back') ? (
        <GridWall
          baseTexture={wallTexture}
          tileSize={wallTileSize}
          width={W}
          height={H}
          position={[0, H/2, -D/2]}
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
          height={H}
          position={[0, H/2, -D/2]}
          quality={quality}
        />
      ) : (
        <mesh position={[0, H/2, -D/2]}>
          <planeGeometry args={[W, H]} />
          <meshStandardMaterial color="#f5f5f5" roughness={0.85} />
        </mesh>
      )}

      {/* ❌ FRONT WALL - No tiles, only color */}
      <mesh position={[0, H/2, D/2]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[W, H]} />
        <meshStandardMaterial color="#ffffff" roughness={0.85} />
      </mesh>

      {/* ❌ LEFT WALL - No tiles, only color */}
      <mesh position={[-W/2, H/2, 0]} rotation={[0, Math.PI/2, 0]}>
        <planeGeometry args={[D, H]} />
        <meshStandardMaterial color="#fef9f3" roughness={0.85} />
      </mesh>

      {/* ❌ RIGHT WALL - No tiles, only color */}
      <mesh position={[W/2, H/2, 0]} rotation={[0, -Math.PI/2, 0]}>
        <planeGeometry args={[D, H]} />
        <meshStandardMaterial color="#faf5ed" roughness={0.85} />
      </mesh>

      {/* Kitchen Furniture - Rest remains same... */}
      <group position={[0, 0, -3.2]}>
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

      <group position={[0, 0, 0.5]}>
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

      <group position={[-2.7, 0, -1.2]}>
        <mesh position={[0, 0.5, 0]} castShadow>
          <boxGeometry args={[0.6, 1.0, 2.6]} />
          <meshStandardMaterial color="#ffffff" roughness={0.18} metalness={0.15} />
        </mesh>
        <mesh position={[0, 1.02, 0]} castShadow>
          <boxGeometry args={[0.65, 0.06, 2.7]} />
          <meshStandardMaterial color="#faf6f0" roughness={0.1} metalness={0.45} />
        </mesh>
      </group>

      <mesh position={[2.5, 1.3, -3.15]} castShadow>
        <boxGeometry args={[0.9, 2.6, 0.75]} />
        <meshStandardMaterial color="#e8e8e8" roughness={0.12} metalness={0.88} />
      </mesh>

      <mesh position={[-2.1, 1.4, -3.15]} castShadow>
        <boxGeometry args={[0.7, 1.4, 0.12]} />
        <meshStandardMaterial color="#e0e0e0" roughness={0.18} metalness={0.8} />
      </mesh>

      {[-1.2, -0.4, 0.4, 1.2].map((x, i) => (
        <group key={`pendant-${i}`} position={[x, 2.85, 0.5]}>
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

      <pointLight position={[2, 3.1, -2]} intensity={2.0} color="#ffffff" distance={5} />
      <pointLight position={[-2, 3.1, -2]} intensity={2.0} color="#ffffff" distance={5} />
      <pointLight position={[2, 3.1, 1.5]} intensity={2.0} color="#ffffff" distance={5} />
      <pointLight position={[-2, 3.1, 1.5]} intensity={2.0} color="#ffffff" distance={5} />
      <pointLight position={[0, 3.1, 0]} intensity={2.2} color="#ffffff" distance={5} />
    </group>
  );
};

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
  customTiles
}) => {
  const { width: W, depth: D, height: H } = ROOM_CONFIGS.bathroom;

  const shouldUseGridWall = (wall: WallType) => {
    return (isGridMode && activeWall === wall) || customTiles[wall].size > 0;
  };

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

      {showWallTiles && shouldUseGridWall('back') ? (
        <GridWall
          baseTexture={wallTexture}
          tileSize={wallTileSize}
          width={W}
          height={H}
          position={[0, H/2, -D/2]}
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
          height={H}
          position={[0, H/2, -D/2]}
          quality={quality}
        />
      ) : (
        <mesh position={[0, H/2, -D/2]}>
          <planeGeometry args={[W, H]} />
          <meshStandardMaterial color="#f5f5f5" roughness={0.85} />
        </mesh>
      )}

      {showWallTiles && shouldUseGridWall('front') ? (
        <GridWall
          baseTexture={wallTexture}
          tileSize={wallTileSize}
          width={W}
          height={H}
          position={[0, H/2, D/2]}
          rotation={[0, Math.PI, 0]}
          isGridMode={isGridMode && activeWall === 'front'}
          selectedTiles={activeWall === 'front' ? selectedTiles : []}
          onTileClick={onTileClick}
          customTilesMap={customTiles.front}
        />
      ) : showWallTiles ? (
        <TiledWall
          baseTexture={wallTexture}
          tileSize={wallTileSize}
          width={W}
          height={H}
          position={[0, H/2, D/2]}
          rotation={[0, Math.PI, 0]}
          quality={quality}
        />
      ) : (
        <mesh position={[0, H/2, D/2]} rotation={[0, Math.PI, 0]}>
          <planeGeometry args={[W, H]} />
          <meshStandardMaterial color="#ffffff" roughness={0.85} />
        </mesh>
      )}

      {showWallTiles && shouldUseGridWall('left') ? (
        <GridWall
          baseTexture={wallTexture}
          tileSize={wallTileSize}
          width={D}
          height={H}
          position={[-W/2, H/2, 0]}
          rotation={[0, Math.PI/2, 0]}
          isGridMode={isGridMode && activeWall === 'left'}
          selectedTiles={activeWall === 'left' ? selectedTiles : []}
          onTileClick={onTileClick}
          customTilesMap={customTiles.left}
        />
      ) : showWallTiles ? (
        <TiledWall
          baseTexture={wallTexture}
          tileSize={wallTileSize}
          width={D}
          height={H}
          position={[-W/2, H/2, 0]}
          rotation={[0, Math.PI/2, 0]}
          quality={quality}
        />
      ) : (
        <mesh position={[-W/2, H/2, 0]} rotation={[0, Math.PI/2, 0]}>
          <planeGeometry args={[D, H]} />
          <meshStandardMaterial color="#fef9f3" roughness={0.85} />
        </mesh>
      )}

      {showWallTiles && shouldUseGridWall('right') ? (
        <GridWall
          baseTexture={wallTexture}
          tileSize={wallTileSize}
          width={D}
          height={H}
          position={[W/2, H/2, 0]}
          rotation={[0, -Math.PI/2, 0]}
          isGridMode={isGridMode && activeWall === 'right'}
          selectedTiles={activeWall === 'right' ? selectedTiles : []}
          onTileClick={onTileClick}
          customTilesMap={customTiles.right}
        />
      ) : showWallTiles ? (
        <TiledWall
          baseTexture={wallTexture}
          tileSize={wallTileSize}
          width={D}
          height={H}
          position={[W/2, H/2, 0]}
          rotation={[0, -Math.PI/2, 0]}
          quality={quality}
        />
      ) : (
        <mesh position={[W/2, H/2, 0]} rotation={[0, -Math.PI/2, 0]}>
          <planeGeometry args={[D, H]} />
          <meshStandardMaterial color="#faf5ed" roughness={0.85} />
        </mesh>
      )}

      {/* Bathroom Fixtures */}
      <group position={[-1.2, 0, -1.5]}>
        <mesh position={[0, 0.45, 0]} castShadow>
          <boxGeometry args={[1.4, 0.9, 0.5]} />
          <meshStandardMaterial color="#ffffff" roughness={0.25} metalness={0.1} />
        </mesh>
        <mesh position={[0, 0.92, 0]} castShadow>
          <boxGeometry args={[1.5, 0.05, 0.55]} />
          <meshStandardMaterial color="#f5f5f0" roughness={0.15} metalness={0.4} />
        </mesh>
        <mesh position={[0, 0.88, -0.05]} castShadow>
          <cylinderGeometry args={[0.22, 0.2, 0.12, 24]} />
          <meshStandardMaterial color="#ffffff" roughness={0.08} metalness={0.2} />
        </mesh>
        <group position={[0, 0.95, -0.2]}>
          <mesh position={[0, 0.15, 0]}>
            <cylinderGeometry args={[0.015, 0.015, 0.3, 12]} />
            <meshStandardMaterial color="#e8e8e8" roughness={0.08} metalness={0.95} />
          </mesh>
          <mesh position={[0, 0.3, 0.06]} rotation={[Math.PI / 3, 0, 0]}>
            <cylinderGeometry args={[0.012, 0.012, 0.12, 12]} />
            <meshStandardMaterial color="#e8e8e8" roughness={0.08} metalness={0.95} />
          </mesh>
          <mesh position={[0, 0.36, 0.12]}>
            <sphereGeometry args={[0.02, 12, 12]} />
            <meshStandardMaterial color="#e8e8e8" roughness={0.08} metalness={0.95} />
          </mesh>
        </group>
      </group>

      <group position={[-1.2, 1.6, -1.72]}>
        <mesh>
          <boxGeometry args={[1.3, 0.9, 0.02]} />
          <meshStandardMaterial color="#d0d0d0" roughness={0.25} metalness={0.85} />
        </mesh>
        <mesh position={[0, 0, 0.015]}>
          <boxGeometry args={[1.2, 0.8, 0.01]} />
          <meshStandardMaterial color="#ffffff" roughness={0.05} metalness={0.98} />
        </mesh>
        <rectAreaLight position={[0, 0, -0.02]} width={1.3} height={0.9} intensity={1.2} color="#fff8e1" />
      </group>

      <group position={[0.9, 0, 1.2]}>
        <mesh position={[0, 0.2, 0]} castShadow>
          <cylinderGeometry args={[0.24, 0.26, 0.4, 28]} />
          <meshStandardMaterial color="#ffffff" roughness={0.05} metalness={0.1} />
        </mesh>
        <mesh position={[0, 0.38, 0]} castShadow>
          <cylinderGeometry args={[0.18, 0.2, 0.08, 24]} />
          <meshStandardMaterial color="#f8f8f8" roughness={0.08} metalness={0.05} />
        </mesh>
      </group>

      <group position={[1.2, 0, -1.0]}>
        <mesh position={[0, 1.2, 0.4]}>
          <boxGeometry args={[0.02, 2.4, 1.0]} />
          <meshStandardMaterial color="#ffffff" transparent={true} opacity={0.25} roughness={0.05} />
        </mesh>
        <mesh position={[0, 0.02, 0]}>
          <boxGeometry args={[0.9, 0.04, 1.0]} />
          <meshStandardMaterial color="#fafafa" roughness={0.2} metalness={0.1} />
        </mesh>
      </group>

      <pointLight position={[0, 2.6, 0]} intensity={1.8} color="#fff8e1" distance={6} />
      <pointLight position={[1.5, 2.6, 0]} intensity={1.2} color="#ffffff" distance={4} />
      <pointLight position={[-1.5, 2.6, 0]} intensity={1.2} color="#ffffff" distance={4} />
    </group>
  );
};

// ═══════════════════════════════════════════════════════════════
// MODAL COMPONENTS
// ═══════════════════════════════════════════════════════════════

// const WallSelectorModal: React.FC<{
//   isOpen: boolean;
//   onClose: () => void;
//   onSelectWall: (wall: WallType) => void;
//   roomType: string;
// }> = ({ isOpen, onClose, onSelectWall, roomType }) => {
//   if (!isOpen) return null;

//   const roomConfig = ROOM_CONFIGS[roomType as keyof typeof ROOM_CONFIGS];
  
//   const getWallInfo = (wall: WallType) => {
//     const wallTileSize = { width: 30, height: 45 };
//     const tileSizeM = { width: wallTileSize.width / 100, height: wallTileSize.height / 100 };
    
//     if (wall === 'back' || wall === 'front') {
//       const cols = Math.ceil(roomConfig.width / tileSizeM.width);
//       const rows = Math.ceil(roomConfig.height / tileSizeM.height);
//       return { cols, rows, total: cols * rows };
//     } else {
//       const cols = Math.ceil(roomConfig.depth / tileSizeM.width);
//       const rows = Math.ceil(roomConfig.height / tileSizeM.height);
//       return { cols, rows, total: cols * rows };
//     }
//   };

//   const walls: { type: WallType; label: string; icon: string }[] = [
//     { type: 'back', label: 'Back Wall', icon: '🔲' },
//     { type: 'front', label: 'Front Wall', icon: '🔳' },
//     { type: 'left', label: 'Left Wall', icon: '◀️' },
//     { type: 'right', label: 'Right Wall', icon: '▶️' },
//   ];

//   return (
//     <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
//       <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 animate-slideUp">
//         <div className="flex items-center justify-between mb-6">
//           <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
//             <Layers className="w-6 h-6 text-blue-600" />
//             Select Wall to Edit
//           </h3>
//           <button
//             onClick={onClose}
//             className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
//           >
//             <X className="w-5 h-5 text-gray-600" />
//           </button>
//         </div>

//         <p className="text-sm text-gray-600 mb-4">
//           Choose which wall you want to customize with individual tile selection
//         </p>

//         <div className="space-y-3">
//           {walls.map((wall) => {
//             const info = getWallInfo(wall.type);
//             return (
//               <button
//                 key={wall.type}
//                 onClick={() => onSelectWall(wall.type)}
//                 className="w-full p-4 bg-gradient-to-r from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100 rounded-xl transition-all border-2 border-transparent hover:border-blue-400 text-left group"
//               >
//                 <div className="flex items-center justify-between">
//                   <div className="flex items-center gap-3">
//                     <span className="text-2xl">{wall.icon}</span>
//                     <div>
//                       <h4 className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
//                         {wall.label}
//                       </h4>
//                       <p className="text-xs text-gray-500">
//                         {info.cols}W × {info.rows}H = {info.total} tiles
//                       </p>
//                     </div>
//                   </div>
//                   <div className="text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
//                     →
//                   </div>
//                 </div>
//               </button>
//             );
//           })}
//         </div>

//         <button
//           onClick={onClose}
//           className="w-full mt-4 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold transition-all"
//         >
//           Cancel
//         </button>
//       </div>
//     </div>
//   );
// };
const WallSelectorModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSelectWall: (wall: WallType) => void;
  roomType: string;
}> = ({ isOpen, onClose, onSelectWall, roomType }) => {
  if (!isOpen) return null;

  const roomConfig = ROOM_CONFIGS[roomType as keyof typeof ROOM_CONFIGS];
  
  const getWallInfo = (wall: WallType) => {
    const wallTileSize = { width: 30, height: 45 };
    const tileSizeM = { width: wallTileSize.width / 100, height: wallTileSize.height / 100 };
    
    if (wall === 'back' || wall === 'front') {
      const cols = Math.ceil(roomConfig.width / tileSizeM.width);
      const rows = Math.ceil(roomConfig.height / tileSizeM.height);
      return { cols, rows, total: cols * rows };
    } else {
      const cols = Math.ceil(roomConfig.depth / tileSizeM.width);
      const rows = Math.ceil(roomConfig.height / tileSizeM.height);
      return { cols, rows, total: cols * rows };
    }
  };

  // ✅ Kitchen ke liye SIRF back wall, bathroom ke liye all 4 walls
  const walls: { type: WallType; label: string; icon: string }[] = roomType === 'kitchen' 
    ? [
        { type: 'back', label: 'Back Wall (Fridge Area)', icon: '🔲' }
      ]
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
            {roomType === 'kitchen' ? 'Select Wall to Edit' : 'Select Wall to Edit'}
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
            : 'Choose which wall you want to customize with individual tile selection'
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
                        {info.cols}W × {info.rows}H = {info.total} tiles
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


// const RandomPatternModal: React.FC<{
//   isOpen: boolean;
//   onClose: () => void;
//   onApplyPattern: (result: QRScanResult) => void;
//   roomType: string;
// }> = ({ isOpen, onClose, onApplyPattern, roomType }) => {
//   const [scanError, setScanError] = useState<string>('');
//   const [isProcessing, setIsProcessing] = useState(false);
//   const [patternOffset, setPatternOffset] = useState(0);
//   const fileInputRef = useRef<HTMLInputElement>(null);

//   const roomConfig = ROOM_CONFIGS[roomType as keyof typeof ROOM_CONFIGS];
//   const wallTileSize = { width: 30, height: 45 };
//   const tileSizeM = { width: wallTileSize.width / 100, height: wallTileSize.height / 100 };

//   const getWallDimensions = (wall: WallType) => {
//     if (wall === 'back' || wall === 'front') {
//       return {
//         cols: Math.ceil(roomConfig.width / tileSizeM.width),
//         rows: Math.ceil(roomConfig.height / tileSizeM.height)
//       };
//     } else {
//       return {
//         cols: Math.ceil(roomConfig.depth / tileSizeM.width),
//         rows: Math.ceil(roomConfig.height / tileSizeM.height)
//       };
//     }
//   };

//   const backWallDims = getWallDimensions('back');
//   const frontWallDims = getWallDimensions('front');
//   const leftWallDims = getWallDimensions('left');
//   const rightWallDims = getWallDimensions('right');

//   const patternTilesCount = 
//     generateVerticalStripesPattern(backWallDims.cols, backWallDims.rows, patternOffset).length +
//     generateVerticalStripesPattern(frontWallDims.cols, frontWallDims.rows, patternOffset).length +
//     generateVerticalStripesPattern(leftWallDims.cols, leftWallDims.rows, patternOffset).length +
//     generateVerticalStripesPattern(rightWallDims.cols, rightWallDims.rows, patternOffset).length;

//   const handleShuffle = () => {
//     setPatternOffset(Math.floor(Math.random() * 3));
//   };

//   const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
//     const file = event.target.files?.[0];
//     if (!file) return;

//     setIsProcessing(true);
//     setScanError('');

//     try {
//       await new Promise(resolve => setTimeout(resolve, 800));

//       const imageUrl = URL.createObjectURL(file);

//       const mockQRData: QRScanResult = {
//         tileId: 'PATTERN_' + Math.random().toString(36).substr(2, 9).toUpperCase(),
//         tileName: file.name.split('.')[0],
//         imageUrl: imageUrl,
//         size: { width: 30, height: 45 }
//       };

//       onApplyPattern(mockQRData);
//       onClose();
//     } catch (error) {
//       setScanError('Failed to process image. Please try again.');
//     } finally {
//       setIsProcessing(false);
//     }
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
//       <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-slideUp">
//         <div className="flex items-center justify-between mb-6">
//           <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
//             <Shuffle className="w-6 h-6 text-purple-600" />
//             Random Pattern
//           </h3>
//           <button
//             onClick={onClose}
//             className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
//           >
//             <X className="w-5 h-5 text-gray-600" />
//           </button>
//         </div>

//         <div className="space-y-4">
//           <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-4 border-2 border-purple-200">
//             <p className="text-sm font-semibold text-gray-700 mb-2">Vertical Stripes Pattern</p>
//             <div className="bg-white rounded-lg p-3 mb-3">
//               <div className="grid grid-cols-10 gap-0.5 max-w-[200px] mx-auto">
//                 {Array.from({ length: 30 }).map((_, i) => {
//                   const row = Math.floor(i / 10);
//                   const col = i % 10;
//                   const pattern = (col + patternOffset) % 3;
//                   const isSelected = pattern === 0 || pattern === 1;
//                   return (
//                     <div
//                       key={i}
//                       className={`aspect-square rounded-sm ${
//                         isSelected ? 'bg-purple-500' : 'bg-gray-200'
//                       }`}
//                     />
//                   );
//                 })}
//               </div>
//             </div>
//             <div className="flex items-center justify-between text-xs text-gray-600">
//               <span>Coverage: ~65%</span>
//               <span>{patternTilesCount} tiles</span>
//             </div>
//           </div>

//           <button
//             onClick={handleShuffle}
//             className="w-full bg-gradient-to-r from-purple-100 to-blue-100 hover:from-purple-200 hover:to-blue-200 text-purple-700 px-4 py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
//           >
//             <Shuffle className="w-5 h-5" />
//             Shuffle Pattern
//           </button>

//           <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center">
//             <div className="w-20 h-20 mx-auto mb-3 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl flex items-center justify-center">
//               <Upload className="w-10 h-10 text-white" />
//             </div>
//             <p className="text-sm text-gray-600 mb-3">
//               Upload tile image to apply pattern
//             </p>

//             <input
//               ref={fileInputRef}
//               type="file"
//               accept="image/*"
//               onChange={handleFileUpload}
//               className="hidden"
//             />

//             <button
//               onClick={() => fileInputRef.current?.click()}
//               disabled={isProcessing}
//               className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
//             >
//               {isProcessing ? (
//                 <>
//                   <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//                   Processing...
//                 </>
//               ) : (
//                 <>
//                   <Upload className="w-5 h-5" />
//                   Choose Tile Image
//                 </>
//               )}
//             </button>
//           </div>

//           {scanError && (
//             <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
//               {scanError}
//             </div>
//           )}

//           <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
//             <p className="text-xs text-blue-800">
//               <strong>Note:</strong> Pattern will be applied to all 4 walls automatically with vertical stripes design.
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// ═══════════════════════════════════════════════════════════════
// 🆕 NEW: TILE UPLOAD OPTIONS MODAL (3 Options)
// ═══════════════════════════════════════════════════════════════

// const RandomPatternModal: React.FC<{
//   isOpen: boolean;
//   onClose: () => void;
//   onApplyPattern: (result: QRScanResult) => void;
//   roomType: string;
// }> = ({ isOpen, onClose, onApplyPattern, roomType }) => {
  
//   // 🆕 State for upload mode
//   const [uploadMode, setUploadMode] = useState<UploadMode>('select');
//   const [manualCode, setManualCode] = useState('');
//   const [isProcessing, setIsProcessing] = useState(false);
//   const [scanError, setScanError] = useState<string>('');
//   const [patternOffset, setPatternOffset] = useState(0);
//   const fileInputRef = useRef<HTMLInputElement>(null);

//   const roomConfig = ROOM_CONFIGS[roomType as keyof typeof ROOM_CONFIGS];
//   const wallTileSize = { width: 30, height: 45 };
//   const tileSizeM = { width: wallTileSize.width / 100, height: wallTileSize.height / 100 };

//   // Pattern calculation (same as before)
//   const getWallDimensions = (wall: WallType) => {
//     if (wall === 'back' || wall === 'front') {
//       return {
//         cols: Math.ceil(roomConfig.width / tileSizeM.width),
//         rows: Math.ceil(roomConfig.height / tileSizeM.height)
//       };
//     } else {
//       return {
//         cols: Math.ceil(roomConfig.depth / tileSizeM.width),
//         rows: Math.ceil(roomConfig.height / tileSizeM.height)
//       };
//     }
//   };

//   const backWallDims = getWallDimensions('back');
//   const frontWallDims = getWallDimensions('front');
//   const leftWallDims = getWallDimensions('left');
//   const rightWallDims = getWallDimensions('right');

const RandomPatternModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onApplyPattern: (result: QRScanResult) => void;
  roomType: string;
}> = ({ isOpen, onClose, onApplyPattern, roomType }) => {
  
  const [uploadMode, setUploadMode] = useState<UploadMode>('select');
  const [manualCode, setManualCode] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [scanError, setScanError] = useState<string>('');
  const [patternOffset, setPatternOffset] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const roomConfig = ROOM_CONFIGS[roomType as keyof typeof ROOM_CONFIGS];
  const wallTileSize = { width: 30, height: 45 };
  const tileSizeM = { width: wallTileSize.width / 100, height: wallTileSize.height / 100 };

  const getWallDimensions = (wall: WallType) => {
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

  // ✅ Kitchen ke liye SIRF back wall pattern
  const backWallDims = getWallDimensions('back');
  
  const patternTilesCount = roomType === 'kitchen'
    ? generateVerticalStripesPattern(backWallDims.cols, backWallDims.rows, patternOffset).length
    : generateVerticalStripesPattern(backWallDims.cols, backWallDims.rows, patternOffset).length +
      generateVerticalStripesPattern(getWallDimensions('front').cols, getWallDimensions('front').rows, patternOffset).length +
      generateVerticalStripesPattern(getWallDimensions('left').cols, getWallDimensions('left').rows, patternOffset).length +
      generateVerticalStripesPattern(getWallDimensions('right').cols, getWallDimensions('right').rows, patternOffset).length;

  const handleShuffle = () => {
    setPatternOffset(Math.floor(Math.random() * 3));
  };

  // 🆕 File Upload Handler
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

      onApplyPattern(mockQRData);
      setUploadMode('select');
      onClose();
      
      console.log('✅ Pattern applied from uploaded image:', file.name);
    } catch (error) {
      setScanError('Failed to process image. Please try again.');
      console.error('Upload error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  // 🆕 Manual Tile Code Handler
  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!manualCode.trim()) {
      setScanError('Please enter a tile code');
      return;
    }

    setIsProcessing(true);
    setScanError('');

    try {
      console.log('🔍 Searching tile for pattern:', manualCode.trim());
      
      const result = await getTileByCode(manualCode.trim().toUpperCase());
      
      if (result.success && result.tile) {
        const tileData = result.tile;
        const imageUrl = tileData.imageUrl || tileData.image_url;
        
        if (!imageUrl) {
          setScanError('Tile found but no image available');
          setIsProcessing(false);
          return;
        }

        const qrData: QRScanResult = {
          tileId: tileData.id,
          tileName: tileData.name,
          imageUrl: imageUrl,
          size: { 
            width: tileData.size_width || 30, 
            height: tileData.size_height || 45 
          }
        };

        onApplyPattern(qrData);
        setUploadMode('select');
        setManualCode('');
        onClose();
        
        console.log('✅ Pattern applied from tile code:', tileData.name);
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

  // 🆕 QR Scan Success Handler
  const handleQRScanSuccess = async (qrData: any) => {
    console.log('🎯 QR Scanned for pattern:', qrData);
    
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

        onApplyPattern(qrResult);
        setUploadMode('select');
        onClose();
        
        console.log('✅ Pattern applied from QR scan:', tileData.name);
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

  // ═══════════════════════════════════════════════════════════
  // QR SCANNER MODE
  // ═══════════════════════════════════════════════════════════
  if (uploadMode === 'qr') {
    return (
      <QRScanner
        onScanSuccess={handleQRScanSuccess}
        onClose={() => {
          setUploadMode('select');
          setScanError('');
        }}
      />
    );
  }

  // ═══════════════════════════════════════════════════════════
  // MANUAL TILE CODE MODE
  // ═══════════════════════════════════════════════════════════
  if (uploadMode === 'manual') {
    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
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

          {/* Pattern Preview */}
          <div className="mb-4 bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-4 border-2 border-purple-200">
            <p className="text-sm font-semibold text-gray-700 mb-2">Vertical Stripes Pattern</p>
            <div className="bg-white rounded-lg p-3 mb-3">
              <div className="grid grid-cols-10 gap-0.5 max-w-[200px] mx-auto">
                {Array.from({ length: 30 }).map((_, i) => {
                  const row = Math.floor(i / 10);
                  const col = i % 10;
                  const pattern = (col + patternOffset) % 3;
                  const isSelected = pattern === 0 || pattern === 1;
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
            <div className="flex items-center justify-between text-xs text-gray-600">
              <span>Coverage: ~65%</span>
              <span>{patternTilesCount} tiles</span>
            </div>
          </div>

          <form onSubmit={handleManualSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enter Tile Code for Pattern
              </label>
              <input
                type="text"
                value={manualCode}
                onChange={(e) => setManualCode(e.target.value.toUpperCase())}
                placeholder="e.g., MAR60X60WH"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 font-mono text-lg transition-all"
                autoFocus
                disabled={isProcessing}
                autoComplete="off"
                autoCapitalize="characters"
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

          <button
            onClick={handleShuffle}
            className="w-full mt-3 bg-gradient-to-r from-purple-100 to-blue-100 hover:from-purple-200 hover:to-blue-200 text-purple-700 px-4 py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
          >
            <Shuffle className="w-5 h-5" />
            Shuffle Pattern Preview
          </button>
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════
  // UPLOAD IMAGE MODE
  // ═══════════════════════════════════════════════════════════
  if (uploadMode === 'upload') {
    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
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

          {/* Pattern Preview */}
          <div className="mb-4 bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-4 border-2 border-purple-200">
            <p className="text-sm font-semibold text-gray-700 mb-2">Vertical Stripes Pattern</p>
            <div className="bg-white rounded-lg p-3 mb-3">
              <div className="grid grid-cols-10 gap-0.5 max-w-[200px] mx-auto">
                {Array.from({ length: 30 }).map((_, i) => {
                  const row = Math.floor(i / 10);
                  const col = i % 10;
                  const pattern = (col + patternOffset) % 3;
                  const isSelected = pattern === 0 || pattern === 1;
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
            <div className="flex items-center justify-between text-xs text-gray-600">
              <span>Coverage: ~65%</span>
              <span>{patternTilesCount} tiles</span>
            </div>
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

          <button
            onClick={handleShuffle}
            disabled={isProcessing}
            className="w-full mt-3 bg-gradient-to-r from-purple-100 to-blue-100 hover:from-purple-200 hover:to-blue-200 text-purple-700 px-4 py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
          >
            <Shuffle className="w-5 h-5" />
            Shuffle Pattern Preview
          </button>
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════
  // DEFAULT: OPTION SELECTOR (3 Options)
  // ═══════════════════════════════════════════════════════════
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 animate-slideUp">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <Shuffle className="w-6 h-6 text-purple-600" />
            Random Pattern Options
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <p className="text-sm text-gray-600 mb-4">
          Choose how you want to add tiles for the vertical stripes pattern ({patternTilesCount} tiles)
        </p>

        {/* Pattern Preview */}
        <div className="mb-4 bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-4 border-2 border-purple-200">
          <p className="text-sm font-semibold text-gray-700 mb-2">Pattern Preview</p>
          <div className="bg-white rounded-lg p-3 mb-2">
            <div className="grid grid-cols-10 gap-0.5 max-w-[200px] mx-auto">
              {Array.from({ length: 30 }).map((_, i) => {
                const row = Math.floor(i / 10);
                const col = i % 10;
                const pattern = (col + patternOffset) % 3;
                const isSelected = pattern === 0 || pattern === 1;
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
          <button
            onClick={handleShuffle}
            className="w-full bg-white/50 hover:bg-white/80 text-purple-700 px-3 py-2 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1"
          >
            <Shuffle className="w-3 h-3" />
            Shuffle Preview
          </button>
        </div>

        {/* 3 Options */}
        <div className="space-y-3">
          {/* Option 1: Upload Image */}
          <button
            onClick={() => {
              setUploadMode('upload');
              setScanError('');
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
                <p className="text-xs text-gray-500">Choose tile image from device</p>
              </div>
              <div className="text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity text-xl">
                →
              </div>
            </div>
          </button>

          {/* Option 2: Scan QR Code */}
          <button
            onClick={() => {
              setUploadMode('qr');
              setScanError('');
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
              setUploadMode('manual');
              setScanError('');
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

        <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-blue-800">
          <p><strong>ℹ️ Note:</strong> Pattern will be applied to all 4 walls automatically with ~65% coverage.</p>
        </div>
      </div>
    </div>
  );
};


const TileUploadOptionsModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onTileSelected: (tileData: TileUploadData) => void;
}> = ({ isOpen, onClose, onTileSelected }) => {
  
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

  // ═══════════════════════════════════════════════════════════
  // MODE 1: QR SCANNER
  // ═══════════════════════════════════════════════════════════
  if (mode === 'qr') {
    return (
      <QRScanner
        onScanSuccess={async (qrData) => {
          console.log('🎯 QR Scanned in 3D Viewer:', qrData);
          
          try {
            setIsLoading(true);
            setError(null);
            
            let tileData: any = null;
            
            // QR se tile ID mila
            if (qrData.tileId) {
              const tileId = qrData.tileId.trim();
              console.log('📦 Fetching tile by ID:', tileId);
              
              tileData = await getTileById(tileId);
              
              // Fallback: tile code search
              if (!tileData) {
                console.warn('⚠️ getTileById failed, trying getTileByCode...');
                const result = await getTileByCode(tileId);
                if (result.success && result.tile) {
                  tileData = result.tile;
                  console.log('✅ Found via tile_code fallback');
                }
              }
            }
            // Manual entry se tile code mila
            else if (qrData.type === 'manual_entry' && qrData.tileCode) {
              console.log('📝 Manual tile code:', qrData.tileCode);
              const result = await getTileByCode(qrData.tileCode.trim().toUpperCase());
              if (result.success && result.tile) {
                tileData = result.tile;
              }
            }
            
            if (tileData && (tileData.imageUrl || tileData.image_url)) {
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
              
              console.log('✅ Tile applied from QR scan:', tileData.name);
            } else {
              console.error('❌ Tile not found or no image');
              setError('Tile image not found. Please try another QR code.');
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
  // MODE 2: MANUAL TILE CODE ENTRY
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
        
        console.log('🔍 Searching tile by code:', manualCode.trim());
        
        const result = await getTileByCode(manualCode.trim().toUpperCase());
        
        if (result.success && result.tile) {
          const tileData = result.tile;
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
            
            console.log('✅ Tile applied from manual code:', tileData.name);
          } else {
            setError('Tile found but no image available');
          }
        } else {
          setError(result.error || 'Tile not found. Please check the code and try again.');
        }
        
      } catch (err) {
        console.error('❌ Manual search error:', err);
        setError('Failed to search tile. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

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
              <p className="text-red-700 text-sm">{error}</p>
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

  // ═══════════════════════════════════════════════════════════
  // MODE 3: IMAGE UPLOAD
  // ═══════════════════════════════════════════════════════════
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

// ═══════════════════════════════════════════════════════════════
// CAMERA CONTROLLER
// ═══════════════════════════════════════════════════════════════

const CameraController: React.FC<{
  preset: CameraPreset | null;
  onTransitionComplete?: () => void;
  roomType: 'drawing' | 'kitchen' | 'bathroom';
}> = ({ preset, onTransitionComplete, roomType }) => {
  const { camera } = useThree();
  const controlsRef = useRef<any>();

  const roomConfig = ROOM_CONFIGS[roomType];
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
  }, [roomType]);

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

// ═══════════════════════════════════════════════════════════════
// 🎯 MAIN COMPONENT - Enhanced3DViewer
// ═══════════════════════════════════════════════════════════════

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
  
  // 🆕 NEW: Replace showQRScanner with showTileUploadOptions
  const [showTileUploadOptions, setShowTileUploadOptions] = useState(false);
  
  const [showRandomPattern, setShowRandomPattern] = useState(false);
  const [patternOffset, setPatternOffset] = useState(0);
  const [currentPatternTexture, setCurrentPatternTexture] = useState<THREE.Texture | null>(null);
  const [isShuffling, setIsShuffling] = useState(false);

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

  useEffect(() => {
    return () => {
      if (currentPatternTexture) {
        currentPatternTexture.dispose();
      }
      Object.values(customTiles).forEach(wallMap => {
        wallMap.forEach(texture => {
          texture.dispose();
        });
      });
    };
  }, [currentPatternTexture, customTiles]);

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

  // 🆕 MODIFIED: Open tile upload options modal instead of QR scanner
  const handleOkClick = () => {
    if (selectedTiles.length > 0) {
      setShowTileUploadOptions(true);
    }
  };

  // 🆕 NEW: Handle tile selection from any of the 3 options
  const handleTileSelected = (tileData: TileUploadData) => {
    if (!activeWall) return;

    console.log('🎨 Applying tile to wall:', activeWall, 'Tiles:', selectedTiles.length);

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

      setCustomTiles(prev => {
        const newCustomTiles = { ...prev };
        const wallMap = new Map(prev[activeWall]);
        
        selectedTiles.forEach(index => {
          wallMap.set(index, texture);
        });
        
        newCustomTiles[activeWall] = wallMap;
        return newCustomTiles;
      });

      setSelectedTiles([]);
      setIsGridMode(false);
      setActiveWall(null);
      
      console.log('✅ Tile applied successfully:', tileData.tileName);
    }, undefined, (error) => {
      console.error('❌ Failed to load tile texture:', error);
    });
  };

  const handleCancelGridMode = () => {
    setIsGridMode(false);
    setActiveWall(null);
    setSelectedTiles([]);
  };

  const handleRandomPattern = () => {
    setShowRandomPattern(true);
  };

  const handleApplyRandomPattern = (result: QRScanResult) => {
    const loader = new THREE.TextureLoader();
    loader.load(result.imageUrl, (texture) => {
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      texture.minFilter = THREE.LinearMipMapLinearFilter;
      texture.magFilter = THREE.LinearFilter;
      texture.anisotropy = 16;
      texture.generateMipmaps = true;
      texture.premultiplyAlpha = false;
      texture.needsUpdate = true;

      setCurrentPatternTexture(texture);

      const roomConfig = ROOM_CONFIGS[roomType];
      const wallTileSize = { width: 30, height: 45 };
      const tileSizeM = { width: wallTileSize.width / 100, height: wallTileSize.height / 100 };

      const getWallDimensions = (wall: WallType) => {
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
          const dims = getWallDimensions(wall);
          const patternIndices = generateVerticalStripesPattern(dims.cols, dims.rows, patternOffset);
          
          const wallMap = new Map<number, THREE.Texture>();
          patternIndices.forEach(index => {
            wallMap.set(index, texture);
          });
          
          newCustomTiles[wall] = wallMap;
        });

        return newCustomTiles;
      });
    });
  };

  const handleShufflePattern = useCallback(() => {
    if (!currentPatternTexture || isShuffling) return;

    setIsShuffling(true);
    
    const timeoutId = setTimeout(() => {
      const newOffset = Math.floor(Math.random() * 3);
      setPatternOffset(newOffset);

      const roomConfig = ROOM_CONFIGS[roomType];
      const wallTileSize = { width: 30, height: 45 };
      const tileSizeM = { width: wallTileSize.width / 100, height: wallTileSize.height / 100 };

      const getWallDimensions = (wall: WallType) => {
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
          const dims = getWallDimensions(wall);
          const patternIndices = generateVerticalStripesPattern(dims.cols, dims.rows, newOffset);
          
          const wallMap = new Map<number, THREE.Texture>();
          patternIndices.forEach(index => {
            wallMap.set(index, currentPatternTexture);
          });
          
          newCustomTiles[wall] = wallMap;
        });

        return newCustomTiles;
      });

      const endTimeoutId = setTimeout(() => {
        setIsShuffling(false);
      }, 500);

      return () => clearTimeout(endTimeoutId);
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [currentPatternTexture, isShuffling, roomType]);

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
          <BrightHotelKitchenScene
            floorTexture={showFloorTiles ? floorTexture : null}
            floorTileSize={floorTile?.size || defaultFloorSize}
            wallTexture={showWallTiles ? wallTexture : null}
            wallTileSize={wallTile?.size || defaultWallSize}
            showWallTiles={showWallTiles}
            quality={quality}
            isGridMode={isGridMode}
            activeWall={activeWall}
            selectedTiles={selectedTiles}
            onTileClick={handleTileClick}
            customTiles={customTiles}
          />
        );
      case 'bathroom':
        return (
          <PremiumBathroomScene
            floorTexture={showFloorTiles ? floorTexture : null}
            floorTileSize={floorTile?.size || defaultFloorSize}
            wallTexture={showWallTiles ? wallTexture : null}
            wallTileSize={wallTile?.size || defaultWallSize}
            showWallTiles={showWallTiles}
            quality={quality}
            isGridMode={isGridMode}
            activeWall={activeWall}
            selectedTiles={selectedTiles}
            onTileClick={handleTileClick}
            customTiles={customTiles}
          />
        );
    }
  };

  const presets = CAMERA_PRESETS[roomType] || [];
  const hasFloorTile = !!floorTile?.texture;
  const hasWallTile = !!wallTile?.texture;

  const getTotalCustomTiles = () => {
    return customTiles.back.size + customTiles.front.size + customTiles.left.size + customTiles.right.size;
  };

  const hasRandomPattern = currentPatternTexture !== null && getTotalCustomTiles() > 0;

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
          <CameraController preset={selectedPreset} onTransitionComplete={handleTransitionComplete} roomType={roomType} />
        </Suspense>
      </Canvas>

      {showControls && (
        <div className="absolute top-2 left-2 bg-black/80 text-white px-2.5 py-2 rounded-lg backdrop-blur-sm shadow-xl border border-white/10 max-w-[180px]">
          <p className="font-semibold mb-0.5 flex items-center gap-1.5 text-[11px]">
            <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
            {roomType.charAt(0).toUpperCase() + roomType.slice(1)} Room
          </p>
          <p className="text-[9px] opacity-75">Quality: <span className="text-blue-400 font-medium capitalize">{quality}</span></p>
          {floorTile && <p className="text-[9px] opacity-75 mt-0.5">Floor: {floorTile.size.width}×{floorTile.size.height} cm</p>}
          {wallTile && <p className="text-[9px] opacity-75">Wall: {wallTile.size.width}×{wallTile.size.height} cm</p>}
        </div>
      )}

      <div className="absolute top-2 right-2 bg-black/80 text-white px-2.5 py-2 rounded-lg backdrop-blur-sm shadow-xl border border-white/10">
        <p className="text-[9px] font-medium mb-0.5">Applied:</p>
        <p className="text-[11px] font-bold capitalize">{activeSurface}</p>
        {hasFloorTile && <p className="text-[9px] opacity-75 mt-0.5 text-green-400">✓ Floor</p>}
        {hasWallTile && <p className="text-[9px] opacity-75 text-blue-400">✓ Wall</p>}
        {getTotalCustomTiles() > 0 && (
          <>
            <p className="text-[9px] opacity-75 text-purple-400 mt-1">Custom Tiles:</p>
            {customTiles.back.size > 0 && <p className="text-[8px] opacity-75 text-purple-300">• Back: {customTiles.back.size}</p>}
            {customTiles.front.size > 0 && <p className="text-[8px] opacity-75 text-purple-300">• Front: {customTiles.front.size}</p>}
            {customTiles.left.size > 0 && <p className="text-[8px] opacity-75 text-purple-300">• Left: {customTiles.left.size}</p>}
            {customTiles.right.size > 0 && <p className="text-[8px] opacity-75 text-purple-300">• Right: {customTiles.right.size}</p>}
          </>
        )}
      </div>

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

      {showSettings && (
        <div className="absolute bottom-12 right-2 bg-black/90 text-white p-2.5 rounded-lg backdrop-blur-sm shadow-xl border border-white/10 min-w-[140px]">
          <p className="text-[9px] font-semibold mb-1.5 flex items-center gap-1">
            <Settings className="w-2.5 h-2.5" />
            Settings
          </p>
          <div className="space-y-1.5">
            <div>
              <p className="text-[9px] mb-1 opacity-75">Quality</p>
              <div className="flex flex-col gap-0.5">
                {(['ultra', 'high', 'medium', 'low'] as QualityLevel[]).map((q) => (
                  <button
                    key={q}
                    onClick={() => setQuality(q)}
                    className={`px-1.5 py-0.5 rounded text-[9px] capitalize transition-all ${
                      quality === q ? 'bg-blue-600' : 'bg-white/10 hover:bg-white/20'
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

      {isGridMode && activeWall && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-2xl p-6 min-w-[300px] max-w-[90vw] z-40 animate-slideUp">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <Grid3x3 className="w-5 h-5 text-blue-600" />
                Select Tiles
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                Editing: {activeWall.charAt(0).toUpperCase() + activeWall.slice(1)} Wall
              </p>
            </div>
            <span className="text-xs bg-blue-100 text-blue-700 px-3 py-1.5 rounded-full font-semibold">
              {selectedTiles.length} selected
            </span>
          </div>

          <div className="space-y-3">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-xs text-blue-800">
                <strong>Tap tiles</strong> on the {activeWall} wall to select them. Selected tiles will be highlighted in green.
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleClearSelection}
                disabled={selectedTiles.length === 0}
                className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Clear All
              </button>
              <button
                onClick={handleOkClick}
                disabled={selectedTiles.length === 0}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:shadow-lg text-white rounded-lg text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4" />
                OK - Upload
              </button>
            </div>

            <button
              onClick={handleCancelGridMode}
              className="w-full px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-sm font-semibold transition-all flex items-center justify-center gap-2"
            >
              <X className="w-4 h-4" />
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="absolute bottom-2 left-2 flex gap-1.5 flex-wrap max-w-[250px]">
        <button
          onClick={handleToggleGridMode}
          disabled={isGridMode}
          className={`${
            isGridMode 
              ? 'bg-green-600 text-white' 
              : 'bg-black/80 text-white hover:bg-black/95'
          } p-1.5 rounded-lg transition-all backdrop-blur-sm shadow-xl border border-white/10 flex items-center gap-1 px-2.5 disabled:opacity-50`}
          title="Add Highlighter"
        >
          <Highlighter className="w-3.5 h-3.5" />
          <span className="text-[9px] font-semibold hidden sm:inline">
            Add Highlighter
          </span>
        </button>

        {roomType === 'bathroom' && (
          <button
            onClick={handleRandomPattern}
            className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-1.5 rounded-lg hover:shadow-lg transition-all backdrop-blur-sm shadow-xl border border-white/10 flex items-center gap-1 px-2.5"
            title="Random Pattern"
          >
            <Shuffle className="w-3.5 h-3.5" />
            <span className="text-[9px] font-semibold hidden sm:inline">
              Random Pattern
            </span>
          </button>
        )}

        {roomType === 'bathroom' && hasRandomPattern && (
          <button
            onClick={handleShufflePattern}
            disabled={isShuffling}
            className={`${
              isShuffling 
                ? 'bg-orange-500' 
                : 'bg-gradient-to-r from-orange-600 to-amber-600 hover:shadow-lg'
            } text-white p-1.5 rounded-lg transition-all backdrop-blur-sm shadow-xl border border-white/10 flex items-center gap-1 px-2.5 disabled:opacity-75`}
            title="Shuffle Pattern"
          >
            <Shuffle className={`w-3.5 h-3.5 ${isShuffling ? 'animate-spin' : ''}`} />
            <span className="text-[9px] font-semibold hidden sm:inline">
              {isShuffling ? 'Shuffling...' : 'Shuffle Pattern'}
            </span>
          </button>
        )}
      </div>

      <div className="absolute bottom-2 right-2 flex gap-1.5">
        <button
          onClick={() => setShowControls(!showControls)}
          className="bg-black/80 text-white p-1.5 rounded-lg hover:bg-black/95 transition-all backdrop-blur-sm shadow-xl border border-white/10"
          title="Info"
        >
          <Info className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="bg-black/80 text-white p-1.5 rounded-lg hover:bg-black/95 transition-all backdrop-blur-sm shadow-xl border border-white/10"
          title="Settings"
        >
          <Settings className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={handleReset}
          className="bg-black/80 text-white p-1.5 rounded-lg hover:bg-black/95 transition-all backdrop-blur-sm shadow-xl border border-white/10"
          title="Reset"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={toggleFullscreen}
          className="bg-black/80 text-white p-1.5 rounded-lg hover:bg-black/95 transition-all backdrop-blur-sm shadow-xl border border-white/10"
          title="Fullscreen"
        >
          {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
        </button>
      </div>

      {(!hasFloorTile && !hasWallTile) && !isGridMode && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm pointer-events-none">
          <div className="bg-white rounded-xl p-5 text-center shadow-2xl max-w-[280px] mx-4">
            <Package className="w-10 h-10 mx-auto mb-2.5 text-blue-600" />
            <p className="text-gray-800 font-semibold text-sm mb-1">No Tiles Applied</p>
            <p className="text-gray-500 text-xs">Upload tiles to visualize</p>
          </div>
        </div>
      )}

      <WallSelectorModal
        isOpen={showWallSelector}
        onClose={() => setShowWallSelector(false)}
        onSelectWall={handleSelectWall}
        roomType={roomType}
      />

      {/* 🆕 NEW: Multi-Option Upload Modal */}
      <TileUploadOptionsModal
        isOpen={showTileUploadOptions}
        onClose={() => setShowTileUploadOptions(false)}
        onTileSelected={handleTileSelected}
      />

      <RandomPatternModal
        isOpen={showRandomPattern}
        onClose={() => setShowRandomPattern(false)}
        onApplyPattern={handleApplyRandomPattern}
        roomType={roomType}
      />

      {isShuffling && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-2xl p-4 flex items-center gap-3 z-50 animate-slideUp">
          <Shuffle className="w-6 h-6 text-orange-600 animate-spin" />
          <div>
            <p className="font-bold text-gray-800">Shuffling Pattern...</p>
            <p className="text-xs text-gray-500">Applying new layout</p>
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
      `}</style>
    </div>
  );
};

export default Enhanced3DViewer;