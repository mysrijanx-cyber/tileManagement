
// import {
//   collection,
//   doc,
//   getDoc,
//   getDocs,
//   addDoc,
//   updateDoc,
//   query,
//   where,
//   orderBy,
//   limit,
//   Timestamp,
//   writeBatch
// } from 'firebase/firestore';
// import { db } from './firebase';
// import { getPlanById } from './planService';
// import type { Subscription, CreateSubscriptionData } from '../types/payment.types';

// // ═══════════════════════════════════════════════════════════════
// // ✅ CACHE MANAGEMENT
// // ═══════════════════════════════════════════════════════════════

// interface CachedSubscription {
//   data: Subscription;
//   timestamp: number;
// }

// let subscriptionCache: Map<string, CachedSubscription> = new Map();
// const CACHE_DURATION = 30000; // 30 seconds

// export function clearSubscriptionCache(sellerId?: string): void {
//   if (sellerId) {
//     subscriptionCache.delete(sellerId);
//     console.log('🗑️ Cleared subscription cache for seller:', sellerId);
//   } else {
//     subscriptionCache.clear();
//     console.log('🗑️ Cleared all subscription cache');
//   }
// }

// // ═══════════════════════════════════════════════════════════════
// // ✅ CALCULATE END DATE
// // ═══════════════════════════════════════════════════════════════

// const calculateEndDate = (
//   startDate: Date,
//   validityDuration: number,
//   validityUnit: string
// ): Date => {
//   const endDate = new Date(startDate);
  
//   switch (validityUnit) {
//     case 'minutes':
//       endDate.setMinutes(endDate.getMinutes() + validityDuration);
//       break;
//     case 'hours':
//       endDate.setHours(endDate.getHours() + validityDuration);
//       break;
//     case 'days':
//       endDate.setDate(endDate.getDate() + validityDuration);
//       break;
//     case 'months':
//       endDate.setMonth(endDate.getMonth() + validityDuration);
//       break;
//     case 'years':
//       endDate.setFullYear(endDate.getFullYear() + validityDuration);
//       break;
//     default:
//       endDate.setDate(endDate.getDate() + validityDuration);
//   }
  
//   return endDate;
// };

// const ensureSubscriptionScanLimit = async (subscription: Subscription): Promise<Subscription> => {
//   if (subscription.scan_limit !== undefined || !subscription.plan_id) {
//     return subscription;
//   }

//   const plan = await getPlanById(subscription.plan_id);
//   if (!plan?.limits || plan.limits.max_scans === undefined) {
//     return subscription;
//   }

//   const scanLimit = plan.limits.max_scans;
//   subscription.scan_limit = scanLimit;

//   try {
//     await updateDoc(doc(db, 'subscriptions', subscription.id), {
//       scan_limit: scanLimit,
//       updated_at: new Date().toISOString()
//     });
//     console.log('✅ Hydrated missing scan_limit for subscription:', subscription.id);
//   } catch (error) {
//     console.warn('⚠️ Could not persist missing scan_limit for subscription:', subscription.id, error);
//   }

//   return subscription;
// };

// export const createSubscription = async (
//   data: CreateSubscriptionData
// ): Promise<{ success: boolean; subscriptionId?: string; error?: string }> => {
//   try {
//     console.log('➕ Creating subscription for seller:', data.seller_id);
    
//     try {
//       const oldSubsQuery = query(
//         collection(db, 'subscriptions'),
//         where('seller_id', '==', data.seller_id),
//         where('status', '==', 'active')
//       );
      
//       const oldSubsSnapshot = await getDocs(oldSubsQuery);
      
//       if (!oldSubsSnapshot.empty) {
//         const batch = writeBatch(db);
//         oldSubsSnapshot.docs.forEach(oldDoc => {
//           batch.update(oldDoc.ref, {
//             status: 'replaced',
//             replaced_at: new Date().toISOString(),
//             replaced_by: 'new_subscription'
//           });
//         });
//         await batch.commit();
//       }
//     } catch (deactivateError) {
//       console.warn('⚠️ Could not deactivate old subscriptions:', deactivateError);
//     }
    
//     const plan = await getPlanById(data.plan_id);
//     if (!plan) throw new Error('Plan not found');
    
//     const startDate = new Date();
//     let endDate: Date;
    
