// // ═══════════════════════════════════════════════════════════════
// // ✅ PAYMENT FAILURE PAGE - PRODUCTION v1.0
// // ═══════════════════════════════════════════════════════════════

// import React, { useEffect, useState } from 'react';
// import { useNavigate, useSearchParams } from 'react-router-dom';
// import { XCircle, RefreshCw, Home, AlertTriangle } from 'lucide-react';
// import { updatePaymentStatus, getPaymentByTxnId } from '../../lib/paymentService';
// import type { PayUResponse, Payment } from '../../types/payment.types';

// export const PaymentFailure: React.FC = () => {
//   const [searchParams] = useSearchParams();
//   const navigate = useNavigate();

//   const [payment, setPayment] = useState<Payment | null>(null);
//   const [errorDetails, setErrorDetails] = useState<string>('');
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     processFailureResponse();
//   }, []);

//   const processFailureResponse = async () => {
//     try {
//       console.log('❌ Processing payment failure response...');

//       // Extract PayU response
//       const payuResponse: PayUResponse = {
//         status: searchParams.get('status') || 'failure',
//         txnid: searchParams.get('txnid') || '',
//         amount: searchParams.get('amount') || '',
//         productinfo: searchParams.get('productinfo') || '',
//         firstname: searchParams.get('firstname') || '',
//         email: searchParams.get('email') || '',
//         phone: searchParams.get('phone') || '',
//         mihpayid: searchParams.get('mihpayid') || '',
//         mode: searchParams.get('mode') || '',
//         hash: searchParams.get('hash') || '',
//         error: searchParams.get('error') || '',
//         error_Message: searchParams.get('error_Message') || 'Payment failed'
//       };

//       console.log('📋 Failure Response:', {
//         status: payuResponse.status,
//         txnid: payuResponse.txnid,
//         error: payuResponse.error_Message
//       });

//       setErrorDetails(payuResponse.error_Message || payuResponse.error || 'Payment was not completed');

//       // Get payment record
//       if (payuResponse.txnid) {
//         const paymentRecord = await getPaymentByTxnId(payuResponse.txnid);
        
//         if (paymentRecord) {
//           setPayment(paymentRecord);

//           // Update payment status to failed
//           await updatePaymentStatus(payuResponse.txnid, payuResponse, false);
//           console.log('✅ Payment marked as failed');
//         }
//       }

//     } catch (err: any) {
//       console.error('❌ Error processing failure:', err);
//       setErrorDetails('Payment processing error: ' + err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleRetry = () => {
//     navigate('/seller'); // Navigate back to dashboard to retry
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
//         <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
//           <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-gray-600 mx-auto mb-6"></div>
//           <h2 className="text-2xl font-bold text-gray-800 mb-2">Processing...</h2>
//           <p className="text-gray-600">Please wait</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 flex items-center justify-center p-4">
//       <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden">
//         {/* Failure Header */}
//         <div className="bg-gradient-to-r from-red-500 to-orange-600 text-white p-8 text-center">
//           <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
//             <XCircle className="w-12 h-12 text-red-600" />
//           </div>
//           <h1 className="text-3xl font-bold mb-2">Payment Failed</h1>
//           <p className="text-red-100">Your payment could not be processed</p>
//         </div>

//         {/* Error Details */}
//         <div className="p-8">
//           {/* Error Message */}
//           <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-6">
//             <div className="flex items-start gap-3 mb-3">
//               <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
//               <div>
//                 <h3 className="font-semibold text-red-800 mb-2">Error Details:</h3>
//                 <p className="text-red-700">{errorDetails}</p>
//               </div>
//             </div>

