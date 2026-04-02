// // // // ═══════════════════════════════════════════════════════════════
// // // // ✅ PLAN SERVICE - PRODUCTION READY v2.1 (FIXED)
// // // // ═══════════════════════════════════════════════════════════════

// // // import {
// // //   collection,
// // //   doc,
// // //   getDoc,
// // //   getDocs,
// // //   addDoc,
// // //   updateDoc,
// // //   deleteDoc,
// // //   query,
// // //   where,
// // //   writeBatch
// // // } from 'firebase/firestore';
// // // import { db, auth } from './firebase';
// // // import type { Plan, CreatePlanData, UpdatePlanData, PlanValidationError } from '../types/plan.types';

// // // // ═══════════════════════════════════════════════════════════════
// // // // INTERFACES
// // // // ═══════════════════════════════════════════════════════════════

// // // interface ServiceResponse<T = void> {
// // //   success: boolean;
// // //   data?: T;
// // //   error?: string;
// // // }

// // // interface PlanStats {
// // //   total: number;
// // //   active: number;
// // //   inactive: number;
// // // }

// // // // ═══════════════════════════════════════════════════════════════
// // // // UTILITY FUNCTIONS
// // // // ═══════════════════════════════════════════════════════════════

// // // const sortPlansByOrder = (plans: Plan[]): Plan[] => {
// // //   return plans.sort((a, b) => {
// // //     const orderA = a.display_order ?? 999;
// // //     const orderB = b.display_order ?? 999;
// // //     return orderA - orderB;
// // //   });
// // // };

// // // const requireAuth = (): string => {
// // //   const currentUser = auth.currentUser;
// // //   if (!currentUser) {
// // //     throw new Error('Authentication required. Please login.');
// // //   }
// // //   return currentUser.uid;
// // // };

// // // const logAdminAction = async (
// // //   action: string,
// // //   details: Record<string, any>
// // // ): Promise<void> => {
// // //   try {
// // //     const currentUser = auth.currentUser;
// // //     if (!currentUser) return;

// // //     await addDoc(collection(db, 'adminLogs'), {
// // //       action,
// // //       admin_id: currentUser.uid,
// // //       admin_email: currentUser.email,
// // //       timestamp: new Date().toISOString(),
// // //       success: true,
// // //       ...details
// // //     });
// // //   } catch (error) {
// // //     console.warn('⚠️ Failed to log admin action:', error);
// // //   }
// // // };

// // // // ═══════════════════════════════════════════════════════════════
// // // // READ OPERATIONS
// // // // ═══════════════════════════════════════════════════════════════

// // // const getAllPlans = async (): Promise<Plan[]> => {
// // //   try {
// // //     console.log('📋 Fetching all plans...');
    
// // //     const plansRef = collection(db, 'plans');
// // //     const snapshot = await getDocs(plansRef);
    
// // //     if (snapshot.empty) {
// // //       console.log('⚠️ No plans found in database');
// // //       return [];
// // //     }
    
// // //     const plans: Plan[] = snapshot.docs.map(doc => ({
// // //       id: doc.id,
// // //       ...doc.data()
// // //     } as Plan));
    
// // //     const sortedPlans = sortPlansByOrder(plans);
    
// // //     console.log(`✅ Fetched ${sortedPlans.length} plans`);
// // //     return sortedPlans;
    
// // //   } catch (error: any) {
// // //     console.error('❌ Error fetching all plans:', error);
// // //     throw new Error(`Failed to fetch plans: ${error.message}`);
// // //   }
// // // };

// // // const getActivePlans = async (): Promise<Plan[]> => {
// // //   try {
// // //     console.log('📋 Fetching active plans...');
    
// // //     try {
// // //       const q = query(
// // //         collection(db, 'plans'),
// // //         where('is_active', '==', true)
// // //       );
      
// // //       const snapshot = await getDocs(q);
      
// // //       const plans: Plan[] = snapshot.docs.map(doc => ({
// // //         id: doc.id,
// // //         ...doc.data()
// // //       } as Plan));
      
// // //       const sortedPlans = sortPlansByOrder(plans);
      
// // //       console.log(`✅ Fetched ${sortedPlans.length} active plans`);
// // //       return sortedPlans;
      
// // //     } catch (queryError) {
// // //       console.warn('⚠️ Query failed, using fallback method:', queryError);
      
// // //       const allPlans = await getAllPlans();
// // //       const activePlans = allPlans.filter(plan => plan.is_active === true);
      
// // //       console.log(`✅ Fetched ${activePlans.length} active plans (fallback)`);
// // //       return activePlans;
// // //     }
    
// // //   } catch (error: any) {
// // //     console.error('❌ Error fetching active plans:', error);
// // //     throw new Error(`Failed to fetch active plans: ${error.message}`);
// // //   }
// // // };

// // // const getPlanById = async (planId: string): Promise<Plan | null> => {
// // //   try {
// // //     if (!planId?.trim()) {
// // //       throw new Error('Plan ID is required');
// // //     }
    
// // //     console.log('🔍 Fetching plan:', planId);
    
// // //     const planDoc = await getDoc(doc(db, 'plans', planId));
    
// // //     if (!planDoc.exists()) {
// // //       console.log('⚠️ Plan not found:', planId);
// // //       return null;
// // //     }
    
// // //     const plan: Plan = {
// // //       id: planDoc.id,
// // //       ...planDoc.data()
// // //     } as Plan;
    
// // //     console.log('✅ Plan fetched:', plan.plan_name);
// // //     return plan;
    
// // //   } catch (error: any) {
// // //     console.error('❌ Error fetching plan by ID:', error);
// // //     throw new Error(`Failed to fetch plan: ${error.message}`);
// // //   }
// // // };

// // // const getPlanStats = async (): Promise<PlanStats> => {
// // //   try {
// // //     const allPlans = await getAllPlans();
    
// // //     const stats: PlanStats = {
// // //       total: allPlans.length,
// // //       active: allPlans.filter(p => p.is_active).length,
// // //       inactive: allPlans.filter(p => !p.is_active).length
// // //     };
    
// // //     console.log('📊 Plan stats:', stats);
// // //     return stats;
    
// // //   } catch (error: any) {
// // //     console.error('❌ Error fetching plan stats:', error);
// // //     return { total: 0, active: 0, inactive: 0 };
// // //   }
// // // };

// // // // ═══════════════════════════════════════════════════════════════
// // // // VALIDATION
// // // // ═══════════════════════════════════════════════════════════════

// // // const validatePlanData = (planData: CreatePlanData | UpdatePlanData): PlanValidationError => {
// // //   const errors: PlanValidationError = {};
  
// // //   if ('plan_name' in planData) {
// // //     if (!planData.plan_name?.trim()) {
// // //       errors.plan_name = 'Plan name is required';
// // //     } else if (planData.plan_name.trim().length < 3) {
// // //       errors.plan_name = 'Plan name must be at least 3 characters';
// // //     } else if (planData.plan_name.trim().length > 50) {
// // //       errors.plan_name = 'Plan name must not exceed 50 characters';
// // //     }
// // //   }
  
// // //   if ('price' in planData) {
// // //     if (planData.price === undefined || planData.price === null) {
// // //       errors.price = 'Price is required';
// // //     } else if (typeof planData.price !== 'number') {
// // //       errors.price = 'Price must be a number';
// // //     } else if (planData.price < 0) {
// // //       errors.price = 'Price must be 0 or positive';
// // //     } else if (planData.price > 999999) {
// // //       errors.price = 'Price is too high';
// // //     }
// // //   }
  
// // //   if ('features' in planData && planData.features) {
// // //     if (!Array.isArray(planData.features)) {
// // //       errors.features = 'Features must be an array';
// // //     } else if (planData.features.length !== 5) {
// // //       errors.features = 'Exactly 5 features are required';
// // //     } else {
// // //       const invalidFeatures = planData.features.filter(
// // //         f => !f?.title?.trim() || !f?.description?.trim()
// // //       );
// // //       if (invalidFeatures.length > 0) {
// // //         errors.features = 'All features must have title and description';
// // //       }
// // //     }
// // //   }
  
// // //   if ('limits' in planData && planData.limits) {
// // //     if (typeof planData.limits !== 'object') {
// // //       errors.limits = 'Limits must be an object';
// // //     } else {
// // //       if (planData.limits.max_tiles !== undefined && planData.limits.max_tiles < -1) {
// // //         errors.limits = 'Invalid max_tiles value (use -1 for unlimited)';
// // //       }
// // //       if (planData.limits.max_collections !== undefined && planData.limits.max_collections < -1) {
// // //         errors.limits = 'Invalid max_collections value (use -1 for unlimited)';
// // //       }
// // //     }
// // //   }
  
// // //   if ('display_order' in planData) {
// // //     if (typeof planData.display_order !== 'number') {
// // //       errors.display_order = 'Display order must be a number';
// // //     } else if (planData.display_order < 0) {
// // //       errors.display_order = 'Display order must be positive';
// // //     }
// // //   }
  
// // //   if ('stripe_price_id' in planData && planData.stripe_price_id) {
// // //     if (typeof planData.stripe_price_id !== 'string') {
// // //       errors.stripe_price_id = 'Stripe price ID must be a string';
// // //     } else if (!planData.stripe_price_id.startsWith('price_')) {
// // //       errors.stripe_price_id = 'Invalid Stripe price ID format';
// // //     }
// // //   }
  
// // //   return errors;
// // // };

// // // const checkPlanNameExists = async (planName: string, excludePlanId?: string): Promise<boolean> => {
// // //   try {
// // //     const allPlans = await getAllPlans();
// // //     const normalizedName = planName.trim().toLowerCase();
    
// // //     return allPlans.some(plan => 
// // //       plan.plan_name.toLowerCase() === normalizedName && 
// // //       plan.id !== excludePlanId
// // //     );
// // //   } catch (error) {
// // //     console.warn('⚠️ Could not check plan name uniqueness:', error);
// // //     return false;
// // //   }
// // // };

// // // // ═══════════════════════════════════════════════════════════════
// // // // WRITE OPERATIONS
// // // // ═══════════════════════════════════════════════════════════════

// // // const createPlan = async (planData: CreatePlanData): Promise<ServiceResponse<string>> => {
// // //   try {
// // //     console.log('➕ Creating new plan:', planData.plan_name);
    
// // //     const userId = requireAuth();
    
// // //     const errors = validatePlanData(planData);
// // //     if (Object.keys(errors).length > 0) {
// // //       const errorMessage = Object.values(errors).join(', ');
// // //       console.error('❌ Validation failed:', errors);
// // //       return { success: false, error: errorMessage };
// // //     }
    
// // //     const nameExists = await checkPlanNameExists(planData.plan_name);
// // //     if (nameExists) {
// // //       console.error('❌ Plan name already exists');
// // //       return { success: false, error: 'Plan name already exists' };
// // //     }
    
// // //     const newPlan = {
// // //       ...planData,
// // //       created_at: new Date().toISOString(),
// // //       created_by: userId,
// // //       updated_at: new Date().toISOString(),
// // //       is_active: planData.is_active ?? true,
// // //       display_order: planData.display_order ?? 999
// // //     };
    
// // //     const docRef = await addDoc(collection(db, 'plans'), newPlan);
    
// // //     console.log('✅ Plan created with ID:', docRef.id);
    
// // //     await logAdminAction('plan_created', {
// // //       plan_id: docRef.id,
// // //       plan_name: planData.plan_name,
// // //       price: planData.price
// // //     });
    
// // //     return { success: true, data: docRef.id };
    
// // //   } catch (error: any) {
// // //     console.error('❌ Error creating plan:', error);
// // //     return { success: false, error: error.message || 'Failed to create plan' };
// // //   }
// // // };

// // // const updatePlan = async (
// // //   planId: string,
// // //   updates: UpdatePlanData
// // // ): Promise<ServiceResponse> => {
// // //   try {
// // //     console.log('📝 Updating plan:', planId);
    
// // //     if (!planId?.trim()) {
// // //       return { success: false, error: 'Plan ID is required' };
// // //     }
    
// // //     const userId = requireAuth();
    
// // //     const existingPlan = await getPlanById(planId);
// // //     if (!existingPlan) {
// // //       return { success: false, error: 'Plan not found' };
// // //     }
    
// // //     const errors = validatePlanData(updates);
// // //     if (Object.keys(errors).length > 0) {
// // //       const errorMessage = Object.values(errors).join(', ');
// // //       console.error('❌ Validation failed:', errors);
// // //       return { success: false, error: errorMessage };
// // //     }
    
// // //     if (updates.plan_name && updates.plan_name !== existingPlan.plan_name) {
// // //       const nameExists = await checkPlanNameExists(updates.plan_name, planId);
// // //       if (nameExists) {
// // //         return { success: false, error: 'Plan name already exists' };
// // //       }
// // //     }
    
// // //     const updateData = {
// // //       ...updates,
// // //       updated_at: new Date().toISOString(),
// // //       updated_by: userId
// // //     };
    
// // //     await updateDoc(doc(db, 'plans', planId), updateData);
    
// // //     console.log('✅ Plan updated successfully');
    
// // //     await logAdminAction('plan_updated', {
// // //       plan_id: planId,
// // //       plan_name: existingPlan.plan_name,
// // //       updates: Object.keys(updates)
// // //     });
    
// // //     return { success: true };
    
// // //   } catch (error: any) {
// // //     console.error('❌ Error updating plan:', error);
// // //     return { success: false, error: error.message || 'Failed to update plan' };
// // //   }
// // // };

