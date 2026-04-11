

// // // // // // // // import React from 'react';
// // // // // // // // import { Navigate } from 'react-router-dom';
// // // // // // // // import { useAppStore } from '../stores/appStore';
// // // // // // // // import { AlertCircle, Loader } from 'lucide-react';

// // // // // // // // interface WorkerProtectedRouteProps {
// // // // // // // //   children: React.ReactNode;
// // // // // // // // }

// // // // // // // // export const WorkerProtectedRoute: React.FC<WorkerProtectedRouteProps> = ({ children }) => {
// // // // // // // //   const { currentUser, isAuthenticated } = useAppStore();

// // // // // // // //   // Show loading while auth state is being determined
// // // // // // // //   if (currentUser === undefined) {
// // // // // // // //     return (
// // // // // // // //       <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
// // // // // // // //         <div className="text-center">
// // // // // // // //           <Loader className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 animate-spin text-blue-600 mx-auto mb-3 sm:mb-4" />
// // // // // // // //           <p className="text-sm sm:text-base lg:text-lg text-gray-600">Checking authentication...</p>
// // // // // // // //         </div>
// // // // // // // //       </div>
// // // // // // // //     );
// // // // // // // //   }

// // // // // // // //   // Not authenticated - redirect to home
// // // // // // // //   if (!isAuthenticated || !currentUser) {
// // // // // // // //     return <Navigate to="/" replace />;
// // // // // // // //   }

// // // // // // // //   // Check if user has appropriate role
// // // // // // // //   const allowedRoles = ['worker', 'seller', 'admin'];
// // // // // // // //   if (!allowedRoles.includes(currentUser.role)) {
// // // // // // // //     return (
// // // // // // // //       <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-6 sm:py-8">
// // // // // // // //         <div className="text-center max-w-md w-full mx-auto bg-white rounded-xl shadow-lg p-6 sm:p-8">
// // // // // // // //           <AlertCircle className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 text-red-500 mx-auto mb-3 sm:mb-4" />
// // // // // // // //           <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-800 mb-3 sm:mb-4">
// // // // // // // //             Access Denied
// // // // // // // //           </h2>
// // // // // // // //           <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 leading-relaxed">
// // // // // // // //             You don't have permission to access this page. Only workers, sellers, and admins can use the scan functionality.
// // // // // // // //           </p>
// // // // // // // //           <button 
// // // // // // // //             onClick={() => window.location.href = '/'}
// // // // // // // //             className="w-full sm:w-auto px-6 py-2.5 sm:py-3 bg-blue-600 text-white text-sm sm:text-base rounded-lg hover:bg-blue-700 transition-colors font-medium"
// // // // // // // //           >
// // // // // // // //             Go to Home
// // // // // // // //           </button>
// // // // // // // //         </div>
// // // // // // // //       </div>
// // // // // // // //     );
// // // // // // // //   }

// // // // // // // //   // Special handling for worker role
// // // // // // // //   if (currentUser.role === 'worker') {
// // // // // // // //     // Check if worker account is active
// // // // // // // //     if (currentUser.is_active === false) {
// // // // // // // //       return (
// // // // // // // //         <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-6 sm:py-8">
// // // // // // // //           <div className="text-center max-w-md w-full mx-auto bg-white rounded-xl shadow-lg p-6 sm:p-8">
// // // // // // // //             <AlertCircle className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 text-orange-500 mx-auto mb-3 sm:mb-4" />
// // // // // // // //             <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-800 mb-3 sm:mb-4">
// // // // // // // //               Account Disabled
// // // // // // // //             </h2>
// // // // // // // //             <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 leading-relaxed">
// // // // // // // //               Your worker account has been disabled by the seller. Please contact them to reactivate your account.
// // // // // // // //             </p>
// // // // // // // //             <button 
// // // // // // // //               onClick={() => {
// // // // // // // //                 // Force logout
// // // // // // // //                 localStorage.clear();
// // // // // // // //                 sessionStorage.clear();
// // // // // // // //                 window.location.href = '/';
// // // // // // // //               }}
// // // // // // // //               className="w-full sm:w-auto px-6 py-2.5 sm:py-3 bg-red-600 text-white text-sm sm:text-base rounded-lg hover:bg-red-700 transition-colors font-medium"
// // // // // // // //             >
// // // // // // // //               Logout
// // // // // // // //             </button>
// // // // // // // //           </div>
// // // // // // // //         </div>
// // // // // // // //       );
// // // // // // // //     }

// // // // // // // //     // Check if worker account is deleted
// // // // // // // //     if (currentUser.account_status === 'deleted') {
// // // // // // // //       return (
// // // // // // // //         <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-6 sm:py-8">
// // // // // // // //           <div className="text-center max-w-md w-full mx-auto bg-white rounded-xl shadow-lg p-6 sm:p-8">
// // // // // // // //             <AlertCircle className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 text-red-500 mx-auto mb-3 sm:mb-4" />
// // // // // // // //             <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-800 mb-3 sm:mb-4">
// // // // // // // //               Account Not Found
// // // // // // // //             </h2>
// // // // // // // //             <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 leading-relaxed">
// // // // // // // //               Your worker account has been removed. Please contact the seller for a new account.
// // // // // // // //             </p>
// // // // // // // //             <button 
// // // // // // // //               onClick={() => {
// // // // // // // //                 // Force logout
// // // // // // // //                 localStorage.clear();
// // // // // // // //                 sessionStorage.clear();
// // // // // // // //                 window.location.href = '/';
// // // // // // // //               }}
// // // // // // // //               className="w-full sm:w-auto px-6 py-2.5 sm:py-3 bg-red-600 text-white text-sm sm:text-base rounded-lg hover:bg-red-700 transition-colors font-medium"
// // // // // // // //             >
// // // // // // // //               Logout
// // // // // // // //             </button>
// // // // // // // //           </div>
// // // // // // // //         </div>
// // // // // // // //       );
// // // // // // // //     }
// // // // // // // //   }

// // // // // // // //   // All checks passed - render the protected content
// // // // // // // //   return <>{children}</>;
// // // // // // // // }; 
// // // // // // // import React, { useEffect, useState } from 'react';
// // // // // // // import { Navigate } from 'react-router-dom';
// // // // // // // import { useAppStore } from '../stores/appStore';
// // // // // // // import { AlertCircle, Loader, Shield, XCircle } from 'lucide-react';
// // // // // // // import { checkSellerPlanStatus } from '../lib/firebaseutils';
// // // // // // // import { auth } from '../lib/firebase';

// // // // // // // interface WorkerProtectedRouteProps {
// // // // // // //   children: React.ReactNode;
// // // // // // // }

// // // // // // // export const WorkerProtectedRoute: React.FC<WorkerProtectedRouteProps> = ({ children }) => {
// // // // // // //   const { currentUser, isAuthenticated } = useAppStore();
// // // // // // //   const [sellerPlanActive, setSellerPlanActive] = useState<boolean | null>(null);
// // // // // // //   const [checkingPlan, setCheckingPlan] = useState(true);

// // // // // // //   // ✅✅✅ REAL-TIME SELLER PLAN CHECK FOR WORKERS ✅✅✅
// // // // // // //   useEffect(() => {
// // // // // // //     let intervalId: NodeJS.Timeout;

// // // // // // //     const checkSellerPlan = async () => {
// // // // // // //       if (!currentUser || currentUser.role !== 'worker') {
// // // // // // //         setCheckingPlan(false);
// // // // // // //         return;
// // // // // // //       }

// // // // // // //       try {
// // // // // // //         console.log('🔍 Worker Route: Checking seller plan status...');
        
// // // // // // //         // Get seller ID from worker profile
// // // // // // //         const sellerId = currentUser.seller_id || currentUser.created_by;
        
// // // // // // //         if (!sellerId) {
// // // // // // //           console.error('❌ Worker has no seller_id');
// // // // // // //           setSellerPlanActive(false);
// // // // // // //           setCheckingPlan(false);
// // // // // // //           return;
// // // // // // //         }

// // // // // // //         // Check seller's plan status
// // // // // // //         const planStatus = await checkSellerPlanStatus(sellerId);
        
// // // // // // //         console.log('📊 Seller plan status:', planStatus);
        
// // // // // // //         setSellerPlanActive(planStatus.isActive);
// // // // // // //         setCheckingPlan(false);

// // // // // // //         // ✅ CRITICAL: If plan became inactive while worker is logged in, FORCE LOGOUT
// // // // // // //         if (!planStatus.isActive && isAuthenticated) {
// // // // // // //           console.log('🚨 SELLER PLAN EXPIRED - FORCING WORKER LOGOUT');
          
// // // // // // //           // Sign out from Firebase Auth
// // // // // // //           await auth.signOut();
          
// // // // // // //           // Clear all local storage
// // // // // // //           localStorage.clear();
// // // // // // //           sessionStorage.clear();
          
// // // // // // //           // Redirect to home
// // // // // // //           window.location.href = '/';
// // // // // // //         }

// // // // // // //       } catch (error: any) {
// // // // // // //         console.error('❌ Error checking seller plan:', error);
// // // // // // //         setSellerPlanActive(false);
// // // // // // //         setCheckingPlan(false);
// // // // // // //       }
// // // // // // //     };

// // // // // // //     // Initial check
// // // // // // //     checkSellerPlan();

// // // // // // //     // ✅ RE-CHECK EVERY 30 SECONDS FOR REAL-TIME MONITORING
// // // // // // //     if (currentUser?.role === 'worker') {
// // // // // // //       intervalId = setInterval(checkSellerPlan, 30000); // 30 seconds
// // // // // // //       console.log('⏰ Started real-time seller plan monitoring (30s interval)');
// // // // // // //     }

// // // // // // //     return () => {
// // // // // // //       if (intervalId) {
// // // // // // //         clearInterval(intervalId);
// // // // // // //         console.log('🛑 Stopped seller plan monitoring');
// // // // // // //       }
// // // // // // //     };
// // // // // // //   }, [currentUser, isAuthenticated]);

// // // // // // //   // Show loading while auth state is being determined
// // // // // // //   if (currentUser === undefined || checkingPlan) {
// // // // // // //     return (
// // // // // // //       <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
// // // // // // //         <div className="text-center">
// // // // // // //           <Loader className="w-10 h-10 animate-spin text-blue-600 mx-auto mb-4" />
// // // // // // //           <p className="text-base text-gray-600">
// // // // // // //             {checkingPlan ? 'Verifying access permissions...' : 'Checking authentication...'}
// // // // // // //           </p>
// // // // // // //         </div>
// // // // // // //       </div>
// // // // // // //     );
// // // // // // //   }

// // // // // // //   // Not authenticated - redirect to home
// // // // // // //   if (!isAuthenticated || !currentUser) {
// // // // // // //     return <Navigate to="/" replace />;
// // // // // // //   }

// // // // // // //   // Check if user has appropriate role
// // // // // // //   const allowedRoles = ['worker', 'seller', 'admin'];
// // // // // // //   if (!allowedRoles.includes(currentUser.role)) {
// // // // // // //     return (
// // // // // // //       <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-8">
// // // // // // //         <div className="text-center max-w-md w-full mx-auto bg-white rounded-xl shadow-lg p-8">
// // // // // // //           <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
// // // // // // //           <h2 className="text-2xl font-semibold text-gray-800 mb-4">Access Denied</h2>
// // // // // // //           <p className="text-base text-gray-600 mb-6">
// // // // // // //             You don't have permission to access this page.
// // // // // // //           </p>
// // // // // // //           <button 
// // // // // // //             onClick={() => window.location.href = '/'}
// // // // // // //             className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
// // // // // // //           >
// // // // // // //             Go to Home
// // // // // // //           </button>
// // // // // // //         </div>
// // // // // // //       </div>
// // // // // // //     );
// // // // // // //   }

// // // // // // //   // Special handling for worker role
// // // // // // //   if (currentUser.role === 'worker') {
    
// // // // // // //     // ✅✅✅ CHECK 1: Worker account disabled ✅✅✅
// // // // // // //     if (currentUser.is_active === false) {
// // // // // // //       return (
// // // // // // //         <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-8">
// // // // // // //           <div className="text-center max-w-md w-full mx-auto bg-white rounded-xl shadow-lg p-8">
// // // // // // //             <XCircle className="w-16 h-16 text-orange-500 mx-auto mb-4 animate-pulse" />
// // // // // // //             <h2 className="text-2xl font-semibold text-gray-800 mb-4">Account Disabled</h2>
// // // // // // //             <p className="text-base text-gray-600 mb-6">
// // // // // // //               Your worker account has been disabled by the seller. Please contact them to reactivate your account.
// // // // // // //             </p>
// // // // // // //             <button 
// // // // // // //               onClick={() => {
// // // // // // //                 localStorage.clear();
// // // // // // //                 sessionStorage.clear();
// // // // // // //                 window.location.href = '/';
// // // // // // //               }}
// // // // // // //               className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700"
// // // // // // //             >
// // // // // // //               Logout
// // // // // // //             </button>
// // // // // // //           </div>
// // // // // // //         </div>
// // // // // // //       );
// // // // // // //     }

// // // // // // //     // ✅✅✅ CHECK 2: Worker account deleted ✅✅✅
// // // // // // //     if (currentUser.account_status === 'deleted') {
// // // // // // //       return (
// // // // // // //         <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-8">
// // // // // // //           <div className="text-center max-w-md w-full mx-auto bg-white rounded-xl shadow-lg p-8">
// // // // // // //             <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
// // // // // // //             <h2 className="text-2xl font-semibold text-gray-800 mb-4">Account Not Found</h2>
// // // // // // //             <p className="text-base text-gray-600 mb-6">
// // // // // // //               Your worker account has been removed. Please contact the seller for a new account.
// // // // // // //             </p>
// // // // // // //             <button 
// // // // // // //               onClick={() => {
// // // // // // //                 localStorage.clear();
// // // // // // //                 sessionStorage.clear();
// // // // // // //                 window.location.href = '/';
// // // // // // //               }}
// // // // // // //               className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700"
// // // // // // //             >
// // // // // // //               Logout
// // // // // // //             </button>
// // // // // // //           </div>
// // // // // // //         </div>
// // // // // // //       );
// // // // // // //     }

// // // // // // //     // ✅✅✅ CHECK 3: SELLER'S PLAN EXPIRED (NEW CHECK) ✅✅✅
// // // // // // //     if (sellerPlanActive === false) {
// // // // // // //       return (
// // // // // // //         <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50 px-4 py-8">
// // // // // // //           <div className="text-center max-w-md w-full mx-auto bg-white rounded-xl shadow-2xl p-8 border-2 border-red-200">
// // // // // // //             <Shield className="w-20 h-20 text-red-600 mx-auto mb-4 animate-pulse" />
// // // // // // //             <h2 className="text-2xl font-bold text-gray-800 mb-4">🚫 Access Suspended</h2>
            
// // // // // // //             <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 mb-6">
// // // // // // //               <p className="text-red-900 font-semibold mb-2">
// // // // // // //                 Seller's Subscription Has Expired
// // // // // // //               </p>
// // // // // // //               <p className="text-sm text-red-700">
// // // // // // //                 The seller's plan is no longer active. You cannot access the system until they renew their subscription.
// // // // // // //               </p>
// // // // // // //             </div>

// // // // // // //             <div className="text-left space-y-2 mb-6 text-sm text-gray-700 bg-gray-50 p-4 rounded-lg">
// // // // // // //               <p className="flex items-center gap-2">
// // // // // // //                 <span className="text-red-500">✗</span>
// // // // // // //                 <span>QR Scanning: Disabled</span>
// // // // // // //               </p>
// // // // // // //               <p className="flex items-center gap-2">
// // // // // // //                 <span className="text-red-500">✗</span>
// // // // // // //                 <span>Tile Management: Disabled</span>
// // // // // // //               </p>
// // // // // // //               <p className="flex items-center gap-2">
// // // // // // //                 <span className="text-red-500">✗</span>
// // // // // // //                 <span>All Features: Locked</span>
// // // // // // //               </p>
// // // // // // //             </div>

// // // // // // //             <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-6">
// // // // // // //               <p className="text-sm text-blue-800">
// // // // // // //                 💡 <strong>What to do?</strong> Contact your seller and ask them to renew their plan. Once renewed, you'll regain access automatically.
// // // // // // //               </p>
// // // // // // //             </div>

// // // // // // //             <button 
// // // // // // //               onClick={() => {
// // // // // // //                 localStorage.clear();
// // // // // // //                 sessionStorage.clear();
// // // // // // //                 window.location.href = '/';
// // // // // // //               }}
// // // // // // //               className="w-full px-6 py-3 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-lg hover:from-red-700 hover:to-orange-700 font-semibold shadow-lg"
// // // // // // //             >
// // // // // // //               Logout
// // // // // // //             </button>
// // // // // // //           </div>
// // // // // // //         </div>
// // // // // // //       );
// // // // // // //     }
// // // // // // //   }

// // // // // // //   // All checks passed - render the protected content
// // // // // // //   return <>{children}</>;
// // // // // // // }; 
// // // // // // // ═══════════════════════════════════════════════════════════════
// // // // // // // ✅ WORKER PROTECTED ROUTE - PRODUCTION v6.0 (REAL-TIME)
// // // // // // // ═══════════════════════════════════════════════════════════════

// // // // // // import React, { useEffect, useState, useRef } from 'react';
// // // // // // import { Navigate } from 'react-router-dom';
// // // // // // import { useAppStore } from '../stores/appStore';
// // // // // // import { AlertCircle, Loader, Shield, XCircle } from 'lucide-react';
// // // // // // import { 
// // // // // //   checkSellerPlanStatus, 
// // // // // //   subscribeToSellerPlanStatus // ✅ NEW
// // // // // // } from '../lib/firebaseutils';
// // // // // // import { auth } from '../lib/firebase';

// // // // // // interface WorkerProtectedRouteProps {
// // // // // //   children: React.ReactNode;
// // // // // // }

// // // // // // export const WorkerProtectedRoute: React.FC<WorkerProtectedRouteProps> = ({ children }) => {
// // // // // //   const { currentUser, isAuthenticated } = useAppStore();
  
// // // // // //   // ─────────────────────────────────────────────────────────────
// // // // // //   // STATE MANAGEMENT
// // // // // //   // ─────────────────────────────────────────────────────────────
  
// // // // // //   const [sellerPlanActive, setSellerPlanActive] = useState<boolean | null>(null);
// // // // // //   const [checkingPlan, setCheckingPlan] = useState(true);
// // // // // //   const [lastChecked, setLastChecked] = useState<Date | null>(null);
// // // // // //   const [realtimeConnected, setRealtimeConnected] = useState(false);
  
