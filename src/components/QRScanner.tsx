
import React, { useState, useRef, useEffect } from 'react';
import { Camera, X, Upload, Hash, AlertCircle, CheckCircle, RotateCcw } from 'lucide-react';
import jsQR from 'jsqr';

interface QRScannerProps {
  onScanSuccess: (data: any) => void;
  onClose: () => void;
}

export const QRScanner: React.FC<QRScannerProps> = ({ onScanSuccess, onClose }) => {
  const [scanMode, setScanMode] = useState<'camera' | 'upload' | 'manual'>('camera');
  const [error, setError] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const [manualCode, setManualCode] = useState('');
  const [lastScannedCode, setLastScannedCode] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [cameraFacing, setCameraFacing] = useState<'environment' | 'user'>('environment');
  const [isLoading, setIsLoading] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number>();
  const lastScanTimeRef = useRef<number>(0);

  // Start camera
  const startCamera = async () => {
    try {
      setError(null);
      setIsLoading(true);

      // Stop existing stream first
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: cameraFacing,
          width: { ideal: 1920, max: 1920 },
          height: { ideal: 1080, max: 1080 }
        }
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setScanning(true);
        setIsLoading(false);
        scanQRCode();
      }
    } catch (err: any) {
      console.error('Camera error:', err);
      setIsLoading(false);
      
      if (err.name === 'NotAllowedError') {
        setError('Camera access denied. Please enable camera permissions in your browser settings.');
      } else if (err.name === 'NotFoundError') {
        setError('No camera found on this device. Please use upload or manual mode.');
      } else if (err.name === 'NotReadableError') {
        setError('Camera is being used by another app. Please close other apps and try again.');
      } else {
        setError('Camera access failed. Please try upload or manual entry mode.');
      }
      setScanning(false);
    }
  };

  // Stop camera
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    setScanning(false);
  };

  // Switch camera (front/back)
  const switchCamera = () => {
    setCameraFacing(prev => prev === 'environment' ? 'user' : 'environment');
  };

  // Scan QR code from video
  const scanQRCode = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });

    if (!ctx || video.readyState !== video.HAVE_ENOUGH_DATA) {
      animationFrameRef.current = requestAnimationFrame(scanQRCode);
      return;
    }

    // Set canvas size to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    // Draw video frame to canvas
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    
    const code = jsQR(imageData.data, imageData.width, imageData.height, {
      inversionAttempts: 'dontInvert'
    });

    if (code && code.data) {
      handleQRDetected(code.data);
    } else {
      animationFrameRef.current = requestAnimationFrame(scanQRCode);
    }
  };

  const handleQRDetected = async (qrData: string) => {
    try {
      console.log('🔍 QR Data received:', qrData);
      
      // Parse QR data
      let parsed;
      try {
        parsed = JSON.parse(qrData);
      } catch (parseError) {
        console.error('❌ JSON parse failed:', parseError);
        setError('Could not parse QR code. Please try again.');
        setSuccessMessage(null);
        
        setTimeout(() => setError(null), 2000);
        animationFrameRef.current = requestAnimationFrame(scanQRCode);
        return;
      }
      
      // Validate QR structure
      if (parsed.type === 'tile_viewer' && parsed.tileId) {
        console.log('✅ Valid tile QR:', parsed.tileId);
        
        // ═══════════════════════════════════════════════════════════
        // ✅ CRITICAL CHANGE: NO COOLDOWN - Track EVERY scan!
        // ═══════════════════════════════════════════════════════════
        
        // Update tracking vars for logging (but don't block!)
        const now = Date.now();
        const timeSinceLastScan = lastScannedCode === qrData 
          ? (now - lastScanTimeRef.current) / 1000 
          : 0;
        
        console.log(`📊 Scan info: Same as last? ${qrData === lastScannedCode}, Time since: ${timeSinceLastScan}s`);
        
        lastScanTimeRef.current = now;
        setLastScannedCode(qrData);
        
        // Show success feedback with haptic if available
        if (navigator.vibrate) {
          navigator.vibrate(200);
        }
        
        setSuccessMessage(`✅ Scanned: ${parsed.tileId.substring(0, 8)}...`);
        setError(null);
        
        // ✅ ALWAYS call parent handler - NO blocking!
        onScanSuccess(parsed);
        
        console.log('✅ Scan sent to parent component');
        
        // Clear success message after 1.5s
        setTimeout(() => {
          setSuccessMessage(null);
        }, 1500);
        
        // ✅ Continue scanning immediately
        animationFrameRef.current = requestAnimationFrame(scanQRCode);
        
      } else {
        console.warn('⚠️ Invalid QR structure:', parsed);
        setError('Invalid QR code. Please scan a valid tile QR code.');
        setSuccessMessage(null);
        
        setTimeout(() => setError(null), 2000);
        animationFrameRef.current = requestAnimationFrame(scanQRCode);
      }
    } catch (err) {
      console.error('❌ QR detection error:', err);
      setError('Error processing QR code. Please try again.');
      setSuccessMessage(null);
      
      setTimeout(() => setError(null), 2000);
      animationFrameRef.current = requestAnimationFrame(scanQRCode);
    }
  };

  // Handle image upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setError(null);
      setSuccessMessage(null);
      setIsLoading(true);
      
      const img = new Image();
      const reader = new FileReader();

      reader.onload = (event) => {
        img.onload = () => {
          const canvas = canvasRef.current;
          if (!canvas) {
            setIsLoading(false);
            return;
          }

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            setIsLoading(false);
            return;
          }

          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);

          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          
          const code = jsQR(imageData.data, imageData.width, imageData.height, {
            inversionAttempts: 'dontInvert'
          });

          setIsLoading(false);

          if (code && code.data) {
            try {
              const parsed = JSON.parse(code.data);
              
              if (parsed.type === 'tile_viewer' && parsed.tileId) {
                setSuccessMessage('QR Code found in image!');
                if (navigator.vibrate) {
                  navigator.vibrate(200);
                }
                onScanSuccess(parsed);
              } else {
                setError('Invalid QR code in image.');
              }
            } catch (parseErr) {
              setError('Could not parse QR code from image.');
            }
          } else {
            setError('No QR code found in image. Please try another image.');
          }
        };
        
        img.onerror = () => {
          setIsLoading(false);
          setError('Failed to load image. Please try another file.');
        };
        
        img.src = event.target?.result as string;
      };

      reader.onerror = () => {
        setIsLoading(false);
        setError('Failed to read file. Please try again.');
      };

      reader.readAsDataURL(file);
    } catch (err) {
      setIsLoading(false);
      setError('Failed to process image. Please try again.');
    }
  };

  // Handle manual code entry
  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!manualCode.trim()) {
      setError('Please enter a tile code');
      return;
    }

    setError(null);
    setSuccessMessage('Searching for tile...');

    onScanSuccess({ 
      type: 'manual_entry',
      tileCode: manualCode.trim().toUpperCase()
    });
  };

  // ✅ Start camera when mode changes to camera
  useEffect(() => {
    if (scanMode === 'camera') {
      startCamera();
    } else {
      stopCamera();
    }

    return () => {
      stopCamera();
    };
  }, [scanMode, cameraFacing]);

  // ✅ Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-0 sm:p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-none sm:rounded-xl shadow-2xl w-full h-full sm:h-auto sm:max-w-lg sm:max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 sm:p-5 flex items-center justify-between flex-shrink-0 safe-top">
          <h3 className="text-white text-lg sm:text-xl font-bold">Scan QR Code</h3>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 rounded-full p-2 transition-colors touch-manipulation"
            aria-label="Close scanner"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        {/* Mode Selector */}
        <div className="flex border-b flex-shrink-0">
          <button
            onClick={() => setScanMode('camera')}
            className={`flex-1 py-3 px-2 sm:px-4 flex items-center justify-center gap-1 sm:gap-2 font-medium transition-colors text-sm sm:text-base touch-manipulation ${
              scanMode === 'camera'
                ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
            aria-label="Camera mode"
          >
            <Camera className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="hidden xs:inline">Camera</span>
          </button>
          <button
            onClick={() => setScanMode('upload')}
            className={`flex-1 py-3 px-2 sm:px-4 flex items-center justify-center gap-1 sm:gap-2 font-medium transition-colors text-sm sm:text-base touch-manipulation ${
              scanMode === 'upload'
                ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
            aria-label="Upload mode"
          >
            <Upload className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="hidden xs:inline">Upload</span>
          </button>
          <button
            onClick={() => setScanMode('manual')}
            className={`flex-1 py-3 px-2 sm:px-4 flex items-center justify-center gap-1 sm:gap-2 font-medium transition-colors text-sm sm:text-base touch-manipulation ${
              scanMode === 'manual'
                ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
            aria-label="Manual entry mode"
          >
            <Hash className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="hidden xs:inline">Manual</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1">
          {/* Success Message */}
          {successMessage && (
            <div className="mb-4 p-3 sm:p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-2 sm:gap-3 animate-pulse">
              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-green-800 font-medium text-sm sm:text-base">Success</p>
                <p className="text-green-700 text-xs sm:text-sm break-words">{successMessage}</p>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2 sm:gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-red-800 font-medium text-sm sm:text-base">Error</p>
                <p className="text-red-700 text-xs sm:text-sm break-words">{error}</p>
              </div>
            </div>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="mb-4 p-3 sm:p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-center gap-3">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
              <p className="text-blue-800 font-medium text-sm sm:text-base">Loading...</p>
            </div>
          )}

          {/* Camera Mode */}
          {scanMode === 'camera' && (
            <div className="space-y-3 sm:space-y-4">
              <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
                <video
                  ref={videoRef}
                  className="w-full h-full object-cover"
                  playsInline
                  muted
                  autoPlay
                />
                {scanning && (
                  <div className="absolute inset-0 border-4 border-blue-500 animate-pulse pointer-events-none">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-black/70 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-lg">
                        <p className="text-xs sm:text-sm font-medium">
                          {successMessage ? '✅ Detected! Ready for next...' : '📷 Scanning...'}
                        </p>
                      </div>
                    </div>
                    
                    {/* Scanning frame corners */}
                    <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 border-2 border-white opacity-50">
                      <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-blue-400"></div>
                      <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-blue-400"></div>
                      <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-blue-400"></div>
                      <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-blue-400"></div>
                    </div>
                  </div>
                )}
                
                {/* Camera switch button */}
                <button
                  onClick={switchCamera}
                  className="absolute bottom-3 right-3 bg-black/50 hover:bg-black/70 text-white p-2 sm:p-3 rounded-full transition-colors touch-manipulation"
                  aria-label="Switch camera"
                >
                  <RotateCcw className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
              </div>
              <canvas ref={canvasRef} className="hidden" />
              
              <div className="bg-blue-50 p-3 sm:p-4 rounded-lg">
                <p className="text-blue-900 text-xs sm:text-sm font-medium mb-2">📱 How to scan:</p>
                <ul className="text-blue-800 text-xs sm:text-sm space-y-1">
                  <li>• Hold phone 6-8 inches from QR code</li>
                  <li>• Ensure good lighting</li>
                  <li>• Keep camera steady</li>
                  <li>• Scanner will detect automatically</li>
                  <li>• <strong>✅ Keep scanning - camera stays active!</strong></li>
                </ul>
              </div>
            </div>
          )}

          {/* Upload Mode */}
          {scanMode === 'upload' && (
            <div className="space-y-3 sm:space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 sm:p-8 text-center hover:border-blue-500 transition-colors active:border-blue-600 touch-manipulation">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="qr-upload"
                  capture="environment"
                />
                <label
                  htmlFor="qr-upload"
                  className="cursor-pointer flex flex-col items-center gap-2 sm:gap-3"
                >
                  <Upload className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400" />
                  <div>
                    <p className="text-gray-700 font-medium text-sm sm:text-base">Upload QR Code Image</p>
                    <p className="text-gray-500 text-xs sm:text-sm mt-1">Click to select or take photo</p>
                  </div>
                </label>
              </div>
              <canvas ref={canvasRef} className="hidden" />
              
              <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                <p className="text-gray-700 text-xs sm:text-sm">
                  💡 <strong>Tip:</strong> Take a clear photo of the QR code on the tile and upload it here.
                </p>
              </div>
            </div>
          )}

          {/* Manual Mode */}
          {scanMode === 'manual' && (
            <form onSubmit={handleManualSubmit} className="space-y-3 sm:space-y-4">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                  Enter Tile Code
                </label>
                <input
                  type="text"
                  value={manualCode}
                  onChange={(e) => setManualCode(e.target.value.toUpperCase())}
                  placeholder="e.g., MAR60X60WH"
                  className="w-full px-3 py-3 sm:px-4 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-base sm:text-lg touch-manipulation"
                  autoFocus
                  autoComplete="off"
                  autoCapitalize="characters"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 sm:py-3 rounded-lg font-semibold hover:bg-blue-700 active:bg-blue-800 transition-colors text-sm sm:text-base touch-manipulation disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!manualCode.trim()}
              >
                Search Tile
              </button>

              <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                <p className="text-gray-700 text-xs sm:text-sm mb-2">
                  📋 <strong>Where to find tile code?</strong>
                </p>
                <ul className="text-gray-600 text-xs sm:text-sm space-y-1">
                  <li>• Check the label on the tile box</li>
                  <li>• Look for code near the QR sticker</li>
                  <li>• Ask showroom staff for the code</li>
                </ul>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};