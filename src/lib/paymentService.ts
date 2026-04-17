// // ═══════════════════════════════════════════════════════════════
// // ✅ RAZORPAY PAYMENT SERVICE - PRODUCTION READY v2.1 (FIXED)
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
//   limit
// } from 'firebase/firestore';
// import { db, auth } from './firebase';
// import type {
//   RazorpayConfig,
//   RazorpayCheckoutOptions,
//   RazorpaySuccessResponse,
//   Payment,
//   CreatePaymentData
// } from '../types/payment.types';

// // ═══════════════════════════════════════════════════════════════
// // RAZORPAY CONFIGURATION
// // ═══════════════════════════════════════════════════════════════

// export const RAZORPAY_CONFIG: RazorpayConfig = {
//   key_id: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_S5T5kBvRLmxwlk',
//   key_secret: import.meta.env.VITE_RAZORPAY_KEY_SECRET || 'kqp6qF91f5WguT53mRYuN0Cd',
//   environment: 'test'
// };

// console.log('⚠️ RAZORPAY TEST MODE - No backend required for testing');

// // ═══════════════════════════════════════════════════════════════
// // LOAD RAZORPAY SCRIPT
// // ═══════════════════════════════════════════════════════════════

// const loadRazorpayScript = (): Promise<boolean> => {
//   return new Promise((resolve) => {
//     if (window.Razorpay) {
//       console.log('✅ Razorpay script already loaded');
//       resolve(true);
//       return;
//     }

//     const script = document.createElement('script');
//     script.src = 'https://checkout.razorpay.com/v1/checkout.js';
//     script.async = true;
    
//     script.onload = () => {
//       console.log('✅ Razorpay script loaded successfully');
//       resolve(true);
//     };
    
//     script.onerror = () => {
//       console.error('❌ Failed to load Razorpay script');
//       resolve(false);
//     };
    
//     document.body.appendChild(script);
//   });
// };

// // ═══════════════════════════════════════════════════════════════
// // GENERATE UNIQUE IDs
// // ═══════════════════════════════════════════════════════════════

// const generateReceiptId = (): string => {
//   const timestamp = Date.now();
//   const random = Math.random().toString(36).substring(2, 11).toUpperCase();
//   return `RCPT_${timestamp}_${random}`;
// };

// const generateTransactionId = (): string => {
//   const timestamp = Date.now();
//   const random = Math.random().toString(36).substring(2, 15).toUpperCase();
//   return `TXN_${timestamp}_${random}`;
// };

// // ═══════════════════════════════════════════════════════════════
// // GET CLIENT IP
// // ═══════════════════════════════════════════════════════════════

// const getClientIP = async (): Promise<string> => {
//   try {
//     const response = await fetch('https://api.ipify.org?format=json', {
//       signal: AbortSignal.timeout(3000)
//     });
//     const data = await response.json();
//     return data.ip || 'unknown';
//   } catch {
//     return 'unknown';
//   }
// };

// // ═══════════════════════════════════════════════════════════════
// // CREATE PAYMENT RECORD
// // ═══════════════════════════════════════════════════════════════

// const createPayment = async (
//   paymentData: CreatePaymentData
// ): Promise<{ success: boolean; paymentId?: string; receipt?: string; error?: string }> => {
//   try {
//     console.log('💳 Creating payment record...');
    
//     const currentUser = auth.currentUser;
//     if (!currentUser) {
//       throw new Error('User not authenticated');
//     }
    
//     const receipt = generateReceiptId();
    
//     const payment: Omit<Payment, 'id'> = {
//       seller_id: paymentData.seller_id,
//       seller_email: paymentData.seller_email,
//       seller_business: paymentData.seller_business,
      
//       plan_id: paymentData.plan_id,
//       plan_name: paymentData.plan_name,
//       amount: paymentData.amount,
//       currency: paymentData.currency,
      
//       razorpay_order_id: '',
//       razorpay_receipt: receipt,
      
//       payment_status: 'initiated',
//       verified: false,
      
//       created_at: new Date().toISOString(),
//       ip_address: await getClientIP(),
//       user_agent: navigator.userAgent.substring(0, 200)
//     };
    
//     const docRef = await addDoc(collection(db, 'payments'), payment);
    
//     console.log('✅ Payment record created:', docRef.id);
    
//     return { success: true, paymentId: docRef.id, receipt };
    
//   } catch (error: any) {
//     console.error('❌ Error creating payment:', error);
//     return { success: false, error: error.message };
//   }
// };

