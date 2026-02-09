// src/components/BrightHotelKitchenScene.tsx - COMPLETE PRODUCTION READY
import React, { useMemo } from 'react';
import * as THREE from 'three';

// ═══════════════════════════════════════════════════════════════
// INTERFACES
// ═══════════════════════════════════════════════════════════════

type WallType = 'back' | 'front' | 'left' | 'right';
type QualityLevel = 'ultra' | 'high' | 'medium' | 'low';

interface WallCustomTiles {
  back: Map<number, THREE.Texture>;
  front: Map<number, THREE.Texture>;
  left: Map<number, THREE.Texture>;
  right: Map<number, THREE.Texture>;
}

interface TileData {
  index: number;
  row: number;
  col: number;
  position: [number, number, number];
  texture: string | null;
  isCustom: boolean;
}

interface BrightHotelKitchenSceneProps {
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
  roomDimensions?: { width: number; depth: number; height: number };
  furnitureScale?: { x: number; y: number; z: number };
  wallTileHeight?: number;
  highlightTileBorders?: boolean;
}

const DEFAULT_ROOM_DIMENSIONS = {
  width: 10 * 0.3048,
  depth: 12 * 0.3048,
  height: 11 * 0.3048,
};

// ═══════════════════════════════════════════════════════════════
// SMART FURNITURE CALCULATOR
// ═══════════════════════════════════════════════════════════════

interface KitchenFurniture {
  backCounter: boolean;
  centerIsland: boolean;
  refrigerator: boolean;
  sideStorage: boolean;
  microwave: boolean;
  stoolCount: number;
  pendantCount: number;
  layout: 'compact' | 'standard' | 'spacious';
}

const calculateKitchenSetup = (
  widthFeet: number,
  depthFeet: number,
  heightFeet: number
): KitchenFurniture => {
  const area = widthFeet * depthFeet;
  
  if (area < 100) {
    return {
      backCounter: true,
      centerIsland: true,
      refrigerator: true,
      sideStorage: false,
      microwave: false,
      stoolCount: 2,
      pendantCount: 2,
      layout: 'compact'
    };
  } else if (area < 140) {
    return {
      backCounter: true,
      centerIsland: true,
      refrigerator: true,
      sideStorage: true,
      microwave: widthFeet > 9,
      stoolCount: 3,
      pendantCount: 3,
      layout: 'standard'
    };
  } else {
    return {
      backCounter: true,
      centerIsland: true,
      refrigerator: true,
      sideStorage: true,
      microwave: true,
      stoolCount: 4,
      pendantCount: 4,
      layout: 'spacious'
    };
  }
};

// ═══════════════════════════════════════════════════════════════
// TILED FLOOR COMPONENT
// ═══════════════════════════════════════════════════════════════

const TiledFloor: React.FC<{
  baseTexture: THREE.Texture | null;
  tileSize: { width: number; height: number };
  roomWidth: number;
  roomDepth: number;
  position: [number, number, number];
  quality: QualityLevel;
  highlightBorders?: boolean;
}> = ({ baseTexture, tileSize, roomWidth, roomDepth, position, highlightBorders = false }) => {
  
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

  React.useEffect(() => {
    return () => {
      if ((material as any)._customTexture) {
        (material as any)._customTexture.dispose();
      }
      material.dispose();
    };
  }, [material]);

  const gridLines = useMemo(() => {
    if (!highlightBorders) return null;
    
    const tileSizeM = {
      width: tileSize.width / 100,
      height: tileSize.height / 100
    };
    
    const cols = Math.ceil(roomWidth / tileSizeM.width);
    const rows = Math.ceil(roomDepth / tileSizeM.height);
    
    const points: THREE.Vector3[] = [];
    
    for (let i = 0; i <= cols; i++) {
      const x = -roomWidth/2 + i * tileSizeM.width;
      points.push(new THREE.Vector3(x, -roomDepth/2, 0.001));
      points.push(new THREE.Vector3(x, roomDepth/2, 0.001));
    }
    
    for (let i = 0; i <= rows; i++) {
      const y = -roomDepth/2 + i * tileSizeM.height;
      points.push(new THREE.Vector3(-roomWidth/2, y, 0.001));
      points.push(new THREE.Vector3(roomWidth/2, y, 0.001));
    }
    
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    return geometry;
  }, [highlightBorders, roomWidth, roomDepth, tileSize]);

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={position}>
        <planeGeometry args={[roomWidth, roomDepth]} />
        <primitive object={material} attach="material" />
      </mesh>
      {highlightBorders && gridLines && (
        <lineSegments rotation={[-Math.PI / 2, 0, 0]} position={position}>
          <primitive object={gridLines} attach="geometry" />
          <lineBasicMaterial color="#000000" linewidth={2} opacity={0.8} transparent />
        </lineSegments>
      )}
    </group>
  );
};

