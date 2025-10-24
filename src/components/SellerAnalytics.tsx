
// // export default SellerAnalytics;  
// import React, { useState, useEffect, useCallback, useMemo } from 'react';
// import { 
//   Store, Eye, Layers, QrCode, TrendingUp, 
//   Activity, Calendar, Clock, ArrowLeft, RefreshCw,
//   Package, BarChart3, Download, Filter, X, CheckCircle,
//   XCircle, Smartphone, Monitor, MapPin,
//   FileText, Zap, Users, AlertCircle,
//   ChevronLeft, ChevronRight, Search
// } from 'lucide-react';
// import {
//   getSellerAnalyticsOverview,
//   getSellerTopViewedTiles,
//   getSellerTopQRScannedTiles,
//   getSellerDailyActivity,
//   getSellerQRGenerationHistory,
//   getSellerQRGenerationStats,
//   getSellerScansByDevice,
//   getSellerScansByLocation,
//   exportSellerAnalytics
// } from '../lib/analyticsService';
// import { getSellerTiles } from '../lib/firebaseutils'; // ✅ IMPORT ADDED
// import {
//   AnalyticsOverview,
//   AnalyticsTile,
//   QRScannedTile,
//   DailyActivity,
//   QRGenerationHistory,
//   QRGenerationStats,
//   DeviceScanStats,
//   LocationScanStats,
//   DateRange
// } from '../types/analytics';
// import { AnalyticsErrorBoundary } from './AnalyticsErrorBoundary';

// // ===== UTILITY FUNCTIONS =====
// const formatNumber = (num: number): string => {
//   return num.toLocaleString('en-IN');
// };

// const formatDateTime = (date: Date | string | null | undefined): string => {
//   if (!date) return 'N/A';
//   try {
//     const d = typeof date === 'string' ? new Date(date) : date;
//     return d.toLocaleString('en-IN', { 
//       month: 'short', 
//       day: 'numeric', 
//       year: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
//     });
//   } catch {
//     return 'Invalid Date';
//   }
// };

// const formatPercentage = (value: number, total: number): string => {
//   if (total === 0) return '0%';
//   return `${Math.round((value / total) * 100)}%`;
// };

// // ===== INTERFACES =====
// interface SellerAnalyticsProps {
//   sellerId: string;
//   sellerName: string;
//   onClose: () => void;
// }

// // type TabType = 'overview' | 'qr-tracking' | 'tiles-inventory' | 'engagement'; // ✅ UPDATED
// type TabType = 'overview' | 'qr-tracking' | 'tiles-inventory' | 'top-scanned' | 'engagement'; // ✅ UPDATED

// interface LoadingState {
//   isLoading: boolean;
//   isRefreshing: boolean;
//   isExporting: boolean;
// }

// interface ErrorState {
//   hasError: boolean;
//   message: string | null;
// }

// // ===== MAIN COMPONENT =====
// const SellerAnalyticsContent: React.FC<SellerAnalyticsProps> = ({ 
//   sellerId, 
//   sellerName,
//   onClose 
// }) => {
//   // ===== STATE MANAGEMENT =====
//   const [loadingState, setLoadingState] = useState<LoadingState>({
//     isLoading: true,
//     isRefreshing: false,
//     isExporting: false
//   });

//   const [errorState, setErrorState] = useState<ErrorState>({
//     hasError: false,
//     message: null
//   });

//   // Data States
//   const [overview, setOverview] = useState<AnalyticsOverview | null>(null);
//   const [topViewedTiles, setTopViewedTiles] = useState<AnalyticsTile[]>([]);
//   const [topQRTiles, setTopQRTiles] = useState<QRScannedTile[]>([]);
//   const [topScannedTiles, setTopScannedTiles] = useState<QRScannedTile[]>([]); // ✅ NEW
//   const [dailyActivity, setDailyActivity] = useState<DailyActivity[]>([]);
//   const [qrGenerationHistory, setQRGenerationHistory] = useState<QRGenerationHistory[]>([]);
//   const [qrStats, setQRStats] = useState<QRGenerationStats | null>(null);
//   const [scansByDevice, setScansByDevice] = useState<DeviceScanStats[]>([]);
//   const [scansByLocation, setScansByLocation] = useState<LocationScanStats[]>([]);
//   const [allTiles, setAllTiles] = useState<any[]>([]); // ✅ NEW STATE
  
//   // UI States
//   const [activeTab, setActiveTab] = useState<TabType>('overview');
//   const [dateRange, setDateRange] = useState<DateRange>({
//     start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
//     end: new Date()
//   });
//   const [showFilters, setShowFilters] = useState(false);
//   const [autoRefresh, setAutoRefresh] = useState(false);

//   // ✅ NEW STATES - Tiles Inventory
//   const [searchTerm, setSearchTerm] = useState('');
//   const [categoryFilter, setCategoryFilter] = useState<'all' | 'wall' | 'floor' | 'both'>('all');
//   const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
//   const [qrFilter, setQrFilter] = useState<'all' | 'with' | 'without'>('all');
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage, setItemsPerPage] = useState(10);
//   const [sortBy, setSortBy] = useState<'name' | 'price' | 'stock' | 'date'>('name');
//   const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

//   // ===== LOAD ANALYTICS FUNCTION =====
//   const loadAnalytics = useCallback(async (silent = false) => {
//     try {
//       // Set loading state
//       if (!silent) {
//         setLoadingState(prev => ({ ...prev, isLoading: true }));
//       } else {
//         setLoadingState(prev => ({ ...prev, isRefreshing: true }));
//       }
      
//       setErrorState({ hasError: false, message: null });

//       // ✅ UPDATED - Added getSellerTiles
//       // const [
//       //   overviewData,
//       //   topViewed,
//       //   topQR,
//       //   activity,
//       //   qrHistory,
//       //   qrStatsData,
//       //   deviceData,
//       //   locationData,
//       //   tilesData  // ✅ NEW
//       // ] = await Promise.all([
//       //   getSellerAnalyticsOverview(sellerId),
//       //   getSellerTopViewedTiles(sellerId, 5),
//       //   getSellerTopQRScannedTiles(sellerId, 5),
//       //   getSellerDailyActivity(sellerId, 7),
//       //   getSellerQRGenerationHistory(sellerId, 10),
//       //   getSellerQRGenerationStats(sellerId),
//       //   getSellerScansByDevice(sellerId),
//       //   getSellerScansByLocation(sellerId),
//       //   getSellerTiles(sellerId)  // ✅ NEW - Fetch all tiles
//       // ]);
//       const [
//         overviewData,
//         topViewed,
//         topQR,
//         activity,
//         qrHistory,
//         qrStatsData,
//         deviceData,
//         locationData,
//         tilesData,
//         topScannedAll  // ✅ NEW
//       ] = await Promise.all([
//         getSellerAnalyticsOverview(sellerId),
//         getSellerTopViewedTiles(sellerId, 5),
//         getSellerTopQRScannedTiles(sellerId, 5),
//         getSellerDailyActivity(sellerId, 7),
//         getSellerQRGenerationHistory(sellerId, 10),
//         getSellerQRGenerationStats(sellerId),
//         getSellerScansByDevice(sellerId),
//         getSellerScansByLocation(sellerId),
//         getSellerTiles(sellerId),
//         getSellerTopQRScannedTiles(sellerId, 10)  // ✅ NEW - Top 10
//       ]);
//       // Update all states
//       setOverview(overviewData);
//       setTopViewedTiles(topViewed);
//       setTopQRTiles(topQR);
//       setDailyActivity(activity);
//       setQRGenerationHistory(qrHistory);
//       setQRStats(qrStatsData);
//       setScansByDevice(deviceData);
//       setScansByLocation(locationData);
//       setAllTiles(tilesData);  // ✅ NEW
//       setTopScannedTiles(topScannedAll);  // ✅ NEW

//       console.log('✅ Analytics loaded successfully');
//       console.log('📦 Tiles loaded:', tilesData.length);

//     } catch (error: any) {
//       console.error('❌ Error loading analytics:', error);
//       setErrorState({
//         hasError: true,
//         message: error.message || 'Failed to load analytics data'
//       });
//     } finally {
//       setLoadingState({
//         isLoading: false,
//         isRefreshing: false,
//         isExporting: false
//       });
//     }
//   }, [sellerId]);

//   // ===== EXPORT FUNCTION =====
//   const handleExport = async (format: 'csv' | 'pdf') => {
//     try {
//       setLoadingState(prev => ({ ...prev, isExporting: true }));
      
//       await exportSellerAnalytics({ 
//         sellerId, 
//         format, 
//         dateRange 
//       });
      
//       alert(`✅ Analytics exported successfully as ${format.toUpperCase()}`);
      
//     } catch (error: any) {
//       console.error('❌ Export failed:', error);
//       alert(`❌ Export failed: ${error.message}`);
//     } finally {
//       setLoadingState(prev => ({ ...prev, isExporting: false }));
//     }
//   };
//   const handleExportTopScanned = () => {
//     try {
//       const csv = [
//         ['Rank', 'Tile Name', 'Code', 'Category', 'Size', 'Price', 'Total Scans'].join(','),
//         ...topScannedTiles.map((t, i) => [
//           i + 1,
//           `"${t.name}"`,
//           t.code || 'N/A',
//           t.category,
//           t.size,
//           t.price,
//           t.scanCount
//         ].join(','))
//       ].join('\n');
      
//       const blob = new Blob([csv], { type: 'text/csv' });
//       const url = window.URL.createObjectURL(blob);
//       const a = document.createElement('a');
//       a.href = url;
//       a.download = `top-scanned-qr-${sellerId}-${Date.now()}.csv`;
//       a.click();
//       window.URL.revokeObjectURL(url);
//       alert('✅ Top scanned data exported!');
//     } catch (error) {
//       alert('❌ Export failed');
//     }
//   };
//   // ✅ NEW - Export Tiles CSV
//   const handleExportTiles = () => {
//     try {
//       const csv = [
//         ['Name', 'Code', 'Category', 'Size', 'Price', 'Brand', 'Color', 'Stock', 'Status', 'QR Generated', 'Created'].join(','),
//         ...filteredTiles.map(t => [
//           `"${t.name || 'N/A'}"`,
//           t.code || t.product_code || 'N/A',
//           t.category || 'N/A',
//           t.size || 'N/A',
//           t.price || 0,
//           t.brand || 'N/A',
//           t.color || 'N/A',
//           t.stock || 0,
//           t.status || 'active',
//           t.qrCodeGenerated ? 'Yes' : 'No',
//           t.createdAt || t.created_at || new Date().toISOString()
//         ].join(','))
//       ].join('\n');
      
//       const blob = new Blob([csv], { type: 'text/csv' });
//       const url = window.URL.createObjectURL(blob);
//       const a = document.createElement('a');
//       a.href = url;
//       a.download = `tiles-inventory-${sellerId}-${Date.now()}.csv`;
//       a.click();
//       window.URL.revokeObjectURL(url);
      
//       alert('✅ Tiles exported successfully!');
//     } catch (error) {
//       console.error('❌ Export error:', error);
//       alert('❌ Failed to export tiles');
//     }
//   };

//   // ===== EFFECTS =====
  
//   // Initial load
//   useEffect(() => {
//     loadAnalytics();
//   }, [loadAnalytics]);

//   // Auto-refresh
//   useEffect(() => {
//     if (!autoRefresh) return;
    
//     const interval = setInterval(() => {
//       loadAnalytics(true);
//     }, 30000); // 30 seconds
    
//     return () => clearInterval(interval);
//   }, [autoRefresh, loadAnalytics]);

//   // ✅ Reset pagination when filters change
//   useEffect(() => {
//     setCurrentPage(1);
//   }, [searchTerm, categoryFilter, statusFilter, qrFilter]);

//   // ===== MEMOIZED VALUES =====
//   const dailyActivityTotals = useMemo(() => {
//     if (!dailyActivity.length) return null;
    
//     const totalViews = dailyActivity.reduce((sum, d) => sum + d.views, 0);
//     const totalApplies = dailyActivity.reduce((sum, d) => sum + d.applies, 0);
//     const totalActions = dailyActivity.reduce((sum, d) => sum + d.actions, 0);
//     const avgHours = (
//       dailyActivity.reduce((sum, d) => sum + parseFloat(d.estimatedHours), 0) / 
//       dailyActivity.length
//     ).toFixed(1);
    
//     return {
//       totalViews,
//       totalApplies,
//       totalActions,
//       avgHours
//     };
//   }, [dailyActivity]);

//   // ✅ NEW - Filtered Tiles
//   const filteredTiles = useMemo(() => {
//     let result = [...allTiles];
    
//     // Search filter
//     if (searchTerm.trim()) {
//       const search = searchTerm.toLowerCase().trim();
//       result = result.filter(tile => 
//         tile.name?.toLowerCase().includes(search) ||
//         tile.code?.toLowerCase().includes(search) ||
//         tile.product_code?.toLowerCase().includes(search) ||
//         tile.size?.toLowerCase().includes(search) ||
//         tile.brand?.toLowerCase().includes(search) ||
//         tile.color?.toLowerCase().includes(search)
//       );
//     }
    
//     // Category filter
//     if (categoryFilter !== 'all') {
//       result = result.filter(tile => tile.category === categoryFilter);
//     }
    
//     // Status filter
//     if (statusFilter !== 'all') {
//       result = result.filter(tile => {
//         const tileStatus = tile.status || 'active';
//         return statusFilter === 'active' 
//           ? tileStatus === 'active' 
//           : tileStatus !== 'active';
//       });
//     }
    
//     // QR filter
//     if (qrFilter === 'with') {
//       result = result.filter(tile => tile.qrCodeGenerated === true);
//     } else if (qrFilter === 'without') {
//       result = result.filter(tile => !tile.qrCodeGenerated);
//     }
    
//     // Sorting
//     result.sort((a, b) => {
//       let comparison = 0;
      
//       switch (sortBy) {
//         case 'name':
//           comparison = (a.name || '').localeCompare(b.name || '');
//           break;
//         case 'price':
//           comparison = (a.price || 0) - (b.price || 0);
//           break;
//         case 'stock':
//           comparison = (a.stock || 0) - (b.stock || 0);
//           break;
//         case 'date':
//           const dateA = new Date(a.createdAt || a.created_at || 0).getTime();
//           const dateB = new Date(b.createdAt || b.created_at || 0).getTime();
//           comparison = dateA - dateB;
//           break;
//       }
      
//       return sortOrder === 'asc' ? comparison : -comparison;
//     });
    
//     return result;
//   }, [allTiles, searchTerm, categoryFilter, statusFilter, qrFilter, sortBy, sortOrder]);

//   // ✅ NEW - Paginated Tiles
//   const paginatedTiles = useMemo(() => {
//     const startIndex = (currentPage - 1) * itemsPerPage;
//     const endIndex = startIndex + itemsPerPage;
//     return filteredTiles.slice(startIndex, endIndex);
//   }, [filteredTiles, currentPage, itemsPerPage]);

//   const totalPages = Math.ceil(filteredTiles.length / itemsPerPage);

//   // ✅ NEW - Summary Stats
//   const inventoryStats = useMemo(() => {
//     const totalValue = filteredTiles.reduce((sum, t) => sum + ((t.price || 0) * (t.stock || 1)), 0);
//     const avgPrice = filteredTiles.length > 0 
//       ? Math.round(filteredTiles.reduce((sum, t) => sum + (t.price || 0), 0) / filteredTiles.length)
//       : 0;
//     const withQR = filteredTiles.filter(t => t.qrCodeGenerated).length;
//     const totalStock = filteredTiles.reduce((sum, t) => sum + (t.stock || 0), 0);
    
//     return { totalValue, avgPrice, withQR, totalStock };
//   }, [filteredTiles]);

