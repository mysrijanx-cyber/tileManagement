
// import React, { useState, useEffect } from 'react';
// import { X, Clock, Plus, Trash2, Package, QrCode } from 'lucide-react';
// import { updatePlan, validatePlanData, getValidityDisplayText } from '../../lib/planService';
// import type { Plan, UpdatePlanData, PlanFeature, PlanValidationError, PlanLimits } from '../../types/plan.types';

// interface EditPlanModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   onSuccess: () => void;
//   plan: Plan | null;
// }

// export const EditPlanModal: React.FC<EditPlanModalProps> = ({
//   isOpen,
//   onClose,
//   onSuccess,
//   plan
// }) => {
//   // ═══════════════════════════════════════════════════════════════
//   // STATE MANAGEMENT
//   // ═══════════════════════════════════════════════════════════════
  
//   const [formData, setFormData] = useState<UpdatePlanData>({
//     plan_name: '',
//     price: 0,
//     currency: 'INR',
//     billing_cycle: 'monthly',
//     validity_duration: 30,
//     validity_unit: 'days',
//     features: [],
//     limits: {
//       max_tiles: -1,
//       max_collections: -1,
//       max_qr_codes: -1,
//       max_workers: 1,
//       max_storage_mb: 1000,
//       analytics_retention_days: 365,
//       customer_inquiries_limit: -1,
//       max_scans: -1  // ✅ ADDED
//     },
//     is_active: true,
//     is_popular: false,
//     display_order: 1,
//     updated_by: ''
//   });

//   const [errors, setErrors] = useState<PlanValidationError>({});
//   const [updating, setUpdating] = useState(false);
//   const [successMessage, setSuccessMessage] = useState<string | null>(null);

//   // ═══════════════════════════════════════════════════════════════
//   // LOAD PLAN DATA
//   // ═══════════════════════════════════════════════════════════════
  
//   useEffect(() => {
//     if (plan && isOpen) {
//       console.log('📋 Loading plan data for editing:', plan.plan_name);
      
//       setFormData({
//         plan_name: plan.plan_name,
//         price: plan.price,
//         currency: plan.currency,
//         billing_cycle: plan.billing_cycle,
//         validity_duration: plan.validity_duration || 30,
//         validity_unit: plan.validity_unit || 'days',
//         features: plan.features && plan.features.length > 0 
//           ? [...plan.features]
//           : [{ title: '', description: '', included: true, icon: '' }], // ✅ Minimum 1
//         limits: {
//           max_tiles: plan.limits?.max_tiles ?? -1,
//           max_collections: plan.limits?.max_collections ?? -1,
//           max_qr_codes: plan.limits?.max_qr_codes ?? -1,
//           max_workers: plan.limits?.max_workers ?? 1,
//           max_storage_mb: plan.limits?.max_storage_mb ?? 1000,
//           analytics_retention_days: plan.limits?.analytics_retention_days ?? 365,
//           customer_inquiries_limit: plan.limits?.customer_inquiries_limit ?? -1,
//           max_scans: plan.limits?.max_scans ?? -1  // ✅ LOAD SCAN LIMIT
//         },
//         is_active: plan.is_active,
//         is_popular: plan.is_popular ?? false,
//         display_order: plan.display_order ?? 1,
//         updated_by: ''
//       });
      
//       console.log('✅ Plan data loaded. Features:', plan.features?.length || 0);
//       console.log('✅ Max scans:', plan.limits?.max_scans ?? -1);
//     }
//   }, [plan, isOpen]);

//   // ═══════════════════════════════════════════════════════════════
//   // HANDLERS
//   // ═══════════════════════════════════════════════════════════════

//   const handleInputChange = (field: keyof UpdatePlanData, value: any) => {
//     setFormData(prev => ({ ...prev, [field]: value }));
    
//     // Clear error for this field
//     if (field in errors && errors[field as keyof PlanValidationError]) {
//       const newErrors = { ...errors };
//       delete newErrors[field as keyof PlanValidationError];
//       setErrors(newErrors);
//     }
//   };

//   const handleFeatureChange = (index: number, field: keyof PlanFeature, value: any) => {
//     if (!formData.features) return;
//     const newFeatures = [...formData.features];
//     newFeatures[index] = { ...newFeatures[index], [field]: value };
//     setFormData(prev => ({ ...prev, features: newFeatures }));
//   };

//   const addFeatureAfter = (index: number) => {
//     if (!formData.features) return;
//     const newFeatures = [...formData.features];
//     newFeatures.splice(index + 1, 0, { title: '', description: '', included: true, icon: '' });
//     setFormData(prev => ({ ...prev, features: newFeatures }));
//     console.log('➕ Added feature. Total:', newFeatures.length);
//   };

//   const removeFeature = (index: number) => {
//     if (!formData.features || formData.features.length <= 1) {
//       alert('⚠️ At least 1 feature is required');
//       return;
//     }
//     setFormData(prev => ({
//       ...prev,
//       features: prev.features!.filter((_, i) => i !== index)
//     }));
//     console.log('🗑️ Removed feature. Remaining:', formData.features.length - 1);
//   };

//   const handleLimitChange = (field: keyof PlanLimits, value: number) => {
//     setFormData(prev => ({
//       ...prev,
//       limits: {
//         ...prev.limits!,
//         [field]: value
//       }
//     }));
//   };

//   const getValidityPreview = () => {
//     const { validity_duration, validity_unit } = formData;
//     if (!validity_duration || validity_duration <= 0) return 'Not set';
    
