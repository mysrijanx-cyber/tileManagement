
// import React, { useState, useEffect } from 'react';
// import { Bell,Clock, User, Mail, Phone, MapPin, Store } from 'lucide-react';
// import { collection, query, where, onSnapshot, doc, updateDoc } from 'firebase/firestore';
// import { db } from '../lib/firebase';
// import { generateSecurePassword } from '../lib/emailService';

// interface SellerRequest {
//   id: string;
//   requestId?: string;
//   businessName: string;
//   ownerName: string;
//   email: string;
//   phone: string;
//   businessAddress: string;
//   additionalInfo?: string;
//   status: 'pending' | 'approved' | 'rejected';
//   requestedAt: string;
//   tempPassword?: string;
// }

// interface AdminNotificationsProps {
//   onApproveRequest?: (requestData: SellerRequest) => void;
//   onRejectRequest?: (requestData: SellerRequest, reason?: string) => void;
// }

// export const AdminNotifications: React.FC<AdminNotificationsProps> = ({ 
//   onApproveRequest,
//   onRejectRequest
// }) => {
//   const [requests, setRequests] = useState<SellerRequest[]>([]);
//   const [unreadCount, setUnreadCount] = useState(0);
//   const [showDropdown, setShowDropdown] = useState(false);
//   const [processing, setProcessing] = useState<string | null>(null);

//   useEffect(() => {
//     console.log('🔔 Setting up real-time seller requests listener...');

//     const q = query(
//       collection(db, 'sellerRequests'),
//       where('status', '==', 'pending')
//     );

//     const unsubscribe = onSnapshot(
//       q,
//       (snapshot) => {
//         const newRequests = snapshot.docs.map(doc => ({
//           id: doc.id,
//           requestId: doc.id,
//           ...doc.data()
//         })) as SellerRequest[];
        
//         newRequests.sort((a, b) => 
//           new Date(b.requestedAt).getTime() - new Date(a.requestedAt).getTime()
//         );
        
//         setRequests(newRequests);
//         setUnreadCount(newRequests.length);
        
//         console.log('🔔 Admin notifications updated:', newRequests.length, 'pending requests');
//       },
//       (error) => {
//         console.error('❌ Error listening to seller requests:', error);
//       }
//     );

//     return () => unsubscribe();
//   }, []);

//   const handleApprove = async (request: SellerRequest) => {
//     setProcessing(request.id);
    
//     try {
//       console.log('✅ Starting approval process for:', request.businessName);

//       const tempPassword = generateSecurePassword();
//       console.log('🔐 Password generated for later use');

//       await updateDoc(doc(db, 'sellerRequests', request.id), {
//         status: 'approved',
//         reviewedAt: new Date().toISOString(),
//         adminNotes: 'Approved - Ready for account creation',
//         tempPassword: tempPassword,
//         emailDeliveryStatus: 'pending',
//         accountCreated: false
//       });

//       console.log('✅ Request status updated to approved');

//       if (onApproveRequest) {
//         const requestWithTempData = {
//           ...request,
//           tempPassword: tempPassword
//         };
//         onApproveRequest(requestWithTempData);
//       }

//       console.log('✅ Seller request approved - ready for account creation');
      
//       alert(
//         `✅ Seller Request Approved!\n\n` +
//         `📋 Business: ${request.businessName}\n` +
//         `👤 Owner: ${request.ownerName}\n` +
//         `📧 Email: ${request.email}\n\n` +
//         `➡️ Switching to Create Seller tab...\n` +
//         `Please review the auto-filled details and click "Create Seller Account"`
//       );
      
//     } catch (error: any) {
//       console.error('❌ Error approving seller:', error);
//       alert(`❌ Failed to approve seller: ${error.message}\nPlease try again.`);
//     } finally {
//       setProcessing(null);
//     }
//   };

//   const handleReject = async (request: SellerRequest, reason?: string) => {
//     setProcessing(request.id);
    
//     try {
//       console.log('🚫 Rejecting seller request for:', request.businessName);
      
//       await updateDoc(doc(db, 'sellerRequests', request.id), {
//         status: 'rejected',
//         rejectedAt: new Date().toISOString(),
//         rejectionReason: reason || 'Application did not meet requirements',
//         rejectionDate: new Date().toISOString()
//       });
      
