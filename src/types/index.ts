
export interface Tile {
  id: string;
  name: string;
  imageUrl: string;
  textureUrl: string;
  category: 'floor' | 'wall' | 'both';
  size: string;
  price: number;
  inStock: boolean;
  stock: number;
  showroomId: string;
  sellerId: string;
  tileCode?: string;
  qrCode?: string;
  qrCodeUrl?: string;
  createdAt: string;
  updatedAt: string;
  tileSurface?: string;
  tileMaterial?: string;
  // Analytics fields
  viewCount?: number;
  scanCount?: number;
  applyCount?: number;
  totalScans?: number;
  lastScanned?: string;
}

export interface AnalyticsTile {
  id: string;
  name: string;
  imageUrl: string;
  category: string;
  size: string;
  price: number;
  viewCount: number;
}

export interface QRScannedTile {
  id: string;
  name: string;
  imageUrl: string;
  category: string;
  size: string;
  price: number;
  scanCount: number;
}

export interface QRGenerationHistory {
  id: string;
  sellerId: string;
  adminId?: string;
  generatedAt: string;
  generationType: 'bulk' | 'single';
  totalTiles: number;
  successCount: number;
  failedCount: number;
  tileIds: string[];
  failedTiles?: Array<{
    tileId: string;
    error: string;
  }>;
  duration?: number;
  metadata?: {
    browser?: string;
    device?: string;
  };
}

export interface DeviceScanStats {
  type: 'mobile' | 'desktop' | 'tablet' | 'unknown';
  count: number;
}

export interface LocationScanStats {
  city: string;
  country: string;
  count: number;
  flag?: string;
}
export interface ExcelTileData {
  name: string;
  category: 'floor' | 'wall' | 'both';
  size: string;
  price: number;
  stock: number;
  tileCode?: string;
  imageUrl: string;
  textureUrl: string;
   tileSurface?: string;
  tileMaterial?: string;
  
}
// ═══════════════════════════════════════════════════════════════
// ✅ ADD THIS INTERFACE (Don't remove existing code)
// ═══════════════════════════════════════════════════════════════

export interface CustomerInquiry {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  customer_address: string;
  tile_id: string;
  tile_name: string;
  tile_code?: string;
  tile_image_url?: string;
  tile_size?: string;
  tile_price?: number;
  scanned_by: string; // worker_id
  worker_email: string;
  seller_id: string;
  seller_business_name: string;
  timestamp: string;
  status: 'new' | 'contacted' | 'converted' | 'closed';
  notes?: string;
  follow_up_date?: string;
  source: 'qr_scan' | 'manual_entry';
  device_type?: 'mobile' | 'tablet' | 'desktop';
  created_at?: string;
  updated_at?: string;
}

// ===== USER & PROFILE INTERFACES =====

// In your types.ts file, update the UserProfile interface:

// export interface UserProfile {
//   id: string;
//   user_id: string;
//   email: string;
//   full_name: string;
//   role: 'admin' | 'seller' | 'customer';
//   account_status?: 'active' | 'inactive' | 'suspended' | 'pending'; // Add this
//   created_at: string;
//   updated_at: string;
//   last_login?: string; // Add this
//   email_verified?: boolean; // Add this
//   onboarding_completed?: boolean; // Add this
//   created_by?: string; // Add this
//   permissions?: string[]; // Add this for admin users
// }
export interface UserProfile {
  id: string;
  user_id: string;
  email: string;
  full_name: string;
  role: 'admin' | 'seller' | 'customer' | 'worker'; // ✅ ADDED 'worker'
  account_status?: 'active' | 'inactive' | 'suspended' | 'pending' | 'deleted';
  created_at: string;
  updated_at: string;
  last_login?: string;
  email_verified?: boolean;
  onboarding_completed?: boolean;
  created_by?: string;
  permissions?: string[];
  
  // ✅ NEW: Worker-specific fields
  seller_id?: string; // For workers - parent seller ID
  is_active?: boolean; // For workers - enable/disable login
}


