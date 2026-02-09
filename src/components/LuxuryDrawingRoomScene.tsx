
import React, { useMemo } from 'react';
import * as THREE from 'three';

interface LuxuryDrawingRoomSceneProps {
  floorTexture: THREE.Texture | null;
  floorTileSize: { width: number; height: number };
  quality: 'ultra' | 'high' | 'medium' | 'low';
  roomDimensions?: {
    width: number;
    depth: number;
    height: number;
  };
  furnitureScale?: {
    x: number;
    y: number;
    z: number;
  };
}

// ✅ MINIMUM SIZES
const DEFAULT_ROOM_DIMENSIONS = {
  width: 15 * 0.3048,
  depth: 20 * 0.3048,
  height: 11 * 0.3048,
};

// ✅ SMART FURNITURE VISIBILITY
interface FurnitureVisibility {
  sofa: boolean;           // Essential
  tv: boolean;             // Essential
  loungeChair: boolean;    // Optional
  coffeeTable: boolean;    // Optional
  sideTable: boolean;      // Optional
  rug: boolean;            // Optional
  artwork: boolean;        // Optional
  floorLamp: boolean;      // Optional
  tallPlant: boolean;      // Optional
  layout: 'minimal' | 'standard' | 'luxury';
}

const calculateFurnitureSetup = (
  widthFeet: number,
  depthFeet: number,
  heightFeet: number
): FurnitureVisibility => {
  const area = widthFeet * depthFeet;
  
  if (area < 250) {
    return {
      sofa: true,
      tv: true,
      loungeChair: false,
      coffeeTable: true,
      sideTable: false,
      rug: true,
      artwork: false,
      floorLamp: false,
      tallPlant: false,
      layout: 'minimal'
    };
  } else if (area < 400) {
    return {
      sofa: true,
      tv: true,
      loungeChair: widthFeet > 16,
      coffeeTable: true,
      sideTable: true,
      rug: true,
      artwork: heightFeet >= 10,
      floorLamp: false,
      tallPlant: depthFeet > 18,
      layout: 'standard'
    };
  } else {
    return {
      sofa: true,
      tv: true,
      loungeChair: true,
      coffeeTable: true,
      sideTable: true,
      rug: true,
      artwork: true,
      floorLamp: true,
      tallPlant: true,
      layout: 'luxury'
    };
  }
};

const Materials = {
  whiteMarble: () => new THREE.MeshPhysicalMaterial({ 
    color: '#ffffff',
    roughness: 0.25,
    metalness: 0,
    clearcoat: 0.3,
    clearcoatRoughness: 0.2,
  }),

  matteWhitePanel: () => new THREE.MeshStandardMaterial({
    color: '#fafafa',
    roughness: 0.9,
    metalness: 0,
  }),

  lightOakWood: () => new THREE.MeshStandardMaterial({
    color: '#d4a574',
    roughness: 0.65,
    metalness: 0,
  }),

  darkWalnutWood: () => new THREE.MeshStandardMaterial({
    color: '#3e2723',
    roughness: 0.5,
    metalness: 0.1,
  }),

  blackMatte: () => new THREE.MeshStandardMaterial({
    color: '#1a1a1a',
    roughness: 0.8,
    metalness: 0.05,
  }),

  blackGlossy: () => new THREE.MeshPhysicalMaterial({
    color: '#0a0a0a',
    roughness: 0.1,
    metalness: 0.9,
    clearcoat: 1.0,
  }),

  clearGlass: () => new THREE.MeshPhysicalMaterial({
    color: '#ffffff',
    roughness: 0.05,
    metalness: 0,
    transmission: 0.96,
    thickness: 0.5,
    ior: 1.5,
    transparent: true,
    opacity: 0.15,
  }),

  brownLeather: () => new THREE.MeshStandardMaterial({
    color: '#6d4c41',
    roughness: 0.4,
    metalness: 0.1,
  }),

  creamFabric: () => new THREE.MeshStandardMaterial({
    color: '#f5f5dc',
    roughness: 0.95,
    metalness: 0,
  }),

  creamCurtain: () => new THREE.MeshStandardMaterial({
    color: '#f8f6f0',
    roughness: 0.98,
    metalness: 0,
    transparent: true,
    opacity: 0.92,
    side: THREE.DoubleSide,
  }),

  brassMetal: () => new THREE.MeshStandardMaterial({
    color: '#b8860b',
    roughness: 0.25,
    metalness: 0.95,
  }),

  goldMetal: () => new THREE.MeshStandardMaterial({
    color: '#d4af37',
    roughness: 0.2,
    metalness: 1.0,
  }),
};

