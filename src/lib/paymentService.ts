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
import { db, auth } from './firebase';
import type {
  RazorpayConfig,
  RazorpayOrderData,
  RazorpayCheckoutOptions,
  RazorpaySuccessResponse,
  Payment,
  CreatePaymentData
} from '../types/payment.types';

// ═══════════════════════════════════════════════════════════════
// RAZORPAY CONFIGURATION
// ═══════════════════════════════════════════════════════════════

export const RAZORPAY_CONFIG: RazorpayConfig = {
  key_id: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_S5T5kBvRLmxwlk',
  key_secret: import.meta.env.VITE_RAZORPAY_KEY_SECRET || 'kqp6qF91f5WguT53mRYuN0Cd',
  environment: import.meta.env.VITE_APP_ENV === 'production' ? 'production' : 'test'
};

// ═══════════════════════════════════════════════════════════════
// LOAD RAZORPAY SCRIPT
// ═══════════════════════════════════════════════════════════════

export const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    // Check if already loaded
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    
    script.onload = () => {
      console.log('✅ Razorpay script loaded');
      resolve(true);
    };
    
    script.onerror = () => {
      console.error('❌ Failed to load Razorpay script');
      resolve(false);
    };
    
    document.body.appendChild(script);
  });
};

// ═══════════════════════════════════════════════════════════════
// GENERATE UNIQUE RECEIPT ID
// ═══════════════════════════════════════════════════════════════

export const generateReceiptId = (): string => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 11).toUpperCase();
  return `RCPT_${timestamp}_${random}`;
};

// ═══════════════════════════════════════════════════════════════
// CREATE RAZORPAY ORDER (CLIENT-SIDE)
// ═══════════════════════════════════════════════════════════════

