// // // ═══════════════════════════════════════════════════════════════
// // // ✅ SUBSCRIPTION SERVICE - PRODUCTION READY v2.0
// // // ═══════════════════════════════════════════════════════════════

// // import {
// //   collection,
// //   doc,
// //   getDoc,
// //   getDocs,
// //   addDoc,
// //   updateDoc,
// //   query,
// //   where,
// //   orderBy,
// //   limit
// // } from 'firebase/firestore';
// // import { db } from './firebase';
// // import type { Subscription, CreateSubscriptionData } from '../types/payment.types';

// // export const createSubscription = async (
// //   data: CreateSubscriptionData
// // ): Promise<{ success: boolean; subscriptionId?: string; error?: string }> => {
// //   try {
// //     console.log('➕ Creating subscription...');
    
// //     const startDate = new Date();
// //     const endDate = new Date();
    
// //     if (data.billing_cycle === 'monthly') {
// //       endDate.setMonth(endDate.getMonth() + 1);
// //     } else {
// //       endDate.setFullYear(endDate.getFullYear() + 1);
// //     }
    
// //     const renewalDate = new Date(endDate);
    
// //     const subscription: Omit<Subscription, 'id'> = {
// //       seller_id: data.seller_id,
// //       plan_id: data.plan_id,
      
// //       status: 'active',
      
// //       start_date: startDate.toISOString(),
// //       end_date: endDate.toISOString(),
// //       renewal_date: renewalDate.toISOString(),
      
// //       last_payment_id: data.payment_id,
// //       auto_renew: true,
      
// //       created_at: new Date().toISOString()
// //     };
    
// //     const docRef = await addDoc(collection(db, 'subscriptions'), subscription);
    
// //     console.log('✅ Subscription created:', docRef.id);
    
// //     try {
// //       const sellerQuery = query(
// //         collection(db, 'sellers'),
// //         where('user_id', '==', data.seller_id),
// //         limit(1)
// //       );
// //       const sellerSnapshot = await getDocs(sellerQuery);
      
// //       if (!sellerSnapshot.empty) {
// //         const sellerDoc = sellerSnapshot.docs[0];
// //         await updateDoc(doc(db, 'sellers', sellerDoc.id), {
// //           subscription_id: docRef.id,
// //           subscription_plan: data.plan_id,
// //           subscription_status: 'active',
// //           subscription_end_date: endDate.toISOString(),
// //           updated_at: new Date().toISOString()
// //         });
// //         console.log('✅ Seller subscription updated');
// //       }
// //     } catch (updateError) {
// //       console.warn('⚠️ Could not update seller document:', updateError);
// //     }
    
// //     try {
// //       await addDoc(collection(db, 'sellerActivity'), {
// //         seller_id: data.seller_id,
// //         activity_type: 'subscription_created',
// //         subscription_id: docRef.id,
// //         plan_id: data.plan_id,
// //         payment_id: data.payment_id,
// //         billing_cycle: data.billing_cycle,
// //         timestamp: new Date().toISOString()
// //       });
// //     } catch (logError) {
// //       console.warn('⚠️ Could not log activity:', logError);
// //     }
    
// //     return { success: true, subscriptionId: docRef.id };
    
// //   } catch (error: any) {
// //     console.error('❌ Error creating subscription:', error);
// //     return { success: false, error: error.message };
// //   }
// // };

// // export const getSellerSubscription = async (sellerId: string): Promise<Subscription | null> => {
// //   try {
// //     console.log('🔍 Fetching subscription for seller:', sellerId);
    
// //     const q = query(
// //       collection(db, 'subscriptions'),
// //       where('seller_id', '==', sellerId),
// //       where('status', '==', 'active'),
// //       orderBy('created_at', 'desc'),
// //       limit(1)
// //     );
    
// //     const snapshot = await getDocs(q);
    
// //     if (snapshot.empty) {
// //       console.log('⚠️ No active subscription found');
// //       return null;
// //     }
    
// //     const subscription: Subscription = {
// //       id: snapshot.docs[0].id,
// //       ...snapshot.docs[0].data()
// //     } as Subscription;
    
// //     console.log('✅ Subscription found:', subscription.plan_id);
// //     return subscription;
    
