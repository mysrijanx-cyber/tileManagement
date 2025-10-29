

// import React, { useState } from 'react';
// import { Plus, Edit, Trash2, Upload, Save, BarChart3, TrendingUp, Eye, MousePointer } from 'lucide-react';
// import { Tile } from '../types';
// import { useAppStore } from '../stores/appStore';
// import { BulkUpload } from './BulkUpload';
// import { AnalyticsDashboard } from './AnalyticsDashboard';
// import { QRCodeManager } from './QRCodeManager';
// import { uploadTile, updateTile, deleteTile } from '../lib/firebaseutils';

// export const AdminPanel: React.FC = () => {
//   const { currentShowroom } = useAppStore();
//   const [isAddingTile, setIsAddingTile] = useState(false);
//   const [activeTab, setActiveTab] = useState<'tiles' | 'bulk' | 'analytics' | 'qrcodes'>('tiles');
//   const [editingTile, setEditingTile] = useState<Tile | null>(null);
//   const [newTile, setNewTile] = useState<Partial<Tile>>({
//     name: '',
//     category: 'both',
//     size: '',
//     price: 0,
//     inStock: true,
//     imageUrl: '',
//     textureUrl: ''
//   });

//   const handleAddTile = async () => {
//     try {
//       if (!currentShowroom) return;
      
//       const tileData = {
//         ...newTile,
//         id: `tile_${Date.now()}`,
//         showroomId: currentShowroom.id
//       };
      
//       await uploadTile(tileData);
      
//       setIsAddingTile(false);
//       setNewTile({
//         name: '',
//         category: 'both',
//         size: '',
//         price: 0,
//         inStock: true,
//         imageUrl: '',
//         textureUrl: ''
//       });
      
//       // Refresh the page or update the store
//       window.location.reload();
//     } catch (error) {
//       console.error('Error adding tile:', error);
//     }
//   };

//   const handleEditTile = async (tile: Tile) => {
//     setEditingTile(tile);
//     setNewTile(tile);
//     setIsAddingTile(false);
//   };

//   const handleUpdateTile = async () => {
//     try {
//       if (!editingTile) return;
      
//       await updateTile(editingTile.id, newTile);
      
//       setEditingTile(null);
//       setNewTile({
//         name: '',
//         category: 'both',
//         size: '',
//         price: 0,
//         inStock: true,
//         imageUrl: '',
//         textureUrl: ''
//       });
      
//       window.location.reload();
//     } catch (error) {
//       console.error('Error updating tile:', error);
//     }
//   };

//   const handleDeleteTile = async (tileId: string) => {
//     if (window.confirm('Are you sure you want to delete this tile?')) {
//       try {
//         await deleteTile(tileId);
//         window.location.reload();
//       } catch (error) {
//         console.error('Error deleting tile:', error);
//       }
//     }
//   };

//   return (
//     <div className="bg-white rounded-xl shadow-lg p-6">
//       <div className="flex items-center justify-between mb-6">
//         <h2 className="text-2xl font-bold text-gray-800">Admin Dashboard</h2>
//         <div className="flex gap-2">
//           <button
//             onClick={() => setActiveTab('tiles')}
//             className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
//               activeTab === 'tiles' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//             }`}
//           >
//             <Edit className="w-4 h-4" />
//             Tile Management
//           </button>
//           <button
//             onClick={() => setActiveTab('bulk')}
//             className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
//               activeTab === 'bulk' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//             }`}
//           >
//             <Upload className="w-4 h-4" />
//             Bulk Upload
//           </button>
//           <button
//             onClick={() => setActiveTab('analytics')}
//             className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
//               activeTab === 'analytics' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//             }`}
//           >
//             <BarChart3 className="w-4 h-4" />
//             Analytics
//           </button>
//           <button
//             onClick={() => setActiveTab('qrcodes')}
//             className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
//               activeTab === 'qrcodes' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//             }`}
//           >
//             <Upload className="w-4 h-4" />
//             QR Codes
//           </button>
//         </div>
//       </div>

//       {activeTab === 'tiles' && (
//         <>
//           <div className="flex justify-end mb-4">
//             <button
//               onClick={() => setIsAddingTile(true)}
//               className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
//             >
//               <Plus className="w-4 h-4" />
//               Add New Tile
//             </button>
//           </div>

