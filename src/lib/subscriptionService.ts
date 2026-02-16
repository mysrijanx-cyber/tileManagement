// ═══════════════════════════════════════════════════════════════
// ✅ SUBSCRIPTION SERVICE - PRODUCTION READY v2.0
// ═══════════════════════════════════════════════════════════════

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
  limit
} from 'firebase/firestore';
import { db } from './firebase';
import type { Subscription, CreateSubscriptionData } from '../types/payment.types';

export const createSubscription = async (
  data: CreateSubscriptionData
): Promise<{ success: boolean; subscriptionId?: string; error?: string }> => {
  try {
    console.log('➕ Creating subscription...');
    
    const startDate = new Date();
    const endDate = new Date();
    
    if (data.billing_cycle === 'monthly') {
      endDate.setMonth(endDate.getMonth() + 1);
    } else {
      endDate.setFullYear(endDate.getFullYear() + 1);
    }
    
    const renewalDate = new Date(endDate);
    
    const subscription: Omit<Subscription, 'id'> = {
      seller_id: data.seller_id,
      plan_id: data.plan_id,
      
      status: 'active',
      
      start_date: startDate.toISOString(),
      end_date: endDate.toISOString(),
      renewal_date: renewalDate.toISOString(),
      
      last_payment_id: data.payment_id,
      auto_renew: true,
      
      created_at: new Date().toISOString()
    };
    
    const docRef = await addDoc(collection(db, 'subscriptions'), subscription);
    
    console.log('✅ Subscription created:', docRef.id);
    
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
          subscription_status: 'active',
          subscription_end_date: endDate.toISOString(),
          updated_at: new Date().toISOString()
        });
        console.log('✅ Seller subscription updated');
      }
    } catch (updateError) {
      console.warn('⚠️ Could not update seller document:', updateError);
    }
    
    try {
      await addDoc(collection(db, 'sellerActivity'), {
        seller_id: data.seller_id,
        activity_type: 'subscription_created',
        subscription_id: docRef.id,
        plan_id: data.plan_id,
        payment_id: data.payment_id,
        billing_cycle: data.billing_cycle,
        timestamp: new Date().toISOString()
      });
    } catch (logError) {
      console.warn('⚠️ Could not log activity:', logError);
    }
    
    return { success: true, subscriptionId: docRef.id };
    
  } catch (error: any) {
    console.error('❌ Error creating subscription:', error);
    return { success: false, error: error.message };
  }
};

export const getSellerSubscription = async (sellerId: string): Promise<Subscription | null> => {
  try {
    console.log('🔍 Fetching subscription for seller:', sellerId);
    
    const q = query(
      collection(db, 'subscriptions'),
      where('seller_id', '==', sellerId),
      where('status', '==', 'active'),
      orderBy('created_at', 'desc'),
      limit(1)
    );
    
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) {
      console.log('⚠️ No active subscription found');
      return null;
    }
    
    const subscription: Subscription = {
      id: snapshot.docs[0].id,
      ...snapshot.docs[0].data()
    } as Subscription;
    
    console.log('✅ Subscription found:', subscription.plan_id);
    return subscription;
    
  } catch (error: any) {
    console.error('❌ Error fetching subscription:', error);
    return null;
  }
};

export const getSubscriptionHistory = async (
  sellerId: string,
  limitCount: number = 10
): Promise<Subscription[]> => {
  try {
    console.log('📋 Fetching subscription history...');
    
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
    
  } catch (error: any) {
    console.error('❌ Error fetching subscription history:', error);
    return [];
  }
};

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

export const isSubscriptionExpired = (subscription: Subscription): boolean => {
  if (!subscription.end_date) return true;
  
  const endDate = new Date(subscription.end_date);
  const now = new Date();
  
  return now > endDate;
};

export const getDaysUntilExpiry = (subscription: Subscription): number => {
  if (!subscription.end_date) return 0;
  
  const endDate = new Date(subscription.end_date);
  const now = new Date();
  
  const diffTime = endDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays > 0 ? diffDays : 0;
};

export default {
  createSubscription,
  getSellerSubscription,
  getSubscriptionHistory,
  cancelSubscription,
  isSubscriptionExpired,
  getDaysUntilExpiry
};

console.log('✅ Subscription Service loaded - PRODUCTION v2.0');