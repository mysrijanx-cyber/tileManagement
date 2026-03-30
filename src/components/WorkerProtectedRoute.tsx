

// // // // import React from 'react';
// // // // import { Navigate } from 'react-router-dom';
// // // // import { useAppStore } from '../stores/appStore';
// // // // import { AlertCircle, Loader } from 'lucide-react';

// // // // interface WorkerProtectedRouteProps {
// // // //   children: React.ReactNode;
// // // // }

// // // // export const WorkerProtectedRoute: React.FC<WorkerProtectedRouteProps> = ({ children }) => {
// // // //   const { currentUser, isAuthenticated } = useAppStore();

// // // //   // Show loading while auth state is being determined
// // // //   if (currentUser === undefined) {
// // // //     return (
// // // //       <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
// // // //         <div className="text-center">
// // // //           <Loader className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 animate-spin text-blue-600 mx-auto mb-3 sm:mb-4" />
// // // //           <p className="text-sm sm:text-base lg:text-lg text-gray-600">Checking authentication...</p>
// // // //         </div>
// // // //       </div>
// // // //     );
// // // //   }

// // // //   // Not authenticated - redirect to home
// // // //   if (!isAuthenticated || !currentUser) {
// // // //     return <Navigate to="/" replace />;
// // // //   }

// // // //   // Check if user has appropriate role
// // // //   const allowedRoles = ['worker', 'seller', 'admin'];
// // // //   if (!allowedRoles.includes(currentUser.role)) {
// // // //     return (
// // // //       <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-6 sm:py-8">
// // // //         <div className="text-center max-w-md w-full mx-auto bg-white rounded-xl shadow-lg p-6 sm:p-8">
// // // //           <AlertCircle className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 text-red-500 mx-auto mb-3 sm:mb-4" />
// // // //           <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-800 mb-3 sm:mb-4">
// // // //             Access Denied
// // // //           </h2>
// // // //           <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 leading-relaxed">
// // // //             You don't have permission to access this page. Only workers, sellers, and admins can use the scan functionality.
// // // //           </p>
// // // //           <button 
// // // //             onClick={() => window.location.href = '/'}
// // // //             className="w-full sm:w-auto px-6 py-2.5 sm:py-3 bg-blue-600 text-white text-sm sm:text-base rounded-lg hover:bg-blue-700 transition-colors font-medium"
// // // //           >
// // // //             Go to Home
// // // //           </button>
// // // //         </div>
// // // //       </div>
// // // //     );
// // // //   }

// // // //   // Special handling for worker role
// // // //   if (currentUser.role === 'worker') {
// // // //     // Check if worker account is active
// // // //     if (currentUser.is_active === false) {
// // // //       return (
// // // //         <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-6 sm:py-8">
// // // //           <div className="text-center max-w-md w-full mx-auto bg-white rounded-xl shadow-lg p-6 sm:p-8">
// // // //             <AlertCircle className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 text-orange-500 mx-auto mb-3 sm:mb-4" />
// // // //             <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-800 mb-3 sm:mb-4">
// // // //               Account Disabled
// // // //             </h2>
// // // //             <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 leading-relaxed">
// // // //               Your worker account has been disabled by the seller. Please contact them to reactivate your account.
// // // //             </p>
// // // //             <button 
// // // //               onClick={() => {
// // // //                 // Force logout
// // // //                 localStorage.clear();
// // // //                 sessionStorage.clear();
// // // //                 window.location.href = '/';
// // // //               }}
// // // //               className="w-full sm:w-auto px-6 py-2.5 sm:py-3 bg-red-600 text-white text-sm sm:text-base rounded-lg hover:bg-red-700 transition-colors font-medium"
// // // //             >
// // // //               Logout
// // // //             </button>
// // // //           </div>
// // // //         </div>
// // // //       );
// // // //     }

// // // //     // Check if worker account is deleted
// // // //     if (currentUser.account_status === 'deleted') {
// // // //       return (
// // // //         <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-6 sm:py-8">
// // // //           <div className="text-center max-w-md w-full mx-auto bg-white rounded-xl shadow-lg p-6 sm:p-8">
// // // //             <AlertCircle className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 text-red-500 mx-auto mb-3 sm:mb-4" />
// // // //             <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-800 mb-3 sm:mb-4">
// // // //               Account Not Found
// // // //             </h2>
// // // //             <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 leading-relaxed">
// // // //               Your worker account has been removed. Please contact the seller for a new account.
// // // //             </p>
// // // //             <button 
// // // //               onClick={() => {
// // // //                 // Force logout
// // // //                 localStorage.clear();
// // // //                 sessionStorage.clear();
// // // //                 window.location.href = '/';
// // // //               }}
// // // //               className="w-full sm:w-auto px-6 py-2.5 sm:py-3 bg-red-600 text-white text-sm sm:text-base rounded-lg hover:bg-red-700 transition-colors font-medium"
// // // //             >
// // // //               Logout
// // // //             </button>
// // // //           </div>
// // // //         </div>
// // // //       );
// // // //     }
// // // //   }

// // // //   // All checks passed - render the protected content
// // // //   return <>{children}</>;
// // // // }; 
// // // import React, { useEffect, useState } from 'react';
// // // import { Navigate } from 'react-router-dom';
// // // import { useAppStore } from '../stores/appStore';
// // // import { AlertCircle, Loader, Shield, XCircle } from 'lucide-react';
// // // import { checkSellerPlanStatus } from '../lib/firebaseutils';
// // // import { auth } from '../lib/firebase';

// // // interface WorkerProtectedRouteProps {
// // //   children: React.ReactNode;
// // // }

// // // export const WorkerProtectedRoute: React.FC<WorkerProtectedRouteProps> = ({ children }) => {
// // //   const { currentUser, isAuthenticated } = useAppStore();
// // //   const [sellerPlanActive, setSellerPlanActive] = useState<boolean | null>(null);
// // //   const [checkingPlan, setCheckingPlan] = useState(true);

// // //   // ✅✅✅ REAL-TIME SELLER PLAN CHECK FOR WORKERS ✅✅✅
// // //   useEffect(() => {
// // //     let intervalId: NodeJS.Timeout;

// // //     const checkSellerPlan = async () => {
// // //       if (!currentUser || currentUser.role !== 'worker') {
// // //         setCheckingPlan(false);
// // //         return;
// // //       }

// // //       try {
// // //         console.log('🔍 Worker Route: Checking seller plan status...');
        
