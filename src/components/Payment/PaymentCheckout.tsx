// // // ═══════════════════════════════════════════════════════════════
// // // ✅ PAYMENT CHECKOUT - PRODUCTION READY v2.0
// // // ═══════════════════════════════════════════════════════════════

// // import React, { useEffect, useState } from 'react';
// // import { useNavigate } from 'react-router-dom';
// // import { loadRazorpayScript, updatePaymentStatus, verifyPayment } from '../../lib/paymentService';
// // import { createSubscription } from '../../lib/subscriptionService';
// // import { getPlanById } from '../../lib/planService';
// // import type { 
// //   RazorpayCheckoutOptions, 
// //   RazorpaySuccessResponse, 
// //   RazorpayErrorResponse 
// // } from '../../types/payment.types';

// // interface PaymentCheckoutProps {
// //   checkoutOptions: RazorpayCheckoutOptions;
// //   paymentId: string;
// //   planId: string;
// //   sellerId: string;
// //   onSuccess?: () => void;
// //   onError?: (error: string) => void;
// // }

// // export const PaymentCheckout: React.FC<PaymentCheckoutProps> = ({
// //   checkoutOptions,
// //   paymentId,
// //   planId,
// //   sellerId,
// //   onError,
// //   onSuccess
// // }) => {
// //   const navigate = useNavigate();
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState<string | null>(null);

// //   useEffect(() => {
// //     initializeRazorpay();
// //   }, []);

// //   const initializeRazorpay = async () => {
// //     try {
// //       console.log('🔄 Initializing Razorpay checkout (TEST MODE)...');
      
// //       const scriptLoaded = await loadRazorpayScript();
      
// //       if (!scriptLoaded) {
// //         throw new Error('Failed to load Razorpay. Please check your internet connection.');
// //       }
      
// //       await new Promise(resolve => setTimeout(resolve, 500));
      
// //       openRazorpayCheckout();
      
// //     } catch (err: any) {
// //       console.error('❌ Razorpay initialization error:', err);
// //       const errorMsg = err.message || 'Failed to initialize payment';
// //       setError(errorMsg);
// //       if (onError) onError(errorMsg);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const openRazorpayCheckout = () => {
// //     try {
// //       const options: RazorpayCheckoutOptions = {
// //         ...checkoutOptions,
// //         handler: handlePaymentSuccess,
// //         modal: {
// //           ...checkoutOptions.modal,
// //           ondismiss: handlePaymentDismiss
// //         }
// //       };
      
// //       const razorpay = new window.Razorpay(options);
      
// //       razorpay.on('payment.failed', handlePaymentFailure);
      
// //       razorpay.open();
      
// //       console.log('✅ Razorpay checkout opened (TEST MODE)');
      
// //     } catch (err: any) {
// //       console.error('❌ Error opening checkout:', err);
// //       setError('Failed to open payment window');
// //       if (onError) onError(err.message);
// //     }
// //   };

// //   const handlePaymentSuccess = async (response: RazorpaySuccessResponse) => {
// //     try {
// //       console.log('✅ Payment successful (TEST MODE):', response);
      
// //       const verifyResult = await verifyPayment(paymentId, response);
      
// //       if (!verifyResult.success) {
// //         throw new Error('Payment verification failed');
// //       }
      
// //       const plan = await getPlanById(planId);
      
// //       if (!plan) {
// //         console.warn('⚠️ Plan not found, but payment successful');
// //       }
      
// //       if (plan) {
// //         const subscriptionResult = await createSubscription({
// //           seller_id: sellerId,
// //           plan_id: planId,
// //           payment_id: paymentId,
// //           billing_cycle: plan.billing_cycle
// //         });
        
// //         if (!subscriptionResult.success) {
// //           console.warn('⚠️ Subscription creation failed:', subscriptionResult.error);
// //         } else {
// //           console.log('✅ Subscription created successfully');
// //         }
// //       }
      
// //       navigate(`/payment-success?payment_id=${paymentId}&razorpay_payment_id=${response.razorpay_payment_id}`);
      
// //     } catch (err: any) {
// //       console.error('❌ Post-payment processing error:', err);
// //       navigate(`/payment-failure?payment_id=${paymentId}&error=${encodeURIComponent(err.message)}`);
// //     }
// //   };

// //   const handlePaymentFailure = async (response: RazorpayErrorResponse) => {
// //     console.error('❌ Payment failed:', response);
    
// //     const errorMsg = response.error?.description || 'Payment failed';
    
// //     try {
// //       await updatePaymentStatus(
// //         paymentId,
// //         {
// //           razorpay_payment_id: '',
// //           razorpay_order_id: '',
// //           razorpay_signature: ''
// //         },
// //         false
// //       );
// //     } catch (updateError) {
// //       console.warn('⚠️ Could not update payment status:', updateError);
// //     }
    
// //     navigate(`/payment-failure?payment_id=${paymentId}&error=${encodeURIComponent(errorMsg)}`);
// //   };

// //   const handlePaymentDismiss = async () => {
// //     console.log('⚠️ Payment modal dismissed by user');
    
