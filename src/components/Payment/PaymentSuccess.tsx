
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, Download, Home, CreditCard } from 'lucide-react';
import { getPaymentDetails } from '../../lib/backendAPI';
import { useAuth } from '../../contexts/AuthContext';

export const PaymentSuccess: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const [loading, setLoading] = useState(true);
  const [payment, setPayment] = useState<any>(null);
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

      if (!currentUser) {
        throw new Error('User not authenticated');
      }
      
      console.log('📋 Loading payment details:', paymentId);

      const token = await currentUser.getIdToken();
      const response = await getPaymentDetails(paymentId, token);
      
      if (!response.success) {
        throw new Error('Payment record not found');
      }
      
      setPayment(response.data.payment);
      setLoading(false);
      
    } catch (err: any) {
      console.error('❌ Error loading payment:', err);
      setError(err.message);
      setLoading(false);
    }
  };

  const handleDownloadReceipt = () => {
    if (!payment) return;

    const receipt = `
═══════════════════════════════════════
       PAYMENT RECEIPT
═══════════════════════════════════════

Business: SrijanX Tile
Date: ${new Date().toLocaleString()}

───────────────────────────────────────
PAYMENT DETAILS
───────────────────────────────────────

Payment ID: ${payment.razorpay_payment_id || 'N/A'}
Order ID: ${payment.razorpay_order_id || 'N/A'}
Receipt: ${payment.razorpay_receipt}
Status: ${payment.status.toUpperCase()}

───────────────────────────────────────
PLAN DETAILS
───────────────────────────────────────

Plan: ${payment.plan_name}
Amount: ₹${payment.amount.toLocaleString('en-IN')}
Currency: ${payment.currency}

───────────────────────────────────────

Thank you for your purchase!
Support: support@srijanxtile.com

═══════════════════════════════════════
    `.trim();

    const blob = new Blob([receipt], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Receipt_${payment.id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-6"></div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Verifying Payment</h2>
          <p className="text-gray-600">Please wait...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden">
        
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-8 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full mb-4 animate-bounce">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Payment Successful!</h1>
          <p className="text-green-100">Your subscription has been activated</p>
        </div>

        <div className="p-8">
          
          <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center gap-2 mb-6">
            <span className="text-green-600">✓</span>
            <span className="text-sm text-green-800 font-medium">Payment Verified</span>
          </div>

          {payment && (
            <div className="bg-gray-50 rounded-xl p-6 mb-6">
              <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-purple-600" />
                Transaction Details
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment ID:</span>
                  <span className="font-mono text-gray-800">{payment.razorpay_payment_id || 'Processing...'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Order ID:</span>
                  <span className="font-mono text-gray-800">{payment.razorpay_order_id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Amount:</span>
                  <span className="font-bold text-green-600">
                    ₹{payment.amount.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Plan:</span>
                  <span className="text-gray-800">{payment.plan_name}</span>
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleDownloadReceipt}
              className="flex-1 bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 font-medium flex items-center justify-center gap-2"
            >
              <Download className="w-5 h-5" />
              Download Receipt
            </button>
            <button
              onClick={() => navigate('/seller-dashboard')}
              className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-indigo-700 font-medium flex items-center justify-center gap-2"
            >
              <Home className="w-5 h-5" />
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

console.log('✅ PaymentSuccess - v3.1 (Fixed)');