
// import React, { useMemo } from 'react';
// import * as THREE from 'three';

// interface LuxuryDrawingRoomSceneProps {
//   floorTexture: THREE.Texture | null;
//   floorTileSize: { width: number; height: number };
//   quality: 'ultra' | 'high' | 'medium' | 'low';
// }

// // ============================================
// // MATERIALS LIBRARY - PRODUCTION READY
// // ============================================

// const Materials = {
//   // White Marble Floor - Reduced reflectivity
//   whiteMarble: () => new THREE.MeshPhysicalMaterial({
//     color: '#ffffff',
//     roughness: 0.25,
//     metalness: 0,
//     clearcoat: 0.3,
//     clearcoatRoughness: 0.2,
//     reflectivity: 0.3,
//     envMapIntensity: 0.5,
//   }),

//   // Matte White Panels
//   matteWhitePanel: () => new THREE.MeshStandardMaterial({
//     color: '#fafafa',
//     roughness: 0.9,
//     metalness: 0,
//   }),

//   // Light Oak Wood
//   lightOakWood: () => new THREE.MeshStandardMaterial({
//     color: '#d4a574',
//     roughness: 0.65,
//     metalness: 0,
//   }),

//   // Dark Walnut Wood
//   darkWalnutWood: () => new THREE.MeshStandardMaterial({
//     color: '#3e2723',
//     roughness: 0.5,
//     metalness: 0.1,
//   }),

//   // Black Matte
//   blackMatte: () => new THREE.MeshStandardMaterial({
//     color: '#1a1a1a',
//     roughness: 0.8,
//     metalness: 0.05,
//   }),

//   // Black Glossy (TV)
//   blackGlossy: () => new THREE.MeshPhysicalMaterial({
//     color: '#0a0a0a',
//     roughness: 0.1,
//     metalness: 0.9,
//     clearcoat: 1.0,
//   }),

//   // Clear Glass
//   clearGlass: () => new THREE.MeshPhysicalMaterial({
//     color: '#ffffff',
//     roughness: 0.05,
//     metalness: 0,
//     transmission: 0.96,
//     thickness: 0.5,
//     ior: 1.5,
//     transparent: true,
//     opacity: 0.15,
//   }),

//   // Brown Leather Sofa - Rich color
//   brownLeather: () => new THREE.MeshStandardMaterial({
//     color: '#6d4c41',
//     roughness: 0.4,
//     metalness: 0.1,
//     normalScale: new THREE.Vector2(0.5, 0.5),
//   }),

//   // Cream Fabric
//   creamFabric: () => new THREE.MeshStandardMaterial({
//     color: '#f5f5dc',
//     roughness: 0.95,
//     metalness: 0,
//   }),

//   // Beige Panel
//   beigePanel: () => new THREE.MeshStandardMaterial({
//     color: '#e8dcc8',
//     roughness: 0.8,
//     metalness: 0,
//   }),

//   // Cream Curtain - Luxurious
//   creamCurtain: () => new THREE.MeshStandardMaterial({
//     color: '#f8f6f0',
//     roughness: 0.98,
//     metalness: 0,
//     transparent: true,
//     opacity: 0.92,
//     side: THREE.DoubleSide,
//   }),

//   // Brass Metal
//   brassMetal: () => new THREE.MeshStandardMaterial({
//     color: '#b8860b',
//     roughness: 0.25,
//     metalness: 0.95,
//   }),

//   // Gold Metal
//   goldMetal: () => new THREE.MeshStandardMaterial({
//     color: '#d4af37',
//     roughness: 0.2,
//     metalness: 1.0,
//   }),
// };

// // ============================================
// // LUXURY DRAWING ROOM SCENE - PRODUCTION READY
// // ============================================

// export const LuxuryDrawingRoomScene: React.FC<LuxuryDrawingRoomSceneProps> = ({
//   floorTexture,
//   floorTileSize,
//   quality,
// }) => {
  
//   const roomWidth = 8;
//   const roomDepth = 10;
//   const roomHeight = 3.2;

//   // ============================================
//   // FLOOR - EXACT COLOR PRESERVATION
//   // ============================================
  
//   const FloorComponent = useMemo(() => {
//     if (floorTexture) {
//       const clonedTexture = floorTexture.clone();
//       clonedTexture.wrapS = THREE.RepeatWrapping;
//       clonedTexture.wrapT = THREE.RepeatWrapping;
//       clonedTexture.needsUpdate = true;
      
//       const tileSizeM = {
//         width: floorTileSize.width / 100,
//         height: floorTileSize.height / 100,
//       };
      
//       clonedTexture.repeat.set(
//         roomWidth / tileSizeM.width,
//         roomDepth / tileSizeM.height
//       );

//       // Use MeshStandardMaterial for accurate color reproduction
//       const material = new THREE.MeshStandardMaterial({
//         map: clonedTexture,
//         roughness: 0.3,
//         metalness: 0,
//         envMapIntensity: 0.2,
//       });

//       return (
//         <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
//           <planeGeometry args={[roomWidth, roomDepth, 1, 1]} />
//           <primitive object={material} attach="material" />
//         </mesh>
//       );
//     } else {
//       return (
//         <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
//           <planeGeometry args={[roomWidth, roomDepth]} />
//           <primitive object={Materials.whiteMarble()} attach="material" />
//         </mesh>
//       );
//     }
//   }, [floorTexture, floorTileSize, roomWidth, roomDepth]);

//   // ============================================
//   // CEILING - WOODEN
//   // ============================================
  
//   const Ceiling = () => (
//     <group>
//       <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, roomHeight, 0]} receiveShadow>
//         <planeGeometry args={[roomWidth, roomDepth]} />
//         <primitive object={Materials.lightOakWood()} attach="material" />
//       </mesh>
      
//       {/* LED strip - subtle */}
//       <mesh position={[0, roomHeight - 0.05, 0]}>
//         <boxGeometry args={[0.06, 0.015, roomDepth * 0.7]} />
//         <meshStandardMaterial 
//           color="#2a2a2a" 
//           emissive="#ffbb66" 
//           emissiveIntensity={0.8}
//         />
//       </mesh>
      
//       <pointLight position={[0, roomHeight - 0.15, 0]} intensity={0.8} distance={5} color="#ffe4b5" />
//       <pointLight position={[0, roomHeight - 0.15, 2]} intensity={0.8} distance={5} color="#ffe4b5" />
//       <pointLight position={[0, roomHeight - 0.15, -2]} intensity={0.8} distance={5} color="#ffe4b5" />
//     </group>
//   );

//   // ============================================
//   // WALLS WITH DOOR
//   // ============================================
  
//   const Walls = () => (
//     <group>
//       {/* Back wall - TV wall */}
//       <mesh position={[0, roomHeight / 2, -roomDepth / 2]} receiveShadow>
//         <planeGeometry args={[roomWidth, roomHeight]} />
//         <primitive object={Materials.matteWhitePanel()} attach="material" />
//       </mesh>
      
//       {/* Left wall */}
//       <mesh position={[-roomWidth / 2, roomHeight / 2, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
//         <planeGeometry args={[roomDepth, roomHeight]} />
//         <primitive object={Materials.matteWhitePanel()} attach="material" />
//       </mesh>
      
//       {/* Right wall - Window area */}
//       <mesh position={[roomWidth / 2, roomHeight / 2 + 0.8, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
//         <planeGeometry args={[roomDepth, roomHeight - 1.6]} />
//         <primitive object={Materials.matteWhitePanel()} attach="material" />
//       </mesh>
      
//       <mesh position={[roomWidth / 2, 0.4, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
//         <planeGeometry args={[roomDepth, 0.8]} />
//         <primitive object={Materials.matteWhitePanel()} attach="material" />
//       </mesh>

//       {/* Front wall - with door space */}
//       <mesh position={[-2.5, roomHeight / 2, roomDepth / 2]} rotation={[0, Math.PI, 0]} receiveShadow>
//         <planeGeometry args={[3, roomHeight]} />
//         <primitive object={Materials.matteWhitePanel()} attach="material" />
//       </mesh>

//       <mesh position={[2.5, roomHeight / 2, roomDepth / 2]} rotation={[0, Math.PI, 0]} receiveShadow>
//         <planeGeometry args={[3, roomHeight]} />
//         <primitive object={Materials.matteWhitePanel()} attach="material" />
//       </mesh>

//       <mesh position={[0, roomHeight - 0.4, roomDepth / 2]} rotation={[0, Math.PI, 0]} receiveShadow>
//         <planeGeometry args={[2, 0.8]} />
//         <primitive object={Materials.matteWhitePanel()} attach="material" />
//       </mesh>
//     </group>
//   );

//   // ============================================
//   // DOOR - DETAILED
//   // ============================================
  
//   const Door = () => (
//     <group position={[0, 1.1, roomDepth / 2 - 0.05]}>
//       {/* Door frame */}
//       <mesh position={[0, 0, 0]} castShadow>
//         <boxGeometry args={[2.0, 2.4, 0.06]} />
//         <primitive object={Materials.darkWalnutWood()} attach="material" />
//       </mesh>

//       {/* Door panels - detailed */}
//       <mesh position={[0, 0.65, 0.04]}>
//         <boxGeometry args={[1.85, 0.65, 0.015]} />
//         <meshStandardMaterial color="#4a3328" roughness={0.6} />
//       </mesh>
//       <mesh position={[0, -0.65, 0.04]}>
//         <boxGeometry args={[1.85, 0.65, 0.015]} />
//         <meshStandardMaterial color="#4a3328" roughness={0.6} />
//       </mesh>

//       {/* Panel borders */}
//       <mesh position={[0, 0.65, 0.05]}>
//         <boxGeometry args={[1.75, 0.55, 0.01]} />
//         <meshStandardMaterial color="#3a2318" roughness={0.5} />
//       </mesh>
//       <mesh position={[0, -0.65, 0.05]}>
//         <boxGeometry args={[1.75, 0.55, 0.01]} />
//         <meshStandardMaterial color="#3a2318" roughness={0.5} />
//       </mesh>

