
// import React, { useState, useRef, useEffect } from 'react';
// import { 
//   Camera, 
//   Shield, 
//   X, 
//   Upload, 
//   Hash, 
//   AlertCircle, 
//   Image as ImageIcon, 
//   CheckCircle, 
//   RotateCcw 
// } from 'lucide-react';
// import jsQR from 'jsqr';
// import { 
//   getTileByCode,
//   verifyWorkerTileAccess
// } from '../lib/firebaseutils';

// // ═══════════════════════════════════════════════════════════════════════════
// // TYPE DEFINITIONS
// // ═══════════════════════════════════════════════════════════════════════════

// interface QRScannerProps {
//   onScanSuccess: (data: any) => void;
//   onClose: () => void;
//   currentUser?: {
//     role?: string;
//     user_id?: string;
//     showroom_id?: string;
//   };
// }

// type ScanMode = 'camera' | 'upload' | 'manual';
// type CameraFacing = 'environment' | 'user';

// // ═══════════════════════════════════════════════════════════════════════════
// // MAIN COMPONENT
// // ═══════════════════════════════════════════════════════════════════════════

// export const QRScanner: React.FC<QRScannerProps> = ({ 
//   onScanSuccess, 
//   onClose, 
//   currentUser 
// }) => {
  
//   // ═════════════════════════════════════════════════════════════════════════
//   // STATE MANAGEMENT
//   // ═════════════════════════════════════════════════════════════════════════
  
//   const [scanMode, setScanMode] = useState<ScanMode>('camera');
//   const [error, setError] = useState<string | null>(null);
//   const [scanning, setScanning] = useState(false);
//   const [manualCode, setManualCode] = useState('');
//   const [successMessage, setSuccessMessage] = useState<string | null>(null);
//   const [cameraFacing, setCameraFacing] = useState<CameraFacing>('environment');
//   const [isLoading, setIsLoading] = useState(false);
//   const [isMobile, setIsMobile] = useState(false);

//   // ═════════════════════════════════════════════════════════════════════════
//   // REFS
//   // ═════════════════════════════════════════════════════════════════════════
  
//   const videoRef = useRef<HTMLVideoElement>(null);
//   const canvasRef = useRef<HTMLCanvasElement>(null);
//   const streamRef = useRef<MediaStream | null>(null);
//   const animationFrameRef = useRef<number>();
//   const lastScanTimeRef = useRef<number>(0);
//   const fileInputRef = useRef<HTMLInputElement>(null);
  
//   // ═════════════════════════════════════════════════════════════════════════
//   // DEVICE DETECTION
//   // ═════════════════════════════════════════════════════════════════════════
  
//   useEffect(() => {
//     const checkDevice = () => {
//       const userAgent = navigator.userAgent.toLowerCase();
//       const mobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
//       setIsMobile(mobile);
      
//       console.log('📱 Device detected:', mobile ? 'Mobile' : 'Desktop');
//     };
    
//     checkDevice();
//     window.addEventListener('resize', checkDevice);
    
//     return () => window.removeEventListener('resize', checkDevice);
//   }, []);

//   // ═════════════════════════════════════════════════════════════════════════
//   // CAMERA FUNCTIONS
//   // ═════════════════════════════════════════════════════════════════════════
  
//   const startCamera = async () => {
//     try {
//       setError(null);
//       setIsLoading(true);
//       console.log('📷 Starting camera with facing:', cameraFacing);

//       // Stop existing stream if any
//       if (streamRef.current) {
//         streamRef.current.getTracks().forEach(track => track.stop());
//       }

//       // Request camera access with optimized constraints
//       const stream = await navigator.mediaDevices.getUserMedia({
//         video: { 
//           facingMode: cameraFacing,
//           width: { ideal: 1280, max: 1920 },
//           height: { ideal: 720, max: 1080 }
//         }
//       });

//       streamRef.current = stream;

//       if (videoRef.current) {
//         videoRef.current.srcObject = stream;
//         await videoRef.current.play();
//         setScanning(true);
//         setIsLoading(false);
//         console.log('✅ Camera started successfully');
        
//         // Start QR code scanning loop
//         scanQRCode();
//       }
//     } catch (err: any) {
//       console.error('❌ Camera error:', err);
//       setIsLoading(false);
      
//       // Provide user-friendly error messages
//       if (err.name === 'NotAllowedError') {
//         setError('Camera access denied. Please enable camera permissions in your browser settings.');
//       } else if (err.name === 'NotFoundError') {
//         setError('No camera found on this device. Please use upload or manual mode.');
//       } else if (err.name === 'NotReadableError') {
//         setError('Camera is being used by another app. Please close other apps and try again.');
//       } else if (err.name === 'OverconstrainedError') {
//         setError('Camera constraints not supported. Trying again...');
//         // Retry with basic constraints
//         setTimeout(() => startCameraFallback(), 1000);
//       } else {
//         setError('Camera access failed. Please try upload or manual entry mode.');
//       }
//       setScanning(false);
//     }
//   };

