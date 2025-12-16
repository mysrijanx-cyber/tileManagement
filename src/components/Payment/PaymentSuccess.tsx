// // ═══════════════════════════════════════════════════════════════
// // ✅ PAYMENT SUCCESS PAGE - PRODUCTION v1.0
// // ═══════════════════════════════════════════════════════════════

// import React, { useEffect, useState } from 'react';
// import { useNavigate, useSearchParams } from 'react-router-dom';
// import { CheckCircle, Download, Home, Receipt } from 'lucide-react';
// import {
//   verifyPayUHash,
//   updatePaymentStatus,
//   getPaymentByTxnId
// } from '../../lib/paymentService';
// import { createSubscription } from '../../lib/subscriptionService';
// import { getPlanById } from '../../lib/planService';
// import type { PayUResponse, Payment } from '../../types/payment.types';
// import type { Plan } from '../../types/plan.types';

// export const PaymentSuccess: React.FC = () => {
//   const [searchParams] = useSearchParams();
//   const navigate = useNavigate();

//   const [verifying, setVerifying] = useState(true);
//   const [verified, setVerified] = useState(false);
//   const [payment, setPayment] = useState<Payment | null>(null);
//   const [plan, setPlan] = useState<Plan | null>(null);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     processPaymentResponse();
//   }, []);

//   const processPaymentResponse = async () => {
//     try {
//       console.log('✅ Processing payment success response...');

//       // Extract PayU response from URL params
//       const payuResponse: PayUResponse = {
//         status: searchParams.get('status') || '',
//         txnid: searchParams.get('txnid') || '',
//         amount: searchParams.get('amount') || '',
//         productinfo: searchParams.get('productinfo') || '',
//         firstname: searchParams.get('firstname') || '',
//         email: searchParams.get('email') || '',
//         phone: searchParams.get('phone') || '',
//         mihpayid: searchParams.get('mihpayid') || '',
//         mode: searchParams.get('mode') || '',
//         bank_ref_num: searchParams.get('bank_ref_num') || '',
//         bankcode: searchParams.get('bankcode') || '',
//         cardnum: searchParams.get('cardnum') || '',
//         hash: searchParams.get('hash') || '',
//         error: searchParams.get('error') || '',
//         error_Message: searchParams.get('error_Message') || ''
//       };

//       console.log('📋 PayU Response:', {
//         status: payuResponse.status,
//         txnid: payuResponse.txnid,
//         mihpayid: payuResponse.mihpayid
//       });

//       // Verify hash
//       console.log('🔐 Verifying response hash...');
//       const hashValid = await verifyPayUHash(payuResponse);

//       if (!hashValid) {
//         throw new Error('Payment verification failed - Invalid hash');
//       }

//       console.log('✅ Hash verified successfully');

//       // Get payment record
//       const paymentRecord = await getPaymentByTxnId(payuResponse.txnid);

//       if (!paymentRecord) {
//         throw new Error('Payment record not found');
//       }

//       setPayment(paymentRecord);

//       // Update payment status
//       await updatePaymentStatus(payuResponse.txnid, payuResponse, true);

//       // Get plan details
//       const planData = await getPlanById(paymentRecord.plan_id);
//       if (planData) {
//         setPlan(planData);
//       }

//       // Create subscription
//       console.log('📝 Creating subscription...');
//       const subscriptionResult = await createSubscription({
//         seller_id: paymentRecord.seller_id,
//         plan_id: paymentRecord.plan_id,
//         payment_id: paymentRecord.id,
//         billing_cycle: planData?.billing_cycle || 'monthly'
//       });

//       if (!subscriptionResult.success) {
//         console.warn('⚠️ Subscription creation failed:', subscriptionResult.error);
//         // Don't throw - payment was successful
//       } else {
//         console.log('✅ Subscription created:', subscriptionResult.subscriptionId);
//       }

//       setVerified(true);

//     } catch (err: any) {
//       console.error('❌ Error processing payment:', err);
//       setError(err.message || 'Payment verification failed');
//     } finally {
//       setVerifying(false);
//     }
//   };

//   const downloadInvoice = () => {
//     if (!payment || !plan) return;

//     const invoiceData = `
// TileVision Payment Invoice
// ═══════════════════════════════════════════

// Transaction ID: ${payment.payu_txn_id}
// PayU Payment ID: ${payment.payu_payment_id || 'N/A'}
// Date: ${new Date(payment.created_at).toLocaleString()}

