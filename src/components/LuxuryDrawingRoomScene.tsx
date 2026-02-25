

// export default LuxuryDrawingRoomScene;
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
  highlightBorders?: boolean;
}

// ✅ BIG LUXURY ROOM SIZE
const DEFAULT_ROOM_DIMENSIONS = {
  width: 85 * 0.3048,   // 24 feet (BIG)
  depth: 50 * 0.3048,   // 30 feet (BIG)
  height: 15 * 0.3048,  // 13 feet (HIGH)
};

// ✅ PREMIUM MATERIALS
const Materials = {
  // Floors
  premiumMarbleFloor: () => new THREE.MeshPhysicalMaterial({ 
    color: '#fdfcfa',
    roughness: 0.12,
    metalness: 0.08,
    clearcoat: 0.9,
    clearcoatRoughness: 0.08,
    reflectivity: 0.7,
  }),

  // Walls
  elegantWall: () => new THREE.MeshStandardMaterial({
    color: '#f5f3f0',
    roughness: 0.82,
    metalness: 0,
  }),

  accentWallPanel: () => new THREE.MeshStandardMaterial({
    color: '#e8e4df',
    roughness: 0.7,
    metalness: 0,
  }),

  wallMolding: () => new THREE.MeshStandardMaterial({
    color: '#ffffff',
    roughness: 0.35,
    metalness: 0,
  }),

  // Ceiling
  modernCeiling: () => new THREE.MeshStandardMaterial({
    color: '#ffffff',
    roughness: 0.88,
    metalness: 0,
  }),

  ceilingTray: () => new THREE.MeshStandardMaterial({
    color: '#f8f8f8',
    roughness: 0.85,
    metalness: 0,
  }),

  // Woods
  richWalnut: () => new THREE.MeshStandardMaterial({
    color: '#3d2817',
    roughness: 0.38,
    metalness: 0.15,
  }),

  darkOak: () => new THREE.MeshStandardMaterial({
    color: '#2d1810',
    roughness: 0.45,
    metalness: 0.12,
  }),

  // Metals
  brushedGold: () => new THREE.MeshStandardMaterial({
    color: '#d4af37',
    roughness: 0.28,
    metalness: 0.96,
  }),

  matteBlack: () => new THREE.MeshStandardMaterial({
    color: '#1a1a1a',
    roughness: 0.75,
    metalness: 0.08,
  }),

  chromeMetal: () => new THREE.MeshStandardMaterial({
    color: '#c8c8c8',
    roughness: 0.12,
    metalness: 1.0,
  }),

  // Glass
  crystalGlass: () => new THREE.MeshPhysicalMaterial({
    color: '#ffffff',
    roughness: 0.02,
    metalness: 0,
    transmission: 0.98,
    thickness: 0.5,
    ior: 1.52,
    transparent: true,
    opacity: 0.08,
  }),

  // Fabrics
  premiumLeather: () => new THREE.MeshStandardMaterial({
    color: '#5d4037',
    roughness: 0.32,
    metalness: 0.18,
  }),

  luxuryVelvet: () => new THREE.MeshStandardMaterial({
    color: '#8d6e63',
    roughness: 0.96,
    metalness: 0,
  }),

  silkCurtain: () => new THREE.MeshStandardMaterial({
    color: '#faf8f3',
    roughness: 0.58,
    metalness: 0.05,
    transparent: true,
    opacity: 0.86,
    side: THREE.DoubleSide,
  }),
};