//   // Fallback camera start with minimal constraints
//   const startCameraFallback = async () => {
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({
//         video: { facingMode: cameraFacing }
//       });
      
//       streamRef.current = stream;
      
//       if (videoRef.current) {
//         videoRef.current.srcObject = stream;
//         await videoRef.current.play();
//         setScanning(true);
//         setError(null);
//         scanQRCode();
//       }
//     } catch (err) {
//       console.error('❌ Fallback camera failed:', err);
//       setError('Camera not available. Please use upload or manual mode.');
//     }
//   };

//   const stopCamera = () => {
//     console.log('🛑 Stopping camera');
    
//     if (streamRef.current) {
//       streamRef.current.getTracks().forEach(track => {
//         track.stop();
//         console.log('🔌 Track stopped:', track.kind);
//       });
//       streamRef.current = null;
//     }
    
//     if (animationFrameRef.current) {
//       cancelAnimationFrame(animationFrameRef.current);
//       animationFrameRef.current = undefined;
//     }
    
//     setScanning(false);
//   };

//   const switchCamera = () => {
//     console.log('🔄 Switching camera');
//     setCameraFacing(prev => prev === 'environment' ? 'user' : 'environment');
//   };

//   // ═════════════════════════════════════════════════════════════════════════
//   // QR CODE SCANNING (OPTIMIZED FOR PERFORMANCE)
//   // ═════════════════════════════════════════════════════════════════════════
  
//   const scanQRCode = () => {
//     if (!videoRef.current || !canvasRef.current) {
//       animationFrameRef.current = requestAnimationFrame(scanQRCode);
//       return;
//     }

//     const video = videoRef.current;
//     const canvas = canvasRef.current;
//     const ctx = canvas.getContext('2d', { willReadFrequently: true });

//     // Wait for video to be ready
//     if (!ctx || video.readyState !== video.HAVE_ENOUGH_DATA) {
//       animationFrameRef.current = requestAnimationFrame(scanQRCode);
//       return;
//     }

//     // Optimized canvas size for faster processing
//     const targetWidth = 800;
//     const targetHeight = 600;
    
//     canvas.width = targetWidth;
//     canvas.height = targetHeight;
    
//     // Draw current video frame to canvas
//     ctx.drawImage(video, 0, 0, targetWidth, targetHeight);

//     // Get image data for QR detection
//     const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    
//     // Scan for QR code
//     const code = jsQR(imageData.data, imageData.width, imageData.height, {
//       inversionAttempts: 'dontInvert' // Faster performance
//     });

//     if (code && code.data) {
//       console.log('🎯 QR Code detected!');
//       handleQRDetected(code.data);
//     } else {
//       // Continue scanning
//       animationFrameRef.current = requestAnimationFrame(scanQRCode);
//     }
//   };

//   // ═════════════════════════════════════════════════════════════════════════
//   // QR CODE DETECTION WITH WORKER AUTHORIZATION
//   // ═════════════════════════════════════════════════════════════════════════
  
//   const handleQRDetected = async (qrData: string) => {
//     try {
//       console.log('🔍 QR Data received:', qrData);
      
//       // Parse QR data
//       let parsed;
//       try {
//         const cleanData = qrData.trim();
//         parsed = JSON.parse(cleanData);
//       } catch (parseError) {
//         console.error('❌ JSON parse failed:', parseError);
//         setError('Could not parse QR code. Please try again.');
//         setSuccessMessage(null);
        
//         setTimeout(() => setError(null), 2000);
//         animationFrameRef.current = requestAnimationFrame(scanQRCode);
//         return;
//       }
      
//       // Validate QR structure
//       if (parsed.type === 'tile_viewer' && parsed.tileId) {
//         const tileId = parsed.tileId.trim();
//         console.log('✅ Valid tile QR:', tileId);
        
//         // ═══════════════════════════════════════════════════════════════
//         // WORKER AUTHORIZATION CHECK
//         // ═══════════════════════════════════════════════════════════════
        
//         if (currentUser?.role === 'worker' && currentUser?.user_id) {
//           console.log('🔒 Worker detected - verifying access...');
          
//           const verification = await verifyWorkerTileAccess(tileId, currentUser.user_id);
          
//           if (!verification.allowed) {
//             console.error('🚫 Access denied:', verification.error);
            
//             setError(verification.error || 'Unauthorized tile access');
//             setSuccessMessage(null);
            
//             // Triple vibration for unauthorized access
//             if (navigator.vibrate) {
//               navigator.vibrate([200, 100, 200, 100, 200]);
//             }
            
//             setTimeout(() => {
//               setError(null);
//             }, 8000);
            
//             // Continue scanning
//             animationFrameRef.current = requestAnimationFrame(scanQRCode);
//             return;
//           }
          
//           console.log('✅ Worker authorized for tile access');
//         }
        
//         // ═══════════════════════════════════════════════════════════════
//         // AUTHORIZED - PROCEED WITH SCAN
//         // ═══════════════════════════════════════════════════════════════
        
//         const now = Date.now();
//         lastScanTimeRef.current = now;
        
//         // Success haptic feedback
//         if (navigator.vibrate) {
//           navigator.vibrate(200);
//         }
        
//         setSuccessMessage(`✅ Scanned: ${tileId.substring(0, 8)}...`);
//         setError(null);
        
//         // Update parsed data with sanitized tileId
//         parsed.tileId = tileId;
        
//         // Send to parent component
//         onScanSuccess(parsed);
        
//         console.log('✅ Scan sent to parent component');
        
//         // Clear success message after delay
//         setTimeout(() => {
//           setSuccessMessage(null);
//         }, 1500);
        
//         // Continue scanning for next QR code
//         animationFrameRef.current = requestAnimationFrame(scanQRCode);
        
//       } else {
//         console.warn('⚠️ Invalid QR structure:', parsed);
//         setError('Invalid QR code. Please scan a valid tile QR code.');
//         setSuccessMessage(null);
        
//         setTimeout(() => setError(null), 2000);
//         animationFrameRef.current = requestAnimationFrame(scanQRCode);
//       }
//     } catch (err) {
//       console.error('❌ QR detection error:', err);
//       setError('Error processing QR code. Please try again.');
//       setSuccessMessage(null);
      
//       setTimeout(() => setError(null), 2000);
//       animationFrameRef.current = requestAnimationFrame(scanQRCode);
//     }
//   };

//   // ═════════════════════════════════════════════════════════════════════════
//   // IMAGE UPLOAD WITH WORKER AUTHORIZATION
//   // ═════════════════════════════════════════════════════════════════════════
  
//   const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     try {
//       setError(null);
//       setSuccessMessage(null);
//       setIsLoading(true);
      
//       console.log('📸 Processing uploaded image:', file.name);
      
//       const img = new Image();
//       const reader = new FileReader();

//       reader.onload = (event) => {
//         img.onload = async () => {
//           const canvas = canvasRef.current;
//           if (!canvas) {
//             setIsLoading(false);
//             return;
//           }

//           const ctx = canvas.getContext('2d');
//           if (!ctx) {
//             setIsLoading(false);
//             return;
//           }

//           // Optimize image size for processing
//           const maxSize = 1024;
//           let width = img.width;
//           let height = img.height;
          
//           if (width > maxSize || height > maxSize) {
//             if (width > height) {
//               height = (height / width) * maxSize;
//               width = maxSize;
//             } else {
//               width = (width / height) * maxSize;
//               height = maxSize;
//             }
//           }

//           canvas.width = width;
//           canvas.height = height;
//           ctx.drawImage(img, 0, 0, width, height);

//           const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          
//           // Scan for QR code in image
//           const code = jsQR(imageData.data, imageData.width, imageData.height, {
//             inversionAttempts: 'attemptBoth' // Try both normal and inverted
//           });

//           setIsLoading(false);

//           if (code && code.data) {
//             try {
//               console.log('📸 RAW QR from Upload:', code.data);
              
//               const cleanData = code.data.trim();
//               const parsed = JSON.parse(cleanData);
              
//               console.log('✅ Parsed Upload QR:', parsed);
              
//               if (parsed.type === 'tile_viewer' && parsed.tileId) {
//                 const tileId = parsed.tileId.trim();
                
//                 // ═══════════════════════════════════════════════════════
//                 // WORKER AUTHORIZATION CHECK FOR UPLOAD
//                 // ═══════════════════════════════════════════════════════
                
//                 if (currentUser?.role === 'worker' && currentUser?.user_id) {
//                   console.log('🔒 Upload: Worker detected - verifying access...');
                  
//                   const verification = await verifyWorkerTileAccess(tileId, currentUser.user_id);
                  
//                   if (!verification.allowed) {
//                     console.error('🚫 Upload: Access denied:', verification.error);
                    
//                     setError(verification.error || 'Unauthorized tile access');
//                     setSuccessMessage(null);
                    
//                     if (navigator.vibrate) {
//                       navigator.vibrate([200, 100, 200, 100, 200]);
//                     }
                    
//                     return;
//                   }
                  
//                   console.log('✅ Upload: Worker authorized');
//                 }
                
//                 // AUTHORIZED - PROCEED
//                 parsed.tileId = tileId;
                
//                 setSuccessMessage('QR Code found in image!');
//                 if (navigator.vibrate) {
//                   navigator.vibrate(200);
//                 }
//                 onScanSuccess(parsed);
                
//               } else {
//                 setError('Invalid QR code in image.');
//               }
//             } catch (parseErr) {
//               console.error('❌ Parse error:', parseErr);
//               setError('Could not parse QR code from image.');
//             }
//           } else {
//             setError('No QR code found in image. Please try another image.');
//           }
//         };
        
//         img.onerror = () => {
//           setIsLoading(false);
//           setError('Failed to load image. Please try another file.');
//         };
        
//         img.src = event.target?.result as string;
//       };

//       reader.onerror = () => {
//         setIsLoading(false);
//         setError('Failed to read file. Please try again.');
//       };

//       reader.readAsDataURL(file);
//     } catch (err) {
//       console.error('❌ Image upload error:', err);
//       setIsLoading(false);
//       setError('Failed to process image. Please try again.');
//     } finally {
//       // Reset file input
//       if (fileInputRef.current) {
//         fileInputRef.current.value = '';
//       }
//     }
//   };

//   // ═════════════════════════════════════════════════════════════════════════
//   // MANUAL ENTRY WITH WORKER AUTHORIZATION
//   // ═════════════════════════════════════════════════════════════════════════
  
//   const handleManualSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
    
//     if (!manualCode.trim()) {
//       setError('Please enter a tile code');
//       return;
//     }

//     setError(null);
//     setSuccessMessage('Searching for tile...');
//     setIsLoading(true);

//     try {
//       const searchCode = manualCode.trim().toUpperCase();
//       console.log('🔍 Manual code search:', searchCode);
      
//       // Search tile by code
//       const result = await getTileByCode(searchCode);

//       if (result.success && result.tile) {
//         const tileId = result.tile.id;
        
//         // ═══════════════════════════════════════════════════════════════
//         // WORKER AUTHORIZATION CHECK FOR MANUAL ENTRY
//         // ═══════════════════════════════════════════════════════════════
        
//         if (currentUser?.role === 'worker' && currentUser?.user_id) {
//           console.log('🔒 Manual: Worker detected - verifying access...');
          
//           const verification = await verifyWorkerTileAccess(tileId, currentUser.user_id);
          
//           if (!verification.allowed) {
//             console.error('🚫 Manual: Access denied:', verification.error);
            
//             setIsLoading(false);
//             setError(verification.error || 'Unauthorized tile access');
//             setSuccessMessage(null);
            
//             if (navigator.vibrate) {
//               navigator.vibrate([200, 100, 200, 100, 200]);
//             }
            
//             return;
//           }
          
//           console.log('✅ Manual: Worker authorized');
//         }
        
//         // AUTHORIZED - PROCEED
//         setIsLoading(false);
//         console.log('✅ Tile found via manual code:', result.tile.name);
        
//         setSuccessMessage(`✅ Found: ${result.tile.name}`);
        
//         if (navigator.vibrate) {
//           navigator.vibrate(200);
//         }
        
//         onScanSuccess({
//           type: 'manual_entry',
//           tileCode: searchCode,
//           tileId: result.tile.id,
//           tileName: result.tile.name,
//           imageUrl: result.tile.imageUrl || result.tile.image_url
//         });
        
//       } else {
//         console.error('❌ Manual search failed:', result.error);
        
//         setIsLoading(false);
//         setError(result.error || 'Tile not found. Please check the code.');
//         setSuccessMessage(null);
        
//         if (navigator.vibrate) {
//           navigator.vibrate([200, 100, 200]);
//         }
//       }
      
//     } catch (err: any) {
//       console.error('❌ Manual search error:', err);
      
//       setIsLoading(false);
//       setError('Search failed. Please try again.');
//       setSuccessMessage(null);
//     }
//   };

//   // ═════════════════════════════════════════════════════════════════════════
//   // LIFECYCLE EFFECTS
//   // ═════════════════════════════════════════════════════════════════════════
  
//   // Start/stop camera based on mode
//   useEffect(() => {
//     if (scanMode === 'camera') {
//       startCamera();
//     } else {
//       stopCamera();
//     }

//     return () => {
//       stopCamera();
//     };
//   }, [scanMode, cameraFacing]);

//   // Cleanup on unmount
//   useEffect(() => {
//     return () => {
//       stopCamera();
//     };
//   }, []);

//   // Prevent body scroll when modal is open
//   useEffect(() => {
//     const originalOverflow = document.body.style.overflow;
//     document.body.style.overflow = 'hidden';
    
//     return () => {
//       document.body.style.overflow = originalOverflow;
//     };
//   }, []);

//   // ═════════════════════════════════════════════════════════════════════════
//   // RENDER
//   // ═════════════════════════════════════════════════════════════════════════
  
//   return (
//     <div 
//       className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-0 sm:p-4"
//       onClick={(e) => e.target === e.currentTarget && onClose()}
//     >
//       <div className="bg-white rounded-none sm:rounded-xl shadow-2xl w-full h-full sm:h-auto sm:max-w-lg sm:max-h-[90vh] flex flex-col overflow-hidden">
        
//         {/* ═══════════════════════════════════════════════════════════════ */}
//         {/* HEADER */}
//         {/* ═══════════════════════════════════════════════════════════════ */}
        
//         <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 sm:p-5 flex items-center justify-between flex-shrink-0 safe-top">
//           <div className="flex items-center gap-2">
//             <Camera className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
//             <h3 className="text-white text-lg sm:text-xl font-bold">Scan QR Code</h3>
//           </div>
//           <button
//             onClick={onClose}
//             className="text-white hover:bg-white/20 rounded-full p-2 transition-colors touch-manipulation"
//             aria-label="Close scanner"
//           >
//             <X className="w-5 h-5 sm:w-6 sm:h-6" />
//           </button>
//         </div>

//         {/* ═══════════════════════════════════════════════════════════════ */}
//         {/* WORKER SECURITY BADGE */}
//         {/* ═══════════════════════════════════════════════════════════════ */}
        
//         {currentUser?.role === 'worker' && (
//           <div className="bg-blue-50 border-b border-blue-200 px-4 py-3 flex items-center gap-2 flex-shrink-0">
//             <Shield className="w-4 h-4 text-blue-600 flex-shrink-0" />
//             <p className="text-blue-800 text-xs sm:text-sm font-medium">
//               🔒 Worker Mode: Only authorized tiles can be scanned
//             </p>
//           </div>
//         )}

//         {/* ═══════════════════════════════════════════════════════════════ */}
//         {/* MODE SELECTOR */}
//         {/* ═══════════════════════════════════════════════════════════════ */}
        
//         <div className="flex border-b flex-shrink-0">
//           <button
//             onClick={() => setScanMode('camera')}
//             className={`flex-1 py-3 px-2 sm:px-4 flex items-center justify-center gap-1 sm:gap-2 font-medium transition-colors text-sm sm:text-base touch-manipulation ${
//               scanMode === 'camera'
//                 ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
//                 : 'text-gray-600 hover:bg-gray-50'
//             }`}
//             aria-label="Camera mode"
//           >
//             <Camera className="w-4 h-4 sm:w-5 sm:h-5" />
//             <span className="hidden xs:inline">Camera</span>
//           </button>
//           <button
//             onClick={() => setScanMode('upload')}
//             className={`flex-1 py-3 px-2 sm:px-4 flex items-center justify-center gap-1 sm:gap-2 font-medium transition-colors text-sm sm:text-base touch-manipulation ${
//               scanMode === 'upload'
//                 ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
//                 : 'text-gray-600 hover:bg-gray-50'
//             }`}
//             aria-label="Upload mode"
//           >
//             <Upload className="w-4 h-4 sm:w-5 sm:h-5" />
//             <span className="hidden xs:inline">Upload</span>
//           </button>
//           <button
//             onClick={() => setScanMode('manual')}
//             className={`flex-1 py-3 px-2 sm:px-4 flex items-center justify-center gap-1 sm:gap-2 font-medium transition-colors text-sm sm:text-base touch-manipulation ${
//               scanMode === 'manual'
//                 ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
//                 : 'text-gray-600 hover:bg-gray-50'
//             }`}
//             aria-label="Manual entry mode"
//           >
//             <Hash className="w-4 h-4 sm:w-5 sm:h-5" />
//             <span className="hidden xs:inline">Manual</span>
//           </button>
//         </div>

//         {/* ═══════════════════════════════════════════════════════════════ */}
//         {/* CONTENT AREA */}
//         {/* ═══════════════════════════════════════════════════════════════ */}
        
//         <div className="p-4 sm:p-6 overflow-y-auto flex-1">
          
//           {/* ─────────────────────────────────────────────────────────── */}
//           {/* SUCCESS MESSAGE */}
//           {/* ─────────────────────────────────────────────────────────── */}
          
//           {successMessage && (
//             <div className="mb-4 p-3 sm:p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-2 sm:gap-3 animate-pulse">
//               <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
//               <div className="min-w-0 flex-1">
//                 <p className="text-green-800 font-medium text-sm sm:text-base">Success</p>
//                 <p className="text-green-700 text-xs sm:text-sm break-words">{successMessage}</p>
//               </div>
//             </div>
//           )}

//           {/* ─────────────────────────────────────────────────────────── */}
//           {/* ERROR MESSAGE */}
//           {/* ─────────────────────────────────────────────────────────── */}
          
//           {error && (
//             <div className="mb-4 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2 sm:gap-3">
//               <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
//               <div className="min-w-0 flex-1">
//                 <p className="text-red-800 font-medium text-sm sm:text-base">Error</p>
//                 <p className="text-red-700 text-xs sm:text-sm break-words">{error}</p>
//               </div>
//             </div>
//           )}

//           {/* ─────────────────────────────────────────────────────────── */}
//           {/* LOADING STATE */}
//           {/* ─────────────────────────────────────────────────────────── */}
          
//           {isLoading && (
//             <div className="mb-4 p-3 sm:p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-center gap-3">
//               <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
//               <p className="text-blue-800 font-medium text-sm sm:text-base">Processing...</p>
//             </div>
//           )}

//           {/* ═══════════════════════════════════════════════════════════ */}
//           {/* CAMERA MODE */}
//           {/* ═══════════════════════════════════════════════════════════ */}
          
//           {scanMode === 'camera' && (
//             <div className="space-y-3 sm:space-y-4">
//               <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
//                 <video
//                   ref={videoRef}
//                   className="w-full h-full object-cover"
//                   playsInline
//                   muted
//                   autoPlay
//                 />
                
//                 {scanning && (
//                   <div className="absolute inset-0 border-4 border-blue-500 animate-pulse pointer-events-none">
//                     <div className="absolute inset-0 flex items-center justify-center">
//                       <div className="bg-black/70 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-lg">
//                         <p className="text-xs sm:text-sm font-medium">
//                           {successMessage ? '✅ Detected! Ready for next...' : '📷 Scanning...'}
//                         </p>
//                       </div>
//                     </div>
                    
//                     {/* Scanning frame corners */}
//                     <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 border-2 border-white opacity-50">
//                       <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-blue-400"></div>
//                       <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-blue-400"></div>
//                       <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-blue-400"></div>
//                       <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-blue-400"></div>
//                     </div>
//                   </div>
//                 )}
                
//                 {/* Camera switch button */}
//                 {isMobile && (
//                   <button
//                     onClick={switchCamera}
//                     className="absolute bottom-3 right-3 bg-black/50 hover:bg-black/70 text-white p-2 sm:p-3 rounded-full transition-colors touch-manipulation"
//                     aria-label="Switch camera"
//                   >
//                     <RotateCcw className="w-5 h-5 sm:w-6 sm:h-6" />
//                   </button>
//                 )}
//               </div>
              
//               <canvas ref={canvasRef} className="hidden" />
              
//               <div className="bg-blue-50 p-3 sm:p-4 rounded-lg">
//                 <p className="text-blue-900 text-xs sm:text-sm font-medium mb-2">
//                   ⚡ Scanning Tips:
//                 </p>
//                 <ul className="text-blue-800 text-xs sm:text-sm space-y-1">
//                   <li>• Hold phone 6-8 inches from QR code</li>
//                   <li>• Ensure good lighting</li>
//                   <li>• Keep camera steady</li>
//                   <li>• Align QR code within the frame</li>
//                 </ul>
//               </div>
//             </div>
//           )}

//           {/* ═══════════════════════════════════════════════════════════ */}
//           {/* UPLOAD MODE */}
//           {/* ═══════════════════════════════════════════════════════════ */}
          
//           {scanMode === 'upload' && (
//             <div className="space-y-3 sm:space-y-4">
//               {isMobile ? (
//                 // Mobile: Gallery picker
//                 <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 sm:p-6 text-center hover:border-blue-500 transition-colors active:border-blue-600 touch-manipulation">
//                   <input
//                     ref={fileInputRef}
//                     type="file"
//                     accept="image/*"
//                     onChange={handleImageUpload}
//                     className="hidden"
//                     id="qr-gallery"
//                   />
//                   <label
//                     htmlFor="qr-gallery"
//                     className="cursor-pointer flex flex-col items-center gap-2 sm:gap-3"
//                   >
//                     <ImageIcon className="w-10 h-10 sm:w-12 sm:h-12 text-blue-600" />
//                     <div>
//                       <p className="text-gray-700 font-medium text-sm sm:text-base">
//                         📁 Choose from Gallery
//                       </p>
//                       <p className="text-gray-500 text-xs sm:text-sm mt-1">
//                         Select a photo containing QR code
//                       </p>
//                     </div>
//                   </label>
//                 </div>
//               ) : (
//                 // Desktop: File upload
//                 <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 sm:p-8 text-center hover:border-blue-500 transition-colors">
//                   <input
//                     ref={fileInputRef}
//                     type="file"
//                     accept="image/*"
//                     onChange={handleImageUpload}
//                     className="hidden"
//                     id="qr-upload"
//                   />
//                   <label
//                     htmlFor="qr-upload"
//                     className="cursor-pointer flex flex-col items-center gap-2 sm:gap-3"
//                   >
//                     <Upload className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400" />
//                     <div>
//                       <p className="text-gray-700 font-medium text-sm sm:text-base">
//                         Upload QR Code Image
//                       </p>
//                       <p className="text-gray-500 text-xs sm:text-sm mt-1">
//                         Click to select file
//                       </p>
//                     </div>
//                   </label>
//                 </div>
//               )}
              
//               <canvas ref={canvasRef} className="hidden" />
              
//               <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
//                 <p className="text-gray-700 text-xs sm:text-sm">
//                   💡 <strong>Tip:</strong> {isMobile 
//                     ? 'Choose a clear photo of the QR code from your gallery.' 
//                     : 'Upload a clear photo of the QR code.'}
//                 </p>
//               </div>
//             </div>
//           )}

//           {/* ═══════════════════════════════════════════════════════════ */}
//           {/* MANUAL MODE */}
//           {/* ═══════════════════════════════════════════════════════════ */}
          
//           {scanMode === 'manual' && (
//             <form onSubmit={handleManualSubmit} className="space-y-3 sm:space-y-4">
//               <div>
//                 <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
//                   Enter Tile Code
//                 </label>
//                 <input
//                   type="text"
//                   value={manualCode}
//                   onChange={(e) => setManualCode(e.target.value.toUpperCase())}
//                   placeholder="e.g., MAR60X60WH"
//                   className="w-full px-3 py-3 sm:px-4 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-base sm:text-lg touch-manipulation"
//                   autoFocus
//                   autoComplete="off"
//                   autoCapitalize="characters"
//                   disabled={isLoading}
//                 />
//               </div>

//               <button
//                 type="submit"
//                 className="w-full bg-blue-600 text-white py-3 sm:py-3 rounded-lg font-semibold hover:bg-blue-700 active:bg-blue-800 transition-colors text-sm sm:text-base touch-manipulation disabled:opacity-50 disabled:cursor-not-allowed"
//                 disabled={!manualCode.trim() || isLoading}
//               >
//                 {isLoading ? (
//                   <span className="flex items-center justify-center gap-2">
//                     <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
//                     Searching...
//                   </span>
//                 ) : (
//                   'Search Tile'
//                 )}
//               </button>

//               {currentUser?.role === 'worker' && (
//                 <div className="bg-orange-50 border border-orange-200 p-3 sm:p-4 rounded-lg">
//                   <p className="text-orange-900 text-xs sm:text-sm font-medium mb-1">
//                     ⚠️ Worker Authorization Active
//                   </p>
//                   <p className="text-orange-800 text-xs sm:text-sm">
//                     You can only search tiles from your assigned showroom. 
//                     Unauthorized attempts will be logged.
//                   </p>
//                 </div>
//               )}

//               <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
//                 <p className="text-gray-700 text-xs sm:text-sm mb-2">
//                   📋 <strong>Where to find tile code?</strong>
//                 </p>
//                 <ul className="text-gray-600 text-xs sm:text-sm space-y-1">
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

// export default QRScanner;  
import React, { useState, useRef, useEffect } from 'react';
import { 
  Camera, 
  Shield, 
  X, 
  Upload, 
  Hash, 
  AlertCircle, 
  Image as ImageIcon, 
  CheckCircle, 
  RotateCcw,
  Scan,
  Zap,
  Loader
} from 'lucide-react';
import jsQR from 'jsqr';
import { 
  getTileByCode,
  verifyWorkerTileAccess
} from '../lib/firebaseutils';

// ═══════════════════════════════════════════════════════════════════════════
// TYPE DEFINITIONS
// ═══════════════════════════════════════════════════════════════════════════

interface QRScannerProps {
  onScanSuccess: (data: any) => void;
  onClose: () => void;
  currentUser?: {
    role?: string;
    user_id?: string;
    showroom_id?: string;
  };
}

type ScanMode = 'camera' | 'upload' | 'manual';
type CameraFacing = 'environment' | 'user';

// ═══════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export const QRScanner: React.FC<QRScannerProps> = ({ 
  onScanSuccess, 
  onClose, 
  currentUser 
}) => {
  
  // ═════════════════════════════════════════════════════════════════════════
  // STATE MANAGEMENT
  // ═════════════════════════════════════════════════════════════════════════
  
  const [scanMode, setScanMode] = useState<ScanMode>('camera');
  const [error, setError] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const [manualCode, setManualCode] = useState('');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [cameraFacing, setCameraFacing] = useState<CameraFacing>('environment');
  const [isLoading, setIsLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // ═════════════════════════════════════════════════════════════════════════
  // REFS
  // ═════════════════════════════════════════════════════════════════════════
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number>();
  const lastScanTimeRef = useRef<number>(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // ═════════════════════════════════════════════════════════════════════════
  // DEVICE DETECTION
  // ═════════════════════════════════════════════════════════════════════════
  
  useEffect(() => {
    const checkDevice = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      const mobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
      setIsMobile(mobile);
      
      console.log('📱 Device detected:', mobile ? 'Mobile' : 'Desktop');
    };
    
    checkDevice();
    window.addEventListener('resize', checkDevice);
    
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  // ═════════════════════════════════════════════════════════════════════════
  // CAMERA FUNCTIONS
  // ═════════════════════════════════════════════════════════════════════════
  
  const startCamera = async () => {
    try {
      setError(null);
      setIsLoading(true);
      console.log('📷 Starting camera with facing:', cameraFacing);

      // Stop existing stream if any
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }

      // Request camera access with optimized constraints
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: cameraFacing,
          width: { ideal: 1280, max: 1920 },
          height: { ideal: 720, max: 1080 }
        }
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setScanning(true);
        setIsLoading(false);
        console.log('✅ Camera started successfully');
        
        // Start QR code scanning loop
        scanQRCode();
      }
    } catch (err: any) {
      console.error('❌ Camera error:', err);
      setIsLoading(false);
      
      // Provide user-friendly error messages
      if (err.name === 'NotAllowedError') {
        setError('Camera access denied. Please enable camera permissions in your browser settings.');
      } else if (err.name === 'NotFoundError') {
        setError('No camera found on this device. Please use upload or manual mode.');
      } else if (err.name === 'NotReadableError') {
        setError('Camera is being used by another app. Please close other apps and try again.');
      } else if (err.name === 'OverconstrainedError') {
        setError('Camera constraints not supported. Trying again...');
        // Retry with basic constraints
        setTimeout(() => startCameraFallback(), 1000);
      } else {
        setError('Camera access failed. Please try upload or manual entry mode.');
      }
      setScanning(false);
    }
  };

  // Fallback camera start with minimal constraints
  const startCameraFallback = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: cameraFacing }
      });
      
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setScanning(true);
        setError(null);
        scanQRCode();
      }
    } catch (err) {
      console.error('❌ Fallback camera failed:', err);
      setError('Camera not available. Please use upload or manual mode.');
    }
  };

  const stopCamera = () => {
    console.log('🛑 Stopping camera');
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => {
        track.stop();
        console.log('🔌 Track stopped:', track.kind);
      });
      streamRef.current = null;
    }
    
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = undefined;
    }
    
    setScanning(false);
  };

  const switchCamera = () => {
    console.log('🔄 Switching camera');
    setCameraFacing(prev => prev === 'environment' ? 'user' : 'environment');
  };

  // ═════════════════════════════════════════════════════════════════════════
  // QR CODE SCANNING (OPTIMIZED FOR PERFORMANCE)
  // ═════════════════════════════════════════════════════════════════════════
  
  const scanQRCode = () => {
    if (!videoRef.current || !canvasRef.current) {
      animationFrameRef.current = requestAnimationFrame(scanQRCode);
      return;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });

    // Wait for video to be ready
    if (!ctx || video.readyState !== video.HAVE_ENOUGH_DATA) {
      animationFrameRef.current = requestAnimationFrame(scanQRCode);
      return;
    }

    // Optimized canvas size for faster processing
    const targetWidth = 800;
    const targetHeight = 600;
    
    canvas.width = targetWidth;
    canvas.height = targetHeight;
    
    // Draw current video frame to canvas
    ctx.drawImage(video, 0, 0, targetWidth, targetHeight);

    // Get image data for QR detection
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    
    // Scan for QR code
    const code = jsQR(imageData.data, imageData.width, imageData.height, {
      inversionAttempts: 'dontInvert' // Faster performance
    });

    if (code && code.data) {
      console.log('🎯 QR Code detected!');
      handleQRDetected(code.data);
    } else {
      // Continue scanning
      animationFrameRef.current = requestAnimationFrame(scanQRCode);
    }
  };

  // ═════════════════════════════════════════════════════════════════════════
  // QR CODE DETECTION WITH WORKER AUTHORIZATION
  // ═════════════════════════════════════════════════════════════════════════
  
  const handleQRDetected = async (qrData: string) => {
    try {
      console.log('🔍 QR Data received:', qrData);
      
      // Parse QR data
      let parsed;
      try {
        const cleanData = qrData.trim();
        parsed = JSON.parse(cleanData);
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
        const tileId = parsed.tileId.trim();
        console.log('✅ Valid tile QR:', tileId);
        
        // ═══════════════════════════════════════════════════════════════
        // WORKER AUTHORIZATION CHECK
        // ═══════════════════════════════════════════════════════════════
        
        if (currentUser?.role === 'worker' && currentUser?.user_id) {
          console.log('🔒 Worker detected - verifying access...');
          
          const verification = await verifyWorkerTileAccess(tileId, currentUser.user_id);
          
          if (!verification.allowed) {
            console.error('🚫 Access denied:', verification.error);
            
            setError(verification.error || 'Unauthorized tile access');
            setSuccessMessage(null);
            
            // Triple vibration for unauthorized access
            if (navigator.vibrate) {
              navigator.vibrate([200, 100, 200, 100, 200]);
            }
            
            setTimeout(() => {
              setError(null);
            }, 8000);
            
            // Continue scanning
            animationFrameRef.current = requestAnimationFrame(scanQRCode);
            return;
          }
          
          console.log('✅ Worker authorized for tile access');
        }
        
        // ═══════════════════════════════════════════════════════════════
        // AUTHORIZED - PROCEED WITH SCAN
        // ═══════════════════════════════════════════════════════════════
        
        const now = Date.now();
        lastScanTimeRef.current = now;
        
        // Success haptic feedback
        if (navigator.vibrate) {
          navigator.vibrate(200);
        }
        
        setSuccessMessage(`✅ Scanned: ${tileId.substring(0, 8)}...`);
        setError(null);
        
        // Update parsed data with sanitized tileId
        parsed.tileId = tileId;
        
        // Send to parent component
        onScanSuccess(parsed);
        
        console.log('✅ Scan sent to parent component');
        
        // Clear success message after delay
        setTimeout(() => {
          setSuccessMessage(null);
        }, 1500);
        
        // Continue scanning for next QR code
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

  // ═════════════════════════════════════════════════════════════════════════
  // IMAGE UPLOAD WITH WORKER AUTHORIZATION
  // ═════════════════════════════════════════════════════════════════════════
  
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setError(null);
      setSuccessMessage(null);
      setIsLoading(true);
      
      console.log('📸 Processing uploaded image:', file.name);
      
      const img = new Image();
      const reader = new FileReader();

      reader.onload = (event) => {
        img.onload = async () => {
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

          // Optimize image size for processing
          const maxSize = 1024;
          let width = img.width;
          let height = img.height;
          
          if (width > maxSize || height > maxSize) {
            if (width > height) {
              height = (height / width) * maxSize;
              width = maxSize;
            } else {
              width = (width / height) * maxSize;
              height = maxSize;
            }
          }

          canvas.width = width;
          canvas.height = height;
          ctx.drawImage(img, 0, 0, width, height);

          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          
          // Scan for QR code in image
          const code = jsQR(imageData.data, imageData.width, imageData.height, {
            inversionAttempts: 'attemptBoth' // Try both normal and inverted
          });

          setIsLoading(false);

          if (code && code.data) {
            try {
              console.log('📸 RAW QR from Upload:', code.data);
              
              const cleanData = code.data.trim();
              const parsed = JSON.parse(cleanData);
              
              console.log('✅ Parsed Upload QR:', parsed);
              
              if (parsed.type === 'tile_viewer' && parsed.tileId) {
                const tileId = parsed.tileId.trim();
                
                // ═══════════════════════════════════════════════════════
                // WORKER AUTHORIZATION CHECK FOR UPLOAD
                // ═══════════════════════════════════════════════════════
                
                if (currentUser?.role === 'worker' && currentUser?.user_id) {
                  console.log('🔒 Upload: Worker detected - verifying access...');
                  
                  const verification = await verifyWorkerTileAccess(tileId, currentUser.user_id);
                  
                  if (!verification.allowed) {
                    console.error('🚫 Upload: Access denied:', verification.error);
                    
                    setError(verification.error || 'Unauthorized tile access');
                    setSuccessMessage(null);
                    
                    if (navigator.vibrate) {
                      navigator.vibrate([200, 100, 200, 100, 200]);
                    }
                    
                    return;
                  }
                  
                  console.log('✅ Upload: Worker authorized');
                }
                
                // AUTHORIZED - PROCEED
                parsed.tileId = tileId;
                
                setSuccessMessage('QR Code found in image!');
                if (navigator.vibrate) {
                  navigator.vibrate(200);
                }
                onScanSuccess(parsed);
                
              } else {
                setError('Invalid QR code in image.');
              }
            } catch (parseErr) {
              console.error('❌ Parse error:', parseErr);
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
      console.error('❌ Image upload error:', err);
      setIsLoading(false);
      setError('Failed to process image. Please try again.');
    } finally {
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // ═════════════════════════════════════════════════════════════════════════
  // MANUAL ENTRY WITH WORKER AUTHORIZATION
  // ═════════════════════════════════════════════════════════════════════════
  
  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!manualCode.trim()) {
      setError('Please enter a tile code');
      return;
    }

    setError(null);
    setSuccessMessage('Searching for tile...');
    setIsLoading(true);

    try {
      const searchCode = manualCode.trim().toUpperCase();
      console.log('🔍 Manual code search:', searchCode);
      
      // Search tile by code
      const result = await getTileByCode(searchCode);

      if (result.success && result.tile) {
        const tileId = result.tile.id;
        
        // ═══════════════════════════════════════════════════════════════
        // WORKER AUTHORIZATION CHECK FOR MANUAL ENTRY
        // ═══════════════════════════════════════════════════════════════
        
        if (currentUser?.role === 'worker' && currentUser?.user_id) {
          console.log('🔒 Manual: Worker detected - verifying access...');
          
          const verification = await verifyWorkerTileAccess(tileId, currentUser.user_id);
          
          if (!verification.allowed) {
            console.error('🚫 Manual: Access denied:', verification.error);
            
            setIsLoading(false);
            setError(verification.error || 'Unauthorized tile access');
            setSuccessMessage(null);
            
            if (navigator.vibrate) {
              navigator.vibrate([200, 100, 200, 100, 200]);
            }
            
            return;
          }
          
          console.log('✅ Manual: Worker authorized');
        }
        
        // AUTHORIZED - PROCEED
        setIsLoading(false);
        console.log('✅ Tile found via manual code:', result.tile.name);
        
        setSuccessMessage(`✅ Found: ${result.tile.name}`);
        
        if (navigator.vibrate) {
          navigator.vibrate(200);
        }
        
        onScanSuccess({
          type: 'manual_entry',
          tileCode: searchCode,
          tileId: result.tile.id,
          tileName: result.tile.name,
          imageUrl: result.tile.imageUrl || result.tile.image_url
        });
        
      } else {
        console.error('❌ Manual search failed:', result.error);
        
        setIsLoading(false);
        setError(result.error || 'Tile not found. Please check the code.');
        setSuccessMessage(null);
        
        if (navigator.vibrate) {
          navigator.vibrate([200, 100, 200]);
        }
      }
      
    } catch (err: any) {
      console.error('❌ Manual search error:', err);
      
      setIsLoading(false);
      setError('Search failed. Please try again.');
      setSuccessMessage(null);
    }
  };

  // ═════════════════════════════════════════════════════════════════════════
  // LIFECYCLE EFFECTS
  // ═════════════════════════════════════════════════════════════════════════
  
  // Start/stop camera based on mode
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

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  // Prevent body scroll when modal is open
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  // ═════════════════════════════════════════════════════════════════════════
  // RENDER - MODERN GLASSMORPHISM UI
  // ═════════════════════════════════════════════════════════════════════════
  
  return (
    <div 
      className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[100] flex items-center justify-center p-0 sm:p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {/* Ambient Background */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-600/30 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-purple-600/20 blur-[150px] rounded-full pointer-events-none" />

      <div className="relative w-full h-full sm:h-auto sm:max-w-2xl sm:max-h-[90vh] flex flex-col overflow-hidden">
        
        {/* Animated border glow */}
        <div className="absolute -inset-1 bg-gradient-to-tr from-blue-500 via-cyan-400 to-purple-500 rounded-none sm:rounded-3xl opacity-30 blur-xl" />
        
        <div className="relative bg-black/60 backdrop-blur-2xl border border-white/10 rounded-none sm:rounded-3xl shadow-2xl w-full h-full sm:h-auto flex flex-col overflow-hidden">
        
          {/* ═══════════════════════════════════════════════════════════════ */}
          {/* HEADER */}
          {/* ═══════════════════════════════════════════════════════════════ */}
          
          <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-md border-b border-white/10 p-4 sm:p-6 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center">
                <Scan className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div>
                <h3 className="text-white text-lg sm:text-xl font-bold">QR Scanner</h3>
                <p className="text-white/50 text-xs sm:text-sm">Point & detect instantly</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white/70 hover:text-white hover:bg-white/10 rounded-full p-2 transition-colors touch-manipulation"
              aria-label="Close scanner"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>

          {/* ═══════════════════════════════════════════════════════════════ */}
          {/* WORKER SECURITY BADGE */}
          {/* ═══════════════════════════════════════════════════════════════ */}
          
          {currentUser?.role === 'worker' && (
            <div className="bg-blue-500/10 border-b border-blue-500/20 backdrop-blur-sm px-4 py-3 flex items-center gap-2 flex-shrink-0">
              <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                <Shield className="w-4 h-4 text-blue-300 flex-shrink-0" />
              </div>
              <p className="text-blue-200 text-xs sm:text-sm font-medium">
                Worker Mode Active • Access verification enabled
              </p>
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════════════ */}
          {/* MODE SELECTOR - Glassmorphism Tabs */}
          {/* ═══════════════════════════════════════════════════════════════ */}
          
          <div className="flex border-b border-white/10 flex-shrink-0 bg-white/5 backdrop-blur-sm">
            <button
              onClick={() => setScanMode('camera')}
              className={`flex-1 py-3 sm:py-4 px-2 sm:px-4 flex items-center justify-center gap-2 font-medium transition-all text-sm sm:text-base touch-manipulation relative ${
                scanMode === 'camera'
                  ? 'text-white'
                  : 'text-white/40 hover:text-white/70'
              }`}
              aria-label="Camera mode"
            >
              {scanMode === 'camera' && (
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/30 to-cyan-600/30 backdrop-blur-sm" />
              )}
              <Camera className="w-4 h-4 sm:w-5 sm:h-5 relative z-10" />
              <span className="hidden xs:inline relative z-10">Camera</span>
              {scanMode === 'camera' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-400 to-cyan-400" />
              )}
            </button>
            
            <button
              onClick={() => setScanMode('upload')}
              className={`flex-1 py-3 sm:py-4 px-2 sm:px-4 flex items-center justify-center gap-2 font-medium transition-all text-sm sm:text-base touch-manipulation relative ${
                scanMode === 'upload'
                  ? 'text-white'
                  : 'text-white/40 hover:text-white/70'
              }`}
              aria-label="Upload mode"
            >
              {scanMode === 'upload' && (
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600/30 to-pink-600/30 backdrop-blur-sm" />
              )}
              <Upload className="w-4 h-4 sm:w-5 sm:h-5 relative z-10" />
              <span className="hidden xs:inline relative z-10">Upload</span>
              {scanMode === 'upload' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-400 to-pink-400" />
              )}
            </button>
            
            <button
              onClick={() => setScanMode('manual')}
              className={`flex-1 py-3 sm:py-4 px-2 sm:px-4 flex items-center justify-center gap-2 font-medium transition-all text-sm sm:text-base touch-manipulation relative ${
                scanMode === 'manual'
                  ? 'text-white'
                  : 'text-white/40 hover:text-white/70'
              }`}
              aria-label="Manual entry mode"
            >
              {scanMode === 'manual' && (
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-600/30 to-blue-600/30 backdrop-blur-sm" />
              )}
              <Hash className="w-4 h-4 sm:w-5 sm:h-5 relative z-10" />
              <span className="hidden xs:inline relative z-10">Manual</span>
              {scanMode === 'manual' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-400" />
              )}
            </button>
          </div>

          {/* ═══════════════════════════════════════════════════════════════ */}
          {/* CONTENT AREA */}
          {/* ═══════════════════════════════════════════════════════════════ */}
          
          <div className="p-4 sm:p-6 overflow-y-auto flex-1">
            
            {/* ─────────────────────────────────────────────────────────── */}
            {/* SUCCESS MESSAGE */}
            {/* ─────────────────────────────────────────────────────────── */}
            
            {successMessage && (
              <div className="mb-4 p-3 sm:p-4 bg-emerald-500/20 border border-emerald-500/30 backdrop-blur-sm rounded-2xl flex items-start gap-3 animate-pulse">
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-5 h-5 text-emerald-400" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-emerald-300 font-semibold text-sm sm:text-base">Success!</p>
                  <p className="text-emerald-200/80 text-xs sm:text-sm break-words">{successMessage}</p>
                </div>
              </div>
            )}

            {/* ─────────────────────────────────────────────────────────── */}
            {/* ERROR MESSAGE */}
            {/* ─────────────────────────────────────────────────────────── */}
            
            {error && (
              <div className="mb-4 p-3 sm:p-4 bg-red-500/20 border border-red-500/30 backdrop-blur-sm rounded-2xl flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0">
                  <AlertCircle className="w-5 h-5 text-red-400" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-red-300 font-semibold text-sm sm:text-base">Error</p>
                  <p className="text-red-200/80 text-xs sm:text-sm break-words whitespace-pre-line">{error}</p>
                </div>
              </div>
            )}

            {/* ─────────────────────────────────────────────────────────── */}
            {/* LOADING STATE */}
            {/* ─────────────────────────────────────────────────────────── */}
            
            {isLoading && (
              <div className="mb-4 p-3 sm:p-4 bg-blue-500/20 border border-blue-500/30 backdrop-blur-sm rounded-2xl flex items-center justify-center gap-3">
                <Loader className="w-5 h-5 text-blue-400 animate-spin" />
                <p className="text-blue-200 font-medium text-sm sm:text-base">Processing...</p>
              </div>
            )}

            {/* ═══════════════════════════════════════════════════════════ */}
            {/* CAMERA MODE */}
            {/* ═══════════════════════════════════════════════════════════ */}
            
            {scanMode === 'camera' && (
              <div className="space-y-4">
                <div className="relative bg-black rounded-2xl overflow-hidden aspect-video border-2 border-white/10">
                  <video
                    ref={videoRef}
                    className="w-full h-full object-cover"
                    playsInline
                    muted
                    autoPlay
                  />
                  
                  {scanning && (
                    <>
                      {/* Scanning frame */}
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="relative w-64 h-64 sm:w-80 sm:h-80">
                          {/* Corner markers */}
                          <div className="absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 border-cyan-400 rounded-tl-2xl" />
                          <div className="absolute top-0 right-0 w-12 h-12 border-t-4 border-r-4 border-cyan-400 rounded-tr-2xl" />
                          <div className="absolute bottom-0 left-0 w-12 h-12 border-b-4 border-l-4 border-cyan-400 rounded-bl-2xl" />
                          <div className="absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 border-cyan-400 rounded-br-2xl" />
                          
                          {/* Scanning line */}
                          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-[scan_2s_ease-in-out_infinite]" />
                        </div>
                      </div>
                      
                      {/* Status badge */}
                      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-black/70 backdrop-blur-md text-white px-4 py-2 rounded-full border border-white/20">
                        <p className="text-xs sm:text-sm font-medium flex items-center gap-2">
                          <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
                          {successMessage ? '✅ Detected!' : 'Scanning...'}
                        </p>
                      </div>
                    </>
                  )}
                  
                  {/* Camera switch button */}
                  {isMobile && (
                    <button
                      onClick={switchCamera}
                      className="absolute bottom-4 right-4 bg-black/50 hover:bg-black/70 backdrop-blur-sm text-white p-3 rounded-full transition-colors touch-manipulation border border-white/20"
                      aria-label="Switch camera"
                    >
                      <RotateCcw className="w-5 h-5 sm:w-6 sm:h-6" />
                    </button>
                  )}
                </div>
                
                <canvas ref={canvasRef} className="hidden" />
                
                {/* Tips card */}
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-4 rounded-2xl">
                  <div className="flex items-center gap-2 mb-3">
                    <Zap className="w-5 h-5 text-cyan-400" />
                    <p className="text-white font-semibold text-sm sm:text-base">Scanning Tips</p>
                  </div>
                  <ul className="text-white/70 text-xs sm:text-sm space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="text-cyan-400 mt-0.5">•</span>
                      <span>Hold phone 6-8 inches from QR code</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-cyan-400 mt-0.5">•</span>
                      <span>Ensure good lighting conditions</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-cyan-400 mt-0.5">•</span>
                      <span>Keep camera steady for best results</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-cyan-400 mt-0.5">•</span>
                      <span>Align QR code within the frame corners</span>
                    </li>
                  </ul>
                </div>
              </div>
            )}

            {/* ═══════════════════════════════════════════════════════════ */}
            {/* UPLOAD MODE */}
            {/* ═══════════════════════════════════════════════════════════ */}
            
            {scanMode === 'upload' && (
              <div className="space-y-4">
                <div className="relative group cursor-pointer">
                  {/* Glow effect */}
                  <div className="absolute -inset-1 bg-gradient-to-tr from-purple-500 via-pink-400 to-blue-500 rounded-3xl opacity-20 blur-xl group-hover:opacity-40 transition-all duration-500" />
                  
                  <div className="relative border-2 border-dashed border-white/20 rounded-2xl p-8 sm:p-12 text-center hover:border-white/40 transition-colors bg-white/5 backdrop-blur-sm">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="qr-upload-input"
                    />
                    <label
                      htmlFor="qr-upload-input"
                      className="cursor-pointer flex flex-col items-center gap-4"
                    >
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center shadow-[0_0_40px_rgba(168,85,247,0.3)] group-hover:scale-110 transition-transform">
                        {isMobile ? (
                          <ImageIcon className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                        ) : (
                          <Upload className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                        )}
                      </div>
                      <div>
                        <p className="text-white font-semibold text-base sm:text-lg mb-2">
                          {isMobile ? '📁 Choose from Gallery' : 'Upload QR Image'}
                        </p>
                        <p className="text-white/50 text-xs sm:text-sm">
                          {isMobile ? 'Select a photo containing QR code' : 'Click to select file from device'}
                        </p>
                      </div>
                    </label>
                  </div>
                </div>
                
                <canvas ref={canvasRef} className="hidden" />
                
                {/* Tip */}
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-4 rounded-2xl">
                  <p className="text-white/70 text-xs sm:text-sm">
                    💡 <span className="text-white font-medium">Tip:</span> {isMobile 
                      ? 'Choose a clear photo of the QR code from your gallery for best results.' 
                      : 'Upload a high-quality image with good lighting for accurate detection.'}
                  </p>
                </div>
              </div>
            )}

            {/* ═══════════════════════════════════════════════════════════ */}
            {/* MANUAL MODE */}
            {/* ═══════════════════════════════════════════════════════════ */}
            
            {scanMode === 'manual' && (
              <form onSubmit={handleManualSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-white/80 mb-3">
                    Enter Tile Code
                  </label>
                  <input
                    type="text"
                    value={manualCode}
                    onChange={(e) => setManualCode(e.target.value.toUpperCase())}
                    placeholder="e.g., MAR60X60WH"
                    className="w-full px-4 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 text-white placeholder-white/40 font-mono text-base sm:text-lg touch-manipulation transition-all"
                    autoFocus
                    autoComplete="off"
                    autoCapitalize="characters"
                    disabled={isLoading}
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white py-4 rounded-2xl font-semibold transition-all text-sm sm:text-base touch-manipulation disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-[0_0_30px_rgba(34,211,238,0.3)] flex items-center justify-center gap-2"
                  disabled={!manualCode.trim() || isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader className="w-5 h-5 animate-spin" />
                      Searching...
                    </>
                  ) : (
                    <>
                      <Hash className="w-5 h-5" />
                      Search Tile
                    </>
                  )}
                </button>

                {currentUser?.role === 'worker' && (
                  <div className="bg-orange-500/10 border border-orange-500/30 backdrop-blur-sm p-4 rounded-2xl">
                    <p className="text-orange-300 text-xs sm:text-sm font-semibold mb-2 flex items-center gap-2">
                      <Shield className="w-4 h-4" />
                      Worker Authorization Active
                    </p>
                    <p className="text-orange-200/80 text-xs sm:text-sm">
                      You can only search tiles from your assigned showroom. Unauthorized attempts will be logged.
                    </p>
                  </div>
                )}

                <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-4 rounded-2xl">
                  <p className="text-white font-semibold text-xs sm:text-sm mb-3 flex items-center gap-2">
                    <Hash className="w-4 h-4 text-cyan-400" />
                    Where to find tile code?
                  </p>
                  <ul className="text-white/70 text-xs sm:text-sm space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="text-cyan-400 mt-0.5">•</span>
                      <span>Check the label on the tile box</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-cyan-400 mt-0.5">•</span>
                      <span>Look for code near the QR sticker</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-cyan-400 mt-0.5">•</span>
                      <span>Ask showroom staff for the code</span>
                    </li>
                  </ul>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Custom CSS Animation */}
      <style>{`
        @keyframes scan {
          0% { top: 0%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
        
        @media (min-width: 400px) {
          .xs\:inline {
            display: inline;
          }
        }
      `}</style>
    </div>
  );
};

export default QRScanner;