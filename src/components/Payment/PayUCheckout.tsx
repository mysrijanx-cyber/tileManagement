
import React, { useEffect, useState } from 'react';
import { CheckCircle, XCircle, Loader } from 'lucide-react';
import { verifyPaymentBackend } from '../../lib/backendAPI';
import { useAuth } from '../../contexts/AuthContext';
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
  userToken?: string;
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
  const { currentUser } = useAuth();
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
      localStorage.removeItem('payment_processing');
    };
  }, []);

  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

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
      console.log('✅ Payment Success');
      
      setProcessing(true);
      localStorage.setItem('payment_processing', 'true');
      
      if (!currentUser) {
        throw new Error('User not authenticated');
      }

      setProcessingStep('Verifying payment...');
      const token = await currentUser.getIdToken();

      const verifyResult = await verifyPaymentBackend(
        paymentId,
        response.razorpay_order_id,
        response.razorpay_payment_id,
        response.razorpay_signature,
        token
      );

      if (!verifyResult.success) {
        throw new Error('Payment verification failed');
      }

      console.log('✅ Payment verified');
      
      setSuccess(true);
      setProcessing(false);
      setProcessingStep('');
      
      localStorage.removeItem('payment_processing');
      
      if (onSuccess) {
        setTimeout(() => {
          onSuccess();
        }, 2000);
      }
      
    } catch (err: any) {
      console.error('❌ Payment error:', err);
      
      const errorMsg = err.message || 'Processing failed';
      setError(errorMsg);
      setProcessing(false);
      setProcessingStep('');
      
      localStorage.removeItem('payment_processing');
      
      if (onError) onError(errorMsg);
    }
  };

  const handlePaymentFailure = async (response: RazorpayErrorResponse) => {
    console.error('❌ Payment failed:', response);
    
    const errorMsg = response.error?.description || 'Payment failed';
    setError(errorMsg);
    setLoading(false);
    
    localStorage.removeItem('payment_processing');
    
    if (onError) onError(errorMsg);
  };

  const handlePaymentDismiss = async () => {
    console.log('⚠️ Payment dismissed');
    
    const errorMsg = 'Payment cancelled';
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
          <p className="text-gray-600 mb-6">Your plan is now active</p>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-3"></div>
          <p className="text-xs text-gray-500">Redirecting...</p>
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
            className="w-full bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 font-medium"
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

  return (
    <div className="fixed inset-0 z-[9999] bg-black bg-opacity-75 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
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

        <div className="bg-gray-50 rounded-xl p-4">
          <h3 className="font-semibold text-gray-800 mb-3 text-sm">Payment Details:</h3>
          <div className="space-y-2 text-sm">
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

console.log('✅ PaymentCheckout - PRODUCTION v4.1 (All Errors Fixed)');