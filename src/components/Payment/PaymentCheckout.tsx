
// // import React, { useEffect, useState } from 'react';
// // import { CheckCircle, XCircle, Loader } from 'lucide-react';
// // import { verifyPaymentBackend } from '../../lib/backendAPI';
// // import type { 
// //   RazorpayCheckoutOptions, 
// //   RazorpaySuccessResponse, 
// //   RazorpayErrorResponse 
// // } from '../../types/payment.types';
// // import { enableAllSellersWorkers } from '../../lib/firebaseutils';
// // interface PaymentCheckoutProps {
// //   checkoutOptions: RazorpayCheckoutOptions;
// //   paymentId: string;
// //   planId: string;
// //   sellerId: string;
// //   onSuccess?: () => void;
// //   onError?: (error: string) => void;
// //   userToken: string; // ✅ REQUIRED (no more useAuth)
// // }

// // export const PaymentCheckout: React.FC<PaymentCheckoutProps> = ({
// //   checkoutOptions,
// //   paymentId,
// //   planId,
// //   sellerId,
// //   onSuccess,
// //   onError,
// //   userToken
// // }) => {
// //   // ✅ REMOVED: const { currentUser } = useAuth();
// //   const [loading, setLoading] = useState(true);
// //   const [processing, setProcessing] = useState(false);
// //   const [error, setError] = useState<string | null>(null);
// //   const [success, setSuccess] = useState(false);
// //   const [processingStep, setProcessingStep] = useState('');
// //   const [countdown, setCountdown] = useState(5);

// //   useEffect(() => {
// //     console.log('═══════════════════════════════════════════════════════');
// //     console.log('💳 PaymentCheckout Component Mounted');
// //     console.log('═══════════════════════════════════════════════════════');
// //     console.log('📋 Payment Details:', {
// //       paymentId: paymentId.substring(0, 12) + '...',
// //       planId: planId.substring(0, 12) + '...',
// //       sellerId: sellerId.substring(0, 10) + '...',
// //       amount: checkoutOptions.amount / 100,
// //       hasToken: !!userToken
// //     });
    
// //     initializeRazorpay();
    
// //     return () => {
// //       console.log('🔌 PaymentCheckout unmounted');
// //       localStorage.removeItem('payment_processing');
// //     };
// //   }, []);

// //   const loadRazorpayScript = (): Promise<boolean> => {
// //     return new Promise((resolve) => {
// //       console.log('🔄 Step 1/3: Loading Razorpay SDK...');
      
// //       if (window.Razorpay) {
// //         console.log('✅ Razorpay script already loaded');
// //         resolve(true);
// //         return;
// //       }

// //       const script = document.createElement('script');
// //       script.src = 'https://checkout.razorpay.com/v1/checkout.js';
// //       script.onload = () => {
// //         console.log('✅ Razorpay script loaded successfully');
// //         resolve(true);
// //       };
// //       script.onerror = () => {
// //         console.error('❌ Failed to load Razorpay script');
// //         resolve(false);
// //       };
// //       document.body.appendChild(script);
// //     });
// //   };

// //   const initializeRazorpay = async () => {
// //     try {
// //       const scriptLoaded = await loadRazorpayScript();
      
// //       if (!scriptLoaded) {
// //         throw new Error('Failed to load Razorpay SDK');
// //       }
      
// //       console.log('✅ Step 1/3: Razorpay SDK loaded');
// //       console.log('🔄 Step 2/3: Preparing checkout options...');
      
// //       await new Promise(resolve => setTimeout(resolve, 500));
      
// //       console.log('✅ Step 2/3: Options ready');
// //       console.log('🔄 Step 3/3: Opening payment window...');
      
// //       openRazorpayCheckout();
      
// //     } catch (err: any) {
// //       console.error('❌ Initialization error:', err);
// //       const errorMsg = err.message || 'Failed to initialize payment';
// //       setError(errorMsg);
// //       setLoading(false);
// //       if (onError) onError(errorMsg);
// //     }
// //   };

// //   const openRazorpayCheckout = () => {
// //     try {
// //       console.log('🔓 Opening Razorpay checkout window...');
      
// //       const options: RazorpayCheckoutOptions = {
// //         ...checkoutOptions,
// //         handler: handlePaymentSuccess,
// //         modal: {
// //           ...checkoutOptions.modal,
// //           ondismiss: handlePaymentDismiss,
// //           confirm_close: true
// //         }
// //       };
      
// //       console.log('📋 Checkout Options:', {
// //         order_id: options.order_id,
// //         amount: options.amount,
// //         currency: options.currency,
// //         name: options.name
// //       });
      
// //       const razorpay = new window.Razorpay(options);
// //       razorpay.on('payment.failed', handlePaymentFailure);
// //       razorpay.open();
      
// //       console.log('✅ Step 3/3: Payment window opened successfully');
// //       setLoading(false);
      
