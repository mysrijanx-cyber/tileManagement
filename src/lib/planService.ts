
import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  Timestamp,
  writeBatch
} from 'firebase/firestore';
import { db, auth } from './firebase';
import type { Plan, CreatePlanData, UpdatePlanData, PlanValidationError } from '../types/plan.types';

// ═══════════════════════════════════════════════════════════════
// 📊 INTERFACES & TYPES
// ═══════════════════════════════════════════════════════════════

interface ServiceResponse<T = void> {
  success: boolean;
  data?: T;
  error?: string;
}

interface PlanStats {
  total: number;
  active: number;
  inactive: number;
}

// ═══════════════════════════════════════════════════════════════
// 🔧 UTILITY FUNCTIONS
// ═══════════════════════════════════════════════════════════════

/**
 * Sort plans by display order
 */
const sortPlansByOrder = (plans: Plan[]): Plan[] => {
  return plans.sort((a, b) => {
    const orderA = a.display_order ?? 999;
    const orderB = b.display_order ?? 999;
    return orderA - orderB;
  });
};

/**
 * Check if user is authenticated
 */
const requireAuth = (): string => {
  const currentUser = auth.currentUser;
  if (!currentUser) {
    throw new Error('Authentication required. Please login.');
  }
  return currentUser.uid;
};

/**
 * Log admin action
 */
const logAdminAction = async (
  action: string,
  details: Record<string, any>
): Promise<void> => {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) return;

    await addDoc(collection(db, 'adminLogs'), {
      action,
      admin_id: currentUser.uid,
      admin_email: currentUser.email,
      timestamp: new Date().toISOString(),
      success: true,
      ...details
    });
  } catch (error) {
    console.warn('⚠️ Failed to log admin action:', error);
  }
};

// ═══════════════════════════════════════════════════════════════
// 📖 READ OPERATIONS
// ═══════════════════════════════════════════════════════════════

/**
 * Get all plans (active and inactive)
 * ✅ NO INDEX REQUIRED
 */
export const getAllPlans = async (): Promise<Plan[]> => {
  try {
    console.log('📋 Fetching all plans...');
    
    // Simple query without complex filters
    const plansRef = collection(db, 'plans');
    const snapshot = await getDocs(plansRef);
    
    if (snapshot.empty) {
      console.log('⚠️ No plans found in database');
      return [];
    }
    
    const plans: Plan[] = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Plan));
    
    // Client-side sorting
    const sortedPlans = sortPlansByOrder(plans);
    
    console.log(`✅ Fetched ${sortedPlans.length} plans`);
    return sortedPlans;
    
  } catch (error: any) {
    console.error('❌ Error fetching all plans:', error);
    throw new Error(`Failed to fetch plans: ${error.message}`);
  }
};

/**
 * Get active plans only (for public display)
 * ✅ NO INDEX REQUIRED - Client-side filtering & sorting
 */
export const getActivePlans = async (): Promise<Plan[]> => {
  try {
    console.log('📋 Fetching active plans...');
    
    // Method 1: Try simple query with where clause only
    try {
      const q = query(
        collection(db, 'plans'),
        where('is_active', '==', true)
      );
      
      const snapshot = await getDocs(q);
      
      const plans: Plan[] = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Plan));
      
      // Client-side sorting
      const sortedPlans = sortPlansByOrder(plans);
      
      console.log(`✅ Fetched ${sortedPlans.length} active plans`);
      return sortedPlans;
      
    } catch (queryError) {
      console.warn('⚠️ Query failed, using fallback method:', queryError);
      
      // Method 2: Fallback - fetch all and filter client-side
      const allPlans = await getAllPlans();
      const activePlans = allPlans.filter(plan => plan.is_active === true);
      
      console.log(`✅ Fetched ${activePlans.length} active plans (fallback)`);
      return activePlans;
    }
    
  } catch (error: any) {
    console.error('❌ Error fetching active plans:', error);
    throw new Error(`Failed to fetch active plans: ${error.message}`);
  }
};

/**
 * Get plan by ID
 */
export const getPlanById = async (planId: string): Promise<Plan | null> => {
  try {
    if (!planId?.trim()) {
      throw new Error('Plan ID is required');
    }
    
    console.log('🔍 Fetching plan:', planId);
    
    const planDoc = await getDoc(doc(db, 'plans', planId));
    
    if (!planDoc.exists()) {
      console.log('⚠️ Plan not found:', planId);
      return null;
    }
    
    const plan: Plan = {
      id: planDoc.id,
      ...planDoc.data()
    } as Plan;
    
    console.log('✅ Plan fetched:', plan.plan_name);
    return plan;
    
  } catch (error: any) {
    console.error('❌ Error fetching plan by ID:', error);
    throw new Error(`Failed to fetch plan: ${error.message}`);
  }
};