// //     try {
// //       await updatePaymentStatus(
// //         paymentId,
// //         {
// //           razorpay_payment_id: '',
// //           razorpay_order_id: '',
// //           razorpay_signature: ''
// //         },
// //         false
// //       );
// //     } catch (updateError) {
// //       console.warn('⚠️ Could not update payment status:', updateError);
// //     }
    
// //     navigate(`/payment-failure?payment_id=${paymentId}&error=Payment cancelled by user`);
// //   };

// //   if (error) {
// //     return (
// //       <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center p-4">
// //         <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
// //           <div className="text-red-500 text-6xl mb-4">⚠️</div>
// //           <h2 className="text-2xl font-bold text-gray-800 mb-4">Payment Error</h2>
// //           <p className="text-gray-600 mb-6">{error}</p>
// //           <button
// //             onClick={() => navigate('/')}
// //             className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors font-medium"
// //           >
// //             Return to Home
// //           </button>
// //         </div>
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center p-4">
// //       <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
        
// //         <div className="text-center mb-6">
// //           <div className="text-6xl mb-4 animate-bounce">🔒</div>
// //           <h2 className="text-2xl font-bold text-gray-800 mb-2">
// //             {loading ? 'Opening Payment Gateway' : 'Payment Window Opened'}
// //           </h2>
// //           <p className="text-gray-600 text-sm">
// //             {loading 
// //               ? 'Please wait while we load secure Razorpay checkout...'
// //               : 'Complete payment in the Razorpay window'}
// //           </p>
// //         </div>

// //         <div className="mb-6 bg-yellow-50 border-2 border-yellow-400 rounded-xl p-3">
// //           <div className="flex items-center justify-center gap-2 text-yellow-800 font-semibold">
// //             <span className="text-xl">⚠️</span>
// //             <span className="text-sm">TEST MODE</span>
// //           </div>
// //           <p className="text-xs text-yellow-700 text-center mt-1">
// //             No real money will be charged
// //           </p>
// //         </div>

// //         {loading && (
// //           <div className="mb-6">
// //             <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-green-600 mx-auto mb-4"></div>
// //             <div className="space-y-2 text-sm text-gray-500">
// //               <p className="flex items-center justify-center gap-2">
// //                 <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
// //                 Loading Razorpay...
// //               </p>
// //             </div>
// //           </div>
// //         )}

// //         <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
// //           <div className="flex items-center justify-center gap-2 text-green-800 font-semibold mb-2">
// //             <span className="text-2xl">🛡️</span>
// //             <span>Secure Payment</span>
// //           </div>
// //           <p className="text-sm text-green-700 text-center">
// //             Your payment is processed securely through Razorpay's encrypted gateway
// //           </p>
// //         </div>

// //         <div className="bg-gray-50 rounded-xl p-4 mb-6 text-left">
// //           <h3 className="font-semibold text-gray-800 mb-3 text-sm">Payment Details:</h3>
// //           <div className="space-y-2 text-sm">
// //             <div className="flex justify-between">
// //               <span className="text-gray-600">Plan:</span>
// //               <span className="font-medium text-gray-800">{checkoutOptions.description}</span>
// //             </div>
// //             <div className="flex justify-between">
// //               <span className="text-gray-600">Amount:</span>
// //               <span className="font-bold text-purple-600 text-lg">
// //                 ₹{(checkoutOptions.amount / 100).toLocaleString('en-IN')}
// //               </span>
// //             </div>
// //             {checkoutOptions.notes?.transaction_id && (
// //               <div className="flex justify-between">
// //                 <span className="text-gray-600">Transaction ID:</span>
// //                 <span className="font-mono text-gray-800 text-xs">
// //                   {checkoutOptions.notes.transaction_id}
// //                 </span>
// //               </div>
// //             )}
// //           </div>
// //         </div>

// //         <p className="text-xs text-gray-500 text-center">
// //           If payment window doesn't open, please check if popups are blocked
// //         </p>
// //       </div>
// //     </div>
// //   );
// // };

// // console.log('✅ PaymentCheckout Component loaded - PRODUCTION v2.0'); 
// // ═══════════════════════════════════════════════════════════════
// // ✅ PAYMENT CHECKOUT - PRODUCTION READY v4.0 (COMPLETE)
// // ═══════════════════════════════════════════════════════════════

// import React, { useEffect, useState } from 'react';
// import { loadRazorpayScript, updatePaymentStatus, verifyPayment } from '../../lib/paymentService';
// import { createSubscription } from '../../lib/subscriptionService';
// import { getPlanById } from '../../lib/planService';
// import type { 
//   RazorpayCheckoutOptions, 
//   RazorpaySuccessResponse, 
//   RazorpayErrorResponse 
// } from '../../types/payment.types';
// import { CheckCircle, XCircle, Loader, AlertCircle } from 'lucide-react';

// interface PaymentCheckoutProps {
//   checkoutOptions: RazorpayCheckoutOptions;
//   paymentId: string;
//   planId: string;
//   sellerId: string;
//   onSuccess?: () => void;
//   onError?: (error: string) => void;
// }