//       {/* Door handle - gold */}
//       <mesh position={[0.75, 0, 0.12]} castShadow>
//         <cylinderGeometry args={[0.025, 0.025, 0.15, 16]} />
//         <primitive object={Materials.goldMetal()} attach="material" />
//       </mesh>
//       <mesh position={[0.75, 0, 0.1]} rotation={[0, 0, Math.PI / 2]} castShadow>
//         <cylinderGeometry args={[0.015, 0.015, 0.12, 16]} />
//         <primitive object={Materials.goldMetal()} attach="material" />
//       </mesh>

//       {/* Door base trim */}
//       <mesh position={[0, -1.15, 0.04]}>
//         <boxGeometry args={[1.95, 0.12, 0.02]} />
//         <primitive object={Materials.darkWalnutWood()} attach="material" />
//       </mesh>
//     </group>
//   );

//   // ============================================
//   // WINDOW WITH ENHANCED CURTAINS
//   // ============================================
  
//   const WindowSection = () => (
//     <group position={[roomWidth / 2 - 0.1, roomHeight / 2, 0]}>
//       {/* Glass panels */}
//       <mesh rotation={[0, -Math.PI / 2, 0]}>
//         <planeGeometry args={[6.5, 2.4]} />
//         <primitive object={Materials.clearGlass()} attach="material" />
//       </mesh>
      
//       {/* Window frames - black aluminum */}
//       {[0, 0.8, 1.6, 2.4].map((y, i) => (
//         <mesh key={`h-${i}`} position={[0, y - 1.2, 0]} rotation={[0, -Math.PI / 2, 0]}>
//           <boxGeometry args={[6.5, 0.035, 0.05]} />
//           <primitive object={Materials.blackMatte()} attach="material" />
//         </mesh>
//       ))}
      
//       {[-3.25, -1.625, 0, 1.625, 3.25].map((z, i) => (
//         <mesh key={`v-${i}`} position={[0, 0, z]} rotation={[0, -Math.PI / 2, 0]}>
//           <boxGeometry args={[0.035, 2.4, 0.05]} />
//           <primitive object={Materials.blackMatte()} attach="material" />
//         </mesh>
//       ))}

//       {/* ENHANCED CURTAINS - Left panel */}
//       <group position={[-0.2, 0.35, -3.5]}>
//         {/* Main curtain fabric with folds */}
//         {Array.from({ length: 12 }).map((_, i) => {
//           const xOffset = Math.sin(i * 0.5) * 0.08;
//           return (
//             <mesh 
//               key={`curtain-l-${i}`}
//               position={[xOffset, 0, i * 0.12]} 
//               rotation={[0, -Math.PI / 2 + Math.sin(i * 0.5) * 0.15, 0]}
//               castShadow
//               receiveShadow
//             >
//               <planeGeometry args={[0.11, 3.0]} />
//               <primitive object={Materials.creamCurtain()} attach="material" />
//             </mesh>
//           );
//         })}
//       </group>

//       {/* ENHANCED CURTAINS - Right panel */}
//       <group position={[-0.2, 0.35, 2.1]}>
//         {Array.from({ length: 12 }).map((_, i) => {
//           const xOffset = Math.sin(i * 0.5) * 0.08;
//           return (
//             <mesh 
//               key={`curtain-r-${i}`}
//               position={[xOffset, 0, i * 0.12]} 
//               rotation={[0, -Math.PI / 2 - Math.sin(i * 0.5) * 0.15, 0]}
//               castShadow
//               receiveShadow
//             >
//               <planeGeometry args={[0.11, 3.0]} />
//               <primitive object={Materials.creamCurtain()} attach="material" />
//             </mesh>
//           );
//         })}
//       </group>

//       {/* Curtain rod - brass */}
//       <mesh position={[-0.15, 1.85, 0]} rotation={[0, 0, Math.PI / 2]}>
//         <cylinderGeometry args={[0.018, 0.018, 7.5, 24]} />
//         <primitive object={Materials.brassMetal()} attach="material" />
//       </mesh>

//       {/* Decorative rod finials */}
//       <mesh position={[-0.15, 1.85, -3.75]}>
//         <sphereGeometry args={[0.055, 16, 16]} />
//         <primitive object={Materials.brassMetal()} attach="material" />
//       </mesh>
//       <mesh position={[-0.15, 1.85, 3.75]}>
//         <sphereGeometry args={[0.055, 16, 16]} />
//         <primitive object={Materials.brassMetal()} attach="material" />
//       </mesh>

//       {/* Curtain rings */}
//       {Array.from({ length: 15 }).map((_, i) => (
//         <mesh 
//           key={`ring-${i}`}
//           position={[-0.15, 1.85, -3.5 + i * 0.5]} 
//           rotation={[Math.PI / 2, 0, 0]}
//         >
//           <torusGeometry args={[0.03, 0.008, 12, 24]} />
//           <primitive object={Materials.brassMetal()} attach="material" />
//         </mesh>
//       ))}

//       {/* Sheer inner curtain layer */}
//       <mesh position={[-0.05, 0.3, 0]} rotation={[0, -Math.PI / 2, 0]}>
//         <planeGeometry args={[6, 2.8]} />
//         <meshStandardMaterial 
//           color="#ffffff" 
//           transparent 
//           opacity={0.25}
//           side={THREE.DoubleSide}
//           roughness={1.0}
//         />
//       </mesh>
      
//       {/* Venetian blinds - behind curtains */}
//       {Array.from({ length: 45 }).map((_, i) => (
//         <mesh 
//           key={`blind-${i}`} 
//           position={[0.03, 1.3 - (i * 0.06), 0]} 
//           rotation={[0, -Math.PI / 2, 0]}
//         >
//           <boxGeometry args={[6.0, 0.018, 0.04]} />
//           <meshStandardMaterial color="#2a2a2a" roughness={0.4} metalness={0.7} />
//         </mesh>
//       ))}
//     </group>
//   );

//   // ============================================
//   // TV WALL SECTION - PROFESSIONAL
//   // ============================================
  
//   const TVWallSection = () => (
//     <group position={[0, 0, -roomDepth / 2 + 0.2]}>
//       {/* Marble backdrop */}
//       <mesh position={[0, 1.5, -0.05]} castShadow>
//         <boxGeometry args={[3.8, 2.2, 0.04]} />
//         <primitive object={Materials.whiteMarble()} attach="material" />
//       </mesh>
      
//       {/* TV unit - ultra slim */}
//       <mesh position={[0, 1.5, 0]} castShadow>
//         <boxGeometry args={[2.4, 1.35, 0.04]} />
//         <primitive object={Materials.blackGlossy()} attach="material" />
//       </mesh>
      
//       {/* TV screen with subtle glow */}
//       <mesh position={[0, 1.5, 0.025]}>
//         <planeGeometry args={[2.3, 1.3]} />
//         <meshStandardMaterial 
//           color="#0a0a0a" 
//           emissive="#1a2a3a" 
//           emissiveIntensity={0.15}
//           roughness={0.05}
//         />
//       </mesh>
      
//       {/* Floating console - walnut */}
//       <mesh position={[0, 0.55, -0.08]} castShadow receiveShadow>
//         <boxGeometry args={[3.5, 0.12, 0.45]} />
//         <primitive object={Materials.darkWalnutWood()} attach="material" />
//       </mesh>
      
//       {/* Drawer fronts */}
//       <mesh position={[-1, 0.55, 0.15]}>
//         <boxGeometry args={[0.6, 0.08, 0.02]} />
//         <meshStandardMaterial color="#2a1810" roughness={0.5} />
//       </mesh>
//       <mesh position={[0, 0.55, 0.15]}>
//         <boxGeometry args={[0.6, 0.08, 0.02]} />
//         <meshStandardMaterial color="#2a1810" roughness={0.5} />
//       </mesh>
//       <mesh position={[1, 0.55, 0.15]}>
//         <boxGeometry args={[0.6, 0.08, 0.02]} />
//         <meshStandardMaterial color="#2a1810" roughness={0.5} />
//       </mesh>

//       {/* LED backlight */}
//       <mesh position={[0, 0.47, -0.08]}>
//         <boxGeometry args={[3.4, 0.015, 0.4]} />
//         <meshStandardMaterial 
//           color="#ffaa55" 
//           emissive="#ffaa55" 
//           emissiveIntensity={1.0}
//         />
//       </mesh>
      
//       <pointLight position={[-1.2, 0.5, -0.05]} intensity={1.2} distance={1.5} color="#ffcc88" />
//       <pointLight position={[0, 0.5, -0.05]} intensity={1.2} distance={1.5} color="#ffcc88" />
//       <pointLight position={[1.2, 0.5, -0.05]} intensity={1.2} distance={1.5} color="#ffcc88" />
      
//       {/* Decorative vase - left */}
//       <mesh position={[-1.5, 0.7, -0.05]} castShadow>
//         <cylinderGeometry args={[0.06, 0.08, 0.22, 20]} />
//         <meshStandardMaterial color="#1a1a1a" roughness={0.3} metalness={0.2} />
//       </mesh>
      
//       {/* Dried stems */}
//       {[-0.025, 0, 0.025].map((offset, i) => (
//         <mesh key={i} position={[-1.5 + offset, 1.1, -0.05]} castShadow>
//           <cylinderGeometry args={[0.004, 0.004, 0.8, 8]} />
//           <meshStandardMaterial color="#6b4423" roughness={0.85} />
//         </mesh>
//       ))}
      
//       {/* Books stack - right */}
//       {[0, 0.035, 0.07].map((y, i) => (
//         <mesh key={i} position={[1.4, 0.62 + y, -0.12]} castShadow>
//           <boxGeometry args={[0.18, 0.03, 0.24]} />
//           <meshStandardMaterial 
//             color={['#8b4513', '#654321', '#4a2f1a'][i]} 
//             roughness={0.75}
//           />
//         </mesh>
//       ))}

