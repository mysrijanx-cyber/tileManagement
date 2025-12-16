// ═══════════════════════════════════════════════════════════════
// ✅ PLANS MODAL COMPONENT - PRODUCTION v1.0
// Public view all plans (no login required)
// ═══════════════════════════════════════════════════════════════

import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { getActivePlans } from '../../lib/planService';
import { PlanCard } from './PlanCard';
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

  useEffect(() => {
    if (isOpen) {
      loadPlans();
    }
  }, [isOpen]);

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
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-7xl max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-4 sm:p-6 z-10">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold mb-1">
                  💎 Choose Your Plan
                </h2>
                <p className="text-purple-100 text-sm sm:text-base">
                  Select the perfect plan for your business
                </p>
              </div>
              <button
                onClick={onClose}
                className="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-2 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-4 sm:p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading plans...</p>
                </div>
              </div>
            ) : error ? (
              <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
                <div className="text-red-500 text-4xl mb-3">⚠️</div>
                <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Plans</h3>
                <p className="text-red-600 mb-4">{error}</p>
                <button
                  onClick={loadPlans}
                  className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
                >
                  Try Again
                </button>
              </div>
            ) : plans.length === 0 ? (
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-8 text-center">
                <div className="text-gray-400 text-5xl mb-3">📦</div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">No Plans Available</h3>
                <p className="text-gray-600">Plans are currently being configured. Please check back later.</p>
              </div>
            ) : (
              <>
                {/* Plans Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
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

                {/* Info Footer */}
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-purple-200 rounded-xl p-4 sm:p-6">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-2xl mb-2">🔒</div>
                      <h4 className="font-semibold text-gray-800 text-sm mb-1">Secure Payment</h4>
                      <p className="text-xs text-gray-600">PayU encrypted checkout</p>
                    </div>
                    <div>
                      <div className="text-2xl mb-2">📧</div>
                      <h4 className="font-semibold text-gray-800 text-sm mb-1">Instant Activation</h4>
                      <p className="text-xs text-gray-600">Access immediately after payment</p>
                    </div>
                    <div>
                      <div className="text-2xl mb-2">🎧</div>
                      <h4 className="font-semibold text-gray-800 text-sm mb-1">24/7 Support</h4>
                      <p className="text-xs text-gray-600">Email & phone assistance</p>
                    </div>
                  </div>
                </div>

                {/* Login Prompt */}
                {!isLoggedIn && (
                  <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-center">
                    <p className="text-yellow-800 font-medium">
                      🔐 Please <strong>Login</strong> to purchase a plan
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

console.log('✅ PlansModal Component loaded - PRODUCTION v1.0');