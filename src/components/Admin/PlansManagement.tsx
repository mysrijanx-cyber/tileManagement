
// import React, { useState, useEffect } from 'react';
// import { Plus, Edit, Trash2, ToggleLeft, ToggleRight, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react';
// import { getAllPlans, deletePlan, togglePlanStatus } from '../../lib/planService';
// import { CreatePlanModal } from './CreatePlanModal';
// import { EditPlanModal } from './EditPlanModal';
// import type { Plan } from '../../types/plan.types';

// export const PlansManagement: React.FC = () => {
//   const [plans, setPlans] = useState<Plan[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [showCreateModal, setShowCreateModal] = useState(false);
//   const [showEditModal, setShowEditModal] = useState(false);
//   const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
//   const [processingAction, setProcessingAction] = useState<string | null>(null);
//   const [expandedFeatures, setExpandedFeatures] = useState<Set<string>>(new Set());

//   useEffect(() => {
//     loadPlans();
//   }, []);

//   const loadPlans = async () => {
//     setLoading(true);
//     try {
//       const allPlans = await getAllPlans();
//       setPlans(allPlans);
//     } catch (error) {
//       console.error('Error loading plans:', error);
//       alert('❌ Failed to load plans');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleEdit = (plan: Plan) => {
//     setSelectedPlan(plan);
//     setShowEditModal(true);
//   };

//   // const handleDelete = async (plan: Plan) => {
//   //   const confirmed = confirm(
//   //     `🗑️ Delete Plan?\n\n` +
//   //     `Plan: ${plan.plan_name}\n` +
//   //     `Price: ₹${plan.price}\n\n` +
//   //     `This action cannot be undone if no subscriptions exist.\n\n` +
//   //     `Continue?`
//   //   );

//   //   if (!confirmed) return;

//   //   setProcessingAction(plan.id);

//   //   try {
//   //     const result = await deletePlan(plan.id);

//   //     if (result.success) {
//   //       alert('✅ Plan deleted successfully');
//   //       await loadPlans();
//   //     } else {
//   //       alert(`❌ Failed to delete plan:\n${result.error}`);
//   //     }
//   //   } catch (error: any) {
//   //     alert(`❌ Error: ${error.message}`);
//   //   } finally {
//   //     setProcessingAction(null);
//   //   }
//   // }; 
// const handleDelete = async (plan: Plan) => {
//   // ═══════════════════════════════════════════════════════════
//   // STEP 1: Show Warning Dialog
//   // ═══════════════════════════════════════════════════════════
  
//   const userResponse = prompt(
//     `⚠️ PERMANENT DELETE WARNING\n\n` +
//     `Plan: ${plan.plan_name}\n` +
//     `Price: ₹${plan.price}\n` +
//     `Features: ${plan.features.length}\n\n` +
//     `⚠️ This action will:\n` +
//     `• Permanently delete this plan\n` +
//     `• Remove it from all listings\n` +
//     `• Cannot be undone\n\n` +
//     `${plan.is_active ? '⚠️ This plan is currently ACTIVE\n\n' : ''}` +
//     `Type "DELETE" (in capital letters) to confirm:`
//   );

//   // Check if user typed "DELETE" exactly
//   if (userResponse !== 'DELETE') {
//     if (userResponse !== null) {
//       alert('❌ Deletion cancelled.\n\nYou must type "DELETE" exactly (in capitals) to confirm.');
//     }
//     return;
//   }

//   // ═══════════════════════════════════════════════════════════
//   // STEP 2: Delete Plan
//   // ═══════════════════════════════════════════════════════════
  
//   setProcessingAction(plan.id);

//   try {
//     const result = await deletePlan(plan.id);

//     if (result.success) {
//       alert(`✅ SUCCESS!\n\n${result.data || 'Plan deleted successfully!'}`);
//       await loadPlans();
//     } else {
//       alert(`❌ FAILED\n\n${result.error}`);
//     }
//   } catch (error: any) {
//     console.error('❌ Error in handleDelete:', error);
//     alert(`❌ ERROR\n\n${error.message || 'Failed to delete plan'}`);
//   } finally {
//     setProcessingAction(null);
//   }
// };


//   const handleToggleStatus = async (plan: Plan) => {
//     const newStatus = !plan.is_active;
//     const action = newStatus ? 'activate' : 'deactivate';