//           {(isAddingTile || editingTile) && (
//             <div className="mb-6 p-6 border-2 border-dashed border-blue-300 rounded-xl bg-blue-50">
//               <h3 className="text-lg font-semibold mb-4">
//                 {editingTile ? 'Edit Tile' : 'Add New Tile'}
//               </h3>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <input
//                   type="text"
//                   placeholder="Tile Name"
//                   value={newTile.name}
//                   onChange={(e) => setNewTile({ ...newTile, name: e.target.value })}
//                   className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//                 />
//                 <select
//                   value={newTile.category}
//                   onChange={(e) => setNewTile({ ...newTile, category: e.target.value as any })}
//                   className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//                 >
//                   <option value="floor">Floor Only</option>
//                   <option value="wall">Wall Only</option>
//                   <option value="both">Floor & Wall</option>
//                 </select>
//                 <input
//                   type="text"
//                   placeholder="Size (e.g., 60x60 cm)"
//                   value={newTile.size}
//                   onChange={(e) => setNewTile({ ...newTile, size: e.target.value })}
//                   className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//                   list="tile-sizes"
//                 />
//                 <datalist id="tile-sizes">
//                   <option value="30x30 cm" />
//                   <option value="30x60 cm" />
//                   <option value="40x40 cm" />
//                   <option value="40x60 cm" />
//                   <option value="60x60 cm" />
//                   <option value="60x120 cm" />
//                   <option value="80x80 cm" />
//                   <option value="10x30 cm" />
//                   <option value="15x90 cm" />
//                   <option value="20x120 cm" />
//                   <option value="25x40 cm" />
//                   <option value="7.5x15 cm" />
//                   <option value="6x25 cm" />
//                   <option value="20x20 cm" />
//                   <option value="100x100 cm" />
//                   <option value="45x45 cm" />
//                   <option value="50x50 cm" />
//                   <option value="75x75 cm" />
//                 </datalist>
//                 <input
//                   type="number"
//                   placeholder="Price"
//                   value={newTile.price}
//                   onChange={(e) => setNewTile({ ...newTile, price: Number(e.target.value) })}
//                   className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//                 />
//                 <input
//                   type="url"
//                   placeholder="Image URL"
//                   value={newTile.imageUrl}
//                   onChange={(e) => setNewTile({ ...newTile, imageUrl: e.target.value })}
//                   className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//                 />
//                 <input
//                   type="url"
//                   placeholder="Texture URL"
//                   value={newTile.textureUrl}
//                   onChange={(e) => setNewTile({ ...newTile, textureUrl: e.target.value })}
//                   className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//                 />
//                 <div className="flex items-center gap-2">
//                   <input
//                     type="checkbox"
//                     id="inStock"
//                     checked={newTile.inStock}
//                     onChange={(e) => setNewTile({ ...newTile, inStock: e.target.checked })}
//                     className="w-4 h-4 text-blue-600"
//                   />
//                   <label htmlFor="inStock" className="text-sm font-medium text-gray-700">
//                     In Stock
//                   </label>
//                 </div>
//               </div>
//               <div className="flex gap-2 mt-4">
//                 <button
//                   onClick={editingTile ? handleUpdateTile : handleAddTile}
//                   className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
//                 >
//                   <Save className="w-4 h-4" />
//                   {editingTile ? 'Update Tile' : 'Save Tile'}
//                 </button>
//                 <button
//                   onClick={() => {
//                     setIsAddingTile(false);
//                     setEditingTile(null);
//                     setNewTile({
//                       name: '',
//                       category: 'both',
//                       size: '',
//                       price: 0,
//                       inStock: true,
//                       imageUrl: '',
//                       textureUrl: ''
//                     });
//                   }}
//                   className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
//                 >
//                   Cancel
//                 </button>
//               </div>
//             </div>
//           )}

