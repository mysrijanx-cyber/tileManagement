
import React, { useState, useEffect } from 'react';
import { X, RefreshCw } from 'lucide-react';
import { getActivePlans } from '../../lib/planService';
import { PlanCard } from '../Plans/PlanCard';
import type { Plan } from '../../types/plan.types';

interface PlansModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPlan?: (planId: string) => void;
  isLoggedIn?: boolean;
}

export const PlansModal: React.FC<PlansModalProps> = ({
  isOpen,
  onClose,
  onSelectPlan,
  isLoggedIn = false
}) => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);

  // ═══════════════════════════════════════════════════════════════
  // EFFECTS
  // ═══════════════════════════════════════════════════════════════
  
  useEffect(() => {
    if (isOpen) {
      loadPlans();
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    } else {
      // Restore body scroll when modal closes
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // ═══════════════════════════════════════════════════════════════
  // HANDLERS
  // ═══════════════════════════════════════════════════════════════

  const loadPlans = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const activePlans = await getActivePlans();
      setPlans(activePlans);
    } catch (err: any) {
      console.error('Error loading plans:', err);
      setError('Failed to load plans. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPlan = (planId: string) => {
    if (!isLoggedIn) {
      alert('🔐 Please login to purchase a plan');
      return;
    }
    
    setSelectedPlanId(planId);
    if (onSelectPlan) {
      onSelectPlan(planId);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* ═══════════════════════════════════════════════════════════ */}
      {/* BACKDROP */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <div
        className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      ></div>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* MODAL CONTAINER */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <div className="flex min-h-full items-center justify-center p-3 sm:p-4 md:p-6">
        <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-7xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden animate-fadeIn">
          
          {/* ═══════════════════════════════════════════════════════════ */}
          {/* HEADER - FULLY RESPONSIVE */}
          {/* ═══════════════════════════════════════════════════════════ */}
          <div className="sticky top-0 bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-600 text-white px-4 py-5 sm:px-6 sm:py-6 md:px-8 md:py-7 lg:px-10 lg:py-8 z-20 shadow-lg">
            <div className="flex items-start sm:items-center justify-between gap-3 sm:gap-4">
              {/* Title Section */}
              <div className="flex-1 min-w-0 pr-2">
                <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold mb-2 sm:mb-2.5 md:mb-3 leading-tight">
                  💎 Choose Your Plan For Your Tile
                  <br className="hidden sm:block" />
                  <span className="sm:hidden"> </span>
                  Virtualization Platform
                </h2>
                <p className="text-purple-100 text-xs sm:text-sm md:text-base lg:text-lg leading-relaxed">
                  Select the perfect plan for your business needs
                </p>
              </div>

              {/* Close Button */}
              <button
                onClick={onClose}
                className="flex-shrink-0 text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-2 sm:p-2.5 transition-all duration-200 active:scale-95 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
                aria-label="Close modal"
              >
                <X className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" />
              </button>
            </div>

            {/* Stats Bar - Responsive */}
            <div className="mt-4 sm:mt-5 md:mt-6 grid grid-cols-3 gap-2 sm:gap-3 md:gap-4">
              <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg px-2 py-2 sm:px-3 sm:py-2.5 md:px-4 md:py-3 text-center">
                <p className="text-xl sm:text-2xl md:text-3xl font-bold mb-0.5 sm:mb-1">
                  {plans.length}
                </p>
                <p className="text-[10px] sm:text-xs md:text-sm text-purple-100">
                  Available Plans
                </p>
              </div>
              <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg px-2 py-2 sm:px-3 sm:py-2.5 md:px-4 md:py-3 text-center">
                <p className="text-xl sm:text-2xl md:text-3xl font-bold mb-0.5 sm:mb-1">
                  ⭐
                </p>
                <p className="text-[10px] sm:text-xs md:text-sm text-purple-100">
                  Premium Features
                </p>
              </div>
              <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg px-2 py-2 sm:px-3 sm:py-2.5 md:px-4 md:py-3 text-center">
                <p className="text-xl sm:text-2xl md:text-3xl font-bold mb-0.5 sm:mb-1">
                  🔒
                </p>
                <p className="text-[10px] sm:text-xs md:text-sm text-purple-100">
                  Secure Payment
                </p>
              </div>
            </div>
          </div>

          {/* ═══════════════════════════════════════════════════════════ */}
          {/* CONTENT AREA - RESPONSIVE PADDING */}
          {/* ═══════════════════════════════════════════════════════════ */}
          <div className="p-4 sm:p-5 md:p-6 lg:p-8 overflow-y-auto max-h-[calc(95vh-280px)] sm:max-h-[calc(90vh-300px)]">
            
            {/* ═══════════════════════════════════════════════════════ */}
            {/* LOADING STATE */}
            {/* ═══════════════════════════════════════════════════════ */}
            {loading ? (
              <div className="flex items-center justify-center py-12 sm:py-16 md:py-20">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 md:h-20 md:w-20 border-b-4 border-purple-600 mx-auto mb-4 sm:mb-5 md:mb-6"></div>
                  <p className="text-gray-600 text-sm sm:text-base md:text-lg font-medium">
                    Loading amazing plans...
                  </p>
                </div>
              </div>
            ) : 
            
            /* ═══════════════════════════════════════════════════════ */
            /* ERROR STATE */
            /* ═══════════════════════════════════════════════════════ */
            error ? (
              <div className="bg-red-50 border-2 border-red-200 rounded-xl p-5 sm:p-6 md:p-8 text-center shadow-md">
                <div className="text-red-500 text-4xl sm:text-5xl md:text-6xl mb-3 sm:mb-4">⚠️</div>
                <h3 className="text-base sm:text-lg md:text-xl font-bold text-red-800 mb-2 sm:mb-3">
                  Error Loading Plans
                </h3>
                <p className="text-sm sm:text-base md:text-lg text-red-600 mb-4 sm:mb-5 md:mb-6 max-w-md mx-auto">
                  {error}
                </p>
                <button
                  onClick={loadPlans}
                  className="bg-red-600 text-white px-5 py-2.5 sm:px-6 sm:py-3 md:px-8 md:py-3.5 rounded-lg hover:bg-red-700 transition-all duration-200 text-sm sm:text-base md:text-lg font-semibold inline-flex items-center gap-2 shadow-lg hover:shadow-xl active:scale-95"
                >
                  <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5" />
                  Try Again
                </button>
              </div>
            ) : 
            
            /* ═══════════════════════════════════════════════════════ */
            /* EMPTY STATE */
            /* ═══════════════════════════════════════════════════════ */
            plans.length === 0 ? (
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-gray-200 rounded-xl p-6 sm:p-8 md:p-10 text-center shadow-md">
                <div className="text-gray-400 text-5xl sm:text-6xl md:text-7xl mb-4 sm:mb-5">📦</div>
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-700 mb-2 sm:mb-3">
                  No Plans Available
                </h3>
                <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-md mx-auto">
                  Plans are currently being configured. Please check back later.
                </p>
              </div>
            ) : (
              
              /* ═══════════════════════════════════════════════════════ */
              /* PLANS DISPLAY */
              /* ═══════════════════════════════════════════════════════ */
              <>
                {/* Plans Grid - Responsive */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6 lg:gap-7 mb-6 sm:mb-8 md:mb-10">
                  {plans.map((plan) => (
                    <PlanCard
                      key={plan.id}
                      plan={plan}
                      onSelect={handleSelectPlan}
                      isSelected={selectedPlanId === plan.id}
                      showSelectButton={true}
                      isLoggedIn={isLoggedIn}
                    />
                  ))}
                </div>

                {/* ═══════════════════════════════════════════════════ */}
                {/* TRUST BADGES - RESPONSIVE */}
                {/* ═══════════════════════════════════════════════════ */}
                <div className="bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 border-2 border-purple-200 rounded-xl p-4 sm:p-5 md:p-6 lg:p-8 shadow-lg mb-5 sm:mb-6">
                  <h3 className="text-center text-base sm:text-lg md:text-xl font-bold text-gray-800 mb-4 sm:mb-5 md:mb-6">
                    🎯 Why Choose Us?
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
                    <div className="bg-white rounded-lg p-4 sm:p-5 md:p-6 text-center shadow-md hover:shadow-xl transition-shadow duration-300">
                      <div className="text-3xl sm:text-4xl md:text-5xl mb-2 sm:mb-3">🔒</div>
                      <h4 className="font-bold text-gray-800 text-sm sm:text-base md:text-lg mb-1 sm:mb-2">
                        Secure Payment
                      </h4>
                      <p className="text-xs sm:text-sm md:text-base text-gray-600 leading-relaxed">
                        Razorpay encrypted checkout with 256-bit SSL
                      </p>
                    </div>
                    <div className="bg-white rounded-lg p-4 sm:p-5 md:p-6 text-center shadow-md hover:shadow-xl transition-shadow duration-300">
                      <div className="text-3xl sm:text-4xl md:text-5xl mb-2 sm:mb-3">⚡</div>
                      <h4 className="font-bold text-gray-800 text-sm sm:text-base md:text-lg mb-1 sm:mb-2">
                        Instant Activation
                      </h4>
                      <p className="text-xs sm:text-sm md:text-base text-gray-600 leading-relaxed">
                        Access immediately after successful payment
                      </p>
                    </div>
                    <div className="bg-white rounded-lg p-4 sm:p-5 md:p-6 text-center shadow-md hover:shadow-xl transition-shadow duration-300">
                      <div className="text-3xl sm:text-4xl md:text-5xl mb-2 sm:mb-3">🎧</div>
                      <h4 className="font-bold text-gray-800 text-sm sm:text-base md:text-lg mb-1 sm:mb-2">
                        24/7 Support
                      </h4>
                      <p className="text-xs sm:text-sm md:text-base text-gray-600 leading-relaxed">
                        Email, phone & chat assistance anytime
                      </p>
                    </div>
                  </div>
                </div>

                {/* ═══════════════════════════════════════════════════ */}
                {/* LOGIN WARNING - RESPONSIVE */}
                {/* ═══════════════════════════════════════════════════ */}
                {!isLoggedIn && (
                  <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-300 rounded-xl p-4 sm:p-5 md:p-6 text-center shadow-md">
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
                      <div className="text-3xl sm:text-4xl md:text-5xl">🔐</div>
                      <div>
                        <p className="text-yellow-900 font-bold text-sm sm:text-base md:text-lg mb-1">
                          Please Login to Purchase a Plan
                        </p>
                        <p className="text-yellow-700 text-xs sm:text-sm md:text-base">
                          You must be logged in to select and purchase subscription plans
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* ═══════════════════════════════════════════════════ */}
                {/* MONEY BACK GUARANTEE - RESPONSIVE */}
                {/* ═══════════════════════════════════════════════════ */}
                <div className="mt-5 sm:mt-6 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-xl p-4 sm:p-5 md:p-6 text-center shadow-md">
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
                    <div className="text-3xl sm:text-4xl md:text-5xl">✅</div>
                    <div>
                      <p className="text-green-900 font-bold text-sm sm:text-base md:text-lg mb-1">
                        100% Satisfaction Guaranteed
                      </p>
                      <p className="text-green-700 text-xs sm:text-sm md:text-base">
                        30-day money-back guarantee • No questions asked
                      </p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// ANIMATIONS - Add to your global CSS or Tailwind config
// ═══════════════════════════════════════════════════════════════

const styles = `
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: scale(0.95);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  .animate-fadeIn {
    animation: fadeIn 0.2s ease-out;
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}

console.log('✅ PlansModal Component loaded - PRODUCTION v4.0 (FULLY RESPONSIVE)'); 
