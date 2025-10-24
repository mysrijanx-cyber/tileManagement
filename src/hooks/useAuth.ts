

// import { useState, useEffect, useCallback, useRef } from 'react';
// import { jwtService } from '../lib/jwtService';
// import { getCurrentUser as getFirebaseUser, signOut as firebaseSignOut } from '../lib/firebaseutils';
// import { useAppStore } from '../stores/appStore';

// interface AuthState {
//   isAuthenticated: boolean;
//   isLoading: boolean;
//   user: any | null;
//   error: string | null;
//   isRefreshing: boolean;
// }

// interface SecurityConfig {
//   enableActivityTracking: boolean;
//   enableSessionWarnings: boolean;
//   autoLogoutDelay: number;
// }

// const DEFAULT_SECURITY_CONFIG: SecurityConfig = {
//   enableActivityTracking: true,
//   enableSessionWarnings: true,
//   autoLogoutDelay: 30 * 60 * 1000, // 30 minutes
// };

// const ROLE_PERMISSIONS = {
//   admin: ['*'],
//   seller: ['manage_tiles', 'view_analytics', 'manage_profile'],
//   customer: ['view_tiles', 'manage_favorites']
// } as const;

// export const useAuth = (securityOptions: Partial<SecurityConfig> = {}) => {
//   const { setCurrentUser, setIsAuthenticated } = useAppStore();
//   const [authState, setAuthState] = useState<AuthState>({
//     isAuthenticated: false,
//     isLoading: true,
//     user: null,
//     error: null,
//     isRefreshing: false
//   });

//   const securityConfig = { ...DEFAULT_SECURITY_CONFIG, ...securityOptions };
//   const refreshIntervalRef = useRef<NodeJS.Timeout>();
//   const activityTimeoutRef = useRef<NodeJS.Timeout>();
  
//   // ✅ NEW: Prevent multiple simultaneous initializations
//   const initializingRef = useRef<boolean>(false);

//   // ✅ Enhanced user validation
//   const validateUser = useCallback((user: any): boolean => {
//     if (!user) {
//       console.warn('🔒 User validation failed: No user object');
//       return false;
//     }

//     const requiredFields = ['user_id', 'email', 'role'];
//     for (const field of requiredFields) {
//       if (!user[field]) {
//         console.warn(`🔒 User validation failed: Missing ${field}`);
//         return false;
//       }
//     }

//     const validRoles = ['admin', 'seller', 'customer'];
//     if (!validRoles.includes(user.role)) {
//       console.warn('🔒 User validation failed: Invalid role', user.role);
//       return false;
//     }

//     return true;
//   }, []);

//   // ✅ Security logging
//   const logSecurityEvent = useCallback((event: string, details: any = {}) => {
//     const logEntry = {
//       timestamp: new Date().toISOString(),
//       event,
//       userId: authState.user?.user_id || 'anonymous',
//       ...details
//     };

//     console.log(`🔐 Security Event: ${event}`, logEntry);
    
//     if (import.meta.env.PROD) {
//       // Send to monitoring service in production
//     }
//   }, [authState.user]);

//   // ✅ Update user activity
//   const updateActivity = useCallback(() => {
//     if (!securityConfig.enableActivityTracking || !authState.isAuthenticated) return;

//     if (activityTimeoutRef.current) {
//       clearTimeout(activityTimeoutRef.current);
//     }

//     activityTimeoutRef.current = setTimeout(() => {
//       logSecurityEvent('session_timeout_inactivity');
//       logout();
//     }, securityConfig.autoLogoutDelay);
//   }, [authState.isAuthenticated, securityConfig]);

//   // ✅ FIXED: Initialize authentication with guard
//   const initializeAuth = useCallback(async () => {
//     // ✅ Prevent multiple simultaneous calls
//     if (initializingRef.current) {
//       console.log('⏳ Auth initialization already in progress, skipping...');
//       return;
//     }

//     try {
//       initializingRef.current = true;
//       console.log('🔐 Initializing authentication system...');
      
//       setAuthState(prev => ({ ...prev, isLoading: true, error: null }));

//       const token = jwtService.getAccessToken();
//       if (!token) {
//         console.log('🔒 No authentication token found');
//         setCurrentUser(null);
//         setIsAuthenticated(false);
//         setAuthState({
//           isAuthenticated: false,
//           isLoading: false,
//           user: null,
//           error: null,
//           isRefreshing: false
//         });
//         return;
//       }

