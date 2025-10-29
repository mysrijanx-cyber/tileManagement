 

// import React, { useState, useEffect } from 'react';
// import { X, User, Shield, AlertCircle, CheckCircle, Eye, EyeOff } from 'lucide-react';
// import { signIn, getCurrentUser, isFirebaseConfigured } from '../../lib/firebaseutils';
// import { useAuth } from '../../hooks/useAuth';
// import { getCurrentDomainConfig } from '../../utils/domainUtils';
// import { useAppStore } from '../../stores/appStore';

// interface AuthModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   onSuccess?: (user: any) => void;
// }

// export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');
//   const [showPassword, setShowPassword] = useState(false);
//   const [envStatus, setEnvStatus] = useState<'checking' | 'configured' | 'missing'>('checking');
//   const { setCurrentUser, setIsAuthenticated } = useAppStore();
//   const { login: authLogin } = useAuth();

//   const [formData, setFormData] = useState({
//     email: '',
//     password: ''
//   });

//   // Check environment on component mount
//   useEffect(() => {
//     if (isOpen) {
//       checkEnvironment();
//       setFormData({ email: '', password: '' });
//       setError('');
//       setSuccess('');
//     }
//   }, [isOpen]);

//   const checkEnvironment = () => {
//     setEnvStatus('checking');
    
//     setTimeout(() => {
//       const configured = isFirebaseConfigured();
//       console.log('🔧 Firebase Configuration Check:', {
//         configured,
//         hasApiKey: !!import.meta.env.VITE_FIREBASE_API_KEY,
//         hasAuthDomain: !!import.meta.env.VITE_FIREBASE_AUTH_DOMAIN
//       });
      
//       setEnvStatus(configured ? 'configured' : 'missing');
//     }, 500);
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     setError('');
//     setSuccess('');

//     try {
//       console.log('🔄 Authentication attempt for:', formData.email);

//       // Check if Firebase is configured
//       if (envStatus !== 'configured') {
//         throw new Error('System not properly configured. Please contact administrator.');
//       }

//       // Validate input
//       if (!formData.email.trim() || !formData.password.trim()) {
//         throw new Error('Please enter both email and password.');
//       }

//       // Email format validation
//       const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//       if (!emailRegex.test(formData.email.trim())) {
//         throw new Error('Please enter a valid email address.');
//       }

//       console.log('📡 Calling enhanced authentication...');
      
//       // ✅ Login with JWT
//       const user = await authLogin(formData.email.trim(), formData.password);
      
//       console.log('✅ Authentication successful:', {
//         id: user.id,
//         email: user.email,
//         role: user.role,
//         name: user.full_name
//       });
      
//       setSuccess(`✅ Welcome back, ${user.full_name || user.email}! Redirecting...`);
      
//       // ✅✅✅ FIXED: Proper state sync before redirect ✅✅✅
      
//       // Step 1: Close modal
//       onClose();
      
//       // Step 2: Call success callback
//       if (onSuccess) {
//         onSuccess(user);
//       }
      
//       // Step 3: Wait for state to fully update
//       await new Promise(resolve => setTimeout(resolve, 800));
      
//       // Step 4: Redirect based on role using replace (forces reload)
//       const redirectUrl = user.role === 'admin' 
//         ? '/admin' 
//         : user.role === 'seller' 
//         ? '/seller' 
//         : '/';
      
//       console.log('🔄 Redirecting to:', redirectUrl);
//       window.location.replace(redirectUrl);

//     } catch (err: any) {
//       console.error('❌ Authentication error:', err);
      
//       let errorMessage = '';
      
//       if (err.message.includes('auth/invalid-credential') || err.message.includes('Invalid login credentials')) {
//         errorMessage = 'Invalid email or password. Please check your credentials and try again.';
//       } else if (err.message.includes('auth/user-not-found')) {
//         errorMessage = 'No account found with this email address.';
//       } else if (err.message.includes('auth/wrong-password')) {
//         errorMessage = 'Incorrect password. Please try again.';
//       } else if (err.message.includes('auth/invalid-email')) {
//         errorMessage = 'Invalid email format. Please enter a valid email address.';
//       } else if (err.message.includes('auth/user-disabled')) {
//         errorMessage = 'This account has been disabled. Please contact administrator.';
//       } else if (err.message.includes('auth/too-many-requests')) {
//         errorMessage = 'Too many failed login attempts. Please wait a few minutes and try again.';
//       } else if (err.message.includes('profile not found')) {
//         errorMessage = 'User profile not found in database. Please contact administrator.';
//       } else if (err.message.includes('Invalid user role')) {
//         errorMessage = 'Your account does not have proper permissions. Please contact administrator.';
//       } else if (err.message.includes('System not properly configured')) {
//         errorMessage = 'System configuration error. Please contact technical support.';
//       } else {
//         errorMessage = err.message || 'Login failed. Please try again.';
//       }
      
