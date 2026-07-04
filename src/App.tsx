
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
// // // // import { Eye } from 'lucide-react';

// // // // // ═══════════════════════════════════════════════════════════════
// // // // // ✅ PAYMENT IMPORTS (RAZORPAY)
// // // // // ═══════════════════════════════════════════════════════════════
// // // // import { PaymentConfirmationModal } from './components/Payment/PaymentConfirmationModal';
// // // // import { PaymentCheckout } from './components/Payment/PaymentCheckout';
// // // // import { initiatePayment } from './lib/paymentService';
// // // // import { getPlanById } from './lib/planService';
// // // // import type { Plan } from './types/plan.types';
// // // // import type { RazorpayCheckoutOptions } from './types/payment.types';

// // // // // ═══════════════════════════════════════════════════════════════
// // // // // ✅ ERROR BOUNDARY COMPONENT
// // // // // ═══════════════════════════════════════════════════════════════

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
// // // //     console.error('🔥 App Error Boundary caught error:', error, errorInfo);
// // // //   }

// // // //   render() {
// // // //     if (this.state.hasError) {
// // // //       return (
// // // //         <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center p-4">
// // // //           <div className="text-center p-6 sm:p-8 bg-white rounded-lg sm:rounded-xl shadow-lg max-w-md w-full">
// // // //             <div className="text-red-500 text-5xl sm:text-6xl mb-3 sm:mb-4">⚠️</div>
// // // //             <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">
// // // //               Something went wrong
// // // //             </h1>
// // // //             <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
// // // //               The application encountered an unexpected error. Please refresh the page or contact support.
// // // //             </p>
// // // //             {this.state.error && (
// // // //               <details className="mb-4 sm:mb-6 text-left">
// // // //                 <summary className="text-xs sm:text-sm text-gray-500 cursor-pointer hover:text-gray-700 transition-colors">
// // // //                   Error details
// // // //                 </summary>
// // // //                 <pre className="mt-2 p-2 sm:p-3 bg-gray-100 rounded text-xs overflow-x-auto">
// // // //                   {this.state.error.message}
// // // //                 </pre>
// // // //               </details>
// // // //             )}
// // // //             <button
// // // //               onClick={() => window.location.reload()}
// // // //               className="w-full sm:w-auto bg-red-600 text-white px-6 py-2.5 sm:py-3 rounded-lg hover:bg-red-700 active:bg-red-800 transition-colors font-medium text-sm sm:text-base touch-manipulation shadow-md hover:shadow-lg"
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

// // // // // ═══════════════════════════════════════════════════════════════
// // // // // ✅ MAIN APP CONTENT COMPONENT
// // // // // ═══════════════════════════════════════════════════════════════

// // // // function AppContent() {
// // // //   const { isAuthenticated, isLoading, user, error } = useAuth({
// // // //     enableActivityTracking: false,
// // // //     enableSessionWarnings: false,
// // // //     autoLogoutDelay: 0
// // // //   });
  
// // // //   const [showAuthModal, setShowAuthModal] = useState(false);
// // // //   const [showPlansModal, setShowPlansModal] = useState(false);
// // // //   const [domainConfig, setDomainConfig] = useState(getCurrentDomainConfig());
// // // //   const [isMobile, setIsMobile] = useState(false);

// // // //   // ═══════════════════════════════════════════════════════════════
// // // //   // ✅ PAYMENT STATE (RAZORPAY)
// // // //   // ═══════════════════════════════════════════════════════════════
// // // //   const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
// // // //   const [showPaymentConfirmation, setShowPaymentConfirmation] = useState(false);
// // // //   const [checkoutOptions, setCheckoutOptions] = useState<RazorpayCheckoutOptions | null>(null);
// // // //   const [paymentId, setPaymentId] = useState<string | null>(null);
// // // //   const [processingPayment, setProcessingPayment] = useState(false);

// // // //   // ═══════════════════════════════════════════════════════════════
// // // //   // ✅ MOBILE DETECTION
// // // //   // ═══════════════════════════════════════════════════════════════
  
// // // //   useEffect(() => {
// // // //     const checkMobile = () => {
// // // //       setIsMobile(window.innerWidth < 768);
// // // //     };
    
// // // //     checkMobile();
// // // //     window.addEventListener('resize', checkMobile);
    
// // // //     return () => window.removeEventListener('resize', checkMobile);
// // // //   }, []);

// // // //   // ═══════════════════════════════════════════════════════════════
// // // //   // ✅ APP INITIALIZATION
// // // //   // ═══════════════════════════════════════════════════════════════

// // // //   useEffect(() => {
// // // //     try {
// // // //       console.log('🚀 Tile Showroom App initializing...');
      
// // // //       const config = getCurrentDomainConfig();
// // // //       setDomainConfig(config);
// // // //       applyDomainTheme(config);
      
// // // //       console.log('🎯 Domain config:', config);
// // // //       console.log('👤 Auth state:', { 
// // // //         isAuthenticated, 
// // // //         isLoading, 
// // // //         userRole: user?.role,
// // // //         userId: user?.user_id 
// // // //       });
      
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

// // // //   // ═══════════════════════════════════════════════════════════════
// // // //   // ✅ WORKER ROUTE PROTECTION
// // // //   // ═══════════════════════════════════════════════════════════════

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

// // // //   // ═══════════════════════════════════════════════════════════════
// // // //   // ✅ PLAN SELECTION HANDLER
// // // //   // ═══════════════════════════════════════════════════════════════

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

// // // //   // ═══════════════════════════════════════════════════════════════
// // // //   // ✅ PAYMENT CONFIRM HANDLER (RAZORPAY)
// // // //   // ═══════════════════════════════════════════════════════════════

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

// // // //       const result = await initiatePayment(
// // // //         selectedPlan.id,
// // // //         selectedPlan.plan_name,
// // // //         selectedPlan.price
// // // //       );

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

// // // //   // ═══════════════════════════════════════════════════════════════
// // // //   // ✅ PAYMENT ERROR HANDLER
// // // //   // ═══════════════════════════════════════════════════════════════

// // // //   const handlePaymentError = (error: string) => {
// // // //     console.error('❌ Payment checkout error:', error);
// // // //     alert(`❌ Payment Error:\n${error}`);
    
// // // //     setCheckoutOptions(null);
// // // //     setPaymentId(null);
// // // //     setProcessingPayment(false);
// // // //     setSelectedPlan(null);
// // // //   };

// // // //   // ═══════════════════════════════════════════════════════════════
// // // //   // ✅ ERROR DISPLAY
// // // //   // ═══════════════════════════════════════════════════════════════

// // // //   const renderError = () => {
// // // //     if (!error) return null;
    
// // // //     return (
// // // //       <div className="mb-4 sm:mb-6 bg-red-50 border border-red-200 rounded-lg sm:rounded-xl p-3 sm:p-4 animate-shake">
// // // //         <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
// // // //           <div className="text-red-500 text-2xl sm:text-xl flex-shrink-0">⚠️</div>
// // // //           <div className="flex-1 min-w-0">
// // // //             <h3 className="font-semibold text-red-800 text-sm sm:text-base mb-1">
// // // //               Authentication Error
// // // //             </h3>
// // // //             <p className="text-red-700 text-xs sm:text-sm break-words">{error}</p>
// // // //           </div>
// // // //           <button
// // // //             onClick={() => window.location.reload()}
// // // //             className="w-full sm:w-auto bg-red-600 text-white px-4 py-2 rounded-lg text-xs sm:text-sm hover:bg-red-700 active:bg-red-800 transition-colors font-medium touch-manipulation flex-shrink-0"
// // // //           >
// // // //             Retry
// // // //           </button>
// // // //         </div>
// // // //       </div>
// // // //     );
// // // //   };

// // // //   // ═══════════════════════════════════════════════════════════════
// // // //   // ✅ LOADING STATE
// // // //   // ═══════════════════════════════════════════════════════════════

// // // //   const renderLoading = () => (
// // // //     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
// // // //       <div className="text-center max-w-md w-full">
// // // //         <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-b-4 border-blue-600 mx-auto mb-4 sm:mb-6"></div>
// // // //         <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-2">
// // // //           {domainConfig.title}
// // // //         </h2>
// // // //         <p className="text-base sm:text-lg text-gray-600 mb-1 sm:mb-2">Loading application...</p>
// // // //         <p className="text-xs sm:text-sm text-gray-500">Initializing secure authentication system</p>
        
// // // //         <div className="mt-4 sm:mt-6 space-y-2">
// // // //           <div className="flex items-center justify-center space-x-2 text-xs sm:text-sm text-gray-500">
// // // //             <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
// // // //             <span>Verifying authentication tokens</span>
// // // //           </div>
// // // //           <div className="flex items-center justify-center space-x-2 text-xs sm:text-sm text-gray-500">
// // // //             <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
// // // //             <span>Loading user profile</span>
// // // //           </div>
// // // //           <div className="flex items-center justify-center space-x-2 text-xs sm:text-sm text-gray-500">
// // // //             <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
// // // //             <span>Applying security policies</span>
// // // //           </div>
// // // //         </div>
// // // //       </div>
// // // //     </div>
// // // //   );

// // // //   // ═══════════════════════════════════════════════════════════════
// // // //   // ✅ AUTH PROMPT
// // // //   // ═══════════════════════════════════════════════════════════════

// // // //   const renderAuthPrompt = () => {
// // // //     if (domainConfig.userType !== 'customer') {
// // // //       return null;
// // // //     }
    
// // // //     return (
// // // //       <div className="mb-4 sm:mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-lg">
// // // //         <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
// // // //           <div className="flex items-start gap-3 sm:gap-4 flex-1">
// // // //             <div className="text-3xl sm:text-4xl flex-shrink-0">🏠</div>
// // // //             <div className="flex-1 min-w-0">
// // // //               <h3 className="text-lg sm:text-xl font-bold text-blue-800 mb-1 sm:mb-2">
// // // //                 SrijanX Tile - Virtual Experience
// // // //               </h3>
// // // //               <p className="text-sm sm:text-base text-blue-700 mb-2 sm:mb-3">
// // // //                 Explore our immersive 3D tile visualization platform. 
// // // //                 {isAuthenticated 
// // // //                   ? ' Manage your business with our seller dashboard.' 
// // // //                   : ' Sign in for seller dashboard and admin management features.'}
// // // //               </p>
// // // //               <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-blue-600">
// // // //                 <span className="flex items-center whitespace-nowrap">
// // // //                   <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-1"></span>
// // // //                   Virtual Showroom
// // // //                 </span>
// // // //                 <span className="flex items-center whitespace-nowrap">
// // // //                   <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1"></span>
// // // //                   3D Visualization
// // // //                 </span>
// // // //                 <span className="flex items-center whitespace-nowrap">
// // // //                   <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mr-1"></span>
// // // //                   Real-time Preview
// // // //                 </span>
// // // //               </div>
// // // //             </div>
// // // //           </div>

// // // //           <div className="flex gap-3 w-full lg:w-auto">
// // // //             {!isAuthenticated && (
// // // //               <button
// // // //                 onClick={() => setShowAuthModal(true)}
// // // //                 className="flex-1 lg:flex-none bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-lg sm:rounded-xl hover:from-blue-700 hover:to-cyan-700 active:from-blue-800 active:to-cyan-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0 font-medium text-sm sm:text-base flex items-center justify-center gap-2 touch-manipulation"
// // // //               >
// // // //                 <span className="text-lg sm:text-xl">🔐</span>
// // // //                 <span>Sign In</span>
// // // //               </button>
// // // //             )}
// // // //           </div>
// // // //         </div>
// // // //       </div>
// // // //     );
// // // //   };

// // // //   // ═══════════════════════════════════════════════════════════════
// // // //   // ✅ SHOW LOADING IF AUTH IS LOADING
// // // //   // ═══════════════════════════════════════════════════════════════

// // // //   if (isLoading) {
// // // //     return renderLoading();
// // // //   }

// // // //   // ═══════════════════════════════════════════════════════════════
// // // //   // ✅ MAIN RENDER - STICKY FOOTER LAYOUT
// // // //   // ═══════════════════════════════════════════════════════════════

// // // //   return (
// // // //     <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
// // // //       {/* ✅ Toast Notifications */}
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
// // // //           success: {
// // // //             duration: 4000,
// // // //             iconTheme: {
// // // //               primary: '#10B981',
// // // //               secondary: '#fff',
// // // //             },
// // // //           },
// // // //           error: {
// // // //             duration: 6000,
// // // //             iconTheme: {
// // // //               primary: '#EF4444',
// // // //               secondary: '#fff',
// // // //             },
// // // //           },
// // // //         }}
// // // //       />

// // // //       {/* ═══════════════════════════════════════════════════════════ */}
// // // //       {/* ✅ MAIN CONTENT AREA - FLEX GROW */}
// // // //       {/* ═══════════════════════════════════════════════════════════ */}
// // // //       <div className="flex-1">
// // // //         <Routes>
// // // //           {/* ═══════════════════════════════════════════════════════════ */}
// // // //           {/* ✅ QR SCAN ROUTES - PUBLIC ACCESS */}
// // // //           {/* ═══════════════════════════════════════════════════════════ */}
          
// // // //           <Route path="/tile/:tileId" element={<TileDetailsPage />} />
// // // //           <Route path="/room-select/:tileId" element={<RoomSelectorPage />} />
// // // //           <Route path="/3d-view/:tileId/:roomType" element={<Room3DViewPage />} />
// // // //           <Route path="/tile/search" element={<TileSearchPage />} />

