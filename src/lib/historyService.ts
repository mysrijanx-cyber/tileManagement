// import {
//   collection,
//   doc,
//   getDocs,
//   query,
//   where,
//   orderBy,
//   limit,
//   startAfter,
//   getDoc
// } from 'firebase/firestore';
// import { db } from './firebase';
// import type { SubscriptionHistoryItem, HistoryFilters, HistoryStats } from '../types/history.types';

// // ═══════════════════════════════════════════════════════════════
// // ✅ FORMAT DATE & TIME UTILITIES
// // ═══════════════════════════════════════════════════════════════

// const formatDateTime = (dateString: string) => {
//   try {
//     const date = new Date(dateString);
    
//     if (isNaN(date.getTime())) {
//       return {
//         date: 'Invalid Date',
//         time: 'Invalid Time', 
//         day: 'Unknown',
//         full: 'Invalid Date'
//       };
//     }
    
//     const options: Intl.DateTimeFormatOptions = {
//       timeZone: 'Asia/Kolkata',
//       year: 'numeric',
//       month: 'short',
//       day: '2-digit',
//       hour: '2-digit',
//       minute: '2-digit',
//       hour12: true
//     };
    
//     const formatted = date.toLocaleString('en-IN', options);
//     const dayName = date.toLocaleDateString('en-IN', { 
//       timeZone: 'Asia/Kolkata',
//       weekday: 'long' 
//     });
    
//     const [datePart, timePart] = formatted.split(', ');
    
//     return {
//       date: datePart || 'Unknown Date',
//       time: timePart || 'Unknown Time',
//       day: dayName || 'Unknown Day',
//       full: formatted
//     };
//   } catch (error) {
//     console.warn('Date formatting error:', error);
//     return {
//       date: 'Error',
//       time: 'Error',
//       day: 'Error',
//       full: 'Error'
//     };
//   }
// };

// const calculateTotalDays = (startDate: string, endDate: string): number => {
//   try {
//     const start = new Date(startDate);
//     const end = new Date(endDate);
    
//     if (isNaN(start.getTime()) || isNaN(end.getTime())) {
//       return 0;
//     }
    
//     const diffTime = end.getTime() - start.getTime();
//     const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
//     return days > 0 ? days : 0;
//   } catch (error) {
//     console.warn('Date calculation error:', error);
//     return 0;
//   }
// };

// // ✅ SAFE NUMBER CONVERSION
// const safeNumber = (value: any, defaultValue: number = 0): number => {
//   if (typeof value === 'number' && !isNaN(value)) {
//     return value;
//   }
//   if (typeof value === 'string') {
//     const parsed = parseFloat(value);
//     return !isNaN(parsed) ? parsed : defaultValue;
//   }
//   return defaultValue;
// };

// // ═══════════════════════════════════════════════════════════════
// // ✅ GET SUBSCRIPTION HISTORY (FIXED)
// // ═══════════════════════════════════════════════════════════════

// export const getSellerSubscriptionHistory = async (
//   sellerId: string,
//   filters: HistoryFilters = {},
//   pageSize: number = 10,
//   lastDoc?: any
// ): Promise<{
//   items: SubscriptionHistoryItem[];
//   hasMore: boolean;
//   lastDoc: any;
//   total: number;
// }> => {
//   try {
//     console.log('📋 Fetching subscription history for seller:', sellerId);
    
//     if (!sellerId?.trim()) {
//       throw new Error('Seller ID is required');
//     }
    
//     // ✅ SIMPLE QUERY (NO COMPOSITE INDEX NEEDED)
//     let q = query(
//       collection(db, 'subscriptions'),
//       where('seller_id', '==', sellerId),
//       limit(pageSize + 1)
//     );
    
//     console.log('🔍 Executing simple query...');
//     const snapshot = await getDocs(q);
    
//     const docs = snapshot.docs;
//     const hasMore = docs.length > pageSize;
//     const actualDocs = hasMore ? docs.slice(0, pageSize) : docs;
//     const newLastDoc = actualDocs.length > 0 ? actualDocs[actualDocs.length - 1] : null;
    
//     const items: SubscriptionHistoryItem[] = [];
    
