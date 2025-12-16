
// // import React, { useState, useEffect } from 'react';
// // import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// // import { ProtectedRoute, AdminProtectedRoute, SellerProtectedRoute } from './components/ProtectedRoute';
// // import { WorkerProtectedRoute } from './components/WorkerProtectedRoute';
// // import { PlansModal } from './components/Plans/PlansModal';
// // import { useAuth } from './hooks/useAuth';
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
// // import {SellerAutoLogin} from './components/SellerAutoLogin';
// // import { Toaster } from 'react-hot-toast';

// // // ✅ Error Boundary Compone

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
// //     console.error('🔥 App Error Boundary caught error:', error, errorInfo);
// //   }

// //   render() {
// //     if (this.state.hasError) {
// //       return (
// //         <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center p-4">
// //           <div className="text-center p-6 sm:p-8 bg-white rounded-lg sm:rounded-xl shadow-lg max-w-md w-full">
// //             <div className="text-red-500 text-5xl sm:text-6xl mb-3 sm:mb-4">⚠️</div>
// //             <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">
// //               Something went wrong
// //             </h1>
// //             <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
// //               The application encountered an unexpected error. Please refresh the page or contact support.
// //             </p>
// //             {this.state.error && (
// //               <details className="mb-4 sm:mb-6 text-left">
// //                 <summary className="text-xs sm:text-sm text-gray-500 cursor-pointer hover:text-gray-700 transition-colors">
// //                   Error details
// //                 </summary>
// //                 <pre className="mt-2 p-2 sm:p-3 bg-gray-100 rounded text-xs overflow-x-auto">
// //                   {this.state.error.message}
// //                 </pre>
// //               </details>
// //             )}
// //             <button
// //               onClick={() => window.location.reload()}
// //               className="w-full sm:w-auto bg-red-600 text-white px-6 py-2.5 sm:py-3 rounded-lg hover:bg-red-700 active:bg-red-800 transition-colors font-medium text-sm sm:text-base touch-manipulation shadow-md hover:shadow-lg"
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

// // // ✅ Main App Content
// // function AppContent() {
// //   const { isAuthenticated, isLoading, user, error } = useAuth({
// //     enableActivityTracking: false,
// //     enableSessionWarnings: false,
// //     autoLogoutDelay: 0
// //   });
  
// //   const [showAuthModal, setShowAuthModal] = useState(false);
// //   const [domainConfig, setDomainConfig] = useState(getCurrentDomainConfig());
// //   const [isMobile, setIsMobile] = useState(false);
// // const [showPlansModal, setShowPlansModal] = useState(false);
// //   // Detect mobile device
// //   useEffect(() => {
// //     const checkMobile = () => {
// //       setIsMobile(window.innerWidth < 768);
// //     };
    
// //     checkMobile();
// //     window.addEventListener('resize', checkMobile);
    
// //     return () => window.removeEventListener('resize', checkMobile);
// //   }, []);

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
      
// //       // Add meta viewport if not present
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

// //   // ✅ NEW: Block workers from accessing non-scan routes
// //   useEffect(() => {
// //     if (isAuthenticated && user?.role === 'worker') {
// //       const currentPath = window.location.pathname;

// //     //   const allowedPaths = ['/scan', '/tile/', '/3d-view/', '/room-select/'];
// //     //   const isAllowedPath = allowedPaths.some(path => currentPath.startsWith(path));
      
// //     //   if (!isAllowedPath && currentPath !== '/') {
// //     //     console.log('🔒 Worker blocked from:', currentPath);
// //     //     window.location.replace('/scan');
// //     //   }
// //     // }
// // if (user.role === 'worker') {
// //       const allowedPaths = ['/scan', '/tile/', '/3d-view/', '/room-select/'];
// //       const isAllowedPath = allowedPaths.some(path => currentPath.startsWith(path));
      
// //       if (!isAllowedPath && currentPath !== '/') {
// //         console.log('🔒 Worker blocked from:', currentPath);
// //         window.location.replace('/scan');
// //       }
// //     }
// //     // ✅ Don't redirect sellers or admins
// //   }
    
// //   }, [isAuthenticated, user]);

// //   const renderError = () => {
// //     if (!error) return null;
    
// //     return (
// //       <div className="mb-4 sm:mb-6 bg-red-50 border border-red-200 rounded-lg sm:rounded-xl p-3 sm:p-4 animate-shake">
// //         <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
// //           <div className="text-red-500 text-2xl sm:text-xl flex-shrink-0">⚠️</div>
// //           <div className="flex-1 min-w-0">
// //             <h3 className="font-semibold text-red-800 text-sm sm:text-base mb-1">
// //               Authentication Error
// //             </h3>
// //             <p className="text-red-700 text-xs sm:text-sm break-words">{error}</p>
// //           </div>
// //           <button
// //             onClick={() => window.location.reload()}
// //             className="w-full sm:w-auto bg-red-600 text-white px-4 py-2 rounded-lg text-xs sm:text-sm hover:bg-red-700 active:bg-red-800 transition-colors font-medium touch-manipulation flex-shrink-0"
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
// //         <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-b-4 border-blue-600 mx-auto mb-4 sm:mb-6"></div>
// //         <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-2">
// //           {domainConfig.title}
// //         </h2>
// //         <p className="text-base sm:text-lg text-gray-600 mb-1 sm:mb-2">Loading application...</p>
// //         <p className="text-xs sm:text-sm text-gray-500">Initializing secure authentication system</p>
        
// //         <div className="mt-4 sm:mt-6 space-y-2">
// //           <div className="flex items-center justify-center space-x-2 text-xs sm:text-sm text-gray-500">
// //             <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
// //             <span>Verifying authentication tokens</span>
// //           </div>
// //           <div className="flex items-center justify-center space-x-2 text-xs sm:text-sm text-gray-500">
// //             <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
// //             <span>Loading user profile</span>
// //           </div>
// //           <div className="flex items-center justify-center space-x-2 text-xs sm:text-sm text-gray-500">
// //             <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
// //             <span>Applying security policies</span>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );

