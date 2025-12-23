

// import React, { useState, useEffect, useMemo } from 'react';
// import {
//   Users, Search, Filter, Download, Eye, Trash2,
//   Calendar, Phone, Mail, MapPin, Package, ChevronLeft,
//   ChevronRight, TrendingUp, AlertCircle, CheckCircle,
//   Clock, MessageSquare, X, Edit, ChevronDown, ChevronUp,
//   Loader, RefreshCw
// } from 'lucide-react';
// import { useAppStore } from '../stores/appStore';
// import {
//   subscribeToSellerInquiries,
//   subscribeToInquiryStats,
//   updateInquiryStatus,
//   deleteCustomerInquiry
// } from '../lib/firebaseutils';

// interface InquiryFilters {
//   status: string;
//   searchTerm: string;
//   startDate: string;
//   endDate: string;
//   dateRange: string;
// }

// export const CustomerInquiriesManager: React.FC = () => {
//   const { currentUser } = useAppStore();
//   const [inquiries, setInquiries] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [stats, setStats] = useState<any>(null);
//   const [error, setError] = useState<string | null>(null);
//   const [success, setSuccess] = useState<string | null>(null);
//   const [isConnected, setIsConnected] = useState(true);
//   const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  
//   // Filters
//   const [filters, setFilters] = useState<InquiryFilters>({
//     status: 'all',
//     searchTerm: '',
//     startDate: '',
//     endDate: '',
//     dateRange: 'all'
//   });

//   // Pagination
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage, setItemsPerPage] = useState(20);

//   // UI States
//   const [expandedInquiry, setExpandedInquiry] = useState<string | null>(null);
//   const [noteInput, setNoteInput] = useState<{ [key: string]: string }>({});
//   const [isMobile, setIsMobile] = useState(false);
//   const [showFilters, setShowFilters] = useState(false);

//   // Detect device
//   useEffect(() => {
//     const checkDevice = () => {
//       setIsMobile(window.innerWidth < 1024);
//     };
//     checkDevice();
//     window.addEventListener('resize', checkDevice);
//     return () => window.removeEventListener('resize', checkDevice);
//   }, []);

//   // Real-time data loading
//   useEffect(() => {
//     if (!currentUser?.user_id) {
//       setLoading(false);
//       return;
//     }

//     console.log('🔌 Setting up real-time listeners for user:', currentUser.user_id);
//     setLoading(true);
//     setIsConnected(true);

//     // Inquiries listener
//     const unsubInquiries = subscribeToSellerInquiries(
//       currentUser.user_id,
//       (data) => {
//         console.log('📊 Received inquiries update:', data.length);
//         setInquiries(data);
//         setLastUpdate(new Date());
//         setLoading(false);
//         setIsConnected(true);
//         setError(null);
//       },
//       (err) => {
//         console.error('❌ Inquiries listener error:', err);
//         setError('Connection lost. Attempting to reconnect...');
//         setIsConnected(false);
//         setLoading(false);
//       }
//     );

//     // Stats listener
//     const unsubStats = subscribeToInquiryStats(
//       currentUser.user_id,
//       (data) => {
//         console.log('📈 Received stats update:', data);
//         setStats(data);
//         setIsConnected(true);
//       },
//       (err) => {
//         console.error('❌ Stats listener error:', err);
//         setIsConnected(false);
//       }
//     );

//     // Cleanup
//     return () => {
//       console.log('🔌 Cleaning up listeners');
//       unsubInquiries();
//       unsubStats();
//     };
//   }, [currentUser?.user_id]);

//   // Auto-clear messages
//   useEffect(() => {
//     if (error || success) {
//       const timer = setTimeout(() => {
//         setError(null);
//         setSuccess(null);
//       }, 5000);
//       return () => clearTimeout(timer);
//     }
//   }, [error, success]);

//   // Apply date range preset
//   const applyDateRange = (range: string) => {
//     const today = new Date();
//     let startDate = '';
//     let endDate = today.toISOString().split('T')[0];

//     switch (range) {
//       case 'today':
//         startDate = endDate;
//         break;
//       case '7days':
//         const week = new Date(today);
//         week.setDate(week.getDate() - 7);
//         startDate = week.toISOString().split('T')[0];
//         break;
//       case '30days':
//         const month = new Date(today);
//         month.setDate(month.getDate() - 30);
//         startDate = month.toISOString().split('T')[0];
//         break;
//       case '3months':
//         const threeMonths = new Date(today);
//         threeMonths.setMonth(threeMonths.getMonth() - 3);
//         startDate = threeMonths.toISOString().split('T')[0];
//         break;
//       case '6months':
//         const sixMonths = new Date(today);
//         sixMonths.setMonth(sixMonths.getMonth() - 6);
//         startDate = sixMonths.toISOString().split('T')[0];
//         break;
//       default:
//         startDate = '';
//         endDate = '';
//     }

//     setFilters(prev => ({
//       ...prev,
//       dateRange: range,
//       startDate,
//       endDate
//     }));
//   };

//   // Filtered inquiries
//   const filteredInquiries = useMemo(() => {
//     let filtered = [...inquiries];

//     // Status filter
//     if (filters.status !== 'all') {
//       filtered = filtered.filter(inq => inq.status === filters.status);
//     }

//     // Search filter
//     if (filters.searchTerm.trim()) {
//       const search = filters.searchTerm.toLowerCase().trim();
//       filtered = filtered.filter(inq =>
//         inq.customer_name?.toLowerCase().includes(search) ||
//         inq.customer_email?.toLowerCase().includes(search) ||
//         inq.customer_phone?.includes(search) ||
//         inq.tile_name?.toLowerCase().includes(search) ||
//         inq.tile_code?.toLowerCase().includes(search)
//       );
//     }

//     // Date range filter
//     if (filters.startDate || filters.endDate) {
//       filtered = filtered.filter(inq => {
//         const inqDate = new Date(inq.timestamp);

//         if (filters.startDate) {
//           const start = new Date(filters.startDate);
//           if (inqDate < start) return false;
//         }

//         if (filters.endDate) {
//           const end = new Date(filters.endDate);
//           end.setHours(23, 59, 59, 999);
//           if (inqDate > end) return false;
//         }

//         return true;
//       });
//     }

//     return filtered;
//   }, [inquiries, filters]);

//   // Paginated inquiries
//   const paginatedInquiries = useMemo(() => {
//     const startIndex = (currentPage - 1) * itemsPerPage;
//     const endIndex = startIndex + itemsPerPage;
//     return filteredInquiries.slice(startIndex, endIndex);
//   }, [filteredInquiries, currentPage, itemsPerPage]);

//   const totalPages = Math.ceil(filteredInquiries.length / itemsPerPage);

//   // Handle status change
//   const handleStatusChange = async (inquiryId: string, newStatus: string) => {
//     try {
//       setError(null);
      
//       const result = await updateInquiryStatus(inquiryId, newStatus as any);
      
//       if (result.success) {
//         // Real-time listener will update the data automatically
//         setSuccess('Status updated successfully');
//       } else {
//         setError(result.error || 'Failed to update status');
//       }
//     } catch (err: any) {
//       console.error('❌ Error updating status:', err);
//       setError('Failed to update status. Please try again.');
//     }
//   };

//   // Handle delete
//   const handleDelete = async (inquiryId: string, customerName: string) => {
//     if (!window.confirm(`Delete inquiry from ${customerName}?\n\nThis action cannot be undone.`)) {
//       return;
//     }

//     try {
//       setError(null);
      
//       const result = await deleteCustomerInquiry(inquiryId);
      