// export const PaymentCheckout: React.FC<PaymentCheckoutProps> = ({
//   checkoutOptions,
//   paymentId,
//   planId,
//   sellerId,
//   onSuccess,
//   onError
// }) => {
//   const [loading, setLoading] = useState(true);
//   const [processing, setProcessing] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [success, setSuccess] = useState(false);
//   const [processingStep, setProcessingStep] = useState('');

//   useEffect(() => {
//     console.log('🔄 PaymentCheckout mounted');
//     initializeRazorpay();
    
//     return () => {
//       console.log('🔌 PaymentCheckout unmounted');
//     };
//   }, []);

//   const initializeRazorpay = async () => {
//     try {
//       console.log('🔄 Initializing Razorpay checkout (TEST MODE)...');
      
//       const scriptLoaded = await loadRazorpayScript();
      
//       if (!scriptLoaded) {
//         throw new Error('Failed to load Razorpay. Please check your internet connection.');
//       }
      
//       console.log('✅ Razorpay script loaded');
      
//       await new Promise(resolve => setTimeout(resolve, 500));
      
//       openRazorpayCheckout();
      
//     } catch (err: any) {
//       console.error('❌ Razorpay initialization error:', err);
//       const errorMsg = err.message || 'Failed to initialize payment';
//       setError(errorMsg);
//       setLoading(false);
      
//       if (onError) {
//         onError(errorMsg);
//       }
//     }
//   };

//   const openRazorpayCheckout = () => {
//     try {
//       console.log('🔓 Opening Razorpay checkout modal...');
      
//       const options: RazorpayCheckoutOptions = {
//         ...checkoutOptions,
//         handler: handlePaymentSuccess,
//         modal: {
//           ...checkoutOptions.modal,
//           ondismiss: handlePaymentDismiss,
//           confirm_close: true
//         }
//       };
      
//       const razorpay = new window.Razorpay(options);
      
//       razorpay.on('payment.failed', handlePaymentFailure);
      
//       razorpay.open();
      
//       console.log('✅ Razorpay checkout opened (TEST MODE)');
//       setLoading(false);
      
//     } catch (err: any) {
//       console.error('❌ Error opening checkout:', err);
//       const errorMsg = 'Failed to open payment window';
//       setError(errorMsg);
//       setLoading(false);
      
//       if (onError) {
//         onError(errorMsg);
//       }
//     }
//   };

//   const handlePaymentSuccess = async (response: RazorpaySuccessResponse) => {
//     try {
//       console.log('✅ Payment successful (TEST MODE):', response);
//       setProcessing(true);
//       setProcessingStep('Verifying payment...');
      
//       // Step 1: Verify payment
//       console.log('🔄 Step 1/3: Verifying payment...');
//       const verifyResult = await verifyPayment(paymentId, response);
      
//       if (!verifyResult.success) {
//         throw new Error('Payment verification failed');
//       }
//       console.log('✅ Payment verified successfully');
      
//       // Step 2: Get plan details
//       setProcessingStep('Fetching plan details...');
//       console.log('🔄 Step 2/3: Fetching plan details...');
//       const plan = await getPlanById(planId);
      
//       if (!plan) {
//         console.error('❌ Plan not found');
//         throw new Error('Plan not found. Please contact support.');
//       }
//       console.log('✅ Plan found:', plan.plan_name);
      
//       // Step 3: Create subscription
//       setProcessingStep('Activating your plan...');
//       console.log('🔄 Step 3/3: Creating subscription...');
//       const subscriptionResult = await createSubscription({
//         seller_id: sellerId,
//         plan_id: planId,
//         payment_id: paymentId,
//         billing_cycle: plan.billing_cycle
//       });
      
//       if (!subscriptionResult.success) {
//         console.error('❌ Subscription creation failed:', subscriptionResult.error);
//         throw new Error(subscriptionResult.error || 'Failed to activate subscription');
//       }
      
//       console.log('✅ Subscription created successfully');
//       console.log('🎉 Payment process completed successfully!');
      
//       setSuccess(true);
//       setProcessing(false);
//       setProcessingStep('');
      
//       // ✅ CRITICAL: Call parent success callback
//       if (onSuccess) {
//         console.log('🔔 Calling parent success callback...');
//         setTimeout(() => {
//           onSuccess();
//         }, 1500); // Small delay to show success state
//       }
      
//     } catch (err: any) {
//       console.error('❌ Post-payment processing error:', err);
//       const errorMsg = err.message || 'Payment processing failed';
//       setError(errorMsg);
//       setProcessing(false);
//       setProcessingStep('');
      
//       if (onError) {
//         onError(errorMsg);
//       }
//     }
//   };

//   const handlePaymentFailure = async (response: RazorpayErrorResponse) => {
//     console.error('❌ Payment failed:', response);
    
//     const errorMsg = response.error?.description || 'Payment failed. Please try again.';
//     setError(errorMsg);
//     setLoading(false);
    
//     try {
//       await updatePaymentStatus(
//         paymentId,
//         {
//           razorpay_payment_id: '',
//           razorpay_order_id: '',
//           razorpay_signature: ''
//         },
//         false
//       );
//       console.log('✅ Payment status updated to failed');
//     } catch (updateError) {
//       console.warn('⚠️ Could not update payment status:', updateError);
//     }
    
