
// import React, { useState } from 'react';
// import { X, Clock, Plus, Trash2, Package, QrCode } from 'lucide-react';
// import { createPlan, validatePlanData } from '../../lib/planService';
// import type { CreatePlanData, PlanFeature, PlanValidationError } from '../../types/plan.types';
// import type { PlanLimits } from '../../types/plan.types';

// interface CreatePlanModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   onSuccess: () => void;
// }

// export const CreatePlanModal: React.FC<CreatePlanModalProps> = ({
//   isOpen,
//   onClose,
//   onSuccess
// }) => {
//   const [formData, setFormData] = useState<CreatePlanData>({
//     plan_name: '',
//     price: '', // ✅ Empty string
//     currency: 'INR',
//     billing_cycle: 'monthly',
//     validity_duration: 30,
//     validity_unit: 'days',
//     features: [
//       { title: '', description: '', included: true, icon: '' }
//     ],
//     limits: {
//       max_tiles: null as any, // ✅ Empty initially
//       max_collections: null as any,
//       max_qr_codes: null as any,
//       max_workers: null as any,
//       max_storage_mb: null as any,
//       analytics_retention_days: null as any,
//       customer_inquiries_limit: null as any,
//       max_scans: null as any // ✅ Empty initially
//     },
//     is_active: true,
//     is_popular: false,
//     display_order: 1
//   });

//   const [errors, setErrors] = useState<PlanValidationError>({});
//   const [creating, setCreating] = useState(false);
//   const [successMessage, setSuccessMessage] = useState<string | null>(null);

//   const handleInputChange = (field: keyof CreatePlanData, value: any) => {
//     setFormData(prev => ({ ...prev, [field]: value }));
//     if (field in errors && errors[field as keyof PlanValidationError]) {
//       const newErrors = { ...errors };
//       delete newErrors[field as keyof PlanValidationError];
//       setErrors(newErrors);
//     }
//   };

//   const handleFeatureChange = (index: number, field: keyof PlanFeature, value: any) => {
//     const newFeatures = [...formData.features];
//     newFeatures[index] = { ...newFeatures[index], [field]: value };
//     setFormData(prev => ({ ...prev, features: newFeatures }));
//   };

//   const addFeatureAfter = (index: number) => {
//     const newFeatures = [...formData.features];
//     newFeatures.splice(index + 1, 0, { title: '', description: '', included: true, icon: '' });
//     setFormData(prev => ({ ...prev, features: newFeatures }));
//   };

//   const removeFeature = (index: number) => {
//     if (formData.features.length <= 1) {
//       alert('⚠️ At least 1 feature is required');
//       return;
//     }
//     setFormData(prev => ({
//       ...prev,
//       features: prev.features.filter((_, i) => i !== index)
//     }));
//   };

//   const getValidityPreview = () => {
//     const { validity_duration, validity_unit } = formData;
//     if (!validity_duration || validity_duration <= 0) return 'Not set';

//     if (validity_duration === 1) {
//       const singular = validity_unit.replace(/s$/, '');
//       return `${validity_duration} ${singular}`;
//     }
//     return `${validity_duration} ${validity_unit}`;
//   };

//   // ✅ Updated to handle empty values properly
//   const handleLimitChange = (field: keyof PlanLimits, value: string) => {
//     setFormData(prev => ({
//       ...prev,
//       limits: {
//         ...prev.limits!,
//         [field]: value === '' ? null : parseInt(value) || 0
//       }
//     }));
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     // ✅ Validate minimum features
//     if (formData.features.length < 1) {
//       alert('❌ At least 1 feature is required');
//       return;
//     }

//     // ✅ Validate features content
//     const hasEmptyFeatures = formData.features.some(f => !f.title.trim() || !f.description.trim());
//     if (hasEmptyFeatures) {
//       alert('❌ All features must have a title and description');
//       return;
//     }

//     // ✅ Convert null/empty limits to -1 before submission
//     const dataToSubmit = {
//       ...formData,
//       limits: {
//         max_tiles: formData.limits?.max_tiles ?? -1,
//         max_collections: formData.limits?.max_collections ?? -1,
//         max_qr_codes: formData.limits?.max_qr_codes ?? -1,
//         max_workers: formData.limits?.max_workers ?? 1,
//         max_storage_mb: formData.limits?.max_storage_mb ?? 1000,
//         analytics_retention_days: formData.limits?.analytics_retention_days ?? 365,
//         customer_inquiries_limit: formData.limits?.customer_inquiries_limit ?? -1,
//         max_scans: formData.limits?.max_scans ?? -1
//       }
//     };