//     if (plan.validity_duration && plan.validity_unit) {
//       endDate = calculateEndDate(startDate, plan.validity_duration, plan.validity_unit);
//     } else {
//       endDate = new Date();
//       if (data.billing_cycle === 'monthly') {
//         endDate.setMonth(endDate.getMonth() + 1);
//       } else {
//         endDate.setFullYear(endDate.getFullYear() + 1);
//       }
//     }
    
//     const renewalDate = new Date(endDate);
    
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
//       current_scan_count: 0,
//       scan_limit: plan.limits?.max_scans ?? -1,
//       created_at: Timestamp.now().toDate().toISOString(),
//       updated_at: Timestamp.now().toDate().toISOString()
//     };
    
//     const docRef = await addDoc(collection(db, 'subscriptions'), subscription);
    
//     try {
//       const historyEntry = {
//         seller_id: data.seller_id,
//         plan_id: data.plan_id,
//         subscription_id: docRef.id,
//         payment_id: data.payment_id,
//         plan_name: plan.plan_name,
//         plan_price: plan.price,
//         currency: plan.currency || 'INR',
//         billing_cycle: data.billing_cycle,
//         purchased_at: startDate.toISOString(),
//         start_date: startDate.toISOString(),
//         end_date: endDate.toISOString(),
//         validity_duration: plan.validity_duration || 30,
//         validity_unit: plan.validity_unit || 'days',
//         scan_limit: plan.limits?.max_scans ?? -1,
//         max_tiles: plan.limits?.max_tiles ?? -1,
//         max_qr_codes: plan.limits?.max_qr_codes ?? -1,
//         max_workers: plan.limits?.max_workers ?? -1,
//         status: 'active',
//         payment_status: 'completed',
//         total_scans_used: 0,
//         created_at: new Date().toISOString(),
//         updated_at: new Date().toISOString()
//       };
//       await addDoc(collection(db, 'subscription_history'), historyEntry);
//     } catch (historyError) {
//       console.error('❌ Failed to create history entry:', historyError);
//     }
    
//     try {
//       const sellerQuery = query(collection(db, 'sellers'), where('user_id', '==', data.seller_id), limit(1));
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
//       }
//     } catch (updateError) {
//       console.warn('⚠️ Could not update seller document:', updateError);
//     }
    
//     clearSubscriptionCache(data.seller_id);
//     return { success: true, subscriptionId: docRef.id };
    
//   } catch (error: any) {
//     console.error('❌ Error creating subscription:', error);
//     return { success: false, error: error.message };
//   }
// };

// export const getSellerSubscription = async (
//   sellerId: string,
//   forceRefresh: boolean = false
// ): Promise<Subscription | null> => {
//   try {
//     if (!forceRefresh) {
//       const cached = subscriptionCache.get(sellerId);
//       if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
//         return cached.data;
//       }
//     }
    
//     if (!sellerId || sellerId.trim() === '') return null;
    
//     try {
//       // ✅ FIX: Removed 'completed' status from here.
//       // Pehle ye purane 'completed' plan ko utha leta tha jisse banner update nahi hota tha
//       const q = query(
//         collection(db, 'subscriptions'),
//         where('seller_id', '==', sellerId),
//         where('status', 'in', ['active', 'pending']),
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
//         const hydratedSubscription = await ensureSubscriptionScanLimit(subscription);
        
//         subscriptionCache.set(sellerId, {
//           data: hydratedSubscription,
//           timestamp: Date.now()
//         });
//         return hydratedSubscription;
//       }
//     } catch (indexError) {
//       console.warn('⚠️ Fallback standard simple query executing...', indexError);
//       const simpleQuery = query(collection(db, 'subscriptions'), where('seller_id', '==', sellerId));
//       const simpleSnapshot = await getDocs(simpleQuery);
      
//       if (!simpleSnapshot.empty) {
//         const subscriptions = simpleSnapshot.docs.map(doc => ({
//           id: doc.id,
//           ...doc.data()
//         } as Subscription));
        
//         // ✅ FIX: Removed 'completed' from fallback filter too
//         const activeSubscriptions = subscriptions.filter(sub => 
//           sub.status === 'active' || sub.status === 'pending'
//         );
        
