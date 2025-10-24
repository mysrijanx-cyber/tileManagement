
import React, { useState, useEffect } from 'react';
import { 
  Plus, Edit, Trash2, Upload, Save, BarChart3, Store, Package, 
  FileSpreadsheet, AlertCircle, CheckCircle, Loader, Search, Filter,
  RefreshCw, Eye, TrendingUp, QrCode, Download, User
} from 'lucide-react';
import { Tile } from '../types';
import { useAppStore } from '../stores/appStore';
import { BulkUpload } from './BulkUpload';
import { AnalyticsDashboard } from './AnalyticsDashboard';
import { QRCodeManager } from './QRCodeManager';
import { ExcelUpload } from './ExcelUpload';
import { generateTileQRCode } from '../utils/qrCodeUtils';
import { SellerProfile } from './SellerProfile';
// ✅ ADD THIS IMPORT at the top with other imports
import { WorkerManagement } from './WorkerManagement';
// ✅ ADD THIS IMPORT
import { SellerStockAnalytics } from './SellerStockAnalytics';

// Firebase functions
import { 
  uploadTile, updateTile, deleteTile, getSellerProfile, 
  getSellerTiles ,updateTileQRCode ,  getTileById,
} from '../lib/firebaseutils';

// Cloudinary function
import { uploadToCloudinary } from '../utils/cloudinaryUtils';