//     for (const docSnapshot of actualDocs) {
//       const data = docSnapshot.data();
      
//       // ✅ SAFE DATA EXTRACTION
//       const planId = data.plan_id || '';
//       const planName = data.plan_name || 'Unknown Plan';
//       const sellerId = data.seller_id || '';
//       const status = data.status || 'expired';
      
//       // Get dates with fallbacks
//       const startDate = data.start_date || data.created_at || new Date().toISOString();
//       const endDate = data.end_date || new Date().toISOString();
//       const createdAt = data.created_at || new Date().toISOString();
      
//       // Format dates safely
//       const purchasedDateTime = formatDateTime(startDate);
//       const expiredDateTime = formatDateTime(endDate);
      
//       // ✅ SAFE PLAN PRICE LOOKUP
//       let planPrice = 0;
//       try {
//         if (planId) {
//           const planDoc = await getDoc(doc(db, 'plans', planId));
//           if (planDoc.exists()) {
//             const planData = planDoc.data();
//             planPrice = safeNumber(planData.price, 0);
//           }
//         }
//       } catch (planError) {
//         console.warn('⚠️ Could not fetch plan details:', planError);
//       }
      
//       // ✅ SAFE PAYMENT LOOKUP
//       let paymentStatus: 'completed' | 'failed' | 'refunded' = 'completed';
//       let paymentId = data.last_payment_id || '';
      
//       try {
//         if (data.last_payment_id) {
//           const paymentDoc = await getDoc(doc(db, 'payments', data.last_payment_id));
//           if (paymentDoc.exists()) {
//             const paymentData = paymentDoc.data();
//             paymentStatus = paymentData.payment_status === 'completed' ? 'completed' : 'failed';
//           }
//         }
//       } catch (paymentError) {
//         console.warn('⚠️ Could not fetch payment details:', paymentError);
//       }
      
//       // ✅ CREATE HISTORY ITEM WITH SAFE VALUES
//       const historyItem: SubscriptionHistoryItem = {
//         id: docSnapshot.id,
//         seller_id: sellerId,
//         plan_id: planId,
//         plan_name: planName,
//         plan_price: planPrice,
//         currency: 'INR',
        
//         // Purchase Details
//         purchased_at: startDate,
//         purchased_date: purchasedDateTime.date,
//         purchased_time: purchasedDateTime.time,
//         purchased_day: purchasedDateTime.day,
        
//         // Expiry Details
//         expired_at: endDate,
//         expired_date: expiredDateTime.date,
//         expired_time: expiredDateTime.time,
//         expired_day: expiredDateTime.day,
        
//         // Status
//         status: status as any,
        
//         // Payment Info
//         payment_id: paymentId,
//         payment_status: paymentStatus,
        
//         // Usage Stats
//         total_scans_used: safeNumber(data.current_scan_count, 0),
//         scan_limit: -1, // Unlimited by default
        
//         // Duration
//         validity_duration: 30, // Default
//         validity_unit: 'days',
//         total_days: calculateTotalDays(startDate, endDate),
        
//         created_at: createdAt
//       };
      
//       // Apply filters
//       if (filters.status && filters.status !== 'all' && historyItem.status !== filters.status) {
//         continue;
//       }
      
//       if (filters.dateRange) {
//         try {
//           const purchaseDate = new Date(historyItem.purchased_at);
//           const startFilterDate = new Date(filters.dateRange.start);
//           const endFilterDate = new Date(filters.dateRange.end);
          
//           if (purchaseDate < startFilterDate || purchaseDate > endFilterDate) {
//             continue;
//           }
//         } catch (dateError) {
//           console.warn('Date filter error:', dateError);
//         }
//       }
      
//       if (filters.planName) {
//         if (!historyItem.plan_name.toLowerCase().includes(filters.planName.toLowerCase())) {
//           continue;
//         }
//       }
      
//       items.push(historyItem);
//     }
    
//     console.log(`✅ Fetched ${items.length} history items`);
    
//     return {
//       items,
//       hasMore,
//       lastDoc: newLastDoc,
//       total: snapshot.size
//     };
    
//   } catch (error: any) {
//     console.error('❌ Error fetching subscription history:', error);
    