//       if (result.success) {
//         // Real-time listener will update the data automatically
//         setSuccess('Inquiry deleted successfully');
//       } else {
//         setError(result.error || 'Failed to delete inquiry');
//       }
//     } catch (err: any) {
//       console.error('❌ Error deleting inquiry:', err);
//       setError('Failed to delete inquiry. Please try again.');
//     }
//   };

//   // Handle note save
//   const handleNoteSave = async (inquiryId: string) => {
//     const note = noteInput[inquiryId]?.trim();
//     if (!note) return;

//     try {
//       setError(null);
      
//       // Get current inquiry to preserve its status
//       const currentInquiry = inquiries.find(inq => inq.id === inquiryId);
//       if (!currentInquiry) {
//         setError('Inquiry not found');
//         return;
//       }
      
//       const result = await updateInquiryStatus(inquiryId, currentInquiry.status, note);
      
//       if (result.success) {
//         // Real-time listener will update the data automatically
//         setNoteInput(prev => ({ ...prev, [inquiryId]: '' }));
//         setSuccess('Note saved successfully');
//       } else {
//         setError(result.error || 'Failed to save note');
//       }
//     } catch (err) {
//       console.error('❌ Error saving note:', err);
//       setError('Failed to save note');
//     }
//   };

//   // Export to CSV
//   const handleExport = () => {
//     try {
//       const headers = [
//         'Customer Name',
//         'Email',
//         'Phone',
//         'Address',
//         'Tile Name',
//         'Tile Code',
//         'Worker Email',
//         'Date',
//         'Status',
//         'Notes'
//       ];

//       const rows = filteredInquiries.map(inq => [
//         inq.customer_name || '',
//         inq.customer_email || '',
//         inq.customer_phone || '',
//         inq.customer_address || '',
//         inq.tile_name || '',
//         inq.tile_code || '',
//         inq.worker_email || '',
//         new Date(inq.timestamp).toLocaleString(),
//         inq.status || '',
//         inq.notes || ''
//       ]);

//       const csv = [
//         headers.join(','),
//         ...rows.map(row => row.map(cell => `"${cell.toString().replace(/"/g, '""')}"`).join(','))
//       ].join('\n');

//       const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
//       const url = URL.createObjectURL(blob);
//       const a = document.createElement('a');
//       a.href = url;
//       a.download = `customer-inquiries-${new Date().toISOString().split('T')[0]}.csv`;
//       document.body.appendChild(a);
//       a.click();
//       document.body.removeChild(a);
//       URL.revokeObjectURL(url);

//       setSuccess('Exported successfully');
//     } catch (err) {
//       console.error('❌ Error exporting:', err);
//       setError('Failed to export data');
//     }
//   };

//   // Handle manual refresh (just updates timestamp to show it's live)
//   const handleRefresh = () => {
//     setLastUpdate(new Date());
//     setSuccess('Data is syncing in real-time!');
//   };

//   // Status badge
//   const getStatusBadge = (status: string) => {
//     const styles = {
//       new: 'bg-green-100 text-green-800 border-green-200',
//       contacted: 'bg-yellow-100 text-yellow-800 border-yellow-200',
//       converted: 'bg-blue-100 text-blue-800 border-blue-200',
//       closed: 'bg-gray-100 text-gray-800 border-gray-200'
//     };

//     const labels = {
//       new: 'New',
//       contacted: 'Contacted',
//       converted: 'Converted',
//       closed: 'Closed'
//     };

//     return (
//       <span className={`px-2 py-1 rounded-full text-xs font-medium border ${styles[status as keyof typeof styles] || styles.new}`}>
//         {labels[status as keyof typeof labels] || status}
//       </span>
//     );
//   };

//   // Format date
//   const formatDate = (dateStr: string) => {
//     const date = new Date(dateStr);
//     const now = new Date();
//     const diffMs = now.getTime() - date.getTime();
//     const diffMins = Math.floor(diffMs / 60000);

//     if (diffMins < 1) return 'Just now';
//     if (diffMins < 60) return `${diffMins}m ago`;
    
//     const diffHours = Math.floor(diffMins / 60);
//     if (diffHours < 24) return `${diffHours}h ago`;
    
//     const diffDays = Math.floor(diffHours / 24);
//     if (diffDays < 7) return `${diffDays}d ago`;

//     return date.toLocaleDateString('en-US', { 
//       month: 'short', 
//       day: 'numeric',
//       year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
//     });
//   };

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-64">
//         <div className="text-center">
//           <Loader className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
//           <p className="text-gray-600 text-lg">Loading customer inquiries...</p>
//           <p className="text-gray-500 text-sm mt-2">Setting up real-time sync</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-4 sm:space-y-6">
      
//       {/* Header */}
//       <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
//         <div>
//           <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-2 flex-wrap">
//             <Users className="w-7 h-7 sm:w-8 sm:h-8 text-blue-600" />
//             Customer Inquiries
            
//             {/* Live indicator */}
//             {isConnected ? (
//               <span className="text-xs font-normal text-green-600 flex items-center gap-1">
//                 <span className="relative flex h-2 w-2">
//                   <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
//                   <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
//                 </span>
//                 Live
//               </span>
//             ) : (
//               <span className="text-xs font-normal text-red-600 flex items-center gap-1">
//                 <span className="relative flex h-2 w-2">
//                   <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
//                 </span>
//                 Offline
//               </span>
//             )}
//           </h2>
       
//         </div>

//         <div className="flex gap-2 w-full sm:w-auto">
//           <button
//             onClick={handleRefresh}
//             className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
//             title="Data syncs automatically in real-time"
//           >
//             <RefreshCw className={`w-4 h-4 ${isConnected ? 'text-green-600' : 'text-gray-400'}`} />
//             <span className="hidden sm:inline">Refresh</span>
//           </button>
//           <button
//             onClick={handleExport}
//             disabled={filteredInquiries.length === 0}
//             className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
//           >
//             <Download className="w-4 h-4" />
//             <span className="hidden sm:inline">Export CSV</span>
//           </button>
//         </div>
//       </div>

//       {/* Stats Cards */}
//       {stats && (
//         <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
//           <div className="bg-white border border-gray-200 rounded-lg p-3 sm:p-4 shadow-sm">
//             <div className="flex items-center gap-2 mb-1">
//               <Users className="w-4 h-4 text-gray-600" />
//               <p className="text-xs sm:text-sm text-gray-600">Total</p>
//             </div>
//             <p className="text-2xl sm:text-3xl font-bold text-gray-900">{stats.total || 0}</p>
//           </div>

//           <div className="bg-green-50 border border-green-200 rounded-lg p-3 sm:p-4 shadow-sm">
//             <div className="flex items-center gap-2 mb-1">
//               <CheckCircle className="w-4 h-4 text-green-600" />
//               <p className="text-xs sm:text-sm text-green-700">New</p>
//             </div>
//             <p className="text-2xl sm:text-3xl font-bold text-green-900">{stats.new || 0}</p>
//           </div>

//           <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 sm:p-4 shadow-sm">
//             <div className="flex items-center gap-2 mb-1">
//               <Clock className="w-4 h-4 text-yellow-600" />
//               <p className="text-xs sm:text-sm text-yellow-700">Contacted</p>
//             </div>
//             <p className="text-2xl sm:text-3xl font-bold text-yellow-900">{stats.contacted || 0}</p>
//           </div>

//           <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4 shadow-sm">
//             <div className="flex items-center gap-2 mb-1">
//               <TrendingUp className="w-4 h-4 text-blue-600" />
//               <p className="text-xs sm:text-sm text-blue-700">Converted</p>
//             </div>
//             <p className="text-2xl sm:text-3xl font-bold text-blue-900">{stats.converted || 0}</p>
//           </div>