// //     } catch (err: any) {
// //       console.error('❌ Error opening checkout:', err);
// //       setError('Failed to open payment window');
// //       setLoading(false);
// //       if (onError) onError('Failed to open payment window');
// //     }
// //   };

// //   const handlePaymentSuccess = async (response: RazorpaySuccessResponse) => {
// //     try {
// //       console.log('═══════════════════════════════════════════════════════');
// //       console.log('✅ PAYMENT SUCCESS RECEIVED FROM RAZORPAY');
// //       console.log('═══════════════════════════════════════════════════════');
// //       console.log('📋 Razorpay Response:', {
// //         razorpay_payment_id: response.razorpay_payment_id.substring(0, 15) + '...',
// //         razorpay_order_id: response.razorpay_order_id.substring(0, 15) + '...',
// //         razorpay_signature: response.razorpay_signature.substring(0, 15) + '...'
// //       });
      
// //       setProcessing(true);
// //       localStorage.setItem('payment_processing', 'true');
      
// //       // ✅ VALIDATION: Token is required
// //       if (!userToken) {
// //         throw new Error('Authentication token missing. Please refresh and try again.');
// //       }

// //       // ✅ STEP 1: Verify Payment
// //       console.log('🔄 Step 1/3: Verifying payment with backend...');
// //       setProcessingStep('Verifying payment...');

// //       const verifyResult = await verifyPaymentBackend(
// //         paymentId,
// //         response.razorpay_order_id,
// //         response.razorpay_payment_id,
// //         response.razorpay_signature,
// //         userToken // ✅ USE PROP TOKEN
// //       );

// //       if (!verifyResult.success) {
// //         throw new Error('Payment verification failed');
// //       }

// //       console.log('✅ Step 1/3: Payment verified successfully');

// //       // ✅ STEP 2: Activate Subscription
// //       console.log('🔄 Step 2/3: Activating subscription...');
// //       setProcessingStep('Activating subscription...');
      
// //       // Backend already created subscription in verify endpoint
// //       await new Promise(resolve => setTimeout(resolve, 1000));
      
// //       console.log('✅ Step 2/3: Subscription activated');

// //       // ✅ STEP 3: Signal Success & Wait for Banner Update
// //       console.log('🔄 Step 3/3: Finalizing...');
// //       setProcessingStep('Updating your dashboard...');
      
// //       console.log('✅ Step 3/3: Payment process completed successfully');
// //       console.log('═══════════════════════════════════════════════════════');
      
// //       setSuccess(true);
// //       setProcessing(false);
// //       setProcessingStep('');
      
// //       // ✅ CRITICAL: Signal for banner refresh
// //       localStorage.setItem('plan_just_purchased', Date.now().toString());
// //       localStorage.removeItem('payment_processing');
      
// //       console.log('📞 Calling parent success handler in 5 seconds...');
// //       console.log('⏰ This delay allows Firestore listeners to catch the update');
      
// //       // ✅ NEW: Countdown for user feedback
// //       let timeLeft = 5;
// //       const countdownInterval = setInterval(() => {
// //         timeLeft--;
// //         setCountdown(timeLeft);
// //         if (timeLeft <= 0) {
// //           clearInterval(countdownInterval);
// //         }
// //       }, 1000);
      
// //       // ✅ INCREASED DELAY: 2s → 5s (gives Firestore time to sync)
// //       setTimeout(() => {
// //         if (onSuccess) {
// //           console.log('✅ Executing parent success callback...');
// //           onSuccess();
// //         }
// //       }, 5000);
      
// //     } catch (err: any) {
// //       console.error('❌ Payment processing error:', err);
      
// //       const errorMsg = err.message || 'Payment processing failed';
// //       setError(errorMsg);
// //       setProcessing(false);
// //       setProcessingStep('');
      
// //       localStorage.removeItem('payment_processing');
      
// //       if (onError) onError(errorMsg);
// //     }
// //   };

// //   const handlePaymentFailure = async (response: RazorpayErrorResponse) => {
// //     console.error('═══════════════════════════════════════════════════════');
// //     console.error('❌ PAYMENT FAILED');
// //     console.error('═══════════════════════════════════════════════════════');
// //     console.error('Error Response:', response);
    
// //     const errorMsg = response.error?.description || 'Payment failed';
// //     setError(errorMsg);
// //     setLoading(false);
    
// //     localStorage.removeItem('payment_processing');
    
// //     if (onError) onError(errorMsg);
// //   };

// //   const handlePaymentDismiss = async () => {
// //     console.log('⚠️ Payment window dismissed by user');
    
// //     const errorMsg = 'Payment cancelled by user';
// //     setError(errorMsg);
// //     setLoading(false);
    
// //     localStorage.removeItem('payment_processing');
    
// //     if (onError) onError(errorMsg);
// //   };

