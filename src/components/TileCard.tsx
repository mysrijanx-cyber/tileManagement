import React from 'react';
import { Heart } from 'lucide-react';
import { Tile } from '../types';
import { useAppStore } from '../stores/appStore';
import { trackTileView } from '../lib/firebaseutils';

interface TileCardProps {
  tile: Tile;
  onToggleFavorite?: (tileId: string) => void;
  isFavorite?: boolean;
  showFavoriteButton?: boolean;
}

export const TileCard: React.FC<TileCardProps> = ({ 
  tile, 
  onToggleFavorite, 
  isFavorite = false, 
  showFavoriteButton = false 
}) => {
  const { selectedTile, setSelectedTile } = useAppStore();
  const isSelected = selectedTile?.id === tile.id;

  const handleTileClick = () => {
    setSelectedTile(tile);
    trackTileView(tile.id, tile.showroomId);
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onToggleFavorite) {
      onToggleFavorite(tile.id);
    }
  };

  return (
    <div
      onClick={handleTileClick}
      className={`
        bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer
        transform hover:-translate-y-1 ${isSelected ? 'ring-4 ring-blue-500' : ''}
      `}
    >
      <div className="aspect-square overflow-hidden rounded-t-xl">
        {showFavoriteButton && (
          <button
            onClick={handleFavoriteClick}
            className={`absolute top-2 right-2 z-10 p-2 rounded-full transition-all ${
              isFavorite 
                ? 'bg-red-500 text-white' 
                : 'bg-white/80 text-gray-600 hover:bg-white hover:text-red-500'
            }`}
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
          </button>
        )}
        <img
          src={tile.imageUrl}
          alt={tile.name}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-gray-800 mb-1">{tile.name}</h3>
        <p className="text-sm text-gray-600 mb-2">{tile.size}</p>
        <div className="flex justify-between items-center">
          <span className="text-lg font-bold text-blue-600">₹{tile.price}</span>
          <span className={`
            px-2 py-1 rounded-full text-xs font-medium
            ${tile.inStock 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
            }
          `}>
            {tile.inStock ? 'In Stock' : 'Out of Stock'}
          </span>
        </div>
        <div className="mt-2">
          <span className={`
            px-2 py-1 rounded-full text-xs font-medium
            ${tile.category === 'floor' ? 'bg-blue-100 text-blue-800' :
              tile.category === 'wall' ? 'bg-purple-100 text-purple-800' :
              'bg-gray-100 text-gray-800'
            }
          `}>
            {tile.category === 'both' ? 'Floor & Wall' : 
             tile.category === 'floor' ? 'Floor Only' : 'Wall Only'}
          </span>
        </div>
      </div>
    </div>
  );
};