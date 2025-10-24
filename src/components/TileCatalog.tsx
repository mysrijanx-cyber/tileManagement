import React, { useState } from 'react';
import { Search, Filter, Heart } from 'lucide-react';
import { Tile } from '../types';
import { TileCard } from './TileCard';

interface TileCatalogProps {
  tiles: Tile[];
  onToggleFavorite?: (tileId: string) => void;
  favorites?: string[];
  showFavoriteButton?: boolean;
}

export const TileCatalog: React.FC<TileCatalogProps> = ({ 
  tiles, 
  onToggleFavorite, 
  favorites = [], 
  showFavoriteButton = false 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const filteredTiles = tiles.filter(tile => {
    const matchesSearch = tile.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || tile.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    // <div className="bg-white rounded-xl shadow-lg p-6">
    //   <div className="flex flex-col md:flex-row gap-4 mb-6">
    //     <div className="relative flex-1">
    //       <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
    //       <input
    //         type="text"
    //         placeholder="Search tiles..."
    //         value={searchTerm}
    //         onChange={(e) => setSearchTerm(e.target.value)}
    //         className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
    //       />
    //     </div>
    //     <div className="flex items-center gap-2">
    //       <Filter className="text-gray-400 w-5 h-5" />
    //       <select
    //         value={categoryFilter}
    //         onChange={(e) => setCategoryFilter(e.target.value)}
    //         className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
    //       >
    //         <option value="all">All Categories</option>
    //         <option value="floor">Floor Only</option>
    //         <option value="wall">Wall Only</option>
    //         <option value="both">Floor & Wall</option>
    //       </select>
    //     </div>
    //   </div>

    //   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
    //     {filteredTiles.map((tile) => (
    //       <TileCard 
    //         key={tile.id} 
    //         tile={tile} 
    //         onToggleFavorite={onToggleFavorite}
    //         isFavorite={favorites.includes(tile.id)}
    //         showFavoriteButton={showFavoriteButton}
    //       />
    //     ))}
    //   </div>

    //   {filteredTiles.length === 0 && (
    //     <div className="text-center py-12">
    //       <p className="text-gray-500 text-lg">No tiles found matching your criteria</p>
    //     </div>
    //   )}
    // </div>

    <>
    </>
  );
};