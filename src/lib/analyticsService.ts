

import { 
  collection,
  query,
  where,
  getDocs,
  orderBy,
  limit as firestoreLimit,
  Timestamp,
  doc,
  getDoc
} from 'firebase/firestore';
import { db } from './firebase';
import { 
  AnalyticsOverview,
  AnalyticsTile,
  QRScannedTile,
  DailyActivity,
  QRGenerationHistory,
  QRGenerationStats,
  DeviceScanStats,
  LocationScanStats,
  Tile,
  ExportOptions
} from '../types/analytics';

// ===== ERROR CODES =====
const FIREBASE_INDEX_ERROR = 'failed-precondition';

// ===== ANALYTICS OVERVIEW =====
export const getSellerAnalyticsOverview = async (
  sellerId: string
): Promise<AnalyticsOverview> => {
  try {
    console.log('📊 Fetching analytics overview for seller:', sellerId);

    // Parallel fetch for better performance
    const [tilesSnapshot, analyticsSnapshot, qrScansSnapshot, sellerDoc] = await Promise.all([
      getDocs(query(collection(db, 'tiles'), where('sellerId', '==', sellerId))),
      getDocs(query(collection(db, 'analytics'))),
      getDocs(query(collection(db, 'qr_scans'))),
      getDoc(doc(db, 'sellers', sellerId))
    ]);

    const tiles = tilesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Tile[];
    const tileIds = tiles.map(t => t.id);

    // Filter analytics for this seller
    const sellerAnalytics = analyticsSnapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .filter((a: any) => tileIds.includes(a.tile_id));

    const sellerQRScans = qrScansSnapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .filter((s: any) => tileIds.includes(s.tileId));

    const totalViews = sellerAnalytics.filter((a: any) => a.action_type === 'view').length;
    const totalApplies = sellerAnalytics.filter((a: any) => a.action_type === 'apply').length;

    const sellerData = sellerDoc.exists() ? sellerDoc.data() : {};

    // QR Code Stats
    const tilesWithQR = tiles.filter(t => t.qrCode || t.qrCodeGenerated).length;
    const lastQRGeneration = tiles
      .filter(t => t.qrCodeGeneratedAt)
      .sort((a, b) => new Date(b.qrCodeGeneratedAt!).getTime() - new Date(a.qrCodeGeneratedAt!).getTime())[0]
      ?.qrCodeGeneratedAt || null;

    const overview: AnalyticsOverview = {
      sellerId,
      businessName: sellerData.business_name || 'Unknown',
      email: sellerData.email || '',
      phone: sellerData.phone || '',
      accountStatus: sellerData.account_status || 'active',
      totalTiles: tiles.length,
      totalViews,
      totalApplies,
      totalQRScans: sellerQRScans.length,
      lastLogin: sellerData.last_login || null,
      createdAt: sellerData.created_at || '',
      qrCodeStats: {
        totalGenerated: tilesWithQR,
        totalActive: tilesWithQR,
        generationRate: tiles.length > 0 ? Math.round((tilesWithQR / tiles.length) * 100) : 0,
        lastGeneration: lastQRGeneration
      }
    };

    console.log('✅ Overview fetched successfully');
    return overview;
    
  } catch (error: any) {
    console.error('❌ Error fetching analytics overview:', error);
    throw new Error(`Failed to fetch analytics overview: ${error.message}`);
  }
};

