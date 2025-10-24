// src/components/FloatingQRButton.tsx
import React, { useState } from 'react';
import { Camera, Scan } from 'lucide-react';
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
        className="fixed bottom-6 right-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-full shadow-2xl hover:shadow-3xl transform hover:scale-110 transition-all duration-300 z-40 group"
        title="Scan QR Code"
      >
        <div className="relative">
          <Scan className="w-7 h-7" />
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
        </div>
        
        {/* Tooltip */}
        <div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-black text-white text-sm rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          Scan Tile QR Code
          <div className="absolute top-full right-6 -mt-1 border-4 border-transparent border-t-black"></div>
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