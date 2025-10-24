// src/utils/qrScanUtils.ts

export interface QRScanData {
    type: 'tile_viewer' | 'manual_entry';
    tileId?: string;
    tileCode?: string;
    name?: string;
    category?: string;
    size?: string;
    price?: number;
    sellerId?: string;
    showroomId?: string;
    url?: string;
    roomSelectUrl?: string;
    timestamp?: string;
  }
  
  /**
   * Validate QR code data
   */
  export const validateQRData = (data: string): QRScanData | null => {
    try {
      const parsed = JSON.parse(data);
      
      // Check if it's a tile viewer QR
      if (parsed.type === 'tile_viewer' && parsed.tileId) {
        return parsed as QRScanData;
      }
      
      return null;
    } catch (error) {
      console.error('Invalid QR data:', error);
      return null;
    }
  };
  
  /**
   * Check if running on mobile device
   */
  export const isMobileDevice = (): boolean => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
  };
  
  /**
   * Check if camera is available
   */
  export const isCameraAvailable = async (): Promise<boolean> => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      return devices.some(device => device.kind === 'videoinput');
    } catch (error) {
      console.error('Camera check failed:', error);
      return false;
    }
  };
  
  /**
   * Request camera permission
   */
  export const requestCameraPermission = async (): Promise<boolean> => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      
      // Stop stream immediately (we just needed permission)
      stream.getTracks().forEach(track => track.stop());
      
      return true;
    } catch (error) {
      console.error('Camera permission denied:', error);
      return false;
    }
  };
  
  /**
   * Generate shareable QR link
   */
  export const generateShareableLink = (tileId: string): string => {
    const baseUrl = window.location.origin;
    return `${baseUrl}/tile/${tileId}`;
  };
  
  /**
   * Track QR scan event
   */
  export const trackQRScan = async (tileId: string, scanMethod: 'camera' | 'upload' | 'manual') => {
    try {
      // Analytics tracking
      if (window.gtag) {
        window.gtag('event', 'qr_scan', {
          tile_id: tileId,
          scan_method: scanMethod,
          timestamp: new Date().toISOString()
        });
      }
      
      console.log('QR Scan tracked:', { tileId, scanMethod });
    } catch (error) {
      console.error('Failed to track QR scan:', error);
    }
  };
  
  // Extend Window interface for gtag
  declare global {
    interface Window {
      gtag?: (...args: any[]) => void;
    }
  }