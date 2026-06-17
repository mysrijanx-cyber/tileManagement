
// // import {
// //   collection,
// //   getDocs,
// //   query,
// //   where,
// //   orderBy,
// //   limit,
// //   startAfter,
// //   Timestamp
// // } from 'firebase/firestore';
// // import { db } from './firebase';
// // import type { SubscriptionHistoryItem, HistoryFilters, HistoryStats } from '../types/history.types';

// // // ═══════════════════════════════════════════════════════════════
// // // ✅ CACHE MANAGEMENT
// // // ═══════════════════════════════════════════════════════════════

// // interface HistoryCache {
// //   items: SubscriptionHistoryItem[];
// //   stats: HistoryStats | null;
// //   timestamp: number;
// // }

// // const historyCache = new Map<string, HistoryCache>();
// // const CACHE_DURATION = 30000; // 30 seconds

// // export function clearHistoryCache(sellerId?: string): void {
// //   if (sellerId) {
// //     historyCache.delete(sellerId);
// //     console.log('🗑️ Cleared history cache for seller:', sellerId);
// //   } else {
// //     historyCache.clear();
// //     console.log('🗑️ Cleared all history cache');
// //   }
// // }

// // // ═══════════════════════════════════════════════════════════════
// // // ✅ FORMAT DATE & TIME UTILITIES
// // // ═══════════════════════════════════════════════════════════════

// // const formatDateTime = (dateString: string) => {
// //   try {
// //     const date = new Date(dateString);
    
// //     if (isNaN(date.getTime())) {
// //       return {
// //         date: 'Invalid Date',
// //         time: 'Invalid Time',
// //         day: 'Unknown',
// //         full: 'Invalid Date'
// //       };
// //     }
    
// //     const options: Intl.DateTimeFormatOptions = {
// //       timeZone: 'Asia/Kolkata',
// //       year: 'numeric',
// //       month: 'short',
// //       day: '2-digit',
// //       hour: '2-digit',
// //       minute: '2-digit',
// //       hour12: true
// //     };
    
// //     const formatted = date.toLocaleString('en-IN', options);
// //     const dayName = date.toLocaleDateString('en-IN', {
// //       timeZone: 'Asia/Kolkata',
// //       weekday: 'long'
// //     });
    
// //     const [datePart, timePart] = formatted.split(', ');
    
// //     return {
// //       date: datePart || 'Unknown Date',
// //       time: timePart || 'Unknown Time',
// //       day: dayName || 'Unknown Day',
// //       full: formatted
// //     };
// //   } catch (error) {
// //     console.warn('Date formatting error:', error);
// //     return {
// //       date: 'Error',
// //       time: 'Error',
// //       day: 'Error',
// //       full: 'Error'
// //     };
// //   }
// // };

// // const calculateTotalDays = (startDate: string, endDate: string): number => {
// //   try {
// //     const start = new Date(startDate);
// //     const end = new Date(endDate);
    
// //     if (isNaN(start.getTime()) || isNaN(end.getTime())) {
// //       return 0;
// //     }
    
// //     const diffTime = end.getTime() - start.getTime();
// //     const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
// //     return days > 0 ? days : 0;
// //   } catch (error) {
// //     console.warn('Date calculation error:', error);
// //     return 0;
// //   }
// // };

// // const safeNumber = (value: any, defaultValue: number = 0): number => {
// //   if (typeof value === 'number' && !isNaN(value)) {
// //     return value;
// //   }
// //   if (typeof value === 'string') {
// //     const parsed = parseFloat(value);
// //     return !isNaN(parsed) ? parsed : defaultValue;
// //   }
// //   return defaultValue;
// // };

// // // ═══════════════════════════════════════════════════════════════
// // // ✅ GET SUBSCRIPTION HISTORY - PRODUCTION v4.0 FINAL
// // // ═══════════════════════════════════════════════════════════════

// // export const getSellerSubscriptionHistory = async (
// //   sellerId: string,
// //   filters: HistoryFilters = {},
// //   pageSize: number = 10,
// //   lastDoc?: any
// // ): Promise<{
// //   items: SubscriptionHistoryItem[];
// //   hasMore: boolean;
// //   lastDoc: any;
// //   total: number;
// // }> => {
// //   try {
// //     console.log('═══════════════════════════════════════════════════════');
// //     console.log('📋 [HISTORY] Fetching subscription history');
// //     console.log('👤 Seller ID:', sellerId);
// //     console.log('📊 Page size:', pageSize);
// //     console.log('🔍 Filters:', filters);
    
// //     // ✅ VALIDATION
// //     if (!sellerId?.trim()) {
// //       throw new Error('Seller ID is required');
// //     }
    
// //     // ✅ CHECK CACHE (only for first page, no filters)
// //     const cacheKey = `${sellerId}_${JSON.stringify(filters)}`;
// //     if (!lastDoc && !filters.status && !filters.dateRange) {
// //       const cached = historyCache.get(cacheKey);
// //       if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
// //         console.log('📦 [CACHE HIT] Returning cached history');
// //         console.log('═══════════════════════════════════════════════════════');
// //         return {
// //           items: cached.items,
// //           hasMore: cached.items.length >= pageSize,
// //           lastDoc: null,
// //           total: cached.items.length
// //         };
// //       }
// //     }
    
