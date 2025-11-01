
import React, { useState, useEffect } from 'react';
import { 
  Package, TrendingUp, AlertTriangle, CheckCircle, 
  BarChart3, Search, RefreshCw, Loader, QrCode,
  Award, Medal, Trophy, Eye, Calendar
} from 'lucide-react';
import { useAppStore } from '../stores/appStore';
import { 
  getSellerScanAnalytics, 
  getTopScannedTiles, 
  getSellerStockSummary,
  getScanTimeline
} from '../lib/firebaseutils';

interface TileAnalytics {
  tile_id: string;
  tile_name: string;
  tile_code: string;
  category: string;
  size: string;
  price: number;
  stock: number;
  in_stock: boolean;
  image_url: string;
  total_scans: number;
  last_scanned: string | null;
  qr_code: string | null;
  rank?: number;
  scan_percentage?: number;
}

interface StockSummary {
  total_stock: number;
  in_stock_count: number;
  out_stock_count: number;
  low_stock_count: number;
  total_tiles: number;
  total_scans: number;
}

export const SellerStockAnalytics: React.FC = () => {
  const { currentUser } = useAppStore();
  
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [analytics, setAnalytics] = useState<TileAnalytics[]>([]);
  const [topTiles, setTopTiles] = useState<TileAnalytics[]>([]);
  const [summary, setSummary] = useState<StockSummary>({
    total_stock: 0,
    in_stock_count: 0,
    out_stock_count: 0,
    low_stock_count: 0,
    total_tiles: 0,
    total_scans: 0
  });
  const [timeline, setTimeline] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortColumn, setSortColumn] = useState<'name' | 'stock' | 'scans'>('scans');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [autoRefresh, setAutoRefresh] = useState(false);

  useEffect(() => {
    if (currentUser?.user_id) {
      loadAnalytics();
    }
  
    // ✅ Listen for scan events
    const handleScanEvent = (event: any) => {
      console.log('📡 Scan event received:', event.detail);
      
      // ✅ IMMEDIATE refresh (no 2 second delay)
      console.log('🔄 Refreshing analytics NOW...');
      refreshAnalytics();
    };
  
    window.addEventListener('tile-scanned', handleScanEvent);
  
    return () => {
      window.removeEventListener('tile-scanned', handleScanEvent);
    };
  }, [currentUser]);

  const loadAnalytics = async () => {
    if (!currentUser?.user_id) return;

    try {
      setLoading(true);
      console.log('📊 Loading analytics for seller:', currentUser.user_id);

      const [analyticsData, topTilesData, summaryData, timelineData] = await Promise.all([
        getSellerScanAnalytics(currentUser.user_id),
        getTopScannedTiles(currentUser.user_id, 10),
        getSellerStockSummary(currentUser.user_id),
        getScanTimeline(currentUser.user_id, 7)
      ]);

      setAnalytics(analyticsData);
      setTopTiles(topTilesData);
      setSummary(summaryData);
      setTimeline(timelineData);

      console.log('✅ Analytics loaded successfully');
    } catch (error) {
      console.error('❌ Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshAnalytics = async () => {
    if (!currentUser?.user_id) return;

    try {
      setRefreshing(true);
      await loadAnalytics();
    } finally {
      setRefreshing(false);
    }
  };

  const getFilteredAndSortedTiles = (): TileAnalytics[] => {
    let filtered = [...analytics];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(tile =>
        tile.tile_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tile.tile_code.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortColumn) {
        case 'name':
          comparison = a.tile_name.localeCompare(b.tile_name);
          break;
        case 'stock':
          comparison = a.stock - b.stock;
          break;
        case 'scans':
          comparison = a.total_scans - b.total_scans;
          break;
      }

      return sortDirection === 'asc' ? comparison : -comparison;
    });

    return filtered;
  };

  const getStockStatusBadge = (tile: TileAnalytics) => {
    if (!tile.in_stock || tile.stock === 0) {
      return (
        <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium whitespace-nowrap">
          Out of Stock
        </span>
      );
    }
    if (tile.stock < 10) {
      return (
        <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium whitespace-nowrap">
          Low Stock ({tile.stock})
        </span>
      );
    }
    return (
      <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium whitespace-nowrap">
        In Stock ({tile.stock})
      </span>
    );
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-500" />;
      case 2:
        return <Medal className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400" />;
      case 3:
        return <Award className="w-5 h-5 sm:w-6 sm:h-6 text-orange-500" />;
      default:
        return <span className="text-base sm:text-lg font-bold text-gray-600">#{rank}</span>;
    }
  };

  const getRelativeTime = (dateString: string | null): string => {
    if (!dateString) return 'Never';

    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  };

  const handleSort = (column: 'name' | 'stock' | 'scans') => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('desc');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 px-4">
        <div className="text-center">
          <Loader className="w-10 h-10 sm:w-12 sm:h-12 animate-spin text-green-600 mx-auto mb-3 sm:mb-4" />
          <p className="text-sm sm:text-base text-gray-600">Loading stock analytics...</p>
        </div>
      </div>
    );
  }

  const filteredTiles = getFilteredAndSortedTiles();

  return (
    <div className="space-y-4 sm:space-y-6 px-3 sm:px-0">
      {/* Header - RESPONSIVE */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
        <div className="flex items-center gap-2 sm:gap-3">
          <BarChart3 className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Stock Analytics</h2>
            <p className="text-gray-600 text-xs sm:text-sm">Real-time inventory and scan tracking</p>
          </div>
        </div>
        <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
          <label className="flex items-center gap-2 text-xs sm:text-sm text-gray-700">
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
              className="rounded text-green-600 focus:ring-green-500"
            />
            <span className="hidden sm:inline">Auto-refresh</span>
            <span className="sm:hidden">Auto</span>
          </label>
          <button
            onClick={refreshAnalytics}
            disabled={refreshing}
            className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors text-sm sm:text-base"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>
      </div>

      {/* Summary Cards - RESPONSIVE */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 sm:p-5 lg:p-6 rounded-lg sm:rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-xs sm:text-sm font-medium">Total Stock</p>
              <p className="text-2xl sm:text-3xl font-bold mt-1">{summary.total_stock.toLocaleString()}</p>
              <p className="text-blue-100 text-xs mt-1">{summary.total_tiles} tiles</p>
            </div>
            <Package className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-blue-200 opacity-80" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 sm:p-5 lg:p-6 rounded-lg sm:rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-xs sm:text-sm font-medium">In Stock</p>
              <p className="text-2xl sm:text-3xl font-bold mt-1">{summary.in_stock_count}</p>
              <p className="text-green-100 text-xs mt-1">Available</p>
            </div>
            <CheckCircle className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-green-200 opacity-80" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white p-4 sm:p-5 lg:p-6 rounded-lg sm:rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-100 text-xs sm:text-sm font-medium">Low Stock</p>
              <p className="text-2xl sm:text-3xl font-bold mt-1">{summary.low_stock_count}</p>
              <p className="text-yellow-100 text-xs mt-1">Need restock</p>
            </div>
            <AlertTriangle className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-yellow-200 opacity-80" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-4 sm:p-5 lg:p-6 rounded-lg sm:rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-xs sm:text-sm font-medium">Total Scans</p>
              <p className="text-2xl sm:text-3xl font-bold mt-1">{summary.total_scans.toLocaleString()}</p>
              <p className="text-purple-100 text-xs mt-1">QR scans</p>
            </div>
            <QrCode className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-purple-200 opacity-80" />
          </div>
        </div>
      </div>

      {/* Top 10 Scanned Tiles - RESPONSIVE */}
      <div className="bg-white border border-gray-200 rounded-lg sm:rounded-xl p-4 sm:p-5 lg:p-6">
        <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
          <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
          <h3 className="text-lg sm:text-xl font-bold text-gray-800">Top 10 Most Scanned</h3>
        </div>

        {topTiles.length === 0 ? (
          <div className="text-center py-8 sm:py-12 text-gray-500">
            <QrCode className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-3 sm:mb-4" />
            <p className="font-medium text-sm sm:text-base">No scan data yet</p>
            <p className="text-xs sm:text-sm mt-2">Start scanning QR codes to see analytics</p>
          </div>
        ) : (
          <div className="space-y-2 sm:space-y-3">
            {topTiles.map((tile) => (
              <div
                key={tile.tile_id}
                className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 p-3 sm:p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                {/* Rank Icon */}
                <div className="flex-shrink-0 w-10 sm:w-12 flex justify-center">
                  {getRankIcon(tile.rank || 0)}
                </div>

                {/* Tile Image */}
                <img
                  src={tile.image_url || '/placeholder-tile.png'}
                  alt={tile.tile_name}
                  className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 object-cover rounded-lg border-2 border-gray-200 flex-shrink-0"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/placeholder-tile.png';
                  }}
                />

                {/* Tile Info */}
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-gray-900 text-sm sm:text-base truncate">{tile.tile_name}</h4>
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-1">
                    <span className="text-xs sm:text-sm text-gray-600">{tile.tile_code}</span>
                    <span className="text-xs sm:text-sm text-gray-400 hidden sm:inline">•</span>
                    <span className="text-xs sm:text-sm text-gray-600">{tile.size}</span>
                  </div>
                </div>

                {/* Scan Count */}
                <div className="text-left sm:text-right">
                  <div className="flex items-center gap-2 justify-start sm:justify-end">
                    <Eye className="w-4 h-4 text-green-600" />
                    <span className="text-xl sm:text-2xl font-bold text-green-600">
                      {tile.total_scans}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">scans</p>
                </div>

                {/* Progress Bar */}
                <div className="w-full sm:w-24 lg:w-32">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full transition-all"
                      style={{ width: `${tile.scan_percentage || 0}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 text-center mt-1">
                    {tile.scan_percentage}%
                  </p>
                </div>

                {/* Stock Badge */}
                <div className="flex-shrink-0">
                  {getStockStatusBadge(tile)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Scan Timeline - RESPONSIVE */}
      {timeline.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg sm:rounded-xl p-4 sm:p-5 lg:p-6">
          <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
            <h3 className="text-lg sm:text-xl font-bold text-gray-800">Last 7 Days Scan Activity</h3>
          </div>

          <div className="grid grid-cols-7 gap-1 sm:gap-2">
            {timeline.map((day) => {
              const maxScans = Math.max(...timeline.map(d => d.scans));
              const heightPercent = maxScans > 0 ? (day.scans / maxScans) * 100 : 0;

              return (
                <div key={day.date} className="text-center">
                  <div className="h-24 sm:h-32 flex items-end justify-center">
                    <div
                      className="w-full bg-green-500 rounded-t-lg transition-all hover:bg-green-600 cursor-pointer"
                      style={{ height: `${heightPercent}%`, minHeight: day.scans > 0 ? '10%' : '0' }}
                      title={`${day.scans} scans`}
                    />
                  </div>
                  <p className="text-xs sm:text-sm font-medium text-gray-700 mt-2">{day.day_name}</p>
                  <p className="text-xs text-gray-500">{day.scans}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* All Tiles Detail Table - RESPONSIVE */}
      <div className="bg-white border border-gray-200 rounded-lg sm:rounded-xl p-4 sm:p-5 lg:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 mb-3 sm:mb-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <Package className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
            <h3 className="text-lg sm:text-xl font-bold text-gray-800">All Tiles Stock Details</h3>
          </div>

          {/* Search */}
          <div className="relative w-full sm:w-auto">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search tiles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 w-full sm:w-64 text-sm"
            />
          </div>
        </div>

        <div className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">
          Showing {filteredTiles.length} of {analytics.length} tiles
        </div>

        <div className="overflow-x-auto -mx-4 sm:mx-0">
          <div className="inline-block min-w-full align-middle">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left p-2 sm:p-3 font-semibold text-gray-700 text-xs sm:text-sm">Image</th>
                  <th 
                    className="text-left p-2 sm:p-3 font-semibold text-gray-700 cursor-pointer hover:bg-gray-100 text-xs sm:text-sm"
                    onClick={() => handleSort('name')}
                  >
                    <div className="flex items-center gap-2">
                      <span className="hidden sm:inline">Tile Name</span>
                      <span className="sm:hidden">Name</span>
                      {sortColumn === 'name' && (
                        <span>{sortDirection === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </div>
                  </th>
                  <th className="text-left p-2 sm:p-3 font-semibold text-gray-700 text-xs sm:text-sm">Code</th>
                  <th className="text-left p-2 sm:p-3 font-semibold text-gray-700 text-xs sm:text-sm hidden md:table-cell">Size</th>
                  <th 
                    className="text-left p-2 sm:p-3 font-semibold text-gray-700 cursor-pointer hover:bg-gray-100 text-xs sm:text-sm"
                    onClick={() => handleSort('stock')}
                  >
                    <div className="flex items-center gap-2">
                      Stock
                      {sortColumn === 'stock' && (
                        <span>{sortDirection === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </div>
                  </th>
                  <th 
                    className="text-left p-2 sm:p-3 font-semibold text-gray-700 cursor-pointer hover:bg-gray-100 text-xs sm:text-sm"
                    onClick={() => handleSort('scans')}
                  >
                    <div className="flex items-center gap-2">
                      Scans
                      {sortColumn === 'scans' && (
                        <span>{sortDirection === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </div>
                  </th>
                  <th className="text-left p-2 sm:p-3 font-semibold text-gray-700 text-xs sm:text-sm hidden lg:table-cell">Last Scanned</th>
                  <th className="text-left p-2 sm:p-3 font-semibold text-gray-700 text-xs sm:text-sm hidden sm:table-cell">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredTiles.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center p-6 sm:p-8 text-gray-500">
                      <Search className="w-10 h-10 sm:w-12 sm:h-12 text-gray-300 mx-auto mb-3 sm:mb-4" />
                      <p className="font-medium text-sm sm:text-base">No tiles found</p>
                      <p className="text-xs sm:text-sm mt-2">Try adjusting your search</p>
                    </td>
                  </tr>
                ) : (
                  filteredTiles.map((tile) => (
                    <tr key={tile.tile_id} className="border-t border-gray-200 hover:bg-gray-50">
                      <td className="p-2 sm:p-3">
                        <img
                          src={tile.image_url || '/placeholder-tile.png'}
                          alt={tile.tile_name}
                          className="w-10 h-10 sm:w-12 sm:h-12 object-cover rounded-lg border border-gray-200"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/placeholder-tile.png';
                          }}
                        />
                      </td>
                      <td className="p-2 sm:p-3">
                        <div className="font-medium text-gray-900 text-xs sm:text-sm truncate max-w-[150px]">
                          {tile.tile_name}
                        </div>
                        <div className="text-xs text-gray-500 capitalize">{tile.category}</div>
                      </td>
                      <td className="p-2 sm:p-3 text-xs sm:text-sm text-gray-600 font-mono">
                        {tile.tile_code}
                      </td>
                      <td className="p-2 sm:p-3 text-xs sm:text-sm text-gray-600 hidden md:table-cell">
                        {tile.size}
                      </td>
                      <td className="p-2 sm:p-3">
                        <span className={`
                          px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-semibold
                          ${tile.stock === 0 ? 'bg-red-100 text-red-800' :
                            tile.stock < 10 ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }
                        `}>
                          {tile.stock}
                        </span>
                      </td>
                      <td className="p-2 sm:p-3">
                        <div className="flex items-center gap-1 sm:gap-2">
                          <Eye className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />
                          <span className={`
                            text-xs sm:text-sm font-semibold
                            ${tile.total_scans > 50 ? 'text-green-600' :
                              tile.total_scans > 10 ? 'text-blue-600' :
                              'text-gray-600'
                            }
                          `}>
                            {tile.total_scans}
                          </span>
                        </div>
                      </td>
                      <td className="p-2 sm:p-3 text-xs sm:text-sm text-gray-600 hidden lg:table-cell">
                        {getRelativeTime(tile.last_scanned)}
                      </td>
                      <td className="p-2 sm:p-3 hidden sm:table-cell">
                        {getStockStatusBadge(tile)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};