//     const confirmed = confirm(
//       `${newStatus ? '✅' : '❌'} ${action.toUpperCase()} Plan?\n\n` +
//       `Plan: ${plan.plan_name}\n\n` +
//       `This will ${action} the plan for customers.\n\n` +
//       `Continue?`
//     );

//     if (!confirmed) return;

//     setProcessingAction(plan.id);

//     try {
//       const result = await togglePlanStatus(plan.id, newStatus);

//       if (result.success) {
//         alert(`✅ Plan ${newStatus ? 'activated' : 'deactivated'} successfully`);
//         await loadPlans();
//       } else {
//         alert(`❌ Failed to toggle status:\n${result.error}`);
//       }
//     } catch (error: any) {
//       alert(`❌ Error: ${error.message}`);
//     } finally {
//       setProcessingAction(null);
//     }
//   };

//   const toggleFeaturesExpanded = (planId: string) => {
//     setExpandedFeatures(prev => {
//       const newSet = new Set(prev);
//       if (newSet.has(planId)) {
//         newSet.delete(planId);
//       } else {
//         newSet.add(planId);
//       }
//       return newSet;
//     });
//   };

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center py-12">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-purple-600 mx-auto mb-4"></div>
//           <p className="text-gray-600">Loading plans...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl p-6 text-white">
//         <div className="flex items-center justify-between">
//           <div>
//             <h2 className="text-2xl font-bold mb-1">💎 Plans Management</h2>
//             <p className="text-purple-100">Create, edit, and manage subscription plans</p>
//           </div>
//           <div className="flex gap-3">
//             <button
//               onClick={loadPlans}
//               className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
//             >
//               <RefreshCw className="w-4 h-4" />
//               Refresh
//             </button>
//             <button
//               onClick={() => setShowCreateModal(true)}
//               className="bg-white text-purple-600 px-6 py-2 rounded-lg hover:bg-purple-50 transition-colors font-semibold flex items-center gap-2"
//             >
//               <Plus className="w-5 h-5" />
//               Create Plan
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Stats */}
//       <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//         <div className="bg-white rounded-xl p-4 border border-gray-200">
//           <p className="text-sm text-gray-600 mb-1">Total Plans</p>
//           <p className="text-2xl font-bold text-gray-800">{plans.length}</p>
//         </div>
//         <div className="bg-green-50 rounded-xl p-4 border border-green-200">
//           <p className="text-sm text-green-600 mb-1">Active Plans</p>
//           <p className="text-2xl font-bold text-green-800">{plans.filter(p => p.is_active).length}</p>
//         </div>
//         <div className="bg-red-50 rounded-xl p-4 border border-red-200">
//           <p className="text-sm text-red-600 mb-1">Inactive Plans</p>
//           <p className="text-2xl font-bold text-red-800">{plans.filter(p => !p.is_active).length}</p>
//         </div>
//         <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-200">
//           <p className="text-sm text-yellow-600 mb-1">Popular Plans</p>
//           <p className="text-2xl font-bold text-yellow-800">{plans.filter(p => p.is_popular).length}</p>
//         </div>
//       </div>

//       {/* Plans List */}
//       {plans.length === 0 ? (
//         <div className="bg-white rounded-xl p-12 text-center border border-gray-200">
//           <div className="text-gray-400 text-6xl mb-4">📦</div>
//           <h3 className="text-xl font-semibold text-gray-700 mb-2">No Plans Created</h3>
//           <p className="text-gray-600 mb-6">Create your first subscription plan to get started</p>
//           <button
//             onClick={() => setShowCreateModal(true)}
//             className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 font-semibold inline-flex items-center gap-2"
//           >
//             <Plus className="w-5 h-5" />
//             Create First Plan
//           </button>
//         </div>
//       ) : (
//         <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
//           {plans.map((plan) => {
//             const isExpanded = expandedFeatures.has(plan.id);
//             const visibleFeatures = isExpanded ? plan.features : plan.features.slice(0, 3);
//             const remainingCount = plan.features.length - 3;

