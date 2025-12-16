// ═══════════════════════════════════════════════════════════════
// ✅ PAYMENT CHECKOUT - PRODUCTION v1.0
// Auto-submits PayU form to payment gateway
// ═══════════════════════════════════════════════════════════════

import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PAYU_CONFIG } from '../../lib/paymentService';
import type { PayUFormData } from '../../types/payment.types';

interface PaymentCheckoutProps {
  formData: PayUFormData | null;
  onError?: (error: string) => void;
}

export const PaymentCheckout: React.FC<PaymentCheckoutProps> = ({
  formData,
  onError
}) => {
  const formRef = useRef<HTMLFormElement>(null);
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(3);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!formData) {
      setError('Payment data not found. Redirecting...');
      setTimeout(() => {
        navigate('/');
      }, 3000);
      return;
    }

    // Countdown before submission
    const countdownInterval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownInterval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Auto-submit form after countdown
    const submitTimer = setTimeout(() => {
      try {
        if (formRef.current) {
          console.log('🚀 Submitting PayU form...');
          console.log('📝 Transaction ID:', formData.txnid);
          console.log('💰 Amount:', formData.amount);
          formRef.current.submit();
        }
      } catch (err: any) {
        console.error('❌ Form submission error:', err);
        const errorMsg = 'Failed to redirect to payment gateway';
        setError(errorMsg);
        if (onError) onError(errorMsg);
      }
    }, 3000);

    return () => {
      clearInterval(countdownInterval);
      clearTimeout(submitTimer);
    };
  }, [formData, navigate, onError]);

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

  if (!formData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading payment data...</p>
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
            Redirecting to Payment Gateway
          </h2>
          <p className="text-gray-600 text-sm">
            Please wait while we securely redirect you to PayU
          </p>
        </div>

        {/* Countdown */}
        <div className="mb-6">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
              {countdown}
            </div>
          </div>
          <p className="text-center text-sm text-gray-500">
            Redirecting in {countdown} second{countdown !== 1 ? 's' : ''}...
          </p>
        </div>

        {/* Payment Details */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6 space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Transaction ID:</span>
            <span className="font-mono text-gray-800">{formData.txnid}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Amount:</span>
            <span className="font-bold text-green-600">₹{formData.amount}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Plan:</span>
            <span className="font-medium text-gray-800">{formData.productinfo}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Email:</span>
            <span className="text-gray-800">{formData.email}</span>
          </div>
        </div>

        {/* Security Notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-6">
          <div className="flex items-start gap-2">
            <div className="text-lg">🛡️</div>
            <div className="flex-1">
              <p className="text-xs text-blue-800 font-medium mb-1">
                Secure Payment Gateway
              </p>
              <p className="text-xs text-blue-700">
                You're being redirected to PayU's secure payment page. 
                All transactions are encrypted and secure.
              </p>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
          <div 
            className="bg-gradient-to-r from-green-500 to-emerald-500 h-full transition-all duration-1000 ease-linear"
            style={{ width: `${((3 - countdown) / 3) * 100}%` }}
          ></div>
        </div>

        {/* Hidden PayU Form */}
        <form
          ref={formRef}
          action={PAYU_CONFIG.base_url}
          method="POST"
          style={{ display: 'none' }}
        >
          <input type="hidden" name="key" value={formData.key} />
          <input type="hidden" name="txnid" value={formData.txnid} />
          <input type="hidden" name="amount" value={formData.amount} />
          <input type="hidden" name="productinfo" value={formData.productinfo} />
          <input type="hidden" name="firstname" value={formData.firstname} />
          <input type="hidden" name="email" value={formData.email} />
          <input type="hidden" name="phone" value={formData.phone} />
          <input type="hidden" name="surl" value={formData.surl} />
          <input type="hidden" name="furl" value={formData.furl} />
          <input type="hidden" name="hash" value={formData.hash} />
          {formData.udf1 && <input type="hidden" name="udf1" value={formData.udf1} />}
          {formData.udf2 && <input type="hidden" name="udf2" value={formData.udf2} />}
          {formData.udf3 && <input type="hidden" name="udf3" value={formData.udf3} />}
          {formData.udf4 && <input type="hidden" name="udf4" value={formData.udf4} />}
          {formData.udf5 && <input type="hidden" name="udf5" value={formData.udf5} />}
        </form>

        {/* Loading Indicator */}
        <div className="mt-6 text-center">
          <div className="inline-flex items-center gap-2 text-gray-500 text-xs">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-400"></div>
            <span>Establishing secure connection...</span>
          </div>
        </div>

      </div>
    </div>
  );
};

console.log('✅ PaymentCheckout Component loaded - PRODUCTION v1.0');