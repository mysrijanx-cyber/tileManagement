
import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Eye, MousePointer, Calendar } from 'lucide-react';
import { useAppStore } from '../stores/appStore';
import { getTileAnalytics, getMostViewedTiles, getMostTriedTiles } from '../lib/firebaseutils';

interface AnalyticsData {
  tile_id: string;
  tile_name: string;
  view_count: number;
  apply_count: number;
  last_viewed: string;
  category: string;
}

interface AnalyticsDashboardProps {
  sellerId?: string;
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ sellerId }) => {
  const { currentShowroom } = useAppStore();
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData[]>([]);
  const [mostViewed, setMostViewed] = useState<any[]>([]);
  const [mostTried, setMostTried] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState('7d');

  useEffect(() => {
    if (currentShowroom) {
      loadAnalytics();
    }
  }, [currentShowroom, timeFilter]);

  const loadAnalytics = async () => {
    if (!currentShowroom) return;
    
    setLoading(true);
    try {
      let analytics, viewed, tried;
      
      if (sellerId) {
        // Seller-specific analytics
        [analytics, viewed, tried] = await Promise.all([
          getTileAnalytics(currentShowroom.id),
          getMostViewedTiles(currentShowroom.id, 10),
          getMostTriedTiles(currentShowroom.id, 10)
        ]);
        
        // Filter for seller's tiles only
        analytics = analytics?.filter((item: any) => 
          currentShowroom.tiles.some(tile => tile.id === item.tile_id && tile.showroomId === currentShowroom.id)
        ) || [];
      } else {
        // Admin view - all analytics
        [analytics, viewed, tried] = await Promise.all([
          getTileAnalytics(currentShowroom.id),
          getMostViewedTiles(currentShowroom.id, 10),
          getMostTriedTiles(currentShowroom.id, 10)
        ]);
      }
      
      setAnalyticsData(analytics || []);
      setMostViewed(viewed || []);
      setMostTried(tried || []);
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const totalViews = analyticsData.reduce((sum, item) => sum + item.view_count, 0);
  const totalApplications = analyticsData.reduce((sum, item) => sum + item.apply_count, 0);
  const conversionRate = totalViews > 0 ? ((totalApplications / totalViews) * 100).toFixed(1) : '0';

  if (loading) {
    return (
      <div className="flex items-center justify-center h-40 sm:h-64">
        <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-3 sm:p-4 md:p-6 rounded-lg sm:rounded-xl">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-blue-100 text-xs sm:text-sm truncate">Total Views</p>
              <p className="text-lg sm:text-xl md:text-2xl font-bold truncate">{totalViews.toLocaleString()}</p>
            </div>
            <Eye className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-blue-200 flex-shrink-0 ml-2" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-3 sm:p-4 md:p-6 rounded-lg sm:rounded-xl">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-green-100 text-xs sm:text-sm truncate">Total Apps</p>
              <p className="text-lg sm:text-xl md:text-2xl font-bold truncate">{totalApplications.toLocaleString()}</p>
            </div>
            <MousePointer className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-green-200 flex-shrink-0 ml-2" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-3 sm:p-4 md:p-6 rounded-lg sm:rounded-xl">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-purple-100 text-xs sm:text-sm truncate">Conv. Rate</p>
              <p className="text-lg sm:text-xl md:text-2xl font-bold truncate">{conversionRate}%</p>
            </div>
            <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-purple-200 flex-shrink-0 ml-2" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-3 sm:p-4 md:p-6 rounded-lg sm:rounded-xl">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-orange-100 text-xs sm:text-sm truncate">Active Tiles</p>
              <p className="text-lg sm:text-xl md:text-2xl font-bold truncate">{currentShowroom?.tiles.length || 0}</p>
            </div>
            <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-orange-200 flex-shrink-0 ml-2" />
          </div>
        </div>
      </div>

      {/* Time Filter */}
      <div className="flex flex-col xs:flex-row items-start xs:items-center gap-2 sm:gap-4">
        <div className="flex items-center gap-2">
          <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500 flex-shrink-0" />
          <span className="text-xs sm:text-sm font-medium text-gray-700 whitespace-nowrap">Time Period:</span>
        </div>
        <select
          value={timeFilter}
          onChange={(e) => setTimeFilter(e.target.value)}
          className="w-full xs:w-auto px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-xs sm:text-sm"
        >
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          <option value="90d">Last 90 days</option>
          <option value="1y">Last year</option>
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Most Viewed Tiles */}
        <div className="bg-white border border-gray-200 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6">
          <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <Eye className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 flex-shrink-0" />
            <h3 className="text-sm sm:text-base md:text-lg font-semibold text-gray-800 truncate">Most Viewed Tiles</h3>
          </div>
          <div className="space-y-2 sm:space-y-3">
            {mostViewed.length > 0 ? (
              mostViewed.map((tile, index) => (
                <div key={tile.tile_id} className="flex items-center justify-between p-2 sm:p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                    <span className="flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 bg-blue-100 text-blue-600 rounded-full text-xs sm:text-sm font-medium flex-shrink-0">
                      {index + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-gray-800 text-xs sm:text-sm truncate">{tile.tile_name}</p>
                      <p className="text-xs text-gray-600 truncate">{tile.category}</p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0 ml-2">
                    <p className="font-semibold text-blue-600 text-xs sm:text-sm">{tile.view_count}</p>
                    <p className="text-xs text-gray-500">views</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-6 sm:py-8 text-xs sm:text-sm">No data available</p>
            )}
          </div>
        </div>

        {/* Most Tried Tiles */}
        <div className="bg-white border border-gray-200 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6">
          <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <MousePointer className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 flex-shrink-0" />
            <h3 className="text-sm sm:text-base md:text-lg font-semibold text-gray-800 truncate">Most Applied Tiles</h3>
          </div>
          <div className="space-y-2 sm:space-y-3">
            {mostTried.length > 0 ? (
              mostTried.map((tile, index) => (
                <div key={tile.tile_id} className="flex items-center justify-between p-2 sm:p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                    <span className="flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 bg-green-100 text-green-600 rounded-full text-xs sm:text-sm font-medium flex-shrink-0">
                      {index + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-gray-800 text-xs sm:text-sm truncate">{tile.tile_name}</p>
                      <p className="text-xs text-gray-600 truncate">{tile.category}</p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0 ml-2">
                    <p className="font-semibold text-green-600 text-xs sm:text-sm">{tile.apply_count}</p>
                    <p className="text-xs text-gray-500">applications</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-6 sm:py-8 text-xs sm:text-sm">No data available</p>
            )}
          </div>
        </div>
      </div>

      {/* Detailed Analytics Table */}
      <div className="bg-white border border-gray-200 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6">
        <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
          <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600 flex-shrink-0" />
          <h3 className="text-sm sm:text-base md:text-lg font-semibold text-gray-800 truncate">Detailed Tile Analytics</h3>
        </div>
        <div className="overflow-x-auto -mx-3 sm:mx-0">
          <div className="inline-block min-w-full align-middle">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left p-2 sm:p-3 font-semibold text-xs sm:text-sm">Tile Name</th>
                  <th className="text-left p-2 sm:p-3 font-semibold text-xs sm:text-sm hidden md:table-cell">Category</th>
                  <th className="text-left p-2 sm:p-3 font-semibold text-xs sm:text-sm">Views</th>
                  <th className="text-left p-2 sm:p-3 font-semibold text-xs sm:text-sm hidden sm:table-cell">Apps</th>
                  <th className="text-left p-2 sm:p-3 font-semibold text-xs sm:text-sm hidden lg:table-cell">Conversion</th>
                  <th className="text-left p-2 sm:p-3 font-semibold text-xs sm:text-sm hidden xl:table-cell">Last Viewed</th>
                </tr>
              </thead>
              <tbody>
                {analyticsData.length > 0 ? (
                  analyticsData.map((tile) => {
                    const conversion = tile.view_count > 0 ? ((tile.apply_count / tile.view_count) * 100).toFixed(1) : '0';
                    return (
                      <tr key={tile.tile_id} className="border-t hover:bg-gray-50">
                        <td className="p-2 sm:p-3 font-medium text-xs sm:text-sm">
                          <div className="max-w-[120px] sm:max-w-[200px] truncate">{tile.tile_name}</div>
                          <div className="md:hidden mt-1">
                            <span className={`px-2 py-0.5 rounded-full text-xs ${
                              tile.category === 'floor' ? 'bg-blue-100 text-blue-800' :
                              tile.category === 'wall' ? 'bg-purple-100 text-purple-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {tile.category}
                            </span>
                          </div>
                        </td>
                        <td className="p-2 sm:p-3 hidden md:table-cell">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            tile.category === 'floor' ? 'bg-blue-100 text-blue-800' :
                            tile.category === 'wall' ? 'bg-purple-100 text-purple-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {tile.category}
                          </span>
                        </td>
                        <td className="p-2 sm:p-3 text-xs sm:text-sm">{tile.view_count}</td>
                        <td className="p-2 sm:p-3 text-xs sm:text-sm hidden sm:table-cell">{tile.apply_count}</td>
                        <td className="p-2 sm:p-3 hidden lg:table-cell">
                          <span className={`font-medium text-xs sm:text-sm ${
                            parseFloat(conversion) > 10 ? 'text-green-600' :
                            parseFloat(conversion) > 5 ? 'text-yellow-600' :
                            'text-red-600'
                          }`}>
                            {conversion}%
                          </span>
                        </td>
                        <td className="p-2 sm:p-3 text-xs sm:text-sm text-gray-600 hidden xl:table-cell">
                          {new Date(tile.last_viewed).toLocaleDateString()}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={6} className="p-6 sm:p-8 text-center text-gray-500 text-xs sm:text-sm">
                      No analytics data available yet. Start using the application to see insights.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