// // // //           {/* ═══════════════════════════════════════════════════════════ */}
// // // //           {/* ✅ WORKER SCAN PAGE */}
// // // //           {/* ═══════════════════════════════════════════════════════════ */}
          
// // // //           <Route
// // // //             path="/scan"
// // // //             element={
// // // //               <WorkerProtectedRoute>
// // // //                 <WorkerErrorBoundary>
// // // //                   <ScanPage />
// // // //                 </WorkerErrorBoundary>
// // // //               </WorkerProtectedRoute>
// // // //             }
// // // //           />

// // // //           {/* ═══════════════════════════════════════════════════════════ */}
// // // //           {/* ✅ SELLER AUTO-LOGIN */}
// // // //           {/* ═══════════════════════════════════════════════════════════ */}
          
// // // //           <Route path="/seller-auto-login" element={<SellerAutoLogin />} />

// // // //           {/* ═══════════════════════════════════════════════════════════ */}
// // // //           {/* ✅ PAYMENT ROUTES - PUBLIC ACCESS */}
// // // //           {/* ═══════════════════════════════════════════════════════════ */}
          
// // // //           <Route path="/payment-success" element={<PaymentSuccess />} />
// // // //           <Route path="/payment-failure" element={<PaymentFailure />} />
// // // //           <Route 
// // // //             path="/payment-cancelled" 
// // // //             element={
// // // //               <Navigate 
// // // //                 to="/payment-failure?error=Payment cancelled by user" 
// // // //                 replace 
// // // //               />
// // // //             } 
// // // //           />

// // // //           {/* ═══════════════════════════════════════════════════════════ */}
// // // //           {/* ✅ ADMIN DASHBOARD */}
// // // //           {/* ═══════════════════════════════════════════════════════════ */}
          
// // // //           <Route
// // // //             path="/admin/*"
// // // //             element={
// // // //               <AdminProtectedRoute>
// // // //                 <DomainHeader />
// // // //                 <main className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
// // // //                   {renderError()}
// // // //                   <AdminDashboard />
// // // //                 </main>
// // // //               </AdminProtectedRoute>
// // // //             }
// // // //           />

// // // //           {/* ═══════════════════════════════════════════════════════════ */}
// // // //           {/* ✅ SELLER DASHBOARD */}
// // // //           {/* ═══════════════════════════════════════════════════════════ */}
          
// // // //           <Route
// // // //             path="/seller/*"
// // // //             element={
// // // //               <SellerProtectedRoute>
// // // //                 <DomainHeader />
// // // //                 <main className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
// // // //                   {renderError()}
// // // //                   <SellerDashboard />
// // // //                 </main>
// // // //               </SellerProtectedRoute>
// // // //             }
// // // //           />

// // // //           {/* ═══════════════════════════════════════════════════════════ */}
// // // //           {/* ✅ PUBLIC/CUSTOMER ROUTES */}
// // // //           {/* ═══════════════════════════════════════════════════════════ */}
          
// // // //           <Route
// // // //             path="/*"
// // // //             element={
// // // //               <ProtectedRoute allowUnauthenticated={true}>
// // // //                 <DomainHeader />
// // // //                 <main className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
// // // //                   {renderError()}
// // // //                   {renderAuthPrompt()}
                  
// // // //                   <div className="space-y-6 sm:space-y-8">
// // // //                     <PublicShowroom />
                    
// // // //                     <section className="py-8 sm:py-12 lg:py-16 bg-white/80 backdrop-blur-sm rounded-lg sm:rounded-xl shadow-lg">
// // // //                       <div className="max-w-4xl mx-auto px-4 sm:px-6">
// // // //                         <div className="text-center mb-8 sm:mb-12">
// // // //                           <div className="text-4xl sm:text-5xl mb-3 sm:mb-4">🤝</div>
// // // //                           <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-3 sm:mb-4">
// // // //                             Partner With Us
// // // //                           </h2>
// // // //                           <p className="text-sm sm:text-base md:text-lg text-gray-600 mb-4 sm:mb-6">
// // // //                             Expand your tile business with our cutting-edge 3D visualization platform
// // // //                           </p>
// // // //                           <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs sm:text-sm text-gray-500">
// // // //                             <span className="flex items-center whitespace-nowrap">
// // // //                               <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
// // // //                               3D Showroom
// // // //                             </span>
// // // //                             <span className="flex items-center whitespace-nowrap">
// // // //                               <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
// // // //                               QR Code System
// // // //                             </span>
// // // //                             <span className="flex items-center whitespace-nowrap">
// // // //                               <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
// // // //                               Analytics Dashboard
// // // //                             </span>
// // // //                           </div>
// // // //                         </div>
// // // //                         <SellerRequestForm />
// // // //                       </div>
// // // //                     </section>
// // // //                   </div>
// // // //                 </main>

// // // //                 {/* ✅ Floating QR Scan Button */}
// // // //                 <FloatingQRButton />
// // // //               </ProtectedRoute>
// // // //             }
// // // //           />

// // // //           {/* ═══════════════════════════════════════════════════════════ */}
// // // //           {/* ✅ CATCH-ALL REDIRECT */}
// // // //           {/* ═══════════════════════════════════════════════════════════ */}
          
// // // //           <Route path="*" element={<Navigate to="/" replace />} />
// // // //         </Routes>
// // // //       </div>

// // // //       {/* ═══════════════════════════════════════════════════════════ */}
// // // //       {/* ✅ FOOTER - ALWAYS AT BOTTOM (STICKY FOOTER) */}
// // // //       {/* ═══════════════════════════════════════════════════════════ */}
      
// // // //       <footer className="mt-auto py-6 sm:py-8 bg-white/80 backdrop-blur-sm border-t border-gray-200">
// // // //         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
// // // //           <div className="text-center text-gray-600">
// // // //             <p className="text-sm sm:text-base font-medium">
// // // //               &copy; 2025 SrijanX Tile. All rights reserved.
// // // //             </p>
// // // //             <p className="text-xs sm:text-sm mt-1 sm:mt-2 text-gray-500">
// // // //               Powered by advanced 3D visualization technology
// // // //             </p>
// // // //             <div className="mt-3 sm:mt-4 flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-xs text-gray-400">
// // // //               <span className="flex items-center">
// // // //                 <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1"></span>
// // // //                 Secure Platform
// // // //               </span>
// // // //               <span className="flex items-center">
// // // //                 <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-1"></span>
// // // //                 Cloud Powered
// // // //               </span>
// // // //               <span className="flex items-center">
// // // //                 <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mr-1"></span>
// // // //                 Real-time Updates
// // // //               </span>
// // // //             </div>
// // // //           </div>
// // // //         </div>
// // // //       </footer>

// // // //       {/* ═══════════════════════════════════════════════════════════ */}
// // // //       {/* ✅ MODALS */}
// // // //       {/* ═══════════════════════════════════════════════════════════ */}
      
// // // //       {/* Auth Modal */}
// // // //       <AuthModal 
// // // //         isOpen={showAuthModal} 
// // // //         onClose={() => setShowAuthModal(false)} 
// // // //       />

// // // //       {/* Plans Modal */}
// // // //       <PlansModal
// // // //         isOpen={showPlansModal}
// // // //         onClose={() => setShowPlansModal(false)}
// // // //         isLoggedIn={isAuthenticated}
// // // //         onSelectPlan={handlePlanSelection}
// // // //       />

// // // //       {/* Payment Confirmation Modal */}
// // // //       <PaymentConfirmationModal
// // // //         isOpen={showPaymentConfirmation}
// // // //         onClose={() => {
// // // //           setShowPaymentConfirmation(false);
// // // //           setSelectedPlan(null);
// // // //         }}
// // // //         plan={selectedPlan}
// // // //         onConfirm={handlePaymentConfirm}
// // // //         isProcessing={processingPayment}
// // // //       />

// // // //       {/* Payment Checkout */}
// // // //       {checkoutOptions && paymentId && selectedPlan && (
// // // //         <PaymentCheckout
// // // //           checkoutOptions={checkoutOptions}
// // // //           paymentId={paymentId}
// // // //           planId={selectedPlan.id}
// // // //           sellerId={user?.uid || ''}
// // // //           onError={handlePaymentError}
// // // //         />
// // // //       )}
// // // //     </div>
// // // //   );
// // // // }

// // // // // ═══════════════════════════════════════════════════════════════
// // // // // ✅ APP WRAPPER WITH ROUTER
// // // // // ═══════════════════════════════════════════════════════════════

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

// // // // console.log('✅ App.tsx - PRODUCTION v12.0 FINAL (Sticky Footer | All Responsive | Production Ready)'); 
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
// // // import { ArrowRight, PlayCircle, RefreshCw } from 'lucide-react';

// // // // ═══════════════════════════════════════════════════════════════
// // // // ✅ PAYMENT IMPORTS (RAZORPAY)
// // // // ═══════════════════════════════════════════════════════════════
// // // import { PaymentConfirmationModal } from './components/Payment/PaymentConfirmationModal';
// // // import { PaymentCheckout } from './components/Payment/PaymentCheckout';
// // // import { initiatePayment } from './lib/paymentService';
// // // import { getPlanById } from './lib/planService';
// // // import type { Plan } from './types/plan.types';
// // // import type { RazorpayCheckoutOptions } from './types/payment.types';

// // // // ═══════════════════════════════════════════════════════════════
// // // // ✅ ERROR BOUNDARY COMPONENT
// // // // ═══════════════════════════════════════════════════════════════

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
// // //     console.error('🔥 App Error Boundary caught error:', error, errorInfo);
// // //   }

// // //   render() {
// // //     if (this.state.hasError) {
// // //       return (
// // //         <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center p-4">
// // //           <div className="text-center p-6 sm:p-8 bg-white rounded-lg sm:rounded-xl shadow-lg max-w-md w-full">
// // //             <div className="text-red-500 text-5xl sm:text-6xl mb-3 sm:mb-4">⚠️</div>
// // //             <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">
// // //               Something went wrong
// // //             </h1>
// // //             <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
// // //               The application encountered an unexpected error. Please refresh the page or contact support.
// // //             </p>
// // //             {this.state.error && (
// // //               <details className="mb-4 sm:mb-6 text-left">
// // //                 <summary className="text-xs sm:text-sm text-gray-500 cursor-pointer hover:text-gray-700 transition-colors">
// // //                   Error details
// // //                 </summary>
// // //                 <pre className="mt-2 p-2 sm:p-3 bg-gray-100 rounded text-xs overflow-x-auto">
// // //                   {this.state.error.message}
// // //                 </pre>
// // //               </details>
// // //             )}
// // //             <button
// // //               onClick={() => window.location.reload()}
// // //               className="w-full sm:w-auto bg-red-600 text-white px-6 py-2.5 sm:py-3 rounded-lg hover:bg-red-700 active:bg-red-800 transition-colors font-medium text-sm sm:text-base touch-manipulation shadow-md hover:shadow-lg"
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

// // // // ═══════════════════════════════════════════════════════════════
// // // // ✅ MAIN APP CONTENT COMPONENT
// // // // ═══════════════════════════════════════════════════════════════

// // // function AppContent() {
// // //   const { isAuthenticated, isLoading, user, error } = useAuth({
// // //     enableActivityTracking: false,
// // //     enableSessionWarnings: false,
// // //     autoLogoutDelay: 0
// // //   });
  
// // //   const [showAuthModal, setShowAuthModal] = useState(false);
// // //   const [showPlansModal, setShowPlansModal] = useState(false);
// // //   const [domainConfig, setDomainConfig] = useState(getCurrentDomainConfig());
// // //   const [isMobile, setIsMobile] = useState(false);

// // //   // ═══════════════════════════════════════════════════════════════
// // //   // ✅ PAYMENT STATE (RAZORPAY)
// // //   // ═══════════════════════════════════════════════════════════════
// // //   const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
// // //   const [showPaymentConfirmation, setShowPaymentConfirmation] = useState(false);
// // //   const [checkoutOptions, setCheckoutOptions] = useState<RazorpayCheckoutOptions | null>(null);
// // //   const [paymentId, setPaymentId] = useState<string | null>(null);
// // //   const [processingPayment, setProcessingPayment] = useState(false);

// // //   // ═══════════════════════════════════════════════════════════════
// // //   // ✅ MOBILE DETECTION
// // //   // ═══════════════════════════════════════════════════════════════
  
// // //   useEffect(() => {
// // //     const checkMobile = () => {
// // //       setIsMobile(window.innerWidth < 768);
// // //     };
    
// // //     checkMobile();
// // //     window.addEventListener('resize', checkMobile);
    
// // //     return () => window.removeEventListener('resize', checkMobile);
// // //   }, []);

// // //   // ═══════════════════════════════════════════════════════════════
// // //   // ✅ APP INITIALIZATION
// // //   // ═══════════════════════════════════════════════════════════════

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

// // //   // ═══════════════════════════════════════════════════════════════
// // //   // ✅ WORKER ROUTE PROTECTION
// // //   // ═══════════════════════════════════════════════════════════════

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

// // //   // ═══════════════════════════════════════════════════════════════
// // //   // ✅ PLAN SELECTION HANDLER
// // //   // ═══════════════════════════════════════════════════════════════

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

// // //   // ═══════════════════════════════════════════════════════════════
// // //   // ✅ PAYMENT CONFIRM HANDLER (RAZORPAY)
// // //   // ═══════════════════════════════════════════════════════════════

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

