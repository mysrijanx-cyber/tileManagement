
// import React, { useState, useEffect, useMemo, useCallback } from 'react';
// import {
//   Search,
//   Filter,
//   Eye,
//   X,
//   Package,
//   Calendar,
//   CreditCard,
//   Users,
//   RefreshCw,
//   ChevronLeft,
//   ChevronRight,
//   Clock,
//   CheckCircle,
//   AlertCircle,
//   Mail,
//   Phone,
//   IndianRupee,
//   QrCode,
//   Loader,
//   FileSpreadsheet,
//   TrendingUp,
//   Award,
//   Repeat,
//   DollarSign,
//   BarChart3
// } from 'lucide-react';
// import { collection, query, getDocs, orderBy, limit, where, onSnapshot } from 'firebase/firestore';
// import { db } from '../lib/firebase';

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

// type FilterStatus = 'all' | 'active' | 'expired' | 'expiring_soon';
// type SortField = 'purchase_date' | 'expiry_date' | 'seller_name' | 'price';

// // ═══════════════════════════════════════════════════════════════
// // ✅ MAIN COMPONENT
// // ═══════════════════════════════════════════════════════════════

// export const BillingHistory: React.FC = () => {
//   // ═══════════════════════════════════════════════════════════════
//   // STATE MANAGEMENT
//   // ═══════════════════════════════════════════════════════════════

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

//   // ═══════════════════════════════════════════════════════════════
//   // UTILITY FUNCTIONS
//   // ═══════════════════════════════════════════════════════════════

//   const calculateDaysRemaining = useCallback((endDate: string): number => {
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
//     const status = subscription.status;

//     if (status === 'completed' || status === 'replaced') {
//       return {
//         color: 'bg-gray-100 text-gray-800 border-gray-300',
//         badge: status === 'completed' ? 'Completed' : 'Replaced',
//         isExpiringSoon: false,
//         isExpired: true
//       };
//     }

//     if (daysRemaining === 0 || new Date(subscription.end_date) < new Date()) {
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

//   // ═══════════════════════════════════════════════════════════════
//   // SELLER ANALYTICS CALCULATION
//   // ═══════════════════════════════════════════════════════════════

//   const calculateSellerAnalytics = useCallback((sellerId: string): SellerAnalytics => {
//     // Get all subscriptions for this seller (including completed and replaced)
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

//     // Calculate total revenue
//     const totalRevenue = sellerSubscriptions.reduce((sum, sub) => {
//       return sum + (sub.payment_amount || sub.plan_price || 0);
//     }, 0);

//     // Plan breakdown with purchase count, renew count, and total spent
//     const planMap = new Map<string, {
//       purchaseCount: number;
//       renewCount: number;
//       totalSpent: number;
//     }>();

//     sellerSubscriptions.forEach(sub => {
//       const existing = planMap.get(sub.plan_name) || {
//         purchaseCount: 0,
//         renewCount: 0,
//         totalSpent: 0
//       };

//       existing.purchaseCount += 1;
//       existing.totalSpent += (sub.payment_amount || sub.plan_price || 0);

//       // Count as renewal if it's not the first purchase of this plan
//       if (existing.purchaseCount > 1) {
//         existing.renewCount += 1;
//       }

//       planMap.set(sub.plan_name, existing);
//     });

//     // Convert to array for breakdown
//     const planBreakdown = Array.from(planMap.entries()).map(([planName, data]) => ({
//       planName,
//       purchaseCount: data.purchaseCount,
//       renewCount: data.renewCount,
//       totalSpent: data.totalSpent
//     })).sort((a, b) => b.totalSpent - a.totalSpent);

//     // Find most purchased plan
//     let mostPurchasedPlan = { name: 'N/A', count: 0 };
//     planBreakdown.forEach(plan => {
//       if (plan.purchaseCount > mostPurchasedPlan.count) {
//         mostPurchasedPlan = { name: plan.planName, count: plan.purchaseCount };
//       }
//     });

//     // Find most renewed plan
//     let mostRenewedPlan = { name: 'N/A', count: 0 };
//     planBreakdown.forEach(plan => {
//       if (plan.renewCount > mostRenewedPlan.count) {
//         mostRenewedPlan = { name: plan.planName, count: plan.renewCount };
//       }
//     });

//     // Count active and expired
//     const activeSubscriptions = sellerSubscriptions.filter(sub => 
//       sub.status === 'active' && !sub.is_expired
//     ).length;

//     const expiredSubscriptions = sellerSubscriptions.filter(sub => 
//       sub.is_expired || sub.status === 'completed' || sub.status === 'replaced'
//     ).length;

//     // Get first and last purchase dates
//     const sortedByDate = [...sellerSubscriptions].sort((a, b) => 
//       new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
//     );

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

//   // ═══════════════════════════════════════════════════════════════
//   // DATA LOADING WITH REAL-TIME UPDATES
//   // ═══════════════════════════════════════════════════════════════

//   const loadData = useCallback(async () => {
//     try {
//       setLoading(true);
//       setError(null);
//       console.log('📊 Loading billing history...');

//       const subscriptionsQuery = query(
//         collection(db, 'subscriptions'),
//         orderBy('created_at', 'desc'),
//         limit(500)
//       );

//       const subscriptionsSnapshot = await getDocs(subscriptionsQuery);

//       if (subscriptionsSnapshot.empty) {
//         console.log('ℹ️ No subscriptions found');
//         setSubscriptions([]);
//         setLoading(false);
//         return;
//       }

//       console.log(`✅ Fetched ${subscriptionsSnapshot.size} subscriptions`);

//       const sellerIds = new Set<string>();
//       const planIds = new Set<string>();
//       const paymentIds = new Set<string>();

//       subscriptionsSnapshot.docs.forEach(doc => {
//         const data = doc.data();
//         if (data.seller_id) sellerIds.add(data.seller_id);
//         if (data.plan_id) planIds.add(data.plan_id);
//         if (data.last_payment_id) paymentIds.add(data.last_payment_id);
//       });

//       // Fetch sellers in batches
//       const sellersMap = new Map<string, any>();
//       const sellerIdsArray = Array.from(sellerIds);

//       for (let i = 0; i < sellerIdsArray.length; i += 10) {
//         const batch = sellerIdsArray.slice(i, i + 10);
//         const sellersQuery = query(
//           collection(db, 'sellers'),
//           where('user_id', 'in', batch)
//         );
//         const sellersSnapshot = await getDocs(sellersQuery);
//         sellersSnapshot.docs.forEach(doc => {
//           const data = doc.data();
//           sellersMap.set(data.user_id, data);
//         });
//       }

//       // Fetch plans in batches
//       const plansMap = new Map<string, any>();
//       const planIdsArray = Array.from(planIds);

//       for (let i = 0; i < planIdsArray.length; i += 10) {
//         const batch = planIdsArray.slice(i, i + 10);
//         const plansQuery = query(
//           collection(db, 'plans'),
//           where('__name__', 'in', batch)
//         );
//         const plansSnapshot = await getDocs(plansQuery);
//         plansSnapshot.docs.forEach(doc => {
//           plansMap.set(doc.id, doc.data());
//         });
//       }

//       // Fetch payments in batches
//       const paymentsMap = new Map<string, any>();
//       const paymentIdsArray = Array.from(paymentIds).filter(id => id);

//       for (let i = 0; i < paymentIdsArray.length; i += 10) {
//         const batch = paymentIdsArray.slice(i, i + 10);
//         if (batch.length === 0) continue;
//         const paymentsQuery = query(
//           collection(db, 'payments'),
//           where('__name__', 'in', batch)
//         );
//         const paymentsSnapshot = await getDocs(paymentsQuery);
//         paymentsSnapshot.docs.forEach(doc => {
//           paymentsMap.set(doc.id, doc.data());
//         });
//       }

//       // Enrich subscriptions
//       const enrichedSubscriptions: EnrichedSubscription[] = subscriptionsSnapshot.docs.map(doc => {
//         const subData = doc.data();
//         const seller = sellersMap.get(subData.seller_id) || {};
//         const plan = plansMap.get(subData.plan_id) || {};
//         const payment = paymentsMap.get(subData.last_payment_id) || {};

//         const daysRemaining = calculateDaysRemaining(subData.end_date);
//         const statusInfo = getStatusInfo({
//           ...subData,
//           days_remaining: daysRemaining,
//           plan_scan_limit: plan.limits?.max_scans ?? -1,
//           current_scan_count: subData.current_scan_count || 0
//         } as EnrichedSubscription);

//         const scanLimit = plan.limits?.max_scans ?? -1;
//         const scanPercentage = calculateScanPercentage(
//           subData.current_scan_count || 0,
//           scanLimit
//         );

//         return {
//           id: doc.id,
//           seller_id: subData.seller_id || '',
//           plan_id: subData.plan_id || '',
//           plan_name: subData.plan_name || plan.plan_name || 'Unknown',
//           status: subData.status || 'active',
//           start_date: subData.start_date || '',
//           end_date: subData.end_date || '',
//           current_scan_count: subData.current_scan_count || 0,
//           last_payment_id: subData.last_payment_id,
//           created_at: subData.created_at || '',
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
//           payment_amount: payment.amount,
//           payment_id: payment.razorpay_payment_id,
//           transaction_id: payment.transaction_id,
//           payment_date: payment.created_at,
//           days_remaining: daysRemaining,
//           status_color: statusInfo.color,
//           status_badge: statusInfo.badge,
//           scan_percentage: scanPercentage,
//           is_expiring_soon: statusInfo.isExpiringSoon,
//           is_expired: statusInfo.isExpired
//         };
//       });

//       setSubscriptions(enrichedSubscriptions);
//       calculateStatistics(enrichedSubscriptions);

//       console.log('✅ Billing history loaded successfully');

//     } catch (error: any) {
//       console.error('❌ Error loading billing history:', error);
//       setError(`Failed to load data: ${error.message}`);
//     } finally {
//       setLoading(false);
//     }
//   }, [calculateDaysRemaining, getStatusInfo, calculateScanPercentage]);

//   const calculateStatistics = useCallback((subs: EnrichedSubscription[]) => {
//     const now = new Date();
//     const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

//     const activeSubscriptions = subs.filter(s => 
//       s.status === 'active' && 
//       !s.is_expired && 
//       s.status !== 'completed' && 
//       s.status !== 'replaced'
//     );

//     const stats: Statistics = {
//       totalActive: activeSubscriptions.length,
//       totalRevenue: subs
//         .filter(s => s.payment_amount)
//         .reduce((sum, s) => sum + (s.payment_amount || 0), 0),
//       expiringSoon: subs.filter(s => s.is_expiring_soon && s.status !== 'completed' && s.status !== 'replaced').length,
//       expiredThisMonth: subs.filter(s => {
//         if (!s.end_date) return false;
//         const endDate = new Date(s.end_date);
//         return endDate >= monthStart && endDate <= now && s.is_expired && s.status !== 'completed' && s.status !== 'replaced';
//       }).length,
//       renewedThisMonth: subs.filter(s => {
//         if (!s.created_at) return false;
//         const createdDate = new Date(s.created_at);
//         return createdDate >= monthStart && (s.status !== 'completed' && s.status !== 'replaced');
//       }).length
//     };

//     setStatistics(stats);
//   }, []);

//   // ═══════════════════════════════════════════════════════════════
//   // HANDLE VIEW DETAILS WITH ANALYTICS
//   // ═══════════════════════════════════════════════════════════════

//   const handleViewDetails = useCallback((subscription: EnrichedSubscription) => {
//     setSelectedSubscription(subscription);
//     setShowDetailsModal(true);
//     setLoadingAnalytics(true);

//     // Calculate seller analytics
//     setTimeout(() => {
//       const analytics = calculateSellerAnalytics(subscription.seller_id);
//       setSellerAnalytics(analytics);
//       setLoadingAnalytics(false);
//     }, 300); // Small delay for smooth UX
//   }, [calculateSellerAnalytics]);