// // ═══════════════════════════════════════════════════════════════
// // UPDATE PAYMENT STATUS
// // ═══════════════════════════════════════════════════════════════

// const updatePaymentStatus = async (
//   paymentId: string,
//   razorpayResponse: RazorpaySuccessResponse | Partial<RazorpaySuccessResponse>,
//   verified: boolean
// ): Promise<{ success: boolean; error?: string }> => {
//   try {
//     console.log('🔄 Updating payment status for:', paymentId);
    
//     const payment_status: Payment['payment_status'] = verified ? 'completed' : 'failed';
    
//     await updateDoc(doc(db, 'payments', paymentId), {
//       razorpay_payment_id: razorpayResponse.razorpay_payment_id || '',
//       razorpay_order_id: razorpayResponse.razorpay_order_id || '',
//       razorpay_signature: razorpayResponse.razorpay_signature || '',
//       razorpay_response: razorpayResponse,
      
//       payment_status: payment_status,
//       verified: verified,
//       completed_at: new Date().toISOString()
//     });
    
//     console.log('✅ Payment status updated:', payment_status);
    
//     try {
//       await addDoc(collection(db, 'adminLogs'), {
//         action: 'payment_status_updated',
//         payment_id: paymentId,
//         razorpay_payment_id: razorpayResponse.razorpay_payment_id || '',
//         status: payment_status,
//         verified: verified,
//         timestamp: new Date().toISOString()
//       });
//     } catch (logError) {
//       console.warn('⚠️ Could not log payment update:', logError);
//     }
    
//     return { success: true };
    
//   } catch (error: any) {
//     console.error('❌ Error updating payment:', error);
//     return { success: false, error: error.message };
//   }
// };

// // ═══════════════════════════════════════════════════════════════
// // VERIFY PAYMENT (TEST MODE)
// // ═══════════════════════════════════════════════════════════════

// const verifyPayment = async (
//   paymentId: string,
//   razorpayResponse: RazorpaySuccessResponse
// ): Promise<{ success: boolean; error?: string }> => {
//   try {
//     console.log('🔐 Verifying payment (TEST MODE - Basic check)...');
    
//     const isValid = !!(razorpayResponse.razorpay_payment_id);
    
//     if (!isValid) {
//       throw new Error('Invalid payment response');
//     }
    
//     const updateResult = await updatePaymentStatus(
//       paymentId,
//       razorpayResponse,
//       true
//     );
    
//     if (!updateResult.success) {
//       throw new Error('Failed to update payment status');
//     }
    
//     console.log('✅ Payment verified (TEST MODE)');
    
//     return { success: true };
    
//   } catch (error: any) {
//     console.error('❌ Payment verification failed:', error);
//     return { success: false, error: error.message };
//   }
// };

// // ═══════════════════════════════════════════════════════════════
// // GET PAYMENT BY ID
// // ═══════════════════════════════════════════════════════════════

// const getPaymentById = async (paymentId: string): Promise<Payment | null> => {
//   try {
//     console.log('🔍 Fetching payment:', paymentId);
    
//     const paymentDoc = await getDoc(doc(db, 'payments', paymentId));
    
//     if (!paymentDoc.exists()) {
//       console.log('⚠️ Payment not found');
//       return null;
//     }
    
//     const payment: Payment = {
//       id: paymentDoc.id,
//       ...paymentDoc.data()
//     } as Payment;
    
//     console.log('✅ Payment found:', payment.payment_status);
//     return payment;
    
//   } catch (error: any) {
//     console.error('❌ Error fetching payment:', error);
//     return null;
//   }
// };

// // ═══════════════════════════════════════════════════════════════
// // GET SELLER PAYMENT HISTORY
// // ═══════════════════════════════════════════════════════════════

// // const getSellerPayments = async (
// //   sellerId: string,
// //   limitCount: number = 20
// // ): Promise<Payment[]> => {
// //   try {
// //     console.log('📋 Fetching payment history for seller:', sellerId);
    
// //     const q = query(
// //       collection(db, 'payments'),
// //       where('seller_id', '==', sellerId),
// //       orderBy('created_at', 'desc'),
// //       limit(limitCount)
// //     );
    
// //     const snapshot = await getDocs(q);
    
// //     const payments: Payment[] = snapshot.docs.map(doc => ({
// //       id: doc.id,
// //       ...doc.data()
// //     } as Payment));
    
// //     console.log(`✅ Fetched ${payments.length} payments`);
// //     return payments;
    