// // //         // Get seller ID from worker profile
// // //         const sellerId = currentUser.seller_id || currentUser.created_by;
        
// // //         if (!sellerId) {
// // //           console.error('❌ Worker has no seller_id');
// // //           setSellerPlanActive(false);
// // //           setCheckingPlan(false);
// // //           return;
// // //         }

// // //         // Check seller's plan status
// // //         const planStatus = await checkSellerPlanStatus(sellerId);
        
// // //         console.log('📊 Seller plan status:', planStatus);
        
// // //         setSellerPlanActive(planStatus.isActive);
// // //         setCheckingPlan(false);

// // //         // ✅ CRITICAL: If plan became inactive while worker is logged in, FORCE LOGOUT
// // //         if (!planStatus.isActive && isAuthenticated) {
// // //           console.log('🚨 SELLER PLAN EXPIRED - FORCING WORKER LOGOUT');
          
// // //           // Sign out from Firebase Auth
// // //           await auth.signOut();
          
// // //           // Clear all local storage
// // //           localStorage.clear();
// // //           sessionStorage.clear();
          
// // //           // Redirect to home
// // //           window.location.href = '/';
// // //         }

// // //       } catch (error: any) {
// // //         console.error('❌ Error checking seller plan:', error);
// // //         setSellerPlanActive(false);
// // //         setCheckingPlan(false);
// // //       }
// // //     };

// // //     // Initial check
// // //     checkSellerPlan();

// // //     // ✅ RE-CHECK EVERY 30 SECONDS FOR REAL-TIME MONITORING
// // //     if (currentUser?.role === 'worker') {
// // //       intervalId = setInterval(checkSellerPlan, 30000); // 30 seconds
// // //       console.log('⏰ Started real-time seller plan monitoring (30s interval)');
// // //     }

// // //     return () => {
// // //       if (intervalId) {
// // //         clearInterval(intervalId);
// // //         console.log('🛑 Stopped seller plan monitoring');
// // //       }
// // //     };
// // //   }, [currentUser, isAuthenticated]);

// // //   // Show loading while auth state is being determined
// // //   if (currentUser === undefined || checkingPlan) {
// // //     return (
// // //       <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
// // //         <div className="text-center">
// // //           <Loader className="w-10 h-10 animate-spin text-blue-600 mx-auto mb-4" />
// // //           <p className="text-base text-gray-600">
// // //             {checkingPlan ? 'Verifying access permissions...' : 'Checking authentication...'}
// // //           </p>
// // //         </div>
// // //       </div>
// // //     );
// // //   }

// // //   // Not authenticated - redirect to home
// // //   if (!isAuthenticated || !currentUser) {
// // //     return <Navigate to="/" replace />;
// // //   }

// // //   // Check if user has appropriate role
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
// // //             className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
// // //           >
// // //             Go to Home
// // //           </button>
// // //         </div>
// // //       </div>
// // //     );
// // //   }

// // //   // Special handling for worker role
// // //   if (currentUser.role === 'worker') {
    
// // //     // ✅✅✅ CHECK 1: Worker account disabled ✅✅✅
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
// // //               onClick={() => {
// // //                 localStorage.clear();
// // //                 sessionStorage.clear();
// // //                 window.location.href = '/';
// // //               }}
// // //               className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700"
// // //             >
// // //               Logout
// // //             </button>
// // //           </div>
// // //         </div>
// // //       );
// // //     }

// // //     // ✅✅✅ CHECK 2: Worker account deleted ✅✅✅
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
// // //               onClick={() => {
// // //                 localStorage.clear();
// // //                 sessionStorage.clear();
// // //                 window.location.href = '/';
// // //               }}
// // //               className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700"
// // //             >
// // //               Logout
// // //             </button>
// // //           </div>
// // //         </div>
// // //       );
// // //     }

// // //     // ✅✅✅ CHECK 3: SELLER'S PLAN EXPIRED (NEW CHECK) ✅✅✅
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
// // //                 💡 <strong>What to do?</strong> Contact your seller and ask them to renew their plan. Once renewed, you'll regain access automatically.
// // //               </p>
// // //             </div>

// // //             <button 
// // //               onClick={() => {
// // //                 localStorage.clear();
// // //                 sessionStorage.clear();
// // //                 window.location.href = '/';
// // //               }}
// // //               className="w-full px-6 py-3 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-lg hover:from-red-700 hover:to-orange-700 font-semibold shadow-lg"
// // //             >
// // //               Logout
// // //             </button>
// // //           </div>
// // //         </div>
// // //       );
// // //     }
// // //   }

// // //   // All checks passed - render the protected content
// // //   return <>{children}</>;
// // // }; 
// // // ═══════════════════════════════════════════════════════════════
// // // ✅ WORKER PROTECTED ROUTE - PRODUCTION v6.0 (REAL-TIME)
// // // ═══════════════════════════════════════════════════════════════

// // import React, { useEffect, useState, useRef } from 'react';
// // import { Navigate } from 'react-router-dom';
// // import { useAppStore } from '../stores/appStore';
// // import { AlertCircle, Loader, Shield, XCircle } from 'lucide-react';
// // import { 
// //   checkSellerPlanStatus, 
// //   subscribeToSellerPlanStatus // ✅ NEW
// // } from '../lib/firebaseutils';
// // import { auth } from '../lib/firebase';

// // interface WorkerProtectedRouteProps {
// //   children: React.ReactNode;
// // }

// // export const WorkerProtectedRoute: React.FC<WorkerProtectedRouteProps> = ({ children }) => {
// //   const { currentUser, isAuthenticated } = useAppStore();
  
// //   // ─────────────────────────────────────────────────────────────
// //   // STATE MANAGEMENT
// //   // ─────────────────────────────────────────────────────────────
  
// //   const [sellerPlanActive, setSellerPlanActive] = useState<boolean | null>(null);
// //   const [checkingPlan, setCheckingPlan] = useState(true);
// //   const [lastChecked, setLastChecked] = useState<Date | null>(null);
// //   const [realtimeConnected, setRealtimeConnected] = useState(false);
  
// //   // ✅ Refs to prevent multiple listeners
// //   const unsubscribeRef = useRef<(() => void) | null>(null);
// //   const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

// //   // ═══════════════════════════════════════════════════════════════
// //   // ✅ REAL-TIME PLAN STATUS MONITORING (PRIMARY METHOD)
// //   // ═══════════════════════════════════════════════════════════════

// //   useEffect(() => {
// //     if (!currentUser || currentUser.role !== 'worker') {
// //       setCheckingPlan(false);
// //       return;
// //     }