//     // ✅ RETURN SAFE FALLBACK
//     return {
//       items: [],
//       hasMore: false,
//       lastDoc: null,
//       total: 0
//     };
//   }
// };

// // ═══════════════════════════════════════════════════════════════
// // ✅ GET HISTORY STATS (FIXED)
// // ═══════════════════════════════════════════════════════════════

// export const getSellerHistoryStats = async (sellerId: string): Promise<HistoryStats> => {
//   try {
//     console.log('📊 Calculating history stats for seller:', sellerId);
    
//     if (!sellerId?.trim()) {
//       throw new Error('Seller ID is required');
//     }
    
//     // ✅ SIMPLE QUERY
//     const q = query(
//       collection(db, 'subscriptions'),
//       where('seller_id', '==', sellerId)
//     );
    
//     const snapshot = await getDocs(q);
    
//     if (snapshot.empty) {
//       console.log('ℹ️ No subscription history found');
//       return {
//         total_plans_purchased: 0,
//         total_amount_spent: 0,
//         active_plans: 0,
//         expired_plans: 0,
//         average_plan_duration: 0,
//         most_purchased_plan: 'No plans yet'
//       };
//     }
    
//     let totalAmountSpent = 0;
//     let activePlans = 0;
//     let expiredPlans = 0;
//     const planCounts: { [key: string]: number } = {};
//     let totalDays = 0;
//     let validDurationCount = 0;
    
//     for (const docSnapshot of snapshot.docs) {
//       const data = docSnapshot.data();
      
//       // ✅ SAFE PLAN PRICE CALCULATION
//       try {
//         if (data.plan_id) {
//           const planDoc = await getDoc(doc(db, 'plans', data.plan_id));
//           if (planDoc.exists()) {
//             const planData = planDoc.data();
//             const planPrice = safeNumber(planData.price, 0);
//             totalAmountSpent += planPrice;
            
//             // Count plans
//             const planName = planData.plan_name || 'Unknown Plan';
//             planCounts[planName] = (planCounts[planName] || 0) + 1;
//           }
//         }
//       } catch (planError) {
//         console.warn('⚠️ Could not fetch plan for stats:', planError);
//       }
      
//       // ✅ SAFE STATUS COUNT
//       const status = data.status || 'expired';
//       if (status === 'active') {
//         activePlans++;
//       } else {
//         expiredPlans++;
//       }
      
//       // ✅ SAFE DURATION CALCULATION
//       if (data.start_date && data.end_date) {
//         const days = calculateTotalDays(data.start_date, data.end_date);
//         if (days > 0) {
//           totalDays += days;
//           validDurationCount++;
//         }
//       }
//     }
    
//     // ✅ SAFE MOST PURCHASED PLAN
//     let mostPurchasedPlan = 'No plans yet';
//     let maxCount = 0;
//     for (const [planName, count] of Object.entries(planCounts)) {
//       if (count > maxCount) {
//         maxCount = count;
//         mostPurchasedPlan = planName;
//       }
//     }
    
//     const stats: HistoryStats = {
//       total_plans_purchased: snapshot.size,
//       total_amount_spent: safeNumber(totalAmountSpent, 0),
//       active_plans: safeNumber(activePlans, 0),
//       expired_plans: safeNumber(expiredPlans, 0),
//       average_plan_duration: validDurationCount > 0 ? Math.round(totalDays / validDurationCount) : 0,
//       most_purchased_plan: mostPurchasedPlan
//     };
    
//     console.log('✅ History stats calculated:', stats);
//     return stats;
    
//   } catch (error: any) {
//     console.error('❌ Error calculating history stats:', error);
//     return {
//       total_plans_purchased: 0,
//       total_amount_spent: 0,
//       active_plans: 0,
//       expired_plans: 0,
//       average_plan_duration: 0,
//       most_purchased_plan: 'Error loading'
//     };
//   }
// };

// export default {
//   getSellerSubscriptionHistory,
//   getSellerHistoryStats
// };

import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  Timestamp
} from 'firebase/firestore';
import { db } from './firebase';
import type { SubscriptionHistoryItem, HistoryFilters, HistoryStats } from '../types/history.types';

