 

import React, { useState, useEffect } from 'react';
import { 
  Shield, Users, Store, BarChart3, TrendingUp, Eye, CheckCircle, 
  AlertCircle, Mail, Copy, Key, Trash2, Search,  RefreshCw,
  UserX, Clock,Activity,  Settings, Package,
  QrCode, Image as ImageIcon, Award, TrendingDown, Menu, X
} from 'lucide-react';
import { useAppStore } from '../stores/appStore';
import { 
  getAllAnalytics, 
  getAdminDashboardStats,
  getSellersWithFullData,
  filterSellers,
  searchSellers,
  sendPasswordResetToSeller,
  softDeleteSellerAccount,
  getSellerCommunications,
  signUpSeller,
  generateSecurePassword,
  getAllSellersWithAnalytics,
  getApprovedSellers,
  getPendingRequests,
  getRejectedRequests
} from '../lib/firebaseutils';
import { AdminNotifications } from './AdminNotification';
import { SellerAnalytics } from './SellerAnalytics';
import {
  doc,
  getDoc,
  setDoc, 
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  addDoc,
  orderBy,
  limit
} from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import { 
  sendSellerCredentialsEmail, 
  checkEmailServiceHealth,
  sendTestEmail,
  getEmailServiceConfig,
  sendSellerRejectionEmail,
  sendPasswordResetNotification,
  sendAccountDeletionEmail
} from '../lib/emailService';

// ═══════════════════════════════════════════════════════════════
// ✅ TYPE DEFINITIONS (UNCHANGED)
// ═══════════════════════════════════════════════════════════════

interface NewSellerForm {
  email: string;
  password: string;
  fullName: string;
  businessName: string;
  businessAddress: string;
  phone: string;
  website: string;
}

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
  rejectedAt?: string;
  rejectionReason?: string;
  approvedAt?: string;
}

interface CreatedSellerInfo {
  email: string;
  password: string;
  businessName: string;
  ownerName: string;
}

interface DashboardStats {
  totalSellers: number;
  activeSellers: number;
  inactiveSellers: number;
  deletedSellers: number;
  suspendedSellers: number;
  pendingRequests: number;
  approvedRequests: number;
  rejectedRequests: number;
  totalRequests: number;
  thisMonthSellers: number;
}

interface TileData {
  id: string;
  tile_code: string;
  tile_name: string;
  image_url: string;
  seller_id: string;
  seller_name: string;
  scan_count: number;
  last_scanned: string;
  created_at: string;
}

// ═══════════════════════════════════════════════════════════════
// ✅ MAIN COMPONENT WITH RESPONSIVE DESIGN
// ═══════════════════════════════════════════════════════════════

