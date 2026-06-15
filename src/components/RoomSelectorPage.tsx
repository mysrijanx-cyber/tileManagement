
// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { 
//   ArrowLeft, Loader, AlertCircle, X, 
//   Calculator, Eye, Highlighter, Info 
// } from 'lucide-react';
// import { getTileById } from '../lib/firebaseutils';
// import { Tile } from '../types';

// // ═══════════════════════════════════════════════════════════════
// // INTERFACES
// // ═══════════════════════════════════════════════════════════════

// interface RoomOption {
//   id: string;
//   name: string;
//   type: 'drawing' | 'kitchen' | 'bathroom';
//   icon: string;
//   description: string;
//   thumbnail: string;
//   surfaceOptions: string[];
//   defaultWidth: number;
//   defaultDepth: number;
//   defaultHeight: number;
// }

// type RoomMode = 'view' | 'highlighter';

// // ═══════════════════════════════════════════════════════════════
// // CONSTANTS
// // ═══════════════════════════════════════════════════════════════

// const ROOM_OPTIONS: RoomOption[] = [
//   {
//     id: 'drawing',
//     name: 'Drawing Room',
//     type: 'drawing',
//     icon: '🛋️',
//     description: 'See how tiles look in your living space',
//     thumbnail: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=400',
//     surfaceOptions: ['floor'],
//     defaultWidth: 20,
//     defaultDepth: 20,
//     defaultHeight: 11
//   },
//   {
//     id: 'kitchen',
//     name: 'Kitchen',
//     type: 'kitchen',
//     icon: '🍳',
//     description: 'Visualize floor and backsplash tiles',
//     thumbnail: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=400',
//     surfaceOptions: ['floor', 'wall'],
//     defaultWidth: 25,
//     defaultDepth: 25,
//     defaultHeight: 11
//   },
//   {
//     id: 'bathroom',
//     name: 'Bathroom',
//     type: 'bathroom',
//     icon: '🛁',
//     description: 'Preview floor and wall tile combinations',
//     thumbnail: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=400',
//     surfaceOptions: ['floor', 'wall'],
//     defaultWidth: 15,
//     defaultDepth: 15,
//     defaultHeight: 11
//   }
// ];

// // ═══════════════════════════════════════════════════════════════
// // MODE SELECTION MODAL - HIGHLIGHTER ONLY
// // ═══════════════════════════════════════════════════════════════

// const ModeSelectionModal: React.FC<{
//   isOpen: boolean;
//   onClose: () => void;
//   onSelectMode: (mode: RoomMode) => void;
//   roomName: string;
// }> = ({ isOpen, onClose, onSelectMode, roomName }) => {
//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
//       <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 sm:p-8 animate-slideUp">
        
//         {/* Header */}
//         <div className="flex items-center justify-between mb-6">
//           <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
//             Highlighter Mode
//           </h2>
//           <button 
//             onClick={onClose}
//             className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
//           >
//             <X className="w-5 h-5 text-gray-600" />
//           </button>
//         </div>

//         {/* Room Info */}
//         <div className="mb-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-100">
//           <p className="text-gray-700 text-base sm:text-lg">
//             Ready to create custom patterns for <strong className="text-purple-700">{roomName}</strong>?
//           </p>
//         </div>

//         {/* HIGHLIGHTER MODE CARD */}
//         <div className="mb-6">
//           <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 sm:p-8 border-2 border-purple-200">
            
//             {/* Icon */}
//             <div className="flex justify-center mb-6">
//               <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-purple-600 to-purple-700 rounded-2xl flex items-center justify-center shadow-lg">
//                 <Highlighter className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
//               </div>
//             </div>
            
//             {/* Title */}
//             <h3 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-4">
//               🎨 Create Custom Patterns
//             </h3>
            
//             {/* Description */}
//             <p className="text-center text-gray-600 text-base sm:text-lg mb-6 px-2">
//               Design unique tile arrangements with powerful pattern tools
//             </p>
            