// //   } catch (error: any) {
// //     console.error('❌ Error fetching payments:', error);
// //     return [];
// //   }
// // };


// // ═══════════════════════════════════════════════════════════════
// // INITIATE RAZORPAY PAYMENT - TEST MODE
// // ═══════════════════════════════════════════════════════════════


// // ═══════════════════════════════════════════════════════════════
// // ✅ GET SELLER PAYMENT HISTORY - PRODUCTION v3.0
// // ═══════════════════════════════════════════════════════════════

// const getSellerPayments = async (
//   sellerId: string,
//   limitCount: number = 50
// ): Promise<Payment[]> => {
//   try {
//     console.log('═══════════════════════════════════════════════════════');
//     console.log('📋 [GET PAYMENTS] Starting for seller:', sellerId);
//     console.log('📊 Limit:', limitCount);
    
//     // ✅ VALIDATION
//     if (!sellerId || sellerId.trim() === '') {
//       console.warn('⚠️ Invalid seller ID provided');
//       return [];
//     }
    
//     let payments: Payment[] = [];
    
//     // ═══════════════════════════════════════════════════════════
//     // TRY METHOD 1: Composite Query (seller_id + orderBy)
//     // ═══════════════════════════════════════════════════════════
    
//     try {
//       console.log('🔄 [METHOD 1] Trying composite query...');
      
//       const compositeQuery = query(
//         collection(db, 'payments'),
//         where('seller_id', '==', sellerId),
//         orderBy('created_at', 'desc'),
//         limit(limitCount)
//       );
      
//       const snapshot = await getDocs(compositeQuery);
      
//       if (!snapshot.empty) {
//         payments = snapshot.docs.map(doc => {
//           const data = doc.data();
//           return {
//             id: doc.id,
//             seller_id: data.seller_id || '',
//             seller_email: data.seller_email || '',
//             seller_business: data.seller_business || '',
            
//             plan_id: data.plan_id || '',
//             plan_name: data.plan_name || 'Unknown Plan',
//             amount: typeof data.amount === 'number' ? data.amount : 0,
//             currency: data.currency || 'INR',
            
//             razorpay_order_id: data.razorpay_order_id || '',
//             razorpay_payment_id: data.razorpay_payment_id || '',
//             razorpay_signature: data.razorpay_signature || '',
//             razorpay_receipt: data.razorpay_receipt || '',
//             razorpay_response: data.razorpay_response || null,
            
//             transaction_id: data.transaction_id || '',
//             test_mode: data.test_mode || false,
            
//             payment_status: data.payment_status || 'initiated',
//             verified: data.verified || false,
            
//             created_at: data.created_at || new Date().toISOString(),
//             completed_at: data.completed_at || undefined,
//             ip_address: data.ip_address || undefined,
//             user_agent: data.user_agent || undefined
//           } as Payment;
//         });
        
//         console.log(`✅ [METHOD 1] Success - Fetched ${payments.length} payments`);
//       } else {
//         console.log('ℹ️ [METHOD 1] No payments found');
//       }
      
//     } catch (indexError: any) {
//       console.warn('⚠️ [METHOD 1] Composite query failed:', indexError.message);
//       console.log('🔄 Falling back to METHOD 2...');
      
//       // ═══════════════════════════════════════════════════════════
//       // FALLBACK METHOD 2: Simple Query + Client-Side Sort
//       // ═══════════════════════════════════════════════════════════
      
//       try {
//         console.log('🔄 [METHOD 2] Using simple query with client-side sort...');
        
//         const simpleQuery = query(
//           collection(db, 'payments'),
//           where('seller_id', '==', sellerId)
//         );
        
//         const snapshot = await getDocs(simpleQuery);
        
//         if (!snapshot.empty) {
//           const allPayments = snapshot.docs.map(doc => {
//             const data = doc.data();
//             return {
//               id: doc.id,
//               seller_id: data.seller_id || '',
//               seller_email: data.seller_email || '',
//               seller_business: data.seller_business || '',
              
//               plan_id: data.plan_id || '',
//               plan_name: data.plan_name || 'Unknown Plan',
//               amount: typeof data.amount === 'number' ? data.amount : 0,
//               currency: data.currency || 'INR',
              
//               razorpay_order_id: data.razorpay_order_id || '',
//               razorpay_payment_id: data.razorpay_payment_id || '',
//               razorpay_signature: data.razorpay_signature || '',
//               razorpay_receipt: data.razorpay_receipt || '',
//               razorpay_response: data.razorpay_response || null,
              
