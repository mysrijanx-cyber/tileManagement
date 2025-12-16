// ═══════════════════════════════════════════════════════════════
// ✅ PLAN TYPES - PRODUCTION v1.0
// ═══════════════════════════════════════════════════════════════

export interface PlanFeature {
  title: string;
  description: string;
  included: boolean;
  icon?: string;
  tooltip?: string;
}

export interface PlanLimits {
  max_tiles: number;              // -1 for unlimited
  max_qr_codes: number;
  max_workers: number;
  analytics_retention_days: number;
  customer_inquiries_limit: number;
}

export interface Plan {
  id: string;
  plan_name: string;
  price: number;
  currency: string;
  billing_cycle: 'monthly' | 'yearly';
  
  features: PlanFeature[];
  limits: PlanLimits;
  
  is_active: boolean;
  is_popular: boolean;
  display_order: number;
  
  created_at: string;
  created_by: string;
  updated_at: string;
  updated_by?: string;
}

export interface CreatePlanData {
  plan_name: string;
  price: number;
  currency: string;
  billing_cycle: 'monthly' | 'yearly';
  features: PlanFeature[];
  limits: PlanLimits;
  is_active: boolean;
  is_popular: boolean;
  display_order: number;
}

export interface UpdatePlanData extends Partial<CreatePlanData> {
  updated_by: string;
}

export interface PlanValidationError {
  plan_name?: string;
  price?: string;
  features?: string;
  limits?: string;
  [key: string]: string | undefined;
}

console.log('✅ Plan Types loaded - PRODUCTION v1.0');