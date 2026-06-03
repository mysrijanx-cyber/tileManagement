
import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
  writeBatch
} from 'firebase/firestore';
import { db } from './firebase';
import { getPlanById } from './planService';
import type { Subscription, CreateSubscriptionData } from '../types/payment.types';

// ═══════════════════════════════════════════════════════════════
// ✅ CACHE MANAGEMENT
// ═══════════════════════════════════════════════════════════════

interface CachedSubscription {
  data: Subscription;
  timestamp: number;
}

let subscriptionCache: Map<string, CachedSubscription> = new Map();
const CACHE_DURATION = 30000; // 30 seconds

export function clearSubscriptionCache(sellerId?: string): void {
  if (sellerId) {
    subscriptionCache.delete(sellerId);
    console.log('🗑️ Cleared subscription cache for seller:', sellerId);
  } else {
    subscriptionCache.clear();
    console.log('🗑️ Cleared all subscription cache');
  }
}

// ═══════════════════════════════════════════════════════════════
// ✅ CALCULATE END DATE
// ═══════════════════════════════════════════════════════════════

const calculateEndDate = (
  startDate: Date,
  validityDuration: number,
  validityUnit: string
): Date => {
  const endDate = new Date(startDate);
  
  switch (validityUnit) {
    case 'minutes':
      endDate.setMinutes(endDate.getMinutes() + validityDuration);
      break;
    case 'hours':
      endDate.setHours(endDate.getHours() + validityDuration);
      break;
    case 'days':
      endDate.setDate(endDate.getDate() + validityDuration);
      break;
    case 'months':
      endDate.setMonth(endDate.getMonth() + validityDuration);
      break;
    case 'years':
      endDate.setFullYear(endDate.getFullYear() + validityDuration);
      break;
    default:
      endDate.setDate(endDate.getDate() + validityDuration);
  }
  
  return endDate;
};

const ensureSubscriptionScanLimit = async (subscription: Subscription): Promise<Subscription> => {
  if (subscription.scan_limit !== undefined || !subscription.plan_id) {
    return subscription;
  }

  const plan = await getPlanById(subscription.plan_id);
  if (!plan?.limits || plan.limits.max_scans === undefined) {
    return subscription;
  }

  const scanLimit = plan.limits.max_scans;
  subscription.scan_limit = scanLimit;

  try {
    await updateDoc(doc(db, 'subscriptions', subscription.id), {
      scan_limit: scanLimit,
      updated_at: new Date().toISOString()
    });
    console.log('✅ Hydrated missing scan_limit for subscription:', subscription.id);
  } catch (error) {
    console.warn('⚠️ Could not persist missing scan_limit for subscription:', subscription.id, error);
  }

  return subscription;
};

// ═══════════════════════════════════════════════════════════════
// ✅ CREATE SUBSCRIPTION (WITH SCAN COUNT INIT)
// ═══════════════════════════════════════════════════════════════

// export const createSubscription = async (
//   data: CreateSubscriptionData
// ): Promise<{ success: boolean; subscriptionId?: string; error?: string }> => {
//   try {
//     console.log('➕ Creating subscription for seller:', data.seller_id);
    
//     // STEP 1: Deactivate old subscriptions
//     console.log('🔄 Deactivating old subscriptions...');
//     try {
//       const oldSubsQuery = query(
//         collection(db, 'subscriptions'),
//         where('seller_id', '==', data.seller_id),
//         where('status', '==', 'active')
//       );
      
//       const oldSubsSnapshot = await getDocs(oldSubsQuery);
      
//       if (!oldSubsSnapshot.empty) {
//         console.log(`📋 Found ${oldSubsSnapshot.size} old subscription(s) - Deactivating...`);
        
//         const batch = writeBatch(db);
        
