
// // // // // // // // // // import React, { useState, useEffect } from 'react';
// // // // // // // // // // import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// // // // // // // // // // import { ProtectedRoute, AdminProtectedRoute, SellerProtectedRoute } from './components/ProtectedRoute';
// // // // // // // // // // import { WorkerProtectedRoute } from './components/WorkerProtectedRoute';
// // // // // // // // // // import { PlansModal } from './components/Payment/PlansModal';
// // // // // // // // // // import { PaymentSuccess } from './components/Payment/PaymentSuccess';
// // // // // // // // // // import { PaymentFailure } from './components/Payment/PaymentFailure';
// // // // // // // // // // import { useAuth } from './hooks/useAuth';
// // // // // // // // // // import { auth } from './lib/firebase';
// // // // // // // // // // import { DomainHeader } from './components/DomainHeader';
// // // // // // // // // // import { SellerDashboard } from './components/SellerDashboard';
// // // // // // // // // // import { AdminDashboard } from './components/AdminDashboard';
// // // // // // // // // // import { PublicShowroom } from './components/PublicShowroom';
// // // // // // // // // // import { SellerRequestForm } from './components/SellerRequestForm';            
// // // // // // // // // // import { AuthModal } from './components/Auth/AuthModal';
// // // // // // // // // // import { FloatingQRButton } from './components/FloatingQRButton';
// // // // // // // // // // import { TileDetailsPage } from './components/TileDetailsPage';
// // // // // // // // // // import { RoomSelectorPage } from './components/RoomSelectorPage';
// // // // // // // // // // import { Room3DViewPage } from './components/Room3DViewPage';
// // // // // // // // // // import { TileSearchPage } from './components/TileSearchPage';
// // // // // // // // // // import { ScanPage } from './components/ScanPage';
// // // // // // // // // // import { getCurrentDomainConfig, applyDomainTheme } from './utils/domainUtils';
// // // // // // // // // // import { WorkerErrorBoundary } from './components/WorkerErrorBoundary';
// // // // // // // // // // import { SellerAutoLogin } from './components/SellerAutoLogin';
// // // // // // // // // // import { Toaster } from 'react-hot-toast';
// // // // // // // // // // import { Eye } from 'lucide-react';

// // // // // // // // // // // ═══════════════════════════════════════════════════════════════
// // // // // // // // // // // ✅ PAYMENT IMPORTS (RAZORPAY)
// // // // // // // // // // // ═══════════════════════════════════════════════════════════════
// // // // // // // // // // import { PaymentConfirmationModal } from './components/Payment/PaymentConfirmationModal';
// // // // // // // // // // import { PaymentCheckout } from './components/Payment/PaymentCheckout';
// // // // // // // // // // import { initiatePayment } from './lib/paymentService';
// // // // // // // // // // import { getPlanById } from './lib/planService';
// // // // // // // // // // import type { Plan } from './types/plan.types';
// // // // // // // // // // import type { RazorpayCheckoutOptions } from './types/payment.types';

// // // // // // // // // // // ═══════════════════════════════════════════════════════════════
// // // // // // // // // // // ✅ ERROR BOUNDARY COMPONENT
// // // // // // // // // // // ═══════════════════════════════════════════════════════════════

// // // // // // // // // // class ErrorBoundary extends React.Component<
// // // // // // // // // //   { children: React.ReactNode },
// // // // // // // // // //   { hasError: boolean; error?: Error }
// // // // // // // // // // > {
// // // // // // // // // //   constructor(props: { children: React.ReactNode }) {
// // // // // // // // // //     super(props);
// // // // // // // // // //     this.state = { hasError: false };
// // // // // // // // // //   }

// // // // // // // // // //   static getDerivedStateFromError(error: Error) {
// // // // // // // // // //     return { hasError: true, error };
// // // // // // // // // //   }

// // // // // // // // // //   componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
// // // // // // // // // //     console.error('🔥 App Error Boundary caught error:', error, errorInfo);
// // // // // // // // // //   }

// // // // // // // // // //   render() {
// // // // // // // // // //     if (this.state.hasError) {
// // // // // // // // // //       return (
// // // // // // // // // //         <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center p-4">
// // // // // // // // // //           <div className="text-center p-6 sm:p-8 bg-white rounded-lg sm:rounded-xl shadow-lg max-w-md w-full">
// // // // // // // // // //             <div className="text-red-500 text-5xl sm:text-6xl mb-3 sm:mb-4">⚠️</div>
// // // // // // // // // //             <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">
// // // // // // // // // //               Something went wrong
// // // // // // // // // //             </h1>
// // // // // // // // // //             <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
// // // // // // // // // //               The application encountered an unexpected error. Please refresh the page or contact support.
// // // // // // // // // //             </p>
// // // // // // // // // //             {this.state.error && (
// // // // // // // // // //               <details className="mb-4 sm:mb-6 text-left">
// // // // // // // // // //                 <summary className="text-xs sm:text-sm text-gray-500 cursor-pointer hover:text-gray-700 transition-colors">
// // // // // // // // // //                   Error details
// // // // // // // // // //                 </summary>
// // // // // // // // // //                 <pre className="mt-2 p-2 sm:p-3 bg-gray-100 rounded text-xs overflow-x-auto">
// // // // // // // // // //                   {this.state.error.message}
// // // // // // // // // //                 </pre>
// // // // // // // // // //               </details>
// // // // // // // // // //             )}
// // // // // // // // // //             <button
// // // // // // // // // //               onClick={() => window.location.reload()}
// // // // // // // // // //               className="w-full sm:w-auto bg-red-600 text-white px-6 py-2.5 sm:py-3 rounded-lg hover:bg-red-700 active:bg-red-800 transition-colors font-medium text-sm sm:text-base touch-manipulation shadow-md hover:shadow-lg"
// // // // // // // // // //             >
// // // // // // // // // //               Refresh Page
// // // // // // // // // //             </button>
// // // // // // // // // //           </div>
// // // // // // // // // //         </div>
// // // // // // // // // //       );
// // // // // // // // // //     }

// // // // // // // // // //     return this.props.children;
// // // // // // // // // //   }
// // // // // // // // // // }

// // // // // // // // // // // ═══════════════════════════════════════════════════════════════
// // // // // // // // // // // ✅ MAIN APP CONTENT COMPONENT
// // // // // // // // // // // ═══════════════════════════════════════════════════════════════

// // // // // // // // // // function AppContent() {
// // // // // // // // // //   const { isAuthenticated, isLoading, user, error } = useAuth({
// // // // // // // // // //     enableActivityTracking: false,
// // // // // // // // // //     enableSessionWarnings: false,
// // // // // // // // // //     autoLogoutDelay: 0
// // // // // // // // // //   });
  
// // // // // // // // // //   const [showAuthModal, setShowAuthModal] = useState(false);
// // // // // // // // // //   const [showPlansModal, setShowPlansModal] = useState(false);
// // // // // // // // // //   const [domainConfig, setDomainConfig] = useState(getCurrentDomainConfig());
// // // // // // // // // //   const [isMobile, setIsMobile] = useState(false);

// // // // // // // // // //   // ═══════════════════════════════════════════════════════════════
// // // // // // // // // //   // ✅ PAYMENT STATE (RAZORPAY)
// // // // // // // // // //   // ═══════════════════════════════════════════════════════════════
// // // // // // // // // //   const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
// // // // // // // // // //   const [showPaymentConfirmation, setShowPaymentConfirmation] = useState(false);
// // // // // // // // // //   const [checkoutOptions, setCheckoutOptions] = useState<RazorpayCheckoutOptions | null>(null);
// // // // // // // // // //   const [paymentId, setPaymentId] = useState<string | null>(null);
// // // // // // // // // //   const [processingPayment, setProcessingPayment] = useState(false);

// // // // // // // // // //   // ═══════════════════════════════════════════════════════════════
// // // // // // // // // //   // ✅ MOBILE DETECTION
// // // // // // // // // //   // ═══════════════════════════════════════════════════════════════
  
// // // // // // // // // //   useEffect(() => {
// // // // // // // // // //     const checkMobile = () => {
// // // // // // // // // //       setIsMobile(window.innerWidth < 768);
// // // // // // // // // //     };
    
// // // // // // // // // //     checkMobile();
// // // // // // // // // //     window.addEventListener('resize', checkMobile);
    
// // // // // // // // // //     return () => window.removeEventListener('resize', checkMobile);
// // // // // // // // // //   }, []);

// // // // // // // // // //   // ═══════════════════════════════════════════════════════════════
// // // // // // // // // //   // ✅ APP INITIALIZATION
// // // // // // // // // //   // ═══════════════════════════════════════════════════════════════

// // // // // // // // // //   useEffect(() => {
// // // // // // // // // //     try {
// // // // // // // // // //       console.log('🚀 Tile Showroom App initializing...');
      
// // // // // // // // // //       const config = getCurrentDomainConfig();
// // // // // // // // // //       setDomainConfig(config);
// // // // // // // // // //       applyDomainTheme(config);
      
// // // // // // // // // //       console.log('🎯 Domain config:', config);
// // // // // // // // // //       console.log('👤 Auth state:', { 
// // // // // // // // // //         isAuthenticated, 
// // // // // // // // // //         isLoading, 
// // // // // // // // // //         userRole: user?.role,
// // // // // // // // // //         userId: user?.user_id 
// // // // // // // // // //       });
      
// // // // // // // // // //       document.title = config.title;
      
// // // // // // // // // //       let viewport = document.querySelector('meta[name="viewport"]');
// // // // // // // // // //       if (!viewport) {
// // // // // // // // // //         viewport = document.createElement('meta');
// // // // // // // // // //         viewport.setAttribute('name', 'viewport');
// // // // // // // // // //         viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes');
// // // // // // // // // //         document.head.appendChild(viewport);
// // // // // // // // // //       }
      
// // // // // // // // // //     } catch (error) {
// // // // // // // // // //       console.error('🔥 App initialization error:', error);
// // // // // // // // // //     }
// // // // // // // // // //   }, [isAuthenticated, isLoading, user]);

// // // // // // // // // //   // ═══════════════════════════════════════════════════════════════
// // // // // // // // // //   // ✅ WORKER ROUTE PROTECTION
// // // // // // // // // //   // ═══════════════════════════════════════════════════════════════

// // // // // // // // // //   useEffect(() => {
// // // // // // // // // //     if (isAuthenticated && user?.role === 'worker') {
// // // // // // // // // //       const currentPath = window.location.pathname;
// // // // // // // // // //       const allowedPaths = ['/scan', '/tile/', '/3d-view/', '/room-select/'];
// // // // // // // // // //       const isAllowedPath = allowedPaths.some(path => currentPath.startsWith(path));
      
// // // // // // // // // //       if (!isAllowedPath && currentPath !== '/') {
// // // // // // // // // //         console.log('🔒 Worker blocked from:', currentPath);
// // // // // // // // // //         window.location.replace('/scan');
// // // // // // // // // //       }
// // // // // // // // // //     }
// // // // // // // // // //   }, [isAuthenticated, user]);

// // // // // // // // // //   // ═══════════════════════════════════════════════════════════════
// // // // // // // // // //   // ✅ PLAN SELECTION HANDLER
// // // // // // // // // //   // ═══════════════════════════════════════════════════════════════

// // // // // // // // // //   const handlePlanSelection = async (planId: string) => {
// // // // // // // // // //     try {
// // // // // // // // // //       console.log('📦 Selected plan:', planId);
      
// // // // // // // // // //       if (!isAuthenticated) {
// // // // // // // // // //         console.log('🔐 User not authenticated, showing login modal...');
// // // // // // // // // //         setShowPlansModal(false);
// // // // // // // // // //         setShowAuthModal(true);
// // // // // // // // // //         return;
// // // // // // // // // //       }

// // // // // // // // // //       console.log('📋 Fetching plan details...');
// // // // // // // // // //       const plan = await getPlanById(planId);
      
// // // // // // // // // //       if (!plan) {
// // // // // // // // // //         alert('❌ Plan not found. Please try again.');
// // // // // // // // // //         return;
// // // // // // // // // //       }

// // // // // // // // // //       setSelectedPlan(plan);
// // // // // // // // // //       setShowPlansModal(false);
// // // // // // // // // //       setShowPaymentConfirmation(true);
      
// // // // // // // // // //     } catch (error: any) {
// // // // // // // // // //       console.error('❌ Error selecting plan:', error);
// // // // // // // // // //       alert(`❌ Error: ${error.message}`);
// // // // // // // // // //     }
// // // // // // // // // //   };

// // // // // // // // // //   // ═══════════════════════════════════════════════════════════════
// // // // // // // // // //   // ✅ PAYMENT CONFIRM HANDLER (RAZORPAY)
// // // // // // // // // //   // ═══════════════════════════════════════════════════════════════

// // // // // // // // // //   const handlePaymentConfirm = async () => {
// // // // // // // // // //     if (!selectedPlan) {
// // // // // // // // // //       alert('❌ No plan selected');
// // // // // // // // // //       return;
// // // // // // // // // //     }

// // // // // // // // // //     setProcessingPayment(true);

// // // // // // // // // //     try {
// // // // // // // // // //       console.log('💳 Initiating payment for plan:', selectedPlan.plan_name);

// // // // // // // // // //       const currentUser = auth.currentUser;
// // // // // // // // // //       if (!currentUser) {
// // // // // // // // // //         throw new Error('Please login first');
// // // // // // // // // //       }

// // // // // // // // // //       const result = await initiatePayment(
// // // // // // // // // //         selectedPlan.id,
// // // // // // // // // //         selectedPlan.plan_name,
// // // // // // // // // //         selectedPlan.price
// // // // // // // // // //       );

// // // // // // // // // //       if (!result.success || !result.checkoutOptions || !result.paymentId) {
// // // // // // // // // //         throw new Error(result.error || 'Failed to initiate payment');
// // // // // // // // // //       }

// // // // // // // // // //       console.log('✅ Payment initiated successfully');
// // // // // // // // // //       console.log('📝 Payment ID:', result.paymentId);

// // // // // // // // // //       setCheckoutOptions(result.checkoutOptions);
// // // // // // // // // //       setPaymentId(result.paymentId);
// // // // // // // // // //       setShowPaymentConfirmation(false);

// // // // // // // // // //     } catch (error: any) {
// // // // // // // // // //       console.error('❌ Payment initiation error:', error);
// // // // // // // // // //       alert(`❌ Payment Error:\n${error.message}`);
// // // // // // // // // //       setProcessingPayment(false);
// // // // // // // // // //     }
// // // // // // // // // //   };

// // // // // // // // // //   // ═══════════════════════════════════════════════════════════════
// // // // // // // // // //   // ✅ PAYMENT ERROR HANDLER
// // // // // // // // // //   // ═══════════════════════════════════════════════════════════════

// // // // // // // // // //   const handlePaymentError = (error: string) => {
// // // // // // // // // //     console.error('❌ Payment checkout error:', error);
// // // // // // // // // //     alert(`❌ Payment Error:\n${error}`);
    
// // // // // // // // // //     setCheckoutOptions(null);
// // // // // // // // // //     setPaymentId(null);
// // // // // // // // // //     setProcessingPayment(false);
// // // // // // // // // //     setSelectedPlan(null);
// // // // // // // // // //   };

// // // // // // // // // //   // ═══════════════════════════════════════════════════════════════
// // // // // // // // // //   // ✅ ERROR DISPLAY
// // // // // // // // // //   // ═══════════════════════════════════════════════════════════════

// // // // // // // // // //   const renderError = () => {
// // // // // // // // // //     if (!error) return null;
    
// // // // // // // // // //     return (
// // // // // // // // // //       <div className="mb-4 sm:mb-6 bg-red-50 border border-red-200 rounded-lg sm:rounded-xl p-3 sm:p-4 animate-shake">
// // // // // // // // // //         <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
// // // // // // // // // //           <div className="text-red-500 text-2xl sm:text-xl flex-shrink-0">⚠️</div>
// // // // // // // // // //           <div className="flex-1 min-w-0">
// // // // // // // // // //             <h3 className="font-semibold text-red-800 text-sm sm:text-base mb-1">
// // // // // // // // // //               Authentication Error
// // // // // // // // // //             </h3>
// // // // // // // // // //             <p className="text-red-700 text-xs sm:text-sm break-words">{error}</p>
// // // // // // // // // //           </div>
// // // // // // // // // //           <button
// // // // // // // // // //             onClick={() => window.location.reload()}
// // // // // // // // // //             className="w-full sm:w-auto bg-red-600 text-white px-4 py-2 rounded-lg text-xs sm:text-sm hover:bg-red-700 active:bg-red-800 transition-colors font-medium touch-manipulation flex-shrink-0"
// // // // // // // // // //           >
// // // // // // // // // //             Retry
// // // // // // // // // //           </button>
// // // // // // // // // //         </div>
// // // // // // // // // //       </div>
// // // // // // // // // //     );
// // // // // // // // // //   };

// // // // // // // // // //   // ═══════════════════════════════════════════════════════════════
// // // // // // // // // //   // ✅ LOADING STATE
// // // // // // // // // //   // ═══════════════════════════════════════════════════════════════

// // // // // // // // // //   const renderLoading = () => (
// // // // // // // // // //     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
// // // // // // // // // //       <div className="text-center max-w-md w-full">
// // // // // // // // // //         <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-b-4 border-blue-600 mx-auto mb-4 sm:mb-6"></div>
// // // // // // // // // //         <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-2">
// // // // // // // // // //           {domainConfig.title}
// // // // // // // // // //         </h2>
// // // // // // // // // //         <p className="text-base sm:text-lg text-gray-600 mb-1 sm:mb-2">Loading application...</p>
// // // // // // // // // //         <p className="text-xs sm:text-sm text-gray-500">Initializing secure authentication system</p>
        
// // // // // // // // // //         <div className="mt-4 sm:mt-6 space-y-2">
// // // // // // // // // //           <div className="flex items-center justify-center space-x-2 text-xs sm:text-sm text-gray-500">
// // // // // // // // // //             <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
// // // // // // // // // //             <span>Verifying authentication tokens</span>
// // // // // // // // // //           </div>
// // // // // // // // // //           <div className="flex items-center justify-center space-x-2 text-xs sm:text-sm text-gray-500">
// // // // // // // // // //             <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
// // // // // // // // // //             <span>Loading user profile</span>
// // // // // // // // // //           </div>
// // // // // // // // // //           <div className="flex items-center justify-center space-x-2 text-xs sm:text-sm text-gray-500">
// // // // // // // // // //             <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
// // // // // // // // // //             <span>Applying security policies</span>
// // // // // // // // // //           </div>
// // // // // // // // // //         </div>
// // // // // // // // // //       </div>
// // // // // // // // // //     </div>
// // // // // // // // // //   );

// // // // // // // // // //   // ═══════════════════════════════════════════════════════════════
// // // // // // // // // //   // ✅ AUTH PROMPT
// // // // // // // // // //   // ═══════════════════════════════════════════════════════════════

// // // // // // // // // //   const renderAuthPrompt = () => {
// // // // // // // // // //     if (domainConfig.userType !== 'customer') {
// // // // // // // // // //       return null;
// // // // // // // // // //     }
    
// // // // // // // // // //     return (
// // // // // // // // // //       <div className="mb-4 sm:mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-lg">
// // // // // // // // // //         <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
// // // // // // // // // //           <div className="flex items-start gap-3 sm:gap-4 flex-1">
// // // // // // // // // //             <div className="text-3xl sm:text-4xl flex-shrink-0">🏠</div>
// // // // // // // // // //             <div className="flex-1 min-w-0">
// // // // // // // // // //               <h3 className="text-lg sm:text-xl font-bold text-blue-800 mb-1 sm:mb-2">
// // // // // // // // // //                 SrijanX Tile - Virtual Experience
// // // // // // // // // //               </h3>
// // // // // // // // // //               <p className="text-sm sm:text-base text-blue-700 mb-2 sm:mb-3">
// // // // // // // // // //                 Explore our immersive 3D tile visualization platform. 
// // // // // // // // // //                 {isAuthenticated 
// // // // // // // // // //                   ? ' Manage your business with our seller dashboard.' 
// // // // // // // // // //                   : ' Sign in for seller dashboard and admin management features.'}
// // // // // // // // // //               </p>
// // // // // // // // // //               <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-blue-600">
// // // // // // // // // //                 <span className="flex items-center whitespace-nowrap">
// // // // // // // // // //                   <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-1"></span>
// // // // // // // // // //                   Virtual Showroom
// // // // // // // // // //                 </span>
// // // // // // // // // //                 <span className="flex items-center whitespace-nowrap">
// // // // // // // // // //                   <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1"></span>
// // // // // // // // // //                   3D Visualization
// // // // // // // // // //                 </span>
// // // // // // // // // //                 <span className="flex items-center whitespace-nowrap">
// // // // // // // // // //                   <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mr-1"></span>
// // // // // // // // // //                   Real-time Preview
// // // // // // // // // //                 </span>
// // // // // // // // // //               </div>
// // // // // // // // // //             </div>
// // // // // // // // // //           </div>

// // // // // // // // // //           <div className="flex gap-3 w-full lg:w-auto">
// // // // // // // // // //             {!isAuthenticated && (
// // // // // // // // // //               <button
// // // // // // // // // //                 onClick={() => setShowAuthModal(true)}
// // // // // // // // // //                 className="flex-1 lg:flex-none bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-lg sm:rounded-xl hover:from-blue-700 hover:to-cyan-700 active:from-blue-800 active:to-cyan-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0 font-medium text-sm sm:text-base flex items-center justify-center gap-2 touch-manipulation"
// // // // // // // // // //               >
// // // // // // // // // //                 <span className="text-lg sm:text-xl">🔐</span>
// // // // // // // // // //                 <span>Sign In</span>
// // // // // // // // // //               </button>
// // // // // // // // // //             )}
// // // // // // // // // //           </div>
// // // // // // // // // //         </div>
// // // // // // // // // //       </div>
// // // // // // // // // //     );
// // // // // // // // // //   };

// // // // // // // // // //   // ═══════════════════════════════════════════════════════════════
// // // // // // // // // //   // ✅ SHOW LOADING IF AUTH IS LOADING
// // // // // // // // // //   // ═══════════════════════════════════════════════════════════════

// // // // // // // // // //   if (isLoading) {
// // // // // // // // // //     return renderLoading();
// // // // // // // // // //   }

// // // // // // // // // //   // ═══════════════════════════════════════════════════════════════
// // // // // // // // // //   // ✅ MAIN RENDER - STICKY FOOTER LAYOUT
// // // // // // // // // //   // ═══════════════════════════════════════════════════════════════

// // // // // // // // // //   return (
// // // // // // // // // //     <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
// // // // // // // // // //       {/* ✅ Toast Notifications */}
// // // // // // // // // //       <Toaster 
// // // // // // // // // //         position="top-right"
// // // // // // // // // //         reverseOrder={false}
// // // // // // // // // //         gutter={8}
// // // // // // // // // //         toastOptions={{
// // // // // // // // // //           duration: 5000,
// // // // // // // // // //           style: {
// // // // // // // // // //             background: '#fff',
// // // // // // // // // //             color: '#363636',
// // // // // // // // // //             fontSize: '14px',
// // // // // // // // // //             padding: '12px 16px',
// // // // // // // // // //             borderRadius: '10px',
// // // // // // // // // //             boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
// // // // // // // // // //             maxWidth: '500px',
// // // // // // // // // //           },
// // // // // // // // // //           success: {
// // // // // // // // // //             duration: 4000,
// // // // // // // // // //             iconTheme: {
// // // // // // // // // //               primary: '#10B981',
// // // // // // // // // //               secondary: '#fff',
// // // // // // // // // //             },
// // // // // // // // // //           },
// // // // // // // // // //           error: {
// // // // // // // // // //             duration: 6000,
// // // // // // // // // //             iconTheme: {
// // // // // // // // // //               primary: '#EF4444',
// // // // // // // // // //               secondary: '#fff',
// // // // // // // // // //             },
// // // // // // // // // //           },
// // // // // // // // // //         }}
// // // // // // // // // //       />

// // // // // // // // // //       {/* ═══════════════════════════════════════════════════════════ */}
// // // // // // // // // //       {/* ✅ MAIN CONTENT AREA - FLEX GROW */}
// // // // // // // // // //       {/* ═══════════════════════════════════════════════════════════ */}
// // // // // // // // // //       <div className="flex-1">
// // // // // // // // // //         <Routes>
// // // // // // // // // //           {/* ═══════════════════════════════════════════════════════════ */}
// // // // // // // // // //           {/* ✅ QR SCAN ROUTES - PUBLIC ACCESS */}
// // // // // // // // // //           {/* ═══════════════════════════════════════════════════════════ */}
          
// // // // // // // // // //           <Route path="/tile/:tileId" element={<TileDetailsPage />} />
// // // // // // // // // //           <Route path="/room-select/:tileId" element={<RoomSelectorPage />} />
// // // // // // // // // //           <Route path="/3d-view/:tileId/:roomType" element={<Room3DViewPage />} />
// // // // // // // // // //           <Route path="/tile/search" element={<TileSearchPage />} />

// // // // // // // // // //           {/* ═══════════════════════════════════════════════════════════ */}
// // // // // // // // // //           {/* ✅ WORKER SCAN PAGE */}
// // // // // // // // // //           {/* ═══════════════════════════════════════════════════════════ */}
          
// // // // // // // // // //           <Route
// // // // // // // // // //             path="/scan"
// // // // // // // // // //             element={
// // // // // // // // // //               <WorkerProtectedRoute>
// // // // // // // // // //                 <WorkerErrorBoundary>
// // // // // // // // // //                   <ScanPage />
// // // // // // // // // //                 </WorkerErrorBoundary>
// // // // // // // // // //               </WorkerProtectedRoute>
// // // // // // // // // //             }
// // // // // // // // // //           />

// // // // // // // // // //           {/* ═══════════════════════════════════════════════════════════ */}
// // // // // // // // // //           {/* ✅ SELLER AUTO-LOGIN */}
// // // // // // // // // //           {/* ═══════════════════════════════════════════════════════════ */}
          
// // // // // // // // // //           <Route path="/seller-auto-login" element={<SellerAutoLogin />} />

// // // // // // // // // //           {/* ═══════════════════════════════════════════════════════════ */}
// // // // // // // // // //           {/* ✅ PAYMENT ROUTES - PUBLIC ACCESS */}
// // // // // // // // // //           {/* ═══════════════════════════════════════════════════════════ */}
          
// // // // // // // // // //           <Route path="/payment-success" element={<PaymentSuccess />} />
// // // // // // // // // //           <Route path="/payment-failure" element={<PaymentFailure />} />
// // // // // // // // // //           <Route 
// // // // // // // // // //             path="/payment-cancelled" 
// // // // // // // // // //             element={
// // // // // // // // // //               <Navigate 
// // // // // // // // // //                 to="/payment-failure?error=Payment cancelled by user" 
// // // // // // // // // //                 replace 
// // // // // // // // // //               />
// // // // // // // // // //             } 
// // // // // // // // // //           />

// // // // // // // // // //           {/* ═══════════════════════════════════════════════════════════ */}
// // // // // // // // // //           {/* ✅ ADMIN DASHBOARD */}
// // // // // // // // // //           {/* ═══════════════════════════════════════════════════════════ */}
          
// // // // // // // // // //           <Route
// // // // // // // // // //             path="/admin/*"
// // // // // // // // // //             element={
// // // // // // // // // //               <AdminProtectedRoute>
// // // // // // // // // //                 <DomainHeader />
// // // // // // // // // //                 <main className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
// // // // // // // // // //                   {renderError()}
// // // // // // // // // //                   <AdminDashboard />
// // // // // // // // // //                 </main>
// // // // // // // // // //               </AdminProtectedRoute>
// // // // // // // // // //             }
// // // // // // // // // //           />

// // // // // // // // // //           {/* ═══════════════════════════════════════════════════════════ */}
// // // // // // // // // //           {/* ✅ SELLER DASHBOARD */}
// // // // // // // // // //           {/* ═══════════════════════════════════════════════════════════ */}
          
// // // // // // // // // //           <Route
// // // // // // // // // //             path="/seller/*"
// // // // // // // // // //             element={
// // // // // // // // // //               <SellerProtectedRoute>
// // // // // // // // // //                 <DomainHeader />
// // // // // // // // // //                 <main className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
// // // // // // // // // //                   {renderError()}
// // // // // // // // // //                   <SellerDashboard />
// // // // // // // // // //                 </main>
// // // // // // // // // //               </SellerProtectedRoute>
// // // // // // // // // //             }
// // // // // // // // // //           />

// // // // // // // // // //           {/* ═══════════════════════════════════════════════════════════ */}
// // // // // // // // // //           {/* ✅ PUBLIC/CUSTOMER ROUTES */}
// // // // // // // // // //           {/* ═══════════════════════════════════════════════════════════ */}
          
// // // // // // // // // //           <Route
// // // // // // // // // //             path="/*"
// // // // // // // // // //             element={
// // // // // // // // // //               <ProtectedRoute allowUnauthenticated={true}>
// // // // // // // // // //                 <DomainHeader />
// // // // // // // // // //                 <main className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
// // // // // // // // // //                   {renderError()}
// // // // // // // // // //                   {renderAuthPrompt()}
                  
// // // // // // // // // //                   <div className="space-y-6 sm:space-y-8">
// // // // // // // // // //                     <PublicShowroom />
                    
// // // // // // // // // //                     <section className="py-8 sm:py-12 lg:py-16 bg-white/80 backdrop-blur-sm rounded-lg sm:rounded-xl shadow-lg">
// // // // // // // // // //                       <div className="max-w-4xl mx-auto px-4 sm:px-6">
// // // // // // // // // //                         <div className="text-center mb-8 sm:mb-12">
// // // // // // // // // //                           <div className="text-4xl sm:text-5xl mb-3 sm:mb-4">🤝</div>
// // // // // // // // // //                           <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-3 sm:mb-4">
// // // // // // // // // //                             Partner With Us
// // // // // // // // // //                           </h2>
// // // // // // // // // //                           <p className="text-sm sm:text-base md:text-lg text-gray-600 mb-4 sm:mb-6">
// // // // // // // // // //                             Expand your tile business with our cutting-edge 3D visualization platform
// // // // // // // // // //                           </p>
// // // // // // // // // //                           <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs sm:text-sm text-gray-500">
// // // // // // // // // //                             <span className="flex items-center whitespace-nowrap">
// // // // // // // // // //                               <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
// // // // // // // // // //                               3D Showroom
// // // // // // // // // //                             </span>
// // // // // // // // // //                             <span className="flex items-center whitespace-nowrap">
// // // // // // // // // //                               <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
// // // // // // // // // //                               QR Code System
// // // // // // // // // //                             </span>
// // // // // // // // // //                             <span className="flex items-center whitespace-nowrap">
// // // // // // // // // //                               <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
// // // // // // // // // //                               Analytics Dashboard
// // // // // // // // // //                             </span>
// // // // // // // // // //                           </div>
// // // // // // // // // //                         </div>
// // // // // // // // // //                         <SellerRequestForm />
// // // // // // // // // //                       </div>
// // // // // // // // // //                     </section>
// // // // // // // // // //                   </div>
// // // // // // // // // //                 </main>

// // // // // // // // // //                 {/* ✅ Floating QR Scan Button */}
// // // // // // // // // //                 <FloatingQRButton />
// // // // // // // // // //               </ProtectedRoute>
// // // // // // // // // //             }
// // // // // // // // // //           />

// // // // // // // // // //           {/* ═══════════════════════════════════════════════════════════ */}
// // // // // // // // // //           {/* ✅ CATCH-ALL REDIRECT */}
// // // // // // // // // //           {/* ═══════════════════════════════════════════════════════════ */}
          
// // // // // // // // // //           <Route path="*" element={<Navigate to="/" replace />} />
// // // // // // // // // //         </Routes>
// // // // // // // // // //       </div>

// // // // // // // // // //       {/* ═══════════════════════════════════════════════════════════ */}
// // // // // // // // // //       {/* ✅ FOOTER - ALWAYS AT BOTTOM (STICKY FOOTER) */}
// // // // // // // // // //       {/* ═══════════════════════════════════════════════════════════ */}
      
// // // // // // // // // //       <footer className="mt-auto py-6 sm:py-8 bg-white/80 backdrop-blur-sm border-t border-gray-200">
// // // // // // // // // //         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
// // // // // // // // // //           <div className="text-center text-gray-600">
// // // // // // // // // //             <p className="text-sm sm:text-base font-medium">
// // // // // // // // // //               &copy; 2025 SrijanX Tile. All rights reserved.
// // // // // // // // // //             </p>
// // // // // // // // // //             <p className="text-xs sm:text-sm mt-1 sm:mt-2 text-gray-500">
// // // // // // // // // //               Powered by advanced 3D visualization technology
// // // // // // // // // //             </p>
// // // // // // // // // //             <div className="mt-3 sm:mt-4 flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-xs text-gray-400">
// // // // // // // // // //               <span className="flex items-center">
// // // // // // // // // //                 <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1"></span>
// // // // // // // // // //                 Secure Platform
// // // // // // // // // //               </span>
// // // // // // // // // //               <span className="flex items-center">
// // // // // // // // // //                 <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-1"></span>
// // // // // // // // // //                 Cloud Powered
// // // // // // // // // //               </span>
// // // // // // // // // //               <span className="flex items-center">
// // // // // // // // // //                 <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mr-1"></span>
// // // // // // // // // //                 Real-time Updates
// // // // // // // // // //               </span>
// // // // // // // // // //             </div>
// // // // // // // // // //           </div>
// // // // // // // // // //         </div>
// // // // // // // // // //       </footer>

// // // // // // // // // //       {/* ═══════════════════════════════════════════════════════════ */}
// // // // // // // // // //       {/* ✅ MODALS */}
// // // // // // // // // //       {/* ═══════════════════════════════════════════════════════════ */}
      
// // // // // // // // // //       {/* Auth Modal */}
// // // // // // // // // //       <AuthModal 
// // // // // // // // // //         isOpen={showAuthModal} 
// // // // // // // // // //         onClose={() => setShowAuthModal(false)} 
// // // // // // // // // //       />

// // // // // // // // // //       {/* Plans Modal */}
// // // // // // // // // //       <PlansModal
// // // // // // // // // //         isOpen={showPlansModal}
// // // // // // // // // //         onClose={() => setShowPlansModal(false)}
// // // // // // // // // //         isLoggedIn={isAuthenticated}
// // // // // // // // // //         onSelectPlan={handlePlanSelection}
// // // // // // // // // //       />

// // // // // // // // // //       {/* Payment Confirmation Modal */}
// // // // // // // // // //       <PaymentConfirmationModal
// // // // // // // // // //         isOpen={showPaymentConfirmation}
// // // // // // // // // //         onClose={() => {
// // // // // // // // // //           setShowPaymentConfirmation(false);
// // // // // // // // // //           setSelectedPlan(null);
// // // // // // // // // //         }}
// // // // // // // // // //         plan={selectedPlan}
// // // // // // // // // //         onConfirm={handlePaymentConfirm}
// // // // // // // // // //         isProcessing={processingPayment}
// // // // // // // // // //       />

// // // // // // // // // //       {/* Payment Checkout */}
// // // // // // // // // //       {checkoutOptions && paymentId && selectedPlan && (
// // // // // // // // // //         <PaymentCheckout
// // // // // // // // // //           checkoutOptions={checkoutOptions}
// // // // // // // // // //           paymentId={paymentId}
// // // // // // // // // //           planId={selectedPlan.id}
// // // // // // // // // //           sellerId={user?.uid || ''}
// // // // // // // // // //           onError={handlePaymentError}
// // // // // // // // // //         />
// // // // // // // // // //       )}
// // // // // // // // // //     </div>
// // // // // // // // // //   );
// // // // // // // // // // }

// // // // // // // // // // // ═══════════════════════════════════════════════════════════════
// // // // // // // // // // // ✅ APP WRAPPER WITH ROUTER
// // // // // // // // // // // ═══════════════════════════════════════════════════════════════

// // // // // // // // // // function App() {
// // // // // // // // // //   return (
// // // // // // // // // //     <ErrorBoundary>
// // // // // // // // // //       <Router>
// // // // // // // // // //         <AppContent />
// // // // // // // // // //       </Router>
// // // // // // // // // //     </ErrorBoundary>
// // // // // // // // // //   );
// // // // // // // // // // }

// // // // // // // // // // export default App;

// // // // // // // // // // console.log('✅ App.tsx - PRODUCTION v12.0 FINAL (Sticky Footer | All Responsive | Production Ready)'); 
// // // // // // // // // import React, { useState, useEffect } from 'react';
// // // // // // // // // import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// // // // // // // // // import { ProtectedRoute, AdminProtectedRoute, SellerProtectedRoute } from './components/ProtectedRoute';
// // // // // // // // // import { WorkerProtectedRoute } from './components/WorkerProtectedRoute';
// // // // // // // // // import { PlansModal } from './components/Payment/PlansModal';
// // // // // // // // // import { PaymentSuccess } from './components/Payment/PaymentSuccess';
// // // // // // // // // import { PaymentFailure } from './components/Payment/PaymentFailure';
// // // // // // // // // import { useAuth } from './hooks/useAuth';
// // // // // // // // // import { auth } from './lib/firebase';
// // // // // // // // // import { DomainHeader } from './components/DomainHeader';
// // // // // // // // // import { SellerDashboard } from './components/SellerDashboard';
// // // // // // // // // import { AdminDashboard } from './components/AdminDashboard';
// // // // // // // // // import { PublicShowroom } from './components/PublicShowroom';
// // // // // // // // // import { SellerRequestForm } from './components/SellerRequestForm';            
// // // // // // // // // import { AuthModal } from './components/Auth/AuthModal';
// // // // // // // // // import { FloatingQRButton } from './components/FloatingQRButton';
// // // // // // // // // import { TileDetailsPage } from './components/TileDetailsPage';
// // // // // // // // // import { RoomSelectorPage } from './components/RoomSelectorPage';
// // // // // // // // // import { Room3DViewPage } from './components/Room3DViewPage';
// // // // // // // // // import { TileSearchPage } from './components/TileSearchPage';
// // // // // // // // // import { ScanPage } from './components/ScanPage';
// // // // // // // // // import { getCurrentDomainConfig, applyDomainTheme } from './utils/domainUtils';
// // // // // // // // // import { WorkerErrorBoundary } from './components/WorkerErrorBoundary';
// // // // // // // // // import { SellerAutoLogin } from './components/SellerAutoLogin';
// // // // // // // // // import { Toaster } from 'react-hot-toast';
// // // // // // // // // import { ArrowRight, PlayCircle, RefreshCw } from 'lucide-react';

// // // // // // // // // // ═══════════════════════════════════════════════════════════════
// // // // // // // // // // ✅ PAYMENT IMPORTS (RAZORPAY)
// // // // // // // // // // ═══════════════════════════════════════════════════════════════
// // // // // // // // // import { PaymentConfirmationModal } from './components/Payment/PaymentConfirmationModal';
// // // // // // // // // import { PaymentCheckout } from './components/Payment/PaymentCheckout';
// // // // // // // // // import { initiatePayment } from './lib/paymentService';
// // // // // // // // // import { getPlanById } from './lib/planService';
// // // // // // // // // import type { Plan } from './types/plan.types';
// // // // // // // // // import type { RazorpayCheckoutOptions } from './types/payment.types';

// // // // // // // // // // ═══════════════════════════════════════════════════════════════
// // // // // // // // // // ✅ ERROR BOUNDARY COMPONENT
// // // // // // // // // // ═══════════════════════════════════════════════════════════════

// // // // // // // // // class ErrorBoundary extends React.Component<
// // // // // // // // //   { children: React.ReactNode },
// // // // // // // // //   { hasError: boolean; error?: Error }
// // // // // // // // // > {
// // // // // // // // //   constructor(props: { children: React.ReactNode }) {
// // // // // // // // //     super(props);
// // // // // // // // //     this.state = { hasError: false };
// // // // // // // // //   }

// // // // // // // // //   static getDerivedStateFromError(error: Error) {
// // // // // // // // //     return { hasError: true, error };
// // // // // // // // //   }

// // // // // // // // //   componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
// // // // // // // // //     console.error('🔥 App Error Boundary caught error:', error, errorInfo);
// // // // // // // // //   }

// // // // // // // // //   render() {
// // // // // // // // //     if (this.state.hasError) {
// // // // // // // // //       return (
// // // // // // // // //         <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center p-4">
// // // // // // // // //           <div className="text-center p-6 sm:p-8 bg-white rounded-lg sm:rounded-xl shadow-lg max-w-md w-full">
// // // // // // // // //             <div className="text-red-500 text-5xl sm:text-6xl mb-3 sm:mb-4">⚠️</div>
// // // // // // // // //             <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">
// // // // // // // // //               Something went wrong
// // // // // // // // //             </h1>
// // // // // // // // //             <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
// // // // // // // // //               The application encountered an unexpected error. Please refresh the page or contact support.
// // // // // // // // //             </p>
// // // // // // // // //             {this.state.error && (
// // // // // // // // //               <details className="mb-4 sm:mb-6 text-left">
// // // // // // // // //                 <summary className="text-xs sm:text-sm text-gray-500 cursor-pointer hover:text-gray-700 transition-colors">
// // // // // // // // //                   Error details
// // // // // // // // //                 </summary>
// // // // // // // // //                 <pre className="mt-2 p-2 sm:p-3 bg-gray-100 rounded text-xs overflow-x-auto">
// // // // // // // // //                   {this.state.error.message}
// // // // // // // // //                 </pre>
// // // // // // // // //               </details>
// // // // // // // // //             )}
// // // // // // // // //             <button
// // // // // // // // //               onClick={() => window.location.reload()}
// // // // // // // // //               className="w-full sm:w-auto bg-red-600 text-white px-6 py-2.5 sm:py-3 rounded-lg hover:bg-red-700 active:bg-red-800 transition-colors font-medium text-sm sm:text-base touch-manipulation shadow-md hover:shadow-lg"
// // // // // // // // //             >
// // // // // // // // //               Refresh Page
// // // // // // // // //             </button>
// // // // // // // // //           </div>
// // // // // // // // //         </div>
// // // // // // // // //       );
// // // // // // // // //     }

// // // // // // // // //     return this.props.children;
// // // // // // // // //   }
// // // // // // // // // }

// // // // // // // // // // ═══════════════════════════════════════════════════════════════
// // // // // // // // // // ✅ MAIN APP CONTENT COMPONENT
// // // // // // // // // // ═══════════════════════════════════════════════════════════════

// // // // // // // // // function AppContent() {
// // // // // // // // //   const { isAuthenticated, isLoading, user, error } = useAuth({
// // // // // // // // //     enableActivityTracking: false,
// // // // // // // // //     enableSessionWarnings: false,
// // // // // // // // //     autoLogoutDelay: 0
// // // // // // // // //   });
  
// // // // // // // // //   const [showAuthModal, setShowAuthModal] = useState(false);
// // // // // // // // //   const [showPlansModal, setShowPlansModal] = useState(false);
// // // // // // // // //   const [domainConfig, setDomainConfig] = useState(getCurrentDomainConfig());
// // // // // // // // //   const [isMobile, setIsMobile] = useState(false);

// // // // // // // // //   // ═══════════════════════════════════════════════════════════════
// // // // // // // // //   // ✅ PAYMENT STATE (RAZORPAY)
// // // // // // // // //   // ═══════════════════════════════════════════════════════════════
// // // // // // // // //   const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
// // // // // // // // //   const [showPaymentConfirmation, setShowPaymentConfirmation] = useState(false);
// // // // // // // // //   const [checkoutOptions, setCheckoutOptions] = useState<RazorpayCheckoutOptions | null>(null);
// // // // // // // // //   const [paymentId, setPaymentId] = useState<string | null>(null);
// // // // // // // // //   const [processingPayment, setProcessingPayment] = useState(false);

// // // // // // // // //   // ═══════════════════════════════════════════════════════════════
// // // // // // // // //   // ✅ MOBILE DETECTION
// // // // // // // // //   // ═══════════════════════════════════════════════════════════════
  
// // // // // // // // //   useEffect(() => {
// // // // // // // // //     const checkMobile = () => {
// // // // // // // // //       setIsMobile(window.innerWidth < 768);
// // // // // // // // //     };
    
// // // // // // // // //     checkMobile();
// // // // // // // // //     window.addEventListener('resize', checkMobile);
    
// // // // // // // // //     return () => window.removeEventListener('resize', checkMobile);
// // // // // // // // //   }, []);

// // // // // // // // //   // ═══════════════════════════════════════════════════════════════
// // // // // // // // //   // ✅ APP INITIALIZATION
// // // // // // // // //   // ═══════════════════════════════════════════════════════════════

// // // // // // // // //   useEffect(() => {
// // // // // // // // //     try {
// // // // // // // // //       console.log('🚀 Tile Showroom App initializing...');
      
// // // // // // // // //       const config = getCurrentDomainConfig();
// // // // // // // // //       setDomainConfig(config);
// // // // // // // // //       applyDomainTheme(config);
      
// // // // // // // // //       console.log('🎯 Domain config:', config);
// // // // // // // // //       console.log('👤 Auth state:', { 
// // // // // // // // //         isAuthenticated, 
// // // // // // // // //         isLoading, 
// // // // // // // // //         userRole: user?.role,
// // // // // // // // //         userId: user?.user_id 
// // // // // // // // //       });
      
// // // // // // // // //       document.title = config.title;
      
// // // // // // // // //       let viewport = document.querySelector('meta[name="viewport"]');
// // // // // // // // //       if (!viewport) {
// // // // // // // // //         viewport = document.createElement('meta');
// // // // // // // // //         viewport.setAttribute('name', 'viewport');
// // // // // // // // //         viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes');
// // // // // // // // //         document.head.appendChild(viewport);
// // // // // // // // //       }
      
// // // // // // // // //     } catch (error) {
// // // // // // // // //       console.error('🔥 App initialization error:', error);
// // // // // // // // //     }
// // // // // // // // //   }, [isAuthenticated, isLoading, user]);

// // // // // // // // //   // ═══════════════════════════════════════════════════════════════
// // // // // // // // //   // ✅ WORKER ROUTE PROTECTION
// // // // // // // // //   // ═══════════════════════════════════════════════════════════════

// // // // // // // // //   useEffect(() => {
// // // // // // // // //     if (isAuthenticated && user?.role === 'worker') {
// // // // // // // // //       const currentPath = window.location.pathname;
// // // // // // // // //       const allowedPaths = ['/scan', '/tile/', '/3d-view/', '/room-select/'];
// // // // // // // // //       const isAllowedPath = allowedPaths.some(path => currentPath.startsWith(path));
      
// // // // // // // // //       if (!isAllowedPath && currentPath !== '/') {
// // // // // // // // //         console.log('🔒 Worker blocked from:', currentPath);
// // // // // // // // //         window.location.replace('/scan');
// // // // // // // // //       }
// // // // // // // // //     }
// // // // // // // // //   }, [isAuthenticated, user]);

// // // // // // // // //   // ═══════════════════════════════════════════════════════════════
// // // // // // // // //   // ✅ PLAN SELECTION HANDLER
// // // // // // // // //   // ═══════════════════════════════════════════════════════════════

// // // // // // // // //   const handlePlanSelection = async (planId: string) => {
// // // // // // // // //     try {
// // // // // // // // //       console.log('📦 Selected plan:', planId);
      
// // // // // // // // //       if (!isAuthenticated) {
// // // // // // // // //         console.log('🔐 User not authenticated, showing login modal...');
// // // // // // // // //         setShowPlansModal(false);
// // // // // // // // //         setShowAuthModal(true);
// // // // // // // // //         return;
// // // // // // // // //       }

// // // // // // // // //       console.log('📋 Fetching plan details...');
// // // // // // // // //       const plan = await getPlanById(planId);
      
// // // // // // // // //       if (!plan) {
// // // // // // // // //         alert('❌ Plan not found. Please try again.');
// // // // // // // // //         return;
// // // // // // // // //       }

// // // // // // // // //       setSelectedPlan(plan);
// // // // // // // // //       setShowPlansModal(false);
// // // // // // // // //       setShowPaymentConfirmation(true);
      
// // // // // // // // //     } catch (error: any) {
// // // // // // // // //       console.error('❌ Error selecting plan:', error);
// // // // // // // // //       alert(`❌ Error: ${error.message}`);
// // // // // // // // //     }
// // // // // // // // //   };

// // // // // // // // //   // ═══════════════════════════════════════════════════════════════
// // // // // // // // //   // ✅ PAYMENT CONFIRM HANDLER (RAZORPAY)
// // // // // // // // //   // ═══════════════════════════════════════════════════════════════

// // // // // // // // //   const handlePaymentConfirm = async () => {
// // // // // // // // //     if (!selectedPlan) {
// // // // // // // // //       alert('❌ No plan selected');
// // // // // // // // //       return;
// // // // // // // // //     }

// // // // // // // // //     setProcessingPayment(true);

// // // // // // // // //     try {
// // // // // // // // //       console.log('💳 Initiating payment for plan:', selectedPlan.plan_name);

// // // // // // // // //       const currentUser = auth.currentUser;
// // // // // // // // //       if (!currentUser) {
// // // // // // // // //         throw new Error('Please login first');
// // // // // // // // //       }

// // // // // // // // //       const result = await initiatePayment(
// // // // // // // // //         selectedPlan.id,
// // // // // // // // //         selectedPlan.plan_name,
// // // // // // // // //         selectedPlan.price
// // // // // // // // //       );

// // // // // // // // //       if (!result.success || !result.checkoutOptions || !result.paymentId) {
// // // // // // // // //         throw new Error(result.error || 'Failed to initiate payment');
// // // // // // // // //       }

// // // // // // // // //       console.log('✅ Payment initiated successfully');
// // // // // // // // //       console.log('📝 Payment ID:', result.paymentId);

// // // // // // // // //       setCheckoutOptions(result.checkoutOptions);
// // // // // // // // //       setPaymentId(result.paymentId);
// // // // // // // // //       setShowPaymentConfirmation(false);

// // // // // // // // //     } catch (error: any) {
// // // // // // // // //       console.error('❌ Payment initiation error:', error);
// // // // // // // // //       alert(`❌ Payment Error:\n${error.message}`);
// // // // // // // // //       setProcessingPayment(false);
// // // // // // // // //     }
// // // // // // // // //   };

// // // // // // // // //   // ═══════════════════════════════════════════════════════════════
// // // // // // // // //   // ✅ PAYMENT ERROR HANDLER
// // // // // // // // //   // ═══════════════════════════════════════════════════════════════

// // // // // // // // //   const handlePaymentError = (error: string) => {
// // // // // // // // //     console.error('❌ Payment checkout error:', error);
// // // // // // // // //     alert(`❌ Payment Error:\n${error}`);
    
// // // // // // // // //     setCheckoutOptions(null);
// // // // // // // // //     setPaymentId(null);
// // // // // // // // //     setProcessingPayment(false);
// // // // // // // // //     setSelectedPlan(null);
// // // // // // // // //   };

// // // // // // // // //   // ═══════════════════════════════════════════════════════════════
// // // // // // // // //   // ✅ ERROR DISPLAY
// // // // // // // // //   // ═══════════════════════════════════════════════════════════════

// // // // // // // // //   const renderError = () => {
// // // // // // // // //     if (!error) return null;
    
// // // // // // // // //     return (
// // // // // // // // //       <div className="mb-4 sm:mb-6 bg-red-50 border border-red-200 rounded-lg sm:rounded-xl p-3 sm:p-4 animate-shake">
// // // // // // // // //         <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
// // // // // // // // //           <div className="text-red-500 text-2xl sm:text-xl flex-shrink-0">⚠️</div>
// // // // // // // // //           <div className="flex-1 min-w-0">
// // // // // // // // //             <h3 className="font-semibold text-red-800 text-sm sm:text-base mb-1">
// // // // // // // // //               Authentication Error
// // // // // // // // //             </h3>
// // // // // // // // //             <p className="text-red-700 text-xs sm:text-sm break-words">{error}</p>
// // // // // // // // //           </div>
// // // // // // // // //           <button
// // // // // // // // //             onClick={() => window.location.reload()}
// // // // // // // // //             className="w-full sm:w-auto bg-red-600 text-white px-4 py-2 rounded-lg text-xs sm:text-sm hover:bg-red-700 active:bg-red-800 transition-colors font-medium touch-manipulation flex-shrink-0"
// // // // // // // // //           >
// // // // // // // // //             Retry
// // // // // // // // //           </button>
// // // // // // // // //         </div>
// // // // // // // // //       </div>
// // // // // // // // //     );
// // // // // // // // //   };

// // // // // // // // //   // ═══════════════════════════════════════════════════════════════
// // // // // // // // //   // ✅ LOADING STATE
// // // // // // // // //   // ═══════════════════════════════════════════════════════════════

// // // // // // // // //   const renderLoading = () => (
// // // // // // // // //     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
// // // // // // // // //       <div className="text-center max-w-md w-full">
// // // // // // // // //         <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-b-4 border-blue-600 mx-auto mb-4 sm:mb-6"></div>
// // // // // // // // //         <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-2">
// // // // // // // // //           {domainConfig.title}
// // // // // // // // //         </h2>
// // // // // // // // //         <p className="text-base sm:text-lg text-gray-600 mb-1 sm:mb-2">Loading application...</p>
// // // // // // // // //         <p className="text-xs sm:text-sm text-gray-500">Initializing secure authentication system</p>
        
// // // // // // // // //         <div className="mt-4 sm:mt-6 space-y-2">
// // // // // // // // //           <div className="flex items-center justify-center space-x-2 text-xs sm:text-sm text-gray-500">
// // // // // // // // //             <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
// // // // // // // // //             <span>Verifying authentication tokens</span>
// // // // // // // // //           </div>
// // // // // // // // //           <div className="flex items-center justify-center space-x-2 text-xs sm:text-sm text-gray-500">
// // // // // // // // //             <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
// // // // // // // // //             <span>Loading user profile</span>
// // // // // // // // //           </div>
// // // // // // // // //           <div className="flex items-center justify-center space-x-2 text-xs sm:text-sm text-gray-500">
// // // // // // // // //             <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
// // // // // // // // //             <span>Applying security policies</span>
// // // // // // // // //           </div>
// // // // // // // // //         </div>
// // // // // // // // //       </div>
// // // // // // // // //     </div>
// // // // // // // // //   );

// // // // // // // // //   // ═══════════════════════════════════════════════════════════════
// // // // // // // // //   // ✅ NEW HERO SECTION - EXACT DUMMY UI
// // // // // // // // //   // ═══════════════════════════════════════════════════════════════

// // // // // // // // //   const renderHeroSection = () => {
// // // // // // // // //     if (domainConfig.userType !== 'customer') {
// // // // // // // // //       return null;
// // // // // // // // //     }
    
// // // // // // // // //     return (
// // // // // // // // //       <div className="relative w-full bg-gradient-to-br from-white via-blue-50/30 to-purple-50/20 overflow-hidden">

// // // // // // // // //         <nav className="max-w-[1400px] mx-auto px-6 py-6 flex items-center justify-between">
// // // // // // // // //         {/* Logo */}
// // // // // // // // //         <div className="flex items-center gap-2 cursor-pointer">
// // // // // // // // //           <div className="relative w-6 h-6 flex items-center justify-center">
// // // // // // // // //             <div className="absolute top-0 left-0 w-3.5 h-3.5 bg-indigo-300 rounded-[3px]"></div>
// // // // // // // // //             <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-[#0B40E8] rounded-[3px] mix-blend-multiply"></div>
// // // // // // // // //           </div>
// // // // // // // // //           <span className="font-bold text-[22px] tracking-tight">Tilesview360</span>
// // // // // // // // //         </div>

// // // // // // // // //         {/* Desktop Links */}
// // // // // // // // //         <div className="hidden lg:flex items-center gap-10">
// // // // // // // // //           <a href="#" className="text-gray-900 font-semibold relative after:content-[''] after:absolute after:left-0 after:-bottom-1.5 after:w-full after:h-0.5 after:bg-[#0B40E8]">
// // // // // // // // //             Product
// // // // // // // // //           </a>
// // // // // // // // //           <a href="#" className="text-gray-500 hover:text-gray-900 font-medium transition-colors">Features</a>
// // // // // // // // //           <a href="#" className="text-gray-500 hover:text-gray-900 font-medium transition-colors">Pricing</a>
// // // // // // // // //           <a href="#" className="text-gray-500 hover:text-gray-900 font-medium transition-colors">Showcase</a>
// // // // // // // // //         </div>

// // // // // // // // //         {/* Right Actions */}
// // // // // // // // //         <div className="hidden lg:flex items-center gap-8">
// // // // // // // // //           <a href="#" className="text-gray-700 font-bold hover:text-gray-900 transition-colors">Login</a>
// // // // // // // // //           <button className="bg-[#0B40E8] text-white px-7 py-3 rounded-full font-semibold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/30">
// // // // // // // // //             Request Demo
// // // // // // // // //           </button>
// // // // // // // // //         </div>
// // // // // // // // //       </nav>
// // // // // // // // //         {/* Main Container */}
// // // // // // // // //         <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12 py-12 sm:py-16 lg:py-20 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          
// // // // // // // // //           {/* ═══════════════════════════════════════════════════════════
// // // // // // // // //               LEFT COLUMN - Text Content
// // // // // // // // //           ═══════════════════════════════════════════════════════════ */}
// // // // // // // // //           <div className="space-y-6 sm:space-y-8 order-2 lg:order-1">
            
// // // // // // // // //             {/* Main Heading */}
// // // // // // // // //             <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-900 leading-[1.1] tracking-tight">
// // // // // // // // //               Experience Tiles in Your Space{' '}
// // // // // // // // //               <span className="relative inline-block">
// // // // // // // // //                 <span className="bg-gradient-to-r from-[#0B40E8] via-purple-600 to-pink-600 bg-clip-text text-transparent">
// // // // // // // // //                   Before You Buy
// // // // // // // // //                 </span>
// // // // // // // // //                 <svg 
// // // // // // // // //                   className="absolute -bottom-2 left-0 w-full h-3 text-[#0B40E8]/20" 
// // // // // // // // //                   viewBox="0 0 300 12" 
// // // // // // // // //                   fill="none" 
// // // // // // // // //                   xmlns="http://www.w3.org/2000/svg"
// // // // // // // // //                 >
// // // // // // // // //                   <path 
// // // // // // // // //                     d="M2 10C50 3 100 2 150 6C200 10 250 8 298 4" 
// // // // // // // // //                     stroke="currentColor" 
// // // // // // // // //                     strokeWidth="3" 
// // // // // // // // //                     strokeLinecap="round"
// // // // // // // // //                   />
// // // // // // // // //                 </svg>
// // // // // // // // //               </span>
// // // // // // // // //             </h1>

// // // // // // // // //             {/* Subheading with Gradient */}
// // // // // // // // //             <p className="text-xl sm:text-2xl lg:text-3xl font-semibold bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent">
// // // // // // // // //               Visualize. Customize. Decide.
// // // // // // // // //             </p>

// // // // // // // // //             {/* Description */}
// // // // // // // // //             <p className="text-base sm:text-lg lg:text-xl text-gray-600 leading-relaxed max-w-xl">
// // // // // // // // //               Transform your home design process with immersive 3D tile visualization. 
// // // // // // // // //               See exactly how different tiles look in your actual space before making a purchase decision.
// // // // // // // // //             </p>

// // // // // // // // //             {/* CTA Buttons */}
// // // // // // // // //             <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
// // // // // // // // //               <button 
// // // // // // // // //                 onClick={() => setShowAuthModal(true)}
// // // // // // // // //                 className="w-full sm:w-auto bg-[#0B40E8] text-white px-8 py-4 rounded-full font-semibold text-base sm:text-lg flex items-center justify-center gap-2 hover:bg-blue-700 transition-all duration-300 shadow-xl shadow-blue-600/20 group"
// // // // // // // // //               >
// // // // // // // // //                 Request Demo
// // // // // // // // //                 <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
// // // // // // // // //               </button>
              
// // // // // // // // //               <button 
// // // // // // // // //                 onClick={() => {
// // // // // // // // //                   // Navigate to scan page or show demo
// // // // // // // // //                   window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
// // // // // // // // //                 }}
// // // // // // // // //                 className="w-full sm:w-auto bg-white text-gray-900 px-8 py-4 rounded-full font-semibold text-base sm:text-lg flex items-center justify-center gap-3 hover:bg-gray-50 transition-all duration-300 shadow-sm border border-gray-100"
// // // // // // // // //               >
// // // // // // // // //                 <PlayCircle className="w-5 h-5 text-gray-700" />
// // // // // // // // //                 Watch Live Preview
// // // // // // // // //               </button>
// // // // // // // // //             </div>
// // // // // // // // //           </div>

// // // // // // // // //           {/* ═══════════════════════════════════════════════════════════
// // // // // // // // //               RIGHT COLUMN - Visual Gallery with Floating Cards
// // // // // // // // //           ═══════════════════════════════════════════════════════════ */}
// // // // // // // // //           <div className="relative w-full h-[400px] sm:h-[500px] lg:h-[650px] order-1 lg:order-2">
            
// // // // // // // // //             {/* Main Background Image Container */}
// // // // // // // // //             <div className="absolute inset-y-8 sm:inset-y-12 inset-x-4 sm:inset-x-8 lg:inset-x-12 rounded-[2rem] overflow-hidden shadow-2xl z-0">
// // // // // // // // //               <img 
// // // // // // // // //                 src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
// // // // // // // // //                 alt="Modern living room interior" 
// // // // // // // // //                 className="w-full h-full object-cover object-center scale-105"
// // // // // // // // //                 loading="eager"
// // // // // // // // //               />
// // // // // // // // //               {/* Subtle overlay */}
// // // // // // // // //               <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent"></div>
// // // // // // // // //             </div>

// // // // // // // // //             {/* ═══════════════════════════════════════════════════════════
// // // // // // // // //                 Floating Card 1: Top Right (Venetian Blue)
// // // // // // // // //             ═══════════════════════════════════════════════════════════ */}
// // // // // // // // //             <div 
// // // // // // // // //               className="absolute top-0 right-0 lg:-right-4 bg-white/70 backdrop-blur-xl p-3 pb-4 rounded-[1.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] z-20 border border-white/50 w-[180px] sm:w-[220px] animate-fade-in-up"
// // // // // // // // //               style={{ animationDelay: '0ms' }}
// // // // // // // // //             >
// // // // // // // // //               <div className="w-full h-[140px] sm:h-[180px] rounded-2xl overflow-hidden mb-3">
// // // // // // // // //                 <img 
// // // // // // // // //                   src="https://images.unsplash.com/photo-1588863673322-2621aef42bf8?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80" 
// // // // // // // // //                   alt="Venetian Blue Tile" 
// // // // // // // // //                   className="w-full h-full object-cover"
// // // // // // // // //                   loading="lazy"
// // // // // // // // //                 />
// // // // // // // // //               </div>
// // // // // // // // //               <div className="px-2">
// // // // // // // // //                 <h3 className="font-bold text-gray-900 text-sm sm:text-[15px] leading-tight">Venetian Blue</h3>
// // // // // // // // //                 <p className="text-[#0B40E8] text-xs font-semibold mt-0.5">Living Room</p>
// // // // // // // // //               </div>
// // // // // // // // //             </div>

// // // // // // // // //             {/* ═══════════════════════════════════════════════════════════
// // // // // // // // //                 Floating Card 2: Middle Center (AI Scan)
// // // // // // // // //             ═══════════════════════════════════════════════════════════ */}
// // // // // // // // //             <div 
// // // // // // // // //               className="absolute top-[45%] left-0 lg:-left-12 -translate-y-1/2 bg-white/80 backdrop-blur-xl p-3 sm:p-4 pr-6 sm:pr-10 rounded-[1.25rem] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.15)] z-30 border border-white/60 flex items-center gap-3 sm:gap-4 animate-fade-in-up max-w-[90%] sm:max-w-none" 
// // // // // // // // //               style={{ animationDelay: '150ms' }}
// // // // // // // // //             >
// // // // // // // // //               <div className="bg-[#0B40E8] w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-white shadow-lg shadow-blue-500/30 flex-shrink-0">
// // // // // // // // //                 <RefreshCw className="w-5 h-5 sm:w-6 sm:h-6 animate-spin-slow" />
// // // // // // // // //               </div>
// // // // // // // // //               <div className="min-w-0">
// // // // // // // // //                 <h3 className="font-bold text-gray-900 text-xs sm:text-sm">AI 3D Scan Active</h3>
// // // // // // // // //                 <p className="text-gray-500 text-[10px] sm:text-xs mt-0.5 truncate">Calibrating surface textures...</p>
// // // // // // // // //               </div>
// // // // // // // // //             </div>

// // // // // // // // //             {/* ═══════════════════════════════════════════════════════════
// // // // // // // // //                 Floating Card 3: Bottom Left (Noir Slate)
// // // // // // // // //             ═══════════════════════════════════════════════════════════ */}
// // // // // // // // //             <div 
// // // // // // // // //               className="absolute bottom-4 left-4 lg:left-8 bg-white/90 backdrop-blur-md p-3 pb-4 rounded-[1.5rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.2)] z-20 border border-white w-[160px] sm:w-[200px] animate-fade-in-up" 
// // // // // // // // //               style={{ animationDelay: '300ms' }}
// // // // // // // // //             >
// // // // // // // // //               <div className="w-full h-[120px] sm:h-[160px] rounded-2xl overflow-hidden mb-3 relative group">
// // // // // // // // //                 <img 
// // // // // // // // //                   src="https://images.unsplash.com/photo-1620626011761-996317b8d101?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80" 
// // // // // // // // //                   alt="Noir Slate Bathroom" 
// // // // // // // // //                   className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
// // // // // // // // //                   loading="lazy"
// // // // // // // // //                 />
// // // // // // // // //                 <div className="absolute inset-0 bg-black/10"></div>
// // // // // // // // //               </div>
// // // // // // // // //               <div className="px-2">
// // // // // // // // //                 <h3 className="font-bold text-gray-900 text-sm sm:text-[15px] leading-tight">Noir Slate</h3>
// // // // // // // // //                 <p className="text-[#0B40E8] text-xs font-semibold mt-0.5">Master Bath</p>
// // // // // // // // //               </div>
// // // // // // // // //             </div>

// // // // // // // // //           </div>
// // // // // // // // //         </main>

// // // // // // // // //         {/* ═══════════════════════════════════════════════════════════
// // // // // // // // //             CUSTOM ANIMATIONS
// // // // // // // // //         ═══════════════════════════════════════════════════════════ */}
// // // // // // // // //         <style dangerouslySetInnerHTML={{__html: `
// // // // // // // // //           @keyframes fadeInUp {
// // // // // // // // //             from { 
// // // // // // // // //               opacity: 0; 
// // // // // // // // //               transform: translateY(20px); 
// // // // // // // // //             }
// // // // // // // // //             to { 
// // // // // // // // //               opacity: 1; 
// // // // // // // // //               transform: translateY(0); 
// // // // // // // // //             }
// // // // // // // // //           }
          
// // // // // // // // //           .animate-fade-in-up {
// // // // // // // // //             animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
// // // // // // // // //             opacity: 0;
// // // // // // // // //           }
          
// // // // // // // // //           @keyframes spin-slow {
// // // // // // // // //             from {
// // // // // // // // //               transform: rotate(0deg);
// // // // // // // // //             }
// // // // // // // // //             to {
// // // // // // // // //               transform: rotate(360deg);
// // // // // // // // //             }
// // // // // // // // //           }
          
// // // // // // // // //           .animate-spin-slow {
// // // // // // // // //             animation: spin-slow 4s linear infinite;
// // // // // // // // //           }

// // // // // // // // //           /* Responsive adjustments */
// // // // // // // // //           @media (max-width: 1024px) {
// // // // // // // // //             .animate-fade-in-up {
// // // // // // // // //               animation-delay: 0ms !important;
// // // // // // // // //             }
// // // // // // // // //           }
// // // // // // // // //         `}} />
// // // // // // // // //       </div>
// // // // // // // // //     );
// // // // // // // // //   };

// // // // // // // // //   // ═══════════════════════════════════════════════════════════════
// // // // // // // // //   // ✅ SHOW LOADING IF AUTH IS LOADING
// // // // // // // // //   // ═══════════════════════════════════════════════════════════════

// // // // // // // // //   if (isLoading) {
// // // // // // // // //     return renderLoading();
// // // // // // // // //   }

// // // // // // // // //   // ═══════════════════════════════════════════════════════════════
// // // // // // // // //   // ✅ MAIN RENDER
// // // // // // // // //   // ═══════════════════════════════════════════════════════════════

// // // // // // // // //   return (
// // // // // // // // //     <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
// // // // // // // // //       {/* ✅ Toast Notifications */}
// // // // // // // // //       <Toaster 
// // // // // // // // //         position="top-right"
// // // // // // // // //         reverseOrder={false}
// // // // // // // // //         gutter={8}
// // // // // // // // //         toastOptions={{
// // // // // // // // //           duration: 5000,
// // // // // // // // //           style: {
// // // // // // // // //             background: '#fff',
// // // // // // // // //             color: '#363636',
// // // // // // // // //             fontSize: '14px',
// // // // // // // // //             padding: '12px 16px',
// // // // // // // // //             borderRadius: '10px',
// // // // // // // // //             boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
// // // // // // // // //             maxWidth: '500px',
// // // // // // // // //           },
// // // // // // // // //           success: {
// // // // // // // // //             duration: 4000,
// // // // // // // // //             iconTheme: {
// // // // // // // // //               primary: '#10B981',
// // // // // // // // //               secondary: '#fff',
// // // // // // // // //             },
// // // // // // // // //           },
// // // // // // // // //           error: {
// // // // // // // // //             duration: 6000,
// // // // // // // // //             iconTheme: {
// // // // // // // // //               primary: '#EF4444',
// // // // // // // // //               secondary: '#fff',
// // // // // // // // //             },
// // // // // // // // //           },
// // // // // // // // //         }}
// // // // // // // // //       />

// // // // // // // // //       {/* ═══════════════════════════════════════════════════════════
// // // // // // // // //           MAIN CONTENT AREA
// // // // // // // // //       ═══════════════════════════════════════════════════════════ */}
// // // // // // // // //       <div className="flex-1">
// // // // // // // // //         <Routes>
// // // // // // // // //           {/* ═══════════════════════════════════════════════════════════
// // // // // // // // //               QR SCAN ROUTES - PUBLIC ACCESS
// // // // // // // // //           ═══════════════════════════════════════════════════════════ */}
          
// // // // // // // // //           <Route path="/tile/:tileId" element={<TileDetailsPage />} />
// // // // // // // // //           <Route path="/room-select/:tileId" element={<RoomSelectorPage />} />
// // // // // // // // //           <Route path="/3d-view/:tileId/:roomType" element={<Room3DViewPage />} />
// // // // // // // // //           <Route path="/tile/search" element={<TileSearchPage />} />

// // // // // // // // //           {/* ═══════════════════════════════════════════════════════════
// // // // // // // // //               WORKER SCAN PAGE
// // // // // // // // //           ═══════════════════════════════════════════════════════════ */}
          
// // // // // // // // //           <Route
// // // // // // // // //             path="/scan"
// // // // // // // // //             element={
// // // // // // // // //               <WorkerProtectedRoute>
// // // // // // // // //                 <WorkerErrorBoundary>
// // // // // // // // //                   <ScanPage />
// // // // // // // // //                 </WorkerErrorBoundary>
// // // // // // // // //               </WorkerProtectedRoute>
// // // // // // // // //             }
// // // // // // // // //           />

// // // // // // // // //           {/* ═══════════════════════════════════════════════════════════
// // // // // // // // //               SELLER AUTO-LOGIN
// // // // // // // // //           ═══════════════════════════════════════════════════════════ */}
          
// // // // // // // // //           <Route path="/seller-auto-login" element={<SellerAutoLogin />} />

// // // // // // // // //           {/* ═══════════════════════════════════════════════════════════
// // // // // // // // //               PAYMENT ROUTES - PUBLIC ACCESS
// // // // // // // // //           ═══════════════════════════════════════════════════════════ */}
          
// // // // // // // // //           <Route path="/payment-success" element={<PaymentSuccess />} />
// // // // // // // // //           <Route path="/payment-failure" element={<PaymentFailure />} />
// // // // // // // // //           <Route 
// // // // // // // // //             path="/payment-cancelled" 
// // // // // // // // //             element={
// // // // // // // // //               <Navigate 
// // // // // // // // //                 to="/payment-failure?error=Payment cancelled by user" 
// // // // // // // // //                 replace 
// // // // // // // // //               />
// // // // // // // // //             } 
// // // // // // // // //           />

// // // // // // // // //           {/* ═══════════════════════════════════════════════════════════
// // // // // // // // //               ADMIN DASHBOARD
// // // // // // // // //           ═══════════════════════════════════════════════════════════ */}
          
// // // // // // // // //           <Route
// // // // // // // // //             path="/admin/*"
// // // // // // // // //             element={
// // // // // // // // //               <AdminProtectedRoute>
// // // // // // // // //                 <DomainHeader />
// // // // // // // // //                 <main className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
// // // // // // // // //                   {renderError()}
// // // // // // // // //                   <AdminDashboard />
// // // // // // // // //                 </main>
// // // // // // // // //               </AdminProtectedRoute>
// // // // // // // // //             }
// // // // // // // // //           />

// // // // // // // // //           {/* ═══════════════════════════════════════════════════════════
// // // // // // // // //               SELLER DASHBOARD
// // // // // // // // //           ═══════════════════════════════════════════════════════════ */}
          
// // // // // // // // //           <Route
// // // // // // // // //             path="/seller/*"
// // // // // // // // //             element={
// // // // // // // // //               <SellerProtectedRoute>
// // // // // // // // //                 <DomainHeader />
// // // // // // // // //                 <main className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
// // // // // // // // //                   {renderError()}
// // // // // // // // //                   <SellerDashboard />
// // // // // // // // //                 </main>
// // // // // // // // //               </SellerProtectedRoute>
// // // // // // // // //             }
// // // // // // // // //           />

// // // // // // // // //           {/* ═══════════════════════════════════════════════════════════
// // // // // // // // //               PUBLIC/CUSTOMER ROUTES
// // // // // // // // //           ═══════════════════════════════════════════════════════════ */}
          
// // // // // // // // //           <Route
// // // // // // // // //             path="/*"
// // // // // // // // //             element={
// // // // // // // // //               <ProtectedRoute allowUnauthenticated={true}>
// // // // // // // // //                 <DomainHeader />
// // // // // // // // //                 <main className="w-full">
// // // // // // // // //                   {renderError()}
                  
// // // // // // // // //                   {/* ✅ NEW HERO SECTION */}
// // // // // // // // //                   {renderHeroSection()}
                  
// // // // // // // // //                   {/* ✅ EXISTING COMPONENTS */}
// // // // // // // // //                   <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
// // // // // // // // //                     <div className="space-y-6 sm:space-y-8">
// // // // // // // // //                       <PublicShowroom />
                      
// // // // // // // // //                       <section className="py-8 sm:py-12 lg:py-16 bg-white/80 backdrop-blur-sm rounded-lg sm:rounded-xl shadow-lg">
// // // // // // // // //                         <div className="max-w-4xl mx-auto px-4 sm:px-6">
// // // // // // // // //                           <div className="text-center mb-8 sm:mb-12">
// // // // // // // // //                             <div className="text-4xl sm:text-5xl mb-3 sm:mb-4">🤝</div>
// // // // // // // // //                             <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-3 sm:mb-4">
// // // // // // // // //                               Partner With Us
// // // // // // // // //                             </h2>
// // // // // // // // //                             <p className="text-sm sm:text-base md:text-lg text-gray-600 mb-4 sm:mb-6">
// // // // // // // // //                               Expand your tile business with our cutting-edge 3D visualization platform
// // // // // // // // //                             </p>
// // // // // // // // //                             <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs sm:text-sm text-gray-500">
// // // // // // // // //                               <span className="flex items-center whitespace-nowrap">
// // // // // // // // //                                 <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
// // // // // // // // //                                 3D Showroom
// // // // // // // // //                               </span>
// // // // // // // // //                               <span className="flex items-center whitespace-nowrap">
// // // // // // // // //                                 <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
// // // // // // // // //                                 QR Code System
// // // // // // // // //                               </span>
// // // // // // // // //                               <span className="flex items-center whitespace-nowrap">
// // // // // // // // //                                 <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
// // // // // // // // //                                 Analytics Dashboard
// // // // // // // // //                               </span>
// // // // // // // // //                             </div>
// // // // // // // // //                           </div>
// // // // // // // // //                           <SellerRequestForm />
// // // // // // // // //                         </div>
// // // // // // // // //                       </section>
// // // // // // // // //                     </div>
// // // // // // // // //                   </div>
// // // // // // // // //                 </main>

// // // // // // // // //                 {/* ✅ Floating QR Scan Button */}
// // // // // // // // //                 <FloatingQRButton />
// // // // // // // // //               </ProtectedRoute>
// // // // // // // // //             }
// // // // // // // // //           />

// // // // // // // // //           {/* ═══════════════════════════════════════════════════════════
// // // // // // // // //               CATCH-ALL REDIRECT
// // // // // // // // //           ═══════════════════════════════════════════════════════════ */}
          
// // // // // // // // //           <Route path="*" element={<Navigate to="/" replace />} />
// // // // // // // // //         </Routes>
// // // // // // // // //       </div>

// // // // // // // // //       {/* ═══════════════════════════════════════════════════════════
// // // // // // // // //           FOOTER
// // // // // // // // //       ═══════════════════════════════════════════════════════════ */}
      
// // // // // // // // //       <footer className="mt-auto py-6 sm:py-8 bg-white/80 backdrop-blur-sm border-t border-gray-200">
// // // // // // // // //         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
// // // // // // // // //           <div className="text-center text-gray-600">
// // // // // // // // //             <p className="text-sm sm:text-base font-medium">
// // // // // // // // //               &copy; 2025 SrijanX Tile. All rights reserved.
// // // // // // // // //             </p>
// // // // // // // // //             <p className="text-xs sm:text-sm mt-1 sm:mt-2 text-gray-500">
// // // // // // // // //               Powered by advanced 3D visualization technology
// // // // // // // // //             </p>
// // // // // // // // //             <div className="mt-3 sm:mt-4 flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-xs text-gray-400">
// // // // // // // // //               <span className="flex items-center">
// // // // // // // // //                 <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1"></span>
// // // // // // // // //                 Secure Platform
// // // // // // // // //               </span>
// // // // // // // // //               <span className="flex items-center">
// // // // // // // // //                 <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-1"></span>
// // // // // // // // //                 Cloud Powered
// // // // // // // // //               </span>
// // // // // // // // //               <span className="flex items-center">
// // // // // // // // //                 <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mr-1"></span>
// // // // // // // // //                 Real-time Updates
// // // // // // // // //               </span>
// // // // // // // // //             </div>
// // // // // // // // //           </div>
// // // // // // // // //         </div>
// // // // // // // // //       </footer>

// // // // // // // // //       {/* ═══════════════════════════════════════════════════════════
// // // // // // // // //           MODALS
// // // // // // // // //       ═══════════════════════════════════════════════════════════ */}
      
// // // // // // // // //       {/* Auth Modal */}
// // // // // // // // //       <AuthModal 
// // // // // // // // //         isOpen={showAuthModal} 
// // // // // // // // //         onClose={() => setShowAuthModal(false)} 
// // // // // // // // //       />

// // // // // // // // //       {/* Plans Modal */}
// // // // // // // // //       <PlansModal
// // // // // // // // //         isOpen={showPlansModal}
// // // // // // // // //         onClose={() => setShowPlansModal(false)}
// // // // // // // // //         isLoggedIn={isAuthenticated}
// // // // // // // // //         onSelectPlan={handlePlanSelection}
// // // // // // // // //       />

// // // // // // // // //       {/* Payment Confirmation Modal */}
// // // // // // // // //       <PaymentConfirmationModal
// // // // // // // // //         isOpen={showPaymentConfirmation}
// // // // // // // // //         onClose={() => {
// // // // // // // // //           setShowPaymentConfirmation(false);
// // // // // // // // //           setSelectedPlan(null);
// // // // // // // // //         }}
// // // // // // // // //         plan={selectedPlan}
// // // // // // // // //         onConfirm={handlePaymentConfirm}
// // // // // // // // //         isProcessing={processingPayment}
// // // // // // // // //       />

// // // // // // // // //       {/* Payment Checkout */}
// // // // // // // // //       {checkoutOptions && paymentId && selectedPlan && (
// // // // // // // // //         <PaymentCheckout
// // // // // // // // //           checkoutOptions={checkoutOptions}
// // // // // // // // //           paymentId={paymentId}
// // // // // // // // //           planId={selectedPlan.id}
// // // // // // // // //           sellerId={user?.uid || ''}
// // // // // // // // //           onError={handlePaymentError}
// // // // // // // // //         />
// // // // // // // // //       )}
// // // // // // // // //     </div>
// // // // // // // // //   );
// // // // // // // // // }

// // // // // // // // // // ═══════════════════════════════════════════════════════════════
// // // // // // // // // // ✅ APP WRAPPER WITH ROUTER
// // // // // // // // // // ═══════════════════════════════════════════════════════════════

// // // // // // // // // function App() {
// // // // // // // // //   return (
// // // // // // // // //     <ErrorBoundary>
// // // // // // // // //       <Router>
// // // // // // // // //         <AppContent />
// // // // // // // // //       </Router>
// // // // // // // // //     </ErrorBoundary>
// // // // // // // // //   );
// // // // // // // // // }

// // // // // // // // // export default App;

// // // // // // // // // console.log('✅ App.tsx - PRODUCTION v13.0 FINAL - EXACT DUMMY UI INTEGRATED - ALL DEVICES RESPONSIVE'); 

// // // // // // // // import React, { useState, useEffect } from 'react';
// // // // // // // // import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// // // // // // // // import { ProtectedRoute, AdminProtectedRoute, SellerProtectedRoute } from './components/ProtectedRoute';
// // // // // // // // import { WorkerProtectedRoute } from './components/WorkerProtectedRoute';
// // // // // // // // import { PlansModal } from './components/Payment/PlansModal';
// // // // // // // // import { PaymentSuccess } from './components/Payment/PaymentSuccess';
// // // // // // // // import { PaymentFailure } from './components/Payment/PaymentFailure';
// // // // // // // // import { useAuth } from './hooks/useAuth';
// // // // // // // // import { auth } from './lib/firebase';
// // // // // // // // import { DomainHeader } from './components/DomainHeader';
// // // // // // // // import { SellerDashboard } from './components/SellerDashboard';
// // // // // // // // import { AdminDashboard } from './components/AdminDashboard';
// // // // // // // // import { PublicShowroom } from './components/PublicShowroom';
// // // // // // // // import { SellerRequestForm } from './components/SellerRequestForm';            
// // // // // // // // import { AuthModal } from './components/Auth/AuthModal';
// // // // // // // // import { FloatingQRButton } from './components/FloatingQRButton';
// // // // // // // // import { TileDetailsPage } from './components/TileDetailsPage';
// // // // // // // // import { RoomSelectorPage } from './components/RoomSelectorPage';
// // // // // // // // import { Room3DViewPage } from './components/Room3DViewPage';
// // // // // // // // import { TileSearchPage } from './components/TileSearchPage';
// // // // // // // // import { ScanPage } from './components/ScanPage';
// // // // // // // // import { getCurrentDomainConfig, applyDomainTheme } from './utils/domainUtils';
// // // // // // // // import { WorkerErrorBoundary } from './components/WorkerErrorBoundary';
// // // // // // // // import { SellerAutoLogin } from './components/SellerAutoLogin';
// // // // // // // // import { Toaster } from 'react-hot-toast';
// // // // // // // // import { ArrowRight, PlayCircle, RefreshCw, Menu, X } from 'lucide-react';
// // // // // // // // import { PaymentConfirmationModal } from './components/Payment/PaymentConfirmationModal';
// // // // // // // // import { PaymentCheckout } from './components/Payment/PaymentCheckout';
// // // // // // // // import { initiatePayment } from './lib/paymentService';
// // // // // // // // import { getPlanById } from './lib/planService';
// // // // // // // // import type { Plan } from './types/plan.types';
// // // // // // // // import type { RazorpayCheckoutOptions } from './types/payment.types';
// // // // // // // // import {FeatureGuide} from './components/Feature'
// // // // // // // // import {Guide} from  './components/Guide'
// // // // // // // // import {Banner} from './components/Banner'
// // // // // // // // import {Footer} from './components/Footer'
// // // // // // // // import  Statistics  from './components/Statistics';
// // // // // // // // // ═══════════════════════════════════════════════════════════════════════════
// // // // // // // // // ✅ GLOBAL STYLES - INTER FONT IMPORT
// // // // // // // // // ═══════════════════════════════════════════════════════════════════════════

// // // // // // // // // const GlobalStyles = () => (
// // // // // // // // //   <style dangerouslySetInnerHTML={{__html: `
// // // // // // // // //     @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
    
// // // // // // // // //     * {
// // // // // // // // //       font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
// // // // // // // // //     }
    
// // // // // // // // //     @keyframes fadeInUp {
// // // // // // // // //       from { 
// // // // // // // // //         opacity: 0; 
// // // // // // // // //         transform: translateY(20px); 
// // // // // // // // //       }
// // // // // // // // //       to { 
// // // // // // // // //         opacity: 1; 
// // // // // // // // //         transform: translateY(0); 
// // // // // // // // //       }
// // // // // // // // //     }
    
// // // // // // // // //     .animate-fade-in-up {
// // // // // // // // //       animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
// // // // // // // // //       opacity: 0;
// // // // // // // // //     }
    
// // // // // // // // //     @keyframes spin-slow {
// // // // // // // // //       from { transform: rotate(0deg); }
// // // // // // // // //       to { transform: rotate(360deg); }
// // // // // // // // //     }
    
// // // // // // // // //     .animate-spin-slow {
// // // // // // // // //       animation: spin-slow 4s linear infinite;
// // // // // // // // //     }
    
// // // // // // // // //     @keyframes slideDown {
// // // // // // // // //       from {
// // // // // // // // //         opacity: 0;
// // // // // // // // //         transform: translateY(-10px);
// // // // // // // // //       }
// // // // // // // // //       to {
// // // // // // // // //         opacity: 1;
// // // // // // // // //         transform: translateY(0);
// // // // // // // // //       }
// // // // // // // // //     }
    
// // // // // // // // //     .animate-slide-down {
// // // // // // // // //       animation: slideDown 0.3s ease-out forwards;
// // // // // // // // //     }
    
// // // // // // // // //     /* Smooth scroll */
// // // // // // // // //     html {
// // // // // // // // //       scroll-behavior: smooth;
// // // // // // // // //     }
    
// // // // // // // // //     /* Custom scrollbar */
// // // // // // // // //     ::-webkit-scrollbar {
// // // // // // // // //       width: 10px;
// // // // // // // // //       height: 10px;
// // // // // // // // //     }
    
// // // // // // // // //     ::-webkit-scrollbar-track {
// // // // // // // // //       background: #f1f1f1;
// // // // // // // // //     }
    
// // // // // // // // //     ::-webkit-scrollbar-thumb {
// // // // // // // // //       background: #888;
// // // // // // // // //       border-radius: 5px;
// // // // // // // // //     }
    
// // // // // // // // //     ::-webkit-scrollbar-thumb:hover {
// // // // // // // // //       background: #555;
// // // // // // // // //     }
// // // // // // // // //   `}} />
// // // // // // // // // ); 
// // // // // // // // const GlobalStyles = () => (
// // // // // // // //   <style dangerouslySetInnerHTML={{__html: `
// // // // // // // //     @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
    
// // // // // // // //     * {
// // // // // // // //       font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
// // // // // // // //     }
    
// // // // // // // //     /* Perfect Smooth Scrolling with Header Offset */
// // // // // // // //     html {
// // // // // // // //       scroll-behavior: smooth;
// // // // // // // //       scroll-padding-top: 100px; /* Prevents navbar from hiding section titles */
// // // // // // // //     }
    
// // // // // // // //     @keyframes fadeInUp {
// // // // // // // //       from { opacity: 0; transform: translateY(20px); }
// // // // // // // //       to { opacity: 1; transform: translateY(0); }
// // // // // // // //     }
// // // // // // // //     .animate-fade-in-up {
// // // // // // // //       animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
// // // // // // // //       opacity: 0;
// // // // // // // //     }
    
// // // // // // // //     @keyframes spin-slow {
// // // // // // // //       from { transform: rotate(0deg); }
// // // // // // // //       to { transform: rotate(360deg); }
// // // // // // // //     }
// // // // // // // //     .animate-spin-slow {
// // // // // // // //       animation: spin-slow 4s linear infinite;
// // // // // // // //     }
    
// // // // // // // //     /* Buttery Smooth Mobile Menu Slide Down */
// // // // // // // //     @keyframes slideDownMenu {
// // // // // // // //       from { opacity: 0; transform: translateY(-15px); }
// // // // // // // //       to { opacity: 1; transform: translateY(0); }
// // // // // // // //     }
// // // // // // // //     .animate-slide-down {
// // // // // // // //       animation: slideDownMenu 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
// // // // // // // //     }

// // // // // // // //     /* Custom scrollbar */
// // // // // // // //     ::-webkit-scrollbar {
// // // // // // // //       width: 10px;
// // // // // // // //       height: 10px;
// // // // // // // //     }
// // // // // // // //     ::-webkit-scrollbar-track {
// // // // // // // //       background: #f1f1f1;
// // // // // // // //     }
// // // // // // // //     ::-webkit-scrollbar-thumb {
// // // // // // // //       background: #888;
// // // // // // // //       border-radius: 5px;
// // // // // // // //     }
// // // // // // // //     ::-webkit-scrollbar-thumb:hover {
// // // // // // // //       background: #555;
// // // // // // // //     }
// // // // // // // //   `}} />
// // // // // // // // );

// // // // // // // // // ═══════════════════════════════════════════════════════════════════════════
// // // // // // // // // ✅ ERROR BOUNDARY - PROFESSIONAL ERROR HANDLING
// // // // // // // // // ═══════════════════════════════════════════════════════════════════════════

// // // // // // // // class ErrorBoundary extends React.Component<
// // // // // // // //   { children: React.ReactNode },
// // // // // // // //   { hasError: boolean; error?: Error }
// // // // // // // // > {
// // // // // // // //   constructor(props: { children: React.ReactNode }) {
// // // // // // // //     super(props);
// // // // // // // //     this.state = { hasError: false };
// // // // // // // //   }

// // // // // // // //   static getDerivedStateFromError(error: Error) {
// // // // // // // //     return { hasError: true, error };
// // // // // // // //   }

// // // // // // // //   componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
// // // // // // // //     console.error('🔥 App Error Boundary:', error, errorInfo);
// // // // // // // //   }

// // // // // // // //   render() {
// // // // // // // //     if (this.state.hasError) {
// // // // // // // //       return (
// // // // // // // //         <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center p-4">
// // // // // // // //           <div className="text-center p-8 bg-white rounded-xl shadow-2xl max-w-md w-full">
// // // // // // // //             <div className="text-red-500 text-6xl mb-4">⚠️</div>
// // // // // // // //             <h1 className="text-2xl font-bold text-gray-800 mb-4">Something went wrong</h1>
// // // // // // // //             <p className="text-gray-600 mb-6">
// // // // // // // //               The application encountered an unexpected error. Please refresh the page.
// // // // // // // //             </p>
// // // // // // // //             {this.state.error && (
// // // // // // // //               <details className="mb-6 text-left">
// // // // // // // //                 <summary className="text-sm text-gray-500 cursor-pointer hover:text-gray-700">
// // // // // // // //                   Error details
// // // // // // // //                 </summary>
// // // // // // // //                 <pre className="mt-2 p-3 bg-gray-100 rounded text-xs overflow-x-auto">
// // // // // // // //                   {this.state.error.message}
// // // // // // // //                 </pre>
// // // // // // // //               </details>
// // // // // // // //             )}
// // // // // // // //             <button
// // // // // // // //               onClick={() => window.location.reload()}
// // // // // // // //               className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors font-semibold shadow-lg"
// // // // // // // //             >
// // // // // // // //               Refresh Page
// // // // // // // //             </button>
// // // // // // // //           </div>
// // // // // // // //         </div>
// // // // // // // //       );
// // // // // // // //     }

// // // // // // // //     return this.props.children;
// // // // // // // //   }
// // // // // // // // }

// // // // // // // // // ═══════════════════════════════════════════════════════════════════════════
// // // // // // // // // ✅ NAVIGATION COMPONENT - EXACT DUMMY UI MATCH
// // // // // // // // // ═══════════════════════════════════════════════════════════════════════════

// // // // // // // // interface NavigationProps {
// // // // // // // //   onLoginClick: () => void;
// // // // // // // //   onDemoClick: () => void;
// // // // // // // // }

// // // // // // // // const Navigation: React.FC<NavigationProps> = ({ onLoginClick, onDemoClick }) => {
// // // // // // // //   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

// // // // // // // //   useEffect(() => {
// // // // // // // //     if (mobileMenuOpen) {
// // // // // // // //       document.body.style.overflow = 'hidden';
// // // // // // // //     } else {
// // // // // // // //       document.body.style.overflow = 'unset';
// // // // // // // //     }
// // // // // // // //     return () => { document.body.style.overflow = 'unset'; };
// // // // // // // //   }, [mobileMenuOpen]);

// // // // // // // //   return (
   

// // // // // // // // <nav className="max-w-[1400px] mx-auto px-4 sm:px-6 py-5 sm:py-6 lg:py-8 flex items-center justify-between relative z-40">
// // // // // // // //       {/* Logo */}
// // // // // // // //       <div className="flex items-center gap-3 cursor-pointer">
// // // // // // // //         <div className="relative w-6 h-6 lg:w-8 lg:h-8 flex items-center justify-center flex-shrink-0">
// // // // // // // //           <div className="absolute top-0 left-0 w-3.5 h-3.5 lg:w-4 lg:h-4 bg-indigo-300 rounded-[3px]"></div>
// // // // // // // //           <div className="absolute bottom-0 right-0 w-3.5 h-3.5 lg:w-4 lg:h-4 bg-[#0B40E8] rounded-[3px] mix-blend-multiply"></div>
// // // // // // // //         </div>
// // // // // // // //         <span className="font-bold text-[20px] sm:text-[22px] lg:text-[26px] tracking-tight text-gray-900">
// // // // // // // //           Tilesview360
// // // // // // // //         </span>
// // // // // // // //       </div>

// // // // // // // //       {/* Desktop Navigation Links */}
// // // // // // // //       <div className="hidden lg:flex items-center gap-10 xl:gap-14">
// // // // // // // //         <a href="#product" className="text-gray-900 text-[15px] lg:text-[18px] font-semibold relative after:content-[''] after:absolute after:left-0 after:-bottom-1.5 after:w-full after:h-0.5 after:bg-[#0B40E8] hover:text-gray-700 transition-colors">Product</a>
// // // // // // // //         <a href="#features" className="text-gray-600 text-[15px] lg:text-[18px] font-medium hover:text-gray-900 transition-colors duration-200">Features</a>
// // // // // // // //         <a href="#pricing" className="text-gray-600 text-[15px] lg:text-[18px] font-medium hover:text-gray-900 transition-colors duration-200">Pricing</a>
// // // // // // // //         <a href="#showcase" className="text-gray-600 text-[15px] lg:text-[18px] font-medium hover:text-gray-900 transition-colors duration-200">Showcase</a>
// // // // // // // //       </div>

// // // // // // // //       {/* Desktop Right Actions */}
// // // // // // // //       <div className="hidden lg:flex items-center gap-8 xl:gap-10">
// // // // // // // //         <button onClick={onLoginClick} className="text-gray-700 text-[15px] lg:text-[18px] font-bold hover:text-gray-900 transition-colors duration-200">Login</button>
// // // // // // // //         <button onClick={onDemoClick} className="bg-[#0B40E8] text-white text-[15px] lg:text-[18px] px-7 py-3 lg:px-9 lg:py-4 rounded-full font-semibold hover:bg-blue-700 transition-all duration-200 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40">Request Demo</button>
// // // // // // // //       </div>

// // // // // // // //       {/* Mobile Menu Button - UPGRADED FOR CLARITY */}
// // // // // // // //       <button
// // // // // // // //         onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
// // // // // // // //         className="lg:hidden relative z-[70] p-2 bg-gray-50 hover:bg-gray-100 rounded-full text-gray-800 transition-colors shadow-sm"
// // // // // // // //         aria-label="Toggle menu"
// // // // // // // //       >
// // // // // // // //         {mobileMenuOpen ? (
// // // // // // // //           <X className="w-6 h-6 stroke-[2.5px]" />
// // // // // // // //         ) : (
// // // // // // // //           <Menu className="w-6 h-6 stroke-[2.5px]" />
// // // // // // // //         )}
// // // // // // // //       </button>

// // // // // // // //       {/* Mobile Menu Overlay */}
// // // // // // // //       {mobileMenuOpen && (
// // // // // // // //         <>
// // // // // // // //           <div 
// // // // // // // //             className="lg:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-[50] animate-fade-in-up"
// // // // // // // //             style={{ animationDuration: '0.3s' }}
// // // // // // // //             onClick={() => setMobileMenuOpen(false)}
// // // // // // // //           />
// // // // // // // //           <div className="lg:hidden fixed top-0 left-0 right-0 pt-[88px] pb-6 px-6 bg-white border-b border-gray-200 shadow-2xl z-[60] animate-slide-down rounded-b-[2rem]">
// // // // // // // //             <div className="max-w-md mx-auto space-y-6">
// // // // // // // //               {/* Mobile Links */}
// // // // // // // //               <div className="space-y-2">
// // // // // // // //                 <a href="#product" onClick={() => setMobileMenuOpen(false)} className="block text-gray-900 text-[16px] font-semibold p-3 bg-gray-50 rounded-xl hover:bg-blue-50 hover:text-[#0B40E8] transition-colors">Product</a>
// // // // // // // //                 <a href="#features" onClick={() => setMobileMenuOpen(false)} className="block text-gray-600 text-[16px] font-medium p-3 hover:bg-gray-50 rounded-xl transition-colors">Features</a>
// // // // // // // //                 <a href="#pricing" onClick={() => setMobileMenuOpen(false)} className="block text-gray-600 text-[16px] font-medium p-3 hover:bg-gray-50 rounded-xl transition-colors">Pricing</a>
// // // // // // // //                 <a href="#showcase" onClick={() => setMobileMenuOpen(false)} className="block text-gray-600 text-[16px] font-medium p-3 hover:bg-gray-50 rounded-xl transition-colors">Showcase</a>
// // // // // // // //               </div>
              
// // // // // // // //               {/* Mobile Actions */}
// // // // // // // //               <div className="pt-4 border-t border-gray-100 space-y-3">
// // // // // // // //                 <button
// // // // // // // //                   onClick={() => { setMobileMenuOpen(false); onLoginClick(); }}
// // // // // // // //                   className="w-full text-gray-700 text-[16px] font-bold py-3 px-6 rounded-xl border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all"
// // // // // // // //                 >
// // // // // // // //                   Login
// // // // // // // //                 </button>
// // // // // // // //                 <button
// // // // // // // //                   onClick={() => { setMobileMenuOpen(false); onDemoClick(); }}
// // // // // // // //                   className="w-full bg-[#0B40E8] text-white text-[16px] py-3 px-6 rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/30"
// // // // // // // //                 >
// // // // // // // //                   Request Demo
// // // // // // // //                 </button>
// // // // // // // //               </div>
// // // // // // // //             </div>
// // // // // // // //           </div>
// // // // // // // //         </>
// // // // // // // //       )}
// // // // // // // //     </nav>


// // // // // // // //   );
// // // // // // // // };

// // // // // // // // // ═══════════════════════════════════════════════════════════════════════════
// // // // // // // // // ✅ HERO SECTION - EXACT DUMMY UI DESIGN
// // // // // // // // // ═══════════════════════════════════════════════════════════════════════════

// // // // // // // // interface HeroSectionProps {
// // // // // // // //   onDemoClick: () => void;
// // // // // // // // }

// // // // // // // // const HeroSection: React.FC<HeroSectionProps> = ({ onDemoClick }) => {
// // // // // // // //   return (
// // // // // // // //     // <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12 py-8 sm:py-12 lg:py-20 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
      
// // // // // // // //     //   {/* ═════════════════════════════════════════════════════════════
// // // // // // // //     //       LEFT COLUMN - EXACT TEXT CONTENT FROM DUMMY UI
// // // // // // // //     //   ═════════════════════════════════════════════════════════════ */}
// // // // // // // //     //   <div className="space-y-6 sm:space-y-8 order-2 lg:order-1">
        
// // // // // // // //     //     {/* Heading - EXACT DUMMY UI */}
// // // // // // // //     //     <h1 className="text-[40px] sm:text-[48px] lg:text-[56px] leading-[1.1] font-extrabold tracking-tight text-gray-900">
// // // // // // // //     //       See Tiles Before<br />
// // // // // // // //     //       <span className="text-[#0B40E8]">Customers Buy</span>
// // // // // // // //     //     </h1>

// // // // // // // //     //     {/* Description - EXACT DUMMY UI */}
// // // // // // // //     //     <p className="text-gray-500 text-[15px] sm:text-[16px] lg:text-[17px] leading-relaxed pr-0 lg:pr-4">
// // // // // // // //     //       Transform your showroom with AI-powered 3D tile visualization. Let customers preview any material in their actual living spaces with photorealistic precision.
// // // // // // // //     //     </p>

// // // // // // // //     //     {/* CTA Buttons - EXACT DUMMY UI */}
// // // // // // // //     //     <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
// // // // // // // //     //       <button 
// // // // // // // //     //         onClick={onDemoClick}
// // // // // // // //     //         className="w-full sm:w-auto bg-[#0B40E8] text-white text-[15px] px-8 py-4 rounded-full font-semibold flex items-center justify-center gap-2 hover:bg-blue-700 transition-all duration-200 shadow-xl shadow-blue-600/20 hover:shadow-2xl hover:shadow-blue-600/30 group"
// // // // // // // //     //       >
// // // // // // // //     //         Request Demo
// // // // // // // //     //         <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
// // // // // // // //     //       </button>
          
// // // // // // // //     //       <button 
// // // // // // // //     //         onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })}
// // // // // // // //     //         className="w-full sm:w-auto bg-white text-gray-900 text-[15px] px-8 py-4 rounded-full font-semibold flex items-center justify-center gap-3 hover:bg-gray-50 transition-all duration-200 shadow-sm border border-gray-100 hover:border-gray-200"
// // // // // // // //     //       >
// // // // // // // //     //         <PlayCircle className="w-5 h-5 text-gray-700" />
// // // // // // // //     //         Watch Live Preview
// // // // // // // //     //       </button>
// // // // // // // //     //     </div>
// // // // // // // //     //   </div>

// // // // // // // //     //   {/* ═════════════════════════════════════════════════════════════
// // // // // // // //     //       RIGHT COLUMN - VISUAL GALLERY WITH FLOATING CARDS
// // // // // // // //     //   ═════════════════════════════════════════════════════════════ */}
// // // // // // // //     //   <div className="relative w-full h-[400px] sm:h-[500px] lg:h-[650px] order-1 lg:order-2">
        
// // // // // // // //     //     {/* Main Background Image */}
// // // // // // // //     //     <div className="absolute inset-y-8 sm:inset-y-12 inset-x-4 sm:inset-x-8 lg:inset-x-12 rounded-[2rem] overflow-hidden shadow-2xl z-0">
// // // // // // // //     //       <img 
// // // // // // // //     //         src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
// // // // // // // //     //         alt="Modern living room interior" 
// // // // // // // //     //         className="w-full h-full object-cover object-center scale-105"
// // // // // // // //     //         loading="eager"
// // // // // // // //     //       />
// // // // // // // //     //       <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent"></div>
// // // // // // // //     //     </div>

// // // // // // // //     //     {/* Floating Card 1: Top Right (Venetian Blue) */}
// // // // // // // //     //     <div 
// // // // // // // //     //       className="absolute top-0 right-0 lg:-right-4 bg-white/70 backdrop-blur-xl p-3 pb-4 rounded-[1.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] z-20 border border-white/50 w-[180px] sm:w-[220px] animate-fade-in-up"
// // // // // // // //     //       style={{ animationDelay: '0ms' }}
// // // // // // // //     //     >
// // // // // // // //     //       <div className="w-full h-[140px] sm:h-[180px] rounded-2xl overflow-hidden mb-3">
// // // // // // // //     //         <img 
// // // // // // // //     //           src="https://images.unsplash.com/photo-1588863673322-2621aef42bf8?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80" 
// // // // // // // //     //           alt="Venetian Blue Tile" 
// // // // // // // //     //           className="w-full h-full object-cover"
// // // // // // // //     //           loading="lazy"
// // // // // // // //     //         />
// // // // // // // //     //       </div>
// // // // // // // //     //       <div className="px-2">
// // // // // // // //     //         <h3 className="font-bold text-gray-900 text-[15px] leading-tight">Venetian Blue</h3>
// // // // // // // //     //         <p className="text-[#0B40E8] text-xs font-semibold mt-0.5">Living Room</p>
// // // // // // // //     //       </div>
// // // // // // // //     //     </div>

// // // // // // // //     //     {/* Floating Card 2: Middle Center (AI Scan) */}
// // // // // // // //     //     <div 
// // // // // // // //     //       className="absolute top-[45%] left-0 lg:-left-12 -translate-y-1/2 bg-white/80 backdrop-blur-xl p-3 sm:p-4 pr-6 sm:pr-10 rounded-[1.25rem] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.15)] z-30 border border-white/60 flex items-center gap-3 sm:gap-4 animate-fade-in-up max-w-[90%] sm:max-w-none" 
// // // // // // // //     //       style={{ animationDelay: '150ms' }}
// // // // // // // //     //     >
// // // // // // // //     //       <div className="bg-[#0B40E8] w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-white shadow-lg shadow-blue-500/30 flex-shrink-0">
// // // // // // // //     //         <RefreshCw className="w-5 h-5 sm:w-6 sm:h-6 animate-spin-slow" />
// // // // // // // //     //       </div>
// // // // // // // //     //       <div className="min-w-0">
// // // // // // // //     //         <h3 className="font-bold text-gray-900 text-sm">AI 3D Scan Active</h3>
// // // // // // // //     //         <p className="text-gray-500 text-xs mt-0.5 truncate">Calibrating surface textures...</p>
// // // // // // // //     //       </div>
// // // // // // // //     //     </div>

// // // // // // // //     //     {/* Floating Card 3: Bottom Left (Noir Slate) */}
// // // // // // // //     //     <div 
// // // // // // // //     //       className="absolute bottom-4 left-4 lg:left-8 bg-white/90 backdrop-blur-md p-3 pb-4 rounded-[1.5rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.2)] z-20 border border-white w-[160px] sm:w-[200px] animate-fade-in-up" 
// // // // // // // //     //       style={{ animationDelay: '300ms' }}
// // // // // // // //     //     >
// // // // // // // //     //       <div className="w-full h-[120px] sm:h-[160px] rounded-2xl overflow-hidden mb-3 relative group">
// // // // // // // //     //         <img 
// // // // // // // //     //           src="https://images.unsplash.com/photo-1620626011761-996317b8d101?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80" 
// // // // // // // //     //           alt="Noir Slate Bathroom" 
// // // // // // // //     //           className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
// // // // // // // //     //           loading="lazy"
// // // // // // // //     //         />
// // // // // // // //     //         <div className="absolute inset-0 bg-black/10"></div>
// // // // // // // //     //       </div>
// // // // // // // //     //       <div className="px-2">
// // // // // // // //     //         <h3 className="font-bold text-gray-900 text-[15px] leading-tight">Noir Slate</h3>
// // // // // // // //     //         <p className="text-[#0B40E8] text-xs font-semibold mt-0.5">Master Bath</p>
// // // // // // // //     //       </div>
// // // // // // // //     //     </div>
// // // // // // // //     //   </div>
// // // // // // // //     // </main> 
// // // // // // // //     <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12 py-8 sm:py-12 lg:py-24 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 xl:gap-24 items-center">
      
// // // // // // // //       {/* ═════════════════════════════════════════════════════════════
// // // // // // // //           LEFT COLUMN - SCALED TEXT CONTENT
// // // // // // // //       ═════════════════════════════════════════════════════════════ */}
// // // // // // // //       <div className="space-y-6 sm:space-y-8 lg:space-y-10 order-2 lg:order-1">
        
// // // // // // // //         {/* Heading */}
// // // // // // // //         <h1 className="text-[40px] sm:text-[48px] lg:text-[64px] xl:text-[72px] leading-[1.1] font-extrabold tracking-tight text-gray-900">
// // // // // // // //           See Tiles Before<br />
// // // // // // // //           <span className="text-[#0B40E8]">Customers Buy</span>
// // // // // // // //         </h1>

// // // // // // // //         {/* Description */}
// // // // // // // //         <p className="text-gray-500 text-[15px] sm:text-[16px] lg:text-[20px] xl:text-[22px] leading-relaxed pr-0 lg:pr-8">
// // // // // // // //           Transform your showroom with AI-powered 3D tile visualization. Let customers preview any material in their actual living spaces with photorealistic precision.
// // // // // // // //         </p>

// // // // // // // //         {/* CTA Buttons */}
// // // // // // // //         <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 lg:gap-6">
// // // // // // // //           <button 
// // // // // // // //             onClick={onDemoClick}
// // // // // // // //             className="w-full sm:w-auto bg-[#0B40E8] text-white text-[15px] lg:text-[18px] px-8 py-4 lg:px-10 lg:py-5 rounded-full font-semibold flex items-center justify-center gap-2 hover:bg-blue-700 transition-all duration-200 shadow-xl shadow-blue-600/20 hover:shadow-2xl hover:shadow-blue-600/30 group"
// // // // // // // //           >
// // // // // // // //             Request Demo
// // // // // // // //             <ArrowRight className="w-5 h-5 lg:w-6 lg:h-6 group-hover:translate-x-1 transition-transform duration-200" />
// // // // // // // //           </button>
          
// // // // // // // //           <button 
// // // // // // // //             onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })}
// // // // // // // //             className="w-full sm:w-auto bg-white text-gray-900 text-[15px] lg:text-[18px] px-8 py-4 lg:px-10 lg:py-5 rounded-full font-semibold flex items-center justify-center gap-3 hover:bg-gray-50 transition-all duration-200 shadow-sm border border-gray-100 hover:border-gray-200"
// // // // // // // //           >
// // // // // // // //             <PlayCircle className="w-5 h-5 lg:w-6 lg:h-6 text-gray-700" />
// // // // // // // //             Watch Live Preview
// // // // // // // //           </button>
// // // // // // // //         </div>
// // // // // // // //       </div>

// // // // // // // //       {/* ═════════════════════════════════════════════════════════════
// // // // // // // //           RIGHT COLUMN - VISUAL GALLERY WITH SCALED FLOATING CARDS
// // // // // // // //       ═════════════════════════════════════════════════════════════ */}
// // // // // // // //       <div className="relative w-full h-[400px] sm:h-[500px] lg:h-[700px] xl:h-[750px] order-1 lg:order-2">
        
// // // // // // // //         {/* Main Background Image */}
// // // // // // // //         <div className="absolute inset-y-8 sm:inset-y-12 lg:inset-y-0 inset-x-4 sm:inset-x-8 lg:inset-x-12 rounded-[2rem] lg:rounded-[3rem] overflow-hidden shadow-2xl z-0">
// // // // // // // //           <img 
// // // // // // // //             src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
// // // // // // // //             alt="Modern living room interior" 
// // // // // // // //             className="w-full h-full object-cover object-center scale-105"
// // // // // // // //             loading="eager"
// // // // // // // //           />
// // // // // // // //           <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent"></div>
// // // // // // // //         </div>

// // // // // // // //         {/* Floating Card 1: Top Right (Venetian Blue) */}
// // // // // // // //         <div 
// // // // // // // //           className="absolute top-0 right-0 lg:-right-8 xl:-right-12 bg-white/70 backdrop-blur-xl p-3 lg:p-4 pb-4 lg:pb-5 rounded-[1.5rem] lg:rounded-[2rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] z-20 border border-white/50 w-[180px] sm:w-[220px] lg:w-[280px] xl:w-[320px] animate-fade-in-up"
// // // // // // // //           style={{ animationDelay: '0ms' }}
// // // // // // // //         >
// // // // // // // //           <div className="w-full h-[140px] sm:h-[180px] lg:h-[220px] xl:h-[260px] rounded-2xl lg:rounded-3xl overflow-hidden mb-3 lg:mb-4">
// // // // // // // //             <img 
// // // // // // // //               src="https://images.unsplash.com/photo-1588863673322-2621aef42bf8?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80" 
// // // // // // // //               alt="Venetian Blue Tile" 
// // // // // // // //               className="w-full h-full object-cover"
// // // // // // // //               loading="lazy"
// // // // // // // //             />
// // // // // // // //           </div>
// // // // // // // //           <div className="px-2 lg:px-3">
// // // // // // // //             <h3 className="font-bold text-gray-900 text-[15px] lg:text-[18px] xl:text-[20px] leading-tight">Venetian Blue</h3>
// // // // // // // //             <p className="text-[#0B40E8] text-xs lg:text-sm xl:text-base font-semibold mt-1">Living Room</p>
// // // // // // // //           </div>
// // // // // // // //         </div>

// // // // // // // //         {/* Floating Card 2: Middle Center (AI Scan) */}
// // // // // // // //         <div 
// // // // // // // //           className="absolute top-[45%] lg:top-[50%] left-0 lg:-left-16 xl:-left-20 -translate-y-1/2 bg-white/80 backdrop-blur-xl p-3 sm:p-4 lg:p-5 pr-6 sm:pr-10 lg:pr-12 rounded-[1.25rem] lg:rounded-[2rem] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.15)] z-30 border border-white/60 flex items-center gap-3 sm:gap-4 lg:gap-5 animate-fade-in-up max-w-[90%] sm:max-w-none" 
// // // // // // // //           style={{ animationDelay: '150ms' }}
// // // // // // // //         >
// // // // // // // //           <div className="bg-[#0B40E8] w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 xl:w-20 xl:h-20 rounded-full flex items-center justify-center text-white shadow-lg shadow-blue-500/30 flex-shrink-0">
// // // // // // // //             <RefreshCw className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 xl:w-10 xl:h-10 animate-spin-slow" />
// // // // // // // //           </div>
// // // // // // // //           <div className="min-w-0">
// // // // // // // //             <h3 className="font-bold text-gray-900 text-sm lg:text-lg xl:text-xl">AI 3D Scan Active</h3>
// // // // // // // //             <p className="text-gray-500 text-xs lg:text-sm xl:text-base mt-1 truncate">Calibrating surface textures...</p>
// // // // // // // //           </div>
// // // // // // // //         </div>

// // // // // // // //         {/* Floating Card 3: Bottom Left (Noir Slate) */}
// // // // // // // //         <div 
// // // // // // // //           className="absolute bottom-4 lg:bottom-12 left-4 lg:left-0 xl:-left-8 bg-white/90 backdrop-blur-md p-3 lg:p-4 pb-4 lg:pb-5 rounded-[1.5rem] lg:rounded-[2rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.2)] z-20 border border-white w-[160px] sm:w-[200px] lg:w-[260px] xl:w-[300px] animate-fade-in-up" 
// // // // // // // //           style={{ animationDelay: '300ms' }}
// // // // // // // //         >
// // // // // // // //           <div className="w-full h-[120px] sm:h-[160px] lg:h-[200px] xl:h-[240px] rounded-2xl lg:rounded-3xl overflow-hidden mb-3 lg:mb-4 relative group">
// // // // // // // //             <img 
// // // // // // // //               src="https://images.unsplash.com/photo-1620626011761-996317b8d101?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80" 
// // // // // // // //               alt="Noir Slate Bathroom" 
// // // // // // // //               className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
// // // // // // // //               loading="lazy"
// // // // // // // //             />
// // // // // // // //             <div className="absolute inset-0 bg-black/10"></div>
// // // // // // // //           </div>
// // // // // // // //           <div className="px-2 lg:px-3">
// // // // // // // //             <h3 className="font-bold text-gray-900 text-[15px] lg:text-[18px] xl:text-[20px] leading-tight">Noir Slate</h3>
// // // // // // // //             <p className="text-[#0B40E8] text-xs lg:text-sm xl:text-base font-semibold mt-1">Master Bath</p>
// // // // // // // //           </div>
// // // // // // // //         </div>
// // // // // // // //       </div>
// // // // // // // //     </main>
// // // // // // // //   );
// // // // // // // // };

// // // // // // // // // ═══════════════════════════════════════════════════════════════════════════
// // // // // // // // // ✅ MAIN APP CONTENT COMPONENT
// // // // // // // // // ═══════════════════════════════════════════════════════════════════════════

// // // // // // // // function AppContent() {
// // // // // // // //   const { isAuthenticated, isLoading, user, error } = useAuth({
// // // // // // // //     enableActivityTracking: false,
// // // // // // // //     enableSessionWarnings: false,
// // // // // // // //     autoLogoutDelay: 0
// // // // // // // //   });
  
// // // // // // // //   const [showAuthModal, setShowAuthModal] = useState(false);
// // // // // // // //   const [showPlansModal, setShowPlansModal] = useState(false);
// // // // // // // //   const [domainConfig, setDomainConfig] = useState(getCurrentDomainConfig());
// // // // // // // //   const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
// // // // // // // //   const [showPaymentConfirmation, setShowPaymentConfirmation] = useState(false);
// // // // // // // //   const [checkoutOptions, setCheckoutOptions] = useState<RazorpayCheckoutOptions | null>(null);
// // // // // // // //   const [paymentId, setPaymentId] = useState<string | null>(null);
// // // // // // // //   const [processingPayment, setProcessingPayment] = useState(false);

// // // // // // // //   // ═══════════════════════════════════════════════════════════════════════════
// // // // // // // //   // ✅ APP INITIALIZATION
// // // // // // // //   // ═══════════════════════════════════════════════════════════════════════════

// // // // // // // //   useEffect(() => {
// // // // // // // //     try {
// // // // // // // //       console.log('🚀 Tile Showroom App initializing...');
      
// // // // // // // //       const config = getCurrentDomainConfig();
// // // // // // // //       setDomainConfig(config);
// // // // // // // //       applyDomainTheme(config);
      
// // // // // // // //       console.log('🎯 Domain config:', config);
// // // // // // // //       console.log('👤 Auth state:', { 
// // // // // // // //         isAuthenticated, 
// // // // // // // //         isLoading, 
// // // // // // // //         userRole: user?.role,
// // // // // // // //         userId: user?.user_id 
// // // // // // // //       });
      
// // // // // // // //       document.title = config.title;
      
// // // // // // // //       let viewport = document.querySelector('meta[name="viewport"]');
// // // // // // // //       if (!viewport) {
// // // // // // // //         viewport = document.createElement('meta');
// // // // // // // //         viewport.setAttribute('name', 'viewport');
// // // // // // // //         viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes');
// // // // // // // //         document.head.appendChild(viewport);
// // // // // // // //       }
      
// // // // // // // //     } catch (error) {
// // // // // // // //       console.error('🔥 App initialization error:', error);
// // // // // // // //     }
// // // // // // // //   }, [isAuthenticated, isLoading, user]);

// // // // // // // //   // ═══════════════════════════════════════════════════════════════════════════
// // // // // // // //   // ✅ WORKER ROUTE PROTECTION
// // // // // // // //   // ═══════════════════════════════════════════════════════════════════════════

// // // // // // // //   useEffect(() => {
// // // // // // // //     if (isAuthenticated && user?.role === 'worker') {
// // // // // // // //       const currentPath = window.location.pathname;
// // // // // // // //       const allowedPaths = ['/scan', '/tile/', '/3d-view/', '/room-select/'];
// // // // // // // //       const isAllowedPath = allowedPaths.some(path => currentPath.startsWith(path));
      
// // // // // // // //       if (!isAllowedPath && currentPath !== '/') {
// // // // // // // //         console.log('🔒 Worker blocked from:', currentPath);
// // // // // // // //         window.location.replace('/scan');
// // // // // // // //       }
// // // // // // // //     }
// // // // // // // //   }, [isAuthenticated, user]);

// // // // // // // //   // ═══════════════════════════════════════════════════════════════════════════
// // // // // // // //   // ✅ PAYMENT HANDLERS
// // // // // // // //   // ═══════════════════════════════════════════════════════════════════════════

// // // // // // // //   const handlePlanSelection = async (planId: string) => {
// // // // // // // //     try {
// // // // // // // //       console.log('📦 Selected plan:', planId);
      
// // // // // // // //       if (!isAuthenticated) {
// // // // // // // //         console.log('🔐 User not authenticated, showing login modal...');
// // // // // // // //         setShowPlansModal(false);
// // // // // // // //         setShowAuthModal(true);
// // // // // // // //         return;
// // // // // // // //       }

// // // // // // // //       console.log('📋 Fetching plan details...');
// // // // // // // //       const plan = await getPlanById(planId);
      
// // // // // // // //       if (!plan) {
// // // // // // // //         alert('❌ Plan not found. Please try again.');
// // // // // // // //         return;
// // // // // // // //       }

// // // // // // // //       setSelectedPlan(plan);
// // // // // // // //       setShowPlansModal(false);
// // // // // // // //       setShowPaymentConfirmation(true);
      
// // // // // // // //     } catch (error: any) {
// // // // // // // //       console.error('❌ Error selecting plan:', error);
// // // // // // // //       alert(`❌ Error: ${error.message}`);
// // // // // // // //     }
// // // // // // // //   };

// // // // // // // //   const handlePaymentConfirm = async () => {
// // // // // // // //     if (!selectedPlan) {
// // // // // // // //       alert('❌ No plan selected');
// // // // // // // //       return;
// // // // // // // //     }

// // // // // // // //     setProcessingPayment(true);

// // // // // // // //     try {
// // // // // // // //       console.log('💳 Initiating payment for plan:', selectedPlan.plan_name);

// // // // // // // //       const currentUser = auth.currentUser;
// // // // // // // //       if (!currentUser) {
// // // // // // // //         throw new Error('Please login first');
// // // // // // // //       }

// // // // // // // //       const result = await initiatePayment(
// // // // // // // //         selectedPlan.id,
// // // // // // // //         selectedPlan.plan_name,
// // // // // // // //         selectedPlan.price
// // // // // // // //       );

// // // // // // // //       if (!result.success || !result.checkoutOptions || !result.paymentId) {
// // // // // // // //         throw new Error(result.error || 'Failed to initiate payment');
// // // // // // // //       }

// // // // // // // //       console.log('✅ Payment initiated successfully');
// // // // // // // //       console.log('📝 Payment ID:', result.paymentId);

// // // // // // // //       setCheckoutOptions(result.checkoutOptions);
// // // // // // // //       setPaymentId(result.paymentId);
// // // // // // // //       setShowPaymentConfirmation(false);

// // // // // // // //     } catch (error: any) {
// // // // // // // //       console.error('❌ Payment initiation error:', error);
// // // // // // // //       alert(`❌ Payment Error:\n${error.message}`);
// // // // // // // //       setProcessingPayment(false);
// // // // // // // //     }
// // // // // // // //   };

// // // // // // // //   const handlePaymentError = (error: string) => {
// // // // // // // //     console.error('❌ Payment checkout error:', error);
// // // // // // // //     alert(`❌ Payment Error:\n${error}`);
    
// // // // // // // //     setCheckoutOptions(null);
// // // // // // // //     setPaymentId(null);
// // // // // // // //     setProcessingPayment(false);
// // // // // // // //     setSelectedPlan(null);
// // // // // // // //   };

// // // // // // // //   // ═══════════════════════════════════════════════════════════════════════════
// // // // // // // //   // ✅ ERROR DISPLAY
// // // // // // // //   // ═══════════════════════════════════════════════════════════════════════════

// // // // // // // //   const renderError = () => {
// // // // // // // //     if (!error) return null;
    
// // // // // // // //     return (
// // // // // // // //       <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 animate-shake">
// // // // // // // //         <div className="flex items-start gap-3">
// // // // // // // //           <div className="text-red-500 text-xl flex-shrink-0">⚠️</div>
// // // // // // // //           <div className="flex-1">
// // // // // // // //             <h3 className="font-semibold text-red-800 text-base mb-1">
// // // // // // // //               Authentication Error
// // // // // // // //             </h3>
// // // // // // // //             <p className="text-red-700 text-sm break-words">{error}</p>
// // // // // // // //           </div>
// // // // // // // //           <button
// // // // // // // //             onClick={() => window.location.reload()}
// // // // // // // //             className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-700 transition-colors font-medium flex-shrink-0"
// // // // // // // //           >
// // // // // // // //             Retry
// // // // // // // //           </button>
// // // // // // // //         </div>
// // // // // // // //       </div>
// // // // // // // //     );
// // // // // // // //   };

// // // // // // // //   // ═══════════════════════════════════════════════════════════════════════════
// // // // // // // //   // ✅ LOADING STATE
// // // // // // // //   // ═══════════════════════════════════════════════════════════════════════════

// // // // // // // //   const renderLoading = () => (
// // // // // // // //     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
// // // // // // // //       <div className="text-center max-w-md w-full">
// // // // // // // //         <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-6"></div>
// // // // // // // //         <h2 className="text-2xl font-semibold text-gray-800 mb-2">
// // // // // // // //           {domainConfig.title}
// // // // // // // //         </h2>
// // // // // // // //         <p className="text-lg text-gray-600 mb-2">Loading application...</p>
// // // // // // // //         <p className="text-sm text-gray-500">Initializing secure authentication system</p>
        
// // // // // // // //         <div className="mt-6 space-y-2">
// // // // // // // //           <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
// // // // // // // //             <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
// // // // // // // //             <span>Verifying authentication tokens</span>
// // // // // // // //           </div>
// // // // // // // //           <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
// // // // // // // //             <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
// // // // // // // //             <span>Loading user profile</span>
// // // // // // // //           </div>
// // // // // // // //           <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
// // // // // // // //             <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
// // // // // // // //             <span>Applying security policies</span>
// // // // // // // //           </div>
// // // // // // // //         </div>
// // // // // // // //       </div>
// // // // // // // //     </div>
// // // // // // // //   );

// // // // // // // //   // ═══════════════════════════════════════════════════════════════════════════
// // // // // // // //   // ✅ SHOW LOADING IF AUTH IS LOADING
// // // // // // // //   // ═══════════════════════════════════════════════════════════════════════════

// // // // // // // //   if (isLoading) {
// // // // // // // //     return renderLoading();
// // // // // // // //   }

// // // // // // // //   // ═══════════════════════════════════════════════════════════════════════════
// // // // // // // //   // ✅ MAIN RENDER
// // // // // // // //   // ═══════════════════════════════════════════════════════════════════════════

// // // // // // // //   return (
// // // // // // // //     <div className="flex flex-col min-h-screen bg-white from-blue-50 via-indigo-50 to-purple-50">
// // // // // // // //       {/* Global Styles */}
// // // // // // // //       <GlobalStyles />
      
// // // // // // // //       {/* Toast Notifications */}
// // // // // // // //       <Toaster 
// // // // // // // //         position="top-right"
// // // // // // // //         reverseOrder={false}
// // // // // // // //         gutter={8}
// // // // // // // //         toastOptions={{
// // // // // // // //           duration: 5000,
// // // // // // // //           style: {
// // // // // // // //             background: '#fff',
// // // // // // // //             color: '#363636',
// // // // // // // //             fontSize: '14px',
// // // // // // // //             padding: '12px 16px',
// // // // // // // //             borderRadius: '10px',
// // // // // // // //             boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
// // // // // // // //             maxWidth: '500px',
// // // // // // // //           },
// // // // // // // //           success: {
// // // // // // // //             duration: 4000,
// // // // // // // //             iconTheme: {
// // // // // // // //               primary: '#10B981',
// // // // // // // //               secondary: '#fff',
// // // // // // // //             },
// // // // // // // //           },
// // // // // // // //           error: {
// // // // // // // //             duration: 6000,
// // // // // // // //             iconTheme: {
// // // // // // // //               primary: '#EF4444',
// // // // // // // //               secondary: '#fff',
// // // // // // // //             },
// // // // // // // //           },
// // // // // // // //         }}
// // // // // // // //       />

// // // // // // // //       {/* Main Content */}
// // // // // // // //       <div className="flex-1">
// // // // // // // //         <Routes>
// // // // // // // //           {/* QR SCAN ROUTES - PUBLIC ACCESS */}
// // // // // // // //           <Route path="/tile/:tileId" element={<TileDetailsPage />} />
// // // // // // // //           <Route path="/room-select/:tileId" element={<RoomSelectorPage />} />
// // // // // // // //           <Route path="/3d-view/:tileId/:roomType" element={<Room3DViewPage />} />
// // // // // // // //           <Route path="/tile/search" element={<TileSearchPage />} />

// // // // // // // //           {/* WORKER SCAN PAGE */}
// // // // // // // //           <Route
// // // // // // // //             path="/scan"
// // // // // // // //             element={
// // // // // // // //               <WorkerProtectedRoute>
// // // // // // // //                 <WorkerErrorBoundary>
// // // // // // // //                   <ScanPage />
// // // // // // // //                 </WorkerErrorBoundary>
// // // // // // // //               </WorkerProtectedRoute>
// // // // // // // //             }
// // // // // // // //           />

// // // // // // // //           {/* SELLER AUTO-LOGIN */}
// // // // // // // //           <Route path="/seller-auto-login" element={<SellerAutoLogin />} />

// // // // // // // //           {/* PAYMENT ROUTES */}
// // // // // // // //           <Route path="/payment-success" element={<PaymentSuccess />} />
// // // // // // // //           <Route path="/payment-failure" element={<PaymentFailure />} />
// // // // // // // //           <Route 
// // // // // // // //             path="/payment-cancelled" 
// // // // // // // //             element={
// // // // // // // //               <Navigate 
// // // // // // // //                 to="/payment-failure?error=Payment cancelled by user" 
// // // // // // // //                 replace 
// // // // // // // //               />
// // // // // // // //             } 
// // // // // // // //           />

// // // // // // // //           {/* ADMIN DASHBOARD */}
// // // // // // // //           <Route
// // // // // // // //             path="/admin/*"
// // // // // // // //             element={
// // // // // // // //               <AdminProtectedRoute>
// // // // // // // //                 <DomainHeader />
// // // // // // // //                 <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
// // // // // // // //                   {renderError()}
// // // // // // // //                   <AdminDashboard />
// // // // // // // //                 </main>
// // // // // // // //               </AdminProtectedRoute>
// // // // // // // //             }
// // // // // // // //           />

// // // // // // // //           {/* SELLER DASHBOARD */}
// // // // // // // //           <Route
// // // // // // // //             path="/seller/*"
// // // // // // // //             element={
// // // // // // // //               <SellerProtectedRoute>
// // // // // // // //                 <DomainHeader />
// // // // // // // //                 <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
// // // // // // // //                   {renderError()}
// // // // // // // //                   <SellerDashboard />
// // // // // // // //                 </main>
// // // // // // // //               </SellerProtectedRoute>
// // // // // // // //             }
// // // // // // // //           />

// // // // // // // //           {/* PUBLIC/CUSTOMER ROUTES */}
// // // // // // // //           <Route
// // // // // // // //             path="/*"
// // // // // // // //             element={
// // // // // // // //               <ProtectedRoute allowUnauthenticated={true}>
// // // // // // // //                 {/* Hero Section with Navigation */}
// // // // // // // //                 <div className="relative w-full bg-gradient-to-br from-white via-blue-50/30 to-purple-50/20 overflow-hidden">
// // // // // // // //                   <Navigation 
// // // // // // // //                     onLoginClick={() => setShowAuthModal(true)}
// // // // // // // //                     onDemoClick={() => setShowAuthModal(true)}
// // // // // // // //                   />
// // // // // // // //                   <HeroSection 
// // // // // // // //                     onDemoClick={() => setShowAuthModal(true)}
// // // // // // // //                   />
// // // // // // // //                 </div>

// // // // // // // //                 {/* Main Content */}
// // // // // // // //                 <main className="w-full">
// // // // // // // //                   {renderError()}
                  
// // // // // // // //                   <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-16">
// // // // // // // //                     <div className="space-y-8">
// // // // // // // //                       {/* Public Showroom */}
// // // // // // // //                       <PublicShowroom />
                      
// // // // // // // //                       {/* Partner Section */}
// // // // // // // //                       <section className="py-12 lg:py-16 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg">
// // // // // // // //                         <div className="max-w-4xl mx-auto px-6">
// // // // // // // //                           <div className="text-center mb-12">
// // // // // // // //                             <div className="text-5xl mb-4">🤝</div>
// // // // // // // //                             <h2 className="text-3xl font-bold text-gray-800 mb-4">
// // // // // // // //                               Partner With Us
// // // // // // // //                             </h2>
// // // // // // // //                             <p className="text-lg text-gray-600 mb-6">
// // // // // // // //                               Expand your tile business with our cutting-edge 3D visualization platform
// // // // // // // //                             </p>
// // // // // // // //                             <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500">
// // // // // // // //                               <span className="flex items-center">
// // // // // // // //                                 <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
// // // // // // // //                                 3D Showroom
// // // // // // // //                               </span>
// // // // // // // //                               <span className="flex items-center">
// // // // // // // //                                 <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
// // // // // // // //                                 QR Code System
// // // // // // // //                               </span>
// // // // // // // //                               <span className="flex items-center">
// // // // // // // //                                 <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
// // // // // // // //                                 Analytics Dashboard
// // // // // // // //                               </span>
// // // // // // // //                             </div>
// // // // // // // //                           </div>
// // // // // // // //                           <SellerRequestForm />
               
// // // // // // // //                         </div>
// // // // // // // //                       </section>
// // // // // // // //                     </div>
// // // // // // // //                   </div>
// // // // // // // //                 </main>
// // // // // // // //                          <FeatureGuide/>
// // // // // // // //                          <Guide/>
// // // // // // // //                          <Statistics/>
// // // // // // // //                          <Banner/>
// // // // // // // //                          <Footer/>

// // // // // // // //                 {/* Floating QR Button */}
// // // // // // // //                 <FloatingQRButton />
// // // // // // // //               </ProtectedRoute>
// // // // // // // //             }
// // // // // // // //           />

// // // // // // // //           {/* CATCH-ALL REDIRECT */}
// // // // // // // //           <Route path="*" element={<Navigate to="/" replace />} />
// // // // // // // //         </Routes>
// // // // // // // //       </div>


// // // // // // // //       {/* Modals */}
// // // // // // // //       <AuthModal 
// // // // // // // //         isOpen={showAuthModal} 
// // // // // // // //         onClose={() => setShowAuthModal(false)} 
// // // // // // // //       />

// // // // // // // //       <PlansModal
// // // // // // // //         isOpen={showPlansModal}
// // // // // // // //         onClose={() => setShowPlansModal(false)}
// // // // // // // //         isLoggedIn={isAuthenticated}
// // // // // // // //         onSelectPlan={handlePlanSelection}
// // // // // // // //       />

// // // // // // // //       <PaymentConfirmationModal
// // // // // // // //         isOpen={showPaymentConfirmation}
// // // // // // // //         onClose={() => {
// // // // // // // //           setShowPaymentConfirmation(false);
// // // // // // // //           setSelectedPlan(null);
// // // // // // // //         }}
// // // // // // // //         plan={selectedPlan}
// // // // // // // //         onConfirm={handlePaymentConfirm}
// // // // // // // //         isProcessing={processingPayment}
// // // // // // // //       />

// // // // // // // //       {checkoutOptions && paymentId && selectedPlan && (
// // // // // // // //         <PaymentCheckout
// // // // // // // //           checkoutOptions={checkoutOptions}
// // // // // // // //           paymentId={paymentId}
// // // // // // // //           planId={selectedPlan.id}
// // // // // // // //           sellerId={user?.uid || ''}
// // // // // // // //           onError={handlePaymentError}
// // // // // // // //         />
// // // // // // // //       )}
// // // // // // // //     </div>
// // // // // // // //   );
// // // // // // // // }

// // // // // // // // // ═══════════════════════════════════════════════════════════════════════════
// // // // // // // // // ✅ APP WRAPPER WITH ROUTER
// // // // // // // // // ═══════════════════════════════════════════════════════════════════════════

// // // // // // // // function App() {
// // // // // // // //   return (
// // // // // // // //     <ErrorBoundary>
// // // // // // // //       <Router>
// // // // // // // //         <AppContent />
// // // // // // // //       </Router>
// // // // // // // //     </ErrorBoundary>
// // // // // // // //   );
// // // // // // // // }

// // // // // // // // export default App;

// // // // // // // // console.log('✅ App.tsx - PRODUCTION v14.0 FINAL - EXACT DUMMY UI - 30 YEAR EXPERIENCE LEVEL - ALL DEVICES RESPONSIVE'); 
// // // // // // // import React, { useState, useEffect } from 'react';
// // // // // // // import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// // // // // // // import { ProtectedRoute, AdminProtectedRoute, SellerProtectedRoute } from './components/ProtectedRoute';
// // // // // // // import { WorkerProtectedRoute } from './components/WorkerProtectedRoute';
// // // // // // // import { PlansModal } from './components/Payment/PlansModal';
// // // // // // // import { PaymentSuccess } from './components/Payment/PaymentSuccess';
// // // // // // // import { PaymentFailure } from './components/Payment/PaymentFailure';
// // // // // // // import { useAuth } from './hooks/useAuth';
// // // // // // // import { auth } from './lib/firebase';
// // // // // // // import { DomainHeader } from './components/DomainHeader';
// // // // // // // import { SellerDashboard } from './components/SellerDashboard';
// // // // // // // import { AdminDashboard } from './components/AdminDashboard';
// // // // // // // import { PublicShowroom } from './components/PublicShowroom';
// // // // // // // import { SellerRequestForm } from './components/SellerRequestForm';
// // // // // // // import { AuthModal } from './components/Auth/AuthModal';
// // // // // // // import { FloatingQRButton } from './components/FloatingQRButton';
// // // // // // // import { TileDetailsPage } from './components/TileDetailsPage';
// // // // // // // import { RoomSelectorPage } from './components/RoomSelectorPage';
// // // // // // // import { Room3DViewPage } from './components/Room3DViewPage';
// // // // // // // import { TileSearchPage } from './components/TileSearchPage';
// // // // // // // import { ScanPage } from './components/ScanPage';
// // // // // // // import { getCurrentDomainConfig, applyDomainTheme } from './utils/domainUtils';
// // // // // // // import { WorkerErrorBoundary } from './components/WorkerErrorBoundary';
// // // // // // // import { SellerAutoLogin } from './components/SellerAutoLogin';
// // // // // // // import { Toaster } from 'react-hot-toast';
// // // // // // // import { ArrowRight, PlayCircle, RefreshCw, Menu, X } from 'lucide-react';
// // // // // // // import { PaymentConfirmationModal } from './components/Payment/PaymentConfirmationModal';
// // // // // // // import { PaymentCheckout } from './components/Payment/PaymentCheckout';
// // // // // // // import { initiatePayment } from './lib/paymentService';
// // // // // // // import { getPlanById } from './lib/planService';
// // // // // // // import type { Plan } from './types/plan.types';
// // // // // // // import type { RazorpayCheckoutOptions } from './types/payment.types';
// // // // // // // import { FeatureGuide } from './components/Feature';
// // // // // // // import { Guide } from './components/Guide';
// // // // // // // import { Banner } from './components/Banner';
// // // // // // // import { Footer } from './components/Footer';
// // // // // // // import Statistics from './components/Statistics';

// // // // // // // // ═══════════════════════════════════════════════════════════════════════════
// // // // // // // // ✅ GLOBAL STYLES - INTER FONT + SMOOTH ANIMATIONS
// // // // // // // // ═══════════════════════════════════════════════════════════════════════════

// // // // // // // const GlobalStyles = () => (
// // // // // // //   <style dangerouslySetInnerHTML={{__html: `
// // // // // // //     @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
    
// // // // // // //     * {
// // // // // // //       font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
// // // // // // //     }
    
// // // // // // //     html {
// // // // // // //       scroll-behavior: smooth;
// // // // // // //       scroll-padding-top: 100px;
// // // // // // //     }
    
// // // // // // //     @keyframes fadeInUp {
// // // // // // //       from { opacity: 0; transform: translateY(20px); }
// // // // // // //       to { opacity: 1; transform: translateY(0); }
// // // // // // //     }
// // // // // // //     .animate-fade-in-up {
// // // // // // //       animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
// // // // // // //       opacity: 0;
// // // // // // //     }
    
// // // // // // //     @keyframes spin-slow {
// // // // // // //       from { transform: rotate(0deg); }
// // // // // // //       to { transform: rotate(360deg); }
// // // // // // //     }
// // // // // // //     .animate-spin-slow {
// // // // // // //       animation: spin-slow 4s linear infinite;
// // // // // // //     }
    
// // // // // // //     @keyframes slideDownMenu {
// // // // // // //       from { opacity: 0; transform: translateY(-15px); }
// // // // // // //       to { opacity: 1; transform: translateY(0); }
// // // // // // //     }
// // // // // // //     .animate-slide-down {
// // // // // // //       animation: slideDownMenu 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
// // // // // // //     }

// // // // // // //     @keyframes modalFadeIn {
// // // // // // //       from { opacity: 0; transform: scale(0.95); }
// // // // // // //       to { opacity: 1; transform: scale(1); }
// // // // // // //     }
// // // // // // //     .animate-modal-in {
// // // // // // //       animation: modalFadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
// // // // // // //     }

// // // // // // //     ::-webkit-scrollbar {
// // // // // // //       width: 10px;
// // // // // // //       height: 10px;
// // // // // // //     }
// // // // // // //     ::-webkit-scrollbar-track {
// // // // // // //       background: #f1f1f1;
// // // // // // //     }
// // // // // // //     ::-webkit-scrollbar-thumb {
// // // // // // //       background: #888;
// // // // // // //       border-radius: 5px;
// // // // // // //     }
// // // // // // //     ::-webkit-scrollbar-thumb:hover {
// // // // // // //       background: #555;
// // // // // // //     }
// // // // // // //   `}} />
// // // // // // // );

// // // // // // // // ═══════════════════════════════════════════════════════════════════════════
// // // // // // // // ✅ ERROR BOUNDARY - PROFESSIONAL ERROR HANDLING
// // // // // // // // ═══════════════════════════════════════════════════════════════════════════

// // // // // // // class ErrorBoundary extends React.Component<
// // // // // // //   { children: React.ReactNode },
// // // // // // //   { hasError: boolean; error?: Error }
// // // // // // // > {
// // // // // // //   constructor(props: { children: React.ReactNode }) {
// // // // // // //     super(props);
// // // // // // //     this.state = { hasError: false };
// // // // // // //   }

// // // // // // //   static getDerivedStateFromError(error: Error) {
// // // // // // //     return { hasError: true, error };
// // // // // // //   }

// // // // // // //   componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
// // // // // // //     console.error('🔥 App Error Boundary:', error, errorInfo);
// // // // // // //   }

// // // // // // //   render() {
// // // // // // //     if (this.state.hasError) {
// // // // // // //       return (
// // // // // // //         <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center p-4">
// // // // // // //           <div className="text-center p-8 bg-white rounded-xl shadow-2xl max-w-md w-full">
// // // // // // //             <div className="text-red-500 text-6xl mb-4">⚠️</div>
// // // // // // //             <h1 className="text-2xl font-bold text-gray-800 mb-4">Something went wrong</h1>
// // // // // // //             <p className="text-gray-600 mb-6">
// // // // // // //               The application encountered an unexpected error. Please refresh the page.
// // // // // // //             </p>
// // // // // // //             {this.state.error && (
// // // // // // //               <details className="mb-6 text-left">
// // // // // // //                 <summary className="text-sm text-gray-500 cursor-pointer hover:text-gray-700">
// // // // // // //                   Error details
// // // // // // //                 </summary>
// // // // // // //                 <pre className="mt-2 p-3 bg-gray-100 rounded text-xs overflow-x-auto">
// // // // // // //                   {this.state.error.message}
// // // // // // //                 </pre>
// // // // // // //               </details>
// // // // // // //             )}
// // // // // // //             <button
// // // // // // //               onClick={() => window.location.reload()}
// // // // // // //               className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors font-semibold shadow-lg"
// // // // // // //             >
// // // // // // //               Refresh Page
// // // // // // //             </button>
// // // // // // //           </div>
// // // // // // //         </div>
// // // // // // //       );
// // // // // // //     }

// // // // // // //     return this.props.children;
// // // // // // //   }
// // // // // // // }

// // // // // // // // ═══════════════════════════════════════════════════════════════════════════
// // // // // // // // ✅ NAVIGATION COMPONENT - UPDATED WITH BECOME A SELLER
// // // // // // // // ═══════════════════════════════════════════════════════════════════════════

// // // // // // // interface NavigationProps {
// // // // // // //   onLoginClick: () => void;
// // // // // // //   onBecomeSellerClick: () => void;
// // // // // // // }

// // // // // // // const Navigation: React.FC<NavigationProps> = ({ onLoginClick, onBecomeSellerClick }) => {
// // // // // // //   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

// // // // // // //   useEffect(() => {
// // // // // // //     if (mobileMenuOpen) {
// // // // // // //       document.body.style.overflow = 'hidden';
// // // // // // //     } else {
// // // // // // //       document.body.style.overflow = 'unset';
// // // // // // //     }
// // // // // // //     return () => { document.body.style.overflow = 'unset'; };
// // // // // // //   }, [mobileMenuOpen]);

// // // // // // //   return (
// // // // // // //     <nav className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6 lg:py-8 flex items-center justify-between relative z-40">
// // // // // // //       {/* Logo */}
// // // // // // //       <div className="flex items-center gap-3 cursor-pointer">
// // // // // // //         <div className="relative w-6 h-6 lg:w-8 lg:h-8 flex items-center justify-center flex-shrink-0">
// // // // // // //           <div className="absolute top-0 left-0 w-3.5 h-3.5 lg:w-4 lg:h-4 bg-indigo-300 rounded-[3px]"></div>
// // // // // // //           <div className="absolute bottom-0 right-0 w-3.5 h-3.5 lg:w-4 lg:h-4 bg-[#0B40E8] rounded-[3px] mix-blend-multiply"></div>
// // // // // // //         </div>
// // // // // // //         <span className="font-bold text-[20px] sm:text-[22px] lg:text-[26px] tracking-tight text-gray-900">
// // // // // // //           Tilesview360
// // // // // // //         </span>
// // // // // // //       </div>

// // // // // // //       {/* Desktop Navigation Links */}
// // // // // // //       <div className="hidden lg:flex items-center gap-10 xl:gap-14">
// // // // // // //         <a href="#product" className="text-gray-900 text-[15px] lg:text-[18px] font-semibold relative after:content-[''] after:absolute after:left-0 after:-bottom-1.5 after:w-full after:h-0.5 after:bg-[#0B40E8] hover:text-gray-700 transition-colors">Product</a>
// // // // // // //         <a href="#features" className="text-gray-600 text-[15px] lg:text-[18px] font-medium hover:text-gray-900 transition-colors duration-200">Features</a>
// // // // // // //         <a href="#pricing" className="text-gray-600 text-[15px] lg:text-[18px] font-medium hover:text-gray-900 transition-colors duration-200">Pricing</a>
// // // // // // //         <a href="#showcase" className="text-gray-600 text-[15px] lg:text-[18px] font-medium hover:text-gray-900 transition-colors duration-200">Showcase</a>
// // // // // // //       </div>

// // // // // // //       {/* Desktop Right Actions */}
// // // // // // //       <div className="hidden lg:flex items-center gap-8 xl:gap-10">
// // // // // // //         <button 
// // // // // // //           onClick={onLoginClick} 
// // // // // // //           className="text-gray-700 text-[15px] lg:text-[18px] font-bold hover:text-gray-900 transition-colors duration-200"
// // // // // // //         >
// // // // // // //           Login
// // // // // // //         </button>
// // // // // // //         <button 
// // // // // // //           onClick={onBecomeSellerClick} 
// // // // // // //           className="bg-[#0B40E8] text-white text-[15px] lg:text-[18px] px-7 py-3 lg:px-9 lg:py-4 rounded-full font-semibold hover:bg-blue-700 transition-all duration-200 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40"
// // // // // // //         >
// // // // // // //           Become A Seller
// // // // // // //         </button>
// // // // // // //       </div>

// // // // // // //       {/* Mobile Menu Button */}
// // // // // // //       <button
// // // // // // //         onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
// // // // // // //         className="lg:hidden relative z-[70] p-2 bg-gray-50 hover:bg-gray-100 rounded-full text-gray-800 transition-colors shadow-sm"
// // // // // // //         aria-label="Toggle menu"
// // // // // // //       >
// // // // // // //         {mobileMenuOpen ? (
// // // // // // //           <X className="w-6 h-6 stroke-[2.5px]" />
// // // // // // //         ) : (
// // // // // // //           <Menu className="w-6 h-6 stroke-[2.5px]" />
// // // // // // //         )}
// // // // // // //       </button>

// // // // // // //       {/* Mobile Menu Overlay */}
// // // // // // //       {mobileMenuOpen && (
// // // // // // //         <>
// // // // // // //           <div 
// // // // // // //             className="lg:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-[50] animate-fade-in-up"
// // // // // // //             style={{ animationDuration: '0.3s' }}
// // // // // // //             onClick={() => setMobileMenuOpen(false)}
// // // // // // //           />
// // // // // // //           <div className="lg:hidden fixed top-0 left-0 right-0 pt-[88px] pb-6 px-6 bg-white border-b border-gray-200 shadow-2xl z-[60] animate-slide-down rounded-b-[2rem]">
// // // // // // //             <div className="max-w-md mx-auto space-y-6">
// // // // // // //               {/* Mobile Links */}
// // // // // // //               <div className="space-y-2">
// // // // // // //                 <a href="#product" onClick={() => setMobileMenuOpen(false)} className="block text-gray-900 text-[16px] font-semibold p-3 bg-gray-50 rounded-xl hover:bg-blue-50 hover:text-[#0B40E8] transition-colors">Product</a>
// // // // // // //                 <a href="#features" onClick={() => setMobileMenuOpen(false)} className="block text-gray-600 text-[16px] font-medium p-3 hover:bg-gray-50 rounded-xl transition-colors">Features</a>
// // // // // // //                 <a href="#pricing" onClick={() => setMobileMenuOpen(false)} className="block text-gray-600 text-[16px] font-medium p-3 hover:bg-gray-50 rounded-xl transition-colors">Pricing</a>
// // // // // // //                 <a href="#showcase" onClick={() => setMobileMenuOpen(false)} className="block text-gray-600 text-[16px] font-medium p-3 hover:bg-gray-50 rounded-xl transition-colors">Showcase</a>
// // // // // // //               </div>
              
// // // // // // //               {/* Mobile Actions */}
// // // // // // //               <div className="pt-4 border-t border-gray-100 space-y-3">
// // // // // // //                 <button
// // // // // // //                   onClick={() => { setMobileMenuOpen(false); onLoginClick(); }}
// // // // // // //                   className="w-full text-gray-700 text-[16px] font-bold py-3 px-6 rounded-xl border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all"
// // // // // // //                 >
// // // // // // //                   Login
// // // // // // //                 </button>
// // // // // // //                 <button
// // // // // // //                   onClick={() => { setMobileMenuOpen(false); onBecomeSellerClick(); }}
// // // // // // //                   className="w-full bg-[#0B40E8] text-white text-[16px] py-3 px-6 rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/30"
// // // // // // //                 >
// // // // // // //                   Become A Seller
// // // // // // //                 </button>
// // // // // // //               </div>
// // // // // // //             </div>
// // // // // // //           </div>
// // // // // // //         </>
// // // // // // //       )}
// // // // // // //     </nav>
// // // // // // //   );
// // // // // // // };

// // // // // // // // ═══════════════════════════════════════════════════════════════════════════
// // // // // // // // ✅ HERO SECTION - REQUEST DEMO BUTTON DECORATIVE ONLY
// // // // // // // // ═══════════════════════════════════════════════════════════════════════════

// // // // // // // const HeroSection: React.FC = () => {
// // // // // // //   return (
// // // // // // //     <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-24 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 xl:gap-24 items-center">
      
// // // // // // //       {/* LEFT COLUMN */}
// // // // // // //       <div className="space-y-6 sm:space-y-8 lg:space-y-10 order-2 lg:order-1">
        
// // // // // // //         {/* Heading */}
// // // // // // //         <h1 className="text-[40px] sm:text-[48px] lg:text-[64px] xl:text-[72px] leading-[1.1] font-extrabold tracking-tight text-gray-900">
// // // // // // //           See Tiles Before<br />
// // // // // // //           <span className="text-[#0B40E8]">Customers Buy</span>
// // // // // // //         </h1>

// // // // // // //         {/* Description */}
// // // // // // //         <p className="text-gray-500 text-[15px] sm:text-[16px] lg:text-[20px] xl:text-[22px] leading-relaxed pr-0 lg:pr-8">
// // // // // // //           Transform your showroom with AI-powered 3D tile visualization. Let customers preview any material in their actual living spaces with photorealistic precision.
// // // // // // //         </p>

// // // // // // //         {/* CTA Buttons - Request Demo is DECORATIVE ONLY */}
// // // // // // //         <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 lg:gap-6">
// // // // // // //           <button 
// // // // // // //             className="w-full sm:w-auto bg-[#0B40E8] text-white text-[15px] lg:text-[18px] px-8 py-4 lg:px-10 lg:py-5 rounded-full font-semibold flex items-center justify-center gap-2 shadow-xl shadow-blue-600/20 cursor-default opacity-90"
// // // // // // //             disabled
// // // // // // //           >
// // // // // // //             Request Demo
// // // // // // //             <ArrowRight className="w-5 h-5 lg:w-6 lg:h-6" />
// // // // // // //           </button>
          
// // // // // // //           <button 
// // // // // // //             onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })}
// // // // // // //             className="w-full sm:w-auto bg-white text-gray-900 text-[15px] lg:text-[18px] px-8 py-4 lg:px-10 lg:py-5 rounded-full font-semibold flex items-center justify-center gap-3 hover:bg-gray-50 transition-all duration-200 shadow-sm border border-gray-100 hover:border-gray-200"
// // // // // // //           >
// // // // // // //             <PlayCircle className="w-5 h-5 lg:w-6 lg:h-6 text-gray-700" />
// // // // // // //             Watch Live Preview
// // // // // // //           </button>
// // // // // // //         </div>
// // // // // // //       </div>

// // // // // // //       {/* RIGHT COLUMN - VISUAL GALLERY */}
// // // // // // //       <div className="relative w-full h-[400px] sm:h-[500px] lg:h-[700px] xl:h-[750px] order-1 lg:order-2">
        
// // // // // // //         {/* Main Background Image */}
// // // // // // //         <div className="absolute inset-y-8 sm:inset-y-12 lg:inset-y-0 inset-x-4 sm:inset-x-8 lg:inset-x-12 rounded-[2rem] lg:rounded-[3rem] overflow-hidden shadow-2xl z-0">
// // // // // // //           <img 
// // // // // // //             src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
// // // // // // //             alt="Modern living room interior" 
// // // // // // //             className="w-full h-full object-cover object-center scale-105"
// // // // // // //             loading="eager"
// // // // // // //           />
// // // // // // //           <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent"></div>
// // // // // // //         </div>

// // // // // // //         {/* Floating Card 1: Top Right */}
// // // // // // //         <div 
// // // // // // //           className="absolute top-0 right-0 lg:-right-8 xl:-right-12 bg-white/70 backdrop-blur-xl p-3 lg:p-4 pb-4 lg:pb-5 rounded-[1.5rem] lg:rounded-[2rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] z-20 border border-white/50 w-[180px] sm:w-[220px] lg:w-[280px] xl:w-[320px] animate-fade-in-up"
// // // // // // //           style={{ animationDelay: '0ms' }}
// // // // // // //         >
// // // // // // //           <div className="w-full h-[140px] sm:h-[180px] lg:h-[220px] xl:h-[260px] rounded-2xl lg:rounded-3xl overflow-hidden mb-3 lg:mb-4">
// // // // // // //             <img 
// // // // // // //               src="https://images.unsplash.com/photo-1588863673322-2621aef42bf8?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80" 
// // // // // // //               alt="Venetian Blue Tile" 
// // // // // // //               className="w-full h-full object-cover"
// // // // // // //               loading="lazy"
// // // // // // //             />
// // // // // // //           </div>
// // // // // // //           <div className="px-2 lg:px-3">
// // // // // // //             <h3 className="font-bold text-gray-900 text-[15px] lg:text-[18px] xl:text-[20px] leading-tight">Venetian Blue</h3>
// // // // // // //             <p className="text-[#0B40E8] text-xs lg:text-sm xl:text-base font-semibold mt-1">Living Room</p>
// // // // // // //           </div>
// // // // // // //         </div>

// // // // // // //         {/* Floating Card 2: AI Scan */}
// // // // // // //         <div 
// // // // // // //           className="absolute top-[45%] lg:top-[50%] left-0 lg:-left-16 xl:-left-20 -translate-y-1/2 bg-white/80 backdrop-blur-xl p-3 sm:p-4 lg:p-5 pr-6 sm:pr-10 lg:pr-12 rounded-[1.25rem] lg:rounded-[2rem] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.15)] z-30 border border-white/60 flex items-center gap-3 sm:gap-4 lg:gap-5 animate-fade-in-up max-w-[90%] sm:max-w-none" 
// // // // // // //           style={{ animationDelay: '150ms' }}
// // // // // // //         >
// // // // // // //           <div className="bg-[#0B40E8] w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 xl:w-20 xl:h-20 rounded-full flex items-center justify-center text-white shadow-lg shadow-blue-500/30 flex-shrink-0">
// // // // // // //             <RefreshCw className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 xl:w-10 xl:h-10 animate-spin-slow" />
// // // // // // //           </div>
// // // // // // //           <div className="min-w-0">
// // // // // // //             <h3 className="font-bold text-gray-900 text-sm lg:text-lg xl:text-xl">AI 3D Scan Active</h3>
// // // // // // //             <p className="text-gray-500 text-xs lg:text-sm xl:text-base mt-1 truncate">Calibrating surface textures...</p>
// // // // // // //           </div>
// // // // // // //         </div>

// // // // // // //         {/* Floating Card 3: Bottom Left */}
// // // // // // //         <div 
// // // // // // //           className="absolute bottom-4 lg:bottom-12 left-4 lg:left-0 xl:-left-8 bg-white/90 backdrop-blur-md p-3 lg:p-4 pb-4 lg:pb-5 rounded-[1.5rem] lg:rounded-[2rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.2)] z-20 border border-white w-[160px] sm:w-[200px] lg:w-[260px] xl:w-[300px] animate-fade-in-up" 
// // // // // // //           style={{ animationDelay: '300ms' }}
// // // // // // //         >
// // // // // // //           <div className="w-full h-[120px] sm:h-[160px] lg:h-[200px] xl:h-[240px] rounded-2xl lg:rounded-3xl overflow-hidden mb-3 lg:mb-4 relative group">
// // // // // // //             <img 
// // // // // // //               src="https://images.unsplash.com/photo-1620626011761-996317b8d101?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80" 
// // // // // // //               alt="Noir Slate Bathroom" 
// // // // // // //               className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
// // // // // // //               loading="lazy"
// // // // // // //             />
// // // // // // //             <div className="absolute inset-0 bg-black/10"></div>
// // // // // // //           </div>
// // // // // // //           <div className="px-2 lg:px-3">
// // // // // // //             <h3 className="font-bold text-gray-900 text-[15px] lg:text-[18px] xl:text-[20px] leading-tight">Noir Slate</h3>
// // // // // // //             <p className="text-[#0B40E8] text-xs lg:text-sm xl:text-base font-semibold mt-1">Master Bath</p>
// // // // // // //           </div>
// // // // // // //         </div>
// // // // // // //       </div>
// // // // // // //     </main>
// // // // // // //   );
// // // // // // // };

// // // // // // // // ═══════════════════════════════════════════════════════════════════════════
// // // // // // // // ✅ SELLER REQUEST FORM MODAL - NEW COMPONENT
// // // // // // // // ═══════════════════════════════════════════════════════════════════════════

// // // // // // // interface SellerRequestModalProps {
// // // // // // //   isOpen: boolean;
// // // // // // //   onClose: () => void;
// // // // // // // }

// // // // // // // const SellerRequestModal: React.FC<SellerRequestModalProps> = ({ isOpen, onClose }) => {
// // // // // // //   useEffect(() => {
// // // // // // //     if (isOpen) {
// // // // // // //       document.body.style.overflow = 'hidden';
// // // // // // //     } else {
// // // // // // //       document.body.style.overflow = 'unset';
// // // // // // //     }
// // // // // // //     return () => { document.body.style.overflow = 'unset'; };
// // // // // // //   }, [isOpen]);

// // // // // // //   if (!isOpen) return null;

// // // // // // //   return (
// // // // // // //     <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in-up">
// // // // // // //       <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-modal-in">
// // // // // // //         {/* Header */}
// // // // // // //         <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
// // // // // // //           <div>
// // // // // // //             <h2 className="text-2xl font-bold text-gray-900">Become A Seller</h2>
// // // // // // //             <p className="text-sm text-gray-600 mt-1">Join our platform and grow your tile business</p>
// // // // // // //           </div>
// // // // // // //           <button
// // // // // // //             onClick={onClose}
// // // // // // //             className="p-2 hover:bg-gray-100 rounded-full transition-colors"
// // // // // // //             aria-label="Close"
// // // // // // //           >
// // // // // // //             <X className="w-6 h-6 text-gray-600" />
// // // // // // //           </button>
// // // // // // //         </div>

// // // // // // //         {/* Form Content */}
// // // // // // //         <div className="p-6">
// // // // // // //           <SellerRequestForm onSuccess={onClose} />
// // // // // // //         </div>
// // // // // // //       </div>
// // // // // // //     </div>
// // // // // // //   );
// // // // // // // };

// // // // // // // // ═══════════════════════════════════════════════════════════════════════════
// // // // // // // // ✅ MAIN APP CONTENT COMPONENT
// // // // // // // // ═══════════════════════════════════════════════════════════════════════════

// // // // // // // function AppContent() {
// // // // // // //   const { isAuthenticated, isLoading, user, error } = useAuth({
// // // // // // //     enableActivityTracking: false,
// // // // // // //     enableSessionWarnings: false,
// // // // // // //     autoLogoutDelay: 0
// // // // // // //   });
  
// // // // // // //   const [showAuthModal, setShowAuthModal] = useState(false);
// // // // // // //   const [showPlansModal, setShowPlansModal] = useState(false);
// // // // // // //   const [showSellerRequestModal, setShowSellerRequestModal] = useState(false);
// // // // // // //   const [domainConfig, setDomainConfig] = useState(getCurrentDomainConfig());
// // // // // // //   const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
// // // // // // //   const [showPaymentConfirmation, setShowPaymentConfirmation] = useState(false);
// // // // // // //   const [checkoutOptions, setCheckoutOptions] = useState<RazorpayCheckoutOptions | null>(null);
// // // // // // //   const [paymentId, setPaymentId] = useState<string | null>(null);
// // // // // // //   const [processingPayment, setProcessingPayment] = useState(false);

// // // // // // //   // ═══════════════════════════════════════════════════════════════════════════
// // // // // // //   // ✅ APP INITIALIZATION
// // // // // // //   // ═══════════════════════════════════════════════════════════════════════════

// // // // // // //   useEffect(() => {
// // // // // // //     try {
// // // // // // //       console.log('🚀 Tile Showroom App initializing...');
      
// // // // // // //       const config = getCurrentDomainConfig();
// // // // // // //       setDomainConfig(config);
// // // // // // //       applyDomainTheme(config);
      
// // // // // // //       console.log('🎯 Domain config:', config);
// // // // // // //       console.log('👤 Auth state:', { 
// // // // // // //         isAuthenticated, 
// // // // // // //         isLoading, 
// // // // // // //         userRole: user?.role,
// // // // // // //         userId: user?.user_id 
// // // // // // //       });
      
// // // // // // //       document.title = config.title;
      
// // // // // // //       let viewport = document.querySelector('meta[name="viewport"]');
// // // // // // //       if (!viewport) {
// // // // // // //         viewport = document.createElement('meta');
// // // // // // //         viewport.setAttribute('name', 'viewport');
// // // // // // //         viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes');
// // // // // // //         document.head.appendChild(viewport);
// // // // // // //       }
      
// // // // // // //     } catch (error) {
// // // // // // //       console.error('🔥 App initialization error:', error);
// // // // // // //     }
// // // // // // //   }, [isAuthenticated, isLoading, user]);

// // // // // // //   // ═══════════════════════════════════════════════════════════════════════════
// // // // // // //   // ✅ WORKER ROUTE PROTECTION
// // // // // // //   // ═══════════════════════════════════════════════════════════════════════════

// // // // // // //   useEffect(() => {
// // // // // // //     if (isAuthenticated && user?.role === 'worker') {
// // // // // // //       const currentPath = window.location.pathname;
// // // // // // //       const allowedPaths = ['/scan', '/tile/', '/3d-view/', '/room-select/'];
// // // // // // //       const isAllowedPath = allowedPaths.some(path => currentPath.startsWith(path));
      
// // // // // // //       if (!isAllowedPath && currentPath !== '/') {
// // // // // // //         console.log('🔒 Worker blocked from:', currentPath);
// // // // // // //         window.location.replace('/scan');
// // // // // // //       }
// // // // // // //     }
// // // // // // //   }, [isAuthenticated, user]);

// // // // // // //   // ═══════════════════════════════════════════════════════════════════════════
// // // // // // //   // ✅ PAYMENT HANDLERS
// // // // // // //   // ═══════════════════════════════════════════════════════════════════════════

// // // // // // //   const handlePlanSelection = async (planId: string) => {
// // // // // // //     try {
// // // // // // //       console.log('📦 Selected plan:', planId);
      
// // // // // // //       if (!isAuthenticated) {
// // // // // // //         console.log('🔐 User not authenticated, showing login modal...');
// // // // // // //         setShowPlansModal(false);
// // // // // // //         setShowAuthModal(true);
// // // // // // //         return;
// // // // // // //       }

// // // // // // //       console.log('📋 Fetching plan details...');
// // // // // // //       const plan = await getPlanById(planId);
      
// // // // // // //       if (!plan) {
// // // // // // //         alert('❌ Plan not found. Please try again.');
// // // // // // //         return;
// // // // // // //       }

// // // // // // //       setSelectedPlan(plan);
// // // // // // //       setShowPlansModal(false);
// // // // // // //       setShowPaymentConfirmation(true);
      
// // // // // // //     } catch (error: any) {
// // // // // // //       console.error('❌ Error selecting plan:', error);
// // // // // // //       alert(`❌ Error: ${error.message}`);
// // // // // // //     }
// // // // // // //   };

// // // // // // //   const handlePaymentConfirm = async () => {
// // // // // // //     if (!selectedPlan) {
// // // // // // //       alert('❌ No plan selected');
// // // // // // //       return;
// // // // // // //     }

// // // // // // //     setProcessingPayment(true);

// // // // // // //     try {
// // // // // // //       console.log('💳 Initiating payment for plan:', selectedPlan.plan_name);

// // // // // // //       const currentUser = auth.currentUser;
// // // // // // //       if (!currentUser) {
// // // // // // //         throw new Error('Please login first');
// // // // // // //       }

// // // // // // //       const result = await initiatePayment(
// // // // // // //         selectedPlan.id,
// // // // // // //         selectedPlan.plan_name,
// // // // // // //         selectedPlan.price
// // // // // // //       );

// // // // // // //       if (!result.success || !result.checkoutOptions || !result.paymentId) {
// // // // // // //         throw new Error(result.error || 'Failed to initiate payment');
// // // // // // //       }

// // // // // // //       console.log('✅ Payment initiated successfully');
// // // // // // //       console.log('📝 Payment ID:', result.paymentId);

// // // // // // //       setCheckoutOptions(result.checkoutOptions);
// // // // // // //       setPaymentId(result.paymentId);
// // // // // // //       setShowPaymentConfirmation(false);

// // // // // // //     } catch (error: any) {
// // // // // // //       console.error('❌ Payment initiation error:', error);
// // // // // // //       alert(`❌ Payment Error:\n${error.message}`);
// // // // // // //       setProcessingPayment(false);
// // // // // // //     }
// // // // // // //   };

// // // // // // //   const handlePaymentError = (error: string) => {
// // // // // // //     console.error('❌ Payment checkout error:', error);
// // // // // // //     alert(`❌ Payment Error:\n${error}`);
    
// // // // // // //     setCheckoutOptions(null);
// // // // // // //     setPaymentId(null);
// // // // // // //     setProcessingPayment(false);
// // // // // // //     setSelectedPlan(null);
// // // // // // //   };

// // // // // // //   // ═══════════════════════════════════════════════════════════════════════════
// // // // // // //   // ✅ ERROR DISPLAY
// // // // // // //   // ═══════════════════════════════════════════════════════════════════════════

// // // // // // //   const renderError = () => {
// // // // // // //     if (!error) return null;
    
// // // // // // //     return (
// // // // // // //       <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 animate-shake">
// // // // // // //         <div className="flex items-start gap-3">
// // // // // // //           <div className="text-red-500 text-xl flex-shrink-0">⚠️</div>
// // // // // // //           <div className="flex-1">
// // // // // // //             <h3 className="font-semibold text-red-800 text-base mb-1">
// // // // // // //               Authentication Error
// // // // // // //             </h3>
// // // // // // //             <p className="text-red-700 text-sm break-words">{error}</p>
// // // // // // //           </div>
// // // // // // //           <button
// // // // // // //             onClick={() => window.location.reload()}
// // // // // // //             className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-700 transition-colors font-medium flex-shrink-0"
// // // // // // //           >
// // // // // // //             Retry
// // // // // // //           </button>
// // // // // // //         </div>
// // // // // // //       </div>
// // // // // // //     );
// // // // // // //   };

// // // // // // //   // ═══════════════════════════════════════════════════════════════════════════
// // // // // // //   // ✅ LOADING STATE
// // // // // // //   // ═══════════════════════════════════════════════════════════════════════════

// // // // // // //   const renderLoading = () => (
// // // // // // //     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
// // // // // // //       <div className="text-center max-w-md w-full">
// // // // // // //         <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-6"></div>
// // // // // // //         <h2 className="text-2xl font-semibold text-gray-800 mb-2">
// // // // // // //           {domainConfig.title}
// // // // // // //         </h2>
// // // // // // //         <p className="text-lg text-gray-600 mb-2">Loading application...</p>
// // // // // // //         <p className="text-sm text-gray-500">Initializing secure authentication system</p>
        
// // // // // // //         <div className="mt-6 space-y-2">
// // // // // // //           <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
// // // // // // //             <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
// // // // // // //             <span>Verifying authentication tokens</span>
// // // // // // //           </div>
// // // // // // //           <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
// // // // // // //             <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
// // // // // // //             <span>Loading user profile</span>
// // // // // // //           </div>
// // // // // // //           <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
// // // // // // //             <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
// // // // // // //             <span>Applying security policies</span>
// // // // // // //           </div>
// // // // // // //         </div>
// // // // // // //       </div>
// // // // // // //     </div>
// // // // // // //   );

// // // // // // //   // ═══════════════════════════════════════════════════════════════════════════
// // // // // // //   // ✅ SHOW LOADING IF AUTH IS LOADING
// // // // // // //   // ═══════════════════════════════════════════════════════════════════════════

// // // // // // //   if (isLoading) {
// // // // // // //     return renderLoading();
// // // // // // //   }

// // // // // // //   // ═══════════════════════════════════════════════════════════════════════════
// // // // // // //   // ✅ MAIN RENDER
// // // // // // //   // ═══════════════════════════════════════════════════════════════════════════

// // // // // // //   return (
// // // // // // //     <div className="flex flex-col min-h-screen bg-white">
// // // // // // //       {/* Global Styles */}
// // // // // // //       <GlobalStyles />
      
// // // // // // //       {/* Toast Notifications */}
// // // // // // //       <Toaster 
// // // // // // //         position="top-right"
// // // // // // //         reverseOrder={false}
// // // // // // //         gutter={8}
// // // // // // //         toastOptions={{
// // // // // // //           duration: 5000,
// // // // // // //           style: {
// // // // // // //             background: '#fff',
// // // // // // //             color: '#363636',
// // // // // // //             fontSize: '14px',
// // // // // // //             padding: '12px 16px',
// // // // // // //             borderRadius: '10px',
// // // // // // //             boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
// // // // // // //             maxWidth: '500px',
// // // // // // //           },
// // // // // // //           success: {
// // // // // // //             duration: 4000,
// // // // // // //             iconTheme: {
// // // // // // //               primary: '#10B981',
// // // // // // //               secondary: '#fff',
// // // // // // //             },
// // // // // // //           },
// // // // // // //           error: {
// // // // // // //             duration: 6000,
// // // // // // //             iconTheme: {
// // // // // // //               primary: '#EF4444',
// // // // // // //               secondary: '#fff',
// // // // // // //             },
// // // // // // //           },
// // // // // // //         }}
// // // // // // //       />

// // // // // // //       {/* Main Content */}
// // // // // // //       <div className="flex-1">
// // // // // // //         <Routes>
// // // // // // //           {/* QR SCAN ROUTES - PUBLIC ACCESS */}
// // // // // // //           <Route path="/tile/:tileId" element={<TileDetailsPage />} />
// // // // // // //           <Route path="/room-select/:tileId" element={<RoomSelectorPage />} />
// // // // // // //           <Route path="/3d-view/:tileId/:roomType" element={<Room3DViewPage />} />
// // // // // // //           <Route path="/tile/search" element={<TileSearchPage />} />

// // // // // // //           {/* WORKER SCAN PAGE */}
// // // // // // //           <Route
// // // // // // //             path="/scan"
// // // // // // //             element={
// // // // // // //               <WorkerProtectedRoute>
// // // // // // //                 <WorkerErrorBoundary>
// // // // // // //                   <ScanPage />
// // // // // // //                 </WorkerErrorBoundary>
// // // // // // //               </WorkerProtectedRoute>
// // // // // // //             }
// // // // // // //           />

// // // // // // //           {/* SELLER AUTO-LOGIN */}
// // // // // // //           <Route path="/seller-auto-login" element={<SellerAutoLogin />} />

// // // // // // //           {/* PAYMENT ROUTES */}
// // // // // // //           <Route path="/payment-success" element={<PaymentSuccess />} />
// // // // // // //           <Route path="/payment-failure" element={<PaymentFailure />} />
// // // // // // //           <Route 
// // // // // // //             path="/payment-cancelled" 
// // // // // // //             element={
// // // // // // //               <Navigate 
// // // // // // //                 to="/payment-failure?error=Payment cancelled by user" 
// // // // // // //                 replace 
// // // // // // //               />
// // // // // // //             } 
// // // // // // //           />

// // // // // // //           {/* ADMIN DASHBOARD */}
// // // // // // //           <Route
// // // // // // //             path="/admin/*"
// // // // // // //             element={
// // // // // // //               <AdminProtectedRoute>
// // // // // // //                 <DomainHeader />
// // // // // // //                 <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
// // // // // // //                   {renderError()}
// // // // // // //                   <AdminDashboard />
// // // // // // //                 </main>
// // // // // // //               </AdminProtectedRoute>
// // // // // // //             }
// // // // // // //           />

// // // // // // //           {/* SELLER DASHBOARD */}
// // // // // // //           <Route
// // // // // // //             path="/seller/*"
// // // // // // //             element={
// // // // // // //               <SellerProtectedRoute>
// // // // // // //                 <DomainHeader />
// // // // // // //                 <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
// // // // // // //                   {renderError()}
// // // // // // //                   <SellerDashboard />
// // // // // // //                 </main>
// // // // // // //               </SellerProtectedRoute>
// // // // // // //             }
// // // // // // //           />

// // // // // // //           {/* PUBLIC/CUSTOMER ROUTES */}
// // // // // // //           <Route
// // // // // // //             path="/*"
// // // // // // //             element={
// // // // // // //               <ProtectedRoute allowUnauthenticated={true}>
// // // // // // //                 {/* Hero Section with Navigation */}
// // // // // // //                 <div className="relative w-full bg-gradient-to-br from-white via-blue-50/30 to-purple-50/20 overflow-hidden">
// // // // // // //                   <Navigation 
// // // // // // //                     onLoginClick={() => setShowAuthModal(true)}
// // // // // // //                     onBecomeSellerClick={() => setShowSellerRequestModal(true)}
// // // // // // //                   />
// // // // // // //                   <HeroSection />
// // // // // // //                 </div>

// // // // // // //                 {/* Main Content */}
// // // // // // //                 <main className="w-full">
// // // // // // //                   {renderError()}
                  
// // // // // // //                   <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-16">
// // // // // // //                     <div className="space-y-8">
// // // // // // //                       {/* Public Showroom */}
// // // // // // //                       <PublicShowroom />
// // // // // // //                     </div>
// // // // // // //                   </div>
// // // // // // //                 </main>

// // // // // // //                 {/* Additional Sections - ALL WITH MATCHING WIDTH */}
// // // // // // //                 <FeatureGuide />
// // // // // // //                 <Guide />
// // // // // // //                 <Statistics />
// // // // // // //                 <Banner />
// // // // // // //                 <Footer />

// // // // // // //                 {/* Floating QR Button */}
// // // // // // //                 <FloatingQRButton />
// // // // // // //               </ProtectedRoute>
// // // // // // //             }
// // // // // // //           />

// // // // // // //           {/* CATCH-ALL REDIRECT */}
// // // // // // //           <Route path="*" element={<Navigate to="/" replace />} />
// // // // // // //         </Routes>
// // // // // // //       </div>

// // // // // // //       {/* Modals */}
// // // // // // //       <AuthModal 
// // // // // // //         isOpen={showAuthModal} 
// // // // // // //         onClose={() => setShowAuthModal(false)} 
// // // // // // //       />

// // // // // // //       <SellerRequestModal
// // // // // // //         isOpen={showSellerRequestModal}
// // // // // // //         onClose={() => setShowSellerRequestModal(false)}
// // // // // // //       />

// // // // // // //       <PlansModal
// // // // // // //         isOpen={showPlansModal}
// // // // // // //         onClose={() => setShowPlansModal(false)}
// // // // // // //         isLoggedIn={isAuthenticated}
// // // // // // //         onSelectPlan={handlePlanSelection}
// // // // // // //       />

// // // // // // //       <PaymentConfirmationModal
// // // // // // //         isOpen={showPaymentConfirmation}
// // // // // // //         onClose={() => {
// // // // // // //           setShowPaymentConfirmation(false);
// // // // // // //           setSelectedPlan(null);
// // // // // // //         }}
// // // // // // //         plan={selectedPlan}
// // // // // // //         onConfirm={handlePaymentConfirm}
// // // // // // //         isProcessing={processingPayment}
// // // // // // //       />

// // // // // // //       {checkoutOptions && paymentId && selectedPlan && (
// // // // // // //         <PaymentCheckout
// // // // // // //           checkoutOptions={checkoutOptions}
// // // // // // //           paymentId={paymentId}
// // // // // // //           planId={selectedPlan.id}
// // // // // // //           sellerId={user?.uid || ''}
// // // // // // //           onError={handlePaymentError}
// // // // // // //         />
// // // // // // //       )}
// // // // // // //     </div>
// // // // // // //   );
// // // // // // // }

// // // // // // // // ═══════════════════════════════════════════════════════════════════════════
// // // // // // // // ✅ APP WRAPPER WITH ROUTER
// // // // // // // // ═══════════════════════════════════════════════════════════════════════════

// // // // // // // function App() {
// // // // // // //   return (
// // // // // // //     <ErrorBoundary>
// // // // // // //       <Router>
// // // // // // //         <AppContent />
// // // // // // //       </Router>
// // // // // // //     </ErrorBoundary>
// // // // // // //   );
// // // // // // // }

// // // // // // // export default App; 
// // // // // // // console.log('✅ App.tsx - PRODUCTION v15.0 COMPLETE - EXACT ALIGNMENT (1920px Grid) - ALL DEVICES RESPONSIVE'); 
// // // // // // import React, { useState, useEffect } from 'react';
// // // // // // import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// // // // // // import { ProtectedRoute, AdminProtectedRoute, SellerProtectedRoute } from './components/ProtectedRoute';
// // // // // // import { WorkerProtectedRoute } from './components/WorkerProtectedRoute';
// // // // // // import { PlansModal } from './components/Payment/PlansModal';
// // // // // // import { PaymentSuccess } from './components/Payment/PaymentSuccess';
// // // // // // import { PaymentFailure } from './components/Payment/PaymentFailure';
// // // // // // import { useAuth } from './hooks/useAuth';
// // // // // // import { auth } from './lib/firebase';
// // // // // // import { DomainHeader } from './components/DomainHeader';
// // // // // // import { SellerDashboard } from './components/SellerDashboard';
// // // // // // import { AdminDashboard } from './components/AdminDashboard';
// // // // // // import { PublicShowroom } from './components/PublicShowroom';
// // // // // // import { SellerRequestForm } from './components/SellerRequestForm';
// // // // // // import { AuthModal } from './components/Auth/AuthModal';
// // // // // // import { FloatingQRButton } from './components/FloatingQRButton';
// // // // // // import { TileDetailsPage } from './components/TileDetailsPage';
// // // // // // import { RoomSelectorPage } from './components/RoomSelectorPage';
// // // // // // import { Room3DViewPage } from './components/Room3DViewPage';
// // // // // // import { TileSearchPage } from './components/TileSearchPage';
// // // // // // import { ScanPage } from './components/ScanPage';
// // // // // // import { getCurrentDomainConfig, applyDomainTheme } from './utils/domainUtils';
// // // // // // import { WorkerErrorBoundary } from './components/WorkerErrorBoundary';
// // // // // // import { SellerAutoLogin } from './components/SellerAutoLogin';
// // // // // // import { Toaster } from 'react-hot-toast';
// // // // // // import { ArrowRight, PlayCircle, RefreshCw, Menu, X,Play, Sparkles, RefreshCcw } from 'lucide-react';
// // // // // // import { PaymentConfirmationModal } from './components/Payment/PaymentConfirmationModal';
// // // // // // import { PaymentCheckout } from './components/Payment/PaymentCheckout';
// // // // // // import { initiatePayment } from './lib/paymentService';
// // // // // // import { getPlanById } from './lib/planService';
// // // // // // import type { Plan } from './types/plan.types';
// // // // // // import type { RazorpayCheckoutOptions } from './types/payment.types';
// // // // // // import { FeatureGuide } from './components/Feature';
// // // // // // import { Guide } from './components/Guide';
// // // // // // import  Banner from './components/Banner';
// // // // // // import { Footer } from './components/Footer';
// // // // // // import Statistics from './components/Statistics';

// // // // // // // ═══════════════════════════════════════════════════════════════════════════
// // // // // // // ✅ GLOBAL STYLES - INTER FONT + SMOOTH ANIMATIONS
// // // // // // // ═══════════════════════════════════════════════════════════════════════════

// // // // // // const GlobalStyles = () => (
// // // // // //   <style dangerouslySetInnerHTML={{__html: `
// // // // // //     @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
    
// // // // // //     * {
// // // // // //       font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
// // // // // //     }
    
// // // // // //     html {
// // // // // //       scroll-behavior: smooth;
// // // // // //       scroll-padding-top: 100px;
// // // // // //     }
    
// // // // // //     @keyframes fadeInUp {
// // // // // //       from { opacity: 0; transform: translateY(20px); }
// // // // // //       to { opacity: 1; transform: translateY(0); }
// // // // // //     }
// // // // // //     .animate-fade-in-up {
// // // // // //       animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
// // // // // //       opacity: 0;
// // // // // //     }
    
// // // // // //     @keyframes spin-slow {
// // // // // //       from { transform: rotate(0deg); }
// // // // // //       to { transform: rotate(360deg); }
// // // // // //     }
// // // // // //     .animate-spin-slow {
// // // // // //       animation: spin-slow 4s linear infinite;
// // // // // //     }
    
// // // // // //     @keyframes slideDownMenu {
// // // // // //       from { opacity: 0; transform: translateY(-15px); }
// // // // // //       to { opacity: 1; transform: translateY(0); }
// // // // // //     }
// // // // // //     .animate-slide-down {
// // // // // //       animation: slideDownMenu 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
// // // // // //     }

// // // // // //     @keyframes modalFadeIn {
// // // // // //       from { opacity: 0; transform: scale(0.95); }
// // // // // //       to { opacity: 1; transform: scale(1); }
// // // // // //     }
// // // // // //     .animate-modal-in {
// // // // // //       animation: modalFadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
// // // // // //     }

// // // // // //     ::-webkit-scrollbar {
// // // // // //       width: 10px;
// // // // // //       height: 10px;
// // // // // //     }
// // // // // //     ::-webkit-scrollbar-track {
// // // // // //       background: #f1f1f1;
// // // // // //     }
// // // // // //     ::-webkit-scrollbar-thumb {
// // // // // //       background: #888;
// // // // // //       border-radius: 5px;
// // // // // //     }
// // // // // //     ::-webkit-scrollbar-thumb:hover {
// // // // // //       background: #555;
// // // // // //     }
// // // // // //   `}} />
// // // // // // );

// // // // // // // ═══════════════════════════════════════════════════════════════════════════
// // // // // // // ✅ ERROR BOUNDARY - PROFESSIONAL ERROR HANDLING
// // // // // // // ═══════════════════════════════════════════════════════════════════════════

// // // // // // class ErrorBoundary extends React.Component<
// // // // // //   { children: React.ReactNode },
// // // // // //   { hasError: boolean; error?: Error }
// // // // // // > {
// // // // // //   constructor(props: { children: React.ReactNode }) {
// // // // // //     super(props);
// // // // // //     this.state = { hasError: false };
// // // // // //   }

// // // // // //   static getDerivedStateFromError(error: Error) {
// // // // // //     return { hasError: true, error };
// // // // // //   }

// // // // // //   componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
// // // // // //     console.error('🔥 App Error Boundary:', error, errorInfo);
// // // // // //   }

// // // // // //   render() {
// // // // // //     if (this.state.hasError) {
// // // // // //       return (
// // // // // //         <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center p-4">
// // // // // //           <div className="text-center p-8 bg-white rounded-xl shadow-2xl max-w-md w-full">
// // // // // //             <div className="text-red-500 text-6xl mb-4">⚠️</div>
// // // // // //             <h1 className="text-2xl font-bold text-gray-800 mb-4">Something went wrong</h1>
// // // // // //             <p className="text-gray-600 mb-6">
// // // // // //               The application encountered an unexpected error. Please refresh the page.
// // // // // //             </p>
// // // // // //             {this.state.error && (
// // // // // //               <details className="mb-6 text-left">
// // // // // //                 <summary className="text-sm text-gray-500 cursor-pointer hover:text-gray-700">
// // // // // //                   Error details
// // // // // //                 </summary>
// // // // // //                 <pre className="mt-2 p-3 bg-gray-100 rounded text-xs overflow-x-auto">
// // // // // //                   {this.state.error.message}
// // // // // //                 </pre>
// // // // // //               </details>
// // // // // //             )}
// // // // // //             <button
// // // // // //               onClick={() => window.location.reload()}
// // // // // //               className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors font-semibold shadow-lg"
// // // // // //             >
// // // // // //               Refresh Page
// // // // // //             </button>
// // // // // //           </div>
// // // // // //         </div>
// // // // // //       );
// // // // // //     }

// // // // // //     return this.props.children;
// // // // // //   }
// // // // // // }

// // // // // // // ═══════════════════════════════════════════════════════════════════════════
// // // // // // // ✅ NAVIGATION COMPONENT - 1920px ALIGNED
// // // // // // // ═══════════════════════════════════════════════════════════════════════════

// // // // // // // interface NavigationProps {
// // // // // // //   onLoginClick: () => void;
// // // // // // //   onBecomeSellerClick: () => void;
// // // // // // // }

// // // // // // // const Navigation: React.FC<NavigationProps> = ({ onLoginClick, onBecomeSellerClick }) => {
// // // // // // //   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

// // // // // // //   useEffect(() => {
// // // // // // //     if (mobileMenuOpen) {
// // // // // // //       document.body.style.overflow = 'hidden';
// // // // // // //     } else {
// // // // // // //       document.body.style.overflow = 'unset';
// // // // // // //     }
// // // // // // //     return () => { document.body.style.overflow = 'unset'; };
// // // // // // //   }, [mobileMenuOpen]);

// // // // // // //   return (
// // // // // // //     // ✅ FIGMA: Max-width 1440px, Padding 64px L/R
// // // // // // //     <nav className="w-full max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-16 py-6 lg:py-8 flex items-center justify-between relative z-40">
      
// // // // // // //       {/* Logo */}
// // // // // // //       <div className="flex items-center gap-3 cursor-pointer">
// // // // // // //         <div className="relative w-7 h-7 lg:w-8 lg:h-8 flex items-center justify-center flex-shrink-0">
// // // // // // //           <div className="absolute top-0 left-0 w-4 h-4 bg-indigo-300 rounded-[3px]"></div>
// // // // // // //           <div className="absolute bottom-0 right-0 w-4 h-4 bg-[#0040DF] rounded-[3px] mix-blend-multiply"></div>
// // // // // // //         </div>
// // // // // // //         <span className="font-bold text-[22px] lg:text-[26px] tracking-tight text-gray-900">
// // // // // // //           Tilesview360
// // // // // // //         </span>
// // // // // // //       </div>

// // // // // // //       {/* Desktop Navigation Links */}
// // // // // // //       <div className="hidden lg:flex items-center gap-10 xl:gap-12">
// // // // // // //         <a 
// // // // // // //           href="#product" 
// // // // // // //           className="text-gray-900 text-[18px] font-semibold relative after:content-[''] after:absolute after:left-0 after:-bottom-1.5 after:w-full after:h-0.5 after:bg-[#0040DF] hover:text-gray-700 transition-colors"
// // // // // // //         >
// // // // // // //           Product
// // // // // // //         </a>
// // // // // // //         <a 
// // // // // // //           href="#features" 
// // // // // // //           className="text-gray-600 text-[18px] font-medium hover:text-gray-900 transition-colors duration-200"
// // // // // // //         >
// // // // // // //           Features
// // // // // // //         </a>
// // // // // // //         <a 
// // // // // // //           href="#pricing" 
// // // // // // //           className="text-gray-600 text-[18px] font-medium hover:text-gray-900 transition-colors duration-200"
// // // // // // //         >
// // // // // // //           Pricing
// // // // // // //         </a>
// // // // // // //         <a 
// // // // // // //           href="#showcase" 
// // // // // // //           className="text-gray-600 text-[18px] font-medium hover:text-gray-900 transition-colors duration-200"
// // // // // // //         >
// // // // // // //           Showcase
// // // // // // //         </a>
// // // // // // //       </div>

// // // // // // //       {/* Desktop Right Actions */}
// // // // // // //       <div className="hidden lg:flex items-center gap-8 xl:gap-10">
// // // // // // //         <button 
// // // // // // //           onClick={onLoginClick} 
// // // // // // //           className="text-gray-700 text-[18px] font-bold hover:text-gray-900 transition-colors duration-200"
// // // // // // //         >
// // // // // // //           Login
// // // // // // //         </button>
// // // // // // //         <button 
// // // // // // //           onClick={onBecomeSellerClick} 
// // // // // // //           className="bg-[#0040DF] text-white text-[18px] px-9 py-4 rounded-full font-semibold hover:bg-blue-700 transition-all duration-200 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40"
// // // // // // //         >
// // // // // // //           Become A Seller
// // // // // // //         </button>
// // // // // // //       </div>

// // // // // // //       {/* Mobile Menu Button */}
// // // // // // //       <button
// // // // // // //         onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
// // // // // // //         className="lg:hidden relative z-[70] p-2 bg-gray-50 hover:bg-gray-100 rounded-full text-gray-800 transition-colors shadow-sm"
// // // // // // //         aria-label="Toggle menu"
// // // // // // //       >
// // // // // // //         {mobileMenuOpen ? (
// // // // // // //           <X className="w-6 h-6 stroke-[2.5px]" />
// // // // // // //         ) : (
// // // // // // //           <Menu className="w-6 h-6 stroke-[2.5px]" />
// // // // // // //         )}
// // // // // // //       </button>

// // // // // // //       {/* Mobile Menu Overlay */}
// // // // // // //       {mobileMenuOpen && (
// // // // // // //         <>
// // // // // // //           <div 
// // // // // // //             className="lg:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-[50] animate-fade-in-up"
// // // // // // //             style={{ animationDuration: '0.3s' }}
// // // // // // //             onClick={() => setMobileMenuOpen(false)}
// // // // // // //           />
// // // // // // //           <div className="lg:hidden fixed top-0 left-0 right-0 pt-[88px] pb-6 px-6 bg-white border-b border-gray-200 shadow-2xl z-[60] animate-slide-down rounded-b-[2rem]">
// // // // // // //             <div className="max-w-md mx-auto space-y-6">
// // // // // // //               {/* Mobile Links */}
// // // // // // //               <div className="space-y-2">
// // // // // // //                 <a 
// // // // // // //                   href="#product" 
// // // // // // //                   onClick={() => setMobileMenuOpen(false)} 
// // // // // // //                   className="block text-gray-900 text-[16px] font-semibold p-3 bg-gray-50 rounded-xl hover:bg-blue-50 hover:text-[#0040DF] transition-colors"
// // // // // // //                 >
// // // // // // //                   Product
// // // // // // //                 </a>
// // // // // // //                 <a 
// // // // // // //                   href="#features" 
// // // // // // //                   onClick={() => setMobileMenuOpen(false)} 
// // // // // // //                   className="block text-gray-600 text-[16px] font-medium p-3 hover:bg-gray-50 rounded-xl transition-colors"
// // // // // // //                 >
// // // // // // //                   Features
// // // // // // //                 </a>
// // // // // // //                 <a 
// // // // // // //                   href="#pricing" 
// // // // // // //                   onClick={() => setMobileMenuOpen(false)} 
// // // // // // //                   className="block text-gray-600 text-[16px] font-medium p-3 hover:bg-gray-50 rounded-xl transition-colors"
// // // // // // //                 >
// // // // // // //                   Pricing
// // // // // // //                 </a>
// // // // // // //                 <a 
// // // // // // //                   href="#showcase" 
// // // // // // //                   onClick={() => setMobileMenuOpen(false)} 
// // // // // // //                   className="block text-gray-600 text-[16px] font-medium p-3 hover:bg-gray-50 rounded-xl transition-colors"
// // // // // // //                 >
// // // // // // //                   Showcase
// // // // // // //                 </a>
// // // // // // //               </div>
              
// // // // // // //               {/* Mobile Actions */}
// // // // // // //               <div className="pt-4 border-t border-gray-100 space-y-3">
// // // // // // //                 <button
// // // // // // //                   onClick={() => { setMobileMenuOpen(false); onLoginClick(); }}
// // // // // // //                   className="w-full text-gray-700 text-[16px] font-bold py-3 px-6 rounded-xl border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all"
// // // // // // //                 >
// // // // // // //                   Login
// // // // // // //                 </button>
// // // // // // //                 <button
// // // // // // //                   onClick={() => { setMobileMenuOpen(false); onBecomeSellerClick(); }}
// // // // // // //                   className="w-full bg-[#0040DF] text-white text-[16px] py-3 px-6 rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/30"
// // // // // // //                 >
// // // // // // //                   Become A Seller
// // // // // // //                 </button>
// // // // // // //               </div>
// // // // // // //             </div>
// // // // // // //           </div>
// // // // // // //         </>
// // // // // // //       )}
// // // // // // //     </nav>
// // // // // // //   );
// // // // // // // }; 
// // // // // // interface NavigationProps {
// // // // // //   onLoginClick: () => void;
// // // // // //   onBecomeSellerClick: () => void;
// // // // // // }

// // // // // // const Navigation: React.FC<NavigationProps> = ({ onLoginClick, onBecomeSellerClick }) => {
// // // // // //   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

// // // // // //   useEffect(() => {
// // // // // //     if (mobileMenuOpen) {
// // // // // //       document.body.style.overflow = 'hidden';
// // // // // //     } else {
// // // // // //       document.body.style.overflow = 'unset';
// // // // // //     }
// // // // // //     return () => { document.body.style.overflow = 'unset'; };
// // // // // //   }, [mobileMenuOpen]);

// // // // // //   return (
// // // // // //     <nav className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-16 py-6 lg:py-8 flex items-center justify-between relative z-40">
      
// // // // // //       {/* Logo */}
// // // // // //       <div className="flex items-center gap-3 cursor-pointer">
// // // // // //         <div className="relative w-7 h-7 lg:w-8 lg:h-8 flex items-center justify-center flex-shrink-0">
// // // // // //           <div className="absolute top-0 left-0 w-4 h-4 bg-indigo-300 rounded-[3px]"></div>
// // // // // //           <div className="absolute bottom-0 right-0 w-4 h-4 bg-[#0040DF] rounded-[3px] mix-blend-multiply"></div>
// // // // // //         </div>
// // // // // //         <span className="font-bold text-[20px] lg:text-[26px] tracking-tight text-gray-900">
// // // // // //           Tilesview360
// // // // // //         </span>
// // // // // //       </div>

// // // // // //       {/* Desktop Navigation Links */}
// // // // // //       <div className="hidden lg:flex items-center gap-12">
// // // // // //         <a 
// // // // // //           href="#product" 
// // // // // //           className="text-gray-900 text-[18px] font-semibold relative after:content-[''] after:absolute after:left-0 after:-bottom-1.5 after:w-full after:h-0.5 after:bg-[#0040DF] hover:text-gray-700 transition-colors"
// // // // // //         >
// // // // // //           Product
// // // // // //         </a>
// // // // // //         <a 
// // // // // //           href="#features" 
// // // // // //           className="text-gray-600 text-[18px] font-medium hover:text-gray-900 transition-colors duration-200"
// // // // // //         >
// // // // // //           Features
// // // // // //         </a>
// // // // // //         <a 
// // // // // //           href="#pricing" 
// // // // // //           className="text-gray-600 text-[18px] font-medium hover:text-gray-900 transition-colors duration-200"
// // // // // //         >
// // // // // //           Pricing
// // // // // //         </a>
// // // // // //         <a 
// // // // // //           href="#showcase" 
// // // // // //           className="text-gray-600 text-[18px] font-medium hover:text-gray-900 transition-colors duration-200"
// // // // // //         >
// // // // // //           Showcase
// // // // // //         </a>
// // // // // //       </div>

// // // // // //       {/* Desktop Right Actions */}
// // // // // //       <div className="hidden lg:flex items-center gap-10">
// // // // // //         <button 
// // // // // //           onClick={onLoginClick} 
// // // // // //           className="text-gray-700 text-[18px] font-bold hover:text-gray-900 transition-colors duration-200"
// // // // // //         >
// // // // // //           Login
// // // // // //         </button>
// // // // // //         <button 
// // // // // //           onClick={onBecomeSellerClick} 
// // // // // //           className="bg-[#0040DF] text-white text-[18px] px-9 py-4 rounded-full font-semibold hover:bg-blue-700 transition-all duration-200 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40"
// // // // // //         >
// // // // // //           Become A Seller
// // // // // //         </button>
// // // // // //       </div>

// // // // // //       {/* Mobile Menu Button */}
// // // // // //       <button
// // // // // //         onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
// // // // // //         className="lg:hidden relative z-[70] p-2 bg-gray-50 hover:bg-gray-100 rounded-full text-gray-800 transition-colors shadow-sm"
// // // // // //         aria-label="Toggle menu"
// // // // // //       >
// // // // // //         {mobileMenuOpen ? (
// // // // // //           <X className="w-6 h-6 stroke-[2.5px]" />
// // // // // //         ) : (
// // // // // //           <Menu className="w-6 h-6 stroke-[2.5px]" />
// // // // // //         )}
// // // // // //       </button>

// // // // // //       {/* Mobile Menu Overlay */}
// // // // // //       {mobileMenuOpen && (
// // // // // //         <>
// // // // // //           <div 
// // // // // //             className="lg:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-[50] animate-fade-in-up"
// // // // // //             style={{ animationDuration: '0.3s' }}
// // // // // //             onClick={() => setMobileMenuOpen(false)}
// // // // // //           />
// // // // // //           <div className="lg:hidden fixed top-0 left-0 right-0 pt-[88px] pb-6 px-6 bg-white border-b border-gray-200 shadow-2xl z-[60] animate-slide-down rounded-b-[2rem]">
// // // // // //             <div className="max-w-md mx-auto space-y-6">
// // // // // //               {/* Mobile Links */}
// // // // // //               <div className="space-y-2">
// // // // // //                 <a 
// // // // // //                   href="#product" 
// // // // // //                   onClick={() => setMobileMenuOpen(false)} 
// // // // // //                   className="block text-gray-900 text-[16px] font-semibold p-3 bg-gray-50 rounded-xl hover:bg-blue-50 hover:text-[#0040DF] transition-colors"
// // // // // //                 >
// // // // // //                   Product
// // // // // //                 </a>
// // // // // //                 <a 
// // // // // //                   href="#features" 
// // // // // //                   onClick={() => setMobileMenuOpen(false)} 
// // // // // //                   className="block text-gray-600 text-[16px] font-medium p-3 hover:bg-gray-50 rounded-xl transition-colors"
// // // // // //                 >
// // // // // //                   Features
// // // // // //                 </a>
// // // // // //                 <a 
// // // // // //                   href="#pricing" 
// // // // // //                   onClick={() => setMobileMenuOpen(false)} 
// // // // // //                   className="block text-gray-600 text-[16px] font-medium p-3 hover:bg-gray-50 rounded-xl transition-colors"
// // // // // //                 >
// // // // // //                   Pricing
// // // // // //                 </a>
// // // // // //                 <a 
// // // // // //                   href="#showcase" 
// // // // // //                   onClick={() => setMobileMenuOpen(false)} 
// // // // // //                   className="block text-gray-600 text-[16px] font-medium p-3 hover:bg-gray-50 rounded-xl transition-colors"
// // // // // //                 >
// // // // // //                   Showcase
// // // // // //                 </a>
// // // // // //               </div>
              
// // // // // //               {/* Mobile Actions */}
// // // // // //               <div className="pt-4 border-t border-gray-100 space-y-3">
// // // // // //                 <button
// // // // // //                   onClick={() => { setMobileMenuOpen(false); onLoginClick(); }}
// // // // // //                   className="w-full text-gray-700 text-[16px] font-bold py-3 px-6 rounded-xl border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all"
// // // // // //                 >
// // // // // //                   Login
// // // // // //                 </button>
// // // // // //                 <button
// // // // // //                   onClick={() => { setMobileMenuOpen(false); onBecomeSellerClick(); }}
// // // // // //                   className="w-full bg-[#0040DF] text-white text-[16px] py-3 px-6 rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/30"
// // // // // //                 >
// // // // // //                   Become A Seller
// // // // // //                 </button>
// // // // // //               </div>
// // // // // //             </div>
// // // // // //           </div>
// // // // // //         </>
// // // // // //       )}
// // // // // //     </nav>
// // // // // //   );
// // // // // // };


// // // // // // const HeroSection: React.FC = () => {
// // // // // //   return (
// // // // // //     <section className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-16 pt-12 lg:pt-20 pb-16 lg:pb-24">
      
// // // // // //       {/* Main Container - Flexbox Layout */}
// // // // // //       <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16">
        
// // // // // //         {/* ═══════════════════════════════════════════════════════════════
// // // // // //             LEFT SIDE: TEXT CONTENT (Max-width 512px)
// // // // // //         ═══════════════════════════════════════════════════════════════ */}
// // // // // //         <div className="w-full lg:w-auto lg:max-w-[512px] flex flex-col gap-6 order-2 lg:order-1">
          
// // // // // //           {/* AI Badge */}
// // // // // //           <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600/10 rounded-full backdrop-blur-sm border border-purple-200/50 w-fit">
// // // // // //             <Sparkles className="w-4 h-4 text-purple-600" />
// // // // // //             <span className="text-purple-700 text-[14px] lg:text-[15px] font-semibold">
// // // // // //               AI-Powered Tile Visualization Platform
// // // // // //             </span>
// // // // // //           </div>

// // // // // //           {/* Heading */}
// // // // // //           <h1 className="text-[36px] sm:text-[48px] lg:text-[56px] leading-[1.1] font-bold tracking-tight text-gray-900">
// // // // // //             See Tiles Before<br />
// // // // // //             <span className="text-[#0040DF]">Customers Buy</span>
// // // // // //           </h1>

// // // // // //           {/* Paragraph */}
// // // // // //           <p className="max-w-[512px] text-[16px] lg:text-[18px] leading-[1.55] text-gray-500">
// // // // // //             Transform your showroom with AI-powered 3D tile visualization. Let customers preview any material in their actual living spaces with photorealistic precision.
// // // // // //           </p>

// // // // // //           {/* Buttons Container */}
// // // // // //           <div className="flex flex-col sm:flex-row items-start sm:items-center pt-4 gap-4">
            
// // // // // //             {/* Primary Button */}
// // // // // //             <button 
// // // // // //               className="group w-full sm:w-auto flex items-center justify-center gap-2 bg-[#0040DF] hover:bg-blue-700 text-white px-8 py-[17px] rounded-full font-medium transition-all shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40"
// // // // // //               onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })}
// // // // // //             >
// // // // // //               Request Demo
// // // // // //               <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
// // // // // //             </button>

// // // // // //             {/* Secondary Button */}
// // // // // //             <button 
// // // // // //               onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })}
// // // // // //               className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white/40 hover:bg-white/60 border border-white/60 backdrop-blur-md text-gray-900 px-8 py-4 rounded-full font-medium transition-all"
// // // // // //             >
// // // // // //               <Play className="w-5 h-5" fill="currentColor" />
// // // // // //               Watch Live Preview
// // // // // //             </button>
// // // // // //           </div>
// // // // // //         </div>

// // // // // //         {/* ═══════════════════════════════════════════════════════════════
// // // // // //             RIGHT SIDE: IMAGES CONTAINER (624x500px on desktop)
// // // // // //         ═══════════════════════════════════════════════════════════════ */}
// // // // // //         <div className="w-full lg:w-[624px] h-auto lg:h-[500px] relative order-1 lg:order-2 flex-shrink-0">
          
// // // // // //           {/* Main Preview Card - Centered at left-35px top-116px */}
// // // // // //           <div className="absolute left-0 top-0 lg:left-[35px] lg:top-[116px] w-full lg:w-[554px] h-[300px] sm:h-[350px] lg:h-[267px] bg-white rounded-[20px] lg:rounded-[24px] p-1 shadow-2xl z-10">
// // // // // //             <div className="relative w-full h-full rounded-[16px] lg:rounded-[20px] overflow-hidden">
              
// // // // // //               {/* Main Background Image */}
// // // // // //               <img 
// // // // // //                 src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&q=80&w=1200" 
// // // // // //                 alt="Modern interior" 
// // // // // //                 className="w-full h-full object-cover"
// // // // // //                 loading="eager"
// // // // // //               />
              
// // // // // //               {/* Overlay Tint */}
// // // // // //               <div className="absolute inset-0 bg-[#0A192F]/20 backdrop-brightness-95"></div>

// // // // // //               {/* AI 3D Scan Active (Center Glass Pill) */}
// // // // // //               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-3 lg:gap-4 bg-white/30 backdrop-blur-md border border-white/40 pr-4 lg:pr-6 pl-2 py-2 rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.1)] z-10 max-w-[90%]">
// // // // // //                 <div className="w-[36px] h-[36px] lg:w-[42px] lg:h-[42px] bg-[#0040DF] rounded-full flex items-center justify-center text-white shrink-0 shadow-inner">
// // // // // //                   <RefreshCcw className="w-4 h-4 lg:w-5 lg:h-5 animate-spin-slow" />
// // // // // //                 </div>
// // // // // //                 <div className="flex flex-col">
// // // // // //                   <span className="text-[13px] lg:text-[15px] font-bold text-gray-900 leading-tight">
// // // // // //                     AI 3D Scan Active
// // // // // //                   </span>
// // // // // //                   <span className="hidden sm:block text-[11px] lg:text-[13px] font-medium text-gray-800/80 leading-tight">
// // // // // //                     Calibrating surface textures...
// // // // // //                   </span>
// // // // // //                 </div>
// // // // // //               </div>
// // // // // //             </div>
// // // // // //           </div>

// // // // // //           {/* Top-Right Floating Card ("Venetian Blue") */}
// // // // // //           <div className="absolute left-[60%] top-[-30px] sm:left-[70%] sm:top-[-40px] lg:left-[416px] lg:top-[-40px] w-[150px] sm:w-[180px] lg:w-[192px] h-auto lg:h-[214px] bg-white/40 border border-white/60 backdrop-blur-md rounded-[14px] lg:rounded-[16px] p-3 lg:p-4 flex flex-col shadow-[0_20px_40px_rgba(0,0,0,0.08)] z-20 animate-fade-in-up"
// // // // // //                style={{ animationDelay: '0ms' }}>
// // // // // //             <img 
// // // // // //               src="https://images.unsplash.com/photo-1590273016480-1a73f6ed9d53?auto=format&fit=crop&w=400&q=80" 
// // // // // //               alt="Venetian Blue Tile" 
// // // // // //               className="w-full h-[100px] sm:h-[120px] lg:h-[128px] rounded-[10px] lg:rounded-[12px] object-cover mb-3 lg:mb-4 shadow-sm"
// // // // // //               loading="lazy"
// // // // // //             />
// // // // // //             <div className="flex flex-col">
// // // // // //               <span className="font-bold text-[14px] lg:text-[16px] text-[#191C1E] leading-tight">
// // // // // //                 Venetian Blue
// // // // // //               </span>
// // // // // //               <span className="font-medium text-[12px] lg:text-[13px] text-[#0040DF] mt-1">
// // // // // //                 Living Room
// // // // // //               </span>
// // // // // //             </div>
// // // // // //           </div>

// // // // // //           {/* Bottom-Left Floating Card ("Noir Slate") */}
// // // // // //           <div className="absolute left-0 top-[260px] sm:top-[300px] lg:left-[-16px] lg:top-[310px] w-[150px] sm:w-[180px] lg:w-[192px] h-auto lg:h-[214px] bg-white/40 border border-white/60 backdrop-blur-md rounded-[14px] lg:rounded-[16px] p-3 lg:p-4 flex flex-col shadow-[0_20px_40px_rgba(0,0,0,0.08)] z-20 animate-fade-in-up"
// // // // // //                style={{ animationDelay: '300ms' }}>
// // // // // //             <img 
// // // // // //               src="https://images.unsplash.com/photo-1620214365969-2b6fb092d6e4?auto=format&fit=crop&q=80&w=400" 
// // // // // //               alt="Noir Slate Tile" 
// // // // // //               className="w-full h-[100px] sm:h-[120px] lg:h-[128px] rounded-[10px] lg:rounded-[12px] object-cover mb-3 lg:mb-4 shadow-sm"
// // // // // //               loading="lazy"
// // // // // //             />
// // // // // //             <div className="flex flex-col">
// // // // // //               <span className="font-bold text-[14px] lg:text-[16px] text-[#191C1E] leading-tight">
// // // // // //                 Noir Slate
// // // // // //               </span>
// // // // // //               <span className="font-medium text-[12px] lg:text-[13px] text-[#0040DF] mt-1">
// // // // // //                 Master Bath
// // // // // //               </span>
// // // // // //             </div>
// // // // // //           </div>

// // // // // //         </div>
// // // // // //       </div>
// // // // // //     </section>
// // // // // //   );
// // // // // // };

// // // // // // // ═══════════════════════════════════════════════════════════════════════════
// // // // // // // ✅ SELLER REQUEST FORM MODAL
// // // // // // // ═══════════════════════════════════════════════════════════════════════════

// // // // // // interface SellerRequestModalProps {
// // // // // //   isOpen: boolean;
// // // // // //   onClose: () => void;
// // // // // // }

// // // // // // const SellerRequestModal: React.FC<SellerRequestModalProps> = ({ isOpen, onClose }) => {
// // // // // //   useEffect(() => {
// // // // // //     if (isOpen) {
// // // // // //       document.body.style.overflow = 'hidden';
// // // // // //     } else {
// // // // // //       document.body.style.overflow = 'unset';
// // // // // //     }
// // // // // //     return () => { document.body.style.overflow = 'unset'; };
// // // // // //   }, [isOpen]);

// // // // // //   if (!isOpen) return null;

// // // // // //   return (
// // // // // //     <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in-up">
// // // // // //       <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-modal-in">
// // // // // //         {/* Header */}
// // // // // //         <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
// // // // // //           <div>
// // // // // //             <h2 className="text-2xl font-bold text-gray-900">Become A Seller</h2>
// // // // // //             <p className="text-sm text-gray-600 mt-1">Join our platform and grow your tile business</p>
// // // // // //           </div>
// // // // // //           <button
// // // // // //             onClick={onClose}
// // // // // //             className="p-2 hover:bg-gray-100 rounded-full transition-colors"
// // // // // //             aria-label="Close"
// // // // // //           >
// // // // // //             <X className="w-6 h-6 text-gray-600" />
// // // // // //           </button>
// // // // // //         </div>

// // // // // //         {/* Form Content */}
// // // // // //         <div className="p-6">
// // // // // //           <SellerRequestForm onSuccess={onClose} />
// // // // // //         </div>
// // // // // //       </div>
// // // // // //     </div>
// // // // // //   );
// // // // // // };

// // // // // // // ═══════════════════════════════════════════════════════════════════════════
// // // // // // // ✅ MAIN APP CONTENT COMPONENT
// // // // // // // ═══════════════════════════════════════════════════════════════════════════

// // // // // // function AppContent() {
// // // // // //   const { isAuthenticated, isLoading, user, error } = useAuth({
// // // // // //     enableActivityTracking: false,
// // // // // //     enableSessionWarnings: false,
// // // // // //     autoLogoutDelay: 0
// // // // // //   });
  
// // // // // //   const [showAuthModal, setShowAuthModal] = useState(false);
// // // // // //   const [showPlansModal, setShowPlansModal] = useState(false);
// // // // // //   const [showSellerRequestModal, setShowSellerRequestModal] = useState(false);
// // // // // //   const [domainConfig, setDomainConfig] = useState(getCurrentDomainConfig());
// // // // // //   const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
// // // // // //   const [showPaymentConfirmation, setShowPaymentConfirmation] = useState(false);
// // // // // //   const [checkoutOptions, setCheckoutOptions] = useState<RazorpayCheckoutOptions | null>(null);
// // // // // //   const [paymentId, setPaymentId] = useState<string | null>(null);
// // // // // //   const [processingPayment, setProcessingPayment] = useState(false);

// // // // // //   // ═══════════════════════════════════════════════════════════════════════════
// // // // // //   // ✅ APP INITIALIZATION
// // // // // //   // ═══════════════════════════════════════════════════════════════════════════

// // // // // //   useEffect(() => {
// // // // // //     try {
// // // // // //       console.log('🚀 Tile Showroom App initializing...');
      
// // // // // //       const config = getCurrentDomainConfig();
// // // // // //       setDomainConfig(config);
// // // // // //       applyDomainTheme(config);
      
// // // // // //       console.log('🎯 Domain config:', config);
// // // // // //       console.log('👤 Auth state:', { 
// // // // // //         isAuthenticated, 
// // // // // //         isLoading, 
// // // // // //         userRole: user?.role,
// // // // // //         userId: user?.user_id 
// // // // // //       });
      
// // // // // //       document.title = config.title;
      
// // // // // //       let viewport = document.querySelector('meta[name="viewport"]');
// // // // // //       if (!viewport) {
// // // // // //         viewport = document.createElement('meta');
// // // // // //         viewport.setAttribute('name', 'viewport');
// // // // // //         viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes');
// // // // // //         document.head.appendChild(viewport);
// // // // // //       }
      
// // // // // //     } catch (error) {
// // // // // //       console.error('🔥 App initialization error:', error);
// // // // // //     }
// // // // // //   }, [isAuthenticated, isLoading, user]);

// // // // // //   // ═══════════════════════════════════════════════════════════════════════════
// // // // // //   // ✅ WORKER ROUTE PROTECTION
// // // // // //   // ═══════════════════════════════════════════════════════════════════════════

// // // // // //   useEffect(() => {
// // // // // //     if (isAuthenticated && user?.role === 'worker') {
// // // // // //       const currentPath = window.location.pathname;
// // // // // //       const allowedPaths = ['/scan', '/tile/', '/3d-view/', '/room-select/'];
// // // // // //       const isAllowedPath = allowedPaths.some(path => currentPath.startsWith(path));
      
// // // // // //       if (!isAllowedPath && currentPath !== '/') {
// // // // // //         console.log('🔒 Worker blocked from:', currentPath);
// // // // // //         window.location.replace('/scan');
// // // // // //       }
// // // // // //     }
// // // // // //   }, [isAuthenticated, user]);

// // // // // //   // ═══════════════════════════════════════════════════════════════════════════
// // // // // //   // ✅ PAYMENT HANDLERS
// // // // // //   // ═══════════════════════════════════════════════════════════════════════════

// // // // // //   const handlePlanSelection = async (planId: string) => {
// // // // // //     try {
// // // // // //       console.log('📦 Selected plan:', planId);
      
// // // // // //       if (!isAuthenticated) {
// // // // // //         console.log('🔐 User not authenticated, showing login modal...');
// // // // // //         setShowPlansModal(false);
// // // // // //         setShowAuthModal(true);
// // // // // //         return;
// // // // // //       }

// // // // // //       console.log('📋 Fetching plan details...');
// // // // // //       const plan = await getPlanById(planId);
      
// // // // // //       if (!plan) {
// // // // // //         alert('❌ Plan not found. Please try again.');
// // // // // //         return;
// // // // // //       }

// // // // // //       setSelectedPlan(plan);
// // // // // //       setShowPlansModal(false);
// // // // // //       setShowPaymentConfirmation(true);
      
// // // // // //     } catch (error: any) {
// // // // // //       console.error('❌ Error selecting plan:', error);
// // // // // //       alert(`❌ Error: ${error.message}`);
// // // // // //     }
// // // // // //   };

// // // // // //   const handlePaymentConfirm = async () => {
// // // // // //     if (!selectedPlan) {
// // // // // //       alert('❌ No plan selected');
// // // // // //       return;
// // // // // //     }

// // // // // //     setProcessingPayment(true);

// // // // // //     try {
// // // // // //       console.log('💳 Initiating payment for plan:', selectedPlan.plan_name);

// // // // // //       const currentUser = auth.currentUser;
// // // // // //       if (!currentUser) {
// // // // // //         throw new Error('Please login first');
// // // // // //       }

// // // // // //       const result = await initiatePayment(
// // // // // //         selectedPlan.id,
// // // // // //         selectedPlan.plan_name,
// // // // // //         selectedPlan.price
// // // // // //       );

// // // // // //       if (!result.success || !result.checkoutOptions || !result.paymentId) {
// // // // // //         throw new Error(result.error || 'Failed to initiate payment');
// // // // // //       }

// // // // // //       console.log('✅ Payment initiated successfully');
// // // // // //       console.log('📝 Payment ID:', result.paymentId);

// // // // // //       setCheckoutOptions(result.checkoutOptions);
// // // // // //       setPaymentId(result.paymentId);
// // // // // //       setShowPaymentConfirmation(false);

// // // // // //     } catch (error: any) {
// // // // // //       console.error('❌ Payment initiation error:', error);
// // // // // //       alert(`❌ Payment Error:\n${error.message}`);
// // // // // //       setProcessingPayment(false);
// // // // // //     }
// // // // // //   };

// // // // // //   const handlePaymentError = (error: string) => {
// // // // // //     console.error('❌ Payment checkout error:', error);
// // // // // //     alert(`❌ Payment Error:\n${error}`);
    
// // // // // //     setCheckoutOptions(null);
// // // // // //     setPaymentId(null);
// // // // // //     setProcessingPayment(false);
// // // // // //     setSelectedPlan(null);
// // // // // //   };

// // // // // //   // ═══════════════════════════════════════════════════════════════════════════
// // // // // //   // ✅ ERROR DISPLAY
// // // // // //   // ═══════════════════════════════════════════════════════════════════════════

// // // // // //   const renderError = () => {
// // // // // //     if (!error) return null;
    
// // // // // //     return (
// // // // // //       <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 animate-shake">
// // // // // //         <div className="flex items-start gap-3">
// // // // // //           <div className="text-red-500 text-xl flex-shrink-0">⚠️</div>
// // // // // //           <div className="flex-1">
// // // // // //             <h3 className="font-semibold text-red-800 text-base mb-1">
// // // // // //               Authentication Error
// // // // // //             </h3>
// // // // // //             <p className="text-red-700 text-sm break-words">{error}</p>
// // // // // //           </div>
// // // // // //           <button
// // // // // //             onClick={() => window.location.reload()}
// // // // // //             className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-700 transition-colors font-medium flex-shrink-0"
// // // // // //           >
// // // // // //             Retry
// // // // // //           </button>
// // // // // //         </div>
// // // // // //       </div>
// // // // // //     );
// // // // // //   };

// // // // // //   // ═══════════════════════════════════════════════════════════════════════════
// // // // // //   // ✅ LOADING STATE
// // // // // //   // ═══════════════════════════════════════════════════════════════════════════

// // // // // //   const renderLoading = () => (
// // // // // //     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
// // // // // //       <div className="text-center max-w-md w-full">
// // // // // //         <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-6"></div>
// // // // // //         <h2 className="text-2xl font-semibold text-gray-800 mb-2">
// // // // // //           {domainConfig.title}
// // // // // //         </h2>
// // // // // //         <p className="text-lg text-gray-600 mb-2">Loading application...</p>
// // // // // //         <p className="text-sm text-gray-500">Initializing secure authentication system</p>
        
// // // // // //         <div className="mt-6 space-y-2">
// // // // // //           <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
// // // // // //             <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
// // // // // //             <span>Verifying authentication tokens</span>
// // // // // //           </div>
// // // // // //           <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
// // // // // //             <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
// // // // // //             <span>Loading user profile</span>
// // // // // //           </div>
// // // // // //           <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
// // // // // //             <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
// // // // // //             <span>Applying security policies</span>
// // // // // //           </div>
// // // // // //         </div>
// // // // // //       </div>
// // // // // //     </div>
// // // // // //   );

// // // // // //   // ═══════════════════════════════════════════════════════════════════════════
// // // // // //   // ✅ SHOW LOADING IF AUTH IS LOADING
// // // // // //   // ═══════════════════════════════════════════════════════════════════════════

// // // // // //   if (isLoading) {
// // // // // //     return renderLoading();
// // // // // //   }

// // // // // //   // ═══════════════════════════════════════════════════════════════════════════
// // // // // //   // ✅ MAIN RENDER
// // // // // //   // ═══════════════════════════════════════════════════════════════════════════

// // // // // //   return (
// // // // // //     <div className="flex flex-col min-h-screen bg-white">
// // // // // //       {/* Global Styles */}
// // // // // //       <GlobalStyles />
      
// // // // // //       {/* Toast Notifications */}
// // // // // //       <Toaster 
// // // // // //         position="top-right"
// // // // // //         reverseOrder={false}
// // // // // //         gutter={8}
// // // // // //         toastOptions={{
// // // // // //           duration: 5000,
// // // // // //           style: {
// // // // // //             background: '#fff',
// // // // // //             color: '#363636',
// // // // // //             fontSize: '14px',
// // // // // //             padding: '12px 16px',
// // // // // //             borderRadius: '10px',
// // // // // //             boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
// // // // // //             maxWidth: '500px',
// // // // // //           },
// // // // // //           success: {
// // // // // //             duration: 4000,
// // // // // //             iconTheme: {
// // // // // //               primary: '#10B981',
// // // // // //               secondary: '#fff',
// // // // // //             },
// // // // // //           },
// // // // // //           error: {
// // // // // //             duration: 6000,
// // // // // //             iconTheme: {
// // // // // //               primary: '#EF4444',
// // // // // //               secondary: '#fff',
// // // // // //             },
// // // // // //           },
// // // // // //         }}
// // // // // //       />

// // // // // //       {/* Main Content */}
// // // // // //       <div className="flex-1">
// // // // // //         <Routes>
// // // // // //           {/* QR SCAN ROUTES - PUBLIC ACCESS */}
// // // // // //           <Route path="/tile/:tileId" element={<TileDetailsPage />} />
// // // // // //           <Route path="/room-select/:tileId" element={<RoomSelectorPage />} />
// // // // // //           <Route path="/3d-view/:tileId/:roomType" element={<Room3DViewPage />} />
// // // // // //           <Route path="/tile/search" element={<TileSearchPage />} />

// // // // // //           {/* WORKER SCAN PAGE */}
// // // // // //           <Route
// // // // // //             path="/scan"
// // // // // //             element={
// // // // // //               <WorkerProtectedRoute>
// // // // // //                 <WorkerErrorBoundary>
// // // // // //                   <ScanPage />
// // // // // //                 </WorkerErrorBoundary>
// // // // // //               </WorkerProtectedRoute>
// // // // // //             }
// // // // // //           />

// // // // // //           {/* SELLER AUTO-LOGIN */}
// // // // // //           <Route path="/seller-auto-login" element={<SellerAutoLogin />} />

// // // // // //           {/* PAYMENT ROUTES */}
// // // // // //           <Route path="/payment-success" element={<PaymentSuccess />} />
// // // // // //           <Route path="/payment-failure" element={<PaymentFailure />} />
// // // // // //           <Route 
// // // // // //             path="/payment-cancelled" 
// // // // // //             element={
// // // // // //               <Navigate 
// // // // // //                 to="/payment-failure?error=Payment cancelled by user" 
// // // // // //                 replace 
// // // // // //               />
// // // // // //             } 
// // // // // //           />

// // // // // //           {/* ADMIN DASHBOARD */}
// // // // // //           <Route
// // // // // //             path="/admin/*"
// // // // // //             element={
// // // // // //               <AdminProtectedRoute>
// // // // // //                 <DomainHeader />
// // // // // //                 {/* ✅ FIXED: Dashboard wrapper using 1920px logic */}
// // // // // //                 <main className="w-full max-w-[1920px] mx-auto px-3 md:px-5 py-6 lg:py-8">
// // // // // //                   {renderError()}
// // // // // //                   <AdminDashboard />
// // // // // //                 </main>
// // // // // //               </AdminProtectedRoute>
// // // // // //             }
// // // // // //           />

// // // // // //           {/* SELLER DASHBOARD */}
// // // // // //           <Route
// // // // // //             path="/seller/*"
// // // // // //             element={
// // // // // //               <SellerProtectedRoute>
// // // // // //                 <DomainHeader />
// // // // // //                 {/* ✅ FIXED: Dashboard wrapper using 1920px logic */}
// // // // // //                 <main className="w-full max-w-[1920px] mx-auto px-3 md:px-5 py-6 lg:py-8">
// // // // // //                   {renderError()}
// // // // // //                   <SellerDashboard />
// // // // // //                 </main>
// // // // // //               </SellerProtectedRoute>
// // // // // //             }
// // // // // //           />

// // // // // //           {/* PUBLIC/CUSTOMER ROUTES */}
// // // // // //           <Route
// // // // // //             path="/*"
// // // // // //             element={
// // // // // //               <ProtectedRoute allowUnauthenticated={true}>
                
// // // // // //                 {/* Hero Section with Navigation */}
// // // // // //                 <div className="relative w-full bg-gradient-to-br from-white via-blue-50/30 to-purple-50/20 overflow-hidden">
// // // // // //                   <Navigation 
// // // // // //                     onLoginClick={() => setShowAuthModal(true)}
// // // // // //                     onBecomeSellerClick={() => setShowSellerRequestModal(true)}
// // // // // //                   />
// // // // // //                   <HeroSection />
// // // // // //                 </div>

// // // // // //                 {/* Main Content (Showroom) */}
// // // // // //                 <main className="w-full">
// // // // // //                   {renderError()}
                  
// // // // // //                   {/* ✅ FIXED: Public Showroom container using 1920px logic */}
// // // // // //                   <div className="w-full max-w-[1920px] mx-auto px-3 md:px-5 py-8 lg:py-16">
// // // // // //                     <div className="space-y-8">
// // // // // //                       <PublicShowroom />
// // // // // //                     </div>
// // // // // //                   </div>
// // // // // //                 </main>

// // // // // //                 {/* Additional Sections - ALL SYNCHRONIZED TO 1920px WIDTH */}
// // // // // //                 <FeatureGuide />
// // // // // //                 <Guide />
// // // // // //                 <Statistics />
// // // // // //                 <Banner />
// // // // // //                 <Footer />

// // // // // //                 {/* Floating QR Button */}
// // // // // //                 <FloatingQRButton />
// // // // // //               </ProtectedRoute>
// // // // // //             }
// // // // // //           />

// // // // // //           {/* CATCH-ALL REDIRECT */}
// // // // // //           <Route path="*" element={<Navigate to="/" replace />} />
// // // // // //         </Routes>
// // // // // //       </div>

// // // // // //       {/* Modals */}
// // // // // //       <AuthModal 
// // // // // //         isOpen={showAuthModal} 
// // // // // //         onClose={() => setShowAuthModal(false)} 
// // // // // //       />

// // // // // //       <SellerRequestModal
// // // // // //         isOpen={showSellerRequestModal}
// // // // // //         onClose={() => setShowSellerRequestModal(false)}
// // // // // //       />

// // // // // //       <PlansModal
// // // // // //         isOpen={showPlansModal}
// // // // // //         onClose={() => setShowPlansModal(false)}
// // // // // //         isLoggedIn={isAuthenticated}
// // // // // //         onSelectPlan={handlePlanSelection}
// // // // // //       />

// // // // // //       <PaymentConfirmationModal
// // // // // //         isOpen={showPaymentConfirmation}
// // // // // //         onClose={() => {
// // // // // //           setShowPaymentConfirmation(false);
// // // // // //           setSelectedPlan(null);
// // // // // //         }}
// // // // // //         plan={selectedPlan}
// // // // // //         onConfirm={handlePaymentConfirm}
// // // // // //         isProcessing={processingPayment}
// // // // // //       />

// // // // // //       {checkoutOptions && paymentId && selectedPlan && (
// // // // // //         <PaymentCheckout
// // // // // //           checkoutOptions={checkoutOptions}
// // // // // //           paymentId={paymentId}
// // // // // //           planId={selectedPlan.id}
// // // // // //           sellerId={user?.uid || ''}
// // // // // //           onError={handlePaymentError}
// // // // // //         />
// // // // // //       )}
// // // // // //     </div>
// // // // // //   );
// // // // // // }

// // // // // // // ═══════════════════════════════════════════════════════════════════════════
// // // // // // // ✅ APP WRAPPER WITH ROUTER
// // // // // // // ═══════════════════════════════════════════════════════════════════════════

// // // // // // function App() {
// // // // // //   return (
// // // // // //     <ErrorBoundary>
// // // // // //       <Router>
// // // // // //         <AppContent />
// // // // // //       </Router>
// // // // // //     </ErrorBoundary> 
// // // // // //   );
// // // // // // }

// // // // // // export default App; 
// // // // // import React, { useState, useEffect } from 'react';
// // // // // import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// // // // // import { ProtectedRoute, AdminProtectedRoute, SellerProtectedRoute } from './components/ProtectedRoute';
// // // // // import { WorkerProtectedRoute } from './components/WorkerProtectedRoute';
// // // // // import { PlansModal } from './components/Payment/PlansModal';
// // // // // import { PaymentSuccess } from './components/Payment/PaymentSuccess';
// // // // // import { PaymentFailure } from './components/Payment/PaymentFailure';
// // // // // import { useAuth } from './hooks/useAuth';
// // // // // import { auth } from './lib/firebase';
// // // // // import { DomainHeader } from './components/DomainHeader';
// // // // // import { SellerDashboard } from './components/SellerDashboard';
// // // // // import { AdminDashboard } from './components/AdminDashboard';
// // // // // import { PublicShowroom } from './components/PublicShowroom';
// // // // // import { SellerRequestForm } from './components/SellerRequestForm';
// // // // // import { AuthModal } from './components/Auth/AuthModal';
// // // // // import { FloatingQRButton } from './components/FloatingQRButton';
// // // // // import { TileDetailsPage } from './components/TileDetailsPage';
// // // // // import { RoomSelectorPage } from './components/RoomSelectorPage';
// // // // // import { Room3DViewPage } from './components/Room3DViewPage';
// // // // // import { TileSearchPage } from './components/TileSearchPage';
// // // // // import { ScanPage } from './components/ScanPage';
// // // // // import { getCurrentDomainConfig, applyDomainTheme } from './utils/domainUtils';
// // // // // import { WorkerErrorBoundary } from './components/WorkerErrorBoundary';
// // // // // import { SellerAutoLogin } from './components/SellerAutoLogin';
// // // // // import { Toaster } from 'react-hot-toast';
// // // // // import { ArrowRight, Play, Sparkles, Box, Menu, X } from 'lucide-react';
// // // // // import { PaymentConfirmationModal } from './components/Payment/PaymentConfirmationModal';
// // // // // import { PaymentCheckout } from './components/Payment/PaymentCheckout';
// // // // // import { initiatePayment } from './lib/paymentService';
// // // // // import { getPlanById } from './lib/planService';
// // // // // import type { Plan } from './types/plan.types';
// // // // // import type { RazorpayCheckoutOptions } from './types/payment.types';
// // // // // import { FeatureGuide } from './components/Feature';
// // // // // import { Guide } from './components/Guide';
// // // // // import Banner from './components/Banner';
// // // // // import { Footer } from './components/Footer';
// // // // // import Statistics from './components/Statistics';

// // // // // // ═══════════════════════════════════════════════════════════════════════════
// // // // // // ✅ GLOBAL STYLES - INTER FONT + SMOOTH ANIMATIONS
// // // // // // ═══════════════════════════════════════════════════════════════════════════

// // // // // const GlobalStyles = () => (
// // // // //   <style dangerouslySetInnerHTML={{__html: `
// // // // //     @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
    
// // // // //     * {
// // // // //       font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
// // // // //     }
    
// // // // //     html {
// // // // //       scroll-behavior: smooth;
// // // // //       scroll-padding-top: 100px;
// // // // //     }
    
// // // // //     @keyframes fadeInUp {
// // // // //       from { opacity: 0; transform: translateY(20px); }
// // // // //       to { opacity: 1; transform: translateY(0); }
// // // // //     }
// // // // //     .animate-fade-in-up {
// // // // //       animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
// // // // //       opacity: 0;
// // // // //     }
    
// // // // //     @keyframes spin-slow {
// // // // //       from { transform: rotate(0deg); }
// // // // //       to { transform: rotate(360deg); }
// // // // //     }
// // // // //     .animate-spin-slow {
// // // // //       animation: spin-slow 4s linear infinite;
// // // // //     }
    
// // // // //     @keyframes slideDownMenu {
// // // // //       from { opacity: 0; transform: translateY(-15px); }
// // // // //       to { opacity: 1; transform: translateY(0); }
// // // // //     }
// // // // //     .animate-slide-down {
// // // // //       animation: slideDownMenu 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
// // // // //     }

// // // // //     @keyframes modalFadeIn {
// // // // //       from { opacity: 0; transform: scale(0.95); }
// // // // //       to { opacity: 1; transform: scale(1); }
// // // // //     }
// // // // //     .animate-modal-in {
// // // // //       animation: modalFadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
// // // // //     }

// // // // //     ::-webkit-scrollbar {
// // // // //       width: 10px;
// // // // //       height: 10px;
// // // // //     }
// // // // //     ::-webkit-scrollbar-track {
// // // // //       background: #f1f1f1;
// // // // //     }
// // // // //     ::-webkit-scrollbar-thumb {
// // // // //       background: #888;
// // // // //       border-radius: 5px;
// // // // //     }
// // // // //     ::-webkit-scrollbar-thumb:hover {
// // // // //       background: #555;
// // // // //     }
// // // // //   `}} />
// // // // // );

// // // // // // ═══════════════════════════════════════════════════════════════════════════
// // // // // // ✅ ERROR BOUNDARY - PROFESSIONAL ERROR HANDLING
// // // // // // ═══════════════════════════════════════════════════════════════════════════

// // // // // class ErrorBoundary extends React.Component<
// // // // //   { children: React.ReactNode },
// // // // //   { hasError: boolean; error?: Error }
// // // // // > {
// // // // //   constructor(props: { children: React.ReactNode }) {
// // // // //     super(props);
// // // // //     this.state = { hasError: false };
// // // // //   }

// // // // //   static getDerivedStateFromError(error: Error) {
// // // // //     return { hasError: true, error };
// // // // //   }

// // // // //   componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
// // // // //     console.error('🔥 App Error Boundary:', error, errorInfo);
// // // // //   }

// // // // //   render() {
// // // // //     if (this.state.hasError) {
// // // // //       return (
// // // // //         <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center p-4">
// // // // //           <div className="text-center p-8 bg-white rounded-xl shadow-2xl max-w-md w-full">
// // // // //             <div className="text-red-500 text-6xl mb-4">⚠️</div>
// // // // //             <h1 className="text-2xl font-bold text-gray-800 mb-4">Something went wrong</h1>
// // // // //             <p className="text-gray-600 mb-6">
// // // // //               The application encountered an unexpected error. Please refresh the page.
// // // // //             </p>
// // // // //             {this.state.error && (
// // // // //               <details className="mb-6 text-left">
// // // // //                 <summary className="text-sm text-gray-500 cursor-pointer hover:text-gray-700">
// // // // //                   Error details
// // // // //                 </summary>
// // // // //                 <pre className="mt-2 p-3 bg-gray-100 rounded text-xs overflow-x-auto">
// // // // //                   {this.state.error.message}
// // // // //                 </pre>
// // // // //               </details>
// // // // //             )}
// // // // //             <button
// // // // //               onClick={() => window.location.reload()}
// // // // //               className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors font-semibold shadow-lg"
// // // // //             >
// // // // //               Refresh Page
// // // // //             </button>
// // // // //           </div>
// // // // //         </div>
// // // // //       );
// // // // //     }

// // // // //     return this.props.children;
// // // // //   }
// // // // // }

// // // // // // ═══════════════════════════════════════════════════════════════════════════
// // // // // // ✅ NAVIGATION COMPONENT - EXACT DUMMY UI
// // // // // // ═══════════════════════════════════════════════════════════════════════════

// // // // // interface NavigationProps {
// // // // //   onLoginClick: () => void;
// // // // //   onBecomeSellerClick: () => void;
// // // // // }

// // // // // const Navigation: React.FC<NavigationProps> = ({ onLoginClick, onBecomeSellerClick }) => {
// // // // //   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

// // // // //   useEffect(() => {
// // // // //     if (mobileMenuOpen) {
// // // // //       document.body.style.overflow = 'hidden';
// // // // //     } else {
// // // // //       document.body.style.overflow = 'unset';
// // // // //     }
// // // // //     return () => { document.body.style.overflow = 'unset'; };
// // // // //   }, [mobileMenuOpen]);

// // // // //   return (
// // // // //     <nav className="fixed top-0 left-0 right-0 h-[77px] z-50 border-b border-white/50 bg-[#F7F9FB]/40 backdrop-blur-[24px] shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] flex items-center justify-center">
// // // // //       <div className="w-full max-w-[1280px] px-4 sm:px-8 lg:px-16 flex justify-between items-center">
        
// // // // //         {/* Logo */}
// // // // //         <div className="flex items-center gap-2.5 cursor-pointer">
// // // // //           {/* Custom Logo Icon matching reference */}
// // // // //           <div className="relative w-6 h-6 flex flex-wrap gap-[3px] transform -rotate-90">
// // // // //             <div className="w-[10px] h-[10px] bg-[#6366F1] rounded-sm rounded-tl-[6px]"></div>
// // // // //             <div className="w-[10px] h-[10px] bg-[#A855F7] rounded-sm rounded-tr-[6px]"></div>
// // // // //             <div className="w-[10px] h-[10px] bg-[#0B4BF5] rounded-sm rounded-bl-[6px]"></div>
// // // // //             <div className="w-[10px] h-[10px] bg-transparent"></div>
// // // // //           </div>
// // // // //           <span className="font-bold text-[18px] sm:text-[20px] tracking-tight text-gray-900">Tilesview360</span>
// // // // //         </div>

// // // // //         {/* Desktop Links */}
// // // // //         <div className="hidden md:flex items-center gap-6 lg:gap-10 text-[15px] font-medium text-gray-500">
// // // // //           <a href="#product" className="text-[#0B4BF5] border-b-[2px] border-[#0B4BF5] pb-1 font-semibold">Product</a>
// // // // //           <a href="#features" className="hover:text-gray-900 transition-colors pb-1">Features</a>
// // // // //           <a href="#pricing" className="hover:text-gray-900 transition-colors pb-1">Pricing</a>
// // // // //           <a href="#showcase" className="hover:text-gray-900 transition-colors pb-1">Showcase</a>
// // // // //         </div>

// // // // //         {/* Desktop Actions */}
// // // // //         <div className="hidden md:flex items-center gap-4 lg:gap-8">
// // // // //           <button onClick={onLoginClick} className="text-[15px] font-semibold text-gray-800 hover:text-[#0B4BF5] transition-colors">
// // // // //             Login
// // // // //           </button>
// // // // //           <button 
// // // // //             onClick={onBecomeSellerClick}
// // // // //             className="bg-[#0B4BF5] hover:bg-blue-700 text-white text-[14px] font-semibold py-2.5 px-6 rounded-full transition-all shadow-[0_4px_14px_0_rgba(11,75,245,0.39)] hover:shadow-[0_6px_20px_rgba(11,75,245,0.23)] hover:-translate-y-0.5"
// // // // //           >
// // // // //             Request Demo
// // // // //           </button>
// // // // //         </div>

// // // // //         {/* Mobile Menu Button */}
// // // // //         <button
// // // // //           onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
// // // // //           className="md:hidden relative z-[70] p-2 bg-white/60 hover:bg-white/80 rounded-full text-gray-800 transition-colors shadow-sm"
// // // // //           aria-label="Toggle menu"
// // // // //         >
// // // // //           {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
// // // // //         </button>

// // // // //         {/* Mobile Menu */}
// // // // //         {mobileMenuOpen && (
// // // // //           <>
// // // // //             <div 
// // // // //               className="md:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-[50] animate-fade-in-up"
// // // // //               onClick={() => setMobileMenuOpen(false)}
// // // // //             />
// // // // //             <div className="md:hidden fixed top-[77px] left-0 right-0 p-6 bg-white/95 backdrop-blur-[24px] border-b border-gray-200 shadow-2xl z-[60] animate-slide-down rounded-b-[2rem]">
// // // // //               <div className="max-w-md mx-auto space-y-6">
// // // // //                 <div className="space-y-2">
// // // // //                   <a href="#product" onClick={() => setMobileMenuOpen(false)} className="block text-[#0B4BF5] text-[16px] font-semibold p-3 bg-blue-50 rounded-xl">Product</a>
// // // // //                   <a href="#features" onClick={() => setMobileMenuOpen(false)} className="block text-gray-600 text-[16px] font-medium p-3 hover:bg-gray-50 rounded-xl">Features</a>
// // // // //                   <a href="#pricing" onClick={() => setMobileMenuOpen(false)} className="block text-gray-600 text-[16px] font-medium p-3 hover:bg-gray-50 rounded-xl">Pricing</a>
// // // // //                   <a href="#showcase" onClick={() => setMobileMenuOpen(false)} className="block text-gray-600 text-[16px] font-medium p-3 hover:bg-gray-50 rounded-xl">Showcase</a>
// // // // //                 </div>
// // // // //                 <div className="pt-4 border-t border-gray-100 space-y-3">
// // // // //                   <button onClick={() => { setMobileMenuOpen(false); onLoginClick(); }} className="w-full text-gray-700 text-[16px] font-bold py-3 px-6 rounded-xl border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50">Login</button>
// // // // //                   <button onClick={() => { setMobileMenuOpen(false); onBecomeSellerClick(); }} className="w-full bg-[#0B4BF5] text-white text-[16px] py-3 px-6 rounded-xl font-semibold hover:bg-blue-700 shadow-[0_4px_14px_0_rgba(11,75,245,0.39)]">Request Demo</button>
// // // // //                 </div>
// // // // //               </div>
// // // // //             </div>
// // // // //           </>
// // // // //         )}
// // // // //       </div>
// // // // //     </nav>
// // // // //   );
// // // // // };

// // // // // // ═══════════════════════════════════════════════════════════════════════════
// // // // // // ✅ HERO SECTION - EXACT DUMMY UI
// // // // // // ═══════════════════════════════════════════════════════════════════════════

// // // // // const HeroSection: React.FC = () => {
// // // // //   return (
// // // // //     <section className="pt-[140px] sm:pt-[160px] lg:pt-[192px] pb-[80px] sm:pb-[120px] lg:pb-[160px] flex justify-center w-full relative z-10">
      
// // // // //       {/* Container */}
// // // // //       <div className="w-full max-w-[1440px] px-4 sm:px-8 lg:px-[64px] flex flex-col lg:flex-row gap-8 sm:gap-12 lg:gap-[64px] items-center justify-center">

// // // // //         {/* Left Content */}
// // // // //         <div className="w-full lg:w-[544px] flex flex-col gap-6 sm:gap-8 lg:gap-[32px] shrink-0 order-2 lg:order-1">
          
// // // // //           {/* Badge */}
// // // // //           <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#F3E8FF]/80 border border-[#E9D5FF] w-fit shadow-sm">
// // // // //             <Sparkles className="w-3.5 h-3.5 text-[#9333EA]" />
// // // // //             <span className="text-[10px] sm:text-[11px] font-bold tracking-[0.08em] text-[#7E22CE] uppercase">AI-Powered Showroom Revolution</span>
// // // // //           </div>

// // // // //           {/* Heading */}
// // // // //           <h1 className="text-[36px] sm:text-[48px] lg:text-[64px] leading-[1.05] font-extrabold tracking-[-0.02em] text-[#111827]">
// // // // //             See Tiles Before <br/>
// // // // //             <span className="text-[#0B4BF5]">Customers Buy</span>
// // // // //           </h1>

// // // // //           {/* Subtitle */}
// // // // //           <p className="text-[16px] sm:text-[18px] text-gray-500 leading-[1.6] max-w-[480px]">
// // // // //             Transform your showroom with AI-powered 3D tile visualization. Let customers preview any material in their actual living spaces with photorealistic precision.
// // // // //           </p>

// // // // //           {/* CTA Buttons */}
// // // // //           <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-5 pt-2">
// // // // //             <button 
// // // // //               onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })}
// // // // //               className="w-full sm:w-auto bg-[#0B4BF5] hover:bg-blue-700 text-white font-semibold text-[16px] h-[56px] px-8 rounded-full flex items-center justify-center gap-2 transition-all shadow-[0_8px_20px_rgba(11,75,245,0.25)] hover:shadow-[0_12px_25px_rgba(11,75,245,0.3)] hover:-translate-y-0.5 group"
// // // // //             >
// // // // //               Request Demo
// // // // //               <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
// // // // //             </button>
// // // // //             <button 
// // // // //               onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })}
// // // // //               className="w-full sm:w-auto bg-white hover:bg-gray-50 text-gray-900 font-semibold text-[16px] h-[56px] px-8 rounded-full flex items-center justify-center gap-3 transition-all shadow-[0_2px_10px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_15px_rgba(0,0,0,0.08)] border border-gray-100"
// // // // //             >
// // // // //               <div className="w-[26px] h-[26px] rounded-full border-[1.5px] border-gray-900 flex items-center justify-center">
// // // // //                 <Play className="w-[10px] h-[10px] text-gray-900 ml-[2px]" fill="currentColor" />
// // // // //               </div>
// // // // //               Watch Live Preview
// // // // //             </button>
// // // // //           </div>
// // // // //         </div>

// // // // //         {/* Right Visuals (Asymmetric Layout) */}
// // // // //         <div className="w-full sm:w-[90%] lg:w-[544px] h-[400px] sm:h-[450px] lg:h-[500px] relative shrink-0 order-1 lg:order-2">
          
// // // // //           {/* Main Preview Card */}
// // // // //           <div className="absolute top-[20%] sm:top-[22%] left-[5%] sm:left-[27.2px] w-[90%] sm:w-[489.59px] h-[50%] sm:h-[275.39px] rounded-[20px] sm:rounded-[24px] border-[3px] sm:border-[4px] border-white/40 bg-white/20 backdrop-blur-[24px] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] overflow-hidden z-10 box-border">
// // // // //             <img 
// // // // //               src="https://images.unsplash.com/photo-1600607686527-6fb886090705?q=80&w=1200&auto=format&fit=crop" 
// // // // //               alt="Modern Architecture Interior" 
// // // // //               className="w-full h-full object-cover" 
// // // // //               loading="eager"
// // // // //             />
// // // // //           </div>

// // // // //           {/* Floating Element 1 - Top Right (Blue Tile) */}
// // // // //           <div className="absolute top-[0px] right-[0%] sm:right-[-10px] z-20 w-[45%] sm:w-[200px] p-[10px] sm:p-[12px] rounded-[20px] sm:rounded-[24px] border border-white/50 bg-white/60 backdrop-blur-[32px] shadow-[0_20px_40px_-10px_rgba(0,0,0,0.15)] flex flex-col animate-fade-in-up" style={{ animationDelay: '0ms' }}>
// // // // //             <div className="w-full h-[120px] sm:h-[170px] rounded-[14px] sm:rounded-[16px] overflow-hidden bg-gray-100 mb-2 sm:mb-3 shadow-inner">
// // // // //               <img 
// // // // //                 src="https://images.unsplash.com/photo-1620019343360-63ce0985c7bb?q=80&w=400&auto=format&fit=crop" 
// // // // //                 alt="Venetian Blue Terrazzo Tile" 
// // // // //                 className="w-full h-full object-cover" 
// // // // //                 loading="lazy"
// // // // //               />
// // // // //             </div>
// // // // //             <div className="px-1 sm:px-2 pb-1 sm:pb-2">
// // // // //               <h3 className="font-bold text-[14px] sm:text-[16px] text-gray-900 leading-none">Venetian Blue</h3>
// // // // //               <p className="text-[12px] sm:text-[13px] font-semibold text-[#0B4BF5] mt-1 sm:mt-1.5 leading-none">Living Room</p>
// // // // //             </div>
// // // // //           </div>

// // // // //           {/* Floating Element 2 - Bottom Left (Dark Tile) */}
// // // // //           <div className="absolute bottom-[0px] left-[0%] sm:left-[-20px] z-30 w-[42%] sm:w-[180px] p-[10px] sm:p-[12px] rounded-[20px] sm:rounded-[24px] border border-white/50 bg-white/70 backdrop-blur-[32px] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.2)] flex flex-col animate-fade-in-up" style={{ animationDelay: '300ms' }}>
// // // // //             <div className="w-full h-[100px] sm:h-[140px] rounded-[14px] sm:rounded-[16px] overflow-hidden bg-[#151515] relative mb-2 sm:mb-3 shadow-inner">
// // // // //               <img 
// // // // //                 src="https://images.unsplash.com/photo-1618221118493-9cfa1a1c00da?q=80&w=400&auto=format&fit=crop" 
// // // // //                 alt="Noir Slate Tile" 
// // // // //                 className="w-full h-full object-cover opacity-80 mix-blend-luminosity brightness-75" 
// // // // //                 loading="lazy"
// // // // //               />
// // // // //               {/* Fake branding on the dark tile */}
// // // // //               <div className="absolute inset-0 flex items-center justify-center flex-col opacity-90">
// // // // //                 <div className="w-6 sm:w-8 h-[0.5px] bg-[#D4AF37]/60 mb-1 sm:mb-2"></div>
// // // // //                 <span className="text-[7px] sm:text-[8px] text-[#D4AF37] tracking-[0.25em] font-serif">LUXETILE</span>
// // // // //                 <span className="text-[3px] sm:text-[4px] text-gray-300 mt-1 tracking-[0.1em]">PREMIUM SELECTION</span>
// // // // //                 <div className="w-6 sm:w-8 h-[0.5px] bg-[#D4AF37]/60 mt-1 sm:mt-2"></div>
// // // // //               </div>
// // // // //             </div>
// // // // //             <div className="px-1 sm:px-2 pb-1">
// // // // //               <h3 className="font-bold text-[13px] sm:text-[15px] text-gray-900 leading-none">Noir Slate</h3>
// // // // //               <p className="text-[12px] sm:text-[13px] font-semibold text-[#0B4BF5] mt-1 sm:mt-1.5 leading-none">Master Bath</p>
// // // // //             </div>
// // // // //           </div>

// // // // //           {/* Floating Element 3 - Center (AI Scan Active) */}
// // // // //           <div className="absolute top-[45%] left-[15%] sm:top-[220px] sm:left-[100px] z-40 flex items-center gap-2 sm:gap-3.5 px-3 sm:px-4 py-2.5 sm:py-3.5 pr-4 sm:pr-6 rounded-[18px] sm:rounded-[20px] border-[1.5px] border-white/40 bg-white/40 backdrop-blur-[20px] shadow-[0_15px_30px_-5px_rgba(0,0,0,0.15)] max-w-[70%] sm:max-w-none">
// // // // //             <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#0B4BF5] flex items-center justify-center text-white shadow-[0_4px_12px_rgba(11,75,245,0.4)] shrink-0">
// // // // //               <Box className="w-4 h-4 sm:w-5 sm:h-5" />
// // // // //             </div>
// // // // //             <div className="flex flex-col">
// // // // //               <span className="font-bold text-gray-900 text-[13px] sm:text-[15px] leading-tight">AI 3D Scan Active</span>
// // // // //               <span className="hidden sm:block text-[13px] text-gray-600 font-medium mt-0.5">Calibrating surface textures...</span>
// // // // //             </div>
// // // // //           </div>

// // // // //         </div>

// // // // //       </div>
// // // // //     </section>
// // // // //   );
// // // // // };

// // // // // // ═══════════════════════════════════════════════════════════════════════════
// // // // // // ✅ SELLER REQUEST FORM MODAL
// // // // // // ═══════════════════════════════════════════════════════════════════════════

// // // // // interface SellerRequestModalProps {
// // // // //   isOpen: boolean;
// // // // //   onClose: () => void;
// // // // // }

// // // // // const SellerRequestModal: React.FC<SellerRequestModalProps> = ({ isOpen, onClose }) => {
// // // // //   useEffect(() => {
// // // // //     if (isOpen) {
// // // // //       document.body.style.overflow = 'hidden';
// // // // //     } else {
// // // // //       document.body.style.overflow = 'unset';
// // // // //     }
// // // // //     return () => { document.body.style.overflow = 'unset'; };
// // // // //   }, [isOpen]);

// // // // //   if (!isOpen) return null;

// // // // //   return (
// // // // //     <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in-up">
// // // // //       <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-modal-in">
// // // // //         <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
// // // // //           <div>
// // // // //             <h2 className="text-2xl font-bold text-gray-900">Become A Seller</h2>
// // // // //             <p className="text-sm text-gray-600 mt-1">Join our platform and grow your tile business</p>
// // // // //           </div>
// // // // //           <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors" aria-label="Close">
// // // // //             <X className="w-6 h-6 text-gray-600" />
// // // // //           </button>
// // // // //         </div>
// // // // //         <div className="p-6">
// // // // //           <SellerRequestForm onSuccess={onClose} />
// // // // //         </div>
// // // // //       </div>
// // // // //     </div>
// // // // //   );
// // // // // };

// // // // // // ═══════════════════════════════════════════════════════════════════════════
// // // // // // ✅ MAIN APP CONTENT COMPONENT
// // // // // // ═══════════════════════════════════════════════════════════════════════════

// // // // // function AppContent() {
// // // // //   const { isAuthenticated, isLoading, user, error } = useAuth({
// // // // //     enableActivityTracking: false,
// // // // //     enableSessionWarnings: false,
// // // // //     autoLogoutDelay: 0
// // // // //   });
  
// // // // //   const [showAuthModal, setShowAuthModal] = useState(false);
// // // // //   const [showPlansModal, setShowPlansModal] = useState(false);
// // // // //   const [showSellerRequestModal, setShowSellerRequestModal] = useState(false);
// // // // //   const [domainConfig, setDomainConfig] = useState(getCurrentDomainConfig());
// // // // //   const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
// // // // //   const [showPaymentConfirmation, setShowPaymentConfirmation] = useState(false);
// // // // //   const [checkoutOptions, setCheckoutOptions] = useState<RazorpayCheckoutOptions | null>(null);
// // // // //   const [paymentId, setPaymentId] = useState<string | null>(null);
// // // // //   const [processingPayment, setProcessingPayment] = useState(false);

// // // // //   useEffect(() => {
// // // // //     try {
// // // // //       console.log('🚀 Tile Showroom App initializing...');
// // // // //       const config = getCurrentDomainConfig();
// // // // //       setDomainConfig(config);
// // // // //       applyDomainTheme(config);
// // // // //       console.log('🎯 Domain config:', config);
// // // // //       console.log('👤 Auth state:', { isAuthenticated, isLoading, userRole: user?.role, userId: user?.user_id });
// // // // //       document.title = config.title;
// // // // //       let viewport = document.querySelector('meta[name="viewport"]');
// // // // //       if (!viewport) {
// // // // //         viewport = document.createElement('meta');
// // // // //         viewport.setAttribute('name', 'viewport');
// // // // //         viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes');
// // // // //         document.head.appendChild(viewport);
// // // // //       }
// // // // //     } catch (error) {
// // // // //       console.error('🔥 App initialization error:', error);
// // // // //     }
// // // // //   }, [isAuthenticated, isLoading, user]);

// // // // //   useEffect(() => {
// // // // //     if (isAuthenticated && user?.role === 'worker') {
// // // // //       const currentPath = window.location.pathname;
// // // // //       const allowedPaths = ['/scan', '/tile/', '/3d-view/', '/room-select/'];
// // // // //       const isAllowedPath = allowedPaths.some(path => currentPath.startsWith(path));
// // // // //       if (!isAllowedPath && currentPath !== '/') {
// // // // //         console.log('🔒 Worker blocked from:', currentPath);
// // // // //         window.location.replace('/scan');
// // // // //       }
// // // // //     }
// // // // //   }, [isAuthenticated, user]);

// // // // //   const handlePlanSelection = async (planId: string) => {
// // // // //     try {
// // // // //       console.log('📦 Selected plan:', planId);
// // // // //       if (!isAuthenticated) {
// // // // //         console.log('🔐 User not authenticated, showing login modal...');
// // // // //         setShowPlansModal(false);
// // // // //         setShowAuthModal(true);
// // // // //         return;
// // // // //       }
// // // // //       console.log('📋 Fetching plan details...');
// // // // //       const plan = await getPlanById(planId);
// // // // //       if (!plan) {
// // // // //         alert('❌ Plan not found. Please try again.');
// // // // //         return;
// // // // //       }
// // // // //       setSelectedPlan(plan);
// // // // //       setShowPlansModal(false);
// // // // //       setShowPaymentConfirmation(true);
// // // // //     } catch (error: any) {
// // // // //       console.error('❌ Error selecting plan:', error);
// // // // //       alert(`❌ Error: ${error.message}`);
// // // // //     }
// // // // //   };

// // // // //   const handlePaymentConfirm = async () => {
// // // // //     if (!selectedPlan) {
// // // // //       alert('❌ No plan selected');
// // // // //       return;
// // // // //     }
// // // // //     setProcessingPayment(true);
// // // // //     try {
// // // // //       console.log('💳 Initiating payment for plan:', selectedPlan.plan_name);
// // // // //       const currentUser = auth.currentUser;
// // // // //       if (!currentUser) {
// // // // //         throw new Error('Please login first');
// // // // //       }
// // // // //       const result = await initiatePayment(selectedPlan.id, selectedPlan.plan_name, selectedPlan.price);
// // // // //       if (!result.success || !result.checkoutOptions || !result.paymentId) {
// // // // //         throw new Error(result.error || 'Failed to initiate payment');
// // // // //       }
// // // // //       console.log('✅ Payment initiated successfully');
// // // // //       console.log('📝 Payment ID:', result.paymentId);
// // // // //       setCheckoutOptions(result.checkoutOptions);
// // // // //       setPaymentId(result.paymentId);
// // // // //       setShowPaymentConfirmation(false);
// // // // //     } catch (error: any) {
// // // // //       console.error('❌ Payment initiation error:', error);
// // // // //       alert(`❌ Payment Error:\n${error.message}`);
// // // // //       setProcessingPayment(false);
// // // // //     }
// // // // //   };

// // // // //   const handlePaymentError = (error: string) => {
// // // // //     console.error('❌ Payment checkout error:', error);
// // // // //     alert(`❌ Payment Error:\n${error}`);
// // // // //     setCheckoutOptions(null);
// // // // //     setPaymentId(null);
// // // // //     setProcessingPayment(false);
// // // // //     setSelectedPlan(null);
// // // // //   };

// // // // //   const renderError = () => {
// // // // //     if (!error) return null;
// // // // //     return (
// // // // //       <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 animate-shake">
// // // // //         <div className="flex items-start gap-3">
// // // // //           <div className="text-red-500 text-xl flex-shrink-0">⚠️</div>
// // // // //           <div className="flex-1">
// // // // //             <h3 className="font-semibold text-red-800 text-base mb-1">Authentication Error</h3>
// // // // //             <p className="text-red-700 text-sm break-words">{error}</p>
// // // // //           </div>
// // // // //           <button onClick={() => window.location.reload()} className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-700 transition-colors font-medium flex-shrink-0">Retry</button>
// // // // //         </div>
// // // // //       </div>
// // // // //     );
// // // // //   };

// // // // //   const renderLoading = () => (
// // // // //     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
// // // // //       <div className="text-center max-w-md w-full">
// // // // //         <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-6"></div>
// // // // //         <h2 className="text-2xl font-semibold text-gray-800 mb-2">{domainConfig.title}</h2>
// // // // //         <p className="text-lg text-gray-600 mb-2">Loading application...</p>
// // // // //         <p className="text-sm text-gray-500">Initializing secure authentication system</p>
// // // // //         <div className="mt-6 space-y-2">
// // // // //           <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
// // // // //             <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
// // // // //             <span>Verifying authentication tokens</span>
// // // // //           </div>
// // // // //           <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
// // // // //             <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
// // // // //             <span>Loading user profile</span>
// // // // //           </div>
// // // // //           <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
// // // // //             <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
// // // // //             <span>Applying security policies</span>
// // // // //           </div>
// // // // //         </div>
// // // // //       </div>
// // // // //     </div>
// // // // //   );

// // // // //   if (isLoading) {
// // // // //     return renderLoading();
// // // // //   }

// // // // //   return (
// // // // //     <div className="flex flex-col min-h-screen bg-[#F7F9FB] selection:bg-blue-100 selection:text-blue-900 overflow-x-hidden">
// // // // //       <GlobalStyles />
      
// // // // //       {/* Subtle Background Gradients */}
// // // // //       <div className="absolute top-0 left-0 w-full h-[800px] bg-gradient-to-br from-[#EEF4FF] via-[#F7F9FB] to-[#F7F9FB] -z-10 pointer-events-none"></div>
// // // // //       <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-200/40 blur-[120px] -z-10 pointer-events-none"></div>
// // // // //       <div className="absolute top-[10%] right-[0%] w-[40%] h-[40%] rounded-full bg-purple-100/40 blur-[120px] -z-10 pointer-events-none"></div>
      
// // // // //       <Toaster 
// // // // //         position="top-right"
// // // // //         reverseOrder={false}
// // // // //         gutter={8}
// // // // //         toastOptions={{
// // // // //           duration: 5000,
// // // // //           style: {
// // // // //             background: '#fff',
// // // // //             color: '#363636',
// // // // //             fontSize: '14px',
// // // // //             padding: '12px 16px',
// // // // //             borderRadius: '10px',
// // // // //             boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
// // // // //             maxWidth: '500px',
// // // // //           },
// // // // //           success: { duration: 4000, iconTheme: { primary: '#10B981', secondary: '#fff' } },
// // // // //           error: { duration: 6000, iconTheme: { primary: '#EF4444', secondary: '#fff' } },
// // // // //         }}
// // // // //       />

// // // // //       <div className="flex-1">
// // // // //         <Routes>
// // // // //           <Route path="/tile/:tileId" element={<TileDetailsPage />} />
// // // // //           <Route path="/room-select/:tileId" element={<RoomSelectorPage />} />
// // // // //           <Route path="/3d-view/:tileId/:roomType" element={<Room3DViewPage />} />
// // // // //           <Route path="/tile/search" element={<TileSearchPage />} />
// // // // //           <Route path="/scan" element={<WorkerProtectedRoute><WorkerErrorBoundary><ScanPage /></WorkerErrorBoundary></WorkerProtectedRoute>} />
// // // // //           <Route path="/seller-auto-login" element={<SellerAutoLogin />} />
// // // // //           <Route path="/payment-success" element={<PaymentSuccess />} />
// // // // //           <Route path="/payment-failure" element={<PaymentFailure />} />
// // // // //           <Route path="/payment-cancelled" element={<Navigate to="/payment-failure?error=Payment cancelled by user" replace />} />
          
// // // // //           <Route path="/admin/*" element={<AdminProtectedRoute><DomainHeader /><main className="w-full max-w-[1920px] mx-auto px-3 md:px-5 py-6 lg:py-8">{renderError()}<AdminDashboard /></main></AdminProtectedRoute>} />
// // // // //           <Route path="/seller/*" element={<SellerProtectedRoute><DomainHeader /><main className="w-full max-w-[1920px] mx-auto px-3 md:px-5 py-6 lg:py-8">{renderError()}<SellerDashboard /></main></SellerProtectedRoute>} />
          
// // // // //           <Route path="/*" element={
// // // // //             <ProtectedRoute allowUnauthenticated={true}>
// // // // //               <Navigation onLoginClick={() => setShowAuthModal(true)} onBecomeSellerClick={() => setShowSellerRequestModal(true)} />
// // // // //               <HeroSection />
// // // // //               <main className="w-full">
// // // // //                 {renderError()}
// // // // //                 <div className="w-full max-w-[1920px] mx-auto px-3 md:px-5 py-8 lg:py-16">
// // // // //                   <div className="space-y-8">
// // // // //                     <PublicShowroom />
// // // // //                   </div>
// // // // //                 </div>
// // // // //               </main>
// // // // //               <FeatureGuide />
// // // // //               <Guide />
// // // // //               <Statistics />
// // // // //               <Banner />
// // // // //               <Footer />
// // // // //               <FloatingQRButton />
// // // // //             </ProtectedRoute>
// // // // //           } />
          
// // // // //           <Route path="*" element={<Navigate to="/" replace />} />
// // // // //         </Routes>
// // // // //       </div>

// // // // //       <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
// // // // //       <SellerRequestModal isOpen={showSellerRequestModal} onClose={() => setShowSellerRequestModal(false)} />
// // // // //       <PlansModal isOpen={showPlansModal} onClose={() => setShowPlansModal(false)} isLoggedIn={isAuthenticated} onSelectPlan={handlePlanSelection} />
// // // // //       <PaymentConfirmationModal isOpen={showPaymentConfirmation} onClose={() => { setShowPaymentConfirmation(false); setSelectedPlan(null); }} plan={selectedPlan} onConfirm={handlePaymentConfirm} isProcessing={processingPayment} />
// // // // //       {checkoutOptions && paymentId && selectedPlan && (
// // // // //         <PaymentCheckout checkoutOptions={checkoutOptions} paymentId={paymentId} planId={selectedPlan.id} sellerId={user?.uid || ''} onError={handlePaymentError} />
// // // // //       )}
// // // // //     </div>
// // // // //   );
// // // // // }

// // // // // function App() {
// // // // //   return (
// // // // //     <ErrorBoundary>
// // // // //       <Router>
// // // // //         <AppContent />
// // // // //       </Router>
// // // // //     </ErrorBoundary> 
// // // // //   );
// // // // // }

// // // // // export default App; 
// // // // import React, { useState, useEffect } from 'react';
// // // // import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// // // // import { ProtectedRoute, AdminProtectedRoute, SellerProtectedRoute } from './components/ProtectedRoute';
// // // // import { WorkerProtectedRoute } from './components/WorkerProtectedRoute';
// // // // import { PlansModal } from './components/Payment/PlansModal';
// // // // import { PaymentSuccess } from './components/Payment/PaymentSuccess';
// // // // import { PaymentFailure } from './components/Payment/PaymentFailure';
// // // // import { useAuth } from './hooks/useAuth';
// // // // import { auth } from './lib/firebase';
// // // // import { DomainHeader } from './components/DomainHeader';
// // // // import { SellerDashboard } from './components/SellerDashboard';
// // // // import { AdminDashboard } from './components/AdminDashboard';
// // // // import { PublicShowroom } from './components/PublicShowroom';
// // // // import { SellerRequestForm } from './components/SellerRequestForm';
// // // // import { AuthModal } from './components/Auth/AuthModal';
// // // // import { FloatingQRButton } from './components/FloatingQRButton';
// // // // import { TileDetailsPage } from './components/TileDetailsPage';
// // // // import { RoomSelectorPage } from './components/RoomSelectorPage';
// // // // import { Room3DViewPage } from './components/Room3DViewPage';
// // // // import { TileSearchPage } from './components/TileSearchPage';
// // // // import { ScanPage } from './components/ScanPage';
// // // // import { getCurrentDomainConfig, applyDomainTheme } from './utils/domainUtils';
// // // // import { WorkerErrorBoundary } from './components/WorkerErrorBoundary';
// // // // import { SellerAutoLogin } from './components/SellerAutoLogin';
// // // // import { Toaster } from 'react-hot-toast';
// // // // import { ArrowRight, Play, Sparkles, Box, Menu, X } from 'lucide-react';
// // // // import { PaymentConfirmationModal } from './components/Payment/PaymentConfirmationModal';
// // // // import { PaymentCheckout } from './components/Payment/PaymentCheckout';
// // // // import { initiatePayment } from './lib/paymentService';
// // // // import { getPlanById } from './lib/planService';
// // // // import type { Plan } from './types/plan.types';
// // // // import type { RazorpayCheckoutOptions } from './types/payment.types';
// // // // import { FeatureGuide } from './components/Feature';
// // // // import { Guide } from './components/Guide';
// // // // import Banner from './components/Banner';
// // // // import { Footer } from './components/Footer';
// // // // import Statistics from './components/Statistics';

// // // // // ═══════════════════════════════════════════════════════════════════════════
// // // // // ✅ GLOBAL STYLES - INTER FONT + ANIMATIONS
// // // // // ═══════════════════════════════════════════════════════════════════════════

// // // // const GlobalStyles = () => (
// // // //   <style dangerouslySetInnerHTML={{__html: `
// // // //     @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
    
// // // //     * {
// // // //       font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
// // // //     }
    
// // // //     html {
// // // //       scroll-behavior: smooth;
// // // //       scroll-padding-top: 100px;
// // // //     }
    
// // // //     @keyframes fadeInUp {
// // // //       from { opacity: 0; transform: translateY(20px); }
// // // //       to { opacity: 1; transform: translateY(0); }
// // // //     }
// // // //     .animate-fade-in-up {
// // // //       animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
// // // //       opacity: 0;
// // // //     }
    
// // // //     @keyframes spin-slow {
// // // //       from { transform: rotate(0deg); }
// // // //       to { transform: rotate(360deg); }
// // // //     }
// // // //     .animate-spin-slow {
// // // //       animation: spin-slow 4s linear infinite;
// // // //     }
    
// // // //     @keyframes slideDownMenu {
// // // //       from { opacity: 0; transform: translateY(-15px); }
// // // //       to { opacity: 1; transform: translateY(0); }
// // // //     }
// // // //     .animate-slide-down {
// // // //       animation: slideDownMenu 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
// // // //     }

// // // //     @keyframes modalFadeIn {
// // // //       from { opacity: 0; transform: scale(0.95); }
// // // //       to { opacity: 1; transform: scale(1); }
// // // //     }
// // // //     .animate-modal-in {
// // // //       animation: modalFadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
// // // //     }

// // // //     ::-webkit-scrollbar {
// // // //       width: 10px;
// // // //       height: 10px;
// // // //     }
// // // //     ::-webkit-scrollbar-track {
// // // //       background: #f1f1f1;
// // // //     }
// // // //     ::-webkit-scrollbar-thumb {
// // // //       background: #888;
// // // //       border-radius: 5px;
// // // //     }
// // // //     ::-webkit-scrollbar-thumb:hover {
// // // //       background: #555;
// // // //     }
// // // //   `}} />
// // // // );

// // // // // ═══════════════════════════════════════════════════════════════════════════
// // // // // ✅ ERROR BOUNDARY
// // // // // ═══════════════════════════════════════════════════════════════════════════

// // // // class ErrorBoundary extends React.Component<
// // // //   { children: React.ReactNode },
// // // //   { hasError: boolean; error?: Error }
// // // // > {
// // // //   constructor(props: { children: React.ReactNode }) {
// // // //     super(props);
// // // //     this.state = { hasError: false };
// // // //   }

// // // //   static getDerivedStateFromError(error: Error) {
// // // //     return { hasError: true, error };
// // // //   }

// // // //   componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
// // // //     console.error('🔥 App Error Boundary:', error, errorInfo);
// // // //   }

// // // //   render() {
// // // //     if (this.state.hasError) {
// // // //       return (
// // // //         <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center p-4">
// // // //           <div className="text-center p-8 bg-white rounded-xl shadow-2xl max-w-md w-full">
// // // //             <div className="text-red-500 text-6xl mb-4">⚠️</div>
// // // //             <h1 className="text-2xl font-bold text-gray-800 mb-4">Something went wrong</h1>
// // // //             <p className="text-gray-600 mb-6">
// // // //               The application encountered an unexpected error. Please refresh the page.
// // // //             </p>
// // // //             {this.state.error && (
// // // //               <details className="mb-6 text-left">
// // // //                 <summary className="text-sm text-gray-500 cursor-pointer hover:text-gray-700">
// // // //                   Error details
// // // //                 </summary>
// // // //                 <pre className="mt-2 p-3 bg-gray-100 rounded text-xs overflow-x-auto">
// // // //                   {this.state.error.message}
// // // //                 </pre>
// // // //               </details>
// // // //             )}
// // // //             <button
// // // //               onClick={() => window.location.reload()}
// // // //               className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors font-semibold shadow-lg"
// // // //             >
// // // //               Refresh Page
// // // //             </button>
// // // //           </div>
// // // //         </div>
// // // //       );
// // // //     }

// // // //     return this.props.children;
// // // //   }
// // // // }

// // // // // ═══════════════════════════════════════════════════════════════════════════
// // // // // ✅ NAVIGATION - DESKTOP FIRST
// // // // // ═══════════════════════════════════════════════════════════════════════════

// // // // interface NavigationProps {
// // // //   onLoginClick: () => void;
// // // //   onBecomeSellerClick: () => void;
// // // // }

// // // // const Navigation: React.FC<NavigationProps> = ({ onLoginClick, onBecomeSellerClick }) => {
// // // //   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

// // // //   useEffect(() => {
// // // //     if (mobileMenuOpen) {
// // // //       document.body.style.overflow = 'hidden';
// // // //     } else {
// // // //       document.body.style.overflow = 'unset';
// // // //     }
// // // //     return () => { document.body.style.overflow = 'unset'; };
// // // //   }, [mobileMenuOpen]);

// // // //   return (
// // // //     <nav className="fixed top-0 left-0 right-0 h-[77px] z-50 border-b border-white/50 bg-[#F7F9FB]/40 backdrop-blur-[24px] shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] flex items-center justify-center">
// // // //       <div className="w-full max-w-[1280px] px-8 lg:px-16 flex justify-between items-center">
        
// // // //         {/* Logo */}
// // // //         <div className="flex items-center gap-2.5 cursor-pointer">
// // // //           <div className="relative w-6 h-6 flex flex-wrap gap-[3px] transform -rotate-90">
// // // //             <div className="w-[10px] h-[10px] bg-[#6366F1] rounded-sm rounded-tl-[6px]"></div>
// // // //             <div className="w-[10px] h-[10px] bg-[#A855F7] rounded-sm rounded-tr-[6px]"></div>
// // // //             <div className="w-[10px] h-[10px] bg-[#0B4BF5] rounded-sm rounded-bl-[6px]"></div>
// // // //             <div className="w-[10px] h-[10px] bg-transparent"></div>
// // // //           </div>
// // // //           <span className="font-bold text-[20px] tracking-tight text-gray-900">Tilesview360</span>
// // // //         </div>

// // // //         {/* Desktop Links */}
// // // //         <div className="hidden md:flex items-center gap-10 text-[15px] font-medium text-gray-500">
// // // //           <a href="#product" className="text-[#0B4BF5] border-b-[2px] border-[#0B4BF5] pb-1 font-semibold">Product</a>
// // // //           <a href="#features" className="hover:text-gray-900 transition-colors pb-1">Features</a>
// // // //           <a href="#pricing" className="hover:text-gray-900 transition-colors pb-1">Pricing</a>
// // // //           <a href="#showcase" className="hover:text-gray-900 transition-colors pb-1">Showcase</a>
// // // //         </div>

// // // //         {/* Desktop Actions */}
// // // //         <div className="hidden md:flex items-center gap-8">
// // // //           <button onClick={onLoginClick} className="text-[15px] font-semibold text-gray-800 hover:text-[#0B4BF5] transition-colors">
// // // //             Login
// // // //           </button>
// // // //           <button 
// // // //             onClick={onBecomeSellerClick}
// // // //             className="bg-[#0B4BF5] hover:bg-blue-700 text-white text-[14px] font-semibold py-2.5 px-6 rounded-full transition-all shadow-[0_4px_14px_0_rgba(11,75,245,0.39)] hover:shadow-[0_6px_20px_rgba(11,75,245,0.23)] hover:-translate-y-0.5"
// // // //           >
// // // //             Request Demo
// // // //           </button>
// // // //         </div>

// // // //         {/* Mobile Menu Button */}
// // // //         <button
// // // //           onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
// // // //           className="md:hidden relative z-[70] p-2 bg-white/60 hover:bg-white/80 rounded-full text-gray-800 transition-colors shadow-sm"
// // // //           aria-label="Toggle menu"
// // // //         >
// // // //           {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
// // // //         </button>

// // // //         {/* Mobile Menu Overlay */}
// // // //         {mobileMenuOpen && (
// // // //           <>
// // // //             <div 
// // // //               className="md:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-[50] animate-fade-in-up"
// // // //               onClick={() => setMobileMenuOpen(false)}
// // // //             />
// // // //             <div className="md:hidden fixed top-[77px] left-0 right-0 p-6 bg-white/95 backdrop-blur-[24px] border-b border-gray-200 shadow-2xl z-[60] animate-slide-down rounded-b-[2rem]">
// // // //               <div className="max-w-md mx-auto space-y-6">
// // // //                 <div className="space-y-2">
// // // //                   <a href="#product" onClick={() => setMobileMenuOpen(false)} className="block text-[#0B4BF5] text-[16px] font-semibold p-3 bg-blue-50 rounded-xl">Product</a>
// // // //                   <a href="#features" onClick={() => setMobileMenuOpen(false)} className="block text-gray-600 text-[16px] font-medium p-3 hover:bg-gray-50 rounded-xl">Features</a>
// // // //                   <a href="#pricing" onClick={() => setMobileMenuOpen(false)} className="block text-gray-600 text-[16px] font-medium p-3 hover:bg-gray-50 rounded-xl">Pricing</a>
// // // //                   <a href="#showcase" onClick={() => setMobileMenuOpen(false)} className="block text-gray-600 text-[16px] font-medium p-3 hover:bg-gray-50 rounded-xl">Showcase</a>
// // // //                 </div>
// // // //                 <div className="pt-4 border-t border-gray-100 space-y-3">
// // // //                   <button onClick={() => { setMobileMenuOpen(false); onLoginClick(); }} className="w-full text-gray-700 text-[16px] font-bold py-3 px-6 rounded-xl border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50">Login</button>
// // // //                   <button onClick={() => { setMobileMenuOpen(false); onBecomeSellerClick(); }} className="w-full bg-[#0B4BF5] text-white text-[16px] py-3 px-6 rounded-xl font-semibold hover:bg-blue-700 shadow-[0_4px_14px_0_rgba(11,75,245,0.39)]">Request Demo</button>
// // // //                 </div>
// // // //               </div>
// // // //             </div>
// // // //           </>
// // // //         )}
// // // //       </div>
// // // //     </nav>
// // // //   );
// // // // };

// // // // // ═══════════════════════════════════════════════════════════════════════════
// // // // // ✅ HERO SECTION - EXACT DUMMY UI (DESKTOP FIRST)
// // // // // ═══════════════════════════════════════════════════════════════════════════

// // // // const HeroSection: React.FC = () => {
// // // //   return (
// // // //     <section className="pt-[192px] pb-[160px] flex justify-center w-full relative z-10">
      
// // // //       {/* Container - Desktop First */}
// // // //       <div className="w-full max-w-[1440px] px-[64px] flex items-center justify-center gap-[64px]">

// // // //         {/* Left Content - Fixed Width */}
// // // //         <div className="w-[544px] flex flex-col gap-[32px] shrink-0">
          
// // // //           {/* Badge */}
// // // //           <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#F3E8FF]/80 border border-[#E9D5FF] w-fit shadow-sm">
// // // //             <Sparkles className="w-3.5 h-3.5 text-[#9333EA]" />
// // // //             <span className="text-[11px] font-bold tracking-[0.08em] text-[#7E22CE] uppercase">AI-Powered Showroom Revolution</span>
// // // //           </div>

// // // //           {/* Heading */}
// // // //           <h1 className="text-[64px] leading-[1.05] font-extrabold tracking-[-0.02em] text-[#111827]">
// // // //             See Tiles Before <br/>
// // // //             <span className="text-[#0B4BF5]">Customers Buy</span>
// // // //           </h1>

// // // //           {/* Subtitle */}
// // // //           <p className="text-[18px] text-gray-500 leading-[1.6] max-w-[480px]">
// // // //             Transform your showroom with AI-powered 3D tile visualization. Let customers preview any material in their actual living spaces with photorealistic precision.
// // // //           </p>

// // // //           {/* CTA Buttons */}
// // // //           <div className="flex items-center gap-5 pt-2">
// // // //             <button 
// // // //               onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })}
// // // //               className="bg-[#0B4BF5] hover:bg-blue-700 text-white font-semibold text-[16px] h-[56px] px-8 rounded-full flex items-center gap-2 transition-all shadow-[0_8px_20px_rgba(11,75,245,0.25)] hover:shadow-[0_12px_25px_rgba(11,75,245,0.3)] hover:-translate-y-0.5 group"
// // // //             >
// // // //               Request Demo
// // // //               <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
// // // //             </button>
// // // //             <button 
// // // //               onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })}
// // // //               className="bg-white hover:bg-gray-50 text-gray-900 font-semibold text-[16px] h-[56px] px-8 rounded-full flex items-center gap-3 transition-all shadow-[0_2px_10px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_15px_rgba(0,0,0,0.08)] border border-gray-100"
// // // //             >
// // // //               <div className="w-[26px] h-[26px] rounded-full border-[1.5px] border-gray-900 flex items-center justify-center">
// // // //                 <Play className="w-[10px] h-[10px] text-gray-900 ml-[2px]" fill="currentColor" />
// // // //               </div>
// // // //               Watch Live Preview
// // // //             </button>
// // // //           </div>
// // // //         </div>

// // // //         {/* Right Visuals - Fixed Width & Height */}
// // // //         <div className="w-[544px] h-[500px] relative shrink-0">
          
// // // //           {/* Main Preview Card - Exact Positioning */}
// // // //           <div className="absolute top-[112.3px] left-[27.2px] w-[489.59px] h-[275.39px] rounded-[24px] border-[4px] border-white/40 bg-white/20 backdrop-blur-[24px] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] overflow-hidden z-10 box-border">
// // // //             <img 
// // // //               src="https://images.unsplash.com/photo-1600607686527-6fb886090705?q=80&w=1200&auto=format&fit=crop" 
// // // //               alt="Modern Architecture Interior" 
// // // //               className="w-full h-full object-cover" 
// // // //               loading="eager"
// // // //             />
// // // //           </div>

// // // //           {/* Floating Element 1 - Top Right (Blue Tile) */}
// // // //           <div className="absolute top-[0px] right-[-10px] z-20 w-[200px] p-[12px] rounded-[24px] border border-white/50 bg-white/60 backdrop-blur-[32px] shadow-[0_20px_40px_-10px_rgba(0,0,0,0.15)] flex flex-col">
// // // //             <div className="w-full h-[170px] rounded-[16px] overflow-hidden bg-gray-100 mb-3 shadow-inner">
// // // //               <img 
// // // //                 src="https://images.unsplash.com/photo-1620019343360-63ce0985c7bb?q=80&w=400&auto=format&fit=crop" 
// // // //                 alt="Venetian Blue Terrazzo Tile" 
// // // //                 className="w-full h-full object-cover" 
// // // //                 loading="lazy"
// // // //               />
// // // //             </div>
// // // //             <div className="px-2 pb-2">
// // // //               <h3 className="font-bold text-[16px] text-gray-900 leading-none">Venetian Blue</h3>
// // // //               <p className="text-[13px] font-semibold text-[#0B4BF5] mt-1.5 leading-none">Living Room</p>
// // // //             </div>
// // // //           </div>

// // // //           {/* Floating Element 2 - Bottom Left (Dark Tile) */}
// // // //           <div className="absolute bottom-[0px] left-[-20px] z-30 w-[180px] p-[12px] rounded-[24px] border border-white/50 bg-white/70 backdrop-blur-[32px] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.2)] flex flex-col">
// // // //             <div className="w-full h-[140px] rounded-[16px] overflow-hidden bg-[#151515] relative mb-3 shadow-inner">
// // // //               <img 
// // // //                 src="https://images.unsplash.com/photo-1618221118493-9cfa1a1c00da?q=80&w=400&auto=format&fit=crop" 
// // // //                 alt="Noir Slate Tile" 
// // // //                 className="w-full h-full object-cover opacity-80 mix-blend-luminosity brightness-75" 
// // // //                 loading="lazy"
// // // //               />
// // // //               {/* Fake branding overlay */}
// // // //               <div className="absolute inset-0 flex items-center justify-center flex-col opacity-90">
// // // //                 <div className="w-8 h-[0.5px] bg-[#D4AF37]/60 mb-2"></div>
// // // //                 <span className="text-[8px] text-[#D4AF37] tracking-[0.25em] font-serif">LUXETILE</span>
// // // //                 <span className="text-[4px] text-gray-300 mt-1 tracking-[0.1em]">PREMIUM SELECTION</span>
// // // //                 <div className="w-8 h-[0.5px] bg-[#D4AF37]/60 mt-2"></div>
// // // //               </div>
// // // //             </div>
// // // //             <div className="px-2 pb-1">
// // // //               <h3 className="font-bold text-[15px] text-gray-900 leading-none">Noir Slate</h3>
// // // //               <p className="text-[13px] font-semibold text-[#0B4BF5] mt-1.5 leading-none">Master Bath</p>
// // // //             </div>
// // // //           </div>

// // // //           {/* Floating Element 3 - Center (AI Scan Active) */}
// // // //           <div className="absolute top-[220px] left-[100px] z-40 flex items-center gap-3.5 px-4 py-3.5 pr-6 rounded-[20px] border-[1.5px] border-white/40 bg-white/40 backdrop-blur-[20px] shadow-[0_15px_30px_-5px_rgba(0,0,0,0.15)]">
// // // //             <div className="w-10 h-10 rounded-full bg-[#0B4BF5] flex items-center justify-center text-white shadow-[0_4px_12px_rgba(11,75,245,0.4)]">
// // // //               <Box className="w-5 h-5" />
// // // //             </div>
// // // //             <div className="flex flex-col">
// // // //               <span className="font-bold text-gray-900 text-[15px] leading-tight">AI 3D Scan Active</span>
// // // //               <span className="text-[13px] text-gray-600 font-medium mt-0.5">Calibrating surface textures...</span>
// // // //             </div>
// // // //           </div>

// // // //         </div>

// // // //       </div>
// // // //     </section>
// // // //   );
// // // // };

// // // // // ═══════════════════════════════════════════════════════════════════════════
// // // // // ✅ SELLER REQUEST MODAL
// // // // // ═══════════════════════════════════════════════════════════════════════════

// // // // interface SellerRequestModalProps {
// // // //   isOpen: boolean;
// // // //   onClose: () => void;
// // // // }

// // // // const SellerRequestModal: React.FC<SellerRequestModalProps> = ({ isOpen, onClose }) => {
// // // //   useEffect(() => {
// // // //     if (isOpen) {
// // // //       document.body.style.overflow = 'hidden';
// // // //     } else {
// // // //       document.body.style.overflow = 'unset';
// // // //     }
// // // //     return () => { document.body.style.overflow = 'unset'; };
// // // //   }, [isOpen]);

// // // //   if (!isOpen) return null;

// // // //   return (
// // // //     <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in-up">
// // // //       <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-modal-in">
// // // //         <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
// // // //           <div>
// // // //             <h2 className="text-2xl font-bold text-gray-900">Become A Seller</h2>
// // // //             <p className="text-sm text-gray-600 mt-1">Join our platform and grow your tile business</p>
// // // //           </div>
// // // //           <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors" aria-label="Close">
// // // //             <X className="w-6 h-6 text-gray-600" />
// // // //           </button>
// // // //         </div>
// // // //         <div className="p-6">
// // // //           <SellerRequestForm onSuccess={onClose} />
// // // //         </div>
// // // //       </div>
// // // //     </div>
// // // //   );
// // // // };

// // // // // ═══════════════════════════════════════════════════════════════════════════
// // // // // ✅ MAIN APP CONTENT
// // // // // ═══════════════════════════════════════════════════════════════════════════

// // // // function AppContent() {
// // // //   const { isAuthenticated, isLoading, user, error } = useAuth({
// // // //     enableActivityTracking: false,
// // // //     enableSessionWarnings: false,
// // // //     autoLogoutDelay: 0
// // // //   });
  
// // // //   const [showAuthModal, setShowAuthModal] = useState(false);
// // // //   const [showPlansModal, setShowPlansModal] = useState(false);
// // // //   const [showSellerRequestModal, setShowSellerRequestModal] = useState(false);
// // // //   const [domainConfig, setDomainConfig] = useState(getCurrentDomainConfig());
// // // //   const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
// // // //   const [showPaymentConfirmation, setShowPaymentConfirmation] = useState(false);
// // // //   const [checkoutOptions, setCheckoutOptions] = useState<RazorpayCheckoutOptions | null>(null);
// // // //   const [paymentId, setPaymentId] = useState<string | null>(null);
// // // //   const [processingPayment, setProcessingPayment] = useState(false);

// // // //   // App Initialization
// // // //   useEffect(() => {
// // // //     try {
// // // //       console.log('🚀 Tile Showroom App initializing...');
// // // //       const config = getCurrentDomainConfig();
// // // //       setDomainConfig(config);
// // // //       applyDomainTheme(config);
// // // //       console.log('🎯 Domain config:', config);
// // // //       console.log('👤 Auth state:', { isAuthenticated, isLoading, userRole: user?.role, userId: user?.user_id });
// // // //       document.title = config.title;
      
// // // //       let viewport = document.querySelector('meta[name="viewport"]');
// // // //       if (!viewport) {
// // // //         viewport = document.createElement('meta');
// // // //         viewport.setAttribute('name', 'viewport');
// // // //         viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes');
// // // //         document.head.appendChild(viewport);
// // // //       }
// // // //     } catch (error) {
// // // //       console.error('🔥 App initialization error:', error);
// // // //     }
// // // //   }, [isAuthenticated, isLoading, user]);

// // // //   // Worker Route Protection
// // // //   useEffect(() => {
// // // //     if (isAuthenticated && user?.role === 'worker') {
// // // //       const currentPath = window.location.pathname;
// // // //       const allowedPaths = ['/scan', '/tile/', '/3d-view/', '/room-select/'];
// // // //       const isAllowedPath = allowedPaths.some(path => currentPath.startsWith(path));
// // // //       if (!isAllowedPath && currentPath !== '/') {
// // // //         console.log('🔒 Worker blocked from:', currentPath);
// // // //         window.location.replace('/scan');
// // // //       }
// // // //     }
// // // //   }, [isAuthenticated, user]);

// // // //   // Payment Handlers
// // // //   const handlePlanSelection = async (planId: string) => {
// // // //     try {
// // // //       console.log('📦 Selected plan:', planId);
// // // //       if (!isAuthenticated) {
// // // //         console.log('🔐 User not authenticated, showing login modal...');
// // // //         setShowPlansModal(false);
// // // //         setShowAuthModal(true);
// // // //         return;
// // // //       }
// // // //       console.log('📋 Fetching plan details...');
// // // //       const plan = await getPlanById(planId);
// // // //       if (!plan) {
// // // //         alert('❌ Plan not found. Please try again.');
// // // //         return;
// // // //       }
// // // //       setSelectedPlan(plan);
// // // //       setShowPlansModal(false);
// // // //       setShowPaymentConfirmation(true);
// // // //     } catch (error: any) {
// // // //       console.error('❌ Error selecting plan:', error);
// // // //       alert(`❌ Error: ${error.message}`);
// // // //     }
// // // //   };

// // // //   const handlePaymentConfirm = async () => {
// // // //     if (!selectedPlan) {
// // // //       alert('❌ No plan selected');
// // // //       return;
// // // //     }
// // // //     setProcessingPayment(true);
// // // //     try {
// // // //       console.log('💳 Initiating payment for plan:', selectedPlan.plan_name);
// // // //       const currentUser = auth.currentUser;
// // // //       if (!currentUser) {
// // // //         throw new Error('Please login first');
// // // //       }
// // // //       const result = await initiatePayment(selectedPlan.id, selectedPlan.plan_name, selectedPlan.price);
// // // //       if (!result.success || !result.checkoutOptions || !result.paymentId) {
// // // //         throw new Error(result.error || 'Failed to initiate payment');
// // // //       }
// // // //       console.log('✅ Payment initiated successfully');
// // // //       console.log('📝 Payment ID:', result.paymentId);
// // // //       setCheckoutOptions(result.checkoutOptions);
// // // //       setPaymentId(result.paymentId);
// // // //       setShowPaymentConfirmation(false);
// // // //     } catch (error: any) {
// // // //       console.error('❌ Payment initiation error:', error);
// // // //       alert(`❌ Payment Error:\n${error.message}`);
// // // //       setProcessingPayment(false);
// // // //     }
// // // //   };

// // // //   const handlePaymentError = (error: string) => {
// // // //     console.error('❌ Payment checkout error:', error);
// // // //     alert(`❌ Payment Error:\n${error}`);
// // // //     setCheckoutOptions(null);
// // // //     setPaymentId(null);
// // // //     setProcessingPayment(false);
// // // //     setSelectedPlan(null);
// // // //   };

// // // //   const renderError = () => {
// // // //     if (!error) return null;
// // // //     return (
// // // //       <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4">
// // // //         <div className="flex items-start gap-3">
// // // //           <div className="text-red-500 text-xl flex-shrink-0">⚠️</div>
// // // //           <div className="flex-1">
// // // //             <h3 className="font-semibold text-red-800 text-base mb-1">Authentication Error</h3>
// // // //             <p className="text-red-700 text-sm break-words">{error}</p>
// // // //           </div>
// // // //           <button onClick={() => window.location.reload()} className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-700 transition-colors font-medium flex-shrink-0">
// // // //             Retry
// // // //           </button>
// // // //         </div>
// // // //       </div>
// // // //     );
// // // //   };

// // // //   const renderLoading = () => (
// // // //     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
// // // //       <div className="text-center max-w-md w-full">
// // // //         <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-6"></div>
// // // //         <h2 className="text-2xl font-semibold text-gray-800 mb-2">{domainConfig.title}</h2>
// // // //         <p className="text-lg text-gray-600 mb-2">Loading application...</p>
// // // //         <p className="text-sm text-gray-500">Initializing secure authentication system</p>
// // // //         <div className="mt-6 space-y-2">
// // // //           <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
// // // //             <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
// // // //             <span>Verifying authentication tokens</span>
// // // //           </div>
// // // //           <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
// // // //             <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
// // // //             <span>Loading user profile</span>
// // // //           </div>
// // // //           <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
// // // //             <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
// // // //             <span>Applying security policies</span>
// // // //           </div>
// // // //         </div>
// // // //       </div>
// // // //     </div>
// // // //   );

// // // //   if (isLoading) {
// // // //     return renderLoading();
// // // //   }

// // // //   return (
// // // //     <div className="flex flex-col min-h-screen bg-[#F7F9FB] selection:bg-blue-100 selection:text-blue-900 overflow-x-hidden">
// // // //       <GlobalStyles />
      
// // // //       {/* Background Gradients */}
// // // //       <div className="absolute top-0 left-0 w-full h-[800px] bg-gradient-to-br from-[#EEF4FF] via-[#F7F9FB] to-[#F7F9FB] -z-10 pointer-events-none"></div>
// // // //       <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-200/40 blur-[120px] -z-10 pointer-events-none"></div>
// // // //       <div className="absolute top-[10%] right-[0%] w-[40%] h-[40%] rounded-full bg-purple-100/40 blur-[120px] -z-10 pointer-events-none"></div>
      
// // // //       <Toaster 
// // // //         position="top-right"
// // // //         reverseOrder={false}
// // // //         gutter={8}
// // // //         toastOptions={{
// // // //           duration: 5000,
// // // //           style: {
// // // //             background: '#fff',
// // // //             color: '#363636',
// // // //             fontSize: '14px',
// // // //             padding: '12px 16px',
// // // //             borderRadius: '10px',
// // // //             boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
// // // //             maxWidth: '500px',
// // // //           },
// // // //           success: { duration: 4000, iconTheme: { primary: '#10B981', secondary: '#fff' } },
// // // //           error: { duration: 6000, iconTheme: { primary: '#EF4444', secondary: '#fff' } },
// // // //         }}
// // // //       />

// // // //       <div className="flex-1">
// // // //         <Routes>
// // // //           {/* QR Scan Routes */}
// // // //           <Route path="/tile/:tileId" element={<TileDetailsPage />} />
// // // //           <Route path="/room-select/:tileId" element={<RoomSelectorPage />} />
// // // //           <Route path="/3d-view/:tileId/:roomType" element={<Room3DViewPage />} />
// // // //           <Route path="/tile/search" element={<TileSearchPage />} />

// // // //           {/* Worker Scan */}
// // // //           <Route path="/scan" element={<WorkerProtectedRoute><WorkerErrorBoundary><ScanPage /></WorkerErrorBoundary></WorkerProtectedRoute>} />

// // // //           {/* Seller Auto-Login */}
// // // //           <Route path="/seller-auto-login" element={<SellerAutoLogin />} />

// // // //           {/* Payment Routes */}
// // // //           <Route path="/payment-success" element={<PaymentSuccess />} />
// // // //           <Route path="/payment-failure" element={<PaymentFailure />} />
// // // //           <Route path="/payment-cancelled" element={<Navigate to="/payment-failure?error=Payment cancelled by user" replace />} />

// // // //           {/* Admin Dashboard */}
// // // //           <Route path="/admin/*" element={
// // // //             <AdminProtectedRoute>
// // // //               <DomainHeader />
// // // //               <main className="w-full max-w-[1920px] mx-auto px-3 md:px-5 py-6 lg:py-8">
// // // //                 {renderError()}
// // // //                 <AdminDashboard />
// // // //               </main>
// // // //             </AdminProtectedRoute>
// // // //           } />

// // // //           {/* Seller Dashboard */}
// // // //           <Route path="/seller/*" element={
// // // //             <SellerProtectedRoute>
// // // //               <DomainHeader />
// // // //               <main className="w-full max-w-[1920px] mx-auto px-3 md:px-5 py-6 lg:py-8">
// // // //                 {renderError()}
// // // //                 <SellerDashboard />
// // // //               </main>
// // // //             </SellerProtectedRoute>
// // // //           } />

// // // //           {/* Public/Customer Routes */}
// // // //           <Route path="/*" element={
// // // //             <ProtectedRoute allowUnauthenticated={true}>
// // // //               <Navigation onLoginClick={() => setShowAuthModal(true)} onBecomeSellerClick={() => setShowSellerRequestModal(true)} />
// // // //               <HeroSection />
// // // //               <main className="w-full">
// // // //                 {renderError()}
// // // //                 <div className="w-full max-w-[1920px] mx-auto px-3 md:px-5 py-8 lg:py-16">
// // // //                   <div className="space-y-8">
// // // //                     <PublicShowroom />
// // // //                   </div>
// // // //                 </div>
// // // //               </main>
// // // //               <FeatureGuide />
// // // //               <Guide />
// // // //               <Statistics />
// // // //               <Banner />
// // // //               <Footer />
// // // //               <FloatingQRButton />
// // // //             </ProtectedRoute>
// // // //           } />

// // // //           {/* Catch-all */}
// // // //           <Route path="*" element={<Navigate to="/" replace />} />
// // // //         </Routes>
// // // //       </div>

// // // //       {/* Modals */}
// // // //       <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
// // // //       <SellerRequestModal isOpen={showSellerRequestModal} onClose={() => setShowSellerRequestModal(false)} />
// // // //       <PlansModal isOpen={showPlansModal} onClose={() => setShowPlansModal(false)} isLoggedIn={isAuthenticated} onSelectPlan={handlePlanSelection} />
// // // //       <PaymentConfirmationModal isOpen={showPaymentConfirmation} onClose={() => { setShowPaymentConfirmation(false); setSelectedPlan(null); }} plan={selectedPlan} onConfirm={handlePaymentConfirm} isProcessing={processingPayment} />
// // // //       {checkoutOptions && paymentId && selectedPlan && (
// // // //         <PaymentCheckout checkoutOptions={checkoutOptions} paymentId={paymentId} planId={selectedPlan.id} sellerId={user?.uid || ''} onError={handlePaymentError} />
// // // //       )}
// // // //     </div>
// // // //   );
// // // // }

// // // // // ═══════════════════════════════════════════════════════════════════════════
// // // // // ✅ APP WRAPPER
// // // // // ═══════════════════════════════════════════════════════════════════════════

// // // // function App() {
// // // //   return (
// // // //     <ErrorBoundary>
// // // //       <Router>
// // // //         <AppContent />
// // // //       </Router>
// // // //     </ErrorBoundary> 
// // // //   );
// // // // }

// // // // export default App; 
// // // import React, { useState, useEffect } from 'react';
// // // import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// // // import { ProtectedRoute, AdminProtectedRoute, SellerProtectedRoute } from './components/ProtectedRoute';
// // // import { WorkerProtectedRoute } from './components/WorkerProtectedRoute';
// // // import { PlansModal } from './components/Payment/PlansModal';
// // // import { PaymentSuccess } from './components/Payment/PaymentSuccess';
// // // import { PaymentFailure } from './components/Payment/PaymentFailure';
// // // import { useAuth } from './hooks/useAuth';
// // // import { auth } from './lib/firebase';
// // // import { DomainHeader } from './components/DomainHeader';
// // // import { SellerDashboard } from './components/SellerDashboard';
// // // import { AdminDashboard } from './components/AdminDashboard';
// // // import { PublicShowroom } from './components/PublicShowroom';
// // // import { SellerRequestForm } from './components/SellerRequestForm';
// // // import { AuthModal } from './components/Auth/AuthModal';
// // // import { FloatingQRButton } from './components/FloatingQRButton';
// // // import { TileDetailsPage } from './components/TileDetailsPage';
// // // import { RoomSelectorPage } from './components/RoomSelectorPage';
// // // import { Room3DViewPage } from './components/Room3DViewPage';
// // // import { TileSearchPage } from './components/TileSearchPage';
// // // import { ScanPage } from './components/ScanPage';
// // // import { getCurrentDomainConfig, applyDomainTheme } from './utils/domainUtils';
// // // import { WorkerErrorBoundary } from './components/WorkerErrorBoundary';
// // // import { SellerAutoLogin } from './components/SellerAutoLogin';
// // // import { Toaster } from 'react-hot-toast';
// // // import { ArrowRight, PlayCircle, RefreshCw, Menu, X,Play, Sparkles, RefreshCcw } from 'lucide-react';
// // // import { PaymentConfirmationModal } from './components/Payment/PaymentConfirmationModal';
// // // import { PaymentCheckout } from './components/Payment/PaymentCheckout';
// // // import { initiatePayment } from './lib/paymentService';
// // // import { getPlanById } from './lib/planService';
// // // import type { Plan } from './types/plan.types';
// // // import type { RazorpayCheckoutOptions } from './types/payment.types';
// // // import { FeatureGuide } from './components/Feature';
// // // import { Guide } from './components/Guide';
// // // import  Banner  from './components/Banner';
// // // import { Footer } from './components/Footer';
// // // import Statistics from './components/Statistics';

// // // // ═══════════════════════════════════════════════════════════════════════════
// // // // ✅ GLOBAL STYLES - INTER FONT + SMOOTH ANIMATIONS
// // // // ═══════════════════════════════════════════════════════════════════════════

// // // const GlobalStyles = () => (
// // //   <style dangerouslySetInnerHTML={{__html: `
// // //     @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
    
// // //     * {
// // //       font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
// // //     }
    
// // //     html {
// // //       scroll-behavior: smooth;
// // //       scroll-padding-top: 100px;
// // //     }
    
// // //     @keyframes fadeInUp {
// // //       from { opacity: 0; transform: translateY(20px); }
// // //       to { opacity: 1; transform: translateY(0); }
// // //     }
// // //     .animate-fade-in-up {
// // //       animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
// // //       opacity: 0;
// // //     }
    
// // //     @keyframes spin-slow {
// // //       from { transform: rotate(0deg); }
// // //       to { transform: rotate(360deg); }
// // //     }
// // //     .animate-spin-slow {
// // //       animation: spin-slow 4s linear infinite;
// // //     }
    
// // //     @keyframes slideDownMenu {
// // //       from { opacity: 0; transform: translateY(-15px); }
// // //       to { opacity: 1; transform: translateY(0); }
// // //     }
// // //     .animate-slide-down {
// // //       animation: slideDownMenu 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
// // //     }

// // //     @keyframes modalFadeIn {
// // //       from { opacity: 0; transform: scale(0.95); }
// // //       to { opacity: 1; transform: scale(1); }
// // //     }
// // //     .animate-modal-in {
// // //       animation: modalFadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
// // //     }

// // //     ::-webkit-scrollbar {
// // //       width: 10px;
// // //       height: 10px;
// // //     }
// // //     ::-webkit-scrollbar-track {
// // //       background: #f1f1f1;
// // //     }
// // //     ::-webkit-scrollbar-thumb {
// // //       background: #888;
// // //       border-radius: 5px;
// // //     }
// // //     ::-webkit-scrollbar-thumb:hover {
// // //       background: #555;
// // //     }
// // //   `}} />
// // // );

// // // // ═══════════════════════════════════════════════════════════════════════════
// // // // ✅ ERROR BOUNDARY - PROFESSIONAL ERROR HANDLING
// // // // ═══════════════════════════════════════════════════════════════════════════

// // // class ErrorBoundary extends React.Component<
// // //   { children: React.ReactNode },
// // //   { hasError: boolean; error?: Error }
// // // > {
// // //   constructor(props: { children: React.ReactNode }) {
// // //     super(props);
// // //     this.state = { hasError: false };
// // //   }

// // //   static getDerivedStateFromError(error: Error) {
// // //     return { hasError: true, error };
// // //   }

// // //   componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
// // //     console.error('🔥 App Error Boundary:', error, errorInfo);
// // //   }

// // //   render() {
// // //     if (this.state.hasError) {
// // //       return (
// // //         <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center p-4">
// // //           <div className="text-center p-8 bg-white rounded-xl shadow-2xl max-w-md w-full">
// // //             <div className="text-red-500 text-6xl mb-4">⚠️</div>
// // //             <h1 className="text-2xl font-bold text-gray-800 mb-4">Something went wrong</h1>
// // //             <p className="text-gray-600 mb-6">
// // //               The application encountered an unexpected error. Please refresh the page.
// // //             </p>
// // //             {this.state.error && (
// // //               <details className="mb-6 text-left">
// // //                 <summary className="text-sm text-gray-500 cursor-pointer hover:text-gray-700">
// // //                   Error details
// // //                 </summary>
// // //                 <pre className="mt-2 p-3 bg-gray-100 rounded text-xs overflow-x-auto">
// // //                   {this.state.error.message}
// // //                 </pre>
// // //               </details>
// // //             )}
// // //             <button
// // //               onClick={() => window.location.reload()}
// // //               className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors font-semibold shadow-lg"
// // //             >
// // //               Refresh Page
// // //             </button>
// // //           </div>
// // //         </div>
// // //       );
// // //     }

// // //     return this.props.children;
// // //   }
// // // }

// // // // ═══════════════════════════════════════════════════════════════════════════
// // // // ✅ NAVIGATION COMPONENT - 1920px ALIGNED
// // // // ═══════════════════════════════════════════════════════════════════════════

// // // // interface NavigationProps {
// // // //   onLoginClick: () => void;
// // // //   onBecomeSellerClick: () => void;
// // // // }

// // // // const Navigation: React.FC<NavigationProps> = ({ onLoginClick, onBecomeSellerClick }) => {
// // // //   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

// // // //   useEffect(() => {
// // // //     if (mobileMenuOpen) {
// // // //       document.body.style.overflow = 'hidden';
// // // //     } else {
// // // //       document.body.style.overflow = 'unset';
// // // //     }
// // // //     return () => { document.body.style.overflow = 'unset'; };
// // // //   }, [mobileMenuOpen]);

// // // //   return (
// // // //     // ✅ FIGMA: Max-width 1440px, Padding 64px L/R
// // // //     <nav className="w-full max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-16 py-6 lg:py-8 flex items-center justify-between relative z-40">
      
// // // //       {/* Logo */}
// // // //       <div className="flex items-center gap-3 cursor-pointer">
// // // //         <div className="relative w-7 h-7 lg:w-8 lg:h-8 flex items-center justify-center flex-shrink-0">
// // // //           <div className="absolute top-0 left-0 w-4 h-4 bg-indigo-300 rounded-[3px]"></div>
// // // //           <div className="absolute bottom-0 right-0 w-4 h-4 bg-[#0040DF] rounded-[3px] mix-blend-multiply"></div>
// // // //         </div>
// // // //         <span className="font-bold text-[22px] lg:text-[26px] tracking-tight text-gray-900">
// // // //           Tilesview360
// // // //         </span>
// // // //       </div>

// // // //       {/* Desktop Navigation Links */}
// // // //       <div className="hidden lg:flex items-center gap-10 xl:gap-12">
// // // //         <a 
// // // //           href="#product" 
// // // //           className="text-gray-900 text-[18px] font-semibold relative after:content-[''] after:absolute after:left-0 after:-bottom-1.5 after:w-full after:h-0.5 after:bg-[#0040DF] hover:text-gray-700 transition-colors"
// // // //         >
// // // //           Product
// // // //         </a>
// // // //         <a 
// // // //           href="#features" 
// // // //           className="text-gray-600 text-[18px] font-medium hover:text-gray-900 transition-colors duration-200"
// // // //         >
// // // //           Features
// // // //         </a>
// // // //         <a 
// // // //           href="#pricing" 
// // // //           className="text-gray-600 text-[18px] font-medium hover:text-gray-900 transition-colors duration-200"
// // // //         >
// // // //           Pricing
// // // //         </a>
// // // //         <a 
// // // //           href="#showcase" 
// // // //           className="text-gray-600 text-[18px] font-medium hover:text-gray-900 transition-colors duration-200"
// // // //         >
// // // //           Showcase
// // // //         </a>
// // // //       </div>

// // // //       {/* Desktop Right Actions */}
// // // //       <div className="hidden lg:flex items-center gap-8 xl:gap-10">
// // // //         <button 
// // // //           onClick={onLoginClick} 
// // // //           className="text-gray-700 text-[18px] font-bold hover:text-gray-900 transition-colors duration-200"
// // // //         >
// // // //           Login
// // // //         </button>
// // // //         <button 
// // // //           onClick={onBecomeSellerClick} 
// // // //           className="bg-[#0040DF] text-white text-[18px] px-9 py-4 rounded-full font-semibold hover:bg-blue-700 transition-all duration-200 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40"
// // // //         >
// // // //           Become A Seller
// // // //         </button>
// // // //       </div>

// // // //       {/* Mobile Menu Button */}
// // // //       <button
// // // //         onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
// // // //         className="lg:hidden relative z-[70] p-2 bg-gray-50 hover:bg-gray-100 rounded-full text-gray-800 transition-colors shadow-sm"
// // // //         aria-label="Toggle menu"
// // // //       >
// // // //         {mobileMenuOpen ? (
// // // //           <X className="w-6 h-6 stroke-[2.5px]" />
// // // //         ) : (
// // // //           <Menu className="w-6 h-6 stroke-[2.5px]" />
// // // //         )}
// // // //       </button>

// // // //       {/* Mobile Menu Overlay */}
// // // //       {mobileMenuOpen && (
// // // //         <>
// // // //           <div 
// // // //             className="lg:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-[50] animate-fade-in-up"
// // // //             style={{ animationDuration: '0.3s' }}
// // // //             onClick={() => setMobileMenuOpen(false)}
// // // //           />
// // // //           <div className="lg:hidden fixed top-0 left-0 right-0 pt-[88px] pb-6 px-6 bg-white border-b border-gray-200 shadow-2xl z-[60] animate-slide-down rounded-b-[2rem]">
// // // //             <div className="max-w-md mx-auto space-y-6">
// // // //               {/* Mobile Links */}
// // // //               <div className="space-y-2">
// // // //                 <a 
// // // //                   href="#product" 
// // // //                   onClick={() => setMobileMenuOpen(false)} 
// // // //                   className="block text-gray-900 text-[16px] font-semibold p-3 bg-gray-50 rounded-xl hover:bg-blue-50 hover:text-[#0040DF] transition-colors"
// // // //                 >
// // // //                   Product
// // // //                 </a>
// // // //                 <a 
// // // //                   href="#features" 
// // // //                   onClick={() => setMobileMenuOpen(false)} 
// // // //                   className="block text-gray-600 text-[16px] font-medium p-3 hover:bg-gray-50 rounded-xl transition-colors"
// // // //                 >
// // // //                   Features
// // // //                 </a>
// // // //                 <a 
// // // //                   href="#pricing" 
// // // //                   onClick={() => setMobileMenuOpen(false)} 
// // // //                   className="block text-gray-600 text-[16px] font-medium p-3 hover:bg-gray-50 rounded-xl transition-colors"
// // // //                 >
// // // //                   Pricing
// // // //                 </a>
// // // //                 <a 
// // // //                   href="#showcase" 
// // // //                   onClick={() => setMobileMenuOpen(false)} 
// // // //                   className="block text-gray-600 text-[16px] font-medium p-3 hover:bg-gray-50 rounded-xl transition-colors"
// // // //                 >
// // // //                   Showcase
// // // //                 </a>
// // // //               </div>
              
// // // //               {/* Mobile Actions */}
// // // //               <div className="pt-4 border-t border-gray-100 space-y-3">
// // // //                 <button
// // // //                   onClick={() => { setMobileMenuOpen(false); onLoginClick(); }}
// // // //                   className="w-full text-gray-700 text-[16px] font-bold py-3 px-6 rounded-xl border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all"
// // // //                 >
// // // //                   Login
// // // //                 </button>
// // // //                 <button
// // // //                   onClick={() => { setMobileMenuOpen(false); onBecomeSellerClick(); }}
// // // //                   className="w-full bg-[#0040DF] text-white text-[16px] py-3 px-6 rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/30"
// // // //                 >
// // // //                   Become A Seller
// // // //                 </button>
// // // //               </div>
// // // //             </div>
// // // //           </div>
// // // //         </>
// // // //       )}
// // // //     </nav>
// // // //   );
// // // // }; 
// // // interface NavigationProps {
// // //   onLoginClick: () => void;
// // //   onBecomeSellerClick: () => void;
// // // }

// // // const Navigation: React.FC<NavigationProps> = ({ onLoginClick, onBecomeSellerClick }) => {
// // //   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

// // //   useEffect(() => {
// // //     if (mobileMenuOpen) {
// // //       document.body.style.overflow = 'hidden';
// // //     } else {
// // //       document.body.style.overflow = 'unset';
// // //     }
// // //     return () => { document.body.style.overflow = 'unset'; };
// // //   }, [mobileMenuOpen]);

// // //   return (
// // //     <nav className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-16 py-6 lg:py-8 flex items-center justify-between relative z-40">
      
// // //       {/* Logo */}
// // //       <div className="flex items-center gap-3 cursor-pointer">
// // //         <div className="relative w-7 h-7 lg:w-8 lg:h-8 flex items-center justify-center flex-shrink-0">
// // //           <div className="absolute top-0 left-0 w-4 h-4 bg-indigo-300 rounded-[3px]"></div>
// // //           <div className="absolute bottom-0 right-0 w-4 h-4 bg-[#0040DF] rounded-[3px] mix-blend-multiply"></div>
// // //         </div>
// // //         <span className="font-bold text-[20px] lg:text-[26px] tracking-tight text-gray-900">
// // //           Tilesview360
// // //         </span>
// // //       </div>

// // //       {/* Desktop Navigation Links */}
// // //       <div className="hidden lg:flex items-center gap-12">
// // //         <a 
// // //           href="#product" 
// // //           className="text-gray-900 text-[18px] font-semibold relative after:content-[''] after:absolute after:left-0 after:-bottom-1.5 after:w-full after:h-0.5 after:bg-[#0040DF] hover:text-gray-700 transition-colors"
// // //         >
// // //           Product
// // //         </a>
// // //         <a 
// // //           href="#features" 
// // //           className="text-gray-600 text-[18px] font-medium hover:text-gray-900 transition-colors duration-200"
// // //         >
// // //           Features
// // //         </a>
// // //         <a 
// // //           href="#pricing" 
// // //           className="text-gray-600 text-[18px] font-medium hover:text-gray-900 transition-colors duration-200"
// // //         >
// // //           Pricing
// // //         </a>
// // //         <a 
// // //           href="#showcase" 
// // //           className="text-gray-600 text-[18px] font-medium hover:text-gray-900 transition-colors duration-200"
// // //         >
// // //           Showcase
// // //         </a>
// // //       </div>

// // //       {/* Desktop Right Actions */}
// // //       <div className="hidden lg:flex items-center gap-10">
// // //         <button 
// // //           onClick={onLoginClick} 
// // //           className="text-gray-700 text-[18px] font-bold hover:text-gray-900 transition-colors duration-200"
// // //         >
// // //           Login
// // //         </button>
// // //         <button 
// // //           onClick={onBecomeSellerClick} 
// // //           className="bg-[#0040DF] text-white text-[18px] px-9 py-4 rounded-full font-semibold hover:bg-blue-700 transition-all duration-200 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40"
// // //         >
// // //           Become A Seller
// // //         </button>
// // //       </div>

// // //       {/* Mobile Menu Button */}
// // //       <button
// // //         onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
// // //         className="lg:hidden relative z-[70] p-2 bg-gray-50 hover:bg-gray-100 rounded-full text-gray-800 transition-colors shadow-sm"
// // //         aria-label="Toggle menu"
// // //       >
// // //         {mobileMenuOpen ? (
// // //           <X className="w-6 h-6 stroke-[2.5px]" />
// // //         ) : (
// // //           <Menu className="w-6 h-6 stroke-[2.5px]" />
// // //         )}
// // //       </button>

// // //       {/* Mobile Menu Overlay */}
// // //       {mobileMenuOpen && (
// // //         <>
// // //           <div 
// // //             className="lg:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-[50] animate-fade-in-up"
// // //             style={{ animationDuration: '0.3s' }}
// // //             onClick={() => setMobileMenuOpen(false)}
// // //           />
// // //           <div className="lg:hidden fixed top-0 left-0 right-0 pt-[88px] pb-6 px-6 bg-white border-b border-gray-200 shadow-2xl z-[60] animate-slide-down rounded-b-[2rem]">
// // //             <div className="max-w-md mx-auto space-y-6">
// // //               {/* Mobile Links */}
// // //               <div className="space-y-2">
// // //                 <a 
// // //                   href="#product" 
// // //                   onClick={() => setMobileMenuOpen(false)} 
// // //                   className="block text-gray-900 text-[16px] font-semibold p-3 bg-gray-50 rounded-xl hover:bg-blue-50 hover:text-[#0040DF] transition-colors"
// // //                 >
// // //                   Product
// // //                 </a>
// // //                 <a 
// // //                   href="#features" 
// // //                   onClick={() => setMobileMenuOpen(false)} 
// // //                   className="block text-gray-600 text-[16px] font-medium p-3 hover:bg-gray-50 rounded-xl transition-colors"
// // //                 >
// // //                   Features
// // //                 </a>
// // //                 <a 
// // //                   href="#pricing" 
// // //                   onClick={() => setMobileMenuOpen(false)} 
// // //                   className="block text-gray-600 text-[16px] font-medium p-3 hover:bg-gray-50 rounded-xl transition-colors"
// // //                 >
// // //                   Pricing
// // //                 </a>
// // //                 <a 
// // //                   href="#showcase" 
// // //                   onClick={() => setMobileMenuOpen(false)} 
// // //                   className="block text-gray-600 text-[16px] font-medium p-3 hover:bg-gray-50 rounded-xl transition-colors"
// // //                 >
// // //                   Showcase
// // //                 </a>
// // //               </div>
              
// // //               {/* Mobile Actions */}
// // //               <div className="pt-4 border-t border-gray-100 space-y-3">
// // //                 <button
// // //                   onClick={() => { setMobileMenuOpen(false); onLoginClick(); }}
// // //                   className="w-full text-gray-700 text-[16px] font-bold py-3 px-6 rounded-xl border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all"
// // //                 >
// // //                   Login
// // //                 </button>
// // //                 <button
// // //                   onClick={() => { setMobileMenuOpen(false); onBecomeSellerClick(); }}
// // //                   className="w-full bg-[#0040DF] text-white text-[16px] py-3 px-6 rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/30"
// // //                 >
// // //                   Become A Seller
// // //                 </button>
// // //               </div>
// // //             </div>
// // //           </div>
// // //         </>
// // //       )}
// // //     </nav>
// // //   );
// // // };

// // // // ═══════════════════════════════════════════════════════════════════════════
// // // // ✅ HERO SECTION - 1920px ALIGNED
// // // // ═══════════════════════════════════════════════════════════════════════════

// // // // ═══════════════════════════════════════════════════════════════════════════
// // // // ✅ HERO SECTION - RESPONSIVE & FLUID
// // // // ═══════════════════════════════════════════════════════════════════════════

// // // // const HeroSection: React.FC = () => {
// // // //   return (
// // // //     <section className="w-full max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-16 pt-12 sm:pt-24 lg:pt-32 pb-16 sm:pb-24 lg:pb-32">
      
// // // //       {/* ✅ Layout: Grid use kiya hai taaki screensize ke hisaab se space naturally divide ho */}
// // // //       <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 xl:gap-16 items-center">
        
// // // //         {/* ═══════════════════════════════════════════════════════════════
// // // //             LEFT SIDE: TEXT & BUTTONS (Fluid Width)
// // // //         ═══════════════════════════════════════════════════════════════ */}
// // // //         <div className="w-full flex flex-col gap-6 lg:gap-8 order-2 lg:order-1">
          
// // // //           <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600/10 rounded-full backdrop-blur-sm border border-purple-200/50 w-fit">
// // // //             <div className="w-2 h-2 bg-purple-600 rounded-full animate-pulse"></div>
// // // //             <span className="text-purple-700 text-sm lg:text-base font-semibold">
// // // //               AI-Powered Tile Visualization Platform
// // // //             </span>
// // // //           </div>

// // // //           <h1 className="text-[36px] sm:text-[48px] lg:text-[56px] xl:text-[64px] leading-[1.125] font-bold tracking-tight text-gray-900">
// // // //             See Tiles Before<br />
// // // //             <span className="text-[#0040DF]">Customers Buy</span>
// // // //           </h1>

// // // //           <p className="max-w-[512px] text-[16px] lg:text-[18px] leading-[1.55] text-gray-600">
// // // //             Transform your showroom with AI-powered 3D tile visualization. Let customers preview any material in their actual living spaces with photorealistic precision.
// // // //           </p>

// // // //           <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-4">
// // // //             <button 
// // // //               className="group w-full sm:w-auto flex items-center justify-center gap-2 bg-[#0040DF] hover:bg-blue-700 text-white px-8 py-[17px] rounded-full font-semibold transition-all shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 cursor-default opacity-90"
// // // //               disabled
// // // //             >
// // // //               Request Demo
// // // //               <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
// // // //             </button>

// // // //             <button 
// // // //               onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })}
// // // //               className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white/40 hover:bg-white/60 border border-white/60 backdrop-blur-md text-gray-900 px-8 py-4 rounded-full font-semibold transition-all"
// // // //             >
// // // //               <PlayCircle className="w-5 h-5" />
// // // //               Watch Live Preview
// // // //             </button>
// // // //           </div>
// // // //         </div>

// // // //         {/* ═══════════════════════════════════════════════════════════════
// // // //             RIGHT SIDE: ASYMMETRIC IMAGE LAYOUT (Fluid Aspect Ratio)
// // // //         ═══════════════════════════════════════════════════════════════ */}
// // // //         {/* ✅ Container: ab pixels nahi, aspect ratio maintain karega */}
// // // //         <div className="relative w-full max-w-[500px] sm:max-w-[600px] mx-auto lg:max-w-none aspect-square sm:aspect-[4/3] lg:aspect-square xl:aspect-[4/3] order-1 lg:order-2 flex items-center justify-center">
          
// // // //           {/* ✅ MAIN PREVIEW CARD: Container ka 85% space lega aur center me rahega */}
// // // //           <div className="absolute w-[90%] sm:w-[85%] lg:w-[80%] xl:w-[85%] aspect-[2.1/1] bg-white rounded-2xl sm:rounded-[24px] p-1 shadow-2xl z-10">
// // // //             <div className="relative w-full h-full rounded-[20px] overflow-hidden">
// // // //               <img 
// // // //                 src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
// // // //                 alt="Modern living room interior" 
// // // //                 className="w-full h-full object-cover"
// // // //                 loading="eager"
// // // //               />
// // // //               <div className="absolute inset-0 bg-gradient-to-tr from-black/10 via-transparent to-white/10"></div>

// // // //               {/* AI Center Pill */}
// // // //               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-2 sm:gap-3 lg:gap-4 bg-white/30 backdrop-blur-md border border-white/40 pr-4 lg:pr-6 pl-2 py-2 rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.1)] z-10 w-max">
// // // //                 <div className="w-[36px] h-[36px] sm:w-[42px] sm:h-[42px] lg:w-[48px] lg:h-[48px] bg-[#0040DF] rounded-full flex items-center justify-center text-white shrink-0 shadow-lg shadow-blue-500/30">
// // // //                   <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 animate-spin-slow" />
// // // //                 </div>
// // // //                 <div className="flex flex-col">
// // // //                   <span className="text-[12px] sm:text-[14px] lg:text-[15px] font-bold text-gray-900 leading-tight">
// // // //                     AI 3D Scan Active
// // // //                   </span>
// // // //                   <span className="hidden sm:block text-[11px] lg:text-[13px] font-medium text-gray-800/80 leading-tight">
// // // //                     Calibrating textures...
// // // //                   </span>
// // // //                 </div>
// // // //               </div>
// // // //             </div>
// // // //           </div>

// // // //           {/* ✅ TOP RIGHT CARD: Percentages use kiye hain placements ke liye */}
// // // //           <div className="absolute top-[2%] sm:top-[5%] right-[-2%] sm:right-[2%] lg:right-[-5%] xl:right-[5%] w-[140px] sm:w-[180px] xl:w-[192px] bg-white/40 border border-white/60 backdrop-blur-xl rounded-xl sm:rounded-[16px] p-3 sm:p-4 flex flex-col shadow-[0_20px_40px_rgba(0,0,0,0.08)] z-20 animate-fade-in-up"
// // // //                style={{ animationDelay: '0ms' }}>
// // // //             <img 
// // // //               src="https://images.unsplash.com/photo-1588863673322-2621aef42bf8?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80" 
// // // //               alt="Venetian Blue Tile" 
// // // //               className="w-full h-[90px] sm:h-[110px] xl:h-[128px] rounded-lg sm:rounded-[12px] object-cover mb-2 sm:mb-3 shadow-sm"
// // // //               loading="lazy"
// // // //             />
// // // //             <div className="flex flex-col gap-0.5 sm:gap-1">
// // // //               <span className="font-bold text-[14px] sm:text-[16px] text-gray-900 leading-tight">Venetian Blue</span>
// // // //               <span className="font-semibold text-[11px] sm:text-[13px] text-[#0040DF]">Living Room</span>
// // // //             </div>
// // // //           </div>

// // // //           {/* ✅ BOTTOM LEFT CARD: Percentages use kiye hain placements ke liye */}
// // // //           <div className="absolute bottom-[2%] sm:bottom-[5%] left-[-2%] sm:left-[2%] lg:left-[-5%] xl:left-[5%] w-[140px] sm:w-[180px] xl:w-[192px] bg-white/40 border border-white/60 backdrop-blur-xl rounded-xl sm:rounded-[16px] p-3 sm:p-4 flex flex-col shadow-[0_20px_40px_rgba(0,0,0,0.08)] z-20 animate-fade-in-up"
// // // //                style={{ animationDelay: '300ms' }}>
// // // //             <div className="w-full h-[90px] sm:h-[110px] xl:h-[128px] rounded-lg sm:rounded-[12px] overflow-hidden mb-2 sm:mb-3 relative group">
// // // //               <img 
// // // //                 src="https://images.unsplash.com/photo-1620626011761-996317b8d101?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80" 
// // // //                 alt="Noir Slate Bathroom" 
// // // //                 className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
// // // //                 loading="lazy"
// // // //               />
// // // //               <div className="absolute inset-0 bg-black/10"></div>
// // // //             </div>
// // // //             <div className="flex flex-col gap-0.5 sm:gap-1">
// // // //               <span className="font-bold text-[14px] sm:text-[16px] text-gray-900 leading-tight">Noir Slate</span>
// // // //               <span className="font-semibold text-[11px] sm:text-[13px] text-[#0040DF]">Master Bath</span>
// // // //             </div>
// // // //           </div>

// // // //         </div>
// // // //       </div>
// // // //     </section>
// // // //   );
// // // // } 

// // // const HeroSection: React.FC = () => {
// // //   return (
// // //     <section className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-16 pt-12 lg:pt-20 pb-16 lg:pb-24">
      
// // //       {/* Main Container - Flexbox Layout */}
// // //       <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16">
        
// // //         {/* ═══════════════════════════════════════════════════════════════
// // //             LEFT SIDE: TEXT CONTENT (Max-width 512px)
// // //         ═══════════════════════════════════════════════════════════════ */}
// // //         <div className="w-full lg:w-auto lg:max-w-[512px] flex flex-col gap-6 order-2 lg:order-1">
          
// // //           {/* AI Badge */}
// // //           <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600/10 rounded-full backdrop-blur-sm border border-purple-200/50 w-fit">
// // //             <Sparkles className="w-4 h-4 text-purple-600" />
// // //             <span className="text-purple-700 text-[14px] lg:text-[15px] font-semibold">
// // //               AI-Powered Tile Visualization Platform
// // //             </span>
// // //           </div>

// // //           {/* Heading */}
// // //           <h1 className="text-[36px] sm:text-[48px] lg:text-[56px] leading-[1.1] font-bold tracking-tight text-gray-900">
// // //             See Tiles Before<br />
// // //             <span className="text-[#0040DF]">Customers Buy</span>
// // //           </h1>

// // //           {/* Paragraph */}
// // //           <p className="max-w-[512px] text-[16px] lg:text-[18px] leading-[1.55] text-gray-500">
// // //             Transform your showroom with AI-powered 3D tile visualization. Let customers preview any material in their actual living spaces with photorealistic precision.
// // //           </p>

// // //           {/* Buttons Container */}
// // //           <div className="flex flex-col sm:flex-row items-start sm:items-center pt-4 gap-4">
            
// // //             {/* Primary Button */}
// // //             <button 
// // //               className="group w-full sm:w-auto flex items-center justify-center gap-2 bg-[#0040DF] hover:bg-blue-700 text-white px-8 py-[17px] rounded-full font-medium transition-all shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40"
// // //               onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })}
// // //             >
// // //               Request Demo
// // //               <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
// // //             </button>

// // //             {/* Secondary Button */}
// // //             <button 
// // //               onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })}
// // //               className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white/40 hover:bg-white/60 border border-white/60 backdrop-blur-md text-gray-900 px-8 py-4 rounded-full font-medium transition-all"
// // //             >
// // //               <Play className="w-5 h-5" fill="currentColor" />
// // //               Watch Live Preview
// // //             </button>
// // //           </div>
// // //         </div>

// // //         {/* ═══════════════════════════════════════════════════════════════
// // //             RIGHT SIDE: IMAGES CONTAINER (624x500px on desktop)
// // //         ═══════════════════════════════════════════════════════════════ */}
// // //         <div className="w-full lg:w-[624px] h-auto lg:h-[500px] relative order-1 lg:order-2 flex-shrink-0">
          
// // //           {/* Main Preview Card - Centered at left-35px top-116px */}
// // //           <div className="absolute left-0 top-0 lg:left-[35px] lg:top-[116px] w-full lg:w-[554px] h-[300px] sm:h-[350px] lg:h-[267px] bg-white rounded-[20px] lg:rounded-[24px] p-1 shadow-2xl z-10">
// // //             <div className="relative w-full h-full rounded-[16px] lg:rounded-[20px] overflow-hidden">
              
// // //               {/* Main Background Image */}
// // //               <img 
// // //                 src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&q=80&w=1200" 
// // //                 alt="Modern interior" 
// // //                 className="w-full h-full object-cover"
// // //                 loading="eager"
// // //               />
              
// // //               {/* Overlay Tint */}
// // //               <div className="absolute inset-0 bg-[#0A192F]/20 backdrop-brightness-95"></div>

// // //               {/* AI 3D Scan Active (Center Glass Pill) */}
// // //               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-3 lg:gap-4 bg-white/30 backdrop-blur-md border border-white/40 pr-4 lg:pr-6 pl-2 py-2 rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.1)] z-10 max-w-[90%]">
// // //                 <div className="w-[36px] h-[36px] lg:w-[42px] lg:h-[42px] bg-[#0040DF] rounded-full flex items-center justify-center text-white shrink-0 shadow-inner">
// // //                   <RefreshCcw className="w-4 h-4 lg:w-5 lg:h-5 animate-spin-slow" />
// // //                 </div>
// // //                 <div className="flex flex-col">
// // //                   <span className="text-[13px] lg:text-[15px] font-bold text-gray-900 leading-tight">
// // //                     AI 3D Scan Active
// // //                   </span>
// // //                   <span className="hidden sm:block text-[11px] lg:text-[13px] font-medium text-gray-800/80 leading-tight">
// // //                     Calibrating surface textures...
// // //                   </span>
// // //                 </div>
// // //               </div>
// // //             </div>
// // //           </div>

// // //           {/* Top-Right Floating Card ("Venetian Blue") */}
// // //           <div className="absolute left-[60%] top-[-30px] sm:left-[70%] sm:top-[-40px] lg:left-[416px] lg:top-[-40px] w-[150px] sm:w-[180px] lg:w-[192px] h-auto lg:h-[214px] bg-white/40 border border-white/60 backdrop-blur-md rounded-[14px] lg:rounded-[16px] p-3 lg:p-4 flex flex-col shadow-[0_20px_40px_rgba(0,0,0,0.08)] z-20 animate-fade-in-up"
// // //                style={{ animationDelay: '0ms' }}>
// // //             <img 
// // //               src="https://images.unsplash.com/photo-1590273016480-1a73f6ed9d53?auto=format&fit=crop&w=400&q=80" 
// // //               alt="Venetian Blue Tile" 
// // //               className="w-full h-[100px] sm:h-[120px] lg:h-[128px] rounded-[10px] lg:rounded-[12px] object-cover mb-3 lg:mb-4 shadow-sm"
// // //               loading="lazy"
// // //             />
// // //             <div className="flex flex-col">
// // //               <span className="font-bold text-[14px] lg:text-[16px] text-[#191C1E] leading-tight">
// // //                 Venetian Blue
// // //               </span>
// // //               <span className="font-medium text-[12px] lg:text-[13px] text-[#0040DF] mt-1">
// // //                 Living Room
// // //               </span>
// // //             </div>
// // //           </div>

// // //           {/* Bottom-Left Floating Card ("Noir Slate") */}
// // //           <div className="absolute left-0 top-[260px] sm:top-[300px] lg:left-[-16px] lg:top-[310px] w-[150px] sm:w-[180px] lg:w-[192px] h-auto lg:h-[214px] bg-white/40 border border-white/60 backdrop-blur-md rounded-[14px] lg:rounded-[16px] p-3 lg:p-4 flex flex-col shadow-[0_20px_40px_rgba(0,0,0,0.08)] z-20 animate-fade-in-up"
// // //                style={{ animationDelay: '300ms' }}>
// // //             <img 
// // //               src="https://images.unsplash.com/photo-1620214365969-2b6fb092d6e4?auto=format&fit=crop&q=80&w=400" 
// // //               alt="Noir Slate Tile" 
// // //               className="w-full h-[100px] sm:h-[120px] lg:h-[128px] rounded-[10px] lg:rounded-[12px] object-cover mb-3 lg:mb-4 shadow-sm"
// // //               loading="lazy"
// // //             />
// // //             <div className="flex flex-col">
// // //               <span className="font-bold text-[14px] lg:text-[16px] text-[#191C1E] leading-tight">
// // //                 Noir Slate
// // //               </span>
// // //               <span className="font-medium text-[12px] lg:text-[13px] text-[#0040DF] mt-1">
// // //                 Master Bath
// // //               </span>
// // //             </div>
// // //           </div>

// // //         </div>
// // //       </div>
// // //     </section>
// // //   );
// // // };

// // // // ═══════════════════════════════════════════════════════════════════════════
// // // // ✅ SELLER REQUEST FORM MODAL
// // // // ═══════════════════════════════════════════════════════════════════════════

// // // interface SellerRequestModalProps {
// // //   isOpen: boolean;
// // //   onClose: () => void;
// // // }

// // // const SellerRequestModal: React.FC<SellerRequestModalProps> = ({ isOpen, onClose }) => {
// // //   useEffect(() => {
// // //     if (isOpen) {
// // //       document.body.style.overflow = 'hidden';
// // //     } else {
// // //       document.body.style.overflow = 'unset';
// // //     }
// // //     return () => { document.body.style.overflow = 'unset'; };
// // //   }, [isOpen]);

// // //   if (!isOpen) return null;

// // //   return (
// // //     <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in-up">
// // //       <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-modal-in">
// // //         {/* Header */}
// // //         <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
// // //           <div>
// // //             <h2 className="text-2xl font-bold text-gray-900">Become A Seller</h2>
// // //             <p className="text-sm text-gray-600 mt-1">Join our platform and grow your tile business</p>
// // //           </div>
// // //           <button
// // //             onClick={onClose}
// // //             className="p-2 hover:bg-gray-100 rounded-full transition-colors"
// // //             aria-label="Close"
// // //           >
// // //             <X className="w-6 h-6 text-gray-600" />
// // //           </button>
// // //         </div>

// // //         {/* Form Content */}
// // //         <div className="p-6">
// // //           <SellerRequestForm onSuccess={onClose} />
// // //         </div>
// // //       </div>
// // //     </div>
// // //   );
// // // };

// // // // ═══════════════════════════════════════════════════════════════════════════
// // // // ✅ MAIN APP CONTENT COMPONENT
// // // // ═══════════════════════════════════════════════════════════════════════════

// // // function AppContent() {
// // //   const { isAuthenticated, isLoading, user, error } = useAuth({
// // //     enableActivityTracking: false,
// // //     enableSessionWarnings: false,
// // //     autoLogoutDelay: 0
// // //   });
  
// // //   const [showAuthModal, setShowAuthModal] = useState(false);
// // //   const [showPlansModal, setShowPlansModal] = useState(false);
// // //   const [showSellerRequestModal, setShowSellerRequestModal] = useState(false);
// // //   const [domainConfig, setDomainConfig] = useState(getCurrentDomainConfig());
// // //   const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
// // //   const [showPaymentConfirmation, setShowPaymentConfirmation] = useState(false);
// // //   const [checkoutOptions, setCheckoutOptions] = useState<RazorpayCheckoutOptions | null>(null);
// // //   const [paymentId, setPaymentId] = useState<string | null>(null);
// // //   const [processingPayment, setProcessingPayment] = useState(false);

// // //   // ═══════════════════════════════════════════════════════════════════════════
// // //   // ✅ APP INITIALIZATION
// // //   // ═══════════════════════════════════════════════════════════════════════════

// // //   useEffect(() => {
// // //     try {
// // //       console.log('🚀 Tile Showroom App initializing...');
      
// // //       const config = getCurrentDomainConfig();
// // //       setDomainConfig(config);
// // //       applyDomainTheme(config);
      
// // //       console.log('🎯 Domain config:', config);
// // //       console.log('👤 Auth state:', { 
// // //         isAuthenticated, 
// // //         isLoading, 
// // //         userRole: user?.role,
// // //         userId: user?.user_id 
// // //       });
      
// // //       document.title = config.title;
      
// // //       let viewport = document.querySelector('meta[name="viewport"]');
// // //       if (!viewport) {
// // //         viewport = document.createElement('meta');
// // //         viewport.setAttribute('name', 'viewport');
// // //         viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes');
// // //         document.head.appendChild(viewport);
// // //       }
      
// // //     } catch (error) {
// // //       console.error('🔥 App initialization error:', error);
// // //     }
// // //   }, [isAuthenticated, isLoading, user]);

// // //   // ═══════════════════════════════════════════════════════════════════════════
// // //   // ✅ WORKER ROUTE PROTECTION
// // //   // ═══════════════════════════════════════════════════════════════════════════

// // //   useEffect(() => {
// // //     if (isAuthenticated && user?.role === 'worker') {
// // //       const currentPath = window.location.pathname;
// // //       const allowedPaths = ['/scan', '/tile/', '/3d-view/', '/room-select/'];
// // //       const isAllowedPath = allowedPaths.some(path => currentPath.startsWith(path));
      
// // //       if (!isAllowedPath && currentPath !== '/') {
// // //         console.log('🔒 Worker blocked from:', currentPath);
// // //         window.location.replace('/scan');
// // //       }
// // //     }
// // //   }, [isAuthenticated, user]);

// // //   // ═══════════════════════════════════════════════════════════════════════════
// // //   // ✅ PAYMENT HANDLERS
// // //   // ═══════════════════════════════════════════════════════════════════════════

// // //   const handlePlanSelection = async (planId: string) => {
// // //     try {
// // //       console.log('📦 Selected plan:', planId);
      
// // //       if (!isAuthenticated) {
// // //         console.log('🔐 User not authenticated, showing login modal...');
// // //         setShowPlansModal(false);
// // //         setShowAuthModal(true);
// // //         return;
// // //       }

// // //       console.log('📋 Fetching plan details...');
// // //       const plan = await getPlanById(planId);
      
// // //       if (!plan) {
// // //         alert('❌ Plan not found. Please try again.');
// // //         return;
// // //       }

// // //       setSelectedPlan(plan);
// // //       setShowPlansModal(false);
// // //       setShowPaymentConfirmation(true);
      
// // //     } catch (error: any) {
// // //       console.error('❌ Error selecting plan:', error);
// // //       alert(`❌ Error: ${error.message}`);
// // //     }
// // //   };

// // //   const handlePaymentConfirm = async () => {
// // //     if (!selectedPlan) {
// // //       alert('❌ No plan selected');
// // //       return;
// // //     }

// // //     setProcessingPayment(true);

// // //     try {
// // //       console.log('💳 Initiating payment for plan:', selectedPlan.plan_name);

// // //       const currentUser = auth.currentUser;
// // //       if (!currentUser) {
// // //         throw new Error('Please login first');
// // //       }

// // //       const result = await initiatePayment(
// // //         selectedPlan.id,
// // //         selectedPlan.plan_name,
// // //         selectedPlan.price
// // //       );

// // //       if (!result.success || !result.checkoutOptions || !result.paymentId) {
// // //         throw new Error(result.error || 'Failed to initiate payment');
// // //       }

// // //       console.log('✅ Payment initiated successfully');
// // //       console.log('📝 Payment ID:', result.paymentId);

// // //       setCheckoutOptions(result.checkoutOptions);
// // //       setPaymentId(result.paymentId);
// // //       setShowPaymentConfirmation(false);

// // //     } catch (error: any) {
// // //       console.error('❌ Payment initiation error:', error);
// // //       alert(`❌ Payment Error:\n${error.message}`);
// // //       setProcessingPayment(false);
// // //     }
// // //   };

// // //   const handlePaymentError = (error: string) => {
// // //     console.error('❌ Payment checkout error:', error);
// // //     alert(`❌ Payment Error:\n${error}`);
    
// // //     setCheckoutOptions(null);
// // //     setPaymentId(null);
// // //     setProcessingPayment(false);
// // //     setSelectedPlan(null);
// // //   };

// // //   // ═══════════════════════════════════════════════════════════════════════════
// // //   // ✅ ERROR DISPLAY
// // //   // ═══════════════════════════════════════════════════════════════════════════

// // //   const renderError = () => {
// // //     if (!error) return null;
    
// // //     return (
// // //       <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 animate-shake">
// // //         <div className="flex items-start gap-3">
// // //           <div className="text-red-500 text-xl flex-shrink-0">⚠️</div>
// // //           <div className="flex-1">
// // //             <h3 className="font-semibold text-red-800 text-base mb-1">
// // //               Authentication Error
// // //             </h3>
// // //             <p className="text-red-700 text-sm break-words">{error}</p>
// // //           </div>
// // //           <button
// // //             onClick={() => window.location.reload()}
// // //             className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-700 transition-colors font-medium flex-shrink-0"
// // //           >
// // //             Retry
// // //           </button>
// // //         </div>
// // //       </div>
// // //     );
// // //   };

// // //   // ═══════════════════════════════════════════════════════════════════════════
// // //   // ✅ LOADING STATE
// // //   // ═══════════════════════════════════════════════════════════════════════════

// // //   const renderLoading = () => (
// // //     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
// // //       <div className="text-center max-w-md w-full">
// // //         <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-6"></div>
// // //         <h2 className="text-2xl font-semibold text-gray-800 mb-2">
// // //           {domainConfig.title}
// // //         </h2>
// // //         <p className="text-lg text-gray-600 mb-2">Loading application...</p>
// // //         <p className="text-sm text-gray-500">Initializing secure authentication system</p>
        
// // //         <div className="mt-6 space-y-2">
// // //           <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
// // //             <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
// // //             <span>Verifying authentication tokens</span>
// // //           </div>
// // //           <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
// // //             <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
// // //             <span>Loading user profile</span>
// // //           </div>
// // //           <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
// // //             <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
// // //             <span>Applying security policies</span>
// // //           </div>
// // //         </div>
// // //       </div>
// // //     </div>
// // //   );

// // //   // ═══════════════════════════════════════════════════════════════════════════
// // //   // ✅ SHOW LOADING IF AUTH IS LOADING
// // //   // ═══════════════════════════════════════════════════════════════════════════

// // //   if (isLoading) {
// // //     return renderLoading();
// // //   }

// // //   // ═══════════════════════════════════════════════════════════════════════════
// // //   // ✅ MAIN RENDER
// // //   // ═══════════════════════════════════════════════════════════════════════════

// // //   return (
// // //     <div className="flex flex-col min-h-screen bg-white">
// // //       {/* Global Styles */}
// // //       <GlobalStyles />
      
// // //       {/* Toast Notifications */}
// // //       <Toaster 
// // //         position="top-right"
// // //         reverseOrder={false}
// // //         gutter={8}
// // //         toastOptions={{
// // //           duration: 5000,
// // //           style: {
// // //             background: '#fff',
// // //             color: '#363636',
// // //             fontSize: '14px',
// // //             padding: '12px 16px',
// // //             borderRadius: '10px',
// // //             boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
// // //             maxWidth: '500px',
// // //           },
// // //           success: {
// // //             duration: 4000,
// // //             iconTheme: {
// // //               primary: '#10B981',
// // //               secondary: '#fff',
// // //             },
// // //           },
// // //           error: {
// // //             duration: 6000,
// // //             iconTheme: {
// // //               primary: '#EF4444',
// // //               secondary: '#fff',
// // //             },
// // //           },
// // //         }}
// // //       />

// // //       {/* Main Content */}
// // //       <div className="flex-1">
// // //         <Routes>
// // //           {/* QR SCAN ROUTES - PUBLIC ACCESS */}
// // //           <Route path="/tile/:tileId" element={<TileDetailsPage />} />
// // //           <Route path="/room-select/:tileId" element={<RoomSelectorPage />} />
// // //           <Route path="/3d-view/:tileId/:roomType" element={<Room3DViewPage />} />
// // //           <Route path="/tile/search" element={<TileSearchPage />} />

// // //           {/* WORKER SCAN PAGE */}
// // //           <Route
// // //             path="/scan"
// // //             element={
// // //               <WorkerProtectedRoute>
// // //                 <WorkerErrorBoundary>
// // //                   <ScanPage />
// // //                 </WorkerErrorBoundary>
// // //               </WorkerProtectedRoute>
// // //             }
// // //           />

// // //           {/* SELLER AUTO-LOGIN */}
// // //           <Route path="/seller-auto-login" element={<SellerAutoLogin />} />

// // //           {/* PAYMENT ROUTES */}
// // //           <Route path="/payment-success" element={<PaymentSuccess />} />
// // //           <Route path="/payment-failure" element={<PaymentFailure />} />
// // //           <Route 
// // //             path="/payment-cancelled" 
// // //             element={
// // //               <Navigate 
// // //                 to="/payment-failure?error=Payment cancelled by user" 
// // //                 replace 
// // //               />
// // //             } 
// // //           />

// // //           {/* ADMIN DASHBOARD */}
// // //           <Route
// // //             path="/admin/*"
// // //             element={
// // //               <AdminProtectedRoute>
// // //                 <DomainHeader />
// // //                 {/* ✅ FIXED: Dashboard wrapper using 1920px logic */}
// // //                 <main className="w-full max-w-[1920px] mx-auto px-3 md:px-5 py-6 lg:py-8">
// // //                   {renderError()}
// // //                   <AdminDashboard />
// // //                 </main>
// // //               </AdminProtectedRoute>
// // //             }
// // //           />

// // //           {/* SELLER DASHBOARD */}
// // //           <Route
// // //             path="/seller/*"
// // //             element={
// // //               <SellerProtectedRoute>
// // //                 <DomainHeader />
// // //                 {/* ✅ FIXED: Dashboard wrapper using 1920px logic */}
// // //                 <main className="w-full max-w-[1920px] mx-auto px-3 md:px-5 py-6 lg:py-8">
// // //                   {renderError()}
// // //                   <SellerDashboard />
// // //                 </main>
// // //               </SellerProtectedRoute>
// // //             }
// // //           />

// // //           {/* PUBLIC/CUSTOMER ROUTES */}
// // //           <Route
// // //             path="/*"
// // //             element={
// // //               <ProtectedRoute allowUnauthenticated={true}>
                
// // //                 {/* Hero Section with Navigation */}
// // //                 <div className="relative w-full bg-gradient-to-br from-white via-blue-50/30 to-purple-50/20 overflow-hidden">
// // //                   <Navigation 
// // //                     onLoginClick={() => setShowAuthModal(true)}
// // //                     onBecomeSellerClick={() => setShowSellerRequestModal(true)}
// // //                   />
// // //                   <HeroSection />
// // //                 </div>

// // //                 {/* Main Content (Showroom) */}
// // //                 <main className="w-full">
// // //                   {renderError()}
                  
// // //                   {/* ✅ FIXED: Public Showroom container using 1920px logic */}
// // //                   <div className="w-full max-w-[1920px] mx-auto px-3 md:px-5 py-8 lg:py-16">
// // //                     <div className="space-y-8">
// // //                       <PublicShowroom />
// // //                     </div>
// // //                   </div>
// // //                 </main>

// // //                 {/* Additional Sections - ALL SYNCHRONIZED TO 1920px WIDTH */}
// // //                 <FeatureGuide />
// // //                 <Guide />
// // //                 <Statistics />
// // //                 <Banner />
// // //                 <Footer />

// // //                 {/* Floating QR Button */}
// // //                 <FloatingQRButton />
// // //               </ProtectedRoute>
// // //             }
// // //           />

// // //           {/* CATCH-ALL REDIRECT */}
// // //           <Route path="*" element={<Navigate to="/" replace />} />
// // //         </Routes>
// // //       </div>

// // //       {/* Modals */}
// // //       <AuthModal 
// // //         isOpen={showAuthModal} 
// // //         onClose={() => setShowAuthModal(false)} 
// // //       />

// // //       <SellerRequestModal
// // //         isOpen={showSellerRequestModal}
// // //         onClose={() => setShowSellerRequestModal(false)}
// // //       />

// // //       <PlansModal
// // //         isOpen={showPlansModal}
// // //         onClose={() => setShowPlansModal(false)}
// // //         isLoggedIn={isAuthenticated}
// // //         onSelectPlan={handlePlanSelection}
// // //       />

// // //       <PaymentConfirmationModal
// // //         isOpen={showPaymentConfirmation}
// // //         onClose={() => {
// // //           setShowPaymentConfirmation(false);
// // //           setSelectedPlan(null);
// // //         }}
// // //         plan={selectedPlan}
// // //         onConfirm={handlePaymentConfirm}
// // //         isProcessing={processingPayment}
// // //       />

// // //       {checkoutOptions && paymentId && selectedPlan && (
// // //         <PaymentCheckout
// // //           checkoutOptions={checkoutOptions}
// // //           paymentId={paymentId}
// // //           planId={selectedPlan.id}
// // //           sellerId={user?.uid || ''}
// // //           onError={handlePaymentError}
// // //         />
// // //       )}
// // //     </div>
// // //   );
// // // }

// // // // ═══════════════════════════════════════════════════════════════════════════
// // // // ✅ APP WRAPPER WITH ROUTER
// // // // ═══════════════════════════════════════════════════════════════════════════

// // // function App() {
// // //   return (
// // //     <ErrorBoundary>
// // //       <Router>
// // //         <AppContent />
// // //       </Router>
// // //     </ErrorBoundary>
// // //   );
// // // }

// // // export default App; 
// // import React, { useState, useEffect } from 'react';
// // import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// // import { ProtectedRoute, AdminProtectedRoute, SellerProtectedRoute } from './components/ProtectedRoute';
// // import { WorkerProtectedRoute } from './components/WorkerProtectedRoute';
// // import { PlansModal } from './components/Payment/PlansModal';
// // import { PaymentSuccess } from './components/Payment/PaymentSuccess';
// // import { PaymentFailure } from './components/Payment/PaymentFailure';
// // import { useAuth } from './hooks/useAuth';
// // import { auth } from './lib/firebase';
// // import { DomainHeader } from './components/DomainHeader';
// // import { SellerDashboard } from './components/SellerDashboard';
// // import { AdminDashboard } from './components/AdminDashboard';
// // import { PublicShowroom } from './components/PublicShowroom';
// // import { SellerRequestForm } from './components/SellerRequestForm';
// // import { AuthModal } from './components/Auth/AuthModal';
// // import { FloatingQRButton } from './components/FloatingQRButton';
// // import { TileDetailsPage } from './components/TileDetailsPage';
// // import { RoomSelectorPage } from './components/RoomSelectorPage';
// // import { Room3DViewPage } from './components/Room3DViewPage';
// // import { TileSearchPage } from './components/TileSearchPage';
// // import { ScanPage } from './components/ScanPage';
// // import { getCurrentDomainConfig, applyDomainTheme } from './utils/domainUtils';
// // import { WorkerErrorBoundary } from './components/WorkerErrorBoundary';
// // import { SellerAutoLogin } from './components/SellerAutoLogin';
// // import { Toaster } from 'react-hot-toast';
// // import { ArrowRight, PlayCircle, RefreshCw, Menu, X, Play, Sparkles, RefreshCcw } from 'lucide-react';
// // import { PaymentConfirmationModal } from './components/Payment/PaymentConfirmationModal';
// // import { PaymentCheckout } from './components/Payment/PaymentCheckout';
// // import { initiatePayment } from './lib/paymentService';
// // import { getPlanById } from './lib/planService';
// // import type { Plan } from './types/plan.types';
// // import type { RazorpayCheckoutOptions } from './types/payment.types';
// // import { FeatureGuide } from './components/Feature';
// // import { Guide } from './components/Guide';
// // import Banner from './components/Banner';
// // import { Footer } from './components/Footer';
// // import Statistics from './components/Statistics';

// // // ═══════════════════════════════════════════════════════════════════════════
// // // ✅ GLOBAL STYLES
// // // ═══════════════════════════════════════════════════════════════════════════

// // const GlobalStyles = () => (
// //   <style dangerouslySetInnerHTML={{__html: `
// //     @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
    
// //     * {
// //       font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
// //     }
    
// //     html {
// //       scroll-behavior: smooth;
// //       scroll-padding-top: 100px;
// //     }
    
// //     @keyframes fadeInUp {
// //       from { opacity: 0; transform: translateY(20px); }
// //       to { opacity: 1; transform: translateY(0); }
// //     }
// //     .animate-fade-in-up {
// //       animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
// //       opacity: 0;
// //     }
    
// //     @keyframes spin-slow {
// //       from { transform: rotate(0deg); }
// //       to { transform: rotate(360deg); }
// //     }
// //     .animate-spin-slow {
// //       animation: spin-slow 4s linear infinite;
// //     }
    
// //     @keyframes slideDownMenu {
// //       from { opacity: 0; transform: translateY(-15px); }
// //       to { opacity: 1; transform: translateY(0); }
// //     }
// //     .animate-slide-down {
// //       animation: slideDownMenu 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
// //     }

// //     @keyframes modalFadeIn {
// //       from { opacity: 0; transform: scale(0.95); }
// //       to { opacity: 1; transform: scale(1); }
// //     }
// //     .animate-modal-in {
// //       animation: modalFadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
// //     }

// //     ::-webkit-scrollbar {
// //       width: 10px;
// //       height: 10px;
// //     }
// //     ::-webkit-scrollbar-track {
// //       background: #f1f1f1;
// //     }
// //     ::-webkit-scrollbar-thumb {
// //       background: #888;
// //       border-radius: 5px;
// //     }
// //     ::-webkit-scrollbar-thumb:hover {
// //       background: #555;
// //     }
// //   `}} />
// // );

// // // ═══════════════════════════════════════════════════════════════════════════
// // // ✅ ERROR BOUNDARY
// // // ═══════════════════════════════════════════════════════════════════════════

// // class ErrorBoundary extends React.Component<
// //   { children: React.ReactNode },
// //   { hasError: boolean; error?: Error }
// // > {
// //   constructor(props: { children: React.ReactNode }) {
// //     super(props);
// //     this.state = { hasError: false };
// //   }

// //   static getDerivedStateFromError(error: Error) {
// //     return { hasError: true, error };
// //   }

// //   componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
// //     console.error('🔥 App Error Boundary:', error, errorInfo);
// //   }

// //   render() {
// //     if (this.state.hasError) {
// //       return (
// //         <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center p-4">
// //           <div className="text-center p-8 bg-white rounded-xl shadow-2xl max-w-md w-full">
// //             <div className="text-red-500 text-6xl mb-4">⚠️</div>
// //             <h1 className="text-2xl font-bold text-gray-800 mb-4">Something went wrong</h1>
// //             <p className="text-gray-600 mb-6">
// //               The application encountered an unexpected error. Please refresh the page.
// //             </p>
// //             {this.state.error && (
// //               <details className="mb-6 text-left">
// //                 <summary className="text-sm text-gray-500 cursor-pointer hover:text-gray-700">
// //                   Error details
// //                 </summary>
// //                 <pre className="mt-2 p-3 bg-gray-100 rounded text-xs overflow-x-auto">
// //                   {this.state.error.message}
// //                 </pre>
// //               </details>
// //             )}
// //             <button
// //               onClick={() => window.location.reload()}
// //               className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors font-semibold shadow-lg"
// //             >
// //               Refresh Page
// //             </button>
// //           </div>
// //         </div>
// //       );
// //     }

// //     return this.props.children;
// //   }
// // }

// // // ═══════════════════════════════════════════════════════════════════════════
// // // ✅ NAVIGATION - COMPACT & ALIGNED (1800px)
// // // ═══════════════════════════════════════════════════════════════════════════

// // interface NavigationProps {
// //   onLoginClick: () => void;
// //   onBecomeSellerClick: () => void;
// // }

// // const Navigation: React.FC<NavigationProps> = ({ onLoginClick, onBecomeSellerClick }) => {
// //   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

// //   useEffect(() => {
// //     if (mobileMenuOpen) {
// //       document.body.style.overflow = 'hidden';
// //     } else {
// //       document.body.style.overflow = 'unset';
// //     }
// //     return () => { document.body.style.overflow = 'unset'; };
// //   }, [mobileMenuOpen]);

// //   return (
// //     // ✅ FIXED: 1800px max-width + px-3 md:px-5
// //     <nav className="w-full max-w-[1800px] mx-auto px-3 md:px-5 py-6 lg:py-8 flex items-center justify-between relative z-40">
      
// //       {/* Logo */}
// //       <div className="flex items-center gap-3 cursor-pointer">
// //         <div className="relative w-7 h-7 lg:w-8 lg:h-8 flex items-center justify-center flex-shrink-0">
// //           <div className="absolute top-0 left-0 w-4 h-4 bg-indigo-300 rounded-[3px]"></div>
// //           <div className="absolute bottom-0 right-0 w-4 h-4 bg-[#0040DF] rounded-[3px] mix-blend-multiply"></div>
// //         </div>
// //         <span className="font-bold text-[20px] lg:text-[26px] tracking-tight text-gray-900">
// //           Tilesview360
// //         </span>
// //       </div>

// //       {/* Desktop Navigation Links */}
// //       <div className="hidden lg:flex items-center gap-10 xl:gap-12">
// //         <a 
// //           href="#product" 
// //           className="text-gray-900 text-[16px] xl:text-[18px] font-semibold relative after:content-[''] after:absolute after:left-0 after:-bottom-1.5 after:w-full after:h-0.5 after:bg-[#0040DF] hover:text-gray-700 transition-colors"
// //         >
// //           Product
// //         </a>
// //         <a 
// //           href="#features" 
// //           className="text-gray-600 text-[16px] xl:text-[18px] font-medium hover:text-gray-900 transition-colors duration-200"
// //         >
// //           Features
// //         </a>
// //         <a 
// //           href="#pricing" 
// //           className="text-gray-600 text-[16px] xl:text-[18px] font-medium hover:text-gray-900 transition-colors duration-200"
// //         >
// //           Pricing
// //         </a>
// //         <a 
// //           href="#showcase" 
// //           className="text-gray-600 text-[16px] xl:text-[18px] font-medium hover:text-gray-900 transition-colors duration-200"
// //         >
// //           Showcase
// //         </a>
// //       </div>

// //       {/* Desktop Right Actions */}
// //       <div className="hidden lg:flex items-center gap-8 xl:gap-10">
// //         <button 
// //           onClick={onLoginClick} 
// //           className="text-gray-700 text-[16px] xl:text-[18px] font-bold hover:text-gray-900 transition-colors duration-200"
// //         >
// //           Login
// //         </button>
// //         <button 
// //           onClick={onBecomeSellerClick} 
// //           className="bg-[#0040DF] text-white text-[16px] xl:text-[18px] px-8 xl:px-9 py-3.5 xl:py-4 rounded-full font-semibold hover:bg-blue-700 transition-all duration-200 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40"
// //         >
// //           Become A Seller
// //         </button>
// //       </div>

// //       {/* Mobile Menu Button */}
// //       <button
// //         onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
// //         className="lg:hidden relative z-[70] p-2 bg-gray-50 hover:bg-gray-100 rounded-full text-gray-800 transition-colors shadow-sm"
// //         aria-label="Toggle menu"
// //       >
// //         {mobileMenuOpen ? (
// //           <X className="w-6 h-6 stroke-[2.5px]" />
// //         ) : (
// //           <Menu className="w-6 h-6 stroke-[2.5px]" />
// //         )}
// //       </button>

// //       {/* Mobile Menu Overlay */}
// //       {mobileMenuOpen && (
// //         <>
// //           <div 
// //             className="lg:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-[50] animate-fade-in-up"
// //             style={{ animationDuration: '0.3s' }}
// //             onClick={() => setMobileMenuOpen(false)}
// //           />
// //           <div className="lg:hidden fixed top-0 left-0 right-0 pt-[88px] pb-6 px-6 bg-white border-b border-gray-200 shadow-2xl z-[60] animate-slide-down rounded-b-[2rem]">
// //             <div className="max-w-md mx-auto space-y-6">
// //               <div className="space-y-2">
// //                 <a 
// //                   href="#product" 
// //                   onClick={() => setMobileMenuOpen(false)} 
// //                   className="block text-gray-900 text-[16px] font-semibold p-3 bg-gray-50 rounded-xl hover:bg-blue-50 hover:text-[#0040DF] transition-colors"
// //                 >
// //                   Product
// //                 </a>
// //                 <a 
// //                   href="#features" 
// //                   onClick={() => setMobileMenuOpen(false)} 
// //                   className="block text-gray-600 text-[16px] font-medium p-3 hover:bg-gray-50 rounded-xl transition-colors"
// //                 >
// //                   Features
// //                 </a>
// //                 <a 
// //                   href="#pricing" 
// //                   onClick={() => setMobileMenuOpen(false)} 
// //                   className="block text-gray-600 text-[16px] font-medium p-3 hover:bg-gray-50 rounded-xl transition-colors"
// //                 >
// //                   Pricing
// //                 </a>
// //                 <a 
// //                   href="#showcase" 
// //                   onClick={() => setMobileMenuOpen(false)} 
// //                   className="block text-gray-600 text-[16px] font-medium p-3 hover:bg-gray-50 rounded-xl transition-colors"
// //                 >
// //                   Showcase
// //                 </a>
// //               </div>
              
// //               <div className="pt-4 border-t border-gray-100 space-y-3">
// //                 <button
// //                   onClick={() => { setMobileMenuOpen(false); onLoginClick(); }}
// //                   className="w-full text-gray-700 text-[16px] font-bold py-3 px-6 rounded-xl border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all"
// //                 >
// //                   Login
// //                 </button>
// //                 <button
// //                   onClick={() => { setMobileMenuOpen(false); onBecomeSellerClick(); }}
// //                   className="w-full bg-[#0040DF] text-white text-[16px] py-3 px-6 rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/30"
// //                 >
// //                   Become A Seller
// //                 </button>
// //               </div>
// //             </div>
// //           </div>
// //         </>
// //       )}
// //     </nav>
// //   );
// // };

// // // ═══════════════════════════════════════════════════════════════════════════
// // // ✅ HERO SECTION - COMPACT SPACING, LARGER CONTAINERS (1800px)
// // // ═══════════════════════════════════════════════════════════════════════════

// // const HeroSection: React.FC = () => {
// //   return (
// //     // ✅ FIXED: 1800px max-width + px-3 md:px-5
// //     <section className="w-full max-w-[1800px] mx-auto px-3 md:px-5 pt-12 lg:pt-20 pb-16 lg:pb-24">
      
// //       {/* ✅ FIXED: gap-12 lg:gap-16 se gap-8 lg:gap-10 (COMPACT) */}
// //       <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-10">
        
// //         {/* ═══════════════════════════════════════════════════════════════
// //             LEFT SIDE: TEXT CONTENT (INCREASED WIDTH: 600px)
// //         ═══════════════════════════════════════════════════════════════ */}
// //         {/* ✅ FIXED: max-w-[512px] se max-w-[600px] (WIDER) */}
// //         <div className="w-full lg:w-auto lg:max-w-[600px] flex flex-col gap-6 order-2 lg:order-1">
          
// //           {/* AI Badge */}
// //           <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600/10 rounded-full backdrop-blur-sm border border-purple-200/50 w-fit">
// //             <Sparkles className="w-4 h-4 text-purple-600" />
// //             <span className="text-purple-700 text-[14px] lg:text-[15px] font-semibold">
// //               AI-Powered Tile Visualization Platform
// //             </span>
// //           </div>

// //           {/* Heading - INCREASED SIZE */}
// //           {/* ✅ FIXED: text-[56px] se text-[60px] xl:text-[68px] (LARGER) */}
// //           <h1 className="text-[38px] sm:text-[50px] lg:text-[60px] xl:text-[68px] leading-[1.1] font-bold tracking-tight text-gray-900">
// //             See Tiles Before<br />
// //             <span className="text-[#0040DF]">Customers Buy</span>
// //           </h1>

// //           {/* Paragraph - INCREASED SIZE */}
// //           {/* ✅ FIXED: text-[18px] se text-[19px] xl:text-[20px] (LARGER) */}
// //           <p className="max-w-[580px] text-[17px] lg:text-[19px] xl:text-[20px] leading-[1.6] text-gray-500">
// //             Transform your showroom with AI-powered 3D tile visualization. Let customers preview any material in their actual living spaces with photorealistic precision.
// //           </p>

// //           {/* Buttons Container */}
// //           <div className="flex flex-col sm:flex-row items-start sm:items-center pt-4 gap-4">
            
// //             {/* Primary Button - INCREASED SIZE */}
// //             <button 
// //               className="group w-full sm:w-auto flex items-center justify-center gap-2 bg-[#0040DF] hover:bg-blue-700 text-white px-9 xl:px-10 py-4 xl:py-[18px] rounded-full font-medium text-[17px] xl:text-[18px] transition-all shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40"
// //               onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })}
// //             >
// //               Request Demo
// //               <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
// //             </button>

// //             {/* Secondary Button - INCREASED SIZE */}
// //             <button 
// //               onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })}
// //               className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white/40 hover:bg-white/60 border border-white/60 backdrop-blur-md text-gray-900 px-9 xl:px-10 py-4 xl:py-[18px] rounded-full font-medium text-[17px] xl:text-[18px] transition-all"
// //             >
// //               <Play className="w-5 h-5" fill="currentColor" />
// //               Watch Live Preview
// //             </button>
// //           </div>
// //         </div>

// //         {/* ═══════════════════════════════════════════════════════════════
// //             RIGHT SIDE: IMAGES CONTAINER (INCREASED WIDTH: 700px)
// //         ═══════════════════════════════════════════════════════════════ */}
// //         {/* ✅ FIXED: w-[624px] se w-[700px], h-[500px] se h-[550px] (LARGER) */}
// //         <div className="w-full lg:w-[700px] h-auto lg:h-[550px] relative order-1 lg:order-2 flex-shrink-0">
          
// //           {/* Main Preview Card - INCREASED SIZE */}
// //           {/* ✅ FIXED: w-[554px] se w-[620px], h-[267px] se h-[300px] (LARGER) */}
// //           <div className="absolute left-0 top-0 lg:left-[40px] lg:top-[125px] w-full lg:w-[620px] h-[300px] sm:h-[350px] lg:h-[300px] bg-white rounded-[20px] lg:rounded-[24px] p-1 shadow-2xl z-10">
// //             <div className="relative w-full h-full rounded-[16px] lg:rounded-[20px] overflow-hidden">
              
// //               <img 
// //                 src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&q=80&w=1200" 
// //                 alt="Modern interior" 
// //                 className="w-full h-full object-cover"
// //                 loading="eager"
// //               />
              
// //               <div className="absolute inset-0 bg-[#0A192F]/20 backdrop-brightness-95"></div>

// //               {/* AI 3D Scan Active */}
// //               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-3 lg:gap-4 bg-white/30 backdrop-blur-md border border-white/40 pr-4 lg:pr-6 pl-2 py-2 rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.1)] z-10 max-w-[90%]">
// //                 <div className="w-[36px] h-[36px] lg:w-[42px] lg:h-[42px] bg-[#0040DF] rounded-full flex items-center justify-center text-white shrink-0 shadow-inner">
// //                   <RefreshCcw className="w-4 h-4 lg:w-5 lg:h-5 animate-spin-slow" />
// //                 </div>
// //                 <div className="flex flex-col">
// //                   <span className="text-[13px] lg:text-[15px] font-bold text-gray-900 leading-tight">
// //                     AI 3D Scan Active
// //                   </span>
// //                   <span className="hidden sm:block text-[11px] lg:text-[13px] font-medium text-gray-800/80 leading-tight">
// //                     Calibrating surface textures...
// //                   </span>
// //                 </div>
// //               </div>
// //             </div>
// //           </div>

// //           {/* Top-Right Floating Card - INCREASED SIZE */}
// //           {/* ✅ FIXED: w-[192px] se w-[210px], h-[214px] se h-[235px] (LARGER) */}
// //           <div className="absolute left-[60%] top-[-30px] sm:left-[70%] sm:top-[-40px] lg:left-[470px] lg:top-[-40px] w-[160px] sm:w-[190px] lg:w-[210px] h-auto lg:h-[235px] bg-white/40 border border-white/60 backdrop-blur-md rounded-[14px] lg:rounded-[16px] p-3 lg:p-4 flex flex-col shadow-[0_20px_40px_rgba(0,0,0,0.08)] z-20 animate-fade-in-up"
// //                style={{ animationDelay: '0ms' }}>
// //             <img 
// //               src="https://images.unsplash.com/photo-1590273016480-1a73f6ed9d53?auto=format&fit=crop&w=400&q=80" 
// //               alt="Venetian Blue Tile" 
// //               className="w-full h-[110px] sm:h-[130px] lg:h-[140px] rounded-[10px] lg:rounded-[12px] object-cover mb-3 lg:mb-4 shadow-sm"
// //               loading="lazy"
// //             />
// //             <div className="flex flex-col">
// //               <span className="font-bold text-[15px] lg:text-[17px] text-[#191C1E] leading-tight">
// //                 Venetian Blue
// //               </span>
// //               <span className="font-medium text-[13px] lg:text-[14px] text-[#0040DF] mt-1">
// //                 Living Room
// //               </span>
// //             </div>
// //           </div>

// //           {/* Bottom-Left Floating Card - INCREASED SIZE */}
// //           {/* ✅ FIXED: w-[192px] se w-[210px], h-[214px] se h-[235px] (LARGER) */}
// //           <div className="absolute left-0 top-[260px] sm:top-[300px] lg:left-[-20px] lg:top-[335px] w-[160px] sm:w-[190px] lg:w-[210px] h-auto lg:h-[235px] bg-white/40 border border-white/60 backdrop-blur-md rounded-[14px] lg:rounded-[16px] p-3 lg:p-4 flex flex-col shadow-[0_20px_40px_rgba(0,0,0,0.08)] z-20 animate-fade-in-up"
// //                style={{ animationDelay: '300ms' }}>
// //             <img 
// //               src="https://images.unsplash.com/photo-1620214365969-2b6fb092d6e4?auto=format&fit=crop&q=80&w=400" 
// //               alt="Noir Slate Tile" 
// //               className="w-full h-[110px] sm:h-[130px] lg:h-[140px] rounded-[10px] lg:rounded-[12px] object-cover mb-3 lg:mb-4 shadow-sm"
// //               loading="lazy"
// //             />
// //             <div className="flex flex-col">
// //               <span className="font-bold text-[15px] lg:text-[17px] text-[#191C1E] leading-tight">
// //                 Noir Slate
// //               </span>
// //               <span className="font-medium text-[13px] lg:text-[14px] text-[#0040DF] mt-1">
// //                 Master Bath
// //               </span>
// //             </div>
// //           </div>

// //         </div>
// //       </div>
// //     </section>
// //   );
// // };

// // // ═══════════════════════════════════════════════════════════════════════════
// // // ✅ SELLER REQUEST MODAL
// // // ═══════════════════════════════════════════════════════════════════════════

// // interface SellerRequestModalProps {
// //   isOpen: boolean;
// //   onClose: () => void;
// // }

// // const SellerRequestModal: React.FC<SellerRequestModalProps> = ({ isOpen, onClose }) => {
// //   useEffect(() => {
// //     if (isOpen) {
// //       document.body.style.overflow = 'hidden';
// //     } else {
// //       document.body.style.overflow = 'unset';
// //     }
// //     return () => { document.body.style.overflow = 'unset'; };
// //   }, [isOpen]);

// //   if (!isOpen) return null;

// //   return (
// //     <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in-up">
// //       <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-modal-in">
// //         <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
// //           <div>
// //             <h2 className="text-2xl font-bold text-gray-900">Become A Seller</h2>
// //             <p className="text-sm text-gray-600 mt-1">Join our platform and grow your tile business</p>
// //           </div>
// //           <button
// //             onClick={onClose}
// //             className="p-2 hover:bg-gray-100 rounded-full transition-colors"
// //             aria-label="Close"
// //           >
// //             <X className="w-6 h-6 text-gray-600" />
// //           </button>
// //         </div>
// //         <div className="p-6">
// //           <SellerRequestForm onSuccess={onClose} />
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // // ═══════════════════════════════════════════════════════════════════════════
// // // ✅ MAIN APP CONTENT COMPONENT
// // // ═══════════════════════════════════════════════════════════════════════════

// // function AppContent() {
// //   const { isAuthenticated, isLoading, user, error } = useAuth({
// //     enableActivityTracking: false,
// //     enableSessionWarnings: false,
// //     autoLogoutDelay: 0
// //   });
  
// //   const [showAuthModal, setShowAuthModal] = useState(false);
// //   const [showPlansModal, setShowPlansModal] = useState(false);
// //   const [showSellerRequestModal, setShowSellerRequestModal] = useState(false);
// //   const [domainConfig, setDomainConfig] = useState(getCurrentDomainConfig());
// //   const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
// //   const [showPaymentConfirmation, setShowPaymentConfirmation] = useState(false);
// //   const [checkoutOptions, setCheckoutOptions] = useState<RazorpayCheckoutOptions | null>(null);
// //   const [paymentId, setPaymentId] = useState<string | null>(null);
// //   const [processingPayment, setProcessingPayment] = useState(false);

// //   useEffect(() => {
// //     try {
// //       console.log('🚀 Tile Showroom App initializing...');
      
// //       const config = getCurrentDomainConfig();
// //       setDomainConfig(config);
// //       applyDomainTheme(config);
      
// //       console.log('🎯 Domain config:', config);
// //       console.log('👤 Auth state:', { 
// //         isAuthenticated, 
// //         isLoading, 
// //         userRole: user?.role,
// //         userId: user?.user_id 
// //       });
      
// //       document.title = config.title;
      
// //       let viewport = document.querySelector('meta[name="viewport"]');
// //       if (!viewport) {
// //         viewport = document.createElement('meta');
// //         viewport.setAttribute('name', 'viewport');
// //         viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes');
// //         document.head.appendChild(viewport);
// //       }
      
// //     } catch (error) {
// //       console.error('🔥 App initialization error:', error);
// //     }
// //   }, [isAuthenticated, isLoading, user]);

// //   useEffect(() => {
// //     if (isAuthenticated && user?.role === 'worker') {
// //       const currentPath = window.location.pathname;
// //       const allowedPaths = ['/scan', '/tile/', '/3d-view/', '/room-select/'];
// //       const isAllowedPath = allowedPaths.some(path => currentPath.startsWith(path));
      
// //       if (!isAllowedPath && currentPath !== '/') {
// //         console.log('🔒 Worker blocked from:', currentPath);
// //         window.location.replace('/scan');
// //       }
// //     }
// //   }, [isAuthenticated, user]);

// //   const handlePlanSelection = async (planId: string) => {
// //     try {
// //       console.log('📦 Selected plan:', planId);
      
// //       if (!isAuthenticated) {
// //         console.log('🔐 User not authenticated, showing login modal...');
// //         setShowPlansModal(false);
// //         setShowAuthModal(true);
// //         return;
// //       }

// //       console.log('📋 Fetching plan details...');
// //       const plan = await getPlanById(planId);
      
// //       if (!plan) {
// //         alert('❌ Plan not found. Please try again.');
// //         return;
// //       }

// //       setSelectedPlan(plan);
// //       setShowPlansModal(false);
// //       setShowPaymentConfirmation(true);
      
// //     } catch (error: any) {
// //       console.error('❌ Error selecting plan:', error);
// //       alert(`❌ Error: ${error.message}`);
// //     }
// //   };

// //   const handlePaymentConfirm = async () => {
// //     if (!selectedPlan) {
// //       alert('❌ No plan selected');
// //       return;
// //     }

// //     setProcessingPayment(true);

// //     try {
// //       console.log('💳 Initiating payment for plan:', selectedPlan.plan_name);

// //       const currentUser = auth.currentUser;
// //       if (!currentUser) {
// //         throw new Error('Please login first');
// //       }

// //       const result = await initiatePayment(
// //         selectedPlan.id,
// //         selectedPlan.plan_name,
// //         selectedPlan.price
// //       );

// //       if (!result.success || !result.checkoutOptions || !result.paymentId) {
// //         throw new Error(result.error || 'Failed to initiate payment');
// //       }

// //       console.log('✅ Payment initiated successfully');
// //       console.log('📝 Payment ID:', result.paymentId);

// //       setCheckoutOptions(result.checkoutOptions);
// //       setPaymentId(result.paymentId);
// //       setShowPaymentConfirmation(false);

// //     } catch (error: any) {
// //       console.error('❌ Payment initiation error:', error);
// //       alert(`❌ Payment Error:\n${error.message}`);
// //       setProcessingPayment(false);
// //     }
// //   };

// //   const handlePaymentError = (error: string) => {
// //     console.error('❌ Payment checkout error:', error);
// //     alert(`❌ Payment Error:\n${error}`);
    
// //     setCheckoutOptions(null);
// //     setPaymentId(null);
// //     setProcessingPayment(false);
// //     setSelectedPlan(null);
// //   };

// //   const renderError = () => {
// //     if (!error) return null;
    
// //     return (
// //       <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 animate-shake">
// //         <div className="flex items-start gap-3">
// //           <div className="text-red-500 text-xl flex-shrink-0">⚠️</div>
// //           <div className="flex-1">
// //             <h3 className="font-semibold text-red-800 text-base mb-1">
// //               Authentication Error
// //             </h3>
// //             <p className="text-red-700 text-sm break-words">{error}</p>
// //           </div>
// //           <button
// //             onClick={() => window.location.reload()}
// //             className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-700 transition-colors font-medium flex-shrink-0"
// //           >
// //             Retry
// //           </button>
// //         </div>
// //       </div>
// //     );
// //   };

// //   const renderLoading = () => (
// //     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
// //       <div className="text-center max-w-md w-full">
// //         <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-6"></div>
// //         <h2 className="text-2xl font-semibold text-gray-800 mb-2">
// //           {domainConfig.title}
// //         </h2>
// //         <p className="text-lg text-gray-600 mb-2">Loading application...</p>
// //         <p className="text-sm text-gray-500">Initializing secure authentication system</p>
        
// //         <div className="mt-6 space-y-2">
// //           <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
// //             <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
// //             <span>Verifying authentication tokens</span>
// //           </div>
// //           <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
// //             <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
// //             <span>Loading user profile</span>
// //           </div>
// //           <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
// //             <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
// //             <span>Applying security policies</span>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );

// //   if (isLoading) {
// //     return renderLoading();
// //   }

// //   return (
// //     <div className="flex flex-col min-h-screen bg-white">
// //       <GlobalStyles />
      
// //       <Toaster 
// //         position="top-right"
// //         reverseOrder={false}
// //         gutter={8}
// //         toastOptions={{
// //           duration: 5000,
// //           style: {
// //             background: '#fff',
// //             color: '#363636',
// //             fontSize: '14px',
// //             padding: '12px 16px',
// //             borderRadius: '10px',
// //             boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
// //             maxWidth: '500px',
// //           },
// //           success: {
// //             duration: 4000,
// //             iconTheme: {
// //               primary: '#10B981',
// //               secondary: '#fff',
// //             },
// //           },
// //           error: {
// //             duration: 6000,
// //             iconTheme: {
// //               primary: '#EF4444',
// //               secondary: '#fff',
// //             },
// //           },
// //         }}
// //       />

// //       <div className="flex-1">
// //         <Routes>
// //           <Route path="/tile/:tileId" element={<TileDetailsPage />} />
// //           <Route path="/room-select/:tileId" element={<RoomSelectorPage />} />
// //           <Route path="/3d-view/:tileId/:roomType" element={<Room3DViewPage />} />
// //           <Route path="/tile/search" element={<TileSearchPage />} />

// //           <Route
// //             path="/scan"
// //             element={
// //               <WorkerProtectedRoute>
// //                 <WorkerErrorBoundary>
// //                   <ScanPage />
// //                 </WorkerErrorBoundary>
// //               </WorkerProtectedRoute>
// //             }
// //           />

// //           <Route path="/seller-auto-login" element={<SellerAutoLogin />} />

// //           <Route path="/payment-success" element={<PaymentSuccess />} />
// //           <Route path="/payment-failure" element={<PaymentFailure />} />
// //           <Route 
// //             path="/payment-cancelled" 
// //             element={
// //               <Navigate 
// //                 to="/payment-failure?error=Payment cancelled by user" 
// //                 replace 
// //               />
// //             } 
// //           />

// //           {/* ✅ FIXED: Admin/Seller Dashboard - 1800px */}
// //           <Route
// //             path="/admin/*"
// //             element={
// //               <AdminProtectedRoute>
// //                 <DomainHeader />
// //                 <main className="w-full max-w-[1800px] mx-auto px-3 md:px-5 py-6 lg:py-8">
// //                   {renderError()}
// //                   <AdminDashboard />
// //                 </main>
// //               </AdminProtectedRoute>
// //             }
// //           />

// //           <Route
// //             path="/seller/*"
// //             element={
// //               <SellerProtectedRoute>
// //                 <DomainHeader />
// //                 <main className="w-full max-w-[1800px] mx-auto px-3 md:px-5 py-6 lg:py-8">
// //                   {renderError()}
// //                   <SellerDashboard />
// //                 </main>
// //               </SellerProtectedRoute>
// //             }
// //           />

// //           {/* ✅ FIXED: Public Routes - 1800px */}
// //           <Route
// //             path="/*"
// //             element={
// //               <ProtectedRoute allowUnauthenticated={true}>
                
// //                 <div className="relative w-full bg-gradient-to-br from-white via-blue-50/30 to-purple-50/20 overflow-hidden">
// //                   <Navigation 
// //                     onLoginClick={() => setShowAuthModal(true)}
// //                     onBecomeSellerClick={() => setShowSellerRequestModal(true)}
// //                   />
// //                   <HeroSection />
// //                 </div>

// //                 <main className="w-full">
// //                   {renderError()}
                  
// //                   <div className="w-full max-w-[1800px] mx-auto px-3 md:px-5 py-8 lg:py-16">
// //                     <div className="space-y-8">
// //                       <PublicShowroom />
// //                     </div>
// //                   </div>
// //                 </main>

// //                 <FeatureGuide />
// //                 <Guide />
// //                 <Statistics />
// //                 <Banner />
// //                 <Footer />

// //                 <FloatingQRButton />
// //               </ProtectedRoute>
// //             }
// //           />

// //           <Route path="*" element={<Navigate to="/" replace />} />
// //         </Routes>
// //       </div>

// //       <AuthModal 
// //         isOpen={showAuthModal} 
// //         onClose={() => setShowAuthModal(false)} 
// //       />

// //       <SellerRequestModal
// //         isOpen={showSellerRequestModal}
// //         onClose={() => setShowSellerRequestModal(false)}
// //       />

// //       <PlansModal
// //         isOpen={showPlansModal}
// //         onClose={() => setShowPlansModal(false)}
// //         isLoggedIn={isAuthenticated}
// //         onSelectPlan={handlePlanSelection}
// //       />

// //       <PaymentConfirmationModal
// //         isOpen={showPaymentConfirmation}
// //         onClose={() => {
// //           setShowPaymentConfirmation(false);
// //           setSelectedPlan(null);
// //         }}
// //         plan={selectedPlan}
// //         onConfirm={handlePaymentConfirm}
// //         isProcessing={processingPayment}
// //       />

// //       {checkoutOptions && paymentId && selectedPlan && (
// //         <PaymentCheckout
// //           checkoutOptions={checkoutOptions}
// //           paymentId={paymentId}
// //           planId={selectedPlan.id}
// //           sellerId={user?.uid || ''}
// //           onError={handlePaymentError}
// //         />
// //       )}
// //     </div>
// //   );
// // }

// // // ═══════════════════════════════════════════════════════════════════════════
// // // ✅ APP WRAPPER WITH ROUTER
// // // ═══════════════════════════════════════════════════════════════════════════

// // function App() {
// //   return (
// //     <ErrorBoundary>
// //       <Router>
// //         <AppContent />
// //       </Router>
// //     </ErrorBoundary>
// //   );
// // }

// // export default App; 
// import React, { useState, useEffect } from 'react';
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import { ProtectedRoute, AdminProtectedRoute, SellerProtectedRoute } from './components/ProtectedRoute';
// import { WorkerProtectedRoute } from './components/WorkerProtectedRoute';
// import { PlansModal } from './components/Payment/PlansModal';
// import { PaymentSuccess } from './components/Payment/PaymentSuccess';
// import { PaymentFailure } from './components/Payment/PaymentFailure';
// import { useAuth } from './hooks/useAuth';
// import { auth } from './lib/firebase';
// import { DomainHeader } from './components/DomainHeader';
// import { SellerDashboard } from './components/SellerDashboard';
// import { AdminDashboard } from './components/AdminDashboard';
// import { PublicShowroom } from './components/PublicShowroom';
// import { SellerRequestForm } from './components/SellerRequestForm';
// import { AuthModal } from './components/Auth/AuthModal';
// import { FloatingQRButton } from './components/FloatingQRButton';
// import { TileDetailsPage } from './components/TileDetailsPage';
// import { RoomSelectorPage } from './components/RoomSelectorPage';
// import { Room3DViewPage } from './components/Room3DViewPage';
// import { TileSearchPage } from './components/TileSearchPage';
// import { ScanPage } from './components/ScanPage';
// import { getCurrentDomainConfig, applyDomainTheme } from './utils/domainUtils';
// import { WorkerErrorBoundary } from './components/WorkerErrorBoundary';
// import { SellerAutoLogin } from './components/SellerAutoLogin';
// import { Toaster } from 'react-hot-toast';
// import { ArrowRight, PlayCircle, RefreshCw, Menu, X, Play, Sparkles, RefreshCcw } from 'lucide-react';
// import { PaymentConfirmationModal } from './components/Payment/PaymentConfirmationModal';
// import { PaymentCheckout } from './components/Payment/PaymentCheckout';
// import { initiatePayment } from './lib/paymentService';
// import { getPlanById } from './lib/planService';
// import type { Plan } from './types/plan.types';
// import type { RazorpayCheckoutOptions } from './types/payment.types';
// import FeatureGuide  from './components/Feature';
// import { Guide } from './components/Guide';
// import Banner from './components/Banner';
// import { Footer } from './components/Footer';
// import Statistics from './components/Statistics';
// import {PricingSolution} from './components/BenefitCard';

// // ═══════════════════════════════════════════════════════════════════════════
// // ✅ GLOBAL STYLES
// // ═══════════════════════════════════════════════════════════════════════════

// // const GlobalStyles = () => (
// //   <style dangerouslySetInnerHTML={{__html: `
// //     @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
    
// //     * {
// //       font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
// //     }
    
// //     html {
// //       scroll-behavior: smooth;
// //       scroll-padding-top: 100px;
// //       zoom: 67%;
// //     }
    
// //     @keyframes fadeInUp {
// //       from { opacity: 0; transform: translateY(20px); }
// //       to { opacity: 1; transform: translateY(0); }
// //     }
// //     .animate-fade-in-up {
// //       animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
// //       opacity: 0;
// //     }
    
// //     @keyframes spin-slow {
// //       from { transform: rotate(0deg); }
// //       to { transform: rotate(360deg); }
// //     }
// //     .animate-spin-slow {
// //       animation: spin-slow 4s linear infinite;
// //     }
    
// //     @keyframes slideDownMenu {
// //       from { opacity: 0; transform: translateY(-15px); }
// //       to { opacity: 1; transform: translateY(0); }
// //     }
// //     .animate-slide-down {
// //       animation: slideDownMenu 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
// //     }

// //     @keyframes modalFadeIn {
// //       from { opacity: 0; transform: scale(0.95); }
// //       to { opacity: 1; transform: scale(1); }
// //     }
// //     .animate-modal-in {
// //       animation: modalFadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
// //     }

// //     ::-webkit-scrollbar {
// //       width: 10px;
// //       height: 10px;
// //     }
// //     ::-webkit-scrollbar-track {
// //       background: #f1f1f1;
// //     }
// //     ::-webkit-scrollbar-thumb {
// //       background: #888;
// //       border-radius: 5px;
// //     }
// //     ::-webkit-scrollbar-thumb:hover {
// //       background: #555;
// //     }
// //   `}} />
// // );

// const GlobalStyles = () => (
//   <style dangerouslySetInnerHTML={{__html: `
//     @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
    
//     * {
//       font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
//     }
    
//     html {
//       scroll-behavior: smooth;
//       scroll-padding-top: 100px;
//       zoom: 67%;
//       -moz-transform: scale(0.67);
//       -moz-transform-origin: 0 0;
//     }
    
//     /* Mobile devices par normal size */
//     @media screen and (max-width: 768px) {
//       html {
//         zoom: 100%;
//         -moz-transform: scale(1);
//       }
//     }
    
//     @keyframes fadeInUp {
//       from { opacity: 0; transform: translateY(20px); }
//       to { opacity: 1; transform: translateY(0); }
//     }
//     .animate-fade-in-up {
//       animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
//       opacity: 0;
//     }
    
//     @keyframes spin-slow {
//       from { transform: rotate(0deg); }
//       to { transform: rotate(360deg); }
//     }
//     .animate-spin-slow {
//       animation: spin-slow 4s linear infinite;
//     }
    
//     @keyframes slideDownMenu {
//       from { opacity: 0; transform: translateY(-15px); }
//       to { opacity: 1; transform: translateY(0); }
//     }
//     .animate-slide-down {
//       animation: slideDownMenu 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
//     }

//     @keyframes modalFadeIn {
//       from { opacity: 0; transform: scale(0.95); }
//       to { opacity: 1; transform: scale(1); }
//     }
//     .animate-modal-in {
//       animation: modalFadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
//     }

//     ::-webkit-scrollbar {
//       width: 10px;
//       height: 10px;
//     }
//     ::-webkit-scrollbar-track {
//       background: #f1f1f1;
//     }
//     ::-webkit-scrollbar-thumb {
//       background: #888;
//       border-radius: 5px;
//     }
//     ::-webkit-scrollbar-thumb:hover {
//       background: #555;
//     }
//   `}} />
// );
// // ═══════════════════════════════════════════════════════════════════════════
// // ✅ ERROR BOUNDARY
// // ═══════════════════════════════════════════════════════════════════════════

// class ErrorBoundary extends React.Component<
//   { children: React.ReactNode },
//   { hasError: boolean; error?: Error }
// > {
//   constructor(props: { children: React.ReactNode }) {
//     super(props);
//     this.state = { hasError: false };
//   }

//   static getDerivedStateFromError(error: Error) {
//     return { hasError: true, error };
//   }

//   componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
//     console.error('🔥 App Error Boundary:', error, errorInfo);
//   }

//   render() {
//     if (this.state.hasError) {
//       return (
//         <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center p-4">
//           <div className="text-center p-8 bg-white rounded-xl shadow-2xl max-w-md w-full">
//             <div className="text-red-500 text-6xl mb-4">⚠️</div>
//             <h1 className="text-2xl font-bold text-gray-800 mb-4">Something went wrong</h1>
//             <p className="text-gray-600 mb-6">
//               The application encountered an unexpected error. Please refresh the page.
//             </p>
//             {this.state.error && (
//               <details className="mb-6 text-left">
//                 <summary className="text-sm text-gray-500 cursor-pointer hover:text-gray-700">
//                   Error details
//                 </summary>
//                 <pre className="mt-2 p-3 bg-gray-100 rounded text-xs overflow-x-auto">
//                   {this.state.error.message}
//                 </pre>
//               </details>
//             )}
//             <button
//               onClick={() => window.location.reload()}
//               className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors font-semibold shadow-lg"
//             >
//               Refresh Page
//             </button>
//           </div>
//         </div>
//       );
//     }

//     return this.props.children;
//   }
// }

// // ═══════════════════════════════════════════════════════════════════════════
// // ✅ NAVIGATION - COMPACT PADDING (1800px)
// // ═══════════════════════════════════════════════════════════════════════════

// interface NavigationProps {
//   onLoginClick: () => void;
//   onBecomeSellerClick: () => void;
// }

// const Navigation: React.FC<NavigationProps> = ({ onLoginClick, onBecomeSellerClick }) => {
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

//   useEffect(() => {
//     if (mobileMenuOpen) {
//       document.body.style.overflow = 'hidden';
//     } else {
//       document.body.style.overflow = 'unset';
//     }
//     return () => { document.body.style.overflow = 'unset'; };
//   }, [mobileMenuOpen]);

//   return (
//     <nav className="w-full max-w-[1800px] mx-auto px-3 md:px-5 py-5 lg:py-6 flex items-center justify-between relative z-40">
      
//       {/* Logo */}
//       <div className="flex items-center gap-3 cursor-pointer">
//         <div className="relative w-7 h-7 lg:w-8 lg:h-8 flex items-center justify-center flex-shrink-0">
//           <div className="absolute top-0 left-0 w-4 h-4 bg-indigo-300 rounded-[3px]"></div>
//           <div className="absolute bottom-0 right-0 w-4 h-4 bg-[#0040DF] rounded-[3px] mix-blend-multiply"></div>
//         </div>
//         <span className="font-bold text-[20px] lg:text-[26px] tracking-tight text-gray-900">
//           Tilesview360
//         </span>
//       </div>

//       {/* Desktop Navigation Links */}
//       <div className="hidden lg:flex items-center gap-10 xl:gap-12">
//         <a 
//           href="#product" 
//           className="text-gray-900 text-[16px] xl:text-[18px] font-semibold relative after:content-[''] after:absolute after:left-0 after:-bottom-1.5 after:w-full after:h-0.5 after:bg-[#0040DF] hover:text-gray-700 transition-colors"
//         >
//           Product
//         </a>
//         <a 
//           href="#features" 
//           className="text-gray-600 text-[16px] xl:text-[18px] font-medium hover:text-gray-900 transition-colors duration-200"
//         >
//           Features
//         </a>
//         <a 
//           href="#pricing" 
//           className="text-gray-600 text-[16px] xl:text-[18px] font-medium hover:text-gray-900 transition-colors duration-200"
//         >
//           Pricing
//         </a>
//         <a 
//           href="#showcase" 
//           className="text-gray-600 text-[16px] xl:text-[18px] font-medium hover:text-gray-900 transition-colors duration-200"
//         >
//           Showcase
//         </a>
//       </div>

//       {/* Desktop Right Actions */}
//       <div className="hidden lg:flex items-center gap-8 xl:gap-10">
//         <button 
//           onClick={onLoginClick} 
//           className="text-gray-700 text-[16px] xl:text-[18px] font-bold hover:text-gray-900 transition-colors duration-200"
//         >
//           Login
//         </button>
//         <button 
//           onClick={onBecomeSellerClick} 
//           className="bg-[#0040DF] text-white text-[16px] xl:text-[18px] px-8 xl:px-9 py-3.5 xl:py-4 rounded-full font-semibold hover:bg-blue-700 transition-all duration-200 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40"
//         >
//           Become A Seller
//         </button>
//       </div>

//       {/* Mobile Menu Button */}
//       <button
//         onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
//         className="lg:hidden relative z-[70] p-2 bg-gray-50 hover:bg-gray-100 rounded-full text-gray-800 transition-colors shadow-sm"
//         aria-label="Toggle menu"
//       >
//         {mobileMenuOpen ? (
//           <X className="w-6 h-6 stroke-[2.5px]" />
//         ) : (
//           <Menu className="w-6 h-6 stroke-[2.5px]" />
//         )}
//       </button>

//       {/* Mobile Menu Overlay */}
//       {mobileMenuOpen && (
//         <>
//           <div 
//             className="lg:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-[50] animate-fade-in-up"
//             style={{ animationDuration: '0.3s' }}
//             onClick={() => setMobileMenuOpen(false)}
//           />
//           <div className="lg:hidden fixed top-0 left-0 right-0 pt-[88px] pb-6 px-6 bg-white border-b border-gray-200 shadow-2xl z-[60] animate-slide-down rounded-b-[2rem]">
//             <div className="max-w-md mx-auto space-y-6">
//               <div className="space-y-2">
//                 <a 
//                   href="#product" 
//                   onClick={() => setMobileMenuOpen(false)} 
//                   className="block text-gray-900 text-[16px] font-semibold p-3 bg-gray-50 rounded-xl hover:bg-blue-50 hover:text-[#0040DF] transition-colors"
//                 >
//                   Product
//                 </a>
//                 <a 
//                   href="#features" 
//                   onClick={() => setMobileMenuOpen(false)} 
//                   className="block text-gray-600 text-[16px] font-medium p-3 hover:bg-gray-50 rounded-xl transition-colors"
//                 >
//                   Features
//                 </a>
//                 <a 
//                   href="#pricing" 
//                   onClick={() => setMobileMenuOpen(false)} 
//                   className="block text-gray-600 text-[16px] font-medium p-3 hover:bg-gray-50 rounded-xl transition-colors"
//                 >
//                   Pricing
//                 </a>
//                 <a 
//                   href="#showcase" 
//                   onClick={() => setMobileMenuOpen(false)} 
//                   className="block text-gray-600 text-[16px] font-medium p-3 hover:bg-gray-50 rounded-xl transition-colors"
//                 >
//                   Showcase
//                 </a>
//               </div>
              
//               <div className="pt-4 border-t border-gray-100 space-y-3">
//                 <button
//                   onClick={() => { setMobileMenuOpen(false); onLoginClick(); }}
//                   className="w-full text-gray-700 text-[16px] font-bold py-3 px-6 rounded-xl border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all"
//                 >
//                   Login
//                 </button>
//                 <button
//                   onClick={() => { setMobileMenuOpen(false); onBecomeSellerClick(); }}
//                   className="w-full bg-[#0040DF] text-white text-[16px] py-3 px-6 rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/30"
//                 >
//                   Become A Seller
//                 </button>
//               </div>
//             </div>
//           </div>
//         </>
//       )}
//     </nav>
//   );
// };

// // ═══════════════════════════════════════════════════════════════════════════
// // ✅ HERO SECTION - ULTRA COMPACT + BIGGER SECTIONS + IMAGES NICHE (1800px)
// // ═══════════════════════════════════════════════════════════════════════════

// // const HeroSection: React.FC = () => {
// //   return (
// //     // ✅ NAVBAR KE PAAS: pt-6 lg:pt-12 (Previous: pt-12 lg:pt-20)
// //     <section className="w-full max-w-[1800px] mx-auto px-3 md:px-5 pt-6 lg:pt-12 pb-16 lg:pb-24">
      
// //       {/* ✅ ULTRA MINIMAL GAP: gap-4 lg:gap-6 (Previous: gap-6 lg:gap-8) */}
// //       <div className="flex flex-col lg:flex-row items-center justify-between gap-4 lg:gap-6">
        
// //         {/* ═══════════════════════════════════════════════════════════════
// //             LEFT SIDE: TEXT CONTENT (BIGGER: 680px -> 700px)
// //         ═══════════════════════════════════════════════════════════════ */}
// //         <div className="w-full lg:w-auto lg:max-w-[700px] flex flex-col gap-6 order-2 lg:order-1">
          
// //           {/* AI Badge */}
// //           <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600/10 rounded-full backdrop-blur-sm border border-purple-200/50 w-fit">
// //             <Sparkles className="w-4 h-4 text-purple-600" />
// //             <span className="text-purple-700 text-[14px] lg:text-[15px] font-semibold">
// //               AI-Powered Tile Visualization Platform
// //             </span>
// //           </div>

// //           {/* Heading - BIGGER */}
// //           <h1 className="text-[42px] sm:text-[54px] lg:text-[66px] xl:text-[76px] leading-[1.1] font-bold tracking-tight text-gray-900">
// //             See Tiles Before<br />
// //             <span className="text-[#0040DF]">Customers Buy</span>
// //           </h1>

// //           {/* Paragraph - BIGGER */}
// //           <p className="max-w-[640px] text-[18px] lg:text-[20px] xl:text-[22px] leading-[1.6] text-gray-500">
// //             Transform your showroom with AI-powered 3D tile visualization. Let customers preview any material in their actual living spaces with photorealistic precision.
// //           </p>

// //           {/* Buttons Container */}
// //           <div className="flex flex-col sm:flex-row items-start sm:items-center pt-4 gap-4">
            
// //             {/* Primary Button - BIGGER */}
// //             <button 
// //               className="group w-full sm:w-auto flex items-center justify-center gap-2 bg-[#0040DF] hover:bg-blue-700 text-white px-11 xl:px-12 py-[19px] xl:py-5 rounded-full font-medium text-[18px] xl:text-[19px] transition-all shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40"
// //               onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })}
// //             >
// //               Request Demo
// //               <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
// //             </button>

// //             {/* Secondary Button - BIGGER */}
// //             <button 
// //               onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })}
// //               className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white/40 hover:bg-white/60 border border-white/60 backdrop-blur-md text-gray-900 px-11 xl:px-12 py-[19px] xl:py-5 rounded-full font-medium text-[18px] xl:text-[19px] transition-all"
// //             >
// //               <Play className="w-5 h-5" fill="currentColor" />
// //               Watch Live Preview
// //             </button>
// //           </div>
// //         </div>

// //         {/* ═══════════════════════════════════════════════════════════════
// //             RIGHT SIDE: IMAGES CONTAINER (BIGGER: 750px -> 800px)
// //         ═══════════════════════════════════════════════════════════════ */}
// //         <div className="w-full lg:w-[800px] h-auto lg:h-[600px] relative order-1 lg:order-2 flex-shrink-0">
          
// //           {/* ✅ MAIN PREVIEW CARD - BIGGER + NICHE */}
// //           {/* Previous: left-[45px] top-[130px], w-[660px] h-[320px] */}
// //           {/* New: left-[50px] top-[140px], w-[700px] h-[340px] */}
// //           <div className="absolute left-0 top-0 lg:left-[50px] lg:top-[140px] w-full lg:w-[700px] h-[330px] sm:h-[370px] lg:h-[340px] bg-white rounded-[20px] lg:rounded-[24px] p-1 shadow-2xl z-10">
// //             <div className="relative w-full h-full rounded-[16px] lg:rounded-[20px] overflow-hidden">
              
// //               <img 
// //                 src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&q=80&w=1200" 
// //                 alt="Modern interior" 
// //                 className="w-full h-full object-cover"
// //                 loading="eager"
// //               />
              
// //               <div className="absolute inset-0 bg-[#0A192F]/20 backdrop-brightness-95"></div>

// //               {/* AI 3D Scan Active - BIGGER */}
// //               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-3 lg:gap-4 bg-white/30 backdrop-blur-md border border-white/40 pr-5 lg:pr-7 pl-2 py-2.5 rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.1)] z-10 max-w-[90%]">
// //                 <div className="w-[42px] h-[42px] lg:w-[46px] lg:h-[46px] bg-[#0040DF] rounded-full flex items-center justify-center text-white shrink-0 shadow-inner">
// //                   <RefreshCcw className="w-5 h-5 lg:w-6 lg:h-6 animate-spin-slow" />
// //                 </div>
// //                 <div className="flex flex-col">
// //                   <span className="text-[14px] lg:text-[17px] font-bold text-gray-900 leading-tight">
// //                     AI 3D Scan Active
// //                   </span>
// //                   <span className="hidden sm:block text-[12px] lg:text-[14px] font-medium text-gray-800/80 leading-tight">
// //                     Calibrating surface textures...
// //                   </span>
// //                 </div>
// //               </div>
// //             </div>
// //           </div>

// //           {/* ✅ TOP-RIGHT FLOATING CARD - BIGGER + NICHE */}
// //           {/* Previous: left-[495px] top-[-45px], w-[230px] h-[255px] */}
// //           {/* New: left-[520px] top-[-30px], w-[250px] h-[275px] */}
// //           <div className="absolute left-[63%] top-[-30px] sm:left-[73%] sm:top-[-40px] lg:left-[520px] lg:top-[-30px] w-[170px] sm:w-[210px] lg:w-[250px] h-auto lg:h-[275px] bg-white/40 border border-white/60 backdrop-blur-md rounded-[16px] lg:rounded-[20px] p-4 lg:p-5 flex flex-col shadow-[0_20px_40px_rgba(0,0,0,0.08)] z-20 animate-fade-in-up"
// //                style={{ animationDelay: '0ms' }}>
// //             <img 
// //               src="https://images.unsplash.com/photo-1590273016480-1a73f6ed9d53?auto=format&fit=crop&w=400&q=80" 
// //               alt="Venetian Blue Tile" 
// //               className="w-full h-[120px] sm:h-[145px] lg:h-[170px] rounded-[12px] lg:rounded-[15px] object-cover mb-4 lg:mb-5 shadow-sm"
// //               loading="lazy"
// //             />
// //             <div className="flex flex-col">
// //               <span className="font-bold text-[16px] lg:text-[19px] text-[#191C1E] leading-tight">
// //                 Venetian Blue
// //               </span>
// //               <span className="font-medium text-[14px] lg:text-[16px] text-[#0040DF] mt-1">
// //                 Living Room
// //               </span>
// //             </div>
// //           </div>

// //           {/* ✅ BOTTOM-LEFT FLOATING CARD - BIGGER + NICHE */}
// //           {/* Previous: left-[-25px] top-[350px], w-[230px] h-[255px] */}
// //           {/* New: left-[-30px] top-[370px], w-[250px] h-[275px] */}
// //           <div className="absolute left-0 top-[280px] sm:top-[320px] lg:left-[-30px] lg:top-[370px] w-[170px] sm:w-[210px] lg:w-[250px] h-auto lg:h-[275px] bg-white/40 border border-white/60 backdrop-blur-md rounded-[16px] lg:rounded-[20px] p-4 lg:p-5 flex flex-col shadow-[0_20px_40px_rgba(0,0,0,0.08)] z-20 animate-fade-in-up"
// //                style={{ animationDelay: '300ms' }}>
// //             <img 
// //               src="https://images.unsplash.com/photo-1620214365969-2b6fb092d6e4?auto=format&fit=crop&q=80&w=400" 
// //               alt="Noir Slate Tile" 
// //               className="w-full h-[120px] sm:h-[145px] lg:h-[170px] rounded-[12px] lg:rounded-[15px] object-cover mb-4 lg:mb-5 shadow-sm"
// //               loading="lazy"
// //             />
// //             <div className="flex flex-col">
// //               <span className="font-bold text-[16px] lg:text-[19px] text-[#191C1E] leading-tight">
// //                 Noir Slate
// //               </span>
// //               <span className="font-medium text-[14px] lg:text-[16px] text-[#0040DF] mt-1">
// //                 Master Bath
// //               </span>
// //             </div>
// //           </div>

// //         </div>
// //       </div>
// //     </section>
// //   );
// // }; 

// // ═══════════════════════════════════════════════════════════════════════════
// // ✅ HERO SECTION - PERFECTLY BALANCED
// // ═══════════════════════════════════════════════════════════════════════════
// // ═══════════════════════════════════════════════════════════════════════════
// // ✅ HERO SECTION - PERFECTLY BALANCED (MOVED UP)
// // ═══════════════════════════════════════════════════════════════════════════

// const HeroSection: React.FC = () => {
//   return (
//     <section className="w-full max-w-[1800px] mx-auto px-3 md:px-5 pt-20 lg:pt-32 pb-16 lg:pb-24">
      
//       <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12">
        
//         {/* ═══════════════════════════════════════════════════════════════
//             LEFT SIDE: TEXT CONTENT
//         ═══════════════════════════════════════════════════════════════ */}
//         <div className="w-full lg:w-auto lg:max-w-[700px] flex flex-col gap-6 order-2 lg:order-1">
          
//           <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600/10 rounded-full backdrop-blur-sm border border-purple-200/50 w-fit">
//             <Sparkles className="w-4 h-4 text-purple-600" />
//             <span className="text-purple-700 text-[14px] lg:text-[15px] font-semibold">
//               AI-Powered Tile Visualization Platform
//             </span>
//           </div>

//           <h1 className="text-[42px] sm:text-[54px] lg:text-[66px] xl:text-[76px] leading-[1.1] font-bold tracking-tight text-gray-900">
//             See Tiles Before<br />
//             <span className="text-[#0040DF]">Customers Buy</span>
//           </h1>

//           <p className="max-w-[640px] text-[18px] lg:text-[20px] xl:text-[22px] leading-[1.6] text-gray-500">
//             Transform your showroom with AI-powered 3D tile visualization. Let customers preview any material in their actual living spaces with photorealistic precision.
//           </p>

//           <div className="flex flex-col sm:flex-row items-start sm:items-center pt-4 gap-4">
//             <button 
//               className="group w-full sm:w-auto flex items-center justify-center gap-2 bg-[#0040DF] hover:bg-blue-700 text-white px-11 xl:px-12 py-[19px] xl:py-5 rounded-full font-medium text-[18px] xl:text-[19px] transition-all shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40"
//               onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })}
//             >
//               Request Demo
//               <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
//             </button>

//             <button 
//               onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })}
//               className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white/40 hover:bg-white/60 border border-white/60 backdrop-blur-md text-gray-900 px-11 xl:px-12 py-[19px] xl:py-5 rounded-full font-medium text-[18px] xl:text-[19px] transition-all"
//             >
//               <Play className="w-5 h-5" fill="currentColor" />
//               Watch Live Preview
//             </button>
//           </div>
//         </div>

//         {/* ═══════════════════════════════════════════════════════════════
//             RIGHT SIDE: IMAGES CONTAINER (MOVED UP)
//         ═══════════════════════════════════════════════════════════════ */}
//         {/* mt wagera sab hata diya taaki upar ki taraf alignment rahe */}
//         <div className="w-full lg:w-[800px] h-auto min-h-[500px] lg:h-[600px] relative order-1 lg:order-2 flex-shrink-0">
          
//           {/* MAIN PREVIEW CARD - Wapas upar kar diya (top-[120px]) */}
//           <div className="absolute left-0 top-[20px] lg:left-[50px] lg:top-[120px] w-full lg:w-[700px] h-[330px] sm:h-[370px] lg:h-[340px] bg-white rounded-[20px] lg:rounded-[24px] p-1 shadow-2xl z-10">
//             <div className="relative w-full h-full rounded-[16px] lg:rounded-[20px] overflow-hidden">
//               <img 
//                 src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&q=80&w=1200" 
//                 alt="Modern interior" 
//                 className="w-full h-full object-cover"
//                 loading="eager"
//               />
//               <div className="absolute inset-0 bg-[#0A192F]/20 backdrop-brightness-95"></div>
//               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-3 lg:gap-4 bg-white/30 backdrop-blur-md border border-white/40 pr-5 lg:pr-7 pl-2 py-2.5 rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.1)] z-10 max-w-[90%]">
//                 <div className="w-[42px] h-[42px] lg:w-[46px] lg:h-[46px] bg-[#0040DF] rounded-full flex items-center justify-center text-white shrink-0 shadow-inner">
//                   <RefreshCcw className="w-5 h-5 lg:w-6 lg:h-6 animate-spin-slow" />
//                 </div>
//                 <div className="flex flex-col">
//                   <span className="text-[14px] lg:text-[17px] font-bold text-gray-900 leading-tight">
//                     AI 3D Scan Active
//                   </span>
//                   <span className="hidden sm:block text-[12px] lg:text-[14px] font-medium text-gray-800/80 leading-tight">
//                     Calibrating surface textures...
//                   </span>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* TOP-RIGHT FLOATING CARD - 'Become a Seller' button ke thik niche perfectly positioned (top-[-10px]) */}
//           <div className="absolute left-[63%] top-[-10px] sm:left-[73%] sm:top-[-10px] lg:left-[520px] lg:top-[-10px] w-[170px] sm:w-[210px] lg:w-[250px] h-auto lg:h-[275px] bg-white/40 border border-white/60 backdrop-blur-md rounded-[16px] lg:rounded-[20px] p-4 lg:p-5 flex flex-col shadow-[0_20px_40px_rgba(0,0,0,0.08)] z-20 animate-fade-in-up"
//                style={{ animationDelay: '0ms' }}>
//             <img 
//               src="https://images.unsplash.com/photo-1590273016480-1a73f6ed9d53?auto=format&fit=crop&w=400&q=80" 
//               alt="Venetian Blue Tile" 
//               className="w-full h-[120px] sm:h-[145px] lg:h-[170px] rounded-[12px] lg:rounded-[15px] object-cover mb-4 lg:mb-5 shadow-sm"
//               loading="lazy"
//             />
//             <div className="flex flex-col">
//               <span className="font-bold text-[16px] lg:text-[19px] text-[#191C1E] leading-tight">
//                 Venetian Blue
//               </span>
//               <span className="font-medium text-[14px] lg:text-[16px] text-[#0040DF] mt-1">
//                 Living Room
//               </span>
//             </div>
//           </div>

//           {/* BOTTOM-LEFT FLOATING CARD - Balance banaye rakhne ke liye */}
//           <div className="absolute left-0 top-[260px] sm:top-[300px] lg:left-[-30px] lg:top-[350px] w-[170px] sm:w-[210px] lg:w-[250px] h-auto lg:h-[275px] bg-white/40 border border-white/60 backdrop-blur-md rounded-[16px] lg:rounded-[20px] p-4 lg:p-5 flex flex-col shadow-[0_20px_40px_rgba(0,0,0,0.08)] z-20 animate-fade-in-up"
//                style={{ animationDelay: '300ms' }}>
//             <img 
//               src="https://images.unsplash.com/photo-1620214365969-2b6fb092d6e4?auto=format&fit=crop&q=80&w=400" 
//               alt="Noir Slate Tile" 
//               className="w-full h-[120px] sm:h-[145px] lg:h-[170px] rounded-[12px] lg:rounded-[15px] object-cover mb-4 lg:mb-5 shadow-sm"
//               loading="lazy"
//             />
//             <div className="flex flex-col">
//               <span className="font-bold text-[16px] lg:text-[19px] text-[#191C1E] leading-tight">
//                 Noir Slate
//               </span>
//               <span className="font-medium text-[14px] lg:text-[16px] text-[#0040DF] mt-1">
//                 Master Bath
//               </span>
//             </div>
//           </div>

//         </div>
//       </div>
//     </section>
//   );
// };

// // ═══════════════════════════════════════════════════════════════════════════
// // ✅ SELLER REQUEST MODAL
// // ═══════════════════════════════════════════════════════════════════════════

// interface SellerRequestModalProps {
//   isOpen: boolean;
//   onClose: () => void;
// }

// const SellerRequestModal: React.FC<SellerRequestModalProps> = ({ isOpen, onClose }) => {
//   useEffect(() => {
//     if (isOpen) {
//       document.body.style.overflow = 'hidden';
//     } else {
//       document.body.style.overflow = 'unset';
//     }
//     return () => { document.body.style.overflow = 'unset'; };
//   }, [isOpen]);

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in-up">
//       <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-modal-in">
//         <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
//           <div>
//             <h2 className="text-2xl font-bold text-gray-900">Become A Seller</h2>
//             <p className="text-sm text-gray-600 mt-1">Join our platform and grow your tile business</p>
//           </div>
//           <button
//             onClick={onClose}
//             className="p-2 hover:bg-gray-100 rounded-full transition-colors"
//             aria-label="Close"
//           >
//             <X className="w-6 h-6 text-gray-600" />
//           </button>
//         </div>
//         <div className="p-6">
//           <SellerRequestForm onSuccess={onClose} />
//         </div>
//       </div>
//     </div>
//   );
// };

// // ═══════════════════════════════════════════════════════════════════════════
// // ✅ MAIN APP CONTENT COMPONENT
// // ═══════════════════════════════════════════════════════════════════════════

// function AppContent() {
//   const { isAuthenticated, isLoading, user, error } = useAuth({
//     enableActivityTracking: false,
//     enableSessionWarnings: false,
//     autoLogoutDelay: 0
//   });
  
//   const [showAuthModal, setShowAuthModal] = useState(false);
//   const [showPlansModal, setShowPlansModal] = useState(false);
//   const [showSellerRequestModal, setShowSellerRequestModal] = useState(false);
//   const [domainConfig, setDomainConfig] = useState(getCurrentDomainConfig());
//   const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
//   const [showPaymentConfirmation, setShowPaymentConfirmation] = useState(false);
//   const [checkoutOptions, setCheckoutOptions] = useState<RazorpayCheckoutOptions | null>(null);
//   const [paymentId, setPaymentId] = useState<string | null>(null);
//   const [processingPayment, setProcessingPayment] = useState(false);

//   useEffect(() => {
//     try {
//       console.log('🚀 Tile Showroom App initializing...');
      
//       const config = getCurrentDomainConfig();
//       setDomainConfig(config);
//       applyDomainTheme(config);
      
//       console.log('🎯 Domain config:', config);
//       console.log('👤 Auth state:', { 
//         isAuthenticated, 
//         isLoading, 
//         userRole: user?.role,
//         userId: user?.user_id 
//       });
      
//       document.title = config.title;
      
//       let viewport = document.querySelector('meta[name="viewport"]');
//       if (!viewport) {
//         viewport = document.createElement('meta');
//         viewport.setAttribute('name', 'viewport');
//         viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes');
//         document.head.appendChild(viewport);
//       }
      
//     } catch (error) {
//       console.error('🔥 App initialization error:', error);
//     }
//   }, [isAuthenticated, isLoading, user]);

//   useEffect(() => {
//     if (isAuthenticated && user?.role === 'worker') {
//       const currentPath = window.location.pathname;
//       const allowedPaths = ['/scan', '/tile/', '/3d-view/', '/room-select/'];
//       const isAllowedPath = allowedPaths.some(path => currentPath.startsWith(path));
      
//       if (!isAllowedPath && currentPath !== '/') {
//         console.log('🔒 Worker blocked from:', currentPath);
//         window.location.replace('/scan');
//       }
//     }
//   }, [isAuthenticated, user]);

//   const handlePlanSelection = async (planId: string) => {
//     try {
//       console.log('📦 Selected plan:', planId);
      
//       if (!isAuthenticated) {
//         console.log('🔐 User not authenticated, showing login modal...');
//         setShowPlansModal(false);
//         setShowAuthModal(true);
//         return;
//       }

//       console.log('📋 Fetching plan details...');
//       const plan = await getPlanById(planId);
      
//       if (!plan) {
//         alert('❌ Plan not found. Please try again.');
//         return;
//       }

//       setSelectedPlan(plan);
//       setShowPlansModal(false);
//       setShowPaymentConfirmation(true);
      
//     } catch (error: any) {
//       console.error('❌ Error selecting plan:', error);
//       alert(`❌ Error: ${error.message}`);
//     }
//   };

//   const handlePaymentConfirm = async () => {
//     if (!selectedPlan) {
//       alert('❌ No plan selected');
//       return;
//     }

//     setProcessingPayment(true);

//     try {
//       console.log('💳 Initiating payment for plan:', selectedPlan.plan_name);

//       const currentUser = auth.currentUser;
//       if (!currentUser) {
//         throw new Error('Please login first');
//       }

//       const result = await initiatePayment(
//         selectedPlan.id,
//         selectedPlan.plan_name,
//         selectedPlan.price
//       );

//       if (!result.success || !result.checkoutOptions || !result.paymentId) {
//         throw new Error(result.error || 'Failed to initiate payment');
//       }

//       console.log('✅ Payment initiated successfully');
//       console.log('📝 Payment ID:', result.paymentId);

//       setCheckoutOptions(result.checkoutOptions);
//       setPaymentId(result.paymentId);
//       setShowPaymentConfirmation(false);

//     } catch (error: any) {
//       console.error('❌ Payment initiation error:', error);
//       alert(`❌ Payment Error:\n${error.message}`);
//       setProcessingPayment(false);
//     }
//   };

//   const handlePaymentError = (error: string) => {
//     console.error('❌ Payment checkout error:', error);
//     alert(`❌ Payment Error:\n${error}`);
    
//     setCheckoutOptions(null);
//     setPaymentId(null);
//     setProcessingPayment(false);
//     setSelectedPlan(null);
//   };

//   const renderError = () => {
//     if (!error) return null;
    
//     return (
//       <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 animate-shake">
//         <div className="flex items-start gap-3">
//           <div className="text-red-500 text-xl flex-shrink-0">⚠️</div>
//           <div className="flex-1">
//             <h3 className="font-semibold text-red-800 text-base mb-1">
//               Authentication Error
//             </h3>
//             <p className="text-red-700 text-sm break-words">{error}</p>
//           </div>
//           <button
//             onClick={() => window.location.reload()}
//             className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-700 transition-colors font-medium flex-shrink-0"
//           >
//             Retry
//           </button>
//         </div>
//       </div>
//     );
//   };

//   const renderLoading = () => (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
//       <div className="text-center max-w-md w-full">
//         <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-6"></div>
//         <h2 className="text-2xl font-semibold text-gray-800 mb-2">
//           {domainConfig.title}
//         </h2>
//         <p className="text-lg text-gray-600 mb-2">Loading application...</p>
//         <p className="text-sm text-gray-500">Initializing secure authentication system</p>
        
//         <div className="mt-6 space-y-2">
//           <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
//             <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
//             <span>Verifying authentication tokens</span>
//           </div>
//           <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
//             <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
//             <span>Loading user profile</span>
//           </div>
//           <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
//             <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
//             <span>Applying security policies</span>
//           </div>
//         </div>
//       </div>
//     </div>
//   );

//   if (isLoading) {
//     return renderLoading();
//   }

//   return (
//     <div className="flex flex-col min-h-screen bg-white">
//       <GlobalStyles />
      
//       <Toaster 
//         position="top-right"
//         reverseOrder={false}
//         gutter={8}
//         toastOptions={{
//           duration: 5000,
//           style: {
//             background: '#fff',
//             color: '#363636',
//             fontSize: '14px',
//             padding: '12px 16px',
//             borderRadius: '10px',
//             boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
//             maxWidth: '500px',
//           },
//           success: {
//             duration: 4000,
//             iconTheme: {
//               primary: '#10B981',
//               secondary: '#fff',
//             },
//           },
//           error: {
//             duration: 6000,
//             iconTheme: {
//               primary: '#EF4444',
//               secondary: '#fff',
//             },
//           },
//         }}
//       />

//       <div className="flex-1">
//         <Routes>
//           {/* QR SCAN ROUTES - PUBLIC ACCESS */}
//           <Route path="/tile/:tileId" element={<TileDetailsPage />} />
//           <Route path="/room-select/:tileId" element={<RoomSelectorPage />} />
//           <Route path="/3d-view/:tileId/:roomType" element={<Room3DViewPage />} />
//           <Route path="/tile/search" element={<TileSearchPage />} />

//           {/* WORKER SCAN PAGE */}
//           <Route
//             path="/scan"
//             element={
//               <WorkerProtectedRoute>
//                 <WorkerErrorBoundary>
//                   <ScanPage />
//                 </WorkerErrorBoundary>
//               </WorkerProtectedRoute>
//             }
//           />

//           {/* SELLER AUTO-LOGIN */}
//           <Route path="/seller-auto-login" element={<SellerAutoLogin />} />

//           {/* PAYMENT ROUTES */}
//           <Route path="/payment-success" element={<PaymentSuccess />} />
//           <Route path="/payment-failure" element={<PaymentFailure />} />
//           <Route 
//             path="/payment-cancelled" 
//             element={
//               <Navigate 
//                 to="/payment-failure?error=Payment cancelled by user" 
//                 replace 
//               />
//             } 
//           />

//           {/* ADMIN DASHBOARD */}
//           <Route
//             path="/admin/*"
//             element={
//               <AdminProtectedRoute>
//                 <DomainHeader />
//                 <main className="w-full max-w-[1800px] mx-auto px-3 md:px-5 py-6 lg:py-8">
//                   {renderError()}
//                   <AdminDashboard />
//                 </main>
//               </AdminProtectedRoute>
//             }
//           />

//           {/* SELLER DASHBOARD */}
//           <Route
//             path="/seller/*"
//             element={
//               <SellerProtectedRoute>
//                 <DomainHeader />
//                 <main className="w-full max-w-[1800px] mx-auto px-3 md:px-5 py-6 lg:py-8">
//                   {renderError()}
//                   <SellerDashboard />
//                 </main>
//               </SellerProtectedRoute>
//             }
//           />

//           {/* PUBLIC/CUSTOMER ROUTES */}
//           <Route
//             path="/*"
//             element={
//               <ProtectedRoute allowUnauthenticated={true}>
                
//                 <div className="relative w-full bg-gradient-to-br from-white via-blue-50/30 to-purple-50/20 overflow-hidden">
//                   <Navigation 
//                     onLoginClick={() => setShowAuthModal(true)}
//                     onBecomeSellerClick={() => setShowSellerRequestModal(true)}
//                   />
//                   <HeroSection />
//                 </div>

//                 <main className="w-full">
//                   {renderError()}
                  
//                   <div className="w-full max-w-[1800px] mx-auto px-3 md:px-5 py-8 lg:py-16">
//                     <div className="space-y-8">
//                       <PublicShowroom />
//                     </div>
//                   </div>
//                 </main>

//                 <FeatureGuide />
//                 <Guide />
//                 <Statistics />
      
//                 <PricingSolution/>
//                 <Banner />
//                 <Footer />

//                 <FloatingQRButton />
//               </ProtectedRoute>
//             }
//           />

//           {/* CATCH-ALL REDIRECT */}
//           <Route path="*" element={<Navigate to="/" replace />} />
//         </Routes>
//       </div>

//       {/* MODALS */}
//       <AuthModal 
//         isOpen={showAuthModal} 
//         onClose={() => setShowAuthModal(false)} 
//       />

//       <SellerRequestModal
//         isOpen={showSellerRequestModal}
//         onClose={() => setShowSellerRequestModal(false)}
//       />

//       <PlansModal
//         isOpen={showPlansModal}
//         onClose={() => setShowPlansModal(false)}
//         isLoggedIn={isAuthenticated}
//         onSelectPlan={handlePlanSelection}
//       />

//       <PaymentConfirmationModal
//         isOpen={showPaymentConfirmation}
//         onClose={() => {
//           setShowPaymentConfirmation(false);
//           setSelectedPlan(null);
//         }}
//         plan={selectedPlan}
//         onConfirm={handlePaymentConfirm}
//         isProcessing={processingPayment}
//       />

//       {checkoutOptions && paymentId && selectedPlan && (
//         <PaymentCheckout
//           checkoutOptions={checkoutOptions}
//           paymentId={paymentId}
//           planId={selectedPlan.id}
//           sellerId={user?.uid || ''}
//           onError={handlePaymentError}
//         />
//       )}
//     </div>
//   );
// }

// // ═══════════════════════════════════════════════════════════════════════════
// // ✅ APP WRAPPER WITH ROUTER
// // ═══════════════════════════════════════════════════════════════════════════

// function App() {
//   return (
//     <ErrorBoundary>
//       <Router>
//         <AppContent />
//       </Router>
//     </ErrorBoundary>
//   );
// }

// export default App; 
// App.tsx - PRODUCTION READY


import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { ProtectedRoute, AdminProtectedRoute, SellerProtectedRoute } from './components/ProtectedRoute';
import { WorkerProtectedRoute } from './components/WorkerProtectedRoute';
import { PlansModal } from './components/Payment/PlansModal';
import { PaymentSuccess } from './components/Payment/PaymentSuccess';
import { PaymentFailure } from './components/Payment/PaymentFailure';
import { useAuth } from './hooks/useAuth';
import { auth } from './lib/firebase';
import { DomainHeader } from './components/DomainHeader';
import { SellerDashboard } from './components/SellerDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { PublicShowroom } from './components/PublicShowroom';
import { SellerRequestForm } from './components/SellerRequestForm';
import { AuthModal } from './components/Auth/AuthModal';
import { FloatingQRButton } from './components/FloatingQRButton';
import { TileDetailsPage } from './components/TileDetailsPage';
import { RoomSelectorPage } from './components/RoomSelectorPage';
import { Room3DViewPage } from './components/Room3DViewPage';
import { TileSearchPage } from './components/TileSearchPage';
import { ScanPage } from './components/ScanPage';
import { getCurrentDomainConfig, applyDomainTheme } from './utils/domainUtils';
import { WorkerErrorBoundary } from './components/WorkerErrorBoundary';
import { SellerAutoLogin } from './components/SellerAutoLogin';
import { Toaster } from 'react-hot-toast';
import { ArrowRight, Menu, X, Play, Sparkles, RefreshCcw } from 'lucide-react';
import { PaymentConfirmationModal } from './components/Payment/PaymentConfirmationModal';
import { PaymentCheckout } from './components/Payment/PaymentCheckout';
import { initiatePayment } from './lib/paymentService';
import { getPlanById } from './lib/planService';
import type { Plan } from './types/plan.types';
import type { RazorpayCheckoutOptions } from './types/payment.types';
import FeatureGuide from './components/Feature';
import { Guide } from './components/Guide';
import Banner from './components/Banner';
import { Footer } from './components/Footer';
import Statistics from './components/Statistics';
import { PricingSolution } from './components/BenefitCard';

// ═══════════════════════════════════════════════════════════════════════════
// ✅ GLOBAL STYLES
// ═══════════════════════════════════════════════════════════════════════════

const GlobalStyles = () => (
  <style dangerouslySetInnerHTML={{__html: `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
    
    * {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    }
    
    html {
      scroll-behavior: smooth;
      scroll-padding-top: 100px;
      zoom: 67%;
      -moz-transform: scale(0.67);
      -moz-transform-origin: 0 0;
    }
    
    @media screen and (max-width: 768px) {
      html {
        zoom: 100%;
        -moz-transform: scale(1);
      }
    }
    
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .animate-fade-in-up {
      animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
      opacity: 0;
    }
    
    @keyframes spin-slow {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    .animate-spin-slow {
      animation: spin-slow 4s linear infinite;
    }
    
    @keyframes slideDownMenu {
      from { opacity: 0; transform: translateY(-15px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .animate-slide-down {
      animation: slideDownMenu 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }

    @keyframes modalFadeIn {
      from { opacity: 0; transform: scale(0.95); }
      to { opacity: 1; transform: scale(1); }
    }
    .animate-modal-in {
      animation: modalFadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }

    ::-webkit-scrollbar {
      width: 10px;
      height: 10px;
    }
    ::-webkit-scrollbar-track {
      background: #f1f1f1;
    }
    ::-webkit-scrollbar-thumb {
      background: #888;
      border-radius: 5px;
    }
    ::-webkit-scrollbar-thumb:hover {
      background: #555;
    }
  `}} />
);

// ═══════════════════════════════════════════════════════════════════════════
// ✅ ERROR BOUNDARY
// ═══════════════════════════════════════════════════════════════════════════

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('🔥 App Error Boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center p-4">
          <div className="text-center p-8 bg-white rounded-xl shadow-2xl max-w-md w-full">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Something went wrong</h1>
            <p className="text-gray-600 mb-6">
              The application encountered an unexpected error. Please refresh the page.
            </p>
            {this.state.error && (
              <details className="mb-6 text-left">
                <summary className="text-sm text-gray-500 cursor-pointer hover:text-gray-700">
                  Error details
                </summary>
                <pre className="mt-2 p-3 bg-gray-100 rounded text-xs overflow-x-auto">
                  {this.state.error.message}
                </pre>
              </details>
            )}
            <button
              onClick={() => window.location.reload()}
              className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors font-semibold shadow-lg"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// ✅ NAVIGATION COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

interface NavigationProps {
  onLoginClick: () => void;
  onBecomeSellerClick: () => void;
}

const Navigation: React.FC<NavigationProps> = ({ onLoginClick, onBecomeSellerClick }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [mobileMenuOpen]);

  return (
    <nav className="w-full max-w-[1800px] mx-auto px-3 md:px-5 py-5 lg:py-6 flex items-center justify-between relative z-40">
      
      {/* Logo */}
      <div className="flex items-center gap-3 cursor-pointer">
        <div className="relative w-7 h-7 lg:w-8 lg:h-8 flex items-center justify-center flex-shrink-0">
          <div className="absolute top-0 left-0 w-4 h-4 bg-indigo-300 rounded-[3px]"></div>
          <div className="absolute bottom-0 right-0 w-4 h-4 bg-[#0040DF] rounded-[3px] mix-blend-multiply"></div>
        </div>
        <span className="font-bold text-[20px] lg:text-[26px] tracking-tight text-gray-900">
          Tilesview360
        </span>
      </div>

      {/* Desktop Navigation Links */}
      <div className="hidden lg:flex items-center gap-10 xl:gap-12">
        <a 
          href="#product" 
          className="text-gray-900 text-[16px] xl:text-[18px] font-semibold relative after:content-[''] after:absolute after:left-0 after:-bottom-1.5 after:w-full after:h-0.5 after:bg-[#0040DF] hover:text-gray-700 transition-colors"
        >
          Product
        </a>
        <a 
          href="#features" 
          className="text-gray-600 text-[16px] xl:text-[18px] font-medium hover:text-gray-900 transition-colors duration-200"
        >
          Features
        </a>
        <a 
          href="#pricing" 
          className="text-gray-600 text-[16px] xl:text-[18px] font-medium hover:text-gray-900 transition-colors duration-200"
        >
          Pricing
        </a>
        <a 
          href="#showcase" 
          className="text-gray-600 text-[16px] xl:text-[18px] font-medium hover:text-gray-900 transition-colors duration-200"
        >
          Showcase
        </a>
      </div>

      {/* Desktop Right Actions */}
      <div className="hidden lg:flex items-center gap-8 xl:gap-10">
        <button 
          onClick={onLoginClick} 
          className="text-gray-700 text-[16px] xl:text-[18px] font-bold hover:text-gray-900 transition-colors duration-200"
        >
          Login
        </button>
        <button 
          onClick={onBecomeSellerClick} 
          className="bg-[#0040DF] text-white text-[16px] xl:text-[18px] px-8 xl:px-9 py-3.5 xl:py-4 rounded-full font-semibold hover:bg-blue-700 transition-all duration-200 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40"
        >
          Become A Seller
        </button>
      </div>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="lg:hidden relative z-[70] p-2 bg-gray-50 hover:bg-gray-100 rounded-full text-gray-800 transition-colors shadow-sm"
        aria-label="Toggle menu"
      >
        {mobileMenuOpen ? (
          <X className="w-6 h-6 stroke-[2.5px]" />
        ) : (
          <Menu className="w-6 h-6 stroke-[2.5px]" />
        )}
      </button>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <>
          <div 
            className="lg:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-[50] animate-fade-in-up"
            style={{ animationDuration: '0.3s' }}
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="lg:hidden fixed top-0 left-0 right-0 pt-[88px] pb-6 px-6 bg-white border-b border-gray-200 shadow-2xl z-[60] animate-slide-down rounded-b-[2rem]">
            <div className="max-w-md mx-auto space-y-6">
              <div className="space-y-2">
                <a 
                  href="#product" 
                  onClick={() => setMobileMenuOpen(false)} 
                  className="block text-gray-900 text-[16px] font-semibold p-3 bg-gray-50 rounded-xl hover:bg-blue-50 hover:text-[#0040DF] transition-colors"
                >
                  Product
                </a>
                <a 
                  href="#features" 
                  onClick={() => setMobileMenuOpen(false)} 
                  className="block text-gray-600 text-[16px] font-medium p-3 hover:bg-gray-50 rounded-xl transition-colors"
                >
                  Features
                </a>
                <a 
                  href="#pricing" 
                  onClick={() => setMobileMenuOpen(false)} 
                  className="block text-gray-600 text-[16px] font-medium p-3 hover:bg-gray-50 rounded-xl transition-colors"
                >
                  Pricing
                </a>
                <a 
                  href="#showcase" 
                  onClick={() => setMobileMenuOpen(false)} 
                  className="block text-gray-600 text-[16px] font-medium p-3 hover:bg-gray-50 rounded-xl transition-colors"
                >
                  Showcase
                </a>
              </div>
              
              <div className="pt-4 border-t border-gray-100 space-y-3">
                <button
                  onClick={() => { setMobileMenuOpen(false); onLoginClick(); }}
                  className="w-full text-gray-700 text-[16px] font-bold py-3 px-6 rounded-xl border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all"
                >
                  Login
                </button>
                <button
                  onClick={() => { setMobileMenuOpen(false); onBecomeSellerClick(); }}
                  className="w-full bg-[#0040DF] text-white text-[16px] py-3 px-6 rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/30"
                >
                  Become A Seller
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </nav>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// ✅ HERO SECTION
// ═══════════════════════════════════════════════════════════════════════════

const HeroSection: React.FC = () => {
  return (
    <section className="w-full max-w-[1800px] mx-auto px-3 md:px-5 pt-20 lg:pt-32 pb-16 lg:pb-24">
      
      <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12">
        
        {/* LEFT SIDE: TEXT CONTENT */}
        <div className="w-full lg:w-auto lg:max-w-[700px] flex flex-col gap-6 order-2 lg:order-1">
          
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600/10 rounded-full backdrop-blur-sm border border-purple-200/50 w-fit">
            <Sparkles className="w-4 h-4 text-purple-600" />
            <span className="text-purple-700 text-[14px] lg:text-[15px] font-semibold">
              AI-Powered Tile Visualization Platform
            </span>
          </div>

          <h1 className="text-[42px] sm:text-[54px] lg:text-[66px] xl:text-[76px] leading-[1.1] font-bold tracking-tight text-gray-900">
            See Tiles Before<br />
            <span className="text-[#0040DF]">Customers Buy</span>
          </h1>

          <p className="max-w-[640px] text-[18px] lg:text-[20px] xl:text-[22px] leading-[1.6] text-gray-500">
            Transform your showroom with AI-powered 3D tile visualization. Let customers preview any material in their actual living spaces with photorealistic precision.
          </p>

          <div className="flex flex-col sm:flex-row items-start sm:items-center pt-4 gap-4">
            <button 
              className="group w-full sm:w-auto flex items-center justify-center gap-2 bg-[#0040DF] hover:bg-blue-700 text-white px-11 xl:px-12 py-[19px] xl:py-5 rounded-full font-medium text-[18px] xl:text-[19px] transition-all shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40"
              onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })}
            >
              Request Demo
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>

            <button 
              onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white/40 hover:bg-white/60 border border-white/60 backdrop-blur-md text-gray-900 px-11 xl:px-12 py-[19px] xl:py-5 rounded-full font-medium text-[18px] xl:text-[19px] transition-all"
            >
              <Play className="w-5 h-5" fill="currentColor" />
              Watch Live Preview
            </button>
          </div>
        </div>

        {/* RIGHT SIDE: IMAGES CONTAINER */}
        <div className="w-full lg:w-[800px] h-auto min-h-[500px] lg:h-[600px] relative order-1 lg:order-2 flex-shrink-0">
          
          {/* MAIN PREVIEW CARD */}
          <div className="absolute left-0 top-[20px] lg:left-[50px] lg:top-[120px] w-full lg:w-[700px] h-[330px] sm:h-[370px] lg:h-[340px] bg-white rounded-[20px] lg:rounded-[24px] p-1 shadow-2xl z-10">
            <div className="relative w-full h-full rounded-[16px] lg:rounded-[20px] overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&q=80&w=1200" 
                alt="Modern interior" 
                className="w-full h-full object-cover"
                loading="eager"
              />
              <div className="absolute inset-0 bg-[#0A192F]/20 backdrop-brightness-95"></div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-3 lg:gap-4 bg-white/30 backdrop-blur-md border border-white/40 pr-5 lg:pr-7 pl-2 py-2.5 rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.1)] z-10 max-w-[90%]">
                <div className="w-[42px] h-[42px] lg:w-[46px] lg:h-[46px] bg-[#0040DF] rounded-full flex items-center justify-center text-white shrink-0 shadow-inner">
                  <RefreshCcw className="w-5 h-5 lg:w-6 lg:h-6 animate-spin-slow" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[14px] lg:text-[17px] font-bold text-gray-900 leading-tight">
                    AI 3D Scan Active
                  </span>
                  <span className="hidden sm:block text-[12px] lg:text-[14px] font-medium text-gray-800/80 leading-tight">
                    Calibrating surface textures...
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* TOP-RIGHT FLOATING CARD */}
          <div className="absolute left-[63%] top-[-10px] sm:left-[73%] sm:top-[-10px] lg:left-[520px] lg:top-[-10px] w-[170px] sm:w-[210px] lg:w-[250px] h-auto lg:h-[275px] bg-white/40 border border-white/60 backdrop-blur-md rounded-[16px] lg:rounded-[20px] p-4 lg:p-5 flex flex-col shadow-[0_20px_40px_rgba(0,0,0,0.08)] z-20 animate-fade-in-up"
               style={{ animationDelay: '0ms' }}>
            <img 
              src="https://images.unsplash.com/photo-1590273016480-1a73f6ed9d53?auto=format&fit=crop&w=400&q=80" 
              alt="Venetian Blue Tile" 
              className="w-full h-[120px] sm:h-[145px] lg:h-[170px] rounded-[12px] lg:rounded-[15px] object-cover mb-4 lg:mb-5 shadow-sm"
              loading="lazy"
            />
            <div className="flex flex-col">
              <span className="font-bold text-[16px] lg:text-[19px] text-[#191C1E] leading-tight">
                Venetian Blue
              </span>
              <span className="font-medium text-[14px] lg:text-[16px] text-[#0040DF] mt-1">
                Living Room
              </span>
            </div>
          </div>

          {/* BOTTOM-LEFT FLOATING CARD */}
          <div className="absolute left-0 top-[260px] sm:top-[300px] lg:left-[-30px] lg:top-[350px] w-[170px] sm:w-[210px] lg:w-[250px] h-auto lg:h-[275px] bg-white/40 border border-white/60 backdrop-blur-md rounded-[16px] lg:rounded-[20px] p-4 lg:p-5 flex flex-col shadow-[0_20px_40px_rgba(0,0,0,0.08)] z-20 animate-fade-in-up"
               style={{ animationDelay: '300ms' }}>
            <img 
              src="https://images.unsplash.com/photo-1620214365969-2b6fb092d6e4?auto=format&fit=crop&q=80&w=400" 
              alt="Noir Slate Tile" 
              className="w-full h-[120px] sm:h-[145px] lg:h-[170px] rounded-[12px] lg:rounded-[15px] object-cover mb-4 lg:mb-5 shadow-sm"
              loading="lazy"
            />
            <div className="flex flex-col">
              <span className="font-bold text-[16px] lg:text-[19px] text-[#191C1E] leading-tight">
                Noir Slate
              </span>
              <span className="font-medium text-[14px] lg:text-[16px] text-[#0040DF] mt-1">
                Master Bath
              </span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// ✅ HOME PAGE COMPONENT (with Navigation + Hero)
// ═══════════════════════════════════════════════════════════════════════════

const HomePage: React.FC<{ onLoginClick: () => void; onBecomeSellerClick: () => void }> = ({ 
  onLoginClick, 
  onBecomeSellerClick 
}) => {
  return (
    <>
      <div className="relative w-full bg-gradient-to-br from-white via-blue-50/30 to-purple-50/20 overflow-hidden">
        <Navigation 
          onLoginClick={onLoginClick}
          onBecomeSellerClick={onBecomeSellerClick}
        />
        <HeroSection />
      </div>

      <main className="w-full">
        <div className="w-full max-w-[1800px] mx-auto px-3 md:px-5 py-8 lg:py-16">
          <div className="space-y-8">
            <PublicShowroom />
          </div>
        </div>
      </main>

      <FeatureGuide />
      <Guide />
      <Statistics />
      <PricingSolution />
      <Banner />
      <Footer />

      <FloatingQRButton />
    </>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// ✅ MAIN APP CONTENT COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

function AppContent() {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading, user, error } = useAuth({
    enableActivityTracking: false,
    enableSessionWarnings: false,
    autoLogoutDelay: 0
  });
  
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showPlansModal, setShowPlansModal] = useState(false);
  const [domainConfig, setDomainConfig] = useState(getCurrentDomainConfig());
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [showPaymentConfirmation, setShowPaymentConfirmation] = useState(false);
  const [checkoutOptions, setCheckoutOptions] = useState<RazorpayCheckoutOptions | null>(null);
  const [paymentId, setPaymentId] = useState<string | null>(null);
  const [processingPayment, setProcessingPayment] = useState(false);

  useEffect(() => {
    try {
      console.log('🚀 Tile Showroom App initializing...');
      
      const config = getCurrentDomainConfig();
      setDomainConfig(config);
      applyDomainTheme(config);
      
      console.log('🎯 Domain config:', config);
      console.log('👤 Auth state:', { 
        isAuthenticated, 
        isLoading, 
        userRole: user?.role,
        userId: user?.user_id 
      });
      
      document.title = config.title;
      
      let viewport = document.querySelector('meta[name="viewport"]');
      if (!viewport) {
        viewport = document.createElement('meta');
        viewport.setAttribute('name', 'viewport');
        viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes');
        document.head.appendChild(viewport);
      }
      
    } catch (error) {
      console.error('🔥 App initialization error:', error);
    }
  }, [isAuthenticated, isLoading, user]);

  useEffect(() => {
    if (isAuthenticated && user?.role === 'worker') {
      const currentPath = window.location.pathname;
      const allowedPaths = ['/scan', '/tile/', '/3d-view/', '/room-select/'];
      const isAllowedPath = allowedPaths.some(path => currentPath.startsWith(path));
      
      if (!isAllowedPath && currentPath !== '/') {
        console.log('🔒 Worker blocked from:', currentPath);
        window.location.replace('/scan');
      }
    }
  }, [isAuthenticated, user]);

  const handleBecomeSellerClick = () => {
    navigate('/become-partner');
  };

  const handlePlanSelection = async (planId: string) => {
    try {
      console.log('📦 Selected plan:', planId);
      
      if (!isAuthenticated) {
        console.log('🔐 User not authenticated, showing login modal...');
        setShowPlansModal(false);
        setShowAuthModal(true);
        return;
      }

      console.log('📋 Fetching plan details...');
      const plan = await getPlanById(planId);
      
      if (!plan) {
        alert('❌ Plan not found. Please try again.');
        return;
      }

      setSelectedPlan(plan);
      setShowPlansModal(false);
      setShowPaymentConfirmation(true);
      
    } catch (error: any) {
      console.error('❌ Error selecting plan:', error);
      alert(`❌ Error: ${error.message}`);
    }
  };

  const handlePaymentConfirm = async () => {
    if (!selectedPlan) {
      alert('❌ No plan selected');
      return;
    }

    setProcessingPayment(true);

    try {
      console.log('💳 Initiating payment for plan:', selectedPlan.plan_name);

      const currentUser = auth.currentUser;
      if (!currentUser) {
        throw new Error('Please login first');
      }

      const result = await initiatePayment(
        selectedPlan.id,
        selectedPlan.plan_name,
        selectedPlan.price
      );

      if (!result.success || !result.checkoutOptions || !result.paymentId) {
        throw new Error(result.error || 'Failed to initiate payment');
      }

      console.log('✅ Payment initiated successfully');
      console.log('📝 Payment ID:', result.paymentId);

      setCheckoutOptions(result.checkoutOptions);
      setPaymentId(result.paymentId);
      setShowPaymentConfirmation(false);

    } catch (error: any) {
      console.error('❌ Payment initiation error:', error);
      alert(`❌ Payment Error:\n${error.message}`);
      setProcessingPayment(false);
    }
  };

  const handlePaymentError = (error: string) => {
    console.error('❌ Payment checkout error:', error);
    alert(`❌ Payment Error:\n${error}`);
    
    setCheckoutOptions(null);
    setPaymentId(null);
    setProcessingPayment(false);
    setSelectedPlan(null);
  };

  const renderError = () => {
    if (!error) return null;
    
    return (
      <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 animate-shake">
        <div className="flex items-start gap-3">
          <div className="text-red-500 text-xl flex-shrink-0">⚠️</div>
          <div className="flex-1">
            <h3 className="font-semibold text-red-800 text-base mb-1">
              Authentication Error
            </h3>
            <p className="text-red-700 text-sm break-words">{error}</p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-700 transition-colors font-medium flex-shrink-0"
          >
            Retry
          </button>
        </div>
      </div>
    );
  };

  const renderLoading = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="text-center max-w-md w-full">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-6"></div>
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
          {domainConfig.title}
        </h2>
        <p className="text-lg text-gray-600 mb-2">Loading application...</p>
        <p className="text-sm text-gray-500">Initializing secure authentication system</p>
        
        <div className="mt-6 space-y-2">
          <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            <span>Verifying authentication tokens</span>
          </div>
          <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>Loading user profile</span>
          </div>
          <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
            <span>Applying security policies</span>
          </div>
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return renderLoading();
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <GlobalStyles />
      
      <Toaster 
        position="top-right"
        reverseOrder={false}
        gutter={8}
        toastOptions={{
          duration: 5000,
          style: {
            background: '#fff',
            color: '#363636',
            fontSize: '14px',
            padding: '12px 16px',
            borderRadius: '10px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            maxWidth: '500px',
          },
          success: {
            duration: 4000,
            iconTheme: {
              primary: '#10B981',
              secondary: '#fff',
            },
          },
          error: {
            duration: 6000,
            iconTheme: {
              primary: '#EF4444',
              secondary: '#fff',
            },
          },
        }}
      />

      <div className="flex-1">
        <Routes>
          {/* ═══════════════════════════════════════════════════════════════
              ✅ BECOME A SELLER - FULL PAGE ROUTE (NO MODAL)
          ═══════════════════════════════════════════════════════════════ */}
          <Route
            path="/become-partner"
            element={<SellerRequestForm />}
          />

          {/* QR SCAN ROUTES - PUBLIC ACCESS */}
          <Route path="/tile/:tileId" element={<TileDetailsPage />} />
          <Route path="/room-select/:tileId" element={<RoomSelectorPage />} />
          <Route path="/3d-view/:tileId/:roomType" element={<Room3DViewPage />} />
          <Route path="/tile/search" element={<TileSearchPage />} />

          {/* WORKER SCAN PAGE */}
          <Route
            path="/scan"
            element={
              <WorkerProtectedRoute>
                <WorkerErrorBoundary>
                  <ScanPage />
                </WorkerErrorBoundary>
              </WorkerProtectedRoute>
            }
          />

          {/* SELLER AUTO-LOGIN */}
          <Route path="/seller-auto-login" element={<SellerAutoLogin />} />

          {/* PAYMENT ROUTES */}
          <Route path="/payment-success" element={<PaymentSuccess />} />
          <Route path="/payment-failure" element={<PaymentFailure />} />
          <Route 
            path="/payment-cancelled" 
            element={
              <Navigate 
                to="/payment-failure?error=Payment cancelled by user" 
                replace 
              />
            } 
          />

          {/* ADMIN DASHBOARD */}
          <Route
            path="/admin/*"
            element={
              <AdminProtectedRoute>
                <DomainHeader />
                <main className="w-full max-w-[1800px] mx-auto px-3 md:px-5 py-6 lg:py-8">
                  {renderError()}
                  <AdminDashboard />
                </main>
              </AdminProtectedRoute>
            }
          />

          {/* SELLER DASHBOARD */}
          <Route
            path="/seller/*"
            element={
              <SellerProtectedRoute>
                <DomainHeader />
                <main className="w-full max-w-[1800px] mx-auto px-3 md:px-5 py-6 lg:py-8">
                  {renderError()}
                  <SellerDashboard />
                </main>
              </SellerProtectedRoute>
            }
          />

          {/* HOME PAGE - PUBLIC/CUSTOMER */}
          <Route
            path="/*"
            element={
              <ProtectedRoute allowUnauthenticated={true}>
                {renderError()}
                <HomePage 
                  onLoginClick={() => setShowAuthModal(true)}
                  onBecomeSellerClick={handleBecomeSellerClick}
                />
              </ProtectedRoute>
            }
          />

          {/* CATCH-ALL REDIRECT */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          ✅ MODALS (NO SELLER REQUEST MODAL - NOW IT'S A ROUTE)
      ═══════════════════════════════════════════════════════════════ */}
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />

      <PlansModal
        isOpen={showPlansModal}
        onClose={() => setShowPlansModal(false)}
        isLoggedIn={isAuthenticated}
        onSelectPlan={handlePlanSelection}
      />

      <PaymentConfirmationModal
        isOpen={showPaymentConfirmation}
        onClose={() => {
          setShowPaymentConfirmation(false);
          setSelectedPlan(null);
        }}
        plan={selectedPlan}
        onConfirm={handlePaymentConfirm}
        isProcessing={processingPayment}
      />

      {checkoutOptions && paymentId && selectedPlan && (
        <PaymentCheckout
          checkoutOptions={checkoutOptions}
          paymentId={paymentId}
          planId={selectedPlan.id}
          sellerId={user?.uid || ''}
          onError={handlePaymentError}
        />
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// ✅ APP WRAPPER WITH ROUTER
// ═══════════════════════════════════════════════════════════════════════════

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <AppContent />
      </Router>
    </ErrorBoundary>
  );
}

export default App;