// // //   // ═══════════════════════════════════════════════════════════════
// // //   // ✅ PAYMENT ERROR HANDLER
// // //   // ═══════════════════════════════════════════════════════════════

// // //   const handlePaymentError = (error: string) => {
// // //     console.error('❌ Payment checkout error:', error);
// // //     alert(`❌ Payment Error:\n${error}`);
    
// // //     setCheckoutOptions(null);
// // //     setPaymentId(null);
// // //     setProcessingPayment(false);
// // //     setSelectedPlan(null);
// // //   };

// // //   // ═══════════════════════════════════════════════════════════════
// // //   // ✅ ERROR DISPLAY
// // //   // ═══════════════════════════════════════════════════════════════

// // //   const renderError = () => {
// // //     if (!error) return null;
    
// // //     return (
// // //       <div className="mb-4 sm:mb-6 bg-red-50 border border-red-200 rounded-lg sm:rounded-xl p-3 sm:p-4 animate-shake">
// // //         <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
// // //           <div className="text-red-500 text-2xl sm:text-xl flex-shrink-0">⚠️</div>
// // //           <div className="flex-1 min-w-0">
// // //             <h3 className="font-semibold text-red-800 text-sm sm:text-base mb-1">
// // //               Authentication Error
// // //             </h3>
// // //             <p className="text-red-700 text-xs sm:text-sm break-words">{error}</p>
// // //           </div>
// // //           <button
// // //             onClick={() => window.location.reload()}
// // //             className="w-full sm:w-auto bg-red-600 text-white px-4 py-2 rounded-lg text-xs sm:text-sm hover:bg-red-700 active:bg-red-800 transition-colors font-medium touch-manipulation flex-shrink-0"
// // //           >
// // //             Retry
// // //           </button>
// // //         </div>
// // //       </div>
// // //     );
// // //   };

// // //   // ═══════════════════════════════════════════════════════════════
// // //   // ✅ LOADING STATE
// // //   // ═══════════════════════════════════════════════════════════════

// // //   const renderLoading = () => (
// // //     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
// // //       <div className="text-center max-w-md w-full">
// // //         <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-b-4 border-blue-600 mx-auto mb-4 sm:mb-6"></div>
// // //         <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-2">
// // //           {domainConfig.title}
// // //         </h2>
// // //         <p className="text-base sm:text-lg text-gray-600 mb-1 sm:mb-2">Loading application...</p>
// // //         <p className="text-xs sm:text-sm text-gray-500">Initializing secure authentication system</p>
        
// // //         <div className="mt-4 sm:mt-6 space-y-2">
// // //           <div className="flex items-center justify-center space-x-2 text-xs sm:text-sm text-gray-500">
// // //             <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
// // //             <span>Verifying authentication tokens</span>
// // //           </div>
// // //           <div className="flex items-center justify-center space-x-2 text-xs sm:text-sm text-gray-500">
// // //             <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
// // //             <span>Loading user profile</span>
// // //           </div>
// // //           <div className="flex items-center justify-center space-x-2 text-xs sm:text-sm text-gray-500">
// // //             <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
// // //             <span>Applying security policies</span>
// // //           </div>
// // //         </div>
// // //       </div>
// // //     </div>
// // //   );

// // //   // ═══════════════════════════════════════════════════════════════
// // //   // ✅ NEW HERO SECTION - EXACT DUMMY UI
// // //   // ═══════════════════════════════════════════════════════════════

// // //   const renderHeroSection = () => {
// // //     if (domainConfig.userType !== 'customer') {
// // //       return null;
// // //     }
    
// // //     return (
// // //       <div className="relative w-full bg-gradient-to-br from-white via-blue-50/30 to-purple-50/20 overflow-hidden">

// // //         <nav className="max-w-[1400px] mx-auto px-6 py-6 flex items-center justify-between">
// // //         {/* Logo */}
// // //         <div className="flex items-center gap-2 cursor-pointer">
// // //           <div className="relative w-6 h-6 flex items-center justify-center">
// // //             <div className="absolute top-0 left-0 w-3.5 h-3.5 bg-indigo-300 rounded-[3px]"></div>
// // //             <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-[#0B40E8] rounded-[3px] mix-blend-multiply"></div>
// // //           </div>
// // //           <span className="font-bold text-[22px] tracking-tight">Tilesview360</span>
// // //         </div>

// // //         {/* Desktop Links */}
// // //         <div className="hidden lg:flex items-center gap-10">
// // //           <a href="#" className="text-gray-900 font-semibold relative after:content-[''] after:absolute after:left-0 after:-bottom-1.5 after:w-full after:h-0.5 after:bg-[#0B40E8]">
// // //             Product
// // //           </a>
// // //           <a href="#" className="text-gray-500 hover:text-gray-900 font-medium transition-colors">Features</a>
// // //           <a href="#" className="text-gray-500 hover:text-gray-900 font-medium transition-colors">Pricing</a>
// // //           <a href="#" className="text-gray-500 hover:text-gray-900 font-medium transition-colors">Showcase</a>
// // //         </div>

// // //         {/* Right Actions */}
// // //         <div className="hidden lg:flex items-center gap-8">
// // //           <a href="#" className="text-gray-700 font-bold hover:text-gray-900 transition-colors">Login</a>
// // //           <button className="bg-[#0B40E8] text-white px-7 py-3 rounded-full font-semibold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/30">
// // //             Request Demo
// // //           </button>
// // //         </div>
// // //       </nav>
// // //         {/* Main Container */}
// // //         <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12 py-12 sm:py-16 lg:py-20 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          
// // //           {/* ═══════════════════════════════════════════════════════════
// // //               LEFT COLUMN - Text Content
// // //           ═══════════════════════════════════════════════════════════ */}
// // //           <div className="space-y-6 sm:space-y-8 order-2 lg:order-1">
            
// // //             {/* Main Heading */}
// // //             <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-900 leading-[1.1] tracking-tight">
// // //               Experience Tiles in Your Space{' '}
// // //               <span className="relative inline-block">
// // //                 <span className="bg-gradient-to-r from-[#0B40E8] via-purple-600 to-pink-600 bg-clip-text text-transparent">
// // //                   Before You Buy
// // //                 </span>
// // //                 <svg 
// // //                   className="absolute -bottom-2 left-0 w-full h-3 text-[#0B40E8]/20" 
// // //                   viewBox="0 0 300 12" 
// // //                   fill="none" 
// // //                   xmlns="http://www.w3.org/2000/svg"
// // //                 >
// // //                   <path 
// // //                     d="M2 10C50 3 100 2 150 6C200 10 250 8 298 4" 
// // //                     stroke="currentColor" 
// // //                     strokeWidth="3" 
// // //                     strokeLinecap="round"
// // //                   />
// // //                 </svg>
// // //               </span>
// // //             </h1>

// // //             {/* Subheading with Gradient */}
// // //             <p className="text-xl sm:text-2xl lg:text-3xl font-semibold bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent">
// // //               Visualize. Customize. Decide.
// // //             </p>

// // //             {/* Description */}
// // //             <p className="text-base sm:text-lg lg:text-xl text-gray-600 leading-relaxed max-w-xl">
// // //               Transform your home design process with immersive 3D tile visualization. 
// // //               See exactly how different tiles look in your actual space before making a purchase decision.
// // //             </p>

// // //             {/* CTA Buttons */}
// // //             <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
// // //               <button 
// // //                 onClick={() => setShowAuthModal(true)}
// // //                 className="w-full sm:w-auto bg-[#0B40E8] text-white px-8 py-4 rounded-full font-semibold text-base sm:text-lg flex items-center justify-center gap-2 hover:bg-blue-700 transition-all duration-300 shadow-xl shadow-blue-600/20 group"
// // //               >
// // //                 Request Demo
// // //                 <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
// // //               </button>
              
// // //               <button 
// // //                 onClick={() => {
// // //                   // Navigate to scan page or show demo
// // //                   window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
// // //                 }}
// // //                 className="w-full sm:w-auto bg-white text-gray-900 px-8 py-4 rounded-full font-semibold text-base sm:text-lg flex items-center justify-center gap-3 hover:bg-gray-50 transition-all duration-300 shadow-sm border border-gray-100"
// // //               >
// // //                 <PlayCircle className="w-5 h-5 text-gray-700" />
// // //                 Watch Live Preview
// // //               </button>
// // //             </div>
// // //           </div>

// // //           {/* ═══════════════════════════════════════════════════════════
// // //               RIGHT COLUMN - Visual Gallery with Floating Cards
// // //           ═══════════════════════════════════════════════════════════ */}
// // //           <div className="relative w-full h-[400px] sm:h-[500px] lg:h-[650px] order-1 lg:order-2">
            
// // //             {/* Main Background Image Container */}
// // //             <div className="absolute inset-y-8 sm:inset-y-12 inset-x-4 sm:inset-x-8 lg:inset-x-12 rounded-[2rem] overflow-hidden shadow-2xl z-0">
// // //               <img 
// // //                 src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
// // //                 alt="Modern living room interior" 
// // //                 className="w-full h-full object-cover object-center scale-105"
// // //                 loading="eager"
// // //               />
// // //               {/* Subtle overlay */}
// // //               <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent"></div>
// // //             </div>

// // //             {/* ═══════════════════════════════════════════════════════════
// // //                 Floating Card 1: Top Right (Venetian Blue)
// // //             ═══════════════════════════════════════════════════════════ */}
// // //             <div 
// // //               className="absolute top-0 right-0 lg:-right-4 bg-white/70 backdrop-blur-xl p-3 pb-4 rounded-[1.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] z-20 border border-white/50 w-[180px] sm:w-[220px] animate-fade-in-up"
// // //               style={{ animationDelay: '0ms' }}
// // //             >
// // //               <div className="w-full h-[140px] sm:h-[180px] rounded-2xl overflow-hidden mb-3">
// // //                 <img 
// // //                   src="https://images.unsplash.com/photo-1588863673322-2621aef42bf8?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80" 
// // //                   alt="Venetian Blue Tile" 
// // //                   className="w-full h-full object-cover"
// // //                   loading="lazy"
// // //                 />
// // //               </div>
// // //               <div className="px-2">
// // //                 <h3 className="font-bold text-gray-900 text-sm sm:text-[15px] leading-tight">Venetian Blue</h3>
// // //                 <p className="text-[#0B40E8] text-xs font-semibold mt-0.5">Living Room</p>
// // //               </div>
// // //             </div>

// // //             {/* ═══════════════════════════════════════════════════════════
// // //                 Floating Card 2: Middle Center (AI Scan)
// // //             ═══════════════════════════════════════════════════════════ */}
// // //             <div 
// // //               className="absolute top-[45%] left-0 lg:-left-12 -translate-y-1/2 bg-white/80 backdrop-blur-xl p-3 sm:p-4 pr-6 sm:pr-10 rounded-[1.25rem] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.15)] z-30 border border-white/60 flex items-center gap-3 sm:gap-4 animate-fade-in-up max-w-[90%] sm:max-w-none" 
// // //               style={{ animationDelay: '150ms' }}
// // //             >
// // //               <div className="bg-[#0B40E8] w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-white shadow-lg shadow-blue-500/30 flex-shrink-0">
// // //                 <RefreshCw className="w-5 h-5 sm:w-6 sm:h-6 animate-spin-slow" />
// // //               </div>
// // //               <div className="min-w-0">
// // //                 <h3 className="font-bold text-gray-900 text-xs sm:text-sm">AI 3D Scan Active</h3>
// // //                 <p className="text-gray-500 text-[10px] sm:text-xs mt-0.5 truncate">Calibrating surface textures...</p>
// // //               </div>
// // //             </div>

// // //             {/* ═══════════════════════════════════════════════════════════
// // //                 Floating Card 3: Bottom Left (Noir Slate)
// // //             ═══════════════════════════════════════════════════════════ */}
// // //             <div 
// // //               className="absolute bottom-4 left-4 lg:left-8 bg-white/90 backdrop-blur-md p-3 pb-4 rounded-[1.5rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.2)] z-20 border border-white w-[160px] sm:w-[200px] animate-fade-in-up" 
// // //               style={{ animationDelay: '300ms' }}
// // //             >
// // //               <div className="w-full h-[120px] sm:h-[160px] rounded-2xl overflow-hidden mb-3 relative group">
// // //                 <img 
// // //                   src="https://images.unsplash.com/photo-1620626011761-996317b8d101?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80" 
// // //                   alt="Noir Slate Bathroom" 
// // //                   className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
// // //                   loading="lazy"
// // //                 />
// // //                 <div className="absolute inset-0 bg-black/10"></div>
// // //               </div>
// // //               <div className="px-2">
// // //                 <h3 className="font-bold text-gray-900 text-sm sm:text-[15px] leading-tight">Noir Slate</h3>
// // //                 <p className="text-[#0B40E8] text-xs font-semibold mt-0.5">Master Bath</p>
// // //               </div>
// // //             </div>

// // //           </div>
// // //         </main>

// // //         {/* ═══════════════════════════════════════════════════════════
// // //             CUSTOM ANIMATIONS
// // //         ═══════════════════════════════════════════════════════════ */}
// // //         <style dangerouslySetInnerHTML={{__html: `
// // //           @keyframes fadeInUp {
// // //             from { 
// // //               opacity: 0; 
// // //               transform: translateY(20px); 
// // //             }
// // //             to { 
// // //               opacity: 1; 
// // //               transform: translateY(0); 
// // //             }
// // //           }
          