//   // ═══════════════════════════════════════════════════════════════
//   // REAL-TIME LISTENER
//   // ═══════════════════════════════════════════════════════════════

//   useEffect(() => {
//     loadData();

//     const subscriptionsQuery = query(
//       collection(db, 'subscriptions'),
//       orderBy('created_at', 'desc'),
//       limit(500)
//     );

//     const unsubscribe = onSnapshot(
//       subscriptionsQuery,
//       (snapshot) => {
//         if (!snapshot.empty) {
//           console.log('🔄 Real-time update detected, refreshing data...');
//           loadData();
//         }
//       },
//       (error) => {
//         console.error('❌ Real-time listener error:', error);
//       }
//     );

//     return () => unsubscribe();
//   }, [loadData]);

//   // ═══════════════════════════════════════════════════════════════
//   // FILTERING & SORTING
//   // ═══════════════════════════════════════════════════════════════

//   const filteredAndSortedSubscriptions = useMemo(() => {
//     let filtered = subscriptions.filter(sub => 
//       sub.status !== 'completed' && sub.status !== 'replaced'
//     );

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
//         filtered = filtered.filter(s => s.status === 'active' && !s.is_expired);
//       } else if (filterStatus === 'expired') {
//         filtered = filtered.filter(s => s.is_expired);
//       } else if (filterStatus === 'expiring_soon') {
//         filtered = filtered.filter(s => s.is_expiring_soon);
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
//           compareA = new Date(a.created_at).getTime();
//           compareB = new Date(b.created_at).getTime();
//           break;
//         case 'expiry_date':
//           compareA = new Date(a.end_date).getTime();
//           compareB = new Date(b.end_date).getTime();
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

//   // ═══════════════════════════════════════════════════════════════
//   // PAGINATION
//   // ═══════════════════════════════════════════════════════════════

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

//   // ═══════════════════════════════════════════════════════════════
//   // HELPER FUNCTIONS
//   // ═══════════════════════════════════════════════════════════════

//   const formatDate = useCallback((dateString: string): string => {
//     if (!dateString || dateString === 'N/A') return 'N/A';
//     return new Date(dateString).toLocaleDateString('en-IN', {
//       day: '2-digit',
//       month: 'short',
//       year: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
//     });
//   }, []);

//   const formatCurrency = useCallback((amount: number): string => {
//     return `₹${amount.toLocaleString('en-IN')}`;
//   }, []);

//   const getUniquePlans = useCallback((): string[] => {
//     const plans = new Set(subscriptions
//       .filter(s => s.status !== 'completed' && s.status !== 'replaced')
//       .map(s => s.plan_name)
//     );
//     return Array.from(plans).sort();
//   }, [subscriptions]);

//   // ═══════════════════════════════════════════════════════════════
//   // RENDER - LOADING STATE
//   // ═══════════════════════════════════════════════════════════════

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center py-20">
//         <div className="text-center">
//           <Loader className="w-16 h-16 text-purple-600 animate-spin mx-auto mb-4" />
//           <p className="text-base text-gray-600 font-medium">Loading billing history...</p>
//           <p className="text-sm text-gray-500 mt-2">Fetching subscription data</p>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="bg-red-50 border-2 border-red-200 rounded-xl p-8">
//         <div className="flex flex-col items-center text-center gap-4">
//           <div className="p-3 bg-red-100 rounded-full">
//             <AlertCircle className="w-10 h-10 text-red-600" />
//           </div>
//           <div>
//             <h3 className="text-xl font-bold text-red-800 mb-2">Failed to Load Data</h3>
//             <p className="text-base text-red-700 mb-4">{error}</p>
//           </div>
//           <button
//             onClick={loadData}
//             className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
//           >
//             <RefreshCw className="w-5 h-5" />
//             Retry
//           </button>
//         </div>
//       </div>
//     );
//   }

//   // ═══════════════════════════════════════════════════════════════
//   // RENDER - MAIN UI
//   // ═══════════════════════════════════════════════════════════════

//   return (
//     <div className="space-y-6">
//       {/* HEADER */}
//       <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl p-6 text-white shadow-lg">
//         <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
//           <div>
//             <h2 className="text-2xl lg:text-3xl font-bold mb-2 flex items-center gap-3">
//               <CreditCard className="w-7 h-7 lg:w-8 lg:h-8" />
//               Billing History
//             </h2>
//             <p className="text-purple-100 text-base lg:text-lg">
//               Complete subscription overview for all sellers
//             </p>
//           </div>
//           <button
//             onClick={loadData}
//             className="flex items-center gap-2 px-5 py-3 bg-white/20 backdrop-blur-md border border-white/30 rounded-lg hover:bg-white/30 transition-all text-base font-medium shadow-md hover:shadow-lg"
//           >
//             <RefreshCw className="w-5 h-5" />
//             Refresh
//           </button>
//         </div>
//       </div>

//       {/* STATISTICS CARDS */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
//         <div className="bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
//           <div className="flex items-center gap-3 mb-3">
//             <div className="p-2.5 bg-green-200 rounded-lg">
//               <CheckCircle className="w-6 h-6 text-green-700" />
//             </div>
//             <span className="text-sm font-bold text-green-700">Total Active</span>
//           </div>
//           <p className="text-3xl lg:text-4xl font-bold text-green-900 mb-1">{statistics.totalActive}</p>
//           <p className="text-sm text-green-600">Subscriptions</p>
//         </div>

//         <div className="bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
//           <div className="flex items-center gap-3 mb-3">
//             <div className="p-2.5 bg-purple-200 rounded-lg">
//               <IndianRupee className="w-6 h-6 text-purple-700" />
//             </div>
//             <span className="text-sm font-bold text-purple-700">Total Revenue</span>
//           </div>
//           <p className="text-3xl lg:text-4xl font-bold text-purple-900 mb-1">
//             ₹{statistics.totalRevenue.toLocaleString('en-IN')}
//           </p>
//           <p className="text-sm text-purple-600">All Time</p>
//         </div>

//         <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-2 border-yellow-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
//           <div className="flex items-center gap-3 mb-3">
//             <div className="p-2.5 bg-yellow-200 rounded-lg">
//               <Clock className="w-6 h-6 text-yellow-700" />
//             </div>
//             <span className="text-sm font-bold text-yellow-700">Expiring Soon</span>
//           </div>
//           <p className="text-3xl lg:text-4xl font-bold text-yellow-900 mb-1">{statistics.expiringSoon}</p>
//           <p className="text-sm text-yellow-600">(&lt; 7 days)</p>
//         </div>

//         <div className="bg-gradient-to-br from-red-50 to-red-100 border-2 border-red-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
//           <div className="flex items-center gap-3 mb-3">
//             <div className="p-2.5 bg-red-200 rounded-lg">
//               <AlertCircle className="w-6 h-6 text-red-700" />
//             </div>
//             <span className="text-sm font-bold text-red-700">Expired</span>
//           </div>
//           <p className="text-3xl lg:text-4xl font-bold text-red-900 mb-1">{statistics.expiredThisMonth}</p>
//           <p className="text-sm text-red-600">This Month</p>
//         </div>

        
//       </div>

//       {/* FILTERS & SEARCH */}
//       <div className="bg-white rounded-xl border-2 border-gray-200 p-5 space-y-4 shadow-sm">
//         <div className="relative">
//           <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
//           <input
//             type="text"
//             placeholder="Search by seller, email, plan, transaction ID..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="w-full pl-12 pr-12 py-3.5 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-base transition-all"
//           />
//           {searchTerm && (
//             <button
//               onClick={() => setSearchTerm('')}
//               className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 hover:bg-gray-100 rounded-full transition-colors"
//             >
//               <X className="w-5 h-5 text-gray-500" />
//             </button>
//           )}
//         </div>

//         <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//           <div className="relative">
//             <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
//             <select
//               value={filterStatus}
//               onChange={(e) => setFilterStatus(e.target.value as FilterStatus)}
//               className="w-full pl-11 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-base bg-white cursor-pointer transition-all appearance-none"
//             >
//               <option value="all">All Status</option>
//               <option value="active">Active Only</option>
//               <option value="expired">Expired Only</option>
//               <option value="expiring_soon">Expiring Soon</option>
//             </select>
//           </div>

//           <div className="relative">
//             <Package className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
//             <select
//               value={filterPlan}
//               onChange={(e) => setFilterPlan(e.target.value)}
//               className="w-full pl-11 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-base bg-white cursor-pointer transition-all appearance-none"
//             >
//               <option value="all">All Plans</option>
//               {getUniquePlans().map(plan => (
//                 <option key={plan} value={plan}>{plan}</option>
//               ))}
//             </select>
//           </div>

//           <div className="relative">
//             <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
//             <select
//               value={sortField}
//               onChange={(e) => setSortField(e.target.value as SortField)}
//               className="w-full pl-11 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-base bg-white cursor-pointer transition-all appearance-none"
//             >
//               <option value="purchase_date">Sort by Purchase Date</option>
//               <option value="expiry_date">Sort by Expiry Date</option>
//               <option value="seller_name">Sort by Seller Name</option>
//               <option value="price">Sort by Price</option>
//             </select>
//           </div>
//         </div>

//         <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t-2 border-gray-100">
//           <p className="text-sm text-gray-600">
//             Showing <span className="font-bold text-purple-600">{startIndex + 1}</span> - <span className="font-bold text-purple-600">{Math.min(endIndex, filteredAndSortedSubscriptions.length)}</span> of <span className="font-bold text-purple-600">{filteredAndSortedSubscriptions.length}</span> subscriptions
//           </p>
//           {(searchTerm || filterStatus !== 'all' || filterPlan !== 'all') && (
//             <button
//               onClick={() => {
//                 setSearchTerm('');
//                 setFilterStatus('all');
//                 setFilterPlan('all');
//               }}
//               className="text-sm text-purple-600 hover:text-purple-700 font-medium underline"
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
//                 <th className="text-left p-5 font-bold text-gray-800 text-base">Seller Info</th>
//                 <th className="text-left p-5 font-bold text-gray-800 text-base">Plan Details</th>
//                 <th className="text-left p-5 font-bold text-gray-800 text-base">Purchased</th>
//                 <th className="text-left p-5 font-bold text-gray-800 text-base">Expires</th>
//                 <th className="text-left p-5 font-bold text-gray-800 text-base">Usage</th>
//                 <th className="text-left p-5 font-bold text-gray-800 text-base">Status</th>
//                 <th className="text-left p-5 font-bold text-gray-800 text-base">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {currentItems.length === 0 ? (
//                 <tr>
//                   <td colSpan={7} className="p-12 text-center">
//                     <div className="flex flex-col items-center gap-4">
//                       <FileSpreadsheet className="w-20 h-20 text-gray-300" />
//                       <p className="text-gray-500 font-medium text-lg">No subscriptions found</p>
//                       <p className="text-base text-gray-400">Try adjusting your filters</p>
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
//                     <td className="p-5">
//                       <div className="flex items-center gap-3">
//                         <div className="p-2.5 bg-purple-100 rounded-lg flex-shrink-0">
//                           <Users className="w-6 h-6 text-purple-600" />
//                         </div>
//                         <div className="min-w-0">
//                           <p className="font-bold text-gray-900 text-base truncate">{sub.seller_business_name}</p>
//                           <p className="text-sm text-gray-600 truncate">{sub.seller_owner_name}</p>
//                           <div className="flex items-center gap-1.5 text-sm text-gray-500 mt-1">
//                             <Mail className="w-4 h-4 flex-shrink-0" />
//                             <span className="truncate">{sub.seller_email}</span>
//                           </div>
//                         </div>
//                       </div>
//                     </td>

//                     <td className="p-5">
//                       <div className="flex items-center gap-3">
//                         <Package className="w-5 h-5 text-indigo-600 flex-shrink-0" />
//                         <div>
//                           <p className="font-bold text-gray-900 text-base">{sub.plan_name}</p>
//                           <p className="text-sm text-gray-600 flex items-center gap-1">
//                             <IndianRupee className="w-4 h-4" />
//                             {formatCurrency(sub.plan_price)} / {sub.plan_billing_cycle}
//                           </p>
//                           <p className="text-sm text-gray-500">{sub.plan_validity_duration} {sub.plan_validity_unit}</p>
//                         </div>
//                       </div>
//                     </td>

