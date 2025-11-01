
import React from 'react';
import { Smartphone, QrCode, Download} from 'lucide-react';

export const MobileAppInfo: React.FC = () => {
  return (
    <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6 mb-4 sm:mb-6">
      <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
        <Smartphone className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-purple-600 mt-0.5 sm:mt-1 flex-shrink-0" />
        <div className="flex-1 w-full min-w-0">
          <h3 className="text-lg sm:text-xl font-bold text-purple-800 mb-1 sm:mb-2">Mobile App Coming Soon!</h3>
          <p className="text-sm sm:text-base text-purple-700 mb-3 sm:mb-4">
            Scan QR codes on tiles in physical showrooms to instantly view them in 3D on your mobile device.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3 md:gap-4 mb-3 sm:mb-4">
            <div className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 bg-white rounded-lg">
              <QrCode className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="font-medium text-gray-800 text-xs sm:text-sm md:text-base truncate">Scan QR Codes</p>
                <p className="text-xs sm:text-sm text-gray-600 truncate">On physical tiles</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 bg-white rounded-lg">
              <Smartphone className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="font-medium text-gray-800 text-xs sm:text-sm md:text-base truncate">3D Visualization</p>
                <p className="text-xs sm:text-sm text-gray-600 truncate">On your phone</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 bg-white rounded-lg">
              <Download className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="font-medium text-gray-800 text-xs sm:text-sm md:text-base truncate">Save Favorites</p>
                <p className="text-xs sm:text-sm text-gray-600 truncate">Sync across devices</p>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row flex-wrap gap-2 sm:gap-3">
            <button 
              disabled
              className="flex items-center justify-center sm:justify-start gap-1.5 sm:gap-2 bg-gray-300 text-gray-500 px-3 sm:px-4 py-2 rounded-lg cursor-not-allowed text-xs sm:text-sm"
            >
              <Download className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
              <span className="hidden sm:inline">Download for iOS (Coming Soon)</span>
              <span className="sm:hidden">iOS App (Coming Soon)</span>
            </button>
            <button 
              disabled
              className="flex items-center justify-center sm:justify-start gap-1.5 sm:gap-2 bg-gray-300 text-gray-500 px-3 sm:px-4 py-2 rounded-lg cursor-not-allowed text-xs sm:text-sm"
            >
              <Download className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
              <span className="hidden sm:inline">Download for Android (Coming Soon)</span>
              <span className="sm:hidden">Android App (Coming Soon)</span>
            </button>
          </div>
          
          <div className="mt-3 sm:mt-4 p-2.5 sm:p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-xs sm:text-sm text-blue-800">
              <strong>For now:</strong> You can scan QR codes with any QR code reader app, and it will open the web version 
              with the selected tile automatically loaded.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};