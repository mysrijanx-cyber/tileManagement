// // // // ═══════════════════════════════════════════════════════════════
// // // // ✅ PLAN STATUS BANNER - PRODUCTION v3.0 (AUTO-REFRESH FIXED)
// // // // ═══════════════════════════════════════════════════════════════

// // // import React, { useState, useEffect } from 'react';
// // // import { Clock, AlertTriangle, CheckCircle, RefreshCw, Eye, X } from 'lucide-react';
// // // import { getSellerSubscription, isSubscriptionExpired } from '../lib/subscriptionService';
// // // import { getPlanById } from '../lib/planService';
// // // import type { Subscription } from '../types/payment.types';
// // // import type { Plan } from '../types/plan.types';

// // // interface PlanStatusBannerProps {
// // //   sellerId: string;
// // //   onViewPlans: () => void;
// // //   forceRefresh?: number; // Add this to trigger refresh from parent
// // // }

// // // export const PlanStatusBanner: React.FC<PlanStatusBannerProps> = ({
// // //   sellerId,
// // //   onViewPlans,
// // //   forceRefresh = 0
// // // }) => {
// // //   const [subscription, setSubscription] = useState<Subscription | null>(null);
// // //   const [plan, setPlan] = useState<Plan | null>(null);
// // //   const [loading, setLoading] = useState(true);
// // //   const [timeRemaining, setTimeRemaining] = useState({
// // //     days: 0,
// // //     hours: 0,
// // //     minutes: 0,
// // //     seconds: 0
// // //   });
// // //   const [isExpired, setIsExpired] = useState(false);
// // //   const [showExpiryPopup, setShowExpiryPopup] = useState(false);
// // //   const [lastChecked, setLastChecked] = useState<Date>(new Date());

// // //   // Load subscription on mount and when forceRefresh changes
// // //   useEffect(() => {
// // //     console.log('🔄 PlanStatusBanner: Loading subscription...');
// // //     loadSubscription();
// // //     const interval = setInterval(loadSubscription, 30000); // Check every 30 seconds
// // //     return () => clearInterval(interval);
// // //   }, [sellerId, forceRefresh]);

// // //   // Update timer every second
// // //   useEffect(() => {
// // //     if (subscription) {
// // //       updateTimer();
// // //       const interval = setInterval(updateTimer, 1000);
// // //       return () => clearInterval(interval);
// // //     }
// // //   }, [subscription]);

// // //   // Show expiry popup when plan expires
// // //   useEffect(() => {
// // //     if (isExpired && subscription && !sessionStorage.getItem('expiry_popup_shown')) {
// // //       setShowExpiryPopup(true);
// // //       sessionStorage.setItem('expiry_popup_shown', 'true');
// // //     }
// // //   }, [isExpired]);

// // //   const loadSubscription = async () => {
// // //     try {
// // //       setLoading(true);
// // //       console.log('🔍 Fetching subscription for seller:', sellerId);
      
// // //       const sub = await getSellerSubscription(sellerId);
      
// // //       if (sub) {
// // //         console.log('✅ Subscription found:', sub.id);
// // //         setSubscription(sub);
        
// // //         const planData = await getPlanById(sub.plan_id);
// // //         console.log('📋 Plan loaded:', planData?.plan_name);
// // //         setPlan(planData);
        
// // //         const expired = isSubscriptionExpired(sub);
// // //         console.log('⏱️ Subscription expired:', expired);
// // //         setIsExpired(expired);
        
// // //         setLastChecked(new Date());
// // //       } else {
// // //         console.log('ℹ️ No active subscription found');
// // //         setSubscription(null);
// // //         setPlan(null);
// // //         setIsExpired(false);
// // //       }
// // //     } catch (error) {
// // //       console.error('❌ Error loading subscription:', error);
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   };

// // //   const updateTimer = () => {
// // //     if (!subscription || !subscription.end_date) return;

// // //     const endDate = new Date(subscription.end_date);
// // //     const now = new Date();
// // //     const diffMs = endDate.getTime() - now.getTime();

// // //     if (diffMs <= 0) {
// // //       setTimeRemaining({ days: 0, hours: 0, minutes: 0, seconds: 0 });
// // //       setIsExpired(true);
// // //       return;
// // //     }

// // //     const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
// // //     const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
// // //     const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
// // //     const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);

// // //     setTimeRemaining({ days, hours, minutes, seconds });
// // //     setIsExpired(false);
// // //   };

// // //   const getTimerDisplay = () => {
// // //     const { days, hours, minutes, seconds } = timeRemaining;

// // //     if (days > 0) {
// // //       return `${days}d ${hours}h ${minutes}m ${seconds}s`;
// // //     } else if (hours > 0) {
// // //       return `${hours}h ${minutes}m ${seconds}s`;
// // //     } else if (minutes > 0) {
// // //       return `${minutes}m ${seconds}s`;
// // //     } else {
// // //       return `${seconds}s`;
// // //     }
// // //   };

// // //   const getStatusColor = () => {
// // //     if (isExpired) return 'from-red-600 to-red-700';

// // //     const { days, hours } = timeRemaining;

// // //     if (hours < 1 && days === 0) return 'from-red-500 to-orange-600';
// // //     if (hours < 24 && days === 0) return 'from-orange-500 to-yellow-600';
// // //     if (days < 7) return 'from-yellow-500 to-yellow-600';
// // //     return 'from-green-600 to-emerald-600';
// // //   };

// // //   const shouldPulse = () => {
// // //     const { hours, days } = timeRemaining;
// // //     return (hours < 1 && days === 0) || isExpired;
// // //   };

// // //   if (loading) {
// // //     return (
// // //       <div className="mb-4 sm:mb-6 p-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded-xl animate-pulse">
// // //         <div className="h-8 bg-gray-400 rounded w-1/2 mb-2"></div>
// // //         <div className="h-4 bg-gray-400 rounded w-1/3"></div>
// // //       </div>
// // //     );
// // //   }

// // //   if (!subscription || !plan) {
// // //     return (
// // //       <div className="mb-4 sm:mb-6 p-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl shadow-lg">
// // //         <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
// // //           <div className="flex items-start gap-3">
// // //             <AlertTriangle className="w-6 h-6 mt-0.5 flex-shrink-0" />
// // //             <div>
// // //               <h3 className="font-bold text-lg">No Active Plan</h3>
// // //               <p className="text-sm text-purple-100 mt-1">
// // //                 Subscribe to a plan to unlock all features!
// // //               </p>
// // //             </div>
// // //           </div>
// // //           <button
// // //             onClick={onViewPlans}
// // //             className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white text-purple-600 px-4 py-2 rounded-lg hover:bg-purple-50 transition-colors font-semibold shadow-md"
// // //           >
// // //             <Eye className="w-4 h-4" />
// // //             View Plans
// // //           </button>
// // //         </div>
// // //       </div>
// // //     );
// // //   }

// // //   return (
// // //     <>
// // //       <div
// // //         className={`mb-4 sm:mb-6 p-4 bg-gradient-to-r ${getStatusColor()} text-white rounded-xl shadow-lg ${
// // //           shouldPulse() ? 'animate-pulse' : ''
// // //         }`}
// // //       >
// // //         <div className="flex flex-col gap-3">
// // //           <div className="flex items-start justify-between gap-3">
// // //             <div className="flex items-start gap-3 flex-1 min-w-0">
// // //               {isExpired ? (
// // //                 <AlertTriangle className="w-6 h-6 mt-0.5 flex-shrink-0" />
// // //               ) : (
// // //                 <CheckCircle className="w-6 h-6 mt-0.5 flex-shrink-0" />
// // //               )}
// // //               <div className="flex-1 min-w-0">
// // //                 <h3 className="font-bold text-lg sm:text-xl truncate">
// // //                   {isExpired ? '❌ Plan Expired' : `✅ ${plan.plan_name}`}
// // //                 </h3>
// // //                 <p className="text-sm opacity-90 mt-0.5">
// // //                   {isExpired
// // //                     ? 'Your subscription has ended'
// // //                     : `₹${plan.price.toLocaleString()} / ${plan.billing_cycle}`}
// // //                 </p>
// // //               </div>
// // //             </div>