// // //           .animate-fade-in-up {
// // //             animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
// // //             opacity: 0;
// // //           }
          
// // //           @keyframes spin-slow {
// // //             from {
// // //               transform: rotate(0deg);
// // //             }
// // //             to {
// // //               transform: rotate(360deg);
// // //             }
// // //           }
          
// // //           .animate-spin-slow {
// // //             animation: spin-slow 4s linear infinite;
// // //           }

// // //           /* Responsive adjustments */
// // //           @media (max-width: 1024px) {
// // //             .animate-fade-in-up {
// // //               animation-delay: 0ms !important;
// // //             }
// // //           }
// // //         `}} />
// // //       </div>
// // //     );
// // //   };

// // //   // ═══════════════════════════════════════════════════════════════
// // //   // ✅ SHOW LOADING IF AUTH IS LOADING
// // //   // ═══════════════════════════════════════════════════════════════

// // //   if (isLoading) {
// // //     return renderLoading();
// // //   }

// // //   // ═══════════════════════════════════════════════════════════════
// // //   // ✅ MAIN RENDER
// // //   // ═══════════════════════════════════════════════════════════════

// // //   return (
// // //     <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
// // //       {/* ✅ Toast Notifications */}
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

// // //       {/* ═══════════════════════════════════════════════════════════
// // //           MAIN CONTENT AREA
// // //       ═══════════════════════════════════════════════════════════ */}
// // //       <div className="flex-1">
// // //         <Routes>
// // //           {/* ═══════════════════════════════════════════════════════════
// // //               QR SCAN ROUTES - PUBLIC ACCESS
// // //           ═══════════════════════════════════════════════════════════ */}
          
// // //           <Route path="/tile/:tileId" element={<TileDetailsPage />} />
// // //           <Route path="/room-select/:tileId" element={<RoomSelectorPage />} />
// // //           <Route path="/3d-view/:tileId/:roomType" element={<Room3DViewPage />} />
// // //           <Route path="/tile/search" element={<TileSearchPage />} />

// // //           {/* ═══════════════════════════════════════════════════════════
// // //               WORKER SCAN PAGE
// // //           ═══════════════════════════════════════════════════════════ */}
          
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

// // //           {/* ═══════════════════════════════════════════════════════════
// // //               SELLER AUTO-LOGIN
// // //           ═══════════════════════════════════════════════════════════ */}
          
// // //           <Route path="/seller-auto-login" element={<SellerAutoLogin />} />

// // //           {/* ═══════════════════════════════════════════════════════════
// // //               PAYMENT ROUTES - PUBLIC ACCESS
// // //           ═══════════════════════════════════════════════════════════ */}
          
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

// // //           {/* ═══════════════════════════════════════════════════════════
// // //               ADMIN DASHBOARD
// // //           ═══════════════════════════════════════════════════════════ */}
          
// // //           <Route
// // //             path="/admin/*"
// // //             element={
// // //               <AdminProtectedRoute>
// // //                 <DomainHeader />
// // //                 <main className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
// // //                   {renderError()}
// // //                   <AdminDashboard />
// // //                 </main>
// // //               </AdminProtectedRoute>
// // //             }
// // //           />

// // //           {/* ═══════════════════════════════════════════════════════════
// // //               SELLER DASHBOARD
// // //           ═══════════════════════════════════════════════════════════ */}
          
// // //           <Route
// // //             path="/seller/*"
// // //             element={
// // //               <SellerProtectedRoute>
// // //                 <DomainHeader />
// // //                 <main className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
// // //                   {renderError()}
// // //                   <SellerDashboard />
// // //                 </main>
// // //               </SellerProtectedRoute>
// // //             }
// // //           />

// // //           {/* ═══════════════════════════════════════════════════════════
// // //               PUBLIC/CUSTOMER ROUTES
// // //           ═══════════════════════════════════════════════════════════ */}
          
// // //           <Route
// // //             path="/*"
// // //             element={
// // //               <ProtectedRoute allowUnauthenticated={true}>
// // //                 <DomainHeader />
// // //                 <main className="w-full">
// // //                   {renderError()}
                  
// // //                   {/* ✅ NEW HERO SECTION */}
// // //                   {renderHeroSection()}
                  
// // //                   {/* ✅ EXISTING COMPONENTS */}
// // //                   <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
// // //                     <div className="space-y-6 sm:space-y-8">
// // //                       <PublicShowroom />
                      
// // //                       <section className="py-8 sm:py-12 lg:py-16 bg-white/80 backdrop-blur-sm rounded-lg sm:rounded-xl shadow-lg">
// // //                         <div className="max-w-4xl mx-auto px-4 sm:px-6">
// // //                           <div className="text-center mb-8 sm:mb-12">
// // //                             <div className="text-4xl sm:text-5xl mb-3 sm:mb-4">🤝</div>
// // //                             <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-3 sm:mb-4">
// // //                               Partner With Us
// // //                             </h2>
// // //                             <p className="text-sm sm:text-base md:text-lg text-gray-600 mb-4 sm:mb-6">
// // //                               Expand your tile business with our cutting-edge 3D visualization platform
// // //                             </p>
// // //                             <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs sm:text-sm text-gray-500">
// // //                               <span className="flex items-center whitespace-nowrap">
// // //                                 <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
// // //                                 3D Showroom
// // //                               </span>
// // //                               <span className="flex items-center whitespace-nowrap">
// // //                                 <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
// // //                                 QR Code System
// // //                               </span>
// // //                               <span className="flex items-center whitespace-nowrap">
// // //                                 <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
// // //                                 Analytics Dashboard
// // //                               </span>
// // //                             </div>
// // //                           </div>
// // //                           <SellerRequestForm />
// // //                         </div>
// // //                       </section>
// // //                     </div>
// // //                   </div>
// // //                 </main>

// // //                 {/* ✅ Floating QR Scan Button */}
// // //                 <FloatingQRButton />
// // //               </ProtectedRoute>
// // //             }
// // //           />

// // //           {/* ═══════════════════════════════════════════════════════════
// // //               CATCH-ALL REDIRECT
// // //           ═══════════════════════════════════════════════════════════ */}
          
// // //           <Route path="*" element={<Navigate to="/" replace />} />
// // //         </Routes>
// // //       </div>

// // //       {/* ═══════════════════════════════════════════════════════════
// // //           FOOTER
// // //       ═══════════════════════════════════════════════════════════ */}
      
// // //       <footer className="mt-auto py-6 sm:py-8 bg-white/80 backdrop-blur-sm border-t border-gray-200">
// // //         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
// // //           <div className="text-center text-gray-600">
// // //             <p className="text-sm sm:text-base font-medium">
// // //               &copy; 2025 SrijanX Tile. All rights reserved.
// // //             </p>
// // //             <p className="text-xs sm:text-sm mt-1 sm:mt-2 text-gray-500">
// // //               Powered by advanced 3D visualization technology
// // //             </p>
// // //             <div className="mt-3 sm:mt-4 flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-xs text-gray-400">
// // //               <span className="flex items-center">
// // //                 <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1"></span>
// // //                 Secure Platform
// // //               </span>
// // //               <span className="flex items-center">
// // //                 <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-1"></span>
// // //                 Cloud Powered
// // //               </span>
// // //               <span className="flex items-center">
// // //                 <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mr-1"></span>
// // //                 Real-time Updates
// // //               </span>
// // //             </div>
// // //           </div>
// // //         </div>
// // //       </footer>

// // //       {/* ═══════════════════════════════════════════════════════════
// // //           MODALS
// // //       ═══════════════════════════════════════════════════════════ */}
      
// // //       {/* Auth Modal */}
// // //       <AuthModal 
// // //         isOpen={showAuthModal} 
// // //         onClose={() => setShowAuthModal(false)} 
// // //       />

// // //       {/* Plans Modal */}
// // //       <PlansModal
// // //         isOpen={showPlansModal}
// // //         onClose={() => setShowPlansModal(false)}
// // //         isLoggedIn={isAuthenticated}
// // //         onSelectPlan={handlePlanSelection}
// // //       />

// // //       {/* Payment Confirmation Modal */}
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

// // //       {/* Payment Checkout */}
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

// // // // ═══════════════════════════════════════════════════════════════
// // // // ✅ APP WRAPPER WITH ROUTER
// // // // ═══════════════════════════════════════════════════════════════

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

// // // console.log('✅ App.tsx - PRODUCTION v13.0 FINAL - EXACT DUMMY UI INTEGRATED - ALL DEVICES RESPONSIVE'); 

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
// // import { ArrowRight, PlayCircle, RefreshCw, Menu, X } from 'lucide-react';
// // import { PaymentConfirmationModal } from './components/Payment/PaymentConfirmationModal';
// // import { PaymentCheckout } from './components/Payment/PaymentCheckout';
// // import { initiatePayment } from './lib/paymentService';
// // import { getPlanById } from './lib/planService';
// // import type { Plan } from './types/plan.types';
// // import type { RazorpayCheckoutOptions } from './types/payment.types';
// // import {FeatureGuide} from './components/Feature'
// // import {Guide} from  './components/Guide'
// // import {Banner} from './components/Banner'
// // import {Footer} from './components/Footer'
// // import  Statistics  from './components/Statistics';
// // // ═══════════════════════════════════════════════════════════════════════════
// // // ✅ GLOBAL STYLES - INTER FONT IMPORT
// // // ═══════════════════════════════════════════════════════════════════════════

// // // const GlobalStyles = () => (
// // //   <style dangerouslySetInnerHTML={{__html: `
// // //     @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
    
// // //     * {
// // //       font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
// // //     }
    
// // //     @keyframes fadeInUp {
// // //       from { 
// // //         opacity: 0; 
// // //         transform: translateY(20px); 
// // //       }
// // //       to { 
// // //         opacity: 1; 
// // //         transform: translateY(0); 
// // //       }
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
    
// // //     @keyframes slideDown {
// // //       from {
// // //         opacity: 0;
// // //         transform: translateY(-10px);
// // //       }
// // //       to {
// // //         opacity: 1;
// // //         transform: translateY(0);
// // //       }
// // //     }
    
// // //     .animate-slide-down {
// // //       animation: slideDown 0.3s ease-out forwards;
// // //     }
    
// // //     /* Smooth scroll */
// // //     html {
// // //       scroll-behavior: smooth;
// // //     }
    
// // //     /* Custom scrollbar */
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
// // const GlobalStyles = () => (
// //   <style dangerouslySetInnerHTML={{__html: `
// //     @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
    
// //     * {
// //       font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
// //     }
    
// //     /* Perfect Smooth Scrolling with Header Offset */
// //     html {
// //       scroll-behavior: smooth;
// //       scroll-padding-top: 100px; /* Prevents navbar from hiding section titles */
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
    
// //     /* Buttery Smooth Mobile Menu Slide Down */
// //     @keyframes slideDownMenu {
// //       from { opacity: 0; transform: translateY(-15px); }
// //       to { opacity: 1; transform: translateY(0); }
// //     }
// //     .animate-slide-down {
// //       animation: slideDownMenu 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
// //     }

// //     /* Custom scrollbar */
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
// // // ✅ ERROR BOUNDARY - PROFESSIONAL ERROR HANDLING
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
// // // ✅ NAVIGATION COMPONENT - EXACT DUMMY UI MATCH
// // // ═══════════════════════════════════════════════════════════════════════════

// // interface NavigationProps {
// //   onLoginClick: () => void;
// //   onDemoClick: () => void;
// // }

// // const Navigation: React.FC<NavigationProps> = ({ onLoginClick, onDemoClick }) => {
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
   

// // <nav className="max-w-[1400px] mx-auto px-4 sm:px-6 py-5 sm:py-6 lg:py-8 flex items-center justify-between relative z-40">
// //       {/* Logo */}
// //       <div className="flex items-center gap-3 cursor-pointer">
// //         <div className="relative w-6 h-6 lg:w-8 lg:h-8 flex items-center justify-center flex-shrink-0">
// //           <div className="absolute top-0 left-0 w-3.5 h-3.5 lg:w-4 lg:h-4 bg-indigo-300 rounded-[3px]"></div>
// //           <div className="absolute bottom-0 right-0 w-3.5 h-3.5 lg:w-4 lg:h-4 bg-[#0B40E8] rounded-[3px] mix-blend-multiply"></div>
// //         </div>
// //         <span className="font-bold text-[20px] sm:text-[22px] lg:text-[26px] tracking-tight text-gray-900">
// //           Tilesview360
// //         </span>
// //       </div>

// //       {/* Desktop Navigation Links */}
// //       <div className="hidden lg:flex items-center gap-10 xl:gap-14">
// //         <a href="#product" className="text-gray-900 text-[15px] lg:text-[18px] font-semibold relative after:content-[''] after:absolute after:left-0 after:-bottom-1.5 after:w-full after:h-0.5 after:bg-[#0B40E8] hover:text-gray-700 transition-colors">Product</a>
// //         <a href="#features" className="text-gray-600 text-[15px] lg:text-[18px] font-medium hover:text-gray-900 transition-colors duration-200">Features</a>
// //         <a href="#pricing" className="text-gray-600 text-[15px] lg:text-[18px] font-medium hover:text-gray-900 transition-colors duration-200">Pricing</a>
// //         <a href="#showcase" className="text-gray-600 text-[15px] lg:text-[18px] font-medium hover:text-gray-900 transition-colors duration-200">Showcase</a>
// //       </div>

