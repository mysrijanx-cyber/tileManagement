// import React from 'react';
// import { Building2, User, Store, Shield, Heart, LogOut, Globe } from 'lucide-react';
// import { useAppStore } from '../stores/appStore';
// import { signOut } from '../lib/firebaseutils';
// import { getCurrentDomainConfig } from '../utils/domainUtils';

// export const DomainHeader: React.FC = () => {
//   const { currentShowroom, currentUser, isAuthenticated, setCurrentUser, setIsAuthenticated } = useAppStore();
//   const domainConfig = getCurrentDomainConfig();

//   const handleSignOut = async () => {
//     try {
//       await signOut();
//       setCurrentUser(null);
//       setIsAuthenticated(false);
//       // Redirect to customer domain after logout
//       window.location.href = '/';
//     } catch (error) {
//       console.error('Error signing out:', error);
//     }
//   };

//   const getDomainIcon = () => {
//     switch (domainConfig.userType) {
//       case 'admin': return <Shield className="w-8 h-8" style={{ color: domainConfig.theme.primary }} />;
//       case 'seller': return <Store className="w-8 h-8" style={{ color: domainConfig.theme.primary }} />;
//       default: return <Building2 className="w-8 h-8" style={{ color: domainConfig.theme.primary }} />;
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

//   const getDomainTitle = () => {
//     switch (domainConfig.userType) {
//       case 'admin': return 'Admin Panel';
//       case 'seller': return 'Seller Dashboard';
//       default: return currentShowroom?.name || 'Tile Showroom 3D';
//     }
//   };

//   const getDomainSubtitle = () => {
//     switch (domainConfig.userType) {
//       case 'admin': return 'Platform Management';
//       case 'seller': return 'Manage Your Tiles';
//       default: return 'Virtual Tile Visualization';
//     }
//   };

//   return (
//     <header className="bg-white shadow-lg border-b" style={{ borderColor: domainConfig.theme.primary + '20' }}>
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex items-center justify-between h-16">
//           <div className="flex items-center gap-4">
//             {getDomainIcon()}
//             <div>
//               <h1 className="text-xl font-bold text-gray-800">
//                 {getDomainTitle()}
//               </h1>
//               <p className="text-sm text-gray-600">{getDomainSubtitle()}</p>
//             </div>
            
//             {/* Domain indicator */}
//             <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium" 
//                  style={{ backgroundColor: domainConfig.theme.primary + '20', color: domainConfig.theme.primary }}>
//               <Globe className="w-3 h-3" />
//               {domainConfig.userType.toUpperCase()} PORTAL
//             </div>
//           </div>

//           <div className="flex items-center gap-4">
//             {isAuthenticated && currentUser ? (
//               <div className="flex items-center gap-3">
//                 <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${getRoleColor()}`}>
//                   {getRoleIcon()}
//                   <span className="text-sm font-medium capitalize">
//                     {currentUser.role}
//                   </span>
//                 </div>
//                 <span className="text-sm text-gray-600">
//                   {currentUser.full_name || currentUser.email}
//                 </span>
//                 <button
//                   onClick={handleSignOut}
//                   className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
//                 >
//                   <LogOut className="w-4 h-4" />
//                 </button>
//               </div>
//             ) : (
//               <div className="flex items-center gap-2">
//                 <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg">
//                   <User className="w-4 h-4" />
//                   <span className="text-sm font-medium">Guest</span>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </header>
//   );
// };
import React from 'react';
import { Building2, User, Store, Shield, Globe, LogOut, Settings, Bell } from 'lucide-react';
import { useAppStore } from '../stores/appStore';
import { signOut } from '../lib/firebaseutils';
import { getCurrentDomainConfig } from '../utils/domainUtils';

