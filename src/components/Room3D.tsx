// import React, { useRef, useState } from 'react';
// import { Canvas, useFrame, useLoader } from '@react-three/fiber';
// import { OrbitControls, Environment } from '@react-three/drei';
// import * as THREE from 'three';
// import { useAppStore } from '../stores/appStore';

// // Furniture and fixtures components
// const Sofa: React.FC = () => (
//   <group position={[0, -1.5, -2]}>
//     <mesh position={[0, 0.3, 0]}>
//       <boxGeometry args={[3, 0.6, 1]} />
//       <meshStandardMaterial color="#4a5568" />
//     </mesh>
//     <mesh position={[0, 0.8, -0.3]}>
//       <boxGeometry args={[3, 0.8, 0.4]} />
//       <meshStandardMaterial color="#4a5568" />
//     </mesh>
//   </group>
// );

// const CoffeeTable: React.FC = () => (
//   <group position={[0, -1.8, 0]}>
//     <mesh position={[0, 0.4, 0]}>
//       <boxGeometry args={[1.5, 0.1, 0.8]} />
//       <meshStandardMaterial color="#8b4513" />
//     </mesh>
//     <mesh position={[-0.6, 0.2, -0.3]}>
//       <boxGeometry args={[0.1, 0.4, 0.1]} />
//       <meshStandardMaterial color="#8b4513" />
//     </mesh>
//     <mesh position={[0.6, 0.2, -0.3]}>
//       <boxGeometry args={[0.1, 0.4, 0.1]} />
//       <meshStandardMaterial color="#8b4513" />
//     </mesh>
//     <mesh position={[-0.6, 0.2, 0.3]}>
//       <boxGeometry args={[0.1, 0.4, 0.1]} />
//       <meshStandardMaterial color="#8b4513" />
//     </mesh>
//     <mesh position={[0.6, 0.2, 0.3]}>
//       <boxGeometry args={[0.1, 0.4, 0.1]} />
//       <meshStandardMaterial color="#8b4513" />
//     </mesh>
//   </group>
// );

// const Toilet: React.FC = () => (
//   <group position={[-2, -2, -2]}>
//     <mesh position={[0, 0.4, 0]}>
//       <boxGeometry args={[0.6, 0.8, 0.8]} />
//       <meshStandardMaterial color="#ffffff" />
//     </mesh>
//     <mesh position={[0, 0.9, -0.2]}>
//       <boxGeometry args={[0.5, 0.2, 0.4]} />
//       <meshStandardMaterial color="#ffffff" />
//     </mesh>
//   </group>
// );

// const Sink: React.FC = () => (
//   <group position={[2, -1.2, -2]}>
//     <mesh position={[0, 0.5, 0]}>
//       <boxGeometry args={[0.8, 0.2, 0.6]} />
//       <meshStandardMaterial color="#ffffff" />
//     </mesh>
//     <mesh position={[0, 0.3, 0]}>
//       <boxGeometry args={[0.9, 0.6, 0.7]} />
//       <meshStandardMaterial color="#8b4513" />
//     </mesh>
//   </group>
// );

// const KitchenCounter: React.FC = () => (
//   <group position={[0, -1.5, -3.5]}>
//     <mesh position={[0, 0.5, 0]}>
//       <boxGeometry args={[6, 1, 1]} />
//       <meshStandardMaterial color="#8b4513" />
//     </mesh>
//     <mesh position={[0, 1.05, 0]}>
//       <boxGeometry args={[6, 0.1, 1]} />
//       <meshStandardMaterial color="#2d3748" />
//     </mesh>
//   </group>
// );

// const Refrigerator: React.FC = () => (
//   <group position={[3, -0.5, -3.5]}>
//     <mesh position={[0, 0, 0]}>
//       <boxGeometry args={[1, 3, 1]} />
//       <meshStandardMaterial color="#e2e8f0" />
//     </mesh>
//   </group>
// );

// const HallRoom: React.FC<{ floorTileTexture?: string }> = ({ floorTileTexture }) => {
//   let floorTexture = null;
//   if (floorTileTexture) {
//     floorTexture = useLoader(THREE.TextureLoader, floorTileTexture);
//     floorTexture.wrapS = THREE.RepeatWrapping;
//     floorTexture.wrapT = THREE.RepeatWrapping;
//     floorTexture.repeat.set(8, 8);
//   }