// //     const sellerId = currentUser.seller_id || currentUser.created_by;
    
// //     if (!sellerId) {
// //       console.error('❌ Worker has no seller_id');
// //       setSellerPlanActive(false);
// //       setCheckingPlan(false);
// //       return;
// //     }

// //     console.log('🔔 Setting up real-time plan monitoring for worker...');
// //     console.log('   Seller ID:', sellerId);
// //     console.log('   Worker ID:', currentUser.user_id);

// //     // ✅ PHASE 1: Initial Check (Cache bypass)
// //     const initialCheck = async () => {
// //       try {
// //         console.log('🔍 Initial plan check (server fetch)...');
        
// //         const planStatus = await checkSellerPlanStatus(sellerId, {
// //           source: 'server', // ✅ Force fresh data
// //           checkExpiry: true
// //         });

// //         console.log('📊 Initial status:', planStatus.isActive);
// //         setSellerPlanActive(planStatus.isActive);
// //         setLastChecked(new Date());
// //         setCheckingPlan(false);

// //         // ✅ If plan inactive, logout worker immediately
// //         if (!planStatus.isActive && isAuthenticated) {
// //           console.log('🚨 SELLER PLAN INACTIVE - FORCING WORKER LOGOUT');
// //           await handleForceLogout('Seller subscription is not active');
// //         }

// //       } catch (error: any) {
// //         console.error('❌ Initial check failed:', error);
// //         setSellerPlanActive(false);
// //         setCheckingPlan(false);
// //       }
// //     };

// //     initialCheck();

// //     // ✅ PHASE 2: Real-time Listener (Primary)
// //     try {
// //       console.log('📡 Starting real-time listener...');

// //       const unsubscribe = subscribeToSellerPlanStatus(
// //         sellerId,
        
// //         // ✅ On status change callback
// //         (isActive, subscription) => {
// //           console.log('📢 Real-time status update:', isActive);
          
// //           const wasInactive = sellerPlanActive === false;
// //           const nowActive = isActive === true;

// //           setSellerPlanActive(isActive);
// //           setLastChecked(new Date());
// //           setRealtimeConnected(true);

// //           // ✅ CRITICAL: Auto-redirect if plan just activated
// //           if (wasInactive && nowActive) {
// //             console.log('🎉 PLAN JUST ACTIVATED! Auto-refreshing...');
            
// //             // Show success notification
// //             alert('✅ Seller plan activated! You now have access to scan tiles.');
            
// //             // Force page reload to clear any cached restrictions
// //             setTimeout(() => {
// //               window.location.reload();
// //             }, 1000);
// //           }

// //           // ✅ CRITICAL: Force logout if plan became inactive
// //           if (!isActive && isAuthenticated) {
// //             console.log('🚨 PLAN BECAME INACTIVE - FORCING LOGOUT');
// //             handleForceLogout('Seller subscription expired');
// //           }
// //         },
        
// //         // ✅ On error callback
// //         (error) => {
// //           console.error('❌ Real-time listener error:', error);
// //           setRealtimeConnected(false);
          
// //           // Fallback to polling if listener fails
// //           console.log('⚠️ Falling back to polling method...');
// //           startPolling(sellerId);
// //         }
// //       );

// //       unsubscribeRef.current = unsubscribe;
// //       console.log('✅ Real-time listener active');

// //     } catch (error) {
// //       console.error('❌ Failed to start listener, using polling:', error);
// //       setRealtimeConnected(false);
// //       startPolling(sellerId);
// //     }

// //     // ✅ PHASE 3: Fallback Polling (Secondary - only if listener fails)
// //     const startPolling = (sellerId: string) => {
// //       if (pollingIntervalRef.current) return; // Already polling

// //       console.log('⏰ Starting fallback polling (every 10 seconds)...');

// //       pollingIntervalRef.current = setInterval(async () => {
// //         try {
// //           console.log('🔄 Polling plan status...');
          
// //           const planStatus = await checkSellerPlanStatus(sellerId, {
// //             source: 'server',
// //             checkExpiry: true
// //           });

// //           setSellerPlanActive(planStatus.isActive);
// //           setLastChecked(new Date());

// //           if (!planStatus.isActive && isAuthenticated) {
// //             console.log('🚨 PLAN INACTIVE (polling) - FORCING LOGOUT');
// //             await handleForceLogout('Seller subscription is not active');
// //           }

// //         } catch (error) {
// //           console.error('❌ Polling check failed:', error);
// //         }
// //       }, 10000); // 10 seconds
// //     };

// //     // ✅ Cleanup on unmount
// //     return () => {
// //       console.log('🛑 Cleaning up plan monitoring...');
      
// //       if (unsubscribeRef.current) {
// //         unsubscribeRef.current();
// //         unsubscribeRef.current = null;
// //         console.log('✅ Real-time listener stopped');
// //       }
      
// //       if (pollingIntervalRef.current) {
// //         clearInterval(pollingIntervalRef.current);
// //         pollingIntervalRef.current = null;
// //         console.log('✅ Polling stopped');
// //       }
// //     };

// //   }, [currentUser, isAuthenticated]);

// //   // ═══════════════════════════════════════════════════════════════
// //   // ✅ FORCE LOGOUT FUNCTION
// //   // ═══════════════════════════════════════════════════════════════

// //   const handleForceLogout = async (reason: string) => {
// //     try {
// //       console.log('🔒 Force logout initiated:', reason);

// //       // Sign out from Firebase Auth
// //       await auth.signOut();

// //       // Clear all storage
// //       localStorage.clear();
// //       sessionStorage.clear();

// //       // Show alert
// //       alert(`🚫 Access Revoked\n\n${reason}\n\nYou have been logged out.`);

// //       // Redirect to home
// //       window.location.href = '/';

// //     } catch (error) {
// //       console.error('❌ Logout error:', error);
// //       // Force redirect anyway
// //       window.location.href = '/';
// //     }
// //   };

// //   // ═══════════════════════════════════════════════════════════════
// //   // ✅ RENDER: LOADING STATE
// //   // ═══════════════════════════════════════════════════════════════

