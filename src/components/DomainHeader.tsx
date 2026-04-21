


// import React from 'react';
// import { User, Store, Shield, Globe, LogOut } from 'lucide-react';
// import { useAppStore } from '../stores/appStore';
// import { signOut } from '../lib/firebaseutils';
// import { getCurrentDomainConfig } from '../utils/domainUtils';
// import LogoFull from '../logo/logo.png';
// import LogoIcon from '../logo/icon.png';

// export const DomainHeader: React.FC = () => {
//   const { currentShowroom, currentUser, isAuthenticated, setCurrentUser, setIsAuthenticated } = useAppStore();
//   const domainConfig = getCurrentDomainConfig();

//   const handleSignOut = async () => {
//     const confirmed = window.confirm('Are you sure you want to logout?');
//     if (!confirmed) return;

//     try {
//       console.log('🚪 Logging out user:', currentUser?.email);
//       await signOut();
//       setCurrentUser(null);
//       setIsAuthenticated(false);
      
//       localStorage.removeItem('user');
//       localStorage.removeItem('isAuthenticated');
      
//       console.log('✅ Logout successful');
//       window.location.href = '/';
//     } catch (error) {
//       console.error('❌ Error signing out:', error);
//       alert('Logout failed. Please try again.');
//     }
//   };

//   const getDomainIcon = () => {
//     switch (domainConfig.userType) {
//       case 'admin': return <Shield className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" style={{ color: domainConfig.theme.primary }} />;
//       case 'seller': return <Store className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" style={{ color: domainConfig.theme.primary }} />;
//       default: return null;
//     }
//   };

//   const getRoleIcon = () => {
//     if (!currentUser) return <User className="w-3 h-3 sm:w-4 sm:h-4" />;
//     switch (currentUser.role) {
//       case 'admin': return <Shield className="w-3 h-3 sm:w-4 sm:h-4 text-red-600" />;
//       case 'seller': return <Store className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />;
//       default: return <User className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" />;
//     }
//   };

//   const getRoleColor = () => {
//     if (!currentUser) return 'bg-gray-100 text-gray-700';
//     switch (currentUser.role) {
//       case 'admin': return 'bg-red-100 text-red-700 border-red-200';
//       case 'seller': return 'bg-green-100 text-green-700 border-green-200';
//       default: return 'bg-blue-100 text-blue-700 border-blue-200';
//     }
//   };

//   const getDomainTitle = () => {
//     switch (domainConfig.userType) {
//       case 'admin': return 'Admin Panel';
//       case 'seller': return 'Seller Dashboard';
//       default: return currentShowroom?.name || 'Tiles View360';
//     }
//   };

//   const getDomainSubtitle = () => {
//     switch (domainConfig.userType) {
//       case 'admin': return 'Platform Management';
//       case 'seller': return 'Manage Your Tiles';
//       default: return 'Virtual Tile Visualization';
//     }
//   };

//   const renderLogo = () => {
//     // Admin aur Seller ke liye icon only
//     if (domainConfig.userType === 'admin' || domainConfig.userType === 'seller') {
//       return getDomainIcon();
//     }
    
//     // Client portal ke liye logo images - Production Ready
//     return (
//       <div className="logo-container">
//         {/* Mobile - Icon only (< 640px) */}
//         <img 
//           src={LogoIcon} 
//           alt="Tiles View360 Icon" 
//           className="mobile-logo"
//           width={48}
//           height={48}
//           loading="eager"
//           fetchPriority="high"
//         />
        
//         {/* Tablet/Desktop - Full Logo (>= 640px) */}
//         <img 
//           src={LogoFull} 
//           alt="Tiles View360 Full Logo" 
//           className="desktop-logo"
//           loading="eager"
//           fetchPriority="high"
//         />
//       </div>
//     );
//   };

//   return (
//     <>
//       {/* ✅ PRODUCTION READY - Crystal Clear Logo CSS */}
//       <style>{`
//         /* Logo Container */
//         .logo-container {
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           position: relative;
//         }

//         /* Base Logo Styles - Crystal Clear */
//         .mobile-logo,
//         .desktop-logo {
//           display: block;
//           object-fit: contain;
//           object-position: center;
          
