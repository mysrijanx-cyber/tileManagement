// src/components/PremiumBathroomScene.tsx - COMPLETE PRODUCTION READY
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

interface PremiumBathroomSceneProps {
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
  width: 8 * 0.3048,
  depth: 10 * 0.3048,
  height: 11 * 0.3048,
};

// ═══════════════════════════════════════════════════════════════
// SMART FURNITURE CALCULATOR
// ═══════════════════════════════════════════════════════════════

interface BathroomFurniture {
  toilet: boolean;
  vanity: boolean;
  shower: boolean;
  door: boolean;
  mirror: boolean;
  towelRack: boolean;
  plant: boolean;
  bathMats: boolean;
  exhaustFan: boolean;
  layout: 'compact' | 'standard' | 'luxury';
}

const calculateBathroomSetup = (
  widthFeet: number,
  depthFeet: number,
  heightFeet: number
): BathroomFurniture => {
  const area = widthFeet * depthFeet;
  
  if (area < 70) {
    return {
      toilet: true,
      vanity: true,
      shower: true,
      door: true,
      mirror: false,
      towelRack: false,
      plant: false,
      bathMats: false,
      exhaustFan: true,
      layout: 'compact'
    };
  } else if (area < 100) {
    return {
      toilet: true,
      vanity: true,
      shower: true,
      door: true,
      mirror: true,
      towelRack: true,
      plant: false,
      bathMats: true,
      exhaustFan: true,
      layout: 'standard'
    };
  } else {
    return {
      toilet: true,
      vanity: true,
      shower: true,
      door: true,
      mirror: true,
      towelRack: true,
      plant: true,
      bathMats: true,
      exhaustFan: true,
      layout: 'luxury'
    };
  }
};

// ═══════════════════════════════════════════════════════════════
// TILED FLOOR COMPONENT (COPIED FROM KITCHEN)
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
// INDIVIDUAL TILE COMPONENT
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
// GRID WALL COMPONENT
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