//           <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 sm:p-4 shadow-sm">
//             <div className="flex items-center gap-2 mb-1">
//               <Calendar className="w-4 h-4 text-purple-600" />
//               <p className="text-xs sm:text-sm text-purple-700">This Month</p>
//             </div>
//             <p className="text-2xl sm:text-3xl font-bold text-purple-900">{stats.thisMonth || 0}</p>
//           </div>
//         </div>
//       )}

//       {/* Alerts */}
//       {error && (
//         <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
//           <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
//           <div className="flex-1 min-w-0">
//             <p className="text-red-800 font-medium text-sm">Error</p>
//             <p className="text-red-700 text-xs sm:text-sm break-words">{error}</p>
//           </div>
//           <button onClick={() => setError(null)} className="text-red-400 hover:text-red-600">
//             <X className="w-4 h-4" />
//           </button>
//         </div>
//       )}

//       {success && (
//         <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
//           <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
//           <div className="flex-1 min-w-0">
//             <p className="text-green-800 font-medium text-sm">Success</p>
//             <p className="text-green-700 text-xs sm:text-sm break-words">{success}</p>
//           </div>
//           <button onClick={() => setSuccess(null)} className="text-green-400 hover:text-green-600">
//             <X className="w-4 h-4" />
//           </button>
//         </div>
//       )}

//       {/* Filters */}
//       <div className="bg-white border border-gray-200 rounded-lg p-4">
//         <button
//           onClick={() => setShowFilters(!showFilters)}
//           className="lg:hidden w-full flex items-center justify-between mb-4 text-gray-700 font-medium"
//         >
//           <span className="flex items-center gap-2">
//             <Filter className="w-5 h-5" />
//               Filters
//             </span>
//             {showFilters ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
//           </button>

//           <div className={`${isMobile && !showFilters ? 'hidden' : 'grid'} grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3`}>
            
//             {/* Search */}
//             <div className="lg:col-span-2">
//               <div className="relative">
//                 <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
//                 <input
//                   type="text"
//                   placeholder="Search by name, email, phone, tile..."
//                   value={filters.searchTerm}
//                   onChange={(e) => setFilters(prev => ({ ...prev, searchTerm: e.target.value }))}
//                   className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
//                 />
//               </div>
//             </div>

//             {/* Status Filter */}
//             <div>
//               <select
//                 value={filters.status}
//                 onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
//               >
//                 <option value="all">All Status ({inquiries.length})</option>
//                 <option value="new">New ({stats?.new || 0})</option>
//                 <option value="contacted">Contacted ({stats?.contacted || 0})</option>
//                 <option value="converted">Converted ({stats?.converted || 0})</option>
//                 <option value="closed">Closed ({stats?.closed || 0})</option>
//               </select>
//             </div>

//             {/* Date Range */}
//             <div>
//               <select
//                 value={filters.dateRange}
//                 onChange={(e) => applyDateRange(e.target.value)}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
//               >
//                 <option value="all">All Time</option>
//                 <option value="today">Today</option>
//                 <option value="7days">Last 7 Days</option>
//                 <option value="30days">Last 30 Days</option>
//                 <option value="3months">Last 3 Months</option>
//                 <option value="6months">Last 6 Months</option>
//                 <option value="custom">Custom Range</option>
//               </select>
//             </div>

//             {/* Custom Date Range */}
//             {filters.dateRange === 'custom' && (
//               <>
//                 <div className="sm:col-span-2 lg:col-span-1">
//                   <input
//                     type="date"
//                     value={filters.startDate}
//                     onChange={(e) => setFilters(prev => ({ ...prev, startDate: e.target.value }))}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
//                     placeholder="Start Date"
//                   />
//                 </div>
//                 <div className="sm:col-span-2 lg:col-span-1">
//                   <input
//                     type="date"
//                     value={filters.endDate}
//                     onChange={(e) => setFilters(prev => ({ ...prev, endDate: e.target.value }))}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
//                     placeholder="End Date"
//                   />
//                 </div>
//               </>
//             )}
//           </div>

//           {/* Active Filters Summary */}
//           {(filters.searchTerm || filters.status !== 'all' || filters.dateRange !== 'all') && (
//             <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
//               <span className="text-gray-600">Active filters:</span>
              
//               {filters.searchTerm && (
//                 <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full flex items-center gap-1">
//                   Search: "{filters.searchTerm}"
//                   <button
//                     onClick={() => setFilters(prev => ({ ...prev, searchTerm: '' }))}
//                     className="hover:bg-blue-200 rounded-full p-0.5"
//                   >
//                     <X className="w-3 h-3" />
//                   </button>
//                 </span>
//               )}
              
//               {filters.status !== 'all' && (
//                 <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full flex items-center gap-1 capitalize">
//                   {filters.status}
//                   <button
//                     onClick={() => setFilters(prev => ({ ...prev, status: 'all' }))}
//                     className="hover:bg-blue-200 rounded-full p-0.5"
//                   >
//                     <X className="w-3 h-3" />
//                   </button>
//                 </span>
//               )}
              
//               {filters.dateRange !== 'all' && (
//                 <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full flex items-center gap-1">
//                   {filters.dateRange === 'custom' 
//                     ? `${filters.startDate} to ${filters.endDate}`
//                     : filters.dateRange
//                   }
//                   <button
//                     onClick={() => setFilters(prev => ({ ...prev, dateRange: 'all', startDate: '', endDate: '' }))}
//                     className="hover:bg-blue-200 rounded-full p-0.5"
//                   >
//                     <X className="w-3 h-3" />
//                   </button>
//                 </span>
//               )}
              
//               <button
//                 onClick={() => setFilters({
//                   status: 'all',
//                   searchTerm: '',
//                   startDate: '',
//                   endDate: '',
//                   dateRange: 'all'
//                 })}
//                 className="text-xs text-blue-600 hover:text-blue-800 underline"
//               >
//                 Clear all
//               </button>
//             </div>
//           )}
//         </div>

//         {/* Results Summary */}
//         <div className="flex items-center justify-between text-sm text-gray-600">
//           <p>
//             Showing {paginatedInquiries.length} of {filteredInquiries.length} inquiries
//             {filteredInquiries.length !== inquiries.length && ` (filtered from ${inquiries.length} total)`}
//           </p>
          
//           <select
//             value={itemsPerPage}
//             onChange={(e) => {
//               setItemsPerPage(Number(e.target.value));
//               setCurrentPage(1);
//             }}
//             className="px-3 py-1 border border-gray-300 rounded-lg text-sm"
//           >
//             <option value="10">10 per page</option>
//             <option value="20">20 per page</option>
//             <option value="50">50 per page</option>
//             <option value="100">100 per page</option>
//           </select>
//         </div>