// // // // // //   // ✅ Refs to prevent multiple listeners
// // // // // //   const unsubscribeRef = useRef<(() => void) | null>(null);
// // // // // //   const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

// // // // // //   // ═══════════════════════════════════════════════════════════════
// // // // // //   // ✅ REAL-TIME PLAN STATUS MONITORING (PRIMARY METHOD)
// // // // // //   // ═══════════════════════════════════════════════════════════════

// // // // // //   useEffect(() => {
// // // // // //     if (!currentUser || currentUser.role !== 'worker') {
// // // // // //       setCheckingPlan(false);
// // // // // //       return;
// // // // // //     }

// // // // // //     const sellerId = currentUser.seller_id || currentUser.created_by;
    
// // // // // //     if (!sellerId) {
// // // // // //       console.error('❌ Worker has no seller_id');
// // // // // //       setSellerPlanActive(false);
// // // // // //       setCheckingPlan(false);
// // // // // //       return;
// // // // // //     }

// // // // // //     console.log('🔔 Setting up real-time plan monitoring for worker...');
// // // // // //     console.log('   Seller ID:', sellerId);
// // // // // //     console.log('   Worker ID:', currentUser.user_id);

// // // // // //     // ✅ PHASE 1: Initial Check (Cache bypass)
// // // // // //     const initialCheck = async () => {
// // // // // //       try {
// // // // // //         console.log('🔍 Initial plan check (server fetch)...');
        
// // // // // //         const planStatus = await checkSellerPlanStatus(sellerId, {
// // // // // //           source: 'server', // ✅ Force fresh data
// // // // // //           checkExpiry: true
// // // // // //         });

// // // // // //         console.log('📊 Initial status:', planStatus.isActive);
// // // // // //         setSellerPlanActive(planStatus.isActive);
// // // // // //         setLastChecked(new Date());
// // // // // //         setCheckingPlan(false);

// // // // // //         // ✅ If plan inactive, logout worker immediately
// // // // // //         if (!planStatus.isActive && isAuthenticated) {
// // // // // //           console.log('🚨 SELLER PLAN INACTIVE - FORCING WORKER LOGOUT');
// // // // // //           await handleForceLogout('Seller subscription is not active');
// // // // // //         }

// // // // // //       } catch (error: any) {
// // // // // //         console.error('❌ Initial check failed:', error);
// // // // // //         setSellerPlanActive(false);
// // // // // //         setCheckingPlan(false);
// // // // // //       }
// // // // // //     };

// // // // // //     initialCheck();

// // // // // //     // ✅ PHASE 2: Real-time Listener (Primary)
// // // // // //     try {
// // // // // //       console.log('📡 Starting real-time listener...');

// // // // // //       const unsubscribe = subscribeToSellerPlanStatus(
// // // // // //         sellerId,
        
// // // // // //         // ✅ On status change callback
// // // // // //         (isActive, subscription) => {
// // // // // //           console.log('📢 Real-time status update:', isActive);
          
// // // // // //           const wasInactive = sellerPlanActive === false;
// // // // // //           const nowActive = isActive === true;

// // // // // //           setSellerPlanActive(isActive);
// // // // // //           setLastChecked(new Date());
// // // // // //           setRealtimeConnected(true);

// // // // // //           // ✅ CRITICAL: Auto-redirect if plan just activated
// // // // // //           if (wasInactive && nowActive) {
// // // // // //             console.log('🎉 PLAN JUST ACTIVATED! Auto-refreshing...');
            
// // // // // //             // Show success notification
// // // // // //             alert('✅ Seller plan activated! You now have access to scan tiles.');
            
// // // // // //             // Force page reload to clear any cached restrictions
// // // // // //             setTimeout(() => {
// // // // // //               window.location.reload();
// // // // // //             }, 1000);
// // // // // //           }

// // // // // //           // ✅ CRITICAL: Force logout if plan became inactive
// // // // // //           if (!isActive && isAuthenticated) {
// // // // // //             console.log('🚨 PLAN BECAME INACTIVE - FORCING LOGOUT');
// // // // // //             handleForceLogout('Seller subscription expired');
// // // // // //           }
// // // // // //         },
        
// // // // // //         // ✅ On error callback
// // // // // //         (error) => {
// // // // // //           console.error('❌ Real-time listener error:', error);
// // // // // //           setRealtimeConnected(false);
          
// // // // // //           // Fallback to polling if listener fails
// // // // // //           console.log('⚠️ Falling back to polling method...');
// // // // // //           startPolling(sellerId);
// // // // // //         }
// // // // // //       );

// // // // // //       unsubscribeRef.current = unsubscribe;
// // // // // //       console.log('✅ Real-time listener active');

// // // // // //     } catch (error) {
// // // // // //       console.error('❌ Failed to start listener, using polling:', error);
// // // // // //       setRealtimeConnected(false);
// // // // // //       startPolling(sellerId);
// // // // // //     }

// // // // // //     // ✅ PHASE 3: Fallback Polling (Secondary - only if listener fails)
// // // // // //     const startPolling = (sellerId: string) => {
// // // // // //       if (pollingIntervalRef.current) return; // Already polling

// // // // // //       console.log('⏰ Starting fallback polling (every 10 seconds)...');

// // // // // //       pollingIntervalRef.current = setInterval(async () => {
// // // // // //         try {
// // // // // //           console.log('🔄 Polling plan status...');
          
// // // // // //           const planStatus = await checkSellerPlanStatus(sellerId, {
// // // // // //             source: 'server',
// // // // // //             checkExpiry: true
// // // // // //           });

// // // // // //           setSellerPlanActive(planStatus.isActive);
// // // // // //           setLastChecked(new Date());

// // // // // //           if (!planStatus.isActive && isAuthenticated) {
// // // // // //             console.log('🚨 PLAN INACTIVE (polling) - FORCING LOGOUT');
// // // // // //             await handleForceLogout('Seller subscription is not active');
// // // // // //           }

// // // // // //         } catch (error) {
// // // // // //           console.error('❌ Polling check failed:', error);
// // // // // //         }
// // // // // //       }, 10000); // 10 seconds
// // // // // //     };

// // // // // //     // ✅ Cleanup on unmount
// // // // // //     return () => {
// // // // // //       console.log('🛑 Cleaning up plan monitoring...');
      
// // // // // //       if (unsubscribeRef.current) {
// // // // // //         unsubscribeRef.current();
// // // // // //         unsubscribeRef.current = null;
// // // // // //         console.log('✅ Real-time listener stopped');
// // // // // //       }
      
// // // // // //       if (pollingIntervalRef.current) {
// // // // // //         clearInterval(pollingIntervalRef.current);
// // // // // //         pollingIntervalRef.current = null;
// // // // // //         console.log('✅ Polling stopped');
// // // // // //       }
// // // // // //     };

// // // // // //   }, [currentUser, isAuthenticated]);

// // // // // //   // ═══════════════════════════════════════════════════════════════
// // // // // //   // ✅ FORCE LOGOUT FUNCTION
// // // // // //   // ═══════════════════════════════════════════════════════════════

// // // // // //   const handleForceLogout = async (reason: string) => {
// // // // // //     try {
// // // // // //       console.log('🔒 Force logout initiated:', reason);

// // // // // //       // Sign out from Firebase Auth
// // // // // //       await auth.signOut();

// // // // // //       // Clear all storage
// // // // // //       localStorage.clear();
// // // // // //       sessionStorage.clear();

// // // // // //       // Show alert
// // // // // //       alert(`🚫 Access Revoked\n\n${reason}\n\nYou have been logged out.`);

// // // // // //       // Redirect to home
// // // // // //       window.location.href = '/';

// // // // // //     } catch (error) {
// // // // // //       console.error('❌ Logout error:', error);
// // // // // //       // Force redirect anyway
// // // // // //       window.location.href = '/';
// // // // // //     }
// // // // // //   };

// // // // // //   // ═══════════════════════════════════════════════════════════════
// // // // // //   // ✅ RENDER: LOADING STATE
// // // // // //   // ═══════════════════════════════════════════════════════════════

// // // // // //   if (currentUser === undefined || checkingPlan) {
// // // // // //     return (
// // // // // //       <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
// // // // // //         <div className="text-center">
// // // // // //           <Loader className="w-10 h-10 animate-spin text-blue-600 mx-auto mb-4" />
// // // // // //           <p className="text-base text-gray-600">
// // // // // //             {checkingPlan ? 'Verifying access permissions...' : 'Checking authentication...'}
// // // // // //           </p>
// // // // // //           {realtimeConnected && (
// // // // // //             <p className="text-xs text-green-600 mt-2">
// // // // // //               📡 Real-time monitoring active
// // // // // //             </p>
// // // // // //           )}
// // // // // //           {lastChecked && (
// // // // // //             <p className="text-xs text-gray-500 mt-1">
// // // // // //               Last checked: {lastChecked.toLocaleTimeString()}
// // // // // //             </p>
// // // // // //           )}
// // // // // //         </div>
// // // // // //       </div>
// // // // // //     );
// // // // // //   }

// // // // // //   // ═══════════════════════════════════════════════════════════════
// // // // // //   // ✅ RENDER: NOT AUTHENTICATED
// // // // // //   // ═══════════════════════════════════════════════════════════════

// // // // // //   if (!isAuthenticated || !currentUser) {
// // // // // //     return <Navigate to="/" replace />;
// // // // // //   }

// // // // // //   // ═══════════════════════════════════════════════════════════════
// // // // // //   // ✅ RENDER: INVALID ROLE
// // // // // //   // ═══════════════════════════════════════════════════════════════

// // // // // //   const allowedRoles = ['worker', 'seller', 'admin'];
// // // // // //   if (!allowedRoles.includes(currentUser.role)) {
// // // // // //     return (
// // // // // //       <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-8">
// // // // // //         <div className="text-center max-w-md w-full mx-auto bg-white rounded-xl shadow-lg p-8">
// // // // // //           <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
// // // // // //           <h2 className="text-2xl font-semibold text-gray-800 mb-4">Access Denied</h2>
// // // // // //           <p className="text-base text-gray-600 mb-6">
// // // // // //             You don't have permission to access this page.
// // // // // //           </p>
// // // // // //           <button 
// // // // // //             onClick={() => window.location.href = '/'}
// // // // // //             className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
// // // // // //           >
// // // // // //             Go to Home
// // // // // //           </button>
// // // // // //         </div>
// // // // // //       </div>
// // // // // //     );
// // // // // //   }

// // // // // //   // ═══════════════════════════════════════════════════════════════
// // // // // //   // ✅ WORKER-SPECIFIC CHECKS
// // // // // //   // ═══════════════════════════════════════════════════════════════

// // // // // //   if (currentUser.role === 'worker') {
    
// // // // // //     // ✅ CHECK 1: Worker account disabled
// // // // // //     if (currentUser.is_active === false) {
// // // // // //       return (
// // // // // //         <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-8">
// // // // // //           <div className="text-center max-w-md w-full mx-auto bg-white rounded-xl shadow-lg p-8">
// // // // // //             <XCircle className="w-16 h-16 text-orange-500 mx-auto mb-4 animate-pulse" />
// // // // // //             <h2 className="text-2xl font-semibold text-gray-800 mb-4">Account Disabled</h2>
// // // // // //             <p className="text-base text-gray-600 mb-6">
// // // // // //               Your worker account has been disabled by the seller. Please contact them to reactivate your account.
// // // // // //             </p>
// // // // // //             <button 
// // // // // //               onClick={() => handleForceLogout('Account disabled')}
// // // // // //               className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700"
// // // // // //             >
// // // // // //               Logout
// // // // // //             </button>
// // // // // //           </div>
// // // // // //         </div>
// // // // // //       );
// // // // // //     }

// // // // // //     // ✅ CHECK 2: Worker account deleted
// // // // // //     if (currentUser.account_status === 'deleted') {
// // // // // //       return (
// // // // // //         <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-8">
// // // // // //           <div className="text-center max-w-md w-full mx-auto bg-white rounded-xl shadow-lg p-8">
// // // // // //             <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
// // // // // //             <h2 className="text-2xl font-semibold text-gray-800 mb-4">Account Not Found</h2>
// // // // // //             <p className="text-base text-gray-600 mb-6">
// // // // // //               Your worker account has been removed. Please contact the seller for a new account.
// // // // // //             </p>
// // // // // //             <button 
// // // // // //               onClick={() => handleForceLogout('Account deleted')}
// // // // // //               className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700"
// // // // // //             >
// // // // // //               Logout
// // // // // //             </button>
// // // // // //           </div>
// // // // // //         </div>
// // // // // //       );
// // // // // //     }

// // // // // //     // ✅ CHECK 3: SELLER'S PLAN EXPIRED/INACTIVE
// // // // // //     if (sellerPlanActive === false) {
// // // // // //       return (
// // // // // //         <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50 px-4 py-8">
// // // // // //           <div className="text-center max-w-md w-full mx-auto bg-white rounded-xl shadow-2xl p-8 border-2 border-red-200">
// // // // // //             <Shield className="w-20 h-20 text-red-600 mx-auto mb-4 animate-pulse" />
// // // // // //             <h2 className="text-2xl font-bold text-gray-800 mb-4">🚫 Access Suspended</h2>
            
// // // // // //             <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 mb-6">
// // // // // //               <p className="text-red-900 font-semibold mb-2">
// // // // // //                 Seller's Subscription Has Expired
// // // // // //               </p>
// // // // // //               <p className="text-sm text-red-700">
// // // // // //                 The seller's plan is no longer active. You cannot access the system until they renew their subscription.
// // // // // //               </p>
// // // // // //             </div>

// // // // // //             <div className="text-left space-y-2 mb-6 text-sm text-gray-700 bg-gray-50 p-4 rounded-lg">
// // // // // //               <p className="flex items-center gap-2">
// // // // // //                 <span className="text-red-500">✗</span>
// // // // // //                 <span>QR Scanning: Disabled</span>
// // // // // //               </p>
// // // // // //               <p className="flex items-center gap-2">
// // // // // //                 <span className="text-red-500">✗</span>
// // // // // //                 <span>Tile Management: Disabled</span>
// // // // // //               </p>
// // // // // //               <p className="flex items-center gap-2">
// // // // // //                 <span className="text-red-500">✗</span>
// // // // // //                 <span>All Features: Locked</span>
// // // // // //               </p>
// // // // // //             </div>

// // // // // //             <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-6">
// // // // // //               <p className="text-sm text-blue-800">
// // // // // //                 💡 <strong>What to do?</strong> Contact your seller and ask them to renew their plan. 
// // // // // //                 Access will be restored automatically once renewed.
// // // // // //               </p>
// // // // // //             </div>

// // // // // //             {realtimeConnected && (
// // // // // //               <div className="bg-green-50 border border-green-200 rounded-lg p-2 mb-4">
// // // // // //                 <p className="text-xs text-green-700">
// // // // // //                   📡 Monitoring plan status in real-time...
// // // // // //                 </p>
// // // // // //               </div>
// // // // // //             )}

// // // // // //             <button 
// // // // // //               onClick={() => handleForceLogout('Seller plan inactive')}
// // // // // //               className="w-full px-6 py-3 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-lg hover:from-red-700 hover:to-orange-700 font-semibold shadow-lg"
// // // // // //             >
// // // // // //               Logout
// // // // // //             </button>
// // // // // //           </div>
// // // // // //         </div>
// // // // // //       );
// // // // // //     }
// // // // // //   }

// // // // // //   // ═══════════════════════════════════════════════════════════════
// // // // // //   // ✅ ALL CHECKS PASSED - RENDER PROTECTED CONTENT
// // // // // //   // ═══════════════════════════════════════════════════════════════

// // // // // //   return <>{children}</>;
// // // // // // };

// // // // // // console.log('✅ WorkerProtectedRoute loaded - PRODUCTION v6.0 (REAL-TIME)'); 
// // // // // // ═══════════════════════════════════════════════════════════════
// // // // // // ✅ WORKER PROTECTED ROUTE - PRODUCTION v7.0 (COMPLETE)
// // // // // // ═══════════════════════════════════════════════════════════════

// // // // // import React, { useEffect, useState, useRef } from 'react';
// // // // // import { Navigate } from 'react-router-dom';
// // // // // import { useAppStore } from '../stores/appStore';
// // // // // import { AlertCircle, Loader, Shield, XCircle } from 'lucide-react';
// // // // // import { 
// // // // //   checkSellerPlanStatus, 
// // // // //   subscribeToSellerPlanStatus
// // // // // } from '../lib/firebaseutils';
// // // // // import { auth } from '../lib/firebase';

// // // // // interface WorkerProtectedRouteProps {
// // // // //   children: React.ReactNode;
// // // // // }

// // // // // export const WorkerProtectedRoute: React.FC<WorkerProtectedRouteProps> = ({ children }) => {
// // // // //   const { currentUser, isAuthenticated } = useAppStore();
  
// // // // //   // ─────────────────────────────────────────────────────────────
// // // // //   // STATE MANAGEMENT
// // // // //   // ─────────────────────────────────────────────────────────────
  
// // // // //   const [sellerPlanActive, setSellerPlanActive] = useState<boolean | null>(null);
// // // // //   const [checkingPlan, setCheckingPlan] = useState(true);
// // // // //   const [lastChecked, setLastChecked] = useState<Date | null>(null);
// // // // //   const [realtimeConnected, setRealtimeConnected] = useState(false);
  
// // // // //   // ✅ Refs to prevent multiple listeners
// // // // //   const unsubscribeRef = useRef<(() => void) | null>(null);
// // // // //   const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

// // // // //   // ═══════════════════════════════════════════════════════════════
// // // // //   // ✅ REAL-TIME PLAN STATUS MONITORING
// // // // //   // ═══════════════════════════════════════════════════════════════

// // // // //   useEffect(() => {
// // // // //     if (!currentUser || currentUser.role !== 'worker') {
// // // // //       setCheckingPlan(false);
// // // // //       return;
// // // // //     }

// // // // //     // ✅ ENHANCED: Multiple fallback methods to get seller_id
// // // // //     const sellerId = 
// // // // //       currentUser.seller_id || 
// // // // //       currentUser.created_by || 
// // // // //       (currentUser as any).sellerId || 
// // // // //       (currentUser as any).createdBy;
    
// // // // //     if (!sellerId) {
// // // // //       console.error('❌ Worker has no seller_id');
// // // // //       console.error('📊 Worker profile:', currentUser);
// // // // //       console.error('🔑 Available fields:', Object.keys(currentUser));
      