// ═══════════════════════════════════════════

// Plan: ${plan.plan_name}
// Amount: ₹${payment.amount}
// Payment Method: ${payment.payu_mode || 'N/A'}

// Business: ${payment.seller_business}
// Email: ${payment.seller_email}

// Status: ${payment.payment_status.toUpperCase()}
// Verified: ${payment.verified ? 'YES' : 'NO'}

// ═══════════════════════════════════════════

// Thank you for your payment!
// For support, contact: support@tilevision.com
//     `.trim();

//     const blob = new Blob([invoiceData], { type: 'text/plain' });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement('a');
//     a.href = url;
//     a.download = `invoice_${payment.payu_txn_id}.txt`;
//     a.click();
//     URL.revokeObjectURL(url);
//   };

//   if (verifying) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
//         <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
//           <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-6"></div>
//           <h2 className="text-2xl font-bold text-gray-800 mb-2">Verifying Payment...</h2>
//           <p className="text-gray-600">Please wait while we confirm your payment</p>
//           <div className="mt-6 space-y-2 text-sm text-gray-500">
//             <p>✓ Validating transaction</p>
//             <p>✓ Verifying payment hash</p>
//             <p>✓ Creating subscription</p>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (error || !verified) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center p-4">
//         <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
//           <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
//             <span className="text-4xl">⚠️</span>
//           </div>
//           <h2 className="text-2xl font-bold text-red-800 mb-3">Verification Failed</h2>
//           <p className="text-red-600 mb-6">{error || 'Payment could not be verified'}</p>
//           <button
//             onClick={() => navigate('/seller')}
//             className="w-full bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 font-medium"
//           >
//             Back to Dashboard
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
//       <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden">
//         {/* Success Header */}
//         <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-8 text-center">
//           <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
//             <CheckCircle className="w-12 h-12 text-green-600" />
//           </div>
//           <h1 className="text-3xl font-bold mb-2">Payment Successful!</h1>
//           <p className="text-green-100">Your subscription has been activated</p>
//         </div>

//         {/* Payment Details */}
//         <div className="p-8">
//           <div className="bg-gray-50 rounded-xl p-6 mb-6">
//             <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
//               <Receipt className="w-5 h-5" />
//               Payment Details
//             </h3>

//             <div className="space-y-3">
//               {/* Plan Name */}
//               <div className="flex justify-between items-center">
//                 <span className="text-gray-600">Plan:</span>
//                 <span className="font-bold text-purple-600 text-lg">
//                   {plan?.plan_name || payment?.plan_name}
//                 </span>
//               </div>

//               {/* Amount */}
//               <div className="flex justify-between items-center">
//                 <span className="text-gray-600">Amount Paid:</span>
//                 <span className="font-bold text-green-600 text-2xl">
//                   ₹{payment?.amount.toLocaleString('en-IN')}
//                 </span>
//               </div>

//               {/* Transaction ID */}
//               <div className="flex justify-between items-center">
//                 <span className="text-gray-600">Transaction ID:</span>
//                 <code className="text-xs bg-gray-200 px-2 py-1 rounded font-mono">
//                   {payment?.payu_txn_id}
//                 </code>
//               </div>

//               {/* PayU Payment ID */}
//               {payment?.payu_payment_id && (
//                 <div className="flex justify-between items-center">
//                   <span className="text-gray-600">PayU ID:</span>
//                   <code className="text-xs bg-gray-200 px-2 py-1 rounded font-mono">
//                     {payment.payu_payment_id}
//                   </code>
//                 </div>
//               )}

//               {/* Payment Method */}
//               {payment?.payu_mode && (
//                 <div className="flex justify-between items-center">
//                   <span className="text-gray-600">Payment Method:</span>
//                   <span className="font-medium text-gray-800">{payment.payu_mode}</span>
//                 </div>
//               )}

//               {/* Date */}
//               <div className="flex justify-between items-center">
//                 <span className="text-gray-600">Date:</span>
//                 <span className="font-medium text-gray-800">
//                   {new Date(payment?.created_at || '').toLocaleString('en-IN', {
//                     year: 'numeric',
//                     month: 'long',
//                     day: 'numeric',
//                     hour: '2-digit',
//                     minute: '2-digit'
//                   })}
//                 </span>
//               </div>

