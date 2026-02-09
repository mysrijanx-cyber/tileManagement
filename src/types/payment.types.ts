// ═══════════════════════════════════════════════════════════════
// ✅ PAYMENT TYPES - RAZORPAY PRODUCTION v1.0
// ═══════════════════════════════════════════════════════════════

export interface RazorpayConfig {
  key_id: string;
  key_secret: string;
  environment: 'test' | 'production';
}

export interface RazorpayOrderData {
  amount: number; // in paise (₹100 = 10000 paise)
  currency: string;
  receipt: string;
  notes?: Record<string, any>;
}

export interface RazorpayCheckoutOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  image?: string;
  order_id: string;
  handler: (response: RazorpaySuccessResponse) => void;
  prefill: {
    name: string;
    email: string;
    contact: string;
  };
  notes?: Record<string, any>;
  theme: {
    color: string;
  };
  modal?: {
    ondismiss?: () => void;
  };
}

export interface RazorpaySuccessResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

export interface RazorpayErrorResponse {
  error: {
    code: string;
    description: string;
    source: string;
    step: string;
    reason: string;
    metadata: {
      order_id: string;
      payment_id: string;
    };
  };
}

export interface Payment {
  id: string;
  
  // Seller Details
  seller_id: string;
  seller_email: string;
  seller_business: string;
  
  // Plan Details
  plan_id: string;
  plan_name: string;
  amount: number; // in rupees
  currency: string;
  
  // Razorpay Details
  razorpay_order_id: string;
  razorpay_payment_id?: string;
  razorpay_signature?: string;
  razorpay_receipt: string;
  
  // Payment Status
  payment_status: 'initiated' | 'processing' | 'completed' | 'failed' | 'cancelled';
  verified: boolean;
  
  // Razorpay Response
  razorpay_response?: RazorpaySuccessResponse | RazorpayErrorResponse;
  
  // Timestamps
  created_at: string;
  completed_at?: string;
  
  // Metadata
  ip_address?: string;
  user_agent?: string;
}

export interface CreatePaymentData {
  seller_id: string;
  seller_email: string;
  seller_business: string;
  plan_id: string;
  plan_name: string;
  amount: number;
  currency: string;
}

export interface Subscription {
  id: string;
  seller_id: string;
  plan_id: string;
  
  status: 'active' | 'expired' | 'cancelled' | 'pending';
  
  start_date: string;
  end_date: string;
  renewal_date?: string;
  
  last_payment_id?: string;
  auto_renew: boolean;
  
  created_at: string;
  cancelled_at?: string;
  cancellation_reason?: string;
}

export interface CreateSubscriptionData {
  seller_id: string;
  plan_id: string;
  payment_id: string;
  billing_cycle: 'monthly' | 'yearly';
}

// Razorpay Window Type
declare global {
  interface Window {
    Razorpay: any;
  }
}

console.log('✅ Payment Types loaded - RAZORPAY PRODUCTION v1.0');