// export interface TileSeller {
//   id: string;
//   user_id: string;
//   business_name: string;
//   business_address?: string;
//   phone?: string;
//   website?: string;
//   logo_url?: string;
//   subscription_status: 'active' | 'inactive' | 'suspended';
//   created_at: string;
//   updated_at: string;
// }

// Make sure TileSeller type includes these fields

export interface TileSeller {
  id: string;
  user_id: string;
  business_name: string;
  owner_name: string;
  email: string;
  phone: string;
  business_address?: string;
  account_status: 'active' | 'inactive' | 'suspended' | 'deleted';
  subscription_status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
  created_by?: string;
  
  // Password tracking (optional)
  password_changed?: boolean;
  password_changed_at?: string;
  password_reset_sent?: string;
  password_reset_by?: string;
  // ✅ NEW: Worker management fields
  worker_id?: string | null;
  worker_email?: string | null;
  worker_created_at?: string | null;
  worker_last_password_reset?: string | null;
}
export interface SellerProfile {
  userId: string;
  user_id: string; // Firebase field
  businessName: string;
  business_name: string; // Firebase field
  ownerName: string;
  email: string;
  phone?: string;
  business_address?: string;
  setupCompleted: boolean;
  subscription_status?: 'active' | 'inactive' | 'suspended';
  created_at: string;
  updated_at: string;
}

// ===== SELLER REQUEST INTERFACE =====
export interface WorkerCredential {
  id: string;
  worker_id: string;
  seller_id: string;
  generated_password: string;
  created_at: string;
  viewed: boolean;
  expires_at: string;
}
export interface SellerRequest {
  id: string;
  businessName: string;
  ownerName: string;
  email: string;
  phone: string;
  businessAddress: string;
  documents: string[]; // URLs
  additionalInfo?: string;
  status: 'pending' | 'approved' | 'rejected';
  adminNotes?: string;
  requestedAt: string; // ISO timestamp
  reviewedAt?: string; // ISO timestamp
  reviewedBy?: string; // admin userId
}

// ===== CUSTOMER INTERFACES =====

export interface CustomerFavorite {
  id: string;
  customer_id: string;
  tile_id: string;
  showroom_id: string;
  created_at: string;
}

// ===== ROOM & SHOWROOM INTERFACES =====

export interface Room {
  id: string;
  name: string;
  type: 'hall' | 'washroom' | 'kitchen' | 'bedroom' | 'office'; // All room types
  description: string;
  thumbnail: string;
}

export interface Showroom {
  id: string;
  name: string;
  logo?: string;
  tiles: Tile[];
  customization: {
    primaryColor: string;
    secondaryColor: string;
    logoUrl?: string;
  };
}

export interface TileApplication {
  surface: 'floor' | 'wall';
  tileId: string;
}

// ===== UTILITY & RESULT INTERFACES =====

export interface UploadResult {
  success: number;
  errors: string[];
  tiles?: Tile[];
}

export interface QRCodeAnalytics {
  total: number;
  withQR: number;
  withoutQR: number;
  percentage: number;
}

export interface BulkUploadResult {
  successful: Tile[];
  failed: { row: number; error: string; data: any }[];
  totalProcessed: number;
}

// ===== FIREBASE AUTH INTERFACES =====

export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
}

// ===== ANALYTICS INTERFACES =====

export interface TileAnalytics {
  tileId: string;
  tileName: string;
  scanCount: number;
  viewTime: number;
  roomSelections: { [roomType: string]: number };
  lastScanned?: string;
}

export interface SellerAnalytics {
  sellerId: string;
  businessName: string;
  totalTiles: number;
  totalScans: number;
  popularTiles: TileAnalytics[];
  roomPreferences: { [roomType: string]: number };
  dailyScans: { date: string; count: number }[];
}

// ===== API RESPONSE INTERFACES =====

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

// ===== FORM INTERFACES =====

export interface TileFormData {
  name: string;
  category: 'floor' | 'wall' | 'both';
  size: string;
  price: number;
  stock: number;
  tileCode?: string;
  imageFile?: File;
  textureFile?: File;
  imageUrl?: string;
  textureUrl?: string;
}