export const LuxuryDrawingRoomScene: React.FC<LuxuryDrawingRoomSceneProps> = ({
  floorTexture,
  floorTileSize,
  quality,
  roomDimensions = DEFAULT_ROOM_DIMENSIONS,
  furnitureScale,
   highlightBorders = false
}) => {
  
  const { width: W, depth: D, height: H } = roomDimensions;
  
  const widthFeet = W / 0.3048;
  const depthFeet = D / 0.3048;
  const heightFeet = H / 0.3048;
  
  console.log(`🏰 Luxury Drawing Room: ${widthFeet.toFixed(1)}' × ${depthFeet.toFixed(1)}' × ${heightFeet.toFixed(1)}'`);
  console.log(`📐 Area: ${(widthFeet * depthFeet).toFixed(0)} sq.ft | Volume: ${(widthFeet * depthFeet * heightFeet).toFixed(0)} cu.ft`);

  // ✅ FLOOR WITH PREMIUM MARBLE OR CUSTOM TEXTURE
  // const FloorComponent = useMemo(() => {
  //   if (floorTexture) {
  //     const clonedTexture = floorTexture.clone();
  //     clonedTexture.wrapS = THREE.RepeatWrapping;
  //     clonedTexture.wrapT = THREE.RepeatWrapping;
  //     clonedTexture.needsUpdate = true;
      
  //     const tileSizeM = {
  //       width: floorTileSize.width / 100,
  //       height: floorTileSize.height / 100,
  //     };
      
  //     clonedTexture.repeat.set(
  //       W / tileSizeM.width,
  //       D / tileSizeM.height
  //     );

  //     const material = new THREE.MeshStandardMaterial({
  //       map: clonedTexture,
  //       roughness: 0.18,
  //       metalness: 0.12,
  //     });

  //     return (
  //       <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
  //         <planeGeometry args={[W, D, 1, 1]} />
  //         <primitive object={material} attach="material" />
  //       </mesh>
  //     );
  //   } else {
  //     return (
  //       <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
  //         <planeGeometry args={[W, D]} />
  //         <primitive object={Materials.premiumMarbleFloor()} attach="material" />
  //       </mesh>
  //     );
  //   }
  // },  [floorTexture, floorTileSize, W, D]);

// 📍 Line ~260 - REPLACE ENTIRE FloorComponent useMemo

// ✅ FLOOR WITH GRID SUPPORT
const FloorComponent = useMemo(() => {
  // Material creation
  let material: THREE.Material;
  
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

    material = new THREE.MeshStandardMaterial({
      map: clonedTexture,
      roughness: 0.18,
      metalness: 0.12,
    });
  } else {
    material = Materials.premiumMarbleFloor();
  }

  // ✅ Grid lines calculation
  const gridLines = (() => {
    if (!highlightBorders) return null;
    
    const tileSizeM = {
      width: floorTileSize.width / 100,
      height: floorTileSize.height / 100
    };
    
    const cols = Math.ceil(W / tileSizeM.width);
    const rows = Math.ceil(D / tileSizeM.height);
    
    const points: THREE.Vector3[] = [];
    
    // Vertical lines
    for (let i = 0; i <= cols; i++) {
      const x = -W/2 + i * tileSizeM.width;
      points.push(new THREE.Vector3(x, -D/2, 0.001));
      points.push(new THREE.Vector3(x, D/2, 0.001));
    }
    
    // Horizontal lines
    for (let i = 0; i <= rows; i++) {
      const y = -D/2 + i * tileSizeM.height;
      points.push(new THREE.Vector3(-W/2, y, 0.001));
      points.push(new THREE.Vector3(W/2, y, 0.001));
    }
    
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    return geometry;
  })();

  return (
    <group>
      {/* Main floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[W, D, 1, 1]} />
        <primitive object={material} attach="material" />
      </mesh>
      
      {/* ✅ Grid lines overlay */}
      {highlightBorders && gridLines && (
        <lineSegments rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
          <primitive object={gridLines} attach="geometry" />
          <lineBasicMaterial color="#000000" linewidth={2} opacity={0.8} transparent />
        </lineSegments>
      )}
    </group>
  );
}, [floorTexture, floorTileSize, W, D, highlightBorders]);  // ✅ ADD highlightBorders dependency

  // ✅ ENHANCED CEILING WITH TRAY DESIGN & CROWN MOLDING
  const EnhancedCeiling = () => (
    <group>
      {/* Main Ceiling */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, H, 0]} receiveShadow>
        <planeGeometry args={[W, D]} />
        <primitive object={Materials.modernCeiling()} attach="material" />
      </mesh>
      
      {/* Tray Ceiling (Recessed Center) */}
      <mesh position={[0, H - 0.18, 0]}>
        <boxGeometry args={[W * 0.65, 0.012, D * 0.65]} />
        <primitive object={Materials.ceilingTray()} attach="material" />
      </mesh>
      
      {/* Crown Molding (All Sides) */}
      <group>
        {/* Front & Back */}
        <mesh position={[0, H - 0.06, D / 2]} rotation={[-Math.PI / 2, 0, 0]}>
          <boxGeometry args={[W, 0.12, 0.1]} />
          <primitive object={Materials.wallMolding()} attach="material" />
        </mesh>
        
        <mesh position={[0, H - 0.06, -D / 2]} rotation={[-Math.PI / 2, 0, 0]}>
          <boxGeometry args={[W, 0.12, 0.1]} />
          <primitive object={Materials.wallMolding()} attach="material" />
        </mesh>
        
        {/* Left & Right */}
        <mesh position={[-W / 2, H - 0.06, 0]} rotation={[-Math.PI / 2, 0, Math.PI / 2]}>
          <boxGeometry args={[D, 0.12, 0.1]} />
          <primitive object={Materials.wallMolding()} attach="material" />
        </mesh>
        
        <mesh position={[W / 2, H - 0.06, 0]} rotation={[-Math.PI / 2, 0, Math.PI / 2]}>
          <boxGeometry args={[D, 0.12, 0.1]} />
          <primitive object={Materials.wallMolding()} attach="material" />
        </mesh>
      </group>
      
      {/* Cove Lighting (Indirect LED) */}
      <group position={[0, H - 0.22, 0]}>
        {/* Four Sides LED Strips */}
        <mesh position={[0, 0, D * 0.32]}>
          <boxGeometry args={[W * 0.6, 0.018, 0.045]} />
          <meshStandardMaterial 
            color="#ffffff" 
            emissive="#fff4e6" 
            emissiveIntensity={0.65}
          />
        </mesh>
        
        <mesh position={[0, 0, -D * 0.32]}>
          <boxGeometry args={[W * 0.6, 0.018, 0.045]} />
          <meshStandardMaterial 
            color="#ffffff" 
            emissive="#fff4e6" 
            emissiveIntensity={0.65}
          />
        </mesh>
        
        <mesh position={[W * 0.32, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
          <boxGeometry args={[D * 0.6, 0.018, 0.045]} />
          <meshStandardMaterial 
            color="#ffffff" 
            emissive="#fff4e6" 
            emissiveIntensity={0.65}
          />
        </mesh>
        
        <mesh position={[-W * 0.32, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
          <boxGeometry args={[D * 0.6, 0.018, 0.045]} />
          <meshStandardMaterial 
            color="#ffffff" 
            emissive="#fff4e6" 
            emissiveIntensity={0.65}
          />
        </mesh>
        
        {/* Cove Lights */}
        <pointLight position={[0, -0.12, D * 0.32]} intensity={0.9} distance={3.5} color="#fff8f0" />
        <pointLight position={[0, -0.12, -D * 0.32]} intensity={0.9} distance={3.5} color="#fff8f0" />
        <pointLight position={[W * 0.32, -0.12, 0]} intensity={0.9} distance={3.5} color="#fff8f0" />
        <pointLight position={[-W * 0.32, -0.12, 0]} intensity={0.9} distance={3.5} color="#fff8f0" />
      </group>
      
      {/* Modern Chandelier */}
      <Chandelier />
    </group>
  );

  // ✅ LUXURY CHANDELIER
  const Chandelier = () => (
    <group position={[0, H - 0.55, 0]}>
      {/* Main Body */}
      <mesh position={[0, 0, 0]} castShadow>
        <cylinderGeometry args={[0.09, 0.13, 0.32, 32]} />
        <primitive object={Materials.brushedGold()} attach="material" />
      </mesh>
      
      {/* Crystal Arms (6 arms) */}
      {[0, 60, 120, 180, 240, 300].map((angle, i) => {
        const rad = (angle * Math.PI) / 180;
        const x = Math.cos(rad) * 0.65;
        const z = Math.sin(rad) * 0.65;
        return (
          <group key={i} position={[x, -0.38, z]}>
            {/* Arm */}
            <mesh castShadow>
              <cylinderGeometry args={[0.016, 0.016, 0.52, 16]} />
              <primitive object={Materials.brushedGold()} attach="material" />
            </mesh>
            
            {/* Crystal Bulb */}
            {/* <mesh position={[0, -0.32, 0]} castShadow>
              <sphereGeometry args={[0.085, 24, 24]} />
              <primitive object={Materials.crystalGlass()} attach="material" />
            </mesh> */}
            
            <pointLight position={[0, -0.32, 0]} intensity={1.3} distance={8.5} color="#fff4e6" />
          </group>
        );
      })}
      
      {/* Center Main Light */}
      <pointLight position={[0, -0.55, 0]} intensity={2.8} distance={13} color="#fff8f0" />
    </group>
  );

  // ✅ ENHANCED WALLS WITH 3D PANELING & BASEBOARDS
  const EnhancedWalls = () => {
    const baseboardHeight = 0.16;
    
    return (
      <group>
        {/* BACK WALL (TV Wall) - Accent */}
        <mesh position={[0, H / 2, -D / 2]} receiveShadow>
          <planeGeometry args={[W, H]} />
          <primitive object={Materials.accentWallPanel()} attach="material" />
        </mesh>
        
        {/* 3D Wall Panels on TV Wall */}
        <group position={[0, H / 2, (-D / 2) + 0.025]}>
          {[
            [-W * 0.38, 0, W * 0.18],
            [-W * 0.19, 0, W * 0.18],
            [0, 0, W * 0.18],
            [W * 0.19, 0, W * 0.18],
            [W * 0.38, 0, W * 0.18],
          ].map(([x, y, width], i) => (
            <mesh key={i} position={[x, y, 0]} castShadow>
              <boxGeometry args={[width, H * 0.75, 0.045]} />
              <primitive object={Materials.accentWallPanel()} attach="material" />
            </mesh>
          ))}
        </group>
        
        {/* LEFT WALL */}
        <mesh position={[-W / 2, H / 2, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
          <planeGeometry args={[D, H]} />
          <primitive object={Materials.elegantWall()} attach="material" />
        </mesh>
        
        {/* RIGHT WALL (with window) */}
        <mesh position={[W / 2, (H / 2) + 1.3, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
          <planeGeometry args={[D, H - 2.6]} />
          <primitive object={Materials.elegantWall()} attach="material" />
        </mesh>
        
        <mesh position={[W / 2, 0.65, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
          <planeGeometry args={[D, 1.3]} />
          <primitive object={Materials.elegantWall()} attach="material" />
        </mesh>

        {/* FRONT WALL (with door) */}
        <mesh position={[-W * 0.36, H / 2, D / 2]} rotation={[0, Math.PI, 0]} receiveShadow>
          <planeGeometry args={[W * 0.28, H]} />
          <primitive object={Materials.elegantWall()} attach="material" />
        </mesh>

        <mesh position={[W * 0.36, H / 2, D / 2]} rotation={[0, Math.PI, 0]} receiveShadow>
          <planeGeometry args={[W * 0.28, H]} />
          <primitive object={Materials.elegantWall()} attach="material" />
        </mesh>

        <mesh position={[0, H - 0.52, D / 2]} rotation={[0, Math.PI, 0]} receiveShadow>
          <planeGeometry args={[W * 0.44, 1.04]} />
          <primitive object={Materials.elegantWall()} attach="material" />
        </mesh>
        
        {/* BASEBOARDS (All Walls) */}
        {[
          [0, baseboardHeight / 2, -D / 2, [0, 0, 0], [W, baseboardHeight, 0.055]],
          [-W / 2, baseboardHeight / 2, 0, [0, Math.PI / 2, 0], [D, baseboardHeight, 0.055]],
          [0, baseboardHeight / 2, D / 2, [0, Math.PI, 0], [W * 0.56, baseboardHeight, 0.055]],
        ].map(([x, y, z, rotation, size], i) => (
          <mesh 
            key={i} 
            position={[x as number, y as number, z as number]} 
            rotation={rotation as [number, number, number]}
          >
            <boxGeometry args={size as [number, number, number]} />
            <primitive object={Materials.wallMolding()} attach="material" />
          </mesh>
        ))}
      </group>
    );
  };

  // ✅ PREMIUM DOOR
  const PremiumDoor = () => (
    <group position={[0, 1.4, (D / 2) - 0.055]}>
      {/* Door Frame */}
      <mesh position={[0, 0, -0.085]} castShadow>
        <boxGeometry args={[2.32, 2.88, 0.125]} />
        <meshStandardMaterial color="#e0e0e0" roughness={0.38} />
      </mesh>
      
      {/* Door Panel */}
      <mesh position={[0, 0, 0]} castShadow>
        <boxGeometry args={[2.04, 2.68, 0.085]} />
        <primitive object={Materials.richWalnut()} attach="material" />
      </mesh>

      {/* Door Decorative Panels (4 panels) */}
      {[
        [-0.47, 0.85],
        [0.47, 0.85],
        [-0.47, -0.85],
        [0.47, -0.85],
      ].map(([x, y], i) => (
        <mesh key={i} position={[x, y, 0.048]} castShadow>
          <boxGeometry args={[0.78, 1.15, 0.022]} />
          <primitive object={Materials.darkOak()} attach="material" />
        </mesh>
      ))}

      {/* Door Handles (Both Sides) */}
      {[-1, 1].map((side, i) => (
        <group key={i} position={[0.78 * side, 0, 0.11 * side]}>
          <mesh castShadow>
            <boxGeometry args={[0.042, 0.19, 0.085]} />
            <primitive object={Materials.brushedGold()} attach="material" />
          </mesh>
        </group>
      ))}
    </group>
  );

  // ✅ LARGE WINDOW WITH CURTAINS
  const LargeWindow = () => {
    const windowWidth = Math.min(D * 0.62, 7.5);
    
    return (
      <group position={[(W / 2) - 0.055, H / 2, 0]}>
        {/* Window Glass */}
        <mesh rotation={[0, -Math.PI / 2, 0]}>
          <planeGeometry args={[windowWidth, 2.7]} />
          <primitive object={Materials.crystalGlass()} attach="material" />
        </mesh>
        
        {/* Horizontal Frames */}
        {[0, 1.35, 2.7].map((y, i) => (
          <mesh key={`h-${i}`} position={[0, y - 1.35, 0]} rotation={[0, -Math.PI / 2, 0]}>
            <boxGeometry args={[windowWidth, 0.052, 0.085]} />
            <primitive object={Materials.matteBlack()} attach="material" />
          </mesh>
        ))}
        
        {/* Vertical Frames */}
        {[-windowWidth / 2, -windowWidth / 3, 0, windowWidth / 3, windowWidth / 2].map((z, i) => (
          <mesh key={`v-${i}`} position={[0, 0, z]} rotation={[0, -Math.PI / 2, 0]}>
            <boxGeometry args={[0.052, 2.7, 0.085]} />
            <primitive object={Materials.matteBlack()} attach="material" />
          </mesh>
        ))}

        {/* Curtain Rod */}
        <mesh position={[-0.16, 1.52, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.024, 0.024, windowWidth + 0.65, 32]} />
          <primitive object={Materials.brushedGold()} attach="material" />
        </mesh>
        
        {/* Curtains (Left & Right) */}
        {[-1, 1].map((side, i) => (
          <mesh 
            key={i} 
            position={[-0.22, 0, side * (windowWidth / 2 - 0.32)]} 
            rotation={[0, -Math.PI / 2, 0]}
          >
            <planeGeometry args={[0.85, 2.92]} />
            <primitive object={Materials.silkCurtain()} attach="material" />
          </mesh>
        ))}
      </group>
    );
  };

  // ✅ PREMIUM TV WALL PANEL (Enhanced)
  // const PremiumTVPanel = () => (
  //   <group position={[0, 0, (-D / 2) + 0.18]}>
  //     {/* Background Marble Panel */}
  //     <mesh position={[0, 1.9, -0.085]} castShadow>
  //       <boxGeometry args={[6.2, 3.5, 0.055]} />
  //       <primitive object={Materials.premiumMarbleFloor()} attach="material" />
  //     </mesh>
      
  //     {/* Wooden Frame */}
  //     <mesh position={[0, 1.9, -0.055]} castShadow>
  //       <boxGeometry args={[5.5, 3.0, 0.035]} />
  //       <primitive object={Materials.richWalnut()} attach="material" />
  //     </mesh>
      
  //     {/* TV Screen */}
  //     <mesh position={[0, 1.9, 0]} castShadow>
  //       <boxGeometry args={[3.5, 2.0, 0.085]} />
  //       <primitive object={Materials.matteBlack()} attach="material" />
  //     </mesh>
      
  //     {/* TV Display (Screen Glow) */}
  //     <mesh position={[0, 1.9, 0.048]}>
  //       <planeGeometry args={[3.38, 1.92]} />
  //       <meshStandardMaterial 
  //         color="#0a0a0a" 
  //         emissive="#0f1f2f" 
  //         emissiveIntensity={0.22}
  //         roughness={0.08}
  //       />
  //     </mesh>
      
  //     {/* Soundbar */}
  //     <mesh position={[0, 0.82, 0.32]} castShadow>
  //       <boxGeometry args={[1.35, 0.085, 0.13]} />
  //       <primitive object={Materials.matteBlack()} attach="material" />
  //     </mesh>
      
  //     {/* TV Cabinet Base */}
  //     <mesh position={[0, 0.38, -0.055]} castShadow>
  //       <boxGeometry args={[5.8, 0.72, 0.55]} />
  //       <primitive object={Materials.richWalnut()} attach="material" />
  //     </mesh>
      
  //     {/* Cabinet Drawers */}
  //     {[-2.0, -0.65, 0.65, 2.0].map((x, i) => (
  //       <group key={i} position={[x, 0.38, 0.25]}>
  //         <mesh castShadow>
  //           <boxGeometry args={[1.15, 0.58, 0.032]} />
  //           <primitive object={Materials.darkOak()} attach="material" />
  //         </mesh>
          
  //         {/* Gold Handle */}
  //         <mesh position={[0, 0, 0.032]} rotation={[0, 0, Math.PI / 2]}>
  //           <cylinderGeometry args={[0.009, 0.009, 0.42, 16]} />
  //           <primitive object={Materials.brushedGold()} attach="material" />
  //         </mesh>
  //       </group>
  //     ))}
      
  //     {/* LED Under-lighting */}
  //     <mesh position={[0, 0.78, -0.055]}>
  //       <boxGeometry args={[5.6, 0.012, 0.45]} />
  //       <meshStandardMaterial 
  //         color="#ffffff" 
  //         emissive="#ffe4b5" 
  //         emissiveIntensity={0.58}
  //       />
  //     </mesh>
      
  //     <pointLight position={[0, 0.82, 0.22]} intensity={1.35} distance={4.5} color="#ffe4b5" />
  //   </group>
  // ); 

  // ✅ PREMIUM TV WALL PANEL (SMALLER SIZE)
const PremiumTVPanel = () => (
  <group position={[0, 0, (-D / 2) + 0.18]}>
    {/* Background Marble Panel - SMALLER */}
    <mesh position={[0, 1.6, -0.085]} castShadow>
      <boxGeometry args={[4.2, 2.6, 0.055]} />
      <primitive object={Materials.premiumMarbleFloor()} attach="material" />
    </mesh>
    
    {/* Wooden Frame - SMALLER */}
    <mesh position={[0, 1.6, -0.055]} castShadow>
      <boxGeometry args={[3.8, 2.2, 0.035]} />
      <primitive object={Materials.richWalnut()} attach="material" />
    </mesh>
    
    {/* TV Screen - SMALLER (50" instead of 75") */}
    <mesh position={[0, 1.6, 0]} castShadow>
      <boxGeometry args={[2.2, 1.3, 0.065]} />
      <primitive object={Materials.matteBlack()} attach="material" />
    </mesh>
    
    {/* TV Display (Screen Glow) - SMALLER */}
    <mesh position={[0, 1.6, 0.038]}>
      <planeGeometry args={[2.12, 1.22]} />
      <meshStandardMaterial 
        color="#0a0a0a" 
        emissive="#0f1f2f" 
        emissiveIntensity={0.22}
        roughness={0.08}
      />
    </mesh>
    
    {/* Soundbar - SMALLER */}
    <mesh position={[0, 0.68, 0.28]} castShadow>
      <boxGeometry args={[0.95, 0.065, 0.11]} />
      <primitive object={Materials.matteBlack()} attach="material" />
    </mesh>
    
    {/* TV Cabinet Base - SMALLER */}
    <mesh position={[0, 0.32, -0.055]} castShadow>
      <boxGeometry args={[4.0, 0.58, 0.48]} />
      <primitive object={Materials.richWalnut()} attach="material" />
    </mesh>
    
    {/* Cabinet Drawers - SMALLER (3 instead of 4) */}
    {[-1.2, 0, 1.2].map((x, i) => (
      <group key={i} position={[x, 0.32, 0.22]}>
        <mesh castShadow>
          <boxGeometry args={[1.05, 0.48, 0.028]} />
          <primitive object={Materials.darkOak()} attach="material" />
        </mesh>
        
        {/* Gold Handle - SMALLER */}
        <mesh position={[0, 0, 0.028]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.007, 0.007, 0.35, 16]} />
          <primitive object={Materials.brushedGold()} attach="material" />
        </mesh>
      </group>
    ))}
    
    {/* LED Under-lighting - SMALLER */}
    <mesh position={[0, 0.64, -0.055]}>
      <boxGeometry args={[3.8, 0.01, 0.38]} />
      <meshStandardMaterial 
        color="#ffffff" 
        emissive="#ffe4b5" 
        emissiveIntensity={0.58}
      />
    </mesh>
    
    <pointLight position={[0, 0.68, 0.19]} intensity={1.1} distance={3.5} color="#ffe4b5" />
  </group>
);


  // ✅ COMPACT LUXURY SOFA (Smaller Size)
  // const CompactLuxurySofa = () => {
  //   const sofaZ = D * 0.34; // Position in room
    
  //   return (
  //     <group position={[0, 0, sofaZ]} rotation={[0, Math.PI, 0]}>
  //       {/* Wooden Base */}
  //       <mesh position={[0, 0.19, 0]} castShadow receiveShadow>
  //         <boxGeometry args={[1.8, 0.28, 0.15]} />
  //         <primitive object={Materials.richWalnut()} attach="material" />
  //       </mesh>

  //       {/* Seat Cushions (5 segments - compact) */}
  //       <group position={[0, 0.68, 0]}>
  //         {[-1.52, -0.76, 0, 0.76, 1.52].map((x, i) => (
  //           <mesh key={i} position={[x, 0, 0]} castShadow receiveShadow>
  //             <boxGeometry args={[0.72, 0.32, 1.18]} />
  //             <primitive object={Materials.premiumLeather()} attach="material" />
  //           </mesh>
  //         ))}
  //       </group>

  //       {/* Back Cushions */}
  //       <group position={[0, 1.32, -0.58]}>
  //         {[-1.52, -0.76, 0, 0.76, 1.52].map((x, i) => (
  //           <mesh key={i} position={[x, 0, 0]} castShadow receiveShadow>
  //             <boxGeometry args={[0.7, 0.92, 0.28]} />
  //             <primitive object={Materials.premiumLeather()} attach="material" />
  //           </mesh>
  //         ))}
  //       </group>

  //       {/* Armrests */}
  //       {[-1.95, 1.95].map((x, i) => (
  //         <mesh key={i} position={[x, 0.78, 0]} castShadow receiveShadow>
  //           <boxGeometry args={[0.18, 1.12, 1.25]} />
  //           <primitive object={Materials.premiumLeather()} attach="material" />
  //         </mesh>
  //       ))}
        
  //       {/* Decorative Pillows */}
  //       {[-1.2, -0.4, 0.4, 1.2].map((x, i) => (
  //         <mesh 
  //           key={i} 
  //           position={[x, 1.0, -0.48]} 
  //           rotation={[0, 0, 0.12 * (i % 2 ? 1 : -1)]} 
  //           castShadow
  //         >
  //           <boxGeometry args={[0.48, 0.48, 0.16]} />
  //           <primitive object={Materials.luxuryVelvet()} attach="material" />
  //         </mesh>
  //       ))}
        
  //       {/* Chrome Legs */}
  //       <group position={[0, 0.08, 0]}>
  //         {[
  //           [-1.75, -0.55], [1.75, -0.55],
  //           [-1.75, 0.55], [1.75, 0.55]
  //         ].map(([x, z], i) => (
  //           <mesh key={i} position={[x, 0, z]} castShadow>
  //             <cylinderGeometry args={[0.028, 0.035, 0.16, 20]} />
  //             <primitive object={Materials.chromeMetal()} attach="material" />
  //           </mesh>
  //         ))}
  //       </group>
  //     </group>
  //   );
  // }; 
  const CompactLuxurySofa = () => {
  const sofaZ = D * 0.34; // Position in room
  
  return (
    <group position={[0, 0, sofaZ]} rotation={[0, Math.PI, 0]}>
      {/* Wooden Base - COMPACT 5-SEATER */}
      <mesh position={[0, 0.16, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.8, 0.32, 0.95]} />
        <primitive object={Materials.richWalnut()} attach="material" />
      </mesh>

      {/* Seat Cushions (5 segments - COMPACT SIZE) */}
      <group position={[0, 0.56, 0]}>
        {[-1.05, -0.525, 0, 0.525, 1.05].map((x, i) => (
          <mesh key={i} position={[x, 0, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.48, 0.26, 0.88]} />
            <primitive object={Materials.premiumLeather()} attach="material" />
          </mesh>
        ))}
      </group>

      {/* Back Cushions - LOWER HEIGHT */}
      <group position={[0, 1.08, -0.42]}>
        {[-1.05, -0.525, 0, 0.525, 1.05].map((x, i) => (
          <mesh key={i} position={[x, 0, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.46, 0.75, 0.24]} />
            <primitive object={Materials.premiumLeather()} attach="material" />
          </mesh>
        ))}
      </group>

      {/* Armrests - COMPACT */}
      {[-1.35, 1.35].map((x, i) => (
        <mesh key={i} position={[x, 0.65, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.14, 0.95, 0.95]} />
          <primitive object={Materials.premiumLeather()} attach="material" />
        </mesh>
      ))}
      
      {/* Decorative Pillows - 4 PILLOWS */}
      {[-0.85, -0.28, 0.28, 0.85].map((x, i) => (
        <mesh 
          key={i} 
          position={[x, 0.85, -0.36]} 
          rotation={[0, 0, 0.1 * (i % 2 ? 1 : -1)]} 
          castShadow
        >
          <boxGeometry args={[0.35, 0.35, 0.13]} />
          <primitive object={Materials.luxuryVelvet()} attach="material" />
        </mesh>
      ))}
      
      {/* Chrome Legs - ADJUSTED */}
      <group position={[0, 0.06, 0]}>
        {[
          [-1.2, -0.42], [1.2, -0.42],
          [-1.2, 0.42], [1.2, 0.42]
        ].map(([x, z], i) => (
          <mesh key={i} position={[x, 0, z]} castShadow>
            <cylinderGeometry args={[0.024, 0.03, 0.12, 20]} />
            <primitive object={Materials.chromeMetal()} attach="material" />
          </mesh>
        ))}
      </group>
    </group>
  );
};

  // ✅ ADVANCED LIGHTING SYSTEM
  const AdvancedLighting = () => (
    <>
      {/* Ambient Base */}
      <ambientLight intensity={0.38} color="#ffffff" />
      <hemisphereLight args={['#ffffff', '#f8f8f8', 0.42]} />
      
      {/* Main Directional (Sun through window) */}
      <directionalLight
        position={[W * 0.85, H * 2.2, D * 0.4]}
        intensity={1.65}
        color="#fff8f0"
        castShadow
        shadow-mapSize-width={quality === 'ultra' ? 4096 : quality === 'high' ? 2048 : 1024}
        shadow-mapSize-height={quality === 'ultra' ? 4096 : quality === 'high' ? 2048 : 1024}
        shadow-camera-far={60}
        shadow-camera-left={-12}
        shadow-camera-right={12}
        shadow-camera-top={12}
        shadow-camera-bottom={-12}
      />
      
      {/* Fill Lights */}
      <pointLight position={[-W * 0.32, H * 0.85, D * 0.28]} intensity={0.75} distance={11} color="#fffaf0" />
      <pointLight position={[W * 0.35, H * 0.65, -D * 0.32]} intensity={0.68} distance={9} color="#fff8f0" />
      
      {/* Accent Spotlight on TV */}
      <spotLight 
        position={[0, H - 0.35, -D * 0.48]} 
        angle={Math.PI / 5.5} 
        penumbra={0.55} 
        intensity={1.35} 
        castShadow
        target-position={[0, 1.8, -D / 2]}
      />
      
      {/* Window Ambient */}
      <rectAreaLight 
        position={[W / 2, H / 2, 0]} 
        width={4.5} 
        height={2.7} 
        intensity={0.88} 
        color="#e8f4fd"
      />
      
      {/* Corner Uplights */}
      <pointLight position={[-W * 0.45, 0.15, -D * 0.45]} intensity={0.55} distance={5} color="#fff4e6" />
      <pointLight position={[W * 0.45, 0.15, -D * 0.45]} intensity={0.55} distance={5} color="#fff4e6" />
    </>
  );

  return (
    <group>
      <AdvancedLighting />
      
      {/* Room Structure */}
      {FloorComponent}
      <EnhancedCeiling />
      <EnhancedWalls />
      <PremiumDoor />
      <LargeWindow />
      
      {/* Main Elements */}
      <PremiumTVPanel />
      <CompactLuxurySofa />
      
      {/* Shadow Catcher (Enhanced) */}
      {quality !== 'low' && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]} receiveShadow>
          <planeGeometry args={[W * 1.25, D * 1.25]} />
          <shadowMaterial opacity={0.16} />
        </mesh>
      )}
    </group>
  );
};

export default LuxuryDrawingRoomScene;