//         {/* Data Display */}
//         {filteredInquiries.length === 0 ? (
//           <div className="bg-white border border-gray-200 rounded-lg p-8 sm:p-12 text-center">
//             <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
//             <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
//               {inquiries.length === 0 ? 'No Inquiries Yet' : 'No Results Found'}
//             </h3>
//             <p className="text-gray-600 text-sm sm:text-base mb-4">
//               {inquiries.length === 0 
//                 ? 'Customer inquiries from QR scans will appear here'
//                 : 'Try adjusting your filters or search term'
//               }
//             </p>
//             {filteredInquiries.length === 0 && inquiries.length > 0 && (
//               <button
//                 onClick={() => setFilters({
//                   status: 'all',
//                   searchTerm: '',
//                   startDate: '',
//                   endDate: '',
//                   dateRange: 'all'
//                 })}
//                 className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
//               >
//                 Clear Filters
//               </button>
//             )}
//           </div>
//         ) : (
//           <>
//             {/* Desktop Table */}
//             <div className="hidden lg:block bg-white border border-gray-200 rounded-lg overflow-hidden">
//               <div className="overflow-x-auto">
//                 <table className="w-full">
//                   <thead className="bg-gray-50 border-b border-gray-200">
//                     <tr>
//                       <th className="text-left p-4 text-xs font-semibold text-gray-700">Customer</th>
//                       <th className="text-left p-4 text-xs font-semibold text-gray-700">Contact</th>
//                       <th className="text-left p-4 text-xs font-semibold text-gray-700">Tile</th>
//                       <th className="text-left p-4 text-xs font-semibold text-gray-700">Worker</th>
//                       <th className="text-left p-4 text-xs font-semibold text-gray-700">Date</th>
//                       <th className="text-left p-4 text-xs font-semibold text-gray-700">Status</th>
//                       <th className="text-left p-4 text-xs font-semibold text-gray-700">Actions</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {paginatedInquiries.map((inquiry, index) => (
//                       <React.Fragment key={inquiry.id}>
//                         <tr className={`border-t border-gray-200 hover:bg-gray-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
//                           <td className="p-4">
//                             <div className="flex items-center gap-3">
//                               {inquiry.tile_image_url && (
//                                 <img
//                                   src={inquiry.tile_image_url}
//                                   alt={inquiry.tile_name}
//                                   className="w-10 h-10 object-cover rounded-lg border border-gray-200 flex-shrink-0"
//                                 />
//                               )}
//                               <div className="min-w-0">
//                                 <p className="font-medium text-gray-900 truncate">{inquiry.customer_name}</p>
//                                 <p className="text-xs text-gray-500 truncate">{inquiry.customer_address.substring(0, 30)}...</p>
//                               </div>
//                             </div>
//                           </td>
                          
//                           <td className="p-4">
//                             <div className="space-y-1 text-sm">
//                               <div className="flex items-center gap-2 text-gray-600">
//                                 <Mail className="w-4 h-4 flex-shrink-0" />
//                                 <span className="truncate">{inquiry.customer_email}</span>
//                               </div>
//                               <div className="flex items-center gap-2 text-gray-600">
//                                 <Phone className="w-4 h-4 flex-shrink-0" />
//                                 <span>{inquiry.customer_phone}</span>
//                               </div>
//                             </div>
//                           </td>
                          
//                           <td className="p-4">
//                             <div>
//                               <p className="font-medium text-gray-900 text-sm truncate">{inquiry.tile_name}</p>
//                               {inquiry.tile_code && (
//                                 <p className="text-xs text-gray-500 font-mono">{inquiry.tile_code}</p>
//                               )}
//                               {inquiry.tile_size && (
//                                 <p className="text-xs text-gray-500">{inquiry.tile_size}</p>
//                               )}
//                             </div>
//                           </td>
                          
//                           <td className="p-4">
//                             <p className="text-sm text-gray-600 truncate">{inquiry.worker_email}</p>
//                             <p className="text-xs text-gray-400">{inquiry.device_type || 'mobile'}</p>
//                           </td>
                          
//                           <td className="p-4">
//                             <p className="text-sm text-gray-900">{formatDate(inquiry.timestamp)}</p>
//                             <p className="text-xs text-gray-500">
//                               {new Date(inquiry.timestamp).toLocaleTimeString('en-US', { 
//                                 hour: '2-digit', 
//                                 minute: '2-digit' 
//                               })}
//                             </p>
//                           </td>
                          
//                           <td className="p-4">
//                             <select
//                               value={inquiry.status}
//                               onChange={(e) => handleStatusChange(inquiry.id, e.target.value)}
//                               className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
//                             >
//                               <option value="new">New</option>
//                               <option value="contacted">Contacted</option>
//                               <option value="converted">Converted</option>
//                               <option value="closed">Closed</option>
//                             </select>
//                           </td>
                          
//                           <td className="p-4">
//                             <div className="flex items-center gap-2">
//                               <button
//                                 onClick={() => setExpandedInquiry(expandedInquiry === inquiry.id ? null : inquiry.id)}
//                                 className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
//                                 title="View details"
//                               >
//                                 {expandedInquiry === inquiry.id ? (
//                                   <ChevronUp className="w-4 h-4 text-gray-600" />
//                                 ) : (
//                                   <ChevronDown className="w-4 h-4 text-gray-600" />
//                                 )}
//                               </button>
                              
//                               <button
//                                 onClick={() => handleDelete(inquiry.id, inquiry.customer_name)}
//                                 className="p-2 hover:bg-red-100 rounded-lg transition-colors"
//                                 title="Delete"
//                               >
//                                 <Trash2 className="w-4 h-4 text-red-600" />
//                               </button>
//                             </div>
//                           </td>
//                         </tr>
                        
//                         {/* Expanded Details */}
//                         {expandedInquiry === inquiry.id && (
//                           <tr>
//                             <td colSpan={7} className="p-4 bg-gray-50 border-t border-gray-200">
//                               <div className="space-y-4">
//                                 <div>
//                                   <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
//                                     <MapPin className="w-4 h-4" />
//                                     Complete Address
//                                   </h4>
//                                   <p className="text-gray-700 text-sm bg-white p-3 rounded-lg border border-gray-200">
//                                     {inquiry.customer_address}
//                                   </p>
//                                 </div>
                                
//                                 <div>
//                                   <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
//                                     <MessageSquare className="w-4 h-4" />
//                                     Notes
//                                   </h4>
//                                   {inquiry.notes && (
//                                     <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-2">
//                                       <p className="text-sm text-gray-700">{inquiry.notes}</p>
//                                     </div>
//                                   )}
//                                   <div className="flex gap-2">
//                                     <input
//                                       type="text"
//                                       value={noteInput[inquiry.id] || ''}
//                                       onChange={(e) => setNoteInput(prev => ({ ...prev, [inquiry.id]: e.target.value }))}
//                                       placeholder="Add a note..."
//                                       className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
//                                       onKeyPress={(e) => {
//                                         if (e.key === 'Enter' && noteInput[inquiry.id]?.trim()) {
//                                           handleNoteSave(inquiry.id);
//                                         }
//                                       }}
//                                     />
//                                     <button
//                                       onClick={() => handleNoteSave(inquiry.id)}
//                                       disabled={!noteInput[inquiry.id]?.trim()}
//                                       className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
//                                     >
//                                       Save Note
//                                     </button>
//                                   </div>
//                                 </div>
//                               </div>
//                             </td>
//                           </tr>
//                         )}
//                       </React.Fragment>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             </div>

//             {/* Mobile Cards */}
//             <div className="lg:hidden space-y-4">
//               {paginatedInquiries.map((inquiry) => (
//                 <div key={inquiry.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                  
//                   {/* Header */}
//                   <div className="flex items-start gap-3 mb-3">
//                     {inquiry.tile_image_url && (
//                       <img
//                         src={inquiry.tile_image_url}
//                         alt={inquiry.tile_name}
//                         className="w-16 h-16 object-cover rounded-lg border border-gray-200 flex-shrink-0"
//                       />
//                     )}
//                     <div className="flex-1 min-w-0">
//                       <h3 className="font-semibold text-gray-900 truncate">{inquiry.customer_name}</h3>
//                       <p className="text-sm text-gray-600 truncate">{inquiry.tile_name}</p>
//                       <div className="mt-1">
//                         {getStatusBadge(inquiry.status)}
//                     </div>
//                   </div>F
//                 </div>
                
//                 {/* Contact Info */}
//                 <div className="space-y-2 mb-3 text-sm">
//                   <div className="flex items-center gap-2 text-gray-600">
//                     <Mail className="w-4 h-4 flex-shrink-0" />
//                     <a href={`mailto:${inquiry.customer_email}`} className="truncate hover:text-blue-600">
//                       {inquiry.customer_email}
//                     </a>
//                   </div>
                  
