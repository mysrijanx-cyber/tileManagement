
// // // import React, { useState, useEffect, useRef, useCallback } from 'react';
// // // import { Clock, AlertTriangle, CheckCircle, RefreshCw, Eye, X, TrendingUp, QrCode } from 'lucide-react';
// // // import { db } from '../lib/firebase';
// // // import { doc, onSnapshot } from 'firebase/firestore';
// // // import { getSellerSubscription, isSubscriptionExpired } from '../lib/subscriptionService';
// // // import { getPlanById } from '../lib/planService';
// // // import { disableAllSellersWorkers } from '../lib/firebaseutils';
// // // import { getRemainingScanCount } from '../lib/subscriptionService';
// // // import type { Subscription } from '../types/payment.types';
// // // import type { Plan } from '../types/plan.types';

// // // // ═══════════════════════════════════════════════════════════════
// // // // INTERFACE
// // // // ═══════════════════════════════════════════════════════════════

// // // interface PlanStatusBannerProps {
// // //   sellerId: string;
// // //   onViewPlans: () => void;
// // //   forceRefresh?: number;
// // //   onPlanStatusChange?: (isActive: boolean, isExpired: boolean) => void;
// // // }

// // // interface TimeRemaining {
// // //   days: number;
// // //   hours: number;
// // //   minutes: number;
// // //   seconds: number;
// // //   totalDays: number; // For precise days calculation
// // // }

// // // interface ScanStats {
// // //   remaining: number;
// // //   total: number;
// // //   used: number;
// // //   unlimited: boolean;
// // //   limitReached: boolean;
// // // }

// // // // ═══════════════════════════════════════════════════════════════
// // // // COMPONENT
// // // // ═══════════════════════════════════════════════════════════════

// // // export const PlanStatusBanner: React.FC<PlanStatusBannerProps> = ({
// // //   sellerId,
// // //   onViewPlans,
// // //   forceRefresh = 0,
// // //   onPlanStatusChange
// // // }) => {
// // //   // ═══════════════════════════════════════════════════════════════
// // //   // STATE
// // //   // ═══════════════════════════════════════════════════════════════
  
// // //   const [subscription, setSubscription] = useState<Subscription | null>(null);
// // //   const [plan, setPlan] = useState<Plan | null>(null);
// // //   const [hasDisabledWorkers, setHasDisabledWorkers] = useState(false);
// // //   const [loading, setLoading] = useState(true);
// // //   const [timeRemaining, setTimeRemaining] = useState<TimeRemaining>({
// // //     days: 0,
// // //     hours: 0,
// // //     minutes: 0,
// // //     seconds: 0,
// // //     totalDays: 0
// // //   });
// // //   const [isExpired, setIsExpired] = useState(false);
// // //   const [showExpiryPopup, setShowExpiryPopup] = useState(false);
// // //   const [lastChecked, setLastChecked] = useState<Date>(new Date());
// // //   const [notification, setNotification] = useState<{
// // //     type: 'success' | 'error' | null;
// // //     message: string;
// // //   }>({ type: null, message: '' });
// // //   const [isPaymentProcessing, setIsPaymentProcessing] = useState(false);
// // //   const [scanStats, setScanStats] = useState<ScanStats | null>(null);
  
// // //   const disableTimeoutRef = useRef<NodeJS.Timeout | null>(null);
// // //   const isLoadingRef = useRef(false);
// // //   const lastSubscriptionIdRef = useRef<string | null>(null);
// // //   const lastExpiredStateRef = useRef<boolean>(false);
// // //   const unsubscribeFirestoreRef = useRef<(() => void) | null>(null);

// // //   // ═══════════════════════════════════════════════════════════════
// // //   // 1. REAL-TIME FIRESTORE LISTENER
// // //   // ═══════════════════════════════════════════════════════════════
  
// // //   useEffect(() => {
// // //     if (!sellerId) return;

// // //     console.log('🔥 [REAL-TIME] Setting up Firestore listener for seller:', sellerId);

// // //     const setupListener = async () => {
// // //       try {
// // //         setLoading(true);
        
// // //         console.log('🔍 [REAL-TIME] Initial fetch...');
// // //         const sub = await getSellerSubscription(sellerId, true);
        
// // //         if (!sub || !sub.id) {
// // //           console.log('ℹ️ [REAL-TIME] No subscription found');
// // //           setSubscription(null);
// // //           setPlan(null);
// // //           setIsExpired(false);
// // //           setScanStats(null);
// // //           setLoading(false);
// // //           return;
// // //         }

// // //         console.log('✅ [REAL-TIME] Initial subscription loaded:', sub.id);
// // //         console.log('📊 [REAL-TIME] Loading initial scan stats...');
// // //         await loadScanStats(sellerId);

// // //         const planData = await getPlanById(sub.plan_id);
// // //         setPlan(planData);

// // //         setSubscription(sub);
// // //         const expired = isSubscriptionExpired(sub);
// // //         setIsExpired(expired);
// // //         setLastChecked(new Date());
        
// // //         if (!expired) {
// // //           sessionStorage.removeItem('expiry_popup_shown');
// // //           setHasDisabledWorkers(false);
// // //         }

// // //         console.log('✅ [REAL-TIME] Initial state set:', {
// // //           id: sub.id,
// // //           plan: planData?.plan_name,
// // //           expired,
// // //           count: sub.current_scan_count
// // //         });

// // //         if (onPlanStatusChange) {
// // //           const isActive = !expired && sub.status !== 'completed';
// // //           onPlanStatusChange(isActive, expired);
// // //           console.log('📢 [REAL-TIME] Initial parent notification:', { isActive, expired });
// // //         }

// // //         setLoading(false);

// // //         console.log('📍 [REAL-TIME] Setting up listener on:', `subscriptions/${sub.id}`);

// // //         const unsubscribe = onSnapshot(
// // //           doc(db, 'subscriptions', sub.id),
// // //           async (snapshot) => {
// // //             console.log('🔔 [REAL-TIME] Firestore update detected!');
            
// // //             if (!snapshot.exists()) {
// // //               console.log('⚠️ [REAL-TIME] Subscription deleted');
// // //               setSubscription(null);
// // //               setPlan(null);
// // //               setIsExpired(false);
// // //               setScanStats(null);
// // //               return;
// // //             }

// // //             const data = snapshot.data() as Subscription;
// // //             console.log('📊 [REAL-TIME] Updated data:', {
// // //               id: data.id,
// // //               status: data.status,
// // //               count: data.current_scan_count,
// // //               limit: data.scan_limit
// // //             });

// // //             setSubscription(data);
// // //             setLastChecked(new Date());

// // //             if (data.plan_id !== plan?.id) {
// // //               const planData = await getPlanById(data.plan_id);
// // //               setPlan(planData);
// // //             }

// // //             const timeExpired = isSubscriptionExpired(data);
// // //             const statusCompleted = data.status === 'completed';
// // //             const expired = timeExpired || statusCompleted;
            
// // //             setIsExpired(expired);

// // //             console.log('🔍 [REAL-TIME] Expiry check:', {
// // //               timeExpired,
// // //               statusCompleted,
// // //               finalExpired: expired,
// // //               reason: expired ? (timeExpired ? 'TIME_EXPIRED' : 'SCAN_LIMIT_REACHED') : 'ACTIVE'
// // //             });

// // //             console.log('📊 [REAL-TIME] Reloading scan stats...');
// // //             await loadScanStats(sellerId);

// // //             console.log('✅ [REAL-TIME] State updated:', {
// // //               expired,
// // //               status: data.status
// // //             });

// // //             if (onPlanStatusChange) {
// // //               const isActive = !expired && data.status !== 'completed';
// // //               onPlanStatusChange(isActive, expired);
// // //               console.log('📢 [REAL-TIME] Parent notified:', { 
// // //                 isActive, 
// // //                 expired,
// // //                 reason: !isActive ? (expired ? 'EXPIRED' : 'STATUS_NOT_ACTIVE') : 'ACTIVE'
// // //               });
// // //             }
// // //           },
// // //           (error) => {
// // //             console.error('❌ [REAL-TIME] Listener error:', error);
// // //           }
// // //         );

// // //         unsubscribeFirestoreRef.current = unsubscribe;
// // //         console.log('✅ [REAL-TIME] Listener active');

// // //       } catch (error) {
// // //         console.error('❌ [REAL-TIME] Setup failed:', error);
// // //         setLoading(false);
// // //       }
// // //     };

// // //     setupListener();

// // //     return () => {
// // //       if (unsubscribeFirestoreRef.current) {
// // //         console.log('🧹 [REAL-TIME] Cleaning up listener');
// // //         unsubscribeFirestoreRef.current();
// // //         unsubscribeFirestoreRef.current = null;
// // //       }
// // //     };
// // //   }, [sellerId]);

// // //   // ═══════════════════════════════════════════════════════════════
// // //   // 2. CROSS-TAB COMMUNICATION
// // //   // ═══════════════════════════════════════════════════════════════
  
// // //   useEffect(() => {
// // //     console.log('📡 [CROSS-TAB] Setting up localStorage listener');

// // //     const handleStorageEvent = (e: StorageEvent) => {
// // //       if (e.key === 'scan_completed' || e.key === 'scan_limit_reached') {
// // //         console.log('🔔 [CROSS-TAB] Scan event from another tab:', e.key);
// // //         console.log('📊 [CROSS-TAB] Event data:', e.newValue);

// // //         setTimeout(() => {
// // //           console.log('🔄 [CROSS-TAB] Triggering manual refresh...');
// // //           loadSubscription(true);
// // //         }, 500);
// // //       }
// // //     };

// // //     window.addEventListener('storage', handleStorageEvent);

// // //     return () => {
// // //       console.log('🧹 [CROSS-TAB] Cleaning up listener');
// // //       window.removeEventListener('storage', handleStorageEvent);
// // //     };
// // //   }, [sellerId]);

// // //   // ═══════════════════════════════════════════════════════════════
// // //   // 3. WINDOW FOCUS DETECTION
// // //   // ═══════════════════════════════════════════════════════════════
  
// // //   useEffect(() => {
// // //     console.log('👁️ [FOCUS] Setting up focus listener');

// // //     const handleFocus = () => {
// // //       console.log('👁️ [FOCUS] Window focused - Checking updates...');
      
// // //       const lastScanEvent = localStorage.getItem('last_scan_timestamp');
// // //       const bannerLastChecked = lastChecked.toISOString();
      
// // //       if (lastScanEvent && new Date(lastScanEvent) > new Date(bannerLastChecked)) {
// // //         console.log('🔄 [FOCUS] New scan detected - Refreshing...');
// // //         loadSubscription(true);
// // //       } else {
// // //         console.log('✅ [FOCUS] No new scans');
// // //       }

// // //       setLastChecked(new Date());
// // //     };

// // //     window.addEventListener('focus', handleFocus);

// // //     return () => {
// // //       console.log('🧹 [FOCUS] Cleaning up listener');
// // //       window.removeEventListener('focus', handleFocus);
// // //     };
// // //   }, [sellerId, lastChecked]);

// // //   // ═══════════════════════════════════════════════════════════════
// // //   // 4. PAYMENT PROCESSING
// // //   // ═══════════════════════════════════════════════════════════════
  
// // //   useEffect(() => {
// // //     const checkPaymentProcessing = () => {
// // //       const flag = localStorage.getItem('payment_processing');
// // //       const isProcessing = flag === 'true';
      
// // //       if (isProcessing !== isPaymentProcessing) {
// // //         console.log('💳 [PAYMENT] Flag changed:', isProcessing);
// // //         setIsPaymentProcessing(isProcessing);
// // //       }
// // //     };

// // //     checkPaymentProcessing();
// // //     const interval = setInterval(checkPaymentProcessing, 500);

// // //     return () => clearInterval(interval);
// // //   }, [isPaymentProcessing]);

// // //   // ═══════════════════════════════════════════════════════════════
// // //   // 5. FORCE REFRESH PROP
// // //   // ═══════════════════════════════════════════════════════════════
  
// // //   useEffect(() => {
// // //     if (forceRefresh > 0) {
// // //       console.log('🔄 [FORCE] Force refresh triggered:', forceRefresh);
// // //       loadSubscription(true);
// // //     }
// // //   }, [forceRefresh]);

// // //   // ═══════════════════════════════════════════════════════════════
// // //   // 6. NOTIFY PARENT
// // //   // ═══════════════════════════════════════════════════════════════
  
// // //   useEffect(() => {
// // //     if (lastExpiredStateRef.current !== isExpired) {
// // //       console.log('🔔 [CALLBACK] Expiry changed:', {
// // //         was: lastExpiredStateRef.current,
// // //         now: isExpired
// // //       });
      
// // //       lastExpiredStateRef.current = isExpired;
      
// // //       if (onPlanStatusChange) {
// // //         const isActive = !isExpired && !!subscription && subscription.status !== 'completed';
// // //         onPlanStatusChange(isActive, isExpired);
// // //         console.log('📢 [CALLBACK] Parent notified:', { isActive, isExpired });
// // //       }
// // //     }
// // //   }, [isExpired, subscription, onPlanStatusChange]);

// // //   // ═══════════════════════════════════════════════════════════════
// // //   // 7. DISABLE WORKERS
// // //   // ═══════════════════════════════════════════════════════════════
  
// // //   useEffect(() => {
// // //     if (isPaymentProcessing) {
// // //       console.log('⏸️ [WORKER] Payment processing - Skip');
// // //       return;
// // //     }

// // //     if (hasDisabledWorkers || !isExpired || !subscription) {
// // //       return;
// // //     }

// // //     console.log('⏰ [WORKER] Plan expired - Scheduling disable (3s)...');
    
// // //     if (disableTimeoutRef.current) {
// // //       clearTimeout(disableTimeoutRef.current);
// // //     }

// // //     disableTimeoutRef.current = setTimeout(async () => {
// // //       if (isPaymentProcessing || hasDisabledWorkers) {
// // //         console.log('⏸️ [WORKER] Aborting');
// // //         return;
// // //       }

// // //       try {
// // //         const freshSub = await getSellerSubscription(sellerId, true);
// // //         if (!freshSub || !isSubscriptionExpired(freshSub)) {
// // //           console.log('✅ [WORKER] Now active - Abort');
// // //           return;
// // //         }

// // //         console.log('⚠️ [WORKER] Disabling...');
// // //         const result = await disableAllSellersWorkers(sellerId);
        
// // //         if (result.success && result.count > 0) {
// // //           console.log(`✅ [WORKER] Disabled ${result.count}`);
// // //           setHasDisabledWorkers(true);
// // //           showNotification('success', `🔒 ${result.count} worker(s) disabled.`);
// // //         }
// // //       } catch (error: any) {
// // //         console.error('❌ [WORKER] Error:', error);
// // //       }
// // //     }, 3000);

// // //     return () => {
// // //       if (disableTimeoutRef.current) {
// // //         clearTimeout(disableTimeoutRef.current);
// // //       }
// // //     };
// // //   }, [isExpired, subscription, sellerId, hasDisabledWorkers, isPaymentProcessing]);

// // //   // ═══════════════════════════════════════════════════════════════
// // //   // 8. TIMER UPDATE - Updates every hour for performance
// // //   // ═══════════════════════════════════════════════════════════════
  
// // //   useEffect(() => {
// // //     if (subscription && subscription.end_date) {
// // //       updateTimer();
// // //       // Update every hour since we only show days
// // //       const interval = setInterval(updateTimer, 3600000); // 1 hour
// // //       return () => clearInterval(interval);
// // //     }
// // //   }, [subscription]);

// // //   // ═══════════════════════════════════════════════════════════════
// // //   // 9. EXPIRY POPUP
// // //   // ═══════════════════════════════════════════════════════════════
  
// // //   useEffect(() => {
// // //     if (isExpired && subscription && !sessionStorage.getItem('expiry_popup_shown')) {
// // //       setShowExpiryPopup(true);
// // //       sessionStorage.setItem('expiry_popup_shown', 'true');
// // //     }
// // //   }, [isExpired, subscription]);

// // //   // ═══════════════════════════════════════════════════════════════
// // //   // 10. NOTIFICATION AUTO-HIDE
// // //   // ═══════════════════════════════════════════════════════════════
  
// // //   useEffect(() => {
// // //     if (notification.type) {
// // //       const timer = setTimeout(() => {
// // //         setNotification({ type: null, message: '' });
// // //       }, 5000);
// // //       return () => clearTimeout(timer);
// // //     }
// // //   }, [notification]);

// // //   // ═══════════════════════════════════════════════════════════════
// // //   // HELPER FUNCTIONS
// // //   // ═══════════════════════════════════════════════════════════════

// // //   const loadScanStats = async (sellerId: string) => {
// // //     try {
// // //       console.log('📊 [STATS] Loading...');
// // //       const stats = await getRemainingScanCount(sellerId);
// // //       console.log('📊 [STATS] Loaded:', stats);
// // //       setScanStats(stats);
// // //     } catch (error) {
// // //       console.error('❌ [STATS] Error:', error);
// // //       setScanStats(null);
// // //     }
// // //   };

// // //   const loadSubscription = useCallback(async (forceServerFetch: boolean = false) => {
// // //     if (isLoadingRef.current) {
// // //       console.log('⏭️ [LOAD] Already loading');
// // //       return;
// // //     }

// // //     try {
// // //       isLoadingRef.current = true;
// // //       setLoading(true);
      