// //   if (currentUser === undefined || checkingPlan) {
// //     return (
// //       <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
// //         <div className="text-center">
// //           <Loader className="w-10 h-10 animate-spin text-blue-600 mx-auto mb-4" />
// //           <p className="text-base text-gray-600">
// //             {checkingPlan ? 'Verifying access permissions...' : 'Checking authentication...'}
// //           </p>
// //           {realtimeConnected && (
// //             <p className="text-xs text-green-600 mt-2">
// //               📡 Real-time monitoring active
// //             </p>
// //           )}
// //           {lastChecked && (
// //             <p className="text-xs text-gray-500 mt-1">
// //               Last checked: {lastChecked.toLocaleTimeString()}
// //             </p>
// //           )}
// //         </div>
// //       </div>
// //     );
// //   }

// //   // ═══════════════════════════════════════════════════════════════
// //   // ✅ RENDER: NOT AUTHENTICATED
// //   // ═══════════════════════════════════════════════════════════════

// //   if (!isAuthenticated || !currentUser) {
// //     return <Navigate to="/" replace />;
// //   }

// //   // ═══════════════════════════════════════════════════════════════
// //   // ✅ RENDER: INVALID ROLE
// //   // ═══════════════════════════════════════════════════════════════

// //   const allowedRoles = ['worker', 'seller', 'admin'];
// //   if (!allowedRoles.includes(currentUser.role)) {
// //     return (
// //       <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-8">
// //         <div className="text-center max-w-md w-full mx-auto bg-white rounded-xl shadow-lg p-8">
// //           <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
// //           <h2 className="text-2xl font-semibold text-gray-800 mb-4">Access Denied</h2>
// //           <p className="text-base text-gray-600 mb-6">
// //             You don't have permission to access this page.
// //           </p>
// //           <button 
// //             onClick={() => window.location.href = '/'}
// //             className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
// //           >
// //             Go to Home
// //           </button>
// //         </div>
// //       </div>
// //     );
// //   }

// //   // ═══════════════════════════════════════════════════════════════
// //   // ✅ WORKER-SPECIFIC CHECKS
// //   // ═══════════════════════════════════════════════════════════════

// //   if (currentUser.role === 'worker') {
    
// //     // ✅ CHECK 1: Worker account disabled
// //     if (currentUser.is_active === false) {
// //       return (
// //         <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-8">
// //           <div className="text-center max-w-md w-full mx-auto bg-white rounded-xl shadow-lg p-8">
// //             <XCircle className="w-16 h-16 text-orange-500 mx-auto mb-4 animate-pulse" />
// //             <h2 className="text-2xl font-semibold text-gray-800 mb-4">Account Disabled</h2>
// //             <p className="text-base text-gray-600 mb-6">
// //               Your worker account has been disabled by the seller. Please contact them to reactivate your account.
// //             </p>
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

// //     // ✅ CHECK 2: Worker account deleted
// //     if (currentUser.account_status === 'deleted') {
// //       return (
// //         <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-8">
// //           <div className="text-center max-w-md w-full mx-auto bg-white rounded-xl shadow-lg p-8">
// //             <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
// //             <h2 className="text-2xl font-semibold text-gray-800 mb-4">Account Not Found</h2>
// //             <p className="text-base text-gray-600 mb-6">
// //               Your worker account has been removed. Please contact the seller for a new account.
// //             </p>
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

// //     // ✅ CHECK 3: SELLER'S PLAN EXPIRED/INACTIVE
// //     if (sellerPlanActive === false) {
// //       return (
// //         <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50 px-4 py-8">
// //           <div className="text-center max-w-md w-full mx-auto bg-white rounded-xl shadow-2xl p-8 border-2 border-red-200">
// //             <Shield className="w-20 h-20 text-red-600 mx-auto mb-4 animate-pulse" />
// //             <h2 className="text-2xl font-bold text-gray-800 mb-4">🚫 Access Suspended</h2>
            
// //             <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 mb-6">
// //               <p className="text-red-900 font-semibold mb-2">
// //                 Seller's Subscription Has Expired
// //               </p>
// //               <p className="text-sm text-red-700">
// //                 The seller's plan is no longer active. You cannot access the system until they renew their subscription.
// //               </p>
// //             </div>

// //             <div className="text-left space-y-2 mb-6 text-sm text-gray-700 bg-gray-50 p-4 rounded-lg">
// //               <p className="flex items-center gap-2">
// //                 <span className="text-red-500">✗</span>
// //                 <span>QR Scanning: Disabled</span>
// //               </p>
// //               <p className="flex items-center gap-2">
// //                 <span className="text-red-500">✗</span>
// //                 <span>Tile Management: Disabled</span>
// //               </p>
// //               <p className="flex items-center gap-2">
// //                 <span className="text-red-500">✗</span>
// //                 <span>All Features: Locked</span>
// //               </p>
// //             </div>

// //             <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-6">
// //               <p className="text-sm text-blue-800">
// //                 💡 <strong>What to do?</strong> Contact your seller and ask them to renew their plan. 
// //                 Access will be restored automatically once renewed.
// //               </p>
// //             </div>

// //             {realtimeConnected && (
// //               <div className="bg-green-50 border border-green-200 rounded-lg p-2 mb-4">
// //                 <p className="text-xs text-green-700">
// //                   📡 Monitoring plan status in real-time...
// //                 </p>
// //               </div>
// //             )}

// //             <button 
// //               onClick={() => handleForceLogout('Seller plan inactive')}
// //               className="w-full px-6 py-3 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-lg hover:from-red-700 hover:to-orange-700 font-semibold shadow-lg"
// //             >
// //               Logout
// //             </button>
// //           </div>
// //         </div>
// //       );
// //     }
// //   }

// //   // ═══════════════════════════════════════════════════════════════
// //   // ✅ ALL CHECKS PASSED - RENDER PROTECTED CONTENT
// //   // ═══════════════════════════════════════════════════════════════

// //   return <>{children}</>;
// // };

// // console.log('✅ WorkerProtectedRoute loaded - PRODUCTION v6.0 (REAL-TIME)'); 
// // ═══════════════════════════════════════════════════════════════
// // ✅ WORKER PROTECTED ROUTE - PRODUCTION v7.0 (COMPLETE)
// // ═══════════════════════════════════════════════════════════════

// import React, { useEffect, useState, useRef } from 'react';
// import { Navigate } from 'react-router-dom';
// import { useAppStore } from '../stores/appStore';
// import { AlertCircle, Loader, Shield, XCircle } from 'lucide-react';
// import { 
//   checkSellerPlanStatus, 
//   subscribeToSellerPlanStatus
// } from '../lib/firebaseutils';
// import { auth } from '../lib/firebase';

// interface WorkerProtectedRouteProps {
//   children: React.ReactNode;
// }