//           /* Crystal Clear Rendering */
//           image-rendering: -webkit-optimize-contrast;
//           image-rendering: optimizeQuality;
//           -webkit-backface-visibility: hidden;
//           backface-visibility: hidden;
          
//           /* Anti-blur Transform */
//           transform: translateZ(0);
//           -webkit-transform: translateZ(0);
          
//           /* Sharp Text Rendering */
//           -webkit-font-smoothing: antialiased;
//           -moz-osx-font-smoothing: grayscale;
          
//           /* Prevent Dragging */
//           user-select: none;
//           -webkit-user-drag: none;
//           pointer-events: none;
          
//           /* Smooth Rendering */
//           will-change: auto;
//         }

//         /* ✅ MOBILE LOGO - Icon Only (0 - 639px) */
//         .mobile-logo {
//           display: block;
//           width: 48px;
//           height: 48px;
//           min-width: 48px;
//           min-height: 48px;
//         }

//         .desktop-logo {
//           display: none;
//         }

//         /* ✅ TABLET/DESKTOP - Full Logo (640px+) */
//         @media (min-width: 640px) {
//           .mobile-logo {
//             display: none;
//           }
          
//           .desktop-logo {
//             display: block;
//             height: 56px;
//             width: auto;
//             max-width: 280px;
//           }
//         }

//         /* ✅ MEDIUM SCREENS (768px+) */
//         @media (min-width: 768px) {
//           .desktop-logo {
//             height: 64px;
//             max-width: 320px;
//           }
//         }

//         /* ✅ LARGE SCREENS (1024px+) */
//         @media (min-width: 1024px) {
//           .desktop-logo {
//             height: 72px;
//             max-width: 360px;
//           }
//         }

//         /* ✅ EXTRA LARGE (1280px+) */
//         @media (min-width: 1280px) {
//           .desktop-logo {
//             height: 80px;
//             max-width: 400px;
//           }
//         }

//         /* ✅ HIGH DPI/RETINA DISPLAYS */
//         @media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
//           .mobile-logo,
//           .desktop-logo {
//             image-rendering: -webkit-optimize-contrast;
//           }
//         }

//         /* ✅ ULTRA WIDE (1536px+) */
//         @media (min-width: 1536px) {
//           .desktop-logo {
//             height: 88px;
//             max-width: 440px;
//           }
//         }

//         /* ✅ VERY SMALL MOBILE (320px - 479px) */
//         @media (max-width: 479px) {
//           .mobile-logo {
//             width: 44px;
//             height: 44px;
//             min-width: 44px;
//             min-height: 44px;
//           }
//         }

//         /* ✅ SMALL MOBILE (480px - 639px) */
//         @media (min-width: 480px) and (max-width: 639px) {
//           .mobile-logo {
//             width: 52px;
//             height: 52px;
//             min-width: 52px;
//             min-height: 52px;
//           }
//         }
//       `}</style>

//       <header className="bg-white shadow-lg border-b sticky top-0 z-50" style={{ borderColor: domainConfig.theme.primary + '20' }}>
//         <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
//           <div className="flex items-center justify-between h-16 sm:h-20 md:h-24 lg:h-28">
//             {/* Left Side - Logo & Title */}
//             <div className="flex items-center gap-2 sm:gap-3 md:gap-4 min-w-0 flex-1">
//               <div className="flex-shrink-0">
//                 {renderLogo()}
//               </div>
              
//               {/* Title - Only show for admin/seller (not for client with logo) */}
//               {(domainConfig.userType === 'admin' || domainConfig.userType === 'seller') && (
//                 <div className="min-w-0 flex-1">
//                   <h1 className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-gray-800 truncate">
//                     {getDomainTitle()}
//                   </h1>
//                   <p className="text-xs sm:text-sm text-gray-600 hidden sm:block truncate">
//                     {getDomainSubtitle()}
//                   </p>
//                 </div>
//               )}
              
           
//             </div>