//   return (
//     <group>
//       {/* Floor */}
//       <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -3, 0]}>
//         <planeGeometry args={[12, 12]} />
//         <meshStandardMaterial 
//           map={floorTexture} 
//           color={floorTexture ? 'white' : '#e5e5e5'}
//         />
//       </mesh>
      
//       {/* Ceiling */}
//       <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 3, 0]}>
//         <planeGeometry args={[12, 12]} />
//         <meshStandardMaterial color="#f8f8f8" />
//       </mesh>
      
//       {/* Back Wall */}
//       <mesh position={[0, 0, -6]} rotation={[0, 0, 0]}>
//         <planeGeometry args={[12, 6]} />
//         <meshStandardMaterial color="#f5f5f5" />
//       </mesh>
      
//       {/* Left Wall */}
//       <mesh position={[-6, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
//         <planeGeometry args={[12, 6]} />
//         <meshStandardMaterial color="#f5f5f5" />
//       </mesh>
      
//       {/* Right Wall */}
//       <mesh position={[6, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
//         <planeGeometry args={[12, 6]} />
//         <meshStandardMaterial color="#f5f5f5" />
//       </mesh>
      
//       {/* Front Wall (with opening for entrance) */}
//       <mesh position={[-3, 0, 6]} rotation={[0, Math.PI, 0]}>
//         <planeGeometry args={[6, 6]} />
//         <meshStandardMaterial color="#f5f5f5" />
//       </mesh>
//       <mesh position={[3, 0, 6]} rotation={[0, Math.PI, 0]}>
//         <planeGeometry args={[6, 6]} />
//         <meshStandardMaterial color="#f5f5f5" />
//       </mesh>
      
//       {/* Furniture */}
//       <Sofa />
//       <CoffeeTable />
//     </group>
//   );
// };

// const WashroomScene: React.FC<{ floorTileTexture?: string, wallTileTexture?: string }> = ({ 
//   floorTileTexture, 
//   wallTileTexture 
// }) => {
//   let floorTexture = null;
//   let wallTexture = null;
  
//   if (floorTileTexture) {
//     floorTexture = useLoader(THREE.TextureLoader, floorTileTexture);
//     floorTexture.wrapS = THREE.RepeatWrapping;
//     floorTexture.wrapT = THREE.RepeatWrapping;
//     floorTexture.repeat.set(6, 6);
//   }
  
//   if (wallTileTexture) {
//     wallTexture = useLoader(THREE.TextureLoader, wallTileTexture);
//     wallTexture.wrapS = THREE.RepeatWrapping;
//     wallTexture.wrapT = THREE.RepeatWrapping;
//     wallTexture.repeat.set(4, 3);
//   }

//   return (
//     <group>
//       {/* Floor */}
//       <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.5, 0]}>
//         <planeGeometry args={[8, 8]} />
//         <meshStandardMaterial 
//           map={floorTexture} 
//           color={floorTexture ? 'white' : '#e5e5e5'}
//         />
//       </mesh>
      
//       {/* Ceiling */}
//       <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 2.5, 0]}>
//         <planeGeometry args={[8, 8]} />
//         <meshStandardMaterial color="#f8f8f8" />
//       </mesh>
      
//       {/* Back Wall */}
//       <mesh position={[0, 0, -4]} rotation={[0, 0, 0]}>
//         <planeGeometry args={[8, 5]} />
//         <meshStandardMaterial 
//           map={wallTexture} 
//           color={wallTexture ? 'white' : '#f5f5f5'}
//         />
//       </mesh>
      
//       {/* Left Wall */}
//       <mesh position={[-4, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
//         <planeGeometry args={[8, 5]} />
//         <meshStandardMaterial 
//           map={wallTexture} 
//           color={wallTexture ? 'white' : '#f5f5f5'}
//         />
//       </mesh>
      
//       {/* Right Wall */}
//       <mesh position={[4, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
//         <planeGeometry args={[8, 5]} />
//         <meshStandardMaterial 
//           map={wallTexture} 
//           color={wallTexture ? 'white' : '#f5f5f5'}
//         />
//       </mesh>
      
//       {/* Front Wall */}
//       <mesh position={[0, 0, 4]} rotation={[0, Math.PI, 0]}>
//         <planeGeometry args={[8, 5]} />
//         <meshStandardMaterial 
//           map={wallTexture} 
//           color={wallTexture ? 'white' : '#f5f5f5'}
//         />
//       </mesh>
      
//       {/* Bathroom fixtures */}
//       <Toilet />
//       <Sink />
//     </group>
//   );
// };