// // //       console.log('🔍 [LOAD] Fetching (force:', forceServerFetch, ')');
// // //       const sub = await getSellerSubscription(sellerId, forceServerFetch);
      
// // //       if (sub) {
// // //         const changed = lastSubscriptionIdRef.current !== sub.id;
        
// // //         if (changed) {
// // //           console.log('🔄 [LOAD] Subscription changed:', {
// // //             old: lastSubscriptionIdRef.current,
// // //             new: sub.id
// // //           });
// // //           lastSubscriptionIdRef.current = sub.id;
// // //           setHasDisabledWorkers(false);
// // //           sessionStorage.removeItem('expiry_popup_shown');
// // //         }

// // //         setSubscription(sub);
// // //         await loadScanStats(sellerId);
        
// // //         const planData = await getPlanById(sub.plan_id);
// // //         setPlan(planData);
        
// // //         const timeExpired = isSubscriptionExpired(sub);
// // //         const statusCompleted = sub.status === 'completed';
// // //         const expired = timeExpired || statusCompleted;
        
// // //         setIsExpired(expired);
        
// // //         if (!expired) {
// // //           sessionStorage.removeItem('expiry_popup_shown');
// // //           setHasDisabledWorkers(false);
// // //         }
        
// // //         setLastChecked(new Date());
        
// // //         console.log('✅ [LOAD] Loaded:', {
// // //           id: sub.id,
// // //           plan: planData?.plan_name,
// // //           expired,
// // //           timeExpired,
// // //           statusCompleted,
// // //           reason: expired ? (timeExpired ? 'TIME' : 'SCAN_LIMIT') : 'ACTIVE',
// // //           count: sub.current_scan_count
// // //         });
// // //       } else {
// // //         console.log('ℹ️ [LOAD] No subscription');
// // //         setSubscription(null);
// // //         setPlan(null);
// // //         setIsExpired(false);
// // //         setScanStats(null);
// // //         lastSubscriptionIdRef.current = null;
// // //       }
// // //     } catch (error) {
// // //       console.error('❌ [LOAD] Error:', error);
// // //       showNotification('error', 'Failed to load subscription');
// // //     } finally {
// // //       setLoading(false);
// // //       isLoadingRef.current = false;
// // //     }
// // //   }, [sellerId]);

// // //   const showNotification = (type: 'success' | 'error', message: string) => {
// // //     setNotification({ type, message });
// // //   };

// // //   const updateTimer = () => {
// // //     if (!subscription || !subscription.end_date) return;

// // //     const endDate = new Date(subscription.end_date);
// // //     const now = new Date();
// // //     const diffMs = endDate.getTime() - now.getTime();

// // //     if (diffMs <= 0) {
// // //       setTimeRemaining({ 
// // //         days: 0, 
// // //         hours: 0, 
// // //         minutes: 0, 
// // //         seconds: 0,
// // //         totalDays: 0 
// // //       });
// // //       if (!isExpired) {
// // //         console.log('⏰ [TIMER] Reached 0 - Expired');
// // //         setIsExpired(true);
// // //       }
// // //       return;
// // //     }

// // //     // Calculate precise total days (including decimal)
// // //     const totalDays = diffMs / (1000 * 60 * 60 * 24);
// // //     const days = Math.floor(totalDays);
// // //     const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
// // //     const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
// // //     const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);

// // //     setTimeRemaining({ days, hours, minutes, seconds, totalDays });
// // //   };

// // //   // ✅ NEW: Simple days-only display
// // //   const getTimerDisplay = (): string => {
// // //     const { totalDays } = timeRemaining;
    
// // //     if (totalDays <= 0) {
// // //       return '0 days left';
// // //     }
    
// // //     // Round to nearest day for cleaner display
// // //     const daysToShow = Math.ceil(totalDays);
    
// // //     if (daysToShow === 1) {
// // //       return '1 day left';
// // //     }
    
// // //     return `${daysToShow} days left`;
// // //   };

// // //   // ✅ UPDATED: Color coding based on days
// // //   const getStatusColor = (): string => {
// // //     if (isExpired) return 'from-red-600 to-red-700';
    
// // //     const { totalDays } = timeRemaining;
    
// // //     if (totalDays < 1) return 'from-red-500 to-orange-600';      // Less than 1 day
// // //     if (totalDays < 3) return 'from-orange-500 to-yellow-600';   // Less than 3 days
// // //     if (totalDays < 7) return 'from-yellow-500 to-yellow-600';   // Less than 7 days
// // //     if (totalDays < 30) return 'from-blue-500 to-blue-600';      // Less than 30 days
    
// // //     return 'from-green-600 to-emerald-600';                       // 30+ days
// // //   };

// // //   // ✅ UPDATED: Pulse animation for critical time
// // //   const shouldPulse = (): boolean => {
// // //     const { totalDays } = timeRemaining;
// // //     return totalDays < 3 || isExpired; // Pulse if less than 3 days or expired
// // //   };

// // //   const formatDate = (date: Date | string): string => {
// // //     return new Date(date).toLocaleString('en-IN', {
// // //       day: 'numeric',
// // //       month: 'short',
// // //       year: 'numeric',
// // //       hour: '2-digit',
// // //       minute: '2-digit'
// // //     });
// // //   };

// // //   // ═══════════════════════════════════════════════════════════════
// // //   // RENDER - LOADING STATE
// // //   // ═══════════════════════════════════════════════════════════════
  
// // //   if (loading) {
// // //     return (
// // //       <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded-xl animate-pulse">
// // //         <div className="h-6 sm:h-8 bg-gray-400 rounded w-1/2 mb-2"></div>
// // //         <div className="h-3 sm:h-4 bg-gray-400 rounded w-1/3"></div>
// // //       </div>
// // //     );
// // //   }

// // //   // ═══════════════════════════════════════════════════════════════
// // //   // RENDER - NO SUBSCRIPTION
// // //   // ═══════════════════════════════════════════════════════════════
  
// // //   if (!subscription || !plan) {
// // //     return (
// // //       <div className="mb-4 sm:mb-6 p-4 sm:p-5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
// // //         <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
// // //           <div className="flex items-start gap-3 sm:gap-4 flex-1 min-w-0">
// // //             <div className="flex-shrink-0 p-2 bg-white bg-opacity-20 rounded-lg backdrop-blur-sm">
// // //               <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6" />
// // //             </div>
// // //             <div className="flex-1 min-w-0">
// // //               <h3 className="font-bold text-lg sm:text-xl mb-1">No Active Plan</h3>
// // //               <p className="text-sm sm:text-base text-purple-100 leading-relaxed">
// // //                 Subscribe to a plan to unlock all features and start growing your business!
// // //               </p>
// // //             </div>
// // //           </div>
          
// // //           <button
// // //             onClick={onViewPlans}
// // //             className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white text-purple-700 px-5 sm:px-6 py-3 sm:py-3.5 rounded-lg font-bold shadow-lg hover:shadow-xl hover:bg-purple-50 active:bg-white active:scale-95 transition-all transform hover:-translate-y-0.5 active:translate-y-0 text-sm sm:text-base border-2 border-white group"
// // //           >
// // //             <Eye className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform" />
// // //             <span>View Plans</span>
// // //           </button>
// // //         </div>
// // //       </div>
// // //     );
// // //   }

// // //   // ═══════════════════════════════════════════════════════════════
// // //   // RENDER - EXPIRED SUBSCRIPTION
// // //   // ═══════════════════════════════════════════════════════════════
  
// // //   if (isExpired) {
// // //     return (
// // //       <>
// // //         {notification.type && (
// // //           <div 
// // //             className={`mb-4 p-3 sm:p-4 rounded-xl shadow-lg transform transition-all duration-300 ${
// // //               notification.type === 'success' 
// // //                 ? 'bg-green-100 text-green-800 border-2 border-green-300' 
// // //                 : 'bg-red-100 text-red-800 border-2 border-red-300'
// // //             }`}
// // //           >
// // //             <div className="flex items-start justify-between gap-3">
// // //               <p className="text-sm sm:text-base flex-1 font-medium">{notification.message}</p>
// // //               <button 
// // //                 onClick={() => setNotification({ type: null, message: '' })}
// // //                 className="flex-shrink-0 hover:bg-black hover:bg-opacity-10 rounded-lg p-1 transition-colors"
// // //               >
// // //                 <X className="w-4 h-4" />
// // //               </button>
// // //             </div>
// // //           </div>
// // //         )}

// // //         <div className="mb-4 sm:mb-6 p-4 sm:p-5 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl shadow-lg animate-pulse">
// // //           <div className="flex flex-col gap-4">
// // //             <div className="flex items-start justify-between gap-3">
// // //               <div className="flex items-start gap-3 sm:gap-4 flex-1 min-w-0">
// // //                 <div className="flex-shrink-0 p-2 bg-white bg-opacity-20 rounded-lg backdrop-blur-sm">
// // //                   <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6" />
// // //                 </div>
// // //                 <div className="flex-1 min-w-0">
// // //                   <h3 className="font-bold text-lg sm:text-xl mb-1">❌ Plan Expired</h3>
// // //                   <p className="text-sm sm:text-base opacity-90 mb-1">{plan.plan_name}</p>
// // //                   <p className="text-xs sm:text-sm opacity-80">
// // //                     Expired: {formatDate(subscription.end_date)}
// // //                   </p>
// // //                 </div>
// // //               </div>
// // //               <button 
// // //                 onClick={() => loadSubscription(true)} 
// // //                 className="flex-shrink-0 p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-all active:scale-95"
// // //                 title="Refresh subscription status"
// // //               >
// // //                 <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5" />
// // //               </button>
// // //             </div>

// // //             <button
// // //               onClick={onViewPlans}
// // //               className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white text-red-700 px-5 sm:px-6 py-3 sm:py-3.5 rounded-lg font-bold shadow-xl hover:shadow-2xl hover:bg-red-50 active:bg-white active:scale-95 transition-all transform hover:-translate-y-1 active:translate-y-0 text-sm sm:text-base border-2 border-white group"
// // //             >
// // //               <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5 group-hover:rotate-180 transition-transform duration-500" />
// // //               <span>Renew Plan Now</span>
// // //             </button>
// // //           </div>
// // //         </div>
// // //       </>
// // //     );
// // //   }

// // //   // ═══════════════════════════════════════════════════════════════
// // //   // RENDER - ACTIVE SUBSCRIPTION
// // //   // ═══════════════════════════════════════════════════════════════
  
// // //   return (
// // //     <>
// // //       {notification.type && (
// // //         <div 
// // //           className={`mb-4 p-3 sm:p-4 rounded-xl shadow-lg transform transition-all duration-300 ${
// // //             notification.type === 'success' 
// // //               ? 'bg-green-100 text-green-800 border-2 border-green-300' 
// // //               : 'bg-red-100 text-red-800 border-2 border-red-300'
// // //           }`}
// // //         >
// // //           <div className="flex items-start justify-between gap-3">
// // //             <p className="text-sm sm:text-base flex-1 font-medium">{notification.message}</p>
// // //             <button 
// // //               onClick={() => setNotification({ type: null, message: '' })}
// // //               className="flex-shrink-0 hover:bg-black hover:bg-opacity-10 rounded-lg p-1 transition-colors"
// // //             >
// // //               <X className="w-4 h-4" />
// // //             </button>
// // //           </div>
// // //         </div>
// // //       )}

// // //       <div className={`mb-4 sm:mb-6 p-4 sm:p-5 bg-gradient-to-r ${getStatusColor()} text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 ${
// // //         shouldPulse() ? 'animate-pulse' : ''
// // //       }`}>
// // //         <div className="flex flex-col gap-4">
// // //           {/* Header Section */}
// // //           <div className="flex items-start justify-between gap-3">
// // //             <div className="flex items-start gap-3 sm:gap-4 flex-1 min-w-0">
// // //               <div className="flex-shrink-0 p-2 bg-white bg-opacity-20 rounded-lg backdrop-blur-sm">
// // //                 <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6" />
// // //               </div>
// // //               <div className="flex-1 min-w-0">
// // //                 <h3 className="font-bold text-lg sm:text-xl mb-1 truncate">
// // //                   ✅ {plan.plan_name}
// // //                 </h3>
// // //                 <p className="text-sm sm:text-base opacity-90">
// // //                   ₹{plan.price.toLocaleString('en-IN')}
// // //                 </p>
// // //               </div>
// // //             </div>
// // //             <button 
// // //               onClick={() => loadSubscription(true)} 
// // //               className="flex-shrink-0 p-2 hover:bg-white hover:bg-opacity-30 rounded-lg transition-all active:scale-95"
// // //               title="Refresh subscription status"
// // //             >
// // //               <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5" />
// // //             </button>
// // //           </div>

// // //           {/* Scan Count Section - REAL-TIME */}
// // //           {scanStats && !scanStats.unlimited && (
// // //             <div className="flex items-center gap-3 border-t border-white border-opacity-30 pt-4">
// // //               <div className="flex-shrink-0 p-2 bg-white bg-opacity-20 rounded-lg backdrop-blur-sm">
// // //                 <QrCode className="w-4 h-4 sm:w-5 sm:h-5" />
// // //               </div>
// // //               <div className="text-sm sm:text-base flex-1">
// // //                 <div className="flex items-center justify-between mb-1">
// // //                   <span className="font-medium">Scans:</span>
// // //                   <span className="font-mono font-bold text-base sm:text-lg">
// // //                     {scanStats.used} / {scanStats.total}
// // //                   </span>
// // //                 </div>
// // //                 {scanStats.limitReached ? (
// // //                   <div className="text-red-200 text-xs sm:text-sm font-semibold bg-red-900 bg-opacity-40 px-3 py-1.5 rounded-lg inline-block">
// // //                     ⚠️ Limit reached - Subscription expired
// // //                   </div>
// // //                 ) : scanStats.remaining > 0 ? (
// // //                   <div className={`text-xs sm:text-sm ${
// // //                     scanStats.remaining <= 2 ? 'text-yellow-200 font-semibold' : 'text-green-200'
// // //                   }`}>
// // //                     {scanStats.remaining} scan{scanStats.remaining !== 1 ? 's' : ''} remaining
// // //                     {scanStats.remaining <= 2 && ' ⚠️'}
// // //                   </div>
// // //                 ) : (
// // //                   <div className="text-red-200 text-xs sm:text-sm font-semibold bg-red-900 bg-opacity-40 px-3 py-1.5 rounded-lg inline-block">
// // //                     ⚠️ Last scan used
// // //                   </div>
// // //                 )}
// // //               </div>
// // //             </div>
// // //           )}

// // //           {scanStats && scanStats.unlimited && (
// // //             <div className="flex items-center gap-3 border-t border-white border-opacity-30 pt-4">
// // //               <div className="flex-shrink-0 p-2 bg-white bg-opacity-20 rounded-lg backdrop-blur-sm">
// // //                 <QrCode className="w-4 h-4 sm:w-5 sm:h-5" />
// // //               </div>
// // //               <div className="text-sm sm:text-base">
// // //                 Scans: <span className="font-mono font-bold text-base sm:text-lg">Unlimited ∞</span>
// // //                 {scanStats.used > 0 && (
// // //                   <span className="text-green-200 ml-2">({scanStats.used} used)</span>
// // //                 )}
// // //               </div>
// // //             </div>
// // //           )}

// // //           {/* Timer Section - DAYS ONLY */}
// // //           <div className="flex items-center gap-3 border-t border-white border-opacity-30 pt-4">
// // //             <div className="flex-shrink-0 p-2 bg-white bg-opacity-20 rounded-lg backdrop-blur-sm">
// // //               <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
// // //             </div>
// // //             <div className="text-sm sm:text-base">
// // //               <span className="font-medium">Time Remaining: </span>
// // //               <span className="font-bold text-base sm:text-lg ml-1">
// // //                 {getTimerDisplay()}
// // //               </span>
// // //             </div>
// // //           </div>

// // //           {/* Upgrade Button */}
// // //           <button
// // //             onClick={onViewPlans}
// // //             className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white bg-opacity-95 hover:bg-white text-gray-800 px-5 sm:px-6 py-3 sm:py-3.5 rounded-lg font-bold shadow-lg hover:shadow-xl active:shadow-md active:scale-95 transition-all transform hover:-translate-y-0.5 active:translate-y-0 text-sm sm:text-base backdrop-blur-sm border border-white border-opacity-50 group"
// // //           >
// // //             <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform" />
// // //             <span>Upgrade Plan</span>
// // //           </button>
// // //         </div>
// // //       </div>
// // //     </>
// // //   );
// // // };
// // import React, { useState, useEffect, useRef, useCallback } from 'react';
// // import { Clock, AlertTriangle, CheckCircle, RefreshCw, Eye, X, TrendingUp, QrCode } from 'lucide-react';
// // import { db } from '../lib/firebase';
// // import { collection, query, where, orderBy, limit, onSnapshot } from 'firebase/firestore';
// // import { getSellerSubscription, isSubscriptionExpired, getRemainingScanCount } from '../lib/subscriptionService';
// // import { getPlanById } from '../lib/planService';
// // import { disableAllSellersWorkers } from '../lib/firebaseutils';
// // import type { Subscription } from '../types/payment.types';
// // import type { Plan } from '../types/plan.types';

// // // ═══════════════════════════════════════════════════════════════
// // // INTERFACE
// // // ═══════════════════════════════════════════════════════════════