//     if (onError) {
//       onError(errorMsg);
//     }
//   };

//   const handlePaymentDismiss = async () => {
//     console.log('⚠️ Payment modal dismissed by user');
    
//     const errorMsg = 'Payment cancelled by user';
//     setError(errorMsg);
//     setLoading(false);
    
//     try {
//       await updatePaymentStatus(
//         paymentId,
//         {
//           razorpay_payment_id: '',
//           razorpay_order_id: '',
//           razorpay_signature: ''
//         },
//         false
//       );
//       console.log('✅ Payment status updated to cancelled');
//     } catch (updateError) {
//       console.warn('⚠️ Could not update payment status:', updateError);
//     }
    
//     if (onError) {
//       onError(errorMsg);
//     }
//   };

//   // ═══════════════════════════════════════════════════════════════
//   // ✅ SUCCESS STATE - RESPONSIVE
//   // ═══════════════════════════════════════════════════════════════
  
//   if (success) {
//     return (
//       <div className="fixed inset-0 z-[200] bg-black bg-opacity-75 flex items-center justify-center p-4 animate-fade-in">
//         <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 max-w-md w-full text-center animate-scale-in">
//           <div className="mb-4 sm:mb-6">
//             <div className="relative inline-block">
//               <CheckCircle className="w-16 h-16 sm:w-20 sm:h-20 text-green-500 mx-auto animate-bounce" />
//               <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center animate-ping">
//                 <span className="text-white text-xl">✓</span>
//               </div>
//             </div>
//           </div>
          
//           <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
//             Payment Successful! 🎉
//           </h2>
//           <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
//             Your plan is now active
//           </p>
          
//           <div className="bg-green-50 border-2 border-green-200 rounded-xl p-3 sm:p-4 mb-4 sm:mb-6">
//             <div className="flex items-center justify-center gap-2 text-green-800 mb-2">
//               <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
//               <span className="font-semibold text-sm sm:text-base">Subscription Activated</span>
//             </div>
//             <p className="text-xs sm:text-sm text-green-700">
//               All features are now unlocked
//             </p>
//           </div>
          
//           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-3"></div>
//           <p className="text-xs sm:text-sm text-gray-500">Updating dashboard...</p>
//         </div>
//       </div>
//     );
//   }

//   // ═══════════════════════════════════════════════════════════════
//   // ✅ ERROR STATE - RESPONSIVE
//   // ═══════════════════════════════════════════════════════════════
  
//   if (error) {
//     return (
//       <div className="fixed inset-0 z-[200] bg-black bg-opacity-75 flex items-center justify-center p-4 animate-fade-in">
//         <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 max-w-md w-full text-center animate-shake">
//           <div className="mb-4 sm:mb-6">
//             <XCircle className="w-16 h-16 sm:w-20 sm:h-20 text-red-500 mx-auto" />
//           </div>
          
//           <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">
//             Payment Failed
//           </h2>
          
//           <div className="bg-red-50 border-2 border-red-200 rounded-xl p-3 sm:p-4 mb-4 sm:mb-6">
//             <div className="flex items-start gap-2 text-left">
//               <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
//               <div className="flex-1 min-w-0">
//                 <p className="text-sm sm:text-base text-red-800 font-medium mb-1">Error Details:</p>
//                 <p className="text-xs sm:text-sm text-red-700 break-words">{error}</p>
//               </div>
//             </div>
//           </div>
          
//           <button
//             onClick={() => {
//               setError(null);
//               if (onError) onError(error);
//             }}
//             className="w-full bg-red-600 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg hover:bg-red-700 active:bg-red-800 transition-colors font-medium text-sm sm:text-base shadow-md hover:shadow-lg"
//           >
//             Close
//           </button>
//         </div>
//       </div>
//     );
//   }

//   // ═══════════════════════════════════════════════════════════════
//   // ✅ PROCESSING STATE - RESPONSIVE
//   // ═══════════════════════════════════════════════════════════════
  
//   if (processing) {
//     return (
//       <div className="fixed inset-0 z-[200] bg-black bg-opacity-75 flex items-center justify-center p-4 animate-fade-in">
//         <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 max-w-md w-full text-center">
//           <Loader className="w-12 h-12 sm:w-16 sm:h-16 text-green-600 mx-auto mb-4 sm:mb-6 animate-spin" />
          
//           <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
//             Processing Payment
//           </h2>
//           <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
//             Please wait, do not close this window...
//           </p>
          
//           <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 sm:p-4 mb-4 sm:mb-6">
//             <div className="space-y-2 text-sm sm:text-base text-gray-700">
//               <p className="flex items-center justify-center gap-2">
//                 <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
//                 <span>✅ Payment verified</span>
//               </p>
//               <p className="flex items-center justify-center gap-2">
//                 <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
//                 <span>✅ Plan details loaded</span>
//               </p>
//               <p className="flex items-center justify-center gap-2">
//                 <Loader className="w-3 h-3 animate-spin" />
//                 <span className="font-medium">{processingStep}</span>
//               </p>
//             </div>
//           </div>
          
