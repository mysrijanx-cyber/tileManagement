
// import React, { useEffect, useState } from 'react';
// import {  AlertTriangle, User, LogIn } from 'lucide-react';
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
//     } catch (error:any) {
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
//       <div className="min-h-screen flex items-center justify-center bg-gray-50 p-3 sm:p-4">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-blue-600 mx-auto mb-3 sm:mb-4"></div>
//           <p className="text-gray-600 text-sm sm:text-base">Loading...</p>
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
//       <div className="min-h-screen flex items-center justify-center bg-gray-50 p-3 sm:p-4">
//         <div className="max-w-md w-full mx-2 sm:mx-4">
//           <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-6 md:p-8 text-center">
//             <div className="flex justify-center mb-3 sm:mb-4">
//               <div className="p-2 sm:p-2.5 md:p-3 bg-red-100 rounded-full">
//                 <AlertTriangle className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-red-600" />
//               </div>
//             </div>
            
//             <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 mb-1 sm:mb-2">Access Restricted</h2>
//             <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4 px-2">
//               You need to sign in to access the {domainConfig.userType} portal.
//             </p>
            
//             {authError && (
//               <div className="p-2.5 sm:p-3 bg-red-50 border border-red-200 rounded-lg mb-3 sm:mb-4">
//                 <p className="text-red-700 text-xs sm:text-sm break-words">{authError}</p>
//               </div>
//             )}
            
//             <div className="space-y-3 sm:space-y-4">
//               {isAuthenticated && currentUser ? (
//                 <div className="p-3 sm:p-4 bg-blue-50 rounded-lg">
//                   <p className="text-xs sm:text-sm text-blue-800 break-words">
//                     Signed in as: <strong className="break-all">{currentUser.email}</strong>
//                   </p>
//                   <p className="text-xs sm:text-sm text-blue-600 mt-1">
//                     Role: <strong>{currentUser.role}</strong>
//                   </p>
//                   <p className="text-xs text-blue-600 mt-2">
//                     Required role for this portal: <strong>{domainConfig.userType}</strong>
//                   </p>
//                 </div>
//               ) : (
//                 <div className="p-3 sm:p-4 bg-gray-50 rounded-lg">
//                   <div className="flex items-center gap-2 mb-2">
//                     <User className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600 flex-shrink-0" />
//                     <p className="text-xs sm:text-sm text-gray-700 font-medium">Authentication Required</p>
//                   </div>
//                   <p className="text-xs text-gray-600">
//                     Please sign in with {domainConfig.userType} credentials to access this portal.
//                   </p>
//                 </div>
//               )}
              
//               <button
//                 onClick={handleSignInClick}
//                 className="w-full bg-blue-600 text-white py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-1.5 sm:gap-2 text-sm sm:text-base font-medium"
//               >
//                 <LogIn className="w-3 h-3 sm:w-4 sm:h-4" />
//                 Sign In
//               </button>
              
//               <button
//                 onClick={() => window.location.href = '/'}
//                 className="w-full bg-gray-100 text-gray-700 py-2 sm:py-2.5 px-3 sm:px-4 rounded-lg hover:bg-gray-200 transition-colors text-xs sm:text-sm font-medium"
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
import React, { useState, useCallback, useMemo, useEffect, Suspense } from 'react';
import { User, Store, Shield, LogOut, Clock, Wifi } from 'lucide-react';
import { useAppStore } from '../stores/appStore';
import { signOut } from '../lib/firebaseutils';
import { getCurrentDomainConfig } from '../utils/domainUtils';

// ═══════════════════════════════════════════════════════════
// ✅ IMPORT LOGO IMAGES DIRECTLY
// ═══════════════════════════════════════════════════════════
import LogoFull from '../logo/logo.png';
import LogoIcon from '../logo/icon.png';

// ═══════════════════════════════════════════════════════════
// ✅ LOGO FALLBACK COMPONENT
// ═══════════════════════════════════════════════════════════
const LogoFallback: React.FC = () => (
  <div className="logo-skeleton animate-pulse">
    <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
  </div>
);