// // interface PlanStatusBannerProps {
// //   sellerId: string;
// //   onViewPlans: () => void;
// //   forceRefresh?: number;
// //   onPlanStatusChange?: (isActive: boolean, isExpired: boolean) => void;
// // }

// // interface TimeRemaining {
// //   days: number;
// //   hours: number;
// //   minutes: number;
// //   seconds: number;
// //   totalDays: number;
// // }

// // interface ScanStats {
// //   remaining: number;
// //   total: number;
// //   used: number;
// //   unlimited: boolean;
// //   limitReached: boolean;
// // }

// // // ═══════════════════════════════════════════════════════════════
// // // COMPONENT
// // // ═══════════════════════════════════════════════════════════════

// // export const PlanStatusBanner: React.FC<PlanStatusBannerProps> = ({
// //   sellerId,
// //   onViewPlans,
// //   forceRefresh = 0,
// //   onPlanStatusChange
// // }) => {
// //   // ═══════════════════════════════════════════════════════════════
// //   // STATE
// //   // ═══════════════════════════════════════════════════════════════
  
// //   const [subscription, setSubscription] = useState<Subscription | null>(null);
// //   const [plan, setPlan] = useState<Plan | null>(null);
// //   const [hasDisabledWorkers, setHasDisabledWorkers] = useState(false);
// //   const [loading, setLoading] = useState(true);
// //   const [timeRemaining, setTimeRemaining] = useState<TimeRemaining>({
// //     days: 0,
// //     hours: 0,
// //     minutes: 0,
// //     seconds: 0,
// //     totalDays: 0
// //   });
// //   const [isExpired, setIsExpired] = useState(false);
// //   const [showExpiryPopup, setShowExpiryPopup] = useState(false);
// //   const [lastChecked, setLastChecked] = useState<Date>(new Date());
// //   const [notification, setNotification] = useState<{
// //     type: 'success' | 'error' | null;
// //     message: string;
// //   }>({ type: null, message: '' });
// //   const [isPaymentProcessing, setIsPaymentProcessing] = useState(false);
// //   const [scanStats, setScanStats] = useState<ScanStats | null>(null);
  
// //   const disableTimeoutRef = useRef<NodeJS.Timeout | null>(null);
// //   const isLoadingRef = useRef(false);
// //   const lastSubscriptionIdRef = useRef<string | null>(null);
// //   const lastExpiredStateRef = useRef<boolean>(false);
// //   const unsubscribeFirestoreRef = useRef<(() => void) | null>(null);
  
// //   // ✅ FIX: Store callback in ref to avoid dependency issues
// //   const onPlanStatusChangeRef = useRef(onPlanStatusChange);
  
// //   useEffect(() => {
// //     onPlanStatusChangeRef.current = onPlanStatusChange;
// //   }, [onPlanStatusChange]);

// //   // ✅ FIX: Debounce listener updates to prevent rapid re-renders
// //   const updateTimeoutRef = useRef<NodeJS.Timeout | null>(null);
// //   const isUpdatingRef = useRef(false);

// //   // ═══════════════════════════════════════════════════════════════
// //   // 1. REAL-TIME FIRESTORE LISTENER (OPTIMIZED)
// //   // ═══════════════════════════════════════════════════════════════
  
// //   useEffect(() => {
// //     if (!sellerId) return;

// //     console.log('🔥 [REAL-TIME] Setting up Firestore listener for seller:', sellerId);

// //     let mounted = true; // ✅ Track component mount status

// //     const setupListener = () => {
// //       try {
// //         setLoading(true);

// //         // ✅ QUERY-BASED LISTENER (NO INITIAL FETCH - listener will fire immediately)
// //         const subscriptionsRef = collection(db, 'subscriptions');
// //         const q = query(
// //           subscriptionsRef,
// //           where('seller_id', '==', sellerId),
// //           where('status', '==', 'active'),
// //           orderBy('created_at', 'desc'),
// //           limit(1)
// //         );

// //         console.log('📍 [REAL-TIME] Setting up query-based listener...');

// //         const unsubscribe = onSnapshot(
// //           q,
// //           async (snapshot) => {
// //             // ✅ FIX: Prevent concurrent updates
// //             if (isUpdatingRef.current) {
// //               console.log('⏭️ [REAL-TIME] Update already in progress, skipping...');
// //               return;
// //             }

// //             if (!mounted) {
// //               console.log('⏭️ [REAL-TIME] Component unmounted, skipping update');
// //               return;
// //             }

// //             isUpdatingRef.current = true;

// //             try {
// //               console.log('🔔 [REAL-TIME] Firestore update detected!');
              
// //               if (snapshot.empty) {
// //                 console.log('⚠️ [REAL-TIME] No active subscription');
                
// //                 if (mounted) {
// //                   setSubscription(null);
// //                   setPlan(null);
// //                   setIsExpired(false);
// //                   setScanStats(null);
// //                   setLoading(false);
// //                   lastSubscriptionIdRef.current = null;
                  
// //                   if (onPlanStatusChangeRef.current) {
// //                     onPlanStatusChangeRef.current(false, false);
// //                   }
// //                 }
                
// //                 isUpdatingRef.current = false;
// //                 return;
// //               }

// //               // ✅ Check if data actually changed
// //               const docSnap = snapshot.docs[0];
// //               const data = { 
// //                 id: docSnap.id, 
// //                 ...docSnap.data() 
// //               } as Subscription;

// //               // ✅ Skip update if subscription ID hasn't changed and it's not the first load
// //               const subscriptionChanged = lastSubscriptionIdRef.current !== data.id;
// //               const isFirstLoad = lastSubscriptionIdRef.current === null;

// //               if (!subscriptionChanged && !isFirstLoad) {
// //                 // ✅ Only update scan stats (lightweight)
// //                 console.log('🔄 [REAL-TIME] Minor update (scan count only)');
                
// //                 if (mounted) {
// //                   setSubscription(data);
                  
// //                   // Debounce scan stats update
// //                   if (updateTimeoutRef.current) {
// //                     clearTimeout(updateTimeoutRef.current);
// //                   }
                  
// //                   updateTimeoutRef.current = setTimeout(async () => {
// //                     if (mounted) {
// //                       await loadScanStats(sellerId);
// //                     }
// //                   }, 500);
// //                 }
                
// //                 isUpdatingRef.current = false;
// //                 return;
// //               }

// //               console.log('📊 [REAL-TIME] Major update detected:', {
// //                 id: data.id,
// //                 status: data.status,
// //                 plan_name: data.plan_name,
// //                 isFirstLoad,
// //                 subscriptionChanged
// //               });

// //               // ✅ Batch all state updates
// //               const planData = await getPlanById(data.plan_id);
// //               const stats = await getRemainingScanCount(sellerId);
// //               const timeExpired = isSubscriptionExpired(data);
// //               const statusCompleted = data.status === 'completed';
// //               const expired = timeExpired || statusCompleted;

// //               if (subscriptionChanged) {
// //                 console.log('🔄 [REAL-TIME] SUBSCRIPTION CHANGED:', {
// //                   old: lastSubscriptionIdRef.current,
// //                   new: data.id,
// //                   oldPlan: plan?.plan_name,
// //                   newPlan: data.plan_name
// //                 });
                
// //                 lastSubscriptionIdRef.current = data.id;
                
// //                 if (mounted) {
// //                   sessionStorage.removeItem('expiry_popup_shown');
// //                   setHasDisabledWorkers(false);
// //                 }
// //               }

// //               // ✅ Single batch update (prevents multiple re-renders)
// //               if (mounted) {
// //                 setSubscription(data);
// //                 setPlan(planData);
// //                 setScanStats(stats);
// //                 setIsExpired(expired);
// //                 setLastChecked(new Date());
// //                 setLoading(false);

// //                 console.log('✅ [REAL-TIME] State updated:', {
// //                   plan: planData?.plan_name,
// //                   expired,
// //                   stats: stats?.remaining
// //                 });

// //                 // Notify parent
// //                 if (onPlanStatusChangeRef.current) {
// //                   const isActive = !expired && data.status !== 'completed';
// //                   onPlanStatusChangeRef.current(isActive, expired);
// //                   console.log('📢 [REAL-TIME] Parent notified:', { isActive, expired });
// //                 }
// //               }

// //             } catch (error) {
// //               console.error('❌ [REAL-TIME] Update error:', error);
// //               if (mounted) {
// //                 setLoading(false);
// //               }
// //             } finally {
// //               isUpdatingRef.current = false;
// //             }
// //           },
// //           (error) => {
// //             console.error('❌ [REAL-TIME] Listener error:', error);
// //             if (mounted) {
// //               setLoading(false);
// //             }
// //             isUpdatingRef.current = false;
// //           }
// //         );

// //         unsubscribeFirestoreRef.current = unsubscribe;
// //         console.log('✅ [REAL-TIME] Listener active (query-based)');

// //       } catch (error) {
// //         console.error('❌ [REAL-TIME] Setup failed:', error);
// //         if (mounted) {
// //           setLoading(false);
// //         }
// //       }
// //     };

// //     setupListener();

// //     return () => {
// //       mounted = false; // ✅ Mark as unmounted
      
// //       if (unsubscribeFirestoreRef.current) {
// //         console.log('🧹 [REAL-TIME] Cleaning up listener');
// //         unsubscribeFirestoreRef.current();
// //         unsubscribeFirestoreRef.current = null;
// //       }
      
// //       if (updateTimeoutRef.current) {
// //         clearTimeout(updateTimeoutRef.current);
// //       }
      
// //       isUpdatingRef.current = false;
// //     };
// //   }, [sellerId]); // ✅ ONLY sellerId dependency

// //   // ═══════════════════════════════════════════════════════════════
// //   // 2. CROSS-TAB COMMUNICATION
// //   // ═══════════════════════════════════════════════════════════════
  
// //   useEffect(() => {
// //     console.log('📡 [CROSS-TAB] Setting up localStorage listener');

// //     const handleStorageEvent = (e: StorageEvent) => {
// //       if (e.key === 'scan_completed' || e.key === 'scan_limit_reached') {
// //         console.log('🔔 [CROSS-TAB] Scan event from another tab:', e.key);
        
// //         // ✅ Debounce refresh
// //         if (updateTimeoutRef.current) {
// //           clearTimeout(updateTimeoutRef.current);
// //         }
        
// //         updateTimeoutRef.current = setTimeout(() => {
// //           console.log('🔄 [CROSS-TAB] Triggering manual refresh...');
// //           loadSubscription(true);
// //         }, 1000);
// //       }
// //     };

// //     window.addEventListener('storage', handleStorageEvent);

// //     return () => {
// //       console.log('🧹 [CROSS-TAB] Cleaning up listener');
// //       window.removeEventListener('storage', handleStorageEvent);
// //     };
// //   }, [sellerId]);

// //   // ═══════════════════════════════════════════════════════════════
// //   // 3. WINDOW FOCUS DETECTION
// //   // ═══════════════════════════════════════════════════════════════
  
// //   useEffect(() => {
// //     console.log('👁️ [FOCUS] Setting up focus listener');

// //     const handleFocus = () => {
// //       console.log('👁️ [FOCUS] Window focused - Checking updates...');
      
// //       const lastScanEvent = localStorage.getItem('last_scan_timestamp');
// //       const bannerLastChecked = lastChecked.toISOString();
      
// //       if (lastScanEvent && new Date(lastScanEvent) > new Date(bannerLastChecked)) {
// //         console.log('🔄 [FOCUS] New scan detected - Refreshing...');
// //         loadSubscription(true);
// //       } else {
// //         console.log('✅ [FOCUS] No new scans');
// //       }

// //       setLastChecked(new Date());
// //     };

// //     window.addEventListener('focus', handleFocus);

// //     return () => {
// //       console.log('🧹 [FOCUS] Cleaning up listener');
// //       window.removeEventListener('focus', handleFocus);
// //     };
// //   }, [sellerId, lastChecked]);

// //   // ═══════════════════════════════════════════════════════════════
// //   // 4. PAYMENT PROCESSING
// //   // ═══════════════════════════════════════════════════════════════
  
// //   useEffect(() => {
// //     const checkPaymentProcessing = () => {
// //       const flag = localStorage.getItem('payment_processing');
// //       const isProcessing = flag === 'true';
      
// //       if (isProcessing !== isPaymentProcessing) {
// //         console.log('💳 [PAYMENT] Flag changed:', isProcessing);
// //         setIsPaymentProcessing(isProcessing);
// //       }
// //     };

// //     checkPaymentProcessing();
// //     const interval = setInterval(checkPaymentProcessing, 500);

// //     return () => clearInterval(interval);
// //   }, [isPaymentProcessing]);

// //   // ═══════════════════════════════════════════════════════════════
// //   // 5. FORCE REFRESH PROP
// //   // ═══════════════════════════════════════════════════════════════
  
// //   useEffect(() => {
// //     if (forceRefresh > 0) {
// //       console.log('🔄 [FORCE] Force refresh triggered:', forceRefresh);
// //       loadSubscription(true);
// //     }
// //   }, [forceRefresh]);

// //   // ═══════════════════════════════════════════════════════════════
// //   // 6. NOTIFY PARENT (OPTIMIZED)
// //   // ═══════════════════════════════════════════════════════════════
  
// //   useEffect(() => {
// //     if (lastExpiredStateRef.current !== isExpired) {
// //       console.log('🔔 [CALLBACK] Expiry changed:', {
// //         was: lastExpiredStateRef.current,
// //         now: isExpired
// //       });
      
// //       lastExpiredStateRef.current = isExpired;
      
// //       if (onPlanStatusChangeRef.current) {
// //         const isActive = !isExpired && !!subscription && subscription.status !== 'completed';
// //         onPlanStatusChangeRef.current(isActive, isExpired);
// //         console.log('📢 [CALLBACK] Parent notified:', { isActive, isExpired });
// //       }
// //     }
// //   }, [isExpired, subscription]);

// //   // ═══════════════════════════════════════════════════════════════
// //   // 7. DISABLE WORKERS
// //   // ═══════════════════════════════════════════════════════════════
  
// //   useEffect(() => {
// //     if (isPaymentProcessing) {
// //       console.log('⏸️ [WORKER] Payment processing - Skip');
// //       return;
// //     }

// //     if (hasDisabledWorkers || !isExpired || !subscription) {
// //       return;
// //     }

// //     console.log('⏰ [WORKER] Plan expired - Scheduling disable (3s)...');
    
// //     if (disableTimeoutRef.current) {
// //       clearTimeout(disableTimeoutRef.current);
// //     }

// //     disableTimeoutRef.current = setTimeout(async () => {
// //       if (isPaymentProcessing || hasDisabledWorkers) {
// //         console.log('⏸️ [WORKER] Aborting');
// //         return;
// //       }

// //       try {
// //         const freshSub = await getSellerSubscription(sellerId, true);
// //         if (!freshSub || !isSubscriptionExpired(freshSub)) {
// //           console.log('✅ [WORKER] Now active - Abort');
// //           return;
// //         }

// //         console.log('⚠️ [WORKER] Disabling...');
// //         const result = await disableAllSellersWorkers(sellerId);
        
// //         if (result.success && result.count > 0) {
// //           console.log(`✅ [WORKER] Disabled ${result.count}`);
// //           setHasDisabledWorkers(true);
// //           showNotification('success', `🔒 ${result.count} worker(s) disabled.`);
// //         }
// //       } catch (error: any) {
// //         console.error('❌ [WORKER] Error:', error);
// //       }
// //     }, 3000);

// //     return () => {
// //       if (disableTimeoutRef.current) {
// //         clearTimeout(disableTimeoutRef.current);
// //       }
// //     };
// //   }, [isExpired, subscription, sellerId, hasDisabledWorkers, isPaymentProcessing]);

// //   // ═══════════════════════════════════════════════════════════════
// //   // 8. TIMER UPDATE
// //   // ═══════════════════════════════════════════════════════════════
  
// //   useEffect(() => {
// //     if (subscription && subscription.end_date) {
// //       updateTimer();
// //       const interval = setInterval(updateTimer, 3600000); // 1 hour
// //       return () => clearInterval(interval);
// //     }
// //   }, [subscription]);

// //   // ═══════════════════════════════════════════════════════════════
// //   // 9. EXPIRY POPUP
// //   // ═══════════════════════════════════════════════════════════════
  
// //   useEffect(() => {
// //     if (isExpired && subscription && !sessionStorage.getItem('expiry_popup_shown')) {
// //       setShowExpiryPopup(true);
// //       sessionStorage.setItem('expiry_popup_shown', 'true');
// //     }
// //   }, [isExpired, subscription]);

// //   // ═══════════════════════════════════════════════════════════════
// //   // 10. NOTIFICATION AUTO-HIDE
// //   // ═══════════════════════════════════════════════════════════════
  
// //   useEffect(() => {
// //     if (notification.type) {
// //       const timer = setTimeout(() => {
// //         setNotification({ type: null, message: '' });
// //       }, 5000);
// //       return () => clearTimeout(timer);
// //     }
// //   }, [notification]);

// //   // ═══════════════════════════════════════════════════════════════
// //   // HELPER FUNCTIONS
// //   // ═══════════════════════════════════════════════════════════════