//       {/* Small plant - center */}
//       <mesh position={[0.5, 0.68, -0.05]} castShadow>
//         <cylinderGeometry args={[0.06, 0.05, 0.12, 16]} />
//         <meshStandardMaterial color="#2a2a2a" roughness={0.6} />
//       </mesh>
//       <mesh position={[0.5, 0.78, -0.05]} castShadow>
//         <sphereGeometry args={[0.08, 12, 12]} />
//         <meshStandardMaterial color="#2d5016" roughness={0.85} />
//       </mesh>
//     </group>
//   );

//   // ============================================
//   // BROWN LEATHER SOFA - HIGH QUALITY (TV की तरफ)
//   // ============================================
  
//   const ModularSofa = () => (
//     <group position={[0, 0, 0.8]} rotation={[0, Math.PI, 0]}>
//       {/* Main base - premium brown leather */}
//       <mesh position={[0, 0.4, 0]} castShadow receiveShadow>
//         <boxGeometry args={[3.8, 0.75, 1.3]} />
//         <primitive object={Materials.brownLeather()} attach="material" />
//       </mesh>

//       {/* Base cushion segments */}
//       {[-1.3, -0.43, 0.43, 1.3].map((x, i) => (
//         <mesh key={`base-${i}`} position={[x, 0.8, 0]} castShadow receiveShadow>
//           <boxGeometry args={[0.8, 0.22, 1.2]} />
//           <meshStandardMaterial color="#795548" roughness={0.5} />
//         </mesh>
//       ))}

//       {/* Back cushions - tufted effect */}
//       {[-1.3, -0.43, 0.43, 1.3].map((x, i) => (
//         <group key={`back-${i}`} position={[x, 1.15, -0.52]}>
//           <mesh castShadow receiveShadow>
//             <boxGeometry args={[0.75, 0.7, 0.28]} />
//             <meshStandardMaterial color="#6d4c41" roughness={0.45} />
//           </mesh>
          
//           {/* Tufting buttons */}
//           {[[-0.2, 0.15], [0.2, 0.15], [-0.2, -0.15], [0.2, -0.15]].map(([dx, dy], j) => (
//             <mesh key={j} position={[dx, dy, 0.15]}>
//               <sphereGeometry args={[0.025, 12, 12]} />
//               <meshStandardMaterial color="#5d4037" roughness={0.3} />
//             </mesh>
//           ))}
//         </group>
//       ))}

//       {/* Armrests - padded */}
//       <group position={[-1.9, 0.65, 0]}>
//         <mesh castShadow receiveShadow>
//           <boxGeometry args={[0.28, 1.0, 1.3]} />
//           <primitive object={Materials.brownLeather()} attach="material" />
//         </mesh>
//         {/* Armrest top padding */}
//         <mesh position={[0, 0.5, 0]} castShadow>
//           <boxGeometry args={[0.3, 0.12, 1.3]} />
//           <meshStandardMaterial color="#8d6e63" roughness={0.5} />
//         </mesh>
//       </group>

//       <group position={[1.9, 0.65, 0]}>
//         <mesh castShadow receiveShadow>
//           <boxGeometry args={[0.28, 1.0, 1.3]} />
//           <primitive object={Materials.brownLeather()} attach="material" />
//         </mesh>
//         <mesh position={[0, 0.5, 0]} castShadow>
//           <boxGeometry args={[0.3, 0.12, 1.3]} />
//           <meshStandardMaterial color="#8d6e63" roughness={0.5} />
//         </mesh>
//       </group>

//       {/* Decorative pillows */}
//       {[-0.85, 0.85].map((x, i) => (
//         <mesh key={i} position={[x, 1.05, -0.45]} rotation={[0.1, 0, 0]} castShadow>
//           <boxGeometry args={[0.42, 0.42, 0.18]} />
//           <meshStandardMaterial color="#f5f5dc" roughness={0.95} />
//         </mesh>
//       ))}

//       {/* Center decorative pillow - accent color */}
//       <mesh position={[0, 1.05, -0.48]} rotation={[0.1, 0.3, 0]} castShadow>
//         <boxGeometry args={[0.4, 0.4, 0.16]} />
//         <meshStandardMaterial color="#d4c4b0" roughness={0.9} />
//       </mesh>

//       {/* Wooden feet - walnut */}
//       {[
//         [-1.6, -0.5], [1.6, -0.5],
//         [-1.6, 0.5], [1.6, 0.5],
//         [-0.5, -0.5], [0.5, -0.5],
//         [-0.5, 0.5], [0.5, 0.5]
//       ].map(([x, z], i) => (
//         <mesh key={i} position={[x, 0.08, z]} castShadow>
//           <cylinderGeometry args={[0.035, 0.045, 0.16, 16]} />
//           <primitive object={Materials.darkWalnutWood()} attach="material" />
//         </mesh>
//       ))}
//     </group>
//   );

//   // ============================================
//   // COFFEE TABLE - PREMIUM QUALITY
//   // ============================================
  
//   const CoffeeTable = () => (
//     <group position={[0, 0, 2.5]}>
//       {/* Main top - dark walnut with bevel */}
//       <mesh position={[0, 0.42, 0]} castShadow receiveShadow>
//         <boxGeometry args={[1.3, 0.045, 0.75]} />
//         <primitive object={Materials.darkWalnutWood()} attach="material" />
//       </mesh>

//       {/* Beveled edge */}
//       <mesh position={[0, 0.445, 0]} castShadow>
//         <boxGeometry args={[1.32, 0.005, 0.77]} />
//         <meshStandardMaterial color="#2a1810" roughness={0.4} />
//       </mesh>

//       {/* Glass top layer - premium */}
//       <mesh position={[0, 0.465, 0]} castShadow receiveShadow>
//         <boxGeometry args={[1.25, 0.02, 0.7]} />
//         <primitive object={Materials.clearGlass()} attach="material" />
//       </mesh>

//       {/* Lower shelf with lip */}
//       <mesh position={[0, 0.16, 0]} receiveShadow>
//         <boxGeometry args={[1.2, 0.035, 0.65]} />
//         <primitive object={Materials.darkWalnutWood()} attach="material" />
//       </mesh>

//       {/* Shelf lip */}
//       <mesh position={[0, 0.18, 0.328]}>
//         <boxGeometry args={[1.22, 0.015, 0.015]} />
//         <meshStandardMaterial color="#2a1810" roughness={0.5} />
//       </mesh>
//       <mesh position={[0, 0.18, -0.328]}>
//         <boxGeometry args={[1.22, 0.015, 0.015]} />
//         <meshStandardMaterial color="#2a1810" roughness={0.5} />
//       </mesh>

//       {/* Legs - tapered modern */}
//       {[
//         [-0.55, -0.32], [0.55, -0.32],
//         [-0.55, 0.32], [0.55, 0.32]
//       ].map(([x, z], i) => (
//         <group key={i} position={[x, 0.29, z]}>
//           <mesh castShadow>
//             <cylinderGeometry args={[0.025, 0.04, 0.58, 16]} />
//             <primitive object={Materials.darkWalnutWood()} attach="material" />
//           </mesh>
//           {/* Brass cap on leg */}
//           <mesh position={[0, -0.29, 0]}>
//             <cylinderGeometry args={[0.041, 0.041, 0.015, 16]} />
//             <primitive object={Materials.brassMetal()} attach="material" />
//           </mesh>
//         </group>
//       ))}

//       {/* Table decorations - premium styling */}
//       {/* Ceramic vase - black */}
//       <mesh position={[-0.35, 0.52, 0.1]} castShadow>
//         <cylinderGeometry args={[0.055, 0.065, 0.18, 24]} />
//         <meshStandardMaterial color="#1a1a1a" roughness={0.2} metalness={0.3} />
//       </mesh>

//       {/* Small succulent plant */}
//       <mesh position={[-0.35, 0.63, 0.1]} castShadow>
//         <sphereGeometry args={[0.075, 12, 12]} />
//         <meshStandardMaterial color="#3d6b2e" roughness={0.8} />
//       </mesh>

//       {/* Coffee table books - stacked */}
//       {[0, 0.025, 0.05].map((y, i) => (
//         <mesh key={i} position={[0.28, 0.49 + y, -0.08]} rotation={[0, 0.3, 0]} castShadow>
//           <boxGeometry args={[0.22, 0.024, 0.3]} />
//           <meshStandardMaterial 
//             color={['#8b7355', '#6d5d4b', '#5a4a38'][i]} 
//             roughness={0.75}
//           />
//         </mesh>
//       ))}

//       {/* Decorative tray - brass */}
//       <mesh position={[0.05, 0.475, 0.22]} castShadow>
//         <cylinderGeometry args={[0.15, 0.15, 0.015, 32]} />
//         <primitive object={Materials.brassMetal()} attach="material" />
//       </mesh>

//       {/* Candle on tray */}
//       <mesh position={[0.05, 0.51, 0.22]} castShadow>
//         <cylinderGeometry args={[0.04, 0.04, 0.08, 24]} />
//         <meshStandardMaterial color="#f5deb3" roughness={0.7} />
//       </mesh>

//       {/* Candle flame glow */}
//       <pointLight position={[0.05, 0.58, 0.22]} intensity={0.5} distance={0.8} color="#ffaa44" />
//     </group>
//   );

//   // ============================================
//   // PLUSH LOUNGE CHAIR
//   // ============================================
  
//   const LoungeChair = () => (
//     <group position={[2.6, 0, 3]}>
//       <mesh position={[0, 0.42, 0]} castShadow receiveShadow>
//         <boxGeometry args={[0.95, 0.8, 0.9]} />
//         <primitive object={Materials.creamFabric()} attach="material" />
//       </mesh>
      