// //     let items: SubscriptionHistoryItem[] = [];
    
// //     // ═══════════════════════════════════════════════════════════
// //     // ✅ METHOD 1: TRY COMPOSITE QUERY WITH ORDERING
// //     // ═══════════════════════════════════════════════════════════
    
// //     try {
// //       console.log('🔄 [METHOD 1] Trying composite query with orderBy...');
      
// //       let q = query(
// //         collection(db, 'subscription_history'),
// //         where('seller_id', '==', sellerId),
// //         orderBy('created_at', 'desc'),  // ✅ LATEST FIRST
// //         limit(pageSize + 1)
// //       );
      
// //       if (lastDoc) {
// //         q = query(q, startAfter(lastDoc));
// //       }
      
// //       const snapshot = await getDocs(q);
      
// //       const docs = snapshot.docs;
// //       const hasMore = docs.length > pageSize;
// //       const actualDocs = hasMore ? docs.slice(0, pageSize) : docs;
// //       const newLastDoc = actualDocs.length > 0 ? actualDocs[actualDocs.length - 1] : null;
      
// //       for (const docSnapshot of actualDocs) {
// //         const data = docSnapshot.data();
        
// //         const purchasedDateTime = formatDateTime(data.purchased_at || data.created_at);
// //         const expiredDateTime = formatDateTime(data.end_date);
        
// //         const historyItem: SubscriptionHistoryItem = {
// //           id: docSnapshot.id,
// //           seller_id: data.seller_id || '',
// //           plan_id: data.plan_id || '',
// //           plan_name: data.plan_name || 'Unknown Plan',
// //           plan_price: safeNumber(data.plan_price, 0),
// //           currency: data.currency || 'INR',
          
// //           purchased_at: data.purchased_at || data.created_at || new Date().toISOString(),
// //           purchased_date: purchasedDateTime.date,
// //           purchased_time: purchasedDateTime.time,
// //           purchased_day: purchasedDateTime.day,
          
// //           expired_at: data.end_date || new Date().toISOString(),
// //           expired_date: expiredDateTime.date,
// //           expired_time: expiredDateTime.time,
// //           expired_day: expiredDateTime.day,
          
// //           status: data.status || 'expired',
          
// //           payment_id: data.payment_id || '',
// //           payment_status: data.payment_status || 'completed',
          
// //           total_scans_used: safeNumber(data.total_scans_used, 0),
// //           scan_limit: safeNumber(data.scan_limit, -1),
          
// //           validity_duration: safeNumber(data.validity_duration, 30),
// //           validity_unit: data.validity_unit || 'days',
// //           total_days: calculateTotalDays(
// //             data.purchased_at || data.created_at,
// //             data.end_date
// //           ),
          
// //           created_at: data.created_at || new Date().toISOString()
// //         };
        
// //         // ✅ APPLY FILTERS
// //         if (filters.status && filters.status !== 'all' && historyItem.status !== filters.status) {
// //           continue;
// //         }
        
// //         if (filters.dateRange) {
// //           try {
// //             const purchaseDate = new Date(historyItem.purchased_at);
// //             const startFilterDate = new Date(filters.dateRange.start);
// //             const endFilterDate = new Date(filters.dateRange.end);
            
// //             if (purchaseDate < startFilterDate || purchaseDate > endFilterDate) {
// //               continue;
// //             }
// //           } catch (dateError) {
// //             console.warn('Date filter error:', dateError);
// //           }
// //         }
        
// //         if (filters.planName) {
// //           if (!historyItem.plan_name.toLowerCase().includes(filters.planName.toLowerCase())) {
// //             continue;
// //           }
// //         }
        
// //         items.push(historyItem);
// //       }
      
// //       console.log(`✅ [METHOD 1] Success - Fetched ${items.length} history items`);
      
// //       // ✅ CACHE RESULTS (first page only)
// //       if (!lastDoc && items.length > 0) {
// //         historyCache.set(cacheKey, {
// //           items,
// //           stats: null,
// //           timestamp: Date.now()
// //         });
// //         console.log('💾 [CACHE] Stored results in cache');
// //       }
      
// //       console.log('═══════════════════════════════════════════════════════');
      
// //       return {
// //         items,
// //         hasMore,
// //         lastDoc: newLastDoc,
// //         total: snapshot.size
// //       };
      
// //     } catch (indexError: any) {
// //       console.warn('⚠️ [METHOD 1] Composite query failed:', indexError.message);
// //       console.log('🔄 Falling back to METHOD 2...');
      
// //       // ═══════════════════════════════════════════════════════════
// //       // ✅ FALLBACK METHOD 2: SIMPLE QUERY + CLIENT-SIDE SORT
// //       // ═══════════════════════════════════════════════════════════
      
// //       console.log('🔄 [METHOD 2] Using simple query with client-side sort...');
      
// //       const simpleQuery = query(
// //         collection(db, 'subscription_history'),
// //         where('seller_id', '==', sellerId)
// //       );
      
// //       const snapshot = await getDocs(simpleQuery);
      
// //       if (snapshot.empty) {
// //         console.log('ℹ️ No subscription history found');
// //         console.log('═══════════════════════════════════════════════════════');
// //         return {
// //           items: [],
// //           hasMore: false,
// //           lastDoc: null,
// //           total: 0
// //         };
// //       }
      