// // //             <button
// // //               onClick={loadSubscription}
// // //               className="flex-shrink-0 p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
// // //               title="Refresh Status"
// // //             >
// // //               <RefreshCw className="w-5 h-5" />
// // //             </button>
// // //           </div>

// // //           <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-t border-white border-opacity-20 pt-3">
// // //             <div className="flex items-center gap-2">
// // //               <Clock className="w-5 h-5 flex-shrink-0" />
// // //               <div className="text-sm">
// // //                 {isExpired ? (
// // //                   <>
// // //                     <span className="opacity-90">Expired on: </span>
// // //                     <span className="font-bold">
// // //                       {new Date(subscription.end_date).toLocaleString('en-IN', {
// // //                         day: 'numeric',
// // //                         month: 'short',
// // //                         year: 'numeric',
// // //                         hour: '2-digit',
// // //                         minute: '2-digit'
// // //                       })}
// // //                     </span>
// // //                   </>
// // //                 ) : (
// // //                   <>
// // //                     <span className="opacity-90">Time Left: </span>
// // //                     <span className="font-bold font-mono">{getTimerDisplay()}</span>
// // //                   </>
// // //                 )}
// // //               </div>
// // //             </div>

// // //             <div className="flex gap-2">
// // //               {isExpired && (
// // //                 <button
// // //                   onClick={onViewPlans}
// // //                   className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-white text-red-700 px-4 py-2 rounded-lg hover:bg-red-50 transition-colors font-semibold shadow-md"
// // //                 >
// // //                   <Eye className="w-4 h-4" />
// // //                   Renew Now
// // //                 </button>
// // //               )}
// // //               {!isExpired && timeRemaining.days < 7 && (
// // //                 <button
// // //                   onClick={onViewPlans}
// // //                   className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-white bg-opacity-90 hover:bg-opacity-100 text-gray-900 px-4 py-2 rounded-lg transition-colors font-semibold shadow-md"
// // //                 >
// // //                   <Eye className="w-4 h-4" />
// // //                   Upgrade
// // //                 </button>
// // //               )}
// // //             </div>
// // //           </div>

// // //           {!isExpired && (
// // //             <div className="text-xs opacity-75 flex items-center gap-1.5">
// // //               <span>📅</span>
// // //               <span>
// // //                 Expires: {new Date(subscription.end_date).toLocaleString('en-IN', {
// // //                   day: 'numeric',
// // //                   month: 'short',
// // //                   year: 'numeric',
// // //                   hour: '2-digit',
// // //                   minute: '2-digit'
// // //                 })}
// // //               </span>
// // //             </div>
// // //           )}
          
// // //           <div className="text-xs opacity-60 flex items-center gap-1.5">
// // //             <span>🔄</span>
// // //             <span>Last checked: {lastChecked.toLocaleTimeString('en-IN')}</span>
// // //           </div>
// // //         </div>
// // //       </div>

// // //       {showExpiryPopup && isExpired && (
// // //         <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black bg-opacity-70 animate-fade-in">
// // //           <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-scale-in">
// // //             <div className="bg-gradient-to-r from-red-600 to-orange-600 text-white p-6">
// // //               <div className="flex items-center justify-between">
// // //                 <div className="flex items-center gap-3">
// // //                   <div className="p-3 bg-white bg-opacity-20 rounded-full">
// // //                     <AlertTriangle className="w-8 h-8" />
// // //                   </div>
// // //                   <div>
// // //                     <h3 className="text-2xl font-bold">Plan Expired!</h3>
// // //                     <p className="text-sm text-red-100 mt-1">Immediate action required</p>
// // //                   </div>
// // //                 </div>
// // //                 <button
// // //                   onClick={() => setShowExpiryPopup(false)}
// // //                   className="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-2 transition-colors"
// // //                 >
// // //                   <X className="w-5 h-5" />
// // //                 </button>
// // //               </div>
// // //             </div>

// // //             <div className="p-6">
// // //               <div className="space-y-4">
// // //                 <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4">
// // //                   <p className="text-red-800 font-bold mb-2 text-lg">
// // //                     🚫 Your {plan.plan_name} plan has expired
// // //                   </p>
// // //                   <div className="text-sm text-red-700 space-y-1">
// // //                     <p><strong>Plan:</strong> {plan.plan_name}</p>
// // //                     <p><strong>Price:</strong> ₹{plan.price.toLocaleString()}</p>
// // //                     <p><strong>Expired:</strong> {new Date(subscription.end_date).toLocaleString('en-IN')}</p>
// // //                   </div>
// // //                 </div>

// // //                 <div className="space-y-2">
// // //                   <p className="font-bold text-gray-800 flex items-center gap-2">
// // //                     <span>⚠️</span>
// // //                     <span>Limited Access Active:</span>
// // //                   </p>
// // //                   <ul className="space-y-2 text-sm text-gray-700">
// // //                     <li className="flex items-start gap-2">
// // //                       <span className="text-red-500 mt-0.5">✗</span>
// // //                       <span>Cannot add new tiles</span>
// // //                     </li>
// // //                     <li className="flex items-start gap-2">
// // //                       <span className="text-red-500 mt-0.5">✗</span>
// // //                       <span>QR code generation disabled</span>
// // //                     </li>
// // //                     <li className="flex items-start gap-2">
// // //                       <span className="text-red-500 mt-0.5">✗</span>
// // //                       <span>Analytics unavailable</span>
// // //                     </li>
// // //                     <li className="flex items-start gap-2">
// // //                       <span className="text-red-500 mt-0.5">✗</span>
// // //                       <span>Customer inquiries blocked</span>
// // //                     </li>
// // //                   </ul>
// // //                 </div>

// // //                 <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-lg p-4">
// // //                   <p className="text-blue-800 text-sm font-medium">
// // //                     💡 <strong>Renew your plan now</strong> to restore full access!
// // //                   </p>
// // //                 </div>
// // //               </div>

// // //               <div className="flex flex-col sm:flex-row gap-3 mt-6">
// // //                 <button
// // //                   onClick={() => setShowExpiryPopup(false)}
// // //                   className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
// // //                 >
// // //                   Dismiss
// // //                 </button>
// // //                 <button
// // //                   onClick={() => {
// // //                     setShowExpiryPopup(false);
// // //                     onViewPlans();
// // //                   }}
// // //                   className="flex-1 px-4 py-3 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-lg hover:from-red-700 hover:to-orange-700 transition-all font-bold shadow-lg"
// // //                 >
// // //                   Renew Plan Now
// // //                 </button>
// // //               </div>
// // //             </div>
// // //           </div>
// // //         </div>
// // //       )}
// // //     </>
// // //   );
// // // };

// // // console.log('✅ PlanStatusBanner Component loaded - v3.0'); 
// // // ═══════════════════════════════════════════════════════════════
// // // ✅ PLAN STATUS BANNER - PRODUCTION v4.0 (COMPLETE)
// // // ═══════════════════════════════════════════════════════════════

// // import React, { useState, useEffect } from 'react';
// // import { Clock, AlertTriangle, CheckCircle, RefreshCw, Eye, X, Shield } from 'lucide-react';
// // import { getSellerSubscription, isSubscriptionExpired } from '../lib/subscriptionService';
// // import { getPlanById } from '../lib/planService';
// // import type { Subscription } from '../types/payment.types';
// // import type { Plan } from '../types/plan.types';
// // import { disableAllSellersWorkers } from '../lib/firebaseutils';