//               {/* Status */}
//               <div className="flex justify-between items-center pt-3 border-t">
//                 <span className="text-gray-600">Status:</span>
//                 <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-bold">
//                   ✓ VERIFIED
//                 </span>
//               </div>
//             </div>
//           </div>

//           {/* What's Next */}
//           <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6">
//             <h3 className="font-semibold text-blue-800 mb-3">🎉 What's Next?</h3>
//             <ul className="space-y-2 text-sm text-blue-700">
//               <li className="flex items-start gap-2">
//                 <span>✓</span>
//                 <span>Your subscription is now active and ready to use</span>
//               </li>
//               <li className="flex items-start gap-2">
//                 <span>✓</span>
//                 <span>Access all premium features immediately</span>
//               </li>
//               <li className="flex items-start gap-2">
//                 <span>✓</span>
//                 <span>Check your email for payment confirmation</span>
//               </li>
//               <li className="flex items-start gap-2">
//                 <span>✓</span>
//                 <span>Download invoice for your records</span>
//               </li>
//             </ul>
//           </div>

//           {/* Action Buttons */}
//           <div className="flex flex-col sm:flex-row gap-3">
//             <button
//               onClick={downloadInvoice}
//               className="flex-1 bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 font-medium flex items-center justify-center gap-2"
//             >
//               <Download className="w-5 h-5" />
//               Download Invoice
//             </button>

//             <button
//               onClick={() => navigate('/seller')}
//               className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-indigo-700 font-medium flex items-center justify-center gap-2"
//             >
//               <Home className="w-5 h-5" />
//               Go to Dashboard
//             </button>
//           </div>

//           {/* Support Info */}
//           <div className="mt-6 text-center text-sm text-gray-500">
//             <p>Need help? Contact us at <a href="mailto:support@tilevision.com" className="text-blue-600 hover:underline">support@tilevision.com</a></p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// console.log('✅ PaymentSuccess Page loaded - PRODUCTION v1.0'); 
// ═══════════════════════════════════════════════════════════════
// ✅ PAYMENT SUCCESS PAGE - PRODUCTION v2.0
// Enhanced with proper response handling & subscription creation
// ═══════════════════════════════════════════════════════════════

import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, Download, Home, CreditCard } from 'lucide-react';
import { 
  getPaymentByTxnId, 
  updatePaymentStatus, 
  verifyPayUHash 
} from '../../lib/paymentService';
import { createSubscription } from '../../lib/subscriptionService';
import { getPlanById } from '../../lib/planService';
import type { PayUResponse, Payment } from '../../types/payment.types';
import type { Plan } from '../../types/plan.types';

