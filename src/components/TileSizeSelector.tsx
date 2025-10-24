// src/components/TileSizeSelector.tsx
import React from 'react';
import { Check } from 'lucide-react';

interface TileSize {
  width: number;
  height: number;
  label: string;
  description: string;
}

interface TileSizeSelectorProps {
  availableSizes: TileSize[];
  selectedSize: TileSize;
  onSizeChange: (size: TileSize) => void;
  roomSize?: { width: number; height: number }; // in meters
}

export const TileSizeSelector: React.FC<TileSizeSelectorProps> = ({
  availableSizes,
  selectedSize,
  onSizeChange,
  roomSize
}) => {
  const calculateTileCount = (tileSize: TileSize) => {
    if (!roomSize) return null;

    const tileSizeM = {
      width: tileSize.width / 100, // cm to m
      height: tileSize.height / 100
    };

    const tilesX = Math.ceil(roomSize.width / tileSizeM.width);
    const tilesY = Math.ceil(roomSize.height / tileSizeM.height);
    const total = tilesX * tilesY;

    return { tilesX, tilesY, total };
  };

  const getVisualDensity = (tileSize: TileSize) => {
    const area = (tileSize.width * tileSize.height) / 10000; // cm² to m²
    if (area < 0.12) return { level: 5, label: 'Very Busy' };
    if (area < 0.25) return { level: 4, label: 'Busy' };
    if (area < 0.45) return { level: 3, label: 'Balanced' };
    if (area < 0.75) return { level: 2, label: 'Spacious' };
    return { level: 1, label: 'Minimal' };
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-lg font-bold text-gray-800 mb-4">Select Tile Size</h3>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {availableSizes.map((size) => {
          const isSelected = 
            selectedSize.width === size.width && 
            selectedSize.height === size.height;
          const tileCount = calculateTileCount(size);
          const density = getVisualDensity(size);

          return (
            <button
              key={`${size.width}x${size.height}`}
              onClick={() => onSizeChange(size)}
              className={`
                relative p-4 rounded-lg border-2 transition-all duration-200
                ${isSelected
                  ? 'border-blue-600 bg-blue-50 shadow-md'
                  : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                }
              `}
            >
              {/* Selected Indicator */}
              {isSelected && (
                <div className="absolute top-2 right-2 bg-blue-600 text-white rounded-full p-1">
                  <Check className="w-4 h-4" />
                </div>
              )}

              {/* Size Label */}
              <div className="text-center mb-3">
                <div className="text-2xl font-bold text-gray-800">
                  {size.width}×{size.height}
                </div>
                <div className="text-xs text-gray-500 mt-1">{size.label}</div>
              </div>

              {/* Visual Density Indicator */}
              <div className="flex justify-center gap-1 mb-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={i}
                    className={`w-2 h-2 rounded-full ${
                      i < density.level
                        ? 'bg-blue-600'
                        : 'bg-gray-200'
                    }`}
                  />
                ))}
              </div>
              <div className="text-xs text-gray-600 text-center mb-2">
                {density.label}
              </div>

              {/* Tile Count */}
              {tileCount && (
                <div className="text-xs text-gray-500 text-center pt-2 border-t border-gray-200">
                  ~{tileCount.total} tiles
                  <div className="text-xs text-gray-400">
                    ({tileCount.tilesX}×{tileCount.tilesY})
                  </div>
                </div>
              )}

              {/* Description */}
              <div className="text-xs text-gray-500 text-center mt-2">
                {size.description}
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Size Info */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-blue-900">
              Selected: {selectedSize.width}×{selectedSize.height} cm
            </p>
            {roomSize && calculateTileCount(selectedSize) && (
              <p className="text-xs text-blue-700 mt-1">
                Total tiles needed: ~{calculateTileCount(selectedSize)?.total} pieces
              </p>
            )}
          </div>
          <div className="text-right">
            <p className="text-xs text-blue-700">Coverage per tile</p>
            <p className="text-sm font-bold text-blue-900">
              {((selectedSize.width * selectedSize.height) / 10000).toFixed(2)} m²
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};