// //       const allItems: SubscriptionHistoryItem[] = [];
      
// //       for (const docSnapshot of snapshot.docs) {
// //         const data = docSnapshot.data();
        
// //         const purchasedDateTime = formatDateTime(data.purchased_at || data.created_at);
// //         const expiredDateTime = formatDateTime(data.end_date);
        
// //         const historyItem: SubscriptionHistoryItem = {
// //           id: docSnapshot.id,
// //           seller_id: data.seller_id || '',
// //           plan_id: data.plan_id || '',
// //           plan_name: data.plan_name || 'Unknown Plan',
// //           plan_price: safeNumber(data.plan_price, 0),
// //           currency: data.currency || 'INR',
          
// //           purchased_at: data.purchased_at || data.created_at || new Date().toISOString(),
// //           purchased_date: purchasedDateTime.date,
// //           purchased_time: purchasedDateTime.time,
// //           purchased_day: purchasedDateTime.day,
          
// //           expired_at: data.end_date || new Date().toISOString(),
// //           expired_date: expiredDateTime.date,
// //           expired_time: expiredDateTime.time,
// //           expired_day: expiredDateTime.day,
          
// //           status: data.status || 'expired',
          
// //           payment_id: data.payment_id || '',
// //           payment_status: data.payment_status || 'completed',
          
// //           total_scans_used: safeNumber(data.total_scans_used, 0),
// //           scan_limit: safeNumber(data.scan_limit, -1),
          
// //           validity_duration: safeNumber(data.validity_duration, 30),
// //           validity_unit: data.validity_unit || 'days',
// //           total_days: calculateTotalDays(
// //             data.purchased_at || data.created_at,
// //             data.end_date
// //           ),
          
// //           created_at: data.created_at || new Date().toISOString()
// //         };
        
// //         // ✅ APPLY FILTERS
// //         if (filters.status && filters.status !== 'all' && historyItem.status !== filters.status) {
// //           continue;
// //         }
        
// //         if (filters.dateRange) {
// //           try {
// //             const purchaseDate = new Date(historyItem.purchased_at);
// //             const startFilterDate = new Date(filters.dateRange.start);
// //             const endFilterDate = new Date(filters.dateRange.end);
            
// //             if (purchaseDate < startFilterDate || purchaseDate > endFilterDate) {
// //               continue;
// //             }
// //           } catch (dateError) {
// //             console.warn('Date filter error:', dateError);
// //           }
// //         }
        
// //         if (filters.planName) {
// //           if (!historyItem.plan_name.toLowerCase().includes(filters.planName.toLowerCase())) {
// //             continue;
// //           }
// //         }
        
// //         allItems.push(historyItem);
// //       }
      
// //       // ✅ CLIENT-SIDE SORT (LATEST FIRST)
// //       allItems.sort((a, b) => {
// //         const dateA = new Date(a.created_at).getTime();
// //         const dateB = new Date(b.created_at).getTime();
// //         return dateB - dateA; // ✅ Descending (newest first)
// //       });
      
// //       // ✅ PAGINATION
// //       const startIndex = lastDoc ? parseInt(lastDoc) : 0;
// //       const endIndex = startIndex + pageSize;
// //       const paginatedItems = allItems.slice(startIndex, endIndex);
// //       const hasMore = endIndex < allItems.length;
// //       const newLastDoc = hasMore ? endIndex.toString() : null;
      
// //       console.log(`✅ [METHOD 2] Success - Fetched ${paginatedItems.length} of ${allItems.length} total items`);
      
// //       // ✅ CACHE RESULTS (first page only)
// //       if (!lastDoc && paginatedItems.length > 0) {
// //         historyCache.set(cacheKey, {
// //           items: paginatedItems,
// //           stats: null,
// //           timestamp: Date.now()
// //         });
// //         console.log('💾 [CACHE] Stored results in cache');
// //       }
      
// //       console.log('═══════════════════════════════════════════════════════');
      
// //       return {
// //         items: paginatedItems,
// //         hasMore,
// //         lastDoc: newLastDoc,
// //         total: allItems.length
// //       };
// //     }
    
// //   } catch (error: any) {
// //     console.error('═══════════════════════════════════════════════════════');
// //     console.error('❌ [HISTORY] Fatal error:', error);
// //     console.error('═══════════════════════════════════════════════════════');
    
// //     return {
// //       items: [],
// //       hasMore: false,
// //       lastDoc: null,
// //       total: 0
// //     };
// //   }
// // };

// // // ═══════════════════════════════════════════════════════════════
// // // ✅ GET HISTORY STATS - PRODUCTION v4.0 FINAL
// // // ═══════════════════════════════════════════════════════════════

// // export const getSellerHistoryStats = async (sellerId: string): Promise<HistoryStats> => {
// //   try {
// //     console.log('📊 [STATS] Calculating history stats for seller:', sellerId);
    
// //     if (!sellerId?.trim()) {
// //       throw new Error('Seller ID is required');
// //     }
    
