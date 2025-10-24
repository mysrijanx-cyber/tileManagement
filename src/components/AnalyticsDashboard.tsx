

import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Eye, MousePointer, Calendar, Filter } from 'lucide-react';
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
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Total Views</p>
              <p className="text-2xl font-bold">{totalViews.toLocaleString()}</p>
            </div>
            <Eye className="w-8 h-8 text-blue-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Total Applications</p>
              <p className="text-2xl font-bold">{totalApplications.toLocaleString()}</p>
            </div>
            <MousePointer className="w-8 h-8 text-green-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Conversion Rate</p>
              <p className="text-2xl font-bold">{conversionRate}%</p>
            </div>
            <TrendingUp className="w-8 h-8 text-purple-200" />
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm">Active Tiles</p>
              <p className="text-2xl font-bold">{currentShowroom?.tiles.length || 0}</p>
            </div>
            <BarChart3 className="w-8 h-8 text-orange-200" />
          </div>
        </div>
      </div>

      {/* Time Filter */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">Time Period:</span>
        </div>
        <select
          value={timeFilter}
          onChange={(e) => setTimeFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
        >
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          <option value="90d">Last 90 days</option>
          <option value="1y">Last year</option>
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Most Viewed Tiles */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <Eye className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-800">Most Viewed Tiles</h3>
          </div>
          <div className="space-y-3">
            {mostViewed.length > 0 ? (
              mostViewed.map((tile, index) => (
                <div key={tile.tile_id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-600 rounded-full text-sm font-medium">
                      {index + 1}
                    </span>
                    <div>
                      <p className="font-medium text-gray-800">{tile.tile_name}</p>
                      <p className="text-sm text-gray-600">{tile.category}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-blue-600">{tile.view_count}</p>
                    <p className="text-xs text-gray-500">views</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-8">No data available</p>
            )}
          </div>
        </div>

        {/* Most Tried Tiles */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <MousePointer className="w-5 h-5 text-green-600" />
            <h3 className="text-lg font-semibold text-gray-800">Most Applied Tiles</h3>
          </div>
          <div className="space-y-3">
            {mostTried.length > 0 ? (
              mostTried.map((tile, index) => (
                <div key={tile.tile_id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center justify-center w-6 h-6 bg-green-100 text-green-600 rounded-full text-sm font-medium">
                      {index + 1}
                    </span>
                    <div>
                      <p className="font-medium text-gray-800">{tile.tile_name}</p>
                      <p className="text-sm text-gray-600">{tile.category}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-green-600">{tile.apply_count}</p>
                    <p className="text-xs text-gray-500">applications</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-8">No data available</p>
            )}
          </div>
        </div>
      </div>

      {/* Detailed Analytics Table */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <BarChart3 className="w-5 h-5 text-purple-600" />
          <h3 className="text-lg font-semibold text-gray-800">Detailed Tile Analytics</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left p-3 font-semibold">Tile Name</th>
                <th className="text-left p-3 font-semibold">Category</th>
                <th className="text-left p-3 font-semibold">Views</th>
                <th className="text-left p-3 font-semibold">Applications</th>
                <th className="text-left p-3 font-semibold">Conversion</th>
                <th className="text-left p-3 font-semibold">Last Viewed</th>
              </tr>
            </thead>
            <tbody>
              {analyticsData.length > 0 ? (
                analyticsData.map((tile) => {
                  const conversion = tile.view_count > 0 ? ((tile.apply_count / tile.view_count) * 100).toFixed(1) : '0';
                  return (
                    <tr key={tile.tile_id} className="border-t hover:bg-gray-50">
                      <td className="p-3 font-medium">{tile.tile_name}</td>
                      <td className="p-3">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          tile.category === 'floor' ? 'bg-blue-100 text-blue-800' :
                          tile.category === 'wall' ? 'bg-purple-100 text-purple-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {tile.category}
                        </span>
                      </td>
                      <td className="p-3">{tile.view_count}</td>
                      <td className="p-3">{tile.apply_count}</td>
                      <td className="p-3">
                        <span className={`font-medium ${
                          parseFloat(conversion) > 10 ? 'text-green-600' :
                          parseFloat(conversion) > 5 ? 'text-yellow-600' :
                          'text-red-600'
                        }`}>
                          {conversion}%
                        </span>
                      </td>
                      <td className="p-3 text-sm text-gray-600">
                        {new Date(tile.last_viewed).toLocaleDateString()}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-500">
                    No analytics data available yet. Start using the application to see insights.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};