// // interface PlanStatusBannerProps {
// //   sellerId: string;
// //   onViewPlans: () => void;
// //   forceRefresh?: number;
// // }

// // export const PlanStatusBanner: React.FC<PlanStatusBannerProps> = ({
// //   sellerId,
// //   onViewPlans,
// //   forceRefresh = 0
// // }) => {
// //   const [subscription, setSubscription] = useState<Subscription | null>(null);
// //   const [plan, setPlan] = useState<Plan | null>(null);
// //   const [hasDisabledWorkers, setHasDisabledWorkers] = useState(false);
// //   const [loading, setLoading] = useState(true);
// //   const [timeRemaining, setTimeRemaining] = useState({
// //     days: 0,
// //     hours: 0,
// //     minutes: 0,
// //     seconds: 0
// //   });
// //   const [isExpired, setIsExpired] = useState(false);
// //   const [showExpiryPopup, setShowExpiryPopup] = useState(false);
// //   const [lastChecked, setLastChecked] = useState<Date>(new Date());

// //   // ═══════════════════════════════════════════════════════════════
// //   // ✅ LOAD SUBSCRIPTION ON MOUNT & FORCE REFRESH
// //   // ═══════════════════════════════════════════════════════════════
  
// //   useEffect(() => {
// //     console.log('🔄 PlanStatusBanner: Loading subscription... (forceRefresh:', forceRefresh, ')');
// //     loadSubscription();
    
// //     // Auto-refresh every 30 seconds
// //     const interval = setInterval(loadSubscription, 30000);
    
// //     return () => {
// //       console.log('🔌 PlanStatusBanner: Cleanup');
// //       clearInterval(interval);
// //     };
// //   }, [sellerId, forceRefresh]);

// //   // ═══════════════════════════════════════════════════════════════
// //   // ✅ UPDATE TIMER EVERY SECOND
// //   // ═══════════════════════════════════════════════════════════════
// //   useEffect(() => {
// //   const handlePlanExpiry = async () => {
// //     if (isExpired && subscription && !hasDisabledWorkers) {
// //       console.log('⚠️ Plan expired - Disabling all workers...');
      
// //       try {
// //         const result = await disableAllSellersWorkers(sellerId);
        
// //         if (result.success && result.count > 0) {
// //           console.log(`✅ Disabled ${result.count} worker(s) due to plan expiry`);
// //           setHasDisabledWorkers(true);
          
// //           // Show notification
// //           setSuccess(`🔒 ${result.count} worker account(s) disabled due to plan expiry. They will be re-enabled when you renew.`);
// //         }
// //       } catch (error: any) {
// //         console.error('❌ Failed to disable workers:', error);
// //       }
// //     }
// //   };

// //   handlePlanExpiry();
// // }, [isExpired, subscription, sellerId, hasDisabledWorkers]);

// //   useEffect(() => {
// //     if (subscription) {
// //       updateTimer();
// //       const interval = setInterval(updateTimer, 1000);
// //       return () => clearInterval(interval);
// //     }
// //   }, [subscription]);

// //   // ═══════════════════════════════════════════════════════════════
// //   // ✅ SHOW EXPIRY POPUP ONCE
// //   // ═══════════════════════════════════════════════════════════════
  
// //   useEffect(() => {
// //     if (isExpired && subscription && !sessionStorage.getItem('expiry_popup_shown')) {
// //       setShowExpiryPopup(true);
// //       sessionStorage.setItem('expiry_popup_shown', 'true');
// //     }
// //   }, [isExpired]);

// //   // ═══════════════════════════════════════════════════════════════
// //   // ✅ LOAD SUBSCRIPTION DATA
// //   // ═══════════════════════════════════════════════════════════════
  
// //   const loadSubscription = async () => {
// //     try {
// //       setLoading(true);
// //       console.log('🔍 Fetching subscription for seller:', sellerId);
      
// //       // Clear cache to force fresh data
// //       sessionStorage.removeItem('expiry_popup_shown');
      
// //       const sub = await getSellerSubscription(sellerId);
      
// //       if (sub) {
// //         console.log('✅ Subscription found:', sub.id);
// //         setSubscription(sub);
        
// //         const planData = await getPlanById(sub.plan_id);
// //         console.log('📋 Plan loaded:', planData?.plan_name);
// //         setPlan(planData);
        
// //         const expired = isSubscriptionExpired(sub);
// //         console.log('⏱️ Subscription expired:', expired);
// //         setIsExpired(expired);
        
// //         // Clear popup flag if not expired anymore
// //         if (!expired) {
// //           sessionStorage.removeItem('expiry_popup_shown');
// //         }
        
// //         setLastChecked(new Date());
// //       } else {
// //         console.log('ℹ️ No active subscription found');
// //         setSubscription(null);
// //         setPlan(null);
// //         setIsExpired(false);
// //       }
// //     } catch (error) {
// //       console.error('❌ Error loading subscription:', error);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   // ═══════════════════════════════════════════════════════════════
// //   // ✅ UPDATE COUNTDOWN TIMER
// //   // ═══════════════════════════════════════════════════════════════
  
// //   const updateTimer = () => {
// //     if (!subscription || !subscription.end_date) return;

// //     const endDate = new Date(subscription.end_date);
// //     const now = new Date();
// //     const diffMs = endDate.getTime() - now.getTime();

// //     if (diffMs <= 0) {
// //       setTimeRemaining({ days: 0, hours: 0, minutes: 0, seconds: 0 });
// //       setIsExpired(true);
// //       return;
// //     }

// //     const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
// //     const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
// //     const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
// //     const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);

// //     setTimeRemaining({ days, hours, minutes, seconds });
// //     setIsExpired(false);
// //   };

// //   // ═══════════════════════════════════════════════════════════════
// //   // ✅ GET TIMER DISPLAY
// //   // ═══════════════════════════════════════════════════════════════
  
// //   const getTimerDisplay = () => {
// //     const { days, hours, minutes, seconds } = timeRemaining;

// //     if (days > 0) {
// //       return `${days}d ${hours}h ${minutes}m ${seconds}s`;
// //     } else if (hours > 0) {
// //       return `${hours}h ${minutes}m ${seconds}s`;
// //     } else if (minutes > 0) {
// //       return `${minutes}m ${seconds}s`;
// //     } else {
// //       return `${seconds}s`;
// //     }
// //   };

// //   // ═══════════════════════════════════════════════════════════════
// //   // ✅ GET STATUS COLOR
// //   // ═══════════════════════════════════════════════════════════════
  
// //   const getStatusColor = () => {
// //     if (isExpired) return 'from-red-600 to-red-700';

// //     const { days, hours } = timeRemaining;

// //     if (hours < 1 && days === 0) return 'from-red-500 to-orange-600';
// //     if (hours < 24 && days === 0) return 'from-orange-500 to-yellow-600';
// //     if (days < 7) return 'from-yellow-500 to-yellow-600';
// //     return 'from-green-600 to-emerald-600';
// //   };

// //   // ═══════════════════════════════════════════════════════════════
// //   // ✅ SHOULD PULSE ANIMATION
// //   // ═══════════════════════════════════════════════════════════════
  
// //   const shouldPulse = () => {
// //     const { hours, days } = timeRemaining;
// //     return (hours < 1 && days === 0) || isExpired;
// //   };

// //   // ═══════════════════════════════════════════════════════════════
// //   // ✅ LOADING STATE - RESPONSIVE
// //   // ═══════════════════════════════════════════════════════════════
  
// //   if (loading) {
// //     return (
// //       <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded-xl animate-pulse">
// //         <div className="h-6 sm:h-8 bg-gray-400 rounded w-1/2 mb-2"></div>
// //         <div className="h-3 sm:h-4 bg-gray-400 rounded w-1/3"></div>
// //       </div>
// //     );
// //   }