// // // // //       // ✅ Show detailed error
// // // // //       setSellerPlanActive(false);
// // // // //       setCheckingPlan(false);
      
// // // // //       // ✅ Alert user with detailed info
// // // // //       setTimeout(() => {
// // // // //         alert(
// // // // //           '⚠️ Configuration Error\n\n' +
// // // // //           'Your worker account is missing required seller information.\n\n' +
// // // // //           'Technical Details:\n' +
// // // // //           `• Worker ID: ${currentUser.user_id}\n` +
// // // // //           `• Email: ${currentUser.email}\n` +
// // // // //           `• Missing: seller_id field\n\n` +
// // // // //           'Please contact your seller to recreate your account.\n\n' +
// // // // //           'You will be logged out for security.'
// // // // //         );
        
// // // // //         // Force logout
// // // // //         handleForceLogout('Missing seller_id configuration');
// // // // //       }, 1000);
      
// // // // //       return;
// // // // //     }

// // // // //     console.log('🔔 Setting up real-time plan monitoring for worker...');
// // // // //     console.log('   Seller ID:', sellerId);
// // // // //     console.log('   Worker ID:', currentUser.user_id);
// // // // //     console.log('   Worker Email:', currentUser.email);

// // // // //     // ✅ PHASE 1: Initial Check (Cache bypass)
// // // // //     const initialCheck = async () => {
// // // // //       try {
// // // // //         console.log('🔍 Initial plan check (server fetch)...');
        
// // // // //         const planStatus = await checkSellerPlanStatus(sellerId, {
// // // // //           source: 'server',
// // // // //           checkExpiry: true
// // // // //         });

// // // // //         console.log('📊 Initial status:', planStatus.isActive);
// // // // //         setSellerPlanActive(planStatus.isActive);
// // // // //         setLastChecked(new Date());
// // // // //         setCheckingPlan(false);

// // // // //         // ✅ If plan inactive, logout worker immediately
// // // // //         if (!planStatus.isActive && isAuthenticated) {
// // // // //           console.log('🚨 SELLER PLAN INACTIVE - FORCING WORKER LOGOUT');
// // // // //           await handleForceLogout('Seller subscription is not active');
// // // // //         }

// // // // //       } catch (error: any) {
// // // // //         console.error('❌ Initial check failed:', error);
// // // // //         setSellerPlanActive(false);
// // // // //         setCheckingPlan(false);
// // // // //       }
// // // // //     };

// // // // //     initialCheck();

// // // // //     // ✅ PHASE 2: Real-time Listener (Primary)
// // // // //     try {
// // // // //       console.log('📡 Starting real-time listener...');

// // // // //       const unsubscribe = subscribeToSellerPlanStatus(
// // // // //         sellerId,
        
// // // // //         // ✅ On status change callback
// // // // //         (isActive, subscription) => {
// // // // //           console.log('📢 Real-time status update:', isActive);
          
// // // // //           const wasInactive = sellerPlanActive === false;
// // // // //           const nowActive = isActive === true;

// // // // //           setSellerPlanActive(isActive);
// // // // //           setLastChecked(new Date());
// // // // //           setRealtimeConnected(true);

// // // // //           // ✅ CRITICAL: Auto-redirect if plan just activated
// // // // //           if (wasInactive && nowActive) {
// // // // //             console.log('🎉 PLAN JUST ACTIVATED! Auto-refreshing...');
            
// // // // //             // Show success notification
// // // // //             alert('✅ Seller plan activated! You now have access to scan tiles.');
            
// // // // //             // Force page reload
// // // // //             setTimeout(() => {
// // // // //               window.location.reload();
// // // // //             }, 1000);
// // // // //           }

// // // // //           // ✅ CRITICAL: Force logout if plan became inactive
// // // // //           if (!isActive && isAuthenticated) {
// // // // //             console.log('🚨 PLAN BECAME INACTIVE - FORCING LOGOUT');
// // // // //             handleForceLogout('Seller subscription expired');
// // // // //           }
// // // // //         },
        
// // // // //         // ✅ On error callback
// // // // //         (error) => {
// // // // //           console.error('❌ Real-time listener error:', error);
// // // // //           setRealtimeConnected(false);
          
// // // // //           // Fallback to polling
// // // // //           console.log('⚠️ Falling back to polling method...');
// // // // //           startPolling(sellerId);
// // // // //         }
// // // // //       );

// // // // //       unsubscribeRef.current = unsubscribe;
// // // // //       console.log('✅ Real-time listener active');

// // // // //     } catch (error) {
// // // // //       console.error('❌ Failed to start listener, using polling:', error);
// // // // //       setRealtimeConnected(false);
// // // // //       startPolling(sellerId);
// // // // //     }

// // // // //     // ✅ PHASE 3: Fallback Polling
// // // // //     const startPolling = (sellerId: string) => {
// // // // //       if (pollingIntervalRef.current) return;

// // // // //       console.log('⏰ Starting fallback polling (every 10 seconds)...');

// // // // //       pollingIntervalRef.current = setInterval(async () => {
// // // // //         try {
// // // // //           console.log('🔄 Polling plan status...');
          
// // // // //           const planStatus = await checkSellerPlanStatus(sellerId, {
// // // // //             source: 'server',
// // // // //             checkExpiry: true
// // // // //           });

// // // // //           setSellerPlanActive(planStatus.isActive);
// // // // //           setLastChecked(new Date());

// // // // //           if (!planStatus.isActive && isAuthenticated) {
// // // // //             console.log('🚨 PLAN INACTIVE (polling) - FORCING LOGOUT');
// // // // //             await handleForceLogout('Seller subscription is not active');
// // // // //           }

// // // // //         } catch (error) {
// // // // //           console.error('❌ Polling check failed:', error);
// // // // //         }
// // // // //       }, 10000);
// // // // //     };

// // // // //     // ✅ Cleanup on unmount
// // // // //     return () => {
// // // // //       console.log('🛑 Cleaning up plan monitoring...');
      
// // // // //       if (unsubscribeRef.current) {
// // // // //         unsubscribeRef.current();
// // // // //         unsubscribeRef.current = null;
// // // // //         console.log('✅ Real-time listener stopped');
// // // // //       }
      
// // // // //       if (pollingIntervalRef.current) {
// // // // //         clearInterval(pollingIntervalRef.current);
// // // // //         pollingIntervalRef.current = null;
// // // // //         console.log('✅ Polling stopped');
// // // // //       }
// // // // //     };

// // // // //   }, [currentUser, isAuthenticated]);

// // // // //   // ═══════════════════════════════════════════════════════════════
// // // // //   // ✅ FORCE LOGOUT FUNCTION
// // // // //   // ═══════════════════════════════════════════════════════════════

// // // // //   const handleForceLogout = async (reason: string) => {
// // // // //     try {
// // // // //       console.log('🔒 Force logout initiated:', reason);

// // // // //       // Sign out from Firebase Auth
// // // // //       await auth.signOut();

// // // // //       // Clear all storage
// // // // //       localStorage.clear();
// // // // //       sessionStorage.clear();

// // // // //       // Show alert
// // // // //       alert(`🚫 Access Revoked\n\n${reason}\n\nYou have been logged out.`);

// // // // //       // Redirect to home
// // // // //       window.location.href = '/';

// // // // //     } catch (error) {
// // // // //       console.error('❌ Logout error:', error);
// // // // //       // Force redirect anyway
// // // // //       window.location.href = '/';
// // // // //     }
// // // // //   };

// // // // //   // ═══════════════════════════════════════════════════════════════
// // // // //   // ✅ RENDER: LOADING STATE
// // // // //   // ═══════════════════════════════════════════════════════════════

// // // // //   if (currentUser === undefined || checkingPlan) {
// // // // //     return (
// // // // //       <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
// // // // //         <div className="text-center">
// // // // //           <Loader className="w-10 h-10 animate-spin text-blue-600 mx-auto mb-4" />
// // // // //           <p className="text-base text-gray-600">
// // // // //             {checkingPlan ? 'Verifying access permissions...' : 'Checking authentication...'}
// // // // //           </p>
// // // // //           {realtimeConnected && (
// // // // //             <p className="text-xs text-green-600 mt-2 flex items-center justify-center gap-1">
// // // // //               <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
// // // // //               Real-time monitoring active
// // // // //             </p>
// // // // //           )}
// // // // //           {lastChecked && (
// // // // //             <p className="text-xs text-gray-500 mt-1">
// // // // //               Last checked: {lastChecked.toLocaleTimeString()}
// // // // //             </p>
// // // // //           )}
// // // // //         </div>
// // // // //       </div>
// // // // //     );
// // // // //   }

// // // // //   // ═══════════════════════════════════════════════════════════════
// // // // //   // ✅ RENDER: NOT AUTHENTICATED
// // // // //   // ═══════════════════════════════════════════════════════════════

// // // // //   if (!isAuthenticated || !currentUser) {
// // // // //     return <Navigate to="/" replace />;
// // // // //   }

// // // // //   // ═══════════════════════════════════════════════════════════════
// // // // //   // ✅ RENDER: INVALID ROLE
// // // // //   // ═══════════════════════════════════════════════════════════════

// // // // //   const allowedRoles = ['worker', 'seller', 'admin'];
// // // // //   if (!allowedRoles.includes(currentUser.role)) {
// // // // //     return (
// // // // //       <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-8">
// // // // //         <div className="text-center max-w-md w-full mx-auto bg-white rounded-xl shadow-lg p-8">
// // // // //           <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
// // // // //           <h2 className="text-2xl font-semibold text-gray-800 mb-4">Access Denied</h2>
// // // // //           <p className="text-base text-gray-600 mb-6">
// // // // //             You don't have permission to access this page.
// // // // //           </p>
// // // // //           <button 
// // // // //             onClick={() => window.location.href = '/'}
// // // // //             className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
// // // // //           >
// // // // //             Go to Home
// // // // //           </button>
// // // // //         </div>
// // // // //       </div>
// // // // //     );
// // // // //   }

// // // // //   // ═══════════════════════════════════════════════════════════════
// // // // //   // ✅ WORKER-SPECIFIC CHECKS
// // // // //   // ═══════════════════════════════════════════════════════════════

// // // // //   if (currentUser.role === 'worker') {
    
// // // // //     // ✅ CHECK 1: Worker account disabled
// // // // //     if (currentUser.is_active === false) {
// // // // //       return (
// // // // //         <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-8">
// // // // //           <div className="text-center max-w-md w-full mx-auto bg-white rounded-xl shadow-lg p-8">
// // // // //             <XCircle className="w-16 h-16 text-orange-500 mx-auto mb-4 animate-pulse" />
// // // // //             <h2 className="text-2xl font-semibold text-gray-800 mb-4">Account Disabled</h2>
// // // // //             <p className="text-base text-gray-600 mb-6">
// // // // //               Your worker account has been disabled by the seller. Please contact them to reactivate your account.
// // // // //             </p>
// // // // //             <button 
// // // // //               onClick={() => handleForceLogout('Account disabled')}
// // // // //               className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
// // // // //             >
// // // // //               Logout
// // // // //             </button>
// // // // //           </div>
// // // // //         </div>
// // // // //       );
// // // // //     }

// // // // //     // ✅ CHECK 2: Worker account deleted
// // // // //     if (currentUser.account_status === 'deleted') {
// // // // //       return (
// // // // //         <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-8">
// // // // //           <div className="text-center max-w-md w-full mx-auto bg-white rounded-xl shadow-lg p-8">
// // // // //             <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
// // // // //             <h2 className="text-2xl font-semibold text-gray-800 mb-4">Account Not Found</h2>
// // // // //             <p className="text-base text-gray-600 mb-6">
// // // // //               Your worker account has been removed. Please contact the seller for a new account.
// // // // //             </p>
// // // // //             <button 
// // // // //               onClick={() => handleForceLogout('Account deleted')}
// // // // //               className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
// // // // //             >
// // // // //               Logout
// // // // //             </button>
// // // // //           </div>
// // // // //         </div>
// // // // //       );
// // // // //     }

// // // // //     // ✅ CHECK 3: SELLER'S PLAN EXPIRED/INACTIVE
// // // // //     if (sellerPlanActive === false) {
// // // // //       return (
// // // // //         <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50 px-4 py-8">
// // // // //           <div className="text-center max-w-md w-full mx-auto bg-white rounded-xl shadow-2xl p-8 border-2 border-red-200">
// // // // //             <Shield className="w-20 h-20 text-red-600 mx-auto mb-4 animate-pulse" />
// // // // //             <h2 className="text-2xl font-bold text-gray-800 mb-4">🚫 Access Suspended</h2>
            
// // // // //             <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 mb-6">
// // // // //               <p className="text-red-900 font-semibold mb-2">
// // // // //                 Seller's Subscription Has Expired
// // // // //               </p>
// // // // //               <p className="text-sm text-red-700">
// // // // //                 The seller's plan is no longer active. You cannot access the system until they renew their subscription.
// // // // //               </p>
// // // // //             </div>

// // // // //             <div className="text-left space-y-2 mb-6 text-sm text-gray-700 bg-gray-50 p-4 rounded-lg">
// // // // //               <p className="flex items-center gap-2">
// // // // //                 <span className="text-red-500">✗</span>
// // // // //                 <span>QR Scanning: Disabled</span>
// // // // //               </p>
// // // // //               <p className="flex items-center gap-2">
// // // // //                 <span className="text-red-500">✗</span>
// // // // //                 <span>Tile Management: Disabled</span>
// // // // //               </p>
// // // // //               <p className="flex items-center gap-2">
// // // // //                 <span className="text-red-500">✗</span>
// // // // //                 <span>All Features: Locked</span>
// // // // //               </p>
// // // // //             </div>

// // // // //             <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-6">
// // // // //               <p className="text-sm text-blue-800">
// // // // //                 💡 <strong>What to do?</strong> Contact your seller and ask them to renew their plan. 
// // // // //                 Access will be restored automatically once renewed.
// // // // //               </p>
// // // // //             </div>

// // // // //             {realtimeConnected && (
// // // // //               <div className="bg-green-50 border border-green-200 rounded-lg p-2 mb-4">
// // // // //                 <p className="text-xs text-green-700 flex items-center justify-center gap-1">
// // // // //                   <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
// // // // //                   Monitoring plan status in real-time...
// // // // //                 </p>
// // // // //               </div>
// // // // //             )}

// // // // //             <button 
// // // // //               onClick={() => handleForceLogout('Seller plan inactive')}
// // // // //               className="w-full px-6 py-3 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-lg hover:from-red-700 hover:to-orange-700 font-semibold shadow-lg transition-all"
// // // // //             >
// // // // //               Logout
// // // // //             </button>
// // // // //           </div>
// // // // //         </div>
// // // // //       );
// // // // //     }
// // // // //   }

// // // // //   // ═══════════════════════════════════════════════════════════════
// // // // //   // ✅ ALL CHECKS PASSED - RENDER PROTECTED CONTENT
// // // // //   // ═══════════════════════════════════════════════════════════════

// // // // //   return <>{children}</>;
// // // // // };

// // // // // console.log('✅ WorkerProtectedRoute loaded - PRODUCTION v7.0 (COMPLETE)'); 
// // // // // ═══════════════════════════════════════════════════════════════
// // // // // ✅ WORKER PROTECTED ROUTE - PRODUCTION v8.0 (COMPLETE FIX)
// // // // // ═══════════════════════════════════════════════════════════════

// // // // import React, { useEffect, useState, useRef } from 'react';
// // // // import { Navigate } from 'react-router-dom';
// // // // import { useAppStore } from '../stores/appStore';
// // // // import { AlertCircle, Loader, Shield, XCircle } from 'lucide-react';
// // // // import { 
// // // //   checkSellerPlanStatus, 
// // // //   subscribeToSellerPlanStatus
// // // // } from '../lib/firebaseutils';
// // // // import { auth } from '../lib/firebase';

// // // // interface WorkerProtectedRouteProps {
// // // //   children: React.ReactNode;
// // // // }

// // // // export const WorkerProtectedRoute: React.FC<WorkerProtectedRouteProps> = ({ children }) => {
// // // //   const { currentUser, isAuthenticated } = useAppStore();
  
// // // //   // ─────────────────────────────────────────────────────────────
// // // //   // STATE MANAGEMENT
// // // //   // ─────────────────────────────────────────────────────────────
  
// // // //   const [sellerPlanActive, setSellerPlanActive] = useState<boolean | null>(null);
// // // //   const [checkingPlan, setCheckingPlan] = useState(true);
// // // //   const [lastChecked, setLastChecked] = useState<Date | null>(null);
// // // //   const [realtimeConnected, setRealtimeConnected] = useState(false);
  
// // // //   // ✅ Refs to prevent multiple listeners
// // // //   const unsubscribeRef = useRef<(() => void) | null>(null);
// // // //   const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

// // // //   // ═══════════════════════════════════════════════════════════════
// // // //   // ✅ FORCE LOGOUT FUNCTION (DECLARE FIRST)
// // // //   // ═══════════════════════════════════════════════════════════════

// // // //   const handleForceLogout = async (reason: string) => {
// // // //     try {
// // // //       console.log('🔒 Force logout initiated:', reason);

// // // //       // Sign out from Firebase Auth
// // // //       await auth.signOut();

// // // //       // Clear all storage
// // // //       localStorage.clear();
// // // //       sessionStorage.clear();

// // // //       // Show alert
// // // //       alert(`🚫 Access Revoked\n\n${reason}\n\nYou have been logged out.`);

// // // //       // Redirect to home
// // // //       window.location.href = '/';

// // // //     } catch (error) {
// // // //       console.error('❌ Logout error:', error);
// // // //       // Force redirect anyway
// // // //       window.location.href = '/';
// // // //     }
// // // //   };

// // // //   // ═══════════════════════════════════════════════════════════════
// // // //   // ✅ REAL-TIME PLAN STATUS MONITORING
// // // //   // ═══════════════════════════════════════════════════════════════

// // // //   useEffect(() => {
// // // //     if (!currentUser || currentUser.role !== 'worker') {
// // // //       setCheckingPlan(false);
// // // //       return;
// // // //     }

// // // //     // ✅ ENHANCED: Multiple fallback methods to get seller_id
// // // //     const sellerId = 
// // // //       currentUser.seller_id || 
// // // //       currentUser.created_by || 
// // // //       (currentUser as any).sellerId || 
// // // //       (currentUser as any).createdBy;
    
