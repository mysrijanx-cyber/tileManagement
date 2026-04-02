
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
// import { broadcastPlanActivation } from '../../lib/firebaseutils'
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
//       console.log('🔄 Initializing Razorpay checkout...');
      
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
      
//       console.log('✅ Razorpay checkout opened');
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
// const handlePaymentSuccess = async (response: RazorpaySuccessResponse) => {
//   try {
//     console.log('✅ Payment successful:', response);
//     setProcessing(true);
//     setProcessingStep('Verifying payment...');
    
//     // Step 1: Verify payment
//     console.log('🔄 Step 1/4: Verifying payment...');
//     const verifyResult = await verifyPayment(paymentId, response);
    
//     if (!verifyResult.success) {
//       throw new Error('Payment verification failed');
//     }
//     console.log('✅ Payment verified successfully');
    
//     // Step 2: Get plan details
//     setProcessingStep('Fetching plan details...');
//     console.log('🔄 Step 2/4: Fetching plan details...');
//     const plan = await getPlanById(planId);
    
//     if (!plan) {
//       console.error('❌ Plan not found');
//       throw new Error('Plan not found. Please contact support.');
//     }
//     console.log('✅ Plan found:', plan.plan_name);
    
//     // Step 3: Create subscription
//     setProcessingStep('Activating your plan...');
//     console.log('🔄 Step 3/4: Creating subscription...');
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
    
//     // ✅ NEW STEP 4: BROADCAST PLAN ACTIVATION TO WORKERS
//     setProcessingStep('Notifying worker sessions...');
//     console.log('🔄 Step 4/4: Broadcasting plan activation...');
    
//     try {
//       const broadcastResult = await broadcastPlanActivation(sellerId);
      
//       if (broadcastResult.success) {
//         console.log('✅ Plan activation broadcasted to all worker sessions');
//       } else {
//         console.warn('⚠️ Broadcast failed (non-critical):', broadcastResult.error);
//       }
//     } catch (broadcastError) {
//       console.warn('⚠️ Broadcast error (non-critical):', broadcastError);
//       // Don't fail payment on broadcast error
//     }
    
//     console.log('🎉 Payment process completed successfully!');
    
//     setSuccess(true);
//     setProcessing(false);
//     setProcessingStep('');
    
//     // ✅ Call parent success callback
//     if (onSuccess) {
//       console.log('🔔 Calling parent success callback in 2 seconds...');
//       setTimeout(() => {
//         console.log('📞 Executing parent onSuccess callback now');
//         onSuccess();
//       }, 2000);
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
//   // const handlePaymentSuccess = async (response: RazorpaySuccessResponse) => {
//   //   try {
//   //     console.log('✅ Payment successful:', response);
//   //     setProcessing(true);
//   //     setProcessingStep('Verifying payment...');
      
//   //     // Step 1: Verify payment
//   //     console.log('🔄 Step 1/3: Verifying payment...');
//   //     const verifyResult = await verifyPayment(paymentId, response);
      
//   //     if (!verifyResult.success) {
//   //       throw new Error('Payment verification failed');
//   //     }
//   //     console.log('✅ Payment verified successfully');
      
//   //     // Step 2: Get plan details
//   //     setProcessingStep('Fetching plan details...');
//   //     console.log('🔄 Step 2/3: Fetching plan details...');
//   //     const plan = await getPlanById(planId);
      
//   //     if (!plan) {
//   //       console.error('❌ Plan not found');
//   //       throw new Error('Plan not found. Please contact support.');
//   //     }
//   //     console.log('✅ Plan found:', plan.plan_name);
      
//   //     // Step 3: Create subscription
//   //     setProcessingStep('Activating your plan...');
//   //     console.log('🔄 Step 3/3: Creating subscription...');
//   //     const subscriptionResult = await createSubscription({
//   //       seller_id: sellerId,
//   //       plan_id: planId,
//   //       payment_id: paymentId,
//   //       billing_cycle: plan.billing_cycle
//   //     });
      
//   //     if (!subscriptionResult.success) {
//   //       console.error('❌ Subscription creation failed:', subscriptionResult.error);
//   //       throw new Error(subscriptionResult.error || 'Failed to activate subscription');
//   //     }
      
//   //     console.log('✅ Subscription created successfully:', subscriptionResult.subscriptionId);
//   //     console.log('🎉 Payment process completed successfully!');
      
//   //     setSuccess(true);
//   //     setProcessing(false);
//   //     setProcessingStep('');
      
//   //     // ✅ CRITICAL: Call parent success callback
//   //     if (onSuccess) {
//   //       console.log('🔔 Calling parent success callback in 2 seconds...');
//   //       setTimeout(() => {
//   //         console.log('📞 Executing parent onSuccess callback now');
//   //         onSuccess();
//   //       }, 2000); // Show success screen for 2 seconds before closing
//   //     }
      