// const KitchenScene: React.FC<{ floorTileTexture?: string, wallTileTexture?: string }> = ({ 
//   floorTileTexture, 
//   wallTileTexture 
// }) => {
//   let floorTexture = null;
//   let wallTexture = null;
  
//   if (floorTileTexture) {
//     floorTexture = useLoader(THREE.TextureLoader, floorTileTexture);
//     floorTexture.wrapS = THREE.RepeatWrapping;
//     floorTexture.wrapT = THREE.RepeatWrapping;
//     floorTexture.repeat.set(8, 8);
//   }
  
//   if (wallTileTexture) {
//     wallTexture = useLoader(THREE.TextureLoader, wallTileTexture);
//     wallTexture.wrapS = THREE.RepeatWrapping;
//     wallTexture.wrapT = THREE.RepeatWrapping;
//     wallTexture.repeat.set(6, 3);
//   }
  
//   return (
//     <group>
//       {/* Floor */}
//       <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.5, 0]}>
//         <planeGeometry args={[10, 10]} />
//         <meshStandardMaterial 
//           map={floorTexture} 
//           color={floorTexture ? 'white' : '#e5e5e5'}
//         />
//       </mesh>
      
//       {/* Ceiling */}
//       <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 2.5, 0]}>
//         <planeGeometry args={[10, 10]} />
//         <meshStandardMaterial color="#f8f8f8" />
//       </mesh>
      
//       {/* Back Wall (with backsplash area) */}
//       <mesh position={[0, 0, -5]} rotation={[0, 0, 0]}>
//         <planeGeometry args={[10, 5]} />
//         <meshStandardMaterial 
//           map={wallTexture} 
//           color={wallTexture ? 'white' : '#f5f5f5'}
//         />
//       </mesh>
      
//       {/* Left Wall */}
//       <mesh position={[-5, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
//         <planeGeometry args={[10, 5]} />
//         <meshStandardMaterial 
//           map={wallTexture} 
//           color={wallTexture ? 'white' : '#f5f5f5'}
//         />
//       </mesh>
      
//       {/* Right Wall */}
//       <mesh position={[5, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
//         <planeGeometry args={[10, 5]} />
//         <meshStandardMaterial 
//           map={wallTexture} 
//           color={wallTexture ? 'white' : '#f5f5f5'}
//         />
//       </mesh>
      
//       {/* Front Wall */}
//       <mesh position={[0, 0, 5]} rotation={[0, Math.PI, 0]}>
//         <planeGeometry args={[10, 5]} />
//         <meshStandardMaterial 
//           map={wallTexture} 
//           color={wallTexture ? 'white' : '#f5f5f5'}
//         />
//       </mesh>
      
//       {/* Kitchen fixtures */}
//       <KitchenCounter />
//       <Refrigerator />
//     </group>
//   );
// };

// export const Room3D: React.FC = () => {
//   const { selectedRoom, appliedTiles, currentShowroom } = useAppStore();
//   const [roomKey, setRoomKey] = useState('');

//   // Reset the room when selectedRoom changes
//   React.useEffect(() => {
//     if (selectedRoom) {
//       setRoomKey(`${selectedRoom.id}-${Date.now()}`);
//     }
//   }, [selectedRoom]);

//   if (!selectedRoom) {
//     return (
//       <div className="bg-gray-100 rounded-xl flex items-center justify-center h-96">
//         <p className="text-gray-500 text-lg">Select a room to view 3D preview</p>
//       </div>
//     );
//   }

//   const getTexture = (surface: string) => {
//     const tileId = appliedTiles[surface];
//     if (!tileId || !currentShowroom) return undefined;
    
//     const tile = currentShowroom.tiles.find(t => t.id === tileId);
//     return tile?.textureUrl;
//   };

//   const renderRoom = () => {
//     switch (selectedRoom.type) {
//       case 'hall':
//         return <HallRoom floorTileTexture={getTexture('floor')} />;
//       case 'washroom':
//         return (
//           <WashroomScene 
//             floorTileTexture={getTexture('floor')} 
//             wallTileTexture={getTexture('wall')} 
//           />
//         );
//       case 'kitchen':
//         return (
//           <KitchenScene 
//             floorTileTexture={getTexture('floor')} 
//             wallTileTexture={getTexture('wall')} 
//           />
//         );
//       default:
//         return <HallRoom floorTileTexture={getTexture('floor')} />;
//     }
//   };