//         oldSubsSnapshot.docs.forEach(oldDoc => {
//           batch.update(oldDoc.ref, {
//             status: 'replaced',
//             replaced_at: new Date().toISOString(),
//             replaced_by: 'new_subscription'
//           });
//           console.log(`  ⚠️ Marking as replaced: ${oldDoc.id}`);
//         });
        
//         await batch.commit();
//         console.log('✅ Old subscriptions deactivated');
//       } else {
//         console.log('ℹ️ No old subscriptions to deactivate');
//       }
//     } catch (deactivateError) {
//       console.warn('⚠️ Could not deactivate old subscriptions:', deactivateError);
//     }
    
//     // STEP 2: Get plan details
//     const plan = await getPlanById(data.plan_id);
    
//     if (!plan) {
//       throw new Error('Plan not found');
//     }
    
//     console.log('📋 Plan loaded:', plan.plan_name);
//     console.log('⏱️ Plan validity:', plan.validity_duration, plan.validity_unit);
//     console.log('🔢 Plan scan limit:', plan.limits?.max_scans ?? 'Not set');
    
//     const startDate = new Date();
//     let endDate: Date;
    
//     // STEP 3: Calculate end date
//     if (plan.validity_duration && plan.validity_unit) {
//       endDate = calculateEndDate(startDate, plan.validity_duration, plan.validity_unit);
//       console.log('✅ Expiry calculated:', endDate.toISOString());
//     } else {
//       endDate = new Date();
//       if (data.billing_cycle === 'monthly') {
//         endDate.setMonth(endDate.getMonth() + 1);
//       } else {
//         endDate.setFullYear(endDate.getFullYear() + 1);
//       }
//       console.log('⚠️ Using fallback expiry:', endDate.toISOString());
//     }
    
//     const renewalDate = new Date(endDate);
    
//     // STEP 4: Create subscription document
//     const subscription: Omit<Subscription, 'id'> = {
//       seller_id: data.seller_id,
//       plan_id: data.plan_id,
//       plan_name: plan.plan_name,
      
//       status: 'active',
      
//       start_date: Timestamp.fromDate(startDate).toDate().toISOString(),
//       end_date: Timestamp.fromDate(endDate).toDate().toISOString(),
//       renewal_date: Timestamp.fromDate(renewalDate).toDate().toISOString(),
      
//       last_payment_id: data.payment_id,
//       auto_renew: true,
      
//       current_scan_count: 0,  // ✅ Initialize scan count
      
//       created_at: Timestamp.now().toDate().toISOString()
//     };
    
//     console.log('💾 Saving subscription to Firestore...');
//     const docRef = await addDoc(collection(db, 'subscriptions'), subscription);
    
//     console.log('✅ Subscription created with ID:', docRef.id);
    
//     // STEP 5: Verify saved data
//     const savedDoc = await getDoc(docRef);
//     if (savedDoc.exists()) {
//       const savedData = savedDoc.data();
//       console.log('✅ Verification - Saved scan count:', savedData.current_scan_count);
//     }
    
//     // STEP 6: Update seller document
//     try {
//       const sellerQuery = query(
//         collection(db, 'sellers'),
//         where('user_id', '==', data.seller_id),
//         limit(1)
//       );
//       const sellerSnapshot = await getDocs(sellerQuery);
      
//       if (!sellerSnapshot.empty) {
//         const sellerDoc = sellerSnapshot.docs[0];
//         await updateDoc(doc(db, 'sellers', sellerDoc.id), {
//           subscription_id: docRef.id,
//           subscription_plan: data.plan_id,
//           subscription_plan_name: plan.plan_name,
//           subscription_status: 'active',
//           subscription_start_date: startDate.toISOString(),
//           subscription_end_date: endDate.toISOString(),
//           updated_at: new Date().toISOString()
//         });
//         console.log('✅ Seller document updated');
//       }
//     } catch (updateError) {
//       console.warn('⚠️ Could not update seller document:', updateError);
//     }
    