//   //   } catch (err: any) {
//   //     console.error('❌ Post-payment processing error:', err);
//   //     const errorMsg = err.message || 'Payment processing failed';
//   //     setError(errorMsg);
//   //     setProcessing(false);
//   //     setProcessingStep('');
      
//   //     // Update payment status to failed
//   //     try {
//   //       await updatePaymentStatus(
//   //         paymentId,
//   //         {
//   //           razorpay_payment_id: '',
//   //           razorpay_order_id: '',
//   //           razorpay_signature: ''
//   //         },
//   //         false
//   //       );
//   //     } catch (updateError) {
//   //       console.warn('⚠️ Could not update payment status:', updateError);
//   //     }
      
//   //     if (onError) {
//   //       onError(errorMsg);
//   //     }
//   //   }
//   // }; 


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
//   // ✅ SUCCESS STATE
//   // ═══════════════════════════════════════════════════════════════
  
//   if (success) {
//     return (
//       <div className="fixed inset-0 z-[9999] bg-black bg-opacity-75 flex items-center justify-center p-4 animate-fade-in">
//         <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 max-w-md w-full text-center animate-scale-in">
//           <div className="mb-4 sm:mb-6">
//             <div className="relative inline-block">
//               <CheckCircle className="w-16 h-16 sm:w-20 sm:h-20 text-green-500 mx-auto animate-bounce" />
//               <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
//                 <span className="text-white text-xl font-bold">✓</span>
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
//           <p className="text-xs sm:text-sm text-gray-500">Refreshing dashboard...</p>
//         </div>
//       </div>
//     );
//   }

//   // ═══════════════════════════════════════════════════════════════
//   // ✅ ERROR STATE
//   // ═══════════════════════════════════════════════════════════════
  
//   if (error) {
//     return (
//       <div className="fixed inset-0 z-[9999] bg-black bg-opacity-75 flex items-center justify-center p-4 animate-fade-in">
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
//             Close & Retry
//           </button>
//         </div>
//       </div>
//     );
//   }

//   // ═══════════════════════════════════════════════════════════════
//   // ✅ PROCESSING STATE
//   // ═══════════════════════════════════════════════════════════════
  
//   if (processing) {
//     return (
//       <div className="fixed inset-0 z-[9999] bg-black bg-opacity-75 flex items-center justify-center p-4 animate-fade-in">
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
//                 <span className="w-2 h-2 bg-green-500 rounded-full"></span>
//                 <span>✅ Payment received</span>
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
//   // ✅ LOADING STATE
//   // ═══════════════════════════════════════════════════════════════
  
//   return (
//     <div className="fixed inset-0 z-[9999] bg-black bg-opacity-75 flex items-center justify-center p-4 animate-fade-in">
//       <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 max-w-md w-full">
        
//         <div className="text-center mb-6">
//           <div className="text-5xl sm:text-6xl mb-4 animate-bounce">🔒</div>
//           <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
//             {loading ? 'Opening Payment Gateway' : 'Payment Window Opened'}
//           </h2>
//           <p className="text-sm sm:text-base text-gray-600">
//             {loading 
//               ? 'Loading secure checkout...'
//               : 'Complete payment in the Razorpay window'}
//           </p>
//         </div>

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

//         <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
//           <div className="flex items-center justify-center gap-2 text-green-800 font-semibold mb-2">
//             <span className="text-2xl">🛡️</span>
//             <span className="text-sm sm:text-base">Secure Payment</span>
//           </div>
//           <p className="text-xs sm:text-sm text-green-700 text-center">
//             Processed securely through Razorpay
//           </p>
//         </div>

//         <div className="bg-gray-50 rounded-xl p-4 mb-4 text-left">
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
//           </div>
//         </div>

//         <p className="text-xs text-gray-500 text-center">
//           If payment window doesn't open, check if popups are blocked
//         </p>
//       </div>
//     </div>
//   );
// };

// console.log('✅ PaymentCheckout Component loaded - v5.0'); 
// ═══════════════════════════════════════════════════════════════
// 💳 PAYMENT CHECKOUT - PRODUCTION v7.0 (COMPLETE)
// ═══════════════════════════════════════════════════════════════

