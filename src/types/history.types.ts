export interface SubscriptionHistoryItem {
  id: string;
  seller_id: string;
  plan_id: string;
  plan_name: string;
  plan_price: number;
  currency: string;
  
  // Purchase Details
  purchased_at: string;
  purchased_date: string; // Formatted date
  purchased_time: string; // Formatted time
  purchased_day: string;  // Day name
  
  // Expiry Details
  expired_at: string;
  expired_date: string;   // Formatted date
  expired_time: string;   // Formatted time
  expired_day: string;    // Day name
  
  // Status
  status: 'active' | 'expired' | 'cancelled' | 'completed';
  
  // Payment Info
  payment_id: string;
  payment_status: 'completed' | 'failed' | 'refunded';
  
  // Usage Stats
  total_scans_used?: number;
  scan_limit?: number;
  
  // Duration
  validity_duration: number;
  validity_unit: string;
  total_days: number;
  
  created_at: string;
}

export interface HistoryFilters {
  status?: 'all' | 'active' | 'expired' | 'cancelled' | 'completed';
  dateRange?: {
    start: string;
    end: string;
  };
  planName?: string;
}

export interface HistoryStats {
  total_plans_purchased: number;
  total_amount_spent: number;
  active_plans: number;
  expired_plans: number;
  average_plan_duration: number;
  most_purchased_plan: string;
}