//             return (
//               <div
//                 key={plan.id}
//                 className={`bg-white rounded-xl shadow-lg overflow-hidden border-2 transition-all ${
//                   plan.is_active ? 'border-green-200' : 'border-gray-200 opacity-75'
//                 }`}
//               >
//                 {/* Plan Header */}
//                 <div className={`p-4 ${plan.is_popular ? 'bg-gradient-to-r from-yellow-400 to-orange-500' : 'bg-gray-100'}`}>
//                   <div className="flex items-start justify-between">
//                     <div>
//                       <h3 className={`text-xl font-bold ${plan.is_popular ? 'text-white' : 'text-gray-800'}`}>
//                         {plan.plan_name}
//                       </h3>
//                       <p className={`text-sm ${plan.is_popular ? 'text-white text-opacity-90' : 'text-gray-600'}`}>
//                         Valid for: {plan.validity_duration} {plan.validity_unit}
//                       </p>
//                     </div>
//                     <div className="flex flex-col gap-1">
//                       {plan.is_popular && (
//                         <span className="bg-white text-orange-600 text-xs font-bold px-2 py-1 rounded">⭐ POPULAR</span>
//                       )}
//                       {plan.is_active ? (
//                         <span className="bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded">✓ Active</span>
//                       ) : (
//                         <span className="bg-red-100 text-red-800 text-xs font-bold px-2 py-1 rounded">✗ Inactive</span>
//                       )}
//                     </div>
//                   </div>
//                 </div>

//                 {/* Price */}
//                 <div className="p-6 border-b">
//                   <div className="flex items-baseline gap-2">
//                     <span className="text-4xl font-extrabold text-purple-600">₹{plan.price.toLocaleString('en-IN')}</span>
//                     <span className="text-gray-600">/{plan.billing_cycle === 'monthly' ? 'mo' : 'yr'}</span>
//                   </div>
//                 </div>

//                 {/* Features */}
//                 <div className="p-6 border-b">
//                   <h4 className="font-semibold text-gray-700 mb-3 text-sm">Features:</h4>
//                   <div className="space-y-2">
//                     {visibleFeatures.map((feature, idx) => (
//                       <div key={idx} className="flex items-start gap-2 text-sm">
//                         {feature.included ? (
//                           <span className="text-green-600 mt-0.5">✓</span>
//                         ) : (
//                           <span className="text-gray-400 mt-0.5">✗</span>
//                         )}
//                         <div className="flex-1">
//                           <span className={`${feature.included ? 'text-gray-700' : 'text-gray-400 line-through'}`}>
//                             {feature.icon && <span className="mr-1">{feature.icon}</span>}
//                             {feature.title}
//                           </span>
//                           {feature.description && (
//                             <p className="text-xs text-gray-500 mt-0.5">{feature.description}</p>
//                           )}
//                         </div>
//                       </div>
//                     ))}
//                   </div>

//                   {/* Show More/Less Button */}
//                   {plan.features.length > 3 && (
//                     <button
//                       onClick={() => toggleFeaturesExpanded(plan.id)}
//                       className="mt-3 w-full bg-purple-50 hover:bg-purple-100 text-purple-600 px-3 py-2 rounded-lg transition-colors text-sm font-medium flex items-center justify-center gap-2"
//                     >
//                       {isExpanded ? (
//                         <>
//                           <ChevronUp className="w-4 h-4" />
//                           Show Less
//                         </>
//                       ) : (
//                         <>
//                           <ChevronDown className="w-4 h-4" />
//                           +{remainingCount} more feature{remainingCount !== 1 ? 's' : ''}
//                         </>
//                       )}
//                     </button>
//                   )}
//                 </div>

//                 {/* Actions */}
//                 <div className="p-4 flex gap-2">
//                   <button
//                     onClick={() => handleEdit(plan)}
//                     disabled={processingAction === plan.id}
//                     className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 text-sm font-medium flex items-center justify-center gap-2 disabled:opacity-50 transition-colors"
//                   >
//                     <Edit className="w-4 h-4" />
//                     Edit
//                   </button>

//                   <button
//                     onClick={() => handleToggleStatus(plan)}
//                     disabled={processingAction === plan.id}
//                     className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2 disabled:opacity-50 transition-colors ${
//                       plan.is_active
//                         ? 'bg-orange-600 text-white hover:bg-orange-700'
//                         : 'bg-green-600 text-white hover:bg-green-700'
//                     }`}
//                   >
//                     {processingAction === plan.id ? (
//                       <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
//                     ) : plan.is_active ? (
//                       <>
//                         <ToggleLeft className="w-4 h-4" />
//                         Disable
//                       </>
//                     ) : (
//                       <>
//                         <ToggleRight className="w-4 h-4" />
//                         Enable
//                       </>
//                     )}
//                   </button>

