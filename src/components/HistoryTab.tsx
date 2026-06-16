
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
import { getSellerSubscription } from '../lib/subscriptionService';
import type { SubscriptionHistoryItem, HistoryFilters, HistoryStats } from '../types/history.types';
import type { Subscription } from '../types/payment.types';

export const HistoryTab: React.FC = () => {
  const { currentUser } = useAppStore();
  
  // ═══════════════════════════════════════════════════════════════
  // STATE
  // ═══════════════════════════════════════════════════════════════
  
  const [historyItems, setHistoryItems] = useState<SubscriptionHistoryItem[]>([]);
  const [stats, setStats] = useState<HistoryStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Current active subscription
  const [currentActiveSubscription, setCurrentActiveSubscription] = useState<Subscription | null>(null);
  
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
  // MEMOIZED FILTERS
  // ═══════════════════════════════════════════════════════════════
  
  const memoizedFilters = useMemo(() => filters, [filters.status, filters.dateRange, filters.planName]);
  
  // ═══════════════════════════════════════════════════════════════
  // ✅ UTILITY: NORMALIZE DATE TO YYYY-MM-DD (NO TIME)
  // ═══════════════════════════════════════════════════════════════
  
  const normalizeDateString = useCallback((dateInput: string | Date): string => {
    try {
      let date: Date;
      
      if (typeof dateInput === 'string') {
        // Handle DD/MM/YYYY format
        if (dateInput.includes('/')) {
          const parts = dateInput.split('/');
          if (parts.length === 3) {
            const [day, month, year] = parts;
            date = new Date(`${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`);
          } else {
            date = new Date(dateInput);
          }
        }
        // Handle YYYY-MM-DD or ISO format
        else if (dateInput.includes('-')) {
          const parts = dateInput.split('-');
          if (parts[0].length === 4) {
            // YYYY-MM-DD or ISO
            date = new Date(dateInput);
          } else {
            // DD-MM-YYYY
            date = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
          }
        }
        // Fallback
        else {
          date = new Date(dateInput);
        }
      } else {
        date = dateInput;
      }
      
      // Validate
      if (isNaN(date.getTime())) {
        console.error('❌ Invalid date:', dateInput);
        return '';
      }
      
      // Return YYYY-MM-DD format
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      
      return `${year}-${month}-${day}`;
      
    } catch (error) {
      console.error('❌ Error normalizing date:', dateInput, error);
      return '';
    }
  }, []);
  
  // ═══════════════════════════════════════════════════════════════
  // ✅ LOAD CURRENT ACTIVE SUBSCRIPTION
  // ═══════════════════════════════════════════════════════════════
  
  const loadCurrentSubscription = useCallback(async () => {
    try {
      console.log('🔍 [CURRENT SUB] Fetching current active subscription...');
      const activeSub = await getSellerSubscription(currentUser?.user_id || '', true);
      
      if (activeSub) {
        console.log('✅ [CURRENT SUB] Found subscription:', {
          id: activeSub.id,
          status: activeSub.status,
          plan_id: activeSub.plan_id,
          start: normalizeDateString(activeSub.start_date),
          end: normalizeDateString(activeSub.end_date)
        });
        setCurrentActiveSubscription(activeSub);
      } else {
        console.log('ℹ️ [CURRENT SUB] No subscription found');
        setCurrentActiveSubscription(null);
      }
    } catch (error) {
      console.warn('⚠️ [CURRENT SUB] Error loading:', error);
      setCurrentActiveSubscription(null);
    }
  }, [currentUser?.user_id, normalizeDateString]);
  
  // ═══════════════════════════════════════════════════════════════
  // ✅ CALCULATE STATUS - TRIPLE VERIFICATION
  // ═══════════════════════════════════════════════════════════════
  
  const calculateItemStatus = useCallback((item: SubscriptionHistoryItem): 'active' | 'expired' => {
    try {
      // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      // STEP 1: Check if any active subscription exists
      // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      if (!currentActiveSubscription) {
        console.log('❌ [STATUS] No active subscription - ALL expired');
        return 'expired';
      }
      
      // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      // STEP 2: Verify current subscription is actually active
      // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      const now = new Date();
      const currentEndDate = new Date(currentActiveSubscription.end_date);
      
      if (currentActiveSubscription.status !== 'active' || currentEndDate < now) {
        console.log('❌ [STATUS] Current subscription not truly active:', {
          status: currentActiveSubscription.status,
          expired: currentEndDate < now
        });
        return 'expired';
      }
      
      // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      // STEP 3: Normalize dates for comparison
      // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      const itemStartDate = normalizeDateString(item.purchased_date);
      const itemEndDate = normalizeDateString(item.expired_date);
      
      const currentStartDate = normalizeDateString(currentActiveSubscription.start_date);
      const currentEndDateNorm = normalizeDateString(currentActiveSubscription.end_date);
      
      console.log('📅 [COMPARE]', item.plan_name, {
        item: { start: itemStartDate, end: itemEndDate },
        current: { start: currentStartDate, end: currentEndDateNorm }
      });
      
      // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      // STEP 4: Match by start AND end date
      // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      const datesMatch = (
        itemStartDate === currentStartDate &&
        itemEndDate === currentEndDateNorm
      );
      
      if (datesMatch) {
        console.log('✅ [STATUS] ACTIVE -', item.plan_name, '(Dates match current subscription)');
        return 'active';
      }
      
      // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      // STEP 5: Fallback - Check if subscription_id matches (if available)
      // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      if ((item as any).subscription_id && currentActiveSubscription.id) {
        if ((item as any).subscription_id === currentActiveSubscription.id) {
          console.log('✅ [STATUS] ACTIVE -', item.plan_name, '(ID match)');
          return 'active';
        }
      }
      
      // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      // STEP 6: Not the current subscription
      // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      console.log('❌ [STATUS] EXPIRED -', item.plan_name, '(Different subscription period)');
      return 'expired';
      
    } catch (error) {
      console.error('❌ [STATUS] Error for', item.plan_name, error);
      return 'expired';
    }
  }, [currentActiveSubscription, normalizeDateString]);
  
  // ═══════════════════════════════════════════════════════════════
  // STATUS HELPER FUNCTIONS
  // ═══════════════════════════════════════════════════════════════
  
  const getStatusColor = useCallback((status: 'active' | 'expired'): string => {
    return status === 'active' 
      ? 'bg-green-100 text-green-800 border-green-300'
      : 'bg-red-100 text-red-800 border-red-300';
  }, []);
  
  const getStatusIcon = useCallback((status: 'active' | 'expired') => {
    return status === 'active'
      ? <CheckCircle className="w-4 h-4 sm:w-4 sm:h-4" />
      : <XCircle className="w-4 h-4 sm:w-4 sm:h-4" />;
  }, []);
  
  const getStatusLabel = useCallback((status: 'active' | 'expired'): string => {
    return status === 'active' ? 'ACTIVE' : 'EXPIRED';
  }, []);
  
  // ═══════════════════════════════════════════════════════════════
  // DATA LOADING
  // ═══════════════════════════════════════════════════════════════
  
  const loadHistory = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setLoading(true);
        setCurrentPage(1);
        setLastDoc(null);
        setHistoryItems([]);
        clearHistoryCache(currentUser?.user_id);
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
      
      console.log('✅ [HISTORY] Loaded', result.items.length, 'items');
      
    } catch (error: any) {
      console.error('❌ [HISTORY] Error loading:', error);
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
      console.log('✅ [STATS] Loaded');
    } catch (error: any) {
      console.warn('⚠️ [STATS] Error:', error);
    }
  }, [currentUser?.user_id]);
  
  // ═══════════════════════════════════════════════════════════════
  // ✅ CRITICAL: LOAD CURRENT SUBSCRIPTION FIRST, THEN HISTORY
  // ═══════════════════════════════════════════════════════════════
  
  useEffect(() => {
    if (currentUser?.user_id) {
      console.log('🔄 [INIT] Loading all data...');
      
      // STEP 1: Load current subscription FIRST
      loadCurrentSubscription().then(() => {
        console.log('✅ [INIT] Current subscription loaded, now loading history...');
        
        // STEP 2: Then load history & stats
        Promise.all([
          loadHistory(true),
          loadStats()
        ]).then(() => {
          console.log('✅ [INIT] All data loaded successfully');
        });
      });
    }
  }, [currentUser?.user_id, memoizedFilters]);
  
  // ═══════════════════════════════════════════════════════════════
  // HANDLERS
  // ═══════════════════════════════════════════════════════════════
  
  const handleRefresh = useCallback(() => {
    console.log('🔄 [REFRESH] Manual refresh triggered');
    clearHistoryCache(currentUser?.user_id);
    
    // Reload current subscription first, then history
    loadCurrentSubscription().then(() => {
      Promise.all([
        loadHistory(true),
        loadStats()
      ]);
    });
  }, [currentUser?.user_id, loadCurrentSubscription, loadHistory, loadStats]);
  
  const handleLoadMore = useCallback(() => {
    if (hasMore && !loadingMore) {
      loadHistory(false);
      setCurrentPage(prev => prev + 1);
    }
  }, [hasMore, loadingMore, loadHistory]);
  
  // ═══════════════════════════════════════════════════════════════
  // MEMOIZED FILTERED ITEMS
  // ═══════════════════════════════════════════════════════════════
  
  const filteredItems = useMemo(() => {
    if (!searchTerm) return historyItems;
    
    const term = searchTerm.toLowerCase();
    return historyItems.filter(item =>
      item.plan_name.toLowerCase().includes(term) ||
      item.purchased_date.toLowerCase().includes(term) ||
      item.expired_date.toLowerCase().includes(term)
    );
  }, [historyItems, searchTerm]);
  
  // ═══════════════════════════════════════════════════════════════
  // UTILITY FUNCTIONS
  // ═══════════════════════════════════════════════════════════════
  
  const formatDate = (dateStr: string): string => {
    try {
      let date: Date;
      
      if (dateStr.includes('/')) {
        const [day, month, year] = dateStr.split('/');
        date = new Date(`${year}-${month}-${day}`);
      } else {
        date = new Date(dateStr);
      }
      
      if (isNaN(date.getTime())) return dateStr;
      
      return date.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
    } catch (error) {
      return dateStr;
    }
  };
  
  // ═══════════════════════════════════════════════════════════════
  // RENDER - LOADING STATE
  // ═══════════════════════════════════════════════════════════════
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 sm:h-96">
        <div className="text-center">
          <RefreshCw className="w-10 h-10 sm:w-12 sm:h-12 animate-spin text-purple-600 mx-auto mb-4" />
          <p className="text-gray-600 text-base sm:text-lg font-medium">Loading history...</p>
        </div>
      </div>
    );
  }
  
  // ═══════════════════════════════════════════════════════════════
  // RENDER - MAIN UI
  // ═══════════════════════════════════════════════════════════════
  
  return (
    <div className="space-y-5 sm:space-y-6">
      
      {/* ═══════════════════════════════════════════════════════════
          HEADER - FULLY RESPONSIVE
          ═══════════════════════════════════════════════════════════ */}
      
      <div className="relative bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-700 rounded-xl sm:rounded-2xl shadow-lg overflow-hidden">
        {/* Decorative Background */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-32 h-32 sm:w-48 sm:h-48 bg-white rounded-full -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 sm:w-36 sm:h-36 bg-white rounded-full translate-y-1/2 -translate-x-1/2"></div>
        </div>
        
        {/* Content */}
        <div className="relative z-10 p-5 sm:p-6 lg:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            
            {/* Left: Title & Description */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2 sm:mb-3">
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
              className="flex items-center justify-center gap-2 px-5 sm:px-6 lg:px-7 py-3 bg-white/20 backdrop-blur-md border border-white/30 rounded-xl text-white hover:bg-white/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 text-base font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
              <span className="sm:hidden">Sync</span>
            </button>
          </div>
        </div>
        
        {/* Bottom Accent Line */}
        <div className="h-1 bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500"></div>
      </div>
      
      {/* ═══════════════════════════════════════════════════════════
          STATS CARDS - RESPONSIVE GRID
          ═══════════════════════════════════════════════════════════ */}
      
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
      
      {/* ═══════════════════════════════════════════════════════════
          SEARCH BAR - RESPONSIVE
          ═══════════════════════════════════════════════════════════ */}
      
      <div className="relative">
        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
          <Search className="w-5 h-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search by plan name, date, or status..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-12 pr-12 py-3.5 sm:py-4 w-full border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-base sm:text-base lg:text-lg transition-all shadow-sm focus:shadow-md bg-white placeholder:text-gray-400 font-medium"
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
      
      {/* ═══════════════════════════════════════════════════════════
          ERROR STATE
          ═══════════════════════════════════════════════════════════ */}
      
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
      
      {/* ═══════════════════════════════════════════════════════════
          EMPTY STATE
          ═══════════════════════════════════════════════════════════ */}
      
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
          {/* ═══════════════════════════════════════════════════════════
              DESKTOP TABLE - LARGE SCREENS
              ═══════════════════════════════════════════════════════════ */}
          
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
                  {filteredItems.map((item, index) => {
                    // ✅ CALCULATE STATUS
                    const displayStatus = calculateItemStatus(item);
                    
                    return (
                      <tr 
                        key={`${item.id}-${index}`}
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
                            
                            {/* ✅ STATUS BADGE */}
                            <span className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-sm font-bold border-2 ${getStatusColor(displayStatus)}`}>
                              {getStatusIcon(displayStatus)}
                              {getStatusLabel(displayStatus)}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-6">
                          <div className="space-y-1.5">
                            <div className="font-bold text-gray-900 text-base">
                              {formatDate(item.purchased_date)}
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
                              {formatDate(item.expired_date)}
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
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
          
          {/* ═══════════════════════════════════════════════════════════
              MOBILE/TABLET CARDS - SMALL/MEDIUM SCREENS
              ═══════════════════════════════════════════════════════════ */}
          
          <div className="lg:hidden space-y-4 sm:space-y-5">
            {filteredItems.map((item, index) => {
              // ✅ CALCULATE STATUS
              const displayStatus = calculateItemStatus(item);
              
              return (
                <div 
                  key={`${item.id}-${index}`}
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
                    
                    {/* ✅ STATUS BADGE */}
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-bold border-2 flex-shrink-0 ${getStatusColor(displayStatus)}`}>
                      {getStatusIcon(displayStatus)}
                      <span className="hidden xs:inline">{getStatusLabel(displayStatus)}</span>
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
                        {formatDate(item.purchased_date)}
                      </div>
                      <div className="text-sm sm:text-base text-gray-600 font-semibold mb-1.5">
                        {item.purchased_time}
                      </div>
                      <div className="text-xs sm:text-sm text-blue-600 bg-blue-100 px-2.5 py-1 rounded inline-block font-medium">
                        {item.purchased_day}
                      </div>
                    </div>
                    
                    {/* Expiry Details */}
                    <div className={`rounded-xl p-4 sm:p-5 border-2 ${
                      displayStatus === 'active' 
                        ? 'bg-green-50 border-green-200' 
                        : 'bg-orange-50 border-orange-200'
                    }`}>
                      <div className={`text-sm sm:text-base font-bold mb-2.5 flex items-center gap-1.5 ${
                        displayStatus === 'active' ? 'text-green-700' : 'text-orange-700'
                      }`}>
                        <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
                        {displayStatus === 'active' ? 'Expires' : 'Expired'}
                      </div>
                      <div className="font-bold text-gray-900 text-sm sm:text-base mb-1.5">
                        {formatDate(item.expired_date)}
                      </div>
                      <div className="text-sm sm:text-base text-gray-600 font-semibold mb-1.5">
                        {item.expired_time}
                      </div>
                      <div className={`text-xs sm:text-sm px-2.5 py-1 rounded inline-block font-medium ${
                        displayStatus === 'active'
                          ? 'text-green-600 bg-green-100'
                          : 'text-orange-600 bg-orange-100'
                      }`}>
                        {item.expired_day}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* ═══════════════════════════════════════════════════════════
              PAGINATION - RESPONSIVE
              ═══════════════════════════════════════════════════════════ */}
          
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

console.log('✅ HistoryTab - PRODUCTION v8.0 FINAL (BULLETPROOF ACTIVE DETECTION)');