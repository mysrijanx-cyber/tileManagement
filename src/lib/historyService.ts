import {
  collection,
  doc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  getDoc
} from 'firebase/firestore';
import { db } from './firebase';
import type { SubscriptionHistoryItem, HistoryFilters, HistoryStats } from '../types/history.types';

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

// ✅ SAFE NUMBER CONVERSION
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
// ✅ GET SUBSCRIPTION HISTORY (FIXED)
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
    console.log('📋 Fetching subscription history for seller:', sellerId);
    
    if (!sellerId?.trim()) {
      throw new Error('Seller ID is required');
    }
    
    // ✅ SIMPLE QUERY (NO COMPOSITE INDEX NEEDED)
    let q = query(
      collection(db, 'subscriptions'),
      where('seller_id', '==', sellerId),
      limit(pageSize + 1)
    );
    
    console.log('🔍 Executing simple query...');
    const snapshot = await getDocs(q);
    
    const docs = snapshot.docs;
    const hasMore = docs.length > pageSize;
    const actualDocs = hasMore ? docs.slice(0, pageSize) : docs;
    const newLastDoc = actualDocs.length > 0 ? actualDocs[actualDocs.length - 1] : null;
    
    const items: SubscriptionHistoryItem[] = [];
    
    for (const docSnapshot of actualDocs) {
      const data = docSnapshot.data();
      
      // ✅ SAFE DATA EXTRACTION
      const planId = data.plan_id || '';
      const planName = data.plan_name || 'Unknown Plan';
      const sellerId = data.seller_id || '';
      const status = data.status || 'expired';
      
      // Get dates with fallbacks
      const startDate = data.start_date || data.created_at || new Date().toISOString();
      const endDate = data.end_date || new Date().toISOString();
      const createdAt = data.created_at || new Date().toISOString();
      
      // Format dates safely
      const purchasedDateTime = formatDateTime(startDate);
      const expiredDateTime = formatDateTime(endDate);
      
      // ✅ SAFE PLAN PRICE LOOKUP
      let planPrice = 0;
      try {
        if (planId) {
          const planDoc = await getDoc(doc(db, 'plans', planId));
          if (planDoc.exists()) {
            const planData = planDoc.data();
            planPrice = safeNumber(planData.price, 0);
          }
        }
      } catch (planError) {
        console.warn('⚠️ Could not fetch plan details:', planError);
      }
      
      // ✅ SAFE PAYMENT LOOKUP
      let paymentStatus: 'completed' | 'failed' | 'refunded' = 'completed';
      let paymentId = data.last_payment_id || '';
      
      try {
        if (data.last_payment_id) {
          const paymentDoc = await getDoc(doc(db, 'payments', data.last_payment_id));
          if (paymentDoc.exists()) {
            const paymentData = paymentDoc.data();
            paymentStatus = paymentData.payment_status === 'completed' ? 'completed' : 'failed';
          }
        }
      } catch (paymentError) {
        console.warn('⚠️ Could not fetch payment details:', paymentError);
      }
      
      // ✅ CREATE HISTORY ITEM WITH SAFE VALUES
      const historyItem: SubscriptionHistoryItem = {
        id: docSnapshot.id,
        seller_id: sellerId,
        plan_id: planId,
        plan_name: planName,
        plan_price: planPrice,
        currency: 'INR',
        
        // Purchase Details
        purchased_at: startDate,
        purchased_date: purchasedDateTime.date,
        purchased_time: purchasedDateTime.time,
        purchased_day: purchasedDateTime.day,
        
        // Expiry Details
        expired_at: endDate,
        expired_date: expiredDateTime.date,
        expired_time: expiredDateTime.time,
        expired_day: expiredDateTime.day,
        
        // Status
        status: status as any,
        
        // Payment Info
        payment_id: paymentId,
        payment_status: paymentStatus,
        
        // Usage Stats
        total_scans_used: safeNumber(data.current_scan_count, 0),
        scan_limit: -1, // Unlimited by default
        
        // Duration
        validity_duration: 30, // Default
        validity_unit: 'days',
        total_days: calculateTotalDays(startDate, endDate),
        
        created_at: createdAt
      };
      
      // Apply filters
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
    
    console.log(`✅ Fetched ${items.length} history items`);
    
    return {
      items,
      hasMore,
      lastDoc: newLastDoc,
      total: snapshot.size
    };
    
  } catch (error: any) {
    console.error('❌ Error fetching subscription history:', error);
    
    // ✅ RETURN SAFE FALLBACK
    return {
      items: [],
      hasMore: false,
      lastDoc: null,
      total: 0
    };
  }
};

// ═══════════════════════════════════════════════════════════════
// ✅ GET HISTORY STATS (FIXED)
// ═══════════════════════════════════════════════════════════════

export const getSellerHistoryStats = async (sellerId: string): Promise<HistoryStats> => {
  try {
    console.log('📊 Calculating history stats for seller:', sellerId);
    
    if (!sellerId?.trim()) {
      throw new Error('Seller ID is required');
    }
    
    // ✅ SIMPLE QUERY
    const q = query(
      collection(db, 'subscriptions'),
      where('seller_id', '==', sellerId)
    );
    
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) {
      console.log('ℹ️ No subscription history found');
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
    
    for (const docSnapshot of snapshot.docs) {
      const data = docSnapshot.data();
      
      // ✅ SAFE PLAN PRICE CALCULATION
      try {
        if (data.plan_id) {
          const planDoc = await getDoc(doc(db, 'plans', data.plan_id));
          if (planDoc.exists()) {
            const planData = planDoc.data();
            const planPrice = safeNumber(planData.price, 0);
            totalAmountSpent += planPrice;
            
            // Count plans
            const planName = planData.plan_name || 'Unknown Plan';
            planCounts[planName] = (planCounts[planName] || 0) + 1;
          }
        }
      } catch (planError) {
        console.warn('⚠️ Could not fetch plan for stats:', planError);
      }
      
      // ✅ SAFE STATUS COUNT
      const status = data.status || 'expired';
      if (status === 'active') {
        activePlans++;
      } else {
        expiredPlans++;
      }
      
      // ✅ SAFE DURATION CALCULATION
      if (data.start_date && data.end_date) {
        const days = calculateTotalDays(data.start_date, data.end_date);
        if (days > 0) {
          totalDays += days;
          validDurationCount++;
        }
      }
    }
    
    // ✅ SAFE MOST PURCHASED PLAN
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
    
    console.log('✅ History stats calculated:', stats);
    return stats;
    
  } catch (error: any) {
    console.error('❌ Error calculating history stats:', error);
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
  getSellerHistoryStats
};