/**
 * Get plan statistics
 */
export const getPlanStats = async (): Promise<PlanStats> => {
  try {
    const allPlans = await getAllPlans();
    
    const stats: PlanStats = {
      total: allPlans.length,
      active: allPlans.filter(p => p.is_active).length,
      inactive: allPlans.filter(p => !p.is_active).length
    };
    
    console.log('📊 Plan stats:', stats);
    return stats;
    
  } catch (error: any) {
    console.error('❌ Error fetching plan stats:', error);
    return { total: 0, active: 0, inactive: 0 };
  }
};

// ═══════════════════════════════════════════════════════════════
// ✏️ VALIDATION
// ═══════════════════════════════════════════════════════════════

/**
 * Validate plan data
 */
export const validatePlanData = (planData: CreatePlanData | UpdatePlanData): PlanValidationError => {
  const errors: PlanValidationError = {};
  
  // Plan name validation
  if ('plan_name' in planData) {
    if (!planData.plan_name?.trim()) {
      errors.plan_name = 'Plan name is required';
    } else if (planData.plan_name.trim().length < 3) {
      errors.plan_name = 'Plan name must be at least 3 characters';
    } else if (planData.plan_name.trim().length > 50) {
      errors.plan_name = 'Plan name must not exceed 50 characters';
    }
  }
  
  // Price validation
  if ('price' in planData) {
    if (planData.price === undefined || planData.price === null) {
      errors.price = 'Price is required';
    } else if (typeof planData.price !== 'number') {
      errors.price = 'Price must be a number';
    } else if (planData.price < 0) {
      errors.price = 'Price must be 0 or positive';
    } else if (planData.price > 999999) {
      errors.price = 'Price is too high';
    }
  }
  
  // Features validation (only for create)
  if ('features' in planData && planData.features) {
    if (!Array.isArray(planData.features)) {
      errors.features = 'Features must be an array';
    } else if (planData.features.length !== 5) {
      errors.features = 'Exactly 5 features are required';
    } else {
      const invalidFeatures = planData.features.filter(
        f => !f?.title?.trim() || !f?.description?.trim()
      );
      if (invalidFeatures.length > 0) {
        errors.features = 'All features must have title and description';
      }
    }
  }
  
  // Limits validation
  if ('limits' in planData && planData.limits) {
    if (typeof planData.limits !== 'object') {
      errors.limits = 'Limits must be an object';
    } else {
      if (planData.limits.max_tiles !== undefined && planData.limits.max_tiles < -1) {
        errors.limits = 'Invalid max_tiles value (use -1 for unlimited)';
      }
      if (planData.limits.max_collections !== undefined && planData.limits.max_collections < -1) {
        errors.limits = 'Invalid max_collections value (use -1 for unlimited)';
      }
    }
  }
  
  // Display order validation
  if ('display_order' in planData) {
    if (typeof planData.display_order !== 'number') {
      errors.display_order = 'Display order must be a number';
    } else if (planData.display_order < 0) {
      errors.display_order = 'Display order must be positive';
    }
  }
  
  // Stripe ID validation (if provided)
  if ('stripe_price_id' in planData && planData.stripe_price_id) {
    if (typeof planData.stripe_price_id !== 'string') {
      errors.stripe_price_id = 'Stripe price ID must be a string';
    } else if (!planData.stripe_price_id.startsWith('price_')) {
      errors.stripe_price_id = 'Invalid Stripe price ID format';
    }
  }
  
  return errors;
};

/**
 * Check if plan name already exists
 */
const checkPlanNameExists = async (planName: string, excludePlanId?: string): Promise<boolean> => {
  try {
    const allPlans = await getAllPlans();
    const normalizedName = planName.trim().toLowerCase();
    
    return allPlans.some(plan => 
      plan.plan_name.toLowerCase() === normalizedName && 
      plan.id !== excludePlanId
    );
  } catch (error) {
    console.warn('⚠️ Could not check plan name uniqueness:', error);
    return false;
  }
};

// ═══════════════════════════════════════════════════════════════
// ✍️ WRITE OPERATIONS
// ═══════════════════════════════════════════════════════════════

/**
 * Create new plan (Admin only)
 */