// //   // ═══════════════════════════════════════════════════════════════
// //   // ✅ NO SUBSCRIPTION STATE - RESPONSIVE
// //   // ═══════════════════════════════════════════════════════════════
  
// //   if (!subscription || !plan) {
// //     console.log('ℹ️ Rendering "No Active Plan" banner');
// //     return (
// //       <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl shadow-lg">
// //         <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
// //           <div className="flex items-start gap-2 sm:gap-3 flex-1 min-w-0">
// //             <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 mt-0.5 flex-shrink-0" />
// //             <div className="flex-1 min-w-0">
// //               <h3 className="font-bold text-base sm:text-lg">No Active Plan</h3>
// //               <p className="text-xs sm:text-sm text-purple-100 mt-1">
// //                 Subscribe to a plan to unlock all features!
// //               </p>
// //             </div>
// //           </div>
// //           <button
// //             onClick={onViewPlans}
// //             className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white text-purple-600 px-3 sm:px-4 py-2 rounded-lg hover:bg-purple-50 active:bg-purple-100 transition-colors font-semibold shadow-md text-sm sm:text-base"
// //           >
// //             <Eye className="w-4 h-4" />
// //             View Plans
// //           </button>
// //         </div>
// //       </div>
// //     );
// //   }

// //   // ═══════════════════════════════════════════════════════════════
// //   // ✅ MAIN BANNER - RESPONSIVE
// //   // ═══════════════════════════════════════════════════════════════
  
// //   console.log('✅ Rendering banner - Expired:', isExpired, 'Days left:', timeRemaining.days);
  
// //   return (
// //     <>
// //       <div
// //         className={`mb-4 sm:mb-6 p-3 sm:p-4 bg-gradient-to-r ${getStatusColor()} text-white rounded-xl shadow-lg ${
// //           shouldPulse() ? 'animate-pulse' : ''
// //         }`}
// //       >
// //         <div className="flex flex-col gap-3">
// //           {/* Header Row */}
// //           <div className="flex items-start justify-between gap-3">
// //             <div className="flex items-start gap-2 sm:gap-3 flex-1 min-w-0">
// //               {isExpired ? (
// //                 <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 mt-0.5 flex-shrink-0" />
// //               ) : (
// //                 <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 mt-0.5 flex-shrink-0" />
// //               )}
// //               <div className="flex-1 min-w-0">
// //                 <h3 className="font-bold text-base sm:text-lg lg:text-xl truncate">
// //                   {isExpired ? '❌ Plan Expired' : `✅ ${plan.plan_name}`}
// //                 </h3>
// //                 <p className="text-xs sm:text-sm opacity-90 mt-0.5">
// //                   {isExpired
// //                     ? 'Your subscription has ended'
// //                     : `₹${plan.price.toLocaleString()} / ${plan.billing_cycle}`}
// //                 </p>
// //               </div>
// //             </div>

// //             <button
// //               onClick={loadSubscription}
// //               className="flex-shrink-0 p-1.5 sm:p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
// //               title="Refresh Status"
// //             >
// //               <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5" />
// //             </button>
// //           </div>

// //           {/* Timer/Action Row */}
// //           <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-t border-white border-opacity-20 pt-3">
// //             <div className="flex items-center gap-2">
// //               <Clock className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
// //               <div className="text-xs sm:text-sm">
// //                 {isExpired ? (
// //                   <>
// //                     <span className="opacity-90">Expired on: </span>
// //                     <span className="font-bold">
// //                       {new Date(subscription.end_date).toLocaleString('en-IN', {
// //                         day: 'numeric',
// //                         month: 'short',
// //                         year: 'numeric',
// //                         hour: '2-digit',
// //                         minute: '2-digit'
// //                       })}
// //                     </span>
// //                   </>
// //                 ) : (
// //                   <>
// //                     <span className="opacity-90">Time Left: </span>
// //                     <span className="font-bold font-mono">{getTimerDisplay()}</span>
// //                   </>
// //                 )}
// //               </div>
// //             </div>

// //             {/* Action Button */}
// //             <div className="flex gap-2">
// //               {isExpired ? (
// //                 <button
// //                   onClick={onViewPlans}
// //                   className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-white text-red-700 px-3 sm:px-4 py-2 rounded-lg hover:bg-red-50 active:bg-red-100 transition-colors font-semibold shadow-md text-xs sm:text-sm"
// //                 >
// //                   <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
// //                   Renew Now
// //                 </button>
// //               ) : timeRemaining.days < 7 ? (
// //                 <button
// //                   onClick={onViewPlans}
// //                   className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-white bg-opacity-90 hover:bg-opacity-100 text-gray-900 px-3 sm:px-4 py-2 rounded-lg transition-colors font-semibold shadow-md text-xs sm:text-sm"
// //                 >
// //                   <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
// //                   Upgrade Plan
// //                 </button>
// //               ) : null}
// //             </div>
// //           </div>

// //           {/* Expiry Date (Active Plan) */}
// //           {!isExpired && (
// //             <div className="text-xs opacity-75 flex items-center gap-1.5">
// //               <span>📅</span>
// //               <span>
// //                 Expires: {new Date(subscription.end_date).toLocaleString('en-IN', {
// //                   day: 'numeric',
// //                   month: 'short',
// //                   year: 'numeric',
// //                   hour: '2-digit',
// //                   minute: '2-digit'
// //                 })}
// //               </span>
// //             </div>
// //           )}
          
// //           {/* Last Checked */}
// //           <div className="text-xs opacity-60 flex items-center gap-1.5">
// //             <span>🔄</span>
// //             <span>Last checked: {lastChecked.toLocaleTimeString('en-IN')}</span>
// //           </div>
// //         </div>
// //       </div>

// //       {/* ═══════════════════════════════════════════════════════════════ */}
// //       {/* ✅ EXPIRY POPUP - RESPONSIVE */}
// //       {/* ═══════════════════════════════════════════════════════════════ */}
      
// //       {showExpiryPopup && isExpired && (
// //         <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black bg-opacity-70 animate-fade-in">
// //           <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-scale-in">
            
// //             {/* Header */}
// //             <div className="bg-gradient-to-r from-red-600 to-orange-600 text-white p-4 sm:p-6">
// //               <div className="flex items-center justify-between">
// //                 <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
// //                   <div className="p-2 sm:p-3 bg-white bg-opacity-20 rounded-full flex-shrink-0">
// //                     <AlertTriangle className="w-6 h-6 sm:w-8 sm:h-8" />
// //                   </div>
// //                   <div className="flex-1 min-w-0">
// //                     <h3 className="text-xl sm:text-2xl font-bold">Plan Expired!</h3>
// //                     <p className="text-xs sm:text-sm text-red-100 mt-1">Immediate action required</p>
// //                   </div>
// //                 </div>
// //                 <button
// //                   onClick={() => setShowExpiryPopup(false)}
// //                   className="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-1.5 sm:p-2 transition-colors flex-shrink-0"
// //                 >
// //                   <X className="w-4 h-4 sm:w-5 sm:h-5" />
// //                 </button>
// //               </div>
// //             </div>

// //             {/* Content */}
// //             <div className="p-4 sm:p-6">
// //               <div className="space-y-3 sm:space-y-4">
                
// //                 {/* Plan Details */}
// //                 <div className="bg-red-50 border-2 border-red-200 rounded-lg p-3 sm:p-4">
// //                   <p className="text-red-800 font-bold mb-2 text-base sm:text-lg">
// //                     🚫 Your {plan.plan_name} plan has expired
// //                   </p>
// //                   <div className="text-xs sm:text-sm text-red-700 space-y-1">
// //                     <p><strong>Plan:</strong> {plan.plan_name}</p>
// //                     <p><strong>Price:</strong> ₹{plan.price.toLocaleString()}</p>
// //                     <p><strong>Expired:</strong> {new Date(subscription.end_date).toLocaleString('en-IN')}</p>
// //                   </div>
// //                 </div>