//                     <td className="p-5">
//                       <div className="flex items-center gap-2.5">
//                         <Calendar className="w-5 h-5 text-blue-600 flex-shrink-0" />
//                         <div>
//                           <p className="text-base font-medium text-gray-900">
//                             {new Date(sub.created_at).toLocaleDateString('en-IN', {
//                               day: '2-digit',
//                               month: 'short',
//                               year: 'numeric'
//                             })}
//                           </p>
//                           <p className="text-sm text-gray-500">
//                             {new Date(sub.created_at).toLocaleTimeString('en-IN', {
//                               hour: '2-digit',
//                               minute: '2-digit'
//                             })}
//                           </p>
//                         </div>
//                       </div>
//                     </td>

//                     <td className="p-5">
//                       <div className="flex items-center gap-2.5">
//                         <Clock className="w-5 h-5 text-orange-600 flex-shrink-0" />
//                         <div>
//                           <p className="text-base font-medium text-gray-900">
//                             {new Date(sub.end_date).toLocaleDateString('en-IN', {
//                               day: '2-digit',
//                               month: 'short',
//                               year: 'numeric'
//                             })}
//                           </p>
//                           <p className={`text-sm font-semibold ${
//                             sub.days_remaining <= 3 ? 'text-red-600' :
//                             sub.days_remaining <= 7 ? 'text-orange-600' :
//                             'text-gray-500'
//                           }`}>
//                             {sub.days_remaining} days left
//                           </p>
//                         </div>
//                       </div>
//                     </td>

//                     <td className="p-5">
//                       <div className="flex items-center gap-2.5">
//                         <QrCode className="w-5 h-5 text-green-600 flex-shrink-0" />
//                         <div className="flex-1 min-w-0">
//                           <div className="flex items-center justify-between mb-1.5">
//                             <span className="text-sm text-gray-600">Scans:</span>
//                             <span className="text-sm font-bold text-gray-900">
//                               {sub.current_scan_count} / {sub.plan_scan_limit === -1 ? '∞' : sub.plan_scan_limit}
//                             </span>
//                           </div>
//                           {sub.plan_scan_limit !== -1 && (
//                             <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
//                               <div
//                                 className={`h-full transition-all ${
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

//                     <td className="p-5">
//                       <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold border-2 ${sub.status_color}`}>
//                         {sub.status_badge === 'Active' && <CheckCircle className="w-4 h-4" />}
//                         {sub.status_badge === 'Expired' && <AlertCircle className="w-4 h-4" />}
//                         {sub.status_badge}
//                       </span>
//                     </td>

//                     <td className="p-5">
//                       <button
//                         onClick={() => handleViewDetails(sub)}
//                         className="flex items-center gap-2 px-5 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-base font-medium shadow-md hover:shadow-lg"
//                       >
//                         <Eye className="w-5 h-5" />
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
//             <p className="text-gray-500 font-medium text-lg mb-2">No subscriptions found</p>
//             <p className="text-base text-gray-400">Try adjusting your filters</p>
//           </div>
//         ) : (
//           currentItems.map((sub) => (
//             <div
//               key={sub.id}
//               className="bg-white rounded-xl border-2 border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow"
//             >
//               <div className="flex items-start justify-between gap-3 mb-4 pb-4 border-b-2 border-gray-100">
//                 <div className="flex items-center gap-3 min-w-0 flex-1">
//                   <div className="p-2.5 bg-purple-100 rounded-lg flex-shrink-0">
//                     <Users className="w-6 h-6 text-purple-600" />
//                   </div>
//                   <div className="min-w-0 flex-1">
//                     <h3 className="font-bold text-gray-900 text-base truncate">{sub.seller_business_name}</h3>
//                     <p className="text-sm text-gray-600 truncate">{sub.seller_owner_name}</p>
//                     <div className="flex items-center gap-1.5 text-sm text-gray-500 mt-1">
//                       <Mail className="w-4 h-4 flex-shrink-0" />
//                       <span className="truncate">{sub.seller_email}</span>
//                     </div>
//                   </div>
//                 </div>
//                 <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border-2 flex-shrink-0 ${sub.status_color}`}>
//                   {sub.status_badge === 'Active' && <CheckCircle className="w-4 h-4" />}
//                   {sub.status_badge === 'Expired' && <AlertCircle className="w-4 h-4" />}
//                   {sub.status_badge}
//                 </span>
//               </div>

//               <div className="bg-indigo-50 border-2 border-indigo-200 rounded-lg p-4 mb-4">
//                 <div className="flex items-center gap-2.5 mb-2">
//                   <Package className="w-5 h-5 text-indigo-600" />
//                   <span className="font-bold text-gray-900 text-base">{sub.plan_name}</span>
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
//                 <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-3">
//                   <div className="flex items-center gap-2 mb-2">
//                     <Calendar className="w-4 h-4 text-blue-600" />
//                     <span className="text-xs font-bold text-blue-700">Purchased</span>
//                   </div>
//                   <p className="text-sm font-bold text-gray-900">
//                     {new Date(sub.created_at).toLocaleDateString('en-IN', {
//                       day: '2-digit',
//                       month: 'short'
//                     })}
//                   </p>
//                   <p className="text-xs text-gray-600">
//                     {new Date(sub.created_at).toLocaleTimeString('en-IN', {
//                       hour: '2-digit',
//                       minute: '2-digit'
//                     })}
//                   </p>
//                 </div>

//                 <div className="bg-orange-50 border-2 border-orange-200 rounded-lg p-3">
//                   <div className="flex items-center gap-2 mb-2">
//                     <Clock className="w-4 h-4 text-orange-600" />
//                     <span className="text-xs font-bold text-orange-700">Expires</span>
//                   </div>
//                   <p className="text-sm font-bold text-gray-900">
//                     {new Date(sub.end_date).toLocaleDateString('en-IN', {
//                       day: '2-digit',
//                       month: 'short'
//                     })}
//                   </p>
//                   <p className={`text-xs font-bold ${
//                     sub.days_remaining <= 3 ? 'text-red-600' :
//                     sub.days_remaining <= 7 ? 'text-orange-600' :
//                     'text-gray-600'
//                   }`}>
//                     {sub.days_remaining} days left
//                   </p>
//                 </div>
//               </div>

//               <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4 mb-4">
//                 <div className="flex items-center justify-between mb-2">
//                   <div className="flex items-center gap-2">
//                     <QrCode className="w-4 h-4 text-green-600" />
//                     <span className="text-sm font-bold text-green-700">Scans</span>
//                   </div>
//                   <span className="text-sm font-bold text-gray-900">
//                     {sub.current_scan_count} / {sub.plan_scan_limit === -1 ? '∞' : sub.plan_scan_limit}
//                   </span>
//                 </div>
//                 {sub.plan_scan_limit !== -1 && (
//                   <>
//                     <div className="w-full bg-gray-200 rounded-full h-3 mb-1.5 overflow-hidden">
//                       <div
//                         className={`h-full transition-all ${
//                           sub.scan_percentage >= 90 ? 'bg-red-500' :
//                           sub.scan_percentage >= 70 ? 'bg-orange-500' :
//                           'bg-green-500'
//                         }`}
//                         style={{ width: `${sub.scan_percentage}%` }}
//                       ></div>
//                     </div>
//                     <p className="text-sm text-gray-600">{sub.scan_percentage}% used</p>
//                   </>
//                 )}
//               </div>

//               <button
//                 onClick={() => handleViewDetails(sub)}
//                 className="w-full flex items-center justify-center gap-2 px-5 py-3.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-base font-bold shadow-md"
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
//           <p className="text-base text-gray-600 order-2 sm:order-1">
//             Page <span className="font-bold text-purple-600">{currentPage}</span> of <span className="font-bold text-purple-600">{totalPages}</span>
//           </p>

//           <div className="flex items-center gap-2 order-1 sm:order-2">
//             <button
//               onClick={() => goToPage(currentPage - 1)}
//               disabled={currentPage === 1}
//               className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-base font-medium transition-all ${
//                 currentPage === 1
//                   ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
//                   : 'bg-white border-2 border-gray-300 text-gray-700 hover:bg-gray-50 shadow-sm hover:shadow'
//               }`}
//             >
//               <ChevronLeft className="w-5 h-5" />
//               <span className="hidden sm:inline">Previous</span>
//             </button>

//             <div className="flex items-center gap-2">
//               {getPageNumbers().map((page, index) => {
//                 if (page === '...') {
//                   return (
//                     <span key={`ellipsis-${index}`} className="px-3 text-gray-500 text-base">
//                       ...
//                     </span>
//                   );
//                 }
//                 return (
//                   <button
//                     key={page}
//                     onClick={() => goToPage(page as number)}
//                     className={`min-w-[42px] h-11 px-4 rounded-lg text-base font-medium transition-all ${
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
//               className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-base font-medium transition-all ${
//                 currentPage === totalPages
//                   ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
//                   : 'bg-white border-2 border-gray-300 text-gray-700 hover:bg-gray-50 shadow-sm hover:shadow'
//               }`}
//             >
//               <span className="hidden sm:inline">Next</span>
//               <ChevronRight className="w-5 h-5" />
//             </button>
//           </div>
//         </div>
//       )}

//       {/* ═══════════════════════════════════════════════════════════ */}
//       {/* ENHANCED DETAILS MODAL WITH SELLER ANALYTICS */}
//       {/* ═══════════════════════════════════════════════════════════ */}
      
//       {showDetailsModal && selectedSubscription && (
//         <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
//           <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl my-8">
//             {/* Modal Header */}
//             <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-6 rounded-t-2xl z-10 shadow-lg">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <h3 className="text-2xl font-bold mb-1">Subscription Details & Analytics</h3>
//                   <p className="text-purple-100 text-base">Complete subscription and seller performance data</p>
//                 </div>
//                 <button
//                   onClick={() => {
//                     setShowDetailsModal(false);
//                     setSelectedSubscription(null);
//                     setSellerAnalytics(null);
//                   }}
//                   className="p-2 hover:bg-white/20 rounded-lg transition-colors"
//                 >
//                   <X className="w-6 h-6" />
//                 </button>
//               </div>
//             </div>

//             <div className="max-h-[calc(90vh-120px)] overflow-y-auto">
//               {/* Modal Content */}
//               <div className="p-6 space-y-6">
                
//                 {/* ═══════════════════════════════════════════════════ */}
//                 {/* SELLER ANALYTICS SECTION - NEW! */}
//                 {/* ═══════════════════════════════════════════════════ */}
                
//                 <div className="bg-gradient-to-br from-purple-50 to-indigo-50 border-2 border-purple-200 rounded-xl p-6">
//                   <h4 className="text-xl font-bold text-gray-900 mb-5 flex items-center gap-3 border-b-2 border-purple-300 pb-3">
//                     <BarChart3 className="w-7 h-7 text-purple-600" />
//                     Seller Performance Analytics
//                   </h4>

//                   {loadingAnalytics ? (
//                     <div className="flex items-center justify-center py-12">
//                       <Loader className="w-12 h-12 text-purple-600 animate-spin" />
//                     </div>
//                   ) : sellerAnalytics ? (
//                     <div className="space-y-5">
//                       {/* Quick Stats Grid */}
//                       <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
//                         <div className="bg-white border-2 border-purple-200 rounded-lg p-4 shadow-sm">
//                           <div className="flex items-center gap-2 mb-2">
//                             <Package className="w-5 h-5 text-purple-600" />
//                             <span className="text-sm font-bold text-purple-700">Total Plans</span>
//                           </div>
//                           <p className="text-3xl font-bold text-purple-900">{sellerAnalytics.totalPlans}</p>
//                           <p className="text-xs text-gray-600 mt-1">All time purchases</p>
//                         </div>