// // // const deletePlan = async (planId: string): Promise<ServiceResponse> => {
// // //   try {
// // //     console.log('🗑️ Deleting plan:', planId);
    
// // //     if (!planId?.trim()) {
// // //       return { success: false, error: 'Plan ID is required' };
// // //     }
    
// // //     const userId = requireAuth();
    
// // //     const existingPlan = await getPlanById(planId);
// // //     if (!existingPlan) {
// // //       return { success: false, error: 'Plan not found' };
// // //     }
    
// // //     let hasActiveSubscriptions = false;
// // //     try {
// // //       const subsQuery = query(
// // //         collection(db, 'subscriptions'),
// // //         where('plan_id', '==', planId),
// // //         where('status', '==', 'active')
// // //       );
// // //       const subsSnapshot = await getDocs(subsQuery);
// // //       hasActiveSubscriptions = !subsSnapshot.empty;
// // //     } catch (error) {
// // //       console.warn('⚠️ Could not check subscriptions, doing soft delete:', error);
// // //       hasActiveSubscriptions = true;
// // //     }
    
// // //     if (hasActiveSubscriptions) {
// // //       console.log('⚠️ Plan has active subscriptions - soft deleting');
      
// // //       await updateDoc(doc(db, 'plans', planId), {
// // //         is_active: false,
// // //         deleted_at: new Date().toISOString(),
// // //         deleted_by: userId,
// // //         updated_at: new Date().toISOString()
// // //       });
      
// // //       console.log('✅ Plan soft deleted (marked as inactive)');
      
// // //       await logAdminAction('plan_soft_deleted', {
// // //         plan_id: planId,
// // //         plan_name: existingPlan.plan_name,
// // //         reason: 'has_active_subscriptions'
// // //       });
      
// // //     } else {
// // //       await deleteDoc(doc(db, 'plans', planId));
      
// // //       console.log('✅ Plan permanently deleted');
      
// // //       await logAdminAction('plan_hard_deleted', {
// // //         plan_id: planId,
// // //         plan_name: existingPlan.plan_name
// // //       });
// // //     }
    
// // //     return { success: true };
    
// // //   } catch (error: any) {
// // //     console.error('❌ Error deleting plan:', error);
// // //     return { success: false, error: error.message || 'Failed to delete plan' };
// // //   }
// // // };

// // // const togglePlanStatus = async (
// // //   planId: string,
// // //   isActive: boolean
// // // ): Promise<ServiceResponse> => {
// // //   try {
// // //     console.log(`🔄 Toggling plan status to: ${isActive}`);
    
// // //     if (!planId?.trim()) {
// // //       return { success: false, error: 'Plan ID is required' };
// // //     }
    
// // //     const userId = requireAuth();
    
// // //     const existingPlan = await getPlanById(planId);
// // //     if (!existingPlan) {
// // //       return { success: false, error: 'Plan not found' };
// // //     }
    
// // //     await updateDoc(doc(db, 'plans', planId), {
// // //       is_active: isActive,
// // //       updated_at: new Date().toISOString(),
// // //       updated_by: userId
// // //     });
    
// // //     console.log('✅ Plan status updated');
    
// // //     await logAdminAction('plan_status_toggled', {
// // //       plan_id: planId,
// // //       plan_name: existingPlan.plan_name,
// // //       new_status: isActive ? 'active' : 'inactive'
// // //     });
    
// // //     return { success: true };
    
// // //   } catch (error: any) {
// // //     console.error('❌ Error toggling plan status:', error);
// // //     return { success: false, error: error.message || 'Failed to update plan status' };
// // //   }
// // // };

// // // const reorderPlans = async (planOrders: { id: string; order: number }[]): Promise<ServiceResponse> => {
// // //   try {
// // //     console.log('🔄 Reordering plans...');
    
// // //     const userId = requireAuth();
    
// // //     if (!Array.isArray(planOrders) || planOrders.length === 0) {
// // //       return { success: false, error: 'Invalid plan orders data' };
// // //     }
    
// // //     const batch = writeBatch(db);
    
// // //     planOrders.forEach(({ id, order }) => {
// // //       const planRef = doc(db, 'plans', id);
// // //       batch.update(planRef, {
// // //         display_order: order,
// // //         updated_at: new Date().toISOString(),
// // //         updated_by: userId
// // //       });
// // //     });
    
// // //     await batch.commit();
    
// // //     console.log(`✅ Reordered ${planOrders.length} plans`);
    
// // //     await logAdminAction('plans_reordered', {
// // //       count: planOrders.length,
// // //       plan_ids: planOrders.map(p => p.id)
// // //     });
    
// // //     return { success: true };
    
// // //   } catch (error: any) {
// // //     console.error('❌ Error reordering plans:', error);
// // //     return { success: false, error: error.message || 'Failed to reorder plans' };
// // //   }
// // // };

// // // // ═══════════════════════════════════════════════════════════════
// // // // HELPER FUNCTIONS
// // // // ═══════════════════════════════════════════════════════════════

// // // const getPlanByStripePriceId = async (
// // //   stripePriceId: string
// // // ): Promise<Plan | null> => {
// // //   try {
// // //     if (!stripePriceId?.trim()) {
// // //       throw new Error('Stripe price ID is required');
// // //     }
    
// // //     const allPlans = await getAllPlans();
    
// // //     const plan = allPlans.find(p => {
// // //       // @ts-ignore
// // //       return p.stripe_price_id === stripePriceId;
// // //     });
    
// // //     return plan || null;
    
// // //   } catch (error: any) {
// // //     console.error('❌ Error fetching plan by Stripe ID:', error);
// // //     return null;
// // //   }
// // // };

// // // const planHasActiveSubscriptions = async (planId: string): Promise<boolean> => {
// // //   try {
// // //     const subsQuery = query(
// // //       collection(db, 'subscriptions'),
// // //       where('plan_id', '==', planId),
// // //       where('status', '==', 'active')
// // //     );
// // //     const subsSnapshot = await getDocs(subsQuery);
// // //     return !subsSnapshot.empty;
// // //   } catch (error) {
// // //     console.warn('⚠️ Could not check subscriptions:', error);
// // //     return false;
// // //   }
// // // };

// // // // ═══════════════════════════════════════════════════════════════
// // // // ✅ SINGLE EXPORT BLOCK (NO DUPLICATES)
// // // // ═══════════════════════════════════════════════════════════════

// // // export {
// // //   getAllPlans,
// // //   getActivePlans,
// // //   getPlanById,
// // //   getPlanStats,
// // //   getPlanByStripePriceId,
// // //   createPlan,
// // //   updatePlan,
// // //   deletePlan,
// // //   togglePlanStatus,
// // //   reorderPlans,
// // //   validatePlanData,
// // //   planHasActiveSubscriptions
// // // };

// // // export default {
// // //   getAllPlans,
// // //   getActivePlans,
// // //   getPlanById,
// // //   getPlanStats,
// // //   getPlanByStripePriceId,
// // //   createPlan,
// // //   updatePlan,
// // //   deletePlan,
// // //   togglePlanStatus,
// // //   reorderPlans,
// // //   validatePlanData,
// // //   planHasActiveSubscriptions
// // // }
// // // };

// // // // console.log('✅ Plan Service loaded - PRODUCTION v2.1 (FIXED)'); 

// // // // ═══════════════════════════════════════════════════════════════
// // // // ✅ PLAN SERVICE - PRODUCTION READY v3.1 (FIXED)
// // // // ═══════════════════════════════════════════════════════════════

// // import {
// //   collection,
// //   doc,
// //   getDoc,
// //   getDocs,
// //   addDoc,
// //   updateDoc,
// //   deleteDoc,
// //   query,
// //   where,
// //   writeBatch
// // } from 'firebase/firestore';
// // import { db, auth } from './firebase';
// // import type { Plan, CreatePlanData, UpdatePlanData, PlanValidationError } from '../types/plan.types';

// // // ═══════════════════════════════════════════════════════════════
// // // INTERFACES
// // // ═══════════════════════════════════════════════════════════════

// // interface ServiceResponse<T = void> {
// //   success: boolean;
// //   data?: T;
// //   error?: string;
// // }

// // interface PlanStats {
// //   total: number;
// //   active: number;
// //   inactive: number;
// // }

// // // ═══════════════════════════════════════════════════════════════
// // // UTILITY FUNCTIONS
// // // ═══════════════════════════════════════════════════════════════

// // const sortPlansByOrder = (plans: Plan[]): Plan[] => {
// //   return plans.sort((a, b) => {
// //     const orderA = a.display_order ?? 999;
// //     const orderB = b.display_order ?? 999;
// //     return orderA - orderB;
// //   });
// // };

// // const requireAuth = (): string => {
// //   const currentUser = auth.currentUser;
// //   if (!currentUser) {
// //     throw new Error('Authentication required. Please login.');
// //   }
// //   return currentUser.uid;
// // };

// // const logAdminAction = async (
// //   action: string,
// //   details: Record<string, any>
// // ): Promise<void> => {
// //   try {
// //     const currentUser = auth.currentUser;
// //     if (!currentUser) return;

// //     await addDoc(collection(db, 'adminLogs'), {
// //       action,
// //       admin_id: currentUser.uid,
// //       admin_email: currentUser.email,
// //       timestamp: new Date().toISOString(),
// //       success: true,
// //       ...details
// //     });
// //   } catch (error) {
// //     console.warn('⚠️ Failed to log admin action:', error);
// //   }
// // };

// // // ✨ Convert validity duration to days for consistent storage
// // export const convertValidityToDays = (duration: number, unit: string): number => {
// //   switch (unit) {
// //     case 'minutes':
// //       return Math.ceil(duration / (60 * 24));
// //     case 'hours':
// //       return Math.ceil(duration / 24);
// //     case 'days':
// //       return duration;
// //     case 'months':
// //       return duration * 30;
// //     case 'years':
// //       return duration * 365;
// //     default:
// //       return duration;
// //   }
// // };

// // // ✨ Get human-readable validity string
// // export const getValidityDisplayText = (duration: number, unit: string): string => {
// //   if (duration === 1) {
// //     const singularUnit = unit.replace(/s$/, '');
// //     return `${duration} ${singularUnit}`;
// //   }
// //   return `${duration} ${unit}`;
// // };

// // // ═══════════════════════════════════════════════════════════════
// // // READ OPERATIONS
// // // ═══════════════════════════════════════════════════════════════

// // const getAllPlans = async (): Promise<Plan[]> => {
// //   try {
// //     console.log('📋 Fetching all plans...');
    
// //     const plansRef = collection(db, 'plans');
// //     const snapshot = await getDocs(plansRef);
    
// //     if (snapshot.empty) {
// //       console.log('⚠️ No plans found in database');
// //       return [];
// //     }
    
// //     const plans: Plan[] = snapshot.docs.map(doc => ({
// //       id: doc.id,
// //       ...doc.data()
// //     } as Plan));
    
// //     const sortedPlans = sortPlansByOrder(plans);
    
// //     console.log(`✅ Fetched ${sortedPlans.length} plans`);
// //     return sortedPlans;
    
// //   } catch (error: any) {
// //     console.error('❌ Error fetching all plans:', error);
// //     throw new Error(`Failed to fetch plans: ${error.message}`);
// //   }
// // };

// // const getActivePlans = async (): Promise<Plan[]> => {
// //   try {
// //     console.log('📋 Fetching active plans...');
    
// //     try {
// //       const q = query(
// //         collection(db, 'plans'),
// //         where('is_active', '==', true)
// //       );
      
// //       const snapshot = await getDocs(q);
      
// //       const plans: Plan[] = snapshot.docs.map(doc => ({
// //         id: doc.id,
// //         ...doc.data()
// //       } as Plan));
      
// //       const sortedPlans = sortPlansByOrder(plans);
      
// //       console.log(`✅ Fetched ${sortedPlans.length} active plans`);
// //       return sortedPlans;
      
// //     } catch (queryError) {
// //       console.warn('⚠️ Query failed, using fallback method:', queryError);
      
// //       const allPlans = await getAllPlans();
// //       const activePlans = allPlans.filter(plan => plan.is_active === true);
      
// //       console.log(`✅ Fetched ${activePlans.length} active plans (fallback)`);
// //       return activePlans;
// //     }
    
// //   } catch (error: any) {
// //     console.error('❌ Error fetching active plans:', error);
// //     throw new Error(`Failed to fetch active plans: ${error.message}`);
// //   }
// // };

// // const getPlanById = async (planId: string): Promise<Plan | null> => {
// //   try {
// //     if (!planId?.trim()) {
// //       throw new Error('Plan ID is required');
// //     }
    
// //     console.log('🔍 Fetching plan:', planId);
    
// //     const planDoc = await getDoc(doc(db, 'plans', planId));
    
// //     if (!planDoc.exists()) {
// //       console.log('⚠️ Plan not found:', planId);
// //       return null;
// //     }
    
// //     const plan: Plan = {
// //       id: planDoc.id,
// //       ...planDoc.data()
// //     } as Plan;
    
// //     console.log('✅ Plan fetched:', plan.plan_name);
// //     return plan;
    
// //   } catch (error: any) {
// //     console.error('❌ Error fetching plan by ID:', error);
// //     throw new Error(`Failed to fetch plan: ${error.message}`);
// //   }
// // };

// // const getPlanStats = async (): Promise<PlanStats> => {
// //   try {
// //     const allPlans = await getAllPlans();
    
// //     const stats: PlanStats = {
// //       total: allPlans.length,
// //       active: allPlans.filter(p => p.is_active).length,
// //       inactive: allPlans.filter(p => !p.is_active).length
// //     };
    