//             {/* Features */}
//             <div className="space-y-3 mb-6">
//               <div className="flex items-center gap-3 bg-white/60 rounded-lg p-3 border border-purple-100">
//                 <span className="w-2 h-2 bg-purple-500 rounded-full flex-shrink-0"></span>
//                 <p className="text-gray-700 text-sm sm:text-base">Add and place highlighter tiles</p>
//               </div>
//               <div className="flex items-center gap-3 bg-white/60 rounded-lg p-3 border border-purple-100">
//                 <span className="w-2 h-2 bg-purple-500 rounded-full flex-shrink-0"></span>
//                 <p className="text-gray-700 text-sm sm:text-base">Apply random pattern algorithms</p>
//               </div>
//               <div className="flex items-center gap-3 bg-white/60 rounded-lg p-3 border border-purple-100">
//                 <span className="w-2 h-2 bg-purple-500 rounded-full flex-shrink-0"></span>
//                 <p className="text-gray-700 text-sm sm:text-base">Shuffle and generate variants</p>
//               </div>
//               <div className="flex items-center gap-3 bg-white/60 rounded-lg p-3 border border-purple-100">
//                 <span className="w-2 h-2 bg-purple-500 rounded-full flex-shrink-0"></span>
//                 <p className="text-gray-700 text-sm sm:text-base">Advanced grid selection tools</p>
//               </div>
//             </div>

//             {/* Continue Button */}
//             <button
//               onClick={() => onSelectMode('highlighter')}
//               className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105 active:scale-95"
//             >
//               Continue with Highlighter Mode →
//             </button>
//           </div>
//         </div>

//         {/* Info Box */}
//         <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
//           <div className="flex items-start gap-3">
//             <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
//             <div className="flex-1 min-w-0">
//               <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
//                 <strong className="text-blue-700">Pro Tip:</strong> Use highlighter mode to experiment with different tile combinations and create stunning unique patterns.
//               </p>
//             </div>
//           </div>
//         </div>

//       </div>
//     </div>
//   );
// };

// // ═══════════════════════════════════════════════════════════════
// // MAIN COMPONENT
// // ═══════════════════════════════════════════════════════════════

// export const RoomSelectorPage: React.FC = () => {
//   const { tileId } = useParams<{ tileId: string }>();
//   const navigate = useNavigate();

//   const [tile, setTile] = useState<Tile | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
//   const [showModeSelector, setShowModeSelector] = useState(false);
//   const [pendingRoomType, setPendingRoomType] = useState<string | null>(null);

//   useEffect(() => {
//     loadTileData();
//   }, [tileId]);

//   useEffect(() => {
//     if (error) {
//       const timer = setTimeout(() => setError(null), 5000);
//       return () => clearTimeout(timer);
//     }
//   }, [error]);

//   const loadTileData = async () => {
//     if (!tileId) {
//       setError('Tile ID is missing');
//       setLoading(false);
//       return;
//     }

//     try {
//       setLoading(true);
//       setError(null);
//       const tileData = await getTileById(tileId);
      
//       if (!tileData) {
//         setError('Tile not found');
//         setTimeout(() => navigate('/'), 3000);
//         return;
//       }
      
//       setTile(tileData);
//     } catch (err) {
//       console.error('Error loading tile:', err);
//       setError('Failed to load tile data');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleRoomSelect = (roomType: string) => {
//     console.log('🎯 Room selected:', roomType);
    
//     // Drawing Room: Skip mode selection, go directly to view
//     if (roomType === 'drawing') {
//       console.log('🛋️ Drawing Room - Navigating directly to view mode');
      
//       const roomData = ROOM_OPTIONS.find(r => r.type === 'drawing');
//       if (!roomData || !tileId) return;

//       const ROOM_CONFIG_VERSION = '2.0';
//       const dimensionData = {
//         width: roomData.defaultWidth,
//         depth: roomData.defaultDepth,
//         height: roomData.defaultHeight,
//         timestamp: Date.now(),
//         version: ROOM_CONFIG_VERSION,
//         mode: 'view'
//       };

//       localStorage.setItem(`room_dimensions_drawing`, JSON.stringify(dimensionData));
//       setSelectedRoom('drawing');
      
//       if (navigator.vibrate) {
//         navigator.vibrate([50, 30, 50]);
//       }
      