//     const validationErrors = validatePlanData(dataToSubmit);
//     if (Object.keys(validationErrors).length > 0) {
//       setErrors(validationErrors);
//       const errorMsg = Object.values(validationErrors).join('\n');
//       alert(`❌ Validation Errors:\n${errorMsg}`);
//       return;
//     }

//     setCreating(true);

//     try {
//       const result = await createPlan(dataToSubmit);

//       if (result.success) {
//         setSuccessMessage('✅ Plan created successfully!');
//         setTimeout(() => {
//           onSuccess();
//           onClose();
//           resetForm();
//         }, 1500);
//       } else {
//         alert(`❌ Failed to create plan:\n${result.error}`);
//       }
//     } catch (error: any) {
//       console.error('Error creating plan:', error);
//       alert(`❌ Error: ${error.message}`);
//     } finally {
//       setCreating(false);
//     }
//   };

//   const resetForm = () => {
//     setFormData({
//       plan_name: '',
//       price: '',
//       currency: 'INR',
//       billing_cycle: 'monthly',
//       validity_duration: 30,
//       validity_unit: 'days',
//       features: [
//         { title: '', description: '', included: true, icon: '' }
//       ],
//       limits: {
//         max_tiles: null as any,
//         max_collections: null as any,
//         max_qr_codes: null as any,
//         max_workers: null as any,
//         max_storage_mb: null as any,
//         analytics_retention_days: null as any,
//         customer_inquiries_limit: null as any,
//         max_scans: null as any
//       },
//       is_active: true,
//       is_popular: false,
//       display_order: 1
//     });
//     setErrors({});
//     setSuccessMessage(null);
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 z-50 overflow-y-auto">
//       <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose}></div>

//       <div className="flex min-h-full items-center justify-center p-2 sm:p-4">
//         <div className="relative bg-white rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
//           {/* ═══════════════════════════════════════════════════════════
//               HEADER
//           ═══════════════════════════════════════════════════════════ */}
//           <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-4 sm:p-6 z-10">
//             <div className="flex items-center justify-between">
//               <div>
//                 <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-1">➕ Create New Plan</h2>
//                 <p className="text-purple-100 text-xs sm:text-sm">Configure plan details and features</p>
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

//           {/* Success Message */}
//           {successMessage && (
//             <div className="bg-green-50 border border-green-200 p-3 sm:p-4 text-center">
//               <p className="text-green-800 font-semibold text-sm sm:text-base">{successMessage}</p>
//             </div>
//           )}

//           {/* ═══════════════════════════════════════════════════════════
//               FORM
//           ═══════════════════════════════════════════════════════════ */}
//           <form onSubmit={handleSubmit} className="p-3 sm:p-4 md:p-6 overflow-y-auto max-h-[calc(90vh-160px)] sm:max-h-[calc(90vh-180px)]">
//             <div className="space-y-4 sm:space-y-6">
//               {/* ═══════════════════════════════════════════════════════════
//                   BASIC INFORMATION
//               ═══════════════════════════════════════════════════════════ */}
//               <div className="bg-gray-50 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-gray-200">
//                 <h3 className="font-semibold text-gray-800 mb-3 sm:mb-4 text-sm sm:text-base flex items-center gap-2">
//                   📋 Basic Information
//                 </h3>

//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
//                   <div>
//                     <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
//                       Plan Name *
//                     </label>
//                     <input
//                       type="text"
//                       value={formData.plan_name}
//                       onChange={(e) => handleInputChange('plan_name', e.target.value)}
//                       className={`w-full px-3 py-2 sm:py-2.5 border rounded-lg focus:ring-2 focus:ring-purple-500 text-sm sm:text-base ${
//                         errors.plan_name ? 'border-red-500' : 'border-gray-300'
//                       }`}
//                       placeholder="e.g., Premium"
//                     />
//                     {errors.plan_name && <p className="text-xs text-red-500 mt-1">{errors.plan_name}</p>}
//                   </div>

