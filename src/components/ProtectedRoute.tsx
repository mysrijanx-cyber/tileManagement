// import React from 'react';
// import { useAuth } from '../hooks/useAuth';
// import { Shield, AlertCircle } from 'lucide-react';

// interface ProtectedRouteProps {
//   children: React.ReactNode;
//   allowUnauthenticated?: boolean;
//   requiredRole?: 'admin' | 'seller' | 'customer';
// }

// export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
//   children, 
//   allowUnauthenticated = false,
//   requiredRole 
// }) => {
//   const { isAuthenticated, isLoading, user } = useAuth();

//   console.log('🔍 ProtectedRoute check:', { 
//     isAuthenticated, 
//     isLoading, 
//     userRole: user?.role,
//     requiredRole,
//     allowUnauthenticated 
//   });

//   // ✅ Loading state
//   if (isLoading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-50">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
//           <p className="text-gray-600">Loading...</p>
//         </div>
//       </div>
//     );
//   }

//   // ✅ Allow unauthenticated access (for public pages)
//   if (allowUnauthenticated) {
//     return <>{children}</>;
//   }

//   // ✅ Check authentication
//   if (!isAuthenticated) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-50">
//         <div className="max-w-md w-full mx-4">
//           <div className="bg-white rounded-xl shadow-lg p-8 text-center">
//             <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
//             <h2 className="text-2xl font-bold text-gray-800 mb-2">Authentication Required</h2>
//             <p className="text-gray-600 mb-6">Please sign in to access this page.</p>
//             <button
//               onClick={() => window.location.href = '/?auth=signin'}
//               className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
//             >
//               Sign In
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // ✅ Check role-based access
//   if (requiredRole && user?.role !== requiredRole && user?.role !== 'admin') {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-50">
//         <div className="max-w-md w-full mx-4">
//           <div className="bg-white rounded-xl shadow-lg p-8 text-center">
//             <Shield className="w-16 h-16 text-orange-500 mx-auto mb-4" />
//             <h2 className="text-2xl font-bold text-gray-800 mb-2">Access Denied</h2>
//             <p className="text-gray-600 mb-4">
//               You need <strong>{requiredRole}</strong> role to access this page.
//             </p>
//             <p className="text-gray-500 text-sm mb-6">
//               Your role: <strong>{user?.role}</strong>
//             </p>
//             <button
//               onClick={() => window.location.href = '/'}
//               className="w-full bg-gray-600 text-white py-3 rounded-lg hover:bg-gray-700"
//             >
//               Go Home
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return <>{children}</>;
// };

// // ✅ Admin Protected Route
// export const AdminProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   return (
//     <ProtectedRoute requiredRole="admin" allowUnauthenticated={false}>
//       {children}
//     </ProtectedRoute>
//   );
// };

// // ✅ Seller Protected Route
// export const SellerProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   return (
//     <ProtectedRoute requiredRole="seller" allowUnauthenticated={false}>
//       {children}
//     </ProtectedRoute>
//   );
// };  

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useAppStore } from '../stores/appStore';
import { Shield, AlertCircle, Loader } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowUnauthenticated?: boolean;
  requiredRole?: 'admin' | 'seller' | 'customer';
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  allowUnauthenticated = false,
  requiredRole 
}) => {
  const { isAuthenticated, isLoading, user } = useAuth();

  console.log('🔍 ProtectedRoute check:', { 
    isAuthenticated, 
    isLoading, 
    userRole: user?.role,
    requiredRole,
    allowUnauthenticated 
  });

  // ✅ Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // ✅ Allow unauthenticated access (for public pages)
  if (allowUnauthenticated) {
    return <>{children}</>;
  }

  // ✅ Check authentication
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full mx-4">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Authentication Required</h2>
            <p className="text-gray-600 mb-6">Please sign in to access this page.</p>
            <button
              onClick={() => window.location.href = '/?auth=signin'}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
            >
              Sign In
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ✅ Check role-based access
  if (requiredRole && user?.role !== requiredRole && user?.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full mx-4">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <Shield className="w-16 h-16 text-orange-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Access Denied</h2>
            <p className="text-gray-600 mb-4">
              You need <strong>{requiredRole}</strong> role to access this page.
            </p>
            <p className="text-gray-500 text-sm mb-6">
              Your role: <strong>{user?.role}</strong>
            </p>
            <button
              onClick={() => window.location.href = '/'}
              className="w-full bg-gray-600 text-white py-3 rounded-lg hover:bg-gray-700"
            >
              Go Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

// ✅ Admin Protected Route
export const AdminProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
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

  // ✅ NEW: Block workers from accessing admin dashboard
  if (currentUser.role === 'worker') {
    return <Navigate to="/scan" replace />;
  }

  // Check if user has admin role
  if (currentUser.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center max-w-md mx-4">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-6">
            This dashboard is only accessible to administrators. Your role: <strong>{currentUser.role}</strong>
          </p>
          <button 
            onClick={() => window.location.href = '/'}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

// ✅ Seller Protected Route
export const SellerProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
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

  // ✅ NEW: Block workers from accessing seller dashboard
  if (currentUser.role === 'worker') {
    return <Navigate to="/scan" replace />;
  }

  // Check if user has seller or admin role
  if (!['seller', 'admin'].includes(currentUser.role)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center max-w-md mx-4">
          <AlertCircle className="w-16 h-16 text-orange-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-6">
            This dashboard is only accessible to sellers and administrators. Your role: <strong>{currentUser.role}</strong>
          </p>
          <button 
            onClick={() => window.location.href = '/'}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};