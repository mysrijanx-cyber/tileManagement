// // ═══════════════════════════════════════════════════════════════
// // ✅ PAYU CHECKOUT COMPONENT - PRODUCTION v1.0
// // ═══════════════════════════════════════════════════════════════

// import React, { useEffect, useRef } from 'react';
// import { PAYU_CONFIG } from '../../lib/paymentService';
// import type { PayUFormData } from '../../types/payment.types';

// interface PayUCheckoutProps {
//   formData: PayUFormData;
//   onCancel: () => void;
// }

// export const PayUCheckout: React.FC<PayUCheckoutProps> = ({ formData, onCancel }) => {
//   const formRef = useRef<HTMLFormElement>(null);

//   useEffect(() => {
//     // Auto-submit form on mount
//     if (formRef.current) {
//       console.log('🚀 Submitting PayU form...');
//       formRef.current.submit();
//     }
//   }, []);

//   return (
//     <div className="fixed inset-0 z-50 bg-white flex items-center justify-center p-4">
//       <div className="max-w-md w-full text-center">
//         {/* Loading Animation */}
//         <div className="mb-6">
//           <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mx-auto mb-4"></div>
//           <h2 className="text-2xl font-bold text-gray-800 mb-2">
//             Redirecting to Payment Gateway...
//           </h2>
//           <p className="text-gray-600 mb-4">
//             Please wait while we securely redirect you to PayU
//           </p>
//         </div>

//         {/* Security Info */}
//         <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
//           <div className="flex items-center justify-center gap-2 text-green-800 font-semibold mb-2">
//             <span className="text-2xl">🔒</span>
//             <span>Secure Payment</span>
//           </div>
//           <p className="text-sm text-green-700">
//             Your payment is processed securely through PayU's encrypted gateway
//           </p>
//         </div>

//         {/* Payment Details */}
//         <div className="bg-gray-50 rounded-xl p-4 mb-6 text-left">
//           <h3 className="font-semibold text-gray-800 mb-3">Payment Details:</h3>
//           <div className="space-y-2 text-sm">
//             <div className="flex justify-between">
//               <span className="text-gray-600">Plan:</span>
//               <span className="font-medium text-gray-800">{formData.productinfo}</span>
//             </div>
//             <div className="flex justify-between">
//               <span className="text-gray-600">Amount:</span>
//               <span className="font-bold text-purple-600 text-lg">₹{formData.amount}</span>
//             </div>
//             <div className="flex justify-between">
//               <span className="text-gray-600">Email:</span>
//               <span className="font-medium text-gray-800 text-xs">{formData.email}</span>
//             </div>
//             <div className="flex justify-between">
//               <span className="text-gray-600">Transaction ID:</span>
//               <span className="font-mono text-gray-800 text-xs">{formData.txnid}</span>
//             </div>
//           </div>
//         </div>

//         {/* Cancel Button */}
//         <button
//           onClick={onCancel}
//           className="w-full bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 font-medium transition-colors"
//         >
//           Cancel Payment
//         </button>

//         {/* Hidden PayU Form */}
//         <form
//           ref={formRef}
//           method="POST"
//           action={PAYU_CONFIG.base_url}
//           style={{ display: 'none' }}
//         >
//           <input type="hidden" name="key" value={formData.key} />
//           <input type="hidden" name="txnid" value={formData.txnid} />
//           <input type="hidden" name="amount" value={formData.amount} />
//           <input type="hidden" name="productinfo" value={formData.productinfo} />
//           <input type="hidden" name="firstname" value={formData.firstname} />
//           <input type="hidden" name="email" value={formData.email} />
//           <input type="hidden" name="phone" value={formData.phone} />
//           <input type="hidden" name="surl" value={formData.surl} />
//           <input type="hidden" name="furl" value={formData.furl} />
//           <input type="hidden" name="hash" value={formData.hash} />
//           {formData.udf1 && <input type="hidden" name="udf1" value={formData.udf1} />}
//           {formData.udf2 && <input type="hidden" name="udf2" value={formData.udf2} />}
//           {formData.udf3 && <input type="hidden" name="udf3" value={formData.udf3} />}
//           {formData.udf4 && <input type="hidden" name="udf4" value={formData.udf4} />}
//           {formData.udf5 && <input type="hidden" name="udf5" value={formData.udf5} />}
//         </form>

//         {/* Info Text */}
//         <p className="text-xs text-gray-500 mt-4">
//           If you are not redirected automatically, please click the form submit button
//         </p>
//       </div>
//     </div>
//   );
// };

// console.log('✅ PayUCheckout Component loaded - PRODUCTION v1.0');
// ═══════════════════════════════════════════════════════════════
// ✅ PAYMENT CHECKOUT - PRODUCTION v3.0 (AUTO-REDIRECT FIXED)
// ═══════════════════════════════════════════════════════════════

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loadRazorpayScript, updatePaymentStatus, verifyPayment } from '../../lib/paymentService';
import { createSubscription } from '../../lib/subscriptionService';
import { getPlanById } from '../../lib/planService';
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
  onError?: (error: string) => void;
  onSuccess?: () => void;
}