//       setError(errorMessage);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleInputChange = (field: 'email' | 'password', value: string) => {
//     setFormData(prev => ({ ...prev, [field]: value }));
//     if (error) setError('');
//     if (success) setSuccess('');
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//       <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-auto">
//         {/* Header */}
//         <div className="flex items-center justify-between p-6 border-b">
//           <div className="flex items-center gap-3">
//             <Shield className="w-6 h-6 text-blue-600" />
//             <h2 className="text-xl font-bold text-gray-800">Sign In</h2>
//           </div>
//           <button
//             onClick={onClose}
//             className="text-gray-400 hover:text-gray-600 transition-colors"
//           >
//             <X className="w-5 h-5" />
//           </button>
//         </div>

//         <form onSubmit={handleSubmit} className="p-6 space-y-4">
//           {/* System Status */}
//           <div className={`p-3 rounded-lg border text-sm ${
//             envStatus === 'configured' 
//               ? 'bg-green-50 border-green-200 text-green-700'
//               : envStatus === 'missing'
//               ? 'bg-red-50 border-red-200 text-red-700'
//               : 'bg-yellow-50 border-yellow-200 text-yellow-700'
//           }`}>
//             <div className="flex items-center gap-2">
//               {envStatus === 'configured' && <CheckCircle className="w-4 h-4" />}
//               {envStatus === 'missing' && <AlertCircle className="w-4 h-4" />}
//               <span className="font-medium">
//                 {envStatus === 'configured' && '✅ System Ready'}
//                 {envStatus === 'missing' && '❌ System Configuration Error'}
//                 {envStatus === 'checking' && '🔄 Checking System...'}
//               </span>
//             </div>
//           </div>

//           {/* Email Input */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Email Address
//             </label>
//             <input
//               type="email"
//               placeholder="Enter your email address"
//               value={formData.email}
//               onChange={(e) => handleInputChange('email', e.target.value)}
//               className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
//               required
//               disabled={loading || envStatus !== 'configured'}
//             />
//           </div>

//           {/* Password Input */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Password
//             </label>
//             <div className="relative">
//               <input
//                 type={showPassword ? 'text' : 'password'}
//                 placeholder="Enter your password"
//                 value={formData.password}
//                 onChange={(e) => handleInputChange('password', e.target.value)}
//                 className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
//                 required
//                 disabled={loading || envStatus !== 'configured'}
//               />
//               <button
//                 type="button"
//                 onClick={() => setShowPassword(!showPassword)}
//                 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
//                 disabled={loading}
//               >
//                 {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
//               </button>
//             </div>
//           </div>

//           {/* Error Message */}
//           {error && (
//             <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
//               <div className="flex items-start gap-2">
//                 <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
//                 <p className="text-red-700 text-sm">{error}</p>
//               </div>
//             </div>
//           )}

//           {/* Success Message */}
//           {success && (
//             <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
//               <div className="flex items-start gap-2">
//                 <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
//                 <p className="text-green-700 text-sm">{success}</p>
//               </div>
//             </div>
//           )}

//           {/* Submit Button */}
//           <button
//             type="submit"
//             disabled={loading || envStatus !== 'configured'}
//             className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center gap-2"
//           >
//             {loading ? (
//               <>
//                 <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
//                 <span>Signing In...</span>
//               </>
//             ) : (
//               <>
//                 <User className="w-4 h-4" />
//                 <span>Sign In</span>
//               </>
//             )}
//           </button>

//           {/* Information */}
//           <div className="border-t pt-4">
//             <div className="text-center text-sm text-gray-600">
//               <p className="font-medium mb-1">Account Access</p>
//               <p className="text-xs">
//                 Only registered users can sign in. Contact administrator for account creation.
//               </p>
//             </div>
//           </div>