// //   const loadScanStats = async (sellerId: string) => {
// //     try {
// //       console.log('📊 [STATS] Loading...');
// //       const stats = await getRemainingScanCount(sellerId);
// //       console.log('📊 [STATS] Loaded:', stats);
// //       setScanStats(stats);
// //     } catch (error) {
// //       console.error('❌ [STATS] Error:', error);
// //       setScanStats(null);
// //     }
// //   };

// //   const loadSubscription = useCallback(async (forceServerFetch: boolean = false) => {
// //     if (isLoadingRef.current) {
// //       console.log('⏭️ [LOAD] Already loading');
// //       return;
// //     }

// //     try {
// //       isLoadingRef.current = true;
// //       setLoading(true);
      
// //       console.log('🔍 [LOAD] Fetching (force:', forceServerFetch, ')');
// //       const sub = await getSellerSubscription(sellerId, forceServerFetch);
      
// //       if (sub) {
// //         const changed = lastSubscriptionIdRef.current !== sub.id;
        
// //         if (changed) {
// //           console.log('🔄 [LOAD] Subscription changed:', {
// //             old: lastSubscriptionIdRef.current,
// //             new: sub.id
// //           });
// //           lastSubscriptionIdRef.current = sub.id;
// //           setHasDisabledWorkers(false);
// //           sessionStorage.removeItem('expiry_popup_shown');
// //         }

// //         // ✅ Batch updates
// //         const planData = await getPlanById(sub.plan_id);
// //         const stats = await getRemainingScanCount(sellerId);
// //         const timeExpired = isSubscriptionExpired(sub);
// //         const statusCompleted = sub.status === 'completed';
// //         const expired = timeExpired || statusCompleted;

// //         setSubscription(sub);
// //         setPlan(planData);
// //         setScanStats(stats);
// //         setIsExpired(expired);
// //         setLastChecked(new Date());
        
// //         if (!expired) {
// //           sessionStorage.removeItem('expiry_popup_shown');
// //           setHasDisabledWorkers(false);
// //         }
        
// //         console.log('✅ [LOAD] Loaded:', {
// //           id: sub.id,
// //           plan: planData?.plan_name,
// //           expired
// //         });
// //       } else {
// //         console.log('ℹ️ [LOAD] No subscription');
// //         setSubscription(null);
// //         setPlan(null);
// //         setIsExpired(false);
// //         setScanStats(null);
// //         lastSubscriptionIdRef.current = null;
// //       }
// //     } catch (error) {
// //       console.error('❌ [LOAD] Error:', error);
// //       showNotification('error', 'Failed to load subscription');
// //     } finally {
// //       setLoading(false);
// //       isLoadingRef.current = false;
// //     }
// //   }, [sellerId]);

// //   const showNotification = (type: 'success' | 'error', message: string) => {
// //     setNotification({ type, message });
// //   };

// //   const updateTimer = () => {
// //     if (!subscription || !subscription.end_date) return;

// //     const endDate = new Date(subscription.end_date);
// //     const now = new Date();
// //     const diffMs = endDate.getTime() - now.getTime();

// //     if (diffMs <= 0) {
// //       setTimeRemaining({ 
// //         days: 0, 
// //         hours: 0, 
// //         minutes: 0, 
// //         seconds: 0,
// //         totalDays: 0 
// //       });
// //       if (!isExpired) {
// //         console.log('⏰ [TIMER] Reached 0 - Expired');
// //         setIsExpired(true);
// //       }
// //       return;
// //     }

// //     const totalDays = diffMs / (1000 * 60 * 60 * 24);
// //     const days = Math.floor(totalDays);
// //     const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
// //     const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
// //     const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);

// //     setTimeRemaining({ days, hours, minutes, seconds, totalDays });
// //   };

// //   const getTimerDisplay = (): string => {
// //     const { totalDays } = timeRemaining;
    
// //     if (totalDays <= 0) {
// //       return '0 days left';
// //     }
    
// //     const daysToShow = Math.ceil(totalDays);
    
// //     if (daysToShow === 1) {
// //       return '1 day left';
// //     }
    
// //     return `${daysToShow} days left`;
// //   };

// //   const getStatusColor = (): string => {
// //     if (isExpired) return 'from-red-600 to-red-700';
    
// //     const { totalDays } = timeRemaining;
    
// //     if (totalDays < 1) return 'from-red-500 to-orange-600';
// //     if (totalDays < 3) return 'from-orange-500 to-yellow-600';
// //     if (totalDays < 7) return 'from-yellow-500 to-yellow-600';
// //     if (totalDays < 30) return 'from-blue-500 to-blue-600';
    
// //     return 'from-green-600 to-emerald-600';
// //   };

// //   const shouldPulse = (): boolean => {
// //     const { totalDays } = timeRemaining;
// //     return totalDays < 3 || isExpired;
// //   };

// //   const formatDate = (date: Date | string): string => {
// //     return new Date(date).toLocaleString('en-IN', {
// //       day: 'numeric',
// //       month: 'short',
// //       year: 'numeric',
// //       hour: '2-digit',
// //       minute: '2-digit'
// //     });
// //   };

// //   // ═══════════════════════════════════════════════════════════════
// //   // RENDER - LOADING STATE
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
// //   // RENDER - NO SUBSCRIPTION
// //   // ═══════════════════════════════════════════════════════════════
  
// //   if (!subscription || !plan) {
// //     return (
// //       <div className="mb-4 sm:mb-6 p-4 sm:p-5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
// //         <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
// //           <div className="flex items-start gap-3 sm:gap-4 flex-1 min-w-0">
// //             <div className="flex-shrink-0 p-2 bg-white bg-opacity-20 rounded-lg backdrop-blur-sm">
// //               <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6" />
// //             </div>
// //             <div className="flex-1 min-w-0">
// //               <h3 className="font-bold text-lg sm:text-xl mb-1">No Active Plan</h3>
// //               <p className="text-sm sm:text-base text-purple-100 leading-relaxed">
// //                 Subscribe to a plan to unlock all features and start growing your business!
// //               </p>
// //             </div>
// //           </div>
          
// //           <button
// //             onClick={onViewPlans}
// //             className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white text-purple-700 px-5 sm:px-6 py-3 sm:py-3.5 rounded-lg font-bold shadow-lg hover:shadow-xl hover:bg-purple-50 active:bg-white active:scale-95 transition-all transform hover:-translate-y-0.5 active:translate-y-0 text-sm sm:text-base border-2 border-white group"
// //           >
// //             <Eye className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform" />
// //             <span>View Plans</span>
// //           </button>
// //         </div>
// //       </div>
// //     );
// //   }

// //   // ═══════════════════════════════════════════════════════════════
// //   // RENDER - EXPIRED SUBSCRIPTION
// //   // ═══════════════════════════════════════════════════════════════
  
// //   if (isExpired) {
// //     return (
// //       <>
// //         {notification.type && (
// //           <div 
// //             className={`mb-4 p-3 sm:p-4 rounded-xl shadow-lg transform transition-all duration-300 ${
// //               notification.type === 'success' 
// //                 ? 'bg-green-100 text-green-800 border-2 border-green-300' 
// //                 : 'bg-red-100 text-red-800 border-2 border-red-300'
// //             }`}
// //           >
// //             <div className="flex items-start justify-between gap-3">
// //               <p className="text-sm sm:text-base flex-1 font-medium">{notification.message}</p>
// //               <button 
// //                 onClick={() => setNotification({ type: null, message: '' })}
// //                 className="flex-shrink-0 hover:bg-black hover:bg-opacity-10 rounded-lg p-1 transition-colors"
// //               >
// //                 <X className="w-4 h-4" />
// //               </button>
// //             </div>
// //           </div>
// //         )}

// //         <div className="mb-4 sm:mb-6 p-4 sm:p-5 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl shadow-lg animate-pulse">
// //           <div className="flex flex-col gap-4">
// //             <div className="flex items-start justify-between gap-3">
// //               <div className="flex items-start gap-3 sm:gap-4 flex-1 min-w-0">
// //                 <div className="flex-shrink-0 p-2 bg-white bg-opacity-20 rounded-lg backdrop-blur-sm">
// //                   <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6" />
// //                 </div>
// //                 <div className="flex-1 min-w-0">
// //                   <h3 className="font-bold text-lg sm:text-xl mb-1">❌ Plan Expired</h3>
// //                   <p className="text-sm sm:text-base opacity-90 mb-1">{plan.plan_name}</p>
// //                   <p className="text-xs sm:text-sm opacity-80">
// //                     Expired: {formatDate(subscription.end_date)}
// //                   </p>
// //                 </div>
// //               </div>
// //               <button 
// //                 onClick={() => loadSubscription(true)} 
// //                 className="flex-shrink-0 p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-all active:scale-95"
// //                 title="Refresh subscription status"
// //               >
// //                 <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5" />
// //               </button>
// //             </div>

// //             <button
// //               onClick={onViewPlans}
// //               className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white text-red-700 px-5 sm:px-6 py-3 sm:py-3.5 rounded-lg font-bold shadow-xl hover:shadow-2xl hover:bg-red-50 active:bg-white active:scale-95 transition-all transform hover:-translate-y-1 active:translate-y-0 text-sm sm:text-base border-2 border-white group"
// //             >
// //               <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5 group-hover:rotate-180 transition-transform duration-500" />
// //               <span>Renew Plan Now</span>
// //             </button>
// //           </div>
// //         </div>
// //       </>
// //     );
// //   }

// //   // ═══════════════════════════════════════════════════════════════
// //   // RENDER - ACTIVE SUBSCRIPTION
// //   // ═══════════════════════════════════════════════════════════════
  
// //   return (
// //     <>
// //       {notification.type && (
// //         <div 
// //           className={`mb-4 p-3 sm:p-4 rounded-xl shadow-lg transform transition-all duration-300 ${
// //             notification.type === 'success' 
// //               ? 'bg-green-100 text-green-800 border-2 border-green-300' 
// //               : 'bg-red-100 text-red-800 border-2 border-red-300'
// //           }`}
// //         >
// //           <div className="flex items-start justify-between gap-3">
// //             <p className="text-sm sm:text-base flex-1 font-medium">{notification.message}</p>
// //             <button 
// //               onClick={() => setNotification({ type: null, message: '' })}
// //               className="flex-shrink-0 hover:bg-black hover:bg-opacity-10 rounded-lg p-1 transition-colors"
// //             >
// //               <X className="w-4 h-4" />
// //             </button>
// //           </div>
// //         </div>
// //       )}

// //       <div className={`mb-4 sm:mb-6 p-4 sm:p-5 bg-gradient-to-r ${getStatusColor()} text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 ${
// //         shouldPulse() ? 'animate-pulse' : ''
// //       }`}>
// //         <div className="flex flex-col gap-4">
// //           {/* Header Section */}
// //           <div className="flex items-start justify-between gap-3">
// //             <div className="flex items-start gap-3 sm:gap-4 flex-1 min-w-0">
// //               <div className="flex-shrink-0 p-2 bg-white bg-opacity-20 rounded-lg backdrop-blur-sm">
// //                 <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6" />
// //               </div>
// //               <div className="flex-1 min-w-0">
// //                 <h3 className="font-bold text-lg sm:text-xl mb-1 truncate">
// //                   ✅ {plan.plan_name}
// //                 </h3>
// //                 <p className="text-sm sm:text-base opacity-90">
// //                   ₹{plan.price.toLocaleString('en-IN')}
// //                 </p>
// //               </div>
// //             </div>
// //             <button 
// //               onClick={() => loadSubscription(true)} 
// //               className="flex-shrink-0 p-2 hover:bg-white hover:bg-opacity-30 rounded-lg transition-all active:scale-95"
// //               title="Refresh subscription status"
// //             >
// //               <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5" />
// //             </button>
// //           </div>

// //           {/* Scan Count Section - REAL-TIME */}
// //           {scanStats && !scanStats.unlimited && (
// //             <div className="flex items-center gap-3 border-t border-white border-opacity-30 pt-4">
// //               <div className="flex-shrink-0 p-2 bg-white bg-opacity-20 rounded-lg backdrop-blur-sm">
// //                 <QrCode className="w-4 h-4 sm:w-5 sm:h-5" />
// //               </div>
// //               <div className="text-sm sm:text-base flex-1">
// //                 <div className="flex items-center justify-between mb-1">
// //                   <span className="font-medium">Scans:</span>
// //                   <span className="font-mono font-bold text-base sm:text-lg">
// //                     {scanStats.used} / {scanStats.total}
// //                   </span>
// //                 </div>
// //                 {scanStats.limitReached ? (
// //                   <div className="text-red-200 text-xs sm:text-sm font-semibold bg-red-900 bg-opacity-40 px-3 py-1.5 rounded-lg inline-block">
// //                     ⚠️ Limit reached - Subscription expired
// //                   </div>
// //                 ) : scanStats.remaining > 0 ? (
// //                   <div className={`text-xs sm:text-sm ${
// //                     scanStats.remaining <= 2 ? 'text-yellow-200 font-semibold' : 'text-green-200'
// //                   }`}>
// //                     {scanStats.remaining} scan{scanStats.remaining !== 1 ? 's' : ''} remaining
// //                     {scanStats.remaining <= 2 && ' ⚠️'}
// //                   </div>
// //                 ) : (
// //                   <div className="text-red-200 text-xs sm:text-sm font-semibold bg-red-900 bg-opacity-40 px-3 py-1.5 rounded-lg inline-block">
// //                     ⚠️ Last scan used
// //                   </div>
// //                 )}
// //               </div>
// //             </div>
// //           )}

// //           {scanStats && scanStats.unlimited && (
// //             <div className="flex items-center gap-3 border-t border-white border-opacity-30 pt-4">
// //               <div className="flex-shrink-0 p-2 bg-white bg-opacity-20 rounded-lg backdrop-blur-sm">
// //                 <QrCode className="w-4 h-4 sm:w-5 sm:h-5" />
// //               </div>
// //               <div className="text-sm sm:text-base">
// //                 Scans: <span className="font-mono font-bold text-base sm:text-lg">Unlimited ∞</span>
// //                 {scanStats.used > 0 && (
// //                   <span className="text-green-200 ml-2">({scanStats.used} used)</span>
// //                 )}
// //               </div>
// //             </div>
// //           )}

// //           {/* Timer Section - DAYS ONLY */}
// //           <div className="flex items-center gap-3 border-t border-white border-opacity-30 pt-4">
// //             <div className="flex-shrink-0 p-2 bg-white bg-opacity-20 rounded-lg backdrop-blur-sm">
// //               <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
// //             </div>
// //             <div className="text-sm sm:text-base">
// //               <span className="font-medium">Time Remaining: </span>
// //               <span className="font-bold text-base sm:text-lg ml-1">
// //                 {getTimerDisplay()}
// //               </span>
// //             </div>
// //           </div>

// //           {/* Upgrade Button */}
// //           <button
// //             onClick={onViewPlans}
// //             className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white bg-opacity-95 hover:bg-white text-gray-800 px-5 sm:px-6 py-3 sm:py-3.5 rounded-lg font-bold shadow-lg hover:shadow-xl active:shadow-md active:scale-95 transition-all transform hover:-translate-y-0.5 active:translate-y-0 text-sm sm:text-base backdrop-blur-sm border border-white border-opacity-50 group"
// //           >
// //             <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform" />
// //             <span>Upgrade Plan</span>
// //           </button>
// //         </div>
// //       </div>
// //     </>
// //   );
// // };

// // console.log('✅ PlanStatusBanner loaded - PRODUCTION v11.1 - ANTI-BLINK (Debounced + Batched Updates)'); 
// import React, { useState, useEffect, useRef, useCallback } from 'react';
// import { Clock, AlertTriangle, CheckCircle, RefreshCw, Eye, X, TrendingUp, QrCode } from 'lucide-react';
// import { db } from '../lib/firebase';
// import { collection, query, where, orderBy, limit, onSnapshot } from 'firebase/firestore';
// import { getSellerSubscription, isSubscriptionExpired, getRemainingScanCount } from '../lib/subscriptionService';
// import { getPlanById } from '../lib/planService';
// import { disableAllSellersWorkers } from '../lib/firebaseutils';
// import type { Subscription } from '../types/payment.types';
// import type { Plan } from '../types/plan.types';

// // ═══════════════════════════════════════════════════════════════
// // INTERFACE
// // ═══════════════════════════════════════════════════════════════

// interface PlanStatusBannerProps {
//   sellerId: string;
//   onViewPlans: () => void;
//   forceRefresh?: number;
//   onPlanStatusChange?: (isActive: boolean, isExpired: boolean) => void;
// }

// interface TimeRemaining {
//   days: number;
//   hours: number;
//   minutes: number;
//   seconds: number;
//   totalDays: number;
// }

// interface ScanStats {
//   remaining: number;
//   total: number;
//   used: number;
//   unlimited: boolean;
//   limitReached: boolean;
// }

// // ═══════════════════════════════════════════════════════════════
// // COMPONENT
// // ═══════════════════════════════════════════════════════════════

// export const PlanStatusBanner: React.FC<PlanStatusBannerProps> = ({
//   sellerId,
//   onViewPlans,
//   forceRefresh = 0,
//   onPlanStatusChange
// }) => {
//   // ═══════════════════════════════════════════════════════════════
//   // STATE
//   // ═══════════════════════════════════════════════════════════════
  