//       setTimeout(() => {
//         navigate(`/3d-view/${tileId}/drawing`);
//       }, 150);
      
//       return;
//     }
    
//     // Kitchen/Bathroom: Show highlighter mode modal
//     console.log('🍳🛁 Kitchen/Bathroom - Showing highlighter mode confirmation');
//     setPendingRoomType(roomType);
//     setShowModeSelector(true);
//   };

//   const handleModeSelect = (mode: RoomMode) => {
//     if (!pendingRoomType || !tileId) return;

//     const roomData = ROOM_OPTIONS.find(r => r.type === pendingRoomType);
//     if (!roomData) return;

//     const ROOM_CONFIG_VERSION = '2.0';
//     const cachedVersion = localStorage.getItem('room_config_version');
    
//     if (cachedVersion !== ROOM_CONFIG_VERSION) {
//       Object.keys(localStorage).forEach(key => {
//         if (key.startsWith('room_dimensions_') || key.startsWith('room_state_')) {
//           localStorage.removeItem(key);
//         }
//       });
//       localStorage.setItem('room_config_version', ROOM_CONFIG_VERSION);
//     }

//     const dimensionData = {
//       width: roomData.defaultWidth,
//       depth: roomData.defaultDepth,
//       height: roomData.defaultHeight,
//       timestamp: Date.now(),
//       version: ROOM_CONFIG_VERSION,
//       mode: mode
//     };

//     localStorage.setItem(`room_dimensions_${pendingRoomType}`, JSON.stringify(dimensionData));
    
//     setSelectedRoom(pendingRoomType);
//     setShowModeSelector(false);
    
//     if (navigator.vibrate) {
//       navigator.vibrate([50, 30, 50]);
//     }
    
//     console.log('✅ Navigating with mode:', {
//       room: pendingRoomType,
//       mode: mode,
//       dimensions: `${roomData.defaultWidth}' × ${roomData.defaultDepth}' × ${roomData.defaultHeight}'`
//     });
    
//     setTimeout(() => {
//       navigate(`/3d-view/${tileId}/${pendingRoomType}?mode=${mode}`);
//     }, 150);
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 px-4">
//         <div className="text-center">
//           <Loader className="w-16 h-16 animate-spin text-blue-600 mx-auto mb-4" />
//           <p className="text-gray-700 text-lg font-medium">Loading room options...</p>
//         </div>
//       </div>
//     );
//   }

//   if (error && !tile) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 px-4">
//         <div className="text-center max-w-md w-full">
//           <div className="bg-white rounded-2xl shadow-lg p-8">
//             <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
//             <h2 className="text-2xl font-bold text-gray-900 mb-2">Oops!</h2>
//             <p className="text-gray-600 mb-6">{error}</p>
//             <button
//               onClick={() => navigate('/')}
//               className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
//             >
//               Go Back Home
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      
//       {/* HEADER */}
//       <header className="bg-white/95 backdrop-blur-sm shadow-sm sticky top-0 z-20 border-b border-gray-200">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
//           <div className="flex items-center justify-between">
//             <button
//               onClick={() => navigate(-1)}
//               className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors p-2 -ml-2 rounded-lg hover:bg-gray-100"
//             >
//               <ArrowLeft className="w-5 h-5" />
//               <span className="font-medium text-sm sm:text-base">Back</span>
//             </button>
//           </div>
//         </div>
//       </header>

//       {/* ERROR TOAST */}
//       {error && (
//         <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 max-w-md w-full mx-4 animate-slide-down">
//           <div className="bg-red-500 text-white px-4 sm:px-6 py-3 sm:py-4 rounded-lg shadow-2xl flex items-center gap-3">
//             <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" />
//             <p className="font-medium flex-1 text-sm sm:text-base">{error}</p>
//             <button onClick={() => setError(null)} className="ml-auto p-1">
//               <X className="w-4 h-4 sm:w-5 sm:h-5" />
//             </button>
//           </div>
//         </div>
//       )}

