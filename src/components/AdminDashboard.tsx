
import React, { useState, useEffect } from 'react';
import { 
  Shield, Users, Store, BarChart3, TrendingUp, Eye, CheckCircle, 
  AlertCircle, Mail, Copy, Key, Trash2, Search, Filter, RefreshCw,
  UserX, Clock, Calendar, Activity, Download, Settings, Package,
  QrCode, Image as ImageIcon, Award, TrendingDown
} from 'lucide-react';
import { useAppStore } from '../stores/appStore';
import { 
  getAllSellers, 
  getAllAnalytics, 
  getAdminDashboardStats,
  getSellersWithFullData,
  filterSellers,
  searchSellers,
  sendPasswordResetToSeller,
  softDeleteSellerAccount,
  getSellerCommunications,
  getAdminLogs,
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
  deleteDoc,
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
// ✅ TYPE DEFINITIONS
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
// ✅ MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════

export const AdminDashboard: React.FC = () => {
  const { currentUser } = useAppStore();
  
  // ✅ TAB & DATA MANAGEMENT STATES
  const [activeTab, setActiveTab] = useState<'overview' | 'sellers' | 'analytics' | 'create-seller' | 'email-config' | 'account-access' | 'logs' | 'seller-analytics' | 'pending-requests' | 'rejected-requests' | 'tiles-analytics'>('overview');
  const [sellers, setSellers] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // ✅ REQUESTS & TILES DATA
  const [pendingRequests, setPendingRequests] = useState<SellerRequest[]>([]);
  const [rejectedRequests, setRejectedRequests] = useState<SellerRequest[]>([]);
  const [tilesData, setTilesData] = useState<TileData[]>([]);
  const [top5Tiles, setTop5Tiles] = useState<TileData[]>([]);
  
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

  const [loadingAnalytics, setLoadingAnalytics] = useState(false);
  const [sellerAnalytics, setSellerAnalytics] = useState<any>(null);
  const [analyticsError, setAnalyticsError] = useState<string | null>(null);
  
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
  const [adminLogs, setAdminLogs] = useState<any[]>([]);

  // ✅ SELLER ANALYTICS STATES
  const [sellersAnalyticsList, setSellersAnalyticsList] = useState<any[]>([]);
  const [selectedSellerForAnalytics, setSelectedSellerForAnalytics] = useState<any>(null);
  const [showAnalyticsModal, setShowAnalyticsModal] = useState(false);
  const [approvedSellers, setApprovedSellers] = useState<any[]>([]);


  // ═══════════════════════════════════════════════════════════════
  // ✅ LOAD DATA ON MOUNT
  // ═══════════════════════════════════════════════════════════════

  useEffect(() => {
    loadData();
    checkEmailService();
  }, []);

  useEffect(() => {
    applyFiltersAndSearch();
  }, [sellers, searchQuery, filterStatus]);

  // ═══════════════════════════════════════════════════════════════
  // ✅ DATA LOADING FUNCTIONS
  // ═══════════════════════════════════════════════════════════════

  // const loadData = async () => {
  //   setLoading(true);
  //   try {
  //     console.log('🔄 Loading admin dashboard data...');
      
  //     const [
  //       sellersData, 
  //       analyticsData, 
  //       dashboardStats, 
  //       sellersWithAnalytics,
  //       pendingRequestsData,
  //       rejectedRequestsData,
  //       tilesDataResult,
  //       top5TilesData
  //     ] = await Promise.all([
  //       getSellersWithFullData(),
  //       getAllAnalytics(),
  //       getAdminDashboardStats(),
  //       getAllSellersWithAnalytics(),
  //       fetchPendingRequests(),
  //       fetchRejectedRequests(),
  //       fetchTilesData(),
  //       fetchTop5Tiles()
  //     ]);
      
  //     setSellers(sellersData);
  //     setAnalytics(analyticsData);
  //     setStats(dashboardStats);
  //     setSellersAnalyticsList(sellersWithAnalytics);
  //     setPendingRequests(pendingRequestsData);
  //     setRejectedRequests(rejectedRequestsData);
  //     setTilesData(tilesDataResult);
  //     setTop5Tiles(top5TilesData);
      
  //     console.log('✅ Dashboard data loaded:', {
  //       sellers: sellersData.length,
  //       analytics: analyticsData.length,
  //       stats: dashboardStats,
  //       sellersWithAnalytics: sellersWithAnalytics.length,
  //       pendingRequests: pendingRequestsData.length,
  //       rejectedRequests: rejectedRequestsData.length,
  //       tiles: tilesDataResult.length,
  //       top5Tiles: top5TilesData.length
  //     });
  //   } catch (error) {
  //     console.error('❌ Error loading admin data:', error);
  //     setError('Failed to load dashboard data');
  //   } finally {
  //     setLoading(false);
  //   }
  // };  
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
        getApprovedSellers(),      // ✅ NEW
        getPendingRequests(),      // ✅ NEW
        getRejectedRequests()      // ✅ NEW
      ]);
      
      setSellers(sellersData);
      setAnalytics(analyticsData);
      setStats(dashboardStats);
      setSellersAnalyticsList(sellersWithAnalytics);
      setApprovedSellers(approvedData);     // ✅ NEW
      setPendingRequests(pendingData);      // ✅ NEW
      setRejectedRequests(rejectedData);    // ✅ NEW
      
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
  // ✅ HANDLERS (ALL EXISTING - KEEPING ALL)
  // ═══════════════════════════════════════════════════════════════

  const handleApproveFromNotification = (requestData: SellerRequest) => {
    console.log('🔄 Auto-switching to create-seller tab for:', requestData.businessName);
    
    setActiveTab('create-seller');
    
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

  // Continue in Part 2...

    // ═══════════════════════════════════════════════════════════════
  // ✅ LOADING STATE
  // ═══════════════════════════════════════════════════════════════

  if (loading && !success && !error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
        <span className="ml-3 text-gray-600">Loading dashboard...</span>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════
  // ✅ SUCCESS STATE
  // ═══════════════════════════════════════════════════════════════

  if (success && createdSeller) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6 pb-4 border-b">
          <div className="flex items-center gap-3">
            <Shield className="w-8 h-8 text-purple-600" />
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Admin Dashboard</h2>
              <p className="text-gray-600">Seller Account Created Successfully</p>
            </div>
          </div>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="bg-green-50 border border-green-200 rounded-xl p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-green-800">Account Created!</h2>
                <p className="text-green-600 text-lg">Successfully created seller account</p>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 space-y-4 mb-6">
              <h3 className="font-semibold text-gray-800 text-lg mb-4">📧 Login Credentials</h3>
              
              <div className="grid gap-3">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-600 w-32">Business:</span>
                  <span className="text-sm font-semibold text-gray-800">{createdSeller.businessName}</span>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-600 w-32">Owner:</span>
                  <span className="text-sm font-semibold text-gray-800">{createdSeller.ownerName}</span>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-600 w-32">Email:</span>
                  <code className="text-sm text-gray-800 font-mono">{createdSeller.email}</code>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <span className="text-sm font-medium text-gray-600 w-32">Password:</span>
                  <code className="text-sm text-gray-800 font-mono font-bold bg-yellow-100 px-3 py-1 rounded">
                    {createdSeller.password}
                  </code>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-600 w-32">Login URL:</span>
                  <a 
                    href="/login" 
                    className="text-sm text-blue-600 hover:underline font-medium"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {window.location.origin}/login
                  </a>
                </div>
              </div>

              <div className="mt-6 p-4 bg-yellow-50 border border-yellow-300 rounded-lg">
                <p className="text-sm text-yellow-800">
                  <strong>⚠️ Important:</strong> Save these credentials securely. 
                  {emailServiceStatus?.configured 
                    ? ' An email has been sent to the seller.' 
                    : ' Please share these credentials with the seller manually.'}
                </p>
              </div>
            </div>

            <div className="flex gap-3">
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
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                <div className="flex items-center justify-center gap-2">
                  <Copy className="w-5 h-5" />
                  Copy All Credentials
                </div>
              </button>
              
              <button
                onClick={() => {
                  setSuccess(false);
                  setCreatedSeller(null);
                  setActiveTab('overview');
                }}
                className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                Back to Dashboard
              </button>
            </div>

            <div className="mt-4 text-center">
              <button
                onClick={() => {
                  setSuccess(false);
                  setCreatedSeller(null);
                  setActiveTab('create-seller');
                }}
                className="text-green-700 hover:text-green-800 text-sm font-medium underline"
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
  // ✅ ERROR STATE
  // ═══════════════════════════════════════════════════════════════

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6 pb-4 border-b">
          <div className="flex items-center gap-3">
            <Shield className="w-8 h-8 text-purple-600" />
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Admin Dashboard</h2>
              <p className="text-gray-600">Seller Account Creation Failed</p>
            </div>
          </div>
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-xl p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <AlertCircle className="w-10 h-10 text-red-600" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-red-800">Creation Failed</h2>
                <p className="text-red-600 text-lg">Unable to create seller account</p>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 mb-6">
              <h3 className="font-semibold text-gray-800 mb-3">Error Details:</h3>
              <p className="text-red-700 font-medium">{error}</p>
              
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-700 font-medium mb-2">Troubleshooting Steps:</p>
                <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
                  <li>Verify you are logged in as administrator</li>
                  <li>Check if the email is already registered</li>
                  <li>Ensure all required fields are filled correctly</li>
                  <li>Check browser console for detailed error logs</li>
                  <li>Verify Firestore security rules are configured</li>
                </ul>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setError(null);
                  setActiveTab('create-seller');
                }}
                className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
              >
                Try Again
              </button>
              
              <button
                onClick={() => {
                  setError(null);
                  setActiveTab('overview');
                }}
                className="flex-1 px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium"
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
  // ✅ CREATING STATE
  // ═══════════════════════════════════════════════════════════════

  if (creating) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6 pb-4 border-b">
          <div className="flex items-center gap-3">
            <Shield className="w-8 h-8 text-purple-600" />
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Admin Dashboard</h2>
              <p className="text-gray-600">Creating Seller Account</p>
            </div>
          </div>
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-8 text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-6"></div>
            <h2 className="text-2xl font-semibold text-blue-800 mb-3">Creating Seller Account...</h2>
            <p className="text-blue-600 mb-6">Please wait while we set up the account and business profile</p>
            
            <div className="bg-white rounded-lg p-4 text-left">
              <p className="text-sm text-gray-700 font-medium mb-2">Process Steps:</p>
              <ul className="text-sm text-gray-600 space-y-1">
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
  // ✅ MAIN DASHBOARD UI - ALL TABS
  // ═══════════════════════════════════════════════════════════════

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Shield className="w-8 h-8 text-purple-600" />
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Admin Dashboard</h2>
            <p className="text-gray-600">Platform Overview & Management</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <AdminNotifications 
            onApproveRequest={handleApproveFromNotification}
            onRejectRequest={handleRejectRequestFromNotification}
          />
          
          <div className={`px-3 py-1 rounded-full text-xs font-medium ${
            emailServiceStatus?.configured 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            📧 {emailServiceStatus?.configured ? 'Email Ready' : 'Email Config Needed'}
          </div>
        </div>
      </div>

      {/* ✅ TAB NAVIGATION - ALL TABS */}
      <div className="flex flex-wrap gap-2 mb-6 pb-4 border-b">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            activeTab === 'overview' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          Overview
        </button>
        <button
          onClick={() => setActiveTab('sellers')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            activeTab === 'sellers' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <Store className="w-4 h-4" />
          Sellers ({filteredSellers.length})
        </button>
        
        <button
          onClick={() => setActiveTab('pending-requests')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            activeTab === 'pending-requests' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <Clock className="w-4 h-4" />
          Pending ({pendingRequests.length})
        </button>
        
        <button
          onClick={() => setActiveTab('rejected-requests')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            activeTab === 'rejected-requests' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <AlertCircle className="w-4 h-4" />
          Rejected ({rejectedRequests.length})
        </button>
        
        <button
          onClick={() => setActiveTab('analytics')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            activeTab === 'analytics' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          Analytics
        </button>
        
        <button
          onClick={() => setActiveTab('tiles-analytics')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            activeTab === 'tiles-analytics' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <QrCode className="w-4 h-4" />
          Tiles ({tilesData.length})
        </button>
        
        {/* ✅ SELLER ANALYTICS TAB - MUST KEEP */}
        <button
          onClick={() => setActiveTab('seller-analytics')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            activeTab === 'seller-analytics' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <Package className="w-4 h-4" />
          Seller Analytics
        </button>
        
        <button
          onClick={() => setActiveTab('create-seller')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            activeTab === 'create-seller' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <Users className="w-4 h-4" />
          Create Seller
          {selectedRequest && (
            <span className="bg-green-500 text-white text-xs rounded-full w-2 h-2 animate-pulse"></span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('account-access')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            activeTab === 'account-access' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <Key className="w-4 h-4" />
          Access
        </button>
        <button
          onClick={() => setActiveTab('email-config')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            activeTab === 'email-config' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <Mail className="w-4 h-4" />
          Email
        </button>
      </div>

      {/* Continue with Part 3 for all tab contents... */}
            {/* ═══════════════════════════════════════════════════════════════ */}
      {/* ✅ OVERVIEW TAB */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-xl shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium">Total Sellers</p>
                  <p className="text-3xl font-bold mt-1">{stats.totalSellers}</p>
                  <p className="text-purple-200 text-xs mt-1">All registered sellers</p>
                </div>
                <Store className="w-12 h-12 text-purple-200 opacity-80" />
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-xl shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">✅ Approved</p>
                  <p className="text-3xl font-bold mt-1">{stats.approvedRequests}</p>
                  <p className="text-green-200 text-xs mt-1">Successfully approved</p>
                </div>
                <CheckCircle className="w-12 h-12 text-green-200 opacity-80" />
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white p-6 rounded-xl shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-100 text-sm font-medium">⏳ Pending</p>
                  <p className="text-3xl font-bold mt-1">{stats.pendingRequests}</p>
                  <p className="text-yellow-200 text-xs mt-1">Awaiting approval</p>
                </div>
                <Clock className="w-12 h-12 text-yellow-200 opacity-80" />
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-6 rounded-xl shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-red-100 text-sm font-medium">❌ Rejected</p>
                  <p className="text-3xl font-bold mt-1">{stats.rejectedRequests}</p>
                  <p className="text-red-200 text-xs mt-1">Not approved</p>
                </div>
                <AlertCircle className="w-12 h-12 text-red-200 opacity-80" />
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-xl shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">🟢 Active</p>
                  <p className="text-3xl font-bold mt-1">{stats.activeSellers}</p>
                  <p className="text-blue-200 text-xs mt-1">Currently active</p>
                </div>
                <Activity className="w-12 h-12 text-blue-200 opacity-80" />
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-gray-500 to-gray-600 text-white p-6 rounded-xl shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-100 text-sm font-medium">🗑️ Deleted</p>
                  <p className="text-3xl font-bold mt-1">{stats.deletedSellers}</p>
                  <p className="text-gray-200 text-xs mt-1">Deactivated accounts</p>
                </div>
                <UserX className="w-12 h-12 text-gray-200 opacity-80" />
              </div>
            </div>
          </div>

          {/* Platform Health */}
          <div className="bg-gray-50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">📊 Platform Health</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <h4 className="font-medium text-gray-700 mb-3">Seller Status Distribution</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Active</span>
                    <span className="text-sm font-medium text-green-600 bg-green-100 px-2 py-1 rounded">
                      {stats.activeSellers}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Inactive</span>
                    <span className="text-sm font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded">
                      {stats.inactiveSellers}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Deleted</span>
                    <span className="text-sm font-medium text-red-600 bg-red-100 px-2 py-1 rounded">
                      {stats.deletedSellers}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <h4 className="font-medium text-gray-700 mb-3">Platform Metrics</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Total Views</span>
                    <span className="text-sm font-medium">{totalViews.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Total Applications</span>
                    <span className="text-sm font-medium">{totalApplications.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Conversion Rate</span>
                    <span className="text-sm font-medium">
                      {totalViews > 0 ? ((totalApplications / totalViews) * 100).toFixed(1) : 0}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6 border border-purple-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">⚡ Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <button
                onClick={() => setActiveTab('sellers')}
                className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Users className="w-5 h-5 text-purple-600" />
                <span className="font-medium text-gray-700">View All Sellers</span>
              </button>
              <button
                onClick={() => setActiveTab('create-seller')}
                className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Users className="w-5 h-5 text-green-600" />
                <span className="font-medium text-gray-700">Create Seller</span>
              </button>
              <button
                onClick={loadData}
                className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <RefreshCw className="w-5 h-5 text-blue-600" />
                <span className="font-medium text-gray-700">Refresh Data</span>
              </button>
              <button
                onClick={() => setActiveTab('email-config')}
                className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Settings className="w-5 h-5 text-orange-600" />
                <span className="font-medium text-gray-700">Email Config</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* ✅ PENDING REQUESTS TAB */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      
      {activeTab === 'pending-requests' && (
        <div className="space-y-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h3 className="font-semibold text-yellow-800 mb-2">⏳ Pending Seller Requests</h3>
            <p className="text-yellow-700 text-sm">
              Review and approve or reject seller registration requests.
            </p>
          </div>

          <div className="overflow-x-auto bg-white rounded-lg border border-gray-200">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left p-4 font-semibold text-gray-700">Business Name</th>
                  <th className="text-left p-4 font-semibold text-gray-700">Owner Name</th>
                  <th className="text-left p-4 font-semibold text-gray-700">Email</th>
                  <th className="text-left p-4 font-semibold text-gray-700">Phone</th>
                  <th className="text-left p-4 font-semibold text-gray-700">Requested</th>
                  <th className="text-left p-4 font-semibold text-gray-700">Pending Since</th>
                  <th className="text-left p-4 font-semibold text-gray-700">Actions</th>
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
                        <div className="font-medium text-gray-800">{request.businessName}</div>
                      </td>
                      <td className="p-4 text-gray-700">{request.ownerName}</td>
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
      {/* ✅ REJECTED REQUESTS TAB */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      
      {activeTab === 'rejected-requests' && (
        <div className="space-y-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h3 className="font-semibold text-red-800 mb-2">❌ Rejected Seller Requests</h3>
            <p className="text-red-700 text-sm">
              View all rejected seller registration requests and rejection reasons.
            </p>
          </div>

          <div className="overflow-x-auto bg-white rounded-lg border border-gray-200">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left p-4 font-semibold text-gray-700">Business Name</th>
                  <th className="text-left p-4 font-semibold text-gray-700">Owner Name</th>
                  <th className="text-left p-4 font-semibold text-gray-700">Email</th>
                  <th className="text-left p-4 font-semibold text-gray-700">Requested</th>
                  <th className="text-left p-4 font-semibold text-gray-700">Rejected</th>
                  <th className="text-left p-4 font-semibold text-gray-700">Rejection Reason</th>
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
                        <div className="font-medium text-gray-800">{request.businessName}</div>
                      </td>
                      <td className="p-4 text-gray-700">{request.ownerName}</td>
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
      {/* ✅ TILES ANALYTICS TAB */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      
      {activeTab === 'tiles-analytics' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-6">
            <h3 className="text-xl font-bold text-blue-800 mb-2">📱 Tiles Analytics & Performance</h3>
            <p className="text-blue-700">
              View all tiles uploaded by sellers, scan counts, and performance metrics.
            </p>
          </div>

          {/* Top 5 Most Scanned Tiles */}
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <div className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 border-b">
              <h4 className="font-bold text-gray-800 flex items-center gap-2">
                <Award className="w-5 h-5 text-yellow-600" />
                🏆 Top 5 Most Scanned Tiles
              </h4>
            </div>
            
            <div className="p-4">
              {top5Tiles.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <TrendingDown className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                  <p>No tile scan data available</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  {top5Tiles.map((tile, index) => (
                    <div 
                      key={tile.id} 
                      className="bg-gradient-to-br from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-4 hover:shadow-lg transition-shadow"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-2xl font-bold text-yellow-600">#{index + 1}</span>
                        <Award className={`w-6 h-6 ${index === 0 ? 'text-yellow-500' : index === 1 ? 'text-gray-400' : 'text-orange-400'}`} />
                      </div>
                      
                      {tile.image_url && (
                        <img 
                          src={tile.image_url} 
                          alt={tile.tile_name}
                          className="w-full h-32 object-cover rounded-lg mb-3"
                        />
                      )}
                      
                      <h5 className="font-semibold text-gray-800 mb-1 truncate" title={tile.tile_name}>
                        {tile.tile_name}
                      </h5>
                      <p className="text-xs text-gray-600 mb-2 truncate" title={tile.tile_code}>
                        Code: {tile.tile_code}
                      </p>
                      <p className="text-xs text-gray-600 mb-3 truncate" title={tile.seller_name}>
                        Seller: {tile.seller_name}
                      </p>
                      
                      <div className="bg-white rounded-lg p-2 text-center">
                        <p className="text-2xl font-bold text-purple-600">{tile.scan_count}</p>
                        <p className="text-xs text-gray-600">Scans</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* All Tiles Table */}
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <div className="p-4 bg-gray-50 border-b flex items-center justify-between">
              <h4 className="font-semibold text-gray-800">All Tiles ({tilesData.length})</h4>
              <button
                onClick={loadData}
                className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100 border-b">
                  <tr>
                    <th className="text-left p-4 font-semibold text-gray-700">Image</th>
                    <th className="text-left p-4 font-semibold text-gray-700">Tile Code</th>
                    <th className="text-left p-4 font-semibold text-gray-700">Tile Name</th>
                    <th className="text-left p-4 font-semibold text-gray-700">Seller</th>
                    <th className="text-center p-4 font-semibold text-gray-700">Scans</th>
                    <th className="text-left p-4 font-semibold text-gray-700">Last Scanned</th>
                    <th className="text-left p-4 font-semibold text-gray-700">Created</th>
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
                          <span className="font-medium text-gray-800">{tile.tile_name}</span>
                        </td>
                        <td className="p-4 text-gray-700">{tile.seller_name}</td>
                        <td className="p-4 text-center">
                          <span className={`px-3 py-1 rounded-full font-semibold ${
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
      {/* ✅ SELLER ANALYTICS TAB - MUST KEEP THIS */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      
      {activeTab === 'seller-analytics' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-xl p-6">
            <h3 className="text-xl font-bold text-purple-800 mb-2">📊 Seller Performance Analytics</h3>
            <p className="text-purple-700">
              View detailed analytics for each seller including tile uploads, customer engagement, 
              QR code scans, and daily activity patterns.
            </p>
          </div>

          {/* Sellers Analytics Table */}
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <div className="p-4 bg-gray-50 border-b flex items-center justify-between">
              <h4 className="font-semibold text-gray-800">All Sellers ({sellersAnalyticsList.length})</h4>
              <button
                onClick={loadData}
                className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100 border-b">
                  <tr>
                    <th className="text-left p-4 font-semibold text-gray-700">Business Name</th>
                    <th className="text-left p-4 font-semibold text-gray-700">Owner</th>
                    <th className="text-left p-4 font-semibold text-gray-700">Email</th>
                    <th className="text-center p-4 font-semibold text-gray-700">Total Tiles</th>
                    <th className="text-center p-4 font-semibold text-gray-700">Status</th>
                    <th className="text-left p-4 font-semibold text-gray-700">Last Login</th>
                    <th className="text-center p-4 font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {sellersAnalyticsList.length > 0 ? (
                    sellersAnalyticsList.map((seller) => (
                      <tr key={seller.id} className="border-t hover:bg-gray-50 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <Store className="w-5 h-5 text-purple-600" />
                            <span className="font-medium text-gray-800">{seller.businessName}</span>
                          </div>
                        </td>
                        <td className="p-4 text-gray-700">{seller.ownerName}</td>
                        <td className="p-4">
                          <a 
                            href={`mailto:${seller.email}`}
                            className="text-blue-600 hover:underline text-sm"
                          >
                            {seller.email}
                          </a>
                        </td>
                        <td className="p-4 text-center">
                          <span className={`px-3 py-1 rounded-full font-semibold ${
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

{/* Part 4 continues with remaining tabs (Sellers, Analytics, Create Seller, Account Access, Email Config, Modals)... */}
 
       {/* ═══════════════════════════════════════════════════════════════ */}
      {/* ✅ SELLERS TAB */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      
      {activeTab === 'sellers' && (
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-4 rounded-lg border border-gray-200">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by business name, owner, email, or phone..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
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
              
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => setFilterStatus('all')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    filterStatus === 'all'
                      ? 'bg-purple-600 text-white'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  All ({sellers.length})
                </button>
                <button
                  onClick={() => setFilterStatus('approved')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    filterStatus === 'approved'
                      ? 'bg-green-600 text-white'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  ✅ Approved
                </button>
                <button
                  onClick={() => setFilterStatus('active')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    filterStatus === 'active'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  🟢 Active
                </button>
                <button
                  onClick={() => setFilterStatus('deleted')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    filterStatus === 'deleted'
                      ? 'bg-gray-600 text-white'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  🗑️ Deleted
                </button>
              </div>
            </div>
            
            <div className="mt-3 text-sm text-gray-600">
              Showing {filteredSellers.length} of {sellers.length} sellers
            </div>
          </div>

          <div className="overflow-x-auto bg-white rounded-lg border border-gray-200">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left p-4 font-semibold text-gray-700">Business Name</th>
                  <th className="text-left p-4 font-semibold text-gray-700">Owner</th>
                  <th className="text-left p-4 font-semibold text-gray-700">Email</th>
                  <th className="text-left p-4 font-semibold text-gray-700">Phone</th>
                  <th className="text-left p-4 font-semibold text-gray-700">Status</th>
                  <th className="text-left p-4 font-semibold text-gray-700">Account</th>
                  <th className="text-left p-4 font-semibold text-gray-700">Actions</th>
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
                        <div className="font-medium text-gray-800">
                          {seller.deleted && <span className="line-through">{seller.businessName}</span>}
                          {!seller.deleted && seller.businessName}
                        </div>
                      </td>
                      
                      <td className="p-4 text-gray-700">{seller.ownerName}</td>
                      
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
                        <span className={`
                          px-3 py-1 rounded-full text-xs font-medium
                          ${seller.requestStatus === 'approved' ? 'bg-green-100 text-green-800' :
                            seller.requestStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            seller.requestStatus === 'rejected' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }
                        `}>
                          {seller.requestStatus === 'approved' && '✅ Approved'}
                          {seller.requestStatus === 'pending' && '⏳ Pending'}
                          {seller.requestStatus === 'rejected' && '❌ Rejected'}
                          {!seller.requestStatus && 'Unknown'}
                        </span>
                      </td>
                      
                      <td className="p-4">
                        <span className={`
                          px-3 py-1 rounded-full text-xs font-medium
                          ${seller.isActive ? 'bg-green-100 text-green-800' :
                            seller.deleted ? 'bg-gray-100 text-gray-800' :
                            'bg-red-100 text-red-800'
                          }
                        `}>
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

          <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="text-sm text-gray-600">
              Total: {filteredSellers.length} seller{filteredSellers.length !== 1 ? 's' : ''}
            </div>
            <button
              onClick={loadData}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh Data
            </button>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* ✅ ANALYTICS TAB */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      
      {activeTab === 'analytics' && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">📊 Platform Analytics</h3>
          <div className="overflow-x-auto bg-white rounded-lg border border-gray-200">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left p-3 font-semibold text-gray-700">Tile Name</th>
                  <th className="text-left p-3 font-semibold text-gray-700">Seller</th>
                  <th className="text-left p-3 font-semibold text-gray-700">Views</th>
                  <th className="text-left p-3 font-semibold text-gray-700">Applications</th>
                  <th className="text-left p-3 font-semibold text-gray-700">Conversion</th>
                  <th className="text-left p-3 font-semibold text-gray-700">Last Activity</th>
                </tr>
              </thead>
              <tbody>
                {analytics.map((item) => {
                  const conversion = item.view_count > 0 ? ((item.apply_count / item.view_count) * 100).toFixed(1) : '0';
                  return (
                    <tr key={item.tile_id} className="border-t hover:bg-gray-50">
                      <td className="p-3 font-medium">{item.tile_name}</td>
                      <td className="p-3 text-gray-600">{item.tile_sellers?.business_name || 'Unknown'}</td>
                      <td className="p-3">{item.view_count || 0}</td>
                      <td className="p-3">{item.apply_count || 0}</td>
                      <td className="p-3">
                        <span className={`font-medium ${
                          parseFloat(conversion) > 10 ? 'text-green-600' :
                          parseFloat(conversion) > 5 ? 'text-yellow-600' :
                          'text-red-600'
                        }`}>
                          {conversion}%
                        </span>
                      </td>
                      <td className="p-3 text-gray-600">
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
      {/* ✅ CREATE SELLER TAB */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      
      {activeTab === 'create-seller' && (
        <div className="space-y-6">
          {selectedRequest ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <h3 className="font-semibold text-green-800">Auto Pre-filled from Approved Request</h3>
              </div>
              <p className="text-green-700 text-sm">
                <strong>{selectedRequest.businessName}</strong> request has been approved. 
                The form below is pre-filled with their information.
              </p>
            </div>
          ) : (
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <h3 className="font-semibold text-purple-800 mb-2">Create New Seller Account</h3>
              <p className="text-purple-700 text-sm">
                Only administrators can create new seller accounts.
              </p>
            </div>
          )}

          {!emailServiceStatus?.configured && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="w-5 h-5 text-yellow-600" />
                <h4 className="font-medium text-yellow-800">Email Service Not Configured</h4>
              </div>
              <p className="text-yellow-700 text-sm">
                Account creation will work, but credentials will need to be shared manually.
              </p>
            </div>
          )}
          
          <form onSubmit={handleCreateSeller} className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
                <input
                  type="email"
                  placeholder="seller@business.com"
                  value={newSeller.email}
                  onChange={(e) => setNewSeller({ ...newSeller, email: e.target.value })}
                  className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 ${selectedRequest ? 'bg-green-50' : ''}`}
                  required
                  readOnly={!!selectedRequest}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                  type="text"
                  placeholder="Auto-generated secure password"
                  value={newSeller.password}
                  onChange={(e) => setNewSeller({ ...newSeller, password: e.target.value })}
                  className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 ${selectedRequest ? 'bg-green-50' : ''}`}
                  readOnly={!!selectedRequest}
                />
                <p className="text-xs text-gray-500 mt-1">Leave empty for auto-generated password</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  placeholder="Owner Full Name"
                  value={newSeller.fullName}
                  onChange={(e) => setNewSeller({ ...newSeller, fullName: e.target.value })}
                  className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 ${selectedRequest ? 'bg-green-50' : ''}`}
                  required
                  readOnly={!!selectedRequest}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Business Name *</label>
                <input
                  type="text"
                  placeholder="Business Name"
                  value={newSeller.businessName}
                  onChange={(e) => setNewSeller({ ...newSeller, businessName: e.target.value })}
                  className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 ${selectedRequest ? 'bg-green-50' : ''}`}
                  required
                  readOnly={!!selectedRequest}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Business Address</label>
                <input
                  type="text"
                  placeholder="Complete Business Address"
                  value={newSeller.businessAddress}
                  onChange={(e) => setNewSeller({ ...newSeller, businessAddress: e.target.value })}
                  className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 ${selectedRequest ? 'bg-green-50' : ''}`}
                  readOnly={!!selectedRequest}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  placeholder="+91 9876543210"
                  value={newSeller.phone}
                  onChange={(e) => setNewSeller({ ...newSeller, phone: e.target.value })}
                  className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 ${selectedRequest ? 'bg-green-50' : ''}`}
                  readOnly={!!selectedRequest}
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Website (Optional)</label>
                <input
                  type="url"
                  placeholder="https://business-website.com"
                  value={newSeller.website}
                  onChange={(e) => setNewSeller({ ...newSeller, website: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>
            
            <button
              type="submit"
              disabled={creating}
              className={`w-full py-4 rounded-lg font-medium text-lg transition-colors ${
                selectedRequest 
                  ? 'bg-green-600 hover:bg-green-700 text-white' 
                  : 'bg-purple-600 hover:bg-purple-700 text-white'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {creating ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Creating Account...
                </div>
              ) : selectedRequest ? (
                '✅ Create Seller Account (Pre-filled)'
              ) : (
                'Create Seller Account'
              )}
            </button>

            <div className="text-center text-sm text-gray-600 space-y-1">
              <p>📧 Email delivery: {emailServiceStatus?.configured ? '✅ Automatic' : '⚠️ Manual required'}</p>
              <p>🔐 Password: Auto-generated secure credentials</p>
            </div>
          </form>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* ✅ ACCOUNT ACCESS TAB */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      
      {activeTab === 'account-access' && (
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-800 mb-2">🔑 Account Access Management</h3>
            <p className="text-blue-700 text-sm">
              Manage seller accounts, send password reset links, and view communication history.
            </p>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search sellers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div className="overflow-x-auto bg-white rounded-lg border border-gray-200">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left p-4 font-semibold text-gray-700">Business Name</th>
                  <th className="text-left p-4 font-semibold text-gray-700">Owner</th>
                  <th className="text-left p-4 font-semibold text-gray-700">Email</th>
                  <th className="text-left p-4 font-semibold text-gray-700">Created</th>
                  <th className="text-left p-4 font-semibold text-gray-700">Last Login</th>
                  <th className="text-left p-4 font-semibold text-gray-700">Status</th>
                  <th className="text-left p-4 font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {searchSellers(sellers, searchQuery)
                  .filter(s => !s.deleted)
                  .map((seller) => (
                    <tr key={seller.id} className="border-t border-gray-100 hover:bg-gray-50">
                      <td className="p-4 font-medium text-gray-800">{seller.businessName}</td>
                      <td className="p-4 text-gray-700">{seller.ownerName}</td>
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
      {/* ✅ EMAIL CONFIG TAB */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      
      {activeTab === 'email-config' && (
        <div className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-800 mb-2">📧 Email Service Configuration</h3>
            <p className="text-blue-700 text-sm">
              Manage EmailJS integration for automated seller credential delivery.
            </p>
          </div>

          <div className={`p-4 rounded-lg border ${
            emailServiceStatus?.configured 
              ? 'bg-green-50 border-green-200' 
              : 'bg-red-50 border-red-200'
          }`}>
            <div className="flex items-center justify-between mb-3">
              <h4 className={`font-medium ${
                emailServiceStatus?.configured ? 'text-green-800' : 'text-red-800'
              }`}>
                Service Status: {emailServiceStatus?.configured ? '✅ Ready' : '❌ Configuration Required'}
              </h4>
              <div className="flex gap-2">
                <button
                  onClick={checkEmailService}
                  className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                >
                  Refresh Status
                </button>
                <button
                  onClick={handleTestEmail}
                  disabled={testingEmail || !emailServiceStatus?.configured}
                  className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 disabled:opacity-50"
                >
                  {testingEmail ? 'Testing...' : 'Test Email'}
                </button>
                <button
                  onClick={copyEmailConfig}
                  className="px-3 py-1 bg-gray-600 text-white text-sm rounded hover:bg-gray-700"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div className="text-sm">
              <p className={emailServiceStatus?.configured ? 'text-green-700' : 'text-red-700'}>
                {emailServiceStatus?.message}
              </p>
              
              {emailServiceStatus?.details && (
                <div className="mt-2 p-3 bg-white rounded border">
                  <div className="grid grid-cols-2 gap-2 text-xs">
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

          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-800 mb-3">📖 Configuration Guide</h4>
            <div className="space-y-3 text-sm text-gray-700">
              <div>
                <strong>Step 1:</strong> Create account at <a href="https://dashboard.emailjs.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">EmailJS Dashboard</a>
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
      {/* ✅ MODALS */}
      {/* ═══════════════════════════════════════════════════════════════ */}

      {/* SELLER ANALYTICS MODAL */}
      {showAnalyticsModal && selectedSellerForAnalytics && (
        <SellerAnalytics
          sellerId={selectedSellerForAnalytics.id}
          sellerName={selectedSellerForAnalytics.businessName}
          onClose={() => {
            setShowAnalyticsModal(false);
            setSelectedSellerForAnalytics(null);
          }}
        />
      )}

      {/* SELLER DETAILS MODAL */}
      {showDetailsModal && selectedSeller && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6 rounded-t-xl">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold">{selectedSeller.businessName}</h3>
                  <p className="text-purple-100">{selectedSeller.ownerName}</p>
                </div>
                <button
                  onClick={() => {
                    setShowDetailsModal(false);
                    setSelectedSeller(null);
                    setCommunicationHistory([]);
                  }}
                  className="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-2 transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Business Information */}
              <div>
                <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <Store className="w-5 h-5" />
                  Business Information
                </h4>
                <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium text-gray-800">{selectedSeller.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Phone</p>
                    <p className="font-medium text-gray-800">{selectedSeller.phone || 'N/A'}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm text-gray-600">Address</p>
                    <p className="font-medium text-gray-800">{selectedSeller.businessAddress || 'N/A'}</p>
                  </div>
                </div>
              </div>

              {/* Account Information */}
              <div>
                <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Account Information
                </h4>
                <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-600">Created</p>
                    <p className="font-medium text-gray-800">
                      {new Date(selectedSeller.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Last Login</p>
                    <p className="font-medium text-gray-800">
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
                    <p className="text-sm text-gray-600">Account Status</p>
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
                <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <Mail className="w-5 h-5" />
                  Communication History
                </h4>
                {communicationHistory.length === 0 ? (
                  <div className="bg-gray-50 p-4 rounded-lg text-center text-gray-500">
                    <p>No communication history found</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {communicationHistory.map((comm, index) => (
                      <div key={index} className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full ${
                              comm.status === 'sent' ? 'bg-green-500' : 'bg-red-500'
                            }`}></span>
                            <span className="font-medium text-gray-800">{comm.subject || comm.communication_type}</span>
                          </div>
                          <span className="text-xs text-gray-500">
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

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t">
                <button
                  onClick={() => handlePasswordReset(selectedSeller)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                >
                  <Key className="w-5 h-5" />
                  Send Password Reset
                </button>
                <button
                  onClick={() => {
                    setShowDetailsModal(false);
                    setSelectedSeller(null);
                  }}
                  className="flex-1 px-4 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
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