//       console.log('✅ Request status updated to rejected in Firebase');
      
//       if (onRejectRequest) {
//         console.log('📧 Calling parent rejection handler for email...');
//         onRejectRequest(request, reason);
//       } else {
//         console.warn('⚠️ No rejection handler provided from parent component');
//       }
      
//       console.log('❌ Seller request rejected:', request.businessName);
      
//     } catch (error: any) {
//       console.error('❌ Error rejecting seller:', error);
//       alert(`❌ Failed to reject request: ${error.message}\nPlease try again.`);
//     } finally {
//       setProcessing(null);
//     }
//   };

//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       const target = event.target as Element;
//       if (!target.closest('.notification-dropdown')) {
//         setShowDropdown(false);
//       }
//     };

//     document.addEventListener('mousedown', handleClickOutside);
//     return () => document.removeEventListener('mousedown', handleClickOutside);
//   }, []);

//   return (
//     <>
//       {/* Overlay - Click karne par close ho */}
//       {showDropdown && (
//         <div 
//           className="fixed inset-0 bg-black bg-opacity-30 z-40 transition-opacity duration-500"
//           onClick={() => setShowDropdown(false)}
//         />
//       )}

//       <div className="relative notification-dropdown">
//         {/* Bell Icon Button */}
//         <button
//           onClick={() => setShowDropdown(!showDropdown)}
//           className="relative p-1.5 sm:p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors duration-300"
//           title={`${unreadCount} Pending Seller Requests`}
//         >
//           <Bell className="w-5 h-5 sm:w-6 sm:h-6" />
//           {unreadCount > 0 && (
//             <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center font-medium animate-pulse">
//               {unreadCount > 99 ? '99+' : unreadCount}
//             </span>
//           )}
//         </button>

//         {/* Dropdown Panel - Fully Responsive */}
//         {showDropdown && (
//           <div 
//             className="
//               fixed sm:absolute 
//               top-14 sm:top-auto 
//               left-2 right-2 sm:left-auto sm:right-0 
//               sm:mt-2 
//               w-auto sm:w-[380px] md:w-[420px] lg:w-[450px]
//               bg-white rounded-lg sm:rounded-xl 
//               shadow-xl border border-gray-200 
//               z-50 
//               overflow-hidden
//               transform 
//               transition-all duration-500 ease-in-out
//               animate-slideDown
//             "
//             style={{
//               maxHeight: 'calc(100vh - 120px)',
//             }}
//           >
            
//             {/* Header */}
//             <div className="p-3 sm:p-4 border-b border-gray-100 bg-gradient-to-r from-purple-50 to-blue-50 flex-shrink-0">
//               <div className="flex items-center justify-between">
//                 <h3 className="font-semibold text-sm sm:text-base text-gray-800 flex items-center gap-2">
//                   <Bell className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
//                   <span className="truncate">Seller Requests</span>
//                 </h3>
//                 <span className="text-xs sm:text-sm text-gray-500 bg-white px-2 py-1 rounded-full flex-shrink-0 ml-2">
//                   {unreadCount} pending
//                 </span>
//               </div>
//             </div>
            
//             {/* Requests List - Scrollable Area */}
//             <div 
//               className="overflow-y-auto overflow-x-hidden"
//               style={{
//                 maxHeight: 'calc(100vh - 220px)',
//               }}
//             >
//               {requests.length > 0 ? (
//                 requests.map((request, index) => (
//                   <div 
//                     key={request.id} 
//                     className={`p-3 sm:p-4 border-b border-gray-100 hover:bg-gray-50 transition-all duration-300 ${
//                       index === 0 ? 'bg-blue-50' : ''
//                     }`}
//                   >
//                     {/* Request Info */}
//                     <div className="mb-2 sm:mb-3">
//                       <div className="flex items-center gap-2 mb-2 flex-wrap">
//                         <Store className="w-3 h-3 sm:w-4 sm:h-4 text-purple-600 flex-shrink-0" />
//                         <h4 className="font-semibold text-sm sm:text-base text-gray-800 flex-1 min-w-0 break-words">
//                           {request.businessName}
//                         </h4>
//                         {index === 0 && (
//                           <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 sm:py-1 rounded-full flex-shrink-0">
//                             Latest
//                           </span>
//                         )}
//                       </div>
                      
