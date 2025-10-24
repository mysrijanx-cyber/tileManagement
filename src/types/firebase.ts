// Firebase related types
export interface User {
    uid: string;
    email: string | null;
    displayName: string | null;
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