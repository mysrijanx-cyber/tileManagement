
// // console.log('✅ PlanStatusBanner loaded - PRODUCTION v7.0'); 
// import React, { useState, useEffect, useRef, useCallback } from 'react';
// import { Clock, AlertTriangle, CheckCircle, RefreshCw, Eye, X,TrendingUp  } from 'lucide-react';
// import { getSellerSubscription, isSubscriptionExpired } from '../lib/subscriptionService';
// import { getPlanById } from '../lib/planService';
// import { disableAllSellersWorkers } from '../lib/firebaseutils';
// import type { Subscription } from '../types/payment.types';
// import type { Plan } from '../types/plan.types';
// import { getRemainingScanCount } from '../lib/subscriptionService';
// import { QrCode } from 'lucide-react';
// // ═══════════════════════════════════════════════════════════════
// // ✅ INTERFACE
// // ═══════════════════════════════════════════════════════════════

// interface PlanStatusBannerProps {
//   sellerId: string;
//   onViewPlans: () => void;
//   forceRefresh?: number;
//   onPlanStatusChange?: (isActive: boolean, isExpired: boolean) => void; // ✅ NEW CALLBACK
// }

// interface TimeRemaining {
//   days: number;
//   hours: number;
//   minutes: number;
//   seconds: number;
// }

// // ═══════════════════════════════════════════════════════════════
// // ✅ COMPONENT
// // ═══════════════════════════════════════════════════════════════

// export const PlanStatusBanner: React.FC<PlanStatusBannerProps> = ({
//   sellerId,
//   onViewPlans,
//   forceRefresh = 0,
//   onPlanStatusChange // ✅ NEW PROP
// }) => {
//   // ═══════════════════════════════════════════════════════════════
//   // STATE
//   // ═══════════════════════════════════════════════════════════════
  
//   const [subscription, setSubscription] = useState<Subscription | null>(null);
//   const [plan, setPlan] = useState<Plan | null>(null);
//   const [hasDisabledWorkers, setHasDisabledWorkers] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [timeRemaining, setTimeRemaining] = useState<TimeRemaining>({
//     days: 0, hours: 0, minutes: 0, seconds: 0
//   });
//   const [isExpired, setIsExpired] = useState(false);
//   const [showExpiryPopup, setShowExpiryPopup] = useState(false);
//   const [lastChecked, setLastChecked] = useState<Date>(new Date());
//   const [notification, setNotification] = useState<{
//     type: 'success' | 'error' | null;
//     message: string;
//   }>({ type: null, message: '' });
//   const [isPaymentProcessing, setIsPaymentProcessing] = useState(false);
  
//   const disableTimeoutRef = useRef<NodeJS.Timeout | null>(null);
//   const isLoadingRef = useRef(false);
//   const lastSubscriptionIdRef = useRef<string | null>(null);
//   const lastExpiredStateRef = useRef<boolean>(false); // ✅ Track expiry changes
// const [scanStats, setScanStats] = useState<{
//   remaining: number;
//   total: number;
//   used: number;
//   unlimited: boolean;
//   limitReached: boolean;
// } | null>(null);
//   // ═══════════════════════════════════════════════════════════════
//   // ✅ DETECT PAYMENT PROCESSING
//   // ═══════════════════════════════════════════════════════════════
  
//   useEffect(() => {
//     const checkPaymentProcessing = () => {
//       const flag = localStorage.getItem('payment_processing');
//       const isProcessing = flag === 'true';
      
//       if (isProcessing !== isPaymentProcessing) {
//         console.log('🚩 Payment processing flag changed:', isProcessing);
//         setIsPaymentProcessing(isProcessing);
//       }
//     };

//     checkPaymentProcessing();
//     const interval = setInterval(checkPaymentProcessing, 500);

//     return () => clearInterval(interval);
//   }, [isPaymentProcessing]);

//   // ═══════════════════════════════════════════════════════════════
//   // ✅ LOAD SUBSCRIPTION
//   // ═══════════════════════════════════════════════════════════════
  
//   useEffect(() => {
//     console.log('🔄 PlanStatusBanner: Loading subscription (forceRefresh:', forceRefresh, ')');
//     const shouldForceRefresh = forceRefresh > 0;
//     loadSubscription(shouldForceRefresh);
//   }, [sellerId, forceRefresh]);

//   // ═══════════════════════════════════════════════════════════════
//   // ✅ NOTIFY PARENT ON EXPIRY CHANGE
//   // ═══════════════════════════════════════════════════════════════
  
//   useEffect(() => {
//     if (lastExpiredStateRef.current !== isExpired) {
//       console.log('🔔 Plan status changed - Notifying parent:', {
//         isExpired,
//         hasSubscription: !!subscription
//       });
      
//       lastExpiredStateRef.current = isExpired;
      
//       // ✅ Notify parent immediately
//       if (onPlanStatusChange) {
//         const isActive = !isExpired && !!subscription;
//         onPlanStatusChange(isActive, isExpired);
//       }
//     }
//   }, [isExpired, subscription, onPlanStatusChange]);

//   // ═══════════════════════════════════════════════════════════════
//   // ✅ DISABLE WORKERS ON EXPIRY
//   // ═══════════════════════════════════════════════════════════════
  
//   useEffect(() => {
//     if (isPaymentProcessing) {
//       console.log('⏸️ PAYMENT PROCESSING - Skipping disable check');
//       return;
//     }

//     if (hasDisabledWorkers || !isExpired || !subscription) {
//       return;
//     }

//     console.log('⏰ Plan expired - Scheduling disable in 3 seconds...');
    
//     if (disableTimeoutRef.current) {
//       clearTimeout(disableTimeoutRef.current);
//     }

//     disableTimeoutRef.current = setTimeout(async () => {
//       if (isPaymentProcessing || hasDisabledWorkers) {
//         console.log('⏸️ Aborting disable');
//         return;
//       }

//       try {
//         const freshSub = await getSellerSubscription(sellerId, true);
//         if (!freshSub || !isSubscriptionExpired(freshSub)) {
//           console.log('✅ Subscription now active - Aborting disable');
//           return;
//         }

//         console.log('⚠️ Disabling workers (verified expired)...');
//         const result = await disableAllSellersWorkers(sellerId);
        
