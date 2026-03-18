  
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
// // MODE SELECTION MODAL
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
//       <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6 animate-slideUp">
        
//         {/* Header */}
//         <div className="flex items-center justify-between mb-6">
//           <h2 className="text-2xl font-bold text-gray-800">Choose Mode</h2>
//           <button 
//             onClick={onClose}
//             className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
//           >
//             <X className="w-5 h-5 text-gray-600" />
//           </button>
//         </div>

//         <p className="text-gray-600 mb-6">
//           How would you like to view <strong>{roomName}</strong>?
//         </p>

//         {/* Mode Options */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
//           {/* VIEW MODE */}
//           <button
//             onClick={() => onSelectMode('view')}
//             className="group bg-gradient-to-br from-blue-50 to-cyan-50 hover:from-blue-100 hover:to-cyan-100 rounded-xl p-6 border-2 border-blue-200 hover:border-blue-400 transition-all text-left transform hover:scale-105"
//           >
//             <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
//               <Eye className="w-8 h-8 text-white" />
//             </div>
            
//             <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
//               👁️ View Mode
//             </h3>
            
//             <p className="text-gray-600 text-sm mb-4">
//               Perfect for visualizing how tiles look in the room
//             </p>
            
//             <div className="space-y-2 text-sm">
//               <p className="flex items-center gap-2 text-gray-700">
//                 <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
//                 Camera presets & controls
//               </p>
//               <p className="flex items-center gap-2 text-gray-700">
//                 <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
//                 Change floor tiles
//               </p>
//               <p className="flex items-center gap-2 text-gray-700">
//                 <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
//                 Scan wall tiles
//               </p>
//               <p className="flex items-center gap-2 text-gray-700">
//                 <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
//                 Show/hide tile borders
//               </p>
//             </div>
//           </button>

//           {/* HIGHLIGHTER MODE */}
//           <button
//             onClick={() => onSelectMode('highlighter')}
//             className="group bg-gradient-to-br from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 rounded-xl p-6 border-2 border-purple-200 hover:border-purple-400 transition-all text-left transform hover:scale-105"
//           >
//             <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
//               <Highlighter className="w-8 h-8 text-white" />
//             </div>
            
//             <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-purple-600 transition-colors">
//               🎨 Highlighter Mode
//             </h3>
            
//             <p className="text-gray-600 text-sm mb-4">
//               Create custom patterns with highlighter tiles
//             </p>
            
//             <div className="space-y-2 text-sm">
//               <p className="flex items-center gap-2 text-gray-700">
//                 <span className="w-1.5 h-1.5 bg-purple-500 rounded-full"></span>
//                 Add highlighter tiles
//               </p>
//               <p className="flex items-center gap-2 text-gray-700">
//                 <span className="w-1.5 h-1.5 bg-purple-500 rounded-full"></span>
//                 Apply random patterns
//               </p>
//               <p className="flex items-center gap-2 text-gray-700">
//                 <span className="w-1.5 h-1.5 bg-purple-500 rounded-full"></span>
//                 Shuffle pattern variants
//               </p>
//               <p className="flex items-center gap-2 text-gray-700">
//                 <span className="w-1.5 h-1.5 bg-purple-500 rounded-full"></span>
//                 Grid selection tools
//               </p>
//             </div>
//           </button>

//         </div>

//         {/* Info */}
//         <div className="mt-6 bg-gray-50 rounded-lg p-4 border border-gray-200">
//           <div className="flex items-start gap-3">
//             <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
//             <div className="flex-1 min-w-0">
//               <p className="text-sm text-gray-700">
//                 <strong>Tip:</strong> Start with View Mode to see the room first. 
//                 You can always return and select Highlighter Mode for advanced pattern creation.
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
//     setPendingRoomType(roomType);
//     setShowModeSelector(true);
//   };

//   const handleModeSelect = (mode: RoomMode) => {
//     if (!pendingRoomType || !tileId) return;

//     const roomData = ROOM_OPTIONS.find(r => r.type === pendingRoomType);
//     if (!roomData) return;

//     // Save dimensions
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
//       mode: mode  // ✅ Save mode
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
//         <div className="text-center max-w-md">
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
//         <div className="max-w-7xl mx-auto px-4 lg:px-6 py-4">
//           <div className="flex items-center justify-between">
//             <button
//               onClick={() => navigate(-1)}
//               className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors p-2 -ml-2 rounded-lg hover:bg-gray-100"
//             >
//               <ArrowLeft className="w-5 h-5" />
//               <span className="font-medium">Back</span>
//             </button>

//           </div>
//         </div>
//       </header>

//       {/* ERROR TOAST */}
//       {error && (
//         <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 max-w-md w-full mx-4 animate-slide-down">
//           <div className="bg-red-500 text-white px-6 py-4 rounded-lg shadow-2xl flex items-center gap-3">
//             <AlertCircle className="w-6 h-6 flex-shrink-0" />
//             <p className="font-medium flex-1">{error}</p>
//             <button onClick={() => setError(null)} className="ml-auto p-1">
//               <X className="w-5 h-5" />
//             </button>
//           </div>
//         </div>
//       )}

