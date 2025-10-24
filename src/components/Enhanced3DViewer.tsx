
// src/components/Enhanced3DViewer.tsx
import React, { useState, useEffect, Suspense, useMemo, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import { Maximize2, Minimize2, RotateCcw, Info } from 'lucide-react';

// ✅ UPDATED: Support for dual tiles
interface Enhanced3DViewerProps {
  roomType: 'drawing' | 'kitchen' | 'bathroom';
  
  // ✅ NEW: Separate floor and wall tiles
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

const ROOM_CONFIGS = {
  drawing: { width: 5, depth: 6, height: 3 },
  kitchen: { width: 4, depth: 5, height: 2.8 },
  bathroom: { width: 3, depth: 3.5, height: 2.8 }
} as const;

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

        loadedTexture.encoding = THREE.sRGBEncoding;
        loadedTexture.wrapS = THREE.RepeatWrapping;
        loadedTexture.wrapT = THREE.RepeatWrapping;
        loadedTexture.minFilter = THREE.LinearMipMapLinearFilter;
        loadedTexture.magFilter = THREE.LinearFilter;
        loadedTexture.anisotropy = 16;
        loadedTexture.colorSpace = THREE.SRGBColorSpace;
        loadedTexture.needsUpdate = true;
        
        textureRef.current = loadedTexture;
        setTexture(loadedTexture);
      },
      undefined,
      (error) => {
        if (!isCancelled) {
          console.error('Texture error:', error);
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

const TiledFloor: React.FC<{
  baseTexture: THREE.Texture | null;
  tileSize: { width: number; height: number };
  roomWidth: number;
  roomDepth: number;
  position: [number, number, number];
}> = ({ baseTexture, tileSize, roomWidth, roomDepth, position }) => {
  
  const material = useMemo(() => {
    if (!baseTexture) {
      return new THREE.MeshStandardMaterial({
        color: '#d4d4d4',
        roughness: 0.85,
        metalness: 0.05
      });
    }

    const clonedTexture = baseTexture.clone();
    clonedTexture.needsUpdate = true;
    
    const tileSizeM = {
      width: tileSize.width / 100,
      height: tileSize.height / 100
    };
    
    const repeatX = roomWidth / tileSizeM.width;
    const repeatY = roomDepth / tileSizeM.height;
    
    clonedTexture.repeat.set(repeatX, repeatY);

    const mat = new THREE.MeshStandardMaterial({
      map: clonedTexture,
      color: '#ffffff',
      roughness: 0.4,
      metalness: 0,
      envMapIntensity: 0.2,
      emissive: '#ffffff',
      emissiveMap: clonedTexture,
      emissiveIntensity: 0.15
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
      receiveShadow
    >
      <planeGeometry args={[roomWidth, roomDepth, 32, 32]} />
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
}> = ({ baseTexture, tileSize, width, height, position, rotation = [0, 0, 0] }) => {
  
  const material = useMemo(() => {
    if (!baseTexture) {
      return new THREE.MeshStandardMaterial({
        color: '#f5f5f5',
        roughness: 0.7,
        metalness: 0.05
      });
    }

    const clonedTexture = baseTexture.clone();
    clonedTexture.needsUpdate = true;
    
    const tileSizeM = {
      width: tileSize.width / 100,
      height: tileSize.height / 100
    };
    
    const repeatX = width / tileSizeM.width;
    const repeatY = height / tileSizeM.height;
    
    clonedTexture.repeat.set(repeatX, repeatY);

    const mat = new THREE.MeshStandardMaterial({
      map: clonedTexture,
      color: '#ffffff',
      roughness: 0.3,
      metalness: 0,
      envMapIntensity: 0.15,
      emissive: '#ffffff',
      emissiveMap: clonedTexture,
      emissiveIntensity: 0.2
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
    <mesh position={position} rotation={rotation} receiveShadow>
      <planeGeometry args={[width, height, 16, 16]} />
      <primitive object={material} attach="material" />
    </mesh>
  );
};

const Ceiling: React.FC<{
  width: number;
  depth: number;
  height: number;
}> = ({ width, depth, height }) => {
  return (
    <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, height, 0]} receiveShadow>
      <planeGeometry args={[width, depth]} />
      <meshStandardMaterial 
        color="#fafafa" 
        roughness={0.95}
        metalness={0}
        envMapIntensity={0.1}
      />
    </mesh>
  );
};

const SceneLoader: React.FC = () => (
  <mesh>
    <boxGeometry args={[1, 1, 1]} />
    <meshStandardMaterial color="#3b82f6" />
  </mesh>
);

// ✅ UPDATED: Accept floor texture only
const DrawingRoomScene: React.FC<{ 
  floorTexture: THREE.Texture | null;
  floorTileSize: { width: number; height: number };
}> = ({ floorTexture, floorTileSize }) => {
  const { width: W, depth: D, height: H } = ROOM_CONFIGS.drawing;

  return (
    <group>
      <TiledFloor
        baseTexture={floorTexture}
        tileSize={floorTileSize}
        roomWidth={W}
        roomDepth={D}
        position={[0, 0, 0]}
      />

      <Ceiling width={W} depth={D} height={H} />

      {/* Rest of the drawing room scene - walls and furniture... */}
      {/* (keeping same as before) */}
      <mesh position={[0, H/2, -D/2]} receiveShadow>
        <planeGeometry args={[W, H]} />
        <meshStandardMaterial color="#f0f0f0" roughness={0.9} />
      </mesh>

      <group>
        <mesh position={[-W/4 - 0.5, H/2, D/2]} rotation={[0, Math.PI, 0]} receiveShadow>
          <planeGeometry args={[W/2 - 1, H]} />
          <meshStandardMaterial color="#f0f0f0" roughness={0.9} />
        </mesh>
        <mesh position={[W/4 + 0.5, H/2, D/2]} rotation={[0, Math.PI, 0]} receiveShadow>
          <planeGeometry args={[W/2 - 1, H]} />
          <meshStandardMaterial color="#f0f0f0" roughness={0.9} />
        </mesh>
        <mesh position={[0, H - 0.3, D/2]} rotation={[0, Math.PI, 0]} receiveShadow>
          <planeGeometry args={[2, 0.6]} />
          <meshStandardMaterial color="#f0f0f0" roughness={0.9} />
        </mesh>
        <mesh position={[0, 1, D/2 - 0.05]} castShadow>
          <boxGeometry args={[0.9, 2, 0.05]} />
          <meshStandardMaterial color="#8b6f47" roughness={0.7} metalness={0.1} />
        </mesh>
      </group>

      <mesh position={[-W/2, H/2, 0]} rotation={[0, Math.PI/2, 0]} receiveShadow>
        <planeGeometry args={[D, H]} />
        <meshStandardMaterial color="#f0f0f0" roughness={0.9} />
      </mesh>

      <group>
        <mesh position={[W/2, H/2 + 0.75, 0]} rotation={[0, -Math.PI/2, 0]} receiveShadow>
          <planeGeometry args={[D, H - 1.5]} />
          <meshStandardMaterial color="#f0f0f0" roughness={0.9} />
        </mesh>
        <mesh position={[W/2, 0.375, 0]} rotation={[0, -Math.PI/2, 0]} receiveShadow>
          <planeGeometry args={[D, 0.75]} />
          <meshStandardMaterial color="#f0f0f0" roughness={0.9} />
        </mesh>
        <mesh position={[W/2 - 0.05, 1.5, 0]} rotation={[0, -Math.PI/2, 0]}>
          <planeGeometry args={[2, 1.2]} />
          <meshStandardMaterial 
            color="#87ceeb" 
            transparent 
            opacity={0.3} 
            roughness={0.1} 
            metalness={0.9}
          />
        </mesh>
      </group>

      {/* Furniture */}
      <group position={[0, 0, -2]}>
        <mesh position={[0, 0.25, 0]} castShadow receiveShadow>
          <boxGeometry args={[2.2, 0.5, 0.9]} />
          <meshStandardMaterial color="#3a3a4a" roughness={0.8} />
        </mesh>
        <mesh position={[0, 0.65, -0.35]} castShadow receiveShadow>
          <boxGeometry args={[2.2, 0.9, 0.2]} />
          <meshStandardMaterial color="#3a3a4a" roughness={0.8} />
        </mesh>
        <mesh position={[-1, 0.45, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.2, 0.7, 0.9]} />
          <meshStandardMaterial color="#3a3a4a" roughness={0.8} />
        </mesh>
        <mesh position={[1, 0.45, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.2, 0.7, 0.9]} />
          <meshStandardMaterial color="#3a3a4a" roughness={0.8} />
        </mesh>
      </group>

      <group position={[0, 0, 0.8]}>
        <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.3, 0.06, 0.7]} />
          <meshStandardMaterial color="#6b4423" roughness={0.4} metalness={0.2} />
        </mesh>
        {[[-0.55, 0.22, -0.3], [0.55, 0.22, -0.3], [-0.55, 0.22, 0.3], [0.55, 0.22, 0.3]].map((pos, i) => (
          <mesh key={i} position={pos as [number, number, number]} castShadow>
            <cylinderGeometry args={[0.04, 0.04, 0.45, 12]} />
            <meshStandardMaterial color="#4a2f1a" roughness={0.6} />
          </mesh>
        ))}
      </group>

      <ContactShadows position={[0, 0.01, 0]} opacity={0.3} scale={10} blur={2} far={4} />
    </group>
  );
};

// ✅ UPDATED: Accept both floor and wall textures with separate sizes
const KitchenScene: React.FC<{ 
  floorTexture: THREE.Texture | null;
  floorTileSize: { width: number; height: number };
  wallTexture: THREE.Texture | null;
  wallTileSize: { width: number; height: number };
  showWallTiles: boolean;
}> = ({ floorTexture, floorTileSize, wallTexture, wallTileSize, showWallTiles }) => {
  const { width: W, depth: D, height: H } = ROOM_CONFIGS.kitchen;

  return (
    <group>
      <TiledFloor
        baseTexture={floorTexture}
        tileSize={floorTileSize}
        roomWidth={W}
        roomDepth={D}
        position={[0, 0, 0]}
      />

      <Ceiling width={W} depth={D} height={H} />

      {/* ✅ Wall uses wallTexture and wallTileSize */}
      <TiledWall
        baseTexture={showWallTiles ? wallTexture : null}
        tileSize={wallTileSize}
        width={W}
        height={H}
        position={[0, H/2, -D/2]}
      />

      <mesh position={[0, H/2, D/2]} rotation={[0, Math.PI, 0]} receiveShadow>
        <planeGeometry args={[W, H]} />
        <meshStandardMaterial color="#f0f0f0" roughness={0.9} />
      </mesh>

      <mesh position={[-W/2, H/2, 0]} rotation={[0, Math.PI/2, 0]} receiveShadow>
        <planeGeometry args={[D, H]} />
        <meshStandardMaterial color="#f0f0f0" roughness={0.9} />
      </mesh>

      <mesh position={[W/2, H/2, 0]} rotation={[0, -Math.PI/2, 0]} receiveShadow>
        <planeGeometry args={[D, H]} />
        <meshStandardMaterial color="#f0f0f0" roughness={0.9} />
      </mesh>

      {/* Kitchen furniture - keeping same */}
      <group position={[0, 0, -2.35]}>
        <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
          <boxGeometry args={[3.6, 0.9, 0.65]} />
          <meshStandardMaterial color="#6b4e3d" roughness={0.7} />
        </mesh>
        <mesh position={[0, 0.92, 0]} castShadow receiveShadow>
          <boxGeometry args={[3.7, 0.04, 0.7]} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.2} metalness={0.6} />
        </mesh>
        <mesh position={[0, 1.85, -0.25]} castShadow receiveShadow>
          <boxGeometry args={[3.6, 0.85, 0.4]} />
          <meshStandardMaterial color="#7a5c47" roughness={0.7} />
        </mesh>
      </group>

      <mesh position={[1.75, 1.05, -2.25]} castShadow receiveShadow>
        <boxGeometry args={[0.75, 2.1, 0.75]} />
        <meshStandardMaterial color="#e5e5e5" roughness={0.15} metalness={0.7} />
      </mesh>

      <ContactShadows position={[0, 0.01, 0]} opacity={0.3} scale={8} blur={2} far={4} />
    </group>
  );
};

// ✅ UPDATED: Bathroom with dual textures
const BathroomScene: React.FC<{ 
  floorTexture: THREE.Texture | null;
  floorTileSize: { width: number; height: number };
  wallTexture: THREE.Texture | null;
  wallTileSize: { width: number; height: number };
  showWallTiles: boolean;
}> = ({ floorTexture, floorTileSize, wallTexture, wallTileSize, showWallTiles }) => {
  const { width: W, depth: D, height: H } = ROOM_CONFIGS.bathroom;

  return (
    <group>
      <TiledFloor
        baseTexture={floorTexture}
        tileSize={floorTileSize}
        roomWidth={W}
        roomDepth={D}
        position={[0, 0, 0]}
      />

      <Ceiling width={W} depth={D} height={H} />

      {/* ✅ All walls use wallTexture and wallTileSize */}
      <TiledWall
        baseTexture={showWallTiles ? wallTexture : null}
        tileSize={wallTileSize}
        width={W}
        height={H}
        position={[0, H/2, -D/2]}
      />

      <TiledWall
        baseTexture={showWallTiles ? wallTexture : null}
        tileSize={wallTileSize}
        width={W}
        height={H}
        position={[0, H/2, D/2]}
        rotation={[0, Math.PI, 0]}
      />

      <TiledWall
        baseTexture={showWallTiles ? wallTexture : null}
        tileSize={wallTileSize}
        width={D}
        height={H}
        position={[-W/2, H/2, 0]}
        rotation={[0, Math.PI/2, 0]}
      />

      <TiledWall
        baseTexture={showWallTiles ? wallTexture : null}
        tileSize={wallTileSize}
        width={D}
        height={H}
        position={[W/2, H/2, 0]}
        rotation={[0, -Math.PI/2, 0]}
      />

      {/* Bathroom fixtures - keeping same */}
      <group position={[-0.85, 0, -1.3]}>
        <mesh position={[0, 0.32, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.27, 0.22, 0.64, 20]} />
          <meshStandardMaterial color="#fafafa" roughness={0.05} metalness={0.1} />
        </mesh>
      </group>

      <ContactShadows position={[0, 0.01, 0]} opacity={0.25} scale={6} blur={2} far={3} />
    </group>
  );
};

// ✅ UPDATED: Main component with dual tile support
export const Enhanced3DViewer: React.FC<Enhanced3DViewerProps> = ({
  roomType,
  floorTile,
  wallTile,
  activeSurface,
  onSurfaceChange
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);

  const cameraPosition = useMemo<[number, number, number]>(() => {
    switch (roomType) {
      case 'drawing':
        return [0, 1.6, 2.5];
      case 'kitchen':
        return [0, 1.6, 2];
      case 'bathroom':
        return [0, 1.4, 1.2];
    }
  }, [roomType]);

  // ✅ Load floor texture
  const floorTexture = useHighQualityTexture(
    floorTile?.texture,
    floorTile?.size.width || 60,
    floorTile?.size.height || 60
  );

  // ✅ Load wall texture
  const wallTexture = useHighQualityTexture(
    wallTile?.texture,
    wallTile?.size.width || 30,
    wallTile?.size.height || 45
  );

  const handleReset = () => {
    window.location.reload();
  };

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
          <DrawingRoomScene 
            floorTexture={showFloorTiles ? floorTexture : null}
            floorTileSize={floorTile?.size || defaultFloorSize}
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
          />
        );
    }
  };

  const hasFloorTile = !!floorTile?.texture;
  const hasWallTile = !!wallTile?.texture;

  return (
    <div className="relative w-full h-full bg-gradient-to-b from-gray-800 to-gray-900">
      <Canvas
        shadows
        camera={{ 
          position: cameraPosition, 
          fov: 75,
          near: 0.1,
          far: 1000
        }}
        gl={{ 
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.5,
          powerPreference: 'high-performance',
          outputEncoding: THREE.sRGBEncoding
        }}
      >
        <Suspense fallback={<SceneLoader />}>
          <color attach="background" args={['#fafafa']} />
          <ambientLight intensity={0.8} />
          <pointLight position={[0, 2.6, 0]} intensity={1.8} distance={10} decay={1.5} color="#ffffff" />
          <pointLight position={[2, 2.2, 2]} intensity={1} distance={8} decay={1.5} color="#ffffff" />
          <pointLight position={[-2, 2.2, 2]} intensity={1} distance={8} decay={1.5} color="#ffffff" />
          <pointLight position={[2, 2.2, -2]} intensity={1} distance={8} decay={1.5} color="#ffffff" />
          <pointLight position={[-2, 2.2, -2]} intensity={1} distance={8} decay={1.5} color="#ffffff" />
          <directionalLight
            position={[5, 8, 5]}
            intensity={1.2}
            castShadow
            shadow-mapSize={[2048, 2048]}
            shadow-camera-left={-10}
            shadow-camera-right={10}
            shadow-camera-top={10}
            shadow-camera-bottom={-10}
            shadow-bias={-0.0001}
          />
          <hemisphereLight args={['#ffffff', '#888888', 0.8]} />

          {renderScene()}

          <OrbitControls
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            maxPolarAngle={Math.PI * 0.95}
            minPolarAngle={Math.PI * 0.05}
            minDistance={0.5}
            maxDistance={8}
            target={[0, 1.2, 0]}
            enableDamping
            dampingFactor={0.08}
            rotateSpeed={0.6}
            zoomSpeed={1}
            panSpeed={0.5}
          />

          <Environment preset="apartment" background={false} />
        </Suspense>
      </Canvas>

      {showControls && (
        <div className="absolute top-4 left-4 bg-black/80 text-white px-4 py-3 rounded-xl backdrop-blur-md shadow-2xl border border-white/10">
          <p className="font-semibold mb-1 flex items-center gap-2">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
            {roomType.charAt(0).toUpperCase() + roomType.slice(1)}
          </p>
          <p className="text-xs opacity-90">
            🔄 360° • 🔍 Zoom • 🖱️ Pan
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

      <div className="absolute bottom-4 right-4 flex gap-2">
        <button
          onClick={() => setShowControls(!showControls)}
          className="bg-black/80 text-white p-3 rounded-xl hover:bg-black/95 transition-all backdrop-blur-md shadow-xl border border-white/10 hover:scale-105"
          title="Info"
        >
          <Info className="w-5 h-5" />
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
          <div className="bg-white rounded-2xl p-8 text-center shadow-2xl">
            <p className="text-gray-800 font-semibold text-lg">Upload tiles to visualize</p>
            <p className="text-gray-500 text-sm mt-2">Floor and/or Wall tiles</p>
          </div>
        </div>
      )}
    </div>
  );
};