//                         <div className="bg-white border-2 border-green-200 rounded-lg p-4 shadow-sm">
//                           <div className="flex items-center gap-2 mb-2">
//                             <DollarSign className="w-5 h-5 text-green-600" />
//                             <span className="text-sm font-bold text-green-700">Total Revenue</span>
//                           </div>
//                           <p className="text-2xl font-bold text-green-900 flex items-center gap-1">
//                             <IndianRupee className="w-5 h-5" />
//                             {sellerAnalytics.totalRevenue.toLocaleString('en-IN')}
//                           </p>
//                           <p className="text-xs text-gray-600 mt-1">From this seller</p>
//                         </div>

//                         <div className="bg-white border-2 border-blue-200 rounded-lg p-4 shadow-sm">
//                           <div className="flex items-center gap-2 mb-2">
//                             <CheckCircle className="w-5 h-5 text-blue-600" />
//                             <span className="text-sm font-bold text-blue-700">Active</span>
//                           </div>
//                           <p className="text-3xl font-bold text-blue-900">{sellerAnalytics.activeSubscriptions}</p>
//                           <p className="text-xs text-gray-600 mt-1">Currently active</p>
//                         </div>

//                         <div className="bg-white border-2 border-red-200 rounded-lg p-4 shadow-sm">
//                           <div className="flex items-center gap-2 mb-2">
//                             <AlertCircle className="w-5 h-5 text-red-600" />
//                             <span className="text-sm font-bold text-red-700">Expired</span>
//                           </div>
//                           <p className="text-3xl font-bold text-red-900">{sellerAnalytics.expiredSubscriptions}</p>
//                           <p className="text-xs text-gray-600 mt-1">Past subscriptions</p>
//                         </div>
//                       </div>

//                       {/* Most Purchased & Renewed Plans */}
//                       <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
//                         <div className="bg-white border-2 border-orange-200 rounded-lg p-5 shadow-sm">
//                           <div className="flex items-center gap-2 mb-3">
//                             <Award className="w-6 h-6 text-orange-600" />
//                             <span className="text-base font-bold text-orange-700">Most Purchased Plan</span>
//                           </div>
//                           <p className="text-xl font-bold text-gray-900 mb-1">
//                             {sellerAnalytics.mostPurchasedPlan.name}
//                           </p>
//                           <p className="text-sm text-gray-600">
//                             Purchased <span className="font-bold text-orange-600">{sellerAnalytics.mostPurchasedPlan.count}</span> times
//                           </p>
//                         </div>

//                         <div className="bg-white border-2 border-indigo-200 rounded-lg p-5 shadow-sm">
//                           <div className="flex items-center gap-2 mb-3">
//                             <Repeat className="w-6 h-6 text-indigo-600" />
//                             <span className="text-base font-bold text-indigo-700">Most Renewed Plan</span>
//                           </div>
//                           <p className="text-xl font-bold text-gray-900 mb-1">
//                             {sellerAnalytics.mostRenewedPlan.name}
//                           </p>
//                           <p className="text-sm text-gray-600">
//                             Renewed <span className="font-bold text-indigo-600">{sellerAnalytics.mostRenewedPlan.count}</span> times
//                           </p>
//                         </div>
//                       </div>

//                       {/* Plan Breakdown Table */}
//                       {sellerAnalytics.planBreakdown.length > 0 && (
//                         <div className="bg-white border-2 border-gray-200 rounded-lg overflow-hidden shadow-sm">
//                           <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 border-b-2 border-gray-200">
//                             <h5 className="font-bold text-gray-900 text-base flex items-center gap-2">
//                               <TrendingUp className="w-5 h-5 text-purple-600" />
//                               Detailed Plan Breakdown
//                             </h5>
//                           </div>
//                           <div className="overflow-x-auto">
//                             <table className="w-full">
//                               <thead className="bg-gray-50 border-b-2 border-gray-200">
//                                 <tr>
//                                   <th className="text-left p-4 font-bold text-gray-700 text-sm">Plan Name</th>
//                                   <th className="text-center p-4 font-bold text-gray-700 text-sm">Purchases</th>
//                                   <th className="text-center p-4 font-bold text-gray-700 text-sm">Renewals</th>
//                                   <th className="text-right p-4 font-bold text-gray-700 text-sm">Total Spent</th>
//                                 </tr>
//                               </thead>
//                               <tbody>
//                                 {sellerAnalytics.planBreakdown.map((plan, idx) => (
//                                   <tr key={idx} className={`border-t ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
//                                     <td className="p-4 font-medium text-gray-900 text-base">{plan.planName}</td>
//                                     <td className="p-4 text-center">
//                                       <span className="inline-flex items-center justify-center min-w-[32px] h-8 px-3 bg-blue-100 text-blue-800 rounded-full font-bold text-sm">
//                                         {plan.purchaseCount}
//                                       </span>
//                                     </td>
//                                     <td className="p-4 text-center">
//                                       <span className="inline-flex items-center justify-center min-w-[32px] h-8 px-3 bg-purple-100 text-purple-800 rounded-full font-bold text-sm">
//                                         {plan.renewCount}
//                                       </span>
//                                     </td>
//                                     <td className="p-4 text-right font-bold text-green-900 text-base flex items-center justify-end gap-1">
//                                       <IndianRupee className="w-4 h-4" />
//                                       {plan.totalSpent.toLocaleString('en-IN')}
//                                     </td>
//                                   </tr>
//                                 ))}
//                               </tbody>
//                             </table>
//                           </div>
//                         </div>
//                       )}

//                       {/* Timeline */}
//                       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                         <div className="bg-white border-2 border-green-200 rounded-lg p-4">
//                           <p className="text-sm text-green-700 font-bold mb-2">First Purchase</p>
//                           <p className="text-base font-medium text-gray-900">{formatDate(sellerAnalytics.firstPurchaseDate)}</p>
//                         </div>
//                         <div className="bg-white border-2 border-blue-200 rounded-lg p-4">
//                           <p className="text-sm text-blue-700 font-bold mb-2">Latest Purchase</p>
//                           <p className="text-base font-medium text-gray-900">{formatDate(sellerAnalytics.lastPurchaseDate)}</p>
//                         </div>
//                       </div>
//                     </div>
//                   ) : (
//                     <p className="text-center text-gray-500 py-8">No analytics data available</p>
//                   )}
//                 </div>

//                 {/* ═══════════════════════════════════════════════════ */}
//                 {/* ORIGINAL SECTIONS (Seller Info, Plan, Timeline, etc.) */}
//                 {/* ═══════════════════════════════════════════════════ */}
                
//                 {/* Seller Information */}
//                 <div>
//                   <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2 border-b-2 border-purple-200 pb-3">
//                     <Users className="w-6 h-6 text-purple-600" />
//                     Seller Information
//                   </h4>
//                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                     <div className="bg-gray-50 rounded-lg p-4">
//                       <p className="text-sm text-gray-600 mb-1">Business Name</p>
//                       <p className="font-bold text-gray-900 text-base">{selectedSubscription.seller_business_name}</p>
//                     </div>
//                     <div className="bg-gray-50 rounded-lg p-4">
//                       <p className="text-sm text-gray-600 mb-1">Owner Name</p>
//                       <p className="font-bold text-gray-900 text-base">{selectedSubscription.seller_owner_name}</p>
//                     </div>
//                     <div className="bg-gray-50 rounded-lg p-4">
//                       <p className="text-sm text-gray-600 mb-1 flex items-center gap-1">
//                         <Mail className="w-4 h-4" />
//                         Email
//                       </p>
//                       <a
//                         href={`mailto:${selectedSubscription.seller_email}`}
//                         className="font-medium text-blue-600 hover:underline break-all text-base"
//                       >
//                         {selectedSubscription.seller_email}
//                       </a>
//                     </div>
//                     <div className="bg-gray-50 rounded-lg p-4">
//                       <p className="text-sm text-gray-600 mb-1 flex items-center gap-1">
//                         <Phone className="w-4 h-4" />
//                         Phone
//                       </p>
//                       <p className="font-medium text-gray-900 text-base">{selectedSubscription.seller_phone || 'N/A'}</p>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Plan Information */}
//                 <div>
//                   <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2 border-b-2 border-indigo-200 pb-3">
//                     <Package className="w-6 h-6 text-indigo-600" />
//                     Plan Information
//                   </h4>
//                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                     <div className="bg-indigo-50 border-2 border-indigo-200 rounded-lg p-4">
//                       <p className="text-sm text-indigo-700 mb-1 font-bold">Plan Name</p>
//                       <p className="font-bold text-indigo-900 text-lg">{selectedSubscription.plan_name}</p>
//                     </div>
//                     <div className="bg-indigo-50 border-2 border-indigo-200 rounded-lg p-4">
//                       <p className="text-sm text-indigo-700 mb-1 font-bold">Price</p>
//                       <p className="font-bold text-indigo-900 text-lg flex items-center gap-1">
//                         <IndianRupee className="w-5 h-5" />
//                         {selectedSubscription.plan_price.toLocaleString('en-IN')} / {selectedSubscription.plan_billing_cycle}
//                       </p>
//                     </div>
//                     <div className="bg-gray-50 rounded-lg p-4">
//                       <p className="text-sm text-gray-600 mb-1">Billing Cycle</p>
//                       <p className="font-bold text-gray-900 text-base capitalize">{selectedSubscription.plan_billing_cycle}</p>
//                     </div>
//                     <div className="bg-gray-50 rounded-lg p-4">
//                       <p className="text-sm text-gray-600 mb-1">Validity</p>
//                       <p className="font-bold text-gray-900 text-base">
//                         {selectedSubscription.plan_validity_duration} {selectedSubscription.plan_validity_unit}
//                       </p>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Timeline */}
//                 <div>
//                   <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2 border-b-2 border-blue-200 pb-3">
//                     <Calendar className="w-6 h-6 text-blue-600" />
//                     Subscription Timeline
//                   </h4>
//                   <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//                     <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
//                       <p className="text-sm text-green-700 mb-2 font-bold">Start Date</p>
//                       <p className="font-bold text-gray-900 text-base">{formatDate(selectedSubscription.start_date)}</p>
//                     </div>
//                     <div className="bg-orange-50 border-2 border-orange-200 rounded-lg p-4">
//                       <p className="text-sm text-orange-700 mb-2 font-bold">End Date</p>
//                       <p className="font-bold text-gray-900 text-base">{formatDate(selectedSubscription.end_date)}</p>
//                     </div>
//                     <div className="bg-purple-50 border-2 border-purple-200 rounded-lg p-4">
//                       <p className="text-sm text-purple-700 mb-2 font-bold">Days Remaining</p>
//                       <p className={`font-bold text-2xl ${
//                         selectedSubscription.days_remaining <= 3 ? 'text-red-600' :
//                         selectedSubscription.days_remaining <= 7 ? 'text-orange-600' :
//                         'text-gray-900'
//                       }`}>
//                         {selectedSubscription.days_remaining} days
//                       </p>
//                     </div>
//                   </div>
//                   <div className="mt-4 bg-gray-50 rounded-lg p-4">
//                     <p className="text-sm text-gray-600 mb-2">Status</p>
//                     <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-base font-bold border-2 ${selectedSubscription.status_color}`}>
//                       {selectedSubscription.status_badge === 'Active' && <CheckCircle className="w-5 h-5" />}
//                       {selectedSubscription.status_badge === 'Expired' && <AlertCircle className="w-5 h-5" />}
//                       {selectedSubscription.status_badge}
//                     </span>
//                   </div>
//                 </div>