// //                 {/* Limited Access Notice */}
// //                 <div className="space-y-2">
// //                   <p className="font-bold text-gray-800 flex items-center gap-2 text-sm sm:text-base">
// //                     <span>⚠️</span>
// //                     <span>Limited Access Active:</span>
// //                   </p>
// //                   <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-gray-700">
// //                     <li className="flex items-start gap-2">
// //                       <span className="text-red-500 mt-0.5">✗</span>
// //                       <span>Cannot add new tiles</span>
// //                     </li>
// //                     <li className="flex items-start gap-2">
// //                       <span className="text-red-500 mt-0.5">✗</span>
// //                       <span>QR code generation disabled</span>
// //                     </li>
// //                     <li className="flex items-start gap-2">
// //                       <span className="text-red-500 mt-0.5">✗</span>
// //                       <span>Analytics unavailable</span>
// //                     </li>
// //                     <li className="flex items-start gap-2">
// //                       <span className="text-red-500 mt-0.5">✗</span>
// //                       <span>Customer inquiries blocked</span>
// //                     </li>
// //                   </ul>
// //                 </div>

// //                 {/* Renewal CTA */}
// //                 <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-lg p-3 sm:p-4">
// //                   <p className="text-blue-800 text-xs sm:text-sm font-medium">
// //                     💡 <strong>Renew your plan now</strong> to restore full access!
// //                   </p>
// //                 </div>
// //               </div>

// //               {/* Action Buttons */}
// //               <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-4 sm:mt-6">
// //                 <button
// //                   onClick={() => setShowExpiryPopup(false)}
// //                   className="flex-1 px-4 py-2.5 sm:py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 active:bg-gray-100 transition-colors font-semibold text-sm sm:text-base"
// //                 >
// //                   Dismiss
// //                 </button>
// //                 <button
// //                   onClick={() => {
// //                     setShowExpiryPopup(false);
// //                     onViewPlans();
// //                   }}
// //                   className="flex-1 px-4 py-2.5 sm:py-3 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-lg hover:from-red-700 hover:to-orange-700 active:from-red-800 active:to-orange-800 transition-all font-bold shadow-lg text-sm sm:text-base"
// //                 >
// //                   Renew Plan Now
// //                 </button>
// //               </div>
// //             </div>
// //           </div>
// //         </div>
// //       )}
// //     </>
// //   );
// // };

// // console.log('✅ PlanStatusBanner Component loaded - PRODUCTION v4.0'); 
// import React, { useState, useEffect } from 'react';
// import { Clock, AlertTriangle, CheckCircle, RefreshCw, Eye, X } from 'lucide-react';
// import { getSellerSubscription, isSubscriptionExpired } from '../lib/subscriptionService';
// import { getPlanById } from '../lib/planService';
// import { disableAllSellersWorkers } from '../lib/firebaseutils';
// import type { Subscription } from '../types/payment.types';
// import type { Plan } from '../types/plan.types';

// // ═══════════════════════════════════════════════════════════════
// // 📋 COMPONENT PROPS
// // ═══════════════════════════════════════════════════════════════

// interface PlanStatusBannerProps {
//   sellerId: string;
//   onViewPlans: () => void;
//   forceRefresh?: number;
// }

// interface TimeRemaining {
//   days: number;
//   hours: number;
//   minutes: number;
//   seconds: number;
// }

// // ═══════════════════════════════════════════════════════════════
// // 🎯 MAIN COMPONENT
// // ═══════════════════════════════════════════════════════════════

// export const PlanStatusBanner: React.FC<PlanStatusBannerProps> = ({
//   sellerId,
//   onViewPlans,
//   forceRefresh = 0
// }) => {
//   // ─────────────────────────────────────────────────────────────
//   // STATE MANAGEMENT
//   // ─────────────────────────────────────────────────────────────
  
//   const [subscription, setSubscription] = useState<Subscription | null>(null);
//   const [plan, setPlan] = useState<Plan | null>(null);
//   const [hasDisabledWorkers, setHasDisabledWorkers] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [timeRemaining, setTimeRemaining] = useState<TimeRemaining>({
//     days: 0,
//     hours: 0,
//     minutes: 0,
//     seconds: 0
//   });
//   const [isExpired, setIsExpired] = useState(false);
//   const [showExpiryPopup, setShowExpiryPopup] = useState(false);
//   const [lastChecked, setLastChecked] = useState<Date>(new Date());
//   const [notification, setNotification] = useState<{
//     type: 'success' | 'error' | null;
//     message: string;
//   }>({ type: null, message: '' });

//   // ─────────────────────────────────────────────────────────────
//   // EFFECT: LOAD SUBSCRIPTION ON MOUNT & FORCE REFRESH
//   // ─────────────────────────────────────────────────────────────
  
//   useEffect(() => {
//     if (process.env.NODE_ENV === 'development') {
//       console.log('🔄 PlanStatusBanner: Loading subscription... (forceRefresh:', forceRefresh, ')');
//     }
    
//     loadSubscription();
    
//     // Auto-refresh every 30 seconds
//     const interval = setInterval(loadSubscription, 30000);
    
//     return () => {
//       clearInterval(interval);
//     };
//   }, [sellerId, forceRefresh]);

//   // ─────────────────────────────────────────────────────────────
//   // EFFECT: HANDLE PLAN EXPIRY - DISABLE WORKERS
//   // ─────────────────────────────────────────────────────────────
  
//   useEffect(() => {
//     const handlePlanExpiry = async () => {
//       if (isExpired && subscription && !hasDisabledWorkers) {
//         console.log('⚠️ Plan expired - Disabling all workers...');
        
//         try {
//           const result = await disableAllSellersWorkers(sellerId);
          
//           if (result.success && result.count > 0) {
//             console.log(`✅ Disabled ${result.count} worker(s) due to plan expiry`);
//             setHasDisabledWorkers(true);
            
//             // Show notification
//             showNotification(
//               'success',
//               `🔒 ${result.count} worker account(s) disabled due to plan expiry. They will be re-enabled when you renew.`
//             );
//           }
//         } catch (error: any) {
//           console.error('❌ Failed to disable workers:', error);
//           showNotification('error', 'Failed to disable worker accounts. Please contact support.');
//         }
//       }
//     };

//     handlePlanExpiry();
//   }, [isExpired, subscription, sellerId, hasDisabledWorkers]);

//   // ─────────────────────────────────────────────────────────────
//   // EFFECT: UPDATE TIMER EVERY SECOND
//   // ─────────────────────────────────────────────────────────────
  
//   useEffect(() => {
//     if (subscription) {
//       updateTimer();
//       const interval = setInterval(updateTimer, 1000);
//       return () => clearInterval(interval);
//     }
//   }, [subscription]);

//   // ─────────────────────────────────────────────────────────────
//   // EFFECT: SHOW EXPIRY POPUP ONCE
//   // ─────────────────────────────────────────────────────────────
  
//   useEffect(() => {
//     if (isExpired && subscription && !sessionStorage.getItem('expiry_popup_shown')) {
//       setShowExpiryPopup(true);
//       sessionStorage.setItem('expiry_popup_shown', 'true');
//     }
//   }, [isExpired]);

//   // ─────────────────────────────────────────────────────────────
//   // EFFECT: AUTO-HIDE NOTIFICATIONS
//   // ─────────────────────────────────────────────────────────────
  
//   useEffect(() => {
//     if (notification.type) {
//       const timer = setTimeout(() => {
//         setNotification({ type: null, message: '' });
//       }, 5000);
//       return () => clearTimeout(timer);
//     }
//   }, [notification]);

//   // ═══════════════════════════════════════════════════════════════
//   // 🔧 HELPER FUNCTIONS
//   // ═══════════════════════════════════════════════════════════════
  
