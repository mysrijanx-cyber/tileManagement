
import { auth } from './firebase';
import type { Plan } from '../types/plan.types';
import type { RazorpayCheckoutOptions } from '../types/payment.types';

// ✅ Backend API URL
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

// ═══════════════════════════════════════════════════════════════
// ✅ GET FIREBASE AUTH TOKEN
// ═══════════════════════════════════════════════════════════════

async function getAuthToken(): Promise<string> {
  const currentUser = auth.currentUser;
  
  if (!currentUser) {
    throw new Error('User not authenticated');
  }
  
  const token = await currentUser.getIdToken();
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
    
    // ✅ Get auth token
    const token = await getAuthToken();
    
    // ✅ Call backend API
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
    });
    
    const result = await response.json();
    
    if (!response.ok || !result.success) {
      console.error('❌ [Frontend] Order creation failed:', result);
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
    return {
      success: false,
      error: error.message || 'Failed to initiate payment',
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
    
    // ✅ Get auth token
    const token = await getAuthToken();
    
    // ✅ Call backend API
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
    });
    
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
    return {
      success: false,
      error: error.message || 'Failed to verify payment',
    };
  }
}

// ═══════════════════════════════════════════════════════════════
// ✅ GET PAYMENT STATUS
// ═══════════════════════════════════════════════════════════════

export async function getPaymentStatus(paymentId: string): Promise<any> {
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
    
    return result.data.payment;
    
  } catch (error: any) {
    console.error('❌ [Frontend] Get payment status error:', error);
    throw error;
  }
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

console.log('✅ PaymentService (Backend Integrated) loaded');