// //   } catch (error: any) {
// //     console.error('❌ Error fetching subscription:', error);
// //     return null;
// //   }
// // };

// // export const getSubscriptionHistory = async (
// //   sellerId: string,
// //   limitCount: number = 10
// // ): Promise<Subscription[]> => {
// //   try {
// //     console.log('📋 Fetching subscription history...');
    
// //     const q = query(
// //       collection(db, 'subscriptions'),
// //       where('seller_id', '==', sellerId),
// //       orderBy('created_at', 'desc'),
// //       limit(limitCount)
// //     );
    
// //     const snapshot = await getDocs(q);
    
// //     const subscriptions: Subscription[] = snapshot.docs.map(doc => ({
// //       id: doc.id,
// //       ...doc.data()
// //     } as Subscription));
    
// //     console.log(`✅ Fetched ${subscriptions.length} subscriptions`);
// //     return subscriptions;
    
// //   } catch (error: any) {
// //     console.error('❌ Error fetching subscription history:', error);
// //     return [];
// //   }
// // };

// // export const cancelSubscription = async (
// //   subscriptionId: string,
// //   reason: string
// // ): Promise<{ success: boolean; error?: string }> => {
// //   try {
// //     console.log('❌ Cancelling subscription:', subscriptionId);
    
// //     await updateDoc(doc(db, 'subscriptions', subscriptionId), {
// //       status: 'cancelled',
// //       auto_renew: false,
// //       cancelled_at: new Date().toISOString(),
// //       cancellation_reason: reason
// //     });
    
// //     console.log('✅ Subscription cancelled');
    
// //     const subDoc = await getDoc(doc(db, 'subscriptions', subscriptionId));
// //     if (subDoc.exists()) {
// //       const subData = subDoc.data();
      
// //       try {
// //         const sellerQuery = query(
// //           collection(db, 'sellers'),
// //           where('user_id', '==', subData.seller_id),
// //           limit(1)
// //         );
// //         const sellerSnapshot = await getDocs(sellerQuery);
        
// //         if (!sellerSnapshot.empty) {
// //           await updateDoc(doc(db, 'sellers', sellerSnapshot.docs[0].id), {
// //             subscription_status: 'cancelled',
// //             updated_at: new Date().toISOString()
// //           });
// //         }
// //       } catch (updateError) {
// //         console.warn('⚠️ Could not update seller:', updateError);
// //       }
      
// //       try {
// //         await addDoc(collection(db, 'sellerActivity'), {
// //           seller_id: subData.seller_id,
// //           activity_type: 'subscription_cancelled',
// //           subscription_id: subscriptionId,
// //           plan_id: subData.plan_id,
// //           cancellation_reason: reason,
// //           timestamp: new Date().toISOString()
// //         });
// //       } catch (logError) {
// //         console.warn('⚠️ Could not log activity:', logError);
// //       }
// //     }
    
// //     return { success: true };
    
// //   } catch (error: any) {
// //     console.error('❌ Error cancelling subscription:', error);
// //     return { success: false, error: error.message };
// //   }
// // };

// // export const isSubscriptionExpired = (subscription: Subscription): boolean => {
// //   if (!subscription.end_date) return true;
  
// //   const endDate = new Date(subscription.end_date);
// //   const now = new Date();
  
// //   return now > endDate;
// // };

// // export const getDaysUntilExpiry = (subscription: Subscription): number => {
// //   if (!subscription.end_date) return 0;
  
// //   const endDate = new Date(subscription.end_date);
// //   const now = new Date();
  
// //   const diffTime = endDate.getTime() - now.getTime();
// //   const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
// //   return diffDays > 0 ? diffDays : 0;
// // };

// // export default {
// //   createSubscription,
// //   getSellerSubscription,
// //   getSubscriptionHistory,
// //   cancelSubscription,
// //   isSubscriptionExpired,
// //   getDaysUntilExpiry
// // };