//                   <div>
//                     <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
//                       Price (₹) *
//                     </label>
//                     <input
//                       type="number"
//                       value={formData.price}
//                       onChange={(e) => handleInputChange('price', e.target.value)}
//                       className={`w-full px-3 py-2 sm:py-2.5 border rounded-lg focus:ring-2 focus:ring-purple-500 text-sm sm:text-base ${
//                         errors.price ? 'border-red-500' : 'border-gray-300'
//                       }`}
//                       placeholder="Enter price"
//                       min="0"
//                       step="0.01"
//                     />
//                     {errors.price && <p className="text-xs text-red-500 mt-1">{errors.price}</p>}
//                   </div>

//                   <div>
//                     <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
//                       Billing Cycle *
//                     </label>
//                     <select
//                       value={formData.billing_cycle}
//                       onChange={(e) => handleInputChange('billing_cycle', e.target.value)}
//                       className="w-full px-3 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
//                     >
//                       <option value="monthly">Monthly</option>
//                       <option value="yearly">Yearly</option>
//                     </select>
//                   </div>
//                 </div>

//                 <div className="flex flex-wrap gap-3 sm:gap-4 md:gap-6 mt-3 sm:mt-4">
//                   <label className="flex items-center gap-2 cursor-pointer">
//                     <input
//                       type="checkbox"
//                       checked={formData.is_active}
//                       onChange={(e) => handleInputChange('is_active', e.target.checked)}
//                       className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
//                     />
//                     <span className="text-xs sm:text-sm font-medium text-gray-700">✓ Active Plan</span>
//                   </label>

//                   <label className="flex items-center gap-2 cursor-pointer">
//                     <input
//                       type="checkbox"
//                       checked={formData.is_popular}
//                       onChange={(e) => handleInputChange('is_popular', e.target.checked)}
//                       className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
//                     />
//                     <span className="text-xs sm:text-sm font-medium text-gray-700">⭐ Mark as Popular</span>
//                   </label>
//                 </div>
//               </div>

//               {/* ═══════════════════════════════════════════════════════════
//                   PLAN LIMITS - ✅ NOW WITH BLANK FIELDS
//               ═══════════════════════════════════════════════════════════ */}
//               <div className="bg-gradient-to-br from-orange-50 to-red-50 border-2 border-orange-300 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6 shadow-md">
//                 <div className="flex items-center gap-2 mb-3 sm:mb-4">
//                   <div className="p-1.5 sm:p-2 bg-orange-600 rounded-lg">
//                     <Package className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
//                   </div>
//                   <div>
//                     <h3 className="font-bold text-gray-800 text-sm sm:text-base md:text-lg">🔢 Plan Limits</h3>
                   
//                   </div>
//                 </div>

//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
//                   {/* ✅ Max Scans - HIGHLIGHTED & BLANK */}
//                   <div className="sm:col-span-2 bg-white border-2 border-orange-400 rounded-lg p-3 sm:p-4 shadow-sm">
//                     <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
//                       <QrCode className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-orange-600" />
//                       Max Scans Per Plan ⭐ (CRITICAL)
//                     </label>
//                     <input
//                       type="number"
//                       value={formData.limits?.max_scans ?? ''}
//                       onChange={(e) => handleLimitChange('max_scans', e.target.value)}
//                       className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500 text-sm sm:text-base font-semibold bg-orange-50"
//                       placeholder="Enter number"
//                       min="-1"
//                     />
//                     <p className="text-xs text-gray-500 mt-1.5">💡 Leave blank or enter -1 for unlimited scans</p>
//                   </div>

                 

                 

                 

                  
//                 </div>
//               </div>

//               {/* ═══════════════════════════════════════════════════════════
//                   PLAN VALIDITY DURATION
//               ═══════════════════════════════════════════════════════════ */}
//               <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-300 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6 shadow-md">
//                 <div className="flex items-center gap-2 mb-3 sm:mb-4">
//                   <div className="p-1.5 sm:p-2 bg-blue-600 rounded-lg">
//                     <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
//                   </div>
//                   <div>
//                     <h3 className="font-bold text-gray-800 text-sm sm:text-base md:text-lg">⏰ Plan Validity Period</h3>
//                     <p className="text-xs text-gray-600">Set how long this plan will remain active</p>
//                   </div>
//                 </div>