//       // Validate token format first
//       if (!jwtService.isValidTokenFormat(token)) {
//         console.log('🔒 Invalid token format, clearing storage');
//         jwtService.clearTokens();
//         setCurrentUser(null);
//         setIsAuthenticated(false);
//         setAuthState({
//           isAuthenticated: false,
//           isLoading: false,
//           user: null,
//           error: 'Invalid authentication token',
//           isRefreshing: false
//         });
//         return;
//       }

//       // Verify and decode token
//       const tokenPayload = jwtService.verifyToken(token);
//       if (!tokenPayload) {
//         console.log('🔒 Token verification failed, clearing storage');
//         jwtService.clearTokens();
//         logSecurityEvent('invalid_token_detected');
//         setCurrentUser(null);
//         setIsAuthenticated(false);
//         setAuthState({
//           isAuthenticated: false,
//           isLoading: false,
//           user: null,
//           error: 'Authentication session expired',
//           isRefreshing: false
//         });
//         return;
//       }

//       // Check if token needs refresh
//       if (jwtService.needsRefresh(token)) {
//         console.log('🔄 Token needs refresh, attempting refresh...');
//         await refreshAuthToken();
//         return;
//       }

//       // Get and validate user data
//       let userData: any = tokenPayload;
//       try {
//         const firebaseUser = await getFirebaseUser();
//         if (firebaseUser && validateUser(firebaseUser)) {
//           userData = firebaseUser;
//         }
//       } catch (firebaseError) {
//         console.warn('⚠️ Firebase user fetch failed, using token data:', firebaseError);
//       }

//       if (!validateUser(userData)) {
//         console.log('🔒 User validation failed');
//         jwtService.clearTokens();
//         logSecurityEvent('user_validation_failed', { user: userData });
//         setCurrentUser(null);
//         setIsAuthenticated(false);
//         setAuthState({
//           isAuthenticated: false,
//           isLoading: false,
//           user: null,
//           error: 'User validation failed',
//           isRefreshing: false
//         });
//         return;
//       }

//       // Update application state
//       setCurrentUser(userData);
//       setIsAuthenticated(true);
//       setAuthState({
//         isAuthenticated: true,
//         isLoading: false,
//         user: userData,
//         error: null,
//         isRefreshing: false
//       });

//       updateActivity();
//       logSecurityEvent('authentication_initialized', { userId: userData.user_id });
//       console.log('✅ Authentication initialized successfully');

//     } catch (error: any) {
//       console.error('❌ Authentication initialization failed:', error);
//       logSecurityEvent('auth_initialization_failed', { error: error.message });
      
//       setCurrentUser(null);
//       setIsAuthenticated(false);
//       setAuthState({
//         isAuthenticated: false,
//         isLoading: false,
//         user: null,
//         error: error.message || 'Authentication initialization failed',
//         isRefreshing: false
//       });
//     } finally {
//       initializingRef.current = false;
//     }
//   }, [setCurrentUser, setIsAuthenticated, validateUser, logSecurityEvent, updateActivity]);

//   // ✅ Refresh authentication token
//   const refreshAuthToken = useCallback(async () => {
//     try {
//       console.log('🔄 Refreshing authentication token...');
      
//       setAuthState(prev => ({ ...prev, isRefreshing: true }));

//       const refreshToken = jwtService.getRefreshToken();
//       if (!refreshToken) {
//         throw new Error('No refresh token available');
//       }

//       const refreshPayload = jwtService.verifyToken(refreshToken);
//       if (!refreshPayload) {
//         throw new Error('Invalid refresh token');
//       }

//       let userData: any = refreshPayload;
//       try {
//         const firebaseUser = await getFirebaseUser();
//         if (firebaseUser && validateUser(firebaseUser)) {
//           userData = firebaseUser;
//         }
//       } catch (firebaseError) {
//         console.warn('⚠️ Firebase refresh failed, using token data:', firebaseError);
//       }

//       if (!validateUser(userData)) {
//         throw new Error('User validation failed during refresh');
//       }

//       const tokens = jwtService.generateTokens({
//         user_id: userData.user_id,
//         email: userData.email,
//         role: userData.role,
//         business_id: userData.business_id,
//         permissions: userData.permissions || ROLE_PERMISSIONS[userData.role as keyof typeof ROLE_PERMISSIONS] || []
//       });

