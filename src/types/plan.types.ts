

export interface PlanFeature {
  title: string;
  description: string;
  included: boolean;
  icon?: string;
  tooltip?: string;
}

export interface PlanLimits {
  max_tiles: number;
  max_collections: number;
  max_qr_codes: number;
  max_workers: number;
  max_storage_mb: number;
  analytics_retention_days: number;
  customer_inquiries_limit: number;
  max_scans: number;  // ✅ NEW: -1 = unlimited, positive = limit
}

export interface Plan {
  id: string;
  plan_name: string;
  price: number;
  currency: string;
  billing_cycle: 'monthly' | 'yearly';
  
  validity_duration: number;
  validity_unit: 'days' | 'minutes' | 'hours' | 'months' | 'years';
  
  features: PlanFeature[];
  limits: PlanLimits;
  
  is_active: boolean;
  is_popular: boolean;
  display_order?: number;
  
  stripe_price_id?: string;
  
  created_at: string;
  created_by?: string;
  updated_at: string;
  updated_by?: string;
  
  deleted_at?: string;
  deleted_by?: string;
}

export interface CreatePlanData {
  plan_name: string;
  price: number | string;
  currency: string;
  billing_cycle: 'monthly' | 'yearly';
  
  validity_duration: number;
  validity_unit: 'days' | 'minutes' | 'hours' | 'months' | 'years';
  
  features: PlanFeature[];
  limits: PlanLimits;
  is_active?: boolean;
  is_popular?: boolean;
  display_order?: number;
  stripe_price_id?: string;
}

export interface UpdatePlanData {
  plan_name?: string;
  price?: number | string;
  currency?: string;
  billing_cycle?: 'monthly' | 'yearly';
  
  validity_duration?: number;
  validity_unit?: 'days' | 'minutes' | 'hours' | 'months' | 'years';
  
  features?: PlanFeature[];
  limits?: PlanLimits;
  is_active?: boolean;
  is_popular?: boolean;
  display_order?: number;
  stripe_price_id?: string;
  updated_by?: string;
}

export interface PlanValidationError {
  plan_name?: string;
  price?: string;
  currency?: string;
  billing_cycle?: string;
  validity_duration?: string;
  validity_unit?: string;
  features?: string;
  limits?: string;
  is_active?: string;
  is_popular?: string;
  display_order?: string;
  stripe_price_id?: string;
  updated_by?: string;
}

export default {};

console.log('✅ Plan Types loaded - v5.0 (WITH SCAN LIMITS)');