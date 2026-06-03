
// import React, { useState } from 'react';
// import { Check, X, Crown, Zap, Loader } from 'lucide-react';
// import type { Plan } from '../../types/plan.types';
// import { createPaymentOrder } from '../../lib/backendAPI';
// import { PaymentCheckout } from '../Payment/PaymentCheckout';

// interface PlanCardProps {
//   plan: Plan;
//   sellerId: string;           // ✅ Required
//   userToken: string;          // ✅ Required
//   isLoggedIn?: boolean;
//   onSelect?: (planId: string) => void;
//   isSelected?: boolean;
//   showSelectButton?: boolean;
// }

// export const PlanCard: React.FC<PlanCardProps> = ({
//   plan,
//   sellerId,
//   userToken,
//   isLoggedIn = false,
//   isSelected = false,
//   showSelectButton = true
// }) => {
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [checkoutData, setCheckoutData] = useState<any>(null);

//   const handleSelectPlan = async () => {
//     // ✅ VALIDATION 1: Login check
//     if (!isLoggedIn) {
//       alert('🔐 Please login to purchase a plan');
//       return;
//     }

//     // ✅ VALIDATION 2: Token check
//     if (!userToken) {
//       alert('⚠️ Authentication token not found. Please refresh and try again.');
//       return;
//     }

//     // ✅ VALIDATION 3: Seller ID check
//     if (!sellerId) {
//       alert('⚠️ User ID not found. Please login again.');
//       return;
//     }

//     setLoading(true);
//     setError(null);

//     try {
//       console.log('🛒 Creating payment order:', {
//         planId: plan.id,
//         planName: plan.plan_name,
//         price: plan.price,
//         sellerId: sellerId.substring(0, 8) + '...' // Partial log for security
//       });

//       // ✅ BACKEND CALL - Token from props
//       const response = await createPaymentOrder(
//         plan.id, 
//         plan.billing_cycle, 
//         userToken  // ✅ Props se token
//       );

//       if (response.success) {
//         console.log('✅ Payment order created:', {
//           paymentId: response.data.paymentId,
//           orderId: response.data.checkoutOptions.order_id
//         });
        
//         // ✅ SET CHECKOUT DATA
//         setCheckoutData({
//           checkoutOptions: response.data.checkoutOptions,
//           paymentId: response.data.paymentId,
//           planId: plan.id,
//           sellerId: sellerId,
//         });
//       } else {
//         throw new Error(response.error || 'Failed to create payment order');
//       }
//     } catch (err: any) {
//       console.error('❌ Error creating payment order:', err);
//       const errorMsg = err.message || 'Failed to initiate payment';
//       setError(errorMsg);
//       alert(`❌ Error: ${errorMsg}`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handlePaymentSuccess = () => {
//     console.log('✅ Payment successful - Redirecting...');
//     setCheckoutData(null);
//     // ✅ REDIRECT WITH SUCCESS FLAG
//     window.location.href = '/seller-dashboard?plan_activated=true';
//   };

//   const handlePaymentError = (error: string) => {
//     console.error('❌ Payment error:', error);
//     setCheckoutData(null);
//     setError(error);
//     alert(`❌ Payment failed: ${error}`);
//   };

//   return (
//     <>
//       <div className={`bg-white rounded-2xl shadow-xl overflow-hidden border-2 transition-all transform hover:scale-105 ${
//         plan.is_popular 
//           ? 'border-yellow-400 ring-4 ring-yellow-400 ring-opacity-50' 
//           : isSelected 
//           ? 'border-purple-500' 
//           : 'border-gray-200'
//       }`}>
        
//         {plan.is_popular && (
//           <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-center py-2 font-bold text-sm">
//             ⭐ MOST POPULAR
//           </div>
//         )}

//         <div className="p-6 text-center border-b">
//           <h3 className="text-2xl font-bold text-gray-800 mb-2">
//             {plan.plan_name}
//           </h3>
//           <div className="flex items-baseline justify-center gap-2 mb-4">
//             <span className="text-5xl font-extrabold text-purple-600">
//               ₹{plan.price.toLocaleString('en-IN')}
//             </span>
//             <span className="text-gray-600">
//               /{plan.billing_cycle === 'monthly' ? 'mo' : 'yr'}
//             </span>
//           </div>
//         </div>

