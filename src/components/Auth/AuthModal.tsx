
import React, { useState, useEffect } from 'react';
import { X, Shield, Zap, Cpu, AlertCircle, CheckCircle, Eye, EyeOff, Loader, ArrowRight } from 'lucide-react';
import { isFirebaseConfigured } from '../../lib/firebaseutils';
import { useAuth } from '../../hooks/useAuth';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (user: any) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  // --- EXISTING STATES ---
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

  // --- NEW STATES FOR ANIMATION ---
  const [showUI, setShowUI] = useState(false);
  const [renderComponent, setRenderComponent] = useState(false);

  // --- USE EFFECTS ---
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Updated isOpen effect to handle smooth entry and exit animations
  useEffect(() => {
    let exitTimeout: NodeJS.Timeout;

    if (isOpen) {
      setRenderComponent(true);
      // Small delay to allow DOM to render before triggering CSS transition
      setTimeout(() => setShowUI(true), 10);
      
      checkEnvironment();
      setFormData({ email: '', password: '' });
      setError('');
      setSuccess('');
      setShowPassword(false);
      setRememberMe(false);
      
      document.body.style.overflow = 'hidden';
    } else {
      setShowUI(false);
      // Wait for exit animation (300ms) to complete before unmounting
      exitTimeout = setTimeout(() => {
        setRenderComponent(false);
      }, 300);
      
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
      if (exitTimeout) clearTimeout(exitTimeout);
    };
  }, [isOpen]);

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

  // --- EXISTING LOGIC & FUNCTIONS ---
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

  // We return null if the component should completely unmount
  if (!renderComponent) return null;

  return (
    <>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600;700&display=swap');
          
          .font-serif-custom {
            font-family: 'Playfair Display', serif;
          }

          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-5px); }
            75% { transform: translateX(5px); }
          }

          .animate-shake {
            animation: shake 0.3s ease-in-out;
          }

          /* Custom scrollbar for modal */
          .modal-scroll::-webkit-scrollbar {
            width: 6px;
          }
          .modal-scroll::-webkit-scrollbar-track {
            background: #f1f5f9;
            border-radius: 10px;
          }
          .modal-scroll::-webkit-scrollbar-thumb {
            background: #cbd5e1;
            border-radius: 10px;
          }
          .modal-scroll::-webkit-scrollbar-thumb:hover {
            background: #94a3b8;
          }
        `}
      </style>

      {/* FIXED: Smooth Backdrop Transition */}
      <div 
        className={`fixed inset-0 flex items-start sm:items-center justify-center z-[999] p-0 sm:p-4 overflow-y-auto transition-all duration-300 ease-out ${
          showUI ? 'bg-black/60 backdrop-blur-sm' : 'bg-transparent backdrop-blur-none'
        }`}
        onClick={handleBackdropClick}
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-modal-title"
      >
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 animate-modal-in modal-zoom-content">
        {/* FIXED: Smooth Scale & Slide Form Transition */}
        <div 
          className={`w-full sm:max-w-[480px] bg-white sm:rounded-[24px] shadow-[0_20px_40px_rgb(0,0,0,0.06)] relative min-h-screen sm:min-h-0 sm:my-4 flex flex-col transform transition-all duration-300 ease-out ${
            showUI ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-8'
          }`}
        >
          
          {/* Top Platform Header */}
          <div className="bg-[#2f61f0] px-6 sm:px-12 py-6 sm:py-10 shrink-0 relative">
            <div className="flex items-center gap-3 text-blue-100 text-[11px] font-bold tracking-[0.15em] uppercase mb-3 ">
              <div className="w-6 h-[1.5px] bg-blue-100"></div>
              Tilesview360
            </div>
            <h2 className="font-serif-custom text-[24px] sm:text-[28px] text-white leading-[1.25] font-semibold">
             Premium Tiles <br />Virtulization
            </h2>

            {/* Close Button */}
            <button
              onClick={handleClose}
              disabled={loading}
              className="absolute right-4 sm:right-6 top-4 sm:top-6 text-blue-100 hover:text-white transition-colors p-2 rounded-full hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed z-20"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 sm:p-12 overflow-y-auto modal-scroll flex-1">
            {/* Form Header */}
            <div className="mb-6 sm:mb-10">
              <h1 id="auth-modal-title" className="text-[28px] sm:text-[34px] leading-tight font-serif-custom text-[#0f172a] mb-2 font-semibold">
                Welcome Back
              </h1>
              <p className="text-[14px] sm:text-[16px] text-slate-500 font-medium">
                Continue creating beautiful spaces
              </p>
            </div>

            {/* System Status / Error / Success Messages */}
            {envStatus === 'missing' && (
              <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 text-red-700">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <div className="flex-1 text-sm">
                  <p className="font-semibold mb-1">System Configuration Error</p>
                  <p className="text-red-600">Please contact administrator.</p>
                </div>
              </div>
            )}

            {error && (
              <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 text-red-700 animate-shake">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <p className="flex-1 text-sm">{error}</p>
              </div>
            )}

            {success && (
              <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-green-50 border border-green-200 rounded-xl flex items-start gap-3 text-green-700">
                <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <p className="flex-1 text-sm">{success}</p>
              </div>
            )}

            {/* Form */}
            <form className="space-y-5 sm:space-y-6" onSubmit={handleSubmit}>
              
              {/* Work Email */}
              <div className="space-y-2">
                <label 
                  htmlFor="email-input"
                  className="block text-[14px] sm:text-[15px] font-medium text-slate-500 cursor-pointer select-none"
                >
                  Work Email
                </label>
                <input
                  id="email-input"
                  type="email"
                  placeholder="name@company.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full px-4 py-3 sm:py-3.5 rounded-xl border border-slate-200 bg-white placeholder:text-slate-300 text-[15px] text-slate-700 focus:outline-none focus:ring-4 focus:ring-[#2f61f0]/10 focus:border-[#2f61f0] transition-all disabled:bg-slate-50 disabled:text-slate-400"
                  required
                  disabled={loading || envStatus !== 'configured'}
                  autoComplete="email"
                  autoFocus={!isMobile}
                />
              </div>

              {/* Password */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label 
                    htmlFor="password-input"
                    className="block text-[14px] sm:text-[15px] font-medium text-slate-500 cursor-pointer select-none"
                  >
                    Password
                  </label>
                  <button
                    type="button"
                    className="text-[12px] sm:text-[13px] font-semibold text-[#2f61f0] hover:text-[#1d44bc] transition-colors disabled:opacity-50"
                    disabled={loading}
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <input
                    id="password-input"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className="w-full px-4 py-3 sm:py-3.5 rounded-xl border border-slate-200 bg-white placeholder:text-slate-300 text-[15px] text-slate-700 focus:outline-none focus:ring-4 focus:ring-[#2f61f0]/10 focus:border-[#2f61f0] transition-all pr-12 disabled:bg-slate-50 disabled:text-slate-400"
                    required
                    disabled={loading || envStatus !== 'configured'}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors disabled:opacity-50"
                    disabled={loading}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={20} strokeWidth={1.5} /> : <Eye size={20} strokeWidth={1.5} />}
                  </button>
                </div>
              </div>

              {/* Remember Me */}
              <div className="flex items-center gap-3 pt-1 sm:pt-2">
                <div className="relative flex items-center justify-center">
                  <input
                    type="checkbox"
                    id="remember"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="peer w-5 h-5 appearance-none border-2 border-slate-200 rounded-[6px] checked:bg-[#2f61f0] checked:border-[#2f61f0] transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={loading}
                  />
                  <svg className="absolute w-3 h-3 pointer-events-none hidden peer-checked:block text-white" viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 5L4.5 8.5L13 1" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <label htmlFor="remember" className="text-[14px] sm:text-[15px] font-medium text-slate-500 cursor-pointer select-none">
                  Remember Me
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || envStatus !== 'configured'}
                className="w-full bg-gradient-to-r from-[#2f61f0] to-[#1d44bc] text-white px-6 py-3.5 sm:py-4 rounded-xl font-bold text-[13px] sm:text-[14px] tracking-[0.08em] uppercase hover:shadow-[0_8px_20px_rgba(47,97,240,0.35)] transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:shadow-none"
              >
                {loading ? (
                  <>
                    <Loader className="animate-spin w-5 h-5" />
                    <span>Signing In...</span>
                  </>
                ) : (
                  <>
                    <span>Start Visualizing</span>
                    <ArrowRight size={18} strokeWidth={2.5} />
                  </>
                )}
              </button>

              {/* Divider */}
              <div className="relative py-3 sm:py-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-slate-400 font-medium text-[12px] sm:text-[13px]">OR ACCESS WITH</span>
                </div>
              </div>

              {/* Google Sign In */}
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={loading || envStatus !== 'configured'}
                className="w-full bg-white border-2 border-slate-200 text-slate-700 px-6 py-3 sm:py-3.5 rounded-xl font-semibold text-[14px] sm:text-[15px] hover:bg-slate-50 hover:border-slate-300 transition-all duration-200 flex items-center justify-center gap-3 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                <span>Google</span>
              </button>
            </form>

            {/* Footer */}
            <div className="mt-6 sm:mt-10 pt-6 sm:pt-8 border-t border-slate-100">
              <div className="flex items-center justify-center gap-4 sm:gap-8 mb-4 sm:mb-5">
                <div className="flex items-center gap-2 text-slate-600">
                  <Shield className="w-4 h-4 text-[#2f61f0]" strokeWidth={2} />
                  <span className="text-[12px] sm:text-[13px] font-medium">Secure</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <Zap className="w-4 h-4 text-[#2f61f0]" strokeWidth={2} />
                  <span className="text-[12px] sm:text-[13px] font-medium">Fast</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <Cpu className="w-4 h-4 text-[#2f61f0]" strokeWidth={2} />
                  <span className="text-[12px] sm:text-[13px] font-medium">AI Powered</span>
                </div>
              </div>
              <p className="text-center text-[10px] sm:text-[11px] text-slate-400 leading-relaxed px-2">
                By continuing, you agree to our Terms of Service and Privacy Policy
              </p>
            </div>
          </div>
          </div>

          {/* Global Loading Overlay */}
          {loading && (
            <div className="absolute inset-0 bg-white/70 backdrop-blur-sm flex items-center justify-center z-50 sm:rounded-[24px]">
              <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-2xl flex flex-col items-center border border-slate-100">
                <Loader className="w-10 h-10 sm:w-12 sm:h-12 animate-spin text-[#2f61f0] mb-3 sm:mb-4" />
                <p className="text-slate-800 font-semibold text-base sm:text-lg mb-1">Authenticating</p>
                <p className="text-slate-500 text-xs sm:text-sm">Please wait...</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AuthModal;