// //     console.log('📊 Plan stats:', stats);
// //     return stats;
    
// //   } catch (error: any) {
// //     console.error('❌ Error fetching plan stats:', error);
// //     return { total: 0, active: 0, inactive: 0 };
// //   }
// // };

// // // ═══════════════════════════════════════════════════════════════
// // // VALIDATION
// // // ═══════════════════════════════════════════════════════════════

// // const validatePlanData = (planData: CreatePlanData | UpdatePlanData): PlanValidationError => {
// //   const errors: PlanValidationError = {};
  
// //   if ('plan_name' in planData) {
// //     if (!planData.plan_name?.trim()) {
// //       errors.plan_name = 'Plan name is required';
// //     } else if (planData.plan_name.trim().length < 3) {
// //       errors.plan_name = 'Plan name must be at least 3 characters';
// //     } else if (planData.plan_name.trim().length > 50) {
// //       errors.plan_name = 'Plan name must not exceed 50 characters';
// //     }
// //   }
  
// //   if ('price' in planData) {
// //     if (planData.price === undefined || planData.price === null) {
// //       errors.price = 'Price is required';
// //     } else if (typeof planData.price !== 'number') {
// //       errors.price = 'Price must be a number';
// //     } else if (planData.price < 0) {
// //       errors.price = 'Price must be 0 or positive';
// //     } else if (planData.price > 999999) {
// //       errors.price = 'Price is too high';
// //     }
// //   }
  
// //   if ('validity_duration' in planData) {
// //     if (!planData.validity_duration || planData.validity_duration <= 0) {
// //       errors.validity_duration = 'Validity duration must be greater than 0';
// //     } else if (planData.validity_duration > 10000) {
// //       errors.validity_duration = 'Validity duration is too high';
// //     }
// //   }
  
// //   if ('validity_unit' in planData) {
// //     const validUnits = ['minutes', 'hours', 'days', 'months', 'years'];
// //     if (!validUnits.includes(planData.validity_unit!)) {
// //       errors.validity_unit = 'Invalid validity unit';
// //     }
// //   }
  
// //   if ('features' in planData && planData.features) {
// //     if (!Array.isArray(planData.features)) {
// //       errors.features = 'Features must be an array';
// //     } else if (planData.features.length !== 5) {
// //       errors.features = 'Exactly 5 features are required';
// //     } else {
// //       const invalidFeatures = planData.features.filter(
// //         f => !f?.title?.trim() || !f?.description?.trim()
// //       );
// //       if (invalidFeatures.length > 0) {
// //         errors.features = 'All features must have title and description';
// //       }
// //     }
// //   }
  
// //   if ('limits' in planData && planData.limits) {
// //     if (typeof planData.limits !== 'object') {
// //       errors.limits = 'Limits must be an object';
// //     } else {
// //       if (planData.limits.max_tiles !== undefined && planData.limits.max_tiles < -1) {
// //         errors.limits = 'Invalid max_tiles value (use -1 for unlimited)';
// //       }
// //       if (planData.limits.max_qr_codes !== undefined && planData.limits.max_qr_codes < -1) {
// //         errors.limits = 'Invalid max_qr_codes value (use -1 for unlimited)';
// //       }
// //     }
// //   }
  
// //   if ('display_order' in planData) {
// //     if (typeof planData.display_order !== 'number') {
// //       errors.display_order = 'Display order must be a number';
// //     } else if (planData.display_order < 0) {
// //       errors.display_order = 'Display order must be positive';
// //     }
// //   }
  
// //   if ('stripe_price_id' in planData && planData.stripe_price_id) {
// //     if (typeof planData.stripe_price_id !== 'string') {
// //       errors.stripe_price_id = 'Stripe price ID must be a string';
// //     } else if (!planData.stripe_price_id.startsWith('price_')) {
// //       errors.stripe_price_id = 'Invalid Stripe price ID format';
// //     }
// //   }
  
// //   return errors;
// // };

// // const checkPlanNameExists = async (planName: string, excludePlanId?: string): Promise<boolean> => {
// //   try {
// //     const allPlans = await getAllPlans();
// //     const normalizedName = planName.trim().toLowerCase();
    
// //     return allPlans.some(plan => 
// //       plan.plan_name.toLowerCase() === normalizedName && 
// //       plan.id !== excludePlanId
// //     );
// //   } catch (error) {
// //     console.warn('⚠️ Could not check plan name uniqueness:', error);
// //     return false;
// //   }
// // };

// // // ═══════════════════════════════════════════════════════════════
// // // WRITE OPERATIONS
// // // ═══════════════════════════════════════════════════════════════

// // const createPlan = async (planData: CreatePlanData): Promise<ServiceResponse<string>> => {
// //   try {
// //     console.log('➕ Creating new plan:', planData.plan_name);
    
// //     const userId = requireAuth();
    
// //     const errors = validatePlanData(planData);
// //     if (Object.keys(errors).length > 0) {
// //       const errorMessage = Object.values(errors).join(', ');
// //       console.error('❌ Validation failed:', errors);
// //       return { success: false, error: errorMessage };
// //     }
    
// //     const nameExists = await checkPlanNameExists(planData.plan_name);
// //     if (nameExists) {
// //       console.error('❌ Plan name already exists');
// //       return { success: false, error: 'Plan name already exists' };
// //     }
    
// //     const newPlan = {
// //       ...planData,
// //       created_at: new Date().toISOString(),
// //       created_by: userId,
// //       updated_at: new Date().toISOString(),
// //       is_active: planData.is_active ?? true,
// //       display_order: planData.display_order ?? 999
// //     };
    
// //     const docRef = await addDoc(collection(db, 'plans'), newPlan);
    
// //     console.log('✅ Plan created with ID:', docRef.id);
    
// //     await logAdminAction('plan_created', {
// //       plan_id: docRef.id,
// //       plan_name: planData.plan_name,
// //       price: planData.price,
// //       validity: `${planData.validity_duration} ${planData.validity_unit}`
// //     });
    
// //     return { success: true, data: docRef.id };
    
// //   } catch (error: any) {
// //     console.error('❌ Error creating plan:', error);
// //     return { success: false, error: error.message || 'Failed to create plan' };
// //   }
// // };

// // const updatePlan = async (
// //   planId: string,
// //   updates: UpdatePlanData
// // ): Promise<ServiceResponse> => {
// //   try {
// //     console.log('📝 Updating plan:', planId);
    
// //     if (!planId?.trim()) {
// //       return { success: false, error: 'Plan ID is required' };
// //     }
    
// //     const userId = requireAuth();
    
// //     const existingPlan = await getPlanById(planId);
// //     if (!existingPlan) {
// //       return { success: false, error: 'Plan not found' };
// //     }
    
// //     const errors = validatePlanData(updates);
// //     if (Object.keys(errors).length > 0) {
// //       const errorMessage = Object.values(errors).join(', ');
// //       console.error('❌ Validation failed:', errors);
// //       return { success: false, error: errorMessage };
// //     }
    
// //     if (updates.plan_name && updates.plan_name !== existingPlan.plan_name) {
// //       const nameExists = await checkPlanNameExists(updates.plan_name, planId);
// //       if (nameExists) {
// //         return { success: false, error: 'Plan name already exists' };
// //       }
// //     }
    
// //     const updateData = {
// //       ...updates,
// //       updated_at: new Date().toISOString(),
// //       updated_by: userId
// //     };
    
// //     await updateDoc(doc(db, 'plans', planId), updateData);
    
// //     console.log('✅ Plan updated successfully');
    
// //     await logAdminAction('plan_updated', {
// //       plan_id: planId,
// //       plan_name: existingPlan.plan_name,
// //       updates: Object.keys(updates)
// //     });
    
// //     return { success: true };
    
// //   } catch (error: any) {
// //     console.error('❌ Error updating plan:', error);
// //     return { success: false, error: error.message || 'Failed to update plan' };
// //   }
// // };

// // const deletePlan = async (planId: string): Promise<ServiceResponse> => {
// //   try {
// //     console.log('🗑️ Deleting plan:', planId);
    
// //     if (!planId?.trim()) {
// //       return { success: false, error: 'Plan ID is required' };
// //     }
    
// //     const userId = requireAuth();
    
// //     const existingPlan = await getPlanById(planId);
// //     if (!existingPlan) {
// //       return { success: false, error: 'Plan not found' };
// //     }
    
// //     let hasActiveSubscriptions = false;
// //     try {
// //       const subsQuery = query(
// //         collection(db, 'subscriptions'),
// //         where('plan_id', '==', planId),
// //         where('status', '==', 'active')
// //       );
// //       const subsSnapshot = await getDocs(subsQuery);
// //       hasActiveSubscriptions = !subsSnapshot.empty;
// //     } catch (error) {
// //       console.warn('⚠️ Could not check subscriptions, doing soft delete:', error);
// //       hasActiveSubscriptions = true;
// //     }
    
// //     if (hasActiveSubscriptions) {
// //       console.log('⚠️ Plan has active subscriptions - soft deleting');
      
// //       await updateDoc(doc(db, 'plans', planId), {
// //         is_active: false,
// //         deleted_at: new Date().toISOString(),
// //         deleted_by: userId,
// //         updated_at: new Date().toISOString()
// //       });
      
// //       console.log('✅ Plan soft deleted (marked as inactive)');
      
// //       await logAdminAction('plan_soft_deleted', {
// //         plan_id: planId,
// //         plan_name: existingPlan.plan_name,
// //         reason: 'has_active_subscriptions'
// //       });
      
// //     } else {
// //       await deleteDoc(doc(db, 'plans', planId));
      
// //       console.log('✅ Plan permanently deleted');
      
// //       await logAdminAction('plan_hard_deleted', {
// //         plan_id: planId,
// //         plan_name: existingPlan.plan_name
// //       });
// //     }
    
// //     return { success: true };
    
// //   } catch (error: any) {
// //     console.error('❌ Error deleting plan:', error);
// //     return { success: false, error: error.message || 'Failed to delete plan' };
// //   }
// // };

// // const togglePlanStatus = async (
// //   planId: string,
// //   isActive: boolean
// // ): Promise<ServiceResponse> => {
// //   try {
// //     console.log(`🔄 Toggling plan status to: ${isActive}`);
    
// //     if (!planId?.trim()) {
// //       return { success: false, error: 'Plan ID is required' };
// //     }
    
// //     const userId = requireAuth();
    
// //     const existingPlan = await getPlanById(planId);
// //     if (!existingPlan) {
// //       return { success: false, error: 'Plan not found' };
// //     }
    
// //     await updateDoc(doc(db, 'plans', planId), {
// //       is_active: isActive,
// //       updated_at: new Date().toISOString(),
// //       updated_by: userId
// //     });
    
// //     console.log('✅ Plan status updated');
    
// //     await logAdminAction('plan_status_toggled', {
// //       plan_id: planId,
// //       plan_name: existingPlan.plan_name,
// //       new_status: isActive ? 'active' : 'inactive'
// //     });
    
// //     return { success: true };
    
// //   } catch (error: any) {
// //     console.error('❌ Error toggling plan status:', error);
// //     return { success: false, error: error.message || 'Failed to update plan status' };
// //   }
// // };

// // const reorderPlans = async (planOrders: { id: string; order: number }[]): Promise<ServiceResponse> => {
// //   try {
// //     console.log('🔄 Reordering plans...');
    
// //     const userId = requireAuth();
    
// //     if (!Array.isArray(planOrders) || planOrders.length === 0) {
// //       return { success: false, error: 'Invalid plan orders data' };
// //     }
    
// //     const batch = writeBatch(db);
    
// //     planOrders.forEach(({ id, order }) => {
// //       const planRef = doc(db, 'plans', id);
// //       batch.update(planRef, {
// //         display_order: order,
// //         updated_at: new Date().toISOString(),
// //         updated_by: userId
// //       });
// //     });
    
// //     await batch.commit();
    
// //     console.log(`✅ Reordered ${planOrders.length} plans`);
    
// //     await logAdminAction('plans_reordered', {
// //       count: planOrders.length,
// //       plan_ids: planOrders.map(p => p.id)
// //     });
    
// //     return { success: true };
    
// //   } catch (error: any) {
// //     console.error('❌ Error reordering plans:', error);
// //     return { success: false, error: error.message || 'Failed to reorder plans' };
// //   }
// // };

// // // ═══════════════════════════════════════════════════════════════
// // // HELPER FUNCTIONS
// // // ═══════════════════════════════════════════════════════════════

// // const getPlanByStripePriceId = async (
// //   stripePriceId: string
// // ): Promise<Plan | null> => {
// //   try {
// //     if (!stripePriceId?.trim()) {
// //       throw new Error('Stripe price ID is required');
// //     }
    
// //     const allPlans = await getAllPlans();
    
// //     const plan = allPlans.find(p => {
// //       // @ts-ignore
// //       return p.stripe_price_id === stripePriceId;
// //     });
    
// //     return plan || null;
    
// //   } catch (error: any) {
// //     console.error('❌ Error fetching plan by Stripe ID:', error);
// //     return null;
// //   }
// // };

// // const planHasActiveSubscriptions = async (planId: string): Promise<boolean> => {
// //   try {
// //     const subsQuery = query(
// //       collection(db, 'subscriptions'),
// //       where('plan_id', '==', planId),
// //       where('status', '==', 'active')
// //     );
// //     const subsSnapshot = await getDocs(subsQuery);
// //     return !subsSnapshot.empty;
// //   } catch (error) {
// //     console.warn('⚠️ Could not check subscriptions:', error);
// //     return false;
// //   }
// // };

