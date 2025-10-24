
// src/pages/RoomSelectorPage.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader } from 'lucide-react';
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

  useEffect(() => {
    loadTileData();
  }, [tileId]);

  const loadTileData = async () => {
    if (!tileId) return;

    try {
      const tileData = await getTileById(tileId);
      setTile(tileData);
    } catch (err) {
      console.error('Error loading tile:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRoomSelect = (roomType: string) => {
    navigate(`/3d-view/${tileId}/${roomType}`);
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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader className="w-12 h-12 animate-spin text-blue-600" />
      </div>
    );
  }

  const availableRooms = filterRoomsByTileCategory();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to Tile Details</span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Tile Info Banner */}
        {tile && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 flex items-center gap-6">
            <img
              src={tile.imageUrl}
              alt={tile.name}
              className="w-24 h-24 object-cover rounded-lg"
            />
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-1">{tile.name}</h2>
              <p className="text-gray-600">{tile.size} • ₹{tile.price}/sq.ft</p>
            </div>
          </div>
        )}

        {/* Room Selection */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Choose a Room
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Select where you'd like to see this tile in realistic 3D view
          </p>
        </div>

        {/* Room Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {availableRooms.map((room) => (
            <button
              key={room.id}
              onClick={() => handleRoomSelect(room.type)}
              className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300"
            >
              {/* Room Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={room.thumbnail}
                  alt={room.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                
                {/* Room Icon */}
                <div className="absolute top-4 right-4 bg-white rounded-full w-16 h-16 flex items-center justify-center text-4xl shadow-lg">
                  {room.icon}
                </div>
              </div>

              {/* Room Info */}
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {room.name}
                </h3>
                <p className="text-gray-600 mb-4">{room.description}</p>

                {/* Surface Tags */}
                <div className="flex flex-wrap gap-2">
                  {room.surfaceOptions.map((surface) => {
                    // Check if tile category supports this surface
                    const isSupported = 
                      tile?.category === 'both' ||
                      (tile?.category === surface) ||
                      (tile?.category === 'floor' && surface === 'floor');

                    return (
                      <span
                        key={surface}
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          isSupported
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-gray-100 text-gray-400'
                        }`}
                      >
                        {surface.charAt(0).toUpperCase() + surface.slice(1)}
                      </span>
                    );
                  })}
                </div>

                {/* CTA */}
                <div className="mt-4 text-blue-600 font-semibold flex items-center justify-center gap-2 group-hover:gap-4 transition-all">
                  <span>View in 3D</span>
                  <span className="text-xl">→</span>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Info Section */}
        <div className="mt-12 bg-white rounded-2xl shadow-lg p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">
            🎨 What You Can Do
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-3xl">🔄</span>
              </div>
              <h4 className="font-bold text-gray-900 mb-2">360° Rotation</h4>
              <p className="text-gray-600 text-sm">
                View from every angle with smooth rotation
              </p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-3xl">🎯</span>
              </div>
              <h4 className="font-bold text-gray-900 mb-2">Surface Toggle</h4>
              <p className="text-gray-600 text-sm">
                Switch between floor and wall application
              </p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-3xl">📏</span>
              </div>
              <h4 className="font-bold text-gray-900 mb-2">Size Options</h4>
              <p className="text-gray-600 text-sm">
                Try different tile sizes and see the difference
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};