// //       {/* Desktop Right Actions */}
// //       <div className="hidden lg:flex items-center gap-8 xl:gap-10">
// //         <button onClick={onLoginClick} className="text-gray-700 text-[15px] lg:text-[18px] font-bold hover:text-gray-900 transition-colors duration-200">Login</button>
// //         <button onClick={onDemoClick} className="bg-[#0B40E8] text-white text-[15px] lg:text-[18px] px-7 py-3 lg:px-9 lg:py-4 rounded-full font-semibold hover:bg-blue-700 transition-all duration-200 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40">Request Demo</button>
// //       </div>

// //       {/* Mobile Menu Button - UPGRADED FOR CLARITY */}
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
// //               {/* Mobile Links */}
// //               <div className="space-y-2">
// //                 <a href="#product" onClick={() => setMobileMenuOpen(false)} className="block text-gray-900 text-[16px] font-semibold p-3 bg-gray-50 rounded-xl hover:bg-blue-50 hover:text-[#0B40E8] transition-colors">Product</a>
// //                 <a href="#features" onClick={() => setMobileMenuOpen(false)} className="block text-gray-600 text-[16px] font-medium p-3 hover:bg-gray-50 rounded-xl transition-colors">Features</a>
// //                 <a href="#pricing" onClick={() => setMobileMenuOpen(false)} className="block text-gray-600 text-[16px] font-medium p-3 hover:bg-gray-50 rounded-xl transition-colors">Pricing</a>
// //                 <a href="#showcase" onClick={() => setMobileMenuOpen(false)} className="block text-gray-600 text-[16px] font-medium p-3 hover:bg-gray-50 rounded-xl transition-colors">Showcase</a>
// //               </div>
              
// //               {/* Mobile Actions */}
// //               <div className="pt-4 border-t border-gray-100 space-y-3">
// //                 <button
// //                   onClick={() => { setMobileMenuOpen(false); onLoginClick(); }}
// //                   className="w-full text-gray-700 text-[16px] font-bold py-3 px-6 rounded-xl border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all"
// //                 >
// //                   Login
// //                 </button>
// //                 <button
// //                   onClick={() => { setMobileMenuOpen(false); onDemoClick(); }}
// //                   className="w-full bg-[#0B40E8] text-white text-[16px] py-3 px-6 rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/30"
// //                 >
// //                   Request Demo
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
// // // ✅ HERO SECTION - EXACT DUMMY UI DESIGN
// // // ═══════════════════════════════════════════════════════════════════════════

// // interface HeroSectionProps {
// //   onDemoClick: () => void;
// // }

// // const HeroSection: React.FC<HeroSectionProps> = ({ onDemoClick }) => {
// //   return (
// //     // <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12 py-8 sm:py-12 lg:py-20 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
      
// //     //   {/* ═════════════════════════════════════════════════════════════
// //     //       LEFT COLUMN - EXACT TEXT CONTENT FROM DUMMY UI
// //     //   ═════════════════════════════════════════════════════════════ */}
// //     //   <div className="space-y-6 sm:space-y-8 order-2 lg:order-1">
        
// //     //     {/* Heading - EXACT DUMMY UI */}
// //     //     <h1 className="text-[40px] sm:text-[48px] lg:text-[56px] leading-[1.1] font-extrabold tracking-tight text-gray-900">
// //     //       See Tiles Before<br />
// //     //       <span className="text-[#0B40E8]">Customers Buy</span>
// //     //     </h1>

// //     //     {/* Description - EXACT DUMMY UI */}
// //     //     <p className="text-gray-500 text-[15px] sm:text-[16px] lg:text-[17px] leading-relaxed pr-0 lg:pr-4">
// //     //       Transform your showroom with AI-powered 3D tile visualization. Let customers preview any material in their actual living spaces with photorealistic precision.
// //     //     </p>

// //     //     {/* CTA Buttons - EXACT DUMMY UI */}
// //     //     <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
// //     //       <button 
// //     //         onClick={onDemoClick}
// //     //         className="w-full sm:w-auto bg-[#0B40E8] text-white text-[15px] px-8 py-4 rounded-full font-semibold flex items-center justify-center gap-2 hover:bg-blue-700 transition-all duration-200 shadow-xl shadow-blue-600/20 hover:shadow-2xl hover:shadow-blue-600/30 group"
// //     //       >
// //     //         Request Demo
// //     //         <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
// //     //       </button>
          
// //     //       <button 
// //     //         onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })}
// //     //         className="w-full sm:w-auto bg-white text-gray-900 text-[15px] px-8 py-4 rounded-full font-semibold flex items-center justify-center gap-3 hover:bg-gray-50 transition-all duration-200 shadow-sm border border-gray-100 hover:border-gray-200"
// //     //       >
// //     //         <PlayCircle className="w-5 h-5 text-gray-700" />
// //     //         Watch Live Preview
// //     //       </button>
// //     //     </div>
// //     //   </div>

// //     //   {/* ═════════════════════════════════════════════════════════════
// //     //       RIGHT COLUMN - VISUAL GALLERY WITH FLOATING CARDS
// //     //   ═════════════════════════════════════════════════════════════ */}
// //     //   <div className="relative w-full h-[400px] sm:h-[500px] lg:h-[650px] order-1 lg:order-2">
        
// //     //     {/* Main Background Image */}
// //     //     <div className="absolute inset-y-8 sm:inset-y-12 inset-x-4 sm:inset-x-8 lg:inset-x-12 rounded-[2rem] overflow-hidden shadow-2xl z-0">
// //     //       <img 
// //     //         src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
// //     //         alt="Modern living room interior" 
// //     //         className="w-full h-full object-cover object-center scale-105"
// //     //         loading="eager"
// //     //       />
// //     //       <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent"></div>
// //     //     </div>

// //     //     {/* Floating Card 1: Top Right (Venetian Blue) */}
// //     //     <div 
// //     //       className="absolute top-0 right-0 lg:-right-4 bg-white/70 backdrop-blur-xl p-3 pb-4 rounded-[1.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] z-20 border border-white/50 w-[180px] sm:w-[220px] animate-fade-in-up"
// //     //       style={{ animationDelay: '0ms' }}
// //     //     >
// //     //       <div className="w-full h-[140px] sm:h-[180px] rounded-2xl overflow-hidden mb-3">
// //     //         <img 
// //     //           src="https://images.unsplash.com/photo-1588863673322-2621aef42bf8?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80" 
// //     //           alt="Venetian Blue Tile" 
// //     //           className="w-full h-full object-cover"
// //     //           loading="lazy"
// //     //         />
// //     //       </div>
// //     //       <div className="px-2">
// //     //         <h3 className="font-bold text-gray-900 text-[15px] leading-tight">Venetian Blue</h3>
// //     //         <p className="text-[#0B40E8] text-xs font-semibold mt-0.5">Living Room</p>
// //     //       </div>
// //     //     </div>

// //     //     {/* Floating Card 2: Middle Center (AI Scan) */}
// //     //     <div 
// //     //       className="absolute top-[45%] left-0 lg:-left-12 -translate-y-1/2 bg-white/80 backdrop-blur-xl p-3 sm:p-4 pr-6 sm:pr-10 rounded-[1.25rem] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.15)] z-30 border border-white/60 flex items-center gap-3 sm:gap-4 animate-fade-in-up max-w-[90%] sm:max-w-none" 
// //     //       style={{ animationDelay: '150ms' }}
// //     //     >
// //     //       <div className="bg-[#0B40E8] w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-white shadow-lg shadow-blue-500/30 flex-shrink-0">
// //     //         <RefreshCw className="w-5 h-5 sm:w-6 sm:h-6 animate-spin-slow" />
// //     //       </div>
// //     //       <div className="min-w-0">
// //     //         <h3 className="font-bold text-gray-900 text-sm">AI 3D Scan Active</h3>
// //     //         <p className="text-gray-500 text-xs mt-0.5 truncate">Calibrating surface textures...</p>
// //     //       </div>
// //     //     </div>

// //     //     {/* Floating Card 3: Bottom Left (Noir Slate) */}
// //     //     <div 
// //     //       className="absolute bottom-4 left-4 lg:left-8 bg-white/90 backdrop-blur-md p-3 pb-4 rounded-[1.5rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.2)] z-20 border border-white w-[160px] sm:w-[200px] animate-fade-in-up" 
// //     //       style={{ animationDelay: '300ms' }}
// //     //     >
// //     //       <div className="w-full h-[120px] sm:h-[160px] rounded-2xl overflow-hidden mb-3 relative group">
// //     //         <img 
// //     //           src="https://images.unsplash.com/photo-1620626011761-996317b8d101?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80" 
// //     //           alt="Noir Slate Bathroom" 
// //     //           className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
// //     //           loading="lazy"
// //     //         />
// //     //         <div className="absolute inset-0 bg-black/10"></div>
// //     //       </div>
// //     //       <div className="px-2">
// //     //         <h3 className="font-bold text-gray-900 text-[15px] leading-tight">Noir Slate</h3>
// //     //         <p className="text-[#0B40E8] text-xs font-semibold mt-0.5">Master Bath</p>
// //     //       </div>
// //     //     </div>
// //     //   </div>
// //     // </main> 
// //     <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12 py-8 sm:py-12 lg:py-24 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 xl:gap-24 items-center">
      
// //       {/* ═════════════════════════════════════════════════════════════
// //           LEFT COLUMN - SCALED TEXT CONTENT
// //       ═════════════════════════════════════════════════════════════ */}
// //       <div className="space-y-6 sm:space-y-8 lg:space-y-10 order-2 lg:order-1">
        
// //         {/* Heading */}
// //         <h1 className="text-[40px] sm:text-[48px] lg:text-[64px] xl:text-[72px] leading-[1.1] font-extrabold tracking-tight text-gray-900">
// //           See Tiles Before<br />
// //           <span className="text-[#0B40E8]">Customers Buy</span>
// //         </h1>

// //         {/* Description */}
// //         <p className="text-gray-500 text-[15px] sm:text-[16px] lg:text-[20px] xl:text-[22px] leading-relaxed pr-0 lg:pr-8">
// //           Transform your showroom with AI-powered 3D tile visualization. Let customers preview any material in their actual living spaces with photorealistic precision.
// //         </p>

// //         {/* CTA Buttons */}
// //         <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 lg:gap-6">
// //           <button 
// //             onClick={onDemoClick}
// //             className="w-full sm:w-auto bg-[#0B40E8] text-white text-[15px] lg:text-[18px] px-8 py-4 lg:px-10 lg:py-5 rounded-full font-semibold flex items-center justify-center gap-2 hover:bg-blue-700 transition-all duration-200 shadow-xl shadow-blue-600/20 hover:shadow-2xl hover:shadow-blue-600/30 group"
// //           >
// //             Request Demo
// //             <ArrowRight className="w-5 h-5 lg:w-6 lg:h-6 group-hover:translate-x-1 transition-transform duration-200" />
// //           </button>
          
// //           <button 
// //             onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })}
// //             className="w-full sm:w-auto bg-white text-gray-900 text-[15px] lg:text-[18px] px-8 py-4 lg:px-10 lg:py-5 rounded-full font-semibold flex items-center justify-center gap-3 hover:bg-gray-50 transition-all duration-200 shadow-sm border border-gray-100 hover:border-gray-200"
// //           >
// //             <PlayCircle className="w-5 h-5 lg:w-6 lg:h-6 text-gray-700" />
// //             Watch Live Preview
// //           </button>
// //         </div>
// //       </div>

// //       {/* ═════════════════════════════════════════════════════════════
// //           RIGHT COLUMN - VISUAL GALLERY WITH SCALED FLOATING CARDS
// //       ═════════════════════════════════════════════════════════════ */}
// //       <div className="relative w-full h-[400px] sm:h-[500px] lg:h-[700px] xl:h-[750px] order-1 lg:order-2">
        
// //         {/* Main Background Image */}
// //         <div className="absolute inset-y-8 sm:inset-y-12 lg:inset-y-0 inset-x-4 sm:inset-x-8 lg:inset-x-12 rounded-[2rem] lg:rounded-[3rem] overflow-hidden shadow-2xl z-0">
// //           <img 
// //             src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
// //             alt="Modern living room interior" 
// //             className="w-full h-full object-cover object-center scale-105"
// //             loading="eager"
// //           />
// //           <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent"></div>
// //         </div>

// //         {/* Floating Card 1: Top Right (Venetian Blue) */}
// //         <div 
// //           className="absolute top-0 right-0 lg:-right-8 xl:-right-12 bg-white/70 backdrop-blur-xl p-3 lg:p-4 pb-4 lg:pb-5 rounded-[1.5rem] lg:rounded-[2rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] z-20 border border-white/50 w-[180px] sm:w-[220px] lg:w-[280px] xl:w-[320px] animate-fade-in-up"
// //           style={{ animationDelay: '0ms' }}
// //         >
// //           <div className="w-full h-[140px] sm:h-[180px] lg:h-[220px] xl:h-[260px] rounded-2xl lg:rounded-3xl overflow-hidden mb-3 lg:mb-4">
// //             <img 
// //               src="https://images.unsplash.com/photo-1588863673322-2621aef42bf8?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80" 
// //               alt="Venetian Blue Tile" 
// //               className="w-full h-full object-cover"
// //               loading="lazy"
// //             />
// //           </div>
// //           <div className="px-2 lg:px-3">
// //             <h3 className="font-bold text-gray-900 text-[15px] lg:text-[18px] xl:text-[20px] leading-tight">Venetian Blue</h3>
// //             <p className="text-[#0B40E8] text-xs lg:text-sm xl:text-base font-semibold mt-1">Living Room</p>
// //           </div>
// //         </div>