//   /**
//    * Show notification message
//    */
//   const showNotification = (type: 'success' | 'error', message: string) => {
//     setNotification({ type, message });
//   };

//   /**
//    * Load subscription data from Firebase
//    */
//   const loadSubscription = async () => {
//     try {
//       setLoading(true);
      
//       if (process.env.NODE_ENV === 'development') {
//         console.log('🔍 Fetching subscription for seller:', sellerId);
//       }
      
//       const sub = await getSellerSubscription(sellerId);
      
//       if (sub) {
//         setSubscription(sub);
        
//         const planData = await getPlanById(sub.plan_id);
//         setPlan(planData);
        
//         const expired = isSubscriptionExpired(sub);
//         setIsExpired(expired);
        
//         // Clear popup flag if not expired anymore
//         if (!expired) {
//           sessionStorage.removeItem('expiry_popup_shown');
//           setHasDisabledWorkers(false); // Reset worker disable flag
//         }
        
//         setLastChecked(new Date());
        
//         if (process.env.NODE_ENV === 'development') {
//           console.log('✅ Subscription loaded:', {
//             id: sub.id,
//             plan: planData?.plan_name,
//             expired
//           });
//         }
//       } else {
//         setSubscription(null);
//         setPlan(null);
//         setIsExpired(false);
//       }
//     } catch (error) {
//       console.error('❌ Error loading subscription:', error);
//       showNotification('error', 'Failed to load subscription status');
//     } finally {
//       setLoading(false);
//     }
//   };

//   /**
//    * Update countdown timer
//    */
//   const updateTimer = () => {
//     if (!subscription || !subscription.end_date) return;

//     const endDate = new Date(subscription.end_date);
//     const now = new Date();
//     const diffMs = endDate.getTime() - now.getTime();

//     if (diffMs <= 0) {
//       setTimeRemaining({ days: 0, hours: 0, minutes: 0, seconds: 0 });
//       if (!isExpired) {
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

//   /**
//    * Get formatted timer display
//    */
//   const getTimerDisplay = (): string => {
//     const { days, hours, minutes, seconds } = timeRemaining;

//     if (days > 0) {
//       return `${days}d ${hours}h ${minutes}m ${seconds}s`;
//     } else if (hours > 0) {
//       return `${hours}h ${minutes}m ${seconds}s`;
//     } else if (minutes > 0) {
//       return `${minutes}m ${seconds}s`;
//     } else {
//       return `${seconds}s`;
//     }
//   };

//   /**
//    * Get status color based on time remaining
//    */
//   const getStatusColor = (): string => {
//     if (isExpired) return 'from-red-600 to-red-700';

//     const { days, hours } = timeRemaining;

//     if (hours < 1 && days === 0) return 'from-red-500 to-orange-600';
//     if (hours < 24 && days === 0) return 'from-orange-500 to-yellow-600';
//     if (days < 7) return 'from-yellow-500 to-yellow-600';
//     return 'from-green-600 to-emerald-600';
//   };

//   /**
//    * Check if banner should pulse
//    */
//   const shouldPulse = (): boolean => {
//     const { hours, days } = timeRemaining;
//     return (hours < 1 && days === 0) || isExpired;
//   };

//   /**
//    * Format date for display
//    */
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
//   // 🎨 RENDER: LOADING STATE
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
//   // 🎨 RENDER: NO SUBSCRIPTION STATE
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
//             className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white text-purple-600 px-3 sm:px-4 py-2 rounded-lg hover:bg-purple-50 active:bg-purple-100 transition-colors font-semibold shadow-md text-sm sm:text-base"
//           >
//             <Eye className="w-4 h-4" />
//             View Plans
//           </button>
//         </div>
//       </div>
//     );
//   }

//   // ═══════════════════════════════════════════════════════════════
//   // 🎨 RENDER: MAIN COMPONENT
//   // ═══════════════════════════════════════════════════════════════
  
//   return (
//     <>
//       {/* ──────────────────────────────────────────────────────── */}
//       {/* NOTIFICATION BANNER */}
//       {/* ──────────────────────────────────────────────────────── */}
      
//       {notification.type && (
//         <div
//           className={`mb-4 p-3 sm:p-4 rounded-xl shadow-lg animate-slide-down ${
//             notification.type === 'success'
//               ? 'bg-green-100 border-2 border-green-500 text-green-800'
//               : 'bg-red-100 border-2 border-red-500 text-red-800'
//           }`}
//         >
//           <div className="flex items-start justify-between gap-3">
//             <p className="text-sm sm:text-base flex-1">{notification.message}</p>
//             <button
//               onClick={() => setNotification({ type: null, message: '' })}
//               className="flex-shrink-0 hover:opacity-70 transition-opacity"
//             >
//               <X className="w-4 h-4" />
//             </button>
//           </div>
//         </div>
//       )}

//       {/* ──────────────────────────────────────────────────────── */}
//       {/* STATUS BANNER */}
//       {/* ──────────────────────────────────────────────────────── */}
      
//       <div
//         className={`mb-4 sm:mb-6 p-3 sm:p-4 bg-gradient-to-r ${getStatusColor()} text-white rounded-xl shadow-lg ${
//           shouldPulse() ? 'animate-pulse' : ''
//         }`}
//       >
//         <div className="flex flex-col gap-3">
          
//           {/* Header Row */}
//           <div className="flex items-start justify-between gap-3">
//             <div className="flex items-start gap-2 sm:gap-3 flex-1 min-w-0">
//               {isExpired ? (
//                 <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 mt-0.5 flex-shrink-0" />
//               ) : (
//                 <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 mt-0.5 flex-shrink-0" />
//               )}
//               <div className="flex-1 min-w-0">
//                 <h3 className="font-bold text-base sm:text-lg lg:text-xl truncate">
//                   {isExpired ? '❌ Plan Expired' : `✅ ${plan.plan_name}`}
//                 </h3>
//                 <p className="text-xs sm:text-sm opacity-90 mt-0.5">
//                   {isExpired
//                     ? 'Your subscription has ended'
//                     : `₹${plan.price.toLocaleString()} / ${plan.billing_cycle}`}
//                 </p>
//               </div>
//             </div>

//             <button
//               onClick={loadSubscription}
//               className="flex-shrink-0 p-1.5 sm:p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
//               title="Refresh Status"
//               aria-label="Refresh subscription status"
//             >
//               <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5" />
//             </button>
//           </div>

//           {/* Timer/Action Row */}
//           <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-t border-white border-opacity-20 pt-3">
//             <div className="flex items-center gap-2">
//               <Clock className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
//               <div className="text-xs sm:text-sm">
//                 {isExpired ? (
//                   <>
//                     <span className="opacity-90">Expired on: </span>
//                     <span className="font-bold">{formatDate(subscription.end_date)}</span>
//                   </>
//                 ) : (
//                   <>
//                     <span className="opacity-90">Time Left: </span>
//                     <span className="font-bold font-mono">{getTimerDisplay()}</span>
//                   </>
//                 )}
//               </div>
//             </div>

//             {/* Action Button */}
//             {(isExpired || timeRemaining.days < 7) && (
//               <button
//                 onClick={onViewPlans}
//                 className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 sm:px-4 py-2 rounded-lg transition-colors font-semibold shadow-md text-xs sm:text-sm ${
//                   isExpired
//                     ? 'bg-white text-red-700 hover:bg-red-50 active:bg-red-100'
//                     : 'bg-white bg-opacity-90 hover:bg-opacity-100 text-gray-900'
//                 }`}
//               >
//                 <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
//                 {isExpired ? 'Renew Now' : 'Upgrade Plan'}
//               </button>
//             )}
//           </div>