//       {Array.from({ length: 9 }).map((_, i) => (
//         <mesh 
//           key={i} 
//           position={[0, 0.88 + i * 0.075, -0.38 + i * 0.018]} 
//           castShadow
//         >
//           <boxGeometry args={[0.9, 0.095, 0.12]} />
//           <meshStandardMaterial color="#fafaf0" roughness={0.92} />
//         </mesh>
//       ))}
      
//       {Array.from({ length: 10 }).map((_, i) => (
//         <mesh 
//           key={`rib-${i}`} 
//           position={[-0.42 + i * 0.093, 0.52, 0.06]} 
//           castShadow
//         >
//           <boxGeometry args={[0.075, 0.75, 0.018]} />
//           <meshStandardMaterial color="#f0f0e8" roughness={0.88} />
//         </mesh>
//       ))}
      
//       {[[-0.38, -0.38], [0.38, -0.38], [-0.38, 0.38], [0.38, 0.38]].map(([x, z], i) => (
//         <mesh key={i} position={[x, 0.16, z]} castShadow>
//           <cylinderGeometry args={[0.022, 0.028, 0.32, 16]} />
//           <primitive object={Materials.blackGlossy()} attach="material" />
//         </mesh>
//       ))}
//     </group>
//   );

//   // ============================================
//   // SIDE TABLE - ELEGANT
//   // ============================================
  
//   const SideTable = () => (
//     <group position={[-2.3, 0, 2]}>
//       <mesh position={[0, 0.52, 0]} castShadow receiveShadow>
//         <cylinderGeometry args={[0.32, 0.32, 0.038, 32]} />
//         <primitive object={Materials.darkWalnutWood()} attach="material" />
//       </mesh>
      
//       <mesh position={[0, 0.26, 0]} castShadow>
//         <cylinderGeometry args={[0.045, 0.075, 0.52, 20]} />
//         <primitive object={Materials.darkWalnutWood()} attach="material" />
//       </mesh>
      
//       <mesh position={[0, 0.565, 0]} castShadow>
//         <cylinderGeometry args={[0.085, 0.09, 0.14, 20]} />
//         <meshStandardMaterial color="#f5f5dc" roughness={0.85} />
//       </mesh>
      
//       <mesh position={[0, 0.64, 0]}>
//         <sphereGeometry args={[0.025, 16, 16]} />
//         <meshStandardMaterial 
//           color="#ffddaa" 
//           emissive="#ffaa44"
//           emissiveIntensity={0.6}
//         />
//       </mesh>

//       <pointLight position={[0, 0.7, 0]} intensity={0.8} distance={2.5} color="#fff8e1" />
//     </group>
//   );

//   // ============================================
//   // FLOOR RUG - UNDER SOFA & TABLE
//   // ============================================
  
//   const Rug = () => (
//     <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.008, 1.8]} receiveShadow>
//       <planeGeometry args={[4.5, 3.5]} />
//       <meshStandardMaterial 
//         color="#e8dcc8" 
//         roughness={0.98}
//       />
//     </mesh>
//   );

//   // ============================================
//   // WALL ART - ABSTRACT FRAMES
//   // ============================================
  
//   const ArtworkSection = () => (
//     <group position={[-roomWidth / 2 + 0.08, 1.6, 0]}>
//       {/* Frame 1 */}
//       <mesh position={[0, 0.45, 0]} rotation={[0, Math.PI / 2, 0]} castShadow>
//         <boxGeometry args={[1.25, 0.95, 0.04]} />
//         <primitive object={Materials.blackMatte()} attach="material" />
//       </mesh>
//       <mesh position={[0.025, 0.45, 0]} rotation={[0, Math.PI / 2, 0]}>
//         <planeGeometry args={[1.2, 0.9]} />
//         <meshStandardMaterial color="#e8dcc8" roughness={0.95} />
//       </mesh>
      
//       <mesh position={[0.03, 0.7, -0.2]} rotation={[0, Math.PI / 2, 0]}>
//         <planeGeometry args={[0.55, 0.35]} />
//         <meshStandardMaterial color="#c8a882" roughness={0.98} />
//       </mesh>
//       <mesh position={[0.03, 0.25, 0.2]} rotation={[0, Math.PI / 2, 0]}>
//         <planeGeometry args={[0.55, 0.35]} />
//         <meshStandardMaterial color="#b87a5a" roughness={0.98} />
//       </mesh>
      
//       {/* Frame 2 */}
//       <mesh position={[0, -0.85, 0]} rotation={[0, Math.PI / 2, 0]} castShadow>
//         <boxGeometry args={[1.25, 0.95, 0.04]} />
//         <primitive object={Materials.blackMatte()} attach="material" />
//       </mesh>
//       <mesh position={[0.025, -0.85, 0]} rotation={[0, Math.PI / 2, 0]}>
//         <planeGeometry args={[1.2, 0.9]} />
//         <meshStandardMaterial color="#f0e8d8" roughness={0.95} />
//       </mesh>
      
//       <mesh position={[0.03, -0.6, -0.2]} rotation={[0, Math.PI / 2, 0]}>
//         <planeGeometry args={[0.55, 0.35]} />
//         <meshStandardMaterial color="#a67c52" roughness={0.98} />
//       </mesh>
//       <mesh position={[0.03, -1.1, 0.2]} rotation={[0, Math.PI / 2, 0]}>
//         <planeGeometry args={[0.55, 0.35]} />
//         <meshStandardMaterial color="#c49b7a" roughness={0.98} />
//       </mesh>
//     </group>
//   );

//   // ============================================
//   // FLOOR LAMP - CORNER
//   // ============================================
  
//   const FloorLamp = () => (
//     <group position={[-3.3, 0, 3.8]}>
//       <mesh position={[0, 0.05, 0]} castShadow>
//         <cylinderGeometry args={[0.16, 0.19, 0.1, 32]} />
//         <primitive object={Materials.blackMatte()} attach="material" />
//       </mesh>

//       <mesh position={[0, 0.9, 0]} castShadow>
//         <cylinderGeometry args={[0.018, 0.018, 1.7, 20]} />
//         <meshStandardMaterial color="#2a2a2a" roughness={0.6} metalness={0.3} />
//       </mesh>

//       <mesh position={[0, 1.78, 0]} castShadow>
//         <cylinderGeometry args={[0.28, 0.32, 0.45, 28, 1, true]} />
//         <meshStandardMaterial color="#f8f6f0" roughness={0.95} side={THREE.DoubleSide} />
//       </mesh>

//       <mesh position={[0, 1.8, 0]}>
//         <cylinderGeometry args={[0.29, 0.29, 0.015, 28]} />
//         <primitive object={Materials.brassMetal()} attach="material" />
//       </mesh>

//       <pointLight position={[0, 1.7, 0]} intensity={1.5} distance={4.5} color="#fff8e1" />
//     </group>
//   );

//   // ============================================
//   // TALL PLANT - CORNER DECORATION
//   // ============================================
  
//   const TallPlant = () => (
//     <group position={[3.3, 0, -4.2]}>
//       <mesh position={[0, 0.32, 0]} castShadow>
//         <cylinderGeometry args={[0.16, 0.19, 0.64, 20]} />
//         <meshStandardMaterial color="#3a2a1a" roughness={0.85} />
//       </mesh>
      
//       <mesh position={[0, 1.3, 0]}>
//         <cylinderGeometry args={[0.028, 0.028, 1.96, 16]} />
//         <meshStandardMaterial color="#2d5016" roughness={0.75} />
//       </mesh>
      
//       {Array.from({ length: 18 }).map((_, i) => {
//         const angle = (i / 18) * Math.PI * 2;
//         const height = 0.85 + i * 0.13;
//         return (
//           <mesh 
//             key={i} 
//             position={[
//               Math.cos(angle) * 0.22, 
//               height, 
//               Math.sin(angle) * 0.22
//             ]}
//             rotation={[0, angle, Math.PI / 3.5]}
//             castShadow
//           >
//             <boxGeometry args={[0.2, 0.32, 0.012]} />
//             <meshStandardMaterial color="#3d6b2e" roughness={0.65} />
//           </mesh>
//         );
//       })}
//     </group>
//   );

//   // ============================================
//   // OPTIMIZED LIGHTING - NO OVEREXPOSURE
//   // ============================================
  
//   const AmbientLighting = () => (
//     <>
//       {/* Reduced ambient to preserve texture colors */}
//       <ambientLight intensity={0.4} color="#ffffff" />
      
//       {/* Soft hemisphere */}
//       <hemisphereLight args={['#ffffff', '#f5f5f5', 0.3]} />
      
//       {/* Main directional - reduced intensity */}
//       <directionalLight
//         position={[6, 5, 3]}
//         intensity={1.2}
//         color="#fff8f0"
//         castShadow
//         shadow-mapSize={[2048, 2048]}
//         shadow-camera-left={-8}
//         shadow-camera-right={8}
//         shadow-camera-top={8}
//         shadow-camera-bottom={-8}
//         shadow-bias={-0.00005}
//       />
      
//       {/* Soft fill lights - very subtle */}
//       <pointLight position={[-2, 2.2, 2]} intensity={0.6} distance={7} color="#fffbf5" />
//       <pointLight position={[2, 2.2, -2]} intensity={0.6} distance={7} color="#fffbf5" />
      
//       {/* Window light - natural daylight */}
//       <rectAreaLight
//         position={[roomWidth / 2 - 0.3, roomHeight / 2, 0]}
//         width={6}
//         height={2.4}
//         intensity={1.8}
//         color="#f0f8ff"
//       />
//     </>
//   );

//   // ============================================
//   // CAMERA BOUNDARY CONSTRAINT (Invisible walls)
//   // ============================================
  