// //         {/* Floating Card 2: Middle Center (AI Scan) */}
// //         <div 
// //           className="absolute top-[45%] lg:top-[50%] left-0 lg:-left-16 xl:-left-20 -translate-y-1/2 bg-white/80 backdrop-blur-xl p-3 sm:p-4 lg:p-5 pr-6 sm:pr-10 lg:pr-12 rounded-[1.25rem] lg:rounded-[2rem] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.15)] z-30 border border-white/60 flex items-center gap-3 sm:gap-4 lg:gap-5 animate-fade-in-up max-w-[90%] sm:max-w-none" 
// //           style={{ animationDelay: '150ms' }}
// //         >
// //           <div className="bg-[#0B40E8] w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 xl:w-20 xl:h-20 rounded-full flex items-center justify-center text-white shadow-lg shadow-blue-500/30 flex-shrink-0">
// //             <RefreshCw className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 xl:w-10 xl:h-10 animate-spin-slow" />
// //           </div>
// //           <div className="min-w-0">
// //             <h3 className="font-bold text-gray-900 text-sm lg:text-lg xl:text-xl">AI 3D Scan Active</h3>
// //             <p className="text-gray-500 text-xs lg:text-sm xl:text-base mt-1 truncate">Calibrating surface textures...</p>
// //           </div>
// //         </div>

// //         {/* Floating Card 3: Bottom Left (Noir Slate) */}
// //         <div 
// //           className="absolute bottom-4 lg:bottom-12 left-4 lg:left-0 xl:-left-8 bg-white/90 backdrop-blur-md p-3 lg:p-4 pb-4 lg:pb-5 rounded-[1.5rem] lg:rounded-[2rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.2)] z-20 border border-white w-[160px] sm:w-[200px] lg:w-[260px] xl:w-[300px] animate-fade-in-up" 
// //           style={{ animationDelay: '300ms' }}
// //         >
// //           <div className="w-full h-[120px] sm:h-[160px] lg:h-[200px] xl:h-[240px] rounded-2xl lg:rounded-3xl overflow-hidden mb-3 lg:mb-4 relative group">
// //             <img 
// //               src="https://images.unsplash.com/photo-1620626011761-996317b8d101?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80" 
// //               alt="Noir Slate Bathroom" 
// //               className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
// //               loading="lazy"
// //             />
// //             <div className="absolute inset-0 bg-black/10"></div>
// //           </div>
// //           <div className="px-2 lg:px-3">
// //             <h3 className="font-bold text-gray-900 text-[15px] lg:text-[18px] xl:text-[20px] leading-tight">Noir Slate</h3>
// //             <p className="text-[#0B40E8] text-xs lg:text-sm xl:text-base font-semibold mt-1">Master Bath</p>
// //           </div>
// //         </div>
// //       </div>
// //     </main>
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
// //   const [domainConfig, setDomainConfig] = useState(getCurrentDomainConfig());
// //   const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
// //   const [showPaymentConfirmation, setShowPaymentConfirmation] = useState(false);
// //   const [checkoutOptions, setCheckoutOptions] = useState<RazorpayCheckoutOptions | null>(null);
// //   const [paymentId, setPaymentId] = useState<string | null>(null);
// //   const [processingPayment, setProcessingPayment] = useState(false);

// //   // ═══════════════════════════════════════════════════════════════════════════
// //   // ✅ APP INITIALIZATION
// //   // ═══════════════════════════════════════════════════════════════════════════

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

// //   // ═══════════════════════════════════════════════════════════════════════════
// //   // ✅ WORKER ROUTE PROTECTION
// //   // ═══════════════════════════════════════════════════════════════════════════

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

// //   // ═══════════════════════════════════════════════════════════════════════════
// //   // ✅ PAYMENT HANDLERS
// //   // ═══════════════════════════════════════════════════════════════════════════

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

// //   // ═══════════════════════════════════════════════════════════════════════════
// //   // ✅ ERROR DISPLAY
// //   // ═══════════════════════════════════════════════════════════════════════════

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

// //   // ═══════════════════════════════════════════════════════════════════════════
// //   // ✅ LOADING STATE
// //   // ═══════════════════════════════════════════════════════════════════════════

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

// //   // ═══════════════════════════════════════════════════════════════════════════
// //   // ✅ SHOW LOADING IF AUTH IS LOADING
// //   // ═══════════════════════════════════════════════════════════════════════════

// //   if (isLoading) {
// //     return renderLoading();
// //   }

// //   // ═══════════════════════════════════════════════════════════════════════════
// //   // ✅ MAIN RENDER
// //   // ═══════════════════════════════════════════════════════════════════════════

// //   return (
// //     <div className="flex flex-col min-h-screen bg-white from-blue-50 via-indigo-50 to-purple-50">
// //       {/* Global Styles */}
// //       <GlobalStyles />
      
// //       {/* Toast Notifications */}
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

// //       {/* Main Content */}
// //       <div className="flex-1">
// //         <Routes>
// //           {/* QR SCAN ROUTES - PUBLIC ACCESS */}
// //           <Route path="/tile/:tileId" element={<TileDetailsPage />} />
// //           <Route path="/room-select/:tileId" element={<RoomSelectorPage />} />
// //           <Route path="/3d-view/:tileId/:roomType" element={<Room3DViewPage />} />
// //           <Route path="/tile/search" element={<TileSearchPage />} />

// //           {/* WORKER SCAN PAGE */}
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

// //           {/* SELLER AUTO-LOGIN */}
// //           <Route path="/seller-auto-login" element={<SellerAutoLogin />} />

// //           {/* PAYMENT ROUTES */}
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

// //           {/* ADMIN DASHBOARD */}
// //           <Route
// //             path="/admin/*"
// //             element={
// //               <AdminProtectedRoute>
// //                 <DomainHeader />
// //                 <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
// //                   {renderError()}
// //                   <AdminDashboard />
// //                 </main>
// //               </AdminProtectedRoute>
// //             }
// //           />

// //           {/* SELLER DASHBOARD */}
// //           <Route
// //             path="/seller/*"
// //             element={
// //               <SellerProtectedRoute>
// //                 <DomainHeader />
// //                 <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
// //                   {renderError()}
// //                   <SellerDashboard />
// //                 </main>
// //               </SellerProtectedRoute>
// //             }
// //           />

// //           {/* PUBLIC/CUSTOMER ROUTES */}
// //           <Route
// //             path="/*"
// //             element={
// //               <ProtectedRoute allowUnauthenticated={true}>
// //                 {/* Hero Section with Navigation */}
// //                 <div className="relative w-full bg-gradient-to-br from-white via-blue-50/30 to-purple-50/20 overflow-hidden">
// //                   <Navigation 
// //                     onLoginClick={() => setShowAuthModal(true)}
// //                     onDemoClick={() => setShowAuthModal(true)}
// //                   />
// //                   <HeroSection 
// //                     onDemoClick={() => setShowAuthModal(true)}
// //                   />
// //                 </div>

// //                 {/* Main Content */}
// //                 <main className="w-full">
// //                   {renderError()}
                  
// //                   <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-16">
// //                     <div className="space-y-8">
// //                       {/* Public Showroom */}
// //                       <PublicShowroom />
                      
// //                       {/* Partner Section */}
// //                       <section className="py-12 lg:py-16 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg">
// //                         <div className="max-w-4xl mx-auto px-6">
// //                           <div className="text-center mb-12">
// //                             <div className="text-5xl mb-4">🤝</div>
// //                             <h2 className="text-3xl font-bold text-gray-800 mb-4">
// //                               Partner With Us
// //                             </h2>
// //                             <p className="text-lg text-gray-600 mb-6">
// //                               Expand your tile business with our cutting-edge 3D visualization platform
// //                             </p>
// //                             <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500">
// //                               <span className="flex items-center">
// //                                 <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
// //                                 3D Showroom
// //                               </span>
// //                               <span className="flex items-center">
// //                                 <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
// //                                 QR Code System
// //                               </span>
// //                               <span className="flex items-center">
// //                                 <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
// //                                 Analytics Dashboard
// //                               </span>
// //                             </div>
// //                           </div>
// //                           <SellerRequestForm />
               
// //                         </div>
// //                       </section>
// //                     </div>
// //                   </div>
// //                 </main>
// //                          <FeatureGuide/>
// //                          <Guide/>
// //                          <Statistics/>
// //                          <Banner/>
// //                          <Footer/>

// //                 {/* Floating QR Button */}
// //                 <FloatingQRButton />
// //               </ProtectedRoute>
// //             }
// //           />

// //           {/* CATCH-ALL REDIRECT */}
// //           <Route path="*" element={<Navigate to="/" replace />} />
// //         </Routes>
// //       </div>


// //       {/* Modals */}
// //       <AuthModal 
// //         isOpen={showAuthModal} 
// //         onClose={() => setShowAuthModal(false)} 
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

// // console.log('✅ App.tsx - PRODUCTION v14.0 FINAL - EXACT DUMMY UI - 30 YEAR EXPERIENCE LEVEL - ALL DEVICES RESPONSIVE'); 
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
// import { ArrowRight, PlayCircle, RefreshCw, Menu, X } from 'lucide-react';
// import { PaymentConfirmationModal } from './components/Payment/PaymentConfirmationModal';
// import { PaymentCheckout } from './components/Payment/PaymentCheckout';
// import { initiatePayment } from './lib/paymentService';
// import { getPlanById } from './lib/planService';
// import type { Plan } from './types/plan.types';
// import type { RazorpayCheckoutOptions } from './types/payment.types';
// import { FeatureGuide } from './components/Feature';
// import { Guide } from './components/Guide';
// import { Banner } from './components/Banner';
// import { Footer } from './components/Footer';
// import Statistics from './components/Statistics';

// // ═══════════════════════════════════════════════════════════════════════════
// // ✅ GLOBAL STYLES - INTER FONT + SMOOTH ANIMATIONS
// // ═══════════════════════════════════════════════════════════════════════════

// const GlobalStyles = () => (
//   <style dangerouslySetInnerHTML={{__html: `
//     @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
    
//     * {
//       font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
//     }
    
//     html {
//       scroll-behavior: smooth;
//       scroll-padding-top: 100px;
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
// // ✅ ERROR BOUNDARY - PROFESSIONAL ERROR HANDLING
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
// // ✅ NAVIGATION COMPONENT - UPDATED WITH BECOME A SELLER
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
//     <nav className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6 lg:py-8 flex items-center justify-between relative z-40">
//       {/* Logo */}
//       <div className="flex items-center gap-3 cursor-pointer">
//         <div className="relative w-6 h-6 lg:w-8 lg:h-8 flex items-center justify-center flex-shrink-0">
//           <div className="absolute top-0 left-0 w-3.5 h-3.5 lg:w-4 lg:h-4 bg-indigo-300 rounded-[3px]"></div>
//           <div className="absolute bottom-0 right-0 w-3.5 h-3.5 lg:w-4 lg:h-4 bg-[#0B40E8] rounded-[3px] mix-blend-multiply"></div>
//         </div>
//         <span className="font-bold text-[20px] sm:text-[22px] lg:text-[26px] tracking-tight text-gray-900">
//           Tilesview360
//         </span>
//       </div>

//       {/* Desktop Navigation Links */}
//       <div className="hidden lg:flex items-center gap-10 xl:gap-14">
//         <a href="#product" className="text-gray-900 text-[15px] lg:text-[18px] font-semibold relative after:content-[''] after:absolute after:left-0 after:-bottom-1.5 after:w-full after:h-0.5 after:bg-[#0B40E8] hover:text-gray-700 transition-colors">Product</a>
//         <a href="#features" className="text-gray-600 text-[15px] lg:text-[18px] font-medium hover:text-gray-900 transition-colors duration-200">Features</a>
//         <a href="#pricing" className="text-gray-600 text-[15px] lg:text-[18px] font-medium hover:text-gray-900 transition-colors duration-200">Pricing</a>
//         <a href="#showcase" className="text-gray-600 text-[15px] lg:text-[18px] font-medium hover:text-gray-900 transition-colors duration-200">Showcase</a>
//       </div>

//       {/* Desktop Right Actions */}
//       <div className="hidden lg:flex items-center gap-8 xl:gap-10">
//         <button 
//           onClick={onLoginClick} 
//           className="text-gray-700 text-[15px] lg:text-[18px] font-bold hover:text-gray-900 transition-colors duration-200"
//         >
//           Login
//         </button>
//         <button 
//           onClick={onBecomeSellerClick} 
//           className="bg-[#0B40E8] text-white text-[15px] lg:text-[18px] px-7 py-3 lg:px-9 lg:py-4 rounded-full font-semibold hover:bg-blue-700 transition-all duration-200 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40"
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
//               {/* Mobile Links */}
//               <div className="space-y-2">
//                 <a href="#product" onClick={() => setMobileMenuOpen(false)} className="block text-gray-900 text-[16px] font-semibold p-3 bg-gray-50 rounded-xl hover:bg-blue-50 hover:text-[#0B40E8] transition-colors">Product</a>
//                 <a href="#features" onClick={() => setMobileMenuOpen(false)} className="block text-gray-600 text-[16px] font-medium p-3 hover:bg-gray-50 rounded-xl transition-colors">Features</a>
//                 <a href="#pricing" onClick={() => setMobileMenuOpen(false)} className="block text-gray-600 text-[16px] font-medium p-3 hover:bg-gray-50 rounded-xl transition-colors">Pricing</a>
//                 <a href="#showcase" onClick={() => setMobileMenuOpen(false)} className="block text-gray-600 text-[16px] font-medium p-3 hover:bg-gray-50 rounded-xl transition-colors">Showcase</a>
//               </div>
              
