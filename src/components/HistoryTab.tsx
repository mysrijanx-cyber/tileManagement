
// console.log('✅ HistoryTab Component loaded - Production v3.0 (OPTIMIZED - NO DUPLICATES)'); 
import React, { useState, useEffect, useMemo, useCallback } from 'react';
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
import { getSellerSubscriptionHistory, getSellerHistoryStats, clearHistoryCache } from '../lib/historyService';
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
  
  // ✅ MEMOIZE FILTERS TO PREVENT UNNECESSARY RE-RENDERS
  const memoizedFilters = useMemo(() => filters, [filters.status, filters.dateRange, filters.planName]);
  
  // ═══════════════════════════════════════════════════════════════
  // ✅ OPTIMIZED DATA LOADING (NO DUPLICATES)
  // ═══════════════════════════════════════════════════════════════
  
  const loadHistory = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setLoading(true);
        setCurrentPage(1);
        setLastDoc(null);
        setHistoryItems([]);
        clearHistoryCache(currentUser?.user_id); // Clear cache on refresh
      } else {
        setLoadingMore(true);
      }
      
      setError(null);
      
      const result = await getSellerSubscriptionHistory(
        currentUser?.user_id || '',
        memoizedFilters,
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
  }, [currentUser?.user_id, memoizedFilters, lastDoc, pageSize]);
  
  const loadStats = useCallback(async () => {
    try {
      const statsData = await getSellerHistoryStats(currentUser?.user_id || '');
      setStats(statsData);
    } catch (error: any) {
      console.warn('⚠️ Could not load stats:', error);
    }
  }, [currentUser?.user_id]);
  
  // ✅ SINGLE useEffect - LOADS BOTH HISTORY & STATS (NO DUPLICATES)
  useEffect(() => {
    if (currentUser?.user_id) {
      console.log('🔄 [HISTORY TAB] Loading data...');
      
      // ✅ PARALLEL LOADING (FASTER)
      Promise.all([
        loadHistory(true),
        loadStats()
      ]).then(() => {
        console.log('✅ [HISTORY TAB] Data loaded');
      });
    }
  }, [currentUser?.user_id, memoizedFilters]); // ✅ Only re-run when sellerId or filters change
  
  // ═══════════════════════════════════════════════════════════════
  // ✅ HANDLERS
  // ═══════════════════════════════════════════════════════════════
  
  const handleRefresh = useCallback(() => {
    console.log('🔄 [REFRESH] Manual refresh triggered');
    clearHistoryCache(currentUser?.user_id);
    loadHistory(true);
    loadStats();
  }, [currentUser?.user_id, loadHistory, loadStats]);
  
  const handleLoadMore = useCallback(() => {
    if (hasMore && !loadingMore) {
      loadHistory(false);
      setCurrentPage(prev => prev + 1);
    }
  }, [hasMore, loadingMore, loadHistory]);
  
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
        return <CheckCircle className="w-4 h-4 sm:w-4 sm:h-4" />;
      case 'expired':
        return <XCircle className="w-4 h-4 sm:w-4 sm:h-4" />;
      case 'cancelled':
        return <AlertCircle className="w-4 h-4 sm:w-4 sm:h-4" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4 sm:w-4 sm:h-4" />;
      default:
        return <AlertCircle className="w-4 h-4 sm:w-4 sm:h-4" />;
    }
  };
  
  // ✅ MEMOIZED FILTERED ITEMS (PERFORMANCE OPTIMIZATION)
  const filteredItems = useMemo(() => {
    if (!searchTerm) return historyItems;
    
    const term = searchTerm.toLowerCase();
    return historyItems.filter(item =>
      item.plan_name.toLowerCase().includes(term) ||
      item.purchased_date.toLowerCase().includes(term) ||
      item.expired_date.toLowerCase().includes(term) ||
      item.status.toLowerCase().includes(term)
    );
  }, [historyItems, searchTerm]);
  
  // ═══════════════════════════════════════════════════════════════
  // ✅ RENDER
  // ═══════════════════════════════════════════════════════════════
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <RefreshCw className="w-10 h-10 sm:w-12 sm:h-12 animate-spin text-purple-600 mx-auto mb-4" />
          <p className="text-gray-600 text-base sm:text-lg font-medium">Loading history...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-5 sm:space-y-6">
      {/* ═══════════════════════════════════════════════════════════════
          ✨ HIGHLIGHTED HEADER SECTION - PERFECT FONT SIZES
          ═══════════════════════════════════════════════════════════════ */}
      <div className="relative bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-700 rounded-xl sm:rounded-2xl shadow-lg overflow-hidden">
        {/* Decorative Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-32 h-32 sm:w-48 sm:h-48 bg-white rounded-full -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 sm:w-36 sm:h-36 bg-white rounded-full translate-y-1/2 -translate-x-1/2"></div>
        </div>
        
        {/* Content */}
        <div className="relative z-10 p-5 sm:p-6 lg:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-4">
            {/* Left: Title & Description */}
            <div className="flex-1">
              <div className="flex items-center gap-3 sm:gap-3 mb-2 sm:mb-3">
                <div className="p-2.5 sm:p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                  <Clock className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-white" />
                </div>
                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight leading-tight">
                  Subscription History
                </h3>
              </div>
              <p className="text-purple-50 text-sm sm:text-base lg:text-lg ml-0 sm:ml-14 lg:ml-16 leading-relaxed font-medium">
                Track all your plan purchases, renewals, and subscription details
              </p>
            </div>
            
            {/* Right: Refresh Button */}
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="flex items-center justify-center gap-2 px-5 sm:px-6 lg:px-7 py-3 sm:py-3 bg-white/20 backdrop-blur-md border border-white/30 rounded-xl text-white hover:bg-white/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 text-base sm:text-base font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <RefreshCw className={`w-5 h-5 sm:w-5 sm:h-5 ${loading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
              <span className="sm:hidden">Sync</span>
            </button>
          </div>
        </div>
        
        {/* Bottom Accent Line */}
        <div className="h-1 bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500"></div>
      </div>
      
      {/* ═══════════════════════════════════════════════════════════════
          ✅ STATS CARDS - PROPER FONT SIZES
          ═══════════════════════════════════════════════════════════════ */}
      {stats && (
        <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:gap-6">
          {/* Total Plans Card */}
          <div className="group bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-200 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-7 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center gap-2 sm:gap-3 mb-3">
              <div className="p-2 sm:p-2.5 bg-purple-200 rounded-lg group-hover:bg-purple-300 transition-colors">
                <Package className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-purple-700" />
              </div>
              <span className="text-sm sm:text-base lg:text-lg text-purple-700 font-bold">
                Total Plans
              </span>
            </div>
            <p className="text-3xl sm:text-4xl lg:text-5xl font-bold text-purple-900 tracking-tight mb-1">
              {stats.total_plans_purchased || 0}
            </p>
            <p className="text-sm sm:text-base lg:text-lg text-purple-600 font-medium">
              Plans purchased
            </p>
          </div>
          
          {/* Total Spent Card */}
          <div className="group bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-200 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-7 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center gap-2 sm:gap-3 mb-3">
              <div className="p-2 sm:p-2.5 bg-green-200 rounded-lg group-hover:bg-green-300 transition-colors">
                <IndianRupee className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-green-700" />
              </div>
              <span className="text-sm sm:text-base lg:text-lg text-green-700 font-bold">
                Total Spent
              </span>
            </div>
            <p className="text-3xl sm:text-4xl lg:text-5xl font-bold text-green-900 tracking-tight mb-1">
              ₹{(stats.total_amount_spent || 0).toLocaleString('en-IN')}
            </p>
            <p className="text-sm sm:text-base lg:text-lg text-green-600 font-medium">
              Lifetime investment
            </p>
          </div>
        </div>
      )}
      
      {/* ═══════════════════════════════════════════════════════════════
          ✅ SEARCH BAR - PROPER FONT SIZE
          ═══════════════════════════════════════════════════════════════ */}
      <div className="relative">
        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
          <Search className="w-5 h-5 sm:w-5 sm:h-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search by plan name, date, or status..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-12 pr-12 py-3.5 sm:py-4 lg:py-4 w-full border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-base sm:text-base lg:text-lg transition-all shadow-sm focus:shadow-md bg-white placeholder:text-gray-400 font-medium"
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 p-1.5 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Clear search"
          >
            <XCircle className="w-5 h-5 text-gray-400 hover:text-gray-600" />
          </button>
        )}
      </div>
      
      {/* ═══════════════════════════════════════════════════════════════
          ✅ ERROR STATE - PROPER FONT SIZES
          ═══════════════════════════════════════════════════════════════ */}
      {error && (
        <div className="bg-gradient-to-r from-red-50 to-red-100 border-2 border-red-300 rounded-xl sm:rounded-2xl p-5 sm:p-6 flex items-start gap-3 sm:gap-4 shadow-md">
          <div className="p-2.5 bg-red-200 rounded-lg flex-shrink-0">
            <AlertCircle className="w-6 h-6 sm:w-7 sm:h-7 text-red-700" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-red-900 font-bold text-base sm:text-lg lg:text-xl mb-1.5">
              Error Loading History
            </p>
            <p className="text-red-800 text-sm sm:text-base lg:text-lg break-words leading-relaxed">
              {error}
            </p>
          </div>
          <button
            onClick={handleRefresh}
            className="px-4 sm:px-5 lg:px-6 py-2.5 sm:py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all text-sm sm:text-base font-bold flex-shrink-0 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 active:translate-y-0"
          >
            Retry
          </button>
        </div>
      )}
      
      {/* ═══════════════════════════════════════════════════════════════
          ✅ HISTORY LIST - PROPER FONT SIZES
          ═══════════════════════════════════════════════════════════════ */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl sm:rounded-2xl border-2 border-gray-200 shadow-inner">
          <div className="p-5 sm:p-6 bg-white rounded-full w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 mx-auto mb-5 sm:mb-6 shadow-lg">
            <Clock className="w-full h-full text-gray-300" />
          </div>
          <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-700 mb-3 sm:mb-4">
            No History Found
          </h3>
          <p className="text-gray-500 text-base sm:text-lg lg:text-xl px-4 max-w-2xl mx-auto leading-relaxed">
            {historyItems.length === 0
              ? "You haven't purchased any plans yet. Start by exploring our subscription plans!"
              : "No history matches your search criteria. Try adjusting your filters."}
          </p>
        </div>
      ) : (
        <>
          {/* ═══════════════════════════════════════════════════════════════
              ✅ DESKTOP TABLE - PROPER FONT SIZES
              ═══════════════════════════════════════════════════════════════ */}
          <div className="hidden lg:block">
            <div className="bg-white border-2 border-gray-200 rounded-2xl overflow-hidden shadow-lg">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-300">
                  <tr>
                    <th className="text-left px-6 py-5 font-bold text-gray-800 text-base lg:text-lg">
                      Plan Details
                    </th>
                    <th className="text-left px-6 py-5 font-bold text-gray-800 text-base lg:text-lg">
                      Purchase Date
                    </th>
                    <th className="text-left px-6 py-5 font-bold text-gray-800 text-base lg:text-lg">
                      Expiry Date
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredItems.map((item, index) => (
                    <tr 
                      key={item.id} 
                      className={`hover:bg-purple-50 transition-all duration-200 ${
                        index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                      }`}
                    >
                      <td className="px-6 py-6">
                        <div>
                          <div className="font-bold text-gray-900 text-lg mb-2.5 flex items-center gap-2">
                            <Package className="w-5 h-5 text-purple-600 flex-shrink-0" />
                            {item.plan_name}
                          </div>
                          <div className="text-base font-bold text-purple-700 mb-3 flex items-center gap-1">
                            <IndianRupee className="w-4 h-4" />
                            {item.plan_price.toLocaleString('en-IN')} {item.currency}
                          </div>
                          <span className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-sm font-bold border-2 ${getStatusColor(item.status)}`}>
                            {getStatusIcon(item.status)}
                            {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        <div className="space-y-1.5">
                          <div className="font-bold text-gray-900 text-base">
                            {item.purchased_date}
                          </div>
                          <div className="text-base text-gray-600 font-semibold">
                            {item.purchased_time}
                          </div>
                          <div className="text-sm text-gray-500 bg-gray-100 px-2.5 py-1 rounded inline-block font-medium">
                            {item.purchased_day}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        <div className="space-y-1.5">
                          <div className="font-bold text-gray-900 text-base">
                            {item.expired_date}
                          </div>
                          <div className="text-base text-gray-600 font-semibold">
                            {item.expired_time}
                          </div>
                          <div className="text-sm text-gray-500 bg-gray-100 px-2.5 py-1 rounded inline-block font-medium">
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
          
          {/* ═══════════════════════════════════════════════════════════════
              ✅ MOBILE/TABLET CARDS - PROPER FONT SIZES
              ═══════════════════════════════════════════════════════════════ */}
          <div className="lg:hidden space-y-4 sm:space-y-5">
            {filteredItems.map((item, index) => (
              <div 
                key={item.id} 
                className="bg-white border-2 border-gray-200 rounded-xl sm:rounded-2xl p-5 sm:p-6 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-3 mb-4 pb-4 border-b-2 border-gray-100">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Package className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600 flex-shrink-0" />
                      <h4 className="font-bold text-gray-900 text-base sm:text-lg truncate">
                        {item.plan_name}
                      </h4>
                    </div>
                    <p className="text-base sm:text-lg font-bold text-purple-700 flex items-center gap-1">
                      <IndianRupee className="w-4 h-4 sm:w-5 sm:h-5" />
                      {item.plan_price.toLocaleString('en-IN')}
                    </p>
                  </div>
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-bold border-2 flex-shrink-0 ${getStatusColor(item.status)}`}>
                    {getStatusIcon(item.status)}
                    <span className="hidden xs:inline">{item.status}</span>
                  </span>
                </div>
                
                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-4 sm:gap-5">
                  {/* Purchase Details */}
                  <div className="bg-blue-50 rounded-xl p-4 sm:p-5 border-2 border-blue-200">
                    <div className="text-blue-700 text-sm sm:text-base font-bold mb-2.5 flex items-center gap-1.5">
                      <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                      Purchased
                    </div>
                    <div className="font-bold text-gray-900 text-sm sm:text-base mb-1.5">
                      {item.purchased_date}
                    </div>
                    <div className="text-sm sm:text-base text-gray-600 font-semibold mb-1.5">
                      {item.purchased_time}
                    </div>
                    <div className="text-xs sm:text-sm text-blue-600 bg-blue-100 px-2.5 py-1 rounded inline-block font-medium">
                      {item.purchased_day}
                    </div>
                  </div>
                  
                  {/* Expiry Details */}
                  <div className="bg-orange-50 rounded-xl p-4 sm:p-5 border-2 border-orange-200">
                    <div className="text-orange-700 text-sm sm:text-base font-bold mb-2.5 flex items-center gap-1.5">
                      <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
                      Expires
                    </div>
                    <div className="font-bold text-gray-900 text-sm sm:text-base mb-1.5">
                      {item.expired_date}
                    </div>
                    <div className="text-sm sm:text-base text-gray-600 font-semibold mb-1.5">
                      {item.expired_time}
                    </div>
                    <div className="text-xs sm:text-sm text-orange-600 bg-orange-100 px-2.5 py-1 rounded inline-block font-medium">
                      {item.expired_day}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* ═══════════════════════════════════════════════════════════════
              ✅ PAGINATION - PROPER FONT SIZES
              ═══════════════════════════════════════════════════════════════ */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t-2 border-gray-200">
            <div className="text-base sm:text-lg text-gray-600 font-semibold order-2 sm:order-1">
              Showing <span className="font-bold text-purple-700">{filteredItems.length}</span> of{' '}
              <span className="font-bold text-purple-700">{totalItems}</span> total subscriptions
            </div>
            
            {hasMore && (
              <button
                onClick={handleLoadMore}
                disabled={loadingMore}
                className="flex items-center gap-2.5 px-6 sm:px-7 lg:px-8 py-3 sm:py-3.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 text-base sm:text-lg font-bold order-1 sm:order-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0 w-full sm:w-auto"
              >
                {loadingMore ? (
                  <RefreshCw className="w-5 h-5 animate-spin" />
                ) : (
                  <Package className="w-5 h-5" />
                )}
                {loadingMore ? 'Loading...' : 'Load More Plans'}
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default HistoryTab;

console.log('✅ HistoryTab Component loaded - Production v5.0 (PERFECT FONT SIZES - ALL DEVICES RESPONSIVE)');