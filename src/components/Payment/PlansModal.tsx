
import React, { useState, useEffect } from 'react';
import { X, Loader, AlertCircle, CheckCircle } from 'lucide-react';
import { getActivePlans } from '../../lib/planService';
import { PlanCard } from '../Plans/PlanCard';
import type { Plan } from '../../types/plan.types';

// ═══════════════════════════════════════════════════════════════
// INTERFACE
// ═══════════════════════════════════════════════════════════════

interface PlansModalProps {
  isOpen: boolean;
  onClose: () => void;
  sellerId: string;
  userToken: string;
  isLoggedIn: boolean;
}

// ═══════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════

export const PlansModal: React.FC<PlansModalProps> = ({
  isOpen,
  onClose,
  sellerId,
  userToken,
  isLoggedIn
}) => {
  // ═══════════════════════════════════════════════════════════════
  // STATE
  // ═══════════════════════════════════════════════════════════════
  
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isClosing, setIsClosing] = useState(false);
  const [paymentSuccessDetected, setPaymentSuccessDetected] = useState(false);
  const [closeCountdown, setCloseCountdown] = useState(3);

  // ═══════════════════════════════════════════════════════════════
  // 1. FETCH PLANS ON OPEN
  // ═══════════════════════════════════════════════════════════════
  
  useEffect(() => {
    const loadPlans = async () => {
      if (!isOpen) return;

      try {
        setLoading(true);
        setError(null);
        console.log('═══════════════════════════════════════════════════════');
        console.log('📋 [MODAL] Fetching active plans...');
        console.log('═══════════════════════════════════════════════════════');
        
        const activePlans = await getActivePlans();
        
        console.log(`✅ [MODAL] Fetched ${activePlans.length} active plans`);
        
        if (activePlans.length === 0) {
          console.warn('⚠️ [MODAL] No active plans available');
        } else {
          console.log('📋 [MODAL] Available plans:', 
            activePlans.map(p => ({ id: p.id, name: p.plan_name, price: p.price }))
          );
        }
        
        setPlans(activePlans);
      } catch (err: any) {
        console.error('❌ [MODAL] Error loading plans:', err);
        setError(err.message || 'Failed to load plans');
      } finally {
        setLoading(false);
      }
    };

    loadPlans();
  }, [isOpen]);

  // ═══════════════════════════════════════════════════════════════
  // 2. PAYMENT SUCCESS DETECTION & AUTO-CLOSE
  // ═══════════════════════════════════════════════════════════════
  
  useEffect(() => {
    if (!isOpen || isClosing) return;

    console.log('🎯 [MODAL] Setting up payment success detection...');

    const checkPaymentSuccess = setInterval(() => {
      const flag = localStorage.getItem('plan_just_purchased');
      
      if (flag) {
        const timestamp = parseInt(flag);
        const elapsed = Date.now() - timestamp;
        
        console.log('═══════════════════════════════════════════════════════');
        console.log('🔔 [MODAL] PAYMENT SUCCESS FLAG DETECTED!');
        console.log('═══════════════════════════════════════════════════════');
        console.log('⏱️ [MODAL] Elapsed since payment:', elapsed, 'ms');
        console.log('🔄 [MODAL] Starting auto-close countdown...');
        
        // Set payment success state
        setPaymentSuccessDetected(true);
        
        // Don't clear flag here - let banner handle it
        // localStorage.removeItem('plan_just_purchased');
        
        // Start countdown
        let countdown = 3;
        setCloseCountdown(countdown);
        
        const countdownInterval = setInterval(() => {
          countdown--;
          setCloseCountdown(countdown);
          
          console.log(`⏰ [MODAL] Auto-close in ${countdown} seconds...`);
          
          if (countdown <= 0) {
            clearInterval(countdownInterval);
            console.log('✅ [MODAL] Auto-closing modal now');
            setIsClosing(true);
            
            setTimeout(() => {
              onClose();
              
              // Reset states for next open
              setTimeout(() => {
                setPaymentSuccessDetected(false);
                setIsClosing(false);
                setCloseCountdown(3);
              }, 500);
            }, 300);
          }
        }, 1000);
        
        clearInterval(checkPaymentSuccess);
      }
    }, 500); // Check every 500ms

    return () => {
      console.log('🧹 [MODAL] Cleaning up payment success detection');
      clearInterval(checkPaymentSuccess);
    };
  }, [isOpen, isClosing, onClose]);

  // ═══════════════════════════════════════════════════════════════
  // 3. RESET STATES ON CLOSE
  // ═══════════════════════════════════════════════════════════════
  
  useEffect(() => {
    if (!isOpen) {
      console.log('🔄 [MODAL] Resetting modal states');
      setPaymentSuccessDetected(false);
      setIsClosing(false);
      setCloseCountdown(3);
      setError(null);
    }
  }, [isOpen]);

  // ═══════════════════════════════════════════════════════════════
  // HELPER FUNCTIONS
  // ═══════════════════════════════════════════════════════════════
  
  const handleClose = () => {
    if (isClosing || paymentSuccessDetected) {
      console.log('⏸️ [MODAL] Close blocked - Payment processing or auto-closing');
      return;
    }
    
    console.log('👆 [MODAL] Manual close triggered');
    onClose();
  };

  const handleRetry = () => {
    console.log('🔄 [MODAL] Retry loading plans');
    setError(null);
    setLoading(true);
    
    getActivePlans()
      .then(activePlans => {
        console.log(`✅ [MODAL] Retry successful - ${activePlans.length} plans loaded`);
        setPlans(activePlans);
        setLoading(false);
      })
      .catch(err => {
        console.error('❌ [MODAL] Retry failed:', err);
        setError(err.message || 'Failed to load plans');
        setLoading(false);
      });
  };

  // ═══════════════════════════════════════════════════════════════
  // RENDER - RETURN NULL IF CLOSED
  // ═══════════════════════════════════════════════════════════════
  
  if (!isOpen) return null;

  // ═══════════════════════════════════════════════════════════════
  // RENDER - MAIN MODAL
  // ═══════════════════════════════════════════════════════════════
  
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-60 transition-opacity"
        onClick={handleClose}
      ></div>

      {/* Modal Container */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className={`relative bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden transition-all duration-300 ${
          isClosing ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
        }`}>
          
          {/* ═══════════════════════════════════════════════════════════════ */}
          {/* HEADER */}
          {/* ═══════════════════════════════════════════════════════════════ */}
          
          <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-6 z-10">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold mb-1">
                  {paymentSuccessDetected ? '✅ Payment Successful!' : ''}
                </h2>
                <p className="text-purple-100 text-sm">
                  {paymentSuccessDetected 
                    ? 'Your subscription is being activated...' 
                    : 'Select the perfect plan for your business'}
                </p>
              </div>
              {!isClosing && !paymentSuccessDetected && (
                <button
                  onClick={handleClose}
                  className="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-2 transition-colors"
                  aria-label="Close modal"
                >
                  <X className="w-6 h-6" />
                </button>
              )}
            </div>
          </div>

          {/* ═══════════════════════════════════════════════════════════════ */}
          {/* PAYMENT SUCCESS NOTIFICATION */}
          {/* ═══════════════════════════════════════════════════════════════ */}
          
          {paymentSuccessDetected && (
            <div className="bg-green-50 border-b-4 border-green-500 p-6 animate-pulse">
              <div className="flex items-center justify-center gap-4">
                <CheckCircle className="w-8 h-8 text-green-600 animate-bounce" />
                <div className="text-center">
                  <h3 className="text-xl font-bold text-green-800 mb-1">
                    Payment Completed Successfully!
                  </h3>
                  <p className="text-green-700 text-sm mb-2">
                    Your plan is being activated. Dashboard will update shortly...
                  </p>
                  <div className="inline-flex items-center gap-2 bg-green-200 px-4 py-2 rounded-lg">
                    <Loader className="w-4 h-4 animate-spin text-green-700" />
                    <span className="text-green-800 font-bold">
                      Auto-closing in {closeCountdown} seconds
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════════════ */}
          {/* CONTENT */}
          {/* ═══════════════════════════════════════════════════════════════ */}
          
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
            
            {/* ────────────────────────────────────────────────────────────── */}
            {/* LOADING STATE */}
            {/* ────────────────────────────────────────────────────────────── */}
            
            {loading && (
              <div className="flex items-center justify-center py-20">
                <div className="text-center">
                  <Loader className="w-12 h-12 text-purple-600 animate-spin mx-auto mb-4" />
                  <p className="text-gray-600 font-medium">Loading available plans...</p>
                  <p className="text-gray-400 text-sm mt-2">Please wait</p>
                </div>
              </div>
            )}

            {/* ────────────────────────────────────────────────────────────── */}
            {/* ERROR STATE */}
            {/* ────────────────────────────────────────────────────────────── */}
            
            {error && !loading && (
              <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6 text-center">
                <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-3" />
                <h3 className="text-xl font-bold text-red-800 mb-2">Error Loading Plans</h3>
                <p className="text-red-700 mb-4">{error}</p>
                <div className="flex gap-3 justify-center">
                  <button
                    onClick={handleRetry}
                    className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors font-medium"
                  >
                    Try Again
                  </button>
                  <button
                    onClick={handleClose}
                    className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors font-medium"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}

            {/* ────────────────────────────────────────────────────────────── */}
            {/* TOKEN LOADING WARNING */}
            {/* ────────────────────────────────────────────────────────────── */}
            
            {!loading && !error && isLoggedIn && !userToken && (
              <div className="bg-yellow-50 border-2 border-yellow-300 rounded-xl p-4 mb-6 text-center">
                <Loader className="w-6 h-6 text-yellow-600 animate-spin mx-auto mb-2" />
                <p className="text-yellow-800 font-medium">Authenticating...</p>
                <p className="text-yellow-700 text-sm mt-1">Please wait while we verify your session</p>
              </div>
            )}

            {/* ────────────────────────────────────────────────────────────── */}
            {/* NOT LOGGED IN WARNING */}
            {/* ────────────────────────────────────────────────────────────── */}
            
            {!loading && !error && !isLoggedIn && (
              <div className="bg-orange-50 border-2 border-orange-300 rounded-xl p-6 text-center">
                <AlertCircle className="w-12 h-12 text-orange-600 mx-auto mb-3" />
                <h3 className="text-xl font-bold text-orange-800 mb-2">Login Required</h3>
                <p className="text-orange-700 mb-4">You must be logged in to purchase a plan</p>
                <button
                  onClick={handleClose}
                  className="bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 transition-colors font-medium"
                >
                  Close
                </button>
              </div>
            )}

            {/* ────────────────────────────────────────────────────────────── */}
            {/* PLANS GRID */}
            {/* ────────────────────────────────────────────────────────────── */}
            
            {!loading && !error && plans.length > 0 && isLoggedIn && userToken && (
              <>
                {/* Info Banner */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-4 mb-6">
                  <div className="flex items-start gap-3">
                    <div className="text-2xl">💎</div>
                    <div className="flex-1">
                      <h4 className="font-bold text-blue-900 mb-1">Choose the Right Plan</h4>
                      <p className="text-blue-800 text-sm">
                        All plans include secure payments via Razorpay. Upgrade or downgrade anytime.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Plans Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {plans.map((plan) => (
                    <PlanCard
                      key={plan.id}
                      plan={plan}
                      sellerId={sellerId}
                      userToken={userToken}
                      isLoggedIn={isLoggedIn}
                      showSelectButton={true}
                    />
                  ))}
                </div>

                {/* Footer Info */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                    <div className="bg-green-50 rounded-lg p-4">
                      <div className="text-2xl mb-2">🔒</div>
                      <h4 className="font-bold text-green-900 mb-1">Secure Payment</h4>
                      <p className="text-green-700 text-xs">Powered by Razorpay</p>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-4">
                      <div className="text-2xl mb-2">⚡</div>
                      <h4 className="font-bold text-blue-900 mb-1">Instant Activation</h4>
                      <p className="text-blue-700 text-xs">Start using immediately</p>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-4">
                      <div className="text-2xl mb-2">🔄</div>
                      <h4 className="font-bold text-purple-900 mb-1">Flexible Plans</h4>
                      <p className="text-purple-700 text-xs">Change anytime</p>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* ────────────────────────────────────────────────────────────── */}
            {/* NO PLANS AVAILABLE */}
            {/* ────────────────────────────────────────────────────────────── */}
            
            {!loading && !error && plans.length === 0 && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📋</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">No Plans Available</h3>
                <p className="text-gray-600 mb-4">
                  There are no active plans at the moment. Please check back later.
                </p>
                <button
                  onClick={handleRetry}
                  className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors font-medium inline-flex items-center gap-2"
                >
                  <Loader className="w-4 h-4" />
                  Refresh Plans
                </button>
              </div>
            )}

          </div>

          {/* ═══════════════════════════════════════════════════════════════ */}
          {/* FOOTER (Only show if not payment success) */}
          {/* ═══════════════════════════════════════════════════════════════ */}
          
          {!paymentSuccessDetected && !loading && plans.length > 0 && (
            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 p-4 text-center">
              <p className="text-sm text-gray-600">
                Need help choosing? Contact us:{' '}
                <a 
                  href="mailto:support@srijanxtile.com" 
                  className="text-purple-600 hover:underline font-medium"
                >
                  support@srijanxtile.com
                </a>
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

console.log('✅ PlansModal - PRODUCTION v8.0 (Complete with Auto-Close & Payment Detection)');