//     if (validity_duration === 1) {
//       const singular = (validity_unit || 'days').replace(/s$/, '');
//       return `${validity_duration} ${singular}`;
//     }
//     return `${validity_duration} ${validity_unit || 'days'}`;
//   };

//   // ═══════════════════════════════════════════════════════════════
//   // SUBMIT HANDLER
//   // ═══════════════════════════════════════════════════════════════

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
    
//     if (!plan) {
//       console.error('❌ No plan to update');
//       return;
//     }
    
//     // ✅ Validate minimum features
//     if (!formData.features || formData.features.length < 1) {
//       alert('❌ At least 1 feature is required');
//       return;
//     }

//     // ✅ Validate features content
//     const hasEmptyFeatures = formData.features.some(f => !f.title.trim() || !f.description.trim());
//     if (hasEmptyFeatures) {
//       alert('❌ All features must have a title and description');
//       return;
//     }
    
//     console.log('🔍 Validating plan data...');
//     const validationErrors = validatePlanData(formData as any);
    
//     if (Object.keys(validationErrors).length > 0) {
//       setErrors(validationErrors);
//       const errorMsg = Object.values(validationErrors).join('\n');
//       alert(`❌ Validation Errors:\n${errorMsg}`);
//       console.error('Validation errors:', validationErrors);
//       return;
//     }
    
//     setUpdating(true);
    
//     try {
//       console.log('💾 Updating plan:', plan.id);
//       console.log('📊 Update data:', {
//         name: formData.plan_name,
//         price: formData.price,
//         features: formData.features?.length,
//         max_scans: formData.limits?.max_scans,
//         validity: `${formData.validity_duration} ${formData.validity_unit}`
//       });
      
//       const result = await updatePlan(plan.id, formData);
      
//       if (result.success) {
//         console.log('✅ Plan updated successfully');
//         setSuccessMessage('✅ Plan updated successfully!');
        
//         setTimeout(() => {
//           onSuccess();
//           onClose();
//         }, 1500);
//       } else {
//         console.error('❌ Update failed:', result.error);
//         alert(`❌ Failed to update plan:\n${result.error}`);
//       }
//     } catch (error: any) {
//       console.error('❌ Error updating plan:', error);
//       alert(`❌ Error: ${error.message}`);
//     } finally {
//       setUpdating(false);
//     }
//   };

//   // ═══════════════════════════════════════════════════════════════
//   // RENDER
//   // ═══════════════════════════════════════════════════════════════

//   if (!isOpen || !plan) return null;

//   return (
//     <div className="fixed inset-0 z-50 overflow-y-auto">
//       <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose}></div>

//       <div className="flex min-h-full items-center justify-center p-2 sm:p-4">
//         <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
          
//           {/* ═══════════════════════════════════════════════════════════ */}
//           {/* HEADER */}
//           {/* ═══════════════════════════════════════════════════════════ */}
          
//           <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 sm:p-6 z-10">
//             <div className="flex items-center justify-between">
//               <div>
//                 <h2 className="text-xl sm:text-2xl font-bold mb-1">✏️ Edit Plan</h2>
//                 <p className="text-blue-100 text-xs sm:text-sm">
//                   Modifying: <span className="font-semibold">{plan.plan_name}</span>
//                 </p>
//               </div>
//               <button 
//                 onClick={onClose} 
//                 className="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-2 transition-colors"
//                 type="button"
//               >
//                 <X className="w-5 h-5 sm:w-6 sm:h-6" />
//               </button>
//             </div>
//           </div>

//           {/* ═══════════════════════════════════════════════════════════ */}
//           {/* SUCCESS MESSAGE */}
//           {/* ═══════════════════════════════════════════════════════════ */}
          
//           {successMessage && (
//             <div className="bg-green-50 border border-green-200 p-4 text-center">
//               <p className="text-green-800 font-semibold">{successMessage}</p>
//             </div>
//           )}

//           {/* ═══════════════════════════════════════════════════════════ */}
//           {/* FORM */}
//           {/* ═══════════════════════════════════════════════════════════ */}
          
//           <form onSubmit={handleSubmit} className="p-4 sm:p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
//             <div className="space-y-6">
              
//               {/* ═══════════════════════════════════════════════════════ */}
//               {/* BASIC INFORMATION */}
//               {/* ═══════════════════════════════════════════════════════ */}
              
//               <div className="bg-gray-50 rounded-xl p-3 sm:p-4 border border-gray-200">
//                 <h3 className="font-semibold text-gray-800 mb-4 text-sm sm:text-base flex items-center gap-2">
//                   📋 Basic Information
//                 </h3>
                
//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Plan Name *
//                     </label>
//                     <input
//                       type="text"
//                       value={formData.plan_name}
//                       onChange={(e) => handleInputChange('plan_name', e.target.value)}
//                       className={`w-full px-3 sm:px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-sm sm:text-base ${
//                         errors.plan_name ? 'border-red-500' : 'border-gray-300'
//                       }`}
//                       placeholder="e.g., Premium"
//                     />
//                     {errors.plan_name && <p className="text-xs text-red-500 mt-1">{errors.plan_name}</p>}
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Price (₹) *
//                     </label>
//                     <input
//                       type="number"
//                       value={formData.price}
//                       onChange={(e) => handleInputChange('price', parseFloat(e.target.value) || 0)}
//                       className={`w-full px-3 sm:px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-sm sm:text-base ${
//                         errors.price ? 'border-red-500' : 'border-gray-300'
//                       }`}
//                       placeholder="Enter price"
//                       min="0"
//                       step="0.01"
//                     />
//                     {errors.price && <p className="text-xs text-red-500 mt-1">{errors.price}</p>}
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Billing Cycle *
//                     </label>
//                     <select
//                       value={formData.billing_cycle}
//                       onChange={(e) => handleInputChange('billing_cycle', e.target.value)}
//                       className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
//                     >
//                       <option value="monthly">Monthly</option>
//                       <option value="yearly">Yearly</option>
//                     </select>
//                   </div>
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 mt-3">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Display Order
//                     </label>
//                     <input
//                       type="number"
//                       value={formData.display_order}
//                       onChange={(e) => handleInputChange('display_order', parseInt(e.target.value) || 1)}
//                       className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
//                       min="1"
//                     />
//                   </div>