// // console.log('✅ Subscription Service loaded - PRODUCTION v2.0'); 
// // ═══════════════════════════════════════════════════════════════
// // ✅ SUBSCRIPTION SERVICE - PRODUCTION v4.0 (ALL ISSUES FIXED)
// // ═══════════════════════════════════════════════════════════════

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
//   Timestamp
// } from 'firebase/firestore';
// import { db } from './firebase';
// import { getPlanById } from './planService';
// import type { Subscription, CreateSubscriptionData } from '../types/payment.types';

// // ✨ Calculate end date based on plan validity
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

// // ✅ CREATE SUBSCRIPTION
// export const createSubscription = async (
//   data: CreateSubscriptionData
// ): Promise<{ success: boolean; subscriptionId?: string; error?: string }> => {
//   try {
//     console.log('➕ Creating subscription for seller:', data.seller_id);
    
//     // Get plan details
//     const plan = await getPlanById(data.plan_id);
    
//     if (!plan) {
//       throw new Error('Plan not found');
//     }
    
//     console.log('📋 Plan loaded:', plan.plan_name);
//     console.log('⏱️ Plan validity:', plan.validity_duration, plan.validity_unit);
    
//     const startDate = new Date();
//     let endDate: Date;
    
//     // Use plan's validity duration
//     if (plan.validity_duration && plan.validity_unit) {
//       endDate = calculateEndDate(startDate, plan.validity_duration, plan.validity_unit);
//       console.log('✅ Expiry calculated:', endDate.toISOString());
//     } else {
//       // Fallback to billing cycle
//       endDate = new Date();
//       if (data.billing_cycle === 'monthly') {
//         endDate.setMonth(endDate.getMonth() + 1);
//       } else {
//         endDate.setFullYear(endDate.getFullYear() + 1);
//       }
//       console.log('⚠️ Using fallback expiry:', endDate.toISOString());
//     }
    
//     const renewalDate = new Date(endDate);
    
//     const subscription: Omit<Subscription, 'id'> = {
//       seller_id: data.seller_id,
//       plan_id: data.plan_id,
      
//       status: 'active',
      
//       start_date: startDate.toISOString(),
//       end_date: endDate.toISOString(),
//       renewal_date: renewalDate.toISOString(),
      
//       last_payment_id: data.payment_id,
//       auto_renew: true,
      
//       created_at: new Date().toISOString()
//     };
    
//     console.log('💾 Saving subscription to Firestore...');
//     const docRef = await addDoc(collection(db, 'subscriptions'), subscription);
    
//     console.log('✅ Subscription created with ID:', docRef.id);
    
//     // Update seller document
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
    
//     // Log activity
//     try {
//       await addDoc(collection(db, 'sellerActivity'), {
//         seller_id: data.seller_id,
//         activity_type: 'subscription_created',
//         subscription_id: docRef.id,
//         plan_id: data.plan_id,
//         plan_name: plan.plan_name,
//         payment_id: data.payment_id,
//         billing_cycle: data.billing_cycle,
//         validity_duration: plan.validity_duration,
//         validity_unit: plan.validity_unit,
//         start_date: startDate.toISOString(),
//         end_date: endDate.toISOString(),
//         timestamp: new Date().toISOString()
//       });
//       console.log('✅ Activity logged');
//     } catch (logError) {
//       console.warn('⚠️ Could not log activity:', logError);
//     }
    
//     return { success: true, subscriptionId: docRef.id };
    
//   } catch (error: any) {
//     console.error('❌ Error creating subscription:', error);
//     return { success: false, error: error.message };
//   }
// };

// // ✅ GET SELLER SUBSCRIPTION (WITH FALLBACK)
// export const getSellerSubscription = async (sellerId: string): Promise<Subscription | null> => {
//   try {
//     console.log('🔍 Fetching subscription for seller:', sellerId);
    
//     if (!sellerId || sellerId.trim() === '') {
//       console.warn('⚠️ Invalid seller ID');
//       return null;
//     }
    
//     // Try with composite query first
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
//         const subscription: Subscription = {
//           id: snapshot.docs[0].id,
//           ...snapshot.docs[0].data()
//         } as Subscription;
        
//         console.log('✅ Subscription found (composite query):', subscription.id);
//         return subscription;
//       }
//     } catch (indexError) {
//       console.warn('⚠️ Composite query failed (index may be missing), trying fallback...', indexError);
      