// //   // ═══════════════════════════════════════════════════════════════
// //   // RENDER - SUCCESS STATE (NEW: With Countdown)
// //   // ═══════════════════════════════════════════════════════════════
  
// //   if (success) {
// //     return (
// //       <div className="fixed inset-0 z-[9999] bg-black bg-opacity-75 flex items-center justify-center p-4">
// //         <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
// //           <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4 animate-bounce" />
// //           <h2 className="text-2xl font-bold text-gray-800 mb-2">Payment Successful! 🎉</h2>
// //           <p className="text-gray-600 mb-4">Your subscription has been activated</p>
          
// //           {/* ✅ NEW: Countdown Display */}
// //           <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4 mb-4">
// //             <p className="text-sm text-green-800 mb-2">
// //               🔄 Updating your dashboard...
// //             </p>
// //             <div className="flex items-center justify-center gap-2">
// //               <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-green-600"></div>
// //               <span className="text-green-700 font-bold">
// //                 {countdown}s
// //               </span>
// //             </div>
// //           </div>
          
// //           <p className="text-xs text-gray-500">Please wait while we refresh your plan status</p>
// //         </div>
// //       </div>
// //     );
// //   }

// //   // ═══════════════════════════════════════════════════════════════
// //   // RENDER - ERROR STATE
// //   // ═══════════════════════════════════════════════════════════════
  
// //   if (error) {
// //     return (
// //       <div className="fixed inset-0 z-[9999] bg-black bg-opacity-75 flex items-center justify-center p-4">
// //         <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
// //           <XCircle className="w-20 h-20 text-red-500 mx-auto mb-4" />
// //           <h2 className="text-2xl font-bold text-gray-800 mb-4">Payment Failed</h2>
// //           <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 mb-6">
// //             <p className="text-sm text-red-700">{error}</p>
// //           </div>
// //           <button
// //             onClick={() => {
// //               setError(null);
// //               if (onError) onError(error);
// //             }}
// //             className="w-full bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 font-medium transition-all"
// //           >
// //             Close & Retry
// //           </button>
// //         </div>
// //       </div>
// //     );
// //   }

// //   // ═══════════════════════════════════════════════════════════════
// //   // RENDER - PROCESSING STATE
// //   // ═══════════════════════════════════════════════════════════════
  
// //   if (processing) {
// //     return (
// //       <div className="fixed inset-0 z-[9999] bg-black bg-opacity-75 flex items-center justify-center p-4">
// //         <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
// //           <Loader className="w-16 h-16 text-green-600 mx-auto mb-6 animate-spin" />
// //           <h2 className="text-2xl font-bold text-gray-800 mb-2">Processing Payment</h2>
// //           <p className="text-gray-600 mb-6">Please wait...</p>
// //           <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
// //             <p className="flex items-center justify-center gap-2">
// //               <Loader className="w-4 h-4 animate-spin" />
// //               <span className="font-medium text-sm">{processingStep}</span>
// //             </p>
// //           </div>
// //           <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
// //             <p className="text-xs text-yellow-800 font-medium">⚠️ Do not close this window</p>
// //           </div>
// //         </div>
// //       </div>
// //     );
// //   }

// //   // ═══════════════════════════════════════════════════════════════
// //   // RENDER - LOADING STATE
// //   // ═══════════════════════════════════════════════════════════════
  
// //   return (
// //     <div className="fixed inset-0 z-[9999] bg-black bg-opacity-75 flex items-center justify-center p-4">
// //       <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
// //         <div className="text-center mb-6">
// //           <div className="text-5xl mb-4">🔒</div>
// //           <h2 className="text-xl font-bold text-gray-800 mb-2">
// //             {loading ? 'Opening Payment Window' : 'Payment Window Opened'}
// //           </h2>
// //           <p className="text-sm text-gray-600">
// //             {loading ? 'Please wait...' : 'Complete payment in Razorpay window'}
// //           </p>
// //         </div>

// //         {loading && (
// //           <div className="mb-6">
// //             <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-green-600 mx-auto mb-4"></div>
// //           </div>
// //         )}

// //         <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
// //           <div className="flex items-center justify-center gap-2 text-green-800 font-semibold mb-2">
// //             <span className="text-2xl">🛡️</span>
// //             <span>Secure Payment Gateway</span>
// //           </div>
// //           <p className="text-xs text-green-700 text-center">Powered by Razorpay</p>
// //         </div>