// ═══════════════════════════════════════════════════════════════
// ✅ CACHE MANAGEMENT
// ═══════════════════════════════════════════════════════════════

interface HistoryCache {
  items: SubscriptionHistoryItem[];
  stats: HistoryStats | null;
  timestamp: number;
}

const historyCache = new Map<string, HistoryCache>();
const CACHE_DURATION = 30000; // 30 seconds

export function clearHistoryCache(sellerId?: string): void {
  if (sellerId) {
    historyCache.delete(sellerId);
    console.log('🗑️ Cleared history cache for seller:', sellerId);
  } else {
    historyCache.clear();
    console.log('🗑️ Cleared all history cache');
  }
}

// ═══════════════════════════════════════════════════════════════
// ✅ FORMAT DATE & TIME UTILITIES
// ═══════════════════════════════════════════════════════════════

const formatDateTime = (dateString: string) => {
  try {
    const date = new Date(dateString);
    
    if (isNaN(date.getTime())) {
      return {
        date: 'Invalid Date',
        time: 'Invalid Time',
        day: 'Unknown',
        full: 'Invalid Date'
      };
    }
    
    const options: Intl.DateTimeFormatOptions = {
      timeZone: 'Asia/Kolkata',
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    };
    
    const formatted = date.toLocaleString('en-IN', options);
    const dayName = date.toLocaleDateString('en-IN', {
      timeZone: 'Asia/Kolkata',
      weekday: 'long'
    });
    
    const [datePart, timePart] = formatted.split(', ');
    
    return {
      date: datePart || 'Unknown Date',
      time: timePart || 'Unknown Time',
      day: dayName || 'Unknown Day',
      full: formatted
    };
  } catch (error) {
    console.warn('Date formatting error:', error);
    return {
      date: 'Error',
      time: 'Error',
      day: 'Error',
      full: 'Error'
    };
  }
};

const calculateTotalDays = (startDate: string, endDate: string): number => {
  try {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return 0;
    }
    
    const diffTime = end.getTime() - start.getTime();
    const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return days > 0 ? days : 0;
  } catch (error) {
    console.warn('Date calculation error:', error);
    return 0;
  }
};

const safeNumber = (value: any, defaultValue: number = 0): number => {
  if (typeof value === 'number' && !isNaN(value)) {
    return value;
  }
  if (typeof value === 'string') {
    const parsed = parseFloat(value);
    return !isNaN(parsed) ? parsed : defaultValue;
  }
  return defaultValue;
};

// ═══════════════════════════════════════════════════════════════
// ✅ GET SUBSCRIPTION HISTORY - PRODUCTION v4.0 FINAL
// ═══════════════════════════════════════════════════════════════