//               transaction_id: data.transaction_id || '',
//               test_mode: data.test_mode || false,
              
//               payment_status: data.payment_status || 'initiated',
//               verified: data.verified || false,
              
//               created_at: data.created_at || new Date().toISOString(),
//               completed_at: data.completed_at || undefined,
//               ip_address: data.ip_address || undefined,
//               user_agent: data.user_agent || undefined
//             } as Payment;
//           });
          
//           // ✅ Client-side sort by created_at (descending)
//           payments = allPayments.sort((a, b) => {
//             const dateA = new Date(a.created_at).getTime();
//             const dateB = new Date(b.created_at).getTime();
//             return dateB - dateA; // Newest first
//           }).slice(0, limitCount); // Apply limit
          
//           console.log(`✅ [METHOD 2] Success - Fetched and sorted ${payments.length} payments`);
//         } else {
//           console.log('ℹ️ [METHOD 2] No payments found');
//         }
        
//       } catch (fallbackError: any) {
//         console.error('❌ [METHOD 2] Fallback query also failed:', fallbackError);
//         throw fallbackError;
//       }
//     }
    
//     // ═══════════════════════════════════════════════════════════
//     // POST-PROCESSING
//     // ═══════════════════════════════════════════════════════════
    
//     console.log('📊 [POST-PROCESS] Analyzing payment data...');
    
//     const completedPayments = payments.filter(p => 
//       p.payment_status === 'completed' && p.verified === true
//     );
//     const pendingPayments = payments.filter(p => 
//       p.payment_status === 'initiated' || p.payment_status === 'pending'
//     );
//     const failedPayments = payments.filter(p => 
//       p.payment_status === 'failed'
//     );
    
//     console.log('📊 Payment Summary:');
//     console.log('   ✅ Completed:', completedPayments.length);
//     console.log('   ⏳ Pending:', pendingPayments.length);
//     console.log('   ❌ Failed:', failedPayments.length);
//     console.log('   📝 Total:', payments.length);
    
//     // ✅ SANITIZE SENSITIVE DATA (Optional - for security)
//     const sanitizedPayments = payments.map(payment => ({
//       ...payment,
//       // Keep razorpay_payment_id but mask some sensitive data if needed
//       ip_address: payment.ip_address ? '***.***.***.' + payment.ip_address.split('.').pop() : undefined,
//       user_agent: payment.user_agent ? payment.user_agent.substring(0, 50) + '...' : undefined
//     }));
    
//     console.log('✅ [GET PAYMENTS] Complete');
//     console.log('═══════════════════════════════════════════════════════');
    
//     return sanitizedPayments;
    
//   } catch (error: any) {
//     console.error('═══════════════════════════════════════════════════════');
//     console.error('❌ [GET PAYMENTS] Fatal Error:', error);
//     console.error('Error Code:', error.code);
//     console.error('Error Message:', error.message);
//     console.error('═══════════════════════════════════════════════════════');
    
//     // ✅ Return empty array instead of throwing (fail gracefully)
//     return [];
//   }
// };

// const initiatePayment = async (
//   planId: string,
//   planName: string,
//   amount: number
// ): Promise<{ 
//   success: boolean; 
//   paymentId?: string; 
//   checkoutOptions?: RazorpayCheckoutOptions; 
//   error?: string 
// }> => {
//   try {
//     console.log('🚀 Initiating Razorpay payment (TEST MODE)...');
//     console.log('💰 Plan:', planName, '| Amount: ₹', amount);
    
//     const currentUser = auth.currentUser;
//     if (!currentUser) {
//       throw new Error('User not authenticated');
//     }
    
//     const sellerQuery = query(
//       collection(db, 'sellers'),
//       where('user_id', '==', currentUser.uid),
//       limit(1)
//     );
//     const sellerSnapshot = await getDocs(sellerQuery);
    
//     if (sellerSnapshot.empty) {
//       throw new Error('Seller profile not found');
//     }
    
//     const sellerData = sellerSnapshot.docs[0].data();
    
//     const paymentResult = await createPayment({
//       seller_id: currentUser.uid,
//       seller_email: currentUser.email || '',
//       seller_business: sellerData.business_name || '',
//       plan_id: planId,
//       plan_name: planName,
//       amount: amount,
//       currency: 'INR'
//     });
    
//     if (!paymentResult.success || !paymentResult.paymentId || !paymentResult.receipt) {
//       throw new Error(paymentResult.error || 'Payment creation failed');
//     }
    