//   const [subscription, setSubscription] = useState<Subscription | null>(null);
//   const [plan, setPlan] = useState<Plan | null>(null);
//   const [hasDisabledWorkers, setHasDisabledWorkers] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [timeRemaining, setTimeRemaining] = useState<TimeRemaining>({
//     days: 0,
//     hours: 0,
//     minutes: 0,
//     seconds: 0,
//     totalDays: 0
//   });
//   const [isExpired, setIsExpired] = useState(false);
//   const [showExpiryPopup, setShowExpiryPopup] = useState(false);
//   const [lastChecked, setLastChecked] = useState<Date>(new Date());
//   const [notification, setNotification] = useState<{
//     type: 'success' | 'error' | null;
//     message: string;
//   }>({ type: null, message: '' });
//   const [isPaymentProcessing, setIsPaymentProcessing] = useState(false);
//   const [scanStats, setScanStats] = useState<ScanStats | null>(null);
  
//   const disableTimeoutRef = useRef<NodeJS.Timeout | null>(null);
//   const isLoadingRef = useRef(false);
//   const lastSubscriptionIdRef = useRef<string | null>(null);
//   const lastExpiredStateRef = useRef<boolean>(false);
//   const unsubscribeFirestoreRef = useRef<(() => void) | null>(null);
  
//   // ✅ Store callback in ref to avoid dependency issues
//   const onPlanStatusChangeRef = useRef(onPlanStatusChange);
  
//   useEffect(() => {
//     onPlanStatusChangeRef.current = onPlanStatusChange;
//   }, [onPlanStatusChange]);

//   // ✅ Debounce mechanism
//   const updateTimeoutRef = useRef<NodeJS.Timeout | null>(null);
//   const isUpdatingRef = useRef(false);

//   // ═══════════════════════════════════════════════════════════════
//   // 1. REAL-TIME FIRESTORE LISTENER (HYBRID APPROACH)
//   // ═══════════════════════════════════════════════════════════════
  
//   // useEffect(() => {
//   //   if (!sellerId) return;

//   //   console.log('🔥 [REAL-TIME] Setting up Firestore listener for seller:', sellerId);

//   //   let mounted = true;

//   //   const setupListener = async () => {
//   //     try {
//   //       setLoading(true);

//   //       // ✅ Initial fetch to get current subscription (active OR expired)
//   //       console.log('🔍 [REAL-TIME] Initial fetch...');
//   //       const sub = await getSellerSubscription(sellerId, true);
        
//   //       if (!sub || !sub.id) {
//   //         console.log('ℹ️ [REAL-TIME] No subscription found');
//   //         if (mounted) {
//   //           setSubscription(null);
//   //           setPlan(null);
//   //           setIsExpired(false);
//   //           setScanStats(null);
//   //           setLoading(false);
//   //         }
//   //         return;
//   //       }

//   //       console.log('✅ [REAL-TIME] Initial subscription loaded:', sub.id);
        
//   //       // ✅ Batch initial data load
//   //       const planData = await getPlanById(sub.plan_id);
//   //       const stats = await getRemainingScanCount(sellerId);
//   //       const expired = isSubscriptionExpired(sub);

//   //       if (mounted) {
//   //         setSubscription(sub);
//   //         setPlan(planData);
//   //         setScanStats(stats);
//   //         setIsExpired(expired);
//   //         setLastChecked(new Date());
//   //         setLoading(false);
//   //         lastSubscriptionIdRef.current = sub.id;

//   //         if (!expired) {
//   //           sessionStorage.removeItem('expiry_popup_shown');
//   //           setHasDisabledWorkers(false);
//   //         }

//   //         console.log('✅ [REAL-TIME] Initial state set:', {
//   //           id: sub.id,
//   //           plan: planData?.plan_name,
//   //           expired,
//   //           status: sub.status
//   //         });

//   //         if (onPlanStatusChangeRef.current) {
//   //           const isActive = !expired && sub.status !== 'completed';
//   //           onPlanStatusChangeRef.current(isActive, expired);
//   //           console.log('📢 [REAL-TIME] Initial parent notification:', { isActive, expired });
//   //         }
//   //       }

//   //       // ✅ QUERY-BASED LISTENER (Detects NEW active subscriptions = plan changes)
//   //       console.log('📍 [REAL-TIME] Setting up query listener for NEW active subscriptions...');

//   //       const subscriptionsRef = collection(db, 'subscriptions');
//   //       const q = query(
//   //         subscriptionsRef,
//   //         where('seller_id', '==', sellerId),
//   //         where('status', '==', 'active'), // ✅ Only new active subscriptions
//   //         orderBy('created_at', 'desc'),
//   //         limit(1)
//   //       );

//   //       const unsubscribe = onSnapshot(
//   //         q,
//   //         async (snapshot) => {
//   //           if (isUpdatingRef.current || !mounted) {
//   //             console.log('⏭️ [REAL-TIME] Skipping update (busy or unmounted)');
//   //             return;
//   //           }

//   //           isUpdatingRef.current = true;

//   //           try {
//   //             console.log('🔔 [REAL-TIME] Query listener fired!');

//   //             if (snapshot.empty) {
//   //               console.log('⚠️ [REAL-TIME] No active subscription found');
                
//   //               // ✅ Check if current subscription expired
//   //               const currentSub = await getSellerSubscription(sellerId, true);
                
//   //               if (currentSub) {
//   //                 // Subscription exists but is expired/completed
//   //                 const planData = await getPlanById(currentSub.plan_id);
//   //                 const stats = await getRemainingScanCount(sellerId);
//   //                 const expired = isSubscriptionExpired(currentSub);

//   //                 if (mounted) {
//   //                   setSubscription(currentSub);
//   //                   setPlan(planData);
//   //                   setScanStats(stats);
//   //                   setIsExpired(expired);

//   //                   console.log('✅ [REAL-TIME] Current subscription is EXPIRED:', {
//   //                     id: currentSub.id,
//   //                     status: currentSub.status,
//   //                     expired
//   //                   });

//   //                   if (onPlanStatusChangeRef.current) {
//   //                     onPlanStatusChangeRef.current(false, true);
//   //                   }
//   //                 }
//   //               } else {
//   //                 // No subscription at all
//   //                 if (mounted) {
//   //                   setSubscription(null);
//   //                   setPlan(null);
//   //                   setIsExpired(false);
//   //                   setScanStats(null);
//   //                   lastSubscriptionIdRef.current = null;
                    
//   //                   if (onPlanStatusChangeRef.current) {
//   //                     onPlanStatusChangeRef.current(false, false);
//   //                   }
//   //                 }
//   //               }

//   //               isUpdatingRef.current = false;
//   //               return;
//   //             }

//   //             // ✅ New active subscription detected
//   //             const docSnap = snapshot.docs[0];
//   //             const data = { 
//   //               id: docSnap.id, 
//   //               ...docSnap.data() 
//   //             } as Subscription;

//   //             console.log('📊 [REAL-TIME] New active subscription detected:', {
//   //               id: data.id,
//   //               plan: data.plan_name,
//   //               status: data.status
//   //             });

//   //             // ✅ Check if this is a PLAN CHANGE
//   //             const subscriptionChanged = lastSubscriptionIdRef.current !== data.id;

//   //             if (subscriptionChanged) {
//   //               console.log('🔄 [REAL-TIME] PLAN CHANGED:', {
//   //                 old: lastSubscriptionIdRef.current,
//   //                 new: data.id
//   //               });

//   //               lastSubscriptionIdRef.current = data.id;

//   //               if (mounted) {
//   //                 sessionStorage.removeItem('expiry_popup_shown');
//   //                 setHasDisabledWorkers(false);
//   //               }
//   //             }

//   //             // ✅ Batch update
//   //             const planData = await getPlanById(data.plan_id);
//   //             const stats = await getRemainingScanCount(sellerId);
//   //             const timeExpired = isSubscriptionExpired(data);
//   //             const statusCompleted = data.status === 'completed';
//   //             const expired = timeExpired || statusCompleted;

//   //             if (mounted) {
//   //               setSubscription(data);
//   //               setPlan(planData);
//   //               setScanStats(stats);
//   //               setIsExpired(expired);
//   //               setLastChecked(new Date());

//   //               console.log('✅ [REAL-TIME] State updated:', {
//   //                 plan: planData?.plan_name,
//   //                 expired,
//   //                 status: data.status
//   //               });

//   //               if (onPlanStatusChangeRef.current) {
//   //                 const isActive = !expired && data.status !== 'completed';
//   //                 onPlanStatusChangeRef.current(isActive, expired);
//   //                 console.log('📢 [REAL-TIME] Parent notified:', { isActive, expired });
//   //               }
//   //             }

//   //           } catch (error) {
//   //             console.error('❌ [REAL-TIME] Update error:', error);
//   //           } finally {
//   //             isUpdatingRef.current = false;
//   //           }
//   //         },
//   //         (error) => {
//   //           console.error('❌ [REAL-TIME] Listener error:', error);
//   //           isUpdatingRef.current = false;
//   //         }
//   //       );

//   //       unsubscribeFirestoreRef.current = unsubscribe;
//   //       console.log('✅ [REAL-TIME] Listener active');

//   //     } catch (error) {
//   //       console.error('❌ [REAL-TIME] Setup failed:', error);
//   //       if (mounted) {
//   //         setLoading(false);
//   //       }
//   //     }
//   //   };

//   //   setupListener();

//   //   return () => {
//   //     mounted = false;
      
//   //     if (unsubscribeFirestoreRef.current) {
//   //       console.log('🧹 [REAL-TIME] Cleaning up listener');
//   //       unsubscribeFirestoreRef.current();
//   //       unsubscribeFirestoreRef.current = null;
//   //     }
      
//   //     if (updateTimeoutRef.current) {
//   //       clearTimeout(updateTimeoutRef.current);
//   //     }
      
//   //     isUpdatingRef.current = false;
//   //   };
//   // }, [sellerId]);

  
//   // ═══════════════════════════════════════════════════════════════
//   // 2. CROSS-TAB COMMUNICATION
//   // ═══════════════════════════════════════════════════════════════
//   useEffect(() => {
//   if (!sellerId) return;

//   console.log('🔥 [REAL-TIME] Setting up Firestore listeners for seller:', sellerId);

//   let mounted = true;
//   let currentDocListener: (() => void) | null = null;
//   let queryListener: (() => void) | null = null;

//   const setupListeners = async () => {
//     try {
//       setLoading(true);

//       // ═══════════════════════════════════════════════════════════════
//       // ✅ STEP 1: Initial fetch
//       // ═══════════════════════════════════════════════════════════════
//       console.log('🔍 [REAL-TIME] Initial fetch...');
//       const sub = await getSellerSubscription(sellerId, true);
      
//       if (!sub || !sub.id) {
//         console.log('ℹ️ [REAL-TIME] No subscription found');
//         if (mounted) {
//           setSubscription(null);
//           setPlan(null);
//           setIsExpired(false);
//           setScanStats(null);
//           setLoading(false);
//         }
//         return;
//       }

//       console.log('✅ [REAL-TIME] Initial subscription loaded:', sub.id, '- Status:', sub.status);
      
//       // Load all data
//       const planData = await getPlanById(sub.plan_id);
//       const stats = await getRemainingScanCount(sellerId);
//       const expired = isSubscriptionExpired(sub);

//       if (mounted) {
//         setSubscription(sub);
//         setPlan(planData);
//         setScanStats(stats);
//         setIsExpired(expired);
//         setLastChecked(new Date());
//         setLoading(false);
//         lastSubscriptionIdRef.current = sub.id;

//         if (!expired) {
//           sessionStorage.removeItem('expiry_popup_shown');
//           setHasDisabledWorkers(false);
//         }

//         console.log('✅ [REAL-TIME] Initial state set:', {
//           id: sub.id,
//           plan: planData?.plan_name,
//           expired,
//           status: sub.status
//         });

//         if (onPlanStatusChangeRef.current) {
//           const isActive = !expired && sub.status !== 'completed';
//           onPlanStatusChangeRef.current(isActive, expired);
//           console.log('📢 [REAL-TIME] Initial parent notification:', { isActive, expired });
//         }
//       }

//       // ═══════════════════════════════════════════════════════════════
//       // ✅ LISTENER 1: DOCUMENT LISTENER (for current subscription updates)
//       // ═══════════════════════════════════════════════════════════════
//       console.log('📍 [LISTENER 1] Setting up DOCUMENT listener for:', sub.id);

//       currentDocListener = onSnapshot(
//         doc(db, 'subscriptions', sub.id),
//         async (snapshot) => {
//           if (isUpdatingRef.current || !mounted) {
//             console.log('⏭️ [DOC] Skipping update (busy or unmounted)');
//             return;
//           }

//           isUpdatingRef.current = true;

//           try {
//             console.log('🔔 [DOC] Document listener fired!');

//             if (!snapshot.exists()) {
//               console.log('⚠️ [DOC] Subscription deleted');
              
//               if (mounted) {
//                 setSubscription(null);
//                 setPlan(null);
//                 setIsExpired(false);
//                 setScanStats(null);
//                 lastSubscriptionIdRef.current = null;
                
//                 if (onPlanStatusChangeRef.current) {
//                   onPlanStatusChangeRef.current(false, false);
//                 }
//               }

//               isUpdatingRef.current = false;
//               return;
//             }

//             const data = {
//               id: snapshot.id,
//               ...snapshot.data()
//             } as Subscription;

//             console.log('📊 [DOC] Document updated:', {
//               id: data.id,
//               status: data.status,
//               count: data.current_scan_count,
//               limit: data.scan_limit
//             });

//             // Load updated data
//             const planData = await getPlanById(data.plan_id);
//             const stats = await getRemainingScanCount(sellerId);
//             const timeExpired = isSubscriptionExpired(data);
//             const statusCompleted = data.status === 'completed';
//             const expired = timeExpired || statusCompleted;

//             if (mounted) {
//               setSubscription(data);
//               setPlan(planData);
//               setScanStats(stats);
//               setIsExpired(expired);
//               setLastChecked(new Date());

//               console.log('✅ [DOC] State updated:', {
//                 plan: planData?.plan_name,
//                 expired,
//                 status: data.status,
//                 reason: expired ? (statusCompleted ? 'STATUS_COMPLETED' : 'TIME_EXPIRED') : 'ACTIVE'
//               });

//               // ✅ CRITICAL: Notify parent
//               if (onPlanStatusChangeRef.current) {
//                 const isActive = !expired && data.status !== 'completed';
//                 onPlanStatusChangeRef.current(isActive, expired);
//                 console.log('📢 [DOC] Parent notified:', { 
//                   isActive, 
//                   expired,
//                   status: data.status 
//                 });
//               }
//             }

//           } catch (error) {
//             console.error('❌ [DOC] Update error:', error);
//           } finally {
//             isUpdatingRef.current = false;
//           }
//         },
//         (error) => {
//           console.error('❌ [DOC] Listener error:', error);
//           isUpdatingRef.current = false;
//         }
//       );

//       console.log('✅ [LISTENER 1] Document listener active');

//       // ═══════════════════════════════════════════════════════════════
//       // ✅ LISTENER 2: QUERY LISTENER (for NEW subscriptions - plan changes)
//       // ═══════════════════════════════════════════════════════════════
//       console.log('📍 [LISTENER 2] Setting up QUERY listener for NEW subscriptions...');

//       const subscriptionsRef = collection(db, 'subscriptions');
      
//       // ✅ Query for latest subscription (any status)
//       const q = query(
//         subscriptionsRef,
//         where('seller_id', '==', sellerId),
//         // ✅ NO STATUS FILTER - gets latest regardless
//         orderBy('created_at', 'desc'),
//         limit(1)
//       );

//       queryListener = onSnapshot(
//         q,
//         async (snapshot) => {
//           if (isUpdatingRef.current || !mounted) {
//             console.log('⏭️ [QUERY] Skipping update (busy or unmounted)');
//             return;
//           }

//           if (snapshot.empty) {
//             console.log('ℹ️ [QUERY] No subscriptions found');
//             return;
//           }

//           const docSnap = snapshot.docs[0];
//           const newSubId = docSnap.id;

//           // ✅ Check if this is a DIFFERENT subscription (new plan purchased)
//           if (newSubId === lastSubscriptionIdRef.current) {
//             console.log('⏭️ [QUERY] Same subscription, ignoring');
//             return;
//           }

//           isUpdatingRef.current = true;

//           try {
//             console.log('🔔 [QUERY] NEW subscription detected!');
//             console.log('🔄 [QUERY] PLAN CHANGED:', {
//               old: lastSubscriptionIdRef.current,
//               new: newSubId
//             });

//             const data = { 
//               id: docSnap.id, 
//               ...docSnap.data() 
//             } as Subscription;

//             // ✅ Update to new subscription
//             lastSubscriptionIdRef.current = newSubId;

//             if (mounted) {
//               sessionStorage.removeItem('expiry_popup_shown');
//               setHasDisabledWorkers(false);
//             }

//             // Load new plan data
//             const planData = await getPlanById(data.plan_id);
//             const stats = await getRemainingScanCount(sellerId);
//             const timeExpired = isSubscriptionExpired(data);
//             const statusCompleted = data.status === 'completed';
//             const expired = timeExpired || statusCompleted;

//             if (mounted) {
//               setSubscription(data);
//               setPlan(planData);
//               setScanStats(stats);
//               setIsExpired(expired);
//               setLastChecked(new Date());

