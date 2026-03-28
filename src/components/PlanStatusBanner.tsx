// ═══════════════════════════════════════════════════════════════
// ✅ PLAN STATUS BANNER - PRODUCTION v3.0 (AUTO-REFRESH FIXED)
// ═══════════════════════════════════════════════════════════════

import React, { useState, useEffect } from 'react';
import { Clock, AlertTriangle, CheckCircle, RefreshCw, Eye, X } from 'lucide-react';
import { getSellerSubscription, isSubscriptionExpired } from '../lib/subscriptionService';
import { getPlanById } from '../lib/planService';
import type { Subscription } from '../types/payment.types';
import type { Plan } from '../types/plan.types';

interface PlanStatusBannerProps {
  sellerId: string;
  onViewPlans: () => void;
  forceRefresh?: number; // Add this to trigger refresh from parent
}

export const PlanStatusBanner: React.FC<PlanStatusBannerProps> = ({
  sellerId,
  onViewPlans,
  forceRefresh = 0
}) => {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [plan, setPlan] = useState<Plan | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRemaining, setTimeRemaining] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const [isExpired, setIsExpired] = useState(false);
  const [showExpiryPopup, setShowExpiryPopup] = useState(false);
  const [lastChecked, setLastChecked] = useState<Date>(new Date());

  // Load subscription on mount and when forceRefresh changes
  useEffect(() => {
    console.log('🔄 PlanStatusBanner: Loading subscription...');
    loadSubscription();
    const interval = setInterval(loadSubscription, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, [sellerId, forceRefresh]);

  // Update timer every second
  useEffect(() => {
    if (subscription) {
      updateTimer();
      const interval = setInterval(updateTimer, 1000);
      return () => clearInterval(interval);
    }
  }, [subscription]);

  // Show expiry popup when plan expires
  useEffect(() => {
    if (isExpired && subscription && !sessionStorage.getItem('expiry_popup_shown')) {
      setShowExpiryPopup(true);
      sessionStorage.setItem('expiry_popup_shown', 'true');
    }
  }, [isExpired]);

  const loadSubscription = async () => {
    try {
      setLoading(true);
      console.log('🔍 Fetching subscription for seller:', sellerId);
      
      const sub = await getSellerSubscription(sellerId);
      
      if (sub) {
        console.log('✅ Subscription found:', sub.id);
        setSubscription(sub);
        
        const planData = await getPlanById(sub.plan_id);
        console.log('📋 Plan loaded:', planData?.plan_name);
        setPlan(planData);
        
        const expired = isSubscriptionExpired(sub);
        console.log('⏱️ Subscription expired:', expired);
        setIsExpired(expired);
        
        setLastChecked(new Date());
      } else {
        console.log('ℹ️ No active subscription found');
        setSubscription(null);
        setPlan(null);
        setIsExpired(false);
      }
    } catch (error) {
      console.error('❌ Error loading subscription:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateTimer = () => {
    if (!subscription || !subscription.end_date) return;

    const endDate = new Date(subscription.end_date);
    const now = new Date();
    const diffMs = endDate.getTime() - now.getTime();

    if (diffMs <= 0) {
      setTimeRemaining({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      setIsExpired(true);
      return;
    }

    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);

    setTimeRemaining({ days, hours, minutes, seconds });
    setIsExpired(false);
  };

  const getTimerDisplay = () => {
    const { days, hours, minutes, seconds } = timeRemaining;

    if (days > 0) {
      return `${days}d ${hours}h ${minutes}m ${seconds}s`;
    } else if (hours > 0) {
      return `${hours}h ${minutes}m ${seconds}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds}s`;
    } else {
      return `${seconds}s`;
    }
  };

  const getStatusColor = () => {
    if (isExpired) return 'from-red-600 to-red-700';

    const { days, hours } = timeRemaining;

    if (hours < 1 && days === 0) return 'from-red-500 to-orange-600';
    if (hours < 24 && days === 0) return 'from-orange-500 to-yellow-600';
    if (days < 7) return 'from-yellow-500 to-yellow-600';
    return 'from-green-600 to-emerald-600';
  };

  const shouldPulse = () => {
    const { hours, days } = timeRemaining;
    return (hours < 1 && days === 0) || isExpired;
  };

  if (loading) {
    return (
      <div className="mb-4 sm:mb-6 p-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded-xl animate-pulse">
        <div className="h-8 bg-gray-400 rounded w-1/2 mb-2"></div>
        <div className="h-4 bg-gray-400 rounded w-1/3"></div>
      </div>
    );
  }

  if (!subscription || !plan) {
    return (
      <div className="mb-4 sm:mb-6 p-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl shadow-lg">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-6 h-6 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-bold text-lg">No Active Plan</h3>
              <p className="text-sm text-purple-100 mt-1">
                Subscribe to a plan to unlock all features!
              </p>
            </div>
          </div>
          <button
            onClick={onViewPlans}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white text-purple-600 px-4 py-2 rounded-lg hover:bg-purple-50 transition-colors font-semibold shadow-md"
          >
            <Eye className="w-4 h-4" />
            View Plans
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div
        className={`mb-4 sm:mb-6 p-4 bg-gradient-to-r ${getStatusColor()} text-white rounded-xl shadow-lg ${
          shouldPulse() ? 'animate-pulse' : ''
        }`}
      >
        <div className="flex flex-col gap-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3 flex-1 min-w-0">
              {isExpired ? (
                <AlertTriangle className="w-6 h-6 mt-0.5 flex-shrink-0" />
              ) : (
                <CheckCircle className="w-6 h-6 mt-0.5 flex-shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-lg sm:text-xl truncate">
                  {isExpired ? '❌ Plan Expired' : `✅ ${plan.plan_name}`}
                </h3>
                <p className="text-sm opacity-90 mt-0.5">
                  {isExpired
                    ? 'Your subscription has ended'
                    : `₹${plan.price.toLocaleString()} / ${plan.billing_cycle}`}
                </p>
              </div>
            </div>

            <button
              onClick={loadSubscription}
              className="flex-shrink-0 p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
              title="Refresh Status"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-t border-white border-opacity-20 pt-3">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 flex-shrink-0" />
              <div className="text-sm">
                {isExpired ? (
                  <>
                    <span className="opacity-90">Expired on: </span>
                    <span className="font-bold">
                      {new Date(subscription.end_date).toLocaleString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </>
                ) : (
                  <>
                    <span className="opacity-90">Time Left: </span>
                    <span className="font-bold font-mono">{getTimerDisplay()}</span>
                  </>
                )}
              </div>
            </div>

            <div className="flex gap-2">
              {isExpired && (
                <button
                  onClick={onViewPlans}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-white text-red-700 px-4 py-2 rounded-lg hover:bg-red-50 transition-colors font-semibold shadow-md"
                >
                  <Eye className="w-4 h-4" />
                  Renew Now
                </button>
              )}
              {!isExpired && timeRemaining.days < 7 && (
                <button
                  onClick={onViewPlans}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-white bg-opacity-90 hover:bg-opacity-100 text-gray-900 px-4 py-2 rounded-lg transition-colors font-semibold shadow-md"
                >
                  <Eye className="w-4 h-4" />
                  Upgrade
                </button>
              )}
            </div>
          </div>

          {!isExpired && (
            <div className="text-xs opacity-75 flex items-center gap-1.5">
              <span>📅</span>
              <span>
                Expires: {new Date(subscription.end_date).toLocaleString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            </div>
          )}
          
          <div className="text-xs opacity-60 flex items-center gap-1.5">
            <span>🔄</span>
            <span>Last checked: {lastChecked.toLocaleTimeString('en-IN')}</span>
          </div>
        </div>
      </div>

      {showExpiryPopup && isExpired && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black bg-opacity-70 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-scale-in">
            <div className="bg-gradient-to-r from-red-600 to-orange-600 text-white p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-white bg-opacity-20 rounded-full">
                    <AlertTriangle className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">Plan Expired!</h3>
                    <p className="text-sm text-red-100 mt-1">Immediate action required</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowExpiryPopup(false)}
                  className="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-2 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="space-y-4">
                <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4">
                  <p className="text-red-800 font-bold mb-2 text-lg">
                    🚫 Your {plan.plan_name} plan has expired
                  </p>
                  <div className="text-sm text-red-700 space-y-1">
                    <p><strong>Plan:</strong> {plan.plan_name}</p>
                    <p><strong>Price:</strong> ₹{plan.price.toLocaleString()}</p>
                    <p><strong>Expired:</strong> {new Date(subscription.end_date).toLocaleString('en-IN')}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="font-bold text-gray-800 flex items-center gap-2">
                    <span>⚠️</span>
                    <span>Limited Access Active:</span>
                  </p>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-start gap-2">
                      <span className="text-red-500 mt-0.5">✗</span>
                      <span>Cannot add new tiles</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-500 mt-0.5">✗</span>
                      <span>QR code generation disabled</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-500 mt-0.5">✗</span>
                      <span>Analytics unavailable</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-500 mt-0.5">✗</span>
                      <span>Customer inquiries blocked</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-lg p-4">
                  <p className="text-blue-800 text-sm font-medium">
                    💡 <strong>Renew your plan now</strong> to restore full access!
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 mt-6">
                <button
                  onClick={() => setShowExpiryPopup(false)}
                  className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
                >
                  Dismiss
                </button>
                <button
                  onClick={() => {
                    setShowExpiryPopup(false);
                    onViewPlans();
                  }}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-lg hover:from-red-700 hover:to-orange-700 transition-all font-bold shadow-lg"
                >
                  Renew Plan Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

console.log('✅ PlanStatusBanner Component loaded - v3.0');