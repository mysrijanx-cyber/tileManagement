
// import React from 'react';
// import { Navigate } from 'react-router-dom';
// import { useAuth } from '../hooks/useAuth';
// import { useAppStore } from '../stores/appStore';
// import { Shield, AlertCircle, Loader } from 'lucide-react';

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
//   const { currentUser, isAuthenticated } = useAppStore();

//   // Show loading while auth state is being determined
//   if (currentUser === undefined) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-100">
//         <div className="text-center">
//           <Loader className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
//           <p className="text-gray-600">Checking authentication...</p>
//         </div>
//       </div>
//     );
//   }

//   // Not authenticated - redirect to home
//   if (!isAuthenticated || !currentUser) {
//     return <Navigate to="/" replace />;
//   }

//   // ✅ NEW: Block workers from accessing admin dashboard
//   if (currentUser.role === 'worker') {
//     return <Navigate to="/scan" replace />;
//   }

//   // Check if user has admin role
//   if (currentUser.role !== 'admin') {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-100">
//         <div className="text-center max-w-md mx-4">
//           <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
//           <h2 className="text-xl font-semibold text-gray-800 mb-4">Access Denied</h2>
//           <p className="text-gray-600 mb-6">
//             This dashboard is only accessible to administrators. Your role: <strong>{currentUser.role}</strong>
//           </p>
//           <button 
//             onClick={() => window.location.href = '/'}
//             className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//           >
//             Go to Home
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return <>{children}</>;
// };

// // ✅ Seller Protected Route
// export const SellerProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const { currentUser, isAuthenticated } = useAppStore();

//   // Show loading while auth state is being determined
//   if (currentUser === undefined) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-100">
//         <div className="text-center">
//           <Loader className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
//           <p className="text-gray-600">Checking authentication...</p>
//         </div>
//       </div>
//     );
//   }

//   // Not authenticated - redirect to home
//   if (!isAuthenticated || !currentUser) {
//     return <Navigate to="/" replace />;
//   }

//   // ✅ NEW: Block workers from accessing seller dashboard
//   if (currentUser.role === 'worker') {
//     return <Navigate to="/scan" replace />;
//   }

//   // Check if user has seller or admin role
//   if (!['seller', 'admin'].includes(currentUser.role)) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-100">
//         <div className="text-center max-w-md mx-4">
//           <AlertCircle className="w-16 h-16 text-orange-500 mx-auto mb-4" />
//           <h2 className="text-xl font-semibold text-gray-800 mb-4">Access Denied</h2>
//           <p className="text-gray-600 mb-6">
//             This dashboard is only accessible to sellers and administrators. Your role: <strong>{currentUser.role}</strong>
//           </p>
//           <button 
//             onClick={() => window.location.href = '/'}
//             className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//           >
//             Go to Home
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return <>{children}</>;
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
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-3 sm:p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-blue-600 mx-auto mb-3 sm:mb-4"></div>
          <p className="text-gray-600 text-sm sm:text-base">Loading...</p>
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
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-3 sm:p-4">
        <div className="max-w-md w-full mx-3 sm:mx-4">
          <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-6 md:p-8 text-center">
            <AlertCircle className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 text-red-500 mx-auto mb-3 sm:mb-4" />
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 mb-1 sm:mb-2">Authentication Required</h2>
            <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">Please sign in to access this page.</p>
            <button
              onClick={() => window.location.href = '/?auth=signin'}
              className="w-full bg-blue-600 text-white py-2 sm:py-2.5 md:py-3 rounded-lg hover:bg-blue-700 text-sm sm:text-base font-medium"
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
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-3 sm:p-4">
        <div className="max-w-md w-full mx-3 sm:mx-4">
          <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-6 md:p-8 text-center">
            <Shield className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 text-orange-500 mx-auto mb-3 sm:mb-4" />
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 mb-1 sm:mb-2">Access Denied</h2>
            <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">
              You need <strong>{requiredRole}</strong> role to access this page.
            </p>
            <p className="text-xs sm:text-sm text-gray-500 mb-4 sm:mb-6">
              Your role: <strong>{user?.role}</strong>
            </p>
            <button
              onClick={() => window.location.href = '/'}
              className="w-full bg-gray-600 text-white py-2 sm:py-2.5 md:py-3 rounded-lg hover:bg-gray-700 text-sm sm:text-base font-medium"
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
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-3 sm:p-4">
        <div className="text-center">
          <Loader className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 animate-spin text-blue-600 mx-auto mb-3 sm:mb-4" />
          <p className="text-gray-600 text-sm sm:text-base">Checking authentication...</p>
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
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-3 sm:p-4">
        <div className="text-center max-w-md mx-3 sm:mx-4 w-full">
          <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-6 md:p-8">
            <AlertCircle className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 text-red-500 mx-auto mb-3 sm:mb-4" />
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4">Access Denied</h2>
            <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
              This dashboard is only accessible to administrators. Your role: <strong>{currentUser.role}</strong>
            </p>
            <button 
              onClick={() => window.location.href = '/'}
              className="w-full sm:w-auto px-4 sm:px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm sm:text-base font-medium"
            >
              Go to Home
            </button>
          </div>
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
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-3 sm:p-4">
        <div className="text-center">
          <Loader className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 animate-spin text-blue-600 mx-auto mb-3 sm:mb-4" />
          <p className="text-gray-600 text-sm sm:text-base">Checking authentication...</p>
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
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-3 sm:p-4">
        <div className="text-center max-w-md mx-3 sm:mx-4 w-full">
          <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-6 md:p-8">
            <AlertCircle className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 text-orange-500 mx-auto mb-3 sm:mb-4" />
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4">Access Denied</h2>
            <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
              This dashboard is only accessible to sellers and administrators. Your role: <strong>{currentUser.role}</strong>
            </p>
            <button 
              onClick={() => window.location.href = '/'}
              className="w-full sm:w-auto px-4 sm:px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm sm:text-base font-medium"
            >
              Go to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};