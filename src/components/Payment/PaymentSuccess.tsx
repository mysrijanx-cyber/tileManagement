// ═══════════════════════════════════════════════════════════════
// ✅ PAYMENT SUCCESS PAGE - RAZORPAY PRODUCTION v1.0
// ═══════════════════════════════════════════════════════════════

import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, Download, Home, CreditCard } from 'lucide-react';
import { getPaymentById } from '../../lib/paymentService';
import { getPlanById } from '../../lib/planService';
import type { Payment } from '../../types/payment.types';
import type { Plan } from '../../types/plan.types';

export const PaymentSuccess: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [payment, setPayment] = useState<Payment | null>(null);
  const [plan, setPlan] = useState<Plan | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadPaymentDetails();
  }, []);

  const loadPaymentDetails = async () => {
    try {
      const paymentId = searchParams.get('payment_id');
      
      if (!paymentId) {
        throw new Error('Payment ID not found');
      }
      
      console.log('📋 Loading payment details:', paymentId);
      
      const paymentData = await getPaymentById(paymentId);
      
      if (!paymentData) {
        throw new Error('Payment record not found');
      }
      
      setPayment(paymentData);
      
      // Load plan details
      const planData = await getPlanById(paymentData.plan_id);
      setPlan(planData);
      
      setLoading(false);
      
    } catch (err: any) {
      console.error('❌ Error loading payment:', err);
      setError(err.message);
      setLoading(false);
    }
  };

  const handleDownloadReceipt = () => {
    if (!payment || !plan) return;

    const receipt = `
═══════════════════════════════════════
       PAYMENT RECEIPT
═══════════════════════════════════════

Business: SrijanX Tile
Date: ${new Date().toLocaleString()}

───────────────────────────────────────
PAYMENT DETAILS
───────────────────────────────────────

Razorpay Payment ID: ${payment.razorpay_payment_id || 'N/A'}
Razorpay Order ID: ${payment.razorpay_order_id}
Receipt Number: ${payment.razorpay_receipt}
Status: ${payment.payment_status.toUpperCase()}

───────────────────────────────────────
PLAN DETAILS
───────────────────────────────────────

Plan: ${plan.plan_name}
Amount: ₹${payment.amount.toLocaleString('en-IN')}
Currency: ${payment.currency}
Billing: ${plan.billing_cycle}

───────────────────────────────────────
CUSTOMER DETAILS
───────────────────────────────────────

Name: ${payment.seller_business}
Email: ${payment.seller_email}

───────────────────────────────────────

Thank you for your purchase!

For support, contact: support@srijanxtile.com

═══════════════════════════════════════
    `.trim();

    const blob = new Blob([receipt], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Receipt_${payment.razorpay_receipt}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-6"></div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Verifying Payment
          </h2>
          <p className="text-gray-600">
            Please wait while we confirm your payment...
          </p>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Error Loading Payment
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors font-medium"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  // Success State
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden">
        
        {/* Success Header */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-8 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full mb-4 animate-bounce">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Payment Successful!</h1>
          <p className="text-green-100">
            Your subscription has been activated
          </p>
        </div>

        {/* Payment Details */}
        <div className="p-8">
          
          {/* Success Message */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center gap-2 mb-6">
            <span className="text-green-600">✓</span>
            <span className="text-sm text-green-800 font-medium">Payment Verified & Subscription Activated</span>
          </div>

          {/* Transaction Info */}
          {payment && (
            <div className="bg-gray-50 rounded-xl p-6 mb-6">
              <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-purple-600" />
                Transaction Details
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Razorpay Payment ID:</span>
                  <span className="font-mono text-gray-800">{payment.razorpay_payment_id || 'Processing...'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Order ID:</span>
                  <span className="font-mono text-gray-800">{payment.razorpay_order_id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Receipt Number:</span>
                  <span className="font-mono text-gray-800">{payment.razorpay_receipt}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Amount Paid:</span>
                  <span className="font-bold text-green-600">
                    ₹{payment.amount.toLocaleString('en-IN')}
                  </span>
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

          {/* Plan Info */}
          {plan && (
            <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-6 mb-6 border-2 border-purple-200">
              <h3 className="font-semibold text-gray-800 mb-4">
                📦 Activated Plan
              </h3>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h4 className="text-xl font-bold text-purple-600 mb-1">
                    {plan.plan_name}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {plan.billing_cycle === 'monthly' ? 'Monthly' : 'Yearly'} Subscription
                  </p>
                </div>
                {plan.is_popular && (
                  <span className="bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full">
                    ⭐ POPULAR
                  </span>
                )}
              </div>
              <div className="space-y-2">
                {plan.features.filter(f => f.included).slice(0, 3).map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-sm text-gray-700">
                    <span className="text-green-600">✓</span>
                    <span>{feature.title}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Next Steps */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6">
            <h3 className="font-semibold text-blue-800 mb-3">
              🎉 What's Next?
            </h3>
            <ol className="space-y-2 text-sm text-blue-700">
              <li className="flex items-start gap-2">
                <span className="font-bold">1.</span>
                <span>Access your seller dashboard to manage your business</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold">2.</span>
                <span>Upload tiles and create your virtual showroom</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold">3.</span>
                <span>Generate QR codes for your tiles</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold">4.</span>
                <span>Track analytics and customer engagement</span>
              </li>
            </ol>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleDownloadReceipt}
              className="flex-1 bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors font-medium flex items-center justify-center gap-2"
            >
              <Download className="w-5 h-5" />
              Download Receipt
            </button>
            <button
              onClick={() => navigate('/seller')}
              className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl font-medium flex items-center justify-center gap-2"
            >
              <Home className="w-5 h-5" />
              Go to Dashboard
            </button>
          </div>

          {/* Support Info */}
          <div className="mt-6 text-center text-sm text-gray-500">
            <p>Need help? Contact us at{' '}
              <a href="mailto:support@srijanxtile.com" className="text-purple-600 hover:underline">
                support@srijanxtile.com
              </a>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

console.log('✅ PaymentSuccess Component loaded - RAZORPAY PRODUCTION v1.0');