// ===== TOP VIEWED TILES =====
export const getSellerTopViewedTiles = async (
  sellerId: string,
  limitCount: number = 5
): Promise<AnalyticsTile[]> => {
  try {
    console.log('📊 Fetching top viewed tiles for seller:', sellerId);

    const tilesQuery = query(
      collection(db, 'tiles'),
      where('sellerId', '==', sellerId)
    );
    const tilesSnapshot = await getDocs(tilesQuery);
    const tiles = tilesSnapshot.docs.map(doc => ({ 
      id: doc.id, 
      ...doc.data() 
    })) as Tile[];
    
    const tileIds = tiles.map(t => t.id);
    if (tileIds.length === 0) {
      console.log('⚠️ No tiles found for seller');
      return [];
    }

    const analyticsSnapshot = await getDocs(collection(db, 'analytics'));
    
    const viewCounts: Record<string, number> = {};
    analyticsSnapshot.docs.forEach(doc => {
      const data = doc.data();
      if (data.action_type === 'view' && tileIds.includes(data.tile_id)) {
        viewCounts[data.tile_id] = (viewCounts[data.tile_id] || 0) + 1;
      }
    });

    const sortedTiles: AnalyticsTile[] = Object.entries(viewCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, limitCount)
      .map(([tileId, viewCount]) => {
        const tile = tiles.find(t => t.id === tileId);
        return {
          id: tileId,
          name: tile?.name || 'Unknown',
          imageUrl: tile?.imageUrl || '',
          category: tile?.category || 'both',
          size: tile?.size || 'N/A',
          price: tile?.price || 0,
          viewCount
        };
      });

    console.log('✅ Top viewed tiles:', sortedTiles.length);
    return sortedTiles;
    
  } catch (error: any) {
    console.error('❌ Error fetching top viewed tiles:', error);
    return []; // Return empty array instead of throwing
  }
};

// ===== TOP QR SCANNED TILES =====
export const getSellerTopQRScannedTiles = async (
  sellerId: string,
  limitCount: number = 5
): Promise<QRScannedTile[]> => {
  try {
    console.log('📱 Fetching top QR scanned tiles for seller:', sellerId);

    const tilesQuery = query(
      collection(db, 'tiles'),
      where('sellerId', '==', sellerId)
    );
    const tilesSnapshot = await getDocs(tilesQuery);
    const tiles = tilesSnapshot.docs.map(doc => ({ 
      id: doc.id, 
      ...doc.data() 
    })) as Tile[];
    
    const tileIds = tiles.map(t => t.id);
    if (tileIds.length === 0) {
      console.log('⚠️ No tiles found for seller');
      return [];
    }

    const qrScansSnapshot = await getDocs(collection(db, 'qr_scans'));
    
    const scanCounts: Record<string, number> = {};
    qrScansSnapshot.docs.forEach(doc => {
      const data = doc.data();
      if (tileIds.includes(data.tileId)) {
        scanCounts[data.tileId] = (scanCounts[data.tileId] || 0) + 1;
      }
    });

    const sortedTiles: QRScannedTile[] = Object.entries(scanCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, limitCount)
      .map(([tileId, scanCount]) => {
        const tile = tiles.find(t => t.id === tileId);
        return {
          id: tileId,
          name: tile?.name || 'Unknown',
          imageUrl: tile?.imageUrl || '',
          category: tile?.category || 'both',
          size: tile?.size || 'N/A',
          price: tile?.price || 0,
          scanCount
        };
      });

    console.log('✅ Top QR scanned tiles:', sortedTiles.length);
    return sortedTiles;
    
  } catch (error: any) {
    console.error('❌ Error fetching top QR scanned tiles:', error);
    return []; // Return empty array instead of throwing
  }
};

// ===== DAILY ACTIVITY =====
export const getSellerDailyActivity = async (
  sellerId: string,
  days: number = 7
): Promise<DailyActivity[]> => {
  try {
    console.log('⏰ Fetching daily activity for seller:', sellerId, 'days:', days);

    const tilesQuery = query(
      collection(db, 'tiles'),
      where('sellerId', '==', sellerId)
    );
    const tilesSnapshot = await getDocs(tilesQuery);
    const tileIds = tilesSnapshot.docs.map(doc => doc.id);

    if (tileIds.length === 0) {
      console.log('⚠️ No tiles found for seller');
      return [];
    }

    const analyticsSnapshot = await getDocs(collection(db, 'analytics'));
    
    const activityByDate: Record<string, { views: number; applies: number; actions: number }> = {};
    
    analyticsSnapshot.docs.forEach(doc => {
      const data = doc.data();
      if (tileIds.includes(data.tile_id) && data.timestamp) {
        const date = new Date(data.timestamp).toISOString().split('T')[0];
        
        if (!activityByDate[date]) {
          activityByDate[date] = { views: 0, applies: 0, actions: 0 };
        }
        
        if (data.action_type === 'view') {
          activityByDate[date].views++;
        } else if (data.action_type === 'apply') {
          activityByDate[date].applies++;
        }
        activityByDate[date].actions++;
      }
    });

    const result: DailyActivity[] = [];
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const dayData = activityByDate[dateStr] || { views: 0, applies: 0, actions: 0 };
      
      result.push({
        date: dateStr,
        dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
        views: dayData.views,
        applies: dayData.applies,
        actions: dayData.actions,
        estimatedHours: (dayData.actions / 10).toFixed(1)
      });
    }

    console.log('✅ Daily activity calculated for', result.length, 'days');
    return result;
    
  } catch (error: any) {
    console.error('❌ Error fetching daily activity:', error);
    return []; // Return empty array instead of throwing
  }
};