//       jwtService.storeTokens(tokens);

//       setCurrentUser(userData);
//       setIsAuthenticated(true);
//       setAuthState({
//         isAuthenticated: true,
//         isLoading: false,
//         user: userData,
//         error: null,
//         isRefreshing: false
//       });

//       updateActivity();
//       logSecurityEvent('token_refreshed', { userId: userData.user_id });
//       console.log('✅ Token refreshed successfully');

//     } catch (error: any) {
//       console.error('❌ Token refresh failed:', error);
//       logSecurityEvent('token_refresh_failed', { error: error.message });
//       await logout();
//     }
//   }, [setCurrentUser, setIsAuthenticated, validateUser, logSecurityEvent, updateActivity]);

//   // ✅ Enhanced login
//   const login = useCallback(async (email: string, password: string) => {
//     try {
//       setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
      
//       console.log('🔐 Attempting login for:', email);
//       logSecurityEvent('login_attempt', { email });

//       const { signIn } = await import('../lib/firebaseutils');
      
//       const firebaseResult = await signIn(email, password);
//       if (!firebaseResult?.user) {
//         throw new Error('Firebase authentication failed');
//       }

//       const userProfile = await getFirebaseUser();
//       if (!userProfile || !validateUser(userProfile)) {
//         throw new Error('User profile validation failed');
//       }

//       const tokens = jwtService.generateTokens({
//         user_id: userProfile.user_id,
//         email: userProfile.email,
//         role: userProfile.role,
//         business_id: userProfile.business_id,
//         permissions: userProfile.permissions || ROLE_PERMISSIONS[userProfile.role as keyof typeof ROLE_PERMISSIONS] || []
//       });

//       jwtService.storeTokens(tokens);

//       setCurrentUser(userProfile);
//       setIsAuthenticated(true);
//       setAuthState({
//         isAuthenticated: true,
//         isLoading: false,
//         user: userProfile,
//         error: null,
//         isRefreshing: false
//       });

//       updateActivity();
//       logSecurityEvent('login_success', { 
//         userId: userProfile.user_id, 
//         role: userProfile.role 
//       });
      
//       console.log('✅ Login successful');
//       return userProfile;

//     } catch (error: any) {
//       console.error('❌ Login failed:', error);
//       logSecurityEvent('login_failed', { email, error: error.message });
      
//       setAuthState(prev => ({
//         ...prev,
//         isLoading: false,
//         error: error.message || 'Login failed',
//         isAuthenticated: false,
//         user: null
//       }));
      
//       throw error;
//     }
//   }, [setCurrentUser, setIsAuthenticated, validateUser, logSecurityEvent, updateActivity]);

//   // ✅ Enhanced logout
//   const logout = useCallback(async () => {
//     try {
//       console.log('🔐 useAuth logout initiated...');
//       const userId = authState.user?.user_id;
      
//       console.log('⏰ Clearing timers...');
//       if (refreshIntervalRef.current) {
//         clearInterval(refreshIntervalRef.current);
//         refreshIntervalRef.current = undefined;
//       }
//       if (activityTimeoutRef.current) {
//         clearTimeout(activityTimeoutRef.current);
//         activityTimeoutRef.current = undefined;
//       }

//       console.log('🗑️ Clearing JWT tokens...');
//       jwtService.clearTokens();
      
//       console.log('🧹 Clearing localStorage...');
//       const keysToRemove = [
//         'tile_access_token',
//         'tile_refresh_token',
//         'auth_sync_token',
//         'tile_user_data',
//         'firebase_auth_token'
//       ];
//       keysToRemove.forEach(key => localStorage.removeItem(key));
      
//       console.log('🗑️ Clearing sessionStorage...');
//       sessionStorage.clear();
      
//       console.log('🔥 Calling Firebase signOut...');
//       try {
//         await firebaseSignOut();
//         console.log('✅ Firebase signOut completed');
//       } catch (firebaseError) {
//         console.warn('⚠️ Firebase signOut failed (non-critical):', firebaseError);
//       }
      
//       console.log('📦 Resetting Zustand store...');
//       setCurrentUser(null);
//       setIsAuthenticated(false);
      
