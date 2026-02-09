// ═══════════════════════════════════════════════════════════════
// ✅ PAYMENT CHECKOUT - RAZORPAY PRODUCTION v1.0
// Opens Razorpay payment modal
// ═══════════════════════════════════════════════════════════════

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loadRazorpayScript, updatePaymentStatus } from '../../lib/paymentService';
import { createSubscription } from '../../lib/subscriptionService';
import { getPlanById } from '../../lib/planService';
import type { RazorpayCheckoutOptions, RazorpaySuccessResponse, RazorpayErrorResponse } from '../../types/payment.types';

interface PaymentCheckoutProps {
  checkoutOptions: RazorpayCheckoutOptions;
  paymentId: string;
  planId: string;
  sellerId: string;
  onError?: (error: string) => void;
}

export const PaymentCheckout: React.FC<PaymentCheckoutProps> = ({
  checkoutOptions,
  paymentId,
  planId,
  sellerId,
  onError
}) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    initializeRazorpay();
  }, []);

  const initializeRazorpay = async () => {
    try {
      console.log('🔄 Initializing Razorpay checkout...');
      
      // Load Razorpay script
      const scriptLoaded = await loadRazorpayScript();
      
      if (!scriptLoaded) {
        throw new Error('Failed to load Razorpay. Please check your internet connection.');
      }
      
      // Open Razorpay checkout
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
          ondismiss: handlePaymentDismiss
        }
      };
      
      const razorpay = new window.Razorpay(options);
      
      razorpay.on('payment.failed', handlePaymentFailure);
      
      razorpay.open();
      
      console.log('✅ Razorpay checkout opened');
      
    } catch (err: any) {
      console.error('❌ Error opening checkout:', err);
      setError('Failed to open payment window');
      if (onError) onError(err.message);
    }
  };

  const handlePaymentSuccess = async (response: RazorpaySuccessResponse) => {
    try {
      console.log('✅ Payment successful:', response);
      
      // Update payment status
      const updateResult = await updatePaymentStatus(paymentId, response, true);
      
      if (!updateResult.success) {
        throw new Error('Failed to update payment status');
      }
      
      // Get plan details for subscription
      const plan = await getPlanById(planId);
      
      if (!plan) {
        throw new Error('Plan not found');
      }
      
      // Create subscription
      const subscriptionResult = await createSubscription({
        seller_id: sellerId,
        plan_id: planId,
        payment_id: paymentId,
        billing_cycle: plan.billing_cycle
      });
      
      if (!subscriptionResult.success) {
        console.warn('⚠️ Subscription creation failed:', subscriptionResult.error);
      }
      
      // Redirect to success page
      navigate(`/payment-success?payment_id=${paymentId}&razorpay_payment_id=${response.razorpay_payment_id}`);
      
    } catch (err: any) {
      console.error('❌ Post-payment processing error:', err);
      navigate(`/payment-failure?payment_id=${paymentId}&error=${encodeURIComponent(err.message)}`);
    }
  };

  const handlePaymentFailure = (response: RazorpayErrorResponse) => {
    console.error('❌ Payment failed:', response);
    
    const errorMsg = response.error?.description || 'Payment failed';
    
    navigate(`/payment-failure?payment_id=${paymentId}&error=${encodeURIComponent(errorMsg)}`);
  };

  const handlePaymentDismiss = () => {
    console.log('⚠️ Payment modal dismissed by user');
    
    navigate(`/payment-failure?payment_id=${paymentId}&error=Payment cancelled by user`);
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Payment Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors font-medium"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
        
        {/* Header */}
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

        {/* Loading Animation */}
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

        {/* Security Info */}
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
          <div className="flex items-center justify-center gap-2 text-green-800 font-semibold mb-2">
            <span className="text-2xl">🛡️</span>
            <span>Secure Payment</span>
          </div>
          <p className="text-sm text-green-700 text-center">
            Your payment is processed securely through Razorpay's encrypted gateway
          </p>
        </div>

        {/* Payment Details */}
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
            <div className="flex justify-between">
              <span className="text-gray-600">Order ID:</span>
              <span className="font-mono text-gray-800 text-xs">{checkoutOptions.order_id}</span>
            </div>
          </div>
        </div>

        {/* Info Text */}
        <p className="text-xs text-gray-500 text-center">
          If payment window doesn't open, please check if popups are blocked
        </p>
      </div>
    </div>
  );
};

console.log('✅ PaymentCheckout Component loaded - RAZORPAY PRODUCTION v1.0');