//   return (
//     <div className="bg-white rounded-xl shadow-lg overflow-hidden">
//       <div className="h-[500px] relative">
//         <Canvas key={roomKey} camera={{ position: [0, 0, 0], fov: 75 }}>
//           <ambientLight intensity={0.4} />
//           <directionalLight position={[5, 5, 5]} intensity={0.6} />
//           <directionalLight position={[-5, 5, -5]} intensity={0.4} />
//           <pointLight position={[0, 2, 0]} intensity={0.3} />
          
//           {renderRoom()}
          
//           <OrbitControls 
//             enablePan={true}
//             enableZoom={true}
//             enableRotate={true}
//             maxPolarAngle={Math.PI * 0.8}
//             minPolarAngle={Math.PI * 0.2}
//             minDistance={0.5}
//             maxDistance={8}
//             target={[0, 0, 0]}
//           />
//           <Environment preset="apartment" />
//         </Canvas>
        
//         <div className="absolute top-4 left-4 bg-black/70 text-white px-3 py-2 rounded-lg">
//           <p className="font-semibold">{selectedRoom.name}</p>
//           <p className="text-sm opacity-90">360° View • Drag to look around • Scroll to zoom</p>
//         </div>
        
//         <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-2 rounded-lg text-sm">
//           <p>Applied Tiles:</p>
//           <p>Floor: {appliedTiles.floor ? 'Applied' : 'None'}</p>
//           {selectedRoom.type !== 'hall' && (
//             <p>Wall: {appliedTiles.wall ? 'Applied' : 'None'}</p>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };  
import React, { useRef, useState, useEffect, Suspense } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { OrbitControls, Environment, Html } from '@react-three/drei';
import * as THREE from 'three';
import { useAppStore } from '../stores/appStore';
import { Maximize2, Minimize2, RotateCcw, ZoomIn, ZoomOut, Move } from 'lucide-react';

// Furniture and fixtures components
const Sofa: React.FC = () => (
  <group position={[0, -1.5, -2]}>
    <mesh position={[0, 0.3, 0]} castShadow receiveShadow>
      <boxGeometry args={[3, 0.6, 1]} />
      <meshStandardMaterial color="#4a5568" />
    </mesh>
    <mesh position={[0, 0.8, -0.3]} castShadow receiveShadow>
      <boxGeometry args={[3, 0.8, 0.4]} />
      <meshStandardMaterial color="#4a5568" />
    </mesh>
  </group>
);

const CoffeeTable: React.FC = () => (
  <group position={[0, -1.8, 0]}>
    <mesh position={[0, 0.4, 0]} castShadow receiveShadow>
      <boxGeometry args={[1.5, 0.1, 0.8]} />
      <meshStandardMaterial color="#8b4513" />
    </mesh>
    <mesh position={[-0.6, 0.2, -0.3]} castShadow receiveShadow>
      <boxGeometry args={[0.1, 0.4, 0.1]} />
      <meshStandardMaterial color="#8b4513" />
    </mesh>
    <mesh position={[0.6, 0.2, -0.3]} castShadow receiveShadow>
      <boxGeometry args={[0.1, 0.4, 0.1]} />
      <meshStandardMaterial color="#8b4513" />
    </mesh>
    <mesh position={[-0.6, 0.2, 0.3]} castShadow receiveShadow>
      <boxGeometry args={[0.1, 0.4, 0.1]} />
      <meshStandardMaterial color="#8b4513" />
    </mesh>
    <mesh position={[0.6, 0.2, 0.3]} castShadow receiveShadow>
      <boxGeometry args={[0.1, 0.4, 0.1]} />
      <meshStandardMaterial color="#8b4513" />
    </mesh>
  </group>
);

const Toilet: React.FC = () => (
  <group position={[-2, -2, -2]}>
    <mesh position={[0, 0.4, 0]} castShadow receiveShadow>
      <boxGeometry args={[0.6, 0.8, 0.8]} />
      <meshStandardMaterial color="#ffffff" />
    </mesh>
    <mesh position={[0, 0.9, -0.2]} castShadow receiveShadow>
      <boxGeometry args={[0.5, 0.2, 0.4]} />
      <meshStandardMaterial color="#ffffff" />
    </mesh>
  </group>
);

const Sink: React.FC = () => (
  <group position={[2, -1.2, -2]}>
    <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
      <boxGeometry args={[0.8, 0.2, 0.6]} />
      <meshStandardMaterial color="#ffffff" />
    </mesh>
    <mesh position={[0, 0.3, 0]} castShadow receiveShadow>
      <boxGeometry args={[0.9, 0.6, 0.7]} />
      <meshStandardMaterial color="#8b4513" />
    </mesh>
  </group>
);