// //     // ✅ CHECK CACHE
// //     const cached = historyCache.get(sellerId);
// //     if (cached?.stats && Date.now() - cached.timestamp < CACHE_DURATION) {
// //       console.log('📦 [CACHE HIT] Returning cached stats');
// //       return cached.stats;
// //     }
    
// //     // ✅ QUERY subscription_history COLLECTION
// //     const q = query(
// //       collection(db, 'subscription_history'),
// //       where('seller_id', '==', sellerId)
// //     );
    
// //     const snapshot = await getDocs(q);
    
// //     if (snapshot.empty) {
// //       console.log('ℹ️ No subscription history found for stats');
// //       return {
// //         total_plans_purchased: 0,
// //         total_amount_spent: 0,
// //         active_plans: 0,
// //         expired_plans: 0,
// //         average_plan_duration: 0,
// //         most_purchased_plan: 'No plans yet'
// //       };
// //     }
    
// //     let totalAmountSpent = 0;
// //     let activePlans = 0;
// //     let expiredPlans = 0;
// //     const planCounts: { [key: string]: number } = {};
// //     let totalDays = 0;
// //     let validDurationCount = 0;
    
// //     snapshot.docs.forEach(docSnapshot => {
// //       const data = docSnapshot.data();
      
// //       // ✅ SAFE PRICE CALCULATION
// //       const planPrice = safeNumber(data.plan_price, 0);
// //       totalAmountSpent += planPrice;
      
// //       // ✅ COUNT PLANS
// //       const planName = data.plan_name || 'Unknown Plan';
// //       planCounts[planName] = (planCounts[planName] || 0) + 1;
      
// //       // ✅ STATUS COUNT
// //       const status = data.status || 'expired';
// //       if (status === 'active') {
// //         activePlans++;
// //       } else {
// //         expiredPlans++;
// //       }
      
// //       // ✅ DURATION CALCULATION
// //       if (data.purchased_at && data.end_date) {
// //         const days = calculateTotalDays(data.purchased_at, data.end_date);
// //         if (days > 0) {
// //           totalDays += days;
// //           validDurationCount++;
// //         }
// //       }
// //     });
    
// //     // ✅ MOST PURCHASED PLAN
// //     let mostPurchasedPlan = 'No plans yet';
// //     let maxCount = 0;
// //     for (const [planName, count] of Object.entries(planCounts)) {
// //       if (count > maxCount) {
// //         maxCount = count;
// //         mostPurchasedPlan = planName;
// //       }
// //     }
    
// //     const stats: HistoryStats = {
// //       total_plans_purchased: snapshot.size,
// //       total_amount_spent: safeNumber(totalAmountSpent, 0),
// //       active_plans: safeNumber(activePlans, 0),
// //       expired_plans: safeNumber(expiredPlans, 0),
// //       average_plan_duration: validDurationCount > 0 ? Math.round(totalDays / validDurationCount) : 0,
// //       most_purchased_plan: mostPurchasedPlan
// //     };
    
// //     console.log('✅ [STATS] Calculated:', stats);
    
// //     // ✅ UPDATE CACHE
// //     const existingCache = historyCache.get(sellerId);
// //     if (existingCache) {
// //       existingCache.stats = stats;
// //       existingCache.timestamp = Date.now();
// //     } else {
// //       historyCache.set(sellerId, {
// //         items: [],
// //         stats,
// //         timestamp: Date.now()
// //       });
// //     }
    
// //     return stats;
    
// //   } catch (error: any) {
// //     console.error('❌ [STATS] Error calculating stats:', error);
// //     return {
// //       total_plans_purchased: 0,
// //       total_amount_spent: 0,
// //       active_plans: 0,
// //       expired_plans: 0,
// //       average_plan_duration: 0,
// //       most_purchased_plan: 'Error loading'
// //     };
// //   }
// // };

// // export default {
// //   getSellerSubscriptionHistory,
// //   getSellerHistoryStats,
// //   clearHistoryCache
// // };

// // console.log('✅ History Service loaded - PRODUCTION v4.0 FINAL (FAST + SORTED)'); 
// import {
//   collection,
//   getDocs,
//   query,
//   where,
//   orderBy,
//   limit,
//   startAfter,
//   Timestamp
// } from 'firebase/firestore';
// import { db } from './firebase';
// import type { SubscriptionHistoryItem, HistoryFilters, HistoryStats } from '../types/history.types';

// // ═══════════════════════════════════════════════════════════════
// // ✅ CACHE MANAGEMENT
// // ═══════════════════════════════════════════════════════════════

// interface HistoryCache {
//   items: SubscriptionHistoryItem[];
//   stats: HistoryStats | null;
//   timestamp: number;
// }

// const historyCache = new Map<string, HistoryCache>();
// const CACHE_DURATION = 30000; // 30 seconds

// export function clearHistoryCache(sellerId?: string): void {
//   if (sellerId) {
//     historyCache.delete(sellerId);
//     console.log('🗑️ Cleared history cache for seller:', sellerId);
//   } else {
//     historyCache.clear();
//     console.log('🗑️ Cleared all history cache');
//   }
// }

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
// // ✅ GET SUBSCRIPTION HISTORY - ENTERPRISE LEVEL FIX
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
//     console.log('═══════════════════════════════════════════════════════');
//     console.log('📋 [HISTORY] Fetching subscription history from main table');
//     console.log('👤 Seller ID:', sellerId);
    
