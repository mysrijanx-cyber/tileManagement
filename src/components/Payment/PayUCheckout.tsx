// ═══════════════════════════════════════════════════════════════
// ✅ PAYU CHECKOUT COMPONENT - PRODUCTION v1.0
// ═══════════════════════════════════════════════════════════════

import React, { useEffect, useRef } from 'react';
import { PAYU_CONFIG } from '../../lib/paymentService';
import type { PayUFormData } from '../../types/payment.types';

interface PayUCheckoutProps {
  formData: PayUFormData;
  onCancel: () => void;
}

export const PayUCheckout: React.FC<PayUCheckoutProps> = ({ formData, onCancel }) => {
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    // Auto-submit form on mount
    if (formRef.current) {
      console.log('🚀 Submitting PayU form...');
      formRef.current.submit();
    }
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-white flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        {/* Loading Animation */}
        <div className="mb-6">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Redirecting to Payment Gateway...
          </h2>
          <p className="text-gray-600 mb-4">
            Please wait while we securely redirect you to PayU
          </p>
        </div>

        {/* Security Info */}
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
          <div className="flex items-center justify-center gap-2 text-green-800 font-semibold mb-2">
            <span className="text-2xl">🔒</span>
            <span>Secure Payment</span>
          </div>
          <p className="text-sm text-green-700">
            Your payment is processed securely through PayU's encrypted gateway
          </p>
        </div>

        {/* Payment Details */}
        <div className="bg-gray-50 rounded-xl p-4 mb-6 text-left">
          <h3 className="font-semibold text-gray-800 mb-3">Payment Details:</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Plan:</span>
              <span className="font-medium text-gray-800">{formData.productinfo}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Amount:</span>
              <span className="font-bold text-purple-600 text-lg">₹{formData.amount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Email:</span>
              <span className="font-medium text-gray-800 text-xs">{formData.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Transaction ID:</span>
              <span className="font-mono text-gray-800 text-xs">{formData.txnid}</span>
            </div>
          </div>
        </div>

        {/* Cancel Button */}
        <button
          onClick={onCancel}
          className="w-full bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 font-medium transition-colors"
        >
          Cancel Payment
        </button>

        {/* Hidden PayU Form */}
        <form
          ref={formRef}
          method="POST"
          action={PAYU_CONFIG.base_url}
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

        {/* Info Text */}
        <p className="text-xs text-gray-500 mt-4">
          If you are not redirected automatically, please click the form submit button
        </p>
      </div>
    </div>
  );
};

console.log('✅ PayUCheckout Component loaded - PRODUCTION v1.0');