// // // //     if (!sellerId) {
// // // //       console.error('❌ Worker has no seller_id');
// // // //       console.error('📊 Worker profile:', currentUser);
// // // //       console.error('🔑 Available fields:', Object.keys(currentUser));
      
// // // //       // ✅ Show detailed error
// // // //       setSellerPlanActive(false);
// // // //       setCheckingPlan(false);
      
// // // //       // ✅ Alert user with detailed info
// // // //       setTimeout(() => {
// // // //         alert(
// // // //           '⚠️ Configuration Error\n\n' +
// // // //           'Your worker account is missing required seller information.\n\n' +
// // // //           'Technical Details:\n' +
// // // //           `• Worker ID: ${currentUser.user_id}\n` +
// // // //           `• Email: ${currentUser.email}\n` +
// // // //           `• Missing: seller_id field\n\n` +
// // // //           'Please contact your seller to recreate your account.\n\n' +
// // // //           'You will be logged out for security.'
// // // //         );
        
// // // //         // Force logout
// // // //         handleForceLogout('Missing seller_id configuration');
// // // //       }, 1000);
      
// // // //       return;
// // // //     }

// // // //     console.log('🔔 Setting up real-time plan monitoring for worker...');
// // // //     console.log('   Seller ID:', sellerId);
// // // //     console.log('   Worker ID:', currentUser.user_id);
// // // //     console.log('   Worker Email:', currentUser.email);

// // // //     // ═══════════════════════════════════════════════════════════════
// // // //     // ✅ DECLARE startPolling FUNCTION FIRST (BEFORE USE)
// // // //     // ═══════════════════════════════════════════════════════════════
    
// // // //     const startPolling = (sellerId: string) => {
// // // //       if (pollingIntervalRef.current) return; // Already polling

// // // //       console.log('⏰ Starting fallback polling (every 10 seconds)...');

// // // //       pollingIntervalRef.current = setInterval(async () => {
// // // //         try {
// // // //           console.log('🔄 Polling plan status...');
          
// // // //           const planStatus = await checkSellerPlanStatus(sellerId, {
// // // //             source: 'server',
// // // //             checkExpiry: true
// // // //           });

// // // //           setSellerPlanActive(planStatus.isActive);
// // // //           setLastChecked(new Date());

// // // //           if (!planStatus.isActive && isAuthenticated) {
// // // //             console.log('🚨 PLAN INACTIVE (polling) - FORCING LOGOUT');
// // // //             await handleForceLogout('Seller subscription is not active');
// // // //           }

// // // //         } catch (error) {
// // // //           console.error('❌ Polling check failed:', error);
// // // //         }
// // // //       }, 10000); // 10 seconds
// // // //     };

// // // //     // ✅ PHASE 1: Initial Check (Cache bypass)
// // // //     const initialCheck = async () => {
// // // //       try {
// // // //         console.log('🔍 Initial plan check (server fetch)...');
        
// // // //         const planStatus = await checkSellerPlanStatus(sellerId, {
// // // //           source: 'server',
// // // //           checkExpiry: true
// // // //         });

// // // //         console.log('📊 Initial status:', planStatus.isActive);
// // // //         setSellerPlanActive(planStatus.isActive);
// // // //         setLastChecked(new Date());
// // // //         setCheckingPlan(false);

// // // //         // ✅ If plan inactive, logout worker immediately
// // // //         if (!planStatus.isActive && isAuthenticated) {
// // // //           console.log('🚨 SELLER PLAN INACTIVE - FORCING WORKER LOGOUT');
// // // //           await handleForceLogout('Seller subscription is not active');
// // // //         }

// // // //       } catch (error: any) {
// // // //         console.error('❌ Initial check failed:', error);
// // // //         setSellerPlanActive(false);
// // // //         setCheckingPlan(false);
// // // //       }
// // // //     };

// // // //     initialCheck();

// // // //     // ✅ PHASE 2: Real-time Listener (Primary)
// // // //     try {
// // // //       console.log('📡 Starting real-time listener...');

// // // //       const unsubscribe = subscribeToSellerPlanStatus(
// // // //         sellerId,
        
// // // //         // ✅ On status change callback
// // // //         (isActive, subscription) => {
// // // //           console.log('📢 Real-time status update:', isActive);
          
// // // //           const wasInactive = sellerPlanActive === false;
// // // //           const nowActive = isActive === true;

// // // //           setSellerPlanActive(isActive);
// // // //           setLastChecked(new Date());
// // // //           setRealtimeConnected(true);

// // // //           // ✅ CRITICAL: Auto-redirect if plan just activated
// // // //           if (wasInactive && nowActive) {
// // // //             console.log('🎉 PLAN JUST ACTIVATED! Auto-refreshing...');
            
// // // //             // Show success notification
// // // //             alert('✅ Seller plan activated! You now have access to scan tiles.');
            
// // // //             // Force page reload
// // // //             setTimeout(() => {
// // // //               window.location.reload();
// // // //             }, 1000);
// // // //           }

// // // //           // ✅ CRITICAL: Force logout if plan became inactive
// // // //           if (!isActive && isAuthenticated) {
// // // //             console.log('🚨 PLAN BECAME INACTIVE - FORCING LOGOUT');
// // // //             handleForceLogout('Seller subscription expired');
// // // //           }
// // // //         },
        
// // // //         // ✅ On error callback
// // // //         (error) => {
// // // //           console.error('❌ Real-time listener error:', error);
// // // //           setRealtimeConnected(false);
          
// // // //           // Fallback to polling
// // // //           console.log('⚠️ Falling back to polling method...');
// // // //           startPolling(sellerId); // ✅ Now this works - declared above
// // // //         }
// // // //       );

// // // //       unsubscribeRef.current = unsubscribe;
// // // //       console.log('✅ Real-time listener active');

// // // //     } catch (error) {
// // // //       console.error('❌ Failed to start listener, using polling:', error);
// // // //       setRealtimeConnected(false);
// // // //       startPolling(sellerId); // ✅ Now this works - declared above
// // // //     }

// // // //     // ✅ Cleanup on unmount
// // // //     return () => {
// // // //       console.log('🛑 Cleaning up plan monitoring...');
      
// // // //       if (unsubscribeRef.current) {
// // // //         unsubscribeRef.current();
// // // //         unsubscribeRef.current = null;
// // // //         console.log('✅ Real-time listener stopped');
// // // //       }
      
// // // //       if (pollingIntervalRef.current) {
// // // //         clearInterval(pollingIntervalRef.current);
// // // //         pollingIntervalRef.current = null;
// // // //         console.log('✅ Polling stopped');
// // // //       }
// // // //     };

// // // //   }, [currentUser, isAuthenticated]);

// // // //   // ═══════════════════════════════════════════════════════════════
// // // //   // ✅ RENDER: LOADING STATE
// // // //   // ═══════════════════════════════════════════════════════════════

// // // //   if (currentUser === undefined || checkingPlan) {
// // // //     return (
// // // //       <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
// // // //         <div className="text-center">
// // // //           <Loader className="w-10 h-10 animate-spin text-blue-600 mx-auto mb-4" />
// // // //           <p className="text-base text-gray-600">
// // // //             {checkingPlan ? 'Verifying access permissions...' : 'Checking authentication...'}
// // // //           </p>
// // // //           {realtimeConnected && (
// // // //             <p className="text-xs text-green-600 mt-2 flex items-center justify-center gap-1">
// // // //               <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
// // // //               Real-time monitoring active
// // // //             </p>
// // // //           )}
// // // //           {lastChecked && (
// // // //             <p className="text-xs text-gray-500 mt-1">
// // // //               Last checked: {lastChecked.toLocaleTimeString()}
// // // //             </p>
// // // //           )}
// // // //         </div>
// // // //       </div>
// // // //     );
// // // //   }

// // // //   // ═══════════════════════════════════════════════════════════════
// // // //   // ✅ RENDER: NOT AUTHENTICATED
// // // //   // ═══════════════════════════════════════════════════════════════

// // // //   if (!isAuthenticated || !currentUser) {
// // // //     return <Navigate to="/" replace />;
// // // //   }

// // // //   // ═══════════════════════════════════════════════════════════════
// // // //   // ✅ RENDER: INVALID ROLE
// // // //   // ═══════════════════════════════════════════════════════════════

// // // //   const allowedRoles = ['worker', 'seller', 'admin'];
// // // //   if (!allowedRoles.includes(currentUser.role)) {
// // // //     return (
// // // //       <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-8">
// // // //         <div className="text-center max-w-md w-full mx-auto bg-white rounded-xl shadow-lg p-8">
// // // //           <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
// // // //           <h2 className="text-2xl font-semibold text-gray-800 mb-4">Access Denied</h2>
// // // //           <p className="text-base text-gray-600 mb-6">
// // // //             You don't have permission to access this page.
// // // //           </p>
// // // //           <button 
// // // //             onClick={() => window.location.href = '/'}
// // // //             className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
// // // //           >
// // // //             Go to Home
// // // //           </button>
// // // //         </div>
// // // //       </div>
// // // //     );
// // // //   }

// // // //   // ═══════════════════════════════════════════════════════════════
// // // //   // ✅ WORKER-SPECIFIC CHECKS
// // // //   // ═══════════════════════════════════════════════════════════════

// // // //   if (currentUser.role === 'worker') {
    
// // // //     // ✅ CHECK 1: Worker account disabled
// // // //     if (currentUser.is_active === false) {
// // // //       return (
// // // //         <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-8">
// // // //           <div className="text-center max-w-md w-full mx-auto bg-white rounded-xl shadow-lg p-8">
// // // //             <XCircle className="w-16 h-16 text-orange-500 mx-auto mb-4 animate-pulse" />
// // // //             <h2 className="text-2xl font-semibold text-gray-800 mb-4">Account Disabled</h2>
// // // //             <p className="text-base text-gray-600 mb-6">
// // // //               Your worker account has been disabled by the seller. Please contact them to reactivate your account.
// // // //             </p>
// // // //             <button 
// // // //               onClick={() => handleForceLogout('Account disabled')}
// // // //               className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
// // // //             >
// // // //               Logout
// // // //             </button>
// // // //           </div>
// // // //         </div>
// // // //       );
// // // //     }

// // // //     // ✅ CHECK 2: Worker account deleted
// // // //     if (currentUser.account_status === 'deleted') {
// // // //       return (
// // // //         <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-8">
// // // //           <div className="text-center max-w-md w-full mx-auto bg-white rounded-xl shadow-lg p-8">
// // // //             <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
// // // //             <h2 className="text-2xl font-semibold text-gray-800 mb-4">Account Not Found</h2>
// // // //             <p className="text-base text-gray-600 mb-6">
// // // //               Your worker account has been removed. Please contact the seller for a new account.
// // // //             </p>
// // // //             <button 
// // // //               onClick={() => handleForceLogout('Account deleted')}
// // // //               className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
// // // //             >
// // // //               Logout
// // // //             </button>
// // // //           </div>
// // // //         </div>
// // // //       );
// // // //     }

// // // //     // ✅ CHECK 3: SELLER'S PLAN EXPIRED/INACTIVE
// // // //     if (sellerPlanActive === false) {
// // // //       return (
// // // //         <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50 px-4 py-8">
// // // //           <div className="text-center max-w-md w-full mx-auto bg-white rounded-xl shadow-2xl p-8 border-2 border-red-200">
// // // //             <Shield className="w-20 h-20 text-red-600 mx-auto mb-4 animate-pulse" />
// // // //             <h2 className="text-2xl font-bold text-gray-800 mb-4">🚫 Access Suspended</h2>
            
// // // //             <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 mb-6">
// // // //               <p className="text-red-900 font-semibold mb-2">
// // // //                 Seller's Subscription Has Expired
// // // //               </p>
// // // //               <p className="text-sm text-red-700">
// // // //                 The seller's plan is no longer active. You cannot access the system until they renew their subscription.
// // // //               </p>
// // // //             </div>

// // // //             <div className="text-left space-y-2 mb-6 text-sm text-gray-700 bg-gray-50 p-4 rounded-lg">
// // // //               <p className="flex items-center gap-2">
// // // //                 <span className="text-red-500">✗</span>
// // // //                 <span>QR Scanning: Disabled</span>
// // // //               </p>
// // // //               <p className="flex items-center gap-2">
// // // //                 <span className="text-red-500">✗</span>
// // // //                 <span>Tile Management: Disabled</span>
// // // //               </p>
// // // //               <p className="flex items-center gap-2">
// // // //                 <span className="text-red-500">✗</span>
// // // //                 <span>All Features: Locked</span>
// // // //               </p>
// // // //             </div>

// // // //             <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-6">
// // // //               <p className="text-sm text-blue-800">
// // // //                 💡 <strong>What to do?</strong> Contact your seller and ask them to renew their plan. 
// // // //                 Access will be restored automatically once renewed.
// // // //               </p>
// // // //             </div>

// // // //             {realtimeConnected && (
// // // //               <div className="bg-green-50 border border-green-200 rounded-lg p-2 mb-4">
// // // //                 <p className="text-xs text-green-700 flex items-center justify-center gap-1">
// // // //                   <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
// // // //                   Monitoring plan status in real-time...
// // // //                 </p>
// // // //               </div>
// // // //             )}

// // // //             <button 
// // // //               onClick={() => handleForceLogout('Seller plan inactive')}
// // // //               className="w-full px-6 py-3 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-lg hover:from-red-700 hover:to-orange-700 font-semibold shadow-lg transition-all"
// // // //             >
// // // //               Logout
// // // //             </button>
// // // //           </div>
// // // //         </div>
// // // //       );
// // // //     }
// // // //   }

// // // //   // ═══════════════════════════════════════════════════════════════
// // // //   // ✅ ALL CHECKS PASSED - RENDER PROTECTED CONTENT
// // // //   // ═══════════════════════════════════════════════════════════════

// // // //   return <>{children}</>;
// // // // };

// // // // console.log('✅ WorkerProtectedRoute loaded - PRODUCTION v8.0 (COMPLETE)'); 
// // // import React, { useEffect, useState, useRef } from 'react';
// // // import { Navigate } from 'react-router-dom';
// // // import { useAppStore } from '../stores/appStore';
// // // import { AlertCircle, Loader, Shield, XCircle } from 'lucide-react';
// // // import { 
// // //   checkSellerPlanStatus, 
// // //   subscribeToSellerPlanStatus
// // // } from '../lib/firebaseutils';
// // // import { auth, db } from '../lib/firebase';
// // // import { collection, query, where, getDocs, limit } from 'firebase/firestore';

// // // interface WorkerProtectedRouteProps {
// // //   children: React.ReactNode;
// // // }

// // // interface SellerPlanStatus {
// // //   isActive: boolean;
// // //   expiresAt: Date | null;
// // //   planName: string | null;
// // //   planId: string | null;
// // //   daysRemaining: number;
// // //   loading: boolean;
// // //   lastChecked: Date | null;
// // // }

// // // export const WorkerProtectedRoute: React.FC<WorkerProtectedRouteProps> = ({ children }) => {
// // //   const { currentUser, isAuthenticated } = useAppStore();
  
// // //   // ─────────────────────────────────────────────────────────────
// // //   // STATE MANAGEMENT
// // //   // ─────────────────────────────────────────────────────────────
  
// // //   const [sellerPlanActive, setSellerPlanActive] = useState<boolean | null>(null);
// // //   const [checkingPlan, setCheckingPlan] = useState(true);
// // //   const [lastChecked, setLastChecked] = useState<Date | null>(null);
// // //   const [realtimeConnected, setRealtimeConnected] = useState(false);
  
// // //   // ✅ NEW: Firestore fetch states
// // //   const [fetchedSellerId, setFetchedSellerId] = useState<string | null>(null);
// // //   const [fetchingSellerInfo, setFetchingSellerInfo] = useState(true);
// // //   const [fetchError, setFetchError] = useState<string | null>(null);
  
// // //   // ✅ Refs to prevent multiple listeners
// // //   const unsubscribeRef = useRef<(() => void) | null>(null);
// // //   const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

// // //   // ═══════════════════════════════════════════════════════════════
// // //   // ✅ NEW: FETCH WORKER'S SELLER_ID FROM FIRESTORE
// // //   // ═══════════════════════════════════════════════════════════════

// // //   const fetchWorkerSellerInfo = async () => {
// // //     try {
// // //       console.log('🔍 Fetching worker seller info from Firestore...');
// // //       setFetchingSellerInfo(true);
// // //       setFetchError(null);

// // //       if (!currentUser || !currentUser.user_id) {
// // //         throw new Error('No user ID available');
// // //       }

// // //       // ✅ Check sessionStorage cache first
// // //       const cacheKey = `worker_seller_id_${currentUser.user_id}`;
// // //       const cachedSellerId = sessionStorage.getItem(cacheKey);

// // //       if (cachedSellerId && cachedSellerId.trim()) {
// // //         console.log('✅ Using cached seller_id:', cachedSellerId);
// // //         setFetchedSellerId(cachedSellerId);
// // //         setFetchingSellerInfo(false);
// // //         return;
// // //       }

// // //       // ✅ Query Firestore for worker document
// // //       console.log('📡 Querying Firestore for worker:', currentUser.user_id);
      
// // //       const usersRef = collection(db, 'users');
// // //       const q = query(
// // //         usersRef,
// // //         where('user_id', '==', currentUser.user_id),
// // //         limit(1)
// // //       );

// // //       const snapshot = await getDocs(q);

// // //       if (snapshot.empty) {
// // //         console.error('❌ Worker document not found in Firestore');
// // //         throw new Error('Worker profile not found in database. Please contact support.');
// // //       }

// // //       const workerDoc = snapshot.docs[0];
// // //       const workerData = workerDoc.data();

// // //       console.log('📄 Worker document found:', workerDoc.id);
// // //       console.log('📊 Worker data keys:', Object.keys(workerData));

// // //       // ✅ Extract seller_id with multiple fallback fields
// // //       const sellerId = 
// // //         workerData.seller_id || 
// // //         workerData.created_by || 
// // //         workerData.sellerId || 
// // //         workerData.createdBy ||
// // //         workerData.parent_seller_id;

// // //       if (!sellerId) {
// // //         console.error('❌ seller_id field missing in worker document');
// // //         console.error('📊 Available fields:', Object.keys(workerData));
// // //         console.error('📊 Worker data:', workerData);
        
// // //         throw new Error(
// // //           `Worker account is missing seller information.\n\n` +
// // //           `Technical Details:\n` +
// // //           `• Worker ID: ${currentUser.user_id}\n` +
// // //           `• Email: ${currentUser.email}\n` +
// // //           `• Available fields: ${Object.keys(workerData).join(', ')}\n\n` +
// // //           `Please contact your seller to recreate your account.`
// // //         );
// // //       }