// ===== QR GENERATION HISTORY (PRODUCTION READY) =====
// export const getSellerQRGenerationHistory = async (
//   sellerId: string,
//   maxResults: number = 10
// ): Promise<QRGenerationHistory[]> => {
//   try {
//     console.log('🔍 Fetching QR generation history for:', sellerId);
    
//     const q = query(
//       collection(db, 'qrGenerations'),
//       where('sellerId', '==', sellerId),
//       orderBy('generatedAt', 'desc'),
//       firestoreLimit(maxResults)
//     );
    
//     const snapshot = await getDocs(q);
    
//     console.log('✅ Found', snapshot.size, 'QR generation records');
    
//     if (snapshot.empty) {
//       console.log('ℹ️ No QR generation history found');
//       return [];
//     }
    
//     return snapshot.docs.map(doc => {
//       const data = doc.data();
//       return {
//         id: doc.id,
//         sellerId: data.sellerId,
//         tileId: data.tileId,
//         tileName: data.tileName || 'Unknown',
//         qrCodeUrl: data.qrCodeUrl || '',
//         generatedAt: data.generatedAt,
//         isActive: data.isActive !== false, // Default true
//         ...data
//       };
//     }) as QRGenerationHistory[];
    
//   } catch (error: any) {
//     // Handle Firebase index error gracefully
//     if (error?.code === FIREBASE_INDEX_ERROR) {
//       console.warn('⚠️ QR Generation History: Index is building. Please wait 2-5 minutes.');
//       console.warn('📌 Create index here:', error.message?.match(/https:\/\/[^\s]+/)?.[0]);
//       return []; // Return empty array, don't break the app
//     }
    
//     console.error('❌ Error fetching QR generation history:', error);
//     return []; // Return empty array instead of throwing
//   }
// };


// ===== QR GENERATION HISTORY (COMPLETE - NO RED LINE) =====
export const getSellerQRGenerationHistory = async (
  sellerId: string,
  maxResults: number = 10
): Promise<QRGenerationHistory[]> => {
  try {
    console.log('🔍 Fetching QR generation history for:', sellerId);
    
    const q = query(
      collection(db, 'qrGenerations'),
      where('sellerId', '==', sellerId),
      orderBy('generatedAt', 'desc'),
      firestoreLimit(maxResults)
    );
    
    const snapshot = await getDocs(q);
    
    console.log('✅ Found', snapshot.size, 'QR generation records');
    
    if (snapshot.empty) {
      console.log('ℹ️ No QR generation history found');
      return [];
    }
    
    const history: QRGenerationHistory[] = snapshot.docs.map(doc => {
      const data = doc.data();
      
      // Timestamp to Date conversion
      let generatedAtDate: Date | string | null = null;
      if (data.generatedAt) {
        try {
          if (data.generatedAt instanceof Timestamp) {
            generatedAtDate = data.generatedAt.toDate();
          } else if (data.generatedAt.toDate && typeof data.generatedAt.toDate === 'function') {
            generatedAtDate = data.generatedAt.toDate();
          } else if (typeof data.generatedAt === 'string') {
            generatedAtDate = data.generatedAt;
          }
        } catch (e) {
          console.warn('Could not convert generatedAt timestamp', e);
        }
      }
      
      return {
        id: doc.id,
        sellerId: String(data.sellerId || sellerId),
        tileId: String(data.tileId || ''),
        tileName: String(data.tileName || 'Unknown'),
        tileImage: data.tileImage ? String(data.tileImage) : '',
        qrCodeUrl: String(data.qrCodeUrl || ''),
        generatedAt: generatedAtDate,
        isActive: data.isActive !== undefined ? Boolean(data.isActive) : true,
        generatedBy: data.generatedBy ? String(data.generatedBy) : sellerId,
        qrCodeType: data.qrCodeType || 'standard'
      };
    });
    
    return history;
    
  } catch (error: any) {
    if (error?.code === 'failed-precondition') {
      console.warn('⚠️ QR Generation History: Index is building. Please wait 2-5 minutes.');
      const indexUrl = error.message?.match(/https:\/\/[^\s]+/)?.[0];
      if (indexUrl) {
        console.warn('📌 Create index here:', indexUrl);
      }
      return [];
    }
    
    console.error('❌ Error fetching QR generation history:', error);
    return [];
  }
};