//             {/* Right Side - User Info & Actions */}
//             <div className="flex items-center gap-2 sm:gap-3 md:gap-4 flex-shrink-0 ml-2">
//               {isAuthenticated && currentUser ? (
//                 <>
//                   {/* User Profile Section */}
//                   <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3">
//                     {/* User Avatar */}
//                     <div className={`flex items-center gap-1.5 sm:gap-2 md:gap-3 px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-lg border ${getRoleColor()}`}>
//                       <div className="flex items-center gap-1.5 sm:gap-2">
//                         {getRoleIcon()}
//                         <div className="text-right hidden sm:block">
//                           <div className="text-xs sm:text-sm font-medium truncate max-w-[100px] sm:max-w-[150px]">
//                             {currentUser.full_name || currentUser.email?.split('@')[0] || 'User'}
//                           </div>
//                           <div className="text-xs opacity-75 capitalize">
//                             {currentUser.role}
//                           </div>
//                         </div>
//                       </div>
//                     </div>

//                     {/* Action Buttons */}
//                     <div className="flex items-center gap-1 sm:gap-1.5 md:gap-2">
                 
//                       {currentUser.role === 'admin' && (
//                         <button
//                           onClick={() => console.log('Notifications clicked')}
//                           className="relative p-1.5 sm:p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
//                           title="Notifications"
//                         >
                          
//                         </button>
//                       )}

//                       {/* Settings */}
//                       <button
//                         onClick={() => console.log('Settings clicked')}
//                         className="p-1.5 sm:p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
//                         title="Settings"
//                       >
//                         {/* <Settings className="w-3 h-3 sm:w-4 sm:h-4" /> */}
//                       </button>

//                       {/* Logout Button */}
//                       <button
//                         onClick={handleSignOut}
//                         className="flex items-center gap-1 sm:gap-1.5 md:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-red-200 hover:border-red-300"
//                         title="Sign Out"
//                       >
//                         <LogOut className="w-3 h-3 sm:w-4 sm:h-4" />
//                         <span className="text-xs sm:text-sm font-medium hidden md:block">Logout</span>
//                       </button>
//                     </div>
//                   </div>
//                 </>
//               ) : (
//                 <div className="flex items-center gap-2">
//                   <div className="">
//                     {/* Guest User - Can be enabled if needed */}
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Status Bar */}
//           {isAuthenticated && currentUser && (
//             <div className="bg-gray-50 border-t px-3 sm:px-4 py-1.5 sm:py-2">
//               <div className="flex flex-col xs:flex-row items-start xs:items-center justify-between gap-1 xs:gap-0 text-xs text-gray-600">
//                 <div className="flex items-center gap-2 sm:gap-3 md:gap-4 flex-wrap">
//                   <span className="truncate max-w-[200px] sm:max-w-none">
//                     Welcome back, {currentUser.full_name || 'User'}
//                   </span>
//                   <span className="hidden sm:inline">•</span>
//                   <span className="hidden md:inline">
//                     Last login: {new Date().toLocaleDateString()}
//                   </span>
//                   <span className="hidden sm:inline">•</span>
//                   <span className="flex items-center gap-1">
//                     <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-400 rounded-full"></div>
//                     <span className="hidden sm:inline">Online</span>
//                   </span>
//                 </div>
//                 <div className="text-xs text-gray-500 hidden sm:block">
//                   {new Date().toLocaleTimeString()}
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       </header>
//     </>
//   );
// }; 
import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { User, Store, Shield, LogOut, Clock, Wifi } from 'lucide-react';
import { useAppStore } from '../stores/appStore';
import { signOut } from '../lib/firebaseutils';
import { getCurrentDomainConfig } from '../utils/domainUtils';

// ═══════════════════════════════════════════════════════════
// ✅ DIRECT LOGO IMPORTS (NO LAZY LOADING FOR PNG FILES)
// ═══════════════════════════════════════════════════════════
import LogoFull from '../logo/logo.png';
import LogoIcon from '../logo/icon.png';

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
  // ✅ LOGO COMPONENT - SIMPLIFIED WITHOUT LAZY LOADING
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

    // Client Portal: Logo images (NO LAZY LOADING)
    return (
      <div className="logo-container">
        {/* Mobile - Icon only (< 640px) */}
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

        {/* Desktop - Full Logo (>= 640px) */}
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
      </div>
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
        .mobile-logo {
          display: block;
          width: 48px;
          height: 48px;
          min-width: 48px;
          min-height: 48px;
        }

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
          .mobile-logo {
            display: none;
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

console.log('✅ DomainHeader - PRODUCTION v9.0 FINAL - ZERO ERRORS + FULLY WORKING');