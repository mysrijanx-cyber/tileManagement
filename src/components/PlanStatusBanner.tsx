
// console.log('✅ PlanStatusBanner loaded - PRODUCTION v9.1 - Complete & Verified'); 
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
    days: 0, hours: 0, minutes: 0, seconds: 0
  });
  const [isExpired, setIsExpired] = useState(false);
  const [showExpiryPopup, setShowExpiryPopup] = useState(false);
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
  const unsubscribeFirestoreRef = useRef<(() => void) | null>(null);

  // ═══════════════════════════════════════════════════════════════
  // 1. REAL-TIME FIRESTORE LISTENER
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
        console.log('📊 [REAL-TIME] Loading initial scan stats...');
        await loadScanStats(sellerId);

        const planData = await getPlanById(sub.plan_id);
        setPlan(planData);

        setSubscription(sub);
        const expired = isSubscriptionExpired(sub);
        setIsExpired(expired);
        setLastChecked(new Date());
        
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

        if (onPlanStatusChange) {
          const isActive = !expired && sub.status !== 'completed';
          onPlanStatusChange(isActive, expired);
          console.log('📢 [REAL-TIME] Initial parent notification:', { isActive, expired });
        }

        setLoading(false);

        console.log('📍 [REAL-TIME] Setting up listener on:', `subscriptions/${sub.id}`);

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

            setSubscription(data);
            setLastChecked(new Date());

            if (data.plan_id !== plan?.id) {
              const planData = await getPlanById(data.plan_id);
              setPlan(planData);
            }

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

            console.log('📊 [REAL-TIME] Reloading scan stats...');
            await loadScanStats(sellerId);

            console.log('✅ [REAL-TIME] State updated:', {
              expired,
              status: data.status
            });

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

    return () => {
      if (unsubscribeFirestoreRef.current) {
        console.log('🧹 [REAL-TIME] Cleaning up listener');
        unsubscribeFirestoreRef.current();
        unsubscribeFirestoreRef.current = null;
      }
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
        console.log('📊 [CROSS-TAB] Event data:', e.newValue);

        setTimeout(() => {
          console.log('🔄 [CROSS-TAB] Triggering manual refresh...');
          loadSubscription(true);
        }, 500);
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
      
      if (onPlanStatusChange) {
        const isActive = !isExpired && !!subscription && subscription.status !== 'completed';
        onPlanStatusChange(isActive, isExpired);
        console.log('📢 [CALLBACK] Parent notified:', { isActive, isExpired });
      }
    }
  }, [isExpired, subscription, onPlanStatusChange]);

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
      const interval = setInterval(updateTimer, 1000);
      return () => clearInterval(interval);
    }
  }, [subscription]);

  // ═══════════════════════════════════════════════════════════════
  // 9. EXPIRY POPUP
  // ═══════════════════════════════════════════════════════════════
  
  useEffect(() => {
    if (isExpired && subscription && !sessionStorage.getItem('expiry_popup_shown')) {
      setShowExpiryPopup(true);
      sessionStorage.setItem('expiry_popup_shown', 'true');
    }
  }, [isExpired, subscription]);

  // ═══════════════════════════════════════════════════════════════
  // 10. NOTIFICATION AUTO-HIDE
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
          
          {/* ✅ PROFESSIONAL HIGHLIGHTED BUTTON */}
          <button
            onClick={onViewPlans}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white text-purple-700 px-4 sm:px-5 py-2.5 sm:py-3 rounded-lg font-bold shadow-lg hover:shadow-xl hover:bg-purple-50 active:bg-white transition-all transform hover:-translate-y-0.5 active:translate-y-0 text-sm sm:text-base border-2 border-white"
          >
            <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
            View Plans
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

            {/* ✅ PROFESSIONAL HIGHLIGHTED BUTTON - EXPIRED STATE */}
            <button
              onClick={onViewPlans}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white text-red-700 px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-bold shadow-xl hover:shadow-2xl hover:bg-red-50 active:bg-white transition-all transform hover:-translate-y-1 active:translate-y-0 text-sm sm:text-base border-2 border-white"
            >
              <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5" />
              Renew Plan Now
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
              className="p-2 hover:bg-white hover:bg-opacity-30 rounded-lg transition-all flex-shrink-0 active:scale-95"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

          {/* Scan Count - REAL-TIME */}
          {scanStats && !scanStats.unlimited && (
            <div className="flex items-center gap-2 border-t border-white border-opacity-30 pt-3 mt-3">
              <QrCode className="w-4 h-4 flex-shrink-0" />
              <div className="text-xs sm:text-sm flex-1">
                <div className="flex items-center justify-between">
                  <span>Scans:</span>
                  <span className="font-mono font-bold">
                    {scanStats.used} / {scanStats.total}
                  </span>
                </div>
                {scanStats.limitReached ? (
                  <div className="text-red-200 text-xs mt-1 font-semibold bg-red-900 bg-opacity-40 px-2 py-1 rounded">
                    ⚠️ Limit reached - Subscription expired
                  </div>
                ) : scanStats.remaining > 0 ? (
                  <div className={`text-xs mt-1 ${
                    scanStats.remaining <= 2 ? 'text-yellow-200' : 'text-green-200'
                  }`}>
                    {scanStats.remaining} scan{scanStats.remaining !== 1 ? 's' : ''} remaining
                  </div>
                ) : (
                  <div className="text-red-200 text-xs mt-1 font-semibold bg-red-900 bg-opacity-40 px-2 py-1 rounded">
                    ⚠️ Last scan used
                  </div>
                )}
              </div>
            </div>
          )}

          {scanStats && scanStats.unlimited && (
            <div className="flex items-center gap-2 border-t border-white border-opacity-30 pt-3 mt-3">
              <QrCode className="w-4 h-4 flex-shrink-0" />
              <div className="text-xs sm:text-sm">
                Scans: <span className="font-mono font-bold">Unlimited ∞</span>
                {scanStats.used > 0 && (
                  <span className="text-green-200 ml-2">({scanStats.used} used)</span>
                )}
              </div>
            </div>
          )}

          {/* Timer */}
          <div className="flex items-center gap-2 border-t border-white border-opacity-30 pt-3">
            <Clock className="w-4 h-4 flex-shrink-0" />
            <div className="text-xs sm:text-sm">
              Time Left: <span className="font-mono font-bold">{getTimerDisplay()}</span>
            </div>
          </div>

          {/* ✅ PROFESSIONAL HIGHLIGHTED BUTTON - ACTIVE STATE */}
          <button
            onClick={onViewPlans}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white bg-opacity-90 hover:bg-white text-gray-800 px-4 sm:px-5 py-2.5 sm:py-3 rounded-lg font-bold shadow-lg hover:shadow-xl active:shadow-md transition-all transform hover:-translate-y-0.5 active:translate-y-0 text-sm sm:text-base backdrop-blur-sm border border-white border-opacity-50"
          >
            <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" />
            Upgrade Plan
          </button>
        </div>
      </div>
    </>
  );
};

