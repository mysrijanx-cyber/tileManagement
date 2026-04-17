// // ═══════════════════════════════════════════════════════════════
// // ✅ PLAN CARD - PRODUCTION READY v2.0
// // ═══════════════════════════════════════════════════════════════

// import React from 'react';
// import type { Plan } from '../../types/plan.types';

// interface PlanCardProps {
//   plan: Plan;
//   onSelect?: (planId: string) => void;
//   isSelected?: boolean;
//   showSelectButton?: boolean;
//   isLoggedIn?: boolean;
//   disabled?: boolean;
// }

// export const PlanCard: React.FC<PlanCardProps> = ({
//   plan,
//   onSelect,
//   isSelected = false,
//   showSelectButton = true,
//   isLoggedIn = false,
//   disabled = false
// }) => {
  
//   const handleSelect = () => {
//     if (!disabled && onSelect) {
//       onSelect(plan.id);
//     }
//   };

//   return (
//     <div
//       className={`relative bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 ${
//         isSelected
//           ? 'ring-4 ring-purple-500 transform scale-105'
//           : 'hover:shadow-xl hover:-translate-y-1'
//       } ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`}
//     >
//       {plan.is_popular && (
//         <div className="absolute top-0 right-0 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-1 rounded-bl-xl font-bold text-xs sm:text-sm shadow-lg">
//           ⭐ POPULAR
//         </div>
//       )}

//       <div className="p-6 sm:p-8">
//         <h3 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
//           {plan.plan_name}
//         </h3>

//         <div className="mb-6">
//           <div className="flex items-baseline gap-2">
//             <span className="text-4xl sm:text-5xl font-extrabold text-purple-600">
//               ₹{plan.price.toLocaleString('en-IN')}
//             </span>
//             <span className="text-gray-600 text-lg">
//               /{plan.billing_cycle === 'monthly' ? 'month' : 'year'}
//             </span>
//           </div>
//           {plan.billing_cycle === 'yearly' && plan.price > 0 && (
//             <p className="text-sm text-green-600 font-medium mt-1">
//               💰 Save ₹{Math.round((plan.price / 12) * 2).toLocaleString('en-IN')} per year
//             </p>
//           )}
//         </div>

//         <div className="space-y-3 mb-8">
//           {plan.features.map((feature, index) => (
//             <div
//               key={index}
//               className="flex items-start gap-3"
//             >
//               <div className="flex-shrink-0 mt-1">
//                 {feature.included ? (
//                   <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
//                     <svg
//                       className="w-3 h-3 text-green-600"
//                       fill="none"
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth="3"
//                       viewBox="0 0 24 24"
//                       stroke="currentColor"
//                     >
//                       <path d="M5 13l4 4L19 7"></path>
//                     </svg>
//                   </div>
//                 ) : (
//                   <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center">
//                     <svg
//                       className="w-3 h-3 text-gray-400"
//                       fill="none"
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth="3"
//                       viewBox="0 0 24 24"
//                       stroke="currentColor"
//                     >
//                       <path d="M6 18L18 6M6 6l12 12"></path>
//                     </svg>
//                   </div>
//                 )}
//               </div>
//               <div className="flex-1">
//                 <p
//                   className={`text-sm font-medium ${
//                     feature.included ? 'text-gray-800' : 'text-gray-400 line-through'
//                   }`}
//                   title={feature.tooltip}
//                 >
//                   {feature.icon && <span className="mr-2">{feature.icon}</span>}
//                   {feature.title}
//                 </p>
//                 {feature.description && feature.included && (
//                   <p className="text-xs text-gray-500 mt-1">
//                     {feature.description}
//                   </p>
//                 )}
//               </div>
//             </div>
//           ))}
//         </div>