//     // STEP 7: Log activity
//     try {
//       await addDoc(collection(db, 'sellerActivity'), {
//         seller_id: data.seller_id,
//         activity_type: 'subscription_created',
//         subscription_id: docRef.id,
//         plan_id: data.plan_id,
//         plan_name: plan.plan_name,
//         payment_id: data.payment_id,
//         timestamp: new Date().toISOString()
//       });
//       console.log('✅ Activity logged');
//     } catch (logError) {
//       console.warn('⚠️ Could not log activity:', logError);
//     }
    
//     // STEP 8: Clear cache
//     clearSubscriptionCache(data.seller_id);
//     console.log('🗑️ Cache cleared after subscription creation');
    
//     return { success: true, subscriptionId: docRef.id };
    
//   } catch (error: any) {
//     console.error('❌ Error creating subscription:', error);
//     return { success: false, error: error.message };
//   }
// };
 
// ═══════════════════════════════════════════════════════════════
// ✅ CREATE SUBSCRIPTION (WITH HISTORY ENTRY) - v13.0 FINAL
// ═══════════════════════════════════════════════════════════════

export const createSubscription = async (
  data: CreateSubscriptionData
): Promise<{ success: boolean; subscriptionId?: string; error?: string }> => {
  try {
    console.log('➕ Creating subscription for seller:', data.seller_id);
    
    // STEP 1: Deactivate old subscriptions
    console.log('🔄 Deactivating old subscriptions...');
    try {
      const oldSubsQuery = query(
        collection(db, 'subscriptions'),
        where('seller_id', '==', data.seller_id),
        where('status', '==', 'active')
      );
      
      const oldSubsSnapshot = await getDocs(oldSubsQuery);
      
      if (!oldSubsSnapshot.empty) {
        console.log(`📋 Found ${oldSubsSnapshot.size} old subscription(s) - Deactivating...`);
        
        const batch = writeBatch(db);
        
        oldSubsSnapshot.docs.forEach(oldDoc => {
          batch.update(oldDoc.ref, {
            status: 'replaced',
            replaced_at: new Date().toISOString(),
            replaced_by: 'new_subscription'
          });
          console.log(`  ⚠️ Marking as replaced: ${oldDoc.id}`);
        });
        
        await batch.commit();
        console.log('✅ Old subscriptions deactivated');
      } else {
        console.log('ℹ️ No old subscriptions to deactivate');
      }
    } catch (deactivateError) {
      console.warn('⚠️ Could not deactivate old subscriptions:', deactivateError);
    }
    
    // STEP 2: Get plan details
    const plan = await getPlanById(data.plan_id);
    
    if (!plan) {
      throw new Error('Plan not found');
    }
    
    console.log('📋 Plan loaded:', plan.plan_name);
    console.log('⏱️ Plan validity:', plan.validity_duration, plan.validity_unit);
    console.log('🔢 Plan scan limit:', plan.limits?.max_scans ?? 'Not set');
    console.log('💰 Plan price:', plan.price);
    
    const startDate = new Date();
    let endDate: Date;
    
    // STEP 3: Calculate end date
    if (plan.validity_duration && plan.validity_unit) {
      endDate = calculateEndDate(startDate, plan.validity_duration, plan.validity_unit);
      console.log('✅ Expiry calculated:', endDate.toISOString());
    } else {
      endDate = new Date();
      if (data.billing_cycle === 'monthly') {
        endDate.setMonth(endDate.getMonth() + 1);
      } else {
        endDate.setFullYear(endDate.getFullYear() + 1);
      }
      console.log('⚠️ Using fallback expiry:', endDate.toISOString());
    }
    
    const renewalDate = new Date(endDate);
    
    // STEP 4: Create subscription document
    const subscription: Omit<Subscription, 'id'> = {
      seller_id: data.seller_id,
      plan_id: data.plan_id,
      plan_name: plan.plan_name,
      
      status: 'active',
      
      start_date: Timestamp.fromDate(startDate).toDate().toISOString(),
      end_date: Timestamp.fromDate(endDate).toDate().toISOString(),
      renewal_date: Timestamp.fromDate(renewalDate).toDate().toISOString(),
      
      last_payment_id: data.payment_id,
      auto_renew: true,
      
      current_scan_count: 0,  // ✅ Initialize scan count
      scan_limit: plan.limits?.max_scans ?? -1,
      
      created_at: Timestamp.now().toDate().toISOString(),
      updated_at: Timestamp.now().toDate().toISOString()
    };
    
    console.log('💾 Saving subscription to Firestore...');
    const docRef = await addDoc(collection(db, 'subscriptions'), subscription);
    
    console.log('✅ Subscription created with ID:', docRef.id);
    
    // ═══════════════════════════════════════════════════════════════
    // ✅ STEP 5: CREATE HISTORY ENTRY (NEW - CRITICAL FIX)
    // ═══════════════════════════════════════════════════════════════
    
    try {
      console.log('📝 Creating subscription history entry...');
      
      const historyEntry = {
        // Core IDs
        seller_id: data.seller_id,
        plan_id: data.plan_id,
        subscription_id: docRef.id,
        payment_id: data.payment_id,
        
        // Plan Details
        plan_name: plan.plan_name,
        plan_price: plan.price,
        currency: plan.currency || 'INR',
        billing_cycle: data.billing_cycle,
        
        // Dates
        purchased_at: startDate.toISOString(),
        start_date: startDate.toISOString(),
        end_date: endDate.toISOString(),
        
        // Plan Validity
        validity_duration: plan.validity_duration || 30,
        validity_unit: plan.validity_unit || 'days',
        
        // Plan Limits
        scan_limit: plan.limits?.max_scans ?? -1,
        max_tiles: plan.limits?.max_tiles ?? -1,
        max_qr_codes: plan.limits?.max_qr_codes ?? -1,
        max_workers: plan.limits?.max_workers ?? -1,
        
        // Status
        status: 'active',
        payment_status: 'completed',
        
        // Usage (initial)
        total_scans_used: 0,
        
        // Metadata
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      const historyRef = await addDoc(
        collection(db, 'subscription_history'), 
        historyEntry
      );
      
      console.log('✅ History entry created with ID:', historyRef.id);
      
    } catch (historyError) {
      console.error('❌ Failed to create history entry:', historyError);
      // Don't throw - subscription already created
    }
    
    // STEP 6: Verify saved data
    const savedDoc = await getDoc(docRef);
    if (savedDoc.exists()) {
      const savedData = savedDoc.data();
      console.log('✅ Verification - Saved scan count:', savedData.current_scan_count);
    }
    
    // STEP 7: Update seller document
    try {
      const sellerQuery = query(
        collection(db, 'sellers'),
        where('user_id', '==', data.seller_id),
        limit(1)
      );
      const sellerSnapshot = await getDocs(sellerQuery);
      
      if (!sellerSnapshot.empty) {
        const sellerDoc = sellerSnapshot.docs[0];
        await updateDoc(doc(db, 'sellers', sellerDoc.id), {
          subscription_id: docRef.id,
          subscription_plan: data.plan_id,
          subscription_plan_name: plan.plan_name,
          subscription_status: 'active',
          subscription_start_date: startDate.toISOString(),
          subscription_end_date: endDate.toISOString(),
          updated_at: new Date().toISOString()
        });
        console.log('✅ Seller document updated');
      }
    } catch (updateError) {
      console.warn('⚠️ Could not update seller document:', updateError);
    }
    
    // STEP 8: Log activity
    try {
      await addDoc(collection(db, 'sellerActivity'), {
        seller_id: data.seller_id,
        activity_type: 'subscription_created',
        subscription_id: docRef.id,
        plan_id: data.plan_id,
        plan_name: plan.plan_name,
        payment_id: data.payment_id,
        timestamp: new Date().toISOString()
      });
      console.log('✅ Activity logged');
    } catch (logError) {
      console.warn('⚠️ Could not log activity:', logError);
    }
    
    // STEP 9: Clear cache
    clearSubscriptionCache(data.seller_id);
    console.log('🗑️ Cache cleared after subscription creation');
    
    return { success: true, subscriptionId: docRef.id };
    
  } catch (error: any) {
    console.error('❌ Error creating subscription:', error);
    return { success: false, error: error.message };
  }
};
// ═══════════════════════════════════════════════════════════════
// ✅ GET SELLER SUBSCRIPTION (WITH CACHE)
// ═══════════════════════════════════════════════════════════════

// export const getSellerSubscription = async (
//   sellerId: string,
//   forceRefresh: boolean = false
// ): Promise<Subscription | null> => {
//   try {
//     console.log('🔍 Fetching subscription for seller:', sellerId, '(Force:', forceRefresh, ')');
    
//     // Check cache
//     if (!forceRefresh) {
//       const cached = subscriptionCache.get(sellerId);
//       if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
//         console.log('📦 Returning cached subscription:', cached.data.id);
//         return cached.data;
//       }
//     }
    
//     if (!sellerId || sellerId.trim() === '') {
//       console.warn('⚠️ Invalid seller ID');
//       return null;
//     }
    
//     // Try composite query first
//     try {
//       const q = query(
//         collection(db, 'subscriptions'),
//         where('seller_id', '==', sellerId),
//         where('status', '==', 'active'),
//         orderBy('created_at', 'desc'),
//         limit(1)
//       );
      
//       const snapshot = await getDocs(q);
      
//       if (!snapshot.empty) {
//         const data = snapshot.docs[0].data();
//         const subscription: Subscription = {
//           id: snapshot.docs[0].id,
//           ...data
//         } as Subscription;
        
//         // Store in cache
//         subscriptionCache.set(sellerId, {
//           data: subscription,
//           timestamp: Date.now()
//         });
        
//         console.log('✅ Subscription found (composite query):', subscription.id);
//         return subscription;
//       }
//     } catch (indexError) {
//       console.warn('⚠️ Composite query failed, trying fallback...', indexError);
      
//       // Fallback: Simple query
//       const simpleQuery = query(
//         collection(db, 'subscriptions'),
//         where('seller_id', '==', sellerId),
//         where('status', '==', 'active')
//       );
      
//       const simpleSnapshot = await getDocs(simpleQuery);
      
//       if (!simpleSnapshot.empty) {
//         const subscriptions = simpleSnapshot.docs.map(doc => ({
//           id: doc.id,
//           ...doc.data()
//         } as Subscription));
        
//         subscriptions.sort((a, b) => {
//           const dateA = new Date(a.created_at).getTime();
//           const dateB = new Date(b.created_at).getTime();
//           return dateB - dateA;
//         });
        
//         const subscription = subscriptions[0];
        
//         // Store in cache
//         subscriptionCache.set(sellerId, {
//           data: subscription,
//           timestamp: Date.now()
//         });
        
//         console.log('✅ Subscription found (fallback query):', subscription.id);
//         return subscription;
//       }
//     }
    
//     console.log('ℹ️ No active subscription found');
//     return null;
    
//   } catch (error: any) {
//     console.error('❌ Error fetching subscription:', error);
//     return null;
//   }
// };  
export const getSellerSubscription = async (
  sellerId: string,
  forceRefresh: boolean = false
): Promise<Subscription | null> => {
  try {
    console.log('🔍 Fetching subscription for seller:', sellerId, '(Force:', forceRefresh, ')');
    
    // Check cache
    if (!forceRefresh) {
      const cached = subscriptionCache.get(sellerId);
      if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        console.log('📦 Returning cached subscription:', cached.data.id);
        return cached.data;
      }
    }
    
    if (!sellerId || sellerId.trim() === '') {
      console.warn('⚠️ Invalid seller ID');
      return null;
    }
    
    // ✅ FIX: Get ACTIVE subscription first (exclude "replaced")
    try {
      const q = query(
        collection(db, 'subscriptions'),
        where('seller_id', '==', sellerId),
        where('status', 'in', ['active', 'pending']),  // ✅ GET ACTIVE ONLY
        orderBy('created_at', 'desc'),
        limit(1)
      );
      
      const snapshot = await getDocs(q);
      
      if (!snapshot.empty) {
        const data = snapshot.docs[0].data();
        const subscription: Subscription = {
          id: snapshot.docs[0].id,
          ...data
        } as Subscription;
        const hydratedSubscription = await ensureSubscriptionScanLimit(subscription);
        
        subscriptionCache.set(sellerId, {
          data: hydratedSubscription,
          timestamp: Date.now()
        });
        
        console.log('✅ Subscription found:', hydratedSubscription.id, '- Status:', hydratedSubscription.status);
        return hydratedSubscription;
      }
    } catch (indexError) {
      console.warn('⚠️ Query with status filter failed, trying simple query...', indexError);
      
      // ✅ FIX: Fallback - get all and filter in code
      const simpleQuery = query(
        collection(db, 'subscriptions'),
        where('seller_id', '==', sellerId)
      );
      
      const simpleSnapshot = await getDocs(simpleQuery);
      
      if (!simpleSnapshot.empty) {
        const subscriptions = simpleSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Subscription));
        
        // ✅ Filter out "replaced" subscriptions - get active/pending
        const activeSubscriptions = subscriptions.filter(sub => 
          sub.status === 'active' || sub.status === 'pending'
        );
        
        if (activeSubscriptions.length > 0) {
          activeSubscriptions.sort((a, b) => {
            const dateA = new Date(a.created_at).getTime();
            const dateB = new Date(b.created_at).getTime();
            return dateB - dateA;
          });
          
          let subscription = activeSubscriptions[0];
          subscription = await ensureSubscriptionScanLimit(subscription);
          subscription = await ensureSubscriptionScanLimit(subscription);
          
          subscriptionCache.set(sellerId, {
            data: subscription,
            timestamp: Date.now()
          });
          
          console.log('✅ Subscription found (filtered):', subscription.id, '- Status:', subscription.status);
          return subscription;
        }
        
        // ✅ If no active found, get latest regardless
        subscriptions.sort((a, b) => {
          const dateA = new Date(a.created_at).getTime();
          const dateB = new Date(b.created_at).getTime();
          return dateB - dateA;
        });
        
        let subscription = subscriptions[0];
        subscription = await ensureSubscriptionScanLimit(subscription);
        
        subscriptionCache.set(sellerId, {
          data: subscription,
          timestamp: Date.now()
        });
        
        console.log('✅ Subscription found (latest):', subscription.id, '- Status:', subscription.status);
        return subscription;
      }
    }
    
    console.log('ℹ️ No subscription found');
    return null;
    
  } catch (error: any) {
    console.error('❌ Error fetching subscription:', error);
    return null;
  }
};



