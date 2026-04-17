
import React, { useState, useEffect } from 'react';
import {
  Clock,
  Package,
  RefreshCw,
  Search,
  CheckCircle,
  XCircle,
  AlertCircle,
  IndianRupee
} from 'lucide-react';
import { useAppStore } from '../stores/appStore';
import { getSellerSubscriptionHistory, getSellerHistoryStats } from '../lib/historyService';
import type { SubscriptionHistoryItem, HistoryFilters, HistoryStats } from '../types/history.types';

export const HistoryTab: React.FC = () => {
  const { currentUser } = useAppStore();
  
  // State
  const [historyItems, setHistoryItems] = useState<SubscriptionHistoryItem[]>([]);
  const [stats, setStats] = useState<HistoryStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [lastDoc, setLastDoc] = useState<any>(null);
  const [totalItems, setTotalItems] = useState(0);
  const pageSize = 10;
  
  // Filters
  const [filters, setFilters] = useState<HistoryFilters>({
    status: 'all'
  });
  const [searchTerm, setSearchTerm] = useState('');
  
  // ═══════════════════════════════════════════════════════════════
  // ✅ LOAD DATA
  // ═══════════════════════════════════════════════════════════════
  
  const loadHistory = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setLoading(true);
        setCurrentPage(1);
        setLastDoc(null);
        setHistoryItems([]);
      } else {
        setLoadingMore(true);
      }
      
      setError(null);
      
      const result = await getSellerSubscriptionHistory(
        currentUser?.user_id || '',
        filters,
        pageSize,
        isRefresh ? null : lastDoc
      );
      
      if (isRefresh) {
        setHistoryItems(result.items);
      } else {
        setHistoryItems(prev => [...prev, ...result.items]);
      }
      
      setHasMore(result.hasMore);
      setLastDoc(result.lastDoc);
      setTotalItems(result.total);
      
    } catch (error: any) {
      console.error('❌ Error loading history:', error);
      setError(error.message || 'Failed to load history');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };
  
  const loadStats = async () => {
    try {
      const statsData = await getSellerHistoryStats(currentUser?.user_id || '');
      setStats(statsData);
    } catch (error: any) {
      console.warn('⚠️ Could not load stats:', error);
    }
  };
  
  useEffect(() => {
    if (currentUser?.user_id) {
      loadHistory(true);
      loadStats();
    }
  }, [currentUser?.user_id, filters]);
  
  // ═══════════════════════════════════════════════════════════════
  // ✅ HANDLERS
  // ═══════════════════════════════════════════════════════════════
  
  const handleRefresh = () => {
    loadHistory(true);
    loadStats();
  };
  
  const handleLoadMore = () => {
    if (hasMore && !loadingMore) {
      loadHistory(false);
      setCurrentPage(prev => prev + 1);
    }
  };
  
  // ═══════════════════════════════════════════════════════════════
  // ✅ UTILITY FUNCTIONS
  // ═══════════════════════════════════════════════════════════════
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'expired':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'completed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" />;
      case 'expired':
        return <XCircle className="w-3 h-3 sm:w-4 sm:h-4" />;
      case 'cancelled':
        return <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4" />;
      case 'completed':
        return <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" />;
      default:
        return <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4" />;
    }
  };
  
  // Filter items by search term
  const filteredItems = historyItems.filter(item => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      item.plan_name.toLowerCase().includes(term) ||
      item.purchased_date.toLowerCase().includes(term) ||
      item.expired_date.toLowerCase().includes(term) ||
      item.status.toLowerCase().includes(term)
    );
  });
  
  // ═══════════════════════════════════════════════════════════════
  // ✅ RENDER
  // ═══════════════════════════════════════════════════════════════
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin text-purple-600 mx-auto mb-4" />
          <p className="text-gray-600 text-sm sm:text-base">Loading history...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-4 sm:space-y-6">
      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* HEADER */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div>
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 flex items-center gap-2">
            <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
            Subscription History
          </h3>
          <p className="text-gray-600 text-xs sm:text-sm mt-1">
            Track all your plan purchases and renewals
          </p>
        </div>
        
        <button
          onClick={handleRefresh}
          className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-sm font-medium"
        >
          <RefreshCw className="w-4 h-4" />
          <span className="hidden sm:inline">Refresh</span>
        </button>
      </div>
      
      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* STATS CARDS - ONLY TOTAL PLANS & TOTAL SPENT */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      
      {stats && (
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          {/* Total Plans */}
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 sm:p-4">
            <div className="flex items-center gap-2 mb-1 sm:mb-2">
              <Package className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600 flex-shrink-0" />
              <span className="text-xs sm:text-sm text-purple-600 font-medium">Total Plans</span>
            </div>
            <p className="text-xl sm:text-2xl font-bold text-purple-900">
              {stats.total_plans_purchased || 0}
            </p>
          </div>
          
          {/* Total Spent */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-3 sm:p-4">
            <div className="flex items-center gap-2 mb-1 sm:mb-2">
              <IndianRupee className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 flex-shrink-0" />
              <span className="text-xs sm:text-sm text-green-600 font-medium">Total Spent</span>
            </div>
            <p className="text-xl sm:text-2xl font-bold text-green-900">
              ₹{(stats.total_amount_spent || 0).toLocaleString()}
            </p>
          </div>
        </div>
      )}
      
      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* SEARCH */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      
      <div className="relative">
        <Search className="w-4 h-4 sm:w-5 sm:h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search by plan name, date, or status..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-9 sm:pl-10 pr-4 py-2.5 sm:py-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm sm:text-base transition-shadow"
        />
      </div>
      
      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* ERROR STATE */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="text-red-800 font-medium text-sm sm:text-base">Error Loading History</p>
            <p className="text-red-700 text-xs sm:text-sm mt-1 break-words">{error}</p>
          </div>
          <button
            onClick={handleRefresh}
            className="px-3 sm:px-4 py-1.5 sm:py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium flex-shrink-0"
          >
            Retry
          </button>
        </div>
      )}
      
      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* HISTORY LIST */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      
      {filteredItems.length === 0 ? (
        <div className="text-center py-8 sm:py-12 bg-gray-50 rounded-lg">
          <Clock className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-3 sm:mb-4" />
          <h3 className="text-base sm:text-lg font-semibold text-gray-600 mb-2">No History Found</h3>
          <p className="text-gray-500 text-sm sm:text-base px-4">
            {historyItems.length === 0 
              ? "You haven't purchased any plans yet."
              : "No history matches your search criteria."
            }
          </p>
        </div>
      ) : (
        <>
          {/* ═══════════════════════════════════════════════════════════════ */}
          {/* DESKTOP TABLE VIEW - SIMPLIFIED */}
          {/* ═══════════════════════════════════════════════════════════════ */}
          
          <div className="hidden lg:block">
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left px-6 py-4 font-semibold text-gray-700 text-sm">
                      Plan Details
                    </th>
                    <th className="text-left px-6 py-4 font-semibold text-gray-700 text-sm">
                      Purchase Date
                    </th>
                    <th className="text-left px-6 py-4 font-semibold text-gray-700 text-sm">
                      Expiry Date
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredItems.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-semibold text-gray-900 text-sm mb-1">
                            {item.plan_name}
                          </div>
                          <div className="text-sm text-gray-600 mb-2">
                            ₹{item.plan_price.toLocaleString()} {item.currency}
                          </div>
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(item.status)}`}>
                            {getStatusIcon(item.status)}
                            {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-medium text-gray-900 text-sm">
                            {item.purchased_date}
                          </div>
                          <div className="text-sm text-gray-600 mt-1">
                            {item.purchased_time}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {item.purchased_day}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-medium text-gray-900 text-sm">
                            {item.expired_date}
                          </div>
                          <div className="text-sm text-gray-600 mt-1">
                            {item.expired_time}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {item.expired_day}
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          {/* ═══════════════════════════════════════════════════════════════ */}
          {/* MOBILE/TABLET CARD VIEW - SIMPLIFIED */}
          {/* ═══════════════════════════════════════════════════════════════ */}
          
          <div className="lg:hidden space-y-3 sm:space-y-4">
            {filteredItems.map((item) => (
              <div key={item.id} className="bg-white border border-gray-200 rounded-lg p-3 sm:p-4 shadow-sm">
                {/* Header */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="min-w-0 flex-1">
                    <h4 className="font-semibold text-gray-900 text-sm sm:text-base truncate">
                      {item.plan_name}
                    </h4>
                    <p className="text-sm text-gray-600 mt-0.5">
                      ₹{item.plan_price.toLocaleString()}
                    </p>
                  </div>
                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border flex-shrink-0 ${getStatusColor(item.status)}`}>
                    {getStatusIcon(item.status)}
                    <span className="hidden sm:inline">{item.status}</span>
                  </span>
                </div>
                
                {/* Date Information */}
                <div className="grid grid-cols-2 gap-3 sm:gap-4 text-sm">
                  <div>
                    <div className="text-gray-600 text-xs sm:text-sm font-medium mb-1">
                      Purchased
                    </div>
                    <div className="font-medium text-gray-900 text-sm">
                      {item.purchased_date}
                    </div>
                    <div className="text-xs text-gray-600 mt-0.5">
                      {item.purchased_time}
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5">
                      {item.purchased_day}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-600 text-xs sm:text-sm font-medium mb-1">
                      Expires
                    </div>
                    <div className="font-medium text-gray-900 text-sm">
                      {item.expired_date}
                    </div>
                    <div className="text-xs text-gray-600 mt-0.5">
                      {item.expired_time}
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5">
                      {item.expired_day}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* ═══════════════════════════════════════════════════════════════ */}
          {/* PAGINATION */}
          {/* ═══════════════════════════════════════════════════════════════ */}
          
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-gray-200">
            <div className="text-sm text-gray-600 order-2 sm:order-1">
              Showing {filteredItems.length} of {totalItems} total subscriptions
            </div>
            
            {hasMore && (
              <button
                onClick={handleLoadMore}
                disabled={loadingMore}
                className="flex items-center gap-2 px-4 sm:px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium order-1 sm:order-2"
              >
                {loadingMore ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Package className="w-4 h-4" />
                )}
                {loadingMore ? 'Loading...' : 'Load More'}
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default HistoryTab;

console.log('✅ HistoryTab Component loaded - Production v2.0 (Simplified)');