//               console.log('✅ [QUERY] Switched to new subscription:', {
//                 id: data.id,
//                 plan: planData?.plan_name,
//                 expired,
//                 status: data.status
//               });

//               if (onPlanStatusChangeRef.current) {
//                 const isActive = !expired && data.status !== 'completed';
//                 onPlanStatusChangeRef.current(isActive, expired);
//                 console.log('📢 [QUERY] Parent notified:', { isActive, expired });
//               }
//             }

//             // ✅ CRITICAL: Switch document listener to NEW subscription
//             if (currentDocListener) {
//               console.log('🔄 [QUERY] Cleaning up old document listener');
//               currentDocListener();
//             }

//             console.log('📍 [QUERY] Setting up NEW document listener for:', newSubId);

//             currentDocListener = onSnapshot(
//               doc(db, 'subscriptions', newSubId),
//               async (snapshot) => {
//                 if (isUpdatingRef.current || !mounted) return;
//                 isUpdatingRef.current = true;

//                 try {
//                   if (!snapshot.exists()) {
//                     if (mounted) {
//                       setSubscription(null);
//                       setPlan(null);
//                       setIsExpired(false);
//                       setScanStats(null);
//                       lastSubscriptionIdRef.current = null;
                      
//                       if (onPlanStatusChangeRef.current) {
//                         onPlanStatusChangeRef.current(false, false);
//                       }
//                     }
//                     isUpdatingRef.current = false;
//                     return;
//                   }

//                   const data = {
//                     id: snapshot.id,
//                     ...snapshot.data()
//                   } as Subscription;

//                   console.log('📊 [NEW-DOC] Document updated:', {
//                     id: data.id,
//                     status: data.status,
//                     count: data.current_scan_count
//                   });

//                   const planData = await getPlanById(data.plan_id);
//                   const stats = await getRemainingScanCount(sellerId);
//                   const timeExpired = isSubscriptionExpired(data);
//                   const statusCompleted = data.status === 'completed';
//                   const expired = timeExpired || statusCompleted;

//                   if (mounted) {
//                     setSubscription(data);
//                     setPlan(planData);
//                     setScanStats(stats);
//                     setIsExpired(expired);
//                     setLastChecked(new Date());

//                     console.log('✅ [NEW-DOC] State updated:', {
//                       plan: planData?.plan_name,
//                       expired,
//                       status: data.status
//                     });

//                     if (onPlanStatusChangeRef.current) {
//                       const isActive = !expired && data.status !== 'completed';
//                       onPlanStatusChangeRef.current(isActive, expired);
//                       console.log('📢 [NEW-DOC] Parent notified:', { isActive, expired });
//                     }
//                   }

//                 } catch (error) {
//                   console.error('❌ [NEW-DOC] Update error:', error);
//                 } finally {
//                   isUpdatingRef.current = false;
//                 }
//               },
//               (error) => {
//                 console.error('❌ [NEW-DOC] Listener error:', error);
//                 isUpdatingRef.current = false;
//               }
//             );

//             console.log('✅ [QUERY] New document listener active');

//           } catch (error) {
//             console.error('❌ [QUERY] Update error:', error);
//           } finally {
//             isUpdatingRef.current = false;
//           }
//         },
//         (error) => {
//           console.error('❌ [QUERY] Listener error:', error);
//           isUpdatingRef.current = false;
//         }
//       );

//       console.log('✅ [LISTENER 2] Query listener active');
//       console.log('🎯 [HYBRID] Both listeners running - Full coverage achieved');

//     } catch (error) {
//       console.error('❌ [REAL-TIME] Setup failed:', error);
//       if (mounted) {
//         setLoading(false);
//       }
//     }
//   };

//   setupListeners();

//   return () => {
//     mounted = false;
    
//     console.log('🧹 [CLEANUP] Cleaning up all listeners');
    
//     if (currentDocListener) {
//       console.log('🧹 Cleaning up document listener');
//       currentDocListener();
//       currentDocListener = null;
//     }
    
//     if (queryListener) {
//       console.log('🧹 Cleaning up query listener');
//       queryListener();
//       queryListener = null;
//     }
    
//     if (updateTimeoutRef.current) {
//       clearTimeout(updateTimeoutRef.current);
//     }
    
//     isUpdatingRef.current = false;
    
//     console.log('✅ [CLEANUP] All listeners cleaned up');
//   };
// }, [sellerId]);

//   useEffect(() => {
//     console.log('📡 [CROSS-TAB] Setting up localStorage listener');

//     const handleStorageEvent = (e: StorageEvent) => {
//       if (e.key === 'scan_completed' || e.key === 'scan_limit_reached') {
//         console.log('🔔 [CROSS-TAB] Scan event from another tab:', e.key);
        
//         if (updateTimeoutRef.current) {
//           clearTimeout(updateTimeoutRef.current);
//         }
        
//         updateTimeoutRef.current = setTimeout(() => {
//           console.log('🔄 [CROSS-TAB] Triggering manual refresh...');
//           loadSubscription(true);
//         }, 1000);
//       }
//     };

//     window.addEventListener('storage', handleStorageEvent);

//     return () => {
//       console.log('🧹 [CROSS-TAB] Cleaning up listener');
//       window.removeEventListener('storage', handleStorageEvent);
//     };
//   }, [sellerId]);

//   // ═══════════════════════════════════════════════════════════════
//   // 3. WINDOW FOCUS DETECTION
//   // ═══════════════════════════════════════════════════════════════
  
//   useEffect(() => {
//     console.log('👁️ [FOCUS] Setting up focus listener');

//     const handleFocus = () => {
//       console.log('👁️ [FOCUS] Window focused - Checking updates...');
      
//       const lastScanEvent = localStorage.getItem('last_scan_timestamp');
//       const bannerLastChecked = lastChecked.toISOString();
      
//       if (lastScanEvent && new Date(lastScanEvent) > new Date(bannerLastChecked)) {
//         console.log('🔄 [FOCUS] New scan detected - Refreshing...');
//         loadSubscription(true);
//       } else {
//         console.log('✅ [FOCUS] No new scans');
//       }

//       setLastChecked(new Date());
//     };

//     window.addEventListener('focus', handleFocus);

//     return () => {
//       console.log('🧹 [FOCUS] Cleaning up listener');
//       window.removeEventListener('focus', handleFocus);
//     };
//   }, [sellerId, lastChecked]);

//   // ═══════════════════════════════════════════════════════════════
//   // 4. PAYMENT PROCESSING
//   // ═══════════════════════════════════════════════════════════════
  
//   useEffect(() => {
//     const checkPaymentProcessing = () => {
//       const flag = localStorage.getItem('payment_processing');
//       const isProcessing = flag === 'true';
      
//       if (isProcessing !== isPaymentProcessing) {
//         console.log('💳 [PAYMENT] Flag changed:', isProcessing);
//         setIsPaymentProcessing(isProcessing);
//       }
//     };

//     checkPaymentProcessing();
//     const interval = setInterval(checkPaymentProcessing, 500);

//     return () => clearInterval(interval);
//   }, [isPaymentProcessing]);

//   // ═══════════════════════════════════════════════════════════════
//   // 5. FORCE REFRESH PROP
//   // ═══════════════════════════════════════════════════════════════
  
//   useEffect(() => {
//     if (forceRefresh > 0) {
//       console.log('🔄 [FORCE] Force refresh triggered:', forceRefresh);
//       loadSubscription(true);
//     }
//   }, [forceRefresh]);

//   // ═══════════════════════════════════════════════════════════════
//   // 6. NOTIFY PARENT
//   // ═══════════════════════════════════════════════════════════════
  
//   useEffect(() => {
//     if (lastExpiredStateRef.current !== isExpired) {
//       console.log('🔔 [CALLBACK] Expiry changed:', {
//         was: lastExpiredStateRef.current,
//         now: isExpired
//       });
      
//       lastExpiredStateRef.current = isExpired;
      
//       if (onPlanStatusChangeRef.current) {
//         const isActive = !isExpired && !!subscription && subscription.status !== 'completed';
//         onPlanStatusChangeRef.current(isActive, isExpired);
//         console.log('📢 [CALLBACK] Parent notified:', { isActive, isExpired });
//       }
//     }
//   }, [isExpired, subscription]);

//   // ═══════════════════════════════════════════════════════════════
//   // 7. DISABLE WORKERS
//   // ═══════════════════════════════════════════════════════════════
  
//   useEffect(() => {
//     if (isPaymentProcessing) {
//       console.log('⏸️ [WORKER] Payment processing - Skip');
//       return;
//     }

//     if (hasDisabledWorkers || !isExpired || !subscription) {
//       return;
//     }

//     console.log('⏰ [WORKER] Plan expired - Scheduling disable (3s)...');
    
//     if (disableTimeoutRef.current) {
//       clearTimeout(disableTimeoutRef.current);
//     }

//     disableTimeoutRef.current = setTimeout(async () => {
//       if (isPaymentProcessing || hasDisabledWorkers) {
//         console.log('⏸️ [WORKER] Aborting');
//         return;
//       }

//       try {
//         const freshSub = await getSellerSubscription(sellerId, true);
//         if (!freshSub || !isSubscriptionExpired(freshSub)) {
//           console.log('✅ [WORKER] Now active - Abort');
//           return;
//         }

//         console.log('⚠️ [WORKER] Disabling...');
//         const result = await disableAllSellersWorkers(sellerId);
        
//         if (result.success && result.count > 0) {
//           console.log(`✅ [WORKER] Disabled ${result.count}`);
//           setHasDisabledWorkers(true);
//           showNotification('success', `🔒 ${result.count} worker(s) disabled.`);
//         }
//       } catch (error: any) {
//         console.error('❌ [WORKER] Error:', error);
//       }
//     }, 3000);

//     return () => {
//       if (disableTimeoutRef.current) {
//         clearTimeout(disableTimeoutRef.current);
//       }
//     };
//   }, [isExpired, subscription, sellerId, hasDisabledWorkers, isPaymentProcessing]);

//   // ═══════════════════════════════════════════════════════════════
//   // 8. TIMER UPDATE
//   // ═══════════════════════════════════════════════════════════════
  
//   useEffect(() => {
//     if (subscription && subscription.end_date) {
//       updateTimer();
//       const interval = setInterval(updateTimer, 3600000); // 1 hour
//       return () => clearInterval(interval);
//     }
//   }, [subscription]);

//   // ═══════════════════════════════════════════════════════════════
//   // 9. EXPIRY POPUP
//   // ═══════════════════════════════════════════════════════════════
  
//   useEffect(() => {
//     if (isExpired && subscription && !sessionStorage.getItem('expiry_popup_shown')) {
//       setShowExpiryPopup(true);
//       sessionStorage.setItem('expiry_popup_shown', 'true');
//     }
//   }, [isExpired, subscription]);

//   // ═══════════════════════════════════════════════════════════════
//   // 10. NOTIFICATION AUTO-HIDE
//   // ═══════════════════════════════════════════════════════════════
  
//   useEffect(() => {
//     if (notification.type) {
//       const timer = setTimeout(() => {
//         setNotification({ type: null, message: '' });
//       }, 5000);
//       return () => clearTimeout(timer);
//     }
//   }, [notification]);

//   // ═══════════════════════════════════════════════════════════════
//   // HELPER FUNCTIONS
//   // ═══════════════════════════════════════════════════════════════

//   const loadScanStats = async (sellerId: string) => {
//     try {
//       console.log('📊 [STATS] Loading...');
//       const stats = await getRemainingScanCount(sellerId);
//       console.log('📊 [STATS] Loaded:', stats);
//       setScanStats(stats);
//     } catch (error) {
//       console.error('❌ [STATS] Error:', error);
//       setScanStats(null);
//     }
//   };

//   const loadSubscription = useCallback(async (forceServerFetch: boolean = false) => {
//     if (isLoadingRef.current) {
//       console.log('⏭️ [LOAD] Already loading');
//       return;
//     }

//     try {
//       isLoadingRef.current = true;
//       setLoading(true);
      
//       console.log('🔍 [LOAD] Fetching (force:', forceServerFetch, ')');
//       const sub = await getSellerSubscription(sellerId, forceServerFetch);
      
//       if (sub) {
//         const changed = lastSubscriptionIdRef.current !== sub.id;
        
//         if (changed) {
//           console.log('🔄 [LOAD] Subscription changed:', {
//             old: lastSubscriptionIdRef.current,
//             new: sub.id
//           });
//           lastSubscriptionIdRef.current = sub.id;
//           setHasDisabledWorkers(false);
//           sessionStorage.removeItem('expiry_popup_shown');
//         }

//         const planData = await getPlanById(sub.plan_id);
//         const stats = await getRemainingScanCount(sellerId);
//         const timeExpired = isSubscriptionExpired(sub);
//         const statusCompleted = sub.status === 'completed';
//         const expired = timeExpired || statusCompleted;

//         setSubscription(sub);
//         setPlan(planData);
//         setScanStats(stats);
//         setIsExpired(expired);
//         setLastChecked(new Date());
        
//         if (!expired) {
//           sessionStorage.removeItem('expiry_popup_shown');
//           setHasDisabledWorkers(false);
//         }
        
//         console.log('✅ [LOAD] Loaded:', {
//           id: sub.id,
//           plan: planData?.plan_name,
//           expired
//         });
//       } else {
//         console.log('ℹ️ [LOAD] No subscription');
//         setSubscription(null);
//         setPlan(null);
//         setIsExpired(false);
//         setScanStats(null);
//         lastSubscriptionIdRef.current = null;
//       }
//     } catch (error) {
//       console.error('❌ [LOAD] Error:', error);
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
//       setTimeRemaining({ 
//         days: 0, 
//         hours: 0, 
//         minutes: 0, 
//         seconds: 0,
//         totalDays: 0 
//       });
//       if (!isExpired) {
//         console.log('⏰ [TIMER] Reached 0 - Expired');
//         setIsExpired(true);
//       }
//       return;
//     }

//     const totalDays = diffMs / (1000 * 60 * 60 * 24);
//     const days = Math.floor(totalDays);
//     const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
//     const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
//     const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);

//     setTimeRemaining({ days, hours, minutes, seconds, totalDays });
//   };

//   const getTimerDisplay = (): string => {
//     const { totalDays } = timeRemaining;
    
//     if (totalDays <= 0) {
//       return '0 days left';
//     }
    
//     const daysToShow = Math.ceil(totalDays);
    
//     if (daysToShow === 1) {
//       return '1 day left';
//     }
    
//     return `${daysToShow} days left`;
//   };

//   const getStatusColor = (): string => {
//     if (isExpired) return 'from-red-600 to-red-700';
    
//     const { totalDays } = timeRemaining;
    
//     if (totalDays < 1) return 'from-red-500 to-orange-600';
//     if (totalDays < 3) return 'from-orange-500 to-yellow-600';
//     if (totalDays < 7) return 'from-yellow-500 to-yellow-600';
//     if (totalDays < 30) return 'from-blue-500 to-blue-600';
    
//     return 'from-green-600 to-emerald-600';
//   };

//   const shouldPulse = (): boolean => {
//     const { totalDays } = timeRemaining;
//     return totalDays < 3 || isExpired;
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
//   // RENDER - LOADING STATE
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
//   // RENDER - NO SUBSCRIPTION
//   // ═══════════════════════════════════════════════════════════════
  
//   if (!subscription || !plan) {
//     return (
//       <div className="mb-4 sm:mb-6 p-4 sm:p-5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
//         <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
//           <div className="flex items-start gap-3 sm:gap-4 flex-1 min-w-0">
//             <div className="flex-shrink-0 p-2 bg-white bg-opacity-20 rounded-lg backdrop-blur-sm">
//               <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6" />
//             </div>
//             <div className="flex-1 min-w-0">
//               <h3 className="font-bold text-lg sm:text-xl mb-1">No Active Plan</h3>
//               <p className="text-sm sm:text-base text-purple-100 leading-relaxed">
//                 Subscribe to a plan to unlock all features and start growing your business!
//               </p>
//             </div>
//           </div>
          
//           <button
//             onClick={onViewPlans}
//             className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white text-purple-700 px-5 sm:px-6 py-3 sm:py-3.5 rounded-lg font-bold shadow-lg hover:shadow-xl hover:bg-purple-50 active:bg-white active:scale-95 transition-all transform hover:-translate-y-0.5 active:translate-y-0 text-sm sm:text-base border-2 border-white group"
//           >
//             <Eye className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform" />
//             <span>View Plans</span>
//           </button>
//         </div>
//       </div>
//     );
//   }

//   // ═══════════════════════════════════════════════════════════════
//   // RENDER - EXPIRED SUBSCRIPTION
//   // ═══════════════════════════════════════════════════════════════
  
//   if (isExpired) {
//     return (
//       <>
//         {notification.type && (
//           <div 
//             className={`mb-4 p-3 sm:p-4 rounded-xl shadow-lg transform transition-all duration-300 ${
//               notification.type === 'success' 
//                 ? 'bg-green-100 text-green-800 border-2 border-green-300' 
//                 : 'bg-red-100 text-red-800 border-2 border-red-300'
//             }`}
//           >
//             <div className="flex items-start justify-between gap-3">
//               <p className="text-sm sm:text-base flex-1 font-medium">{notification.message}</p>
//               <button 
//                 onClick={() => setNotification({ type: null, message: '' })}
//                 className="flex-shrink-0 hover:bg-black hover:bg-opacity-10 rounded-lg p-1 transition-colors"
//               >
//                 <X className="w-4 h-4" />
//               </button>
//             </div>
//           </div>
//         )}