// ===== QR GENERATION STATS (COMPLETE - NO RED LINE) =====
export const getSellerQRGenerationStats = async (
  sellerId: string
): Promise<QRGenerationStats> => {
  try {
    console.log('📊 Fetching QR stats for:', sellerId);
    
    const tilesSnapshot = await getDocs(
      query(collection(db, 'tiles'), where('sellerId', '==', sellerId))
    );
    
    const tiles = tilesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    const totalTiles = tiles.length;
    
    const tilesWithQR = tiles.filter(
      (tile: any) => tile.qrCode || tile.qrCodeGenerated
    ).length;
    
    let lastGeneration: Date | string | null = null;
    
    try {
      const generationsQuery = query(
        collection(db, 'qrGenerations'),
        where('sellerId', '==', sellerId),
        orderBy('generatedAt', 'desc'),
        firestoreLimit(1)
      );
      
      const generationsSnapshot = await getDocs(generationsQuery);
      
      if (!generationsSnapshot.empty) {
        const data = generationsSnapshot.docs[0].data();
        
        // Timestamp conversion
        if (data.generatedAt) {
          try {
            if (data.generatedAt instanceof Timestamp) {
              lastGeneration = data.generatedAt.toDate();
            } else if (data.generatedAt.toDate && typeof data.generatedAt.toDate === 'function') {
              lastGeneration = data.generatedAt.toDate();
            } else if (typeof data.generatedAt === 'string') {
              lastGeneration = data.generatedAt;
            }
          } catch (e) {
            console.warn('Could not convert lastGeneration timestamp', e);
          }
        }
        
        console.log('✅ Last generation found from qrGenerations');
      }
      
    } catch (indexError: any) {
      if (indexError?.code === 'failed-precondition') {
        console.warn('⚠️ QR Stats: Using fallback method (index building)');
        
        const tilesWithDates = tiles
          .filter((tile: any) => tile.qrCodeGeneratedAt)
          .map((tile: any) => {
            const dateValue = tile.qrCodeGeneratedAt;
            if (dateValue instanceof Timestamp) {
              return dateValue.toDate();
            } else if (typeof dateValue === 'string') {
              return new Date(dateValue);
            }
            return null;
          })
          .filter((date): date is Date => date !== null)
          .sort((a, b) => b.getTime() - a.getTime());
        
        if (tilesWithDates.length > 0) {
          lastGeneration = tilesWithDates[0];
          console.log('✅ Last generation found from tiles data (fallback)');
        }
      } else {
        console.error('❌ Error fetching last generation:', indexError);
      }
    }
    
    const stats: QRGenerationStats = {
      totalGenerated: Number(tilesWithQR),
      totalActive: Number(tilesWithQR),
      generationRate: totalTiles > 0 ? Math.round((tilesWithQR / totalTiles) * 100) : 0,
      lastGeneration
    };
    
    console.log('✅ QR Stats calculated:', stats);
    return stats;
    
  } catch (error: any) {
    console.error('❌ Error fetching QR stats:', error);
    
    return {
      totalGenerated: 0,
      totalActive: 0,
      generationRate: 0,
      lastGeneration: null
    };
  }
};
// ===== QR GENERATION STATS (PRODUCTION READY) =====


