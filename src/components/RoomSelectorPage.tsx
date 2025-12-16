  
// src/pages/RoomSelectorPage.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader, AlertCircle, CheckCircle, X } from 'lucide-react';
import { getTileById } from '../lib/firebaseutils';
import { Tile } from '../types';

interface RoomOption {
  id: string;
  name: string;
  type: 'drawing' | 'kitchen' | 'bathroom';
  icon: string;
  description: string;
  thumbnail: string;
  surfaceOptions: string[];
}

const ROOM_OPTIONS: RoomOption[] = [
  {
    id: 'drawing',
    name: 'Drawing Room',
    type: 'drawing',
    icon: '🛋️',
    description: 'See how tiles look in your living space',
    thumbnail: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=400',
    surfaceOptions: ['floor']
  },
  {
    id: 'kitchen',
    name: 'Kitchen',
    type: 'kitchen',
    icon: '🍳',
    description: 'Visualize floor and backsplash tiles',
    thumbnail: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=400',
    surfaceOptions: ['floor', 'wall']
  },
  {
    id: 'bathroom',
    name: 'Bathroom',
    type: 'bathroom',
    icon: '🛁',
    description: 'Preview floor and wall tile combinations',
    thumbnail: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=400',
    surfaceOptions: ['floor', 'wall']
  }
];