//       // Fallback: Simple query without orderBy
//       const simpleQuery = query(
//         collection(db, 'subscriptions'),
//         where('seller_id', '==', sellerId),
//         where('status', '==', 'active')
//       );
      
//       const simpleSnapshot = await getDocs(simpleQuery);
      
//       if (!simpleSnapshot.empty) {
//         // Manually sort by created_at
//         const subscriptions = simpleSnapshot.docs.map(doc => ({
//           id: doc.id,
//           ...doc.data()
//         } as Subscription));
        
//         subscriptions.sort((a, b) => {
//           const dateA = new Date(a.created_at).getTime();
//           const dateB = new Date(b.created_at).getTime();
//           return dateB - dateA;
//         });
        
//         console.log('✅ Subscription found (fallback query):', subscriptions[0].id);
//         return subscriptions[0];
//       }
//     }
    
//     // Final fallback: Get all subscriptions for seller
//     const allQuery = query(
//       collection(db, 'subscriptions'),
//       where('seller_id', '==', sellerId)
//     );
    
//     const allSnapshot = await getDocs(allQuery);
    
//     if (!allSnapshot.empty) {
//       // Filter active and sort manually
//       const subscriptions = allSnapshot.docs
//         .map(doc => ({
//           id: doc.id,
//           ...doc.data()
//         } as Subscription))
//         .filter(sub => sub.status === 'active')
//         .sort((a, b) => {
//           const dateA = new Date(a.created_at).getTime();
//           const dateB = new Date(b.created_at).getTime();
//           return dateB - dateA;
//         });
      
//       if (subscriptions.length > 0) {
//         console.log('✅ Subscription found (final fallback):', subscriptions[0].id);
//         return subscriptions[0];
//       }
//     }
    
//     console.log('ℹ️ No active subscription found');
//     return null;
    
//   } catch (error: any) {
//     console.error('❌ Error fetching subscription:', error);
//     return null;
//   }
// };

// // ✅ GET SUBSCRIPTION HISTORY
// export const getSubscriptionHistory = async (
//   sellerId: string,
//   limitCount: number = 10
// ): Promise<Subscription[]> => {
//   try {
//     console.log('📋 Fetching subscription history...');
    
//     // Try with orderBy first
//     try {
//       const q = query(
//         collection(db, 'subscriptions'),
//         where('seller_id', '==', sellerId),
//         orderBy('created_at', 'desc'),
//         limit(limitCount)
//       );
      
//       const snapshot = await getDocs(q);
      
//       const subscriptions: Subscription[] = snapshot.docs.map(doc => ({
//         id: doc.id,
//         ...doc.data()
//       } as Subscription));
      
//       console.log(`✅ Fetched ${subscriptions.length} subscriptions`);
//       return subscriptions;
//     } catch (indexError) {
//       console.warn('⚠️ OrderBy failed, using fallback...');
      
//       // Fallback: Get all and sort manually
//       const simpleQuery = query(
//         collection(db, 'subscriptions'),
//         where('seller_id', '==', sellerId)
//       );
      
//       const snapshot = await getDocs(simpleQuery);
      
//       const subscriptions = snapshot.docs
//         .map(doc => ({
//           id: doc.id,
//           ...doc.data()
//         } as Subscription))
//         .sort((a, b) => {
//           const dateA = new Date(a.created_at).getTime();
//           const dateB = new Date(b.created_at).getTime();
//           return dateB - dateA;
//         })
//         .slice(0, limitCount);
      
//       console.log(`✅ Fetched ${subscriptions.length} subscriptions (fallback)`);
//       return subscriptions;
//     }
    
//   } catch (error: any) {
//     console.error('❌ Error fetching subscription history:', error);
//     return [];
//   }
// };

// // ✅ CANCEL SUBSCRIPTION
// export const cancelSubscription = async (
//   subscriptionId: string,
//   reason: string
// ): Promise<{ success: boolean; error?: string }> => {
//   try {
//     console.log('❌ Cancelling subscription:', subscriptionId);
    
//     await updateDoc(doc(db, 'subscriptions', subscriptionId), {
//       status: 'cancelled',
//       auto_renew: false,
//       cancelled_at: new Date().toISOString(),
//       cancellation_reason: reason
//     });
    