//     if (!sellerId?.trim()) {
//       throw new Error('Seller ID is required');
//     }
    
//     // ✅ CHECK CACHE
//     const cacheKey = `${sellerId}_${JSON.stringify(filters)}`;
//     if (!lastDoc && !filters.status && !filters.dateRange) {
//       const cached = historyCache.get(cacheKey);
//       if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
//         console.log('📦 [CACHE HIT] Returning cached history');
//         return {
//           items: cached.items,
//           hasMore: cached.items.length >= pageSize,
//           lastDoc: null,
//           total: cached.items.length
//         };
//       }
//     }
    
//     let items: SubscriptionHistoryItem[] = [];
    
//     // ═══════════════════════════════════════════════════════════
//     // ✅ METHOD 1: COMPOSITE QUERY (Targeting 'subscriptions')
//     // ═══════════════════════════════════════════════════════════
    
//     try {
//       let q = query(
//         collection(db, 'subscriptions'), // 👈 FIXED: Direct access to main table
//         where('seller_id', '==', sellerId),
//         orderBy('created_at', 'desc'),
//         limit(pageSize + 1)
//       );
      
//       if (lastDoc) {
//         q = query(q, startAfter(lastDoc));
//       }
      
//       const snapshot = await getDocs(q);
//       const docs = snapshot.docs;
//       const hasMore = docs.length > pageSize;
//       const actualDocs = hasMore ? docs.slice(0, pageSize) : docs;
//       const newLastDoc = actualDocs.length > 0 ? actualDocs[actualDocs.length - 1] : null;
      
//       for (const docSnapshot of actualDocs) {
//         const data = docSnapshot.data();
        
//         // 🧠 SMART MAPPING: Map Backend fields to Frontend expectations
//         const rawStartDate = data.start_date || data.created_at || data.purchased_at || new Date().toISOString();
//         const rawEndDate = data.end_date || data.expired_at || new Date().toISOString();
        
//         const purchasedDateTime = formatDateTime(rawStartDate);
//         const expiredDateTime = formatDateTime(rawEndDate);
        
//         // Handle varying naming conventions between new backend and old history
//         const planPrice = safeNumber(data.amount_paid ?? data.plan_price ?? data.amount, 0);
//         const scansUsed = safeNumber(data.current_scan_count ?? data.total_scans_used, 0);
//         const scanLimit = safeNumber(data.scan_limit ?? data.limits?.max_scans, -1);
        
//         const historyItem: SubscriptionHistoryItem = {
//           id: docSnapshot.id,
//           seller_id: data.seller_id || '',
//           plan_id: data.plan_id || '',
//           plan_name: data.plan_name || 'Unknown Plan',
//           plan_price: planPrice,
//           currency: data.currency || 'INR',
          
//           purchased_at: rawStartDate,
//           purchased_date: purchasedDateTime.date,
//           purchased_time: purchasedDateTime.time,
//           purchased_day: purchasedDateTime.day,
          
//           expired_at: rawEndDate,
//           expired_date: expiredDateTime.date,
//           expired_time: expiredDateTime.time,
//           expired_day: expiredDateTime.day,
          
//           status: data.status || 'expired', // 'active', 'replaced', 'expired', 'completed'
          
//           payment_id: data.payment_id || data.last_payment_id || '',
//           payment_status: data.payment_status || 'completed',
          
//           total_scans_used: scansUsed,
//           scan_limit: scanLimit,
          
//           validity_duration: safeNumber(data.validity_duration, 30),
//           validity_unit: data.validity_unit || 'days',
//           total_days: calculateTotalDays(rawStartDate, rawEndDate),
          
//           created_at: data.created_at || rawStartDate
//         };
        
//         // ✅ APPLY FILTERS
//         if (filters.status && filters.status !== 'all' && historyItem.status !== filters.status) {
//           continue;
//         }
        
//         if (filters.dateRange) {
//           try {
//             const purchaseDate = new Date(historyItem.purchased_at);
//             const startFilterDate = new Date(filters.dateRange.start);
//             const endFilterDate = new Date(filters.dateRange.end);
//             if (purchaseDate < startFilterDate || purchaseDate > endFilterDate) continue;
//           } catch (dateError) {
//             console.warn('Date filter error:', dateError);
//           }
//         }
        
//         if (filters.planName && !historyItem.plan_name.toLowerCase().includes(filters.planName.toLowerCase())) {
//           continue;
//         }
        
//         items.push(historyItem);
//       }
      
//       // ✅ CACHE RESULTS
//       if (!lastDoc && items.length > 0) {
//         historyCache.set(cacheKey, { items, stats: null, timestamp: Date.now() });
//       }
      
//       return { items, hasMore, lastDoc: newLastDoc, total: snapshot.size };
      
//     } catch (indexError: any) {
//       console.warn('⚠️ [METHOD 1] Composite query failed, falling back to simple query');
      
//       // ═══════════════════════════════════════════════════════════
//       // ✅ FALLBACK METHOD 2: SIMPLE QUERY + CLIENT-SIDE SORT
//       // ═══════════════════════════════════════════════════════════
      
//       const simpleQuery = query(
//         collection(db, 'subscriptions'), // 👈 FIXED
//         where('seller_id', '==', sellerId)
//       );
      