//     const transactionId = generateTransactionId();
    
//     console.log('📝 Transaction ID:', transactionId);
//     console.log('📝 Receipt ID:', paymentResult.receipt);
    
//     await updateDoc(doc(db, 'payments', paymentResult.paymentId), {
//       razorpay_receipt: paymentResult.receipt,
//       transaction_id: transactionId,
//       test_mode: true,
//       updated_at: new Date().toISOString()
//     });
    
//     const checkoutOptions: RazorpayCheckoutOptions = {
//       key: RAZORPAY_CONFIG.key_id,
//       amount: Math.round(amount * 100),
//       currency: 'INR',
//       name: 'SrijanX Tile',
//       description: `${planName} - Test Mode`,
//       image: '/logo.png',
      
//       handler: () => {},
      
//       prefill: {
//         name: sellerData.owner_name || sellerData.business_name || 'Customer',
//         email: currentUser.email || '',
//         contact: sellerData.phone || ''
//       },
      
//       notes: {
//         plan_id: planId,
//         plan_name: planName,
//         seller_id: currentUser.uid,
//         payment_id: paymentResult.paymentId,
//         transaction_id: transactionId,
//         test_mode: 'true'
//       },
      
//       theme: {
//         color: '#9333EA',
//         backdrop_color: '#000000'
//       },
      
//       modal: {
//         backdropclose: false,
//         escape: true,
//         handleback: true,
//         confirm_close: true,
//         ondismiss: () => {
//           console.log('⚠️ Payment modal dismissed');
//         },
//         animation: true
//       }
//     };
    
//     console.log('✅ Payment initiation successful (TEST MODE)');
    
//     return { 
//       success: true, 
//       paymentId: paymentResult.paymentId,
//       checkoutOptions 
//     };
    
//   } catch (error: any) {
//     console.error('❌ Error initiating payment:', error);
//     return { success: false, error: error.message };
//   }
// };

// // ═══════════════════════════════════════════════════════════════
// // ✅ SINGLE EXPORT BLOCK (NO DUPLICATES)
// // ═══════════════════════════════════════════════════════════════

// export {
//   loadRazorpayScript,
//   generateReceiptId,
//   createPayment,
//   updatePaymentStatus,
//   verifyPayment,
//   getPaymentById,
//   getSellerPayments,
//   initiatePayment
// };

// export default {
//   RAZORPAY_CONFIG,
//   loadRazorpayScript,
//   generateReceiptId,
//   createPayment,
//   updatePaymentStatus,
//   verifyPayment,
//   getPaymentById,
//   getSellerPayments,
//   initiatePayment
// };

// console.log('✅ Payment Service Loaded - RAZORPAY TEST MODE v2.1 (FIXED)'); 
// ═══════════════════════════════════════════════════════════════
// ✅ RAZORPAY PAYMENT SERVICE - PRODUCTION READY v3.0 FINAL
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
import { db, auth } from './firebase';
import type {
  RazorpayConfig,
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
  environment: 'test'
};

console.log('⚠️ RAZORPAY TEST MODE - No backend required for testing');

// ═══════════════════════════════════════════════════════════════
// CACHE MANAGEMENT
// ═══════════════════════════════════════════════════════════════

interface CachedPayments {
  data: Payment[];
  timestamp: number;
}

const paymentCache: Map<string, CachedPayments> = new Map();
const CACHE_DURATION = 60000; // 1 minute

export const clearPaymentCache = (sellerId?: string): void => {
  if (sellerId) {
    paymentCache.delete(sellerId);
    console.log('🗑️ Cleared payment cache for seller:', sellerId);
  } else {
    paymentCache.clear();
    console.log('🗑️ Cleared all payment cache');
  }
};

// ═══════════════════════════════════════════════════════════════
// LOAD RAZORPAY SCRIPT
// ═══════════════════════════════════════════════════════════════

const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      console.log('✅ Razorpay script already loaded');
      resolve(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    
    script.onload = () => {
      console.log('✅ Razorpay script loaded successfully');
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
// GENERATE UNIQUE IDs
// ═══════════════════════════════════════════════════════════════

const generateReceiptId = (): string => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 11).toUpperCase();
  return `RCPT_${timestamp}_${random}`;
};

const generateTransactionId = (): string => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 15).toUpperCase();
  return `TXN_${timestamp}_${random}`;
};

// ═══════════════════════════════════════════════════════════════
// GET CLIENT IP
// ═══════════════════════════════════════════════════════════════