//   const CameraBoundaries = () => (
//     <>
//       {/* Invisible collision walls to keep camera inside */}
//       <mesh position={[0, roomHeight / 2, -roomDepth / 2]} visible={false}>
//         <boxGeometry args={[roomWidth, roomHeight, 0.1]} />
//         <meshBasicMaterial transparent opacity={0} />
//       </mesh>
      
//       <mesh position={[0, roomHeight / 2, roomDepth / 2]} visible={false}>
//         <boxGeometry args={[roomWidth, roomHeight, 0.1]} />
//         <meshBasicMaterial transparent opacity={0} />
//       </mesh>
      
//       <mesh position={[-roomWidth / 2, roomHeight / 2, 0]} visible={false}>
//         <boxGeometry args={[0.1, roomHeight, roomDepth]} />
//         <meshBasicMaterial transparent opacity={0} />
//       </mesh>
      
//       <mesh position={[roomWidth / 2, roomHeight / 2, 0]} visible={false}>
//         <boxGeometry args={[0.1, roomHeight, roomDepth]} />
//         <meshBasicMaterial transparent opacity={0} />
//       </mesh>
      
//       <mesh position={[0, roomHeight, 0]} visible={false}>
//         <boxGeometry args={[roomWidth, 0.1, roomDepth]} />
//         <meshBasicMaterial transparent opacity={0} />
//       </mesh>
      
//       <mesh position={[0, 0, 0]} visible={false}>
//         <boxGeometry args={[roomWidth, 0.1, roomDepth]} />
//         <meshBasicMaterial transparent opacity={0} />
//       </mesh>
//     </>
//   );

//   // ============================================
//   // RETURN COMPLETE SCENE - PRODUCTION READY
//   // ============================================

//   return (
//     <group>
//       {/* Optimized Lighting */}
//       <AmbientLighting />
      
//       {/* Room Structure */}
//       {FloorComponent}
//       <Ceiling />
//       <Walls />
//       <Door />
//       <WindowSection />
      
//       {/* Main Furniture - properly positioned */}
//       <TVWallSection />
//       <ModularSofa />
//       <CoffeeTable />
//       <LoungeChair />
      
//       {/* Accessories & Decor */}
//       <SideTable />
//       <Rug />
//       <ArtworkSection />
//       <FloorLamp />
//       <TallPlant />
      
//       {/* Camera Boundaries */}
//       <CameraBoundaries />
      
//       {/* Soft shadows */}
//       {quality !== 'low' && (
//         <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 0]} receiveShadow>
//           <planeGeometry args={[roomWidth, roomDepth]} />
//           <shadowMaterial opacity={0.12} />
//         </mesh>
//       )}
//     </group>
//   );
// };

// export default LuxuryDrawingRoomScene; 
import React, { useMemo } from 'react';
import * as THREE from 'three';

interface LuxuryDrawingRoomSceneProps {
  floorTexture: THREE.Texture | null;
  floorTileSize: { width: number; height: number };
  quality: 'ultra' | 'high' | 'medium' | 'low';
}

// ============================================
// MATERIALS LIBRARY - PRODUCTION READY
// ============================================

const Materials = {
  // White Marble Floor - Reduced reflectivity
  whiteMarble: () => new THREE.MeshPhysicalMaterial({
    color: '#ffffff',
    roughness: 0.25,
    metalness: 0,
    clearcoat: 0.3,
    clearcoatRoughness: 0.2,
    reflectivity: 0.3,
    envMapIntensity: 0.5,
  }),

  // Matte White Panels
  matteWhitePanel: () => new THREE.MeshStandardMaterial({
    color: '#fafafa',
    roughness: 0.9,
    metalness: 0,
  }),

  // Light Oak Wood
  lightOakWood: () => new THREE.MeshStandardMaterial({
    color: '#d4a574',
    roughness: 0.65,
    metalness: 0,
  }),

  // Dark Walnut Wood
  darkWalnutWood: () => new THREE.MeshStandardMaterial({
    color: '#3e2723',
    roughness: 0.5,
    metalness: 0.1,
  }),

  // Black Matte
  blackMatte: () => new THREE.MeshStandardMaterial({
    color: '#1a1a1a',
    roughness: 0.8,
    metalness: 0.05,
  }),

  // Black Glossy (TV)
  blackGlossy: () => new THREE.MeshPhysicalMaterial({
    color: '#0a0a0a',
    roughness: 0.1,
    metalness: 0.9,
    clearcoat: 1.0,
  }),

  // Clear Glass
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

  // Brown Leather Sofa - Rich color
  brownLeather: () => new THREE.MeshStandardMaterial({
    color: '#6d4c41',
    roughness: 0.4,
    metalness: 0.1,
    normalScale: new THREE.Vector2(0.5, 0.5),
  }),

  // Cream Fabric
  creamFabric: () => new THREE.MeshStandardMaterial({
    color: '#f5f5dc',
    roughness: 0.95,
    metalness: 0,
  }),

  // Beige Panel
  beigePanel: () => new THREE.MeshStandardMaterial({
    color: '#e8dcc8',
    roughness: 0.8,
    metalness: 0,
  }),

  // Cream Curtain - Luxurious
  creamCurtain: () => new THREE.MeshStandardMaterial({
    color: '#f8f6f0',
    roughness: 0.98,
    metalness: 0,
    transparent: true,
    opacity: 0.92,
    side: THREE.DoubleSide,
  }),

  // Brass Metal
  brassMetal: () => new THREE.MeshStandardMaterial({
    color: '#b8860b',
    roughness: 0.25,
    metalness: 0.95,
  }),

  // Gold Metal
  goldMetal: () => new THREE.MeshStandardMaterial({
    color: '#d4af37',
    roughness: 0.2,
    metalness: 1.0,
  }),
};

// ============================================
// LUXURY DRAWING ROOM SCENE - PRODUCTION READY
// ============================================

