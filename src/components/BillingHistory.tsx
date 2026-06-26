
// import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
// import {
//   Search, Filter, Eye, X, Package, Calendar, CreditCard, Users, RefreshCw,
//   ChevronLeft, ChevronRight, Clock, CheckCircle, AlertCircle, Mail, Phone,
//   IndianRupee, QrCode, Loader, FileSpreadsheet, TrendingUp, Award, Repeat,
//   DollarSign, BarChart3
// } from 'lucide-react';
// import { collection, query, getDocs, orderBy, limit, where, onSnapshot } from 'firebase/firestore';
// import { db } from '../lib/firebase';
// import { shouldForceRefresh } from '../lib/subscriptionService';
// import { eventBus } from '../utils/eventBus';

// // ═══════════════════════════════════════════════════════════════
// // ✅ INTERFACES
// // ═══════════════════════════════════════════════════════════════

// interface EnrichedSubscription {
//   id: string;
//   seller_id: string;
//   plan_id: string;
//   plan_name: string;
//   status: string;
//   start_date: string;
//   end_date: string;
//   current_scan_count: number;
//   last_payment_id?: string;
//   created_at: string;
//   seller_business_name: string;
//   seller_owner_name: string;
//   seller_email: string;
//   seller_phone?: string;
//   plan_price: number;
//   plan_currency: string;
//   plan_billing_cycle: string;
//   plan_validity_duration: number;
//   plan_validity_unit: string;
//   plan_scan_limit: number;
//   payment_amount?: number;
//   payment_id?: string;
//   transaction_id?: string;
//   payment_date?: string;
//   days_remaining: number;
//   status_color: string;
//   status_badge: string;
//   scan_percentage: number;
//   is_expiring_soon: boolean;
//   is_expired: boolean;
// }

// interface Statistics {
//   totalActive: number;
//   totalRevenue: number;
//   expiringSoon: number;
//   expiredThisMonth: number;
//   renewedThisMonth: number;
// }

// interface SellerAnalytics {
//   totalPlans: number;
//   totalRevenue: number;
//   mostPurchasedPlan: {
//     name: string;
//     count: number;
//   };
//   mostRenewedPlan: {
//     name: string;
//     count: number;
//   };
//   planBreakdown: {
//     planName: string;
//     purchaseCount: number;
//     renewCount: number;
//     totalSpent: number;
//   }[];
//   activeSubscriptions: number;
//   expiredSubscriptions: number;
//   firstPurchaseDate: string;
//   lastPurchaseDate: string;
// }

// type FilterStatus = 'all' | 'active' | 'expired' | 'expiring_soon' | 'non_active';
// type SortField = 'purchase_date' | 'expiry_date' | 'seller_name' | 'price';

// // ═══════════════════════════════════════════════════════════════
// // ✅ MAIN COMPONENT
// // ═══════════════════════════════════════════════════════════════

// export const BillingHistory: React.FC = () => {
//   const [subscriptions, setSubscriptions] = useState<EnrichedSubscription[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
  
//   const [searchTerm, setSearchTerm] = useState('');
//   const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
//   const [filterPlan, setFilterPlan] = useState<string>('all');
//   const [sortField, setSortField] = useState<SortField>('purchase_date');
  
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage] = useState(20);
  
//   const [selectedSubscription, setSelectedSubscription] = useState<EnrichedSubscription | null>(null);
//   const [showDetailsModal, setShowDetailsModal] = useState(false);
//   const [sellerAnalytics, setSellerAnalytics] = useState<SellerAnalytics | null>(null);
//   const [loadingAnalytics, setLoadingAnalytics] = useState(false);
  
//   const [statistics, setStatistics] = useState<Statistics>({
//     totalActive: 0,
//     totalRevenue: 0,
//     expiringSoon: 0,
//     expiredThisMonth: 0,
//     renewedThisMonth: 0
//   });

//   const loadingRef = useRef(false);
//   const loadTimeoutRef = useRef<NodeJS.Timeout>();

//   // ═══════════════════════════════════════════════════════════════
//   // UTILITY FUNCTIONS
//   // ═══════════════════════════════════════════════════════════════

//   const calculateDaysRemaining = useCallback((endDate: string): number => {
//     if (!endDate || endDate === 'N/A') return 0;
//     const end = new Date(endDate);
//     const now = new Date();
//     const diffTime = end.getTime() - now.getTime();
//     const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
//     return diffDays > 0 ? diffDays : 0;
//   }, []);

//   const getStatusInfo = useCallback((subscription: EnrichedSubscription): {
//     color: string;
//     badge: string;
//     isExpiringSoon: boolean;
//     isExpired: boolean;
//   } => {
//     const daysRemaining = subscription.days_remaining;

//     if (daysRemaining === 0 || (subscription.end_date && new Date(subscription.end_date) < new Date())) {
//       return {
//         color: 'bg-red-100 text-red-800 border-red-300',
//         badge: 'Expired',
//         isExpiringSoon: false,
//         isExpired: true
//       };
//     }

//     if (daysRemaining <= 3) {
//       return {
//         color: 'bg-orange-100 text-orange-800 border-orange-300',
//         badge: 'Expiring Very Soon',
//         isExpiringSoon: true,
//         isExpired: false
//       };
//     }

//     if (daysRemaining <= 7) {
//       return {
//         color: 'bg-yellow-100 text-yellow-800 border-yellow-300',
//         badge: 'Expiring Soon',
//         isExpiringSoon: true,
//         isExpired: false
//       };
//     }

//     return {
//       color: 'bg-green-100 text-green-800 border-green-300',
//       badge: 'Active',
//       isExpiringSoon: false,
//       isExpired: false
//     };
//   }, []);

//   const calculateScanPercentage = useCallback((used: number, total: number): number => {
//     if (total === -1) return 0;
//     if (total === 0) return 0;
//     return Math.min(100, Math.round((used / total) * 100));
//   }, []);

//   const calculateSellerAnalytics = useCallback((sellerId: string): SellerAnalytics => {
//     const sellerSubscriptions = subscriptions.filter(sub => sub.seller_id === sellerId);

//     if (sellerSubscriptions.length === 0) {
//       return {
//         totalPlans: 0,
//         totalRevenue: 0,
//         mostPurchasedPlan: { name: 'N/A', count: 0 },
//         mostRenewedPlan: { name: 'N/A', count: 0 },
//         planBreakdown: [],
//         activeSubscriptions: 0,
//         expiredSubscriptions: 0,
//         firstPurchaseDate: 'N/A',
//         lastPurchaseDate: 'N/A'
//       };
//     }

//     const totalRevenue = sellerSubscriptions.reduce((sum, sub) => {
//       return sum + (sub.payment_amount || sub.plan_price || 0);
//     }, 0);

//     const planMap = new Map<string, { purchaseCount: number; renewCount: number; totalSpent: number; }>();

//     sellerSubscriptions.forEach(sub => {
//       const existing = planMap.get(sub.plan_name) || { purchaseCount: 0, renewCount: 0, totalSpent: 0 };
//       existing.purchaseCount += 1;
//       existing.totalSpent += (sub.payment_amount || sub.plan_price || 0);
//       if (existing.purchaseCount > 1) {
//         existing.renewCount += 1;
//       }
//       planMap.set(sub.plan_name, existing);
//     });

//     const planBreakdown = Array.from(planMap.entries()).map(([planName, data]) => ({
//       planName,
//       purchaseCount: data.purchaseCount,
//       renewCount: data.renewCount,
//       totalSpent: data.totalSpent
//     })).sort((a, b) => b.totalSpent - a.totalSpent);

//     let mostPurchasedPlan = { name: 'N/A', count: 0 };
//     planBreakdown.forEach(plan => {
//       if (plan.purchaseCount > mostPurchasedPlan.count) {
//         mostPurchasedPlan = { name: plan.planName, count: plan.purchaseCount };
//       }
//     });

//     let mostRenewedPlan = { name: 'N/A', count: 0 };
//     planBreakdown.forEach(plan => {
//       if (plan.renewCount > mostRenewedPlan.count) {
//         mostRenewedPlan = { name: plan.planName, count: plan.renewCount };
//       }
//     });

//     const activeSubscriptions = sellerSubscriptions.filter(sub => 
//       !sub.is_expired && sub.status !== 'non_active'
//     ).length;

//     const expiredSubscriptions = sellerSubscriptions.filter(sub => 
//       sub.is_expired || sub.status === 'non_active'
//     ).length;

//     const sortedByDate = [...sellerSubscriptions].sort((a, b) => {
//       const timeA = a.created_at ? new Date(a.created_at).getTime() : 0;
//       const timeB = b.created_at ? new Date(b.created_at).getTime() : 0;
//       return timeA - timeB;
//     });

//     const firstPurchaseDate = sortedByDate[0]?.created_at || 'N/A';
//     const lastPurchaseDate = sortedByDate[sortedByDate.length - 1]?.created_at || 'N/A';

//     return {
//       totalPlans: sellerSubscriptions.length,
//       totalRevenue,
//       mostPurchasedPlan,
//       mostRenewedPlan,
//       planBreakdown,
//       activeSubscriptions,
//       expiredSubscriptions,
//       firstPurchaseDate,
//       lastPurchaseDate
//     };
//   }, [subscriptions]);

//   const parseFirebaseDate = useCallback((dateVal: any): string => {
//     if (!dateVal) return '';
//     if (typeof dateVal.toDate === 'function') return dateVal.toDate().toISOString();
//     if (typeof dateVal === 'object' && dateVal !== null && 'seconds' in dateVal) {
//       return new Date(dateVal.seconds * 1000).toISOString();
//     }
//     if (typeof dateVal === 'number') {
//       const ms = dateVal < 10000000000 ? dateVal * 1000 : dateVal;
//       return new Date(ms).toISOString();
//     }
//     if (typeof dateVal === 'string') {
//       const d = new Date(dateVal);
//       if (!isNaN(d.getTime())) return d.toISOString();
//     }
//     return '';
//   }, []);

//   // ═══════════════════════════════════════════════════════════════
//   // ✅ DATA LOADING & AUTO CLEANUP LOGIC
//   // ═══════════════════════════════════════════════════════════════

//   const loadData = useCallback(async () => {
//     if (loadTimeoutRef.current) clearTimeout(loadTimeoutRef.current);

//     if (loadingRef.current) {
//       loadTimeoutRef.current = setTimeout(() => loadData(), 1000);
//       return;
//     }

//     loadingRef.current = true;

//     try {
//       setLoading(true);
//       setError(null);
      
//       const forceRefresh = shouldForceRefresh();
      
//       const subscriptionsQuery = query(
//         collection(db, 'subscriptions'),
//         orderBy('created_at', 'desc'),
//         limit(500)
//       );

//       const subscriptionsSnapshot = await getDocs(subscriptionsQuery);

//       if (subscriptionsSnapshot.metadata.fromCache && forceRefresh) {
//         setTimeout(() => {
//           loadingRef.current = false;
//           loadData();
//         }, 2000);
//         return;
//       }

//       if (subscriptionsSnapshot.empty) {
//         setSubscriptions([]);
//         setLoading(false);
//         loadingRef.current = false;
//         return;
//       }

//       if (!subscriptionsSnapshot.metadata.fromCache) {
//         sessionStorage.removeItem('force_firestore_refresh');
//       }

//       const sellerIds = new Set<string>();
//       const planIds = new Set<string>();
//       const paymentIds = new Set<string>();

//       subscriptionsSnapshot.docs.forEach(doc => {
//         const data = doc.data();
//         if (data.seller_id) sellerIds.add(data.seller_id);
//         if (data.plan_id) planIds.add(data.plan_id);
//         if (data.last_payment_id) paymentIds.add(data.last_payment_id);
//       });

//       const sellersMap = new Map<string, any>();
//       const sellerIdsArray = Array.from(sellerIds);
//       for (let i = 0; i < sellerIdsArray.length; i += 10) {
//         const batch = sellerIdsArray.slice(i, i + 10);
//         const sellersQuery = query(collection(db, 'sellers'), where('user_id', 'in', batch));
//         const sellersSnapshot = await getDocs(sellersQuery);
//         sellersSnapshot.docs.forEach(doc => sellersMap.set(doc.data().user_id, doc.data()));
//       }

//       const plansMap = new Map<string, any>();
//       const planIdsArray = Array.from(planIds);
//       for (let i = 0; i < planIdsArray.length; i += 10) {
//         const batch = planIdsArray.slice(i, i + 10);
//         const plansQuery = query(collection(db, 'plans'), where('__name__', 'in', batch));
//         const plansSnapshot = await getDocs(plansQuery);
//         plansSnapshot.docs.forEach(doc => plansMap.set(doc.id, doc.data()));
//       }