//             {/* Transaction Info */}
//             {payment && (
//               <div className="mt-4 pt-4 border-t border-red-200">
//                 <div className="space-y-2 text-sm">
//                   <div className="flex justify-between">
//                     <span className="text-red-600">Transaction ID:</span>
//                     <code className="text-xs bg-red-100 px-2 py-1 rounded font-mono">
//                       {payment.payu_txn_id}
//                     </code>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="text-red-600">Plan:</span>
//                     <span className="font-medium text-red-800">{payment.plan_name}</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="text-red-600">Amount:</span>
//                     <span className="font-bold text-red-800">₹{payment.amount}</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="text-red-600">Time:</span>
//                     <span className="text-red-700">
//                       {new Date(payment.created_at).toLocaleString('en-IN', {
//                         month: 'short',
//                         day: 'numeric',
//                         hour: '2-digit',
//                         minute: '2-digit'
//                       })}
//                     </span>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* Common Reasons */}
//           <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-6">
//             <h3 className="font-semibold text-yellow-800 mb-3">⚠️ Common Reasons for Failure:</h3>
//             <ul className="space-y-2 text-sm text-yellow-700">
//               <li className="flex items-start gap-2">
//                 <span>•</span>
//                 <span>Insufficient balance in bank account</span>
//               </li>
//               <li className="flex items-start gap-2">
//                 <span>•</span>
//                 <span>Incorrect card details or CVV</span>
//               </li>
//               <li className="flex items-start gap-2">
//                 <span>•</span>
//                 <span>Payment declined by bank</span>
//               </li>
//               <li className="flex items-start gap-2">
//                 <span>•</span>
//                 <span>OTP verification failed or timeout</span>
//               </li>
//               <li className="flex items-start gap-2">
//                 <span>•</span>
//                 <span>Transaction cancelled by user</span>
//               </li>
//               <li className="flex items-start gap-2">
//                 <span>•</span>
//                 <span>Network connectivity issues</span>
//               </li>
//             </ul>
//           </div>

//           {/* What to Do */}
//           <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6">
//             <h3 className="font-semibold text-blue-800 mb-3">💡 What to Do Next:</h3>
//             <ul className="space-y-2 text-sm text-blue-700">
//               <li className="flex items-start gap-2">
//                 <span>✓</span>
//                 <span>Check your bank account balance</span>
//               </li>
//               <li className="flex items-start gap-2">
//                 <span>✓</span>
//                 <span>Verify your card/account details are correct</span>
//               </li>
//               <li className="flex items-start gap-2">
//                 <span>✓</span>
//                 <span>Contact your bank if payment was deducted</span>
//               </li>
//               <li className="flex items-start gap-2">
//                 <span>✓</span>
//                 <span>Try again with a different payment method</span>
//               </li>
//             </ul>
//           </div>

//           {/* Action Buttons */}
//           <div className="flex flex-col sm:flex-row gap-3">
//             <button
//               onClick={handleRetry}
//               className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-indigo-700 font-medium flex items-center justify-center gap-2"
//             >
//               <RefreshCw className="w-5 h-5" />
//               Try Again
//             </button>

//             <button
//               onClick={() => navigate('/seller')}
//               className="flex-1 bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 font-medium flex items-center justify-center gap-2"
//             >
//               <Home className="w-5 h-5" />
//               Back to Dashboard
//             </button>
//           </div>

//           {/* Support Info */}
//           <div className="mt-6 p-4 bg-gray-50 rounded-lg text-center">
//             <p className="text-sm text-gray-600 mb-2">
//               <strong>Need Help?</strong>
//             </p>
//             <p className="text-sm text-gray-600">
//               Contact support: <a href="mailto:support@tilevision.com" className="text-blue-600 hover:underline font-medium">support@tilevision.com</a>
//             </p>
//             <p className="text-xs text-gray-500 mt-2">
//               Please keep your transaction ID handy when contacting support
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// console.log('✅ PaymentFailure Page loaded - PRODUCTION v1.0'); 
// ═══════════════════════════════════════════════════════════════
// ✅ PAYMENT FAILURE PAGE - PRODUCTION v2.0
// Enhanced with proper error handling & retry mechanism
// ═══════════════════════════════════════════════════════════════

import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { XCircle, RefreshCw, Home, Mail } from 'lucide-react';
import { getPaymentByTxnId, updatePaymentStatus } from '../../lib/paymentService';
import type { PayUResponse, Payment } from '../../types/payment.types';

