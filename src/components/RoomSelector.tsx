import React from 'react';
// import { Room } from '../types';
// import { useAppStore } from '../stores/appStore';

interface RoomSelectorProps {
  // rooms: Room[];
}

export const RoomSelector: React.FC<RoomSelectorProps> = ({ rooms }) => {
  // const { selectedRoom, setSelectedRoom } = useAppStore();

  return (
  //   <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
  //     <h2 className="text-2xl font-bold text-gray-800 mb-4">Select Room Type</h2>
  //     <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
  //       {rooms.map((room) => (
  //         <div
  //           key={room.id}
  //           onClick={() => setSelectedRoom(room)}
  //           className={`
  //             relative overflow-hidden rounded-lg cursor-pointer transition-all duration-300
  //             ${selectedRoom?.id === room.id 
  //               ? 'ring-4 ring-blue-500 shadow-xl' 
  //               : 'hover:shadow-lg hover:-translate-y-1'
  //             }
  //           `}
  //         >
  //           <div className="aspect-video">
  //             <img
  //               src={room.thumbnail}
  //               alt={room.name}
  //               className="w-full h-full object-cover"
  //             />
  //           </div>
  //           <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
  //             <div className="p-4 text-white">
  //               <h3 className="font-bold text-lg">{room.name}</h3>
  //               <p className="text-sm opacity-90">{room.description}</p>
  //             </div>
  //           </div>
  //           {selectedRoom?.id === room.id && (
  //             <div className="absolute top-2 right-2 bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center">
  //               ✓
  //             </div>
  //           )}
  //         </div>
  //       ))}
  //     </div>
  //   </div>
  // );
  <>
  </>
  )
};