//                 {/* Usage Statistics */}
//                 <div>
//                   <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2 border-b-2 border-green-200 pb-3">
//                     <QrCode className="w-6 h-6 text-green-600" />
//                     Usage Statistics
//                   </h4>
//                   <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
//                     <div className="flex items-center justify-between mb-3">
//                       <span className="text-base font-bold text-green-700">Scans Used</span>
//                       <span className="text-xl font-bold text-green-900">
//                         {selectedSubscription.current_scan_count} / {selectedSubscription.plan_scan_limit === -1 ? '∞' : selectedSubscription.plan_scan_limit}
//                       </span>
//                     </div>
//                     {selectedSubscription.plan_scan_limit !== -1 && (
//                       <>
//                         <div className="w-full bg-gray-200 rounded-full h-4 mb-2 overflow-hidden">
//                           <div
//                             className={`h-full transition-all ${
//                               selectedSubscription.scan_percentage >= 90 ? 'bg-red-500' :
//                               selectedSubscription.scan_percentage >= 70 ? 'bg-orange-500' :
//                               'bg-green-500'
//                             }`}
//                             style={{ width: `${selectedSubscription.scan_percentage}%` }}
//                           ></div>
//                         </div>
//                         <p className="text-base text-gray-700 font-medium">{selectedSubscription.scan_percentage}% used</p>
//                       </>
//                     )}
//                   </div>
//                 </div>

//                 {/* Payment Information */}
//                 {selectedSubscription.payment_id && (
//                   <div>
//                     <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2 border-b-2 border-yellow-200 pb-3">
//                       <CreditCard className="w-6 h-6 text-yellow-600" />
//                       Payment Information
//                     </h4>
//                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                       <div className="bg-gray-50 rounded-lg p-4">
//                         <p className="text-sm text-gray-600 mb-1">Payment ID</p>
//                         <p className="font-mono text-sm font-bold text-gray-900 break-all">{selectedSubscription.payment_id}</p>
//                       </div>
//                       <div className="bg-gray-50 rounded-lg p-4">
//                         <p className="text-sm text-gray-600 mb-1">Transaction ID</p>
//                         <p className="font-mono text-sm font-bold text-gray-900 break-all">{selectedSubscription.transaction_id || 'N/A'}</p>
//                       </div>
//                       <div className="bg-gray-50 rounded-lg p-4">
//                         <p className="text-sm text-gray-600 mb-1">Amount Paid</p>
//                         <p className="font-bold text-gray-900 text-base flex items-center gap-1">
//                           <IndianRupee className="w-5 h-5" />
//                           {selectedSubscription.payment_amount?.toLocaleString('en-IN') || 'N/A'}
//                         </p>
//                       </div>
//                       <div className="bg-gray-50 rounded-lg p-4">
//                         <p className="text-sm text-gray-600 mb-1">Payment Date</p>
//                         <p className="font-medium text-gray-900 text-base">
//                           {selectedSubscription.payment_date ? formatDate(selectedSubscription.payment_date) : 'N/A'}
//                         </p>
//                       </div>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </div>

//             {/* Modal Footer */}
//             <div className="sticky bottom-0 bg-gray-50 border-t-2 border-gray-200 p-5 rounded-b-2xl">
//               <button
//                 onClick={() => {
//                   setShowDetailsModal(false);
//                   setSelectedSubscription(null);
//                   setSellerAnalytics(null);
//                 }}
//                 className="w-full px-6 py-3.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-bold text-lg shadow-md hover:shadow-lg"
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