//                   <button
//                     onClick={() => handleDelete(plan)}
//                     disabled={processingAction === plan.id}
//                     className="bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 text-sm font-medium flex items-center justify-center disabled:opacity-50 transition-colors"
//                   >
//                     <Trash2 className="w-4 h-4" />
//                   </button>
//                 </div>

//                 {/* Metadata */}
//                 <div className="px-4 pb-4 text-xs text-gray-500">
//                   <p>Created: {new Date(plan.created_at).toLocaleDateString()}</p>
//                   {plan.updated_at && (
//                     <p>Updated: {new Date(plan.updated_at).toLocaleDateString()}</p>
//                   )}
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       )}

//       {/* Modals */}
//       <CreatePlanModal
//         isOpen={showCreateModal}
//         onClose={() => setShowCreateModal(false)}
//         onSuccess={() => {
//           loadPlans();
//           setShowCreateModal(false);
//         }}
//       />

//       <EditPlanModal
//         isOpen={showEditModal}
//         onClose={() => {
//           setShowEditModal(false);
//           setSelectedPlan(null);
//         }}
//         onSuccess={() => {
//           loadPlans();
//           setShowEditModal(false);
//           setSelectedPlan(null);
//         }}
//         plan={selectedPlan}
//       />
//     </div>
//   );
// };

// console.log('✅ PlansManagement Component loaded - PRODUCTION v2.0'); 
// ✅ PRODUCTION v3.0 - FULLY RESPONSIVE ALL DEVICES
import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, ToggleLeft, ToggleRight, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react';
import { getAllPlans, deletePlan, togglePlanStatus } from '../../lib/planService';
import { CreatePlanModal } from './CreatePlanModal';
import { EditPlanModal } from './EditPlanModal';
import type { Plan } from '../../types/plan.types';