// export const WorkerProtectedRoute: React.FC<WorkerProtectedRouteProps> = ({ children }) => {
//   const { currentUser, isAuthenticated } = useAppStore();
  
//   // ─────────────────────────────────────────────────────────────
//   // STATE MANAGEMENT
//   // ─────────────────────────────────────────────────────────────
  
//   const [sellerPlanActive, setSellerPlanActive] = useState<boolean | null>(null);
//   const [checkingPlan, setCheckingPlan] = useState(true);
//   const [lastChecked, setLastChecked] = useState<Date | null>(null);
//   const [realtimeConnected, setRealtimeConnected] = useState(false);
  
//   // ✅ Refs to prevent multiple listeners
//   const unsubscribeRef = useRef<(() => void) | null>(null);
//   const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

//   // ═══════════════════════════════════════════════════════════════
//   // ✅ REAL-TIME PLAN STATUS MONITORING
//   // ═══════════════════════════════════════════════════════════════

//   useEffect(() => {
//     if (!currentUser || currentUser.role !== 'worker') {
//       setCheckingPlan(false);
//       return;
//     }

//     // ✅ ENHANCED: Multiple fallback methods to get seller_id
//     const sellerId = 
//       currentUser.seller_id || 
//       currentUser.created_by || 
//       (currentUser as any).sellerId || 
//       (currentUser as any).createdBy;
    
//     if (!sellerId) {
//       console.error('❌ Worker has no seller_id');
//       console.error('📊 Worker profile:', currentUser);
//       console.error('🔑 Available fields:', Object.keys(currentUser));
      
//       // ✅ Show detailed error
//       setSellerPlanActive(false);
//       setCheckingPlan(false);
      
//       // ✅ Alert user with detailed info
//       setTimeout(() => {
//         alert(
//           '⚠️ Configuration Error\n\n' +
//           'Your worker account is missing required seller information.\n\n' +
//           'Technical Details:\n' +
//           `• Worker ID: ${currentUser.user_id}\n` +
//           `• Email: ${currentUser.email}\n` +
//           `• Missing: seller_id field\n\n` +
//           'Please contact your seller to recreate your account.\n\n' +
//           'You will be logged out for security.'
//         );
        
//         // Force logout
//         handleForceLogout('Missing seller_id configuration');
//       }, 1000);
      
//       return;
//     }

//     console.log('🔔 Setting up real-time plan monitoring for worker...');
//     console.log('   Seller ID:', sellerId);
//     console.log('   Worker ID:', currentUser.user_id);
//     console.log('   Worker Email:', currentUser.email);

//     // ✅ PHASE 1: Initial Check (Cache bypass)
//     const initialCheck = async () => {
//       try {
//         console.log('🔍 Initial plan check (server fetch)...');
        
//         const planStatus = await checkSellerPlanStatus(sellerId, {
//           source: 'server',
//           checkExpiry: true
//         });

//         console.log('📊 Initial status:', planStatus.isActive);
//         setSellerPlanActive(planStatus.isActive);
//         setLastChecked(new Date());
//         setCheckingPlan(false);

//         // ✅ If plan inactive, logout worker immediately
//         if (!planStatus.isActive && isAuthenticated) {
//           console.log('🚨 SELLER PLAN INACTIVE - FORCING WORKER LOGOUT');
//           await handleForceLogout('Seller subscription is not active');
//         }

//       } catch (error: any) {
//         console.error('❌ Initial check failed:', error);
//         setSellerPlanActive(false);
//         setCheckingPlan(false);
//       }
//     };

//     initialCheck();

//     // ✅ PHASE 2: Real-time Listener (Primary)
//     try {
//       console.log('📡 Starting real-time listener...');

//       const unsubscribe = subscribeToSellerPlanStatus(
//         sellerId,
        
//         // ✅ On status change callback
//         (isActive, subscription) => {
//           console.log('📢 Real-time status update:', isActive);
          
//           const wasInactive = sellerPlanActive === false;
//           const nowActive = isActive === true;

//           setSellerPlanActive(isActive);
//           setLastChecked(new Date());
//           setRealtimeConnected(true);

//           // ✅ CRITICAL: Auto-redirect if plan just activated
//           if (wasInactive && nowActive) {
//             console.log('🎉 PLAN JUST ACTIVATED! Auto-refreshing...');
            
//             // Show success notification
//             alert('✅ Seller plan activated! You now have access to scan tiles.');
            
//             // Force page reload
//             setTimeout(() => {
//               window.location.reload();
//             }, 1000);
//           }

//           // ✅ CRITICAL: Force logout if plan became inactive
//           if (!isActive && isAuthenticated) {
//             console.log('🚨 PLAN BECAME INACTIVE - FORCING LOGOUT');
//             handleForceLogout('Seller subscription expired');
//           }
//         },
        
//         // ✅ On error callback
//         (error) => {
//           console.error('❌ Real-time listener error:', error);
//           setRealtimeConnected(false);
          
//           // Fallback to polling
//           console.log('⚠️ Falling back to polling method...');
//           startPolling(sellerId);
//         }
//       );

//       unsubscribeRef.current = unsubscribe;
//       console.log('✅ Real-time listener active');

//     } catch (error) {
//       console.error('❌ Failed to start listener, using polling:', error);
//       setRealtimeConnected(false);
//       startPolling(sellerId);
//     }

//     // ✅ PHASE 3: Fallback Polling
//     const startPolling = (sellerId: string) => {
//       if (pollingIntervalRef.current) return;

//       console.log('⏰ Starting fallback polling (every 10 seconds)...');

//       pollingIntervalRef.current = setInterval(async () => {
//         try {
//           console.log('🔄 Polling plan status...');
          
//           const planStatus = await checkSellerPlanStatus(sellerId, {
//             source: 'server',
//             checkExpiry: true
//           });

//           setSellerPlanActive(planStatus.isActive);
//           setLastChecked(new Date());

//           if (!planStatus.isActive && isAuthenticated) {
//             console.log('🚨 PLAN INACTIVE (polling) - FORCING LOGOUT');
//             await handleForceLogout('Seller subscription is not active');
//           }

//         } catch (error) {
//           console.error('❌ Polling check failed:', error);
//         }
//       }, 10000);
//     };

//     // ✅ Cleanup on unmount
//     return () => {
//       console.log('🛑 Cleaning up plan monitoring...');
      
//       if (unsubscribeRef.current) {
//         unsubscribeRef.current();
//         unsubscribeRef.current = null;
//         console.log('✅ Real-time listener stopped');
//       }
      