// console.log('✅ PlanStatusBanner loaded - PRODUCTION v10.0 - Professional Highlighted Buttons'); 
// console.log('✅ PlanStatusBanner loaded - PRODUCTION v10.1 - Days Only Timer');
// import React, { useState, useEffect, useRef, useCallback } from 'react';
// import { Clock, AlertTriangle, CheckCircle, RefreshCw, Eye, X, TrendingUp, QrCode } from 'lucide-react';
// import { db } from '../lib/firebase';
// import { doc, onSnapshot } from 'firebase/firestore';
// import { getSellerSubscription, isSubscriptionExpired } from '../lib/subscriptionService';
// import { getPlanById } from '../lib/planService';
// import { disableAllSellersWorkers } from '../lib/firebaseutils';
// import { getRemainingScanCount } from '../lib/subscriptionService';
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
//   totalDays: number; // For precise days calculation
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

//   // ═══════════════════════════════════════════════════════════════
//   // 1. REAL-TIME FIRESTORE LISTENER
//   // ═══════════════════════════════════════════════════════════════
  
//   useEffect(() => {
//     if (!sellerId) return;

//     console.log('🔥 [REAL-TIME] Setting up Firestore listener for seller:', sellerId);

//     const setupListener = async () => {
//       try {
//         setLoading(true);
        