//       console.log('🔄 Resetting auth state...');
//       setAuthState({
//         isAuthenticated: false,
//         isLoading: false,
//         user: null,
//         error: null,
//         isRefreshing: false
//       });

//       logSecurityEvent('logout_success', { userId });
//       console.log('✅ Logout completed - all state cleared');

//     } catch (error: any) {
//       console.error('❌ Logout error:', error);
//       logSecurityEvent('logout_failed', { error: error.message });
      
//       console.log('🚨 Error occurred, forcing nuclear cleanup...');
//       try {
//         jwtService.clearTokens();
//         localStorage.clear();
//         sessionStorage.clear();
//         setCurrentUser(null);
//         setIsAuthenticated(false);
//         setAuthState({
//           isAuthenticated: false,
//           isLoading: false,
//           user: null,
//           error: null,
//           isRefreshing: false
//         });
//         console.log('✅ Nuclear cleanup completed');
//       } catch (nuclearError) {
//         console.error('💥 Nuclear cleanup failed:', nuclearError);
//       }
      
//       throw error;
//     }
//   }, [authState.user, setCurrentUser, setIsAuthenticated, logSecurityEvent]);

//   // ✅ Permission checks
//   const hasPermission = useCallback((permission: string): boolean => {
//     return jwtService.hasPermission(permission);
//   }, []);

//   const hasRole = useCallback((roles: string | string[]): boolean => {
//     return jwtService.hasRole(roles);
//   }, []);

//   // ✅ Domain access check
//   const canAccessDomain = useCallback((domainType: string): boolean => {
//     try {
//       const user = jwtService.getCurrentUser();
      
//       if (domainType === 'customer') return true;
//       if (!user) return false;
//       if (user.role === 'admin') return true;
//       if (user.role === 'seller' && domainType === 'seller') return true;
      
//       return false;
//     } catch (error) {
//       console.error('❌ Domain access check failed:', error);
//       return false;
//     }
//   }, []);

//   // ✅ Auto-refresh token setup
//   useEffect(() => {
//     if (authState.isAuthenticated && !authState.isRefreshing) {
//       refreshIntervalRef.current = setInterval(async () => {
//         const token = jwtService.getAccessToken();
//         if (token && jwtService.needsRefresh(token)) {
//           await refreshAuthToken();
//         }
//       }, 2 * 60 * 1000);
//     }

//     return () => {
//       if (refreshIntervalRef.current) {
//         clearInterval(refreshIntervalRef.current);
//       }
//     };
//   }, [authState.isAuthenticated, authState.isRefreshing, refreshAuthToken]);

//   // ✅ Activity tracking setup
//   useEffect(() => {
//     if (!securityConfig.enableActivityTracking) return;

//     const handleActivity = () => updateActivity();
    
//     const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];
//     events.forEach(event => {
//       document.addEventListener(event, handleActivity, { passive: true });
//     });

//     return () => {
//       events.forEach(event => {
//         document.removeEventListener(event, handleActivity);
//       });
//     };
//   }, [updateActivity, securityConfig.enableActivityTracking]);

//   // ✅ FIXED: Initialize on mount only
//   useEffect(() => {
//     console.log('🚀 useAuth hook mounted, initializing...');
//     initializeAuth();
    
//     return () => {
//       console.log('🔌 useAuth hook unmounting, cleanup...');
//       if (refreshIntervalRef.current) {
//         clearInterval(refreshIntervalRef.current);
//         refreshIntervalRef.current = undefined;
//       }
//       if (activityTimeoutRef.current) {
//         clearTimeout(activityTimeoutRef.current);
//         activityTimeoutRef.current = undefined;
//       }
//     };
//   }, []); // ✅ EMPTY - Run only once on mount

//   // ✅ FIXED: Storage change listener (cross-tab sync only)
//   useEffect(() => {
//     const handleStorageChange = (e: StorageEvent) => {
//       // ✅ Only handle changes from OTHER tabs
//       if (e.key === 'tile_access_token' && !e.newValue) {
//         console.log('🔄 Token removed in another tab, logging out...');
        
//         setCurrentUser(null);
//         setIsAuthenticated(false);
//         setAuthState({
//           isAuthenticated: false,
//           isLoading: false,
//           user: null,
//           error: null,
//           isRefreshing: false
//         });
//       }
//     };