//       const paymentsMap = new Map<string, any>();
//       const paymentIdsArray = Array.from(paymentIds).filter(id => id);
//       for (let i = 0; i < paymentIdsArray.length; i += 10) {
//         const batch = paymentIdsArray.slice(i, i + 10);
//         if (batch.length === 0) continue;
//         const paymentsQuery = query(collection(db, 'payments'), where('__name__', 'in', batch));
//         const paymentsSnapshot = await getDocs(paymentsQuery);
//         paymentsSnapshot.docs.forEach(doc => paymentsMap.set(doc.id, doc.data()));
//       }

//       // Step 1: Map all raw data
//       let rawSubscriptions: EnrichedSubscription[] = subscriptionsSnapshot.docs.map(doc => {
//         const subData = doc.data();
//         const seller = sellersMap.get(subData.seller_id) || {};
//         const plan = plansMap.get(subData.plan_id) || {};
//         const payment = paymentsMap.get(subData.last_payment_id) || {};

//         const safeEndDate = parseFirebaseDate(subData.end_date);
//         const safeStartDate = parseFirebaseDate(subData.start_date);
//         const safeCreatedAt = parseFirebaseDate(subData.created_at || subData.createdAt); 
//         const safePaymentDate = parseFirebaseDate(payment.created_at);

//         const daysRemaining = calculateDaysRemaining(safeEndDate);
//         const statusInfo = getStatusInfo({
//           ...subData,
//           end_date: safeEndDate,
//           days_remaining: daysRemaining,
//         } as EnrichedSubscription);

//         const scanLimit = plan.limits?.max_scans ?? -1;
//         const scanPercentage = calculateScanPercentage(subData.current_scan_count || 0, scanLimit);

//         return {
//           id: doc.id,
//           seller_id: subData.seller_id || '',
//           plan_id: subData.plan_id || '',
//           plan_name: subData.plan_name || plan.plan_name || 'Unknown',
//           status: subData.status || 'active',
//           start_date: safeStartDate,
//           end_date: safeEndDate,
//           current_scan_count: subData.current_scan_count || 0,
//           last_payment_id: subData.last_payment_id,
//           created_at: safeCreatedAt,
//           seller_business_name: seller.business_name || 'Unknown Business',
//           seller_owner_name: seller.owner_name || 'Unknown Owner',
//           seller_email: seller.email || 'N/A',
//           seller_phone: seller.phone || undefined,
//           plan_price: plan.price || 0,
//           plan_currency: plan.currency || 'INR',
//           plan_billing_cycle: plan.billing_cycle || 'monthly',
//           plan_validity_duration: plan.validity_duration || 30,
//           plan_validity_unit: plan.validity_unit || 'days',
//           plan_scan_limit: scanLimit,
//           payment_amount: payment.amount || plan.price || 0,
//           payment_id: payment.razorpay_payment_id,
//           transaction_id: payment.transaction_id,
//           payment_date: safePaymentDate,
//           days_remaining: daysRemaining,
//           status_color: statusInfo.color,
//           status_badge: statusInfo.badge,
//           scan_percentage: scanPercentage,
//           is_expiring_soon: statusInfo.isExpiringSoon,
//           is_expired: statusInfo.isExpired
//         };
//       });

//       // 🚨 Step 2: NEW LOGIC - Differentiate Current Active vs Non-Active History 
      
//       // Sort by creation date (Newest First)
//       rawSubscriptions.sort((a, b) => {
//         const timeA = a.created_at ? new Date(a.created_at).getTime() : 0;
//         const timeB = b.created_at ? new Date(b.created_at).getTime() : 0;
//         return timeB - timeA;
//       });

//       const processedSellers = new Set<string>();

//       const enrichedSubscriptions = rawSubscriptions.map(sub => {
//         // If we haven't seen this seller yet, this is their LATEST plan.
//         if (!processedSellers.has(sub.seller_id)) {
//           processedSellers.add(sub.seller_id);
//           return sub; // Retains actual status (Active, Expiring Soon, Expired)
//         }

//         // ⚠️ If seller already exists in our Set, this is an older plan!
//         // Explicitly mark it as a "Non-Active Plan"
//         return {
//           ...sub,
//           status: 'non_active',
//           status_badge: 'Non-Active Plan',
//           status_color: 'bg-gray-100 text-gray-500 border-gray-300', // Greyed out look
//           is_expired: true, // Treat as expired to keep active counters correct
//           is_expiring_soon: false
//         };
//       });

//       setSubscriptions(enrichedSubscriptions);
//       calculateStatistics(enrichedSubscriptions);

//     } catch (error: any) {
//       console.error('❌ Error loading billing history:', error);
//       setError(`Failed to load data: ${error.message}`);
//     } finally {
//       setLoading(false);
//       loadingRef.current = false;
//     }
//   }, [calculateDaysRemaining, getStatusInfo, calculateScanPercentage, parseFirebaseDate]);

//   // ✅ ENHANCED STATISTICS LOGIC
//   const calculateStatistics = useCallback((subs: EnrichedSubscription[]) => {
//     const now = new Date();
//     const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

//     // Get ALL active subscriptions (Excluding Non-Active history plans)
//     const trulyActiveSubs = subs.filter(s => 
//       s.status !== 'non_active' && !s.is_expired
//     );
    
//     // Revenue from ALL subscriptions (History + Current)
//     const allTimeRevenue = subs
//       .map(s => s.payment_amount || s.plan_price || 0)
//       .reduce((sum, amount) => sum + amount, 0);
    
//     const stats: Statistics = {
//       totalActive: trulyActiveSubs.length,
//       totalRevenue: allTimeRevenue,
//       expiringSoon: trulyActiveSubs.filter(s => s.is_expiring_soon).length,
//       expiredThisMonth: subs.filter(s => {
//         if (s.status === 'non_active') return false; // Ignore old history plans
//         if (!s.end_date) return false;
//         const endDate = new Date(s.end_date);
//         return endDate >= monthStart && endDate <= now && s.is_expired;
//       }).length,
//       renewedThisMonth: subs.filter(s => {
//         if (!s.created_at) return false;
//         const createdDate = new Date(s.created_at);
//         return createdDate >= monthStart;
//       }).length
//     };

//     setStatistics(stats);
//   }, []);

//   const handleViewDetails = useCallback((subscription: EnrichedSubscription) => {
//     setSelectedSubscription(subscription);
//     setShowDetailsModal(true);
//     setLoadingAnalytics(true);

//     setTimeout(() => {
//       const analytics = calculateSellerAnalytics(subscription.seller_id);
//       setSellerAnalytics(analytics);
//       setLoadingAnalytics(false);
//     }, 300);
//   }, [calculateSellerAnalytics]);

//   useEffect(() => {
//     loadData();

//     const handleSubscriptionUpdate = (data: any) => {
//       loadData();
//     };

//     eventBus.on('SUBSCRIPTION_UPDATED', handleSubscriptionUpdate);

//     const subscriptionsQuery = query(
//       collection(db, 'subscriptions'),
//       orderBy('created_at', 'desc'),
//       limit(500)
//     );

//     const unsubscribe = onSnapshot(
//       subscriptionsQuery,
//       (snapshot) => {
//         if (!snapshot.empty) {
//           loadData();
//         }
//       },
//       (error) => console.error('Real-time listener error:', error)
//     );

//     return () => {
//       unsubscribe();
//       eventBus.off('SUBSCRIPTION_UPDATED', handleSubscriptionUpdate);
//       if (loadTimeoutRef.current) clearTimeout(loadTimeoutRef.current);
//     };
//   }, [loadData]);

//   const filteredAndSortedSubscriptions = useMemo(() => {
//     let filtered = [...subscriptions]; // Keep EVERYTHING initially, including non_active history

//     if (searchTerm.trim()) {
//       const term = searchTerm.toLowerCase();
//       filtered = filtered.filter(sub =>
//         sub.seller_business_name.toLowerCase().includes(term) ||
//         sub.seller_owner_name.toLowerCase().includes(term) ||
//         sub.seller_email.toLowerCase().includes(term) ||
//         sub.plan_name.toLowerCase().includes(term) ||
//         sub.transaction_id?.toLowerCase().includes(term) ||
//         sub.payment_id?.toLowerCase().includes(term)
//       );
//     }

//     if (filterStatus !== 'all') {
//       if (filterStatus === 'active') {
//         filtered = filtered.filter(s => !s.is_expired && s.status !== 'non_active');
//       } else if (filterStatus === 'expired') {
//         filtered = filtered.filter(s => s.status_badge === 'Expired');
//       } else if (filterStatus === 'expiring_soon') {
//         filtered = filtered.filter(s => s.is_expiring_soon && s.status !== 'non_active');
//       } else if (filterStatus === 'non_active') {
//         filtered = filtered.filter(s => s.status === 'non_active');
//       }
//     }

//     if (filterPlan !== 'all') {
//       filtered = filtered.filter(s => s.plan_name === filterPlan);
//     }

//     filtered.sort((a, b) => {
//       let compareA: any;
//       let compareB: any;

//       switch (sortField) {
//         case 'purchase_date':
//           compareA = a.created_at ? new Date(a.created_at).getTime() : 0;
//           compareB = b.created_at ? new Date(b.created_at).getTime() : 0;
//           break;
//         case 'expiry_date':
//           compareA = a.end_date ? new Date(a.end_date).getTime() : 0;
//           compareB = b.end_date ? new Date(b.end_date).getTime() : 0;
//           break;
//         case 'seller_name':
//           compareA = a.seller_business_name.toLowerCase();
//           compareB = b.seller_business_name.toLowerCase();
//           break;
//         case 'price':
//           compareA = a.plan_price;
//           compareB = b.plan_price;
//           break;
//         default:
//           return 0;
//       }
//       return compareA < compareB ? 1 : -1;
//     });

//     return filtered;
//   }, [subscriptions, searchTerm, filterStatus, filterPlan, sortField]);

//   const totalPages = Math.ceil(filteredAndSortedSubscriptions.length / itemsPerPage);
//   const startIndex = (currentPage - 1) * itemsPerPage;
//   const endIndex = startIndex + itemsPerPage;
//   const currentItems = filteredAndSortedSubscriptions.slice(startIndex, endIndex);

//   const goToPage = useCallback((page: number) => {
//     setCurrentPage(page);
//     window.scrollTo({ top: 0, behavior: 'smooth' });
//   }, []);

//   const getPageNumbers = useCallback(() => {
//     const pages: (number | string)[] = [];
//     if (totalPages <= 7) {
//       for (let i = 1; i <= totalPages; i++) pages.push(i);
//     } else {
//       pages.push(1);
//       if (currentPage > 3) pages.push('...');
//       for (let i = Math.max(2, currentPage - 1); i <= Math.min(currentPage + 1, totalPages - 1); i++) {
//         pages.push(i);
//       }
//       if (currentPage < totalPages - 2) pages.push('...');
//       pages.push(totalPages);
//     }
//     return pages;
//   }, [currentPage, totalPages]);

//   useEffect(() => {
//     setCurrentPage(1);
//   }, [searchTerm, filterStatus, filterPlan]);

//   const formatDate = useCallback((dateString: string): string => {
//     if (!dateString || dateString === 'N/A') return 'N/A';
//     return new Date(dateString).toLocaleDateString('en-IN', {
//       day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
//     });
//   }, []);

//   const formatCurrency = useCallback((amount: number): string => {
//     return `₹${amount.toLocaleString('en-IN')}`;
//   }, []);

//   const getUniquePlans = useCallback((): string[] => {
//     const plans = new Set(subscriptions.map(s => s.plan_name));
//     return Array.from(plans).sort();
//   }, [subscriptions]);

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center py-20">
//         <div className="text-center">
//           <Loader className="w-20 h-20 text-purple-600 animate-spin mx-auto mb-4" />
//           <p className="text-xl text-gray-600 font-medium">Loading billing history...</p>
//           <p className="text-base text-gray-500 mt-2">Fetching subscription data</p>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="bg-red-50 border-2 border-red-200 rounded-xl p-8">
//         <div className="flex flex-col items-center text-center gap-4">
//           <div className="p-3 bg-red-100 rounded-full">
//             <AlertCircle className="w-12 h-12 text-red-600" />
//           </div>
//           <div>
//             <h3 className="text-2xl font-bold text-red-800 mb-2">Failed to Load Data</h3>
//             <p className="text-lg text-red-700 mb-4">{error}</p>
//           </div>
//           <button
//             onClick={loadData}
//             className="flex items-center gap-2 px-8 py-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium text-lg"
//           >
//             <RefreshCw className="w-6 h-6" />
//             Retry
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       {/* HEADER */}
//       <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl p-8 text-white shadow-lg">
//         <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
//           <div>
//             <h2 className="text-3xl lg:text-4xl font-bold mb-2 flex items-center gap-3">
//               <CreditCard className="w-9 h-9 lg:w-10 lg:h-10" />
//               Billing History
//             </h2>
//             <p className="text-purple-100 text-lg lg:text-xl">
//               Complete subscription overview for all sellers
//             </p>
//           </div>
//           <button
//             onClick={loadData}
//             className="flex items-center gap-3 px-6 py-3.5 bg-white/20 backdrop-blur-md border border-white/30 rounded-lg hover:bg-white/30 transition-all text-lg font-medium shadow-md hover:shadow-lg"
//           >
//             <RefreshCw className="w-6 h-6" />
//             Refresh
//           </button>
//         </div>
//       </div>

