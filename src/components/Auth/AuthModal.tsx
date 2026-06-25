
// import React, { useState, useEffect } from 'react';
// import { X, User, Shield, AlertCircle, CheckCircle, Eye, EyeOff, Loader } from 'lucide-react';
// import {isFirebaseConfigured } from '../../lib/firebaseutils';
// import { useAuth } from '../../hooks/useAuth';interface AuthModalProps {
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
//   const [isMobile, setIsMobile] = useState(false);
//   const { login: authLogin } = useAuth();

//   const [formData, setFormData] = useState({
//     email: '',
//     password: ''
//   });

//   // Detect mobile device
//   useEffect(() => {
//     const checkMobile = () => {
//       setIsMobile(window.innerWidth < 768);
//     };
    
//     checkMobile();
//     window.addEventListener('resize', checkMobile);
    
//     return () => window.removeEventListener('resize', checkMobile);
//   }, []);

//   // Check environment on component mount
//   useEffect(() => {
//     if (isOpen) {
//       checkEnvironment();
//       setFormData({ email: '', password: '' });
//       setError('');
//       setSuccess('');
//       setShowPassword(false);
      
//       // Prevent body scroll when modal is open
//       document.body.style.overflow = 'hidden';
//     } else {
//       document.body.style.overflow = 'unset';
//     }
    
//     return () => {
//       document.body.style.overflow = 'unset';
//     };
//   }, [isOpen]);

//   // Auto-clear messages
//   useEffect(() => {
//     if (error || success) {
//       const timer = setTimeout(() => {
//         if (!loading) {
//           setError('');
//           setSuccess('');
//         }
//       }, 5000);
//       return () => clearTimeout(timer);
//     }
//   }, [error, success, loading]);

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
      
//       // Haptic feedback on mobile
//       if (navigator.vibrate) {
//         navigator.vibrate(200);
//       }
      
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
      