export const PremiumBathroomScene: React.FC<PremiumBathroomSceneProps> = ({
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
    calculateBathroomSetup(widthFeet, depthFeet, heightFeet),
    [widthFeet, depthFeet, heightFeet]
  );
  
  const autoScale = useMemo(() => {
    if (furnitureScale) return furnitureScale;
    
    const baseWidth = 8 * 0.3048;
    const baseDepth = 10 * 0.3048;
    const baseHeight = 11 * 0.3048;
    
    return {
      x: W / baseWidth,
      y: H / baseHeight,
      z: D / baseDepth
    };
  }, [W, D, H, furnitureScale]);
  
  const { x: scaleX, y: scaleY, z: scaleZ } = autoScale;
  const actualWallHeight = (wallTileHeight / 11) * H;
  
  console.log(`🚿 Bathroom: ${widthFeet.toFixed(1)}' × ${depthFeet.toFixed(1)}' × ${heightFeet.toFixed(1)}'`);
  console.log(`🪑 Layout: ${furniture.layout.toUpperCase()} | Mirror: ${furniture.mirror ? '✓' : '✗'} | Plant: ${furniture.plant ? '✓' : '✗'} | Scale: ${scaleX.toFixed(2)}×${scaleY.toFixed(2)}×${scaleZ.toFixed(2)}`);

  const shouldUseGridWall = (wall: WallType) => {
    return (isGridMode && activeWall === wall) || customTiles[wall].size > 0;
  };

  const vanityPosX = -(W/2 - 0.8) * scaleX;
  const vanityPosZ = -(D/2 - 0.28) * scaleZ;
  const showerPosX = (W/2 - 0.85) * scaleX;
  const showerPosZ = -(D/2 - 0.85) * scaleZ;
  const toiletPosZ = -(D/2 - 0.35) * scaleZ;
  const doorPosX = (W/2 - 1.8) * scaleX;
  const doorPosZ = (D/2 - 0.002) * scaleZ;
  const plantPosX = -(W/2 - 0.5) * scaleX;
  const plantPosZ = (D/2 - 0.5) * scaleZ;
  const towelPosX = (W/2 - 1.9) * scaleX;
  const towelPosZ = -(D/2 - 0.02) * scaleZ;

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
      {/* WALLS - ALL 4 WALLS */}
      {/* ═══════════════════════════════════════════════════════════════ */}

      {['back', 'front', 'left', 'right'].map((wallKey) => {
        const wall = wallKey as WallType;
        const wallWidth = wall === 'left' || wall === 'right' ? D : W;
        const wallPos: [number, number, number] = 
          wall === 'back' ? [0, actualWallHeight/2, -D/2] :
          wall === 'front' ? [0, actualWallHeight/2, D/2] :
          wall === 'left' ? [-W/2, actualWallHeight/2, 0] :
          [W/2, actualWallHeight/2, 0];
        const wallRot: [number, number, number] =
          wall === 'front' ? [0, Math.PI, 0] :
          wall === 'left' ? [0, Math.PI/2, 0] :
          wall === 'right' ? [0, -Math.PI/2, 0] :
          [0, 0, 0];

        return showWallTiles && shouldUseGridWall(wall) ? (
          <GridWall
            key={wall}
            baseTexture={wallTexture}
            tileSize={wallTileSize}
            width={wallWidth}
            height={actualWallHeight}
            position={wallPos}
            rotation={wallRot}
            isGridMode={isGridMode && activeWall === wall}
            selectedTiles={activeWall === wall ? selectedTiles : []}
            onTileClick={onTileClick}
            customTilesMap={customTiles[wall]}
          />
        ) : showWallTiles ? (
          <TiledWall
            key={wall}
            baseTexture={wallTexture}
            tileSize={wallTileSize}
            width={wallWidth}
            height={actualWallHeight}
            position={wallPos}
            rotation={wallRot}
            quality={quality}
            highlightBorders={highlightTileBorders}
          />
        ) : (
          <mesh key={wall} position={wallPos} rotation={wallRot}>
            <planeGeometry args={[wallWidth, H]} />
            <meshStandardMaterial 
              color={
                wall === 'front' ? '#ffffff' : 
                wall === 'left' ? '#fef9f3' : 
                wall === 'right' ? '#faf5ed' : 
                '#f5f5f5'
              } 
              roughness={0.85} 
            />
          </mesh>
        );
      })}

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* VANITY - ESSENTIAL */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      
      <group position={[vanityPosX, 0, vanityPosZ]} scale={[scaleX, scaleY, scaleZ]}>
        <mesh position={[0, 0.45, 0]} castShadow>
          <boxGeometry args={[1.3, 0.9, 0.55]} />
          <meshStandardMaterial color="#ffffff" roughness={0.25} metalness={0.1} />
        </mesh>
        <mesh position={[0, 0.92, 0]} castShadow>
          <boxGeometry args={[1.35, 0.05, 0.6]} />
          <meshStandardMaterial color="#f5f5f0" roughness={0.15} metalness={0.45} />
        </mesh>
        
        {/* Cabinet doors */}
        {[-0.32, 0.32].map((x, i) => (
          <React.Fragment key={i}>
            <mesh position={[x, 0.45, 0.285]} castShadow>
              <boxGeometry args={[0.6, 0.85, 0.02]} />
              <meshStandardMaterial color="#fafafa" roughness={0.3} metalness={0.05} />
            </mesh>
            <mesh position={[x + 0.18, 0.45, 0.305]}>
              <boxGeometry args={[0.15, 0.02, 0.02]} />
              <meshStandardMaterial color="#c0c0c0" roughness={0.1} metalness={0.9} />
            </mesh>
          </React.Fragment>
        ))}
        
        {/* Wash basin */}
        <group position={[0, 0.88, 0]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.23, 0.19, 0.16, 32]} />
            <meshStandardMaterial color="#ffffff" roughness={0.08} metalness={0.2} />
          </mesh>
          <mesh position={[0, -0.01, 0]}>
            <cylinderGeometry args={[0.19, 0.15, 0.14, 32]} />
            <meshStandardMaterial color="#f8f8f8" roughness={0.1} metalness={0.15} />
          </mesh>
          <mesh position={[0, -0.07, 0]}>
            <cylinderGeometry args={[0.025, 0.025, 0.01, 24]} />
            <meshStandardMaterial color="#888888" roughness={0.3} metalness={0.7} />
          </mesh>
        </group>
        
        {/* Faucet */}
        <group position={[0, 0.95, -0.22]}>
          <mesh>
            <cylinderGeometry args={[0.03, 0.035, 0.02, 24]} />
            <meshStandardMaterial color="#e8e8e8" roughness={0.05} metalness={0.98} />
          </mesh>
          <mesh position={[0, 0.18, 0]}>
            <cylinderGeometry args={[0.015, 0.015, 0.36, 16]} />
            <meshStandardMaterial color="#e8e8e8" roughness={0.05} metalness={0.98} />
          </mesh>
          <mesh position={[0, 0.35, 0.09]} rotation={[Math.PI / 2.8, 0, 0]}>
            <cylinderGeometry args={[0.013, 0.013, 0.18, 16]} />
            <meshStandardMaterial color="#e8e8e8" roughness={0.05} metalness={0.98} />
          </mesh>
          <mesh position={[0, 0.42, 0.18]}>
            <cylinderGeometry args={[0.018, 0.015, 0.03, 20]} />
            <meshStandardMaterial color="#e8e8e8" roughness={0.05} metalness={0.98} />
          </mesh>
          
          {/* Hot/Cold knobs */}
          {[-0.1, 0.1].map((x, i) => (
            <group key={i} position={[x, 0.38, -0.02]}>
              <mesh>
                <cylinderGeometry args={[0.022, 0.022, 0.018, 20]} />
                <meshStandardMaterial color="#d0d0d0" roughness={0.08} metalness={0.95} />
              </mesh>
              <mesh position={[0, 0.015, 0]} rotation={[0, 0, Math.PI / 4]}>
                <boxGeometry args={[0.045, 0.008, 0.008]} />
                <meshStandardMaterial color="#d0d0d0" roughness={0.08} metalness={0.95} />
              </mesh>
            </group>
          ))}
        </group>
        
        {/* Soap dispenser */}
        <mesh position={[0.48, 0.97, 0.18]} castShadow>
          <cylinderGeometry args={[0.032, 0.038, 0.14, 20]} />
          <meshStandardMaterial color="#ffffff" roughness={0.25} metalness={0.1} transparent opacity={0.92} />
        </mesh>
        <mesh position={[0.48, 1.04, 0.18]}>
          <cylinderGeometry args={[0.015, 0.02, 0.04, 16]} />
          <meshStandardMaterial color="#c0c0c0" roughness={0.15} metalness={0.85} />
        </mesh>
        
        {/* Tray */}
        <mesh position={[-0.42, 0.94, 0.12]} castShadow>
          <boxGeometry args={[0.22, 0.015, 0.16]} />
          <meshStandardMaterial color="#d4af37" roughness={0.3} metalness={0.7} />
        </mesh>
      </group>

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* LED MIRROR - OPTIONAL */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      
      {furniture.mirror && (
        <group position={[vanityPosX, 1.65 * scaleY, -(D/2 - 0.07)]} scale={[scaleX, scaleY, 1]}>
          <mesh castShadow>
            <boxGeometry args={[1.25, 0.95, 0.03]} />
            <meshStandardMaterial color="#c8c8c8" roughness={0.18} metalness={0.92} />
          </mesh>
          <mesh position={[0, 0, 0.018]}>
            <boxGeometry args={[1.19, 0.89, 0.008]} />
            <meshStandardMaterial color="#e8f4f8" roughness={0.02} metalness={0.98} envMapIntensity={2.0} />
          </mesh>
          
          {/* LED strips */}
          {[
            [0, 0.49, 1.21, 0.04],
            [0, -0.49, 1.21, 0.04],
            [-0.61, 0, 0.03, 0.89],
            [0.61, 0, 0.03, 0.89]
          ].map((params, i) => (
            <mesh key={i} position={[params[0], params[1], 0.025]}>
              <boxGeometry args={i < 2 ? [params[2], params[3], 0.02] : [params[2], params[3], 0.02]} />
              <meshStandardMaterial color="#ffffff" emissive="#fffef8" emissiveIntensity={i < 2 ? (i === 0 ? 1.2 : 0.9) : 0.7} />
            </mesh>
          ))}
          
          <rectAreaLight position={[0, 0.49, 0.05]} width={1.21} height={0.04} intensity={3.5} color="#fffef8" />
          <rectAreaLight position={[0, -0.49, 0.05]} width={1.21} height={0.04} intensity={2.5} color="#fffef8" />
        </group>
      )}

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* SHOWER ENCLOSURE - ESSENTIAL */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      
      <group position={[showerPosX, 0, showerPosZ]} scale={[scaleX, scaleY, scaleZ]}>
        <mesh position={[0, 0.04, 0]} castShadow>
          <boxGeometry args={[1.0, 0.08, 1.0]} />
          <meshStandardMaterial color="#fafafa" roughness={0.2} metalness={0.15} />
        </mesh>
        
        <mesh position={[0, 0.09, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.49, 0.015, 12, 32]} />
          <meshStandardMaterial color="#e8e8e8" roughness={0.25} metalness={0.2} />
        </mesh>
        
        <mesh position={[0, 0.085, 0]}>
          <cylinderGeometry args={[0.045, 0.045, 0.01, 32]} />
          <meshStandardMaterial color="#888888" roughness={0.25} metalness={0.75} />
        </mesh>
        
        {/* Glass panels */}
        {[
          [0, 1.25, -0.5, 1.0, 2.5, 0.012],
          [-0.5, 1.25, 0, 1.0, 2.5, 0.012],
          [0.5, 1.25, 0, 1.0, 2.5, 0.012]
        ].map((params, i) => (
          <mesh 
            key={i} 
            position={[params[0], params[1], params[2]]} 
            rotation={i === 0 ? [0, 0, 0] : [0, Math.PI / 2, 0]} 
            castShadow
          >
            <boxGeometry args={[params[3], params[4], params[5]]} />
            <meshStandardMaterial color="#ffffff" transparent opacity={0.32} roughness={0.05} metalness={0.08} />
          </mesh>
        ))}
        
        {/* Frame */}
        {[
          [0, 2.5, -0.5, 1.0, 0.025, 0.025],
          [-0.5, 2.5, 0, 0.025, 0.025, 1.0],
          [0.5, 2.5, 0, 0.025, 0.025, 1.0],
          [-0.5, 1.25, -0.5, 0.025, 2.5, 0.025],
          [0.5, 1.25, -0.5, 0.025, 2.5, 0.025]
        ].map((params, i) => (
          <mesh key={i} position={[params[0], params[1], params[2]]}>
            <boxGeometry args={[params[3], params[4], params[5]]} />
            <meshStandardMaterial color="#d0d0d0" roughness={0.05} metalness={0.95} />
          </mesh>
        ))}
        
        {/* Shower head */}
        <group position={[0, 2.15, -0.35]}>
          <mesh>
            <boxGeometry args={[0.06, 0.06, 0.1]} />
            <meshStandardMaterial color="#e0e0e0" roughness={0.05} metalness={0.95} />
          </mesh>
          <mesh position={[0, 0, 0.18]} rotation={[0, Math.PI / 2, 0]}>
            <cylinderGeometry args={[0.018, 0.018, 0.35, 16]} />
            <meshStandardMaterial color="#e0e0e0" roughness={0.05} metalness={0.95} />
          </mesh>
          <mesh position={[0, -0.06, 0.35]} rotation={[Math.PI / 7, 0, 0]}>
            <cylinderGeometry args={[0.12, 0.12, 0.035, 40]} />
            <meshStandardMaterial color="#e8e8e8" roughness={0.08} metalness={0.92} />
          </mesh>
          <mesh position={[0, -0.065, 0.35]} rotation={[Math.PI / 7, 0, 0]}>
            <cylinderGeometry args={[0.11, 0.11, 0.01, 40]} />
            <meshStandardMaterial color="#a0a0a0" roughness={0.35} metalness={0.65} />
          </mesh>
        </group>
        
        {/* Shower controls */}
        <group position={[-0.42, 1.15, -0.45]}>
          <mesh>
            <boxGeometry args={[0.15, 0.35, 0.03]} />
            <meshStandardMaterial color="#e8e8e8" roughness={0.08} metalness={0.9} />
          </mesh>
          <mesh position={[0, 0.08, 0.025]}>
            <cylinderGeometry args={[0.055, 0.055, 0.04, 28]} />
            <meshStandardMaterial color="#e0e0e0" roughness={0.05} metalness={0.95} />
          </mesh>
          <mesh position={[0, -0.08, 0.025]}>
            <cylinderGeometry args={[0.042, 0.042, 0.035, 24]} />
            <meshStandardMaterial color="#d0d0d0" roughness={0.08} metalness={0.92} />
          </mesh>
        </group>
        
        {/* Handheld shower */}
        <group position={[-0.42, 1.55, -0.45]}>
          <mesh>
            <torusGeometry args={[0.032, 0.012, 14, 28, Math.PI]} />
            <meshStandardMaterial color="#e0e0e0" roughness={0.05} metalness={0.95} />
          </mesh>
          <mesh position={[0, -0.1, 0.025]} rotation={[Math.PI / 5, 0, 0]}>
            <capsuleGeometry args={[0.022, 0.14, 14, 24]} />
            <meshStandardMaterial color="#e8e8e8" roughness={0.08} metalness={0.92} />
          </mesh>
          <mesh position={[0, -0.18, 0.02]} rotation={[Math.PI / 5, 0, 0]}>
            <sphereGeometry args={[0.025, 16, 16]} />
            <meshStandardMaterial color="#d0d0d0" roughness={0.1} metalness={0.9} />
          </mesh>
        </group>
        
        {/* Shampoo shelf */}
        <group position={[0.35, 1.0, -0.35]}>
          <mesh>
            <boxGeometry args={[0.2, 0.025, 0.2]} />
            <meshStandardMaterial color="#e0e0e0" roughness={0.25} metalness={0.7} />
          </mesh>
          <mesh position={[0.05, 0.06, 0.05]} castShadow>
            <cylinderGeometry args={[0.025, 0.025, 0.1, 16]} />
            <meshStandardMaterial color="#87ceeb" roughness={0.4} metalness={0.1} transparent opacity={0.85} />
          </mesh>
        </group>
      </group>

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* TOILET - ESSENTIAL */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      
      <group position={[0, 0, toiletPosZ]} scale={[scaleX, scaleY, scaleZ]}>
        <mesh position={[0, 0.25, 0]} castShadow>
          <capsuleGeometry args={[0.22, 0.3, 18, 28]} />
          <meshStandardMaterial color="#ffffff" roughness={0.05} metalness={0.12} />
        </mesh>
        
        <mesh position={[0, 0.42, 0]} rotation={[-Math.PI / 2, 0, 0]} castShadow>
          <torusGeometry args={[0.2, 0.03, 18, 36]} />
          <meshStandardMaterial color="#f5f5f5" roughness={0.22} metalness={0.06} />
        </mesh>
        
        <mesh position={[0, 0.44, 0]} rotation={[-Math.PI / 2, 0, 0]} castShadow>
          <circleGeometry args={[0.22, 36]} />
          <meshStandardMaterial color="#ffffff" roughness={0.18} metalness={0.1} />
        </mesh>
        
        <mesh position={[0, 0.65, -0.19]} castShadow>
          <boxGeometry args={[0.36, 0.52, 0.17]} />
          <meshStandardMaterial color="#ffffff" roughness={0.1} metalness={0.12} />
        </mesh>
        
        {/* Flush buttons */}
        <group position={[0, 0.92, -0.12]}>
          {[-0.04, 0.04].map((x, i) => (
            <mesh key={i} position={[x, 0, 0]}>
              <cylinderGeometry args={[0.027, 0.027, 0.02, 24]} />
              <meshStandardMaterial color="#e0e0e0" roughness={0.12} metalness={0.88} />
            </mesh>
          ))}
        </group>
        
        {/* Toilet paper holder */}
        <group position={[0.38, 0.55, 0]}>
          <mesh position={[0, 0, -0.05]}>
            <cylinderGeometry args={[0.018, 0.018, 0.08, 16]} />
            <meshStandardMaterial color="#c0c0c0" roughness={0.1} metalness={0.9} />
          </mesh>
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.015, 0.015, 0.16, 16]} />
            <meshStandardMaterial color="#c0c0c0" roughness={0.1} metalness={0.9} />
          </mesh>
          <mesh position={[0, 0.09, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.055, 0.055, 0.1, 28]} />
            <meshStandardMaterial color="#ffffff" roughness={0.65} metalness={0} />
          </mesh>
        </group>
        
        {/* Toilet brush holder */}
        <group position={[-0.45, 0, 0.12]}>
          <mesh position={[0, 0.05, 0]} castShadow>
            <cylinderGeometry args={[0.075, 0.085, 0.1, 24]} />
            <meshStandardMaterial color="#e8e8e8" roughness={0.35} metalness={0.25} />
          </mesh>
          <mesh position={[0, 0.22, 0]} castShadow>
            <cylinderGeometry args={[0.058, 0.065, 0.35, 24]} />
            <meshStandardMaterial color="#ffffff" roughness={0.4} metalness={0.15} transparent opacity={0.88} />
          </mesh>
          <mesh position={[0, 0.45, 0]}>
            <cylinderGeometry args={[0.012, 0.012, 0.15, 12]} />
            <meshStandardMaterial color="#c0c0c0" roughness={0.3} metalness={0.6} />
          </mesh>
        </group>
      </group>

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* TOWEL RACK - OPTIONAL */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      
      {furniture.towelRack && (
        <group position={[towelPosX, 1.35 * scaleY, towelPosZ]} scale={[scaleX, scaleY, 1]}>
          {[0, -0.18].map((y, i) => (
            <mesh key={i} position={[0, y, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.018, 0.018, 0.85, 18]} />
              <meshStandardMaterial color="#d0d0d0" roughness={0.05} metalness={0.95} />
            </mesh>
          ))}
          
          {[-0.42, 0.42].map((x, i) => (
            <mesh key={i} position={[x, -0.09, -0.025]}>
              <cylinderGeometry args={[0.028, 0.028, 0.05, 20]} />
              <meshStandardMaterial color="#c0c0c0" roughness={0.1} metalness={0.9} />
            </mesh>
          ))}
          
          <mesh position={[0, -0.09, 0.018]} castShadow>
            <boxGeometry args={[0.75, 0.4, 0.018]} />
            <meshStandardMaterial color="#87ceeb" roughness={0.85} metalness={0} />
          </mesh>
          
          <mesh position={[0.22, 0.05, 0.018]} castShadow>
            <boxGeometry args={[0.32, 0.24, 0.015]} />
            <meshStandardMaterial color="#b0c4de" roughness={0.82} metalness={0} />
          </mesh>
        </group>
      )}

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* EXHAUST FAN - OPTIONAL */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      
      {furniture.exhaustFan && (
        <group position={[0, (H - 0.02) * scaleY, 0]} scale={[scaleX, scaleY, scaleZ]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.19, 0.19, 0.05, 36]} />
            <meshStandardMaterial color="#f0f0f0" roughness={0.4} metalness={0.1} />
          </mesh>
          <mesh position={[0, -0.028, 0]}>
            <cylinderGeometry args={[0.16, 0.16, 0.012, 6]} />
            <meshStandardMaterial color="#c0c0c0" roughness={0.35} metalness={0.5} />
          </mesh>
          <mesh position={[0, -0.035, 0]}>
            <cylinderGeometry args={[0.038, 0.038, 0.008, 24]} />
            <meshStandardMaterial color="#a0a0a0" roughness={0.25} metalness={0.6} />
          </mesh>
        </group>
      )}

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* DOOR - ESSENTIAL */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      
      {furniture.door && (
        <group position={[doorPosX, 0, doorPosZ]} scale={[scaleX, scaleY, 1]}>
          <mesh position={[0, 1.05, 0]} castShadow>
            <boxGeometry args={[1.02, 2.15, 0.08]} />
            <meshStandardMaterial color="#8b7355" roughness={0.65} metalness={0.05} />
          </mesh>
          
          <mesh position={[0, 1.05, -0.025]} castShadow>
            <boxGeometry args={[0.95, 2.05, 0.045]} />
            <meshStandardMaterial color="#fafafa" roughness={0.45} metalness={0.08} />
          </mesh>
          
          {/* Door panels */}
          {[0.65, 0.15, -0.35, -0.85].map((y, i) => (
            <mesh key={i} position={[0, y, -0.05]} castShadow>
              <boxGeometry args={[0.75, 0.38, 0.015]} />
              <meshStandardMaterial color="#f5f5f5" roughness={0.55} metalness={0.05} />
            </mesh>
          ))}
          
          {/* Door handle */}
          <group position={[-0.35, 1.05, -0.06]}>
            <mesh>
              <cylinderGeometry args={[0.025, 0.025, 0.05, 20]} />
              <meshStandardMaterial color="#d0d0d0" roughness={0.08} metalness={0.95} />
            </mesh>
            <mesh position={[0, 0, -0.08]} rotation={[0, 0, -Math.PI / 6]}>
              <boxGeometry args={[0.12, 0.022, 0.022]} />
              <meshStandardMaterial color="#d0d0d0" roughness={0.08} metalness={0.95} />
            </mesh>
          </group>
          
          {/* Lock */}
          <mesh position={[-0.35, 1.05, -0.058]}>
            <cylinderGeometry args={[0.012, 0.012, 0.025, 16]} />
            <meshStandardMaterial color="#a0a0a0" roughness={0.25} metalness={0.85} />
          </mesh>
          
          {/* Glass panel */}
          <mesh position={[0, 1.75, -0.048]} castShadow>
            <boxGeometry args={[0.75, 0.45, 0.012]} />
            <meshStandardMaterial 
              color="#ffffff" 
              transparent 
              opacity={0.35} 
              roughness={0.15} 
              metalness={0.05}
            />
          </mesh>
          
          {/* Hinges */}
          {[1.85, 1.05, 0.25].map((y, i) => (
            <group key={i} position={[0.47, y, -0.04]}>
              <mesh>
                <boxGeometry args={[0.015, 0.08, 0.025]} />
                <meshStandardMaterial color="#8b7355" roughness={0.45} metalness={0.25} />
              </mesh>
              <mesh position={[0.008, 0, 0]}>
                <cylinderGeometry args={[0.008, 0.008, 0.08, 12]} />
                <meshStandardMaterial color="#8b7355" roughness={0.45} metalness={0.25} />
              </mesh>
            </group>
          ))}
          
          {/* Threshold */}
          <mesh position={[0, 0.015, 0]} castShadow>
            <boxGeometry args={[1.02, 0.03, 0.1]} />
            <meshStandardMaterial color="#8b7355" roughness={0.65} metalness={0.05} />
          </mesh>
        </group>
      )}

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* PLANT - LUXURY ONLY */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      
      {furniture.plant && (
        <group position={[plantPosX, 0, plantPosZ]} scale={[scaleX, scaleY, scaleZ]}>
          <mesh position={[0, 0.2, 0]} castShadow>
            <cylinderGeometry args={[0.15, 0.12, 0.4, 24]} />
            <meshStandardMaterial color="#f5f5f0" roughness={0.35} metalness={0.08} />
          </mesh>
          
          <mesh position={[0, 0.41, 0]}>
            <torusGeometry args={[0.15, 0.015, 16, 32]} />
            <meshStandardMaterial color="#e8e8e8" roughness={0.4} metalness={0.1} />
          </mesh>
          
          <mesh position={[0, 0.38, 0]}>
            <cylinderGeometry args={[0.14, 0.14, 0.04, 24]} />
            <meshStandardMaterial color="#4a3c2a" roughness={0.95} metalness={0} />
          </mesh>
          
          <mesh position={[0, 0.65, 0]}>
            <cylinderGeometry args={[0.015, 0.018, 0.5, 12]} />
            <meshStandardMaterial color="#2d5016" roughness={0.85} metalness={0} />
          </mesh>
          
          {/* Leaves */}
          {[
            { pos: [-0.12, 0.55, 0.08], rot: [0.3, -0.5, -0.4], scale: 0.85 },
            { pos: [0.1, 0.52, -0.1], rot: [-0.2, 0.6, 0.3], scale: 0.8 },
            { pos: [0.08, 0.58, 0.12], rot: [0.4, 0.3, 0.5], scale: 0.75 },
            { pos: [-0.15, 0.7, -0.05], rot: [-0.3, -0.7, -0.5], scale: 0.95 },
            { pos: [0.12, 0.68, 0.1], rot: [0.25, 0.8, 0.4], scale: 0.9 },
            { pos: [-0.08, 0.75, 0.15], rot: [0.5, -0.4, 0.6], scale: 0.85 },
            { pos: [0.1, 0.88, -0.08], rot: [-0.4, 0.5, 0.3], scale: 1.0 },
            { pos: [-0.12, 0.92, 0.1], rot: [0.3, -0.6, -0.5], scale: 0.95 },
            { pos: [0.05, 0.95, 0.12], rot: [0.2, 0.4, 0.4], scale: 0.9 }
          ].map((leaf, i) => (
            <mesh
              key={i}
              position={[leaf.pos[0], leaf.pos[1], leaf.pos[2]]}
              rotation={[leaf.rot[0], leaf.rot[1], leaf.rot[2]]}
              castShadow
            >
              <boxGeometry args={[0.18 * leaf.scale, 0.25 * leaf.scale, 0.002]} />
              <meshStandardMaterial 
                color={i < 3 ? "#3d6b2e" : i < 6 ? "#4a7c3a" : "#5a8f45"} 
                roughness={0.65} 
                metalness={0}
                side={THREE.DoubleSide}
              />
            </mesh>
          ))}
          
          {/* Smaller accent leaves */}
          {[
            { pos: [0.08, 0.62, -0.15], rot: [0.5, 0.8, 0.3], scale: 0.4 },
            { pos: [-0.1, 0.82, -0.12], rot: [-0.4, -0.6, -0.4], scale: 0.45 },
            { pos: [0.12, 1.0, 0.05], rot: [0.3, 0.7, 0.5], scale: 0.5 }
          ].map((leaf, i) => (
            <mesh
              key={`accent-${i}`}
              position={[leaf.pos[0], leaf.pos[1], leaf.pos[2]]}
              rotation={[leaf.rot[0], leaf.rot[1], leaf.rot[2]]}
              castShadow
            >
              <boxGeometry args={[0.12 * leaf.scale, 0.16 * leaf.scale, 0.002]} />
              <meshStandardMaterial color="#6aa84f" roughness={0.6} metalness={0} side={THREE.DoubleSide} />
            </mesh>
          ))}
          
          {/* Decorative pebbles */}
          {[
            { pos: [-0.08, 0.4, 0.05], size: 0.018 },
            { pos: [0.06, 0.4, -0.07], size: 0.015 },
            { pos: [0.1, 0.4, 0.08], size: 0.02 },
            { pos: [-0.05, 0.4, -0.09], size: 0.012 }
          ].map((pebble, i) => (
            <mesh key={`pebble-${i}`} position={[pebble.pos[0], pebble.pos[1], pebble.pos[2]]}>
              <sphereGeometry args={[pebble.size, 8, 8]} />
              <meshStandardMaterial color="#d0d0d0" roughness={0.75} metalness={0.05} />
            </mesh>
          ))}
        </group>
      )}

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* BATH MATS - OPTIONAL */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      
      {furniture.bathMats && (
        <>
          <mesh position={[showerPosX, 0.008, -(D/2 - 2.05) * scaleZ]} rotation={[-Math.PI / 2, 0, 0]} castShadow>
            <planeGeometry args={[0.6, 0.42]} />
            <meshStandardMaterial color="#b0c4de" roughness={0.92} metalness={0} />
          </mesh>

          <mesh position={[vanityPosX, 0.008, -(D/2 - 1.45) * scaleZ]} rotation={[-Math.PI / 2, 0, Math.PI / 2]} castShadow>
            <planeGeometry args={[0.5, 0.35]} />
            <meshStandardMaterial color="#b0c4de" roughness={0.92} metalness={0} />
          </mesh>
        </>
      )}

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* LIGHTING */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      
      <pointLight position={[0, (H - 0.15) * scaleY, 0]} intensity={2.8} color="#fff8e1" distance={7.5} decay={2} castShadow />
      <pointLight position={[vanityPosX, (H - 0.3) * scaleY, -(D/2 - 1.7) * scaleZ]} intensity={2.4} color="#fffef8" distance={4} decay={2} />
      <pointLight position={[vanityPosX, 1.65 * scaleY, -(D/2 - 1.3) * scaleZ]} intensity={1.6} color="#ffffff" distance={2.5} decay={2} />
      <pointLight position={[showerPosX, (H - 0.2) * scaleY, showerPosZ]} intensity={1.9} color="#ffffff" distance={3.5} decay={2} />
      <pointLight position={[0, (H - 0.4) * scaleY, (D/2 - 2.35) * scaleZ]} intensity={1.4} color="#fff8e1" distance={3} decay={2} />
      <pointLight position={[(W/2 - 0.3) * scaleX, (H - 0.5) * scaleY, -(D/2 - 2.1) * scaleZ]} intensity={0.95} color="#ffffff" distance={4.5} decay={2} />
      <pointLight position={[-(W/2 - 0.3) * scaleX, (H - 0.5) * scaleY, -(D/2 - 2.1) * scaleZ]} intensity={0.95} color="#ffffff" distance={4.5} decay={2} />
      <pointLight position={[0, (H - 0.6) * scaleY, (D/2 - 1.0) * scaleZ]} intensity={1.05} color="#fff8e1" distance={4} decay={2} />
      <pointLight position={[doorPosX, 1.8 * scaleY, (D/2 - 0.9) * scaleZ]} intensity={1.2} color="#fffef8" distance={2.5} decay={2} />
      <pointLight position={[plantPosX, 1.2 * scaleY, (D/2 - 0.7) * scaleZ]} intensity={0.8} color="#f0ffe0" distance={1.8} decay={2} />
    </group>
  );
};

export default PremiumBathroomScene;