//       if (pollingIntervalRef.current) {
//         clearInterval(pollingIntervalRef.current);
//         pollingIntervalRef.current = null;
//         console.log('✅ Polling stopped');
//       }
//     };

//   }, [currentUser, isAuthenticated]);

//   // ═══════════════════════════════════════════════════════════════
//   // ✅ FORCE LOGOUT FUNCTION
//   // ═══════════════════════════════════════════════════════════════

//   const handleForceLogout = async (reason: string) => {
//     try {
//       console.log('🔒 Force logout initiated:', reason);

//       // Sign out from Firebase Auth
//       await auth.signOut();

//       // Clear all storage
//       localStorage.clear();
//       sessionStorage.clear();

//       // Show alert
//       alert(`🚫 Access Revoked\n\n${reason}\n\nYou have been logged out.`);

//       // Redirect to home
//       window.location.href = '/';

//     } catch (error) {
//       console.error('❌ Logout error:', error);
//       // Force redirect anyway
//       window.location.href = '/';
//     }
//   };

//   // ═══════════════════════════════════════════════════════════════
//   // ✅ RENDER: LOADING STATE
//   // ═══════════════════════════════════════════════════════════════

//   if (currentUser === undefined || checkingPlan) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
//         <div className="text-center">
//           <Loader className="w-10 h-10 animate-spin text-blue-600 mx-auto mb-4" />
//           <p className="text-base text-gray-600">
//             {checkingPlan ? 'Verifying access permissions...' : 'Checking authentication...'}
//           </p>
//           {realtimeConnected && (
//             <p className="text-xs text-green-600 mt-2 flex items-center justify-center gap-1">
//               <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
//               Real-time monitoring active
//             </p>
//           )}
//           {lastChecked && (
//             <p className="text-xs text-gray-500 mt-1">
//               Last checked: {lastChecked.toLocaleTimeString()}
//             </p>
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
//       <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-8">
//         <div className="text-center max-w-md w-full mx-auto bg-white rounded-xl shadow-lg p-8">
//           <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
//           <h2 className="text-2xl font-semibold text-gray-800 mb-4">Access Denied</h2>
//           <p className="text-base text-gray-600 mb-6">
//             You don't have permission to access this page.
//           </p>
//           <button 
//             onClick={() => window.location.href = '/'}
//             className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
//           >
//             Go to Home
//           </button>
//         </div>
//       </div>
//     );
//   }

//   // ═══════════════════════════════════════════════════════════════
//   // ✅ WORKER-SPECIFIC CHECKS
//   // ═══════════════════════════════════════════════════════════════

//   if (currentUser.role === 'worker') {
    
//     // ✅ CHECK 1: Worker account disabled
//     if (currentUser.is_active === false) {
//       return (
//         <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-8">
//           <div className="text-center max-w-md w-full mx-auto bg-white rounded-xl shadow-lg p-8">
//             <XCircle className="w-16 h-16 text-orange-500 mx-auto mb-4 animate-pulse" />
//             <h2 className="text-2xl font-semibold text-gray-800 mb-4">Account Disabled</h2>
//             <p className="text-base text-gray-600 mb-6">
//               Your worker account has been disabled by the seller. Please contact them to reactivate your account.
//             </p>
//             <button 
//               onClick={() => handleForceLogout('Account disabled')}
//               className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
//             >
//               Logout
//             </button>
//           </div>
//         </div>
//       );
//     }

//     // ✅ CHECK 2: Worker account deleted
//     if (currentUser.account_status === 'deleted') {
//       return (
//         <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-8">
//           <div className="text-center max-w-md w-full mx-auto bg-white rounded-xl shadow-lg p-8">
//             <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
//             <h2 className="text-2xl font-semibold text-gray-800 mb-4">Account Not Found</h2>
//             <p className="text-base text-gray-600 mb-6">
//               Your worker account has been removed. Please contact the seller for a new account.
//             </p>
//             <button 
//               onClick={() => handleForceLogout('Account deleted')}
//               className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
//             >
//               Logout
//             </button>
//           </div>
//         </div>
//       );
//     }

//     // ✅ CHECK 3: SELLER'S PLAN EXPIRED/INACTIVE
//     if (sellerPlanActive === false) {
//       return (
//         <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50 px-4 py-8">
//           <div className="text-center max-w-md w-full mx-auto bg-white rounded-xl shadow-2xl p-8 border-2 border-red-200">
//             <Shield className="w-20 h-20 text-red-600 mx-auto mb-4 animate-pulse" />
//             <h2 className="text-2xl font-bold text-gray-800 mb-4">🚫 Access Suspended</h2>
            
//             <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 mb-6">
//               <p className="text-red-900 font-semibold mb-2">
//                 Seller's Subscription Has Expired
//               </p>
//               <p className="text-sm text-red-700">
//                 The seller's plan is no longer active. You cannot access the system until they renew their subscription.
//               </p>
//             </div>

//             <div className="text-left space-y-2 mb-6 text-sm text-gray-700 bg-gray-50 p-4 rounded-lg">
//               <p className="flex items-center gap-2">
//                 <span className="text-red-500">✗</span>
//                 <span>QR Scanning: Disabled</span>
//               </p>
//               <p className="flex items-center gap-2">
//                 <span className="text-red-500">✗</span>
//                 <span>Tile Management: Disabled</span>
//               </p>
//               <p className="flex items-center gap-2">
//                 <span className="text-red-500">✗</span>
//                 <span>All Features: Locked</span>
//               </p>
//             </div>

//             <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-6">
//               <p className="text-sm text-blue-800">
//                 💡 <strong>What to do?</strong> Contact your seller and ask them to renew their plan. 
//                 Access will be restored automatically once renewed.
//               </p>
//             </div>

//             {realtimeConnected && (
//               <div className="bg-green-50 border border-green-200 rounded-lg p-2 mb-4">
//                 <p className="text-xs text-green-700 flex items-center justify-center gap-1">
//                   <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
//                   Monitoring plan status in real-time...
//                 </p>
//               </div>
//             )}

//             <button 
//               onClick={() => handleForceLogout('Seller plan inactive')}
//               className="w-full px-6 py-3 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-lg hover:from-red-700 hover:to-orange-700 font-semibold shadow-lg transition-all"
//             >
//               Logout
//             </button>
//           </div>
//         </div>
//       );
//     }
//   }

//   // ═══════════════════════════════════════════════════════════════
//   // ✅ ALL CHECKS PASSED - RENDER PROTECTED CONTENT
//   // ═══════════════════════════════════════════════════════════════