//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
//                   <div>
//                     <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
//                       Duration *
//                     </label>
//                     <input
//                       type="number"
//                       value={formData.validity_duration}
//                       onChange={(e) => handleInputChange('validity_duration', parseInt(e.target.value) || 0)}
//                       className={`w-full px-3 sm:px-4 py-2 sm:py-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm sm:text-base font-semibold ${
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
//                     <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
//                       Unit *
//                     </label>
//                     <select
//                       value={formData.validity_unit}
//                       onChange={(e) => handleInputChange('validity_unit', e.target.value)}
//                       className={`w-full px-3 sm:px-4 py-2 sm:py-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm sm:text-base font-semibold ${
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
//                 <div className="mt-3 sm:mt-4 p-3 sm:p-4 bg-white rounded-lg border-2 border-blue-200 shadow-sm">
//                   <div className="flex items-center justify-between">
//                     <div>
//                       <p className="text-xs text-gray-600 mb-1">Plan will be valid for:</p>
//                       <p className="text-base sm:text-lg md:text-xl font-bold text-blue-600">
//                         {getValidityPreview()}
//                       </p>
//                     </div>
//                     <div className="text-3xl sm:text-4xl">
//                       {formData.validity_unit === 'minutes' ? '⏱️' :
//                         formData.validity_unit === 'hours' ? '🕐' :
//                         formData.validity_unit === 'days' ? '📅' :
//                         formData.validity_unit === 'months' ? '📆' : '🗓️'}
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* ═══════════════════════════════════════════════════════════
//                   PLAN FEATURES - MIN 1, UNLIMITED MAX
//               ═══════════════════════════════════════════════════════════ */}
//               <div className="bg-gray-50 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-gray-200">
//                 <div className="mb-3 sm:mb-4">
//                   <h3 className="font-semibold text-gray-800 text-sm sm:text-base flex items-center gap-2">
//                     ✨ Plan Features
//                     <span className="text-xs text-gray-500 font-normal">
//                       ({formData.features.length} feature{formData.features.length !== 1 ? 's' : ''})
//                     </span>
//                   </h3>
//                   <p className="text-xs text-gray-500 mt-1">
//                     <span className="font-medium text-purple-600">Minimum 1 required</span> • Unlimited features allowed • Click + to add more
//                   </p>
//                 </div>

//                 {errors.features && <p className="text-xs text-red-500 mb-3 font-semibold">{errors.features}</p>}

//                 <div className="space-y-3 sm:space-y-4">
//                   {formData.features.map((feature, index) => (
//                     <div key={index}>
//                       {/* Feature Card */}
//                       <div className="bg-white border-2 border-gray-200 rounded-lg p-3 sm:p-4 hover:border-purple-300 transition-all hover:shadow-md">
//                         <div className="flex items-center justify-between mb-3">
//                           <div className="flex items-center gap-2 flex-wrap">
//                             <span className="bg-purple-100 text-purple-700 text-xs font-bold px-2 sm:px-2.5 py-1 rounded-md">
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
//                             disabled={formData.features.length <= 1}
//                             className={`p-2 rounded-lg transition-all ${
//                               formData.features.length <= 1
//                                 ? 'text-gray-300 cursor-not-allowed'
//                                 : 'text-red-600 hover:bg-red-50 active:scale-95'
//                             }`}
//                             title={formData.features.length <= 1 ? 'Minimum 1 feature required' : 'Remove feature'}
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
//                               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm transition-all"
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
//                               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm transition-all"
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
//                             className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm resize-none transition-all"
//                             placeholder="Describe this feature in detail..."
//                             rows={2}
//                           />
//                         </div>
//                       </div>

//                       {/* ✅ Add Button - Only show for last feature */}
//                       {index === formData.features.length - 1 && (
//                         <div className="flex justify-center -mt-2 mb-2">
//                           <button
//                             type="button"
//                             onClick={() => addFeatureAfter(index)}
//                             className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-4 sm:px-5 py-2 sm:py-2.5 rounded-full shadow-lg hover:shadow-xl transition-all transform hover:scale-105 active:scale-95 flex items-center gap-2 text-xs sm:text-sm font-semibold"
//                             title="Add new feature"
//                           >
//                             <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
//                             Add Feature
//                           </button>
//                         </div>
//                       )}
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>