//   // ===== RENDER HELPERS =====
  
//   // Loading Screen
//   if (loadingState.isLoading) {
//     return (
//       <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
//         <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full">
//           <div className="text-center">
//             <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mx-auto mb-4" />
//             <p className="text-gray-700 font-semibold text-lg">Loading Analytics...</p>
//             <p className="text-gray-500 text-sm mt-2">{sellerName}</p>
//             <div className="mt-4 space-y-2">
//               <div className="h-2 bg-gray-200 rounded overflow-hidden">
//                 <div className="h-full bg-purple-600 animate-pulse w-3/5" />
//               </div>
//               <p className="text-xs text-gray-400">Fetching data from database...</p>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // Error Screen
//   if (errorState.hasError) {
//     return (
//       <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
//         <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full">
//           <div className="text-center">
//             <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
//               <XCircle className="w-10 h-10 text-red-600" />
//             </div>
//             <h3 className="text-xl font-bold text-gray-800 mb-2">Failed to Load Analytics</h3>
//             <p className="text-gray-600 mb-6">{errorState.message}</p>
//             <div className="flex gap-3 justify-center">
//               <button
//                 onClick={() => loadAnalytics()}
//                 className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
//               >
//                 <RefreshCw className="w-4 h-4 inline mr-2" />
//                 Retry
//               </button>
//               <button
//                 onClick={onClose}
//                 className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium"
//               >
//                 Close
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // ===== MAIN UI =====
//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 z-50 overflow-y-auto">
//       <div className="min-h-screen px-2 sm:px-4 py-4 sm:py-8">
//         <div className="bg-white rounded-xl shadow-2xl max-w-7xl mx-auto">
          
//           {/* ===== HEADER ===== */}
//           <div className="bg-gradient-to-r from-purple-600 via-purple-700 to-blue-600 text-white p-4 sm:p-6 rounded-t-xl">
//             <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              
//               {/* Left: Title */}
//               <div className="flex items-start gap-3 sm:gap-4 w-full sm:w-auto">
//                 <button
//                   onClick={onClose}
//                   className="hover:bg-white/20 rounded-lg p-2 transition-colors flex-shrink-0"
//                   aria-label="Close"
//                 >
//                   <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6" />
//                 </button>
//                 <div className="flex-1 min-w-0">
//                   <div className="flex items-center gap-2 sm:gap-3 mb-2">
//                     <Store className="w-6 h-6 sm:w-8 sm:h-8 flex-shrink-0" />
//                     <h2 className="text-lg sm:text-2xl font-bold truncate">
//                       {overview?.businessName || sellerName}
//                     </h2>
//                   </div>
//                   <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-purple-100">
//                     <span className="truncate">📧 {overview?.email || 'N/A'}</span>
//                     <span className="truncate">📱 {overview?.phone || 'N/A'}</span>
//                     <span className={`px-2 py-1 rounded-full text-xs font-medium flex-shrink-0 ${
//                       overview?.accountStatus === 'active' 
//                         ? 'bg-green-500 text-white' 
//                         : 'bg-red-500 text-white'
//                     }`}>
//                       {overview?.accountStatus === 'active' ? '🟢 Active' : '🔴 Inactive'}
//                     </span>
//                   </div>
//                 </div>
//               </div>
              
//               {/* Right: Action Buttons */}
//               <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
//                 <button
//                   onClick={() => setAutoRefresh(!autoRefresh)}
//                   className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
//                     autoRefresh 
//                       ? 'bg-green-500 hover:bg-green-600' 
//                       : 'bg-white/20 hover:bg-white/30'
//                   }`}
//                   title={autoRefresh ? 'Auto-refresh enabled' : 'Auto-refresh disabled'}
//                 >
//                   <Zap className={`w-4 h-4 ${autoRefresh ? 'animate-pulse' : ''}`} />
//                   <span className="hidden sm:inline">Auto</span>
//                 </button>
                
//                 <button
//                   onClick={() => loadAnalytics(true)}
//                   disabled={loadingState.isRefreshing}
//                   className="flex items-center gap-2 px-3 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm disabled:opacity-50 transition-colors"
//                   title="Refresh data"
//                 >
//                   <RefreshCw className={`w-4 h-4 ${loadingState.isRefreshing ? 'animate-spin' : ''}`} />
//                   <span className="hidden sm:inline">Refresh</span>
//                 </button>
                
//                 <button
//                   onClick={() => setShowFilters(!showFilters)}
//                   className="flex items-center gap-2 px-3 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm transition-colors"
//                   title="Toggle filters"
//                 >
//                   <Filter className="w-4 h-4" />
//                   <span className="hidden sm:inline">Filter</span>
//                 </button>
                
//                 <div className="relative group">
//                   <button
//                     className="flex items-center gap-2 px-3 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm transition-colors"
//                     disabled={loadingState.isExporting}
//                     title="Export data"
//                   >
//                     <Download className={`w-4 h-4 ${loadingState.isExporting ? 'animate-bounce' : ''}`} />
//                     <span className="hidden sm:inline">Export</span>
//                   </button>
//                   <div className="hidden group-hover:block absolute right-0 mt-2 bg-white rounded-lg shadow-lg py-2 min-w-[120px] z-10">
//                     <button
//                       onClick={() => handleExport('csv')}
//                       className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 text-sm transition-colors"
//                       disabled={loadingState.isExporting}
//                     >
//                       📊 Export CSV
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Filters Panel */}
//             {showFilters && (
//               <div className="mt-4 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
//                 <div className="flex items-center justify-between mb-3">
//                   <h4 className="font-semibold flex items-center gap-2">
//                     <Calendar className="w-4 h-4" />
//                     Date Range
//                   </h4>
//                   <button 
//                     onClick={() => setShowFilters(false)} 
//                     className="hover:bg-white/20 rounded p-1 transition-colors"
//                   >
//                     <X className="w-4 h-4" />
//                   </button>
//                 </div>
//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//                   <div>
//                     <label className="block text-xs mb-1">From</label>
//                     <input
//                       type="date"
//                       value={dateRange.start.toISOString().split('T')[0]}
//                       onChange={(e) => setDateRange(prev => ({ 
//                         ...prev, 
//                         start: new Date(e.target.value) 
//                       }))}
//                       className="w-full px-3 py-2 rounded-lg bg-white/20 text-white border border-white/30 text-sm placeholder-white/50"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-xs mb-1">To</label>
//                     <input
//                       type="date"
//                       value={dateRange.end.toISOString().split('T')[0]}
//                       onChange={(e) => setDateRange(prev => ({ 
//                         ...prev, 
//                         end: new Date(e.target.value) 
//                       }))}
//                       className="w-full px-3 py-2 rounded-lg bg-white/20 text-white border border-white/30 text-sm placeholder-white/50"
//                     />
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* ===== TABS ===== */}
//           <div className="border-b bg-gray-50 px-4 sm:px-6">
//             <div className="flex gap-2 sm:gap-4 overflow-x-auto scrollbar-hide">
//               <button
//                 onClick={() => setActiveTab('overview')}
//                 className={`px-4 py-3 font-medium text-sm border-b-2 transition-colors whitespace-nowrap ${
//                   activeTab === 'overview' 
//                     ? 'border-purple-600 text-purple-600' 
//                     : 'border-transparent text-gray-600 hover:text-gray-800'
//                 }`}
//               >
//                 <BarChart3 className="w-4 h-4 inline mr-2" />
//                 Overview
//               </button>
//               <button
//                 onClick={() => setActiveTab('qr-tracking')}
//                 className={`px-4 py-3 font-medium text-sm border-b-2 transition-colors whitespace-nowrap ${
//                   activeTab === 'qr-tracking' 
//                     ? 'border-purple-600 text-purple-600' 
//                     : 'border-transparent text-gray-600 hover:text-gray-800'
//                 }`}
//               >
//                 <QrCode className="w-4 h-4 inline mr-2" />
//                 QR Tracking
//               </button>
              
//               {/* ✅ NEW TAB */}
//               <button
//                 onClick={() => setActiveTab('tiles-inventory')}
//                 className={`px-4 py-3 font-medium text-sm border-b-2 transition-colors whitespace-nowrap ${
//                   activeTab === 'tiles-inventory' 
//                     ? 'border-purple-600 text-purple-600' 
//                     : 'border-transparent text-gray-600 hover:text-gray-800'
//                 }`}
//               >
//                 <Package className="w-4 h-4 inline mr-2" />
//                 Tiles Inventory ({allTiles.length})
//               </button>
              
//               <button
//                 onClick={() => setActiveTab('engagement')}
//                 className={`px-4 py-3 font-medium text-sm border-b-2 transition-colors whitespace-nowrap ${
//                   activeTab === 'engagement' 
//                     ? 'border-purple-600 text-purple-600' 
//                     : 'border-transparent text-gray-600 hover:text-gray-800'
//                 }`}
//               >
//                 <Activity className="w-4 h-4 inline mr-2" />
//                 Engagement
//               </button>
//             </div>
//           </div>

//           {/* ===== TAB CONTENT ===== */}
//           <div className="overflow-auto max-h-[calc(100vh-300px)]">
            
//             {/* ===== OVERVIEW TAB ===== */}
//             {activeTab === 'overview' && (
//               <div className="p-4 sm:p-6 space-y-6">
                
//                 {/* Stats Cards */}
//                 <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
//                   <div className="bg-white rounded-lg p-3 sm:p-4 border-l-4 border-purple-500 shadow hover:shadow-md transition-shadow">
//                     <div className="flex items-center justify-between mb-2">
//                       <div>
//                         <p className="text-xs sm:text-sm font-medium text-gray-600">Total Tiles</p>
//                         <p className="text-2xl sm:text-3xl font-bold text-purple-600 mt-1">
//                           {formatNumber(overview?.totalTiles || 0)}
//                         </p>
//                       </div>
//                       <Package className="w-8 h-8 sm:w-10 sm:h-10 text-purple-400" />
//                     </div>
//                     <p className="text-xs text-gray-500">Uploaded products</p>
//                   </div>

//                   <div className="bg-white rounded-lg p-3 sm:p-4 border-l-4 border-blue-500 shadow hover:shadow-md transition-shadow">
//                     <div className="flex items-center justify-between mb-2">
//                       <div>
//                         <p className="text-xs sm:text-sm font-medium text-gray-600">Total Views</p>
//                         <p className="text-2xl sm:text-3xl font-bold text-blue-600 mt-1">
//                           {formatNumber(overview?.totalViews || 0)}
//                         </p>
//                       </div>
//                       <Eye className="w-8 h-8 sm:w-10 sm:h-10 text-blue-400" />
//                     </div>
//                     <p className="text-xs text-gray-500">Customer views</p>
//                   </div>

//                   <div className="bg-white rounded-lg p-3 sm:p-4 border-l-4 border-green-500 shadow hover:shadow-md transition-shadow">
//                     <div className="flex items-center justify-between mb-2">
//                       <div>
//                         <p className="text-xs sm:text-sm font-medium text-gray-600">Applications</p>
//                         <p className="text-2xl sm:text-3xl font-bold text-green-600 mt-1">
//                           {formatNumber(overview?.totalApplies || 0)}
//                         </p>
//                       </div>
//                       <Layers className="w-8 h-8 sm:w-10 sm:h-10 text-green-400" />
//                     </div>
//                     <p className="text-xs text-gray-500">Room visualizations</p>
//                   </div>

//                   <div className="bg-white rounded-lg p-3 sm:p-4 border-l-4 border-orange-500 shadow hover:shadow-md transition-shadow">
//                     <div className="flex items-center justify-between mb-2">
//                       <div>
//                         <p className="text-xs sm:text-sm font-medium text-gray-600">QR Scans</p>
//                         <p className="text-2xl sm:text-3xl font-bold text-orange-600 mt-1">
//                           {formatNumber(overview?.totalQRScans || 0)}
//                         </p>
//                       </div>
//                       <QrCode className="w-8 h-8 sm:w-10 sm:h-10 text-orange-400" />
//                     </div>
//                     <p className="text-xs text-gray-500">Mobile scans</p>
//                   </div>
//                 </div>

//                 {/* Daily Activity Table */}
//                 <div className="bg-white rounded-lg shadow overflow-hidden">
//                   <div className="p-4 border-b bg-gray-50">
//                     <h3 className="font-semibold text-gray-800 flex items-center gap-2">
//                       <Activity className="w-5 h-5 text-purple-600" />
//                       Daily Activity (Last 7 Days)
//                     </h3>
//                   </div>
//                   <div className="overflow-x-auto">
//                     <table className="w-full text-sm">
//                       <thead className="bg-gray-50 border-b">
//                         <tr>
//                           <th className="text-left p-3 font-semibold text-gray-700">Date</th>
//                           <th className="text-left p-3 font-semibold text-gray-700 hidden sm:table-cell">Day</th>
//                           <th className="text-right p-3 font-semibold text-gray-700">Views</th>
//                           <th className="text-right p-3 font-semibold text-gray-700 hidden md:table-cell">Apps</th>
//                           <th className="text-right p-3 font-semibold text-gray-700">Actions</th>
//                         </tr>
//                       </thead>
//                       <tbody>
//                         {dailyActivity.length > 0 ? (
//                           dailyActivity.map((day, i) => (
//                             <tr key={i} className="border-t hover:bg-gray-50 transition-colors">
//                               <td className="p-3 text-gray-700 font-medium">
//                                 {new Date(day.date).toLocaleDateString('en-US', { 
//                                   month: 'short', 
//                                   day: 'numeric' 
//                                 })}
//                               </td>
//                               <td className="p-3 text-gray-600 hidden sm:table-cell">{day.dayName}</td>
//                               <td className="p-3 text-right text-blue-600 font-medium">{day.views}</td>
//                               <td className="p-3 text-right text-green-600 font-medium hidden md:table-cell">{day.applies}</td>
//                               <td className="p-3 text-right text-purple-600 font-semibold">{day.actions}</td>
//                             </tr>
//                           ))
//                         ) : (
//                           <tr>
//                             <td colSpan={5} className="p-8 text-center text-gray-500">
//                               <AlertCircle className="w-8 h-8 mx-auto mb-2 text-gray-400" />
//                               No activity data available
//                             </td>
//                           </tr>
//                         )}
//                       </tbody>
//                       {dailyActivityTotals && (
//                         <tfoot className="bg-gray-50 font-semibold border-t-2">
//                           <tr>
//                             <td colSpan={2} className="p-3 text-gray-800">Total</td>
//                             <td className="p-3 text-right text-blue-700">{dailyActivityTotals.totalViews}</td>
//                             <td className="p-3 text-right text-green-700 hidden md:table-cell">{dailyActivityTotals.totalApplies}</td>
//                             <td className="p-3 text-right text-purple-700">{dailyActivityTotals.totalActions}</td>
//                           </tr>
//                         </tfoot>
//                       )}
//                     </table>
//                   </div>
//                 </div>