export const DomainHeader: React.FC = () => {
  const { currentShowroom, currentUser, isAuthenticated, setCurrentUser, setIsAuthenticated } = useAppStore();
  const domainConfig = getCurrentDomainConfig();

  const handleSignOut = async () => {
    const confirmed = window.confirm('Are you sure you want to logout?');
    if (!confirmed) return;

    try {
      console.log('🚪 Logging out user:', currentUser?.email);
      await signOut();
      setCurrentUser(null);
      setIsAuthenticated(false);
      
      // Clear any stored auth data
      localStorage.removeItem('user');
      localStorage.removeItem('isAuthenticated');
      
      console.log('✅ Logout successful');
      window.location.href = '/';
    } catch (error) {
      console.error('❌ Error signing out:', error);
      alert('Logout failed. Please try again.');
    }
  };

  const getDomainIcon = () => {
    switch (domainConfig.userType) {
      case 'admin': return <Shield className="w-8 h-8" style={{ color: domainConfig.theme.primary }} />;
      case 'seller': return <Store className="w-8 h-8" style={{ color: domainConfig.theme.primary }} />;
      default: return <Building2 className="w-8 h-8" style={{ color: domainConfig.theme.primary }} />;
    }
  };

  const getRoleIcon = () => {
    if (!currentUser) return <User className="w-4 h-4" />;
    switch (currentUser.role) {
      case 'admin': return <Shield className="w-4 h-4 text-red-600" />;
      case 'seller': return <Store className="w-4 h-4 text-green-600" />;
      default: return <User className="w-4 h-4 text-blue-600" />;
    }
  };

  const getRoleColor = () => {
    if (!currentUser) return 'bg-gray-100 text-gray-700';
    switch (currentUser.role) {
      case 'admin': return 'bg-red-100 text-red-700 border-red-200';
      case 'seller': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-blue-100 text-blue-700 border-blue-200';
    }
  };

  const getDomainTitle = () => {
    switch (domainConfig.userType) {
      case 'admin': return 'Admin Panel';
      case 'seller': return 'Seller Dashboard';
      default: return currentShowroom?.name || 'Tile Showroom 3D';
    }
  };

  const getDomainSubtitle = () => {
    switch (domainConfig.userType) {
      case 'admin': return 'Platform Management';
      case 'seller': return 'Manage Your Tiles';
      default: return 'Virtual Tile Visualization';
    }
  };

  return (
    <header className="bg-white shadow-lg border-b sticky top-0 z-50" style={{ borderColor: domainConfig.theme.primary + '20' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left Side - Logo & Title */}
          <div className="flex items-center gap-4">
            {getDomainIcon()}
            <div>
              <h1 className="text-xl font-bold text-gray-800">
                {getDomainTitle()}
              </h1>
              <p className="text-sm text-gray-600">{getDomainSubtitle()}</p>
            </div>
            
            {/* Domain indicator */}
            <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium" 
                 style={{ backgroundColor: domainConfig.theme.primary + '20', color: domainConfig.theme.primary }}>
              <Globe className="w-3 h-3" />
              {domainConfig.userType.toUpperCase()} PORTAL
            </div>
          </div>

          {/* Right Side - User Info & Actions */}
          <div className="flex items-center gap-4">
            {isAuthenticated && currentUser ? (
              <>
                {/* User Profile Section */}
                <div className="flex items-center gap-3">
                  {/* User Avatar */}
                  <div className={`flex items-center gap-3 px-4 py-2 rounded-lg border ${getRoleColor()}`}>
                    <div className="flex items-center gap-2">
                      {getRoleIcon()}
                      <div className="text-right">
                        <div className="text-sm font-medium">
                          {currentUser.full_name || currentUser.email?.split('@')[0] || 'User'}
                        </div>
                        <div className="text-xs opacity-75 capitalize">
                          {currentUser.role}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2">
                    {/* Notifications (Admin Only) */}
                    {currentUser.role === 'admin' && (
                      <button
                        onClick={() => console.log('Notifications clicked')}
                        className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors relative"
                        title="Notifications"
                      >
                        <Bell className="w-4 h-4" />
                        {/* Notification Badge */}
                        <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                          !
                        </span>
                      </button>
                    )}

                    {/* Settings */}
                    <button
                      onClick={() => console.log('Settings clicked')}
                      className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
                      title="Settings"
                    >
                      <Settings className="w-4 h-4" />
                    </button>

                    {/* Logout Button */}
                    <button
                      onClick={handleSignOut}
                      className="flex items-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-red-200 hover:border-red-300"
                      title="Sign Out"
                    >
                      <LogOut className="w-4 h-4" />
                      <span className="text-sm font-medium hidden sm:block">Logout</span>
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg">
                  <User className="w-4 h-4" />
                  <span className="text-sm font-medium">Guest User</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Status Bar (Optional) */}
        {isAuthenticated && currentUser && (
          <div className="bg-gray-50 border-t px-4 py-2">
            <div className="flex items-center justify-between text-xs text-gray-600">
              <div className="flex items-center gap-4">
                <span>Welcome back, {currentUser.full_name || 'User'}</span>
                <span>•</span>
                <span>Last login: {new Date().toLocaleDateString()}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  Online
                </span>
              </div>
              <div className="text-xs text-gray-500">
                {new Date().toLocaleTimeString()}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};