// ═══════════════════════════════════════════════════════════════
// ✅ PLAN CARD COMPONENT - PRODUCTION v1.0
// ═══════════════════════════════════════════════════════════════

import React from 'react';
import type { Plan } from '../../types/plan.types';

interface PlanCardProps {
  plan: Plan;
  onSelect?: (planId: string) => void;
  isSelected?: boolean;
  showSelectButton?: boolean;
  isLoggedIn?: boolean;
  disabled?: boolean;
}

export const PlanCard: React.FC<PlanCardProps> = ({
  plan,
  onSelect,
  isSelected = false,
  showSelectButton = true,
  isLoggedIn = false,
  disabled = false
}) => {
  
  const handleSelect = () => {
    if (!disabled && onSelect) {
      onSelect(plan.id);
    }
  };

  return (
    <div
      className={`relative bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 ${
        isSelected
          ? 'ring-4 ring-purple-500 transform scale-105'
          : 'hover:shadow-xl hover:-translate-y-1'
      } ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`}
    >
      {/* Popular Badge */}
      {plan.is_popular && (
        <div className="absolute top-0 right-0 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-1 rounded-bl-xl font-bold text-xs sm:text-sm shadow-lg">
          ⭐ POPULAR
        </div>
      )}

      <div className="p-6 sm:p-8">
        {/* Plan Name */}
        <h3 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
          {plan.plan_name}
        </h3>

        {/* Price */}
        <div className="mb-6">
          <div className="flex items-baseline gap-2">
            <span className="text-4xl sm:text-5xl font-extrabold text-purple-600">
              ₹{plan.price.toLocaleString('en-IN')}
            </span>
            <span className="text-gray-600 text-lg">
              /{plan.billing_cycle === 'monthly' ? 'month' : 'year'}
            </span>
          </div>
          {plan.billing_cycle === 'yearly' && plan.price > 0 && (
            <p className="text-sm text-green-600 font-medium mt-1">
              💰 Save ₹{Math.round((plan.price / 12) * 2).toLocaleString('en-IN')} per year
            </p>
          )}
        </div>

        {/* Features List */}
        <div className="space-y-3 mb-8">
          {plan.features.map((feature, index) => (
            <div
              key={index}
              className="flex items-start gap-3"
            >
              <div className="flex-shrink-0 mt-1">
                {feature.included ? (
                  <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                    <svg
                      className="w-3 h-3 text-green-600"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="3"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                ) : (
                  <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center">
                    <svg
                      className="w-3 h-3 text-gray-400"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="3"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                  </div>
                )}
              </div>
              <div className="flex-1">
                <p
                  className={`text-sm font-medium ${
                    feature.included ? 'text-gray-800' : 'text-gray-400 line-through'
                  }`}
                  title={feature.tooltip}
                >
                  {feature.icon && <span className="mr-2">{feature.icon}</span>}
                  {feature.title}
                </p>
                {feature.description && feature.included && (
                  <p className="text-xs text-gray-500 mt-1">
                    {feature.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Limits Info */}
        {plan.limits && (
          <div className="mb-6 p-3 bg-gray-50 rounded-lg">
            <p className="text-xs font-semibold text-gray-700 mb-2">Plan Limits:</p>
            <div className="space-y-1 text-xs text-gray-600">
              <div className="flex justify-between">
                <span>Max Tiles:</span>
                <span className="font-medium">
                  {plan.limits.max_tiles === -1 ? 'Unlimited' : plan.limits.max_tiles}
                </span>
              </div>
              <div className="flex justify-between">
                <span>QR Codes:</span>
                <span className="font-medium">
                  {plan.limits.max_qr_codes === -1 ? 'Unlimited' : plan.limits.max_qr_codes}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Workers:</span>
                <span className="font-medium">
                  {plan.limits.max_workers === -1 ? 'Unlimited' : plan.limits.max_workers}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Select Button */}
        {showSelectButton && (
          <button
            onClick={handleSelect}
            disabled={disabled}
            className={`w-full py-3 sm:py-4 rounded-lg font-semibold text-base sm:text-lg transition-all duration-200 ${
              isSelected
                ? 'bg-purple-600 text-white shadow-lg'
                : plan.is_popular
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700 shadow-lg hover:shadow-xl'
                : 'bg-gray-800 text-white hover:bg-gray-900'
            } ${
              disabled
                ? 'cursor-not-allowed opacity-50'
                : 'transform hover:-translate-y-1 active:translate-y-0'
            }`}
          >
            {isLoggedIn ? (
              isSelected ? (
                '✓ Selected'
              ) : (
                'Choose Plan'
              )
            ) : (
              '🔐 Login to Purchase'
            )}
          </button>
        )}
      </div>
    </div>
  );
};

console.log('✅ PlanCard Component loaded - PRODUCTION v1.0');