//                 {/* Top Tiles Grid */}
//                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  
//                   {/* Top Viewed Tiles */}
//                   <div className="bg-white rounded-lg shadow overflow-hidden">
//                     <div className="p-4 border-b bg-gradient-to-r from-blue-50 to-blue-100">
//                       <h3 className="font-semibold text-gray-800 flex items-center gap-2">
//                         <TrendingUp className="w-5 h-5 text-blue-600" />
//                         Top 5 Viewed Tiles
//                       </h3>
//                     </div>
//                     <div className="divide-y">
//                       {topViewedTiles.length > 0 ? (
//                         topViewedTiles.map((tile, i) => (
//                           <div key={tile.id} className="p-3 hover:bg-blue-50 transition-colors flex items-center gap-3">
//                             <span className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
//                               i === 0 ? 'bg-yellow-400 text-yellow-900' :
//                               i === 1 ? 'bg-gray-300 text-gray-800' :
//                               i === 2 ? 'bg-orange-300 text-orange-900' :
//                               'bg-gray-100 text-gray-600'
//                             }`}>
//                               {i + 1}
//                             </span>
//                             {tile.imageUrl && (
//                               <img 
//                                 src={tile.imageUrl} 
//                                 alt={tile.name} 
//                                 className="w-12 h-12 object-cover rounded shadow-sm" 
//                                 onError={(e) => {
//                                   e.currentTarget.src = 'https://via.placeholder.com/48?text=No+Image';
//                                 }}
//                               />
//                             )}
//                             <div className="flex-1 min-w-0">
//                               <p className="font-medium text-gray-800 truncate">{tile.name}</p>
//                               <p className="text-xs text-gray-500">
//                                 {tile.category} • {tile.size} • ₹{formatNumber(tile.price)}
//                               </p>
//                             </div>
//                             <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold whitespace-nowrap">
//                               👁️ {tile.viewCount}
//                             </span>
//                           </div>
//                         ))
//                       ) : (
//                         <div className="p-8 text-center text-gray-500">
//                           <Eye className="w-12 h-12 mx-auto mb-2 text-gray-300" />
//                           <p>No view data available</p>
//                         </div>
//                       )}
//                     </div>
//                   </div>

//                   {/* Top QR Scanned Tiles */}
//                   <div className="bg-white rounded-lg shadow overflow-hidden">
//                     <div className="p-4 border-b bg-gradient-to-r from-orange-50 to-orange-100">
//                       <h3 className="font-semibold text-gray-800 flex items-center gap-2">
//                         <QrCode className="w-5 h-5 text-orange-600" />
//                         Top 5 Scanned QR
//                       </h3>
//                     </div>
//                     <div className="divide-y">
//                       {topQRTiles.length > 0 ? (
//                         topQRTiles.map((tile, i) => (
//                           <div key={tile.id} className="p-3 hover:bg-orange-50 transition-colors flex items-center gap-3">
//                             <span className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
//                               i === 0 ? 'bg-yellow-400 text-yellow-900' :
//                               i === 1 ? 'bg-gray-300 text-gray-800' :
//                               i === 2 ? 'bg-orange-300 text-orange-900' :
//                               'bg-gray-100 text-gray-600'
//                             }`}>
//                               {i + 1}
//                             </span>
//                             {tile.imageUrl && (
//                               <img 
//                                 src={tile.imageUrl} 
//                                 alt={tile.name} 
//                                 className="w-12 h-12 object-cover rounded shadow-sm"
//                                 onError={(e) => {
//                                   e.currentTarget.src = 'https://via.placeholder.com/48?text=No+Image';
//                                 }}
//                               />
//                             )}
//                             <div className="flex-1 min-w-0">
//                               <p className="font-medium text-gray-800 truncate">{tile.name}</p>
//                               <p className="text-xs text-gray-500">
//                                 {tile.category} • {tile.size} • ₹{formatNumber(tile.price)}
//                               </p>
//                             </div>
//                             <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded-full text-xs font-semibold whitespace-nowrap">
//                               📱 {tile.scanCount}
//                             </span>
//                           </div>
//                         ))
//                       ) : (
//                         <div className="p-8 text-center text-gray-500">
//                           <QrCode className="w-12 h-12 mx-auto mb-2 text-gray-300" />
//                           <p>No QR scan data available</p>
//                         </div>
//                       )}
//                     </div>
//                   </div>

//                 </div>

//               </div>
//             )}

//             {/* ===== QR TRACKING TAB ===== */}
//             {activeTab === 'qr-tracking' && (
//               <div className="p-4 sm:p-6 space-y-6">
                
//                 {/* QR Stats Cards */}
//                 <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
//                   <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200 shadow hover:shadow-md transition-shadow">
//                     <div className="flex items-center justify-between mb-2">
//                       <div>
//                         <p className="text-xs font-medium text-gray-600">Total Generated</p>
//                         <p className="text-3xl font-bold text-purple-700 mt-1">
//                           {qrStats?.totalGenerated || 0}
//                         </p>
//                       </div>
//                       <CheckCircle className="w-10 h-10 text-purple-500" />
//                     </div>
//                     <p className="text-xs text-gray-600">QR codes created</p>
//                   </div>

//                   <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200 shadow hover:shadow-md transition-shadow">
//                     <div className="flex items-center justify-between mb-2">
//                       <div>
//                         <p className="text-xs font-medium text-gray-600">Active Codes</p>
//                         <p className="text-3xl font-bold text-green-700 mt-1">
//                           {qrStats?.totalActive || 0}
//                         </p>
//                       </div>
//                       <Activity className="w-10 h-10 text-green-500" />
//                     </div>
//                     <p className="text-xs text-gray-600">Currently working</p>
//                   </div>

//                   <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200 shadow hover:shadow-md transition-shadow">
//                     <div className="flex items-center justify-between mb-2">
//                       <div>
//                         <p className="text-xs font-medium text-gray-600">Coverage</p>
//                         <p className="text-3xl font-bold text-blue-700 mt-1">
//                           {qrStats?.generationRate || 0}%
//                         </p>
//                       </div>
//                       <TrendingUp className="w-10 h-10 text-blue-500" />
//                     </div>
//                     <p className="text-xs text-gray-600">Tiles with QR</p>
//                   </div>

//                   <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4 border border-orange-200 shadow hover:shadow-md transition-shadow">
//                     <div className="flex items-center justify-between mb-2">
//                       <div>
//                         <p className="text-xs font-medium text-gray-600">Last Generated</p>
//                         <p className="text-sm font-semibold text-orange-700 mt-1">
//                           {qrStats?.lastGeneration 
//                             ? new Date(qrStats.lastGeneration).toLocaleDateString('en-US', { 
//                                 month: 'short', 
//                                 day: 'numeric' 
//                               })
//                             : 'Never'
//                           }
//                         </p>
//                       </div>
//                       <Clock className="w-10 h-10 text-orange-500" />
//                     </div>
//                     <p className="text-xs text-gray-600">Most recent</p>
//                   </div>
//                 </div>

//                 {/* QR History Table */}
//                 <div className="bg-white rounded-lg shadow overflow-hidden">
//                   <div className="p-4 border-b bg-gray-50">
//                     <h3 className="font-semibold text-gray-800 flex items-center gap-2">
//                       <FileText className="w-5 h-5 text-purple-600" />
//                       QR Generation History (Last 10)
//                     </h3>
//                   </div>
//                   <div className="overflow-x-auto">
//                     <table className="w-full text-sm">
//                       <thead className="bg-gray-50 border-b">
//                         <tr>
//                           <th className="text-left p-3 font-semibold text-gray-700">Tile Name</th>
//                           <th className="text-left p-3 font-semibold text-gray-700 hidden md:table-cell">Generated At</th>
//                           <th className="text-center p-3 font-semibold text-gray-700">Status</th>
//                           <th className="text-center p-3 font-semibold text-gray-700 hidden sm:table-cell">QR Code</th>
//                         </tr>
//                       </thead>
//                       <tbody>
//                         {qrGenerationHistory.length > 0 ? (
//                           qrGenerationHistory.map((gen) => (
//                             <tr key={gen.id} className="border-t hover:bg-gray-50 transition-colors">
//                               <td className="p-3">
//                                 <div className="flex items-center gap-2">
//                                   {gen.tileImage && (
//                                     <img 
//                                       src={gen.tileImage} 
//                                       alt={gen.tileName}
//                                       className="w-8 h-8 rounded object-cover"
//                                       onError={(e) => {
//                                         e.currentTarget.style.display = 'none';
//                                       }}
//                                     />
//                                   )}
//                                   <span className="font-medium text-gray-800 truncate">
//                                     {gen.tileName}
//                                   </span>
//                                 </div>
//                               </td>
//                               <td className="p-3 text-gray-600 text-xs hidden md:table-cell">
//                                 {formatDateTime(gen.generatedAt)}
//                               </td>
//                               <td className="p-3 text-center">
//                                 <span className={`px-2 py-1 rounded-full text-xs font-medium ${
//                                   gen.isActive 
//                                     ? 'bg-green-100 text-green-800' 
//                                     : 'bg-red-100 text-red-800'
//                                 }`}>
//                                   {gen.isActive ? '✓ Active' : '✗ Inactive'}
//                                 </span>
//                               </td>
//                               <td className="p-3 text-center hidden sm:table-cell">
//                                 {gen.qrCodeUrl && (
//                                   <button
//                                     onClick={() => window.open(gen.qrCodeUrl, '_blank')}
//                                     className="text-purple-600 hover:text-purple-800 text-xs font-medium"
//                                   >
//                                     View QR
//                                   </button>
//                                 )}
//                               </td>
//                             </tr>
//                           ))
//                         ) : (
//                           <tr>
//                             <td colSpan={4} className="p-8 text-center text-gray-500">
//                               <QrCode className="w-12 h-12 mx-auto mb-2 text-gray-300" />
//                               <p>No QR generation history available</p>
//                             </td>
//                           </tr>
//                         )}
//                       </tbody>
//                     </table>
//                   </div>
//                 </div>

//                 {/* Device & Location Stats */}
//                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  
//                   {/* Scans by Device */}
//                   <div className="bg-white rounded-lg shadow p-4">
//                     <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
//                       <Smartphone className="w-5 h-5 text-blue-600" />
//                       Scans by Device
//                     </h3>
//                     {scansByDevice.length > 0 ? (
//                       <div className="space-y-3">
//                         {scansByDevice.map((device, i) => {
//                           const percentage = formatPercentage(device.count, overview?.totalQRScans || 0);
//                           return (
//                             <div key={i} className="flex items-center gap-3">
//                               <div className="w-12 flex-shrink-0">
//                                 {device.type === 'mobile' ? (
//                                   <Smartphone className="w-6 h-6 text-blue-600" />
//                                 ) : device.type === 'tablet' ? (
//                                   <Monitor className="w-6 h-6 text-purple-600" />
//                                 ) : (
//                                   <Monitor className="w-6 h-6 text-gray-600" />
//                                 )}
//                               </div>
//                               <div className="flex-1">
//                                 <div className="flex justify-between mb-1">
//                                   <span className="text-sm font-medium capitalize">{device.type}</span>
//                                   <span className="text-sm text-gray-600">{device.count} ({percentage})</span>
//                                 </div>
//                                 <div className="w-full bg-gray-200 rounded-full h-2">
//                                   <div 
//                                     className={`h-full rounded-full ${
//                                       device.type === 'mobile' ? 'bg-blue-600' : 
//                                       device.type === 'tablet' ? 'bg-purple-600' : 
//                                       'bg-gray-600'
//                                     }`} 
//                                     style={{ width: percentage }} 
//                                   />
//                                 </div>
//                               </div>
//                             </div>
//                           );
//                         })}
//                       </div>
//                     ) : (
//                       <div className="p-8 text-center text-gray-500">
//                         <Smartphone className="w-12 h-12 mx-auto mb-2 text-gray-300" />
//                         <p>No device data available</p>
//                       </div>
//                     )}
//                   </div>

//                   {/* Scans by Location */}
//                   <div className="bg-white rounded-lg shadow p-4">
//                     <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
//                       <MapPin className="w-5 h-5 text-green-600" />
//                       Scans by Location
//                     </h3>
//                     {scansByLocation.length > 0 ? (
//                       <div className="space-y-3">
//                         {scansByLocation.slice(0, 5).map((location, i) => {
//                           const percentage = formatPercentage(location.count, overview?.totalQRScans || 0);
//                           return (
//                             <div key={i} className="flex items-center gap-3">
//                               <span className="text-2xl flex-shrink-0">{location.flag || '🌍'}</span>
//                               <div className="flex-1">
//                                 <div className="flex justify-between mb-1">
//                                   <span className="text-sm font-medium truncate">
//                                     {location.city}, {location.country}
//                                   </span>
//                                   <span className="text-sm text-gray-600 ml-2 whitespace-nowrap">
//                                     {location.count}
//                                   </span>
//                                 </div>
//                                 <div className="w-full bg-gray-200 rounded-full h-2">
//                                   <div 
//                                     className="h-full bg-green-600 rounded-full" 
//                                     style={{ width: percentage }} 
//                                   />
//                                 </div>
//                               </div>
//                             </div>
//                           );
//                         })}
//                       </div>
//                     ) : (
//                       <div className="p-8 text-center text-gray-500">
//                         <MapPin className="w-12 h-12 mx-auto mb-2 text-gray-300" />
//                         <p>No location data available</p>
//                       </div>
//                     )}
//                   </div>

//                 </div>

//               </div>
//             )}

//             {/* ✅✅✅ NEW TAB - TILES INVENTORY ✅✅✅ */}
//             {activeTab === 'tiles-inventory' && (
//               <div className="p-4 sm:p-6 space-y-6">
                
//                 {/* Header Section */}
//                 <div className="bg-white rounded-lg shadow p-4">
//                   <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
//                     <div>
//                       <h3 className="font-semibold text-gray-800 flex items-center gap-2 text-lg">
//                         <Package className="w-5 h-5 text-purple-600" />
//                         Complete Tiles Inventory
//                       </h3>
//                       <p className="text-sm text-gray-600 mt-1">
//                         Total {allTiles.length} tiles • Showing {filteredTiles.length} results
//                       </p>
//                     </div>
                         
//                               {/* ✅✅✅ NEW TAB - TOP SCANNED QR ✅✅✅ */}
// {/* <button
//   onClick={() => setActiveTab('top-scanned')}
//   className={`px-4 py-3 font-medium text-sm border-b-2 transition-colors whitespace-nowrap ${
//     activeTab === 'top-scanned' 
//       ? 'border-purple-600 text-purple-600' 
//       : 'border-transparent text-gray-600 hover:text-gray-800'
//   }`}
// >
//   <TrendingUp className="w-4 h-4 inline mr-2" />
//   Top Scanned QR ({topScannedTiles.length})
// </button> */}

// <button
//   onClick={() => setActiveTab('top-scanned')}
//   className={`px-4 py-3 font-medium text-sm border-b-2 transition-colors whitespace-nowrap ${
//     activeTab === 'top-scanned' ? 'border-purple-600 text-purple-600' : 'border-transparent text-gray-600 hover:text-gray-800'
//   }`}
// >
//   <TrendingUp className="w-4 h-4 inline mr-2" />
//   Top Scanned QR ({topScannedTiles.length})
// </button>

//                     {/* Export Button */}
//                     <button
//                       onClick={handleExportTiles}
//                       className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
//                     >
//                       <Download className="w-4 h-4" />
//                       Export CSV
//                     </button>
//                   </div>
                  
//                   {/* Filters */}
//                   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
//                     {/* Search */}
//                     <div className="relative">
//                       <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
//                       <input
//                         type="text"
//                         placeholder="Search tiles..."
//                         value={searchTerm}
//                         onChange={(e) => setSearchTerm(e.target.value)}
//                         className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
//                       />
//                     </div>
                    
//                     {/* Category Filter */}
//                     <select
//                       value={categoryFilter}
//                       onChange={(e) => setCategoryFilter(e.target.value as any)}
//                       className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
//                     >
//                       <option value="all">All Categories</option>
//                       <option value="wall">🧱 Wall Tiles</option>
//                       <option value="floor">🟫 Floor Tiles</option>
//                       <option value="both">🏗️ Both</option>
//                     </select>
                    
//                     {/* Status Filter */}
//                     <select
//                       value={statusFilter}
//                       onChange={(e) => setStatusFilter(e.target.value as any)}
//                       className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
//                     >
//                       <option value="all">All Status</option>
//                       <option value="active">🟢 Active</option>
//                       <option value="inactive">🔴 Inactive</option>
//                     </select>
                    