//       // Haptic feedback on error
//       if (navigator.vibrate) {
//         navigator.vibrate([100, 50, 100]);
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleInputChange = (field: 'email' | 'password', value: string) => {
//     setFormData(prev => ({ ...prev, [field]: value }));
//     if (error) setError('');
//     if (success) setSuccess('');
//   };

//   const handleClose = () => {
//     if (!loading) {
//       onClose();
//     }
//   };

//   const handleBackdropClick = (e: React.MouseEvent) => {
//     if (e.target === e.currentTarget && !loading) {
//       onClose();
//     }
//   };

//   if (!isOpen) return null;

//   return (
//     <div 
//       className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-0 sm:p-4 animate-fade-in"
//       onClick={handleBackdropClick}
//       role="dialog"
//       aria-modal="true"
//       aria-labelledby="auth-modal-title"
//     >
//       <div className="bg-white rounded-none sm:rounded-xl shadow-2xl w-full h-full sm:h-auto sm:max-w-md sm:max-h-[90vh] mx-auto flex flex-col overflow-hidden animate-slide-up">
//         {/* Header */}
//         <div className="flex items-center justify-between p-4 sm:p-6 border-b bg-gradient-to-r from-blue-50 to-purple-50 flex-shrink-0">
//           <div className="flex items-center gap-2 sm:gap-3">
//             <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
//               <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
//             </div>
//             <h2 id="auth-modal-title" className="text-lg sm:text-xl font-bold text-gray-800">Sign In</h2>
//           </div>
//           <button
//             onClick={handleClose}
//             disabled={loading}
//             className="text-gray-400 hover:text-gray-600 active:text-gray-800 transition-colors p-2 -mr-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation"
//             aria-label="Close sign in modal"
//           >
//             <X className="w-5 h-5 sm:w-6 sm:h-6" />
//           </button>
//         </div>

//         <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 sm:space-y-5 overflow-y-auto flex-1">
//           {/* System Status */}
//           <div className={`p-3 sm:p-4 rounded-lg border text-xs sm:text-sm transition-all duration-300 ${
//             envStatus === 'configured' 
//               ? 'bg-green-50 border-green-200 text-green-700'
//               : envStatus === 'missing'
//               ? 'bg-red-50 border-red-200 text-red-700'
//               : 'bg-yellow-50 border-yellow-200 text-yellow-700'
//           }`}>
//             <div className="flex items-center gap-2">
//               {envStatus === 'configured' && <CheckCircle className="w-4 h-4 flex-shrink-0" />}
//               {envStatus === 'missing' && <AlertCircle className="w-4 h-4 flex-shrink-0" />}
//               {envStatus === 'checking' && <Loader className="w-4 h-4 flex-shrink-0 animate-spin" />}
//               <span className="font-medium">
//                 {envStatus === 'configured' && '✅ System Ready'}
//                 {envStatus === 'missing' && '❌ System Configuration Error'}
//                 {envStatus === 'checking' && '🔄 Checking System...'}
//               </span>
//             </div>
//           </div>

//           {/* Email Input */}
//           <div>
//             <label htmlFor="email-input" className="block text-sm font-medium text-gray-700 mb-2">
//               Email Address <span className="text-red-500">*</span>
//             </label>
//             <input
//               id="email-input"
//               type="email"
//               placeholder="Enter your email address"
//               value={formData.email}
//               onChange={(e) => handleInputChange('email', e.target.value)}
//               className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm sm:text-base touch-manipulation disabled:bg-gray-100 disabled:cursor-not-allowed"
//               required
//               disabled={loading || envStatus !== 'configured'}
//               autoComplete="email"
//               autoFocus={!isMobile}
//             />
//           </div>

//           {/* Password Input */}
//           <div>
//             <label htmlFor="password-input" className="block text-sm font-medium text-gray-700 mb-2">
//               Password <span className="text-red-500">*</span>
//             </label>
//             <div className="relative">
//               <input
//                 id="password-input"
//                 type={showPassword ? 'text' : 'password'}
//                 placeholder="Enter your password"
//                 value={formData.password}
//                 onChange={(e) => handleInputChange('password', e.target.value)}
//                 className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm sm:text-base touch-manipulation disabled:bg-gray-100 disabled:cursor-not-allowed"
//                 required
//                 disabled={loading || envStatus !== 'configured'}
//                 autoComplete="current-password"
//               />
//               <button
//                 type="button"
//                 onClick={() => setShowPassword(!showPassword)}
//                 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 active:text-gray-800 transition-colors p-2 touch-manipulation disabled:opacity-50"
//                 disabled={loading}
//                 aria-label={showPassword ? 'Hide password' : 'Show password'}
//               >
//                 {showPassword ? <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" /> : <Eye className="w-4 h-4 sm:w-5 sm:h-5" />}
//               </button>
//             </div>
//             <p className="mt-1 text-xs text-gray-500">
//               Password is case-sensitive
//             </p>
//           </div>

//           {/* Error Message */}
//           {error && (
//             <div className="p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg animate-shake">
//               <div className="flex items-start gap-2 sm:gap-3">
//                 <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-500 mt-0.5 flex-shrink-0" />
//                 <div className="flex-1 min-w-0">
//                   <p className="text-red-800 font-medium text-xs sm:text-sm mb-1">Authentication Error</p>
//                   <p className="text-red-700 text-xs sm:text-sm break-words">{error}</p>
//                 </div>
//                 <button
//                   onClick={() => setError('')}
//                   className="text-red-400 hover:text-red-600 transition-colors p-1 -mr-1 touch-manipulation"
//                   aria-label="Dismiss error"
//                 >
//                   <X className="w-4 h-4" />
//                 </button>
//               </div>
//             </div>
//           )}

//           {/* Success Message */}
//           {success && (
//             <div className="p-3 sm:p-4 bg-green-50 border border-green-200 rounded-lg animate-pulse">
//               <div className="flex items-start gap-2 sm:gap-3">
//                 <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mt-0.5 flex-shrink-0" />
//                 <div className="flex-1 min-w-0">
//                   <p className="text-green-800 font-medium text-xs sm:text-sm mb-1">Success!</p>
//                   <p className="text-green-700 text-xs sm:text-sm break-words">{success}</p>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Submit Button */}
//           <button
//             type="submit"
//             disabled={loading || envStatus !== 'configured'}
//             className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 sm:py-3.5 rounded-lg hover:from-blue-700 hover:to-purple-700 active:from-blue-800 active:to-purple-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium flex items-center justify-center gap-2 text-sm sm:text-base shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] touch-manipulation"
//           >
//             {loading ? (
//               <>
//                 <Loader className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-white" />
//                 <span>Signing In...</span>
//               </>
//             ) : (
//               <>
//                 <User className="w-4 h-4 sm:w-5 sm:h-5" />
//                 <span>Sign In</span>
//               </>
//             )}
//           </button>

//           {/* Information */}
//           <div className="border-t pt-4">
//             <div className="text-center text-xs sm:text-sm text-gray-600 space-y-2">
//               <div className="flex items-center justify-center gap-2">
//                 <Shield className="w-4 h-4 text-gray-400" />
//                 <p className="font-medium">Secure Account Access</p>
//               </div>
//               <p className="text-xs text-gray-500">
//                 Only registered users can sign in. Contact administrator for account creation.
//               </p>
//             </div>
//           </div>

//           {/* System Information */}
//           {envStatus === 'missing' && (
//             <div className="p-3 sm:p-4 bg-gray-50 border border-gray-200 rounded-lg text-xs sm:text-sm">
//               <div className="flex items-start gap-2 sm:gap-3">
//                 <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 mt-0.5 flex-shrink-0" />
//                 <div>
//                   <p className="font-medium text-gray-700 mb-1">System Configuration Required</p>
//                   <p className="text-gray-600">
//                     Please contact technical support to configure the authentication system.
//                   </p>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Help Text */}
//           <div className="text-center pt-2">
//             <p className="text-xs text-gray-500">
//               Need help? Contact your administrator
//             </p>
//           </div>
//         </form>

//         {/* Loading Overlay */}
//         {loading && (
//           <div className="absolute inset-0 bg-white bg-opacity-75 backdrop-blur-sm flex items-center justify-center z-10 rounded-none sm:rounded-xl">
//             <div className="text-center">
//               <Loader className="w-12 h-12 sm:w-16 sm:h-16 animate-spin text-blue-600 mx-auto mb-3" />
//               <p className="text-gray-700 font-medium text-sm sm:text-base">Authenticating...</p>
//               <p className="text-gray-500 text-xs sm:text-sm mt-1">Please wait</p>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };
import React, { useState, useEffect } from 'react';
import { X, User, Shield, AlertCircle, CheckCircle, Eye, EyeOff, Loader, ArrowRight, Zap, Cpu } from 'lucide-react';
import { isFirebaseConfigured } from '../../lib/firebaseutils';
import { useAuth } from '../../hooks/useAuth';

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
  const [rememberMe, setRememberMe] = useState(false);
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
      setRememberMe(false);
      
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
      setEnvStatus(configured ? 'configured' : 'missing');
    }, 500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (envStatus !== 'configured') {
        throw new Error('System not properly configured. Please contact administrator.');
      }

      if (!formData.email.trim() || !formData.password.trim()) {
        throw new Error('Please enter both email and password.');
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email.trim())) {
        throw new Error('Please enter a valid email address.');
      }

      const user = await authLogin(formData.email.trim(), formData.password);
      
      setSuccess(`✅ Welcome back, ${user.full_name || user.email}! Redirecting...`);
      
      if (navigator.vibrate) navigator.vibrate(200);
      
      onClose();
      if (onSuccess) onSuccess(user);
      
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const redirectUrl = user.role === 'admin' 
        ? '/admin' 
        : user.role === 'seller' 
        ? '/seller' 
        : '/';
      
      window.location.replace(redirectUrl);

    } catch (err: any) {
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
      if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    // TODO: Implement your Google Auth logic here
    console.log("Google login clicked");
  };

  const handleInputChange = (field: 'email' | 'password', value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) setError('');
    if (success) setSuccess('');
  };

  const handleClose = () => {
    if (!loading) onClose();
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && !loading) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-0 sm:p-4 animate-fade-in"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
    >
      <div className="bg-white rounded-none sm:rounded-2xl shadow-2xl w-full h-full sm:h-auto sm:max-w-lg mx-auto flex flex-col overflow-hidden animate-slide-up relative">
        
        {/* Premium Header Bar */}
       {/* Exact Match Header Bar */}
        <div className="bg-[#2D60E3] px-6 py-6 sm:px-8 flex flex-col justify-center relative flex-shrink-0 shadow-none border-none z-10">
          
          {/* Platform Label */}
          <div className="flex items-center gap-2 mb-1.5">
           
          </div>
          
          {/* Main Title - whitespace-nowrap prevents 360 from dropping */}
        <h2 
            className="text-white text-2xl sm:text-3xl font-medium whitespace-nowrap lining-nums"
            style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
          >
            Tiles View 360
          </h2>
          
          {/* Close Button */}
          <button
            onClick={handleClose}
            disabled={loading}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-blue-200 hover:text-white transition-colors p-2 rounded-full hover:bg-black/10 disabled:opacity-50 touch-manipulation"
            aria-label="Close modal"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="px-6 py-8 sm:px-10">
            {/* Titles */}
            <div className="mb-8">
              <h1 id="auth-modal-title" className="text-3xl sm:text-4xl font-serif text-slate-900 font-medium mb-2">
                Welcome Back
              </h1>
              <p className="text-slate-500 text-sm sm:text-base">
                Continue creating beautiful spaces
              </p>
            </div>

            {/* System Status / Error / Success States */}
            <div className="mb-6 space-y-3">
              {envStatus === 'missing' && (
                <div className="p-3 bg-red-50 border border-red-100 rounded-lg flex items-center gap-2 text-red-700 text-sm">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>System Configuration Error</span>
                </div>
              )}
              {error && (
                <div className="p-3 bg-red-50 border border-red-100 rounded-lg flex items-start gap-2 animate-shake text-red-700 text-sm">
                  <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <p className="flex-1">{error}</p>
                </div>
              )}
              {success && (
                <div className="p-3 bg-green-50 border border-green-100 rounded-lg flex items-start gap-2 animate-pulse text-green-700 text-sm">
                  <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <p className="flex-1">{success}</p>
                </div>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email Input */}
              <div>
                <label htmlFor="email-input" className="block text-xs font-semibold text-slate-400 tracking-wider uppercase mb-2">
                  Work Email
                </label>
                <input
                  id="email-input"
                  type="email"
                  placeholder="name@company.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full px-4 py-3.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-slate-700 disabled:bg-slate-50 disabled:text-slate-400"
                  required
                  disabled={loading || envStatus !== 'configured'}
                  autoComplete="email"
                  autoFocus={!isMobile}
                />
              </div>

              {/* Password Input */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label htmlFor="password-input" className="block text-xs font-semibold text-slate-400 tracking-wider uppercase">
                    Password
                  </label>
                  <button type="button" className="text-sm text-blue-600 hover:text-blue-700 font-medium disabled:opacity-50">
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <input
                    id="password-input"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className="w-full px-4 py-3.5 pr-12 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-slate-700 disabled:bg-slate-50 disabled:text-slate-400"
                    required
                    disabled={loading || envStatus !== 'configured'}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-2"
                    disabled={loading}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Remember Me */}
              <div className="flex items-center">
                <input
                  id="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                  disabled={loading}
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-600">
                  Remember Me
                </label>
              </div>

              {/* Start Visualizing Button */}
              <button
                type="submit"
                disabled={loading || envStatus !== 'configured'}
                className="w-full bg-blue-600 text-white py-3.5 rounded-xl hover:bg-blue-700 active:bg-blue-800 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 font-medium flex items-center justify-center shadow-md hover:shadow-lg mt-2"
              >
                {loading ? (
                  <>
                    <Loader className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" />
                    Signing In...
                  </>
                ) : (
                  <>
                    START VISUALIZING
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </>
                )}
              </button>

              {/* Google Button */}
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={loading}
                className="w-full bg-white border border-slate-200 text-slate-700 py-3.5 rounded-xl hover:bg-slate-50 active:bg-slate-100 disabled:opacity-50 transition-all font-medium flex items-center justify-center gap-3"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  <path d="M1 1h22v22H1z" fill="none" />
                </svg>
                Access with Google
              </button>
            </form>

            {/* Footer Features & Terms */}
            <div className="mt-8 pt-6 border-t border-slate-100">
              <div className="flex justify-center gap-4 sm:gap-8 text-slate-500 text-xs sm:text-sm font-medium mb-4">
                <span className="flex items-center gap-1.5"><Shield className="w-4 h-4 text-blue-500" /> Secure Cloud</span>
                <span className="flex items-center gap-1.5"><Zap className="w-4 h-4 text-blue-500" /> Fast</span>
                <span className="flex items-center gap-1.5"><Cpu className="w-4 h-4 text-blue-500" /> AI Powered</span>
              </div>
              <p className="text-center text-[11px] sm:text-xs text-slate-400">
                Tilesview360 v3.1 • By signing in you agree to our Terms & Privacy Policy
              </p>
            </div>
          </div>
        </div>

        {/* Global Loading Overlay */}
        {loading && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex items-center justify-center z-10 rounded-none sm:rounded-2xl">
            <div className="bg-white p-6 rounded-2xl shadow-xl flex flex-col items-center">
              <Loader className="w-10 h-10 animate-spin text-blue-600 mb-3" />
              <p className="text-slate-800 font-medium">Authenticating</p>
              <p className="text-slate-500 text-sm mt-1">Please wait...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};