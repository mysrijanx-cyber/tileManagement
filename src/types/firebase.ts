// Firebase related types
export interface User {
    uid: string;
    email: string | null;
    displayName: string | null;
  }
  export interface CustomerInquiry {
  id?: string;
  customer_name: string;
  customer_email: string | null;        // ✅ Can be null
  customer_phone: string;
  customer_address: string | null;      // ✅ Can be null
  seller_id: string;
  tile_id: string;
  tile_name: string;
  tile_code?: string;
  scanned_by: string;
  worker_email: string;
  worker_name?: string;
  device_type?: string;
  timestamp: string;
  status: 'new' | 'contacted' | 'converted' | 'closed';
  source?: 'qr_scan' | 'manual' | 'website';
  notes?: string;
  follow_up_date?: string;
  created_at: string;
  updated_at: string;
}

  export interface UserProfile {
    id: string;
    email: string;
    role: 'customer' | 'seller' | 'admin';
    name?: string;
    createdAt: Date;
  }
  
  export interface SellerProfile {
    userId: string;
    businessName: string;
    ownerName: string;
    email: string;
    phone?: string;
    setupCompleted: boolean;
  }