// ═══════════════════════════════════════════════════════════════
// TILED WALL COMPONENT
// ═══════════════════════════════════════════════════════════════

const TiledWall: React.FC<{
  baseTexture: THREE.Texture | null;
  tileSize: { width: number; height: number };
  width: number;
  height: number;
  position: [number, number, number];
  rotation?: [number, number, number];
  quality: QualityLevel;
  highlightBorders?: boolean;
}> = ({ baseTexture, tileSize, width, height, position, rotation = [0, 0, 0], highlightBorders = false }) => {
  
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

  React.useEffect(() => {
    return () => {
      if ((material as any)._customTexture) {
        (material as any)._customTexture.dispose();
      }
      material.dispose();
    };
  }, [material]);

  const gridLines = useMemo(() => {
    if (!highlightBorders) return null;
    
    const tileSizeM = {
      width: tileSize.width / 100,
      height: tileSize.height / 100
    };
    
    const cols = Math.ceil(width / tileSizeM.width);
    const rows = Math.ceil(height / tileSizeM.height);
    
    const points: THREE.Vector3[] = [];
    
    for (let i = 0; i <= cols; i++) {
      const x = -width/2 + i * tileSizeM.width;
      points.push(new THREE.Vector3(x, -height/2, 0.001));
      points.push(new THREE.Vector3(x, height/2, 0.001));
    }
    
    for (let i = 0; i <= rows; i++) {
      const y = -height/2 + i * tileSizeM.height;
      points.push(new THREE.Vector3(-width/2, y, 0.001));
      points.push(new THREE.Vector3(width/2, y, 0.001));
    }
    
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    return geometry;
  }, [highlightBorders, width, height, tileSize]);

  return (
    <group position={position} rotation={rotation}>
      <mesh>
        <planeGeometry args={[width, height]} />
        <primitive object={material} attach="material" />
      </mesh>
      
      {highlightBorders && gridLines && (
        <lineSegments position={[0, 0, 0.001]}>
          <primitive object={gridLines} attach="geometry" />
          <lineBasicMaterial color="#ff0000" linewidth={3} opacity={1} transparent={false} />
        </lineSegments>
      )}
    </group>
  );
};

// ═══════════════════════════════════════════════════════════════
// INDIVIDUAL TILE COMPONENT (FOR GRID MODE)
// ═══════════════════════════════════════════════════════════════

const IndividualTile: React.FC<{
  tileData: TileData;
  baseTexture: THREE.Texture | null;
  customTexture: THREE.Texture | null;
  tileSize: { width: number; height: number };
  isSelected: boolean;
  isGridMode: boolean;
  onTileClick: (index: number) => void;
}> = ({ tileData, baseTexture, customTexture, tileSize, isSelected, isGridMode, onTileClick }) => {
  const meshRef = React.useRef<THREE.Mesh>(null);

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

  React.useEffect(() => {
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
          
          <mesh position={[tileSizeM.width * 0.4, tileSizeM.height * 0.4, 0.003]}>
            <circleGeometry args={[0.03, 16]} />
            <meshBasicMaterial color="#10b981" />
          </mesh>
        </>
      )}
    </group>
  );
};

// ═══════════════════════════════════════════════════════════════
// GRID WALL COMPONENT (FOR TILE SELECTION)
// ═══════════════════════════════════════════════════════════════

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