// //   // const renderAuthPrompt = () => {
// //   //   if (isAuthenticated || domainConfig.userType !== 'customer') {
// //   //     return null;
// //   //   } 
// //   const renderAuthPrompt = () => {
// //   if (domainConfig.userType !== 'customer') {
// //     return null;
// //   }
    
// //     return (
// //       <div className="mb-4 sm:mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-lg">
// //         <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
// //           <div className="flex items-start gap-3 sm:gap-4 flex-1">
// //             <div className="text-3xl sm:text-4xl flex-shrink-0">🏠</div>
// //             <div className="flex-1 min-w-0">
// //               <h3 className="text-lg sm:text-xl font-bold text-blue-800 mb-1 sm:mb-2">
// //                 SrijanX Tile - Virtual Experience
// //               </h3>
// //               <p className="text-sm sm:text-base text-blue-700 mb-2 sm:mb-3">
// //                 Explore our immersive 3D tile visualization platform. 
// //                 Sign in for seller dashboard and admin management features.
// //               </p>
// //               <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-blue-600">
// //                 <span className="flex items-center whitespace-nowrap">
// //                   <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-1"></span>
// //                   Virtual Showroom
// //                 </span>
// //                 <span className="flex items-center whitespace-nowrap">
// //                   <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1"></span>
// //                   3D Visualization
// //                 </span>
// //                 <span className="flex items-center whitespace-nowrap">
// //                   <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mr-1"></span>
// //                   Real-time Preview
// //                 </span>
// //               </div>
// //             </div>
// //           </div>

          
// //           <button
// //             onClick={() => setShowAuthModal(true)}
// //             className="w-full lg:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-lg sm:rounded-xl hover:from-blue-700 hover:to-indigo-700 active:from-blue-800 active:to-indigo-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0 font-medium text-sm sm:text-base flex items-center justify-center gap-2 touch-manipulation flex-shrink-0"
// //           >
// //             <span className="text-lg sm:text-xl">🔐</span>
// //             <span>Sign In</span>
// //           </button>
// //         </div>
// //       </div>
// //     );
// //   };

// //   if (isLoading) {
// //     return renderLoading();
// //   }
// // <Toaster 
// //         position="top-right"
// //         reverseOrder={false}
// //         gutter={8}
// //         containerClassName=""
// //         containerStyle={{}}
// //         toastOptions={{
// //           // Default options
// //           className: '',
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
// //           // Individual toast type styles
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
// //   return (
// //     <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
// //       <Routes>
// //         {/* ✅ NEW: QR Scan Routes - Public Access */}
// //         <Route path="/tile/:tileId" element={<TileDetailsPage />} />
// //         <Route path="/room-select/:tileId" element={<RoomSelectorPage />} />
// //         <Route path="/3d-view/:tileId/:roomType" element={<Room3DViewPage />} />
// //         <Route path="/tile/search" element={<TileSearchPage />} />

// //         {/* ✅ NEW: Worker Scan Page */}
// //         <Route
// //           path="/scan"
// //           element={
// //             <WorkerProtectedRoute>
// //               <WorkerErrorBoundary>
// //                 <ScanPage />
// //               </WorkerErrorBoundary>
// //             </WorkerProtectedRoute>
// //           }
// //         />

// //         {/* ✅ Admin Dashboard */}
// //         <Route
// //           path="/admin/*"
// //           element={
// //             <AdminProtectedRoute>
// //               <DomainHeader />
// //               <main className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
// //                 {renderError()}
// //                 <AdminDashboard />
// //               </main>
// //             </AdminProtectedRoute>
// //           }
// //         />

// //         {/* ✅ Seller Dashboard */}
// //         <Route
// //           path="/seller/*"
// //           element={
// //             <SellerProtectedRoute>
// //               <DomainHeader />
// //               <main className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
// //                 {renderError()}
// //                 <SellerDashboard />
// //               </main>
// //             </SellerProtectedRoute>
// //           }
// //         />

// //         {/* ✅ Public/Customer Routes */}
// //         <Route
// //           path="/*"
// //           element={
// //             <ProtectedRoute allowUnauthenticated={true}>
// //               <DomainHeader />
// //               <main className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
// //                 {renderError()}
// //                 {renderAuthPrompt()}
                
// //                 <div className="space-y-6 sm:space-y-8">
// //                   <PublicShowroom />
                  
// //                   <section className="py-8 sm:py-12 lg:py-16 bg-white/80 backdrop-blur-sm rounded-lg sm:rounded-xl shadow-lg">
// //                     <div className="max-w-4xl mx-auto px-4 sm:px-6">
// //                       <div className="text-center mb-8 sm:mb-12">
// //                         <div className="text-4xl sm:text-5xl mb-3 sm:mb-4">🤝</div>
// //                         <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-3 sm:mb-4">
// //                           Partner With Us
// //                         </h2>
// //                         <p className="text-sm sm:text-base md:text-lg text-gray-600 mb-4 sm:mb-6">
// //                           Expand your tile business with our cutting-edge 3D visualization platform
// //                         </p>
// //                         <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs sm:text-sm text-gray-500">
// //                           <span className="flex items-center whitespace-nowrap">
// //                             <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
// //                             3D Showroom
// //                           </span>
// //                           <span className="flex items-center whitespace-nowrap">
// //                             <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
// //                             QR Code System
// //                           </span>
// //                           <span className="flex items-center whitespace-nowrap">
// //                             <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
// //                             Analytics Dashboard
// //                           </span>
// //                         </div>
// //                       </div>
// //                       <SellerRequestForm />
// //                     </div>
// //                   </section>
// //                 </div>
// //               </main>

// //               {/* ✅ Floating QR Scan Button */}
// //               <FloatingQRButton />
// //             </ProtectedRoute>
// //           }
// //         />

// //         {/* ✅ Catch-all redirect */}
// //         <Route path="*" element={<Navigate to="/" replace />} />
// //         {/* ✅ NEW: Auto-Login Route for Sellers */}
// // <Route path="/seller-auto-login" element={<SellerAutoLogin />} />
// //       </Routes>