// ═══════════════════════════════════════════════════════════════
// ✅ CHECK IF EXPIRED
// ═══════════════════════════════════════════════════════════════

// export const isSubscriptionExpired = (subscription: Subscription): boolean => {
//   if (!subscription.end_date) {
//     console.warn('⚠️ No end_date in subscription');
//     return true;
//   }
  
//   const endDate = new Date(subscription.end_date);
//   const now = new Date();
  
//   const isExpired = now > endDate;
  
//   console.log('🔍 Expiry check:', {
//     endDate: endDate.toISOString(),
//     now: now.toISOString(),
//     isExpired
//   });
  
//   return isExpired;
// }; 

/**
 * ✅ COMPLETE EXPIRY CHECK - v13.0 PRODUCTION
 * Checks: Status + Time + Scan Limit
 */
export const isSubscriptionExpired = (subscription: Subscription | null | undefined): boolean => {
  if (!subscription) {
    console.log('⚠️ [EXPIRY CHECK] No subscription provided - treating as expired');
    return true;
  }

  // ✅ FIX: Check status with proper type handling
  const completedStatuses: string[] = ['completed', 'cancelled', 'replaced', 'expired'];
  if (completedStatuses.includes(subscription.status)) {
    console.log('✅ [EXPIRY CHECK] Status-based expiry:', subscription.status);
    return true;
  }

  // Check time-based expiry
  if (subscription.end_date) {
    const now = new Date();
    const endDate = new Date(subscription.end_date);
    
    if (now > endDate) {
      console.log('✅ [EXPIRY CHECK] Time expired:', {
        endDate: endDate.toISOString(),
        now: now.toISOString()
      });
      return true;
    }
  }

  // Check scan limit expiry
  const scanLimit = subscription.scan_limit;
  const currentCount = subscription.current_scan_count || 0;
  
  const hasLimit = typeof scanLimit === 'number' && scanLimit > 0;
  const limitReached = typeof scanLimit === 'number' && scanLimit > 0 && currentCount >= scanLimit;

  if (hasLimit && limitReached) {
    console.log('✅ [EXPIRY CHECK] Scan limit reached:', {
      used: currentCount,
      limit: scanLimit
    });
    return true;
  }

  console.log('✅ [EXPIRY CHECK] Subscription is ACTIVE:', {
    status: subscription.status,
    scans: `${currentCount}/${scanLimit || '∞'}`,
    timeLeft: subscription.end_date ? 
      `${Math.ceil((new Date(subscription.end_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24))} days` : 
      'N/A'
  });

  return false;
};
// ═══════════════════════════════════════════════════════════════
// ✅ GET DAYS UNTIL EXPIRY
// ═══════════════════════════════════════════════════════════════