//             {/* ═══════════════════════════════════════════════════════════
//                 FOOTER BUTTONS
//             ═══════════════════════════════════════════════════════════ */}
//             <div className="flex flex-col sm:flex-row gap-3 mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-200">
//               <button
//                 type="button"
//                 onClick={onClose}
//                 disabled={creating}
//                 className="w-full sm:w-auto px-5 sm:px-6 py-2.5 sm:py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 font-medium text-sm sm:text-base transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
//               >
//                 Cancel
//               </button>
//               <button
//                 type="submit"
//                 disabled={creating || formData.features.length < 1}
//                 className="w-full sm:w-auto flex-1 px-5 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 font-semibold disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base transition-all shadow-md hover:shadow-lg active:scale-95"
//               >
//                 {creating ? (
//                   <div className="flex items-center justify-center gap-2">
//                     <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-white"></div>
//                     Creating Plan...
//                   </div>
//                 ) : (
//                   '✅ Create Plan'
//                 )}
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// console.log('✅ CreatePlanModal - PRODUCTION v7.0 FINAL (Blank Limits + Fully Responsive)'); 
import React, { useState, useEffect } from 'react';
import { X, Clock, Plus, Trash2, Package, QrCode } from 'lucide-react';
import { createPlan, validatePlanData } from '../../lib/planService';
import type { CreatePlanData, PlanFeature, PlanValidationError } from '../../types/plan.types';
import type { PlanLimits } from '../../types/plan.types';