//                   <div className="md:col-span-2 flex flex-wrap gap-4 sm:gap-6 items-center pt-6">
//                     <label className="flex items-center gap-2 cursor-pointer">
//                       <input
//                         type="checkbox"
//                         checked={formData.is_active}
//                         onChange={(e) => handleInputChange('is_active', e.target.checked)}
//                         className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
//                       />
//                       <span className="text-sm font-medium text-gray-700">✓ Active Plan</span>
//                     </label>

//                     <label className="flex items-center gap-2 cursor-pointer">
//                       <input
//                         type="checkbox"
//                         checked={formData.is_popular}
//                         onChange={(e) => handleInputChange('is_popular', e.target.checked)}
//                         className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
//                       />
//                       <span className="text-sm font-medium text-gray-700">⭐ Mark as Popular</span>
//                     </label>
//                   </div>
//                 </div>
//               </div>

//               {/* ═══════════════════════════════════════════════════════ */}
//               {/* PLAN LIMITS - WITH SCAN LIMIT HIGHLIGHTED */}
//               {/* ═══════════════════════════════════════════════════════ */}
              
//               <div className="bg-gradient-to-br from-orange-50 to-red-50 border-2 border-orange-300 rounded-xl p-4 sm:p-6 shadow-md">
//                 <div className="flex items-center gap-2 mb-4">
//                   <div className="p-2 bg-orange-600 rounded-lg">
//                     <Package className="w-5 h-5 text-white" />
//                   </div>
//                   <div>
//                     <h3 className="font-bold text-gray-800 text-base sm:text-lg">🔢 Plan Limits</h3>
//                     <p className="text-xs text-gray-600">Set usage restrictions for this plan</p>
//                   </div>
//                 </div>
                
//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  
//                   {/* ✅ MAX SCANS - HIGHLIGHTED (MATCHES CreatePlanModal) */}
//                   <div className="sm:col-span-2 bg-white border-2 border-orange-400 rounded-lg p-4 shadow-sm">
//                     <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
//                       <QrCode className="w-4 h-4 text-orange-600" />
//                       Max Scans Per Plan ⭐ (CRITICAL)
//                     </label>
//                     <input
//                       type="number"
//                       value={formData.limits?.max_scans ?? -1}
//                       onChange={(e) => handleLimitChange('max_scans', parseInt(e.target.value) || -1)}
//                       className="w-full px-4 py-3 border-2 border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500 text-base font-semibold bg-orange-50"
//                       placeholder="-1 for unlimited scans"
//                       min="-1"
//                     />
//                     <p className="text-xs text-orange-700 mt-2 font-medium">
//                       {formData.limits?.max_scans === -1 
//                         ? '∞ Unlimited scans allowed' 
//                         : `${formData.limits?.max_scans} scan${formData.limits?.max_scans !== 1 ? 's' : ''} allowed per subscription`
//                       }
//                     </p>
//                   </div>

//                   {/* Other Limits (collapsed by default for cleaner UI) */}
                 
//                 </div>
//               </div>

//               {/* ═══════════════════════════════════════════════════════ */}
//               {/* PLAN VALIDITY DURATION */}
//               {/* ═══════════════════════════════════════════════════════ */}
              
//               <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-300 rounded-xl p-4 sm:p-6 shadow-md">
//                 <div className="flex items-center gap-2 mb-4">
//                   <div className="p-2 bg-blue-600 rounded-lg">
//                     <Clock className="w-5 h-5 text-white" />
//                   </div>
//                   <div>
//                     <h3 className="font-bold text-gray-800 text-base sm:text-lg">⏰ Plan Validity Period</h3>
//                     <p className="text-xs text-gray-600">Set how long this plan will remain active</p>
//                   </div>
//                 </div>
                
//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Duration *
//                     </label>
//                     <input
//                       type="number"
//                       value={formData.validity_duration || 30}
//                       onChange={(e) => handleInputChange('validity_duration', parseInt(e.target.value) || 30)}
//                       className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 text-base font-semibold ${
//                         errors.validity_duration ? 'border-red-500' : 'border-blue-300'
//                       }`}
//                       placeholder="e.g., 30"
//                       min="1"
//                     />
//                     {errors.validity_duration && (
//                       <p className="text-xs text-red-500 mt-1">{errors.validity_duration}</p>
//                     )}
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Unit *
//                     </label>
//                     <select
//                       value={formData.validity_unit || 'days'}
//                       onChange={(e) => handleInputChange('validity_unit', e.target.value)}
//                       className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 text-base font-semibold ${
//                         errors.validity_unit ? 'border-red-500' : 'border-blue-300'
//                       }`}
//                     >
//                       <option value="minutes">Minutes (testing)</option>
//                       <option value="hours">Hours</option>
//                       <option value="days">Days</option>
//                       <option value="months">Months</option>
//                       <option value="years">Years</option>
//                     </select>
//                     {errors.validity_unit && (
//                       <p className="text-xs text-red-500 mt-1">{errors.validity_unit}</p>
//                     )}
//                   </div>
//                 </div>