//         if (result.success && result.count > 0) {
//           console.log(`✅ Disabled ${result.count} worker(s)`);
//           setHasDisabledWorkers(true);
//           showNotification('success', `🔒 ${result.count} worker(s) disabled.`);
//         }
//       } catch (error: any) {
//         console.error('❌ Disable failed:', error);
//       }
//     }, 3000);

//     return () => {
//       if (disableTimeoutRef.current) {
//         clearTimeout(disableTimeoutRef.current);
//       }
//     };
//   }, [isExpired, subscription, sellerId, hasDisabledWorkers, isPaymentProcessing]);

//   // ═══════════════════════════════════════════════════════════════
//   // ✅ TIMER EFFECT (UPDATES EVERY SECOND)
//   // ═══════════════════════════════════════════════════════════════
  
//   useEffect(() => {
//     if (subscription) {
//       updateTimer();
//       const interval = setInterval(updateTimer, 1000);
//       return () => clearInterval(interval);
//     }
//   }, [subscription]);

//   // ═══════════════════════════════════════════════════════════════
//   // POPUP EFFECT
//   // ═══════════════════════════════════════════════════════════════
  
//   useEffect(() => {
//     if (isExpired && subscription && !sessionStorage.getItem('expiry_popup_shown')) {
//       setShowExpiryPopup(true);
//       sessionStorage.setItem('expiry_popup_shown', 'true');
//     }
//   }, [isExpired]);

//   // ═══════════════════════════════════════════════════════════════
//   // NOTIFICATION AUTO-HIDE
//   // ═══════════════════════════════════════════════════════════════
  
//   useEffect(() => {
//     if (notification.type) {
//       const timer = setTimeout(() => {
//         setNotification({ type: null, message: '' });
//       }, 5000);
//       return () => clearTimeout(timer);
//     }
//   }, [notification]);


//   const loadScanStats = async (sellerId: string) => {
//   try {
//     console.log('📊 Loading scan stats for seller:', sellerId);
//     const stats = await getRemainingScanCount(sellerId);
    
//     console.log('📊 Scan stats:', stats);
//     setScanStats(stats);
    
//   } catch (error) {
//     console.error('❌ Failed to load scan stats:', error);
//     setScanStats(null);
//   }
// };
//   // ═══════════════════════════════════════════════════════════════
//   // ✅ LOAD SUBSCRIPTION FUNCTION
//   // ═══════════════════════════════════════════════════════════════
  
//   const loadSubscription = useCallback(async (forceServerFetch: boolean = false) => {
//     if (isLoadingRef.current) {
//       console.log('⏭️ Already loading');
//       return;
//     }

//     try {
//       isLoadingRef.current = true;
//       setLoading(true);
      
//       console.log('🔍 Fetching subscription (force:', forceServerFetch, ')');
//       const sub = await getSellerSubscription(sellerId, forceServerFetch);
      
//       if (sub) {
//         const changed = lastSubscriptionIdRef.current !== sub.id;
        
//         if (changed) {
//           console.log('🔄 Subscription changed:', {
//             old: lastSubscriptionIdRef.current,
//             new: sub.id
//           });
//           lastSubscriptionIdRef.current = sub.id;
//           setHasDisabledWorkers(false);
//           sessionStorage.removeItem('expiry_popup_shown');
//         }

//         setSubscription(sub);
//         await loadScanStats(sellerId);
//         const planData = await getPlanById(sub.plan_id);
//         setPlan(planData);
        
//         const expired = isSubscriptionExpired(sub);
//         setIsExpired(expired);
        
//         if (!expired) {
//           sessionStorage.removeItem('expiry_popup_shown');
//           setHasDisabledWorkers(false);
//         }
        
//         setLastChecked(new Date());
        
//         console.log('✅ Subscription loaded:', {
//           id: sub.id,
//           plan: planData?.plan_name,
//           expired
//         });
//       } else {
//         setSubscription(null);
//         setPlan(null);
//         setIsExpired(false);
//         lastSubscriptionIdRef.current = null;
//       }
//     } catch (error) {
//       console.error('❌ Load error:', error);
//       showNotification('error', 'Failed to load subscription');
//     } finally {
//       setLoading(false);
//       isLoadingRef.current = false;
//     }
//   }, [sellerId]);

//   const showNotification = (type: 'success' | 'error', message: string) => {
//     setNotification({ type, message });
//   };

//   const updateTimer = () => {
//     if (!subscription || !subscription.end_date) return;

//     const endDate = new Date(subscription.end_date);
//     const now = new Date();
//     const diffMs = endDate.getTime() - now.getTime();

//     if (diffMs <= 0) {
//       setTimeRemaining({ days: 0, hours: 0, minutes: 0, seconds: 0 });
//       if (!isExpired) {
//         console.log('⏰ Timer reached 0 - Setting expired state');
//         setIsExpired(true);
//       }
//       return;
//     }

//     const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
//     const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
//     const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
//     const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);

//     setTimeRemaining({ days, hours, minutes, seconds });
//   };

//   const getTimerDisplay = (): string => {
//     const { days, hours, minutes, seconds } = timeRemaining;
//     if (days > 0) return `${days}d ${hours}h ${minutes}m ${seconds}s`;
//     if (hours > 0) return `${hours}h ${minutes}m ${seconds}s`;
//     if (minutes > 0) return `${minutes}m ${seconds}s`;
//     return `${seconds}s`;
//   };

//   const getStatusColor = (): string => {
//     if (isExpired) return 'from-red-600 to-red-700';
//     const { days, hours } = timeRemaining;
//     if (hours < 1 && days === 0) return 'from-red-500 to-orange-600';
//     if (hours < 24 && days === 0) return 'from-orange-500 to-yellow-600';
//     if (days < 7) return 'from-yellow-500 to-yellow-600';
//     return 'from-green-600 to-emerald-600';
//   };

//   const shouldPulse = (): boolean => {
//     const { hours, days } = timeRemaining;
//     return (hours < 1 && days === 0) || isExpired;
//   };

//   const formatDate = (date: Date | string): string => {
//     return new Date(date).toLocaleString('en-IN', {
//       day: 'numeric',
//       month: 'short',
//       year: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
//     });
//   };

//   // ═══════════════════════════════════════════════════════════════
//   // ✅ RENDER: LOADING
//   // ═══════════════════════════════════════════════════════════════
  
