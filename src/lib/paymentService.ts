
import { auth, db } from './firebase';
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import type { Plan } from '../types/plan.types';
import type { RazorpayCheckoutOptions } from '../types/payment.types';

// ═══════════════════════════════════════════════════════════════
// ✅ TYPES
// ═══════════════════════════════════════════════════════════════

export interface Payment {
  id: string;
  seller_id: string;
  plan_id: string;
  plan_name?: string;
  amount: number;
  currency: string;
  payment_status: 'pending' | 'completed' | 'failed';
  verified: boolean;
  razorpay_order_id: string;
  razorpay_payment_id?: string;
  razorpay_signature?: string;
  razorpay_receipt: string;
  transaction_id?: string;
  created_at: string;
  updated_at?: string;
}

// ═══════════════════════════════════════════════════════════════
// ✅ CONFIG
// ═══════════════════════════════════════════════════════════════

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
const REQUEST_TIMEOUT = 30000; // 30 seconds

// Simple in-memory cache
const paymentCache = new Map<string, { data: Payment[]; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// ═══════════════════════════════════════════════════════════════
// ✅ GET FIREBASE AUTH TOKEN (WITH REFRESH)
// ═══════════════════════════════════════════════════════════════

async function getAuthToken(): Promise<string> {
  const currentUser = auth.currentUser;
  
  if (!currentUser) {
    throw new Error('User not authenticated');
  }
  
  // ✅ Force refresh to prevent expiry issues
  const token = await currentUser.getIdToken(true);
  return token;
}

// ═══════════════════════════════════════════════════════════════
// ✅ INITIATE PAYMENT (CREATE ORDER)
// ═══════════════════════════════════════════════════════════════

export async function initiatePayment(
  planId: string,
  planName: string,
  amount: number
): Promise<{
  success: boolean;
  paymentId?: string;
  checkoutOptions?: RazorpayCheckoutOptions;
  error?: string;
}> {
  try {
    console.log('🔄 [Frontend] Initiating payment...', { planId, amount });
    
    const token = await getAuthToken();
    
    // ✅ Add timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);
    
    const response = await fetch(`${BACKEND_URL}/api/payment/create-order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        planId,
        billingCycle: 'monthly',
      }),
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    
    const result = await response.json();
    
    if (!response.ok) {
      console.error('❌ [Frontend] Order creation failed:', result);
      
      if (response.status === 401) {
        return {
          success: false,
          error: 'Session expired. Please login again.',
        };
      }
      
      return {
        success: false,
        error: result.message || `Server error: ${response.status}`,
      };
    }
    
    if (!result.success) {
      return {
        success: false,
        error: result.message || 'Failed to create order',
      };
    }
    
    console.log('✅ [Frontend] Order created:', result.data);
    
    return {
      success: true,
      paymentId: result.data.paymentId,
      checkoutOptions: result.data.checkoutOptions,
    };
    
  } catch (error: any) {
    console.error('❌ [Frontend] Payment initiation error:', error);
    
    if (error.name === 'AbortError') {
      return {
        success: false,
        error: 'Request timeout. Please check your connection.',
      };
    }
    
    return {
      success: false,
      error: error.message || 'Network error. Please try again.',
    };
  }
}

// ═══════════════════════════════════════════════════════════════
// ✅ VERIFY PAYMENT
// ═══════════════════════════════════════════════════════════════

export async function verifyPayment(
  paymentId: string,
  razorpayResponse: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  }
): Promise<{
  success: boolean;
  subscriptionId?: string;
  error?: string;
}> {
  try {
    console.log('🔐 [Frontend] Verifying payment...', { paymentId });
    
    const token = await getAuthToken();
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);
    
    const response = await fetch(`${BACKEND_URL}/api/payment/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        paymentId,
        ...razorpayResponse,
      }),
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    
    const result = await response.json();
    
    if (!response.ok || !result.success) {
      console.error('❌ [Frontend] Payment verification failed:', result);
      return {
        success: false,
        error: result.message || 'Payment verification failed',
      };
    }
    
    console.log('✅ [Frontend] Payment verified:', result.data);
    
    return {
      success: true,
      subscriptionId: result.data.subscriptionId,
    };
    
  } catch (error: any) {
    console.error('❌ [Frontend] Payment verification error:', error);
    
    if (error.name === 'AbortError') {
      return {
        success: false,
        error: 'Verification timeout. Please contact support.',
      };
    }
    
    return {
      success: false,
      error: error.message || 'Failed to verify payment',
    };
  }
}

// ═══════════════════════════════════════════════════════════════
// ✅ GET PAYMENT STATUS
// ═══════════════════════════════════════════════════════════════

export async function getPaymentStatus(paymentId: string): Promise<Payment> {
  try {
    const token = await getAuthToken();
    
    const response = await fetch(`${BACKEND_URL}/api/payment/${paymentId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.message || 'Failed to fetch payment status');
    }
    
    return result.data.payment as Payment;
    
  } catch (error: any) {
    console.error('❌ [Frontend] Get payment status error:', error);
    throw error;
  }
}

// ═══════════════════════════════════════════════════════════════
// ✅ GET SELLER PAYMENTS (FOR BILLING TAB) - NEW FUNCTION
// ═══════════════════════════════════════════════════════════════

export async function getSellerPayments(
  sellerId: string,
  limitCount: number = 100,
  forceRefresh: boolean = false
): Promise<Payment[]> {
  try {
    console.log('📋 [PaymentService] Fetching payments for seller:', sellerId);
    
    // ✅ Check cache first
    if (!forceRefresh) {
      const cached = paymentCache.get(sellerId);
      if (cached && (Date.now() - cached.timestamp) < CACHE_DURATION) {
        console.log('💾 [PaymentService] Returning cached payments');
        return cached.data;
      }
    }
    
    // ✅ Query Firestore
    const paymentsQuery = query(
      collection(db, 'payments'),
      where('seller_id', '==', sellerId),
      where('payment_status', '==', 'completed'),
      where('verified', '==', true),
      orderBy('created_at', 'desc'),
      limit(limitCount)
    );
    
    const snapshot = await getDocs(paymentsQuery);
    
    if (snapshot.empty) {
      console.log('ℹ️ [PaymentService] No payments found');
      paymentCache.set(sellerId, { data: [], timestamp: Date.now() });
      return [];
    }
    
    const payments: Payment[] = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Payment));
    
    console.log(`✅ [PaymentService] Fetched ${payments.length} payments`);
    
    // ✅ Update cache
    paymentCache.set(sellerId, {
      data: payments,
      timestamp: Date.now()
    });
    
    return payments;
    
  } catch (error: any) {
    console.error('❌ [PaymentService] Error fetching payments:', error);
    throw new Error(`Failed to fetch payments: ${error.message}`);
  }
}

// ═══════════════════════════════════════════════════════════════
// ✅ CLEAR PAYMENT CACHE - NEW FUNCTION
// ═══════════════════════════════════════════════════════════════

export function clearPaymentCache(sellerId: string): void {
  console.log('🗑️ [PaymentService] Clearing payment cache for:', sellerId);
  paymentCache.delete(sellerId);
}

export function clearAllPaymentCache(): void {
  console.log('🗑️ [PaymentService] Clearing all payment cache');
  paymentCache.clear();
}

// ═══════════════════════════════════════════════════════════════
// ✅ LOAD RAZORPAY SCRIPT
// ═══════════════════════════════════════════════════════════════

export async function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

console.log('✅ PaymentService (Complete with Billing Support) loaded');