export const getSellerSubscriptionHistory = async (
  sellerId: string,
  filters: HistoryFilters = {},
  pageSize: number = 10,
  lastDoc?: any
): Promise<{
  items: SubscriptionHistoryItem[];
  hasMore: boolean;
  lastDoc: any;
  total: number;
}> => {
  try {
    console.log('═══════════════════════════════════════════════════════');
    console.log('📋 [HISTORY] Fetching subscription history');
    console.log('👤 Seller ID:', sellerId);
    console.log('📊 Page size:', pageSize);
    console.log('🔍 Filters:', filters);
    
    // ✅ VALIDATION
    if (!sellerId?.trim()) {
      throw new Error('Seller ID is required');
    }
    
    // ✅ CHECK CACHE (only for first page, no filters)
    const cacheKey = `${sellerId}_${JSON.stringify(filters)}`;
    if (!lastDoc && !filters.status && !filters.dateRange) {
      const cached = historyCache.get(cacheKey);
      if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        console.log('📦 [CACHE HIT] Returning cached history');
        console.log('═══════════════════════════════════════════════════════');
        return {
          items: cached.items,
          hasMore: cached.items.length >= pageSize,
          lastDoc: null,
          total: cached.items.length
        };
      }
    }
    
    let items: SubscriptionHistoryItem[] = [];
    
    // ═══════════════════════════════════════════════════════════
    // ✅ METHOD 1: TRY COMPOSITE QUERY WITH ORDERING
    // ═══════════════════════════════════════════════════════════
    
    try {
      console.log('🔄 [METHOD 1] Trying composite query with orderBy...');
      
      let q = query(
        collection(db, 'subscription_history'),
        where('seller_id', '==', sellerId),
        orderBy('created_at', 'desc'),  // ✅ LATEST FIRST
        limit(pageSize + 1)
      );
      
      if (lastDoc) {
        q = query(q, startAfter(lastDoc));
      }
      
      const snapshot = await getDocs(q);
      
      const docs = snapshot.docs;
      const hasMore = docs.length > pageSize;
      const actualDocs = hasMore ? docs.slice(0, pageSize) : docs;
      const newLastDoc = actualDocs.length > 0 ? actualDocs[actualDocs.length - 1] : null;
      
      for (const docSnapshot of actualDocs) {
        const data = docSnapshot.data();
        
        const purchasedDateTime = formatDateTime(data.purchased_at || data.created_at);
        const expiredDateTime = formatDateTime(data.end_date);
        
        const historyItem: SubscriptionHistoryItem = {
          id: docSnapshot.id,
          seller_id: data.seller_id || '',
          plan_id: data.plan_id || '',
          plan_name: data.plan_name || 'Unknown Plan',
          plan_price: safeNumber(data.plan_price, 0),
          currency: data.currency || 'INR',
          
          purchased_at: data.purchased_at || data.created_at || new Date().toISOString(),
          purchased_date: purchasedDateTime.date,
          purchased_time: purchasedDateTime.time,
          purchased_day: purchasedDateTime.day,
          
          expired_at: data.end_date || new Date().toISOString(),
          expired_date: expiredDateTime.date,
          expired_time: expiredDateTime.time,
          expired_day: expiredDateTime.day,
          
          status: data.status || 'expired',
          
          payment_id: data.payment_id || '',
          payment_status: data.payment_status || 'completed',
          
          total_scans_used: safeNumber(data.total_scans_used, 0),
          scan_limit: safeNumber(data.scan_limit, -1),
          
          validity_duration: safeNumber(data.validity_duration, 30),
          validity_unit: data.validity_unit || 'days',
          total_days: calculateTotalDays(
            data.purchased_at || data.created_at,
            data.end_date
          ),
          
          created_at: data.created_at || new Date().toISOString()
        };
        
        // ✅ APPLY FILTERS
        if (filters.status && filters.status !== 'all' && historyItem.status !== filters.status) {
          continue;
        }
        
        if (filters.dateRange) {
          try {
            const purchaseDate = new Date(historyItem.purchased_at);
            const startFilterDate = new Date(filters.dateRange.start);
            const endFilterDate = new Date(filters.dateRange.end);
            
            if (purchaseDate < startFilterDate || purchaseDate > endFilterDate) {
              continue;
            }
          } catch (dateError) {
            console.warn('Date filter error:', dateError);
          }
        }
        
        if (filters.planName) {
          if (!historyItem.plan_name.toLowerCase().includes(filters.planName.toLowerCase())) {
            continue;
          }
        }
        
        items.push(historyItem);
      }
      
      console.log(`✅ [METHOD 1] Success - Fetched ${items.length} history items`);
      
      // ✅ CACHE RESULTS (first page only)
      if (!lastDoc && items.length > 0) {
        historyCache.set(cacheKey, {
          items,
          stats: null,
          timestamp: Date.now()
        });
        console.log('💾 [CACHE] Stored results in cache');
      }
      
      console.log('═══════════════════════════════════════════════════════');
      
      return {
        items,
        hasMore,
        lastDoc: newLastDoc,
        total: snapshot.size
      };
      
    } catch (indexError: any) {
      console.warn('⚠️ [METHOD 1] Composite query failed:', indexError.message);
      console.log('🔄 Falling back to METHOD 2...');
      
      // ═══════════════════════════════════════════════════════════
      // ✅ FALLBACK METHOD 2: SIMPLE QUERY + CLIENT-SIDE SORT
      // ═══════════════════════════════════════════════════════════
      
      console.log('🔄 [METHOD 2] Using simple query with client-side sort...');
      
      const simpleQuery = query(
        collection(db, 'subscription_history'),
        where('seller_id', '==', sellerId)
      );
      
      const snapshot = await getDocs(simpleQuery);
      
      if (snapshot.empty) {
        console.log('ℹ️ No subscription history found');
        console.log('═══════════════════════════════════════════════════════');
        return {
          items: [],
          hasMore: false,
          lastDoc: null,
          total: 0
        };
      }
      
      const allItems: SubscriptionHistoryItem[] = [];
      
      for (const docSnapshot of snapshot.docs) {
        const data = docSnapshot.data();
        
        const purchasedDateTime = formatDateTime(data.purchased_at || data.created_at);
        const expiredDateTime = formatDateTime(data.end_date);
        
        const historyItem: SubscriptionHistoryItem = {
          id: docSnapshot.id,
          seller_id: data.seller_id || '',
          plan_id: data.plan_id || '',
          plan_name: data.plan_name || 'Unknown Plan',
          plan_price: safeNumber(data.plan_price, 0),
          currency: data.currency || 'INR',
          
          purchased_at: data.purchased_at || data.created_at || new Date().toISOString(),
          purchased_date: purchasedDateTime.date,
          purchased_time: purchasedDateTime.time,
          purchased_day: purchasedDateTime.day,
          
          expired_at: data.end_date || new Date().toISOString(),
          expired_date: expiredDateTime.date,
          expired_time: expiredDateTime.time,
          expired_day: expiredDateTime.day,
          
          status: data.status || 'expired',
          
          payment_id: data.payment_id || '',
          payment_status: data.payment_status || 'completed',
          
          total_scans_used: safeNumber(data.total_scans_used, 0),
          scan_limit: safeNumber(data.scan_limit, -1),
          
          validity_duration: safeNumber(data.validity_duration, 30),
          validity_unit: data.validity_unit || 'days',
          total_days: calculateTotalDays(
            data.purchased_at || data.created_at,
            data.end_date
          ),
          
          created_at: data.created_at || new Date().toISOString()
        };
        
        // ✅ APPLY FILTERS
        if (filters.status && filters.status !== 'all' && historyItem.status !== filters.status) {
          continue;
        }
        
        if (filters.dateRange) {
          try {
            const purchaseDate = new Date(historyItem.purchased_at);
            const startFilterDate = new Date(filters.dateRange.start);
            const endFilterDate = new Date(filters.dateRange.end);
            
            if (purchaseDate < startFilterDate || purchaseDate > endFilterDate) {
              continue;
            }
          } catch (dateError) {
            console.warn('Date filter error:', dateError);
          }
        }
        
        if (filters.planName) {
          if (!historyItem.plan_name.toLowerCase().includes(filters.planName.toLowerCase())) {
            continue;
          }
        }
        
        allItems.push(historyItem);
      }
      
      // ✅ CLIENT-SIDE SORT (LATEST FIRST)
      allItems.sort((a, b) => {
        const dateA = new Date(a.created_at).getTime();
        const dateB = new Date(b.created_at).getTime();
        return dateB - dateA; // ✅ Descending (newest first)
      });
      
      // ✅ PAGINATION
      const startIndex = lastDoc ? parseInt(lastDoc) : 0;
      const endIndex = startIndex + pageSize;
      const paginatedItems = allItems.slice(startIndex, endIndex);
      const hasMore = endIndex < allItems.length;
      const newLastDoc = hasMore ? endIndex.toString() : null;
      
      console.log(`✅ [METHOD 2] Success - Fetched ${paginatedItems.length} of ${allItems.length} total items`);
      
      // ✅ CACHE RESULTS (first page only)
      if (!lastDoc && paginatedItems.length > 0) {
        historyCache.set(cacheKey, {
          items: paginatedItems,
          stats: null,
          timestamp: Date.now()
        });
        console.log('💾 [CACHE] Stored results in cache');
      }
      
      console.log('═══════════════════════════════════════════════════════');
      
      return {
        items: paginatedItems,
        hasMore,
        lastDoc: newLastDoc,
        total: allItems.length
      };
    }
    
  } catch (error: any) {
    console.error('═══════════════════════════════════════════════════════');
    console.error('❌ [HISTORY] Fatal error:', error);
    console.error('═══════════════════════════════════════════════════════');
    
    return {
      items: [],
      hasMore: false,
      lastDoc: null,
      total: 0
    };
  }
};

