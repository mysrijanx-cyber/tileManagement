

import React from 'react';
import { RoomSelector } from './RoomSelector';
// import { Room3D } from './Room3D';
import { TileApplication } from './TileApplication';

export const PublicShowroom: React.FC = () => {
  // const { currentShowroom, selectedRoom } = useAppStore();

  return (
    <div className="space-y-4 sm:space-y-6 md:space-y-8">

      <RoomSelector/>
      
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-4">
  
        
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
        <div className="lg:col-span-2 order-2 lg:order-1">
         
        </div>
        
        <div className="space-y-4 sm:space-y-6 order-1 lg:order-2">
          <TileApplication />
         
        </div>
      </div>
    </div>
  );
};