// ═══════════════════════════════════════════════════════════════
// CEILING COMPONENT
// ═══════════════════════════════════════════════════════════════

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
// MAIN SCENE COMPONENT
// ═══════════════════════════════════════════════════════════════

export const BrightHotelKitchenScene: React.FC<BrightHotelKitchenSceneProps> = ({
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
  customTiles,
  roomDimensions = DEFAULT_ROOM_DIMENSIONS,
  furnitureScale,
  wallTileHeight = 11,
  highlightTileBorders = false
}) => {
  
  const { width: W, depth: D, height: H } = roomDimensions;
  
  const widthFeet = W / 0.3048;
  const depthFeet = D / 0.3048;
  const heightFeet = H / 0.3048;
  
  const furniture = useMemo(() => 
    calculateKitchenSetup(widthFeet, depthFeet, heightFeet),
    [widthFeet, depthFeet, heightFeet]
  );
  
  const autoScale = useMemo(() => {
    if (furnitureScale) return furnitureScale;
    
    const baseWidth = 10 * 0.3048;
    const baseDepth = 12 * 0.3048;
    const baseHeight = 11 * 0.3048;
    
    return {
      x: W / baseWidth,
      y: H / baseHeight,
      z: D / baseDepth
    };
  }, [W, D, H, furnitureScale]);
  
  const { x: scaleX, y: scaleY, z: scaleZ } = autoScale;
  const actualWallHeight = (wallTileHeight / 11) * H;
  
  console.log(`🍳 Kitchen: ${widthFeet.toFixed(1)}' × ${depthFeet.toFixed(1)}' × ${heightFeet.toFixed(1)}'`);
  console.log(`🪑 Layout: ${furniture.layout.toUpperCase()} | Stools: ${furniture.stoolCount} | Scale: ${scaleX.toFixed(2)}×${scaleY.toFixed(2)}×${scaleZ.toFixed(2)}`);

  const shouldUseGridWall = (wall: WallType) => {
    if (wall !== 'back') return false;
    return (isGridMode && activeWall === wall) || customTiles[wall].size > 0;
  };

  return (
    <group>
      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* FLOOR & CEILING */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      
      <TiledFloor 
        baseTexture={floorTexture} 
        tileSize={floorTileSize} 
        roomWidth={W} 
        roomDepth={D} 
        position={[0, 0, 0]} 
        quality={quality} 
        highlightBorders={highlightTileBorders} 
      />
      <Ceiling width={W} depth={D} height={H} />

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* WALLS */}
      {/* ═══════════════════════════════════════════════════════════════ */}

      {/* BACK WALL - Tiles allowed */}
      {showWallTiles && shouldUseGridWall('back') ? (
        <GridWall
          baseTexture={wallTexture}
          tileSize={wallTileSize}
          width={W}
          height={actualWallHeight}
          position={[0, actualWallHeight/2, -D/2]}
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
          height={actualWallHeight}
          position={[0, actualWallHeight/2, -D/2]}
          quality={quality}
          highlightBorders={highlightTileBorders}
        />
      ) : (
        <mesh position={[0, H/2, -D/2]}>
          <planeGeometry args={[W, H]} />
          <meshStandardMaterial color="#f5f5f5" roughness={0.85} />
        </mesh>
      )}

      {/* FRONT WALL - No tiles */}
      <mesh position={[0, H/2, D/2]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[W, H]} />
        <meshStandardMaterial color="#ffffff" roughness={0.85} />
      </mesh>

      {/* LEFT WALL - No tiles */}
      <mesh position={[-W/2, H/2, 0]} rotation={[0, Math.PI/2, 0]}>
        <planeGeometry args={[D, H]} />
        <meshStandardMaterial color="#fef9f3" roughness={0.85} />
      </mesh>

      {/* RIGHT WALL - No tiles */}
      <mesh position={[W/2, H/2, 0]} rotation={[0, -Math.PI/2, 0]}>
        <planeGeometry args={[D, H]} />
        <meshStandardMaterial color="#faf5ed" roughness={0.85} />
      </mesh>

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* BACK COUNTER - ESSENTIAL */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      
      <group position={[0, 0, -(D/2 - 0.8) * scaleZ]} scale={[scaleX, scaleY, scaleZ]}>
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

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* CENTER ISLAND - ESSENTIAL */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      
      <group position={[0, 0, (D/2 - 4.5) * scaleZ]} scale={[scaleX, scaleY, scaleZ]}>
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
        {Array.from({ length: furniture.stoolCount }).map((_, i) => {
          const spacing = 2.4 / (furniture.stoolCount - 1);
          const x = -1.2 + (i * spacing);
          
          return (
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
          );
        })}
      </group>

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* SIDE STORAGE - OPTIONAL */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      
      {furniture.sideStorage && (
        <group position={[-(W/2 - 0.9) * scaleX, 0, -(D/2 - 1.4) * scaleZ]} scale={[scaleX, scaleY, scaleZ]}>
          <mesh position={[0, 0.5, 0]} castShadow>
            <boxGeometry args={[0.6, 1.0, 2.6]} />
            <meshStandardMaterial color="#ffffff" roughness={0.18} metalness={0.15} />
          </mesh>
          <mesh position={[0, 1.02, 0]} castShadow>
            <boxGeometry args={[0.65, 0.06, 2.7]} />
            <meshStandardMaterial color="#faf6f0" roughness={0.1} metalness={0.45} />
          </mesh>
        </group>
      )}

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* REFRIGERATOR - ESSENTIAL */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      
      <mesh 
        position={[(W/2 - 1.5) * scaleX, 1.3 * scaleY, -(D/2 - 0.35) * scaleZ]} 
        castShadow 
        scale={[scaleX, scaleY, scaleZ]}
      >
        <boxGeometry args={[0.9, 2.6, 0.75]} />
        <meshStandardMaterial color="#e8e8e8" roughness={0.12} metalness={0.88} />
      </mesh>

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* MICROWAVE - OPTIONAL */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      
      {furniture.microwave && (
        <mesh 
          position={[-(W/2 - 1.9) * scaleX, 1.4 * scaleY, -(D/2 - 0.35) * scaleZ]} 
          castShadow 
          scale={[scaleX, scaleY, scaleZ]}
        >
          <boxGeometry args={[0.7, 1.4, 0.12]} />
          <meshStandardMaterial color="#e0e0e0" roughness={0.18} metalness={0.8} />
        </mesh>
      )}

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* PENDANT LIGHTS - SMART COUNT */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      
      {Array.from({ length: furniture.pendantCount }).map((_, i) => {
        const spacing = 2.4 / (furniture.pendantCount - 1);
        const x = -1.2 + (i * spacing);
        
        return (
          <group 
            key={`pendant-${i}`} 
            position={[x * scaleX, (H - 0.35) * scaleY, (D/2 - 4.5) * scaleZ]} 
            scale={[scaleX, scaleY, scaleZ]}
          >
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
        );
      })}

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* AMBIENT LIGHTING */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      
      <pointLight position={[(W/2 - 4) * scaleX, (H - 0.1) * scaleY, -(D/2 - 2) * scaleZ]} intensity={2.0} color="#ffffff" distance={5} />
      <pointLight position={[-(W/2 - 4) * scaleX, (H - 0.1) * scaleY, -(D/2 - 2) * scaleZ]} intensity={2.0} color="#ffffff" distance={5} />
      <pointLight position={[(W/2 - 4) * scaleX, (H - 0.1) * scaleY, (D/2 - 3.5) * scaleZ]} intensity={2.0} color="#ffffff" distance={5} />
      <pointLight position={[-(W/2 - 4) * scaleX, (H - 0.1) * scaleY, (D/2 - 3.5) * scaleZ]} intensity={2.0} color="#ffffff" distance={5} />
      <pointLight position={[0, (H - 0.1) * scaleY, 0]} intensity={2.2} color="#ffffff" distance={5} />
    </group>
  );
};

export default BrightHotelKitchenScene;