const KitchenCounter: React.FC = () => (
  <group position={[0, -1.5, -3.5]}>
    <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
      <boxGeometry args={[6, 1, 1]} />
      <meshStandardMaterial color="#8b4513" />
    </mesh>
    <mesh position={[0, 1.05, 0]} castShadow receiveShadow>
      <boxGeometry args={[6, 0.1, 1]} />
      <meshStandardMaterial color="#2d3748" />
    </mesh>
  </group>
);

const Refrigerator: React.FC = () => (
  <group position={[3, -0.5, -3.5]}>
    <mesh position={[0, 0, 0]} castShadow receiveShadow>
      <boxGeometry args={[1, 3, 1]} />
      <meshStandardMaterial color="#e2e8f0" />
    </mesh>
  </group>
);

// Loading fallback component
const LoadingFallback: React.FC = () => (
  <Html center>
    <div className="bg-white/90 backdrop-blur-sm px-6 py-4 rounded-lg shadow-lg flex flex-col items-center gap-3">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
      <p className="text-gray-700 font-medium text-sm sm:text-base">Loading 3D Room...</p>
    </div>
  </Html>
);

const HallRoom: React.FC<{ floorTileTexture?: string }> = ({ floorTileTexture }) => {
  let floorTexture = null;
  if (floorTileTexture) {
    try {
      floorTexture = useLoader(THREE.TextureLoader, floorTileTexture);
      floorTexture.wrapS = THREE.RepeatWrapping;
      floorTexture.wrapT = THREE.RepeatWrapping;
      floorTexture.repeat.set(8, 8);
      floorTexture.anisotropy = 16; // Better quality on angles
    } catch (error) {
      console.error('Error loading floor texture:', error);
    }
  }

  return (
    <group>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -3, 0]} receiveShadow>
        <planeGeometry args={[12, 12]} />
        <meshStandardMaterial 
          map={floorTexture} 
          color={floorTexture ? 'white' : '#e5e5e5'}
          roughness={0.8}
          metalness={0.2}
        />
      </mesh>
      
      {/* Ceiling */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 3, 0]}>
        <planeGeometry args={[12, 12]} />
        <meshStandardMaterial color="#f8f8f8" roughness={0.9} />
      </mesh>
      
      {/* Back Wall */}
      <mesh position={[0, 0, -6]} rotation={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[12, 6]} />
        <meshStandardMaterial color="#f5f5f5" roughness={0.9} />
      </mesh>
      
      {/* Left Wall */}
      <mesh position={[-6, 0, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[12, 6]} />
        <meshStandardMaterial color="#f5f5f5" roughness={0.9} />
      </mesh>
      
      {/* Right Wall */}
      <mesh position={[6, 0, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[12, 6]} />
        <meshStandardMaterial color="#f5f5f5" roughness={0.9} />
      </mesh>
      
      {/* Front Wall (with opening for entrance) */}
      <mesh position={[-3, 0, 6]} rotation={[0, Math.PI, 0]} receiveShadow>
        <planeGeometry args={[6, 6]} />
        <meshStandardMaterial color="#f5f5f5" roughness={0.9} />
      </mesh>
      <mesh position={[3, 0, 6]} rotation={[0, Math.PI, 0]} receiveShadow>
        <planeGeometry args={[6, 6]} />
        <meshStandardMaterial color="#f5f5f5" roughness={0.9} />
      </mesh>
      
      {/* Furniture */}
      <Sofa />
      <CoffeeTable />
    </group>
  );
};