//                     {/* QR Filter */}
//                     <select
//                       value={qrFilter}
//                       onChange={(e) => setQrFilter(e.target.value as any)}
//                       className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
//                     >
//                       <option value="all">All Tiles</option>
//                       <option value="with">✅ With QR</option>
//                       <option value="without">❌ Without QR</option>
//                     </select>
//                   </div>
//                 </div>

//                 {/* Summary Cards */}
//                 {filteredTiles.length > 0 && (
//                   <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
//                     <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
//                       <p className="text-sm text-gray-600 mb-1">Total Value</p>
//                       <p className="text-2xl font-bold text-blue-700">
//                         ₹{formatNumber(inventoryStats.totalValue)}
//                       </p>
//                     </div>
                    
//                     <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
//                       <p className="text-sm text-gray-600 mb-1">Avg Price</p>
//                       <p className="text-2xl font-bold text-green-700">
//                         ₹{formatNumber(inventoryStats.avgPrice)}
//                       </p>
//                     </div>
                    
//                     <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
//                       <p className="text-sm text-gray-600 mb-1">With QR</p>
//                       <p className="text-2xl font-bold text-purple-700">
//                         {inventoryStats.withQR}
//                       </p>
//                     </div>
                    
//                     <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4 border border-orange-200">
//                       <p className="text-sm text-gray-600 mb-1">Total Stock</p>
//                       <p className="text-2xl font-bold text-orange-700">
//                         {formatNumber(inventoryStats.totalStock)}
//                       </p>
//                     </div>
//                   </div>
//                 )}

//                 {/* Tiles Table */}
//                 <div className="bg-white rounded-lg shadow overflow-hidden">
//                   <div className="overflow-x-auto">
//                     <table className="w-full text-sm">
//                       <thead className="bg-gradient-to-r from-purple-50 to-blue-50 border-b-2 border-purple-200">
//                         <tr>
//                           <th className="text-left p-3 font-semibold text-gray-800">Image</th>
//                           <th className="text-left p-3 font-semibold text-gray-800">Name</th>
//                           <th className="text-left p-3 font-semibold text-gray-800">Code</th>
//                           <th className="text-left p-3 font-semibold text-gray-800 hidden sm:table-cell">Category</th>
//                           <th className="text-left p-3 font-semibold text-gray-800">Size</th>
//                           <th className="text-right p-3 font-semibold text-gray-800">Price</th>
//                           {/* <th className="text-left p-3 font-semibold text-gray-800 hidden md:table-cell">Brand</th>
//                           <th className="text-left p-3 font-semibold text-gray-800 hidden md:table-cell">Color</th> */}
//                           <th className="text-center p-3 font-semibold text-gray-800 hidden lg:table-cell">Stock</th>
//                           {/* <th className="text-center p-3 font-semibold text-gray-800">QR</th>
//                           <th className="text-center p-3 font-semibold text-gray-800">Status</th> */}
//                         </tr>
//                       </thead>
//                       <tbody>
//                         {paginatedTiles.length > 0 ? (
//                           paginatedTiles.map((tile, index) => (
//                             <tr 
//                               key={tile.id} 
//                               className={`border-t hover:bg-purple-50 transition-colors ${
//                                 index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
//                               }`}
//                             >
//                               {/* Image */}
//                               <td className="p-3">
//                                 {tile.imageUrl ? (
//                                   <img
//                                     src={tile.imageUrl}
//                                     alt={tile.name}
//                                     className="w-12 h-12 object-cover rounded shadow-sm"
//                                     onError={(e) => {
//                                       e.currentTarget.src = 'https://via.placeholder.com/48?text=No+Img';
//                                     }}
//                                   />
//                                 ) : (
//                                   <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
//                                     <Package className="w-6 h-6 text-gray-400" />
//                                   </div>
//                                 )}
//                               </td>
                              
//                               {/* Name */}
//                               <td className="p-3">
//                                 <p className="font-medium text-gray-800 max-w-xs truncate">
//                                   {tile.name || 'Unnamed Tile'}
//                                 </p>
//                                 <p className="text-xs text-gray-500 mt-1 hidden lg:block">
//                                   {tile.material || 'N/A'} • {tile.finish || 'N/A'}
//                                 </p>
//                               </td>
                              
//                               {/* Code */}
//                               <td className="p-3">
//                                 <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-xs font-mono">
//                                   {tile.code || tile.product_code || 'N/A'}
//                                 </span>
//                               </td>
                              
//                               {/* Category */}
//                               <td className="p-3 hidden sm:table-cell">
//                                 <span className={`px-2 py-1 rounded-full text-xs font-medium ${
//                                   tile.category === 'wall' ? 'bg-blue-100 text-blue-800' :
//                                   tile.category === 'floor' ? 'bg-green-100 text-green-800' :
//                                   'bg-purple-100 text-purple-800'
//                                 }`}>
//                                   {tile.category === 'wall' ? '🧱 Wall' :
//                                    tile.category === 'floor' ? '🟫 Floor' :
//                                    '🏗️ Both'}
//                                 </span>
//                               </td>
                              
//                               {/* Size */}
//                               <td className="p-3 text-gray-700 font-medium">
//                                 {tile.size || 'N/A'}
//                               </td>
                              
//                               {/* Price */}
//                               <td className="p-3 text-right">
//                                 <span className="font-semibold text-green-700">
//                                   ₹{formatNumber(tile.price || 0)}
//                                 </span>
//                               </td>
                              
//                               {/* Brand */}
//                               {/* <td className="p-3 text-gray-600 hidden md:table-cell">
//                                 {tile.brand || 'N/A'}
//                               </td>
                              
//                               {/* Color */}
//                               {/* <td className="p-3 hidden md:table-cell">
//                                 <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
//                                   {tile.color || 'N/A'}
//                                 </span>
//                               </td>  */}
                              
//                               {/* Stock */}
//                               <td className="p-3 text-center hidden lg:table-cell">
//                                 <span className={`px-2 py-1 rounded-full text-xs font-medium ${
//                                   (tile.stock || 0) > 50 ? 'bg-green-100 text-green-800' :
//                                   (tile.stock || 0) > 10 ? 'bg-yellow-100 text-yellow-800' :
//                                   'bg-red-100 text-red-800'
//                                 }`}>
//                                   {tile.stock || 0}
//                                 </span>
//                               </td>
                              
//                               {/* QR */}
//                               {/* <td className="p-3 text-center">
//                                 {tile.qrCodeGenerated ? (
//                                   <span className="text-green-600 text-lg" title="QR Generated">✅</span>
//                                 ) : (
//                                   <span className="text-gray-400 text-lg" title="No QR">❌</span>
//                                 )}
//                               </td> */}
                              
//                               {/* Status */}
//                               {/* <td className="p-3 text-center">
//                                 <span className={`px-2 py-1 rounded-full text-xs font-medium ${
//                                   (tile.status || 'active') === 'active'
//                                     ? 'bg-green-100 text-green-800'
//                                     : 'bg-red-100 text-red-800'
//                                 }`}>
//                                   {(tile.status || 'active') === 'active' ? '🟢 Active' : '🔴 Inactive'}
//                                 </span>
//                               </td> */}
//                             </tr>
//                           ))
//                         ) : (
//                           <tr>
//                             <td colSpan={11} className="p-12 text-center">
//                               <Package className="w-16 h-16 mx-auto mb-3 text-gray-300" />
//                               <p className="text-gray-500 font-medium">
//                                 {searchTerm || categoryFilter !== 'all' || statusFilter !== 'all' || qrFilter !== 'all'
//                                   ? 'No tiles found matching your filters' 
//                                   : 'No tiles available'}
//                               </p>
//                               {(searchTerm || categoryFilter !== 'all' || statusFilter !== 'all' || qrFilter !== 'all') && (
//                                 <button
//                                   onClick={() => {
//                                     setSearchTerm('');
//                                     setCategoryFilter('all');
//                                     setStatusFilter('all');
//                                     setQrFilter('all');
//                                   }}
//                                   className="mt-3 text-purple-600 hover:text-purple-800 text-sm font-medium"
//                                 >
//                                   Clear all filters
//                                 </button>
//                               )}
//                             </td>
//                           </tr>
//                         )}
//                       </tbody>
//                     </table>
//                   </div>

//                   {/* Pagination */}
//                   {filteredTiles.length > 0 && (
//                     <div className="bg-gray-50 px-4 py-3 border-t flex flex-col sm:flex-row items-center justify-between gap-3">
//                       {/* Items per page */}
//                       <div className="flex items-center gap-2">
//                         <span className="text-sm text-gray-600">Show:</span>
//                         <select
//                           value={itemsPerPage}
//                           onChange={(e) => {
//                             setItemsPerPage(Number(e.target.value));
//                             setCurrentPage(1);
//                           }}
//                           className="px-3 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-purple-500"
//                         >
//                           <option value={10}>10</option>
//                           <option value={20}>20</option>
//                           <option value={50}>50</option>
//                           <option value={100}>100</option>
//                         </select>
//                         <span className="text-sm text-gray-600">per page</span>
//                       </div>
                      
//                       {/* Page info */}
//                       <div className="text-sm text-gray-600">
//                         Showing {((currentPage - 1) * itemsPerPage) + 1} to{' '}
//                         {Math.min(currentPage * itemsPerPage, filteredTiles.length)} of{' '}
//                         {filteredTiles.length} tiles
//                       </div>
                      
//                       {/* Page buttons */}
//                       <div className="flex items-center gap-2">
//                         <button
//                           onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
//                           disabled={currentPage === 1}
//                           className="px-3 py-1 border border-gray-300 rounded text-sm font-medium hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
//                         >
//                           <ChevronLeft className="w-4 h-4" />
//                           Prev
//                         </button>
                        
//                         {/* Page numbers */}
//                         <div className="flex gap-1">
//                           {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
//                             let pageNum;
//                             if (totalPages <= 5) {
//                               pageNum = i + 1;
//                             } else if (currentPage <= 3) {
//                               pageNum = i + 1;
//                             } else if (currentPage >= totalPages - 2) {
//                               pageNum = totalPages - 4 + i;
//                             } else {
//                               pageNum = currentPage - 2 + i;
//                             }
                            
//                             return (
//                               <button
//                                 key={pageNum}
//                                 onClick={() => setCurrentPage(pageNum)}
//                                 className={`px-3 py-1 border rounded text-sm font-medium transition-colors ${
//                                   currentPage === pageNum
//                                     ? 'bg-purple-600 text-white border-purple-600'
//                                     : 'border-gray-300 hover:bg-gray-100'
//                                 }`}
//                               >
//                                 {pageNum}
//                               </button>
//                             );
//                           })}
//                         </div>
                        
//                         <button
//                           onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
//                           disabled={currentPage === totalPages}
//                           className="px-3 py-1 border border-gray-300 rounded text-sm font-medium hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
//                         >
//                           Next
//                           <ChevronRight className="w-4 h-4" />
//                         </button>
//                       </div>
//                     </div>
//                   )}
//                 </div>

//               </div>
//             )}
// {/* ✅✅✅ NEW TAB CONTENT - TOP SCANNED QR ✅✅✅ */}
// {activeTab === 'top-scanned' && (
//   <div className="p-4 sm:p-6 space-y-6">
    
//     {/* Header */}
//     <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-lg p-6 border border-orange-200">
//       <div className="flex items-center justify-between mb-4">
//         <div>
//           <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
//             <TrendingUp className="w-7 h-7 text-orange-600" />
//             Top 10 Most Scanned QR Codes
//           </h3>
//           <p className="text-gray-600 mt-2">
//             Most popular tiles based on customer QR code scans
//           </p>
//         </div>
        
//         {/* Export Button */}
//         <button
//           onClick={() => {
//             try {
//               const csv = [
//                 ['Rank', 'Tile Name', 'Code', 'Category', 'Size', 'Price', 'Total Scans'].join(','),
//                 ...topScannedTiles.map((t, i) => [
//                   i + 1,
//                   `"${t.name}"`,
//                   t.code || 'N/A',
//                   t.category,
//                   t.size,
//                   t.price,
//                   t.scanCount
//                 ].join(','))
//               ].join('\n');
              
//               const blob = new Blob([csv], { type: 'text/csv' });
//               const url = window.URL.createObjectURL(blob);
//               const a = document.createElement('a');
//               a.href = url;
//               a.download = `top-scanned-qr-${sellerId}-${Date.now()}.csv`;
//               a.click();
//               window.URL.revokeObjectURL(url);
//               alert('✅ Top scanned data exported!');
//             } catch (error) {
//               alert('❌ Export failed');
//             }
//           }}
//           className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm font-medium shadow-md"
//         >
//           <Download className="w-4 h-4" />
//           Export CSV
//         </button>
//       </div>
      
//       {/* Summary Stats */}
//       {topScannedTiles.length > 0 && (
//         <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
//           <div className="bg-white rounded-lg p-4 shadow-sm">
//             <p className="text-sm text-gray-600 mb-1">Total QR Scans</p>
//             <p className="text-2xl font-bold text-orange-700">
//               {formatNumber(topScannedTiles.reduce((sum, t) => sum + t.scanCount, 0))}
//             </p>
//           </div>
//           <div className="bg-white rounded-lg p-4 shadow-sm">
//             <p className="text-sm text-gray-600 mb-1">Avg Scans per Tile</p>
//             <p className="text-2xl font-bold text-orange-700">
//               {Math.round(topScannedTiles.reduce((sum, t) => sum + t.scanCount, 0) / topScannedTiles.length)}
//             </p>
//           </div>
//           <div className="bg-white rounded-lg p-4 shadow-sm">
//             <p className="text-sm text-gray-600 mb-1">Top Tile Scans</p>
//             <p className="text-2xl font-bold text-orange-700">
//               {topScannedTiles[0]?.scanCount || 0}
//             </p>
//           </div>
//         </div>
//       )}
//     </div>

//     {/* Top Scanned Table */}
//     <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
//       <div className="overflow-x-auto">
//         <table className="w-full text-sm">
//           <thead className="bg-gradient-to-r from-orange-100 via-red-50 to-orange-100 border-b-2 border-orange-300">
//             <tr>
//               <th className="text-center p-4 font-bold text-gray-800 w-20">Rank</th>
//               <th className="text-left p-4 font-bold text-gray-800">Image</th>
//               <th className="text-left p-4 font-bold text-gray-800">Tile Name</th>
//               <th className="text-left p-4 font-bold text-gray-800">Code</th>
//               <th className="text-left p-4 font-bold text-gray-800 hidden sm:table-cell">Category</th>
//               <th className="text-left p-4 font-bold text-gray-800 hidden md:table-cell">Size</th>
//               <th className="text-right p-4 font-bold text-gray-800">Price</th>
//               <th className="text-right p-4 font-bold text-gray-800">Total Scans</th>
//               <th className="text-center p-4 font-bold text-gray-800 hidden lg:table-cell">Popularity</th>
//             </tr>
//           </thead>
//           <tbody>
//             {topScannedTiles.length > 0 ? (
//               topScannedTiles.map((tile, index) => {
//                 const isTop3 = index < 3;
//                 const maxScans = topScannedTiles[0]?.scanCount || 1;
//                 const popularityPercent = Math.round((tile.scanCount / maxScans) * 100);
                
//                 return (
//                   <tr 
//                     key={tile.id} 
//                     className={`border-t transition-all duration-200 ${
//                       isTop3 
//                         ? 'bg-gradient-to-r from-orange-50 to-yellow-50 hover:from-orange-100 hover:to-yellow-100' 
//                         : index % 2 === 0 
//                         ? 'bg-white hover:bg-gray-50' 
//                         : 'bg-gray-50 hover:bg-gray-100'
//                     }`}
//                   >
//                     {/* Rank */}
//                     <td className="p-4 text-center">
//                       <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full font-bold text-lg ${
//                         index === 0 ? 'bg-gradient-to-br from-yellow-400 to-yellow-600 text-yellow-900 shadow-lg' :
//                         index === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-500 text-gray-800 shadow-md' :
//                         index === 2 ? 'bg-gradient-to-br from-orange-400 to-orange-600 text-orange-900 shadow-md' :
//                         'bg-gray-200 text-gray-700'
//                       }`}>
//                         {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : index + 1}
//                       </div>
//                     </td>
                    