// //         <div className="bg-gray-50 rounded-xl p-4">
// //           <h3 className="font-semibold text-gray-800 mb-3 text-sm">Payment Amount:</h3>
// //           <div className="text-center">
// //             <span className="font-bold text-purple-600 text-3xl">
// //               ₹{(checkoutOptions.amount / 100).toLocaleString('en-IN')}
// //             </span>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // console.log('✅ PaymentCheckout - PRODUCTION v6.0 (Token via Props, No useAuth)'); 
// import React, { useEffect, useState } from 'react';
// import { CheckCircle, XCircle, Loader } from 'lucide-react';
// import { verifyPaymentBackend } from '../../lib/backendAPI';
// import { enableAllSellersWorkers } from '../../lib/firebaseutils'; // ✅ ADDED: Import the worker enable function
// import type { 
//   RazorpayCheckoutOptions, 
//   RazorpaySuccessResponse, 
//   RazorpayErrorResponse 
// } from '../../types/payment.types';

// interface PaymentCheckoutProps {
//   checkoutOptions: RazorpayCheckoutOptions;
//   paymentId: string;
//   planId: string;
//   sellerId: string;
//   onSuccess?: () => void;
//   onError?: (error: string) => void;
//   userToken: string; // ✅ REQUIRED (no more useAuth)
// }

// export const PaymentCheckout: React.FC<PaymentCheckoutProps> = ({
//   checkoutOptions,
//   paymentId,
//   planId,
//   sellerId,
//   onSuccess,
//   onError,
//   userToken
// }) => {
//   // ✅ REMOVED: const { currentUser } = useAuth();
//   const [loading, setLoading] = useState(true);
//   const [processing, setProcessing] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [success, setSuccess] = useState(false);
//   const [processingStep, setProcessingStep] = useState('');
//   const [countdown, setCountdown] = useState(5);

//   useEffect(() => {
//     console.log('═══════════════════════════════════════════════════════');
//     console.log('💳 PaymentCheckout Component Mounted');
//     console.log('═══════════════════════════════════════════════════════');
//     console.log('📋 Payment Details:', {
//       paymentId: paymentId.substring(0, 12) + '...',
//       planId: planId.substring(0, 12) + '...',
//       sellerId: sellerId.substring(0, 10) + '...',
//       amount: checkoutOptions.amount / 100,
//       hasToken: !!userToken
//     });
    
//     initializeRazorpay();
    
//     return () => {
//       console.log('🔌 PaymentCheckout unmounted');
//       localStorage.removeItem('payment_processing');
//     };
//   }, []);

//   const loadRazorpayScript = (): Promise<boolean> => {
//     return new Promise((resolve) => {
//       console.log('🔄 Step 1/3: Loading Razorpay SDK...');
      
//       if (window.Razorpay) {
//         console.log('✅ Razorpay script already loaded');
//         resolve(true);
//         return;
//       }

//       const script = document.createElement('script');
//       script.src = 'https://checkout.razorpay.com/v1/checkout.js';
//       script.onload = () => {
//         console.log('✅ Razorpay script loaded successfully');
//         resolve(true);
//       };
//       script.onerror = () => {
//         console.error('❌ Failed to load Razorpay script');
//         resolve(false);
//       };
//       document.body.appendChild(script);
//     });
//   };

//   const initializeRazorpay = async () => {
//     try {
//       const scriptLoaded = await loadRazorpayScript();
      
//       if (!scriptLoaded) {
//         throw new Error('Failed to load Razorpay SDK');
//       }
      
//       console.log('✅ Step 1/3: Razorpay SDK loaded');
//       console.log('🔄 Step 2/3: Preparing checkout options...');
      
//       await new Promise(resolve => setTimeout(resolve, 500));
      
//       console.log('✅ Step 2/3: Options ready');
//       console.log('🔄 Step 3/3: Opening payment window...');
      
//       openRazorpayCheckout();
      
//     } catch (err: any) {
//       console.error('❌ Initialization error:', err);
//       const errorMsg = err.message || 'Failed to initialize payment';
//       setError(errorMsg);
//       setLoading(false);
//       if (onError) onError(errorMsg);
//     }
//   };

//   const openRazorpayCheckout = () => {
//     try {
//       console.log('🔓 Opening Razorpay checkout window...');
      
//       const options: RazorpayCheckoutOptions = {
//         ...checkoutOptions,
//         handler: handlePaymentSuccess,
//         modal: {
//           ...checkoutOptions.modal,
//           ondismiss: handlePaymentDismiss,
//           confirm_close: true
//         }
//       };
      
//       console.log('📋 Checkout Options:', {
//         order_id: options.order_id,
//         amount: options.amount,
//         currency: options.currency,
//         name: options.name
//       });
      
//       const razorpay = new window.Razorpay(options);
//       razorpay.on('payment.failed', handlePaymentFailure);
//       razorpay.open();
      
//       console.log('✅ Step 3/3: Payment window opened successfully');
//       setLoading(false);
      
//     } catch (err: any) {
//       console.error('❌ Error opening checkout:', err);
//       setError('Failed to open payment window');
//       setLoading(false);
//       if (onError) onError('Failed to open payment window');
//     }
//   };