export const PlansManagement: React.FC = () => {
  // ═══════════════════════════════════════════════════════════════
  // STATE MANAGEMENT
  // ═══════════════════════════════════════════════════════════════
  
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [processingAction, setProcessingAction] = useState<string | null>(null);
  const [expandedFeatures, setExpandedFeatures] = useState<Set<string>>(new Set());

  // ═══════════════════════════════════════════════════════════════
  // EFFECTS
  // ═══════════════════════════════════════════════════════════════
  
  useEffect(() => {
    loadPlans();
  }, []);

  // ═══════════════════════════════════════════════════════════════
  // HANDLERS
  // ═══════════════════════════════════════════════════════════════

  const loadPlans = async () => {
    setLoading(true);
    try {
      const allPlans = await getAllPlans();
      setPlans(allPlans);
    } catch (error) {
      console.error('Error loading plans:', error);
      alert('❌ Failed to load plans');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (plan: Plan) => {
    setSelectedPlan(plan);
    setShowEditModal(true);
  };

  const handleDelete = async (plan: Plan) => {
    const userResponse = prompt(
      `⚠️ PERMANENT DELETE WARNING\n\n` +
      `Plan: ${plan.plan_name}\n` +
      `Price: ₹${plan.price}\n` +
      `Features: ${plan.features.length}\n\n` +
      `⚠️ This action will:\n` +
      `• Permanently delete this plan\n` +
      `• Remove it from all listings\n` +
      `• Cannot be undone\n\n` +
      `${plan.is_active ? '⚠️ This plan is currently ACTIVE\n\n' : ''}` +
      `Type "DELETE" (in capital letters) to confirm:`
    );

    if (userResponse !== 'DELETE') {
      if (userResponse !== null) {
        alert('❌ Deletion cancelled.\n\nYou must type "DELETE" exactly (in capitals) to confirm.');
      }
      return;
    }

    setProcessingAction(plan.id);

    try {
      const result = await deletePlan(plan.id);

      if (result.success) {
        alert(`✅ SUCCESS!\n\n${result.data || 'Plan deleted successfully!'}`);
        await loadPlans();
      } else {
        alert(`❌ FAILED\n\n${result.error}`);
      }
    } catch (error: any) {
      console.error('❌ Error in handleDelete:', error);
      alert(`❌ ERROR\n\n${error.message || 'Failed to delete plan'}`);
    } finally {
      setProcessingAction(null);
    }
  };

  const handleToggleStatus = async (plan: Plan) => {
    const newStatus = !plan.is_active;
    const action = newStatus ? 'activate' : 'deactivate';

    const confirmed = confirm(
      `${newStatus ? '✅' : '❌'} ${action.toUpperCase()} Plan?\n\n` +
      `Plan: ${plan.plan_name}\n\n` +
      `This will ${action} the plan for customers.\n\n` +
      `Continue?`
    );

    if (!confirmed) return;

    setProcessingAction(plan.id);

    try {
      const result = await togglePlanStatus(plan.id, newStatus);

      if (result.success) {
        alert(`✅ Plan ${newStatus ? 'activated' : 'deactivated'} successfully`);
        await loadPlans();
      } else {
        alert(`❌ Failed to toggle status:\n${result.error}`);
      }
    } catch (error: any) {
      alert(`❌ Error: ${error.message}`);
    } finally {
      setProcessingAction(null);
    }
  };

  const toggleFeaturesExpanded = (planId: string) => {
    setExpandedFeatures(prev => {
      const newSet = new Set(prev);
      if (newSet.has(planId)) {
        newSet.delete(planId);
      } else {
        newSet.add(planId);
      }
      return newSet;
    });
  };

  // ═══════════════════════════════════════════════════════════════
  // LOADING STATE - RESPONSIVE
  // ═══════════════════════════════════════════════════════════════
  
  if (loading) {
    return (
      <div className="flex items-center justify-center py-8 sm:py-12 px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-4 border-purple-600 mx-auto mb-3 sm:mb-4"></div>
          <p className="text-gray-600 text-sm sm:text-base">Loading plans...</p>
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════
  // RENDER - FULLY RESPONSIVE
  // ═══════════════════════════════════════════════════════════════

  return (
    <div className="space-y-4 sm:space-y-6 px-3 sm:px-0">
      
      {/* ═══════════════════════════════════════════════════════════ */}
      {/* HEADER - RESPONSIVE */}
      {/* ═══════════════════════════════════════════════════════════ */}
      
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl p-4 sm:p-6 text-white">
        <div className="flex flex-col gap-4">
          {/* Title */}
          <div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-1">
              💎 Plans Management
            </h2>
            <p className="text-purple-100 text-xs sm:text-sm lg:text-base">
              Create, edit, and manage subscription plans
            </p>
          </div>
          
          {/* Buttons - Responsive */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <button
              onClick={loadPlans}
              className="w-full sm:w-auto bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-4 py-2.5 sm:py-2 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm sm:text-base font-medium active:scale-95"
            >
              <RefreshCw className="w-4 h-4" />
              <span className="hidden sm:inline">Refresh</span>
              <span className="sm:hidden">Refresh Plans</span>
            </button>
            <button
              onClick={() => setShowCreateModal(true)}
              className="w-full sm:w-auto sm:flex-1 bg-white text-purple-600 px-4 sm:px-6 py-2.5 sm:py-2 rounded-lg hover:bg-purple-50 transition-colors font-semibold flex items-center justify-center gap-2 text-sm sm:text-base shadow-md hover:shadow-lg active:scale-95"
            >
              <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
              Create Plan
            </button>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* STATS - RESPONSIVE GRID */}
      {/* ═══════════════════════════════════════════════════════════ */}
      
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
        <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 border border-gray-200 shadow-sm">
          <p className="text-xs sm:text-sm text-gray-600 mb-1">Total Plans</p>
          <p className="text-xl sm:text-2xl font-bold text-gray-800">{plans.length}</p>
        </div>
        <div className="bg-green-50 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-green-200 shadow-sm">
          <p className="text-xs sm:text-sm text-green-600 mb-1">Active</p>
          <p className="text-xl sm:text-2xl font-bold text-green-800">
            {plans.filter(p => p.is_active).length}
          </p>
        </div>
        <div className="bg-red-50 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-red-200 shadow-sm">
          <p className="text-xs sm:text-sm text-red-600 mb-1">Inactive</p>
          <p className="text-xl sm:text-2xl font-bold text-red-800">
            {plans.filter(p => !p.is_active).length}
          </p>
        </div>
        <div className="bg-yellow-50 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-yellow-200 shadow-sm">
          <p className="text-xs sm:text-sm text-yellow-600 mb-1">Popular</p>
          <p className="text-xl sm:text-2xl font-bold text-yellow-800">
            {plans.filter(p => p.is_popular).length}
          </p>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* PLANS LIST - RESPONSIVE */}
      {/* ═══════════════════════════════════════════════════════════ */}
      
      {plans.length === 0 ? (
        
        /* EMPTY STATE - RESPONSIVE */
        <div className="bg-white rounded-xl p-8 sm:p-12 text-center border border-gray-200">
          <div className="text-gray-400 text-4xl sm:text-6xl mb-3 sm:mb-4">📦</div>
          <h3 className="text-lg sm:text-xl font-semibold text-gray-700 mb-2">
            No Plans Created
          </h3>
          <p className="text-gray-600 text-sm sm:text-base mb-4 sm:mb-6 px-4">
            Create your first subscription plan to get started
          </p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-purple-600 text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-lg hover:bg-purple-700 font-semibold inline-flex items-center gap-2 text-sm sm:text-base shadow-md hover:shadow-lg transition-all active:scale-95"
          >
            <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
            Create First Plan
          </button>
        </div>
      ) : (
        
        /* PLANS GRID - RESPONSIVE */
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
          {plans.map((plan) => {
            const isExpanded = expandedFeatures.has(plan.id);
            const visibleFeatures = isExpanded ? plan.features : plan.features.slice(0, 3);
            const remainingCount = plan.features.length - 3;

            return (
              <div
                key={plan.id}
                className={`bg-white rounded-xl shadow-lg overflow-hidden border-2 transition-all hover:shadow-xl ${
                  plan.is_active ? 'border-green-200' : 'border-gray-200 opacity-75'
                }`}
              >
                
                {/* ═══════════════════════════════════════════════════ */}
                {/* PLAN HEADER - RESPONSIVE */}
                {/* ═══════════════════════════════════════════════════ */}
                
                <div className={`p-3 sm:p-4 ${
                  plan.is_popular 
                    ? 'bg-gradient-to-r from-yellow-400 to-orange-500' 
                    : 'bg-gray-100'
                }`}>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <h3 className={`text-base sm:text-lg lg:text-xl font-bold truncate ${
                        plan.is_popular ? 'text-white' : 'text-gray-800'
                      }`}>
                        {plan.plan_name}
                      </h3>
                      <p className={`text-xs sm:text-sm mt-0.5 ${
                        plan.is_popular ? 'text-white text-opacity-90' : 'text-gray-600'
                      }`}>
                        Valid: {plan.validity_duration} {plan.validity_unit}
                      </p>
                    </div>
                    <div className="flex flex-col gap-1 flex-shrink-0">
                      {plan.is_popular && (
                        <span className="bg-white text-orange-600 text-[10px] sm:text-xs font-bold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded whitespace-nowrap">
                          ⭐ POPULAR
                        </span>
                      )}
                      {plan.is_active ? (
                        <span className="bg-green-100 text-green-800 text-[10px] sm:text-xs font-bold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded whitespace-nowrap">
                          ✓ Active
                        </span>
                      ) : (
                        <span className="bg-red-100 text-red-800 text-[10px] sm:text-xs font-bold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded whitespace-nowrap">
                          ✗ Inactive
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* ═══════════════════════════════════════════════════ */}
                {/* PRICE - RESPONSIVE */}
                {/* ═══════════════════════════════════════════════════ */}
                
                <div className="p-4 sm:p-6 border-b">
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-purple-600">
                      ₹{plan.price.toLocaleString('en-IN')}
                    </span>
                    <span className="text-gray-600 text-sm sm:text-base">
                      /{plan.billing_cycle === 'monthly' ? 'mo' : 'yr'}
                    </span>
                  </div>
                </div>

                {/* ═══════════════════════════════════════════════════ */}
                {/* FEATURES - RESPONSIVE */}
                {/* ═══════════════════════════════════════════════════ */}
                
                <div className="p-4 sm:p-6 border-b">
                  <h4 className="font-semibold text-gray-700 mb-2 sm:mb-3 text-xs sm:text-sm">
                    Features:
                  </h4>
                  <div className="space-y-1.5 sm:space-y-2">
                    {visibleFeatures.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs sm:text-sm">
                        {feature.included ? (
                          <span className="text-green-600 mt-0.5 flex-shrink-0">✓</span>
                        ) : (
                          <span className="text-gray-400 mt-0.5 flex-shrink-0">✗</span>
                        )}
                        <div className="flex-1 min-w-0">
                          <span className={`${
                            feature.included ? 'text-gray-700' : 'text-gray-400 line-through'
                          }`}>
                            {feature.icon && <span className="mr-1">{feature.icon}</span>}
                            {feature.title}
                          </span>
                          {feature.description && (
                            <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5 break-words">
                              {feature.description}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Show More/Less Button - RESPONSIVE */}
                  {plan.features.length > 3 && (
                    <button
                      onClick={() => toggleFeaturesExpanded(plan.id)}
                      className="mt-2 sm:mt-3 w-full bg-purple-50 hover:bg-purple-100 text-purple-600 px-3 py-2 rounded-lg transition-colors text-xs sm:text-sm font-medium flex items-center justify-center gap-2 active:scale-95"
                    >
                      {isExpanded ? (
                        <>
                          <ChevronUp className="w-3 h-3 sm:w-4 sm:h-4" />
                          Show Less
                        </>
                      ) : (
                        <>
                          <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4" />
                          +{remainingCount} more
                        </>
                      )}
                    </button>
                  )}
                </div>

                {/* ═══════════════════════════════════════════════════ */}
                {/* ACTIONS - RESPONSIVE BUTTONS */}
                {/* ═══════════════════════════════════════════════════ */}
                
                <div className="p-3 sm:p-4 flex flex-col sm:flex-row gap-2">
                  <button
                    onClick={() => handleEdit(plan)}
                    disabled={processingAction === plan.id}
                    className="w-full sm:flex-1 bg-blue-600 text-white px-3 py-2.5 sm:py-2 rounded-lg hover:bg-blue-700 text-xs sm:text-sm font-medium flex items-center justify-center gap-2 disabled:opacity-50 transition-all shadow-sm hover:shadow-md active:scale-95"
                  >
                    <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
                    Edit
                  </button>

                  <button
                    onClick={() => handleToggleStatus(plan)}
                    disabled={processingAction === plan.id}
                    className={`w-full sm:flex-1 px-3 py-2.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium flex items-center justify-center gap-2 disabled:opacity-50 transition-all shadow-sm hover:shadow-md active:scale-95 ${
                      plan.is_active
                        ? 'bg-orange-600 text-white hover:bg-orange-700'
                        : 'bg-green-600 text-white hover:bg-green-700'
                    }`}
                  >
                    {processingAction === plan.id ? (
                      <div className="animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border-b-2 border-white"></div>
                    ) : plan.is_active ? (
                      <>
                        <ToggleLeft className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span className="hidden sm:inline">Disable</span>
                        <span className="sm:hidden">Off</span>
                      </>
                    ) : (
                      <>
                        <ToggleRight className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span className="hidden sm:inline">Enable</span>
                        <span className="sm:hidden">On</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => handleDelete(plan)}
                    disabled={processingAction === plan.id}
                    className="w-full sm:w-auto bg-red-600 text-white px-3 py-2.5 sm:py-2 rounded-lg hover:bg-red-700 text-xs sm:text-sm font-medium flex items-center justify-center gap-2 disabled:opacity-50 transition-all shadow-sm hover:shadow-md active:scale-95"
                  >
                    <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="hidden sm:inline">Delete</span>
                  </button>
                </div>

                {/* ═══════════════════════════════════════════════════ */}
                {/* METADATA - RESPONSIVE */}
                {/* ═══════════════════════════════════════════════════ */}
                
                <div className="px-3 sm:px-4 pb-3 sm:pb-4 text-[10px] sm:text-xs text-gray-500 space-y-0.5">
                  <p>Created: {new Date(plan.created_at).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                  })}</p>
                  {plan.updated_at && (
                    <p>Updated: {new Date(plan.updated_at).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    })}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* MODALS */}
      {/* ═══════════════════════════════════════════════════════════ */}
      
      <CreatePlanModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={() => {
          loadPlans();
          setShowCreateModal(false);
        }}
      />

      <EditPlanModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedPlan(null);
        }}
        onSuccess={() => {
          loadPlans();
          setShowEditModal(false);
          setSelectedPlan(null);
        }}
        plan={selectedPlan}
      />
    </div>
  );
};

console.log('✅ PlansManagement Component loaded - PRODUCTION v3.0 (Fully Responsive)');