//   return <>{children}</>;
// };

// console.log('✅ WorkerProtectedRoute loaded - PRODUCTION v7.0 (COMPLETE)'); 
// ═══════════════════════════════════════════════════════════════
// ✅ WORKER PROTECTED ROUTE - PRODUCTION v8.0 (COMPLETE FIX)
// ═══════════════════════════════════════════════════════════════

import React, { useEffect, useState, useRef } from 'react';
import { Navigate } from 'react-router-dom';
import { useAppStore } from '../stores/appStore';
import { AlertCircle, Loader, Shield, XCircle } from 'lucide-react';
import { 
  checkSellerPlanStatus, 
  subscribeToSellerPlanStatus
} from '../lib/firebaseutils';
import { auth } from '../lib/firebase';

interface WorkerProtectedRouteProps {
  children: React.ReactNode;
}

export const WorkerProtectedRoute: React.FC<WorkerProtectedRouteProps> = ({ children }) => {
  const { currentUser, isAuthenticated } = useAppStore();
  
  // ─────────────────────────────────────────────────────────────
  // STATE MANAGEMENT
  // ─────────────────────────────────────────────────────────────
  
  const [sellerPlanActive, setSellerPlanActive] = useState<boolean | null>(null);
  const [checkingPlan, setCheckingPlan] = useState(true);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);
  const [realtimeConnected, setRealtimeConnected] = useState(false);
  
  // ✅ Refs to prevent multiple listeners
  const unsubscribeRef = useRef<(() => void) | null>(null);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // ═══════════════════════════════════════════════════════════════
  // ✅ FORCE LOGOUT FUNCTION (DECLARE FIRST)
  // ═══════════════════════════════════════════════════════════════

  const handleForceLogout = async (reason: string) => {
    try {
      console.log('🔒 Force logout initiated:', reason);

      // Sign out from Firebase Auth
      await auth.signOut();

      // Clear all storage
      localStorage.clear();
      sessionStorage.clear();

      // Show alert
      alert(`🚫 Access Revoked\n\n${reason}\n\nYou have been logged out.`);

      // Redirect to home
      window.location.href = '/';

    } catch (error) {
      console.error('❌ Logout error:', error);
      // Force redirect anyway
      window.location.href = '/';
    }
  };

  // ═══════════════════════════════════════════════════════════════
  // ✅ REAL-TIME PLAN STATUS MONITORING
  // ═══════════════════════════════════════════════════════════════

  useEffect(() => {
    if (!currentUser || currentUser.role !== 'worker') {
      setCheckingPlan(false);
      return;
    }

    // ✅ ENHANCED: Multiple fallback methods to get seller_id
    const sellerId = 
      currentUser.seller_id || 
      currentUser.created_by || 
      (currentUser as any).sellerId || 
      (currentUser as any).createdBy;
    
    if (!sellerId) {
      console.error('❌ Worker has no seller_id');
      console.error('📊 Worker profile:', currentUser);
      console.error('🔑 Available fields:', Object.keys(currentUser));
      
      // ✅ Show detailed error
      setSellerPlanActive(false);
      setCheckingPlan(false);
      
      // ✅ Alert user with detailed info
      setTimeout(() => {
        alert(
          '⚠️ Configuration Error\n\n' +
          'Your worker account is missing required seller information.\n\n' +
          'Technical Details:\n' +
          `• Worker ID: ${currentUser.user_id}\n` +
          `• Email: ${currentUser.email}\n` +
          `• Missing: seller_id field\n\n` +
          'Please contact your seller to recreate your account.\n\n' +
          'You will be logged out for security.'
        );
        
        // Force logout
        handleForceLogout('Missing seller_id configuration');
      }, 1000);
      
      return;
    }

    console.log('🔔 Setting up real-time plan monitoring for worker...');
    console.log('   Seller ID:', sellerId);
    console.log('   Worker ID:', currentUser.user_id);
    console.log('   Worker Email:', currentUser.email);

    // ═══════════════════════════════════════════════════════════════
    // ✅ DECLARE startPolling FUNCTION FIRST (BEFORE USE)
    // ═══════════════════════════════════════════════════════════════
    
    const startPolling = (sellerId: string) => {
      if (pollingIntervalRef.current) return; // Already polling

      console.log('⏰ Starting fallback polling (every 10 seconds)...');

      pollingIntervalRef.current = setInterval(async () => {
        try {
          console.log('🔄 Polling plan status...');
          
          const planStatus = await checkSellerPlanStatus(sellerId, {
            source: 'server',
            checkExpiry: true
          });

          setSellerPlanActive(planStatus.isActive);
          setLastChecked(new Date());

          if (!planStatus.isActive && isAuthenticated) {
            console.log('🚨 PLAN INACTIVE (polling) - FORCING LOGOUT');
            await handleForceLogout('Seller subscription is not active');
          }

        } catch (error) {
          console.error('❌ Polling check failed:', error);
        }
      }, 10000); // 10 seconds
    };

    // ✅ PHASE 1: Initial Check (Cache bypass)
    const initialCheck = async () => {
      try {
        console.log('🔍 Initial plan check (server fetch)...');
        
        const planStatus = await checkSellerPlanStatus(sellerId, {
          source: 'server',
          checkExpiry: true
        });

        console.log('📊 Initial status:', planStatus.isActive);
        setSellerPlanActive(planStatus.isActive);
        setLastChecked(new Date());
        setCheckingPlan(false);

        // ✅ If plan inactive, logout worker immediately
        if (!planStatus.isActive && isAuthenticated) {
          console.log('🚨 SELLER PLAN INACTIVE - FORCING WORKER LOGOUT');
          await handleForceLogout('Seller subscription is not active');
        }

      } catch (error: any) {
        console.error('❌ Initial check failed:', error);
        setSellerPlanActive(false);
        setCheckingPlan(false);
      }
    };

    initialCheck();

    // ✅ PHASE 2: Real-time Listener (Primary)
    try {
      console.log('📡 Starting real-time listener...');

      const unsubscribe = subscribeToSellerPlanStatus(
        sellerId,
        
        // ✅ On status change callback
        (isActive, subscription) => {
          console.log('📢 Real-time status update:', isActive);
          
          const wasInactive = sellerPlanActive === false;
          const nowActive = isActive === true;

          setSellerPlanActive(isActive);
          setLastChecked(new Date());
          setRealtimeConnected(true);

          // ✅ CRITICAL: Auto-redirect if plan just activated
          if (wasInactive && nowActive) {
            console.log('🎉 PLAN JUST ACTIVATED! Auto-refreshing...');
            
            // Show success notification
            alert('✅ Seller plan activated! You now have access to scan tiles.');
            
            // Force page reload
            setTimeout(() => {
              window.location.reload();
            }, 1000);
          }

          // ✅ CRITICAL: Force logout if plan became inactive
          if (!isActive && isAuthenticated) {
            console.log('🚨 PLAN BECAME INACTIVE - FORCING LOGOUT');
            handleForceLogout('Seller subscription expired');
          }
        },
        
        // ✅ On error callback
        (error) => {
          console.error('❌ Real-time listener error:', error);
          setRealtimeConnected(false);
          
          // Fallback to polling
          console.log('⚠️ Falling back to polling method...');
          startPolling(sellerId); // ✅ Now this works - declared above
        }
      );

      unsubscribeRef.current = unsubscribe;
      console.log('✅ Real-time listener active');

    } catch (error) {
      console.error('❌ Failed to start listener, using polling:', error);
      setRealtimeConnected(false);
      startPolling(sellerId); // ✅ Now this works - declared above
    }

    // ✅ Cleanup on unmount
    return () => {
      console.log('🛑 Cleaning up plan monitoring...');
      
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
        unsubscribeRef.current = null;
        console.log('✅ Real-time listener stopped');
      }
      
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
        console.log('✅ Polling stopped');
      }
    };

  }, [currentUser, isAuthenticated]);

  // ═══════════════════════════════════════════════════════════════
  // ✅ RENDER: LOADING STATE
  // ═══════════════════════════════════════════════════════════════

  if (currentUser === undefined || checkingPlan) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
        <div className="text-center">
          <Loader className="w-10 h-10 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-base text-gray-600">
            {checkingPlan ? 'Verifying access permissions...' : 'Checking authentication...'}
          </p>
          {realtimeConnected && (
            <p className="text-xs text-green-600 mt-2 flex items-center justify-center gap-1">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              Real-time monitoring active
            </p>
          )}
          {lastChecked && (
            <p className="text-xs text-gray-500 mt-1">
              Last checked: {lastChecked.toLocaleTimeString()}
            </p>
          )}
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════
  // ✅ RENDER: NOT AUTHENTICATED
  // ═══════════════════════════════════════════════════════════════

  if (!isAuthenticated || !currentUser) {
    return <Navigate to="/" replace />;
  }

  // ═══════════════════════════════════════════════════════════════
  // ✅ RENDER: INVALID ROLE
  // ═══════════════════════════════════════════════════════════════

  const allowedRoles = ['worker', 'seller', 'admin'];
  if (!allowedRoles.includes(currentUser.role)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-8">
        <div className="text-center max-w-md w-full mx-auto bg-white rounded-xl shadow-lg p-8">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Access Denied</h2>
          <p className="text-base text-gray-600 mb-6">
            You don't have permission to access this page.
          </p>
          <button 
            onClick={() => window.location.href = '/'}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════
  // ✅ WORKER-SPECIFIC CHECKS
  // ═══════════════════════════════════════════════════════════════

  if (currentUser.role === 'worker') {
    
    // ✅ CHECK 1: Worker account disabled
    if (currentUser.is_active === false) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-8">
          <div className="text-center max-w-md w-full mx-auto bg-white rounded-xl shadow-lg p-8">
            <XCircle className="w-16 h-16 text-orange-500 mx-auto mb-4 animate-pulse" />
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Account Disabled</h2>
            <p className="text-base text-gray-600 mb-6">
              Your worker account has been disabled by the seller. Please contact them to reactivate your account.
            </p>
            <button 
              onClick={() => handleForceLogout('Account disabled')}
              className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      );
    }

    // ✅ CHECK 2: Worker account deleted
    if (currentUser.account_status === 'deleted') {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-8">
          <div className="text-center max-w-md w-full mx-auto bg-white rounded-xl shadow-lg p-8">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Account Not Found</h2>
            <p className="text-base text-gray-600 mb-6">
              Your worker account has been removed. Please contact the seller for a new account.
            </p>
            <button 
              onClick={() => handleForceLogout('Account deleted')}
              className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      );
    }

    // ✅ CHECK 3: SELLER'S PLAN EXPIRED/INACTIVE
    if (sellerPlanActive === false) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50 px-4 py-8">
          <div className="text-center max-w-md w-full mx-auto bg-white rounded-xl shadow-2xl p-8 border-2 border-red-200">
            <Shield className="w-20 h-20 text-red-600 mx-auto mb-4 animate-pulse" />
            <h2 className="text-2xl font-bold text-gray-800 mb-4">🚫 Access Suspended</h2>
            
            <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-900 font-semibold mb-2">
                Seller's Subscription Has Expired
              </p>
              <p className="text-sm text-red-700">
                The seller's plan is no longer active. You cannot access the system until they renew their subscription.
              </p>
            </div>

            <div className="text-left space-y-2 mb-6 text-sm text-gray-700 bg-gray-50 p-4 rounded-lg">
              <p className="flex items-center gap-2">
                <span className="text-red-500">✗</span>
                <span>QR Scanning: Disabled</span>
              </p>
              <p className="flex items-center gap-2">
                <span className="text-red-500">✗</span>
                <span>Tile Management: Disabled</span>
              </p>
              <p className="flex items-center gap-2">
                <span className="text-red-500">✗</span>
                <span>All Features: Locked</span>
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-6">
              <p className="text-sm text-blue-800">
                💡 <strong>What to do?</strong> Contact your seller and ask them to renew their plan. 
                Access will be restored automatically once renewed.
              </p>
            </div>

            {realtimeConnected && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-2 mb-4">
                <p className="text-xs text-green-700 flex items-center justify-center gap-1">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  Monitoring plan status in real-time...
                </p>
              </div>
            )}

            <button 
              onClick={() => handleForceLogout('Seller plan inactive')}
              className="w-full px-6 py-3 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-lg hover:from-red-700 hover:to-orange-700 font-semibold shadow-lg transition-all"
            >
              Logout
            </button>
          </div>
        </div>
      );
    }
  }

  // ═══════════════════════════════════════════════════════════════
  // ✅ ALL CHECKS PASSED - RENDER PROTECTED CONTENT
  // ═══════════════════════════════════════════════════════════════

  return <>{children}</>;
};

console.log('✅ WorkerProtectedRoute loaded - PRODUCTION v8.0 (COMPLETE)');