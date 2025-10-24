
// // src/components/QRScanner.tsx
// import React, { useState, useRef, useEffect } from 'react';
// import { Camera, X, Upload, Hash, AlertCircle } from 'lucide-react';
// import jsQR from 'jsqr'; // ✅ Direct import - types are included

// interface QRScannerProps {
//   onScanSuccess: (data: any) => void;
//   onClose: () => void;
// }

// export const QRScanner: React.FC<QRScannerProps> = ({ onScanSuccess, onClose }) => {
//   const [scanMode, setScanMode] = useState<'camera' | 'upload' | 'manual'>('camera');
//   const [error, setError] = useState<string | null>(null);
//   const [scanning, setScanning] = useState(false);
//   const [manualCode, setManualCode] = useState('');
//   const videoRef = useRef<HTMLVideoElement>(null);
//   const canvasRef = useRef<HTMLCanvasElement>(null);
//   const streamRef = useRef<MediaStream | null>(null);
//   const animationFrameRef = useRef<number>();

//   // Start camera
//   const startCamera = async () => {
//     try {
//       setError(null);
//       setScanning(true);

//       const stream = await navigator.mediaDevices.getUserMedia({
//         video: { 
//           facingMode: 'environment',
//           width: { ideal: 1280 },
//           height: { ideal: 720 }
//         }
//       });

//       streamRef.current = stream;

//       if (videoRef.current) {
//         videoRef.current.srcObject = stream;
//         videoRef.current.play();
//         scanQRCode();
//       }
//     } catch (err: any) {
//       console.error('Camera error:', err);
//       setError('Camera access denied. Please enable camera permissions or try manual entry.');
//       setScanning(false);
//     }
//   };

//   // Stop camera
//   const stopCamera = () => {
//     if (streamRef.current) {
//       streamRef.current.getTracks().forEach(track => track.stop());
//       streamRef.current = null;
//     }
//     if (animationFrameRef.current) {
//       cancelAnimationFrame(animationFrameRef.current);
//     }
//     setScanning(false);
//   };

//   // Scan QR code from video
//   const scanQRCode = () => {
//     if (!videoRef.current || !canvasRef.current) return;

//     const video = videoRef.current;
//     const canvas = canvasRef.current;
//     const ctx = canvas.getContext('2d');

//     if (!ctx || video.readyState !== video.HAVE_ENOUGH_DATA) {
//       animationFrameRef.current = requestAnimationFrame(scanQRCode);
//       return;
//     }

//     canvas.width = video.videoWidth;
//     canvas.height = video.videoHeight;
//     ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

//     const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    
//     // ✅ jsQR function with proper types
//     const code = jsQR(imageData.data, imageData.width, imageData.height, {
//       inversionAttempts: 'dontInvert'
//     });

//     if (code && code.data) {
//       handleQRDetected(code.data);
//     } else {
//       animationFrameRef.current = requestAnimationFrame(scanQRCode);
//     }
//   };

//   // Handle detected QR code
//   const handleQRDetected = async (qrData: string) => {
//     try {
//       stopCamera();
      
//       // Parse QR data
//       const parsed = JSON.parse(qrData);
      
//       if (parsed.type === 'tile_viewer' && parsed.tileId) {
//         onScanSuccess(parsed);
//       } else {
//         setError('Invalid QR code. Please scan a valid tile QR code.');
//         setTimeout(() => startCamera(), 2000);
//       }
//     } catch (err) {
//       setError('Could not read QR code. Please try again.');
//       setTimeout(() => startCamera(), 2000);
//     }
//   };

//   // Handle image upload
//   const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     try {
//       setError(null);
//       const img = new Image();
//       const reader = new FileReader();

//       reader.onload = (event) => {
//         img.onload = () => {
//           const canvas = canvasRef.current;
//           if (!canvas) return;

//           const ctx = canvas.getContext('2d');
//           if (!ctx) return;

//           canvas.width = img.width;
//           canvas.height = img.height;
//           ctx.drawImage(img, 0, 0);

//           const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          
//           // ✅ jsQR function
//           const code = jsQR(imageData.data, imageData.width, imageData.height, {
//             inversionAttempts: 'dontInvert'
//           });

//           if (code && code.data) {
//             handleQRDetected(code.data);
//           } else {
//             setError('No QR code found in image. Please try another image.');
//           }
//         };
//         img.src = event.target?.result as string;
//       };

