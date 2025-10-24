 

import React, { useState, useEffect } from 'react';
import { X, User, Shield, AlertCircle, CheckCircle, Eye, EyeOff } from 'lucide-react';
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
  const { setCurrentUser, setIsAuthenticated } = useAppStore();
  const { login: authLogin } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  // Check environment on component mount
  useEffect(() => {
    if (isOpen) {
      checkEnvironment();
      setFormData({ email: '', password: '' });
      setError('');
      setSuccess('');
    }
  }, [isOpen]);

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
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: 'email' | 'password', value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) setError('');
    if (success) setSuccess('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            <Shield className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-bold text-gray-800">Sign In</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* System Status */}
          <div className={`p-3 rounded-lg border text-sm ${
            envStatus === 'configured' 
              ? 'bg-green-50 border-green-200 text-green-700'
              : envStatus === 'missing'
              ? 'bg-red-50 border-red-200 text-red-700'
              : 'bg-yellow-50 border-yellow-200 text-yellow-700'
          }`}>
            <div className="flex items-center gap-2">
              {envStatus === 'configured' && <CheckCircle className="w-4 h-4" />}
              {envStatus === 'missing' && <AlertCircle className="w-4 h-4" />}
              <span className="font-medium">
                {envStatus === 'configured' && '✅ System Ready'}
                {envStatus === 'missing' && '❌ System Configuration Error'}
                {envStatus === 'checking' && '🔄 Checking System...'}
              </span>
            </div>
          </div>

          {/* Email Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              placeholder="Enter your email address"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              required
              disabled={loading || envStatus !== 'configured'}
            />
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                required
                disabled={loading || envStatus !== 'configured'}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                disabled={loading}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                <p className="text-green-700 text-sm">{success}</p>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || envStatus !== 'configured'}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Signing In...</span>
              </>
            ) : (
              <>
                <User className="w-4 h-4" />
                <span>Sign In</span>
              </>
            )}
          </button>

          {/* Information */}
          <div className="border-t pt-4">
            <div className="text-center text-sm text-gray-600">
              <p className="font-medium mb-1">Account Access</p>
              <p className="text-xs">
                Only registered users can sign in. Contact administrator for account creation.
              </p>
            </div>
          </div>

          {/* System Information */}
          {envStatus === 'missing' && (
            <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg text-xs">
              <p className="font-medium text-gray-700 mb-1">System Configuration Required</p>
              <p className="text-gray-600">
                Please contact technical support to configure the authentication system.
              </p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};
