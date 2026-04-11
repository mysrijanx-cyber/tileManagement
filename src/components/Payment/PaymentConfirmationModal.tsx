// ═══════════════════════════════════════════════════════════════
// ✅ PAYMENT CONFIRMATION MODAL - PRODUCTION READY v2.0
// ═══════════════════════════════════════════════════════════════

import React, { useState } from 'react';
import { X, CheckCircle, Clock, CreditCard } from 'lucide-react';
import type { Plan } from '../../types/plan.types';

interface PaymentConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: Plan | null;
  onConfirm: () => void;
  isProcessing?: boolean;
}

export const PaymentConfirmationModal: React.FC<PaymentConfirmationModalProps> = ({
  isOpen,
  onClose,
  plan,
  onConfirm,
  isProcessing = false
}) => {
  const [termsAccepted, setTermsAccepted] = useState(false);

  if (!isOpen || !plan) return null;

  const handleConfirm = () => {
    if (!termsAccepted) {
      alert('⚠️ Please accept the terms and conditions');
      return;
    }
    onConfirm();
  };

  return (
    <div className="fixed inset-0 z-[60] overflow-y-auto">
      <div 
        className="fixed inset-0 bg-black bg-opacity-60 transition-opacity"
        onClick={!isProcessing ? onClose : undefined}
      ></div>

      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
          
          <div className="sticky top-0 bg-gradient-to-r from-green-600 to-emerald-600 text-white p-6 z-10">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-1">✅ Confirm Your Purchase</h2>
                <p className="text-green-100 text-sm">Review plan details before payment</p>
              </div>
              {!isProcessing && (
                <button
                  onClick={onClose}
                  className="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-2 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              )}
            </div>
          </div>

          <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
            
            <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-6 mb-6 border-2 border-purple-200">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">
                    {plan.plan_name}
                  </h3>
                  {plan.is_popular && (
                    <span className="inline-block bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full">
                      ⭐ POPULAR CHOICE
                    </span>
                  )}
                </div>
                <div className="text-right">
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-extrabold text-purple-600">
                      ₹{plan.price.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    per {plan.billing_cycle === 'monthly' ? 'month' : 'year'}
                  </p>
                </div>
              </div>


            </div>

           

            
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4 mb-6">
              <div className="flex items-start gap-3">
                <div className="text-2xl">🔒</div>
                <div className="flex-1">
                  <h4 className="font-semibold text-green-800 mb-1 text-sm">
                    Secure Payment via Razorpay
                  </h4>
                  <p className="text-xs text-green-700">
                    Your payment is processed through Razorpay's secure payment gateway. 
                    We don't store any card information.
                  </p>
                </div>
              </div>
            </div>

            <div className="mb-6 bg-yellow-50 border-2 border-yellow-400 rounded-xl p-4">
              <div className="flex items-center justify-center gap-2 text-yellow-800 font-semibold mb-2">
                <span className="text-xl">⚠️</span>
                <span className="text-sm">TEST MODE</span>
              </div>
              <p className="text-xs text-yellow-700 text-center">
                This is a test transaction. No real money will be charged.
              </p>
            </div>

            <div className="mb-6">
              <label className="flex items-start gap-3 cursor-pointer p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <input
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="w-5 h-5 text-purple-600 rounded mt-0.5"
                  disabled={isProcessing}
                />
                <div className="flex-1">
                  <p className="text-sm text-gray-800">
                    I agree to the{' '}
                    <a href="#" className="text-purple-600 hover:underline font-medium">
                      Terms and Conditions
                    </a>
                    {' '}and{' '}
                    <a href="#" className="text-purple-600 hover:underline font-medium">
                      Privacy Policy
                    </a>
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    By proceeding, you authorize SrijanX Tile to charge ₹{plan.price.toLocaleString('en-IN')} 
                    {' '}{plan.billing_cycle === 'monthly' ? 'monthly' : 'yearly'}
                  </p>
                </div>
              </label>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <h4 className="font-semibold text-blue-800 mb-3 text-sm">
                📝 What happens next?
              </h4>
              <ol className="space-y-2 text-xs text-blue-700">
                <li className="flex items-start gap-2">
                  <span className="font-bold">1.</span>
                  <span>You'll be redirected to Razorpay's secure payment page</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold">2.</span>
                  <span>Complete payment using Card/Net Banking/UPI</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold">3.</span>
                  <span>Your plan will be activated immediately after successful payment</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold">4.</span>
                  <span>Access your dashboard and start using premium features</span>
                </li>
              </ol>
            </div>

          </div>

          <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6">
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={isProcessing}
                className="flex-1 px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                disabled={!termsAccepted || isProcessing}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 font-medium transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none transform hover:-translate-y-0.5"
              >
                {isProcessing ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Processing...
                  </div>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <CreditCard className="w-5 h-5" />
                    Proceed to Payment
                  </span>
                )}
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

console.log('✅ PaymentConfirmationModal Component loaded - PRODUCTION v2.0');