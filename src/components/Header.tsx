
// import React, { useState } from 'react';
// import { Building2, User, Store, Shield, LogOut, LogIn } from 'lucide-react';
// import { useAppStore } from '../stores/appStore';
// import { signOut } from '../lib/firebaseutils';
// import { AuthModal } from './Auth/AuthModal';

// export const Header: React.FC = () => {
//   const { currentShowroom, currentUser, isAuthenticated, setCurrentUser, setIsAuthenticated } = useAppStore();
//   const [showAuthModal, setShowAuthModal] = useState(false);
//   const [loggingOut, setLoggingOut] = useState(false);

//   const handleSignOut = async () => {
//     if (window.confirm('Are you sure you want to logout?')) {
//       setLoggingOut(true);
      
//       try {
//         console.log('🔄 Logging out...');
//         await signOut();
        
//         // Clear app state
//         setCurrentUser(null);
//         setIsAuthenticated(false);
        
//         console.log('✅ Logout successful');
        
//         // Redirect to main page
//         window.location.href = '/';
        
//       } catch (error) {
//         console.error('❌ Logout error:', error);
//         alert('Error during logout. Please refresh the page.');
//       } finally {
//         setLoggingOut(false);
//       }
//     }
//   };

//   const getRoleIcon = () => {
//     if (!currentUser) return <User className="w-4 h-4" />;
//     switch (currentUser.role) {
//       case 'admin': return <Shield className="w-4 h-4" />;
//       case 'seller': return <Store className="w-4 h-4" />;
//       default: return <User className="w-4 h-4" />;
//     }
//   };

//   const getRoleColor = () => {
//     if (!currentUser) return 'bg-gray-100 text-gray-700 hover:bg-gray-200';
//     switch (currentUser.role) {
//       case 'admin': return 'bg-purple-100 text-purple-700';
//       case 'seller': return 'bg-green-100 text-green-700';
//       default: return 'bg-blue-100 text-blue-700';
//     }
//   };

//   return (
//     <>
//       <header className="bg-white shadow-lg border-b">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex items-center justify-between h-16">
//             <div className="flex items-center gap-4">
//               <Building2 className="w-8 h-8 text-blue-600" />
//               <div>
//                 <h1 className="text-xl font-bold text-gray-800">
//                   {currentShowroom?.name || 'Tile Showroom 3D'}
//                 </h1>
//                 <p className="text-sm text-gray-600">Virtual Tile Visualization</p>
//               </div>
//             </div>

//             <div className="flex items-center gap-4">
//               {isAuthenticated && currentUser ? (
//                 // ✅ Authenticated User
//                 <div className="flex items-center gap-3">
//                   <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${getRoleColor()}`}>
//                     {getRoleIcon()}
//                     <span className="text-sm font-medium capitalize">
//                       {currentUser.role}
//                     </span>
//                   </div>
//                   <span className="text-sm text-gray-600">
//                     {currentUser.full_name || currentUser.email}
//                   </span>
//                   <button
//                     onClick={handleSignOut}
//                     disabled={loggingOut}
//                     className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
//                   >
//                     {loggingOut ? (
//                       <>
//                         <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
//                         <span className="text-sm">Logging out...</span>
//                       </>
//                     ) : (
//                       <>
//                         <LogOut className="w-4 h-4" />
//                         <span className="text-sm">Logout</span>
//                       </>
//                     )}
//                   </button>
//                 </div>
//               ) : (
//                 // ✅ Guest User (Fixed from "Consumer")
//                 <div className="flex items-center gap-2">
//                   <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg">
//                     <User className="w-4 h-4" />
//                     <span className="text-sm font-medium">Guest</span> {/* ✅ Fixed */}
//                   </div>
//                   <button
//                     onClick={() => setShowAuthModal(true)}
//                     className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
//                   >
//                     <LogIn className="w-4 h-4" />
//                     <span className="text-sm font-medium">Login</span>
//                   </button>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </header>

//       {/* ✅ Auth Modal */}
//       <AuthModal 
//         isOpen={showAuthModal} 
//         onClose={() => setShowAuthModal(false)} 
//       />
//     </>
//   );
// }; 

// src/components/Header.tsx
import React, { useState } from 'react';
import { Building2, User, Store, Shield, LogOut, LogIn } from 'lucide-react';
import { useAppStore } from '../stores/appStore';
import { useAuth } from '../hooks/useAuth';
import { AuthModal } from './Auth/AuthModal';