//       {/* MAIN CONTENT */}
//       <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        
//         {/* Tile Info */}
//         {tile && (
//           <section className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 mb-6 sm:mb-8 flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
//             <img
//               src={tile.imageUrl}
//               alt={tile.name}
//               className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-lg ring-2 ring-blue-500/30"
//             />
//             <div className="flex-1 text-center sm:text-left">
//               <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">
//                 {tile.name}
//               </h2>
//               <p className="text-sm sm:text-base text-gray-600">
//                 {tile.size} • <span className="text-green-600 font-semibold">₹{tile.price}/sq.ft</span>
//               </p>
//             </div>
//           </section>
//         )}

//         {/* Header */}
//         <div className="text-center mb-8 sm:mb-12 px-4">
//           <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4">
//             Choose a Room
//           </h1>
//           <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
//             Select a room to view this tile in realistic 3D
//           </p>
//         </div>

//         {/* Room Cards */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12">
//           {ROOM_OPTIONS.map((room) => (
//             <button
//               key={room.id}
//               onClick={() => handleRoomSelect(room.type)}
//               disabled={selectedRoom === room.type}
//               className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 text-left disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
//             >
//               <div className="relative h-40 sm:h-48 bg-gray-200">
//                 <img
//                   src={room.thumbnail}
//                   alt={room.name}
//                   className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
//                 />
//                 <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                
//                 <div className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-white rounded-full w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center text-2xl sm:text-4xl shadow-lg">
//                   {room.icon}
//                 </div>

//                 {selectedRoom === room.type && (
//                   <div className="absolute inset-0 bg-blue-600/20 backdrop-blur-sm flex items-center justify-center">
//                     <Loader className="w-8 h-8 animate-spin text-white" />
//                   </div>
//                 )}
//               </div>

//               <div className="p-4 sm:p-6">
//                 <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
//                   {room.name}
//                 </h3>
//                 <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">
//                   {room.description}
//                 </p>

//                 <div className="text-blue-600 font-semibold flex items-center justify-center gap-2 text-sm sm:text-base">
//                   <span>Select Room</span>
//                   <span className="text-xl">→</span>
//                 </div>
//               </div>
//             </button>
//           ))}
//         </div>

//       </main>

//       {/* MODE SELECTION MODAL - Highlighter Only */}
//       <ModeSelectionModal
//         isOpen={showModeSelector}
//         onClose={() => {
//           setShowModeSelector(false);
//           setPendingRoomType(null);
//           setSelectedRoom(null);
//         }}
//         onSelectMode={handleModeSelect}
//         roomName={pendingRoomType ? ROOM_OPTIONS.find(r => r.type === pendingRoomType)?.name || '' : ''}
//       />

//       <style>{`
//         @keyframes fadeIn {
//           from { opacity: 0; }
//           to { opacity: 1; }
//         }
//         @keyframes slideUp {
//           from { 
//             opacity: 0;
//             transform: translateY(20px);
//           }
//           to { 
//             opacity: 1;
//             transform: translateY(0);
//           }
//         }
//         @keyframes slide-down {
//           from {
//             opacity: 0;
//             transform: translate(-50%, -20px);
//           }
//           to {
//             opacity: 1;
//             transform: translate(-50%, 0);
//           }
//         }
//         .animate-fadeIn { animation: fadeIn 0.2s ease-out; }
//         .animate-slideUp { animation: slideUp 0.3s ease-out; }
//         .animate-slide-down { animation: slide-down 0.3s ease-out; }
//       `}</style>
//     </div>
//   );
// }; 
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Loader, AlertCircle, X, 
  Calculator, Eye, Highlighter, Info 
} from 'lucide-react';
import { getTileById } from '../lib/firebaseutils';
import { Tile } from '../types';

// ═══════════════════════════════════════════════════════════════
// INTERFACES
// ═══════════════════════════════════════════════════════════════

interface RoomOption {
  id: string;
  name: string;
  type: 'drawing' | 'kitchen' | 'bathroom';
  icon: string;
  description: string;
  thumbnail: string;
  surfaceOptions: string[];
  defaultWidth: number;
  defaultDepth: number;
  defaultHeight: number;
}

type RoomMode = 'view' | 'highlighter';

// ═══════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════