//   const handlePaymentSuccess = async (response: RazorpaySuccessResponse) => {
//     try {
//       console.log('═══════════════════════════════════════════════════════');
//       console.log('✅ PAYMENT SUCCESS RECEIVED FROM RAZORPAY');
//       console.log('═══════════════════════════════════════════════════════');
//       console.log('📋 Razorpay Response:', {
//         razorpay_payment_id: response.razorpay_payment_id.substring(0, 15) + '...',
//         razorpay_order_id: response.razorpay_order_id.substring(0, 15) + '...',
//         razorpay_signature: response.razorpay_signature.substring(0, 15) + '...'
//       });
      
//       setProcessing(true);
//       localStorage.setItem('payment_processing', 'true');
      
//       // ✅ VALIDATION: Token is required
//       if (!userToken) {
//         throw new Error('Authentication token missing. Please refresh and try again.');
//       }

//       // ✅ STEP 1: Verify Payment
//       console.log('🔄 Step 1/3: Verifying payment with backend...');
//       setProcessingStep('Verifying payment...');

//       const verifyResult = await verifyPaymentBackend(
//         paymentId,
//         response.razorpay_order_id,
//         response.razorpay_payment_id,
//         response.razorpay_signature,
//         userToken // ✅ USE PROP TOKEN
//       );

//       if (!verifyResult.success) {
//         throw new Error('Payment verification failed');
//       }

//       console.log('✅ Step 1/3: Payment verified successfully');

//       // ✅ STEP 2: Activate Subscription & Unlock Workers
//       console.log('🔄 Step 2/3: Activating subscription...');
//       setProcessingStep('Activating plan & unlocking workers...');
      
//       // Backend already created subscription in verify endpoint
//       await new Promise(resolve => setTimeout(resolve, 1000));
      
//       // ✅ ADDED: Force enable all workers for this seller since payment is now successful
//       console.log('🔓 Unlocking seller workers...');
//       await enableAllSellersWorkers(sellerId);
      
//       console.log('✅ Step 2/3: Subscription activated and workers unlocked');

//       // ✅ STEP 3: Signal Success & Wait for Banner Update
//       console.log('🔄 Step 3/3: Finalizing...');
//       setProcessingStep('Updating your dashboard...');
      
//       console.log('✅ Step 3/3: Payment process completed successfully');
//       console.log('═══════════════════════════════════════════════════════');
      
//       setSuccess(true);
//       setProcessing(false);
//       setProcessingStep('');
      
//       // ✅ CRITICAL: Signal for banner refresh
//       localStorage.setItem('plan_just_purchased', Date.now().toString());
//       localStorage.removeItem('payment_processing');
      
//       console.log('📞 Calling parent success handler in 5 seconds...');
//       console.log('⏰ This delay allows Firestore listeners to catch the update');
      
//       // ✅ NEW: Countdown for user feedback
//       let timeLeft = 5;
//       const countdownInterval = setInterval(() => {
//         timeLeft--;
//         setCountdown(timeLeft);
//         if (timeLeft <= 0) {
//           clearInterval(countdownInterval);
//         }
//       }, 1000);
      
//       // ✅ INCREASED DELAY: 2s → 5s (gives Firestore time to sync)
//       setTimeout(() => {
//         if (onSuccess) {
//           console.log('✅ Executing parent success callback...');
//           onSuccess();
//         }
//       }, 5000);
      
//     } catch (err: any) {
//       console.error('❌ Payment processing error:', err);
      
//       const errorMsg = err.message || 'Payment processing failed';
//       setError(errorMsg);
//       setProcessing(false);
//       setProcessingStep('');
      
//       localStorage.removeItem('payment_processing');
      
//       if (onError) onError(errorMsg);
//     }
//   };

//   const handlePaymentFailure = async (response: RazorpayErrorResponse) => {
//     console.error('═══════════════════════════════════════════════════════');
//     console.error('❌ PAYMENT FAILED');
//     console.error('═══════════════════════════════════════════════════════');
//     console.error('Error Response:', response);
    
//     const errorMsg = response.error?.description || 'Payment failed';
//     setError(errorMsg);
//     setLoading(false);
    
//     localStorage.removeItem('payment_processing');
    
//     if (onError) onError(errorMsg);
//   };

//   const handlePaymentDismiss = async () => {
//     console.log('⚠️ Payment window dismissed by user');
    
//     const errorMsg = 'Payment cancelled by user';
//     setError(errorMsg);
//     setLoading(false);
    
//     localStorage.removeItem('payment_processing');
    
//     if (onError) onError(errorMsg);
//   };

//   // ═══════════════════════════════════════════════════════════════
//   // RENDER - SUCCESS STATE (NEW: With Countdown)
//   // ═══════════════════════════════════════════════════════════════
  
//   if (success) {
//     return (
//       <div className="fixed inset-0 z-[9999] bg-black bg-opacity-75 flex items-center justify-center p-4">
//         <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
//           <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4 animate-bounce" />
//           <h2 className="text-2xl font-bold text-gray-800 mb-2">Payment Successful! 🎉</h2>
//           <p className="text-gray-600 mb-4">Your subscription has been activated</p>
          