//         <div className="mb-4 sm:mb-6 p-4 sm:p-5 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl shadow-lg animate-pulse">
//           <div className="flex flex-col gap-4">
//             <div className="flex items-start justify-between gap-3">
//               <div className="flex items-start gap-3 sm:gap-4 flex-1 min-w-0">
//                 <div className="flex-shrink-0 p-2 bg-white bg-opacity-20 rounded-lg backdrop-blur-sm">
//                   <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6" />
//                 </div>
//                 <div className="flex-1 min-w-0">
//                   <h3 className="font-bold text-lg sm:text-xl mb-1">❌ Plan Expired</h3>
//                   <p className="text-sm sm:text-base opacity-90 mb-1">{plan.plan_name}</p>
//                   <p className="text-xs sm:text-sm opacity-80">
//                     Expired: {formatDate(subscription.end_date)}
//                   </p>
//                 </div>
//               </div>
//               <button 
//                 onClick={() => loadSubscription(true)} 
//                 className="flex-shrink-0 p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-all active:scale-95"
//                 title="Refresh subscription status"
//               >
//                 <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5" />
//               </button>
//             </div>

//             <button
//               onClick={onViewPlans}
//               className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white text-red-700 px-5 sm:px-6 py-3 sm:py-3.5 rounded-lg font-bold shadow-xl hover:shadow-2xl hover:bg-red-50 active:bg-white active:scale-95 transition-all transform hover:-translate-y-1 active:translate-y-0 text-sm sm:text-base border-2 border-white group"
//             >
//               <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5 group-hover:rotate-180 transition-transform duration-500" />
//               <span>Renew Plan Now</span>
//             </button>
//           </div>
//         </div>
//       </>
//     );
//   }

//   // ═══════════════════════════════════════════════════════════════
//   // RENDER - ACTIVE SUBSCRIPTION
//   // ═══════════════════════════════════════════════════════════════
  
//   return (
//     <>
//       {notification.type && (
//         <div 
//           className={`mb-4 p-3 sm:p-4 rounded-xl shadow-lg transform transition-all duration-300 ${
//             notification.type === 'success' 
//               ? 'bg-green-100 text-green-800 border-2 border-green-300' 
//               : 'bg-red-100 text-red-800 border-2 border-red-300'
//           }`}
//         >
//           <div className="flex items-start justify-between gap-3">
//             <p className="text-sm sm:text-base flex-1 font-medium">{notification.message}</p>
//             <button 
//               onClick={() => setNotification({ type: null, message: '' })}
//               className="flex-shrink-0 hover:bg-black hover:bg-opacity-10 rounded-lg p-1 transition-colors"
//             >
//               <X className="w-4 h-4" />
//             </button>
//           </div>
//         </div>
//       )}

//       <div className={`mb-4 sm:mb-6 p-4 sm:p-5 bg-gradient-to-r ${getStatusColor()} text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 ${
//         shouldPulse() ? 'animate-pulse' : ''
//       }`}>
//         <div className="flex flex-col gap-4">
//           {/* Header Section */}
//           <div className="flex items-start justify-between gap-3">
//             <div className="flex items-start gap-3 sm:gap-4 flex-1 min-w-0">
//               <div className="flex-shrink-0 p-2 bg-white bg-opacity-20 rounded-lg backdrop-blur-sm">
//                 <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6" />
//               </div>
//               <div className="flex-1 min-w-0">
//                 <h3 className="font-bold text-lg sm:text-xl mb-1 truncate">
//                   ✅ {plan.plan_name}
//                 </h3>
//                 <p className="text-sm sm:text-base opacity-90">
//                   ₹{plan.price.toLocaleString('en-IN')}
//                 </p>
//               </div>
//             </div>
//             <button 
//               onClick={() => loadSubscription(true)} 
//               className="flex-shrink-0 p-2 hover:bg-white hover:bg-opacity-30 rounded-lg transition-all active:scale-95"
//               title="Refresh subscription status"
//             >
//               <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5" />
//             </button>
//           </div>

//           {/* Scan Count Section - REAL-TIME */}
//           {scanStats && !scanStats.unlimited && (
//             <div className="flex items-center gap-3 border-t border-white border-opacity-30 pt-4">
//               <div className="flex-shrink-0 p-2 bg-white bg-opacity-20 rounded-lg backdrop-blur-sm">
//                 <QrCode className="w-4 h-4 sm:w-5 sm:h-5" />
//               </div>
//               <div className="text-sm sm:text-base flex-1">
//                 <div className="flex items-center justify-between mb-1">
//                   <span className="font-medium">Scans:</span>
//                   <span className="font-mono font-bold text-base sm:text-lg">
//                     {scanStats.used} / {scanStats.total}
//                   </span>
//                 </div>
//                 {scanStats.limitReached ? (
//                   <div className="text-red-200 text-xs sm:text-sm font-semibold bg-red-900 bg-opacity-40 px-3 py-1.5 rounded-lg inline-block">
//                     ⚠️ Limit reached - Subscription expired
//                   </div>
//                 ) : scanStats.remaining > 0 ? (
//                   <div className={`text-xs sm:text-sm ${
//                     scanStats.remaining <= 2 ? 'text-yellow-200 font-semibold' : 'text-green-200'
//                   }`}>
//                     {scanStats.remaining} scan{scanStats.remaining !== 1 ? 's' : ''} remaining
//                     {scanStats.remaining <= 2 && ' ⚠️'}
//                   </div>
//                 ) : (
//                   <div className="text-red-200 text-xs sm:text-sm font-semibold bg-red-900 bg-opacity-40 px-3 py-1.5 rounded-lg inline-block">
//                     ⚠️ Last scan used
//                   </div>
//                 )}
//               </div>
//             </div>
//           )}

//           {scanStats && scanStats.unlimited && (
//             <div className="flex items-center gap-3 border-t border-white border-opacity-30 pt-4">
//               <div className="flex-shrink-0 p-2 bg-white bg-opacity-20 rounded-lg backdrop-blur-sm">
//                 <QrCode className="w-4 h-4 sm:w-5 sm:h-5" />
//               </div>
//               <div className="text-sm sm:text-base">
//                 Scans: <span className="font-mono font-bold text-base sm:text-lg">Unlimited ∞</span>
//                 {scanStats.used > 0 && (
//                   <span className="text-green-200 ml-2">({scanStats.used} used)</span>
//                 )}
//               </div>
//             </div>
//           )}

//           {/* Timer Section - DAYS ONLY */}
//           <div className="flex items-center gap-3 border-t border-white border-opacity-30 pt-4">
//             <div className="flex-shrink-0 p-2 bg-white bg-opacity-20 rounded-lg backdrop-blur-sm">
//               <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
//             </div>
//             <div className="text-sm sm:text-base">
//               <span className="font-medium">Time Remaining: </span>
//               <span className="font-bold text-base sm:text-lg ml-1">
//                 {getTimerDisplay()}
//               </span>
//             </div>
//           </div>

//           {/* Upgrade Button */}
//           <button
//             onClick={onViewPlans}
//             className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white bg-opacity-95 hover:bg-white text-gray-800 px-5 sm:px-6 py-3 sm:py-3.5 rounded-lg font-bold shadow-lg hover:shadow-xl active:shadow-md active:scale-95 transition-all transform hover:-translate-y-0.5 active:translate-y-0 text-sm sm:text-base backdrop-blur-sm border border-white border-opacity-50 group"
//           >
//             <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform" />
//             <span>Upgrade Plan</span>
//           </button>
//         </div>
//       </div>
//     </>
//   );
// };

// console.log('✅ PlanStatusBanner loaded - PRODUCTION v11.2 - HYBRID LISTENER (Active + Expired Support)'); 
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Clock, AlertTriangle, CheckCircle, RefreshCw, Eye, X, TrendingUp, QrCode } from 'lucide-react';
import { db } from '../lib/firebase';
import { collection, query, where, orderBy, limit, onSnapshot, doc } from 'firebase/firestore';
import { getSellerSubscription, isSubscriptionExpired, getRemainingScanCount } from '../lib/subscriptionService';
import { getPlanById } from '../lib/planService';
import { disableAllSellersWorkers } from '../lib/firebaseutils';
import type { Subscription } from '../types/payment.types';
import type { Plan } from '../types/plan.types';

// ═══════════════════════════════════════════════════════════════
// INTERFACE
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
  totalDays: number;
}

interface ScanStats {
  remaining: number;
  total: number;
  used: number;
  unlimited: boolean;
  limitReached: boolean;
}

// ═══════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════

export const PlanStatusBanner: React.FC<PlanStatusBannerProps> = ({
  sellerId,
  onViewPlans,
  forceRefresh = 0,
  onPlanStatusChange
}) => {
  // ═══════════════════════════════════════════════════════════════
  // STATE
  // ═══════════════════════════════════════════════════════════════
  
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [plan, setPlan] = useState<Plan | null>(null);
  const [hasDisabledWorkers, setHasDisabledWorkers] = useState(false);
  const [loading, setLoading] = useState(true);
  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    totalDays: 0
  });
  const [isExpired, setIsExpired] = useState(false);
  const [lastChecked, setLastChecked] = useState<Date>(new Date());
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
  
  const onPlanStatusChangeRef = useRef(onPlanStatusChange);
  
  useEffect(() => {
    onPlanStatusChangeRef.current = onPlanStatusChange;
  }, [onPlanStatusChange]);

  const updateTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isUpdatingRef = useRef(false);

  // ═══════════════════════════════════════════════════════════════
  // 1. REAL-TIME FIRESTORE LISTENER (HYBRID APPROACH)
  // ═══════════════════════════════════════════════════════════════
  // Add this AFTER all existing useEffects, BEFORE helper functions

// ═══════════════════════════════════════════════════════════════
// 10. DETECT PAYMENT SUCCESS FLAG
// ═══════════════════════════════════════════════════════════════