const WashroomScene: React.FC<{ floorTileTexture?: string, wallTileTexture?: string }> = ({ 
  floorTileTexture, 
  wallTileTexture 
}) => {
  let floorTexture = null;
  let wallTexture = null;
  
  if (floorTileTexture) {
    try {
      floorTexture = useLoader(THREE.TextureLoader, floorTileTexture);
      floorTexture.wrapS = THREE.RepeatWrapping;
      floorTexture.wrapT = THREE.RepeatWrapping;
      floorTexture.repeat.set(6, 6);
      floorTexture.anisotropy = 16;
    } catch (error) {
      console.error('Error loading floor texture:', error);
    }
  }
  
  if (wallTileTexture) {
    try {
      wallTexture = useLoader(THREE.TextureLoader, wallTileTexture);
      wallTexture.wrapS = THREE.RepeatWrapping;
      wallTexture.wrapT = THREE.RepeatWrapping;
      wallTexture.repeat.set(4, 3);
      wallTexture.anisotropy = 16;
    } catch (error) {
      console.error('Error loading wall texture:', error);
    }
  }

  return (
    <group>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.5, 0]} receiveShadow>
        <planeGeometry args={[8, 8]} />
        <meshStandardMaterial 
          map={floorTexture} 
          color={floorTexture ? 'white' : '#e5e5e5'}
          roughness={0.7}
          metalness={0.3}
        />
      </mesh>
      
      {/* Ceiling */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 2.5, 0]}>
        <planeGeometry args={[8, 8]} />
        <meshStandardMaterial color="#f8f8f8" roughness={0.9} />
      </mesh>
      
      {/* Back Wall */}
      <mesh position={[0, 0, -4]} rotation={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[8, 5]} />
        <meshStandardMaterial 
          map={wallTexture} 
          color={wallTexture ? 'white' : '#f5f5f5'}
          roughness={0.7}
          metalness={0.2}
        />
      </mesh>
      
      {/* Left Wall */}
      <mesh position={[-4, 0, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[8, 5]} />
        <meshStandardMaterial 
          map={wallTexture} 
          color={wallTexture ? 'white' : '#f5f5f5'}
          roughness={0.7}
          metalness={0.2}
        />
      </mesh>
      
      {/* Right Wall */}
      <mesh position={[4, 0, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[8, 5]} />
        <meshStandardMaterial 
          map={wallTexture} 
          color={wallTexture ? 'white' : '#f5f5f5'}
          roughness={0.7}
          metalness={0.2}
        />
      </mesh>
      
      {/* Front Wall */}
      <mesh position={[0, 0, 4]} rotation={[0, Math.PI, 0]} receiveShadow>
        <planeGeometry args={[8, 5]} />
        <meshStandardMaterial 
          map={wallTexture} 
          color={wallTexture ? 'white' : '#f5f5f5'}
          roughness={0.7}
          metalness={0.2}
        />
      </mesh>
      
      {/* Bathroom fixtures */}
      <Toilet />
      <Sink />
    </group>
  );
};

const KitchenScene: React.FC<{ floorTileTexture?: string, wallTileTexture?: string }> = ({ 
  floorTileTexture, 
  wallTileTexture 
}) => {
  let floorTexture = null;
  let wallTexture = null;
  
  if (floorTileTexture) {
    try {
      floorTexture = useLoader(THREE.TextureLoader, floorTileTexture);
      floorTexture.wrapS = THREE.RepeatWrapping;
      floorTexture.wrapT = THREE.RepeatWrapping;
      floorTexture.repeat.set(8, 8);
      floorTexture.anisotropy = 16;
    } catch (error) {
      console.error('Error loading floor texture:', error);
    }
  }
  
  if (wallTileTexture) {
    try {
      wallTexture = useLoader(THREE.TextureLoader, wallTileTexture);
      wallTexture.wrapS = THREE.RepeatWrapping;
      wallTexture.wrapT = THREE.RepeatWrapping;
      wallTexture.repeat.set(6, 3);
      wallTexture.anisotropy = 16;
    } catch (error) {
      console.error('Error loading wall texture:', error);
    }
  }
  
  return (
    <group>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.5, 0]} receiveShadow>
        <planeGeometry args={[10, 10]} />
        <meshStandardMaterial 
          map={floorTexture} 
          color={floorTexture ? 'white' : '#e5e5e5'}
          roughness={0.7}
          metalness={0.3}
        />
      </mesh>
      
      {/* Ceiling */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 2.5, 0]}>
        <planeGeometry args={[10, 10]} />
        <meshStandardMaterial color="#f8f8f8" roughness={0.9} />
      </mesh>
      
      {/* Back Wall (with backsplash area) */}
      <mesh position={[0, 0, -5]} rotation={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[10, 5]} />
        <meshStandardMaterial 
          map={wallTexture} 
          color={wallTexture ? 'white' : '#f5f5f5'}
          roughness={0.7}
          metalness={0.2}
        />
      </mesh>
      
      {/* Left Wall */}
      <mesh position={[-5, 0, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[10, 5]} />
        <meshStandardMaterial 
          map={wallTexture} 
          color={wallTexture ? 'white' : '#f5f5f5'}
          roughness={0.7}
          metalness={0.2}
        />
      </mesh>
      
      {/* Right Wall */}
      <mesh position={[5, 0, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[10, 5]} />
        <meshStandardMaterial 
          map={wallTexture} 
          color={wallTexture ? 'white' : '#f5f5f5'}
          roughness={0.7}
          metalness={0.2}
        />
      </mesh>
      
      {/* Front Wall */}
      <mesh position={[0, 0, 5]} rotation={[0, Math.PI, 0]} receiveShadow>
        <planeGeometry args={[10, 5]} />
        <meshStandardMaterial 
          map={wallTexture} 
          color={wallTexture ? 'white' : '#f5f5f5'}
          roughness={0.7}
          metalness={0.2}
        />
      </mesh>
      
      {/* Kitchen fixtures */}
      <KitchenCounter />
      <Refrigerator />
    </group>
  );
};