//           {/* ✅ NEW: Countdown Display */}
//           <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4 mb-4">
//             <p className="text-sm text-green-800 mb-2">
//               🔄 Updating your dashboard...
//             </p>
//             <div className="flex items-center justify-center gap-2">
//               <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-green-600"></div>
//               <span className="text-green-700 font-bold">
//                 {countdown}s
//               </span>
//             </div>
//           </div>
          
//           <p className="text-xs text-gray-500">Please wait while we refresh your plan status</p>
//         </div>
//       </div>
//     );
//   }

//   // ═══════════════════════════════════════════════════════════════
//   // RENDER - ERROR STATE
//   // ═══════════════════════════════════════════════════════════════
  
//   if (error) {
//     return (
//       <div className="fixed inset-0 z-[9999] bg-black bg-opacity-75 flex items-center justify-center p-4">
//         <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
//           <XCircle className="w-20 h-20 text-red-500 mx-auto mb-4" />
//           <h2 className="text-2xl font-bold text-gray-800 mb-4">Payment Failed</h2>
//           <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 mb-6">
//             <p className="text-sm text-red-700">{error}</p>
//           </div>
//           <button
//             onClick={() => {
//               setError(null);
//               if (onError) onError(error);
//             }}
//             className="w-full bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 font-medium transition-all"
//           >
//             Close & Retry
//           </button>
//         </div>
//       </div>
//     );
//   }

//   // ═══════════════════════════════════════════════════════════════
//   // RENDER - PROCESSING STATE
//   // ═══════════════════════════════════════════════════════════════
  
//   if (processing) {
//     return (
//       <div className="fixed inset-0 z-[9999] bg-black bg-opacity-75 flex items-center justify-center p-4">
//         <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
//           <Loader className="w-16 h-16 text-green-600 mx-auto mb-6 animate-spin" />
//           <h2 className="text-2xl font-bold text-gray-800 mb-2">Processing Payment</h2>
//           <p className="text-gray-600 mb-6">Please wait...</p>
//           <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
//             <p className="flex items-center justify-center gap-2">
//               <Loader className="w-4 h-4 animate-spin" />
//               <span className="font-medium text-sm">{processingStep}</span>
//             </p>
//           </div>
//           <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
//             <p className="text-xs text-yellow-800 font-medium">⚠️ Do not close this window</p>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // ═══════════════════════════════════════════════════════════════
//   // RENDER - LOADING STATE
//   // ═══════════════════════════════════════════════════════════════
  
//   return (
//     <div className="fixed inset-0 z-[9999] bg-black bg-opacity-75 flex items-center justify-center p-4">
//       <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
//         <div className="text-center mb-6">
//           <div className="text-5xl mb-4">🔒</div>
//           <h2 className="text-xl font-bold text-gray-800 mb-2">
//             {loading ? 'Opening Payment Window' : 'Payment Window Opened'}
//           </h2>
//           <p className="text-sm text-gray-600">
//             {loading ? 'Please wait...' : 'Complete payment in Razorpay window'}
//           </p>
//         </div>

//         {loading && (
//           <div className="mb-6">
//             <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-green-600 mx-auto mb-4"></div>
//           </div>
//         )}

//         <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
//           <div className="flex items-center justify-center gap-2 text-green-800 font-semibold mb-2">
//             <span className="text-2xl">🛡️</span>
//             <span>Secure Payment Gateway</span>
//           </div>
//           <p className="text-xs text-green-700 text-center">Powered by Razorpay</p>
//         </div>

//         <div className="bg-gray-50 rounded-xl p-4">
//           <h3 className="font-semibold text-gray-800 mb-3 text-sm">Payment Amount:</h3>
//           <div className="text-center">
//             <span className="font-bold text-purple-600 text-3xl">
//               ₹{(checkoutOptions.amount / 100).toLocaleString('en-IN')}
//             </span>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// console.log('✅ PaymentCheckout - PRODUCTION v6.1 (Worker Unlock Fixed)'); 
import React, { useEffect, useState } from 'react';
import { CheckCircle, XCircle, Loader } from 'lucide-react';
import { verifyPaymentBackend } from '../../lib/backendAPI';
import { enableAllSellersWorkers } from '../../lib/firebaseutils';
import type { 
  RazorpayCheckoutOptions, 
  RazorpaySuccessResponse, 
  RazorpayErrorResponse 
} from '../../types/payment.types';

interface PaymentCheckoutProps {
  checkoutOptions: RazorpayCheckoutOptions;
  paymentId: string;
  planId: string;
  sellerId: string;
  onSuccess?: () => void;
  onError?: (error: string) => void;
  userToken: string; // ✅ REQUIRED (no more useAuth)
}