const ROOM_OPTIONS: RoomOption[] = [
  {
    id: 'drawing',
    name: 'Drawing Room',
    type: 'drawing',
    icon: '🛋️',
    description: 'See how tiles look in your living space',
    thumbnail: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=400',
    surfaceOptions: ['floor'],
    defaultWidth: 20,
    defaultDepth: 20,
    defaultHeight: 11
  },
  {
    id: 'kitchen',
    name: 'Kitchen',
    type: 'kitchen',
    icon: '🍳',
    description: 'Visualize floor and backsplash tiles',
    thumbnail: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=400',
    surfaceOptions: ['floor', 'wall'],
    defaultWidth: 25,
    defaultDepth: 25,
    defaultHeight: 11
  },
  {
    id: 'bathroom',
    name: 'Bathroom',
    type: 'bathroom',
    icon: '🛁',
    description: 'Preview floor and wall tile combinations',
    thumbnail: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=400',
    surfaceOptions: ['floor', 'wall'],
    defaultWidth: 15,
    defaultDepth: 15,
    defaultHeight: 11
  }
];

// ═══════════════════════════════════════════════════════════════
// MODE SELECTION MODAL - HIGHLIGHTER ONLY (RECTANGULAR FIX)
// ═══════════════════════════════════════════════════════════════

const ModeSelectionModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSelectMode: (mode: RoomMode) => void;
  roomName: string;
}> = ({ isOpen, onClose, onSelectMode, roomName }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
      {/* CHANGED: max-w-lg to max-w-4xl to create a wide rectangle. Added max-h-[95vh] to strictly prevent screen-level scrolling */}
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full p-4 sm:p-6 flex flex-col max-h-[95vh] animate-slideUp">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
            View Mode
          </h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Content Area: Split into 2 columns (Rectangle Layout) on md+ screens */}
        <div className="flex flex-col md:flex-row gap-4 sm:gap-6 overflow-y-auto md:overflow-visible">
          
          {/* LEFT COLUMN: Visuals and Main Info */}
          <div className="flex-1 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-5 border-2 border-purple-200 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-purple-600 to-purple-700 rounded-2xl flex items-center justify-center shadow-lg mb-4">
              <Highlighter className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
            </div>
            
            <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
              🎨 Custom Patterns
            </h3>
            
            <p className="text-gray-600 text-sm sm:text-base mb-4 px-2">
              Design unique tile arrangements with powerful pattern tools
            </p>

            <div className="bg-white/70 rounded-lg p-3 border border-purple-100 w-full mt-auto">
              <p className="text-gray-700 text-sm">
                Ready for <strong className="text-purple-700">{roomName}</strong>?
              </p>
            </div>
          </div>

          {/* RIGHT COLUMN: Features List and Actions */}
          <div className="flex-1 flex flex-col space-y-4 justify-between">
            
            {/* Features List (Made Compact) */}
            <div className="space-y-2.5">
              <div className="flex items-center gap-3 bg-purple-50/50 rounded-lg p-2.5 border border-purple-100">
                <span className="w-1.5 h-1.5 bg-purple-500 rounded-full flex-shrink-0"></span>
                <p className="text-gray-700 text-xs sm:text-sm font-medium">Add and place highlighter tiles</p>
              </div>
              <div className="flex items-center gap-3 bg-purple-50/50 rounded-lg p-2.5 border border-purple-100">
                <span className="w-1.5 h-1.5 bg-purple-500 rounded-full flex-shrink-0"></span>
                <p className="text-gray-700 text-xs sm:text-sm font-medium">Apply random pattern algorithms</p>
              </div>
              <div className="flex items-center gap-3 bg-purple-50/50 rounded-lg p-2.5 border border-purple-100">
                <span className="w-1.5 h-1.5 bg-purple-500 rounded-full flex-shrink-0"></span>
                <p className="text-gray-700 text-xs sm:text-sm font-medium">Shuffle and generate variants</p>
              </div>
              <div className="flex items-center gap-3 bg-purple-50/50 rounded-lg p-2.5 border border-purple-100">
                <span className="w-1.5 h-1.5 bg-purple-500 rounded-full flex-shrink-0"></span>
                <p className="text-gray-700 text-xs sm:text-sm font-medium">Advanced grid selection tools</p>
              </div>
            </div>

            {/* Info Box (Hidden on extremely small screens to prevent scroll) */}
            <div className="bg-blue-50 rounded-lg p-3 border border-blue-200 hidden sm:block">
              <div className="flex items-start gap-2">
                <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-gray-700 leading-relaxed">
                  <strong className="text-blue-700">Pro Tip:</strong> Use highlighter mode to experiment with different tile combinations.
                </p>
              </div>
            </div>

            {/* Continue Button */}
            <button
              onClick={() => onSelectMode('highlighter')}
              className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white py-3.5 rounded-xl font-bold text-sm sm:text-base shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.02] active:scale-95 mt-auto"
            >
              Continue with View Mode →
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════