// //       <AuthModal 
// //         isOpen={showAuthModal} 
// //         onClose={() => setShowAuthModal(false)} 
// //       />
      
// //       {/* Footer */}
// //       <footer className="mt-8 sm:mt-12 lg:mt-16 py-6 sm:py-8 bg-white/80 backdrop-blur-sm border-t border-gray-200">
// //         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
// //           <div className="text-center text-gray-600">
// //             <p className="text-sm sm:text-base font-medium">
// //               &copy; 2025 SrijanX Tile. All rights reserved.
// //             </p>
// //             <p className="text-xs sm:text-sm mt-1 sm:mt-2 text-gray-500">
// //               Powered by advanced 3D visualization technology
// //             </p>
// //             <div className="mt-3 sm:mt-4 flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-xs text-gray-400">
// //               <span className="flex items-center">
// //                 <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1"></span>
// //                 Secure Platform
// //               </span>
// //               <span className="flex items-center">
// //                 <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-1"></span>
// //                 Cloud Powered
// //               </span>
// //               <span className="flex items-center">
// //                 <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mr-1"></span>
// //                 Real-time Updates
// //               </span>
// //             </div>
// //           </div>
// //         </div>
// //       </footer>
// //     </div>
// //   );
// // }

// // // ✅ App Wrapper with Router
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
// import { PaymentConfirmationModal } from './components/Payment/PaymentConfirmationModal';
// import { PaymentCheckout } from './components/Payment/PaymentCheckout';
// import { initiatePayment } from './lib/paymentService';
// import { getPlanById } from './lib/planService';
// import type { Plan } from './types/plan.types';
// import type { PayUFormData } from './types/payment.types';
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import { ProtectedRoute, AdminProtectedRoute, SellerProtectedRoute } from './components/ProtectedRoute';
// import { WorkerProtectedRoute } from './components/WorkerProtectedRoute';
// import { PlansModal } from './components/Plans/PlansModal';
// import { PaymentSuccess } from './components/Payment/PaymentSuccess';
// import { PaymentFailure } from './components/Payment/PaymentFailure';
// import { useAuth } from './hooks/useAuth';
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
// import { Eye } from 'lucide-react';

// const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
// const [showPaymentConfirmation, setShowPaymentConfirmation] = useState(false);
// const [payuFormData, setPayuFormData] = useState<PayUFormData | null>(null);
// const [processingPayment, setProcessingPayment] = useState(false);
// // ═══════════════════════════════════════════════════════════════
// // ✅ ERROR BOUNDARY COMPONENT
// // ═══════════════════════════════════════════════════════════════

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
//     console.error('🔥 App Error Boundary caught error:', error, errorInfo);
//   }

//   render() {
//     if (this.state.hasError) {
//       return (
//         <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center p-4">
//           <div className="text-center p-6 sm:p-8 bg-white rounded-lg sm:rounded-xl shadow-lg max-w-md w-full">
//             <div className="text-red-500 text-5xl sm:text-6xl mb-3 sm:mb-4">⚠️</div>
//             <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">
//               Something went wrong
//             </h1>
//             <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
//               The application encountered an unexpected error. Please refresh the page or contact support.
//             </p>
//             {this.state.error && (
//               <details className="mb-4 sm:mb-6 text-left">
//                 <summary className="text-xs sm:text-sm text-gray-500 cursor-pointer hover:text-gray-700 transition-colors">
//                   Error details
//                 </summary>
//                 <pre className="mt-2 p-2 sm:p-3 bg-gray-100 rounded text-xs overflow-x-auto">
//                   {this.state.error.message}
//                 </pre>
//               </details>
//             )}
//             <button
//               onClick={() => window.location.reload()}
//               className="w-full sm:w-auto bg-red-600 text-white px-6 py-2.5 sm:py-3 rounded-lg hover:bg-red-700 active:bg-red-800 transition-colors font-medium text-sm sm:text-base touch-manipulation shadow-md hover:shadow-lg"
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

// // ═══════════════════════════════════════════════════════════════
// // ✅ MAIN APP CONTENT COMPONENT
// // ═══════════════════════════════════════════════════════════════

// function AppContent() {
//   const { isAuthenticated, isLoading, user, error } = useAuth({
//     enableActivityTracking: false,
//     enableSessionWarnings: false,
//     autoLogoutDelay: 0
//   });
  
//   const [showAuthModal, setShowAuthModal] = useState(false);
//   const [showPlansModal, setShowPlansModal] = useState(false);
//   const [domainConfig, setDomainConfig] = useState(getCurrentDomainConfig());
//   const [isMobile, setIsMobile] = useState(false);

//   // ═══════════════════════════════════════════════════════════════
//   // ✅ MOBILE DETECTION
//   // ═══════════════════════════════════════════════════════════════
  
//   useEffect(() => {
//     const checkMobile = () => {
//       setIsMobile(window.innerWidth < 768);
//     };
    
//     checkMobile();
//     window.addEventListener('resize', checkMobile);
    
//     return () => window.removeEventListener('resize', checkMobile);
//   }, []);

//   // ═══════════════════════════════════════════════════════════════
//   // ✅ APP INITIALIZATION
//   // ═══════════════════════════════════════════════════════════════

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
      
//       // Add meta viewport if not present
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

//   // ═══════════════════════════════════════════════════════════════
//   // ✅ WORKER ROUTE PROTECTION
//   // ═══════════════════════════════════════════════════════════════

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

//   // ═══════════════════════════════════════════════════════════════
//   // ✅ PLAN SELECTION HANDLER
//   // ═══════════════════════════════════════════════════════════════

//   // const handlePlanSelection = (planId: string) => {
//   //   console.log('📦 Selected plan:', planId);
//   //   setShowPlansModal(false);
    
//   //   if (isAuthenticated) {
//   //     // TODO: Navigate to payment page when integrated
//   //     console.log('✅ User authenticated, proceeding to payment...');
//   //     // For now, show alert
//   //     alert(`Plan ${planId} selected! Redirecting to payment...`);
//   //   } else {
//   //     console.log('🔐 User not authenticated, showing login modal...');
//   //     setShowAuthModal(true);
//   //   }
//   // }; 