export const PaymentCheckout: React.FC<PaymentCheckoutProps> = ({
  checkoutOptions,
  paymentId,
  planId,
  sellerId,
  onSuccess,
  onError,
  userToken
}) => {
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [processingStep, setProcessingStep] = useState('');
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    console.log('═══════════════════════════════════════════════════════');
    console.log('💳 PaymentCheckout Component Mounted');
    console.log('═══════════════════════════════════════════════════════');
    console.log('📋 Payment Details:', {
      paymentId: paymentId.substring(0, 12) + '...',
      planId: planId.substring(0, 12) + '...',
      sellerId: sellerId.substring(0, 10) + '...',
      amount: checkoutOptions.amount / 100,
      hasToken: !!userToken
    });
    
    initializeRazorpay();
    
    return () => {
      console.log('🔌 PaymentCheckout unmounted');
      localStorage.removeItem('payment_processing');
    };
  }, []);

  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      console.log('🔄 Step 1/3: Loading Razorpay SDK...');
      
      if (window.Razorpay) {
        console.log('✅ Razorpay script already loaded');
        resolve(true);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => {
        console.log('✅ Razorpay script loaded successfully');
        resolve(true);
      };
      script.onerror = () => {
        console.error('❌ Failed to load Razorpay script');
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };

  const initializeRazorpay = async () => {
    try {
      const scriptLoaded = await loadRazorpayScript();
      
      if (!scriptLoaded) {
        throw new Error('Failed to load Razorpay SDK');
      }
      
      console.log('✅ Step 1/3: Razorpay SDK loaded');
      console.log('🔄 Step 2/3: Preparing checkout options...');
      
      await new Promise(resolve => setTimeout(resolve, 500));
      
      console.log('✅ Step 2/3: Options ready');
      console.log('🔄 Step 3/3: Opening payment window...');
      
      openRazorpayCheckout();
      
    } catch (err: any) {
      console.error('❌ Initialization error:', err);
      const errorMsg = err.message || 'Failed to initialize payment';
      setError(errorMsg);
      setLoading(false);
      if (onError) onError(errorMsg);
    }
  };

  const openRazorpayCheckout = () => {
    try {
      console.log('🔓 Opening Razorpay checkout window...');
      
      const options: RazorpayCheckoutOptions = {
        ...checkoutOptions,
        handler: handlePaymentSuccess,
        modal: {
          ...checkoutOptions.modal,
          ondismiss: handlePaymentDismiss,
          confirm_close: true
        }
      };
      
      console.log('📋 Checkout Options:', {
        order_id: options.order_id,
        amount: options.amount,
        currency: options.currency,
        name: options.name
      });
      
      const razorpay = new window.Razorpay(options);
      razorpay.on('payment.failed', handlePaymentFailure);
      razorpay.open();
      
      console.log('✅ Step 3/3: Payment window opened successfully');
      setLoading(false);
      
    } catch (err: any) {
      console.error('❌ Error opening checkout:', err);
      setError('Failed to open payment window');
      setLoading(false);
      if (onError) onError('Failed to open payment window');
    }
  };

  const handlePaymentSuccess = async (response: RazorpaySuccessResponse) => {
    try {
      console.log('═══════════════════════════════════════════════════════');
      console.log('✅ PAYMENT SUCCESS RECEIVED FROM RAZORPAY');
      console.log('═══════════════════════════════════════════════════════');
      console.log('📋 Razorpay Response:', {
        razorpay_payment_id: response.razorpay_payment_id.substring(0, 15) + '...',
        razorpay_order_id: response.razorpay_order_id.substring(0, 15) + '...',
        razorpay_signature: response.razorpay_signature.substring(0, 15) + '...'
      });
      
      setProcessing(true);
      localStorage.setItem('payment_processing', 'true');
      
      if (!userToken) {
        throw new Error('Authentication token missing. Please refresh and try again.');
      }

      console.log('🔄 Step 1/3: Verifying payment with backend...');
      setProcessingStep('Verifying payment...');

      const verifyResult = await verifyPaymentBackend(
        paymentId,
        response.razorpay_order_id,
        response.razorpay_payment_id,
        response.razorpay_signature,
        userToken
      );

      if (!verifyResult.success) {
        throw new Error('Payment verification failed');
      }

      console.log('✅ Step 1/3: Payment verified successfully');

      console.log('🔄 Step 2/3: Activating subscription...');
      setProcessingStep('Activating plan & unlocking workers...');
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('🔓 Unlocking seller workers...');
      await enableAllSellersWorkers(sellerId);
      
      console.log('✅ Step 2/3: Subscription activated and workers unlocked');

      console.log('🔄 Step 3/3: Finalizing...');
      setProcessingStep('Updating your dashboard...');
      
      console.log('✅ Step 3/3: Payment process completed successfully');
      console.log('═══════════════════════════════════════════════════════');
      
      setSuccess(true);
      setProcessing(false);
      setProcessingStep('');
      
      localStorage.setItem('plan_just_purchased', Date.now().toString());
      localStorage.removeItem('payment_processing');
      
      console.log('📞 Calling parent success handler in 5 seconds...');
      
      let timeLeft = 5;
      const countdownInterval = setInterval(() => {
        timeLeft--;
        setCountdown(timeLeft);
        if (timeLeft <= 0) {
          clearInterval(countdownInterval);
        }
      }, 1000);
      
      setTimeout(() => {
        if (onSuccess) {
          console.log('✅ Executing parent success callback...');
          onSuccess();
        }
        // ✅ FIX: Automatically reload the page so the user doesn't have to manually refresh
        window.location.reload();
      }, 5000);
      
    } catch (err: any) {
      console.error('❌ Payment processing error:', err);
      
      const errorMsg = err.message || 'Payment processing failed';
      setError(errorMsg);
      setProcessing(false);
      setProcessingStep('');
      
      localStorage.removeItem('payment_processing');
      
      if (onError) onError(errorMsg);
    }
  };

  const handlePaymentFailure = async (response: RazorpayErrorResponse) => {
    console.error('═══════════════════════════════════════════════════════');
    console.error('❌ PAYMENT FAILED');
    console.error('═══════════════════════════════════════════════════════');
    console.error('Error Response:', response);
    
    const errorMsg = response.error?.description || 'Payment failed';
    setError(errorMsg);
    setLoading(false);
    
    localStorage.removeItem('payment_processing');
    
    if (onError) onError(errorMsg);
  };

  const handlePaymentDismiss = async () => {
    console.log('⚠️ Payment window dismissed by user');
    
    const errorMsg = 'Payment cancelled by user';
    setError(errorMsg);
    setLoading(false);
    
    localStorage.removeItem('payment_processing');
    
    if (onError) onError(errorMsg);
  };

  if (success) {
    return (
      <div className="fixed inset-0 z-[9999] bg-black bg-opacity-75 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
          <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4 animate-bounce" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Payment Successful! 🎉</h2>
          <p className="text-gray-600 mb-4">Your subscription has been activated</p>
          
          <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4 mb-4">
            <p className="text-sm text-green-800 mb-2">
              🔄 Refreshing your dashboard...
            </p>
            <div className="flex items-center justify-center gap-2">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-green-600"></div>
              <span className="text-green-700 font-bold">
                {countdown}s
              </span>
            </div>
          </div>
          
          <p className="text-xs text-gray-500">Please wait while we refresh your plan status</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 z-[9999] bg-black bg-opacity-75 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
          <XCircle className="w-20 h-20 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Payment Failed</h2>
          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 mb-6">
            <p className="text-sm text-red-700">{error}</p>
          </div>
          <button
            onClick={() => {
              setError(null);
              if (onError) onError(error);
            }}
            className="w-full bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 font-medium transition-all"
          >
            Close & Retry
          </button>
        </div>
      </div>
    );
  }

  if (processing) {
    return (
      <div className="fixed inset-0 z-[9999] bg-black bg-opacity-75 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
          <Loader className="w-16 h-16 text-green-600 mx-auto mb-6 animate-spin" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Processing Payment</h2>
          <p className="text-gray-600 mb-6">Please wait...</p>
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
            <p className="flex items-center justify-center gap-2">
              <Loader className="w-4 h-4 animate-spin" />
              <span className="font-medium text-sm">{processingStep}</span>
            </p>
          </div>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-xs text-yellow-800 font-medium">⚠️ Do not close this window</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[9999] bg-black bg-opacity-75 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
        <div className="text-center mb-6">
          <div className="text-5xl mb-4">🔒</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            {loading ? 'Opening Payment Window' : 'Payment Window Opened'}
          </h2>
          <p className="text-sm text-gray-600">
            {loading ? 'Please wait...' : 'Complete payment in Razorpay window'}
          </p>
        </div>

        {loading && (
          <div className="mb-6">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-green-600 mx-auto mb-4"></div>
          </div>
        )}

        <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
          <div className="flex items-center justify-center gap-2 text-green-800 font-semibold mb-2">
            <span className="text-2xl">🛡️</span>
            <span>Secure Payment Gateway</span>
          </div>
          <p className="text-xs text-green-700 text-center">Powered by Razorpay</p>
        </div>

        <div className="bg-gray-50 rounded-xl p-4">
          <h3 className="font-semibold text-gray-800 mb-3 text-sm">Payment Amount:</h3>
          <div className="text-center">
            <span className="font-bold text-purple-600 text-3xl">
              ₹{(checkoutOptions.amount / 100).toLocaleString('en-IN')}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

console.log('✅ PaymentCheckout - PRODUCTION v6.2 (Auto-Refresh Fixed)');