// ═══════════════════════════════════════════════════════════════
// ✅ GET HISTORY STATS - PRODUCTION v4.0 FINAL
// ═══════════════════════════════════════════════════════════════

export const getSellerHistoryStats = async (sellerId: string): Promise<HistoryStats> => {
  try {
    console.log('📊 [STATS] Calculating history stats for seller:', sellerId);
    
    if (!sellerId?.trim()) {
      throw new Error('Seller ID is required');
    }
    
    // ✅ CHECK CACHE
    const cached = historyCache.get(sellerId);
    if (cached?.stats && Date.now() - cached.timestamp < CACHE_DURATION) {
      console.log('📦 [CACHE HIT] Returning cached stats');
      return cached.stats;
    }
    
    // ✅ QUERY subscription_history COLLECTION
    const q = query(
      collection(db, 'subscription_history'),
      where('seller_id', '==', sellerId)
    );
    
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) {
      console.log('ℹ️ No subscription history found for stats');
      return {
        total_plans_purchased: 0,
        total_amount_spent: 0,
        active_plans: 0,
        expired_plans: 0,
        average_plan_duration: 0,
        most_purchased_plan: 'No plans yet'
      };
    }
    
    let totalAmountSpent = 0;
    let activePlans = 0;
    let expiredPlans = 0;
    const planCounts: { [key: string]: number } = {};
    let totalDays = 0;
    let validDurationCount = 0;
    
    snapshot.docs.forEach(docSnapshot => {
      const data = docSnapshot.data();
      
      // ✅ SAFE PRICE CALCULATION
      const planPrice = safeNumber(data.plan_price, 0);
      totalAmountSpent += planPrice;
      
      // ✅ COUNT PLANS
      const planName = data.plan_name || 'Unknown Plan';
      planCounts[planName] = (planCounts[planName] || 0) + 1;
      
      // ✅ STATUS COUNT
      const status = data.status || 'expired';
      if (status === 'active') {
        activePlans++;
      } else {
        expiredPlans++;
      }
      
      // ✅ DURATION CALCULATION
      if (data.purchased_at && data.end_date) {
        const days = calculateTotalDays(data.purchased_at, data.end_date);
        if (days > 0) {
          totalDays += days;
          validDurationCount++;
        }
      }
    });
    
    // ✅ MOST PURCHASED PLAN
    let mostPurchasedPlan = 'No plans yet';
    let maxCount = 0;
    for (const [planName, count] of Object.entries(planCounts)) {
      if (count > maxCount) {
        maxCount = count;
        mostPurchasedPlan = planName;
      }
    }
    
    const stats: HistoryStats = {
      total_plans_purchased: snapshot.size,
      total_amount_spent: safeNumber(totalAmountSpent, 0),
      active_plans: safeNumber(activePlans, 0),
      expired_plans: safeNumber(expiredPlans, 0),
      average_plan_duration: validDurationCount > 0 ? Math.round(totalDays / validDurationCount) : 0,
      most_purchased_plan: mostPurchasedPlan
    };
    
    console.log('✅ [STATS] Calculated:', stats);
    
    // ✅ UPDATE CACHE
    const existingCache = historyCache.get(sellerId);
    if (existingCache) {
      existingCache.stats = stats;
      existingCache.timestamp = Date.now();
    } else {
      historyCache.set(sellerId, {
        items: [],
        stats,
        timestamp: Date.now()
      });
    }
    
    return stats;
    
  } catch (error: any) {
    console.error('❌ [STATS] Error calculating stats:', error);
    return {
      total_plans_purchased: 0,
      total_amount_spent: 0,
      active_plans: 0,
      expired_plans: 0,
      average_plan_duration: 0,
      most_purchased_plan: 'Error loading'
    };
  }
};

export default {
  getSellerSubscriptionHistory,
  getSellerHistoryStats,
  clearHistoryCache
};

console.log('✅ History Service loaded - PRODUCTION v4.0 FINAL (FAST + SORTED)');