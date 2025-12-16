// ═══════════════════════════════════════════════════════════════
// ✅ CREATE PLAN MODAL - PRODUCTION v1.0
// Admin only component
// ═══════════════════════════════════════════════════════════════

import React, { useState } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { createPlan, validatePlanData } from '../../lib/planService';
import type { CreatePlanData, PlanFeature, PlanValidationError } from '../../types/plan.types';

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
    price: 0,
    currency: 'INR',
    billing_cycle: 'monthly',
    features: [
      { title: '', description: '', included: true, icon: '' },
      { title: '', description: '', included: true, icon: '' },
      { title: '', description: '', included: true, icon: '' },
      { title: '', description: '', included: true, icon: '' },
      { title: '', description: '', included: true, icon: '' }
    ],
    limits: {
      max_tiles: -1,
      max_qr_codes: -1,
      max_workers: 1,
      analytics_retention_days: 365,
      customer_inquiries_limit: -1
    },
    is_active: true,
    is_popular: false,
    display_order: 1
  });

  const [errors, setErrors] = useState<PlanValidationError>({});
  const [creating, setCreating] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleInputChange = (field: keyof CreatePlanData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleFeatureChange = (index: number, field: keyof PlanFeature, value: any) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = { ...newFeatures[index], [field]: value };
    setFormData(prev => ({ ...prev, features: newFeatures }));
  };

  const handleLimitChange = (field: keyof typeof formData.limits, value: number) => {
    setFormData(prev => ({
      ...prev,
      limits: { ...prev.limits, [field]: value }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate
    const validationErrors = validatePlanData(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      alert('❌ Please fix validation errors');
      return;
    }
    
    setCreating(true);
    
    try {
      const result = await createPlan(formData);
      
      if (result.success) {
        setSuccessMessage('✅ Plan created successfully!');
        setTimeout(() => {
          onSuccess();
          onClose();
          resetForm();
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

  const resetForm = () => {
    setFormData({
      plan_name: '',
      price: 0,
      currency: 'INR',
      billing_cycle: 'monthly',
      features: [
        { title: '', description: '', included: true, icon: '' },
        { title: '', description: '', included: true, icon: '' },
        { title: '', description: '', included: true, icon: '' },
        { title: '', description: '', included: true, icon: '' },
        { title: '', description: '', included: true, icon: '' }
      ],
      limits: {
        max_tiles: -1,
        max_qr_codes: -1,
        max_workers: 1,
        analytics_retention_days: 365,
        customer_inquiries_limit: -1
      },
      is_active: true,
      is_popular: false,
      display_order: 1
    });
    setErrors({});
    setSuccessMessage(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose}></div>

      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-6 z-10">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-1">➕ Create New Plan</h2>
                <p className="text-purple-100 text-sm">Configure plan details and features</p>
              </div>
              <button onClick={onClose} className="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-2">
                <X className="w-6 h-6" />
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
          <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
            <div className="space-y-6">
              {/* Basic Info */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="font-semibold text-gray-800 mb-4">📋 Basic Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Plan Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Plan Name *
                    </label>
                    <input
                      type="text"
                      value={formData.plan_name}
                      onChange={(e) => handleInputChange('plan_name', e.target.value)}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 ${
                        errors.plan_name ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="e.g., Premium"
                    />
                    {errors.plan_name && (
                      <p className="text-xs text-red-500 mt-1">{errors.plan_name}</p>
                    )}
                  </div>

                  {/* Price */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Price (₹) *
                    </label>
                    <input
                      type="number"
                      value={formData.price}
                      onChange={(e) => handleInputChange('price', parseFloat(e.target.value))}
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 ${
                        errors.price ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="1999"
                      min="0"
                    />
                    {errors.price && (
                      <p className="text-xs text-red-500 mt-1">{errors.price}</p>
                    )}
                  </div>

                  {/* Billing Cycle */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Billing Cycle *
                    </label>
                    <select
                      value={formData.billing_cycle}
                      onChange={(e) => handleInputChange('billing_cycle', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="monthly">Monthly</option>
                      <option value="yearly">Yearly</option>
                    </select>
                  </div>

                  {/* Display Order */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Display Order
                    </label>
                    <input
                      type="number"
                      value={formData.display_order}
                      onChange={(e) => handleInputChange('display_order', parseInt(e.target.value))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      min="1"
                    />
                  </div>
                </div>

                {/* Toggles */}
                <div className="flex gap-6 mt-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.is_active}
                      onChange={(e) => handleInputChange('is_active', e.target.checked)}
                      className="w-4 h-4 text-purple-600 rounded"
                    />
                    <span className="text-sm font-medium text-gray-700">Active Plan</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.is_popular}
                      onChange={(e) => handleInputChange('is_popular', e.target.checked)}
                      className="w-4 h-4 text-purple-600 rounded"
                    />
                    <span className="text-sm font-medium text-gray-700">Mark as Popular</span>
                  </label>
                </div>
              </div>

              {/* Features */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="font-semibold text-gray-800 mb-4">✨ Plan Features (5 Required)</h3>
                {errors.features && (
                  <p className="text-xs text-red-500 mb-3">{errors.features}</p>
                )}
                
                <div className="space-y-4">
                  {formData.features.map((feature, index) => (
                    <div key={index} className="bg-white border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium text-gray-700">Feature {index + 1}</h4>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={feature.included}
                            onChange={(e) => handleFeatureChange(index, 'included', e.target.checked)}
                            className="w-4 h-4 text-green-600 rounded"
                          />
                          <span className="text-sm text-gray-600">Included</span>
                        </label>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <input
                            type="text"
                            value={feature.title}
                            onChange={(e) => handleFeatureChange(index, 'title', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                            placeholder="Feature title *"
                          />
                        </div>
                        <div>
                          <input
                            type="text"
                            value={feature.icon || ''}
                            onChange={(e) => handleFeatureChange(index, 'icon', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                            placeholder="Icon emoji (optional)"
                          />
                        </div>
                      </div>

                      <textarea
                        value={feature.description}
                        onChange={(e) => handleFeatureChange(index, 'description', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm mt-3"
                        placeholder="Feature description *"
                        rows={2}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Limits */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="font-semibold text-gray-800 mb-4">🔢 Plan Limits</h3>
                <p className="text-xs text-gray-600 mb-3">Use -1 for unlimited</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Max Tiles
                    </label>
                    <input
                      type="number"
                      value={formData.limits.max_tiles}
                      onChange={(e) => handleLimitChange('max_tiles', parseInt(e.target.value))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Max QR Codes
                    </label>
                    <input
                      type="number"
                      value={formData.limits.max_qr_codes}
                      onChange={(e) => handleLimitChange('max_qr_codes', parseInt(e.target.value))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Max Workers
                    </label>
                    <input
                      type="number"
                      value={formData.limits.max_workers}
                      onChange={(e) => handleLimitChange('max_workers', parseInt(e.target.value))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Analytics Retention (days)
                    </label>
                    <input
                      type="number"
                      value={formData.limits.analytics_retention_days}
                      onChange={(e) => handleLimitChange('analytics_retention_days', parseInt(e.target.value))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="flex gap-3 mt-6 pt-6 border-t">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={creating}
                className="flex-1 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium disabled:opacity-50"
              >
                {creating ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Creating...
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

console.log('✅ CreatePlanModal Component loaded - PRODUCTION v1.0');