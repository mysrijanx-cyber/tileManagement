
import React, { useState } from 'react';
import { Store, Send, CheckCircle, AlertCircle, Mail, Phone, MapPin, User } from 'lucide-react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { validateEmail } from '../lib/firebaseutils';

interface FormData {
  businessName: string;
  ownerName: string;
  email: string;
  phone: string;
  businessAddress: string;
  additionalInfo: string;
}

export const SellerRequestForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    businessName: '',
    ownerName: '',
    email: '',
    phone: '',
    businessAddress: '',
    additionalInfo: ''
  });
  
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [nameError, setNameError] = useState('');

  // ✅ EMAIL VALIDATION
  const validateBusinessEmail = (email: string): { isValid: boolean; error?: string } => {
    if (!email.trim()) {
      return { isValid: false, error: 'Email is required' };
    }
    
    if (!validateEmail(email)) {
      return { isValid: false, error: 'Please enter a valid email address' };
    }
    
    return { isValid: true };
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

  // ✅ OWNER NAME VALIDATION
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

  // ✅ INPUT CHANGE HANDLER
  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (error) setError('');
    
    if (field === 'email') {
      if (emailError) setEmailError('');
      if (value) {
        const validation = validateBusinessEmail(value);
        if (!validation.isValid) {
          setEmailError(validation.error || 'Invalid email');
        }
      }
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
    
    const emailValidation = validateBusinessEmail(formData.email);
    if (!emailValidation.isValid) {
      setEmailError(emailValidation.error || 'Invalid email');
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
  
  if (!validateForm()) return;
  
  setSubmitting(true);
  setError('');

  try {
    console.log('📝 Submitting seller request:', formData);

    // ❌ YE LINES DELETE KARO:
    // const lastSubmit = localStorage.getItem('lastSellerRequest');
    // const now = Date.now();
    // if (lastSubmit && (now - parseInt(lastSubmit)) < 300000) {
    //   const remainingTime = Math.ceil((300000 - (now - parseInt(lastSubmit))) / 60000);
    //   setError(`Please wait ${remainingTime} minute(s) before submitting another request`);
    //   setSubmitting(false);
    //   return;
    // }

    // ✅ DIRECT SUBMISSION
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

    // ❌ YE BHI DELETE KARO:
    // localStorage.setItem('lastSellerRequest', now.toString());

    console.log('✅ Request submitted with ID:', docRef.id);
    setSubmitted(true);
    
  } catch (error: any) {
    console.error('❌ Error submitting request:', error);
    
    if (error.code === 'permission-denied') {
      setError('Submission failed due to security settings. Please contact support.');
    } else {
      setError('Failed to submit request. Please try again.');
    }
  } finally {
    setSubmitting(false);
  }
};

  if (submitted) {
    return (
      <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-xl p-4 sm:p-6 md:p-8 text-center mx-auto max-w-full">
        <CheckCircle className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 text-green-600 mx-auto mb-3 sm:mb-4" />
        <h3 className="text-xl sm:text-2xl md:text-2xl font-bold text-green-800 mb-2 px-2">Request Submitted Successfully!</h3>
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

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden max-w-full">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-green-600 text-white p-4 sm:p-5 md:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
          <Store className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 flex-shrink-0" />
          <div className="w-full sm:w-auto">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold leading-tight">Become a Seller Partner</h2>
            <p className="text-xs sm:text-sm md:text-base text-blue-100 mt-1">Join our platform and showcase your tiles to more customers</p>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-4 sm:p-5 md:p-6 space-y-3 sm:space-y-4">
        {/* Error Messages */}
        {error && (
          <div className="p-2.5 sm:p-3 bg-red-50 border border-red-200 rounded-lg flex items-start sm:items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5 sm:mt-0" />
            <span className="text-red-700 text-xs sm:text-sm">{error}</span>
          </div>
        )}

        {/* Form Fields */}
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
              <p className="text-red-600 text-xs mt-1">{nameError}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-1.5">
              <Mail className="w-3 h-3 sm:w-4 sm:h-4 inline mr-1" />
              Business Email * 
              <span className="block sm:inline text-xs text-gray-500 mt-0.5 sm:mt-0 sm:ml-1">(Login credentials will be sent here)</span>
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border rounded-lg focus:ring-2 focus:ring-blue-500 transition-colors ${
                emailError ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
              placeholder="business@yourcompany.com"
              required
            />
            {emailError && (
              <p className="text-red-600 text-xs mt-1">{emailError}</p>
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
              <p className="text-red-600 text-xs mt-1">{phoneError}</p>
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
          disabled={submitting || !!emailError || !!phoneError || !!nameError}
          className="w-full bg-gradient-to-r from-blue-600 to-green-600 text-white py-3 sm:py-3.5 md:py-4 rounded-lg hover:from-blue-700 hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-medium text-base sm:text-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] touch-manipulation"
        >
          {submitting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-white"></div>
              <span className="text-sm sm:text-base md:text-lg">Submitting Request...</span>
            </>
          ) : (
            <>
              <Send className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="text-sm sm:text-base md:text-lg">Submit Seller Request</span>
            </>
          )}
        </button>

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