// // // ═══════════════════════════════════════════════════════════════
// // // ✅ SINGLE EXPORT BLOCK (NO DUPLICATES)
// // // ═══════════════════════════════════════════════════════════════

// // export {
// //   getAllPlans,
// //   getActivePlans,
// //   getPlanById,
// //   getPlanStats,
// //   getPlanByStripePriceId,
// //   createPlan,
// //   updatePlan,
// //   deletePlan,
// //   togglePlanStatus,
// //   reorderPlans,
// //   validatePlanData,
// //   planHasActiveSubscriptions
// // };

// // export default {
// //   getAllPlans,
// //   getActivePlans,
// //   getPlanById,
// //   getPlanStats,
// //   getPlanByStripePriceId,
// //   createPlan,
// //   updatePlan,
// //   deletePlan,
// //   togglePlanStatus,
// //   reorderPlans,
// //   validatePlanData,
// //   planHasActiveSubscriptions,
// //   convertValidityToDays,
// //   getValidityDisplayText
// // };

// // // console.log('✅ Plan Service loaded - PRODUCTION v3.1 (FIXED)'); 


// // // import {
// // //   collection,
// // //   doc,
// // //   getDoc,
// // //   getDocs,
// // //   addDoc,
// // //   updateDoc,
// // //   deleteDoc,
// // //   query,
// // //   where,
// // //   writeBatch
// // // } from 'firebase/firestore';
// // // import { db, auth } from './firebase';
// // // import type { Plan, CreatePlanData, UpdatePlanData, PlanValidationError } from '../types/plan.types';

// // // // ═══════════════════════════════════════════════════════════════
// // // // INTERFACES
// // // // ═══════════════════════════════════════════════════════════════

// // // interface ServiceResponse<T = void> {
// // //   success: boolean;
// // //   data?: T;
// // //   error?: string;
// // // }

// // // interface PlanStats {
// // //   total: number;
// // //   active: number;
// // //   inactive: number;
// // // }

// // // // ═══════════════════════════════════════════════════════════════
// // // // UTILITY FUNCTIONS
// // // // ═══════════════════════════════════════════════════════════════

// // // const sortPlansByOrder = (plans: Plan[]): Plan[] => {
// // //   return plans.sort((a, b) => {
// // //     const orderA = a.display_order ?? 999;
// // //     const orderB = b.display_order ?? 999;
// // //     return orderA - orderB;
// // //   });
// // // };

// // // const requireAuth = (): string => {
// // //   const currentUser = auth.currentUser;
// // //   if (!currentUser) {
// // //     throw new Error('Authentication required. Please login.');
// // //   }
// // //   return currentUser.uid;
// // // };

// // // const logAdminAction = async (
// // //   action: string,
// // //   details: Record<string, any>
// // // ): Promise<void> => {
// // //   try {
// // //     const currentUser = auth.currentUser;
// // //     if (!currentUser) return;

// // //     await addDoc(collection(db, 'adminLogs'), {
// // //       action,
// // //       admin_id: currentUser.uid,
// // //       admin_email: currentUser.email,
// // //       timestamp: new Date().toISOString(),
// // //       success: true,
// // //       ...details
// // //     });
// // //   } catch (error) {
// // //     console.warn('⚠️ Failed to log admin action:', error);
// // //   }
// // // };

// // // // ✨ Convert validity duration to days for consistent storage
// // // export const convertValidityToDays = (duration: number, unit: string): number => {
// // //   switch (unit) {
// // //     case 'minutes':
// // //       return Math.ceil(duration / (60 * 24));
// // //     case 'hours':
// // //       return Math.ceil(duration / 24);
// // //     case 'days':
// // //       return duration;
// // //     case 'months':
// // //       return duration * 30;
// // //     case 'years':
// // //       return duration * 365;
// // //     default:
// // //       return duration;
// // //   }
// // // };

// // // // ✨ Get human-readable validity string
// // // export const getValidityDisplayText = (duration: number, unit: string): string => {
// // //   if (duration === 1) {
// // //     const singularUnit = unit.replace(/s$/, '');
// // //     return `${duration} ${singularUnit}`;
// // //   }
// // //   return `${duration} ${unit}`;
// // // };

// // // // ═══════════════════════════════════════════════════════════════
// // // // READ OPERATIONS
// // // // ═══════════════════════════════════════════════════════════════

// // // const getAllPlans = async (): Promise<Plan[]> => {
// // //   try {
// // //     console.log('📋 Fetching all plans...');
    
// // //     const plansRef = collection(db, 'plans');
// // //     const snapshot = await getDocs(plansRef);
    
// // //     if (snapshot.empty) {
// // //       console.log('⚠️ No plans found in database');
// // //       return [];
// // //     }
    
// // //     const plans: Plan[] = snapshot.docs.map(doc => ({
// // //       id: doc.id,
// // //       ...doc.data()
// // //     } as Plan));
    
// // //     const sortedPlans = sortPlansByOrder(plans);
    
// // //     console.log(`✅ Fetched ${sortedPlans.length} plans`);
// // //     return sortedPlans;
    
// // //   } catch (error: any) {
// // //     console.error('❌ Error fetching all plans:', error);
// // //     throw new Error(`Failed to fetch plans: ${error.message}`);
// // //   }
// // // };

// // // const getActivePlans = async (): Promise<Plan[]> => {
// // //   try {
// // //     console.log('📋 Fetching active plans...');
    
// // //     try {
// // //       const q = query(
// // //         collection(db, 'plans'),
// // //         where('is_active', '==', true)
// // //       );
      
// // //       const snapshot = await getDocs(q);
      
// // //       const plans: Plan[] = snapshot.docs.map(doc => ({
// // //         id: doc.id,
// // //         ...doc.data()
// // //       } as Plan));
      
// // //       const sortedPlans = sortPlansByOrder(plans);
      
// // //       console.log(`✅ Fetched ${sortedPlans.length} active plans`);
// // //       return sortedPlans;
      
// // //     } catch (queryError) {
// // //       console.warn('⚠️ Query failed, using fallback method:', queryError);
      
// // //       const allPlans = await getAllPlans();
// // //       const activePlans = allPlans.filter(plan => plan.is_active === true);
      
// // //       console.log(`✅ Fetched ${activePlans.length} active plans (fallback)`);
// // //       return activePlans;
// // //     }
    
// // //   } catch (error: any) {
// // //     console.error('❌ Error fetching active plans:', error);
// // //     throw new Error(`Failed to fetch active plans: ${error.message}`);
// // //   }
// // // };

// // // const getPlanById = async (planId: string): Promise<Plan | null> => {
// // //   try {
// // //     if (!planId?.trim()) {
// // //       throw new Error('Plan ID is required');
// // //     }
    
// // //     console.log('🔍 Fetching plan:', planId);
    
// // //     const planDoc = await getDoc(doc(db, 'plans', planId));
    
// // //     if (!planDoc.exists()) {
// // //       console.log('⚠️ Plan not found:', planId);
// // //       return null;
// // //     }
    
// // //     const plan: Plan = {
// // //       id: planDoc.id,
// // //       ...planDoc.data()
// // //     } as Plan;
    
// // //     console.log('✅ Plan fetched:', plan.plan_name);
// // //     return plan;
    
// // //   } catch (error: any) {
// // //     console.error('❌ Error fetching plan by ID:', error);
// // //     throw new Error(`Failed to fetch plan: ${error.message}`);
// // //   }
// // // };

// // // const getPlanStats = async (): Promise<PlanStats> => {
// // //   try {
// // //     const allPlans = await getAllPlans();
    
// // //     const stats: PlanStats = {
// // //       total: allPlans.length,
// // //       active: allPlans.filter(p => p.is_active).length,
// // //       inactive: allPlans.filter(p => !p.is_active).length
// // //     };
    
// // //     console.log('📊 Plan stats:', stats);
// // //     return stats;
    
// // //   } catch (error: any) {
// // //     console.error('❌ Error fetching plan stats:', error);
// // //     return { total: 0, active: 0, inactive: 0 };
// // //   }
// // // };

// // // // ═══════════════════════════════════════════════════════════════
// // // // ✅ VALIDATION - MINIMUM 1 FEATURE, MAX UNLIMITED
// // // // ═══════════════════════════════════════════════════════════════

// // // const validatePlanData = (planData: CreatePlanData | UpdatePlanData): PlanValidationError => {
// // //   const errors: PlanValidationError = {};
  
// // //   // Plan Name Validation
// // //   if ('plan_name' in planData) {
// // //     if (!planData.plan_name?.trim()) {
// // //       errors.plan_name = 'Plan name is required';
// // //     } else if (planData.plan_name.trim().length < 3) {
// // //       errors.plan_name = 'Plan name must be at least 3 characters';
// // //     } else if (planData.plan_name.trim().length > 50) {
// // //       errors.plan_name = 'Plan name must not exceed 50 characters';
// // //     }
// // //   }
  
// // //   // Price Validation
// // //   if ('price' in planData) {
// // //     if (planData.price === undefined || planData.price === null) {
// // //       errors.price = 'Price is required';
// // //     } else if (typeof planData.price !== 'number') {
// // //       errors.price = 'Price must be a number';
// // //     } else if (planData.price < 0) {
// // //       errors.price = 'Price must be 0 or positive';
// // //     } else if (planData.price > 999999) {
// // //       errors.price = 'Price is too high';
// // //     }
// // //   }
  
// // //   // Validity Duration Validation
// // //   if ('validity_duration' in planData) {
// // //     if (!planData.validity_duration || planData.validity_duration <= 0) {
// // //       errors.validity_duration = 'Validity duration must be greater than 0';
// // //     } else if (planData.validity_duration > 10000) {
// // //       errors.validity_duration = 'Validity duration is too high';
// // //     }
// // //   }
  
// // //   // Validity Unit Validation
// // //   if ('validity_unit' in planData) {
// // //     const validUnits = ['minutes', 'hours', 'days', 'months', 'years'];
// // //     if (!validUnits.includes(planData.validity_unit!)) {
// // //       errors.validity_unit = 'Invalid validity unit';
// // //     }
// // //   }
  
// // //   // ✅ FIXED: Features Validation - Minimum 1, Maximum Unlimited
// // //   if ('features' in planData && planData.features) {
// // //     if (!Array.isArray(planData.features)) {
// // //       errors.features = 'Features must be an array';
// // //     } 
// // //     // ✅ MINIMUM 1 FEATURE REQUIRED
// // //     else if (planData.features.length < 1) {
// // //       errors.features = 'At least 1 feature is required';
// // //     } 
// // //     else {
// // //       // Validate that all features have required fields
// // //       const invalidFeatures = planData.features.filter(
// // //         f => !f?.title?.trim() || !f?.description?.trim()
// // //       );
// // //       if (invalidFeatures.length > 0) {
// // //         errors.features = 'All features must have title and description';
// // //       }
// // //     }
// // //   }
  
// // //   // Limits Validation
// // //   if ('limits' in planData && planData.limits) {
// // //     if (typeof planData.limits !== 'object') {
// // //       errors.limits = 'Limits must be an object';
// // //     } else {
// // //       if (planData.limits.max_tiles !== undefined && planData.limits.max_tiles < -1) {
// // //         errors.limits = 'Invalid max_tiles value (use -1 for unlimited)';
// // //       }
// // //       if (planData.limits.max_qr_codes !== undefined && planData.limits.max_qr_codes < -1) {
// // //         errors.limits = 'Invalid max_qr_codes value (use -1 for unlimited)';
// // //       }
// // //     }
// // //   }
  
// // //   // Display Order Validation
// // //   if ('display_order' in planData) {
// // //     if (typeof planData.display_order !== 'number') {
// // //       errors.display_order = 'Display order must be a number';
// // //     } else if (planData.display_order < 0) {
// // //       errors.display_order = 'Display order must be positive';
// // //     }
// // //   }
  
// // //   // Stripe Price ID Validation
// // //   if ('stripe_price_id' in planData && planData.stripe_price_id) {
// // //     if (typeof planData.stripe_price_id !== 'string') {
// // //       errors.stripe_price_id = 'Stripe price ID must be a string';
// // //     } else if (!planData.stripe_price_id.startsWith('price_')) {
// // //       errors.stripe_price_id = 'Invalid Stripe price ID format';
// // //     }
// // //   }
  
// // //   return errors;
// // // };

// // // const checkPlanNameExists = async (planName: string, excludePlanId?: string): Promise<boolean> => {
// // //   try {
// // //     const allPlans = await getAllPlans();
// // //     const normalizedName = planName.trim().toLowerCase();
    
// // //     return allPlans.some(plan => 
// // //       plan.plan_name.toLowerCase() === normalizedName && 
// // //       plan.id !== excludePlanId
// // //     );
// // //   } catch (error) {
// // //     console.warn('⚠️ Could not check plan name uniqueness:', error);
// // //     return false;
// // //   }
// // // };

// // // // ═══════════════════════════════════════════════════════════════
// // // // WRITE OPERATIONS
// // // // ═══════════════════════════════════════════════════════════════

// // // const createPlan = async (planData: CreatePlanData): Promise<ServiceResponse<string>> => {
// // //   try {
// // //     console.log('➕ Creating new plan:', planData.plan_name);
    
// // //     const userId = requireAuth();
    
// // //     const errors = validatePlanData(planData);
// // //     if (Object.keys(errors).length > 0) {
// // //       const errorMessage = Object.values(errors).join(', ');
// // //       console.error('❌ Validation failed:', errors);
// // //       return { success: false, error: errorMessage };
// // //     }
    