//               {/* Mobile Actions */}
//               <div className="pt-4 border-t border-gray-100 space-y-3">
//                 <button
//                   onClick={() => { setMobileMenuOpen(false); onLoginClick(); }}
//                   className="w-full text-gray-700 text-[16px] font-bold py-3 px-6 rounded-xl border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all"
//                 >
//                   Login
//                 </button>
//                 <button
//                   onClick={() => { setMobileMenuOpen(false); onBecomeSellerClick(); }}
//                   className="w-full bg-[#0B40E8] text-white text-[16px] py-3 px-6 rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/30"
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
// // ✅ HERO SECTION - REQUEST DEMO BUTTON DECORATIVE ONLY
// // ═══════════════════════════════════════════════════════════════════════════

// const HeroSection: React.FC = () => {
//   return (
//     <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-24 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 xl:gap-24 items-center">
      
//       {/* LEFT COLUMN */}
//       <div className="space-y-6 sm:space-y-8 lg:space-y-10 order-2 lg:order-1">
        
//         {/* Heading */}
//         <h1 className="text-[40px] sm:text-[48px] lg:text-[64px] xl:text-[72px] leading-[1.1] font-extrabold tracking-tight text-gray-900">
//           See Tiles Before<br />
//           <span className="text-[#0B40E8]">Customers Buy</span>
//         </h1>

//         {/* Description */}
//         <p className="text-gray-500 text-[15px] sm:text-[16px] lg:text-[20px] xl:text-[22px] leading-relaxed pr-0 lg:pr-8">
//           Transform your showroom with AI-powered 3D tile visualization. Let customers preview any material in their actual living spaces with photorealistic precision.
//         </p>

//         {/* CTA Buttons - Request Demo is DECORATIVE ONLY */}
//         <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 lg:gap-6">
//           <button 
//             className="w-full sm:w-auto bg-[#0B40E8] text-white text-[15px] lg:text-[18px] px-8 py-4 lg:px-10 lg:py-5 rounded-full font-semibold flex items-center justify-center gap-2 shadow-xl shadow-blue-600/20 cursor-default opacity-90"
//             disabled
//           >
//             Request Demo
//             <ArrowRight className="w-5 h-5 lg:w-6 lg:h-6" />
//           </button>
          
//           <button 
//             onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })}
//             className="w-full sm:w-auto bg-white text-gray-900 text-[15px] lg:text-[18px] px-8 py-4 lg:px-10 lg:py-5 rounded-full font-semibold flex items-center justify-center gap-3 hover:bg-gray-50 transition-all duration-200 shadow-sm border border-gray-100 hover:border-gray-200"
//           >
//             <PlayCircle className="w-5 h-5 lg:w-6 lg:h-6 text-gray-700" />
//             Watch Live Preview
//           </button>
//         </div>
//       </div>

//       {/* RIGHT COLUMN - VISUAL GALLERY */}
//       <div className="relative w-full h-[400px] sm:h-[500px] lg:h-[700px] xl:h-[750px] order-1 lg:order-2">
        
//         {/* Main Background Image */}
//         <div className="absolute inset-y-8 sm:inset-y-12 lg:inset-y-0 inset-x-4 sm:inset-x-8 lg:inset-x-12 rounded-[2rem] lg:rounded-[3rem] overflow-hidden shadow-2xl z-0">
//           <img 
//             src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
//             alt="Modern living room interior" 
//             className="w-full h-full object-cover object-center scale-105"
//             loading="eager"
//           />
//           <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent"></div>
//         </div>

//         {/* Floating Card 1: Top Right */}
//         <div 
//           className="absolute top-0 right-0 lg:-right-8 xl:-right-12 bg-white/70 backdrop-blur-xl p-3 lg:p-4 pb-4 lg:pb-5 rounded-[1.5rem] lg:rounded-[2rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] z-20 border border-white/50 w-[180px] sm:w-[220px] lg:w-[280px] xl:w-[320px] animate-fade-in-up"
//           style={{ animationDelay: '0ms' }}
//         >
//           <div className="w-full h-[140px] sm:h-[180px] lg:h-[220px] xl:h-[260px] rounded-2xl lg:rounded-3xl overflow-hidden mb-3 lg:mb-4">
//             <img 
//               src="https://images.unsplash.com/photo-1588863673322-2621aef42bf8?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80" 
//               alt="Venetian Blue Tile" 
//               className="w-full h-full object-cover"
//               loading="lazy"
//             />
//           </div>
//           <div className="px-2 lg:px-3">
//             <h3 className="font-bold text-gray-900 text-[15px] lg:text-[18px] xl:text-[20px] leading-tight">Venetian Blue</h3>
//             <p className="text-[#0B40E8] text-xs lg:text-sm xl:text-base font-semibold mt-1">Living Room</p>
//           </div>
//         </div>

//         {/* Floating Card 2: AI Scan */}
//         <div 
//           className="absolute top-[45%] lg:top-[50%] left-0 lg:-left-16 xl:-left-20 -translate-y-1/2 bg-white/80 backdrop-blur-xl p-3 sm:p-4 lg:p-5 pr-6 sm:pr-10 lg:pr-12 rounded-[1.25rem] lg:rounded-[2rem] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.15)] z-30 border border-white/60 flex items-center gap-3 sm:gap-4 lg:gap-5 animate-fade-in-up max-w-[90%] sm:max-w-none" 
//           style={{ animationDelay: '150ms' }}
//         >
//           <div className="bg-[#0B40E8] w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 xl:w-20 xl:h-20 rounded-full flex items-center justify-center text-white shadow-lg shadow-blue-500/30 flex-shrink-0">
//             <RefreshCw className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 xl:w-10 xl:h-10 animate-spin-slow" />
//           </div>
//           <div className="min-w-0">
//             <h3 className="font-bold text-gray-900 text-sm lg:text-lg xl:text-xl">AI 3D Scan Active</h3>
//             <p className="text-gray-500 text-xs lg:text-sm xl:text-base mt-1 truncate">Calibrating surface textures...</p>
//           </div>
//         </div>

//         {/* Floating Card 3: Bottom Left */}
//         <div 
//           className="absolute bottom-4 lg:bottom-12 left-4 lg:left-0 xl:-left-8 bg-white/90 backdrop-blur-md p-3 lg:p-4 pb-4 lg:pb-5 rounded-[1.5rem] lg:rounded-[2rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.2)] z-20 border border-white w-[160px] sm:w-[200px] lg:w-[260px] xl:w-[300px] animate-fade-in-up" 
//           style={{ animationDelay: '300ms' }}
//         >
//           <div className="w-full h-[120px] sm:h-[160px] lg:h-[200px] xl:h-[240px] rounded-2xl lg:rounded-3xl overflow-hidden mb-3 lg:mb-4 relative group">
//             <img 
//               src="https://images.unsplash.com/photo-1620626011761-996317b8d101?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80" 
//               alt="Noir Slate Bathroom" 
//               className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
//               loading="lazy"
//             />
//             <div className="absolute inset-0 bg-black/10"></div>
//           </div>
//           <div className="px-2 lg:px-3">
//             <h3 className="font-bold text-gray-900 text-[15px] lg:text-[18px] xl:text-[20px] leading-tight">Noir Slate</h3>
//             <p className="text-[#0B40E8] text-xs lg:text-sm xl:text-base font-semibold mt-1">Master Bath</p>
//           </div>
//         </div>
//       </div>
//     </main>
//   );
// };

// // ═══════════════════════════════════════════════════════════════════════════
// // ✅ SELLER REQUEST FORM MODAL - NEW COMPONENT
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
//         {/* Header */}
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

//         {/* Form Content */}
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

//   // ═══════════════════════════════════════════════════════════════════════════
//   // ✅ APP INITIALIZATION
//   // ═══════════════════════════════════════════════════════════════════════════

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

//   // ═══════════════════════════════════════════════════════════════════════════
//   // ✅ WORKER ROUTE PROTECTION
//   // ═══════════════════════════════════════════════════════════════════════════

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

//   // ═══════════════════════════════════════════════════════════════════════════
//   // ✅ PAYMENT HANDLERS
//   // ═══════════════════════════════════════════════════════════════════════════

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

//   // ═══════════════════════════════════════════════════════════════════════════
//   // ✅ ERROR DISPLAY
//   // ═══════════════════════════════════════════════════════════════════════════

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

//   // ═══════════════════════════════════════════════════════════════════════════
//   // ✅ LOADING STATE
//   // ═══════════════════════════════════════════════════════════════════════════

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

//   // ═══════════════════════════════════════════════════════════════════════════
//   // ✅ SHOW LOADING IF AUTH IS LOADING
//   // ═══════════════════════════════════════════════════════════════════════════

//   if (isLoading) {
//     return renderLoading();
//   }

//   // ═══════════════════════════════════════════════════════════════════════════
//   // ✅ MAIN RENDER
//   // ═══════════════════════════════════════════════════════════════════════════

//   return (
//     <div className="flex flex-col min-h-screen bg-white">
//       {/* Global Styles */}
//       <GlobalStyles />
      
//       {/* Toast Notifications */}
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

//       {/* Main Content */}
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
//                 <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
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
//                 <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
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
//                 {/* Hero Section with Navigation */}
//                 <div className="relative w-full bg-gradient-to-br from-white via-blue-50/30 to-purple-50/20 overflow-hidden">
//                   <Navigation 
//                     onLoginClick={() => setShowAuthModal(true)}
//                     onBecomeSellerClick={() => setShowSellerRequestModal(true)}
//                   />
//                   <HeroSection />
//                 </div>

//                 {/* Main Content */}
//                 <main className="w-full">
//                   {renderError()}
                  
//                   <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-16">
//                     <div className="space-y-8">
//                       {/* Public Showroom */}
//                       <PublicShowroom />
//                     </div>
//                   </div>
//                 </main>

//                 {/* Additional Sections - ALL WITH MATCHING WIDTH */}
//                 <FeatureGuide />
//                 <Guide />
//                 <Statistics />
//                 <Banner />
//                 <Footer />

//                 {/* Floating QR Button */}
//                 <FloatingQRButton />
//               </ProtectedRoute>
//             }
//           />

//           {/* CATCH-ALL REDIRECT */}
//           <Route path="*" element={<Navigate to="/" replace />} />
//         </Routes>
//       </div>

//       {/* Modals */}
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
// console.log('✅ App.tsx - PRODUCTION v15.0 COMPLETE - EXACT ALIGNMENT (1920px Grid) - ALL DEVICES RESPONSIVE'); 
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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
import { ArrowRight, PlayCircle, RefreshCw, Menu, X } from 'lucide-react';
import { PaymentConfirmationModal } from './components/Payment/PaymentConfirmationModal';
import { PaymentCheckout } from './components/Payment/PaymentCheckout';
import { initiatePayment } from './lib/paymentService';
import { getPlanById } from './lib/planService';
import type { Plan } from './types/plan.types';
import type { RazorpayCheckoutOptions } from './types/payment.types';
import { FeatureGuide } from './components/Feature';
import { Guide } from './components/Guide';
import { Banner } from './components/Banner';
import { Footer } from './components/Footer';
import Statistics from './components/Statistics';