//         if (activeSubscriptions.length > 0) {
//           activeSubscriptions.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
//           let subscription = activeSubscriptions[0];
//           subscription = await ensureSubscriptionScanLimit(subscription);
          
//           subscriptionCache.set(sellerId, {
//             data: subscription,
//             timestamp: Date.now()
//           });
//           return subscription;
//         }
//       }
//     }
//     return null;
//   } catch (error) {
//     console.error('❌ Error fetching subscription:', error);
//     return null;
//   }
// };

// export const isSubscriptionExpired = (subscription: Subscription | null | undefined): boolean => {
//   if (!subscription) return true;

//   const completedStatuses: string[] = ['cancelled', 'replaced', 'expired'];
//   if (completedStatuses.includes(subscription.status)) {
//     return true;
//   }

//   if (subscription.end_date) {
//     if (new Date() > new Date(subscription.end_date)) return true;
//   }

//   const scanLimit = subscription.scan_limit;
//   const currentCount = subscription.current_scan_count || 0;
  
//   if (typeof scanLimit === 'number' && scanLimit > 0 && currentCount > scanLimit) {
//     return true;
//   }

//   return false;
// };

// export const getDaysUntilExpiry = (subscription: Subscription): number => {
//   if (!subscription.end_date) return 0;
//   const diffTime = new Date(subscription.end_date).getTime() - Date.now();
//   const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
//   return diffDays > 0 ? diffDays : 0;
// };

// export const incrementScanCount = async (
//   sellerId: string
// ): Promise<{ 
//   success: boolean; 
//   newCount?: number; 
//   limitReached?: boolean;
//   subscriptionExpired?: boolean;
//   error?: string 
// }> => {
//   try {
//     const subscription = await getSellerSubscription(sellerId, true);
    
//     if (!subscription) return { success: true };
//     if (subscription.status === 'completed') {
//       return { success: true, limitReached: true, subscriptionExpired: true };
//     }
    
//     const plan = await getPlanById(subscription.plan_id);
//     const currentCount = subscription.current_scan_count || 0;
//     const newCount = currentCount + 1;
//     const maxScans = plan?.limits?.max_scans ?? -1;
    
//     const subsRef = doc(db, 'subscriptions', subscription.id);
    
//     if (maxScans !== -1 && newCount > maxScans) {
//       console.log('🚫 [LIMIT EXCEEDED] Strict attempt overflow detected. Max scans:', maxScans);
//       await updateDoc(subsRef, {
//         status: 'completed',
//         completed_at: new Date().toISOString(),
//         completion_reason: 'scan_limit_exceeded',
//         updated_at: new Date().toISOString()
//       });
//       clearSubscriptionCache(sellerId);
//       return { 
//         success: true, 
//         newCount: currentCount, 
//         limitReached: true,
//         subscriptionExpired: true
//       };
//     }
    
//     const updateData: any = {
//       current_scan_count: newCount,
//       scan_limit: maxScans,
//       last_scan_at: new Date().toISOString(),
//       updated_at: new Date().toISOString()
//     };
    
//     await updateDoc(subsRef, updateData);
//     clearSubscriptionCache(sellerId);

//     return {
//       success: true,
//       newCount,
//       limitReached: false,
//       subscriptionExpired: false
//     };
    
//   } catch (error: any) {
//     console.error('❌ [INCREMENT] Error:', error);
//     return { success: false, error: error.message };
//   }
// };

// export const getRemainingScanCount = async (
//   sellerId: string
// ): Promise<{ 
//   remaining: number; 
//   total: number; 
//   used: number; 
//   unlimited: boolean;
//   limitReached: boolean;
// }> => {
//   try {
//     const subscription = await getSellerSubscription(sellerId, true);
    
//     if (!subscription) return { remaining: 0, total: 0, used: 0, unlimited: false, limitReached: true };
//     if (subscription.status === 'completed') {
//       return { remaining: 0, total: subscription.scan_limit || 0, used: subscription.scan_limit || 0, unlimited: false, limitReached: true };
//     }
    
//     const plan = await getPlanById(subscription.plan_id);
//     if (!plan || !plan.limits) {
//       return { remaining: 0, total: 0, used: subscription.current_scan_count || 0, unlimited: false, limitReached: true };
//     }
    
//     const maxScans = plan.limits.max_scans;
//     const used = subscription.current_scan_count || 0;
    