// // //     const nameExists = await checkPlanNameExists(planData.plan_name);
// // //     if (nameExists) {
// // //       console.error('❌ Plan name already exists');
// // //       return { success: false, error: 'Plan name already exists' };
// // //     }
    
// // //     const newPlan = {
// // //       ...planData,
// // //       created_at: new Date().toISOString(),
// // //       created_by: userId,
// // //       updated_at: new Date().toISOString(),
// // //       is_active: planData.is_active ?? true,
// // //       display_order: planData.display_order ?? 999
// // //     };
    
// // //     const docRef = await addDoc(collection(db, 'plans'), newPlan);
    
// // //     console.log('✅ Plan created with ID:', docRef.id);
    
// // //     await logAdminAction('plan_created', {
// // //       plan_id: docRef.id,
// // //       plan_name: planData.plan_name,
// // //       price: planData.price,
// // //       validity: `${planData.validity_duration} ${planData.validity_unit}`,
// // //       features_count: planData.features.length
// // //     });
    
// // //     return { success: true, data: docRef.id };
    
// // //   } catch (error: any) {
// // //     console.error('❌ Error creating plan:', error);
// // //     return { success: false, error: error.message || 'Failed to create plan' };
// // //   }
// // // };

// // // const updatePlan = async (
// // //   planId: string,
// // //   updates: UpdatePlanData
// // // ): Promise<ServiceResponse> => {
// // //   try {
// // //     console.log('📝 Updating plan:', planId);
    
// // //     if (!planId?.trim()) {
// // //       return { success: false, error: 'Plan ID is required' };
// // //     }
    
// // //     const userId = requireAuth();
    
// // //     const existingPlan = await getPlanById(planId);
// // //     if (!existingPlan) {
// // //       return { success: false, error: 'Plan not found' };
// // //     }
    
// // //     const errors = validatePlanData(updates);
// // //     if (Object.keys(errors).length > 0) {
// // //       const errorMessage = Object.values(errors).join(', ');
// // //       console.error('❌ Validation failed:', errors);
// // //       return { success: false, error: errorMessage };
// // //     }
    
// // //     if (updates.plan_name && updates.plan_name !== existingPlan.plan_name) {
// // //       const nameExists = await checkPlanNameExists(updates.plan_name, planId);
// // //       if (nameExists) {
// // //         return { success: false, error: 'Plan name already exists' };
// // //       }
// // //     }
    
// // //     const updateData = {
// // //       ...updates,
// // //       updated_at: new Date().toISOString(),
// // //       updated_by: userId
// // //     };
    
// // //     await updateDoc(doc(db, 'plans', planId), updateData);
    
// // //     console.log('✅ Plan updated successfully');
    
// // //     await logAdminAction('plan_updated', {
// // //       plan_id: planId,
// // //       plan_name: existingPlan.plan_name,
// // //       updates: Object.keys(updates)
// // //     });
    
// // //     return { success: true };
    
// // //   } catch (error: any) {
// // //     console.error('❌ Error updating plan:', error);
// // //     return { success: false, error: error.message || 'Failed to update plan' };
// // //   }
// // // };

// // // const deletePlan = async (planId: string): Promise<ServiceResponse> => {
// // //   try {
// // //     console.log('🗑️ Deleting plan:', planId);
    
// // //     if (!planId?.trim()) {
// // //       return { success: false, error: 'Plan ID is required' };
// // //     }
    
// // //     const userId = requireAuth();
    
// // //     const existingPlan = await getPlanById(planId);
// // //     if (!existingPlan) {
// // //       return { success: false, error: 'Plan not found' };
// // //     }
    
// // //     let hasActiveSubscriptions = false;
// // //     try {
// // //       const subsQuery = query(
// // //         collection(db, 'subscriptions'),
// // //         where('plan_id', '==', planId),
// // //         where('status', '==', 'active')
// // //       );
// // //       const subsSnapshot = await getDocs(subsQuery);
// // //       hasActiveSubscriptions = !subsSnapshot.empty;
// // //     } catch (error) {
// // //       console.warn('⚠️ Could not check subscriptions, doing soft delete:', error);
// // //       hasActiveSubscriptions = true;
// // //     }
    
// // //     if (hasActiveSubscriptions) {
// // //       console.log('⚠️ Plan has active subscriptions - soft deleting');
      
// // //       await updateDoc(doc(db, 'plans', planId), {
// // //         is_active: false,
// // //         deleted_at: new Date().toISOString(),
// // //         deleted_by: userId,
// // //         updated_at: new Date().toISOString()
// // //       });
      
// // //       console.log('✅ Plan soft deleted (marked as inactive)');
      
// // //       await logAdminAction('plan_soft_deleted', {
// // //         plan_id: planId,
// // //         plan_name: existingPlan.plan_name,
// // //         reason: 'has_active_subscriptions'
// // //       });
      
// // //     } else {
// // //       await deleteDoc(doc(db, 'plans', planId));
      
// // //       console.log('✅ Plan permanently deleted');
      
// // //       await logAdminAction('plan_hard_deleted', {
// // //         plan_id: planId,
// // //         plan_name: existingPlan.plan_name
// // //       });
// // //     }
    
// // //     return { success: true };
    
// // //   } catch (error: any) {
// // //     console.error('❌ Error deleting plan:', error);
// // //     return { success: false, error: error.message || 'Failed to delete plan' };
// // //   }
// // // };

// // // const togglePlanStatus = async (
// // //   planId: string,
// // //   isActive: boolean
// // // ): Promise<ServiceResponse> => {
// // //   try {
// // //     console.log(`🔄 Toggling plan status to: ${isActive}`);
    
// // //     if (!planId?.trim()) {
// // //       return { success: false, error: 'Plan ID is required' };
// // //     }
    
// // //     const userId = requireAuth();
    
// // //     const existingPlan = await getPlanById(planId);
// // //     if (!existingPlan) {
// // //       return { success: false, error: 'Plan not found' };
// // //     }
    
// // //     await updateDoc(doc(db, 'plans', planId), {
// // //       is_active: isActive,
// // //       updated_at: new Date().toISOString(),
// // //       updated_by: userId
// // //     });
    
// // //     console.log('✅ Plan status updated');
    
// // //     await logAdminAction('plan_status_toggled', {
// // //       plan_id: planId,
// // //       plan_name: existingPlan.plan_name,
// // //       new_status: isActive ? 'active' : 'inactive'
// // //     });
    
// // //     return { success: true };
    
// // //   } catch (error: any) {
// // //     console.error('❌ Error toggling plan status:', error);
// // //     return { success: false, error: error.message || 'Failed to update plan status' };
// // //   }
// // // };

// // // const reorderPlans = async (planOrders: { id: string; order: number }[]): Promise<ServiceResponse> => {
// // //   try {
// // //     console.log('🔄 Reordering plans...');
    
// // //     const userId = requireAuth();
    
// // //     if (!Array.isArray(planOrders) || planOrders.length === 0) {
// // //       return { success: false, error: 'Invalid plan orders data' };
// // //     }
    
// // //     const batch = writeBatch(db);
    
// // //     planOrders.forEach(({ id, order }) => {
// // //       const planRef = doc(db, 'plans', id);
// // //       batch.update(planRef, {
// // //         display_order: order,
// // //         updated_at: new Date().toISOString(),
// // //         updated_by: userId
// // //       });
// // //     });
    
// // //     await batch.commit();
    
// // //     console.log(`✅ Reordered ${planOrders.length} plans`);
    
// // //     await logAdminAction('plans_reordered', {
// // //       count: planOrders.length,
// // //       plan_ids: planOrders.map(p => p.id)
// // //     });
    
// // //     return { success: true };
    
// // //   } catch (error: any) {
// // //     console.error('❌ Error reordering plans:', error);
// // //     return { success: false, error: error.message || 'Failed to reorder plans' };
// // //   }
// // // };

// // // // ═══════════════════════════════════════════════════════════════
// // // // HELPER FUNCTIONS
// // // // ═══════════════════════════════════════════════════════════════

// // // const getPlanByStripePriceId = async (
// // //   stripePriceId: string
// // // ): Promise<Plan | null> => {
// // //   try {
// // //     if (!stripePriceId?.trim()) {
// // //       throw new Error('Stripe price ID is required');
// // //     }
    
// // //     const allPlans = await getAllPlans();
    
// // //     const plan = allPlans.find(p => {
// // //       // @ts-ignore
// // //       return p.stripe_price_id === stripePriceId;
// // //     });
    
// // //     return plan || null;
    
// // //   } catch (error: any) {
// // //     console.error('❌ Error fetching plan by Stripe ID:', error);
// // //     return null;
// // //   }
// // // };

// // // const planHasActiveSubscriptions = async (planId: string): Promise<boolean> => {
// // //   try {
// // //     const subsQuery = query(
// // //       collection(db, 'subscriptions'),
// // //       where('plan_id', '==', planId),
// // //       where('status', '==', 'active')
// // //     );
// // //     const subsSnapshot = await getDocs(subsQuery);
// // //     return !subsSnapshot.empty;
// // //   } catch (error) {
// // //     console.warn('⚠️ Could not check subscriptions:', error);
// // //     return false;
// // //   }
// // // };

// // // // ═══════════════════════════════════════════════════════════════
// // // // ✅ SINGLE EXPORT BLOCK (NO DUPLICATES)
// // // // ═══════════════════════════════════════════════════════════════

// // // export {
// // //   getAllPlans,
// // //   getActivePlans,
// // //   getPlanById,
// // //   getPlanStats,
// // //   getPlanByStripePriceId,
// // //   createPlan,
// // //   updatePlan,
// // //   deletePlan,
// // //   togglePlanStatus,
// // //   reorderPlans,
// // //   validatePlanData,
// // //   planHasActiveSubscriptions
// // // };

// // // export default {
// // //   getAllPlans,
// // //   getActivePlans,
// // //   getPlanById,
// // //   getPlanStats,
// // //   getPlanByStripePriceId,
// // //   createPlan,
// // //   updatePlan,
// // //   deletePlan,
// // //   togglePlanStatus,
// // //   reorderPlans,
// // //   validatePlanData,
// // //   planHasActiveSubscriptions,
// // //   convertValidityToDays,
// // //   getValidityDisplayText
// // // };       

// import {
//   collection,
//   doc,
//   getDoc,
//   getDocs,
//   addDoc,
//   updateDoc,
//   deleteDoc,
//   query,
//   where,
//   writeBatch
// } from 'firebase/firestore';
// import { db, auth } from './firebase';
// import type { Plan, CreatePlanData, UpdatePlanData, PlanValidationError } from '../types/plan.types';

// // ═══════════════════════════════════════════════════════════════
// // INTERFACES
// // ═══════════════════════════════════════════════════════════════

// interface ServiceResponse<T = void> {
//   success: boolean;
//   data?: T;
//   error?: string;
// }

// interface PlanStats {
//   total: number;
//   active: number;
//   inactive: number;
// }

// // ═══════════════════════════════════════════════════════════════
// // UTILITY FUNCTIONS
// // ═══════════════════════════════════════════════════════════════

// const sortPlansByOrder = (plans: Plan[]): Plan[] => {
//   return plans.sort((a, b) => {
//     const orderA = a.display_order ?? 999;
//     const orderB = b.display_order ?? 999;
//     return orderA - orderB;
//   });
// };

// const requireAuth = (): string => {
//   const currentUser = auth.currentUser;
//   if (!currentUser) {
//     throw new Error('Authentication required. Please login.');
//   }
//   return currentUser.uid;
// };

// const logAdminAction = async (
//   action: string,
//   details: Record<string, any>
// ): Promise<void> => {
//   try {
//     const currentUser = auth.currentUser;
//     if (!currentUser) return;

//     await addDoc(collection(db, 'adminLogs'), {
//       action,
//       admin_id: currentUser.uid,
//       admin_email: currentUser.email,
//       timestamp: new Date().toISOString(),
//       success: true,
//       ...details
//     });
//   } catch (error) {
//     console.warn('⚠️ Failed to log admin action:', error);
//   }
// };

// export const convertValidityToDays = (duration: number, unit: string): number => {
//   switch (unit) {
//     case 'minutes':
//       return Math.ceil(duration / (60 * 24));
//     case 'hours':
//       return Math.ceil(duration / 24);
//     case 'days':
//       return duration;
//     case 'months':
//       return duration * 30;
//     case 'years':
//       return duration * 365;
//     default:
//       return duration;
//   }
// };

// export const getValidityDisplayText = (duration: number, unit: string): string => {
//   if (duration === 1) {
//     const singularUnit = unit.replace(/s$/, '');
//     return `${duration} ${singularUnit}`;
//   }
//   return `${duration} ${unit}`;
// };

// // ═══════════════════════════════════════════════════════════════
// // READ OPERATIONS
// // ═══════════════════════════════════════════════════════════════

// const getAllPlans = async (): Promise<Plan[]> => {
//   try {
//     console.log('📋 Fetching all plans...');
    
//     const plansRef = collection(db, 'plans');
//     const snapshot = await getDocs(plansRef);
    
//     if (snapshot.empty) {
//       console.log('⚠️ No plans found in database');
//       return [];
//     }
    
//     const plans: Plan[] = snapshot.docs.map(doc => ({
//       id: doc.id,
//       ...doc.data()
//     } as Plan));
    
//     const sortedPlans = sortPlansByOrder(plans);
    
//     console.log(`✅ Fetched ${sortedPlans.length} plans`);
//     return sortedPlans;
    
//   } catch (error: any) {
//     console.error('❌ Error fetching all plans:', error);
//     throw new Error(`Failed to fetch plans: ${error.message}`);
//   }
// };