export const SellerDashboard: React.FC = () => {
  const { currentUser, isAuthenticated } = useAppStore();
  const [isAddingTile, setIsAddingTile] = useState(false);
  // const [activeTab, setActiveTab] = useState<'tiles' | 'bulk' | 'excel' | 'analytics' | 'qrcodes'>('tiles');
  // const [activeTab, setActiveTab] = useState<'tiles' | 'bulk' | 'excel' | 'analytics' | 'qrcodes' | 'profile'>('tiles')
  // ✅ REPLACE WITH:
// const [activeTab, setActiveTab] = useState<'tiles' | 'bulk' | 'excel' | 'analytics' | 'qrcodes' | 'profile' | 'worker' | 'scan'>('tiles')
const [activeTab, setActiveTab] = useState<'tiles' | 'bulk' | 'excel' | 'analytics' | 'qrcodes' | 'profile' | 'worker' | 'scan' | 'stock-analytics'>('tiles')
  const [editingTile, setEditingTile] = useState<Tile | null>(null);
  const [sellerProfile, setSellerProfile] = useState<any>(null);
  const [tiles, setTiles] = useState<Tile[]>([]);
  const [filteredTiles, setFilteredTiles] = useState<Tile[]>([]);
  const [loading, setLoading] = useState(true);
  const [imageUploading, setImageUploading] = useState(false);
  const [textureUploading, setTextureUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [stockFilter, setStockFilter] = useState<string>('all');
  
  const [newTile, setNewTile] = useState<Partial<Tile>>({
    name: '',
    category: 'both',
    size: '',
    price: undefined,
    stock: 0,
    inStock: true,
    imageUrl: '',
    textureUrl: '',
    tileCode: ''
  });

  // ✅ MAIN FIX: Enhanced Authentication Check
  useEffect(() => {
    console.log('🔍 SellerDashboard Auth Check:', {
      currentUser: currentUser?.email || 'null',
      isAuthenticated,
      userRole: currentUser?.role || 'null'
    });

    if (currentUser && isAuthenticated) {
      loadData();
    } else if (currentUser === null && !isAuthenticated) {
      // Auth state is clear - user not logged in
      setLoading(false);
    }
    // If currentUser is undefined, keep loading (auth state checking)
  }, [currentUser, isAuthenticated]);

  useEffect(() => {
    filterTiles();
  }, [tiles, searchTerm, categoryFilter, stockFilter]);

  // Clear messages after 5 seconds
  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError(null);
        setSuccess(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔄 Loading seller data for:', currentUser?.email);
      
      const [profile, sellerTiles] = await Promise.all([
        getSellerProfile(currentUser?.user_id || ''),
        getSellerTiles(currentUser?.user_id || '')
      ]);
      
      setSellerProfile(profile);
      setTiles(sellerTiles || []);
      
      console.log('✅ Seller data loaded:', {
        profile: profile?.business_name || 'No profile',
        tilesCount: sellerTiles?.length || 0
      });
    } catch (error: any) {
      console.error('❌ Error loading seller data:', error);
      setError('Failed to load dashboard data. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  };

  const filterTiles = () => {
    let filtered = tiles;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(tile => 
        tile.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tile.tileCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tile.size.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(tile => tile.category === categoryFilter);
    }

    // Stock filter
    if (stockFilter === 'in-stock') {
      filtered = filtered.filter(tile => tile.inStock);
    } else if (stockFilter === 'out-of-stock') {
      filtered = filtered.filter(tile => !tile.inStock);
    }

    setFilteredTiles(filtered);
  };

  const generateTileCode = (): string => {
    const prefix = sellerProfile?.business_name?.substring(0, 3).toUpperCase() || 'TIL';
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.random().toString(36).substring(2, 4).toUpperCase();
    return `${prefix}${timestamp}${random}`;
  };

  const handleImageUpload = async (file: File, type: 'image' | 'texture') => {
    try {
      if (type === 'image') {
        setImageUploading(true);
      } else {
        setTextureUploading(true);
      }

      // Validate file
      if (!file.type.startsWith('image/')) {
        throw new Error('Please select a valid image file');
      }

      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        throw new Error('Image size should be less than 5MB');
      }

      console.log(`🔄 Uploading ${type}:`, file.name);
      const imageUrl = await uploadToCloudinary(file, type === 'image' ? 'tiles/main' : 'tiles/textures');
      
      if (type === 'image') {
        setNewTile(prev => ({ ...prev, imageUrl }));
      } else {
        setNewTile(prev => ({ ...prev, textureUrl: imageUrl }));
      }

      setSuccess(`${type === 'image' ? 'Image' : 'Texture'} uploaded successfully`);
      console.log(`✅ ${type} uploaded:`, imageUrl);
    } catch (error: any) {
      console.error(`❌ ${type} upload failed:`, error);
      setError(error.message || `Failed to upload ${type}`);
    } finally {
      if (type === 'image') {
        setImageUploading(false);
      } else {
        setTextureUploading(false);
      }
    }
  };

  const validateTileForm = (): string | null => {
    if (!newTile.name?.trim()) return 'Tile name is required';
    if (!newTile.size?.trim()) return 'Tile size is required';
    if (!newTile.price || newTile.price <= 0) return 'Valid price is required';
    if (newTile.stock === undefined || newTile.stock < 0) return 'Valid stock quantity is required';
    if (!newTile.imageUrl?.trim()) return 'Image is required';
    return null;
  };





const handleAddTile = async () => {
  try {
    setError(null);
    
    // Validation
    const validationError = validateTileForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    if (!currentUser) {
      setError('User not authenticated');
      return;
    }
    
    console.log('🔄 Step 1/4: Preparing tile data...');
    
    // Generate tile code if not provided
    const tileCode = newTile.tileCode || generateTileCode();
    
    // Prepare base tile data
    const baseTileData = {
      ...newTile,
      sellerId: currentUser.user_id,
      showroomId: currentUser.user_id,
      tileCode: tileCode,
      inStock: (newTile.stock || 0) > 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
      // DON'T include qrCode here yet
    };
    
    console.log('💾 Step 2/4: Saving tile to database...');
    
    // Save tile to database (Firebase generates ID)
    const savedTile = await uploadTile(baseTileData);
    
    if (!savedTile || !savedTile.id) {
      throw new Error('Tile saved but ID not returned');
    }
    
    console.log('✅ Tile saved with ID:', savedTile.id);
    console.log('📱 Step 3/4: Generating QR code...');
    
    // Generate QR code with saved tile data
    let qrCodeGenerated = false;
    try {
      const qrCodeDataUrl = await generateTileQRCode(savedTile);
      
      console.log('✅ QR code generated successfully');
      console.log('🔄 Step 4/4: Updating tile with QR code...');
      
      // Update tile with QR code
      await updateTileQRCode(savedTile.id, qrCodeDataUrl);
      
      console.log('✅ Tile updated with QR code');
      qrCodeGenerated = true;
      
    } catch (qrError: any) {
      console.warn('⚠️ QR code generation failed:', qrError.message);
      // Don't fail the whole operation
      // QR can be generated later from QR Codes tab
    }
    
    // Reload data to show updated tile
    await loadData();
    
    // Reset form and show success
    setIsAddingTile(false);
    resetNewTile();
    
    if (qrCodeGenerated) {
      setSuccess('✅ Tile added successfully with QR code!');
    } else {
      setSuccess('✅ Tile added! QR code can be generated from QR Codes tab.');
    }
    
    console.log('🎉 Tile creation completed!');
    
  } catch (error: any) {
    console.error('❌ Tile creation failed:', error);
    setError(`Failed to add tile: ${error.message}`);
  }
};

  const handleEditTile = async (tile: Tile) => {
    console.log('🔄 Editing tile:', tile.name);
    setEditingTile(tile);
    setNewTile({
      ...tile,
      stock: tile.stock || 0
    });
    setIsAddingTile(false);
    setError(null);
  };

  // const handleUpdateTile = async () => {   


  //   try {
  //     setError(null);
      
  //     const validationError = validateTileForm();
  //     if (validationError) {
  //       setError(validationError);
  //       return;
  //     }

  //     if (!editingTile) return;
      
  //     const updates = {
  //       ...newTile,
  //       inStock: (newTile.stock || 0) > 0,
  //       updatedAt: new Date().toISOString()
  //     };
      
  //     console.log('🔄 Updating tile:', editingTile.name);
  //     await updateTile(editingTile.id, updates);
  //     await loadData();
      
  //     setEditingTile(null);
  //     resetNewTile();
  //     setSuccess('Tile updated successfully');
  //     console.log('✅ Tile updated successfully');
  //   } catch (error: any) {
  //     console.error('❌ Error updating tile:', error);
  //     setError('Failed to update tile. Please try again.');
  //   }
  // };

    

  // ✅ handleDeleteTile (NO optimistic update)

// ✅ SellerDashboard.tsx - handleUpdateTile

// const handleUpdateTile = async () => {
//   try {
//     setError(null);
    
//     const validationError = validateTileForm();
//     if (validationError) {
//       setError(validationError);
//       return;
//     }

//     if (!editingTile) return;
    
//     const updates = {
//       ...newTile,
//       inStock: (newTile.stock || 0) > 0,
//       updatedAt: new Date().toISOString()
//     };
    
//     console.log('🔄 Updating tile:', editingTile.name);
    
//     // Update tile in database
//     await updateTile(editingTile.id, updates);
    
//     // Check if critical fields changed (name, code, price, etc.)
//     const criticalFieldsChanged = 
//       editingTile.name !== newTile.name ||
//       editingTile.tileCode !== newTile.tileCode ||
//       editingTile.price !== newTile.price ||
//       editingTile.size !== newTile.size;
    
//     // Regenerate QR if critical fields changed
//     if (criticalFieldsChanged) {
//       console.log('🔄 Critical fields changed, regenerating QR...');
      
//       try {
//         // Get updated tile
//         const updatedTile = await getTileById(editingTile.id);
        
//         // Regenerate QR
//         const newQR = await generateTileQRCode(updatedTile);
//         await updateTileQRCode(editingTile.id, newQR);
        
//         console.log('✅ QR code regenerated');
//       } catch (qrError) {
//         console.warn('⚠️ QR regeneration failed:', qrError);
//       }
//     }
    
//     await loadData();
    
//     setEditingTile(null);
//     resetNewTile();
//     setSuccess('Tile updated successfully!');
    
//   } catch (error: any) {
//     console.error('❌ Update failed:', error);
//     setError(`Failed to update tile: ${error.message}`);
//   }
// };
const handleUpdateTile = async () => {
  try {
    setError(null);
    
    // Step 1: Validate form
    const validationError = validateTileForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    if (!editingTile) {
      setError('No tile selected for editing');
      return;
    }
    
    console.log('🔄 Starting tile update:', editingTile.name);
    
    // Step 2: Prepare updates
    const updates = {
      ...newTile,
      inStock: (newTile.stock || 0) > 0,
      updatedAt: new Date().toISOString()
    };
    
    // Step 3: Update tile in database
    console.log('💾 Updating tile in database...');
    await updateTile(editingTile.id, updates);
    console.log('✅ Tile updated in database');
    
    // Step 4: Check if QR regeneration needed
    const criticalFieldsChanged = 
      editingTile.name !== newTile.name ||
      editingTile.tileCode !== newTile.tileCode ||
      editingTile.price !== newTile.price ||
      editingTile.size !== newTile.size ||
      editingTile.category !== newTile.category;
    
    // Step 5: Regenerate QR if needed (NON-BLOCKING)
    if (criticalFieldsChanged) {
      console.log('🔄 Critical fields changed, attempting QR regeneration...');
      
      // ✅ Use setTimeout to make it non-blocking
      setTimeout(async () => {
        try {
          // Check if functions are available
          if (typeof getTileById !== 'function') {
            console.warn('⚠️ getTileById not available, skipping QR regeneration');
            return;
          }
          
          if (typeof generateTileQRCode !== 'function') {
            console.warn('⚠️ generateTileQRCode not available, skipping QR regeneration');
            return;
          }
          
          if (typeof updateTileQRCode !== 'function') {
            console.warn('⚠️ updateTileQRCode not available, skipping QR regeneration');
            return;
          }
          
          console.log('📱 Fetching updated tile data...');
          const updatedTileData = await getTileById(editingTile.id);
          
          if (!updatedTileData) {
            console.warn('⚠️ Could not fetch updated tile, skipping QR regeneration');
            return;
          }
          
          console.log('📱 Generating new QR code...');
          const newQRCode = await generateTileQRCode(updatedTileData);
          
          if (!newQRCode || !newQRCode.startsWith('data:image')) {
            console.warn('⚠️ Invalid QR code generated, skipping update');
            return;
          }
          
          console.log('💾 Updating QR code in database...');
          await updateTileQRCode(editingTile.id, newQRCode);
          
          console.log('✅ QR code regenerated successfully');
          
          // Optionally reload data to show new QR
          await loadData();
          
        } catch (qrError: any) {
          console.error('⚠️ QR regeneration failed (non-critical):', qrError.message);
          // Don't show error to user - tile update was successful
        }
      }, 0);
    } else {
      console.log('ℹ️ No critical fields changed, keeping existing QR code');
    }
    
    // Step 6: Reload data
    console.log('🔄 Reloading tiles list...');
    await loadData();
    
    // Step 7: Reset form
    setEditingTile(null);
    resetNewTile();
    
    // Step 8: Show success
    setSuccess('Tile updated successfully!');
    console.log('✅ Tile update complete');
    
  } catch (error: any) {
    console.error('❌ Error updating tile:', error);
    setError(`Failed to update tile: ${error.message}`);
  }
};


const handleDeleteTile = async (tileId: string, tileName: string) => {
  if (!window.confirm(`Delete "${tileName}"?`)) return;

  try {
    setError(null);
    console.log('🔥 Deleting:', tileId);
    
    // ✅ DELETE FROM DATABASE FIRST
    await deleteTile(tileId);
    
    console.log('✅ Deleted from database');
    
    // ✅ THEN RELOAD DATA
    await loadData();
    
    setSuccess('Tile deleted successfully');
    
  } catch (error: any) {
    console.error('❌ Delete failed:', error);
    setError(`Delete failed: ${error.message}`);
  }
};


  const resetNewTile = () => {
    setNewTile({
      name: '',
      category: 'both',
      size: '',
      price: 0,
      stock: 0,
      inStock: true,
      imageUrl: '',
      textureUrl: '',
      tileCode: ''
    });
  };

  const handleTabChange = (tab: typeof activeTab) => {
    setActiveTab(tab);
    setError(null);
    setSuccess(null);
    console.log('🎯 Switched to tab:', tab);
  };

  const getStockStatusColor = (tile: Tile) => {
    if (!tile.inStock) return 'bg-red-100 text-red-800';
    if ((tile.stock || 0) < 10) return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  };

  const getStockStatusText = (tile: Tile) => {
    if (!tile.inStock) return 'Out of Stock';
    if ((tile.stock || 0) < 10) return 'Low Stock';
    return 'In Stock';
  };

  // ✅ ENHANCED ACCESS CONTROL
  if (!isAuthenticated) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="text-center py-12">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Authentication Required</h2>
          <p className="text-gray-600 mb-6">Please log in to access the seller dashboard.</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="text-center py-12">
          <User className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-4">User Profile Not Found</h2>
          <p className="text-gray-600 mb-6">Unable to load user profile. Please try logging in again.</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Reload Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (currentUser.role !== 'seller') {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="text-center py-12">
          <AlertCircle className="w-16 h-16 text-orange-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-6">
            This dashboard is only accessible to sellers. Your role: <strong>{currentUser.role}</strong>
          </p>
          <button 
            onClick={() => window.location.href = '/'}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Loader className="w-12 h-12 animate-spin text-green-600 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">Loading dashboard...</p>
            <p className="text-gray-500 text-sm mt-2">
              Loading data for {currentUser.full_name || currentUser.email}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6 gap-4">
        <div className="flex items-center gap-3">
          <Store className="w-8 h-8 text-green-600" />
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Seller Dashboard</h2>
            <p className="text-gray-600">{sellerProfile?.business_name || 'Your Business'}</p>
            <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <Package className="w-4 h-4" />
                {tiles.length} Total Tiles
              </span>
              <span className="flex items-center gap-1">
                <Package className="w-4 h-4 text-green-600" />
                {tiles.filter(t => t.inStock).length} In Stock
              </span>
              <span className="flex items-center gap-1">
                <Package className="w-4 h-4 text-red-600" />
                {tiles.filter(t => !t.inStock).length} Out of Stock
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => handleTabChange('tiles')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'tiles' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Edit className="w-4 h-4" />
            My Tiles
          </button>
          <button
            onClick={() => handleTabChange('worker')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'worker' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <User className="w-4 h-4" />
            Worker
          </button>
          <button
            onClick={() => window.open('/scan', '_blank')}
            className="flex items-center gap-2 px-4 py-2 rounded-lg transition-colors bg-purple-600 text-white hover:bg-purple-700"
            title="Open scan page in new tab"
          >
            <QrCode className="w-4 h-4" />
            Go to Scan
          </button>
          {activeTab === 'worker' && <WorkerManagement />}
          <button
  onClick={() => handleTabChange('profile')}
  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
    activeTab === 'profile' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
  }`}
>
  <User className="w-4 h-4" />
  Profile
</button>
{activeTab === 'profile' && <SellerProfile />}
          <button
            onClick={() => handleTabChange('excel')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'excel' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4" />
            Excel Upload
          </button>
          {/* ✅ ADD THIS BUTTON after 'analytics' button and before closing div */}
<button
  onClick={() => handleTabChange('stock-analytics')}
  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
    activeTab === 'stock-analytics' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
  }`}
>
  <Package className="w-4 h-4" />
  Stock Analytics
</button>
{/* ✅ ADD THIS LINE with other tab conditions */}
{activeTab === 'stock-analytics' && <SellerStockAnalytics />}
          <button
            onClick={() => handleTabChange('bulk')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'bulk' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Upload className="w-4 h-4" />
            CSV Upload
          </button>
          <button
            onClick={() => handleTabChange('qrcodes')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'qrcodes' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <QrCode className="w-4 h-4" />
            QR Codes
          </button>
          <button
            onClick={() => handleTabChange('analytics')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'analytics' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            Analytics
          </button>
        </div>
      </div>

      {/* Alert Messages */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-red-800 font-medium">Error</p>
            <p className="text-red-700 text-sm">{error}</p>
          </div>
          <button 
            onClick={() => setError(null)}
            className="text-red-400 hover:text-red-600 font-bold text-lg"
          >
            ×
          </button>
        </div>
      )}

      {success && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
          <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-green-800 font-medium">Success</p>
            <p className="text-green-700 text-sm">{success}</p>
          </div>
          <button 
            onClick={() => setSuccess(null)}
            className="text-green-400 hover:text-green-600 font-bold text-lg"
          >
            ×
          </button>
        </div>
      )}

      {/* Tiles Tab */}
      {activeTab === 'tiles' && (
        <>
          {/* Controls */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
            <div className="flex flex-col sm:flex-row gap-3 flex-1">
              {/* Search */}
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search tiles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 w-full sm:w-64"
                />
              </div>

              {/* Filters */}
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="all">All Categories</option>
                <option value="floor">Floor Only</option>
                <option value="wall">Wall Only</option>
                <option value="both">Floor & Wall</option>
              </select>

              <select
                value={stockFilter}
                onChange={(e) => setStockFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="all">All Stock Status</option>
                <option value="in-stock">In Stock</option>
                <option value="out-of-stock">Out of Stock</option>
              </select>

              <button
                onClick={loadData}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                title="Refresh Data"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>
            </div>

            <button
              onClick={() => setIsAddingTile(true)}
              className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add New Tile
            </button>
          </div>

          {/* Results Summary */}
          <div className="mb-4 text-sm text-gray-600">
            Showing {filteredTiles.length} of {tiles.length} tiles
            {searchTerm && ` matching "${searchTerm}"`}
          </div>

          {/* Add/Edit Tile Form - Same as before */}
          {(isAddingTile || editingTile) && (
            <div className="mb-6 p-6 border-2 border-dashed border-green-300 rounded-xl bg-green-50">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                {editingTile ? (
                  <>
                    <Edit className="w-5 h-5" />
                    Edit Tile: {editingTile.name}
                  </>
                ) : (
                  <>
                    <Plus className="w-5 h-5" />
                    Add New Tile
                  </>
                )}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* All form fields same as before */}
                {/* Tile Name */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Tile Name *
                  </label>
                  <input
                    type="text"
                    placeholder="Enter tile name"
                    value={newTile.name}
                    onChange={(e) => setNewTile({ ...newTile, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>

                {/* Tile Code */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Tile Code
                  </label>
                  <input
                    type="text"
                    placeholder="Auto-generated if empty"
                    value={newTile.tileCode}
                    onChange={(e) => setNewTile({ ...newTile, tileCode: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>

                {/* Category */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Category *
                  </label>
                  <select
                    value={newTile.category}
                    onChange={(e) => setNewTile({ ...newTile, category: e.target.value as any })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  >
                    <option value="floor">Floor Only</option>
                    <option value="wall">Wall Only</option>
                    <option value="both">Floor & Wall</option>
                  </select>
                </div>

                {/* Size */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Size *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., 60x60 cm"
                    value={newTile.size}
                    onChange={(e) => setNewTile({ ...newTile, size: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    list="seller-tile-sizes"
                  />
                  <datalist id="seller-tile-sizes">
                  <option value="30x30 cm" />
  <option value="30x60 cm" />
  <option value="60x60 cm" />
  <option value="60x120 cm" />
  <option value="80x80 cm" />
  
 
  <option value="40x40 cm" />
  <option value="40x60 cm" />
  <option value="50x50 cm" />
  

  <option value="20x120 cm" />
  <option value="15x90 cm" />
  <option value="10x30 cm" />
  

  <option value="20x20 cm" />
  <option value="25x40 cm" />
  <option value="61x122 cm" />
  <option value="122x122 cm" /> 
  

  <option value="75x75 cm" />
  <option value="100x100 cm" />
  <option value="45x45 cm" />
  <option value="7.5x15 cm" />
  <option value="6x25 cm" />
                  </datalist>
                </div>

                {/* Price */}
                {/* <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Price (₹) *
                  </label>
                  <input
                    type="number"
                    placeholder="Enter price"
                    value={newTile.price}
                    onChange={(e) => setNewTile({ ...newTile, price: Number(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    min="0"
                    step="0.01"
                  />
                </div> */} 

<div className="space-y-2">
  <label className="block text-sm font-medium text-gray-700">
    Price (₹) *
  </label>
  <input
    type="number"
    placeholder="Enter price"
    value={newTile.price || ''} 
    onChange={(e) => setNewTile({ 
      ...newTile, 
      price: e.target.value === '' ? 0 : Number(e.target.value) 
    })}
    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
    min="0"
    step="0.01"
  />
</div>

                {/* Stock */}
                {/* <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Stock Quantity *
                  </label>
                  <input
                    type="number"
                    placeholder="Enter stock quantity"
                    value={newTile.stock}
                    onChange={(e) => setNewTile({ ...newTile, stock: Number(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    min="0"
                  />
                </div> */}

<div className="space-y-2">
  <label className="block text-sm font-medium text-gray-700">
    Stock Quantity *
  </label>
  <input
    type="number"
    placeholder="Enter stock quantity"
    value={newTile.stock || ''}
    onChange={(e) => setNewTile({ 
      ...newTile, 
      stock: e.target.value === '' ? 0 : Number(e.target.value) 
    })}
    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
    min="0"
  />
</div>

                {/* Main Image Upload */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Tile Image *
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleImageUpload(file, 'image');
                      }}
                      className="hidden"
                      id="tile-image-upload"
                    />
                    <label
                      htmlFor="tile-image-upload"
                      className={`flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors ${
                        imageUploading ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      {imageUploading ? (
                        <Loader className="w-4 h-4 animate-spin" />
                      ) : (
                        <Upload className="w-4 h-4" />
                      )}
                      {imageUploading ? 'Uploading...' : 'Choose Image'}
                    </label>
                    {newTile.imageUrl && (
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="text-sm text-green-600">Uploaded</span>
                      </div>
                    )}
                  </div>
                  {newTile.imageUrl && (
                    <img
                      src={newTile.imageUrl}
                      alt="Tile preview"
                      className="w-20 h-20 object-cover rounded-lg border border-gray-200"
                    />
                  )}
                </div>

                {/* Texture Image Upload */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Texture Image (Optional)
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleImageUpload(file, 'texture');
                      }}
                      className="hidden"
                      id="texture-image-upload"
                    />
                    <label
                      htmlFor="texture-image-upload"
                      className={`flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors ${
                        textureUploading ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      {textureUploading ? (
                        <Loader className="w-4 h-4 animate-spin" />
                      ) : (
                        <Upload className="w-4 h-4" />
                      )}
                      {textureUploading ? 'Uploading...' : 'Choose Texture'}
                    </label>
                    {newTile.textureUrl && (
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="text-sm text-green-600">Uploaded</span>
                      </div>
                    )}
                  </div>
                  {newTile.textureUrl && (
                    <img
                      src={newTile.textureUrl}
                      alt="Texture preview"
                      className="w-20 h-20 object-cover rounded-lg border border-gray-200"
                    />
                  )}
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex gap-2 mt-6">
                <button
                  onClick={editingTile ? handleUpdateTile : handleAddTile}
                  disabled={imageUploading || textureUploading}
                  className="flex items-center gap-2 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Save className="w-4 h-4" />
                  {editingTile ? 'Update Tile' : 'Save Tile'}
                </button>
                <button
                  onClick={() => {
                    setIsAddingTile(false);
                    setEditingTile(null);
                    resetNewTile();
                    setError(null);
                  }}
                  className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Enhanced Tiles Table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse bg-white rounded-lg border border-gray-200">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left p-3 font-semibold text-gray-700">Image</th>
                  <th className="text-left p-3 font-semibold text-gray-700">Name</th>
                  <th className="text-left p-3 font-semibold text-gray-700">Code</th>
                  <th className="text-left p-3 font-semibold text-gray-700">Category</th>
                  <th className="text-left p-3 font-semibold text-gray-700">Size</th>
                  <th className="text-left p-3 font-semibold text-gray-700">Price</th>
                  <th className="text-left p-3 font-semibold text-gray-700">Stock</th>
                  <th className="text-left p-3 font-semibold text-gray-700">Status</th>
                  <th className="text-left p-3 font-semibold text-gray-700">QR Code</th>
                  <th className="text-left p-3 font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTiles.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="text-center p-8 text-gray-500">
                      {tiles.length === 0 ? (
                        <div className="space-y-2">
                          <Package className="w-12 h-12 text-gray-300 mx-auto" />
                          <p className="font-medium">No tiles found</p>
                          <p className="text-sm">Start by adding your first tile!</p>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <Search className="w-12 h-12 text-gray-300 mx-auto" />
                          <p className="font-medium">No tiles match your search</p>
                          <p className="text-sm">Try adjusting your search or filters</p>
                        </div>
                      )}
                    </td>
                  </tr>
                ) : (
                  filteredTiles.map((tile) => (
                    <tr key={tile.id} className="border-t border-gray-200 hover:bg-gray-50">
                      <td className="p-3">
                        <img
                          src={tile.imageUrl}
                          alt={tile.name}
                          className="w-12 h-12 object-cover rounded-lg border border-gray-200"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/placeholder-tile.png';
                          }}
                        />
                      </td>
                      <td className="p-3">
                        <div>
                          <div className="font-medium text-gray-900">{tile.name}</div>
                          {tile.textureUrl && (
                            <div className="text-xs text-green-600">Has texture</div>
                          )}
                        </div>
                      </td>
                      <td className="p-3 text-sm text-gray-600 font-mono">{tile.tileCode}</td>
                      <td className="p-3">
                        <span className={`
                          px-2 py-1 rounded-full text-xs font-medium
                          ${tile.category === 'floor' ? 'bg-blue-100 text-blue-800' :
                            tile.category === 'wall' ? 'bg-purple-100 text-purple-800' :
                            'bg-gray-100 text-gray-800'
                          }
                        `}>
                          {tile.category === 'both' ? 'Floor & Wall' : 
                           tile.category.charAt(0).toUpperCase() + tile.category.slice(1)}
                        </span>
                      </td>
                      <td className="p-3 text-gray-600">{tile.size}</td>
                      <td className="p-3 font-semibold text-gray-900">₹{tile.price.toLocaleString()}</td>
                      <td className="p-3">
                        <div className="text-sm">
                          <div className="font-medium">{tile.stock || 0}</div>
                          {(tile.stock || 0) < 10 && tile.inStock && (
                            <div className="text-xs text-orange-600">Low stock</div>
                          )}
                        </div>
                      </td>
                      <td className="p-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStockStatusColor(tile)}`}>
                          {getStockStatusText(tile)}
                        </span>
                      </td>
                      <td className="p-3">
                        <span className={`
                          px-2 py-1 rounded-full text-xs font-medium
                          ${tile.qrCode ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}
                        `}>
                          {tile.qrCode ? 'Generated' : 'Pending'}
                        </span>
                      </td>
                      <td className="p-3">
                        <div className="flex gap-2">
                          <button 
                            onClick={() => handleEditTile(tile)}
                            className="p-1 text-blue-600 hover:bg-blue-100 rounded transition-colors"
                            title="Edit tile"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDeleteTile(tile.id, tile.name)}
                            className="p-1 text-red-600 hover:bg-red-100 rounded transition-colors"
                            title="Delete tile"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Other Tabs */}
      {activeTab === 'excel' && <ExcelUpload onUploadComplete={loadData} />}
      {activeTab === 'bulk' && <BulkUpload onUploadComplete={loadData} />}
      {activeTab === 'analytics' && <AnalyticsDashboard sellerId={currentUser?.user_id} />}
      {activeTab === 'qrcodes' && (
        <QRCodeManager 
          tiles={tiles} 
          sellerId={currentUser?.user_id} 
          onQRCodeGenerated={loadData}
        />
      )}
    </div>
  );
};