//   const handlePlanSelection = async (planId: string) => {
//   try {
//     console.log('📦 Selected plan:', planId);
    
//     // Check if user is authenticated
//     if (!isAuthenticated) {
//       console.log('🔐 User not authenticated, showing login modal...');
//       setShowPlansModal(false);
//       setShowAuthModal(true);
//       return;
//     }

//     // Get full plan details
//     console.log('📋 Fetching plan details...');
//     const plan = await getPlanById(planId);
    
//     if (!plan) {
//       alert('❌ Plan not found. Please try again.');
//       return;
//     }

//     // Store plan and show confirmation modal
//     setSelectedPlan(plan);
//     setShowPlansModal(false);
//     setShowPaymentConfirmation(true);
    
//   } catch (error: any) {
//     console.error('❌ Error selecting plan:', error);
//     alert(`❌ Error: ${error.message}`);
//   }
// };

//   // ═══════════════════════════════════════════════════════════════
//   // ✅ ERROR DISPLAY
//   // ═══════════════════════════════════════════════════════════════

//   const renderError = () => {
//     if (!error) return null;
    
//     return (
//       <div className="mb-4 sm:mb-6 bg-red-50 border border-red-200 rounded-lg sm:rounded-xl p-3 sm:p-4 animate-shake">
//         <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
//           <div className="text-red-500 text-2xl sm:text-xl flex-shrink-0">⚠️</div>
//           <div className="flex-1 min-w-0">
//             <h3 className="font-semibold text-red-800 text-sm sm:text-base mb-1">
//               Authentication Error
//             </h3>
//             <p className="text-red-700 text-xs sm:text-sm break-words">{error}</p>
//           </div>
//           <button
//             onClick={() => window.location.reload()}
//             className="w-full sm:w-auto bg-red-600 text-white px-4 py-2 rounded-lg text-xs sm:text-sm hover:bg-red-700 active:bg-red-800 transition-colors font-medium touch-manipulation flex-shrink-0"
//           >
//             Retry
//           </button>
//         </div>
//       </div>
//     );
//   };

//   // ═══════════════════════════════════════════════════════════════
//   // ✅ LOADING STATE
//   // ═══════════════════════════════════════════════════════════════

//   const renderLoading = () => (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
//       <div className="text-center max-w-md w-full">
//         <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-b-4 border-blue-600 mx-auto mb-4 sm:mb-6"></div>
//         <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-2">
//           {domainConfig.title}
//         </h2>
//         <p className="text-base sm:text-lg text-gray-600 mb-1 sm:mb-2">Loading application...</p>
//         <p className="text-xs sm:text-sm text-gray-500">Initializing secure authentication system</p>
        
//         <div className="mt-4 sm:mt-6 space-y-2">
//           <div className="flex items-center justify-center space-x-2 text-xs sm:text-sm text-gray-500">
//             <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
//             <span>Verifying authentication tokens</span>
//           </div>
//           <div className="flex items-center justify-center space-x-2 text-xs sm:text-sm text-gray-500">
//             <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
//             <span>Loading user profile</span>
//           </div>
//           <div className="flex items-center justify-center space-x-2 text-xs sm:text-sm text-gray-500">
//             <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
//             <span>Applying security policies</span>
//           </div>
//         </div>
//       </div>
//     </div>
//   );

//   // ═══════════════════════════════════════════════════════════════
//   // ✅ AUTH PROMPT WITH VIEW PLANS BUTTON
//   // ═══════════════════════════════════════════════════════════════

//   const renderAuthPrompt = () => {
//     if (domainConfig.userType !== 'customer') {
//       return null;
//     }
    
//     return (
//       <div className="mb-4 sm:mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-lg">
//         <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
//           <div className="flex items-start gap-3 sm:gap-4 flex-1">
//             <div className="text-3xl sm:text-4xl flex-shrink-0">🏠</div>
//             <div className="flex-1 min-w-0">
//               <h3 className="text-lg sm:text-xl font-bold text-blue-800 mb-1 sm:mb-2">
//                 SrijanX Tile - Virtual Experience
//               </h3>
//               <p className="text-sm sm:text-base text-blue-700 mb-2 sm:mb-3">
//                 Explore our immersive 3D tile visualization platform. 
//                 {isAuthenticated 
//                   ? ' Manage your business with our seller dashboard.' 
//                   : ' Sign in for seller dashboard and admin management features.'}
//               </p>
//               <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-blue-600">
//                 <span className="flex items-center whitespace-nowrap">
//                   <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-1"></span>
//                   Virtual Showroom
//                 </span>
//                 <span className="flex items-center whitespace-nowrap">
//                   <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1"></span>
//                   3D Visualization
//                 </span>
//                 <span className="flex items-center whitespace-nowrap">
//                   <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mr-1"></span>
//                   Real-time Preview
//                 </span>
//               </div>
//             </div>
//           </div>

//           {/* ✅ ACTION BUTTONS */}
//           <div className="flex gap-3 w-full lg:w-auto">
//             {/* View Plans Button */}
//             <button
//               onClick={() => setShowPlansModal(true)}
//               className="flex-1 lg:flex-none bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-lg sm:rounded-xl hover:from-purple-700 hover:to-indigo-700 active:from-purple-800 active:to-indigo-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0 font-medium text-sm sm:text-base flex items-center justify-center gap-2 touch-manipulation"
//             >
//               <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
//               <span>View Plans</span>
//             </button>

//             {/* Sign In Button - Only if not logged in */}
//             {!isAuthenticated && (
//               <button
//                 onClick={() => setShowAuthModal(true)}
//                 className="flex-1 lg:flex-none bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-lg sm:rounded-xl hover:from-blue-700 hover:to-cyan-700 active:from-blue-800 active:to-cyan-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0 font-medium text-sm sm:text-base flex items-center justify-center gap-2 touch-manipulation"
//               >
//                 <span className="text-lg sm:text-xl">🔐</span>
//                 <span>Sign In</span>
//               </button>
//             )}
//           </div>
//         </div>
//       </div>
//     );
//   };