export interface SellerRegistrationForm {
  businessName: string;
  ownerName: string;
  email: string;
  phone: string;
  businessAddress: string;
  website?: string;
  documents: File[];
  additionalInfo?: string;
}

// ===== SEARCH & FILTER INTERFACES =====

export interface TileFilters {
  category?: 'floor' | 'wall' | 'both';
  priceRange?: {
    min: number;
    max: number;
  };
  sizeFilter?: string[];
  inStockOnly?: boolean;
  hasQRCode?: boolean;
  sellerId?: string;
}

export interface SearchOptions {
  query?: string;
  filters?: TileFilters;
  sortBy?: 'name' | 'price' | 'created' | 'popularity';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  pageSize?: number;
}

// ===== NOTIFICATION INTERFACES =====

export interface Notification {
  id: string;
  userId: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  actionUrl?: string;
}

// ===== SUBSCRIPTION INTERFACES =====

export interface Subscription {
  id: string;
  sellerId: string;
  planType: 'basic' | 'premium' | 'enterprise';
  status: 'active' | 'inactive' | 'suspended' | 'cancelled';
  startDate: string;
  endDate: string;
  features: string[];
  limits: {
    maxTiles: number;
    maxQRCodes: number;
    analyticsRetention: number; // days
  };
}

// ===== AUDIT LOG INTERFACES =====

export interface AuditLog {
  id: string;
  userId: string;
  action: string;
  entityType: 'tile' | 'user' | 'seller' | 'qr_code';
  entityId: string;
  oldValues?: any;
  newValues?: any;
  timestamp: string;
  ipAddress?: string;
  userAgent?: string;
}

// ===== SETTINGS INTERFACES =====

export interface SellerSettings {
  sellerId: string;
  businessSettings: {
    displayName: string;
    description?: string;
    contactEmail: string;
    contactPhone: string;
    website?: string;
    socialLinks?: {
      facebook?: string;
      instagram?: string;
      twitter?: string;
    };
  };
  qrCodeSettings: {
    includePrice: boolean;
    includeStock: boolean;
    customMessage?: string;
    logoUrl?: string;
  };
  notificationSettings: {
    emailNotifications: boolean;
    lowStockAlerts: boolean;
    newOrderAlerts: boolean;
    weeklyReports: boolean;
  };
}

// ===== EXPORT INTERFACES =====

export interface ExportOptions {
  format: 'csv' | 'xlsx' | 'pdf';
  includeImages: boolean;
  includeQRCodes: boolean;
  dateRange?: {
    start: string;
    end: string;
  };
  filters?: TileFilters;
}

export interface ExportResult {
  success: boolean;
  downloadUrl?: string;
  filename?: string;
  error?: string;
}

// ===== WEBHOOK INTERFACES =====

export interface WebhookEvent {
  id: string;
  type: 'tile.created' | 'tile.updated' | 'tile.deleted' | 'qr.scanned' | 'order.placed';
  data: any;
  timestamp: string;
  sellerId: string;
}

// ===== ERROR INTERFACES =====

export interface AppError {
  code: string;
  message: string;
  details?: any;
  timestamp: string;
  userId?: string;
  requestId?: string;
}

// ===== DASHBOARD STATE INTERFACES =====

export interface DashboardState {
  tiles: Tile[];
  loading: boolean;
  error: string | null;
  success: string | null;
  filters: TileFilters;
  selectedTiles: string[];
  bulkActions: {
    generating: boolean;
    uploading: boolean;
    deleting: boolean;
  };
}

// ===== VALIDATION INTERFACES =====

export interface ValidationResult {
  isValid: boolean;
  errors: { [field: string]: string };
  warnings?: { [field: string]: string };
}

export interface FieldValidation {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any) => string | null;
}

export interface ExcelTileData {
  name: string;
  category: 'floor' | 'wall' | 'both';
  size: string;
  price: number;
  stock: number;
  tileCode?: string;
  imageUrl: string;
  textureUrl: string;
}
// ===== PERMISSION INTERFACES =====