//   if (loading) {
//     return (
//       <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded-xl animate-pulse">
//         <div className="h-6 sm:h-8 bg-gray-400 rounded w-1/2 mb-2"></div>
//         <div className="h-3 sm:h-4 bg-gray-400 rounded w-1/3"></div>
//       </div>
//     );
//   }

//   // ═══════════════════════════════════════════════════════════════
//   // ✅ RENDER: NO SUBSCRIPTION
//   // ═══════════════════════════════════════════════════════════════
  
//   if (!subscription || !plan) {
//     return (
//       <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl shadow-lg">
//         <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
//           <div className="flex items-start gap-2 sm:gap-3 flex-1 min-w-0">
//             <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 mt-0.5 flex-shrink-0" />
//             <div className="flex-1 min-w-0">
//               <h3 className="font-bold text-base sm:text-lg">No Active Plan</h3>
//               <p className="text-xs sm:text-sm text-purple-100 mt-1">
//                 Subscribe to a plan to unlock all features!
//               </p>
//             </div>
//           </div>
//           <button
//             onClick={onViewPlans}
//             className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white text-purple-600 px-3 sm:px-4 py-2 rounded-lg hover:bg-purple-50 transition-colors font-semibold shadow-md text-sm sm:text-base"
//           >
//             <Eye className="w-4 h-4" />
//             View Plans
//           </button>
//         </div>
//       </div>
//     );
//   }

//   // ═══════════════════════════════════════════════════════════════
//   // ✅ RENDER: EXPIRED PLAN
//   // ═══════════════════════════════════════════════════════════════
  
//   if (isExpired) {
//     return (
//       <>
//         {notification.type && (
//           <div className={`mb-4 p-3 sm:p-4 rounded-xl shadow-lg ${
//             notification.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
//           }`}>
//             <div className="flex items-start justify-between gap-3">
//               <p className="text-sm sm:text-base flex-1">{notification.message}</p>
//               <button onClick={() => setNotification({ type: null, message: '' })}>
//                 <X className="w-4 h-4" />
//               </button>
//             </div>
//           </div>
//         )}

//         <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl shadow-lg animate-pulse">
//           <div className="flex flex-col gap-3">
//             <div className="flex items-start justify-between gap-3">
//               <div className="flex items-start gap-2 sm:gap-3 flex-1 min-w-0">
//                 <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 mt-0.5 flex-shrink-0" />
//                 <div className="flex-1 min-w-0">
//                   <h3 className="font-bold text-base sm:text-lg">❌ Plan Expired</h3>
//                   <p className="text-xs sm:text-sm opacity-90 mt-0.5">{plan.plan_name}</p>
//                   <p className="text-xs mt-1">Expired: {formatDate(subscription.end_date)}</p>
//                 </div>
//               </div>
//               <button 
//                 onClick={() => loadSubscription(true)} 
//                 className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors flex-shrink-0"
//               >
//                 <RefreshCw className="w-4 h-4" />
//               </button>
//             </div>

//             <button
//               onClick={onViewPlans}
//               className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white text-red-600 px-4 py-2.5 rounded-lg hover:bg-red-50 transition-all font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-0.5 active:translate-y-0 text-sm sm:text-base"
//             >
//               <RefreshCw className="w-4 h-4" />
//               Renew Plan Now
//             </button>
//           </div>
//         </div>
//       </>
//     );
//   }

//   // ═══════════════════════════════════════════════════════════════
//   // ✅ RENDER: ACTIVE PLAN
//   // ═══════════════════════════════════════════════════════════════
  
//   return (
//     <>
//       {notification.type && (
//         <div className={`mb-4 p-3 sm:p-4 rounded-xl shadow-lg ${
//           notification.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
//         }`}>
//           <div className="flex items-start justify-between gap-3">
//             <p className="text-sm sm:text-base flex-1">{notification.message}</p>
//             <button onClick={() => setNotification({ type: null, message: '' })}>
//               <X className="w-4 h-4" />
//             </button>
//           </div>
//         </div>
//       )}

//       <div className={`mb-4 sm:mb-6 p-3 sm:p-4 bg-gradient-to-r ${getStatusColor()} text-white rounded-xl shadow-lg ${
//         shouldPulse() ? 'animate-pulse' : ''
//       }`}>
//         <div className="flex flex-col gap-3">
//           <div className="flex items-start justify-between gap-3">
//             <div className="flex items-start gap-2 sm:gap-3 flex-1 min-w-0">
//               <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 mt-0.5 flex-shrink-0" />
//               <div className="flex-1 min-w-0">
//                 <h3 className="font-bold text-base sm:text-lg truncate">
//                   ✅ {plan.plan_name}
//                 </h3>
//                 <p className="text-xs sm:text-sm opacity-90 mt-0.5">
//                   ₹{plan.price.toLocaleString()}
//                 </p>
//               </div>
//             </div>
//             <button 
//               onClick={() => loadSubscription(true)} 
//               className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors flex-shrink-0"
//             >
//               <RefreshCw className="w-4 h-4" />
//             </button>
//           </div>

// {/* ✅ Scan Count Display */}
// {scanStats && !scanStats.unlimited && (
//   <div className="flex items-center gap-2 border-t border-white border-opacity-20 pt-3 mt-3">
//     <QrCode className="w-4 h-4 flex-shrink-0" />
//     <div className="text-xs sm:text-sm flex-1">
//       <div className="flex items-center justify-between">
//         <span>Scans:</span>
//         <span className="font-mono font-bold">
//           {scanStats.used} / {scanStats.total}
//         </span>
//       </div>
//       {scanStats.limitReached ? (
//         <div className="text-red-300 text-xs mt-1 font-semibold">
//           ⚠️ Limit reached - Subscription expired
//         </div>
//       ) : scanStats.remaining > 0 ? (
//         <div className={`text-xs mt-1 ${
//           scanStats.remaining <= 2 ? 'text-yellow-300' : 'text-green-300'
//         }`}>
//           {scanStats.remaining} scan{scanStats.remaining !== 1 ? 's' : ''} remaining
//         </div>
//       ) : (
//         <div className="text-red-300 text-xs mt-1 font-semibold">
//           ⚠️ Last scan used
//         </div>
//       )}
//     </div>
//   </div>
// )}