//                 {/* Live Preview */}
//                 <div className="mt-4 p-4 bg-white rounded-lg border-2 border-blue-200 shadow-sm">
//                   <div className="flex items-center justify-between">
//                     <div>
//                       <p className="text-xs text-gray-600 mb-1">Plan will be valid for:</p>
//                       <p className="text-lg sm:text-xl font-bold text-blue-600">
//                         {getValidityPreview()}
//                       </p>
//                     </div>
//                     <div className="text-4xl">
//                       {formData.validity_unit === 'minutes' ? '⏱️' : 
//                        formData.validity_unit === 'hours' ? '🕐' :
//                        formData.validity_unit === 'days' ? '📅' :
//                        formData.validity_unit === 'months' ? '📆' : '🗓️'}
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* ═══════════════════════════════════════════════════════ */}
//               {/* PLAN FEATURES - WITH ADD/REMOVE */}
//               {/* ═══════════════════════════════════════════════════════ */}
              
//               <div className="bg-gray-50 rounded-xl p-3 sm:p-4 border border-gray-200">
//                 <div className="mb-4">
//                   <h3 className="font-semibold text-gray-800 text-sm sm:text-base flex items-center gap-2">
//                     ✨ Plan Features
//                     <span className="text-xs text-gray-500 font-normal">
//                       ({formData.features?.length || 0} feature{formData.features?.length !== 1 ? 's' : ''})
//                     </span>
//                   </h3>
//                   <p className="text-xs text-gray-500 mt-1">
//                     <span className="font-medium text-blue-600">Minimum 1 required</span> • Unlimited features allowed • Click + to add more
//                   </p>
//                 </div>

//                 {errors.features && <p className="text-xs text-red-500 mb-3 font-semibold">{errors.features}</p>}
                
//                 <div className="space-y-4">
//                   {formData.features?.map((feature, index) => (
//                     <div key={index}>
//                       {/* Feature Card */}
//                       <div className="bg-white border-2 border-gray-200 rounded-lg p-3 sm:p-4 hover:border-blue-300 transition-all hover:shadow-md">
//                         <div className="flex items-center justify-between mb-3">
//                           <div className="flex items-center gap-2 flex-wrap">
//                             <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2.5 py-1 rounded-md">
//                               #{index + 1}
//                             </span>
//                             <label className="flex items-center gap-2 cursor-pointer">
//                               <input
//                                 type="checkbox"
//                                 checked={feature.included}
//                                 onChange={(e) => handleFeatureChange(index, 'included', e.target.checked)}
//                                 className="w-4 h-4 text-green-600 rounded focus:ring-green-500 cursor-pointer"
//                               />
//                               <span className={`text-xs sm:text-sm font-medium ${
//                                 feature.included ? 'text-green-600' : 'text-red-600'
//                               }`}>
//                                 {feature.included ? '✓ Included' : '✗ Excluded'}
//                               </span>
//                             </label>
//                           </div>
//                           <button
//                             type="button"
//                             onClick={() => removeFeature(index)}
//                             disabled={!formData.features || formData.features.length <= 1}
//                             className={`p-2 rounded-lg transition-all ${
//                               !formData.features || formData.features.length <= 1
//                                 ? 'text-gray-300 cursor-not-allowed'
//                                 : 'text-red-600 hover:bg-red-50 active:scale-95'
//                             }`}
//                             title={!formData.features || formData.features.length <= 1 ? 'Minimum 1 feature required' : 'Remove feature'}
//                           >
//                             <Trash2 className="w-4 h-4" />
//                           </button>
//                         </div>

//                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
//                           <div>
//                             <label className="block text-xs font-medium text-gray-600 mb-1">
//                               Feature Title *
//                             </label>
//                             <input
//                               type="text"
//                               value={feature.title}
//                               onChange={(e) => handleFeatureChange(index, 'title', e.target.value)}
//                               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-all"
//                               placeholder="e.g., Unlimited Tiles"
//                             />
//                           </div>
//                           <div>
//                             <label className="block text-xs font-medium text-gray-600 mb-1">
//                               Icon Emoji (Optional)
//                             </label>
//                             <input
//                               type="text"
//                               value={feature.icon || ''}
//                               onChange={(e) => handleFeatureChange(index, 'icon', e.target.value)}
//                               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-all"
//                               placeholder="e.g., 🚀"
//                               maxLength={2}
//                             />
//                           </div>
//                         </div>

//                         <div>
//                           <label className="block text-xs font-medium text-gray-600 mb-1">
//                             Feature Description *
//                           </label>
//                           <textarea
//                             value={feature.description}
//                             onChange={(e) => handleFeatureChange(index, 'description', e.target.value)}
//                             className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm resize-none transition-all"
//                             placeholder="Describe this feature in detail..."
//                             rows={2}
//                           />
//                         </div>
//                       </div>

//                       {/* ✅ Add Button - Only show for last feature */}
//                       {index === (formData.features?.length || 0) - 1 && (
//                         <div className="flex justify-center -mt-2 mb-2">
//                           <button
//                             type="button"
//                             onClick={() => addFeatureAfter(index)}
//                             className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-5 py-2.5 rounded-full shadow-lg hover:shadow-xl transition-all transform hover:scale-105 active:scale-95 flex items-center gap-2 text-sm font-semibold"
//                             title="Add new feature"
//                           >
//                             <Plus className="w-4 h-4" />
//                             Add Feature
//                           </button>
//                         </div>
//                       )}
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>

//             {/* ═══════════════════════════════════════════════════════ */}
//             {/* FOOTER BUTTONS */}
//             {/* ═══════════════════════════════════════════════════════ */}
            
