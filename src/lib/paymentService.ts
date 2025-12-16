
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
  PayUConfig,
  PayUFormData,
  PayUResponse,
  Payment,
  CreatePaymentData
} from '../types/payment.types';

// ═══════════════════════════════════════════════════════════════
// PAYU CONFIGURATION
// ═══════════════════════════════════════════════════════════════

export const PAYU_CONFIG: PayUConfig = {
  mode: import.meta.env.VITE_PAYU_MODE || 'test',
  merchant_key: import.meta.env.VITE_PAYU_MERCHANT_KEY || 'j9UCue',
  merchant_salt: import.meta.env.VITE_PAYU_MERCHANT_SALT || 'qSwYptohSBBMH7THpoCPC1f81XLa64kR',
  base_url: import.meta.env.VITE_PAYU_MODE === 'production' 
    ? 'https://secure.payu.in/_payment'
    : 'https://test.payu.in/_payment',
  success_url: `${window.location.origin}/payment-success`,
  failure_url: `${window.location.origin}/payment-failure`,
  cancel_url: `${window.location.origin}/payment-cancelled`
};

// ═══════════════════════════════════════════════════════════════
// GENERATE UNIQUE TRANSACTION ID
// ═══════════════════════════════════════════════════════════════

export const generateTxnId = (): string => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 11).toUpperCase();
  return `TXN_${timestamp}_${random}`;
};

// ═══════════════════════════════════════════════════════════════
// ✅ FIXED: GENERATE PAYU HASH (SIMPLE STRING, NOT JSON)
// ═══════════════════════════════════════════════════════════════

