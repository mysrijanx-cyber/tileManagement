
// // ═══════════════════════════════════════════════════════════════
// import CryptoJS from 'crypto-js';

// const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

// // ═══════════════════════════════════════════════════════════════
// // HELPER FUNCTION - Decrypt Token
// // ═══════════════════════════════════════════════════════════════
// function getDecryptedToken(encryptedToken: string): string {
//   const SECRET = import.meta.env.VITE_JWT_SECRET || 'hellobuddy';
//   console.log('🔑 Decrypting with secret (first 10 chars):', SECRET.substring(0, 10));
  
//   const bytes = CryptoJS.AES.decrypt(encryptedToken, SECRET);
//   const decrypted = bytes.toString(CryptoJS.enc.Utf8);
  
//   if (!decrypted) {
//     throw new Error('Token decryption failed - check VITE_JWT_SECRET');
//   }
  
//   console.log('🔓 Decrypted token (first 50 chars):', decrypted.substring(0, 50));
  
//   // ✅ VALIDATE JWT FORMAT
//   const parts = decrypted.split('.');
//   if (parts.length !== 3) {
//     throw new Error(`Invalid JWT format after decryption. Parts: ${parts.length}`);
//   }
  
//   return decrypted;
// }

// // ═══════════════════════════════════════════════════════════════
// // FETCH API WITH TOKEN DECRYPTION
// // ═══════════════════════════════════════════════════════════════
// async function fetchAPI(endpoint: string, options: RequestInit = {}) {
//   const url = `${API_BASE_URL}${endpoint}`;

//   try {
//     console.log(`📡 API Call: ${options.method || 'GET'} ${endpoint}`);
    
//     // ✅ PROPERLY TYPED HEADERS
//     const headers: Record<string, string> = {
//       'Content-Type': 'application/json',
//     };

//     // ✅ MERGE EXISTING HEADERS
//     if (options.headers) {
//       const existingHeaders = options.headers as Record<string, string>;
//       Object.assign(headers, existingHeaders);
//     }

//     // ✅ DECRYPT AUTHORIZATION TOKEN IF PRESENT
//     if (headers['Authorization']) {
//       const token = headers['Authorization'].replace('Bearer ', '');
//       const decrypted = getDecryptedToken(token);
//       headers['Authorization'] = `Bearer ${decrypted}`;
//       console.log('🔓 Token decrypted for backend');
//     }

//     const response = await fetch(url, {
//       ...options,
//       headers,
//     });

//     console.log(`📊 Response Status: ${response.status} ${response.statusText}`);
    
//     const contentType = response.headers.get('content-type');
//     console.log(`📝 Response Content-Type: ${contentType}`);

//     // ✅ FIRST READ RESPONSE AS TEXT
//     const responseText = await response.text();
//     console.log(`📄 Response Body (first 200 chars):`, responseText.substring(0, 200));

//     // ✅ THEN PARSE JSON
//     let data;
//     try {
//       data = JSON.parse(responseText);
//     } catch (parseErr) {
//       console.error('❌ JSON Parse Error:', parseErr);
//       console.error('Full Response:', responseText);
//       throw new Error(`Failed to parse response: ${response.status} ${response.statusText}`);
//     }

//     if (!response.ok) {
//       console.error('❌ API Error:', data);
//       throw new Error(data.message || `API request failed: ${response.status}`);
//     }

//     console.log('✅ API Success:', endpoint);
//     return data;
//   } catch (error: any) {
//     console.error('❌ API Request Failed:', error);
//     throw error;
//   }
// }

// // ═══════════════════════════════════════════════════════════════
// // PAYMENT APIs - TypeScript Interfaces
// // ═══════════════════════════════════════════════════════════════

// export interface CreateOrderRequest {
//   planId: string;
//   billingCycle?: 'monthly' | 'yearly';
// }

// export interface CreateOrderResponse {
//   success: boolean;
//   data: {
//     paymentId: string;
//     orderId: string;
//     amount: number;
//     currency: string;
//     checkoutOptions: {
//       key: string;
//       amount: number;
//       currency: string;
//       name: string;
//       description: string;
//       order_id: string;
//       prefill: {
//         email: string;
//       };
//       theme: {
//         color: string;
//       };
//     };
//   };
//   message: string;
// }

// export interface VerifyPaymentRequest {
//   paymentId: string;
//   razorpay_order_id: string;
//   razorpay_payment_id: string;
//   razorpay_signature: string;
// }

// export interface VerifyPaymentResponse {
//   success: boolean;
//   data: {
//     paymentId: string;
//     subscriptionId: string;
//     subscription: any;
//     payment: any;
//   };
//   message: string;
// }

