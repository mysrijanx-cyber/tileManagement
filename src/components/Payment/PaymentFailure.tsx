// ═══════════════════════════════════════════════════════════════
// ✅ PAYMENT FAILURE - PRODUCTION READY v2.0
// ═══════════════════════════════════════════════════════════════

import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { XCircle, RefreshCw, Home, Mail } from 'lucide-react';
import { getPaymentById, updatePaymentStatus } from '../../lib/paymentService';
import type { Payment } from '../../types/payment.types';

export const PaymentFailure: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [payment, setPayment] = useState<Payment | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [failureReason, setFailureReason] = useState<string>('');

  useEffect(() => {
    handlePaymentFailure();
  }, []);

  const handlePaymentFailure = async () => {
    try {
      console.log('❌ Processing payment failure...');

      const paymentId = searchParams.get('payment_id');
      const error = searchParams.get('error');

      setErrorMessage(error || 'Payment failed');
      setFailureReason(error || 'Unknown error');

      if (paymentId) {
        const paymentData = await getPaymentById(paymentId);
        
        if (paymentData) {
          setPayment(paymentData);
          
          if (paymentData.payment_status !== 'failed') {
            await updatePaymentStatus(
              paymentId,
              {
                razorpay_payment_id: '',
                razorpay_order_id: paymentData.razorpay_order_id,
                razorpay_signature: ''
              },
              false
            );
          }
        }
      }

      setLoading(false);

    } catch (err: any) {
      console.error('❌ Error processing failure:', err);
      setErrorMessage(err.message || 'Error processing payment failure');
      setLoading(false);
    }
  };

  const handleRetry = () => {
    navigate('/?showPlans=true');
  };

  const handleContactSupport = () => {
    const subject = encodeURIComponent('Payment Issue - Help Required');
    const body = encodeURIComponent(
      `Payment ID: ${payment?.id || 'N/A'}\n` +
      `Transaction ID: ${payment?.transaction_id || 'N/A'}\n` +
      `Error: ${errorMessage}\n` +
      `Date: ${new Date().toLocaleString()}\n\n` +
      `Please describe your issue:`
    );
    window.location.href = `mailto:support@srijanxtile.com?subject=${subject}&body=${body}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-orange-600 mx-auto mb-6"></div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Processing Response
          </h2>
          <p className="text-gray-600">
            Please wait...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden">
        
        <div className="bg-gradient-to-r from-red-600 to-orange-600 text-white p-8 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full mb-4">
            <XCircle className="w-12 h-12 text-red-600" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Payment Failed</h1>
          <p className="text-red-100">
            Your transaction could not be completed
          </p>
        </div>

        <div className="p-8">
          
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-6">
            <h3 className="font-semibold text-red-800 mb-2 flex items-center gap-2">
              <span className="text-xl">⚠️</span>
              What went wrong?
            </h3>
            <p className="text-red-700 text-sm mb-3">
              {failureReason}
            </p>
            {errorMessage && errorMessage !== failureReason && (
              <p className="text-red-600 text-xs bg-red-100 rounded p-2 font-mono">
                Error: {errorMessage}
              </p>
            )}
          </div>

          {payment && (
            <div className="bg-gray-50 rounded-xl p-6 mb-6">
              <h3 className="font-semibold text-gray-800 mb-4">
                📋 Transaction Details
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment ID:</span>
                  <span className="font-mono text-gray-800">{payment.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Transaction ID:</span>
                  <span className="font-mono text-gray-800">{payment.transaction_id || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Attempted Amount:</span>
                  <span className="font-medium text-gray-800">
                    ₹{payment.amount.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Plan:</span>
                  <span className="text-gray-800">{payment.plan_name || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Date & Time:</span>
                  <span className="text-gray-800">
                    {new Date(payment.created_at).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          )}

          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-6">
            <h3 className="font-semibold text-yellow-800 mb-3">
              💡 Common Reasons for Payment Failure
            </h3>
            <ul className="space-y-2 text-sm text-yellow-700">
              <li className="flex items-start gap-2">
                <span>•</span>
                <span>Insufficient balance in account</span>
              </li>
              <li className="flex items-start gap-2">
                <span>•</span>
                <span>Card expired or blocked by bank</span>
              </li>
              <li className="flex items-start gap-2">
                <span>•</span>
                <span>Incorrect CVV or OTP entered</span>
              </li>
              <li className="flex items-start gap-2">
                <span>•</span>
                <span>Transaction limit exceeded</span>
              </li>
              <li className="flex items-start gap-2">
                <span>•</span>
                <span>Bank server issues or maintenance</span>
              </li>
              <li className="flex items-start gap-2">
                <span>•</span>
                <span>Payment cancelled by user</span>
              </li>
            </ul>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6">
            <h3 className="font-semibold text-blue-800 mb-3">
              💰 About Refunds
            </h3>
            <p className="text-sm text-blue-700 mb-2">
              If any amount was deducted from your account:
            </p>
            <ul className="space-y-1 text-sm text-blue-600 ml-4">
              <li>• It will be automatically refunded by Razorpay</li>
              <li>• Refund processing time: 5-7 business days</li>
              <li>• Amount will be credited to the same payment source</li>
            </ul>
            <p className="text-xs text-blue-600 mt-3">
              For refund queries, contact Razorpay support with your transaction ID
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
            <button
              onClick={handleRetry}
              className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl font-medium flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-5 h-5" />
              Retry Payment
            </button>
            
            <button
              onClick={handleContactSupport}
              className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors font-medium flex items-center justify-center gap-2"
            >
              <Mail className="w-5 h-5" />
              Contact Support
            </button>
            
            <button
              onClick={() => navigate('/')}
              className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors font-medium flex items-center justify-center gap-2"
            >
              <Home className="w-5 h-5" />
              Go Home
            </button>
          </div>

          <div className="text-center text-sm text-gray-500 border-t pt-6">
            <p className="mb-2">Need immediate assistance?</p>
            <p>
              Email:{' '}
              <a href="mailto:support@srijanxtile.com" className="text-purple-600 hover:underline font-medium">
                support@srijanxtile.com
              </a>
            </p>
            <p className="mt-1">
              Phone:{' '}
              <a href="tel:+919999999999" className="text-purple-600 hover:underline font-medium">
                +91 99999 99999
              </a>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

console.log('✅ PaymentFailure Component loaded - PRODUCTION v2.0');