// console.log('✅ BillingHistory Component loaded - Production v3.0 (Enhanced with Seller Analytics)'); 
// ✅ BillingHistory Component - Production v3.1 (Enhanced Desktop Typography)
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Search,
  Filter,
  Eye,
  X,
  Package,
  Calendar,
  CreditCard,
  Users,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Clock,
  CheckCircle,
  AlertCircle,
  Mail,
  Phone,
  IndianRupee,
  QrCode,
  Loader,
  FileSpreadsheet,
  TrendingUp,
  Award,
  Repeat,
  DollarSign,
  BarChart3
} from 'lucide-react';
import { collection, query, getDocs, orderBy, limit, where, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';

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

type FilterStatus = 'all' | 'active' | 'expired' | 'expiring_soon';
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

  // ═══════════════════════════════════════════════════════════════
  // UTILITY FUNCTIONS
  // ═══════════════════════════════════════════════════════════════

  const calculateDaysRemaining = useCallback((endDate: string): number => {
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
    const status = subscription.status;

    if (status === 'completed' || status === 'replaced') {
      return {
        color: 'bg-gray-100 text-gray-800 border-gray-300',
        badge: status === 'completed' ? 'Completed' : 'Replaced',
        isExpiringSoon: false,
        isExpired: true
      };
    }

    if (daysRemaining === 0 || new Date(subscription.end_date) < new Date()) {
      return {
        color: 'bg-red-100 text-red-800 border-red-300',
        badge: 'Expired',
        isExpiringSoon: false,
        isExpired: true
      };
    }

    if (daysRemaining <= 3) {
      return {
        color: 'bg-orange-100 text-orange-800 border-orange-300',
        badge: 'Expiring Very Soon',
        isExpiringSoon: true,
        isExpired: false
      };
    }

    if (daysRemaining <= 7) {
      return {
        color: 'bg-yellow-100 text-yellow-800 border-yellow-300',
        badge: 'Expiring Soon',
        isExpiringSoon: true,
        isExpired: false
      };
    }

    return {
      color: 'bg-green-100 text-green-800 border-green-300',
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

    const planMap = new Map<string, {
      purchaseCount: number;
      renewCount: number;
      totalSpent: number;
    }>();

    sellerSubscriptions.forEach(sub => {
      const existing = planMap.get(sub.plan_name) || {
        purchaseCount: 0,
        renewCount: 0,
        totalSpent: 0
      };

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
      sub.status === 'active' && !sub.is_expired
    ).length;

    const expiredSubscriptions = sellerSubscriptions.filter(sub => 
      sub.is_expired || sub.status === 'completed' || sub.status === 'replaced'
    ).length;

    const sortedByDate = [...sellerSubscriptions].sort((a, b) => 
      new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    );

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

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('📊 Loading billing history...');

      const subscriptionsQuery = query(
        collection(db, 'subscriptions'),
        orderBy('created_at', 'desc'),
        limit(500)
      );

      const subscriptionsSnapshot = await getDocs(subscriptionsQuery);

      if (subscriptionsSnapshot.empty) {
        console.log('ℹ️ No subscriptions found');
        setSubscriptions([]);
        setLoading(false);
        return;
      }

      console.log(`✅ Fetched ${subscriptionsSnapshot.size} subscriptions`);

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
        const sellersQuery = query(
          collection(db, 'sellers'),
          where('user_id', 'in', batch)
        );
        const sellersSnapshot = await getDocs(sellersQuery);
        sellersSnapshot.docs.forEach(doc => {
          const data = doc.data();
          sellersMap.set(data.user_id, data);
        });
      }

      const plansMap = new Map<string, any>();
      const planIdsArray = Array.from(planIds);

      for (let i = 0; i < planIdsArray.length; i += 10) {
        const batch = planIdsArray.slice(i, i + 10);
        const plansQuery = query(
          collection(db, 'plans'),
          where('__name__', 'in', batch)
        );
        const plansSnapshot = await getDocs(plansQuery);
        plansSnapshot.docs.forEach(doc => {
          plansMap.set(doc.id, doc.data());
        });
      }

      const paymentsMap = new Map<string, any>();
      const paymentIdsArray = Array.from(paymentIds).filter(id => id);

      for (let i = 0; i < paymentIdsArray.length; i += 10) {
        const batch = paymentIdsArray.slice(i, i + 10);
        if (batch.length === 0) continue;
        const paymentsQuery = query(
          collection(db, 'payments'),
          where('__name__', 'in', batch)
        );
        const paymentsSnapshot = await getDocs(paymentsQuery);
        paymentsSnapshot.docs.forEach(doc => {
          paymentsMap.set(doc.id, doc.data());
        });
      }

      const enrichedSubscriptions: EnrichedSubscription[] = subscriptionsSnapshot.docs.map(doc => {
        const subData = doc.data();
        const seller = sellersMap.get(subData.seller_id) || {};
        const plan = plansMap.get(subData.plan_id) || {};
        const payment = paymentsMap.get(subData.last_payment_id) || {};

        const daysRemaining = calculateDaysRemaining(subData.end_date);
        const statusInfo = getStatusInfo({
          ...subData,
          days_remaining: daysRemaining,
          plan_scan_limit: plan.limits?.max_scans ?? -1,
          current_scan_count: subData.current_scan_count || 0
        } as EnrichedSubscription);

        const scanLimit = plan.limits?.max_scans ?? -1;
        const scanPercentage = calculateScanPercentage(
          subData.current_scan_count || 0,
          scanLimit
        );

        return {
          id: doc.id,
          seller_id: subData.seller_id || '',
          plan_id: subData.plan_id || '',
          plan_name: subData.plan_name || plan.plan_name || 'Unknown',
          status: subData.status || 'active',
          start_date: subData.start_date || '',
          end_date: subData.end_date || '',
          current_scan_count: subData.current_scan_count || 0,
          last_payment_id: subData.last_payment_id,
          created_at: subData.created_at || '',
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
          payment_amount: payment.amount,
          payment_id: payment.razorpay_payment_id,
          transaction_id: payment.transaction_id,
          payment_date: payment.created_at,
          days_remaining: daysRemaining,
          status_color: statusInfo.color,
          status_badge: statusInfo.badge,
          scan_percentage: scanPercentage,
          is_expiring_soon: statusInfo.isExpiringSoon,
          is_expired: statusInfo.isExpired
        };
      });

      setSubscriptions(enrichedSubscriptions);
      calculateStatistics(enrichedSubscriptions);

      console.log('✅ Billing history loaded successfully');

    } catch (error: any) {
      console.error('❌ Error loading billing history:', error);
      setError(`Failed to load data: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }, [calculateDaysRemaining, getStatusInfo, calculateScanPercentage]);

  const calculateStatistics = useCallback((subs: EnrichedSubscription[]) => {
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const activeSubscriptions = subs.filter(s => 
      s.status === 'active' && 
      !s.is_expired && 
      s.status !== 'completed' && 
      s.status !== 'replaced'
    );

    const stats: Statistics = {
      totalActive: activeSubscriptions.length,
      totalRevenue: subs
        .filter(s => s.payment_amount)
        .reduce((sum, s) => sum + (s.payment_amount || 0), 0),
      expiringSoon: subs.filter(s => s.is_expiring_soon && s.status !== 'completed' && s.status !== 'replaced').length,
      expiredThisMonth: subs.filter(s => {
        if (!s.end_date) return false;
        const endDate = new Date(s.end_date);
        return endDate >= monthStart && endDate <= now && s.is_expired && s.status !== 'completed' && s.status !== 'replaced';
      }).length,
      renewedThisMonth: subs.filter(s => {
        if (!s.created_at) return false;
        const createdDate = new Date(s.created_at);
        return createdDate >= monthStart && (s.status !== 'completed' && s.status !== 'replaced');
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

    const subscriptionsQuery = query(
      collection(db, 'subscriptions'),
      orderBy('created_at', 'desc'),
      limit(500)
    );

    const unsubscribe = onSnapshot(
      subscriptionsQuery,
      (snapshot) => {
        if (!snapshot.empty) {
          console.log('🔄 Real-time update detected, refreshing data...');
          loadData();
        }
      },
      (error) => {
        console.error('❌ Real-time listener error:', error);
      }
    );

    return () => unsubscribe();
  }, [loadData]);

  const filteredAndSortedSubscriptions = useMemo(() => {
    let filtered = subscriptions.filter(sub => 
      sub.status !== 'completed' && sub.status !== 'replaced'
    );

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
        filtered = filtered.filter(s => s.status === 'active' && !s.is_expired);
      } else if (filterStatus === 'expired') {
        filtered = filtered.filter(s => s.is_expired);
      } else if (filterStatus === 'expiring_soon') {
        filtered = filtered.filter(s => s.is_expiring_soon);
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
          compareA = new Date(a.created_at).getTime();
          compareB = new Date(b.created_at).getTime();
          break;
        case 'expiry_date':
          compareA = new Date(a.end_date).getTime();
          compareB = new Date(b.end_date).getTime();
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
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }, []);

  const formatCurrency = useCallback((amount: number): string => {
    return `₹${amount.toLocaleString('en-IN')}`;
  }, []);

  const getUniquePlans = useCallback((): string[] => {
    const plans = new Set(subscriptions
      .filter(s => s.status !== 'completed' && s.status !== 'replaced')
      .map(s => s.plan_name)
    );
    return Array.from(plans).sort();
  }, [subscriptions]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <Loader className="w-20 h-20 text-purple-600 animate-spin mx-auto mb-4" />
          <p className="text-xl text-gray-600 font-medium">Loading billing history...</p>
          <p className="text-base text-gray-500 mt-2">Fetching subscription data</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-2 border-red-200 rounded-xl p-8">
        <div className="flex flex-col items-center text-center gap-4">
          <div className="p-3 bg-red-100 rounded-full">
            <AlertCircle className="w-12 h-12 text-red-600" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-red-800 mb-2">Failed to Load Data</h3>
            <p className="text-lg text-red-700 mb-4">{error}</p>
          </div>
          <button
            onClick={loadData}
            className="flex items-center gap-2 px-8 py-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium text-lg"
          >
            <RefreshCw className="w-6 h-6" />
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl p-8 text-white shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl lg:text-4xl font-bold mb-2 flex items-center gap-3">
              <CreditCard className="w-9 h-9 lg:w-10 lg:h-10" />
              Billing History
            </h2>
            <p className="text-purple-100 text-lg lg:text-xl">
              Complete subscription overview for all sellers
            </p>
          </div>
          <button
            onClick={loadData}
            className="flex items-center gap-3 px-6 py-3.5 bg-white/20 backdrop-blur-md border border-white/30 rounded-lg hover:bg-white/30 transition-all text-lg font-medium shadow-md hover:shadow-lg"
          >
            <RefreshCw className="w-6 h-6" />
            Refresh
          </button>
        </div>
      </div>

      {/* STATISTICS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 bg-green-200 rounded-lg">
              <CheckCircle className="w-7 h-7 text-green-700" />
            </div>
            <span className="text-base font-bold text-green-700">Total Active</span>
          </div>
          <p className="text-4xl lg:text-5xl font-bold text-green-900 mb-1">{statistics.totalActive}</p>
          <p className="text-base text-green-600">Subscriptions</p>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 bg-purple-200 rounded-lg">
              <IndianRupee className="w-7 h-7 text-purple-700" />
            </div>
            <span className="text-base font-bold text-purple-700">Total Revenue</span>
          </div>
          <p className="text-3xl lg:text-4xl font-bold text-purple-900 mb-1">
            ₹{statistics.totalRevenue.toLocaleString('en-IN')}
          </p>
          <p className="text-base text-purple-600">All Time</p>
        </div>

        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-2 border-yellow-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 bg-yellow-200 rounded-lg">
              <Clock className="w-7 h-7 text-yellow-700" />
            </div>
            <span className="text-base font-bold text-yellow-700">Expiring Soon</span>
          </div>
          <p className="text-4xl lg:text-5xl font-bold text-yellow-900 mb-1">{statistics.expiringSoon}</p>
          <p className="text-base text-yellow-600">(&lt; 7 days)</p>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-red-100 border-2 border-red-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 bg-red-200 rounded-lg">
              <AlertCircle className="w-7 h-7 text-red-700" />
            </div>
            <span className="text-base font-bold text-red-700">Expired</span>
          </div>
          <p className="text-4xl lg:text-5xl font-bold text-red-900 mb-1">{statistics.expiredThisMonth}</p>
          <p className="text-base text-red-600">This Month</p>
        </div>
      </div>

      {/* FILTERS & SEARCH */}
      <div className="bg-white rounded-xl border-2 border-gray-200 p-6 space-y-5 shadow-sm">
        <div className="relative">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
          <input
            type="text"
            placeholder="Search by seller, email, plan, transaction ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-14 pr-14 py-4 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-lg transition-all"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-5 top-1/2 -translate-y-1/2 p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-6 h-6 text-gray-500" />
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="relative">
            <Filter className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400 pointer-events-none" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as FilterStatus)}
              className="w-full pl-14 pr-5 py-4 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-lg bg-white cursor-pointer transition-all appearance-none"
            >
              <option value="all">All Status</option>
              <option value="active">Active Only</option>
              <option value="expired">Expired Only</option>
              <option value="expiring_soon">Expiring Soon</option>
            </select>
          </div>

          <div className="relative">
            <Package className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400 pointer-events-none" />
            <select
              value={filterPlan}
              onChange={(e) => setFilterPlan(e.target.value)}
              className="w-full pl-14 pr-5 py-4 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-lg bg-white cursor-pointer transition-all appearance-none"
            >
              <option value="all">All Plans</option>
              {getUniquePlans().map(plan => (
                <option key={plan} value={plan}>{plan}</option>
              ))}
            </select>
          </div>

          <div className="relative">
            <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400 pointer-events-none" />
            <select
              value={sortField}
              onChange={(e) => setSortField(e.target.value as SortField)}
              className="w-full pl-14 pr-5 py-4 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-lg bg-white cursor-pointer transition-all appearance-none"
            >
              <option value="purchase_date">Sort by Purchase Date</option>
              <option value="expiry_date">Sort by Expiry Date</option>
              <option value="seller_name">Sort by Seller Name</option>
              <option value="price">Sort by Price</option>
            </select>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t-2 border-gray-100">
          <p className="text-base text-gray-600">
            Showing <span className="font-bold text-purple-600">{startIndex + 1}</span> - <span className="font-bold text-purple-600">{Math.min(endIndex, filteredAndSortedSubscriptions.length)}</span> of <span className="font-bold text-purple-600">{filteredAndSortedSubscriptions.length}</span> subscriptions
          </p>
          {(searchTerm || filterStatus !== 'all' || filterPlan !== 'all') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setFilterStatus('all');
                setFilterPlan('all');
              }}
              className="text-base text-purple-600 hover:text-purple-700 font-medium underline"
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* DESKTOP TABLE */}
      <div className="hidden lg:block bg-white rounded-xl border-2 border-gray-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-300">
              <tr>
                <th className="text-left p-6 font-bold text-gray-800 text-lg">Seller Info</th>
                <th className="text-left p-6 font-bold text-gray-800 text-lg">Plan Details</th>
                <th className="text-left p-6 font-bold text-gray-800 text-lg">Purchased</th>
                <th className="text-left p-6 font-bold text-gray-800 text-lg">Expires</th>
                <th className="text-left p-6 font-bold text-gray-800 text-lg">Usage</th>
                <th className="text-left p-6 font-bold text-gray-800 text-lg">Status</th>
                <th className="text-left p-6 font-bold text-gray-800 text-lg">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-12 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <FileSpreadsheet className="w-24 h-24 text-gray-300" />
                      <p className="text-gray-500 font-medium text-xl">No subscriptions found</p>
                      <p className="text-lg text-gray-400">Try adjusting your filters</p>
                    </div>
                  </td>
                </tr>
              ) : (
                currentItems.map((sub, index) => (
                  <tr
                    key={sub.id}
                    className={`border-t border-gray-200 hover:bg-purple-50 transition-colors ${
                      index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                    }`}
                  >
                    <td className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-purple-100 rounded-lg flex-shrink-0">
                          <Users className="w-7 h-7 text-purple-600" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-gray-900 text-lg truncate">{sub.seller_business_name}</p>
                          <p className="text-base text-gray-600 truncate">{sub.seller_owner_name}</p>
                          <div className="flex items-center gap-2 text-base text-gray-500 mt-1">
                            <Mail className="w-5 h-5 flex-shrink-0" />
                            <span className="truncate">{sub.seller_email}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="p-6">
                      <div className="flex items-center gap-3">
                        <Package className="w-6 h-6 text-indigo-600 flex-shrink-0" />
                        <div>
                          <p className="font-bold text-gray-900 text-lg">{sub.plan_name}</p>
                          <p className="text-base text-gray-600 flex items-center gap-1">
                            <IndianRupee className="w-5 h-5" />
                            {formatCurrency(sub.plan_price)} / {sub.plan_billing_cycle}
                          </p>
                          <p className="text-base text-gray-500">{sub.plan_validity_duration} {sub.plan_validity_unit}</p>
                        </div>
                      </div>
                    </td>

                    <td className="p-6">
                      <div className="flex items-center gap-3">
                        <Calendar className="w-6 h-6 text-blue-600 flex-shrink-0" />
                        <div>
                          <p className="text-lg font-medium text-gray-900">
                            {new Date(sub.created_at).toLocaleDateString('en-IN', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric'
                            })}
                          </p>
                          <p className="text-base text-gray-500">
                            {new Date(sub.created_at).toLocaleTimeString('en-IN', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="p-6">
                      <div className="flex items-center gap-3">
                        <Clock className="w-6 h-6 text-orange-600 flex-shrink-0" />
                        <div>
                          <p className="text-lg font-medium text-gray-900">
                            {new Date(sub.end_date).toLocaleDateString('en-IN', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric'
                            })}
                          </p>
                          <p className={`text-base font-semibold ${
                            sub.days_remaining <= 3 ? 'text-red-600' :
                            sub.days_remaining <= 7 ? 'text-orange-600' :
                            'text-gray-500'
                          }`}>
                            {sub.days_remaining} days left
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="p-6">
                      <div className="flex items-center gap-3">
                        <QrCode className="w-6 h-6 text-green-600 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-base text-gray-600">Scans:</span>
                            <span className="text-base font-bold text-gray-900">
                              {sub.current_scan_count} / {sub.plan_scan_limit === -1 ? '∞' : sub.plan_scan_limit}
                            </span>
                          </div>
                          {sub.plan_scan_limit !== -1 && (
                            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                              <div
                                className={`h-full transition-all ${
                                  sub.scan_percentage >= 90 ? 'bg-red-500' :
                                  sub.scan_percentage >= 70 ? 'bg-orange-500' :
                                  'bg-green-500'
                                }`}
                                style={{ width: `${sub.scan_percentage}%` }}
                              ></div>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="p-6">
                      <span className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-base font-bold border-2 ${sub.status_color}`}>
                        {sub.status_badge === 'Active' && <CheckCircle className="w-5 h-5" />}
                        {sub.status_badge === 'Expired' && <AlertCircle className="w-5 h-5" />}
                        {sub.status_badge}
                      </span>
                    </td>

                    <td className="p-6">
                      <button
                        onClick={() => handleViewDetails(sub)}
                        className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-lg font-medium shadow-md hover:shadow-lg"
                      >
                        <Eye className="w-6 h-6" />
                        View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MOBILE CARDS */}
      <div className="lg:hidden space-y-4">
        {currentItems.length === 0 ? (
          <div className="bg-white rounded-xl border-2 border-gray-200 p-12 text-center">
            <FileSpreadsheet className="w-20 h-20 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 font-medium text-lg mb-2">No subscriptions found</p>
            <p className="text-base text-gray-400">Try adjusting your filters</p>
          </div>
        ) : (
          currentItems.map((sub) => (
            <div
              key={sub.id}
              className="bg-white rounded-xl border-2 border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between gap-3 mb-4 pb-4 border-b-2 border-gray-100">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="p-2.5 bg-purple-100 rounded-lg flex-shrink-0">
                    <Users className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold text-gray-900 text-base truncate">{sub.seller_business_name}</h3>
                    <p className="text-sm text-gray-600 truncate">{sub.seller_owner_name}</p>
                    <div className="flex items-center gap-1.5 text-sm text-gray-500 mt-1">
                      <Mail className="w-4 h-4 flex-shrink-0" />
                      <span className="truncate">{sub.seller_email}</span>
                    </div>
                  </div>
                </div>
                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border-2 flex-shrink-0 ${sub.status_color}`}>
                  {sub.status_badge === 'Active' && <CheckCircle className="w-4 h-4" />}
                  {sub.status_badge === 'Expired' && <AlertCircle className="w-4 h-4" />}
                  {sub.status_badge}
                </span>
              </div>

              <div className="bg-indigo-50 border-2 border-indigo-200 rounded-lg p-4 mb-4">
                <div className="flex items-center gap-2.5 mb-2">
                  <Package className="w-5 h-5 text-indigo-600" />
                  <span className="font-bold text-gray-900 text-base">{sub.plan_name}</span>
                </div>
                <div className="flex items-center justify-between text-base">
                  <span className="text-gray-600">Price:</span>
                  <span className="font-bold text-indigo-900 flex items-center gap-1">
                    <IndianRupee className="w-4 h-4" />
                    {sub.plan_price.toLocaleString('en-IN')} / {sub.plan_billing_cycle}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-4 h-4 text-blue-600" />
                    <span className="text-xs font-bold text-blue-700">Purchased</span>
                  </div>
                  <p className="text-sm font-bold text-gray-900">
                    {new Date(sub.created_at).toLocaleDateString('en-IN', {
                      day: '2-digit',
                      month: 'short'
                    })}
                  </p>
                  <p className="text-xs text-gray-600">
                    {new Date(sub.created_at).toLocaleTimeString('en-IN', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>

                <div className="bg-orange-50 border-2 border-orange-200 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-4 h-4 text-orange-600" />
                    <span className="text-xs font-bold text-orange-700">Expires</span>
                  </div>
                  <p className="text-sm font-bold text-gray-900">
                    {new Date(sub.end_date).toLocaleDateString('en-IN', {
                      day: '2-digit',
                      month: 'short'
                    })}
                  </p>
                  <p className={`text-xs font-bold ${
                    sub.days_remaining <= 3 ? 'text-red-600' :
                    sub.days_remaining <= 7 ? 'text-orange-600' :
                    'text-gray-600'
                  }`}>
                    {sub.days_remaining} days left
                  </p>
                </div>
              </div>

              <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <QrCode className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-bold text-green-700">Scans</span>
                  </div>
                  <span className="text-sm font-bold text-gray-900">
                    {sub.current_scan_count} / {sub.plan_scan_limit === -1 ? '∞' : sub.plan_scan_limit}
                  </span>
                </div>
                {sub.plan_scan_limit !== -1 && (
                  <>
                    <div className="w-full bg-gray-200 rounded-full h-3 mb-1.5 overflow-hidden">
                      <div
                        className={`h-full transition-all ${
                          sub.scan_percentage >= 90 ? 'bg-red-500' :
                          sub.scan_percentage >= 70 ? 'bg-orange-500' :
                          'bg-green-500'
                        }`}
                        style={{ width: `${sub.scan_percentage}%` }}
                      ></div>
                    </div>
                    <p className="text-sm text-gray-600">{sub.scan_percentage}% used</p>
                  </>
                )}
              </div>

              <button
                onClick={() => handleViewDetails(sub)}
                className="w-full flex items-center justify-center gap-2 px-5 py-3.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-base font-bold shadow-md"
              >
                <Eye className="w-5 h-5" />
                View Full Details
              </button>
            </div>
          ))
        )}
      </div>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-5 border-t-2 border-gray-200">
          <p className="text-lg text-gray-600 order-2 sm:order-1">
            Page <span className="font-bold text-purple-600">{currentPage}</span> of <span className="font-bold text-purple-600">{totalPages}</span>
          </p>

          <div className="flex items-center gap-3 order-1 sm:order-2">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className={`flex items-center gap-2 px-5 py-3 rounded-lg text-lg font-medium transition-all ${
                currentPage === 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white border-2 border-gray-300 text-gray-700 hover:bg-gray-50 shadow-sm hover:shadow'
              }`}
            >
              <ChevronLeft className="w-6 h-6" />
              <span className="hidden sm:inline">Previous</span>
            </button>

            <div className="flex items-center gap-2">
              {getPageNumbers().map((page, index) => {
                if (page === '...') {
                  return (
                    <span key={`ellipsis-${index}`} className="px-3 text-gray-500 text-lg">
                      ...
                    </span>
                  );
                }
                return (
                  <button
                    key={page}
                    onClick={() => goToPage(page as number)}
                    className={`min-w-[48px] h-12 px-4 rounded-lg text-lg font-medium transition-all ${
                      currentPage === page
                        ? 'bg-purple-600 text-white shadow-md'
                        : 'bg-white border-2 border-gray-300 text-gray-700 hover:bg-gray-50 shadow-sm hover:shadow'
                    }`}
                  >
                    {page}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`flex items-center gap-2 px-5 py-3 rounded-lg text-lg font-medium transition-all ${
                currentPage === totalPages
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white border-2 border-gray-300 text-gray-700 hover:bg-gray-50 shadow-sm hover:shadow'
              }`}
            >
              <span className="hidden sm:inline">Next</span>
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}

      {/* DETAILS MODAL */}
     {/* ENHANCED DETAILS MODAL - FULLY RESPONSIVE */}
{showDetailsModal && selectedSubscription && (
  <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-start sm:items-center justify-center z-50 overflow-y-auto">
    <div className="bg-white rounded-none sm:rounded-2xl shadow-2xl w-full sm:w-[95vw] sm:max-w-5xl min-h-screen sm:min-h-0 sm:my-8">
      {/* Modal Header */}
      <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-4 sm:p-6 lg:p-8 z-20 shadow-lg">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-1 sm:mb-2 leading-tight">
              Subscription Details & Analytics
            </h3>
            <p className="text-purple-100 text-sm sm:text-base lg:text-lg">
              Complete subscription and seller performance data
            </p>
          </div>
          <button
            onClick={() => {
              setShowDetailsModal(false);
              setSelectedSubscription(null);
              setSellerAnalytics(null);
            }}
            className="flex-shrink-0 p-2 sm:p-2.5 hover:bg-white/20 rounded-lg transition-colors touch-manipulation"
            aria-label="Close modal"
          >
            <X className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8" />
          </button>
        </div>
      </div>

      {/* Modal Content - Scrollable */}
      <div className="overflow-y-auto" style={{ maxHeight: 'calc(100vh - 180px)' }}>
        <div className="p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8">
          
          {/* ═══════════════════════════════════════════════════ */}
          {/* SELLER ANALYTICS SECTION */}
          {/* ═══════════════════════════════════════════════════ */}
          
          <div className="bg-gradient-to-br from-purple-50 to-indigo-50 border-2 border-purple-200 rounded-xl p-4 sm:p-6 lg:p-8">
            <h4 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-4 sm:mb-5 lg:mb-6 flex items-center gap-2 sm:gap-3 border-b-2 border-purple-300 pb-3 sm:pb-4">
              <BarChart3 className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-purple-600 flex-shrink-0" />
              <span className="truncate">Seller Performance Analytics</span>
            </h4>

            {loadingAnalytics ? (
              <div className="flex items-center justify-center py-12">
                <Loader className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 text-purple-600 animate-spin" />
              </div>
            ) : sellerAnalytics ? (
              <div className="space-y-4 sm:space-y-5 lg:space-y-6">
                {/* Quick Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
                  <div className="bg-white border-2 border-purple-200 rounded-lg p-3 sm:p-4 lg:p-5 shadow-sm">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3">
                      <Package className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600 flex-shrink-0" />
                      <span className="text-xs sm:text-sm lg:text-base font-bold text-purple-700 leading-tight">Total Plans</span>
                    </div>
                    <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-purple-900">{sellerAnalytics.totalPlans}</p>
                    <p className="text-xs sm:text-sm text-gray-600 mt-1">All time purchases</p>
                  </div>

                  <div className="bg-white border-2 border-green-200 rounded-lg p-3 sm:p-4 lg:p-5 shadow-sm">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3">
                      <DollarSign className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 flex-shrink-0" />
                      <span className="text-xs sm:text-sm lg:text-base font-bold text-green-700 leading-tight">Total Revenue</span>
                    </div>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-green-900 flex items-center gap-1 flex-wrap">
                      <IndianRupee className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 flex-shrink-0" />
                      <span className="break-all">{sellerAnalytics.totalRevenue.toLocaleString('en-IN')}</span>
                    </p>
                    <p className="text-xs sm:text-sm text-gray-600 mt-1">From this seller</p>
                  </div>

                  <div className="bg-white border-2 border-blue-200 rounded-lg p-3 sm:p-4 lg:p-5 shadow-sm">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3">
                      <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 flex-shrink-0" />
                      <span className="text-xs sm:text-sm lg:text-base font-bold text-blue-700 leading-tight">Active</span>
                    </div>
                    <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-blue-900">{sellerAnalytics.activeSubscriptions}</p>
                    <p className="text-xs sm:text-sm text-gray-600 mt-1">Currently active</p>
                  </div>

                  <div className="bg-white border-2 border-red-200 rounded-lg p-3 sm:p-4 lg:p-5 shadow-sm">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3">
                      <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 text-red-600 flex-shrink-0" />
                      <span className="text-xs sm:text-sm lg:text-base font-bold text-red-700 leading-tight">Expired</span>
                    </div>
                    <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-red-900">{sellerAnalytics.expiredSubscriptions}</p>
                    <p className="text-xs sm:text-sm text-gray-600 mt-1">Past subscriptions</p>
                  </div>
                </div>

                {/* Most Purchased & Renewed Plans */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 lg:gap-5">
                  <div className="bg-white border-2 border-orange-200 rounded-lg p-4 sm:p-5 lg:p-6 shadow-sm">
                    <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                      <Award className="w-6 h-6 sm:w-7 sm:h-7 text-orange-600 flex-shrink-0" />
                      <span className="text-base sm:text-lg font-bold text-orange-700">Most Purchased Plan</span>
                    </div>
                    <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-1 sm:mb-2 break-words">
                      {sellerAnalytics.mostPurchasedPlan.name}
                    </p>
                    <p className="text-sm sm:text-base text-gray-600">
                      Purchased <span className="font-bold text-orange-600">{sellerAnalytics.mostPurchasedPlan.count}</span> times
                    </p>
                  </div>

                  <div className="bg-white border-2 border-indigo-200 rounded-lg p-4 sm:p-5 lg:p-6 shadow-sm">
                    <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                      <Repeat className="w-6 h-6 sm:w-7 sm:h-7 text-indigo-600 flex-shrink-0" />
                      <span className="text-base sm:text-lg font-bold text-indigo-700">Most Renewed Plan</span>
                    </div>
                    <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-1 sm:mb-2 break-words">
                      {sellerAnalytics.mostRenewedPlan.name}
                    </p>
                    <p className="text-sm sm:text-base text-gray-600">
                      Renewed <span className="font-bold text-indigo-600">{sellerAnalytics.mostRenewedPlan.count}</span> times
                    </p>
                  </div>
                </div>

                {/* Plan Breakdown Table */}
                {sellerAnalytics.planBreakdown.length > 0 && (
                  <div className="bg-white border-2 border-gray-200 rounded-lg overflow-hidden shadow-sm">
                    <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-3 sm:p-4 lg:p-5 border-b-2 border-gray-200">
                      <h5 className="font-bold text-gray-900 text-base sm:text-lg flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600 flex-shrink-0" />
                        <span className="truncate">Detailed Plan Breakdown</span>
                      </h5>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[500px]">
                        <thead className="bg-gray-50 border-b-2 border-gray-200">
                          <tr>
                            <th className="text-left p-3 sm:p-4 lg:p-5 font-bold text-gray-700 text-sm sm:text-base">Plan Name</th>
                            <th className="text-center p-3 sm:p-4 lg:p-5 font-bold text-gray-700 text-sm sm:text-base">Purchases</th>
                            <th className="text-center p-3 sm:p-4 lg:p-5 font-bold text-gray-700 text-sm sm:text-base">Renewals</th>
                            <th className="text-right p-3 sm:p-4 lg:p-5 font-bold text-gray-700 text-sm sm:text-base">Total Spent</th>
                          </tr>
                        </thead>
                        <tbody>
                          {sellerAnalytics.planBreakdown.map((plan, idx) => (
                            <tr key={idx} className={`border-t ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                              <td className="p-3 sm:p-4 lg:p-5 font-medium text-gray-900 text-sm sm:text-base lg:text-lg">{plan.planName}</td>
                              <td className="p-3 sm:p-4 lg:p-5 text-center">
                                <span className="inline-flex items-center justify-center min-w-[32px] sm:min-w-[36px] h-8 sm:h-9 px-3 sm:px-4 bg-blue-100 text-blue-800 rounded-full font-bold text-sm sm:text-base">
                                  {plan.purchaseCount}
                                </span>
                              </td>
                              <td className="p-3 sm:p-4 lg:p-5 text-center">
                                <span className="inline-flex items-center justify-center min-w-[32px] sm:min-w-[36px] h-8 sm:h-9 px-3 sm:px-4 bg-purple-100 text-purple-800 rounded-full font-bold text-sm sm:text-base">
                                  {plan.renewCount}
                                </span>
                              </td>
                              <td className="p-3 sm:p-4 lg:p-5">
                                <div className="flex items-center justify-end gap-1 font-bold text-green-900 text-sm sm:text-base lg:text-lg">
                                  <IndianRupee className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                                  <span className="break-all">{plan.totalSpent.toLocaleString('en-IN')}</span>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Timeline */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 lg:gap-5">
                  <div className="bg-white border-2 border-green-200 rounded-lg p-4 sm:p-5">
                    <p className="text-sm sm:text-base text-green-700 font-bold mb-2">First Purchase</p>
                    <p className="text-base sm:text-lg font-medium text-gray-900 break-words">{formatDate(sellerAnalytics.firstPurchaseDate)}</p>
                  </div>
                  <div className="bg-white border-2 border-blue-200 rounded-lg p-4 sm:p-5">
                    <p className="text-sm sm:text-base text-blue-700 font-bold mb-2">Latest Purchase</p>
                    <p className="text-base sm:text-lg font-medium text-gray-900 break-words">{formatDate(sellerAnalytics.lastPurchaseDate)}</p>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-center text-gray-500 py-8 text-base sm:text-lg">No analytics data available</p>
            )}
          </div>

          {/* ═══════════════════════════════════════════════════ */}
          {/* SELLER INFORMATION */}
          {/* ═══════════════════════════════════════════════════ */}
          
          <div>
            <h4 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-4 sm:mb-5 flex items-center gap-2 sm:gap-3 border-b-2 border-purple-200 pb-3 sm:pb-4">
              <Users className="w-6 h-6 sm:w-7 sm:h-7 text-purple-600 flex-shrink-0" />
              <span className="truncate">Seller Information</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 lg:gap-5">
              <div className="bg-gray-50 rounded-lg p-4 sm:p-5">
                <p className="text-sm sm:text-base text-gray-600 mb-2">Business Name</p>
                <p className="font-bold text-gray-900 text-base sm:text-lg break-words">{selectedSubscription.seller_business_name}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 sm:p-5">
                <p className="text-sm sm:text-base text-gray-600 mb-2">Owner Name</p>
                <p className="font-bold text-gray-900 text-base sm:text-lg break-words">{selectedSubscription.seller_owner_name}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 sm:p-5">
                <p className="text-sm sm:text-base text-gray-600 mb-2 flex items-center gap-1">
                  <Mail className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                  Email
                </p>
                <a
                  href={`mailto:${selectedSubscription.seller_email}`}
                  className="font-medium text-blue-600 hover:underline break-all text-base sm:text-lg"
                >
                  {selectedSubscription.seller_email}
                </a>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 sm:p-5">
                <p className="text-sm sm:text-base text-gray-600 mb-2 flex items-center gap-1">
                  <Phone className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                  Phone
                </p>
                <p className="font-medium text-gray-900 text-base sm:text-lg break-words">{selectedSubscription.seller_phone || 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* ═══════════════════════════════════════════════════ */}
          {/* PLAN INFORMATION */}
          {/* ═══════════════════════════════════════════════════ */}
          
          <div>
            <h4 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-4 sm:mb-5 flex items-center gap-2 sm:gap-3 border-b-2 border-indigo-200 pb-3 sm:pb-4">
              <Package className="w-6 h-6 sm:w-7 sm:h-7 text-indigo-600 flex-shrink-0" />
              <span className="truncate">Plan Information</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 lg:gap-5">
              <div className="bg-indigo-50 border-2 border-indigo-200 rounded-lg p-4 sm:p-5">
                <p className="text-sm sm:text-base text-indigo-700 mb-2 font-bold">Plan Name</p>
                <p className="font-bold text-indigo-900 text-lg sm:text-xl break-words">{selectedSubscription.plan_name}</p>
              </div>
              <div className="bg-indigo-50 border-2 border-indigo-200 rounded-lg p-4 sm:p-5">
                <p className="text-sm sm:text-base text-indigo-700 mb-2 font-bold">Price</p>
                <p className="font-bold text-indigo-900 text-lg sm:text-xl flex items-center gap-1 flex-wrap">
                  <IndianRupee className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" />
                  <span className="break-all">{selectedSubscription.plan_price.toLocaleString('en-IN')}</span>
                  <span className="whitespace-nowrap">/ {selectedSubscription.plan_billing_cycle}</span>
                </p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 sm:p-5">
                <p className="text-sm sm:text-base text-gray-600 mb-2">Billing Cycle</p>
                <p className="font-bold text-gray-900 text-base sm:text-lg capitalize break-words">{selectedSubscription.plan_billing_cycle}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 sm:p-5">
                <p className="text-sm sm:text-base text-gray-600 mb-2">Validity</p>
                <p className="font-bold text-gray-900 text-base sm:text-lg break-words">
                  {selectedSubscription.plan_validity_duration} {selectedSubscription.plan_validity_unit}
                </p>
              </div>
            </div>
          </div>

          {/* ═══════════════════════════════════════════════════ */}
          {/* SUBSCRIPTION TIMELINE */}
          {/* ═══════════════════════════════════════════════════ */}
          
          <div>
            <h4 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-4 sm:mb-5 flex items-center gap-2 sm:gap-3 border-b-2 border-blue-200 pb-3 sm:pb-4">
              <Calendar className="w-6 h-6 sm:w-7 sm:h-7 text-blue-600 flex-shrink-0" />
              <span className="truncate">Subscription Timeline</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 lg:gap-5">
              <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4 sm:p-5">
                <p className="text-sm sm:text-base text-green-700 mb-2 sm:mb-3 font-bold">Start Date</p>
                <p className="font-bold text-gray-900 text-base sm:text-lg break-words">{formatDate(selectedSubscription.start_date)}</p>
              </div>
              <div className="bg-orange-50 border-2 border-orange-200 rounded-lg p-4 sm:p-5">
                <p className="text-sm sm:text-base text-orange-700 mb-2 sm:mb-3 font-bold">End Date</p>
                <p className="font-bold text-gray-900 text-base sm:text-lg break-words">{formatDate(selectedSubscription.end_date)}</p>
              </div>
              <div className="bg-purple-50 border-2 border-purple-200 rounded-lg p-4 sm:p-5">
                <p className="text-sm sm:text-base text-purple-700 mb-2 sm:mb-3 font-bold">Days Remaining</p>
                <p className={`font-bold text-2xl sm:text-3xl ${
                  selectedSubscription.days_remaining <= 3 ? 'text-red-600' :
                  selectedSubscription.days_remaining <= 7 ? 'text-orange-600' :
                  'text-gray-900'
                }`}>
                  {selectedSubscription.days_remaining} days
                </p>
              </div>
            </div>
            <div className="mt-4 sm:mt-5 bg-gray-50 rounded-lg p-4 sm:p-5">
              <p className="text-sm sm:text-base text-gray-600 mb-3">Status</p>
              <span className={`inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 rounded-lg text-base sm:text-lg font-bold border-2 ${selectedSubscription.status_color}`}>
                {selectedSubscription.status_badge === 'Active' && <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" />}
                {selectedSubscription.status_badge === 'Expired' && <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" />}
                <span className="truncate">{selectedSubscription.status_badge}</span>
              </span>
            </div>
          </div>

          {/* ═══════════════════════════════════════════════════ */}
          {/* USAGE STATISTICS */}
          {/* ═══════════════════════════════════════════════════ */}
          
          <div>
            <h4 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-4 sm:mb-5 flex items-center gap-2 sm:gap-3 border-b-2 border-green-200 pb-3 sm:pb-4">
              <QrCode className="w-6 h-6 sm:w-7 sm:h-7 text-green-600 flex-shrink-0" />
              <span className="truncate">Usage Statistics</span>
            </h4>
            <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4 sm:p-5 lg:p-6">
              <div className="flex items-center justify-between gap-3 mb-3 sm:mb-4">
                <span className="text-base sm:text-lg font-bold text-green-700">Scans Used</span>
                <span className="text-xl sm:text-2xl font-bold text-green-900 break-all">
                  {selectedSubscription.current_scan_count} / {selectedSubscription.plan_scan_limit === -1 ? '∞' : selectedSubscription.plan_scan_limit}
                </span>
              </div>
              {selectedSubscription.plan_scan_limit !== -1 && (
                <>
                  <div className="w-full bg-gray-200 rounded-full h-4 sm:h-5 mb-2 sm:mb-3 overflow-hidden">
                    <div
                      className={`h-full transition-all ${
                        selectedSubscription.scan_percentage >= 90 ? 'bg-red-500' :
                        selectedSubscription.scan_percentage >= 70 ? 'bg-orange-500' :
                        'bg-green-500'
                      }`}
                      style={{ width: `${selectedSubscription.scan_percentage}%` }}
                    ></div>
                  </div>
                  <p className="text-base sm:text-lg text-gray-700 font-medium">{selectedSubscription.scan_percentage}% used</p>
                </>
              )}
            </div>
          </div>

          {/* ═══════════════════════════════════════════════════ */}
          {/* PAYMENT INFORMATION */}
          {/* ═══════════════════════════════════════════════════ */}
          
          {selectedSubscription.payment_id && (
            <div>
              <h4 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-4 sm:mb-5 flex items-center gap-2 sm:gap-3 border-b-2 border-yellow-200 pb-3 sm:pb-4">
                <CreditCard className="w-6 h-6 sm:w-7 sm:h-7 text-yellow-600 flex-shrink-0" />
                <span className="truncate">Payment Information</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 lg:gap-5">
                <div className="bg-gray-50 rounded-lg p-4 sm:p-5">
                  <p className="text-sm sm:text-base text-gray-600 mb-2">Payment ID</p>
                  <p className="font-mono text-sm sm:text-base font-bold text-gray-900 break-all">{selectedSubscription.payment_id}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 sm:p-5">
                  <p className="text-sm sm:text-base text-gray-600 mb-2">Transaction ID</p>
                  <p className="font-mono text-sm sm:text-base font-bold text-gray-900 break-all">{selectedSubscription.transaction_id || 'N/A'}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 sm:p-5">
                  <p className="text-sm sm:text-base text-gray-600 mb-2">Amount Paid</p>
                  <p className="font-bold text-gray-900 text-base sm:text-lg flex items-center gap-1 flex-wrap">
                    <IndianRupee className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" />
                    <span className="break-all">{selectedSubscription.payment_amount?.toLocaleString('en-IN') || 'N/A'}</span>
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 sm:p-5">
                  <p className="text-sm sm:text-base text-gray-600 mb-2">Payment Date</p>
                  <p className="font-medium text-gray-900 text-base sm:text-lg break-words">
                    {selectedSubscription.payment_date ? formatDate(selectedSubscription.payment_date) : 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal Footer - Sticky */}
      <div className="sticky bottom-0 bg-gray-50 border-t-2 border-gray-200 p-4 sm:p-5 lg:p-6">
        <button
          onClick={() => {
            setShowDetailsModal(false);
            setSelectedSubscription(null);
            setSellerAnalytics(null);
          }}
          className="w-full px-6 sm:px-8 py-3 sm:py-3.5 lg:py-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 active:bg-purple-800 transition-colors font-bold text-base sm:text-lg lg:text-xl shadow-md hover:shadow-lg touch-manipulation"
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

console.log('✅ BillingHistory Component loaded - Production v3.1 (Enhanced Desktop Typography)');