//                   <div className="flex items-center gap-2 text-gray-600">
//                     <Phone className="w-4 h-4 flex-shrink-0" />
//                     <a href={`tel:${inquiry.customer_phone}`} className="hover:text-blue-600">
//                       {inquiry.customer_phone}
//                     </a>
//                   </div>
                  
//                   <div className="flex items-start gap-2 text-gray-600">
//                     <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
//                     <p className="text-xs">{inquiry.customer_address}</p>
//                   </div>
//                 </div>
                
//                 {/* Meta Info */}
//                 <div className="flex items-center justify-between text-xs text-gray-500 mb-3 pb-3 border-b border-gray-200">
//                   <span>{formatDate(inquiry.timestamp)}</span>
//                   <span className="truncate ml-2">{inquiry.worker_email}</span>
//                 </div>
                
//                 {/* Actions */}
//                 <div className="flex gap-2">
//                   <select
//                     value={inquiry.status}
//                     onChange={(e) => handleStatusChange(inquiry.id, e.target.value)}
//                     className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
//                   >
//                     <option value="new">New</option>
//                     <option value="contacted">Contacted</option>
//                     <option value="converted">Converted</option>
//                     <option value="closed">Closed</option>
//                   </select>
                  
//                   <button
//                     onClick={() => setExpandedInquiry(expandedInquiry === inquiry.id ? null : inquiry.id)}
//                     className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm"
//                   >
//                     {expandedInquiry === inquiry.id ? 'Hide' : 'View'}
//                   </button>
                  
//                   <button
//                     onClick={() => handleDelete(inquiry.id, inquiry.customer_name)}
//                     className="p-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50"
//                   >
//                     <Trash2 className="w-4 h-4" />
//                   </button>
//                 </div>
                
//                 {/* Expanded Notes */}
//                 {expandedInquiry === inquiry.id && (
//                   <div className="mt-4 pt-4 border-t border-gray-200 space-y-3">
//                     {inquiry.notes && (
//                       <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
//                         <p className="text-sm text-gray-700">{inquiry.notes}</p>
//                       </div>
//                     )}
//                     <div className="flex flex-col gap-2">
//                       <input
//                         type="text"
//                         value={noteInput[inquiry.id] || ''}
//                         onChange={(e) => setNoteInput(prev => ({ ...prev, [inquiry.id]: e.target.value }))}
//                         placeholder="Add a note..."
//                         className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
//                         onKeyPress={(e) => {
//                           if (e.key === 'Enter' && noteInput[inquiry.id]?.trim()) {
//                             handleNoteSave(inquiry.id);
//                           }
//                         }}
//                       />
//                       <button
//                         onClick={() => handleNoteSave(inquiry.id)}
//                         disabled={!noteInput[inquiry.id]?.trim()}
//                         className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
//                       >
//                         Save Note
//                       </button>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             ))}
//           </div>
//         </>
//       )}

//       {/* Pagination */}
//       {totalPages > 1 && (
//         <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white border border-gray-200 rounded-lg p-4">
//           <p className="text-sm text-gray-600">
//             Page {currentPage} of {totalPages}
//           </p>
          
//           <div className="flex items-center gap-2">
//             <button
//               onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
//               disabled={currentPage === 1}
//               className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               <ChevronLeft className="w-5 h-5" />
//             </button>
            
//             {/* Page Numbers */}
//             <div className="hidden sm:flex items-center gap-1">
//               {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
//                 let pageNum;
//                 if (totalPages <= 5) {
//                   pageNum = i + 1;
//                 } else if (currentPage <= 3) {
//                   pageNum = i + 1;
//                 } else if (currentPage >= totalPages - 2) {
//                   pageNum = totalPages - 4 + i;
//                 } else {
//                   pageNum = currentPage - 2 + i;
//                 }
                
//                 return (
//                   <button
//                     key={pageNum}
//                     onClick={() => setCurrentPage(pageNum)}
//                     className={`
//                       px-3 py-1 rounded-lg text-sm font-medium
//                       ${currentPage === pageNum
//                         ? 'bg-blue-600 text-white'
//                         : 'border border-gray-300 hover:bg-gray-50'
//                       }
//                     `}
//                   >
//                     {pageNum}
//                   </button>
//                 );
//               })}
//             </div>
            
//             <button
//               onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
//               disabled={currentPage === totalPages}
//               className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               <ChevronRight className="w-5 h-5" />
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }; 
import React, { useState, useEffect, useMemo } from 'react';
import {
  Users, Search, Filter, Download, Eye, Trash2,
  Calendar, Phone, Mail, MapPin, Package, ChevronLeft,
  ChevronRight, TrendingUp, AlertCircle, CheckCircle,
  Clock, MessageSquare, X, Edit, ChevronDown, ChevronUp,
  Loader, RefreshCw
} from 'lucide-react';
import { useAppStore } from '../stores/appStore';
import {
  subscribeToSellerInquiries,
  subscribeToInquiryStats,
  updateInquiryStatus,
  deleteCustomerInquiry
} from '../lib/firebaseutils';

// ═══════════════════════════════════════════════════════════════
// ✅ HELPER FUNCTIONS (SAFE NULL HANDLING)
// ═══════════════════════════════════════════════════════════════

const safeTruncate = (value: string | null | undefined, maxLength: number = 50): string => {
  if (!value) return '-';
  if (value.length <= maxLength) return value;
  return value.substring(0, maxLength) + '...';
};

const safeValue = (value: string | null | undefined, placeholder: string = 'N/A'): string => {
  return value && value.trim() ? value : placeholder;
};

const safeEmail = (value: string | null | undefined): JSX.Element => {
  if (!value || !value.trim()) {
    return <span className="text-gray-400 italic text-xs">No email</span>;
  }
  return <span>{value}</span>;
};

const safeAddress = (value: string | null | undefined, maxLength?: number): JSX.Element => {
  if (!value || !value.trim()) {
    return <span className="text-gray-400 italic text-xs">No address</span>;
  }
  const truncated = maxLength ? safeTruncate(value, maxLength) : value;
  return <span>{truncated}</span>;
};

// ═══════════════════════════════════════════════════════════════
// ✅ INTERFACES
// ═══════════════════════════════════════════════════════════════

interface InquiryFilters {
  status: string;
  searchTerm: string;
  startDate: string;
  endDate: string;
  dateRange: string;
}