// ===== SCANS BY DEVICE =====
export const getSellerScansByDevice = async (
  sellerId: string
): Promise<DeviceScanStats[]> => {
  try {
    console.log('📱 Fetching scans by device for:', sellerId);
    
    const scansSnapshot = await getDocs(
      query(collection(db, 'qr_scans'), where('sellerId', '==', sellerId))
    );
    
    const deviceCounts: Record<string, number> = {};
    
    scansSnapshot.docs.forEach(doc => {
      const deviceType = doc.data().deviceInfo?.type || 'unknown';
      deviceCounts[deviceType] = (deviceCounts[deviceType] || 0) + 1;
    });
    
    const result = Object.entries(deviceCounts).map(([type, count]) => ({
      type: type as DeviceScanStats['type'],
      count
    }));
    
    console.log('✅ Scans by device:', result.length, 'device types');
    return result;
    
  } catch (error: any) {
    console.error('❌ Error fetching scans by device:', error);
    return [];
  }
};

// ===== SCANS BY LOCATION =====
export const getSellerScansByLocation = async (
  sellerId: string
): Promise<LocationScanStats[]> => {
  try {
    console.log('🌍 Fetching scans by location for:', sellerId);
    
    const scansSnapshot = await getDocs(
      query(collection(db, 'qr_scans'), where('sellerId', '==', sellerId))
    );
    
    const locationCounts: Record<string, LocationScanStats> = {};
    
    scansSnapshot.docs.forEach(doc => {
      const location = doc.data().scanLocation;
      if (location?.city && location?.country) {
        const key = `${location.city}, ${location.country}`;
        if (!locationCounts[key]) {
          locationCounts[key] = {
            city: location.city,
            country: location.country,
            count: 0,
            flag: location.flag || '🌍'
          };
        }
        locationCounts[key].count++;
      }
    });
    
    const result = Object.values(locationCounts).sort((a, b) => b.count - a.count);
    
    console.log('✅ Scans by location:', result.length, 'locations');
    return result;
    
  } catch (error: any) {
    console.error('❌ Error fetching scans by location:', error);
    return [];
  }
};

// ===== EXPORT ANALYTICS =====
export const exportSellerAnalytics = async (
  options: ExportOptions
): Promise<void> => {
  try {
    console.log('📥 Exporting analytics:', options);
    
    const [overview, topViewed, topScanned, activity] = await Promise.all([
      getSellerAnalyticsOverview(options.sellerId),
      getSellerTopViewedTiles(options.sellerId, 10),
      getSellerTopQRScannedTiles(options.sellerId, 10),
      getSellerDailyActivity(options.sellerId, 30)
    ]);
    
    if (options.format === 'csv') {
      let csv = 'Seller Analytics Report\n\n';
      csv += `Business Name,${overview.businessName}\n`;
      csv += `Email,${overview.email}\n`;
      csv += `Phone,${overview.phone}\n`;
      csv += `Account Status,${overview.accountStatus}\n`;
      csv += `Total Tiles,${overview.totalTiles}\n`;
      csv += `Total Views,${overview.totalViews}\n`;
      csv += `Total Applications,${overview.totalApplies}\n`;
      csv += `Total QR Scans,${overview.totalQRScans}\n\n`;
      
      csv += 'Top Viewed Tiles\n';
      csv += 'Rank,Name,Category,Size,Price,Views\n';
      topViewed.forEach((tile, index) => {
        csv += `${index + 1},"${tile.name}",${tile.category},${tile.size},${tile.price},${tile.viewCount}\n`;
      });
      
      csv += '\nTop Scanned Tiles\n';
      csv += 'Rank,Name,Category,Size,Price,Scans\n';
      topScanned.forEach((tile, index) => {
        csv += `${index + 1},"${tile.name}",${tile.category},${tile.size},${tile.price},${tile.scanCount}\n`;
      });
      
      csv += '\nDaily Activity\n';
      csv += 'Date,Day,Views,Applications,Total Actions,Estimated Hours\n';
      activity.forEach(day => {
        csv += `${day.date},${day.dayName},${day.views},${day.applies},${day.actions},${day.estimatedHours}\n`;
      });
      
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `seller_analytics_${options.sellerId}_${Date.now()}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      console.log('✅ CSV export completed');
    } else {
      throw new Error('PDF export not implemented yet');
    }
    
  } catch (error: any) {
    console.error('❌ Export failed:', error);
    throw new Error(`Export failed: ${error.message}`);
  }
};