//         console.log('🔍 [REAL-TIME] Initial fetch...');
//         const sub = await getSellerSubscription(sellerId, true);
        
//         if (!sub || !sub.id) {
//           console.log('ℹ️ [REAL-TIME] No subscription found');
//           setSubscription(null);
//           setPlan(null);
//           setIsExpired(false);
//           setScanStats(null);
//           setLoading(false);
//           return;
//         }

//         console.log('✅ [REAL-TIME] Initial subscription loaded:', sub.id);
//         console.log('📊 [REAL-TIME] Loading initial scan stats...');
//         await loadScanStats(sellerId);

//         const planData = await getPlanById(sub.plan_id);
//         setPlan(planData);

//         setSubscription(sub);
//         const expired = isSubscriptionExpired(sub);
//         setIsExpired(expired);
//         setLastChecked(new Date());
        
//         if (!expired) {
//           sessionStorage.removeItem('expiry_popup_shown');
//           setHasDisabledWorkers(false);
//         }

//         console.log('✅ [REAL-TIME] Initial state set:', {
//           id: sub.id,
//           plan: planData?.plan_name,
//           expired,
//           count: sub.current_scan_count
//         });

//         if (onPlanStatusChange) {
//           const isActive = !expired && sub.status !== 'completed';
//           onPlanStatusChange(isActive, expired);
//           console.log('📢 [REAL-TIME] Initial parent notification:', { isActive, expired });
//         }

//         setLoading(false);

//         console.log('📍 [REAL-TIME] Setting up listener on:', `subscriptions/${sub.id}`);

//         const unsubscribe = onSnapshot(
//           doc(db, 'subscriptions', sub.id),
//           async (snapshot) => {
//             console.log('🔔 [REAL-TIME] Firestore update detected!');
            
//             if (!snapshot.exists()) {
//               console.log('⚠️ [REAL-TIME] Subscription deleted');
//               setSubscription(null);
//               setPlan(null);
//               setIsExpired(false);
//               setScanStats(null);
//               return;
//             }

//             const data = snapshot.data() as Subscription;
//             console.log('📊 [REAL-TIME] Updated data:', {
//               id: data.id,
//               status: data.status,
//               count: data.current_scan_count,
//               limit: data.scan_limit
//             });

//             setSubscription(data);
//             setLastChecked(new Date());

//             if (data.plan_id !== plan?.id) {
//               const planData = await getPlanById(data.plan_id);
//               setPlan(planData);
//             }

//             const timeExpired = isSubscriptionExpired(data);
//             const statusCompleted = data.status === 'completed';
//             const expired = timeExpired || statusCompleted;
            
//             setIsExpired(expired);

//             console.log('🔍 [REAL-TIME] Expiry check:', {
//               timeExpired,
//               statusCompleted,
//               finalExpired: expired,
//               reason: expired ? (timeExpired ? 'TIME_EXPIRED' : 'SCAN_LIMIT_REACHED') : 'ACTIVE'
//             });

//             console.log('📊 [REAL-TIME] Reloading scan stats...');
//             await loadScanStats(sellerId);

//             console.log('✅ [REAL-TIME] State updated:', {
//               expired,
//               status: data.status
//             });

//             if (onPlanStatusChange) {
//               const isActive = !expired && data.status !== 'completed';
//               onPlanStatusChange(isActive, expired);
//               console.log('📢 [REAL-TIME] Parent notified:', { 
//                 isActive, 
//                 expired,
//                 reason: !isActive ? (expired ? 'EXPIRED' : 'STATUS_NOT_ACTIVE') : 'ACTIVE'
//               });
//             }
//           },
//           (error) => {
//             console.error('❌ [REAL-TIME] Listener error:', error);
//           }
//         );

//         unsubscribeFirestoreRef.current = unsubscribe;
//         console.log('✅ [REAL-TIME] Listener active');

//       } catch (error) {
//         console.error('❌ [REAL-TIME] Setup failed:', error);
//         setLoading(false);
//       }
//     };

//     setupListener();

//     return () => {
//       if (unsubscribeFirestoreRef.current) {
//         console.log('🧹 [REAL-TIME] Cleaning up listener');
//         unsubscribeFirestoreRef.current();
//         unsubscribeFirestoreRef.current = null;
//       }
//     };
//   }, [sellerId]);