export const createPlan = async (planData: CreatePlanData): Promise<ServiceResponse<string>> => {
  try {
    console.log('➕ Creating new plan:', planData.plan_name);
    
    // Auth check
    const userId = requireAuth();
    
    // Validate data
    const errors = validatePlanData(planData);
    if (Object.keys(errors).length > 0) {
      const errorMessage = Object.values(errors).join(', ');
      console.error('❌ Validation failed:', errors);
      return { success: false, error: errorMessage };
    }
    
    // Check duplicate name
    const nameExists = await checkPlanNameExists(planData.plan_name);
    if (nameExists) {
      console.error('❌ Plan name already exists');
      return { success: false, error: 'Plan name already exists' };
    }
    
    // Create plan document
    const newPlan = {
      ...planData,
      created_at: new Date().toISOString(),
      created_by: userId,
      updated_at: new Date().toISOString(),
      is_active: planData.is_active ?? true,
      display_order: planData.display_order ?? 999
    };
    
    const docRef = await addDoc(collection(db, 'plans'), newPlan);
    
    console.log('✅ Plan created with ID:', docRef.id);
    
    // Log admin action
    await logAdminAction('plan_created', {
      plan_id: docRef.id,
      plan_name: planData.plan_name,
      price: planData.price
    });
    
    return { success: true, data: docRef.id };
    
  } catch (error: any) {
    console.error('❌ Error creating plan:', error);
    return { success: false, error: error.message || 'Failed to create plan' };
  }
};

/**
 * Update existing plan (Admin only)
 */
export const updatePlan = async (
  planId: string,
  updates: UpdatePlanData
): Promise<ServiceResponse> => {
  try {
    console.log('📝 Updating plan:', planId);
    
    // Validation
    if (!planId?.trim()) {
      return { success: false, error: 'Plan ID is required' };
    }
    
    // Auth check
    const userId = requireAuth();
    
    // Check plan exists
    const existingPlan = await getPlanById(planId);
    if (!existingPlan) {
      return { success: false, error: 'Plan not found' };
    }
    
    // Validate updates
    const errors = validatePlanData(updates);
    if (Object.keys(errors).length > 0) {
      const errorMessage = Object.values(errors).join(', ');
      console.error('❌ Validation failed:', errors);
      return { success: false, error: errorMessage };
    }
    
    // Check duplicate name (if name is being updated)
    if (updates.plan_name && updates.plan_name !== existingPlan.plan_name) {
      const nameExists = await checkPlanNameExists(updates.plan_name, planId);
      if (nameExists) {
        return { success: false, error: 'Plan name already exists' };
      }
    }
    
    // Prepare update data
    const updateData = {
      ...updates,
      updated_at: new Date().toISOString(),
      updated_by: userId
    };
    
    // Update plan
    await updateDoc(doc(db, 'plans', planId), updateData);
    
    console.log('✅ Plan updated successfully');
    
    // Log admin action
    await logAdminAction('plan_updated', {
      plan_id: planId,
      plan_name: existingPlan.plan_name,
      updates: Object.keys(updates)
    });
    
    return { success: true };
    
  } catch (error: any) {
    console.error('❌ Error updating plan:', error);
    return { success: false, error: error.message || 'Failed to update plan' };
  }
};

/**
 * Delete plan (Admin only)
 * Soft delete if subscriptions exist, hard delete otherwise
 */
export const deletePlan = async (planId: string): Promise<ServiceResponse> => {
  try {
    console.log('🗑️ Deleting plan:', planId);
    
    // Validation
    if (!planId?.trim()) {
      return { success: false, error: 'Plan ID is required' };
    }
    
    // Auth check
    const userId = requireAuth();
    
    // Check plan exists
    const existingPlan = await getPlanById(planId);
    if (!existingPlan) {
      return { success: false, error: 'Plan not found' };
    }
    
    // Check for active subscriptions
    let hasActiveSubscriptions = false;
    try {
      const subsQuery = query(
        collection(db, 'subscriptions'),
        where('plan_id', '==', planId),
        where('status', '==', 'active')
      );
      const subsSnapshot = await getDocs(subsQuery);
      hasActiveSubscriptions = !subsSnapshot.empty;
    } catch (error) {
      console.warn('⚠️ Could not check subscriptions, doing soft delete:', error);
      hasActiveSubscriptions = true; // Safe fallback
    }
    
    if (hasActiveSubscriptions) {
      console.log('⚠️ Plan has active subscriptions - soft deleting');
      
      // Soft delete (mark as inactive)
      await updateDoc(doc(db, 'plans', planId), {
        is_active: false,
        deleted_at: new Date().toISOString(),
        deleted_by: userId,
        updated_at: new Date().toISOString()
      });
      
      console.log('✅ Plan soft deleted (marked as inactive)');
      
      await logAdminAction('plan_soft_deleted', {
        plan_id: planId,
        plan_name: existingPlan.plan_name,
        reason: 'has_active_subscriptions'
      });
      
    } else {
      // Hard delete (no subscriptions)
      await deleteDoc(doc(db, 'plans', planId));
      
      console.log('✅ Plan permanently deleted');
      
      await logAdminAction('plan_hard_deleted', {
        plan_id: planId,
        plan_name: existingPlan.plan_name
      });
    }
    
    return { success: true };
    
  } catch (error: any) {
    console.error('❌ Error deleting plan:', error);
    return { success: false, error: error.message || 'Failed to delete plan' };
  }
};