//       reader.readAsDataURL(file);
//     } catch (err) {
//       setError('Failed to process image. Please try again.');
//     }
//   };

//   // Handle manual code entry
//   const handleManualSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
    
//     if (!manualCode.trim()) {
//       setError('Please enter a tile code');
//       return;
//     }

//     onScanSuccess({ 
//       type: 'manual_entry',
//       tileCode: manualCode.trim().toUpperCase()
//     });
//   };

//   // Cleanup on unmount
//   useEffect(() => {
//     if (scanMode === 'camera') {
//       startCamera();
//     }

//     return () => {
//       stopCamera();
//     };
//   }, [scanMode]);

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
//       <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden">
//         {/* Header */}
//         <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 flex items-center justify-between">
//           <h3 className="text-white text-xl font-bold">Scan QR Code</h3>
//           <button
//             onClick={onClose}
//             className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
//           >
//             <X className="w-6 h-6" />
//           </button>
//         </div>

//         {/* Mode Selector */}
//         <div className="flex border-b">
//           <button
//             onClick={() => setScanMode('camera')}
//             className={`flex-1 py-3 px-4 flex items-center justify-center gap-2 font-medium transition-colors ${
//               scanMode === 'camera'
//                 ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
//                 : 'text-gray-600 hover:bg-gray-50'
//             }`}
//           >
//             <Camera className="w-5 h-5" />
//             Camera
//           </button>
//           <button
//             onClick={() => setScanMode('upload')}
//             className={`flex-1 py-3 px-4 flex items-center justify-center gap-2 font-medium transition-colors ${
//               scanMode === 'upload'
//                 ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
//                 : 'text-gray-600 hover:bg-gray-50'
//             }`}
//           >
//             <Upload className="w-5 h-5" />
//             Upload
//           </button>
//           <button
//             onClick={() => setScanMode('manual')}
//             className={`flex-1 py-3 px-4 flex items-center justify-center gap-2 font-medium transition-colors ${
//               scanMode === 'manual'
//                 ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
//                 : 'text-gray-600 hover:bg-gray-50'
//             }`}
//           >
//             <Hash className="w-5 h-5" />
//             Manual
//           </button>
//         </div>

//         {/* Content */}
//         <div className="p-6">
//           {/* Error Message */}
//           {error && (
//             <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
//               <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
//               <div>
//                 <p className="text-red-800 font-medium">Error</p>
//                 <p className="text-red-700 text-sm">{error}</p>
//               </div>
//             </div>
//           )}

//           {/* Camera Mode */}
//           {scanMode === 'camera' && (
//             <div className="space-y-4">
//               <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
//                 <video
//                   ref={videoRef}
//                   className="w-full h-full object-cover"
//                   playsInline
//                   muted
//                 />
//                 {scanning && (
//                   <div className="absolute inset-0 border-4 border-blue-500 animate-pulse">
//                     <div className="absolute inset-0 flex items-center justify-center">
//                       <div className="bg-black/50 text-white px-4 py-2 rounded-lg">
//                         <p className="text-sm font-medium">Scanning...</p>
//                       </div>
//                     </div>
//                   </div>
//                 )}
//               </div>
//               <canvas ref={canvasRef} className="hidden" />
              
//               <div className="bg-blue-50 p-4 rounded-lg">
//                 <p className="text-blue-900 text-sm font-medium mb-2">📱 How to scan:</p>
//                 <ul className="text-blue-800 text-sm space-y-1">
//                   <li>• Hold phone 6-8 inches from QR code</li>
//                   <li>• Ensure good lighting</li>
//                   <li>• Keep camera steady</li>
//                   <li>• QR code will be detected automatically</li>
//                 </ul>
//               </div>
//             </div>
//           )}

//           {/* Upload Mode */}
//           {scanMode === 'upload' && (
//             <div className="space-y-4">
//               <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors">
//                 <input
//                   type="file"
//                   accept="image/*"
//                   onChange={handleImageUpload}
//                   className="hidden"
//                   id="qr-upload"
//                 />
//                 <label
//                   htmlFor="qr-upload"
//                   className="cursor-pointer flex flex-col items-center gap-3"
//                 >
//                   <Upload className="w-12 h-12 text-gray-400" />
//                   <div>
//                     <p className="text-gray-700 font-medium">Upload QR Code Image</p>
//                     <p className="text-gray-500 text-sm mt-1">Click to select image</p>
//                   </div>
//                 </label>
//               </div>
//               <canvas ref={canvasRef} className="hidden" />
              