export const LuxuryDrawingRoomScene: React.FC<LuxuryDrawingRoomSceneProps> = ({
  floorTexture,
  floorTileSize,
  quality,
}) => {
  
  const roomWidth = 8;
  const roomDepth = 10;
  const roomHeight = 3.2;

  // ============================================
  // FLOOR - EXACT COLOR PRESERVATION
  // ============================================
  
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
        roomWidth / tileSizeM.width,
        roomDepth / tileSizeM.height
      );

      // Use MeshStandardMaterial for accurate color reproduction
      const material = new THREE.MeshStandardMaterial({
        map: clonedTexture,
        roughness: 0.3,
        metalness: 0,
        envMapIntensity: 0.2,
      });

      return (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
          <planeGeometry args={[roomWidth, roomDepth, 1, 1]} />
          <primitive object={material} attach="material" />
        </mesh>
      );
    } else {
      return (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
          <planeGeometry args={[roomWidth, roomDepth]} />
          <primitive object={Materials.whiteMarble()} attach="material" />
        </mesh>
      );
    }
  }, [floorTexture, floorTileSize, roomWidth, roomDepth]);

  // ============================================
  // CEILING - WOODEN
  // ============================================
  
  const Ceiling = () => (
    <group>
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, roomHeight, 0]} receiveShadow>
        <planeGeometry args={[roomWidth, roomDepth]} />
        <primitive object={Materials.lightOakWood()} attach="material" />
      </mesh>
      
      {/* LED strip - subtle */}
      <mesh position={[0, roomHeight - 0.05, 0]}>
        <boxGeometry args={[0.06, 0.015, roomDepth * 0.7]} />
        <meshStandardMaterial 
          color="#2a2a2a" 
          emissive="#ffbb66" 
          emissiveIntensity={0.8}
        />
      </mesh>
      
      <pointLight position={[0, roomHeight - 0.15, 0]} intensity={0.8} distance={5} color="#ffe4b5" />
      <pointLight position={[0, roomHeight - 0.15, 2]} intensity={0.8} distance={5} color="#ffe4b5" />
      <pointLight position={[0, roomHeight - 0.15, -2]} intensity={0.8} distance={5} color="#ffe4b5" />
    </group>
  );

  // ============================================
  // WALLS WITH DOOR
  // ============================================
  
  const Walls = () => (
    <group>
      {/* Back wall - TV wall */}
      <mesh position={[0, roomHeight / 2, -roomDepth / 2]} receiveShadow>
        <planeGeometry args={[roomWidth, roomHeight]} />
        <primitive object={Materials.matteWhitePanel()} attach="material" />
      </mesh>
      
      {/* Left wall */}
      <mesh position={[-roomWidth / 2, roomHeight / 2, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[roomDepth, roomHeight]} />
        <primitive object={Materials.matteWhitePanel()} attach="material" />
      </mesh>
      
      {/* Right wall - Window area */}
      <mesh position={[roomWidth / 2, roomHeight / 2 + 0.8, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[roomDepth, roomHeight - 1.6]} />
        <primitive object={Materials.matteWhitePanel()} attach="material" />
      </mesh>
      
      <mesh position={[roomWidth / 2, 0.4, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[roomDepth, 0.8]} />
        <primitive object={Materials.matteWhitePanel()} attach="material" />
      </mesh>

      {/* Front wall - with door space */}
      <mesh position={[-2.5, roomHeight / 2, roomDepth / 2]} rotation={[0, Math.PI, 0]} receiveShadow>
        <planeGeometry args={[3, roomHeight]} />
        <primitive object={Materials.matteWhitePanel()} attach="material" />
      </mesh>

      <mesh position={[2.5, roomHeight / 2, roomDepth / 2]} rotation={[0, Math.PI, 0]} receiveShadow>
        <planeGeometry args={[3, roomHeight]} />
        <primitive object={Materials.matteWhitePanel()} attach="material" />
      </mesh>

      <mesh position={[0, roomHeight - 0.4, roomDepth / 2]} rotation={[0, Math.PI, 0]} receiveShadow>
        <planeGeometry args={[2, 0.8]} />
        <primitive object={Materials.matteWhitePanel()} attach="material" />
      </mesh>
    </group>
  );

  // ============================================
  // DOOR - DETAILED
  // ============================================
  
  const Door = () => (
    <group position={[0, 1.1, roomDepth / 2 - 0.05]}>
      {/* Door frame */}
      <mesh position={[0, 0, 0]} castShadow>
        <boxGeometry args={[2.0, 2.4, 0.06]} />
        <primitive object={Materials.darkWalnutWood()} attach="material" />
      </mesh>

      {/* Door panels - detailed */}
      <mesh position={[0, 0.65, 0.04]}>
        <boxGeometry args={[1.85, 0.65, 0.015]} />
        <meshStandardMaterial color="#4a3328" roughness={0.6} />
      </mesh>
      <mesh position={[0, -0.65, 0.04]}>
        <boxGeometry args={[1.85, 0.65, 0.015]} />
        <meshStandardMaterial color="#4a3328" roughness={0.6} />
      </mesh>

      {/* Panel borders */}
      <mesh position={[0, 0.65, 0.05]}>
        <boxGeometry args={[1.75, 0.55, 0.01]} />
        <meshStandardMaterial color="#3a2318" roughness={0.5} />
      </mesh>
      <mesh position={[0, -0.65, 0.05]}>
        <boxGeometry args={[1.75, 0.55, 0.01]} />
        <meshStandardMaterial color="#3a2318" roughness={0.5} />
      </mesh>

      {/* Door handle - gold */}
      <mesh position={[0.75, 0, 0.12]} castShadow>
        <cylinderGeometry args={[0.025, 0.025, 0.15, 16]} />
        <primitive object={Materials.goldMetal()} attach="material" />
      </mesh>
      <mesh position={[0.75, 0, 0.1]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.015, 0.015, 0.12, 16]} />
        <primitive object={Materials.goldMetal()} attach="material" />
      </mesh>

      {/* Door base trim */}
      <mesh position={[0, -1.15, 0.04]}>
        <boxGeometry args={[1.95, 0.12, 0.02]} />
        <primitive object={Materials.darkWalnutWood()} attach="material" />
      </mesh>
    </group>
  );

  // ============================================
  // WINDOW WITH ENHANCED CURTAINS
  // ============================================
  
  const WindowSection = () => (
    <group position={[roomWidth / 2 - 0.1, roomHeight / 2, 0]}>
      {/* Glass panels */}
      <mesh rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[6.5, 2.4]} />
        <primitive object={Materials.clearGlass()} attach="material" />
      </mesh>
      
      {/* Window frames - black aluminum */}
      {[0, 0.8, 1.6, 2.4].map((y, i) => (
        <mesh key={`h-${i}`} position={[0, y - 1.2, 0]} rotation={[0, -Math.PI / 2, 0]}>
          <boxGeometry args={[6.5, 0.035, 0.05]} />
          <primitive object={Materials.blackMatte()} attach="material" />
        </mesh>
      ))}
      
      {[-3.25, -1.625, 0, 1.625, 3.25].map((z, i) => (
        <mesh key={`v-${i}`} position={[0, 0, z]} rotation={[0, -Math.PI / 2, 0]}>
          <boxGeometry args={[0.035, 2.4, 0.05]} />
          <primitive object={Materials.blackMatte()} attach="material" />
        </mesh>
      ))}

      {/* ENHANCED CURTAINS - Left panel */}
      <group position={[-0.2, 0.35, -3.5]}>
        {/* Main curtain fabric with folds */}
        {Array.from({ length: 12 }).map((_, i) => {
          const xOffset = Math.sin(i * 0.5) * 0.08;
          return (
            <mesh 
              key={`curtain-l-${i}`}
              position={[xOffset, 0, i * 0.12]} 
              rotation={[0, -Math.PI / 2 + Math.sin(i * 0.5) * 0.15, 0]}
              castShadow
              receiveShadow
            >
              <planeGeometry args={[0.11, 3.0]} />
              <primitive object={Materials.creamCurtain()} attach="material" />
            </mesh>
          );
        })}
      </group>

      {/* ENHANCED CURTAINS - Right panel */}
      <group position={[-0.2, 0.35, 2.1]}>
        {Array.from({ length: 12 }).map((_, i) => {
          const xOffset = Math.sin(i * 0.5) * 0.08;
          return (
            <mesh 
              key={`curtain-r-${i}`}
              position={[xOffset, 0, i * 0.12]} 
              rotation={[0, -Math.PI / 2 - Math.sin(i * 0.5) * 0.15, 0]}
              castShadow
              receiveShadow
            >
              <planeGeometry args={[0.11, 3.0]} />
              <primitive object={Materials.creamCurtain()} attach="material" />
            </mesh>
          );
        })}
      </group>

      {/* Curtain rod - brass */}
      <mesh position={[-0.15, 1.85, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.018, 0.018, 7.5, 24]} />
        <primitive object={Materials.brassMetal()} attach="material" />
      </mesh>

      {/* Decorative rod finials */}
      <mesh position={[-0.15, 1.85, -3.75]}>
        <sphereGeometry args={[0.055, 16, 16]} />
        <primitive object={Materials.brassMetal()} attach="material" />
      </mesh>
      <mesh position={[-0.15, 1.85, 3.75]}>
        <sphereGeometry args={[0.055, 16, 16]} />
        <primitive object={Materials.brassMetal()} attach="material" />
      </mesh>

      {/* Curtain rings */}
      {Array.from({ length: 15 }).map((_, i) => (
        <mesh 
          key={`ring-${i}`}
          position={[-0.15, 1.85, -3.5 + i * 0.5]} 
          rotation={[Math.PI / 2, 0, 0]}
        >
          <torusGeometry args={[0.03, 0.008, 12, 24]} />
          <primitive object={Materials.brassMetal()} attach="material" />
        </mesh>
      ))}

      {/* Sheer inner curtain layer */}
      <mesh position={[-0.05, 0.3, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[6, 2.8]} />
        <meshStandardMaterial 
          color="#ffffff" 
          transparent 
          opacity={0.25}
          side={THREE.DoubleSide}
          roughness={1.0}
        />
      </mesh>
      
      {/* Venetian blinds - behind curtains */}
      {Array.from({ length: 45 }).map((_, i) => (
        <mesh 
          key={`blind-${i}`} 
          position={[0.03, 1.3 - (i * 0.06), 0]} 
          rotation={[0, -Math.PI / 2, 0]}
        >
          <boxGeometry args={[6.0, 0.018, 0.04]} />
          <meshStandardMaterial color="#2a2a2a" roughness={0.4} metalness={0.7} />
        </mesh>
      ))}
    </group>
  );

  // ============================================
  // TV WALL SECTION - PROFESSIONAL
  // ============================================
  
  const TVWallSection = () => (
    <group position={[0, 0, -roomDepth / 2 + 0.2]}>
      {/* Marble backdrop */}
      <mesh position={[0, 1.5, -0.05]} castShadow>
        <boxGeometry args={[3.8, 2.2, 0.04]} />
        <primitive object={Materials.whiteMarble()} attach="material" />
      </mesh>
      
      {/* TV unit - ultra slim */}
      <mesh position={[0, 1.5, 0]} castShadow>
        <boxGeometry args={[2.4, 1.35, 0.04]} />
        <primitive object={Materials.blackGlossy()} attach="material" />
      </mesh>
      
      {/* TV screen with subtle glow */}
      <mesh position={[0, 1.5, 0.025]}>
        <planeGeometry args={[2.3, 1.3]} />
        <meshStandardMaterial 
          color="#0a0a0a" 
          emissive="#1a2a3a" 
          emissiveIntensity={0.15}
          roughness={0.05}
        />
      </mesh>
      
      {/* Floating console - walnut */}
      <mesh position={[0, 0.55, -0.08]} castShadow receiveShadow>
        <boxGeometry args={[3.5, 0.12, 0.45]} />
        <primitive object={Materials.darkWalnutWood()} attach="material" />
      </mesh>
      
      {/* Drawer fronts */}
      <mesh position={[-1, 0.55, 0.15]}>
        <boxGeometry args={[0.6, 0.08, 0.02]} />
        <meshStandardMaterial color="#2a1810" roughness={0.5} />
      </mesh>
      <mesh position={[0, 0.55, 0.15]}>
        <boxGeometry args={[0.6, 0.08, 0.02]} />
        <meshStandardMaterial color="#2a1810" roughness={0.5} />
      </mesh>
      <mesh position={[1, 0.55, 0.15]}>
        <boxGeometry args={[0.6, 0.08, 0.02]} />
        <meshStandardMaterial color="#2a1810" roughness={0.5} />
      </mesh>

      {/* LED backlight */}
      <mesh position={[0, 0.47, -0.08]}>
        <boxGeometry args={[3.4, 0.015, 0.4]} />
        <meshStandardMaterial 
          color="#ffaa55" 
          emissive="#ffaa55" 
          emissiveIntensity={1.0}
        />
      </mesh>
      
      <pointLight position={[-1.2, 0.5, -0.05]} intensity={1.2} distance={1.5} color="#ffcc88" />
      <pointLight position={[0, 0.5, -0.05]} intensity={1.2} distance={1.5} color="#ffcc88" />
      <pointLight position={[1.2, 0.5, -0.05]} intensity={1.2} distance={1.5} color="#ffcc88" />
      
      {/* Decorative vase - left */}
      <mesh position={[-1.5, 0.7, -0.05]} castShadow>
        <cylinderGeometry args={[0.06, 0.08, 0.22, 20]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.3} metalness={0.2} />
      </mesh>
      
      {/* Dried stems */}
      {[-0.025, 0, 0.025].map((offset, i) => (
        <mesh key={i} position={[-1.5 + offset, 1.1, -0.05]} castShadow>
          <cylinderGeometry args={[0.004, 0.004, 0.8, 8]} />
          <meshStandardMaterial color="#6b4423" roughness={0.85} />
        </mesh>
      ))}
      
      {/* Books stack - right */}
      {[0, 0.035, 0.07].map((y, i) => (
        <mesh key={i} position={[1.4, 0.62 + y, -0.12]} castShadow>
          <boxGeometry args={[0.18, 0.03, 0.24]} />
          <meshStandardMaterial 
            color={['#8b4513', '#654321', '#4a2f1a'][i]} 
            roughness={0.75}
          />
        </mesh>
      ))}

      {/* Small plant - center */}
      <mesh position={[0.5, 0.68, -0.05]} castShadow>
        <cylinderGeometry args={[0.06, 0.05, 0.12, 16]} />
        <meshStandardMaterial color="#2a2a2a" roughness={0.6} />
      </mesh>
      <mesh position={[0.5, 0.78, -0.05]} castShadow>
        <sphereGeometry args={[0.08, 12, 12]} />
        <meshStandardMaterial color="#2d5016" roughness={0.85} />
      </mesh>
    </group>
  );

  // ============================================
  // BROWN LEATHER SOFA - HIGH QUALITY (TV की तरफ)
  // ============================================
  
  const ModularSofa = () => (
    <group position={[0, 0, 0.8]} rotation={[0, Math.PI, 0]}>
      {/* Main base - premium brown leather */}
      <mesh position={[0, 0.4, 0]} castShadow receiveShadow>
        <boxGeometry args={[3.8, 0.75, 1.3]} />
        <primitive object={Materials.brownLeather()} attach="material" />
      </mesh>

      {/* Base cushion segments */}
      {[-1.3, -0.43, 0.43, 1.3].map((x, i) => (
        <mesh key={`base-${i}`} position={[x, 0.8, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.8, 0.22, 1.2]} />
          <meshStandardMaterial color="#795548" roughness={0.5} />
        </mesh>
      ))}

      {/* Back cushions - tufted effect */}
      {[-1.3, -0.43, 0.43, 1.3].map((x, i) => (
        <group key={`back-${i}`} position={[x, 1.15, -0.52]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[0.75, 0.7, 0.28]} />
            <meshStandardMaterial color="#6d4c41" roughness={0.45} />
          </mesh>
          
          {/* Tufting buttons */}
          {[[-0.2, 0.15], [0.2, 0.15], [-0.2, -0.15], [0.2, -0.15]].map(([dx, dy], j) => (
            <mesh key={j} position={[dx, dy, 0.15]}>
              <sphereGeometry args={[0.025, 12, 12]} />
              <meshStandardMaterial color="#5d4037" roughness={0.3} />
            </mesh>
          ))}
        </group>
      ))}

      {/* Armrests - padded */}
      <group position={[-1.9, 0.65, 0]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[0.28, 1.0, 1.3]} />
          <primitive object={Materials.brownLeather()} attach="material" />
        </mesh>
        {/* Armrest top padding */}
        <mesh position={[0, 0.5, 0]} castShadow>
          <boxGeometry args={[0.3, 0.12, 1.3]} />
          <meshStandardMaterial color="#8d6e63" roughness={0.5} />
        </mesh>
      </group>

      <group position={[1.9, 0.65, 0]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[0.28, 1.0, 1.3]} />
          <primitive object={Materials.brownLeather()} attach="material" />
        </mesh>
        <mesh position={[0, 0.5, 0]} castShadow>
          <boxGeometry args={[0.3, 0.12, 1.3]} />
          <meshStandardMaterial color="#8d6e63" roughness={0.5} />
        </mesh>
      </group>

      {/* Decorative pillows */}
      {[-0.85, 0.85].map((x, i) => (
        <mesh key={i} position={[x, 1.05, -0.45]} rotation={[0.1, 0, 0]} castShadow>
          <boxGeometry args={[0.42, 0.42, 0.18]} />
          <meshStandardMaterial color="#f5f5dc" roughness={0.95} />
        </mesh>
      ))}

      {/* Center decorative pillow - accent color */}
      <mesh position={[0, 1.05, -0.48]} rotation={[0.1, 0.3, 0]} castShadow>
        <boxGeometry args={[0.4, 0.4, 0.16]} />
        <meshStandardMaterial color="#d4c4b0" roughness={0.9} />
      </mesh>

      {/* Wooden feet - walnut */}
      {[
        [-1.6, -0.5], [1.6, -0.5],
        [-1.6, 0.5], [1.6, 0.5],
        [-0.5, -0.5], [0.5, -0.5],
        [-0.5, 0.5], [0.5, 0.5]
      ].map(([x, z], i) => (
        <mesh key={i} position={[x, 0.08, z]} castShadow>
          <cylinderGeometry args={[0.035, 0.045, 0.16, 16]} />
          <primitive object={Materials.darkWalnutWood()} attach="material" />
        </mesh>
      ))}
    </group>
  );

  // ============================================
  // ✅ COFFEE TABLE - FIXED POSITION (Sofa ke AAGE)
  // ============================================
  
  const CoffeeTable = () => (
    <group position={[0, 0, -1.0]}>  {/* ✅ CORRECTED: Between sofa & TV */}
      {/* Main top - dark walnut with bevel */}
      <mesh position={[0, 0.42, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.3, 0.045, 0.75]} />
        <primitive object={Materials.darkWalnutWood()} attach="material" />
      </mesh>

      {/* Beveled edge */}
      <mesh position={[0, 0.445, 0]} castShadow>
        <boxGeometry args={[1.32, 0.005, 0.77]} />
        <meshStandardMaterial color="#2a1810" roughness={0.4} />
      </mesh>

      {/* Glass top layer - premium */}
      <mesh position={[0, 0.465, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.25, 0.02, 0.7]} />
        <primitive object={Materials.clearGlass()} attach="material" />
      </mesh>

      {/* Lower shelf with lip */}
      <mesh position={[0, 0.16, 0]} receiveShadow>
        <boxGeometry args={[1.2, 0.035, 0.65]} />
        <primitive object={Materials.darkWalnutWood()} attach="material" />
      </mesh>

      {/* Shelf lip */}
      <mesh position={[0, 0.18, 0.328]}>
        <boxGeometry args={[1.22, 0.015, 0.015]} />
        <meshStandardMaterial color="#2a1810" roughness={0.5} />
      </mesh>
      <mesh position={[0, 0.18, -0.328]}>
        <boxGeometry args={[1.22, 0.015, 0.015]} />
        <meshStandardMaterial color="#2a1810" roughness={0.5} />
      </mesh>

      {/* Legs - tapered modern */}
      {[
        [-0.55, -0.32], [0.55, -0.32],
        [-0.55, 0.32], [0.55, 0.32]
      ].map(([x, z], i) => (
        <group key={i} position={[x, 0.29, z]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.025, 0.04, 0.58, 16]} />
            <primitive object={Materials.darkWalnutWood()} attach="material" />
          </mesh>
          {/* Brass cap on leg */}
          <mesh position={[0, -0.29, 0]}>
            <cylinderGeometry args={[0.041, 0.041, 0.015, 16]} />
            <primitive object={Materials.brassMetal()} attach="material" />
          </mesh>
        </group>
      ))}

      {/* Table decorations - premium styling */}
      {/* Ceramic vase - black */}
      <mesh position={[-0.35, 0.52, 0.1]} castShadow>
        <cylinderGeometry args={[0.055, 0.065, 0.18, 24]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.2} metalness={0.3} />
      </mesh>

      {/* Small succulent plant */}
      <mesh position={[-0.35, 0.63, 0.1]} castShadow>
        <sphereGeometry args={[0.075, 12, 12]} />
        <meshStandardMaterial color="#3d6b2e" roughness={0.8} />
      </mesh>

      {/* Coffee table books - stacked */}
      {[0, 0.025, 0.05].map((y, i) => (
        <mesh key={i} position={[0.28, 0.49 + y, -0.08]} rotation={[0, 0.3, 0]} castShadow>
          <boxGeometry args={[0.22, 0.024, 0.3]} />
          <meshStandardMaterial 
            color={['#8b7355', '#6d5d4b', '#5a4a38'][i]} 
            roughness={0.75}
          />
        </mesh>
      ))}

      {/* Decorative tray - brass */}
      <mesh position={[0.05, 0.475, 0.22]} castShadow>
        <cylinderGeometry args={[0.15, 0.15, 0.015, 32]} />
        <primitive object={Materials.brassMetal()} attach="material" />
      </mesh>

      {/* Candle on tray */}
      <mesh position={[0.05, 0.51, 0.22]} castShadow>
        <cylinderGeometry args={[0.04, 0.04, 0.08, 24]} />
        <meshStandardMaterial color="#f5deb3" roughness={0.7} />
      </mesh>

      {/* Candle flame glow */}
      <pointLight position={[0.05, 0.58, 0.22]} intensity={0.5} distance={0.8} color="#ffaa44" />
    </group>
  );

  // ============================================
  // PLUSH LOUNGE CHAIR
  // ============================================
  
  const LoungeChair = () => (
    <group position={[2.6, 0, 1.2]}>
      <mesh position={[0, 0.42, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.95, 0.8, 0.9]} />
        <primitive object={Materials.creamFabric()} attach="material" />
      </mesh>
      
      {Array.from({ length: 9 }).map((_, i) => (
        <mesh 
          key={i} 
          position={[0, 0.88 + i * 0.075, -0.38 + i * 0.018]} 
          castShadow
        >
          <boxGeometry args={[0.9, 0.095, 0.12]} />
          <meshStandardMaterial color="#fafaf0" roughness={0.92} />
        </mesh>
      ))}
      
      {Array.from({ length: 10 }).map((_, i) => (
        <mesh 
          key={`rib-${i}`} 
          position={[-0.42 + i * 0.093, 0.52, 0.06]} 
          castShadow
        >
          <boxGeometry args={[0.075, 0.75, 0.018]} />
          <meshStandardMaterial color="#f0f0e8" roughness={0.88} />
        </mesh>
      ))}
      
      {[[-0.38, -0.38], [0.38, -0.38], [-0.38, 0.38], [0.38, 0.38]].map(([x, z], i) => (
        <mesh key={i} position={[x, 0.16, z]} castShadow>
          <cylinderGeometry args={[0.022, 0.028, 0.32, 16]} />
          <primitive object={Materials.blackGlossy()} attach="material" />
        </mesh>
      ))}
    </group>
  );

  // ============================================
  // SIDE TABLE - ELEGANT
  // ============================================
  
  const SideTable = () => (
    <group position={[-2.3, 0, 0.5]}>
      <mesh position={[0, 0.52, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.32, 0.32, 0.038, 32]} />
        <primitive object={Materials.darkWalnutWood()} attach="material" />
      </mesh>
      
      <mesh position={[0, 0.26, 0]} castShadow>
        <cylinderGeometry args={[0.045, 0.075, 0.52, 20]} />
        <primitive object={Materials.darkWalnutWood()} attach="material" />
      </mesh>
      
      <mesh position={[0, 0.565, 0]} castShadow>
        <cylinderGeometry args={[0.085, 0.09, 0.14, 20]} />
        <meshStandardMaterial color="#f5f5dc" roughness={0.85} />
      </mesh>
      
      <mesh position={[0, 0.64, 0]}>
        <sphereGeometry args={[0.025, 16, 16]} />
        <meshStandardMaterial 
          color="#ffddaa" 
          emissive="#ffaa44"
          emissiveIntensity={0.6}
        />
      </mesh>

      <pointLight position={[0, 0.7, 0]} intensity={0.8} distance={2.5} color="#fff8e1" />
    </group>
  );

  // ============================================
  // FLOOR RUG - UNDER SOFA & TABLE
  // ============================================
  
  const Rug = () => (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.008, 0.2]} receiveShadow>
      <planeGeometry args={[4.5, 3.5]} />
      <meshStandardMaterial 
        color="#e8dcc8" 
        roughness={0.98}
      />
    </mesh>
  );

  // ============================================
  // WALL ART - ABSTRACT FRAMES
  // ============================================
  
  const ArtworkSection = () => (
    <group position={[-roomWidth / 2 + 0.08, 1.6, 0]}>
      {/* Frame 1 */}
      <mesh position={[0, 0.45, 0]} rotation={[0, Math.PI / 2, 0]} castShadow>
        <boxGeometry args={[1.25, 0.95, 0.04]} />
        <primitive object={Materials.blackMatte()} attach="material" />
      </mesh>
      <mesh position={[0.025, 0.45, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[1.2, 0.9]} />
        <meshStandardMaterial color="#e8dcc8" roughness={0.95} />
      </mesh>
      
      <mesh position={[0.03, 0.7, -0.2]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[0.55, 0.35]} />
        <meshStandardMaterial color="#c8a882" roughness={0.98} />
      </mesh>
      <mesh position={[0.03, 0.25, 0.2]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[0.55, 0.35]} />
        <meshStandardMaterial color="#b87a5a" roughness={0.98} />
      </mesh>
      
      {/* Frame 2 */}
      <mesh position={[0, -0.85, 0]} rotation={[0, Math.PI / 2, 0]} castShadow>
        <boxGeometry args={[1.25, 0.95, 0.04]} />
        <primitive object={Materials.blackMatte()} attach="material" />
      </mesh>
      <mesh position={[0.025, -0.85, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[1.2, 0.9]} />
        <meshStandardMaterial color="#f0e8d8" roughness={0.95} />
      </mesh>
      
      <mesh position={[0.03, -0.6, -0.2]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[0.55, 0.35]} />
        <meshStandardMaterial color="#a67c52" roughness={0.98} />
      </mesh>
      <mesh position={[0.03, -1.1, 0.2]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[0.55, 0.35]} />
        <meshStandardMaterial color="#c49b7a" roughness={0.98} />
      </mesh>
    </group>
  );

  // ============================================
  // FLOOR LAMP - CORNER
  // ============================================
  
  const FloorLamp = () => (
    <group position={[-3.3, 0, 3.8]}>
      <mesh position={[0, 0.05, 0]} castShadow>
        <cylinderGeometry args={[0.16, 0.19, 0.1, 32]} />
        <primitive object={Materials.blackMatte()} attach="material" />
      </mesh>

      <mesh position={[0, 0.9, 0]} castShadow>
        <cylinderGeometry args={[0.018, 0.018, 1.7, 20]} />
        <meshStandardMaterial color="#2a2a2a" roughness={0.6} metalness={0.3} />
      </mesh>

      <mesh position={[0, 1.78, 0]} castShadow>
        <cylinderGeometry args={[0.28, 0.32, 0.45, 28, 1, true]} />
        <meshStandardMaterial color="#f8f6f0" roughness={0.95} side={THREE.DoubleSide} />
      </mesh>

      <mesh position={[0, 1.8, 0]}>
        <cylinderGeometry args={[0.29, 0.29, 0.015, 28]} />
        <primitive object={Materials.brassMetal()} attach="material" />
      </mesh>

      <pointLight position={[0, 1.7, 0]} intensity={1.5} distance={4.5} color="#fff8e1" />
    </group>
  );

  // ============================================
  // TALL PLANT - CORNER DECORATION
  // ============================================
  
  const TallPlant = () => (
    <group position={[3.3, 0, -4.2]}>
      <mesh position={[0, 0.32, 0]} castShadow>
        <cylinderGeometry args={[0.16, 0.19, 0.64, 20]} />
        <meshStandardMaterial color="#3a2a1a" roughness={0.85} />
      </mesh>
      
      <mesh position={[0, 1.3, 0]}>
        <cylinderGeometry args={[0.028, 0.028, 1.96, 16]} />
        <meshStandardMaterial color="#2d5016" roughness={0.75} />
      </mesh>
      
      {Array.from({ length: 18 }).map((_, i) => {
        const angle = (i / 18) * Math.PI * 2;
        const height = 0.85 + i * 0.13;
        return (
          <mesh 
            key={i} 
            position={[
              Math.cos(angle) * 0.22, 
              height, 
              Math.sin(angle) * 0.22
            ]}
            rotation={[0, angle, Math.PI / 3.5]}
            castShadow
          >
            <boxGeometry args={[0.2, 0.32, 0.012]} />
            <meshStandardMaterial color="#3d6b2e" roughness={0.65} />
          </mesh>
        );
      })}
    </group>
  );

  // ============================================
  // OPTIMIZED LIGHTING - NO OVEREXPOSURE
  // ============================================
  
  const AmbientLighting = () => (
    <>
      {/* Reduced ambient to preserve texture colors */}
      <ambientLight intensity={0.4} color="#ffffff" />
      
      {/* Soft hemisphere */}
      <hemisphereLight args={['#ffffff', '#f5f5f5', 0.3]} />
      
      {/* Main directional - reduced intensity */}
      <directionalLight
        position={[6, 5, 3]}
        intensity={1.2}
        color="#fff8f0"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-8}
        shadow-camera-right={8}
        shadow-camera-top={8}
        shadow-camera-bottom={-8}
        shadow-bias={-0.00005}
      />
      
      {/* Soft fill lights - very subtle */}
      <pointLight position={[-2, 2.2, 2]} intensity={0.6} distance={7} color="#fffbf5" />
      <pointLight position={[2, 2.2, -2]} intensity={0.6} distance={7} color="#fffbf5" />
      
      {/* Window light - natural daylight */}
      <rectAreaLight
        position={[roomWidth / 2 - 0.3, roomHeight / 2, 0]}
        width={6}
        height={2.4}
        intensity={1.8}
        color="#f0f8ff"
      />
    </>
  );

  // ============================================
  // CAMERA BOUNDARY CONSTRAINT (Invisible walls)
  // ============================================
  
  const CameraBoundaries = () => (
    <>
      {/* Invisible collision walls to keep camera inside */}
      <mesh position={[0, roomHeight / 2, -roomDepth / 2]} visible={false}>
        <boxGeometry args={[roomWidth, roomHeight, 0.1]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>
      
      <mesh position={[0, roomHeight / 2, roomDepth / 2]} visible={false}>
        <boxGeometry args={[roomWidth, roomHeight, 0.1]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>
      
      <mesh position={[-roomWidth / 2, roomHeight / 2, 0]} visible={false}>
        <boxGeometry args={[0.1, roomHeight, roomDepth]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>
      
      <mesh position={[roomWidth / 2, roomHeight / 2, 0]} visible={false}>
        <boxGeometry args={[0.1, roomHeight, roomDepth]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>
      
      <mesh position={[0, roomHeight, 0]} visible={false}>
        <boxGeometry args={[roomWidth, 0.1, roomDepth]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>
      
      <mesh position={[0, 0, 0]} visible={false}>
        <boxGeometry args={[roomWidth, 0.1, roomDepth]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>
    </>
  );

  // ============================================
  // RETURN COMPLETE SCENE - PRODUCTION READY
  // ============================================

  return (
    <group>
      {/* Optimized Lighting */}
      <AmbientLighting />
      
      {/* Room Structure */}
      {FloorComponent}
      <Ceiling />
      <Walls />
      <Door />
      <WindowSection />
      
      {/* Main Furniture - properly positioned */}
      <TVWallSection />
      <ModularSofa />
      <CoffeeTable />  {/* ✅ Now in correct position */}
      {/* <LoungeChair /> */}
      
      {/* Accessories & Decor */}
      <SideTable />
      <Rug />
      <ArtworkSection />
      <FloorLamp />
      <TallPlant />
      
      {/* Camera Boundaries */}
      <CameraBoundaries />
      
      {/* Soft shadows */}
      {quality !== 'low' && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 0]} receiveShadow>
          <planeGeometry args={[roomWidth, roomDepth]} />
          <shadowMaterial opacity={0.12} />
        </mesh>
      )}
    </group>
  );
};

export default LuxuryDrawingRoomScene;