// // //       // ✅ Validate seller_id format
// // //       if (typeof sellerId !== 'string' || sellerId.trim() === '') {
// // //         throw new Error('Invalid seller_id format');
// // //       }

// // //       console.log('✅ seller_id extracted:', sellerId);

// // //       // ✅ Cache in sessionStorage
// // //       sessionStorage.setItem(cacheKey, sellerId);
// // //       console.log('💾 Cached seller_id in sessionStorage');

// // //       setFetchedSellerId(sellerId);
// // //       setFetchingSellerInfo(false);
// // //       setFetchError(null);

// // //     } catch (error: any) {
// // //       console.error('❌ Error fetching worker seller info:', error);
// // //       setFetchError(error.message || 'Failed to fetch worker information');
// // //       setFetchingSellerInfo(false);
      
// // //       // Show alert after state update
// // //       setTimeout(() => {
// // //         alert(
// // //           '⚠️ Worker Account Configuration Error\n\n' +
// // //           error.message +
// // //           '\n\nYou will be logged out for security.'
// // //         );
// // //       }, 500);
// // //     }
// // //   };

// // //   // ═══════════════════════════════════════════════════════════════
// // //   // ✅ FORCE LOGOUT FUNCTION
// // //   // ═══════════════════════════════════════════════════════════════

// // //   const handleForceLogout = async (reason: string) => {
// // //     try {
// // //       console.log('🔒 Force logout initiated:', reason);

// // //       // Sign out from Firebase Auth
// // //       await auth.signOut();

// // //       // Clear all storage
// // //       localStorage.clear();
// // //       sessionStorage.clear();

// // //       // Show alert
// // //       alert(`🚫 Access Revoked\n\n${reason}\n\nYou have been logged out.`);

// // //       // Redirect to home
// // //       window.location.href = '/';

// // //     } catch (error) {
// // //       console.error('❌ Logout error:', error);
// // //       // Force redirect anyway
// // //       window.location.href = '/';
// // //     }
// // //   };

// // //   // ═══════════════════════════════════════════════════════════════
// // //   // ✅ FETCH WORKER INFO ON MOUNT
// // //   // ═══════════════════════════════════════════════════════════════

// // //   useEffect(() => {
// // //     if (!currentUser || currentUser.role !== 'worker') {
// // //       setFetchingSellerInfo(false);
// // //       return;
// // //     }

// // //     console.log('🚀 Worker detected, fetching seller info...');
// // //     fetchWorkerSellerInfo();
// // //   }, [currentUser]);

// // //   // ═══════════════════════════════════════════════════════════════
// // //   // ✅ REAL-TIME PLAN STATUS MONITORING (UPDATED)
// // //   // ═══════════════════════════════════════════════════════════════

// // //   useEffect(() => {
// // //     // ✅ Wait for worker seller info to be fetched first
// // //     if (currentUser?.role === 'worker' && fetchingSellerInfo) {
// // //       console.log('⏳ Waiting for seller info fetch to complete...');
// // //       return;
// // //     }

// // //     if (!currentUser || currentUser.role !== 'worker') {
// // //       setCheckingPlan(false);
// // //       return;
// // //     }

// // //     // ✅ Get seller_id from Firestore fetch result
// // //     let sellerId: string | null = null;

// // //     if (currentUser.role === 'worker') {
// // //       if (fetchError) {
// // //         console.error('❌ Cannot check plan - fetch error:', fetchError);
// // //         setSellerPlanActive(false);
// // //         setCheckingPlan(false);
// // //         return;
// // //       }

// // //       sellerId = fetchedSellerId;
// // //     } else {
// // //       // For sellers/admins (fallback, shouldn't happen)
// // //       sellerId = currentUser.user_id;
// // //     }
    
// // //     if (!sellerId) {
// // //       console.error('❌ No seller_id available after fetch');
// // //       setSellerPlanActive(false);
// // //       setCheckingPlan(false);
// // //       return;
// // //     }

// // //     console.log('🔔 Setting up real-time plan monitoring for worker...');
// // //     console.log('   Seller ID:', sellerId);
// // //     console.log('   Worker ID:', currentUser.user_id);
// // //     console.log('   Worker Email:', currentUser.email);

// // //     // ═══════════════════════════════════════════════════════════════
// // //     // ✅ POLLING FUNCTION
// // //     // ═══════════════════════════════════════════════════════════════
    
// // //     const startPolling = (sellerId: string) => {
// // //       if (pollingIntervalRef.current) return;

// // //       console.log('⏰ Starting fallback polling (every 10 seconds)...');

// // //       pollingIntervalRef.current = setInterval(async () => {
// // //         try {
// // //           console.log('🔄 Polling plan status...');
          
// // //           const planStatus = await checkSellerPlanStatus(sellerId, {
// // //             source: 'server',
// // //             checkExpiry: true
// // //           });

// // //           setSellerPlanActive(planStatus.isActive);
// // //           setLastChecked(new Date());

// // //           if (!planStatus.isActive && isAuthenticated) {
// // //             console.log('🚨 PLAN INACTIVE (polling) - FORCING LOGOUT');
// // //             await handleForceLogout('Seller subscription is not active');
// // //           }

// // //         } catch (error) {
// // //           console.error('❌ Polling check failed:', error);
// // //         }
// // //       }, 10000);
// // //     };

// // //     // ═══════════════════════════════════════════════════════════════
// // //     // ✅ INITIAL PLAN CHECK
// // //     // ═══════════════════════════════════════════════════════════════

// // //     const initialCheck = async () => {
// // //       try {
// // //         console.log('🔍 Initial plan check (server fetch)...');
        
// // //         const planStatus = await checkSellerPlanStatus(sellerId, {
// // //           source: 'server',
// // //           checkExpiry: true
// // //         });

// // //         console.log('📊 Initial status:', planStatus.isActive);
// // //         setSellerPlanActive(planStatus.isActive);
// // //         setLastChecked(new Date());
// // //         setCheckingPlan(false);

// // //         if (!planStatus.isActive && isAuthenticated) {
// // //           console.log('🚨 SELLER PLAN INACTIVE - FORCING WORKER LOGOUT');
// // //           await handleForceLogout('Seller subscription is not active');
// // //         }

// // //       } catch (error: any) {
// // //         console.error('❌ Initial check failed:', error);
// // //         setSellerPlanActive(false);
// // //         setCheckingPlan(false);
// // //       }
// // //     };

// // //     initialCheck();

// // //     // ═══════════════════════════════════════════════════════════════
// // //     // ✅ REAL-TIME LISTENER
// // //     // ═══════════════════════════════════════════════════════════════

// // //     try {
// // //       console.log('📡 Starting real-time listener...');

// // //       const unsubscribe = subscribeToSellerPlanStatus(
// // //         sellerId,
        
// // //         (isActive, subscription) => {
// // //           console.log('📢 Real-time status update:', isActive);
          
// // //           const wasInactive = sellerPlanActive === false;
// // //           const nowActive = isActive === true;

// // //           setSellerPlanActive(isActive);
// // //           setLastChecked(new Date());
// // //           setRealtimeConnected(true);

// // //           if (wasInactive && nowActive) {
// // //             console.log('🎉 PLAN JUST ACTIVATED! Auto-refreshing...');
// // //             alert('✅ Seller plan activated! You now have access to scan tiles.');
// // //             setTimeout(() => {
// // //               window.location.reload();
// // //             }, 1000);
// // //           }

// // //           if (!isActive && isAuthenticated) {
// // //             console.log('🚨 PLAN BECAME INACTIVE - FORCING LOGOUT');
// // //             handleForceLogout('Seller subscription expired');
// // //           }
// // //         },
        
// // //         (error) => {
// // //           console.error('❌ Real-time listener error:', error);
// // //           setRealtimeConnected(false);
// // //           console.log('⚠️ Falling back to polling method...');
// // //           startPolling(sellerId);
// // //         }
// // //       );

// // //       unsubscribeRef.current = unsubscribe;
// // //       console.log('✅ Real-time listener active');

// // //     } catch (error) {
// // //       console.error('❌ Failed to start listener, using polling:', error);
// // //       setRealtimeConnected(false);
// // //       startPolling(sellerId);
// // //     }

// // //     // ✅ Cleanup
// // //     return () => {
// // //       console.log('🛑 Cleaning up plan monitoring...');
      
// // //       if (unsubscribeRef.current) {
// // //         unsubscribeRef.current();
// // //         unsubscribeRef.current = null;
// // //         console.log('✅ Real-time listener stopped');
// // //       }
      
// // //       if (pollingIntervalRef.current) {
// // //         clearInterval(pollingIntervalRef.current);
// // //         pollingIntervalRef.current = null;
// // //         console.log('✅ Polling stopped');
// // //       }
// // //     };

// // //   }, [currentUser, isAuthenticated, fetchedSellerId, fetchingSellerInfo, fetchError]);

// // //   // ═══════════════════════════════════════════════════════════════
// // //   // ✅ RENDER: LOADING STATE (FIRESTORE FETCH)
// // //   // ═══════════════════════════════════════════════════════════════

// // //   if (currentUser?.role === 'worker' && fetchingSellerInfo) {
// // //     return (
// // //       <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
// // //         <div className="text-center max-w-md w-full mx-auto bg-white rounded-xl shadow-lg p-8">
// // //           <Loader className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
// // //           <p className="text-base text-gray-600 mb-2">
// // //             Verifying worker credentials...
// // //           </p>
// // //           <p className="text-xs text-gray-500">
// // //             Fetching seller information from database
// // //           </p>
// // //         </div>
// // //       </div>
// // //     );
// // //   }

// // //   // ═══════════════════════════════════════════════════════════════
// // //   // ✅ RENDER: FETCH ERROR STATE
// // //   // ═══════════════════════════════════════════════════════════════

// // //   if (currentUser?.role === 'worker' && fetchError) {
// // //     return (
// // //       <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50 px-4 py-8">
// // //         <div className="text-center max-w-md w-full mx-auto bg-white rounded-xl shadow-2xl p-8 border-2 border-red-200">
// // //           <AlertCircle className="w-20 h-20 text-red-600 mx-auto mb-4 animate-pulse" />
// // //           <h2 className="text-2xl font-bold text-gray-800 mb-4">Configuration Error</h2>
          
// // //           <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 mb-6 text-left">
// // //             <p className="text-sm text-red-900 font-semibold mb-2">Error Details:</p>
// // //             <p className="text-xs text-red-700 whitespace-pre-wrap break-words">
// // //               {fetchError}
// // //             </p>
// // //           </div>

// // //           <button 
// // //             onClick={() => handleForceLogout('Worker configuration error')}
// // //             className="w-full px-6 py-3 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-lg hover:from-red-700 hover:to-orange-700 font-semibold shadow-lg transition-all"
// // //           >
// // //             Logout
// // //           </button>
// // //         </div>
// // //       </div>
// // //     );
// // //   }

// // //   // ═══════════════════════════════════════════════════════════════
// // //   // ✅ RENDER: PLAN CHECK LOADING
// // //   // ═══════════════════════════════════════════════════════════════

// // //   if (currentUser === undefined || checkingPlan) {
// // //     return (
// // //       <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
// // //         <div className="text-center">
// // //           <Loader className="w-10 h-10 sm:w-12 sm:h-12 animate-spin text-blue-600 mx-auto mb-4" />
// // //           <p className="text-base text-gray-600">
// // //             {checkingPlan ? 'Verifying access permissions...' : 'Checking authentication...'}
// // //           </p>
// // //           {realtimeConnected && (
// // //             <p className="text-xs text-green-600 mt-2 flex items-center justify-center gap-1">
// // //               <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
// // //               Real-time monitoring active
// // //             </p>
// // //           )}
// // //           {lastChecked && (
// // //             <p className="text-xs text-gray-500 mt-1">
// // //               Last checked: {lastChecked.toLocaleTimeString()}
// // //             </p>
// // //           )}
// // //         </div>
// // //       </div>
// // //     );
// // //   }

// // //   // ═══════════════════════════════════════════════════════════════
// // //   // ✅ RENDER: NOT AUTHENTICATED
// // //   // ═══════════════════════════════════════════════════════════════

// // //   if (!isAuthenticated || !currentUser) {
// // //     return <Navigate to="/" replace />;
// // //   }

// // //   // ═══════════════════════════════════════════════════════════════
// // //   // ✅ RENDER: INVALID ROLE
// // //   // ═══════════════════════════════════════════════════════════════

// // //   const allowedRoles = ['worker', 'seller', 'admin'];
// // //   if (!allowedRoles.includes(currentUser.role)) {
// // //     return (
// // //       <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-8">
// // //         <div className="text-center max-w-md w-full mx-auto bg-white rounded-xl shadow-lg p-8">
// // //           <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
// // //           <h2 className="text-2xl font-semibold text-gray-800 mb-4">Access Denied</h2>
// // //           <p className="text-base text-gray-600 mb-6">
// // //             You don't have permission to access this page.
// // //           </p>
// // //           <button 
// // //             onClick={() => window.location.href = '/'}
// // //             className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
// // //           >
// // //             Go to Home
// // //           </button>
// // //         </div>
// // //       </div>
// // //     );
// // //   }

// // //   // ═══════════════════════════════════════════════════════════════
// // //   // ✅ WORKER-SPECIFIC CHECKS
// // //   // ═══════════════════════════════════════════════════════════════

// // //   if (currentUser.role === 'worker') {
    
// // //     // ✅ CHECK 1: Worker account disabled
// // //     if (currentUser.is_active === false) {
// // //       return (
// // //         <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-8">
// // //           <div className="text-center max-w-md w-full mx-auto bg-white rounded-xl shadow-lg p-8">
// // //             <XCircle className="w-16 h-16 text-orange-500 mx-auto mb-4 animate-pulse" />
// // //             <h2 className="text-2xl font-semibold text-gray-800 mb-4">Account Disabled</h2>
// // //             <p className="text-base text-gray-600 mb-6">
// // //               Your worker account has been disabled by the seller. Please contact them to reactivate your account.
// // //             </p>
// // //             <button 
// // //               onClick={() => handleForceLogout('Account disabled')}
// // //               className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
// // //             >
// // //               Logout
// // //             </button>
// // //           </div>
// // //         </div>
// // //       );
// // //     }

// // //     // ✅ CHECK 2: Worker account deleted
// // //     if (currentUser.account_status === 'deleted') {
// // //       return (
// // //         <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-8">
// // //           <div className="text-center max-w-md w-full mx-auto bg-white rounded-xl shadow-lg p-8">
// // //             <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
// // //             <h2 className="text-2xl font-semibold text-gray-800 mb-4">Account Not Found</h2>
// // //             <p className="text-base text-gray-600 mb-6">
// // //               Your worker account has been removed. Please contact the seller for a new account.
// // //             </p>
// // //             <button 
// // //               onClick={() => handleForceLogout('Account deleted')}
// // //               className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
// // //             >
// // //               Logout
// // //             </button>
// // //           </div>
// // //         </div>
// // //       );
// // //     }

// // //     // ✅ CHECK 3: SELLER'S PLAN EXPIRED/INACTIVE
// // //     if (sellerPlanActive === false) {
// // //       return (
// // //         <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50 px-4 py-8">
// // //           <div className="text-center max-w-md w-full mx-auto bg-white rounded-xl shadow-2xl p-8 border-2 border-red-200">
// // //             <Shield className="w-20 h-20 text-red-600 mx-auto mb-4 animate-pulse" />
// // //             <h2 className="text-2xl font-bold text-gray-800 mb-4">🚫 Access Suspended</h2>
            
// // //             <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 mb-6">
// // //               <p className="text-red-900 font-semibold mb-2">
// // //                 Seller's Subscription Has Expired
// // //               </p>
// // //               <p className="text-sm text-red-700">
// // //                 The seller's plan is no longer active. You cannot access the system until they renew their subscription.
// // //               </p>
// // //             </div>

// // //             <div className="text-left space-y-2 mb-6 text-sm text-gray-700 bg-gray-50 p-4 rounded-lg">
// // //               <p className="flex items-center gap-2">
// // //                 <span className="text-red-500">✗</span>
// // //                 <span>QR Scanning: Disabled</span>
// // //               </p>
// // //               <p className="flex items-center gap-2">
// // //                 <span className="text-red-500">✗</span>
// // //                 <span>Tile Management: Disabled</span>
// // //               </p>
// // //               <p className="flex items-center gap-2">
// // //                 <span className="text-red-500">✗</span>
// // //                 <span>All Features: Locked</span>
// // //               </p>
// // //             </div>

// // //             <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-6">
// // //               <p className="text-sm text-blue-800">
// // //                 💡 <strong>What to do?</strong> Contact your seller and ask them to renew their plan. 
// // //                 Access will be restored automatically once renewed.
// // //               </p>
// // //             </div>

// // //             {realtimeConnected && (
// // //               <div className="bg-green-50 border border-green-200 rounded-lg p-2 mb-4">
// // //                 <p className="text-xs text-green-700 flex items-center justify-center gap-1">
// // //                   <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
// // //                   Monitoring plan status in real-time...
// // //                 </p>
// // //               </div>
// // //             )}

// // //             <button 
// // //               onClick={() => handleForceLogout('Seller plan inactive')}
// // //               className="w-full px-6 py-3 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-lg hover:from-red-700 hover:to-orange-700 font-semibold shadow-lg transition-all"
// // //             >
// // //               Logout
// // //             </button>
// // //           </div>
// // //         </div>
// // //       );
// // //     }
// // //   }

// // //   // ═══════════════════════════════════════════════════════════════
// // //   // ✅ ALL CHECKS PASSED - RENDER PROTECTED CONTENT
// // //   // ═══════════════════════════════════════════════════════════════

// // //   return <>{children}</>;
// // // };

// // // console.log('✅ WorkerProtectedRoute loaded - PRODUCTION v9.0 (FIRESTORE FETCH)'); 
// // // ═══════════════════════════════════════════════════════════════
// // // 🛡️ WORKER PROTECTED ROUTE - v13.0 COMPLETE (USES subscriptionService)
// // // ═══════════════════════════════════════════════════════════════

// // import React, { useEffect, useState, useRef } from 'react';
// // import { Navigate } from 'react-router-dom';
// // import { useAppStore } from '../stores/appStore';
// // import { AlertCircle, Loader, Shield, XCircle, RefreshCw } from 'lucide-react';
// // import { getSellerSubscription, isSubscriptionExpired } from '../lib/subscriptionService';
// // import { auth, db } from '../lib/firebase';
// // import { collection, query, where, getDocs, limit, onSnapshot } from 'firebase/firestore';