//                       <div className="space-y-1 mb-2">
//                         <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
//                           <User className="w-3 h-3 flex-shrink-0" />
//                           <span className="truncate">{request.ownerName}</span>
//                         </div>
//                         <div className="flex items-center gap-2 text-xs sm:text-sm text-blue-600">
//                           <Mail className="w-3 h-3 flex-shrink-0" />
//                           <span className="truncate break-all">{request.email}</span>
//                         </div>
//                         <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
//                           <Phone className="w-3 h-3 flex-shrink-0" />
//                           <span className="truncate">{request.phone}</span>
//                         </div>
//                         <div className="flex items-start gap-2 text-xs sm:text-sm text-gray-600">
//                           <MapPin className="w-3 h-3 mt-0.5 flex-shrink-0" />
//                           <span className="line-clamp-2 break-words">{request.businessAddress}</span>
//                         </div>
//                       </div>
                      
//                       <p className="text-xs text-gray-400 mb-2">
//                         📅 {new Date(request.requestedAt).toLocaleDateString('en-US', { 
//                           month: 'short', 
//                           day: 'numeric',
//                           year: 'numeric'
//                         })} {' '}
//                         <span className="hidden sm:inline">
//                           {new Date(request.requestedAt).toLocaleTimeString('en-US', {
//                             hour: '2-digit',
//                             minute: '2-digit'
//                           })}
//                         </span>
//                       </p>
                      
//                       {request.additionalInfo && (
//                         <div className="bg-gray-50 rounded p-2">
//                           <p className="text-xs text-gray-600 line-clamp-2 break-words">
//                             💬 {request.additionalInfo}
//                           </p>
//                         </div>
//                       )}
//                     </div>
                    
//                     {/* ACTION BUTTONS */}
//                     <div className="flex flex-col sm:flex-row gap-2">
//                       {/* Approve Button */}
//                       <button
//                         onClick={() => handleApprove(request)}
//                         disabled={processing === request.id}
//                         className="flex-1 px-3 py-2 bg-green-600 text-white text-xs sm:text-sm font-medium rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 active:scale-95"
//                       >
//                         {processing === request.id ? (
//                           <div className="flex items-center justify-center gap-1">
//                             <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
//                             <span>Processing...</span>
//                           </div>
//                         ) : (
//                           '✅ Approve'
//                         )}
//                       </button>
                      
//                       {/* Reject Button */}
//                       <button
//                         onClick={() => {
//                           const reason = prompt(
//                             `💬 Enter rejection reason for "${request.businessName}":\n\n` +
//                             `(Leave empty for default message)`,
//                             ''
//                           );
                          
//                           if (reason === null) {
//                             console.log('User cancelled rejection');
//                             return;
//                           }
                          
//                           const confirmed = confirm(
//                             `❌ Are you sure you want to REJECT this seller?\n\n` +
//                             `🏪 Business: ${request.businessName}\n` +
//                             `📧 Email: ${request.email}\n` +
//                             `👤 Owner: ${request.ownerName}\n` +
//                             `📝 Reason: ${reason || 'Default rejection message'}\n\n` +
//                             `The applicant will receive a rejection email.`
//                           );
                          
//                           if (confirmed) {
//                             console.log('Rejection confirmed, proceeding...');
//                             handleReject(request, reason);
//                           } else {
//                             console.log('Rejection cancelled by user');
//                           }
//                         }}
//                         disabled={processing === request.id}
//                         className="flex-1 px-3 py-2 bg-red-600 text-white text-xs sm:text-sm font-medium rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 active:scale-95"
//                       >
//                         {processing === request.id ? (
//                           <div className="flex items-center justify-center gap-1">
//                             <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
//                             <span>Processing...</span>
//                           </div>
//                         ) : (
//                           '❌ Reject'
//                         )}
//                       </button>
//                     </div>
//                   </div>
//                 ))
//               ) : (
//                 <div className="p-6 sm:p-8 text-center text-gray-500">
//                   <Clock className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 text-gray-400" />
//                   <p className="font-medium text-sm sm:text-base">No pending requests</p>
//                   <p className="text-xs sm:text-sm mt-1">New seller requests will appear here</p>
//                 </div>
//               )}
//             </div>

