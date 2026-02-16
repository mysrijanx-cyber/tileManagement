// ═══════════════════════════════════════════════════════════════
// ✅ PAYMENT TYPES - PRODUCTION READY v2.0
// ═══════════════════════════════════════════════════════════════

export interface RazorpayConfig {
  key_id: string;
  key_secret: string;
  environment: 'test' | 'production';
}

export interface RazorpayCheckoutOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  image?: string;
  order_id?: string;
  handler: (response: RazorpaySuccessResponse) => void;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  notes?: Record<string, any>;
  theme?: {
    color?: string;
    backdrop_color?: string;
    hide_topbar?: boolean;
  };
  modal?: {
    backdropclose?: boolean;
    escape?: boolean;
    handleback?: boolean;
    confirm_close?: boolean;
    ondismiss?: () => void;
    animation?: boolean;
  };
  subscription_id?: string;
  subscription_card_change?: boolean;
  recurring?: boolean;
  callback_url?: string;
  redirect?: boolean;
  customer_id?: string;
  remember_customer?: boolean;
  timeout?: number;
  readonly?: {
    contact?: boolean;
    email?: boolean;
    name?: boolean;
  };
  hidden?: {
    contact?: boolean;
    email?: boolean;
  };
  send_sms_hash?: boolean;
  allow_rotation?: boolean;
  retry?: {
    enabled?: boolean;
    max_count?: number;
  };
  config?: {
    display?: {
      language?: string;
      hide?: Array<string>;
      preferences?: {
        show_default_blocks?: boolean;
      };
    };
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
      order_id?: string;
      payment_id?: string;
    };
  };
}

export interface RazorpayOrderData {
  amount: number;
  currency: string;
  receipt: string;
  notes?: Record<string, any>;
  partial_payment?: boolean;
}

export interface Payment {
  id: string;
  seller_id: string;
  seller_email: string;
  seller_business: string;
  
  plan_id: string;
  plan_name: string;
  amount: number;
  currency: string;
  
  razorpay_order_id: string;
  razorpay_payment_id?: string;
  razorpay_signature?: string;
  razorpay_receipt: string;
  razorpay_response?: any;
  
  transaction_id?: string;
  test_mode?: boolean;
  
  payment_status: 'initiated' | 'completed' | 'failed' | 'refunded';
  verified: boolean;
  
  created_at: string;
  completed_at?: string;
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
  
  status: 'active' | 'cancelled' | 'expired' | 'pending';
  
  start_date: string;
  end_date: string;
  renewal_date: string;
  
  last_payment_id: string;
  auto_renew: boolean;
  
  cancelled_at?: string;
  cancellation_reason?: string;
  
  created_at: string;
}

export interface CreateSubscriptionData {
  seller_id: string;
  plan_id: string;
  payment_id: string;
  billing_cycle: 'monthly' | 'yearly';
}

export interface PayUFormData {
  key: string;
  txnid: string;
  amount: string;
  productinfo: string;
  firstname: string;
  email: string;
  phone: string;
  surl: string;
  furl: string;
  hash: string;
  udf1?: string;
  udf2?: string;
  udf3?: string;
  udf4?: string;
  udf5?: string;
}

export interface PaymentServiceResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default {};

console.log('✅ Payment Types loaded - v2.0');