// src/types/analytics.ts

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
    
    // Analytics fields
    viewCount?: number;
    scanCount?: number;
    applyCount?: number;
    totalScans?: number;
    lastScanned?: string;
    qrCodeGenerated?: boolean;
    qrCodeGeneratedAt?: string;
  }
  
  // ===== ANALYTICS TYPES =====
  
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
  
  export interface AnalyticsOverview {
    sellerId: string;
    businessName: string;
    email: string;
    phone: string;
    accountStatus: 'active' | 'inactive' | 'suspended';
    totalTiles: number;
    totalViews: number;
    totalApplies: number;
    totalQRScans: number;
    lastLogin: string | null;
    createdAt: string;
    
    qrCodeStats?: {
      totalGenerated: number;
      totalActive: number;
      generationRate: number;
      lastGeneration: string | null;
    };
  }
  
  export interface DailyActivity {
    date: string;
    dayName: string;
    views: number;
    applies: number;
    actions: number;
    estimatedHours: string;
  }
  // QR Generation History Type
export interface QRGenerationHistory {
  id: string;
  sellerId: string;
  tileId: string;
  tileName: string;
  tileImage?: string;
  qrCodeUrl: string;
  generatedAt: Date | string | null;
  isActive: boolean;
  generatedBy?: string;
  qrCodeType?: 'standard' | 'dynamic' | 'custom';
}
// src/types/analytics.ts

// ... existing types ...

// ✅ ADD THIS (if not already present)
export interface QRScannedTile {
  id: string;
  name: string;
  imageUrl: string;
  category: 'wall' | 'floor' | 'both';
  size: string;
  price: number;
  code?: string;
  brand?: string;
  color?: string;
  scanCount: number;
  lastScannedAt?: string | null;
  scanLocations?: string[];
  scanDevices?: string[];
}

export interface ScanDetail {
  id: string;
  tileId: string;
  scannedAt: string;
  deviceType: 'mobile' | 'tablet' | 'desktop' | 'unknown';
  location?: {
    city: string;
    country: string;
    flag?: string;
  };
  userAgent?: string;
}
// QR Generation Stats Type
export interface QRGenerationStats {
  totalGenerated: number;
  totalActive: number;
  generationRate: number;
  lastGeneration: Date | string | null;
}

  export interface QRGenerationStats {
    totalGenerated: number;
    totalActive: number;
    generationRate: number;
    lastGeneration: Date | string | null;
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
  
  export interface DateRange {
    start: Date;
    end: Date;
  }
  
  export interface ExportOptions {
    sellerId: string;
    format: 'csv' | 'pdf';
    dateRange: DateRange;
  }