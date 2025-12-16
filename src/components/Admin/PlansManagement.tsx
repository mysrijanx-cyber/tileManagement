// ═══════════════════════════════════════════════════════════════
// ✅ PLANS MANAGEMENT - PRODUCTION v1.0
// Admin Dashboard Tab
// ═══════════════════════════════════════════════════════════════

import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, ToggleLeft, ToggleRight, RefreshCw, Eye } from 'lucide-react';
import { getAllPlans, deletePlan, togglePlanStatus } from '../../lib/planService';
import { CreatePlanModal } from './CreatePlanModal';
import { EditPlanModal } from './EditPlanModal';
import type { Plan } from '../../types/plan.types';

export const PlansManagement: React.FC = () => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [processingAction, setProcessingAction] = useState<string | null>(null);

  useEffect(() => {
    loadPlans();
  }, []);

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
    const confirmed = confirm(
      `🗑️ Delete Plan?\n\n` +
      `Plan: ${plan.plan_name}\n` +
      `Price: ₹${plan.price}\n\n` +
      `This action cannot be undone if no subscriptions exist.\n\n` +
      `Continue?`
    );

    if (!confirmed) return;

    setProcessingAction(plan.id);

    try {
      const result = await deletePlan(plan.id);

      if (result.success) {
        alert('✅ Plan deleted successfully');
        await loadPlans();
      } else {
        alert(`❌ Failed to delete plan:\n${result.error}`);
      }
    } catch (error: any) {
      alert(`❌ Error: ${error.message}`);
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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading plans...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-1">💎 Plans Management</h2>
            <p className="text-purple-100">Create, edit, and manage subscription plans</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={loadPlans}
              className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-white text-purple-600 px-6 py-2 rounded-lg hover:bg-purple-50 transition-colors font-semibold flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Create Plan
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <p className="text-sm text-gray-600 mb-1">Total Plans</p>
          <p className="text-2xl font-bold text-gray-800">{plans.length}</p>
        </div>
        <div className="bg-green-50 rounded-xl p-4 border border-green-200">
          <p className="text-sm text-green-600 mb-1">Active Plans</p>
          <p className="text-2xl font-bold text-green-800">{plans.filter(p => p.is_active).length}</p>
        </div>
        <div className="bg-red-50 rounded-xl p-4 border border-red-200">
          <p className="text-sm text-red-600 mb-1">Inactive Plans</p>
          <p className="text-2xl font-bold text-red-800">{plans.filter(p => !p.is_active).length}</p>
        </div>
        <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-200">
          <p className="text-sm text-yellow-600 mb-1">Popular Plans</p>
          <p className="text-2xl font-bold text-yellow-800">{plans.filter(p => p.is_popular).length}</p>
        </div>
      </div>

      {/* Plans List */}
      {plans.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center border border-gray-200">
          <div className="text-gray-400 text-6xl mb-4">📦</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No Plans Created</h3>
          <p className="text-gray-600 mb-6">Create your first subscription plan to get started</p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 font-semibold inline-flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Create First Plan
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`bg-white rounded-xl shadow-lg overflow-hidden border-2 transition-all ${
                plan.is_active ? 'border-green-200' : 'border-gray-200 opacity-75'
              }`}
            >
              {/* Plan Header */}
              <div className={`p-4 ${plan.is_popular ? 'bg-gradient-to-r from-yellow-400 to-orange-500' : 'bg-gray-100'}`}>
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className={`text-xl font-bold ${plan.is_popular ? 'text-white' : 'text-gray-800'}`}>
                      {plan.plan_name}
                    </h3>
                    <p className={`text-sm ${plan.is_popular ? 'text-white text-opacity-90' : 'text-gray-600'}`}>
                      Order: {plan.display_order}
                    </p>
                  </div>
                  <div className="flex gap-1">
                    {plan.is_popular && (
                      <span className="bg-white text-orange-600 text-xs font-bold px-2 py-1 rounded">⭐ POPULAR</span>
                    )}
                    {plan.is_active ? (
                      <span className="bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded">✓ Active</span>
                    ) : (
                      <span className="bg-red-100 text-red-800 text-xs font-bold px-2 py-1 rounded">✗ Inactive</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Price */}
              <div className="p-6 border-b">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-extrabold text-purple-600">₹{plan.price.toLocaleString('en-IN')}</span>
                  <span className="text-gray-600">/{plan.billing_cycle === 'monthly' ? 'mo' : 'yr'}</span>
                </div>
              </div>

              {/* Features Preview */}
              <div className="p-6 border-b">
                <h4 className="font-semibold text-gray-700 mb-3 text-sm">Features:</h4>
                <div className="space-y-2">
                  {plan.features.slice(0, 3).map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm">
                      {feature.included ? (
                        <span className="text-green-600">✓</span>
                      ) : (
                        <span className="text-gray-400">✗</span>
                      )}
                      <span className={feature.included ? 'text-gray-700' : 'text-gray-400 line-through'}>
                        {feature.title}
                      </span>
                    </div>
                  ))}
                  {plan.features.length > 3 && (
                    <p className="text-xs text-gray-500">+{plan.features.length - 3} more...</p>
                  )}
                </div>
              </div>

              {/* Limits */}
              <div className="p-6 border-b bg-gray-50">
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div>
                    <p className="text-gray-600">Tiles</p>
                    <p className="font-bold text-gray-800">
                      {plan.limits.max_tiles === -1 ? '∞' : plan.limits.max_tiles}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">QR Codes</p>
                    <p className="font-bold text-gray-800">
                      {plan.limits.max_qr_codes === -1 ? '∞' : plan.limits.max_qr_codes}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Workers</p>
                    <p className="font-bold text-gray-800">
                      {plan.limits.max_workers === -1 ? '∞' : plan.limits.max_workers}
                    </p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="p-4 flex gap-2">
                <button
                  onClick={() => handleEdit(plan)}
                  disabled={processingAction === plan.id}
                  className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 text-sm font-medium flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Edit className="w-4 h-4" />
                  Edit
                </button>

                <button
                  onClick={() => handleToggleStatus(plan)}
                  disabled={processingAction === plan.id}
                  className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2 disabled:opacity-50 ${
                    plan.is_active
                      ? 'bg-orange-600 text-white hover:bg-orange-700'
                      : 'bg-green-600 text-white hover:bg-green-700'
                  }`}
                >
                  {processingAction === plan.id ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : plan.is_active ? (
                    <>
                      <ToggleLeft className="w-4 h-4" />
                      Disable
                    </>
                  ) : (
                    <>
                      <ToggleRight className="w-4 h-4" />
                      Enable
                    </>
                  )}
                </button>

                <button
                  onClick={() => handleDelete(plan)}
                  disabled={processingAction === plan.id}
                  className="bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 text-sm font-medium flex items-center justify-center disabled:opacity-50"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Metadata */}
              <div className="px-4 pb-4 text-xs text-gray-500">
                <p>Created: {new Date(plan.created_at).toLocaleDateString()}</p>
                {plan.updated_at && (
                  <p>Updated: {new Date(plan.updated_at).toLocaleDateString()}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modals */}
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

console.log('✅ PlansManagement Component loaded - PRODUCTION v1.0');