export const LuxuryDrawingRoomScene: React.FC<LuxuryDrawingRoomSceneProps> = ({
  floorTexture,
  floorTileSize,
  quality,
  roomDimensions = DEFAULT_ROOM_DIMENSIONS,
  furnitureScale,
}) => {
  
  const { width: W, depth: D, height: H } = roomDimensions;
  
  const widthFeet = W / 0.3048;
  const depthFeet = D / 0.3048;
  const heightFeet = H / 0.3048;
  
  const furniture = useMemo(() => 
    calculateFurnitureSetup(widthFeet, depthFeet, heightFeet),
    [widthFeet, depthFeet, heightFeet]
  );
  
  const autoScale = useMemo(() => {
    if (furnitureScale) return furnitureScale;
    
    const baseWidth = 15 * 0.3048;
    const baseDepth = 20 * 0.3048;
    const baseHeight = 11 * 0.3048;
    
    return {
      x: W / baseWidth,
      y: H / baseHeight,
      z: D / baseDepth
    };
  }, [W, D, H, furnitureScale]);
  
  const { x: scaleX, y: scaleY, z: scaleZ } = autoScale;
  
  console.log(`🏠 Drawing Room: ${widthFeet.toFixed(1)}' × ${depthFeet.toFixed(1)}' × ${heightFeet.toFixed(1)}'`);
  console.log(`🪑 Layout: ${furniture.layout.toUpperCase()} | Scale: ${scaleX.toFixed(2)}×${scaleY.toFixed(2)}×${scaleZ.toFixed(2)}`);

  const FloorComponent = useMemo(() => {
    if (floorTexture) {
      const clonedTexture = floorTexture.clone();
      clonedTexture.wrapS = THREE.RepeatWrapping;
      clonedTexture.wrapT = THREE.RepeatWrapping;
      clonedTexture.needsUpdate = true;
      
      const tileSizeM = {
        width: floorTileSize.width / 100,
        height: floorTileSize.height / 100,
      };
      
      clonedTexture.repeat.set(
        W / tileSizeM.width,
        D / tileSizeM.height
      );

      const material = new THREE.MeshStandardMaterial({
        map: clonedTexture,
        roughness: 0.3,
        metalness: 0,
      });

      return (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
          <planeGeometry args={[W, D, 1, 1]} />
          <primitive object={material} attach="material" />
        </mesh>
      );
    } else {
      return (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
          <planeGeometry args={[W, D]} />
          <primitive object={Materials.whiteMarble()} attach="material" />
        </mesh>
      );
    }
  }, [floorTexture, floorTileSize, W, D]);

  const Ceiling = () => (
    <group>
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, H, 0]} receiveShadow>
        <planeGeometry args={[W, D]} />
        <primitive object={Materials.lightOakWood()} attach="material" />
      </mesh>
      
      <mesh position={[0, H - 0.05, 0]}>
        <boxGeometry args={[0.06, 0.015, Math.min(D * 0.7, 4)]} />
        <meshStandardMaterial 
          color="#2a2a2a" 
          emissive="#ffbb66" 
          emissiveIntensity={0.8}
        />
      </mesh>
      
      <pointLight position={[0, H - 0.15, 0]} intensity={0.8 * scaleY} distance={5 * scaleY} color="#ffe4b5" />
    </group>
  );

  const Walls = () => (
    <group>
      <mesh position={[0, H / 2, -D / 2]} receiveShadow>
        <planeGeometry args={[W, H]} />
        <primitive object={Materials.matteWhitePanel()} attach="material" />
      </mesh>
      
      <mesh position={[-W / 2, H / 2, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[D, H]} />
        <primitive object={Materials.matteWhitePanel()} attach="material" />
      </mesh>
      
      <mesh position={[W / 2, H / 2 + 0.8 * scaleY, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[D, H - 1.6 * scaleY]} />
        <primitive object={Materials.matteWhitePanel()} attach="material" />
      </mesh>
      
      <mesh position={[W / 2, 0.4 * scaleY, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[D, 0.8 * scaleY]} />
        <primitive object={Materials.matteWhitePanel()} attach="material" />
      </mesh>

      <mesh position={[-W * 0.3125, H / 2, D / 2]} rotation={[0, Math.PI, 0]} receiveShadow>
        <planeGeometry args={[W * 0.375, H]} />
        <primitive object={Materials.matteWhitePanel()} attach="material" />
      </mesh>

      <mesh position={[W * 0.3125, H / 2, D / 2]} rotation={[0, Math.PI, 0]} receiveShadow>
        <planeGeometry args={[W * 0.375, H]} />
        <primitive object={Materials.matteWhitePanel()} attach="material" />
      </mesh>

      <mesh position={[0, H - 0.4 * scaleY, D / 2]} rotation={[0, Math.PI, 0]} receiveShadow>
        <planeGeometry args={[W * 0.25, 0.8 * scaleY]} />
        <primitive object={Materials.matteWhitePanel()} attach="material" />
      </mesh>
    </group>
  );

  const Door = () => {
    const doorScale = Math.min(scaleX, scaleY, scaleZ);
    
    return (
      <group position={[0, 1.1 * scaleY, (D / 2) - (0.05 * scaleZ)]} scale={[doorScale, scaleY, 1]}>
        <mesh position={[0, 0, 0]} castShadow>
          <boxGeometry args={[2.0, 2.4, 0.06]} />
          <primitive object={Materials.darkWalnutWood()} attach="material" />
        </mesh>

        <mesh position={[0, 0.65, 0.04]}>
          <boxGeometry args={[1.85, 0.65, 0.015]} />
          <meshStandardMaterial color="#4a3328" roughness={0.6} />
        </mesh>
        <mesh position={[0, -0.65, 0.04]}>
          <boxGeometry args={[1.85, 0.65, 0.015]} />
          <meshStandardMaterial color="#4a3328" roughness={0.6} />
        </mesh>

        <mesh position={[0.75, 0, 0.12]} castShadow>
          <cylinderGeometry args={[0.025, 0.025, 0.15, 16]} />
          <primitive object={Materials.goldMetal()} attach="material" />
        </mesh>
      </group>
    );
  };

  const WindowSection = () => {
    const windowWidth = Math.min(D * 0.5, 6.5);
    
    return (
      <group position={[(W / 2) - (0.1 * scaleX), H / 2, 0]} scale={[1, scaleY, Math.min(scaleZ, 1.2)]}>
        <mesh rotation={[0, -Math.PI / 2, 0]}>
          <planeGeometry args={[windowWidth, 2.4]} />
          <primitive object={Materials.clearGlass()} attach="material" />
        </mesh>
        
        {[0, 0.8, 1.6, 2.4].map((y, i) => (
          <mesh key={`h-${i}`} position={[0, y - 1.2, 0]} rotation={[0, -Math.PI / 2, 0]}>
            <boxGeometry args={[windowWidth, 0.035, 0.05]} />
            <primitive object={Materials.blackMatte()} attach="material" />
          </mesh>
        ))}

        <mesh position={[-0.15, 1.85, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.018, 0.018, windowWidth + 0.5, 24]} />
          <primitive object={Materials.brassMetal()} attach="material" />
        </mesh>
      </group>
    );
  };

  const TVWallSection = () => {
    const tvScale = Math.min(scaleX * 0.8, scaleY * 0.9);
    
    return (
      <group position={[0, 0, (-D / 2) + (0.2 * scaleZ)]} scale={[tvScale, scaleY, 1]}>
        <mesh position={[0, 1.5, -0.05]} castShadow>
          <boxGeometry args={[3.8, 2.2, 0.04]} />
          <primitive object={Materials.whiteMarble()} attach="material" />
        </mesh>
        
        <mesh position={[0, 1.5, 0]} castShadow>
          <boxGeometry args={[2.4, 1.35, 0.04]} />
          <primitive object={Materials.blackGlossy()} attach="material" />
        </mesh>
        
        <mesh position={[0, 1.5, 0.025]}>
          <planeGeometry args={[2.3, 1.3]} />
          <meshStandardMaterial 
            color="#0a0a0a" 
            emissive="#1a2a3a" 
            emissiveIntensity={0.15}
          />
        </mesh>
        
        <mesh position={[0, 0.55, -0.08]} castShadow>
          <boxGeometry args={[3.5, 0.12, 0.45]} />
          <primitive object={Materials.darkWalnutWood()} attach="material" />
        </mesh>
      </group>
    );
  };

  const ModularSofa = () => {
    const sofaScale = Math.min(scaleX * 0.9, scaleZ * 0.85);
    const posZ = furniture.layout === 'minimal' ? D * 0.15 : D * 0.18;
    
    return (
      <group position={[0, 0, posZ]} rotation={[0, Math.PI, 0]} scale={[sofaScale, scaleY, sofaScale]}>
        <mesh position={[0, 0.15, 0]} castShadow receiveShadow>
          <boxGeometry args={[3.2, 0.3, 1.1]} />
          <primitive object={Materials.darkWalnutWood()} attach="material" />
        </mesh>

        <group position={[0, 0.55, 0]}>
          {[-1.05, -0.35, 0.35, 1.05].map((x, i) => (
            <mesh key={i} position={[x, 0, 0]} castShadow receiveShadow>
              <boxGeometry args={[0.65, 0.25, 1.05]} />
              <primitive object={Materials.brownLeather()} attach="material" />
            </mesh>
          ))}
        </group>

        <group position={[0, 1.05, -0.48]}>
          {[-1.05, -0.35, 0.35, 1.05].map((x, i) => (
            <mesh key={i} position={[x, 0, 0]} castShadow receiveShadow>
              <boxGeometry args={[0.62, 0.7, 0.25]} />
              <meshStandardMaterial color="#6d4c41" roughness={0.4} />
            </mesh>
          ))}
        </group>

        {[-1.6, 1.6].map((x, i) => (
          <mesh key={i} position={[x, 0.6, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.16, 0.9, 1.1]} />
            <primitive object={Materials.brownLeather()} attach="material" />
          </mesh>
        ))}
      </group>
    );
  };

  const LoungeChair = () => {
    if (!furniture.loungeChair) return null;
    
    return (
      <group position={[W * 0.325, 0, D * 0.12]} scale={[scaleX * 0.9, scaleY, scaleZ * 0.9]}>
        <mesh position={[0, 0.42, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.95, 0.8, 0.9]} />
          <primitive object={Materials.creamFabric()} attach="material" />
        </mesh>
        
        {[[-0.38, -0.38], [0.38, -0.38], [-0.38, 0.38], [0.38, 0.38]].map(([x, z], i) => (
          <mesh key={i} position={[x, 0.16, z]} castShadow>
            <cylinderGeometry args={[0.022, 0.028, 0.32, 16]} />
            <primitive object={Materials.blackGlossy()} attach="material" />
          </mesh>
        ))}
      </group>
    );
  };

  const CoffeeTable = () => {
    if (!furniture.coffeeTable) return null;
    
    return (
      <group position={[0, 0, -D * 0.1]} scale={[scaleX * 0.85, scaleY, scaleZ * 0.85]}>
        <mesh position={[0, 0.42, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.3, 0.045, 0.75]} />
          <primitive object={Materials.darkWalnutWood()} attach="material" />
        </mesh>

        <mesh position={[0, 0.465, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.25, 0.02, 0.7]} />
          <primitive object={Materials.clearGlass()} attach="material" />
        </mesh>

        {[[-0.55, -0.32], [0.55, -0.32], [-0.55, 0.32], [0.55, 0.32]].map(([x, z], i) => (
          <mesh key={i} position={[x, 0.29, z]} castShadow>
            <cylinderGeometry args={[0.025, 0.04, 0.58, 16]} />
            <primitive object={Materials.darkWalnutWood()} attach="material" />
          </mesh>
        ))}
      </group>
    );
  };

  const SideTable = () => {
    if (!furniture.sideTable) return null;
    
    return (
      <group position={[-W * 0.2875, 0, D * 0.05]} scale={[scaleX * 0.9, scaleY, scaleZ * 0.9]}>
        <mesh position={[0, 0.52, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.32, 0.32, 0.038, 32]} />
          <primitive object={Materials.darkWalnutWood()} attach="material" />
        </mesh>
        
        <mesh position={[0, 0.26, 0]} castShadow>
          <cylinderGeometry args={[0.045, 0.075, 0.52, 20]} />
          <primitive object={Materials.darkWalnutWood()} attach="material" />
        </mesh>
        
        <pointLight position={[0, 0.7, 0]} intensity={0.8} distance={2.5 * scaleY} color="#fff8e1" />
      </group>
    );
  };

  const Rug = () => {
    if (!furniture.rug) return null;
    
    const rugWidth = Math.min(W * 0.7, 4.5);
    const rugDepth = Math.min(D * 0.5, 3.5);
    
    return (
      <mesh 
        rotation={[-Math.PI / 2, 0, 0]} 
        position={[0, 0.008, D * 0.02]} 
        receiveShadow
      >
        <planeGeometry args={[rugWidth, rugDepth]} />
        <meshStandardMaterial color="#e8dcc8" roughness={0.98} />
      </mesh>
    );
  };

  const ArtworkSection = () => {
    if (!furniture.artwork) return null;
    
    return (
      <group position={[(-W / 2) + (0.08 * scaleX), H * 0.5, 0]} scale={[1, scaleY * 0.9, scaleY * 0.9]}>
        <mesh position={[0, 0.45, 0]} rotation={[0, Math.PI / 2, 0]} castShadow>
          <boxGeometry args={[1.25, 0.95, 0.04]} />
          <primitive object={Materials.blackMatte()} attach="material" />
        </mesh>
      </group>
    );
  };

  const FloorLamp = () => {
    if (!furniture.floorLamp) return null;
    
    return (
      <group position={[-W * 0.4125, 0, D * 0.38]} scale={[scaleX * 0.9, scaleY, scaleZ * 0.9]}>
        <mesh position={[0, 0.9, 0]} castShadow>
          <cylinderGeometry args={[0.018, 0.018, 1.7, 20]} />
          <meshStandardMaterial color="#2a2a2a" roughness={0.6} />
        </mesh>

        <pointLight position={[0, 1.7, 0]} intensity={1.5 * scaleY} distance={4.5 * scaleY} color="#fff8e1" />
      </group>
    );
  };

  const TallPlant = () => {
    if (!furniture.tallPlant) return null;
    
    return (
      <group position={[W * 0.4125, 0, -D * 0.42]} scale={[scaleX * 0.8, scaleY, scaleZ * 0.8]}>
        <mesh position={[0, 0.32, 0]} castShadow>
          <cylinderGeometry args={[0.16, 0.19, 0.64, 20]} />
          <meshStandardMaterial color="#3a2a1a" roughness={0.85} />
        </mesh>
        
        <mesh position={[0, 1.3, 0]}>
          <cylinderGeometry args={[0.028, 0.028, 1.96, 16]} />
          <meshStandardMaterial color="#2d5016" roughness={0.75} />
        </mesh>
      </group>
    );
  };

  const AmbientLighting = () => (
    <>
      <ambientLight intensity={0.4} color="#ffffff" />
      <hemisphereLight args={['#ffffff', '#f5f5f5', 0.3]} />
      
      <directionalLight
        position={[W * 0.75, H * 1.5, D * 0.3]}
        intensity={1.2}
        color="#fff8f0"
        castShadow
      />
      
      <pointLight position={[-W * 0.25, H * 0.7, D * 0.2]} intensity={0.6} distance={7 * scaleY} color="#fffbf5" />
    </>
  );

  return (
    <group>
      <AmbientLighting />
      
      {FloorComponent}
      <Ceiling />
      <Walls />
      <Door />
      <WindowSection />
      
      <TVWallSection />
      <ModularSofa />
      
      <LoungeChair />
      <CoffeeTable />
      <SideTable />
      <Rug />
      <ArtworkSection />
      <FloorLamp />
      <TallPlant />
      
      {quality !== 'low' && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 0]} receiveShadow>
          <planeGeometry args={[W, D]} />
          <shadowMaterial opacity={0.12} />
        </mesh>
      )}
    </group>
  );
};

export default LuxuryDrawingRoomScene;