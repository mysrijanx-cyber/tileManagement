
import React, { useState, useEffect } from 'react';
import { X, Clock } from 'lucide-react';
import { updatePlan, validatePlanData, getValidityDisplayText } from '../../lib/planService';
import type { Plan, UpdatePlanData, PlanFeature, PlanValidationError } from '../../types/plan.types';

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
      customer_inquiries_limit: -1
    },
    is_active: true,
    is_popular: false,
    display_order: 1,
    updated_by: ''
  });

  const [errors, setErrors] = useState<PlanValidationError>({});
  const [updating, setUpdating] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (plan && isOpen) {
      setFormData({
        plan_name: plan.plan_name,
        price: plan.price,
        currency: plan.currency,
        billing_cycle: plan.billing_cycle,
        validity_duration: plan.validity_duration || 30,
        validity_unit: plan.validity_unit || 'days',
        features: [...plan.features],
        limits: { ...plan.limits },
        is_active: plan.is_active,
        is_popular: plan.is_popular,
        display_order: plan.display_order,
        updated_by: ''
      });
    }
  }, [plan, isOpen]);

  const handleInputChange = (field: keyof UpdatePlanData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleFeatureChange = (index: number, field: keyof PlanFeature, value: any) => {
    if (!formData.features) return;
    const newFeatures = [...formData.features];
    newFeatures[index] = { ...newFeatures[index], [field]: value };
    setFormData(prev => ({ ...prev, features: newFeatures }));
  };

  const handleLimitChange = (field: string, value: number) => {
    if (!formData.limits) return;
    setFormData(prev => ({
      ...prev,
      limits: { ...prev.limits!, [field]: value }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!plan) return;
    
    const validationErrors = validatePlanData(formData as any);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      alert('❌ Please fix validation errors');
      return;
    }
    
    setUpdating(true);
    
    try {
      const result = await updatePlan(plan.id, formData);
      
      if (result.success) {
        setSuccessMessage('✅ Plan updated successfully!');
        setTimeout(() => {
          onSuccess();
          onClose();
        }, 1500);
      } else {
        alert(`❌ Failed to update plan:\n${result.error}`);
      }
    } catch (error: any) {
      console.error('Error updating plan:', error);
      alert(`❌ Error: ${error.message}`);
    } finally {
      setUpdating(false);
    }
  };

  if (!isOpen || !plan) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose}></div>

      <div className="flex min-h-full items-center justify-center p-2 sm:p-4">
        <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 sm:p-6 z-10">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold mb-1">✏️ Edit Plan</h2>
                <p className="text-blue-100 text-xs sm:text-sm">Modify plan: {plan.plan_name}</p>
              </div>
              <button onClick={onClose} className="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-2">
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>
          </div>

          {/* Success Message */}
          {successMessage && (
            <div className="bg-green-50 border border-green-200 p-4 text-center">
              <p className="text-green-800 font-semibold">{successMessage}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-4 sm:p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
            <div className="space-y-6">
              {/* Basic Info */}
              <div className="bg-gray-50 rounded-xl p-3 sm:p-4">
                <h3 className="font-semibold text-gray-800 mb-4 text-sm sm:text-base">📋 Basic Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Plan Name *</label>
                    <input
                      type="text"
                      value={formData.plan_name}
                      onChange={(e) => handleInputChange('plan_name', e.target.value)}
                      className={`w-full px-3 sm:px-4 py-2 border rounded-lg text-sm sm:text-base ${errors.plan_name ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {errors.plan_name && <p className="text-xs text-red-500 mt-1">{errors.plan_name}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹) *</label>
                    <input
                      type="number"
                      value={formData.price}
                      onChange={(e) => handleInputChange('price', parseFloat(e.target.value))}
                      className={`w-full px-3 sm:px-4 py-2 border rounded-lg text-sm sm:text-base ${errors.price ? 'border-red-500' : 'border-gray-300'}`}
                      min="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Billing Cycle *</label>
                    <select
                      value={formData.billing_cycle}
                      onChange={(e) => handleInputChange('billing_cycle', e.target.value)}
                      className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg text-sm sm:text-base"
                    >
                      <option value="monthly">Monthly</option>
                      <option value="yearly">Yearly</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Display Order</label>
                    <input
                      type="number"
                      value={formData.display_order}
                      onChange={(e) => handleInputChange('display_order', parseInt(e.target.value))}
                      className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg text-sm sm:text-base"
                      min="1"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 sm:gap-6 mt-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.is_active}
                      onChange={(e) => handleInputChange('is_active', e.target.checked)}
                      className="w-4 h-4 text-blue-600 rounded"
                    />
                    <span className="text-sm font-medium text-gray-700">Active Plan</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.is_popular}
                      onChange={(e) => handleInputChange('is_popular', e.target.checked)}
                      className="w-4 h-4 text-blue-600 rounded"
                    />
                    <span className="text-sm font-medium text-gray-700">Mark as Popular</span>
                  </label>
                </div>
              </div>

              {/* ✨ NEW: Plan Validity Duration */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-3 sm:p-4">
                <div className="flex items-center gap-2 mb-4">
                  <Clock className="w-5 h-5 text-blue-600" />
                  <h3 className="font-semibold text-gray-800 text-sm sm:text-base">⏰ Plan Validity Duration</h3>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Duration Value *
                    </label>
                    <input
                      type="number"
                      value={formData.validity_duration}
                      onChange={(e) => handleInputChange('validity_duration', parseInt(e.target.value))}
                      className={`w-full px-3 sm:px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-sm sm:text-base ${
                        errors.validity_duration ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="30"
                      min="1"
                    />
                    {errors.validity_duration && (
                      <p className="text-xs text-red-500 mt-1">{errors.validity_duration}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Duration Unit *
                    </label>
                    <select
                      value={formData.validity_unit}
                      onChange={(e) => handleInputChange('validity_unit', e.target.value)}
                      className={`w-full px-3 sm:px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-sm sm:text-base ${
                        errors.validity_unit ? 'border-red-500' : 'border-gray-300'
                      }`}
                    >
                      <option value="minutes">Minutes</option>
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

                <div className="mt-3 p-3 bg-white rounded-lg border border-blue-200">
                  <p className="text-xs sm:text-sm text-gray-600">
                    <span className="font-semibold">Plan will be valid for:</span>{' '}
                    <span className="text-blue-600 font-bold">
                      {getValidityDisplayText(formData.validity_duration || 30, formData.validity_unit || 'days')}
                    </span>
                  </p>
                </div>
              </div>

              {/* Features */}
              <div className="bg-gray-50 rounded-xl p-3 sm:p-4">
                <h3 className="font-semibold text-gray-800 mb-4 text-sm sm:text-base">✨ Plan Features</h3>
                
                <div className="space-y-3 sm:space-y-4">
                  {formData.features?.map((feature, index) => (
                    <div key={index} className="bg-white border border-gray-200 rounded-lg p-3 sm:p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium text-gray-700 text-sm">Feature {index + 1}</h4>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={feature.included}
                            onChange={(e) => handleFeatureChange(index, 'included', e.target.checked)}
                            className="w-4 h-4 text-green-600 rounded"
                          />
                          <span className="text-xs sm:text-sm text-gray-600">Included</span>
                        </label>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <input
                          type="text"
                          value={feature.title}
                          onChange={(e) => handleFeatureChange(index, 'title', e.target.value)}
                          className="px-3 py-2 border border-gray-300 rounded-lg text-xs sm:text-sm"
                          placeholder="Feature title *"
                        />
                        <input
                          type="text"
                          value={feature.icon || ''}
                          onChange={(e) => handleFeatureChange(index, 'icon', e.target.value)}
                          className="px-3 py-2 border border-gray-300 rounded-lg text-xs sm:text-sm"
                          placeholder="Icon emoji"
                        />
                      </div>

                      <textarea
                        value={feature.description}
                        onChange={(e) => handleFeatureChange(index, 'description', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs sm:text-sm mt-3"
                        placeholder="Feature description *"
                        rows={2}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Limits */}
              <div className="bg-gray-50 rounded-xl p-3 sm:p-4">
                <h3 className="font-semibold text-gray-800 mb-4 text-sm sm:text-base">🔢 Plan Limits</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Max Tiles</label>
                    <input
                      type="number"
                      value={formData.limits?.max_tiles}
                      onChange={(e) => handleLimitChange('max_tiles', parseInt(e.target.value))}
                      className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg text-sm sm:text-base"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Max QR Codes</label>
                    <input
                      type="number"
                      value={formData.limits?.max_qr_codes}
                      onChange={(e) => handleLimitChange('max_qr_codes', parseInt(e.target.value))}
                      className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg text-sm sm:text-base"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Max Workers</label>
                    <input
                      type="number"
                      value={formData.limits?.max_workers}
                      onChange={(e) => handleLimitChange('max_workers', parseInt(e.target.value))}
                      className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg text-sm sm:text-base"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Analytics Retention (days)</label>
                    <input
                      type="number"
                      value={formData.limits?.analytics_retention_days}
                      onChange={(e) => handleLimitChange('analytics_retention_days', parseInt(e.target.value))}
                      className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg text-sm sm:text-base"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex flex-col sm:flex-row gap-3 mt-6 pt-6 border-t">
              <button
                type="button"
                onClick={onClose}
                className="w-full px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 font-medium text-sm sm:text-base"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={updating}
                className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50 text-sm sm:text-base"
              >
                {updating ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Updating...
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

console.log('✅ EditPlanModal Component loaded - PRODUCTION v3.0 (WITH VALIDITY DURATION)');