//                     {/* Image */}
//                     <td className="p-4">
//                       {tile.imageUrl ? (
//                         <img
//                           src={tile.imageUrl}
//                           alt={tile.name}
//                           className={`w-16 h-16 object-cover rounded-lg shadow-md ${
//                             isTop3 ? 'ring-2 ring-orange-400' : ''
//                           }`}
//                           onError={(e) => {
//                             e.currentTarget.src = 'https://via.placeholder.com/64?text=Tile';
//                           }}
//                         />
//                       ) : (
//                         <div className="w-16 h-16 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg flex items-center justify-center">
//                           <Package className="w-8 h-8 text-gray-500" />
//                         </div>
//                       )}
//                     </td>
                    
//                     {/* Tile Name */}
//                     <td className="p-4">
//                       <p className={`font-semibold max-w-xs truncate ${
//                         isTop3 ? 'text-orange-900 text-base' : 'text-gray-800'
//                       }`}>
//                         {tile.name}
//                       </p>
//                       {isTop3 && (
//                         <span className="inline-block mt-1 px-2 py-0.5 bg-orange-200 text-orange-800 text-xs rounded-full font-medium">
//                           ⭐ Top {index + 1}
//                         </span>
//                       )}
//                     </td>
                    
//                     {/* Code */}
//                     <td className="p-4">
//                       <span className={`px-3 py-1 rounded-lg text-xs font-mono font-semibold ${
//                         isTop3 
//                           ? 'bg-orange-200 text-orange-900' 
//                           : 'bg-gray-100 text-gray-800'
//                       }`}>
//                         {tile.code || tile.product_code || 'N/A'}
//                       </span>
//                     </td>
                    
//                     {/* Category */}
//                     <td className="p-4 hidden sm:table-cell">
//                       <span className={`px-3 py-1 rounded-full text-xs font-medium ${
//                         tile.category === 'wall' ? 'bg-blue-100 text-blue-800' :
//                         tile.category === 'floor' ? 'bg-green-100 text-green-800' :
//                         'bg-purple-100 text-purple-800'
//                       }`}>
//                         {tile.category === 'wall' ? '🧱 Wall' :
//                          tile.category === 'floor' ? '🟫 Floor' :
//                          '🏗️ Both'}
//                       </span>
//                     </td>
                    
//                     {/* Size */}
//                     <td className="p-4 text-gray-700 font-medium hidden md:table-cell">
//                       {tile.size || 'N/A'}
//                     </td>
                    
//                     {/* Price */}
//                     <td className="p-4 text-right">
//                       <span className={`font-bold ${
//                         isTop3 ? 'text-green-700 text-base' : 'text-green-600'
//                       }`}>
//                         ₹{formatNumber(tile.price || 0)}
//                       </span>
//                     </td>
                    
//                     {/* Total Scans */}
//                     <td className="p-4 text-right">
//                       <div className="flex items-center justify-end gap-2">
//                         <QrCode className={`w-5 h-5 ${
//                           isTop3 ? 'text-orange-600' : 'text-gray-500'
//                         }`} />
//                         <span className={`font-bold text-lg ${
//                           isTop3 ? 'text-orange-700' : 'text-gray-800'
//                         }`}>
//                           {formatNumber(tile.scanCount)}
//                         </span>
//                       </div>
//                       <p className="text-xs text-gray-500 mt-1">
//                         {tile.scanCount === 1 ? 'scan' : 'scans'}
//                       </p>
//                     </td>
                    
//                     {/* Popularity Bar */}
//                     <td className="p-4 hidden lg:table-cell">
//                       <div className="w-full">
//                         <div className="flex items-center justify-between mb-1">
//                           <span className="text-xs font-medium text-gray-600">
//                             {popularityPercent}%
//                           </span>
//                         </div>
//                         <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
//                           <div 
//                             className={`h-full rounded-full transition-all duration-500 ${
//                               isTop3 
//                                 ? 'bg-gradient-to-r from-orange-500 to-red-500' 
//                                 : 'bg-gradient-to-r from-blue-400 to-blue-600'
//                             }`}
//                             style={{ width: `${popularityPercent}%` }}
//                           />
//                         </div>
//                       </div>
//                     </td>
//                   </tr>
//                 );
//               })
//             ) : (
//               <tr>
//                 <td colSpan={9} className="p-12 text-center">
//                   <div className="flex flex-col items-center justify-center">
//                     <QrCode className="w-20 h-20 text-gray-300 mb-4" />
//                     <p className="text-gray-500 font-medium text-lg mb-2">
//                       No QR scan data available yet
//                     </p>
//                     <p className="text-gray-400 text-sm max-w-md">
//                       QR scans will appear here once customers start scanning your tile QR codes.
//                       Make sure QR codes are generated and displayed on your tiles.
//                     </p>
//                   </div>
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>

//     {/* Additional Info */}
//     {topScannedTiles.length > 0 && (
//       <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
//         <div className="flex items-start gap-3">
//           <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
//           <div>
//             <h4 className="font-semibold text-blue-900 mb-1">About QR Scan Tracking</h4>
//             <p className="text-sm text-blue-800">
//               This data shows which tiles are getting the most customer engagement through QR code scans. 
//               High scan counts indicate strong customer interest. Use this data to:
//             </p>
//             <ul className="mt-2 space-y-1 text-sm text-blue-700">
//               <li className="flex items-center gap-2">
//                 <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
//                 Identify your most popular products
//               </li>
//               <li className="flex items-center gap-2">
//                 <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
//                 Optimize inventory based on demand
//               </li>
//               <li className="flex items-center gap-2">
//                 <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
//                 Create targeted marketing campaigns
//               </li>
//               <li className="flex items-center gap-2">
//                 <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
//                 Understand customer preferences
//               </li>
//             </ul>
//           </div>
//         </div>
//       </div>
//     )}

//     {/* Quick Actions */}
//     {topScannedTiles.length > 0 && (
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//         <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg p-6 border border-purple-200">
//           <h4 className="font-semibold text-purple-900 mb-2 flex items-center gap-2">
//             <Eye className="w-5 h-5" />
//             Compare with Views
//           </h4>
//           <p className="text-sm text-purple-700 mb-3">
//             See how QR scans compare with regular tile views to understand customer journey.
//           </p>
//           <button
//             onClick={() => setActiveTab('overview')}
//             className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
//           >
//             View Analytics Overview
//           </button>
//         </div>
        
//         <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-6 border border-green-200">
//           <h4 className="font-semibold text-green-900 mb-2 flex items-center gap-2">
//             <Package className="w-5 h-5" />
//             Manage Inventory
//           </h4>
//           <p className="text-sm text-green-700 mb-3">
//             Update stock and pricing for your most popular tiles based on scan data.
//           </p>
//           <button
//             onClick={() => setActiveTab('tiles-inventory')}
//             className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
//           >
//             Go to Inventory
//           </button>
//         </div>
//       </div>
//     )}

//   </div>
// )}
//             {/* ===== ENGAGEMENT TAB ===== */}
//             {activeTab === 'engagement' && (
//               <div className="p-4 sm:p-6">
//                 <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg shadow p-8 text-center border border-purple-100">
//                   <Users className="w-16 h-16 text-purple-400 mx-auto mb-4" />
//                   <h3 className="text-xl font-semibold text-gray-800 mb-2">
//                     Customer Engagement Analytics
//                   </h3>
//                   <p className="text-gray-600 mb-4">
//                     Detailed customer journey tracking and engagement metrics coming soon
//                   </p>
//                   <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-800 rounded-lg text-sm font-medium">
//                     <Activity className="w-4 h-4" />
//                     Feature Under Development
//                   </div>
//                 </div>
//               </div>
//             )}

//           </div>

//           {/* ===== FOOTER ===== */}
//           <div className="p-4 bg-gray-50 border-t rounded-b-xl flex flex-col sm:flex-row items-center justify-between gap-3">
//             <div className="text-xs sm:text-sm text-gray-600 flex items-center gap-2">
//               <Clock className="w-4 h-4 flex-shrink-0" />
//               <span>
//                 Last Login: {overview?.lastLogin 
//                   ? formatDateTime(overview.lastLogin)
//                   : 'Never'
//                 }
//               </span>
//             </div>
//             <div className="flex items-center gap-2">
//               {loadingState.isRefreshing && (
//                 <span className="text-xs text-gray-500 flex items-center gap-1">
//                   <RefreshCw className="w-3 h-3 animate-spin" />
//                   Refreshing...
//                 </span>
//               )}
//               <button
//                 onClick={onClose}
//                 className="w-full sm:w-auto px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium"
//               >
//                 Close
//               </button>
//             </div>
//           </div>

//         </div>
//       </div>
//     </div>
//   );
// };

// // ===== EXPORT WITH ERROR BOUNDARY =====
// export const SellerAnalytics: React.FC<SellerAnalyticsProps> = (props) => {
//   return (
//     <AnalyticsErrorBoundary>
//       <SellerAnalyticsContent {...props} />
//     </AnalyticsErrorBoundary>
//   );
// };

// export default SellerAnalytics;   

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  Store, Eye, Layers, QrCode, TrendingUp, 
  Activity, Calendar, Clock, ArrowLeft, RefreshCw,
  Package, BarChart3, Download, Filter, X, CheckCircle,
  XCircle, Smartphone, Monitor, MapPin,
  FileText, Zap, Users, AlertCircle,
  ChevronLeft, ChevronRight, Search
} from 'lucide-react';
import {
  getSellerAnalyticsOverview,
  getSellerTopViewedTiles,
  getSellerTopQRScannedTiles,
  getSellerDailyActivity,
  getSellerQRGenerationHistory,
  getSellerQRGenerationStats,
  getSellerScansByDevice,
  getSellerScansByLocation,
  exportSellerAnalytics
} from '../lib/analyticsService';
import { getSellerTiles } from '../lib/firebaseutils';
import {
  AnalyticsOverview,
  AnalyticsTile,
  QRScannedTile,
  DailyActivity,
  QRGenerationHistory,
  QRGenerationStats,
  DeviceScanStats,
  LocationScanStats,
  DateRange
} from '../types/analytics';
import { AnalyticsErrorBoundary } from './AnalyticsErrorBoundary';

// ===== UTILITY FUNCTIONS =====
const formatNumber = (num: number): string => {
  return num.toLocaleString('en-IN');
};