//       {/* MAIN CONTENT */}
//       <main className="max-w-7xl mx-auto px-4 lg:px-6 py-12">
        
//         {/* Tile Info */}
//         {tile && (
//           <section className="bg-white rounded-2xl shadow-lg p-6 mb-8 flex items-center gap-6">
//             <img
//               src={tile.imageUrl}
//               alt={tile.name}
//               className="w-24 h-24 object-cover rounded-lg ring-2 ring-blue-500/30"
//             />
//             <div className="flex-1">
//               <h2 className="text-2xl font-bold text-gray-900 mb-1">{tile.name}</h2>
//               <p className="text-gray-600">
//                 {tile.size} • <span className="text-green-600 font-semibold">₹{tile.price}/sq.ft</span>
//               </p>
//             </div>
//           </section>
//         )}

//         {/* Header */}
//         <div className="text-center mb-12">
//           <h1 className="text-5xl font-bold text-gray-900 mb-4">Choose a Room</h1>
//           <p className="text-lg text-gray-600 max-w-2xl mx-auto">
//             Select a room to view this tile in realistic 3D
//           </p>
//         </div>

//         {/* Room Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
//           {ROOM_OPTIONS.map((room) => (
//             <button
//               key={room.id}
//               onClick={() => handleRoomSelect(room.type)}
//               disabled={selectedRoom === room.type}
//               className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 text-left"
//             >
//               <div className="relative h-48 bg-gray-200">
//                 <img
//                   src={room.thumbnail}
//                   alt={room.name}
//                   className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
//                 />
//                 <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                
//                 <div className="absolute top-4 right-4 bg-white rounded-full w-16 h-16 flex items-center justify-center text-4xl shadow-lg">
//                   {room.icon}
//                 </div>

//                 {selectedRoom === room.type && (
//                   <div className="absolute inset-0 bg-blue-600/20 backdrop-blur-sm flex items-center justify-center">
//                     <Loader className="w-8 h-8 animate-spin text-white" />
//                   </div>
//                 )}
//               </div>

//               <div className="p-6">
//                 <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
//                   {room.name}
//                 </h3>
//                 <p className="text-gray-600 mb-4">{room.description}</p>

              

//                 <div className="text-blue-600 font-semibold flex items-center justify-center gap-2">
//                   <span>Select Room</span>
//                   <span className="text-xl">→</span>
//                 </div>
//               </div>
//             </button>
//           ))}
//         </div>

//       </main>