//             {/* Footer Tip */}
//             {requests.length > 0 && (
//               <div className="p-2 sm:p-3 border-t border-gray-100 bg-gray-50 flex-shrink-0">
//                 <p className="text-xs text-gray-500 text-center">
//                   💡 Tip: Approved sellers need account creation in the next step
//                 </p>
//               </div>
//             )}
//           </div>
//         )}
//       </div>

//       {/* CSS Animation */}
//       <style>{`
//         @keyframes slideDown {
//           from {
//             opacity: 0;
//             transform: translateY(-10px) scale(0.95);
//           }
//           to {
//             opacity: 1;
//             transform: translateY(0) scale(1);
//           }
//         }

//         .animate-slideDown {
//           animation: slideDown 0.5s ease-out;
//         }

//         /* Custom Scrollbar */
//         .overflow-y-auto::-webkit-scrollbar {
//           width: 6px;
//         }

//         .overflow-y-auto::-webkit-scrollbar-track {
//           background: #f3f4f6;
//         }

//         .overflow-y-auto::-webkit-scrollbar-thumb {
//           background: #9ca3af;
//           border-radius: 3px;
//         }

//         .overflow-y-auto::-webkit-scrollbar-thumb:hover {
//           background: #6b7280;
//         }
//       `}</style>
//     </>
//   );
// }; 
// ✅ AdminNotifications Component - Production v2.0 (With Toast & Modals)
import React, { useState, useEffect, useCallback } from 'react';
import { Bell, Clock, User, Mail, Phone, MapPin, Store, X, Check, AlertTriangle, Info } from 'lucide-react';
import { collection, query, where, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { generateSecurePassword } from '../lib/emailService';

// ═══════════════════════════════════════════════════════════════
// ✅ INTERFACES
// ═══════════════════════════════════════════════════════════════

interface SellerRequest {
  id: string;
  requestId?: string;
  businessName: string;
  ownerName: string;
  email: string;
  phone: string;
  businessAddress: string;
  additionalInfo?: string;
  status: 'pending' | 'approved' | 'rejected';
  requestedAt: string;
  tempPassword?: string;
}

interface AdminNotificationsProps {
  onApproveRequest?: (requestData: SellerRequest) => void;
  onRejectRequest?: (requestData: SellerRequest, reason?: string) => void;
}

interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
}

// ═══════════════════════════════════════════════════════════════
// ✅ TOAST NOTIFICATION COMPONENT
// ═══════════════════════════════════════════════════════════════