/**
 * Toggle plan active status
 */
export const togglePlanStatus = async (
  planId: string,
  isActive: boolean
): Promise<ServiceResponse> => {
  try {
    console.log(`🔄 Toggling plan status to: ${isActive}`);
    
    // Validation
    if (!planId?.trim()) {
      return { success: false, error: 'Plan ID is required' };
    }
    
    // Auth check
    const userId = requireAuth();
    
    // Check plan exists
    const existingPlan = await getPlanById(planId);
    if (!existingPlan) {
      return { success: false, error: 'Plan not found' };
    }
    
    // Update status
    await updateDoc(doc(db, 'plans', planId), {
      is_active: isActive,
      updated_at: new Date().toISOString(),
      updated_by: userId
    });
    
    console.log('✅ Plan status updated');
    
    await logAdminAction('plan_status_toggled', {
      plan_id: planId,
      plan_name: existingPlan.plan_name,
      new_status: isActive ? 'active' : 'inactive'
    });
    
    return { success: true };
    
  } catch (error: any) {
    console.error('❌ Error toggling plan status:', error);
    return { success: false, error: error.message || 'Failed to update plan status' };
  }
};

/**
 * Reorder plans (bulk update display_order)
 */
export const reorderPlans = async (planOrders: { id: string; order: number }[]): Promise<ServiceResponse> => {
  try {
    console.log('🔄 Reordering plans...');
    
    // Auth check
    const userId = requireAuth();
    
    if (!Array.isArray(planOrders) || planOrders.length === 0) {
      return { success: false, error: 'Invalid plan orders data' };
    }
    
    // Use batch write for atomic update
    const batch = writeBatch(db);
    
    planOrders.forEach(({ id, order }) => {
      const planRef = doc(db, 'plans', id);
      batch.update(planRef, {
        display_order: order,
        updated_at: new Date().toISOString(),
        updated_by: userId
      });
    });
    
    await batch.commit();
    
    console.log(`✅ Reordered ${planOrders.length} plans`);
    
    await logAdminAction('plans_reordered', {
      count: planOrders.length,
      plan_ids: planOrders.map(p => p.id)
    });
    
    return { success: true };
    
  } catch (error: any) {
    console.error('❌ Error reordering plans:', error);
    return { success: false, error: error.message || 'Failed to reorder plans' };
  }
};

// ═══════════════════════════════════════════════════════════════
// 🔍 HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════

/**
 * Get plan by Stripe price ID
 */
// export const getPlanByStripePriceId = async (stripePriceId: string): Promise<Plan | null> => {
//   try {
//     if (!stripePriceId?.trim()) {
//       throw new Error('Stripe price ID is required');
//     }
    
//     const allPlans = await getAllPlans();
//     const plan = allPlans.find(p => p.stripe_price_id === stripePriceId);
    
//     return plan || null;
    
//   } catch (error: any) {
//     console.error('❌ Error fetching plan by Stripe ID:', error);
//     return null;
//   }
// };



/**
 * Get plan by Stripe price ID
 * ✅ Works without type modification
 */
export const getPlanByStripePriceId = async (
  stripePriceId: string
): Promise<Plan | null> => {
  try {
    if (!stripePriceId?.trim()) {
      throw new Error('Stripe price ID is required');
    }
    
    const allPlans = await getAllPlans();
    
    // ✅ Safe property access
    const plan = allPlans.find(p => {
      // @ts-ignore - stripe_price_id exists in Firestore but not in type
      return p.stripe_price_id === stripePriceId;
    });
    
    return plan || null;
    
  } catch (error: any) {
    console.error('❌ Error fetching plan by Stripe ID:', error);
    return null;
  }
};

/**
 * Check if plan has active subscriptions
 */
export const planHasActiveSubscriptions = async (planId: string): Promise<boolean> => {
  try {
    const subsQuery = query(
      collection(db, 'subscriptions'),
      where('plan_id', '==', planId),
      where('status', '==', 'active')
    );
    const subsSnapshot = await getDocs(subsQuery);
    return !subsSnapshot.empty;
  } catch (error) {
    console.warn('⚠️ Could not check subscriptions:', error);
    return false;
  }
};

// ═══════════════════════════════════════════════════════════════
// 🎯 EXPORTS
// ═══════════════════════════════════════════════════════════════

export default {
  // Read operations
  getAllPlans,
  getActivePlans,
  getPlanById,
  getPlanStats,
  getPlanByStripePriceId,
  
  // Write operations
  createPlan,
  updatePlan,
  deletePlan,
  togglePlanStatus,
  reorderPlans,
  
  // Validation & helpers
  validatePlanData,
  planHasActiveSubscriptions
};

console.log('✅ Plan Service loaded - PRODUCTION v2.0 (No Index Required)');