//     console.log('✅ Subscription cancelled');
    
//     const subDoc = await getDoc(doc(db, 'subscriptions', subscriptionId));
//     if (subDoc.exists()) {
//       const subData = subDoc.data();
      
//       try {
//         const sellerQuery = query(
//           collection(db, 'sellers'),
//           where('user_id', '==', subData.seller_id),
//           limit(1)
//         );
//         const sellerSnapshot = await getDocs(sellerQuery);
        
//         if (!sellerSnapshot.empty) {
//           await updateDoc(doc(db, 'sellers', sellerSnapshot.docs[0].id), {
//             subscription_status: 'cancelled',
//             updated_at: new Date().toISOString()
//           });
//         }
//       } catch (updateError) {
//         console.warn('⚠️ Could not update seller:', updateError);
//       }
      
//       try {
//         await addDoc(collection(db, 'sellerActivity'), {
//           seller_id: subData.seller_id,
//           activity_type: 'subscription_cancelled',
//           subscription_id: subscriptionId,
//           plan_id: subData.plan_id,
//           cancellation_reason: reason,
//           timestamp: new Date().toISOString()
//         });
//       } catch (logError) {
//         console.warn('⚠️ Could not log activity:', logError);
//       }
//     }
    
//     return { success: true };
    
//   } catch (error: any) {
//     console.error('❌ Error cancelling subscription:', error);
//     return { success: false, error: error.message };
//   }
// };

// // ✅ CHECK IF EXPIRED
// export const isSubscriptionExpired = (subscription: Subscription): boolean => {
//   if (!subscription.end_date) return true;
  
//   const endDate = new Date(subscription.end_date);
//   const now = new Date();
  
//   return now > endDate;
// };

// // ✅ GET DAYS UNTIL EXPIRY
// export const getDaysUntilExpiry = (subscription: Subscription): number => {
//   if (!subscription.end_date) return 0;
  
//   const endDate = new Date(subscription.end_date);
//   const now = new Date();
  
//   const diffTime = endDate.getTime() - now.getTime();
//   const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
//   return diffDays > 0 ? diffDays : 0;
// };

// // ✅ GET TIME UNTIL EXPIRY (HUMAN READABLE)
// export const getTimeUntilExpiry = (subscription: Subscription): string => {
//   if (!subscription.end_date) return 'Expired';
  
//   const endDate = new Date(subscription.end_date);
//   const now = new Date();
  
//   const diffMs = endDate.getTime() - now.getTime();
  
//   if (diffMs <= 0) return 'Expired';
  
//   const diffMinutes = Math.floor(diffMs / (1000 * 60));
//   const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
//   const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
//   if (diffDays > 0) {
//     return `${diffDays} day${diffDays > 1 ? 's' : ''}`;
//   } else if (diffHours > 0) {
//     return `${diffHours} hour${diffHours > 1 ? 's' : ''}`;
//   } else {
//     return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''}`;
//   }
// };

// // ✅ GET DETAILED TIME BREAKDOWN
// export const getDetailedTimeUntilExpiry = (subscription: Subscription): {
//   days: number;
//   hours: number;
//   minutes: number;
//   seconds: number;
//   isExpired: boolean;
// } => {
//   if (!subscription.end_date) {
//     return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true };
//   }
  
//   const endDate = new Date(subscription.end_date);
//   const now = new Date();
  
//   const diffMs = endDate.getTime() - now.getTime();
  
//   if (diffMs <= 0) {
//     return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true };
//   }
  
//   const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
//   const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
//   const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
//   const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);
  
//   return { days, hours, minutes, seconds, isExpired: false };
// };

// export default {
//   createSubscription,
//   getSellerSubscription,
//   getSubscriptionHistory,
//   cancelSubscription,
//   isSubscriptionExpired,
//   getDaysUntilExpiry,
//   getTimeUntilExpiry,
//   getDetailedTimeUntilExpiry
// };

// console.log('✅ Subscription Service loaded - PRODUCTION v4.0 (ALL ISSUES FIXED)'); 
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
  Timestamp
} from 'firebase/firestore';
import { db } from './firebase';
import { getPlanById } from './planService';
import type { Subscription, CreateSubscriptionData } from '../types/payment.types';