//             <div className="flex flex-col sm:flex-row gap-3 mt-6 pt-6 border-t border-gray-200">
//               <button
//                 type="button"
//                 onClick={onClose}
//                 disabled={updating}
//                 className="w-full sm:w-auto px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 font-medium text-sm sm:text-base transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
//               >
//                 Cancel
//               </button>
//               <button
//                 type="submit"
//                 disabled={updating || !formData.features || formData.features.length < 1}
//                 className="w-full sm:w-auto flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 font-semibold disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base transition-all shadow-md hover:shadow-lg active:scale-95"
//               >
//                 {updating ? (
//                   <div className="flex items-center justify-center gap-2">
//                     <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
//                     Updating Plan...
//                   </div>
//                 ) : (
//                   '✅ Update Plan'
//                 )}
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// console.log('✅ EditPlanModal - PRODUCTION v7.0 FINAL (Perfect Match with CreatePlanModal)'); 
// ═══════════════════════════════════════════════════════════════
// ✅ EDIT PLAN MODAL - PRODUCTION READY v8.0 - BLANK FIELDS
// ═══════════════════════════════════════════════════════════════

import React, { useState, useEffect } from 'react';
import { X, Clock, Plus, Trash2, Package, QrCode } from 'lucide-react';
import { updatePlan, validatePlanData } from '../../lib/planService';
import type { Plan, UpdatePlanData, PlanFeature, PlanValidationError, PlanLimits } from '../../types/plan.types';

interface EditPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  plan: Plan | null;
}