//           {/* Expiry Date (Active Plan) */}
//           {!isExpired && (
//             <div className="text-xs opacity-75 flex items-center gap-1.5">
//               <span>📅</span>
//               <span>Expires: {formatDate(subscription.end_date)}</span>
//             </div>
//           )}
          
//           {/* Last Checked */}
//           <div className="text-xs opacity-60 flex items-center gap-1.5">
//             <span>🔄</span>
//             <span>Last checked: {lastChecked.toLocaleTimeString('en-IN')}</span>
//           </div>
//         </div>
//       </div>

//       {/* ──────────────────────────────────────────────────────── */}
//       {/* EXPIRY POPUP MODAL */}
//       {/* ──────────────────────────────────────────────────────── */}
      
//       {showExpiryPopup && isExpired && (
//         <div 
//           className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black bg-opacity-70 animate-fade-in"
//           onClick={(e) => {
//             if (e.target === e.currentTarget) {
//               setShowExpiryPopup(false);
//             }
//           }}
//         >
//           <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-scale-in">
            
//             {/* Modal Header */}
//             <div className="bg-gradient-to-r from-red-600 to-orange-600 text-white p-4 sm:p-6">
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
//                   <div className="p-2 sm:p-3 bg-white bg-opacity-20 rounded-full flex-shrink-0">
//                     <AlertTriangle className="w-6 h-6 sm:w-8 sm:h-8" />
//                   </div>
//                   <div className="flex-1 min-w-0">
//                     <h3 className="text-xl sm:text-2xl font-bold">Plan Expired!</h3>
//                     <p className="text-xs sm:text-sm text-red-100 mt-1">Immediate action required</p>
//                   </div>
//                 </div>
//                 <button
//                   onClick={() => setShowExpiryPopup(false)}
//                   className="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-1.5 sm:p-2 transition-colors flex-shrink-0"
//                   aria-label="Close popup"
//                 >
//                   <X className="w-4 h-4 sm:w-5 sm:h-5" />
//                 </button>
//               </div>
//             </div>

//             {/* Modal Content */}
//             <div className="p-4 sm:p-6">
//               <div className="space-y-3 sm:space-y-4">
                
//                 {/* Plan Details */}
//                 <div className="bg-red-50 border-2 border-red-200 rounded-lg p-3 sm:p-4">
//                   <p className="text-red-800 font-bold mb-2 text-base sm:text-lg">
//                     🚫 Your {plan.plan_name} plan has expired
//                   </p>
//                   <div className="text-xs sm:text-sm text-red-700 space-y-1">
//                     <p><strong>Plan:</strong> {plan.plan_name}</p>
//                     <p><strong>Price:</strong> ₹{plan.price.toLocaleString()}</p>
//                     <p><strong>Expired:</strong> {formatDate(subscription.end_date)}</p>
//                   </div>
//                 </div>

//                 {/* Limited Access Notice */}
//                 <div className="space-y-2">
//                   <p className="font-bold text-gray-800 flex items-center gap-2 text-sm sm:text-base">
//                     <span>⚠️</span>
//                     <span>Limited Access Active:</span>
//                   </p>
//                   <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-gray-700">
//                     <li className="flex items-start gap-2">
//                       <span className="text-red-500 mt-0.5 flex-shrink-0">✗</span>
//                       <span>Cannot add new tiles</span>
//                     </li>
//                     <li className="flex items-start gap-2">
//                       <span className="text-red-500 mt-0.5 flex-shrink-0">✗</span>
//                       <span>QR code generation disabled</span>
//                     </li>
//                     <li className="flex items-start gap-2">
//                       <span className="text-red-500 mt-0.5 flex-shrink-0">✗</span>
//                       <span>Analytics unavailable</span>
//                     </li>
//                     <li className="flex items-start gap-2">
//                       <span className="text-red-500 mt-0.5 flex-shrink-0">✗</span>
//                       <span>Customer inquiries blocked</span>
//                     </li>
//                     <li className="flex items-start gap-2">
//                       <span className="text-red-500 mt-0.5 flex-shrink-0">✗</span>
//                       <span>Worker accounts disabled</span>
//                     </li>
//                   </ul>
//                 </div>

//                 {/* Renewal CTA */}
//                 <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-lg p-3 sm:p-4">
//                   <p className="text-blue-800 text-xs sm:text-sm font-medium">
//                     💡 <strong>Renew your plan now</strong> to restore full access and re-enable worker accounts!
//                   </p>
//                 </div>
//               </div>

//               {/* Action Buttons */}
//               <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-4 sm:mt-6">
//                 <button
//                   onClick={() => setShowExpiryPopup(false)}
//                   className="flex-1 px-4 py-2.5 sm:py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 active:bg-gray-100 transition-colors font-semibold text-sm sm:text-base"
//                 >
//                   Dismiss
//                 </button>
//                 <button
//                   onClick={() => {
//                     setShowExpiryPopup(false);
//                     onViewPlans();
//                   }}
//                   className="flex-1 px-4 py-2.5 sm:py-3 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-lg hover:from-red-700 hover:to-orange-700 active:from-red-800 active:to-orange-800 transition-all font-bold shadow-lg text-sm sm:text-base"
//                 >
//                   Renew Plan Now
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// // ═══════════════════════════════════════════════════════════════
// // 🎨 REQUIRED CSS ANIMATIONS (Add to your global CSS or Tailwind config)
// // ═══════════════════════════════════════════════════════════════

// /*
// @keyframes fade-in {
//   from {
//     opacity: 0;
//   }
//   to {
//     opacity: 1;
//   }
// }

// @keyframes scale-in {
//   from {
//     opacity: 0;
//     transform: scale(0.9);
//   }
//   to {
//     opacity: 1;
//     transform: scale(1);
//   }
// }

// @keyframes slide-down {
//   from {
//     opacity: 0;
//     transform: translateY(-10px);
//   }
//   to {
//     opacity: 1;
//     transform: translateY(0);
//   }
// }

// .animate-fade-in {
//   animation: fade-in 0.3s ease-out;
// }

// .animate-scale-in {
//   animation: scale-in 0.3s ease-out;
// }

// .animate-slide-down {
//   animation: slide-down 0.3s ease-out;
// }
// */

// console.log('✅ PlanStatusBanner Component loaded - PRODUCTION v5.0'); 
// ═══════════════════════════════════════════════════════════════
// 🎨 PLAN STATUS BANNER - PRODUCTION v7.0 (INTERFERENCE FIXED)
// ═══════════════════════════════════════════════════════════════

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Clock, AlertTriangle, CheckCircle, RefreshCw, Eye, X } from 'lucide-react';
import { getSellerSubscription, isSubscriptionExpired } from '../lib/subscriptionService';
import { getPlanById } from '../lib/planService';
import { disableAllSellersWorkers } from '../lib/firebaseutils';
import type { Subscription } from '../types/payment.types';
import type { Plan } from '../types/plan.types';