// ═══════════════════════════════════════════════════════════════════════════
// ✅ GLOBAL STYLES - INTER FONT + SMOOTH ANIMATIONS
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
// ✅ ERROR BOUNDARY - PROFESSIONAL ERROR HANDLING
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
// ✅ NAVIGATION COMPONENT - 1920px ALIGNED
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
    // ✅ FIXED: Using w-full max-w-[1920px] and px-3 md:px-5 
    <nav className="w-full max-w-[1920px] mx-auto px-3 md:px-5 py-5 sm:py-6 lg:py-8 flex items-center justify-between relative z-40">
      {/* Logo */}
      <div className="flex items-center gap-3 cursor-pointer">
        <div className="relative w-6 h-6 lg:w-8 lg:h-8 flex items-center justify-center flex-shrink-0">
          <div className="absolute top-0 left-0 w-3.5 h-3.5 lg:w-4 lg:h-4 bg-indigo-300 rounded-[3px]"></div>
          <div className="absolute bottom-0 right-0 w-3.5 h-3.5 lg:w-4 lg:h-4 bg-[#0B40E8] rounded-[3px] mix-blend-multiply"></div>
        </div>
        <span className="font-bold text-[20px] sm:text-[22px] lg:text-[26px] tracking-tight text-gray-900">
          Tilesview360
        </span>
      </div>

      {/* Desktop Navigation Links */}
      <div className="hidden lg:flex items-center gap-10 xl:gap-14">
        <a href="#product" className="text-gray-900 text-[15px] lg:text-[18px] font-semibold relative after:content-[''] after:absolute after:left-0 after:-bottom-1.5 after:w-full after:h-0.5 after:bg-[#0B40E8] hover:text-gray-700 transition-colors">Product</a>
        <a href="#features" className="text-gray-600 text-[15px] lg:text-[18px] font-medium hover:text-gray-900 transition-colors duration-200">Features</a>
        <a href="#pricing" className="text-gray-600 text-[15px] lg:text-[18px] font-medium hover:text-gray-900 transition-colors duration-200">Pricing</a>
        <a href="#showcase" className="text-gray-600 text-[15px] lg:text-[18px] font-medium hover:text-gray-900 transition-colors duration-200">Showcase</a>
      </div>

      {/* Desktop Right Actions */}
      <div className="hidden lg:flex items-center gap-8 xl:gap-10">
        <button 
          onClick={onLoginClick} 
          className="text-gray-700 text-[15px] lg:text-[18px] font-bold hover:text-gray-900 transition-colors duration-200"
        >
          Login
        </button>
        <button 
          onClick={onBecomeSellerClick} 
          className="bg-[#0B40E8] text-white text-[15px] lg:text-[18px] px-7 py-3 lg:px-9 lg:py-4 rounded-full font-semibold hover:bg-blue-700 transition-all duration-200 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40"
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
              {/* Mobile Links */}
              <div className="space-y-2">
                <a href="#product" onClick={() => setMobileMenuOpen(false)} className="block text-gray-900 text-[16px] font-semibold p-3 bg-gray-50 rounded-xl hover:bg-blue-50 hover:text-[#0B40E8] transition-colors">Product</a>
                <a href="#features" onClick={() => setMobileMenuOpen(false)} className="block text-gray-600 text-[16px] font-medium p-3 hover:bg-gray-50 rounded-xl transition-colors">Features</a>
                <a href="#pricing" onClick={() => setMobileMenuOpen(false)} className="block text-gray-600 text-[16px] font-medium p-3 hover:bg-gray-50 rounded-xl transition-colors">Pricing</a>
                <a href="#showcase" onClick={() => setMobileMenuOpen(false)} className="block text-gray-600 text-[16px] font-medium p-3 hover:bg-gray-50 rounded-xl transition-colors">Showcase</a>
              </div>
              
              {/* Mobile Actions */}
              <div className="pt-4 border-t border-gray-100 space-y-3">
                <button
                  onClick={() => { setMobileMenuOpen(false); onLoginClick(); }}
                  className="w-full text-gray-700 text-[16px] font-bold py-3 px-6 rounded-xl border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all"
                >
                  Login
                </button>
                <button
                  onClick={() => { setMobileMenuOpen(false); onBecomeSellerClick(); }}
                  className="w-full bg-[#0B40E8] text-white text-[16px] py-3 px-6 rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/30"
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
// ✅ HERO SECTION - 1920px ALIGNED
// ═══════════════════════════════════════════════════════════════════════════

const HeroSection: React.FC = () => {
  return (
    // ✅ FIXED: Using w-full max-w-[1920px] and px-3 md:px-5 
    <main className="w-full max-w-[1920px] mx-auto px-3 md:px-5 py-8 sm:py-12 lg:py-24 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 xl:gap-24 items-center">
      
      {/* LEFT COLUMN */}
      <div className="space-y-6 sm:space-y-8 lg:space-y-10 order-2 lg:order-1">
        
        {/* Heading */}
        <h1 className="text-[40px] sm:text-[48px] lg:text-[64px] xl:text-[72px] leading-[1.1] font-extrabold tracking-tight text-gray-900">
          See Tiles Before<br />
          <span className="text-[#0B40E8]">Customers Buy</span>
        </h1>

        {/* Description */}
        <p className="text-gray-500 text-[15px] sm:text-[16px] lg:text-[20px] xl:text-[22px] leading-relaxed pr-0 lg:pr-8">
          Transform your showroom with AI-powered 3D tile visualization. Let customers preview any material in their actual living spaces with photorealistic precision.
        </p>

        {/* CTA Buttons - Request Demo is DECORATIVE ONLY */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 lg:gap-6">
          <button 
            className="w-full sm:w-auto bg-[#0B40E8] text-white text-[15px] lg:text-[18px] px-8 py-4 lg:px-10 lg:py-5 rounded-full font-semibold flex items-center justify-center gap-2 shadow-xl shadow-blue-600/20 cursor-default opacity-90"
            disabled
          >
            Request Demo
            <ArrowRight className="w-5 h-5 lg:w-6 lg:h-6" />
          </button>
          
          <button 
            onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })}
            className="w-full sm:w-auto bg-white text-gray-900 text-[15px] lg:text-[18px] px-8 py-4 lg:px-10 lg:py-5 rounded-full font-semibold flex items-center justify-center gap-3 hover:bg-gray-50 transition-all duration-200 shadow-sm border border-gray-100 hover:border-gray-200"
          >
            <PlayCircle className="w-5 h-5 lg:w-6 lg:h-6 text-gray-700" />
            Watch Live Preview
          </button>
        </div>
      </div>

      {/* RIGHT COLUMN - VISUAL GALLERY */}
      <div className="relative w-full h-[400px] sm:h-[500px] lg:h-[700px] xl:h-[750px] order-1 lg:order-2">
        
        {/* Main Background Image */}
        <div className="absolute inset-y-8 sm:inset-y-12 lg:inset-y-0 inset-x-4 sm:inset-x-8 lg:inset-x-12 rounded-[2rem] lg:rounded-[3rem] overflow-hidden shadow-2xl z-0">
          <img 
            src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
            alt="Modern living room interior" 
            className="w-full h-full object-cover object-center scale-105"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent"></div>
        </div>

        {/* Floating Card 1: Top Right */}
        <div 
          className="absolute top-0 right-0 lg:-right-8 xl:-right-12 bg-white/70 backdrop-blur-xl p-3 lg:p-4 pb-4 lg:pb-5 rounded-[1.5rem] lg:rounded-[2rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] z-20 border border-white/50 w-[180px] sm:w-[220px] lg:w-[280px] xl:w-[320px] animate-fade-in-up"
          style={{ animationDelay: '0ms' }}
        >
          <div className="w-full h-[140px] sm:h-[180px] lg:h-[220px] xl:h-[260px] rounded-2xl lg:rounded-3xl overflow-hidden mb-3 lg:mb-4">
            <img 
              src="https://images.unsplash.com/photo-1588863673322-2621aef42bf8?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80" 
              alt="Venetian Blue Tile" 
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
          <div className="px-2 lg:px-3">
            <h3 className="font-bold text-gray-900 text-[15px] lg:text-[18px] xl:text-[20px] leading-tight">Venetian Blue</h3>
            <p className="text-[#0B40E8] text-xs lg:text-sm xl:text-base font-semibold mt-1">Living Room</p>
          </div>
        </div>

        {/* Floating Card 2: AI Scan */}
        <div 
          className="absolute top-[45%] lg:top-[50%] left-0 lg:-left-16 xl:-left-20 -translate-y-1/2 bg-white/80 backdrop-blur-xl p-3 sm:p-4 lg:p-5 pr-6 sm:pr-10 lg:pr-12 rounded-[1.25rem] lg:rounded-[2rem] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.15)] z-30 border border-white/60 flex items-center gap-3 sm:gap-4 lg:gap-5 animate-fade-in-up max-w-[90%] sm:max-w-none" 
          style={{ animationDelay: '150ms' }}
        >
          <div className="bg-[#0B40E8] w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 xl:w-20 xl:h-20 rounded-full flex items-center justify-center text-white shadow-lg shadow-blue-500/30 flex-shrink-0">
            <RefreshCw className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 xl:w-10 xl:h-10 animate-spin-slow" />
          </div>
          <div className="min-w-0">
            <h3 className="font-bold text-gray-900 text-sm lg:text-lg xl:text-xl">AI 3D Scan Active</h3>
            <p className="text-gray-500 text-xs lg:text-sm xl:text-base mt-1 truncate">Calibrating surface textures...</p>
          </div>
        </div>

        {/* Floating Card 3: Bottom Left */}
        <div 
          className="absolute bottom-4 lg:bottom-12 left-4 lg:left-0 xl:-left-8 bg-white/90 backdrop-blur-md p-3 lg:p-4 pb-4 lg:pb-5 rounded-[1.5rem] lg:rounded-[2rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.2)] z-20 border border-white w-[160px] sm:w-[200px] lg:w-[260px] xl:w-[300px] animate-fade-in-up" 
          style={{ animationDelay: '300ms' }}
        >
          <div className="w-full h-[120px] sm:h-[160px] lg:h-[200px] xl:h-[240px] rounded-2xl lg:rounded-3xl overflow-hidden mb-3 lg:mb-4 relative group">
            <img 
              src="https://images.unsplash.com/photo-1620626011761-996317b8d101?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80" 
              alt="Noir Slate Bathroom" 
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black/10"></div>
          </div>
          <div className="px-2 lg:px-3">
            <h3 className="font-bold text-gray-900 text-[15px] lg:text-[18px] xl:text-[20px] leading-tight">Noir Slate</h3>
            <p className="text-[#0B40E8] text-xs lg:text-sm xl:text-base font-semibold mt-1">Master Bath</p>
          </div>
        </div>
      </div>
    </main>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// ✅ SELLER REQUEST FORM MODAL
// ═══════════════════════════════════════════════════════════════════════════

interface SellerRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SellerRequestModal: React.FC<SellerRequestModalProps> = ({ isOpen, onClose }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in-up">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-modal-in">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Become A Seller</h2>
            <p className="text-sm text-gray-600 mt-1">Join our platform and grow your tile business</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Close"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Form Content */}
        <div className="p-6">
          <SellerRequestForm onSuccess={onClose} />
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// ✅ MAIN APP CONTENT COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

function AppContent() {
  const { isAuthenticated, isLoading, user, error } = useAuth({
    enableActivityTracking: false,
    enableSessionWarnings: false,
    autoLogoutDelay: 0
  });
  
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showPlansModal, setShowPlansModal] = useState(false);
  const [showSellerRequestModal, setShowSellerRequestModal] = useState(false);
  const [domainConfig, setDomainConfig] = useState(getCurrentDomainConfig());
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [showPaymentConfirmation, setShowPaymentConfirmation] = useState(false);
  const [checkoutOptions, setCheckoutOptions] = useState<RazorpayCheckoutOptions | null>(null);
  const [paymentId, setPaymentId] = useState<string | null>(null);
  const [processingPayment, setProcessingPayment] = useState(false);

  // ═══════════════════════════════════════════════════════════════════════════
  // ✅ APP INITIALIZATION
  // ═══════════════════════════════════════════════════════════════════════════

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

  // ═══════════════════════════════════════════════════════════════════════════
  // ✅ WORKER ROUTE PROTECTION
  // ═══════════════════════════════════════════════════════════════════════════

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

  // ═══════════════════════════════════════════════════════════════════════════
  // ✅ PAYMENT HANDLERS
  // ═══════════════════════════════════════════════════════════════════════════

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

  // ═══════════════════════════════════════════════════════════════════════════
  // ✅ ERROR DISPLAY
  // ═══════════════════════════════════════════════════════════════════════════

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

  // ═══════════════════════════════════════════════════════════════════════════
  // ✅ LOADING STATE
  // ═══════════════════════════════════════════════════════════════════════════

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

  // ═══════════════════════════════════════════════════════════════════════════
  // ✅ SHOW LOADING IF AUTH IS LOADING
  // ═══════════════════════════════════════════════════════════════════════════

  if (isLoading) {
    return renderLoading();
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // ✅ MAIN RENDER
  // ═══════════════════════════════════════════════════════════════════════════

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Global Styles */}
      <GlobalStyles />
      
      {/* Toast Notifications */}
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

      {/* Main Content */}
      <div className="flex-1">
        <Routes>
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
                {/* ✅ FIXED: Dashboard wrapper using 1920px logic */}
                <main className="w-full max-w-[1920px] mx-auto px-3 md:px-5 py-6 lg:py-8">
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
                {/* ✅ FIXED: Dashboard wrapper using 1920px logic */}
                <main className="w-full max-w-[1920px] mx-auto px-3 md:px-5 py-6 lg:py-8">
                  {renderError()}
                  <SellerDashboard />
                </main>
              </SellerProtectedRoute>
            }
          />

          {/* PUBLIC/CUSTOMER ROUTES */}
          <Route
            path="/*"
            element={
              <ProtectedRoute allowUnauthenticated={true}>
                
                {/* Hero Section with Navigation */}
                <div className="relative w-full bg-gradient-to-br from-white via-blue-50/30 to-purple-50/20 overflow-hidden">
                  <Navigation 
                    onLoginClick={() => setShowAuthModal(true)}
                    onBecomeSellerClick={() => setShowSellerRequestModal(true)}
                  />
                  <HeroSection />
                </div>

                {/* Main Content (Showroom) */}
                <main className="w-full">
                  {renderError()}
                  
                  {/* ✅ FIXED: Public Showroom container using 1920px logic */}
                  <div className="w-full max-w-[1920px] mx-auto px-3 md:px-5 py-8 lg:py-16">
                    <div className="space-y-8">
                      <PublicShowroom />
                    </div>
                  </div>
                </main>

                {/* Additional Sections - ALL SYNCHRONIZED TO 1920px WIDTH */}
                <FeatureGuide />
                <Guide />
                <Statistics />
                <Banner />
                <Footer />

                {/* Floating QR Button */}
                <FloatingQRButton />
              </ProtectedRoute>
            }
          />

          {/* CATCH-ALL REDIRECT */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>

      {/* Modals */}
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />

      <SellerRequestModal
        isOpen={showSellerRequestModal}
        onClose={() => setShowSellerRequestModal(false)}
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