//     window.addEventListener('storage', handleStorageChange);
    
//     return () => {
//       window.removeEventListener('storage', handleStorageChange);
//     };
//   }, [setCurrentUser, setIsAuthenticated]);

//   return {
//     isAuthenticated: authState.isAuthenticated,
//     isLoading: authState.isLoading,
//     isRefreshing: authState.isRefreshing,
//     user: authState.user,
//     error: authState.error,
    
//     login,
//     logout,
//     refreshToken: refreshAuthToken,
    
//     hasPermission,
//     hasRole,
//     canAccessDomain,
    
//     getCurrentUser: jwtService.getCurrentUser.bind(jwtService),
//     updateActivity,
//     validateUser
//   };
// };

import { useState, useEffect, useCallback, useRef } from 'react';
import { jwtService } from '../lib/jwtService';
import { getCurrentUser as getFirebaseUser, signOut as firebaseSignOut } from '../lib/firebaseutils';
import { useAppStore } from '../stores/appStore';

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: any | null;
  error: string | null;
  isRefreshing: boolean;
}

interface SecurityConfig {
  enableActivityTracking: boolean;
  enableSessionWarnings: boolean;
  autoLogoutDelay: number;
}

const DEFAULT_SECURITY_CONFIG: SecurityConfig = {
  enableActivityTracking: true,
  enableSessionWarnings: true,
  autoLogoutDelay: 30 * 60 * 1000, // 30 minutes
};

const ROLE_PERMISSIONS = {
  admin: ['*'],
  seller: ['manage_tiles', 'view_analytics', 'manage_profile'],
  customer: ['view_tiles', 'manage_favorites'],
  worker: ['scan_tiles', 'view_tiles'] // ✅ ADDED: Worker permissions
} as const;