// ✨ Calculate end date based on plan validity
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

// ✅ CREATE SUBSCRIPTION
export const createSubscription = async (
  data: CreateSubscriptionData
): Promise<{ success: boolean; subscriptionId?: string; error?: string }> => {
  try {
    console.log('➕ Creating subscription for seller:', data.seller_id);
    
    // Get plan details
    const plan = await getPlanById(data.plan_id);
    
    if (!plan) {
      throw new Error('Plan not found');
    }
    
    console.log('📋 Plan loaded:', plan.plan_name);
    console.log('⏱️ Plan validity:', plan.validity_duration, plan.validity_unit);
    
    const startDate = new Date();
    let endDate: Date;
    
    // Use plan's validity duration
    if (plan.validity_duration && plan.validity_unit) {
      endDate = calculateEndDate(startDate, plan.validity_duration, plan.validity_unit);
      console.log('✅ Expiry calculated:', endDate.toISOString());
      console.log('📊 Days added:', plan.validity_duration, plan.validity_unit);
    } else {
      // Fallback to billing cycle
      endDate = new Date();
      if (data.billing_cycle === 'monthly') {
        endDate.setMonth(endDate.getMonth() + 1);
      } else {
        endDate.setFullYear(endDate.getFullYear() + 1);
      }
      console.log('⚠️ Using fallback expiry:', endDate.toISOString());
    }
    
    const renewalDate = new Date(endDate);
    
    // ✅ CRITICAL FIX: Use Firestore Timestamp instead of ISO String
    const subscription: Omit<Subscription, 'id'> = {
      seller_id: data.seller_id,
      plan_id: data.plan_id,
      plan_name: plan.plan_name, // Add plan name for easier queries
      
      status: 'active',
      
      // ✅ FIXED: Convert to Firestore Timestamp
      start_date: Timestamp.fromDate(startDate).toDate().toISOString(),
      end_date: Timestamp.fromDate(endDate).toDate().toISOString(),
      renewal_date: Timestamp.fromDate(renewalDate).toDate().toISOString(),
      
      last_payment_id: data.payment_id,
      auto_renew: true,
      
      created_at: Timestamp.now().toDate().toISOString()
    };
    
    console.log('💾 Saving subscription to Firestore...');
    console.log('📅 Start Date:', startDate.toLocaleString());
    console.log('📅 End Date:', endDate.toLocaleString());
    console.log('📊 Duration:', Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)), 'days');
    
    const docRef = await addDoc(collection(db, 'subscriptions'), subscription);
    
    console.log('✅ Subscription created with ID:', docRef.id);
    
    // Verify saved data
    const savedDoc = await getDoc(docRef);
    if (savedDoc.exists()) {
      const savedData = savedDoc.data();
      console.log('✅ Verification - Saved end_date:', savedData.end_date);
      console.log('✅ Verification - Data type:', typeof savedData.end_date);
    }
    
    // Update seller document
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
    
    // Log activity
    try {
      await addDoc(collection(db, 'sellerActivity'), {
        seller_id: data.seller_id,
        activity_type: 'subscription_created',
        subscription_id: docRef.id,
        plan_id: data.plan_id,
        plan_name: plan.plan_name,
        payment_id: data.payment_id,
        billing_cycle: data.billing_cycle,
        validity_duration: plan.validity_duration,
        validity_unit: plan.validity_unit,
        start_date: startDate.toISOString(),
        end_date: endDate.toISOString(),
        timestamp: new Date().toISOString()
      });
      console.log('✅ Activity logged');
    } catch (logError) {
      console.warn('⚠️ Could not log activity:', logError);
    }
    
    return { success: true, subscriptionId: docRef.id };
    
  } catch (error: any) {
    console.error('❌ Error creating subscription:', error);
    return { success: false, error: error.message };
  }
};