const ToastNotification: React.FC<{ 
  toast: Toast; 
  onClose: (id: string) => void;
}> = ({ toast, onClose }) => {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(() => onClose(toast.id), 300);
    }, 5000);

    return () => clearTimeout(timer);
  }, [toast.id, onClose]);

  const icons = {
    success: <Check className="w-5 h-5 text-green-600" />,
    error: <X className="w-5 h-5 text-red-600" />,
    warning: <AlertTriangle className="w-5 h-5 text-yellow-600" />,
    info: <Info className="w-5 h-5 text-blue-600" />
  };

  const colors = {
    success: 'bg-green-50 border-green-200',
    error: 'bg-red-50 border-red-200',
    warning: 'bg-yellow-50 border-yellow-200',
    info: 'bg-blue-50 border-blue-200'
  };

  return (
    <div
      className={`
        ${colors[toast.type]}
        border-2 rounded-xl p-4 shadow-lg
        transform transition-all duration-300 ease-out
        ${isExiting ? 'opacity-0 translate-x-full scale-95' : 'opacity-100 translate-x-0 scale-100'}
        hover:shadow-xl
      `}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5">
          {icons[toast.type]}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-bold text-gray-900 text-sm sm:text-base mb-1">
            {toast.title}
          </h4>
          <p className="text-gray-700 text-xs sm:text-sm break-words">
            {toast.message}
          </p>
        </div>
        <button
          onClick={() => {
            setIsExiting(true);
            setTimeout(() => onClose(toast.id), 300);
          }}
          className="flex-shrink-0 p-1 hover:bg-gray-200 rounded-lg transition-colors"
        >
          <X className="w-4 h-4 text-gray-600" />
        </button>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// ✅ REJECT MODAL COMPONENT
// ═══════════════════════════════════════════════════════════════

const RejectModal: React.FC<{
  request: SellerRequest;
  onConfirm: (reason: string) => void;
  onCancel: () => void;
}> = ({ request, onConfirm, onCancel }) => {
  const [reason, setReason] = useState('');
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(onCancel, 300);
  };

  const handleConfirm = () => {
    onConfirm(reason.trim() || 'Application did not meet requirements');
    handleClose();
  };

  return (
    <div 
      className={`
        fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4
        transition-opacity duration-300
        ${isClosing ? 'opacity-0' : 'opacity-100'}
      `}
      onClick={handleClose}
    >
      <div
        className={`
          bg-white rounded-2xl shadow-2xl w-full max-w-md
          transform transition-all duration-300
          ${isClosing ? 'scale-95 opacity-0' : 'scale-100 opacity-100'}
        `}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-6 rounded-t-2xl">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-xl sm:text-2xl font-bold mb-2">Reject Seller Request</h3>
              <p className="text-red-100 text-sm sm:text-base">This action cannot be undone</p>
            </div>
            <button
              onClick={handleClose}
              className="p-1 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Seller Details */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-2">
            <div className="flex items-center gap-2">
              <Store className="w-4 h-4 text-gray-600 flex-shrink-0" />
              <span className="font-semibold text-gray-900 text-sm sm:text-base break-words">{request.businessName}</span>
            </div>
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-gray-600 flex-shrink-0" />
              <span className="text-gray-700 text-sm break-words">{request.ownerName}</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-gray-600 flex-shrink-0" />
              <span className="text-gray-700 text-sm break-all">{request.email}</span>
            </div>
          </div>

          {/* Reason Input */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Rejection Reason (Optional)
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Enter the reason for rejection..."
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm sm:text-base resize-none transition-all"
              rows={4}
              maxLength={500}
            />
            <p className="text-xs text-gray-500 mt-1">
              {reason.length}/500 characters
            </p>
          </div>

          {/* Warning */}
          <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-yellow-800">
                The applicant will receive a rejection email with your reason (or default message if empty).
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 rounded-b-2xl flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleClose}
            className="flex-1 px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium text-sm sm:text-base"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-bold text-sm sm:text-base shadow-lg hover:shadow-xl"
          >
            Confirm Rejection
          </button>
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// ✅ APPROVE CONFIRMATION MODAL
// ═══════════════════════════════════════════════════════════════

const ApproveModal: React.FC<{
  request: SellerRequest;
  onConfirm: () => void;
  onCancel: () => void;
}> = ({ request, onConfirm, onCancel }) => {
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(onCancel, 300);
  };

  const handleConfirm = () => {
    onConfirm();
    handleClose();
  };

  return (
    <div 
      className={`
        fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4
        transition-opacity duration-300
        ${isClosing ? 'opacity-0' : 'opacity-100'}
      `}
      onClick={handleClose}
    >
      <div
        className={`
          bg-white rounded-2xl shadow-2xl w-full max-w-md
          transform transition-all duration-300
          ${isClosing ? 'scale-95 opacity-0' : 'scale-100 opacity-100'}
        `}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-t-2xl">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-xl sm:text-2xl font-bold mb-2">Approve Seller Request</h3>
              <p className="text-green-100 text-sm sm:text-base">Confirm seller approval</p>
            </div>
            <button
              onClick={handleClose}
              className="p-1 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Seller Details */}
          <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4 space-y-3">
            <div className="flex items-center gap-2">
              <Store className="w-5 h-5 text-green-600 flex-shrink-0" />
              <span className="font-semibold text-gray-900 text-sm sm:text-base break-words">{request.businessName}</span>
            </div>
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-gray-600 flex-shrink-0" />
              <span className="text-gray-700 text-sm break-words">{request.ownerName}</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-gray-600 flex-shrink-0" />
              <span className="text-gray-700 text-sm break-all">{request.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-gray-600 flex-shrink-0" />
              <span className="text-gray-700 text-sm">{request.phone}</span>
            </div>
          </div>

          {/* Info */}
          <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-blue-800">
                After approval, you'll need to create the seller account in the next step. Auto-filled details will be ready for review.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 rounded-b-2xl flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleClose}
            className="flex-1 px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium text-sm sm:text-base"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-bold text-sm sm:text-base shadow-lg hover:shadow-xl"
          >
            Approve Request
          </button>
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
// ✅ MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════

export const AdminNotifications: React.FC<AdminNotificationsProps> = ({ 
  onApproveRequest,
  onRejectRequest
}) => {
  const [requests, setRequests] = useState<SellerRequest[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const [processing, setProcessing] = useState<string | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<SellerRequest | null>(null);

  // Toast Functions
  const addToast = useCallback((type: Toast['type'], title: string, message: string) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts(prev => [...prev, { id, type, title, message }]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // Real-time listener
  useEffect(() => {
    console.log('🔔 Setting up real-time seller requests listener...');

    const q = query(
      collection(db, 'sellerRequests'),
      where('status', '==', 'pending')
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const newRequests = snapshot.docs.map(doc => ({
          id: doc.id,
          requestId: doc.id,
          ...doc.data()
        })) as SellerRequest[];
        
        newRequests.sort((a, b) => 
          new Date(b.requestedAt).getTime() - new Date(a.requestedAt).getTime()
        );
        
        setRequests(newRequests);
        setUnreadCount(newRequests.length);
        
        console.log('🔔 Admin notifications updated:', newRequests.length, 'pending requests');
      },
      (error) => {
        console.error('❌ Error listening to seller requests:', error);
        addToast('error', 'Connection Error', 'Failed to load seller requests. Please refresh.');
      }
    );

    return () => unsubscribe();
  }, [addToast]);

  // Handle Approve
  const handleApprove = async (request: SellerRequest) => {
    setProcessing(request.id);
    
    try {
      console.log('✅ Starting approval process for:', request.businessName);

      const tempPassword = generateSecurePassword();
      console.log('🔐 Password generated for later use');

      await updateDoc(doc(db, 'sellerRequests', request.id), {
        status: 'approved',
        reviewedAt: new Date().toISOString(),
        adminNotes: 'Approved - Ready for account creation',
        tempPassword: tempPassword,
        emailDeliveryStatus: 'pending',
        accountCreated: false
      });

      console.log('✅ Request status updated to approved');

      if (onApproveRequest) {
        const requestWithTempData = {
          ...request,
          tempPassword: tempPassword
        };
        onApproveRequest(requestWithTempData);
      }

      addToast(
        'success',
        'Request Approved!',
        `${request.businessName} has been approved. Please create the seller account in the next step.`
      );

      setShowDropdown(false);
      
    } catch (error: any) {
      console.error('❌ Error approving seller:', error);
      addToast('error', 'Approval Failed', error.message || 'Failed to approve seller. Please try again.');
    } finally {
      setProcessing(null);
    }
  };

  // Handle Reject
  const handleReject = async (request: SellerRequest, reason: string) => {
    setProcessing(request.id);
    
    try {
      console.log('🚫 Rejecting seller request for:', request.businessName);
      
      await updateDoc(doc(db, 'sellerRequests', request.id), {
        status: 'rejected',
        rejectedAt: new Date().toISOString(),
        rejectionReason: reason,
        rejectionDate: new Date().toISOString()
      });
      
      console.log('✅ Request status updated to rejected in Firebase');
      
      if (onRejectRequest) {
        console.log('📧 Calling parent rejection handler for email...');
        onRejectRequest(request, reason);
      }

      addToast(
        'warning',
        'Request Rejected',
        `${request.businessName} has been rejected. Rejection email will be sent.`
      );

      setShowDropdown(false);
      
    } catch (error: any) {
      console.error('❌ Error rejecting seller:', error);
      addToast('error', 'Rejection Failed', error.message || 'Failed to reject request. Please try again.');
    } finally {
      setProcessing(null);
    }
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.notification-dropdown')) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showDropdown]);

  return (
    <>
      {/* Toast Container */}
      <div className="fixed top-4 right-4 z-[200] space-y-3 max-w-sm w-full pointer-events-none">
        <div className="pointer-events-auto space-y-3">
          {toasts.map(toast => (
            <ToastNotification key={toast.id} toast={toast} onClose={removeToast} />
          ))}
        </div>
      </div>

      {/* Modals */}
      {showRejectModal && selectedRequest && (
        <RejectModal
          request={selectedRequest}
          onConfirm={(reason) => handleReject(selectedRequest, reason)}
          onCancel={() => {
            setShowRejectModal(false);
            setSelectedRequest(null);
          }}
        />
      )}

      {showApproveModal && selectedRequest && (
        <ApproveModal
          request={selectedRequest}
          onConfirm={() => handleApprove(selectedRequest)}
          onCancel={() => {
            setShowApproveModal(false);
            setSelectedRequest(null);
          }}
        />
      )}

      {/* Overlay */}
      {showDropdown && (
        <div 
          className="fixed inset-0 bg-black/30 z-40 transition-opacity duration-300 animate-fadeIn"
          onClick={() => setShowDropdown(false)}
        />
      )}

      <div className="relative notification-dropdown">
        {/* Bell Icon Button */}
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="relative p-2 sm:p-2.5 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-all duration-300 active:scale-95"
          title={`${unreadCount} Pending Seller Requests`}
        >
          <Bell className={`w-5 h-5 sm:w-6 sm:h-6 ${unreadCount > 0 ? 'animate-wiggle' : ''}`} />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center font-bold animate-pulse shadow-lg">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </button>

        {/* Dropdown Panel */}
        {showDropdown && (
          <div 
            className="
              fixed sm:absolute 
              top-16 sm:top-auto 
              left-2 right-2 sm:left-auto sm:right-0 
              sm:mt-2 
              w-auto sm:w-[400px] md:w-[450px] lg:w-[500px]
              bg-white rounded-xl sm:rounded-2xl 
              shadow-2xl border-2 border-gray-200 
              z-50 
              overflow-hidden
              animate-slideDown
            "
            style={{
              maxHeight: 'calc(100vh - 120px)',
            }}
          >
            
            {/* Header */}
            <div className="p-4 sm:p-5 border-b-2 border-gray-100 bg-gradient-to-r from-purple-50 via-blue-50 to-indigo-50 flex-shrink-0">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-base sm:text-lg text-gray-800 flex items-center gap-2">
                  <Bell className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0 text-purple-600" />
                  <span className="truncate">Seller Requests</span>
                </h3>
                <div className="flex items-center gap-2">
                  <span className="text-xs sm:text-sm text-gray-600 bg-white px-3 py-1.5 rounded-full font-semibold shadow-sm flex-shrink-0">
                    {unreadCount} pending
                  </span>
                  <button
                    onClick={() => setShowDropdown(false)}
                    className="p-1.5 hover:bg-white/80 rounded-lg transition-colors sm:hidden"
                  >
                    <X className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              </div>
            </div>
            
            {/* Requests List */}
            <div 
              className="overflow-y-auto overflow-x-hidden custom-scrollbar"
              style={{
                maxHeight: 'calc(100vh - 240px)',
              }}
            >
              {requests.length > 0 ? (
                requests.map((request, index) => (
                  <div 
                    key={request.id} 
                    className={`
                      p-4 sm:p-5 border-b-2 border-gray-100 
                      hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50
                      transition-all duration-300
                      ${index === 0 ? 'bg-gradient-to-r from-green-50 to-blue-50' : ''}
                      ${processing === request.id ? 'opacity-60 pointer-events-none' : ''}
                    `}
                  >
                    {/* Request Info */}
                    <div className="mb-4">
                      <div className="flex items-center gap-2 mb-3 flex-wrap">
                        <Store className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600 flex-shrink-0" />
                        <h4 className="font-bold text-base sm:text-lg text-gray-800 flex-1 min-w-0 break-words">
                          {request.businessName}
                        </h4>
                        {index === 0 && (
                          <span className="bg-gradient-to-r from-green-500 to-green-600 text-white text-xs px-2.5 py-1 rounded-full flex-shrink-0 font-bold shadow-md">
                            Latest
                          </span>
                        )}
                      </div>
                      
                      <div className="space-y-2 mb-3">
                        <div className="flex items-center gap-2 text-sm sm:text-base text-gray-700">
                          <User className="w-4 h-4 flex-shrink-0 text-gray-500" />
                          <span className="truncate font-medium">{request.ownerName}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm sm:text-base text-blue-600">
                          <Mail className="w-4 h-4 flex-shrink-0" />
                          <span className="truncate break-all">{request.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm sm:text-base text-gray-700">
                          <Phone className="w-4 h-4 flex-shrink-0 text-gray-500" />
                          <span className="truncate font-medium">{request.phone}</span>
                        </div>
                        <div className="flex items-start gap-2 text-sm sm:text-base text-gray-700">
                          <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-gray-500" />
                          <span className="line-clamp-2 break-words">{request.businessAddress}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500 mb-3">
                        <Clock className="w-3.5 h-3.5 flex-shrink-0" />
                        <span>
                          {new Date(request.requestedAt).toLocaleDateString('en-IN', { 
                            day: 'numeric',
                            month: 'short', 
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                      
                      {request.additionalInfo && (
                        <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-3">
                          <p className="text-xs sm:text-sm text-gray-700 line-clamp-3 break-words">
                            💬 {request.additionalInfo}
                          </p>
                        </div>
                      )}
                    </div>
                    
                    {/* ACTION BUTTONS */}
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                      <button
                        onClick={() => {
                          setSelectedRequest(request);
                          setShowApproveModal(true);
                        }}
                        disabled={processing === request.id}
                        className="
                          flex-1 px-4 py-3 
                          bg-gradient-to-r from-green-600 to-green-700 
                          text-white text-sm sm:text-base font-bold rounded-lg 
                          hover:from-green-700 hover:to-green-800 
                          disabled:opacity-50 disabled:cursor-not-allowed 
                          transition-all duration-300 
                          active:scale-95
                          shadow-md hover:shadow-lg
                          flex items-center justify-center gap-2
                        "
                      >
                        {processing === request.id ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                            <span>Processing...</span>
                          </>
                        ) : (
                          <>
                            <Check className="w-5 h-5" />
                            Approve
                          </>
                        )}
                      </button>
                      
                      <button
                        onClick={() => {
                          setSelectedRequest(request);
                          setShowRejectModal(true);
                        }}
                        disabled={processing === request.id}
                        className="
                          flex-1 px-4 py-3 
                          bg-gradient-to-r from-red-600 to-red-700 
                          text-white text-sm sm:text-base font-bold rounded-lg 
                          hover:from-red-700 hover:to-red-800 
                          disabled:opacity-50 disabled:cursor-not-allowed 
                          transition-all duration-300 
                          active:scale-95
                          shadow-md hover:shadow-lg
                          flex items-center justify-center gap-2
                        "
                      >
                        {processing === request.id ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                            <span>Processing...</span>
                          </>
                        ) : (
                          <>
                            <X className="w-5 h-5" />
                            Reject
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 sm:p-12 text-center text-gray-500">
                  <Clock className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 text-gray-400" />
                  <p className="font-bold text-base sm:text-lg mb-1">No pending requests</p>
                  <p className="text-sm sm:text-base">New seller requests will appear here</p>
                </div>
              )}
            </div>

            {/* Footer Tip */}
            {requests.length > 0 && (
              <div className="p-3 sm:p-4 border-t-2 border-gray-100 bg-gradient-to-r from-blue-50 to-purple-50 flex-shrink-0">
                <p className="text-xs sm:text-sm text-gray-700 text-center font-medium">
                  💡 Tip: Approved sellers need account creation in the next step
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Enhanced CSS Animations */}
      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes wiggle {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-15deg); }
          75% { transform: rotate(15deg); }
        }

        .animate-slideDown {
          animation: slideDown 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }

        .animate-wiggle {
          animation: wiggle 0.5s ease-in-out;
        }

        /* Custom Scrollbar */
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f3f4f6;
          border-radius: 4px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, #9333ea, #6366f1);
          border-radius: 4px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(180deg, #7c3aed, #4f46e5);
        }
      `}</style>
    </>
  );
};

console.log('✅ AdminNotifications Component loaded - Production v2.0 (With Toast & Modals)');