// // interface WorkerProtectedRouteProps {
// //   children: React.ReactNode;
// // }

// // export const WorkerProtectedRoute: React.FC<WorkerProtectedRouteProps> = ({ children }) => {
// //   const { currentUser, isAuthenticated } = useAppStore();
  
// //   const [sellerPlanActive, setSellerPlanActive] = useState<boolean | null>(null);
// //   const [checkingPlan, setCheckingPlan] = useState(true);
// //   const [fetchedSellerId, setFetchedSellerId] = useState<string | null>(null);
// //   const [fetchingSellerInfo, setFetchingSellerInfo] = useState(true);
// //   const [fetchError, setFetchError] = useState<string | null>(null);
// //   const [realtimeConnected, setRealtimeConnected] = useState(false);
// //   const [lastChecked, setLastChecked] = useState<Date | null>(null);
// //   const [planDetails, setPlanDetails] = useState<string>('');
// //   const [manualChecking, setManualChecking] = useState(false);
  
// //   const unsubscribeRef = useRef<(() => void) | null>(null);
// //   const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
// //   const mountedRef = useRef(true);

// //   const fetchWorkerSellerInfo = async () => {
// //     try {
// //       console.log('🔍 [Worker] Fetching seller ID...');
// //       setFetchingSellerInfo(true);
// //       setFetchError(null);

// //       if (!currentUser || !currentUser.user_id) {
// //         throw new Error('No user ID');
// //       }

// //       const cacheKey = `worker_seller_id_${currentUser.user_id}`;
// //       const cachedSellerId = sessionStorage.getItem(cacheKey);

// //       if (cachedSellerId?.trim()) {
// //         console.log('✅ [Cache] seller_id:', cachedSellerId);
// //         setFetchedSellerId(cachedSellerId);
// //         setFetchingSellerInfo(false);
// //         return;
// //       }

// //       const usersRef = collection(db, 'users');
// //       const q = query(
// //         usersRef,
// //         where('user_id', '==', currentUser.user_id),
// //         limit(1)
// //       );

// //       const snapshot = await getDocs(q);

// //       if (snapshot.empty) {
// //         throw new Error('Worker not found');
// //       }

// //       const workerData = snapshot.docs[0].data();

// //       const sellerId = 
// //         workerData.seller_id || 
// //         workerData.created_by || 
// //         workerData.sellerId;

// //       if (!sellerId) {
// //         throw new Error('Missing seller_id');
// //       }

// //       console.log('✅ [Firestore] seller_id:', sellerId);
// //       sessionStorage.setItem(cacheKey, sellerId);

// //       setFetchedSellerId(sellerId);
// //       setFetchingSellerInfo(false);

// //     } catch (error: any) {
// //       console.error('❌ [Error]:', error);
// //       setFetchError(error.message);
// //       setFetchingSellerInfo(false);
// //     }
// //   };

// //   const checkSellerPlan = async (sellerId: string, source: string = 'unknown'): Promise<boolean> => {
// //     try {
// //       console.log(`🔍 [${source}] Checking:`, sellerId);
      
// //       const subscription = await getSellerSubscription(sellerId, true);
      
// //       if (!subscription) {
// //         setPlanDetails('No subscription');
// //         return false;
// //       }
      
// //       const expired = isSubscriptionExpired(subscription);
// //       const isActive = !expired;
      
// //       const daysLeft = subscription.end_date 
// //         ? Math.ceil((new Date(subscription.end_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
// //         : 0;
      
// //       setPlanDetails(`${subscription.plan_name} (${isActive ? `${daysLeft}d` : 'Expired'})`);
      
// //       console.log(`📊 [${source}] Active:`, isActive);
      
// //       return isActive;
      
// //     } catch (error: any) {
// //       console.error(`❌ [${source}]`, error);
// //       return false;
// //     }
// //   };

// //   const handleManualRefresh = async () => {
// //     if (!fetchedSellerId || manualChecking) return;
    
// //     setManualChecking(true);
    
// //     try {
// //       const isActive = await checkSellerPlan(fetchedSellerId, 'Manual');
      
// //       setSellerPlanActive(isActive);
// //       setLastChecked(new Date());
      
// //       if (isActive) {
// //         alert('✅ Active! Reloading...');
// //         setTimeout(() => window.location.reload(), 500);
// //       } else {
// //         alert('⚠️ Still inactive');
// //       }
      
// //     } catch (error) {
// //       alert('❌ Check failed');
// //     } finally {
// //       setManualChecking(false);
// //     }
// //   };

// //   const handleForceLogout = async (reason: string) => {
// //     try {
// //       if (unsubscribeRef.current) {
// //         unsubscribeRef.current();
// //         unsubscribeRef.current = null;
// //       }
      
// //       if (pollingIntervalRef.current) {
// //         clearInterval(pollingIntervalRef.current);
// //         pollingIntervalRef.current = null;
// //       }

// //       await auth.signOut();
// //       localStorage.clear();
// //       sessionStorage.clear();

// //       alert(`🚫 ${reason}\n\nLogged out.`);
// //       window.location.href = '/';

// //     } catch (error) {
// //       window.location.href = '/';
// //     }
// //   };

// //   useEffect(() => {
// //     mountedRef.current = true;

// //     if (!currentUser || currentUser.role !== 'worker') {
// //       setFetchingSellerInfo(false);
// //       return;
// //     }

// //     fetchWorkerSellerInfo();

// //     return () => {
// //       mountedRef.current = false;
// //     };
// //   }, [currentUser]);

// //   useEffect(() => {
// //     if (currentUser?.role === 'worker' && fetchingSellerInfo) {
// //       return;
// //     }

// //     if (!currentUser || currentUser.role !== 'worker') {
// //       setCheckingPlan(false);
// //       return;
// //     }

// //     if (fetchError) {
// //       setSellerPlanActive(false);
// //       setCheckingPlan(false);
// //       return;
// //     }

// //     const sellerId = fetchedSellerId;
    
// //     if (!sellerId) {
// //       setSellerPlanActive(false);
// //       setCheckingPlan(false);
// //       return;
// //     }

// //     const initialCheck = async () => {
// //       try {
// //         const isActive = await checkSellerPlan(sellerId, 'Initial');
        
// //         if (!mountedRef.current) return;

// //         setSellerPlanActive(isActive);
// //         setLastChecked(new Date());
// //         setCheckingPlan(false);

// //       } catch (error: any) {
// //         if (mountedRef.current) {
// //           setSellerPlanActive(false);
// //           setCheckingPlan(false);
// //         }
// //       }
// //     };

// //     initialCheck();

// //     try {
// //       const subscriptionsRef = collection(db, 'subscriptions');
// //       const q = query(
// //         subscriptionsRef,
// //         where('seller_id', '==', sellerId),
// //         where('status', '==', 'active')
// //       );

// //       const unsubscribe = onSnapshot(
// //         q,
        
// //         async (snapshot) => {
// //           if (!mountedRef.current) return;

// //           if (snapshot.empty) {
// //             const isActive = await checkSellerPlan(sellerId, 'Realtime-Verify');
            
// //             if (!mountedRef.current) return;

// //             const wasActive = sellerPlanActive === true;
            
// //             setSellerPlanActive(isActive);
// //             setLastChecked(new Date());
// //             setRealtimeConnected(true);

// //             if (wasActive && !isActive && isAuthenticated) {
// //               console.log('🚨 Expired');
// //             }
            
// //             return;
// //           }

// //           const isActive = await checkSellerPlan(sellerId, 'Realtime-Active');
          
// //           if (!mountedRef.current) return;

// //           const wasInactive = sellerPlanActive === false;
          
// //           setSellerPlanActive(isActive);
// //           setLastChecked(new Date());
// //           setRealtimeConnected(true);

// //           if (wasInactive && isActive) {
// //             alert('✅ Plan activated!');
// //             setTimeout(() => window.location.reload(), 1000);
// //           }
// //         },
        
// //         (error) => {
// //           if (mountedRef.current) {
// //             setRealtimeConnected(false);
            
// //             if (!pollingIntervalRef.current) {
// //               pollingIntervalRef.current = setInterval(async () => {
// //                 if (!mountedRef.current) return;

// //                 try {
// //                   const isActive = await checkSellerPlan(sellerId, 'Polling');
                  
// //                   if (!mountedRef.current) return;

// //                   const wasInactive = sellerPlanActive === false;

// //                   setSellerPlanActive(isActive);
// //                   setLastChecked(new Date());

// //                   if (wasInactive && isActive) {
// //                     alert('✅ Activated!');
// //                     window.location.reload();
// //                   }

// //                 } catch (error) {
// //                   console.error('❌ Polling error');
// //                 }
// //               }, 30000);
// //             }
// //           }
// //         }
// //       );

// //       unsubscribeRef.current = unsubscribe;
// //       setRealtimeConnected(true);

// //     } catch (error) {
// //       setRealtimeConnected(false);
// //     }

// //     return () => {
// //       if (unsubscribeRef.current) {
// //         unsubscribeRef.current();
// //         unsubscribeRef.current = null;
// //       }
      
// //       if (pollingIntervalRef.current) {
// //         clearInterval(pollingIntervalRef.current);
// //         pollingIntervalRef.current = null;
// //       }
// //     };

// //   }, [currentUser, isAuthenticated, fetchedSellerId, fetchingSellerInfo, fetchError, sellerPlanActive]);

// //   if (currentUser?.role === 'worker' && fetchingSellerInfo) {
// //     return (
// //       <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
// //         <div className="text-center max-w-md w-full bg-white rounded-xl shadow-lg p-8">
// //           <Loader className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
// //           <p className="text-base text-gray-600">Verifying...</p>
// //         </div>
// //       </div>
// //     );
// //   }

// //   if (currentUser?.role === 'worker' && fetchError) {
// //     return (
// //       <div className="min-h-screen flex items-center justify-center bg-red-50 px-4">
// //         <div className="text-center max-w-md w-full bg-white rounded-xl shadow-2xl p-8 border-2 border-red-200">
// //           <AlertCircle className="w-20 h-20 text-red-600 mx-auto mb-4" />
// //           <h2 className="text-2xl font-bold text-gray-800 mb-4">Config Error</h2>
// //           <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 mb-6">
// //             <p className="text-sm text-red-900">{fetchError}</p>
// //           </div>
// //           <button 
// //             onClick={() => handleForceLogout('Config error')}
// //             className="w-full px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold"
// //           >
// //             Logout
// //           </button>
// //         </div>
// //       </div>
// //     );
// //   }

// //   if (currentUser === undefined || checkingPlan) {
// //     return (
// //       <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
// //         <div className="text-center">
// //           <Loader className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
// //           <p className="text-base text-gray-600 mb-2">Verifying access...</p>
// //           {realtimeConnected && (
// //             <p className="text-xs text-green-600 mt-2 flex items-center justify-center gap-1">
// //               <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
// //               Monitoring
// //             </p>
// //           )}
// //           {planDetails && (
// //             <p className="text-xs text-gray-600 mt-1">{planDetails}</p>
// //           )}
// //         </div>
// //       </div>
// //     );
// //   }

// //   if (!isAuthenticated || !currentUser) {
// //     return <Navigate to="/" replace />;
// //   }

// //   const allowedRoles = ['worker', 'seller', 'admin'];
// //   if (!allowedRoles.includes(currentUser.role)) {
// //     return (
// //       <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
// //         <div className="text-center max-w-md w-full bg-white rounded-xl shadow-lg p-8">
// //           <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
// //           <h2 className="text-2xl font-semibold text-gray-800 mb-4">Access Denied</h2>
// //           <button 
// //             onClick={() => window.location.href = '/'}
// //             className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
// //           >
// //             Go Home
// //           </button>
// //         </div>
// //       </div>
// //     );
// //   }

// //   if (currentUser.role === 'worker') {
    
// //     if (currentUser.is_active === false) {
// //       return (
// //         <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
// //           <div className="text-center max-w-md w-full bg-white rounded-xl shadow-lg p-8">
// //             <XCircle className="w-16 h-16 text-orange-500 mx-auto mb-4" />
// //             <h2 className="text-2xl font-semibold text-gray-800 mb-4">Account Disabled</h2>
// //             <p className="text-base text-gray-600 mb-6">Contact seller.</p>
// //             <button 
// //               onClick={() => handleForceLogout('Account disabled')}
// //               className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700"
// //             >
// //               Logout
// //             </button>
// //           </div>
// //         </div>
// //       );
// //     }

// //     if (currentUser.account_status === 'deleted') {
// //       return (
// //         <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
// //           <div className="text-center max-w-md w-full bg-white rounded-xl shadow-lg p-8">
// //             <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
// //             <h2 className="text-2xl font-semibold text-gray-800 mb-4">Account Deleted</h2>
// //             <button 
// //               onClick={() => handleForceLogout('Account deleted')}
// //               className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700"
// //             >
// //               Logout
// //             </button>
// //           </div>
// //         </div>
// //       );
// //     }

// //     if (sellerPlanActive === false) {
// //       return (
// //         <div className="min-h-screen flex items-center justify-center bg-red-50 px-4 py-8">
// //           <div className="text-center max-w-md w-full bg-white rounded-xl shadow-2xl p-8 border-2 border-red-200">
// //             <Shield className="w-20 h-20 text-red-600 mx-auto mb-4 animate-pulse" />
// //             <h2 className="text-2xl font-bold text-gray-800 mb-4">🚫 Access Suspended</h2>
            
// //             <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 mb-6">
// //               <p className="text-red-900 font-semibold mb-2">Seller Plan Inactive</p>
// //               <p className="text-sm text-red-700 mb-2">Cannot access until they renew.</p>
// //               {planDetails && (
// //                 <p className="text-xs text-red-600 mt-2 font-mono bg-red-100 p-2 rounded">
// //                   {planDetails}
// //                 </p>
// //               )}
// //             </div>

// //             {realtimeConnected && (
// //               <div className="bg-green-50 border border-green-200 rounded-lg p-2 mb-4">
// //                 <p className="text-xs text-green-700 flex items-center justify-center gap-1">
// //                   <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
// //                   Monitoring...
// //                 </p>
// //               </div>
// //             )}

// //             <button 
// //               onClick={handleManualRefresh}
// //               disabled={manualChecking}
// //               className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold mb-3 flex items-center justify-center gap-2 disabled:opacity-50"
// //             >
// //               <RefreshCw className={`w-5 h-5 ${manualChecking ? 'animate-spin' : ''}`} />
// //               {manualChecking ? 'Checking...' : 'Check Now'}
// //             </button>

// //             <button 
// //               onClick={() => handleForceLogout('Plan inactive')}
// //               className="w-full px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold"
// //             >
// //               Logout
// //             </button>
// //           </div>
// //         </div>
// //       );
// //     }
// //   }

// //   return <>{children}</>;
// // };

// // console.log('✅ WorkerProtectedRoute - v13.0 COMPLETE'); 
// import React, { useEffect, useState, useRef } from 'react';
// import { Navigate } from 'react-router-dom';
// import { useAppStore } from '../stores/appStore';
// import { AlertCircle, Loader, Shield, XCircle, RefreshCw } from 'lucide-react';
// import { getSellerSubscription, isSubscriptionExpired, getRemainingScanCount } from '../lib/subscriptionService';
// import { auth, db } from '../lib/firebase';
// import { collection, query, where, getDocs, limit, onSnapshot } from 'firebase/firestore';

// interface WorkerProtectedRouteProps {
//   children: React.ReactNode;
// }

// export const WorkerProtectedRoute: React.FC<WorkerProtectedRouteProps> = ({ children }) => {
//   const { currentUser, isAuthenticated } = useAppStore();
  
//   const [sellerPlanActive, setSellerPlanActive] = useState<boolean | null>(null);
//   const [checkingPlan, setCheckingPlan] = useState(true);
//   const [fetchedSellerId, setFetchedSellerId] = useState<string | null>(null);
//   const [fetchingSellerInfo, setFetchingSellerInfo] = useState(true);
//   const [fetchError, setFetchError] = useState<string | null>(null);
//   const [realtimeConnected, setRealtimeConnected] = useState(false);
//   const [lastChecked, setLastChecked] = useState<Date | null>(null);
//   const [planDetails, setPlanDetails] = useState<string>('');
//   const [manualChecking, setManualChecking] = useState(false);
  
//   // ✅ NEW: Scan limit tracking
//   const [scanLimitReached, setScanLimitReached] = useState(false);
//   const [expiryReason, setExpiryReason] = useState<'date' | 'scan_limit' | 'both' | null>(null);
  
//   const unsubscribeRef = useRef<(() => void) | null>(null);
//   const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
//   const mountedRef = useRef(true);

//   // ═══════════════════════════════════════════════════════════════
//   // ✅ FETCH WORKER'S SELLER ID
//   // ═══════════════════════════════════════════════════════════════
  
//   const fetchWorkerSellerInfo = async () => {
//     try {
//       console.log('🔍 [Worker] Fetching seller ID...');
//       setFetchingSellerInfo(true);
//       setFetchError(null);

//       if (!currentUser || !currentUser.user_id) {
//         throw new Error('No user ID');
//       }

//       const cacheKey = `worker_seller_id_${currentUser.user_id}`;
//       const cachedSellerId = sessionStorage.getItem(cacheKey);

//       if (cachedSellerId?.trim()) {
//         console.log('✅ [Cache] seller_id:', cachedSellerId);
//         setFetchedSellerId(cachedSellerId);
//         setFetchingSellerInfo(false);
//         return;
//       }

//       const usersRef = collection(db, 'users');
//       const q = query(
//         usersRef,
//         where('user_id', '==', currentUser.user_id),
//         limit(1)
//       );

//       const snapshot = await getDocs(q);

//       if (snapshot.empty) {
//         throw new Error('Worker not found');
//       }

//       const workerData = snapshot.docs[0].data();

//       const sellerId = 
//         workerData.seller_id || 
//         workerData.created_by || 
//         workerData.sellerId;

//       if (!sellerId) {
//         throw new Error('Missing seller_id');
//       }

//       console.log('✅ [Firestore] seller_id:', sellerId);
//       sessionStorage.setItem(cacheKey, sellerId);

//       setFetchedSellerId(sellerId);
//       setFetchingSellerInfo(false);

//     } catch (error: any) {
//       console.error('❌ [Error]:', error);
//       setFetchError(error.message);
//       setFetchingSellerInfo(false);
//     }
//   };