//     if (maxScans === -1) {
//       return { remaining: -1, total: -1, used, unlimited: true, limitReached: false };
//     }
    
//     const remaining = Math.max(0, maxScans - used);
//     const limitReached = used > maxScans;
    
//     return {
//       remaining,
//       total: maxScans,
//       used,
//       unlimited: false,
//       limitReached
//     };
    
//   } catch (error: any) {
//     console.error('❌ Error getting remaining scans:', error);
//     return { remaining: 0, total: 0, used: 0, unlimited: true, limitReached: false };
//   }
// };

// export default {
//   createSubscription,
//   getSellerSubscription,
//   isSubscriptionExpired,
//   getDaysUntilExpiry,
//   clearSubscriptionCache,
//   incrementScanCount,
//   getRemainingScanCount
// }; 
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
import { db, clearIndexedDbPersistence, disableNetwork, enableNetwork } from '../lib/firebase';
import { getPlanById } from './planService';
import type { Subscription, CreateSubscriptionData } from '../types/payment.types';

// ═══════════════════════════════════════════════════════════════
// ✅ ENHANCED CACHE MANAGEMENT
// ═══════════════════════════════════════════════════════════════

interface CachedSubscription {
  data: Subscription;
  timestamp: number;
}

let subscriptionCache: Map<string, CachedSubscription> = new Map();
const CACHE_DURATION = 30000; // 30 seconds

export async function clearSubscriptionCache(sellerId?: string): Promise<void> {
  console.log('🧹 Clearing subscription cache...');
  
  // Step 1: Clear in-memory cache
  if (sellerId) {
    subscriptionCache.delete(sellerId);
    console.log('🗑️ Cleared in-memory cache for seller:', sellerId);
  } else {
    subscriptionCache.clear();
    console.log('🗑️ Cleared all in-memory cache');
  }
  
  // Step 2: Set force refresh flag
  sessionStorage.setItem('force_firestore_refresh', Date.now().toString());
  console.log('✅ Set force refresh flag');
  
  // Step 3: Try IndexedDB clear
  try {
    await clearIndexedDbPersistence(db);
    console.log('✅ Cleared Firestore IndexedDB cache');
  } catch (clearError: any) {
    if (clearError.code === 'failed-precondition') {
      console.warn('⚠️ Active listeners detected, using network bypass instead');
      
      // Force network-only fetch by toggling network
      try {
        await disableNetwork(db);
        await new Promise(r => setTimeout(r, 100));
        await enableNetwork(db);
        console.log('✅ Network toggled to force fresh fetch');
      } catch (netError) {
        console.warn('⚠️ Network toggle failed:', netError);
      }
    } else {
      console.warn('⚠️ Cache clear warning:', clearError.message);
    }
  }
  
  console.log('✅ Cache clear complete');
}

export function shouldForceRefresh(): boolean {
  const flag = sessionStorage.getItem('force_firestore_refresh');
  if (!flag) return false;
  
  const timestamp = parseInt(flag, 10);
  const elapsed = Date.now() - timestamp;
  
  if (elapsed < 10000) {
    console.log('🔄 Force refresh active (set', elapsed, 'ms ago)');
    return true;
  }
  
  sessionStorage.removeItem('force_firestore_refresh');
  return false;
}

