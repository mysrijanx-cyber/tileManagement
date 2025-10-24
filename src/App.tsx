

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute, AdminProtectedRoute, SellerProtectedRoute } from './components/ProtectedRoute';
import { WorkerProtectedRoute } from './components/WorkerProtectedRoute';
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

// ✅ Error Boundary Component
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
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center">
          <div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-md">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Something went wrong</h1>
            <p className="text-gray-600 mb-6">
              The application encountered an unexpected error. Please refresh the page or contact support.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
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

// ✅ Main App Content
function AppContent() {
  const { isAuthenticated, isLoading, user, error } = useAuth({
    enableActivityTracking: true,
    enableSessionWarnings: true,
    autoLogoutDelay: 30 * 60 * 1000
  });
  
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [domainConfig, setDomainConfig] = useState(getCurrentDomainConfig());

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
      
    } catch (error) {
      console.error('🔥 App initialization error:', error);
    }
  }, [isAuthenticated, isLoading, user]);

  // ✅ NEW: Block workers from accessing non-scan routes
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

  const renderError = () => {
    if (!error) return null;
    
    return (
      <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center">
          <div className="text-red-500 text-xl mr-3">⚠️</div>
          <div>
            <h3 className="font-semibold text-red-800">Authentication Error</h3>
            <p className="text-red-700 text-sm">{error}</p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="ml-auto bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  };

  const renderLoading = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-6"></div>
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
          {domainConfig.title}
        </h2>
        <p className="text-gray-600 text-lg mb-2">Loading application...</p>
        <p className="text-gray-500 text-sm">Initializing secure authentication system</p>
        
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

  const renderAuthPrompt = () => {
    if (isAuthenticated || domainConfig.userType !== 'customer') {
      return null;
    }
    
    return (
      <div className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="text-4xl">🏠</div>
            <div>
              <h3 className="text-xl font-bold text-blue-800">
                Tile Showroom 3D - Virtual Experience
              </h3>
              <p className="text-blue-700">
                Explore our immersive 3D tile visualization platform. 
                Sign in for seller dashboard and admin management features.
              </p>
              <div className="mt-2 flex items-center space-x-4 text-sm text-blue-600">
                <span className="flex items-center">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-1"></span>
                  Virtual Showroom
                </span>
                <span className="flex items-center">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1"></span>
                  3D Visualization
                </span>
                <span className="flex items-center">
                  <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mr-1"></span>
                  Real-time Preview
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={() => setShowAuthModal(true)}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            🔐 Sign In
          </button>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return renderLoading();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <Routes>
        {/* ✅ NEW: QR Scan Routes - Public Access */}
        <Route path="/tile/:tileId" element={<TileDetailsPage />} />
        <Route path="/room-select/:tileId" element={<RoomSelectorPage />} />
        <Route path="/3d-view/:tileId/:roomType" element={<Room3DViewPage />} />
        <Route path="/tile/search" element={<TileSearchPage />} />

        {/* ✅ NEW: Worker Scan Page */}
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

        {/* ✅ Admin Dashboard */}
        <Route
          path="/admin/*"
          element={
            <AdminProtectedRoute>
              <DomainHeader />
              <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {renderError()}
                <AdminDashboard />
              </main>
            </AdminProtectedRoute>
          }
        />

        {/* ✅ Seller Dashboard */}
        <Route
          path="/seller/*"
          element={
            <SellerProtectedRoute>
              <DomainHeader />
              <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {renderError()}
                <SellerDashboard />
              </main>
            </SellerProtectedRoute>
          }
        />

        {/* ✅ Public/Customer Routes */}
        <Route
          path="/*"
          element={
            <ProtectedRoute allowUnauthenticated={true}>
              <DomainHeader />
              <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {renderError()}
                {renderAuthPrompt()}
                
                <div className="space-y-8">
                  <PublicShowroom />
                  
                  <section className="py-16 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg">
                    <div className="max-w-4xl mx-auto px-4">
                      <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-800 mb-4">
                          🤝 Partner With Us
                        </h2>
                        <p className="text-gray-600 text-lg">
                          Expand your tile business with our cutting-edge 3D visualization platform
                        </p>
                        <div className="mt-4 flex items-center justify-center space-x-6 text-sm text-gray-500">
                          <span className="flex items-center">
                            <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                            3D Showroom
                          </span>
                          <span className="flex items-center">
                            <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                            QR Code System
                          </span>
                          <span className="flex items-center">
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

        {/* ✅ Catch-all redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
      
      {/* Footer */}
      <footer className="mt-16 py-8 bg-white/80 backdrop-blur-sm border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-600">
          <p>&copy; 2024 Tile Showroom 3D. All rights reserved.</p>
          <p className="text-sm mt-1">Powered by advanced 3D visualization technology</p>
        </div>
      </footer>
    </div>
  );
}

// ✅ App Wrapper with Router
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