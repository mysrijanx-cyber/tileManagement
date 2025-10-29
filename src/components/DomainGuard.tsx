
// import React, { useEffect, useState } from 'react';
// import { Shield, AlertTriangle, User, LogIn } from 'lucide-react';
// import { getCurrentDomainConfig, canAccessDomain, DomainConfig } from '../utils/domainUtils';
// import { useAppStore } from '../stores/appStore';
// import { getCurrentUser, isFirebaseConfigured } from '../lib/firebaseutils'; // ✅ FIXED: syntax error & correct imports

// interface DomainGuardProps {
//   children: React.ReactNode;
// }

// export const DomainGuard: React.FC<DomainGuardProps> = ({ children }) => {
//   const { currentUser, isAuthenticated, setCurrentUser, setIsAuthenticated } = useAppStore();
//   const [domainConfig, setDomainConfig] = useState<DomainConfig | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [authError, setAuthError] = useState<string | null>(null);

//   useEffect(() => {
//     initializeAuth();
//   }, []);

//   const initializeAuth = async () => {
//     const config = getCurrentDomainConfig();
//     setDomainConfig(config);
    
//     console.log('🔍 Domain config:', config);
//     console.log('🔍 Firebase configured:', isFirebaseConfigured()); // ✅ FIXED: Changed to Firebase
//     console.log('🔍 Firebase API Key:', import.meta.env.VITE_FIREBASE_API_KEY); // ✅ FIXED: Changed to Firebase
    
//     // If Firebase is not configured, allow access to public areas only
//     if (!isFirebaseConfigured()) { // ✅ FIXED: Changed to Firebase
//       console.log('❌ Firebase not configured'); // ✅ FIXED: Changed to Firebase
//       if (config.userType !== 'admin' && config.userType !== 'seller') {
//         setLoading(false);
//         return;
//       } else {
//         setAuthError('Database not configured. Please check your Firebase credentials in the .env file.'); // ✅ FIXED: Changed to Firebase
//         setLoading(false);
//         return;
//       }
//     }
    
//     try {
//       // Get current user directly from Firebase
//       const userProfile = await getCurrentUser();
      
//       if (userProfile) {
//         setCurrentUser(userProfile);
//         setIsAuthenticated(true);
//         console.log('✅ User authenticated with role:', userProfile.role);
        
//         // Check domain access
//         const hasAccess = canAccessDomain(userProfile.role, config);
//         console.log('🔍 Domain access check:', { 
//           userRole: userProfile.role, 
//           requiredDomain: config.userType, 
//           hasAccess 
//         });
//       } else {
//         console.log('❌ No user profile found');
//         setCurrentUser(null);
//         setIsAuthenticated(false);
//       }
//     } catch (error) {
//       console.error('❌ Auth initialization error:', error);
//       setAuthError(`Authentication error: ${error.message}`);
//       setCurrentUser(null);
//       setIsAuthenticated(false);
//     }
    
//     setLoading(false);
//   };

//   const handleSignInClick = () => {
//     // Redirect to main site with auth parameter
//     window.location.href = '/?auth=signin';
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-50">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
//           <p className="text-gray-600">Loading...</p>
//         </div>
//       </div>
//     );
//   }

//   // Check if user can access this domain
//   const hasAccess = domainConfig && canAccessDomain(currentUser?.role || null, domainConfig);
  
//   console.log('Access check:', {
//     userRole: currentUser?.role,
//     requiredRole: domainConfig?.userType,
//     isAuthenticated,
//     hasAccess
//   });

//   if (!hasAccess && domainConfig) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-50">
//         <div className="max-w-md w-full mx-4">
//           <div className="bg-white rounded-xl shadow-lg p-8 text-center">
//             <div className="flex justify-center mb-4">
//               <div className="p-3 bg-red-100 rounded-full">
//                 <AlertTriangle className="w-8 h-8 text-red-600" />
//               </div>
//             </div>
            
//             <h2 className="text-2xl font-bold text-gray-800 mb-2">Access Restricted</h2>
//             <p className="text-gray-600 mb-4">
//               You need to sign in to access the {domainConfig.userType} portal.
//             </p>
            
//             {authError && (
//               <div className="p-3 bg-red-50 border border-red-200 rounded-lg mb-4">
//                 <p className="text-red-700 text-sm">{authError}</p>
//               </div>
//             )}
            
//             <div className="space-y-4">
//               {isAuthenticated && currentUser ? (
//                 <div className="p-4 bg-blue-50 rounded-lg">
//                   <p className="text-sm text-blue-800">
//                     Signed in as: <strong>{currentUser.email}</strong>
//                   </p>
//                   <p className="text-sm text-blue-600">
//                     Role: <strong>{currentUser.role}</strong>
//                   </p>
//                   <p className="text-xs text-blue-600 mt-2">
//                     Required role for this portal: <strong>{domainConfig.userType}</strong>
//                   </p>
//                 </div>
//               ) : (
//                 <div className="p-4 bg-gray-50 rounded-lg">
//                   <div className="flex items-center gap-2 mb-2">
//                     <User className="w-4 h-4 text-gray-600" />
//                     <p className="text-sm text-gray-700 font-medium">Authentication Required</p>
//                   </div>
//                   <p className="text-xs text-gray-600">
//                     Please sign in with {domainConfig.userType} credentials to access this portal.
//                   </p>
//                 </div>
//               )}
              
//               <button
//                 onClick={handleSignInClick}
//                 className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
//               >
//                 <LogIn className="w-4 h-4" />
//                 Sign In
//               </button>
              
//               <button
//                 onClick={() => window.location.href = '/'}
//                 className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors text-sm"
//               >
//                 Go to Public Showroom
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return <>{children}</>;
// };   

