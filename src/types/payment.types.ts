// ═══════════════════════════════════════════════════════════════
// ✅ PAYMENT TYPES - PRODUCTION v1.0
// ═══════════════════════════════════════════════════════════════

export interface PayUConfig {
  mode: 'test' | 'production';
  merchant_key: string;
  merchant_salt: string;
  base_url: string;
  success_url: string;
  failure_url: string;
  cancel_url: string;
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

export interface PayUResponse {
  status: string;
  txnid: string;
  amount: string;
  productinfo: string;
  firstname: string;
  email: string;
  phone: string;
  mihpayid: string;
  mode: string;
  bank_ref_num?: string;
  bankcode?: string;
  cardnum?: string;
  hash: string;
  error?: string;
  error_Message?: string;
  udf1?: string;
  udf2?: string;
  udf3?: string;
  udf4?: string;  // ✅ Add this
  udf5?: string
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
  
  payu_txn_id: string;
  payu_order_id: string;
  payu_payment_id?: string;
  payu_status: string;
  payu_mode?: string;
  
  payu_response?: PayUResponse;
  
  payment_status: 'initiated' | 'processing' | 'completed' | 'failed' | 'cancelled';
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

console.log('✅ Payment Types loaded - PRODUCTION v1.0');