//           {/* System Information */}
//           {envStatus === 'missing' && (
//             <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg text-xs">
//               <p className="font-medium text-gray-700 mb-1">System Configuration Required</p>
//               <p className="text-gray-600">
//                 Please contact technical support to configure the authentication system.
//               </p>
//             </div>
//           )}
//         </form>
//       </div>
//     </div>
//   );
// };
import React, { useState, useEffect } from 'react';
import { X, User, Shield, AlertCircle, CheckCircle, Eye, EyeOff, Loader } from 'lucide-react';
import { signIn, getCurrentUser, isFirebaseConfigured } from '../../lib/firebaseutils';
import { useAuth } from '../../hooks/useAuth';
import { getCurrentDomainConfig } from '../../utils/domainUtils';
import { useAppStore } from '../../stores/appStore';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (user: any) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [envStatus, setEnvStatus] = useState<'checking' | 'configured' | 'missing'>('checking');
  const [isMobile, setIsMobile] = useState(false);
  const { setCurrentUser, setIsAuthenticated } = useAppStore();
  const { login: authLogin } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Check environment on component mount
  useEffect(() => {
    if (isOpen) {
      checkEnvironment();
      setFormData({ email: '', password: '' });
      setError('');
      setSuccess('');
      setShowPassword(false);
      
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Auto-clear messages
  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        if (!loading) {
          setError('');
          setSuccess('');
        }
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, success, loading]);

  const checkEnvironment = () => {
    setEnvStatus('checking');
    
    setTimeout(() => {
      const configured = isFirebaseConfigured();
      console.log('🔧 Firebase Configuration Check:', {
        configured,
        hasApiKey: !!import.meta.env.VITE_FIREBASE_API_KEY,
        hasAuthDomain: !!import.meta.env.VITE_FIREBASE_AUTH_DOMAIN
      });
      
      setEnvStatus(configured ? 'configured' : 'missing');
    }, 500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      console.log('🔄 Authentication attempt for:', formData.email);

      // Check if Firebase is configured
      if (envStatus !== 'configured') {
        throw new Error('System not properly configured. Please contact administrator.');
      }

      // Validate input
      if (!formData.email.trim() || !formData.password.trim()) {
        throw new Error('Please enter both email and password.');
      }

      // Email format validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email.trim())) {
        throw new Error('Please enter a valid email address.');
      }

      console.log('📡 Calling enhanced authentication...');
      
      // ✅ Login with JWT
      const user = await authLogin(formData.email.trim(), formData.password);
      
      console.log('✅ Authentication successful:', {
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.full_name
      });
      
      setSuccess(`✅ Welcome back, ${user.full_name || user.email}! Redirecting...`);
      
      // Haptic feedback on mobile
      if (navigator.vibrate) {
        navigator.vibrate(200);
      }
      
      // ✅✅✅ FIXED: Proper state sync before redirect ✅✅✅
      
      // Step 1: Close modal
      onClose();
      
      // Step 2: Call success callback
      if (onSuccess) {
        onSuccess(user);
      }
      
      // Step 3: Wait for state to fully update
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Step 4: Redirect based on role using replace (forces reload)
      const redirectUrl = user.role === 'admin' 
        ? '/admin' 
        : user.role === 'seller' 
        ? '/seller' 
        : '/';
      
      console.log('🔄 Redirecting to:', redirectUrl);
      window.location.replace(redirectUrl);

    } catch (err: any) {
      console.error('❌ Authentication error:', err);
      
      let errorMessage = '';
      
      if (err.message.includes('auth/invalid-credential') || err.message.includes('Invalid login credentials')) {
        errorMessage = 'Invalid email or password. Please check your credentials and try again.';
      } else if (err.message.includes('auth/user-not-found')) {
        errorMessage = 'No account found with this email address.';
      } else if (err.message.includes('auth/wrong-password')) {
        errorMessage = 'Incorrect password. Please try again.';
      } else if (err.message.includes('auth/invalid-email')) {
        errorMessage = 'Invalid email format. Please enter a valid email address.';
      } else if (err.message.includes('auth/user-disabled')) {
        errorMessage = 'This account has been disabled. Please contact administrator.';
      } else if (err.message.includes('auth/too-many-requests')) {
        errorMessage = 'Too many failed login attempts. Please wait a few minutes and try again.';
      } else if (err.message.includes('profile not found')) {
        errorMessage = 'User profile not found in database. Please contact administrator.';
      } else if (err.message.includes('Invalid user role')) {
        errorMessage = 'Your account does not have proper permissions. Please contact administrator.';
      } else if (err.message.includes('System not properly configured')) {
        errorMessage = 'System configuration error. Please contact technical support.';
      } else {
        errorMessage = err.message || 'Login failed. Please try again.';
      }
      
      setError(errorMessage);
      
      // Haptic feedback on error
      if (navigator.vibrate) {
        navigator.vibrate([100, 50, 100]);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: 'email' | 'password', value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) setError('');
    if (success) setSuccess('');
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && !loading) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-0 sm:p-4 animate-fade-in"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
    >
      <div className="bg-white rounded-none sm:rounded-xl shadow-2xl w-full h-full sm:h-auto sm:max-w-md sm:max-h-[90vh] mx-auto flex flex-col overflow-hidden animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b bg-gradient-to-r from-blue-50 to-purple-50 flex-shrink-0">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <h2 id="auth-modal-title" className="text-lg sm:text-xl font-bold text-gray-800">Sign In</h2>
          </div>
          <button
            onClick={handleClose}
            disabled={loading}
            className="text-gray-400 hover:text-gray-600 active:text-gray-800 transition-colors p-2 -mr-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation"
            aria-label="Close sign in modal"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 sm:space-y-5 overflow-y-auto flex-1">
          {/* System Status */}
          <div className={`p-3 sm:p-4 rounded-lg border text-xs sm:text-sm transition-all duration-300 ${
            envStatus === 'configured' 
              ? 'bg-green-50 border-green-200 text-green-700'
              : envStatus === 'missing'
              ? 'bg-red-50 border-red-200 text-red-700'
              : 'bg-yellow-50 border-yellow-200 text-yellow-700'
          }`}>
            <div className="flex items-center gap-2">
              {envStatus === 'configured' && <CheckCircle className="w-4 h-4 flex-shrink-0" />}
              {envStatus === 'missing' && <AlertCircle className="w-4 h-4 flex-shrink-0" />}
              {envStatus === 'checking' && <Loader className="w-4 h-4 flex-shrink-0 animate-spin" />}
              <span className="font-medium">
                {envStatus === 'configured' && '✅ System Ready'}
                {envStatus === 'missing' && '❌ System Configuration Error'}
                {envStatus === 'checking' && '🔄 Checking System...'}
              </span>
            </div>
          </div>

          {/* Email Input */}
          <div>
            <label htmlFor="email-input" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              id="email-input"
              type="email"
              placeholder="Enter your email address"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm sm:text-base touch-manipulation disabled:bg-gray-100 disabled:cursor-not-allowed"
              required
              disabled={loading || envStatus !== 'configured'}
              autoComplete="email"
              autoFocus={!isMobile}
            />
          </div>

          {/* Password Input */}
          <div>
            <label htmlFor="password-input" className="block text-sm font-medium text-gray-700 mb-2">
              Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                id="password-input"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm sm:text-base touch-manipulation disabled:bg-gray-100 disabled:cursor-not-allowed"
                required
                disabled={loading || envStatus !== 'configured'}
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 active:text-gray-800 transition-colors p-2 touch-manipulation disabled:opacity-50"
                disabled={loading}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" /> : <Eye className="w-4 h-4 sm:w-5 sm:h-5" />}
              </button>
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Password is case-sensitive
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg animate-shake">
              <div className="flex items-start gap-2 sm:gap-3">
                <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-500 mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-red-800 font-medium text-xs sm:text-sm mb-1">Authentication Error</p>
                  <p className="text-red-700 text-xs sm:text-sm break-words">{error}</p>
                </div>
                <button
                  onClick={() => setError('')}
                  className="text-red-400 hover:text-red-600 transition-colors p-1 -mr-1 touch-manipulation"
                  aria-label="Dismiss error"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="p-3 sm:p-4 bg-green-50 border border-green-200 rounded-lg animate-pulse">
              <div className="flex items-start gap-2 sm:gap-3">
                <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-green-800 font-medium text-xs sm:text-sm mb-1">Success!</p>
                  <p className="text-green-700 text-xs sm:text-sm break-words">{success}</p>
                </div>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || envStatus !== 'configured'}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 sm:py-3.5 rounded-lg hover:from-blue-700 hover:to-purple-700 active:from-blue-800 active:to-purple-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium flex items-center justify-center gap-2 text-sm sm:text-base shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] touch-manipulation"
          >
            {loading ? (
              <>
                <Loader className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-white" />
                <span>Signing In...</span>
              </>
            ) : (
              <>
                <User className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>Sign In</span>
              </>
            )}
          </button>

          {/* Information */}
          <div className="border-t pt-4">
            <div className="text-center text-xs sm:text-sm text-gray-600 space-y-2">
              <div className="flex items-center justify-center gap-2">
                <Shield className="w-4 h-4 text-gray-400" />
                <p className="font-medium">Secure Account Access</p>
              </div>
              <p className="text-xs text-gray-500">
                Only registered users can sign in. Contact administrator for account creation.
              </p>
            </div>
          </div>

          {/* System Information */}
          {envStatus === 'missing' && (
            <div className="p-3 sm:p-4 bg-gray-50 border border-gray-200 rounded-lg text-xs sm:text-sm">
              <div className="flex items-start gap-2 sm:gap-3">
                <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-gray-700 mb-1">System Configuration Required</p>
                  <p className="text-gray-600">
                    Please contact technical support to configure the authentication system.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Help Text */}
          <div className="text-center pt-2">
            <p className="text-xs text-gray-500">
              Need help? Contact your administrator
            </p>
          </div>
        </form>

        {/* Loading Overlay */}
        {loading && (
          <div className="absolute inset-0 bg-white bg-opacity-75 backdrop-blur-sm flex items-center justify-center z-10 rounded-none sm:rounded-xl">
            <div className="text-center">
              <Loader className="w-12 h-12 sm:w-16 sm:h-16 animate-spin text-blue-600 mx-auto mb-3" />
              <p className="text-gray-700 font-medium text-sm sm:text-base">Authenticating...</p>
              <p className="text-gray-500 text-xs sm:text-sm mt-1">Please wait</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