//           <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
//             <p className="text-xs sm:text-sm text-yellow-800 flex items-center justify-center gap-2">
//               <AlertCircle className="w-4 h-4" />
//               <span>This may take a few seconds</span>
//             </p>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // ═══════════════════════════════════════════════════════════════
//   // ✅ LOADING/PAYMENT GATEWAY STATE - RESPONSIVE
//   // ═══════════════════════════════════════════════════════════════
  
//   return (
//     <div className="fixed inset-0 z-[200] bg-black bg-opacity-75 flex items-center justify-center p-4 animate-fade-in">
//       <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 max-w-md w-full">
        
//         {/* Header */}
//         <div className="text-center mb-6">
//           <div className="text-5xl sm:text-6xl mb-4 animate-bounce">🔒</div>
//           <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
//             {loading ? 'Opening Payment Gateway' : 'Payment Window Opened'}
//           </h2>
//           <p className="text-sm sm:text-base text-gray-600">
//             {loading 
//               ? 'Please wait while we load secure Razorpay checkout...'
//               : 'Complete payment in the Razorpay window'}
//           </p>
//         </div>

//         {/* Test Mode Badge */}
//         <div className="mb-6 bg-yellow-50 border-2 border-yellow-400 rounded-xl p-3">
//           <div className="flex items-center justify-center gap-2 text-yellow-800 font-semibold">
//             <span className="text-xl">⚠️</span>
//             <span className="text-sm sm:text-base">TEST MODE</span>
//           </div>
//           <p className="text-xs sm:text-sm text-yellow-700 text-center mt-1">
//             No real money will be charged
//           </p>
//         </div>

//         {/* Loading Animation */}
//         {loading && (
//           <div className="mb-6">
//             <div className="animate-spin rounded-full h-14 w-14 sm:h-16 sm:w-16 border-b-4 border-green-600 mx-auto mb-4"></div>
//             <div className="space-y-2 text-sm sm:text-base text-gray-500">
//               <p className="flex items-center justify-center gap-2">
//                 <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
//                 Loading Razorpay SDK...
//               </p>
//             </div>
//           </div>
//         )}

//         {/* Security Badge */}
//         <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
//           <div className="flex items-center justify-center gap-2 text-green-800 font-semibold mb-2">
//             <span className="text-2xl">🛡️</span>
//             <span className="text-sm sm:text-base">Secure Payment</span>
//           </div>
//           <p className="text-xs sm:text-sm text-green-700 text-center">
//             Your payment is processed securely through Razorpay's encrypted gateway
//           </p>
//         </div>

//         {/* Payment Details */}
//         <div className="bg-gray-50 rounded-xl p-4 mb-6 text-left">
//           <h3 className="font-semibold text-gray-800 mb-3 text-sm sm:text-base">Payment Details:</h3>
//           <div className="space-y-2 text-xs sm:text-sm">
//             <div className="flex justify-between items-start gap-2">
//               <span className="text-gray-600">Plan:</span>
//               <span className="font-medium text-gray-800 text-right break-words flex-1">
//                 {checkoutOptions.description}
//               </span>
//             </div>
//             <div className="flex justify-between items-center">
//               <span className="text-gray-600">Amount:</span>
//               <span className="font-bold text-purple-600 text-lg sm:text-xl">
//                 ₹{(checkoutOptions.amount / 100).toLocaleString('en-IN')}
//               </span>
//             </div>
//             {checkoutOptions.notes?.transaction_id && (
//               <div className="flex justify-between items-start gap-2">
//                 <span className="text-gray-600">Transaction ID:</span>
//                 <span className="font-mono text-gray-800 text-xs break-all flex-1 text-right">
//                   {checkoutOptions.notes.transaction_id}
//                 </span>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Help Text */}
//         <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
//           <p className="text-xs sm:text-sm text-blue-800 text-center">
//             💡 <strong>Test Card:</strong> 4111 1111 1111 1111
//           </p>
//           <p className="text-xs text-blue-700 text-center mt-1">
//             CVV: Any 3 digits | Expiry: Any future date
//           </p>
//         </div>

//         <p className="text-xs text-gray-500 text-center">
//           If payment window doesn't open, please check if popups are blocked
//         </p>
//       </div>
//     </div>
//   );
// };