//         {plan.limits && (
//           <div className="mb-6 p-3 bg-gray-50 rounded-lg">
//             <p className="text-xs font-semibold text-gray-700 mb-2">Plan Limits:</p>
//             <div className="space-y-1 text-xs text-gray-600">
//               <div className="flex justify-between">
//                 <span>Max Tiles:</span>
//                 <span className="font-medium">
//                   {plan.limits.max_tiles === -1 ? 'Unlimited' : plan.limits.max_tiles}
//                 </span>
//               </div>
//               <div className="flex justify-between">
//                 <span>QR Codes:</span>
//                 <span className="font-medium">
//                   {plan.limits.max_qr_codes === -1 ? 'Unlimited' : plan.limits.max_qr_codes}
//                 </span>
//               </div>
//               <div className="flex justify-between">
//                 <span>Workers:</span>
//                 <span className="font-medium">
//                   {plan.limits.max_workers === -1 ? 'Unlimited' : plan.limits.max_workers}
//                 </span>
//               </div>
//             </div>
//           </div>
//         )}

//         {showSelectButton && (
//           <button
//             onClick={handleSelect}
//             disabled={disabled}
//             className={`w-full py-3 sm:py-4 rounded-lg font-semibold text-base sm:text-lg transition-all duration-200 ${
//               isSelected
//                 ? 'bg-purple-600 text-white shadow-lg'
//                 : plan.is_popular
//                 ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700 shadow-lg hover:shadow-xl'
//                 : 'bg-gray-800 text-white hover:bg-gray-900'
//             } ${
//               disabled
//                 ? 'cursor-not-allowed opacity-50'
//                 : 'transform hover:-translate-y-1 active:translate-y-0'
//             }`}
//           >
//             {isLoggedIn ? (
//               isSelected ? (
//                 '✓ Selected'
//               ) : (
//                 'Choose Plan'
//               )
//             ) : (
//               '🔐 Login to Purchase'
//             )}
//           </button>
//         )}
//       </div>
//     </div>
//   );
// };