const formatDateTime = (date: Date | string | null | undefined): string => {
  if (!date) return 'N/A';
  try {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleString('en-IN', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch {
    return 'Invalid Date';
  }
};

const formatPercentage = (value: number, total: number): string => {
  if (total === 0) return '0%';
  return `${Math.round((value / total) * 100)}%`;
};

// ===== INTERFACES =====
interface SellerAnalyticsProps {
  sellerId: string;
  sellerName: string;
  onClose: () => void;
}

type TabType = 'overview' | 'qr-tracking' | 'tiles-inventory' | 'top-scanned' | 'engagement';

interface LoadingState {
  isLoading: boolean;
  isRefreshing: boolean;
  isExporting: boolean;
}

interface ErrorState {
  hasError: boolean;
  message: string | null;
}

// ===== MAIN COMPONENT =====
const SellerAnalyticsContent: React.FC<SellerAnalyticsProps> = ({ 
  sellerId, 
  sellerName,
  onClose 
}) => {
  // ===== STATE MANAGEMENT =====
  const [loadingState, setLoadingState] = useState<LoadingState>({
    isLoading: true,
    isRefreshing: false,
    isExporting: false
  });

  const [errorState, setErrorState] = useState<ErrorState>({
    hasError: false,
    message: null
  });

  // Data States
  const [overview, setOverview] = useState<AnalyticsOverview | null>(null);
  const [topViewedTiles, setTopViewedTiles] = useState<AnalyticsTile[]>([]);
  const [topQRTiles, setTopQRTiles] = useState<QRScannedTile[]>([]);
  const [topScannedTiles, setTopScannedTiles] = useState<QRScannedTile[]>([]);
  const [dailyActivity, setDailyActivity] = useState<DailyActivity[]>([]);
  const [qrGenerationHistory, setQRGenerationHistory] = useState<QRGenerationHistory[]>([]);
  const [qrStats, setQRStats] = useState<QRGenerationStats | null>(null);
  const [scansByDevice, setScansByDevice] = useState<DeviceScanStats[]>([]);
  const [scansByLocation, setScansByLocation] = useState<LocationScanStats[]>([]);
  const [allTiles, setAllTiles] = useState<any[]>([]);
  
  // UI States
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [dateRange, setDateRange] = useState<DateRange>({
    start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    end: new Date()
  });
  const [showFilters, setShowFilters] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(false);

  // Tiles Inventory States
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'wall' | 'floor' | 'both'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [qrFilter, setQrFilter] = useState<'all' | 'with' | 'without'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'stock' | 'date'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // ===== LOAD ANALYTICS FUNCTION =====
  const loadAnalytics = useCallback(async (silent = false) => {
    try {
      if (!silent) {
        setLoadingState(prev => ({ ...prev, isLoading: true }));
      } else {
        setLoadingState(prev => ({ ...prev, isRefreshing: true }));
      }
      
      setErrorState({ hasError: false, message: null });

      const [
        overviewData,
        topViewed,
        topQR,
        activity,
        qrHistory,
        qrStatsData,
        deviceData,
        locationData,
        tilesData,
        topScannedAll
      ] = await Promise.all([
        getSellerAnalyticsOverview(sellerId),
        getSellerTopViewedTiles(sellerId, 5),
        getSellerTopQRScannedTiles(sellerId, 5),
        getSellerDailyActivity(sellerId, 7),
        getSellerQRGenerationHistory(sellerId, 10),
        getSellerQRGenerationStats(sellerId),
        getSellerScansByDevice(sellerId),
        getSellerScansByLocation(sellerId),
        getSellerTiles(sellerId),
        getSellerTopQRScannedTiles(sellerId, 10)
      ]);

      setOverview(overviewData);
      setTopViewedTiles(topViewed);
      setTopQRTiles(topQR);
      setDailyActivity(activity);
      setQRGenerationHistory(qrHistory);
      setQRStats(qrStatsData);
      setScansByDevice(deviceData);
      setScansByLocation(locationData);
      setAllTiles(tilesData);
      setTopScannedTiles(topScannedAll);

      console.log('✅ Analytics loaded successfully');
      console.log('📦 Tiles loaded:', tilesData.length);

    } catch (error: any) {
      console.error('❌ Error loading analytics:', error);
      setErrorState({
        hasError: true,
        message: error.message || 'Failed to load analytics data'
      });
    } finally {
      setLoadingState({
        isLoading: false,
        isRefreshing: false,
        isExporting: false
      });
    }
  }, [sellerId]);

  // ===== EXPORT FUNCTIONS =====
  const handleExport = async (format: 'csv' | 'pdf') => {
    try {
      setLoadingState(prev => ({ ...prev, isExporting: true }));
      await exportSellerAnalytics({ sellerId, format, dateRange });
      alert(`✅ Analytics exported successfully as ${format.toUpperCase()}`);
    } catch (error: any) {
      console.error('❌ Export failed:', error);
      alert(`❌ Export failed: ${error.message}`);
    } finally {
      setLoadingState(prev => ({ ...prev, isExporting: false }));
    }
  };

  const handleExportTopScanned = () => {
    try {
      const csv = [
        ['Rank', 'Tile Name', 'Code', 'Category', 'Size', 'Price', 'Total Scans'].join(','),
        ...topScannedTiles.map((t, i) => [
          i + 1,
          `"${t.name}"`,
          t.code || 'N/A',
          t.category,
          t.size,
          t.price,
          t.scanCount
        ].join(','))
      ].join('\n');
      
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `top-scanned-qr-${sellerId}-${Date.now()}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
      alert('✅ Top scanned data exported!');
    } catch (error) {
      alert('❌ Export failed');
    }
  };

  const handleExportTiles = () => {
    try {
      const csv = [
        ['Name', 'Code', 'Category', 'Size', 'Price', 'Brand', 'Color', 'Stock', 'Status', 'QR Generated', 'Created'].join(','),
        ...filteredTiles.map(t => [
          `"${t.name || 'N/A'}"`,
          t.code || t.product_code || 'N/A',
          t.category || 'N/A',
          t.size || 'N/A',
          t.price || 0,
          t.brand || 'N/A',
          t.color || 'N/A',
          t.stock || 0,
          t.status || 'active',
          t.qrCodeGenerated ? 'Yes' : 'No',
          t.createdAt || t.created_at || new Date().toISOString()
        ].join(','))
      ].join('\n');
      
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `tiles-inventory-${sellerId}-${Date.now()}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
      alert('✅ Tiles exported successfully!');
    } catch (error) {
      console.error('❌ Export error:', error);
      alert('❌ Failed to export tiles');
    }
  };

  // ===== EFFECTS =====
  useEffect(() => {
    loadAnalytics();
  }, [loadAnalytics]);

  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(() => {
      loadAnalytics(true);
    }, 30000);
    return () => clearInterval(interval);
  }, [autoRefresh, loadAnalytics]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, categoryFilter, statusFilter, qrFilter]);

  // ===== MEMOIZED VALUES =====
  const dailyActivityTotals = useMemo(() => {
    if (!dailyActivity.length) return null;
    
    const totalViews = dailyActivity.reduce((sum, d) => sum + d.views, 0);
    const totalApplies = dailyActivity.reduce((sum, d) => sum + d.applies, 0);
    const totalActions = dailyActivity.reduce((sum, d) => sum + d.actions, 0);
    const avgHours = (
      dailyActivity.reduce((sum, d) => sum + parseFloat(d.estimatedHours), 0) / 
      dailyActivity.length
    ).toFixed(1);
    
    return { totalViews, totalApplies, totalActions, avgHours };
  }, [dailyActivity]);

  const filteredTiles = useMemo(() => {
    let result = [...allTiles];
    
    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase().trim();
      result = result.filter(tile => 
        tile.name?.toLowerCase().includes(search) ||
        tile.code?.toLowerCase().includes(search) ||
        tile.product_code?.toLowerCase().includes(search) ||
        tile.size?.toLowerCase().includes(search) ||
        tile.brand?.toLowerCase().includes(search) ||
        tile.color?.toLowerCase().includes(search)
      );
    }
    
    if (categoryFilter !== 'all') {
      result = result.filter(tile => tile.category === categoryFilter);
    }
    
    if (statusFilter !== 'all') {
      result = result.filter(tile => {
        const tileStatus = tile.status || 'active';
        return statusFilter === 'active' 
          ? tileStatus === 'active' 
          : tileStatus !== 'active';
      });
    }
    
    if (qrFilter === 'with') {
      result = result.filter(tile => tile.qrCodeGenerated === true);
    } else if (qrFilter === 'without') {
      result = result.filter(tile => !tile.qrCodeGenerated);
    }
    
    result.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'name':
          comparison = (a.name || '').localeCompare(b.name || '');
          break;
        case 'price':
          comparison = (a.price || 0) - (b.price || 0);
          break;
        case 'stock':
          comparison = (a.stock || 0) - (b.stock || 0);
          break;
        case 'date':
          const dateA = new Date(a.createdAt || a.created_at || 0).getTime();
          const dateB = new Date(b.createdAt || b.created_at || 0).getTime();
          comparison = dateA - dateB;
          break;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });
    
    return result;
  }, [allTiles, searchTerm, categoryFilter, statusFilter, qrFilter, sortBy, sortOrder]);

  const paginatedTiles = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredTiles.slice(startIndex, endIndex);
  }, [filteredTiles, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredTiles.length / itemsPerPage);

  const inventoryStats = useMemo(() => {
    const totalValue = filteredTiles.reduce((sum, t) => sum + ((t.price || 0) * (t.stock || 1)), 0);
    const avgPrice = filteredTiles.length > 0 
      ? Math.round(filteredTiles.reduce((sum, t) => sum + (t.price || 0), 0) / filteredTiles.length)
      : 0;
    const withQR = filteredTiles.filter(t => t.qrCodeGenerated).length;
    const totalStock = filteredTiles.reduce((sum, t) => sum + (t.stock || 0), 0);
    
    return { totalValue, avgPrice, withQR, totalStock };
  }, [filteredTiles]);

  // ===== LOADING SCREEN =====
  if (loadingState.isLoading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mx-auto mb-4" />
            <p className="text-gray-700 font-semibold text-lg">Loading Analytics...</p>
            <p className="text-gray-500 text-sm mt-2">{sellerName}</p>
            <div className="mt-4 space-y-2">
              <div className="h-2 bg-gray-200 rounded overflow-hidden">
                <div className="h-full bg-purple-600 animate-pulse w-3/5" />
              </div>
              <p className="text-xs text-gray-400">Fetching data from database...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ===== ERROR SCREEN =====
  if (errorState.hasError) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <XCircle className="w-10 h-10 text-red-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Failed to Load Analytics</h3>
            <p className="text-gray-600 mb-6">{errorState.message}</p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => loadAnalytics()}
                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
              >
                <RefreshCw className="w-4 h-4 inline mr-2" />
                Retry
              </button>
              <button
                onClick={onClose}
                className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ===== MAIN UI =====
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 overflow-y-auto">
      <div className="min-h-screen px-2 sm:px-4 py-4 sm:py-8">
        <div className="bg-white rounded-xl shadow-2xl max-w-7xl mx-auto">
          
          {/* ===== HEADER ===== */}
          <div className="bg-gradient-to-r from-purple-600 via-purple-700 to-blue-600 text-white p-4 sm:p-6 rounded-t-xl">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              
              <div className="flex items-start gap-3 sm:gap-4 w-full sm:w-auto">
                <button
                  onClick={onClose}
                  className="hover:bg-white/20 rounded-lg p-2 transition-colors flex-shrink-0"
                  aria-label="Close"
                >
                  <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 sm:gap-3 mb-2">
                    <Store className="w-6 h-6 sm:w-8 sm:h-8 flex-shrink-0" />
                    <h2 className="text-lg sm:text-2xl font-bold truncate">
                      {overview?.businessName || sellerName}
                    </h2>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-purple-100">
                    <span className="truncate">📧 {overview?.email || 'N/A'}</span>
                    <span className="truncate">📱 {overview?.phone || 'N/A'}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium flex-shrink-0 ${
                      overview?.accountStatus === 'active' 
                        ? 'bg-green-500 text-white' 
                        : 'bg-red-500 text-white'
                    }`}>
                      {overview?.accountStatus === 'active' ? '🟢 Active' : '🔴 Inactive'}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={() => setAutoRefresh(!autoRefresh)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                    autoRefresh 
                      ? 'bg-green-500 hover:bg-green-600' 
                      : 'bg-white/20 hover:bg-white/30'
                  }`}
                  title={autoRefresh ? 'Auto-refresh enabled' : 'Auto-refresh disabled'}
                >
                  <Zap className={`w-4 h-4 ${autoRefresh ? 'animate-pulse' : ''}`} />
                  <span className="hidden sm:inline">Auto</span>
                </button>
                
                <button
                  onClick={() => loadAnalytics(true)}
                  disabled={loadingState.isRefreshing}
                  className="flex items-center gap-2 px-3 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm disabled:opacity-50 transition-colors"
                  title="Refresh data"
                >
                  <RefreshCw className={`w-4 h-4 ${loadingState.isRefreshing ? 'animate-spin' : ''}`} />
                  <span className="hidden sm:inline">Refresh</span>
                </button>
                
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2 px-3 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm transition-colors"
                  title="Toggle filters"
                >
                  <Filter className="w-4 h-4" />
                  <span className="hidden sm:inline">Filter</span>
                </button>
                
                <div className="relative group">
                  <button
                    className="flex items-center gap-2 px-3 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm transition-colors"
                    disabled={loadingState.isExporting}
                    title="Export data"
                  >
                    <Download className={`w-4 h-4 ${loadingState.isExporting ? 'animate-bounce' : ''}`} />
                    <span className="hidden sm:inline">Export</span>
                  </button>
                  <div className="hidden group-hover:block absolute right-0 mt-2 bg-white rounded-lg shadow-lg py-2 min-w-[120px] z-10">
                    <button
                      onClick={() => handleExport('csv')}
                      className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 text-sm transition-colors"
                      disabled={loadingState.isExporting}
                    >
                      📊 Export CSV
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {showFilters && (
              <div className="mt-4 p-4 bg-white/10 rounded-lg backdrop-blur-sm">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Date Range
                  </h4>
                  <button 
                    onClick={() => setShowFilters(false)} 
                    className="hover:bg-white/20 rounded p-1 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs mb-1">From</label>
                    <input
                      type="date"
                      value={dateRange.start.toISOString().split('T')[0]}
                      onChange={(e) => setDateRange(prev => ({ 
                        ...prev, 
                        start: new Date(e.target.value) 
                      }))}
                      className="w-full px-3 py-2 rounded-lg bg-white/20 text-white border border-white/30 text-sm placeholder-white/50"
                    />
                  </div>
                  <div>
                    <label className="block text-xs mb-1">To</label>
                    <input
                      type="date"
                      value={dateRange.end.toISOString().split('T')[0]}
                      onChange={(e) => setDateRange(prev => ({ 
                        ...prev, 
                        end: new Date(e.target.value) 
                      }))}
                      className="w-full px-3 py-2 rounded-lg bg-white/20 text-white border border-white/30 text-sm placeholder-white/50"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ===== TABS ===== */}
          <div className="border-b bg-gray-50 px-4 sm:px-6">
            <div className="flex gap-2 sm:gap-4 overflow-x-auto scrollbar-hide">
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-4 py-3 font-medium text-sm border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === 'overview' 
                    ? 'border-purple-600 text-purple-600' 
                    : 'border-transparent text-gray-600 hover:text-gray-800'
                }`}
              >
                <BarChart3 className="w-4 h-4 inline mr-2" />
                Overview
              </button>
              
              <button
                onClick={() => setActiveTab('qr-tracking')}
                className={`px-4 py-3 font-medium text-sm border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === 'qr-tracking' 
                    ? 'border-purple-600 text-purple-600' 
                    : 'border-transparent text-gray-600 hover:text-gray-800'
                }`}
              >
                <QrCode className="w-4 h-4 inline mr-2" />
                QR Tracking
              </button>
              
              <button
                onClick={() => setActiveTab('tiles-inventory')}
                className={`px-4 py-3 font-medium text-sm border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === 'tiles-inventory' 
                    ? 'border-purple-600 text-purple-600' 
                    : 'border-transparent text-gray-600 hover:text-gray-800'
                }`}
              >
                <Package className="w-4 h-4 inline mr-2" />
                Tiles Inventory ({allTiles.length})
              </button>
              
              <button
                onClick={() => setActiveTab('top-scanned')}
                className={`px-4 py-3 font-medium text-sm border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === 'top-scanned' 
                    ? 'border-purple-600 text-purple-600' 
                    : 'border-transparent text-gray-600 hover:text-gray-800'
                }`}
              >
                <TrendingUp className="w-4 h-4 inline mr-2" />
                Top Scanned ({topScannedTiles.length})
              </button>
              
              <button
                onClick={() => setActiveTab('engagement')}
                className={`px-4 py-3 font-medium text-sm border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === 'engagement' 
                    ? 'border-purple-600 text-purple-600' 
                    : 'border-transparent text-gray-600 hover:text-gray-800'
                }`}
              >
                <Activity className="w-4 h-4 inline mr-2" />
                Engagement
              </button>
            </div>
          </div>

          {/* ===== TAB CONTENT ===== */}
          <div className="overflow-auto max-h-[calc(100vh-300px)]">
            
            {/* ===== OVERVIEW TAB ===== */}
            {activeTab === 'overview' && (
              <div className="p-4 sm:p-6 space-y-6">
                
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                  <div className="bg-white rounded-lg p-3 sm:p-4 border-l-4 border-purple-500 shadow hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="text-xs sm:text-sm font-medium text-gray-600">Total Tiles</p>
                        <p className="text-2xl sm:text-3xl font-bold text-purple-600 mt-1">
                          {formatNumber(overview?.totalTiles || 0)}
                        </p>
                      </div>
                      <Package className="w-8 h-8 sm:w-10 sm:h-10 text-purple-400" />
                    </div>
                    <p className="text-xs text-gray-500">Uploaded products</p>
                  </div>

                  <div className="bg-white rounded-lg p-3 sm:p-4 border-l-4 border-blue-500 shadow hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="text-xs sm:text-sm font-medium text-gray-600">Total Views</p>
                        <p className="text-2xl sm:text-3xl font-bold text-blue-600 mt-1">
                          {formatNumber(overview?.totalViews || 0)}
                        </p>
                      </div>
                      <Eye className="w-8 h-8 sm:w-10 sm:h-10 text-blue-400" />
                    </div>
                    <p className="text-xs text-gray-500">Customer views</p>
                  </div>

                  <div className="bg-white rounded-lg p-3 sm:p-4 border-l-4 border-green-500 shadow hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="text-xs sm:text-sm font-medium text-gray-600">Applications</p>
                        <p className="text-2xl sm:text-3xl font-bold text-green-600 mt-1">
                          {formatNumber(overview?.totalApplies || 0)}
                        </p>
                      </div>
                      <Layers className="w-8 h-8 sm:w-10 sm:h-10 text-green-400" />
                    </div>
                    <p className="text-xs text-gray-500">Room visualizations</p>
                  </div>

                  <div className="bg-white rounded-lg p-3 sm:p-4 border-l-4 border-orange-500 shadow hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="text-xs sm:text-sm font-medium text-gray-600">QR Scans</p>
                        <p className="text-2xl sm:text-3xl font-bold text-orange-600 mt-1">
                          {formatNumber(overview?.totalQRScans || 0)}
                        </p>
                      </div>
                      <QrCode className="w-8 h-8 sm:w-10 sm:h-10 text-orange-400" />
                    </div>
                    <p className="text-xs text-gray-500">Mobile scans</p>
                  </div>
                </div>

                {/* Daily Activity Table */}
                <div className="bg-white rounded-lg shadow overflow-hidden">
                  <div className="p-4 border-b bg-gray-50">
                    <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                      <Activity className="w-5 h-5 text-purple-600" />
                      Daily Activity (Last 7 Days)
                    </h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50 border-b">
                        <tr>
                          <th className="text-left p-3 font-semibold text-gray-700">Date</th>
                          <th className="text-left p-3 font-semibold text-gray-700 hidden sm:table-cell">Day</th>
                          <th className="text-right p-3 font-semibold text-gray-700">Views</th>
                          <th className="text-right p-3 font-semibold text-gray-700 hidden md:table-cell">Apps</th>
                          <th className="text-right p-3 font-semibold text-gray-700">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {dailyActivity.length > 0 ? (
                          dailyActivity.map((day, i) => (
                            <tr key={i} className="border-t hover:bg-gray-50 transition-colors">
                              <td className="p-3 text-gray-700 font-medium">
                                {new Date(day.date).toLocaleDateString('en-US', { 
                                  month: 'short', 
                                  day: 'numeric' 
                                })}
                              </td>
                              <td className="p-3 text-gray-600 hidden sm:table-cell">{day.dayName}</td>
                              <td className="p-3 text-right text-blue-600 font-medium">{day.views}</td>
                              <td className="p-3 text-right text-green-600 font-medium hidden md:table-cell">{day.applies}</td>
                              <td className="p-3 text-right text-purple-600 font-semibold">{day.actions}</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={5} className="p-8 text-center text-gray-500">
                              <AlertCircle className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                              No activity data available
                            </td>
                          </tr>
                        )}
                      </tbody>
                      {dailyActivityTotals && (
                        <tfoot className="bg-gray-50 font-semibold border-t-2">
                          <tr>
                            <td colSpan={2} className="p-3 text-gray-800">Total</td>
                            <td className="p-3 text-right text-blue-700">{dailyActivityTotals.totalViews}</td>
                            <td className="p-3 text-right text-green-700 hidden md:table-cell">{dailyActivityTotals.totalApplies}</td>
                            <td className="p-3 text-right text-purple-700">{dailyActivityTotals.totalActions}</td>
                          </tr>
                        </tfoot>
                      )}
                    </table>
                  </div>
                </div>

                {/* Top Tiles Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  
                  {/* Top Viewed Tiles */}
                  <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="p-4 border-b bg-gradient-to-r from-blue-50 to-blue-100">
                      <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-blue-600" />
                        Top 5 Viewed Tiles
                      </h3>
                    </div>
                    <div className="divide-y">
                      {topViewedTiles.length > 0 ? (
                        topViewedTiles.map((tile, i) => (
                          <div key={tile.id} className="p-3 hover:bg-blue-50 transition-colors flex items-center gap-3">
                            <span className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                              i === 0 ? 'bg-yellow-400 text-yellow-900' :
                              i === 1 ? 'bg-gray-300 text-gray-800' :
                              i === 2 ? 'bg-orange-300 text-orange-900' :
                              'bg-gray-100 text-gray-600'
                            }`}>
                              {i + 1}
                            </span>
                            {tile.imageUrl && (
                              <img 
                                src={tile.imageUrl} 
                                alt={tile.name} 
                                className="w-12 h-12 object-cover rounded shadow-sm" 
                                onError={(e) => {
                                  e.currentTarget.src = 'https://via.placeholder.com/48?text=No+Image';
                                }}
                              />
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-gray-800 truncate">{tile.name}</p>
                              <p className="text-xs text-gray-500">
                                {tile.category} • {tile.size} • ₹{formatNumber(tile.price)}
                              </p>
                            </div>
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold whitespace-nowrap">
                              👁️ {tile.viewCount}
                            </span>
                          </div>
                        ))
                      ) : (
                        <div className="p-8 text-center text-gray-500">
                          <Eye className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                          <p>No view data available</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Top QR Scanned Tiles */}
                  <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="p-4 border-b bg-gradient-to-r from-orange-50 to-orange-100">
                      <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                        <QrCode className="w-5 h-5 text-orange-600" />
                        Top 5 Scanned QR
                      </h3>
                    </div>
                    <div className="divide-y">
                      {topQRTiles.length > 0 ? (
                        topQRTiles.map((tile, i) => (
                          <div key={tile.id} className="p-3 hover:bg-orange-50 transition-colors flex items-center gap-3">
                            <span className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                              i === 0 ? 'bg-yellow-400 text-yellow-900' :
                              i === 1 ? 'bg-gray-300 text-gray-800' :
                              i === 2 ? 'bg-orange-300 text-orange-900' :
                              'bg-gray-100 text-gray-600'
                            }`}>
                              {i + 1}
                            </span>
                            {tile.imageUrl && (
                              <img 
                                src={tile.imageUrl} 
                                alt={tile.name} 
                                className="w-12 h-12 object-cover rounded shadow-sm"
                                onError={(e) => {
                                  e.currentTarget.src = 'https://via.placeholder.com/48?text=No+Image';
                                }}
                              />
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-gray-800 truncate">{tile.name}</p>
                              <p className="text-xs text-gray-500">
                                {tile.category} • {tile.size} • ₹{formatNumber(tile.price)}
                              </p>
                            </div>
                            <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded-full text-xs font-semibold whitespace-nowrap">
                              📱 {tile.scanCount}
                            </span>
                          </div>
                        ))
                      ) : (
                        <div className="p-8 text-center text-gray-500">
                          <QrCode className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                          <p>No QR scan data available</p>
                        </div>
                      )}
                    </div>
                  </div>

                </div>

              </div>
            )}

            {/* ===== QR TRACKING TAB ===== */}
            {activeTab === 'qr-tracking' && (
              <div className="p-4 sm:p-6 space-y-6">
                
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200 shadow hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="text-xs font-medium text-gray-600">Total Generated</p>
                        <p className="text-3xl font-bold text-purple-700 mt-1">
                          {qrStats?.totalGenerated || 0}
                        </p>
                      </div>
                      <CheckCircle className="w-10 h-10 text-purple-500" />
                    </div>
                    <p className="text-xs text-gray-600">QR codes created</p>
                  </div>

                  <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200 shadow hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="text-xs font-medium text-gray-600">Active Codes</p>
                        <p className="text-3xl font-bold text-green-700 mt-1">
                          {qrStats?.totalActive || 0}
                        </p>
                      </div>
                      <Activity className="w-10 h-10 text-green-500" />
                    </div>
                    <p className="text-xs text-gray-600">Currently working</p>
                  </div>

                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200 shadow hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="text-xs font-medium text-gray-600">Coverage</p>
                        <p className="text-3xl font-bold text-blue-700 mt-1">
                          {qrStats?.generationRate || 0}%
                        </p>
                      </div>
                      <TrendingUp className="w-10 h-10 text-blue-500" />
                    </div>
                    <p className="text-xs text-gray-600">Tiles with QR</p>
                  </div>

                  <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4 border border-orange-200 shadow hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="text-xs font-medium text-gray-600">Last Generated</p>
                        <p className="text-sm font-semibold text-orange-700 mt-1">
                          {qrStats?.lastGeneration 
                            ? new Date(qrStats.lastGeneration).toLocaleDateString('en-US', { 
                                month: 'short', 
                                day: 'numeric' 
                              })
                            : 'Never'
                          }
                        </p>
                      </div>
                      <Clock className="w-10 h-10 text-orange-500" />
                    </div>
                    <p className="text-xs text-gray-600">Most recent</p>
                  </div>
                </div>

                {/* QR History Table */}
                <div className="bg-white rounded-lg shadow overflow-hidden">
                  <div className="p-4 border-b bg-gray-50">
                    <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                      <FileText className="w-5 h-5 text-purple-600" />
                      QR Generation History (Last 10)
                    </h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50 border-b">
                        <tr>
                          <th className="text-left p-3 font-semibold text-gray-700">Tile Name</th>
                          <th className="text-left p-3 font-semibold text-gray-700 hidden md:table-cell">Generated At</th>
                          <th className="text-center p-3 font-semibold text-gray-700">Status</th>
                          <th className="text-center p-3 font-semibold text-gray-700 hidden sm:table-cell">QR Code</th>
                        </tr>
                      </thead>
                      <tbody>
                        {qrGenerationHistory.length > 0 ? (
                          qrGenerationHistory.map((gen) => (
                            <tr key={gen.id} className="border-t hover:bg-gray-50 transition-colors">
                              <td className="p-3">
                                <div className="flex items-center gap-2">
                                  {gen.tileImage && (
                                    <img 
                                      src={gen.tileImage} 
                                      alt={gen.tileName}
                                      className="w-8 h-8 rounded object-cover"
                                      onError={(e) => {
                                        e.currentTarget.style.display = 'none';
                                      }}
                                    />
                                  )}
                                  <span className="font-medium text-gray-800 truncate">
                                    {gen.tileName}
                                  </span>
                                </div>
                              </td>
                              <td className="p-3 text-gray-600 text-xs hidden md:table-cell">
                                {formatDateTime(gen.generatedAt)}
                              </td>
                              <td className="p-3 text-center">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  gen.isActive 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-red-100 text-red-800'
                                }`}>
                                  {gen.isActive ? '✓ Active' : '✗ Inactive'}
                                </span>
                              </td>
                              <td className="p-3 text-center hidden sm:table-cell">
                                {gen.qrCodeUrl && (
                                  <button
                                    onClick={() => window.open(gen.qrCodeUrl, '_blank')}
                                    className="text-purple-600 hover:text-purple-800 text-xs font-medium"
                                  >
                                    View QR
                                  </button>
                                )}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={4} className="p-8 text-center text-gray-500">
                              <QrCode className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                              <p>No QR generation history available</p>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Device & Location Stats */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  
                  {/* Scans by Device */}
                  <div className="bg-white rounded-lg shadow p-4">
                    <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                      <Smartphone className="w-5 h-5 text-blue-600" />
                      Scans by Device
                    </h3>
                    {scansByDevice.length > 0 ? (
                      <div className="space-y-3">
                        {scansByDevice.map((device, i) => {
                          const percentage = formatPercentage(device.count, overview?.totalQRScans || 0);
                          return (
                            <div key={i} className="flex items-center gap-3">
                              <div className="w-12 flex-shrink-0">
                                {device.type === 'mobile' ? (
                                  <Smartphone className="w-6 h-6 text-blue-600" />
                                ) : device.type === 'tablet' ? (
                                  <Monitor className="w-6 h-6 text-purple-600" />
                                ) : (
                                  <Monitor className="w-6 h-6 text-gray-600" />
                                )}
                              </div>
                              <div className="flex-1">
                                <div className="flex justify-between mb-1">
                                  <span className="text-sm font-medium capitalize">{device.type}</span>
                                  <span className="text-sm text-gray-600">{device.count} ({percentage})</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                  <div 
                                    className={`h-full rounded-full ${
                                      device.type === 'mobile' ? 'bg-blue-600' : 
                                      device.type === 'tablet' ? 'bg-purple-600' : 
                                      'bg-gray-600'
                                    }`} 
                                    style={{ width: percentage }} 
                                  />
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="p-8 text-center text-gray-500">
                        <Smartphone className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                        <p>No device data available</p>
                      </div>
                    )}
                  </div>

                  {/* Scans by Location */}
                  <div className="bg-white rounded-lg shadow p-4">
                    <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-green-600" />
                      Scans by Location
                    </h3>
                    {scansByLocation.length > 0 ? (
                      <div className="space-y-3">
                        {scansByLocation.slice(0, 5).map((location, i) => {
                          const percentage = formatPercentage(location.count, overview?.totalQRScans || 0);
                          return (
                            <div key={i} className="flex items-center gap-3">
                              <span className="text-2xl flex-shrink-0">{location.flag || '🌍'}</span>
                              <div className="flex-1">
                                <div className="flex justify-between mb-1">
                                  <span className="text-sm font-medium truncate">
                                    {location.city}, {location.country}
                                  </span>
                                  <span className="text-sm text-gray-600 ml-2 whitespace-nowrap">
                                    {location.count}
                                  </span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                  <div 
                                    className="h-full bg-green-600 rounded-full" 
                                    style={{ width: percentage }} 
                                  />
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="p-8 text-center text-gray-500">
                        <MapPin className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                        <p>No location data available</p>
                      </div>
                    )}
                  </div>

                </div>

              </div>
            )}

            {/* ===== TILES INVENTORY TAB ===== */}
            {activeTab === 'tiles-inventory' && (
              <div className="p-4 sm:p-6 space-y-6">
                
                <div className="bg-white rounded-lg shadow p-4">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
                    <div>
                      <h3 className="font-semibold text-gray-800 flex items-center gap-2 text-lg">
                        <Package className="w-5 h-5 text-purple-600" />
                        Complete Tiles Inventory
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        Total {allTiles.length} tiles • Showing {filteredTiles.length} results
                      </p>
                    </div>
                    
                    <button
                      onClick={handleExportTiles}
                      className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
                    >
                      <Download className="w-4 h-4" />
                      Export CSV
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search tiles..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                      />
                    </div>
                    
                    <select
                      value={categoryFilter}
                      onChange={(e) => setCategoryFilter(e.target.value as any)}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                    >
                      <option value="all">All Categories</option>
                      <option value="wall">🧱 Wall Tiles</option>
                      <option value="floor">🟫 Floor Tiles</option>
                      <option value="both">🏗️ Both</option>
                    </select>
                    
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value as any)}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                    >
                      <option value="all">All Status</option>
                      <option value="active">🟢 Active</option>
                      <option value="inactive">🔴 Inactive</option>
                    </select>
                    
                    <select
                      value={qrFilter}
                      onChange={(e) => setQrFilter(e.target.value as any)}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                    >
                      <option value="all">All Tiles</option>
                      <option value="with">✅ With QR</option>
                      <option value="without">❌ Without QR</option>
                    </select>
                  </div>
                </div>

                {filteredTiles.length > 0 && (
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
                      <p className="text-sm text-gray-600 mb-1">Total Value</p>
                      <p className="text-2xl font-bold text-blue-700">
                        ₹{formatNumber(inventoryStats.totalValue)}
                      </p>
                    </div>
                    
                    <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
                      <p className="text-sm text-gray-600 mb-1">Avg Price</p>
                      <p className="text-2xl font-bold text-green-700">
                        ₹{formatNumber(inventoryStats.avgPrice)}
                      </p>
                    </div>
                    
                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
                      <p className="text-sm text-gray-600 mb-1">With QR</p>
                      <p className="text-2xl font-bold text-purple-700">
                        {inventoryStats.withQR}
                      </p>
                    </div>
                    
                    <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4 border border-orange-200">
                      <p className="text-sm text-gray-600 mb-1">Total Stock</p>
                      <p className="text-2xl font-bold text-orange-700">
                        {formatNumber(inventoryStats.totalStock)}
                      </p>
                    </div>
                  </div>
                )}

                <div className="bg-white rounded-lg shadow overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gradient-to-r from-purple-50 to-blue-50 border-b-2 border-purple-200">
                        <tr>
                          <th className="text-left p-3 font-semibold text-gray-800">Image</th>
                          <th className="text-left p-3 font-semibold text-gray-800">Name</th>
                          <th className="text-left p-3 font-semibold text-gray-800">Code</th>
                          <th className="text-left p-3 font-semibold text-gray-800 hidden sm:table-cell">Category</th>
                          <th className="text-left p-3 font-semibold text-gray-800">Size</th>
                          <th className="text-right p-3 font-semibold text-gray-800">Price</th>
                          <th className="text-center p-3 font-semibold text-gray-800 hidden lg:table-cell">Stock</th>
                        </tr>
                      </thead>
                      <tbody>
                        {paginatedTiles.length > 0 ? (
                          paginatedTiles.map((tile, index) => (
                            <tr 
                              key={tile.id} 
                              className={`border-t hover:bg-purple-50 transition-colors ${
                                index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                              }`}
                            >
                              <td className="p-3">
                                {tile.imageUrl ? (
                                  <img
                                    src={tile.imageUrl}
                                    alt={tile.name}
                                    className="w-12 h-12 object-cover rounded shadow-sm"
                                    onError={(e) => {
                                      e.currentTarget.src = 'https://via.placeholder.com/48?text=No+Img';
                                    }}
                                  />
                                ) : (
                                  <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                                    <Package className="w-6 h-6 text-gray-400" />
                                  </div>
                                )}
                              </td>
                              
                              <td className="p-3">
                                <p className="font-medium text-gray-800 max-w-xs truncate">
                                  {tile.name || 'Unnamed Tile'}
                                </p>
                                <p className="text-xs text-gray-500 mt-1 hidden lg:block">
                                  {tile.material || 'N/A'} • {tile.finish || 'N/A'}
                                </p>
                              </td>
                              
                              <td className="p-3">
                                <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-xs font-mono">
                                  {tile.code || tile.product_code || 'N/A'}
                                </span>
                              </td>
                              
                              <td className="p-3 hidden sm:table-cell">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  tile.category === 'wall' ? 'bg-blue-100 text-blue-800' :
                                  tile.category === 'floor' ? 'bg-green-100 text-green-800' :
                                  'bg-purple-100 text-purple-800'
                                }`}>
                                  {tile.category === 'wall' ? '🧱 Wall' :
                                   tile.category === 'floor' ? '🟫 Floor' :
                                   '🏗️ Both'}
                                </span>
                              </td>
                              
                              <td className="p-3 text-gray-700 font-medium">
                                {tile.size || 'N/A'}
                              </td>
                              
                              <td className="p-3 text-right">
                                <span className="font-semibold text-green-700">
                                  ₹{formatNumber(tile.price || 0)}
                                </span>
                              </td>
                              
                              <td className="p-3 text-center hidden lg:table-cell">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  (tile.stock || 0) > 50 ? 'bg-green-100 text-green-800' :
                                  (tile.stock || 0) > 10 ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-red-100 text-red-800'
                                }`}>
                                  {tile.stock || 0}
                                </span>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={7} className="p-12 text-center">
                              <Package className="w-16 h-16 mx-auto mb-3 text-gray-300" />
                              <p className="text-gray-500 font-medium">
                                {searchTerm || categoryFilter !== 'all' || statusFilter !== 'all' || qrFilter !== 'all'
                                  ? 'No tiles found matching your filters' 
                                  : 'No tiles available'}
                              </p>
                              {(searchTerm || categoryFilter !== 'all' || statusFilter !== 'all' || qrFilter !== 'all') && (
                                <button
                                  onClick={() => {
                                    setSearchTerm('');
                                    setCategoryFilter('all');
                                    setStatusFilter('all');
                                    setQrFilter('all');
                                  }}
                                  className="mt-3 text-purple-600 hover:text-purple-800 text-sm font-medium"
                                >
                                  Clear all filters
                                </button>
                              )}
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  {filteredTiles.length > 0 && (
                    <div className="bg-gray-50 px-4 py-3 border-t flex flex-col sm:flex-row items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">Show:</span>
                        <select
                          value={itemsPerPage}
                          onChange={(e) => {
                            setItemsPerPage(Number(e.target.value));
                            setCurrentPage(1);
                          }}
                          className="px-3 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-purple-500"
                        >
                          <option value={10}>10</option>
                          <option value={20}>20</option>
                          <option value={50}>50</option>
                          <option value={100}>100</option>
                        </select>
                        <span className="text-sm text-gray-600">per page</span>
                      </div>
                      
                      <div className="text-sm text-gray-600">
                        Showing {((currentPage - 1) * itemsPerPage) + 1} to{' '}
                        {Math.min(currentPage * itemsPerPage, filteredTiles.length)} of{' '}
                        {filteredTiles.length} tiles
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                          disabled={currentPage === 1}
                          className="px-3 py-1 border border-gray-300 rounded text-sm font-medium hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                        >
                          <ChevronLeft className="w-4 h-4" />
                          Prev
                        </button>
                        
                        <div className="flex gap-1">
                          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                            let pageNum;
                            if (totalPages <= 5) {
                              pageNum = i + 1;
                            } else if (currentPage <= 3) {
                              pageNum = i + 1;
                            } else if (currentPage >= totalPages - 2) {
                              pageNum = totalPages - 4 + i;
                            } else {
                              pageNum = currentPage - 2 + i;
                            }
                            
                            return (
                              <button
                                key={pageNum}
                                onClick={() => setCurrentPage(pageNum)}
                                className={`px-3 py-1 border rounded text-sm font-medium transition-colors ${
                                  currentPage === pageNum
                                    ? 'bg-purple-600 text-white border-purple-600'
                                    : 'border-gray-300 hover:bg-gray-100'
                                }`}
                              >
                                {pageNum}
                              </button>
                            );
                          })}
                        </div>
                        
                        <button
                          onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                          disabled={currentPage === totalPages}
                          className="px-3 py-1 border border-gray-300 rounded text-sm font-medium hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                        >
                          Next
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>

              </div>
            )}

            {/* ===== TOP SCANNED TAB ===== */}
            {activeTab === 'top-scanned' && (
              <div className="p-4 sm:p-6 space-y-6">
                
                <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-lg p-6 border border-orange-200">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        <TrendingUp className="w-7 h-7 text-orange-600" />
                        Top 10 Most Scanned QR Codes
                      </h3>
                      <p className="text-gray-600 mt-2">
                        Most popular tiles based on customer QR code scans
                      </p>
                    </div>
                    
                    <button
                      onClick={handleExportTopScanned}
                      className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm font-medium shadow-md"
                    >
                      <Download className="w-4 h-4" />
                      Export CSV
                    </button>
                  </div>
                  
                  {topScannedTiles.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                      <div className="bg-white rounded-lg p-4 shadow-sm">
                        <p className="text-sm text-gray-600 mb-1">Total QR Scans</p>
                        <p className="text-2xl font-bold text-orange-700">
                          {formatNumber(topScannedTiles.reduce((sum, t) => sum + t.scanCount, 0))}
                        </p>
                      </div>
                      <div className="bg-white rounded-lg p-4 shadow-sm">
                        <p className="text-sm text-gray-600 mb-1">Avg Scans per Tile</p>
                        <p className="text-2xl font-bold text-orange-700">
                          {Math.round(topScannedTiles.reduce((sum, t) => sum + t.scanCount, 0) / topScannedTiles.length)}
                        </p>
                      </div>
                      <div className="bg-white rounded-lg p-4 shadow-sm">
                        <p className="text-sm text-gray-600 mb-1">Top Tile Scans</p>
                        <p className="text-2xl font-bold text-orange-700">
                          {topScannedTiles[0]?.scanCount || 0}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gradient-to-r from-orange-100 via-red-50 to-orange-100 border-b-2 border-orange-300">
                        <tr>
                          <th className="text-center p-4 font-bold text-gray-800 w-20">Rank</th>
                          <th className="text-left p-4 font-bold text-gray-800">Image</th>
                          <th className="text-left p-4 font-bold text-gray-800">Tile Name</th>
                          <th className="text-left p-4 font-bold text-gray-800">Code</th>
                          <th className="text-left p-4 font-bold text-gray-800 hidden sm:table-cell">Category</th>
                          <th className="text-left p-4 font-bold text-gray-800 hidden md:table-cell">Size</th>
                          <th className="text-right p-4 font-bold text-gray-800">Price</th>
                          <th className="text-right p-4 font-bold text-gray-800">Total Scans</th>
                          <th className="text-center p-4 font-bold text-gray-800 hidden lg:table-cell">Popularity</th>
                        </tr>
                      </thead>
                      <tbody>
                        {topScannedTiles.length > 0 ? (
                          topScannedTiles.map((tile, index) => {
                            const isTop3 = index < 3;
                            const maxScans = topScannedTiles[0]?.scanCount || 1;
                            const popularityPercent = Math.round((tile.scanCount / maxScans) * 100);
                            
                            return (
                              <tr 
                                key={tile.id} 
                                className={`border-t transition-all duration-200 ${
                                  isTop3 
                                    ? 'bg-gradient-to-r from-orange-50 to-yellow-50 hover:from-orange-100 hover:to-yellow-100' 
                                    : index % 2 === 0 
                                    ? 'bg-white hover:bg-gray-50' 
                                    : 'bg-gray-50 hover:bg-gray-100'
                                }`}
                              >
                                <td className="p-4 text-center">
                                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full font-bold text-lg ${
                                    index === 0 ? 'bg-gradient-to-br from-yellow-400 to-yellow-600 text-yellow-900 shadow-lg' :
                                    index === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-500 text-gray-800 shadow-md' :
                                    index === 2 ? 'bg-gradient-to-br from-orange-400 to-orange-600 text-orange-900 shadow-md' :
                                    'bg-gray-200 text-gray-700'
                                  }`}>
                                    {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : index + 1}
                                  </div>
                                </td>
                                
                                <td className="p-4">
                                  {tile.imageUrl ? (
                                    <img
                                      src={tile.imageUrl}
                                      alt={tile.name}
                                      className={`w-16 h-16 object-cover rounded-lg shadow-md ${
                                        isTop3 ? 'ring-2 ring-orange-400' : ''
                                      }`}
                                      onError={(e) => {
                                        e.currentTarget.src = 'https://via.placeholder.com/64?text=Tile';
                                      }}
                                    />
                                  ) : (
                                    <div className="w-16 h-16 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg flex items-center justify-center">
                                      <Package className="w-8 h-8 text-gray-500" />
                                    </div>
                                  )}
                                </td>
                                
                                <td className="p-4">
                                  <p className={`font-semibold max-w-xs truncate ${
                                    isTop3 ? 'text-orange-900 text-base' : 'text-gray-800'
                                  }`}>
                                    {tile.name}
                                  </p>
                                  {isTop3 && (
                                    <span className="inline-block mt-1 px-2 py-0.5 bg-orange-200 text-orange-800 text-xs rounded-full font-medium">
                                      ⭐ Top {index + 1}
                                    </span>
                                  )}
                                </td>
                                
                                <td className="p-4">
                                  <span className={`px-3 py-1 rounded-lg text-xs font-mono font-semibold ${
                                    isTop3 
                                      ? 'bg-orange-200 text-orange-900' 
                                      : 'bg-gray-100 text-gray-800'
                                  }`}>
                                    {tile.code || tile.product_code || 'N/A'}
                                  </span>
                                </td>
                                
                                <td className="p-4 hidden sm:table-cell">
                                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                    tile.category === 'wall' ? 'bg-blue-100 text-blue-800' :
                                    tile.category === 'floor' ? 'bg-green-100 text-green-800' :
                                    'bg-purple-100 text-purple-800'
                                  }`}>
                                    {tile.category === 'wall' ? '🧱 Wall' :
                                     tile.category === 'floor' ? '🟫 Floor' :
                                     '🏗️ Both'}
                                  </span>
                                </td>
                                
                                <td className="p-4 text-gray-700 font-medium hidden md:table-cell">
                                  {tile.size || 'N/A'}
                                </td>
                                
                                <td className="p-4 text-right">
                                  <span className={`font-bold ${
                                    isTop3 ? 'text-green-700 text-base' : 'text-green-600'
                                  }`}>
                                    ₹{formatNumber(tile.price || 0)}
                                  </span>
                                </td>
                                
                                <td className="p-4 text-right">
                                  <div className="flex items-center justify-end gap-2">
                                    <QrCode className={`w-5 h-5 ${
                                      isTop3 ? 'text-orange-600' : 'text-gray-500'
                                    }`} />
                                    <span className={`font-bold text-lg ${
                                      isTop3 ? 'text-orange-700' : 'text-gray-800'
                                    }`}>
                                      {formatNumber(tile.scanCount)}
                                    </span>
                                  </div>
                                  <p className="text-xs text-gray-500 mt-1">
                                    {tile.scanCount === 1 ? 'scan' : 'scans'}
                                  </p>
                                </td>
                                
                                <td className="p-4 hidden lg:table-cell">
                                  <div className="w-full">
                                    <div className="flex items-center justify-between mb-1">
                                      <span className="text-xs font-medium text-gray-600">
                                        {popularityPercent}%
                                      </span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                                      <div 
                                        className={`h-full rounded-full transition-all duration-500 ${
                                          isTop3 
                                            ? 'bg-gradient-to-r from-orange-500 to-red-500' 
                                            : 'bg-gradient-to-r from-blue-400 to-blue-600'
                                        }`}
                                        style={{ width: `${popularityPercent}%` }}
                                      />
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            );
                          })
                        ) : (
                          <tr>
                            <td colSpan={9} className="p-12 text-center">
                              <div className="flex flex-col items-center justify-center">
                                <QrCode className="w-20 h-20 text-gray-300 mb-4" />
                                <p className="text-gray-500 font-medium text-lg mb-2">
                                  No QR scan data available yet
                                </p>
                                <p className="text-gray-400 text-sm max-w-md">
                                  QR scans will appear here once customers start scanning your tile QR codes.
                                  Make sure QR codes are generated and displayed on your tiles.
                                </p>
                              </div>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {topScannedTiles.length > 0 && (
                  <>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <h4 className="font-semibold text-blue-900 mb-1">About QR Scan Tracking</h4>
                          <p className="text-sm text-blue-800">
                            This data shows which tiles are getting the most customer engagement through QR code scans. 
                            High scan counts indicate strong customer interest. Use this data to:
                          </p>
                          <ul className="mt-2 space-y-1 text-sm text-blue-700">
                            <li className="flex items-center gap-2">
                              <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
                              Identify your most popular products
                            </li>
                            <li className="flex items-center gap-2">
                              <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
                              Optimize inventory based on demand
                            </li>
                            <li className="flex items-center gap-2">
                              <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
                              Create targeted marketing campaigns
                            </li>
                            <li className="flex items-center gap-2">
                              <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
                              Understand customer preferences
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg p-6 border border-purple-200">
                        <h4 className="font-semibold text-purple-900 mb-2 flex items-center gap-2">
                          <Eye className="w-5 h-5" />
                          Compare with Views
                        </h4>
                        <p className="text-sm text-purple-700 mb-3">
                          See how QR scans compare with regular tile views to understand customer journey.
                        </p>
                        <button
                          onClick={() => setActiveTab('overview')}
                          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
                        >
                          View Analytics Overview
                        </button>
                      </div>
                      
                      <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-6 border border-green-200">
                        <h4 className="font-semibold text-green-900 mb-2 flex items-center gap-2">
                          <Package className="w-5 h-5" />
                          Manage Inventory
                        </h4>
                        <p className="text-sm text-green-700 mb-3">
                          Update stock and pricing for your most popular tiles based on scan data.
                        </p>
                        <button
                          onClick={() => setActiveTab('tiles-inventory')}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                        >
                          Go to Inventory
                        </button>
                      </div>
                    </div>
                  </>
                )}

              </div>
            )}

            {/* ===== ENGAGEMENT TAB ===== */}
            {activeTab === 'engagement' && (
              <div className="p-4 sm:p-6">
                <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg shadow p-8 text-center border border-purple-100">
                  <Users className="w-16 h-16 text-purple-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    Customer Engagement Analytics
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Detailed customer journey tracking and engagement metrics coming soon
                  </p>
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-800 rounded-lg text-sm font-medium">
                    <Activity className="w-4 h-4" />
                    Feature Under Development
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* ===== FOOTER ===== */}
          <div className="p-4 bg-gray-50 border-t rounded-b-xl flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-xs sm:text-sm text-gray-600 flex items-center gap-2">
              <Clock className="w-4 h-4 flex-shrink-0" />
              <span>
                Last Login: {overview?.lastLogin 
                  ? formatDateTime(overview.lastLogin)
                  : 'Never'
                }
              </span>
            </div>
            <div className="flex items-center gap-2">
              {loadingState.isRefreshing && (
                <span className="text-xs text-gray-500 flex items-center gap-1">
                  <RefreshCw className="w-3 h-3 animate-spin" />
                  Refreshing...
                </span>
              )}
              <button
                onClick={onClose}
                className="w-full sm:w-auto px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                Close
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

// ===== EXPORT WITH ERROR BOUNDARY =====
export const SellerAnalytics: React.FC<SellerAnalyticsProps> = (props) => {
  return (
    <AnalyticsErrorBoundary>
      <SellerAnalyticsContent {...props} />
    </AnalyticsErrorBoundary>
  );
};

export default SellerAnalytics;