// {scanStats && scanStats.unlimited && (
//   <div className="flex items-center gap-2 border-t border-white border-opacity-20 pt-3 mt-3">
//     <QrCode className="w-4 h-4 flex-shrink-0" />
//     <div className="text-xs sm:text-sm">
//       Scans: <span className="font-mono font-bold">Unlimited ∞</span>
//       {scanStats.used > 0 && (
//         <span className="text-green-200 ml-2">({scanStats.used} used)</span>
//       )}
//     </div>
//   </div>
// )}
//           <div className="flex items-center gap-2 border-t border-white border-opacity-20 pt-3">
//             <Clock className="w-4 h-4 flex-shrink-0" />
//             <div className="text-xs sm:text-sm">
//               Time Left: <span className="font-mono font-bold">{getTimerDisplay()}</span>
//             </div>
//           </div>

//           <button
//             onClick={onViewPlans}
//             className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white bg-opacity-20 hover:bg-opacity-30 px-4 py-2 rounded-lg transition-all font-medium text-sm backdrop-blur-sm"
//           >
//             <TrendingUp className="w-4 h-4" />
//             Upgrade Plan
//           </button>
//         </div>
//       </div>
//     </>
//   );
// };

// console.log('✅ PlanStatusBanner loaded - PRODUCTION v8.0'); 
// ✅ PRODUCTION v9.1 - NOTHING MISSED
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Clock, AlertTriangle, CheckCircle, RefreshCw, Eye, X, TrendingUp, QrCode } from 'lucide-react';
import { db } from '../lib/firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import { getSellerSubscription, isSubscriptionExpired } from '../lib/subscriptionService';
import { getPlanById } from '../lib/planService';
import { disableAllSellersWorkers } from '../lib/firebaseutils';
import { getRemainingScanCount } from '../lib/subscriptionService';
import type { Subscription } from '../types/payment.types';
import type { Plan } from '../types/plan.types';

// ═══════════════════════════════════════════════════════════════
// ✅ INTERFACE
// ═══════════════════════════════════════════════════════════════

interface PlanStatusBannerProps {
  sellerId: string;
  onViewPlans: () => void;
  forceRefresh?: number;
  onPlanStatusChange?: (isActive: boolean, isExpired: boolean) => void;
}

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

interface ScanStats {
  remaining: number;
  total: number;
  used: number;
  unlimited: boolean;
  limitReached: boolean;
}

// ═══════════════════════════════════════════════════════════════
// ✅ COMPONENT
// ═══════════════════════════════════════════════════════════════

