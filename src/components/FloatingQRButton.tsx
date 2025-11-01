
// src/components/FloatingQRButton.tsx
import React, { useState } from 'react';
import {Scan } from 'lucide-react';
import { QRScanner } from './QRScanner';
import { useNavigate } from 'react-router-dom';

export const FloatingQRButton: React.FC = () => {
  const [showScanner, setShowScanner] = useState(false);
  const navigate = useNavigate();

  const handleScanSuccess = async (data: any) => {
    setShowScanner(false);

    if (data.type === 'tile_viewer' && data.tileId) {
      // Navigate to tile details page
      navigate(`/tile/${data.tileId}`);
    } else if (data.type === 'manual_entry' && data.tileCode) {
      // Search by tile code
      navigate(`/tile/search?code=${data.tileCode}`);
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setShowScanner(true)}
        className="fixed bottom-4 right-4 sm:bottom-5 sm:right-5 md:bottom-6 md:right-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-3 sm:p-3.5 md:p-4 rounded-full shadow-2xl hover:shadow-3xl transform hover:scale-110 active:scale-95 transition-all duration-300 z-40 group"
        title="Scan QR Code"
      >
        <div className="relative">
          <Scan className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" />
          <div className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 w-2 h-2 sm:w-2.5 sm:h-2.5 md:w-3 md:h-3 bg-green-400 rounded-full animate-pulse"></div>
        </div>
        
        {/* Tooltip */}
        <div className="absolute bottom-full right-0 mb-2 px-2 sm:px-3 py-1.5 sm:py-2 bg-black text-white text-xs sm:text-sm rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          Scan Tile QR Code
          <div className="absolute top-full right-4 sm:right-6 -mt-1 border-4 border-transparent border-t-black"></div>
        </div>
      </button>

      {/* QR Scanner Modal */}
      {showScanner && (
        <QRScanner
          onScanSuccess={handleScanSuccess}
          onClose={() => setShowScanner(false)}
        />
      )}
    </>
  );
};