// ═══════════════════════════════════════════════════════════
// ✅ ERROR BOUNDARY FOR LOGO
// ═══════════════════════════════════════════════════════════
class LogoErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('❌ Logo Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

// ═══════════════════════════════════════════════════════════
// ✅ MAIN DOMAIN HEADER COMPONENT
// ═══════════════════════════════════════════════════════════
export const DomainHeader: React.FC = React.memo(() => {
  const { currentShowroom, currentUser, isAuthenticated, setCurrentUser, setIsAuthenticated } = useAppStore();
  const domainConfig = getCurrentDomainConfig();

  // ═══════════════════════════════════════════════════════════
  // STATE MANAGEMENT
  // ═══════════════════════════════════════════════════════════
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  // ═══════════════════════════════════════════════════════════
  // ✅ LIVE CLOCK UPDATE
  // ═══════════════════════════════════════════════════════════
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // ═══════════════════════════════════════════════════════════
  // ✅ CLOSE MENU ON OUTSIDE CLICK
  // ═══════════════════════════════════════════════════════════
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.user-menu-container')) {
        setShowUserMenu(false);
      }
    };

    if (showUserMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showUserMenu]);

  // ═══════════════════════════════════════════════════════════
  // ✅ OPTIMIZED LOGOUT HANDLER WITH SECURITY
  // ═══════════════════════════════════════════════════════════
  const handleSignOut = useCallback(async () => {
    const confirmed = window.confirm('Are you sure you want to logout?');
    if (!confirmed) return;

    setIsLoggingOut(true);

    try {
      console.log('🚪 Logging out user:', currentUser?.email);
      
      // ✅ Firebase Sign Out
      await signOut();
      
      // ✅ Clear Store
      setCurrentUser(null);
      setIsAuthenticated(false);
      
      // ✅ Clear All Storage (Security)
      localStorage.removeItem('user');
      localStorage.removeItem('isAuthenticated');
      sessionStorage.clear();
      
      // ✅ Clear Cookies (if any)
      document.cookie.split(";").forEach((c) => {
        document.cookie = c
          .replace(/^ +/, "")
          .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
      });
      
      console.log('✅ Logout successful');
      
      // ✅ Redirect with cache clear
      window.location.href = '/?logout=true';
      
    } catch (error) {
      console.error('❌ Error signing out:', error);
      alert('Logout failed. Please try again.');
    } finally {
      setIsLoggingOut(false);
    }
  }, [currentUser, setCurrentUser, setIsAuthenticated]);

  // ═══════════════════════════════════════════════════════════
  // ✅ MEMOIZED DOMAIN ICON
  // ═══════════════════════════════════════════════════════════
  const domainIcon = useMemo(() => {
    const iconClass = "w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 lg:w-10 lg:h-10 transition-transform duration-300 hover:scale-110";
    const iconColor = domainConfig.theme.primary;

    switch (domainConfig.userType) {
      case 'admin':
        return <Shield className={iconClass} style={{ color: iconColor }} />;
      case 'seller':
        return <Store className={iconClass} style={{ color: iconColor }} />;
      default:
        return null;
    }
  }, [domainConfig.userType, domainConfig.theme.primary]);

  // ═══════════════════════════════════════════════════════════
  // ✅ MEMOIZED ROLE ICON
  // ═══════════════════════════════════════════════════════════
  const roleIcon = useMemo(() => {
    if (!currentUser) return <User className="w-4 h-4 sm:w-5 sm:h-5" />;
    
    const iconClass = "w-4 h-4 sm:w-5 sm:h-5";
    
    switch (currentUser.role) {
      case 'admin':
        return <Shield className={`${iconClass} text-red-600`} />;
      case 'seller':
        return <Store className={`${iconClass} text-green-600`} />;
      default:
        return <User className={`${iconClass} text-blue-600`} />;
    }
  }, [currentUser]);

  // ═══════════════════════════════════════════════════════════
  // ✅ MEMOIZED ROLE COLOR
  // ═══════════════════════════════════════════════════════════
  const roleColor = useMemo(() => {
    if (!currentUser) return 'bg-gray-100 text-gray-700 border-gray-200';
    
    switch (currentUser.role) {
      case 'admin':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'seller':
        return 'bg-green-50 text-green-700 border-green-200';
      default:
        return 'bg-blue-50 text-blue-700 border-blue-200';
    }
  }, [currentUser]);

  // ═══════════════════════════════════════════════════════════
  // ✅ MEMOIZED TITLES
  // ═══════════════════════════════════════════════════════════
  const { domainTitle, domainSubtitle } = useMemo(() => {
    let title = '';
    let subtitle = '';

    switch (domainConfig.userType) {
      case 'admin':
        title = 'Admin Panel';
        subtitle = 'Platform Management';
        break;
      case 'seller':
        title = 'Seller Dashboard';
        subtitle = 'Manage Your Tiles';
        break;
      default:
        title = currentShowroom?.name || 'Tiles View360';
        subtitle = 'Virtual Tile Visualization';
    }

    return { domainTitle: title, domainSubtitle: subtitle };
  }, [domainConfig.userType, currentShowroom?.name]);

  // ═══════════════════════════════════════════════════════════
  // ✅ FORMATTED TIME
  // ═══════════════════════════════════════════════════════════
  const formattedTime = useMemo(() => {
    return currentTime.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  }, [currentTime]);

  const formattedDate = useMemo(() => {
    return currentTime.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }, [currentTime]);

  // ═══════════════════════════════════════════════════════════
  // ✅ LOGO COMPONENT WITH PROPER RESPONSIVE BEHAVIOR
  // ═══════════════════════════════════════════════════════════
  const renderLogo = useCallback(() => {
    // Admin & Seller: Icon only
    if (domainConfig.userType === 'admin' || domainConfig.userType === 'seller') {
      return (
        <div className="domain-icon-wrapper">
          {domainIcon}
        </div>
      );
    }

    // Client Portal: Logo images
    return (
      <LogoErrorBoundary fallback={<LogoFallback />}>
        <Suspense fallback={<LogoFallback />}>
          <div className="logo-container">
            {/* Mobile - Icon only (< 640px) */}
            <picture className="mobile-logo-wrapper">
              <img
                src={LogoIcon}
                alt="Tiles View360 Icon"
                className="mobile-logo"
                width={48}
                height={48}
                loading="eager"
                fetchPriority="high"
                onError={(e) => {
                  console.error('❌ Mobile logo failed to load');
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            </picture>

            {/* Desktop - Full Logo (>= 640px) */}
            <picture className="desktop-logo-wrapper">
              <source
                media="(min-width: 1280px)"
                srcSet={LogoFull}
                type="image/png"
              />
              <source
                media="(min-width: 640px)"
                srcSet={LogoFull}
                type="image/png"
              />
              <img
                src={LogoFull}
                alt="Tiles View360 Full Logo"
                className="desktop-logo"
                loading="eager"
                fetchPriority="high"
                onError={(e) => {
                  console.error('❌ Desktop logo failed to load');
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            </picture>
          </div>
        </Suspense>
      </LogoErrorBoundary>
    );
  }, [domainConfig.userType, domainIcon]);

  // ═══════════════════════════════════════════════════════════
  // ✅ USER DISPLAY NAME
  // ═══════════════════════════════════════════════════════════
  const userDisplayName = useMemo(() => {
    if (!currentUser) return 'Guest';
    return currentUser.full_name || currentUser.email?.split('@')[0] || 'User';
  }, [currentUser]);

  // ═══════════════════════════════════════════════════════════
  // ✅ RENDER
  // ═══════════════════════════════════════════════════════════
  return (
    <>
      {/* ═══════════════════════════════════════════════════════════
          ✅ PRODUCTION READY - CRYSTAL CLEAR LOGO CSS
      ═══════════════════════════════════════════════════════════ */}
      <style>{`
        /* ═══════════════════════════════════════════════════════════
           LOGO CONTAINER
        ═══════════════════════════════════════════════════════════ */
        .logo-container {
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          min-height: 48px;
        }

        .domain-icon-wrapper {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* ═══════════════════════════════════════════════════════════
           BASE LOGO STYLES - CRYSTAL CLEAR RENDERING
        ═══════════════════════════════════════════════════════════ */
        .mobile-logo,
        .desktop-logo {
          display: block;
          object-fit: contain;
          object-position: center;
          
          /* ✅ Crystal Clear Rendering */
          image-rendering: -webkit-optimize-contrast;
          image-rendering: crisp-edges;
          image-rendering: optimizeQuality;
          -webkit-backface-visibility: hidden;
          backface-visibility: hidden;
          
          /* ✅ Anti-blur Transform */
          transform: translateZ(0) scale(1);
          -webkit-transform: translateZ(0) scale(1);
          
          /* ✅ Sharp Text Rendering */
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          
          /* ✅ Prevent Dragging & Selection */
          user-select: none;
          -webkit-user-drag: none;
          -moz-user-select: none;
          -ms-user-select: none;
          pointer-events: none;
          
          /* ✅ Smooth Transitions */
          transition: opacity 0.3s ease-in-out, transform 0.3s ease;
          will-change: transform;
        }

        /* ✅ HOVER EFFECT */
        .logo-container:hover .mobile-logo,
        .logo-container:hover .desktop-logo {
          transform: translateZ(0) scale(1.02);
        }

        /* ═══════════════════════════════════════════════════════════
           MOBILE LOGO - Icon Only (0px - 639px)
        ═══════════════════════════════════════════════════════════ */
        .mobile-logo-wrapper {
          display: block;
        }

        .mobile-logo {
          display: block;
          width: 48px;
          height: 48px;
          min-width: 48px;
          min-height: 48px;
        }

        .desktop-logo-wrapper,
        .desktop-logo {
          display: none;
        }

        /* ═══════════════════════════════════════════════════════════
           VERY SMALL MOBILE (320px - 479px)
        ═══════════════════════════════════════════════════════════ */
        @media (max-width: 479px) {
          .mobile-logo {
            width: 44px;
            height: 44px;
            min-width: 44px;
            min-height: 44px;
          }
        }

        /* ═══════════════════════════════════════════════════════════
           SMALL MOBILE (480px - 639px)
        ═══════════════════════════════════════════════════════════ */
        @media (min-width: 480px) and (max-width: 639px) {
          .mobile-logo {
            width: 52px;
            height: 52px;
            min-width: 52px;
            min-height: 52px;
          }
        }

        /* ═══════════════════════════════════════════════════════════
           TABLET/DESKTOP - Full Logo (640px+)
        ═══════════════════════════════════════════════════════════ */
        @media (min-width: 640px) {
          .mobile-logo-wrapper,
          .mobile-logo {
            display: none;
          }
          
          .desktop-logo-wrapper {
            display: block;
          }
          
          .desktop-logo {
            display: block;
            height: 56px;
            width: auto;
            max-width: 280px;
          }
        }

        /* ═══════════════════════════════════════════════════════════
           MEDIUM SCREENS (768px+)
        ═══════════════════════════════════════════════════════════ */
        @media (min-width: 768px) {
          .desktop-logo {
            height: 64px;
            max-width: 320px;
          }
        }

        /* ═══════════════════════════════════════════════════════════
           LARGE SCREENS (1024px+)
        ═══════════════════════════════════════════════════════════ */
        @media (min-width: 1024px) {
          .desktop-logo {
            height: 72px;
            max-width: 360px;
          }
        }

        /* ═══════════════════════════════════════════════════════════
           EXTRA LARGE (1280px+)
        ═══════════════════════════════════════════════════════════ */
        @media (min-width: 1280px) {
          .desktop-logo {
            height: 80px;
            max-width: 400px;
          }
        }

        /* ═══════════════════════════════════════════════════════════
           ULTRA WIDE (1536px+)
        ═══════════════════════════════════════════════════════════ */
        @media (min-width: 1536px) {
          .desktop-logo {
            height: 88px;
            max-width: 440px;
          }
        }

        /* ═══════════════════════════════════════════════════════════
           2K SCREENS (1920px+)
        ═══════════════════════════════════════════════════════════ */
        @media (min-width: 1920px) {
          .desktop-logo {
            height: 96px;
            max-width: 480px;
          }
        }

        /* ═══════════════════════════════════════════════════════════
           HIGH DPI/RETINA DISPLAYS
        ═══════════════════════════════════════════════════════════ */
        @media (-webkit-min-device-pixel-ratio: 2), 
               (min-resolution: 192dpi),
               (min-resolution: 2dppx) {
          .mobile-logo,
          .desktop-logo {
            image-rendering: -webkit-optimize-contrast;
            image-rendering: crisp-edges;
          }
        }

        /* ═══════════════════════════════════════════════════════════
           SKELETON LOADER
        ═══════════════════════════════════════════════════════════ */
        .logo-skeleton {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }

        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        /* ═══════════════════════════════════════════════════════════
           USER MENU DROPDOWN ANIMATION
        ═══════════════════════════════════════════════════════════ */
        .user-menu-dropdown {
          animation: slideDown 0.2s ease-out;
          transform-origin: top right;
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        /* ═══════════════════════════════════════════════════════════
           SMOOTH TRANSITIONS
        ═══════════════════════════════════════════════════════════ */
        .smooth-transition {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .smooth-hover:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        /* ═══════════════════════════════════════════════════════════
           RESPONSIVE STATUS BAR
        ═══════════════════════════════════════════════════════════ */
        @media (max-width: 639px) {
          .status-bar-compact {
            font-size: 0.75rem;
            padding: 0.5rem;
          }
        }

        /* ═══════════════════════════════════════════════════════════
           PRINT STYLES
        ═══════════════════════════════════════════════════════════ */
        @media print {
          .logo-container,
          .domain-icon-wrapper {
            display: flex !important;
            justify-content: flex-start !important;
          }
          
          .desktop-logo {
            display: block !important;
            height: 60px !important;
          }
        }
      `}</style>

      {/* ═══════════════════════════════════════════════════════════
          HEADER COMPONENT
      ═══════════════════════════════════════════════════════════ */}
      <header 
        className="bg-white shadow-lg border-b sticky top-0 z-50 smooth-transition"
        style={{ borderColor: domainConfig.theme.primary + '20' }}
        role="banner"
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-18 md:h-20 lg:h-24 xl:h-28">
            
            {/* ═══════════════════════════════════════════════════════════
                LEFT SIDE - Logo & Title
            ═══════════════════════════════════════════════════════════ */}
            <div className="flex items-center gap-2 sm:gap-3 md:gap-4 lg:gap-5 min-w-0 flex-1">
              <div className="flex-shrink-0">
                {renderLogo()}
              </div>

              {/* Title - Only for admin/seller */}
              {(domainConfig.userType === 'admin' || domainConfig.userType === 'seller') && (
                <div className="min-w-0 flex-1 hidden sm:block">
                  <h1 
                    className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl font-bold text-gray-800 truncate smooth-transition"
                    style={{ color: domainConfig.theme.primary }}
                  >
                    {domainTitle}
                  </h1>
                  <p className="text-xs sm:text-sm md:text-base text-gray-600 truncate">
                    {domainSubtitle}
                  </p>
                </div>
              )}
            </div>

            {/* ═══════════════════════════════════════════════════════════
                RIGHT SIDE - User Info & Actions
            ═══════════════════════════════════════════════════════════ */}
            <div className="flex items-center gap-2 sm:gap-3 md:gap-4 flex-shrink-0 ml-2">
              {isAuthenticated && currentUser ? (
                <>
                  {/* User Profile Section */}
                  <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3">
                    {/* User Avatar with Menu */}
                    <div className="user-menu-container relative">
                      <button
                        onClick={() => setShowUserMenu(!showUserMenu)}
                        className={`flex items-center gap-1.5 sm:gap-2 md:gap-3 px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-lg border smooth-transition smooth-hover ${roleColor}`}
                        aria-expanded={showUserMenu}
                        aria-haspopup="true"
                      >
                        <div className="flex items-center gap-1.5 sm:gap-2">
                          {roleIcon}
                          <div className="text-right hidden sm:block">
                            <div className="text-xs sm:text-sm md:text-base font-medium truncate max-w-[100px] sm:max-w-[120px] md:max-w-[150px] lg:max-w-[180px]">
                              {userDisplayName}
                            </div>
                            <div className="text-xs opacity-75 capitalize">
                              {currentUser.role}
                            </div>
                          </div>
                        </div>
                      </button>

                      {/* Dropdown Menu */}
                      {showUserMenu && (
                        <div className="user-menu-dropdown absolute right-0 mt-2 w-56 sm:w-64 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
                          <div className="px-4 py-3 border-b border-gray-100">
                            <p className="text-sm font-semibold text-gray-800 truncate">
                              {userDisplayName}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                              {currentUser.email}
                            </p>
                          </div>
                          
                          <div className="py-1">
                            <button
                              onClick={() => {
                                console.log('Profile clicked');
                                setShowUserMenu(false);
                              }}
                              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors flex items-center gap-2"
                            >
                              <User className="w-4 h-4" />
                              My Profile
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Logout Button */}
                    <button
                      onClick={handleSignOut}
                      disabled={isLoggingOut}
                      className="flex items-center gap-1 sm:gap-1.5 md:gap-2 px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 text-red-600 hover:bg-red-50 rounded-lg smooth-transition border border-red-200 hover:border-red-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Sign Out"
                      aria-label="Sign out"
                    >
                      <LogOut className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                      <span className="text-xs sm:text-sm md:text-base font-medium hidden md:block">
                        {isLoggingOut ? 'Logging out...' : 'Logout'}
                      </span>
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <div className="text-xs sm:text-sm text-gray-500">
                    {/* Guest User - Can be enabled if needed */}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ═══════════════════════════════════════════════════════════
              STATUS BAR - Enhanced
          ═══════════════════════════════════════════════════════════ */}
          {isAuthenticated && currentUser && (
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 border-t px-3 sm:px-4 md:px-6 py-2 sm:py-2.5 status-bar-compact">
              <div className="flex flex-col xs:flex-row items-start xs:items-center justify-between gap-2 xs:gap-0 text-xs sm:text-sm text-gray-600">
                
                {/* Left Side Info */}
                <div className="flex items-center gap-2 sm:gap-3 md:gap-4 flex-wrap">
                  <span className="truncate max-w-[200px] sm:max-w-none font-medium">
                    Welcome back, <span className="text-gray-800">{userDisplayName}</span>
                  </span>
                  
                  <span className="hidden sm:inline text-gray-400">•</span>
                  
                  <span className="hidden md:inline text-gray-500">
                    {formattedDate}
                  </span>
                  
                  <span className="hidden sm:inline text-gray-400">•</span>
                  
                  <span className="flex items-center gap-1.5">
                    <Wifi className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-green-500" />
                    <span className="hidden sm:inline text-green-600 font-medium">Online</span>
                  </span>
                </div>

                {/* Right Side - Live Clock */}
                <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500">
                  <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  <span className="font-mono font-medium">
                    {formattedTime}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>
    </>
  );
});

DomainHeader.displayName = 'DomainHeader';

console.log('✅ DomainHeader - PRODUCTION v8.0 FINAL - ALL ISSUES FIXED + FULLY RESPONSIVE + OPTIMIZED');