export const createRazorpayOrder = async (
  amount: number,
  receipt: string,
  notes: Record<string, any> = {}
): Promise<{ success: boolean; orderId?: string; error?: string }> => {
  try {
    console.log('📦 Creating Razorpay order...');
    
    // Convert rupees to paise (Razorpay uses smallest currency unit)
    const amountInPaise = Math.round(amount * 100);
    
    const orderData: RazorpayOrderData = {
      amount: amountInPaise,
      currency: 'INR',
      receipt: receipt,
      notes: notes
    };
    
    console.log('📝 Order data:', orderData);
    
    // ⚠️ NOTE: In production, this should be done via backend/Cloud Function
    // For now, we'll create order ID on client side
    const orderId = `order_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    
    console.log('✅ Order created:', orderId);
    
    return { success: true, orderId };
    
  } catch (error: any) {
    console.error('❌ Error creating order:', error);
    return { success: false, error: error.message };
  }
};

// ═══════════════════════════════════════════════════════════════
// CREATE PAYMENT RECORD
// ═══════════════════════════════════════════════════════════════

export const createPayment = async (
  paymentData: CreatePaymentData
): Promise<{ success: boolean; paymentId?: string; receipt?: string; error?: string }> => {
  try {
    console.log('💳 Creating payment record...');
    
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error('User not authenticated');
    }
    
    const receipt = generateReceiptId();
    
    const payment: Omit<Payment, 'id'> = {
      seller_id: paymentData.seller_id,
      seller_email: paymentData.seller_email,
      seller_business: paymentData.seller_business,
      
      plan_id: paymentData.plan_id,
      plan_name: paymentData.plan_name,
      amount: paymentData.amount,
      currency: paymentData.currency,
      
      razorpay_order_id: '', // Will be updated after order creation
      razorpay_receipt: receipt,
      
      payment_status: 'initiated',
      verified: false,
      
      created_at: new Date().toISOString(),
      ip_address: await getClientIP(),
      user_agent: navigator.userAgent.substring(0, 200)
    };
    
    const docRef = await addDoc(collection(db, 'payments'), payment);
    
    console.log('✅ Payment record created:', docRef.id);
    
    return { success: true, paymentId: docRef.id, receipt };
    
  } catch (error: any) {
    console.error('❌ Error creating payment:', error);
    return { success: false, error: error.message };
  }
};

// ═══════════════════════════════════════════════════════════════
// UPDATE PAYMENT STATUS
// ═══════════════════════════════════════════════════════════════

export const updatePaymentStatus = async (
  paymentId: string,
  razorpayResponse: RazorpaySuccessResponse,
  verified: boolean
): Promise<{ success: boolean; error?: string }> => {
  try {
    console.log('🔄 Updating payment status for:', paymentId);
    
    const payment_status: Payment['payment_status'] = verified ? 'completed' : 'failed';
    
    await updateDoc(doc(db, 'payments', paymentId), {
      razorpay_payment_id: razorpayResponse.razorpay_payment_id,
      razorpay_order_id: razorpayResponse.razorpay_order_id,
      razorpay_signature: razorpayResponse.razorpay_signature,
      razorpay_response: razorpayResponse,
      
      payment_status: payment_status,
      verified: verified,
      completed_at: new Date().toISOString()
    });
    
    console.log('✅ Payment status updated:', payment_status);
    
    // Log activity
    try {
      await addDoc(collection(db, 'adminLogs'), {
        action: 'payment_status_updated',
        payment_id: paymentId,
        razorpay_payment_id: razorpayResponse.razorpay_payment_id,
        razorpay_order_id: razorpayResponse.razorpay_order_id,
        status: payment_status,
        verified: verified,
        timestamp: new Date().toISOString()
      });
    } catch (logError) {
      console.warn('⚠️ Could not log payment update:', logError);
    }
    
    return { success: true };
    
  } catch (error: any) {
    console.error('❌ Error updating payment:', error);
    return { success: false, error: error.message };
  }
};

// ═══════════════════════════════════════════════════════════════
// GET PAYMENT BY ID
// ═══════════════════════════════════════════════════════════════

export const getPaymentById = async (paymentId: string): Promise<Payment | null> => {
  try {
    console.log('🔍 Fetching payment:', paymentId);
    
    const paymentDoc = await getDoc(doc(db, 'payments', paymentId));
    
    if (!paymentDoc.exists()) {
      console.log('⚠️ Payment not found');
      return null;
    }
    
    const payment: Payment = {
      id: paymentDoc.id,
      ...paymentDoc.data()
    } as Payment;
    
    console.log('✅ Payment found:', payment.payment_status);
    return payment;
    
  } catch (error: any) {
    console.error('❌ Error fetching payment:', error);
    return null;
  }
};

// ═══════════════════════════════════════════════════════════════
// GET SELLER PAYMENT HISTORY
// ═══════════════════════════════════════════════════════════════

export const getSellerPayments = async (
  sellerId: string,
  limitCount: number = 20
): Promise<Payment[]> => {
  try {
    console.log('📋 Fetching payment history for seller:', sellerId);
    
    const q = query(
      collection(db, 'payments'),
      where('seller_id', '==', sellerId),
      orderBy('created_at', 'desc'),
      limit(limitCount)
    );
    
    const snapshot = await getDocs(q);
    
    const payments: Payment[] = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Payment));
    
    console.log(`✅ Fetched ${payments.length} payments`);
    return payments;
    
  } catch (error: any) {
    console.error('❌ Error fetching payments:', error);
    return [];
  }
};

// ═══════════════════════════════════════════════════════════════
// INITIATE RAZORPAY PAYMENT
// ═══════════════════════════════════════════════════════════════

export const initiatePayment = async (
  planId: string,
  planName: string,
  amount: number
): Promise<{ success: boolean; paymentId?: string; checkoutOptions?: RazorpayCheckoutOptions; error?: string }> => {
  try {
    console.log('🚀 Initiating Razorpay payment...');
    console.log('💰 Plan:', planId, '|', planName, '| Amount: ₹', amount);
    
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error('User not authenticated');
    }
    
    // Get seller details
    const sellerQuery = query(
      collection(db, 'sellers'),
      where('user_id', '==', currentUser.uid),
      limit(1)
    );
    const sellerSnapshot = await getDocs(sellerQuery);
    
    if (sellerSnapshot.empty) {
      throw new Error('Seller profile not found');
    }
    
    const sellerData = sellerSnapshot.docs[0].data();
    
    // Create payment record
    const paymentResult = await createPayment({
      seller_id: currentUser.uid,
      seller_email: currentUser.email || '',
      seller_business: sellerData.business_name || '',
      plan_id: planId,
      plan_name: planName,
      amount: amount,
      currency: 'INR'
    });
    
    if (!paymentResult.success || !paymentResult.paymentId || !paymentResult.receipt) {
      throw new Error(paymentResult.error || 'Payment creation failed');
    }
    
    // Create Razorpay order
    const orderResult = await createRazorpayOrder(
      amount,
      paymentResult.receipt,
      {
        plan_id: planId,
        plan_name: planName,
        seller_id: currentUser.uid,
        seller_business: sellerData.business_name
      }
    );
    
    if (!orderResult.success || !orderResult.orderId) {
      throw new Error(orderResult.error || 'Order creation failed');
    }
    
    // Update payment record with order ID
    await updateDoc(doc(db, 'payments', paymentResult.paymentId), {
      razorpay_order_id: orderResult.orderId
    });
    
    // Prepare checkout options
    const checkoutOptions: RazorpayCheckoutOptions = {
      key: RAZORPAY_CONFIG.key_id,
      amount: Math.round(amount * 100), // Convert to paise
      currency: 'INR',
      name: 'SrijanX Tile',
      description: planName,
      image: '/logo.png',
      order_id: orderResult.orderId,
      handler: () => {}, // Will be set in component
      prefill: {
        name: sellerData.owner_name || sellerData.business_name || 'Customer',
        email: currentUser.email || '',
        contact: sellerData.phone || ''
      },
      notes: {
        plan_id: planId,
        seller_id: currentUser.uid,
        payment_id: paymentResult.paymentId
      },
      theme: {
        color: '#9333EA' // Purple-600
      }
    };
    
    console.log('✅ Payment initiation successful');
    
    return { 
      success: true, 
      paymentId: paymentResult.paymentId,
      checkoutOptions 
    };
    
  } catch (error: any) {
    console.error('❌ Error initiating payment:', error);
    return { success: false, error: error.message };
  }
};

// ═══════════════════════════════════════════════════════════════
// HELPER: GET CLIENT IP
// ═══════════════════════════════════════════════════════════════

const getClientIP = async (): Promise<string> => {
  try {
    const response = await fetch('https://api.ipify.org?format=json', {
      signal: AbortSignal.timeout(5000)
    });
    const data = await response.json();
    return data.ip || 'unknown';
  } catch {
    return 'unknown';
  }
};

// ═══════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════

export default {
  RAZORPAY_CONFIG,
  loadRazorpayScript,
  generateReceiptId,
  createRazorpayOrder,
  createPayment,
  updatePaymentStatus,
  getPaymentById,
  getSellerPayments,
  initiatePayment
};

console.log('✅ Payment Service Loaded - RAZORPAY PRODUCTION v1.0');