//       {/* MODE SELECTION MODAL */}
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
// MODE SELECTION MODAL
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
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6 animate-slideUp">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Choose Mode</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <p className="text-gray-600 mb-6">
          How would you like to view <strong>{roomName}</strong>?
        </p>

        {/* Mode Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* VIEW MODE */}
          <button
            onClick={() => onSelectMode('view')}
            className="group bg-gradient-to-br from-blue-50 to-cyan-50 hover:from-blue-100 hover:to-cyan-100 rounded-xl p-6 border-2 border-blue-200 hover:border-blue-400 transition-all text-left transform hover:scale-105"
          >
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Eye className="w-8 h-8 text-white" />
            </div>
            
            <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
              👁️ View Mode
            </h3>
            
            <p className="text-gray-600 text-sm mb-4">
              Perfect for visualizing how tiles look in the room
            </p>
            
            <div className="space-y-2 text-sm">
              <p className="flex items-center gap-2 text-gray-700">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                Camera presets & controls
              </p>
              <p className="flex items-center gap-2 text-gray-700">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                Change floor tiles
              </p>
              <p className="flex items-center gap-2 text-gray-700">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                Scan wall tiles
              </p>
              <p className="flex items-center gap-2 text-gray-700">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                Show/hide tile borders
              </p>
            </div>
          </button>

          {/* HIGHLIGHTER MODE */}
          <button
            onClick={() => onSelectMode('highlighter')}
            className="group bg-gradient-to-br from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 rounded-xl p-6 border-2 border-purple-200 hover:border-purple-400 transition-all text-left transform hover:scale-105"
          >
            <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Highlighter className="w-8 h-8 text-white" />
            </div>
            
            <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-purple-600 transition-colors">
              🎨 Highlighter Mode
            </h3>
            
            <p className="text-gray-600 text-sm mb-4">
              Create custom patterns with highlighter tiles
            </p>
            
            <div className="space-y-2 text-sm">
              <p className="flex items-center gap-2 text-gray-700">
                <span className="w-1.5 h-1.5 bg-purple-500 rounded-full"></span>
                Add highlighter tiles
              </p>
              <p className="flex items-center gap-2 text-gray-700">
                <span className="w-1.5 h-1.5 bg-purple-500 rounded-full"></span>
                Apply random patterns
              </p>
              <p className="flex items-center gap-2 text-gray-700">
                <span className="w-1.5 h-1.5 bg-purple-500 rounded-full"></span>
                Shuffle pattern variants
              </p>
              <p className="flex items-center gap-2 text-gray-700">
                <span className="w-1.5 h-1.5 bg-purple-500 rounded-full"></span>
                Grid selection tools
              </p>
            </div>
          </button>

        </div>

        {/* Info */}
        <div className="mt-6 bg-gray-50 rounded-lg p-4 border border-gray-200">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-700">
                <strong>Tip:</strong> Start with View Mode to see the room first. 
                You can always return and select Highlighter Mode for advanced pattern creation.
              </p>
            </div>
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

  // ✅ KEY FIX: Handle room selection with drawing room bypass
  const handleRoomSelect = (roomType: string) => {
    console.log('🎯 Room selected:', roomType);
    
    // ✅ DRAWING ROOM: Skip mode selection, go directly to view
    if (roomType === 'drawing') {
      console.log('🛋️ Drawing Room detected - Skipping mode selection, navigating directly');
      
      const roomData = ROOM_OPTIONS.find(r => r.type === 'drawing');
      if (!roomData || !tileId) return;

      // Save dimensions
      const ROOM_CONFIG_VERSION = '2.0';
      const dimensionData = {
        width: roomData.defaultWidth,
        depth: roomData.defaultDepth,
        height: roomData.defaultHeight,
        timestamp: Date.now(),
        version: ROOM_CONFIG_VERSION,
        mode: 'view'  // Always 'view' for drawing room
      };

      localStorage.setItem(`room_dimensions_drawing`, JSON.stringify(dimensionData));
      
      setSelectedRoom('drawing');
      
      if (navigator.vibrate) {
        navigator.vibrate([50, 30, 50]);
      }
      
      console.log('✅ Navigating to Drawing Room in View Mode:', {
        tileId,
        dimensions: `${roomData.defaultWidth}' × ${roomData.defaultDepth}' × ${roomData.defaultHeight}'`,
        mode: 'view'
      });
      
      // Navigate directly without mode parameter (drawing room always uses view mode internally)
      setTimeout(() => {
        navigate(`/3d-view/${tileId}/drawing`);
      }, 150);
      
      return;
    }
    
    // ✅ KITCHEN/BATHROOM: Show mode selection modal
    console.log('🍳🛁 Kitchen/Bathroom detected - Showing mode selection');
    setPendingRoomType(roomType);
    setShowModeSelector(true);
  };

  const handleModeSelect = (mode: RoomMode) => {
    if (!pendingRoomType || !tileId) return;

    const roomData = ROOM_OPTIONS.find(r => r.type === pendingRoomType);
    if (!roomData) return;

    // Save dimensions
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
        <div className="text-center max-w-md">
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
        <div className="max-w-7xl mx-auto px-4 lg:px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors p-2 -ml-2 rounded-lg hover:bg-gray-100"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back</span>
            </button>
          </div>
        </div>
      </header>

      {/* ERROR TOAST */}
      {error && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 max-w-md w-full mx-4 animate-slide-down">
          <div className="bg-red-500 text-white px-6 py-4 rounded-lg shadow-2xl flex items-center gap-3">
            <AlertCircle className="w-6 h-6 flex-shrink-0" />
            <p className="font-medium flex-1">{error}</p>
            <button onClick={() => setError(null)} className="ml-auto p-1">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* MAIN CONTENT */}
      <main className="max-w-7xl mx-auto px-4 lg:px-6 py-12">
        
        {/* Tile Info */}
        {tile && (
          <section className="bg-white rounded-2xl shadow-lg p-6 mb-8 flex items-center gap-6">
            <img
              src={tile.imageUrl}
              alt={tile.name}
              className="w-24 h-24 object-cover rounded-lg ring-2 ring-blue-500/30"
            />
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-1">{tile.name}</h2>
              <p className="text-gray-600">
                {tile.size} • <span className="text-green-600 font-semibold">₹{tile.price}/sq.ft</span>
              </p>
            </div>
          </section>
        )}

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">Choose a Room</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Select a room to view this tile in realistic 3D
          </p>
        </div>

        {/* Room Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {ROOM_OPTIONS.map((room) => (
            <button
              key={room.id}
              onClick={() => handleRoomSelect(room.type)}
              disabled={selectedRoom === room.type}
              className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 text-left disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              <div className="relative h-48 bg-gray-200">
                <img
                  src={room.thumbnail}
                  alt={room.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                
                <div className="absolute top-4 right-4 bg-white rounded-full w-16 h-16 flex items-center justify-center text-4xl shadow-lg">
                  {room.icon}
                </div>

                {selectedRoom === room.type && (
                  <div className="absolute inset-0 bg-blue-600/20 backdrop-blur-sm flex items-center justify-center">
                    <Loader className="w-8 h-8 animate-spin text-white" />
                  </div>
                )}
              </div>

              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {room.name}
                </h3>
                <p className="text-gray-600 mb-4">{room.description}</p>

                <div className="text-blue-600 font-semibold flex items-center justify-center gap-2">
                  <span>Select Room</span>
                  <span className="text-xl">→</span>
                </div>
              </div>
            </button>
          ))}
        </div>

      </main>

      {/* MODE SELECTION MODAL - Only for Kitchen/Bathroom */}
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