// console.log('✅ PlanCard Component loaded - PRODUCTION v2.0'); 
// ═══════════════════════════════════════════════════════════════
// ✅ PLAN CARD - PRODUCTION READY v3.0 - COMPLETE DISPLAY
// ═══════════════════════════════════════════════════════════════

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Clock, Zap } from 'lucide-react';
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
  
  const [showAllFeatures, setShowAllFeatures] = useState(false);
  
  const handleSelect = () => {
    if (!disabled && onSelect) {
      onSelect(plan.id);
    }
  };

  // ═══════════════════════════════════════════════════════════════
  // FEATURES DISPLAY LOGIC
  // ═══════════════════════════════════════════════════════════════
  const INITIAL_FEATURES_COUNT = 3;
  const visibleFeatures = showAllFeatures 
    ? plan.features 
    : plan.features.slice(0, INITIAL_FEATURES_COUNT);
  const hasMoreFeatures = plan.features.length > INITIAL_FEATURES_COUNT;
  const remainingFeaturesCount = plan.features.length - INITIAL_FEATURES_COUNT;

  // ═══════════════════════════════════════════════════════════════
  // VALIDITY DISPLAY HELPER
  // ═══════════════════════════════════════════════════════════════
  const getValidityDisplay = () => {
    const duration = plan.validity_duration;
    const unit = plan.validity_unit;
    
    if (!duration || duration <= 0) return 'No validity set';
    
    // Singular/Plural handling
    if (duration === 1) {
      const singular = unit.replace(/s$/, '');
      return `${duration} ${singular}`;
    }
    return `${duration} ${unit}`;
  };

  // ═══════════════════════════════════════════════════════════════
  // SCAN LIMIT DISPLAY HELPER
  // ═══════════════════════════════════════════════════════════════
  const getScanLimitDisplay = () => {
    if (!plan.limits?.max_scans) return 'Not set';
    if (plan.limits.max_scans === -1) return 'Unlimited';
    return plan.limits.max_scans.toLocaleString('en-IN');
  };

  return (
    <div
      className={`relative bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 ${
        isSelected
          ? 'ring-4 ring-purple-500 transform scale-105'
          : 'hover:shadow-xl hover:-translate-y-1'
      } ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`}
    >
      {/* ═══════════════════════════════════════════════════════════ */}
      {/* POPULAR BADGE */}
      {/* ═══════════════════════════════════════════════════════════ */}
      {plan.is_popular && (
        <div className="absolute top-0 right-0 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-1 rounded-bl-xl font-bold text-xs sm:text-sm shadow-lg z-10">
          ⭐ POPULAR
        </div>
      )}

      <div className="p-6 sm:p-8">
        {/* ═══════════════════════════════════════════════════════════ */}
        {/* PLAN NAME */}
        {/* ═══════════════════════════════════════════════════════════ */}
        <h3 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">
          {plan.plan_name}
        </h3>

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* PRICE SECTION */}
        {/* ═══════════════════════════════════════════════════════════ */}
        <div className="mb-6">
          <div className="flex items-baseline gap-2">
            <span className="text-4xl sm:text-5xl font-extrabold text-purple-600">
              ₹{plan.price.toLocaleString('en-IN')}
            </span>
            <span className="text-gray-600 text-lg">
              /{plan.billing_cycle === 'monthly' ? 'month' : 'year'}
            </span>
          </div>
         
        </div>

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* VALIDITY & SCAN LIMITS - HIGHLIGHTED SECTION */}
        {/* ═══════════════════════════════════════════════════════════ */}
        <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Plan Validity */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-blue-600" />
              <p className="text-xs font-semibold text-blue-900 uppercase tracking-wide">
                Plan Validity
              </p>
            </div>
            <p className="text-xl sm:text-2xl font-bold text-blue-700">
              {getValidityDisplay()}
            </p>
          </div>

          {/* Scan Limit */}
          <div className="bg-gradient-to-br from-orange-50 to-red-50 border-2 border-orange-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-4 h-4 text-orange-600" />
              <p className="text-xs font-semibold text-orange-900 uppercase tracking-wide">
                Total Scans
              </p>
            </div>
            <p className="text-xl sm:text-2xl font-bold text-orange-700">
              {getScanLimitDisplay()}
              {plan.limits?.max_scans !== -1 && plan.limits?.max_scans && (
                <span className="text-sm font-normal text-orange-600 ml-1">scans</span>
              )}
            </p>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* FEATURES SECTION */}
        {/* ═══════════════════════════════════════════════════════════ */}
        <div className="space-y-3 mb-6">
          <h4 className="font-semibold text-gray-700 text-sm uppercase tracking-wide flex items-center gap-2">
            ✨ Features
            <span className="text-xs font-normal text-gray-500 normal-case">
              ({plan.features.length} {plan.features.length === 1 ? 'feature' : 'features'})
            </span>
          </h4>

          <div className="space-y-3">
            {visibleFeatures.map((feature, index) => (
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

          {/* ═══════════════════════════════════════════════════════════ */}
          {/* SHOW MORE / SHOW LESS BUTTON */}
          {/* ═══════════════════════════════════════════════════════════ */}
          {hasMoreFeatures && (
            <button
              onClick={() => setShowAllFeatures(!showAllFeatures)}
              className="w-full mt-3 bg-purple-50 hover:bg-purple-100 text-purple-700 px-4 py-2.5 rounded-lg transition-all duration-200 text-sm font-semibold flex items-center justify-center gap-2 border border-purple-200 hover:border-purple-300 active:scale-95"
            >
              {showAllFeatures ? (
                <>
                  <ChevronUp className="w-4 h-4" />
                  Show Less Features
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4" />
                  Show {remainingFeaturesCount} More Feature{remainingFeaturesCount !== 1 ? 's' : ''}
                </>
              )}
            </button>
          )}
        </div>

       

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* SELECT BUTTON */}
        {/* ═══════════════════════════════════════════════════════════ */}
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

console.log('✅ PlanCard Component loaded - PRODUCTION v3.0 - COMPLETE DISPLAY');