export const Room3D: React.FC = () => {
  const { selectedRoom, appliedTiles, currentShowroom } = useAppStore();
  const [roomKey, setRoomKey] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const controlsRef = useRef<any>(null);

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Reset the room when selectedRoom changes
  useEffect(() => {
    if (selectedRoom) {
      setRoomKey(`${selectedRoom.id}-${Date.now()}`);
    }
  }, [selectedRoom]);

  // Auto-hide controls on mobile after 3 seconds
  useEffect(() => {
    if (isMobile && showControls) {
      const timer = setTimeout(() => {
        setShowControls(false);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [isMobile, showControls]);

  // Fullscreen toggle
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // Reset camera view
  const resetCamera = () => {
    if (controlsRef.current) {
      controlsRef.current.reset();
    }
  };

  if (!selectedRoom) {
    return (
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg sm:rounded-xl flex flex-col items-center justify-center h-64 sm:h-96 p-6">
        <div className="text-center">
          <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </div>
          <p className="text-gray-600 text-base sm:text-lg font-medium">Select a room to view 3D preview</p>
          <p className="text-gray-400 text-xs sm:text-sm mt-2">Choose from Hall, Washroom, or Kitchen</p>
        </div>
      </div>
    );
  }

  const getTexture = (surface: string) => {
    const tileId = appliedTiles[surface];
    if (!tileId || !currentShowroom) return undefined;
    
    const tile = currentShowroom.tiles.find(t => t.id === tileId);
    return tile?.textureUrl;
  };

  const renderRoom = () => {
    switch (selectedRoom.type) {
      case 'hall':
        return <HallRoom floorTileTexture={getTexture('floor')} />;
      case 'washroom':
        return (
          <WashroomScene 
            floorTileTexture={getTexture('floor')} 
            wallTileTexture={getTexture('wall')} 
          />
        );
      case 'kitchen':
        return (
          <KitchenScene 
            floorTileTexture={getTexture('floor')} 
            wallTileTexture={getTexture('wall')} 
          />
        );
      default:
        return <HallRoom floorTileTexture={getTexture('floor')} />;
    }
  };

  return (
    <div 
      ref={containerRef}
      className="bg-white rounded-lg sm:rounded-xl shadow-lg overflow-hidden relative"
    >
      <div className="h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] relative touch-none">
        <Canvas 
          key={roomKey} 
          camera={{ position: [0, 0, 0], fov: 75 }}
          shadows
          dpr={[1, 2]} // Adaptive pixel ratio
          performance={{ min: 0.5 }} // Performance optimization
          onTouchStart={() => setShowControls(true)}
          gl={{
            antialias: true,
            alpha: false,
            powerPreference: "high-performance"
          }}
        >
          <Suspense fallback={<LoadingFallback />}>
            <ambientLight intensity={0.4} />
            <directionalLight 
              position={[5, 5, 5]} 
              intensity={0.6} 
              castShadow
              shadow-mapSize-width={1024}
              shadow-mapSize-height={1024}
            />
            <directionalLight position={[-5, 5, -5]} intensity={0.4} />
            <pointLight position={[0, 2, 0]} intensity={0.3} />
            
            {renderRoom()}
            
            <OrbitControls 
              ref={controlsRef}
              enablePan={true}
              enableZoom={true}
              enableRotate={true}
              maxPolarAngle={Math.PI * 0.8}
              minPolarAngle={Math.PI * 0.2}
              minDistance={0.5}
              maxDistance={8}
              target={[0, 0, 0]}
              enableDamping
              dampingFactor={0.05}
              rotateSpeed={isMobile ? 0.5 : 1}
              zoomSpeed={isMobile ? 0.5 : 1}
              panSpeed={isMobile ? 0.5 : 1}
              touches={{
                ONE: THREE.TOUCH.ROTATE,
                TWO: THREE.TOUCH.DOLLY_PAN
              }}
            />
            <Environment preset="apartment" />
          </Suspense>
        </Canvas>
        
        {/* Header Info */}
        <div className={`absolute top-2 sm:top-4 left-2 sm:left-4 bg-black/70 backdrop-blur-sm text-white px-3 py-2 sm:px-4 sm:py-2 rounded-lg transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0 sm:opacity-100'}`}>
          <p className="font-semibold text-sm sm:text-base">{selectedRoom.name}</p>
          <p className="text-xs sm:text-sm opacity-90 hidden sm:block">
            360° View • Drag to look around • Scroll to zoom
          </p>
          <p className="text-xs opacity-90 sm:hidden">
            Touch to rotate • Pinch to zoom
          </p>
        </div>
        
        {/* Control Buttons */}
        <div className={`absolute top-2 sm:top-4 right-2 sm:right-4 flex flex-col gap-2 transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0 sm:opacity-100'}`}>
          <button
            onClick={resetCamera}
            className="bg-black/70 hover:bg-black/80 backdrop-blur-sm text-white p-2 sm:p-2.5 rounded-lg transition-colors touch-manipulation group"
            title="Reset View"
            aria-label="Reset camera view"
          >
            <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5 group-hover:rotate-180 transition-transform duration-500" />
          </button>
          
          {document.fullscreenEnabled && (
            <button
              onClick={toggleFullscreen}
              className="bg-black/70 hover:bg-black/80 backdrop-blur-sm text-white p-2 sm:p-2.5 rounded-lg transition-colors touch-manipulation"
              title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
              aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
            >
              {isFullscreen ? (
                <Minimize2 className="w-4 h-4 sm:w-5 sm:h-5" />
              ) : (
                <Maximize2 className="w-4 h-4 sm:w-5 sm:h-5" />
              )}
            </button>
          )}
        </div>
        
        {/* Applied Tiles Info */}
        <div className={`absolute bottom-2 sm:bottom-4 right-2 sm:right-4 bg-black/70 backdrop-blur-sm text-white px-3 py-2 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0 sm:opacity-100'}`}>
          <p className="font-semibold mb-1">Applied Tiles:</p>
          <p className="flex items-center gap-2">
            <span className="opacity-75">Floor:</span> 
            <span className={appliedTiles.floor ? 'text-green-400' : 'text-gray-400'}>
              {appliedTiles.floor ? '✓ Applied' : 'None'}
            </span>
          </p>
          {selectedRoom.type !== 'hall' && (
            <p className="flex items-center gap-2">
              <span className="opacity-75">Wall:</span> 
              <span className={appliedTiles.wall ? 'text-green-400' : 'text-gray-400'}>
                {appliedTiles.wall ? '✓ Applied' : 'None'}
              </span>
            </p>
          )}
        </div>

        {/* Mobile Controls Guide */}
        {isMobile && (
          <div className={`absolute bottom-2 left-2 right-2 bg-blue-600/90 backdrop-blur-sm text-white px-3 py-2 rounded-lg text-xs transition-all duration-300 ${showControls ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'}`}>
            <div className="flex items-start gap-2">
              <Move className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Touch Controls:</p>
                <p className="opacity-90">1 finger: Rotate • 2 fingers: Zoom & Pan</p>
              </div>
            </div>
          </div>
        )}

        {/* Tap to show controls hint for mobile */}
        {isMobile && !showControls && (
          <div 
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
            onClick={() => setShowControls(true)}
          >
            <div className="bg-black/50 backdrop-blur-sm text-white px-4 py-2 rounded-full text-xs animate-pulse pointer-events-auto">
              Tap to show controls
            </div>
          </div>
        )}
      </div>

      {/* Desktop Instructions */}
      <div className="hidden md:block bg-gradient-to-r from-blue-50 to-purple-50 px-4 py-3 border-t border-gray-200">
        <div className="flex items-center justify-between text-xs text-gray-600">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <ZoomIn className="w-3.5 h-3.5" />
              Scroll to zoom
            </span>
            <span className="flex items-center gap-1">
              <Move className="w-3.5 h-3.5" />
              Drag to rotate
            </span>
            <span className="flex items-center gap-1">
              <RotateCcw className="w-3.5 h-3.5" />
              Right-click to pan
            </span>
          </div>
          <span className="text-blue-600 font-medium">Interactive 3D View</span>
        </div>
      </div>
    </div>
  );
};