//   // ═══════════════════════════════════════════════════════════════
//   // 2. CROSS-TAB COMMUNICATION
//   // ═══════════════════════════════════════════════════════════════
  
//   useEffect(() => {
//     console.log('📡 [CROSS-TAB] Setting up localStorage listener');

//     const handleStorageEvent = (e: StorageEvent) => {
//       if (e.key === 'scan_completed' || e.key === 'scan_limit_reached') {
//         console.log('🔔 [CROSS-TAB] Scan event from another tab:', e.key);
//         console.log('📊 [CROSS-TAB] Event data:', e.newValue);

//         setTimeout(() => {
//           console.log('🔄 [CROSS-TAB] Triggering manual refresh...');
//           loadSubscription(true);
//         }, 500);
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
      
//       if (onPlanStatusChange) {
//         const isActive = !isExpired && !!subscription && subscription.status !== 'completed';
//         onPlanStatusChange(isActive, isExpired);
//         console.log('📢 [CALLBACK] Parent notified:', { isActive, isExpired });
//       }
//     }
//   }, [isExpired, subscription, onPlanStatusChange]);

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
//   // 8. TIMER UPDATE - Updates every hour for performance
//   // ═══════════════════════════════════════════════════════════════
  
//   useEffect(() => {
//     if (subscription && subscription.end_date) {
//       updateTimer();
//       // Update every hour since we only show days
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

//         setSubscription(sub);
//         await loadScanStats(sellerId);
        
//         const planData = await getPlanById(sub.plan_id);
//         setPlan(planData);
        
//         const timeExpired = isSubscriptionExpired(sub);
//         const statusCompleted = sub.status === 'completed';
//         const expired = timeExpired || statusCompleted;
        
//         setIsExpired(expired);
        
//         if (!expired) {
//           sessionStorage.removeItem('expiry_popup_shown');
//           setHasDisabledWorkers(false);
//         }
        
//         setLastChecked(new Date());
        
//         console.log('✅ [LOAD] Loaded:', {
//           id: sub.id,
//           plan: planData?.plan_name,
//           expired,
//           timeExpired,
//           statusCompleted,
//           reason: expired ? (timeExpired ? 'TIME' : 'SCAN_LIMIT') : 'ACTIVE',
//           count: sub.current_scan_count
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

//     // Calculate precise total days (including decimal)
//     const totalDays = diffMs / (1000 * 60 * 60 * 24);
//     const days = Math.floor(totalDays);
//     const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
//     const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
//     const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);

//     setTimeRemaining({ days, hours, minutes, seconds, totalDays });
//   };

//   // ✅ NEW: Simple days-only display
//   const getTimerDisplay = (): string => {
//     const { totalDays } = timeRemaining;
    
//     if (totalDays <= 0) {
//       return '0 days left';
//     }
    
//     // Round to nearest day for cleaner display
//     const daysToShow = Math.ceil(totalDays);
    
//     if (daysToShow === 1) {
//       return '1 day left';
//     }
    
//     return `${daysToShow} days left`;
//   };

//   // ✅ UPDATED: Color coding based on days
//   const getStatusColor = (): string => {
//     if (isExpired) return 'from-red-600 to-red-700';
    
//     const { totalDays } = timeRemaining;
    
//     if (totalDays < 1) return 'from-red-500 to-orange-600';      // Less than 1 day
//     if (totalDays < 3) return 'from-orange-500 to-yellow-600';   // Less than 3 days
//     if (totalDays < 7) return 'from-yellow-500 to-yellow-600';   // Less than 7 days
//     if (totalDays < 30) return 'from-blue-500 to-blue-600';      // Less than 30 days
    
//     return 'from-green-600 to-emerald-600';                       // 30+ days
//   };

//   // ✅ UPDATED: Pulse animation for critical time
//   const shouldPulse = (): boolean => {
//     const { totalDays } = timeRemaining;
//     return totalDays < 3 || isExpired; // Pulse if less than 3 days or expired
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

// console.log('✅ PlanStatusBanner loaded - PRODUCTION v10.1 - Days Only Timer Display');