//         <div className="p-6">
//           <ul className="space-y-3">
//             {plan.features.map((feature, idx) => (
//               <li key={idx} className="flex items-start gap-3">
//                 {feature.included ? (
//                   <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
//                 ) : (
//                   <X className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
//                 )}
//                 <div className="flex-1">
//                   <span className={feature.included ? 'text-gray-700' : 'text-gray-400 line-through'}>
//                     {feature.icon && <span className="mr-2">{feature.icon}</span>}
//                     {feature.title}
//                   </span>
//                   {feature.description && (
//                     <p className="text-xs text-gray-500 mt-1">{feature.description}</p>
//                   )}
//                 </div>
//               </li>
//             ))}
//           </ul>
//         </div>

//         {showSelectButton && (
//           <div className="p-6 pt-0">
//             <button
//               onClick={handleSelectPlan}
//               disabled={loading || !plan.is_active || !userToken}  // ✅ Token check
//               className={`w-full py-4 rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed ${
//                 plan.is_popular
//                   ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white hover:from-yellow-500 hover:to-orange-600'
//                   : 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700'
//               }`}
//             >
//               {loading ? (
//                 <div className="flex items-center justify-center gap-2">
//                   <Loader className="w-5 h-5 animate-spin" />
//                   Processing...
//                 </div>
//               ) : !userToken ? (
//                 '⚠️ Token Loading...'
//               ) : (
//                 <>
//                   {plan.is_popular ? <Crown className="inline w-5 h-5 mr-2" /> : <Zap className="inline w-5 h-5 mr-2" />}
//                   Choose {plan.plan_name}
//                 </>
//               )}
//             </button>
//           </div>
//         )}

//         {error && (
//           <div className="px-6 pb-6">
//             <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
//               ⚠️ {error}
//             </div>
//           </div>
//         )}
//       </div>

//       {/* ✅ PAYMENT CHECKOUT MODAL */}
//       {checkoutData && (
//         <PaymentCheckout
//           checkoutOptions={checkoutData.checkoutOptions}
//           paymentId={checkoutData.paymentId}
//           planId={checkoutData.planId}
//           sellerId={checkoutData.sellerId}
//           onSuccess={handlePaymentSuccess}
//           onError={handlePaymentError}
//           userToken={userToken}
//         />
//       )}
//     </>
//   );
// };

// console.log('✅ PlanCard - v4.0 (Props-based, No useAuth)'); 
import React, { useState } from 'react';
import { Check, X, Crown, Zap, Loader, CheckCircle } from 'lucide-react';
import type { Plan } from '../../types/plan.types';
import { createPaymentOrder } from '../../lib/backendAPI';
import { PaymentCheckout } from '../Payment/PaymentCheckout';

interface PlanCardProps {
  plan: Plan;
  sellerId: string;
  userToken: string;
  isLoggedIn?: boolean;
  onSelect?: (planId: string) => void;
  isSelected?: boolean;
  showSelectButton?: boolean;
}