//               <div className="bg-gray-50 p-4 rounded-lg">
//                 <p className="text-gray-700 text-sm">
//                   💡 <strong>Tip:</strong> Take a clear photo of the QR code on the tile and upload it here.
//                 </p>
//               </div>
//             </div>
//           )}

//           {/* Manual Mode */}
//           {scanMode === 'manual' && (
//             <form onSubmit={handleManualSubmit} className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Enter Tile Code
//                 </label>
//                 <input
//                   type="text"
//                   value={manualCode}
//                   onChange={(e) => setManualCode(e.target.value.toUpperCase())}
//                   placeholder="e.g., MAR60X60WH"
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-lg"
//                   autoFocus
//                 />
//               </div>

//               <button
//                 type="submit"
//                 className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
//               >
//                 Search Tile
//               </button>

//               <div className="bg-gray-50 p-4 rounded-lg">
//                 <p className="text-gray-700 text-sm mb-2">
//                   📋 <strong>Where to find tile code?</strong>
//                 </p>
//                 <ul className="text-gray-600 text-sm space-y-1">
//                   <li>• Check the label on the tile box</li>
//                   <li>• Look for code near the QR sticker</li>
//                   <li>• Ask showroom staff for the code</li>
//                 </ul>
//               </div>
//             </form>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };   
// src/components/QRScanner.tsx
import React, { useState, useRef, useEffect } from 'react';
import { Camera, X, Upload, Hash, AlertCircle, CheckCircle } from 'lucide-react';
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
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number>();
  const lastScanTimeRef = useRef<number>(0);

  // Start camera
  const startCamera = async () => {
    try {
      setError(null);
      setScanning(true);

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        scanQRCode();
      }
    } catch (err: any) {
      console.error('Camera error:', err);
      setError('Camera access denied. Please enable camera permissions or try manual entry.');
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

  // Scan QR code from video
  const scanQRCode = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (!ctx || video.readyState !== video.HAVE_ENOUGH_DATA) {
      animationFrameRef.current = requestAnimationFrame(scanQRCode);
      return;
    }

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
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

  // ✅ ENHANCED: Handle detected QR code with continuous scanning support
  // const handleQRDetected = async (qrData: string) => {
  //   try {
  //     // ✅ ANTI-SPAM: Prevent same QR being scanned rapidly (2 second cooldown)
  //     const now = Date.now();
  //     if (qrData === lastScannedCode && (now - lastScanTimeRef.current) < 2000) {
  //       // Same QR scanned within 2 seconds - ignore
  //       animationFrameRef.current = requestAnimationFrame(scanQRCode);
  //       return;
  //     }

  //     // Update last scan tracking
  //     lastScanTimeRef.current = now;
  //     setLastScannedCode(qrData);
      
  //     // Parse QR data
  //     const parsed = JSON.parse(qrData);
      
  //     if (parsed.type === 'tile_viewer' && parsed.tileId) {
  //       console.log('✅ Valid QR detected:', parsed.tileId);
        
  //       // Show brief success message
  //       setSuccessMessage('QR Code detected!');
  //       setError(null);
        
  //       // ✅ CRITICAL: Don't stop camera! Keep scanning for next QR
  //       // stopCamera();  // ← REMOVED - Camera keeps running
        
  //       // Call parent handler
  //       onScanSuccess(parsed);
        
  //       // Clear success message after 1.5 seconds
  //       setTimeout(() => {
  //         setSuccessMessage(null);
  //       }, 1500);
        
  //       // ✅ Continue scanning for next QR code
  //       animationFrameRef.current = requestAnimationFrame(scanQRCode);
        
  //     } else {
  //       console.warn('Invalid QR format:', parsed);
  //       setError('Invalid QR code. Please scan a valid tile QR code.');
  //       setSuccessMessage(null);
        
  //       // Auto-clear error and continue scanning
  //       setTimeout(() => {
  //         setError(null);
  //       }, 2000);
        
  //       // Keep scanning
  //       animationFrameRef.current = requestAnimationFrame(scanQRCode);
  //     }
  //   } catch (err) {
  //     console.error('QR parse error:', err);
  //     setError('Could not read QR code. Please try again.');
  //     setSuccessMessage(null);
      
  //     // Auto-clear error
  //     setTimeout(() => {
  //       setError(null);
  //     }, 2000);
      
  //     // Keep scanning
  //     animationFrameRef.current = requestAnimationFrame(scanQRCode);
  //   }
  // };
// ✅ FIXED: Handle detected QR code - NO COOLDOWN, track every scan!
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
      
      // Show success feedback
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
      
      const img = new Image();
      const reader = new FileReader();

      reader.onload = (event) => {
        img.onload = () => {
          const canvas = canvasRef.current;
          if (!canvas) return;

          const ctx = canvas.getContext('2d');
          if (!ctx) return;

          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);

          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          
          const code = jsQR(imageData.data, imageData.width, imageData.height, {
            inversionAttempts: 'dontInvert'
          });

          if (code && code.data) {
            try {
              const parsed = JSON.parse(code.data);
              
              if (parsed.type === 'tile_viewer' && parsed.tileId) {
                setSuccessMessage('QR Code found in image!');
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
        img.src = event.target?.result as string;
      };

      reader.readAsDataURL(file);
    } catch (err) {
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
  }, [scanMode]);

  // ✅ Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 flex items-center justify-between">
          <h3 className="text-white text-xl font-bold">Scan QR Code</h3>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Mode Selector */}
        <div className="flex border-b">
          <button
            onClick={() => setScanMode('camera')}
            className={`flex-1 py-3 px-4 flex items-center justify-center gap-2 font-medium transition-colors ${
              scanMode === 'camera'
                ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Camera className="w-5 h-5" />
            Camera
          </button>
          <button
            onClick={() => setScanMode('upload')}
            className={`flex-1 py-3 px-4 flex items-center justify-center gap-2 font-medium transition-colors ${
              scanMode === 'upload'
                ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Upload className="w-5 h-5" />
            Upload
          </button>
          <button
            onClick={() => setScanMode('manual')}
            className={`flex-1 py-3 px-4 flex items-center justify-center gap-2 font-medium transition-colors ${
              scanMode === 'manual'
                ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Hash className="w-5 h-5" />
            Manual
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Success Message */}
          {successMessage && (
            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3 animate-pulse">
              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-green-800 font-medium">Success</p>
                <p className="text-green-700 text-sm">{successMessage}</p>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-red-800 font-medium">Error</p>
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            </div>
          )}

          {/* Camera Mode */}
          {scanMode === 'camera' && (
            <div className="space-y-4">
              <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
                <video
                  ref={videoRef}
                  className="w-full h-full object-cover"
                  playsInline
                  muted
                />
                {scanning && (
                  <div className="absolute inset-0 border-4 border-blue-500 animate-pulse">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-black/50 text-white px-4 py-2 rounded-lg">
                        <p className="text-sm font-medium">
                          {successMessage ? '✅ Detected! Ready for next...' : '📷 Scanning...'}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <canvas ref={canvasRef} className="hidden" />
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-blue-900 text-sm font-medium mb-2">📱 How to scan:</p>
                <ul className="text-blue-800 text-sm space-y-1">
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
            <div className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="qr-upload"
                />
                <label
                  htmlFor="qr-upload"
                  className="cursor-pointer flex flex-col items-center gap-3"
                >
                  <Upload className="w-12 h-12 text-gray-400" />
                  <div>
                    <p className="text-gray-700 font-medium">Upload QR Code Image</p>
                    <p className="text-gray-500 text-sm mt-1">Click to select image</p>
                  </div>
                </label>
              </div>
              <canvas ref={canvasRef} className="hidden" />
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700 text-sm">
                  💡 <strong>Tip:</strong> Take a clear photo of the QR code on the tile and upload it here.
                </p>
              </div>
            </div>
          )}

          {/* Manual Mode */}
          {scanMode === 'manual' && (
            <form onSubmit={handleManualSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Enter Tile Code
                </label>
                <input
                  type="text"
                  value={manualCode}
                  onChange={(e) => setManualCode(e.target.value.toUpperCase())}
                  placeholder="e.g., MAR60X60WH"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-lg"
                  autoFocus
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Search Tile
              </button>

              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700 text-sm mb-2">
                  📋 <strong>Where to find tile code?</strong>
                </p>
                <ul className="text-gray-600 text-sm space-y-1">
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