//   // ═══════════════════════════════════════════════════════════════
//   // ✅ SHOW LOADING IF AUTH IS LOADING
//   // ═══════════════════════════════════════════════════════════════

//   if (isLoading) {
//     return renderLoading();
//   }

//   // ═══════════════════════════════════════════════════════════════
//   // ✅ MAIN RENDER
//   // ═══════════════════════════════════════════════════════════════

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
//       {/* ✅ Toast Notifications */}
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

//       <Routes>
//         {/* ═══════════════════════════════════════════════════════════ */}
//         {/* ✅ QR SCAN ROUTES - PUBLIC ACCESS */}
//         {/* ═══════════════════════════════════════════════════════════ */}
        
//         <Route path="/tile/:tileId" element={<TileDetailsPage />} />
//         <Route path="/room-select/:tileId" element={<RoomSelectorPage />} />
//         <Route path="/3d-view/:tileId/:roomType" element={<Room3DViewPage />} />
//         <Route path="/tile/search" element={<TileSearchPage />} />

//         {/* ═══════════════════════════════════════════════════════════ */}
//         {/* ✅ WORKER SCAN PAGE */}
//         {/* ═══════════════════════════════════════════════════════════ */}
        
//         <Route
//           path="/scan"
//           element={
//             <WorkerProtectedRoute>
//               <WorkerErrorBoundary>
//                 <ScanPage />
//               </WorkerErrorBoundary>
//             </WorkerProtectedRoute>
//           }
//         />

//         {/* ═══════════════════════════════════════════════════════════ */}
//         {/* ✅ SELLER AUTO-LOGIN */}
//         {/* ═══════════════════════════════════════════════════════════ */}
        
//         <Route path="/seller-auto-login" element={<SellerAutoLogin />} />

//         {/* ═══════════════════════════════════════════════════════════ */}
//         {/* ✅ PAYMENT ROUTES - PUBLIC ACCESS */}
//         {/* ═══════════════════════════════════════════════════════════ */}
        
//         <Route path="/payment-success" element={<PaymentSuccess />} />
//         <Route path="/payment-failure" element={<PaymentFailure />} />
//         <Route 
//           path="/payment-cancelled" 
//           element={
//             <Navigate 
//               to="/payment-failure?status=cancelled&error_Message=Payment cancelled by user" 
//               replace 
//             />
//           } 
//         />

//         {/* ═══════════════════════════════════════════════════════════ */}
//         {/* ✅ ADMIN DASHBOARD */}
//         {/* ═══════════════════════════════════════════════════════════ */}
        
//         <Route
//           path="/admin/*"
//           element={
//             <AdminProtectedRoute>
//               <DomainHeader />
//               <main className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
//                 {renderError()}
//                 <AdminDashboard />
//               </main>
//             </AdminProtectedRoute>
//           }
//         />

//         {/* ═══════════════════════════════════════════════════════════ */}
//         {/* ✅ SELLER DASHBOARD */}
//         {/* ═══════════════════════════════════════════════════════════ */}
        
//         <Route
//           path="/seller/*"
//           element={
//             <SellerProtectedRoute>
//               <DomainHeader />
//               <main className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
//                 {renderError()}
//                 <SellerDashboard />
//               </main>
//             </SellerProtectedRoute>
//           }
//         />

//         {/* ═══════════════════════════════════════════════════════════ */}
//         {/* ✅ PUBLIC/CUSTOMER ROUTES */}
//         {/* ═══════════════════════════════════════════════════════════ */}
        
//         <Route
//           path="/*"
//           element={
//             <ProtectedRoute allowUnauthenticated={true}>
//               <DomainHeader />
//               <main className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
//                 {renderError()}
//                 {renderAuthPrompt()}
                
//                 <div className="space-y-6 sm:space-y-8">
//                   <PublicShowroom />
                  
//                   <section className="py-8 sm:py-12 lg:py-16 bg-white/80 backdrop-blur-sm rounded-lg sm:rounded-xl shadow-lg">
//                     <div className="max-w-4xl mx-auto px-4 sm:px-6">
//                       <div className="text-center mb-8 sm:mb-12">
//                         <div className="text-4xl sm:text-5xl mb-3 sm:mb-4">🤝</div>
//                         <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-3 sm:mb-4">
//                           Partner With Us
//                         </h2>
//                         <p className="text-sm sm:text-base md:text-lg text-gray-600 mb-4 sm:mb-6">
//                           Expand your tile business with our cutting-edge 3D visualization platform
//                         </p>
//                         <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs sm:text-sm text-gray-500">
//                           <span className="flex items-center whitespace-nowrap">
//                             <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
//                             3D Showroom
//                           </span>
//                           <span className="flex items-center whitespace-nowrap">
//                             <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
//                             QR Code System
//                           </span>
//                           <span className="flex items-center whitespace-nowrap">
//                             <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
//                             Analytics Dashboard
//                           </span>
//                         </div>
//                       </div>
//                       <SellerRequestForm />
//                     </div>
//                   </section>
//                 </div>
//               </main>

//               {/* ✅ Floating QR Scan Button */}
//               <FloatingQRButton />
//             </ProtectedRoute>
//           }
//         />

//         {/* ═══════════════════════════════════════════════════════════ */}
//         {/* ✅ CATCH-ALL REDIRECT */}
//         {/* ═══════════════════════════════════════════════════════════ */}
        
//         <Route path="*" element={<Navigate to="/" replace />} />
//       </Routes>

//       {/* ═══════════════════════════════════════════════════════════ */}
//       {/* ✅ MODALS */}
//       {/* ═══════════════════════════════════════════════════════════ */}
      
//       {/* Auth Modal */}
//       <AuthModal 
//         isOpen={showAuthModal} 
//         onClose={() => setShowAuthModal(false)} 
//       />

//       {/* Plans Modal */}
//       <PlansModal
//         isOpen={showPlansModal}
//         onClose={() => setShowPlansModal(false)}
//         isLoggedIn={isAuthenticated}
//         onSelectPlan={handlePlanSelection}
//       />
      