import React, { useEffect, useState } from 'react';
import { loadRazorpayScript, updatePaymentStatus, verifyPayment } from '../../lib/paymentService';
import { createSubscription, clearSubscriptionCache } from '../../lib/subscriptionService';
import { getPlanById } from '../../lib/planService';
import type { 
  RazorpayCheckoutOptions, 
  RazorpaySuccessResponse, 
  RazorpayErrorResponse 
} from '../../types/payment.types';
import { CheckCircle, XCircle, Loader, AlertCircle } from 'lucide-react';
import { broadcastPlanActivation } from '../../lib/firebaseutils';

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
      // ✅ CRITICAL: Clean up flag
      localStorage.removeItem('payment_processing');
    };
  }, []);

  const initializeRazorpay = async () => {
    try {
      console.log('🔄 Initializing Razorpay...');
      
      const scriptLoaded = await loadRazorpayScript();
      
      if (!scriptLoaded) {
        throw new Error('Failed to load Razorpay');
      }
      
      console.log('✅ Razorpay loaded');
      await new Promise(resolve => setTimeout(resolve, 500));
      openRazorpayCheckout();
      
    } catch (err: any) {
      console.error('❌ Init error:', err);
      const errorMsg = err.message || 'Failed to initialize';
      setError(errorMsg);
      setLoading(false);
      if (onError) onError(errorMsg);
    }
  };

  const openRazorpayCheckout = () => {
    try {
      console.log('🔓 Opening Razorpay...');
      
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
      
      console.log('✅ Razorpay opened');
      setLoading(false);
      
    } catch (err: any) {
      console.error('❌ Open error:', err);
      setError('Failed to open payment');
      setLoading(false);
      if (onError) onError('Failed to open payment');
    }
  };

  const handlePaymentSuccess = async (response: RazorpaySuccessResponse) => {
    try {
      console.log('═══════════════════════════════════════════════════════');
      console.log('✅ PAYMENT SUCCESS');
      console.log('═══════════════════════════════════════════════════════');
      
      setProcessing(true);
      
      // ✅✅✅ CRITICAL: SET FLAG IMMEDIATELY ✅✅✅
      localStorage.setItem('payment_processing', 'true');
      console.log('🚩 payment_processing FLAG SET');
      
      // STEP 1: Verify
      setProcessingStep('Verifying payment...');
      console.log('🔄 Step 1/5: Verifying...');
      
      const verifyResult = await verifyPayment(paymentId, response);
      if (!verifyResult.success) throw new Error('Verification failed');
      console.log('✅ Verified');
      
      // STEP 2: Get plan
      setProcessingStep('Fetching plan...');
      console.log('🔄 Step 2/5: Fetching plan...');
      
      const plan = await getPlanById(planId);
      if (!plan) throw new Error('Plan not found');
      console.log('✅ Plan found:', plan.plan_name);
      
      // STEP 3: Create subscription
      setProcessingStep('Creating subscription...');
      console.log('🔄 Step 3/5: Creating subscription...');
      
      const subscriptionResult = await createSubscription({
        seller_id: sellerId,
        plan_id: planId,
        payment_id: paymentId,
        billing_cycle: plan.billing_cycle
      });
      
      if (!subscriptionResult.success) {
        throw new Error(subscriptionResult.error || 'Failed to create subscription');
      }
      console.log('✅ Subscription created:', subscriptionResult.subscriptionId);
      
      // STEP 4: Clear cache
      setProcessingStep('Clearing cache...');
      console.log('🔄 Step 4/5: Clearing cache...');
      clearSubscriptionCache(sellerId);
      console.log('✅ Cache cleared');
      
      // STEP 5: Broadcast
      setProcessingStep('Broadcasting...');
      console.log('🔄 Step 5/5: Broadcasting...');
      
      try {
        const broadcastResult = await broadcastPlanActivation(sellerId);
        if (broadcastResult.success) {
          console.log('✅ Broadcasted');
        }
      } catch (broadcastError) {
        console.warn('⚠️ Broadcast failed (non-critical)');
      }
      
      console.log('🎉 Payment processing COMPLETE');
      
      setSuccess(true);
      setProcessing(false);
      setProcessingStep('');
      
      // ✅ Call parent success callback
      if (onSuccess) {
        console.log('🔔 Calling parent success in 2s...');
        setTimeout(() => {
          console.log('═══════════════════════════════════════════════════════');
          console.log('📞 CALLING PARENT onSuccess NOW');
          console.log('═══════════════════════════════════════════════════════');
          
          // ✅ CLEAR FLAG BEFORE CALLBACK
          localStorage.removeItem('payment_processing');
          console.log('🚩 payment_processing FLAG CLEARED');
          
          onSuccess();
        }, 2000);
      } else {
        setTimeout(() => {
          localStorage.removeItem('payment_processing');
          console.log('🚩 Flag cleared (no callback)');
        }, 2000);
      }
      
      console.log('═══════════════════════════════════════════════════════');
      
    } catch (err: any) {
      console.error('═══════════════════════════════════════════════════════');
      console.error('❌ PAYMENT ERROR:', err);
      console.error('═══════════════════════════════════════════════════════');
      
      const errorMsg = err.message || 'Processing failed';
      setError(errorMsg);
      setProcessing(false);
      setProcessingStep('');
      
      // ✅ CLEAR FLAG ON ERROR
      localStorage.removeItem('payment_processing');
      console.log('🚩 Flag cleared (error)');
      
      try {
        await updatePaymentStatus(paymentId, {
          razorpay_payment_id: '',
          razorpay_order_id: '',
          razorpay_signature: ''
        }, false);
      } catch (updateError) {
        console.warn('⚠️ Could not update payment status');
      }
      
      if (onError) onError(errorMsg);
    }
  };

  const handlePaymentFailure = async (response: RazorpayErrorResponse) => {
    console.error('❌ Payment failed:', response);
    
    const errorMsg = response.error?.description || 'Payment failed';
    setError(errorMsg);
    setLoading(false);
    
    localStorage.removeItem('payment_processing');
    
    try {
      await updatePaymentStatus(paymentId, {
        razorpay_payment_id: '',
        razorpay_order_id: '',
        razorpay_signature: ''
      }, false);
    } catch (updateError) {
      console.warn('⚠️ Could not update status');
    }
    
    if (onError) onError(errorMsg);
  };

  const handlePaymentDismiss = async () => {
    console.log('⚠️ Payment dismissed');
    
    const errorMsg = 'Payment cancelled';
    setError(errorMsg);
    setLoading(false);
    
    localStorage.removeItem('payment_processing');
    
    try {
      await updatePaymentStatus(paymentId, {
        razorpay_payment_id: '',
        razorpay_order_id: '',
        razorpay_signature: ''
      }, false);
    } catch (updateError) {
      console.warn('⚠️ Could not update status');
    }
    
    if (onError) onError(errorMsg);
  };

  // ═══════════════════════════════════════════════════════════════
  // RENDER SUCCESS
  // ═══════════════════════════════════════════════════════════════
  
  if (success) {
    return (
      <div className="fixed inset-0 z-[9999] bg-black bg-opacity-75 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 max-w-md w-full text-center">
          <CheckCircle className="w-16 h-16 sm:w-20 sm:h-20 text-green-500 mx-auto mb-4 animate-bounce" />
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">Payment Successful! 🎉</h2>
          <p className="text-sm sm:text-base text-gray-600 mb-6">Your plan is now active</p>
          <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4 mb-6">
            <p className="text-green-800 font-semibold">All features unlocked</p>
          </div>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-3"></div>
          <p className="text-xs text-gray-500">Preparing dashboard...</p>
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════
  // RENDER ERROR
  // ═══════════════════════════════════════════════════════════════
  
  if (error) {
    return (
      <div className="fixed inset-0 z-[9999] bg-black bg-opacity-75 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 max-w-md w-full text-center">
          <XCircle className="w-16 h-16 sm:w-20 sm:h-20 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">Payment Failed</h2>
          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 mb-6">
            <p className="text-sm text-red-700">{error}</p>
          </div>
          <button
            onClick={() => {
              setError(null);
              if (onError) onError(error);
            }}
            className="w-full bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 font-medium"
          >
            Close & Retry
          </button>
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════
  // RENDER PROCESSING
  // ═══════════════════════════════════════════════════════════════
  
  if (processing) {
    return (
      <div className="fixed inset-0 z-[9999] bg-black bg-opacity-75 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 max-w-md w-full text-center">
          <Loader className="w-12 h-12 sm:w-16 sm:h-16 text-green-600 mx-auto mb-6 animate-spin" />
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">Processing Payment</h2>
          <p className="text-sm sm:text-base text-gray-600 mb-6">Please wait...</p>
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
            <p className="flex items-center justify-center gap-2">
              <Loader className="w-3 h-3 animate-spin" />
              <span className="font-medium">{processingStep}</span>
            </p>
          </div>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-xs text-yellow-800">Do not close this window</p>
          </div>
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════
  // RENDER LOADING
  // ═══════════════════════════════════════════════════════════════
  
  return (
    <div className="fixed inset-0 z-[9999] bg-black bg-opacity-75 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 max-w-md w-full">
        <div className="text-center mb-6">
          <div className="text-5xl mb-4">🔒</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            {loading ? 'Opening Payment' : 'Payment Opened'}
          </h2>
          <p className="text-sm text-gray-600">
            {loading ? 'Loading...' : 'Complete in Razorpay window'}
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
            <span>Secure Payment</span>
          </div>
          <p className="text-xs text-green-700 text-center">Razorpay</p>
        </div>

        <div className="bg-gray-50 rounded-xl p-4 mb-4">
          <h3 className="font-semibold text-gray-800 mb-3">Payment Details:</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Plan:</span>
              <span className="font-medium">{checkoutOptions.description}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Amount:</span>
              <span className="font-bold text-purple-600 text-xl">
                ₹{(checkoutOptions.amount / 100).toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

console.log('✅ PaymentCheckout loaded - PRODUCTION v7.0');