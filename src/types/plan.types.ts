// ═══════════════════════════════════════════════════════════════
// ✅ PLAN TYPES - PRODUCTION READY v2.0
// ═══════════════════════════════════════════════════════════════

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
}

export interface Plan {
  id: string;
  plan_name: string;
  price: number;
  billing_cycle: 'monthly' | 'yearly';
  
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
  price: number;
  billing_cycle: 'monthly' | 'yearly';
  features: PlanFeature[];
  limits: PlanLimits;
  is_active?: boolean;
  is_popular?: boolean;
  display_order?: number;
  stripe_price_id?: string;
}

export interface UpdatePlanData {
  plan_name?: string;
  price?: number;
  billing_cycle?: 'monthly' | 'yearly';
  features?: PlanFeature[];
  limits?: PlanLimits;
  is_active?: boolean;
  is_popular?: boolean;
  display_order?: number;
  stripe_price_id?: string;
}

export interface PlanValidationError {
  plan_name?: string;
  price?: string;
  billing_cycle?: string;
  features?: string;
  limits?: string;
  display_order?: string;
  stripe_price_id?: string;
}

export default {};

console.log('✅ Plan Types loaded - v2.0');