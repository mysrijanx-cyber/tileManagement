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

              <div className="grid grid-cols-2 gap-4 mt-4 p-4 bg-white rounded-lg border border-purple-200">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-purple-600" />
                  <div>
                    <p className="text-xs text-gray-600">Billing Cycle</p>
                    <p className="font-semibold text-gray-800 capitalize">
                      {plan.billing_cycle}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-purple-600" />
                  <div>
                    <p className="text-xs text-gray-600">Total Amount</p>
                    <p className="font-semibold text-gray-800">
                      ₹{plan.price.toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                Features Included
              </h4>
              <div className="space-y-2">
                {plan.features.filter(f => f.included).map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg
                        className="w-3 h-3 text-green-600"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="3"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path d="M5 13l4 4L19 7"></path>
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-800">
                        {feature.icon && <span className="mr-2">{feature.icon}</span>}
                        {feature.title}
                      </p>
                      {feature.description && (
                        <p className="text-xs text-gray-600 mt-1">
                          {feature.description}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {plan.limits && (
              <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="font-semibold text-gray-800 mb-3 text-sm">
                  📊 Plan Limits
                </h4>
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Max Tiles</p>
                    <p className="text-lg font-bold text-blue-600">
                      {plan.limits.max_tiles === -1 ? '∞' : plan.limits.max_tiles}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-1">QR Codes</p>
                    <p className="text-lg font-bold text-blue-600">
                      {plan.limits.max_qr_codes === -1 ? '∞' : plan.limits.max_qr_codes}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Workers</p>
                    <p className="text-lg font-bold text-blue-600">
                      {plan.limits.max_workers === -1 ? '∞' : plan.limits.max_workers}
                    </p>
                  </div>
                </div>
              </div>
            )}

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