// export interface PaymentDetailsResponse {
//   success: boolean;
//   data: {
//     payment: {
//       id: string;
//       status: string;
//       amount: number;
//       currency: string;
//       plan_name: string;
//       plan_id: string;
//       razorpay_order_id: string;
//       razorpay_payment_id: string;
//       razorpay_receipt: string;
//       transaction_id: string;
//       seller_email: string;
//       seller_business: string;
//       created_at: string;
//       payment_method?: string;
//     };
//   };
// }

// // ═══════════════════════════════════════════════════════════════
// // ✅ CREATE PAYMENT ORDER
// // ═══════════════════════════════════════════════════════════════

// export async function createPaymentOrder(
//   planId: string,
//   billingCycle: 'monthly' | 'yearly' = 'monthly',
//   authToken: string
// ): Promise<CreateOrderResponse> {
//   return fetchAPI('/api/payment/create-order', {
//     method: 'POST',
//     headers: {
//       'Authorization': `Bearer ${authToken}`,
//     },
//     body: JSON.stringify({ planId, billingCycle }),
//   });
// }

// // ═══════════════════════════════════════════════════════════════
// // ✅ VERIFY PAYMENT
// // ═══════════════════════════════════════════════════════════════

// export async function verifyPaymentBackend(
//   paymentId: string,
//   razorpay_order_id: string,
//   razorpay_payment_id: string,
//   razorpay_signature: string,
//   authToken: string
// ): Promise<VerifyPaymentResponse> {
//   return fetchAPI('/api/payment/verify', {
//     method: 'POST',
//     headers: {
//       'Authorization': `Bearer ${authToken}`,
//     },
//     body: JSON.stringify({
//       paymentId,
//       razorpay_order_id,
//       razorpay_payment_id,
//       razorpay_signature,
//     }),
//   });
// }

// // ═══════════════════════════════════════════════════════════════
// // ✅ GET PAYMENT DETAILS
// // ═══════════════════════════════════════════════════════════════

// export async function getPaymentDetails(
//   paymentId: string,
//   authToken: string
// ): Promise<PaymentDetailsResponse> {
//   return fetchAPI(`/api/payment/${paymentId}`, {
//     method: 'GET',
//     headers: {
//       'Authorization': `Bearer ${authToken}`,
//     },
//   });
// }

// // ═══════════════════════════════════════════════════════════════
// // ✅ HEALTH CHECK
// // ═══════════════════════════════════════════════════════════════

// export async function checkBackendHealth(): Promise<any> {
//   return fetchAPI('/health', { method: 'GET' });
// }

// console.log('✅ Backend API Service loaded - v2.0 (TypeScript Fixed)'); 
// ═══════════════════════════════════════════════════════════════
// 🔌 BACKEND API SERVICE - PRODUCTION v3.0
// ═══════════════════════════════════════════════════════════════

import CryptoJS from 'crypto-js';

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
const JWT_SECRET = import.meta.env.VITE_JWT_SECRET || 'hellobuddy';

// ═══════════════════════════════════════════════════════════════
// ✅ HELPER: Decrypt Encrypted JWT Token
// ═══════════════════════════════════════════════════════════════
function getDecryptedToken(encryptedToken: string): string {
  try {
    console.log('🔐 Attempting to decrypt token...');
    
    const bytes = CryptoJS.AES.decrypt(encryptedToken, JWT_SECRET);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    
    if (!decrypted) {
      throw new Error('Token decryption failed - empty result');
    }
    
    // Validate JWT format (3 parts separated by dots)
    const parts = decrypted.split('.');
    if (parts.length !== 3) {
      throw new Error(`Invalid JWT format after decryption. Parts: ${parts.length}`);
    }
    
    console.log('✅ Token decrypted successfully');
    return decrypted;
  } catch (error: any) {
    console.error('❌ Token decryption error:', error.message);
    throw new Error('Token decryption failed - check VITE_JWT_SECRET');
  }
}

// ═══════════════════════════════════════════════════════════════
// ✅ HELPER: Check if Token is Plain JWT or Encrypted
// ═══════════════════════════════════════════════════════════════
function isPlainJWT(token: string): boolean {
  // Plain JWT has 3 parts separated by dots
  const parts = token.split('.');
  
  // Check if it has 3 parts and first part starts with 'eyJ' (base64 encoded JSON)
  if (parts.length === 3 && parts[0].startsWith('eyJ')) {
    console.log('✅ Detected plain JWT token');
    return true;
  }
  
  console.log('🔐 Detected encrypted token');
  return false;
}