// const getActivePlans = async (): Promise<Plan[]> => {
//   try {
//     console.log('📋 Fetching active plans...');
    
//     try {
//       const q = query(
//         collection(db, 'plans'),
//         where('is_active', '==', true)
//       );
      
//       const snapshot = await getDocs(q);
      
//       const plans: Plan[] = snapshot.docs.map(doc => ({
//         id: doc.id,
//         ...doc.data()
//       } as Plan));
      
//       const sortedPlans = sortPlansByOrder(plans);
      
//       console.log(`✅ Fetched ${sortedPlans.length} active plans`);
//       return sortedPlans;
      
//     } catch (queryError) {
//       console.warn('⚠️ Query failed, using fallback method:', queryError);
      
//       const allPlans = await getAllPlans();
//       const activePlans = allPlans.filter(plan => plan.is_active === true);
      
//       console.log(`✅ Fetched ${activePlans.length} active plans (fallback)`);
//       return activePlans;
//     }
    
//   } catch (error: any) {
//     console.error('❌ Error fetching active plans:', error);
//     throw new Error(`Failed to fetch active plans: ${error.message}`);
//   }
// };

// const getPlanById = async (planId: string): Promise<Plan | null> => {
//   try {
//     if (!planId?.trim()) {
//       throw new Error('Plan ID is required');
//     }
    
//     console.log('🔍 Fetching plan:', planId);
    
//     const planDoc = await getDoc(doc(db, 'plans', planId));
    
//     if (!planDoc.exists()) {
//       console.log('⚠️ Plan not found:', planId);
//       return null;
//     }
    
//     const plan: Plan = {
//       id: planDoc.id,
//       ...planDoc.data()
//     } as Plan;
    
//     console.log('✅ Plan fetched:', plan.plan_name);
//     return plan;
    
//   } catch (error: any) {
//     console.error('❌ Error fetching plan by ID:', error);
//     throw new Error(`Failed to fetch plan: ${error.message}`);
//   }
// };

// const getPlanStats = async (): Promise<PlanStats> => {
//   try {
//     const allPlans = await getAllPlans();
    
//     const stats: PlanStats = {
//       total: allPlans.length,
//       active: allPlans.filter(p => p.is_active).length,
//       inactive: allPlans.filter(p => !p.is_active).length
//     };
    
//     console.log('📊 Plan stats:', stats);
//     return stats;
    
//   } catch (error: any) {
//     console.error('❌ Error fetching plan stats:', error);
//     return { total: 0, active: 0, inactive: 0 };
//   }
// };

// // ═══════════════════════════════════════════════════════════════
// // VALIDATION - ✅ FIXED
// // ═══════════════════════════════════════════════════════════════
// // const validatePlanData = (planData: CreatePlanData | UpdatePlanData): PlanValidationError => {
// //   const errors: PlanValidationError = {};
  
// //   // Plan Name Validation
// //   if ('plan_name' in planData) {
// //     if (!planData.plan_name?.trim()) {
// //       errors.plan_name = 'Plan name is required';
// //     } else if (planData.plan_name.trim().length < 3) {
// //       errors.plan_name = 'Plan name must be at least 3 characters';
// //     } else if (planData.plan_name.trim().length > 50) {
// //       errors.plan_name = 'Plan name must not exceed 50 characters';
// //     }
// //   }
  
// //   // ✅ FIXED: Price Validation with proper type guards
// //   if ('price' in planData) {
// //     let priceValue: number;
    
// //     if (typeof planData.price === 'string') {
// //       priceValue = parseFloat(planData.price);
// //     } else if (typeof planData.price === 'number') {
// //       priceValue = planData.price;
// //     } else {
// //       errors.price = 'Price is required';
// //       return errors;  // Early return to avoid further checks
// //     }
    
// //     if (isNaN(priceValue)) {
// //       errors.price = 'Price must be a valid number';
// //     } else if (priceValue < 0) {
// //       errors.price = 'Price must be 0 or positive';
// //     } else if (priceValue > 999999) {
// //       errors.price = 'Price is too high';
// //     }
// //   }
  
// //   // Validity Duration Validation
// //   if ('validity_duration' in planData) {
// //     if (!planData.validity_duration || planData.validity_duration <= 0) {
// //       errors.validity_duration = 'Validity duration must be greater than 0';
// //     } else if (planData.validity_duration > 10000) {
// //       errors.validity_duration = 'Validity duration is too high';
// //     }
// //   }
  
// //   // Validity Unit Validation
// //   if ('validity_unit' in planData) {
// //     const validUnits = ['minutes', 'hours', 'days', 'months', 'years'];
// //     if (!validUnits.includes(planData.validity_unit!)) {
// //       errors.validity_unit = 'Invalid validity unit';
// //     }
// //   }
  
// //   // Features Validation (Min 1, Unlimited max)
// //   if ('features' in planData && planData.features) {
// //     if (!Array.isArray(planData.features)) {
// //       errors.features = 'Features must be an array';
// //     } else if (planData.features.length < 1) {
// //       errors.features = 'At least 1 feature is required';
// //     } else {
// //       const invalidFeatures = planData.features.filter(
// //         f => !f?.title?.trim() || !f?.description?.trim()
// //       );
// //       if (invalidFeatures.length > 0) {
// //         errors.features = 'All features must have title and description';
// //       }
// //     }
// //   }
  
// //   // Limits Validation
// //   if ('limits' in planData && planData.limits) {
// //     if (typeof planData.limits !== 'object') {
// //       errors.limits = 'Limits must be an object';
// //     } else {
// //       if (planData.limits.max_tiles !== undefined && planData.limits.max_tiles < -1) {
// //         errors.limits = 'Invalid max_tiles value (use -1 for unlimited)';
// //       }
// //       if (planData.limits.max_qr_codes !== undefined && planData.limits.max_qr_codes < -1) {
// //         errors.limits = 'Invalid max_qr_codes value (use -1 for unlimited)';
// //       }
// //     }
// //   }
  
// //   // Display Order Validation
// //   if ('display_order' in planData && planData.display_order !== undefined) {
// //     if (typeof planData.display_order !== 'number') {
// //       errors.display_order = 'Display order must be a number';
// //     } else if (planData.display_order < 0) {
// //       errors.display_order = 'Display order must be positive';
// //     }
// //   }
  
// //   // Stripe Price ID Validation
// //   if ('stripe_price_id' in planData && planData.stripe_price_id) {
// //     if (typeof planData.stripe_price_id !== 'string') {
// //       errors.stripe_price_id = 'Stripe price ID must be a string';
// //     } else if (!planData.stripe_price_id.startsWith('price_')) {
// //       errors.stripe_price_id = 'Invalid Stripe price ID format';
// //     }
// //   }
  
// //   return errors;
// // }; 
// const validatePlanData = (planData: CreatePlanData | UpdatePlanData): PlanValidationError => {
//   const errors: PlanValidationError = {};
  
//   // ══════════════════════════════════════════════════════════
//   // PLAN NAME VALIDATION
//   // ══════════════════════════════════════════════════════════
//   if ('plan_name' in planData) {
//     if (!planData.plan_name?.trim()) {
//       errors.plan_name = 'Plan name is required';
//     } else if (planData.plan_name.trim().length < 3) {
//       errors.plan_name = 'Plan name must be at least 3 characters';
//     } else if (planData.plan_name.trim().length > 50) {
//       errors.plan_name = 'Plan name must not exceed 50 characters';
//     }
//   }
  
//   // ══════════════════════════════════════════════════════════
//   // PRICE VALIDATION (Handle string or number)
//   // ══════════════════════════════════════════════════════════
//   if ('price' in planData) {
//     let priceValue: number;
    
//     if (typeof planData.price === 'string') {
//       priceValue = parseFloat(planData.price);
//     } else if (typeof planData.price === 'number') {
//       priceValue = planData.price;
//     } else {
//       errors.price = 'Price is required';
//       return errors;
//     }
    
//     if (isNaN(priceValue)) {
//       errors.price = 'Price must be a valid number';
//     } else if (priceValue < 0) {
//       errors.price = 'Price must be 0 or positive';
//     } else if (priceValue > 999999) {
//       errors.price = 'Price is too high';
//     }
//   }
  
//   // ══════════════════════════════════════════════════════════
//   // VALIDITY DURATION VALIDATION
//   // ══════════════════════════════════════════════════════════
//   if ('validity_duration' in planData) {
//     if (!planData.validity_duration || planData.validity_duration <= 0) {
//       errors.validity_duration = 'Validity duration must be greater than 0';
//     } else if (planData.validity_duration > 10000) {
//       errors.validity_duration = 'Validity duration is too high';
//     }
//   }
  
//   // ══════════════════════════════════════════════════════════
//   // VALIDITY UNIT VALIDATION
//   // ══════════════════════════════════════════════════════════
//   if ('validity_unit' in planData) {
//     const validUnits = ['minutes', 'hours', 'days', 'months', 'years'];
//     if (!validUnits.includes(planData.validity_unit!)) {
//       errors.validity_unit = 'Invalid validity unit';
//     }
//   }
  
//   // ══════════════════════════════════════════════════════════
//   // FEATURES VALIDATION (Min 1, Max 100, Unlimited)
//   // ══════════════════════════════════════════════════════════
//   if ('features' in planData && planData.features) {
//     if (!Array.isArray(planData.features)) {
//       errors.features = 'Features must be an array';
//     } else if (planData.features.length < 1) {
//       errors.features = 'At least 1 feature is required';
//     } else if (planData.features.length > 100) {
//       errors.features = 'Maximum 100 features allowed';
//     } else {
//       const invalidFeatures = planData.features.filter(
//         f => !f?.title?.trim() || !f?.description?.trim()
//       );
//       if (invalidFeatures.length > 0) {
//         errors.features = 'All features must have title and description';
//       }
//     }
//   }
  
//   // ══════════════════════════════════════════════════════════
//   // LIMITS VALIDATION
//   // ══════════════════════════════════════════════════════════
//   if ('limits' in planData && planData.limits) {
//     if (typeof planData.limits !== 'object') {
//       errors.limits = 'Limits must be an object';
//     } else {
//       if (planData.limits.max_tiles !== undefined && planData.limits.max_tiles < -1) {
//         errors.limits = 'Invalid max_tiles value (use -1 for unlimited)';
//       }
//       if (planData.limits.max_qr_codes !== undefined && planData.limits.max_qr_codes < -1) {
//         errors.limits = 'Invalid max_qr_codes value (use -1 for unlimited)';
//       }
//     }
//   }
  
//   // ══════════════════════════════════════════════════════════
//   // DISPLAY ORDER VALIDATION
//   // ══════════════════════════════════════════════════════════
//   if ('display_order' in planData && planData.display_order !== undefined) {
//     if (typeof planData.display_order !== 'number') {
//       errors.display_order = 'Display order must be a number';
//     } else if (planData.display_order < 0) {
//       errors.display_order = 'Display order must be positive';
//     }
//   }
  
//   // ══════════════════════════════════════════════════════════
//   // STRIPE PRICE ID VALIDATION (Optional)
//   // ══════════════════════════════════════════════════════════
//   if ('stripe_price_id' in planData && planData.stripe_price_id) {
//     if (typeof planData.stripe_price_id !== 'string') {
//       errors.stripe_price_id = 'Stripe price ID must be a string';
//     } else if (!planData.stripe_price_id.startsWith('price_')) {
//       errors.stripe_price_id = 'Invalid Stripe price ID format';
//     }
//   }
  
//   return errors;
// };

// const checkPlanNameExists = async (planName: string, excludePlanId?: string): Promise<boolean> => {
//   try {
//     const allPlans = await getAllPlans();
//     const normalizedName = planName.trim().toLowerCase();
    
//     return allPlans.some(plan => 
//       plan.plan_name.toLowerCase() === normalizedName && 
//       plan.id !== excludePlanId
//     );
//   } catch (error) {
//     console.warn('⚠️ Could not check plan name uniqueness:', error);
//     return false;
//   }
// };

// // ═══════════════════════════════════════════════════════════════
// // WRITE OPERATIONS - ✅ FIXED
// // ═══════════════════════════════════════════════════════════════

// // const createPlan = async (planData: CreatePlanData): Promise<ServiceResponse<string>> => {
// //   try {
// //     console.log('➕ Creating new plan:', planData.plan_name);
    
// //     const userId = requireAuth();
    
// //     // ✅ Convert price to number before validation
// //     const priceValue = typeof planData.price === 'string' 
// //       ? parseFloat(planData.price) 
// //       : planData.price;
    
// //     // ✅ Create clean data object with number price
// //     const cleanPlanData: CreatePlanData = {
// //       ...planData,
// //       price: priceValue
// //     };
    
// //     // Validate
// //     const errors = validatePlanData(cleanPlanData);
// //     if (Object.keys(errors).length > 0) {
// //       const errorMessage = Object.values(errors).join(', ');
// //       console.error('❌ Validation failed:', errors);
// //       return { success: false, error: errorMessage };
// //     }
    
// //     // Check name uniqueness
// //     const nameExists = await checkPlanNameExists(planData.plan_name);
// //     if (nameExists) {
// //       console.error('❌ Plan name already exists');
// //       return { success: false, error: 'Plan name already exists' };
// //     }
    
// //     // ✅ Prepare final plan object with number price
// //     const newPlan = {
// //       ...cleanPlanData,
// //       price: priceValue,  // ✅ Ensure it's a number
// //       created_at: new Date().toISOString(),
// //       created_by: userId,
// //       updated_at: new Date().toISOString(),
// //       is_active: planData.is_active ?? true,
// //       display_order: planData.display_order ?? 999
// //     };
    