//       const snapshot = await getDocs(simpleQuery);
//       if (snapshot.empty) return { items: [], hasMore: false, lastDoc: null, total: 0 };
      
//       const allItems: SubscriptionHistoryItem[] = [];
      
//       for (const docSnapshot of snapshot.docs) {
//         const data = docSnapshot.data();
        
//         const rawStartDate = data.start_date || data.created_at || data.purchased_at || new Date().toISOString();
//         const rawEndDate = data.end_date || data.expired_at || new Date().toISOString();
        
//         const purchasedDateTime = formatDateTime(rawStartDate);
//         const expiredDateTime = formatDateTime(rawEndDate);
        
//         const historyItem: SubscriptionHistoryItem = {
//           id: docSnapshot.id,
//           seller_id: data.seller_id || '',
//           plan_id: data.plan_id || '',
//           plan_name: data.plan_name || 'Unknown Plan',
//           plan_price: safeNumber(data.amount_paid ?? data.plan_price ?? data.amount, 0),
//           currency: data.currency || 'INR',
//           purchased_at: rawStartDate,
//           purchased_date: purchasedDateTime.date,
//           purchased_time: purchasedDateTime.time,
//           purchased_day: purchasedDateTime.day,
//           expired_at: rawEndDate,
//           expired_date: expiredDateTime.date,
//           expired_time: expiredDateTime.time,
//           expired_day: expiredDateTime.day,
//           status: data.status || 'expired',
//           payment_id: data.payment_id || data.last_payment_id || '',
//           payment_status: data.payment_status || 'completed',
//           total_scans_used: safeNumber(data.current_scan_count ?? data.total_scans_used, 0),
//           scan_limit: safeNumber(data.scan_limit ?? data.limits?.max_scans, -1),
//           validity_duration: safeNumber(data.validity_duration, 30),
//           validity_unit: data.validity_unit || 'days',
//           total_days: calculateTotalDays(rawStartDate, rawEndDate),
//           created_at: data.created_at || rawStartDate
//         };
        
//         if (filters.status && filters.status !== 'all' && historyItem.status !== filters.status) continue;
//         if (filters.planName && !historyItem.plan_name.toLowerCase().includes(filters.planName.toLowerCase())) continue;
        
//         allItems.push(historyItem);
//       }
      
//       // ✅ CLIENT-SIDE SORT (LATEST FIRST)
//       allItems.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      
//       const startIndex = lastDoc ? parseInt(lastDoc) : 0;
//       const endIndex = startIndex + pageSize;
//       const paginatedItems = allItems.slice(startIndex, endIndex);
//       const hasMore = endIndex < allItems.length;
      
//       if (!lastDoc && paginatedItems.length > 0) {
//         historyCache.set(cacheKey, { items: paginatedItems, stats: null, timestamp: Date.now() });
//       }
      
//       return { items: paginatedItems, hasMore, lastDoc: hasMore ? endIndex.toString() : null, total: allItems.length };
//     }
//   } catch (error: any) {
//     console.error('❌ [HISTORY] Fatal error:', error);
//     return { items: [], hasMore: false, lastDoc: null, total: 0 };
//   }
// };

// // ═══════════════════════════════════════════════════════════════
// // ✅ GET HISTORY STATS - SMART CALCULATION
// // ═══════════════════════════════════════════════════════════════

// export const getSellerHistoryStats = async (sellerId: string): Promise<HistoryStats> => {
//   try {
//     if (!sellerId?.trim()) throw new Error('Seller ID is required');
    
//     const cached = historyCache.get(sellerId);
//     if (cached?.stats && Date.now() - cached.timestamp < CACHE_DURATION) {
//       return cached.stats;
//     }
    
//     // ✅ POINT TO NEW TABLE
//     const q = query(
//       collection(db, 'subscriptions'),
//       where('seller_id', '==', sellerId)
//     );
    
//     const snapshot = await getDocs(q);
    
//     if (snapshot.empty) {
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
    
//     snapshot.docs.forEach(docSnapshot => {
//       const data = docSnapshot.data();
      
//       // ✅ Handle new amount fields
//       const planPrice = safeNumber(data.amount_paid ?? data.plan_price ?? data.amount, 0);
//       totalAmountSpent += planPrice;
      
//       const planName = data.plan_name || 'Unknown Plan';
//       planCounts[planName] = (planCounts[planName] || 0) + 1;
      
//       const status = data.status || 'expired';
//       if (status === 'active') {
//         activePlans++;
//       } else {
//         expiredPlans++; // Groups replaced, expired, completed together
//       }
      
//       const rawStartDate = data.start_date || data.created_at || data.purchased_at;
//       const rawEndDate = data.end_date || data.expired_at;
      
//       if (rawStartDate && rawEndDate) {
//         const days = calculateTotalDays(rawStartDate, rawEndDate);
//         if (days > 0) {
//           totalDays += days;
//           validDurationCount++;
//         }
//       }
//     });
    
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
    
//     // Update cache
//     const existingCache = historyCache.get(sellerId);
//     if (existingCache) {
//       existingCache.stats = stats;
//       existingCache.timestamp = Date.now();
//     } else {
//       historyCache.set(sellerId, { items: [], stats, timestamp: Date.now() });
//     }
    