export const PaymentCheckout: React.FC<PaymentCheckoutProps> = ({
  checkoutOptions,
  paymentId,
  planId,
  sellerId,
  onError,
  onSuccess
}) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    initializeRazorpay();
  }, []);

  const initializeRazorpay = async () => {
    try {
      console.log('🔄 Initializing Razorpay checkout (TEST MODE)...');
      
      const scriptLoaded = await loadRazorpayScript();
      
      if (!scriptLoaded) {
        throw new Error('Failed to load Razorpay. Please check your internet connection.');
      }
      
      await new Promise(resolve => setTimeout(resolve, 500));
      
      openRazorpayCheckout();
      
    } catch (err: any) {
      console.error('❌ Razorpay initialization error:', err);
      const errorMsg = err.message || 'Failed to initialize payment';
      setError(errorMsg);
      if (onError) onError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const openRazorpayCheckout = () => {
    try {
      const options: RazorpayCheckoutOptions = {
        ...checkoutOptions,
        handler: handlePaymentSuccess,
        modal: {
          ...checkoutOptions.modal,
          ondismiss: handlePaymentDismiss
        }
      };
      
      const razorpay = new window.Razorpay(options);
      
      razorpay.on('payment.failed', handlePaymentFailure);
      
      razorpay.open();
      
      console.log('✅ Razorpay checkout opened (TEST MODE)');
      
    } catch (err: any) {
      console.error('❌ Error opening checkout:', err);
      setError('Failed to open payment window');
      if (onError) onError(err.message);
    }
  };

  const handlePaymentSuccess = async (response: RazorpaySuccessResponse) => {
    try {
      console.log('✅ Payment successful (TEST MODE):', response);
      
      // Verify payment
      const verifyResult = await verifyPayment(paymentId, response);
      
      if (!verifyResult.success) {
        throw new Error('Payment verification failed');
      }
      
      console.log('✅ Payment verified');
      
      // Get plan details
      const plan = await getPlanById(planId);
      
      if (!plan) {
        console.warn('⚠️ Plan not found, but payment successful');
      }
      
      // Create subscription
      if (plan) {
        console.log('📝 Creating subscription...');
        const subscriptionResult = await createSubscription({
          seller_id: sellerId,
          plan_id: planId,
          payment_id: paymentId,
          billing_cycle: plan.billing_cycle
        });
        
        if (!subscriptionResult.success) {
          console.error('⚠️ Subscription creation failed:', subscriptionResult.error);
          throw new Error('Subscription creation failed');
        } else {
          console.log('✅ Subscription created successfully:', subscriptionResult.subscriptionId);
        }
      }
      
      // Show success message
      alert('✅ Payment Successful!\n\nYour plan is now active. Redirecting to dashboard...');
      
      // Call onSuccess callback if provided
      if (onSuccess) {
        onSuccess();
      }
      
      // ✅ REDIRECT TO DASHBOARD WITH FORCE RELOAD
      console.log('🔄 Redirecting to dashboard...');
      
      // Use window.location for hard refresh
      window.location.href = '/seller-dashboard?plan_activated=true';
      
    } catch (err: any) {
      console.error('❌ Post-payment processing error:', err);
      alert('❌ Payment successful but activation failed.\n\nPlease contact support with payment ID: ' + paymentId);
      
      if (onError) {
        onError(err.message);
      }
    }
  };

  const handlePaymentFailure = async (response: RazorpayErrorResponse) => {
    console.error('❌ Payment failed:', response);
    
    const errorMsg = response.error?.description || 'Payment failed';
    
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
    
    alert('❌ Payment Failed\n\n' + errorMsg);
    
    if (onError) {
      onError(errorMsg);
    }
    
    // Redirect back to dashboard
    window.location.href = '/seller-dashboard';
  };

  const handlePaymentDismiss = async () => {
    console.log('⚠️ Payment modal dismissed by user');
    
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
    
    alert('⚠️ Payment Cancelled\n\nYou cancelled the payment.');
    
    if (onError) {
      onError('Payment cancelled by user');
    }
    
    // Redirect back to dashboard
    window.location.href = '/seller-dashboard';
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Payment Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.href = '/seller-dashboard'}
            className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors font-medium"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
        
        <div className="text-center mb-6">
          <div className="text-6xl mb-4 animate-bounce">🔒</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            {loading ? 'Opening Payment Gateway' : 'Payment Window Opened'}
          </h2>
          <p className="text-gray-600 text-sm">
            {loading 
              ? 'Please wait while we load secure Razorpay checkout...'
              : 'Complete payment in the Razorpay window'}
          </p>
        </div>

        <div className="mb-6 bg-yellow-50 border-2 border-yellow-400 rounded-xl p-3">
          <div className="flex items-center justify-center gap-2 text-yellow-800 font-semibold">
            <span className="text-xl">⚠️</span>
            <span className="text-sm">TEST MODE</span>
          </div>
          <p className="text-xs text-yellow-700 text-center mt-1">
            No real money will be charged
          </p>
        </div>

        {loading && (
          <div className="mb-6">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-green-600 mx-auto mb-4"></div>
            <div className="space-y-2 text-sm text-gray-500">
              <p className="flex items-center justify-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                Loading Razorpay...
              </p>
            </div>
          </div>
        )}

        <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
          <div className="flex items-center justify-center gap-2 text-green-800 font-semibold mb-2">
            <span className="text-2xl">🛡️</span>
            <span>Secure Payment</span>
          </div>
          <p className="text-sm text-green-700 text-center">
            Your payment is processed securely through Razorpay's encrypted gateway
          </p>
        </div>

        <div className="bg-gray-50 rounded-xl p-4 mb-6 text-left">
          <h3 className="font-semibold text-gray-800 mb-3 text-sm">Payment Details:</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Plan:</span>
              <span className="font-medium text-gray-800">{checkoutOptions.description}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Amount:</span>
              <span className="font-bold text-purple-600 text-lg">
                ₹{(checkoutOptions.amount / 100).toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        </div>

        <p className="text-xs text-gray-500 text-center">
          If payment window doesn't open, please check if popups are blocked
        </p>
      </div>
    </div>
  );
};

console.log('✅ PaymentCheckout Component loaded - PRODUCTION v3.0 (AUTO-REDIRECT)');