// //     const docRef = await addDoc(collection(db, 'plans'), newPlan);
    
// //     console.log('✅ Plan created with ID:', docRef.id);
    
// //     await logAdminAction('plan_created', {
// //       plan_id: docRef.id,
// //       plan_name: planData.plan_name,
// //       price: priceValue,
// //       validity: `${planData.validity_duration} ${planData.validity_unit}`,
// //       features_count: planData.features.length
// //     });
    
// //     return { success: true, data: docRef.id };
    
// //   } catch (error: any) {
// //     console.error('❌ Error creating plan:', error);
// //     return { success: false, error: error.message || 'Failed to create plan' };
// //   }
// // }; 
// // ✅ AFTER - Guaranteed number with validation
// const createPlan = async (planData: CreatePlanData): Promise<ServiceResponse<string>> => {
//   try {
//     console.log('➕ Creating new plan:', planData.plan_name);
    
//     const userId = requireAuth();
    
//     // ✅ Price conversion with proper validation
//     let priceValue: number;
    
//     if (typeof planData.price === 'string') {
//       const parsed = parseFloat(planData.price);
//       if (isNaN(parsed) || parsed < 0) {
//         return { success: false, error: 'Invalid price value' };
//       }
//       priceValue = parsed;
//     } else if (typeof planData.price === 'number') {
//       if (planData.price < 0) {
//         return { success: false, error: 'Price must be positive' };
//       }
//       priceValue = planData.price;
//     } else {
//       return { success: false, error: 'Price is required' };
//     }
    
//     // ✅ Features validation
//     if (!planData.features || planData.features.length < 1) {
//       return { success: false, error: 'At least 1 feature is required' };
//     }
    
//     // ✅ Validate all features have title and description
//     const invalidFeatures = planData.features.filter(
//       f => !f?.title?.trim() || !f?.description?.trim()
//     );
//     if (invalidFeatures.length > 0) {
//       return { success: false, error: 'All features must have title and description' };
//     }
    
//     // ✅ Create clean data object
//     const cleanPlanData: CreatePlanData = {
//       ...planData,
//       price: priceValue
//     };
    
//     // Validate using service
//     const errors = validatePlanData(cleanPlanData);
//     if (Object.keys(errors).length > 0) {
//       const errorMessage = Object.values(errors).join(', ');
//       console.error('❌ Validation failed:', errors);
//       return { success: false, error: errorMessage };
//     }
    
//     // Check name uniqueness
//     const nameExists = await checkPlanNameExists(planData.plan_name);
//     if (nameExists) {
//       console.error('❌ Plan name already exists');
//       return { success: false, error: 'Plan name already exists' };
//     }
    
//     // ✅ Prepare final plan object with guaranteed types
//     const newPlan = {
//       plan_name: cleanPlanData.plan_name.trim(),
//       price: priceValue,  // ✅ Guaranteed number
//       currency: cleanPlanData.currency || 'INR',
//       billing_cycle: cleanPlanData.billing_cycle,
//       validity_duration: cleanPlanData.validity_duration,
//       validity_unit: cleanPlanData.validity_unit,
//       features: cleanPlanData.features,
//       limits: cleanPlanData.limits,
//       is_active: cleanPlanData.is_active ?? true,
//       is_popular: cleanPlanData.is_popular ?? false,
//       display_order: cleanPlanData.display_order ?? 999,
//       stripe_price_id: cleanPlanData.stripe_price_id || null,
//       created_at: new Date().toISOString(),
//       created_by: userId,
//       updated_at: new Date().toISOString()
//     };
    
//     const docRef = await addDoc(collection(db, 'plans'), newPlan);
    
//     console.log('✅ Plan created with ID:', docRef.id);
    
//     await logAdminAction('plan_created', {
//       plan_id: docRef.id,
//       plan_name: planData.plan_name,
//       price: priceValue,
//       validity: `${planData.validity_duration} ${planData.validity_unit}`,
//       features_count: planData.features.length
//     });
    
//     return { success: true, data: docRef.id };
    
//   } catch (error: any) {
//     console.error('❌ Error creating plan:', error);
//     return { success: false, error: error.message || 'Failed to create plan' };
//   }
// };

// const updatePlan = async (
//   planId: string,
//   updates: UpdatePlanData
// ): Promise<ServiceResponse> => {
//   try {
//     console.log('📝 Updating plan:', planId);
    
//     if (!planId?.trim()) {
//       return { success: false, error: 'Plan ID is required' };
//     }
    
//     const userId = requireAuth();
    
//     const existingPlan = await getPlanById(planId);
//     if (!existingPlan) {
//       return { success: false, error: 'Plan not found' };
//     }
    
//     // ✅ Convert price if present
//     const cleanUpdates = { ...updates };
//     if (updates.price !== undefined) {
//       const priceValue = typeof updates.price === 'string' 
//         ? parseFloat(updates.price) 
//         : updates.price;
//       cleanUpdates.price = priceValue;
//     }
    
//     const errors = validatePlanData(cleanUpdates);
//     if (Object.keys(errors).length > 0) {
//       const errorMessage = Object.values(errors).join(', ');
//       console.error('❌ Validation failed:', errors);
//       return { success: false, error: errorMessage };
//     }
    
//     if (updates.plan_name && updates.plan_name !== existingPlan.plan_name) {
//       const nameExists = await checkPlanNameExists(updates.plan_name, planId);
//       if (nameExists) {
//         return { success: false, error: 'Plan name already exists' };
//       }
//     }
    
//     const updateData = {
//       ...cleanUpdates,
//       updated_at: new Date().toISOString(),
//       updated_by: userId
//     };
    
//     await updateDoc(doc(db, 'plans', planId), updateData);
    
//     console.log('✅ Plan updated successfully');
    
//     await logAdminAction('plan_updated', {
//       plan_id: planId,
//       plan_name: existingPlan.plan_name,
//       updates: Object.keys(updates)
//     });
    
//     return { success: true };
    
//   } catch (error: any) {
//     console.error('❌ Error updating plan:', error);
//     return { success: false, error: error.message || 'Failed to update plan' };
//   }
// };

// const deletePlan = async (planId: string): Promise<ServiceResponse> => {
//   try {
//     console.log('🗑️ Deleting plan:', planId);
    
//     if (!planId?.trim()) {
//       return { success: false, error: 'Plan ID is required' };
//     }
    
//     const userId = requireAuth();
    
//     const existingPlan = await getPlanById(planId);
//     if (!existingPlan) {
//       return { success: false, error: 'Plan not found' };
//     }
    
//     let hasActiveSubscriptions = false;
//     try {
//       const subsQuery = query(
//         collection(db, 'subscriptions'),
//         where('plan_id', '==', planId),
//         where('status', '==', 'active')
//       );
//       const subsSnapshot = await getDocs(subsQuery);
//       hasActiveSubscriptions = !subsSnapshot.empty;
//     } catch (error) {
//       console.warn('⚠️ Could not check subscriptions, doing soft delete:', error);
//       hasActiveSubscriptions = true;
//     }
    
//     if (hasActiveSubscriptions) {
//       console.log('⚠️ Plan has active subscriptions - soft deleting');
      
//       await updateDoc(doc(db, 'plans', planId), {
//         is_active: false,
//         deleted_at: new Date().toISOString(),
//         deleted_by: userId,
//         updated_at: new Date().toISOString()
//       });
      
//       console.log('✅ Plan soft deleted (marked as inactive)');
      
//       await logAdminAction('plan_soft_deleted', {
//         plan_id: planId,
//         plan_name: existingPlan.plan_name,
//         reason: 'has_active_subscriptions'
//       });
      
//     } else {
//       await deleteDoc(doc(db, 'plans', planId));
      
//       console.log('✅ Plan permanently deleted');
      
//       await logAdminAction('plan_hard_deleted', {
//         plan_id: planId,
//         plan_name: existingPlan.plan_name
//       });
//     }
    
//     return { success: true };
    
//   } catch (error: any) {
//     console.error('❌ Error deleting plan:', error);
//     return { success: false, error: error.message || 'Failed to delete plan' };
//   }
// };

// const togglePlanStatus = async (
//   planId: string,
//   isActive: boolean
// ): Promise<ServiceResponse> => {
//   try {
//     console.log(`🔄 Toggling plan status to: ${isActive}`);
    
//     if (!planId?.trim()) {
//       return { success: false, error: 'Plan ID is required' };
//     }
    
//     const userId = requireAuth();
    
//     const existingPlan = await getPlanById(planId);
//     if (!existingPlan) {
//       return { success: false, error: 'Plan not found' };
//     }
    
//     await updateDoc(doc(db, 'plans', planId), {
//       is_active: isActive,
//       updated_at: new Date().toISOString(),
//       updated_by: userId
//     });
    
//     console.log('✅ Plan status updated');
    
//     await logAdminAction('plan_status_toggled', {
//       plan_id: planId,
//       plan_name: existingPlan.plan_name,
//       new_status: isActive ? 'active' : 'inactive'
//     });
    
//     return { success: true };
    
//   } catch (error: any) {
//     console.error('❌ Error toggling plan status:', error);
//     return { success: false, error: error.message || 'Failed to update plan status' };
//   }
// };

// const reorderPlans = async (planOrders: { id: string; order: number }[]): Promise<ServiceResponse> => {
//   try {
//     console.log('🔄 Reordering plans...');
    
//     const userId = requireAuth();
    
//     if (!Array.isArray(planOrders) || planOrders.length === 0) {
//       return { success: false, error: 'Invalid plan orders data' };
//     }
    
//     const batch = writeBatch(db);
    
//     planOrders.forEach(({ id, order }) => {
//       const planRef = doc(db, 'plans', id);
//       batch.update(planRef, {
//         display_order: order,
//         updated_at: new Date().toISOString(),
//         updated_by: userId
//       });
//     });
    
//     await batch.commit();
    
//     console.log(`✅ Reordered ${planOrders.length} plans`);
    
//     await logAdminAction('plans_reordered', {
//       count: planOrders.length,
//       plan_ids: planOrders.map(p => p.id)
//     });
    
//     return { success: true };
    
//   } catch (error: any) {
//     console.error('❌ Error reordering plans:', error);
//     return { success: false, error: error.message || 'Failed to reorder plans' };
//   }
// };

// // ═══════════════════════════════════════════════════════════════
// // HELPER FUNCTIONS
// // ═══════════════════════════════════════════════════════════════

// const getPlanByStripePriceId = async (
//   stripePriceId: string
// ): Promise<Plan | null> => {
//   try {
//     if (!stripePriceId?.trim()) {
//       throw new Error('Stripe price ID is required');
//     }
    
//     const allPlans = await getAllPlans();
    
//     const plan = allPlans.find(p => {
//       // @ts-ignore
//       return p.stripe_price_id === stripePriceId;
//     });
    
//     return plan || null;
    
//   } catch (error: any) {
//     console.error('❌ Error fetching plan by Stripe ID:', error);
//     return null;
//   }
// };

// const planHasActiveSubscriptions = async (planId: string): Promise<boolean> => {
//   try {
//     const subsQuery = query(
//       collection(db, 'subscriptions'),
//       where('plan_id', '==', planId),
//       where('status', '==', 'active')
//     );
//     const subsSnapshot = await getDocs(subsQuery);
//     return !subsSnapshot.empty;
//   } catch (error) {
//     console.warn('⚠️ Could not check subscriptions:', error);
//     return false;
//   }
// };

// // ═══════════════════════════════════════════════════════════════
// // EXPORTS
// // ═══════════════════════════════════════════════════════════════

// export {
//   getAllPlans,
//   getActivePlans,
//   getPlanById,
//   getPlanStats,
//   getPlanByStripePriceId,
//   createPlan,
//   updatePlan,
//   deletePlan,
//   togglePlanStatus,
//   reorderPlans,
//   validatePlanData,
//   planHasActiveSubscriptions
// };

// export default {
//   getAllPlans,
//   getActivePlans,
//   getPlanById,
//   getPlanStats,
//   getPlanByStripePriceId,
//   createPlan,
//   updatePlan,
//   deletePlan,
//   togglePlanStatus,
//   reorderPlans,
//   validatePlanData,
//   planHasActiveSubscriptions,
//   convertValidityToDays,
//   getValidityDisplayText
// };

// console.log('✅ Plan Service loaded - v4.0 PRODUCTION (Price Type Fixed • Min 1 Feature • Unlimited Features)');

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
  writeBatch
} from 'firebase/firestore';
import { db, auth } from './firebase';
import type { Plan, CreatePlanData, UpdatePlanData, PlanValidationError } from '../types/plan.types';

// ═══════════════════════════════════════════════════════════════
// INTERFACES
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
// UTILITY FUNCTIONS
// ═══════════════════════════════════════════════════════════════

const sortPlansByOrder = (plans: Plan[]): Plan[] => {
  return plans.sort((a, b) => {
    const orderA = a.display_order ?? 999;
    const orderB = b.display_order ?? 999;
    return orderA - orderB;
  });
};

const requireAuth = (): string => {
  const currentUser = auth.currentUser;
  if (!currentUser) {
    throw new Error('Authentication required. Please login.');
  }
  return currentUser.uid;
};

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

export const convertValidityToDays = (duration: number, unit: string): number => {
  switch (unit) {
    case 'minutes':
      return Math.ceil(duration / (60 * 24));
    case 'hours':
      return Math.ceil(duration / 24);
    case 'days':
      return duration;
    case 'months':
      return duration * 30;
    case 'years':
      return duration * 365;
    default:
      return duration;
  }
};

