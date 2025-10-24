import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAppStore } from '../stores/appStore';
import { AlertCircle, Loader } from 'lucide-react';

interface WorkerProtectedRouteProps {
  children: React.ReactNode;
}

export const WorkerProtectedRoute: React.FC<WorkerProtectedRouteProps> = ({ children }) => {
  const { currentUser, isAuthenticated } = useAppStore();

  // Show loading while auth state is being determined
  if (currentUser === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <Loader className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Not authenticated - redirect to home
  if (!isAuthenticated || !currentUser) {
    return <Navigate to="/" replace />;
  }

  // Check if user has appropriate role
  const allowedRoles = ['worker', 'seller', 'admin'];
  if (!allowedRoles.includes(currentUser.role)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center max-w-md mx-4">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-6">
            You don't have permission to access this page. Only workers, sellers, and admins can use the scan functionality.
          </p>
          <button 
            onClick={() => window.location.href = '/'}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  // Special handling for worker role
  if (currentUser.role === 'worker') {
    // Check if worker account is active
    if (currentUser.is_active === false) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
          <div className="text-center max-w-md mx-4">
            <AlertCircle className="w-16 h-16 text-orange-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Account Disabled</h2>
            <p className="text-gray-600 mb-6">
              Your worker account has been disabled by the seller. Please contact them to reactivate your account.
            </p>
            <button 
              onClick={() => {
                // Force logout
                localStorage.clear();
                sessionStorage.clear();
                window.location.href = '/';
              }}
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      );
    }

    // Check if worker account is deleted
    if (currentUser.account_status === 'deleted') {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
          <div className="text-center max-w-md mx-4">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Account Not Found</h2>
            <p className="text-gray-600 mb-6">
              Your worker account has been removed. Please contact the seller for a new account.
            </p>
            <button 
              onClick={() => {
                // Force logout
                localStorage.clear();
                sessionStorage.clear();
                window.location.href = '/';
              }}
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      );
    }
  }

  // All checks passed - render the protected content
  return <>{children}</>;
};