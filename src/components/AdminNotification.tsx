  
import React, { useState, useEffect } from 'react';
import { Bell,Clock, User, Mail, Phone, MapPin, Store } from 'lucide-react';
import { collection, query, where, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { generateSecurePassword } from '../lib/emailService';

// ✅ Interface Definitions
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
  onRejectRequest?: (requestData: SellerRequest, reason?: string) => void; // ✅ Added rejection handler
}

export const AdminNotifications: React.FC<AdminNotificationsProps> = ({ 
  onApproveRequest,
  onRejectRequest // ✅ Added rejection prop
}) => {
  // ✅ State Management
  const [requests, setRequests] = useState<SellerRequest[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const [processing, setProcessing] = useState<string | null>(null);

  // ✅ Real-time Listener for Pending Requests
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
        
        // Sort by most recent first
        newRequests.sort((a, b) => 
          new Date(b.requestedAt).getTime() - new Date(a.requestedAt).getTime()
        );
        
        setRequests(newRequests);
        setUnreadCount(newRequests.length);
        
        console.log('🔔 Admin notifications updated:', newRequests.length, 'pending requests');
      },
      (error) => {
        console.error('❌ Error listening to seller requests:', error);
      }
    );

    return () => unsubscribe();
  }, []);

  // ✅ APPROVAL HANDLER - Updates status only, no account creation
  const handleApprove = async (request: SellerRequest) => {
    setProcessing(request.id);
    
    try {
      console.log('✅ Starting approval process for:', request.businessName);

      // Generate password for later use
      const tempPassword = generateSecurePassword();
      console.log('🔐 Password generated for later use');

      // Update request status to approved (NO ACCOUNT CREATION HERE)
      await updateDoc(doc(db, 'sellerRequests', request.id), {
        status: 'approved',
        reviewedAt: new Date().toISOString(),
        adminNotes: 'Approved - Ready for account creation',
        tempPassword: tempPassword,
        emailDeliveryStatus: 'pending',
        accountCreated: false
      });

      console.log('✅ Request status updated to approved');

      // Trigger auto tab switch and form pre-fill
      if (onApproveRequest) {
        const requestWithTempData = {
          ...request,
          tempPassword: tempPassword
        };
        onApproveRequest(requestWithTempData);
      }

      console.log('✅ Seller request approved - ready for account creation');
      
      alert(
        `✅ Seller Request Approved!\n\n` +
        `📋 Business: ${request.businessName}\n` +
        `👤 Owner: ${request.ownerName}\n` +
        `📧 Email: ${request.email}\n\n` +
        `➡️ Switching to Create Seller tab...\n` +
        `Please review the auto-filled details and click "Create Seller Account"`
      );
      
    } catch (error: any) {
      console.error('❌ Error approving seller:', error);
      alert(`❌ Failed to approve seller: ${error.message}\nPlease try again.`);
    } finally {
      setProcessing(null);
    }
  };

  // ✅ REJECTION HANDLER - Updates status and triggers email via parent
  const handleReject = async (request: SellerRequest, reason?: string) => {
    setProcessing(request.id);
    
    try {
      console.log('🚫 Rejecting seller request for:', request.businessName);
      
      // Update request status to rejected in Firebase
      await updateDoc(doc(db, 'sellerRequests', request.id), {
        status: 'rejected',
        rejectedAt: new Date().toISOString(),
        rejectionReason: reason || 'Application did not meet requirements',
        rejectionDate: new Date().toISOString()
      });
      
      console.log('✅ Request status updated to rejected in Firebase');
      
      // Call parent component rejection handler (will send email)
      if (onRejectRequest) {
        console.log('📧 Calling parent rejection handler for email...');
        onRejectRequest(request, reason);
      } else {
        console.warn('⚠️ No rejection handler provided from parent component');
      }
      
      console.log('❌ Seller request rejected:', request.businessName);
      
    } catch (error: any) {
      console.error('❌ Error rejecting seller:', error);
      alert(`❌ Failed to reject request: ${error.message}\nPlease try again.`);
    } finally {
      setProcessing(null);
    }
  };

  // ✅ Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.notification-dropdown')) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // ✅ RENDER UI
  return (
    <div className="relative notification-dropdown">
      {/* Bell Icon Button */}
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="relative p-1.5 sm:p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
        title={`${unreadCount} Pending Seller Requests`}
      >
        <Bell className="w-5 h-5 sm:w-6 sm:h-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center font-medium animate-pulse">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      {showDropdown && (
        <div className="absolute right-0 mt-2 w-[calc(100vw-2rem)] sm:w-[380px] md:w-[420px] bg-white rounded-lg sm:rounded-xl shadow-xl border border-gray-200 z-50 max-h-[calc(100vh-100px)] sm:max-h-[500px] overflow-hidden">
          
          {/* Header */}
          <div className="p-3 sm:p-4 border-b border-gray-100 bg-gradient-to-r from-purple-50 to-blue-50">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-sm sm:text-base text-gray-800 flex items-center gap-2">
                <Bell className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                <span className="truncate">Seller Requests</span>
              </h3>
              <span className="text-xs sm:text-sm text-gray-500 bg-white px-2 py-1 rounded-full flex-shrink-0 ml-2">
                {unreadCount} pending
              </span>
            </div>
          </div>
          
          {/* Requests List */}
          <div className="max-h-[calc(100vh-200px)] sm:max-h-80 overflow-y-auto">
            {requests.length > 0 ? (
              requests.map((request, index) => (
                <div 
                  key={request.id} 
                  className={`p-3 sm:p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                    index === 0 ? 'bg-blue-50' : ''
                  }`}
                >
                  {/* Request Info */}
                  <div className="mb-2 sm:mb-3">
                    <div className="flex items-center gap-2 mb-2">
                      <Store className="w-3 h-3 sm:w-4 sm:h-4 text-purple-600 flex-shrink-0" />
                      <h4 className="font-semibold text-sm sm:text-base text-gray-800 truncate flex-1 min-w-0">
                        {request.businessName}
                      </h4>
                      {index === 0 && (
                        <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 sm:py-1 rounded-full flex-shrink-0">
                          Latest
                        </span>
                      )}
                    </div>
                    
                    <div className="space-y-1 mb-2">
                      <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                        <User className="w-3 h-3 flex-shrink-0" />
                        <span className="truncate">{request.ownerName}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs sm:text-sm text-blue-600">
                        <Mail className="w-3 h-3 flex-shrink-0" />
                        <span className="truncate">{request.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                        <Phone className="w-3 h-3 flex-shrink-0" />
                        <span className="truncate">{request.phone}</span>
                      </div>
                      <div className="flex items-start gap-2 text-xs sm:text-sm text-gray-600">
                        <MapPin className="w-3 h-3 mt-0.5 flex-shrink-0" />
                        <span className="line-clamp-2">{request.businessAddress}</span>
                      </div>
                    </div>
                    
                    <p className="text-xs text-gray-400 mb-2">
                      📅 {new Date(request.requestedAt).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric',
                        year: 'numeric'
                      })} {' '}
                      <span className="hidden sm:inline">
                        {new Date(request.requestedAt).toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </p>
                    
                    {request.additionalInfo && (
                      <div className="bg-gray-50 rounded p-2">
                        <p className="text-xs text-gray-600 line-clamp-2">
                          💬 {request.additionalInfo}
                        </p>
                      </div>
                    )}
                  </div>
                  
                  {/* ✅ ACTION BUTTONS - APPROVE & REJECT */}
                  <div className="flex flex-col sm:flex-row gap-2">
                    {/* Approve Button */}
                    <button
                      onClick={() => handleApprove(request)}
                      disabled={processing === request.id}
                      className="flex-1 px-3 py-2 bg-green-600 text-white text-xs sm:text-sm font-medium rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {processing === request.id ? (
                        <div className="flex items-center justify-center gap-1">
                          <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                          <span>Processing...</span>
                        </div>
                      ) : (
                        '✅ Approve'
                      )}
                    </button>
                    
                    {/* ✅ REJECT BUTTON - WITH REASON PROMPT */}
                    <button
                      onClick={() => {
                        // Step 1: Prompt for rejection reason
                        const reason = prompt(
                          `💬 Enter rejection reason for "${request.businessName}":\n\n` +
                          `(Leave empty for default message)`,
                          ''
                        );
                        
                        // User clicked cancel
                        if (reason === null) {
                          console.log('User cancelled rejection');
                          return;
                        }
                        
                        // Step 2: Confirm rejection
                        const confirmed = confirm(
                          `❌ Are you sure you want to REJECT this seller?\n\n` +
                          `🏪 Business: ${request.businessName}\n` +
                          `📧 Email: ${request.email}\n` +
                          `👤 Owner: ${request.ownerName}\n` +
                          `📝 Reason: ${reason || 'Default rejection message'}\n\n` +
                          `The applicant will receive a rejection email.`
                        );
                        
                        if (confirmed) {
                          console.log('Rejection confirmed, proceeding...');
                          handleReject(request, reason);
                        } else {
                          console.log('Rejection cancelled by user');
                        }
                      }}
                      disabled={processing === request.id}
                      className="flex-1 px-3 py-2 bg-red-600 text-white text-xs sm:text-sm font-medium rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {processing === request.id ? (
                        <div className="flex items-center justify-center gap-1">
                          <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                          <span>Processing...</span>
                        </div>
                      ) : (
                        '❌ Reject'
                      )}
                    </button>
                  </div>
                </div>
              ))
            ) : (
              // Empty State
              <div className="p-6 sm:p-8 text-center text-gray-500">
                <Clock className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 text-gray-400" />
                <p className="font-medium text-sm sm:text-base">No pending requests</p>
                <p className="text-xs sm:text-sm mt-1">New seller requests will appear here</p>
              </div>
            )}
          </div>

          {/* Footer Tip */}
          {requests.length > 0 && (
            <div className="p-2 sm:p-3 border-t border-gray-100 bg-gray-50">
              <p className="text-xs text-gray-500 text-center">
                💡 Tip: Approved sellers need account creation in the next step
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};