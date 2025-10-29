// import React from 'react';
// import { RoomSelector } from './RoomSelector';
// import { TileCatalog } from './TileCatalog';
// import { Room3D } from './Room3D';
// import { TileApplication } from './TileApplication';
// import { MobileAppInfo } from './MobileAppInfo';
// import { useAppStore } from '../stores/appStore';
// import { mockRooms } from '../data/mockData';

// export const PublicShowroom: React.FC = () => {
//   const { currentShowroom, selectedRoom } = useAppStore();

//   return (
//     <div className="space-y-8">
//       <MobileAppInfo />
//       <RoomSelector rooms={mockRooms} />
      
//       <div className="flex items-center justify-between">
//         <h2 className="text-2xl font-bold text-gray-800">Tile Catalog</h2>
//         <div className="text-sm text-gray-600">
//           Browse our collection of premium tiles in 3D
//         </div>
//       </div>
      
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//         <div className="lg:col-span-2">
//           <TileCatalog 
//             tiles={currentShowroom?.tiles || []} 
//             showFavoriteButton={false}
//           />
//         </div>
        
//         <div className="space-y-6">
//           <TileApplication />
//           {selectedRoom && <Room3D />}
//         </div>
//       </div>
//     </div>
//   );
// }; 

import React from 'react';
import { RoomSelector } from './RoomSelector';
import { TileCatalog } from './TileCatalog';
import { Room3D } from './Room3D';
import { TileApplication } from './TileApplication';
import { MobileAppInfo } from './MobileAppInfo';
import { useAppStore } from '../stores/appStore';
import { mockRooms } from '../data/mockData';

export const PublicShowroom: React.FC = () => {
  const { currentShowroom, selectedRoom } = useAppStore();

  return (
    <div className="space-y-4 sm:space-y-6 md:space-y-8">
      <MobileAppInfo />
      <RoomSelector rooms={mockRooms} />
      
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-4">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Tile Catalog</h2>
        <div className="text-xs sm:text-sm text-gray-600">
          Browse our collection of premium tiles in 3D
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
        <div className="lg:col-span-2 order-2 lg:order-1">
          <TileCatalog 
            tiles={currentShowroom?.tiles || []} 
            showFavoriteButton={false}
          />
        </div>
        
        <div className="space-y-4 sm:space-y-6 order-1 lg:order-2">
          <TileApplication />
          {selectedRoom && <Room3D />}
        </div>
      </div>
    </div>
  );
};