export const CustomerInquiriesManager: React.FC = () => {
  const { currentUser } = useAppStore();
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  
  // Filters
  const [filters, setFilters] = useState<InquiryFilters>({
    status: 'all',
    searchTerm: '',
    startDate: '',
    endDate: '',
    dateRange: 'all'
  });

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);

  // UI States
  const [expandedInquiry, setExpandedInquiry] = useState<string | null>(null);
  const [noteInput, setNoteInput] = useState<{ [key: string]: string }>({});
  const [isMobile, setIsMobile] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Detect device
  useEffect(() => {
    const checkDevice = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkDevice();
    window.addEventListener('resize', checkDevice);
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  // Real-time data loading
  useEffect(() => {
    if (!currentUser?.user_id) {
      setLoading(false);
      return;
    }

    console.log('🔌 Setting up real-time listeners for user:', currentUser.user_id);
    setLoading(true);
    setIsConnected(true);

    // Inquiries listener
    const unsubInquiries = subscribeToSellerInquiries(
      currentUser.user_id,
      (data) => {
        console.log('📊 Received inquiries update:', data.length);
        setInquiries(data);
        setLastUpdate(new Date());
        setLoading(false);
        setIsConnected(true);
        setError(null);
      },
      (err) => {
        console.error('❌ Inquiries listener error:', err);
        setError('Connection lost. Attempting to reconnect...');
        setIsConnected(false);
        setLoading(false);
      }
    );

    // Stats listener
    const unsubStats = subscribeToInquiryStats(
      currentUser.user_id,
      (data) => {
        console.log('📈 Received stats update:', data);
        setStats(data);
        setIsConnected(true);
      },
      (err) => {
        console.error('❌ Stats listener error:', err);
        setIsConnected(false);
      }
    );

    // Cleanup
    return () => {
      console.log('🔌 Cleaning up listeners');
      unsubInquiries();
      unsubStats();
    };
  }, [currentUser?.user_id]);

  // Auto-clear messages
  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError(null);
        setSuccess(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  // Apply date range preset
  const applyDateRange = (range: string) => {
    const today = new Date();
    let startDate = '';
    let endDate = today.toISOString().split('T')[0];

    switch (range) {
      case 'today':
        startDate = endDate;
        break;
      case '7days':
        const week = new Date(today);
        week.setDate(week.getDate() - 7);
        startDate = week.toISOString().split('T')[0];
        break;
      case '30days':
        const month = new Date(today);
        month.setDate(month.getDate() - 30);
        startDate = month.toISOString().split('T')[0];
        break;
      case '3months':
        const threeMonths = new Date(today);
        threeMonths.setMonth(threeMonths.getMonth() - 3);
        startDate = threeMonths.toISOString().split('T')[0];
        break;
      case '6months':
        const sixMonths = new Date(today);
        sixMonths.setMonth(sixMonths.getMonth() - 6);
        startDate = sixMonths.toISOString().split('T')[0];
        break;
      default:
        startDate = '';
        endDate = '';
    }

    setFilters(prev => ({
      ...prev,
      dateRange: range,
      startDate,
      endDate
    }));
  };

  // Filtered inquiries
  const filteredInquiries = useMemo(() => {
    let filtered = [...inquiries];

    // Status filter
    if (filters.status !== 'all') {
      filtered = filtered.filter(inq => inq.status === filters.status);
    }

    // Search filter (✅ SAFE NULL CHECKS)
    if (filters.searchTerm.trim()) {
      const search = filters.searchTerm.toLowerCase().trim();
      filtered = filtered.filter(inq =>
        inq.customer_name?.toLowerCase().includes(search) ||
        inq.customer_email?.toLowerCase().includes(search) ||
        inq.customer_phone?.includes(search) ||
        inq.tile_name?.toLowerCase().includes(search) ||
        inq.tile_code?.toLowerCase().includes(search) ||
        inq.customer_address?.toLowerCase().includes(search)
      );
    }

    // Date range filter
    if (filters.startDate || filters.endDate) {
      filtered = filtered.filter(inq => {
        const inqDate = new Date(inq.timestamp);

        if (filters.startDate) {
          const start = new Date(filters.startDate);
          if (inqDate < start) return false;
        }

        if (filters.endDate) {
          const end = new Date(filters.endDate);
          end.setHours(23, 59, 59, 999);
          if (inqDate > end) return false;
        }

        return true;
      });
    }

    return filtered;
  }, [inquiries, filters]);

  // Paginated inquiries
  const paginatedInquiries = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredInquiries.slice(startIndex, endIndex);
  }, [filteredInquiries, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredInquiries.length / itemsPerPage);

  // Handle status change
  const handleStatusChange = async (inquiryId: string, newStatus: string) => {
    try {
      setError(null);
      
      const result = await updateInquiryStatus(inquiryId, newStatus as any);
      
      if (result.success) {
        setSuccess('Status updated successfully');
      } else {
        setError(result.error || 'Failed to update status');
      }
    } catch (err: any) {
      console.error('❌ Error updating status:', err);
      setError('Failed to update status. Please try again.');
    }
  };

  // Handle delete
  const handleDelete = async (inquiryId: string, customerName: string) => {
    if (!window.confirm(`Delete inquiry from ${customerName}?\n\nThis action cannot be undone.`)) {
      return;
    }

    try {
      setError(null);
      
      const result = await deleteCustomerInquiry(inquiryId);
      
      if (result.success) {
        setSuccess('Inquiry deleted successfully');
      } else {
        setError(result.error || 'Failed to delete inquiry');
      }
    } catch (err: any) {
      console.error('❌ Error deleting inquiry:', err);
      setError('Failed to delete inquiry. Please try again.');
    }
  };

  // Handle note save
  const handleNoteSave = async (inquiryId: string) => {
    const note = noteInput[inquiryId]?.trim();
    if (!note) return;

    try {
      setError(null);
      
      const currentInquiry = inquiries.find(inq => inq.id === inquiryId);
      if (!currentInquiry) {
        setError('Inquiry not found');
        return;
      }
      
      const result = await updateInquiryStatus(inquiryId, currentInquiry.status, note);
      
      if (result.success) {
        setNoteInput(prev => ({ ...prev, [inquiryId]: '' }));
        setSuccess('Note saved successfully');
      } else {
        setError(result.error || 'Failed to save note');
      }
    } catch (err) {
      console.error('❌ Error saving note:', err);
      setError('Failed to save note');
    }
  };

  // Export to CSV (✅ SAFE NULL HANDLING)
  const handleExport = () => {
    try {
      const headers = [
        'Customer Name',
        'Email',
        'Phone',
        'Address',
        'Tile Name',
        'Tile Code',
        'Worker Email',
        'Date',
        'Status',
        'Notes'
      ];

      const rows = filteredInquiries.map(inq => [
        inq.customer_name || '',
        inq.customer_email || 'No email',  // ✅ SAFE
        inq.customer_phone || '',
        inq.customer_address || 'No address',  // ✅ SAFE
        inq.tile_name || '',
        inq.tile_code || '',
        inq.worker_email || '',
        new Date(inq.timestamp).toLocaleString(),
        inq.status || '',
        inq.notes || ''
      ]);

      const csv = [
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${cell.toString().replace(/"/g, '""')}"`).join(','))
      ].join('\n');

      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `customer-inquiries-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setSuccess('Exported successfully');
    } catch (err) {
      console.error('❌ Error exporting:', err);
      setError('Failed to export data');
    }
  };

  // Handle manual refresh
  const handleRefresh = () => {
    setLastUpdate(new Date());
    setSuccess('Data is syncing in real-time!');
  };

  // Status badge
  const getStatusBadge = (status: string) => {
    const styles = {
      new: 'bg-green-100 text-green-800 border-green-200',
      contacted: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      converted: 'bg-blue-100 text-blue-800 border-blue-200',
      closed: 'bg-gray-100 text-gray-800 border-gray-200'
    };

    const labels = {
      new: 'New',
      contacted: 'Contacted',
      converted: 'Converted',
      closed: 'Closed'
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${styles[status as keyof typeof styles] || styles.new}`}>
        {labels[status as keyof typeof labels] || status}
      </span>
    );
  };

  // Format date
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Loader className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Loading customer inquiries...</p>
          <p className="text-gray-500 text-sm mt-2">Setting up real-time sync</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-2 flex-wrap">
            <Users className="w-7 h-7 sm:w-8 sm:h-8 text-blue-600" />
            Customer Inquiries
            
            {/* Live indicator */}
            {isConnected ? (
              <span className="text-xs font-normal text-green-600 flex items-center gap-1">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                Live
              </span>
            ) : (
              <span className="text-xs font-normal text-red-600 flex items-center gap-1">
                <span className="relative flex h-2 w-2">
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                </span>
                Offline
              </span>
            )}
          </h2>
        </div>

        <div className="flex gap-2 w-full sm:w-auto">
          <button
            onClick={handleRefresh}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
            title="Data syncs automatically in real-time"
          >
            <RefreshCw className={`w-4 h-4 ${isConnected ? 'text-green-600' : 'text-gray-400'}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
          <button
            onClick={handleExport}
            disabled={filteredInquiries.length === 0}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Export CSV</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
          <div className="bg-white border border-gray-200 rounded-lg p-3 sm:p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-1">
              <Users className="w-4 h-4 text-gray-600" />
              <p className="text-xs sm:text-sm text-gray-600">Total</p>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-gray-900">{stats.total || 0}</p>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-3 sm:p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <p className="text-xs sm:text-sm text-green-700">New</p>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-green-900">{stats.new || 0}</p>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 sm:p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-1">
              <Clock className="w-4 h-4 text-yellow-600" />
              <p className="text-xs sm:text-sm text-yellow-700">Contacted</p>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-yellow-900">{stats.contacted || 0}</p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="w-4 h-4 text-blue-600" />
              <p className="text-xs sm:text-sm text-blue-700">Converted</p>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-blue-900">{stats.converted || 0}</p>
          </div>

          <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 sm:p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-1">
              <Calendar className="w-4 h-4 text-purple-600" />
              <p className="text-xs sm:text-sm text-purple-700">This Month</p>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-purple-900">{stats.thisMonth || 0}</p>
          </div>
        </div>
      )}

      {/* Alerts */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-red-800 font-medium text-sm">Error</p>
            <p className="text-red-700 text-xs sm:text-sm break-words">{error}</p>
          </div>
          <button onClick={() => setError(null)} className="text-red-400 hover:text-red-600">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {success && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
          <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-green-800 font-medium text-sm">Success</p>
            <p className="text-green-700 text-xs sm:text-sm break-words">{success}</p>
          </div>
          <button onClick={() => setSuccess(null)} className="text-green-400 hover:text-green-600">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="lg:hidden w-full flex items-center justify-between mb-4 text-gray-700 font-medium"
        >
          <span className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filters
          </span>
          {showFilters ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>

        <div className={`${isMobile && !showFilters ? 'hidden' : 'grid'} grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3`}>
          
          {/* Search */}
          <div className="lg:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, email, phone, tile..."
                value={filters.searchTerm}
                onChange={(e) => setFilters(prev => ({ ...prev, searchTerm: e.target.value }))}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            >
              <option value="all">All Status ({inquiries.length})</option>
              <option value="new">New ({stats?.new || 0})</option>
              <option value="contacted">Contacted ({stats?.contacted || 0})</option>
              <option value="converted">Converted ({stats?.converted || 0})</option>
              <option value="closed">Closed ({stats?.closed || 0})</option>
            </select>
          </div>

          {/* Date Range */}
          <div>
            <select
              value={filters.dateRange}
              onChange={(e) => applyDateRange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="7days">Last 7 Days</option>
              <option value="30days">Last 30 Days</option>
              <option value="3months">Last 3 Months</option>
              <option value="6months">Last 6 Months</option>
              <option value="custom">Custom Range</option>
            </select>
          </div>

          {/* Custom Date Range */}
          {filters.dateRange === 'custom' && (
            <>
              <div className="sm:col-span-2 lg:col-span-1">
                <input
                  type="date"
                  value={filters.startDate}
                  onChange={(e) => setFilters(prev => ({ ...prev, startDate: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                  placeholder="Start Date"
                />
              </div>
              <div className="sm:col-span-2 lg:col-span-1">
                <input
                  type="date"
                  value={filters.endDate}
                  onChange={(e) => setFilters(prev => ({ ...prev, endDate: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                  placeholder="End Date"
                />
              </div>
            </>
          )}
        </div>

        {/* Active Filters Summary */}
        {(filters.searchTerm || filters.status !== 'all' || filters.dateRange !== 'all') && (
          <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
            <span className="text-gray-600">Active filters:</span>
            
            {filters.searchTerm && (
              <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full flex items-center gap-1">
                Search: "{filters.searchTerm}"
                <button
                  onClick={() => setFilters(prev => ({ ...prev, searchTerm: '' }))}
                  className="hover:bg-blue-200 rounded-full p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            
            {filters.status !== 'all' && (
              <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full flex items-center gap-1 capitalize">
                {filters.status}
                <button
                  onClick={() => setFilters(prev => ({ ...prev, status: 'all' }))}
                  className="hover:bg-blue-200 rounded-full p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            
            {filters.dateRange !== 'all' && (
              <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full flex items-center gap-1">
                {filters.dateRange === 'custom' 
                  ? `${filters.startDate} to ${filters.endDate}`
                  : filters.dateRange
                }
                <button
                  onClick={() => setFilters(prev => ({ ...prev, dateRange: 'all', startDate: '', endDate: '' }))}
                  className="hover:bg-blue-200 rounded-full p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            
            <button
              onClick={() => setFilters({
                status: 'all',
                searchTerm: '',
                startDate: '',
                endDate: '',
                dateRange: 'all'
              })}
              className="text-xs text-blue-600 hover:text-blue-800 underline"
            >
              Clear all
            </button>
          </div>
        )}
      </div>

      {/* Results Summary */}
      <div className="flex items-center justify-between text-sm text-gray-600">
        <p>
          Showing {paginatedInquiries.length} of {filteredInquiries.length} inquiries
          {filteredInquiries.length !== inquiries.length && ` (filtered from ${inquiries.length} total)`}
        </p>
        
        <select
          value={itemsPerPage}
          onChange={(e) => {
            setItemsPerPage(Number(e.target.value));
            setCurrentPage(1);
          }}
          className="px-3 py-1 border border-gray-300 rounded-lg text-sm"
        >
          <option value="10">10 per page</option>
          <option value="20">20 per page</option>
          <option value="50">50 per page</option>
          <option value="100">100 per page</option>
        </select>
      </div>

      {/* Data Display */}
      {filteredInquiries.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-lg p-8 sm:p-12 text-center">
          <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
            {inquiries.length === 0 ? 'No Inquiries Yet' : 'No Results Found'}
          </h3>
          <p className="text-gray-600 text-sm sm:text-base mb-4">
            {inquiries.length === 0 
              ? 'Customer inquiries from QR scans will appear here'
              : 'Try adjusting your filters or search term'
            }
          </p>
          {filteredInquiries.length === 0 && inquiries.length > 0 && (
            <button
              onClick={() => setFilters({
                status: 'all',
                searchTerm: '',
                startDate: '',
                endDate: '',
                dateRange: 'all'
              })}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
            >
              Clear Filters
            </button>
          )}
        </div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden lg:block bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left p-4 text-xs font-semibold text-gray-700">Customer</th>
                    <th className="text-left p-4 text-xs font-semibold text-gray-700">Contact</th>
                    <th className="text-left p-4 text-xs font-semibold text-gray-700">Tile</th>
                    <th className="text-left p-4 text-xs font-semibold text-gray-700">Worker</th>
                    <th className="text-left p-4 text-xs font-semibold text-gray-700">Date</th>
                    <th className="text-left p-4 text-xs font-semibold text-gray-700">Status</th>
                    <th className="text-left p-4 text-xs font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedInquiries.map((inquiry, index) => (
                    <React.Fragment key={inquiry.id}>
                      <tr className={`border-t border-gray-200 hover:bg-gray-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            {inquiry.tile_image_url && (
                              <img
                                src={inquiry.tile_image_url}
                                alt={inquiry.tile_name}
                                className="w-10 h-10 object-cover rounded-lg border border-gray-200 flex-shrink-0"
                              />
                            )}
                            <div className="min-w-0">
                              <p className="font-medium text-gray-900 truncate">{inquiry.customer_name}</p>
                              {/* ✅ SAFE ADDRESS */}
                              <p className="text-xs text-gray-500">
                                {safeAddress(inquiry.customer_address, 30)}
                              </p>
                            </div>
                          </div>
                        </td>
                        
                        <td className="p-4">
                          <div className="space-y-1 text-sm">
                            <div className="flex items-center gap-2 text-gray-600">
                              <Mail className="w-4 h-4 flex-shrink-0" />
                              {/* ✅ SAFE EMAIL */}
                              <span className="truncate">{safeEmail(inquiry.customer_email)}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                              <Phone className="w-4 h-4 flex-shrink-0" />
                              <span>{inquiry.customer_phone}</span>
                            </div>
                          </div>
                        </td>
                        
                        <td className="p-4">
                          <div>
                            <p className="font-medium text-gray-900 text-sm truncate">{inquiry.tile_name}</p>
                            {inquiry.tile_code && (
                              <p className="text-xs text-gray-500 font-mono">{inquiry.tile_code}</p>
                            )}
                            {inquiry.tile_size && (
                              <p className="text-xs text-gray-500">{inquiry.tile_size}</p>
                            )}
                          </div>
                        </td>
                        
                        <td className="p-4">
                          <p className="text-sm text-gray-600 truncate">{inquiry.worker_email}</p>
                          <p className="text-xs text-gray-400">{inquiry.device_type || 'mobile'}</p>
                        </td>
                        
                        <td className="p-4">
                          <p className="text-sm text-gray-900">{formatDate(inquiry.timestamp)}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(inquiry.timestamp).toLocaleTimeString('en-US', { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </p>
                        </td>
                        
                        <td className="p-4">
                          <select
                            value={inquiry.status}
                            onChange={(e) => handleStatusChange(inquiry.id, e.target.value)}
                            className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="new">New</option>
                            <option value="contacted">Contacted</option>
                            <option value="converted">Converted</option>
                            <option value="closed">Closed</option>
                          </select>
                        </td>
                        
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setExpandedInquiry(expandedInquiry === inquiry.id ? null : inquiry.id)}
                              className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                              title="View details"
                            >
                              {expandedInquiry === inquiry.id ? (
                                <ChevronUp className="w-4 h-4 text-gray-600" />
                              ) : (
                                <ChevronDown className="w-4 h-4 text-gray-600" />
                              )}
                            </button>
                            
                            <button
                              onClick={() => handleDelete(inquiry.id, inquiry.customer_name)}
                              className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4 text-red-600" />
                            </button>
                          </div>
                        </td>
                      </tr>
                      
                      {/* Expanded Details */}
                      {expandedInquiry === inquiry.id && (
                        <tr>
                          <td colSpan={7} className="p-4 bg-gray-50 border-t border-gray-200">
                            <div className="space-y-4">
                              <div>
                                <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                                  <MapPin className="w-4 h-4" />
                                  Complete Address
                                </h4>
                                <p className="text-gray-700 text-sm bg-white p-3 rounded-lg border border-gray-200">
                                  {/* ✅ SAFE ADDRESS */}
                                  {safeValue(inquiry.customer_address, 'No address provided')}
                                </p>
                              </div>
                              
                              <div>
                                <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                                  <MessageSquare className="w-4 h-4" />
                                  Notes
                                </h4>
                                {inquiry.notes && (
                                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-2">
                                    <p className="text-sm text-gray-700">{inquiry.notes}</p>
                                  </div>
                                )}
                                <div className="flex gap-2">
                                  <input
                                    type="text"
                                    value={noteInput[inquiry.id] || ''}
                                    onChange={(e) => setNoteInput(prev => ({ ...prev, [inquiry.id]: e.target.value }))}
                                    placeholder="Add a note..."
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                                    onKeyPress={(e) => {
                                      if (e.key === 'Enter' && noteInput[inquiry.id]?.trim()) {
                                        handleNoteSave(inquiry.id);
                                      }
                                    }}
                                  />
                                  <button
                                    onClick={() => handleNoteSave(inquiry.id)}
                                    disabled={!noteInput[inquiry.id]?.trim()}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                                  >
                                    Save Note
                                  </button>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Cards */}
          <div className="lg:hidden space-y-4">
            {paginatedInquiries.map((inquiry) => (
              <div key={inquiry.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                
                {/* Header */}
                <div className="flex items-start gap-3 mb-3">
                  {inquiry.tile_image_url && (
                    <img
                      src={inquiry.tile_image_url}
                      alt={inquiry.tile_name}
                      className="w-16 h-16 object-cover rounded-lg border border-gray-200 flex-shrink-0"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate">{inquiry.customer_name}</h3>
                    <p className="text-sm text-gray-600 truncate">{inquiry.tile_name}</p>
                    <div className="mt-1">
                      {getStatusBadge(inquiry.status)}
                    </div>
                  </div>
                </div>
                
                {/* Contact Info */}
                <div className="space-y-2 mb-3 text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Mail className="w-4 h-4 flex-shrink-0" />
                    {/* ✅ SAFE EMAIL */}
                    {inquiry.customer_email ? (
                      <a href={`mailto:${inquiry.customer_email}`} className="truncate hover:text-blue-600">
                        {inquiry.customer_email}
                      </a>
                    ) : (
                      <span className="text-gray-400 italic text-xs">No email</span>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2 text-gray-600">
                    <Phone className="w-4 h-4 flex-shrink-0" />
                    <a href={`tel:${inquiry.customer_phone}`} className="hover:text-blue-600">
                      {inquiry.customer_phone}
                    </a>
                  </div>
                  
                  <div className="flex items-start gap-2 text-gray-600">
                    <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    {/* ✅ SAFE ADDRESS */}
                    <p className="text-xs">{safeValue(inquiry.customer_address, 'No address provided')}</p>
                  </div>
                </div>
                
                {/* Meta Info */}
                <div className="flex items-center justify-between text-xs text-gray-500 mb-3 pb-3 border-b border-gray-200">
                  <span>{formatDate(inquiry.timestamp)}</span>
                  <span className="truncate ml-2">{inquiry.worker_email}</span>
                </div>
                
                {/* Actions */}
                <div className="flex gap-2">
                  <select
                    value={inquiry.status}
                    onChange={(e) => handleStatusChange(inquiry.id, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    <option value="converted">Converted</option>
                    <option value="closed">Closed</option>
                  </select>
                  
                  <button
                    onClick={() => setExpandedInquiry(expandedInquiry === inquiry.id ? null : inquiry.id)}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm"
                  >
                    {expandedInquiry === inquiry.id ? 'Hide' : 'View'}
                  </button>
                  
                  <button
                    onClick={() => handleDelete(inquiry.id, inquiry.customer_name)}
                    className="p-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                
                {/* Expanded Notes */}
                {expandedInquiry === inquiry.id && (
                  <div className="mt-4 pt-4 border-t border-gray-200 space-y-3">
                    {inquiry.notes && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <p className="text-sm text-gray-700">{inquiry.notes}</p>
                      </div>
                    )}
                    <div className="flex flex-col gap-2">
                      <input
                        type="text"
                        value={noteInput[inquiry.id] || ''}
                        onChange={(e) => setNoteInput(prev => ({ ...prev, [inquiry.id]: e.target.value }))}
                        placeholder="Add a note..."
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' && noteInput[inquiry.id]?.trim()) {
                            handleNoteSave(inquiry.id);
                          }
                        }}
                      />
                      <button
                        onClick={() => handleNoteSave(inquiry.id)}
                        disabled={!noteInput[inquiry.id]?.trim()}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                      >
                        Save Note
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white border border-gray-200 rounded-lg p-4">
          <p className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </p>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            
            {/* Page Numbers */}
            <div className="hidden sm:flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`
                      px-3 py-1 rounded-lg text-sm font-medium
                      ${currentPage === pageNum
                        ? 'bg-blue-600 text-white'
                        : 'border border-gray-300 hover:bg-gray-50'
                      }
                    `}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>
            
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};