//     return stats;
    
//   } catch (error: any) {
//     console.error('❌ [STATS] Error calculating stats:', error);
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
//   getSellerHistoryStats,
//   clearHistoryCache
// };

// console.log('✅ History Service loaded - PRODUCTION v5.0 (SINGLE SOURCE OF TRUTH)'); 
import {
  collection,
  getDocs,
  query,
  where
} from 'firebase/firestore';
import { db } from './firebase';
import type { SubscriptionHistoryItem, HistoryFilters, HistoryStats } from '../types/history.types';

// ═══════════════════════════════════════════════════════════════
// ✅ CACHE MANAGEMENT (FIXED FOR SELLER)
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
    for (const key of historyCache.keys()) {
      if (key.includes(sellerId)) {
        historyCache.delete(key);
      }
    }
    console.log('🗑️ Cleared history cache for seller:', sellerId);
  } else {
    historyCache.clear();
    console.log('🗑️ Cleared all history cache');
  }
}

// ═══════════════════════════════════════════════════════════════
// ✅ SMART DATE FORMATTERS & UTILITIES
// ═══════════════════════════════════════════════════════════════

const getValidDateString = (val: any): string => {
  if (!val) return new Date().toISOString();
  if (val.toDate && typeof val.toDate === 'function') {
    return val.toDate().toISOString();
  }
  if (val.seconds) {
    return new Date(val.seconds * 1000).toISOString();
  }
  return String(val);
};

const formatDateTime = (dateString: string) => {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return { date: 'Invalid Date', time: 'Invalid Time', day: 'Unknown', full: 'Invalid Date' };
    }
    
    const options: Intl.DateTimeFormatOptions = {
      timeZone: 'Asia/Kolkata', year: 'numeric', month: 'short', day: '2-digit',
      hour: '2-digit', minute: '2-digit', hour12: true
    };
    
    const formatted = date.toLocaleString('en-IN', options);
    const dayName = date.toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata', weekday: 'long' });
    const [datePart, timePart] = formatted.split(', ');
    
    return { 
      date: datePart || 'Unknown Date', 
      time: timePart || 'Unknown Time', 
      day: dayName || 'Unknown Day', 
      full: formatted 
    };
  } catch (error) {
    return { date: 'Error', time: 'Error', day: 'Error', full: 'Error' };
  }
};

const calculateTotalDays = (startDate: string, endDate: string): number => {
  try {
    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();
    if (isNaN(start) || isNaN(end)) return 0;
    
    // 🔥 YAHAN FIX KIYA HAI: Removing extra .getTime() because start and end are already numbers
    const diffTime = end - start; 
    const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return days > 0 ? days : 0;
  } catch (error) {
    console.warn('Date calculation error:', error);
    return 0;
  }
};

const safeNumber = (value: any, defaultValue: number = 0): number => {
  if (typeof value === 'number' && !isNaN(value)) return value;
  if (typeof value === 'string') {
    const parsed = parseFloat(value);
    return !isNaN(parsed) ? parsed : defaultValue;
  }
  return defaultValue;
};

// ═══════════════════════════════════════════════════════════════
// ✅ GET SUBSCRIPTION HISTORY 
// ═══════════════════════════════════════════════════════════════