export const PlanStatusBanner: React.FC<PlanStatusBannerProps> = ({
  sellerId,
  onViewPlans,
  forceRefresh = 0,
  onPlanStatusChange
}) => {
  // ═══════════════════════════════════════════════════════════════
  // STATE (सब कुछ OLD CODE से)
  // ═══════════════════════════════════════════════════════════════
  
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [plan, setPlan] = useState<Plan | null>(null);
  const [hasDisabledWorkers, setHasDisabledWorkers] = useState(false);
  const [loading, setLoading] = useState(true);
  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining>({
    days: 0, hours: 0, minutes: 0, seconds: 0
  });
  const [isExpired, setIsExpired] = useState(false);
  const [showExpiryPopup, setShowExpiryPopup] = useState(false); // ✅ OLD से
  const [lastChecked, setLastChecked] = useState<Date>(new Date()); // ✅ OLD से
  const [notification, setNotification] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });
  const [isPaymentProcessing, setIsPaymentProcessing] = useState(false);
  const [scanStats, setScanStats] = useState<ScanStats | null>(null);
  
  const disableTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isLoadingRef = useRef(false);
  const lastSubscriptionIdRef = useRef<string | null>(null);
  const lastExpiredStateRef = useRef<boolean>(false);
  const unsubscribeFirestoreRef = useRef<(() => void) | null>(null);

  // ═══════════════════════════════════════════════════════════════
  // ✅ 1. REAL-TIME FIRESTORE LISTENER (CORRECTED)
  // ═══════════════════════════════════════════════════════════════
  
  useEffect(() => {
    if (!sellerId) return;

    console.log('🔥 [REAL-TIME] Setting up Firestore listener for seller:', sellerId);

    const setupListener = async () => {
      try {
        setLoading(true);
        
        console.log('🔍 [REAL-TIME] Initial fetch...');
        const sub = await getSellerSubscription(sellerId, true);
        
        if (!sub || !sub.id) {
          console.log('ℹ️ [REAL-TIME] No subscription found');
          setSubscription(null);
          setPlan(null);
          setIsExpired(false);
          setScanStats(null);
          setLoading(false);
          return;
        }

        console.log('✅ [REAL-TIME] Initial subscription loaded:', sub.id);

        // ✅ FIXED: Load scan stats IMMEDIATELY (like OLD code)
        console.log('📊 [REAL-TIME] Loading initial scan stats...');
        await loadScanStats(sellerId);

        // Load plan
        const planData = await getPlanById(sub.plan_id);
        setPlan(planData);

        // Set initial state
        setSubscription(sub);
        const expired = isSubscriptionExpired(sub);
        setIsExpired(expired);
        setLastChecked(new Date()); // ✅ OLD से
        
        if (!expired) {
          sessionStorage.removeItem('expiry_popup_shown');
          setHasDisabledWorkers(false);
        }

        console.log('✅ [REAL-TIME] Initial state set:', {
          id: sub.id,
          plan: planData?.plan_name,
          expired,
          count: sub.current_scan_count
        });

        // Notify parent
        if (onPlanStatusChange) {
          const isActive = !expired && sub.status !== 'completed';
          onPlanStatusChange(isActive, expired);
          console.log('📢 [REAL-TIME] Initial parent notification:', { isActive, expired });
        }

        setLoading(false);

        // ✅ NOW setup real-time listener for future changes
        console.log('📍 [REAL-TIME] Setting up listener on:', `subscriptions/${sub.id}`);

        // const unsubscribe = onSnapshot(
        //   doc(db, 'subscriptions', sub.id),
        //   async (snapshot) => {
        //     console.log('🔔 [REAL-TIME] Firestore update detected!');
            
        //     if (!snapshot.exists()) {
        //       console.log('⚠️ [REAL-TIME] Subscription deleted');
        //       setSubscription(null);
        //       setPlan(null);
        //       setIsExpired(false);
        //       setScanStats(null);
        //       return;
        //     }

        //     const data = snapshot.data() as Subscription;
        //     console.log('📊 [REAL-TIME] Updated data:', {
        //       id: data.id,
        //       status: data.status,
        //       count: data.current_scan_count,
        //       limit: data.scan_limit
        //     });

        //     // Update subscription
        //     setSubscription(data);
        //     setLastChecked(new Date()); // ✅ OLD से

        //     // Update plan if changed
        //     if (data.plan_id !== plan?.id) {
        //       const planData = await getPlanById(data.plan_id);
        //       setPlan(planData);
        //     }

        //     // Check expiry
        //     const expired = isSubscriptionExpired(data);
        //     setIsExpired(expired);

        //     // ✅ Reload scan stats (REAL-TIME UPDATE)
        //     console.log('📊 [REAL-TIME] Reloading scan stats...');
        //     await loadScanStats(sellerId);

        //     console.log('✅ [REAL-TIME] State updated:', {
        //       expired,
        //       status: data.status
        //     });

        //     // Notify parent
        //     if (onPlanStatusChange) {
        //       const isActive = !expired && data.status !== 'completed';
        //       onPlanStatusChange(isActive, expired);
        //       console.log('📢 [REAL-TIME] Parent notified:', { isActive, expired });
        //     }
        //   },
        //   (error) => {
        //     console.error('❌ [REAL-TIME] Listener error:', error);
        //   }
        // );
//         const unsubscribe = onSnapshot(
//   doc(db, 'subscriptions', sub.id),
//   async (snapshot) => {
//     console.log('🔔 [REAL-TIME] Firestore update detected!');
    
//     if (!snapshot.exists()) {
//       console.log('⚠️ [REAL-TIME] Subscription deleted');
//       setSubscription(null);
//       setPlan(null);
//       setIsExpired(false);
//       setScanStats(null);
//       return;
//     }

//     const data = snapshot.data() as Subscription;
//     console.log('📊 [REAL-TIME] Updated data:', {
//       id: data.id,
//       status: data.status,
//       count: data.current_scan_count,
//       limit: data.scan_limit
//     });

//     // Update subscription
//     setSubscription(data);
//     setLastChecked(new Date());

//     // Update plan if changed
//     if (data.plan_id !== plan?.id) {
//       const planData = await getPlanById(data.plan_id);
//       setPlan(planData);
//     }

//     // ✅ FIX: Check BOTH time-based AND status-based expiry
//     const timeExpired = isSubscriptionExpired(data);
//     const statusCompleted = data.status === 'completed';
//     const expired = timeExpired || statusCompleted;
    
//     setIsExpired(expired);

//     console.log('🔍 [REAL-TIME] Expiry check:', {
//       timeExpired,
//       statusCompleted,
//       finalExpired: expired,
//       reason: expired ? (timeExpired ? 'TIME_EXPIRED' : 'SCAN_LIMIT_REACHED') : 'ACTIVE'
//     });

//     // ✅ Reload scan stats (especially important when limit reached)
//     console.log('📊 [REAL-TIME] Reloading scan stats...');
//     await loadScanStats(sellerId);

//     console.log('✅ [REAL-TIME] State updated:', {
//       expired,
//       status: data.status
//     });

//     // Notify parent
//     if (onPlanStatusChange) {
//       const isActive = !expired && data.status !== 'completed';
//       onPlanStatusChange(isActive, expired);
//       console.log('📢 [REAL-TIME] Parent notified:', { 
//         isActive, 
//         expired,
//         reason: !isActive ? (expired ? 'EXPIRED' : 'STATUS_NOT_ACTIVE') : 'ACTIVE'
//       });
//     }
//   },
//   (error) => {
//     console.error('❌ [REAL-TIME] Listener error:', error);
//   }
// ); 
const unsubscribe = onSnapshot(
  doc(db, 'subscriptions', sub.id),
  async (snapshot) => {
    console.log('🔔 [REAL-TIME] Firestore update detected!');
    
    if (!snapshot.exists()) {
      console.log('⚠️ [REAL-TIME] Subscription deleted');
      setSubscription(null);
      setPlan(null);
      setIsExpired(false);
      setScanStats(null);
      return;
    }

    const data = snapshot.data() as Subscription;
    console.log('📊 [REAL-TIME] Updated data:', {
      id: data.id,
      status: data.status,
      count: data.current_scan_count,
      limit: data.scan_limit
    });

    // Update subscription
    setSubscription(data);
    setLastChecked(new Date());

    // Update plan if changed
    if (data.plan_id !== plan?.id) {
      const planData = await getPlanById(data.plan_id);
      setPlan(planData);
    }

    // ✅ FIX: Check BOTH time-based AND status-based expiry
    const timeExpired = isSubscriptionExpired(data);
    const statusCompleted = data.status === 'completed';
    const expired = timeExpired || statusCompleted;
    
    setIsExpired(expired);

    console.log('🔍 [REAL-TIME] Expiry check:', {
      timeExpired,
      statusCompleted,
      finalExpired: expired,
      reason: expired ? (timeExpired ? 'TIME_EXPIRED' : 'SCAN_LIMIT_REACHED') : 'ACTIVE'
    });

    // ✅ Reload scan stats (especially important when limit reached)
    console.log('📊 [REAL-TIME] Reloading scan stats...');
    await loadScanStats(sellerId);

    console.log('✅ [REAL-TIME] State updated:', {
      expired,
      status: data.status
    });

    // Notify parent
    if (onPlanStatusChange) {
      const isActive = !expired && data.status !== 'completed';
      onPlanStatusChange(isActive, expired);
      console.log('📢 [REAL-TIME] Parent notified:', { 
        isActive, 
        expired,
        reason: !isActive ? (expired ? 'EXPIRED' : 'STATUS_NOT_ACTIVE') : 'ACTIVE'
      });
    }
  },
  (error) => {
    console.error('❌ [REAL-TIME] Listener error:', error);
  }
);



        unsubscribeFirestoreRef.current = unsubscribe;
        console.log('✅ [REAL-TIME] Listener active');

      } catch (error) {
        console.error('❌ [REAL-TIME] Setup failed:', error);
        setLoading(false);
      }
    };

    setupListener();

    // Cleanup
    return () => {
      if (unsubscribeFirestoreRef.current) {
        console.log('🧹 [REAL-TIME] Cleaning up listener');
        unsubscribeFirestoreRef.current();
        unsubscribeFirestoreRef.current = null;
      }
    };
  }, [sellerId]);

  // ═══════════════════════════════════════════════════════════════
  // ✅ 2. CROSS-TAB COMMUNICATION
  // ═══════════════════════════════════════════════════════════════
  
  useEffect(() => {
    console.log('📡 [CROSS-TAB] Setting up localStorage listener');

    const handleStorageEvent = (e: StorageEvent) => {
      if (e.key === 'scan_completed' || e.key === 'scan_limit_reached') {
        console.log('🔔 [CROSS-TAB] Scan event from another tab:', e.key);
        console.log('📊 [CROSS-TAB] Event data:', e.newValue);

        // Force immediate refresh
        setTimeout(() => {
          console.log('🔄 [CROSS-TAB] Triggering manual refresh...');
          loadSubscription(true);
        }, 500); // Small delay to ensure Firestore write completed
      }
    };

    window.addEventListener('storage', handleStorageEvent);

    return () => {
      console.log('🧹 [CROSS-TAB] Cleaning up listener');
      window.removeEventListener('storage', handleStorageEvent);
    };
  }, [sellerId]);

  // ═══════════════════════════════════════════════════════════════
  // ✅ 3. WINDOW FOCUS DETECTION
  // ═══════════════════════════════════════════════════════════════
  
  useEffect(() => {
    console.log('👁️ [FOCUS] Setting up focus listener');

    const handleFocus = () => {
      console.log('👁️ [FOCUS] Window focused - Checking updates...');
      
      const lastScanEvent = localStorage.getItem('last_scan_timestamp');
      const bannerLastChecked = lastChecked.toISOString();
      
      if (lastScanEvent && new Date(lastScanEvent) > new Date(bannerLastChecked)) {
        console.log('🔄 [FOCUS] New scan detected - Refreshing...');
        loadSubscription(true);
      } else {
        console.log('✅ [FOCUS] No new scans');
      }

      setLastChecked(new Date());
    };

    window.addEventListener('focus', handleFocus);

    return () => {
      console.log('🧹 [FOCUS] Cleaning up listener');
      window.removeEventListener('focus', handleFocus);
    };
  }, [sellerId, lastChecked]);

  // ═══════════════════════════════════════════════════════════════
  // ✅ 4. PAYMENT PROCESSING (OLD CODE से)
  // ═══════════════════════════════════════════════════════════════
  
  useEffect(() => {
    const checkPaymentProcessing = () => {
      const flag = localStorage.getItem('payment_processing');
      const isProcessing = flag === 'true';
      
      if (isProcessing !== isPaymentProcessing) {
        console.log('💳 [PAYMENT] Flag changed:', isProcessing);
        setIsPaymentProcessing(isProcessing);
      }
    };

    checkPaymentProcessing();
    const interval = setInterval(checkPaymentProcessing, 500);

    return () => clearInterval(interval);
  }, [isPaymentProcessing]);

  // ═══════════════════════════════════════════════════════════════
  // ✅ 5. FORCE REFRESH PROP (OLD CODE से)
  // ═══════════════════════════════════════════════════════════════
  
  useEffect(() => {
    if (forceRefresh > 0) {
      console.log('🔄 [FORCE] Force refresh triggered:', forceRefresh);
      loadSubscription(true);
    }
  }, [forceRefresh]);

  // ═══════════════════════════════════════════════════════════════
  // ✅ 6. NOTIFY PARENT (OLD CODE से)
  // ═══════════════════════════════════════════════════════════════
  
  useEffect(() => {
    if (lastExpiredStateRef.current !== isExpired) {
      console.log('🔔 [CALLBACK] Expiry changed:', {
        was: lastExpiredStateRef.current,
        now: isExpired
      });
      
      lastExpiredStateRef.current = isExpired;
      
      if (onPlanStatusChange) {
        const isActive = !isExpired && !!subscription && subscription.status !== 'completed';
        onPlanStatusChange(isActive, isExpired);
        console.log('📢 [CALLBACK] Parent notified:', { isActive, isExpired });
      }
    }
  }, [isExpired, subscription, onPlanStatusChange]);

  // ═══════════════════════════════════════════════════════════════
  // ✅ 7. DISABLE WORKERS (OLD CODE से)
  // ═══════════════════════════════════════════════════════════════
  
  useEffect(() => {
    if (isPaymentProcessing) {
      console.log('⏸️ [WORKER] Payment processing - Skip');
      return;
    }

    if (hasDisabledWorkers || !isExpired || !subscription) {
      return;
    }

    console.log('⏰ [WORKER] Plan expired - Scheduling disable (3s)...');
    
    if (disableTimeoutRef.current) {
      clearTimeout(disableTimeoutRef.current);
    }

    disableTimeoutRef.current = setTimeout(async () => {
      if (isPaymentProcessing || hasDisabledWorkers) {
        console.log('⏸️ [WORKER] Aborting');
        return;
      }

      try {
        const freshSub = await getSellerSubscription(sellerId, true);
        if (!freshSub || !isSubscriptionExpired(freshSub)) {
          console.log('✅ [WORKER] Now active - Abort');
          return;
        }

        console.log('⚠️ [WORKER] Disabling...');
        const result = await disableAllSellersWorkers(sellerId);
        
        if (result.success && result.count > 0) {
          console.log(`✅ [WORKER] Disabled ${result.count}`);
          setHasDisabledWorkers(true);
          showNotification('success', `🔒 ${result.count} worker(s) disabled.`);
        }
      } catch (error: any) {
        console.error('❌ [WORKER] Error:', error);
      }
    }, 3000);

    return () => {
      if (disableTimeoutRef.current) {
        clearTimeout(disableTimeoutRef.current);
      }
    };
  }, [isExpired, subscription, sellerId, hasDisabledWorkers, isPaymentProcessing]);

  // ═══════════════════════════════════════════════════════════════
  // ✅ 8. TIMER UPDATE (OLD CODE से)
  // ═══════════════════════════════════════════════════════════════
  
  useEffect(() => {
    if (subscription && subscription.end_date) {
      updateTimer();
      const interval = setInterval(updateTimer, 1000);
      return () => clearInterval(interval);
    }
  }, [subscription]);

  // ═══════════════════════════════════════════════════════════════
  // ✅ 9. EXPIRY POPUP (OLD CODE से)
  // ═══════════════════════════════════════════════════════════════
  
  useEffect(() => {
    if (isExpired && subscription && !sessionStorage.getItem('expiry_popup_shown')) {
      setShowExpiryPopup(true);
      sessionStorage.setItem('expiry_popup_shown', 'true');
    }
  }, [isExpired, subscription]);

  // ═══════════════════════════════════════════════════════════════
  // ✅ 10. NOTIFICATION AUTO-HIDE (OLD CODE से)
  // ═══════════════════════════════════════════════════════════════
  
  useEffect(() => {
    if (notification.type) {
      const timer = setTimeout(() => {
        setNotification({ type: null, message: '' });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  // ═══════════════════════════════════════════════════════════════
  // ✅ HELPER FUNCTIONS (सब OLD CODE से)
  // ═══════════════════════════════════════════════════════════════

  const loadScanStats = async (sellerId: string) => {
    try {
      console.log('📊 [STATS] Loading...');
      const stats = await getRemainingScanCount(sellerId);
      console.log('📊 [STATS] Loaded:', stats);
      setScanStats(stats);
    } catch (error) {
      console.error('❌ [STATS] Error:', error);
      setScanStats(null);
    }
  };

  // const loadSubscription = useCallback(async (forceServerFetch: boolean = false) => {
  //   if (isLoadingRef.current) {
  //     console.log('⏭️ [LOAD] Already loading');
  //     return;
  //   }

  //   try {
  //     isLoadingRef.current = true;
  //     setLoading(true);
      
  //     console.log('🔍 [LOAD] Fetching (force:', forceServerFetch, ')');
  //     const sub = await getSellerSubscription(sellerId, forceServerFetch);
      
  //     if (sub) {
  //       const changed = lastSubscriptionIdRef.current !== sub.id;
        
  //       if (changed) {
  //         console.log('🔄 [LOAD] Subscription changed:', {
  //           old: lastSubscriptionIdRef.current,
  //           new: sub.id
  //         });
  //         lastSubscriptionIdRef.current = sub.id;
  //         setHasDisabledWorkers(false);
  //         sessionStorage.removeItem('expiry_popup_shown');
  //       }

  //       setSubscription(sub);
  //       await loadScanStats(sellerId);
        
  //       const planData = await getPlanById(sub.plan_id);
  //       setPlan(planData);
        
  //       const expired = isSubscriptionExpired(sub);
  //       setIsExpired(expired);
        
  //       if (!expired) {
  //         sessionStorage.removeItem('expiry_popup_shown');
  //         setHasDisabledWorkers(false);
  //       }
        
  //       setLastChecked(new Date()); // ✅ OLD से
        
  //       console.log('✅ [LOAD] Loaded:', {
  //         id: sub.id,
  //         plan: planData?.plan_name,
  //         expired,
  //         count: sub.current_scan_count
  //       });
  //     } else {
  //       console.log('ℹ️ [LOAD] No subscription');
  //       setSubscription(null);
  //       setPlan(null);
  //       setIsExpired(false);
  //       setScanStats(null);
  //       lastSubscriptionIdRef.current = null;
  //     }
  //   } catch (error) {
  //     console.error('❌ [LOAD] Error:', error);
  //     showNotification('error', 'Failed to load subscription');
  //   } finally {
  //     setLoading(false);
  //     isLoadingRef.current = false;
  //   }
  // }, [sellerId]);

const loadSubscription = useCallback(async (forceServerFetch: boolean = false) => {
  if (isLoadingRef.current) {
    console.log('⏭️ [LOAD] Already loading');
    return;
  }

  try {
    isLoadingRef.current = true;
    setLoading(true);
    
    console.log('🔍 [LOAD] Fetching (force:', forceServerFetch, ')');
    const sub = await getSellerSubscription(sellerId, forceServerFetch);
    
    if (sub) {
      const changed = lastSubscriptionIdRef.current !== sub.id;
      
      if (changed) {
        console.log('🔄 [LOAD] Subscription changed:', {
          old: lastSubscriptionIdRef.current,
          new: sub.id
        });
        lastSubscriptionIdRef.current = sub.id;
        setHasDisabledWorkers(false);
        sessionStorage.removeItem('expiry_popup_shown');
      }

      setSubscription(sub);
      await loadScanStats(sellerId);
      
      const planData = await getPlanById(sub.plan_id);
      setPlan(planData);
      
      // ✅ FIX: Check BOTH time AND status
      const timeExpired = isSubscriptionExpired(sub);
      const statusCompleted = sub.status === 'completed';
      const expired = timeExpired || statusCompleted;
      
      setIsExpired(expired);
      
      if (!expired) {
        sessionStorage.removeItem('expiry_popup_shown');
        setHasDisabledWorkers(false);
      }
      
      setLastChecked(new Date());
      
      console.log('✅ [LOAD] Loaded:', {
        id: sub.id,
        plan: planData?.plan_name,
        expired,
        timeExpired,
        statusCompleted,
        reason: expired ? (timeExpired ? 'TIME' : 'SCAN_LIMIT') : 'ACTIVE',
        count: sub.current_scan_count
      });
    } else {
      console.log('ℹ️ [LOAD] No subscription');
      setSubscription(null);
      setPlan(null);
      setIsExpired(false);
      setScanStats(null);
      lastSubscriptionIdRef.current = null;
    }
  } catch (error) {
    console.error('❌ [LOAD] Error:', error);
    showNotification('error', 'Failed to load subscription');
  } finally {
    setLoading(false);
    isLoadingRef.current = false;
  }
}, [sellerId]);


  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
  };

  const updateTimer = () => {
    if (!subscription || !subscription.end_date) return;

    const endDate = new Date(subscription.end_date);
    const now = new Date();
    const diffMs = endDate.getTime() - now.getTime();

    if (diffMs <= 0) {
      setTimeRemaining({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      if (!isExpired) {
        console.log('⏰ [TIMER] Reached 0 - Expired');
        setIsExpired(true);
      }
      return;
    }

    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);

    setTimeRemaining({ days, hours, minutes, seconds });
  };

  const getTimerDisplay = (): string => {
    const { days, hours, minutes, seconds } = timeRemaining;
    if (days > 0) return `${days}d ${hours}h ${minutes}m ${seconds}s`;
    if (hours > 0) return `${hours}h ${minutes}m ${seconds}s`;
    if (minutes > 0) return `${minutes}m ${seconds}s`;
    return `${seconds}s`;
  };

  const getStatusColor = (): string => {
    if (isExpired) return 'from-red-600 to-red-700';
    const { days, hours } = timeRemaining;
    if (hours < 1 && days === 0) return 'from-red-500 to-orange-600';
    if (hours < 24 && days === 0) return 'from-orange-500 to-yellow-600';
    if (days < 7) return 'from-yellow-500 to-yellow-600';
    return 'from-green-600 to-emerald-600';
  };

  const shouldPulse = (): boolean => {
    const { hours, days } = timeRemaining;
    return (hours < 1 && days === 0) || isExpired;
  };

  const formatDate = (date: Date | string): string => {
    return new Date(date).toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // ═══════════════════════════════════════════════════════════════
  // ✅ RENDER (सब OLD CODE जैसा)
  // ═══════════════════════════════════════════════════════════════
  
  if (loading) {
    return (
      <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded-xl animate-pulse">
        <div className="h-6 sm:h-8 bg-gray-400 rounded w-1/2 mb-2"></div>
        <div className="h-3 sm:h-4 bg-gray-400 rounded w-1/3"></div>
      </div>
    );
  }

  if (!subscription || !plan) {
    return (
      <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl shadow-lg">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-start gap-2 sm:gap-3 flex-1 min-w-0">
            <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 mt-0.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-base sm:text-lg">No Active Plan</h3>
              <p className="text-xs sm:text-sm text-purple-100 mt-1">
                Subscribe to a plan to unlock all features!
              </p>
            </div>
          </div>
          <button
            onClick={onViewPlans}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white text-purple-600 px-3 sm:px-4 py-2 rounded-lg hover:bg-purple-50 transition-colors font-semibold shadow-md text-sm sm:text-base"
          >
            <Eye className="w-4 h-4" />
            View Plans
          </button>
        </div>
      </div>
    );
  }

  if (isExpired) {
    return (
      <>
        {notification.type && (
          <div className={`mb-4 p-3 sm:p-4 rounded-xl shadow-lg ${
            notification.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            <div className="flex items-start justify-between gap-3">
              <p className="text-sm sm:text-base flex-1">{notification.message}</p>
              <button onClick={() => setNotification({ type: null, message: '' })}>
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl shadow-lg animate-pulse">
          <div className="flex flex-col gap-3">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-2 sm:gap-3 flex-1 min-w-0">
                <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-base sm:text-lg">❌ Plan Expired</h3>
                  <p className="text-xs sm:text-sm opacity-90 mt-0.5">{plan.plan_name}</p>
                  <p className="text-xs mt-1">Expired: {formatDate(subscription.end_date)}</p>
                </div>
              </div>
              <button 
                onClick={() => loadSubscription(true)} 
                className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors flex-shrink-0"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={onViewPlans}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white text-red-600 px-4 py-2.5 rounded-lg hover:bg-red-50 transition-all font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-0.5 active:translate-y-0 text-sm sm:text-base"
            >
              <RefreshCw className="w-4 h-4" />
              Renew Plan Now
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      {notification.type && (
        <div className={`mb-4 p-3 sm:p-4 rounded-xl shadow-lg ${
          notification.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          <div className="flex items-start justify-between gap-3">
            <p className="text-sm sm:text-base flex-1">{notification.message}</p>
            <button onClick={() => setNotification({ type: null, message: '' })}>
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      <div className={`mb-4 sm:mb-6 p-3 sm:p-4 bg-gradient-to-r ${getStatusColor()} text-white rounded-xl shadow-lg ${
        shouldPulse() ? 'animate-pulse' : ''
      }`}>
        <div className="flex flex-col gap-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-2 sm:gap-3 flex-1 min-w-0">
              <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-base sm:text-lg truncate">
                  ✅ {plan.plan_name}
                </h3>
                <p className="text-xs sm:text-sm opacity-90 mt-0.5">
                  ₹{plan.price.toLocaleString()}
                </p>
              </div>
            </div>
            <button 
              onClick={() => loadSubscription(true)} 
              className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors flex-shrink-0"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

          {/* ✅ Scan Count - REAL-TIME */}
          {scanStats && !scanStats.unlimited && (
            <div className="flex items-center gap-2 border-t border-white border-opacity-20 pt-3 mt-3">
              <QrCode className="w-4 h-4 flex-shrink-0" />
              <div className="text-xs sm:text-sm flex-1">
                <div className="flex items-center justify-between">
                  <span>Scans:</span>
                  <span className="font-mono font-bold">
                    {scanStats.used} / {scanStats.total}
                  </span>
                </div>
                {scanStats.limitReached ? (
                  <div className="text-red-300 text-xs mt-1 font-semibold">
                    ⚠️ Limit reached - Subscription expired
                  </div>
                ) : scanStats.remaining > 0 ? (
                  <div className={`text-xs mt-1 ${
                    scanStats.remaining <= 2 ? 'text-yellow-300' : 'text-green-300'
                  }`}>
                    {scanStats.remaining} scan{scanStats.remaining !== 1 ? 's' : ''} remaining
                  </div>
                ) : (
                  <div className="text-red-300 text-xs mt-1 font-semibold">
                    ⚠️ Last scan used
                  </div>
                )}
              </div>
            </div>
          )}

          {scanStats && scanStats.unlimited && (
            <div className="flex items-center gap-2 border-t border-white border-opacity-20 pt-3 mt-3">
              <QrCode className="w-4 h-4 flex-shrink-0" />
              <div className="text-xs sm:text-sm">
                Scans: <span className="font-mono font-bold">Unlimited ∞</span>
                {scanStats.used > 0 && (
                  <span className="text-green-200 ml-2">({scanStats.used} used)</span>
                )}
              </div>
            </div>
          )}

          <div className="flex items-center gap-2 border-t border-white border-opacity-20 pt-3">
            <Clock className="w-4 h-4 flex-shrink-0" />
            <div className="text-xs sm:text-sm">
              Time Left: <span className="font-mono font-bold">{getTimerDisplay()}</span>
            </div>
          </div>

          <button
            onClick={onViewPlans}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white bg-opacity-20 hover:bg-opacity-30 px-4 py-2 rounded-lg transition-all font-medium text-sm backdrop-blur-sm"
          >
            <TrendingUp className="w-4 h-4" />
            Upgrade Plan
          </button>
        </div>
      </div>
    </>
  );
};

console.log('✅ PlanStatusBanner loaded - PRODUCTION v9.1 - Complete & Verified');