// import React, { useEffect, useState } from 'react';
// import { Shield, AlertTriangle, User, LogIn } from 'lucide-react';
// import { getCurrentDomainConfig, canAccessDomain, DomainConfig } from '../utils/domainUtils';
// import { useAppStore } from '../stores/appStore';
// import { getCurrentUser, supabase, isSupabaseConfigured } from '../lib/firebaseutils

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
//     console.log('🔍 Supabase configured:', isSupabaseConfigured());
//     console.log('🔍 Supabase URL:', import.meta.env.VITE_SUPABASE_URL);
    
//     // If Supabase is not configured, allow access to public areas only
//     if (!isSupabaseConfigured()) {
//       console.log('❌ Supabase not configured');
//       if (config.userType !== 'admin' && config.userType !== 'seller') {
//         setLoading(false);
//         return;
//       } else {
//         setAuthError('Database not configured. Please check your Supabase credentials in the .env file.');
//         setLoading(false);
//         return;
//       }
//     }
    
//     try {
//       // Check current session
//       const { data: { session }, error: sessionError } = await supabase!.auth.getSession();
      
//       console.log('🔍 Session check:', { session: !!session, error: sessionError });
      
//       if (sessionError) {
//         console.error('Session error:', sessionError);
//         setAuthError(`Session error: ${sessionError.message}`);
//         setCurrentUser(null);
//         setIsAuthenticated(false);
//         setLoading(false);
//         return;
//       }

//       if (session?.user) {
//         console.log('✅ Found session for user:', session.user.email);
        
//         // Get user profile
//         try {
//           const userProfile = await getCurrentUser();
//           console.log('🔍 User profile result:', userProfile);
          
//           if (userProfile) {
//             setCurrentUser(userProfile);
//             setIsAuthenticated(true);
//             console.log('✅ User authenticated with role:', userProfile.role);
            
//             // Check domain access
//             const hasAccess = canAccessDomain(userProfile.role, config);
//             console.log('🔍 Domain access check:', { 
//               userRole: userProfile.role, 
//               requiredDomain: config.userType, 
//               hasAccess 
//             });
            
//           } else {
//             console.log('❌ No user profile found for authenticated user');
//             setAuthError('User profile not found. Please contact administrator.');
//           }
//         } catch (profileError) {
//           console.error('❌ Error fetching user profile:', profileError);
//           setAuthError('Could not load user profile. Please try signing in again.');
//         }
//       } else {
//         console.log('❌ No active session found');
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
    } catch (error) {
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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full mx-4">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-red-100 rounded-full">
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
            </div>
            
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Access Restricted</h2>
            <p className="text-gray-600 mb-4">
              You need to sign in to access the {domainConfig.userType} portal.
            </p>
            
            {authError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg mb-4">
                <p className="text-red-700 text-sm">{authError}</p>
              </div>
            )}
            
            <div className="space-y-4">
              {isAuthenticated && currentUser ? (
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    Signed in as: <strong>{currentUser.email}</strong>
                  </p>
                  <p className="text-sm text-blue-600">
                    Role: <strong>{currentUser.role}</strong>
                  </p>
                  <p className="text-xs text-blue-600 mt-2">
                    Required role for this portal: <strong>{domainConfig.userType}</strong>
                  </p>
                </div>
              ) : (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <User className="w-4 h-4 text-gray-600" />
                    <p className="text-sm text-gray-700 font-medium">Authentication Required</p>
                  </div>
                  <p className="text-xs text-gray-600">
                    Please sign in with {domainConfig.userType} credentials to access this portal.
                  </p>
                </div>
              )}
              
              <button
                onClick={handleSignInClick}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              >
                <LogIn className="w-4 h-4" />
                Sign In
              </button>
              
              <button
                onClick={() => window.location.href = '/'}
                className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors text-sm"
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