//       {/* STATISTICS CARDS */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
//         <div className="bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
//           <div className="flex items-center gap-3 mb-3">
//             <div className="p-3 bg-green-200 rounded-lg">
//               <CheckCircle className="w-7 h-7 text-green-700" />
//             </div>
//             <span className="text-base font-bold text-green-700">Total Active</span>
//           </div>
//           <p className="text-4xl lg:text-5xl font-bold text-green-900 mb-1">{statistics.totalActive}</p>
//           <p className="text-base text-green-600">Current Subscriptions</p>
//         </div>

//         <div className="bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
//           <div className="flex items-center gap-3 mb-3">
//             <div className="p-3 bg-purple-200 rounded-lg">
//               <IndianRupee className="w-7 h-7 text-purple-700" />
//             </div>
//             <span className="text-base font-bold text-purple-700">Total Revenue</span>
//           </div>
//           <p className="text-3xl lg:text-4xl font-bold text-purple-900 mb-1">
//             ₹{statistics.totalRevenue.toLocaleString('en-IN')}
//           </p>
//           <p className="text-base text-purple-600">All Time History</p>
//         </div>

//         <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-2 border-yellow-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
//           <div className="flex items-center gap-3 mb-3">
//             <div className="p-3 bg-yellow-200 rounded-lg">
//               <Clock className="w-7 h-7 text-yellow-700" />
//             </div>
//             <span className="text-base font-bold text-yellow-700">Expiring Soon</span>
//           </div>
//           <p className="text-4xl lg:text-5xl font-bold text-yellow-900 mb-1">{statistics.expiringSoon}</p>
//           <p className="text-base text-yellow-600">&lt; 7 days</p>
//         </div>

//         <div className="bg-gradient-to-br from-red-50 to-red-100 border-2 border-red-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
//           <div className="flex items-center gap-3 mb-3">
//             <div className="p-3 bg-red-200 rounded-lg">
//               <AlertCircle className="w-7 h-7 text-red-700" />
//             </div>
//             <span className="text-base font-bold text-red-700">Expired</span>
//           </div>
//           <p className="text-4xl lg:text-5xl font-bold text-red-900 mb-1">{statistics.expiredThisMonth}</p>
//           <p className="text-base text-red-600">This Month</p>
//         </div>
//       </div>

//       {/* FILTERS & SEARCH */}
//       <div className="bg-white rounded-xl border-2 border-gray-200 p-6 space-y-5 shadow-sm">
//         <div className="relative">
//           <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
//           <input
//             type="text"
//             placeholder="Search by seller, email, plan, transaction ID..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="w-full pl-14 pr-14 py-4 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-lg transition-all"
//           />
//           {searchTerm && (
//             <button
//               onClick={() => setSearchTerm('')}
//               className="absolute right-5 top-1/2 -translate-y-1/2 p-2 hover:bg-gray-100 rounded-full transition-colors"
//             >
//               <X className="w-6 h-6 text-gray-500" />
//             </button>
//           )}
//         </div>

//         <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//           <div className="relative">
//             <Filter className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400 pointer-events-none" />
//             <select
//               value={filterStatus}
//               onChange={(e) => setFilterStatus(e.target.value as FilterStatus)}
//               className="w-full pl-14 pr-5 py-4 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-lg bg-white cursor-pointer transition-all appearance-none"
//             >
//               <option value="all">All History</option>
//               <option value="active">Active Plans Only</option>
//               <option value="expiring_soon">Expiring Soon</option>
//               <option value="expired">Expired Plans</option>
//               <option value="non_active">Old History (Non-Active)</option>
//             </select>
//           </div>

//           <div className="relative">
//             <Package className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400 pointer-events-none" />
//             <select
//               value={filterPlan}
//               onChange={(e) => setFilterPlan(e.target.value)}
//               className="w-full pl-14 pr-5 py-4 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-lg bg-white cursor-pointer transition-all appearance-none"
//             >
//               <option value="all">All Plans</option>
//               {getUniquePlans().map(plan => (
//                 <option key={plan} value={plan}>{plan}</option>
//               ))}
//             </select>
//           </div>

//           <div className="relative">
//             <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400 pointer-events-none" />
//             <select
//               value={sortField}
//               onChange={(e) => setSortField(e.target.value as SortField)}
//               className="w-full pl-14 pr-5 py-4 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-lg bg-white cursor-pointer transition-all appearance-none"
//             >
//               <option value="purchase_date">Sort by Purchase Date</option>
//               <option value="expiry_date">Sort by Expiry Date</option>
//               <option value="seller_name">Sort by Seller Name</option>
//               <option value="price">Sort by Price</option>
//             </select>
//           </div>
//         </div>

//         <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t-2 border-gray-100">
//           <p className="text-base text-gray-600">
//             Showing <span className="font-bold text-purple-600">{currentItems.length > 0 ? startIndex + 1 : 0}</span> - <span className="font-bold text-purple-600">{Math.min(endIndex, filteredAndSortedSubscriptions.length)}</span> of <span className="font-bold text-purple-600">{filteredAndSortedSubscriptions.length}</span> entries
//           </p>
//           {(searchTerm || filterStatus !== 'all' || filterPlan !== 'all') && (
//             <button
//               onClick={() => {
//                 setSearchTerm('');
//                 setFilterStatus('all');
//                 setFilterPlan('all');
//               }}
//               className="text-base text-purple-600 hover:text-purple-700 font-medium underline"
//             >
//               Clear Filters
//             </button>
//           )}
//         </div>
//       </div>

//       {/* DESKTOP TABLE */}
//       <div className="hidden lg:block bg-white rounded-xl border-2 border-gray-200 overflow-hidden shadow-sm">
//         <div className="overflow-x-auto">
//           <table className="w-full">
//             <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-300">
//               <tr>
//                 <th className="text-left p-6 font-bold text-gray-800 text-lg">Seller Info</th>
//                 <th className="text-left p-6 font-bold text-gray-800 text-lg">Plan Details</th>
//                 <th className="text-left p-6 font-bold text-gray-800 text-lg">Purchased</th>
//                 <th className="text-left p-6 font-bold text-gray-800 text-lg">Expires</th>
//                 <th className="text-left p-6 font-bold text-gray-800 text-lg">Usage</th>
//                 <th className="text-left p-6 font-bold text-gray-800 text-lg">Status</th>
//                 <th className="text-left p-6 font-bold text-gray-800 text-lg">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {currentItems.length === 0 ? (
//                 <tr>
//                   <td colSpan={7} className="p-12 text-center">
//                     <div className="flex flex-col items-center gap-4">
//                       <FileSpreadsheet className="w-24 h-24 text-gray-300" />
//                       <p className="text-gray-500 font-medium text-xl">No history found</p>
//                       <p className="text-lg text-gray-400">Try adjusting your filters</p>
//                     </div>
//                   </td>
//                 </tr>
//               ) : (
//                 currentItems.map((sub, index) => (
//                   <tr
//                     key={sub.id}
//                     className={`border-t border-gray-200 hover:bg-purple-50 transition-colors ${
//                       index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
//                     }`}
//                   >
//                     <td className="p-6">
//                       <div className="flex items-center gap-4">
//                         <div className={`p-3 rounded-lg flex-shrink-0 ${sub.status === 'non_active' ? 'bg-gray-200' : 'bg-purple-100'}`}>
//                           <Users className={`w-7 h-7 ${sub.status === 'non_active' ? 'text-gray-500' : 'text-purple-600'}`} />
//                         </div>
//                         <div className="min-w-0">
//                           <p className="font-bold text-gray-900 text-lg truncate">{sub.seller_business_name}</p>
//                           <p className="text-base text-gray-600 truncate">{sub.seller_owner_name}</p>
//                           <div className="flex items-center gap-2 text-base text-gray-500 mt-1">
//                             <Mail className="w-5 h-5 flex-shrink-0" />
//                             <span className="truncate">{sub.seller_email}</span>
//                           </div>
//                         </div>
//                       </div>
//                     </td>

//                     <td className="p-6">
//                       <div className="flex items-center gap-3">
//                         <Package className={`w-6 h-6 flex-shrink-0 ${sub.status === 'non_active' ? 'text-gray-400' : 'text-indigo-600'}`} />
//                         <div>
//                           <p className={`font-bold text-lg ${sub.status === 'non_active' ? 'text-gray-500' : 'text-gray-900'}`}>{sub.plan_name}</p>
//                           <p className="text-base text-gray-600 flex items-center gap-1">
//                             <IndianRupee className="w-5 h-5" />
//                             {formatCurrency(sub.plan_price)} / {sub.plan_billing_cycle}
//                           </p>
//                           <p className="text-base text-gray-500">{sub.plan_validity_duration} {sub.plan_validity_unit}</p>
//                         </div>
//                       </div>
//                     </td>

//                     <td className="p-6">
//                       <div className="flex items-center gap-3">
//                         <Calendar className={`w-6 h-6 flex-shrink-0 ${sub.status === 'non_active' ? 'text-gray-400' : 'text-blue-600'}`} />
//                         <div>
//                           <p className="text-lg font-medium text-gray-900">
//                             {sub.created_at ? new Date(sub.created_at).toLocaleDateString('en-IN', {
//                               day: '2-digit', month: 'short', year: 'numeric'
//                             }) : 'N/A'}
//                           </p>
//                           <p className="text-base text-gray-500">
//                             {sub.created_at ? new Date(sub.created_at).toLocaleTimeString('en-IN', {
//                               hour: '2-digit', minute: '2-digit'
//                             }) : 'N/A'}
//                           </p>
//                         </div>
//                       </div>
//                     </td>

//                     <td className="p-6">
//                       <div className="flex items-center gap-3">
//                         <Clock className={`w-6 h-6 flex-shrink-0 ${sub.status === 'non_active' ? 'text-gray-400' : 'text-orange-600'}`} />
//                         <div>
//                           <p className="text-lg font-medium text-gray-900">
//                             {sub.end_date ? new Date(sub.end_date).toLocaleDateString('en-IN', {
//                               day: '2-digit', month: 'short', year: 'numeric'
//                             }) : 'N/A'}
//                           </p>
//                           <p className={`text-base font-semibold ${
//                             sub.status === 'non_active' ? 'text-gray-400' :
//                             sub.days_remaining <= 3 ? 'text-red-600' :
//                             sub.days_remaining <= 7 ? 'text-orange-600' :
//                             'text-gray-500'
//                           }`}>
//                             {sub.status === 'non_active' ? 'History' : `${sub.days_remaining} days left`}
//                           </p>
//                         </div>
//                       </div>
//                     </td>

//                     <td className="p-6">
//                       <div className="flex items-center gap-3">
//                         <QrCode className={`w-6 h-6 flex-shrink-0 ${sub.status === 'non_active' ? 'text-gray-400' : 'text-green-600'}`} />
//                         <div className="flex-1 min-w-0">
//                           <div className="flex items-center justify-between mb-2">
//                             <span className="text-base text-gray-600">Scans:</span>
//                             <span className="text-base font-bold text-gray-900">
//                               {sub.current_scan_count} / {sub.plan_scan_limit === -1 ? '∞' : sub.plan_scan_limit}
//                             </span>
//                           </div>
//                           {sub.plan_scan_limit !== -1 && (
//                             <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
//                               <div
//                                 className={`h-full transition-all ${
//                                   sub.status === 'non_active' ? 'bg-gray-400' :
//                                   sub.scan_percentage >= 90 ? 'bg-red-500' :
//                                   sub.scan_percentage >= 70 ? 'bg-orange-500' :
//                                   'bg-green-500'
//                                 }`}
//                                 style={{ width: `${sub.scan_percentage}%` }}
//                               ></div>
//                             </div>
//                           )}
//                         </div>
//                       </div>
//                     </td>

//                     <td className="p-6">
//                       <span className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-base font-bold border-2 ${sub.status_color}`}>
//                         {sub.status_badge === 'Active' && <CheckCircle className="w-5 h-5" />}
//                         {sub.status_badge === 'Expired' && <AlertCircle className="w-5 h-5" />}
//                         {sub.status_badge}
//                       </span>
//                     </td>