export const PaymentFailure: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [processing, setProcessing] = useState(true);
  const [payment, setPayment] = useState<Payment | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [failureReason, setFailureReason] = useState<string>('');
  const [retrying, setRetrying] = useState(false);

  useEffect(() => {
    handlePaymentFailure();
  }, []);

  const handlePaymentFailure = async () => {
    try {
      console.log('❌ Processing payment failure response...');

      // Extract PayU response
      const payuResponse: PayUResponse = {
        mihpayid: searchParams.get('mihpayid') || '',
        txnid: searchParams.get('txnid') || '',
        status: searchParams.get('status') || 'failure',
        amount: searchParams.get('amount') || '',
        productinfo: searchParams.get('productinfo') || '',
        firstname: searchParams.get('firstname') || '',
         phone: searchParams.get('phone') || '',
        email: searchParams.get('email') || '',
        hash: searchParams.get('hash') || '',
        mode: searchParams.get('mode') || '',
        error_Message: searchParams.get('error_Message') || 'Payment failed'
      };

      console.log('📝 Failure response:', {
        txnid: payuResponse.txnid,
        status: payuResponse.status,
        error: payuResponse.error_Message
      });

      setErrorMessage(payuResponse.error_Message || 'Payment failed');

      // Determine failure reason
      let reason = 'Unknown error';
      if (payuResponse.status === 'cancel' || payuResponse.status === 'cancelled') {
        reason = 'Payment cancelled by user';
      } else if (payuResponse.error_Message) {
        reason = payuResponse.error_Message;
      } else if (payuResponse.status === 'failure') {
        reason = 'Payment gateway returned failure status';
      }
      setFailureReason(reason);

      // Get payment record if txnid exists
      if (payuResponse.txnid) {
        const paymentRecord = await getPaymentByTxnId(payuResponse.txnid);
        
        if (paymentRecord) {
          setPayment(paymentRecord);
          
          // Update payment status to failed
          await updatePaymentStatus(payuResponse.txnid, payuResponse, false);
          console.log('✅ Payment status updated to failed');
        }
      }

      setProcessing(false);

    } catch (err: any) {
      console.error('❌ Error processing failure:', err);
      setErrorMessage(err.message || 'Error processing payment failure');
      setProcessing(false);
    }
  };

  const handleRetry = () => {
    setRetrying(true);
    // Navigate back to plans
    navigate('/?showPlans=true');
  };

  const handleContactSupport = () => {
    const subject = encodeURIComponent('Payment Issue - Help Required');
    const body = encodeURIComponent(
      `Transaction ID: ${payment?.payu_txn_id || 'N/A'}\n` +
      `Error: ${errorMessage}\n` +
      `Date: ${new Date().toLocaleString()}\n\n` +
      `Please describe your issue:`
    );
    window.location.href = `mailto:support@srijanxtile.com?subject=${subject}&body=${body}`;
  };

  // Loading State
  if (processing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-orange-600 mx-auto mb-6"></div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Processing Response
          </h2>
          <p className="text-gray-600">
            Please wait while we process the payment response...
          </p>
        </div>
      </div>
    );
  }

  // Failure State
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden">
        
        {/* Failure Header */}
        <div className="bg-gradient-to-r from-red-600 to-orange-600 text-white p-8 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full mb-4">
            <XCircle className="w-12 h-12 text-red-600" />
          </div>
          <h1 className="text-3xl font-bold mb-2">
            {searchParams.get('status') === 'cancel' || searchParams.get('status') === 'cancelled'
              ? 'Payment Cancelled'
              : 'Payment Failed'}
          </h1>
          <p className="text-red-100">
            Your transaction could not be completed
          </p>
        </div>

        {/* Error Details */}
        <div className="p-8">
          
          {/* Error Message */}
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

          {/* Transaction Info */}
          {payment && (
            <div className="bg-gray-50 rounded-xl p-6 mb-6">
              <h3 className="font-semibold text-gray-800 mb-4">
                📋 Transaction Details
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Transaction ID:</span>
                  <span className="font-mono text-gray-800">{payment.payu_txn_id}</span>
                </div>
                {payment.payu_payment_id && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">PayU Payment ID:</span>
                    <span className="font-mono text-gray-800">{payment.payu_payment_id}</span>
                  </div>
                )}
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

          {/* Common Reasons */}
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
                <span>Card expired or blocked</span>
              </li>
              <li className="flex items-start gap-2">
                <span>•</span>
                <span>Incorrect card details (CVV, expiry date)</span>
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

          {/* Refund Info (if amount deducted) */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6">
            <h3 className="font-semibold text-blue-800 mb-3">
              💰 About Refunds
            </h3>
            <p className="text-sm text-blue-700 mb-2">
              If any amount was deducted from your account:
            </p>
            <ul className="space-y-1 text-sm text-blue-600 ml-4">
              <li>• It will be automatically refunded by PayU</li>
              <li>• Refund processing time: 5-7 business days</li>
              <li>• Amount will be credited to the same payment source</li>
            </ul>
            <p className="text-xs text-blue-600 mt-3">
              For refund queries, contact PayU support with your transaction ID
            </p>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
            <button
              onClick={handleRetry}
              disabled={retrying}
              className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl font-medium flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <RefreshCw className={`w-5 h-5 ${retrying ? 'animate-spin' : ''}`} />
              {retrying ? 'Redirecting...' : 'Retry Payment'}
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

          {/* Support Info */}
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