useEffect(() => {
  console.log('🎯 [FLAG] Setting up payment success detection...');

  const checkFlag = setInterval(() => {
    const flag = localStorage.getItem('plan_just_purchased');
    
    if (flag) {
      const timestamp = parseInt(flag);
      const now = Date.now();
      const elapsed = now - timestamp;
      
      console.log('═══════════════════════════════════════════════════════');
      console.log('🔔 [FLAG] PAYMENT SUCCESS FLAG DETECTED!');
      console.log('═══════════════════════════════════════════════════════');
      console.log('⏱️ Elapsed since payment:', elapsed, 'ms');
      console.log('🔄 Clearing cache & triggering force refresh...');
      
      // Clear flag
      localStorage.removeItem('plan_just_purchased');
      
      // ✅ CRITICAL: Clear cache BEFORE fetching new subscription
      clearSubscriptionCache(sellerId);
      console.log('🗑️ Subscription cache cleared');
      
      // Force refresh with fresh data
      loadSubscription(true);
      
      console.log('✅ [FLAG] Refresh triggered - Banner will update soon');
    }
  }, 1000); // Check every 1 second

  return () => {
    console.log('🧹 [FLAG] Cleaning up payment success detection');
    clearInterval(checkFlag);
  };
}, [sellerId]);

  useEffect(() => {
    if (!sellerId) return;

    console.log('🔥 [REAL-TIME] Setting up Firestore listeners for seller:', sellerId);

    let mounted = true;
    let currentDocListener: (() => void) | null = null;
    let queryListener: (() => void) | null = null;

    const setupListeners = async () => {
      try {
        setLoading(true);

        console.log('🔍 [REAL-TIME] Initial fetch...');
        const sub = await getSellerSubscription(sellerId, true);
        
        if (!sub || !sub.id) {
          console.log('ℹ️ [REAL-TIME] No subscription found');
          if (mounted) {
            setSubscription(null);
            setPlan(null);
            setIsExpired(false);
            setScanStats(null);
            setLoading(false);
          }
          return;
        }

        console.log('✅ [REAL-TIME] Initial subscription loaded:', sub.id, '- Status:', sub.status);
        
        const planData = await getPlanById(sub.plan_id);
        const stats = await getRemainingScanCount(sellerId);
        const expired = isSubscriptionExpired(sub);

        if (mounted) {
          setSubscription(sub);
          setPlan(planData);
          setScanStats(stats);
          setIsExpired(expired);
          setLastChecked(new Date());
          setLoading(false);
          lastSubscriptionIdRef.current = sub.id;

          if (!expired) {
            sessionStorage.removeItem('expiry_popup_shown');
            setHasDisabledWorkers(false);
          }

          console.log('✅ [REAL-TIME] Initial state set:', {
            id: sub.id,
            plan: planData?.plan_name,
            expired,
            status: sub.status
          });

          if (onPlanStatusChangeRef.current) {
            const isActive = !expired && sub.status !== 'completed';
            onPlanStatusChangeRef.current(isActive, expired);
            console.log('📢 [REAL-TIME] Initial parent notification:', { isActive, expired });
          }
        }

        // LISTENER 1: DOCUMENT LISTENER
        console.log('📍 [LISTENER 1] Setting up DOCUMENT listener for:', sub.id);

        currentDocListener = onSnapshot(
          doc(db, 'subscriptions', sub.id),
          async (snapshot: any) => {
            if (isUpdatingRef.current || !mounted) {
              console.log('⏭️ [DOC] Skipping update (busy or unmounted)');
              return;
            }

            isUpdatingRef.current = true;

            try {
              console.log('🔔 [DOC] Document listener fired!');

              if (!snapshot.exists()) {
                console.log('⚠️ [DOC] Subscription deleted');
                
                if (mounted) {
                  setSubscription(null);
                  setPlan(null);
                  setIsExpired(false);
                  setScanStats(null);
                  lastSubscriptionIdRef.current = null;
                  
                  if (onPlanStatusChangeRef.current) {
                    onPlanStatusChangeRef.current(false, false);
                  }
                }

                isUpdatingRef.current = false;
                return;
              }

              const data = {
                id: snapshot.id,
                ...snapshot.data()
              } as Subscription;

              console.log('📊 [DOC] Document updated:', {
                id: data.id,
                status: data.status,
                count: data.current_scan_count,
                limit: data.scan_limit
              });

              const planData = await getPlanById(data.plan_id);
              const stats = await getRemainingScanCount(sellerId);
              const timeExpired = isSubscriptionExpired(data);
              const statusCompleted = data.status === 'completed';
              const expired = timeExpired || statusCompleted;

              if (mounted) {
                setSubscription(data);
                setPlan(planData);
                setScanStats(stats);
                setIsExpired(expired);
                setLastChecked(new Date());

                console.log('✅ [DOC] State updated:', {
                  plan: planData?.plan_name,
                  expired,
                  status: data.status,
                  reason: expired ? (statusCompleted ? 'STATUS_COMPLETED' : 'TIME_EXPIRED') : 'ACTIVE'
                });

                if (onPlanStatusChangeRef.current) {
                  const isActive = !expired && data.status !== 'completed';
                  onPlanStatusChangeRef.current(isActive, expired);
                  console.log('📢 [DOC] Parent notified:', { 
                    isActive, 
                    expired,
                    status: data.status 
                  });
                }
              }

            } catch (error) {
              console.error('❌ [DOC] Update error:', error);
            } finally {
              isUpdatingRef.current = false;
            }
          },
          (error: any) => {
            console.error('❌ [DOC] Listener error:', error);
            isUpdatingRef.current = false;
          }
        );

        console.log('✅ [LISTENER 1] Document listener active');

        // LISTENER 2: QUERY LISTENER
        console.log('📍 [LISTENER 2] Setting up QUERY listener for NEW subscriptions...');

        const subscriptionsRef = collection(db, 'subscriptions');
        
        const q = query(
          subscriptionsRef,
          where('seller_id', '==', sellerId),
          orderBy('created_at', 'desc'),
          limit(1)
        );

        queryListener = onSnapshot(
          q,
          async (snapshot: any) => {
            if (isUpdatingRef.current || !mounted) {
              console.log('⏭️ [QUERY] Skipping update (busy or unmounted)');
              return;
            }

            if (snapshot.empty) {
              console.log('ℹ️ [QUERY] No subscriptions found');
              return;
            }

            const docSnap = snapshot.docs[0];
            const newSubId = docSnap.id;

            if (newSubId === lastSubscriptionIdRef.current) {
              console.log('⏭️ [QUERY] Same subscription, ignoring');
              return;
            }

            isUpdatingRef.current = true;

            try {
              console.log('🔔 [QUERY] NEW subscription detected!');
              console.log('🔄 [QUERY] PLAN CHANGED:', {
                old: lastSubscriptionIdRef.current,
                new: newSubId
              });

              const data = { 
                id: docSnap.id, 
                ...docSnap.data() 
              } as Subscription;

              lastSubscriptionIdRef.current = newSubId;

              if (mounted) {
                sessionStorage.removeItem('expiry_popup_shown');
                setHasDisabledWorkers(false);
              }

              const planData = await getPlanById(data.plan_id);
              const stats = await getRemainingScanCount(sellerId);
              const timeExpired = isSubscriptionExpired(data);
              const statusCompleted = data.status === 'completed';
              const expired = timeExpired || statusCompleted;

              if (mounted) {
                setSubscription(data);
                setPlan(planData);
                setScanStats(stats);
                setIsExpired(expired);
                setLastChecked(new Date());

                console.log('✅ [QUERY] Switched to new subscription:', {
                  id: data.id,
                  plan: planData?.plan_name,
                  expired,
                  status: data.status
                });

                if (onPlanStatusChangeRef.current) {
                  const isActive = !expired && data.status !== 'completed';
                  onPlanStatusChangeRef.current(isActive, expired);
                  console.log('📢 [QUERY] Parent notified:', { isActive, expired });
                }
              }

              if (currentDocListener) {
                console.log('🔄 [QUERY] Cleaning up old document listener');
                currentDocListener();
              }

              console.log('📍 [QUERY] Setting up NEW document listener for:', newSubId);

              currentDocListener = onSnapshot(
                doc(db, 'subscriptions', newSubId),
                async (snapshot: any) => {
                  if (isUpdatingRef.current || !mounted) return;
                  isUpdatingRef.current = true;

                  try {
                    if (!snapshot.exists()) {
                      if (mounted) {
                        setSubscription(null);
                        setPlan(null);
                        setIsExpired(false);
                        setScanStats(null);
                        lastSubscriptionIdRef.current = null;
                        
                        if (onPlanStatusChangeRef.current) {
                          onPlanStatusChangeRef.current(false, false);
                        }
                      }
                      isUpdatingRef.current = false;
                      return;
                    }

                    const data = {
                      id: snapshot.id,
                      ...snapshot.data()
                    } as Subscription;

                    console.log('📊 [NEW-DOC] Document updated:', {
                      id: data.id,
                      status: data.status,
                      count: data.current_scan_count
                    });

                    const planData = await getPlanById(data.plan_id);
                    const stats = await getRemainingScanCount(sellerId);
                    const timeExpired = isSubscriptionExpired(data);
                    const statusCompleted = data.status === 'completed';
                    const expired = timeExpired || statusCompleted;

                    if (mounted) {
                      setSubscription(data);
                      setPlan(planData);
                      setScanStats(stats);
                      setIsExpired(expired);
                      setLastChecked(new Date());

                      console.log('✅ [NEW-DOC] State updated:', {
                        plan: planData?.plan_name,
                        expired,
                        status: data.status
                      });

                      if (onPlanStatusChangeRef.current) {
                        const isActive = !expired && data.status !== 'completed';
                        onPlanStatusChangeRef.current(isActive, expired);
                        console.log('📢 [NEW-DOC] Parent notified:', { isActive, expired });
                      }
                    }

                  } catch (error) {
                    console.error('❌ [NEW-DOC] Update error:', error);
                  } finally {
                    isUpdatingRef.current = false;
                  }
                },
                (error: any) => {
                  console.error('❌ [NEW-DOC] Listener error:', error);
                  isUpdatingRef.current = false;
                }
              );

              console.log('✅ [QUERY] New document listener active');

            } catch (error) {
              console.error('❌ [QUERY] Update error:', error);
            } finally {
              isUpdatingRef.current = false;
            }
          },
          (error: any) => {
            console.error('❌ [QUERY] Listener error:', error);
            isUpdatingRef.current = false;
          }
        );

        console.log('✅ [LISTENER 2] Query listener active');
        console.log('🎯 [HYBRID] Both listeners running - Full coverage achieved');

      } catch (error) {
        console.error('❌ [REAL-TIME] Setup failed:', error);
        if (mounted) {
          setLoading(false);
        }
      }
    };

    setupListeners();

    return () => {
      mounted = false;
      
      console.log('🧹 [CLEANUP] Cleaning up all listeners');
      
      if (currentDocListener) {
        console.log('🧹 Cleaning up document listener');
        currentDocListener();
        currentDocListener = null;
      }
      
      if (queryListener) {
        console.log('🧹 Cleaning up query listener');
        queryListener();
        queryListener = null;
      }
      
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }
      
      isUpdatingRef.current = false;
      
      console.log('✅ [CLEANUP] All listeners cleaned up');
    };
  }, [sellerId]);

  // ═══════════════════════════════════════════════════════════════
  // 2. CROSS-TAB COMMUNICATION
  // ═══════════════════════════════════════════════════════════════
  
  useEffect(() => {
    console.log('📡 [CROSS-TAB] Setting up localStorage listener');

    const handleStorageEvent = (e: StorageEvent) => {
      if (e.key === 'scan_completed' || e.key === 'scan_limit_reached') {
        console.log('🔔 [CROSS-TAB] Scan event from another tab:', e.key);
        
        if (updateTimeoutRef.current) {
          clearTimeout(updateTimeoutRef.current);
        }
        
        updateTimeoutRef.current = setTimeout(() => {
          console.log('🔄 [CROSS-TAB] Triggering manual refresh...');
          loadSubscription(true);
        }, 1000);
      }
    };

    window.addEventListener('storage', handleStorageEvent);

    return () => {
      console.log('🧹 [CROSS-TAB] Cleaning up listener');
      window.removeEventListener('storage', handleStorageEvent);
    };
  }, [sellerId]);

  // ═══════════════════════════════════════════════════════════════
  // 3. WINDOW FOCUS DETECTION
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
  // 4. PAYMENT PROCESSING
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
  // 5. FORCE REFRESH PROP
  // ═══════════════════════════════════════════════════════════════
  
  useEffect(() => {
    if (forceRefresh > 0) {
      console.log('🔄 [FORCE] Force refresh triggered:', forceRefresh);
      loadSubscription(true);
    }
  }, [forceRefresh]);

  // ═══════════════════════════════════════════════════════════════
  // 6. NOTIFY PARENT
  // ═══════════════════════════════════════════════════════════════
  
  useEffect(() => {
    if (lastExpiredStateRef.current !== isExpired) {
      console.log('🔔 [CALLBACK] Expiry changed:', {
        was: lastExpiredStateRef.current,
        now: isExpired
      });
      
      lastExpiredStateRef.current = isExpired;
      
      if (onPlanStatusChangeRef.current) {
        const isActive = !isExpired && !!subscription && subscription.status !== 'completed';
        onPlanStatusChangeRef.current(isActive, isExpired);
        console.log('📢 [CALLBACK] Parent notified:', { isActive, isExpired });
      }
    }
  }, [isExpired, subscription]);

  // ═══════════════════════════════════════════════════════════════
  // 7. DISABLE WORKERS
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
  // 8. TIMER UPDATE
  // ═══════════════════════════════════════════════════════════════
  
  useEffect(() => {
    if (subscription && subscription.end_date) {
      updateTimer();
      const interval = setInterval(updateTimer, 3600000);
      return () => clearInterval(interval);
    }
  }, [subscription]);

  // ═══════════════════════════════════════════════════════════════
  // 9. NOTIFICATION AUTO-HIDE
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
  // HELPER FUNCTIONS
  // ═══════════════════════════════════════════════════════════════

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

        const planData = await getPlanById(sub.plan_id);
        const stats = await getRemainingScanCount(sellerId);
        const timeExpired = isSubscriptionExpired(sub);
        const statusCompleted = sub.status === 'completed';
        const expired = timeExpired || statusCompleted;

        setSubscription(sub);
        setPlan(planData);
        setScanStats(stats);
        setIsExpired(expired);
        setLastChecked(new Date());
        
        if (!expired) {
          sessionStorage.removeItem('expiry_popup_shown');
          setHasDisabledWorkers(false);
        }
        
        console.log('✅ [LOAD] Loaded:', {
          id: sub.id,
          plan: planData?.plan_name,
          expired
        });
      } else {
        console.log('ℹ️ [LOAD] No subscription');
        setSubscription(null);
        setPlan(null);
        setIsExpired(true);  // ✅ Changed from false to true
        setScanStats(null);
        lastSubscriptionIdRef.current = null;
        
        // ✅ CRITICAL: Notify parent that plan is expired/not found
        if (onPlanStatusChangeRef.current) {
          onPlanStatusChangeRef.current(false, true);  // isActive=false, expired=true
          console.log('📢 [LOAD] Parent notified: Plan expired (no subscription)');
        }
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
      setTimeRemaining({ 
        days: 0, 
        hours: 0, 
        minutes: 0, 
        seconds: 0,
        totalDays: 0 
      });
      if (!isExpired) {
        console.log('⏰ [TIMER] Reached 0 - Expired');
        setIsExpired(true);
      }
      return;
    }

    const totalDays = diffMs / (1000 * 60 * 60 * 24);
    const days = Math.floor(totalDays);
    const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);

    setTimeRemaining({ days, hours, minutes, seconds, totalDays });
  };

  const getTimerDisplay = (): string => {
    const { totalDays } = timeRemaining;
    
    if (totalDays <= 0) {
      return '0 days left';
    }
    
    const daysToShow = Math.ceil(totalDays);
    
    if (daysToShow === 1) {
      return '1 day left';
    }
    
    return `${daysToShow} days left`;
  };

  const getStatusColor = (): string => {
    if (isExpired) return 'from-red-600 to-red-700';
    
    const { totalDays } = timeRemaining;
    
    if (totalDays < 1) return 'from-red-500 to-orange-600';
    if (totalDays < 3) return 'from-orange-500 to-yellow-600';
    if (totalDays < 7) return 'from-yellow-500 to-yellow-600';
    if (totalDays < 30) return 'from-blue-500 to-blue-600';
    
    return 'from-green-600 to-emerald-600';
  };

  const shouldPulse = (): boolean => {
    const { totalDays } = timeRemaining;
    return totalDays < 3 || isExpired;
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
  // RENDER - LOADING STATE
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
  // RENDER - NO SUBSCRIPTION
  // ═══════════════════════════════════════════════════════════════
  
  if (!subscription || !plan) {
    return (
      <div className="mb-4 sm:mb-6 p-4 sm:p-5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3 sm:gap-4 flex-1 min-w-0">
            <div className="flex-shrink-0 p-2 bg-white bg-opacity-20 rounded-lg backdrop-blur-sm">
              <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-lg sm:text-xl mb-1">No Active Plan</h3>
              <p className="text-sm sm:text-base text-purple-100 leading-relaxed">
                Subscribe to a plan to unlock all features and start growing your business!
              </p>
            </div>
          </div>
          
          <button
            onClick={onViewPlans}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white text-purple-700 px-5 sm:px-6 py-3 sm:py-3.5 rounded-lg font-bold shadow-lg hover:shadow-xl hover:bg-purple-50 active:bg-white active:scale-95 transition-all transform hover:-translate-y-0.5 active:translate-y-0 text-sm sm:text-base border-2 border-white group"
          >
            <Eye className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform" />
            <span>View Plans</span>
          </button>
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════
  // RENDER - EXPIRED SUBSCRIPTION
  // ═══════════════════════════════════════════════════════════════
  
  if (isExpired) {
    return (
      <>
        {notification.type && (
          <div 
            className={`mb-4 p-3 sm:p-4 rounded-xl shadow-lg transform transition-all duration-300 ${
              notification.type === 'success' 
                ? 'bg-green-100 text-green-800 border-2 border-green-300' 
                : 'bg-red-100 text-red-800 border-2 border-red-300'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <p className="text-sm sm:text-base flex-1 font-medium">{notification.message}</p>
              <button 
                onClick={() => setNotification({ type: null, message: '' })}
                className="flex-shrink-0 hover:bg-black hover:bg-opacity-10 rounded-lg p-1 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        <div className="mb-4 sm:mb-6 p-4 sm:p-5 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl shadow-lg animate-pulse">
          <div className="flex flex-col gap-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3 sm:gap-4 flex-1 min-w-0">
                <div className="flex-shrink-0 p-2 bg-white bg-opacity-20 rounded-lg backdrop-blur-sm">
                  <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-lg sm:text-xl mb-1">❌ Plan Expired</h3>
                  <p className="text-sm sm:text-base opacity-90 mb-1">{plan.plan_name}</p>
                  <p className="text-xs sm:text-sm opacity-80">
                    Expired: {formatDate(subscription.end_date)}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => loadSubscription(true)} 
                className="flex-shrink-0 p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-all active:scale-95"
                title="Refresh subscription status"
              >
                <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>

            <button
              onClick={onViewPlans}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white text-red-700 px-5 sm:px-6 py-3 sm:py-3.5 rounded-lg font-bold shadow-xl hover:shadow-2xl hover:bg-red-50 active:bg-white active:scale-95 transition-all transform hover:-translate-y-1 active:translate-y-0 text-sm sm:text-base border-2 border-white group"
            >
              <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5 group-hover:rotate-180 transition-transform duration-500" />
              <span>Renew Plan Now</span>
            </button>
          </div>
        </div>
      </>
    );
  }

  // ═══════════════════════════════════════════════════════════════
  // RENDER - ACTIVE SUBSCRIPTION
  // ═══════════════════════════════════════════════════════════════
  
  return (
    <>
      {notification.type && (
        <div 
          className={`mb-4 p-3 sm:p-4 rounded-xl shadow-lg transform transition-all duration-300 ${
            notification.type === 'success' 
              ? 'bg-green-100 text-green-800 border-2 border-green-300' 
              : 'bg-red-100 text-red-800 border-2 border-red-300'
          }`}
        >
          <div className="flex items-start justify-between gap-3">
            <p className="text-sm sm:text-base flex-1 font-medium">{notification.message}</p>
            <button 
              onClick={() => setNotification({ type: null, message: '' })}
              className="flex-shrink-0 hover:bg-black hover:bg-opacity-10 rounded-lg p-1 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      <div className={`mb-4 sm:mb-6 p-4 sm:p-5 bg-gradient-to-r ${getStatusColor()} text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 ${
        shouldPulse() ? 'animate-pulse' : ''
      }`}>
        <div className="flex flex-col gap-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3 sm:gap-4 flex-1 min-w-0">
              <div className="flex-shrink-0 p-2 bg-white bg-opacity-20 rounded-lg backdrop-blur-sm">
                <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-lg sm:text-xl mb-1 truncate">
                  ✅ {plan.plan_name}
                </h3>
                <p className="text-sm sm:text-base opacity-90">
                  ₹{plan.price.toLocaleString('en-IN')}
                </p>
              </div>
            </div>
            <button 
              onClick={() => loadSubscription(true)} 
              className="flex-shrink-0 p-2 hover:bg-white hover:bg-opacity-30 rounded-lg transition-all active:scale-95"
              title="Refresh subscription status"
            >
              <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>

          {scanStats && !scanStats.unlimited && (
            <div className="flex items-center gap-3 border-t border-white border-opacity-30 pt-4">
              <div className="flex-shrink-0 p-2 bg-white bg-opacity-20 rounded-lg backdrop-blur-sm">
                <QrCode className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="text-sm sm:text-base flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium">Scans:</span>
                  <span className="font-mono font-bold text-base sm:text-lg">
                    {scanStats.used} / {scanStats.total}
                  </span>
                </div>
                {scanStats.limitReached ? (
                  <div className="text-red-200 text-xs sm:text-sm font-semibold bg-red-900 bg-opacity-40 px-3 py-1.5 rounded-lg inline-block">
                    ⚠️ Limit reached - Subscription expired
                  </div>
                ) : scanStats.remaining > 0 ? (
                  <div className={`text-xs sm:text-sm ${
                    scanStats.remaining <= 2 ? 'text-yellow-200 font-semibold' : 'text-green-200'
                  }`}>
                    {scanStats.remaining} scan{scanStats.remaining !== 1 ? 's' : ''} remaining
                    {scanStats.remaining <= 2 && ' ⚠️'}
                  </div>
                ) : (
                  <div className="text-red-200 text-xs sm:text-sm font-semibold bg-red-900 bg-opacity-40 px-3 py-1.5 rounded-lg inline-block">
                    ⚠️ Last scan used
                  </div>
                )}
              </div>
            </div>
          )}

          {scanStats && scanStats.unlimited && (
            <div className="flex items-center gap-3 border-t border-white border-opacity-30 pt-4">
              <div className="flex-shrink-0 p-2 bg-white bg-opacity-20 rounded-lg backdrop-blur-sm">
                <QrCode className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="text-sm sm:text-base">
                Scans: <span className="font-mono font-bold text-base sm:text-lg">Unlimited ∞</span>
                {scanStats.used > 0 && (
                  <span className="text-green-200 ml-2">({scanStats.used} used)</span>
                )}
              </div>
            </div>
          )}

          <div className="flex items-center gap-3 border-t border-white border-opacity-30 pt-4">
            <div className="flex-shrink-0 p-2 bg-white bg-opacity-20 rounded-lg backdrop-blur-sm">
              <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="text-sm sm:text-base">
              <span className="font-medium">Time Remaining: </span>
              <span className="font-bold text-base sm:text-lg ml-1">
                {getTimerDisplay()}
              </span>
            </div>
          </div>

          <button
            onClick={onViewPlans}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white bg-opacity-95 hover:bg-white text-gray-800 px-5 sm:px-6 py-3 sm:py-3.5 rounded-lg font-bold shadow-lg hover:shadow-xl active:shadow-md active:scale-95 transition-all transform hover:-translate-y-0.5 active:translate-y-0 text-sm sm:text-base backdrop-blur-sm border border-white border-opacity-50 group"
          >
            <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform" />
            <span>Upgrade Plan</span>
          </button>
        </div>
      </div>
    </>
  );
};

console.log('✅ PlanStatusBanner loaded - PRODUCTION v12.0 FINAL - ALL ERRORS FIXED');