export const AdminDashboard: React.FC = () => {
  // const { currentUser } = useAppStore();

  const { currentUser: _currentUser } = useAppStore();
  
  // ✅ TAB & DATA MANAGEMENT STATES
  const [activeTab, setActiveTab] = useState<'overview' | 'sellers' | 'analytics' | 'create-seller' | 'email-config' | 'account-access' | 'logs' | 'seller-analytics' | 'pending-requests' | 'rejected-requests' | 'tiles-analytics'>('overview');
  const [sellers, setSellers] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // ✅ RESPONSIVE MOBILE MENU STATE
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // ✅ REQUESTS & TILES DATA
  const [pendingRequests, setPendingRequests] = useState<SellerRequest[]>([]);
  const [rejectedRequests, setRejectedRequests] = useState<SellerRequest[]>([]);
  // const [tilesData, setTilesData] = useState<TileData[]>([]);
  // const [top5Tiles, setTop5Tiles] = useState<TileData[]>([]);

  // ✅ AFTER
const [tilesData] = useState<TileData[]>([]); // Remove setter if not used
const [top5Tiles] = useState<TileData[]>([]);

  // ✅ DASHBOARD STATS
  const [stats, setStats] = useState<DashboardStats>({
    totalSellers: 0,
    activeSellers: 0,
    inactiveSellers: 0,
    deletedSellers: 0,
    suspendedSellers: 0,
    pendingRequests: 0,
    approvedRequests: 0,
    rejectedRequests: 0,
    totalRequests: 0,
    thisMonthSellers: 0
  });
  
  // ✅ SELLER CREATION STATES
  const [creating, setCreating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [createdSeller, setCreatedSeller] = useState<CreatedSellerInfo | null>(null);

  // const [loadingAnalytics, setLoadingAnalytics] = useState(false);
  // const [sellerAnalytics, setSellerAnalytics] = useState<any>(null);
  // const [analyticsError, setAnalyticsError] = useState<string | null>(null);

  const [_loadingAnalytics, _setLoadingAnalytics] = useState(false);
const [_sellerAnalytics, _setSellerAnalytics] = useState<any>(null);
const [_analyticsError, _setAnalyticsError] = useState<string | null>(null);
  
  // ✅ FORM STATES
  const [selectedRequest, setSelectedRequest] = useState<SellerRequest | null>(null);
  const [newSeller, setNewSeller] = useState<NewSellerForm>({
    email: '',
    password: '',
    fullName: '',
    businessName: '',
    businessAddress: '',
    phone: '',
    website: ''
  });
  
  // ✅ EMAIL SERVICE STATES
  const [emailServiceStatus, setEmailServiceStatus] = useState<any>(null);
  const [testingEmail, setTestingEmail] = useState(false);
  
  // ✅ FILTER & SEARCH STATES
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'approved' | 'rejected' | 'pending' | 'active' | 'deleted'>('all');
  const [filteredSellers, setFilteredSellers] = useState<any[]>([]);
  
  // ✅ ACTION STATES
  const [processingAction, setProcessingAction] = useState<string | null>(null);
  const [selectedSeller, setSelectedSeller] = useState<any>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [communicationHistory, setCommunicationHistory] = useState<any[]>([]);
  // const [adminLogs, setAdminLogs] = useState<any[]>([]);

  

  // ✅ SELLER ANALYTICS STATES
  const [sellersAnalyticsList, setSellersAnalyticsList] = useState<any[]>([]);
  const [selectedSellerForAnalytics, setSelectedSellerForAnalytics] = useState<any>(null);
  const [showAnalyticsModal, setShowAnalyticsModal] = useState(false);
  const [approvedSellers, setApprovedSellers] = useState<any[]>([]);

  // ═══════════════════════════════════════════════════════════════
  // ✅ LOAD DATA ON MOUNT (UNCHANGED)
  // ═══════════════════════════════════════════════════════════════

  useEffect(() => {
    loadData();
    checkEmailService();
  }, []);

  useEffect(() => {
    applyFiltersAndSearch();
  }, [sellers, searchQuery, filterStatus]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [
        sellersData,
        analyticsData,
        dashboardStats,
        sellersWithAnalytics,
        approvedData,
        pendingData,
        rejectedData
      ] = await Promise.all([
        getSellersWithFullData(),
        getAllAnalytics(),
        getAdminDashboardStats(),
        getAllSellersWithAnalytics(),
        getApprovedSellers(),
        getPendingRequests(),
        getRejectedRequests()
      ]);
      
      setSellers(sellersData);
      setAnalytics(analyticsData);
      setStats(dashboardStats);
      setSellersAnalyticsList(sellersWithAnalytics);
      setApprovedSellers(approvedData);
      setPendingRequests(pendingData);
      setRejectedRequests(rejectedData);
      
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPendingRequests = async (): Promise<SellerRequest[]> => {
    try {
      const q = query(
        collection(db, 'sellerRequests'),
        where('status', '==', 'pending'),
        orderBy('requested_at', 'desc')
      );
      
      const snapshot = await getDocs(q);
      const requests: SellerRequest[] = [];
      
      snapshot.forEach((doc) => {
        const data = doc.data();
        requests.push({
          id: doc.id,
          requestId: doc.id,
          businessName: data.business_name || '',
          ownerName: data.owner_name || '',
          email: data.email || '',
          phone: data.phone || '',
          businessAddress: data.business_address || '',
          additionalInfo: data.additional_info || '',
          status: data.status || 'pending',
          requestedAt: data.requested_at || data.created_at || new Date().toISOString()
        });
      });
      
      return requests;
    } catch (error) {
      console.error('❌ Error fetching pending requests:', error);
      return [];
    }
  };

  const fetchRejectedRequests = async (): Promise<SellerRequest[]> => {
    try {
      const q = query(
        collection(db, 'sellerRequests'),
        where('status', '==', 'rejected'),
        orderBy('rejected_at', 'desc'),
        limit(50)
      );
      
      const snapshot = await getDocs(q);
      const requests: SellerRequest[] = [];
      
      snapshot.forEach((doc) => {
        const data = doc.data();
        requests.push({
          id: doc.id,
          requestId: doc.id,
          businessName: data.business_name || '',
          ownerName: data.owner_name || '',
          email: data.email || '',
          phone: data.phone || '',
          businessAddress: data.business_address || '',
          status: 'rejected',
          requestedAt: data.requested_at || data.created_at || '',
          rejectedAt: data.rejected_at || '',
          rejectionReason: data.rejection_reason || 'No reason provided'
        });
      });
      
      return requests;
    } catch (error) {
      console.error('❌ Error fetching rejected requests:', error);
      return [];
    }
  };

  const fetchTilesData = async (): Promise<TileData[]> => {
    try {
      const tilesQuery = query(collection(db, 'tiles'), orderBy('created_at', 'desc'));
      const tilesSnapshot = await getDocs(tilesQuery);
      
      const tiles: TileData[] = [];
      
      for (const tileDoc of tilesSnapshot.docs) {
        const tileData = tileDoc.data();
        
        let sellerName = 'Unknown Seller';
        if (tileData.seller_id) {
          try {
            const sellerDoc = await getDoc(doc(db, 'sellers', tileData.seller_id));
            if (sellerDoc.exists()) {
              sellerName = sellerDoc.data().business_name || sellerDoc.data().owner_name || 'Unknown';
            }
          } catch (e) {
            console.warn('Could not fetch seller for tile:', tileDoc.id);
          }
        }
        
        let scanCount = 0;
        let lastScanned = '';
        try {
          const analyticsDoc = await getDoc(doc(db, 'tileAnalytics', tileDoc.id));
          if (analyticsDoc.exists()) {
            const analyticsData = analyticsDoc.data();
            scanCount = analyticsData.scan_count || 0;
            lastScanned = analyticsData.last_scanned || '';
          }
        } catch (e) {
          console.warn('Could not fetch analytics for tile:', tileDoc.id);
        }
        
        tiles.push({
          id: tileDoc.id,
          tile_code: tileData.tile_code || tileData.code || 'N/A',
          tile_name: tileData.tile_name || tileData.name || 'Untitled',
          image_url: tileData.image_url || tileData.images?.[0] || '',
          seller_id: tileData.seller_id || '',
          seller_name: sellerName,
          scan_count: scanCount,
          last_scanned: lastScanned,
          created_at: tileData.created_at || ''
        });
      }
      
      return tiles;
    } catch (error) {
      console.error('❌ Error fetching tiles data:', error);
      return [];
    }
  };

  const fetchTop5Tiles = async (): Promise<TileData[]> => {
    try {
      const analyticsQuery = query(
        collection(db, 'tileAnalytics'),
        orderBy('scan_count', 'desc'),
        limit(5)
      );
      
      const analyticsSnapshot = await getDocs(analyticsQuery);
      const top5: TileData[] = [];
      
      for (const analyticsDoc of analyticsSnapshot.docs) {
        const analyticsData = analyticsDoc.data();
        const tileId = analyticsDoc.id;
        
        try {
          const tileDoc = await getDoc(doc(db, 'tiles', tileId));
          if (tileDoc.exists()) {
            const tileData = tileDoc.data();
            
            let sellerName = 'Unknown Seller';
            if (tileData.seller_id) {
              const sellerDoc = await getDoc(doc(db, 'sellers', tileData.seller_id));
              if (sellerDoc.exists()) {
                sellerName = sellerDoc.data().business_name || 'Unknown';
              }
            }
            
            top5.push({
              id: tileId,
              tile_code: tileData.tile_code || tileData.code || 'N/A',
              tile_name: tileData.tile_name || tileData.name || 'Untitled',
              image_url: tileData.image_url || tileData.images?.[0] || '',
              seller_id: tileData.seller_id || '',
              seller_name: sellerName,
              scan_count: analyticsData.scan_count || 0,
              last_scanned: analyticsData.last_scanned || '',
              created_at: tileData.created_at || ''
            });
          }
        } catch (e) {
          console.warn('Could not fetch tile details for:', tileId);
        }
      }
      
      return top5;
    } catch (error) {
      console.error('❌ Error fetching top 5 tiles:', error);
      return [];
    }
  };

  const checkEmailService = async () => {
    try {
      const status = await checkEmailServiceHealth();
      setEmailServiceStatus(status);
      console.log('📧 Email service status:', status);
    } catch (error) {
      console.error('Error checking email service:', error);
      setEmailServiceStatus({ configured: false, message: 'Health check failed' });
    }
  };

  const applyFiltersAndSearch = () => {
    try {
      let result = [...sellers];
      result = filterSellers(result, { status: filterStatus });
      result = searchSellers(result, searchQuery);
      setFilteredSellers(result);
    } catch (error) {
      console.error('❌ Error applying filters:', error);
      setFilteredSellers(sellers);
    }
  };

  const getTimeAgo = (dateString: string): string => {
    if (!dateString) return 'Unknown';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffDays > 0) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    if (diffHours > 0) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffMins > 0) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    return 'Just now';
  };

  // ═══════════════════════════════════════════════════════════════
  // ✅ ALL HANDLERS (UNCHANGED - KEEPING ALL)
  // ═══════════════════════════════════════════════════════════════

  const handleApproveFromNotification = (requestData: SellerRequest) => {
    console.log('🔄 Auto-switching to create-seller tab for:', requestData.businessName);
    
    setActiveTab('create-seller');
    setMobileMenuOpen(false); // Close mobile menu
    
    setNewSeller({
      email: requestData.email,
      password: requestData.tempPassword || '',
      fullName: requestData.ownerName,
      businessName: requestData.businessName,
      businessAddress: requestData.businessAddress,
      phone: requestData.phone,
      website: ''
    });
    
    setSelectedRequest(requestData);
    
    setTimeout(() => {
      alert(
        `✅ Auto Pre-filled!\n\n` +
        `📋 Seller Details:\n` +
        `• Business: ${requestData.businessName}\n` +
        `• Owner: ${requestData.ownerName}\n` +
        `• Email: ${requestData.email}\n\n` +
        `The form is now ready. Please review and click "Create Seller Account" to complete the process.`
      );
    }, 500);
  };

  const handleRejectRequestFromNotification = async (
    requestData: SellerRequest, 
    rejectionReason?: string
  ) => {
    try {
      console.log('🚫 [AdminDashboard] Processing rejection with email for:', requestData.businessName);
      
      let emailResult: any = { success: false, error: 'Not attempted' };
      
      try {
        if (emailServiceStatus?.configured) {
          console.log('📧 Email service configured, sending rejection email...');
          
          emailResult = await sendSellerRejectionEmail(
            requestData.email,
            requestData.businessName,
            requestData.ownerName,
            rejectionReason
          );
          
          if (emailResult.success) {
            console.log('✅ Rejection email sent successfully to:', requestData.email);
          } else {
            console.warn('⚠️ Rejection email delivery failed:', emailResult.error);
          }
        } else {
          console.log('⚠️ Email service not configured - skipping email');
          emailResult.error = 'Email service not configured';
        }
      } catch (emailError: any) {
        console.error('❌ Rejection email error:', emailError);
        emailResult = { 
          success: false, 
          error: emailError.message || 'Email service error'
        };
      }
      
      try {
        await addDoc(collection(db, 'adminLogs'), {
          action: 'seller_request_rejected',
          admin_id: auth.currentUser?.uid || 'unknown',
          admin_email: auth.currentUser?.email || 'unknown',
          request_id: requestData.id,
          seller_email: requestData.email,
          seller_business: requestData.businessName,
          rejection_reason: rejectionReason || 'Not specified',
          email_sent: emailResult.success,
          email_error: emailResult.error || null,
          timestamp: new Date().toISOString()
        });
        console.log('📝 Rejection activity logged to adminLogs collection');
      } catch (logError) {
        console.warn('⚠️ Failed to log rejection activity:', logError);
      }
      
      const resultMessage = emailResult.success 
        ? `✅ Rejection Completed Successfully!\n\n` +
          `📧 Rejection email sent to: ${requestData.email}\n` +
          `🏪 Business: ${requestData.businessName}\n` +
          `👤 Owner: ${requestData.ownerName}\n` +
          `📝 Reason: ${rejectionReason || 'Standard rejection message'}\n\n` +
          `The seller has been notified via email.`
        : `⚠️ Request Rejected (Email Failed)\n\n` +
          `✅ Status updated in database\n` +
          `❌ Email delivery failed: ${emailResult.error}\n\n` +
          `Please inform the seller manually:\n` +
          `📧 Email: ${requestData.email}\n` +
          `🏪 Business: ${requestData.businessName}\n` +
          `👤 Owner: ${requestData.ownerName}`;
      
      alert(resultMessage);
      
      console.log('🔄 Refreshing admin dashboard data...');
      await loadData();
      
    } catch (error: any) {
      console.error('❌ Error in rejection process:', error);
      alert(
        `❌ Rejection Process Failed!\n\n` +
        `Error: ${error.message}\n\n` +
        `Please try again or contact technical support.`
      );
    }
  };

  const handleCreateSeller = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    setError(null);
    
    try {
      console.log('🔄 Starting seller creation process...');
      
      const currentAdmin = auth.currentUser;
      if (!currentAdmin) {
        throw new Error('No authenticated user. Please login as admin.');
      }
      
      console.log('👤 Logged in as:', currentAdmin.email);

      const requiredFields = {
        email: newSeller.email.trim(),
        fullName: newSeller.fullName.trim(),
        businessName: newSeller.businessName.trim()
      };

      const missingFields = Object.entries(requiredFields)
        .filter(([_, value]) => !value)
        .map(([key, _]) => key);

      if (missingFields.length > 0) {
        throw new Error(`Please fill in required fields: ${missingFields.join(', ')}`);
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(requiredFields.email)) {
        throw new Error('Please enter a valid email address');
      }

      const password = newSeller.password.trim() || generateSecurePassword();
      console.log('🔐 Password generated');

      console.log('👤 Creating Firebase authentication account...');
      
      const authResult = await signUpSeller(
        requiredFields.email,
        password,
        requiredFields.fullName,
        'seller'
      );

      console.log('✅ Firebase Auth result:', {
        accountCreated: authResult.accountCreated,
        existingEmail: authResult.existingEmail,
        userId: authResult.userId,
        success: authResult.success
      });

      if (authResult.existingEmail) {
        setError('Email already exists in the system');
        return;
      }

      if (!authResult.accountCreated || !authResult.userId) {
        throw new Error('Account creation failed - no user ID received');
      }

      const stillAdmin = auth.currentUser;
      if (!stillAdmin || stillAdmin.uid !== currentAdmin.uid) {
        throw new Error('Admin session lost during creation');
      }
      
      console.log('✅ Admin session preserved:', stillAdmin.email);
      console.log('✅ Firebase Auth account created successfully');

      console.log('🏪 Creating business profile...');
      
      const businessProfile = {
        id: authResult.userId,
        user_id: authResult.userId,
        business_name: newSeller.businessName.trim(),
        owner_name: newSeller.fullName.trim(),
        email: newSeller.email.trim(),
        phone: newSeller.phone.trim() || '',
        business_address: newSeller.businessAddress.trim() || '',
        website: newSeller.website.trim() || '',
        subscription_status: 'active',
        subscription_plan: 'basic',
        account_type: 'seller',
        account_status: 'active',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        created_by: currentAdmin.uid,
        onboarding_completed: false
      };

      try {
        await setDoc(doc(db, 'sellers', authResult.userId), businessProfile);
        console.log('✅ Business profile created');
      } catch (profileError: any) {
        console.error('❌ Business profile creation failed:', profileError);
        throw new Error(`Business profile creation failed: ${profileError.message}`);
      }

      console.log('📧 Attempting email delivery...');
      let emailResult: any = { success: false, error: 'Not attempted', details: null };
      
      try {
        if (emailServiceStatus?.configured) {
          emailResult = await sendSellerCredentialsEmail(
            requiredFields.email,
            newSeller.businessName,
            requiredFields.fullName,
            password
          );
          
          if (emailResult.success) {
            console.log('✅ Credentials email sent successfully');
          } else {
            console.warn('⚠️ Email delivery failed:', emailResult.error);
          }
        } else {
          console.log('⚠️ Email service not configured - manual delivery required');
          emailResult.error = 'Email service not configured';
        }
      } catch (emailError: any) {
        console.error('❌ Email system error:', emailError);
        emailResult = { 
          success: false, 
          error: emailError.message || 'Email service error',
          details: emailError 
        };
      }

      if (selectedRequest) {
        try {
          const requestId = selectedRequest.requestId || selectedRequest.id;
          await updateDoc(doc(db, 'sellerRequests', requestId), {
            status: 'approved',
            reviewedAt: new Date().toISOString(),
            reviewedBy: currentAdmin.uid,
            accountCreated: true,
            sellerId: authResult.userId,
            emailDeliveryStatus: emailResult.success ? 'sent' : 'failed',
            emailError: emailResult.error || null,
            approval_date: new Date().toISOString()
          });
          console.log('✅ Request updated');
        } catch (updateError) {
          console.warn('⚠️ Request update failed:', updateError);
        }
      }

      try {
        await addDoc(collection(db, 'adminLogs'), {
          action: 'seller_account_created',
          admin_id: currentAdmin.uid,
          admin_email: currentAdmin.email,
          seller_email: requiredFields.email,
          seller_business: newSeller.businessName,
          seller_id: authResult.userId,
          account_created: true,
          email_sent: emailResult.success,
          email_error: emailResult.error || null,
          timestamp: new Date().toISOString()
        });
        console.log('📝 Admin activity logged');
      } catch (logError) {
        console.warn('⚠️ Failed to log admin activity:', logError);
      }

      console.log('✅ Seller creation completed successfully');

      setSuccess(true);
      setCreatedSeller({
        email: requiredFields.email,
        password: password,
        businessName: newSeller.businessName,
        ownerName: newSeller.fullName
      });

      if (!emailResult.success) {
        try {
          const credentialsText = 
            `🔐 TileVision Seller Account\n\n` +
            `Login: ${window.location.origin}/login\n` +
            `Email: ${requiredFields.email}\n` +
            `Password: ${password}\n\n` +
            `Welcome to TileVision! 🎉`;
          
          await navigator.clipboard.writeText(credentialsText);
          console.log('📋 Credentials copied to clipboard');
        } catch (clipboardError) {
          console.warn('⚠️ Could not copy to clipboard:', clipboardError);
        }
      }

      setNewSeller({
        email: '',
        password: '',
        fullName: '',
        businessName: '',
        businessAddress: '',
        phone: '',
        website: ''
      });
      
      setSelectedRequest(null);
      await loadData();

    } catch (error: any) {
      console.error('❌ Critical error in seller creation workflow:', error);
      
      let errorMessage = error.message || 'Failed to create seller account';
      
      if (error.message.includes('Access Denied')) {
        errorMessage = 'Access Denied: Only administrators can create seller accounts';
      } else if (error.message.includes('email-already-in-use')) {
        errorMessage = 'Email already registered in the system';
      } else if (error.message.includes('weak-password')) {
        errorMessage = 'Password too weak. Use a stronger password';
      } else if (error.message.includes('invalid-email')) {
        errorMessage = 'Invalid email format';
      } else if (error.message.includes('Permission denied')) {
        errorMessage = 'Database permission error. Check Firestore rules';
      }
      
      setError(errorMessage);
      
    } finally {
      setCreating(false);
      console.log('🔄 Seller creation process finished');
    }
  };

  const handlePasswordReset = async (seller: any) => {
    try {
      const confirmed = confirm(
        `🔑 Send Password Reset Link?\n\n` +
        `This will send a password reset email to:\n` +
        `📧 ${seller.email}\n` +
        `🏪 ${seller.businessName}\n\n` +
        `The seller will receive a link to reset their password.\n\n` +
        `Continue?`
      );
      
      if (!confirmed) return;
      
      setProcessingAction(seller.id);
      
      console.log('🔑 Sending password reset to:', seller.email);
      
      const result = await sendPasswordResetToSeller(seller.email);
      
      if (result.success) {
        if (emailServiceStatus?.configured) {
          try {
            await sendPasswordResetNotification(
              seller.email,
              seller.businessName,
              seller.ownerName
            );
            console.log('✅ Password reset notification sent');
          } catch (emailError) {
            console.warn('⚠️ Notification email failed:', emailError);
          }
        }
        
        alert(
          `✅ Password Reset Link Sent!\n\n` +
          `📧 Email sent to: ${seller.email}\n` +
          `🏪 Business: ${seller.businessName}\n\n` +
          `The seller will receive:\n` +
          `1. Firebase password reset link\n` +
          `2. Email notification\n\n` +
          `Link expires in 1 hour.`
        );
        
        await loadData();
      } else {
        throw new Error(result.error || 'Failed to send password reset');
      }
      
    } catch (error: any) {
      console.error('❌ Password reset error:', error);
      alert(
        `❌ Password Reset Failed!\n\n` +
        `Error: ${error.message}\n\n` +
        `Please try again or contact the seller manually.`
      );
    } finally {
      setProcessingAction(null);
    }
  };

  const handleDeleteSeller = async (seller: any) => {
    try {
      const reason = prompt(
        `⚠️ DELETE SELLER ACCOUNT\n\n` +
        `This will DEACTIVATE the account for:\n` +
        `🏪 ${seller.businessName}\n` +
        `📧 ${seller.email}\n\n` +
        `Enter deletion reason (or leave empty):`
      );
      
      if (reason === null) return;
      
      const confirmText = prompt(
        `🚨 FINAL CONFIRMATION\n\n` +
        `Type "DELETE" to confirm account deletion:\n` +
        `🏪 ${seller.businessName}\n` +
        `📧 ${seller.email}\n\n` +
        `This will:\n` +
        `• Mark account as deleted\n` +
        `• Archive all tiles\n` +
        `• Send deletion email\n` +
        `• Block future login\n\n` +
        `Type "DELETE" to proceed:`
      );
      
      if (confirmText !== 'DELETE') {
        alert('❌ Deletion cancelled - confirmation text did not match');
        return;
      }
      
      setProcessingAction(seller.id);
      
      console.log('🗑️ Deleting seller account:', seller.id);
      
      const result = await softDeleteSellerAccount(seller.id, reason);
      
      if (result.success) {
        if (emailServiceStatus?.configured) {
          try {
            await sendAccountDeletionEmail(
              seller.email,
              seller.businessName,
              seller.ownerName,
              reason
            );
            console.log('✅ Deletion notification sent');
          } catch (emailError) {
            console.warn('⚠️ Deletion email failed:', emailError);
          }
        }
        
        alert(
          `✅ Seller Account Deleted!\n\n` +
          `🏪 Business: ${seller.businessName}\n` +
          `📧 Email: ${seller.email}\n\n` +
          `Actions completed:\n` +
          `✅ Account marked as deleted\n` +
          `✅ Tiles archived\n` +
          `✅ Deletion logged\n` +
          `${emailServiceStatus?.configured ? '✅ Email notification sent' : '⚠️ Email not configured'}\n\n` +
          `The seller can no longer log in.`
        );
        
        await loadData();
      } else {
        throw new Error(result.error || 'Failed to delete seller account');
      }
      
    } catch (error: any) {
      console.error('❌ Delete seller error:', error);
      alert(
        `❌ Account Deletion Failed!\n\n` +
        `Error: ${error.message}\n\n` +
        `Please try again or contact technical support.`
      );
    } finally {
      setProcessingAction(null);
    }
  };

  const handleViewDetails = async (seller: any) => {
    try {
      setSelectedSeller(seller);
      setShowDetailsModal(true);
      
      const comms = await getSellerCommunications(seller.email);
      setCommunicationHistory(comms);
      
    } catch (error) {
      console.error('❌ Error loading seller details:', error);
    }
  };

  const handleTestEmail = async () => {
    setTestingEmail(true);
    try {
      const testResult = await sendTestEmail('test@example.com');
      if (testResult.success) {
        alert('✅ Test email sent successfully!\nCheck the console for details.');
      } else {
        alert(`❌ Test email failed:\n${testResult.error}\n\nCheck email service configuration.`);
      }
    } catch (error) {
      alert(`❌ Test email error:\n${error}`);
    } finally {
      setTestingEmail(false);
    }
  };

  const copyEmailConfig = async () => {
    try {
      const config = getEmailServiceConfig();
      const configText = 
        `EmailJS Configuration:\n\n` +
        `Service ID: ${config.serviceId}\n` +
        `Template ID: ${config.templateId}\n` +
        `Public Key: ${config.publicKey}\n` +
        `Environment: ${config.environment}`;
      
      await navigator.clipboard.writeText(configText);
      alert('📋 Email configuration copied to clipboard!');
    } catch (error) {
      alert('❌ Could not copy configuration to clipboard');
    }
  };

  const totalViews = analytics.reduce((sum, item) => sum + (item.view_count || 0), 0);
  const totalApplications = analytics.reduce((sum, item) => sum + (item.apply_count || 0), 0);

  // ═══════════════════════════════════════════════════════════════
  // ✅ RESPONSIVE LOADING STATE
  // ═══════════════════════════════════════════════════════════════

  if (loading && !success && !error) {
    return (
      <div className="flex items-center justify-center h-64 px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <span className="text-gray-600 text-sm sm:text-base">Loading dashboard...</span>
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════
  // ✅ RESPONSIVE SUCCESS STATE
  // ═══════════════════════════════════════════════════════════════

  if (success && createdSeller) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
        {/* Responsive Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 pb-4 border-b gap-3">
          <div className="flex items-center gap-3">
            <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600 flex-shrink-0" />
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Admin Dashboard</h2>
              <p className="text-xs sm:text-sm text-gray-600">Seller Account Created Successfully</p>
            </div>
          </div>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 sm:p-8">
            {/* Success Icon & Title */}
            <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-8 h-8 sm:w-10 sm:h-10 text-green-600" />
              </div>
              <div className="text-center sm:text-left">
                <h2 className="text-2xl sm:text-3xl font-bold text-green-800">Account Created!</h2>
                <p className="text-green-600 text-sm sm:text-lg">Successfully created seller account</p>
              </div>
            </div>

            {/* Credentials Display - Mobile Optimized */}
            <div className="bg-white rounded-lg p-4 sm:p-6 space-y-3 sm:space-y-4 mb-6">
              <h3 className="font-semibold text-gray-800 text-base sm:text-lg mb-4">📧 Login Credentials</h3>
              
              <div className="space-y-2 sm:space-y-3">
                {/* Business Name */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 p-3 bg-gray-50 rounded-lg">
                  <span className="text-xs sm:text-sm font-medium text-gray-600 sm:w-32">Business:</span>
                  <span className="text-xs sm:text-sm font-semibold text-gray-800 break-words">{createdSeller.businessName}</span>
                </div>

                {/* Owner Name */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 p-3 bg-gray-50 rounded-lg">
                  <span className="text-xs sm:text-sm font-medium text-gray-600 sm:w-32">Owner:</span>
                  <span className="text-xs sm:text-sm font-semibold text-gray-800 break-words">{createdSeller.ownerName}</span>
                </div>
                
                {/* Email */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 p-3 bg-gray-50 rounded-lg">
                  <span className="text-xs sm:text-sm font-medium text-gray-600 sm:w-32">Email:</span>
                  <code className="text-xs sm:text-sm text-gray-800 font-mono break-all">{createdSeller.email}</code>
                </div>
                
                {/* Password - Highlighted */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <span className="text-xs sm:text-sm font-medium text-gray-600 sm:w-32">Password:</span>
                  <code className="text-xs sm:text-sm text-gray-800 font-mono font-bold bg-yellow-100 px-3 py-1 rounded break-all">
                    {createdSeller.password}
                  </code>
                </div>
                
                {/* Login URL */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 p-3 bg-gray-50 rounded-lg">
                  <span className="text-xs sm:text-sm font-medium text-gray-600 sm:w-32">Login URL:</span>
                  <a 
                    href="/login" 
                    className="text-xs sm:text-sm text-blue-600 hover:underline font-medium break-all"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {window.location.origin}/login
                  </a>
                </div>
              </div>

              {/* Warning Box */}
              <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-yellow-50 border border-yellow-300 rounded-lg">
                <p className="text-xs sm:text-sm text-yellow-800">
                  <strong>⚠️ Important:</strong> Save these credentials securely. 
                  {emailServiceStatus?.configured 
                    ? ' An email has been sent to the seller.' 
                    : ' Please share these credentials with the seller manually.'}
                </p>
              </div>
            </div>

            {/* Action Buttons - Mobile Stacked */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(
                    `🔐 TileVision Seller Account\n\n` +
                    `Business: ${createdSeller.businessName}\n` +
                    `Owner: ${createdSeller.ownerName}\n` +
                    `Email: ${createdSeller.email}\n` +
                    `Password: ${createdSeller.password}\n` +
                    `Login: ${window.location.origin}/login\n\n` +
                    `Welcome to TileVision! 🎉`
                  );
                  alert('📋 Credentials copied to clipboard!');
                }}
                className="flex-1 px-4 sm:px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm sm:text-base"
              >
                <div className="flex items-center justify-center gap-2">
                  <Copy className="w-4 h-4 sm:w-5 sm:h-5" />
                  Copy All Credentials
                </div>
              </button>
              
              <button
                onClick={() => {
                  setSuccess(false);
                  setCreatedSeller(null);
                  setActiveTab('overview');
                }}
                className="flex-1 px-4 sm:px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium text-sm sm:text-base"
              >
                Back to Dashboard
              </button>
            </div>

            {/* Secondary Action */}
            <div className="mt-4 text-center">
              <button
                onClick={() => {
                  setSuccess(false);
                  setCreatedSeller(null);
                  setActiveTab('create-seller');
                }}
                className="text-green-700 hover:text-green-800 text-xs sm:text-sm font-medium underline"
              >
                Create Another Seller Account
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════
  // ✅ RESPONSIVE ERROR STATE
  // ═══════════════════════════════════════════════════════════════

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
        {/* Responsive Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 pb-4 border-b gap-3">
          <div className="flex items-center gap-3">
            <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600 flex-shrink-0" />
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Admin Dashboard</h2>
              <p className="text-xs sm:text-sm text-gray-600">Seller Account Creation Failed</p>
            </div>
          </div>
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 sm:p-8">
            {/* Error Icon & Title */}
            <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-8 h-8 sm:w-10 sm:h-10 text-red-600" />
              </div>
              <div className="text-center sm:text-left">
                <h2 className="text-2xl sm:text-3xl font-bold text-red-800">Creation Failed</h2>
                <p className="text-red-600 text-sm sm:text-lg">Unable to create seller account</p>
              </div>
            </div>

            {/* Error Details */}
            <div className="bg-white rounded-lg p-4 sm:p-6 mb-6">
              <h3 className="font-semibold text-gray-800 mb-3 text-sm sm:text-base">Error Details:</h3>
              <p className="text-red-700 font-medium text-sm sm:text-base break-words">{error}</p>
              
              {/* Troubleshooting */}
              <div className="mt-4 p-3 sm:p-4 bg-gray-50 rounded-lg">
                <p className="text-xs sm:text-sm text-gray-700 font-medium mb-2">Troubleshooting Steps:</p>
                <ul className="text-xs sm:text-sm text-gray-600 space-y-1 list-disc list-inside">
                  <li>Verify you are logged in as administrator</li>
                  <li>Check if the email is already registered</li>
                  <li>Ensure all required fields are filled correctly</li>
                  <li>Check browser console for detailed error logs</li>
                  <li>Verify Firestore security rules are configured</li>
                </ul>
              </div>
            </div>

            {/* Action Buttons - Mobile Stacked */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => {
                  setError(null);
                  setActiveTab('create-seller');
                }}
                className="flex-1 px-4 sm:px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium text-sm sm:text-base"
              >
                Try Again
              </button>
              
              <button
                onClick={() => {
                  setError(null);
                  setActiveTab('overview');
                }}
                className="flex-1 px-4 sm:px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium text-sm sm:text-base"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════
  // ✅ RESPONSIVE CREATING STATE
  // ═══════════════════════════════════════════════════════════════

  if (creating) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
        {/* Responsive Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 pb-4 border-b gap-3">
          <div className="flex items-center gap-3">
            <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600 flex-shrink-0" />
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Admin Dashboard</h2>
              <p className="text-xs sm:text-sm text-gray-600">Creating Seller Account</p>
            </div>
          </div>
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 sm:p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-b-4 border-blue-600 mx-auto mb-6"></div>
            <h2 className="text-xl sm:text-2xl font-semibold text-blue-800 mb-3">Creating Seller Account...</h2>
            <p className="text-blue-600 mb-6 text-sm sm:text-base">Please wait while we set up the account and business profile</p>
            
            {/* Process Steps */}
            <div className="bg-white rounded-lg p-4 text-left">
              <p className="text-xs sm:text-sm text-gray-700 font-medium mb-2">Process Steps:</p>
              <ul className="text-xs sm:text-sm text-gray-600 space-y-1">
                <li>✅ Validating admin session</li>
                <li>✅ Creating Firebase authentication account</li>
                <li>⏳ Setting up business profile</li>
                <li>⏳ Configuring seller permissions</li>
                <li>⏳ Sending credentials email</li>
              </ul>
            </div>

            <p className="text-xs text-gray-500 mt-4">This may take a few moments...</p>
          </div>
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════
  // ✅ MAIN RESPONSIVE DASHBOARD UI
  // ═══════════════════════════════════════════════════════════════

  return (
    <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 lg:p-6">
      {/* ═══════════════════════════════════════════════════════════ */}
      {/* ✅ RESPONSIVE HEADER */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-3">
        <div className="flex items-center gap-2 sm:gap-3">
          <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600 flex-shrink-0" />
          <div>
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800">Admin Dashboard</h2>
            <p className="text-xs sm:text-sm text-gray-600 hidden sm:block">Platform Overview & Management</p>
          </div>
        </div>
        
        {/* Header Actions - Mobile Optimized */}
        <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
          <AdminNotifications 
            onApproveRequest={handleApproveFromNotification}
            onRejectRequest={handleRejectRequestFromNotification}
          />
          
          <div className={`px-2 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-medium whitespace-nowrap ${
            emailServiceStatus?.configured 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            <span className="hidden sm:inline">📧 </span>
            {emailServiceStatus?.configured ? 'Email Ready' : 'Email Config Needed'}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="sm:hidden p-2 bg-purple-100 text-purple-600 rounded-lg"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* ✅ RESPONSIVE TAB NAVIGATION */}
      {/* ═══════════════════════════════════════════════════════════ */}
      
      {/* Desktop Tabs - Hidden on Mobile */}
      <div className="hidden sm:flex flex-wrap gap-2 mb-6 pb-4 border-b">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex items-center gap-2 px-3 lg:px-4 py-2 rounded-lg transition-colors text-sm lg:text-base ${
            activeTab === 'overview' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span className="hidden lg:inline">Overview</span>
        </button>
        <button
          onClick={() => setActiveTab('sellers')}
          className={`flex items-center gap-2 px-3 lg:px-4 py-2 rounded-lg transition-colors text-sm lg:text-base ${
            activeTab === 'sellers' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <Store className="w-4 h-4" />
          <span>Sellers</span>
          <span className="hidden lg:inline">({filteredSellers.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('pending-requests')}
          className={`flex items-center gap-2 px-3 lg:px-4 py-2 rounded-lg transition-colors text-sm lg:text-base ${
            activeTab === 'pending-requests' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span className="hidden md:inline">Pending</span>
          <span>({pendingRequests.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('rejected-requests')}
          className={`flex items-center gap-2 px-3 lg:px-4 py-2 rounded-lg transition-colors text-sm lg:text-base ${
            activeTab === 'rejected-requests' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <AlertCircle className="w-4 h-4" />
          <span className="hidden md:inline">Rejected</span>
          <span>({rejectedRequests.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('analytics')}
          className={`flex items-center gap-2 px-3 lg:px-4 py-2 rounded-lg transition-colors text-sm lg:text-base ${
            activeTab === 'analytics' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span className="hidden lg:inline">Analytics</span>
        </button>
        <button
          onClick={() => setActiveTab('tiles-analytics')}
          className={`flex items-center gap-2 px-3 lg:px-4 py-2 rounded-lg transition-colors text-sm lg:text-base ${
            activeTab === 'tiles-analytics' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <QrCode className="w-4 h-4" />
          <span className="hidden md:inline">Tiles</span>
          <span className="lg:hidden">({tilesData.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('seller-analytics')}
          className={`flex items-center gap-2 px-3 lg:px-4 py-2 rounded-lg transition-colors text-sm lg:text-base ${
            activeTab === 'seller-analytics' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <Package className="w-4 h-4" />
          <span className="hidden xl:inline">Seller Analytics</span>
          <span className="xl:hidden">S.Analytics</span>
        </button>
        <button
          onClick={() => setActiveTab('create-seller')}
          className={`flex items-center gap-2 px-3 lg:px-4 py-2 rounded-lg transition-colors text-sm lg:text-base ${
            activeTab === 'create-seller' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <Users className="w-4 h-4" />
          <span className="hidden lg:inline">Create Seller</span>
          <span className="lg:hidden">Create</span>
          {selectedRequest && (
            <span className="bg-green-500 text-white text-xs rounded-full w-2 h-2 animate-pulse"></span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('account-access')}
          className={`flex items-center gap-2 px-3 lg:px-4 py-2 rounded-lg transition-colors text-sm lg:text-base ${
            activeTab === 'account-access' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <Key className="w-4 h-4" />
          <span className="hidden lg:inline">Access</span>
        </button>
        <button
          onClick={() => setActiveTab('email-config')}
          className={`flex items-center gap-2 px-3 lg:px-4 py-2 rounded-lg transition-colors text-sm lg:text-base ${
            activeTab === 'email-config' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <Mail className="w-4 h-4" />
          <span className="hidden lg:inline">Email</span>
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="sm:hidden mb-4 pb-4 border-b bg-gray-50 rounded-lg p-3 space-y-2">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3, count: null },
            { id: 'sellers', label: 'Sellers', icon: Store, count: filteredSellers.length },
            { id: 'pending-requests', label: 'Pending Requests', icon: Clock, count: pendingRequests.length },
            { id: 'rejected-requests', label: 'Rejected Requests', icon: AlertCircle, count: rejectedRequests.length },
            { id: 'analytics', label: 'Analytics', icon: TrendingUp, count: null },
            { id: 'tiles-analytics', label: 'Tiles', icon: QrCode, count: tilesData.length },
            { id: 'seller-analytics', label: 'Seller Analytics', icon: Package, count: null },
            { id: 'create-seller', label: 'Create Seller', icon: Users, count: null },
            { id: 'account-access', label: 'Account Access', icon: Key, count: null },
            { id: 'email-config', label: 'Email Config', icon: Mail, count: null },
          ].map((tab: any) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${
                  activeTab === tab.id 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{tab.label}</span>
                </div>
                {tab.count !== null && (
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                    activeTab === tab.id ? 'bg-white text-purple-600' : 'bg-purple-100 text-purple-600'
                  }`}>
                    {tab.count}
                  </span>
                )}
                {tab.id === 'create-seller' && selectedRequest && (
                  <span className="bg-green-500 text-white text-xs rounded-full w-2 h-2 animate-pulse"></span>
                )}
              </button>
            );
          })}
        </div>
      )}

{/* Continue in Part 2... */}

{/* ═══════════════════════════════════════════════════════════════ */}
{/* ✅ OVERVIEW TAB - RESPONSIVE */}
{/* ═══════════════════════════════════════════════════════════════ */}
      
{activeTab === 'overview' && (
  <div className="space-y-4 sm:space-y-6">
    {/* Stats Grid - Responsive */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
      <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-4 sm:p-6 rounded-xl shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-purple-100 text-xs sm:text-sm font-medium">Total Sellers</p>
            <p className="text-2xl sm:text-3xl font-bold mt-1">{stats.totalSellers}</p>
            <p className="text-purple-200 text-[10px] sm:text-xs mt-1">All registered sellers</p>
          </div>
          <Store className="w-10 h-10 sm:w-12 sm:h-12 text-purple-200 opacity-80" />
        </div>
      </div>
      
      <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-4 sm:p-6 rounded-xl shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-green-100 text-xs sm:text-sm font-medium">✅ Approved</p>
            <p className="text-2xl sm:text-3xl font-bold mt-1">{stats.approvedRequests}</p>
            <p className="text-green-200 text-[10px] sm:text-xs mt-1">Successfully approved</p>
          </div>
          <CheckCircle className="w-10 h-10 sm:w-12 sm:h-12 text-green-200 opacity-80" />
        </div>
      </div>
      
      <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white p-4 sm:p-6 rounded-xl shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-yellow-100 text-xs sm:text-sm font-medium">⏳ Pending</p>
            <p className="text-2xl sm:text-3xl font-bold mt-1">{stats.pendingRequests}</p>
            <p className="text-yellow-200 text-[10px] sm:text-xs mt-1">Awaiting approval</p>
          </div>
          <Clock className="w-10 h-10 sm:w-12 sm:h-12 text-yellow-200 opacity-80" />
        </div>
      </div>
      
      <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-4 sm:p-6 rounded-xl shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-red-100 text-xs sm:text-sm font-medium">❌ Rejected</p>
            <p className="text-2xl sm:text-3xl font-bold mt-1">{stats.rejectedRequests}</p>
            <p className="text-red-200 text-[10px] sm:text-xs mt-1">Not approved</p>
          </div>
          <AlertCircle className="w-10 h-10 sm:w-12 sm:h-12 text-red-200 opacity-80" />
        </div>
      </div>
      
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 sm:p-6 rounded-xl shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-blue-100 text-xs sm:text-sm font-medium">🟢 Active</p>
            <p className="text-2xl sm:text-3xl font-bold mt-1">{stats.activeSellers}</p>
            <p className="text-blue-200 text-[10px] sm:text-xs mt-1">Currently active</p>
          </div>
          <Activity className="w-10 h-10 sm:w-12 sm:h-12 text-blue-200 opacity-80" />
        </div>
      </div>
      
      <div className="bg-gradient-to-r from-gray-500 to-gray-600 text-white p-4 sm:p-6 rounded-xl shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-100 text-xs sm:text-sm font-medium">🗑️ Deleted</p>
            <p className="text-2xl sm:text-3xl font-bold mt-1">{stats.deletedSellers}</p>
            <p className="text-gray-200 text-[10px] sm:text-xs mt-1">Deactivated accounts</p>
          </div>
          <UserX className="w-10 h-10 sm:w-12 sm:h-12 text-gray-200 opacity-80" />
        </div>
      </div>
    </div>

    {/* Platform Health - Responsive */}
    <div className="bg-gray-50 rounded-xl p-4 sm:p-6">
      <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-4">📊 Platform Health</h3>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <h4 className="font-medium text-gray-700 mb-3 text-sm sm:text-base">Seller Status Distribution</h4>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs sm:text-sm text-gray-600">Active</span>
              <span className="text-xs sm:text-sm font-medium text-green-600 bg-green-100 px-2 py-1 rounded">
                {stats.activeSellers}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs sm:text-sm text-gray-600">Inactive</span>
              <span className="text-xs sm:text-sm font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded">
                {stats.inactiveSellers}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs sm:text-sm text-gray-600">Deleted</span>
              <span className="text-xs sm:text-sm font-medium text-red-600 bg-red-100 px-2 py-1 rounded">
                {stats.deletedSellers}
              </span>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <h4 className="font-medium text-gray-700 mb-3 text-sm sm:text-base">Platform Metrics</h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-xs sm:text-sm text-gray-600">Total Views</span>
              <span className="text-xs sm:text-sm font-medium">{totalViews.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-xs sm:text-sm text-gray-600">Total Applications</span>
              <span className="text-xs sm:text-sm font-medium">{totalApplications.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-xs sm:text-sm text-gray-600">Conversion Rate</span>
              <span className="text-xs sm:text-sm font-medium">
                {totalViews > 0 ? ((totalApplications / totalViews) * 100).toFixed(1) : 0}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* Quick Actions - Responsive Grid */}
    <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-4 sm:p-6 border border-purple-200">
      <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-4">⚡ Quick Actions</h3>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
        <button
          onClick={() => setActiveTab('sellers')}
          className="flex flex-col sm:flex-row items-center justify-center gap-2 px-3 py-3 sm:px-4 sm:py-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <Users className="w-5 h-5 text-purple-600" />
          <span className="font-medium text-gray-700 text-xs sm:text-sm text-center">View Sellers</span>
        </button>
        <button
          onClick={() => setActiveTab('create-seller')}
          className="flex flex-col sm:flex-row items-center justify-center gap-2 px-3 py-3 sm:px-4 sm:py-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <Users className="w-5 h-5 text-green-600" />
          <span className="font-medium text-gray-700 text-xs sm:text-sm text-center">Create Seller</span>
        </button>
        <button
          onClick={loadData}
          className="flex flex-col sm:flex-row items-center justify-center gap-2 px-3 py-3 sm:px-4 sm:py-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <RefreshCw className="w-5 h-5 text-blue-600" />
          <span className="font-medium text-gray-700 text-xs sm:text-sm text-center">Refresh</span>
        </button>
        <button
          onClick={() => setActiveTab('email-config')}
          className="flex flex-col sm:flex-row items-center justify-center gap-2 px-3 py-3 sm:px-4 sm:py-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <Settings className="w-5 h-5 text-orange-600" />
          <span className="font-medium text-gray-700 text-xs sm:text-sm text-center">Email</span>
        </button>
      </div>
    </div>
  </div>
)}

{/* Continue to Part 3 for remaining tabs... */}
{/* ═══════════════════════════════════════════════════════════════ */}
{/* ✅ PENDING REQUESTS TAB - RESPONSIVE */}
{/* ═══════════════════════════════════════════════════════════════ */}

{activeTab === 'pending-requests' && (
  <div className="space-y-4">
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 sm:p-4">
      <h3 className="font-semibold text-yellow-800 mb-2 text-sm sm:text-base">⏳ Pending Seller Requests</h3>
      <p className="text-yellow-700 text-xs sm:text-sm">
        Review and approve or reject seller registration requests.
      </p>
    </div>

    {/* Mobile Card View */}
    <div className="block lg:hidden space-y-3">
      {pendingRequests.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
          <Clock className="w-12 h-12 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-500 font-medium">No Pending Requests</p>
        </div>
      ) : (
        pendingRequests.map((request) => (
          <div key={request.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h4 className="font-bold text-gray-800 text-sm mb-1">{request.businessName}</h4>
                <p className="text-xs text-gray-600 mb-1">{request.ownerName}</p>
                <a href={`mailto:${request.email}`} className="text-xs text-blue-600 hover:underline break-all">
                  {request.email}
                </a>
              </div>
              <span className="text-xs font-medium text-yellow-700 bg-yellow-100 px-2 py-1 rounded-full whitespace-nowrap ml-2">
                {getTimeAgo(request.requestedAt)}
              </span>
            </div>
            
            <div className="space-y-2 text-xs text-gray-600 mb-3 pb-3 border-b">
              <div className="flex justify-between">
                <span>Phone:</span>
                <span className="font-medium">{request.phone || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span>Requested:</span>
                <span className="font-medium">
                  {new Date(request.requestedAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={() => handleApproveFromNotification(request)}
                className="flex-1 px-3 py-2 bg-green-600 text-white text-xs font-medium rounded-lg hover:bg-green-700 transition-colors"
              >
                ✅ Approve
              </button>
              <button
                onClick={() => {
                  const reason = prompt('Enter rejection reason (optional):');
                  if (reason !== null) {
                    handleRejectRequestFromNotification(request, reason);
                  }
                }}
                className="flex-1 px-3 py-2 bg-red-600 text-white text-xs font-medium rounded-lg hover:bg-red-700 transition-colors"
              >
                ❌ Reject
              </button>
            </div>
          </div>
        ))
      )}
    </div>

    {/* Desktop Table View */}
    <div className="hidden lg:block overflow-x-auto bg-white rounded-lg border border-gray-200">
      <table className="w-full">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="text-left p-4 font-semibold text-gray-700 text-sm">Business Name</th>
            <th className="text-left p-4 font-semibold text-gray-700 text-sm">Owner Name</th>
            <th className="text-left p-4 font-semibold text-gray-700 text-sm">Email</th>
            <th className="text-left p-4 font-semibold text-gray-700 text-sm">Phone</th>
            <th className="text-left p-4 font-semibold text-gray-700 text-sm">Requested</th>
            <th className="text-left p-4 font-semibold text-gray-700 text-sm">Pending Since</th>
            <th className="text-left p-4 font-semibold text-gray-700 text-sm">Actions</th>
          </tr>
        </thead>
        <tbody>
          {pendingRequests.length === 0 ? (
            <tr>
              <td colSpan={7} className="p-8 text-center text-gray-500">
                <div className="flex flex-col items-center gap-2">
                  <Clock className="w-8 h-8 text-gray-400" />
                  <p className="font-medium">No Pending Requests</p>
                </div>
              </td>
            </tr>
          ) : (
            pendingRequests.map((request) => (
              <tr key={request.id} className="border-t hover:bg-yellow-50 transition-colors">
                <td className="p-4">
                  <div className="font-medium text-gray-800 text-sm">{request.businessName}</div>
                </td>
                <td className="p-4 text-gray-700 text-sm">{request.ownerName}</td>
                <td className="p-4">
                  <a 
                    href={`mailto:${request.email}`}
                    className="text-blue-600 hover:underline text-sm"
                  >
                    {request.email}
                  </a>
                </td>
                <td className="p-4 text-gray-600 text-sm">{request.phone || 'N/A'}</td>
                <td className="p-4 text-gray-600 text-sm">
                  {new Date(request.requestedAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </td>
                <td className="p-4">
                  <span className="text-sm font-medium text-yellow-700 bg-yellow-100 px-3 py-1 rounded-full">
                    {getTimeAgo(request.requestedAt)}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleApproveFromNotification(request)}
                      className="px-3 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
                    >
                      ✅ Approve
                    </button>
                    <button
                      onClick={() => {
                        const reason = prompt('Enter rejection reason (optional):');
                        if (reason !== null) {
                          handleRejectRequestFromNotification(request, reason);
                        }
                      }}
                      className="px-3 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors"
                    >
                      ❌ Reject
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  </div>
)}

{/* ═══════════════════════════════════════════════════════════════ */}
{/* ✅ REJECTED REQUESTS TAB - RESPONSIVE */}
{/* ═══════════════════════════════════════════════════════════════ */}

{activeTab === 'rejected-requests' && (
  <div className="space-y-4">
    <div className="bg-red-50 border border-red-200 rounded-lg p-3 sm:p-4">
      <h3 className="font-semibold text-red-800 mb-2 text-sm sm:text-base">❌ Rejected Seller Requests</h3>
      <p className="text-red-700 text-xs sm:text-sm">
        View all rejected seller registration requests and rejection reasons.
      </p>
    </div>

    {/* Mobile Card View */}
    <div className="block lg:hidden space-y-3">
      {rejectedRequests.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
          <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-500 font-medium">No Rejected Requests</p>
        </div>
      ) : (
        rejectedRequests.map((request) => (
          <div key={request.id} className="bg-white border border-red-200 rounded-lg p-4">
            <div className="mb-3">
              <h4 className="font-bold text-gray-800 text-sm mb-1">{request.businessName}</h4>
              <p className="text-xs text-gray-600 mb-1">{request.ownerName}</p>
              <a href={`mailto:${request.email}`} className="text-xs text-blue-600 hover:underline break-all">
                {request.email}
              </a>
            </div>
            
            <div className="space-y-2 text-xs text-gray-600 mb-3 pb-3 border-b">
              <div className="flex justify-between">
                <span>Requested:</span>
                <span className="font-medium">
                  {new Date(request.requestedAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric'
                  })}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Rejected:</span>
                <span className="font-medium">
                  {request.rejectedAt ? (
                    new Date(request.rejectedAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric'
                    })
                  ) : 'N/A'}
                </span>
              </div>
            </div>
            
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-xs font-medium text-red-800 mb-1">Rejection Reason:</p>
              <p className="text-xs text-red-700">{request.rejectionReason || 'No reason provided'}</p>
            </div>
          </div>
        ))
      )}
    </div>

    {/* Desktop Table View */}
    <div className="hidden lg:block overflow-x-auto bg-white rounded-lg border border-gray-200">
      <table className="w-full">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="text-left p-4 font-semibold text-gray-700 text-sm">Business Name</th>
            <th className="text-left p-4 font-semibold text-gray-700 text-sm">Owner Name</th>
            <th className="text-left p-4 font-semibold text-gray-700 text-sm">Email</th>
            <th className="text-left p-4 font-semibold text-gray-700 text-sm">Requested</th>
            <th className="text-left p-4 font-semibold text-gray-700 text-sm">Rejected</th>
            <th className="text-left p-4 font-semibold text-gray-700 text-sm">Rejection Reason</th>
          </tr>
        </thead>
        <tbody>
          {rejectedRequests.length === 0 ? (
            <tr>
              <td colSpan={6} className="p-8 text-center text-gray-500">
                <div className="flex flex-col items-center gap-2">
                  <AlertCircle className="w-8 h-8 text-gray-400" />
                  <p className="font-medium">No Rejected Requests</p>
                </div>
              </td>
            </tr>
          ) : (
            rejectedRequests.map((request) => (
              <tr key={request.id} className="border-t hover:bg-red-50 transition-colors">
                <td className="p-4">
                  <div className="font-medium text-gray-800 text-sm">{request.businessName}</div>
                </td>
                <td className="p-4 text-gray-700 text-sm">{request.ownerName}</td>
                <td className="p-4">
                  <a 
                    href={`mailto:${request.email}`}
                    className="text-blue-600 hover:underline text-sm"
                  >
                    {request.email}
                  </a>
                </td>
                <td className="p-4 text-gray-600 text-sm">
                  {new Date(request.requestedAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </td>
                <td className="p-4 text-gray-600 text-sm">
                  {request.rejectedAt ? (
                    new Date(request.rejectedAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })
                  ) : 'N/A'}
                </td>
                <td className="p-4">
                  <div className="max-w-xs">
                    <p className="text-sm text-red-700 bg-red-100 px-3 py-2 rounded-lg">
                      {request.rejectionReason || 'No reason provided'}
                    </p>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  </div>
)}

{/* ═══════════════════════════════════════════════════════════════ */}
{/* ✅ TILES ANALYTICS TAB - RESPONSIVE */}
{/* ═══════════════════════════════════════════════════════════════ */}

{activeTab === 'tiles-analytics' && (
  <div className="space-y-4 sm:space-y-6">
    <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-4 sm:p-6">
      <h3 className="text-lg sm:text-xl font-bold text-blue-800 mb-2">📱 Tiles Analytics & Performance</h3>
      <p className="text-blue-700 text-xs sm:text-sm">
        View all tiles uploaded by sellers, scan counts, and performance metrics.
      </p>
    </div>

    {/* Top 5 Most Scanned Tiles - Responsive Grid */}
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
      <div className="p-3 sm:p-4 bg-gradient-to-r from-yellow-50 to-orange-50 border-b">
        <h4 className="font-bold text-gray-800 flex items-center gap-2 text-sm sm:text-base">
          <Award className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600" />
          🏆 Top 5 Most Scanned Tiles
        </h4>
      </div>
      
      <div className="p-3 sm:p-4">
        {top5Tiles.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <TrendingDown className="w-8 h-8 sm:w-12 sm:h-12 mx-auto mb-2 text-gray-400" />
            <p className="text-sm">No tile scan data available</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-4">
            {top5Tiles.map((tile, index) => (
              <div 
                key={tile.id} 
                className="bg-gradient-to-br from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-3 sm:p-4 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xl sm:text-2xl font-bold text-yellow-600">#{index + 1}</span>
                  <Award className={`w-5 h-5 sm:w-6 sm:h-6 ${
                    index === 0 ? 'text-yellow-500' : 
                    index === 1 ? 'text-gray-400' : 
                    'text-orange-400'
                  }`} />
                </div>
                
                {tile.image_url && (
                  <img 
                    src={tile.image_url} 
                    alt={tile.tile_name}
                    className="w-full h-24 sm:h-32 object-cover rounded-lg mb-3"
                  />
                )}
                
                <h5 className="font-semibold text-gray-800 mb-1 truncate text-sm" title={tile.tile_name}>
                  {tile.tile_name}
                </h5>
                <p className="text-xs text-gray-600 mb-2 truncate" title={tile.tile_code}>
                  Code: {tile.tile_code}
                </p>
                <p className="text-xs text-gray-600 mb-3 truncate" title={tile.seller_name}>
                  Seller: {tile.seller_name}
                </p>
                
                <div className="bg-white rounded-lg p-2 text-center">
                  <p className="text-xl sm:text-2xl font-bold text-purple-600">{tile.scan_count}</p>
                  <p className="text-xs text-gray-600">Scans</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>

    {/* All Tiles - Mobile Cards / Desktop Table */}
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
      <div className="p-3 sm:p-4 bg-gray-50 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h4 className="font-semibold text-gray-800 text-sm sm:text-base">All Tiles ({tilesData.length})</h4>
        <button
          onClick={loadData}
          className="flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-xs sm:text-sm w-full sm:w-auto"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>
      
      {/* Mobile Card View */}
      <div className="block lg:hidden p-3 space-y-3">
        {tilesData.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <QrCode className="w-12 h-12 mx-auto mb-2 text-gray-400" />
            <p className="text-sm">No tiles found</p>
          </div>
        ) : (
          tilesData.map((tile) => (
            <div key={tile.id} className="bg-white border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow">
              <div className="flex gap-3 mb-3">
                {tile.image_url ? (
                  <img 
                    src={tile.image_url} 
                    alt={tile.tile_name}
                    className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg border border-gray-200 flex-shrink-0"
                  />
                ) : (
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <ImageIcon className="w-8 h-8 text-gray-400" />
                  </div>
                )}
                
                <div className="flex-1 min-w-0">
                  <h5 className="font-semibold text-gray-800 text-sm mb-1 truncate">{tile.tile_name}</h5>
                  <code className="text-xs bg-gray-100 px-2 py-1 rounded block mb-1 truncate">
                    {tile.tile_code}
                  </code>
                  <p className="text-xs text-gray-600 truncate">{tile.seller_name}</p>
                </div>
                
                <div className="flex flex-col items-end justify-between">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    tile.scan_count > 100 ? 'bg-green-100 text-green-800' :
                    tile.scan_count > 50 ? 'bg-blue-100 text-blue-800' :
                    tile.scan_count > 0 ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-600'
                  }`}>
                    {tile.scan_count}
                  </span>
                </div>
              </div>
              
              <div className="flex justify-between text-xs text-gray-600 pt-2 border-t">
                <span>Last Scanned: {tile.last_scanned 
                  ? new Date(tile.last_scanned).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                  : 'Never'}
                </span>
                <span>Created: {tile.created_at 
                  ? new Date(tile.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                  : 'N/A'}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="text-left p-4 font-semibold text-gray-700 text-sm">Image</th>
              <th className="text-left p-4 font-semibold text-gray-700 text-sm">Tile Code</th>
              <th className="text-left p-4 font-semibold text-gray-700 text-sm">Tile Name</th>
              <th className="text-left p-4 font-semibold text-gray-700 text-sm">Seller</th>
              <th className="text-center p-4 font-semibold text-gray-700 text-sm">Scans</th>
              <th className="text-left p-4 font-semibold text-gray-700 text-sm">Last Scanned</th>
              <th className="text-left p-4 font-semibold text-gray-700 text-sm">Created</th>
            </tr>
          </thead>
          <tbody>
            {tilesData.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-8 text-center text-gray-500">
                  <QrCode className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                  <p>No tiles found</p>
                </td>
              </tr>
            ) : (
              tilesData.map((tile) => (
                <tr key={tile.id} className="border-t hover:bg-gray-50 transition-colors">
                  <td className="p-4">
                    {tile.image_url ? (
                      <img 
                        src={tile.image_url} 
                        alt={tile.tile_name}
                        className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                        <ImageIcon className="w-6 h-6 text-gray-400" />
                      </div>
                    )}
                  </td>
                  <td className="p-4">
                    <code className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                      {tile.tile_code}
                    </code>
                  </td>
                  <td className="p-4">
                    <span className="font-medium text-gray-800 text-sm">{tile.tile_name}</span>
                  </td>
                  <td className="p-4 text-gray-700 text-sm">{tile.seller_name}</td>
                  <td className="p-4 text-center">
                    <span className={`px-3 py-1 rounded-full font-semibold text-sm ${
                      tile.scan_count > 100 ? 'bg-green-100 text-green-800' :
                      tile.scan_count > 50 ? 'bg-blue-100 text-blue-800' :
                      tile.scan_count > 0 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {tile.scan_count}
                    </span>
                  </td>
                  <td className="p-4 text-gray-600 text-sm">
                    {tile.last_scanned 
                      ? new Date(tile.last_scanned).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })
                      : 'Never'}
                  </td>
                  <td className="p-4 text-gray-600 text-sm">
                    {tile.created_at 
                      ? new Date(tile.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })
                      : 'N/A'}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  </div>
)}

{/* ═══════════════════════════════════════════════════════════════ */}
{/* ✅ SELLER ANALYTICS TAB - RESPONSIVE */}
{/* ═══════════════════════════════════════════════════════════════ */}

{activeTab === 'seller-analytics' && (
  <div className="space-y-4 sm:space-y-6">
    <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-xl p-4 sm:p-6">
      <h3 className="text-lg sm:text-xl font-bold text-purple-800 mb-2">📊 Seller Performance Analytics</h3>
      <p className="text-purple-700 text-xs sm:text-sm">
        View detailed analytics for each seller including tile uploads, customer engagement, 
        QR code scans, and daily activity patterns.
      </p>
    </div>

    {/* Sellers Analytics - Mobile Cards / Desktop Table */}
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
      <div className="p-3 sm:p-4 bg-gray-50 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h4 className="font-semibold text-gray-800 text-sm sm:text-base">All Sellers ({sellersAnalyticsList.length})</h4>
        <button
          onClick={loadData}
          className="flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-xs sm:text-sm w-full sm:w-auto"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>
      
      {/* Mobile Card View */}
      <div className="block lg:hidden p-3 space-y-3">
        {sellersAnalyticsList.length > 0 ? (
          sellersAnalyticsList.map((seller) => (
            <div key={seller.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <Store className="w-5 h-5 text-purple-600 flex-shrink-0" />
                  <div className="min-w-0">
                    <h4 className="font-bold text-gray-800 text-sm truncate">{seller.businessName}</h4>
                    <p className="text-xs text-gray-600 truncate">{seller.ownerName}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ml-2 ${
                  seller.isActive 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {seller.isActive ? '🟢 Active' : '🔴 Inactive'}
                </span>
              </div>
              
              <a href={`mailto:${seller.email}`} className="text-xs text-blue-600 hover:underline block mb-3 break-all">
                {seller.email}
              </a>
              
              <div className="space-y-2 text-xs mb-3 pb-3 border-b">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Tiles:</span>
                  <span className={`px-2 py-1 rounded-full font-semibold ${
                    seller.tileCount > 100 ? 'bg-green-100 text-green-800' :
                    seller.tileCount > 50 ? 'bg-blue-100 text-blue-800' :
                    seller.tileCount > 0 ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-600'
                  }`}>
                    {seller.tileCount}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Last Login:</span>
                  <span className="font-medium text-gray-800">
                    {seller.lastLogin 
                      ? new Date(seller.lastLogin).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })
                      : 'Never'}
                  </span>
                </div>
              </div>
              
              <button
                onClick={() => {
                  setSelectedSellerForAnalytics(seller);
                  setShowAnalyticsModal(true);
                }}
                className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium text-sm flex items-center justify-center gap-2"
              >
                <Eye className="w-4 h-4" />
                View Analytics
              </button>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Package className="w-12 h-12 mx-auto mb-2 text-gray-400" />
            <p className="text-sm">No sellers found</p>
          </div>
        )}
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="text-left p-4 font-semibold text-gray-700 text-sm">Business Name</th>
              <th className="text-left p-4 font-semibold text-gray-700 text-sm">Owner</th>
              <th className="text-left p-4 font-semibold text-gray-700 text-sm">Email</th>
              <th className="text-center p-4 font-semibold text-gray-700 text-sm">Total Tiles</th>
              <th className="text-center p-4 font-semibold text-gray-700 text-sm">Status</th>
              <th className="text-left p-4 font-semibold text-gray-700 text-sm">Last Login</th>
              <th className="text-center p-4 font-semibold text-gray-700 text-sm">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sellersAnalyticsList.length > 0 ? (
              sellersAnalyticsList.map((seller) => (
                <tr key={seller.id} className="border-t hover:bg-gray-50 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <Store className="w-5 h-5 text-purple-600" />
                      <span className="font-medium text-gray-800 text-sm">{seller.businessName}</span>
                    </div>
                  </td>
                  <td className="p-4 text-gray-700 text-sm">{seller.ownerName}</td>
                  <td className="p-4">
                    <a 
                      href={`mailto:${seller.email}`}
                      className="text-blue-600 hover:underline text-sm"
                    >
                      {seller.email}
                    </a>
                  </td>
                  <td className="p-4 text-center">
                    <span className={`px-3 py-1 rounded-full font-semibold text-sm ${
                      seller.tileCount > 100 ? 'bg-green-100 text-green-800' :
                      seller.tileCount > 50 ? 'bg-blue-100 text-blue-800' :
                      seller.tileCount > 0 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {seller.tileCount}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      seller.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {seller.isActive ? '🟢 Active' : '🔴 Inactive'}
                    </span>
                  </td>
                  <td className="p-4 text-gray-600 text-sm">
                    {seller.lastLogin 
                      ? new Date(seller.lastLogin).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })
                      : 'Never'}
                  </td>
                  <td className="p-4 text-center">
                    <button
                      onClick={() => {
                        setSelectedSellerForAnalytics(seller);
                        setShowAnalyticsModal(true);
                      }}
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium text-sm flex items-center gap-2 mx-auto"
                    >
                      <Eye className="w-4 h-4" />
                      View Analytics
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="p-8 text-center text-gray-500">
                  No sellers found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  </div>
)}

{/* Continue to Part 4 for remaining tabs (Sellers, Analytics, Create Seller, Account Access, Email Config, Modals)... */}

{/* ═══════════════════════════════════════════════════════════════ */}
{/* ✅ SELLERS TAB - RESPONSIVE */}
{/* ═══════════════════════════════════════════════════════════════ */}

{activeTab === 'sellers' && (
  <div className="space-y-4">
    {/* Search & Filter - Responsive */}
    <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-3 sm:p-4 rounded-lg border border-gray-200">
      <div className="flex flex-col gap-3 sm:gap-4">
        {/* Search Bar */}
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by business, owner, email, or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 sm:pl-10 pr-10 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm sm:text-base"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            )}
          </div>
        </div>
        
        {/* Filter Buttons - Responsive Grid */}
        <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-3 py-2 rounded-lg font-medium transition-colors text-xs sm:text-sm ${
              filterStatus === 'all'
                ? 'bg-purple-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            All ({sellers.length})
          </button>
          <button
            onClick={() => setFilterStatus('approved')}
            className={`px-3 py-2 rounded-lg font-medium transition-colors text-xs sm:text-sm ${
              filterStatus === 'approved'
                ? 'bg-green-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            ✅ Approved
          </button>
          <button
            onClick={() => setFilterStatus('active')}
            className={`px-3 py-2 rounded-lg font-medium transition-colors text-xs sm:text-sm ${
              filterStatus === 'active'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            🟢 Active
          </button>
          <button
            onClick={() => setFilterStatus('deleted')}
            className={`px-3 py-2 rounded-lg font-medium transition-colors text-xs sm:text-sm ${
              filterStatus === 'deleted'
                ? 'bg-gray-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            🗑️ Deleted
          </button>
        </div>
      </div>
      
      <div className="mt-3 text-xs sm:text-sm text-gray-600">
        Showing {filteredSellers.length} of {sellers.length} sellers
      </div>
    </div>

    {/* Mobile Card View */}
    <div className="block lg:hidden space-y-3">
      {filteredSellers.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
          <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-500 font-medium">No sellers found</p>
        </div>
      ) : (
        filteredSellers.map((seller) => (
          <div 
            key={seller.id} 
            className={`bg-white border rounded-lg p-4 hover:shadow-md transition-shadow ${
              seller.deleted ? 'opacity-60 border-gray-300' : 'border-gray-200'
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1 min-w-0">
                <h4 className={`font-bold text-gray-800 text-sm mb-1 ${seller.deleted ? 'line-through' : ''}`}>
                  {seller.businessName}
                </h4>
                <p className="text-xs text-gray-600 truncate">{seller.ownerName}</p>
              </div>
              <div className="flex flex-col gap-1 ml-2">
                <span className={`px-2 py-1 rounded-full text-[10px] font-medium whitespace-nowrap ${
                  seller.requestStatus === 'approved' ? 'bg-green-100 text-green-800' :
                  seller.requestStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  seller.requestStatus === 'rejected' ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {seller.requestStatus === 'approved' && '✅'}
                  {seller.requestStatus === 'pending' && '⏳'}
                  {seller.requestStatus === 'rejected' && '❌'}
                  {!seller.requestStatus && '?'}
                </span>
                <span className={`px-2 py-1 rounded-full text-[10px] font-medium whitespace-nowrap ${
                  seller.deleted ? 'bg-gray-100 text-gray-800' :
                  seller.isActive ? 'bg-green-100 text-green-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {seller.deleted ? '🗑️' : seller.isActive ? '🟢' : '🔴'}
                </span>
              </div>
            </div>
            
            <a href={`mailto:${seller.email}`} className="text-xs text-blue-600 hover:underline block mb-2 break-all">
              {seller.email}
            </a>
            
            <p className="text-xs text-gray-600 mb-3">{seller.phone || 'No phone'}</p>
            
            {!seller.deleted && (
              <div className="flex gap-2 pt-3 border-t">
                <button
                  onClick={() => handlePasswordReset(seller)}
                  disabled={processingAction === seller.id}
                  className="flex-1 flex items-center justify-center gap-1 p-2 text-orange-600 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors disabled:opacity-50 text-xs"
                  title="Send Password Reset"
                >
                  {processingAction === seller.id ? (
                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-orange-600"></div>
                  ) : (
                    <>
                      <Key className="w-3 h-3" />
                      <span className="hidden sm:inline">Reset</span>
                    </>
                  )}
                </button>
                
                <button
                  onClick={() => handleViewDetails(seller)}
                  className="flex-1 flex items-center justify-center gap-1 p-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors text-xs"
                  title="View Details"
                >
                  <Eye className="w-3 h-3" />
                  <span className="hidden sm:inline">Details</span>
                </button>
                
                <button
                  onClick={() => handleDeleteSeller(seller)}
                  disabled={processingAction === seller.id}
                  className="flex-1 flex items-center justify-center gap-1 p-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50 text-xs"
                  title="Delete Account"
                >
                  {processingAction === seller.id ? (
                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-red-600"></div>
                  ) : (
                    <>
                      <Trash2 className="w-3 h-3" />
                      <span className="hidden sm:inline">Delete</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        ))
      )}
    </div>

    {/* Desktop Table View */}
    <div className="hidden lg:block overflow-x-auto bg-white rounded-lg border border-gray-200">
      <table className="w-full">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="text-left p-4 font-semibold text-gray-700 text-sm">Business Name</th>
            <th className="text-left p-4 font-semibold text-gray-700 text-sm">Owner</th>
            <th className="text-left p-4 font-semibold text-gray-700 text-sm">Email</th>
            <th className="text-left p-4 font-semibold text-gray-700 text-sm">Phone</th>
            <th className="text-left p-4 font-semibold text-gray-700 text-sm">Status</th>
            <th className="text-left p-4 font-semibold text-gray-700 text-sm">Account</th>
            <th className="text-left p-4 font-semibold text-gray-700 text-sm">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredSellers.length === 0 ? (
            <tr>
              <td colSpan={7} className="p-8 text-center text-gray-500">
                <div className="flex flex-col items-center gap-2">
                  <AlertCircle className="w-8 h-8 text-gray-400" />
                  <p className="font-medium">No sellers found</p>
                </div>
              </td>
            </tr>
          ) : (
            filteredSellers.map((seller) => (
              <tr 
                key={seller.id} 
                className={`border-t border-gray-100 hover:bg-gray-50 transition-colors ${
                  seller.deleted ? 'opacity-60 bg-gray-50' : ''
                }`}
              >
                <td className="p-4">
                  <div className={`font-medium text-gray-800 text-sm ${seller.deleted ? 'line-through' : ''}`}>
                    {seller.businessName}
                  </div>
                </td>
                <td className="p-4 text-gray-700 text-sm">{seller.ownerName}</td>
                <td className="p-4">
                  <a 
                    href={`mailto:${seller.email}`}
                    className="text-blue-600 hover:underline text-sm"
                  >
                    {seller.email}
                  </a>
                </td>
                <td className="p-4 text-gray-600 text-sm">{seller.phone || 'N/A'}</td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    seller.requestStatus === 'approved' ? 'bg-green-100 text-green-800' :
                    seller.requestStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    seller.requestStatus === 'rejected' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {seller.requestStatus === 'approved' && '✅ Approved'}
                    {seller.requestStatus === 'pending' && '⏳ Pending'}
                    {seller.requestStatus === 'rejected' && '❌ Rejected'}
                    {!seller.requestStatus && 'Unknown'}
                  </span>
                </td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    seller.deleted ? 'bg-gray-100 text-gray-800' :
                    seller.isActive ? 'bg-green-100 text-green-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {seller.deleted && '🗑️ Deleted'}
                    {!seller.deleted && seller.isActive && '🟢 Active'}
                    {!seller.deleted && !seller.isActive && '🔴 Inactive'}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex gap-2">
                    {!seller.deleted && (
                      <>
                        <button
                          onClick={() => handlePasswordReset(seller)}
                          disabled={processingAction === seller.id}
                          className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors disabled:opacity-50"
                          title="Send Password Reset Link"
                        >
                          {processingAction === seller.id ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-600"></div>
                          ) : (
                            <Key className="w-4 h-4" />
                          )}
                        </button>
                        
                        <button
                          onClick={() => handleViewDetails(seller)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        
                        <button
                          onClick={() => handleDeleteSeller(seller)}
                          disabled={processingAction === seller.id}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                          title="Delete Account"
                        >
                          {processingAction === seller.id ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>

    {/* Footer - Responsive */}
    <div className="flex flex-col sm:flex-row justify-between items-center p-3 sm:p-4 bg-gray-50 rounded-lg border border-gray-200 gap-3">
      <div className="text-xs sm:text-sm text-gray-600">
        Total: {filteredSellers.length} seller{filteredSellers.length !== 1 ? 's' : ''}
      </div>
      <button
        onClick={loadData}
        className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
      >
        <RefreshCw className="w-4 h-4" />
        Refresh Data
      </button>
    </div>
  </div>
)}

{/* ═══════════════════════════════════════════════════════════════ */}
{/* ✅ ANALYTICS TAB - RESPONSIVE */}
{/* ═══════════════════════════════════════════════════════════════ */}

{activeTab === 'analytics' && (
  <div className="space-y-4">
    <h3 className="text-base sm:text-lg font-semibold text-gray-800">📊 Platform Analytics</h3>
    
    {/* Mobile Card View */}
    <div className="block lg:hidden space-y-3">
      {analytics.map((item) => {
        const conversion = item.view_count > 0 ? ((item.apply_count / item.view_count) * 100).toFixed(1) : '0';
        return (
          <div key={item.tile_id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <h4 className="font-semibold text-gray-800 text-sm mb-2">{item.tile_name}</h4>
            <p className="text-xs text-gray-600 mb-3">{item.tile_sellers?.business_name || 'Unknown Seller'}</p>
            
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div className="bg-blue-50 rounded-lg p-2 text-center">
                <p className="text-xs text-gray-600 mb-1">Views</p>
                <p className="text-lg font-bold text-blue-600">{item.view_count || 0}</p>
              </div>
              <div className="bg-green-50 rounded-lg p-2 text-center">
                <p className="text-xs text-gray-600 mb-1">Applications</p>
                <p className="text-lg font-bold text-green-600">{item.apply_count || 0}</p>
              </div>
            </div>
            
            <div className="flex justify-between items-center pt-3 border-t">
              <span className="text-xs text-gray-600">Conversion Rate</span>
              <span className={`text-sm font-bold ${
                parseFloat(conversion) > 10 ? 'text-green-600' :
                parseFloat(conversion) > 5 ? 'text-yellow-600' :
                'text-red-600'
              }`}>
                {conversion}%
              </span>
            </div>
            
            {item.last_viewed && (
              <p className="text-xs text-gray-500 mt-2">
                Last viewed: {new Date(item.last_viewed).toLocaleDateString()}
              </p>
            )}
          </div>
        );
      })}
    </div>

    {/* Desktop Table View */}
    <div className="hidden lg:block overflow-x-auto bg-white rounded-lg border border-gray-200">
      <table className="w-full">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="text-left p-3 font-semibold text-gray-700 text-sm">Tile Name</th>
            <th className="text-left p-3 font-semibold text-gray-700 text-sm">Seller</th>
            <th className="text-left p-3 font-semibold text-gray-700 text-sm">Views</th>
            <th className="text-left p-3 font-semibold text-gray-700 text-sm">Applications</th>
            <th className="text-left p-3 font-semibold text-gray-700 text-sm">Conversion</th>
            <th className="text-left p-3 font-semibold text-gray-700 text-sm">Last Activity</th>
          </tr>
        </thead>
        <tbody>
          {analytics.map((item) => {
            const conversion = item.view_count > 0 ? ((item.apply_count / item.view_count) * 100).toFixed(1) : '0';
            return (
              <tr key={item.tile_id} className="border-t hover:bg-gray-50">
                <td className="p-3 font-medium text-sm">{item.tile_name}</td>
                <td className="p-3 text-gray-600 text-sm">{item.tile_sellers?.business_name || 'Unknown'}</td>
                <td className="p-3 text-sm">{item.view_count || 0}</td>
                <td className="p-3 text-sm">{item.apply_count || 0}</td>
                <td className="p-3">
                  <span className={`font-medium text-sm ${
                    parseFloat(conversion) > 10 ? 'text-green-600' :
                    parseFloat(conversion) > 5 ? 'text-yellow-600' :
                    'text-red-600'
                  }`}>
                    {conversion}%
                  </span>
                </td>
                <td className="p-3 text-gray-600 text-sm">
                  {item.last_viewed ? new Date(item.last_viewed).toLocaleDateString() : 'N/A'}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  </div>
)}

{/* ═══════════════════════════════════════════════════════════════ */}
{/* ✅ CREATE SELLER TAB - RESPONSIVE FORM */}
{/* ═══════════════════════════════════════════════════════════════ */}

{activeTab === 'create-seller' && (
  <div className="space-y-4 sm:space-y-6">
    {selectedRequest ? (
      <div className="bg-green-50 border border-green-200 rounded-lg p-3 sm:p-4">
        <div className="flex items-center gap-2 mb-2">
          <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 flex-shrink-0" />
          <h3 className="font-semibold text-green-800 text-sm sm:text-base">Auto Pre-filled from Approved Request</h3>
        </div>
        <p className="text-green-700 text-xs sm:text-sm">
          <strong>{selectedRequest.businessName}</strong> request has been approved. 
          The form below is pre-filled with their information.
        </p>
      </div>
    ) : (
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 sm:p-4">
        <h3 className="font-semibold text-purple-800 mb-2 text-sm sm:text-base">Create New Seller Account</h3>
        <p className="text-purple-700 text-xs sm:text-sm">
          Only administrators can create new seller accounts.
        </p>
      </div>
    )}

    {!emailServiceStatus?.configured && (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 sm:p-4">
        <div className="flex items-center gap-2 mb-2">
          <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600 flex-shrink-0" />
          <h4 className="font-medium text-yellow-800 text-sm sm:text-base">Email Service Not Configured</h4>
        </div>
        <p className="text-yellow-700 text-xs sm:text-sm">
          Account creation will work, but credentials will need to be shared manually.
        </p>
      </div>
    )}
    
    {/* Responsive Form */}
    <form onSubmit={handleCreateSeller} className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Email */}
        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Email Address *</label>
          <input
            type="email"
            placeholder="seller@business.com"
            value={newSeller.email}
            onChange={(e) => setNewSeller({ ...newSeller, email: e.target.value })}
            className={`w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-sm sm:text-base ${selectedRequest ? 'bg-green-50' : ''}`}
            required
            readOnly={!!selectedRequest}
          />
        </div>

        {/* Password */}
        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Password</label>
          <input
            type="text"
            placeholder="Auto-generated secure password"
            value={newSeller.password}
            onChange={(e) => setNewSeller({ ...newSeller, password: e.target.value })}
            className={`w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-sm sm:text-base ${selectedRequest ? 'bg-green-50' : ''}`}
            readOnly={!!selectedRequest}
          />
          <p className="text-[10px] sm:text-xs text-gray-500 mt-1">Leave empty for auto-generated password</p>
        </div>

        {/* Full Name */}
        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Full Name *</label>
          <input
            type="text"
            placeholder="Owner Full Name"
            value={newSeller.fullName}
            onChange={(e) => setNewSeller({ ...newSeller, fullName: e.target.value })}
            className={`w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-sm sm:text-base ${selectedRequest ? 'bg-green-50' : ''}`}
            required
            readOnly={!!selectedRequest}
          />
        </div>

        {/* Business Name */}
        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Business Name *</label>
          <input
            type="text"
            placeholder="Business Name"
            value={newSeller.businessName}
            onChange={(e) => setNewSeller({ ...newSeller, businessName: e.target.value })}
            className={`w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-sm sm:text-base ${selectedRequest ? 'bg-green-50' : ''}`}
            required
            readOnly={!!selectedRequest}
          />
        </div>

        {/* Business Address */}
        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Business Address</label>
          <input
            type="text"
            placeholder="Complete Business Address"
            value={newSeller.businessAddress}
            onChange={(e) => setNewSeller({ ...newSeller, businessAddress: e.target.value })}
            className={`w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-sm sm:text-base ${selectedRequest ? 'bg-green-50' : ''}`}
            readOnly={!!selectedRequest}
          />
        </div>

        {/* Phone */}
        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Phone Number</label>
          <input
            type="tel"
            placeholder="+91 9876543210"
            value={newSeller.phone}
            onChange={(e) => setNewSeller({ ...newSeller, phone: e.target.value })}
            className={`w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-sm sm:text-base ${selectedRequest ? 'bg-green-50' : ''}`}
            readOnly={!!selectedRequest}
          />
        </div>

        {/* Website */}
        <div className="md:col-span-2">
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Website (Optional)</label>
          <input
            type="url"
            placeholder="https://business-website.com"
            value={newSeller.website}
            onChange={(e) => setNewSeller({ ...newSeller, website: e.target.value })}
            className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
          />
        </div>
      </div>
      
      {/* Submit Button */}
      <button
        type="submit"
        disabled={creating}
        className={`w-full py-3 sm:py-4 rounded-lg font-medium text-sm sm:text-lg transition-colors ${
          selectedRequest 
            ? 'bg-green-600 hover:bg-green-700 text-white' 
            : 'bg-purple-600 hover:bg-purple-700 text-white'
        } disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        {creating ? (
          <div className="flex items-center justify-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-white"></div>
            Creating Account...
          </div>
        ) : selectedRequest ? (
          '✅ Create Seller Account (Pre-filled)'
        ) : (
          'Create Seller Account'
        )}
      </button>

      {/* Info Footer */}
      <div className="text-center text-xs sm:text-sm text-gray-600 space-y-1">
        <p>📧 Email delivery: {emailServiceStatus?.configured ? '✅ Automatic' : '⚠️ Manual required'}</p>
        <p>🔐 Password: Auto-generated secure credentials</p>
      </div>
    </form>
  </div>
)}

{/* ═══════════════════════════════════════════════════════════════ */}
{/* ✅ ACCOUNT ACCESS TAB - RESPONSIVE */}
{/* ═══════════════════════════════════════════════════════════════ */}

{activeTab === 'account-access' && (
  <div className="space-y-4">
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
      <h3 className="font-semibold text-blue-800 mb-2 text-sm sm:text-base">🔑 Account Access Management</h3>
      <p className="text-blue-700 text-xs sm:text-sm">
        Manage seller accounts, send password reset links, and view communication history.
      </p>
    </div>

    {/* Search Bar */}
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
      <input
        type="text"
        placeholder="Search sellers..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full pl-9 sm:pl-10 pr-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
      />
    </div>

    {/* Mobile Card View */}
    <div className="block lg:hidden space-y-3">
      {searchSellers(sellers, searchQuery)
        .filter(s => !s.deleted)
        .map((seller) => (
          <div key={seller.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-gray-800 text-sm mb-1 truncate">{seller.businessName}</h4>
                <p className="text-xs text-gray-600 truncate">{seller.ownerName}</p>
              </div>
              <span className={`px-2 py-1 rounded-full text-[10px] font-medium whitespace-nowrap ml-2 ${
                seller.isActive 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {seller.isActive ? '🟢' : '🔴'}
              </span>
            </div>
            
            <a href={`mailto:${seller.email}`} className="text-xs text-blue-600 hover:underline block mb-2 break-all">
              {seller.email}
            </a>
            
            <div className="space-y-1 text-xs text-gray-600 mb-3 pb-3 border-b">
              <div className="flex justify-between">
                <span>Created:</span>
                <span className="font-medium">
                  {new Date(seller.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Last Login:</span>
                <span className="font-medium">
                  {seller.lastLogin 
                    ? new Date(seller.lastLogin).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric'
                      })
                    : 'Never'}
                </span>
              </div>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={() => handlePasswordReset(seller)}
                disabled={processingAction === seller.id}
                className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-orange-600 text-white text-xs font-medium rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50"
              >
                {processingAction === seller.id ? (
                  <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                ) : (
                  <>
                    <Key className="w-3 h-3" />
                    Reset
                  </>
                )}
              </button>
              
              <button
                onClick={() => handleViewDetails(seller)}
                className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-blue-600 text-white text-xs font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Eye className="w-3 h-3" />
                Details
              </button>
            </div>
          </div>
        ))}
    </div>

    {/* Desktop Table View */}
    <div className="hidden lg:block overflow-x-auto bg-white rounded-lg border border-gray-200">
      <table className="w-full">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="text-left p-4 font-semibold text-gray-700 text-sm">Business Name</th>
            <th className="text-left p-4 font-semibold text-gray-700 text-sm">Owner</th>
            <th className="text-left p-4 font-semibold text-gray-700 text-sm">Email</th>
            <th className="text-left p-4 font-semibold text-gray-700 text-sm">Created</th>
            <th className="text-left p-4 font-semibold text-gray-700 text-sm">Last Login</th>
            <th className="text-left p-4 font-semibold text-gray-700 text-sm">Status</th>
            <th className="text-left p-4 font-semibold text-gray-700 text-sm">Actions</th>
          </tr>
        </thead>
        <tbody>
          {searchSellers(sellers, searchQuery)
            .filter(s => !s.deleted)
            .map((seller) => (
              <tr key={seller.id} className="border-t border-gray-100 hover:bg-gray-50">
                <td className="p-4 font-medium text-gray-800 text-sm">{seller.businessName}</td>
                <td className="p-4 text-gray-700 text-sm">{seller.ownerName}</td>
                <td className="p-4">
                  <a href={`mailto:${seller.email}`} className="text-blue-600 hover:underline text-sm">
                    {seller.email}
                  </a>
                </td>
                <td className="p-4 text-gray-600 text-sm">
                  {new Date(seller.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </td>
                <td className="p-4 text-gray-600 text-sm">
                  {seller.lastLogin 
                    ? new Date(seller.lastLogin).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })
                    : 'Never'}
                </td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    seller.isActive 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {seller.isActive ? '🟢 Active' : '🔴 Inactive'}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handlePasswordReset(seller)}
                      disabled={processingAction === seller.id}
                      className="flex items-center gap-1 px-3 py-2 bg-orange-600 text-white text-sm rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50"
                    >
                      {processingAction === seller.id ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      ) : (
                        <>
                          <Key className="w-4 h-4" />
                          Reset
                        </>
                      )}
                    </button>
                    
                    <button
                      onClick={() => handleViewDetails(seller)}
                      className="flex items-center gap-1 px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                      Details
                    </button>
                  </div>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  </div>
)}

{/* ═══════════════════════════════════════════════════════════════ */}
{/* ✅ EMAIL CONFIG TAB - RESPONSIVE */}
{/* ═══════════════════════════════════════════════════════════════ */}

{activeTab === 'email-config' && (
  <div className="space-y-4 sm:space-y-6">
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
      <h3 className="font-semibold text-blue-800 mb-2 text-sm sm:text-base">📧 Email Service Configuration</h3>
      <p className="text-blue-700 text-xs sm:text-sm">
        Manage EmailJS integration for automated seller credential delivery.
      </p>
    </div>

    {/* Status Card - Responsive */}
    <div className={`p-3 sm:p-4 rounded-lg border ${
      emailServiceStatus?.configured 
        ? 'bg-green-50 border-green-200' 
        : 'bg-red-50 border-red-200'
    }`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 gap-3">
        <h4 className={`font-medium text-sm sm:text-base ${
          emailServiceStatus?.configured ? 'text-green-800' : 'text-red-800'
        }`}>
          Service Status: {emailServiceStatus?.configured ? '✅ Ready' : '❌ Configuration Required'}
        </h4>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={checkEmailService}
            className="flex-1 sm:flex-none px-3 py-2 bg-blue-600 text-white text-xs sm:text-sm rounded hover:bg-blue-700 whitespace-nowrap"
          >
            Refresh Status
          </button>
          <button
            onClick={handleTestEmail}
            disabled={testingEmail || !emailServiceStatus?.configured}
            className="flex-1 sm:flex-none px-3 py-2 bg-green-600 text-white text-xs sm:text-sm rounded hover:bg-green-700 disabled:opacity-50 whitespace-nowrap"
          >
            {testingEmail ? 'Testing...' : 'Test Email'}
          </button>
          <button
            onClick={copyEmailConfig}
            className="px-3 py-2 bg-gray-600 text-white text-xs sm:text-sm rounded hover:bg-gray-700"
          >
            <Copy className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      <div className="text-xs sm:text-sm">
        <p className={emailServiceStatus?.configured ? 'text-green-700' : 'text-red-700'}>
          {emailServiceStatus?.message}
        </p>
        
        {emailServiceStatus?.details && (
          <div className="mt-3 p-3 bg-white rounded border">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[10px] sm:text-xs">
              <div>
                <strong>Service ID:</strong> {emailServiceStatus.details.serviceId}
              </div>
              <div>
                <strong>Template ID:</strong> {emailServiceStatus.details.templateId}
              </div>
              <div>
                <strong>Public Key:</strong> {emailServiceStatus.details.publicKey}
              </div>
              <div>
                <strong>Environment:</strong> {emailServiceStatus.details.environment}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>

    {/* Configuration Guide - Responsive */}
    <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
      <h4 className="font-medium text-gray-800 mb-3 text-sm sm:text-base">📖 Configuration Guide</h4>
      <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm text-gray-700">
        <div>
          <strong>Step 1:</strong> Create account at{' '}
          <a href="https://dashboard.emailjs.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline break-all">
            EmailJS Dashboard
          </a>
        </div>
        <div>
          <strong>Step 2:</strong> Create email service (Gmail, Outlook, etc.)
        </div>
        <div>
          <strong>Step 3:</strong> Create email template with required variables
        </div>
        <div>
          <strong>Step 4:</strong> Update .env file with your configuration
        </div>
        <div>
          <strong>Step 5:</strong> Test email delivery using button above
        </div>
      </div>
    </div>
  </div>
)}

{/* ═══════════════════════════════════════════════════════════════ */}
{/* ✅ MODALS - ALL RESPONSIVE */}
{/* ═══════════════════════════════════════════════════════════════ */}

{/* SELLER ANALYTICS MODAL - Responsive */}
{showAnalyticsModal && selectedSellerForAnalytics && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div className="w-full max-w-6xl">
      <SellerAnalytics
        sellerId={selectedSellerForAnalytics.id}
        sellerName={selectedSellerForAnalytics.businessName}
        onClose={() => {
          setShowAnalyticsModal(false);
          setSelectedSellerForAnalytics(null);
        }}
      />
    </div>
  </div>
)}

{/* SELLER DETAILS MODAL - Responsive */}
{showDetailsModal && selectedSeller && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
      {/* Sticky Header */}
      <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4 sm:p-6 rounded-t-xl z-10">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0 mr-4">
            <h3 className="text-lg sm:text-2xl font-bold truncate">{selectedSeller.businessName}</h3>
            <p className="text-purple-100 text-xs sm:text-sm truncate">{selectedSeller.ownerName}</p>
          </div>
          <button
            onClick={() => {
              setShowDetailsModal(false);
              setSelectedSeller(null);
              setCommunicationHistory([]);
            }}
            className="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-2 transition-colors flex-shrink-0"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>
      </div>

      <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
        {/* Business Information */}
        <div>
          <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2 text-sm sm:text-base">
            <Store className="w-4 h-4 sm:w-5 sm:h-5" />
            Business Information
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 bg-gray-50 p-3 sm:p-4 rounded-lg">
            <div>
              <p className="text-xs sm:text-sm text-gray-600">Email</p>
              <p className="font-medium text-gray-800 text-sm sm:text-base break-all">{selectedSeller.email}</p>
            </div>
            <div>
              <p className="text-xs sm:text-sm text-gray-600">Phone</p>
              <p className="font-medium text-gray-800 text-sm sm:text-base">{selectedSeller.phone || 'N/A'}</p>
            </div>
            <div className="sm:col-span-2">
              <p className="text-xs sm:text-sm text-gray-600">Address</p>
              <p className="font-medium text-gray-800 text-sm sm:text-base">{selectedSeller.businessAddress || 'N/A'}</p>
            </div>
          </div>
        </div>

        {/* Account Information */}
        <div>
          <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2 text-sm sm:text-base">
            <Settings className="w-4 h-4 sm:w-5 sm:h-5" />
            Account Information
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 bg-gray-50 p-3 sm:p-4 rounded-lg">
            <div>
              <p className="text-xs sm:text-sm text-gray-600">Created</p>
              <p className="font-medium text-gray-800 text-sm sm:text-base">
                {new Date(selectedSeller.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
            <div>
              <p className="text-xs sm:text-sm text-gray-600">Last Login</p>
              <p className="font-medium text-gray-800 text-sm sm:text-base">
                {selectedSeller.lastLogin 
                  ? new Date(selectedSeller.lastLogin).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })
                  : 'Never'}
              </p>
            </div>
            <div>
              <p className="text-xs sm:text-sm text-gray-600">Account Status</p>
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                selectedSeller.isActive 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {selectedSeller.isActive ? '🟢 Active' : '🔴 Inactive'}
              </span>
            </div>
          </div>
        </div>

        {/* Communication History */}
        <div>
          <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2 text-sm sm:text-base">
            <Mail className="w-4 h-4 sm:w-5 sm:h-5" />
            Communication History
          </h4>
          {communicationHistory.length === 0 ? (
            <div className="bg-gray-50 p-4 rounded-lg text-center text-gray-500 text-sm">
              <p>No communication history found</p>
            </div>
          ) : (
            <div className="space-y-2">
              {communicationHistory.map((comm, index) => (
                <div key={index} className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <span className={`w-2 h-2 rounded-full flex-shrink-0 ${
                        comm.status === 'sent' ? 'bg-green-500' : 'bg-red-500'
                      }`}></span>
                      <span className="font-medium text-gray-800 text-xs sm:text-sm truncate">
                        {comm.subject || comm.communication_type}
                      </span>
                    </div>
                    <span className="text-[10px] sm:text-xs text-gray-500">
                      {new Date(comm.sent_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Actions - Responsive Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
          <button
            onClick={() => handlePasswordReset(selectedSeller)}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm sm:text-base"
          >
            <Key className="w-4 h-4 sm:w-5 sm:h-5" />
            Send Password Reset
          </button>
          <button
            onClick={() => {
              setShowDetailsModal(false);
              setSelectedSeller(null);
            }}
            className="flex-1 px-4 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors text-sm sm:text-base"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
)}

    </div>
  );
};