//                     <td className="p-6">
//                       <button
//                         onClick={() => handleViewDetails(sub)}
//                         className={`flex items-center gap-2 px-6 py-3 text-white rounded-lg transition-colors text-lg font-medium shadow-md hover:shadow-lg ${
//                           sub.status === 'non_active' ? 'bg-gray-500 hover:bg-gray-600' : 'bg-purple-600 hover:bg-purple-700'
//                         }`}
//                       >
//                         <Eye className="w-6 h-6" />
//                         View
//                       </button>
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* MOBILE CARDS */}
//       <div className="lg:hidden space-y-4">
//         {currentItems.length === 0 ? (
//           <div className="bg-white rounded-xl border-2 border-gray-200 p-12 text-center">
//             <FileSpreadsheet className="w-20 h-20 text-gray-300 mx-auto mb-4" />
//             <p className="text-gray-500 font-medium text-lg mb-2">No history found</p>
//             <p className="text-base text-gray-400">Try adjusting your filters</p>
//           </div>
//         ) : (
//           currentItems.map((sub) => (
//             <div
//               key={sub.id}
//               className={`bg-white rounded-xl border-2 p-5 shadow-sm hover:shadow-md transition-shadow ${
//                 sub.status === 'non_active' ? 'border-gray-200 opacity-90' : 'border-purple-100'
//               }`}
//             >
//               <div className="flex items-start justify-between gap-3 mb-4 pb-4 border-b-2 border-gray-100">
//                 <div className="flex items-center gap-3 min-w-0 flex-1">
//                   <div className={`p-2.5 rounded-lg flex-shrink-0 ${sub.status === 'non_active' ? 'bg-gray-100' : 'bg-purple-100'}`}>
//                     <Users className={`w-6 h-6 ${sub.status === 'non_active' ? 'text-gray-500' : 'text-purple-600'}`} />
//                   </div>
//                   <div className="min-w-0 flex-1">
//                     <h3 className="font-bold text-gray-900 text-base truncate">{sub.seller_business_name}</h3>
//                     <p className="text-sm text-gray-600 truncate">{sub.seller_owner_name}</p>
//                   </div>
//                 </div>
//                 <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border-2 flex-shrink-0 ${sub.status_color}`}>
//                   {sub.status_badge === 'Active' && <CheckCircle className="w-4 h-4" />}
//                   {sub.status_badge === 'Expired' && <AlertCircle className="w-4 h-4" />}
//                   {sub.status_badge}
//                 </span>
//               </div>

//               <div className="bg-indigo-50 border-2 border-indigo-100 rounded-lg p-4 mb-4">
//                 <div className="flex items-center gap-2.5 mb-2">
//                   <Package className="w-5 h-5 text-indigo-600" />
//                   <span className={`font-bold text-base ${sub.status === 'non_active' ? 'text-gray-600' : 'text-gray-900'}`}>{sub.plan_name}</span>
//                 </div>
//                 <div className="flex items-center justify-between text-base">
//                   <span className="text-gray-600">Price:</span>
//                   <span className="font-bold text-indigo-900 flex items-center gap-1">
//                     <IndianRupee className="w-4 h-4" />
//                     {sub.plan_price.toLocaleString('en-IN')} / {sub.plan_billing_cycle}
//                   </span>
//                 </div>
//               </div>

//               <div className="grid grid-cols-2 gap-3 mb-4">
//                 <div className="bg-blue-50 border-2 border-blue-100 rounded-lg p-3">
//                   <div className="flex items-center gap-2 mb-2">
//                     <Calendar className="w-4 h-4 text-blue-600" />
//                     <span className="text-xs font-bold text-blue-700">Purchased</span>
//                   </div>
//                   <p className="text-sm font-bold text-gray-900">
//                     {sub.created_at ? new Date(sub.created_at).toLocaleDateString('en-IN', {
//                       day: '2-digit', month: 'short'
//                     }) : 'N/A'}
//                   </p>
//                 </div>

//                 <div className="bg-orange-50 border-2 border-orange-100 rounded-lg p-3">
//                   <div className="flex items-center gap-2 mb-2">
//                     <Clock className="w-4 h-4 text-orange-600" />
//                     <span className="text-xs font-bold text-orange-700">Expires</span>
//                   </div>
//                   <p className="text-sm font-bold text-gray-900">
//                     {sub.end_date ? new Date(sub.end_date).toLocaleDateString('en-IN', {
//                       day: '2-digit', month: 'short'
//                     }) : 'N/A'}
//                   </p>
//                 </div>
//               </div>

//               <button
//                 onClick={() => handleViewDetails(sub)}
//                 className={`w-full flex items-center justify-center gap-2 px-5 py-3.5 text-white rounded-lg transition-colors text-base font-bold shadow-md ${
//                   sub.status === 'non_active' ? 'bg-gray-600 hover:bg-gray-700' : 'bg-purple-600 hover:bg-purple-700'
//                 }`}
//               >
//                 <Eye className="w-5 h-5" />
//                 View Full Details
//               </button>
//             </div>
//           ))
//         )}
//       </div>

//       {/* PAGINATION */}
//       {totalPages > 1 && (
//         <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-5 border-t-2 border-gray-200">
//           <p className="text-lg text-gray-600 order-2 sm:order-1">
//             Page <span className="font-bold text-purple-600">{currentPage}</span> of <span className="font-bold text-purple-600">{totalPages}</span>
//           </p>

//           <div className="flex items-center gap-3 order-1 sm:order-2">
//             <button
//               onClick={() => goToPage(currentPage - 1)}
//               disabled={currentPage === 1}
//               className={`flex items-center gap-2 px-5 py-3 rounded-lg text-lg font-medium transition-all ${
//                 currentPage === 1
//                   ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
//                   : 'bg-white border-2 border-gray-300 text-gray-700 hover:bg-gray-50 shadow-sm hover:shadow'
//               }`}
//             >
//               <ChevronLeft className="w-6 h-6" />
//               <span className="hidden sm:inline">Previous</span>
//             </button>

//             <div className="flex items-center gap-2">
//               {getPageNumbers().map((page, index) => {
//                 if (page === '...') {
//                   return <span key={`ellipsis-${index}`} className="px-3 text-gray-500 text-lg">...</span>;
//                 }
//                 return (
//                   <button
//                     key={page}
//                     onClick={() => goToPage(page as number)}
//                     className={`min-w-[48px] h-12 px-4 rounded-lg text-lg font-medium transition-all ${
//                       currentPage === page
//                         ? 'bg-purple-600 text-white shadow-md'
//                         : 'bg-white border-2 border-gray-300 text-gray-700 hover:bg-gray-50 shadow-sm hover:shadow'
//                     }`}
//                   >
//                     {page}
//                   </button>
//                 );
//               })}
//             </div>

//             <button
//               onClick={() => goToPage(currentPage + 1)}
//               disabled={currentPage === totalPages}
//               className={`flex items-center gap-2 px-5 py-3 rounded-lg text-lg font-medium transition-all ${
//                 currentPage === totalPages
//                   ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
//                   : 'bg-white border-2 border-gray-300 text-gray-700 hover:bg-gray-50 shadow-sm hover:shadow'
//               }`}
//             >
//               <span className="hidden sm:inline">Next</span>
//               <ChevronRight className="w-6 h-6" />
//             </button>
//           </div>
//         </div>
//       )}

//    {/* DETAILS MODAL */}
//       {showDetailsModal && selectedSubscription && (
//         <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-start sm:items-center justify-center z-50 overflow-y-auto">
//           <div className="bg-white rounded-none sm:rounded-2xl shadow-2xl w-full sm:w-[95vw] sm:max-w-5xl min-h-screen sm:min-h-0 sm:my-8">
//             <div className={`sticky top-0 text-white p-4 sm:p-6 lg:p-8 z-20 shadow-lg ${
//               selectedSubscription.status === 'non_active' ? 'bg-gradient-to-r from-gray-600 to-gray-800' : 'bg-gradient-to-r from-purple-600 to-indigo-600'
//             }`}>
//               <div className="flex items-start justify-between gap-3">
//                 <div className="flex-1 min-w-0">
//                   <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-1 sm:mb-2 leading-tight">
//                     {selectedSubscription.status === 'non_active' ? 'Past Plan Details (Non-Active)' : 'Subscription Details & Analytics'}
//                   </h3>
//                   <p className="text-gray-100 text-sm sm:text-base lg:text-lg">
//                     Complete subscription and seller performance data
//                   </p>
//                 </div>
//                 <button
//                   onClick={() => {
//                     setShowDetailsModal(false);
//                     setSelectedSubscription(null);
//                     setSellerAnalytics(null);
//                   }}
//                   className="flex-shrink-0 p-2 sm:p-2.5 hover:bg-white/20 rounded-lg transition-colors"
//                 >
//                   <X className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8" />
//                 </button>
//               </div>
//             </div>

//             <div className="overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8" style={{ maxHeight: 'calc(100vh - 180px)' }}>
              
//               {/* SELLER ANALYTICS */}
//               <div className="bg-gradient-to-br from-purple-50 to-indigo-50 border-2 border-purple-200 rounded-xl p-4 sm:p-6 lg:p-8">
//                 <h4 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-4 sm:mb-5 lg:mb-6 flex items-center gap-2 sm:gap-3 border-b-2 border-purple-300 pb-3 sm:pb-4">
//                   <BarChart3 className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-purple-600 flex-shrink-0" />
//                   <span className="truncate">Seller Performance Analytics</span>
//                 </h4>
//                 {loadingAnalytics ? (
//                   <div className="flex items-center justify-center py-12">
//                     <Loader className="w-12 h-12 text-purple-600 animate-spin" />
//                   </div>
//                 ) : sellerAnalytics ? (
//                   <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
//                       <div className="bg-white border-2 border-purple-200 rounded-lg p-3 sm:p-4 lg:p-5 shadow-sm">
//                         <p className="text-xs sm:text-sm lg:text-base font-bold text-purple-700">Total Plans</p>
//                         <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-purple-900">{sellerAnalytics.totalPlans}</p>
//                       </div>
//                       <div className="bg-white border-2 border-green-200 rounded-lg p-3 sm:p-4 lg:p-5 shadow-sm">
//                         <p className="text-xs sm:text-sm lg:text-base font-bold text-green-700">Total Revenue</p>
//                         <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-green-900">₹{sellerAnalytics.totalRevenue.toLocaleString('en-IN')}</p>
//                       </div>
//                       <div className="bg-white border-2 border-blue-200 rounded-lg p-3 sm:p-4 lg:p-5 shadow-sm">
//                         <p className="text-xs sm:text-sm lg:text-base font-bold text-blue-700">Active</p>
//                         <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-blue-900">{sellerAnalytics.activeSubscriptions}</p>
//                       </div>
//                       <div className="bg-white border-2 border-red-200 rounded-lg p-3 sm:p-4 lg:p-5 shadow-sm">
//                         <p className="text-xs sm:text-sm lg:text-base font-bold text-red-700">Expired/History</p>
//                         <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-red-900">{sellerAnalytics.expiredSubscriptions}</p>
//                       </div>
//                   </div>
//                 ) : null}
//               </div>

//               {/* SELLER INFORMATION */}
//               <div>
//                 <h4 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-4 sm:mb-5 flex items-center gap-2 sm:gap-3 border-b-2 border-purple-200 pb-3 sm:pb-4">
//                   <Users className="w-6 h-6 sm:w-7 sm:h-7 text-purple-600 flex-shrink-0" />
//                   <span className="truncate">Seller Information</span>
//                 </h4>
//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 lg:gap-5">
//                   <div className="bg-gray-50 rounded-lg p-4 sm:p-5">
//                     <p className="text-sm sm:text-base text-gray-600 mb-2">Business Name</p>
//                     <p className="font-bold text-gray-900 text-base sm:text-lg break-words">{selectedSubscription.seller_business_name}</p>
//                   </div>
//                   <div className="bg-gray-50 rounded-lg p-4 sm:p-5">
//                     <p className="text-sm sm:text-base text-gray-600 mb-2">Owner Name</p>
//                     <p className="font-bold text-gray-900 text-base sm:text-lg break-words">{selectedSubscription.seller_owner_name}</p>
//                   </div>
//                   <div className="bg-gray-50 rounded-lg p-4 sm:p-5">
//                     <p className="text-sm sm:text-base text-gray-600 mb-2 flex items-center gap-1">
//                       <Mail className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" /> Email
//                     </p>
//                     <p className="font-medium text-gray-900 text-base sm:text-lg break-words">{selectedSubscription.seller_email}</p>
//                   </div>
//                   <div className="bg-gray-50 rounded-lg p-4 sm:p-5">
//                     <p className="text-sm sm:text-base text-gray-600 mb-2 flex items-center gap-1">
//                       <Phone className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" /> Phone
//                     </p>
//                     <p className="font-medium text-gray-900 text-base sm:text-lg break-words">{selectedSubscription.seller_phone || 'N/A'}</p>
//                   </div>
//                 </div>
//               </div>