export const EditPlanModal: React.FC<EditPlanModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  plan
}) => {
  // ═══════════════════════════════════════════════════════════════
  // STATE MANAGEMENT - WITH STRING INPUTS FOR BLANK FIELDS
  // ═══════════════════════════════════════════════════════════════
  
  const [formData, setFormData] = useState<UpdatePlanData>({
    plan_name: '',
    price: 0,
    currency: 'INR',
    billing_cycle: 'monthly',
    validity_duration: 30,
    validity_unit: 'days',
    features: [],
    limits: {
      max_tiles: -1,
      max_collections: -1,
      max_qr_codes: -1,
      max_workers: 1,
      max_storage_mb: 1000,
      analytics_retention_days: 365,
      customer_inquiries_limit: -1,
      max_scans: -1
    },
    is_active: true,
    is_popular: false,
    display_order: 1,
    updated_by: ''
  });

  // ✅ SEPARATE STATE FOR INPUT DISPLAY (ALLOWS BLANK FIELDS)
  const [priceInput, setPriceInput] = useState<string>('');
  const [durationInput, setDurationInput] = useState<string>('');
  const [maxScansInput, setMaxScansInput] = useState<string>('');

  const [errors, setErrors] = useState<PlanValidationError>({});
  const [updating, setUpdating] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // ═══════════════════════════════════════════════════════════════
  // LOAD PLAN DATA
  // ═══════════════════════════════════════════════════════════════
  
  useEffect(() => {
    if (plan && isOpen) {
      console.log('📋 Loading plan data for editing:', plan.plan_name);
      
      // ✅ SET FORM DATA
      setFormData({
        plan_name: plan.plan_name,
        price: plan.price,
        currency: plan.currency,
        billing_cycle: plan.billing_cycle,
        validity_duration: plan.validity_duration || 30,
        validity_unit: plan.validity_unit || 'days',
        features: plan.features && plan.features.length > 0 
          ? [...plan.features]
          : [{ title: '', description: '', included: true, icon: '' }],
        limits: {
          max_tiles: plan.limits?.max_tiles ?? -1,
          max_collections: plan.limits?.max_collections ?? -1,
          max_qr_codes: plan.limits?.max_qr_codes ?? -1,
          max_workers: plan.limits?.max_workers ?? 1,
          max_storage_mb: plan.limits?.max_storage_mb ?? 1000,
          analytics_retention_days: plan.limits?.analytics_retention_days ?? 365,
          customer_inquiries_limit: plan.limits?.customer_inquiries_limit ?? -1,
          max_scans: plan.limits?.max_scans ?? -1
        },
        is_active: plan.is_active,
        is_popular: plan.is_popular ?? false,
        display_order: plan.display_order ?? 1,
        updated_by: ''
      });

      // ✅ SET INPUT DISPLAY VALUES (SHOWN IN FIELDS)
      setPriceInput(plan.price.toString());
      setDurationInput((plan.validity_duration || 30).toString());
      setMaxScansInput((plan.limits?.max_scans ?? -1).toString());
      
      console.log('✅ Plan data loaded. Features:', plan.features?.length || 0);
      console.log('✅ Price:', plan.price);
      console.log('✅ Max scans:', plan.limits?.max_scans ?? -1);
      console.log('✅ Duration:', plan.validity_duration);
    }
  }, [plan, isOpen]);

  // ═══════════════════════════════════════════════════════════════
  // HANDLERS
  // ═══════════════════════════════════════════════════════════════

  const handleInputChange = (field: keyof UpdatePlanData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (field in errors && errors[field as keyof PlanValidationError]) {
      const newErrors = { ...errors };
      delete newErrors[field as keyof PlanValidationError];
      setErrors(newErrors);
    }
  };

  // ✅ PRICE INPUT HANDLER - ALLOWS BLANK FIELD
  const handlePriceChange = (value: string) => {
    setPriceInput(value);
    
    // Update formData with number or 0 if empty
    const numValue = value === '' ? 0 : parseFloat(value);
    if (!isNaN(numValue)) {
      handleInputChange('price', numValue);
    }
    
    // Clear price error
    if (errors.price) {
      const newErrors = { ...errors };
      delete newErrors.price;
      setErrors(newErrors);
    }
  };

  // ✅ DURATION INPUT HANDLER - ALLOWS BLANK FIELD
  const handleDurationChange = (value: string) => {
    setDurationInput(value);
    
    // Update formData with number or 1 if empty
    const numValue = value === '' ? 1 : parseInt(value);
    if (!isNaN(numValue) && numValue > 0) {
      handleInputChange('validity_duration', numValue);
    }
    
    // Clear duration error
    if (errors.validity_duration) {
      const newErrors = { ...errors };
      delete newErrors.validity_duration;
      setErrors(newErrors);
    }
  };

  // ✅ MAX SCANS INPUT HANDLER - ALLOWS BLANK FIELD
  const handleMaxScansChange = (value: string) => {
    setMaxScansInput(value);
    
    // Update formData with number or -1 if empty
    const numValue = value === '' ? -1 : parseInt(value);
    if (!isNaN(numValue)) {
      setFormData(prev => ({
        ...prev,
        limits: {
          ...prev.limits!,
          max_scans: numValue
        }
      }));
    }
  };

  const handleFeatureChange = (index: number, field: keyof PlanFeature, value: any) => {
    if (!formData.features) return;
    const newFeatures = [...formData.features];
    newFeatures[index] = { ...newFeatures[index], [field]: value };
    setFormData(prev => ({ ...prev, features: newFeatures }));
  };

  const addFeatureAfter = (index: number) => {
    if (!formData.features) return;
    const newFeatures = [...formData.features];
    newFeatures.splice(index + 1, 0, { title: '', description: '', included: true, icon: '' });
    setFormData(prev => ({ ...prev, features: newFeatures }));
    console.log('➕ Added feature. Total:', newFeatures.length);
  };

  const removeFeature = (index: number) => {
    if (!formData.features || formData.features.length <= 1) {
      alert('⚠️ At least 1 feature is required');
      return;
    }
    setFormData(prev => ({
      ...prev,
      features: prev.features!.filter((_, i) => i !== index)
    }));
    console.log('🗑️ Removed feature. Remaining:', formData.features.length - 1);
  };

  const handleLimitChange = (field: keyof PlanLimits, value: number) => {
    setFormData(prev => ({
      ...prev,
      limits: {
        ...prev.limits!,
        [field]: value
      }
    }));
  };

  const getValidityPreview = () => {
    const { validity_duration, validity_unit } = formData;
    if (!validity_duration || validity_duration <= 0) return 'Not set';
    
    if (validity_duration === 1) {
      const singular = (validity_unit || 'days').replace(/s$/, '');
      return `${validity_duration} ${singular}`;
    }
    return `${validity_duration} ${validity_unit || 'days'}`;
  };

  const getScanLimitPreview = () => {
    const scans = formData.limits?.max_scans ?? -1;
    if (scans === -1) return '∞ Unlimited scans allowed';
    if (scans === 0) return '⚠️ No scans allowed';
    return `${scans.toLocaleString('en-IN')} scan${scans !== 1 ? 's' : ''} allowed per subscription`;
  };

  // ═══════════════════════════════════════════════════════════════
  // SUBMIT HANDLER
  // ═══════════════════════════════════════════════════════════════

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!plan) {
      console.error('❌ No plan to update');
      return;
    }
    
    // ✅ Validate minimum features
    if (!formData.features || formData.features.length < 1) {
      alert('❌ At least 1 feature is required');
      return;
    }

    // ✅ Validate features content
    const hasEmptyFeatures = formData.features.some(f => !f.title.trim() || !f.description.trim());
    if (hasEmptyFeatures) {
      alert('❌ All features must have a title and description');
      return;
    }

    // ✅ Validate price (must be >= 0)
    if (formData.price < 0) {
      alert('❌ Price cannot be negative');
      return;
    }

    // ✅ Validate duration (must be > 0)
    if (!formData.validity_duration || formData.validity_duration <= 0) {
      alert('❌ Validity duration must be greater than 0');
      return;
    }
    
    console.log('🔍 Validating plan data...');
    const validationErrors = validatePlanData(formData as any);
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      const errorMsg = Object.values(validationErrors).join('\n');
      alert(`❌ Validation Errors:\n${errorMsg}`);
      console.error('Validation errors:', validationErrors);
      return;
    }
    
    setUpdating(true);
    
    try {
      console.log('💾 Updating plan:', plan.id);
      console.log('📊 Update data:', {
        name: formData.plan_name,
        price: formData.price,
        features: formData.features?.length,
        max_scans: formData.limits?.max_scans,
        validity: `${formData.validity_duration} ${formData.validity_unit}`
      });
      
      const result = await updatePlan(plan.id, formData);
      
      if (result.success) {
        console.log('✅ Plan updated successfully');
        setSuccessMessage('✅ Plan updated successfully!');
        
        setTimeout(() => {
          onSuccess();
          onClose();
        }, 1500);
      } else {
        console.error('❌ Update failed:', result.error);
        alert(`❌ Failed to update plan:\n${result.error}`);
      }
    } catch (error: any) {
      console.error('❌ Error updating plan:', error);
      alert(`❌ Error: ${error.message}`);
    } finally {
      setUpdating(false);
    }
  };

  // ═══════════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════════

  if (!isOpen || !plan) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose}></div>

      <div className="flex min-h-full items-center justify-center p-2 sm:p-4">
        <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
          
          {/* ═══════════════════════════════════════════════════════════ */}
          {/* HEADER */}
          {/* ═══════════════════════════════════════════════════════════ */}
          
          <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 sm:p-6 z-10 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold mb-1">✏️ Edit Plan</h2>
                <p className="text-blue-100 text-xs sm:text-sm">
                  Modifying: <span className="font-semibold">{plan.plan_name}</span>
                </p>
              </div>
              <button 
                onClick={onClose} 
                className="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-2 transition-colors"
                type="button"
              >
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>
          </div>

          {/* ═══════════════════════════════════════════════════════════ */}
          {/* SUCCESS MESSAGE */}
          {/* ═══════════════════════════════════════════════════════════ */}
          
          {successMessage && (
            <div className="bg-green-50 border border-green-200 p-4 text-center">
              <p className="text-green-800 font-semibold">{successMessage}</p>
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════════ */}
          {/* FORM */}
          {/* ═══════════════════════════════════════════════════════════ */}
          
          <form onSubmit={handleSubmit} className="p-4 sm:p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
            <div className="space-y-6">
              
              {/* ═══════════════════════════════════════════════════════ */}
              {/* BASIC INFORMATION */}
              {/* ═══════════════════════════════════════════════════════ */}
              
              <div className="bg-gray-50 rounded-xl p-3 sm:p-4 border border-gray-200">
                <h3 className="font-semibold text-gray-800 mb-4 text-sm sm:text-base flex items-center gap-2">
                  📋 Basic Information
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Plan Name *
                    </label>
                    <input
                      type="text"
                      value={formData.plan_name}
                      onChange={(e) => handleInputChange('plan_name', e.target.value)}
                      className={`w-full px-3 sm:px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-sm sm:text-base ${
                        errors.plan_name ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="e.g., Premium"
                    />
                    {errors.plan_name && <p className="text-xs text-red-500 mt-1">{errors.plan_name}</p>}
                  </div>

                  {/* ✅ PRICE INPUT - BLANK FIELD ALLOWED */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Price (₹) *
                    </label>
                    <input
                      type="number"
                      value={priceInput}
                      onChange={(e) => handlePriceChange(e.target.value)}
                      className={`w-full px-3 sm:px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-sm sm:text-base ${
                        errors.price ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter price"
                      min="0"
                      step="0.01"
                    />
                    {errors.price && <p className="text-xs text-red-500 mt-1">{errors.price}</p>}
                    {priceInput && (
                      <p className="text-xs text-blue-600 mt-1 font-medium">
                        ₹{parseFloat(priceInput).toLocaleString('en-IN')}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Billing Cycle *
                    </label>
                    <select
                      value={formData.billing_cycle}
                      onChange={(e) => handleInputChange('billing_cycle', e.target.value)}
                      className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                    >
                      <option value="monthly">Monthly</option>
                      <option value="yearly">Yearly</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 mt-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Display Order
                    </label>
                    <input
                      type="number"
                      value={formData.display_order}
                      onChange={(e) => handleInputChange('display_order', parseInt(e.target.value) || 1)}
                      className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                      min="1"
                    />
                  </div>

                  <div className="md:col-span-2 flex flex-wrap gap-4 sm:gap-6 items-center pt-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.is_active}
                        onChange={(e) => handleInputChange('is_active', e.target.checked)}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm font-medium text-gray-700">✓ Active Plan</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.is_popular}
                        onChange={(e) => handleInputChange('is_popular', e.target.checked)}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm font-medium text-gray-700">⭐ Mark as Popular</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* ═══════════════════════════════════════════════════════ */}
              {/* PLAN LIMITS - WITH BLANK SCAN LIMIT FIELD */}
              {/* ═══════════════════════════════════════════════════════ */}
              
              <div className="bg-gradient-to-br from-orange-50 to-red-50 border-2 border-orange-300 rounded-xl p-4 sm:p-6 shadow-md">
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-2 bg-orange-600 rounded-lg">
                    <Package className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 text-base sm:text-lg">🔢 Plan Limits</h3>
                    <p className="text-xs text-gray-600">Set usage restrictions for this plan</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 gap-4">
                  
                  {/* ✅ MAX SCANS - BLANK FIELD ALLOWED */}
                  <div className="bg-white border-2 border-orange-400 rounded-lg p-4 shadow-sm">
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                      <QrCode className="w-4 h-4 text-orange-600" />
                      Max Scans Per Plan ⭐ (CRITICAL)
                    </label>
                    <input
                      type="number"
                      value={maxScansInput}
                      onChange={(e) => handleMaxScansChange(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500 text-base font-semibold bg-orange-50"
                      placeholder="Enter scan limit (-1 for unlimited)"
                      min="-1"
                    />
                    <p className="text-xs text-orange-700 mt-2 font-medium">
                      {getScanLimitPreview()}
                    </p>
                  </div>
                </div>
              </div>

              {/* ═══════════════════════════════════════════════════════ */}
              {/* PLAN VALIDITY - WITH BLANK DURATION FIELD */}
              {/* ═══════════════════════════════════════════════════════ */}
              
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-300 rounded-xl p-4 sm:p-6 shadow-md">
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-2 bg-blue-600 rounded-lg">
                    <Clock className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 text-base sm:text-lg">⏰ Plan Validity Period</h3>
                    <p className="text-xs text-gray-600">Set how long this plan will remain active</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  
                  {/* ✅ DURATION INPUT - BLANK FIELD ALLOWED */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Duration *
                    </label>
                    <input
                      type="number"
                      value={durationInput}
                      onChange={(e) => handleDurationChange(e.target.value)}
                      className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 text-base font-semibold ${
                        errors.validity_duration ? 'border-red-500' : 'border-blue-300'
                      }`}
                      placeholder="Enter duration"
                      min="1"
                    />
                    {errors.validity_duration && (
                      <p className="text-xs text-red-500 mt-1">{errors.validity_duration}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Unit *
                    </label>
                    <select
                      value={formData.validity_unit || 'days'}
                      onChange={(e) => handleInputChange('validity_unit', e.target.value)}
                      className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 text-base font-semibold ${
                        errors.validity_unit ? 'border-red-500' : 'border-blue-300'
                      }`}
                    >
                      <option value="minutes">Minutes (testing)</option>
                      <option value="hours">Hours</option>
                      <option value="days">Days</option>
                      <option value="months">Months</option>
                      <option value="years">Years</option>
                    </select>
                    {errors.validity_unit && (
                      <p className="text-xs text-red-500 mt-1">{errors.validity_unit}</p>
                    )}
                  </div>
                </div>

                {/* Live Preview */}
                <div className="mt-4 p-4 bg-white rounded-lg border-2 border-blue-200 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Plan will be valid for:</p>
                      <p className="text-lg sm:text-xl font-bold text-blue-600">
                        {getValidityPreview()}
                      </p>
                    </div>
                    <div className="text-4xl">
                      {formData.validity_unit === 'minutes' ? '⏱️' : 
                       formData.validity_unit === 'hours' ? '🕐' :
                       formData.validity_unit === 'days' ? '📅' :
                       formData.validity_unit === 'months' ? '📆' : '🗓️'}
                    </div>
                  </div>
                </div>
              </div>

              {/* ═══════════════════════════════════════════════════════ */}
              {/* PLAN FEATURES */}
              {/* ═══════════════════════════════════════════════════════ */}
              
              <div className="bg-gray-50 rounded-xl p-3 sm:p-4 border border-gray-200">
                <div className="mb-4">
                  <h3 className="font-semibold text-gray-800 text-sm sm:text-base flex items-center gap-2">
                    ✨ Plan Features
                    <span className="text-xs text-gray-500 font-normal">
                      ({formData.features?.length || 0} feature{formData.features?.length !== 1 ? 's' : ''})
                    </span>
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    <span className="font-medium text-blue-600">Minimum 1 required</span> • Unlimited features allowed • Click + to add more
                  </p>
                </div>

                {errors.features && <p className="text-xs text-red-500 mb-3 font-semibold">{errors.features}</p>}
                
                <div className="space-y-4">
                  {formData.features?.map((feature, index) => (
                    <div key={index}>
                      <div className="bg-white border-2 border-gray-200 rounded-lg p-3 sm:p-4 hover:border-blue-300 transition-all hover:shadow-md">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2.5 py-1 rounded-md">
                              #{index + 1}
                            </span>
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={feature.included}
                                onChange={(e) => handleFeatureChange(index, 'included', e.target.checked)}
                                className="w-4 h-4 text-green-600 rounded focus:ring-green-500 cursor-pointer"
                              />
                              <span className={`text-xs sm:text-sm font-medium ${
                                feature.included ? 'text-green-600' : 'text-red-600'
                              }`}>
                                {feature.included ? '✓ Included' : '✗ Excluded'}
                              </span>
                            </label>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeFeature(index)}
                            disabled={!formData.features || formData.features.length <= 1}
                            className={`p-2 rounded-lg transition-all ${
                              !formData.features || formData.features.length <= 1
                                ? 'text-gray-300 cursor-not-allowed'
                                : 'text-red-600 hover:bg-red-50 active:scale-95'
                            }`}
                            title={!formData.features || formData.features.length <= 1 ? 'Minimum 1 feature required' : 'Remove feature'}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">
                              Feature Title *
                            </label>
                            <input
                              type="text"
                              value={feature.title}
                              onChange={(e) => handleFeatureChange(index, 'title', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-all"
                              placeholder="e.g., Unlimited Tiles"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">
                              Icon Emoji (Optional)
                            </label>
                            <input
                              type="text"
                              value={feature.icon || ''}
                              onChange={(e) => handleFeatureChange(index, 'icon', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-all"
                              placeholder="e.g., 🚀"
                              maxLength={2}
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">
                            Feature Description *
                          </label>
                          <textarea
                            value={feature.description}
                            onChange={(e) => handleFeatureChange(index, 'description', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm resize-none transition-all"
                            placeholder="Describe this feature in detail..."
                            rows={2}
                          />
                        </div>
                      </div>

                      {index === (formData.features?.length || 0) - 1 && (
                        <div className="flex justify-center -mt-2 mb-2">
                          <button
                            type="button"
                            onClick={() => addFeatureAfter(index)}
                            className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-5 py-2.5 rounded-full shadow-lg hover:shadow-xl transition-all transform hover:scale-105 active:scale-95 flex items-center gap-2 text-sm font-semibold"
                            title="Add new feature"
                          >
                            <Plus className="w-4 h-4" />
                            Add Feature
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ═══════════════════════════════════════════════════════ */}
            {/* FOOTER BUTTONS */}
            {/* ═══════════════════════════════════════════════════════ */}
            
            <div className="flex flex-col sm:flex-row gap-3 mt-6 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                disabled={updating}
                className="w-full sm:w-auto px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 font-medium text-sm sm:text-base transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={updating || !formData.features || formData.features.length < 1}
                className="w-full sm:w-auto flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 font-semibold disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base transition-all shadow-md hover:shadow-lg active:scale-95"
              >
                {updating ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Updating Plan...
                  </div>
                ) : (
                  '✅ Update Plan'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

console.log('✅ EditPlanModal - PRODUCTION v8.0 FINAL (BLANK FIELDS)');