//   // ═══════════════════════════════════════════════════════════════
//   // ✅ CHECK SELLER PLAN (DATE + SCAN LIMIT)
//   // ═══════════════════════════════════════════════════════════════
  
//   const checkSellerPlan = async (sellerId: string, source: string = 'unknown'): Promise<boolean> => {
//     try {
//       console.log(`🔍 [${source}] Checking seller plan:`, sellerId);
      
//       // STEP 1: Get subscription
//       const subscription = await getSellerSubscription(sellerId, true);
      
//       if (!subscription) {
//         console.log('❌ No subscription found');
//         setPlanDetails('No subscription');
//         setScanLimitReached(false);
//         setExpiryReason(null);
//         return false;
//       }
      
//       // STEP 2: Check date expiry
//       const dateExpired = isSubscriptionExpired(subscription);
      
//       // STEP 3: Check scan limit
//       let scanLimitExceeded = false;
//       let scanStats = null;
      
//       try {
//         scanStats = await getRemainingScanCount(sellerId);
//         scanLimitExceeded = scanStats.limitReached || 
//                            (!scanStats.unlimited && scanStats.remaining <= 0);
        
//         console.log('📊 Scan stats:', {
//           unlimited: scanStats.unlimited,
//           used: scanStats.used,
//           total: scanStats.total,
//           remaining: scanStats.remaining,
//           limitReached: scanStats.limitReached,
//           scanLimitExceeded
//         });
        
//       } catch (scanError) {
//         console.warn('⚠️ Could not check scan limits:', scanError);
//         scanLimitExceeded = false;
//       }
      
//       // STEP 4: Determine if plan is active (must pass BOTH checks)
//       const isActive = !dateExpired && !scanLimitExceeded;
      
//       // STEP 5: Calculate days remaining
//       const daysLeft = subscription.end_date 
//         ? Math.ceil((new Date(subscription.end_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
//         : 0;
      
//       // STEP 6: Build plan details string
//       let detailText = `${subscription.plan_name}`;
      
//       if (isActive) {
//         detailText += ` (${daysLeft}d)`;
//       } else {
//         detailText += ' (Expired)';
//       }
      
//       if (scanStats && !scanStats.unlimited) {
//         detailText += ` • ${scanStats.used}/${scanStats.total} scans`;
//       } else if (scanStats && scanStats.unlimited) {
//         detailText += ` • Unlimited scans`;
//       }
      
//       setPlanDetails(detailText);
//       setScanLimitReached(scanLimitExceeded);
      
//       // STEP 7: Set expiry reason
//       if (dateExpired && scanLimitExceeded) {
//         setExpiryReason('both');
//       } else if (scanLimitExceeded) {
//         setExpiryReason('scan_limit');
//       } else if (dateExpired) {
//         setExpiryReason('date');
//       } else {
//         setExpiryReason(null);
//       }
      
//       console.log(`📊 [${source}] Plan Check Result:`, {
//         dateExpired,
//         scanLimitExceeded,
//         isActive,
//         daysLeft,
//         expiryReason: dateExpired && scanLimitExceeded ? 'both' : 
//                       scanLimitExceeded ? 'scan_limit' : 
//                       dateExpired ? 'date' : 'none'
//       });
      
//       return isActive;
      
//     } catch (error: any) {
//       console.error(`❌ [${source}] Plan check failed:`, error);
//       return false;
//     }
//   };

//   // ═══════════════════════════════════════════════════════════════
//   // ✅ MANUAL REFRESH
//   // ═══════════════════════════════════════════════════════════════
  
//   const handleManualRefresh = async () => {
//     if (!fetchedSellerId || manualChecking) return;
    
//     setManualChecking(true);
    
//     try {
//       console.log('🔄 Manual refresh triggered...');
//       const isActive = await checkSellerPlan(fetchedSellerId, 'Manual');
      
//       setSellerPlanActive(isActive);
//       setLastChecked(new Date());
      
//       if (isActive) {
//         alert('✅ Plan is now active! Reloading...');
//         setTimeout(() => window.location.reload(), 500);
//       } else {
//         if (expiryReason === 'scan_limit') {
//           alert('⚠️ Plan still inactive\n\nReason: Scan limit reached\n\nAsk seller to upgrade plan.');
//         } else if (expiryReason === 'date') {
//           alert('⚠️ Plan still inactive\n\nReason: Date expired\n\nAsk seller to renew plan.');
//         } else if (expiryReason === 'both') {
//           alert('⚠️ Plan still inactive\n\nReason: Date expired AND scan limit reached\n\nAsk seller to upgrade plan.');
//         } else {
//           alert('⚠️ Plan still inactive');
//         }
//       }
      
//     } catch (error) {
//       console.error('❌ Manual refresh failed:', error);
//       alert('❌ Check failed. Please try again.');
//     } finally {
//       setManualChecking(false);
//     }
//   };

//   // ═══════════════════════════════════════════════════════════════
//   // ✅ FORCE LOGOUT
//   // ═══════════════════════════════════════════════════════════════
  
//   const handleForceLogout = async (reason: string) => {
//     try {
//       if (unsubscribeRef.current) {
//         unsubscribeRef.current();
//         unsubscribeRef.current = null;
//       }
      
//       if (pollingIntervalRef.current) {
//         clearInterval(pollingIntervalRef.current);
//         pollingIntervalRef.current = null;
//       }

//       await auth.signOut();
//       localStorage.clear();
//       sessionStorage.clear();

//       alert(`🚫 ${reason}\n\nYou have been logged out.`);
//       window.location.href = '/';

//     } catch (error) {
//       console.error('❌ Logout error:', error);
//       window.location.href = '/';
//     }
//   };

//   // ═══════════════════════════════════════════════════════════════
//   // ✅ EFFECT: FETCH SELLER INFO
//   // ═══════════════════════════════════════════════════════════════
  
//   useEffect(() => {
//     mountedRef.current = true;

//     if (!currentUser || currentUser.role !== 'worker') {
//       setFetchingSellerInfo(false);
//       return;
//     }

//     fetchWorkerSellerInfo();

//     return () => {
//       mountedRef.current = false;
//     };
//   }, [currentUser]);

//   // ═══════════════════════════════════════════════════════════════
//   // ✅ EFFECT: CHECK PLAN + REALTIME MONITORING
//   // ═══════════════════════════════════════════════════════════════
  
//   useEffect(() => {
//     if (currentUser?.role === 'worker' && fetchingSellerInfo) {
//       return;
//     }

//     if (!currentUser || currentUser.role !== 'worker') {
//       setCheckingPlan(false);
//       return;
//     }

//     if (fetchError) {
//       setSellerPlanActive(false);
//       setCheckingPlan(false);
//       return;
//     }

//     const sellerId = fetchedSellerId;
    
//     if (!sellerId) {
//       setSellerPlanActive(false);
//       setCheckingPlan(false);
//       return;
//     }

//     // Initial check
//     const initialCheck = async () => {
//       try {
//         const isActive = await checkSellerPlan(sellerId, 'Initial');
        
//         if (!mountedRef.current) return;

//         setSellerPlanActive(isActive);
//         setLastChecked(new Date());
//         setCheckingPlan(false);

//       } catch (error: any) {
//         if (mountedRef.current) {
//           setSellerPlanActive(false);
//           setCheckingPlan(false);
//         }
//       }
//     };

//     initialCheck();

//     // Realtime listener
//     try {
//       const subscriptionsRef = collection(db, 'subscriptions');
//       const q = query(
//         subscriptionsRef,
//         where('seller_id', '==', sellerId),
//         where('status', '==', 'active')
//       );

//       const unsubscribe = onSnapshot(
//         q,
        
//         async (snapshot) => {
//           if (!mountedRef.current) return;

//           console.log('🔔 Realtime subscription change detected');

//           const isActive = await checkSellerPlan(sellerId, 'Realtime');
          
//           if (!mountedRef.current) return;

//           const wasInactive = sellerPlanActive === false;
          
//           setSellerPlanActive(isActive);
//           setLastChecked(new Date());
//           setRealtimeConnected(true);

//           if (wasInactive && isActive) {
//             alert('✅ Plan activated! Reloading...');
//             setTimeout(() => window.location.reload(), 1000);
//           }
          
//           if (!isActive && !wasInactive) {
//             console.log('⚠️ Plan became inactive');
//           }
//         },
        
//         (error) => {
//           console.warn('⚠️ Realtime listener error:', error);
          
//           if (mountedRef.current) {
//             setRealtimeConnected(false);
            
//             // Fallback polling
//             if (!pollingIntervalRef.current) {
//               console.log('📡 Starting polling fallback...');
              
//               pollingIntervalRef.current = setInterval(async () => {
//                 if (!mountedRef.current) return;

//                 try {
//                   const isActive = await checkSellerPlan(sellerId, 'Polling');
                  
//                   if (!mountedRef.current) return;

//                   const wasInactive = sellerPlanActive === false;

//                   setSellerPlanActive(isActive);
//                   setLastChecked(new Date());

//                   if (wasInactive && isActive) {
//                     alert('✅ Plan activated! Reloading...');
//                     window.location.reload();
//                   }

//                 } catch (error) {
//                   console.error('❌ Polling error:', error);
//                 }
//               }, 30000); // Every 30 seconds
//             }
//           }
//         }
//       );

//       unsubscribeRef.current = unsubscribe;
//       setRealtimeConnected(true);

//     } catch (error) {
//       console.warn('⚠️ Could not setup realtime listener:', error);
//       setRealtimeConnected(false);
//     }

//     return () => {
//       if (unsubscribeRef.current) {
//         unsubscribeRef.current();
//         unsubscribeRef.current = null;
//       }
      
//       if (pollingIntervalRef.current) {
//         clearInterval(pollingIntervalRef.current);
//         pollingIntervalRef.current = null;
//       }
//     };

//   }, [currentUser, isAuthenticated, fetchedSellerId, fetchingSellerInfo, fetchError, sellerPlanActive]);

//   // ═══════════════════════════════════════════════════════════════
//   // ✅ RENDER: LOADING SELLER INFO
//   // ═══════════════════════════════════════════════════════════════
  
//   if (currentUser?.role === 'worker' && fetchingSellerInfo) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
//         <div className="text-center max-w-md w-full bg-white rounded-xl shadow-lg p-8">
//           <Loader className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
//           <p className="text-base text-gray-600">Verifying worker access...</p>
//         </div>
//       </div>
//     );
//   }

//   // ═══════════════════════════════════════════════════════════════
//   // ✅ RENDER: FETCH ERROR
//   // ═══════════════════════════════════════════════════════════════
  
//   if (currentUser?.role === 'worker' && fetchError) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-red-50 px-4">
//         <div className="text-center max-w-md w-full bg-white rounded-xl shadow-2xl p-8 border-2 border-red-200">
//           <AlertCircle className="w-20 h-20 text-red-600 mx-auto mb-4" />
//           <h2 className="text-2xl font-bold text-gray-800 mb-4">Configuration Error</h2>
//           <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 mb-6">
//             <p className="text-sm text-red-900">{fetchError}</p>
//           </div>
//           <button 
//             onClick={() => handleForceLogout('Configuration error')}
//             className="w-full px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold"
//           >
//             Logout
//           </button>
//         </div>
//       </div>
//     );
//   }

//   // ═══════════════════════════════════════════════════════════════
//   // ✅ RENDER: CHECKING PLAN
//   // ═══════════════════════════════════════════════════════════════
  
//   if (currentUser === undefined || checkingPlan) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
//         <div className="text-center">
//           <Loader className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
//           <p className="text-base text-gray-600 mb-2">Verifying plan access...</p>
//           {realtimeConnected && (
//             <p className="text-xs text-green-600 mt-2 flex items-center justify-center gap-1">
//               <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
//               Live monitoring active
//             </p>
//           )}
//           {planDetails && (
//             <p className="text-xs text-gray-600 mt-1">{planDetails}</p>
//           )}
//         </div>
//       </div>
//     );
//   }

//   // ═══════════════════════════════════════════════════════════════
//   // ✅ RENDER: NOT AUTHENTICATED
//   // ═══════════════════════════════════════════════════════════════
  
//   if (!isAuthenticated || !currentUser) {
//     return <Navigate to="/" replace />;
//   }

//   // ═══════════════════════════════════════════════════════════════
//   // ✅ RENDER: INVALID ROLE
//   // ═══════════════════════════════════════════════════════════════
  
//   const allowedRoles = ['worker', 'seller', 'admin'];
//   if (!allowedRoles.includes(currentUser.role)) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
//         <div className="text-center max-w-md w-full bg-white rounded-xl shadow-lg p-8">
//           <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
//           <h2 className="text-2xl font-semibold text-gray-800 mb-4">Access Denied</h2>
//           <p className="text-gray-600 mb-6">This page is only for workers, sellers, and admins.</p>
//           <button 
//             onClick={() => window.location.href = '/'}
//             className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//           >
//             Go Home
//           </button>
//         </div>
//       </div>
//     );
//   }

//   // ═══════════════════════════════════════════════════════════════
//   // ✅ RENDER: WORKER DISABLED
//   // ═══════════════════════════════════════════════════════════════
  
//   if (currentUser.role === 'worker') {
    
//     if (currentUser.is_active === false) {
//       return (
//         <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
//           <div className="text-center max-w-md w-full bg-white rounded-xl shadow-lg p-8">
//             <XCircle className="w-16 h-16 text-orange-500 mx-auto mb-4" />
//             <h2 className="text-2xl font-semibold text-gray-800 mb-4">Account Disabled</h2>
//             <p className="text-base text-gray-600 mb-6">
//               Your account has been disabled by the seller.
//             </p>
//             <p className="text-sm text-gray-500 mb-6">
//               Please contact your seller to reactivate your account.
//             </p>
//             <button 
//               onClick={() => handleForceLogout('Account disabled')}
//               className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700"
//             >
//               Logout
//             </button>
//           </div>
//         </div>
//       );
//     }

//     if (currentUser.account_status === 'deleted') {
//       return (
//         <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
//           <div className="text-center max-w-md w-full bg-white rounded-xl shadow-lg p-8">
//             <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
//             <h2 className="text-2xl font-semibold text-gray-800 mb-4">Account Deleted</h2>
//             <p className="text-base text-gray-600 mb-6">
//               This account has been permanently deleted.
//             </p>
//             <button 
//               onClick={() => handleForceLogout('Account deleted')}
//               className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700"
//             >
//               Logout
//             </button>
//           </div>
//         </div>
//       );
//     }

//     // ═══════════════════════════════════════════════════════════════
//     // ✅ RENDER: PLAN INACTIVE (DATE OR SCAN LIMIT)
//     // ═══════════════════════════════════════════════════════════════
    
//     if (sellerPlanActive === false) {
      
//       // Determine message based on expiry reason
//       let mainMessage = 'Seller Plan Inactive';
//       let subMessage = 'Cannot access until seller renews plan.';
//       let icon = '🚫';
      
//       if (expiryReason === 'scan_limit') {
//         mainMessage = 'Scan Limit Reached';
//         subMessage = 'All allowed scans have been used. Ask seller to upgrade plan.';
//         icon = '🔒';
//       } else if (expiryReason === 'date') {
//         mainMessage = 'Plan Expired';
//         subMessage = 'Subscription date has expired. Ask seller to renew.';
//         icon = '⏰';
//       } else if (expiryReason === 'both') {
//         mainMessage = 'Plan Expired';
//         subMessage = 'Date expired AND scan limit reached. Ask seller to upgrade.';
//         icon = '🚫';
//       }
      
//       return (
//         <div className="min-h-screen flex items-center justify-center bg-red-50 px-4 py-8">
//           <div className="text-center max-w-md w-full bg-white rounded-xl shadow-2xl p-8 border-2 border-red-200">
//             <Shield className="w-20 h-20 text-red-600 mx-auto mb-4 animate-pulse" />
//             <h2 className="text-2xl font-bold text-gray-800 mb-4">
//               {icon} Access Suspended
//             </h2>
            
//             {/* Main Error Message */}
//             <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 mb-6">
//               <p className="text-red-900 font-semibold mb-2">{mainMessage}</p>
//               <p className="text-sm text-red-700 mb-3">{subMessage}</p>
              
//               {/* Plan Details */}
//               {planDetails && (
//                 <div className="text-xs text-red-600 mt-3 font-mono bg-red-100 p-3 rounded">
//                   {planDetails}
//                 </div>
//               )}
              
//               {/* Scan Limit Details */}
//               {scanLimitReached && (
//                 <div className="mt-3 p-2 bg-orange-50 border border-orange-200 rounded">
//                   <p className="text-xs text-orange-800">
//                     ⚠️ All scans from this plan have been used by you and/or the seller.
//                   </p>
//                 </div>
//               )}
//             </div>

//             {/* Realtime Status */}
//             {realtimeConnected && (
//               <div className="bg-green-50 border border-green-200 rounded-lg p-2 mb-4">
//                 <p className="text-xs text-green-700 flex items-center justify-center gap-1">
//                   <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
//                   Monitoring for plan changes...
//                 </p>
//               </div>
//             )}
            
//             {/* Last Checked */}
//             {lastChecked && (
//               <p className="text-xs text-gray-500 mb-4">
//                 Last checked: {lastChecked.toLocaleTimeString()}
//               </p>
//             )}

//             {/* Manual Refresh Button */}
//             <button 
//               onClick={handleManualRefresh}
//               disabled={manualChecking}
//               className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold mb-3 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               <RefreshCw className={`w-5 h-5 ${manualChecking ? 'animate-spin' : ''}`} />
//               {manualChecking ? 'Checking...' : 'Check Plan Status'}
//             </button>

//             {/* Logout Button */}
//             <button 
//               onClick={() => handleForceLogout(
//                 expiryReason === 'scan_limit' ? 'Scan limit reached' :
//                 expiryReason === 'date' ? 'Plan expired' :
//                 expiryReason === 'both' ? 'Plan expired (date + scan limit)' :
//                 'Plan inactive'
//               )}
//               className="w-full px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold"
//             >
//               Logout
//             </button>
            
//             {/* Help Text */}
//             <p className="text-xs text-gray-500 mt-4">
//               💡 Contact your seller to resolve this issue
//             </p>
//           </div>
//         </div>
//       );
//     }
//   }

//   // ═══════════════════════════════════════════════════════════════
//   // ✅ RENDER: ALLOW ACCESS
//   // ═══════════════════════════════════════════════════════════════
  
//   return <>{children}</>;
// };