// ✅ Subscription confirmation polling (for race condition fix)
export async function waitForSubscriptionCreation(
  sellerId: string, 
  planId: string,
  maxAttempts: number = 10
): Promise<boolean> {
  console.log('⏱️ Waiting for subscription creation confirmation...');
  
  for (let i = 0; i < maxAttempts; i++) {
    console.log(`🔍 Polling attempt ${i + 1}/${maxAttempts}...`);
    
    const sub = await getSellerSubscription(sellerId, true);
    
    if (sub && sub.status === 'active' && sub.plan_id === planId) {
      console.log(`✅ Subscription confirmed (attempt ${i + 1})`);
      return true;
    }
    
    await new Promise(r => setTimeout(r, 500));
  }
  
  console.warn('⚠️ Subscription confirmation timeout (5 seconds elapsed)');
  return false;
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

export const createSubscription = async (
  data: CreateSubscriptionData
): Promise<{ success: boolean; subscriptionId?: string; error?: string }> => {
  try {
    console.log('➕ Creating subscription for seller:', data.seller_id);
    
    try {
      const oldSubsQuery = query(
        collection(db, 'subscriptions'),
        where('seller_id', '==', data.seller_id),
        where('status', '==', 'active')
      );
      
      const oldSubsSnapshot = await getDocs(oldSubsQuery);
      
      if (!oldSubsSnapshot.empty) {
        const batch = writeBatch(db);
        oldSubsSnapshot.docs.forEach(oldDoc => {
          batch.update(oldDoc.ref, {
            status: 'replaced',
            replaced_at: new Date().toISOString(),
            replaced_by: 'new_subscription'
          });
        });
        await batch.commit();
      }
    } catch (deactivateError) {
      console.warn('⚠️ Could not deactivate old subscriptions:', deactivateError);
    }
    
    const plan = await getPlanById(data.plan_id);
    if (!plan) throw new Error('Plan not found');
    
    const startDate = new Date();
    let endDate: Date;
    
    if (plan.validity_duration && plan.validity_unit) {
      endDate = calculateEndDate(startDate, plan.validity_duration, plan.validity_unit);
    } else {
      endDate = new Date();
      if (data.billing_cycle === 'monthly') {
        endDate.setMonth(endDate.getMonth() + 1);
      } else {
        endDate.setFullYear(endDate.getFullYear() + 1);
      }
    }
    
    const renewalDate = new Date(endDate);
    
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
      current_scan_count: 0,
      scan_limit: plan.limits?.max_scans ?? -1,
      created_at: Timestamp.now().toDate().toISOString(),
      updated_at: Timestamp.now().toDate().toISOString()
    };
    
    const docRef = await addDoc(collection(db, 'subscriptions'), subscription);
    
    try {
      const historyEntry = {
        seller_id: data.seller_id,
        plan_id: data.plan_id,
        subscription_id: docRef.id,
        payment_id: data.payment_id,
        plan_name: plan.plan_name,
        plan_price: plan.price,
        currency: plan.currency || 'INR',
        billing_cycle: data.billing_cycle,
        purchased_at: startDate.toISOString(),
        start_date: startDate.toISOString(),
        end_date: endDate.toISOString(),
        validity_duration: plan.validity_duration || 30,
        validity_unit: plan.validity_unit || 'days',
        scan_limit: plan.limits?.max_scans ?? -1,
        max_tiles: plan.limits?.max_tiles ?? -1,
        max_qr_codes: plan.limits?.max_qr_codes ?? -1,
        max_workers: plan.limits?.max_workers ?? -1,
        status: 'active',
        payment_status: 'completed',
        total_scans_used: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      await addDoc(collection(db, 'subscription_history'), historyEntry);
    } catch (historyError) {
      console.error('❌ Failed to create history entry:', historyError);
    }
    
    try {
      const sellerQuery = query(collection(db, 'sellers'), where('user_id', '==', data.seller_id), limit(1));
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
      }
    } catch (updateError) {
      console.warn('⚠️ Could not update seller document:', updateError);
    }
    
    clearSubscriptionCache(data.seller_id);
    return { success: true, subscriptionId: docRef.id };
    
  } catch (error: any) {
    console.error('❌ Error creating subscription:', error);
    return { success: false, error: error.message };
  }
};

export const getSellerSubscription = async (
  sellerId: string,
  forceRefresh: boolean = false
): Promise<Subscription | null> => {
  try {
    if (!forceRefresh) {
      const cached = subscriptionCache.get(sellerId);
      if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        return cached.data;
      }
    }
    
    if (!sellerId || sellerId.trim() === '') return null;
    
    try {
      const q = query(
        collection(db, 'subscriptions'),
        where('seller_id', '==', sellerId),
        where('status', 'in', ['active', 'pending']),
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
        return hydratedSubscription;
      }
    } catch (indexError) {
      console.warn('⚠️ Fallback standard simple query executing...', indexError);
      const simpleQuery = query(collection(db, 'subscriptions'), where('seller_id', '==', sellerId));
      const simpleSnapshot = await getDocs(simpleQuery);
      
      if (!simpleSnapshot.empty) {
        const subscriptions = simpleSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Subscription));
        
        const activeSubscriptions = subscriptions.filter(sub => 
          sub.status === 'active' || sub.status === 'pending'
        );
        
        if (activeSubscriptions.length > 0) {
          activeSubscriptions.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
          let subscription = activeSubscriptions[0];
          subscription = await ensureSubscriptionScanLimit(subscription);
          
          subscriptionCache.set(sellerId, {
            data: subscription,
            timestamp: Date.now()
          });
          return subscription;
        }
      }
    }
    return null;
  } catch (error) {
    console.error('❌ Error fetching subscription:', error);
    return null;
  }
};