// ✅ GET SELLER SUBSCRIPTION (WITH FALLBACK)
export const getSellerSubscription = async (sellerId: string): Promise<Subscription | null> => {
  try {
    console.log('🔍 Fetching subscription for seller:', sellerId);
    
    if (!sellerId || sellerId.trim() === '') {
      console.warn('⚠️ Invalid seller ID');
      return null;
    }
    
    // Try with composite query first
    try {
      const q = query(
        collection(db, 'subscriptions'),
        where('seller_id', '==', sellerId),
        where('status', '==', 'active'),
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
        
        console.log('✅ Subscription found (composite query):', subscription.id);
        console.log('📅 End date from DB:', subscription.end_date);
        console.log('📊 Data type:', typeof subscription.end_date);
        
        return subscription;
      }
    } catch (indexError) {
      console.warn('⚠️ Composite query failed (index may be missing), trying fallback...', indexError);
      
      // Fallback: Simple query without orderBy
      const simpleQuery = query(
        collection(db, 'subscriptions'),
        where('seller_id', '==', sellerId),
        where('status', '==', 'active')
      );
      
      const simpleSnapshot = await getDocs(simpleQuery);
      
      if (!simpleSnapshot.empty) {
        // Manually sort by created_at
        const subscriptions = simpleSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Subscription));
        
        subscriptions.sort((a, b) => {
          const dateA = new Date(a.created_at).getTime();
          const dateB = new Date(b.created_at).getTime();
          return dateB - dateA;
        });
        
        console.log('✅ Subscription found (fallback query):', subscriptions[0].id);
        console.log('📅 End date from DB:', subscriptions[0].end_date);
        
        return subscriptions[0];
      }
    }
    
    // Final fallback: Get all subscriptions for seller
    const allQuery = query(
      collection(db, 'subscriptions'),
      where('seller_id', '==', sellerId)
    );
    
    const allSnapshot = await getDocs(allQuery);
    
    if (!allSnapshot.empty) {
      // Filter active and sort manually
      const subscriptions = allSnapshot.docs
        .map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Subscription))
        .filter(sub => sub.status === 'active')
        .sort((a, b) => {
          const dateA = new Date(a.created_at).getTime();
          const dateB = new Date(b.created_at).getTime();
          return dateB - dateA;
        });
      
      if (subscriptions.length > 0) {
        console.log('✅ Subscription found (final fallback):', subscriptions[0].id);
        console.log('📅 End date from DB:', subscriptions[0].end_date);
        
        return subscriptions[0];
      }
    }
    
    console.log('ℹ️ No active subscription found');
    return null;
    
  } catch (error: any) {
    console.error('❌ Error fetching subscription:', error);
    return null;
  }
};

// ✅ GET SUBSCRIPTION HISTORY
export const getSubscriptionHistory = async (
  sellerId: string,
  limitCount: number = 10
): Promise<Subscription[]> => {
  try {
    console.log('📋 Fetching subscription history...');
    
    // Try with orderBy first
    try {
      const q = query(
        collection(db, 'subscriptions'),
        where('seller_id', '==', sellerId),
        orderBy('created_at', 'desc'),
        limit(limitCount)
      );
      
      const snapshot = await getDocs(q);
      
      const subscriptions: Subscription[] = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Subscription));
      
      console.log(`✅ Fetched ${subscriptions.length} subscriptions`);
      return subscriptions;
    } catch (indexError) {
      console.warn('⚠️ OrderBy failed, using fallback...');
      
      // Fallback: Get all and sort manually
      const simpleQuery = query(
        collection(db, 'subscriptions'),
        where('seller_id', '==', sellerId)
      );
      
      const snapshot = await getDocs(simpleQuery);
      
      const subscriptions = snapshot.docs
        .map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Subscription))
        .sort((a, b) => {
          const dateA = new Date(a.created_at).getTime();
          const dateB = new Date(b.created_at).getTime();
          return dateB - dateA;
        })
        .slice(0, limitCount);
      
      console.log(`✅ Fetched ${subscriptions.length} subscriptions (fallback)`);
      return subscriptions;
    }
    
  } catch (error: any) {
    console.error('❌ Error fetching subscription history:', error);
    return [];
  }
};