export const Header: React.FC = () => {
  const { currentShowroom, currentUser, isAuthenticated } = useAppStore();
  const { logout } = useAuth(); // ✅ ADDED: useAuth hook
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  // // ✅ FIXED: Enhanced logout using useAuth hook
  // const handleSignOut = async () => {
  //   if (loggingOut) return; // Prevent double-click
    
  //   if (!window.confirm('Are you sure you want to logout?')) {
  //     return;
  //   }

  //   setLoggingOut(true);
  //   console.log('🚪 Starting logout process...');

  //   try {
  //     // ✅ USE HOOK'S LOGOUT - This handles everything
  //     await logout();
      
  //     console.log('✅ Logout completed successfully');
      
  //     // ✅ Force redirect to home page
  //     setTimeout(() => {
  //       window.location.href = '/';
  //     }, 500);
      
  //   } catch (error) {
  //     console.error('❌ Logout error:', error);
  //     alert('Error during logout. Forcing cleanup...');
      
  //     // ✅ Force cleanup and redirect anyway
  //     localStorage.clear();
  //     sessionStorage.clear();
  //     window.location.href = '/';
      
  //   } finally {
  //     setLoggingOut(false);
  //   }
  // };
// ✅✅✅ REPLACE ENTIRE handleSignOut FUNCTION:

const handleSignOut = async () => {
  // Prevent double-click
  if (loggingOut) {
    console.log('⏳ Logout already in progress...');
    return;
  }
  
  // Confirm logout
  if (!window.confirm('Are you sure you want to logout?')) {
    return;
  }

  console.log('🚪 Starting logout process...');
  setLoggingOut(true);

  try {
    // ✅ Step 1: Call useAuth logout (clears JWT, Firebase, state)
    console.log('🔐 Calling auth logout...');
    await logout();
    
    console.log('✅ Auth logout completed');
    
  } catch (error) {
    console.error('❌ Logout error:', error);
    // Don't stop - continue with cleanup
  }
  
  // ✅ Step 2: Force complete cleanup (paranoid mode)
  console.log('🧹 Performing deep cleanup...');
  
  try {
    // Clear ALL possible storage
    localStorage.clear();
    sessionStorage.clear();
    
    // Clear cookies
    document.cookie.split(";").forEach((c) => {
      document.cookie = c
        .replace(/^ +/, "")
        .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });
    
    console.log('✅ Deep cleanup completed');
    
  } catch (cleanupError) {
    console.error('❌ Cleanup error:', cleanupError);
  }
  
  // ✅ Step 3: IMMEDIATE redirect (NO setTimeout!)
  console.log('🔄 Redirecting to home page...');
  
  // Use replace to prevent back button issues
  window.location.replace('/');
  
  // Note: Code after this won't run because page is reloading
};

  const getRoleIcon = () => {
    if (!currentUser) return <User className="w-4 h-4" />;
    switch (currentUser.role) {
      case 'admin': return <Shield className="w-4 h-4" />;
      case 'seller': return <Store className="w-4 h-4" />;
      default: return <User className="w-4 h-4" />;
    }
  };

  const getRoleColor = () => {
    if (!currentUser) return 'bg-gray-100 text-gray-700 hover:bg-gray-200';
    switch (currentUser.role) {
      case 'admin': return 'bg-purple-100 text-purple-700';
      case 'seller': return 'bg-green-100 text-green-700';
      default: return 'bg-blue-100 text-blue-700';
    }
  };

  return (
    <>
      <header className="bg-white shadow-lg border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo Section */}
            <div className="flex items-center gap-4">
              <Building2 className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-800">
                  {currentShowroom?.name || 'Tile Showroom 3D'}
                </h1>
                <p className="text-sm text-gray-600">Virtual Tile Visualization</p>
              </div>
            </div>

            {/* User Section */}
            <div className="flex items-center gap-4">
              {isAuthenticated && currentUser ? (
                // ✅ Authenticated User Section
                <div className="flex items-center gap-3">
                  {/* Role Badge */}
                  <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${getRoleColor()}`}>
                    {getRoleIcon()}
                    <span className="text-sm font-medium capitalize">
                      {currentUser.role}
                    </span>
                  </div>
                  
                  {/* User Name */}
                  <div className="text-right hidden sm:block">
                    <p className="text-sm font-medium text-gray-700">
                      {currentUser.full_name || currentUser.email}
                    </p>
                    <p className="text-xs text-gray-500">
                      {currentUser.email}
                    </p>
                  </div>
                  
                  {/* Logout Button */}
                  <button
                    onClick={handleSignOut}
                    disabled={loggingOut}
                    className={`
                      flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200
                      ${loggingOut 
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                        : 'bg-red-500 text-white hover:bg-red-600 active:scale-95 shadow-md hover:shadow-lg'
                      }
                    `}
                    title="Logout from your account"
                  >
                    {loggingOut ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span className="text-sm font-medium">Logging out...</span>
                      </>
                    ) : (
                      <>
                        <LogOut className="w-4 h-4" />
                        <span className="text-sm font-medium">Logout</span>
                      </>
                    )}
                  </button>
                </div>
              ) : (
                // ✅ Guest User Section (NOT AUTHENTICATED)
                <div className="flex items-center gap-3">
                  {/* Guest Badge */}
                  <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg">
                    <User className="w-4 h-4" />
                    <span className="text-sm font-medium">Guest</span>
                  </div>
                  
                  {/* Login Button */}
                  <button
                    onClick={() => setShowAuthModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-md hover:shadow-lg active:scale-95"
                  >
                    <LogIn className="w-4 h-4" />
                    <span className="text-sm font-medium">Login</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ✅ Debug Bar (Development Only) */}
        {import.meta.env.MODE === 'development' && (
          <div className="bg-yellow-50 border-t border-yellow-200 px-4 py-2">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-4">
                  <span className={`font-semibold ${isAuthenticated ? 'text-green-700' : 'text-red-700'}`}>
                    Auth: {isAuthenticated ? '✅ YES' : '❌ NO'}
                  </span>
                  <span className="text-gray-600">
                    User: {currentUser?.email || 'None'}
                  </span>
                  <span className="text-gray-600">
                    Role: {currentUser?.role || 'N/A'}
                  </span>
                  <span className="text-gray-600">
                    Token: {localStorage.getItem('tile_access_token') ? '✅ EXISTS' : '❌ MISSING'}
                  </span>
                </div>
                <button
                  onClick={() => {
                    console.log('=== DEBUG STATE ===');
                    console.log('isAuthenticated:', isAuthenticated);
                    console.log('currentUser:', currentUser);
                    console.log('localStorage tokens:', {
                      access: localStorage.getItem('tile_access_token'),
                      refresh: localStorage.getItem('tile_refresh_token')
                    });
                    console.log('==================');
                  }}
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  🔍 Debug
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* ✅ Auth Modal */}
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)}
        onSuccess={() => {
          setShowAuthModal(false);
          console.log('✅ Login successful, modal closed');
        }}
      />
    </>
  );
};