export const useAuth = (securityOptions: Partial<SecurityConfig> = {}) => {
  const { setCurrentUser, setIsAuthenticated } = useAppStore();
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    isLoading: true,
    user: null,
    error: null,
    isRefreshing: false
  });

  const securityConfig = { ...DEFAULT_SECURITY_CONFIG, ...securityOptions };
  const refreshIntervalRef = useRef<NodeJS.Timeout>();
  const activityTimeoutRef = useRef<NodeJS.Timeout>();
  
  // ✅ NEW: Prevent multiple simultaneous initializations
  const initializingRef = useRef<boolean>(false);

  // ✅ Enhanced user validation
  const validateUser = useCallback((user: any): boolean => {
    if (!user) {
      console.warn('🔒 User validation failed: No user object');
      return false;
    }

    const requiredFields = ['user_id', 'email', 'role'];
    for (const field of requiredFields) {
      if (!user[field]) {
        console.warn(`🔒 User validation failed: Missing ${field}`);
        return false;
      }
    }

    // ✅ UPDATED: Added worker role validation
    const validRoles = ['admin', 'seller', 'customer', 'worker'];
    if (!validRoles.includes(user.role)) {
      console.warn('🔒 User validation failed: Invalid role', user.role);
      return false;
    }

    return true;
  }, []);

  // ✅ Security logging
  const logSecurityEvent = useCallback((event: string, details: any = {}) => {
    const logEntry = {
      timestamp: new Date().toISOString(),
      event,
      userId: authState.user?.user_id || 'anonymous',
      ...details
    };

    console.log(`🔐 Security Event: ${event}`, logEntry);
    
    if (import.meta.env.PROD) {
      // Send to monitoring service in production
    }
  }, [authState.user]);

  // ✅ Update user activity
  const updateActivity = useCallback(() => {
    if (!securityConfig.enableActivityTracking || !authState.isAuthenticated) return;

    if (activityTimeoutRef.current) {
      clearTimeout(activityTimeoutRef.current);
    }

    activityTimeoutRef.current = setTimeout(() => {
      logSecurityEvent('session_timeout_inactivity');
      logout();
    }, securityConfig.autoLogoutDelay);
  }, [authState.isAuthenticated, securityConfig]);

  // ✅ FIXED: Initialize authentication with guard
  const initializeAuth = useCallback(async () => {
    // ✅ Prevent multiple simultaneous calls
    if (initializingRef.current) {
      console.log('⏳ Auth initialization already in progress, skipping...');
      return;
    }

    try {
      initializingRef.current = true;
      console.log('🔐 Initializing authentication system...');
      
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));

      const token = jwtService.getAccessToken();
      if (!token) {
        console.log('🔒 No authentication token found');
        setCurrentUser(null);
        setIsAuthenticated(false);
        setAuthState({
          isAuthenticated: false,
          isLoading: false,
          user: null,
          error: null,
          isRefreshing: false
        });
        return;
      }

      // Validate token format first
      if (!jwtService.isValidTokenFormat(token)) {
        console.log('🔒 Invalid token format, clearing storage');
        jwtService.clearTokens();
        setCurrentUser(null);
        setIsAuthenticated(false);
        setAuthState({
          isAuthenticated: false,
          isLoading: false,
          user: null,
          error: 'Invalid authentication token',
          isRefreshing: false
        });
        return;
      }

      // Verify and decode token
      const tokenPayload = jwtService.verifyToken(token);
      if (!tokenPayload) {
        console.log('🔒 Token verification failed, clearing storage');
        jwtService.clearTokens();
        logSecurityEvent('invalid_token_detected');
        setCurrentUser(null);
        setIsAuthenticated(false);
        setAuthState({
          isAuthenticated: false,
          isLoading: false,
          user: null,
          error: 'Authentication session expired',
          isRefreshing: false
        });
        return;
      }

      // Check if token needs refresh
      if (jwtService.needsRefresh(token)) {
        console.log('🔄 Token needs refresh, attempting refresh...');
        await refreshAuthToken();
        return;
      }

      // Get and validate user data
      let userData: any = tokenPayload;
      try {
        const firebaseUser = await getFirebaseUser();
        if (firebaseUser && validateUser(firebaseUser)) {
          userData = firebaseUser;
        }
      } catch (firebaseError) {
        console.warn('⚠️ Firebase user fetch failed, using token data:', firebaseError);
      }

      if (!validateUser(userData)) {
        console.log('🔒 User validation failed');
        jwtService.clearTokens();
        logSecurityEvent('user_validation_failed', { user: userData });
        setCurrentUser(null);
        setIsAuthenticated(false);
        setAuthState({
          isAuthenticated: false,
          isLoading: false,
          user: null,
          error: 'User validation failed',
          isRefreshing: false
        });
        return;
      }

      // Update application state
      setCurrentUser(userData);
      setIsAuthenticated(true);
      setAuthState({
        isAuthenticated: true,
        isLoading: false,
        user: userData,
        error: null,
        isRefreshing: false
      });

      updateActivity();
      logSecurityEvent('authentication_initialized', { userId: userData.user_id });
      console.log('✅ Authentication initialized successfully');

    } catch (error: any) {
      console.error('❌ Authentication initialization failed:', error);
      logSecurityEvent('auth_initialization_failed', { error: error.message });
      
      setCurrentUser(null);
      setIsAuthenticated(false);
      setAuthState({
        isAuthenticated: false,
        isLoading: false,
        user: null,
        error: error.message || 'Authentication initialization failed',
        isRefreshing: false
      });
    } finally {
      initializingRef.current = false;
    }
  }, [setCurrentUser, setIsAuthenticated, validateUser, logSecurityEvent, updateActivity]);

  // ✅ Refresh authentication token
  const refreshAuthToken = useCallback(async () => {
    try {
      console.log('🔄 Refreshing authentication token...');
      
      setAuthState(prev => ({ ...prev, isRefreshing: true }));

      const refreshToken = jwtService.getRefreshToken();
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const refreshPayload = jwtService.verifyToken(refreshToken);
      if (!refreshPayload) {
        throw new Error('Invalid refresh token');
      }

      let userData: any = refreshPayload;
      try {
        const firebaseUser = await getFirebaseUser();
        if (firebaseUser && validateUser(firebaseUser)) {
          userData = firebaseUser;
        }
      } catch (firebaseError) {
        console.warn('⚠️ Firebase refresh failed, using token data:', firebaseError);
      }

      if (!validateUser(userData)) {
        throw new Error('User validation failed during refresh');
      }

      const tokens = jwtService.generateTokens({
        user_id: userData.user_id,
        email: userData.email,
        role: userData.role,
        business_id: userData.business_id,
        permissions: userData.permissions || ROLE_PERMISSIONS[userData.role as keyof typeof ROLE_PERMISSIONS] || []
      });

      jwtService.storeTokens(tokens);

      setCurrentUser(userData);
      setIsAuthenticated(true);
      setAuthState({
        isAuthenticated: true,
        isLoading: false,
        user: userData,
        error: null,
        isRefreshing: false
      });

      updateActivity();
      logSecurityEvent('token_refreshed', { userId: userData.user_id });
      console.log('✅ Token refreshed successfully');

    } catch (error: any) {
      console.error('❌ Token refresh failed:', error);
      logSecurityEvent('token_refresh_failed', { error: error.message });
      await logout();
    }
  }, [setCurrentUser, setIsAuthenticated, validateUser, logSecurityEvent, updateActivity]);

  // ✅ Enhanced login
  const login = useCallback(async (email: string, password: string) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
      
      console.log('🔐 Attempting login for:', email);
      logSecurityEvent('login_attempt', { email });

      const { signIn } = await import('../lib/firebaseutils');
      
      const firebaseResult = await signIn(email, password);
      if (!firebaseResult?.user) {
        throw new Error('Firebase authentication failed');
      }

      const userProfile = await getFirebaseUser();
      if (!userProfile || !validateUser(userProfile)) {
        throw new Error('User profile validation failed');
      }

      // ✅ NEW: Check worker status
      if (userProfile.role === 'worker') {
        if (userProfile.is_active === false) {
          throw new Error('Your account has been disabled by the seller. Please contact them.');
        }
        if (userProfile.account_status === 'deleted') {
          throw new Error('Your account has been deactivated. Please contact the seller.');
        }
      }

      const tokens = jwtService.generateTokens({
        user_id: userProfile.user_id,
        email: userProfile.email,
        role: userProfile.role,
        business_id: userProfile.business_id,
        permissions: userProfile.permissions || ROLE_PERMISSIONS[userProfile.role as keyof typeof ROLE_PERMISSIONS] || []
      });

      jwtService.storeTokens(tokens);

      setCurrentUser(userProfile);
      setIsAuthenticated(true);
      setAuthState({
        isAuthenticated: true,
        isLoading: false,
        user: userProfile,
        error: null,
        isRefreshing: false
      });

      updateActivity();
      logSecurityEvent('login_success', { 
        userId: userProfile.user_id, 
        role: userProfile.role 
      });
      
      console.log('✅ Login successful');

      // ✅ ENHANCED: Worker redirect logic
      const redirectUrl = 
        userProfile.role === 'admin' 
          ? '/admin' 
          : userProfile.role === 'seller' 
          ? '/seller' 
          : userProfile.role === 'worker'  // ✅ NEW: Worker redirect
          ? '/scan' 
          : '/';
      
      console.log('🔄 Redirecting to:', redirectUrl);
      window.location.replace(redirectUrl);

      return userProfile;

    } catch (error: any) {
      console.error('❌ Login failed:', error);
      logSecurityEvent('login_failed', { email, error: error.message });
      
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: error.message || 'Login failed',
        isAuthenticated: false,
        user: null
      }));
      
      throw error;
    }
  }, [setCurrentUser, setIsAuthenticated, validateUser, logSecurityEvent, updateActivity]);

  // ✅ Enhanced logout
  const logout = useCallback(async () => {
    try {
      console.log('🔐 useAuth logout initiated...');
      const userId = authState.user?.user_id;
      
      console.log('⏰ Clearing timers...');
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
        refreshIntervalRef.current = undefined;
      }
      if (activityTimeoutRef.current) {
        clearTimeout(activityTimeoutRef.current);
        activityTimeoutRef.current = undefined;
      }

      console.log('🗑️ Clearing JWT tokens...');
      jwtService.clearTokens();
      
      console.log('🧹 Clearing localStorage...');
      const keysToRemove = [
        'tile_access_token',
        'tile_refresh_token',
        'auth_sync_token',
        'tile_user_data',
        'firebase_auth_token'
      ];
      keysToRemove.forEach(key => localStorage.removeItem(key));
      
      console.log('🗑️ Clearing sessionStorage...');
      sessionStorage.clear();
      
      console.log('🔥 Calling Firebase signOut...');
      try {
        await firebaseSignOut();
        console.log('✅ Firebase signOut completed');
      } catch (firebaseError) {
        console.warn('⚠️ Firebase signOut failed (non-critical):', firebaseError);
      }
      
      console.log('📦 Resetting Zustand store...');
      setCurrentUser(null);
      setIsAuthenticated(false);
      
      console.log('🔄 Resetting auth state...');
      setAuthState({
        isAuthenticated: false,
        isLoading: false,
        user: null,
        error: null,
        isRefreshing: false
      });

      logSecurityEvent('logout_success', { userId });
      console.log('✅ Logout completed - all state cleared');

    } catch (error: any) {
      console.error('❌ Logout error:', error);
      logSecurityEvent('logout_failed', { error: error.message });
      
      console.log('🚨 Error occurred, forcing nuclear cleanup...');
      try {
        jwtService.clearTokens();
        localStorage.clear();
        sessionStorage.clear();
        setCurrentUser(null);
        setIsAuthenticated(false);
        setAuthState({
          isAuthenticated: false,
          isLoading: false,
          user: null,
          error: null,
          isRefreshing: false
        });
        console.log('✅ Nuclear cleanup completed');
      } catch (nuclearError) {
        console.error('💥 Nuclear cleanup failed:', nuclearError);
      }
      
      throw error;
    }
  }, [authState.user, setCurrentUser, setIsAuthenticated, logSecurityEvent]);

  // ✅ Permission checks
  const hasPermission = useCallback((permission: string): boolean => {
    return jwtService.hasPermission(permission);
  }, []);

  const hasRole = useCallback((roles: string | string[]): boolean => {
    return jwtService.hasRole(roles);
  }, []);

  // ✅ Domain access check
  const canAccessDomain = useCallback((domainType: string): boolean => {
    try {
      const user = jwtService.getCurrentUser();
      
      if (domainType === 'customer') return true;
      if (!user) return false;
      if (user.role === 'admin') return true;
      if (user.role === 'seller' && domainType === 'seller') return true;
      
      return false;
    } catch (error) {
      console.error('❌ Domain access check failed:', error);
      return false;
    }
  }, []);

  // ✅ Auto-refresh token setup
  useEffect(() => {
    if (authState.isAuthenticated && !authState.isRefreshing) {
      refreshIntervalRef.current = setInterval(async () => {
        const token = jwtService.getAccessToken();
        if (token && jwtService.needsRefresh(token)) {
          await refreshAuthToken();
        }
      }, 2 * 60 * 1000);
    }

    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
      }
    };
  }, [authState.isAuthenticated, authState.isRefreshing, refreshAuthToken]);

  // ✅ Activity tracking setup
  useEffect(() => {
    if (!securityConfig.enableActivityTracking) return;

    const handleActivity = () => updateActivity();
    
    const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];
    events.forEach(event => {
      document.addEventListener(event, handleActivity, { passive: true });
    });

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleActivity);
      });
    };
  }, [updateActivity, securityConfig.enableActivityTracking]);

  // ✅ FIXED: Initialize on mount only
  useEffect(() => {
    console.log('🚀 useAuth hook mounted, initializing...');
    initializeAuth();
    
    return () => {
      console.log('🔌 useAuth hook unmounting, cleanup...');
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
        refreshIntervalRef.current = undefined;
      }
      if (activityTimeoutRef.current) {
        clearTimeout(activityTimeoutRef.current);
        activityTimeoutRef.current = undefined;
      }
    };
  }, []); // ✅ EMPTY - Run only once on mount

  // ✅ FIXED: Storage change listener (cross-tab sync only)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      // ✅ Only handle changes from OTHER tabs
      if (e.key === 'tile_access_token' && !e.newValue) {
        console.log('🔄 Token removed in another tab, logging out...');
        
        setCurrentUser(null);
        setIsAuthenticated(false);
        setAuthState({
          isAuthenticated: false,
          isLoading: false,
          user: null,
          error: null,
          isRefreshing: false
        });
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [setCurrentUser, setIsAuthenticated]);

  return {
    isAuthenticated: authState.isAuthenticated,
    isLoading: authState.isLoading,
    isRefreshing: authState.isRefreshing,
    user: authState.user,
    error: authState.error,
    
    login,
    logout,
    refreshToken: refreshAuthToken,
    
    hasPermission,
    hasRole,
    canAccessDomain,
    
    getCurrentUser: jwtService.getCurrentUser.bind(jwtService),
    updateActivity,
    validateUser
  };
};