//           <div className="overflow-x-auto">
//             <table className="w-full border-collapse">
//               <thead>
//                 <tr className="bg-gray-50">
//                   <th className="text-left p-3 font-semibold">Image</th>
//                   <th className="text-left p-3 font-semibold">Name</th>
//                   <th className="text-left p-3 font-semibold">Category</th>
//                   <th className="text-left p-3 font-semibold">Size</th>
//                   <th className="text-left p-3 font-semibold">Price</th>
//                   <th className="text-left p-3 font-semibold">Stock</th>
//                   <th className="text-left p-3 font-semibold">Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {currentShowroom?.tiles.map((tile) => (
//                   <tr key={tile.id} className="border-t hover:bg-gray-50">
//                     <td className="p-3">
//                       <img
//                         src={tile.imageUrl}
//                         alt={tile.name}
//                         className="w-12 h-12 object-cover rounded-lg"
//                       />
//                     </td>
//                     <td className="p-3 font-medium">{tile.name}</td>
//                     <td className="p-3">
//                       <span className={`
//                         px-2 py-1 rounded-full text-xs
//                         ${tile.category === 'floor' ? 'bg-blue-100 text-blue-800' :
//                           tile.category === 'wall' ? 'bg-purple-100 text-purple-800' :
//                           'bg-gray-100 text-gray-800'
//                         }
//                       `}>
//                         {tile.category === 'both' ? 'Floor & Wall' : tile.category}
//                       </span>
//                     </td>
//                     <td className="p-3">{tile.size}</td>
//                     <td className="p-3 font-semibold">₹{tile.price}</td>
//                     <td className="p-3">
//                       <span className={`
//                         px-2 py-1 rounded-full text-xs
//                         ${tile.inStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
//                       `}>
//                         {tile.inStock ? 'In Stock' : 'Out of Stock'}
//                       </span>
//                     </td>
//                     <td className="p-3">
//                       <div className="flex gap-2">
//                         <button 
//                           onClick={() => handleEditTile(tile)}
//                           className="p-1 text-blue-600 hover:bg-blue-100 rounded"
//                         >
//                           <Edit className="w-4 h-4" />
//                         </button>
//                         <button 
//                           onClick={() => handleDeleteTile(tile.id)}
//                           className="p-1 text-red-600 hover:bg-red-100 rounded"
//                         >
//                           <Trash2 className="w-4 h-4" />
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </>
//       )}

//       {activeTab === 'bulk' && <BulkUpload />}
      
//       {activeTab === 'analytics' && <AnalyticsDashboard />}
      
//       {activeTab === 'qrcodes' && (
//         <QRCodeManager 
//           tiles={currentShowroom?.tiles || []} 
//         />
//       )}
//     </div>
//   );
// };  
import React, { useState } from 'react';
import { Plus, Edit, Trash2, Upload, Save, BarChart3, TrendingUp, Eye, MousePointer } from 'lucide-react';
import { Tile } from '../types';
import { useAppStore } from '../stores/appStore';
import { BulkUpload } from './BulkUpload';
import { AnalyticsDashboard } from './AnalyticsDashboard';
import { QRCodeManager } from './QRCodeManager';
import { uploadTile, updateTile, deleteTile } from '../lib/firebaseutils';