//               {/* PLAN INFORMATION */}
//               <div>
//                 <h4 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-4 sm:mb-5 flex items-center gap-2 sm:gap-3 border-b-2 border-indigo-200 pb-3 sm:pb-4">
//                   <Package className="w-6 h-6 sm:w-7 sm:h-7 text-indigo-600 flex-shrink-0" />
//                   <span className="truncate">Plan Information</span>
//                 </h4>
//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 lg:gap-5">
//                   <div className="bg-indigo-50 border-2 border-indigo-200 rounded-lg p-4 sm:p-5">
//                     <p className="text-sm sm:text-base text-indigo-700 mb-2 font-bold">Plan Name</p>
//                     <p className="font-bold text-indigo-900 text-lg sm:text-xl break-words">{selectedSubscription.plan_name}</p>
//                   </div>
//                   <div className="bg-indigo-50 border-2 border-indigo-200 rounded-lg p-4 sm:p-5">
//                     <p className="text-sm sm:text-base text-indigo-700 mb-2 font-bold">Price</p>
//                     <p className="font-bold text-indigo-900 text-lg sm:text-xl flex items-center gap-1">
//                       <IndianRupee className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" />
//                       <span className="break-all">{selectedSubscription.plan_price.toLocaleString('en-IN')}</span>
//                       <span>/ {selectedSubscription.plan_billing_cycle}</span>
//                     </p>
//                   </div>
//                 </div>
//               </div>

//               {/* SUBSCRIPTION TIMELINE */}
//               <div>
//                 <h4 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-4 sm:mb-5 flex items-center gap-2 sm:gap-3 border-b-2 border-blue-200 pb-3 sm:pb-4">
//                   <Calendar className="w-6 h-6 sm:w-7 sm:h-7 text-blue-600 flex-shrink-0" />
//                   <span className="truncate">Subscription Timeline</span>
//                 </h4>
//                 <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 lg:gap-5">
//                   <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4 sm:p-5">
//                     <p className="text-sm sm:text-base text-green-700 mb-2 font-bold">Start Date</p>
//                     <p className="font-bold text-gray-900 text-base sm:text-lg break-words">{formatDate(selectedSubscription.start_date)}</p>
//                   </div>
//                   <div className="bg-orange-50 border-2 border-orange-200 rounded-lg p-4 sm:p-5">
//                     <p className="text-sm sm:text-base text-orange-700 mb-2 font-bold">End Date</p>
//                     <p className="font-bold text-gray-900 text-base sm:text-lg break-words">{formatDate(selectedSubscription.end_date)}</p>
//                   </div>
//                   <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-4 sm:p-5">
//                     <p className="text-sm sm:text-base text-gray-700 mb-2 font-bold">Status</p>
//                     <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-base font-bold border-2 ${selectedSubscription.status_color}`}>
//                       {selectedSubscription.status_badge === 'Active' && <CheckCircle className="w-5 h-5 flex-shrink-0" />}
//                       {selectedSubscription.status_badge === 'Expired' && <AlertCircle className="w-5 h-5 flex-shrink-0" />}
//                       <span className="truncate">{selectedSubscription.status_badge}</span>
//                     </span>
//                   </div>
//                 </div>
//               </div>

//               {/* PAYMENT INFORMATION */}
//               {selectedSubscription.payment_id && (
//                 <div>
//                   <h4 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-4 sm:mb-5 flex items-center gap-2 sm:gap-3 border-b-2 border-yellow-200 pb-3 sm:pb-4">
//                     <CreditCard className="w-6 h-6 sm:w-7 sm:h-7 text-yellow-600 flex-shrink-0" />
//                     <span className="truncate">Payment Information</span>
//                   </h4>
//                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 lg:gap-5">
//                     <div className="bg-gray-50 rounded-lg p-4 sm:p-5">
//                       <p className="text-sm sm:text-base text-gray-600 mb-2">Payment ID</p>
//                       <p className="font-mono text-sm sm:text-base font-bold text-gray-900 break-all">{selectedSubscription.payment_id}</p>
//                     </div>
//                     <div className="bg-gray-50 rounded-lg p-4 sm:p-5">
//                       <p className="text-sm sm:text-base text-gray-600 mb-2">Transaction ID</p>
//                       <p className="font-mono text-sm sm:text-base font-bold text-gray-900 break-all">{selectedSubscription.transaction_id || 'N/A'}</p>
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </div>