export const RoomSelectorPage: React.FC = () => {
  const { tileId } = useParams<{ tileId: string }>();
  const navigate = useNavigate();
  const [tile, setTile] = useState<Tile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageLoadErrors, setImageLoadErrors] = useState<Set<string>>(new Set());
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);

  useEffect(() => {
    loadTileData();
  }, [tileId]);

  // Auto-clear error messages
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 5000);
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
      setError('Failed to load tile data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRoomSelect = (roomType: string) => {
    setSelectedRoom(roomType);
    
    // Haptic feedback
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
    
    // Small delay for visual feedback
    setTimeout(() => {
      navigate(`/3d-view/${tileId}/${roomType}`);
    }, 150);
  };

  const handleImageError = (roomId: string) => {
    setImageLoadErrors(prev => new Set(prev).add(roomId));
  };

  const filterRoomsByTileCategory = () => {
    if (!tile) return ROOM_OPTIONS;

    // If tile is floor only, show all rooms (but limited surfaces)
    // If tile is wall only, show kitchen and bathroom
    // If tile is both, show all rooms with all surfaces

    if (tile.category === 'wall') {
      return ROOM_OPTIONS.filter(room => room.type !== 'drawing');
    }

    return ROOM_OPTIONS;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 px-4">
        <div className="text-center">
          <Loader className="w-12 h-12 sm:w-16 sm:h-16 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-700 text-base sm:text-lg font-medium">Loading room options...</p>
          <p className="text-gray-500 text-xs sm:text-sm mt-2">Please wait a moment</p>
        </div>
      </div>
    );
  }

  if (error && !tile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 px-4">
        <div className="text-center max-w-md">
          <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
            <AlertCircle className="w-12 h-12 sm:w-16 sm:h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Oops!</h2>
            <p className="text-gray-600 text-sm sm:text-base mb-6">{error}</p>
            <button
              onClick={() => navigate('/')}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 active:bg-blue-800 transition-colors touch-manipulation"
            >
              Go Back Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  const availableRooms = filterRoomsByTileCategory();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-sm shadow-sm sticky top-0 z-20 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-3 sm:py-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 sm:gap-2 text-gray-700 h
            
            
            over:text-blue-600 transition-colors touch-manipulation p-2 -ml-2 rounded-lg hover:bg-gray-100"
            aria-label="Go back to tile details"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="font-medium text-sm sm:text-base">Back to Tile Details</span>
          </button>
        </div>
      </header>

      {/* Error Message */}
      {error && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 max-w-md w-full mx-4 animate-slide-down">
          <div className="bg-red-500 text-white px-4 sm:px-6 py-3 sm:py-4 rounded-lg shadow-2xl flex items-center gap-2 sm:gap-3">
            <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" />
            <p className="font-medium text-sm sm:text-base flex-1">{error}</p>
            <button 
              onClick={() => setError(null)} 
              className="ml-auto touch-manipulation p-1"
              aria-label="Close error message"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Content */}
      <main className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-6 sm:py-8 lg:py-12">
        {/* Tile Info Banner */}
        {tile && (
          <section 
            className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 mb-6 sm:mb-8 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6"
            aria-label="Selected tile information"
          >
            <img
              src={tile.imageUrl}
              alt={tile.name}
              className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-lg ring-2 ring-blue-500/30 flex-shrink-0"
              loading="eager"
              onError={(e) => {
                e.currentTarget.src = 'https://via.placeholder.com/150?text=Tile';
              }}
            />
            <div className="flex-1 min-w-0">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1 truncate">{tile.name}</h2>
              <p className="text-gray-600 text-sm sm:text-base">
                {tile.size} • <span className="text-green-600 font-semibold">₹{tile.price}/sq.ft</span>
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                <span className="px-2 sm:px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs sm:text-sm font-medium">
                  {tile.category}
                </span>
              </div>
            </div>
          </section>
        )}

        {/* Room Selection Header */}
        <div className="text-center mb-8 sm:mb-12 px-4">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4">
            Choose a Room
          </h1>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
            Select where you'd like to see this tile in realistic 3D view
          </p>
        </div>

        {/* Room Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12">
          {availableRooms.map((room) => {
            const isSelected = selectedRoom === room.type;
            const hasImageError = imageLoadErrors.has(room.id);
            
            return (
              <button
                key={room.id}
                onClick={() => handleRoomSelect(room.type)}
                disabled={isSelected}
                className={`group bg-white rounded-xl sm:rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transform hover:-translate-y-1 sm:hover:-translate-y-2 transition-all duration-300 touch-manipulation text-left ${
                  isSelected ? 'ring-4 ring-blue-500 scale-[0.98]' : ''
                }`}
                aria-label={`View ${room.name} in 3D`}
              >
                {/* Room Image */}
                <div className="relative h-40 sm:h-48 overflow-hidden bg-gray-200">
                  {!hasImageError ? (
                    <img
                      src={room.thumbnail}
                      alt={`${room.name} preview`}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      loading="lazy"
                      onError={() => handleImageError(room.id)}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-300 to-gray-400">
                      <span className="text-6xl sm:text-7xl">{room.icon}</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                  
                  {/* Room Icon */}
                  <div className="absolute top-3 sm:top-4 right-3 sm:right-4 bg-white rounded-full w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center text-3xl sm:text-4xl shadow-lg transform group-hover:scale-110 transition-transform">
                    {room.icon}
                  </div>

                  {/* Loading indicator when selected */}
                  {isSelected && (
                    <div className="absolute inset-0 bg-blue-600/20 backdrop-blur-sm flex items-center justify-center">
                      <Loader className="w-8 h-8 animate-spin text-white" />
                    </div>
                  )}
                </div>

                {/* Room Info */}
                <div className="p-4 sm:p-6">
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {room.name}
                  </h3>
                  <p className="text-gray-600 text-sm sm:text-base mb-3 sm:mb-4 line-clamp-2">
                    {room.description}
                  </p>

                  {/* Surface Tags */}
                  <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-3 sm:mb-4">
                    {room.surfaceOptions.map((surface) => {
                      // Check if tile category supports this surface
                      const isSupported = 
                        tile?.category === 'both' ||
                        (tile?.category === surface) ||
                        (tile?.category === 'floor' && surface === 'floor');

                      return (
                        <span
                          key={surface}
                          className={`px-2.5 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium transition-colors ${
                            isSupported
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-gray-100 text-gray-400'
                          }`}
                        >
                          {isSupported && <CheckCircle className="inline w-3 h-3 mr-1" />}
                          {surface.charAt(0).toUpperCase() + surface.slice(1)}
                        </span>
                      );
                    })}
                  </div>

                  {/* CTA */}
                  <div className="text-blue-600 font-semibold text-sm sm:text-base flex items-center justify-center gap-2 group-hover:gap-3 sm:group-hover:gap-4 transition-all">
                    <span>View in 3D</span>
                    <span className="text-lg sm:text-xl transform group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                </div>
              </button>

              
            );
          })}
        </div>

        {/* Info Section */}
        <section 
          className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-6 sm:p-8"
          aria-label="3D Viewer features"
        >
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 text-center">
            🎨 What You Can Do
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <div className="text-center p-4 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="bg-blue-100 w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-3 transform hover:scale-110 transition-transform">
                <span className="text-2xl sm:text-3xl">🔄</span>
              </div>
              <h4 className="font-bold text-gray-900 mb-2 text-sm sm:text-base">360° Rotation</h4>
              <p className="text-gray-600 text-xs sm:text-sm">
                View from every angle with smooth rotation
              </p>
            </div>
            <div className="text-center p-4 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="bg-purple-100 w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-3 transform hover:scale-110 transition-transform">
                <span className="text-2xl sm:text-3xl">🎯</span>
              </div>
              <h4 className="font-bold text-gray-900 mb-2 text-sm sm:text-base">Surface Toggle</h4>
              <p className="text-gray-600 text-xs sm:text-sm">
                Switch between floor and wall application
              </p>
            </div>
            <div className="text-center p-4 rounded-lg hover:bg-gray-50 transition-colors sm:col-span-2 lg:col-span-1">
              <div className="bg-green-100 w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mx-auto mb-3 transform hover:scale-110 transition-transform">
                <span className="text-2xl sm:text-3xl">📏</span>
              </div>
              <h4 className="font-bold text-gray-900 mb-2 text-sm sm:text-base">Size Options</h4>
              <p className="text-gray-600 text-xs sm:text-sm">
                Try different tile sizes and see the difference
              </p>
            </div>
          </div>
        </section>

        {/* Additional Info */}
        <div className="mt-6 sm:mt-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 sm:p-6 border border-blue-200">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white text-lg sm:text-xl">💡</span>
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-gray-900 mb-1 text-sm sm:text-base">Pro Tip</h4>
              <p className="text-gray-700 text-xs sm:text-sm">
                For the best experience, try viewing the 3D visualization in a well-lit environment. 
                You can rotate, zoom, and pan to see every detail of how the tiles will look in your space.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer Info */}
      <footer className="bg-white/80 backdrop-blur-sm border-t border-gray-200 py-4 sm:py-6 mt-8">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
          <p className="text-center text-gray-600 text-xs sm:text-sm">
            Select a room above to start visualizing your tiles in 3D
          </p>
        </div>
      </footer>
    </div>
  );
};