export const isSubscriptionExpired = (subscription: Subscription | null | undefined): boolean => {
  if (!subscription) return true;

  const completedStatuses: string[] = ['cancelled', 'replaced', 'expired'];
  if (completedStatuses.includes(subscription.status)) {
    return true;
  }

  if (subscription.end_date) {
    if (new Date() > new Date(subscription.end_date)) return true;
  }

  const scanLimit = subscription.scan_limit;
  const currentCount = subscription.current_scan_count || 0;
  
  if (typeof scanLimit === 'number' && scanLimit > 0 && currentCount > scanLimit) {
    return true;
  }

  return false;
};

export const getDaysUntilExpiry = (subscription: Subscription): number => {
  if (!subscription.end_date) return 0;
  const diffTime = new Date(subscription.end_date).getTime() - Date.now();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays : 0;
};

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
    const subscription = await getSellerSubscription(sellerId, true);
    
    if (!subscription) return { success: true };
    if (subscription.status === 'completed') {
      return { success: true, limitReached: true, subscriptionExpired: true };
    }
    
    const plan = await getPlanById(subscription.plan_id);
    const currentCount = subscription.current_scan_count || 0;
    const newCount = currentCount + 1;
    const maxScans = plan?.limits?.max_scans ?? -1;
    
    const subsRef = doc(db, 'subscriptions', subscription.id);
    
    if (maxScans !== -1 && newCount > maxScans) {
      console.log('🚫 [LIMIT EXCEEDED] Strict attempt overflow detected. Max scans:', maxScans);
      await updateDoc(subsRef, {
        status: 'completed',
        completed_at: new Date().toISOString(),
        completion_reason: 'scan_limit_exceeded',
        updated_at: new Date().toISOString()
      });
      clearSubscriptionCache(sellerId);
      return { 
        success: true, 
        newCount: currentCount, 
        limitReached: true,
        subscriptionExpired: true
      };
    }
    
    const updateData: any = {
      current_scan_count: newCount,
      scan_limit: maxScans,
      last_scan_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    await updateDoc(subsRef, updateData);
    clearSubscriptionCache(sellerId);

    return {
      success: true,
      newCount,
      limitReached: false,
      subscriptionExpired: false
    };
    
  } catch (error: any) {
    console.error('❌ [INCREMENT] Error:', error);
    return { success: false, error: error.message };
  }
};

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
    
    if (!subscription) return { remaining: 0, total: 0, used: 0, unlimited: false, limitReached: true };
    if (subscription.status === 'completed') {
      return { remaining: 0, total: subscription.scan_limit || 0, used: subscription.scan_limit || 0, unlimited: false, limitReached: true };
    }
    
    const plan = await getPlanById(subscription.plan_id);
    if (!plan || !plan.limits) {
      return { remaining: 0, total: 0, used: subscription.current_scan_count || 0, unlimited: false, limitReached: true };
    }
    
    const maxScans = plan.limits.max_scans;
    const used = subscription.current_scan_count || 0;
    
    if (maxScans === -1) {
      return { remaining: -1, total: -1, used, unlimited: true, limitReached: false };
    }
    
    const remaining = Math.max(0, maxScans - used);
    const limitReached = used > maxScans;
    
    return {
      remaining,
      total: maxScans,
      used,
      unlimited: false,
      limitReached
    };
    
  } catch (error: any) {
    console.error('❌ Error getting remaining scans:', error);
    return { remaining: 0, total: 0, used: 0, unlimited: true, limitReached: false };
  }
};

export default {
  createSubscription,
  getSellerSubscription,
  isSubscriptionExpired,
  getDaysUntilExpiry,
  clearSubscriptionCache,
  incrementScanCount,
  getRemainingScanCount,
  waitForSubscriptionCreation,
  shouldForceRefresh
};