interface PlanStatusBannerProps {
  sellerId: string;
  onViewPlans: () => void;
  forceRefresh?: number;
}

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export const PlanStatusBanner: React.FC<PlanStatusBannerProps> = ({
  sellerId,
  onViewPlans,
  forceRefresh = 0
}) => {
  // ═══════════════════════════════════════════════════════════════
  // STATE
  // ═══════════════════════════════════════════════════════════════
  
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [plan, setPlan] = useState<Plan | null>(null);
  const [hasDisabledWorkers, setHasDisabledWorkers] = useState(false);
  const [loading, setLoading] = useState(true);
  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining>({
    days: 0, hours: 0, minutes: 0, seconds: 0
  });
  const [isExpired, setIsExpired] = useState(false);
  const [showExpiryPopup, setShowExpiryPopup] = useState(false);
  const [lastChecked, setLastChecked] = useState<Date>(new Date());
  const [notification, setNotification] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  // ✅ NEW: Payment processing detection
  const [isPaymentProcessing, setIsPaymentProcessing] = useState(false);
  
  // ✅ Refs
  const disableTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isLoadingRef = useRef(false);
  const lastSubscriptionIdRef = useRef<string | null>(null);

  // ═══════════════════════════════════════════════════════════════
  // ✅ DETECT PAYMENT PROCESSING VIA LOCALSTORAGE
  // ═══════════════════════════════════════════════════════════════
  
  useEffect(() => {
    const checkPaymentProcessing = () => {
      const flag = localStorage.getItem('payment_processing');
      const isProcessing = flag === 'true';
      
      if (isProcessing !== isPaymentProcessing) {
        console.log('🚩 Payment processing flag changed:', isProcessing);
        setIsPaymentProcessing(isProcessing);
      }
    };

    checkPaymentProcessing();
    const interval = setInterval(checkPaymentProcessing, 500);

    return () => clearInterval(interval);
  }, [isPaymentProcessing]);

  // ═══════════════════════════════════════════════════════════════
  // ✅ LOAD SUBSCRIPTION (NO AUTO-REFRESH INTERVAL)
  // ═══════════════════════════════════════════════════════════════
  
  useEffect(() => {
    console.log('🔄 PlanStatusBanner: Loading subscription (forceRefresh:', forceRefresh, ')');
    
    // ✅ Force server fetch when forceRefresh changes
    const shouldForceRefresh = forceRefresh > 0;
    loadSubscription(shouldForceRefresh);
    
    // ✅ NO AUTO-REFRESH INTERVAL - Only manual refresh
    
  }, [sellerId, forceRefresh]);

  // ═══════════════════════════════════════════════════════════════
  // ✅ DISABLE WORKERS EFFECT (WITH GUARDS)
  // ═══════════════════════════════════════════════════════════════
  
  useEffect(() => {
    // ✅ GUARD 1: Payment processing
    if (isPaymentProcessing) {
      console.log('⏸️ PAYMENT PROCESSING - Skipping disable check');
      return;
    }

    // ✅ GUARD 2: Already disabled
    if (hasDisabledWorkers) {
      return;
    }

    // ✅ GUARD 3: Not expired or no subscription
    if (!isExpired || !subscription) {
      return;
    }

    // ✅ GUARD 4: Debounce 3 seconds
    console.log('⏰ Plan expired - Scheduling disable in 3 seconds...');
    
    if (disableTimeoutRef.current) {
      clearTimeout(disableTimeoutRef.current);
    }

    disableTimeoutRef.current = setTimeout(async () => {
      // ✅ Re-check all conditions
      if (isPaymentProcessing) {
        console.log('⏸️ Payment started - Aborting disable');
        return;
      }

      if (hasDisabledWorkers) {
        return;
      }

      // ✅ Verify still expired
      try {
        const freshSub = await getSellerSubscription(sellerId, true);
        if (!freshSub || !isSubscriptionExpired(freshSub)) {
          console.log('✅ Subscription now active - Aborting disable');
          return;
        }

        console.log('⚠️ Disabling workers (verified expired)...');
        
        const result = await disableAllSellersWorkers(sellerId);
        
        if (result.success && result.count > 0) {
          console.log(`✅ Disabled ${result.count} worker(s)`);
          setHasDisabledWorkers(true);
          showNotification('success', `🔒 ${result.count} worker(s) disabled.`);
        }
      } catch (error: any) {
        console.error('❌ Disable failed:', error);
      }
    }, 3000); // ✅ 3 second debounce

    return () => {
      if (disableTimeoutRef.current) {
        clearTimeout(disableTimeoutRef.current);
      }
    };
  }, [isExpired, subscription, sellerId, hasDisabledWorkers, isPaymentProcessing]);

  // ═══════════════════════════════════════════════════════════════
  // TIMER EFFECT
  // ═══════════════════════════════════════════════════════════════
  
  useEffect(() => {
    if (subscription) {
      updateTimer();
      const interval = setInterval(updateTimer, 1000);
      return () => clearInterval(interval);
    }
  }, [subscription]);

  // ═══════════════════════════════════════════════════════════════
  // POPUP EFFECT
  // ═══════════════════════════════════════════════════════════════
  
  useEffect(() => {
    if (isExpired && subscription && !sessionStorage.getItem('expiry_popup_shown')) {
      setShowExpiryPopup(true);
      sessionStorage.setItem('expiry_popup_shown', 'true');
    }
  }, [isExpired]);

  // ═══════════════════════════════════════════════════════════════
  // NOTIFICATION AUTO-HIDE
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
  // ✅ LOAD SUBSCRIPTION FUNCTION (WITH FORCE REFRESH)
  // ═══════════════════════════════════════════════════════════════
  
  const loadSubscription = useCallback(async (forceServerFetch: boolean = false) => {
    if (isLoadingRef.current) {
      console.log('⏭️ Already loading');
      return;
    }

    try {
      isLoadingRef.current = true;
      setLoading(true);
      
      console.log('🔍 Fetching subscription (force:', forceServerFetch, ')');
      
      // ✅ Pass forceRefresh to service
      const sub = await getSellerSubscription(sellerId, forceServerFetch);
      
      if (sub) {
        // ✅ Track subscription changes
        const changed = lastSubscriptionIdRef.current !== sub.id;
        
        if (changed) {
          console.log('🔄 Subscription changed:', {
            old: lastSubscriptionIdRef.current,
            new: sub.id
          });
          lastSubscriptionIdRef.current = sub.id;
          setHasDisabledWorkers(false);
          sessionStorage.removeItem('expiry_popup_shown');
        }

        setSubscription(sub);
        
        const planData = await getPlanById(sub.plan_id);
        setPlan(planData);
        
        const expired = isSubscriptionExpired(sub);
        setIsExpired(expired);
        
        if (!expired) {
          sessionStorage.removeItem('expiry_popup_shown');
          setHasDisabledWorkers(false);
        }
        
        setLastChecked(new Date());
        
        console.log('✅ Subscription loaded:', {
          id: sub.id,
          plan: planData?.plan_name,
          expired
        });
      } else {
        setSubscription(null);
        setPlan(null);
        setIsExpired(false);
        lastSubscriptionIdRef.current = null;
      }
    } catch (error) {
      console.error('❌ Load error:', error);
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
      if (!isExpired) setIsExpired(true);
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
  // RENDER LOADING
  // ═══════════════════════════════════════════════════════════════
  
  if (loading) {
    return (
      <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded-xl animate-pulse">
        <div className="h-6 sm:h-8 bg-gray-400 rounded w-1/2 mb-2"></div>
        <div className="h-3 sm:h-4 bg-gray-400 rounded w-1/3"></div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════
  // RENDER NO SUBSCRIPTION
  // ═══════════════════════════════════════════════════════════════
  
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

  // ═══════════════════════════════════════════════════════════════
  // RENDER MAIN BANNER
  // ═══════════════════════════════════════════════════════════════
  
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
              {isExpired ? (
                <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 mt-0.5" />
              ) : (
                <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 mt-0.5" />
              )}
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-base sm:text-lg truncate">
                  {isExpired ? '❌ Plan Expired' : `✅ ${plan.plan_name}`}
                </h3>
                <p className="text-xs sm:text-sm opacity-90 mt-0.5">
                  {isExpired ? 'Subscription ended' : `₹${plan.price.toLocaleString()}`}
                </p>
              </div>
            </div>
            <button onClick={() => loadSubscription(true)} className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg">
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-2 border-t border-white border-opacity-20 pt-3">
            <Clock className="w-4 h-4" />
            <div className="text-xs sm:text-sm">
              {isExpired ? (
                <>Expired: {formatDate(subscription.end_date)}</>
              ) : (
                <>Time Left: <span className="font-mono font-bold">{getTimerDisplay()}</span></>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

console.log('✅ PlanStatusBanner loaded - PRODUCTION v7.0');