const getClientIP = async (): Promise<string> => {
  try {
    const response = await fetch('https://api.ipify.org?format=json', {
      signal: AbortSignal.timeout(3000)
    });
    const data = await response.json();
    return data.ip || 'unknown';
  } catch {
    return 'unknown';
  }
};

// ═══════════════════════════════════════════════════════════════
// CREATE PAYMENT RECORD
// ═══════════════════════════════════════════════════════════════

const createPayment = async (
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
      
      razorpay_order_id: '',
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

const updatePaymentStatus = async (
  paymentId: string,
  razorpayResponse: RazorpaySuccessResponse | Partial<RazorpaySuccessResponse>,
  verified: boolean
): Promise<{ success: boolean; error?: string }> => {
  try {
    console.log('🔄 Updating payment status for:', paymentId);
    
    const payment_status: Payment['payment_status'] = verified ? 'completed' : 'failed';
    
    await updateDoc(doc(db, 'payments', paymentId), {
      razorpay_payment_id: razorpayResponse.razorpay_payment_id || '',
      razorpay_order_id: razorpayResponse.razorpay_order_id || '',
      razorpay_signature: razorpayResponse.razorpay_signature || '',
      razorpay_response: razorpayResponse,
      
      payment_status: payment_status,
      verified: verified,
      completed_at: new Date().toISOString()
    });
    
    console.log('✅ Payment status updated:', payment_status);
    
    try {
      await addDoc(collection(db, 'adminLogs'), {
        action: 'payment_status_updated',
        payment_id: paymentId,
        razorpay_payment_id: razorpayResponse.razorpay_payment_id || '',
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
// VERIFY PAYMENT (TEST MODE)
// ═══════════════════════════════════════════════════════════════

const verifyPayment = async (
  paymentId: string,
  razorpayResponse: RazorpaySuccessResponse
): Promise<{ success: boolean; error?: string }> => {
  try {
    console.log('🔐 Verifying payment (TEST MODE - Basic check)...');
    
    const isValid = !!(razorpayResponse.razorpay_payment_id);
    
    if (!isValid) {
      throw new Error('Invalid payment response');
    }
    
    const updateResult = await updatePaymentStatus(
      paymentId,
      razorpayResponse,
      true
    );
    
    if (!updateResult.success) {
      throw new Error('Failed to update payment status');
    }
    
    console.log('✅ Payment verified (TEST MODE)');
    
    return { success: true };
    
  } catch (error: any) {
    console.error('❌ Payment verification failed:', error);
    return { success: false, error: error.message };
  }
};

// ═══════════════════════════════════════════════════════════════
// GET PAYMENT BY ID
// ═══════════════════════════════════════════════════════════════

const getPaymentById = async (paymentId: string): Promise<Payment | null> => {
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
// ✅ GET SELLER PAYMENT HISTORY - PRODUCTION v3.0 FINAL
// ═══════════════════════════════════════════════════════════════

const getSellerPayments = async (
  sellerId: string,
  limitCount: number = 50,
  forceRefresh: boolean = false
): Promise<Payment[]> => {
  try {
    // ✅ CHECK CACHE FIRST
    if (!forceRefresh) {
      const cached = paymentCache.get(sellerId);
      if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        console.log('📦 [CACHE HIT] Returning cached payments');
        return cached.data;
      }
    }
    
    console.log('═══════════════════════════════════════════════════════');
    console.log('📋 [GET PAYMENTS] Starting for seller:', sellerId);
    console.log('📊 Limit:', limitCount);
    console.log('🔄 Force refresh:', forceRefresh);
    
    // ✅ VALIDATION
    if (!sellerId || sellerId.trim() === '') {
      console.warn('⚠️ Invalid seller ID provided');
      return [];
    }
    
    let payments: Payment[] = [];
    
    // ═══════════════════════════════════════════════════════════
    // TRY METHOD 1: Composite Query (seller_id + orderBy)
    // ═══════════════════════════════════════════════════════════
    
    try {
      console.log('🔄 [METHOD 1] Trying composite query...');
      
      const compositeQuery = query(
        collection(db, 'payments'),
        where('seller_id', '==', sellerId),
        orderBy('created_at', 'desc'),
        limit(limitCount)
      );
      
      const snapshot = await getDocs(compositeQuery);
      
      if (!snapshot.empty) {
        payments = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            seller_id: data.seller_id || '',
            seller_email: data.seller_email || '',
            seller_business: data.seller_business || '',
            
            plan_id: data.plan_id || '',
            plan_name: data.plan_name || 'Unknown Plan',
            amount: typeof data.amount === 'number' ? data.amount : 0,
            currency: data.currency || 'INR',
            
            razorpay_order_id: data.razorpay_order_id || '',
            razorpay_payment_id: data.razorpay_payment_id || '',
            razorpay_signature: data.razorpay_signature || '',
            razorpay_receipt: data.razorpay_receipt || '',
            razorpay_response: data.razorpay_response || null,
            
            transaction_id: data.transaction_id || '',
            test_mode: data.test_mode || false,
            
            payment_status: data.payment_status || 'initiated',
            verified: data.verified || false,
            
            created_at: data.created_at || new Date().toISOString(),
            completed_at: data.completed_at || undefined,
            ip_address: data.ip_address || undefined,
            user_agent: data.user_agent || undefined
          } as Payment;
        });
        
        console.log(`✅ [METHOD 1] Success - Fetched ${payments.length} payments`);
      } else {
        console.log('ℹ️ [METHOD 1] No payments found');
      }
      
    } catch (indexError: any) {
      console.warn('⚠️ [METHOD 1] Composite query failed:', indexError.message);
      console.log('🔄 Falling back to METHOD 2...');
      
      // ═══════════════════════════════════════════════════════════
      // FALLBACK METHOD 2: Simple Query + Client-Side Sort
      // ═══════════════════════════════════════════════════════════
      
      try {
        console.log('🔄 [METHOD 2] Using simple query with client-side sort...');
        
        const simpleQuery = query(
          collection(db, 'payments'),
          where('seller_id', '==', sellerId)
        );
        
        const snapshot = await getDocs(simpleQuery);
        
        if (!snapshot.empty) {
          const allPayments = snapshot.docs.map(doc => {
            const data = doc.data();
            return {
              id: doc.id,
              seller_id: data.seller_id || '',
              seller_email: data.seller_email || '',
              seller_business: data.seller_business || '',
              
              plan_id: data.plan_id || '',
              plan_name: data.plan_name || 'Unknown Plan',
              amount: typeof data.amount === 'number' ? data.amount : 0,
              currency: data.currency || 'INR',
              
              razorpay_order_id: data.razorpay_order_id || '',
              razorpay_payment_id: data.razorpay_payment_id || '',
              razorpay_signature: data.razorpay_signature || '',
              razorpay_receipt: data.razorpay_receipt || '',
              razorpay_response: data.razorpay_response || null,
              
              transaction_id: data.transaction_id || '',
              test_mode: data.test_mode || false,
              
              payment_status: data.payment_status || 'initiated',
              verified: data.verified || false,
              
              created_at: data.created_at || new Date().toISOString(),
              completed_at: data.completed_at || undefined,
              ip_address: data.ip_address || undefined,
              user_agent: data.user_agent || undefined
            } as Payment;
          });
          
          // ✅ Client-side sort by created_at (descending)
          payments = allPayments.sort((a, b) => {
            const dateA = new Date(a.created_at).getTime();
            const dateB = new Date(b.created_at).getTime();
            return dateB - dateA; // Newest first
          }).slice(0, limitCount); // Apply limit
          
          console.log(`✅ [METHOD 2] Success - Fetched and sorted ${payments.length} payments`);
        } else {
          console.log('ℹ️ [METHOD 2] No payments found');
        }
        
      } catch (fallbackError: any) {
        console.error('❌ [METHOD 2] Fallback query also failed:', fallbackError);
        throw fallbackError;
      }
    }
    
    // ═══════════════════════════════════════════════════════════
    // POST-PROCESSING & ANALYTICS
    // ═══════════════════════════════════════════════════════════
    
    console.log('📊 [POST-PROCESS] Analyzing payment data...');
    
    // ✅ FIXED: Only check for valid payment_status values
    const completedPayments = payments.filter(p => 
      p.payment_status === 'completed' && p.verified === true
    );
    
    const initiatedPayments = payments.filter(p => 
      p.payment_status === 'initiated'
    );
    
    const failedPayments = payments.filter(p => 
      p.payment_status === 'failed'
    );
    
    const refundedPayments = payments.filter(p => 
      p.payment_status === 'refunded'
    );
    
    console.log('📊 Payment Summary:');
    console.log('   ✅ Completed:', completedPayments.length);
    console.log('   ⏳ Initiated:', initiatedPayments.length);
    console.log('   ❌ Failed:', failedPayments.length);
    console.log('   💰 Refunded:', refundedPayments.length);
    console.log('   📝 Total:', payments.length);
    
    // Calculate total amount
    const totalAmount = completedPayments.reduce((sum, p) => sum + p.amount, 0);
    console.log('   💵 Total Amount (Completed): ₹' + totalAmount.toLocaleString('en-IN'));
    
    // ✅ SANITIZE SENSITIVE DATA (for security)
    const sanitizedPayments = payments.map(payment => ({
      ...payment,
      // Mask IP address
      ip_address: payment.ip_address 
        ? '***.***.***.' + payment.ip_address.split('.').pop() 
        : undefined,
      // Truncate user agent
      user_agent: payment.user_agent 
        ? payment.user_agent.substring(0, 50) + '...' 
        : undefined
    }));
    
    // ✅ STORE IN CACHE
    paymentCache.set(sellerId, {
      data: sanitizedPayments,
      timestamp: Date.now()
    });
    console.log('💾 [CACHE] Stored payments in cache');
    
    console.log('✅ [GET PAYMENTS] Complete');
    console.log('═══════════════════════════════════════════════════════');
    
    return sanitizedPayments;
    
  } catch (error: any) {
    console.error('═══════════════════════════════════════════════════════');
    console.error('❌ [GET PAYMENTS] Fatal Error:', error);
    console.error('Error Code:', error.code);
    console.error('Error Message:', error.message);
    console.error('Stack Trace:', error.stack);
    console.error('═══════════════════════════════════════════════════════');
    
    // ✅ Return empty array instead of throwing (fail gracefully)
    return [];
  }
};

// ═══════════════════════════════════════════════════════════════
// INITIATE RAZORPAY PAYMENT - TEST MODE
// ═══════════════════════════════════════════════════════════════

const initiatePayment = async (
  planId: string,
  planName: string,
  amount: number
): Promise<{ 
  success: boolean; 
  paymentId?: string; 
  checkoutOptions?: RazorpayCheckoutOptions; 
  error?: string 
}> => {
  try {
    console.log('🚀 Initiating Razorpay payment (TEST MODE)...');
    console.log('💰 Plan:', planName, '| Amount: ₹', amount);
    
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error('User not authenticated');
    }
    
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
    
    const transactionId = generateTransactionId();
    
    console.log('📝 Transaction ID:', transactionId);
    console.log('📝 Receipt ID:', paymentResult.receipt);
    
    await updateDoc(doc(db, 'payments', paymentResult.paymentId), {
      razorpay_receipt: paymentResult.receipt,
      transaction_id: transactionId,
      test_mode: true,
      updated_at: new Date().toISOString()
    });
    
    const checkoutOptions: RazorpayCheckoutOptions = {
      key: RAZORPAY_CONFIG.key_id,
      amount: Math.round(amount * 100),
      currency: 'INR',
      name: 'SrijanX Tile',
      description: `${planName} - Test Mode`,
      image: '/logo.png',
      
      handler: () => {},
      
      prefill: {
        name: sellerData.owner_name || sellerData.business_name || 'Customer',
        email: currentUser.email || '',
        contact: sellerData.phone || ''
      },
      
      notes: {
        plan_id: planId,
        plan_name: planName,
        seller_id: currentUser.uid,
        payment_id: paymentResult.paymentId,
        transaction_id: transactionId,
        test_mode: 'true'
      },
      
      theme: {
        color: '#9333EA',
        backdrop_color: '#000000'
      },
      
      modal: {
        backdropclose: false,
        escape: true,
        handleback: true,
        confirm_close: true,
        ondismiss: () => {
          console.log('⚠️ Payment modal dismissed');
        },
        animation: true
      }
    };
    
    console.log('✅ Payment initiation successful (TEST MODE)');
    
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
// ✅ EXPORTS - PRODUCTION READY
// ═══════════════════════════════════════════════════════════════

export {
  loadRazorpayScript,
  generateReceiptId,
  createPayment,
  updatePaymentStatus,
  verifyPayment,
  getPaymentById,
  getSellerPayments,
  initiatePayment
};

export default {
  RAZORPAY_CONFIG,
  loadRazorpayScript,
  generateReceiptId,
  createPayment,
  updatePaymentStatus,
  verifyPayment,
  getPaymentById,
  getSellerPayments,
  initiatePayment,
  clearPaymentCache
};

console.log('✅ Payment Service Loaded - RAZORPAY PRODUCTION v3.0 FINAL');