export const getSellerSubscriptionHistory = async (
  sellerId: string,
  filters: HistoryFilters = {},
  pageSize: number = 10,
  lastDoc?: any
): Promise<{ items: SubscriptionHistoryItem[]; hasMore: boolean; lastDoc: any; total: number; }> => {
  try {
    console.log('📋 [HISTORY] Fetching subscription history from subscriptions table');
    if (!sellerId?.trim()) throw new Error('Seller ID is required');

    const cacheKey = `${sellerId}_${JSON.stringify(filters)}`;
    if (!lastDoc && !filters.status && !filters.dateRange) {
      const cached = historyCache.get(cacheKey);
      if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        console.log('📦 [CACHE HIT] Returning cached history');
        return { 
          items: cached.items, 
          hasMore: cached.items.length >= pageSize, 
          lastDoc: null, 
          total: cached.items.length 
        };
      }
    }

    const q = query(
      collection(db, 'subscriptions'), 
      where('seller_id', '==', sellerId)
    );

    const snapshot = await getDocs(q);
    
    if (snapshot.empty) {
      return { items: [], hasMore: false, lastDoc: null, total: 0 };
    }

    const allItems: SubscriptionHistoryItem[] = [];

    snapshot.docs.forEach(docSnapshot => {
      const data = docSnapshot.data();
      
      const rawStartDate = getValidDateString(data.start_date || data.created_at || data.purchased_at);
      const rawEndDate = getValidDateString(data.end_date || data.expired_at);
      const createdAtStr = getValidDateString(data.created_at || rawStartDate);
      
      const purchasedDateTime = formatDateTime(rawStartDate);
      const expiredDateTime = formatDateTime(rawEndDate);
      
      const historyItem: SubscriptionHistoryItem = {
        id: docSnapshot.id,
        seller_id: data.seller_id || '',
        plan_id: data.plan_id || '',
        plan_name: data.plan_name || 'Unknown Plan',
        plan_price: safeNumber(data.amount_paid ?? data.plan_price ?? data.amount, 0),
        currency: data.currency || 'INR',
        
        purchased_at: rawStartDate,
        purchased_date: purchasedDateTime.date,
        purchased_time: purchasedDateTime.time,
        purchased_day: purchasedDateTime.day,
        
        expired_at: rawEndDate,
        expired_date: expiredDateTime.date,
        expired_time: expiredDateTime.time,
        expired_day: expiredDateTime.day,
        
        status: data.status || 'expired',
        
        payment_id: data.payment_id || data.last_payment_id || '',
        payment_status: data.payment_status || 'completed',
        
        total_scans_used: safeNumber(data.current_scan_count ?? data.total_scans_used, 0),
        scan_limit: safeNumber(data.scan_limit ?? data.limits?.max_scans, -1),
        
        validity_duration: safeNumber(data.validity_duration, 30),
        validity_unit: data.validity_unit || 'days',
        total_days: calculateTotalDays(rawStartDate, rawEndDate),
        
        created_at: createdAtStr
      };

      if (filters.status && filters.status !== 'all' && historyItem.status !== filters.status) return;
      if (filters.planName && !historyItem.plan_name.toLowerCase().includes(filters.planName.toLowerCase())) return;
      
      allItems.push(historyItem);
    });

    // ✅ YAHAN PE SORTING HO RAHI HAI: Sabse latest (jo plan abhi liya hai) upar rahega
    allItems.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    const startIndex = lastDoc ? parseInt(lastDoc) : 0;
    const endIndex = startIndex + pageSize;
    const paginatedItems = allItems.slice(startIndex, endIndex);
    const hasMore = endIndex < allItems.length;
    const newLastDoc = hasMore ? endIndex.toString() : null;

    if (!lastDoc && paginatedItems.length > 0) {
      historyCache.set(cacheKey, { items: paginatedItems, stats: null, timestamp: Date.now() });
    }

    console.log(`✅ Loaded and sorted ${paginatedItems.length} items (Total: ${allItems.length})`);
    return { items: paginatedItems, hasMore, lastDoc: newLastDoc, total: allItems.length };

  } catch (error) {
    console.error('❌ [HISTORY] Error:', error);
    return { items: [], hasMore: false, lastDoc: null, total: 0 };
  }
};

// ═══════════════════════════════════════════════════════════════
// ✅ GET HISTORY STATS
// ═══════════════════════════════════════════════════════════════

export const getSellerHistoryStats = async (sellerId: string): Promise<HistoryStats> => {
  try {
    console.log('📊 [STATS] Calculating history stats for seller:', sellerId);
    if (!sellerId?.trim()) throw new Error('Seller ID is required');
    
    const cached = historyCache.get(sellerId);
    if (cached?.stats && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.stats;
    }
    
    const q = query(collection(db, 'subscriptions'), where('seller_id', '==', sellerId));
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) {
      return { 
        total_plans_purchased: 0, total_amount_spent: 0, active_plans: 0, 
        expired_plans: 0, average_plan_duration: 0, most_purchased_plan: 'No plans yet' 
      };
    }
    
    let totalAmountSpent = 0; 
    let activePlans = 0; 
    let expiredPlans = 0; 
    let totalDays = 0; 
    let validDurationCount = 0;
    const planCounts: { [key: string]: number } = {};
    
    snapshot.docs.forEach(docSnapshot => {
      const data = docSnapshot.data();
      
      const planPrice = safeNumber(data.amount_paid ?? data.plan_price ?? data.amount, 0);
      totalAmountSpent += planPrice;
      
      const planName = data.plan_name || 'Unknown Plan';
      planCounts[planName] = (planCounts[planName] || 0) + 1;
      
      const status = data.status || 'expired';
      if (status === 'active') {
        activePlans++;
      } else {
        expiredPlans++;
      }
      
      const rawStartDate = getValidDateString(data.start_date || data.created_at || data.purchased_at);
      const rawEndDate = getValidDateString(data.end_date || data.expired_at);
      const days = calculateTotalDays(rawStartDate, rawEndDate);
      
      if (days > 0) { 
        totalDays += days; 
        validDurationCount++; 
      }
    });
    
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
      total_amount_spent: totalAmountSpent,
      active_plans: activePlans,
      expired_plans: expiredPlans,
      average_plan_duration: validDurationCount > 0 ? Math.round(totalDays / validDurationCount) : 0,
      most_purchased_plan: mostPurchasedPlan
    };
    
    const existingCache = historyCache.get(sellerId);
    if (existingCache) { 
      existingCache.stats = stats; 
      existingCache.timestamp = Date.now(); 
    } else { 
      historyCache.set(sellerId, { items: [], stats, timestamp: Date.now() }); 
    }
    
    console.log('✅ [STATS] Calculated successfully');
    return stats;
    
  } catch (error) {
    console.error('❌ [STATS] Error calculating stats:', error);
    return { 
      total_plans_purchased: 0, total_amount_spent: 0, active_plans: 0, 
      expired_plans: 0, average_plan_duration: 0, most_purchased_plan: 'Error' 
    };
  }
};

export default { 
  getSellerSubscriptionHistory, 
  getSellerHistoryStats, 
  clearHistoryCache 
};