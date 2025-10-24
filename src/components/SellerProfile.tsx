// src/components/SellerProfile.tsx
import React, { useState, useEffect } from 'react';
import { 
  User, Lock, Mail, Phone, MapPin, Store, 
  Eye, EyeOff, CheckCircle, AlertCircle, 
  Loader, Shield, Key, Save
} from 'lucide-react';
import { useAppStore } from '../stores/appStore';
import { getSellerProfile, changeSellerPassword } from '../lib/firebaseutils';
import { TileSeller } from '../types';

interface PasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface PasswordValidation {
  minLength: boolean;
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasNumber: boolean;
  hasSpecialChar: boolean;
}

export const SellerProfile: React.FC = () => {
  const { currentUser } = useAppStore();
  
  // Profile State
  const [sellerProfile, setSellerProfile] = useState<TileSeller | null>(null);
  const [loading, setLoading] = useState(true);
  const [profileError, setProfileError] = useState<string | null>(null);
  
  // Password Change State
  const [passwordForm, setPasswordForm] = useState<PasswordFormData>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  
  const [passwordValidation, setPasswordValidation] = useState<PasswordValidation>({
    minLength: false,
    hasUppercase: false,
    hasLowercase: false,
    hasNumber: false,
    hasSpecialChar: false
  });
  
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Load seller profile
  useEffect(() => {
    loadSellerProfile();
  }, [currentUser]);

  // Clear messages after 5 seconds
  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        setSuccess(null);
        setError(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [success, error]);

  const loadSellerProfile = async () => {
    if (!currentUser?.user_id) {
      setProfileError('User not authenticated');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setProfileError(null);
      
      console.log('🔄 Loading seller profile for:', currentUser.user_id);
      
      const profile = await getSellerProfile(currentUser.user_id);
      
      if (!profile) {
        setProfileError('Seller profile not found. Please contact support.');
        return;
      }
      
      setSellerProfile(profile);
      console.log('✅ Seller profile loaded:', profile.business_name);
      
    } catch (err: any) {
      console.error('❌ Error loading seller profile:', err);
      setProfileError('Failed to load profile. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  };

  // Validate password strength in real-time
  const validatePasswordStrength = (password: string): PasswordValidation => {
    return {
      minLength: password.length >= 8,
      hasUppercase: /[A-Z]/.test(password),
      hasLowercase: /[a-z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSpecialChar: /[!@#$%^&*()_+\-=[```{};':"\\|,.<>/?]/.test(password)
    };
  };

  const handlePasswordInputChange = (field: keyof PasswordFormData, value: string) => {
    setPasswordForm(prev => ({ ...prev, [field]: value }));
    
    // Clear errors when user types
    if (error) setError(null);
    if (success) setSuccess(null);
    
    // Validate new password strength in real-time
    if (field === 'newPassword') {
      const validation = validatePasswordStrength(value);
      setPasswordValidation(validation);
    }
  };

  const getPasswordStrengthScore = (): number => {
    const { minLength, hasUppercase, hasLowercase, hasNumber, hasSpecialChar } = passwordValidation;
    let score = 0;
    if (minLength) score++;
    if (hasUppercase) score++;
    if (hasLowercase) score++;
    if (hasNumber) score++;
    if (hasSpecialChar) score++;
    return score;
  };

  const getPasswordStrengthText = (): { text: string; color: string; bgColor: string } => {
    const score = getPasswordStrengthScore();
    if (score === 0) return { text: 'Enter password', color: 'text-gray-500', bgColor: 'bg-gray-200' };
    if (score <= 2) return { text: 'Weak', color: 'text-red-600', bgColor: 'bg-red-500' };
    if (score === 3) return { text: 'Fair', color: 'text-orange-600', bgColor: 'bg-orange-500' };
    if (score === 4) return { text: 'Good', color: 'text-yellow-600', bgColor: 'bg-yellow-500' };
    return { text: 'Strong', color: 'text-green-600', bgColor: 'bg-green-500' };
  };

  const isPasswordStrong = (): boolean => {
    return Object.values(passwordValidation).every(val => val === true);
  };

  const validatePasswordForm = (): string | null => {
    const { currentPassword, newPassword, confirmPassword } = passwordForm;
    
    if (!currentPassword.trim()) {
      return 'Please enter your current password';
    }
    
    if (!newPassword.trim()) {
      return 'Please enter a new password';
    }
    
    if (!isPasswordStrong()) {
      return 'New password does not meet security requirements';
    }
    
    if (currentPassword === newPassword) {
      return 'New password must be different from current password';
    }
    
    if (newPassword !== confirmPassword) {
      return 'New password and confirmation do not match';
    }
    
    return null;
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    const validationError = validatePasswordForm();
    if (validationError) {
      setError(validationError);
      return;
    }
    
    if (!currentUser?.email) {
      setError('User email not found. Please log in again.');
      return;
    }
    
    try {
      setSubmitting(true);
      setError(null);
      setSuccess(null);
      
      console.log('🔐 Starting password change process...');
      
      // Call Firebase function to change password
      await changeSellerPassword(
        currentUser.email,
        passwordForm.currentPassword,
        passwordForm.newPassword
      );
      
      console.log('✅ Password changed successfully');
      
      // Clear form
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
      // Reset validation
      setPasswordValidation({
        minLength: false,
        hasUppercase: false,
        hasLowercase: false,
        hasNumber: false,
        hasSpecialChar: false
      });
      
      setSuccess('Password changed successfully! You can now use your new password to log in.');
      
    } catch (err: any) {
      console.error('❌ Password change failed:', err);
      
      // Handle specific errors
      if (err.message.includes('wrong-password') || err.message.includes('invalid-credential')) {
        setError('Current password is incorrect. Please try again.');
      } else if (err.message.includes('weak-password')) {
        setError('New password is too weak. Please choose a stronger password.');
      } else if (err.message.includes('requires-recent-login')) {
        setError('For security, please log out and log in again before changing your password.');
      } else {
        setError(err.message || 'Failed to change password. Please try again.');
      }
      
    } finally {
      setSubmitting(false);
    }
  };

  const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  // Loading State
  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Loader className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error State
  if (profileError) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="text-center py-12">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Profile Error</h2>
          <p className="text-gray-600 mb-6">{profileError}</p>
          <button 
            onClick={loadSellerProfile}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // No Profile Found
  if (!sellerProfile) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="text-center py-12">
          <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-4">No Profile Found</h2>
          <p className="text-gray-600">Unable to load seller profile.</p>
        </div>
      </div>
    );
  }

  const strengthInfo = getPasswordStrengthText();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl shadow-lg p-6">
        <div className="flex items-center gap-4">
          <div className="bg-white/20 p-3 rounded-lg">
            <User className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Seller Profile</h1>
            <p className="text-blue-100">Manage your account information</p>
          </div>
        </div>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
          <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-green-800 font-medium">Success</p>
            <p className="text-green-700 text-sm">{success}</p>
          </div>
          <button 
            onClick={() => setSuccess(null)}
            className="text-green-400 hover:text-green-600 font-bold text-lg"
          >
            ×
          </button>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-red-800 font-medium">Error</p>
            <p className="text-red-700 text-sm">{error}</p>
          </div>
          <button 
            onClick={() => setError(null)}
            className="text-red-400 hover:text-red-600 font-bold text-lg"
          >
            ×
          </button>
        </div>
      )}

      {/* Basic Information (Read-Only) */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-600" />
            Basic Information
            <span className="ml-auto text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded-full">
              Read Only
            </span>
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            These details cannot be changed. Contact admin for updates.
          </p>
        </div>

        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Owner Name */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                <User className="w-4 h-4 text-gray-400" />
                Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={sellerProfile.owner_name || currentUser?.full_name || 'N/A'}
                  disabled
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 cursor-not-allowed"
                />
                <Lock className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2" />
              </div>
            </div>

            {/* Business Name */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                <Store className="w-4 h-4 text-gray-400" />
                Business Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={sellerProfile.business_name || 'N/A'}
                  disabled
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 cursor-not-allowed"
                />
                <Lock className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2" />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                <Mail className="w-4 h-4 text-gray-400" />
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={sellerProfile.email || currentUser?.email || 'N/A'}
                  disabled
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 cursor-not-allowed"
                />
                <Lock className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2" />
              </div>
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                <Phone className="w-4 h-4 text-gray-400" />
                Mobile Number
              </label>
              <div className="relative">
                <input
                  type="tel"
                  value={sellerProfile.phone || 'N/A'}
                  disabled
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 cursor-not-allowed"
                />
                <Lock className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2" />
              </div>
            </div>
          </div>

          {/* Business Address */}
          {sellerProfile.business_address && (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gray-400" />
                Business Address
              </label>
              <div className="relative">
                <textarea
                  value={sellerProfile.business_address}
                  disabled
                  rows={2}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 cursor-not-allowed resize-none"
                />
                <Lock className="w-4 h-4 text-gray-400 absolute right-3 top-3" />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Change Password Section */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-orange-50 to-red-50 px-6 py-4 border-b border-orange-200">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <Key className="w-5 h-5 text-orange-600" />
            Change Password
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Update your password to keep your account secure
          </p>
        </div>

        <form onSubmit={handlePasswordChange} className="p-6 space-y-4">
          {/* Current Password */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Current Password *
            </label>
            <div className="relative">
              <input
                type={showPasswords.current ? 'text' : 'password'}
                value={passwordForm.currentPassword}
                onChange={(e) => handlePasswordInputChange('currentPassword', e.target.value)}
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                placeholder="Enter your current password"
                required
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('current')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPasswords.current ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              New Password *
            </label>
            <div className="relative">
              <input
                type={showPasswords.new ? 'text' : 'password'}
                value={passwordForm.newPassword}
                onChange={(e) => handlePasswordInputChange('newPassword', e.target.value)}
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                placeholder="Create a strong password"
                required
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('new')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPasswords.new ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            {/* Password Strength Indicator */}
            {passwordForm.newPassword && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Password Strength:</span>
                  <span className={`font-medium ${strengthInfo.color}`}>
                    {strengthInfo.text}
                  </span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${strengthInfo.bgColor} transition-all duration-300`}
                    style={{ width: `${(getPasswordStrengthScore() / 5) * 100}%` }}
                  />
                </div>
              </div>
            )}

            {/* Password Requirements */}
            <div className="bg-gray-50 rounded-lg p-3 space-y-1">
              <p className="text-xs font-medium text-gray-700 mb-2">Password must contain:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-xs">
                <div className={`flex items-center gap-2 ${passwordValidation.minLength ? 'text-green-600' : 'text-gray-500'}`}>
                  {passwordValidation.minLength ? '✓' : '○'} At least 8 characters
                </div>
                <div className={`flex items-center gap-2 ${passwordValidation.hasUppercase ? 'text-green-600' : 'text-gray-500'}`}>
                  {passwordValidation.hasUppercase ? '✓' : '○'} One uppercase letter
                </div>
                <div className={`flex items-center gap-2 ${passwordValidation.hasLowercase ? 'text-green-600' : 'text-gray-500'}`}>
                  {passwordValidation.hasLowercase ? '✓' : '○'} One lowercase letter
                </div>
                <div className={`flex items-center gap-2 ${passwordValidation.hasNumber ? 'text-green-600' : 'text-gray-500'}`}>
                  {passwordValidation.hasNumber ? '✓' : '○'} One number
                </div>
                <div className={`flex items-center gap-2 ${passwordValidation.hasSpecialChar ? 'text-green-600' : 'text-gray-500'}`}>
                  {passwordValidation.hasSpecialChar ? '✓' : '○'} One special character
                </div>
              </div>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Confirm New Password *
            </label>
            <div className="relative">
              <input
                type={showPasswords.confirm ? 'text' : 'password'}
                value={passwordForm.confirmPassword}
                onChange={(e) => handlePasswordInputChange('confirmPassword', e.target.value)}
                className={`w-full px-4 py-3 pr-12 border rounded-lg focus:ring-2 focus:ring-orange-500 ${
                  passwordForm.confirmPassword && passwordForm.newPassword !== passwordForm.confirmPassword
                    ? 'border-red-300 bg-red-50'
                    : 'border-gray-300'
                }`}
                placeholder="Re-enter your new password"
                required
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('confirm')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPasswords.confirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {passwordForm.confirmPassword && passwordForm.newPassword !== passwordForm.confirmPassword && (
              <p className="text-red-600 text-xs">Passwords do not match</p>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={submitting || !isPasswordStrong() || passwordForm.newPassword !== passwordForm.confirmPassword}
              className="w-full bg-gradient-to-r from-orange-600 to-red-600 text-white py-3 rounded-lg hover:from-orange-700 hover:to-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium transition-all transform hover:scale-[1.02]"
            >
              {submitting ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  Updating Password...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Update Password
                </>
              )}
            </button>
          </div>

          {/* Security Note */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <Shield className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-xs text-blue-800">
                <p className="font-medium mb-1">Security Reminder:</p>
                <ul className="space-y-0.5 text-blue-700">
                  <li>• Never share your password with anyone</li>
                  <li>• Use a unique password you don't use elsewhere</li>
                  <li>• You may need to log in again after changing password</li>
                </ul>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};