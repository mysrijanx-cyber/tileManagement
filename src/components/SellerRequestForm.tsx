
import React, { useState, useEffect } from 'react';
import { Store, Send, CheckCircle, AlertCircle, Mail, Phone, MapPin, User, Loader2 } from 'lucide-react';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';

interface FormData {
  businessName: string;
  ownerName: string;
  email: string;
  phone: string;
  businessAddress: string;
  additionalInfo: string;
}

export const SellerRequestForm: React.FC = () => {
  // ✅ FORM DATA
  const [formData, setFormData] = useState<FormData>({
    businessName: '',
    ownerName: '',
    email: '',
    phone: '',
    businessAddress: '',
    additionalInfo: ''
  });
  
  // ✅ SUBMISSION STATES
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  
  // ✅ VALIDATION ERRORS
  const [emailError, setEmailError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [nameError, setNameError] = useState('');

  // ✅ EMAIL CHECK STATES (ADMIN PATTERN)
  const [checkingEmail, setCheckingEmail] = useState<boolean>(false);
  const [emailExists, setEmailExists] = useState<boolean>(false);
  const [emailCheckMessage, setEmailCheckMessage] = useState<string>('');

  // ✅ EMAIL VALIDATION (ADMIN PATTERN)
  const validateEmail = (email: string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  // ✅ PHONE VALIDATION
  const validatePhone = (phone: string): { isValid: boolean; error?: string } => {
    const cleaned = phone.replace(/\D/g, '');
    
    if (!cleaned) {
      return { isValid: false, error: 'Phone number is required' };
    }
    
    if (cleaned.length !== 10) {
      return { isValid: false, error: 'Phone must be exactly 10 digits' };
    }
    
    if (!/^[6-9]/.test(cleaned)) {
      return { isValid: false, error: 'Phone must start with 6, 7, 8, or 9' };
    }
    
    return { isValid: true };
  };

  // ✅ NAME VALIDATION
  const validateOwnerName = (name: string): { isValid: boolean; error?: string } => {
    if (!name.trim()) {
      return { isValid: false, error: 'Owner name is required' };
    }
    
    if (name.trim().length < 2) {
      return { isValid: false, error: 'Name must be at least 2 characters' };
    }
    
    if (/\d/.test(name)) {
      return { isValid: false, error: 'Name cannot contain numbers' };
    }
    
    if (!/^[a-zA-Z\s]+$/.test(name)) {
      return { isValid: false, error: 'Name can only contain letters and spaces' };
    }
    
    return { isValid: true };
  };

  // ✅ CHECK EMAIL IN DATABASE (ADMIN PATTERN - WORKING)
  const checkEmailExists = async (email: string): Promise<void> => {
    console.log('🔍 [EMAIL CHECK] Starting for:', email);

    if (!email || !validateEmail(email)) {
      console.log('⏭️ [EMAIL CHECK] Skipped - invalid format');
      setEmailExists(false);
      setEmailCheckMessage('');
      return;
    }

    if (email.length < 5) {
      console.log('⏭️ [EMAIL CHECK] Skipped - too short');
      setEmailExists(false);
      setEmailCheckMessage('');
      return;
    }

    setCheckingEmail(true);
    setEmailCheckMessage('🔍 Checking database...');
    console.log('⏳ [EMAIL CHECK] Checking database...');

    try {
      const emailToCheck = email.toLowerCase().trim();
      console.log('📧 [EMAIL CHECK] Normalized:', emailToCheck);

      // CHECK 1: Sellers collection
      console.log('1️⃣ Checking sellers...');
      const sellersQuery = query(
        collection(db, 'sellers'),
        where('email', '==', emailToCheck)
      );
      const sellersSnapshot = await getDocs(sellersQuery);
      console.log('✅ Sellers check done. Found:', sellersSnapshot.size);

      if (sellersSnapshot.size > 0) {
        console.log('❌ Email EXISTS in sellers');
        setEmailExists(true);
        setEmailCheckMessage('❌ Email found in database - Already registered as seller');
        setEmailError('This email is already in use');
        setCheckingEmail(false);
        return;
      }

      // CHECK 2: Users collection
      console.log('2️⃣ Checking users...');
      try {
        const usersQuery = query(
          collection(db, 'users'),
          where('email', '==', emailToCheck)
        );
        const usersSnapshot = await getDocs(usersQuery);
        console.log('✅ Users check done. Found:', usersSnapshot.size);

        if (usersSnapshot.size > 0) {
          console.log('❌ Email EXISTS in users');
          setEmailExists(true);
          setEmailCheckMessage('❌ Email found in database - Already registered');
          setEmailError('This email is already in use');
          setCheckingEmail(false);
          return;
        }
      } catch (userError) {
        console.log('⚠️ Users check skipped');
      }

      // CHECK 3: Seller Requests
      console.log('3️⃣ Checking seller requests...');
      try {
        const requestsQuery = query(
          collection(db, 'sellerRequests'),
          where('email', '==', emailToCheck)
        );
        const requestsSnapshot = await getDocs(requestsQuery);
        console.log('✅ Requests check done. Found:', requestsSnapshot.size);

        if (requestsSnapshot.size > 0) {
          const existingRequest = requestsSnapshot.docs[0].data();
          const status = existingRequest.status;
          console.log('📋 Existing request status:', status);

          if (status === 'pending') {
            console.log('⏳ Email has PENDING request');
            setEmailExists(true);
            setEmailCheckMessage('⏳ Request already submitted with this email');
            setEmailError('A request with this email is pending');
            setCheckingEmail(false);
            return;
          } else if (status === 'approved') {
            console.log('✅ Email APPROVED');
            setEmailExists(true);
            setEmailCheckMessage('✅ Email already approved - Account exists');
            setEmailError('This email already has an account');
            setCheckingEmail(false);
            return;
          } else if (status === 'rejected') {
            console.log('❌ Previous request REJECTED - can reapply');
            setEmailExists(false);
            setEmailCheckMessage('⚠️ Previous request rejected - You can reapply');
            setEmailError('');
            setCheckingEmail(false);
            return;
          }
        }
      } catch (requestError) {
        console.log('⚠️ Requests check skipped');
      }

      // EMAIL AVAILABLE
      console.log('✅ Email AVAILABLE');
      setEmailExists(false);
      setEmailCheckMessage('✅ Email not registered - You can submit request');
      setEmailError('');

    } catch (error) {
      console.error('❌ [EMAIL CHECK] Error:', error);
      setEmailCheckMessage('⚠️ Could not verify email - Please try again');
      setEmailExists(false);
    } finally {
      setCheckingEmail(false);
      console.log('🏁 [EMAIL CHECK] Completed');
    }
  };

  // ✅ DEBOUNCED EMAIL CHECK (ADMIN PATTERN)
  useEffect(() => {
    console.log('🔄 [EFFECT] Email changed:', formData.email);

    if (!formData.email) {
      console.log('⏭️ [EFFECT] Email empty - reset');
      setEmailExists(false);
      setEmailCheckMessage('');
      setEmailError('');
      return;
    }

    if (!validateEmail(formData.email)) {
      console.log('⏭️ [EFFECT] Invalid format - skip');
      setEmailExists(false);
      setEmailCheckMessage('');
      return;
    }

    console.log('⏰ [EFFECT] Setting 500ms timer...');
    const timer = setTimeout(() => {
      console.log('⏰ [EFFECT] Timer fired! Checking email...');
      checkEmailExists(formData.email);
    }, 500);

    return () => {
      console.log('🧹 [EFFECT] Cleanup timer');
      clearTimeout(timer);
    };
  }, [formData.email]);

  // ✅ INPUT CHANGE HANDLER
  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (error) setError('');
    
    if (field === 'email') {
      setEmailCheckMessage('');
      setEmailExists(false);
      if (emailError) setEmailError('');
    }
    
    if (field === 'phone') {
      if (phoneError) setPhoneError('');
      if (value) {
        const validation = validatePhone(value);
        if (!validation.isValid) {
          setPhoneError(validation.error || 'Invalid phone');
        }
      }
    }
    
    if (field === 'ownerName') {
      if (nameError) setNameError('');
      if (value) {
        const validation = validateOwnerName(value);
        if (!validation.isValid) {
          setNameError(validation.error || 'Invalid name');
        }
      }
    }
  };

  // ✅ FORM VALIDATION
  const validateForm = (): boolean => {
    if (!formData.businessName.trim()) {
      setError('Business name is required');
      return false;
    }
    
    const nameValidation = validateOwnerName(formData.ownerName);
    if (!nameValidation.isValid) {
      setNameError(nameValidation.error || 'Invalid name');
      return false;
    }
    
    if (!validateEmail(formData.email)) {
      setEmailError('Please enter a valid email');
      return false;
    }

    if (emailExists) {
      setError('Cannot submit - Email already registered');
      return false;
    }
    
    const phoneValidation = validatePhone(formData.phone);
    if (!phoneValidation.isValid) {
      setPhoneError(phoneValidation.error || 'Invalid phone');
      return false;
    }
    
    if (!formData.businessAddress.trim()) {
      setError('Business address is required');
      return false;
    }
    
    return true;
  };

  // ✅ FORM SUBMIT
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('📝 [SUBMIT] Form submit triggered');

    if (emailExists) {
      console.log('❌ [SUBMIT] Blocked - email exists');
      alert('❌ Cannot Submit!\n\nThis email is already registered or has a pending request.');
      return;
    }

    if (checkingEmail) {
      console.log('⏳ [SUBMIT] Blocked - still checking email');
      alert('⏳ Please wait...\n\nEmail verification in progress.');
      return;
    }
    
    if (!validateForm()) {
      console.log('❌ [SUBMIT] Validation failed');
      return;
    }
    
    setSubmitting(true);
    setError('');

    try {
      console.log('📤 [SUBMIT] Submitting to Firestore...');

      const docRef = await addDoc(collection(db, 'sellerRequests'), {
        businessName: formData.businessName.trim(),
        ownerName: formData.ownerName.trim(),
        email: formData.email.toLowerCase().trim(),
        phone: formData.phone.replace(/\D/g, ''),
        businessAddress: formData.businessAddress.trim(),
        additionalInfo: formData.additionalInfo.trim() || null,
        status: 'pending',
        requestedAt: new Date().toISOString(),
        adminNotes: null,
        reviewedAt: null,
        reviewedBy: null,
        emailDeliveryStatus: null,
        accountCreated: false
      });

      console.log('✅ [SUBMIT] Success! ID:', docRef.id);
      setSubmitted(true);
      
    } catch (error: any) {
      console.error('❌ [SUBMIT] Error:', error);
      
      if (error.code === 'permission-denied') {
        setError('Permission denied. Please contact support.');
      } else {
        setError('Failed to submit. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  // ✅ SUCCESS SCREEN
  if (submitted) {
    return (
      <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-xl p-4 sm:p-6 md:p-8 text-center mx-auto max-w-full">
        <CheckCircle className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 text-green-600 mx-auto mb-3 sm:mb-4" />
        <h3 className="text-xl sm:text-2xl md:text-2xl font-bold text-green-800 mb-2 px-2">
          Request Submitted Successfully!
        </h3>
        <p className="text-sm sm:text-base text-green-700 mb-4 px-2">
          Thank you <strong className="break-words">{formData.ownerName}</strong> for your interest in joining our platform.
        </p>
        <div className="bg-white rounded-lg p-3 sm:p-4 text-left max-w-md mx-auto">
          <h4 className="font-semibold text-gray-800 mb-2 text-sm sm:text-base">📋 What happens next?</h4>
          <ul className="text-xs sm:text-sm text-gray-600 space-y-1 sm:space-y-1.5">
            <li>• Our team will review your application</li>
            <li>• Verification process: 2-3 business days</li>
            <li className="break-all">• You'll receive email updates at: <strong>{formData.email}</strong></li>
            <li>• If approved, you'll get login credentials immediately</li>
          </ul>
        </div>
        <p className="text-xs sm:text-sm text-gray-500 mt-3 sm:mt-4">
          Reference ID: REQ-{Date.now().toString().slice(-6)}
        </p>
      </div>
    );
  }

  // ✅ FORM UI
  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden max-w-full">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-green-600 text-white p-4 sm:p-5 md:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
          <Store className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 flex-shrink-0" />
          <div className="w-full sm:w-auto">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold leading-tight">
              Become a Seller Partner
            </h2>
            <p className="text-xs sm:text-sm md:text-base text-blue-100 mt-1">
              Join our platform and showcase your tiles to more customers
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-4 sm:p-5 md:p-6 space-y-3 sm:space-y-4">
        {/* Global Error */}
        {error && (
          <div className="p-2.5 sm:p-3 bg-red-50 border border-red-200 rounded-lg flex items-start sm:items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5 sm:mt-0" />
            <span className="text-red-700 text-xs sm:text-sm">{error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
          {/* Business Name */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-1.5">
              <Store className="w-3 h-3 sm:w-4 sm:h-4 inline mr-1" />
              Business Name *
            </label>
            <input
              type="text"
              value={formData.businessName}
              onChange={(e) => handleInputChange('businessName', e.target.value)}
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="e.g. ABC Tiles & Ceramics"
              required
            />
          </div>

          {/* Owner Name */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-1.5">
              <User className="w-3 h-3 sm:w-4 sm:h-4 inline mr-1" />
              Owner Name *
            </label>
            <input
              type="text"
              value={formData.ownerName}
              onChange={(e) => handleInputChange('ownerName', e.target.value)}
              className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border rounded-lg focus:ring-2 focus:ring-blue-500 transition-colors ${
                nameError ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
              placeholder="e.g. John Doe"
              required
            />
            {nameError && (
              <p className="text-red-600 text-xs mt-1">⚠️ {nameError}</p>
            )}
          </div>

          {/* ✅ EMAIL WITH CHECK (ADMIN PATTERN) */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-1.5">
              <Mail className="w-3 h-3 sm:w-4 sm:h-4 inline mr-1" />
              Business Email * 
              <span className="block sm:inline text-xs text-gray-500 mt-0.5 sm:mt-0 sm:ml-1">
                (Login credentials will be sent here)
              </span>
            </label>
            <div className="relative">
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 pr-10 text-sm sm:text-base border rounded-lg focus:ring-2 transition-colors ${
                  checkingEmail 
                    ? 'border-blue-500 focus:ring-blue-500' 
                    : emailExists 
                    ? 'border-red-500 focus:ring-red-500 bg-red-50' 
                    : emailCheckMessage && !emailExists && !emailError
                    ? 'border-green-500 focus:ring-green-500 bg-green-50'
                    : emailError 
                    ? 'border-red-300 bg-red-50 focus:ring-red-500' 
                    : 'border-gray-300 focus:ring-blue-500'
                }`}
                placeholder="business@yourcompany.com"
                required
              />
              
              {/* Status Icon */}
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                {checkingEmail && (
                  <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
                )}
                {!checkingEmail && emailCheckMessage && !emailExists && !emailError && (
                  <span className="text-green-600 text-xl font-bold">✓</span>
                )}
                {!checkingEmail && emailExists && (
                  <span className="text-red-600 text-xl font-bold">✕</span>
                )}
              </div>
            </div>
            
            {/* Format Error */}
            {emailError && !checkingEmail && !emailCheckMessage && (
              <p className="text-red-600 text-xs mt-1">⚠️ {emailError}</p>
            )}
            
            {/* Check Message */}
            {emailCheckMessage && (
              <div className={`mt-2 p-2 rounded-lg text-xs ${
                checkingEmail ? 'bg-blue-50 border border-blue-200' :
                emailExists ? 'bg-red-50 border border-red-200' : 
                'bg-green-50 border border-green-200'
              }`}>
                <p className={`font-medium ${
                  checkingEmail ? 'text-blue-700' :
                  emailExists ? 'text-red-700' : 
                  'text-green-700'
                }`}>
                  {emailCheckMessage}
                </p>
                {emailExists && (
                  <p className="text-red-600 mt-1">
                    💡 Please use a different email or contact support.
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-1.5">
              <Phone className="w-3 h-3 sm:w-4 sm:h-4 inline mr-1" />
              Phone Number *
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border rounded-lg focus:ring-2 focus:ring-blue-500 transition-colors ${
                phoneError ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
              placeholder="9876543210"
              maxLength={10}
              required
            />
            {phoneError && (
              <p className="text-red-600 text-xs mt-1">⚠️ {phoneError}</p>
            )}
          </div>
        </div>
        
        {/* Address */}
        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-1.5">
            <MapPin className="w-3 h-3 sm:w-4 sm:h-4 inline mr-1" />
            Business Address *
          </label>
          <textarea
            value={formData.businessAddress}
            onChange={(e) => handleInputChange('businessAddress', e.target.value)}
            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
            rows={3}
            placeholder="Complete business address with city, state, pincode"
            required
          />
        </div>
        
        {/* Additional Info */}
        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-1.5">
            Tell us about your tile business (optional)
          </label>
          <textarea
            value={formData.additionalInfo}
            onChange={(e) => handleInputChange('additionalInfo', e.target.value)}
            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
            rows={3}
            placeholder="Years in business, specialties, customer base, etc."
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={
            submitting || 
            checkingEmail || 
            emailExists || 
            !!emailError || 
            !!phoneError || 
            !!nameError
          }
          className="w-full bg-gradient-to-r from-blue-600 to-green-600 text-white py-3 sm:py-3.5 md:py-4 rounded-lg hover:from-blue-700 hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium text-base sm:text-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] touch-manipulation"
        >
          {submitting ? (
            <>
              <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
              <span className="text-sm sm:text-base md:text-lg">Submitting Request...</span>
            </>
          ) : checkingEmail ? (
            <>
              <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
              <span className="text-sm sm:text-base md:text-lg">Verifying Email...</span>
            </>
          ) : emailExists ? (
            <span className="text-sm sm:text-base md:text-lg">❌ Cannot Submit - Email Already Registered</span>
          ) : (
            <>
              <Send className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="text-sm sm:text-base md:text-lg">Submit Seller Request</span>
            </>
          )}
        </button>

        {/* Status Footer */}
        <div className="text-center text-xs sm:text-sm font-medium">
          {checkingEmail && (
            <p className="text-blue-600">🔍 Verifying email availability in database...</p>
          )}
          
          {emailExists && !checkingEmail && (
            <p className="text-red-600">
              ❌ This email is already registered. Request cannot be submitted.
            </p>
          )}
          
          {!emailExists && emailCheckMessage && !checkingEmail && !emailError && (
            <p className="text-green-600">
              ✅ Email verified - Not registered in database. You can proceed.
            </p>
          )}
        </div>

        {/* Help Text */}
        <div className="bg-gray-50 rounded-lg p-3 sm:p-4 text-xs sm:text-sm text-gray-600">
          <p className="font-medium text-gray-800 mb-2 text-sm sm:text-base">✨ Why join our platform?</p>
          <ul className="space-y-1 sm:space-y-1.5">
            <li>• Reach customers with 3D tile visualization</li>
            <li>• Analytics to track tile performance</li>
            <li>• Easy inventory management</li>
            <li>• QR code integration for physical stores</li>
            <li>• Professional seller dashboard</li>
          </ul>
        </div>
      </form>
    </div>
  );
};