//       {/* ═══════════════════════════════════════════════════════════ */}
//       {/* ✅ FOOTER */}
//       {/* ═══════════════════════════════════════════════════════════ */}
      
//       <footer className="mt-8 sm:mt-12 lg:mt-16 py-6 sm:py-8 bg-white/80 backdrop-blur-sm border-t border-gray-200">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="text-center text-gray-600">
//             <p className="text-sm sm:text-base font-medium">
//               &copy; 2025 SrijanX Tile. All rights reserved.
//             </p>
//             <p className="text-xs sm:text-sm mt-1 sm:mt-2 text-gray-500">
//               Powered by advanced 3D visualization technology
//             </p>
//             <div className="mt-3 sm:mt-4 flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-xs text-gray-400">
//               <span className="flex items-center">
//                 <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1"></span>
//                 Secure Platform
//               </span>
//               <span className="flex items-center">
//                 <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-1"></span>
//                 Cloud Powered
//               </span>
//               <span className="flex items-center">
//                 <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mr-1"></span>
//                 Real-time Updates
//               </span>
//             </div>
//           </div>
//         </div>
//       </footer>
//     </div>
//   );
// }

// // ═══════════════════════════════════════════════════════════════
// // ✅ APP WRAPPER WITH ROUTER
// // ═══════════════════════════════════════════════════════════════

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

// export default App; 
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute, AdminProtectedRoute, SellerProtectedRoute } from './components/ProtectedRoute';
import { WorkerProtectedRoute } from './components/WorkerProtectedRoute';
import { PlansModal } from './components/Plans/PlansModal';
import { PaymentSuccess } from './components/Payment/PaymentSuccess';
import { PaymentFailure } from './components/Payment/PaymentFailure';
import { useAuth } from './hooks/useAuth';
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
import { Eye } from 'lucide-react';

// ═══════════════════════════════════════════════════════════════
// ✅ PAYMENT IMPORTS (NEW)
// ═══════════════════════════════════════════════════════════════
import { PaymentConfirmationModal } from './components/Payment/PaymentConfirmationModal';
import { PaymentCheckout } from './components/Payment/PaymentCheckout';
import { initiatePayment } from './lib/paymentService';
import { getPlanById } from './lib/planService';
import type { Plan } from './types/plan.types';
import type { PayUFormData } from './types/payment.types';