export const AdminPanel: React.FC = () => {
  const { currentShowroom } = useAppStore();
  const [isAddingTile, setIsAddingTile] = useState(false);
  const [activeTab, setActiveTab] = useState<'tiles' | 'bulk' | 'analytics' | 'qrcodes'>('tiles');
  const [editingTile, setEditingTile] = useState<Tile | null>(null);
  const [newTile, setNewTile] = useState<Partial<Tile>>({
    name: '',
    category: 'both',
    size: '',
    price: 0,
    inStock: true,
    imageUrl: '',
    textureUrl: ''
  });

  const handleAddTile = async () => {
    try {
      if (!currentShowroom) return;
      
      const tileData = {
        ...newTile,
        id: `tile_${Date.now()}`,
        showroomId: currentShowroom.id
      };
      
      await uploadTile(tileData);
      
      setIsAddingTile(false);
      setNewTile({
        name: '',
        category: 'both',
        size: '',
        price: 0,
        inStock: true,
        imageUrl: '',
        textureUrl: ''
      });
      
      // Refresh the page or update the store
      window.location.reload();
    } catch (error) {
      console.error('Error adding tile:', error);
    }
  };

  const handleEditTile = async (tile: Tile) => {
    setEditingTile(tile);
    setNewTile(tile);
    setIsAddingTile(false);
  };

  const handleUpdateTile = async () => {
    try {
      if (!editingTile) return;
      
      await updateTile(editingTile.id, newTile);
      
      setEditingTile(null);
      setNewTile({
        name: '',
        category: 'both',
        size: '',
        price: 0,
        inStock: true,
        imageUrl: '',
        textureUrl: ''
      });
      
      window.location.reload();
    } catch (error) {
      console.error('Error updating tile:', error);
    }
  };

  const handleDeleteTile = async (tileId: string) => {
    if (window.confirm('Are you sure you want to delete this tile?')) {
      try {
        await deleteTile(tileId);
        window.location.reload();
      } catch (error) {
        console.error('Error deleting tile:', error);
      }
    }
  };

  return (
    <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 sm:p-4 md:p-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 gap-3 sm:gap-4">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Admin Dashboard</h2>
        <div className="flex flex-wrap gap-1.5 sm:gap-2 w-full sm:w-auto">
          <button
            onClick={() => setActiveTab('tiles')}
            className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-lg transition-colors text-xs sm:text-sm ${
              activeTab === 'tiles' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden xs:inline">Tile</span>
            <span className="hidden sm:inline">Management</span>
          </button>
          <button
            onClick={() => setActiveTab('bulk')}
            className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-lg transition-colors text-xs sm:text-sm ${
              activeTab === 'bulk' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Upload className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden xs:inline">Bulk</span>
            <span className="hidden sm:inline">Upload</span>
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-lg transition-colors text-xs sm:text-sm ${
              activeTab === 'analytics' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <BarChart3 className="w-3 h-3 sm:w-4 sm:h-4" />
            Analytics
          </button>
          <button
            onClick={() => setActiveTab('qrcodes')}
            className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-lg transition-colors text-xs sm:text-sm ${
              activeTab === 'qrcodes' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Upload className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">QR Codes</span>
            <span className="sm:hidden">QR</span>
          </button>
        </div>
      </div>

      {activeTab === 'tiles' && (
        <>
          <div className="flex justify-end mb-3 sm:mb-4">
            <button
              onClick={() => setIsAddingTile(true)}
              className="flex items-center gap-1 sm:gap-2 bg-blue-600 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg hover:bg-blue-700 transition-colors text-xs sm:text-sm"
            >
              <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Add New Tile</span>
              <span className="sm:hidden">Add Tile</span>
            </button>
          </div>

          {(isAddingTile || editingTile) && (
            <div className="mb-4 sm:mb-6 p-3 sm:p-4 md:p-6 border-2 border-dashed border-blue-300 rounded-lg sm:rounded-xl bg-blue-50">
              <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">
                {editingTile ? 'Edit Tile' : 'Add New Tile'}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                <input
                  type="text"
                  placeholder="Tile Name"
                  value={newTile.name}
                  onChange={(e) => setNewTile({ ...newTile, name: e.target.value })}
                  className="px-3 sm:px-4 py-1.5 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                />
                <select
                  value={newTile.category}
                  onChange={(e) => setNewTile({ ...newTile, category: e.target.value as any })}
                  className="px-3 sm:px-4 py-1.5 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                >
                  <option value="floor">Floor Only</option>
                  <option value="wall">Wall Only</option>
                  <option value="both">Floor & Wall</option>
                </select>
                <input
                  type="text"
                  placeholder="Size (e.g., 60x60 cm)"
                  value={newTile.size}
                  onChange={(e) => setNewTile({ ...newTile, size: e.target.value })}
                  className="px-3 sm:px-4 py-1.5 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                  list="tile-sizes"
                />
                <datalist id="tile-sizes">
                  <option value="30x30 cm" />
                  <option value="30x60 cm" />
                  <option value="40x40 cm" />
                  <option value="40x60 cm" />
                  <option value="60x60 cm" />
                  <option value="60x120 cm" />
                  <option value="80x80 cm" />
                  <option value="10x30 cm" />
                  <option value="15x90 cm" />
                  <option value="20x120 cm" />
                  <option value="25x40 cm" />
                  <option value="7.5x15 cm" />
                  <option value="6x25 cm" />
                  <option value="20x20 cm" />
                  <option value="100x100 cm" />
                  <option value="45x45 cm" />
                  <option value="50x50 cm" />
                  <option value="75x75 cm" />
                </datalist>
                <input
                  type="number"
                  placeholder="Price"
                  value={newTile.price}
                  onChange={(e) => setNewTile({ ...newTile, price: Number(e.target.value) })}
                  className="px-3 sm:px-4 py-1.5 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                />
                <input
                  type="url"
                  placeholder="Image URL"
                  value={newTile.imageUrl}
                  onChange={(e) => setNewTile({ ...newTile, imageUrl: e.target.value })}
                  className="px-3 sm:px-4 py-1.5 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                />
                <input
                  type="url"
                  placeholder="Texture URL"
                  value={newTile.textureUrl}
                  onChange={(e) => setNewTile({ ...newTile, textureUrl: e.target.value })}
                  className="px-3 sm:px-4 py-1.5 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                />
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="inStock"
                    checked={newTile.inStock}
                    onChange={(e) => setNewTile({ ...newTile, inStock: e.target.checked })}
                    className="w-4 h-4 text-blue-600"
                  />
                  <label htmlFor="inStock" className="text-xs sm:text-sm font-medium text-gray-700">
                    In Stock
                  </label>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 mt-3 sm:mt-4">
                <button
                  onClick={editingTile ? handleUpdateTile : handleAddTile}
                  className="flex items-center justify-center gap-1 sm:gap-2 bg-green-600 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg hover:bg-green-700 text-xs sm:text-sm"
                >
                  <Save className="w-3 h-3 sm:w-4 sm:h-4" />
                  {editingTile ? 'Update Tile' : 'Save Tile'}
                </button>
                <button
                  onClick={() => {
                    setIsAddingTile(false);
                    setEditingTile(null);
                    setNewTile({
                      name: '',
                      category: 'both',
                      size: '',
                      price: 0,
                      inStock: true,
                      imageUrl: '',
                      textureUrl: ''
                    });
                  }}
                  className="px-3 sm:px-4 py-1.5 sm:py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-xs sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          <div className="overflow-x-auto -mx-3 sm:mx-0">
            <div className="inline-block min-w-full align-middle">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="text-left p-2 sm:p-3 font-semibold text-xs sm:text-sm">Image</th>
                    <th className="text-left p-2 sm:p-3 font-semibold text-xs sm:text-sm">Name</th>
                    <th className="text-left p-2 sm:p-3 font-semibold text-xs sm:text-sm hidden md:table-cell">Category</th>
                    <th className="text-left p-2 sm:p-3 font-semibold text-xs sm:text-sm hidden sm:table-cell">Size</th>
                    <th className="text-left p-2 sm:p-3 font-semibold text-xs sm:text-sm">Price</th>
                    <th className="text-left p-2 sm:p-3 font-semibold text-xs sm:text-sm hidden lg:table-cell">Stock</th>
                    <th className="text-left p-2 sm:p-3 font-semibold text-xs sm:text-sm">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentShowroom?.tiles.map((tile) => (
                    <tr key={tile.id} className="border-t hover:bg-gray-50">
                      <td className="p-2 sm:p-3">
                        <img
                          src={tile.imageUrl}
                          alt={tile.name}
                          className="w-10 h-10 sm:w-12 sm:h-12 object-cover rounded-lg"
                        />
                      </td>
                      <td className="p-2 sm:p-3 font-medium text-xs sm:text-sm">
                        <div className="max-w-[120px] sm:max-w-none truncate">{tile.name}</div>
                        <div className="md:hidden mt-1">
                          <span className={`
                            px-2 py-0.5 rounded-full text-xs
                            ${tile.category === 'floor' ? 'bg-blue-100 text-blue-800' :
                              tile.category === 'wall' ? 'bg-purple-100 text-purple-800' :
                              'bg-gray-100 text-gray-800'
                            }
                          `}>
                            {tile.category === 'both' ? 'F&W' : tile.category.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      </td>
                      <td className="p-2 sm:p-3 hidden md:table-cell">
                        <span className={`
                          px-2 py-1 rounded-full text-xs
                          ${tile.category === 'floor' ? 'bg-blue-100 text-blue-800' :
                            tile.category === 'wall' ? 'bg-purple-100 text-purple-800' :
                            'bg-gray-100 text-gray-800'
                          }
                        `}>
                          {tile.category === 'both' ? 'Floor & Wall' : tile.category}
                        </span>
                      </td>
                      <td className="p-2 sm:p-3 text-xs sm:text-sm hidden sm:table-cell">{tile.size}</td>
                      <td className="p-2 sm:p-3 font-semibold text-xs sm:text-sm">
                        <span className="hidden sm:inline">₹</span>
                        {tile.price}
                      </td>
                      <td className="p-2 sm:p-3 hidden lg:table-cell">
                        <span className={`
                          px-2 py-1 rounded-full text-xs
                          ${tile.inStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
                        `}>
                          {tile.inStock ? 'In Stock' : 'Out of Stock'}
                        </span>
                      </td>
                      <td className="p-2 sm:p-3">
                        <div className="flex gap-1 sm:gap-2">
                          <button 
                            onClick={() => handleEditTile(tile)}
                            className="p-1 sm:p-1.5 text-blue-600 hover:bg-blue-100 rounded"
                            title="Edit"
                          >
                            <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
                          </button>
                          <button 
                            onClick={() => handleDeleteTile(tile.id)}
                            className="p-1 sm:p-1.5 text-red-600 hover:bg-red-100 rounded"
                            title="Delete"
                          >
                            <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {activeTab === 'bulk' && <BulkUpload />}
      
      {activeTab === 'analytics' && <AnalyticsDashboard />}
      
      {activeTab === 'qrcodes' && (
        <QRCodeManager 
          tiles={currentShowroom?.tiles || []} 
        />
      )}
    </div>
  );
};