// ✅ CANCEL SUBSCRIPTION
export const cancelSubscription = async (
  subscriptionId: string,
  reason: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    console.log('❌ Cancelling subscription:', subscriptionId);
    
    await updateDoc(doc(db, 'subscriptions', subscriptionId), {
      status: 'cancelled',
      auto_renew: false,
      cancelled_at: new Date().toISOString(),
      cancellation_reason: reason
    });
    
    console.log('✅ Subscription cancelled');
    
    const subDoc = await getDoc(doc(db, 'subscriptions', subscriptionId));
    if (subDoc.exists()) {
      const subData = subDoc.data();
      
      try {
        const sellerQuery = query(
          collection(db, 'sellers'),
          where('user_id', '==', subData.seller_id),
          limit(1)
        );
        const sellerSnapshot = await getDocs(sellerQuery);
        
        if (!sellerSnapshot.empty) {
          await updateDoc(doc(db, 'sellers', sellerSnapshot.docs[0].id), {
            subscription_status: 'cancelled',
            updated_at: new Date().toISOString()
          });
        }
      } catch (updateError) {
        console.warn('⚠️ Could not update seller:', updateError);
      }
      
      try {
        await addDoc(collection(db, 'sellerActivity'), {
          seller_id: subData.seller_id,
          activity_type: 'subscription_cancelled',
          subscription_id: subscriptionId,
          plan_id: subData.plan_id,
          cancellation_reason: reason,
          timestamp: new Date().toISOString()
        });
      } catch (logError) {
        console.warn('⚠️ Could not log activity:', logError);
      }
    }
    
    return { success: true };
    
  } catch (error: any) {
    console.error('❌ Error cancelling subscription:', error);
    return { success: false, error: error.message };
  }
};

// ✅ CHECK IF EXPIRED
export const isSubscriptionExpired = (subscription: Subscription): boolean => {
  if (!subscription.end_date) {
    console.warn('⚠️ No end_date in subscription');
    return true;
  }
  
  const endDate = new Date(subscription.end_date);
  const now = new Date();
  
  const isExpired = now > endDate;
  
  console.log('🔍 Expiry check:', {
    endDate: endDate.toISOString(),
    now: now.toISOString(),
    isExpired
  });
  
  return isExpired;
};

// ✅ GET DAYS UNTIL EXPIRY
export const getDaysUntilExpiry = (subscription: Subscription): number => {
  if (!subscription.end_date) {
    console.warn('⚠️ No end_date in subscription');
    return 0;
  }
  
  const endDate = new Date(subscription.end_date);
  const now = new Date();
  
  const diffTime = endDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  const days = diffDays > 0 ? diffDays : 0;
  
  console.log('📊 Days calculation:', {
    endDate: endDate.toISOString(),
    now: now.toISOString(),
    diffMs: diffTime,
    days
  });
  
  return days;
};

// ✅ GET TIME UNTIL EXPIRY (HUMAN READABLE)
export const getTimeUntilExpiry = (subscription: Subscription): string => {
  if (!subscription.end_date) return 'Expired';
  
  const endDate = new Date(subscription.end_date);
  const now = new Date();
  
  const diffMs = endDate.getTime() - now.getTime();
  
  if (diffMs <= 0) return 'Expired';
  
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffDays > 0) {
    return `${diffDays} day${diffDays > 1 ? 's' : ''}`;
  } else if (diffHours > 0) {
    return `${diffHours} hour${diffHours > 1 ? 's' : ''}`;
  } else {
    return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''}`;
  }
};

// ✅ GET DETAILED TIME BREAKDOWN
export const getDetailedTimeUntilExpiry = (subscription: Subscription): {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
} => {
  if (!subscription.end_date) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true };
  }
  
  const endDate = new Date(subscription.end_date);
  const now = new Date();
  
  const diffMs = endDate.getTime() - now.getTime();
  
  if (diffMs <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true };
  }
  
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);
  
  return { days, hours, minutes, seconds, isExpired: false };
};

export default {
  createSubscription,
  getSellerSubscription,
  getSubscriptionHistory,
  cancelSubscription,
  isSubscriptionExpired,
  getDaysUntilExpiry,
  getTimeUntilExpiry,
  getDetailedTimeUntilExpiry
};

console.log('✅ Subscription Service loaded - PRODUCTION v5.0 (COMPLETE FIX)');