// console.log('✅ PaymentCheckout Component loaded - PRODUCTION v4.0');
import React, { useEffect, useState } from 'react';
import { loadRazorpayScript, updatePaymentStatus, verifyPayment } from '../../lib/paymentService';
import { createSubscription } from '../../lib/subscriptionService';
import { getPlanById } from '../../lib/planService';
import type { 
  RazorpayCheckoutOptions, 
  RazorpaySuccessResponse, 
  RazorpayErrorResponse 
} from '../../types/payment.types';
import { CheckCircle, XCircle, Loader, AlertCircle } from 'lucide-react';
import { broadcastPlanActivation } from '../../lib/firebaseutils'
interface PaymentCheckoutProps {
  checkoutOptions: RazorpayCheckoutOptions;
  paymentId: string;
  planId: string;
  sellerId: string;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export const PaymentCheckout: React.FC<PaymentCheckoutProps> = ({
  checkoutOptions,
  paymentId,
  planId,
  sellerId,
  onSuccess,
  onError
}) => {
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [processingStep, setProcessingStep] = useState('');

  useEffect(() => {
    console.log('🔄 PaymentCheckout mounted');
    initializeRazorpay();
    
    return () => {
      console.log('🔌 PaymentCheckout unmounted');
    };
  }, []);

  const initializeRazorpay = async () => {
    try {
      console.log('🔄 Initializing Razorpay checkout...');
      
      const scriptLoaded = await loadRazorpayScript();
      
      if (!scriptLoaded) {
        throw new Error('Failed to load Razorpay. Please check your internet connection.');
      }
      
      console.log('✅ Razorpay script loaded');
      
      await new Promise(resolve => setTimeout(resolve, 500));
      
      openRazorpayCheckout();
      
    } catch (err: any) {
      console.error('❌ Razorpay initialization error:', err);
      const errorMsg = err.message || 'Failed to initialize payment';
      setError(errorMsg);
      setLoading(false);
      
      if (onError) {
        onError(errorMsg);
      }
    }
  };

  const openRazorpayCheckout = () => {
    try {
      console.log('🔓 Opening Razorpay checkout modal...');
      
      const options: RazorpayCheckoutOptions = {
        ...checkoutOptions,
        handler: handlePaymentSuccess,
        modal: {
          ...checkoutOptions.modal,
          ondismiss: handlePaymentDismiss,
          confirm_close: true
        }
      };
      
      const razorpay = new window.Razorpay(options);
      
      razorpay.on('payment.failed', handlePaymentFailure);
      
      razorpay.open();
      
      console.log('✅ Razorpay checkout opened');
      setLoading(false);
      
    } catch (err: any) {
      console.error('❌ Error opening checkout:', err);
      const errorMsg = 'Failed to open payment window';
      setError(errorMsg);
      setLoading(false);
      
      if (onError) {
        onError(errorMsg);
      }
    }
  };
const handlePaymentSuccess = async (response: RazorpaySuccessResponse) => {
  try {
    console.log('✅ Payment successful:', response);
    setProcessing(true);
    setProcessingStep('Verifying payment...');
    
    // Step 1: Verify payment
    console.log('🔄 Step 1/4: Verifying payment...');
    const verifyResult = await verifyPayment(paymentId, response);
    
    if (!verifyResult.success) {
      throw new Error('Payment verification failed');
    }
    console.log('✅ Payment verified successfully');
    
    // Step 2: Get plan details
    setProcessingStep('Fetching plan details...');
    console.log('🔄 Step 2/4: Fetching plan details...');
    const plan = await getPlanById(planId);
    
    if (!plan) {
      console.error('❌ Plan not found');
      throw new Error('Plan not found. Please contact support.');
    }
    console.log('✅ Plan found:', plan.plan_name);
    
    // Step 3: Create subscription
    setProcessingStep('Activating your plan...');
    console.log('🔄 Step 3/4: Creating subscription...');
    const subscriptionResult = await createSubscription({
      seller_id: sellerId,
      plan_id: planId,
      payment_id: paymentId,
      billing_cycle: plan.billing_cycle
    });
    
    if (!subscriptionResult.success) {
      console.error('❌ Subscription creation failed:', subscriptionResult.error);
      throw new Error(subscriptionResult.error || 'Failed to activate subscription');
    }
    
    console.log('✅ Subscription created successfully:', subscriptionResult.subscriptionId);
    
    // ✅ NEW STEP 4: BROADCAST PLAN ACTIVATION TO WORKERS
    setProcessingStep('Notifying worker sessions...');
    console.log('🔄 Step 4/4: Broadcasting plan activation...');
    
    try {
      const broadcastResult = await broadcastPlanActivation(sellerId);
      
      if (broadcastResult.success) {
        console.log('✅ Plan activation broadcasted to all worker sessions');
      } else {
        console.warn('⚠️ Broadcast failed (non-critical):', broadcastResult.error);
      }
    } catch (broadcastError) {
      console.warn('⚠️ Broadcast error (non-critical):', broadcastError);
      // Don't fail payment on broadcast error
    }
    
    console.log('🎉 Payment process completed successfully!');
    
    setSuccess(true);
    setProcessing(false);
    setProcessingStep('');
    
    // ✅ Call parent success callback
    if (onSuccess) {
      console.log('🔔 Calling parent success callback in 2 seconds...');
      setTimeout(() => {
        console.log('📞 Executing parent onSuccess callback now');
        onSuccess();
      }, 2000);
    }
    
  } catch (err: any) {
    console.error('❌ Post-payment processing error:', err);
    const errorMsg = err.message || 'Payment processing failed';
    setError(errorMsg);
    setProcessing(false);
    setProcessingStep('');
    
    // Update payment status to failed
    try {
      await updatePaymentStatus(
        paymentId,
        {
          razorpay_payment_id: '',
          razorpay_order_id: '',
          razorpay_signature: ''
        },
        false
      );
    } catch (updateError) {
      console.warn('⚠️ Could not update payment status:', updateError);
    }
    
    if (onError) {
      onError(errorMsg);
    }
  }
};
  // const handlePaymentSuccess = async (response: RazorpaySuccessResponse) => {
  //   try {
  //     console.log('✅ Payment successful:', response);
  //     setProcessing(true);
  //     setProcessingStep('Verifying payment...');
      
  //     // Step 1: Verify payment
  //     console.log('🔄 Step 1/3: Verifying payment...');
  //     const verifyResult = await verifyPayment(paymentId, response);
      
  //     if (!verifyResult.success) {
  //       throw new Error('Payment verification failed');
  //     }
  //     console.log('✅ Payment verified successfully');
      
  //     // Step 2: Get plan details
  //     setProcessingStep('Fetching plan details...');
  //     console.log('🔄 Step 2/3: Fetching plan details...');
  //     const plan = await getPlanById(planId);
      
  //     if (!plan) {
  //       console.error('❌ Plan not found');
  //       throw new Error('Plan not found. Please contact support.');
  //     }
  //     console.log('✅ Plan found:', plan.plan_name);
      
  //     // Step 3: Create subscription
  //     setProcessingStep('Activating your plan...');
  //     console.log('🔄 Step 3/3: Creating subscription...');
  //     const subscriptionResult = await createSubscription({
  //       seller_id: sellerId,
  //       plan_id: planId,
  //       payment_id: paymentId,
  //       billing_cycle: plan.billing_cycle
  //     });
      
  //     if (!subscriptionResult.success) {
  //       console.error('❌ Subscription creation failed:', subscriptionResult.error);
  //       throw new Error(subscriptionResult.error || 'Failed to activate subscription');
  //     }
      
  //     console.log('✅ Subscription created successfully:', subscriptionResult.subscriptionId);
  //     console.log('🎉 Payment process completed successfully!');
      
  //     setSuccess(true);
  //     setProcessing(false);
  //     setProcessingStep('');
      
  //     // ✅ CRITICAL: Call parent success callback
  //     if (onSuccess) {
  //       console.log('🔔 Calling parent success callback in 2 seconds...');
  //       setTimeout(() => {
  //         console.log('📞 Executing parent onSuccess callback now');
  //         onSuccess();
  //       }, 2000); // Show success screen for 2 seconds before closing
  //     }
      
  //   } catch (err: any) {
  //     console.error('❌ Post-payment processing error:', err);
  //     const errorMsg = err.message || 'Payment processing failed';
  //     setError(errorMsg);
  //     setProcessing(false);
  //     setProcessingStep('');
      
  //     // Update payment status to failed
  //     try {
  //       await updatePaymentStatus(
  //         paymentId,
  //         {
  //           razorpay_payment_id: '',
  //           razorpay_order_id: '',
  //           razorpay_signature: ''
  //         },
  //         false
  //       );
  //     } catch (updateError) {
  //       console.warn('⚠️ Could not update payment status:', updateError);
  //     }
      
  //     if (onError) {
  //       onError(errorMsg);
  //     }
  //   }
  // }; 


  const handlePaymentFailure = async (response: RazorpayErrorResponse) => {
    console.error('❌ Payment failed:', response);
    
    const errorMsg = response.error?.description || 'Payment failed. Please try again.';
    setError(errorMsg);
    setLoading(false);
    
    try {
      await updatePaymentStatus(
        paymentId,
        {
          razorpay_payment_id: '',
          razorpay_order_id: '',
          razorpay_signature: ''
        },
        false
      );
      console.log('✅ Payment status updated to failed');
    } catch (updateError) {
      console.warn('⚠️ Could not update payment status:', updateError);
    }
    
    if (onError) {
      onError(errorMsg);
    }
  };

  const handlePaymentDismiss = async () => {
    console.log('⚠️ Payment modal dismissed by user');
    
    const errorMsg = 'Payment cancelled by user';
    setError(errorMsg);
    setLoading(false);
    
    try {
      await updatePaymentStatus(
        paymentId,
        {
          razorpay_payment_id: '',
          razorpay_order_id: '',
          razorpay_signature: ''
        },
        false
      );
      console.log('✅ Payment status updated to cancelled');
    } catch (updateError) {
      console.warn('⚠️ Could not update payment status:', updateError);
    }
    
    if (onError) {
      onError(errorMsg);
    }
  };

  // ═══════════════════════════════════════════════════════════════
  // ✅ SUCCESS STATE
  // ═══════════════════════════════════════════════════════════════
  
  if (success) {
    return (
      <div className="fixed inset-0 z-[9999] bg-black bg-opacity-75 flex items-center justify-center p-4 animate-fade-in">
        <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 max-w-md w-full text-center animate-scale-in">
          <div className="mb-4 sm:mb-6">
            <div className="relative inline-block">
              <CheckCircle className="w-16 h-16 sm:w-20 sm:h-20 text-green-500 mx-auto animate-bounce" />
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xl font-bold">✓</span>
              </div>
            </div>
          </div>
          
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
            Payment Successful! 🎉
          </h2>
          <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
            Your plan is now active
          </p>
          
          <div className="bg-green-50 border-2 border-green-200 rounded-xl p-3 sm:p-4 mb-4 sm:mb-6">
            <div className="flex items-center justify-center gap-2 text-green-800 mb-2">
              <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="font-semibold text-sm sm:text-base">Subscription Activated</span>
            </div>
            <p className="text-xs sm:text-sm text-green-700">
              All features are now unlocked
            </p>
          </div>
          
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-3"></div>
          <p className="text-xs sm:text-sm text-gray-500">Refreshing dashboard...</p>
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════
  // ✅ ERROR STATE
  // ═══════════════════════════════════════════════════════════════
  
  if (error) {
    return (
      <div className="fixed inset-0 z-[9999] bg-black bg-opacity-75 flex items-center justify-center p-4 animate-fade-in">
        <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 max-w-md w-full text-center animate-shake">
          <div className="mb-4 sm:mb-6">
            <XCircle className="w-16 h-16 sm:w-20 sm:h-20 text-red-500 mx-auto" />
          </div>
          
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">
            Payment Failed
          </h2>
          
          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-3 sm:p-4 mb-4 sm:mb-6">
            <div className="flex items-start gap-2 text-left">
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm sm:text-base text-red-800 font-medium mb-1">Error Details:</p>
                <p className="text-xs sm:text-sm text-red-700 break-words">{error}</p>
              </div>
            </div>
          </div>
          
          <button
            onClick={() => {
              setError(null);
              if (onError) onError(error);
            }}
            className="w-full bg-red-600 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg hover:bg-red-700 active:bg-red-800 transition-colors font-medium text-sm sm:text-base shadow-md hover:shadow-lg"
          >
            Close & Retry
          </button>
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════
  // ✅ PROCESSING STATE
  // ═══════════════════════════════════════════════════════════════
  
  if (processing) {
    return (
      <div className="fixed inset-0 z-[9999] bg-black bg-opacity-75 flex items-center justify-center p-4 animate-fade-in">
        <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 max-w-md w-full text-center">
          <Loader className="w-12 h-12 sm:w-16 sm:h-16 text-green-600 mx-auto mb-4 sm:mb-6 animate-spin" />
          
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
            Processing Payment
          </h2>
          <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
            Please wait, do not close this window...
          </p>
          
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 sm:p-4 mb-4 sm:mb-6">
            <div className="space-y-2 text-sm sm:text-base text-gray-700">
              <p className="flex items-center justify-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span>✅ Payment received</span>
              </p>
              <p className="flex items-center justify-center gap-2">
                <Loader className="w-3 h-3 animate-spin" />
                <span className="font-medium">{processingStep}</span>
              </p>
            </div>
          </div>
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-xs sm:text-sm text-yellow-800 flex items-center justify-center gap-2">
              <AlertCircle className="w-4 h-4" />
              <span>This may take a few seconds</span>
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════
  // ✅ LOADING STATE
  // ═══════════════════════════════════════════════════════════════
  
  return (
    <div className="fixed inset-0 z-[9999] bg-black bg-opacity-75 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 max-w-md w-full">
        
        <div className="text-center mb-6">
          <div className="text-5xl sm:text-6xl mb-4 animate-bounce">🔒</div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
            {loading ? 'Opening Payment Gateway' : 'Payment Window Opened'}
          </h2>
          <p className="text-sm sm:text-base text-gray-600">
            {loading 
              ? 'Loading secure checkout...'
              : 'Complete payment in the Razorpay window'}
          </p>
        </div>

        {loading && (
          <div className="mb-6">
            <div className="animate-spin rounded-full h-14 w-14 sm:h-16 sm:w-16 border-b-4 border-green-600 mx-auto mb-4"></div>
            <div className="space-y-2 text-sm sm:text-base text-gray-500">
              <p className="flex items-center justify-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                Loading Razorpay SDK...
              </p>
            </div>
          </div>
        )}

        <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
          <div className="flex items-center justify-center gap-2 text-green-800 font-semibold mb-2">
            <span className="text-2xl">🛡️</span>
            <span className="text-sm sm:text-base">Secure Payment</span>
          </div>
          <p className="text-xs sm:text-sm text-green-700 text-center">
            Processed securely through Razorpay
          </p>
        </div>

        <div className="bg-gray-50 rounded-xl p-4 mb-4 text-left">
          <h3 className="font-semibold text-gray-800 mb-3 text-sm sm:text-base">Payment Details:</h3>
          <div className="space-y-2 text-xs sm:text-sm">
            <div className="flex justify-between items-start gap-2">
              <span className="text-gray-600">Plan:</span>
              <span className="font-medium text-gray-800 text-right break-words flex-1">
                {checkoutOptions.description}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Amount:</span>
              <span className="font-bold text-purple-600 text-lg sm:text-xl">
                ₹{(checkoutOptions.amount / 100).toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        </div>

        <p className="text-xs text-gray-500 text-center">
          If payment window doesn't open, check if popups are blocked
        </p>
      </div>
    </div>
  );
};

console.log('✅ PaymentCheckout Component loaded - v5.0');