import React, { useEffect, useState } from 'react';
import { Shield, AlertTriangle, User, LogIn } from 'lucide-react';
import { getCurrentDomainConfig, canAccessDomain, DomainConfig } from '../utils/domainUtils';
import { useAppStore } from '../stores/appStore';
import { getCurrentUser, isFirebaseConfigured } from '../lib/firebaseutils'; // ✅ FIXED: syntax error & correct imports

interface DomainGuardProps {
  children: React.ReactNode;
}

export const DomainGuard: React.FC<DomainGuardProps> = ({ children }) => {
  const { currentUser, isAuthenticated, setCurrentUser, setIsAuthenticated } = useAppStore();
  const [domainConfig, setDomainConfig] = useState<DomainConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    const config = getCurrentDomainConfig();
    setDomainConfig(config);
    
    console.log('🔍 Domain config:', config);
    console.log('🔍 Firebase configured:', isFirebaseConfigured()); // ✅ FIXED: Changed to Firebase
    console.log('🔍 Firebase API Key:', import.meta.env.VITE_FIREBASE_API_KEY); // ✅ FIXED: Changed to Firebase
    
    // If Firebase is not configured, allow access to public areas only
    if (!isFirebaseConfigured()) { // ✅ FIXED: Changed to Firebase
      console.log('❌ Firebase not configured'); // ✅ FIXED: Changed to Firebase
      if (config.userType !== 'admin' && config.userType !== 'seller') {
        setLoading(false);
        return;
      } else {
        setAuthError('Database not configured. Please check your Firebase credentials in the .env file.'); // ✅ FIXED: Changed to Firebase
        setLoading(false);
        return;
      }
    }
    
    try {
      // Get current user directly from Firebase
      const userProfile = await getCurrentUser();
      
      if (userProfile) {
        setCurrentUser(userProfile);
        setIsAuthenticated(true);
        console.log('✅ User authenticated with role:', userProfile.role);
        
        // Check domain access
        const hasAccess = canAccessDomain(userProfile.role, config);
        console.log('🔍 Domain access check:', { 
          userRole: userProfile.role, 
          requiredDomain: config.userType, 
          hasAccess 
        });
      } else {
        console.log('❌ No user profile found');
        setCurrentUser(null);
        setIsAuthenticated(false);
      }
    } catch (error:any) {
      console.error('❌ Auth initialization error:', error);
      setAuthError(`Authentication error: ${error.message}`);
      setCurrentUser(null);
      setIsAuthenticated(false);
    }
    
    setLoading(false);
  };

  const handleSignInClick = () => {
    // Redirect to main site with auth parameter
    window.location.href = '/?auth=signin';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-3 sm:p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-blue-600 mx-auto mb-3 sm:mb-4"></div>
          <p className="text-gray-600 text-sm sm:text-base">Loading...</p>
        </div>
      </div>
    );
  }

  // Check if user can access this domain
  const hasAccess = domainConfig && canAccessDomain(currentUser?.role || null, domainConfig);
  
  console.log('Access check:', {
    userRole: currentUser?.role,
    requiredRole: domainConfig?.userType,
    isAuthenticated,
    hasAccess
  });

  if (!hasAccess && domainConfig) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-3 sm:p-4">
        <div className="max-w-md w-full mx-2 sm:mx-4">
          <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-6 md:p-8 text-center">
            <div className="flex justify-center mb-3 sm:mb-4">
              <div className="p-2 sm:p-2.5 md:p-3 bg-red-100 rounded-full">
                <AlertTriangle className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-red-600" />
              </div>
            </div>
            
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 mb-1 sm:mb-2">Access Restricted</h2>
            <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4 px-2">
              You need to sign in to access the {domainConfig.userType} portal.
            </p>
            
            {authError && (
              <div className="p-2.5 sm:p-3 bg-red-50 border border-red-200 rounded-lg mb-3 sm:mb-4">
                <p className="text-red-700 text-xs sm:text-sm break-words">{authError}</p>
              </div>
            )}
            
            <div className="space-y-3 sm:space-y-4">
              {isAuthenticated && currentUser ? (
                <div className="p-3 sm:p-4 bg-blue-50 rounded-lg">
                  <p className="text-xs sm:text-sm text-blue-800 break-words">
                    Signed in as: <strong className="break-all">{currentUser.email}</strong>
                  </p>
                  <p className="text-xs sm:text-sm text-blue-600 mt-1">
                    Role: <strong>{currentUser.role}</strong>
                  </p>
                  <p className="text-xs text-blue-600 mt-2">
                    Required role for this portal: <strong>{domainConfig.userType}</strong>
                  </p>
                </div>
              ) : (
                <div className="p-3 sm:p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <User className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600 flex-shrink-0" />
                    <p className="text-xs sm:text-sm text-gray-700 font-medium">Authentication Required</p>
                  </div>
                  <p className="text-xs text-gray-600">
                    Please sign in with {domainConfig.userType} credentials to access this portal.
                  </p>
                </div>
              )}
              
              <button
                onClick={handleSignInClick}
                className="w-full bg-blue-600 text-white py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-1.5 sm:gap-2 text-sm sm:text-base font-medium"
              >
                <LogIn className="w-3 h-3 sm:w-4 sm:h-4" />
                Sign In
              </button>
              
              <button
                onClick={() => window.location.href = '/'}
                className="w-full bg-gray-100 text-gray-700 py-2 sm:py-2.5 px-3 sm:px-4 rounded-lg hover:bg-gray-200 transition-colors text-xs sm:text-sm font-medium"
              >
                Go to Public Showroom
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};