// ═══════════════════════════════════════════════════════════════
// ✅ MAIN FETCH API FUNCTION
// ═══════════════════════════════════════════════════════════════
async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  const url = `${API_BASE_URL}${endpoint}`;

  try {
    console.log(`📡 API Call: ${options.method || 'GET'} ${endpoint}`);
    
    // ✅ Setup headers
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    // ✅ Merge existing headers
    if (options.headers) {
      const existingHeaders = options.headers as Record<string, string>;
      Object.assign(headers, existingHeaders);
    }

    // ✅ SMART TOKEN HANDLING
    if (headers['Authorization']) {
      const token = headers['Authorization'].replace('Bearer ', '');
      
      if (isPlainJWT(token)) {
        // ✅ Already plain JWT - use directly
        console.log('🔓 Using plain JWT token (no decryption needed)');
        headers['Authorization'] = `Bearer ${token}`;
      } else {
        // ✅ Encrypted token - decrypt it
        console.log('🔐 Decrypting encrypted token...');
        const decrypted = getDecryptedToken(token);
        headers['Authorization'] = `Bearer ${decrypted}`;
        console.log('✅ Token decrypted and ready');
      }
    }

    // ✅ Make API call
    const response = await fetch(url, {
      ...options,
      headers,
    });

    console.log(`📊 Response Status: ${response.status} ${response.statusText}`);
    
    const contentType = response.headers.get('content-type');
    console.log(`📝 Response Content-Type: ${contentType}`);

    // ✅ Read response as text first
    const responseText = await response.text();
    console.log(`📄 Response Body (first 200 chars):`, responseText.substring(0, 200));

    // ✅ Parse JSON
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (parseErr) {
      console.error('❌ JSON Parse Error:', parseErr);
      console.error('Full Response:', responseText);
      throw new Error(`Failed to parse response: ${response.status} ${response.statusText}`);
    }

    // ✅ Check response status
    if (!response.ok) {
      console.error('❌ API Error:', data);
      throw new Error(data.message || `API request failed: ${response.status}`);
    }

    console.log('✅ API Success:', endpoint);
    return data;
    
  } catch (error: any) {
    console.error('❌ API Request Failed:', error);
    throw error;
  }
}

// ═══════════════════════════════════════════════════════════════
// 📦 TYPESCRIPT INTERFACES
// ═══════════════════════════════════════════════════════════════

export interface CreateOrderRequest {
  planId: string;
  billingCycle?: 'monthly' | 'yearly';
}

export interface CreateOrderResponse {
  success: boolean;
  data: {
    paymentId: string;
    orderId: string;
    amount: number;
    currency: string;
    checkoutOptions: {
      key: string;
      amount: number;
      currency: string;
      name: string;
      description: string;
      order_id: string;
      prefill: {
        email: string;
      };
      theme: {
        color: string;
      };
    };
  };
  message: string;
}

export interface VerifyPaymentRequest {
  paymentId: string;
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export interface VerifyPaymentResponse {
  success: boolean;
  data: {
    paymentId: string;
    subscriptionId: string;
    subscription: any;
    payment: any;
  };
  message: string;
}

export interface PaymentDetailsResponse {
  success: boolean;
  data: {
    payment: {
      id: string;
      status: string;
      amount: number;
      currency: string;
      plan_name: string;
      plan_id: string;
      razorpay_order_id: string;
      razorpay_payment_id: string;
      razorpay_receipt: string;
      transaction_id: string;
      seller_email: string;
      seller_business: string;
      created_at: string;
      payment_method?: string;
    };
  };
}

// ═══════════════════════════════════════════════════════════════
// 🔌 API FUNCTIONS
// ═══════════════════════════════════════════════════════════════

// ✅ CREATE PAYMENT ORDER
export async function createPaymentOrder(
  planId: string,
  billingCycle: 'monthly' | 'yearly' = 'monthly',
  authToken: string
): Promise<CreateOrderResponse> {
  return fetchAPI('/api/payment/create-order', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${authToken}`,
    },
    body: JSON.stringify({ planId, billingCycle }),
  });
}

// ✅ VERIFY PAYMENT
export async function verifyPaymentBackend(
  paymentId: string,
  razorpay_order_id: string,
  razorpay_payment_id: string,
  razorpay_signature: string,
  authToken: string
): Promise<VerifyPaymentResponse> {
  return fetchAPI('/api/payment/verify', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${authToken}`,
    },
    body: JSON.stringify({
      paymentId,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    }),
  });
}

// ✅ GET PAYMENT DETAILS
export async function getPaymentDetails(
  paymentId: string,
  authToken: string
): Promise<PaymentDetailsResponse> {
  return fetchAPI(`/api/payment/${paymentId}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${authToken}`,
    },
  });
}

// ✅ HEALTH CHECK
export async function checkBackendHealth(): Promise<any> {
  return fetchAPI('/health', { method: 'GET' });
}

console.log('✅ Backend API Service - PRODUCTION v3.0 (Smart Token Detection)');