export interface Permission {
  resource: string;
  action: 'create' | 'read' | 'update' | 'delete';
  condition?: any;
}

export interface Role {
  name: string;
  permissions: Permission[];
  description?: string;
}

// ===== TYPE GUARDS =====

export const isTile = (obj: any): obj is Tile => {
  return obj && 
    typeof obj.id === 'string' &&
    typeof obj.name === 'string' &&
    typeof obj.imageUrl === 'string' &&
    ['floor', 'wall', 'both'].includes(obj.category);
};

export const isUserProfile = (obj: any): obj is UserProfile => {
  return obj &&
    typeof obj.id === 'string' &&
    typeof obj.email === 'string' &&
    ['customer', 'seller', 'admin'].includes(obj.role);
};

// ===== CONSTANTS =====

export const TILE_CATEGORIES = ['floor', 'wall', 'both'] as const;
export const USER_ROLES = ['customer', 'seller', 'admin'] as const;
export const ROOM_TYPES = ['hall', 'washroom', 'kitchen', 'bedroom', 'office'] as const;
export const SUBSCRIPTION_STATUS = ['active', 'inactive', 'suspended', 'cancelled'] as const;

// ===== DEFAULT VALUES =====

export const DEFAULT_TILE: Partial<Tile> = {
  category: 'both',
  inStock: true,
  stock: 0,
  price: 0,
  textureUrl: '',
  tileCode: '',
};

export const DEFAULT_PAGINATION = {
  page: 1,
  pageSize: 20,
} as const;

export const DEFAULT_TILE_FILTERS: TileFilters = {
  inStockOnly: false,
  hasQRCode: false,
};

// ===== UTILITY TYPES =====

export type TileCategory = Tile['category'];
export type UserRole = UserProfile['role'];
export type RoomType = Room['type'];
export type SubscriptionStatus = TileSeller['subscription_status'];

export type SortableFields = 'name' | 'price' | 'created' | 'popularity';
export type SortOrder = 'asc' | 'desc';

export type TileWithQR = Tile & { qrCode: string };
export type TileCreateInput = Omit<Tile, 'id' | 'createdAt' | 'updatedAt'>;
export type TileUpdateInput = Partial<Omit<Tile, 'id' | 'createdAt'>>;

// ===== FORM VALIDATION SCHEMAS =====

export interface TileValidationSchema {
  name: FieldValidation;
  category: FieldValidation;
  size: FieldValidation;
  price: FieldValidation;
  stock: FieldValidation;
  imageUrl: FieldValidation;
  textureUrl?: FieldValidation;
}

export interface SellerValidationSchema {
  business_name: FieldValidation;
  email: FieldValidation;
  phone: FieldValidation;
  business_address: FieldValidation;
}

// ===== API ENDPOINTS TYPES =====

export interface ApiEndpoints {
  tiles: {
    list: string;
    create: string;
    update: (id: string) => string;
    delete: (id: string) => string;
    bulkUpload: string;
  };
  qrCodes: {
    generate: (tileId: string) => string;
    bulkGenerate: string;
    download: string;
  };
  analytics: {
    dashboard: string;
    tiles: string;
    export: string;
  };
}
export interface AnalyticsTile {
  id: string;
  name: string;
  imageUrl: string;
  category: string;
  size: string;
  price: number;
  viewCount: number;
}
// src/types/index.ts - Add this interface

export interface QRGenerationHistory {
  id: string;
  sellerId: string;
  adminId?: string;
  generatedAt: string;
  generationType: 'bulk' | 'single';
  totalTiles: number;
  successCount: number;
  failedCount: number;
  tileIds: string[];
  failedTiles?: Array<{
    tileId: string;
    error: string;
  }>;
  duration?: number;  // In seconds
  // metadata?: {
  //   browser?: string;
  //   device?: string;
  //   ipAddress?: string;
  // };
}
export interface QRScannedTile extends AnalyticsTile {
  scanCount: number;
}