// ═══════════════════════════════════════════════════════════════
// ✅ ERROR BOUNDARY COMPONENT
// ═══════════════════════════════════════════════════════════════

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
    console.error('🔥 App Error Boundary caught error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center p-4">
          <div className="text-center p-6 sm:p-8 bg-white rounded-lg sm:rounded-xl shadow-lg max-w-md w-full">
            <div className="text-red-500 text-5xl sm:text-6xl mb-3 sm:mb-4">⚠️</div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">
              Something went wrong
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
              The application encountered an unexpected error. Please refresh the page or contact support.
            </p>
            {this.state.error && (
              <details className="mb-4 sm:mb-6 text-left">
                <summary className="text-xs sm:text-sm text-gray-500 cursor-pointer hover:text-gray-700 transition-colors">
                  Error details
                </summary>
                <pre className="mt-2 p-2 sm:p-3 bg-gray-100 rounded text-xs overflow-x-auto">
                  {this.state.error.message}
                </pre>
              </details>
            )}
            <button
              onClick={() => window.location.reload()}
              className="w-full sm:w-auto bg-red-600 text-white px-6 py-2.5 sm:py-3 rounded-lg hover:bg-red-700 active:bg-red-800 transition-colors font-medium text-sm sm:text-base touch-manipulation shadow-md hover:shadow-lg"
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

// ═══════════════════════════════════════════════════════════════
// ✅ MAIN APP CONTENT COMPONENT
// ═══════════════════════════════════════════════════════════════

function AppContent() {
  const { isAuthenticated, isLoading, user, error } = useAuth({
    enableActivityTracking: false,
    enableSessionWarnings: false,
    autoLogoutDelay: 0
  });
  
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showPlansModal, setShowPlansModal] = useState(false);
  const [domainConfig, setDomainConfig] = useState(getCurrentDomainConfig());
  const [isMobile, setIsMobile] = useState(false);

  // ═══════════════════════════════════════════════════════════════
  // ✅ PAYMENT STATE (NEW)
  // ═══════════════════════════════════════════════════════════════
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [showPaymentConfirmation, setShowPaymentConfirmation] = useState(false);
  const [payuFormData, setPayuFormData] = useState<PayUFormData | null>(null);
  const [processingPayment, setProcessingPayment] = useState(false);

  // ═══════════════════════════════════════════════════════════════
  // ✅ MOBILE DETECTION
  // ═══════════════════════════════════════════════════════════════
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // ═══════════════════════════════════════════════════════════════
  // ✅ APP INITIALIZATION
  // ═══════════════════════════════════════════════════════════════

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
      
      // Add meta viewport if not present
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

  // ═══════════════════════════════════════════════════════════════
  // ✅ WORKER ROUTE PROTECTION
  // ═══════════════════════════════════════════════════════════════

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

  // ═══════════════════════════════════════════════════════════════
  // ✅ PLAN SELECTION HANDLER (UPDATED WITH PAYMENT)
  // ═══════════════════════════════════════════════════════════════

  const handlePlanSelection = async (planId: string) => {
    try {
      console.log('📦 Selected plan:', planId);
      
      // Check if user is authenticated
      if (!isAuthenticated) {
        console.log('🔐 User not authenticated, showing login modal...');
        setShowPlansModal(false);
        setShowAuthModal(true);
        return;
      }

      // Get full plan details
      console.log('📋 Fetching plan details...');
      const plan = await getPlanById(planId);
      
      if (!plan) {
        alert('❌ Plan not found. Please try again.');
        return;
      }

      // Store plan and show confirmation modal
      setSelectedPlan(plan);
      setShowPlansModal(false);
      setShowPaymentConfirmation(true);
      
    } catch (error: any) {
      console.error('❌ Error selecting plan:', error);
      alert(`❌ Error: ${error.message}`);
    }
  };

  // ═══════════════════════════════════════════════════════════════
  // ✅ PAYMENT CONFIRM HANDLER (NEW)
  // ═══════════════════════════════════════════════════════════════

  const handlePaymentConfirm = async () => {
    if (!selectedPlan) {
      alert('❌ No plan selected');
      return;
    }

    setProcessingPayment(true);

    try {
      console.log('💳 Initiating payment for plan:', selectedPlan.plan_name);

      // Call payment service
      const result = await initiatePayment(
        selectedPlan.id,
        selectedPlan.plan_name,
        selectedPlan.price
      );

      if (!result.success || !result.formData) {
        throw new Error(result.error || 'Failed to initiate payment');
      }

      console.log('✅ Payment initiated successfully');
      console.log('📝 Transaction ID:', result.formData.txnid);

      // Store PayU form data
      setPayuFormData(result.formData);
      
      // Close confirmation modal
      setShowPaymentConfirmation(false);
      
      // PaymentCheckout component will handle the redirect

    } catch (error: any) {
      console.error('❌ Payment initiation error:', error);
      alert(`❌ Payment Error:\n${error.message}`);
      setProcessingPayment(false);
    }
  };

  // ═══════════════════════════════════════════════════════════════
  // ✅ PAYMENT ERROR HANDLER (NEW)
  // ═══════════════════════════════════════════════════════════════

  const handlePaymentError = (error: string) => {
    console.error('❌ Payment checkout error:', error);
    alert(`❌ Payment Error:\n${error}`);
    
    // Reset states
    setPayuFormData(null);
    setProcessingPayment(false);
    setSelectedPlan(null);
  };

  // ═══════════════════════════════════════════════════════════════
  // ✅ ERROR DISPLAY
  // ═══════════════════════════════════════════════════════════════

  const renderError = () => {
    if (!error) return null;
    
    return (
      <div className="mb-4 sm:mb-6 bg-red-50 border border-red-200 rounded-lg sm:rounded-xl p-3 sm:p-4 animate-shake">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="text-red-500 text-2xl sm:text-xl flex-shrink-0">⚠️</div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-red-800 text-sm sm:text-base mb-1">
              Authentication Error
            </h3>
            <p className="text-red-700 text-xs sm:text-sm break-words">{error}</p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="w-full sm:w-auto bg-red-600 text-white px-4 py-2 rounded-lg text-xs sm:text-sm hover:bg-red-700 active:bg-red-800 transition-colors font-medium touch-manipulation flex-shrink-0"
          >
            Retry
          </button>
        </div>
      </div>
    );
  };

  // ═══════════════════════════════════════════════════════════════
  // ✅ LOADING STATE
  // ═══════════════════════════════════════════════════════════════

  const renderLoading = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="text-center max-w-md w-full">
        <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-b-4 border-blue-600 mx-auto mb-4 sm:mb-6"></div>
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-2">
          {domainConfig.title}
        </h2>
        <p className="text-base sm:text-lg text-gray-600 mb-1 sm:mb-2">Loading application...</p>
        <p className="text-xs sm:text-sm text-gray-500">Initializing secure authentication system</p>
        
        <div className="mt-4 sm:mt-6 space-y-2">
          <div className="flex items-center justify-center space-x-2 text-xs sm:text-sm text-gray-500">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            <span>Verifying authentication tokens</span>
          </div>
          <div className="flex items-center justify-center space-x-2 text-xs sm:text-sm text-gray-500">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>Loading user profile</span>
          </div>
          <div className="flex items-center justify-center space-x-2 text-xs sm:text-sm text-gray-500">
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
            <span>Applying security policies</span>
          </div>
        </div>
      </div>
    </div>
  );

  // ═══════════════════════════════════════════════════════════════
  // ✅ AUTH PROMPT WITH VIEW PLANS BUTTON
  // ═══════════════════════════════════════════════════════════════

  const renderAuthPrompt = () => {
    if (domainConfig.userType !== 'customer') {
      return null;
    }
    
    return (
      <div className="mb-4 sm:mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-lg">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="flex items-start gap-3 sm:gap-4 flex-1">
            <div className="text-3xl sm:text-4xl flex-shrink-0">🏠</div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg sm:text-xl font-bold text-blue-800 mb-1 sm:mb-2">
                SrijanX Tile - Virtual Experience
              </h3>
              <p className="text-sm sm:text-base text-blue-700 mb-2 sm:mb-3">
                Explore our immersive 3D tile visualization platform. 
                {isAuthenticated 
                  ? ' Manage your business with our seller dashboard.' 
                  : ' Sign in for seller dashboard and admin management features.'}
              </p>
              <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-blue-600">
                <span className="flex items-center whitespace-nowrap">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-1"></span>
                  Virtual Showroom
                </span>
                <span className="flex items-center whitespace-nowrap">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1"></span>
                  3D Visualization
                </span>
                <span className="flex items-center whitespace-nowrap">
                  <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mr-1"></span>
                  Real-time Preview
                </span>
              </div>
            </div>
          </div>

          {/* ✅ ACTION BUTTONS */}
          <div className="flex gap-3 w-full lg:w-auto">
            {/* View Plans Button */}
            <button
              onClick={() => setShowPlansModal(true)}
              className="flex-1 lg:flex-none bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-lg sm:rounded-xl hover:from-purple-700 hover:to-indigo-700 active:from-purple-800 active:to-indigo-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0 font-medium text-sm sm:text-base flex items-center justify-center gap-2 touch-manipulation"
            >
              <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>View Plans</span>
            </button>

            {/* Sign In Button - Only if not logged in */}
            {!isAuthenticated && (
              <button
                onClick={() => setShowAuthModal(true)}
                className="flex-1 lg:flex-none bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-lg sm:rounded-xl hover:from-blue-700 hover:to-cyan-700 active:from-blue-800 active:to-cyan-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0 font-medium text-sm sm:text-base flex items-center justify-center gap-2 touch-manipulation"
              >
                <span className="text-lg sm:text-xl">🔐</span>
                <span>Sign In</span>
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  // ═══════════════════════════════════════════════════════════════
  // ✅ SHOW LOADING IF AUTH IS LOADING
  // ═══════════════════════════════════════════════════════════════

  if (isLoading) {
    return renderLoading();
  }

  // ═══════════════════════════════════════════════════════════════
  // ✅ MAIN RENDER
  // ═══════════════════════════════════════════════════════════════

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* ✅ Toast Notifications */}
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

      <Routes>
        {/* ═══════════════════════════════════════════════════════════ */}
        {/* ✅ QR SCAN ROUTES - PUBLIC ACCESS */}
        {/* ═══════════════════════════════════════════════════════════ */}
        
        <Route path="/tile/:tileId" element={<TileDetailsPage />} />
        <Route path="/room-select/:tileId" element={<RoomSelectorPage />} />
        <Route path="/3d-view/:tileId/:roomType" element={<Room3DViewPage />} />
        <Route path="/tile/search" element={<TileSearchPage />} />

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* ✅ WORKER SCAN PAGE */}
        {/* ═══════════════════════════════════════════════════════════ */}
        
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

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* ✅ SELLER AUTO-LOGIN */}
        {/* ═══════════════════════════════════════════════════════════ */}
        
        <Route path="/seller-auto-login" element={<SellerAutoLogin />} />

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* ✅ PAYMENT ROUTES - PUBLIC ACCESS */}
        {/* ═══════════════════════════════════════════════════════════ */}
        
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="/payment-failure" element={<PaymentFailure />} />
        <Route 
          path="/payment-cancelled" 
          element={
            <Navigate 
              to="/payment-failure?status=cancelled&error_Message=Payment cancelled by user" 
              replace 
            />
          } 
        />

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* ✅ ADMIN DASHBOARD */}
        {/* ═══════════════════════════════════════════════════════════ */}
        
        <Route
          path="/admin/*"
          element={
            <AdminProtectedRoute>
              <DomainHeader />
              <main className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
                {renderError()}
                <AdminDashboard />
              </main>
            </AdminProtectedRoute>
          }
        />

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* ✅ SELLER DASHBOARD */}
        {/* ═══════════════════════════════════════════════════════════ */}
        
        <Route
          path="/seller/*"
          element={
            <SellerProtectedRoute>
              <DomainHeader />
              <main className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
                {renderError()}
                <SellerDashboard />
              </main>
            </SellerProtectedRoute>
          }
        />

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* ✅ PUBLIC/CUSTOMER ROUTES */}
        {/* ═══════════════════════════════════════════════════════════ */}
        
        <Route
          path="/*"
          element={
            <ProtectedRoute allowUnauthenticated={true}>
              <DomainHeader />
              <main className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
                {renderError()}
                {renderAuthPrompt()}
                
                <div className="space-y-6 sm:space-y-8">
                  <PublicShowroom />
                  
                  <section className="py-8 sm:py-12 lg:py-16 bg-white/80 backdrop-blur-sm rounded-lg sm:rounded-xl shadow-lg">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6">
                      <div className="text-center mb-8 sm:mb-12">
                        <div className="text-4xl sm:text-5xl mb-3 sm:mb-4">🤝</div>
                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-3 sm:mb-4">
                          Partner With Us
                        </h2>
                        <p className="text-sm sm:text-base md:text-lg text-gray-600 mb-4 sm:mb-6">
                          Expand your tile business with our cutting-edge 3D visualization platform
                        </p>
                        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs sm:text-sm text-gray-500">
                          <span className="flex items-center whitespace-nowrap">
                            <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                            3D Showroom
                          </span>
                          <span className="flex items-center whitespace-nowrap">
                            <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                            QR Code System
                          </span>
                          <span className="flex items-center whitespace-nowrap">
                            <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                            Analytics Dashboard
                          </span>
                        </div>
                      </div>
                      <SellerRequestForm />
                    </div>
                  </section>
                </div>
              </main>

              {/* ✅ Floating QR Scan Button */}
              <FloatingQRButton />
            </ProtectedRoute>
          }
        />

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* ✅ CATCH-ALL REDIRECT */}
        {/* ═══════════════════════════════════════════════════════════ */}
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* ✅ MODALS */}
      {/* ═══════════════════════════════════════════════════════════ */}
      
      {/* Auth Modal */}
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />

      {/* Plans Modal */}
      <PlansModal
        isOpen={showPlansModal}
        onClose={() => setShowPlansModal(false)}
        isLoggedIn={isAuthenticated}
        onSelectPlan={handlePlanSelection}
      />

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* ✅ PAYMENT MODALS (NEW) */}
      {/* ═══════════════════════════════════════════════════════════ */}

      {/* Payment Confirmation Modal */}
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

      {/* Payment Checkout - Show when PayU form data is ready */}
      {payuFormData && (
        <PaymentCheckout
          formData={payuFormData}
          onError={handlePaymentError}
        />
      )}
      
      {/* ═══════════════════════════════════════════════════════════ */}
      {/* ✅ FOOTER */}
      {/* ═══════════════════════════════════════════════════════════ */}
      
      <footer className="mt-8 sm:mt-12 lg:mt-16 py-6 sm:py-8 bg-white/80 backdrop-blur-sm border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-gray-600">
            <p className="text-sm sm:text-base font-medium">
              &copy; 2025 SrijanX Tile. All rights reserved.
            </p>
            <p className="text-xs sm:text-sm mt-1 sm:mt-2 text-gray-500">
              Powered by advanced 3D visualization technology
            </p>
            <div className="mt-3 sm:mt-4 flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-xs text-gray-400">
              <span className="flex items-center">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1"></span>
                Secure Platform
              </span>
              <span className="flex items-center">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-1"></span>
                Cloud Powered
              </span>
              <span className="flex items-center">
                <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mr-1"></span>
                Real-time Updates
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// ✅ APP WRAPPER WITH ROUTER
// ═══════════════════════════════════════════════════════════════

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