export const PlanCard: React.FC<PlanCardProps> = ({
  plan,
  sellerId,
  userToken,
  isLoggedIn = false,
  isSelected = false,
  showSelectButton = true
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [checkoutData, setCheckoutData] = useState<any>(null);
  const [showSuccess, setShowSuccess] = useState(false); // ✅ NEW

  const handleSelectPlan = async () => {
    if (!isLoggedIn) {
      alert('🔐 Please login to purchase a plan');
      return;
    }

    if (!userToken) {
      alert('⚠️ Authentication token not found. Please refresh and try again.');
      return;
    }

    if (!sellerId) {
      alert('⚠️ User ID not found. Please login again.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log('═══════════════════════════════════════════════════════');
      console.log('🛒 CREATING PAYMENT ORDER');
      console.log('═══════════════════════════════════════════════════════');
      console.log('📋 Order Details:', {
        planId: plan.id,
        planName: plan.plan_name,
        price: plan.price,
        sellerId: sellerId.substring(0, 8) + '...'
      });

      const response = await createPaymentOrder(
        plan.id, 
        plan.billing_cycle, 
        userToken
      );

      if (response.success) {
        console.log('✅ Payment order created successfully');
        console.log('📋 Order Info:', {
          paymentId: response.data.paymentId,
          orderId: response.data.checkoutOptions.order_id
        });
        
        setCheckoutData({
          checkoutOptions: response.data.checkoutOptions,
          paymentId: response.data.paymentId,
          planId: plan.id,
          sellerId: sellerId,
        });
      } else {
        throw new Error('Failed to create payment order');
      }
    } catch (err: any) {
      console.error('❌ Error creating payment order:', err);
      const errorMsg = err.message || 'Failed to initiate payment';
      setError(errorMsg);
      alert(`❌ Error: ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  // ✅ NEW: Success Handler - No Redirect, Just Close Modal
  const handlePaymentSuccess = () => {
    console.log('═══════════════════════════════════════════════════════');
    console.log('✅ PAYMENT SUCCESS - CLOSING CHECKOUT MODAL');
    console.log('═══════════════════════════════════════════════════════');
    console.log('🔔 Firestore listeners will auto-update banner in 3-5 seconds');
    
    // Close checkout modal
    setCheckoutData(null);
    
    // ✅ Show success notification
    setShowSuccess(true);
    
    // ✅ Auto-hide success notification after 6 seconds
    setTimeout(() => {
      setShowSuccess(false);
    }, 6000);
    
    console.log('✅ Modal closed - Waiting for banner auto-update...');
  };

  const handlePaymentError = (error: string) => {
    console.error('❌ Payment error:', error);
    setCheckoutData(null);
    setError(error);
    alert(`❌ Payment failed: ${error}`);
  };

  return (
    <>
      {/* ✅ NEW: Success Notification Toast */}
      {showSuccess && (
        <div className="fixed top-4 right-4 z-[10000] animate-slide-in-right">
          <div className="bg-green-500 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 max-w-md">
            <CheckCircle className="w-6 h-6 flex-shrink-0 animate-bounce" />
            <div>
              <p className="font-bold text-lg">Payment Successful! 🎉</p>
              <p className="text-sm text-green-100">Your plan is being activated...</p>
              <p className="text-xs text-green-200 mt-1">
                Dashboard will update in a few seconds
              </p>
            </div>
          </div>
        </div>
      )}

      <div className={`bg-white rounded-2xl shadow-xl overflow-hidden border-2 transition-all transform hover:scale-105 ${
        plan.is_popular 
          ? 'border-yellow-400 ring-4 ring-yellow-400 ring-opacity-50' 
          : isSelected 
          ? 'border-purple-500' 
          : 'border-gray-200'
      }`}>
        
        {plan.is_popular && (
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-center py-2 font-bold text-sm">
            ⭐ MOST POPULAR
          </div>
        )}

        <div className="p-6 text-center border-b">
          <h3 className="text-2xl font-bold text-gray-800 mb-2">
            {plan.plan_name}
          </h3>
          <div className="flex items-baseline justify-center gap-2 mb-4">
            <span className="text-5xl font-extrabold text-purple-600">
              ₹{plan.price.toLocaleString('en-IN')}
            </span>
            <span className="text-gray-600">
              /{plan.billing_cycle === 'monthly' ? 'mo' : 'yr'}
            </span>
          </div>
        </div>

        <div className="p-6">
          <ul className="space-y-3">
            {plan.features.map((feature, idx) => (
              <li key={idx} className="flex items-start gap-3">
                {feature.included ? (
                  <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                ) : (
                  <X className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                )}
                <div className="flex-1">
                  <span className={feature.included ? 'text-gray-700' : 'text-gray-400 line-through'}>
                    {feature.icon && <span className="mr-2">{feature.icon}</span>}
                    {feature.title}
                  </span>
                  {feature.description && (
                    <p className="text-xs text-gray-500 mt-1">{feature.description}</p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>

        {showSelectButton && (
          <div className="p-6 pt-0">
            <button
              onClick={handleSelectPlan}
              disabled={loading || !plan.is_active || !userToken}
              className={`w-full py-4 rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed ${
                plan.is_popular
                  ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white hover:from-yellow-500 hover:to-orange-600'
                  : 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700'
              }`}
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <Loader className="w-5 h-5 animate-spin" />
                  Processing...
                </div>
              ) : !userToken ? (
                '⚠️ Token Loading...'
              ) : (
                <>
                  {plan.is_popular ? <Crown className="inline w-5 h-5 mr-2" /> : <Zap className="inline w-5 h-5 mr-2" />}
                  Choose {plan.plan_name}
                </>
              )}
            </button>
          </div>
        )}

        {error && (
          <div className="px-6 pb-6">
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
              ⚠️ {error}
            </div>
          </div>
        )}
      </div>

      {/* Payment Checkout Modal */}
      {checkoutData && (
        <PaymentCheckout
          checkoutOptions={checkoutData.checkoutOptions}
          paymentId={checkoutData.paymentId}
          planId={checkoutData.planId}
          sellerId={checkoutData.sellerId}
          onSuccess={handlePaymentSuccess}
          onError={handlePaymentError}
          userToken={userToken}
        />
      )}
    </>
  );
};

console.log('✅ PlanCard - PRODUCTION v5.0 (No Redirect + Success Toast)');