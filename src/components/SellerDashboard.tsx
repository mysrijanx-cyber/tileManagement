
import React, { useState, useEffect } from 'react';
import { 
  Plus, Edit, Trash2, Upload, Save, BarChart3, Store, Package, 
  FileSpreadsheet, AlertCircle, CheckCircle, Loader, Search, Filter,
  RefreshCw,ChevronUp, ChevronDown,Eye, TrendingUp, QrCode, Download, User, Menu, X
} from 'lucide-react';
import { Tile } from '../types';
import { useAppStore } from '../stores/appStore';
import { BulkUpload } from './BulkUpload';
import { AnalyticsDashboard } from './AnalyticsDashboard';
import { QRCodeManager } from './QRCodeManager';
import { ExcelUpload } from './ExcelUpload';
import { generateTileQRCode } from '../utils/qrCodeUtils';
import { SellerProfile } from './SellerProfile';
import { WorkerManagement } from './WorkerManagement';
import { SellerStockAnalytics } from './SellerStockAnalytics';

import { 
  uploadTile, updateTile, deleteTile, getSellerProfile, 
  getSellerTiles, updateTileQRCode, getTileById,
} from '../lib/firebaseutils';

import { uploadToCloudinary } from '../utils/cloudinaryUtils';

export const SellerDashboard: React.FC = () => {
  const { currentUser, isAuthenticated } = useAppStore();
  const [isAddingTile, setIsAddingTile] = useState(false);
  const [activeTab, setActiveTab] = useState<'tiles' | 'bulk' | 'excel' | 'analytics' | 'qrcodes' | 'profile' | 'worker' | 'scan' | 'stock-analytics'>('tiles');
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expandedTileId, setExpandedTileId] = useState<string | null>(null);
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

  useEffect(() => {
    console.log('🔍 SellerDashboard Auth Check:', {
      currentUser: currentUser?.email || 'null',
      isAuthenticated,
      userRole: currentUser?.role || 'null'
    });

    if (currentUser && isAuthenticated) {
      loadData();
    } else if (currentUser === null && !isAuthenticated) {
      setLoading(false);
    }
  }, [currentUser, isAuthenticated]);

  useEffect(() => {
    filterTiles();
  }, [tiles, searchTerm, categoryFilter, stockFilter]);

  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError(null);
        setSuccess(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  // const loadData = async () => {
  //   try {
  //     setLoading(true);
  //     setError(null);
      
  //     console.log('🔄 Loading seller data for:', currentUser?.email);
      
  //     const [profile, sellerTiles] = await Promise.all([
  //       getSellerProfile(currentUser?.user_id || ''),
  //       getSellerTiles(currentUser?.user_id || '')
  //     ]);
      
  //     setSellerProfile(profile);
  //     setTiles(sellerTiles || []);
      
  //     console.log('✅ Seller data loaded:', {
  //       profile: profile?.business_name || 'No profile',
  //       tilesCount: sellerTiles?.length || 0
  //     });
  //   } catch (error: any) {
  //     console.error('❌ Error loading seller data:', error);
  //     setError('Failed to load dashboard data. Please refresh the page.');
  //   } finally {
  //     setLoading(false);
  //   }
  // };
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
    
    // ✅ FIX: Extra deduplication layer in component
    if (sellerTiles && sellerTiles.length > 0) {
      const uniqueTilesMap = new Map();
      sellerTiles.forEach(tile => {
        if (tile.id && !uniqueTilesMap.has(tile.id)) {
          uniqueTilesMap.set(tile.id, tile);
        }
      });
      
      const uniqueTiles = Array.from(uniqueTilesMap.values());
      
      console.log('✅ Seller data loaded:', {
        profile: profile?.business_name || 'No profile',
        tilesRaw: sellerTiles.length,
        tilesUnique: uniqueTiles.length
      });
      
      setTiles(uniqueTiles);
    } else {
      setTiles([]);
      console.log('ℹ️ No tiles found');
    }
    
  } catch (error: any) {
    console.error('❌ Error loading seller data:', error);
    setError('Failed to load dashboard data. Please refresh the page.');
  } finally {
    setLoading(false);
  }
};

  const filterTiles = () => {
    let filtered = tiles;

    if (searchTerm) {
      filtered = filtered.filter(tile => 
        tile.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tile.tileCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tile.size.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter(tile => tile.category === categoryFilter);
    }

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

      if (!file.type.startsWith('image/')) {
        throw new Error('Please select a valid image file');
      }

      if (file.size > 5 * 1024 * 1024) {
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

  // const validateTileForm = (): string | null => {
  //   if (!newTile.name?.trim()) return 'Tile name is required';
  //   if (!newTile.size?.trim()) return 'Tile size is required';
  //   if (!newTile.price || newTile.price <= 0) return 'Valid price is required';
  //   if (newTile.stock === undefined || newTile.stock < 0) return 'Valid stock quantity is required';
  //   if (!newTile.imageUrl?.trim()) return 'Image is required';
  //   return null;
  // };

  const validateTileForm = (): string | null => {
  // ✅ Detailed validation with field identification
  if (!newTile.name?.trim()) {
    return '❌ Tile Name is required. Please enter a tile name.';
  }
  
  if (!newTile.size?.trim()) {
    return '❌ Tile Size is required. Please enter or select a size (e.g., 60x60 cm).';
  }
  
  if (!newTile.price || newTile.price <= 0) {
    return '❌ Valid Price is required. Please enter a price greater than 0.';
  }
  
  if (newTile.stock === undefined || newTile.stock < 0) {
    return '❌ Valid Stock Quantity is required. Please enter stock (0 or more).';
  }
  
  if (!newTile.imageUrl?.trim()) {
    return '❌ Tile Image is required. Please upload an image before saving.';
  }
  
  // ✅ All validations passed
  return null;
};

  const handleAddTile = async () => {
    try {
      setError(null);
      
      const validationError = validateTileForm();
      if (validationError) {
        setError(validationError);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      
      // ✅ FIX 3: Auto-clear after 8 seconds (longer than current 5s)
      setTimeout(() => {
        // Don't clear if there's a new error
        setError(prev => prev === validationError ? null : prev);
      }, 8000);
        return;
      }

      if (!currentUser) {
        setError('User not authenticated');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      
      console.log('🔄 Step 1/4: Preparing tile data...');
      
      const tileCode = newTile.tileCode || generateTileCode();
      
      const baseTileData = {
        ...newTile,
        sellerId: currentUser.user_id,
        showroomId: currentUser.user_id,
        tileCode: tileCode,
        inStock: (newTile.stock || 0) > 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      console.log('💾 Step 2/4: Saving tile to database...');
      
      const savedTile = await uploadTile(baseTileData);
      
      if (!savedTile || !savedTile.id) {
        throw new Error('Tile saved but ID not returned');
      }
      
      console.log('✅ Tile saved with ID:', savedTile.id);
      console.log('📱 Step 3/4: Generating QR code...');
      
      let qrCodeGenerated = false;
      try {
        const qrCodeDataUrl = await generateTileQRCode(savedTile);
        
        console.log('✅ QR code generated successfully');
        console.log('🔄 Step 4/4: Updating tile with QR code...');
        
        await updateTileQRCode(savedTile.id, qrCodeDataUrl);
        
        console.log('✅ Tile updated with QR code');
        qrCodeGenerated = true;
        
      } catch (qrError: any) {
        console.warn('⚠️ QR code generation failed:', qrError.message);
      }
      
      await loadData();
      
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

  const handleUpdateTile = async () => {
    try {
      setError(null);
      
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
      
      const updates = {
        ...newTile,
        inStock: (newTile.stock || 0) > 0,
        updatedAt: new Date().toISOString()
      };
      
      console.log('💾 Updating tile in database...');
      await updateTile(editingTile.id, updates);
      console.log('✅ Tile updated in database');
      
      const criticalFieldsChanged = 
        editingTile.name !== newTile.name ||
        editingTile.tileCode !== newTile.tileCode ||
        editingTile.price !== newTile.price ||
        editingTile.size !== newTile.size ||
        editingTile.category !== newTile.category;
      
      if (criticalFieldsChanged) {
        console.log('🔄 Critical fields changed, attempting QR regeneration...');
        
        setTimeout(async () => {
          try {
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
            
            await loadData();
            
          } catch (qrError: any) {
            console.error('⚠️ QR regeneration failed (non-critical):', qrError.message);
          }
        }, 0);
      } else {
        console.log('ℹ️ No critical fields changed, keeping existing QR code');
      }
      
      console.log('🔄 Reloading tiles list...');
      await loadData();
      
      setEditingTile(null);
      resetNewTile();
      
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
      
      await deleteTile(tileId);
      
      console.log('✅ Deleted from database');
      
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
    setMobileMenuOpen(false);
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

  if (!isAuthenticated) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
        <div className="text-center py-8 sm:py-12">
          <AlertCircle className="w-12 h-12 sm:w-16 sm:h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">Authentication Required</h2>
          <p className="text-sm sm:text-base text-gray-600 mb-6 px-4">Please log in to access the seller dashboard.</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm sm:text-base"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
        <div className="text-center py-8 sm:py-12">
          <User className="w-12 h-12 sm:w-16 sm:h-16 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">User Profile Not Found</h2>
          <p className="text-sm sm:text-base text-gray-600 mb-6 px-4">Unable to load user profile. Please try logging in again.</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm sm:text-base"
          >
            Reload Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (currentUser.role !== 'seller') {
    return (
      <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
        <div className="text-center py-8 sm:py-12">
          <AlertCircle className="w-12 h-12 sm:w-16 sm:h-16 text-orange-500 mx-auto mb-4" />
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">Access Denied</h2>
          <p className="text-sm sm:text-base text-gray-600 mb-6 px-4">
            This dashboard is only accessible to sellers. Your role: <strong>{currentUser.role}</strong>
          </p>
          <button 
            onClick={() => window.location.href = '/'}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm sm:text-base"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Loader className="w-10 h-10 sm:w-12 sm:h-12 animate-spin text-green-600 mx-auto mb-4" />
            <p className="text-gray-600 text-base sm:text-lg">Loading dashboard...</p>
            <p className="text-gray-500 text-xs sm:text-sm mt-2 px-4">
              Loading data for {currentUser.full_name || currentUser.email}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 lg:p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 mb-4 sm:mb-6">
        {/* Title Section */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <Store className="w-6 h-6 sm:w-8 sm:h-8 text-green-600 flex-shrink-0" />
            <div className="min-w-0">
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 truncate">Seller Dashboard</h2>
              <p className="text-xs sm:text-sm text-gray-600 truncate">{sellerProfile?.business_name || 'Your Business'}</p>
              
              {/* Stats - Mobile Optimized */}
              <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-1 text-xs sm:text-sm text-gray-500">
                <span className="flex items-center gap-1 whitespace-nowrap">
                  <Package className="w-3 h-3 sm:w-4 sm:h-4" />
                  {tiles.length} Total
                </span>
                <span className="flex items-center gap-1 text-green-600 whitespace-nowrap">
                  <Package className="w-3 h-3 sm:w-4 sm:h-4" />
                  {tiles.filter(t => t.inStock).length} Stock
                </span>
                <span className="flex items-center gap-1 text-red-600 whitespace-nowrap">
                  <Package className="w-3 h-3 sm:w-4 sm:h-4" />
                  {tiles.filter(t => !t.inStock).length} Out
                </span>
              </div>
            </div>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden flex-shrink-0 p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Navigation Tabs - Desktop */}
        <div className="hidden lg:flex gap-2 flex-wrap">
          <button
            onClick={() => handleTabChange('tiles')}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm ${
              activeTab === 'tiles' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Edit className="w-4 h-4" />
            My Tiles
          </button>
          <button
            onClick={() => handleTabChange('worker')}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm ${
              activeTab === 'worker' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <User className="w-4 h-4" />
            Worker
          </button>
          <button
            onClick={() => window.open('/scan', '_blank')}
            className="flex items-center gap-2 px-3 py-2 rounded-lg transition-colors bg-purple-600 text-white hover:bg-purple-700 text-sm"
          >
            <QrCode className="w-4 h-4" />
            Scan
          </button>
          <button
            onClick={() => handleTabChange('profile')}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm ${
              activeTab === 'profile' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <User className="w-4 h-4" />
            Profile
          </button>
          <button
            onClick={() => handleTabChange('excel')}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm ${
              activeTab === 'excel' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4" />
            Excel
          </button>
          <button
            onClick={() => handleTabChange('stock-analytics')}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm ${
              activeTab === 'stock-analytics' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Package className="w-4 h-4" />
            Stock Analytics
          </button>
          <button
            onClick={() => handleTabChange('bulk')}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm ${
              activeTab === 'bulk' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Upload className="w-4 h-4" />
            CSV
          </button>
          <button
            onClick={() => handleTabChange('qrcodes')}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm ${
              activeTab === 'qrcodes' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <QrCode className="w-4 h-4" />
            QR Codes
          </button>
          <button
            onClick={() => handleTabChange('analytics')}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm ${
              activeTab === 'analytics' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            Analytics
          </button>
        </div>

        {/* Navigation Tabs - Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden grid grid-cols-2 gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
            <button
              onClick={() => handleTabChange('tiles')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm ${
                activeTab === 'tiles' ? 'bg-green-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Edit className="w-4 h-4" />
              Tiles
            </button>
            <button
              onClick={() => handleTabChange('worker')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm ${
                activeTab === 'worker' ? 'bg-green-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              <User className="w-4 h-4" />
              Worker
            </button>
            <button
              onClick={() => window.open('/scan', '_blank')}
              className="flex items-center gap-2 px-3 py-2 rounded-lg transition-colors bg-purple-600 text-white hover:bg-purple-700 text-sm"
            >
              <QrCode className="w-4 h-4" />
              Scan
            </button>
            <button
              onClick={() => handleTabChange('profile')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm ${
                activeTab === 'profile' ? 'bg-green-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              <User className="w-4 h-4" />
              Profile
            </button>
            <button
              onClick={() => handleTabChange('excel')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm ${
                activeTab === 'excel' ? 'bg-green-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              <FileSpreadsheet className="w-4 h-4" />
              Excel
            </button>
            <button
              onClick={() => handleTabChange('stock-analytics')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm ${
                activeTab === 'stock-analytics' ? 'bg-green-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Package className="w-4 h-4" />
              Stock
            </button>
            <button
              onClick={() => handleTabChange('bulk')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm ${
                activeTab === 'bulk' ? 'bg-green-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Upload className="w-4 h-4" />
              CSV
            </button>
            <button
              onClick={() => handleTabChange('qrcodes')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm ${
                activeTab === 'qrcodes' ? 'bg-green-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              <QrCode className="w-4 h-4" />
              QR
            </button>
            <button
              onClick={() => handleTabChange('analytics')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm ${
                activeTab === 'analytics' ? 'bg-green-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              Analytics
            </button>
          </div>
        )}
      </div>

      {/* Alert Messages */}
      {error && (
        <div className="mb-4 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2 sm:gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-red-800 font-medium text-sm sm:text-base">Error</p>
            <p className="text-red-700 text-xs sm:text-sm break-words">{error}</p>
          </div>
          <button 
            onClick={() => setError(null)}
            className="text-red-400 hover:text-red-600 font-bold text-lg flex-shrink-0"
          >
            ×
          </button>
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 sm:p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-2 sm:gap-3">
          <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-green-800 font-medium text-sm sm:text-base">Success</p>
            <p className="text-green-700 text-xs sm:text-sm break-words">{success}</p>
          </div>
          <button 
            onClick={() => setSuccess(null)}
            className="text-green-400 hover:text-green-600 font-bold text-lg flex-shrink-0"
          >
            ×
          </button>
        </div>
      )}

      {/* Tiles Tab */}
      {activeTab === 'tiles' && (
        <>
          {/* Controls - Responsive */}
          <div className="flex flex-col gap-3 mb-4 sm:mb-6">
            {/* Search Bar */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search tiles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 w-full text-sm sm:text-base"
              />
            </div>

            {/* Filters Row */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:flex gap-2">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm"
              >
                <option value="all">All Categories</option>
                <option value="floor">Floor Only</option>
                <option value="wall">Wall Only</option>
                <option value="both">Floor & Wall</option>
              </select>

              <select
                value={stockFilter}
                onChange={(e) => setStockFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm"
              >
                <option value="all">All Stock</option>
                <option value="in-stock">In Stock</option>
                <option value="out-of-stock">Out of Stock</option>
              </select>

              <button
                onClick={loadData}
                className="flex items-center justify-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                title="Refresh Data"
              >
                <RefreshCw className="w-4 h-4" />
                <span className="hidden sm:inline">Refresh</span>
              </button>

              <button
                onClick={() => setIsAddingTile(true)}
                className="col-span-2 sm:col-span-1 flex items-center justify-center gap-2 bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm"
              >
                <Plus className="w-4 h-4" />
                Add New Tile
              </button>
            </div>

            {/* Results Summary */}
            <div className="text-xs sm:text-sm text-gray-600">
              Showing {filteredTiles.length} of {tiles.length} tiles
              {searchTerm && <span className="font-medium"> matching "{searchTerm}"</span>}
            </div>
          </div>

          {/* Add/Edit Tile Form - Responsive */}
          {(isAddingTile || editingTile) && (
            <div className="mb-4 sm:mb-6 p-3 sm:p-4 lg:p-6 border-2 border-dashed border-green-300 rounded-xl bg-green-50">
              <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 flex items-center gap-2">
                {editingTile ? (
                  <>
                    <Edit className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="truncate">Edit: {editingTile.name}</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                    Add New Tile
                  </>
                )}
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {/* Tile Name */}
                <div className="space-y-2">
                  <label className="block text-xs sm:text-sm font-medium text-gray-700">
                    Tile Name *
                  </label>
                  <input
                    type="text"
                    placeholder="Enter tile name"
                    value={newTile.name}
                    onChange={(e) => setNewTile({ ...newTile, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm"
                  />
                </div>

                {/* Tile Code */}
                <div className="space-y-2">
                  <label className="block text-xs sm:text-sm font-medium text-gray-700">
                    Tile Code
                  </label>
                  <input
                    type="text"
                    placeholder="Auto-generated if empty"
                    value={newTile.tileCode}
                    onChange={(e) => setNewTile({ ...newTile, tileCode: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm"
                  />
                </div>

                {/* Category */}
                <div className="space-y-2">
                  <label className="block text-xs sm:text-sm font-medium text-gray-700">
                    Category *
                  </label>
                  <select
                    value={newTile.category}
                    onChange={(e) => setNewTile({ ...newTile, category: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm"
                  >
                    <option value="floor">Floor Only</option>
                    <option value="wall">Wall Only</option>
                    <option value="both">Floor & Wall</option>
                  </select>
                </div>

                {/* Size */}
                <div className="space-y-2">
                  <label className="block text-xs sm:text-sm font-medium text-gray-700">
                    Size *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., 60x60 cm"
                    value={newTile.size}
                    onChange={(e) => setNewTile({ ...newTile, size: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm"
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
{/* ═══════════════════════════════════════════════════════════════ */}
{/* ✅ NEW: TILE SURFACE */}
{/* ═══════════════════════════════════════════════════════════════ */}
<div className="space-y-2">
  <label className="block text-xs sm:text-sm font-medium text-gray-700">
    Tile Surface
  </label>
  <select
    value={newTile.tileSurface || ''}
    onChange={(e) => setNewTile({ ...newTile, tileSurface: e.target.value || undefined })}
    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm"
  >
    <option value="">Select Surface Finish</option>
    <option value="Polished">Polished</option>
    <option value="Step Side">Step Side</option>
    <option value="Matt">Matt</option>
    <option value="Carving">Carving</option>
    <option value="High Gloss">High Gloss</option>
    <option value="Metallic">Metallic</option>
    <option value="Sugar">Sugar</option>
    <option value="Glue">Glue</option>
    <option value="Punch">Punch</option>
  </select>
</div>

{/* ═══════════════════════════════════════════════════════════════ */}
{/* ✅ NEW: TILE MATERIAL */}
{/* ═══════════════════════════════════════════════════════════════ */}
<div className="space-y-2">
  <label className="block text-xs sm:text-sm font-medium text-gray-700">
    Tile Material
  </label>
  <select
    value={newTile.tileMaterial || ''}
    onChange={(e) => setNewTile({ ...newTile, tileMaterial: e.target.value || undefined })}
    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm"
  >
    <option value="">Select Material Type</option>
    <option value="Slabs">Slabs</option>
    <option value="GVT & PGVT">GVT & PGVT</option>
    <option value="Double Charge">Double Charge</option>
    <option value="Counter Tops">Counter Tops</option>
    <option value="Full Body">Full Body</option>
    <option value="Ceramic">Ceramic</option>
    <option value="Mosaic">Mosaic</option>
    <option value="Subway">Subway</option>
  </select>
</div>
                {/* Price */}
                <div className="space-y-2">
                  <label className="block text-xs sm:text-sm font-medium text-gray-700">
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm"
                    min="0"
                    step="0.01"
                  />
                </div>

                {/* Stock */}
                <div className="space-y-2">
                  <label className="block text-xs sm:text-sm font-medium text-gray-700">
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm"
                    min="0"
                  />
                </div>

                {/* Main Image Upload */}
                <div className="space-y-2">
                  <label className="block text-xs sm:text-sm font-medium text-gray-700">
                    Tile Image *
                  </label>
                  <div className="flex flex-col gap-2">
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
                      className={`flex items-center justify-center gap-2 px-3 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors text-sm ${
                        imageUploading ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      {imageUploading ? (
                        <>
                          <Loader className="w-4 h-4 animate-spin" />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Upload className="w-4 h-4" />
                          Choose Image
                        </>
                      )}
                    </label>
                    {newTile.imageUrl && (
                      <div className="flex items-center gap-2">
                        <img
                          src={newTile.imageUrl}
                          alt="Preview"
                          className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                        />
                        <div className="flex items-center gap-1 text-green-600">
                          <CheckCircle className="w-4 h-4" />
                          <span className="text-xs">Uploaded</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Texture Image Upload */}
                <div className="space-y-2">
                  <label className="block text-xs sm:text-sm font-medium text-gray-700">
                    Texture (Optional)
                  </label>
                  <div className="flex flex-col gap-2">
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
                      className={`flex items-center justify-center gap-2 px-3 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors text-sm ${
                        textureUploading ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      {textureUploading ? (
                        <>
                          <Loader className="w-4 h-4 animate-spin" />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Upload className="w-4 h-4" />
                          Choose Texture
                        </>
                      )}
                    </label>
                    {newTile.textureUrl && (
                      <div className="flex items-center gap-2">
                        <img
                          src={newTile.textureUrl}
                          alt="Texture"
                          className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                        />
                        <div className="flex items-center gap-1 text-green-600">
                          <CheckCircle className="w-4 h-4" />
                          <span className="text-xs">Uploaded</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex flex-col sm:flex-row gap-2 mt-4 sm:mt-6">
                {/* <button
                  onClick={editingTile ? handleUpdateTile : handleAddTile}
                  disabled={imageUploading || textureUploading}
                  className="flex items-center justify-center gap-2 bg-green-600 text-white px-4 sm:px-6 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm sm:text-base"
                >
                  <Save className="w-4 h-4" />
                  {editingTile ? 'Update Tile' : 'Save Tile'}
                </button> */}

                <button
  onClick={editingTile ? handleUpdateTile : handleAddTile}
  disabled={imageUploading || textureUploading}
  className="flex items-center justify-center gap-2 bg-green-600 text-white px-4 sm:px-6 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm sm:text-base active:scale-95"
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
                  className="px-4 sm:px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm sm:text-base"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}



{/* ✅ VALIDATION ERROR - PROMINENT DISPLAY */}
{error && (isAddingTile || editingTile) && (
  <div className="mb-4 p-4 bg-red-50 border-2 border-red-300 rounded-xl shadow-lg animate-shake">
    <div className="flex items-start gap-3">
      <AlertCircle className="w-6 h-6 text-red-600 mt-0.5 flex-shrink-0" />
      <div className="flex-1">
        <p className="text-red-800 font-bold text-base mb-1">Cannot Save Tile</p>
        <p className="text-red-700 text-sm">{error}</p>
      </div>
      <button 
        onClick={() => setError(null)}
        className="text-red-400 hover:text-red-600 font-bold text-xl"
        aria-label="Close error"
      >
        ×
      </button>
    </div>
  </div>
)}
          {/* Tiles Display - Desktop Table / Mobile Cards */}
          
          {/* Desktop Table View */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full border-collapse bg-white rounded-lg border border-gray-200">
              {/* <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left p-3 font-semibold text-gray-700 text-sm">Image</th>
                  <th className="text-left p-3 font-semibold text-gray-700 text-sm">Name</th>
                  <th className="text-left p-3 font-semibold text-gray-700 text-sm">Code</th>
                  <th className="text-left p-3 font-semibold text-gray-700 text-sm">Category</th>
                  <th className="text-left p-3 font-semibold text-gray-700 text-sm">Size</th>
                  <th className="text-left p-3 font-semibold text-gray-700 text-sm">Price</th>
                  <th className="text-left p-3 font-semibold text-gray-700 text-sm">Stock</th>
                  <th className="text-left p-3 font-semibold text-gray-700 text-sm">Status</th>
                  <th className="text-left p-3 font-semibold text-gray-700 text-sm">QR</th>
                  <th className="text-left p-3 font-semibold text-gray-700 text-sm">Actions</th>
                </tr>
              </thead> */}

<thead>
  <tr className="bg-gray-50 border-b border-gray-200">
    <th className="text-left p-3 font-semibold text-gray-700 text-sm">Image</th>
    <th className="text-left p-3 font-semibold text-gray-700 text-sm">Name</th>
    <th className="text-left p-3 font-semibold text-gray-700 text-sm">Code</th>
    <th className="text-left p-3 font-semibold text-gray-700 text-sm">Category</th>
    <th className="text-left p-3 font-semibold text-gray-700 text-sm">Size</th>
    {/* ✅ NEW COLUMNS */}
    <th className="text-left p-3 font-semibold text-gray-700 text-sm">Surface</th>
    <th className="text-left p-3 font-semibold text-gray-700 text-sm">Material</th>
    <th className="text-left p-3 font-semibold text-gray-700 text-sm">Price</th>
    <th className="text-left p-3 font-semibold text-gray-700 text-sm">Stock</th>
    <th className="text-left p-3 font-semibold text-gray-700 text-sm">Status</th>
    <th className="text-left p-3 font-semibold text-gray-700 text-sm">QR</th>
    <th className="text-left p-3 font-semibold text-gray-700 text-sm">Actions</th>
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
                          <div className="font-medium text-gray-900 text-sm">{tile.name}</div>
                          {tile.textureUrl && (
                            <div className="text-xs text-green-600">Has texture</div>
                          )}
                        </div>
                      </td>
                      <td className="p-3 text-xs text-gray-600 font-mono">{tile.tileCode}</td>
                      <td className="p-3">
                        <span className={`
                          px-2 py-1 rounded-full text-xs font-medium
                          ${tile.category === 'floor' ? 'bg-blue-100 text-blue-800' :
                            tile.category === 'wall' ? 'bg-purple-100 text-purple-800' :
                            'bg-gray-100 text-gray-800'
                          }
                        `}>
                          {tile.category === 'both' ? 'Both' : 
                           tile.category.charAt(0).toUpperCase() + tile.category.slice(1)}
                        </span>
                      </td>
                      <td className="p-3 text-gray-600 text-sm">{tile.size}</td>

                      <td className="p-3 text-xs sm:text-sm">
  {tile.tileSurface ? (
    <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 px-2 py-1 rounded-full text-xs">
      <span>🔘</span>
      <span className="hidden md:inline">{tile.tileSurface}</span>
    </span>
  ) : (
    <span className="text-gray-400 text-xs">—</span>
  )}
</td>

{/* ✅ NEW: MATERIAL */}
<td className="p-3 text-xs sm:text-sm">
  {tile.tileMaterial ? (
    <span className="inline-flex items-center gap-1 bg-purple-50 text-purple-700 px-2 py-1 rounded-full text-xs">
      <span>🧱</span>
      <span className="hidden md:inline">{tile.tileMaterial}</span>
    </span>
  ) : (
    <span className="text-gray-400 text-xs">—</span>
  )}
</td>

                      <td className="p-3 font-semibold text-gray-900 text-sm">₹{tile.price.toLocaleString()}</td>
                      <td className="p-3">
                        <div className="text-sm">
                          <div className="font-medium">{tile.stock || 0}</div>
                          {(tile.stock || 0) < 10 && tile.inStock && (
                            <div className="text-xs text-orange-600">Low</div>
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
                          {tile.qrCode ? '✓' : '○'}
                        </span>
                      </td>
                      <td className="p-3">
                        <div className="flex gap-2">
                          <button 
                            onClick={() => handleEditTile(tile)}
                            className="p-1 text-blue-600 hover:bg-blue-100 rounded transition-colors"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDeleteTile(tile.id, tile.name)}
                            className="p-1 text-red-600 hover:bg-red-100 rounded transition-colors"
                            title="Delete"
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

          {/* Mobile/Tablet Card View */}
          <div className="lg:hidden space-y-3">
            {filteredTiles.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                {tiles.length === 0 ? (
                  <div className="space-y-2">
                    <Package className="w-16 h-16 text-gray-300 mx-auto" />
                    <p className="font-medium">No tiles found</p>
                    <p className="text-sm">Start by adding your first tile!</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Search className="w-16 h-16 text-gray-300 mx-auto" />
                    <p className="font-medium">No tiles match your search</p>
                    <p className="text-sm">Try adjusting your search or filters</p>
                  </div>
                )}
              </div>
            ) : (
              filteredTiles.map((tile) => (
                <div key={tile.id} className="bg-white border border-gray-200 rounded-lg p-3 sm:p-4 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex gap-3">
                    {/* Image */}
                    <div className="flex-shrink-0">
                      <img
                        src={tile.imageUrl}
                        alt={tile.name}
                        className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-lg border border-gray-200"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/placeholder-tile.png';
                        }}
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      {/* Title Row */}
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="min-w-0 flex-1">
                          <h3 className="font-semibold text-gray-900 text-sm sm:text-base truncate">{tile.name}</h3>
                          <p className="text-xs text-gray-500 font-mono">{tile.tileCode}</p>
                        </div>
                        <div className="flex gap-1 flex-shrink-0">
                          <button 
                            onClick={() => handleEditTile(tile)}
                            className="p-2 text-blue-600 hover:bg-blue-100 rounded transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDeleteTile(tile.id, tile.name)}
                            className="p-2 text-red-600 hover:bg-red-100 rounded transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Info Grid */}
                      {/* <div className="grid grid-cols-2 gap-2 text-xs sm:text-sm">
                        <div>
                          <span className="text-gray-500">Category:</span>
                          <div className="mt-0.5">
                            <span className={`
                              px-2 py-0.5 rounded-full text-xs font-medium
                              ${tile.category === 'floor' ? 'bg-blue-100 text-blue-800' :
                                tile.category === 'wall' ? 'bg-purple-100 text-purple-800' :
                                'bg-gray-100 text-gray-800'
                              }
                            `}>
                              {tile.category === 'both' ? 'Both' : tile.category}
                            </span>
                          </div>
                        </div>
                        <div>
                          <span className="text-gray-500">Size:</span>
                          <div className="font-medium text-gray-900">{tile.size}</div>
                        </div>
                        <div>
                          <span className="text-gray-500">Price:</span>
                          <div className="font-semibold text-gray-900">₹{tile.price.toLocaleString()}</div>
                        </div>
                        <div>
                          <span className="text-gray-500">Stock:</span>
                          <div className="font-medium text-gray-900">
                            {tile.stock || 0}
                            {(tile.stock || 0) < 10 && tile.inStock && (
                              <span className="text-orange-600 ml-1">(Low)</span>
                            )}
                          </div>
                        </div>
                      </div> */}

{/* Info Grid */}
<div className="grid grid-cols-2 gap-2 text-xs sm:text-sm">
  <div>
    <span className="text-gray-500">Category:</span>
    <div className="mt-0.5">
      <span className={`
        px-2 py-0.5 rounded-full text-xs font-medium
        ${tile.category === 'floor' ? 'bg-blue-100 text-blue-800' :
          tile.category === 'wall' ? 'bg-purple-100 text-purple-800' :
          'bg-gray-100 text-gray-800'
        }
      `}>
        {tile.category === 'both' ? 'Both' : tile.category}
      </span>
    </div>
  </div>
  <div>
    <span className="text-gray-500">Size:</span>
    <div className="font-medium text-gray-900">{tile.size}</div>
  </div>
  <div>
    <span className="text-gray-500">Price:</span>
    <div className="font-semibold text-gray-900">₹{tile.price.toLocaleString()}</div>
  </div>
  <div>
    <span className="text-gray-500">Stock:</span>
    <div className="font-medium text-gray-900">
      {tile.stock || 0}
      {(tile.stock || 0) < 10 && tile.inStock && (
        <span className="text-orange-600 ml-1">(Low)</span>
      )}
    </div>
  </div>
</div>

{/* ═══════════════════════════════════════════════════════════════ */}
{/* ✅ NEW: SURFACE & MATERIAL ACCORDION (MOBILE ONLY) */}
{/* ═══════════════════════════════════════════════════════════════ */}
{(tile.tileSurface || tile.tileMaterial) && (
  <div className="mt-3 border-t border-gray-200 pt-3">
    <button
      onClick={() => setExpandedTileId(expandedTileId === tile.id ? null : tile.id)}
      className="w-full flex items-center justify-between text-xs sm:text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
    >
      <span className="flex items-center gap-1.5">
        <Package className="w-3.5 h-3.5" />
        Tile Specifications
      </span>
      {expandedTileId === tile.id ? (
        <ChevronUp className="w-4 h-4 text-gray-500" />
      ) : (
        <ChevronDown className="w-4 h-4 text-gray-500" />
      )}
    </button>

    {expandedTileId === tile.id && (
      <div className="mt-2 space-y-2 animate-slide-down">
        {tile.tileSurface && (
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-600 flex items-center gap-1">
              <span>🔘</span>
              Surface:
            </span>
            <span className="font-medium text-gray-900 bg-blue-50 text-blue-700 px-2 py-1 rounded-full">
              {tile.tileSurface}
            </span>
          </div>
        )}
        {tile.tileMaterial && (
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-600 flex items-center gap-1">
              <span>🧱</span>
              Material:
            </span>
            <span className="font-medium text-gray-900 bg-purple-50 text-purple-700 px-2 py-1 rounded-full">
              {tile.tileMaterial}
            </span>
          </div>
        )}
      </div>
    )}
  </div>
)}
                      {/* Status Row */}
                      <div className="flex items-center gap-2 mt-2 flex-wrap">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStockStatusColor(tile)}`}>
                          {getStockStatusText(tile)}
                        </span>
                        <span className={`
                          px-2 py-1 rounded-full text-xs font-medium
                          ${tile.qrCode ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}
                        `}>
                          QR: {tile.qrCode ? 'Yes' : 'No'}
                        </span>
                        {tile.textureUrl && (
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Has Texture
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}

      {/* Other Tabs - Wrapped for Responsiveness */}
      <div className="overflow-hidden">
        {activeTab === 'worker' && <WorkerManagement />}
        {activeTab === 'profile' && <SellerProfile />}
        {activeTab === 'excel' && <ExcelUpload onUploadComplete={loadData} />}
        {activeTab === 'stock-analytics' && <SellerStockAnalytics />}
        {activeTab === 'bulk' && <BulkUpload onUploadComplete={loadData} />}
        {activeTab === 'qrcodes' && (
          <QRCodeManager 
            tiles={tiles} 
            sellerId={currentUser?.user_id} 
            onQRCodeGenerated={loadData}
          />
        )}
        {activeTab === 'analytics' && <AnalyticsDashboard sellerId={currentUser?.user_id} />}
      </div>
    </div>
  );
};