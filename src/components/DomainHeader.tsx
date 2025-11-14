

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
      case 'admin': return <Shield className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" style={{ color: domainConfig.theme.primary }} />;
      case 'seller': return <Store className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" style={{ color: domainConfig.theme.primary }} />;
      default: return <Building2 className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" style={{ color: domainConfig.theme.primary }} />;
    }
  };

  const getRoleIcon = () => {
    if (!currentUser) return <User className="w-3 h-3 sm:w-4 sm:h-4" />;
    switch (currentUser.role) {
      case 'admin': return <Shield className="w-3 h-3 sm:w-4 sm:h-4 text-red-600" />;
      case 'seller': return <Store className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />;
      default: return <User className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" />;
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
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16 md:h-16">
          {/* Left Side - Logo & Title */}
          <div className="flex items-center gap-2 sm:gap-3 md:gap-4 min-w-0 flex-1">
            <div className="flex-shrink-0">
              {getDomainIcon()}
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-gray-800 truncate">
                {getDomainTitle()}
              </h1>
              <p className="text-xs sm:text-sm text-gray-600 hidden sm:block truncate">{getDomainSubtitle()}</p>
            </div>
            
            {/* Domain indicator */}
            <div className="hidden md:flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1 rounded-full text-xs font-medium flex-shrink-0" 
                 style={{ backgroundColor: domainConfig.theme.primary + '20', color: domainConfig.theme.primary }}>
              <Globe className="w-3 h-3" />
              <span className="hidden lg:inline">{domainConfig.userType.toUpperCase()} PORTAL</span>
              <span className="lg:hidden">{domainConfig.userType.toUpperCase()}</span>
            </div>
          </div>

          {/* Right Side - User Info & Actions */}
          <div className="flex items-center gap-2 sm:gap-3 md:gap-4 flex-shrink-0 ml-2">
            {isAuthenticated && currentUser ? (
              <>
                {/* User Profile Section */}
                <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3">
                  {/* User Avatar */}
                  <div className={`flex items-center gap-1.5 sm:gap-2 md:gap-3 px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-lg border ${getRoleColor()}`}>
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      {getRoleIcon()}
                      <div className="text-right hidden sm:block">
                        <div className="text-xs sm:text-sm font-medium truncate max-w-[100px] sm:max-w-[150px]">
                          {currentUser.full_name || currentUser.email?.split('@')[0] || 'User'}
                        </div>
                        <div className="text-xs opacity-75 capitalize">
                          {currentUser.role}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-1 sm:gap-1.5 md:gap-2">
                    {/* Notifications (Admin Only) */}
                    {currentUser.role === 'admin' && (
                      <button
                        onClick={() => console.log('Notifications clicked')}
                        className=""
                        title="Notifications"
                      >
                        {/* <Bell className="w-3 h-3 sm:w-4 sm:h-4" /> */}
                        {/* Notification Badge */}
                        <span className="absolute -top-0.5 sm:-top-1 -right-0.5 sm:-right-1 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                          !
                        </span>
                      </button>
                    )}

                    {/* Settings */}
                    <button
                      onClick={() => console.log('Settings clicked')}
                      className="p-1.5 sm:p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
                      title="Settings"
                    >
                      {/* <Settings className="w-3 h-3 sm:w-4 sm:h-4" /> */}
                    </button>

                    {/* Logout Button */}
                    <button
                      onClick={handleSignOut}
                      className="flex items-center gap-1 sm:gap-1.5 md:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-red-200 hover:border-red-300"
                      title="Sign Out"
                    >
                      <LogOut className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="text-xs sm:text-sm font-medium hidden md:block">Logout</span>
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <div className="">
                  {/* <User className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="text-xs sm:text-sm font-medium hidden sm:inline">Guest User</span>
                  <span className="text-xs sm:text-sm font-medium sm:hidden">Guest</span> */}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Status Bar (Optional) */}
        {isAuthenticated && currentUser && (
          <div className="bg-gray-50 border-t px-3 sm:px-4 py-1.5 sm:py-2">
            <div className="flex flex-col xs:flex-row items-start xs:items-center justify-between gap-1 xs:gap-0 text-xs text-gray-600">
              <div className="flex items-center gap-2 sm:gap-3 md:gap-4 flex-wrap">
                <span className="truncate max-w-[200px] sm:max-w-none">Welcome back, {currentUser.full_name || 'User'}</span>
                <span className="hidden sm:inline">•</span>
                <span className="hidden md:inline">Last login: {new Date().toLocaleDateString()}</span>
                <span className="hidden sm:inline">•</span>
                <span className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-400 rounded-full"></div>
                  <span className="hidden sm:inline">Online</span>
                </span>
              </div>
              <div className="text-xs text-gray-500 hidden sm:block">
                {new Date().toLocaleTimeString()}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};