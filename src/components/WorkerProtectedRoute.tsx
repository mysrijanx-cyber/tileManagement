
import React, { useEffect, useState, useRef } from 'react';
import { Navigate } from 'react-router-dom';
import { useAppStore } from '../stores/appStore';
import { AlertCircle, Loader, Shield, XCircle, RefreshCw } from 'lucide-react';
import { getSellerSubscription, isSubscriptionExpired, getRemainingScanCount } from '../lib/subscriptionService';
import { auth, db } from '../lib/firebase';
import { collection, query, where, getDocs, limit, onSnapshot } from 'firebase/firestore';

interface WorkerProtectedRouteProps {
  children: React.ReactNode;
}

export const WorkerProtectedRoute: React.FC<WorkerProtectedRouteProps> = ({ children }) => {
  const { currentUser, isAuthenticated } = useAppStore();
  
  const [sellerPlanActive, setSellerPlanActive] = useState<boolean | null>(null);
  const [checkingPlan, setCheckingPlan] = useState(true);
  const [fetchedSellerId, setFetchedSellerId] = useState<string | null>(null);
  const [fetchingSellerInfo, setFetchingSellerInfo] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [realtimeConnected, setRealtimeConnected] = useState(false);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);
  const [planDetails, setPlanDetails] = useState<string>('');
  const [manualChecking, setManualChecking] = useState(false);
  
  const [scanLimitReached, setScanLimitReached] = useState(false);
  const [expiryReason, setExpiryReason] = useState<'date' | 'scan_limit' | 'both' | null>(null);
  
  const unsubscribeRef = useRef<(() => void) | null>(null);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const mountedRef = useRef(true);

  // ═══════════════════════════════════════════════════════════════
  // FETCH WORKER'S SELLER ID
  // ═══════════════════════════════════════════════════════════════
  
  const fetchWorkerSellerInfo = async () => {
    try {
      console.log('🔍 [Worker] Fetching seller ID...');
      setFetchingSellerInfo(true);
      setFetchError(null);

      if (!currentUser || !currentUser.user_id) {
        throw new Error('No user ID');
      }

      const cacheKey = `worker_seller_id_${currentUser.user_id}`;
      const cachedSellerId = sessionStorage.getItem(cacheKey);

      if (cachedSellerId?.trim()) {
        console.log('✅ [Cache] seller_id:', cachedSellerId);
        setFetchedSellerId(cachedSellerId);
        setFetchingSellerInfo(false);
        return;
      }

      const usersRef = collection(db, 'users');
      const q = query(
        usersRef,
        where('user_id', '==', currentUser.user_id),
        limit(1)
      );

      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        throw new Error('Worker not found');
      }

      const workerData = snapshot.docs[0].data();

      const sellerId = 
        workerData.seller_id || 
        workerData.created_by || 
        workerData.sellerId;

      if (!sellerId) {
        throw new Error('Missing seller_id');
      }

      console.log('✅ [Firestore] seller_id:', sellerId);
      sessionStorage.setItem(cacheKey, sellerId);

      setFetchedSellerId(sellerId);
      setFetchingSellerInfo(false);

    } catch (error: any) {
      console.error('❌ [Error]:', error);
      setFetchError(error.message);
      setFetchingSellerInfo(false);
    }
  };

  // ═══════════════════════════════════════════════════════════════
  // CHECK SELLER PLAN (DATE + SCAN LIMIT)
  // ═══════════════════════════════════════════════════════════════
  
  const checkSellerPlan = async (sellerId: string, source: string = 'unknown'): Promise<boolean> => {
    try {
      console.log(`🔍 [${source}] Checking seller plan:`, sellerId);
      
      const subscription = await getSellerSubscription(sellerId, true);
      
      if (!subscription) {
        console.log('❌ No subscription found');
        setPlanDetails('No subscription');
        setScanLimitReached(false);
        setExpiryReason(null);
        return false;
      }
      
      const dateExpired = isSubscriptionExpired(subscription);
      
      let scanLimitExceeded = false;
      let scanStats = null;
      
      try {
        scanStats = await getRemainingScanCount(sellerId);
        scanLimitExceeded = scanStats.limitReached
        
        console.log('📊 Scan stats:', {
          unlimited: scanStats.unlimited,
          used: scanStats.used,
          total: scanStats.total,
          remaining: scanStats.remaining,
          limitReached: scanStats.limitReached,
          scanLimitExceeded
        });
        
      } catch (scanError) {
        console.warn('⚠️ Could not check scan limits:', scanError);
        scanLimitExceeded = false;
      }
      
      const isActive = !dateExpired && !scanLimitExceeded;
      
      const daysLeft = subscription.end_date 
        ? Math.ceil((new Date(subscription.end_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
        : 0;
      
      let detailText = `${subscription.plan_name}`;
      
      if (isActive) {
        detailText += ` (${daysLeft}d)`;
      } else {
        detailText += ' (Expired)';
      }
      
      if (scanStats && !scanStats.unlimited) {
        detailText += ` • ${scanStats.used}/${scanStats.total} scans`;
      } else if (scanStats && scanStats.unlimited) {
        detailText += ` • Unlimited scans`;
      }
      
      setPlanDetails(detailText);
      setScanLimitReached(scanLimitExceeded);
      
      if (dateExpired && scanLimitExceeded) {
        setExpiryReason('both');
      } else if (scanLimitExceeded) {
        setExpiryReason('scan_limit');
      } else if (dateExpired) {
        setExpiryReason('date');
      } else {
        setExpiryReason(null);
      }
      
      console.log(`📊 [${source}] Plan Check Result:`, {
        dateExpired,
        scanLimitExceeded,
        isActive,
        daysLeft,
        expiryReason: dateExpired && scanLimitExceeded ? 'both' : 
                      scanLimitExceeded ? 'scan_limit' : 
                      dateExpired ? 'date' : 'none'
      });
      
      return isActive;
      
    } catch (error: any) {
      console.error(`❌ [${source}] Plan check failed:`, error);
      return false;
    }
  };

  // ═══════════════════════════════════════════════════════════════
  // MANUAL REFRESH
  // ═══════════════════════════════════════════════════════════════
  
  const handleManualRefresh = async () => {
    if (!fetchedSellerId || manualChecking) return;
    
    setManualChecking(true);
    
    try {
      console.log('🔄 Manual refresh triggered...');
      const isActive = await checkSellerPlan(fetchedSellerId, 'Manual');
      
      setSellerPlanActive(isActive);
      setLastChecked(new Date());
      
      if (isActive) {
        alert('✅ Plan is now active! Reloading...');
        setTimeout(() => window.location.reload(), 500);
      } else {
        if (expiryReason === 'scan_limit') {
          alert('⚠️ Plan still inactive\n\nReason: Scan limit reached\n\nAsk seller to upgrade plan.');
        } else if (expiryReason === 'date') {
          alert('⚠️ Plan still inactive\n\nReason: Date expired\n\nAsk seller to renew plan.');
        } else if (expiryReason === 'both') {
          alert('⚠️ Plan still inactive\n\nReason: Date expired AND scan limit reached\n\nAsk seller to upgrade plan.');
        } else {
          alert('⚠️ Plan still inactive');
        }
      }
      
    } catch (error) {
      console.error('❌ Manual refresh failed:', error);
      alert('❌ Check failed. Please try again.');
    } finally {
      setManualChecking(false);
    }
  };

  // ═══════════════════════════════════════════════════════════════
  // FORCE LOGOUT
  // ═══════════════════════════════════════════════════════════════
  
  const handleForceLogout = async (reason: string) => {
    try {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
        unsubscribeRef.current = null;
      }
      
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }

      await auth.signOut();
      localStorage.clear();
      sessionStorage.clear();

      alert(`🚫 ${reason}\n\nYou have been logged out.`);
      window.location.href = '/';

    } catch (error) {
      console.error('❌ Logout error:', error);
      window.location.href = '/';
    }
  };

  // ═══════════════════════════════════════════════════════════════
  // EFFECT: FETCH SELLER INFO
  // ═══════════════════════════════════════════════════════════════
  
  useEffect(() => {
    mountedRef.current = true;

    if (!currentUser || currentUser.role !== 'worker') {
      setFetchingSellerInfo(false);
      return;
    }

    fetchWorkerSellerInfo();

    return () => {
      mountedRef.current = false;
    };
  }, [currentUser]);

  // ═══════════════════════════════════════════════════════════════
  // ✅ EFFECT: CHECK PLAN + REALTIME MONITORING (FIXED)
  // ═══════════════════════════════════════════════════════════════
  
  useEffect(() => {
    if (currentUser?.role === 'worker' && fetchingSellerInfo) {
      return;
    }

    if (!currentUser || currentUser.role !== 'worker') {
      setCheckingPlan(false);
      return;
    }

    if (fetchError) {
      setSellerPlanActive(false);
      setCheckingPlan(false);
      return;
    }

    const sellerId = fetchedSellerId;
    
    if (!sellerId) {
      setSellerPlanActive(false);
      setCheckingPlan(false);
      return;
    }

    const initialCheck = async () => {
      try {
        const isActive = await checkSellerPlan(sellerId, 'Initial');
        
        if (!mountedRef.current) return;

        setSellerPlanActive(isActive);
        setLastChecked(new Date());
        setCheckingPlan(false);

      } catch (error: any) {
        if (mountedRef.current) {
          setSellerPlanActive(false);
          setCheckingPlan(false);
        }
      }
    };

    initialCheck();

    try {
      const subscriptionsRef = collection(db, 'subscriptions');
      const q = query(
        subscriptionsRef,
        where('seller_id', '==', sellerId),
        where('status', '==', 'active')
      );

      const unsubscribe = onSnapshot(
        q,
        
        async (snapshot) => {
          if (!mountedRef.current) return;

          console.log('🔔 Realtime subscription change detected');

          const isActive = await checkSellerPlan(sellerId, 'Realtime');
          
          if (!mountedRef.current) return;

          const wasActive = sellerPlanActive === true;
          const wasInactive = sellerPlanActive === false;
          
          setSellerPlanActive(isActive);
          setLastChecked(new Date());
          setRealtimeConnected(true);

          // ✅ FIX: Only reload if plan was inactive and now active (renewal)
          if (wasInactive && isActive) {
            console.log('✅ Plan renewed - Reloading page');
            alert('✅ Plan activated! Reloading...');
            setTimeout(() => window.location.reload(), 1000);
          }
          
          // ✅ FIX: If plan becomes inactive, just update state (NO LOGOUT)
          // Worker will be blocked on NEXT scan attempt, not immediately
          if (wasActive && !isActive) {
            console.log('⚠️ Plan became inactive - Worker will be blocked on next scan');
            // Just update state - don't logout
            // Worker can finish current scan
            // They'll see blocked screen when they try to scan again or refresh
          }
        },
        
        (error) => {
          console.warn('⚠️ Realtime listener error:', error);
          
          if (mountedRef.current) {
            setRealtimeConnected(false);
            
            if (!pollingIntervalRef.current) {
              console.log('📡 Starting polling fallback...');
              
              pollingIntervalRef.current = setInterval(async () => {
                if (!mountedRef.current) return;

                try {
                  const isActive = await checkSellerPlan(sellerId, 'Polling');
                  
                  if (!mountedRef.current) return;

                  const wasInactive = sellerPlanActive === false;

                  setSellerPlanActive(isActive);
                  setLastChecked(new Date());

                  // ✅ Only reload on renewal
                  if (wasInactive && isActive) {
                    alert('✅ Plan activated! Reloading...');
                    window.location.reload();
                  }
                  
                  // ✅ Don't logout on expiry - just update state

                } catch (error) {
                  console.error('❌ Polling error:', error);
                }
              }, 30000);
            }
          }
        }
      );

      unsubscribeRef.current = unsubscribe;
      setRealtimeConnected(true);

    } catch (error) {
      console.warn('⚠️ Could not setup realtime listener:', error);
      setRealtimeConnected(false);
    }

    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
        unsubscribeRef.current = null;
      }
      
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }
    };

  }, [currentUser, isAuthenticated, fetchedSellerId, fetchingSellerInfo, fetchError, sellerPlanActive]);

  // ═══════════════════════════════════════════════════════════════
  // RENDER: LOADING SELLER INFO
  // ═══════════════════════════════════════════════════════════════
  
  if (currentUser?.role === 'worker' && fetchingSellerInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
        <div className="text-center max-w-md w-full bg-white rounded-xl shadow-lg p-8">
          <Loader className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-base text-gray-600">Verifying worker access...</p>
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════
  // RENDER: FETCH ERROR
  // ═══════════════════════════════════════════════════════════════
  
  if (currentUser?.role === 'worker' && fetchError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50 px-4">
        <div className="text-center max-w-md w-full bg-white rounded-xl shadow-2xl p-8 border-2 border-red-200">
          <AlertCircle className="w-20 h-20 text-red-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Configuration Error</h2>
          <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-red-900">{fetchError}</p>
          </div>
          <button 
            onClick={() => handleForceLogout('Configuration error')}
            className="w-full px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold"
          >
            Logout
          </button>
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════
  // RENDER: CHECKING PLAN
  // ═══════════════════════════════════════════════════════════════
  
  if (currentUser === undefined || checkingPlan) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
        <div className="text-center">
          <Loader className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-base text-gray-600 mb-2">Verifying plan access...</p>
          {realtimeConnected && (
            <p className="text-xs text-green-600 mt-2 flex items-center justify-center gap-1">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              Live monitoring active
            </p>
          )}
          {planDetails && (
            <p className="text-xs text-gray-600 mt-1">{planDetails}</p>
          )}
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════
  // RENDER: NOT AUTHENTICATED
  // ═══════════════════════════════════════════════════════════════
  
  if (!isAuthenticated || !currentUser) {
    return <Navigate to="/" replace />;
  }

  // ═══════════════════════════════════════════════════════════════
  // RENDER: INVALID ROLE
  // ═══════════════════════════════════════════════════════════════
  
  const allowedRoles = ['worker', 'seller', 'admin'];
  if (!allowedRoles.includes(currentUser.role)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
        <div className="text-center max-w-md w-full bg-white rounded-xl shadow-lg p-8">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-6">This page is only for workers, sellers, and admins.</p>
          <button 
            onClick={() => window.location.href = '/'}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════
  // RENDER: WORKER DISABLED
  // ═══════════════════════════════════════════════════════════════
  
  if (currentUser.role === 'worker') {
    
    if (currentUser.is_active === false) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
          <div className="text-center max-w-md w-full bg-white rounded-xl shadow-lg p-8">
            <XCircle className="w-16 h-16 text-orange-500 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Account Disabled</h2>
            <p className="text-base text-gray-600 mb-6">
              Your account has been disabled by the seller.
            </p>
            <p className="text-sm text-gray-500 mb-6">
              Please contact your seller to reactivate your account.
            </p>
            <button 
              onClick={() => handleForceLogout('Account disabled')}
              className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </div>
      );
    }

    if (currentUser.account_status === 'deleted') {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
          <div className="text-center max-w-md w-full bg-white rounded-xl shadow-lg p-8">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Account Deleted</h2>
            <p className="text-base text-gray-600 mb-6">
              This account has been permanently deleted.
            </p>
            <button 
              onClick={() => handleForceLogout('Account deleted')}
              className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </div>
      );
    }

    // ═══════════════════════════════════════════════════════════════
    // ✅ RENDER: PLAN INACTIVE (SHOWS BLOCKED SCREEN, NO AUTO-LOGOUT)
    // ═══════════════════════════════════════════════════════════════
    
    if (sellerPlanActive === false) {
      
      let mainMessage = 'Seller Plan Inactive';
      let subMessage = 'Cannot access until seller renews plan.';
      let icon = '🚫';
      
      if (expiryReason === 'scan_limit') {
        mainMessage = 'Scan Limit Reached';
        subMessage = 'All allowed scans have been used. Ask seller to upgrade plan.';
        icon = '🔒';
      } else if (expiryReason === 'date') {
        mainMessage = 'Plan Expired';
        subMessage = 'Subscription date has expired. Ask seller to renew.';
        icon = '⏰';
      } else if (expiryReason === 'both') {
        mainMessage = 'Plan Expired';
        subMessage = 'Date expired AND scan limit reached. Ask seller to upgrade.';
        icon = '🚫';
      }
      
      return (
        <div className="min-h-screen flex items-center justify-center bg-red-50 px-4 py-8">
          <div className="text-center max-w-md w-full bg-white rounded-xl shadow-2xl p-8 border-2 border-red-200">
            <Shield className="w-20 h-20 text-red-600 mx-auto mb-4 animate-pulse" />
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              {icon} Access Suspended
            </h2>
            
            <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-900 font-semibold mb-2">{mainMessage}</p>
              <p className="text-sm text-red-700 mb-3">{subMessage}</p>
              
              {planDetails && (
                <div className="text-xs text-red-600 mt-3 font-mono bg-red-100 p-3 rounded">
                  {planDetails}
                </div>
              )}
              
              {scanLimitReached && (
                <div className="mt-3 p-2 bg-orange-50 border border-orange-200 rounded">
                  <p className="text-xs text-orange-800">
                    ⚠️ All scans from this plan have been used by you and/or the seller.
                  </p>
                </div>
              )}
            </div>

            {realtimeConnected && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-2 mb-4">
                <p className="text-xs text-green-700 flex items-center justify-center gap-1">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  Monitoring for plan changes...
                </p>
              </div>
            )}
            
            {lastChecked && (
              <p className="text-xs text-gray-500 mb-4">
                Last checked: {lastChecked.toLocaleTimeString()}
              </p>
            )}

            <button 
              onClick={handleManualRefresh}
              disabled={manualChecking}
              className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold mb-3 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCw className={`w-5 h-5 ${manualChecking ? 'animate-spin' : ''}`} />
              {manualChecking ? 'Checking...' : 'Check Plan Status'}
            </button>

            <button 
              onClick={() => handleForceLogout(
                expiryReason === 'scan_limit' ? 'Scan limit reached' :
                expiryReason === 'date' ? 'Plan expired' :
                expiryReason === 'both' ? 'Plan expired (date + scan limit)' :
                'Plan inactive'
              )}
              className="w-full px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold"
            >
              Logout
            </button>
            
            <p className="text-xs text-gray-500 mt-4">
              💡 Contact your seller to resolve this issue
            </p>
          </div>
        </div>
      );
    }
  }

  // ═══════════════════════════════════════════════════════════════
  // RENDER: ALLOW ACCESS
  // ═══════════════════════════════════════════════════════════════
  
  return <>{children}</>;
};

console.log('✅ WorkerProtectedRoute - v15.0 (LOGOUT TIMING FIX)');