export const generatePayUHash = async (
  txnid: string,
  amount: string,
  productinfo: string,
  firstname: string,
  email: string,
  udf1: string = '',
  udf2: string = '',
  udf3: string = '',
  udf4: string = '',
  udf5: string = ''
): Promise<string> => {
  try {
    console.log('🔐 Generating PayU hash...');
    
    const { merchant_key, merchant_salt } = PAYU_CONFIG;
    
    if (!merchant_key || !merchant_salt) {
      throw new Error('PayU merchant credentials not configured');
    }
    
    // ✅ CRITICAL: Ensure amount has 2 decimal places
    const formattedAmount = parseFloat(amount).toFixed(2);
    
    // ✅ PayU Standard Formula (21 pipes total)
    // key|txnid|amount|productinfo|firstname|email|udf1|udf2|udf3|udf4|udf5||||||salt
    const hashString = `${merchant_key}|${txnid}|${formattedAmount}|${productinfo}|${firstname}|${email}|${udf1}|${udf2}|${udf3}|${udf4}|${udf5}||||||${merchant_salt}`;
    
    console.log('📝 Hash String:', hashString);
    console.log('📊 Pipe Count:', (hashString.match(/\|/g) || []).length, '(should be 16)');
    
    // Generate SHA-512
    const encoder = new TextEncoder();
    const data = encoder.encode(hashString);
    const hashBuffer = await crypto.subtle.digest('SHA-512', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    
    console.log('✅ Hash Generated:', hash.substring(0, 40) + '...');
    console.log('📏 Hash Length:', hash.length, '(should be 128)');
    
    // ✅ FIX: Return simple hash string, NOT JSON
    // PayU accepts simple string hash
    return hash;
    
  } catch (error: any) {
    console.error('❌ Hash generation error:', error);
    throw new Error(`Hash generation failed: ${error.message}`);
  }
};

// ═══════════════════════════════════════════════════════════════
// ✅ FIXED: VERIFY PAYU RESPONSE HASH
// ═══════════════════════════════════════════════════════════════

export const verifyPayUHash = async (response: PayUResponse): Promise<boolean> => {
  try {
    console.log('🔍 Verifying PayU response hash...');
    
    const { merchant_key, merchant_salt } = PAYU_CONFIG;
    
    // ✅ Ensure amount has 2 decimal places
    const formattedAmount = parseFloat(response.amount).toFixed(2);
    
    // ✅ Reverse hash formula for response verification (16 pipes):
    // salt|status||||||udf5|udf4|udf3|udf2|udf1|email|firstname|productinfo|amount|txnid|key
    const hashString = `${merchant_salt}|${response.status}||||||${response.udf5 || ''}|${response.udf4 || ''}|${response.udf3 || ''}|${response.udf2 || ''}|${response.udf1 || ''}|${response.email}|${response.firstname}|${response.productinfo}|${formattedAmount}|${response.txnid}|${merchant_key}`;
    
    console.log('📝 Verification Hash String:', hashString);
    console.log('📊 Pipe Count:', (hashString.match(/\|/g) || []).length);
    
    const encoder = new TextEncoder();
    const data = encoder.encode(hashString);
    const hashBuffer = await crypto.subtle.digest('SHA-512', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const calculatedHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    
    // ✅ Handle both simple hash and dual hash response
    let responseHash = response.hash;
    
    // If PayU sent dual hash JSON format
    if (response.hash && response.hash.startsWith('{')) {
      try {
        const hashObj = JSON.parse(response.hash);
        responseHash = hashObj.v1 || hashObj.v2 || response.hash;
        console.log('📦 Dual hash detected, using v1');
      } catch (e) {
        console.log('⚠️ Hash JSON parse failed, using raw hash');
      }
    }
    
    const isValid = calculatedHash.toLowerCase() === responseHash.toLowerCase();
    
    console.log(isValid ? '✅ Hash verified successfully' : '❌ Hash mismatch');
    console.log('🔢 Calculated:', calculatedHash.substring(0, 30) + '...');
    console.log('🔢 Received  :', responseHash.substring(0, 30) + '...');
    
    return isValid;
    
  } catch (error: any) {
    console.error('❌ Error verifying hash:', error);
    return false;
  }
};

// ═══════════════════════════════════════════════════════════════
// CREATE PAYMENT RECORD
// ═══════════════════════════════════════════════════════════════

export const createPayment = async (
  paymentData: CreatePaymentData
): Promise<{ success: boolean; paymentId?: string; txnId?: string; error?: string }> => {
  try {
    console.log('💳 Creating payment record...');
    
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error('User not authenticated');
    }
    
    const txnId = generateTxnId();
    
    const payment: Omit<Payment, 'id'> = {
      seller_id: paymentData.seller_id,
      seller_email: paymentData.seller_email,
      seller_business: paymentData.seller_business,
      
      plan_id: paymentData.plan_id,
      plan_name: paymentData.plan_name,
      amount: paymentData.amount,
      currency: paymentData.currency,
      
      payu_txn_id: txnId,
      payu_order_id: txnId,
      payu_status: 'initiated',
      
      payment_status: 'initiated',
      verified: false,
      
      created_at: new Date().toISOString(),
      ip_address: await getClientIP(),
      user_agent: navigator.userAgent.substring(0, 200)
    };
    
    const docRef = await addDoc(collection(db, 'payments'), payment);
    
    console.log('✅ Payment record created:', docRef.id);
    
    return { success: true, paymentId: docRef.id, txnId };
    
  } catch (error: any) {
    console.error('❌ Error creating payment:', error);
    return { success: false, error: error.message };
  }
};

// ═══════════════════════════════════════════════════════════════
// UPDATE PAYMENT STATUS
// ═══════════════════════════════════════════════════════════════

export const updatePaymentStatus = async (
  txnId: string,
  payuResponse: PayUResponse,
  verified: boolean
): Promise<{ success: boolean; error?: string }> => {
  try {
    console.log('🔄 Updating payment status for:', txnId);
    
    const q = query(
      collection(db, 'payments'),
      where('payu_txn_id', '==', txnId),
      limit(1)
    );
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) {
      throw new Error('Payment record not found');
    }
    
    const paymentDoc = snapshot.docs[0];
    
    let paymentStatus: Payment['payment_status'];
    if (payuResponse.status === 'success' && verified) {
      paymentStatus = 'completed';
    } else if (payuResponse.status === 'failure') {
      paymentStatus = 'failed';
    } else if (payuResponse.status === 'cancel') {
      paymentStatus = 'cancelled';
    } else {
      paymentStatus = 'processing';
    }
    
    await updateDoc(doc(db, 'payments', paymentDoc.id), {
      payu_payment_id: payuResponse.mihpayid,
      payu_status: payuResponse.status,
      payu_mode: payuResponse.mode,
      payu_response: payuResponse,
      
      payment_status: paymentStatus,
      verified: verified,
      completed_at: new Date().toISOString()
    });
    
    console.log('✅ Payment status updated:', paymentStatus);
    
    // Log activity
    try {
      await addDoc(collection(db, 'adminLogs'), {
        action: 'payment_status_updated',
        payment_id: paymentDoc.id,
        txn_id: txnId,
        payu_payment_id: payuResponse.mihpayid,
        status: paymentStatus,
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
// GET PAYMENT BY TRANSACTION ID
// ═══════════════════════════════════════════════════════════════

export const getPaymentByTxnId = async (txnId: string): Promise<Payment | null> => {
  try {
    console.log('🔍 Fetching payment:', txnId);
    
    const q = query(
      collection(db, 'payments'),
      where('payu_txn_id', '==', txnId),
      limit(1)
    );
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) {
      console.log('⚠️ Payment not found');
      return null;
    }
    
    const payment: Payment = {
      id: snapshot.docs[0].id,
      ...snapshot.docs[0].data()
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
// ✅ FIXED: INITIATE PAYU PAYMENT
// ═══════════════════════════════════════════════════════════════

export const initiatePayment = async (
  planId: string,
  planName: string,
  amount: number
): Promise<{ success: boolean; formData?: PayUFormData; error?: string }> => {
  try {
    console.log('🚀 Initiating PayU payment...');
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
    
    if (!paymentResult.success || !paymentResult.txnId) {
      throw new Error(paymentResult.error || 'Payment creation failed');
    }
    
    const txnId = paymentResult.txnId;
    
    // ✅ Prepare user details (sanitize to prevent hash issues)
    const firstname = (sellerData.owner_name || currentUser.email?.split('@')[0] || 'Customer')
      .replace(/[|]/g, '') // Remove pipe characters
      .substring(0, 50);
    
    const email = currentUser.email || '';
    const phone = sellerData.phone || '9999999999';
    
    // ✅ Prepare UDF values (ensure no pipe characters)
    const udf1 = planId.replace(/[|]/g, '');
    const udf2 = currentUser.uid.replace(/[|]/g, '');
    const udf3 = (sellerData.business_name || '').replace(/[|]/g, '').substring(0, 50);
    const udf4 = '';
    const udf5 = '';
    
    // ✅ CRITICAL: Format amount to 2 decimal places
    const formattedAmount = parseFloat(amount.toString()).toFixed(2);
    
    console.log('📋 Payment Details:', {
      txnId,
      amount: formattedAmount,
      firstname,
      email,
      phone,
      udf1,
      udf2,
      udf3
    });
    
    // ✅ Generate hash (returns simple string, not JSON)
    const hash = await generatePayUHash(
      txnId,
      formattedAmount,
      planName,
      firstname,
      email,
      udf1,
      udf2,
      udf3,
      udf4,
      udf5
    );
    
    // ✅ Prepare PayU form data
    const formData: PayUFormData = {
      key: PAYU_CONFIG.merchant_key,
      txnid: txnId,
      amount: formattedAmount,
      productinfo: planName,
      firstname: firstname,
      email: email,
      phone: phone,
      surl: PAYU_CONFIG.success_url,
      furl: PAYU_CONFIG.failure_url,
      hash: hash, // ✅ Simple hash string
      udf1: udf1,
      udf2: udf2,
      udf3: udf3,
      udf4: udf4,
      udf5: udf5
    };
    
    console.log('✅ Payment initiation successful');
    console.log('📝 Form Data Keys:', Object.keys(formData));
    console.log('🔐 Hash Length:', hash.length);
    
    return { success: true, formData };
    
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
      signal: AbortSignal.timeout(5000) // 5 second timeout
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
  PAYU_CONFIG,
  generateTxnId,
  generatePayUHash,
  verifyPayUHash,
  createPayment,
  updatePaymentStatus,
  getPaymentByTxnId,
  getSellerPayments,
  initiatePayment
};

console.log('✅ Payment Service Loaded - PRODUCTION v2.0 (FIXED)');