export const getDaysUntilExpiry = (subscription: Subscription): number => {
  if (!subscription.end_date) {
    return 0;
  }
  
  const endDate = new Date(subscription.end_date);
  const now = new Date();
  
  const diffTime = endDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays > 0 ? diffDays : 0;
};

// ═══════════════════════════════════════════════════════════════
// ✅ INCREMENT SCAN COUNT - PRODUCTION READY v12.0 FINAL
// ═══════════════════════════════════════════════════════════════

export const incrementScanCount = async (
  sellerId: string
): Promise<{ 
  success: boolean; 
  newCount?: number; 
  limitReached?: boolean;
  subscriptionExpired?: boolean;
  error?: string 
}> => {
  try {
    console.log('═══════════════════════════════════════════════════════');
    console.log('📊 [INCREMENT SCAN] Starting for seller:', sellerId);
    
    const subscription = await getSellerSubscription(sellerId, true);
    
    if (!subscription) {
      console.log('ℹ️ [INCREMENT] No subscription - skipping');
      console.log('═══════════════════════════════════════════════════════');
      return { success: true };
    }
    
    const plan = await getPlanById(subscription.plan_id);
    
    const currentCount = subscription.current_scan_count || 0;
    const newCount = currentCount + 1;
    const maxScans = plan?.limits?.max_scans ?? -1;
    
    console.log('📊 [INCREMENT] Count calculation:');
    console.log('   Current:', currentCount);
    console.log('   New:', newCount);
    console.log('   Max:', maxScans === -1 ? 'UNLIMITED' : maxScans);
    
    const subsRef = doc(db, 'subscriptions', subscription.id);
    
    // Check if limit exceeded (overflow)
    const limitExceeded = maxScans !== -1 && newCount > maxScans;
    
    if (limitExceeded) {
      console.log('🚫 [INCREMENT] LIMIT EXCEEDED - Expiring subscription');
      console.log('   Attempted:', newCount);
      console.log('   Max allowed:', maxScans);
      
      await updateDoc(subsRef, {
        current_scan_count: maxScans,
        last_scan_at: new Date().toISOString(),
        status: 'completed',
        completed_at: new Date().toISOString(),
        completion_reason: 'scan_limit_exceeded',
        updated_at: new Date().toISOString()
      });
      
      console.log('🔴 Subscription marked as COMPLETED (overflow)');
      clearSubscriptionCache(sellerId);
      
      console.log('═══════════════════════════════════════════════════════');
      
      return { 
        success: true, 
        newCount: maxScans, 
        limitReached: true,
        subscriptionExpired: true
      };
      
    } else {
      // Within limit or exactly at limit
      console.log('✅ [INCREMENT] Within limit - Saving count');
      
      // Prepare update data
      const updateData: any = {
        current_scan_count: newCount,
        scan_limit: maxScans,
        last_scan_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      // Persist count (do NOT mark completed at equality - allow exactly maxScans)
      await updateDoc(subsRef, updateData);

      console.log('✅ Count saved:', currentCount, '→', newCount);

      if (maxScans !== -1) {
        console.log('📊 Remaining:', Math.max(0, maxScans - newCount), 'scans');
      }

      clearSubscriptionCache(sellerId);
      console.log('═══════════════════════════════════════════════════════');

      return {
        success: true,
        newCount,
        limitReached: false,
        subscriptionExpired: false
      };
    }
    
  } catch (error: any) {
    console.error('❌ [INCREMENT] Error:', error);
    console.log('═══════════════════════════════════════════════════════');
    return { success: false, error: error.message };
  }
};

// ═══════════════════════════════════════════════════════════════
// ✅ GET REMAINING SCANS - PRODUCTION READY v12.0 FINAL
// ═══════════════════════════════════════════════════════════════

export const getRemainingScanCount = async (
  sellerId: string
): Promise<{ 
  remaining: number; 
  total: number; 
  used: number; 
  unlimited: boolean;
  limitReached: boolean;
}> => {
  try {
    const subscription = await getSellerSubscription(sellerId, true);
    
    if (!subscription) {
      return { 
        remaining: 0, 
        total: 0, 
        used: 0, 
        unlimited: false,
        limitReached: true
      };
    }
    
    const plan = await getPlanById(subscription.plan_id);
    
    if (!plan || !plan.limits) {
      return { 
        remaining: 0, 
        total: 0, 
        used: subscription.current_scan_count || 0, 
        unlimited: false,
        limitReached: true
      };
    }
    
    const maxScans = plan.limits.max_scans;
    
    if (maxScans === -1) {
      return {
        remaining: -1,
        total: -1,
        used: subscription.current_scan_count || 0,
        unlimited: true,
        limitReached: false
      };
    }
    
    const used = subscription.current_scan_count || 0;
    const remaining = Math.max(0, maxScans - used);
    
    // ✅ CRITICAL FIX: >= (not >)
    const limitReached = used >= maxScans;
    
    console.log('📊 [GET REMAINING]:', {
      used,
      max: maxScans,
      remaining,
      limitReached
    });
    
    return {
      remaining,
      total: maxScans,
      used,
      unlimited: false,
      limitReached
    };
    
  } catch (error: any) {
    console.error('❌ Error getting remaining scans:', error);
    return { 
      remaining: 0, 
      total: 0, 
      used: 0, 
      unlimited: true,
      limitReached: false
    };
  }
};

// ═══════════════════════════════════════════════════════════════
// ✅ EXPORTS
// ═══════════════════════════════════════════════════════════════

export default {
  createSubscription,
  getSellerSubscription,
  isSubscriptionExpired,
  getDaysUntilExpiry,
  clearSubscriptionCache,
  incrementScanCount,
  getRemainingScanCount
};

console.log('✅ Subscription Service loaded - v12.0 PRODUCTION FINAL (SCAN LIMIT COMPLETE)');