// console.log('✅ WorkerProtectedRoute - PRODUCTION v14.0 (DATE + SCAN LIMIT)'); 
import React, { useEffect, useState, useRef } from 'react';
import { Navigate } from 'react-router-dom';
import { useAppStore } from '../stores/appStore';
import { AlertCircle, Loader, Shield, XCircle, RefreshCw } from 'lucide-react';
import { getSellerSubscription, isSubscriptionExpired, getRemainingScanCount } from '../lib/subscriptionService';
import { auth, db } from '../lib/firebase';
import { collection, query, where, getDocs, limit, onSnapshot } from 'firebase/firestore';

interface WorkerProtectedRouteProps {
  children: React.ReactNode;
}

export const WorkerProtectedRoute: React.FC<WorkerProtectedRouteProps> = ({ children }) => {
  const { currentUser, isAuthenticated } = useAppStore();
  
  const [sellerPlanActive, setSellerPlanActive] = useState<boolean | null>(null);
  const [checkingPlan, setCheckingPlan] = useState(true);
  const [fetchedSellerId, setFetchedSellerId] = useState<string | null>(null);
  const [fetchingSellerInfo, setFetchingSellerInfo] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [realtimeConnected, setRealtimeConnected] = useState(false);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);
  const [planDetails, setPlanDetails] = useState<string>('');
  const [manualChecking, setManualChecking] = useState(false);
  
  const [scanLimitReached, setScanLimitReached] = useState(false);
  const [expiryReason, setExpiryReason] = useState<'date' | 'scan_limit' | 'both' | null>(null);
  
  const unsubscribeRef = useRef<(() => void) | null>(null);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const mountedRef = useRef(true);

  // ═══════════════════════════════════════════════════════════════
  // FETCH WORKER'S SELLER ID
  // ═══════════════════════════════════════════════════════════════
  
  const fetchWorkerSellerInfo = async () => {
    try {
      console.log('🔍 [Worker] Fetching seller ID...');
      setFetchingSellerInfo(true);
      setFetchError(null);

      if (!currentUser || !currentUser.user_id) {
        throw new Error('No user ID');
      }

      const cacheKey = `worker_seller_id_${currentUser.user_id}`;
      const cachedSellerId = sessionStorage.getItem(cacheKey);

      if (cachedSellerId?.trim()) {
        console.log('✅ [Cache] seller_id:', cachedSellerId);
        setFetchedSellerId(cachedSellerId);
        setFetchingSellerInfo(false);
        return;
      }

      const usersRef = collection(db, 'users');
      const q = query(
        usersRef,
        where('user_id', '==', currentUser.user_id),
        limit(1)
      );

      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        throw new Error('Worker not found');
      }

      const workerData = snapshot.docs[0].data();

      const sellerId = 
        workerData.seller_id || 
        workerData.created_by || 
        workerData.sellerId;

      if (!sellerId) {
        throw new Error('Missing seller_id');
      }

      console.log('✅ [Firestore] seller_id:', sellerId);
      sessionStorage.setItem(cacheKey, sellerId);

      setFetchedSellerId(sellerId);
      setFetchingSellerInfo(false);

    } catch (error: any) {
      console.error('❌ [Error]:', error);
      setFetchError(error.message);
      setFetchingSellerInfo(false);
    }
  };

  // ═══════════════════════════════════════════════════════════════
  // CHECK SELLER PLAN (DATE + SCAN LIMIT)
  // ═══════════════════════════════════════════════════════════════
  
  const checkSellerPlan = async (sellerId: string, source: string = 'unknown'): Promise<boolean> => {
    try {
      console.log(`🔍 [${source}] Checking seller plan:`, sellerId);
      
      const subscription = await getSellerSubscription(sellerId, true);
      
      if (!subscription) {
        console.log('❌ No subscription found');
        setPlanDetails('No subscription');
        setScanLimitReached(false);
        setExpiryReason(null);
        return false;
      }
      
      const dateExpired = isSubscriptionExpired(subscription);
      
      let scanLimitExceeded = false;
      let scanStats = null;
      
      try {
        scanStats = await getRemainingScanCount(sellerId);
        scanLimitExceeded = scanStats.limitReached
        
        console.log('📊 Scan stats:', {
          unlimited: scanStats.unlimited,
          used: scanStats.used,
          total: scanStats.total,
          remaining: scanStats.remaining,
          limitReached: scanStats.limitReached,
          scanLimitExceeded
        });
        
      } catch (scanError) {
        console.warn('⚠️ Could not check scan limits:', scanError);
        scanLimitExceeded = false;
      }
      
      const isActive = !dateExpired && !scanLimitExceeded;
      
      const daysLeft = subscription.end_date 
        ? Math.ceil((new Date(subscription.end_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
        : 0;
      
      let detailText = `${subscription.plan_name}`;
      
      if (isActive) {
        detailText += ` (${daysLeft}d)`;
      } else {
        detailText += ' (Expired)';
      }
      
      if (scanStats && !scanStats.unlimited) {
        detailText += ` • ${scanStats.used}/${scanStats.total} scans`;
      } else if (scanStats && scanStats.unlimited) {
        detailText += ` • Unlimited scans`;
      }
      
      setPlanDetails(detailText);
      setScanLimitReached(scanLimitExceeded);
      
      if (dateExpired && scanLimitExceeded) {
        setExpiryReason('both');
      } else if (scanLimitExceeded) {
        setExpiryReason('scan_limit');
      } else if (dateExpired) {
        setExpiryReason('date');
      } else {
        setExpiryReason(null);
      }
      
      console.log(`📊 [${source}] Plan Check Result:`, {
        dateExpired,
        scanLimitExceeded,
        isActive,
        daysLeft,
        expiryReason: dateExpired && scanLimitExceeded ? 'both' : 
                      scanLimitExceeded ? 'scan_limit' : 
                      dateExpired ? 'date' : 'none'
      });
      
      return isActive;
      
    } catch (error: any) {
      console.error(`❌ [${source}] Plan check failed:`, error);
      return false;
    }
  };

  // ═══════════════════════════════════════════════════════════════
  // MANUAL REFRESH
  // ═══════════════════════════════════════════════════════════════
  
  const handleManualRefresh = async () => {
    if (!fetchedSellerId || manualChecking) return;
    
    setManualChecking(true);
    
    try {
      console.log('🔄 Manual refresh triggered...');
      const isActive = await checkSellerPlan(fetchedSellerId, 'Manual');
      
      setSellerPlanActive(isActive);
      setLastChecked(new Date());
      
      if (isActive) {
        alert('✅ Plan is now active! Reloading...');
        setTimeout(() => window.location.reload(), 500);
      } else {
        if (expiryReason === 'scan_limit') {
          alert('⚠️ Plan still inactive\n\nReason: Scan limit reached\n\nAsk seller to upgrade plan.');
        } else if (expiryReason === 'date') {
          alert('⚠️ Plan still inactive\n\nReason: Date expired\n\nAsk seller to renew plan.');
        } else if (expiryReason === 'both') {
          alert('⚠️ Plan still inactive\n\nReason: Date expired AND scan limit reached\n\nAsk seller to upgrade plan.');
        } else {
          alert('⚠️ Plan still inactive');
        }
      }
      
    } catch (error) {
      console.error('❌ Manual refresh failed:', error);
      alert('❌ Check failed. Please try again.');
    } finally {
      setManualChecking(false);
    }
  };

  // ═══════════════════════════════════════════════════════════════
  // FORCE LOGOUT
  // ═══════════════════════════════════════════════════════════════
  
  const handleForceLogout = async (reason: string) => {
    try {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
        unsubscribeRef.current = null;
      }
      
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }

      await auth.signOut();
      localStorage.clear();
      sessionStorage.clear();

      alert(`🚫 ${reason}\n\nYou have been logged out.`);
      window.location.href = '/';

    } catch (error) {
      console.error('❌ Logout error:', error);
      window.location.href = '/';
    }
  };

  // ═══════════════════════════════════════════════════════════════
  // EFFECT: FETCH SELLER INFO
  // ═══════════════════════════════════════════════════════════════
  
  useEffect(() => {
    mountedRef.current = true;

    if (!currentUser || currentUser.role !== 'worker') {
      setFetchingSellerInfo(false);
      return;
    }

    fetchWorkerSellerInfo();

    return () => {
      mountedRef.current = false;
    };
  }, [currentUser]);

  // ═══════════════════════════════════════════════════════════════
  // ✅ EFFECT: CHECK PLAN + REALTIME MONITORING (FIXED)
  // ═══════════════════════════════════════════════════════════════
  
  useEffect(() => {
    if (currentUser?.role === 'worker' && fetchingSellerInfo) {
      return;
    }

    if (!currentUser || currentUser.role !== 'worker') {
      setCheckingPlan(false);
      return;
    }

    if (fetchError) {
      setSellerPlanActive(false);
      setCheckingPlan(false);
      return;
    }

    const sellerId = fetchedSellerId;
    
    if (!sellerId) {
      setSellerPlanActive(false);
      setCheckingPlan(false);
      return;
    }

    const initialCheck = async () => {
      try {
        const isActive = await checkSellerPlan(sellerId, 'Initial');
        
        if (!mountedRef.current) return;

        setSellerPlanActive(isActive);
        setLastChecked(new Date());
        setCheckingPlan(false);

      } catch (error: any) {
        if (mountedRef.current) {
          setSellerPlanActive(false);
          setCheckingPlan(false);
        }
      }
    };

    initialCheck();

    try {
      const subscriptionsRef = collection(db, 'subscriptions');
      const q = query(
        subscriptionsRef,
        where('seller_id', '==', sellerId),
        where('status', '==', 'active')
      );

      const unsubscribe = onSnapshot(
        q,
        
        async (snapshot) => {
          if (!mountedRef.current) return;

          console.log('🔔 Realtime subscription change detected');

          const isActive = await checkSellerPlan(sellerId, 'Realtime');
          
          if (!mountedRef.current) return;

          const wasActive = sellerPlanActive === true;
          const wasInactive = sellerPlanActive === false;
          
          setSellerPlanActive(isActive);
          setLastChecked(new Date());
          setRealtimeConnected(true);

          // ✅ FIX: Only reload if plan was inactive and now active (renewal)
          if (wasInactive && isActive) {
            console.log('✅ Plan renewed - Reloading page');
            alert('✅ Plan activated! Reloading...');
            setTimeout(() => window.location.reload(), 1000);
          }
          
          // ✅ FIX: If plan becomes inactive, just update state (NO LOGOUT)
          // Worker will be blocked on NEXT scan attempt, not immediately
          if (wasActive && !isActive) {
            console.log('⚠️ Plan became inactive - Worker will be blocked on next scan');
            // Just update state - don't logout
            // Worker can finish current scan
            // They'll see blocked screen when they try to scan again or refresh
          }
        },
        
        (error) => {
          console.warn('⚠️ Realtime listener error:', error);
          
          if (mountedRef.current) {
            setRealtimeConnected(false);
            
            if (!pollingIntervalRef.current) {
              console.log('📡 Starting polling fallback...');
              
              pollingIntervalRef.current = setInterval(async () => {
                if (!mountedRef.current) return;

                try {
                  const isActive = await checkSellerPlan(sellerId, 'Polling');
                  
                  if (!mountedRef.current) return;

                  const wasInactive = sellerPlanActive === false;

                  setSellerPlanActive(isActive);
                  setLastChecked(new Date());

                  // ✅ Only reload on renewal
                  if (wasInactive && isActive) {
                    alert('✅ Plan activated! Reloading...');
                    window.location.reload();
                  }
                  
                  // ✅ Don't logout on expiry - just update state

                } catch (error) {
                  console.error('❌ Polling error:', error);
                }
              }, 30000);
            }
          }
        }
      );

      unsubscribeRef.current = unsubscribe;
      setRealtimeConnected(true);

    } catch (error) {
      console.warn('⚠️ Could not setup realtime listener:', error);
      setRealtimeConnected(false);
    }

    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
        unsubscribeRef.current = null;
      }
      
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }
    };

  }, [currentUser, isAuthenticated, fetchedSellerId, fetchingSellerInfo, fetchError, sellerPlanActive]);

  // ═══════════════════════════════════════════════════════════════
  // RENDER: LOADING SELLER INFO
  // ═══════════════════════════════════════════════════════════════
  
  if (currentUser?.role === 'worker' && fetchingSellerInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
        <div className="text-center max-w-md w-full bg-white rounded-xl shadow-lg p-8">
          <Loader className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-base text-gray-600">Verifying worker access...</p>
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════
  // RENDER: FETCH ERROR
  // ═══════════════════════════════════════════════════════════════
  
  if (currentUser?.role === 'worker' && fetchError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50 px-4">
        <div className="text-center max-w-md w-full bg-white rounded-xl shadow-2xl p-8 border-2 border-red-200">
          <AlertCircle className="w-20 h-20 text-red-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Configuration Error</h2>
          <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-red-900">{fetchError}</p>
          </div>
          <button 
            onClick={() => handleForceLogout('Configuration error')}
            className="w-full px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold"
          >
            Logout
          </button>
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════
  // RENDER: CHECKING PLAN
  // ═══════════════════════════════════════════════════════════════
  
  if (currentUser === undefined || checkingPlan) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
        <div className="text-center">
          <Loader className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-base text-gray-600 mb-2">Verifying plan access...</p>
          {realtimeConnected && (
            <p className="text-xs text-green-600 mt-2 flex items-center justify-center gap-1">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              Live monitoring active
            </p>
          )}
          {planDetails && (
            <p className="text-xs text-gray-600 mt-1">{planDetails}</p>
          )}
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════
  // RENDER: NOT AUTHENTICATED
  // ═══════════════════════════════════════════════════════════════
  
  if (!isAuthenticated || !currentUser) {
    return <Navigate to="/" replace />;
  }

  // ═══════════════════════════════════════════════════════════════
  // RENDER: INVALID ROLE
  // ═══════════════════════════════════════════════════════════════
  
  const allowedRoles = ['worker', 'seller', 'admin'];
  if (!allowedRoles.includes(currentUser.role)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
        <div className="text-center max-w-md w-full bg-white rounded-xl shadow-lg p-8">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-6">This page is only for workers, sellers, and admins.</p>
          <button 
            onClick={() => window.location.href = '/'}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════
  // RENDER: WORKER DISABLED
  // ═══════════════════════════════════════════════════════════════
  
  if (currentUser.role === 'worker') {
    
    if (currentUser.is_active === false) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
          <div className="text-center max-w-md w-full bg-white rounded-xl shadow-lg p-8">
            <XCircle className="w-16 h-16 text-orange-500 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Account Disabled</h2>
            <p className="text-base text-gray-600 mb-6">
              Your account has been disabled by the seller.
            </p>
            <p className="text-sm text-gray-500 mb-6">
              Please contact your seller to reactivate your account.
            </p>
            <button 
              onClick={() => handleForceLogout('Account disabled')}
              className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </div>
      );
    }

    if (currentUser.account_status === 'deleted') {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
          <div className="text-center max-w-md w-full bg-white rounded-xl shadow-lg p-8">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Account Deleted</h2>
            <p className="text-base text-gray-600 mb-6">
              This account has been permanently deleted.
            </p>
            <button 
              onClick={() => handleForceLogout('Account deleted')}
              className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </div>
      );
    }

    // ═══════════════════════════════════════════════════════════════
    // ✅ RENDER: PLAN INACTIVE (SHOWS BLOCKED SCREEN, NO AUTO-LOGOUT)
    // ═══════════════════════════════════════════════════════════════
    
    if (sellerPlanActive === false) {
      
      let mainMessage = 'Seller Plan Inactive';
      let subMessage = 'Cannot access until seller renews plan.';
      let icon = '🚫';
      
      if (expiryReason === 'scan_limit') {
        mainMessage = 'Scan Limit Reached';
        subMessage = 'All allowed scans have been used. Ask seller to upgrade plan.';
        icon = '🔒';
      } else if (expiryReason === 'date') {
        mainMessage = 'Plan Expired';
        subMessage = 'Subscription date has expired. Ask seller to renew.';
        icon = '⏰';
      } else if (expiryReason === 'both') {
        mainMessage = 'Plan Expired';
        subMessage = 'Date expired AND scan limit reached. Ask seller to upgrade.';
        icon = '🚫';
      }
      
      return (
        <div className="min-h-screen flex items-center justify-center bg-red-50 px-4 py-8">
          <div className="text-center max-w-md w-full bg-white rounded-xl shadow-2xl p-8 border-2 border-red-200">
            <Shield className="w-20 h-20 text-red-600 mx-auto mb-4 animate-pulse" />
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              {icon} Access Suspended
            </h2>
            
            <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-900 font-semibold mb-2">{mainMessage}</p>
              <p className="text-sm text-red-700 mb-3">{subMessage}</p>
              
              {planDetails && (
                <div className="text-xs text-red-600 mt-3 font-mono bg-red-100 p-3 rounded">
                  {planDetails}
                </div>
              )}
              
              {scanLimitReached && (
                <div className="mt-3 p-2 bg-orange-50 border border-orange-200 rounded">
                  <p className="text-xs text-orange-800">
                    ⚠️ All scans from this plan have been used by you and/or the seller.
                  </p>
                </div>
              )}
            </div>

            {realtimeConnected && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-2 mb-4">
                <p className="text-xs text-green-700 flex items-center justify-center gap-1">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  Monitoring for plan changes...
                </p>
              </div>
            )}
            
            {lastChecked && (
              <p className="text-xs text-gray-500 mb-4">
                Last checked: {lastChecked.toLocaleTimeString()}
              </p>
            )}

            <button 
              onClick={handleManualRefresh}
              disabled={manualChecking}
              className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold mb-3 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCw className={`w-5 h-5 ${manualChecking ? 'animate-spin' : ''}`} />
              {manualChecking ? 'Checking...' : 'Check Plan Status'}
            </button>

            <button 
              onClick={() => handleForceLogout(
                expiryReason === 'scan_limit' ? 'Scan limit reached' :
                expiryReason === 'date' ? 'Plan expired' :
                expiryReason === 'both' ? 'Plan expired (date + scan limit)' :
                'Plan inactive'
              )}
              className="w-full px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold"
            >
              Logout
            </button>
            
            <p className="text-xs text-gray-500 mt-4">
              💡 Contact your seller to resolve this issue
            </p>
          </div>
        </div>
      );
    }
  }

  // ═══════════════════════════════════════════════════════════════
  // RENDER: ALLOW ACCESS
  // ═══════════════════════════════════════════════════════════════
  
  return <>{children}</>;
};

console.log('✅ WorkerProtectedRoute - v15.0 (LOGOUT TIMING FIX)');