interface CreatePlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const CreatePlanModal: React.FC<CreatePlanModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const [formData, setFormData] = useState<CreatePlanData>({
    plan_name: '',
    price: '', // ✅ Empty string
    currency: 'INR',
    billing_cycle: 'monthly',
    validity_duration: 30,
    validity_unit: 'days',
    features: [
      { title: '', description: '', included: true, icon: '' }
    ],
    limits: {
      max_tiles: null as any, // ✅ Empty initially
      max_collections: null as any,
      max_qr_codes: null as any,
      max_workers: null as any,
      max_storage_mb: null as any,
      analytics_retention_days: null as any,
      customer_inquiries_limit: null as any,
      max_scans: null as any // ✅ Empty initially
    },
    is_active: true,
    is_popular: false,
    display_order: 1
  });

  const [errors, setErrors] = useState<PlanValidationError>({});
  const [creating, setCreating] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // ✅ Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      resetForm();
    }
  }, [isOpen]);

  const handleInputChange = (field: keyof CreatePlanData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (field in errors && errors[field as keyof PlanValidationError]) {
      const newErrors = { ...errors };
      delete newErrors[field as keyof PlanValidationError];
      setErrors(newErrors);
    }
  };

  const handleFeatureChange = (index: number, field: keyof PlanFeature, value: any) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = { ...newFeatures[index], [field]: value };
    setFormData(prev => ({ ...prev, features: newFeatures }));
  };

  const addFeatureAfter = (index: number) => {
    const newFeatures = [...formData.features];
    newFeatures.splice(index + 1, 0, { title: '', description: '', included: true, icon: '' });
    setFormData(prev => ({ ...prev, features: newFeatures }));
  };

  const removeFeature = (index: number) => {
    if (formData.features.length <= 1) {
      alert('⚠️ At least 1 feature is required');
      return;
    }
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  const getValidityPreview = () => {
    const { validity_duration, validity_unit } = formData;
    if (!validity_duration || validity_duration <= 0) return 'Not set';

    if (validity_duration === 1) {
      const singular = validity_unit.replace(/s$/, '');
      return `${validity_duration} ${singular}`;
    }
    return `${validity_duration} ${validity_unit}`;
  };

  // ✅ Updated to handle empty values properly
  const handleLimitChange = (field: keyof PlanLimits, value: string) => {
    setFormData(prev => ({
      ...prev,
      limits: {
        ...prev.limits!,
        [field]: value === '' ? null : parseInt(value) || 0
      }
    }));
  };

  const resetForm = () => {
    setFormData({
      plan_name: '',
      price: '',
      currency: 'INR',
      billing_cycle: 'monthly',
      validity_duration: 30,
      validity_unit: 'days',
      features: [
        { title: '', description: '', included: true, icon: '' }
      ],
      limits: {
        max_tiles: null as any,
        max_collections: null as any,
        max_qr_codes: null as any,
        max_workers: null as any,
        max_storage_mb: null as any,
        analytics_retention_days: null as any,
        customer_inquiries_limit: null as any,
        max_scans: null as any
      },
      is_active: true,
      is_popular: false,
      display_order: 1
    });
    setErrors({});
    setSuccessMessage(null);
    setCreating(false);
  };

  // ✅ Handle close with reset
  const handleClose = () => {
    resetForm();
    onClose();
  };

  // ✅ Handle cancel with reset
  const handleCancel = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // ✅ Validate minimum features
    if (formData.features.length < 1) {
      alert('❌ At least 1 feature is required');
      return;
    }

    // ✅ Validate features content
    const hasEmptyFeatures = formData.features.some(f => !f.title.trim() || !f.description.trim());
    if (hasEmptyFeatures) {
      alert('❌ All features must have a title and description');
      return;
    }

    // ✅ Convert null/empty limits to -1 before submission
    const dataToSubmit = {
      ...formData,
      limits: {
        max_tiles: formData.limits?.max_tiles ?? -1,
        max_collections: formData.limits?.max_collections ?? -1,
        max_qr_codes: formData.limits?.max_qr_codes ?? -1,
        max_workers: formData.limits?.max_workers ?? 1,
        max_storage_mb: formData.limits?.max_storage_mb ?? 1000,
        analytics_retention_days: formData.limits?.analytics_retention_days ?? 365,
        customer_inquiries_limit: formData.limits?.customer_inquiries_limit ?? -1,
        max_scans: formData.limits?.max_scans ?? -1
      }
    };

    const validationErrors = validatePlanData(dataToSubmit);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      const errorMsg = Object.values(validationErrors).join('\n');
      alert(`❌ Validation Errors:\n${errorMsg}`);
      return;
    }

    setCreating(true);

    try {
      const result = await createPlan(dataToSubmit);

      if (result.success) {
        setSuccessMessage('✅ Plan created successfully!');
        setTimeout(() => {
          onSuccess();
          resetForm();
          onClose();
        }, 1500);
      } else {
        alert(`❌ Failed to create plan:\n${result.error}`);
      }
    } catch (error: any) {
      console.error('Error creating plan:', error);
      alert(`❌ Error: ${error.message}`);
    } finally {
      setCreating(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={handleClose}></div>

      <div className="flex min-h-full items-center justify-center p-2 sm:p-4">
        <div className="relative bg-white rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
          {/* ═══════════════════════════════════════════════════════════
              HEADER
          ═══════════════════════════════════════════════════════════ */}
          <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-4 sm:p-6 z-10">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-1">➕ Create New Plan</h2>
                <p className="text-purple-100 text-xs sm:text-sm">Configure plan details and features</p>
              </div>
              <button
                onClick={handleClose}
                className="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-2 transition-colors"
                type="button"
                disabled={creating}
              >
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>
          </div>

          {/* Success Message */}
          {successMessage && (
            <div className="bg-green-50 border border-green-200 p-3 sm:p-4 text-center">
              <p className="text-green-800 font-semibold text-sm sm:text-base">{successMessage}</p>
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════════
              FORM
          ═══════════════════════════════════════════════════════════ */}
          <form onSubmit={handleSubmit} className="p-3 sm:p-4 md:p-6 overflow-y-auto max-h-[calc(90vh-160px)] sm:max-h-[calc(90vh-180px)]">
            <div className="space-y-4 sm:space-y-6">
              {/* ═══════════════════════════════════════════════════════════
                  BASIC INFORMATION
              ═══════════════════════════════════════════════════════════ */}
              <div className="bg-gray-50 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-gray-200">
                <h3 className="font-semibold text-gray-800 mb-3 sm:mb-4 text-sm sm:text-base flex items-center gap-2">
                  📋 Basic Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                      Plan Name *
                    </label>
                    <input
                      type="text"
                      value={formData.plan_name}
                      onChange={(e) => handleInputChange('plan_name', e.target.value)}
                      className={`w-full px-3 py-2 sm:py-2.5 border rounded-lg focus:ring-2 focus:ring-purple-500 text-sm sm:text-base ${
                        errors.plan_name ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="e.g., Premium"
                      disabled={creating}
                    />
                    {errors.plan_name && <p className="text-xs text-red-500 mt-1">{errors.plan_name}</p>}
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                      Price (₹) *
                    </label>
                    <input
                      type="number"
                      value={formData.price}
                      onChange={(e) => handleInputChange('price', e.target.value)}
                      className={`w-full px-3 py-2 sm:py-2.5 border rounded-lg focus:ring-2 focus:ring-purple-500 text-sm sm:text-base ${
                        errors.price ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter price"
                      min="0"
                      step="0.01"
                      disabled={creating}
                    />
                    {errors.price && <p className="text-xs text-red-500 mt-1">{errors.price}</p>}
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                      Billing Cycle *
                    </label>
                    <select
                      value={formData.billing_cycle}
                      onChange={(e) => handleInputChange('billing_cycle', e.target.value)}
                      className="w-full px-3 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
                      disabled={creating}
                    >
                      <option value="monthly">Monthly</option>
                      <option value="yearly">Yearly</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 sm:gap-4 md:gap-6 mt-3 sm:mt-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.is_active}
                      onChange={(e) => handleInputChange('is_active', e.target.checked)}
                      className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                      disabled={creating}
                    />
                    <span className="text-xs sm:text-sm font-medium text-gray-700">✓ Active Plan</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.is_popular}
                      onChange={(e) => handleInputChange('is_popular', e.target.checked)}
                      className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                      disabled={creating}
                    />
                    <span className="text-xs sm:text-sm font-medium text-gray-700">⭐ Mark as Popular</span>
                  </label>
                </div>
              </div>

              {/* ═══════════════════════════════════════════════════════════
                  PLAN LIMITS - ✅ NOW WITH BLANK FIELDS
              ═══════════════════════════════════════════════════════════ */}
              <div className="bg-gradient-to-br from-orange-50 to-red-50 border-2 border-orange-300 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6 shadow-md">
                <div className="flex items-center gap-2 mb-3 sm:mb-4">
                  <div className="p-1.5 sm:p-2 bg-orange-600 rounded-lg">
                    <Package className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 text-sm sm:text-base md:text-lg">🔢 Plan Limits</h3>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {/* ✅ Max Scans - HIGHLIGHTED & BLANK */}
                  <div className="sm:col-span-2 bg-white border-2 border-orange-400 rounded-lg p-3 sm:p-4 shadow-sm">
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                      <QrCode className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-orange-600" />
                      Max Scans Per Plan ⭐ (CRITICAL)
                    </label>
                    <input
                      type="number"
                      value={formData.limits?.max_scans ?? ''}
                      onChange={(e) => handleLimitChange('max_scans', e.target.value)}
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500 text-sm sm:text-base font-semibold bg-orange-50"
                      placeholder="Enter number"
                      min="-1"
                      disabled={creating}
                    />
                    <p className="text-xs text-gray-500 mt-1.5">💡 Leave blank or enter -1 for unlimited scans</p>
                  </div>
                </div>
              </div>

              {/* ═══════════════════════════════════════════════════════════
                  PLAN VALIDITY DURATION
              ═══════════════════════════════════════════════════════════ */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-300 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6 shadow-md">
                <div className="flex items-center gap-2 mb-3 sm:mb-4">
                  <div className="p-1.5 sm:p-2 bg-blue-600 rounded-lg">
                    <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 text-sm sm:text-base md:text-lg">⏰ Plan Validity Period</h3>
                    <p className="text-xs text-gray-600">Set how long this plan will remain active</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                      Duration *
                    </label>
                    <input
                      type="number"
                      value={formData.validity_duration}
                      onChange={(e) => handleInputChange('validity_duration', parseInt(e.target.value) || 0)}
                      className={`w-full px-3 sm:px-4 py-2 sm:py-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm sm:text-base font-semibold ${
                        errors.validity_duration ? 'border-red-500' : 'border-blue-300'
                      }`}
                      placeholder="e.g., 30"
                      min="1"
                      disabled={creating}
                    />
                    {errors.validity_duration && (
                      <p className="text-xs text-red-500 mt-1">{errors.validity_duration}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                      Unit *
                    </label>
                    <select
                      value={formData.validity_unit}
                      onChange={(e) => handleInputChange('validity_unit', e.target.value)}
                      className={`w-full px-3 sm:px-4 py-2 sm:py-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm sm:text-base font-semibold ${
                        errors.validity_unit ? 'border-red-500' : 'border-blue-300'
                      }`}
                      disabled={creating}
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
                <div className="mt-3 sm:mt-4 p-3 sm:p-4 bg-white rounded-lg border-2 border-blue-200 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Plan will be valid for:</p>
                      <p className="text-base sm:text-lg md:text-xl font-bold text-blue-600">
                        {getValidityPreview()}
                      </p>
                    </div>
                    <div className="text-3xl sm:text-4xl">
                      {formData.validity_unit === 'minutes' ? '⏱️' :
                        formData.validity_unit === 'hours' ? '🕐' :
                        formData.validity_unit === 'days' ? '📅' :
                        formData.validity_unit === 'months' ? '📆' : '🗓️'}
                    </div>
                  </div>
                </div>
              </div>

              {/* ═══════════════════════════════════════════════════════════
                  PLAN FEATURES - MIN 1, UNLIMITED MAX
              ═══════════════════════════════════════════════════════════ */}
              <div className="bg-gray-50 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-gray-200">
                <div className="mb-3 sm:mb-4">
                  <h3 className="font-semibold text-gray-800 text-sm sm:text-base flex items-center gap-2">
                    ✨ Plan Features
                    <span className="text-xs text-gray-500 font-normal">
                      ({formData.features.length} feature{formData.features.length !== 1 ? 's' : ''})
                    </span>
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    <span className="font-medium text-purple-600">Minimum 1 required</span> • Unlimited features allowed • Click + to add more
                  </p>
                </div>

                {errors.features && <p className="text-xs text-red-500 mb-3 font-semibold">{errors.features}</p>}

                <div className="space-y-3 sm:space-y-4">
                  {formData.features.map((feature, index) => (
                    <div key={index}>
                      {/* Feature Card */}
                      <div className="bg-white border-2 border-gray-200 rounded-lg p-3 sm:p-4 hover:border-purple-300 transition-all hover:shadow-md">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="bg-purple-100 text-purple-700 text-xs font-bold px-2 sm:px-2.5 py-1 rounded-md">
                              #{index + 1}
                            </span>
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={feature.included}
                                onChange={(e) => handleFeatureChange(index, 'included', e.target.checked)}
                                className="w-4 h-4 text-green-600 rounded focus:ring-green-500 cursor-pointer"
                                disabled={creating}
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
                            disabled={formData.features.length <= 1 || creating}
                            className={`p-2 rounded-lg transition-all ${
                              formData.features.length <= 1 || creating
                                ? 'text-gray-300 cursor-not-allowed'
                                : 'text-red-600 hover:bg-red-50 active:scale-95'
                            }`}
                            title={formData.features.length <= 1 ? 'Minimum 1 feature required' : 'Remove feature'}
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
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm transition-all"
                              placeholder="e.g., Unlimited Tiles"
                              disabled={creating}
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
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm transition-all"
                              placeholder="e.g., 🚀"
                              maxLength={2}
                              disabled={creating}
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
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm resize-none transition-all"
                            placeholder="Describe this feature in detail..."
                            rows={2}
                            disabled={creating}
                          />
                        </div>
                      </div>

                      {/* ✅ Add Button - Only show for last feature */}
                      {index === formData.features.length - 1 && !creating && (
                        <div className="flex justify-center -mt-2 mb-2">
                          <button
                            type="button"
                            onClick={() => addFeatureAfter(index)}
                            className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-4 sm:px-5 py-2 sm:py-2.5 rounded-full shadow-lg hover:shadow-xl transition-all transform hover:scale-105 active:scale-95 flex items-center gap-2 text-xs sm:text-sm font-semibold"
                            title="Add new feature"
                          >
                            <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                            Add Feature
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ═══════════════════════════════════════════════════════════
                FOOTER BUTTONS
            ═══════════════════════════════════════════════════════════ */}
            <div className="flex flex-col sm:flex-row gap-3 mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={handleCancel}
                disabled={creating}
                className="w-full sm:w-auto px-5 sm:px-6 py-2.5 sm:py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 font-medium text-sm sm:text-base transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={creating || formData.features.length < 1}
                className="w-full sm:w-auto flex-1 px-5 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 font-semibold disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base transition-all shadow-md hover:shadow-lg active:scale-95"
              >
                {creating ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-white"></div>
                    Creating Plan...
                  </div>
                ) : (
                  '✅ Create Plan'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

console.log('✅ CreatePlanModal - PRODUCTION v8.0 FINAL (Form Reset Fix + All Device Support)');
