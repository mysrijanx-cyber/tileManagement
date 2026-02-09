// src/components/RoomDimensionModal.tsx
import React, { useState, useEffect } from 'react';
import { X, Ruler, CheckCircle, AlertCircle } from 'lucide-react';

interface RoomDimensionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (width: number, depth: number, height: number) => void;
  roomName: string;
  defaultWidth?: number;
  defaultDepth?: number;
  defaultHeight?: number; // ✅ ADD THIS
}

export const RoomDimensionModal: React.FC<RoomDimensionModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  roomName,
  defaultWidth = 10,
  defaultDepth = 12,
  defaultHeight = 9,
}) => {
  const [width, setWidth] = useState<string>(defaultWidth.toString());
  const [depth, setDepth] = useState<string>(defaultDepth.toString());
  const [height, setHeight] = useState<string>('9');
  const [error, setError] = useState<string>('');

//   useEffect(() => {
//     if (isOpen) {
//       setWidth(defaultWidth.toString());
//       setDepth(defaultDepth.toString());
//       setHeight('9');
//       setError('');
//     }
//   }, [isOpen, defaultWidth, defaultDepth]);
useEffect(() => {
    if (isOpen) {
      setWidth(defaultWidth.toString());
      setDepth(defaultDepth.toString());
      setHeight(defaultHeight.toString()); // ✅ USE PROP
      setError('');
    }
  }, [isOpen, defaultWidth, defaultDepth, defaultHeight]); 
const validateAndSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  
  const widthNum = parseFloat(width);
  const depthNum = parseFloat(depth);
  const heightNum = parseFloat(height);

  // ✅ Room-specific minimums
  const minDimensions = {
    drawing: { width: 15, depth: 20, height: 9 },
    kitchen: { width: 10, depth: 12, height: 9 },
    bathroom: { width: 8, depth: 10, height: 9 }
  };

  const roomKey = roomName.toLowerCase() as 'drawing' | 'kitchen' | 'bathroom';
  const min = minDimensions[roomKey] || { width: 8, depth: 10, height: 9 };

  if (isNaN(widthNum) || widthNum < min.width || widthNum > 100) {
    setError(`Width must be between ${min.width} and 100 feet for ${roomName}`);
    return;
  }

  if (isNaN(depthNum) || depthNum < min.depth || depthNum > 100) {
    setError(`Depth must be between ${min.depth} and 100 feet for ${roomName}`);
    return;
  }

  if (isNaN(heightNum) || heightNum < min.height || heightNum > 20) {
    setError(`Height must be between ${min.height} and 20 feet`);
    return;
  }

  onSubmit(widthNum, depthNum, heightNum);
};
  if (!isOpen) return null;

  const widthNum = parseFloat(width) || 0;
  const depthNum = parseFloat(depth) || 0;
  const area = widthNum && depthNum ? (widthNum * depthNum).toFixed(1) : '0';

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-slideUp">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <Ruler className="w-6 h-6 text-blue-600" />
            Set {roomName} Dimensions
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={validateAndSubmit} className="space-y-4">
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <p className="text-sm text-blue-800 mb-2 font-medium">
              📏 Enter your actual room dimensions
            </p>
            <p className="text-xs text-blue-600">
              All measurements in feet. The 3D room will scale proportionally.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Width (feet)
              </label>
              <input
                type="number"
                value={width}
                onChange={(e) => {
                  setWidth(e.target.value);
                  setError('');
                }}
                placeholder="10"
                step="0.1"
                min="1"
                max="100"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg font-medium transition-all"
                required
                autoFocus
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Depth (feet)
              </label>
              <input
                type="number"
                value={depth}
                onChange={(e) => {
                  setDepth(e.target.value);
                  setError('');
                }}
                placeholder="12"
                step="0.1"
                min="1"
                max="100"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg font-medium transition-all"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Ceiling Height (feet)
            </label>
<input
  type="number"
  value={height}
  onChange={(e) => {
    setHeight(e.target.value);
    setError('');
  }}
  placeholder="11"
  step="0.1"
  min="9"      // ✅ Changed from 7
  max="20"
  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg font-medium transition-all"
  required
/>
          </div>

          {widthNum > 0 && depthNum > 0 && (
            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <p className="font-semibold text-green-800">Room Preview</p>
              </div>
              <div className="text-sm text-green-700 space-y-1">
                <p>Dimensions: {width} × {depth} × {height} feet</p>
                <p>Floor Area: {area} sq ft</p>
                <p>Shape: {Math.abs(widthNum - depthNum) < 0.1 ? 'Square' : widthNum > depthNum ? 'Wide Rectangle' : 'Long Rectangle'}</p>
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-semibold transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <Ruler className="w-5 h-5" />
              Apply Dimensions
            </button>
          </div>
        </form>

        <div className="mt-4 bg-gray-50 rounded-lg p-3 text-xs text-gray-600">
          <p className="font-semibold mb-1">💡 Tips:</p>
          <ul className="space-y-0.5 ml-4 list-disc">
            <li>Measure wall-to-wall distance</li>
            <li>Standard ceiling: 9-10 feet</li>
            <li>Furniture will auto-scale</li>
          </ul>
        </div>
      </div>
    </div>
  );
};