export const PaymentSuccess: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [processing, setProcessing] = useState(true);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [payment, setPayment] = useState<Payment | null>(null);
  const [plan, setPlan] = useState<Plan | null>(null);
  const [subscriptionCreated, setSubscriptionCreated] = useState(false);

  useEffect(() => {
    handlePaymentResponse();
  }, []);

  const handlePaymentResponse = async () => {
    try {
      console.log('✅ Processing payment success response...');

      // Extract PayU response from URL
      const payuResponse: PayUResponse = {
        mihpayid: searchParams.get('mihpayid') || '',
        txnid: searchParams.get('txnid') || '',
         phone: searchParams.get('phone') || '',
        status: searchParams.get('status') || '',
        amount: searchParams.get('amount') || '',
        productinfo: searchParams.get('productinfo') || '',
        firstname: searchParams.get('firstname') || '',
        email: searchParams.get('email') || '',
        hash: searchParams.get('hash') || '',
        mode: searchParams.get('mode') || '',
        error_Message: searchParams.get('error_Message') || undefined
      };

      console.log('📝 Response data:', {
        txnid: payuResponse.txnid,
        status: payuResponse.status,
        amount: payuResponse.amount
      });

      // Validate required fields
      if (!payuResponse.txnid || !payuResponse.status || !payuResponse.hash) {
        throw new Error('Invalid payment response data');
      }

      // Verify hash for security
      console.log('🔐 Verifying payment hash...');
      const isHashValid = await verifyPayUHash(payuResponse);
      
      if (!isHashValid) {
        throw new Error('Payment verification failed. Hash mismatch detected.');
      }

      console.log('✅ Hash verified successfully');
      setVerified(true);

      // Get payment record from Firestore
      console.log('📋 Fetching payment record...');
      const paymentRecord = await getPaymentByTxnId(payuResponse.txnid);
      
      if (!paymentRecord) {
        throw new Error('Payment record not found');
      }

      setPayment(paymentRecord);
      console.log('✅ Payment record found');

      // Update payment status
      console.log('💾 Updating payment status...');
      await updatePaymentStatus(payuResponse.txnid, payuResponse, true);
      console.log('✅ Payment status updated');

      // Get plan details
      console.log('📦 Fetching plan details...');
      const planData = await getPlanById(paymentRecord.plan_id);
      
      if (!planData) {
        throw new Error('Plan not found');
      }

      setPlan(planData);
      console.log('✅ Plan data loaded:', planData.plan_name);

      // Create subscription
      if (payuResponse.status === 'success') {
        console.log('🎯 Creating subscription...');
        
        const subscriptionResult = await createSubscription({
          seller_id: paymentRecord.seller_id,
          plan_id: paymentRecord.plan_id,
          payment_id: paymentRecord.id,
          billing_cycle: planData.billing_cycle
        });

        if (subscriptionResult.success) {
          console.log('✅ Subscription created:', subscriptionResult.subscriptionId);
          setSubscriptionCreated(true);
        } else {
          console.error('❌ Subscription creation failed:', subscriptionResult.error);
          // Don't throw error - payment is successful, subscription can be created manually
        }
      }

      setProcessing(false);

    } catch (err: any) {
      console.error('❌ Error processing payment:', err);
      setError(err.message || 'Failed to process payment');
      setProcessing(false);
    }
  };

  const handleDownloadReceipt = () => {
    if (!payment || !plan) return;

    // Create receipt text
    const receipt = `
═══════════════════════════════════════
       PAYMENT RECEIPT
═══════════════════════════════════════

Business: SrijanX Tile
Date: ${new Date().toLocaleString()}

───────────────────────────────────────
PAYMENT DETAILS
───────────────────────────────────────

Transaction ID: ${payment.payu_txn_id}
PayU Payment ID: ${payment.payu_payment_id || 'N/A'}
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

    // Download as text file
    const blob = new Blob([receipt], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Receipt_${payment.payu_txn_id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  // Loading State
  if (processing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-6"></div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Processing Payment
          </h2>
          <p className="text-gray-600 mb-4">
            Please wait while we verify your payment...
          </p>
          <div className="space-y-2 text-sm text-gray-500">
            <p className="flex items-center justify-center gap-2">
              <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
              Verifying transaction
            </p>
            <p className="flex items-center justify-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              Creating subscription
            </p>
            <p className="flex items-center justify-center gap-2">
              <span className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></span>
              Activating plan
            </p>
          </div>
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
            Payment Verification Failed
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 text-left">
            <p className="text-sm text-yellow-800">
              <strong>Note:</strong> If amount was deducted from your account, 
              it will be refunded within 5-7 business days.
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => navigate('/')}
              className="flex-1 bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors font-medium"
            >
              Go Home
            </button>
            <button
              onClick={() => window.location.href = 'mailto:support@srijanxtile.com'}
              className="flex-1 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors font-medium"
            >
              Contact Support
            </button>
          </div>
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
          
          {/* Success Messages */}
          <div className="space-y-3 mb-6">
            {verified && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center gap-2">
                <span className="text-green-600">✓</span>
                <span className="text-sm text-green-800 font-medium">Payment Verified</span>
              </div>
            )}
            {subscriptionCreated && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-center gap-2">
                <span className="text-blue-600">✓</span>
                <span className="text-sm text-blue-800 font-medium">Subscription Activated</span>
              </div>
            )}
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
                  <span className="text-gray-600">Transaction ID:</span>
                  <span className="font-mono text-gray-800">{payment.payu_txn_id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">PayU Payment ID:</span>
                  <span className="font-mono text-gray-800">{payment.payu_payment_id || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Amount Paid:</span>
                  <span className="font-bold text-green-600">
                    ₹{payment.amount.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment Mode:</span>
                  <span className="text-gray-800 capitalize">{payment.payu_mode || 'N/A'}</span>
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
                {plan.features.filter(f => f.included).length > 3 && (
                  <p className="text-xs text-gray-500 pl-6">
                    +{plan.features.filter(f => f.included).length - 3} more features
                  </p>
                )}
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

console.log('✅ PaymentSuccess Component loaded - PRODUCTION v2.0');