export const RoomSelectorPage: React.FC = () => {
  const { tileId } = useParams<{ tileId: string }>();
  const navigate = useNavigate();

  const [tile, setTile] = useState<Tile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [showModeSelector, setShowModeSelector] = useState(false);
  const [pendingRoomType, setPendingRoomType] = useState<string | null>(null);

  useEffect(() => {
    loadTileData();
  }, [tileId]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const loadTileData = async () => {
    if (!tileId) {
      setError('Tile ID is missing');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const tileData = await getTileById(tileId);
      
      if (!tileData) {
        setError('Tile not found');
        setTimeout(() => navigate('/'), 3000);
        return;
      }
      
      setTile(tileData);
    } catch (err) {
      console.error('Error loading tile:', err);
      setError('Failed to load tile data');
    } finally {
      setLoading(false);
    }
  };

  const handleRoomSelect = (roomType: string) => {
    console.log('🎯 Room selected:', roomType);
    
    // Drawing Room: Skip mode selection, go directly to view
    if (roomType === 'drawing') {
      console.log('🛋️ Drawing Room - Navigating directly to view mode');
      
      const roomData = ROOM_OPTIONS.find(r => r.type === 'drawing');
      if (!roomData || !tileId) return;

      const ROOM_CONFIG_VERSION = '2.0';
      const dimensionData = {
        width: roomData.defaultWidth,
        depth: roomData.defaultDepth,
        height: roomData.defaultHeight,
        timestamp: Date.now(),
        version: ROOM_CONFIG_VERSION,
        mode: 'view'
      };

      localStorage.setItem(`room_dimensions_drawing`, JSON.stringify(dimensionData));
      setSelectedRoom('drawing');
      
      if (navigator.vibrate) {
        navigator.vibrate([50, 30, 50]);
      }
      
      setTimeout(() => {
        navigate(`/3d-view/${tileId}/drawing`);
      }, 150);
      
      return;
    }
    
    // Kitchen/Bathroom: Show highlighter mode modal
    console.log('🍳🛁 Kitchen/Bathroom - Showing highlighter mode confirmation');
    setPendingRoomType(roomType);
    setShowModeSelector(true);
  };

  const handleModeSelect = (mode: RoomMode) => {
    if (!pendingRoomType || !tileId) return;

    const roomData = ROOM_OPTIONS.find(r => r.type === pendingRoomType);
    if (!roomData) return;

    const ROOM_CONFIG_VERSION = '2.0';
    const cachedVersion = localStorage.getItem('room_config_version');
    
    if (cachedVersion !== ROOM_CONFIG_VERSION) {
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('room_dimensions_') || key.startsWith('room_state_')) {
          localStorage.removeItem(key);
        }
      });
      localStorage.setItem('room_config_version', ROOM_CONFIG_VERSION);
    }

    const dimensionData = {
      width: roomData.defaultWidth,
      depth: roomData.defaultDepth,
      height: roomData.defaultHeight,
      timestamp: Date.now(),
      version: ROOM_CONFIG_VERSION,
      mode: mode
    };

    localStorage.setItem(`room_dimensions_${pendingRoomType}`, JSON.stringify(dimensionData));
    
    setSelectedRoom(pendingRoomType);
    setShowModeSelector(false);
    
    if (navigator.vibrate) {
      navigator.vibrate([50, 30, 50]);
    }
    
    console.log('✅ Navigating with mode:', {
      room: pendingRoomType,
      mode: mode,
      dimensions: `${roomData.defaultWidth}' × ${roomData.defaultDepth}' × ${roomData.defaultHeight}'`
    });
    
    setTimeout(() => {
      navigate(`/3d-view/${tileId}/${pendingRoomType}?mode=${mode}`);
    }, 150);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 px-4">
        <div className="text-center">
          <Loader className="w-16 h-16 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-700 text-lg font-medium">Loading room options...</p>
        </div>
      </div>
    );
  }

  if (error && !tile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 px-4">
        <div className="text-center max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Oops!</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => navigate('/')}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Go Back Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      
      {/* HEADER */}
      <header className="bg-white/95 backdrop-blur-sm shadow-sm sticky top-0 z-20 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors p-2 -ml-2 rounded-lg hover:bg-gray-100"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium text-sm sm:text-base">Back</span>
            </button>
          </div>
        </div>
      </header>

      {/* ERROR TOAST */}
      {error && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 max-w-md w-full mx-4 animate-slide-down">
          <div className="bg-red-500 text-white px-4 sm:px-6 py-3 sm:py-4 rounded-lg shadow-2xl flex items-center gap-3">
            <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" />
            <p className="font-medium flex-1 text-sm sm:text-base">{error}</p>
            <button onClick={() => setError(null)} className="ml-auto p-1">
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>
      )}

      {/* MAIN CONTENT */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        
        {/* Tile Info */}
        {tile && (
          <section className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 mb-6 sm:mb-8 flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
            <img
              src={tile.imageUrl}
              alt={tile.name}
              className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-lg ring-2 ring-blue-500/30"
            />
            <div className="flex-1 text-center sm:text-left">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">
                {tile.name}
              </h2>
              <p className="text-sm sm:text-base text-gray-600">
                {tile.size} • <span className="text-green-600 font-semibold">₹{tile.price}/sq.ft</span>
              </p>
            </div>
          </section>
        )}

        {/* Header */}
        <div className="text-center mb-8 sm:mb-12 px-4">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4">
            Choose a Room
          </h1>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
            Select a room to view this tile in realistic 3D
          </p>
        </div>

        {/* Room Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12">
          {ROOM_OPTIONS.map((room) => (
            <button
              key={room.id}
              onClick={() => handleRoomSelect(room.type)}
              disabled={selectedRoom === room.type}
              className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 text-left disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              <div className="relative h-40 sm:h-48 bg-gray-200">
                <img
                  src={room.thumbnail}
                  alt={room.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                
                <div className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-white rounded-full w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center text-2xl sm:text-4xl shadow-lg">
                  {room.icon}
                </div>

                {selectedRoom === room.type && (
                  <div className="absolute inset-0 bg-blue-600/20 backdrop-blur-sm flex items-center justify-center">
                    <Loader className="w-8 h-8 animate-spin text-white" />
                  </div>
                )}
              </div>

              <div className="p-4 sm:p-6">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {room.name}
                </h3>
                <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">
                  {room.description}
                </p>

                <div className="text-blue-600 font-semibold flex items-center justify-center gap-2 text-sm sm:text-base">
                  <span>Select Room</span>
                  <span className="text-xl">→</span>
                </div>
              </div>
            </button>
          ))}
        </div>

      </main>

      {/* MODE SELECTION MODAL - Highlighter Only */}
      <ModeSelectionModal
        isOpen={showModeSelector}
        onClose={() => {
          setShowModeSelector(false);
          setPendingRoomType(null);
          setSelectedRoom(null);
        }}
        onSelectMode={handleModeSelect}
        roomName={pendingRoomType ? ROOM_OPTIONS.find(r => r.type === pendingRoomType)?.name || '' : ''}
      />

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
        @keyframes slide-down {
          from {
            opacity: 0;
            transform: translate(-50%, -20px);
          }
          to {
            opacity: 1;
            transform: translate(-50%, 0);
          }
        }
        .animate-fadeIn { animation: fadeIn 0.2s ease-out; }
        .animate-slideUp { animation: slideUp 0.3s ease-out; }
        .animate-slide-down { animation: slide-down 0.3s ease-out; }
      `}</style>
    </div>
  );
};

export default RoomSelectorPage;