//             <div className="sticky bottom-0 bg-gray-50 border-t-2 border-gray-200 p-4 sm:p-5 lg:p-6">
//               <button
//                 onClick={() => {
//                   setShowDetailsModal(false);
//                   setSelectedSubscription(null);
//                   setSellerAnalytics(null);
//                 }}
//                 className={`w-full px-6 py-3 rounded-lg text-white font-bold text-lg shadow-md transition-colors ${
//                   selectedSubscription.status === 'non_active' ? 'bg-gray-600 hover:bg-gray-700' : 'bg-purple-600 hover:bg-purple-700'
//                 }`}
//               >
//                 Close
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }; 
import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import {
  Search, Filter, Eye, X, Package, Calendar, CreditCard, Users, RefreshCw,
  ChevronLeft, ChevronRight, Clock, CheckCircle, AlertCircle, Mail, Phone,
  IndianRupee, QrCode, Loader, FileSpreadsheet, TrendingUp, Award, Repeat,
  DollarSign, BarChart3, AlertTriangle, Download, Plus, Trash2, Edit
} from 'lucide-react';
import { collection, query, getDocs, orderBy, limit, where, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { shouldForceRefresh } from '../lib/subscriptionService';
import { eventBus } from '../utils/eventBus';

// ═══════════════════════════════════════════════════════════════
// ✅ INTERFACES
// ═══════════════════════════════════════════════════════════════

interface EnrichedSubscription {
  id: string;
  seller_id: string;
  plan_id: string;
  plan_name: string;
  status: string;
  start_date: string;
  end_date: string;
  current_scan_count: number;
  last_payment_id?: string;
  created_at: string;
  seller_business_name: string;
  seller_owner_name: string;
  seller_email: string;
  seller_phone?: string;
  plan_price: number;
  plan_currency: string;
  plan_billing_cycle: string;
  plan_validity_duration: number;
  plan_validity_unit: string;
  plan_scan_limit: number;
  payment_amount?: number;
  payment_id?: string;
  transaction_id?: string;
  payment_date?: string;
  days_remaining: number;
  status_color: string;
  status_badge: string;
  scan_percentage: number;
  is_expiring_soon: boolean;
  is_expired: boolean;
}

interface Statistics {
  totalActive: number;
  totalRevenue: number;
  expiringSoon: number;
  expiredThisMonth: number;
  renewedThisMonth: number;
}

interface SellerAnalytics {
  totalPlans: number;
  totalRevenue: number;
  mostPurchasedPlan: {
    name: string;
    count: number;
  };
  mostRenewedPlan: {
    name: string;
    count: number;
  };
  planBreakdown: {
    planName: string;
    purchaseCount: number;
    renewCount: number;
    totalSpent: number;
  }[];
  activeSubscriptions: number;
  expiredSubscriptions: number;
  firstPurchaseDate: string;
  lastPurchaseDate: string;
}

type FilterStatus = 'all' | 'active' | 'expired' | 'expiring_soon' | 'non_active';
type SortField = 'purchase_date' | 'expiry_date' | 'seller_name' | 'price';

// ═══════════════════════════════════════════════════════════════
// ✅ MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════

export const BillingHistory: React.FC = () => {
  const [subscriptions, setSubscriptions] = useState<EnrichedSubscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [filterPlan, setFilterPlan] = useState<string>('all');
  const [sortField, setSortField] = useState<SortField>('purchase_date');
  
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);
  
  const [selectedSubscription, setSelectedSubscription] = useState<EnrichedSubscription | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [sellerAnalytics, setSellerAnalytics] = useState<SellerAnalytics | null>(null);
  const [loadingAnalytics, setLoadingAnalytics] = useState(false);
  
  const [statistics, setStatistics] = useState<Statistics>({
    totalActive: 0,
    totalRevenue: 0,
    expiringSoon: 0,
    expiredThisMonth: 0,
    renewedThisMonth: 0
  });

  const loadingRef = useRef(false);
  const loadTimeoutRef = useRef<NodeJS.Timeout>();

  // ═══════════════════════════════════════════════════════════════
  // UTILITY FUNCTIONS
  // ═══════════════════════════════════════════════════════════════

  const calculateDaysRemaining = useCallback((endDate: string): number => {
    if (!endDate || endDate === 'N/A') return 0;
    const end = new Date(endDate);
    const now = new Date();
    const diffTime = end.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  }, []);

  const getStatusInfo = useCallback((subscription: EnrichedSubscription): {
    color: string;
    badge: string;
    isExpiringSoon: boolean;
    isExpired: boolean;
  } => {
    const daysRemaining = subscription.days_remaining;

    if (daysRemaining === 0 || (subscription.end_date && new Date(subscription.end_date) < new Date())) {
      return {
        color: 'bg-rose-100 text-rose-700',
        badge: 'Expired',
        isExpiringSoon: false,
        isExpired: true
      };
    }

    if (daysRemaining <= 3) {
      return {
        color: 'bg-orange-100 text-orange-700',
        badge: 'Expiring Soon',
        isExpiringSoon: true,
        isExpired: false
      };
    }

    if (daysRemaining <= 7) {
      return {
        color: 'bg-yellow-100 text-yellow-700',
        badge: 'Expiring Soon',
        isExpiringSoon: true,
        isExpired: false
      };
    }

    return {
      color: 'bg-green-100 text-green-700',
      badge: 'Active',
      isExpiringSoon: false,
      isExpired: false
    };
  }, []);

  const calculateScanPercentage = useCallback((used: number, total: number): number => {
    if (total === -1) return 0;
    if (total === 0) return 0;
    return Math.min(100, Math.round((used / total) * 100));
  }, []);

  const calculateSellerAnalytics = useCallback((sellerId: string): SellerAnalytics => {
    const sellerSubscriptions = subscriptions.filter(sub => sub.seller_id === sellerId);

    if (sellerSubscriptions.length === 0) {
      return {
        totalPlans: 0,
        totalRevenue: 0,
        mostPurchasedPlan: { name: 'N/A', count: 0 },
        mostRenewedPlan: { name: 'N/A', count: 0 },
        planBreakdown: [],
        activeSubscriptions: 0,
        expiredSubscriptions: 0,
        firstPurchaseDate: 'N/A',
        lastPurchaseDate: 'N/A'
      };
    }

    const totalRevenue = sellerSubscriptions.reduce((sum, sub) => {
      return sum + (sub.payment_amount || sub.plan_price || 0);
    }, 0);

    const planMap = new Map<string, { purchaseCount: number; renewCount: number; totalSpent: number; }>();

    sellerSubscriptions.forEach(sub => {
      const existing = planMap.get(sub.plan_name) || { purchaseCount: 0, renewCount: 0, totalSpent: 0 };
      existing.purchaseCount += 1;
      existing.totalSpent += (sub.payment_amount || sub.plan_price || 0);
      if (existing.purchaseCount > 1) {
        existing.renewCount += 1;
      }
      planMap.set(sub.plan_name, existing);
    });

    const planBreakdown = Array.from(planMap.entries()).map(([planName, data]) => ({
      planName,
      purchaseCount: data.purchaseCount,
      renewCount: data.renewCount,
      totalSpent: data.totalSpent
    })).sort((a, b) => b.totalSpent - a.totalSpent);

    let mostPurchasedPlan = { name: 'N/A', count: 0 };
    planBreakdown.forEach(plan => {
      if (plan.purchaseCount > mostPurchasedPlan.count) {
        mostPurchasedPlan = { name: plan.planName, count: plan.purchaseCount };
      }
    });

    let mostRenewedPlan = { name: 'N/A', count: 0 };
    planBreakdown.forEach(plan => {
      if (plan.renewCount > mostRenewedPlan.count) {
        mostRenewedPlan = { name: plan.planName, count: plan.renewCount };
      }
    });

    const activeSubscriptions = sellerSubscriptions.filter(sub => 
      !sub.is_expired && sub.status !== 'non_active'
    ).length;

    const expiredSubscriptions = sellerSubscriptions.filter(sub => 
      sub.is_expired || sub.status === 'non_active'
    ).length;

    const sortedByDate = [...sellerSubscriptions].sort((a, b) => {
      const timeA = a.created_at ? new Date(a.created_at).getTime() : 0;
      const timeB = b.created_at ? new Date(b.created_at).getTime() : 0;
      return timeA - timeB;
    });

    const firstPurchaseDate = sortedByDate[0]?.created_at || 'N/A';
    const lastPurchaseDate = sortedByDate[sortedByDate.length - 1]?.created_at || 'N/A';

    return {
      totalPlans: sellerSubscriptions.length,
      totalRevenue,
      mostPurchasedPlan,
      mostRenewedPlan,
      planBreakdown,
      activeSubscriptions,
      expiredSubscriptions,
      firstPurchaseDate,
      lastPurchaseDate
    };
  }, [subscriptions]);

  const parseFirebaseDate = useCallback((dateVal: any): string => {
    if (!dateVal) return '';
    if (typeof dateVal.toDate === 'function') return dateVal.toDate().toISOString();
    if (typeof dateVal === 'object' && dateVal !== null && 'seconds' in dateVal) {
      return new Date(dateVal.seconds * 1000).toISOString();
    }
    if (typeof dateVal === 'number') {
      const ms = dateVal < 10000000000 ? dateVal * 1000 : dateVal;
      return new Date(ms).toISOString();
    }
    if (typeof dateVal === 'string') {
      const d = new Date(dateVal);
      if (!isNaN(d.getTime())) return d.toISOString();
    }
    return '';
  }, []);

  // ═══════════════════════════════════════════════════════════════
  // ✅ DATA LOADING & AUTO CLEANUP LOGIC
  // ═══════════════════════════════════════════════════════════════

  const loadData = useCallback(async () => {
    if (loadTimeoutRef.current) clearTimeout(loadTimeoutRef.current);

    if (loadingRef.current) {
      loadTimeoutRef.current = setTimeout(() => loadData(), 1000);
      return;
    }

    loadingRef.current = true;

    try {
      setLoading(true);
      setError(null);
      
      const forceRefresh = shouldForceRefresh();
      
      const subscriptionsQuery = query(
        collection(db, 'subscriptions'),
        orderBy('created_at', 'desc'),
        limit(500)
      );

      const subscriptionsSnapshot = await getDocs(subscriptionsQuery);

      if (subscriptionsSnapshot.metadata.fromCache && forceRefresh) {
        setTimeout(() => {
          loadingRef.current = false;
          loadData();
        }, 2000);
        return;
      }

      if (subscriptionsSnapshot.empty) {
        setSubscriptions([]);
        setLoading(false);
        loadingRef.current = false;
        return;
      }

      if (!subscriptionsSnapshot.metadata.fromCache) {
        sessionStorage.removeItem('force_firestore_refresh');
      }

      const sellerIds = new Set<string>();
      const planIds = new Set<string>();
      const paymentIds = new Set<string>();

      subscriptionsSnapshot.docs.forEach(doc => {
        const data = doc.data();
        if (data.seller_id) sellerIds.add(data.seller_id);
        if (data.plan_id) planIds.add(data.plan_id);
        if (data.last_payment_id) paymentIds.add(data.last_payment_id);
      });

      const sellersMap = new Map<string, any>();
      const sellerIdsArray = Array.from(sellerIds);
      for (let i = 0; i < sellerIdsArray.length; i += 10) {
        const batch = sellerIdsArray.slice(i, i + 10);
        const sellersQuery = query(collection(db, 'sellers'), where('user_id', 'in', batch));
        const sellersSnapshot = await getDocs(sellersQuery);
        sellersSnapshot.docs.forEach(doc => sellersMap.set(doc.data().user_id, doc.data()));
      }

      const plansMap = new Map<string, any>();
      const planIdsArray = Array.from(planIds);
      for (let i = 0; i < planIdsArray.length; i += 10) {
        const batch = planIdsArray.slice(i, i + 10);
        const plansQuery = query(collection(db, 'plans'), where('__name__', 'in', batch));
        const plansSnapshot = await getDocs(plansQuery);
        plansSnapshot.docs.forEach(doc => plansMap.set(doc.id, doc.data()));
      }

      const paymentsMap = new Map<string, any>();
      const paymentIdsArray = Array.from(paymentIds).filter(id => id);
      for (let i = 0; i < paymentIdsArray.length; i += 10) {
        const batch = paymentIdsArray.slice(i, i + 10);
        if (batch.length === 0) continue;
        const paymentsQuery = query(collection(db, 'payments'), where('__name__', 'in', batch));
        const paymentsSnapshot = await getDocs(paymentsQuery);
        paymentsSnapshot.docs.forEach(doc => paymentsMap.set(doc.id, doc.data()));
      }

      let rawSubscriptions: EnrichedSubscription[] = subscriptionsSnapshot.docs.map(doc => {
        const subData = doc.data();
        const seller = sellersMap.get(subData.seller_id) || {};
        const plan = plansMap.get(subData.plan_id) || {};
        const payment = paymentsMap.get(subData.last_payment_id) || {};

        const safeEndDate = parseFirebaseDate(subData.end_date);
        const safeStartDate = parseFirebaseDate(subData.start_date);
        const safeCreatedAt = parseFirebaseDate(subData.created_at || subData.createdAt); 
        const safePaymentDate = parseFirebaseDate(payment.created_at);

        const daysRemaining = calculateDaysRemaining(safeEndDate);
        const statusInfo = getStatusInfo({
          ...subData,
          end_date: safeEndDate,
          days_remaining: daysRemaining,
        } as EnrichedSubscription);

        const scanLimit = plan.limits?.max_scans ?? -1;
        const scanPercentage = calculateScanPercentage(subData.current_scan_count || 0, scanLimit);

        return {
          id: doc.id,
          seller_id: subData.seller_id || '',
          plan_id: subData.plan_id || '',
          plan_name: subData.plan_name || plan.plan_name || 'Unknown',
          status: subData.status || 'active',
          start_date: safeStartDate,
          end_date: safeEndDate,
          current_scan_count: subData.current_scan_count || 0,
          last_payment_id: subData.last_payment_id,
          created_at: safeCreatedAt,
          seller_business_name: seller.business_name || 'Unknown Business',
          seller_owner_name: seller.owner_name || 'Unknown Owner',
          seller_email: seller.email || 'N/A',
          seller_phone: seller.phone || undefined,
          plan_price: plan.price || 0,
          plan_currency: plan.currency || 'INR',
          plan_billing_cycle: plan.billing_cycle || 'monthly',
          plan_validity_duration: plan.validity_duration || 30,
          plan_validity_unit: plan.validity_unit || 'days',
          plan_scan_limit: scanLimit,
          payment_amount: payment.amount || plan.price || 0,
          payment_id: payment.razorpay_payment_id,
          transaction_id: payment.transaction_id,
          payment_date: safePaymentDate,
          days_remaining: daysRemaining,
          status_color: statusInfo.color,
          status_badge: statusInfo.badge,
          scan_percentage: scanPercentage,
          is_expiring_soon: statusInfo.isExpiringSoon,
          is_expired: statusInfo.isExpired
        };
      });

      rawSubscriptions.sort((a, b) => {
        const timeA = a.created_at ? new Date(a.created_at).getTime() : 0;
        const timeB = b.created_at ? new Date(b.created_at).getTime() : 0;
        return timeB - timeA;
      });

      const processedSellers = new Set<string>();

      const enrichedSubscriptions = rawSubscriptions.map(sub => {
        if (!processedSellers.has(sub.seller_id)) {
          processedSellers.add(sub.seller_id);
          return sub;
        }

        return {
          ...sub,
          status: 'non_active',
          status_badge: 'Non-Active',
          status_color: 'bg-slate-100 text-slate-600',
          is_expired: true,
          is_expiring_soon: false
        };
      });

      setSubscriptions(enrichedSubscriptions);
      calculateStatistics(enrichedSubscriptions);

    } catch (error: any) {
      console.error('❌ Error loading billing history:', error);
      setError(`Failed to load data: ${error.message}`);
    } finally {
      setLoading(false);
      loadingRef.current = false;
    }
  }, [calculateDaysRemaining, getStatusInfo, calculateScanPercentage, parseFirebaseDate]);

  const calculateStatistics = useCallback((subs: EnrichedSubscription[]) => {
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const trulyActiveSubs = subs.filter(s => 
      s.status !== 'non_active' && !s.is_expired
    );
    
    const allTimeRevenue = subs
      .map(s => s.payment_amount || s.plan_price || 0)
      .reduce((sum, amount) => sum + amount, 0);
    
    const stats: Statistics = {
      totalActive: trulyActiveSubs.length,
      totalRevenue: allTimeRevenue,
      expiringSoon: trulyActiveSubs.filter(s => s.is_expiring_soon).length,
      expiredThisMonth: subs.filter(s => {
        if (s.status === 'non_active') return false;
        if (!s.end_date) return false;
        const endDate = new Date(s.end_date);
        return endDate >= monthStart && endDate <= now && s.is_expired;
      }).length,
      renewedThisMonth: subs.filter(s => {
        if (!s.created_at) return false;
        const createdDate = new Date(s.created_at);
        return createdDate >= monthStart;
      }).length
    };

    setStatistics(stats);
  }, []);

  const handleViewDetails = useCallback((subscription: EnrichedSubscription) => {
    setSelectedSubscription(subscription);
    setShowDetailsModal(true);
    setLoadingAnalytics(true);

    setTimeout(() => {
      const analytics = calculateSellerAnalytics(subscription.seller_id);
      setSellerAnalytics(analytics);
      setLoadingAnalytics(false);
    }, 300);
  }, [calculateSellerAnalytics]);

  useEffect(() => {
    loadData();

    const handleSubscriptionUpdate = (data: any) => {
      loadData();
    };

    eventBus.on('SUBSCRIPTION_UPDATED', handleSubscriptionUpdate);

    const subscriptionsQuery = query(
      collection(db, 'subscriptions'),
      orderBy('created_at', 'desc'),
      limit(500)
    );

    const unsubscribe = onSnapshot(
      subscriptionsQuery,
      (snapshot) => {
        if (!snapshot.empty) {
          loadData();
        }
      },
      (error) => console.error('Real-time listener error:', error)
    );

    return () => {
      unsubscribe();
      eventBus.off('SUBSCRIPTION_UPDATED', handleSubscriptionUpdate);
      if (loadTimeoutRef.current) clearTimeout(loadTimeoutRef.current);
    };
  }, [loadData]);

  const filteredAndSortedSubscriptions = useMemo(() => {
    let filtered = [...subscriptions];

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(sub =>
        sub.seller_business_name.toLowerCase().includes(term) ||
        sub.seller_owner_name.toLowerCase().includes(term) ||
        sub.seller_email.toLowerCase().includes(term) ||
        sub.plan_name.toLowerCase().includes(term) ||
        sub.transaction_id?.toLowerCase().includes(term) ||
        sub.payment_id?.toLowerCase().includes(term)
      );
    }

    if (filterStatus !== 'all') {
      if (filterStatus === 'active') {
        filtered = filtered.filter(s => !s.is_expired && s.status !== 'non_active');
      } else if (filterStatus === 'expired') {
        filtered = filtered.filter(s => s.status_badge === 'Expired');
      } else if (filterStatus === 'expiring_soon') {
        filtered = filtered.filter(s => s.is_expiring_soon && s.status !== 'non_active');
      } else if (filterStatus === 'non_active') {
        filtered = filtered.filter(s => s.status === 'non_active');
      }
    }

    if (filterPlan !== 'all') {
      filtered = filtered.filter(s => s.plan_name === filterPlan);
    }

    filtered.sort((a, b) => {
      let compareA: any;
      let compareB: any;

      switch (sortField) {
        case 'purchase_date':
          compareA = a.created_at ? new Date(a.created_at).getTime() : 0;
          compareB = b.created_at ? new Date(b.created_at).getTime() : 0;
          break;
        case 'expiry_date':
          compareA = a.end_date ? new Date(a.end_date).getTime() : 0;
          compareB = b.end_date ? new Date(b.end_date).getTime() : 0;
          break;
        case 'seller_name':
          compareA = a.seller_business_name.toLowerCase();
          compareB = b.seller_business_name.toLowerCase();
          break;
        case 'price':
          compareA = a.plan_price;
          compareB = b.plan_price;
          break;
        default:
          return 0;
      }
      return compareA < compareB ? 1 : -1;
    });

    return filtered;
  }, [subscriptions, searchTerm, filterStatus, filterPlan, sortField]);

  const totalPages = Math.ceil(filteredAndSortedSubscriptions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredAndSortedSubscriptions.slice(startIndex, endIndex);

  const goToPage = useCallback((page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const getPageNumbers = useCallback(() => {
    const pages: (number | string)[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push('...');
      for (let i = Math.max(2, currentPage - 1); i <= Math.min(currentPage + 1, totalPages - 1); i++) {
        pages.push(i);
      }
      if (currentPage < totalPages - 2) pages.push('...');
      pages.push(totalPages);
    }
    return pages;
  }, [currentPage, totalPages]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterStatus, filterPlan]);

  const formatDate = useCallback((dateString: string): string => {
    if (!dateString || dateString === 'N/A') return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      day: 'numeric', month: 'short', year: 'numeric'
    });
  }, []);

  const formatTime = useCallback((dateString: string): string => {
    if (!dateString || dateString === 'N/A') return 'N/A';
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit', minute: '2-digit', hour12: true
    });
  }, []);

  const formatCurrency = useCallback((amount: number): string => {
    return `₹${amount.toLocaleString('en-IN')}`;
  }, []);

  const getUniquePlans = useCallback((): string[] => {
    const plans = new Set(subscriptions.map(s => s.plan_name));
    return Array.from(plans).sort();
  }, [subscriptions]);

  // Get gradient based on index
  const getAvatarGradient = (index: number) => {
    const gradients = [
      'from-slate-700 to-slate-900',
      'from-blue-600 to-blue-800',
      'from-purple-600 to-purple-800',
      'from-pink-600 to-pink-800',
      'from-indigo-600 to-indigo-800',
      'from-violet-600 to-violet-800',
      'from-fuchsia-600 to-fuchsia-800',
      'from-cyan-600 to-cyan-800',
      'from-teal-600 to-teal-800',
      'from-stone-800 to-stone-700',
    ];
    return gradients[index % gradients.length];
  };

  // Get avatar shape
  const getAvatarShape = (index: number) => {
    const shapes = [
      <div key="shape" className="w-1.5 h-4 bg-white/70 rounded-sm"></div>,
      <div key="shape" className="w-3.5 h-3.5 border-[2px] border-white/60 rounded-full"></div>,
      <div key="shape" className="w-4 h-3 bg-white/70 rounded-sm transform -rotate-[15deg]"></div>,
      <div key="shape" className="w-3 h-3 bg-white/70 rounded-sm"></div>,
      <div key="shape" className="w-3.5 h-3.5 bg-white/70 rounded"></div>,
    ];
    return shapes[index % shapes.length];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8fafc] p-4 md:p-8 font-sans flex justify-center items-center">
        <div className="text-center">
          <Loader className="w-12 h-12 sm:w-16 sm:h-16 text-[#3b5ce8] animate-spin mx-auto mb-4" />
          <p className="text-base sm:text-lg text-slate-600 font-semibold">Loading billing data...</p>
          <p className="text-xs sm:text-sm text-slate-500 mt-2">Please wait</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#f8fafc] p-4 md:p-8 font-sans flex justify-center items-center">
        <div className="bg-white rounded-xl shadow-lg border border-red-200 p-6 sm:p-8 max-w-md w-full">
          <div className="flex flex-col items-center text-center gap-4">
            <div className="p-3 bg-red-100 rounded-full">
              <AlertCircle className="w-8 h-8 sm:w-10 sm:h-10 text-red-600" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-red-800 mb-2">Error Loading Data</h3>
              <p className="text-xs sm:text-sm text-red-700 mb-4">{error}</p>
            </div>
            <button
              onClick={loadData}
              className="flex items-center gap-2 px-5 sm:px-6 py-2 sm:py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold text-xs sm:text-sm"
            >
              <RefreshCw className="w-4 h-4" />
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] p-3 sm:p-4 md:p-6 lg:p-8 font-sans flex justify-center items-start text-sm">
      <div className="w-full max-w-7xl space-y-4 sm:space-y-6">
        
        {/* STATISTICS CARDS */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-white rounded-lg sm:rounded-xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-slate-100 p-3 sm:p-4 lg:p-5">
            <div className="flex items-start justify-between mb-2 sm:mb-3">
              <div className="p-1.5 sm:p-2 bg-green-100 rounded-md sm:rounded-lg">
                <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
              </div>
              <span className="text-[9px] sm:text-[10px] font-bold text-slate-500 uppercase tracking-wider">Active</span>
            </div>
            <p className="text-2xl sm:text-3xl lg:text-3xl font-bold text-slate-800 mb-0.5 sm:mb-1">{statistics.totalActive}</p>
            <p className="text-[10px] sm:text-xs text-slate-500">Subscriptions</p>
          </div>

          <div className="bg-white rounded-lg sm:rounded-xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-slate-100 p-3 sm:p-4 lg:p-5">
            <div className="flex items-start justify-between mb-2 sm:mb-3">
              <div className="p-1.5 sm:p-2 bg-blue-100 rounded-md sm:rounded-lg">
                <IndianRupee className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
              </div>
              <span className="text-[9px] sm:text-[10px] font-bold text-slate-500 uppercase tracking-wider">Revenue</span>
            </div>
            <p className="text-lg sm:text-2xl lg:text-2xl font-bold text-slate-800 mb-0.5 sm:mb-1">
              ₹{(statistics.totalRevenue / 1000).toFixed(0)}K
            </p>
            <p className="text-[10px] sm:text-xs text-slate-500">Total Earnings</p>
          </div>

          <div className="bg-white rounded-lg sm:rounded-xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-slate-100 p-3 sm:p-4 lg:p-5">
            <div className="flex items-start justify-between mb-2 sm:mb-3">
              <div className="p-1.5 sm:p-2 bg-yellow-100 rounded-md sm:rounded-lg">
                <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600" />
              </div>
              <span className="text-[9px] sm:text-[10px] font-bold text-slate-500 uppercase tracking-wider">Expiring</span>
            </div>
            <p className="text-2xl sm:text-3xl lg:text-3xl font-bold text-slate-800 mb-0.5 sm:mb-1">{statistics.expiringSoon}</p>
            <p className="text-[10px] sm:text-xs text-slate-500">Within 7 days</p>
          </div>

          <div className="bg-white rounded-lg sm:rounded-xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-slate-100 p-3 sm:p-4 lg:p-5">
            <div className="flex items-start justify-between mb-2 sm:mb-3">
              <div className="p-1.5 sm:p-2 bg-rose-100 rounded-md sm:rounded-lg">
                <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-rose-600" />
              </div>
              <span className="text-[9px] sm:text-[10px] font-bold text-slate-500 uppercase tracking-wider">Expired</span>
            </div>
            <p className="text-2xl sm:text-3xl lg:text-3xl font-bold text-slate-800 mb-0.5 sm:mb-1">{statistics.expiredThisMonth}</p>
            <p className="text-[10px] sm:text-xs text-slate-500">This Month</p>
          </div>
        </div>

        {/* MAIN TABLE CONTAINER */}
        <div className="w-full bg-white rounded-lg sm:rounded-xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-slate-100 overflow-hidden">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 sm:p-5 md:px-6 md:py-5 border-b border-slate-100/60 gap-3 sm:gap-0">
            <h2 className="text-base sm:text-[17px] font-bold text-slate-800 tracking-tight">Billing Overview</h2>
            <div className="flex gap-2 flex-wrap w-full sm:w-auto">
              <div className="relative flex-1 sm:flex-none">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value as FilterStatus)}
                  className="w-full sm:w-auto px-3 sm:px-4 py-1.5 bg-[#f1f5f9] hover:bg-slate-200 transition-colors rounded-md text-xs sm:text-sm font-medium text-slate-600 tracking-wide cursor-pointer appearance-none pr-8"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="expiring_soon">Expiring Soon</option>
                  <option value="expired">Expired</option>
                  <option value="non_active">Non-Active</option>
                </select>
                <Filter className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 sm:w-3.5 sm:h-3.5 text-slate-500 pointer-events-none" />
              </div>
              
              <div className="relative flex-1 sm:flex-none">
                <select
                  value={sortField}
                  onChange={(e) => setSortField(e.target.value as SortField)}
                  className="w-full sm:w-auto px-3 sm:px-4 py-1.5 bg-[#f1f5f9] hover:bg-slate-200 transition-colors rounded-md text-xs sm:text-sm font-medium text-slate-600 tracking-wide cursor-pointer appearance-none pr-8"
                >
                  <option value="purchase_date">Sort by Date</option>
                  <option value="expiry_date">Sort by Expiry</option>
                  <option value="seller_name">Sort by Seller</option>
                  <option value="price">Sort by Price</option>
                </select>
              </div>

              <button
                onClick={loadData}
                className="px-3 sm:px-4 py-1.5 bg-[#f1f5f9] hover:bg-slate-200 transition-colors rounded-md text-xs sm:text-sm font-medium text-slate-600 tracking-wide flex items-center gap-1.5"
              >
                <RefreshCw className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                <span className="hidden sm:inline">Refresh</span>
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-slate-100/60">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search seller, email, plan..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 sm:pl-10 pr-9 sm:pr-10 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#3b5ce8] focus:border-[#3b5ce8] text-xs sm:text-sm transition-all placeholder:text-slate-400"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-100 rounded-full transition-colors"
                >
                  <X className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-slate-500" />
                </button>
              )}
            </div>
          </div>

          {/* DESKTOP TABLE */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full text-left border-collapse whitespace-nowrap">
              <thead>
                <tr className="bg-[#f8fafc] border-b border-slate-100 text-[11px] uppercase tracking-wider text-slate-500 font-bold">
                  <th className="px-6 py-4 w-[25%]">Seller</th>
                  <th className="px-6 py-4 w-[12%]">Plan</th>
                  <th className="px-6 py-4 w-[15%]">Purchase Date</th>
                  <th className="px-6 py-4 w-[15%]">Expires</th>
                  <th className="px-6 py-4 w-[13%]">Usage</th>
                  <th className="px-6 py-4 w-[10%]">Status</th>
                  <th className="px-6 py-4 w-[10%] text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100/80">
                {currentItems.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center">
                      <FileSpreadsheet className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                      <p className="text-slate-500 font-medium text-sm">No subscriptions found</p>
                      <p className="text-xs text-slate-400 mt-1">Try adjusting your filters</p>
                    </td>
                  </tr>
                ) : (
                  currentItems.map((sub, index) => (
                    <tr key={sub.id} className="hover:bg-slate-50/50 transition-colors">
                      {/* Seller */}
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className={`w-[38px] h-[38px] rounded-lg bg-gradient-to-br ${getAvatarGradient(index)} flex items-center justify-center shrink-0 shadow-inner`}>
                            {getAvatarShape(index)}
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="font-bold text-slate-800 text-[13px] truncate">{sub.seller_business_name}</span>
                            <span className="text-slate-500 text-sm truncate">{sub.seller_email}</span>
                          </div>
                        </div>
                      </td>

                      {/* Plan */}
                      <td className="px-6 py-5">
                        <div className="flex flex-col">
                          <span className="font-bold text-blue-600 text-[13px]">{sub.plan_name}</span>
                          <span className="text-slate-500 text-sm mt-0.5">₹{sub.plan_price}/mo</span>
                        </div>
                      </td>

                      {/* Purchase Date */}
                      <td className="px-6 py-5">
                        <div className="flex flex-col text-slate-600">
                          <span className="font-medium text-[13px]">{formatDate(sub.created_at)}</span>
                          <span className="text-slate-400 text-sm mt-0.5">{formatTime(sub.created_at)}</span>
                        </div>
                      </td>

                      {/* Expires */}
                      <td className="px-6 py-5">
                        <div className="flex flex-col">
                          <span className={`font-medium text-[13px] ${
                            sub.is_expired || sub.status === 'non_active' ? 'text-rose-600' : 'text-slate-600'
                          }`}>
                            {formatDate(sub.end_date)}
                          </span>
                          <span className="text-slate-400 text-sm mt-0.5">
                            {sub.status === 'non_active' ? 'History' :
                             sub.is_expired ? `Expired ${Math.abs(sub.days_remaining)} days ago` :
                             `${sub.days_remaining} days left`}
                          </span>
                        </div>
                      </td>

                      {/* Usage */}
                      <td className="px-6 py-5">
                        <div className="flex flex-col gap-1.5 w-full pr-4">
                          <div className="flex justify-between items-baseline">
                            <span className="font-bold text-slate-800 text-[13px]">
                              {sub.current_scan_count}/{sub.plan_scan_limit === -1 ? '∞' : sub.plan_scan_limit}
                            </span>
                            <span className="text-slate-500 text-[13px]">
                              {sub.plan_scan_limit === -1 ? '∞' : `${sub.scan_percentage}%`}
                            </span>
                          </div>
                          {sub.plan_scan_limit !== -1 && (
                            <div className="w-full bg-slate-200 h-[3px] rounded-full overflow-hidden">
                              <div 
                                className={`h-full rounded-full ${
                                  sub.scan_percentage >= 90 ? 'bg-[#dc2626]' :
                                  sub.scan_percentage >= 70 ? 'bg-[#f59e0b]' :
                                  'bg-[#5c40d8]'
                                }`}
                                style={{ width: `${sub.scan_percentage}%` }}
                              ></div>
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-5">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold tracking-wide ${sub.status_color}`}>
                          {sub.status_badge}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-5 text-right">
                        <button 
                          onClick={() => handleViewDetails(sub)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#eff4ff] hover:bg-blue-100 transition-colors rounded-md text-[13px] font-bold text-[#3b5ce8]"
                        >
                          <Eye size={14} className="stroke-[2.5]" /> View Details
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* MOBILE CARDS */}
          <div className="lg:hidden divide-y divide-slate-100">
            {currentItems.length === 0 ? (
              <div className="p-8 sm:p-12 text-center">
                <FileSpreadsheet className="w-12 h-12 sm:w-16 sm:h-16 text-slate-300 mx-auto mb-3 sm:mb-4" />
                <p className="text-slate-500 font-medium text-sm sm:text-base">No subscriptions found</p>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">Try adjusting your filters</p>
              </div>
            ) : (
              currentItems.map((sub, index) => (
                <div key={sub.id} className="p-4 sm:p-5 hover:bg-slate-50/50 transition-colors">
                  {/* Mobile Card Header */}
                  <div className="flex items-start gap-3 mb-3">
                    <div className={`w-10 h-10 sm:w-[38px] sm:h-[38px] rounded-lg bg-gradient-to-br ${getAvatarGradient(index)} flex items-center justify-center shrink-0 shadow-inner`}>
                      {getAvatarShape(index)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-slate-800 text-sm sm:text-[13px] truncate">{sub.seller_business_name}</h3>
                      <p className="text-slate-500 text-xs sm:text-sm truncate">{sub.seller_email}</p>
                    </div>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-bold tracking-wide shrink-0 ${sub.status_color}`}>
                      {sub.status_badge}
                    </span>
                  </div>

                  {/* Mobile Card Content */}
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div className="bg-slate-50 rounded-lg p-2.5 sm:p-3">
                      <p className="text-[10px] sm:text-xs text-slate-600 mb-1">Plan</p>
                      <p className="font-bold text-blue-600 text-xs sm:text-[13px] truncate">{sub.plan_name}</p>
                      <p className="text-slate-500 text-[10px] sm:text-xs mt-0.5">₹{sub.plan_price}/mo</p>
                    </div>
                    <div className="bg-slate-50 rounded-lg p-2.5 sm:p-3">
                      <p className="text-[10px] sm:text-xs text-slate-600 mb-1">Usage</p>
                      <p className="font-bold text-slate-800 text-xs sm:text-[13px]">
                        {sub.current_scan_count}/{sub.plan_scan_limit === -1 ? '∞' : sub.plan_scan_limit}
                      </p>
                      {sub.plan_scan_limit !== -1 && (
                        <div className="w-full bg-slate-200 h-[2px] sm:h-[3px] rounded-full overflow-hidden mt-1.5">
                          <div 
                            className={`h-full rounded-full ${
                              sub.scan_percentage >= 90 ? 'bg-[#dc2626]' :
                              sub.scan_percentage >= 70 ? 'bg-[#f59e0b]' :
                              'bg-[#5c40d8]'
                            }`}
                            style={{ width: `${sub.scan_percentage}%` }}
                          ></div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div>
                      <p className="text-[10px] sm:text-xs text-slate-600 mb-1">Purchased</p>
                      <p className="font-medium text-slate-800 text-xs sm:text-[13px]">{formatDate(sub.created_at)}</p>
                    </div>
                    <div>
                      <p className="text-[10px] sm:text-xs text-slate-600 mb-1">Expires</p>
                      <p className={`font-medium text-xs sm:text-[13px] ${sub.is_expired ? 'text-rose-600' : 'text-slate-800'}`}>
                        {formatDate(sub.end_date)}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleViewDetails(sub)}
                    className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-[#eff4ff] hover:bg-blue-100 transition-colors rounded-md text-xs sm:text-[13px] font-bold text-[#3b5ce8]"
                  >
                    <Eye size={14} className="stroke-[2.5]" /> View Details
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Footer Pagination */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row justify-between items-center p-4 sm:p-6 border-t border-slate-100/80 gap-3 sm:gap-0">
              <span className="text-slate-500 text-xs sm:text-[13px] order-2 sm:order-1">
                Showing {startIndex + 1} to {Math.min(endIndex, filteredAndSortedSubscriptions.length)} of {filteredAndSortedSubscriptions.length} results
              </span>
              <div className="flex items-center gap-1 order-1 sm:order-2">
                <button 
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-1.5 text-slate-400 hover:text-slate-600 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ChevronLeft size={16} strokeWidth={2.5} />
                </button>
                {getPageNumbers().map((page, idx) => {
                  if (page === '...') {
                    return (
                      <span key={`ellipsis-${idx}`} className="w-6 h-6 sm:w-7 sm:h-7 flex items-end justify-center text-slate-400 text-xs pb-1 tracking-widest">
                        ...
                      </span>
                    );
                  }
                  return (
                    <button
                      key={page}
                      onClick={() => goToPage(page as number)}
                      className={`w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center rounded-[4px] text-xs sm:text-[13px] font-bold transition-colors ${
                        currentPage === page
                          ? 'bg-[#0147ff] text-white'
                          : 'hover:bg-slate-100 text-slate-700'
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}
                <button 
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-1.5 text-slate-400 hover:text-slate-600 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ChevronRight size={16} strokeWidth={2.5} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* DETAILS MODAL */}
      {showDetailsModal && selectedSubscription && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-lg sm:rounded-xl shadow-2xl w-full max-w-4xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden flex flex-col my-4 sm:my-8">
            
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-[#3b5ce8] to-[#5c40d8] text-white p-4 sm:p-6 sticky top-0 z-10">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <h3 className="text-base sm:text-xl font-bold mb-1">
                    {selectedSubscription.status === 'non_active' ? 'Past Plan Details' : 'Subscription Details'}
                  </h3>
                  <p className="text-white/90 text-xs sm:text-sm">Complete subscription and seller analytics</p>
                </div>
                <button
                  onClick={() => {
                    setShowDetailsModal(false);
                    setSelectedSubscription(null);
                    setSellerAnalytics(null);
                  }}
                  className="p-1.5 sm:p-2 hover:bg-white/20 rounded-lg transition-colors shrink-0"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-6 flex-1">
              
              {/* Seller Analytics */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-lg sm:rounded-xl p-4 sm:p-5">
                <h4 className="text-sm sm:text-base font-bold text-slate-900 mb-3 sm:mb-4 flex items-center gap-2 border-b border-blue-300 pb-2 sm:pb-3">
                  <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                  Seller Performance
                </h4>
                {loadingAnalytics ? (
                  <div className="flex items-center justify-center py-6">
                    <Loader className="w-8 h-8 text-blue-600 animate-spin" />
                  </div>
                ) : sellerAnalytics ? (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
                    <div className="bg-white border border-blue-200 rounded-lg p-2.5 sm:p-3">
                      <p className="text-[9px] sm:text-[10px] font-bold text-blue-700 uppercase tracking-wide mb-1">Plans</p>
                      <p className="text-xl sm:text-2xl font-bold text-blue-900">{sellerAnalytics.totalPlans}</p>
                    </div>
                    <div className="bg-white border border-emerald-200 rounded-lg p-2.5 sm:p-3">
                      <p className="text-[9px] sm:text-[10px] font-bold text-emerald-700 uppercase tracking-wide mb-1">Revenue</p>
                      <p className="text-lg sm:text-xl font-bold text-emerald-900">₹{(sellerAnalytics.totalRevenue / 1000).toFixed(0)}K</p>
                    </div>
                    <div className="bg-white border border-green-200 rounded-lg p-2.5 sm:p-3">
                      <p className="text-[9px] sm:text-[10px] font-bold text-green-700 uppercase tracking-wide mb-1">Active</p>
                      <p className="text-xl sm:text-2xl font-bold text-green-900">{sellerAnalytics.activeSubscriptions}</p>
                    </div>
                    <div className="bg-white border border-rose-200 rounded-lg p-2.5 sm:p-3">
                      <p className="text-[9px] sm:text-[10px] font-bold text-rose-700 uppercase tracking-wide mb-1">Expired</p>
                      <p className="text-xl sm:text-2xl font-bold text-rose-900">{sellerAnalytics.expiredSubscriptions}</p>
                    </div>
                  </div>
                ) : null}
              </div>

              {/* Seller Information */}
              <div>
                <h4 className="text-sm sm:text-base font-bold text-slate-900 mb-3 sm:mb-4 flex items-center gap-2 border-b border-slate-200 pb-2 sm:pb-3">
                  <Users className="w-4 h-4 sm:w-5 sm:h-5 text-slate-700" />
                  Seller Information
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                  <div className="bg-slate-50 rounded-lg p-2.5 sm:p-3">
                    <p className="text-[9px] sm:text-[10px] text-slate-600 uppercase tracking-wide mb-1">Business Name</p>
                    <p className="font-bold text-slate-900 text-xs sm:text-sm break-words">{selectedSubscription.seller_business_name}</p>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-2.5 sm:p-3">
                    <p className="text-[9px] sm:text-[10px] text-slate-600 uppercase tracking-wide mb-1">Owner Name</p>
                    <p className="font-bold text-slate-900 text-xs sm:text-sm break-words">{selectedSubscription.seller_owner_name}</p>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-2.5 sm:p-3">
                    <p className="text-[9px] sm:text-[10px] text-slate-600 uppercase tracking-wide mb-1 flex items-center gap-1">
                      <Mail className="w-3 h-3" /> Email
                    </p>
                    <p className="font-medium text-slate-900 text-xs sm:text-sm break-words">{selectedSubscription.seller_email}</p>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-2.5 sm:p-3">
                    <p className="text-[9px] sm:text-[10px] text-slate-600 uppercase tracking-wide mb-1 flex items-center gap-1">
                      <Phone className="w-3 h-3" /> Phone
                    </p>
                    <p className="font-medium text-slate-900 text-xs sm:text-sm">{selectedSubscription.seller_phone || 'N/A'}</p>
                  </div>
                </div>
              </div>

              {/* Plan Information */}
              <div>
                <h4 className="text-sm sm:text-base font-bold text-slate-900 mb-3 sm:mb-4 flex items-center gap-2 border-b border-slate-200 pb-2 sm:pb-3">
                  <Package className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                  Plan Information
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-2.5 sm:p-3">
                    <p className="text-[9px] sm:text-[10px] text-blue-700 uppercase tracking-wide mb-1 font-bold">Plan Name</p>
                    <p className="font-bold text-blue-900 text-sm sm:text-base">{selectedSubscription.plan_name}</p>
                  </div>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-2.5 sm:p-3">
                    <p className="text-[9px] sm:text-[10px] text-blue-700 uppercase tracking-wide mb-1 font-bold">Price</p>
                    <p className="font-bold text-blue-900 text-sm sm:text-base">
                      ₹{selectedSubscription.plan_price} / {selectedSubscription.plan_billing_cycle}
                    </p>
                  </div>
                </div>
              </div>

              {/* Timeline */}
              <div>
                <h4 className="text-sm sm:text-base font-bold text-slate-900 mb-3 sm:mb-4 flex items-center gap-2 border-b border-slate-200 pb-2 sm:pb-3">
                  <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600" />
                  Timeline
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
                  <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-2.5 sm:p-3">
                    <p className="text-[9px] sm:text-[10px] text-emerald-700 uppercase tracking-wide mb-1 font-bold">Start</p>
                    <p className="font-bold text-slate-900 text-xs sm:text-sm">{formatDate(selectedSubscription.start_date)}</p>
                  </div>
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-2.5 sm:p-3">
                    <p className="text-[9px] sm:text-[10px] text-orange-700 uppercase tracking-wide mb-1 font-bold">End</p>
                    <p className="font-bold text-slate-900 text-xs sm:text-sm">{formatDate(selectedSubscription.end_date)}</p>
                  </div>
                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-2.5 sm:p-3">
                    <p className="text-[9px] sm:text-[10px] text-slate-700 uppercase tracking-wide mb-1 font-bold">Status</p>
                    <span className={`inline-flex items-center px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold ${selectedSubscription.status_color}`}>
                      {selectedSubscription.status_badge}
                    </span>
                  </div>
                </div>
              </div>

              {/* Payment Info */}
              {selectedSubscription.payment_id && (
                <div>
                  <h4 className="text-sm sm:text-base font-bold text-slate-900 mb-3 sm:mb-4 flex items-center gap-2 border-b border-slate-200 pb-2 sm:pb-3">
                    <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
                    Payment Details
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                    <div className="bg-slate-50 rounded-lg p-2.5 sm:p-3">
                      <p className="text-[9px] sm:text-[10px] text-slate-600 uppercase tracking-wide mb-1">Payment ID</p>
                      <p className="font-mono text-[10px] sm:text-xs font-bold text-slate-900 break-all">{selectedSubscription.payment_id}</p>
                    </div>
                    <div className="bg-slate-50 rounded-lg p-2.5 sm:p-3">
                      <p className="text-[9px] sm:text-[10px] text-slate-600 uppercase tracking-wide mb-1">Transaction ID</p>
                      <p className="font-mono text-[10px] sm:text-xs font-bold text-slate-900 break-all">{selectedSubscription.transaction_id || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-slate-50 border-t border-slate-200 p-3 sm:p-4">
              <button
                onClick={() => {
                  setShowDetailsModal(false);
                  setSelectedSubscription(null);
                  setSellerAnalytics(null);
                }}
                className="w-full px-5 sm:px-6 py-2 sm:py-2.5 bg-[#3b5ce8] hover:bg-[#5c40d8] text-white rounded-lg font-bold text-xs sm:text-sm transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BillingHistory;