export const getValidityDisplayText = (duration: number, unit: string): string => {
  if (duration === 1) {
    const singularUnit = unit.replace(/s$/, '');
    return `${duration} ${singularUnit}`;
  }
  return `${duration} ${unit}`;
};

// ═══════════════════════════════════════════════════════════════
// READ OPERATIONS
// ═══════════════════════════════════════════════════════════════

const getAllPlans = async (): Promise<Plan[]> => {
  try {
    console.log('📋 Fetching all plans...');
    
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
    
    const sortedPlans = sortPlansByOrder(plans);
    
    console.log(`✅ Fetched ${sortedPlans.length} plans`);
    return sortedPlans;
    
  } catch (error: any) {
    console.error('❌ Error fetching all plans:', error);
    throw new Error(`Failed to fetch plans: ${error.message}`);
  }
};

const getActivePlans = async (): Promise<Plan[]> => {
  try {
    console.log('📋 Fetching active plans...');
    
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
      
      const sortedPlans = sortPlansByOrder(plans);
      
      console.log(`✅ Fetched ${sortedPlans.length} active plans`);
      return sortedPlans;
      
    } catch (queryError) {
      console.warn('⚠️ Query failed, using fallback method:', queryError);
      
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

const getPlanById = async (planId: string): Promise<Plan | null> => {
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

const getPlanStats = async (): Promise<PlanStats> => {
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
// VALIDATION
// ═══════════════════════════════════════════════════════════════

const validatePlanData = (planData: CreatePlanData | UpdatePlanData): PlanValidationError => {
  const errors: PlanValidationError = {};
  
  if ('plan_name' in planData) {
    if (!planData.plan_name?.trim()) {
      errors.plan_name = 'Plan name is required';
    } else if (planData.plan_name.trim().length < 3) {
      errors.plan_name = 'Plan name must be at least 3 characters';
    } else if (planData.plan_name.trim().length > 50) {
      errors.plan_name = 'Plan name must not exceed 50 characters';
    }
  }
  
  if ('price' in planData) {
    let priceValue: number;
    
    if (typeof planData.price === 'string') {
      priceValue = parseFloat(planData.price);
    } else if (typeof planData.price === 'number') {
      priceValue = planData.price;
    } else {
      errors.price = 'Price is required';
      return errors;
    }
    
    if (isNaN(priceValue)) {
      errors.price = 'Price must be a valid number';
    } else if (priceValue < 0) {
      errors.price = 'Price must be 0 or positive';
    } else if (priceValue > 999999) {
      errors.price = 'Price is too high';
    }
  }
  
  if ('validity_duration' in planData) {
    if (!planData.validity_duration || planData.validity_duration <= 0) {
      errors.validity_duration = 'Validity duration must be greater than 0';
    } else if (planData.validity_duration > 10000) {
      errors.validity_duration = 'Validity duration is too high';
    }
  }
  
  if ('validity_unit' in planData) {
    const validUnits = ['minutes', 'hours', 'days', 'months', 'years'];
    if (!validUnits.includes(planData.validity_unit!)) {
      errors.validity_unit = 'Invalid validity unit';
    }
  }
  
  if ('features' in planData && planData.features) {
    if (!Array.isArray(planData.features)) {
      errors.features = 'Features must be an array';
    } else if (planData.features.length < 1) {
      errors.features = 'At least 1 feature is required';
    } else if (planData.features.length > 100) {
      errors.features = 'Maximum 100 features allowed';
    } else {
      const invalidFeatures = planData.features.filter(
        f => !f?.title?.trim() || !f?.description?.trim()
      );
      if (invalidFeatures.length > 0) {
        errors.features = 'All features must have title and description';
      }
    }
  }
  
  if ('limits' in planData && planData.limits) {
    if (typeof planData.limits !== 'object') {
      errors.limits = 'Limits must be an object';
    } else {
      if (planData.limits.max_tiles !== undefined && planData.limits.max_tiles < -1) {
        errors.limits = 'Invalid max_tiles value (use -1 for unlimited)';
      }
      if (planData.limits.max_qr_codes !== undefined && planData.limits.max_qr_codes < -1) {
        errors.limits = 'Invalid max_qr_codes value (use -1 for unlimited)';
      }
    }
  }
  
  if ('display_order' in planData && planData.display_order !== undefined) {
    if (typeof planData.display_order !== 'number') {
      errors.display_order = 'Display order must be a number';
    } else if (planData.display_order < 0) {
      errors.display_order = 'Display order must be positive';
    }
  }
  
  if ('stripe_price_id' in planData && planData.stripe_price_id) {
    if (typeof planData.stripe_price_id !== 'string') {
      errors.stripe_price_id = 'Stripe price ID must be a string';
    } else if (!planData.stripe_price_id.startsWith('price_')) {
      errors.stripe_price_id = 'Invalid Stripe price ID format';
    }
  }
  
  return errors;
};

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
// WRITE OPERATIONS
// ═══════════════════════════════════════════════════════════════

const createPlan = async (planData: CreatePlanData): Promise<ServiceResponse<string>> => {
  try {
    console.log('➕ Creating new plan:', planData.plan_name);
    
    const userId = requireAuth();
    
    let priceValue: number;
    
    if (typeof planData.price === 'string') {
      const parsed = parseFloat(planData.price);
      if (isNaN(parsed) || parsed < 0) {
        return { success: false, error: 'Invalid price value' };
      }
      priceValue = parsed;
    } else if (typeof planData.price === 'number') {
      if (planData.price < 0) {
        return { success: false, error: 'Price must be positive' };
      }
      priceValue = planData.price;
    } else {
      return { success: false, error: 'Price is required' };
    }
    
    if (!planData.features || planData.features.length < 1) {
      return { success: false, error: 'At least 1 feature is required' };
    }
    
    const invalidFeatures = planData.features.filter(
      f => !f?.title?.trim() || !f?.description?.trim()
    );
    if (invalidFeatures.length > 0) {
      return { success: false, error: 'All features must have title and description' };
    }
    
    const cleanPlanData: CreatePlanData = {
      ...planData,
      price: priceValue
    };
    
    const errors = validatePlanData(cleanPlanData);
    if (Object.keys(errors).length > 0) {
      const errorMessage = Object.values(errors).join(', ');
      console.error('❌ Validation failed:', errors);
      return { success: false, error: errorMessage };
    }
    
    const nameExists = await checkPlanNameExists(planData.plan_name);
    if (nameExists) {
      console.error('❌ Plan name already exists');
      return { success: false, error: 'Plan name already exists' };
    }
    
    const newPlan = {
      plan_name: cleanPlanData.plan_name.trim(),
      price: priceValue,
      currency: cleanPlanData.currency || 'INR',
      billing_cycle: cleanPlanData.billing_cycle,
      validity_duration: cleanPlanData.validity_duration,
      validity_unit: cleanPlanData.validity_unit,
      features: cleanPlanData.features,
      limits: cleanPlanData.limits,
      is_active: cleanPlanData.is_active ?? true,
      is_popular: cleanPlanData.is_popular ?? false,
      display_order: cleanPlanData.display_order ?? 999,
      stripe_price_id: cleanPlanData.stripe_price_id || null,
      created_at: new Date().toISOString(),
      created_by: userId,
      updated_at: new Date().toISOString()
    };
    
    const docRef = await addDoc(collection(db, 'plans'), newPlan);
    
    console.log('✅ Plan created with ID:', docRef.id);
    
    await logAdminAction('plan_created', {
      plan_id: docRef.id,
      plan_name: planData.plan_name,
      price: priceValue,
      validity: `${planData.validity_duration} ${planData.validity_unit}`,
      features_count: planData.features.length
    });
    
    return { success: true, data: docRef.id };
    
  } catch (error: any) {
    console.error('❌ Error creating plan:', error);
    return { success: false, error: error.message || 'Failed to create plan' };
  }
};

const updatePlan = async (
  planId: string,
  updates: UpdatePlanData
): Promise<ServiceResponse> => {
  try {
    console.log('📝 Updating plan:', planId);
    
    if (!planId?.trim()) {
      return { success: false, error: 'Plan ID is required' };
    }
    
    const userId = requireAuth();
    
    const existingPlan = await getPlanById(planId);
    if (!existingPlan) {
      return { success: false, error: 'Plan not found' };
    }
    
    const cleanUpdates = { ...updates };
    if (updates.price !== undefined) {
      const priceValue = typeof updates.price === 'string' 
        ? parseFloat(updates.price) 
        : updates.price;
      cleanUpdates.price = priceValue;
    }
    
    const errors = validatePlanData(cleanUpdates);
    if (Object.keys(errors).length > 0) {
      const errorMessage = Object.values(errors).join(', ');
      console.error('❌ Validation failed:', errors);
      return { success: false, error: errorMessage };
    }
    
    if (updates.plan_name && updates.plan_name !== existingPlan.plan_name) {
      const nameExists = await checkPlanNameExists(updates.plan_name, planId);
      if (nameExists) {
        return { success: false, error: 'Plan name already exists' };
      }
    }
    
    const updateData = {
      ...cleanUpdates,
      updated_at: new Date().toISOString(),
      updated_by: userId
    };
    
    await updateDoc(doc(db, 'plans', planId), updateData);
    
    console.log('✅ Plan updated successfully');
    
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

// ═══════════════════════════════════════════════════════════════
// ✅ HARD DELETE ONLY (Production Ready)
// ═══════════════════════════════════════════════════════════════

const deletePlan = async (planId: string): Promise<ServiceResponse> => {
  try {
    console.log('🗑️ Deleting plan:', planId);
    
    if (!planId?.trim()) {
      return { success: false, error: 'Plan ID is required' };
    }
    
    const userId = requireAuth();
    
    const existingPlan = await getPlanById(planId);
    if (!existingPlan) {
      return { success: false, error: 'Plan not found' };
    }
    
    // Check for active subscriptions (for logging only)
    let activeSubscriptionCount = 0;
    try {
      const subsQuery = query(
        collection(db, 'subscriptions'),
        where('plan_id', '==', planId),
        where('status', '==', 'active')
      );
      const subsSnapshot = await getDocs(subsQuery);
      activeSubscriptionCount = subsSnapshot.size;
      
      console.log(`📊 Found ${activeSubscriptionCount} active subscriptions`);
      
    } catch (error) {
      console.warn('⚠️ Could not check subscriptions:', error);
    }
    
    // HARD DELETE - Always delete permanently
    await deleteDoc(doc(db, 'plans', planId));
    
    console.log('✅ Plan permanently deleted from database');
    
    await logAdminAction('plan_permanently_deleted', {
      plan_id: planId,
      plan_name: existingPlan.plan_name,
      price: existingPlan.price,
      active_subscriptions_count: activeSubscriptionCount,
      admin_id: userId,
      warning: activeSubscriptionCount > 0 ? 'Plan had active subscriptions' : 'No active subscriptions'
    });
    
    return { 
      success: true,
      data: activeSubscriptionCount > 0 
        ? `Plan deleted. ${activeSubscriptionCount} subscription(s) were affected.`
        : 'Plan deleted successfully.'
    };
    
  } catch (error: any) {
    console.error('❌ Error deleting plan:', error);
    
    let errorMessage = 'Failed to delete plan';
    
    if (error.code === 'permission-denied') {
      errorMessage = 'Permission denied. Please check your admin access.';
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    return { success: false, error: errorMessage };
  }
};

const togglePlanStatus = async (
  planId: string,
  isActive: boolean
): Promise<ServiceResponse> => {
  try {
    console.log(`🔄 Toggling plan status to: ${isActive}`);
    
    if (!planId?.trim()) {
      return { success: false, error: 'Plan ID is required' };
    }
    
    const userId = requireAuth();
    
    const existingPlan = await getPlanById(planId);
    if (!existingPlan) {
      return { success: false, error: 'Plan not found' };
    }
    
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

const reorderPlans = async (planOrders: { id: string; order: number }[]): Promise<ServiceResponse> => {
  try {
    console.log('🔄 Reordering plans...');
    
    const userId = requireAuth();
    
    if (!Array.isArray(planOrders) || planOrders.length === 0) {
      return { success: false, error: 'Invalid plan orders data' };
    }
    
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
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════

const getPlanByStripePriceId = async (
  stripePriceId: string
): Promise<Plan | null> => {
  try {
    if (!stripePriceId?.trim()) {
      throw new Error('Stripe price ID is required');
    }
    
    const allPlans = await getAllPlans();
    
    const plan = allPlans.find(p => {
      // @ts-ignore
      return p.stripe_price_id === stripePriceId;
    });
    
    return plan || null;
    
  } catch (error: any) {
    console.error('❌ Error fetching plan by Stripe ID:', error);
    return null;
  }
};

const planHasActiveSubscriptions = async (planId: string): Promise<boolean> => {
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
// EXPORTS
// ═══════════════════════════════════════════════════════════════

export {
  getAllPlans,
  getActivePlans,
  getPlanById,
  getPlanStats,
  getPlanByStripePriceId,
  createPlan,
  updatePlan,
  deletePlan,
  togglePlanStatus,
  reorderPlans,
  validatePlanData,
  planHasActiveSubscriptions
};

export default {
  getAllPlans,
  getActivePlans,
  getPlanById,
  getPlanStats,
  getPlanByStripePriceId,
  createPlan,
  updatePlan,
  deletePlan,
  togglePlanStatus,
  reorderPlans,
  validatePlanData,
  planHasActiveSubscriptions,
  convertValidityToDays,
  getValidityDisplayText
};

console.log('✅ Plan Service - PRODUCTION v5.0 (Hard Delete Only • All Features Preserved)');